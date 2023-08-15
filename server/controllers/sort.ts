import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  async getEntries(ctx) {
    const { model, locale } = ctx.request.query
    
    ctx.body = await strapi
      .plugin('strapi-plugin-collection-tree')
      .service('sort')
      .getEntries(model, locale)
  },
  async saveEntries(ctx) {
    ctx.body = await strapi
      .plugin('strapi-plugin-collection-tree')
      .service('sort')
      .updateEntries(ctx.request.body.data)
  } 
})