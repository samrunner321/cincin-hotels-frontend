# Interaktive Komponenten und Hooks

Dieses Dokument beschreibt die interaktiven Komponenten und Hooks, die im Rahmen von Sub-Batch 6.4 implementiert wurden, um ein konsistentes und qualitativ hochwertiges Interaktionsmuster im gesamten CinCin Hotels Projekt zu gewährleisten.

## Inhaltsverzeichnis

- [useFeatureInteraction Hook](#usefeatureinteraction-hook)
- [BaseFeature Komponente](#basefeature-komponente)
- [InteractiveFeature Komponente](#interactivefeature-komponente)
- [Migrierte Feature-Komponenten](#migrierte-feature-komponenten)
  - [FeaturedHotel](#featuredhotel)
  - [RestaurantFeature](#restaurantfeature)
  - [DemoAssetGallery](#demoassetgallery)
- [LoadingSpinner](#loadingspinner)
- [Best Practices](#best-practices)

## useFeatureInteraction Hook

Der `useFeatureInteraction` Hook ist das Herzstück unseres interaktiven Komponentensystems. Er bietet eine einheitliche API für die Verwaltung von Interaktionszuständen, Tooltips, Highlight-Effekten und mehr.

### Grundlegende Verwendung

```tsx
import { useFeatureInteraction } from '@/hooks/useFeatureInteraction';

function MyComponent() {
  const {
    isActive,
    isHovered,
    isTooltipVisible,
    getFeatureProps,
    getTooltipProps,
    activate,
    highlight,
  } = useFeatureInteraction({
    featureId: 'my-feature',
    tooltip: {
      enabled: true,
      position: 'top',
      text: 'Tooltip Text'
    }
  });

  return (
    <div>
      <button {...getFeatureProps()} 
        className={`${isActive ? 'bg-olive-500' : 'bg-olive-200'}`}>
        Interaktiver Button
      </button>
      
      {isTooltipVisible && (
        <div {...getTooltipProps()}>
          Tooltip Inhalt
        </div>
      )}
    </div>
  );
}
```

### Optionen

Der Hook akzeptiert ein Konfigurationsobjekt mit folgenden Optionen:

```typescript
{
  // Erforderlich
  featureId: string;  // Eindeutige Feature-ID

  // Optional
  interactionTypes?: InteractionType[];  // Aktivierte Interaktionstypen ['hover', 'click', 'focus', 'tour', 'reveal']
  initialState?: InteractionState;  // Anfangszustand: 'idle', 'active', 'highlighted', 'disabled'
  position?: FeaturePosition;  // Standard-Position für Tooltip: 'top', 'right', 'bottom', 'left', 'center'
  
  tooltip?: {
    enabled?: boolean;  // Tooltips aktivieren
    position?: FeaturePosition;  // Position überschreiben
    text?: string;  // Tooltip-Inhalt
    showArrow?: boolean;  // Richtungspfeil anzeigen
    autoHideDelay?: number;  // Automatisches Ausblenden nach ms
  };
  
  highlight?: {
    enabled?: boolean;  // Highlight-Effekte aktivieren
    color?: string;  // Highlight-Farbe (CSS-Farbe)
    opacity?: number;  // Highlight-Transparenz (0-1)
    effect?: 'pulse' | 'glow' | 'outline' | 'none';  // Effekt-Stil
    duration?: number;  // Dauer in ms
  };
  
  enabled?: boolean;  // Feature-Interaktionen aktivieren/deaktivieren
  autoActivateDelay?: number;  // Automatisch aktivieren nach ms
  
  // Callbacks
  onInteraction?: (type: InteractionType, featureId: string) => void;
  onStateChange?: (state: InteractionState, featureId: string) => void;
}
```

### Rückgabewerte

Der Hook gibt ein Objekt mit folgenden Eigenschaften und Methoden zurück:

```typescript
{
  // Zustand
  state: InteractionState;  // Aktueller Zustand
  isActive: boolean;  // Ist im 'active' Zustand
  isHighlighted: boolean;  // Ist im 'highlighted' Zustand
  isHovered: boolean;  // Wird gerade gehovert
  isTooltipVisible: boolean;  // Tooltip wird angezeigt
  
  // Element-Referenzen
  featureRef: React.RefObject<HTMLElement>;  // Ref für Feature-Element
  tooltipRef: React.RefObject<HTMLElement>;  // Ref für Tooltip-Element
  
  // Methoden
  activate: () => void;  // In aktiven Zustand setzen
  deactivate: () => void;  // In Leerlaufzustand setzen
  toggle: () => void;  // Zwischen aktiv und Leerlauf umschalten
  highlight: (duration?: number) => void;  // Highlight-Effekt anwenden
  showTooltip: () => void;  // Tooltip anzeigen
  hideTooltip: () => void;  // Tooltip ausblenden
  reset: () => void;  // Auf Ausgangszustand zurücksetzen
  
  // Prop-Getter
  getFeatureProps: () => {...};  // Props für Feature-Element
  getTooltipProps: () => {...};  // Props für Tooltip-Element
}
```

## BaseFeature Komponente

Die `BaseFeature` Komponente ist eine abstrakte Basiskomponente für Feature-Abschnitte mit standardisiertem Layout und Interaktionen.

### Verwendung

```tsx
import BaseFeature from '@/components/ui/BaseFeature';

function MyPage() {
  return (
    <BaseFeature
      featureId="my-feature"
      title="Feature Titel"
      description="Feature Beschreibung"
      layout="content-left"
      visualContent={<MyImage />}
      featureContent={<MyContent />}
      onInteraction={(type, id) => console.log(`Interaktion: ${type}`)}
    />
  );
}
```

### Props

```typescript
interface BaseFeatureProps extends BaseLayoutProps {
  /** Eindeutige Feature-ID */
  featureId: string;
  
  /** Feature-Titel */
  title?: string;
  
  /** Beschreibungstext */
  description?: string;
  
  /** Layout-Ausrichtung */
  layout?: 'content-left' | 'content-right';
  
  /** Zusätzliche Klassen für den Container */
  containerClassName?: string;
  
  /** Visueller Inhalt (Bild oder Galerie) */
  visualContent?: ReactNode;
  
  /** Feature-Inhalt (Text, Buttons, etc.) */
  featureContent?: ReactNode;
  
  /** Hintergrundfarbe */
  backgroundColor?: string;
  
  /** Animationen aktivieren */
  animationsEnabled?: boolean;
  
  /** Callback bei Interaktion */
  onInteraction?: (type: string, featureId: string) => void;
}
```

## InteractiveFeature Komponente

Die `InteractiveFeature` Komponente ist ein Wrapper, der beliebigen Elementen Interaktionsfunktionen hinzufügt.

### Verwendung

```tsx
import InteractiveFeature from '@/components/ui/InteractiveFeature';

function MyPage() {
  return (
    <InteractiveFeature
      featureId="my-card"
      tooltipText="Klicken für Details"
      tooltipEnabled={true}
      tooltipPosition="top"
      highlightEnabled={true}
      highlightEffect="pulse"
      onInteraction={(type) => console.log(`Interaktion: ${type}`)}
    >
      <div className="p-4 bg-white rounded shadow">
        <h3>Meine interaktive Karte</h3>
        <p>Dieser Inhalt hat interaktive Funktionen</p>
      </div>
    </InteractiveFeature>
  );
}
```

### Props

```typescript
interface FeatureInteractionProps extends BaseLayoutProps {
  /** Eindeutige Feature-ID */
  featureId: string;
  
  /** Tooltip-Text */
  tooltipText?: string;
  
  /** Tooltip-Position */
  tooltipPosition?: FeaturePosition;
  
  /** Tooltip aktivieren */
  tooltipEnabled?: boolean;
  
  /** Highlight-Effekt aktivieren */
  highlightEnabled?: boolean;
  
  /** Highlight-Effekttyp */
  highlightEffect?: 'pulse' | 'glow' | 'outline' | 'none';
  
  /** Callback bei Interaktion */
  onInteraction?: (type: InteractionType) => void;
  
  /** Feature-Elemente */
  children: React.ReactNode;
}
```

## Migrierte Feature-Komponenten

### FeaturedHotel

Die `FeaturedHotel` Komponente zeigt ein hervorgehobenes Hotel mit Bildkarussell, Beschreibung und Link an.

```tsx
<FeaturedHotel
  tag="Neu im Club"
  hotel={hotelData}
  autoRotate={true}
  interval={4000}
  showBookingCta={true}
  ctaText="Hotel entdecken"
/>
```

### RestaurantFeature

Die `RestaurantFeature` Komponente zeigt eine Liste von Restaurantoptionen an, die bei Interaktion das Hauptbild ändern.

```tsx
<RestaurantFeature
  title="CinCin's Auswahl der Woche: Beste Food & Drinks"
  restaurants={restaurantData}
  enableLock={true}
  initialSelectedId={2}
/>
```

### DemoAssetGallery

Die `DemoAssetGallery` Komponente ist eine eigenständige Galerie-Komponente mit umfangreichen Interaktionen und Barrierefreiheitsfunktionen.

```tsx
<DemoAssetGallery
  assets={myAssets}
  initialTab="images"
  defaultSpinnerConfig={{ size: 'medium', color: 'olive' }}
/>
```

## LoadingSpinner

Die verbesserte `LoadingSpinner` Komponente ist nun flexibler und unterstützt mehr Anpassungsmöglichkeiten.

```tsx
<LoadingSpinner
  size="medium"
  colorTheme="olive"
  label="Wird geladen..."
  progress={75}
  overlay={false}
/>
```

## Best Practices

### Konsistente Interaktionsmuster

1. **Tooltips**: Verwenden Sie Tooltips, um zusätzliche Informationen bereitzustellen, nicht für wesentliche Informationen.

2. **Highlight-Effekte**: Verwenden Sie Highlight-Effekte sparsam und konsistent, um die Aufmerksamkeit auf wichtige Funktionen zu lenken.

3. **Zustandsmanagement**: Halten Sie den interaktiven Zustand der Komponenten konsistent mit dem Anwendungszustand.

### Barrierefreiheit

1. **Tastaturnavigation**: Stellen Sie sicher, dass alle interaktiven Funktionen über die Tastatur erreichbar sind.

2. **Screen Reader**: Verwenden Sie aria-Attribute, um Screenreader zu unterstützen.

3. **Reduced Motion**: Berücksichtigen Sie Benutzer, die reduzierte Animation bevorzugen.

### Performance

1. **Event Throttling**: Begrenzen Sie die Häufigkeit von Interaktionsereignissen bei rechenintensiven Operationen.

2. **Lazy Loading**: Laden Sie Ressourcen erst, wenn sie benötigt werden, besonders bei Bildgalerien.

3. **Memoization**: Verwenden Sie React.memo und useCallback, um unnötige Neuberechnungen zu vermeiden.

### Weiteres Vorgehen

- Erweiterung des Hooks um Gesten-Unterstützung für mobile Geräte
- Integration mit Animation-Bibliotheken für fortgeschrittenere Effekte
- Entwicklung weiterer spezifischer Interaktionskomponenten