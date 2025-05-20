# Mock Directus CMS

Diese Verzeichnis enthält Mock-Implementierungen und Daten für die Entwicklung ohne ein laufendes Directus CMS.

## Funktionsweise

Der Mock-Modus wird durch das Setzen von `IS_MOCK_SERVER=true` in der `.env.local`-Datei aktiviert. Wenn aktiviert, werden statt echter API-Anfragen lokale JSON-Dateien gelesen.

## Verzeichnisse

- `/data/` - Enthält JSON-Datendateien (destinations.json, hotels.json, categories.json)
- `/server.js` - Ein einfacher HTTP-Server, der eine Directus API simuliert (optional)
- `/simple-server.js` - Eine noch einfachere Implementierung für Validierungszwecke

## Mock-Bilder

Bilder werden aus dem Verzeichnis `/public/mock-images/` bereitgestellt. In einer echten Umgebung würden diese von Directus geliefert.

## Verwendung

1. Setze `IS_MOCK_SERVER=true` in `.env.local`
2. Führe `npm run directus:seed` aus, um Test-Daten zu generieren
3. Führe `npm run directus:validate` aus, um die Konfiguration zu überprüfen
4. Starte die App mit `npm run dev`

Die angepassten API-Client-Funktionen in `src/lib/directus.ts` erkennen automatisch den Mock-Modus und verwenden die lokalen Daten anstelle von API-Aufrufen.

## Einschränkungen

Der Mock-Modus implementiert nur grundlegende Funktionen:

- Einfache Filterung (keine komplexen Abfragen)
- Keine vollständige Unterstützung für Beziehungen
- Kein Suchen und Sortieren
- Keine Authentifizierung

Diese Einschränkungen sind für die Entwicklung akzeptabel, aber für Produktion sollte immer ein echtes Directus CMS verwendet werden.