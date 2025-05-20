# Import Path Correction Plan

## Current State

The CinCin Hotels project has successfully migrated from JavaScript to TypeScript, with components moved from `/components` to `/src/components`. However, we still face issues with import paths:

1. The project uses alias imports that are causing problems with the build
2. There are inconsistent import patterns across files
3. Some imports still reference the old directory structure

## Alias Patterns Analysis

Based on our analysis of the codebase, these are the most commonly used alias patterns:

| Alias Pattern | Current Path | Files to Update | Priority |
|---------------|--------------|-----------------|----------|
| @components/* | ./components/* | ~42 | High |
| @src-lib/* | ./src/lib/* | ~33 | High |
| @/* | ./src/* | ~35 | Medium |
| @lib/* | ./lib/* | ~25 | Medium |
| @hooks/* | ./src/hooks/* | ~21 | Medium |
| @types/* | ./src/types/* | ~16 | Medium |
| @src-components/* | ./src/components/* | ~9 | Low |
| @app/* | ./src/app/* | ~1 | Low |
| @src-types/* | ./src/types/* | 0 | N/A |
| @public/* | ./public/* | 0 | N/A |

## Implementation Strategy

### 1. Preparation

- ✅ Increase Node.js memory limit in build script (`--max-old-space-size=8192`)
- ✅ Update tsconfig.json/jsconfig.json to standardize on a single pattern (only `@/` pointing to `./src/*`)

### 2. Systematic Import Correction

We'll follow these steps for each file:

1. Identify relative positions of imported and importing files
2. Replace alias imports with correct relative paths
3. Test the component/file after change
4. Commit changes in logical batches

### 3. Phased Implementation

#### Phase 1: High Priority (60-70 files)
- ✅ Update `@components/*` imports (43 files)
- ✅ Update `@src-lib/*` imports (33 files)

#### Phase 2: Medium Priority (80-90 files)
- ✅ Update `@/*` imports (27 files)
- ✅ Update `@lib/*` imports (23 files)
- ✅ Update `@hooks/*` imports (20 files)
- ✅ Update `@types/*` imports (15 files)

#### Phase 3: Low Priority and Cleanup (10-15 files)
- ✅ Update `@src-components/*` imports (9 files)
- ✅ Update `@app/*` imports (fixed fix-imports.js script)
- Remove any remaining unused alias patterns

### 4. Post-Update Tasks

- Verify all imports are working with a full application build
- Document the new import conventions for future development
- Remove old `/components` directory
- Clean up unused files and assets

## Example Transformations

### Replacing `@components/*`

**Before:**
```typescript
import HotelCard from '@components/hotels/HotelCard';
import CategoryBar from '@components/hotels/CategoryBar';
```

**After:**
```typescript
import HotelCard from '../../components/hotels/HotelCard';
import CategoryBar from '../../components/hotels/CategoryBar';
```

### Replacing `@hooks/*`

**Before:**
```typescript
import { useRtl } from '@hooks/useRtl';
```

**After:**
```typescript
import { useRtl } from '../hooks/useRtl';
```

### Replacing `@types/*`

**Before:**
```typescript
import { AnimationVariant } from '@types/advanced-ui';
```

**After:**
```typescript
import { AnimationVariant } from '../types/advanced-ui';
```

## Validation Steps

After each batch of changes:

1. Run `npm run lint` to check for import errors
2. Verify component functionality with relevant tests
3. Run a partial build to catch any immediate issues

After completing all changes:

1. Run a full application build with `npm run build`
2. Run the complete test suite
3. Manually verify key application functionality

## Timeline and Milestones

1. **Week 1**
   - Update high priority imports
   - Fix any critical issues identified

2. **Week 2**
   - Update medium priority imports
   - Begin cleanup of unused files

3. **Week 3**
   - Complete all remaining import updates
   - Finalize project structure
   - Document new conventions

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Circular dependencies | Refactor component structure to break cycles |
| Broken imports | Comprehensive testing after each batch |
| Performance issues | Monitor build times and optimize as needed |
| Inconsistent application | Establish clear standards for future development |

## Success Criteria

1. All alias imports replaced with appropriate relative imports
2. Successful full application build
3. All tests passing
4. Application functions correctly in all environments
5. Clear documentation for future development