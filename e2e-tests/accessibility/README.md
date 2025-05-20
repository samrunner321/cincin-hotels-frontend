# Accessibility Testing for CinCin Hotels

This directory contains accessibility tests for the CinCin Hotels website. The tests use Playwright and axe-core to verify that the site meets WCAG accessibility guidelines.

## Directory Structure

```
e2e-tests/accessibility/
├── a11y-test-fixtures.ts   # Extended test fixtures for accessibility testing
├── axe-utils.ts            # Utilities for running axe and reporting results
├── config.ts               # Configuration for accessibility tests
├── components.a11y.spec.ts # Tests for individual components
├── homepage.a11y.spec.ts   # Tests for the homepage
├── hotels-page.a11y.spec.ts # Tests for the hotels listing page
├── user-flows.a11y.spec.ts # Tests for complete user flows
└── README.md               # This file
```

## Running the Tests

To run all accessibility tests:

```bash
npm run test:e2e -- --project=chromium --grep="a11y"
```

To run tests for a specific area:

```bash
npm run test:e2e -- --project=chromium -g "homepage.a11y"
```

## Test Approach

Our accessibility tests cover:

1. **Page-level tests**: Full-page scans for accessibility violations
2. **Component-level tests**: Testing specific UI components in isolation
3. **User flow tests**: Testing accessibility throughout common user journeys
4. **Keyboard navigation tests**: Ensuring the site is fully keyboard accessible
5. **Screen reader compatibility**: Using ARIA attributes correctly

## Test Configuration

The `config.ts` file contains settings for:

- Target WCAG compliance level (A, AA, AAA)
- Rules to exclude from testing (if necessary)
- Critical paths that must have zero violations
- Components to test individually
- User flows to test for accessibility

## Reporting

Test results are reported:

- In the console during test runs
- In the Playwright HTML report
- With screenshots of violations for visual debugging

## WCAG Coverage

These tests check for compliance with WCAG 2.1 AA standards, including:

- Text alternatives for non-text content
- Adapting content presentation
- Distinguishable content (contrast, resizing, etc.)
- Keyboard accessibility
- Navigation and input
- Error prevention and suggestion
- Parsing and compatibility

## Adding New Tests

When adding new accessibility tests:

1. For new pages, create a new `.a11y.spec.ts` file
2. For new components, add them to the `testComponents` array in `config.ts`
3. For new user flows, add them to the `userFlows` array in `config.ts`

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)