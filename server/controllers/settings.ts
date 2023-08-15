import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async get(ctx) {
    ctx.body = await strapi
      .plugin('strapi-plugin-collection-tree')
      .service('settings')
      .getSettings()
  },
  async set(ctx) {    
    ctx.body = strapi
      .plugin('strapi-plugin-collection-tree')
      .service('settings')
      .setSettings(ctx.request.body.data)
  },
  getModels(ctx) {
    ctx.body = strapi
      .plugin('strapi-plugin-collection-tree')
      .service('models')
      .getModels()
  },
  async getLocales(ctx) {
    const { model } = ctx.request.query
    ctx.body = await strapi
      .plugin('strapi-plugin-collection-tree')
      .service('settings')
      .getLocales(model)
  },
})
