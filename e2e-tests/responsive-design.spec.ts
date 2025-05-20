import { test, expect } from './utils/test-fixtures';
import { devices } from '@playwright/test';

// Array of viewport sizes to test
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

// Pages to test for responsive design
const pagesToTest = [
  { name: 'Homepage', path: '/' },
  { name: 'Hotels List', path: '/hotels' },
  { name: 'Hotel Detail', path: '/hotels/hotel-schgaguler' },
  { name: 'Destinations', path: '/destinations' },
];

test.describe('Responsive Design', () => {
  // Test each page at each viewport size
  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });
      
      for (const page of pagesToTest) {
        test(`${page.name} should display correctly`, async ({ page: pageContext, visualSnapshot }) => {
          // Navigate to the page
          await pageContext.goto(page.path);
          
          // Wait for page to load
          await pageContext.waitForLoadState('domcontentloaded');
          await pageContext.waitForLoadState('networkidle');
          
          // Take a screenshot for visual comparison
          await visualSnapshot(`${page.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name.toLowerCase().replace(/\s+/g, '-')}`);
          
          // Check for critical elements
          await expect(pageContext.locator('header, nav')).toBeVisible();
          await expect(pageContext.locator('footer')).toBeVisible();
          await expect(pageContext.locator('h1, h2')).toBeVisible();
          
          // Check for mobile-specific elements on small screens
          if (viewport.width < 768) {
            // Mobile menu button should be visible
            await expect(pageContext.locator('button[aria-label="Toggle menu"]')).toBeVisible();
            
            // Desktop menu should be hidden
            await expect(pageContext.locator('nav.desktop-menu')).not.toBeVisible();
          } else {
            // Desktop menu should be visible on larger screens
            await expect(pageContext.locator('nav ul, nav a[href="/hotels"]')).toBeVisible();
          }
          
          // Check for specific layout adjustments
          if (page.path === '/hotels') {
            // On mobile, filters should stack or have a different layout
            const filtersSection = pageContext.locator('section[aria-label="Hotel filters and search"]');
            const filtersBox = await filtersSection.boundingBox();
            
            if (filtersBox) {
              if (viewport.width < 768) {
                // On mobile, height should be taller relative to content
                expect(filtersBox.height).toBeGreaterThan(100);
              } else {
                // On desktop, filters should be in a row
                expect(filtersBox.height).toBeLessThan(150);
              }
            }
          }
        });
      }
      
      // Test mobile menu specifically on small screens
      if (viewport.width < 768) {
        test('mobile menu should open and contain all navigation links', async ({ page }) => {
          await page.goto('/');
          
          // Mobile menu button should be visible
          const menuButton = page.locator('button[aria-label="Toggle menu"]');
          await expect(menuButton).toBeVisible();
          
          // Click to open mobile menu
          await menuButton.click();
          
          // Mobile menu should now be visible
          await expect(page.locator('nav[aria-label="Mobile menu"], .mobile-menu')).toBeVisible();
          
          // Check for important navigation links
          const importantLinks = ['/hotels', '/destinations', '/about'];
          for (const link of importantLinks) {
            await expect(page.locator(`nav a[href="${link}"]`)).toBeVisible();
          }
          
          // Close menu
          // This could be by clicking the close button, clicking outside, or pressing escape
          try {
            // Try close button first
            const closeButton = page.locator('button[aria-label="Close menu"]');
            if (await closeButton.isVisible()) {
              await closeButton.click();
            } else {
              // Try Escape key
              await page.keyboard.press('Escape');
            }
          } catch (e) {
            // If both fail, click outside
            await page.click('body', { position: { x: 10, y: 10 } });
          }
          
          // Menu should be closed
          await expect(page.locator('nav[aria-label="Mobile menu"], .mobile-menu')).not.toBeVisible();
        });
      }
    });
  }
  
  // Device-specific tests using Playwright's device presets
  test.describe('Device Emulation', () => {
    // iPhone test
    test('iPhone 12', async ({ browser, visualSnapshot }) => {
      const iPhone = devices['iPhone 12'];
      const context = await browser.newContext({
        ...iPhone,
      });
      const page = await context.newPage();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for iPhone-specific layout and behaviors
      await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible();
      
      // Take a screenshot
      await visualSnapshot('iphone-12-homepage');
      
      // Test hotels page
      await page.goto('/hotels');
      await page.waitForLoadState('networkidle');
      
      // Verify mobile layout of hotels page
      await expect(page.locator('section[aria-label="Hotel filters and search"]')).toBeVisible();
      
      // Take a screenshot
      await visualSnapshot('iphone-12-hotels');
      
      await context.close();
    });
    
    // iPad test
    test('iPad Pro', async ({ browser, visualSnapshot }) => {
      const iPad = devices['iPad Pro 11'];
      const context = await browser.newContext({
        ...iPad,
      });
      const page = await context.newPage();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for iPad-specific layout and behaviors
      // iPad might show desktop or mobile UI depending on implementation
      
      // Take a screenshot
      await visualSnapshot('ipad-pro-homepage');
      
      // Test hotels page
      await page.goto('/hotels');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot
      await visualSnapshot('ipad-pro-hotels');
      
      await context.close();
    });
  });
});