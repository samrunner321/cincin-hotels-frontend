# Migration Plan: Batch 6 - Complex Components

## Übersicht

Batch 6 ist der komplexeste und umfangreichste Migrationsbatch mit 57 Komponenten, einer durchschnittlichen Komplexität von 90 und einem geschätzten Aufwand von 513 Stunden. Um diese große Aufgabe zu bewältigen, teilen wir Batch 6 in die folgenden, sinnvoll gegliederten Sub-Batches auf.

## Strategie

Die Komponenten werden in drei Hauptphasen migriert:

1. **Foundation-Komponenten**: Grundlegende UI-Elemente und Utility-Komponenten
2. **Mid-Complexity-Komponenten**: Komponenten mit mittlerer Komplexität (50-80)
3. **High-Complexity-Komponenten**: Sehr komplexe Komponenten (>80)

Innerhalb jeder Phase berücksichtigen wir Abhängigkeiten und verwandte Funktionalität.

## Sub-Batch 6.1: Foundation-Komponenten

| Komponente | Pfad | Komplexität | Priorität |
|------------|------|-------------|-----------|
| directus-client | components/common/directus-client.js | 46 | Hoch |
| ResponsiveDirectusImage | components/common/ResponsiveDirectusImage.jsx | 76 | Hoch |
| OriginalsSection | components/hotel-detail/OriginalsSection.js | 49 | Mittel |
| RecommendedDestinations | components/destinations/RecommendedDestinations.jsx | 49 | Mittel |
| NewsletterSignup | components/home/NewsletterSignup.jsx | 49 | Mittel |
| TabbedAttractionsSection | components/journal_post/TabbedAttractionsSection.jsx | 50 | Mittel |
| JournalSection | components/home/JournalSection.jsx | 51 | Mittel |
| DestinationHotels | components/destinations/DestinationHotels.jsx | 46 | Mittel |
| RelatedHotelCard | components/journal_post/RelatedHotelCard.jsx | 44 | Mittel |

**Geschätzter Aufwand**: 45-60 Stunden  
**Strategie**: Diese Komponenten bilden die Grundlage für komplexere Komponenten und sollten zuerst migriert werden. Sie haben weniger Abhängigkeiten und sind daher einfacher zu migrieren.

## Sub-Batch 6.2: UI und Navigation

| Komponente | Pfad | Komplexität | Priorität |
|------------|------|-------------|-----------|
| HotelsHero | components/hotels/HotelsHero.jsx | 59 | Hoch |
| PopularDestinations | components/home/PopularDestinations.jsx | 59 | Hoch |
| PopularHotels | components/destinations/PopularHotels.jsx | 59 | Hoch |
| DestinationInteractiveFeatures | components/destinations/DestinationInteractiveFeatures.jsx | 69 | Mittel |
| HotelListView | components/hotels/HotelListView.jsx | 70 | Mittel |
| HotelRoomsPage | components/hotel-detail/HotelRoomsPage.jsx | 70 | Mittel |
| DestinationHero | components/destinations/detail/DestinationHero.jsx | 74 | Mittel |
| DestinationGrid | components/destinations/DestinationGrid.jsx | 74 | Mittel |
| HotelDetailHero | components/hotel-detail/HotelDetailHero.jsx | 75 | Mittel |

**Geschätzter Aufwand**: 60-75 Stunden  
**Strategie**: Diese Komponenten konzentrieren sich auf die UI und Navigation und haben weniger komplexe Logik.

## Sub-Batch 6.3: Core Features (Mid-Complexity)

| Komponente | Pfad | Komplexität | Priorität |
|------------|------|-------------|-----------|
| Hero (Home) | components/home/Hero.jsx | 78 | Hoch |
| DestinationInfo | components/destinations/DestinationInfo.jsx | 77 | Hoch |
| InfoSection | components/destinations/detail/InfoSection.jsx | 81 | Hoch |
| AssetManager | components/common/AssetManager.jsx | 83 | Hoch |
| HotelGrid | components/hotels/HotelGrid.jsx | 83 | Hoch |
| InteractiveFeatures | components/home/InteractiveFeatures.jsx | 83 | Mittel |
| FeaturedDestination | components/destinations/FeaturedDestination.jsx | 84 | Mittel |
| RoomList | components/hotel-detail/RoomList.js | 84 | Mittel |

