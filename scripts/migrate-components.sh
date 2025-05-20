#!/bin/bash
# Generated Migration Script for CincinHotels
# Generated on: 2025-05-20T09:48:37.159Z

set -e

echo "Starting component migration process..."

# Create necessary directories
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/ui"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/ui/buttons"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/ui/forms"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/layout"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels/filters"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/forms"
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal"


# Migration Group: UI Components
echo "Migrating ui components..."

# Migrating: common/ContentBlock.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting ContentBlock.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/ContentBlock.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/common/ContentBlock.tsx"
echo "✓ Migrated ContentBlock.jsx"

# Migrating: common/LoadingSpinner.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting LoadingSpinner.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/LoadingSpinner.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/common/LoadingSpinner.tsx"
echo "✓ Migrated LoadingSpinner.jsx"

# Migrating: hotel-detail/FeatureItem.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting FeatureItem.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/FeatureItem.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/FeatureItem.tsx"
echo "✓ Migrated FeatureItem.js"

# Migrating: hotels/CategoryButton.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting CategoryButton.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/CategoryButton.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/CategoryButton.tsx"
echo "✓ Migrated CategoryButton.js"

# Migrating: hotels/ViewSwitcher.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting ViewSwitcher.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/ViewSwitcher.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/ViewSwitcher.tsx"
echo "✓ Migrated ViewSwitcher.jsx"


# Migration Group: LAYOUT Components
echo "Migrating layout components..."


# Migration Group: COMMON Components
echo "Migrating common components..."

# Migrating: common/PageHero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting PageHero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/PageHero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/common/PageHero.tsx"
echo "✓ Migrated PageHero.jsx"

# Migrating: common/ResponsiveDirectusImage.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting ResponsiveDirectusImage.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/ResponsiveDirectusImage.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/common/ResponsiveDirectusImage.tsx"
echo "✓ Migrated ResponsiveDirectusImage.jsx"

# Migrating: common/AssetManager.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting AssetManager.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/AssetManager.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/common/AssetManager.tsx"
echo "✓ Migrated AssetManager.jsx"


# Migration Group: HOTELS Components
echo "Migrating hotels components..."

# Migrating: hotels/HotelMapView.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting HotelMapView.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/HotelMapView.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/HotelMapView.tsx"
echo "✓ Migrated HotelMapView.jsx"


# Migration Group: FORMS Components
echo "Migrating forms components..."

# Migrating: forms/MembershipForm.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/forms"
echo "Converting MembershipForm.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/forms/MembershipForm.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/forms/MembershipForm.tsx"
echo "✓ Migrated MembershipForm.jsx"


# Migration Group: OTHER Components
echo "Migrating other components..."

# Migrating: chatbot/TravelAdvisor.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/chatbot"
echo "Converting TravelAdvisor.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/chatbot/TravelAdvisor.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/chatbot/TravelAdvisor.tsx"
echo "✓ Migrated TravelAdvisor.jsx"

# Migrating: common/AssetPreloader.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting AssetPreloader.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/AssetPreloader.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/common/AssetPreloader.tsx"
echo "✓ Migrated AssetPreloader.jsx"

# Migrating: common/directus-client.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/common"
echo "Converting directus-client.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/common/directus-client.js" -o "/Users/samuelrenner/cincinhotels/src/components/common/directus-client.tsx"
echo "✓ Migrated directus-client.js"

# Migrating: destinations/DestinationExplorer.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting DestinationExplorer.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/DestinationExplorer.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/DestinationExplorer.tsx"
echo "✓ Migrated DestinationExplorer.jsx"

# Migrating: destinations/DestinationGrid.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting DestinationGrid.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/DestinationGrid.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/DestinationGrid.tsx"
echo "✓ Migrated DestinationGrid.jsx"

# Migrating: destinations/DestinationHeader.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting DestinationHeader.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/DestinationHeader.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/DestinationHeader.tsx"
echo "✓ Migrated DestinationHeader.jsx"

# Migrating: destinations/DestinationHotels.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting DestinationHotels.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/DestinationHotels.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/DestinationHotels.tsx"
echo "✓ Migrated DestinationHotels.jsx"

# Migrating: destinations/DestinationInfo.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting DestinationInfo.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/DestinationInfo.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/DestinationInfo.tsx"
echo "✓ Migrated DestinationInfo.jsx"

