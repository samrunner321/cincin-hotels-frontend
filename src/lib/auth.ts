/**
 * Auth utilities for handling tokens and authentication securely
 */

/**
 * Get the Directus public token from environment variables
 * This token is used for client-side requests with limited permissions
 */
export function getDirectusPublicToken(): string {
  // In development mode, provide helpful error messages
  if (process.env.NODE_ENV === 'development' && !process.env.DIRECTUS_PUBLIC_TOKEN) {
    console.warn('⚠️ DIRECTUS_PUBLIC_TOKEN is not set in your environment variables.');
    console.warn('Please set this in your .env.local file or use mock mode.');
    
    // If mock server is enabled, we can return an empty string
    if (process.env.IS_MOCK_SERVER === 'true') {
      return '';
    }
  }
  
  return process.env.DIRECTUS_PUBLIC_TOKEN || '';
}

/**
 * Get the Directus admin token from environment variables
 * This token should only be used for server-side requests with higher permissions
 * It should NEVER be exposed to the client
 */
export function getDirectusAdminToken(): string {
  // This function should only be called server-side
  if (typeof window !== 'undefined') {
    console.error('❌ Security breach: Attempted to access admin token on client-side!');
    return '';
  }
  
  // In development mode, provide helpful error messages
  if (process.env.NODE_ENV === 'development' && !process.env.DIRECTUS_ADMIN_TOKEN) {
    console.warn('⚠️ DIRECTUS_ADMIN_TOKEN is not set in your environment variables.');
    console.warn('Please set this in your .env.local file or use mock mode.');
    
    // If mock server is enabled, we can return an empty string
    if (process.env.IS_MOCK_SERVER === 'true') {
      return '';
    }
  }
  
  return process.env.DIRECTUS_ADMIN_TOKEN || '';
}

/**
 * Safely check if a required environment variable exists
 * Useful for configuration validation during startup
 */
export function checkRequiredEnvVar(name: string): boolean {
  if (!process.env[name]) {
    console.error(`❌ Required environment variable ${name} is missing!`);
    return false;
  }
  return true;
}

/**
 * Validate that all required Directus environment variables are set
 * Use this during application initialization
 */
export function validateDirectusConfig(): boolean {
  // Check URL first (needed for both client and server)
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    console.error('❌ NEXT_PUBLIC_DIRECTUS_URL is required');
    return false;
  }
  
  // If mock server is enabled, we don't need tokens
  if (process.env.IS_MOCK_SERVER === 'true') {
    return true;
  }
  
  // Check tokens based on environment
  let isValid = true;
  
  // In production, we strictly require tokens
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DIRECTUS_PUBLIC_TOKEN) {
      console.error('❌ DIRECTUS_PUBLIC_TOKEN is required in production');
      isValid = false;
    }
    
    if (!process.env.DIRECTUS_ADMIN_TOKEN) {
      console.error('❌ DIRECTUS_ADMIN_TOKEN is required in production');
      isValid = false;
    }
  } else {
    // In development, we warn but don't fail if tokens are missing
    if (!process.env.DIRECTUS_PUBLIC_TOKEN) {
      console.warn('⚠️ DIRECTUS_PUBLIC_TOKEN is not set');
    }
    
    if (!process.env.DIRECTUS_ADMIN_TOKEN) {
      console.warn('⚠️ DIRECTUS_ADMIN_TOKEN is not set');
    }
  }
  
  return isValid;
}