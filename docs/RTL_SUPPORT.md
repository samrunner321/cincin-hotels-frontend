# RTL-Unterstützung für Cincinnati Hotels

Diese Dokumentation beschreibt die Implementierung der RTL-Unterstützung (Right-to-Left) für die Cincinnati Hotels-Website.

## Übersicht

Die RTL-Unterstützung ermöglicht es, die Website in Sprachen anzuzeigen, die von rechts nach links geschrieben werden, wie Arabisch oder Hebräisch. Dabei werden folgende Aspekte berücksichtigt:

- Textausrichtung und Leserichtung
- Layout und Komponentenanordnung
- Positionierung von UI-Elementen
- Ikonografie und Grafikausrichtung

## Implementierte Funktionen

### 1. Sprachunterstützung

Die RTL-Sprachunterstützung wurde in der Datei `src/lib/i18n.ts` implementiert:

```typescript
// RTL-Sprachen
export const RTL_LANGUAGES: LanguageCode[] = ['ar', 'he'];
```

### 2. Erweiterter Translations-Provider

Der `EnhancedTranslationsProvider` (`src/components/i18n/EnhancedTranslationsProvider.tsx`) erweitert den bestehenden TranslationsProvider um RTL-Funktionalitäten:

- `direction`: Gibt die aktuelle Textrichtung zurück ('ltr' oder 'rtl')
- `isRtl`: Boolean-Flag, das angibt, ob die aktuelle Sprache RTL ist
- Automatisches Setzen des `dir`-Attributs im HTML-Element

```typescript
// Erweiterte Kontexttypen für RTL-Unterstützung
export interface EnhancedTranslationsContextProps {
  translations: TranslationsMap;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
  direction: 'ltr' | 'rtl';
  isRtl: boolean;
}

// Dokument-Direction beim Montieren und Sprachänderung aktualisieren
useEffect(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }
}, [direction, language]);
```

### 3. RTL-Hook

Der `useRtl`-Hook (`src/hooks/useRtl.ts`) stellt hilfreiche Funktionen für RTL-Unterstützung in Komponenten bereit:

- `getFlexDirection`: Konvertiert Flex-Richtungen basierend auf RTL
- `getTextAlign`: Passt die Textausrichtung entsprechend an
- `getSideProperty`: Setzt logische Eigenschaften für Margins und Paddings
- `getOrderedArray`: Kehrt Arrays um, wenn RTL aktiv ist
- `flip`: Konvertiert 'left' zu 'right' und umgekehrt
- `getIconRotation`: Passt Rotationswinkel für Icons in RTL an

```typescript
export function useRtl(): RtlUtilities {
  const { isRtl, direction } = useEnhancedTranslations();

  // Konvertiert eine Flex-Richtung basierend auf der aktuellen Textrichtung
  const getFlexDirection = (defaultDirection: 'row' | 'column') => {
    if (!isRtl) return defaultDirection;
    if (defaultDirection === 'row') return 'row-reverse';
    return defaultDirection; // Column bleibt unverändert
  };

  // ... weitere Hilfsfunktionen

  return {
    isRtl,
    direction,
    getFlexDirection,
    getTextAlign,
    getSideProperty,
    getOrderedArray,
    flip,
    getIconRotation
  };
}
```

### 4. RTL-Utilities

Die `rtl-utils.ts`-Datei (`src/utils/rtl-utils.ts`) enthält Hilfsfunktionen für CSS und Tailwind:

- `rtlFlip`: Konvertiert eine einzelne Tailwind-Klasse für RTL
- `rtlFlipClasses`: Konvertiert mehrere Tailwind-Klassen
- `getRtlStyles`: Erstellt React-Style-Objekte mit RTL-Unterstützung
- `getLogicalSideProperty`: Konvertiert logische CSS-Eigenschaften

