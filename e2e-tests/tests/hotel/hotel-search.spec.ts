import { test, expect } from '@playwright/test';
import { HomePage, HotelsListPage } from '../../pages';
import { 
  assertElementCount, 
  assertContainsText, 
  assertHotelCard,
  getTestHotelsByCategory
} from '../../utils';

test.describe('Hotel Search and Filtering', () => {
  test('Basic search from homepage works correctly', async ({ page }) => {
    // Setup
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();
    
    // Execute search
    await homePage.searchHotels('South Tyrol');
    
    // Verify results
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.verifyHotelsListPageContent();
    
    // Verify search results contain hotels from South Tyrol
    const hotelCards = hotelsPage.hotelCards;
    await expect(hotelCards).toHaveCount.greaterThan(0);
    
    // Check if at least one hotel card mentions South Tyrol
    await assertContainsText(hotelsPage.hotelsList, 'South Tyrol');
  });
  
  test('Category filtering shows correct results', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Get initial hotel count
    const initialCount = await hotelsPage.getHotelCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Apply Mountain category filter
    const categoryToFilter = 'Mountain';
    await hotelsPage.filterByCategory(categoryToFilter);
    
    // Get expected hotels for this category from test data
    const expectedHotels = getTestHotelsByCategory(categoryToFilter);
    
    // Verify filtered results
    const filteredCount = await hotelsPage.getHotelCount();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verify at least one of the expected hotels is displayed
    const hotelCards = hotelsPage.hotelCards;
    let foundMatch = false;
    
    for (const hotel of expectedHotels) {
      const hotelCard = hotelCards.filter({ hasText: hotel.name }).first();
      if (await hotelCard.count() > 0) {
        foundMatch = true;
        break;
      }
    }
    
    expect(foundMatch).toBe(true);
    
    // Verify category is correctly applied to all results
    await hotelsPage.verifyFilterResults(categoryToFilter);
  });
  
  test('Price filtering shows hotels in correct range', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Apply price filter
    const minPrice = 200;
    const maxPrice = 300;
    await hotelsPage.filterByPriceRange(minPrice, maxPrice);
    
    // Verify price filter is applied
    // Note: This is a simplified verification that assumes prices are visible on hotel cards
    const hotelCards = hotelsPage.hotelCards;
    await expect(hotelCards).toHaveCount.greaterThan(0);
    
    // Check that all visible prices are within range
    // This implementation depends on the specific structure of the hotel cards
    const priceElements = page.locator('[data-testid="hotel-price"]');
    const count = await priceElements.count();
    
    for (let i = 0; i < count; i++) {
      const priceText = await priceElements.nth(i).textContent();
      if (priceText) {
        // Extract the numeric price value (implementation depends on the price format)
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        expect(price).toBeGreaterThanOrEqual(minPrice);
        expect(price).toBeLessThanOrEqual(maxPrice);
      }
    }
  });
  
  test('Sorting hotels changes the order', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Get initial order of hotels
    const hotelCardsBefore = hotelsPage.hotelCards;
    const initialHotelNames = await hotelCardsBefore.locator('h3, .hotel-name').allTextContents();
    
    // Apply sorting (price low to high)
    await hotelsPage.sortBy('Price (low to high)');
    
    // Get sorted order of hotels
    const hotelCardsAfter = hotelsPage.hotelCards;
    const sortedHotelNames = await hotelCardsAfter.locator('h3, .hotel-name').allTextContents();
    
    // Verify the order has changed
    // This is a simple check, but a more robust test would verify the actual sorting
    expect(sortedHotelNames).not.toEqual(initialHotelNames);
  });
  
  test('Reset filters returns to initial results', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Get initial hotel count
    const initialCount = await hotelsPage.getHotelCount();
    
    // Apply a filter
    await hotelsPage.filterByCategory('Beach');
    
    // Verify filter reduced the number of results
    const filteredCount = await hotelsPage.getHotelCount();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // Reset filters
    await hotelsPage.resetFilters();
    
    // Verify hotel count returned to initial count
    const resetCount = await hotelsPage.getHotelCount();
    expect(resetCount).toBeGreaterThanOrEqual(initialCount);
  });
  
  test('Map view displays hotel locations', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Switch to map view
    await hotelsPage.switchToMapView();
    
    // Verify map is visible
    await expect(hotelsPage.mapView).toBeVisible();
    
    // Verify map markers are present (implementation depends on the map)
    const mapMarkers = page.locator('[data-testid="map-marker"]');
    await expect(mapMarkers).toHaveCount.greaterThan(0);
    
    // Switch back to list view
    await hotelsPage.switchToListView();
    
    // Verify list is visible again
    await expect(hotelsPage.hotelsList).toBeVisible();
  });
  
  test('No results message is displayed when no matching hotels', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Search for a non-existent hotel
    await page.fill('[data-testid="search-input"]', 'Non-existent Hotel XYZ123');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Wait for search to complete
    await page.waitForLoadState('networkidle');
    
    // Verify no results message is displayed
    await expect(hotelsPage.noResultsMessage).toBeVisible();
    await assertContainsText(hotelsPage.noResultsMessage, 'No hotels found');
  });
  
  test('Pagination or load more functionality works', async ({ page }) => {
    // Setup
    const hotelsPage = new HotelsListPage(page);
    await hotelsPage.goto();
    await hotelsPage.waitForPageLoad();
    
    // Get initial hotel count
    const initialCount = await hotelsPage.getHotelCount();
    
    // Check if there's a load more button
    const loadMoreVisible = await hotelsPage.loadMoreButton.isVisible();
    
    if (loadMoreVisible) {
      // Click load more button
      await hotelsPage.loadMoreHotels();
      
      // Verify more hotels are loaded
      const newCount = await hotelsPage.getHotelCount();
      expect(newCount).toBeGreaterThan(initialCount);
    } else {
      // If no load more button, test passes automatically
      test.skip('No pagination or load more functionality found');
    }
  });
});