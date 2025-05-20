import { test, expect } from './utils/test-fixtures';

test.describe('Hotel Detail Page', () => {
  // Store hotel slug for reuse
  let hotelSlug = '';
  
  test.beforeEach(async ({ page }) => {
    // If we don't have a hotel slug yet, get one from the hotels page
    if (!hotelSlug) {
      await page.goto('/hotels');
      
      // Wait for the hotels to load
      await page.waitForSelector('[data-testid="hotel-card"]');
      
      // Get the URL of the first hotel card
      const firstCardHref = await page.locator('[data-testid="hotel-card"] a').first().getAttribute('href');
      
      if (firstCardHref) {
        hotelSlug = firstCardHref.split('/').pop() || 'hotel-schgaguler';
      } else {
        // Fallback to a known hotel slug
        hotelSlug = 'hotel-schgaguler';
      }
    }
    
    // Navigate to the hotel detail page
    await page.goto(`/hotels/${hotelSlug}`);
    
    // Wait for the detail page to load
    await page.waitForSelector('h1');
  });

  test('should display hotel details correctly', async ({ page }) => {
    // Check basic hotel information is displayed
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('img')).toBeVisible();
    
    // Check for hotel description
    await expect(page.locator('p').filter({ hasText: /./i })).toBeVisible();
    
    // Check for hotel features/amenities
    const featuresSection = page.locator('section').filter({ hasText: /amenities|features/i });
    await expect(featuresSection).toBeVisible();
    
    // Check for location information
    const locationSection = page.locator('section').filter({ hasText: /location|address/i });
    if (await locationSection.count() > 0) {
      await expect(locationSection).toBeVisible();
    }
  });

  test('should show room information', async ({ page }) => {
    // Find and click on rooms section/tab if it's not the default view
    const roomsTab = page.locator('button, a').filter({ hasText: /rooms|accommodations/i });
    
    if (await roomsTab.isVisible()) {
      await roomsTab.click();
    }
    
    // Check for room information
    const roomsSection = page.locator('section').filter({ hasText: /room|suite|accommodation/i });
    
    // Some hotels might not have rooms data yet
    if (await roomsSection.count() > 0) {
      await expect(roomsSection).toBeVisible();
      
      // Check for room cards/items
      const roomItems = page.locator('[data-testid="room-card"]');
      
      if (await roomItems.count() > 0) {
        // Check room elements
        const firstRoom = roomItems.first();
        await expect(firstRoom.locator('h3')).toBeVisible();
        await expect(firstRoom.locator('img')).toBeVisible();
      } else {
        // If no room cards, there should be some explanation text
        await expect(page.locator('p').filter({ hasText: /no rooms|contact|inquire/i })).toBeVisible();
      }
    }
  });

  test('should display gallery images', async ({ page }) => {
    // Look for gallery section or button
    const gallerySection = page.locator('section').filter({ hasText: /gallery|images|photos/i });
    const galleryButton = page.locator('button, a').filter({ hasText: /gallery|images|photos/i });
    
    // If gallery button exists, click it
    if (await galleryButton.isVisible()) {
      await galleryButton.click();
    }
    
    // Check for gallery images
    const galleryImages = page.locator('[data-testid="gallery-image"], .gallery img');
    
    if (await galleryImages.count() > 0) {
      await expect(galleryImages.first()).toBeVisible();
      
      // Click on the first image to open lightbox (if implemented)
      await galleryImages.first().click();
      
      // Check if lightbox/modal is shown
      const lightbox = page.locator('.lightbox, [role="dialog"] img');
      if (await lightbox.isVisible()) {
        await expect(lightbox).toBeVisible();
        
        // Close lightbox
        await page.press('body', 'Escape');
        await expect(lightbox).not.toBeVisible();
      }
    }
  });

  test('should have a functional booking/inquiry section', async ({ page }) => {
    // Look for booking or inquiry section/button
    const bookingSection = page.locator('section').filter({ hasText: /book|reserve|inquire/i });
    const bookingButton = page.locator('button, a').filter({ hasText: /book now|reserve|inquire/i });
    
    // Check if either the section or button exists
    if (await bookingSection.isVisible() || await bookingButton.isVisible()) {
      // If booking button exists, click it
      if (await bookingButton.isVisible()) {
        await bookingButton.click();
        
        // Check for booking form or modal
        const bookingForm = page.locator('form, [role="dialog"]');
        await expect(bookingForm).toBeVisible();
      } else {
        // Otherwise, check for booking information in the section
        await expect(bookingSection).toBeVisible();
      }
    }
  });
  
  test('should show related items (destination, similar hotels)', async ({ page }) => {
    // Scroll to the bottom of the page to load all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for related sections like "explore destination" or "similar hotels"
    const relatedSection = page.locator('section').filter({ 
      hasText: /similar hotels|explore more|discover|related/i 
    });
    
    if (await relatedSection.count() > 0) {
      await expect(relatedSection).toBeVisible();
      
      // Check for related item cards
      const relatedCards = relatedSection.locator('[data-testid="hotel-card"], [data-testid="destination-card"], .card');
      
      if (await relatedCards.count() > 0) {
        await expect(relatedCards.first()).toBeVisible();
      }
    }
  });
});

// Visual regression test
test('hotel detail visual regression', async ({ page, visualSnapshot }) => {
  // Navigate to a specific hotel for consistent testing
  await page.goto('/hotels/hotel-schgaguler');
  
  // Wait for content to load
  await page.waitForSelector('h1');
  
  // Take snapshot of the hero section
  const heroSection = page.locator('section').first();
  await visualSnapshot('hotel-detail-hero', {
    clip: await heroSection.boundingBox(),
    fullPage: false,
  });
  
  // Take snapshot of the full page
  await visualSnapshot('hotel-detail-full', {
    mask: [
      '.date-time',
      '.random-content',
      '[data-testid="dynamic-content"]',
      '.price' // Prices may change
    ],
  });
});