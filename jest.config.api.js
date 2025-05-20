const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// API-spezifische Jest-Konfiguration
const customJestConfig = {
  displayName: 'API Tests',
  setupFilesAfterEnv: ['<rootDir>/__tests__/api/jest.setup.api.js'],
  testEnvironment: 'node', // API-Tests nutzen Node-Umgebung statt jsdom
  moduleNameMapper: {
    // Handle module aliases
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/api/(.*)$': '<rootDir>/api/$1',
    '^@/tests/(.*)$': '<rootDir>/__tests__/$1',
  },
  testMatch: [
    '<rootDir>/__tests__/api/**/*.test.{js,ts}',
    '<rootDir>/src/app/api/**/*.test.{js,ts}',
  ],
  // API-Test specific patterns to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/__tests__/api/mocks/', // Mocks ausschließen
    '<rootDir>/__tests__/api/utils/', // Test-Utilitys ausschließen
  ],
  transform: {
    '^.+\\.(js|ts)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  collectCoverageFrom: [
    'src/app/api/**/*.{js,ts}',
    '!src/app/api/**/*.d.ts',
    '!src/app/api/**/_*.{js,ts}',
    'src/lib/directus.ts',
    'src/lib/auth.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Verwenden Sie "silent" für Testausgabe ohne Konsolenprotokolle
  silent: process.env.DEBUG !== 'true',
  // Parallel-Tests für schnellere Ausführung
  maxWorkers: process.env.CI ? 2 : '50%',
  // Verbosity für klarere Testausgabe
  verbose: true,
};

// createJestConfig ist auf diese Weise exportiert, damit next/jest die Next.js-Konfiguration asynchron laden kann
module.exports = createJestConfig(customJestConfig);