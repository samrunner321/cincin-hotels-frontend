# Directus CMS Setup für CinCin Hotels

Diese Anleitung beschreibt, wie das Backend mit Directus CMS für das CinCin Hotels Projekt eingerichtet wird.

## Voraussetzungen

- Docker und Docker Compose
- Node.js und npm

## Installation und Start

1. Starten Sie das Directus CMS mit Docker Compose:

```bash
docker-compose up -d
```

2. Öffnen Sie Directus im Browser:

```
http://localhost:8055
```

3. Melden Sie sich an mit:
   - E-Mail: `admin@cincinhotels.com`
   - Passwort: `CinCin2023!`

## Konfiguration

### Umgebungsvariablen

Die Verbindung zwischen Next.js und Directus wird über Umgebungsvariablen in der `.env.local` Datei konfiguriert:

```
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=<YOUR_API_TOKEN>
```

Der API-Token muss in Directus generiert werden:

1. Navigieren Sie zu **Einstellungen > Rollen & Berechtigungen > API-Token**
2. Erstellen Sie einen neuen API-Token mit den erforderlichen Berechtigungen
3. Kopieren Sie den Token in die `.env.local` Datei

### Berechtigungen einrichten

Für den öffentlichen Zugriff auf Inhalte:

1. Navigieren Sie zu **Einstellungen > Rollen & Berechtigungen**
2. Wählen Sie die Rolle **Public**
3. Aktivieren Sie Leseberechtigungen für:
   - destinations
   - hotels
   - categories
   - files (für Bilder)

## Collections und Felder

Die Hauptsammlungen (Collections) für das Projekt sind:

- **hotels** - Für Hoteleinträge
- **destinations** - Für Reiseziele
- **categories** - Für Kategorien/Tags
- **rooms** - Für Hotelzimmer
- **pages** - Für statische Seiteninhalte

Das Schema ist in `directus/config/schema.json` definiert und enthält alle Feldkonfigurationen.

## Beziehungen

Die wichtigsten Beziehungen zwischen den Collections:

1. **Destinations zu Hotels**: Eine One-to-Many-Beziehung, bei der ein Hotel einer Destination zugeordnet ist
2. **Categories zu Hotels/Destinations**: Many-to-Many-Beziehungen für Kategorisierung
3. **Hotels zu Rooms**: One-to-Many-Beziehung für Zimmer in Hotels

## Test-Daten

Initial werden Test-Daten für Destinations eingefügt. Um weitere Test-Daten hinzuzufügen oder zu bearbeiten:

1. Verwenden Sie das Directus Admin-Interface
2. Oder bearbeiten Sie die Seed-Datei in `directus/config/seed.js`

## Webhooks und Aktualisierungen

Webhooks sind konfiguriert, um automatisch Next.js zu benachrichtigen, wenn Inhalte aktualisiert werden:

1. **Revalidate Destination Pages**: Aktualisiert die Destinations-Übersichtsseite
2. **Revalidate Specific Destination**: Aktualisiert spezifische Destinationsseiten 
3. **Notify on Destination Changes**: Sendet detaillierte Änderungsinformationen

## Assets und Medien

Alle Bilder und Medien werden in Directus hochgeladen und über den Asset-Endpunkt bereitgestellt:

```
http://localhost:8055/assets/FILE_ID
```

Die Komponente `DirectusImage` ist für die optimierte Anzeige von Bildern aus Directus konfiguriert.

## Fehlerbehebung

Bei Problemen mit der Verbindung:

1. Überprüfen Sie, ob Directus läuft: `docker-compose ps`
2. Prüfen Sie die Logs: `docker-compose logs directus`
3. Stellen Sie sicher, dass die API-Token gültig sind
4. Überprüfen Sie die CORS-Einstellungen in Docker-Compose, falls Probleme mit API-Anfragen auftreten

## Multilingual-Unterstützung

Directus unterstützt mehrsprachige Inhalte über seine Übersetzungsfunktion:

1. Navigieren Sie zu **Einstellungen > Sprachen**
2. Fügen Sie die unterstützten Sprachen hinzu (z.B. DE, EN)
3. Aktivieren Sie bei den Collections die Übersetzungsfunktion für relevante Felder

## Backup und Migration

Für Backups der Directus-Datenbank:

```bash
docker-compose exec directus npx directus schema snapshot /directus/database/backup.yaml
```

Für Wiederherstellung:

```bash
docker-compose exec directus npx directus schema apply /directus/database/backup.yaml
```