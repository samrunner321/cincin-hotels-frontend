import { Page } from '@playwright/test';

/**
 * RTL test utilities for Playwright tests
 */

/**
 * Set page language to RTL (Arabic)
 */
export async function setRtlLanguage(page: Page): Promise<void> {
  // Set language to Arabic
  await page.evaluate(() => {
    localStorage.setItem('preferred_language', 'ar');
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  });

  // Reload the page to apply language
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Set page language to LTR (English)
 */
export async function setLtrLanguage(page: Page): Promise<void> {
  // Set language to English
  await page.evaluate(() => {
    localStorage.setItem('preferred_language', 'en-US');
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en-US';
  });

  // Reload the page to apply language
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Check if page is in RTL mode
 */
export async function isRtlMode(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return document.documentElement.dir === 'rtl';
  });
}

/**
 * Wait for RTL mode to be applied
 */
export async function waitForRtlMode(page: Page, expectedRtl: boolean): Promise<void> {
  await page.waitForFunction(
    (expected) => document.documentElement.dir === (expected ? 'rtl' : 'ltr'),
    expectedRtl
  );
}

/**
 * RTL-aware locator helper for elements that flip position in RTL
 * 
 * For example, if an element is on the right in LTR mode, it will be on the left in RTL mode
 */
export async function getRtlAwareSelector(page: Page, ltrSelector: string, rtlSelector: string): Promise<string> {
  const isRtl = await isRtlMode(page);
  return isRtl ? rtlSelector : ltrSelector;
}