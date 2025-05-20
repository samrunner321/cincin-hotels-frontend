# Migration der UI-Komponenten

Dieses Dokument beschreibt den detaillierten Plan zur Migration der UI-Komponenten mit geringen Abhängigkeiten in die `/src`-Struktur.

## Identifizierte Komponenten für die Migration

Nach Analyse der Codebase wurden folgende UI-Komponenten mit geringen Abhängigkeiten für die zweite Phase der Migration identifiziert:

### 1. Allgemeine UI-Komponenten

| Komponente | Aktueller Pfad | Neuer Pfad | Abhängigkeiten | Priorität |
|------------|---------------|------------|----------------|-----------|
| `LoadingSpinner.jsx` | `/components/common/LoadingSpinner.jsx` | `/src/components/ui/LoadingSpinner.tsx` | keine | Hoch |
| `ContentBlock.jsx` | `/components/common/ContentBlock.jsx` | `/src/components/ui/ContentBlock.tsx` | framer-motion | Hoch |
| `PageHero.jsx` | `/components/common/PageHero.jsx` | `/src/components/ui/PageHero.tsx` | zu prüfen | Mittel |

### 2. Feature-spezifische UI-Komponenten

| Komponente | Aktueller Pfad | Neuer Pfad | Abhängigkeiten | Priorität |
|------------|---------------|------------|----------------|-----------|
| `CategoryButton.js` | `/components/hotels/CategoryButton.js` | `/src/components/ui/buttons/CategoryButton.tsx` | next/link | Hoch |
| `FeatureItem.js` | `/components/hotel-detail/FeatureItem.js` | `/src/components/ui/FeatureItem.tsx` | keine | Hoch |
| `ViewSwitcher.jsx` | `/components/hotels/ViewSwitcher.jsx` | `/src/components/ui/ViewSwitcher.tsx` | react, framer-motion | Mittel |

### 3. Formular-Komponenten

| Komponente | Aktueller Pfad | Neuer Pfad | Abhängigkeiten | Priorität |
|------------|---------------|------------|----------------|-----------|
| `FormField.jsx` | (zu erstellen) | `/src/components/ui/forms/FormField.tsx` | zu erstellen | Niedrig |
| `Button.jsx` | (zu erstellen) | `/src/components/ui/buttons/Button.tsx` | zu erstellen | Niedrig |

## Migrationsschritte im Detail

Die Migration wird in mehreren Schritten durchgeführt, beginnend mit den Komponenten mit den geringsten Abhängigkeiten.

### Schritt 1: LoadingSpinner.jsx migrieren

1. **Verzeichnisstruktur erstellen:**
   ```bash
   mkdir -p /Users/samuelrenner/cincinhotels/src/components/ui
   ```

2. **Komponente migrieren:**
   - TypeScript-Typdefinitionen hinzufügen
   - Dokumentation verbessern
   - Accessibility-Attribute sicherstellen
   - In neue Datei speichern: `/src/components/ui/LoadingSpinner.tsx`

3. **Weiterleitungsdatei erstellen:**
   - Alte Komponentendatei aktualisieren, um die neue zu importieren und weiterzuleiten
   - Deprecated-Kommentar hinzufügen

4. **Tests erstellen:**
   - Komponententests für verschiedene Größen, Farben, etc.
   - Accessibility-Tests

### Schritt 2: CategoryButton.js migrieren

1. **Verzeichnisstruktur erstellen:**
   ```bash
   mkdir -p /Users/samuelrenner/cincinhotels/src/components/ui/buttons
   ```

2. **Komponente migrieren:**
   - TypeScript-Typdefinitionen hinzufügen
   - Dokumentation verbessern
   - Konsistentes Styling sicherstellen
   - In neue Datei speichern: `/src/components/ui/buttons/CategoryButton.tsx`

3. **Weiterleitungsdatei erstellen**

4. **Tests erstellen**

### Schritt 3: FeatureItem.js migrieren

1. **Komponente migrieren:**
   - TypeScript-Typdefinitionen hinzufügen
   - Icons in eine separate Datei auslagern
   - Dokumentation verbessern
   - In neue Datei speichern: `/src/components/ui/FeatureItem.tsx`

2. **Weiterleitungsdatei erstellen**

3. **Tests erstellen**

### Schritt 4: ContentBlock.jsx migrieren

1. **Komponente migrieren:**
   - TypeScript-Typdefinitionen hinzufügen
   - Dokumentation verbessern
   - In neue Datei speichern: `/src/components/ui/ContentBlock.tsx`

2. **Weiterleitungsdatei erstellen**

3. **Tests erstellen**

### Schritt 5: ViewSwitcher.jsx migrieren

1. **Komponente migrieren:**
   - TypeScript-Typdefinitionen hinzufügen
   - ViewButton als eigene Komponente auslagern
   - Dokumentation verbessern
   - In neue Datei speichern: `/src/components/ui/ViewSwitcher.tsx`

2. **Weiterleitungsdatei erstellen**

3. **Tests erstellen**

### Schritt 6: Neue Basis-Komponenten erstellen

1. **FormField-Komponente erstellen:**
   - TypeScript-Typendefinitionen verwenden
   - Wiederverwendbare Komponente für Formularfelder
   - Zugänglichkeits- und Validierungsfunktionen

2. **Button-Komponente erstellen:**
   - TypeScript-Typendefinitionen verwenden
   - Wiederverwendbare Komponente für Buttons mit verschiedenen Stilen
   - Zugänglichkeitsfunktionen

## Gemeinsame Verbesserungen für alle Komponenten

Bei der Migration jeder Komponente werden folgende Verbesserungen vorgenommen:

1. **TypeScript-Konvertierung:**
   - Props-Interfaces definieren
   - Typsicherheit verbessern
   - JSDoc-Dokumentation hinzufügen

2. **Zugänglichkeitsverbesserungen:**
   - ARIA-Attribute hinzufügen
   - Tastaturnavigation sicherstellen
   - Kontrast und andere WCAG-Anforderungen prüfen

3. **Code-Qualität:**
   - Konsistente Formatierung
   - Entfernung von dupliziertem Code
   - Verbesserung der Lesbarkeit und Wartbarkeit

4. **Testbarkeit:**
   - Komponenten für einfaches Testen gestalten
   - Jest und React Testing Library Tests hinzufügen
   - Verschiedene Zustände und Randfälle testen

## Übergangsansatz

Während der Migration werden die alten Komponenten durch Weiterleitungen zu den neuen Komponenten ersetzt, um Abwärtskompatibilität zu gewährleisten. Diese Weiterleitungsdateien werden später entfernt, wenn alle Referenzen aktualisiert wurden.

## Testplan

Für jede migrierte Komponente werden folgende Tests durchgeführt:

1. **Unit-Tests:**
   - Prüfen, ob die Komponente korrekt rendert
   - Testen verschiedener Prop-Kombinationen
   - Prüfen von Benutzerinteraktionen
   - Prüfen von Zugänglichkeitsmerkmalen

2. **Integration in Beispielseiten:**
   - Komponente in einer Beispielseite verwenden
   - Sicherstellen, dass sie mit anderen Komponenten korrekt funktioniert

3. **Visual Regression Tests:**
   - Sicherstellen, dass die Komponente visuell konsistent ist

## Nächste Schritte nach UI-Komponenten

Nach erfolgreicher Migration der UI-Komponenten:

1. **Migration von API-bezogenen Komponenten**
2. **Migration von Seitenkomponenten**
3. **Migration von App-Layouts**