module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/hotels',
        'http://localhost:3000/hotels/hotel-schgaguler',
        'http://localhost:3000/destinations'
      ],
      staticDistDir: './.next',
      startServerCommand: 'npm run dev',
      numberOfRuns: 3,
      settings: {
        // Use preset configurations for each test
        preset: 'desktop', // 'mobile' also available
        // Limit CPU/Network throttling for faster CI runs
        throttling: {
          cpuSlowdownMultiplier: 2,
          throughputKbps: 10240,
          rttMs: 40,
        },
        // Skip audits that don't make sense for a dev build
        skipAudits: ['uses-http2', 'uses-long-cache-ttl'],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      // Level of assertions: 'warn' | 'error' | 'info' | 'off'
      assertMatrix: [
        {
          preset: 'lighthouse:recommended',
          matchingUrlPattern: '.*',
          assertions: {
            // Performance thresholds
            'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
            'interactive': ['warn', { maxNumericValue: 3500 }],
            'speed-index': ['warn', { maxNumericValue: 3000 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['warn', { maxNumericValue: 0.25 }],
            
            // Accessibility requirements
            'aria-allowed-attr': ['error'],
            'aria-required-attr': ['error'],
            'aria-roles': ['error'],
            'color-contrast': ['error'],
            'document-title': ['error'],
            'html-has-lang': ['error'],
            'image-alt': ['error'],
            'meta-viewport': ['error'],
            
            // Best practices
            'no-document-write': ['error'],
            'no-vulnerable-libraries': ['error'],
            'password-inputs-can-be-pasted-into': ['error'],
            
            // SEO
            'meta-description': ['error'],
            'link-name': ['error'],
            'hreflang': ['warn'],
            'canonical': ['warn'],
            
            // Relaxed requirements for development
            'unused-javascript': ['warn'],
            'uses-rel-preconnect': ['warn'],
            'uses-responsive-images': ['warn'],
            'offscreen-images': ['warn'],
            'uses-webp-images': ['off'],
            'uses-text-compression': ['off'],
            'uses-http2': ['off'],
          },
        },
      ],
    },
    server: {
      port: 9001,
    },
  },
};