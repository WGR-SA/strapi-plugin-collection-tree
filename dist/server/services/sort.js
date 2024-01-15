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
        const { lft, rght, parent, tree } = settings.fieldname;
        const conditions = { sort: { [lft]: 'ASC' }, populate: parent };
        if (locale)
            conditions["locale"] = locale;
        //@ts-ignore
        const data = await strapi.entityService.findMany(`api::${key}.${key}`, conditions);
        data.map((entry) => { var _a; return entry.parent = (entry[settings.fieldname["parent"]]) ? (_a = entry[settings.fieldname["parent"]]) === null || _a === void 0 ? void 0 : _a.id : null; });
        return (sorted) ? (0, treeTransformer_1.default)().treeToSort(data) : data;
    },
    async updateEntries(data, sorted = true) {
        var _a, _b, _c;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(data.key));
        const list = await ((_c = (0, serviceGetter_1.getPluginService)('sort')) === null || _c === void 0 ? void 0 : _c.getEntries(data.key, data.locale, false));
        const { lft, rght, parent, tree } = settings.fieldname;
        if (data.entries.length === 0) {
            data.entries = list;
        }
        const treeData = (sorted) ? (0, treeTransformer_1.default)().sortToTree(data.entries) : data.entries;
        // Set Tree name
        treeData.map((entry) => {
            var _a;
            const item = list.find((item) => item.id === entry.id);
            entry.tree = (_a = (0, serviceGetter_1.getPluginService)('sort')) === null || _a === void 0 ? void 0 : _a.getTreeName(item, list, displayField);
            return entry;
        });
        treeData.forEach(async (entry) => {
            // TODO don't trigger beforeUpdate lifecycle
            //@ts-ignore
            await strapi.db.query(`api::${data.key}.${data.key}`).update({
                where: { id: entry.id, },
                data: {
                    [lft]: entry.lft,
                    [rght]: entry.rght,
                    [parent]: entry.parent,
                    [tree]: entry.tree,
                    primary: false
                }
            });
        });
    },
    async updateOnCreate(model, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(model));
        const items = await ((_c = (0, serviceGetter_1.getPluginService)('sort')) === null || _c === void 0 ? void 0 : _c.getEntries(model, (_d = data.locale) !== null && _d !== void 0 ? _d : null, false));
        const { lft, rght, parent } = settings.fieldname;
        if (items.length === 0) {
            return (_e = (0, serviceGetter_1.getPluginService)('sort')) === null || _e === void 0 ? void 0 : _e.hangItem(data, settings, data[displayField], 0);
        }
        if (data.parent.connect.length === 0) {
            return (_f = (0, serviceGetter_1.getPluginService)('sort')) === null || _f === void 0 ? void 0 : _f.hangItem(data, settings, data[displayField], items[items.length - 1].lft);
        }
        else {
            const parentId = data[parent].connect[0].id;
            const parentItem = items.find((item) => item.id === parentId);
            if (!parentItem)
                return;
            const treeName = (_g = (0, serviceGetter_1.getPluginService)('sort')) === null || _g === void 0 ? void 0 : _g.getTreeName((_h = (0, serviceGetter_1.getPluginService)('sort')) === null || _h === void 0 ? void 0 : _h.mapDataToTreeItem(data, settings), items, displayField);
            data = (_j = (0, serviceGetter_1.getPluginService)('sort')) === null || _j === void 0 ? void 0 : _j.hangItem(data, settings, treeName, parentItem[rght] - 1);
            const updatedItems = (_k = (0, serviceGetter_1.getPluginService)('sort')) === null || _k === void 0 ? void 0 : _k.pushItems(items, settings, parentId, data[lft]);
            await ((_l = (0, serviceGetter_1.getPluginService)('sort')) === null || _l === void 0 ? void 0 : _l.updateEntries({ key: model, entries: updatedItems, locale: (_m = data.locale) !== null && _m !== void 0 ? _m : null }, false));
        }
        return data;
    },
    async updateOnUpdate(model, data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(model));
        const items = await ((_c = (0, serviceGetter_1.getPluginService)('sort')) === null || _c === void 0 ? void 0 : _c.getEntries(model, (_d = data.locale) !== null && _d !== void 0 ? _d : null, false));
        const item = items.find((item) => item.id === data.id);
        const { lft, rght, parent } = settings.fieldname;
        if (((_f = (_e = data[parent]) === null || _e === void 0 ? void 0 : _e.connect) === null || _f === void 0 ? void 0 : _f.length) > 0) {
            if (data[parent].connect[0].id !== item[parent].id) {
                const parentId = data[parent].connect[0].id;
                const parentItem = items.find((item) => item.id === parentId);
                if (!parentItem)
                    return;
                const treeName = (_g = (0, serviceGetter_1.getPluginService)('sort')) === null || _g === void 0 ? void 0 : _g.getTreeName((_h = (0, serviceGetter_1.getPluginService)('sort')) === null || _h === void 0 ? void 0 : _h.mapDataToTreeItem(data, settings), items, displayField);
                data = (_j = (0, serviceGetter_1.getPluginService)('sort')) === null || _j === void 0 ? void 0 : _j.hangItem(data, settings, treeName, parentItem[rght] - 1);
                const updatedItems = (_k = (0, serviceGetter_1.getPluginService)('sort')) === null || _k === void 0 ? void 0 : _k.pushItems(items, settings, parentId, data[lft]);
                await ((_l = (0, serviceGetter_1.getPluginService)('sort')) === null || _l === void 0 ? void 0 : _l.updateEntries({ key: model, entries: updatedItems, locale: (_m = data.locale) !== null && _m !== void 0 ? _m : null }, false));
            }
        }
        return data;
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
    hangItem(data, settings, treeName, base = 0) {
        const { lft, rght } = settings.fieldname;
        data[lft] = base + 1;
        data[rght] = base + 2;
        data.tree = treeName;
        return data;
    },
    pushItems(items, settings, parentId, base = 0) {
        const { lft, rght } = settings.fieldname;
        return items.map((item) => {
            if (item.id === parentId) {
                item[rght] += 2;
            }
            if (item[lft] > base) {
                item[lft] += 2;
                item[rght] += 2;
            }
            return item;
        });
    },
    mapDataToTreeItem(entry, settings) {
        var _a, _b;
        const { lft, rght, parent, tree } = settings.fieldname;
        return {
            ...entry,
            id: entry.id,
            lft: entry[lft],
            rght: entry[rght],
            parent: ((_b = (_a = entry[parent]) === null || _a === void 0 ? void 0 : _a.connect) === null || _b === void 0 ? void 0 : _b.length) > 0 ? entry[parent].connect[0].id : null,
            tree: entry[tree]
        };
    },
    getTreeName(entry, list, displayField) {
        var _a;
        let name = '';
        let parent = (_a = entry === null || entry === void 0 ? void 0 : entry.parent) !== null && _a !== void 0 ? _a : null;
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
