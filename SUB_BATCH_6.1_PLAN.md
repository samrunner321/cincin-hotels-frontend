# Detaillierter Migrationsplan: Sub-Batch 6.1 - Foundation-Komponenten

## Übersicht

Sub-Batch 6.1 umfasst die grundlegenden Foundation-Komponenten, die als Basis für komplexere Komponenten dienen. Diese Komponenten haben weniger Abhängigkeiten und eine geringere bis mittlere Komplexität (44-76), was sie zu einem idealen Startpunkt für Batch 6 macht.

## Komponenten in diesem Sub-Batch

| Komponente | Pfad | Komplexität | Abhängigkeiten | Priorität |
|------------|------|-------------|----------------|-----------|
| directus-client | components/common/directus-client.js | 46 | keine | Sehr Hoch |
| ResponsiveDirectusImage | components/common/ResponsiveDirectusImage.jsx | 76 | directus-client | Sehr Hoch |
| OriginalsSection | components/hotel-detail/OriginalsSection.js | 49 | keine | Hoch |
| RecommendedDestinations | components/destinations/RecommendedDestinations.jsx | 49 | keine | Hoch |
| NewsletterSignup | components/home/NewsletterSignup.jsx | 49 | keine | Mittel |
| TabbedAttractionsSection | components/journal_post/TabbedAttractionsSection.jsx | 50 | keine | Mittel |
| JournalSection | components/home/JournalSection.jsx | 51 | keine | Mittel |
| DestinationHotels | components/destinations/DestinationHotels.jsx | 46 | keine | Mittel |
| RelatedHotelCard | components/journal_post/RelatedHotelCard.jsx | 44 | keine | Mittel |

## Migrations-Reihenfolge

Die Komponenten werden in folgender Reihenfolge migriert:

1. directus-client (grundlegende Datenintegrationsschicht)
2. ResponsiveDirectusImage (abhängig von directus-client)
3. OriginalsSection und RecommendedDestinations (hohe Priorität)
4. Die verbleibenden Komponenten (parallel bearbeitbar)

## Migrationsschritte für jede Komponente

### 1. directus-client.js → src/lib/api/directus-client.ts

**Aufgaben:**
- Konvertierung zu TypeScript mit Schnittstellen für Directus-API
- Implementierung von Typen für alle API-Responses
- Verbesserung der Fehlerbehandlung und Caching-Strategien
- Implementierung einer besseren Konfigurations-API
- Hinzufügen von JSDoc-Dokumentation

**Neue Struktur:**
```
/src/lib/api/
  ├── directus-client.ts          # Hauptclient-Implementierung
  ├── directus-types.ts           # Typdefinitionen für Directus
  ├── directus-config.ts          # Konfigurationsoptionen 
  └── directus-error-handler.ts   # Spezielle Fehlerbehandlung
```

**Geschätzter Aufwand:** 6-8 Stunden

### 2. ResponsiveDirectusImage.jsx → src/components/common/DirectusImage.tsx

**Aufgaben:**
- Umstellung auf TypeScript mit strengen Prop-Typen
- Optimierung des Lazy-Loading und der Bildgrößenberechnung
- Implementierung besserer Accessibility-Attribute
- Verwendung des migrierten directus-client
- Einführung einer Image-Factory für häufige Anwendungsfälle

**Neue Struktur:**
```
/src/components/common/
  ├── DirectusImage.tsx           # Hauptkomponente
  └── ImageUtils.ts               # Hilfsfunktionen für Bildmanipulation
```

**Geschätzter Aufwand:** 8-10 Stunden

### 3. OriginalsSection.js → src/components/hotel-detail/OriginalsSection.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit entsprechenden Interfaces
- Optimierung des Renderings
- Extraktion wiederverwendbarer Logik in Hooks
- Verbesserung der Accessibility

**Neue Struktur:**
```
/src/components/hotel-detail/
  ├── OriginalsSection.tsx        # Hauptkomponente
  └── sections/                   # Unterkomponenten (falls benötigt)
```

**Geschätzter Aufwand:** 5-7 Stunden