```typescript
export function rtlFlip(className: string, isRtl: boolean): string {
  if (!isRtl) return className;

  // Tailwind-Klassen für Margins (ml-*, mr-*)
  if (className.startsWith('ml-')) {
    return `mr-${className.substring(3)}`;
  }
  if (className.startsWith('mr-')) {
    return `ml-${className.substring(3)}`;
  }
  
  // ... weitere Transformationen
}
```

## Verwendung in Komponenten

### RTL-Hook in funktionalen Komponenten verwenden

```tsx
import { useRtl } from '@/hooks/useRtl';

function MyComponent() {
  const { isRtl, direction, getFlexDirection, getTextAlign } = useRtl();
  
  return (
    <div 
      dir={direction}
      style={{ 
        display: 'flex',
        flexDirection: getFlexDirection('row'),
        textAlign: getTextAlign('left')
      }}
    >
      {/* Komponenten-Inhalt */}
    </div>
  );
}
```

### Tailwind-Klassen für RTL anpassen

```tsx
import { useRtl } from '@/hooks/useRtl';
import { rtlFlipClasses } from '@/utils/rtl-utils';

function MyComponent() {
  const { isRtl, direction } = useRtl();
  
  // Automatisch konvertierte Tailwind-Klassen basierend auf RTL
  const containerClasses = rtlFlipClasses('ml-4 text-left flex-row', isRtl);
  
  return (
    <div className={containerClasses} dir={direction}>
      {/* Komponenten-Inhalt */}
    </div>
  );
}
```

### Logische Eigenschaften für Seitenausrichtung

Statt `marginLeft` oder `marginRight` zu verwenden:

```tsx
import { useRtl } from '@/hooks/useRtl';

function MyComponent() {
  const { isRtl, direction, getSideProperty } = useRtl();
  
  return (
    <div 
      dir={direction}
      style={{
        ...getSideProperty('margin', 'start', '20px'),
        ...getSideProperty('padding', 'end', '30px')
      }}
    >
      {/* Komponenten-Inhalt */}
    </div>
  );
}
```

## RTL-spezifische CSS in Komponenten

Bei der Verwendung von CSS-Modulen in Komponenten unterstützen wir RTL-Layout durch:

### 1. Richtungsabhängige CSS-Klassen

```css
/* BaseInput.module.css */
.iconWrapper {
  position: absolute;
  left: 0.75rem;
  /* weitere Stile */
}

.iconWrapperRtl {
  position: absolute;
  right: 0.75rem;
  left: auto;
  /* weitere Stile */
}
```

Im Komponenten-Code:

```tsx
<div 
  className={cn(
    isRtl ? styles.iconWrapperRtl : styles.iconWrapper
  )}
>
  {icon}
</div>
```

### 2. CSS-Selektoren mit dir-Attribut

```css
/* Basis-Stil für LTR */
.hasIcon .input {
  padding-left: 2.5rem;
}

/* RTL-Anpassung mit [dir="rtl"] Selektor */
[dir="rtl"] .hasIcon .input {
  padding-left: 0.75rem;
  padding-right: 2.5rem;
}
```

## RTL in unseren UI-Komponenten

### BaseInput

Die `BaseInput`-Komponente unterstützt RTL-Layout mit folgenden Eigenschaften:

- Textausrichtung: Links in LTR, rechts in RTL
- Icon-Positionierung: Links in LTR, rechts in RTL
- Prefix/Suffix-Positionierung: Angepasst basierend auf Richtung
- Validierungsanzeigen: Positioniert auf der entsprechenden Seite

```tsx
// In BaseInput.tsx
export default function BaseInput({ /* props */ }) {
  const { isRtl, direction } = useEnhancedTranslations();
  
  return (
    <div className={containerClasses} dir={direction}>
      {/* Label */}
      {label && !hideLabel && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {/* Prefix Element - abhängig von RTL */}
        {prefix && (
          <div className={cn(
            isRtl ? styles.prefixRtl : styles.prefix
          )}>
            {prefix}
          </div>
        )}
        
        {/* Icon - abhängig von RTL */}
        {icon && (
          <div 
            className={cn(
              isRtl ? styles.iconWrapperRtl : iconWrapperClasses
            )}
            onClick={handleIconClick}
          >
            {icon}
          </div>
        )}
        
        {/* Input Element mit RTL-Textausrichtung */}
        <input
          ref={inputRef}
          {...inputProps}
          style={{ textAlign: isRtl ? 'right' : 'left' }}
        />
        
        {/* Weiterer RTL-angepasster Inhalt */}
      </div>
    </div>
  );
}
```

