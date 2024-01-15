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

    //@ts-ignore
    const data: any = await strapi.entityService.findMany(`api::${key}.${key}`, conditions)        
    
    data.map((entry: any) => entry.parent = (entry[settings.fieldname["parent"]]) ? entry[settings.fieldname["parent"]]?.id : null)
    
    return (sorted) ? treeTransformer().treeToSort(data) : data
  },
  async updateEntries(data: { key: string, entries: SortItem[], locale: string | null }, sorted: boolean = true) {
    const settings = await getPluginService('settings')?.getSettings()
    const displayField = await getPluginService('models')?.getDisplayField(data.key)
    const list = await getPluginService('sort')?.getEntries(data.key, data.locale, false)
    const { lft, rght, parent, tree } = settings.fieldname    

    if (data.entries.length === 0) {
      data.entries = list
    }    

    const treeData = (sorted) ? treeTransformer().sortToTree(data.entries) : data.entries    

    // Set Tree name
    treeData.map((entry: TreeItem) => {      
      const item = list.find((item: TreeItem) => item.id === entry.id)
      entry.tree = getPluginService('sort')?.getTreeName(item, list, displayField)

      return entry
    })

    treeData.forEach(async (entry: TreeItem) => {
      // TODO don't trigger beforeUpdate lifecycle
      //@ts-ignore
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
    const items = await getPluginService('sort')?.getEntries(model, data.locale ?? null, false)
    const { lft, rght, parent } = settings.fieldname

    if (items.length === 0) {
      return getPluginService('sort')?.hangItem(data, settings, data[displayField], 0)
    } 
    if (data.parent.connect.length === 0) {
      return getPluginService('sort')?.hangItem(data, settings, data[displayField], items[items.length - 1].lft)
    } else {
      const parentId = data[parent].connect[0].id
      const parentItem = items.find((item: any) => item.id === parentId)
      if (!parentItem) return

      const treeName = getPluginService('sort')?.getTreeName(getPluginService('sort')?.mapDataToTreeItem(data, settings), items, displayField)
      data = getPluginService('sort')?.hangItem(data, settings, treeName, parentItem[rght] - 1)
    
      const updatedItems = getPluginService('sort')?.pushItems(items, settings, parentId, data[lft])
      await getPluginService('sort')?.updateEntries({ key: model, entries: updatedItems, locale: data.locale ?? null }, false)
    }  

    return data
  },
  async updateOnUpdate(model: string, data: any) {
    const settings = await getPluginService('settings')?.getSettings()
    const displayField = await getPluginService('models')?.getDisplayField(model)
    const items = await getPluginService('sort')?.getEntries(model, data.locale ?? null, false)
    const item = items.find((item: any) => item.id === data.id)
    const { lft, rght, parent } = settings.fieldname    

    if (data[parent]?.connect?.length > 0) {
      if (data[parent].connect[0].id !== item[parent].id) {
        const parentId = data[parent].connect[0].id
        const parentItem = items.find((item: any) => item.id === parentId)
        if (!parentItem) return

        const treeName = getPluginService('sort')?.getTreeName(getPluginService('sort')?.mapDataToTreeItem(data, settings), items, displayField)
        data = getPluginService('sort')?.hangItem(data, settings, treeName, parentItem[rght] - 1)

        const updatedItems = getPluginService('sort')?.pushItems(items, settings, parentId, data[lft])
        await getPluginService('sort')?.updateEntries({ key: model, entries: updatedItems, locale: data.locale ?? null }, false)
      }
    }

    return data
  },
  async updateOnDelete(model: string) {
    if (!model) return
    const items = await getPluginService('sort')?.getEntries(model)
    if ( items.length === 0 ) return
    await getPluginService('sort')?.updateEntries({ key: model, entries: items })    
  },
  hangItem (data: any, settings: any, treeName: string, base: number = 0) {
    const { lft, rght } = settings.fieldname
    
    data[lft] = base + 1
    data[rght] = base + 2
    data.tree = treeName

    return data
  },
  pushItems(items: any[], settings: any, parentId: number, base: number = 0) {
    const { lft, rght } = settings.fieldname
    return items.map((item: any) => {
      if (item.id === parentId) {
        item[rght] += 2
      }
      if (item[lft] > base) {
        item[lft] += 2
        item[rght] += 2
      }
      return item
    })
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