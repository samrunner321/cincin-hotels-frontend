# Detaillierter Migrationsplan: Sub-Batch 6.2 - UI und Navigation

## Übersicht

Sub-Batch 6.2 umfasst UI- und Navigationskomponenten mittlerer Komplexität (59-75). Diese Komponenten bauen auf den Foundation-Komponenten aus Sub-Batch 6.1 auf und sind für die Benutzerinteraktion und Navigation innerhalb der Anwendung wichtig.

## Komponenten in diesem Sub-Batch

| Komponente | Pfad | Komplexität | Abhängigkeiten | Priorität |
|------------|------|-------------|----------------|-----------|
| HotelsHero | components/hotels/HotelsHero.jsx | 59 | - | Hoch |
| PopularDestinations | components/home/PopularDestinations.jsx | 59 | - | Hoch |
| PopularHotels | components/destinations/PopularHotels.jsx | 59 | - | Hoch |
| DestinationInteractiveFeatures | components/destinations/DestinationInteractiveFeatures.jsx | 69 | - | Mittel |
| HotelListView | components/hotels/HotelListView.jsx | 70 | HotelCard | Mittel |
| HotelRoomsPage | components/hotel-detail/HotelRoomsPage.jsx | 70 | RoomCard | Mittel |
| DestinationHero | components/destinations/detail/DestinationHero.jsx | 74 | - | Mittel |
| DestinationGrid | components/destinations/DestinationGrid.jsx | 74 | - | Mittel |
| HotelDetailHero | components/hotel-detail/HotelDetailHero.jsx | 75 | - | Mittel |

## Migrations-Reihenfolge

Die Komponenten werden in folgender Reihenfolge migriert:

1. HotelsHero, PopularDestinations, PopularHotels (ähnliche Komplexität, wenig Abhängigkeiten)
2. DestinationInteractiveFeatures, HotelListView (abhängig von UI-Komponenten)
3. HotelRoomsPage, DestinationHero, DestinationGrid (komplexere Layouts)
4. HotelDetailHero (höchste Komplexität in diesem Sub-Batch)

## Gemeinsame Typendefinitionen

Vor der Migration werden folgende TypeScript-Interfaces erstellt oder erweitert:

```typescript
// src/types/hotel.ts (Erweiterungen)
export interface HotelFilter {
  categories?: string[];
  destination?: string;
  priceRange?: [number, number];
  stars?: number[];
  amenities?: string[];
  search?: string;
}

// src/types/destination.ts (Erweiterungen)
export interface DestinationFeature {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface InteractiveFeature {
  id: string | number;
  title: string;
  description: string;
  image: string;
  link?: string;
  videoUrl?: string;
  type: 'image' | 'video' | 'map' | 'interactive';
}

// src/types/ui.ts (Neu)
export interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  overlayColor?: string;
  textColor?: 'light' | 'dark';
  height?: string;
  alignment?: 'left' | 'center' | 'right';
  callToAction?: {
    text: string;
    link: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
}

export interface GridProps {
  items: any[];
  columns?: number;
  gap?: number;
  aspectRatio?: string;
  className?: string;
}
```

## Migrationsschritte für jede Komponente

### 1. HotelsHero.jsx → src/components/hotels/HotelsHero.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit HeroProps-Interface
- Verbesserung der Responsive-Eigenschaften
- Implementierung verschiedener Layout-Optionen
- Verbesserung der Barrierefreiheit
- Optimierung der Bild-Loading-Performance

**Neue Struktur:**
```
/src/components/hotels/
  ├── HotelsHero.tsx              # Hauptkomponente
  └── hooks/
      └── useParallaxEffect.ts    # Hook für Parallax-Effekte
```

**Geschätzter Aufwand:** 6-8 Stunden

### 2. PopularDestinations.jsx → src/components/home/PopularDestinations.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Destination-Interface
- Optimierung des Karussell-Verhaltens
- Implementierung von Lazy-Loading
- Verbesserung der Touch-Interaktionen
- Implementierung von Keyboard-Navigation

**Neue Struktur:**
```
/src/components/home/
  ├── PopularDestinations.tsx        # Hauptkomponente
  └── carousel/
      └── DestinationCarousel.tsx    # Karussell-Unterkomponente
```

**Geschätzter Aufwand:** 6-8 Stunden

### 3. PopularHotels.jsx → src/components/destinations/PopularHotels.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Hotel-Interface
- Verbesserung des Filtermechanismus
- Implementierung eines optimierten Grid-Layouts
- Verbesserung der Zugänglichkeit
- Hinzufügen von animierten Übergängen

**Neue Struktur:**
```
/src/components/destinations/
  ├── PopularHotels.tsx            # Hauptkomponente
  └── utils/
      └── hotelFilters.ts          # Filter-Hilfsfunktionen
```

**Geschätzter Aufwand:** 6-8 Stunden

### 4. DestinationInteractiveFeatures.jsx → src/components/destinations/DestinationInteractiveFeatures.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit InteractiveFeature-Interface
- Implementation von verbesserten Interaktionen
- Optimierung für mobile Geräte
- Hinzufügen von Video- und Map-Support
- Verbesserung der Barrierefreiheit

