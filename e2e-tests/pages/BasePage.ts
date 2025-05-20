import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page object model that all page objects should extend
 */
export class BasePage {
  readonly page: Page;
  readonly url: string;
  
  // Common elements across all pages
  readonly header: Locator;
  readonly footer: Locator;
  readonly navMenu: Locator;
  readonly languageSwitcher: Locator;
  readonly logo: Locator;

  constructor(page: Page, url: string = '/') {
    this.page = page;
    this.url = url;
    
    // Initialize common elements
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.navMenu = page.locator('nav');
    this.languageSwitcher = page.locator('[data-testid="language-switcher"]');
    this.logo = page.locator('[data-testid="logo"], .logo');
  }

  /**
   * Navigate to the page
   */
  async goto() {
    await this.page.goto(this.url);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    // Wait for the main content to be visible
    await this.page.waitForSelector('main', { state: 'visible' });
    // Wait for network to be idle (no requests for 500ms)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if page is currently loaded
   */
  async isCurrentPage() {
    return this.page.url().includes(this.url);
  }

  /**
   * Verify common page elements are visible
   */
  async verifyCommonElements() {
    await expect(this.header).toBeVisible();
    await expect(this.footer).toBeVisible();
    await expect(this.logo).toBeVisible();
  }

  /**
   * Navigate to a different page via menu
   */
  async navigateTo(menuItem: string) {
    await this.navMenu.getByText(menuItem, { exact: false }).click();
  }

  /**
   * Change the language
   */
  async changeLanguage(language: string) {
    await this.languageSwitcher.click();
    await this.page.getByText(language, { exact: true }).click();
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }
}