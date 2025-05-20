/**
 * Auth utilities for handling tokens and authentication securely
 * (JavaScript version for compatibility with non-TypeScript files)
 */

/**
 * Get the Directus public token from environment variables
 * This token is used for client-side requests with limited permissions
 */
function getDirectusPublicToken() {
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
function getDirectusAdminToken() {
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

module.exports = {
  getDirectusPublicToken,
  getDirectusAdminToken
};