# Migrating: destinations/DestinationInteractiveFeatures.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting DestinationInteractiveFeatures.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/DestinationInteractiveFeatures.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/DestinationInteractiveFeatures.tsx"
echo "✓ Migrated DestinationInteractiveFeatures.jsx"

# Migrating: destinations/FeaturedDestination.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting FeaturedDestination.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/FeaturedDestination.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/FeaturedDestination.tsx"
echo "✓ Migrated FeaturedDestination.jsx"

# Migrating: destinations/PopularHotels.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting PopularHotels.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/PopularHotels.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/PopularHotels.tsx"
echo "✓ Migrated PopularHotels.jsx"

# Migrating: destinations/RecommendedDestinations.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations"
echo "Converting RecommendedDestinations.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/RecommendedDestinations.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/RecommendedDestinations.tsx"
echo "✓ Migrated RecommendedDestinations.jsx"

# Migrating: destinations/detail/ActivitiesSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting ActivitiesSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/ActivitiesSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/ActivitiesSection.tsx"
echo "✓ Migrated ActivitiesSection.jsx"

# Migrating: destinations/detail/DestinationContentTabs.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting DestinationContentTabs.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/DestinationContentTabs.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/DestinationContentTabs.tsx"
echo "✓ Migrated DestinationContentTabs.jsx"

# Migrating: destinations/detail/DestinationHero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting DestinationHero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/DestinationHero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/DestinationHero.tsx"
echo "✓ Migrated DestinationHero.jsx"

# Migrating: destinations/detail/DiningSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting DiningSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/DiningSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/DiningSection.tsx"
echo "✓ Migrated DiningSection.jsx"

# Migrating: destinations/detail/HotelsSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting HotelsSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/HotelsSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/HotelsSection.tsx"
echo "✓ Migrated HotelsSection.jsx"

# Migrating: destinations/detail/InfoSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting InfoSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/InfoSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/InfoSection.tsx"
echo "✓ Migrated InfoSection.jsx"

# Migrating: destinations/detail/InteractiveExperiences.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting InteractiveExperiences.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/InteractiveExperiences.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/InteractiveExperiences.tsx"
echo "✓ Migrated InteractiveExperiences.jsx"

# Migrating: destinations/detail/OverviewSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/destinations/detail"
echo "Converting OverviewSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/destinations/detail/OverviewSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/destinations/detail/OverviewSection.tsx"
echo "✓ Migrated OverviewSection.jsx"

# Migrating: examples/AssetGalleryExample.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/examples"
echo "Converting AssetGalleryExample.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/examples/AssetGalleryExample.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/examples/AssetGalleryExample.tsx"
echo "✓ Migrated AssetGalleryExample.jsx"

# Migrating: examples/AssetManagementExample.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/examples"
echo "Converting AssetManagementExample.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/examples/AssetManagementExample.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/examples/AssetManagementExample.tsx"
echo "✓ Migrated AssetManagementExample.jsx"

# Migrating: examples/DemoAssetGallery.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/examples"
echo "Converting DemoAssetGallery.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/examples/DemoAssetGallery.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/examples/DemoAssetGallery.tsx"
echo "✓ Migrated DemoAssetGallery.jsx"

# Migrating: forms/MembershipBenefits.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/forms"
echo "Converting MembershipBenefits.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/forms/MembershipBenefits.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/forms/MembershipBenefits.tsx"
echo "✓ Migrated MembershipBenefits.jsx"

# Migrating: forms/MembershipHero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/forms"
echo "Converting MembershipHero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/forms/MembershipHero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/forms/MembershipHero.tsx"
echo "✓ Migrated MembershipHero.jsx"

# Migrating: home/DestinationCategories.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting DestinationCategories.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/DestinationCategories.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/DestinationCategories.tsx"
echo "✓ Migrated DestinationCategories.jsx"

# Migrating: home/DiscoverDestinations.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting DiscoverDestinations.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/DiscoverDestinations.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/DiscoverDestinations.tsx"
echo "✓ Migrated DiscoverDestinations.jsx"

# Migrating: home/FeaturedHotel.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting FeaturedHotel.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/FeaturedHotel.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/FeaturedHotel.tsx"
echo "✓ Migrated FeaturedHotel.jsx"

