# Deprecated Files Migration Plan

This document outlines the plan for migrating away from deprecated files and ensuring all imports use the correct paths after the recent refactoring to migrate to TypeScript and reorganize the codebase structure.

## Identified Deprecated Files

1. `/lib/utils.js` → Migrated to `/src/lib/utils.ts`
2. `/lib/directus-client.js` → Migrated to `/src/lib/api/directus-client.ts`
3. `/app/_components/DirectusConfig.js` → Migrated to `/src/components/common/DirectusConfig.tsx`

## Migration Strategy

### 1. Update `utils.js` References

The following files still import from the deprecated `lib/utils.js` file:

- `/src/components/ui/FeatureItem.tsx`
- `/src/components/ui/LoadingSpinner.tsx`
- `/src/components/ui/ContentBlock.tsx`
- `/src/components/journey-designer/TravelJourneyDesigner.tsx`
- `/src/components/forms/ClientContactForm.tsx`
- `/src/components/forms/ContactForm.tsx`
- `/src/components/chatbot/TravelAdvisor.tsx`
- `/src/components/hotels/HotelList.tsx`
- `/src/components/hotels/HotelModal.tsx`
- `/src/components/hotels/HotelFilters.tsx`

**Action:** Update all these imports to use the correct path:
```typescript
// Change from
import { cn } from '../../lib/utils';
// To
import { cn } from '../../lib/utils/index';
```

### 2. Update `directus-client.js` References

Various API routes and components are still importing from the old directus-client.js locations.

**Action:** Update the following import patterns:

- For `/app/` routes:
  ```typescript
  // Change from
  import { ... } from '../../../src/lib/directus-client';
  // To
  import { ... } from '../../../src/lib/api/directus-client';
  ```

- For `/src/app/` routes:
  ```typescript
  // Change from
  import { ... } from '../../../lib/directus-client';
  // To
  import { ... } from '../../../lib/api/directus-client';
  ```

- For components:
  ```typescript
  // Change from
  import { ... } from '../../lib/directus-client-browser';
  // To
  import { ... } from '../../lib/api/directus-client-browser';
  ```

### 3. Update Test Files

Test files have special mocking requirements and may require additional care when updating imports.

**Action:**
- Update all test mocks to point to the correct new locations
- Ensure Jest's `moduleNameMapper` in `jest.config.js` is updated to reflect the new paths

### 4. Remove Deprecated Files

After all references have been updated and tests pass:

1. Run a build (`npm run build`) to ensure no runtime errors
2. Run tests (`npm test`) to ensure all tests pass
3. Remove the following deprecated files:
   - `/lib/utils.js`
   - `/lib/directus-client.js`
   - `/app/_components/DirectusConfig.js`

## Execution Plan

1. Use the `MultiEdit` tool to perform batch updates on the files with deprecated imports
2. Update the `jest.config.js` moduleNameMapper configuration if needed
3. Run tests and build to verify changes
4. Remove deprecated files after successful testing

## Considerations

- The re-export files (`lib/utils.js` and `lib/directus-client.js`) should be kept temporarily as compatibility layers until all imports are updated.
- When removing them, ensure a full project build and test suite passes to verify no references remain.
- Document the new import patterns in the project documentation to ensure future development follows the correct patterns.