import { Strapi } from '@strapi/strapi'
import treeTransformer from '../utils/treeTransformer'
import { getPluginService } from '../utils/serviceGetter'

import type { SortItem, TreeItem } from '../../types'


export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(key: string, locale?: string | null) {
    const settings = await getPluginService('settings')?.getSettings()
    const conditions = { sort: { [settings.fieldname["lft"]]: 'ASC' }, populate: settings.fieldname["parent"] }
    if (locale) conditions["locale"] = locale

    const data = await strapi.entityService.findMany(`api::${key}.${key}`, conditions)        
    
    data.map((entry: any) => entry.parent = (entry[settings.fieldname["parent"]]) ? entry[settings.fieldname["parent"]]?.id : null)
    
    return treeTransformer().treeToSort(data)
  },
  async updateEntries(data: { key: string, entries: SortItem[] }, sorted: boolean = true) {
    const settings = await getPluginService('settings')?.getSettings()

    if (data.entries.length === 0) {
      data.entries = await getPluginService('sort')?.getEntries(data.key)
    }

    const tree = (sorted) ? treeTransformer().sortToTree(data.entries) : data.entries

    tree.forEach(async (entry: TreeItem) => {
      await strapi.db.query(`api::${data.key}.${data.key}`).update({
        where: { id: entry.id, },
        data: { [settings.fieldname["lft"]]: entry.lft, [settings.fieldname["rght"]]: entry.rght, [settings.fieldname["parent"]]: entry.parent, primary: false }
      })
    })    
  },
  async updateOnCreate(model: string, data: any) {    
    const settings = await getPluginService('settings')?.getSettings()
    const items = await getPluginService('sort')?.getEntries(model, data.locale ?? null)

    if (data.parent.connect.length === 0) {
      const lastItem = items[items.length - 1]

      data[settings.fieldname["lft"]] = lastItem[settings.fieldname["rght"]] + 1
      data[settings.fieldname["rght"]] = lastItem[settings.fieldname["rght"]] + 2
    } else {
      const parentId = data.parent.connect[0].id
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

  }
})