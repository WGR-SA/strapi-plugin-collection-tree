"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    lft: {
        type: 'integer',
        default: null
    },
    rght: {
        type: 'integer',
        default: null
    },
    children: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'collection',
        mappedBy: 'parent'
    }
};
