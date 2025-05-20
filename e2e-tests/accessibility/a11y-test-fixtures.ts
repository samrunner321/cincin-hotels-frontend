import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations, reportViolations } from './axe-utils';

/**
 * Accessibility test fixtures for CinCin Hotels
 */
type A11yFixtures = {
  // Page with axe-core injected for accessibility testing
  a11yPage: Page;

  // Helper to check accessibility
  checkA11y: (options?: {
    selector?: string;
    detailedReport?: boolean;
    includeImpact?: ('critical' | 'serious' | 'moderate' | 'minor')[];
    exclude?: string[];
  }) => Promise<void>;

  // Component-specific accessibility testing helper
  checkComponentA11y: (componentSelector: string, name: string) => Promise<void>;

  // Get raw a11y violations for custom handling
  getA11yViolations: (options?: {
    selector?: string;
    includeImpact?: ('critical' | 'serious' | 'moderate' | 'minor')[];
  }) => Promise<any[]>;
};

/**
 * Extended test with accessibility fixtures
 */
export const test = base.extend<A11yFixtures>({
  // Inject axe-core into the page
  a11yPage: async ({ page }, use) => {
    await page.goto('/');
    await injectAxe(page);
    await use(page);
  },

  // Accessibility check helper
  checkA11y: async ({ page }, use) => {
    const checkAccessibility = async (options: {
      selector?: string;
      detailedReport?: boolean;
      includeImpact?: ('critical' | 'serious' | 'moderate' | 'minor')[];
      exclude?: string[];
    } = {}) => {
      const {
        selector = 'document',
        detailedReport = false,
        includeImpact = ['critical', 'serious'],
        exclude = [],
      } = options;

      await checkA11y(page, selector, {
        detailedReport,
        includeImpact,
        exclude,
      });
    };

    await use(checkAccessibility);
  },

  // Component-specific a11y test helper
  checkComponentA11y: async ({ page }, use) => {
    const checkComponent = async (selector: string, name: string) => {
      console.log(`\nTesting accessibility for component: ${name}`);
      await page.waitForSelector(selector);
      const violations = await getViolations(page, selector);
      
      if (violations.length > 0) {
        reportViolations(violations, name);
      }
      
      // Fix type error by separating the assertion and the message
      const violationsMessage = `${violations.length} accessibility violations found in ${name}`;
      expect(violations.length, violationsMessage).toBe(0);
    };

    await use(checkComponent);
  },

  // Get raw violations for custom handling
  getA11yViolations: async ({ page }, use) => {
    const getAccessibilityViolations = async (options: {
      selector?: string;
      includeImpact?: ('critical' | 'serious' | 'moderate' | 'minor')[];
    } = {}) => {
      const {
        selector = 'document',
        includeImpact = ['critical', 'serious', 'moderate', 'minor']
      } = options;

      return getViolations(page, selector, { includeImpact });
    };

    await use(getAccessibilityViolations);
  },
});

// Export expect for convenience
export { expect } from '@playwright/test';