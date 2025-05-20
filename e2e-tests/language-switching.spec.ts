import { test, expect } from './utils/test-fixtures';

test.describe('Language Switching', () => {
  test('should switch between languages', async ({ page, translationContext }) => {
    // Start on the homepage
    await page.goto('/');
    
    // Wait for content to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Find the language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("EN"), button:has-text("DE")');
    await expect(languageSwitcher).toBeVisible();
    
    // Save content in current language
    const currentTitle = await page.locator('h1').textContent();
    const currentMenu = await page.locator('nav').textContent();
    
    // Click the language switcher
    await languageSwitcher.click();
    
    // Select the other language
    // This may vary depending on your UI
    const otherLanguage = await page.locator('text=English, text=Deutsch').first();
    if (await otherLanguage.isVisible()) {
      await otherLanguage.click();
    } else {
      // If language button toggles directly, skip this step
      console.log('Language switcher toggles directly, skipping language selection click');
    }
    
    // Wait for page to reload or translation to apply
    await page.waitForLoadState('networkidle');
    
    // Check that the content has changed
    const newTitle = await page.locator('h1').textContent();
    const newMenu = await page.locator('nav').textContent();
    
    expect(newTitle).not.toEqual(currentTitle);
    expect(newMenu).not.toEqual(currentMenu);
  });
  
  test('should persist language preference', async ({ page }) => {
    // First set the language to English
    await page.goto('/');
    const languageSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("EN"), button:has-text("DE")');
    
    // Get the current language first
    const initialLanguage = await languageSwitcher.textContent();
    
    // Click to toggle language
    await languageSwitcher.click();
    
    // If language selector opens as a menu
    const languageOption = page.locator('text=English, text=Deutsch');
    if (await languageOption.isVisible()) {
      // Select the language that's not currently active
      if (initialLanguage?.includes('EN')) {
        await page.locator('text=Deutsch').click();
      } else {
        await page.locator('text=English').click();
      }
    }
    
    // Wait for the page to reload
    await page.waitForLoadState('networkidle');
    
    // Get the new language
    const newLanguage = await languageSwitcher.textContent();
    
    // Check that language has changed
    expect(newLanguage).not.toEqual(initialLanguage);
    
    // Store the changed language for comparison
    const changedLanguage = newLanguage;
    
    // Now navigate to another page
    await page.click('a[href="/hotels"]');
    await page.waitForURL(/\/hotels/);
    
    // Check that language preference was maintained
    const hotelPageLanguage = await page.locator('[data-testid="language-switcher"], button:has-text("EN"), button:has-text("DE")').textContent();
    expect(hotelPageLanguage).toEqual(changedLanguage);
  });
  
  test('should translate all UI elements correctly', async ({ page }) => {
    // Navigate to German version
    await page.goto('/');
    
    // Ensure German is active, if not, switch to it
    const languageSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("EN"), button:has-text("DE")');
    const currentLanguage = await languageSwitcher.textContent();
    
    if (!currentLanguage?.includes('DE')) {
      await languageSwitcher.click();
      
      // Try to select German
      const germanOption = page.locator('text=Deutsch');
      if (await germanOption.isVisible()) {
        await germanOption.click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Now check German content
    const germanElements = [
      { selector: 'a[href="/hotels"]', expectedText: /hotels|unterkünfte/i },
      { selector: 'a[href="/destinations"]', expectedText: /destinationen|reiseziele/i },
      { selector: 'footer', expectedText: /impressum|datenschutz/i }
    ];
    
    // Check all expected German elements
    for (const element of germanElements) {
      const locator = page.locator(element.selector);
      await expect(locator).toContainText(element.expectedText);
    }
    
    // Now switch to English
    await languageSwitcher.click();
    
    // Try to select English
    const englishOption = page.locator('text=English');
    if (await englishOption.isVisible()) {
      await englishOption.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Check English content
    const englishElements = [
      { selector: 'a[href="/hotels"]', expectedText: /hotels|accommodations/i },
      { selector: 'a[href="/destinations"]', expectedText: /destinations/i },
      { selector: 'footer', expectedText: /imprint|privacy/i }
    ];
    
    // Check all expected English elements
    for (const element of englishElements) {
      const locator = page.locator(element.selector);
      await expect(locator).toContainText(element.expectedText);
    }
  });
});

// Visual regression test for language switching
test('language switching visual regression', async ({ page, visualSnapshot }) => {
  // Start on the homepage in German
  await page.goto('/');
  
  // Ensure German is active
  const languageSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("EN"), button:has-text("DE")');
  const currentLanguage = await languageSwitcher.textContent();
  
  if (!currentLanguage?.includes('DE')) {
    await languageSwitcher.click();
    
    // Try to select German
    const germanOption = page.locator('text=Deutsch');
    if (await germanOption.isVisible()) {
      await germanOption.click();
      await page.waitForLoadState('networkidle');
    }
  }
  
  // Take snapshot of German homepage
  await visualSnapshot('homepage-german');
  
  // Switch to English
  await languageSwitcher.click();
  
  // Try to select English
  const englishOption = page.locator('text=English');
  if (await englishOption.isVisible()) {
    await englishOption.click();
    await page.waitForLoadState('networkidle');
  }
  
  // Take snapshot of English homepage
  await visualSnapshot('homepage-english');
});