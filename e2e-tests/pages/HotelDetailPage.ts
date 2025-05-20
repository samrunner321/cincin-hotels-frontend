import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object model for the Hotel Detail Page
 */
export class HotelDetailPage extends BasePage {
  // Hotel detail page specific elements
  readonly hotelName: Locator;
  readonly hotelDescription: Locator;
  readonly hotelLocation: Locator;
  readonly hotelCategory: Locator;
  readonly gallerySection: Locator;
  readonly galleryImages: Locator;
  readonly featuresSection: Locator;
  readonly featureItems: Locator;
  readonly contentTabs: Locator;
  readonly overviewTab: Locator;
  readonly roomsTab: Locator;
  readonly diningTab: Locator;
  readonly locationTab: Locator;
  readonly bookingSection: Locator;
  readonly roomsList: Locator;
  readonly roomCards: Locator;
  readonly relatedHotelsSection: Locator;

  constructor(page: Page) {
    super(page, '/hotels/');
    
    // Initialize hotel detail page specific elements
    this.hotelName = page.locator('h1');
    this.hotelDescription = page.locator('[data-testid="hotel-description"]');
    this.hotelLocation = page.locator('[data-testid="hotel-location"]');
    this.hotelCategory = page.locator('[data-testid="hotel-category"]');
    this.gallerySection = page.locator('[data-testid="gallery-section"]');
    this.galleryImages = page.locator('[data-testid="gallery-image"]');
    this.featuresSection = page.locator('[data-testid="features-section"]');
    this.featureItems = page.locator('[data-testid="feature-item"]');
    this.contentTabs = page.locator('[data-testid="content-tabs"]');
    this.overviewTab = page.locator('button', { hasText: /overview/i });
    this.roomsTab = page.locator('button', { hasText: /rooms/i });
    this.diningTab = page.locator('button', { hasText: /dining/i });
    this.locationTab = page.locator('button', { hasText: /location/i });
    this.bookingSection = page.locator('[data-testid="booking-section"]');
    this.roomsList = page.locator('[data-testid="rooms-list"]');
    this.roomCards = page.locator('[data-testid="room-card"]');
    this.relatedHotelsSection = page.locator('[data-testid="related-hotels"]');
  }

  /**
   * Verify hotel detail page content
   */
  async verifyHotelDetailPageContent() {
    await expect(this.hotelName).toBeVisible();
    await expect(this.hotelDescription).toBeVisible();
    await expect(this.hotelLocation).toBeVisible();
    await expect(this.gallerySection).toBeVisible();
    await expect(this.featuresSection).toBeVisible();
    await expect(this.contentTabs).toBeVisible();
  }

  /**
   * Navigate through gallery images
   */
  async browseGallery(numberOfClicks: number = 3) {
    const nextButton = this.gallerySection.locator('button.next, [data-testid="gallery-next"]');
    const initialSrc = await this.galleryImages.first().getAttribute('src');
    
    // Click the next button several times
    for (let i = 0; i < numberOfClicks; i++) {
      await nextButton.click();
      // Wait a moment for the transition
      await this.page.waitForTimeout(500);
    }
    
    // Verify the image has changed
    const currentSrc = await this.galleryImages.first().getAttribute('src');
    expect(currentSrc).not.toEqual(initialSrc);
  }

  /**
   * Navigate to a specific content tab
   */
  async navigateToTab(tabName: 'overview' | 'rooms' | 'dining' | 'location') {
    let tabLocator;
    switch (tabName) {
      case 'overview':
        tabLocator = this.overviewTab;
        break;
      case 'rooms':
        tabLocator = this.roomsTab;
        break;
      case 'dining':
        tabLocator = this.diningTab;
        break;
      case 'location':
        tabLocator = this.locationTab;
        break;
    }
    
    await tabLocator.click();
    
    // Wait for tab content to be visible
    await this.page.waitForSelector(`[data-testid="${tabName}-content"]`, { state: 'visible' });
  }

  /**
   * Navigate to rooms list
   */
  async navigateToRooms() {
    await this.navigateToTab('rooms');
    await expect(this.roomsList).toBeVisible();
  }

  /**
   * Get the number of available room types
   */
  async getRoomCount(): Promise<number> {
    await this.navigateToRooms();
    return await this.roomCards.count();
  }

  /**
   * Select a room by name
   */
  async selectRoom(roomName: string) {
    await this.navigateToRooms();
    await this.roomCards.filter({ hasText: roomName }).first().click();
    
    // Verify the room detail modal or page is displayed
    await this.page.waitForSelector(`[data-testid="room-detail"]`, { state: 'visible' });
  }

  /**
   * Get hotel name
   */
  async getHotelName(): Promise<string | null> {
    return await this.hotelName.textContent();
  }

  /**
   * Get hotel category
   */
  async getHotelCategory(): Promise<string | null> {
    return await this.hotelCategory.textContent();
  }

  /**
   * Get hotel features
   */
  async getFeatures(): Promise<string[]> {
    const features = await this.featureItems.allTextContents();
    return features;
  }
}