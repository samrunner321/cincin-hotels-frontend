# End-to-End Tests for CinCin Hotels

This directory contains end-to-end tests for the CinCin Hotels website using Playwright.

## Directory Structure

```
e2e-tests/
├── accessibility/            # Accessibility (a11y) tests 
├── utils/                    # Common test utilities
├── homepage.spec.ts          # Homepage tests
├── hotels-search.spec.ts     # Hotel search functionality tests
├── hotel-detail.spec.ts      # Hotel detail page tests
├── language-switching.spec.ts # Internationalization tests
├── responsive-design.spec.ts  # Responsive layout tests
└── README.md                 # This file
```

## Running Tests

### All Tests

```bash
npm run test:e2e
```

### Specific Test Groups

```bash
# Run accessibility tests
npm run test:a11y

# Run accessibility tests on all browsers
npm run test:a11y:all

# Run accessibility tests for CI
npm run test:a11y:ci

# Run visual regression tests
npm run test:e2e:visual

# Run all tests (component, e2e, and a11y)
npm run test:all
```

### Development Mode

```bash
# Run tests with UI
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug
```

### View Reports

```bash
# View test reports
npm run test:e2e:report

# View accessibility test reports
npm run test:a11y:report
```

## Test Configuration

Tests are configured in `playwright.config.ts` in the project root.

## Adding New Tests

- Create new test files following the `.spec.ts` naming convention
- Use the utility functions in `utils/` for common operations
- For accessibility tests, add new files to the `accessibility/` directory with the `.a11y.spec.ts` suffix
- See the README in each subdirectory for more specific guidance

## Continuous Integration

Tests run automatically on:
- Pull requests
- Merges to main branch

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Accessibility Testing Documentation](./accessibility/README.md)