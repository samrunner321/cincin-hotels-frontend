# Migration Tools Dokumentation

Diese Dokumentation beschreibt die optimierten Migrationstools für das CinCin Hotels Projekt, die für die Konsolidierung der Projektstruktur und die Migration von JavaScript zu TypeScript verwendet werden.

## Übersicht

Die folgenden Tools wurden entwickelt, um die Migration von JavaScript zu TypeScript zu erleichtern und dabei speichereffizient zu arbeiten:

1. **Komponenten-Analyse-Tool**: Analysiert React-Komponenten und extrahiert Informationen wie Props, Hooks und Abhängigkeiten.
2. **TypeScript-Konvertierungs-Tool**: Konvertiert JavaScript/JSX-Komponenten zu TypeScript/TSX mit automatischer Typerkennung.
3. **API-Routen-Migrations-Tool**: Migriert API-Routen von `/app/api` zu `/src/app/api` und konvertiert sie zu TypeScript.
4. **Wrapper-Skript**: Führt die Tools mit erhöhtem Speicherlimit aus, um "JavaScript Heap Out of Memory" Fehler zu vermeiden.

## Anforderungen

- Node.js 14+ (18 empfohlen)
- Ausreichend RAM (8GB+)

## Installation und Verwendung

Alle Tools befinden sich im Projektverzeichnis unter `/scripts` und `/migration-tools`.

### 1. Wrapper-Skript

Das Wrapper-Skript `migration-tools.js` ist der bevorzugte Einstiegspunkt für alle Migrationstools.

```bash
# Informationen anzeigen
node scripts/migration-tools.js info

# Komponenten analysieren
node scripts/migration-tools.js analyze "components/**/*.jsx" --batch-size=20

# Komponenten zu TypeScript konvertieren
node scripts/migration-tools.js convert "components/**/*.jsx" --output-dir=src/components

# Cache-Dateien bereinigen
node scripts/migration-tools.js clean-cache
```

Optionen:
- `--memory=<MB>`: Speicherlimit in MB (Standard: 8192, Max: 16384)
- `--batch-size=<number>`: Anzahl der Dateien pro Batch (Standard: 10)
- `--concurrency=<number>`: Anzahl paralleler Worker (Standard: CPU-Kerne - 1)
- `--output-dir=<path>`: Ausgabeverzeichnis
- `--dry-run`: Keine Änderungen vornehmen, nur simulieren
- `--summary`: Zusammenfassung erstellen
- `--checkpoint`: Checkpoints für inkrementelle Verarbeitung aktivieren

### 2. Komponenten-Analyse-Tool

Dieses Tool analysiert React-Komponenten und extrahiert wichtige Informationen:

```bash
# Direkte Verwendung (nicht empfohlen)
node migration-tools/analyzeComponent.optimized.js src/components/Button.jsx

# Besser: Über das Wrapper-Skript
node scripts/migration-tools.js analyze "components/hotels/**.jsx"
```

Funktionen:
- Batch-Verarbeitung für mehrere Dateien
- Multi-Threading für parallele Verarbeitung
- Speicher-Optimierung zur Vermeidung von Heap-Fehlern
- Detaillierte Analyse von Props, Hooks, Imports usw.

### 3. TypeScript-Konvertierungs-Tool

Dieses Tool konvertiert JavaScript/JSX-Komponenten zu TypeScript/TSX:

```bash
# Direkte Verwendung (nicht empfohlen)
node migration-tools/convertToTypeScript.optimized.js src/components/Button.jsx

# Besser: Über das Wrapper-Skript
node scripts/migration-tools.js convert "components/hotels/**.jsx" --output-dir=src/components
```

Funktionen:
- Intelligente Typerkennung für Props und Hooks
- Erstellung von TypeScript-Interfaces
- Event-Handler-Typen automatisch ableiten
- Inkrementelle Konvertierung mit Checkpoints

### 4. API-Routen-Migrations-Tool

Dieses Tool migriert API-Routen von `/app/api` zu `/src/app/api`:

```bash
node scripts/migrate-api-routes.js [--dry-run] [--verbose]
```

Funktionen:
- Migration von JavaScript zu TypeScript
- Standardisierte Fehlerbehandlung und Caching
- Korrektur von Import-Pfaden für die neue Struktur

## Optimierte Speichernutzung

Die Tools wurden optimiert, um mit großen Codebasen umzugehen und "JavaScript Heap Out of Memory" Fehler zu vermeiden:

1. **Batch-Verarbeitung**: Dateien werden in kleinen Gruppen verarbeitet, um den Speicherverbrauch zu begrenzen.
2. **Worker-Threads**: Parallele Verarbeitung mit isolierten Speicherbereichen.
3. **Explicit Garbage Collection**: Manuelle Speicherfreigabe nach Batches.
4. **Inkrementelle Verarbeitung**: Checkpoints ermöglichen die Fortsetzung nach Abbrüchen.
5. **Streaming-Verarbeitung**: Große ASTs werden nicht im Speicher gehalten.

## Bekannte Einschränkungen

- **AST-Manipulation**: Die Tools können komplexe Sprachfeatures nicht immer korrekt erkennen.
- **TypeScript-Typen**: Automatisch abgeleitete Typen sind manchmal zu allgemein und müssen manuell angepasst werden.
- **Babel-Plugins**: Einige Babel-Plugins werden nicht unterstützt und könnten zu Problemen führen.

## Fehlerbehebung

### JavaScript Heap Out of Memory

Wenn dieser Fehler trotz Optimierungen auftritt:

1. Erhöhen Sie den verfügbaren Speicher: `--memory=12288` oder `--memory=16384`
2. Reduzieren Sie die Batch-Größe: `--batch-size=5`
3. Beschränken Sie den Umfang: Arbeiten Sie mit kleineren Teilmengen des Codes

### Fehlerhafte TypeScript-Konvertierung

Bei Problemen mit der TypeScript-Konvertierung:

1. Überprüfen Sie die generierten Dateien auf Fehler
2. Verwenden Sie `--dry-run`, um die Konvertierung zu testen, ohne Dateien zu schreiben
3. Konvertieren Sie kritische Komponenten einzeln und manuell

## Best Practices

1. **Inkrementelles Vorgehen**: Konvertieren Sie Komponenten schrittweise, nicht alle auf einmal.
2. **Testen nach Konvertierung**: Stellen Sie sicher, dass konvertierte Komponenten wie erwartet funktionieren.
3. **Git-Branches**: Arbeiten Sie in separaten Branches für größere Migrationen.
4. **TypeScript-Config**: Passen Sie die `tsconfig.json` an, wenn Typprobleme auftreten.
5. **Checkpoint-Verwendung**: Nutzen Sie Checkpoints für lange Konvertierungen, um Fortschritte zu speichern.

## Weiterentwicklung

Die Migrationstools können wie folgt weiterentwickelt werden:

1. **Verbesserte Typinferenz**: Intelligent Typen aus der Nutzung ableiten
2. **Plugin-System**: Support für benutzerdefinierte Transformationen
3. **Integration mit Type Checkers**: Automatische Überprüfung der generierten TypeScript-Dateien

## Hilfe und Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Project Repository oder wenden Sie sich an das Entwicklungsteam.