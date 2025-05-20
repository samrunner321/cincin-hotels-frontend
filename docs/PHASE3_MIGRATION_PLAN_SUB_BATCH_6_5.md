# Migration Plan: Sub-Batch 6.5

## Übersicht

Sub-Batch 6.5 konzentriert sich auf die Migration komplexer Feature-Komponenten mit fortgeschrittenen Interaktionsmustern. Diese Komponenten repräsentieren die anspruchsvollsten UI-Elemente der Anwendung und erfordern eine sorgfältige Migration, um Funktionalität, Barrierefreiheit und Benutzerfreundlichkeit zu gewährleisten.

## Komponenten-Inventar

### Primäre Komponenten

1. **TravelJourneyDesigner.jsx**
   - Komplexe Wizard-Komponente mit mehrstufiger Benutzerführung
   - Algorithmusbasierte Reiseempfehlungen
   - Umfangreiche Animation und interaktive Elemente

2. **TravelAdvisor.jsx**
   - Chatbot-Oberfläche mit kontextbezogenen Antworten
   - Nachrichtenverlauf und Tippindikator
   - Dynamische Vorschläge basierend auf Gesprächsverlauf

3. **HotelMapView.jsx**
   - Interaktive Kartenansicht mit Hotelmarkierungen
   - Hover-Tooltips mit Hoteldetails
   - Animierte Marker und Zoom-Funktionen

4. **HotelFilters.tsx** (bereits zu TypeScript migriert)
   - Umfassende Filteroberfläche für Hotelsuche
   - Integration mit useFilterReducer und UIStateContext
   - Benötigt Integration mit useFeatureInteraction

### Zusätzlich identifizierte Komponenten

5. **AnimatedHotelEntry.jsx**
   - Animierter Eintritt für Hotellisten
   - Viewport-Detection für Animation

6. **InteractiveFeatures.jsx**
   - Showcase-Sektion für interaktive Tools
   - Komplexe Animation und visuelle Effekte

## Migrationsprioritäten

Prioritätsordnung basierend auf Komplexität, Abhängigkeiten und Benutzerrelevanz:

1. HotelMapView.jsx (mittlere Komplexität, hohe Sichtbarkeit)
2. TravelJourneyDesigner.jsx (hohe Komplexität, wichtiges Feature)
3. TravelAdvisor.jsx (hohe Komplexität, wichtiges Assistenz-Feature)
4. AnimatedHotelEntry.jsx (niedrige Komplexität, unterstützendes Element)
5. HotelFilters.tsx (bereits migriert, Erweiterung/Integration)

## Abhängigkeiten

Die folgenden bereits migrierten Komponenten und Hooks werden für die Migration benötigt:

- **useFeatureInteraction** Hook
- **BaseFeature** Komponente
- **InteractiveFeature** Komponente
- **UIStateContext** für Theme- und Animations-Einstellungen
- **advanced-ui.ts** Typdefinitionen

## Migrations-Strategie pro Komponente

### 1. HotelMapView.jsx → HotelMapView.tsx

**Ansatz:**
- Konvertierung zu TypeScript mit Typen aus advanced-ui.ts
- Ersetzen der benutzerdefinierten Tooltip-Implementierung durch useFeatureInteraction
- Integration mit UIStateContext für Animation-Präferenzen
- Sicherstellen der Barrierefreiheit mit ARIA-Attributen

**Schlüsselaufgaben:**
1. Erstellen geeigneter Interfaces für Props und State
2. Refaktorieren der Marker-Komponente mit InteractiveFeature
3. Implementieren konsistenter Highlight-Effekte für Marker
4. Sicherstellen korrekter Keyboard-Navigation

**Code-Beispiel:**
```tsx
interface HotelMapViewProps {
  hotels: HotelItem[];
  onHotelClick: (hotel: HotelItem) => void;
}

interface HotelMapMarkerProps {
  hotel: HotelItem;
  position: { x: string; y: string };
  onClick: (hotel: HotelItem) => void;
}

const HotelMapMarker: FC<HotelMapMarkerProps> = ({ hotel, position, onClick }) => {
  return (
    <div
      style={{ left: position.x, top: position.y }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
    >
      <InteractiveFeature
        featureId={`hotel-marker-${hotel.id}`}
        tooltipContent={
          <div className="p-3">
            <h3 className="font-medium text-gray-900">{hotel.name}</h3>
            <p className="text-sm text-gray-600">{hotel.location}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(hotel);
              }}
              className="mt-2 text-sm text-brand-olive-600 hover:text-brand-olive-700 font-medium"
            >
              View Details →
            </button>
          </div>
        }
        tooltipPosition="top"
        highlightEffect="pulse"
        highlightOnHover={true}
        onInteraction={(type) => {
          if (type === 'click') onClick(hotel);
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-6 h-6 rounded-full flex items-center justify-center bg-white border border-brand-olive-300 text-brand-olive-500"
        >
          <span className="text-xs font-medium">{hotel.id}</span>
        </motion.div>
      </InteractiveFeature>
    </div>
  );
};
```