**Neue Struktur:**
```
/src/components/destinations/
  ├── DestinationInteractiveFeatures.tsx    # Hauptkomponente
  └── interactive/
      ├── FeatureCard.tsx                   # Feature-Kartenkomponente
      ├── VideoFeature.tsx                  # Video-Feature-Komponente
      └── MapFeature.tsx                    # Karten-Feature-Komponente
```

**Geschätzter Aufwand:** 8-10 Stunden

### 5. HotelListView.jsx → src/components/hotels/HotelListView.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Hotel- und HotelFilter-Interface
- Optimierung des virtuellen Scrollings
- Implementierung fortgeschrittener Filterlogik
- Implementierung von Sortieroptionen
- Verbesserung des responsiven Verhaltens

**Neue Struktur:**
```
/src/components/hotels/
  ├── HotelListView.tsx                # Hauptkomponente
  ├── hooks/
  │   ├── useHotelFilters.ts           # Filter-Hook
  │   └── useVirtualScroll.ts          # Virtuelles Scrolling Hook
  └── filters/
      └── FilterBar.tsx                # Filter-Leiste
```

**Geschätzter Aufwand:** 8-10 Stunden

### 6. HotelRoomsPage.jsx → src/components/hotel-detail/HotelRoomsPage.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Room-Interface
- Implementierung von Verfügbarkeitsüberprüfung
- Optimierung des Filterungsprozesses
- Verbesserung der Zimmervergleichsfunktion
- Hinzufügen von responsivem Verhalten

**Neue Struktur:**
```
/src/components/hotel-detail/
  ├── HotelRoomsPage.tsx                  # Hauptkomponente
  ├── filters/
  │   └── RoomFilters.tsx                 # Zimmerfilter-Komponente
  └── comparison/
      └── RoomComparisonTable.tsx         # Vergleichstabelle
```

**Geschätzter Aufwand:** 8-10 Stunden

### 7. DestinationHero.jsx → src/components/destinations/detail/DestinationHero.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit HeroProps-Interface
- Implementierung von Parallax-Effekten
- Optimierung der Bild-Loading-Strategie
- Verbesserung der Barrierefreiheit
- Hinzufügen von interaktiven Elementen

**Neue Struktur:**
```
/src/components/destinations/detail/
  ├── DestinationHero.tsx                # Hauptkomponente
  └── animations/
      └── ParallaxBackground.tsx         # Parallax-Hintergrund
```

**Geschätzter Aufwand:** 6-8 Stunden

### 8. DestinationGrid.jsx → src/components/destinations/DestinationGrid.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Destination- und GridProps-Interface
- Implementierung eines responsiven Masonry-Layouts
- Optimierung der Bildladestrategie
- Verbesserung der Filterungsmöglichkeiten
- Hinzufügen von Animations-Effekten

**Neue Struktur:**
```
/src/components/destinations/
  ├── DestinationGrid.tsx               # Hauptkomponente
  └── grid/
      ├── MasonryGrid.tsx               # Masonry-Layout-Komponente
      └── GridItem.tsx                  # Grid-Item-Komponente
```

**Geschätzter Aufwand:** 6-8 Stunden

### 9. HotelDetailHero.jsx → src/components/hotel-detail/HotelDetailHero.tsx

**Aufgaben:**
- Konvertierung zu TypeScript mit Hotel- und HeroProps-Interface
- Implementierung eines Bildkarussells
- Verbesserung der mobilen Darstellung
- Optimierung der Bild-Loading-Performance
- Verbesserung der Barrierefreiheit

**Neue Struktur:**
```
/src/components/hotel-detail/
  ├── HotelDetailHero.tsx               # Hauptkomponente
  └── hero/
      ├── ImageCarousel.tsx             # Bildkarussell-Komponente
      └── HeroContent.tsx               # Hero-Inhaltskomponente
```

**Geschätzter Aufwand:** 8-10 Stunden

## Testen

Für jede migrierte Komponente werden folgende Tests erstellt:

1. **Unit-Tests**: Tests für isolierte Funktionalität jeder Komponente
2. **Snapshot-Tests**: Für UI-Konsistenz
3. **Integration-Tests**: Testen von Komponenteninteraktionen
4. **Mock-Tests**: Für API-Integrationen

## Zeitleiste

Geschätzter Zeitrahmen für Sub-Batch 6.2: **3 Arbeitstage**

| Komponente | Tag 1 | Tag 2 | Tag 3 |
|------------|-------|-------|-------|
| Typendefinitionen | ✅ | | |
| HotelsHero | ✅ | | |
| PopularDestinations | ✅ | | |
| PopularHotels | ✅ | | |
| DestinationInteractiveFeatures | | ✅ | |
| HotelListView | | ✅ | |
| HotelRoomsPage | | ✅ | |
| DestinationHero | | | ✅ |
| DestinationGrid | | | ✅ |
| HotelDetailHero | | | ✅ |
| Tests & QA | | | ✅ |

## Erfolgskriterien

Die Migration von Sub-Batch 6.2 gilt als erfolgreich, wenn:

1. Alle Komponenten zu TypeScript migriert wurden
2. Alle Tests bestehen
3. Keine Regressionen in der UI oder Funktionalität auftreten
4. Die Codequalität verbessert wurde
5. Die Dokumentation aktualisiert wurde
6. Die Komponenten besser zugänglich sind (Accessibility)