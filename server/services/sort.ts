import { Strapi } from '@strapi/strapi';
import treeTransformer from '../utils/treeTransformer'

import type { SortItem } from '../../types'

const pluginPath = 'plugin::strapi-plugin-collection-tree'

export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(key: string) {
    const settings = await strapi.service(`${pluginPath}.settings`)?.getSettings()
    const data = await strapi.entityService.findMany(`api::${key}.${key}`, { sort: { [settings.attributes["lft"]]: 'ASC' }, populate: settings.attributes["parent"] })
    
    data.map((entry: any) => entry.parent = (entry[settings.attributes["parent"]]) ? entry[settings.attributes["parent"]].id : null)
    
    return treeTransformer().treeToSort(data)
  },
  async updateEntries(data: { key: string, entries: SortItem[] }) {
    const settings = await strapi.service(`${pluginPath}.settings`)?.getSettings()

    if (data.entries.length === 0) {
      data.entries = await strapi.service(`${pluginPath}.sort`)?.getEntries(data.key)
    }

    const tree = treeTransformer().sortToTree(data.entries)

    tree.forEach(async (entry: any) => {
      await strapi.db.query(`api::${data.key}.${data.key}`).update({
        where: { id: entry.id, },
        data: { [settings.attributes["lft"]]: entry.lft, [settings.attributes["rght"]]: entry.rght, [settings.attributes["parent"]]: entry.parent }
      });
    })
  },
});