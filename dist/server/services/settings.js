"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluginPath = 'plugin::strapi-plugin-collection-tree';
exports.default = ({ strapi }) => ({
    async getSettings() {
        var _a;
        const settings = await strapi.entityService.findMany(`${pluginPath}.tree-settings`);
        return (_a = settings.settings) !== null && _a !== void 0 ? _a : { models: [], attributes: { lft: 'lft', rght: 'rght', parent: 'parent' } };
    },
    async setSettings(settings) {
        var _a;
        const current = await strapi.entityService.findMany(`${pluginPath}.tree-settings`);
        if (current) {
            await strapi.entityService.update(`${pluginPath}.tree-settings`, current.id, { data: { settings: settings } });
        }
        else {
            await strapi.entityService.create(`${pluginPath}.tree-settings`, { data: { settings: settings } });
        }
        await ((_a = strapi.service(`${pluginPath}.models`)) === null || _a === void 0 ? void 0 : _a.manageTreeFields());
    }
});
