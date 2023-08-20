import { Strapi } from '@strapi/strapi'
import { getPluginService } from './utils/serviceGetter'
import config from './config'

export default async ({ strapi }: { strapi: Strapi }) => {  
  const settings = await getPluginService('settings')?.getSettings()
  if (!settings) await getPluginService('settings')?.setSettings(config.default)
  await getPluginService('models')?.manageTreeFields()

  strapi.db.lifecycles.subscribe( async (event) => {
    if (event.action === 'beforeCreate') {
      const { data } = event.params
      const model = event.model.uid.split('.').pop()      

      if (settings.models.includes(model)) {
        event.params.data = await getPluginService('sort')?.updateOnCreate(model, data)
      }
    }
  })
}



