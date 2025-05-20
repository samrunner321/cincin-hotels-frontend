/**
 * create-collection.js
 *
 * Ein Skript zur programmgesteuerten Erstellung einer Collection in Directus CMS
 * mit Joi-Validierung und nativem Node.js fetch für API-Anfragen.
 *
 * Verwendung:
 * 1. Abhängigkeit installieren: npm install joi
 * 2. Skript ausführen: node create-collection.js
 */

const Joi = require('joi');

// Konfiguration für Directus
const DIRECTUS_URL = 'http://localhost:8055';
const API_TOKEN = '08YA1Mqru5VFAudLx851OSkMaFIkK0U4'; // Neuer API-Token

// Joi-Schemata
const collectionSchema = Joi.object({
  collection: Joi.string().required().not().empty(),
  meta: Joi.object().optional(),
  schema: Joi.object().optional(),
});

const fieldsSchema = Joi.array().items(
  Joi.object({
    field: Joi.string().required().not().empty(),
    type: Joi.string().required().not().empty(),
    meta: Joi.object().optional(),
    schema: Joi.object().optional(),
  })
);

// Collection-Daten
const collectionData = {
  collection: 'articles',
  meta: {
    display_template: '{{title}}',
    icon: 'article',
  },
};

// Felder-Daten
const fieldsData = [
  {
    field: 'title',
    type: 'string',
    meta: {
      interface: 'input',
      required: true,
      display_name: 'Titel',
    },
    schema: {
      is_nullable: false,
      max_length: 255,
    },
  },
  {
    field: 'content',
    type: 'text',
    meta: {
      interface: 'input-rich-text-html',
      display_name: 'Inhalt',
    },
    schema: {
      is_nullable: true,
    },
  },
  {
    field: 'author',
    type: 'integer',
    meta: {
      interface: 'select-dropdown-m2o',
      special: ['m2o'],
      required: false,
      display_name: 'Autor',
      note: 'Autor des Artikels',
      related_collection: 'directus_users',
    },
    schema: {
      is_nullable: true,
      foreign_key_table: 'directus_users',
      foreign_key_column: 'id',
    },
  },
];

/**
 * Führt eine API-Anfrage an Directus aus
 * @param {string} method - HTTP-Methode (GET, POST, etc.)
 * @param {string} path - API-Pfad (z.B. '/collections')
 * @param {Object} [body] - Optionaler Request-Body
 * @returns {Promise<Object>} - Antwort-Daten
 */
async function directusRequest(method, path, body) {
  const url = `${DIRECTUS_URL}${path}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP-Fehler ${response.status}: ${JSON.stringify(data.errors || data)}`);
  }

  return data;
}

/**
 * Erstellt eine Collection und ihre Felder in Directus
 */
