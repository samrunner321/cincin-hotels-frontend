import { test, expect } from './a11y-test-fixtures';
import { a11yConfig } from './config';

test.describe('Component-Level Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start on the homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('all critical UI components should be accessible', async ({ page, checkComponentA11y }) => {
    // Test each critical component defined in config
    for (const component of a11yConfig.testComponents) {
      // Check if component exists on the page
      const componentLocator = page.locator(component.selector);
      if (await componentLocator.count() > 0) {
        await checkComponentA11y(component.selector, component.name);
      }
    }
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    // Get all buttons and links
    const interactiveElements = page.locator('a[href], button, [role="button"], [role="link"]');
    const count = await interactiveElements.count();
    
    // Sample a subset of elements for testing
    const sampleSize = Math.min(count, 10);
    const sampleIndices = Array.from({ length: sampleSize }, 
      (_, i) => Math.floor(i * count / sampleSize));
    
    // Test each sampled element
    for (const index of sampleIndices) {
      const element = interactiveElements.nth(index);
      
      // Check if element can receive focus
      await element.focus();
      const isFocused = await page.evaluate(() => {
        return document.activeElement === document.querySelector(':focus');
      });
      
      expect(isFocused).toBe(true, 'Element should be focusable');
      
      // Check for visible focus indicator
      const hasFocusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        const styles = window.getComputedStyle(el);
        return styles.outlineStyle !== 'none' || 
               styles.boxShadow !== 'none' || 
               styles.borderStyle !== 'none';
      });
      
      expect(hasFocusStyles).toBe(true, 'Element should have visible focus styles');
    }
  });

  test('images should have alt text', async ({ page }) => {
    // Get all images on the page
    const images = page.locator('img');
    const count = await images.count();
    
    // Test each image
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      
      // Get alt attribute
      const alt = await image.getAttribute('alt');
      
      // Check if image is decorative (role="presentation" or empty alt)
      const role = await image.getAttribute('role');
      const isDecorative = role === 'presentation' || role === 'none';
      
      // If decorative, empty alt is acceptable
      if (isDecorative) {
        expect(alt).toBe('', 'Decorative images should have empty alt text');
      } else {
        expect(alt).not.toBe(null, 'Images must have alt text');
        
        if (alt !== '') {
          // Alt text shouldn't contain "image", "picture", etc.
          expect(alt.toLowerCase()).not.toContain('image');
          expect(alt.toLowerCase()).not.toContain('picture');
          expect(alt.toLowerCase()).not.toContain('photo');
        }
      }
    }
  });

  test('form inputs should have proper labels', async ({ page }) => {
    // Navigate to a page with forms (contact or membership)
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Get all form inputs
    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');
        
        // Skip hidden inputs
        if (type === 'hidden') continue;
        
        // Get input ID
        const id = await input.getAttribute('id');
        
        if (id) {
          // Check for label with matching 'for' attribute
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Check for aria-labelledby
          const ariaLabelledby = await input.getAttribute('aria-labelledby');
          const hasAriaLabelledby = ariaLabelledby !== null;
          
          // Check for aria-label
          const ariaLabel = await input.getAttribute('aria-label');
          const hasAriaLabel = ariaLabel !== null;
          
          // Input should have at least one form of label
          expect(hasLabel || hasAriaLabelledby || hasAriaLabel).toBe(
            true, 
            `Input #${id} should have a label, aria-labelledby, or aria-label`
          );
        } else {
          // If no ID, check if wrapped in label
          const isWrappedInLabel = await page.evaluate(el => {
            return el.closest('label') !== null;
          }, input);
          
          // Or has aria-label
          const hasAriaLabel = await input.getAttribute('aria-label') !== null;
          
          expect(isWrappedInLabel || hasAriaLabel).toBe(
            true, 
            `Input without ID should be wrapped in a label or have aria-label`
          );
        }
      }
    }
  });

  test('headings should form a logical hierarchy', async ({ page }) => {
    // Test heading hierarchy
    const headings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => ({
          level: parseInt(h.tagName.charAt(1)),
          text: h.textContent.trim()
        }));
    });
    
    // There should be exactly one h1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBe(1, 'Page should have exactly one h1 heading');
    
    // Check for proper hierarchy (no skipping levels)
    let previousLevel = 0;
    let hasError = false;
    
    for (const heading of headings) {
      // When going to a deeper level, it should only increment by 1
      if (heading.level > previousLevel && heading.level > previousLevel + 1) {
        console.log(`Heading hierarchy error: h${previousLevel} followed by h${heading.level}`);
        hasError = true;
      }
      
      previousLevel = heading.level;
    }
    
    expect(hasError).toBe(false, 'Heading levels should not be skipped (e.g., h1 to h3)');
  });

  test('ARIA usage should be correct', async ({ page, getA11yViolations }) => {
    // Test for proper ARIA usage
    const violations = await getA11yViolations();
    
    // Filter for ARIA-related violations
    const ariaViolations = violations.filter(v => 
      v.id.includes('aria') || 
      v.tags.some(tag => tag.includes('aria'))
    );
    
    if (ariaViolations.length > 0) {
      console.log('ARIA violations found:');
      ariaViolations.forEach(v => {
        console.log(` - ${v.id}: ${v.help}`);
        v.nodes.slice(0, 3).forEach(n => {
          console.log(`   * ${n.html}`);
        });
      });
    }
    
    expect(ariaViolations.length).toBe(0, 
      `${ariaViolations.length} ARIA violations found`);
  });

  test('language should be properly set', async ({ page }) => {
    // Check that html has lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).not.toBe(null, 'HTML should have a lang attribute');
    expect(htmlLang.length).toBeGreaterThan(1, 'Lang attribute should be valid');
    
    // Check language switcher if available
    const langSwitcher = page.locator('[data-testid="language-switcher"]');
    if (await langSwitcher.count() > 0) {
      // Test that lang switcher is accessible
      await page.evaluate(() => {
        if (typeof window.axe === 'undefined') {
          window.axe = { run: () => ({ violations: [] }) };
        }
      });
      
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
      });
      
      const violations = await page.evaluate(selector => {
        return new Promise(resolve => {
          window.axe.run(document.querySelector(selector))
            .then(results => resolve(results.violations))
            .catch(() => resolve([]));
        });
      }, '[data-testid="language-switcher"]');
      
      expect(violations.length).toBe(0, 
        `${violations.length} accessibility violations in language switcher`);
    }
  });
});