
module.exports = {
  async find(ctx) {
    return await strapi.service('api::article.article').find(ctx.query);
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    return await strapi.service('api::article.article').findOne(id, ctx.query);
  },
  async create(ctx) {
    return await strapi.service('api::article.article').create(ctx.request.body);
  },
  async update(ctx) {
    const { id } = ctx.params;
    return await strapi.service('api::article.article').update(id, ctx.request.body);
  },
  async delete(ctx) {
    const { id } = ctx.params;
    return await strapi.service('api::article.article').delete(id);
  },
};
