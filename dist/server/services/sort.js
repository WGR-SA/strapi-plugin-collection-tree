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
        const data = await strapi.entityService.findMany(`api::${key}.${key}`, conditions);
        data.map((entry) => { var _a; return entry.parent = (entry[settings.fieldname["parent"]]) ? (_a = entry[settings.fieldname["parent"]]) === null || _a === void 0 ? void 0 : _a.id : null; });
        return (sorted) ? (0, treeTransformer_1.default)().treeToSort(data) : data;
    },
    async updateEntries(data, sorted = true) {
        var _a, _b;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(data.key));
        const list = await this.getEntries(data.key, data.locale, false);
        const { lft, rght, parent, tree } = settings.fieldname;
        if (data.entries.length === 0) {
            data.entries = list;
        }
        const treeData = (sorted) ? (0, treeTransformer_1.default)().sortToTree(data.entries) : data.entries;
        // Set Tree name
        treeData.map((entry) => {
            const item = list.find((item) => item.id === entry.id);
            entry.tree = this.getTreeName(item, list, displayField);
            return entry;
        });
        treeData.forEach(async (entry) => {
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
        var _a, _b, _c, _d;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(model));
        const items = await this.getEntries(model, (_c = data.locale) !== null && _c !== void 0 ? _c : null, false);
        const { lft, rght, tree } = settings.fieldname;
        // Push data to tree and sort
        items.push(this.mapDataToTreeItem(data, settings));
        const sortedItems = (0, treeTransformer_1.default)().treeToSort(items);
        let treeData = (0, treeTransformer_1.default)().sortToTree(sortedItems);
        // extract tree position and update data
        const treeItem = treeData.find((item) => item.id === data.id);
        data[lft] = treeItem === null || treeItem === void 0 ? void 0 : treeItem.lft;
        data[rght] = treeItem === null || treeItem === void 0 ? void 0 : treeItem.rght;
        data[tree] = this.getTreeName(this.mapDataToTreeItem(data, settings), items, displayField);
        // Update other tree items
        await this.updateEntries({ key: model, entries: treeData.filter((item) => item.id !== data.id), locale: (_d = data.locale) !== null && _d !== void 0 ? _d : null }, false);
        return data;
    },
    async updateOnUpdate(model, data, locale) {
        var _a, _b, _c, _d, _e;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const displayField = await ((_b = (0, serviceGetter_1.getPluginService)('models')) === null || _b === void 0 ? void 0 : _b.getDisplayField(model));
        const items = await this.getEntries(model, locale, false);
        const item = items.find((item) => item.id === data.id);
        const { lft, rght, parent, tree } = settings.fieldname;
        if (((_d = (_c = data[parent]) === null || _c === void 0 ? void 0 : _c.connect) === null || _d === void 0 ? void 0 : _d.length) > 0) {
            if (data[parent].connect[0].id !== ((_e = item[parent]) === null || _e === void 0 ? void 0 : _e.id)) {
                // Push data to tree and sort
                const treeItems = items.filter((item) => item.id != data.id);
                treeItems.push(this.mapDataToTreeItem(data, settings));
                const sortedItems = (0, treeTransformer_1.default)().treeToSort(treeItems);
                let treeData = (0, treeTransformer_1.default)().sortToTree(sortedItems);
                // extract tree position and update data
                const treeItem = treeData.find((item) => item.id === data.id);
                data[lft] = treeItem === null || treeItem === void 0 ? void 0 : treeItem.lft;
                data[rght] = treeItem === null || treeItem === void 0 ? void 0 : treeItem.rght;
                data[tree] = this.getTreeName(this.mapDataToTreeItem(data, settings), items, displayField);
                // Update other tree items
                await this.updateEntries({ key: model, entries: treeData.filter((item) => item.id != data.id), locale: locale }, false);
            }
        }
        return data;
    },
    async updateOnDelete(model, data) {
        var _a;
        if (!model)
            return;
        const items = await this.getEntries(model, (_a = data.locale) !== null && _a !== void 0 ? _a : null);
        if (items.length === 0)
            return;
        await this.updateEntries({ key: model, entries: items });
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
