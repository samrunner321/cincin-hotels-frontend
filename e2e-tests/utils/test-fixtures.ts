import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import { compareScreenshot, waitForVisualStability } from './visual-comparison';
import { setRtlLanguage, setLtrLanguage, isRtlMode } from './rtl-test-utils';

/**
 * Extended test fixtures for CinCin Hotels
 */
type CincinFixtures = {
  // Custom context with cookie handling and other extensions
  authenticatedContext: BrowserContext;
  
  // Helper to ensure demo data is loaded
  withDemoData: Page;
  
  // Custom visual snapshot helpers
  visualSnapshot: (name: string, options?: any) => Promise<void>;
  
  // Mobile device simulation
  mobileView: Page;
  
  // Access to translation keys
  translationContext: {
    setLanguage: (lang: 'en-US' | 'de-DE' | 'ar' | 'he') => Promise<void>,
    getSupportedLanguages: () => string[],
    getCurrentLanguage: () => string,
  };
  
  // RTL support
  rtlPage: Page;
  ltrPage: Page;
};

/**
 * Extended test with CinCin fixtures
 */
export const test = base.extend<CincinFixtures>({
  // Extend context with authentication
  authenticatedContext: async ({ context }, use) => {
    // Set a fake user session token if needed
    await context.addCookies([
      {
        name: 'session_token',
        value: 'test-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: process.env.CI ? true : false,
      }
    ]);
    
    await use(context);
    
    // Clean up after test
    await context.clearCookies();
  },
  
  // Page with demo data ensured to be loaded
  withDemoData: async ({ page }, use) => {
    // Navigate to ensure demo data is loaded (can be replaced with API call)
    await page.goto('/api/testing/reset-demo-data');
    
    // Wait for the data reset to complete
    await page.waitForSelector('text=Demo data reset complete');
    
    await use(page);
  },
  
  // Visual regression testing helper
  visualSnapshot: async ({ page }, use) => {
    const takeVisualSnapshot = async (name: string, options = {}) => {
      await waitForVisualStability(page);
      await compareScreenshot(page, {
        name,
        fullPage: true,
        ...options,
      });
    };
    
    await use(takeVisualSnapshot);
  },
  
  // Mobile view helper
  mobileView: async ({ context }, use) => {
    // Create mobile page
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    
    await use(mobilePage);
    
    // Close mobile page after test
    await mobilePage.close();
  },
  
  // Translation context with language switching
  translationContext: async ({ page }, use) => {
    // Default language
    let currentLanguage = 'de-DE';
    
    // Helper to set language
    const setLanguage = async (lang: 'en-US' | 'de-DE' | 'ar' | 'he') => {
      await page.evaluate((language) => {
        localStorage.setItem('preferred_language', language);
        
        // Set document direction based on language
        if (language === 'ar' || language === 'he') {
          document.documentElement.dir = 'rtl';
        } else {
          document.documentElement.dir = 'ltr';
        }
        
        document.documentElement.lang = language;
      }, lang);
      
      // Reload page for language to take effect
      await page.reload();
      currentLanguage = lang;
    };
    
    // Get available languages
    const getSupportedLanguages = () => ['de-DE', 'en-US', 'ar', 'he'];
    
    // Get current language
    const getCurrentLanguage = () => currentLanguage;
    
    await use({
      setLanguage,
      getSupportedLanguages,
      getCurrentLanguage,
    });
  },
  
  // RTL page helper
  rtlPage: async ({ context }, use) => {
    // Create RTL page
    const rtlPage = await context.newPage();
    
    // Set to RTL mode (Arabic)
    await rtlPage.goto('/');
    await setRtlLanguage(rtlPage);
    
    // Verify RTL mode is active
    const isRtl = await isRtlMode(rtlPage);
    if (!isRtl) {
      throw new Error('Failed to set RTL mode');
    }
    
    await use(rtlPage);
    
    // Close RTL page after test
    await rtlPage.close();
  },
  
  // LTR page helper (for comparison)
  ltrPage: async ({ context }, use) => {
    // Create LTR page
    const ltrPage = await context.newPage();
    
    // Set to LTR mode (English)
    await ltrPage.goto('/');
    await setLtrLanguage(ltrPage);
    
    await use(ltrPage);
    
    // Close LTR page after test
    await ltrPage.close();
  },
});

// Export expect for convenience
export { expect } from '@playwright/test';