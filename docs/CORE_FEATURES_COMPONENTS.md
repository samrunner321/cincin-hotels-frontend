# Core-Feature-Komponenten

Dieses Dokument beschreibt die Core-Feature-Komponenten, die im Rahmen der Migration zu TypeScript in Sub-Batch 6.3 implementiert wurden. Diese Komponenten bieten zentrale Funktionalitäten für die Anwendung und sind als erweiterbare Basis-Komponenten konzipiert.

## Basis-Komponenten

### 1. BaseForm

`BaseForm` ist eine umfassende Formular-Komponente, die verschiedene Formular-Layouts, Feldtypen und Validierung unterstützt.

**Hauptmerkmale:**
- Verschiedene Layout-Optionen (vertikal, horizontal, Grid)
- Flexible Feld-Konfiguration für alle gängigen Input-Typen
- Eingebaute Validierung (sowohl Standard als auch benutzerdefiniert)
- Status-Management (Submitting, Success, Error)
- Barrierefreiheit mit ARIA-Attributen
- Anpassbare Styling-Optionen

**Beispiel:**
```tsx
<BaseForm
  fields={[
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validate: (value) => {
        // Benutzerdefinierte Validierung
      }
    }
  ]}
  onSubmit={handleSubmit}
  submitButtonText="Submit"
  layout="grid"
  columns={2}
/>
```

### 2. BaseInput

`BaseInput` ist eine flexible Input-Komponente für verschiedene Eingabetypen mit umfangreichen Anpassungsoptionen.

**Hauptmerkmale:**
- Unterstützung für alle gängigen Input-Typen
- Prefix- und Suffix-Elemente (inkl. Icons)
- Validierungsstatus und Feedback
- Verschiedene Größen und Stile
- Focus-Management
- Barrierefreiheit

**Beispiel:**
```tsx
<BaseInput
  id="email"
  name="email"
  type="email"
  label="E-Mail-Adresse"
  placeholder="name@example.com"
  required
  icon={<EmailIcon />}
  error={errors.email}
  onChange={handleChange}
/>
```

### 3. BaseFilter

`BaseFilter` bietet eine umfassende Filterlösung mit Suchfeld und erweiterten Filteroptionen.

**Hauptmerkmale:**
- Kombinierte Such- und Filter-Funktionalität
- Flexible Filter-Gruppen und -Optionen
- Modal- oder Inline-Filter-Darstellung
- Filter-Zähler und aktiver Filter-Anzeige
- Status-Management für Filteränderungen

**Beispiel:**
```tsx
<BaseFilter
  onSearch={handleSearch}
  onFilterChange={handleFilterChange}
  filterGroups={[
    {
      id: 'categories',
      label: 'Kategorien',
      options: [
        { id: 1, label: 'Kategorie 1' },
        { id: 2, label: 'Kategorie 2' }
      ]
    }
  ]}
  activeFilters={{ categories: [1] }}
/>
```

### 4. BaseFilterModal

`BaseFilterModal` ist ein Modal-Dialog für komplexe Filteroptionen mit Checkbox-Gruppen.

**Hauptmerkmale:**
- Flexible Filter-Gruppen und -Optionen
- Multi-select oder Single-select pro Gruppe
- Animation mit framer-motion
- Apply/Cancel/Reset-Funktionalität
- Fokus-Management und Barrierefreiheit

**Beispiel:**
```tsx
<BaseFilterModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onFilterChange={handleFilterChange}
  activeFilters={{ categories: [1, 2] }}
  filterGroups={[
    { id: 'categories', label: 'Kategorien', options: [...] }
  ]}
/>
```

### 5. BaseModal

`BaseModal` bietet eine flexible Modal-Komponente mit Animation, verschiedenen Positionen und Größen.

**Hauptmerkmale:**
- Verschiedene Positionen (Mitte, oben, rechts, unten, links, Vollbild)
- Verschiedene Größen (klein, mittel, groß, extra groß, Vollbild)
- Verschiedene Animationen (Fade, Zoom, Slide)
- Fokus-Trap für Barrierefreiheit
- Header, Body und Footer-Bereiche
- Anpassbarer Close-Button

**Beispiel:**
```tsx
<BaseModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  position="center"
  size="md"
  animation="fade"
>
  <p>Modal Content</p>
</BaseModal>
```

### 6. BaseNavigation

`BaseNavigation` ist eine umfassende, responsive Navigationskomponente, die verschiedene Layouts und Verhaltensweisen unterstützt.

