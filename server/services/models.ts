import { Strapi } from '@strapi/strapi'
import schemaUpdater from '../utils/schemaUpdate'
import { getPluginService } from '../utils/serviceGetter'
import attributes from '../config/attributes.default'
import metadatas from '../config/metadatas.default'
 
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
    const contentManagerStore = await this.getContentManagerStore()
    const modelMeta = await contentManagerStore.get({ key: `configuration_content_types::api::${key}.${key}` })

    return modelMeta
  },

  async setModelMeta(meta: any) {
    const contentManagerStore = await this.getContentManagerStore()

    await contentManagerStore.set({ key: `configuration_content_types::${meta.uid}`, value: meta })
  },

  async getDisplayField(key: string): Promise<string> {
    const modelMeta = await this.getModelMeta(key)

    return modelMeta.settings.mainField
  },

  async manageTreeFields(models: string[]) {
    const settings = await getPluginService('settings')?.getSettings()
    
    this.getModels().forEach((key) => {
      if (settings.models.includes(key)) {
        this.addTreeFields(key)
      } else {
        this.removeTreeFields(key)
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
    })

    let modelMeta = await this.getModelMeta(key)
    modelMeta.settings.defaultSortBy = settings.fieldname['lft']
    let rows: {name: string, size: number}[][] = []
    modelMeta.layouts.edit.map((row) => {
      const fields = row.filter((field) => ![settings.fieldname['lft'], settings.fieldname['rght'], settings.fieldname['children']].includes(field.name))
      if (fields.length > 0) rows.push(row)
    })
    modelMeta.layouts.edit = rows
    
    await this.setModelMeta(modelMeta)
  },

  async removeTreeFields(key: string) {
    const settings = await getPluginService('settings')?.getSettings()

    Object.keys(attributes).forEach((field) => schemaUpdater().removeAttribute(key, settings.fieldname[field]))
  },
})
