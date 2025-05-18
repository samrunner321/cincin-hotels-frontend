# Directus Setup für CinCin Hotels

Dieses Dokument beschreibt den Einrichtungsprozess für das Directus CMS für die CinCin Hotels Plattform.

## Grundeinrichtung

1. Starte Directus mit Docker:

```bash
npm run directus:dev
```

Der Container wird auf `http://localhost:8055` gestartet und ist mit folgenden Zugangsdaten erreichbar:

- Admin E-Mail: `admin@cincinhotels.com`
- Admin Passwort: `admin123`

## Collection-Struktur

Die CinCin Hotels Plattform benötigt folgende Collections in Directus:

### Hauptcollections

1. **hotels** - Hotels und Unterkünfte
2. **rooms** - Hotelzimmer und Suiten
3. **destinations** - Reiseziele
4. **categories** - Kategorien für Hotels und Destinationen
5. **pages** - Statische Seiteninhalte
6. **translations** - Übersetzungen für mehrsprachigen Inhalt

### Viele-zu-viele Relationen

1. **hotels_categories** - Verbindung zwischen Hotels und Kategorien

## Fehlende Collections anlegen

Falls Teile der Collection-Struktur fehlen, können diese mit folgenden API-Aufrufen erstellt werden:

### Anlegen der Rooms Collection:

```bash
curl -X POST http://localhost:8055/collections \
  -H "Authorization: Bearer _hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn" \
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
}'
```

### Anlegen der Pages Collection:

```bash
curl -X POST http://localhost:8055/collections \
  -H "Authorization: Bearer _hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn" \
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
}'
```

### Anlegen der Translations Collection:

```bash
curl -X POST http://localhost:8055/collections \
  -H "Authorization: Bearer _hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn" \
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
}'
```

### Fields für die Translations Collection:

```bash
curl -X POST http://localhost:8055/fields/translations \
  -H "Authorization: Bearer _hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn" \
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
}'
```

## Prüfen vorhandener Relationen

Um zu überprüfen, ob die Relationen zwischen Collections korrekt eingerichtet sind:

```bash
curl -X GET http://localhost:8055/relations \
  -H "Authorization: Bearer _hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn"
```

## Daten importieren

Beispieldaten können in die Collections importiert werden, indem die Import-Funktion im Directus-Admin-Panel genutzt wird oder über das Skript:

```bash
npm run import-sample-data
```

## Zugriffsrechte konfigurieren

Standardmäßig sind alle Collections für öffentliche Zugriffe gesperrt. Um Lesezugriff für die öffentliche API zu erlauben:

1. Öffne das Directus Admin-Panel auf `http://localhost:8055/admin`
2. Navigiere zu Settings > Roles & Permissions
3. Wähle die "Public" Rolle
4. Aktiviere READ-Berechtigungen für die Collections: hotels, rooms, destinations, categories, pages, translations

## Frontend-Konfiguration

Um das Frontend mit dem Directus-Backend zu verbinden, muss die Datei `.env.local` mit folgenden Werten konfiguriert werden:

```
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=_hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn
```

## Fehlersuche

### API liefert keine Daten:

1. Prüfe, ob die Collections existieren: `GET /collections`
2. Prüfe, ob die öffentlichen Zugriffsrechte korrekt konfiguriert sind
3. Prüfe, ob in den Collections Einträge vorhanden sind

### Fehler bei Mehrsprachigkeit:

1. Überprüfe, ob die Translations Collection existiert und Einträge enthält
2. Überprüfe, ob die unterstützten Sprachen in der Middleware korrekt konfiguriert sind
3. Stellen Sie sicher, dass die i18n-Konfiguration korrekt ist