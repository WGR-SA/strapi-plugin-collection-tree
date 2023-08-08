"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluginPath = 'plugin::strapi-plugin-collection-tree';
exports.default = ({ strapi }) => {
    var _a;
    (_a = strapi.service(`${pluginPath}.models`)) === null || _a === void 0 ? void 0 : _a.manageTreeFields();
};
