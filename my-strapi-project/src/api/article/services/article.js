
module.exports = {
  async find(query) {
    return await strapi.entityService.findMany('api::article.article', query);
  },
  async findOne(id, query) {
    return await strapi.entityService.findOne('api::article.article', id, query);
  },
  async create(data) {
    return await strapi.entityService.create('api::article.article', data);
  },
  async update(id, data) {
    return await strapi.entityService.update('api::article.article', id, data);
  },
  async delete(id) {
    return await strapi.entityService.delete('api::article.article', id);
  },
};
