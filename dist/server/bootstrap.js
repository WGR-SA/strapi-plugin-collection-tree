"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceGetter_1 = require("./utils/serviceGetter");
const config_1 = __importDefault(require("./config"));
exports.default = async ({ strapi }) => {
    var _a, _b, _c;
    const settings = await ((_a = (0, serviceGetter_1.getPluginService)('settings')) === null || _a === void 0 ? void 0 : _a.getSettings());
    if (!settings)
        await ((_b = (0, serviceGetter_1.getPluginService)('settings')) === null || _b === void 0 ? void 0 : _b.setSettings(config_1.default.default));
    await ((_c = (0, serviceGetter_1.getPluginService)('models')) === null || _c === void 0 ? void 0 : _c.manageTreeFields());
    strapi.db.lifecycles.subscribe(async (event) => {
        var _a, _b, _c, _d, _e;
        if (event.action === 'beforeCreate') {
            const { data } = event.params;
            const model = event.model.uid.split('.').pop();
            if (settings.models.includes(model)) {
                event.params.data = await ((_a = (0, serviceGetter_1.getPluginService)('sort')) === null || _a === void 0 ? void 0 : _a.updateOnCreate(model, data));
            }
        }
        if (event.action === 'beforeUpdate') {
            const { data } = event.params;
            const model = event.model.uid.split('.').pop();
            if (settings.models.includes(model)) {
                const current = await ((_b = strapi.service(event.model.uid)) === null || _b === void 0 ? void 0 : _b.findOne((_c = event.params.where) === null || _c === void 0 ? void 0 : _c.id));
                event.params.data = await ((_d = (0, serviceGetter_1.getPluginService)('sort')) === null || _d === void 0 ? void 0 : _d.updateOnUpdate(model, data, current === null || current === void 0 ? void 0 : current.locale));
            }
        }
        if (event.action === 'afterDelete') {
            const model = event.model.uid.split('.').pop();
            if (settings.models.includes(model)) {
                //@ts-ignore
                await ((_e = (0, serviceGetter_1.getPluginService)('sort')) === null || _e === void 0 ? void 0 : _e.updateOnDelete(model, event.result));
            }
        }
    });
};
