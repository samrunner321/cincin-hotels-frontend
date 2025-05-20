# Komponentenmigration für CinCin Hotels

## Aktuelle Situation

Das Projekt hat derzeit zwei parallele Komponentenstrukturen:

1. **/components/** - Die ursprünglichen, vollständigen Komponenten mit allen funktionalen und visuellen Eigenschaften
2. **/src/components/** - Vereinfachte oder unvollständige Versionen der Komponenten

Die bisherige Migrationsstrategie versuchte, Komponenten aus `/components` nach `/src/components` zu verschieben und dabei umzuschreiben, was zu Funktions- und Stilverlusten führte.

## Entscheidung

Um die visuellen und funktionalen Eigenschaften der ursprünglichen Komponenten zu erhalten, ändern wir unseren Ansatz:

1. **Wir behalten die originalen Komponenten in `/components`**
2. **Wir erstellen Redirect-Dateien in `/src/components`**
3. **Wir korrigieren die Import-Pfade in der gesamten Anwendung**

Dieser Ansatz stellt sicher, dass alle bestehenden Funktionen und Designs erhalten bleiben, während wir die Codestruktur vereinheitlichen.

## Implementierungsstrategie

### 1. Path-Mapping aktualisieren

In `jsconfig.json` haben wir die Pfad-Aliase so definiert, dass `@components/*` auf `./components/*` verweist und nicht auf `./src/components/*`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./components/*"],
      "@src-components/*": ["./src/components/*"],
      // weitere Alias-Definitionen...
    }
  }
}
```

### 2. Redirect-Dateien

Für jede Komponente im `/components`-Verzeichnis haben wir eine entsprechende Redirect-Datei in `/src/components` erstellt. 

Beispiel für eine Redirect-Datei (`src/components/hotels/HotelCard.tsx`):

```tsx
'use client';

// Redirect file for backward compatibility
// This file ensures that imports from the src structure will work
import HotelCard from '@components/hotels/HotelCard';

// Re-export the component
export default HotelCard;

// Re-export types if any
export type HotelCardProps = ...
```

### 3. Import-Pfade korrigieren

Wir haben alle Import-Pfade in der Anwendung mit einem automatisierten Skript korrigiert, um sicherzustellen, dass sie auf die richtigen Komponenten verweisen.

```javascript
// Vorher (problematisch)
import HotelCard from '@/components/hotels/HotelCard';
// oder
import HotelCard from '../../src/components/hotels/HotelCard';

// Nachher (korrekt)
import HotelCard from '@components/hotels/HotelCard';
```

## Vorteile dieses Ansatzes

1. **Funktionserhalt**: Alle bestehenden Funktionen der Komponenten bleiben erhalten
2. **Visueller Erhalt**: Alle visuellen Eigenschaften und Animationen bleiben unverändert
3. **Minimale Änderungen**: Wir müssen keine Komponenten umschreiben oder neu implementieren
4. **Einfache Migration**: Automatisierbare Änderungen statt komplexer manueller Eingriffe
5. **Zukunftssicher**: Leichter Übergang zu einer einheitlichen Struktur in der Zukunft

## Tools für die Migration

Wir haben zwei Skripte implementiert, um den Migrationsprozess zu unterstützen:

1. `scripts/fix-imports.js` - Korrigiert Import-Pfade in allen Dateien
2. `scripts/create-component-redirects.js` - Erstellt Redirect-Dateien in `/src/components`

## Empfohlene Vorgehensweise für Entwickler

1. Immer `@components/*` für Komponenten-Importe verwenden
2. Komponenten im ursprünglichen `/components`-Verzeichnis bearbeiten und erweitern
3. Typescript-Typen in den Redirect-Dateien im `/src/components`-Verzeichnis definieren
4. Bei jeder neuen Komponente beide Dateien synchron halten

## Langfristige Strategie

Langfristig sollten wir einen Plan zur vollständigen Konsolidierung der Komponentenstruktur entwickeln. Optionen:

1. Vollständige Übernahme der TypeScript-Typisierung in die originalen Komponenten
2. Schrittweise Umstellung einzelner Komponenten mit gründlicher Test-Abdeckung
3. Komplette Neuimplementierung in einer zukünftigen Version mit klarer Schnittstellendefinition

Die aktuelle Lösung ist ein pragmatischer Kompromiss, der die Anwendung funktionsfähig hält, während wir die Architektur schrittweise verbessern.