**Geschätzter Aufwand**: 70-85 Stunden  
**Strategie**: Diese Komponenten bilden die Kernfunktionalität der Anwendung und haben eine mittlere Komplexität.

## Sub-Batch 6.4: Advanced UI (High-Complexity)

| Komponente | Pfad | Komplexität | Priorität |
|------------|------|-------------|-----------|
| DestinationOverview | components/hotel-detail/DestinationOverview.jsx | 86 | Hoch |
| HotelMapView | components/hotels/HotelMapView.jsx | 87 | Hoch |
| HotelQuickView | components/hotels/HotelQuickView.jsx | 88 | Hoch |
| FeaturedHotel | components/home/FeaturedHotel.jsx | 88 | Hoch |
| DemoAssetGallery | components/examples/DemoAssetGallery.jsx | 88 | Mittel |
| DetailHeroBanner | components/hotel-detail/DetailHeroBanner.js | 89 | Mittel |
| RestaurantFeature | components/home/RestaurantFeature.jsx | 91 | Mittel |
| MembershipForm | components/forms/MembershipForm.jsx | 91 | Mittel |
| LocalDining | components/hotel-detail/LocalDining.jsx | 92 | Mittel |

**Geschätzter Aufwand**: 85-100 Stunden  
**Strategie**: Diese Komponenten haben fortgeschrittene UI-Funktionalität und sind komplexer, aber immer noch eigenständig.

## Sub-Batch 6.5: Komplexe Feature-Komponenten

| Komponente | Pfad | Komplexität | Priorität |
|------------|------|-------------|-----------|
| OverviewSection | components/hotel-detail/OverviewSection.js | 93 | Hoch |
| JournalGrid | components/journal/JournalGrid.jsx | 98 | Hoch |
| HotelDetail | components/hotels/HotelDetail.jsx | 98 | Hoch |
| CategoryBar | components/hotels/CategoryBar.js | 98 | Hoch |
| AssetGalleryExample | components/examples/AssetGalleryExample.jsx | 102 | Mittel |
| HotelDetailPage | components/hotel-detail/HotelDetailPage.jsx | 104 | Mittel |
| HotelAmenities | components/hotel-detail/HotelAmenities.jsx | 104 | Mittel |
| ActivitiesSection | components/destinations/detail/ActivitiesSection.jsx | 107 | Mittel |
| HotelsPage | components/hotels/HotelsPage.jsx | 107 | Mittel |

**Geschätzter Aufwand**: 95-110 Stunden  
**Strategie**: Diese Komponenten haben komplexe Funktionalität und Abhängigkeiten.

## Sub-Batch 6.6: Maximal-Komplexität

| Komponente | Pfad | Komplexität | Priorität |
|------------|------|-------------|-----------|
| DiningSection | components/destinations/detail/DiningSection.jsx | 108 | Hoch |
| HotelRooms | components/hotel-detail/HotelRooms.jsx | 109 | Hoch |
| ContentTabs | components/hotel-detail/ContentTabs.js | 118 | Hoch |
| DestinationContentTabs | components/destinations/detail/DestinationContentTabs.jsx | 117 | Hoch |
| TravelJourneyDesigner | components/journey-designer/TravelJourneyDesigner.jsx | 121 | Mittel |
| TravelAdvisor | components/chatbot/TravelAdvisor.jsx | 124 | Mittel |
| InteractiveExperiences | components/destinations/detail/InteractiveExperiences.jsx | 136 | Mittel |
| HotelGallery | components/hotel-detail/HotelGallery.jsx | 137 | Mittel |
| OverviewSection (Destination) | components/destinations/detail/OverviewSection.jsx | 139 | Mittel |
| HotelsSection | components/destinations/detail/HotelsSection.jsx | 155 | Mittel |
| DestinationExplorer | components/destinations/DestinationExplorer.jsx | 169 | Mittel |
| GallerySection | components/hotel-detail/GallerySection.js | 177 | Mittel |

