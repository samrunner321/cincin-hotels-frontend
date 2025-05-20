import { expect, Locator, Page } from '@playwright/test';

/**
 * Custom assertions for E2E tests
 */

/**
 * Assert that the page URL contains the expected path
 */
export async function assertUrlContains(page: Page, expectedPath: string): Promise<void> {
  const url = page.url();
  expect(url).toContain(expectedPath);
}

/**
 * Assert that the page has a valid title
 */
export async function assertPageTitle(page: Page, expectedTitle: string): Promise<void> {
  await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
}

/**
 * Assert that an element contains text with case-insensitive matching
 */
export async function assertContainsText(locator: Locator, text: string): Promise<void> {
  await expect(locator).toContainText(text, { ignoreCase: true });
}

/**
 * Assert that a list of elements has the expected count
 */
export async function assertElementCount(locator: Locator, count: number): Promise<void> {
  await expect(locator).toHaveCount(count);
}

/**
 * Assert that all elements in a list contain a given text
 */
export async function assertAllElementsContainText(locator: Locator, text: string): Promise<void> {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    await expect(locator.nth(i)).toContainText(text, { ignoreCase: true });
  }
}

/**
 * Assert that an element has a specific attribute value
 */
export async function assertAttributeValue(
  locator: Locator, 
  attribute: string, 
  value: string
): Promise<void> {
  await expect(locator).toHaveAttribute(attribute, value);
}

/**
 * Assert that an element has a specific CSS property value
 */
export async function assertCssProperty(
  locator: Locator, 
  property: string, 
  value: string
): Promise<void> {
  const propertyValue = await locator.evaluate((el, prop) => {
    return window.getComputedStyle(el).getPropertyValue(prop);
  }, property);
  
  expect(propertyValue).toContain(value);
}

/**
 * Assert that an image is loaded correctly
 */
export async function assertImageLoaded(locator: Locator): Promise<void> {
  const isLoaded = await locator.evaluate((img: HTMLImageElement) => {
    return img.complete && img.naturalHeight !== 0;
  });
  
  expect(isLoaded).toBe(true);
}

/**
 * Assert that an element is visible and within viewport
 */
export async function assertElementInViewport(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  
  const isInViewport = await locator.evaluate(el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
  
  expect(isInViewport).toBe(true);
}

/**
 * Assert that a form field has a validation error
 */
export async function assertFormFieldError(
  fieldLocator: Locator, 
  expectedError?: string
): Promise<void> {
  // Check for error class on the field or parent
  const hasErrorClass = await fieldLocator.evaluate(el => {
    return el.classList.contains('error') || 
           el.classList.contains('invalid') || 
           el.parentElement?.classList.contains('error') ||
           el.parentElement?.classList.contains('invalid');
  });
  
  expect(hasErrorClass).toBe(true);
  
  // If an expected error message was provided, check for it
  if (expectedError) {
    // Look for error message in common locations relative to the input
    const errorElement = fieldLocator.locator('+ .error-message, + .invalid-feedback, ~ .error-message, ~ .invalid-feedback');
    await assertContainsText(errorElement, expectedError);
  }
}

/**
 * Assert that a hotel card displays the expected information
 */
export async function assertHotelCard(
  cardLocator: Locator, 
  hotelName: string, 
  category?: string
): Promise<void> {
  await assertContainsText(cardLocator, hotelName);
  
  if (category) {
    const categoryElement = cardLocator.locator('.category, [data-testid="hotel-category"]');
    await assertContainsText(categoryElement, category);
  }
  
  // Verify hotel image is loaded
  const imageElement = cardLocator.locator('img');
  await assertImageLoaded(imageElement);
}

/**
 * Assert that a destination card displays the expected information
 */
export async function assertDestinationCard(
  cardLocator: Locator, 
  destinationName: string, 
  region?: string
): Promise<void> {
  await assertContainsText(cardLocator, destinationName);
  
  if (region) {
    const regionElement = cardLocator.locator('.region, [data-testid="destination-region"]');
    await assertContainsText(regionElement, region);
  }
  
  // Verify destination image is loaded
  const imageElement = cardLocator.locator('img');
  await assertImageLoaded(imageElement);
}