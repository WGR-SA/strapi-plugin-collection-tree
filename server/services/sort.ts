import { Strapi } from '@strapi/strapi'
import treeTransformer from '../utils/treeTransformer'
import { getPluginService } from '../utils/serviceGetter'

import type { SortItem, TreeItem } from '../../types'


export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(key: string, locale?: string | null, sorted = true) {
    const settings = await getPluginService('settings')?.getSettings()
    const conditions = { sort: { [settings.fieldname["lft"]]: 'ASC' }, populate: settings.fieldname["parent"] }
    if (locale) conditions["locale"] = locale

    const data = await strapi.entityService.findMany(`api::${key}.${key}`, conditions)        
    
    data.map((entry: any) => entry.parent = (entry[settings.fieldname["parent"]]) ? entry[settings.fieldname["parent"]]?.id : null)
    
    return (sorted) ? treeTransformer().treeToSort(data) : data
  },
  async updateEntries(data: { key: string, entries: SortItem[] }, sorted: boolean = true) {
    const settings = await getPluginService('settings')?.getSettings()
    const displayField = await getPluginService('models')?.getDisplayField(data.key)
    const list = await getPluginService('sort')?.getEntries(data.key, null, false)

    if (data.entries.length === 0) {
      data.entries = list
    }    

    const tree = (sorted) ? treeTransformer().sortToTree(data.entries) : data.entries

    // Set Tree name
    tree.map((entry: TreeItem) => {
      let name = ''
      let parent = entry.parent
      while (parent !== null) {
        const parentEntry = list.find((item: TreeItem) => item.id === parent)
        if (parentEntry) {
          name = `${parentEntry[displayField]} > ${name}`
          parent = parentEntry.parent
        } else {
          parent = null
        }
      }
      
      const item = list.find((item: TreeItem) => item.id === entry.id)
      entry.tree = `${name}${item[displayField]}`

      return entry
    })

    tree.forEach(async (entry: TreeItem) => {
      // TODO don't trigger beforeUpdate lifecycle
      await strapi.db.query(`api::${data.key}.${data.key}`).update({
        where: { id: entry.id, },
        data: { 
          [settings.fieldname["lft"]]: entry.lft, 
          [settings.fieldname["rght"]]: entry.rght, 
          [settings.fieldname["parent"]]: entry.parent, 
          [settings.fieldname["tree"]]: entry.tree, 
          primary: false 
        }
      })
    })    
  },
  async updateOnCreate(model: string, data: any) {    
    const settings = await getPluginService('settings')?.getSettings()
    const items = await getPluginService('sort')?.getEntries(model, data.locale ?? null, false)

    if (data.parent.connect.length === 0) {
      const lastItem = items[items.length - 1]

      data[settings.fieldname["lft"]] = lastItem[settings.fieldname["rght"]] + 1
      data[settings.fieldname["rght"]] = lastItem[settings.fieldname["rght"]] + 2
    } else {
      const parentId = data[settings.fieldname["parent"]].connect[0].id
      const parent = items.find((item: any) => item.id === parentId)
      if (!parent) return

      // place new item in tree
      data[settings.fieldname["lft"]] = parent[settings.fieldname["rght"]]
      data[settings.fieldname["rght"]] = parent[settings.fieldname["rght"]] + 1

      // make place for new item
      const newData = items.map((item: any) => {
        if (item.id === parentId) {
          item[settings.fieldname["rght"]] += 2
        }
        if (item[settings.fieldname["lft"]] > data[settings.fieldname["lft"]]) {
          item[settings.fieldname["lft"]] += 2
          item[settings.fieldname["rght"]] += 2
        }
        return item
      })

      await getPluginService('sort')?.updateEntries({ key: model, entries: newData }, false)
    }  

    return data

  },
  async updateOnUpdate(model: string, data: any) {
    // TODO Update tree if parent has changed
  },
  async updateOnDelete(model: string) {
    if (!model) return
    const items = await getPluginService('sort')?.getEntries(model)
    if ( items.length === 0 ) return
    await getPluginService('sort')?.updateEntries({ key: model, entries: items })    
  }
})