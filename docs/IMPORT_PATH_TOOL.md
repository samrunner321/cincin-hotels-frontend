# Import Path Updating Tool

This tool helps standardize import paths throughout the CinCin Hotels codebase according to our [import standards](./IMPORT_STANDARDS.md).

## What It Does

The tool automatically:

1. Converts `@/src/*` imports to the correct alias pattern (`@/*`)
2. Converts deep relative imports (with more than one `../`) to appropriate path aliases
3. Ensures imports follow our standards for cross-directory references
4. Generates a detailed report of all changes made

## Usage

Run the tool from the project root with:

```bash
node scripts/update-import-paths.js
```

## Features

- **Alias Path Standardization**: Converts all `@/src/*` imports to the proper `@/*` format
- **Deep Relative Path Detection**: Identifies and converts deep relative paths to use aliases
- **Directory-Specific Aliases**: Uses the correct aliases for specific directories:
  - `@components/*` for component imports
  - `@lib/*` for utility functions
  - `@hooks/*` for React hooks
  - `@types/*` for TypeScript types
  - `@app/*` for Next.js App Router components
  - `@public/*` for public assets
- **Detailed Reporting**: Provides a detailed report of all changes made, categorized by type

## Example Transformations

| Before | After |
|--------|-------|
| `import { Component } from '@/src/components/ui/Component'` | `import { Component } from '@components/ui/Component'` |
| `import { util } from '../../src/lib/util'` | `import { util } from '@lib/util'` |
| `import { useHook } from '../../../hooks/useHook'` | `import { useHook } from '@hooks/useHook'` |
| `import { Type } from '@/src/types/models'` | `import { Type } from '@types/models'` |

## When to Run This Tool

Run this tool:

1. After merging code from developers who might not follow the import standards
2. Before major pull requests to ensure consistent imports
3. As part of your regular code cleanup routine
4. After refactoring that involved moving files between directories

## Limitations

- The tool only processes JavaScript and TypeScript files (`.js`, `.jsx`, `.ts`, `.tsx`)
- Some complex imports or string interpolations in import statements might not be detected
- The tool doesn't modify imports that are already correctly formatted

## Integration with ESLint

For ongoing enforcement of import path standards, we recommend using the ESLint configuration specified in the Import Standards document. This tool complements ESLint by fixing existing issues, while ESLint prevents new issues from being introduced.