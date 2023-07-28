import { Strapi } from '@strapi/strapi';
import treeTransformer from '../utils/treeTransformer'

import type { SortItem } from '../../types'

export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(key: string) {
    const data = await strapi.entityService.findMany(`api::${key}.${key}`, { sort: { lft: 'ASC' } })

    return treeTransformer().treeToSort(data)
  },
  async updateEntries(data: { key: string, entries: SortItem[] }) {
    const tree = treeTransformer().sortToTree(data.entries)

    tree.forEach(async (entry: any) => {
      await strapi.db.query(`api::${data.key}.${data.key}`).update({
        where: { id: entry.id, },
        data: { lft: entry.lft, rght: entry.rght, parent_id: entry.parent_id }
      });
    })
  },
});