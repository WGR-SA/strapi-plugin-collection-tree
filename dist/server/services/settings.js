"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceGetter_1 = require("../utils/serviceGetter");
exports.default = ({ strapi }) => ({
    async getPluginStore() {
        return await strapi.store({ environment: '', type: 'plugin', name: 'collection-tree' });
    },
    async getIntlStore() {
        return await strapi.store({ environment: '', type: 'plugin', name: 'i18n' });
    },
    async getSettings() {
        const store = await this.getPluginStore();
        return await store.get({ key: 'settings' });
    },
    async setSettings(settings) {
        var _a;
        const store = await this.getPluginStore();
        await store.set({ key: 'settings', value: settings });
        await ((_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.manageTreeFields());
    },
    async getLocales(model) {
        var _a;
        const localized = (_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.isLocalized(model);
        if (!localized)
            return [];
        const intlStore = await this.getIntlStore();
        const defaultLocale = await intlStore.get({ key: 'default_locale' });
        const data = await strapi.entityService.findMany('plugin::i18n.locale');
        const locales = data.map((locale) => {
            return { ...locale, isDefault: locale.code === defaultLocale };
        });
        return locales;
    }
});
