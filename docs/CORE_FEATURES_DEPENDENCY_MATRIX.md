# Abhängigkeitsmatrix für Core Features

Diese Matrix zeigt die Abhängigkeiten und Beziehungen zwischen den Core-Feature-Komponenten, die in Sub-Batch 6.3 migriert werden sollen.

## Filterkomponenten

| Komponente | Abhängig von | Verwendet von | Gemeinsame Muster |
|------------|--------------|---------------|-------------------|
| FilterModal | framer-motion, cn | Filters | Modal, Checkbox-Gruppen, Animation, Filter-Sections, Apply/Cancel Buttons |
| Filters | useFilterReducer, FilterModal, cn | HotelsPage, DestinationPage | Suchfeld, Filter-Trigger, Filter-Zähler |
| CategoryButton | Next.js Link, cn | HotelFilters | Icon + Text, Aktiver Zustand |

## Formularkomponenten

| Komponente | Abhängig von | Verwendet von | Gemeinsame Muster |
|------------|--------------|---------------|-------------------|
| ContactForm | cn | ContactPage | Form-Submission, Validierung, Status-Handling, Input-Styling |
| MembershipForm | Next.js Link | MembershipPage | Form mit mehreren Feldern, Validierung, Status-Handling, Success-State |

## UI-Komponenten

| Komponente | Abhängig von | Verwendet von | Gemeinsame Muster |
|------------|--------------|---------------|-------------------|
| ViewSwitcher | framer-motion, cn | HotelsPage | Toggle-Buttons, Animation für aktiven Zustand |
| ContentBlock | framer-motion, cn | Mehrere Seitenkomponenten | Animation beim Scrollen, Layout-Container |

## Navigation/Layout-Komponenten

| Komponente | Abhängig von | Verwendet von | Gemeinsame Muster |
|------------|--------------|---------------|-------------------|
| Navbar | Next.js, framer-motion | Layout | Responsive, Animation, Mobile-Trigger |
| MobileMenu | Next.js, framer-motion | Layout | Overlay, Animation, Nav-Sections |

## Gemeinsame Abhängigkeiten

1. **Utility-Funktionen**:
   - `cn` (Tailwind Classname Utility)

2. **Animation-Bibliotheken**:
   - `framer-motion`

3. **React/Next.js Komponenten**:
   - `Link`
   - `useState`, `useEffect`

4. **Benutzerdefinierte Hooks**:
   - `useFilterReducer`
   - `useScrollPosition` (indirekt)

## Core-Feature-Muster

Aus der Analyse lassen sich folgende wiederkehrende Muster identifizieren:

1. **Form-Handling**:
   - Status-Management (isSubmitting, error, success)
   - Validierung
   - Form-Submission mit Fehlerbehandlung
   - Verschiedene Input-Typen (Text, Email, Checkbox, etc.)

2. **Filter-Logik**:
   - Filter-Status-Management
   - UI für Filterauswahl
   - Checkbox-Gruppen für Mehrfachauswahl
   - Apply/Cancel-Mechanismen

3. **UI-Interaktionen**:
   - Toggle-Mechanismen (ViewSwitcher)
   - Animation für aktive Zustände
   - Responsive Layouts

4. **Modal/Overlay-Muster**:
   - Öffnen/Schließen-Logik
   - Focus-Management
   - Keyboard-Navigation
   - Backdrop-Handling
   - Animierte Übergänge

5. **Responsive Navigation**:
   - Desktop/Mobile-Layouts
   - Toggle für Mobile-Menü
   - Scroll-Verhalten

## Empfohlene Basis-Komponenten

Basierend auf der Analyse empfehlen sich folgende Basis-Komponenten für die Migration:

1. **BaseForm**: Grundlegende Form-Komponente mit Status-Management, Validierung und Submission-Handling
2. **BaseFilter**: Flexible Filter-Komponente für Such- und Filterfunktionalität
3. **BaseFilterModal**: Erweiterbares Modal für komplexe Filteroptionen
4. **BaseToggle**: Komponente für Toggle-UI-Elemente wie ViewSwitcher
5. **BaseInput**: Grundlegende Input-Komponente mit Styling und Validierung
6. **BaseModal**: Grundlegende Modal/Overlay-Komponente mit Fokus-Management und Animation
7. **BaseNavigation**: Responsive Navigationskomponente mit Mobile-Menü-Integration

Diese Basis-Komponenten würden als Fundament für die spezialisierten Komponenten in Sub-Batch 6.3 dienen und die Wiederverwendbarkeit und Konsistenz im Projekt erhöhen.