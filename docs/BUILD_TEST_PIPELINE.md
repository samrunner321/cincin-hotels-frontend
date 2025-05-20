# CincinHotels Build Test Pipeline

This document describes the Express-based build test pipeline for the CincinHotels project.

## Overview

The build test pipeline provides a lightweight Express server that can be used to:

1. Validate the Next.js build output
2. Run tests against built assets
3. Provide health check and build information endpoints
4. Serve as a minimal production-like environment for testing

## Components

### 1. Express Test Server

Located at `scripts/build-test-server.js`, this Express server:

- Serves static assets from the Next.js build directory
- Provides API endpoints for health checks and build information
- Can be used to validate that the build is functioning correctly

### 2. Build Test Script

Located at `scripts/test-build.js`, this script:

- Starts the Express test server
- Tests the API endpoints
- Validates the server responses
- Reports success or failure

### 3. CI/CD Integration

The GitHub Actions workflow `.github/workflows/build-test.yml` integrates the build test into the CI/CD pipeline:

- Runs on push to main branch and pull requests
- Builds the Next.js application
- Runs the build tests
- Preserves build artifacts for further testing or deployment

## Usage

### Local Development

```bash
# Build the Next.js application and run tests
npm run build:test

# Start only the test server (requires a prior build)
npm run build:test:server

# Start the test server in production mode
npm run start:test
```

### Endpoints

The test server provides the following endpoints:

- `/api/health` - Health check endpoint returning server status
- `/api/build-info` - Information about the current build (git commit, build time, environment)
- `/api/test` - Simple test endpoint for validating the API functionality

### CI/CD Pipeline

The build test is automatically executed as part of the CI/CD pipeline. The workflow:

1. Checks out the code
2. Installs dependencies
3. Lints the code
4. Builds the Next.js application
5. Runs the build tests
6. Runs component and API tests
7. Caches build artifacts
8. Uploads build artifacts for potential deployment

## Extending the Pipeline

To add new tests to the build pipeline:

1. Add new endpoints to `build-test-server.js`
2. Add corresponding test cases to `test-build.js`
3. Update the GitHub Actions workflow if necessary

For specific build tests, you can add additional testing logic to the `test-build.js` script.

## Troubleshooting

If the build tests fail:

1. Check the console output for specific error messages
2. Verify that the Next.js build completed successfully
3. Ensure all required environment variables are set
4. Check that API responses match expected formats