**Hauptmerkmale:**
- Horizontale, vertikale und Drawer-Layouts
- Mobile-Menü mit Animation
- Dropdown-Unterstützung für verschachtelte Navigation
- Transparenz-Effekt beim Scrollen
- Verschiedene Positionierungsoptionen (fixed, sticky, static)
- Anpassbare Farben und Stile
- Vollständige Barrierefreiheit (ARIA-Attribute, Fokus-Management)

**Beispiel:**
```tsx
<BaseNavigation
  items={[
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Services', href: '/services', children: [
      { text: 'Design', href: '/services/design' },
      { text: 'Development', href: '/services/development' }
    ]},
    { text: 'Contact', href: '/contact', isButton: true }
  ]}
  logo={<Image src="/logo.png" alt="Logo" width={120} height={40} />}
  transparent={true}
  position="fixed"
  mobileMenu={true}
/>
```

### 7. BaseList

`BaseList` ist eine vielseitige Komponente zur Anzeige von Datenlisten mit umfangreichen Funktionen für Darstellung, Filterung und Interaktion.

**Hauptmerkmale:**
- Mehrere Ansichtsmodi (Grid, Liste, Tabelle, Karte)
- Paginierung mit vollständiger Kontrolle
- Sortierungsoptionen
- Suchfunktion
- Selektierbare Elemente
- Benutzerdefinierte Lade-, Fehler- und Leer-Zustände
- Animation mit framer-motion
- Responsive Grid-Layouts

**Beispiel:**
```tsx
<BaseList
  items={hotels}
  renderItem={(hotel) => <HotelCard {...hotel} />}
  getItemKey={(hotel) => hotel.id}
  title="Unsere Hotels"
  viewModes={['grid', 'list', 'map']}
  defaultViewMode="grid"
  pagination={{
    currentPage: page,
    totalPages: totalPages,
    itemsPerPage: 10,
    onPageChange: handlePageChange
  }}
  sortOptions={[
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Preis (niedrig-hoch)', value: 'price_asc' }
  ]}
  searchable={true}
  onSearch={handleSearch}
  isLoading={isLoading}
  error={error}
/>
```

## Spezialisierte Komponenten

### 1. ContactForm

Eine spezialisierte Formular-Komponente für Kontaktanfragen, basierend auf BaseForm.

**Hauptmerkmale:**
- Vordefinierte Felder (Name, E-Mail, Betreff, Nachricht)
- Eingebaute Validierung
- Status-Management
- Anpassbare Header und Footer

**Beispiel:**
```tsx
<ContactForm
  onSubmit={handleFormSubmit}
  title="Kontaktieren Sie uns"
  description="Füllen Sie das Formular aus und wir werden uns in Kürze bei Ihnen melden."
/>
```

### 2. HotelFilters

Eine spezialisierte Filter-Komponente für Hotels, basierend auf BaseFilter.

**Hauptmerkmale:**
- Vordefinierte Filter-Gruppen für Hotels (Standorte, Kategorien, Preisbereiche, Bewertungen)
- Benutzerdefinierte Icons für Filter-Gruppen
- Anzeige von Zählern für Filter-Optionen

**Beispiel:**
```tsx
<HotelFilters
  onSearch={handleSearch}
  onFilterChange={handleFilterChange}
  locations={locationOptions}
  categories={categoryOptions}
  activeFilters={{ categories: [1, 2], locations: [3] }}
/>
```

### 3. HotelModal

Ein spezialisiertes Modal für die Anzeige von Hotel-Details, basierend auf BaseModal.

**Hauptmerkmale:**
- Anzeige von Hotel-Bildern, Beschreibung, Features, Preis
- Bewertungsanzeige
- Buchungs-Widget (optional)
- Buttons für Buchung und Details

**Beispiel:**
```tsx
<HotelModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  hotel={selectedHotel}
  onBook={handleBooking}
  showBookingWidget={true}
/>
```

### 4. MainNavigation

Eine spezialisierte Navigationskomponente für die Hauptnavigation der Anwendung, basierend auf BaseNavigation.

**Hauptmerkmale:**
- Vorkonfiguriertes Layout für die Anwendungs-Hauptnavigation
- Integration mit dem Design-System
- Mobile-Darstellung mit Logo-Wechsel bei Scroll
- Sprachauswahl-Integration

**Beispiel:**
```tsx
<MainNavigation 
  transparent={true}
  currentLanguage="de"
  onLanguageChange={handleLanguageChange}
  userIsLoggedIn={isLoggedIn}
  onLogout={handleLogout}
/>
```

