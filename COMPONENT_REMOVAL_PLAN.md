# Component Removal Plan

This document outlines the plan for safely removing the old component files that have been migrated to TypeScript and relocated to the `/src/components` directory.

## Current Status

The migration of components from the root-level `/components` directory to `/src/components` has been completed. The git status shows that 79 component files have been deleted from the old location, and their TypeScript equivalents are now present in the new location.

## Verification Steps

Before fully committing to the removal, we need to verify that all references to these components have been updated.

### 1. Check for Remaining References

```bash
# Search for imports from the old components directory
grep -r "from 'components/" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .
grep -r "from '../components/" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .
grep -r "from '../../components/" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .
```

If any results are found, those files need to be updated to point to the new location.

### 2. Verify App Router Pages

Since the Next.js app router is particularly sensitive to imports, check that all pages under `/app/` are using the correct import paths:

```bash
# Check app router pages for old component imports
grep -r "from.*components/" --include="*.js" --include="*.jsx" app/
```

Any results will need to be updated to import from `/src/components/` instead.

### 3. Run Type Checking and Build

```bash
# Run TypeScript type checking
npm run typecheck

# Build the application
npm run build
```

These commands will verify that all imports are valid and the application can build successfully.

## Component Mapping

Below is a mapping of the old components to their new TypeScript equivalents:

| Old Component | New Component |
|---------------|---------------|
| `/components/chatbot/TravelAdvisor.jsx` | `/src/components/chatbot/TravelAdvisor.tsx` |
| `/components/common/ContentBlock.jsx` | `/src/components/common/ContentBlock.tsx` |
| `/components/common/PageHero.jsx` | `/src/components/common/PageHero.tsx` |
| `/components/destinations/Hero.jsx` | `/src/components/destinations/Hero.tsx` |
| `/components/destinations/RecommendedDestinations.jsx` | `/src/components/destinations/RecommendedDestinations.tsx` |
| ... (and many more) | ... |

## Clean Up Process

Once we've verified that all references have been updated and the application builds successfully:

1. **Create a Clean Up Branch**
   ```bash
   git checkout -b cleanup/old-components
   ```

2. **Commit Removal of Deprecated Component Files**
   ```bash
   git add -A
   git commit -m "Remove deprecated component files that have been migrated to TypeScript"
   ```

3. **Create a Pull Request**
   - Ensure the PR includes test results
   - Include a reference to this plan document
   - Request code review

4. **Update Documentation**
   - Update any documentation that may reference the old component paths
   - Add notes to the README about the new component organization

## Future Prevention

To prevent the accidental creation of components in the old location:

1. Add linting rules to enforce the use of the new component locations
2. Update the project README with clear guidelines for component placement
3. Consider adding a pre-commit hook to detect components being added to the old location

## Rollback Plan

If issues are discovered after the removal:

1. The deleted files can be restored from git history if needed
2. We can temporarily restore the deleted files and add re-exports to maintain backward compatibility