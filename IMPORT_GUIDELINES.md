# Import Path Guidelines

## Introduction

This document outlines the import path conventions for the CinCin Hotels project. We are migrating from alias-based imports to relative imports for better consistency and IDE support.

## Import Path Conventions

### Relative Imports (Preferred)

We use relative imports throughout the codebase for consistency and reliability:

```javascript
// Good - Using relative imports
import { Button } from '../components/ui/Button';
import { useForm } from '../../hooks/useForm';
```

### Path Aliases (Deprecated)

While path aliases are configured in tsconfig.json/jsconfig.json, we are moving away from their use:

```javascript
// Deprecated - Using path aliases
import { Button } from '@components/ui/Button';
import { useForm } from '@hooks/useForm';
```

## Benefits of Relative Imports

1. **IDE Support**: Better autocomplete and navigation in most IDEs
2. **Build Consistency**: Fewer configuration issues across different build tools
3. **Clarity**: Explicit relationship between importing and imported files
4. **Portability**: Code is more portable between different projects

## Directory Structure

Our primary source code is organized under the `src/` directory:

- `src/components/`: UI components organized by feature or type
- `src/hooks/`: React hooks for shared logic
- `src/lib/`: Utility functions and libraries
- `src/types/`: TypeScript type definitions
- `src/app/`: Next.js app router pages and layouts

## Import Best Practices

1. Use relative imports for all internal project imports
2. For deep imports with many path segments (../../../../../../), consider restructuring components
3. Group imports by:
   - External dependencies
   - Internal components/utilities
   - Types
   - Styles

## Example

```javascript
// External dependencies
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Internal components/utilities
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/date-helpers';

// Types
import { HotelData } from '../../types/hotel';

// Styles
import '../styles/HotelCard.css';
```

## Migration Status

We are in the process of systematically migrating all alias imports to relative imports. See [IMPORT_MIGRATION_PROGRESS.md](./IMPORT_MIGRATION_PROGRESS.md) for the current status.

## Handling Deep Imports

For cases where relative imports would result in many "../../../" segments:

1. **Preferred**: Use intermediate index.ts files:

```javascript
// src/components/ui/index.ts
export * from './Button';
export * from './Card';
export * from './Input';

// Then in your component
import { Button, Card, Input } from '../components/ui';
```

2. **Alternative**: Consider restructuring your components to reduce nesting depth

## IDE Configuration

Most modern IDEs work better with relative imports. If you encounter any issues:

1. **VS Code**: Make sure TypeScript IntelliSense is enabled
2. **WebStorm/IntelliJ**: Relative imports are well-supported by default
3. **Vim/Neovim with LSP**: Works well with relative imports via tsserver