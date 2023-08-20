"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const treeTransformer_1 = __importDefault(require("../utils/treeTransformer"));
const serviceGetter_1 = require("../utils/serviceGetter");
exports.default = ({ strapi }) => ({
    async getEntries(key, locale, sorted = true) {
        var _a;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const conditions = { sort: { [settings.fieldname["lft"]]: 'ASC' }, populate: settings.fieldname["parent"] };
        if (locale)
            conditions["locale"] = locale;
        const data = await strapi.entityService.findMany(`api::${key}.${key}`, conditions);
        data.map((entry) => { var _a; return entry.parent = (entry[settings.fieldname["parent"]]) ? (_a = entry[settings.fieldname["parent"]]) === null || _a === void 0 ? void 0 : _a.id : null; });
        return (sorted) ? (0, treeTransformer_1.default)().treeToSort(data) : data;
    },
    async updateEntries(data, sorted = true) {
        var _a, _b;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        if (data.entries.length === 0) {
            data.entries = await ((_b = (0, serviceGetter_1.getPluginService)('sort')) === null || _b === void 0 ? void 0 : _b.getEntries(data.key));
        }
        const tree = (sorted) ? (0, treeTransformer_1.default)().sortToTree(data.entries) : data.entries;
        tree.forEach(async (entry) => {
            // TODO don't trigger beforeUpdate lifecycle
            await strapi.db.query(`api::${data.key}.${data.key}`).update({
                where: { id: entry.id, },
                data: { [settings.fieldname["lft"]]: entry.lft, [settings.fieldname["rght"]]: entry.rght, [settings.fieldname["parent"]]: entry.parent, primary: false }
            });
        });
    },
    async updateOnCreate(model, data) {
        var _a, _b, _c, _d;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const items = await ((_b = (0, serviceGetter_1.getPluginService)('sort')) === null || _b === void 0 ? void 0 : _b.getEntries(model, (_c = data.locale) !== null && _c !== void 0 ? _c : null, false));
        if (data.parent.connect.length === 0) {
            const lastItem = items[items.length - 1];
            data[settings.fieldname["lft"]] = lastItem[settings.fieldname["rght"]] + 1;
            data[settings.fieldname["rght"]] = lastItem[settings.fieldname["rght"]] + 2;
        }
        else {
            const parentId = data[settings.fieldname["parent"]].connect[0].id;
            const parent = items.find((item) => item.id === parentId);
            if (!parent)
                return;
            // place new item in tree
            data[settings.fieldname["lft"]] = parent[settings.fieldname["rght"]];
            data[settings.fieldname["rght"]] = parent[settings.fieldname["rght"]] + 1;
            // make place for new item
            const newData = items.map((item) => {
                if (item.id === parentId) {
                    item[settings.fieldname["rght"]] += 2;
                }
                if (item[settings.fieldname["lft"]] > data[settings.fieldname["lft"]]) {
                    item[settings.fieldname["lft"]] += 2;
                    item[settings.fieldname["rght"]] += 2;
                }
                return item;
            });
            await ((_d = (0, serviceGetter_1.getPluginService)('sort')) === null || _d === void 0 ? void 0 : _d.updateEntries({ key: model, entries: newData }, false));
        }
        return data;
    },
    async updateOnUpdate(model, data) {
        // TODO Update tree if parent has changed
    },
    async updateOnDelete(model) {
        var _a, _b;
        const items = await ((_a = (0, serviceGetter_1.getPluginService)('sort')) === null || _a === void 0 ? void 0 : _a.getEntries(model));
        await ((_b = (0, serviceGetter_1.getPluginService)('sort')) === null || _b === void 0 ? void 0 : _b.updateEntries({ key: model, entries: items }));
    }
});
