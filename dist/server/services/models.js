"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schemaUpdate_1 = __importDefault(require("../utils/schemaUpdate"));
const serviceGetter_1 = require("../utils/serviceGetter");
const attributes_default_1 = __importDefault(require("../config/attributes.default"));
exports.default = ({ strapi }) => ({
    getModels() {
        const { contentTypes } = strapi;
        const models = Object.keys(contentTypes)
            .filter((c) => c.match('api::'))
            .map(m => m.slice(m.lastIndexOf('.') + 1));
        return models;
    },
    isLocalized(key) {
        var _a, _b, _c;
        const { contentTypes } = strapi;
        const model = contentTypes[`api::${key}.${key}`];
        return (_c = (_b = (_a = model.pluginOptions) === null || _a === void 0 ? void 0 : _a.i18n) === null || _b === void 0 ? void 0 : _b.localized) !== null && _c !== void 0 ? _c : false;
    },
    async getContentManagerStore() {
        const contentManagerStore = await strapi.store({ environment: '', type: 'plugin', name: 'content_manager' });
        return contentManagerStore;
    },
    async getModelMeta(key) {
        var _a;
        const contentManagerStore = await ((_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.getContentManagerStore());
        const modelMeta = await contentManagerStore.get({ key: `configuration_content_types::api::${key}.${key}` });
        return modelMeta;
    },
    async setModelMeta(meta) {
        var _a;
        const contentManagerStore = await ((_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.getContentManagerStore());
        await contentManagerStore.set({ key: `configuration_content_types::${meta.uid}`, value: meta });
    },
    async getDisplayField(key) {
        var _a;
        const modelMeta = await ((_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.getModelMeta(key));
        return modelMeta.settings.mainField;
    },
    async manageTreeFields(models) {
        var _a, _b;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        (_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getModels().forEach((key) => {
            var _a, _b;
            if (settings.models.includes(key)) {
                (_a = (0, serviceGetter_1.getPluginService)('models')) === null || _a === void 0 ? void 0 : _a.addTreeFields(key);
                //getPluginService('models')?.recoverTree(key)
            }
            else {
                (_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.removeTreeFields(key);
            }
        });
    },
    async addTreeFields(key) {
        var _a, _b, _c;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        Object.keys(attributes_default_1.default).forEach((field) => {
            if (attributes_default_1.default[field].target)
                attributes_default_1.default[field].target = `api::${key}.${key}`;
            if (attributes_default_1.default[field].mappedBy)
                attributes_default_1.default[field].mappedBy = settings.fieldname['parent'];
            if (attributes_default_1.default[field].inversedBy)
                attributes_default_1.default[field].inversedBy = settings.fieldname['children'];
            (0, schemaUpdate_1.default)().addAttribute(key, settings.fieldname[field], attributes_default_1.default[field]);
        });
        let modelMeta = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getModelMeta(key));
        modelMeta.settings.defaultSortBy = settings.fieldname['lft'];
        let rows = [];
        modelMeta.layouts.edit.map((row) => {
            const fields = row.filter((field) => ![settings.fieldname['lft'], settings.fieldname['rght'], settings.fieldname['children']].includes(field.name));
            if (fields.length > 0)
                rows.push(row);
        });
        modelMeta.layouts.edit = rows;
        await ((_c = (0, serviceGetter_1.getPluginService)('models')) === null || _c === void 0 ? void 0 : _c.setModelMeta(modelMeta));
    },
    async removeTreeFields(key) {
        var _a;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        Object.keys(attributes_default_1.default).forEach((field) => (0, schemaUpdate_1.default)().removeAttribute(key, settings.fieldname[field]));
    },
    // async recoverTree(key: string) {
    //   const settings = await getPluginService('settings')?.getSettings()
    //   const entries = await strapi.db.query(`api::${key}.${key}`).findMany({ select: ['id', settings.fieldname["lft"]], where: {}, orderBy: { id: 'asc' } })
    //   let tree = 1
    //   entries.forEach(async (entry: TreeItem) => {
    //     if (entry.lft === null || entry.lft === undefined) {
    //       strapi.db.query(`api::${key}.${key}`).update({
    //         where: { id: entry.id, },
    //         data: { 
    //           [settings.fieldname["lft"]]: tree, 
    //           [settings.fieldname["rght"]]: tree + 1 
    //         }
    //       })
    //       tree += 2
    //     } 
    //   })
    // }
});
