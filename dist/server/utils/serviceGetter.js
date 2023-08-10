"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginService = void 0;
const getPluginService = (name) => strapi.service(`plugin::strapi-plugin-collection-tree.${name}`);
exports.getPluginService = getPluginService;
