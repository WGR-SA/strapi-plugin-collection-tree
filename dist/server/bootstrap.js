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
};
