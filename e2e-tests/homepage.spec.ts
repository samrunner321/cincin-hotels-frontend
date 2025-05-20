import { test, expect } from './utils/test-fixtures';

test.describe('Homepage', () => {
  test('should load correctly and display key elements', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for key elements to ensure page is loaded
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for crucial homepage elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="/hotels"]')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('section').filter({ hasText: /discover/i })).toBeVisible();
    
    // Performance measurement
    const performanceTiming = await page.evaluate(() => {
      return {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: performance.timing.loadEventEnd,
        domContentLoaded: performance.timing.domContentLoadedEventEnd,
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoadedTime: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      };
    });
    
    console.log('Page load performance:', performanceTiming);
    
    // Assert on reasonable load time (adjust based on your performance requirements)
    expect(performanceTiming.loadTime).toBeLessThan(5000);
  });
  
  test('should navigate to hotels page when clicking on the hotels link', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Click on hotels link
    await page.click('a[href="/hotels"]');
    
    // Check we've navigated to the hotels page
    await expect(page).toHaveURL(/\/hotels/);
    
    // Verify hotels page content is visible
    await expect(page.locator('h1').filter({ hasText: /hotels/i })).toBeVisible();
  });
  
  test('should show featured destinations', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Check for featured destinations section
    const destinationsSection = page.locator('section').filter({ hasText: /destinations/i });
    await expect(destinationsSection).toBeVisible();
    
    // Check for destination cards
    const destinationCards = destinationsSection.locator('[data-testid="destination-card"]');
    await expect(destinationCards).toHaveCount.atLeast(3);
    
    // Check each card has an image and name
    const firstCard = destinationCards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h3')).toBeVisible();
  });
  
  test('should be responsive on mobile view', async ({ mobileView }) => {
    // Navigate to homepage on mobile view
    await mobileView.goto('/');
    
    // Check that mobile menu burger icon is visible
    await expect(mobileView.locator('button[aria-label="Toggle menu"]')).toBeVisible();
    
    // Open mobile menu
    await mobileView.click('button[aria-label="Toggle menu"]');
    
    // Check that mobile menu is visible
    await expect(mobileView.locator('nav[aria-label="Mobile menu"]')).toBeVisible();
    
    // Check that responsive elements are stacked (not in columns)
    const heroSection = mobileView.locator('section').first();
    
    // Get bounding boxes and check layout
    const heroBox = await heroSection.boundingBox();
    if (heroBox) {
      // On mobile, width should be near device width and height should be taller relative to width
      // compared to desktop view
      expect(heroBox.width).toBeLessThan(500);
      expect(heroBox.height / heroBox.width).toBeGreaterThan(1.2);
    }
  });
});

// Visual regression test
test('homepage visual regression', async ({ page, visualSnapshot }) => {
  // Navigate to homepage
  await page.goto('/');
  
  // Take snapshot of the full page
  await visualSnapshot('homepage-full', {
    // Mask dynamic elements that might cause flaky tests
    mask: [
      '.date-time',
      '.random-content',
      '[data-testid="dynamic-content"]'
    ],
  });
  
  // Take snapshot of specific sections
  const heroSection = page.locator('section').first();
  const heroBox = await heroSection.boundingBox();
  
  if (heroBox) {
    await visualSnapshot('homepage-hero', {
      fullPage: false,
      clip: heroBox,
    });
  }
});