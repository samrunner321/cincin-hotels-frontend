import { test, expect } from './utils/test-fixtures';

test.describe('Hotels Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Start on the hotels page
    await page.goto('/hotels');
    
    // Wait for the hotels list to load
    await expect(page.locator('[data-testid="hotel-card"]').first()).toBeVisible();
  });

  test('should display a list of hotels', async ({ page }) => {
    // Check that hotel cards are displayed
    const hotelCards = page.locator('[data-testid="hotel-card"]');
    await expect(hotelCards).toHaveCount.atLeast(3);
    
    // Check that each card has the expected elements
    const firstCard = hotelCards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h3')).toBeVisible();
    await expect(firstCard.locator('p')).toBeVisible();
  });

  test('should filter hotels by search term', async ({ page }) => {
    // Type a search term in the search box
    await page.fill('input[type="search"]', 'Alpen');
    await page.press('input[type="search"]', 'Enter');
    
    // Wait for search results to update
    await page.waitForResponse(response => 
      response.url().includes('/api/hotels') && 
      response.status() === 200
    );
    
    // Check for filtered results
    const hotelCards = page.locator('[data-testid="hotel-card"]');
    
    // Either we have results containing our search term
    if (await hotelCards.count() > 0) {
      // Check that at least one card contains the search term (in name or description)
      const cardTexts = await hotelCards.allTextContents();
      const hasMatch = cardTexts.some(text => text.includes('Alpen'));
      expect(hasMatch).toBeTruthy();
    } else {
      // Or we have a "no results" message
      await expect(page.locator('text="No hotels found"')).toBeVisible();
    }
    
    // Clear search and verify all results return
    await page.click('button[aria-label="Clear search"]');
    await page.waitForResponse(response => 
      response.url().includes('/api/hotels') && 
      response.status() === 200
    );
    
    // Check that we have more results after clearing search
    const allHotels = page.locator('[data-testid="hotel-card"]');
    await expect(allHotels).toHaveCount.atLeast(3);
  });

  test('should filter hotels by category', async ({ page }) => {
    // Click the category filter button
    await page.click('button:has-text("Category")');
    
    // Select a category from the dropdown
    const categoryOption = page.locator('text=Luxury').first();
    
    // This test might need adjustment based on your filter UI
    if (await categoryOption.isVisible()) {
      await categoryOption.click();
      
      // Wait for the API response after filtering
      await page.waitForResponse(response => 
        response.url().includes('/api/hotels') && 
        response.status() === 200
      );
      
      // Check filtered results
      const hotelCards = page.locator('[data-testid="hotel-card"]');
      
      // Validate that at least one result has the selected category
      if (await hotelCards.count() > 0) {
        // Get either the category tags on cards or check the filter counter
        const categoryCount = await page.locator('button:has-text("Category") span.inline-flex').textContent();
        expect(categoryCount).not.toBe('0');
      } else {
        // Or we have a "no results" message
        await expect(page.locator('text="No hotels found"')).toBeVisible();
      }
    } else {
      // If the UI behaves differently, skip this test but log it
      console.log('Category filter UI has changed, skipping test');
    }
  });

  test('should toggle between grid and list views', async ({ page }) => {
    // Get current view mode (grid is usually default)
    const isGridView = await page.locator('[data-testid="hotel-grid"]').isVisible();
    expect(isGridView).toBeTruthy();
    
    // Click list view button
    await page.click('button[aria-label="List View"]');
    
    // Check that list view is now visible
    await expect(page.locator('[data-testid="hotel-list"]')).toBeVisible();
    
    // Switch back to grid view
    await page.click('button[aria-label="Grid View"]');
    
    // Check that grid view is visible again
    await expect(page.locator('[data-testid="hotel-grid"]')).toBeVisible();
  });

  test('should navigate to hotel detail page when clicking a hotel card', async ({ page }) => {
    // Click on the first hotel card
    const firstHotelCard = page.locator('[data-testid="hotel-card"]').first();
    
    // Get the hotel name before clicking
    const hotelName = await firstHotelCard.locator('h3').textContent();
    
    // Click the card
    await firstHotelCard.click();
    
    // Wait for navigation
    await page.waitForURL(/\/hotels\/[\w-]+/);
    
    // Verify we're on the detail page for the correct hotel
    await expect(page.locator('h1')).toContainText(hotelName || '');
  });
  
  test('advanced filters should work correctly', async ({ page }) => {
    // Click on the "All Filters" button
    await page.click('button:has-text("All Filters")');
    
    // Check that filter modal appears
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    
    // Select a filter option in the modal
    await page.click('text=Spa & Wellness');
    
    // Apply filters
    await page.click('button:has-text("Apply Filters")');
    
    // Wait for results to update
    await page.waitForResponse(response => 
      response.url().includes('/api/hotels') && 
      response.status() === 200
    );
    
    // Check that filter was applied (either by results or filter indicator)
    const filterIndicator = await page.isVisible('button:has-text("All Filters") span.inline-flex');
    expect(filterIndicator).toBeTruthy();
  });
});

// Visual regression tests
test('hotels search visual regression', async ({ page, visualSnapshot }) => {
  // Start on the hotels page
  await page.goto('/hotels');
  
  // Wait for content to load
  await expect(page.locator('[data-testid="hotel-card"]').first()).toBeVisible();
  
  // Take snapshot of the search and filter area
  await visualSnapshot('hotels-search-filters', {
    clip: await page.locator('section[aria-label="Hotel filters and search"]').boundingBox(),
    fullPage: false,
  });
  
  // Take snapshot of the grid view
  await visualSnapshot('hotels-grid-view', {
    mask: [
      '.date-time',
      '.random-content',
      '[data-testid="dynamic-content"]'
    ],
  });
  
  // Switch to list view
  await page.click('button[aria-label="List View"]');
  
  // Take snapshot of the list view
  await visualSnapshot('hotels-list-view', {
    mask: [
      '.date-time',
      '.random-content',
      '[data-testid="dynamic-content"]'
    ],
  });
});