### 2. TravelJourneyDesigner.jsx → TravelJourneyDesigner.tsx

**Ansatz:**
- Konvertierung zu TypeScript mit umfassenden Interface-Definitionen
- Anwendung von InteractiveFeature auf Optionskarten
- Verwendung des useFeatureInteraction Hooks für Tooltips und Highlights
- Optimierung der Animationslogik

**Schlüsselaufgaben:**
1. Definieren von Typen für alle Schritte und Optionen
2. Refaktorieren der Option-Auswahl mit InteractiveFeature
3. Verbessern der Barrierefreiheit für den mehrstufigen Prozess
4. Implementieren von Highlight-Effekten für ausgewählte Optionen

**Code-Beispiel:**
```tsx
interface TravelPreferences {
  travelerType: string | null;
  destination: string | null;
  experiences: string[];
  accommodationType: string | null;
  seasonality: string | null;
}

interface JourneyOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

interface JourneyStep {
  id: keyof TravelPreferences;
  title: string;
  options: JourneyOption[];
  multiSelect?: boolean;
}

// Option card with InteractiveFeature
const OptionCard: FC<{
  option: JourneyOption;
  isSelected: boolean;
  onClick: () => void;
}> = ({ option, isSelected, onClick }) => {
  return (
    <InteractiveFeature
      featureId={`option-${option.id}`}
      tooltipContent={option.description}
      tooltipPosition="top"
      tooltipEnabled={Boolean(option.description)}
      highlightEffect={isSelected ? "glow" : "subtle"}
      highlightEnabled={isSelected}
      onInteraction={(type) => {
        if (type === 'click') onClick();
      }}
    >
      <motion.button
        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-brand-olive-400 bg-brand-olive-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-2xl mb-1">{option.icon}</span>
        <span className="text-sm font-brooklyn text-center">{option.label}</span>
      </motion.button>
    </InteractiveFeature>
  );
};
```

### 3. TravelAdvisor.jsx → TravelAdvisor.tsx

**Ansatz:**
- Konvertierung zu TypeScript mit Message-Interfaces und State-Typen
- Anwendung von InteractiveFeature für Vorschlagsbuttons und Chat-Toggle
- Verbesserung der Barrierefreiheit für Chatbot-Interaktionen
- Einheitliche Animation und visuelle Effekte

**Schlüsselaufgaben:**
1. Definieren von Interfaces für Nachrichten und Zustände
2. Refaktorieren der Vorschlagsbuttons mit InteractiveFeature
3. Verbessern der Tastaturnavigation und Fokus-Zustände
4. Implementieren von Animationspräferenzen aus UIStateContext

**Code-Beispiel:**
```tsx
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TravelAdvisorProps {
  initialMessage?: string;
}

// Suggestion button with InteractiveFeature
const SuggestionButton: FC<{
  suggestion: string;
  onClick: (suggestion: string) => void;
}> = ({ suggestion, onClick }) => {
  return (
    <InteractiveFeature
      featureId={`suggestion-${suggestion}`}
      highlightOnHover={true}
      highlightEffect="subtle"
      onInteraction={(type) => {
        if (type === 'click') onClick(suggestion);
      }}
    >
      <button
        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors"
      >
        {suggestion}
      </button>
    </InteractiveFeature>
  );
};
```

### 4. AnimatedHotelEntry.jsx → AnimatedHotelEntry.tsx

**Ansatz:**
- Einfache Konvertierung zu TypeScript
- Integration mit useFeatureInteraction für konsistente Animation
- Unterstützung für reduzierte Bewegung

**Code-Beispiel:**
```tsx
interface AnimatedHotelEntryProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedHotelEntry: FC<AnimatedHotelEntryProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const { state: uiState } = useUIState();
  const shouldAnimate = !uiState.theme.reducedMotion && uiState.theme.animationsEnabled;
  
  return (
    <motion.div
      className={className}
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {children}
    </motion.div>
  );
};
```

