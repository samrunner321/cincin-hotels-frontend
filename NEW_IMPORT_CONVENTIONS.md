# New Import Conventions for CinCin Hotels

## Overview

After the migration from JavaScript to TypeScript and the consolidation of components into the `/src` directory, we have standardized our import approach. This document outlines the new import conventions that all developers should follow.

## Import Path Guidelines

### 1. Use Relative Imports

All imports should use relative paths, not aliases. This provides better clarity, IDE support, and avoids any potential issues with path aliases during build or runtime.

#### Examples:

**✅ Correct approach:**
```typescript
// In src/components/hotels/HotelCard.tsx
import { Hotel } from '../../types/hotel';
import { formatCurrency } from '../../lib/utils'; 
import { useHotelNavigation } from '../../hooks/useHotelNavigation';
```

**❌ Avoid using aliases:**
```typescript
// In src/components/hotels/HotelCard.tsx
import { Hotel } from '@types/hotel';             // Don't use this
import { formatCurrency } from '@lib/utils';      // Don't use this
import { useHotelNavigation } from '@hooks/useHotelNavigation'; // Don't use this
```

### 2. Import Structure Guidelines

Follow these relative path conventions based on where your file is located:

#### For files in `/src/components/`:
- Import from other components: `from '../component-name'` or `from './component-name'`
- Import from hooks: `from '../../hooks/hook-name'`
- Import from types: `from '../../types/type-name'`
- Import from lib: `from '../../lib/lib-name'`
- Import from utils: `from '../../utils/util-name'`

#### For files in `/src/hooks/`:
- Import from components: `from '../components/component-name'`
- Import from other hooks: `from './hook-name'`
- Import from types: `from '../types/type-name'`
- Import from lib: `from '../lib/lib-name'`

#### For files in the root `/app/` directory:
- Import from src components: `from '../src/components/component-name'`
- Import from src hooks: `from '../src/hooks/hook-name'`
- Import from src lib: `from '../src/lib/lib-name'`
- Import from src types: `from '../src/types/type-name'`

### 3. Directory Structure Awareness

Be aware of how deep your file is within the directory structure:

- Use `../` to move up one directory level
- Use `../../` to move up two directory levels
- And so on...

Always check the file's location relative to the imported module before writing the import statement.

### 4. Import Ordering (Optional but Recommended)

For better readability, organize your imports in the following order:

1. React and framework imports (Next.js, etc.)
2. Third-party library imports
3. Project imports - organized by:
   - Components
   - Hooks
   - Types
   - Utils/Lib
4. CSS/SCSS imports 

### 5. Next.js Specifics

For Next.js-specific components and APIs, always use the proper import paths as specified in the Next.js documentation.

## Legacy Code Considerations

Some older parts of the codebase might still use alias imports. As part of our ongoing refactoring, these will be converted to follow the new convention. If you encounter any such imports, please update them to the new format when modifying those files.

## Benefits of This Approach

- Better IDE support for navigation and refactoring
- Clearer understanding of module dependencies
- No reliance on build configuration for import resolution
- More portable code between projects
- Reduced confusion with parallel directory structures