# Migrating: home/Hero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting Hero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/Hero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/Hero.tsx"
echo "✓ Migrated Hero.jsx"

# Migrating: home/HotelCategories.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting HotelCategories.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/HotelCategories.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/HotelCategories.tsx"
echo "✓ Migrated HotelCategories.jsx"

# Migrating: home/InteractiveFeatures.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting InteractiveFeatures.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/InteractiveFeatures.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/InteractiveFeatures.tsx"
echo "✓ Migrated InteractiveFeatures.jsx"

# Migrating: home/JournalSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting JournalSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/JournalSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/JournalSection.tsx"
echo "✓ Migrated JournalSection.jsx"

# Migrating: home/NewsletterSignup.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting NewsletterSignup.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/NewsletterSignup.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/NewsletterSignup.tsx"
echo "✓ Migrated NewsletterSignup.jsx"

# Migrating: home/PopularDestinations.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting PopularDestinations.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/PopularDestinations.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/PopularDestinations.tsx"
echo "✓ Migrated PopularDestinations.jsx"

# Migrating: home/RestaurantFeature.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting RestaurantFeature.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/RestaurantFeature.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/RestaurantFeature.tsx"
echo "✓ Migrated RestaurantFeature.jsx"

# Migrating: home/WorldMapSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/home"
echo "Converting WorldMapSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/home/WorldMapSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/home/WorldMapSection.tsx"
echo "✓ Migrated WorldMapSection.jsx"

# Migrating: hotel-detail/ContentTabs.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting ContentTabs.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/ContentTabs.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/ContentTabs.tsx"
echo "✓ Migrated ContentTabs.js"

# Migrating: hotel-detail/DestinationOverview.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting DestinationOverview.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/DestinationOverview.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/DestinationOverview.tsx"
echo "✓ Migrated DestinationOverview.jsx"

# Migrating: hotel-detail/DetailHeroBanner.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting DetailHeroBanner.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/DetailHeroBanner.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/DetailHeroBanner.tsx"
echo "✓ Migrated DetailHeroBanner.js"

# Migrating: hotel-detail/GallerySection.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting GallerySection.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/GallerySection.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/GallerySection.tsx"
echo "✓ Migrated GallerySection.js"

# Migrating: hotel-detail/HotelAmenities.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting HotelAmenities.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/HotelAmenities.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/HotelAmenities.tsx"
echo "✓ Migrated HotelAmenities.jsx"

# Migrating: hotel-detail/HotelDetailHero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting HotelDetailHero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/HotelDetailHero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/HotelDetailHero.tsx"
echo "✓ Migrated HotelDetailHero.jsx"

# Migrating: hotel-detail/HotelGallery.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting HotelGallery.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/HotelGallery.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/HotelGallery.tsx"
echo "✓ Migrated HotelGallery.jsx"

# Migrating: hotel-detail/HotelRooms.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting HotelRooms.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/HotelRooms.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/HotelRooms.tsx"
echo "✓ Migrated HotelRooms.jsx"

# Migrating: hotel-detail/HotelRoomsPage.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting HotelRoomsPage.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/HotelRoomsPage.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/HotelRoomsPage.tsx"
echo "✓ Migrated HotelRoomsPage.jsx"

# Migrating: hotel-detail/LocalDining.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting LocalDining.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/LocalDining.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/LocalDining.tsx"
echo "✓ Migrated LocalDining.jsx"

# Migrating: hotel-detail/OriginalsSection.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting OriginalsSection.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/OriginalsSection.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/OriginalsSection.tsx"
echo "✓ Migrated OriginalsSection.js"

# Migrating: hotel-detail/OverviewSection.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting OverviewSection.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/OverviewSection.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/OverviewSection.tsx"
echo "✓ Migrated OverviewSection.js"

# Migrating: hotel-detail/RoomCard.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting RoomCard.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/RoomCard.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/RoomCard.tsx"
echo "✓ Migrated RoomCard.js"

# Migrating: hotel-detail/RoomList.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotel-detail"
echo "Converting RoomList.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotel-detail/RoomList.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotel-detail/RoomList.tsx"
echo "✓ Migrated RoomList.js"

