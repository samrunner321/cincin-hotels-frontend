/**
 * Accessibility testing configuration
 */

// Define our WCAG compliance levels
export enum WcagLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA'
}

// Default configuration for accessibility tests
export const a11yConfig = {
  // The WCAG level we're targeting
  wcagLevel: WcagLevel.AA,
  
  // Rules to exclude from tests (e.g., known issues or false positives)
  excludeRules: [
    // Example: 'color-contrast' - only if you have a valid reason to exclude it
  ],
  
  // Critical paths that must have zero violations
  criticalPaths: [
    '/', // Homepage
    '/hotels', // Hotels listing page
    '/membership', // Membership page
    '/contact', // Contact page
  ],
  
  // Components to test individually
  testComponents: [
    { name: 'Navigation Bar', selector: 'nav' },
    { name: 'Footer', selector: 'footer' },
    { name: 'Hotel Card', selector: '[data-testid="hotel-card"]' },
    { name: 'Destination Card', selector: '[data-testid="destination-card"]' },
    { name: 'Contact Form', selector: 'form[action*="contact"]' },
    { name: 'Membership Form', selector: 'form[action*="membership"]' },
    { name: 'Search Form', selector: '[data-testid="search-form"]' },
    { name: 'Filter Panel', selector: '[data-testid="filter-panel"]' },
    { name: 'Modal Dialog', selector: '[role="dialog"]' },
    { name: 'Mobile Menu', selector: 'nav[aria-label="Mobile menu"]' },
  ],
  
  // User flows to test for accessibility
  userFlows: [
    {
      name: 'Hotel Booking Flow',
      steps: [
        { path: '/hotels', description: 'Search for hotels' },
        { path: '/hotels/hotel-rockresort', description: 'View hotel details' },
        { path: '/hotels/hotel-rockresort/rooms', description: 'Select room' },
        // These would continue through the booking flow
      ]
    },
    {
      name: 'Membership Registration Flow',
      steps: [
        { path: '/membership', description: 'View membership options' },
        { path: '/membership#join', description: 'Fill out membership form', actionSelector: 'form[action*="membership"]' },
        // Continue with form submission etc.
      ]
    }
  ],
  
  // Reporting options
  reporting: {
    includeScreenshots: true,
    outputDir: 'test-results/accessibility',
    generateHtmlReport: true,
    failOnViolation: process.env.CI === 'true', // Fail CI builds on violation
  }
};