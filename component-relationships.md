# Component Relationship Visualization

## LAYOUT Components

### Low Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| Navbar | Navbar | Navbar | medium |
| MobileMenu | MobileMenu | MobileMenu | medium |
| Layout | Layout | Layout | medium |
| Footer | Footer | Footer | medium |

## FORM Components

### High Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| HotelRooms | None | None | low |
| NewsletterSignup | None | None | low |
| Hero | None | None | low |
| MembershipForm | None | None | low |
| HotelsSection | None | None | low |
| TravelAdvisor | None | None | low |

### Medium Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| MembershipHero | None | None | medium |
| MembershipBenefits | None | None | medium |

### Low Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| ContactForm | ContactForm | None | medium |

## OTHER Components

### High Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| TravelJourneyDesigner | None | None | low |
| TabbedAttractionsSection | None | None | low |
| RelatedHotelCard | None | None | low |
| JournalGrid | formatDate | None | low |
| HotelsPage | HotelsHero; HotelFilters; HotelGrid | None | low |
| HotelsHero | None | None | low |
| HotelQuickView | getHotelImage | None | low |
| HotelMapView | getHotelImage | None | low |
| HotelListView | getHotelImage | None | low |
| HotelGrid | None | None | low |
| HotelDetail | cn | None | low |
| CategoryBar | None | None | low |
| RoomList | RoomCard | None | low |
| OverviewSection | FeatureItem | None | low |
| OriginalsSection | None | None | low |
| LocalDining | None | None | low |
| HotelRoomsPage | HotelRooms | None | low |
| HotelGallery | None | None | low |
| HotelDetailPage | HotelDetailHero; HotelGallery; HotelAmenities; HotelRooms | None | low |
| HotelDetailHero | None | None | low |
| HotelAmenities | None | None | low |
| GallerySection | useAssetManager; ResponsiveDirectusImage; LoadingSpinner; AssetPreloader | None | low |
| DetailHeroBanner | getHotelImage; useAssetManager; ResponsiveDirectusImage; LoadingSpinner | None | low |
| DestinationOverview | None | None | low |
| ContentTabs | None | None | low |
| RestaurantFeature | None | None | low |
| PopularDestinations | None | None | low |
| JournalSection | None | None | low |
| InteractiveFeatures | None | None | low |
| FeaturedHotel | cn | None | low |
| DemoAssetGallery | ResponsiveDirectusImage, LoadingSpinner; AssetManagerProvider | None | low |
| AssetManagementExample | AssetManagerProvider; ResponsiveDirectusImage; AssetPreloader; LoadingSpinner; AssetGalleryExample | None | low |
| AssetGalleryExample | useAssetManager; ResponsiveDirectusImage; AssetPreloader; LoadingSpinner | None | low |
| RecommendedDestinations | None | None | low |
| PopularHotels | None | None | low |
| FeaturedDestination | None | None | low |
| DestinationInteractiveFeatures | None | None | low |
| DestinationInfo | None | None | low |
| DestinationHotels | None | None | low |
| DestinationGrid | None | None | low |
| DestinationExplorer | None | None | low |
| OverviewSection | None | None | low |
| InteractiveExperiences | None | None | low |
| InfoSection | None | None | low |
| DiningSection | None | None | low |
| DestinationHero | None | None | low |
| DestinationContentTabs | None | None | low |
| ActivitiesSection | None | None | low |
| directus-client | None | None | low |
| ResponsiveDirectusImage | useAssetManager; LoadingSpinner; getAssetURL | None | low |
| AssetManager | getAssetURL, getTransformedImageUrl | None | low |

### Medium Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| TravelContent | None | None | medium |
| JournalPostHero | None | None | medium |
| JournalPostContent | JournalPostHero; ArticleInfo; TabbedAttractionsSection; TravelContent; RelatedHotelsSection | None | medium |
| ArticleInfo | None | None | medium |
| Hero | None | None | medium |
| Hero | None | None | medium |
| WorldMapSection | None | None | medium |
| HotelCategories | None | None | medium |
| DestinationCategories | None | None | medium |
| Hero | None | None | medium |
| DestinationHeader | None | None | medium |
| AssetPreloader | useAssetManager | None | medium |

### Low Complexity

| Component | Dependencies | Used By | Migration Priority |
|-----------|--------------|---------|-------------------|
| UIStateContext | None | None | migrated |
| journal_post | None | None | medium |
| RelatedHotelsSection | RelatedHotelCard | None | medium |
| hotels | None | None | medium |
| ViewSwitcher | None | None | medium |
| ImprovedCategoryButton | None | None | medium |
| HotelModal | None | None | medium |
| HotelList | None | None | medium |
| HotelFilters | None | None | medium |
| HotelCard | None | None | medium |
| Filters | None | None | medium |
| FilterModal | None | None | medium |
| CategoryButton | None | None | medium |
| AnimatedHotelEntry | None | None | medium |
| hotel-detail | None | None | medium |
| RoomCard | None | None | medium |
| FeatureItem | None | None | medium |
| DiscoverDestinations | None | None | medium |
| common | None | None | medium |
| PageHero | None | None | medium |
| LoadingSpinner | LoadingSpinner | None | medium |
| ContentBlock | ContentBlock | None | medium |


## Dependency Graph

