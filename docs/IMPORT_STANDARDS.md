# Import Path Standards for CinCin Hotels

This document defines the standard import paths to use throughout the CinCin Hotels project. Following these standards ensures code consistency and makes the codebase easier to navigate and maintain.

## Path Aliases

The following path aliases are configured in `jsconfig.json` and should be used instead of relative paths when appropriate:

| Alias | Path | Use For |
|-------|------|--------|
| `@/*` | `./src/*` | General imports from the src directory |
| `@app/*` | `./src/app/*` | Next.js App Router pages and layouts |
| `@components/*` | `./src/components/*` | React components |
| `@lib/*` | `./src/lib/*` | Utility functions and services |
| `@hooks/*` | `./src/hooks/*` | React hooks |
| `@types/*` | `./src/types/*` | TypeScript types and interfaces |
| `@public/*` | `./public/*` | Public assets |

## Import Guidelines

### When to Use Aliases vs. Relative Paths

**Use path aliases for:**
- Imports across different directories
- Imports from the src directory to project root
- Any import that would require more than two parent directory references (`../../`)

**Use relative paths for:**
- Imports within the same directory
- Imports from adjacent directories
- Files that are closely related functionally

### Examples

**Correct Usage:**

```javascript
// Using path aliases for imports across different areas
import { Button } from '@components/ui/Button';
import { fetchData } from '@lib/api';
import { useAuth } from '@hooks/useAuth';
import { UserType } from '@types/user';

// Using relative paths for closely related files
import { helper } from './helper';
import { Card } from '../Card';
```

**Incorrect Usage:**

```javascript
// Don't use relative paths for distant imports
import { Button } from '../../../components/ui/Button';

// Don't use inconsistent aliases
import { fetchData } from '@/src/lib/api';

// Don't mix styles unnecessarily
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '../../types/user';
```

## Import Order

Organize imports in the following order:

1. React and Next.js imports
2. Third-party library imports
3. Path alias imports (sorted by alias name)
4. Relative imports
5. Asset imports (CSS, images, etc.)

```javascript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// 2. Third-party library imports
import { motion } from 'framer-motion';
import clsx from 'clsx';

// 3. Path alias imports (sorted by alias name)
import { Page } from '@app/types';
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { fetchData } from '@lib/api';

// 4. Relative imports
import { helper } from './helper';
import { Card } from '../Card';

// 5. Asset imports
import styles from './Component.module.css';
import logo from '../../public/logo.svg';
```

## Standardization Script

A standardization script is available to help convert existing imports to follow these standards:

```
node scripts/standardize-imports.js
```

This script will automatically fix common import path issues throughout the codebase.

## ESLint Rules

ESLint is configured to enforce these import standards. If your imports don't follow the rules, ESLint will show warnings or errors depending on the configuration.

The most important rules include:

- `import/order`: Enforces the order of import statements
- `no-restricted-imports`: Prevents imports from specific paths (e.g., `@/src/*`)
- `import/no-unresolved`: Ensures all imports point to resolvable modules

## Migrating Legacy Imports

When migrating code from the legacy structure:

1. Replace all `@/src/*` imports with `@/*`
2. Use the appropriate alias for the module type
3. For deeply nested relative imports, convert to path aliases

## Conclusion

By following these import standards, we can maintain a clean and consistent codebase that is easier to navigate and maintain. If you have questions about specific cases, refer to the examples in this document or ask for clarification.
