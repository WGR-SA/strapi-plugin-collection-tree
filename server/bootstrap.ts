import { Strapi } from '@strapi/strapi';
import { getPluginService } from './utils/serviceGetter';
import config from './config'

export default async ({ strapi }: { strapi: Strapi }) => {  
  const settings = await getPluginService('settings')?.getSettings()
  if (!settings) await getPluginService('settings')?.setSettings(config.default)
  //await getPluginService('models')?.manageTreeFields()
};
