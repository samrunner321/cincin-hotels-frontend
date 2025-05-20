import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object model for the Destination Page
 */
export class DestinationPage extends BasePage {
  // Destination page specific elements
  readonly destinationName: Locator;
  readonly destinationDescription: Locator;
  readonly heroSection: Locator;
  readonly contentTabs: Locator;
  readonly overviewTab: Locator;
  readonly activitiesTab: Locator;
  readonly diningTab: Locator;
  readonly hotelsTab: Locator;
  readonly infoTab: Locator;
  readonly highlightsSection: Locator;
  readonly highlightItems: Locator;
  readonly activitiesSection: Locator;
  readonly activityCards: Locator;
  readonly seasonalContent: Locator;
  readonly seasonSelector: Locator;
  readonly hotelsSection: Locator;
  readonly hotelCards: Locator;
  readonly weatherSection: Locator;
  readonly infoSection: Locator;
  readonly mapSection: Locator;

  constructor(page: Page) {
    super(page, '/destinations/');
    
    // Initialize destination page specific elements
    this.destinationName = page.locator('h1');
    this.destinationDescription = page.locator('[data-testid="destination-description"]');
    this.heroSection = page.locator('[data-testid="destination-hero"]');
    this.contentTabs = page.locator('[data-testid="destination-tabs"]');
    this.overviewTab = page.locator('button', { hasText: /overview/i });
    this.activitiesTab = page.locator('button', { hasText: /activities/i });
    this.diningTab = page.locator('button', { hasText: /dining/i });
    this.hotelsTab = page.locator('button', { hasText: /hotels/i });
    this.infoTab = page.locator('button', { hasText: /info/i });
    this.highlightsSection = page.locator('[data-testid="highlights-section"]');
    this.highlightItems = page.locator('[data-testid="highlight-item"]');
    this.activitiesSection = page.locator('[data-testid="activities-section"]');
    this.activityCards = page.locator('[data-testid="activity-card"]');
    this.seasonalContent = page.locator('[data-testid="seasonal-content"]');
    this.seasonSelector = page.locator('[data-testid="season-selector"]');
    this.hotelsSection = page.locator('[data-testid="hotels-section"]');
    this.hotelCards = page.locator('[data-testid="hotel-card"]');
    this.weatherSection = page.locator('[data-testid="weather-section"]');
    this.infoSection = page.locator('[data-testid="info-section"]');
    this.mapSection = page.locator('[data-testid="map-section"]');
  }

  /**
   * Verify destination page content
   */
  async verifyDestinationPageContent() {
    await expect(this.destinationName).toBeVisible();
    await expect(this.destinationDescription).toBeVisible();
    await expect(this.heroSection).toBeVisible();
    await expect(this.contentTabs).toBeVisible();
    await expect(this.highlightsSection).toBeVisible();
  }

  /**
   * Navigate to a specific content tab
   */
  async navigateToTab(tabName: 'overview' | 'activities' | 'dining' | 'hotels' | 'info') {
    let tabLocator;
    switch (tabName) {
      case 'overview':
        tabLocator = this.overviewTab;
        break;
      case 'activities':
        tabLocator = this.activitiesTab;
        break;
      case 'dining':
        tabLocator = this.diningTab;
        break;
      case 'hotels':
        tabLocator = this.hotelsTab;
        break;
      case 'info':
        tabLocator = this.infoTab;
        break;
    }
    
    await tabLocator.click();
    
    // Wait for tab content to be visible
    await this.page.waitForSelector(`[data-testid="${tabName}-content"]`, { state: 'visible' });
  }

  /**
   * Navigate to hotels section
   */
  async navigateToHotels() {
    await this.navigateToTab('hotels');
    await expect(this.hotelsSection).toBeVisible();
  }

  /**
   * Navigate to activities section
   */
  async navigateToActivities() {
    await this.navigateToTab('activities');
    await expect(this.activitiesSection).toBeVisible();
  }

  /**
   * Get destination name
   */
  async getDestinationName(): Promise<string | null> {
    return await this.destinationName.textContent();
  }

  /**
   * Get the number of hotels in this destination
   */
  async getHotelCount(): Promise<number> {
    await this.navigateToHotels();
    return await this.hotelCards.count();
  }

  /**
   * Select a hotel from the destination page
   */
  async selectHotel(hotelName: string) {
    await this.navigateToHotels();
    await this.hotelCards.filter({ hasText: hotelName }).first().click();
    
    // Wait for navigation to hotel detail page
    await this.page.waitForURL('**/hotels/**');
  }

  /**
   * Change the season for seasonal content
   */
  async changeSeason(season: 'spring' | 'summer' | 'autumn' | 'winter') {
    if (await this.seasonSelector.isVisible()) {
      await this.seasonSelector.locator(`[data-season="${season}"]`).click();
      
      // Wait for seasonal content to update
      await this.page.waitForLoadState('networkidle');
      
      // Verify the seasonal content is displayed
      await expect(this.seasonalContent).toContainText(season, { ignoreCase: true });
    }
  }

  /**
   * Get the highlights of the destination
   */
  async getHighlights(): Promise<string[]> {
    const highlights = await this.highlightItems.allTextContents();
    return highlights;
  }

  /**
   * Get the activities of the destination
   */
  async getActivities(): Promise<string[]> {
    await this.navigateToActivities();
    const activities = await this.activityCards.allTextContents();
    return activities;
  }

  /**
   * Interact with the map (if interactive)
   */
  async interactWithMap() {
    // Navigation to the info tab if not already there
    await this.navigateToTab('info');
    
    if (await this.mapSection.isVisible()) {
      // Click on the map (center)
      await this.mapSection.click();
      
      // Additional map interactions could be added here depending on the map implementation
      // For example, zoom in, zoom out, drag, etc.
    }
  }
}