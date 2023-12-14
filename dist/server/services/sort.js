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
        var _a, _b, _c;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(data.key));
        const list = await ((_c = (0, serviceGetter_1.getPluginService)('sort')) === null || _c === void 0 ? void 0 : _c.getEntries(data.key, null, false));
        if (data.entries.length === 0) {
            data.entries = list;
        }
        const tree = (sorted) ? (0, treeTransformer_1.default)().sortToTree(data.entries) : data.entries;
        // Set Tree name
        tree.map((entry) => {
            var _a;
            const item = list.find((item) => item.id === entry.id);
            entry.tree = (_a = (0, serviceGetter_1.getPluginService)('sort')) === null || _a === void 0 ? void 0 : _a.getTreeName(item, list, displayField);
            return entry;
        });
        tree.forEach(async (entry) => {
            // TODO don't trigger beforeUpdate lifecycle
            await strapi.db.query(`api::${data.key}.${data.key}`).update({
                where: { id: entry.id, },
                data: {
                    [settings.fieldname["lft"]]: entry.lft,
                    [settings.fieldname["rght"]]: entry.rght,
                    [settings.fieldname["parent"]]: entry.parent,
                    [settings.fieldname["tree"]]: entry.tree,
                    primary: false
                }
            });
        });
    },
    async updateOnCreate(model, data) {
        var _a, _b, _c, _d, _e, _f, _g;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(model));
        const items = await ((_c = (0, serviceGetter_1.getPluginService)('sort')) === null || _c === void 0 ? void 0 : _c.getEntries(model, (_d = data.locale) !== null && _d !== void 0 ? _d : null, false));
        if (items.length === 0) {
            data[settings.fieldname["lft"]] = 1;
            data[settings.fieldname["rght"]] = 2;
            data.tree = data[displayField];
            return data;
        }
        if (data.parent.connect.length === 0) {
            const lastItem = items[items.length - 1];
            data[settings.fieldname["lft"]] = lastItem[settings.fieldname["rght"]] + 1;
            data[settings.fieldname["rght"]] = lastItem[settings.fieldname["rght"]] + 2;
            data.tree = data[displayField];
        }
        else {
            const parentId = data[settings.fieldname["parent"]].connect[0].id;
            const parent = items.find((item) => item.id === parentId);
            if (!parent)
                return;
            // place new item in tree
            data[settings.fieldname["lft"]] = parent[settings.fieldname["rght"]];
            data[settings.fieldname["rght"]] = parent[settings.fieldname["rght"]] + 1;
            data.tree = (_e = (0, serviceGetter_1.getPluginService)('sort')) === null || _e === void 0 ? void 0 : _e.getTreeName((_f = (0, serviceGetter_1.getPluginService)('sort')) === null || _f === void 0 ? void 0 : _f.mapDataToTreeItem(data, settings), items, displayField);
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
            await ((_g = (0, serviceGetter_1.getPluginService)('sort')) === null || _g === void 0 ? void 0 : _g.updateEntries({ key: model, entries: newData }, false));
        }
        return data;
    },
    async updateOnUpdate(model, data) {
        // TODO Update tree if parent has changed
    },
    async updateOnDelete(model) {
        var _a, _b;
        if (!model)
            return;
        const items = await ((_a = (0, serviceGetter_1.getPluginService)('sort')) === null || _a === void 0 ? void 0 : _a.getEntries(model));
        if (items.length === 0)
            return;
        await ((_b = (0, serviceGetter_1.getPluginService)('sort')) === null || _b === void 0 ? void 0 : _b.updateEntries({ key: model, entries: items }));
    },
    mapDataToTreeItem(entry, settings) {
        return {
            ...entry,
            id: entry.id,
            lft: entry[settings.fieldname["lft"]],
            rght: entry[settings.fieldname["rght"]],
            parent: entry[settings.fieldname["parent"]].connect.length > 0 ? entry[settings.fieldname["parent"]].connect[0].id : null,
            tree: entry[settings.fieldname["tree"]]
        };
    },
    getTreeName(entry, list, displayField) {
        let name = '';
        let parent = entry.parent;
        while (parent !== null) {
            const parentEntry = list.find((item) => item.id === parent);
            if (parentEntry) {
                name = `${parentEntry[displayField]} > ${name}`;
                parent = parentEntry.parent;
            }
            else {
                parent = null;
            }
        }
        return `${name}${entry[displayField]}`;
    }
});
