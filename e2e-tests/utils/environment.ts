/**
 * Environment configuration utilities for E2E tests
 */

export type TestEnvironment = 'local' | 'staging' | 'production';

interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  useMocks: boolean;
  credentials?: {
    username: string;
    password: string;
  };
}

const environmentConfigs: Record<TestEnvironment, EnvironmentConfig> = {
  local: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
    useMocks: true,
    credentials: {
      username: 'test@example.com',
      password: 'testpassword',
    },
  },
  staging: {
    baseUrl: 'https://staging.cincinhotels.com',
    apiUrl: 'https://staging.cincinhotels.com/api',
    useMocks: false,
    credentials: {
      username: 'test@example.com',
      password: process.env.STAGING_PASSWORD || 'testpassword',
    },
  },
  production: {
    baseUrl: 'https://cincinhotels.com',
    apiUrl: 'https://cincinhotels.com/api',
    useMocks: false,
  },
};

/**
 * Get the current test environment from environment variables or default to 'local'
 */
export function getTestEnvironment(): TestEnvironment {
  const env = process.env.TEST_ENV as TestEnvironment;
  if (env && (env === 'local' || env === 'staging' || env === 'production')) {
    return env;
  }
  return 'local';
}

/**
 * Get the configuration for the current test environment
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getTestEnvironment();
  return environmentConfigs[env];
}

/**
 * Get the base URL for the current test environment
 */
export function getBaseUrl(): string {
  return getEnvironmentConfig().baseUrl;
}

/**
 * Get the API URL for the current test environment
 */
export function getApiUrl(): string {
  return getEnvironmentConfig().apiUrl;
}

/**
 * Check if we should use mocks in the current environment
 */
export function shouldUseMocks(): boolean {
  // Always use mocks in local environment, or if FORCE_MOCKS is set
  return getEnvironmentConfig().useMocks || process.env.FORCE_MOCKS === 'true';
}

/**
 * Get test credentials for the current environment (if available)
 */
export function getTestCredentials(): { username: string; password: string } | undefined {
  return getEnvironmentConfig().credentials;
}

/**
 * Check if we are running in CI environment
 */
export function isCI(): boolean {
  return process.env.CI === 'true';
}