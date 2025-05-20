import { Page, expect } from '@playwright/test';

/**
 * Options for taking a screenshot for visual comparison
 */
export interface VisualComparisonOptions {
  /** 
   * Name of the screenshot (used for the file name) 
   */
  name: string;
  
  /** 
   * Mask elements that might cause flaky tests (e.g., dates, animations) 
   */
  mask?: string[];
  
  /** 
   * Threshold for visual comparison (0-1) 
   */
  threshold?: number;
  
  /** 
   * Full page screenshot vs viewport 
   */
  fullPage?: boolean;
  
  /** 
   * Additional styles to apply before taking screenshot (e.g., to disable animations) 
   */
  styles?: string;
}

/**
 * Take a screenshot and compare it with the baseline
 */
export async function compareScreenshot(
  page: Page, 
  options: VisualComparisonOptions
) {
  const { 
    name, 
    mask = [], 
    threshold = 0.2, 
    fullPage = true,
    styles = ''
  } = options;
  
  // Apply additional styles if provided (e.g., to disable animations)
  if (styles) {
    await page.addStyleTag({ content: styles });
  }
  
  // Apply default styles to hide flaky elements
  await page.addStyleTag({
    content: `
      /* Hide animations */
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        animation-delay: 0s !important;
        transition-delay: 0s !important;
      }
      
      /* Hide date/time elements that might change */
      [data-testid="dynamic-content"],
      .dynamic-content {
        visibility: hidden !important;
      }
    `
  });
  
  // Create locators for elements to mask
  const maskLocators = await Promise.all(
    mask.map(selector => page.locator(selector))
  );
  
  // Take the screenshot and compare with baseline
  await expect(page).toHaveScreenshot(`${name}.png`, {
    mask: maskLocators,
    threshold,
    fullPage,
    animations: 'disabled',
  });
}

/**
 * Wait for the page to be visually stable
 * This waits for network requests to finish and animations to complete
 */
export async function waitForVisualStability(page: Page, timeout = 5000) {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Wait for animations to complete
  // This is a basic approach - might need adjustment based on your app
  await page.waitForFunction(() => {
    return !document.querySelector('.animate-spin, .animate-pulse, [data-loading="true"]');
  }, { timeout });
  
  // Extra delay for any transitions to complete
  await page.waitForTimeout(300);
}