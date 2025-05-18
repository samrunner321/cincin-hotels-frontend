#!/bin/bash

# Setup-Skript für Directus-Collections für CinCin Hotels

# Konfiguration
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=_hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn

# Farben für Terminal-Ausgabe
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Erstelle fehlende Collections für CinCin Hotels...${NC}"

# Prüfe, ob Directus erreichbar ist
if ! curl -s -f -I $DIRECTUS_URL > /dev/null; then
  echo -e "${RED}Fehler: Directus ist nicht erreichbar unter $DIRECTUS_URL${NC}"
  echo "Bitte stelle sicher, dass Directus läuft mit: npm run directus:dev"
  exit 1
fi

# Prüfe, ob der Token gültig ist
if ! curl -s -H "Authorization: Bearer $DIRECTUS_TOKEN" $DIRECTUS_URL/users/me | grep -q "id"; then
  echo -e "${RED}Fehler: Der Directus-Token ist ungültig${NC}"
  exit 1
fi

# Prüfe, ob die Collections bereits existieren
echo -e "Prüfe bestehende Collections..."
EXISTING_COLLECTIONS=$(curl -s -H "Authorization: Bearer $DIRECTUS_TOKEN" $DIRECTUS_URL/collections | jq -r '.data[].collection')

# Function to check if collection exists
collection_exists() {
  echo "$EXISTING_COLLECTIONS" | grep -q "^$1$"
  return $?
}

echo -e "\n${YELLOW}1. Erstelle Rooms Collection...${NC}"
if collection_exists "rooms"; then
  echo -e "${GREEN}Die Collection 'rooms' existiert bereits.${NC}"
else
  curl -s -X POST $DIRECTUS_URL/collections \
    -H "Authorization: Bearer $DIRECTUS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
    "collection": "rooms",
    "meta": {
      "collection": "rooms",
      "icon": "king_bed",
      "note": "Hotel rooms and suites",
      "display_template": "{{name}} ({{hotel.name}})",
      "hidden": false,
      "singleton": false,
      "sort_field": "sort",
      "archive_field": "status",
      "archive_value": "archived",
      "unarchive_value": "draft"
    },
    "schema": {
      "name": "rooms"
    }
  }' | jq -r '.data.collection' > /dev/null && echo -e "${GREEN}Collection 'rooms' erfolgreich erstellt${NC}" || echo -e "${RED}Fehler beim Erstellen der Collection 'rooms'${NC}"
fi

echo -e "\n${YELLOW}2. Erstelle Pages Collection...${NC}"
if collection_exists "pages"; then
  echo -e "${GREEN}Die Collection 'pages' existiert bereits.${NC}"
else
  curl -s -X POST $DIRECTUS_URL/collections \
    -H "Authorization: Bearer $DIRECTUS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
    "collection": "pages",
    "meta": {
      "collection": "pages",
      "icon": "article",
      "note": "Content pages like About, Privacy Policy, etc.",
      "display_template": "{{title}}",
      "hidden": false,
      "singleton": false,
      "sort_field": "sort",
      "archive_field": "status",
      "archive_value": "archived",
      "unarchive_value": "draft"
    },
    "schema": {
      "name": "pages"
    }
  }' | jq -r '.data.collection' > /dev/null && echo -e "${GREEN}Collection 'pages' erfolgreich erstellt${NC}" || echo -e "${RED}Fehler beim Erstellen der Collection 'pages'${NC}"
fi

echo -e "\n${YELLOW}3. Erstelle Translations Collection...${NC}"
if collection_exists "translations"; then
  echo -e "${GREEN}Die Collection 'translations' existiert bereits.${NC}"
else
  curl -s -X POST $DIRECTUS_URL/collections \
    -H "Authorization: Bearer $DIRECTUS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
    "collection": "translations",
    "meta": {
      "collection": "translations",
      "icon": "translate",
      "note": "UI and content translations",
      "display_template": "{{key}} ({{language}})",
      "hidden": false
    },
    "schema": {
      "name": "translations"
    }
  }' | jq -r '.data.collection' > /dev/null && echo -e "${GREEN}Collection 'translations' erfolgreich erstellt${NC}" || echo -e "${RED}Fehler beim Erstellen der Collection 'translations'${NC}"

  # Fields für die Translations Collection
  echo "Erstelle Felder für Translations..."
  curl -s -X POST $DIRECTUS_URL/fields/translations \
    -H "Authorization: Bearer $DIRECTUS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": {
          "hidden": true,
          "readonly": true,
          "interface": "input",
          "special": ["uuid"]
        },
        "schema": {
          "is_primary_key": true
        }
      },
      {
        "field": "language",
        "type": "string",
        "meta": {
          "width": "half",
          "interface": "select-dropdown",
          "options": {
            "choices": [
              {"text": "English (US)", "value": "en-US"},
              {"text": "Deutsch (DE)", "value": "de-DE"}
            ]
          },
          "required": true,
          "note": "Language code"
        },
        "schema": {
          "is_nullable": false
        }
      },
      {
        "field": "key",
        "type": "string",
        "meta": {
          "width": "half",
          "interface": "input",
          "required": true,
          "note": "Translation key (e.g. common.welcome)"
        },
        "schema": {
          "is_nullable": false
        }
      },
      {
        "field": "value",
        "type": "text",
        "meta": {
          "width": "full",
          "interface": "input-multiline",
          "required": true,
          "note": "Translated text"
        },
        "schema": {
          "is_nullable": false
        }
      }
    ]
  }' > /dev/null && echo -e "${GREEN}Felder für 'translations' erfolgreich erstellt${NC}" || echo -e "${RED}Fehler beim Erstellen der Felder für 'translations'${NC}"
fi

echo -e "\n${YELLOW}4. Überprüfe Relationen...${NC}"
# Relation zwischen Hotels und Rooms
curl -s -X POST $DIRECTUS_URL/relations \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "collection": "rooms",
  "field": "hotel",
  "related_collection": "hotels",
  "meta": {
    "one_field": "rooms",
    "sort_field": "sort",
    "one_collection_field": "hotel"
  },
  "schema": {
    "on_delete": "CASCADE"
  }
}' > /dev/null 2>&1

echo -e "\n${GREEN}Setup der Directus-Collections abgeschlossen!${NC}"
echo -e "Um die Collections im Frontend zu verwenden, stelle sicher, dass die .env.local Datei korrekt konfiguriert ist."
echo -e "Füge Beispieldaten hinzu mit: npm run import-sample-data"