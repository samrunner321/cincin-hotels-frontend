# Migration der Utilities und Hilfsfunktionen

Dieses Dokument beschreibt den detaillierten Plan zur Migration der Utilities und Hilfsfunktionen in die `/src`-Struktur.

## Identifizierte Dateien für die erste Migrationsphase

Folgende Dateien wurden als geeignete Kandidaten für die erste Phase der Migration identifiziert:

### 1. Basisutilities mit minimalen Abhängigkeiten

| Datei | Aktueller Pfad | Neuer Pfad | Abhängigkeiten | Priorität |
|-------|---------------|------------|----------------|-----------|
| `utils.js` | `/lib/utils.js` | `/src/lib/utils.js` | clsx, tailwind-merge | Hoch |
| `auth-utils.js` | `/src/lib/auth-utils.js` | `/src/lib/auth-utils.js` | Keine (bereits migriert) | - |
| `auth.ts` | `/src/lib/auth.ts` | `/src/lib/auth.ts` | Keine (bereits migriert) | - |
| `logger.ts` | `/src/lib/utils/logger.ts` | `/src/lib/utils/logger.ts` | Keine (bereits migriert) | - |

### 2. API-bezogene Utilities (abhängig von externen Daten/Config)

| Datei | Aktueller Pfad | Neuer Pfad | Abhängigkeiten | Priorität |
|-------|---------------|------------|----------------|-----------|
| `directus-client.js` | `/lib/directus-client.js` | `/src/lib/api/directus-client.js` | Umgebungsvariablen | Mittel |
| `directus-api.js` | `/lib/directus-api.js` | `/src/lib/api/directus-api.js` | Zu prüfen | Mittel |
| `DirectusConfig.js` | `/app/_components/DirectusConfig.js` | `/src/components/common/DirectusConfig.jsx` | @directus/sdk, auth-utils.js | Mittel |

### 3. Mock-Daten-API (abhängig von lokalen Daten)

| Datei | Aktueller Pfad | Neuer Pfad | Abhängigkeiten | Priorität |
|-------|---------------|------------|----------------|-----------|
| `api.js` | `/lib/api.js` | `/src/lib/api/mock-api.js` | ../data/* | Niedrig |

## Migrationsschritte im Detail

### Phase 1: Basisutilities migrieren

#### Schritt 1: utils.js migrieren

1. Erstellen des Zielverzeichnisses:
   ```bash
   mkdir -p /Users/samuelrenner/cincinhotels/src/lib
   ```

2. Datei kopieren mit korrigierten Importpfaden:
   - Prüfen ob Imports absolut oder relativ sind
   - Anpassen aller Importpfade nach Bedarf
   - TypeScript-Typdefinitionen hinzufügen (optional)

3. Neue Datei speichern unter `/src/lib/utils.js` (oder `.ts`)

4. Referenzen aktualisieren:
   - Mit `grep` nach Imports von `/lib/utils` suchen
   - Alle gefundenen Referenzen auf den neuen Pfad aktualisieren

5. Testen:
   - Sicherstellen, dass alle Funktionen weiterhin korrekt funktionieren
   - Die ursprüngliche Datei vorerst beibehalten als Fallback

### Phase 2: API-bezogene Utilities migrieren

#### Schritt 1: directus-client.js migrieren

1. Erstellen des Zielverzeichnisses:
   ```bash
   mkdir -p /Users/samuelrenner/cincinhotels/src/lib/api
   ```

2. Datei kopieren mit korrigierten Importpfaden:
   - Aktualisieren der Referenz auf `auth-utils.js`
   - TypeScript-Typdefinitionen hinzufügen (optional)

3. Neue Datei speichern unter `/src/lib/api/directus-client.js`

4. Referenzen aktualisieren:
   - Mit `grep` nach Imports von `/lib/directus-client` suchen
   - Alle gefundenen Referenzen auf den neuen Pfad aktualisieren

#### Schritt 2: DirectusConfig.js migrieren

1. Erstellen des Zielverzeichnisses:
   ```bash
   mkdir -p /Users/samuelrenner/cincinhotels/src/components/common
   ```

2. Datei kopieren mit korrigierten Importpfaden:
   - Aktualisieren der Referenz auf `auth-utils.js` oder `auth.ts`
   - Umbenennen zu einer TypeScript/JSX-Datei (.jsx oder .tsx)

3. Neue Datei speichern unter `/src/components/common/DirectusConfig.jsx`

4. Referenzen aktualisieren:
   - Mit `grep` nach Imports von `/app/_components/DirectusConfig` suchen
   - Alle gefundenen Referenzen auf den neuen Pfad aktualisieren

### Phase 3: Mock-API migrieren

Da die Mock-API von den Daten im `/data`-Verzeichnis abhängt, sollte diese erst später migriert werden, wenn die Daten ebenfalls in die `/src`-Struktur migriert wurden.

## Übergangsansatz

Während der Migration empfehlen wir folgenden Ansatz:

1. **Parallel-Struktur**: Beide Versionen der Dateien beibehalten, während Referenzen schrittweise aktualisiert werden
2. **Veraltungs-Kommentare**: Kommentare in den alten Dateien hinzufügen, die auf die neue Struktur hinweisen
3. **Import-Weiterleitungen**: Temporäre Weiterleitungsdateien erstellen, die auf die neuen Pfade verweisen

Beispiel für eine Weiterleitungsdatei (`/lib/utils.js`):
```javascript
/**
 * @deprecated Diese Datei wurde nach /src/lib/utils.js verschoben
 * Bitte den Import aktualisieren zu:
 * import { ... } from '@/lib/utils';
 */
export * from '../src/lib/utils';
```

## Testplan

Nach jeder Migration einer Datei:

1. **Build-Test**: `npm run build` ausführen, um Fehler zu identifizieren
2. **Lint-Test**: `npm run lint` ausführen, um Linting-Probleme zu identifizieren
3. **Manuelle Tests**: Wichtige Funktionen der Anwendung testen, die von den migrierten Dateien abhängen

## Rollback-Plan

Für jede migrierte Datei:

1. Git-Commit vor der Migration erstellen, um einen klaren Rollback-Punkt zu haben
2. Bei Problemen: Zurückkehren zum vorherigen Commit und einen feinkörnigeren Ansatz wählen

## Nächste Schritte nach den Utilities

Nach erfolgreicher Migration der Utilities:

1. UI-Komponenten mit minimalen Abhängigkeiten migrieren
2. API-Routen migrieren
3. Seitenkomponenten migrieren
4. Layout und globale Komponenten migrieren