```mermaid
graph TD
    UIStateContext["⚪ UIStateContext"]
    Navbar["🟡 Navbar"]
    MobileMenu["🟡 MobileMenu"]
    Layout["🟡 Layout"]
    Footer["🟡 Footer"]
    TravelJourneyDesigner["🟢 TravelJourneyDesigner"]
    journal_post["🟡 journal_post"]
    TravelContent["🟡 TravelContent"]
    TabbedAttractionsSection["🟢 TabbedAttractionsSection"]
    RelatedHotelsSection["🟡 RelatedHotelsSection"]
    RelatedHotelCard["🟢 RelatedHotelCard"]
    JournalPostHero["🟡 JournalPostHero"]
    JournalPostContent["🟡 JournalPostContent"]
    ArticleInfo["🟡 ArticleInfo"]
    JournalGrid["🟢 JournalGrid"]
    Hero["🟡 Hero"]
    hotels["🟡 hotels"]
    ViewSwitcher["🟡 ViewSwitcher"]
    ImprovedCategoryButton["🟡 ImprovedCategoryButton"]
    HotelsPage["🟢 HotelsPage"]
    HotelsHero["🟢 HotelsHero"]
    HotelQuickView["🟢 HotelQuickView"]
    HotelModal["🟡 HotelModal"]
    HotelMapView["🟢 HotelMapView"]
    HotelListView["🟢 HotelListView"]
    HotelList["🟡 HotelList"]
    HotelGrid["🟢 HotelGrid"]
    HotelFilters["🟡 HotelFilters"]
    HotelDetail["🟢 HotelDetail"]
    HotelCard["🟡 HotelCard"]
    Hero["🟡 Hero"]
    Filters["🟡 Filters"]
    FilterModal["🟡 FilterModal"]
    CategoryButton["🟡 CategoryButton"]
    CategoryBar["🟢 CategoryBar"]
    AnimatedHotelEntry["🟡 AnimatedHotelEntry"]
    hotel-detail["🟡 hotel-detail"]
    RoomList["🟢 RoomList"]
    RoomCard["🟡 RoomCard"]
    OverviewSection["🟢 OverviewSection"]
    OriginalsSection["🟢 OriginalsSection"]
    LocalDining["🟢 LocalDining"]
    HotelRoomsPage["🟢 HotelRoomsPage"]
    HotelRooms["🟢 HotelRooms"]
    HotelGallery["🟢 HotelGallery"]
    HotelDetailPage["🟢 HotelDetailPage"]
    HotelDetailHero["🟢 HotelDetailHero"]
    HotelAmenities["🟢 HotelAmenities"]
    GallerySection["🟢 GallerySection"]
    FeatureItem["🟡 FeatureItem"]
    DetailHeroBanner["🟢 DetailHeroBanner"]
    DestinationOverview["🟢 DestinationOverview"]
    ContentTabs["🟢 ContentTabs"]
    WorldMapSection["🟡 WorldMapSection"]
    RestaurantFeature["🟢 RestaurantFeature"]
    PopularDestinations["🟢 PopularDestinations"]
    NewsletterSignup["🟢 NewsletterSignup"]
    JournalSection["🟢 JournalSection"]
    InteractiveFeatures["🟢 InteractiveFeatures"]
    HotelCategories["🟡 HotelCategories"]
    Hero["🟢 Hero"]
    FeaturedHotel["🟢 FeaturedHotel"]
    DiscoverDestinations["🟡 DiscoverDestinations"]
    DestinationCategories["🟡 DestinationCategories"]
    MembershipHero["🟡 MembershipHero"]
    MembershipForm["🟢 MembershipForm"]
    MembershipBenefits["🟡 MembershipBenefits"]
    ContactForm["🟡 ContactForm"]
    DemoAssetGallery["🟢 DemoAssetGallery"]
    AssetManagementExample["🟢 AssetManagementExample"]
    AssetGalleryExample["🟢 AssetGalleryExample"]
    RecommendedDestinations["🟢 RecommendedDestinations"]
    PopularHotels["🟢 PopularHotels"]
    Hero["🟡 Hero"]
    FeaturedDestination["🟢 FeaturedDestination"]
    DestinationInteractiveFeatures["🟢 DestinationInteractiveFeatures"]
    DestinationInfo["🟢 DestinationInfo"]
    DestinationHotels["🟢 DestinationHotels"]
    DestinationHeader["🟡 DestinationHeader"]
    DestinationGrid["🟢 DestinationGrid"]
    DestinationExplorer["🟢 DestinationExplorer"]
    OverviewSection["🟢 OverviewSection"]
    InteractiveExperiences["🟢 InteractiveExperiences"]
    InfoSection["🟢 InfoSection"]
    HotelsSection["🟢 HotelsSection"]
    DiningSection["🟢 DiningSection"]
    DestinationHero["🟢 DestinationHero"]
    DestinationContentTabs["🟢 DestinationContentTabs"]
    ActivitiesSection["🟢 ActivitiesSection"]
    common["🟡 common"]
    directus-client["🟢 directus-client"]
    ResponsiveDirectusImage["🟢 ResponsiveDirectusImage"]
    PageHero["🟡 PageHero"]
    LoadingSpinner["🟡 LoadingSpinner"]
    ContentBlock["🟡 ContentBlock"]
    AssetPreloader["🟡 AssetPreloader"]
    AssetManager["🟢 AssetManager"]
    TravelAdvisor["🟢 TravelAdvisor"]
```

### Legend

- 🔴 Highest Migration Priority
- 🟠 High Migration Priority
- 🟡 Medium Migration Priority
- 🟢 Low Migration Priority
- ⚪ Already Migrated
