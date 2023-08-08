"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    lft: {
        type: "integer",
        visible: false,
        default: null
    },
    rght: {
        type: "integer",
        visible: false,
        default: null
    },
    parent: {
        type: "relation",
        relation: 'oneToOne',
        target: "collection",
        visible: true
    }
};
