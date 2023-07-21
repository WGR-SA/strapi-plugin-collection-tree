/**
 *  controller
 */

import { Strapi, factories } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => ({
  ...factories.createCoreController('plugin::strapi-plugin-collection-tree.tree-settings'),
  getModelList(ctx)
  {
    ctx.body = strapi
      .plugin('strapi-plugin-collection-tree')
      .service('tree-settings')
      .getModels();
  }
}) 
