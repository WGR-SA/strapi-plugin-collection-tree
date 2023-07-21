/**
 *  service
 */

import { factories } from '@strapi/strapi';

export default ({strapi}) => ({
  ...factories.createCoreService('plugin::strapi-plugin-collection-tree.tree-settings'),
  getModels() {
    return strapi.contentTypes
  }
}) 
