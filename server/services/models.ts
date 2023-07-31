import { Strapi } from '@strapi/strapi';
import schemaUpdater from '../utils/schemaUpdate'

import type { TreeItem } from '../../types'

const pluginPath = 'plugin::strapi-plugin-collection-tree'
const treeFields = ['lft', 'rght', 'parentId']

export default ({ strapi }: { strapi: Strapi }) => ({
  getModels() {
    const { contentTypes } = strapi
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
    
    strapi.service(`${pluginPath}.models`)?.recoverTree(key)
  },
  removeTreeFields(key: string) {
    treeFields.forEach((field) => schemaUpdater().removeAttribute(key, field))
  },
  async recoverTree(key: string) {
    const entries = await strapi.db.query(`api::${key}.${key}`).findMany({ select: ['id'], where: {}, orderBy: { id: 'asc' } })
    let tree = 1
    
    entries.forEach(async (entry: TreeItem) => {
      if (entry.lft === null || entry.lft === undefined) {
        strapi.db.query(`api::${key}.${key}`).update({
          where: { id: entry.id, },
          data: { lft: tree, rght: tree + 1 }
        });
        tree += 2
      } 
    })
  }
});
