"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: 'GET',
        path: '/models',
        handler: 'settingsController.getModels',
    },
    {
        method: 'GET',
        path: '/settings',
        handler: 'settingsController.get',
    },
    {
        method: 'POST',
        path: '/settings',
        handler: 'settingsController.set',
    },
    {
        method: 'GET',
        path: '/locales',
        handler: 'settingsController.getLocales',
        // config: {
        //   policies: [],
        //   auth: false,
        // }
    },
];
