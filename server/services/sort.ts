import { Strapi } from '@strapi/strapi';
import treeTransformer from '../utils/treeTransformer'
import { getPluginService } from '../utils/serviceGetter'

import type { SortItem, CollectionTreeConfig } from '../../types'


export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(key: string, locale?: string | null) {
    const settings = await getPluginService('settings')?.getSettings()
    const conditions = { sort: { [settings.fieldname["lft"]]: 'ASC' }, populate: settings.fieldname["parent"] }
    if (locale) conditions["locale"] = locale

    const data = await strapi.entityService.findMany(`api::${key}.${key}`, conditions)    
    
    data.map((entry: any) => entry.parent = (entry[settings.fieldname["parent"]]) ? entry[settings.fieldname["parent"]].id : null)
    
    return treeTransformer().treeToSort(data)
  },
  async updateEntries(data: { key: string, entries: SortItem[] }) {
    const settings = await getPluginService('settings')?.getSettings()

    if (data.entries.length === 0) {
      data.entries = await getPluginService('sort')?.getEntries(data.key)
    }

    const tree = treeTransformer().sortToTree(data.entries)

    tree.forEach(async (entry: any) => {
      await strapi.db.query(`api::${data.key}.${data.key}`).update({
        where: { id: entry.id, },
        data: { [settings.fieldname["lft"]]: entry.lft, [settings.fieldname["rght"]]: entry.rght, [settings.fieldname["parent"]]: entry.parent }
      });
    })
  },
});