### 5. HotelFilters.tsx (Erweiterung)

**Ansatz:**
- Integration des useFeatureInteraction Hooks für verbesserte Interaktionen
- Verbesserung der CategoryButton-Komponente
- Hinzufügen von Tooltips für Filterfunktionen

**Schlüsselaufgaben:**
1. Erweitern des CategoryButton mit InteractiveFeature
2. Implementieren von Tooltips für komplexe Filteroptionen
3. Verbessern des Such-Dropdowns mit konsistenten Interaktionen

**Code-Beispiel für CategoryButton:**
```tsx
function CategoryButton({ label, count = 0, onClick }: CategoryButtonProps): JSX.Element {
  return (
    <InteractiveFeature
      featureId={`category-${label}`}
      tooltipContent={`Filter by ${label}`}
      tooltipPosition="bottom"
      highlightOnHover={true}
      highlightEffect="subtle"
      onInteraction={(type) => {
        if (type === 'click') onClick();
      }}
    >
      <button
        className={cn(
          "px-4 py-2 rounded-full border transition-all",
          count > 0 
            ? 'border-black/70 text-black' 
            : 'border-gray-200 text-gray-600 hover:border-gray-300'
        )}
        type="button"
        aria-label={`Filter by ${label}`}
      >
        <span className="flex items-center gap-2">
          {label}
          {count > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 text-xs bg-black text-white rounded-full">
              {count}
            </span>
          )}
        </span>
      </button>
    </InteractiveFeature>
  );
}
```

## Erweiterung der advanced-ui.ts Typen

```typescript
// Neue Typen für TravelJourneyDesigner
export interface JourneyOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  options: JourneyOption[];
  multiSelect?: boolean;
}

export interface Journey {
  id: number;
  title: string;
  description: string;
  matches: {
    travelerType: string[];
    destination: string;
    experiences: string[];
    accommodationType: string[];
    seasonality: string[];
  };
  hotels: HotelItem[];
  imageBg: string;
}

// Neue Typen für TravelAdvisor
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Erweiterung der HotelMapItem Typen
export interface HotelMapItem extends HotelItem {
  position?: {
    x: number | string;
    y: number | string;
  };
  isActive?: boolean;
}

export interface HotelMapViewProps {
  hotels: HotelMapItem[];
  onHotelClick: (hotel: HotelMapItem) => void;
  initialCenter?: [number, number];
  zoom?: number;
}
```

## Test-Strategie

1. **Komponententests**:
   - Jest und React Testing Library für Unit-Tests
   - Testen von State-Management und Callback-Verhalten
   - Testen der Barrierefreiheit (ARIA-Attribute, Keyboard-Navigation)

2. **Integration Tests**:
   - Testen der Zusammenarbeit mit Context-Providern
   - Testen der End-to-End Workflows (z.B. Reiseplanung)

3. **Visual Tests**:
   - Storybook Stories für visuelle Regression
   - Test verschiedener Interaktionszustände

## Accessibility

Alle migrierten Komponenten müssen folgende Barrierefreiheitsstandards erfüllen:

1. **Keyboard Navigation**:
   - Fokussierbare interaktive Elemente
   - Logische Tab-Reihenfolge
   - Visueller Fokusindikator

2. **Screen Reader Support**:
   - Semantisches HTML
   - ARIA-Attribute für dynamische Inhalte
   - Beschreibende Texte für Interaktionen

3. **Motion Preferences**:
   - Respektieren der prefers-reduced-motion Einstellung
   - Alternative für animierte Inhalte

## Zeitleiste und Milestones

1. **Woche 1**: 
   - Migrieren von HotelMapView.jsx zu TypeScript
   - Erweitern von advanced-ui.ts mit neuen Typen
   - Erstellen von Tests für HotelMapView

2. **Woche 2**:
   - Migrieren von TravelJourneyDesigner.jsx zu TypeScript
   - Implementieren von InteractiveFeature für Optionskarten
   - Tests für TravelJourneyDesigner

3. **Woche 3**:
   - Migrieren von TravelAdvisor.jsx zu TypeScript
   - Verbessern der Barrierefreiheit
   - Tests für TravelAdvisor

4. **Woche 4**:
   - Migrieren von AnimatedHotelEntry.jsx
   - Verbessern von HotelFilters.tsx
   - Abschluss-Tests und Dokumentation