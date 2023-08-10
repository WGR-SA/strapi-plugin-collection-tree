"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const treeTransformer_1 = __importDefault(require("../utils/treeTransformer"));
const serviceGetter_1 = require("../utils/serviceGetter");
exports.default = ({ strapi }) => ({
    async getEntries(key) {
        var _a;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        const data = await strapi.entityService.findMany(`api::${key}.${key}`, { sort: { [settings.fieldname["lft"]]: 'ASC' }, populate: settings.attributes["parent"] });
        data.map((entry) => entry.parent = (entry[settings.fieldname["parent"]]) ? entry[settings.fieldname["parent"]].id : null);
        return (0, treeTransformer_1.default)().treeToSort(data);
    },
    async updateEntries(data) {
        var _a, _b;
        const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
        if (data.entries.length === 0) {
            data.entries = await ((_b = (0, serviceGetter_1.getPluginService)('sort')) === null || _b === void 0 ? void 0 : _b.getEntries(data.key));
        }
        const tree = (0, treeTransformer_1.default)().sortToTree(data.entries);
        tree.forEach(async (entry) => {
            await strapi.db.query(`api::${data.key}.${data.key}`).update({
                where: { id: entry.id, },
                data: { [settings.attributes["lft"]]: entry.lft, [settings.fieldname["rght"]]: entry.rght, [settings.fieldname["parent"]]: entry.parent }
            });
        });
    },
});
