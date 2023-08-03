import { Strapi } from '@strapi/strapi';
import schemaUpdater from '../utils/schemaUpdate'
import attributes from '../config/attributes.default'

import type { TreeItem } from '../../types'
 

const pluginUid = 'plugin::strapi-plugin-collection-tree'

export default ({ strapi }: { strapi: Strapi }) => ({
  getModels() {
    const { contentTypes } = strapi
    const models = Object.keys(contentTypes)
      .filter((c: string) => c.match('api::'))
      .map(m => m.slice(m.lastIndexOf('.') + 1))

    return models
  },
  async manageTreeFields(models: string[]) {
    const settings = await strapi.service(`${pluginUid}.settings`)?.getSettings()
    
    strapi.service(`${pluginUid}.models`)?.getModels().forEach((key) => {
      if (settings.models.includes(key)) {
        strapi.service(`${pluginUid}.models`)?.addTreeFields(key)
      } else {
        strapi.service(`${pluginUid}.models`)?.removeTreeFields(key)
      }
    })
  },
  async addTreeFields(key: string) {
    const settings = await strapi.service(`${pluginUid}.settings`)?.getSettings()

    Object.keys(attributes).forEach((field) => {
      if (attributes[field].target) attributes[field].target = `api::${key}.${key}`
      schemaUpdater().addAttribute(key, settings.attributes[field], attributes[field])
    });
        
    strapi.service(`${pluginUid}.models`)?.recoverTree(key)
  },
  async removeTreeFields(key: string) {
    const settings = await strapi.service(`${pluginUid}.settings`)?.getSettings()

    Object.keys(attributes).forEach((field) => schemaUpdater().removeAttribute(key, settings.attributes[field]))
  },
  async recoverTree(key: string) {
    const settings = await strapi.service(`${pluginUid}.settings`)?.getSettings()

    const entries = await strapi.db.query(`api::${key}.${key}`).findMany({ select: ['id', settings.attributes["lft"]], where: {}, orderBy: { id: 'asc' } })
    let tree = 1
    
    entries.forEach(async (entry: TreeItem) => {
      if (entry.lft === null || entry.lft === undefined) {
        strapi.db.query(`api::${key}.${key}`).update({
          where: { id: entry.id, },
          data: { 
            [settings.attributes["lft"]]: tree, 
            [settings.attributes["rght"]]: tree + 1 
          }
        });
        tree += 2
      } 
    })
  }
});
