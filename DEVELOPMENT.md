# CinCin Hotels Development Guide

## Project Structure

CinCin Hotels is a Next.js project with a modern architecture:

```
/
├── app/                # Next.js App Router components
├── src/                # Main source code
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and services
│   └── types/          # TypeScript types and interfaces
├── public/             # Static assets
└── scripts/            # Development and utility scripts
```

## Development Tools

We've created several tools to help maintain code quality and consistency:

1. **Import Path Standardization Tool** - `/scripts/update-import-paths.js`
   Ensures consistent import paths across the codebase

2. **TypeScript Conversion Tool** - `/scripts/convert-to-typescript.js`
   Helps convert JavaScript files to TypeScript

For detailed documentation on these tools, see [Development Tools](./docs/DEV_TOOLS.md).

## Import Standards

We now use relative imports to maintain clean and consistent imports:

```javascript
// Correct usage (relative imports)
import { Button } from '../components/ui/Button';
import { fetchData } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

// Deprecated usage (alias paths)
import { Button } from '@components/ui/Button';
import { fetchData } from '@lib/api';
import { useAuth } from '@hooks/useAuth';
```

While alias paths are configured in tsconfig.json, we are migrating to relative imports for better IDE support and build consistency.

> **Note:** If the relative path becomes too deep (more than 3 levels), consider restructuring components or adding intermediate index.ts files.

For migration details, see [Import Migration](./IMPORT_GUIDELINES.md).

Full details in [Import Standards](./docs/IMPORT_STANDARDS.md).

## Development Workflow

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Run linting: `npm run lint`
5. Build for production: `npm run build`

## Recommended Development Practices

1. Use the import standards for all new code
2. Run the import standardization tool before commits
3. Write unit tests for new functionality
4. Ensure compatibility with our supported browsers

## Documentation

- [Import Standards](./docs/IMPORT_STANDARDS.md)
- [Development Tools](./docs/DEV_TOOLS.md)
- [API Documentation](./docs/API.md)
- [Component Standards](./docs/COMPONENTS.md)

## Troubleshooting

Common issues and their solutions:

1. **Imports not resolving correctly**
   - Check your jsconfig.json or tsconfig.json file
   - Run the import standardization tool

2. **Development server crashes**
   - Check for syntax errors in your code
   - Verify that all required environment variables are set