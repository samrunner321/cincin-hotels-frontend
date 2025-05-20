# API Testing Strategy for CinCin Hotels

This directory contains tests for the CinCin Hotels API endpoints, with a particular focus on hotel-related data. The testing approach combines reference tests against the real Directus API and comprehensive mock tests using Mock Service Worker (MSW).

## Testing Philosophy

Our testing approach follows these principles:

1. **Real API Reference Tests**: Run tests against the actual Directus API to verify integration and data structure.
2. **Comprehensive Mock Tests**: Use MSW to test edge cases, error handling, and performance without requiring the real API.
3. **Type Safety**: Leverage TypeScript for strict type checking in tests.
4. **Test Isolation**: Ensure tests don't affect each other and can run independently.

## Test Structure

The test suite is organized into these main components:

### 1. Data Extraction and Mocks

- `export-directus-data.js`: Script to extract real hotel data from Directus.
- `hotel-mocks.ts`: Extended mock data for tests, including edge cases.

### 2. Reference Tests

- `hotel-api-reference.test.ts`: Tests that run against the real Directus API.
  - Basic endpoint verification
  - Data structure validation
  - Relationship loading verification

### 3. Mock Tests

- `hotel-api.test.ts`: Comprehensive mock tests using MSW.
  - List view tests (filtering, sorting, pagination)
  - Detail view tests (hotel by slug/ID)
  - Error handling tests
  - Performance and caching tests

### 4. Test Utilities

- `hotel-test-utils.ts`: Helper functions for validating hotel data.
- `mocks/handlers/hotel-handlers.ts`: MSW handlers for intercepting API requests.
- `mocks/server.ts`: MSW server setup for tests.

## Running Tests

```bash
# Install dependencies
npm install

# Extract data from Directus (optional, as mock data is already provided)
npm run export-directus-data

# Run all API tests
npm run test:api

# Run only reference tests (requires Directus connection)
npm run test:api:reference

# Run only mock tests (no Directus required)
npm run test:api:mock

# Run tests in watch mode
npm run test:api:watch
```

## Key Files

- `__tests__/api/hotel-api-reference.test.ts`: Reference tests against real API
- `__tests__/api/hotel-api.test.ts`: Comprehensive mock tests
- `__tests__/api/mocks/hotel-mocks.ts`: Mock data for tests
- `__tests__/api/utils/hotel-test-utils.ts`: Test helpers and utilities
- `__tests__/api/mocks/handlers/hotel-handlers.ts`: MSW handlers
- `__tests__/api/mocks/server.ts`: MSW server setup
- `scripts/export-directus-data.js`: Data extraction script

## Edge Cases Covered

The mock tests cover various edge cases including:

- Hotels with missing images
- Hotels with no rooms
- Hotels with no categories
- Hotels with minimal data
- Hotels with very high prices
- Hotels with invalid data formats
- Draft status hotels (should be filtered out)

## Performance and Error Scenarios

The tests also cover:

- Caching behavior
- Concurrent requests
- Server timeouts
- Rate limiting errors
- Server errors

## Extending Tests

To add tests for new API endpoints:

1. Update the data extraction script to include any new data types.
2. Create mock data for the new endpoints in the mocks directory.
3. Implement MSW handlers for the new endpoints.
4. Add reference tests for basic functionality.
5. Add comprehensive mock tests for all scenarios.

## Best Practices

- Always run the mock tests before pushing changes.
- Only run reference tests if you have a valid Directus instance.
- Keep mock data up-to-date with the real API structure.
- Add tests for any new API endpoints or features.
- Test both happy paths and error scenarios.