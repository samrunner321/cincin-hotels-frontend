# Import Path Correction Tool

This tool helps automate the process of converting alias imports (like `@components/...`) to proper relative imports (like `../../components/...`) in the CinCin Hotels project.

## Features

- Converts alias imports to proper relative paths
- Handles different file extensions (.ts, .tsx, .js, .jsx)
- Provides a dry-run option to preview changes without applying them
- Supports targeting specific alias patterns
- Processes files individually or in batches
- Detailed reporting of changes

## Supported Alias Patterns

The tool supports the following alias patterns:

- `@components/*` → `./components/*`
- `@src-components/*` → `./src/components/*`
- `@lib/*` → `./lib/*`
- `@src-lib/*` → `./src/lib/*`
- `@hooks/*` → `./src/hooks/*`
- `@types/*` → `./src/types/*`
- `@src-types/*` → `./src/types/*`
- `@app/*` → `./src/app/*`
- `@public/*` → `./public/*`
- `@/*` → `./src/*`

## Usage

The script is available as an npm command via package.json scripts:

```bash
# Process all files, making changes
npm run fix-imports

# Show changes without modifying files (dry run)
npm run fix-imports:dry

# Only process @components imports 
npm run fix-imports:components

# Process a single file
npm run fix-imports:single path/to/file.tsx
```

### Command Line Options

You can also run the script directly with custom options:

```bash
# Full usage
node scripts/fix-alias-imports-enhanced.js [options]

# Available options
Options:
  -d, --dry-run             Show changes without modifying files
  -p, --pattern <string>    Only process imports matching specific alias pattern (e.g. @components)
  -e, --extensions <string> File extensions to process (comma-separated) (default: "js,jsx,ts,tsx")
  -i, --include <glob>      Directory/file pattern to include (default: "**/*.{js,jsx,ts,tsx}")
  -x, --exclude <glob>      Directory/file pattern to exclude (default: "node_modules/**,**/node_modules/**,dist/**,build/**")
  -s, --single <file>       Process a single file
  -l, --list-aliases        List all available alias mappings
  -V, --version             Output the version number
  -h, --help                Display help for command
```

### Examples

```bash
# Process all files, but only show what would be changed
node scripts/fix-alias-imports-enhanced.js --dry-run

# Only process TypeScript files containing @hooks imports
node scripts/fix-alias-imports-enhanced.js --pattern @hooks --extensions ts,tsx

# Process only files in the src/components directory
node scripts/fix-alias-imports-enhanced.js --include "src/components/**/*.tsx"

# Exclude test files
node scripts/fix-alias-imports-enhanced.js --exclude "**/__tests__/**,**/*.test.*"

# List all available alias mappings
node scripts/fix-alias-imports-enhanced.js --list-aliases

# Process a single file
node scripts/fix-alias-imports-enhanced.js --single src/components/hotels/HotelCard.tsx
```

## How It Works

1. The script searches for import statements in your files that start with the configured alias patterns.
2. For each matching import, it:
   - Determines which alias pattern is being used
   - Calculates the correct relative path from the file to the target import
   - Updates the import statement to use the relative path
3. The script reports all changes being made
4. In non-dry-run mode, it writes the changes back to the files

## Notes

- The script will automatically add `./` to relative paths when needed
- It handles both single and double quote imports
- Windows backslashes are converted to forward slashes for imports
- The tool will skip files or directories specified in the exclude pattern
- By default, it processes .js, .jsx, .ts, and .tsx files

## Troubleshooting

If you encounter any issues:

1. Try running in dry-run mode first to preview changes
2. Use the `--single` option to process one file at a time
3. Check that the alias patterns match those in your jsconfig.json or tsconfig.json
4. Make sure the file paths are correct relative to the project root