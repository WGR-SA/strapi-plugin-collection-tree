"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async getEntries(ctx) {
        const { model } = ctx.request.query;
        ctx.body = await strapi
            .plugin('strapi-plugin-collection-tree')
            .service('sort')
            .getEntries(model);
    },
    async saveEntries(ctx) {
        ctx.body = await strapi
            .plugin('strapi-plugin-collection-tree')
            .service('sort')
            .updateEntries(ctx.request.body.data);
    }
});