### BaseTable

Die `BaseTable`-Komponente unterstützt RTL-Layout mit folgenden Eigenschaften:

- Textausrichtung: Automatisch angepasst (links in LTR, rechts in RTL)
- Sortier-Icons: Gedreht entsprechend der Textrichtung
- Pagination-Pfeile: Umgekehrt in RTL
- Grid-Layout: Angepasste Grid-Richtung in RTL

### BaseTabs

Die `BaseTabs`-Komponente unterstützt RTL-Layout mit folgenden Eigenschaften:

- Tastatur-Navigation: Angepasst für RTL (links/rechts Tasten vertauscht)
- Tab-Icons und Badges: Korrekt positioniert basierend auf Textrichtung
- Vertikale Tabs: Layout-Richtung angepasst in RTL

## RTL-Tests

Für RTL-Testing haben wir spezielle Hilfsfunktionen implementiert:

```typescript
// src/utils/__tests__/rtl-test-utils.ts
export function renderWithRtl(ui: React.ReactElement): RenderResult {
  return renderWithRtlSupport(ui, TEST_RTL_LANGUAGE);
}

export function renderWithLtr(ui: React.ReactElement): RenderResult {
  return renderWithRtlSupport(ui, TEST_LTR_LANGUAGE);
}
```

Diese ermöglichen das einfache Testen von Komponenten in RTL und LTR Modus:

```tsx
// Beispiel-Test für RTL-Unterstützung in einer Komponente
test('sollte korrekt im RTL-Modus rendern', () => {
  renderWithRtl(
    <MeineKomponente />
  );
  
  // RTL-spezifische Prüfungen hier...
  const element = screen.getByTestId('test-element');
  expect(element).toHaveStyle('text-align: right');
});
```

## Anpassungen für RTL in CSS

Bei der Erstellung von CSS sollten folgende Muster verwendet werden:

### 1. Logische Eigenschaften verwenden

Statt:
```css
.element {
  margin-left: 10px;
  padding-right: 20px;
}
```

Besser:
```css
.element {
  margin-inline-start: 10px; /* Wird zu margin-left in LTR und margin-right in RTL */
  padding-inline-end: 20px; /* Wird zu padding-right in LTR und padding-left in RTL */
}
```

### 2. Dir-Attribut für spezifische Regeln

```css
[dir="ltr"] .element {
  left: 0;
}

[dir="rtl"] .element {
  right: 0;
}
```

## Bekannte Einschränkungen

- Drittanbieter-Komponenten müssen möglicherweise manuell für RTL angepasst werden
- Einige komplexe Layouts erfordern spezielle Anpassungen
- Grafiken und Bilder, die richtungsabhängig sind, müssen separat für RTL gespiegelt werden

## Weiterentwicklung

Folgende Aspekte können zukünftig noch verbessert werden:

1. ✅ RTL-spezifische Unittests implementieren
2. ⏳ Visuelle Regression-Tests für RTL erstellen
3. ⏳ Qualitätsprüfung aller migrierten Komponenten durchführen
4. ⏳ Fortschrittsbericht für Sub-Batch 6.3 erstellen
5. 🔄 Komponenten für Sub-Batch 6.4 vorbereiten und analysieren

## Ressourcen

- [MDN Web Docs: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [React Intl: RTL Support](https://formatjs.io/docs/react-intl/components/#rtl-support)
- [Tailwind CSS RTL Support](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling)
- [Building Multi-Directional Layouts](https://24ways.org/2016/building-multidirectional-layouts/)