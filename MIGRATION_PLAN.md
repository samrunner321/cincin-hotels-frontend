# Migrationsplan für CinCin Hotels

Dieses Dokument beschreibt den Plan zur Standardisierung der Projektstruktur auf `/src`. Der Fokus liegt darauf, eine konsistente und wartbare Codebasis zu schaffen, die den Best Practices von Next.js folgt.

## Hintergrund

Derzeit verwendet das Projekt eine Mischung aus:
- `/app` (Next.js App Router Komponenten)
- `/src/app` (Next.js App Router Komponenten in einer src-Struktur)
- `/components` (React-Komponenten)
- `/src/components` (React-Komponenten in einer src-Struktur)
- `/lib` (Hilfsfunktionen und Utilities)
- `/src/lib` (Hilfsfunktionen und Utilities in einer src-Struktur)

Diese Inkonsistenz führt zu Verwirrung bei Imports und kann Fehler verursachen.

## Zielstruktur

```
/src/                # Alles Quellcode in einem Verzeichnis
  ├── app/           # Next.js App Router Seiten und Layouts
  │   ├── api/       # API-Routen
  │   ├── hotels/    # Hotels-Seiten
  │   └── ...        # Andere Seiten und Routen
  ├── components/    # React-Komponenten
  │   ├── common/    # Allgemeine Komponenten
  │   ├── hotels/    # Hotel-bezogene Komponenten
  │   └── ...        # Andere Komponenten
  ├── hooks/         # Custom React Hooks
  ├── lib/           # Hilfsfunktionen und Utilities
  │   ├── api/       # API-Funktionen
  │   ├── auth.ts    # Authentifizierungs-Funktionen
  │   └── ...        # Andere Hilfsfunktionen
  └── middleware.ts  # Next.js Middleware
/public/             # Statische Assets (bleibt unverändert)
/docs/               # Dokumentation (bleibt unverändert)
```

## Migrationsschritte

### Phase 1: Vorbereitung

1. ✅ jsconfig.json/tsconfig.json aktualisieren, um `@/*` auf `/src/*` zu mappen
2. ✅ Migrationsplan erstellen und dokumentieren (diese Datei)
3. Temporäre "Legacy"-Imports einrichten, um Kompatibilität während der Migration zu gewährleisten

### Phase 2: Migrationsprioritäten

Wir migrieren die Dateien in folgender Reihenfolge:

#### Hohe Priorität (✅ Abgeschlossen)
1. ✅ Grundlegende Bibliotheken und Utilities (`/lib` → `/src/lib`)
2. ✅ Middleware und Konfigurationsdateien (Root → `/src`)
   - ✅ Middleware-Datei korrigiert
   - ✅ Sprachumschaltung implementiert
   - ✅ Root-Page funktioniert
3. ✅ API-Routen (`/app/api` → `/src/app/api`)
   - ✅ Basisimplementierung für API-Routen

#### Mittlere Priorität (In Bearbeitung)
4. 🔄 Komponenten (`/components` → `/src/components`)
5. 🔄 App-Ordner (`/app` → `/src/app`)
   - ✅ Basis-Layout implementiert
   - ✅ Internationale Routing-Struktur implementiert
   - ✅ Weiterleitungen von altem auf neuen App-Ordner eingerichtet

#### Niedrige Priorität
6. Restliche Dateien und Spezialfälle

### Phase 3: Durchführung der Migration

Für jede zu migrierende Datei oder Verzeichnis:

1. Datei in den neuen Standort in `/src` verschieben
2. Alle Imports innerhalb der Datei aktualisieren
3. Alle Imports, die auf diese Datei verweisen, aktualisieren
4. Testen, ob alles weiterhin funktioniert

### Phase 4: Validierung

1. Alle Seiten und Funktionen des Projekts testen
2. Entwicklungsserver, Build und Deployment testen
3. Lint-Fehler und Warnungen überprüfen

### Phase 5: Aufräumen

1. Temporäre "Legacy"-Imports entfernen
2. Veraltete Dateien und Verzeichnisse entfernen
3. Dokumentation aktualisieren

## Best Practices für die Migration

1. **Schrittweise vorgehen**: Immer nur eine kleine Gruppe verwandter Dateien gleichzeitig migrieren
2. **Nach jedem Schritt testen**: Stellen Sie sicher, dass die Anwendung nach jeder Migration noch funktioniert
3. **Commit-Frequenz**: Häufig committen, jeder Commit sollte einen logischen Migrationsschritt darstellen
4. **Beschreibende Commit-Nachrichten**: Klar dokumentieren, welche Dateien migriert wurden

## Vorsichtsmaßnahmen

- **Backup**: Vor Beginn der Migration sicherstellen, dass alles in Git committet ist
- **Branching**: Migration in einem separaten Git-Branch durchführen
- **Parallele Entwicklung**: Während der Migration sollten keine neuen Features entwickelt werden

## Testplan nach der Migration

- Entwicklungsserver starten: `npm run dev`
- Build erstellen: `npm run build`
- Alle Hauptseiten testen:
  - Homepage
  - Hotelverzeichnis
  - Einzelne Hotelseite
  - Destinationsseiten
  - API-Endpunkte

## Rollback-Plan

Falls die Migration zu Problemen führt, die nicht schnell gelöst werden können:

1. Änderungen verwerfen und zum Haupt-Branch zurückkehren
2. Einen neuen, inkrementelleren Ansatz wählen
3. Probleme dokumentieren und einzeln beheben