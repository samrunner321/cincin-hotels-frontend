import { test, expect } from './a11y-test-fixtures';
import { a11yConfig } from './config';

test.describe('Hotels Page Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hotels');
    // Ensure the page is fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('hotels page should not have any accessibility violations', async ({ page, checkA11y }) => {
    // Test the entire page for accessibility
    await checkA11y({
      detailedReport: true,
      includeImpact: ['critical', 'serious'],
      exclude: a11yConfig.excludeRules,
    });
  });

  test('hotel cards should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the hotel card component
    const hotelCards = page.locator('[data-testid="hotel-card"]');
    
    if (await hotelCards.count() > 0) {
      await checkComponentA11y('[data-testid="hotel-card"]:first-child', 'Hotel Card');
      
      // Check that cards are properly labeled
      await expect(hotelCards.first().locator('h3, h2')).toHaveCount(1);
      
      // Check that images have alt text
      await expect(hotelCards.first().locator('img')).toHaveAttribute('alt');
      
      // Check that each card is keyboard focusable
      await expect(hotelCards.first().locator('a')).toBeVisible();
    }
  });

  test('filters should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the filters component
    const filters = page.locator('[data-testid="filter-panel"], [data-testid="filters"]');
    
    if (await filters.count() > 0) {
      await checkComponentA11y('[data-testid="filter-panel"], [data-testid="filters"]', 'Filters Panel');
      
      // Check for proper labels on form controls
      const formControls = page.locator('[data-testid="filter-panel"] input, [data-testid="filters"] input');
      const controlCount = await formControls.count();
      
      for (let i = 0; i < controlCount; i++) {
        const input = formControls.nth(i);
        const inputId = await input.getAttribute('id');
        
        if (inputId) {
          const associatedLabel = page.locator(`label[for="${inputId}"]`);
          await expect(associatedLabel).toHaveCount(1, `Input #${inputId} should have a label`);
        } else {
          // Check if input is wrapped by label
          const parentIsLabel = await page.evaluate(el => {
            return el.closest('label') !== null;
          }, input);
          
          expect(parentIsLabel).toBe(true, 'Input should have an associated label');
        }
      }
    }
  });

  test('search form should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the search form component
    const searchForm = page.locator('[data-testid="search-form"], form');
    
    if (await searchForm.count() > 0) {
      await checkComponentA11y('[data-testid="search-form"], form', 'Search Form');
      
      // Check for search button accessibility
      const searchButton = page.locator('[data-testid="search-form"] button, form button[type="submit"]');
      await expect(searchButton).toHaveAttribute('aria-label');
      
      // Ensure form fields have labels and proper ARIA attributes
      const formFields = page.locator('[data-testid="search-form"] input, form input');
      for (let i = 0; i < await formFields.count(); i++) {
        const field = formFields.nth(i);
        const hasAriaLabel = await field.getAttribute('aria-label');
        const hasLabel = await field.getAttribute('id') !== null;
        
        expect(hasAriaLabel || hasLabel).toBe(true, 'Form field must have either an aria-label or an associated label');
      }
    }
  });

  test('pagination should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the pagination component if it exists
    const pagination = page.locator('[data-testid="pagination"], nav[aria-label*="pagination" i]');
    
    if (await pagination.count() > 0) {
      await checkComponentA11y('[data-testid="pagination"], nav[aria-label*="pagination" i]', 'Pagination');
      
      // Check for ARIA current on current page
      const currentPage = page.locator('[data-testid="pagination"] [aria-current="page"], nav[aria-label*="pagination" i] [aria-current="page"]');
      await expect(currentPage).toHaveCount(1);
      
      // Check for proper button labels
      const nextButton = page.locator('[data-testid="pagination"] [aria-label*="next" i], nav[aria-label*="pagination" i] [aria-label*="next" i]');
      if (await nextButton.count() > 0) {
        await expect(nextButton).toHaveAttribute('aria-label');
      }
      
      const prevButton = page.locator('[data-testid="pagination"] [aria-label*="previous" i], nav[aria-label*="pagination" i] [aria-label*="previous" i]');
      if (await prevButton.count() > 0) {
        await expect(prevButton).toHaveAttribute('aria-label');
      }
    }
  });

  test('view toggle should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the view toggle component (list/grid view)
    const viewToggle = page.locator('[data-testid="view-switcher"]');
    
    if (await viewToggle.count() > 0) {
      await checkComponentA11y('[data-testid="view-switcher"]', 'View Switcher');
      
      // Check that buttons are properly labeled
      const toggleButtons = viewToggle.locator('button');
      for (let i = 0; i < await toggleButtons.count(); i++) {
        await expect(toggleButtons.nth(i)).toHaveAttribute('aria-label');
      }
      
      // Check for ARIA pressed state
      await expect(toggleButtons.first()).toHaveAttribute('aria-pressed');
    }
  });

  test('modal dialogs should be accessible', async ({ page, checkComponentA11y }) => {
    // Test for modal accessibility if they exist
    // First, find a button that opens a modal
    const modalTrigger = page.locator('button[aria-haspopup="dialog"], button[data-testid="open-modal"]');
    
    if (await modalTrigger.count() > 0) {
      // Click to open modal
      await modalTrigger.first().click();
      
      // Wait for modal to appear
      const modal = page.locator('[role="dialog"], [aria-modal="true"]');
      await expect(modal).toBeVisible();
      
      // Test modal for accessibility
      await checkComponentA11y('[role="dialog"], [aria-modal="true"]', 'Modal Dialog');
      
      // Check that modal has proper attributes
      await expect(modal).toHaveAttribute('aria-modal', 'true');
      await expect(modal).toHaveAttribute('aria-labelledby');
      
      // The element referenced by aria-labelledby should exist
      const labelId = await modal.getAttribute('aria-labelledby');
      if (labelId) {
        await expect(page.locator(`#${labelId}`)).toHaveCount(1);
      }
      
      // Escape key should close the modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('keyboard navigation should work for filtering hotels', async ({ page }) => {
    // Test keyboard navigation for hotel filtering
    
    // Navigate to the filter component
    await page.keyboard.press('Tab');
    
    // Find a filter checkbox
    const filterCheckbox = page.locator('input[type="checkbox"]').first();
    
    if (await filterCheckbox.count() > 0) {
      // Tab to filter checkbox
      let found = false;
      for (let i = 0; i < 20 && !found; i++) {
        const activeElement = await page.evaluate(() => {
          return document.activeElement?.tagName;
        });
        
        // Check if we've reached an input element
        if (activeElement === 'INPUT') {
          found = true;
          break;
        }
        
        await page.keyboard.press('Tab');
      }
      
      // Toggle checkbox with space key
      await page.keyboard.press('Space');
      
      // Verify checkbox was toggled
      await expect(filterCheckbox).toBeChecked();
    }
  });
});