async function createDirectusCollection() {
  try {
    // Prüfe API-Token
    if (!API_TOKEN) {
      throw new Error('API-Token fehlt. Definiere API_TOKEN im Skript.');
    }

    // Validiere Collection
    console.log('Validiere Collection-Daten...');
    const { error: collectionError } = collectionSchema.validate(collectionData);
    if (collectionError) {
      throw new Error(`Validierungsfehler bei der Collection: ${collectionError.message}`);
    }

    // Validiere Felder
    console.log('Validiere Felder-Daten...');
    const { error: fieldsError } = fieldsSchema.validate(fieldsData);
    if (fieldsError) {
      throw new Error(`Validierungsfehler bei den Feldern: ${fieldsError.message}`);
    }

    // Prüfe, ob Collection existiert
    console.log('Prüfe bestehende Collections...');
    const collectionsResponse = await directusRequest('GET', '/collections');
    const collections = collectionsResponse.data || [];
    let collectionExists = collections.some(col => col.collection === collectionData.collection);

    // Erstelle Collection, falls sie nicht existiert
    if (!collectionExists) {
      console.log('Erstelle Collection...');
      await directusRequest('POST', '/collections', collectionData);
      console.log(`Collection '${collectionData.collection}' erfolgreich erstellt.`);
    } else {
      console.log(`Collection '${collectionData.collection}' existiert bereits.`);
    }

    // Prüfe, ob directus_users existiert
    if (!collections.some(col => col.collection === 'directus_users')) {
      throw new Error('System-Collection directus_users fehlt. Überprüfe die Directus-Installation.');
    }

    // Prüfe Berechtigungen für directus_fields
    console.log('Prüfe Berechtigungen für Felder...');
    try {
      await directusRequest('GET', '/fields/directus_fields');
    } catch (error) {
      if (error.message.includes('HTTP-Fehler 403')) {
        throw new Error(
          'Fehlende Berechtigungen für directus_fields. ' +
          'Gehe in der Directus-UI zu Einstellungen > Rollen > deine Rolle > System-Collections > directus_fields ' +
          'und setze Erstellen, Lesen, Aktualisieren auf Erlauben.'
        );
      }
      throw error;
    }

    // Prüfe vorhandene Felder
    console.log('Prüfe vorhandene Felder...');
    let existingFields = [];
    try {
      const existingFieldsResponse = await directusRequest('GET', `/fields/${collectionData.collection}`);
      existingFields = existingFieldsResponse.data || [];
    } catch (error) {
      if (error.message.includes('HTTP-Fehler 403')) {
        console.warn(
          'Konnte vorhandene Felder nicht prüfen (fehlende Leseberechtigungen für articles). ' +
          'Versuche, Felder trotzdem zu erstellen. Stelle sicher, dass deine Rolle Schreibrechte für articles hat.'
        );
      } else {
        throw error;
      }
    }

    // Erstelle Felder, falls sie nicht existieren
    console.log('Erstelle Felder...');
    for (const fieldData of fieldsData) {
      if (existingFields.some(field => field.field === fieldData.field)) {
        console.log(`Feld '${fieldData.field}' existiert bereits in '${collectionData.collection}'. Überspringe Erstellung.`);
        continue;
      }
      try {
        await directusRequest('POST', `/fields/${collectionData.collection}`, fieldData);
        console.log(`Feld '${fieldData.field}' erfolgreich zur Collection '${collectionData.collection}' hinzugefügt.`);
      } catch (error) {
        if (error.message.includes('HTTP-Fehler 403')) {
          throw new Error(
            `Fehlende Berechtigungen für die Erstellung von Feld '${fieldData.field}' in '${collectionData.collection}'. ` +
            'Gehe in der Directus-UI zu Einstellungen > Rollen > deine Rolle > Collections > articles ' +
            'und setze Erstellen, Aktualisieren auf Erlauben. Stelle auch sicher, dass directus_fields Schreibrechte hat.'
          );
        }
        throw error;
      }
    }

    console.log('Collection mit allen Feldern erfolgreich konfiguriert!');
  } catch (error) {
    console.error('Fehler:', error.message);
    console.error('Stacktrace:', error.stack);
    if (error.message.includes('HTTP-Fehler')) {
      const statusMatch = error.message.match(/HTTP-Fehler (\d+)/);
      const status = statusMatch ? parseInt(statusMatch[1]) : null;
      switch (status) {
        case 401:
          console.error('Ungültiger Token: Überprüfe den API-Token.');
          break;
        case 403:
          console.error(
            'Berechtigungsfehler: Überprüfe die Benutzerrolle. ' +
            'Stelle sicher, dass Schreibrechte (Erstellen, Lesen, Aktualisieren) für directus_fields und articles in der Directus-UI gesetzt sind.'
          );
          break;
        case 409:
          console.error('Konflikt: Die Collection oder das Feld existiert bereits.');
          break;
        case 422:
          console.error('Ungültige Payload: Überprüfe die Struktur der gesendeten Daten.');
          break;
        case 500:
          console.error('Serverfehler: Überprüfe die Directus-Installation.');
          break;
        default:
          console.error(`HTTP-Fehler: ${status || 'Unbekannt'}`);
      }
    }
    process.exit(1);
  }
}

// Skript ausführen
createDirectusCollection();