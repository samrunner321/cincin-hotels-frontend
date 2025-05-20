import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object model for the Home Page
 */
export class HomePage extends BasePage {
  // Home page specific elements
  readonly heroSection: Locator;
  readonly searchForm: Locator;
  readonly destinationInput: Locator;
  readonly datesInput: Locator;
  readonly searchButton: Locator;
  readonly popularDestinationsSection: Locator;
  readonly featuredHotelSection: Locator;
  readonly destinationCategoriesSection: Locator;
  readonly journalSection: Locator;
  readonly newsletterSection: Locator;

  constructor(page: Page) {
    super(page, '/');
    
    // Initialize home page specific elements
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.searchForm = page.locator('[data-testid="search-form"]');
    this.destinationInput = page.locator('[data-testid="destination-input"]');
    this.datesInput = page.locator('[data-testid="dates-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    this.popularDestinationsSection = page.locator('[data-testid="popular-destinations"]');
    this.featuredHotelSection = page.locator('[data-testid="featured-hotel"]');
    this.destinationCategoriesSection = page.locator('[data-testid="destination-categories"]');
    this.journalSection = page.locator('[data-testid="journal-section"]');
    this.newsletterSection = page.locator('[data-testid="newsletter-signup"]');
  }

  /**
   * Verify all home page sections are visible
   */
  async verifyHomePageContent() {
    await expect(this.heroSection).toBeVisible();
    await expect(this.searchForm).toBeVisible();
    await expect(this.popularDestinationsSection).toBeVisible();
    await expect(this.featuredHotelSection).toBeVisible();
    await expect(this.destinationCategoriesSection).toBeVisible();
    await expect(this.journalSection).toBeVisible();
    await expect(this.newsletterSection).toBeVisible();
  }

  /**
   * Search for hotels with specified criteria
   */
  async searchHotels(destination: string, dates?: string) {
    await this.destinationInput.fill(destination);
    
    if (dates) {
      await this.datesInput.click();
      // Implementation for date selection will depend on the date picker component
      // This is a simplified version
      await this.page.locator(`text=${dates}`).click();
    }
    
    await this.searchButton.click();
    // Wait for navigation to complete
    await this.page.waitForURL('**/hotels**');
  }

  /**
   * Navigate to a destination category
   */
  async clickDestinationCategory(category: string) {
    await this.destinationCategoriesSection.getByText(category).click();
    // Wait for navigation to complete
    await this.page.waitForURL('**/categories/**');
  }

  /**
   * Click on a popular destination
   */
  async clickPopularDestination(destination: string) {
    await this.popularDestinationsSection.getByText(destination).click();
    // Wait for navigation to complete
    await this.page.waitForURL('**/destinations/**');
  }

  /**
   * Click on the featured hotel
   */
  async clickFeaturedHotel() {
    await this.featuredHotelSection.getByRole('link').click();
    // Wait for navigation to complete
    await this.page.waitForURL('**/hotels/**');
  }

  /**
   * Sign up for the newsletter
   */
  async signUpForNewsletter(email: string) {
    const emailInput = this.newsletterSection.locator('input[type="email"]');
    const submitButton = this.newsletterSection.locator('button[type="submit"]');
    
    await emailInput.fill(email);
    await submitButton.click();
    
    // Verify success message
    const successMessage = this.newsletterSection.locator('.success-message');
    await expect(successMessage).toBeVisible();
  }
}