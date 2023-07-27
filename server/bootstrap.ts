import { Strapi } from '@strapi/strapi';

const pluginPath = 'plugin::strapi-plugin-collection-tree'

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.service(`${pluginPath}.models`)?.manageTreeFields()
};
