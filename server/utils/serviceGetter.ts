import { Strapi } from "@strapi/strapi"

declare var strapi: Strapi

export const getPluginService = (name: string) =>
  strapi.service(`plugin::strapi-plugin-collection-tree.${name}`)