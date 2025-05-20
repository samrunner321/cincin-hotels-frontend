import { test, expect } from './utils/test-fixtures';
import { setRtlLanguage, setLtrLanguage, isRtlMode } from './utils/rtl-test-utils';

/**
 * Visual regression tests for RTL layout
 * 
 * These tests verify that our components render correctly in RTL mode.
 */
test.describe('RTL Support - Visual Regression', () => {
  test('homepage renders correctly in RTL mode', async ({ page, visualSnapshot }) => {
    await page.goto('/');
    
    // Take snapshot in LTR mode first
    await setLtrLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('homepage-ltr');
    
    // Switch to RTL mode and take snapshot
    await setRtlLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('homepage-rtl');
  });
  
  test('hotel listing page renders correctly in RTL mode', async ({ page, visualSnapshot }) => {
    await page.goto('/hotels');
    
    // Take snapshot in LTR mode first
    await setLtrLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('hotels-listing-ltr');
    
    // Switch to RTL mode and take snapshot
    await setRtlLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('hotels-listing-rtl');
  });
  
  test('hotel detail page renders correctly in RTL mode', async ({ page, visualSnapshot }) => {
    // Navigate to the first hotel
    await page.goto('/hotels');
    await setLtrLanguage(page);
    await page.waitForLoadState('networkidle');
    
    // Click on the first hotel
    await page.locator('.hotel-card a, [data-testid="hotel-card"] a').first().click();
    await page.waitForLoadState('networkidle');
    
    // Take snapshot in LTR mode
    await visualSnapshot('hotel-detail-ltr');
    
    // Switch to RTL mode and take snapshot
    await setRtlLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('hotel-detail-rtl');
  });
  
  test('form inputs render correctly in RTL mode', async ({ page, visualSnapshot }) => {
    // Navigate to a page with forms
    await page.goto('/contact');
    
    // Take snapshot in LTR mode first
    await setLtrLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('contact-form-ltr');
    
    // Switch to RTL mode and take snapshot
    await setRtlLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('contact-form-rtl');
    
    // Fill out a form field to test input alignment
    if (await page.locator('input[name="email"]').isVisible()) {
      await page.fill('input[name="email"]', 'test@example.com');
      await visualSnapshot('contact-form-filled-rtl');
    }
  });
  
  test('navigation components render correctly in RTL mode', async ({ page, visualSnapshot }) => {
    await page.goto('/');
    
    // Take snapshot of navigation in LTR mode
    await setLtrLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('navigation-ltr', {
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 200 }
    });
    
    // Switch to RTL mode and take snapshot
    await setRtlLanguage(page);
    await page.waitForLoadState('networkidle');
    await visualSnapshot('navigation-rtl', {
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 200 }
    });
    
    // Open mobile menu if available
    const mobileMenuButton = page.locator('button[aria-label="Menu"], button.hamburger');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500); // Wait for animation
      await visualSnapshot('mobile-menu-rtl');
    }
  });
  
  test('tables render correctly in RTL mode', async ({ page, visualSnapshot }) => {
    // Find a page with tables or data grids
    await page.goto('/hotels');
    
    // Take snapshot in LTR mode first
    await setLtrLanguage(page);
    await page.waitForLoadState('networkidle');
    
    // Check if there's a table view
    const tableToggle = page.locator('button:has-text("Table View"), [data-view="table"]');
    if (await tableToggle.isVisible()) {
      await tableToggle.click();
      await page.waitForLoadState('networkidle');
      await visualSnapshot('table-view-ltr');
      
      // Switch to RTL mode and take snapshot
      await setRtlLanguage(page);
      await page.waitForLoadState('networkidle');
      await visualSnapshot('table-view-rtl');
    }
  });
  
  test('tab components render correctly in RTL mode', async ({ page, visualSnapshot }) => {
    // Find a page with tab components
    await page.goto('/hotels');
    
    // Look for tabs on hotel detail page
    const hotelCard = page.locator('.hotel-card a, [data-testid="hotel-card"] a').first();
    if (await hotelCard.isVisible()) {
      await hotelCard.click();
      await page.waitForLoadState('networkidle');
      
      // Look for tabs
      const tabs = page.locator('role=tablist');
      if (await tabs.isVisible()) {
        // Take snapshot in LTR mode first
        await setLtrLanguage(page);
        await page.waitForLoadState('networkidle');
        await visualSnapshot('tabs-ltr');
        
        // Switch to RTL mode and take snapshot
        await setRtlLanguage(page);
        await page.waitForLoadState('networkidle');
        await visualSnapshot('tabs-rtl');
        
        // Click on different tab to test tab switching in RTL
        const secondTab = page.locator('role=tab').nth(1);
        if (await secondTab.isVisible()) {
          await secondTab.click();
          await page.waitForTimeout(500); // Wait for animation
          await visualSnapshot('tabs-switched-rtl');
        }
      }
    }
  });
});

/**
 * Functional tests for RTL layout
 * 
 * These tests verify that our components function correctly in RTL mode.
 */
test.describe('RTL Support - Functional', () => {
  test('should apply RTL mode correctly', async ({ page }) => {
    await page.goto('/');
    
    // Set RTL language
    await setRtlLanguage(page);
    
    // Check that RTL mode is active
    const isRtl = await isRtlMode(page);
    expect(isRtl).toBe(true);
    
    // Check that document direction is RTL
    const direction = await page.evaluate(() => document.documentElement.dir);
    expect(direction).toBe('rtl');
  });
  
  test('should align form inputs correctly in RTL mode', async ({ page }) => {
    // Navigate to a page with forms
    await page.goto('/contact');
    await setRtlLanguage(page);
    
    // Check text alignment of input fields
    const inputField = page.locator('input[type="text"]').first();
    if (await inputField.isVisible()) {
      const textAlign = await inputField.evaluate(el => window.getComputedStyle(el).textAlign);
      expect(textAlign).toBe('right');
    }
  });
  
  test('should flip icons in RTL mode', async ({ page }) => {
    await page.goto('/');
    await setRtlLanguage(page);
    
    // Find directional icons
    const arrows = page.locator('svg[data-direction="horizontal"]');
    
    if (await arrows.count() > 0) {
      // Check that arrows are flipped using transform style (common pattern)
      const transform = await arrows.first().evaluate(el => window.getComputedStyle(el).transform);
      
      // Some form of transformation should be applied (often a matrix with negative scaling or rotation)
      expect(transform).not.toBe('none');
    }
  });
});