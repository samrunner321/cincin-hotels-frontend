import { test, expect } from './a11y-test-fixtures';
import { a11yConfig } from './config';

test.describe('User Flow Accessibility Tests', () => {
  test('hotel booking flow should be accessible', async ({ page, checkA11y }) => {
    // Get hotel booking flow steps from config
    const hotelBookingFlow = a11yConfig.userFlows.find(flow => 
      flow.name === 'Hotel Booking Flow'
    );
    
    if (!hotelBookingFlow) {
      test.skip('Hotel booking flow not defined in config');
      return;
    }
    
    // Navigate through each step in the flow and test accessibility
    for (const step of hotelBookingFlow.steps) {
      console.log(`Testing step: ${step.description}`);
      
      // Navigate to the step path
      await page.goto(step.path);
      await page.waitForLoadState('networkidle');
      
      // Perform any actions if defined
      if (step.actionSelector) {
        await page.locator(step.actionSelector).first().click();
        await page.waitForLoadState('networkidle');
      }
      
      // Test accessibility at this step
      await checkA11y({
        detailedReport: true,
        includeImpact: ['critical', 'serious'],
        exclude: a11yConfig.excludeRules,
      });
    }
  });

  test('membership registration flow should be accessible', async ({ page, checkA11y }) => {
    // Get membership flow steps from config
    const membershipFlow = a11yConfig.userFlows.find(flow => 
      flow.name === 'Membership Registration Flow'
    );
    
    if (!membershipFlow) {
      test.skip('Membership registration flow not defined in config');
      return;
    }
    
    // Navigate through each step in the flow and test accessibility
    for (const step of membershipFlow.steps) {
      console.log(`Testing step: ${step.description}`);
      
      // Navigate to the step path
      await page.goto(step.path);
      await page.waitForLoadState('networkidle');
      
      // If this step has a form, fill it with valid data
      if (step.actionSelector && step.actionSelector.includes('form')) {
        // Fill form fields - adapt based on your form structure
        const form = page.locator(step.actionSelector);
        await fillMembershipForm(page, form);
        
        // Do not submit the form in this test, just check accessibility
      }
      
      // Test accessibility at this step
      await checkA11y({
        detailedReport: true,
        includeImpact: ['critical', 'serious'],
        exclude: a11yConfig.excludeRules,
      });
    }
  });

  test('successful form submission should be accessible', async ({ page, checkA11y }) => {
    // Navigate to the contact form page
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Fill out the contact form
    await fillContactForm(page);
    
    // Submit the form
    await page.locator('form button[type="submit"]').click();
    
    // Wait for success message
    await page.waitForSelector('[data-testid="success-message"], .success-message', {
      timeout: a11yConfig.isCI ? 30000 : 5000
    });
    
    // Test accessibility of success message
    await checkA11y({
      selector: '[data-testid="success-message"], .success-message',
      detailedReport: true,
      includeImpact: ['critical', 'serious'],
      exclude: a11yConfig.excludeRules,
    });
    
    // Check that success message has appropriate ARIA live region
    const successMessage = page.locator('[data-testid="success-message"], .success-message');
    const ariaLive = await successMessage.getAttribute('aria-live');
    
    expect(['assertive', 'polite']).toContain(ariaLive);
  });

  test('error handling should be accessible', async ({ page, checkA11y }) => {
    // Navigate to the contact form page
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Try to submit form without filling required fields
    await page.locator('form button[type="submit"]').click();
    
    // Wait for error messages
    await page.waitForSelector('[data-testid="error-message"], .error-message, [aria-invalid="true"]');
    
    // Test accessibility of error messages
    await checkA11y({
      selector: 'form',
      detailedReport: true,
      includeImpact: ['critical', 'serious'],
      exclude: a11yConfig.excludeRules,
    });
    
    // Check that errors are properly associated with fields
    const invalidFields = page.locator('[aria-invalid="true"]');
    const count = await invalidFields.count();
    
    for (let i = 0; i < count; i++) {
      const field = invalidFields.nth(i);
      
      // Check for error message association
      const fieldId = await field.getAttribute('id');
      if (fieldId) {
        // Look for error message associated via aria-describedby
        const describedBy = await field.getAttribute('aria-describedby');
        expect(describedBy).not.toBe(null);
        
        if (describedBy) {
          await expect(page.locator(`#${describedBy}`)).toBeVisible();
        }
      }
    }
  });

  test('keyboard navigation should work for complete flows', async ({ page }) => {
    // Navigate to the hotels page
    await page.goto('/hotels');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation by completing a task
    // Focus on first element
    await page.keyboard.press('Tab');
    
    // Navigate to first hotel card with keyboard
    let hotelCardFound = false;
    for (let i = 0; i < 20 && !hotelCardFound; i++) {
      const isHotelCard = await page.evaluate(() => {
        const active = document.activeElement;
        return active && (
          active.closest('[data-testid="hotel-card"]') !== null ||
          active.matches('a[href*="/hotels/"]')
        );
      });
      
      if (isHotelCard) {
        hotelCardFound = true;
      } else {
        await page.keyboard.press('Tab');
      }
    }
    
    // After finding a hotel card, press Enter to navigate to it
    if (hotelCardFound) {
      const currentUrl = page.url();
      await page.keyboard.press('Enter');
      
      // Wait for navigation to complete
      await page.waitForURL(url => url.toString() !== currentUrl);
      await page.waitForLoadState('networkidle');
      
      // We should now be on a hotel detail page
      expect(page.url()).toContain('/hotels/');
      
      // Test accessibility on hotel detail page
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
      });
      
      const violations = await page.evaluate(() => {
        return new Promise(resolve => {
          window.axe.run().then(results => {
            resolve(results.violations.filter(v => 
              v.impact === 'critical' || v.impact === 'serious'
            ));
          }).catch(() => resolve([]));
        });
      });
      
      expect(violations.length).toBe(0, 
        `${violations.length} critical/serious accessibility violations found after keyboard navigation`);
    }
  });
});

