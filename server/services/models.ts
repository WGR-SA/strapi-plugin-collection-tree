import { Strapi } from '@strapi/strapi';
import schemaUpdater from '../utils/schemaUpdate'
import { getPluginService } from '../utils/serviceGetter'
import attributes from '../config/attributes.default'
 
export default ({ strapi }: { strapi: Strapi }) => ({
  getModels() {
    const { contentTypes } = strapi
    
    const models = Object.keys(contentTypes)
      .filter((c: string) => c.match('api::'))
      .map(m => m.slice(m.lastIndexOf('.') + 1))

    return models
  },

  isLocalized(key: string): boolean {    
    const { contentTypes } = strapi
    const model = contentTypes[`api::${key}.${key}`]        

    return model.pluginOptions?.i18n?.localized ?? false
  },

  async getContentManagerStore() {
    const contentManagerStore = await strapi.store({ environment: '', type: 'plugin', name: 'content_manager' })

    return contentManagerStore
  },

  async getModelMeta (key: string) {
    const contentManagerStore = await getPluginService('models')?.getContentManagerStore()
    const modelMeta = await contentManagerStore.get({ key: `configuration_content_types::api::${key}.${key}` })

    return modelMeta
  },

  async setModelMeta(meta: any) {
    const contentManagerStore = await getPluginService('models')?.getContentManagerStore()

    await contentManagerStore.set({ key: `configuration_content_types::${meta.uid}`, meta})
  },

  async getDisplayField(key: string): Promise<string> {
    const modelMeta = await getPluginService('models')?.getModelMeta(key)

    return modelMeta.settings.mainField
  },

  async manageTreeFields(models: string[]) {
    const settings = await getPluginService('settings')?.getSettings()
    
    getPluginService('models')?.getModels().forEach((key) => {
      if (settings.models.includes(key)) {
        getPluginService('models')?.addTreeFields(key)
        //getPluginService('models')?.recoverTree(key)
      } else {
        getPluginService('models')?.removeTreeFields(key)
      }
    })
  },

  async addTreeFields(key: string) {
    const settings = await getPluginService('settings')?.getSettings()
    
    Object.keys(attributes).forEach((field) => {      
      if (attributes[field].target) attributes[field].target = `api::${key}.${key}`
      if (attributes[field].mappedBy) attributes[field].mappedBy = settings.fieldname['parent']
      if (attributes[field].inversedBy) attributes[field].inversedBy = settings.fieldname['children']

      schemaUpdater().addAttribute(key, settings.fieldname[field], attributes[field])
    });

  },

  async removeTreeFields(key: string) {
    const settings = await getPluginService('settings')?.getSettings()

    Object.keys(attributes).forEach((field) => schemaUpdater().removeAttribute(key, settings.fieldname[field]))
  },

  // async recoverTree(key: string) {
  //   const settings = await getPluginService('settings')?.getSettings()

  //   const entries = await strapi.db.query(`api::${key}.${key}`).findMany({ select: ['id', settings.fieldname["lft"]], where: {}, orderBy: { id: 'asc' } })
  //   let tree = 1
    
  //   entries.forEach(async (entry: TreeItem) => {
  //     if (entry.lft === null || entry.lft === undefined) {
  //       strapi.db.query(`api::${key}.${key}`).update({
  //         where: { id: entry.id, },
  //         data: { 
  //           [settings.fieldname["lft"]]: tree, 
  //           [settings.fieldname["rght"]]: tree + 1 
  //         }
  //       });
  //       tree += 2
  //     } 
  //   })
  // }
});
