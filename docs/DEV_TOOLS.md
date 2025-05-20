# Development Tools

This document describes the development tools available in the CinCin Hotels project for code maintenance and standardization.

## Import Path Standardization

We provide three tools to manage import paths in the codebase:

### 1. Import Path Update Tool

**Location:** `/scripts/update-import-paths.js`

**Purpose:** Standardizes import paths across the codebase according to our [import standards](./IMPORT_STANDARDS.md).

**Features:**
- Converts `@/src/*` imports to the correct alias pattern (`@/*`)
- Converts deep relative imports (with more than one `../`) to appropriate path aliases
- Ensures imports follow our standards for cross-directory references
- Generates a detailed report of all changes made

**Usage:**
```bash
# Run on all files
node scripts/update-import-paths.js

# Debug mode for a specific file
node scripts/update-import-paths.js --debug path/to/file.js

# Apply changes in debug mode
node scripts/update-import-paths.js --debug path/to/file.js --apply

# Debug but continue processing all files
node scripts/update-import-paths.js --debug path/to/file.js --continue
```

Read more in [IMPORT_PATH_TOOL.md](./IMPORT_PATH_TOOL.md).

### 2. Basic Import Standardization

**Location:** `/scripts/standardize-imports.js`

**Purpose:** Basic version of the import path update tool that focuses on alias normalization.

**Features:**
- Converts `@/src/*` imports to the correct alias pattern (`@/*`)
- Simpler implementation with fewer features than the advanced tool

**Usage:**
```bash
node scripts/standardize-imports.js
```

### 3. ESLint Configuration 

Our ESLint configuration includes rules to enforce the import standards during development.

Key rules:
- `import/order`: Enforces the order of import statements
- `no-restricted-imports`: Prevents imports from specific paths (e.g., `@/src/*`)
- `import/no-unresolved`: Ensures all imports point to resolvable modules

## TypeScript Conversion Tool

**Location:** `/scripts/convert-to-typescript.js`

**Purpose:** Helps convert JavaScript files to TypeScript.

**Features:**
- Converts .js/.jsx files to .ts/.tsx
- Preserves file content with minimal changes
- Generates basic type annotations

**Usage:**
```bash
# Convert a specific file
node scripts/convert-to-typescript.js path/to/file.js

# Convert a directory (recursive)
node scripts/convert-to-typescript.js --dir path/to/directory
```

## When to Use These Tools

- **Import Path Update Tool**: Use this before PRs or when you notice inconsistent imports
- **TypeScript Conversion**: When modernizing parts of the codebase
- **ESLint**: During active development to maintain standards

## Best Practices

1. Run the import standardization tool before submitting PRs
2. Use the debug mode to verify changes on critical files
3. Remember that these tools automate tasks but don't replace code review
4. Check the diffs of any automated changes

## Integration with Development Workflow

Consider adding these tools to your development workflow:

```bash
# Example pre-commit hook
npm run lint && node scripts/update-import-paths.js
```

## Further Resources

- [Import Standards](./IMPORT_STANDARDS.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [TypeScript Guidelines](./TYPESCRIPT.md)