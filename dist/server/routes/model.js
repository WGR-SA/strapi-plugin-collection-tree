"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: 'POST',
        path: '/is-localized',
        handler: 'modelController.isLocalized',
    },
    {
        method: 'GET',
        path: '/display-field',
        handler: 'modelController.getDisplayField',
    },
];
