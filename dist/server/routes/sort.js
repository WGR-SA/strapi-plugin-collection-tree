"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: 'GET',
        path: '/entries',
        handler: 'sortController.getEntries',
    },
    {
        method: 'POST',
        path: '/entries',
        handler: 'sortController.saveEntries',
    },
];
