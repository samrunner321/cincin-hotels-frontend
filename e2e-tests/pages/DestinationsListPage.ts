import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object model for the Destinations List Page
 */
export class DestinationsListPage extends BasePage {
  // Destinations list page specific elements
  readonly pageTitle: Locator;
  readonly destinationsList: Locator;
  readonly destinationCards: Locator;
  readonly filterSection: Locator;
  readonly regionFilters: Locator;
  readonly seasonFilters: Locator;
  readonly typeFilters: Locator;
  readonly searchInput: Locator;
  readonly noResultsMessage: Locator;
  readonly mapView: Locator;
  readonly viewSwitcher: Locator;
  readonly gridViewButton: Locator;
  readonly mapViewButton: Locator;

  constructor(page: Page) {
    super(page, '/destinations');
    
    // Initialize destinations list page specific elements
    this.pageTitle = page.locator('h1');
    this.destinationsList = page.locator('[data-testid="destinations-list"]');
    this.destinationCards = page.locator('[data-testid="destination-card"]');
    this.filterSection = page.locator('[data-testid="filter-section"]');
    this.regionFilters = page.locator('[data-testid="region-filters"] button');
    this.seasonFilters = page.locator('[data-testid="season-filters"] button');
    this.typeFilters = page.locator('[data-testid="type-filters"] button');
    this.searchInput = page.locator('[data-testid="destination-search"]');
    this.noResultsMessage = page.locator('[data-testid="no-results"]');
    this.mapView = page.locator('[data-testid="map-view"]');
    this.viewSwitcher = page.locator('[data-testid="view-switcher"]');
    this.gridViewButton = page.locator('[data-testid="grid-view-button"]');
    this.mapViewButton = page.locator('[data-testid="map-view-button"]');
  }

  /**
   * Verify destinations list page content
   */
  async verifyDestinationsListPageContent() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.destinationsList).toBeVisible();
    await expect(this.filterSection).toBeVisible();
  }

  /**
   * Get the number of destination cards displayed
   */
  async getDestinationCount(): Promise<number> {
    return await this.destinationCards.count();
  }

  /**
   * Filter destinations by region
   */
  async filterByRegion(region: string) {
    await this.regionFilters.getByText(region, { exact: false }).click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter destinations by season
   */
  async filterBySeason(season: string) {
    await this.seasonFilters.getByText(season, { exact: false }).click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter destinations by type
   */
  async filterByType(type: string) {
    await this.typeFilters.getByText(type, { exact: false }).click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for destinations
   */
  async searchDestinations(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to map view
   */
  async switchToMapView() {
    if (await this.viewSwitcher.isVisible()) {
      await this.mapViewButton.click();
      await expect(this.mapView).toBeVisible();
    }
  }

  /**
   * Switch to grid view
   */
  async switchToGridView() {
    if (await this.viewSwitcher.isVisible()) {
      await this.gridViewButton.click();
      await expect(this.destinationsList).toBeVisible();
    }
  }

  /**
   * Click on a destination card by name
   */
  async clickDestination(destinationName: string) {
    await this.destinationCards.filter({ hasText: destinationName }).first().click();
    
    // Wait for navigation to complete
    await this.page.waitForURL('**/destinations/**');
  }

  /**
   * Reset all filters
   */
  async resetFilters() {
    const resetButton = this.filterSection.locator('button', { hasText: /reset|clear/i });
    
    if (await resetButton.isVisible()) {
      await resetButton.click();
      
      // Wait for results to update
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Verify filter results
   */
  async verifyFilterResults(expectedCount?: number) {
    if (expectedCount !== undefined) {
      const actualCount = await this.getDestinationCount();
      expect(actualCount).toBe(expectedCount);
    } else {
      // Just verify some results are shown
      expect(await this.getDestinationCount()).toBeGreaterThan(0);
    }
  }
}