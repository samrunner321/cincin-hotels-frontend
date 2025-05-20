# App Router Migration Plan

This document outlines the plan for migrating the remaining old App Router files from `/app` to `/src/app` and ensuring a smooth transition to TypeScript.

## Current Status

The migration has been partially completed. Several pages have already been migrated to TypeScript and moved to `/src/app`, but many pages remain in the original `/app` directory with JavaScript extensions.

## Files to Migrate

The following files need to be migrated from JavaScript to TypeScript and moved to the `/src/app` structure:

### Page Routes

| Old Path | New Path |
|----------|----------|
| `/app/about/page.js` | `/src/app/about/page.tsx` |
| `/app/careers/page.js` | `/src/app/careers/page.tsx` |
| `/app/categories/[slug]/page.js` | `/src/app/categories/[slug]/page.tsx` |
| `/app/contact/page.js` | `/src/app/contact/page.tsx` |
| `/app/cookies/page.js` | `/src/app/cookies/page.tsx` |
| `/app/debug/page.js` | `/src/app/debug/page.tsx` |
| `/app/destinations/[slug]/page.js` | `/src/app/destinations/[slug]/page.tsx` |
| `/app/destinations/page.js` | `/src/app/destinations/page.tsx` |
| `/app/hotels/[slug]/page.js` | `/src/app/hotels/[slug]/page.tsx` |
| `/app/hotels/[slug]/rooms/page.js` | `/src/app/hotels/[slug]/rooms/page.tsx` |
| `/app/hotels/page.js` | `/src/app/hotels/page.tsx` |
| `/app/imprint/page.js` | `/src/app/imprint/page.tsx` |
| `/app/journal-preview/[slug]/page.js` | `/src/app/journal-preview/[slug]/page.tsx` |
| `/app/journal/[slug]/page.js` | `/src/app/journal/[slug]/page.tsx` |
| `/app/journal/page.js` | `/src/app/journal/page.tsx` |
| `/app/membership/page.js` | `/src/app/membership/page.tsx` |
| `/app/partner/page.js` | `/src/app/partner/page.tsx` |
| `/app/press/page.js` | `/src/app/press/page.tsx` |
| `/app/privacy/page.js` | `/src/app/privacy/page.tsx` |
| `/app/terms/page.js` | `/src/app/terms/page.tsx` |

### Layout Files

| Old Path | New Path |
|----------|----------|
| `/app/layout.js` | `/src/app/layout.tsx` |
| `/app/hotels/[slug]/layout.js` | `/src/app/hotels/[slug]/layout.tsx` |

### Special Files

| Old Path | New Path |
|----------|----------|
| `/app/error.js` | `/src/app/error.tsx` |
| `/app/loading.js` | `/src/app/loading.tsx` |
| `/app/not-found.js` | `/src/app/not-found.tsx` |

### API Routes

| Old Path | New Path |
|----------|----------|
| `/app/api/categories/[slug]/route.js` | `/src/app/api/categories/[slug]/route.ts` |
| `/app/api/pages/[slug]/route.js` | `/src/app/api/pages/[slug]/route.ts` |
| `/app/api/rooms/[hotelId]/route.js` | `/src/app/api/rooms/[hotelId]/route.ts` |
| `/app/api/membership/route.js` | `/src/app/api/membership/route.ts` |

### Component Files

| Old Path | New Path |
|----------|----------|
| `/app/_components/ClientProvider.jsx` | `/src/components/providers/ClientProvider.tsx` |
| `/app/_components/DirectusConfig.js` | `/src/components/common/DirectusConfig.tsx` |
| `/app/_components/UIStateProvider.jsx` | `/src/components/providers/UIStateProvider.tsx` |

## Migration Process

For each file, the migration process will follow these steps:

1. **Create TypeScript Version**
   - Convert JavaScript/JSX to TypeScript/TSX
   - Add appropriate type definitions
   - Fix any type errors

2. **Update Imports**
   - Update all import paths to use the new structure
   - Replace any `@` alias imports with proper relative imports

3. **Test Functionality**
   - Verify the page renders correctly
   - Check for any runtime errors

4. **Clean Up**
   - Remove the old file once migration is confirmed working

## Migration Strategy

To minimize risk, we'll migrate files in batches by related functionality:

1. **Batch 1: Simple Content Pages**
   - about, careers, cookies, imprint, partner, press, privacy, terms

2. **Batch 2: Special Pages**
   - error, loading, not-found

3. **Batch 3: Layout Files**
   - layout.js, hotels/[slug]/layout.js

4. **Batch 4: Complex Pages**
   - hotels, destinations, categories, journal

5. **Batch 5: API Routes**
   - All API routes

## TypeScript Conversion Guidelines

When converting files to TypeScript:

1. **Client vs. Server Components**
   - Add `'use client'` directive for client components
   - Ensure server components don't import client-only libraries

2. **Component Props**
   - Define interfaces for component props
   - Use React's built-in types (React.FC, etc.) where appropriate

3. **Data Fetching**
   - Add proper types for API responses
   - Handle Promise return types for data fetching functions

4. **Event Handlers**
   - Add types for event objects (React.MouseEvent, etc.)
   - Type callbacks appropriately

## Testing Strategy

1. **Incremental Testing**
   - Test each migrated page individually before proceeding to the next
   - Verify all interactive elements work as expected

2. **Type Checking**
   - Regularly run `npm run typecheck` to ensure type correctness

3. **Build Testing**
   - Run `npm run build` after each batch to verify no build-time errors

4. **Visual Regression Testing**
   - Compare screenshots of the page before and after migration

## Next.js Configuration

Once all files are migrated, update the Next.js configuration to reflect the new structure:

1. **Update next.config.js**
   - Point page and API routes to the new src directory

2. **Update tsconfig.json**
   - Ensure all paths are correctly configured

## Migration Progress Tracking

A separate document will track the status of each file's migration, including:

- Migration status
- Type issues
- Runtime issues
- Testing status

## Rollback Plan

If issues are discovered during or after migration:

1. Keep the old files temporarily until confident in the migration
2. Be prepared to revert to the old page structure if critical issues arise
3. Consider using feature flags to gradually roll out migrated pages