// Helper functions for the tests

/**
 * Helper function to fill a contact form with test data
 */
async function fillContactForm(page) {
  const form = page.locator('form');
  
  // Try to fill in common form fields
  try {
    const nameField = form.locator('input[name="name"], input[name="fullName"], input[placeholder*="name" i]').first();
    if (await nameField.count() > 0) {
      await nameField.fill('Test User');
    }
    
    const emailField = form.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    if (await emailField.count() > 0) {
      await emailField.fill('test@example.com');
    }
    
    const messageField = form.locator('textarea, input[name="message"], [placeholder*="message" i]').first();
    if (await messageField.count() > 0) {
      await messageField.fill('This is a test message for accessibility testing.');
    }
    
    const subjectField = form.locator('input[name="subject"], select[name="subject"], [placeholder*="subject" i]').first();
    if (await subjectField.count() > 0) {
      const isSelect = await page.evaluate(el => {
        return el.tagName === 'SELECT';
      }, subjectField);
      
      if (isSelect) {
        // Find the first option that isn't the placeholder
        const options = await subjectField.locator('option').all();
        for (const option of options) {
          const value = await option.getAttribute('value');
          if (value && value !== '') {
            await subjectField.selectOption(value);
            break;
          }
        }
      } else {
        await subjectField.fill('Test Subject');
      }
    }
  } catch (error) {
    console.log('Error filling contact form:', error);
  }
}

/**
 * Helper function to fill a membership form with test data
 */
async function fillMembershipForm(page, form) {
  try {
    // Try to fill in common membership form fields
    const firstNameField = form.locator('input[name="firstName"], input[name="first_name"], input[placeholder*="first name" i]').first();
    if (await firstNameField.count() > 0) {
      await firstNameField.fill('Test');
    }
    
    const lastNameField = form.locator('input[name="lastName"], input[name="last_name"], input[placeholder*="last name" i]').first();
    if (await lastNameField.count() > 0) {
      await lastNameField.fill('User');
    }
    
    const emailField = form.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    if (await emailField.count() > 0) {
      await emailField.fill('test@example.com');
    }
    
    const passwordField = form.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
    if (await passwordField.count() > 0) {
      await passwordField.fill('TestPassword123!');
    }
    
    // Handle checkboxes for terms, privacy, etc.
    const checkboxes = form.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    for (let i = 0; i < checkboxCount; i++) {
      await checkboxes.nth(i).check();
    }
    
  } catch (error) {
    console.log('Error filling membership form:', error);
  }
}