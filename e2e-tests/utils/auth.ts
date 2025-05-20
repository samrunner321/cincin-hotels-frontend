import { Page } from '@playwright/test';
import { getTestCredentials } from './environment';

/**
 * Utility functions for authentication in E2E tests
 */

/**
 * Login to the application
 * Note: This implementation will need to be adjusted based on the actual login flow
 * of the CinCin Hotels application
 */
export async function login(page: Page, username?: string, password?: string): Promise<void> {
  // Use provided credentials or default test credentials
  const creds = username && password 
    ? { username, password } 
    : getTestCredentials();
  
  if (!creds) {
    throw new Error('No credentials provided for login');
  }

  // Navigate to login page (adjust path as needed)
  await page.goto('/login');
  
  // Fill login form
  await page.fill('[data-testid="email-input"]', creds.username);
  await page.fill('[data-testid="password-input"]', creds.password);
  
  // Submit form
  await page.click('[data-testid="login-button"]');
  
  // Wait for login to complete
  await page.waitForNavigation();
}

/**
 * Get login state cookie if already logged in
 */
export async function getAuthCookie(page: Page): Promise<string | null> {
  const cookies = await page.context().cookies();
  const authCookie = cookies.find(c => c.name === 'auth_token');
  return authCookie ? authCookie.value : null;
}

/**
 * Set auth cookie to simulate being logged in
 * This can be faster than going through the login flow for tests that need authentication
 */
export async function setAuthCookie(page: Page, token: string): Promise<void> {
  await page.context().addCookies([
    {
      name: 'auth_token',
      value: token,
      domain: new URL(page.url()).hostname,
      path: '/',
    }
  ]);
}

/**
 * Logout from the application
 */
export async function logout(page: Page): Promise<void> {
  // Navigate to user menu and click logout
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  
  // Wait for logout to complete
  await page.waitForNavigation();
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const authCookie = await getAuthCookie(page);
  return !!authCookie;
}