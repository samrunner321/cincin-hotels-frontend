# Import Migration Scripts

This directory contains scripts for systematically migrating from alias imports to relative imports and cleaning up the project structure.

## Scripts Overview

### Main Script

- `migrate-imports.js` - Orchestrates the entire migration process in three phases

### Phase 1: Finding and Fixing Alias Imports

- `find-alias-imports.js` - Scans the codebase for alias imports and generates a report
- `fix-alias-imports.js` - Fixes alias imports in a single file
- `batch-fix-imports.js` - Fixes alias imports in a directory or multiple files
- `document-import-changes.js` - Documents the changes made during migration

### Phase 2: Project Cleanup

- `prepare-cleanup.js` - Checks if the project is ready for cleanup
- `find-unused-assets.js` - Identifies unused assets in the project

## Usage Instructions

### Full Migration Process

To run the complete migration process:

```bash
node scripts/migrate-imports.js
```

This will guide you through all three phases with confirmation prompts.

### Individual Scripts

#### Find Alias Imports

```bash
node scripts/find-alias-imports.js
```

This generates a report of all files with alias imports.

#### Fix Alias Imports in a File

```bash
node scripts/fix-alias-imports.js path/to/file.ts
```

#### Batch Fix Imports in a Directory

```bash
node scripts/batch-fix-imports.js path/to/directory
```

#### Document Changes

```bash
node scripts/document-import-changes.js "Batch Name" [file1 file2 ...]
```

#### Prepare for Cleanup

```bash
node scripts/prepare-cleanup.js
```

#### Find Unused Assets

```bash
node scripts/find-unused-assets.js
```

## Migration Process

### Phase 1: Find and Fix Alias Imports

1. Identify all files with alias imports
2. Fix imports in batches, starting with core components and utilities
3. Document all changes
4. Test the build after each batch

### Phase 2: Project Cleanup

1. Verify no remaining imports from old directories
2. Remove old directories (components/, lib/)
3. Clean up unused assets
4. Remove empty directories

### Phase 3: Validation and Documentation

1. Run a full build to validate changes
2. Create import guidelines documentation
3. Update tsconfig.json if necessary

## Reports Generated

- `alias-imports-report.txt` - List of files with alias imports
- `IMPORT_MIGRATION_PROGRESS.md` - Progress of the migration
- `IMPORT_GUIDELINES.md` - Guidelines for import conventions
- `CLEANUP_REPORT.md` - Status of project cleanup
- `UNUSED_ASSETS_REPORT.md` - List of potentially unused assets