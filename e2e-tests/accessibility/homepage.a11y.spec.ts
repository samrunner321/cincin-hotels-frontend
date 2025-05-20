import { test, expect } from './a11y-test-fixtures';
import { a11yConfig } from './config';

test.describe('Homepage Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure the page is fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('homepage should not have any accessibility violations', async ({ page, checkA11y }) => {
    // Test the entire page for accessibility
    await checkA11y({
      detailedReport: true,
      includeImpact: ['critical', 'serious'],
      exclude: a11yConfig.excludeRules,
    });
  });

  test('navigation should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the main navigation component
    await checkComponentA11y('nav', 'Main Navigation');
    
    // Test that navigation has proper ARIA attributes
    const nav = page.locator('nav').first();
    await expect(nav.locator('[role="menuitem"]')).toHaveCount.atLeast(4);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const firstFocusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocusedElement.toLowerCase()).toBe('a');
  });

  test('hero section should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the hero section component
    await checkComponentA11y('section:first-child', 'Hero Section');
    
    // Check for image alt text
    const heroImage = page.locator('section:first-child img');
    if (await heroImage.count() > 0) {
      await expect(heroImage.first()).toHaveAttribute('alt');
    }
    
    // Check for heading hierarchy
    await expect(page.locator('section:first-child h1')).toHaveCount(1);
  });

  test('footer should be accessible', async ({ page, checkComponentA11y }) => {
    // Test the footer component
    await checkComponentA11y('footer', 'Footer');
    
    // Check for proper link text (no "click here" etc.)
    const footerLinks = page.locator('footer a');
    const linkCount = await footerLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const linkText = await footerLinks.nth(i).textContent();
      expect(linkText?.trim().toLowerCase()).not.toEqual('click here');
      expect(linkText?.trim().toLowerCase()).not.toEqual('more');
      expect(linkText?.trim().length).toBeGreaterThan(1);
    }
  });

  test('destination cards should be accessible', async ({ page, checkComponentA11y }) => {
    // Find destination cards and test them
    const destinationCards = page.locator('[data-testid="destination-card"]');
    
    if (await destinationCards.count() > 0) {
      await checkComponentA11y('[data-testid="destination-card"]:first-child', 'Destination Card');
      
      // Check that cards are properly labeled
      await expect(destinationCards.first().locator('h3, h2')).toHaveCount(1);
      
      // Check that images have alt text
      await expect(destinationCards.first().locator('img')).toHaveAttribute('alt');
    }
  });

  test('color contrast should meet WCAG 2.1 AA standards', async ({ page, getA11yViolations }) => {
    // Specifically check for color contrast issues
    const contrastViolations = await getA11yViolations({
      includeImpact: ['critical', 'serious', 'moderate']
    });
    
    // Filter for contrast-related violations
    const colorContrastIssues = contrastViolations.filter(v => 
      v.id === 'color-contrast'
    );
    
    if (colorContrastIssues.length > 0) {
      console.log('Color contrast issues found:');
      colorContrastIssues.forEach(issue => {
        console.log(` - ${issue.help}: ${issue.nodes.length} instances`);
      });
    }
    
    expect(colorContrastIssues.length).toBe(0, 
      `${colorContrastIssues.length} color contrast issues found`);
  });

  test('page should be navigable by keyboard', async ({ page }) => {
    // Test keyboard navigation through the page
    await page.keyboard.press('Tab');
    
    // Track elements reached by tabbing
    const tabbedElements = [];
    
    // Tab through the page and collect elements
    for (let i = 0; i < 10; i++) {
      const activeElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          textContent: el?.textContent?.trim().substring(0, 20),
          hasVisibleOutline: window.getComputedStyle(el).outlineStyle !== 'none'
        };
      });
      
      tabbedElements.push(activeElement);
      await page.keyboard.press('Tab');
    }
    
    // Verify we can tab to interactive elements
    expect(tabbedElements.some(el => el.tagName === 'A')).toBe(true);
    expect(tabbedElements.some(el => el.tagName === 'BUTTON')).toBe(true);
    
    // Verify focus is visible on all elements
    const allHaveVisibleFocus = tabbedElements.every(el => el.hasVisibleOutline);
    expect(allHaveVisibleFocus).toBe(true, 'Not all elements have visible focus indicators');
  });
});

// Visual accessibility test
test('homepage should maintain accessibility in mobile view', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Verify the mobile menu is accessible
  const menuButton = page.locator('button[aria-label="Toggle menu"]');
  await expect(menuButton).toBeVisible();
  
  // Check for ARIA expanded state
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  
  // Open menu
  await menuButton.click();
  
  // Check ARIA expanded updated correctly
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  
  // Verify mobile menu is now visible and accessible
  const mobileMenu = page.locator('nav[aria-label="Mobile menu"]');
  await expect(mobileMenu).toBeVisible();
  
  // Inject axe for testing
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
  });
  
  // Test the mobile menu for accessibility
  const violations = await page.evaluate(() => {
    return new Promise(resolve => {
      window.axe.run('nav[aria-label="Mobile menu"]').then(results => {
        resolve(results.violations);
      });
    });
  });
  
  expect(violations.length).toBe(0, 
    `${violations.length} accessibility violations in mobile menu`);
});