/**
 * create-strapi-collection.js
 *
 * Ein Skript zur programmgesteuerten Erstellung einer Collection in Strapi CMS
 * durch das Erstellen von Konfigurationsdateien.
 *
 * Verwendung:
 * 1. Skript ausführen: node create-strapi-collection.js
 * 2. Strapi-Server neu starten: cd my-strapi-project && npm run develop
 */

const fs = require('fs');
const path = require('path');

// Pfad zum Strapi-Projekt
const STRAPI_PROJECT_PATH = '/Users/samuelrenner/cincinhotels/my-strapi-project';

// Collection-Daten
const collectionName = 'article';

// Inhalt der content-types Schema-Datei (schema.json)
const schemaContent = {
  kind: 'collectionType',
  collectionName: 'articles',
  info: {
    singularName: 'article',
    pluralName: 'articles',
    displayName: 'Article',
    description: 'A collection to store articles',
  },
  options: {
    draftAndPublish: true,
  },
  attributes: {
    title: {
      type: 'string',
      required: true,
      maxLength: 255,
    },
    content: {
      type: 'richtext',
    },
    author: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'plugin::users-permissions.user',
    },
  },
};

// Inhalt der Route-Datei (routes/article.js) – Angepasst für Strapi 5.x
const routesContent = `
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/articles',
      handler: 'article.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/articles/:id',
      handler: 'article.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/articles',
      handler: 'article.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/articles/:id',
      handler: 'article.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/articles/:id',
      handler: 'article.delete',
      config: { policies: [] },
    },
  ],
};
`;

// Inhalt der Controller-Datei (controllers/article.js)
const controllerContent = `
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
`;

// Inhalt der Service-Datei (services/article.js)
const serviceContent = `
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
`;

/**
 * Erstellt die Konfigurationsdateien für eine Strapi-Collection
 */
async function createStrapiCollection() {
  try {
    // Lösche die alte article-Collection, falls vorhanden
    const oldCollectionDir = path.join(STRAPI_PROJECT_PATH, 'src/api', 'article');
    if (fs.existsSync(oldCollectionDir)) {
      fs.rmSync(oldCollectionDir, { recursive: true, force: true });
      console.log(`Altes Verzeichnis article gelöscht: ${oldCollectionDir}`);
    }

    // Erstelle das Verzeichnis für die Collection
    const collectionDir = path.join(STRAPI_PROJECT_PATH, 'src/api', collectionName);
    if (!fs.existsSync(collectionDir)) {
      fs.mkdirSync(collectionDir, { recursive: true });
      console.log(`Verzeichnis für ${collectionName} erstellt: ${collectionDir}`);
    }

    // Erstelle die content-types Schema-Datei
    const schemaPath = path.join(collectionDir, 'content-types', collectionName, 'schema.json');
    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(schemaPath, JSON.stringify(schemaContent, null, 2));
    console.log(`Schema-Datei erstellt: ${schemaPath}`);

    // Erstelle die Route-Datei
    const routesPath = path.join(collectionDir, 'routes', `${collectionName}.js`);
    fs.mkdirSync(path.dirname(routesPath), { recursive: true });
    fs.writeFileSync(routesPath, routesContent);
    console.log(`Route-Datei erstellt: ${routesPath}`);

    // Erstelle die Controller-Datei
    const controllerPath = path.join(collectionDir, 'controllers', `${collectionName}.js`);
    fs.mkdirSync(path.dirname(controllerPath), { recursive: true });
    fs.writeFileSync(controllerPath, controllerContent);
    console.log(`Controller-Datei erstellt: ${controllerPath}`);

    // Erstelle die Service-Datei
    const servicePath = path.join(collectionDir, 'services', `${collectionName}.js`);
    fs.mkdirSync(path.dirname(servicePath), { recursive: true });
    fs.writeFileSync(servicePath, serviceContent);
    console.log(`Service-Datei erstellt: ${servicePath}`);

    console.log('Collection erfolgreich erstellt! Bitte starte den Strapi-Server neu, um die Änderungen zu übernehmen:');
    console.log('cd my-strapi-project && npm run develop');
  } catch (error) {
    console.error('Fehler:', error.message);
    process.exit(1);
  }
}

// Skript ausführen
createStrapiCollection();