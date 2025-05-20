import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object model for the Hotels List Page
 */
export class HotelsListPage extends BasePage {
  // Hotels list page specific elements
  readonly pageTitle: Locator;
  readonly hotelsList: Locator;
  readonly hotelCards: Locator;
  readonly filterSection: Locator;
  readonly filterModal: Locator;
  readonly filterButton: Locator;
  readonly categoryFilters: Locator;
  readonly priceFilter: Locator;
  readonly sortDropdown: Locator;
  readonly viewSwitcher: Locator;
  readonly listViewButton: Locator;
  readonly mapViewButton: Locator;
  readonly mapView: Locator;
  readonly searchResultsCount: Locator;
  readonly loadMoreButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page, '/hotels');
    
    // Initialize hotels list page specific elements
    this.pageTitle = page.locator('h1');
    this.hotelsList = page.locator('[data-testid="hotels-list"]');
    this.hotelCards = page.locator('[data-testid="hotel-card"]');
    this.filterSection = page.locator('[data-testid="filter-section"]');
    this.filterModal = page.locator('[data-testid="filter-modal"]');
    this.filterButton = page.locator('[data-testid="filter-button"]');
    this.categoryFilters = page.locator('[data-testid="category-filters"] button');
    this.priceFilter = page.locator('[data-testid="price-filter"]');
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"]');
    this.viewSwitcher = page.locator('[data-testid="view-switcher"]');
    this.listViewButton = page.locator('[data-testid="list-view-button"]');
    this.mapViewButton = page.locator('[data-testid="map-view-button"]');
    this.mapView = page.locator('[data-testid="map-view"]');
    this.searchResultsCount = page.locator('[data-testid="results-count"]');
    this.loadMoreButton = page.locator('[data-testid="load-more"]');
    this.noResultsMessage = page.locator('[data-testid="no-results"]');
  }

  /**
   * Get the number of hotel cards displayed
   */
  async getHotelCount(): Promise<number> {
    return await this.hotelCards.count();
  }

  /**
   * Verify hotels list page content
   */
  async verifyHotelsListPageContent() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.hotelsList).toBeVisible();
    await expect(this.filterSection).toBeVisible();
    await expect(this.viewSwitcher).toBeVisible();
  }

  /**
   * Open filter modal (on mobile)
   */
  async openFilterModal() {
    if (await this.filterButton.isVisible()) {
      await this.filterButton.click();
      await expect(this.filterModal).toBeVisible();
    }
  }

  /**
   * Apply a category filter
   */
  async filterByCategory(category: string) {
    // On mobile, first open the filter modal
    await this.openFilterModal();
    
    // Click on the category filter
    await this.categoryFilters.getByText(category, { exact: false }).click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Apply a price range filter
   */
  async filterByPriceRange(min: number, max: number) {
    // On mobile, first open the filter modal
    await this.openFilterModal();
    
    // Implementation will depend on the specific price filter component
    // This is a simplified version assuming min/max inputs
    const minInput = this.priceFilter.locator('input[name="min"]');
    const maxInput = this.priceFilter.locator('input[name="max"]');
    
    await minInput.fill(min.toString());
    await maxInput.fill(max.toString());
    
    // Apply filter button
    await this.priceFilter.locator('button[type="submit"]').click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sort hotels by specified criteria
   */
  async sortBy(sortOption: string) {
    await this.sortDropdown.click();
    await this.page.getByText(sortOption, { exact: true }).click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to map view
   */
  async switchToMapView() {
    await this.mapViewButton.click();
    await expect(this.mapView).toBeVisible();
  }

  /**
   * Switch to list view
   */
  async switchToListView() {
    await this.listViewButton.click();
    await expect(this.hotelsList).toBeVisible();
  }

  /**
   * Click on a hotel card by name
   */
  async clickHotel(hotelName: string) {
    await this.hotelCards.filter({ hasText: hotelName }).first().click();
    
    // Wait for navigation to complete
    await this.page.waitForURL('**/hotels/**');
  }

  /**
   * Load more hotels (if pagination is implemented with a "Load More" button)
   */
  async loadMoreHotels() {
    if (await this.loadMoreButton.isVisible()) {
      const initialCount = await this.getHotelCount();
      await this.loadMoreButton.click();
      
      // Wait for more hotels to load
      const selector = '[data-testid="hotel-card"]';
      await this.page.waitForFunction(
        (params) => {
          const { selector, count } = params;
          return document.querySelectorAll(selector).length > count;
        },
        { selector, count: initialCount }
      );
    }
  }

  /**
   * Reset all filters
   */
  async resetFilters() {
    // On mobile, first open the filter modal
    await this.openFilterModal();
    
    const resetButton = this.filterSection.locator('button', { hasText: /reset|clear/i });
    
    if (await resetButton.isVisible()) {
      await resetButton.click();
      
      // Wait for results to update
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Verify filter results match expected criteria
   */
  async verifyFilterResults(expectedCategory?: string) {
    // Check that all visible hotel cards match the filter criteria
    if (expectedCategory) {
      const visibleHotelCards = await this.hotelCards.all();
      for (const card of visibleHotelCards) {
        const categoryText = await card.locator('.category, [data-testid="hotel-category"]').textContent();
        expect(categoryText?.toLowerCase()).toContain(expectedCategory.toLowerCase());
      }
    }
  }
}