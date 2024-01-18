import { Strapi } from '@strapi/strapi'
import treeTransformer from '../utils/treeTransformer'
import { getPluginService } from '../utils/serviceGetter'

import type { SortItem, TreeItem } from '../../types'


export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(key: string, locale?: string | null, sorted = true) {
    const settings = await getPluginService('settings')?.getSettings()
    const { lft, rght, parent, tree } = settings.fieldname
    const conditions = { sort: { [lft]: 'ASC' }, populate: parent }
    if (locale) conditions["locale"] = locale

    const data: any = await strapi.entityService.findMany(`api::${key}.${key}`, conditions)        
    
    data.map((entry: any) => entry.parent = (entry[settings.fieldname["parent"]]) ? entry[settings.fieldname["parent"]]?.id : null)
    
    return (sorted) ? treeTransformer().treeToSort(data) : data
  },
  async updateEntries(data: { key: string, entries: SortItem[], locale: string | null }, sorted: boolean = true) {
    const settings = await getPluginService('settings')?.getSettings()
    const displayField = await getPluginService('models')?.getDisplayField(data.key)
    const list = await this.getEntries(data.key, data.locale, false)
    const { lft, rght, parent, tree } = settings.fieldname    

    if (data.entries.length === 0) {
      data.entries = list
    }    

    const treeData = (sorted) ? treeTransformer().sortToTree(data.entries) : data.entries    

    // Set Tree name
    treeData.map((entry: TreeItem) => {      
      const item = list.find((item: TreeItem) => item.id === entry.id)
      entry.tree = this.getTreeName(item, list, displayField)

      return entry
    })

    treeData.forEach(async (entry: TreeItem) => {
      await strapi.db.query(`api::${data.key}.${data.key}`).update({
        where: { id: entry.id, },
        data: { 
          [lft]: entry.lft, 
          [rght]: entry.rght, 
          [parent]: entry.parent, 
          [tree]: entry.tree, 
          primary: false 
        }
      })
    })    
  },
  async updateOnCreate(model: string, data: any) {        
    const settings = await getPluginService('settings')?.getSettings()
    const displayField = await getPluginService('models')?.getDisplayField(model)
    const items = await this.getEntries(model, data.locale ?? null, false)
    const { lft, rght, tree } = settings.fieldname

    // Push data to tree and sort
    items.push(this.mapDataToTreeItem(data, settings))
    const sortedItems = treeTransformer().treeToSort(items)
    let treeData = treeTransformer().sortToTree(sortedItems)

    // extract tree position and update data
    const treeItem = treeData.find((item: any) => item.id === data.id)
    data[lft] = treeItem?.lft
    data[rght] = treeItem?.rght
    data[tree] = this.getTreeName(this.mapDataToTreeItem(data, settings), items, displayField)
    
    // Update other tree items
    await this.updateEntries({ key: model, entries: treeData.filter((item) => item.id !== data.id), locale: data.locale ?? null }, false)

    return data
  },
  async updateOnUpdate(model: string, data: any, locale?: string | null) {
    
    const settings = await getPluginService('settings')?.getSettings()    
    const displayField = await getPluginService('models')?.getDisplayField(model)
    const items = await this.getEntries(model, locale, false)
    const item = items.find((item: any) => item.id === data.id)
    const { lft, rght, parent, tree } = settings.fieldname
    
    if (data[parent]?.connect?.length > 0) {
      if (data[parent].connect[0].id !== item[parent]?.id) {

        // Push data to tree and sort
        const treeItems = items.filter((item: any) => item.id != data.id)
        treeItems.push(this.mapDataToTreeItem(data, settings))
        const sortedItems = treeTransformer().treeToSort(treeItems)
        let treeData = treeTransformer().sortToTree(sortedItems)

        // extract tree position and update data
        const treeItem = treeData.find((item: any) => item.id === data.id)        
        data[lft] = treeItem?.lft
        data[rght] = treeItem?.rght
        data[tree] = this.getTreeName(this.mapDataToTreeItem(data, settings), items, displayField)        

        // Update other tree items
        await this.updateEntries({ key: model, entries: treeData.filter((item) => item.id != data.id), locale: locale }, false)
      }
    }

    return data
  },
  async updateOnDelete(model: string, data: any) {
    if (!model) return
    const items = await this.getEntries(model, data.locale ?? null)
    if ( items.length === 0 ) return
    await this.updateEntries({ key: model, entries: items })    
  },
  mapDataToTreeItem(entry: any, settings: any) {
    const { lft, rght, parent, tree } = settings.fieldname
    return {
      ...entry,
      id: entry.id,
      lft: entry[lft],
      rght: entry[rght],
      parent: entry[parent]?.connect?.length > 0 ? entry[parent].connect[0].id : null,
      tree: entry[tree]
    }
  },
  getTreeName (entry: TreeItem, list: TreeItem[], displayField: string) {
    let name = ''        
    let parent = entry?.parent ?? null
    
    while ( parent !== null) {
      const parentEntry = list.find((item: TreeItem) => item.id === parent)
      if (parentEntry) {
        name = `${parentEntry[displayField]} > ${name}`
        parent = parentEntry.parent
      } else {
        parent = null
      }
    }
    
    return `${name}${entry[displayField]}`
  }
})