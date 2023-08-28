"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    lft: {
        type: 'integer',
        default: null,
    },
    rght: {
        type: 'integer',
        default: null,
    },
    parent: {
        type: "relation",
        relation: "manyToOne",
        target: "api::page.page",
        inversedBy: "children"
    },
    children: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'collection',
        mappedBy: 'parent',
    },
    tree: {
        type: 'string',
        default: null,
    },
};