**Geschätzter Aufwand**: 130-160 Stunden  
**Strategie**: Diese hochkomplexen Komponenten erfordern eine besondere Behandlung. Für einige dieser Komponenten kann es sinnvoll sein, sie in kleinere Unterkomponenten aufzuteilen, bevor sie migriert werden.

## Abhängigkeiten und Reihenfolge

1. Zuerst Sub-Batch 6.1 migrieren (Foundation-Komponenten)
2. Dann parallel Sub-Batch 6.2 und 6.3 migrieren
3. Sub-Batch 6.4 migrieren (abhängig von den vorhergehenden Batches)
4. Sub-Batch 6.5 migrieren
5. Sub-Batch 6.6 zuletzt migrieren, da dies die komplexesten Komponenten enthält

## Spezielle Überlegungen für komplexe Komponenten

Bei besonders komplexen Komponenten (Komplexität > 120) empfehlen wir folgenden Ansatz:

1. **Analysephase**: Detaillierte Analyse der Komponente, um Abhängigkeiten und potenzielle Probleme zu identifizieren
2. **Fragmentierung**: Aufteilen der Komponente in kleinere, besser handhabbare Teile
3. **Schrittweise Migration**: Jedes Fragment einzeln migrieren
4. **Zusammenführung**: Fragmentierte Komponenten zu einer neuen TypeScript-Komponente zusammenführen

## Technische Herausforderungen und Lösungen

### 1. Memory-Issues bei großen Komponenten
- Verwenden Sie `--max-old-space-size=16384` für Node.js
- Komponenten in kleinere Teile aufteilen

### 2. Komplexe Abhängigkeitsstrukturen
- Abhängigkeitsgraphen für jede Komponente erstellen
- Von unten nach oben migrieren (abhängigkeitsfreie Komponenten zuerst)

### 3. Komplexe TypeScript-Konvertierung
- Spezialisierte Interfaces für jede Komponente erstellen
- Komplexe Logik in separate Hooks extrahieren
- Schrittweise Typannotationen einführen

### 4. Wiederherstellungspunkte
- Checkpoints während der Migration einrichten
- Bei großen Komponenten nach jedem Hauptschritt commiten

## Zeitplan

Geschätzter Zeitrahmen für die vollständige Migration von Batch 6: 14-20 Arbeitstage für einen erfahrenen Entwickler. Die Aufteilung nach Sub-Batches:

- Sub-Batch 6.1: 2-3 Tage
- Sub-Batch 6.2: 2-3 Tage
- Sub-Batch 6.3: 2-3 Tage
- Sub-Batch 6.4: 3-4 Tage
- Sub-Batch 6.5: 3-4 Tage
- Sub-Batch 6.6: 4-5 Tage

## Risikobewertung und Minderungsstrategien

| Risiko | Wahrscheinlichkeit | Auswirkung | Minderungsstrategie |
|--------|-------------------|------------|---------------------|
| Speicherprobleme | Hoch | Hoch | Komponenten fragmentieren, Node.js mit mehr Speicher ausführen |
| Inkonsistente Typisierung | Mittel | Hoch | Gemeinsame Typbasisdateien erstellen, Typen vor der Migration definieren |
| Regression in UI | Mittel | Mittel | Umfassende visuelle Regressionstests |
| Unentdeckte Abhängigkeiten | Hoch | Mittel | Sorgfältige Analyse vor Migration, kleinschrittige Änderungen |
| Zeit- und Ressourcenmangel | Mittel | Hoch | Fortschrittsverfolgung einrichten, klare Prioritäten setzen |

## Abschlussprüfung

Nach Abschluss jedes Sub-Batches führen wir folgende Überprüfungen durch:

1. Alle Tests ausführen und sicherstellen, dass sie bestehen
2. Manuelle Überprüfung der UI auf visuelle Regression
3. Linting und TypeScript-Fehlerprüfung
4. Performance-Benchmarking für migrierten Code

## Nächste Schritte

1. Detaillierte Komponentenanalyse für Sub-Batch 6.1 durchführen
2. Gemeinsame TypeScript-Interfaces erstellen
3. Utility-Funktionen extrahieren
4. Mit der Migration der Foundation-Komponenten beginnen