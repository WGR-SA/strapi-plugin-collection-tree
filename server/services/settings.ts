import { Strapi } from '@strapi/strapi'
import { getPluginService } from '../utils/serviceGetter'

import type { CollectionTreeConfig } from '../../types'
 
export default ({ strapi }: { strapi: Strapi }) => ({
  async getPluginStore() {
    return await strapi.store({ environment: '', type: 'plugin', name: 'collection-tree' })
  },
  async getIntlStore() {
    return await strapi.store({ environment: '', type: 'plugin', name: 'i18n' })
  },
  async getSettings() {
    const store = await this.getPluginStore()
    
    return await store.get({ key: 'settings' })
  },
  async setSettings(settings: CollectionTreeConfig) {
    const store = await this.getPluginStore()
    
    await store.set({ key: 'settings', value: settings })
    await getPluginService('models')?.manageTreeFields()
  },
  async getLocales(model: string) {
    const localized = getPluginService('models')?.isLocalized(model) 
    if (!localized) return []

    const intlStore = await this.getIntlStore()
    const defaultLocale = await intlStore.get({ key: 'default_locale' })    
    const data = await strapi.entityService.findMany('plugin::i18n.locale')
    
    const locales = data.map((locale: {[key: string]: unknown}) => {
      return { ...locale, isDefault: locale.code === defaultLocale }
    })
    
    return locales
  }
})
