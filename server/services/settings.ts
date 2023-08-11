import { Strapi } from '@strapi/strapi'
import { getPluginService } from '../utils/serviceGetter'

import type { CollectionTreeConfig } from '../../types'
 
export default ({ strapi }: { strapi: Strapi }) => ({
  async getPluginStore() {
    return await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'collection-tree',
    })
  },
  async getSettings() {
    const store = await getPluginService('settings')?.getPluginStore()
    
    return await store.get({ key: 'settings' })
  },
  async setSettings(settings: CollectionTreeConfig) {
    const store = await getPluginService('settings')?.getPluginStore()
    
    await store.set({ key: 'settings', value: settings })
    await getPluginService('models')?.manageTreeFields()
  },
  async getLocales(model: string) {
    const localized = getPluginService('models')?.isLocalized(model) 
    if (!localized) return []

    const locales = await strapi.entityService.findMany('plugin::i18n.locale')
    return locales
  }
});
