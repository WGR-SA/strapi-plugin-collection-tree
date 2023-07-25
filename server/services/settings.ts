import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getSettings() {
    const settings = await strapi.entityService.findMany('plugin::strapi-plugin-collection-tree.tree-settings')
    return settings.settings
  },
  async setSettings(settings: {models: string[]}) {
    const current = await strapi.entityService.findMany('plugin::strapi-plugin-collection-tree.tree-settings')

    if (current) return await strapi.entityService.create('plugin::strapi-plugin-collection-tree.tree-settings', { data: { settings: settings } });
     
    return await strapi.entityService.create('plugin::strapi-plugin-collection-tree.tree-settings', { data: { settings: settings } });
  }
});
