# Migrationsplan Phase 3: Komplexere Komponenten

## Übersicht

Nachdem wir in Phase 2 einfache UI-Komponenten erfolgreich migriert haben, fokussieren wir uns jetzt auf komplexere, datenintensive Komponenten mit mehr Abhängigkeiten. Diese Phase umfasst:

1. Migration von Hotel-Komponenten (HotelCard, HotelList)
2. Migration von Such- und Filter-Komponenten (Filters)
3. Migration von Formularen (ContactForm)

## Typdefinitionen und Modelle

Bevor wir mit der Migration der Komponenten beginnen, erstellen wir gemeinsame Typdefinitionen in `/src/types/`:

1. **Hotel und Destination Modelle**:
   - `src/types/hotel.ts`
   - `src/types/destination.ts`
   - `src/types/category.ts`

2. **Gemeinsame Form-Typen**:
   - `src/types/forms.ts`

3. **API-Typen und Status-Typen**:
   - `src/types/api.ts`
   - `src/types/status.ts`

## Migrations-Schritte

### 1. HotelCard.js → src/components/hotels/HotelCard.tsx

**Ansatz**:
- Migriere die getHotelImage-Hilfsfunktion in eine eigenständige Utility-Funktion
- Erstelle detaillierte TypeScript-Interfaces für Hoteldaten
- Verbessere die Barrierefreiheit und Bild-Fallbacks
- Erweitere die Dokumentation

**Abhängigkeiten**:
- Types/Interfaces: Hotel, Category
- Utils: getHotelImage
- Komponenten: next/image

**Neue Struktur**:
- `src/utils/image-helpers.ts` - Enthält getHotelImage und andere Bild-Hilfsfunktionen
- `src/components/hotels/HotelCard.tsx` - Typsichere Komponente

### 2. HotelList.js → src/components/hotels/HotelList.tsx

**Ansatz**:
- Migriere Zustandslogik zu TypeScript
- Verbessere den Fehler- und Ladezustand
- Extrahiere wiederkehrende Logik in einen benutzerdefinierten Hook
- Implementiere fortgeschrittene Animation mit Typsicherheit

**Abhängigkeiten**:
- HotelCard, HotelModal, AnimatedHotelEntry, ViewSwitcher
- Types: Hotel, ApiError, ViewMode
- Hooks: useHotelNavigation (neu zu erstellen)

**Neue Struktur**:
- `src/hooks/useHotelNavigation.ts` - Hook für Hotel-Auswahl und Modals
- `src/components/hotels/HotelList.tsx` - Hauptkomponente
- Lazy-Loading für Map-View implementieren

### 3. Filters.js → src/components/hotels/Filters.tsx

**Ansatz**:
- Migriere Formularlogik zu TypeScript
- Optimiere State-Management mit useReducer
- Verbessere Barrierefreiheit für Filterkontrollen
- Erstelle typsichere Schnittstellen für Filter-Events

**Abhängigkeiten**:
- FilterModal
- Types: FilterState, FilterAction
- Hooks: useFilterReducer (neu zu erstellen)

**Neue Struktur**:
- `src/hooks/useFilterReducer.ts` - Zustandslogik für Filter
- `src/components/hotels/filters/Filters.tsx` - Hauptkomponente
- `src/components/hotels/filters/FilterControls.tsx` - Wiederverwendbare Filter-Kontrollelemente

### 4. ContactForm.jsx → src/components/forms/ContactForm.tsx

**Ansatz**:
- Migriere Formularlogik zu TypeScript
- Implementiere Formular-Validierung
- Extrahiere wiederverwendbare Form-Hooks
- Verbessere Fehlerbehandlung und Benutzerrückmeldung

**Abhängigkeiten**:
- Types: FormState, FormValidationErrors
- Hooks: useForm (neu zu erstellen)
- Komponenten: FormInput, FormTextarea (neu zu erstellen)

**Neue Struktur**:
- `src/hooks/useForm.ts` - Generischer Hook für Formularverwaltung
- `src/components/forms/ContactForm.tsx` - Hauptkomponente
- `src/components/ui/forms/` - Wiederverwendbare Formularkomponenten

## Tests

Für jede migrierte Komponente erstellen wir umfassende Tests:

1. **Unit-Tests**: Testen einzelne Komponenten und Hooks
2. **Integration-Tests**: Testen Komponenten-Interaktionen
3. **Snapshot-Tests**: Sichern konsistentes Rendering
4. **Mock-Tests**: Simulieren API-Aufrufe und Benutzereingaben

## Zusätzliche Aufgaben

1. **Optimierung von Datenzugriffs-Mustern**:
   - Implementierung von SWR oder React Query für bessere Datenverwaltung
   - Zentralisierte API-Handler für konsistente Fehlerbehandlung

2. **Refactoring von Rendering-Bedingungen**:
   - Extrahieren von bedingten Rendering-Logiken in separate Komponenten

3. **Performance-Optimierungen**:
   - Memoization von rechenintensiven Operationen
   - Lazy Loading von Komponenten

## Abhängigkeiten und Reihenfolge

Empfohlene Reihenfolge für die Migration:

1. Gemeinsame Typdefinitionen erstellen
2. Hilfsfunktionen und Hooks migrieren
3. HotelCard migrieren (einfachste der komplexen Komponenten)
4. ContactForm migrieren
5. Filters migrieren
6. HotelList migrieren (komplexeste Komponente)

## Weiterleitungsstrategie

Wie in Phase 2 erstellen wir Weiterleitungsdateien für jede migrierte Komponente, um Abwärtskompatibilität zu gewährleisten. Diese Dateien sollten klar als veraltet gekennzeichnet werden, um die Migration zu den neuen Komponenten zu fördern.

## Testabdeckung

Angestrebte Testabdeckung für Phase 3:

- Core-Komponenten: >80%
- Shared-Hooks: >90%
- Utility-Funktionen: 100%

Für wichtige Benutzerinteraktionen und Datenflüsse sollten spezifische Testfälle geschrieben werden.