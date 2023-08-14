"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceGetter_1 = require("../utils/serviceGetter");
exports.default = ({ strapi }) => ({
    async getPluginStore() {
        return await strapi.store({ environment: '', type: 'plugin', name: 'collection-tree', });
    },
    async getIntlStore() {
        return await strapi.store({ environment: '', type: 'plugin', name: 'i18n', });
    },
    async getSettings() {
        var _a;
        const store = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getPluginStore());
        return await store.get({ key: 'settings' });
    },
    async setSettings(settings) {
        var _a, _b;
        const store = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getPluginStore());
        await store.set({ key: 'settings', value: settings });
        await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.manageTreeFields());
    },
    async getLocales(model) {
        var _a, _b;
        const localized = (_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.isLocalized(model);
        if (!localized)
            return [];
        const intlStore = await ((_b = (0, serviceGetter_1.getPluginService)('settings')) === null || _b === void 0 ? void 0 : _b.getIntlStore());
        const defaultLocale = await intlStore.get({ key: 'default_locale' });
        console.log(defaultLocale);
        const data = await strapi.entityService.findMany('plugin::i18n.locale');
        const locales = data.map((locale) => {
            return { ...locale, isDefault: locale.code === defaultLocale };
        });
        return locales;
    }
});
