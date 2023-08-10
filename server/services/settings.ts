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
  }
});
