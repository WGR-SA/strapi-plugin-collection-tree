"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    lft: {
        type: 'integer',
        default: null,
        pluginOptions: {
            i18n: {
                localized: true
            }
        }
    },
    rght: {
        type: 'integer',
        default: null,
        pluginOptions: {
            i18n: {
                localized: true
            }
        }
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
        pluginOptions: {
            i18n: {
                localized: true
            }
        }
    },
};