### 5. HotelList

Eine spezialisierte Listenkomponente für Hotels, basierend auf BaseList.

**Hauptmerkmale:**
- Vorformatierte Hotel-Karten-Darstellung
- Integration mit HotelFilters
- Spezielle View-Modi für Hotels (Grid, Liste, Karte)
- Optimierte Darstellung von Hoteldetails

**Beispiel:**
```tsx
<HotelList
  hotels={filteredHotels}
  isLoading={isLoading}
  error={error}
  viewModes={['grid', 'list', 'map']}
  onHotelClick={openHotelModal}
  onFilterChange={handleFilterChange}
  currentFilters={activeFilters}
/>
```

## Allgemeine Designprinzipien

Bei der Implementierung dieser Komponenten wurden folgende Prinzipien berücksichtigt:

1. **Komposition über Vererbung**: Die spezialisierten Komponenten verwenden die Basis-Komponenten durch Komposition, nicht durch Vererbung.

2. **Strikte Typisierung**: Alle Komponenten haben umfassende TypeScript-Interfaces für Props und Datenstrukturen.

3. **Barrierefreiheit**: ARIA-Attribute, Fokus-Management und Tastatur-Navigation wurden durchgängig berücksichtigt.

4. **Responsive Design**: Alle Komponenten sind für verschiedene Bildschirmgrößen optimiert.

5. **Animation**: Framer Motion wird für flüssige Übergänge und Animationen verwendet.

6. **Einheitliches Styling**: CSS-Module für komponentenspezifische Stile, mit einheitlichem Design-System.

7. **Erweiterbarkeit**: Alle Basis-Komponenten sind so konzipiert, dass sie leicht erweitert oder angepasst werden können.

## Migration und Rückwärtskompatibilität

Die Core-Feature-Komponenten wurden mit Rückwärtskompatibilität im Hinterkopf implementiert:

1. Die spezialisierten Komponenten haben die gleichen Prop-Interfaces wie ihre Legacy-Gegenstücke, mit optionalen erweiterten Props.

2. Wo nötig, wurden Wrapper-Komponenten erstellt, um bestehende Codepfade zu unterstützen.

3. Die Komponenten wurden so konzipiert, dass sie mit dem bestehenden Styling und Layout-System kompatibel sind.

## Leistungen und Vorteile

Die Migration zu diesen Core-Feature-Komponenten bietet folgende Vorteile:

1. **Reduzierte Code-Duplizierung**: Durch die Konsolidierung gemeinsamer Funktionalitäten in Basis-Komponenten wurde die Codebasis erheblich reduziert.

2. **Verbesserte Konsistenz**: Einheitliche Verhaltensweisen und Stile über die gesamte Anwendung hinweg.

3. **Bessere Barrierefreiheit**: Systematische Implementierung von ARIA-Attributen und Tastaturunterstützung.

4. **Schnellere Entwicklung**: Neue Funktionen können schneller durch Verwendung der Basis-Komponenten implementiert werden.

5. **Bessere Testbarkeit**: Basis-Komponenten sind umfassend getestet und reduzieren den Bedarf an Tests für spezialisierte Komponenten.

6. **Erhöhte Flexibilität**: Die Komponenten sind so gestaltet, dass sie zukünftige Anforderungen leicht aufnehmen können.

7. **Bessere Dokumentation**: Jede Komponente ist umfassend dokumentiert, was die Verwendung und Wartung erleichtert.

## Nächste Schritte

Für die weitere Entwicklung der Core-Feature-Komponenten sind folgende Schritte geplant:

1. **BaseTable**: Eine Basis-Komponente für tabellarische Daten mit Sortierung, Filterung und Paginierung.

2. **BaseChart**: Eine Basis-Komponente für verschiedene Diagrammtypen (Balken, Linien, Kreisdiagramme).

3. **BaseTabs**: Eine flexible Tab-Komponente für verschiedene Inhaltsabschnitte.

4. **BaseWizard**: Eine mehrstufige Formular-Komponente für komplexe Prozesse.

5. **Integration mit Internationalisierung**: Vollständige i18n-Unterstützung für alle Komponenten.

6. **Performance-Optimierungen**: Weitere Optimierungen für größere Datensätze und komplexe Darstellungen.

7. **Evaluierung von UI-Frameworks**: Prüfen, ob ein bestehendes UI-Framework (wie Material-UI, Chakra UI, etc.) integriert werden sollte, oder ob die eigenen Komponenten weiterentwickelt werden sollen.