### 4. RecommendedDestinations.jsx → src/components/destinations/RecommendedDestinations.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Destination-Interface
- Optimierung des Datenladens
- Implementierung von UI-Verbesserungen
- Extraktion von Hilfsfunktionen für Destination-Filterung

**Neue Struktur:**
```
/src/components/destinations/
  ├── RecommendedDestinations.tsx # Hauptkomponente
  └── utils/                      # Hilfsfunktionen
      └── destination-filters.ts  # Filterfunktionen
```

**Geschätzter Aufwand:** 5-7 Stunden

### 5. Verbleibende Komponenten

Für jede der verbleibenden Komponenten:

**Allgemeine Aufgaben:**
- Konvertierung zu TypeScript mit entsprechenden Interfaces
- Verbesserte Fehlerbehandlung und Loading-States
- Extraktion von wiederverwendbarer Logik in Hooks
- Implementierung von Accessibility-Verbesserungen
- Optimierung der Performance

**Spezifische Aufgaben für NewsletterSignup:**
- Implementierung von Form-Validierung
- Verwendung des useForm-Hooks
- Verbessertes Feedback für Benutzer

**Spezifische Aufgaben für TabbedAttractionsSection:**
- Tab-Management in einen eigenen Hook extrahieren
- Verbesserung der Barrierefreiheit von Tabs

**Geschätzter Aufwand pro Komponente:** 5-6 Stunden

## Gemeinsame Typendefinitionen

Vor der Migration werden folgende TypeScript-Interfaces erstellt:

```typescript
// src/types/api.ts
export interface DirectusResponse<T> {
  data: T;
  meta?: any;
  error?: DirectusError;
}

export interface DirectusError {
  code: number;
  message: string;
  extensions?: any;
}

// src/types/hotel.ts
export interface Hotel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: Address;
  images?: Image[];
  categories?: Category[];
  features?: Feature[];
  rooms?: Room[];
  // weitere Eigenschaften...
}

// src/types/destination.ts
export interface Destination {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images?: Image[];
  hotels?: Hotel[];
  attractions?: Attraction[];
  // weitere Eigenschaften...
}

// Weitere Interfaces nach Bedarf...
```

## Testen

Für jede migrierte Komponente werden folgende Tests erstellt:

1. **Unit-Tests**: Tests für isolierte Funktionalität jeder Komponente
2. **Snapshot-Tests**: Für UI-Konsistenz
3. **Integration-Tests**: Testen von Komponenteninteraktionen
4. **Mock-Tests**: Für API-Integrationen

## Rollback-Strategie

Für jede Komponente wird eine Rollback-Strategie implementiert:

1. Erstellung einer Backup-Kopie vor der Migration
2. Implementierung von Feature-Flags für neue Komponenten
3. A/B-Testing zwischen alten und neuen Implementierungen

## Zeitleiste

Geschätzter Zeitrahmen für Sub-Batch 6.1: **2-3 Arbeitstage**

| Komponente | Tag 1 | Tag 2 | Tag 3 |
|------------|-------|-------|-------|
| Typ-Definitionen | ✅ | | |
| directus-client | ✅ | | |
| ResponsiveDirectusImage | ✅ | ✅ | |
| OriginalsSection | | ✅ | |
| RecommendedDestinations | | ✅ | |
| Verbleibende Komponenten | | ✅ | ✅ |
| Tests & QA | | | ✅ |

## Erfolgskriterien

Die Migration von Sub-Batch 6.1 gilt als erfolgreich, wenn:

1. Alle Komponenten zu TypeScript migriert wurden
2. Alle Tests bestehen
3. Keine regressions in der UI oder Funktionalität auftreten
4. Die Codequalität verbessert wurde (gemessen mit ESLint, SonarQube etc.)
5. Die Dokumentation aktualisiert wurde

## Nächste Schritte

Nach Abschluss von Sub-Batch 6.1:

1. Erkenntnisse dokumentieren und in die Planung für Sub-Batch 6.2 einbeziehen
2. Gemeinsam genutzte Hooks und Utilities überprüfen und optimieren
3. Mit der Migration von Sub-Batch 6.2 beginnen