# Migrating: hotels/AnimatedHotelEntry.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting AnimatedHotelEntry.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/AnimatedHotelEntry.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/AnimatedHotelEntry.tsx"
echo "✓ Migrated AnimatedHotelEntry.jsx"

# Migrating: hotels/CategoryBar.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting CategoryBar.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/CategoryBar.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/CategoryBar.tsx"
echo "✓ Migrated CategoryBar.js"

# Migrating: hotels/FilterModal.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting FilterModal.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/FilterModal.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/FilterModal.tsx"
echo "✓ Migrated FilterModal.js"

# Migrating: hotels/Filters.js
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting Filters.js to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/Filters.js" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/Filters.tsx"
echo "✓ Migrated Filters.js"

# Migrating: hotels/Hero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting Hero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/Hero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/Hero.tsx"
echo "✓ Migrated Hero.jsx"

# Migrating: hotels/HotelDetail.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting HotelDetail.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/HotelDetail.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/HotelDetail.tsx"
echo "✓ Migrated HotelDetail.jsx"

# Migrating: hotels/HotelGrid.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting HotelGrid.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/HotelGrid.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/HotelGrid.tsx"
echo "✓ Migrated HotelGrid.jsx"

# Migrating: hotels/HotelQuickView.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting HotelQuickView.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/HotelQuickView.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/HotelQuickView.tsx"
echo "✓ Migrated HotelQuickView.jsx"

# Migrating: hotels/HotelsHero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting HotelsHero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/HotelsHero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/HotelsHero.tsx"
echo "✓ Migrated HotelsHero.jsx"

# Migrating: hotels/ImprovedCategoryButton.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/hotels"
echo "Converting ImprovedCategoryButton.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/hotels/ImprovedCategoryButton.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/hotels/ImprovedCategoryButton.tsx"
echo "✓ Migrated ImprovedCategoryButton.jsx"

# Migrating: journal/Hero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal"
echo "Converting Hero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal/Hero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal/Hero.tsx"
echo "✓ Migrated Hero.jsx"

# Migrating: journal/JournalGrid.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal"
echo "Converting JournalGrid.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal/JournalGrid.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal/JournalGrid.tsx"
echo "✓ Migrated JournalGrid.jsx"

# Migrating: journal_post/ArticleInfo.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting ArticleInfo.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/ArticleInfo.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/ArticleInfo.tsx"
echo "✓ Migrated ArticleInfo.jsx"

# Migrating: journal_post/JournalPostContent.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting JournalPostContent.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/JournalPostContent.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/JournalPostContent.tsx"
echo "✓ Migrated JournalPostContent.jsx"

# Migrating: journal_post/JournalPostHero.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting JournalPostHero.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/JournalPostHero.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/JournalPostHero.tsx"
echo "✓ Migrated JournalPostHero.jsx"

# Migrating: journal_post/RelatedHotelCard.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting RelatedHotelCard.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/RelatedHotelCard.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/RelatedHotelCard.tsx"
echo "✓ Migrated RelatedHotelCard.jsx"

# Migrating: journal_post/RelatedHotelsSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting RelatedHotelsSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/RelatedHotelsSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/RelatedHotelsSection.tsx"
echo "✓ Migrated RelatedHotelsSection.jsx"

# Migrating: journal_post/TabbedAttractionsSection.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting TabbedAttractionsSection.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/TabbedAttractionsSection.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/TabbedAttractionsSection.tsx"
echo "✓ Migrated TabbedAttractionsSection.jsx"

# Migrating: journal_post/TravelContent.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journal_post"
echo "Converting TravelContent.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journal_post/TravelContent.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journal_post/TravelContent.tsx"
echo "✓ Migrated TravelContent.jsx"

# Migrating: journey-designer/TravelJourneyDesigner.jsx
mkdir -p "/Users/samuelrenner/cincinhotels/src/components/journey-designer"
echo "Converting TravelJourneyDesigner.jsx to TypeScript..."
npx ts-migrate -i "/Users/samuelrenner/cincinhotels/components/journey-designer/TravelJourneyDesigner.jsx" -o "/Users/samuelrenner/cincinhotels/src/components/journey-designer/TravelJourneyDesigner.tsx"
echo "✓ Migrated TravelJourneyDesigner.jsx"



echo "Migration script completed."
