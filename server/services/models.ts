import { Strapi } from '@strapi/strapi';
import schemaUpdater from '../utils/schemaUpdate'

const pluginPath = 'plugin::strapi-plugin-collection-tree'
const treeFields = ['lft', 'rght', 'parent_id']

export default ({ strapi }: { strapi: Strapi }) => ({
  getModels() {
    const { contentTypes } = strapi

    // Get API models keys
    const models = Object.keys(contentTypes)
      .filter((c: string) => c.match('api::'))
      .map(m => m.slice(m.lastIndexOf('.') + 1))

    return models
  },
  async manageTreeFields(models: string[]) {
    const settings = await strapi.entityService.findMany(`${pluginPath}.tree-settings`)
    strapi.service(`${pluginPath}.models`)?.getModels().forEach((key) => {
      if (settings.settings.models.includes(key)) {
        strapi.service(`${pluginPath}.models`)?.addTreeFields(key)
      } else {
        strapi.service(`${pluginPath}.models`)?.removeTreeFields(key)
      }
    })
  },
  addTreeFields(key: string) {
    treeFields.forEach((field) => schemaUpdater().addAttribute(key, field, { type: 'integer', config: { default: null } }) )
    // Set default tree
    strapi.service(`${pluginPath}.models`)?.updateEntries(key)
  },
  removeTreeFields(key: string) {
    treeFields.forEach((field) => schemaUpdater().removeAttribute(key, field))
  },
  async updateEntries(key: string) {
    const entries = await strapi.db.query(`api::${key}.${key}`).findMany({ select: ['id'], where: {}, orderBy: { id: 'asc' } })
    let tree = 1
    entries.forEach(async (entry: any) => {
      strapi.db.query(`api::${key}.${key}`).update({
        where: { id: entry.id, },
        data: { lft: tree, rght: tree + 1 }
      });
      tree += 2
    })
  }
});
