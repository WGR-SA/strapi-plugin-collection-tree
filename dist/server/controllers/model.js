"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    isLocalized(ctx) {
        ctx.body = strapi
            .plugin('strapi-plugin-collection-tree')
            .service('models')
            .isLocalized(ctx.request.body.data.model);
    },
    async getDisplayField(ctx) {
        const { model } = ctx.request.query;
        ctx.body = await strapi
            .plugin('strapi-plugin-collection-tree')
            .service('models')
            .getDisplayField(model);
    }
});
