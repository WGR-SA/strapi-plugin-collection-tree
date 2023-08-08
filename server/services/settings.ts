import { Strapi } from '@strapi/strapi';

const pluginPath = 'plugin::strapi-plugin-collection-tree'

export default ({ strapi }: { strapi: Strapi }) => ({
  async getSettings() {
    const settings = await strapi.entityService.findMany(`${pluginPath}.tree-settings`)
    return settings.settings ?? { models: [], attributes: { lft: 'lft', rght: 'rght', parent: 'parent' } }
  },
  async setSettings(settings: {models: string[]}) {
    const current = await strapi.entityService.findMany(`${pluginPath}.tree-settings`)

    if (current) {
      await strapi.entityService.update(`${pluginPath}.tree-settings`, current.id, { data: { settings: settings } });
    } else {
      await strapi.entityService.create(`${pluginPath}.tree-settings`, { data: { settings: settings } });
    }

    await strapi.service(`${pluginPath}.models`)?.manageTreeFields()
  }
});
