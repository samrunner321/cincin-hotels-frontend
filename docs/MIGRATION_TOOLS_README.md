# CinCin Hotels Migration Tools

This directory contains tools developed for the systematic migration of the CinCin Hotels project from JavaScript to TypeScript, and consolidation of the project structure.

## Available Tools

### 1. Component Inventory Tool

```bash
node scripts/create-component-inventory.js
```

Creates a comprehensive inventory of all React components in the project, analyzing their complexity, dependencies, and categorizing them. This tool generates:

- `component-inventory.json`: Detailed metadata about each component
- `component-relationships.md`: Visualization of component relationships
- `migration-roadmap.json`: Recommended migration batches

**Features:**
- Batch processing to avoid memory issues
- Complexity scoring
- Dependency mapping
- Category detection
- Migration priority calculation

### 2. Batch Migration Tool

```bash
# Show available batches
node scripts/batch-migrate.js

# Migrate a specific batch
node scripts/batch-migrate.js <batch-number> [options]
```

Migrates a batch of components from `/components` to `/src/components`, converting them to TypeScript and standardizing import paths.

**Options:**
- `--dry-run`: Run without making actual changes
- `--verbose`: Show detailed output
- `--skip-existing`: Skip already migrated components
- `--force`: Force migration even if verification fails
- `--memory=<MB>`: Set memory limit (default: 8192)

### 3. Migration Tools Wrapper

```bash
node scripts/migration-tools.js <command> [args] [options]
```

A unified interface for all migration tools with optimized memory allocation.

**Commands:**
- `analyze <pattern>`: Analyze components matching the pattern
- `convert <pattern>`: Convert components to TypeScript
- `info`: Show system information
- `clean-cache`: Clean up cache files

**Options:**
- `--memory=<MB>`: Memory limit in MB (default: 8192)
- `--batch-size=<number>`: Batch size for processing
- `--concurrency=<number>`: Number of parallel workers
- `--output-dir=<path>`: Output directory
- `--summary`: Generate summary report
- And more...

### 4. Optimized Analysis and Conversion Tools

Located in `migration-tools/`:

- `analyzeComponent.optimized.js`: Memory-optimized component analysis
- `convertToTypeScript.optimized.js`: Memory-optimized TypeScript conversion

These optimized tools use:
- Batch processing
- Worker threads
- Streaming-based processing
- Explicit garbage collection
- Checkpoints for incremental processing

## Usage Examples

### Analyzing Components

```bash
# Analyze a single component
node scripts/migration-tools.js analyze components/hotels/HotelCard.js

# Analyze all components in a directory
node scripts/migration-tools.js analyze "components/hotels/*.jsx" --summary

# Analyze with increased memory (for large codebases)
node scripts/migration-tools.js analyze "components/**/*.{js,jsx}" --memory=12288
```

### Converting Components to TypeScript

```bash
# Convert a single component
node scripts/migration-tools.js convert components/hotels/HotelCard.js

# Convert multiple components
node scripts/migration-tools.js convert "components/forms/*.jsx" --output-dir=src/components/forms

# Convert with checkpoint (for handling failures)
node scripts/migration-tools.js convert "components/**/*.jsx" --checkpoint
```

### Batch Migration

```bash
# View available batches
node scripts/batch-migrate.js

# Dry run a batch
node scripts/batch-migrate.js 3 --dry-run

# Migrate a batch
node scripts/batch-migrate.js 3 --skip-existing

# Migrate a large batch with more memory
node scripts/batch-migrate.js 6 --memory=12288 --verbose
```

## Design Principles

These tools were designed with the following principles in mind:

1. **Memory Efficiency**: Able to process large codebases without running out of memory
2. **Batch Processing**: Breaking down work into manageable chunks
3. **Incremental Progress**: Supporting checkpoint-based processing for long-running tasks
4. **Minimal Dependencies**: Limited to essential packages
5. **Error Resilience**: Recovering from and reporting errors without crashing
6. **Developer Experience**: Clear progress indicators and helpful output

## Troubleshooting

### Memory Issues

If you encounter memory errors:

1. Increase the memory allocation: `--memory=12288` or higher
2. Reduce batch size: `--batch-size=5`
3. Process smaller subsets of files

### TypeScript Conversion Issues

If the TypeScript conversion produces incorrect results:

1. Use `--verbose` to see detailed output
2. Try the `--dry-run` option to test without making changes
3. For complex components, consider manual conversion

### Dependency Mapping Problems

If dependency detection isn't working correctly:

1. Re-run the component inventory tool
2. Check the generated `component-relationships.md` file
3. Manually verify dependencies for critical components

## Contributing

When modifying these tools:

1. Keep memory optimization in mind
2. Test with both small and large components
3. Ensure backward compatibility
4. Document any new options or features

## License

These tools are for internal use in the CinCin Hotels project.