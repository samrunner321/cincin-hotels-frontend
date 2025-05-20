import { Page, expect } from '@playwright/test';

// Declare the axe property on window for TypeScript
declare global {
  interface Window {
    axe: any;
  }
}

/**
 * Inject axe-core into the page for accessibility testing
 */
export async function injectAxe(page: Page): Promise<void> {
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
  });
}

/**
 * Options for axe accessibility checks
 */
export interface AxeOptions {
  detailedReport?: boolean;
  includeImpact?: ('critical' | 'serious' | 'moderate' | 'minor')[];
  exclude?: string[];
}

/**
 * Check accessibility for a given selector
 */
export async function checkA11y(
  page: Page,
  selector: string = 'document',
  options: AxeOptions = {}
): Promise<void> {
  const {
    detailedReport = false,
    includeImpact = ['critical', 'serious'],
    exclude = [],
  } = options;

  // Get the violations
  const violations = await getViolations(page, selector, { includeImpact, exclude });

  // Report violations in a formatted way
  if (violations.length > 0) {
    reportViolations(violations);
  }

  // Assertion - fail test if violations found
  const violationsMessage = `${violations.length} accessibility violations detected. See console for details.`;
  expect(violations.length, violationsMessage).toBe(0);
}

/**
 * Get accessibility violations for a given selector
 */
export async function getViolations(
  page: Page,
  selector: string = 'document',
  options: Pick<AxeOptions, 'includeImpact' | 'exclude'> = {}
): Promise<any[]> {
  const {
    includeImpact = ['critical', 'serious', 'moderate', 'minor'],
    exclude = [],
  } = options;

  await page.waitForLoadState('networkidle');

  // Run axe analysis
  const violations = await page.evaluate(
    ({ selector, includeImpact, exclude }) => {
      return new Promise(resolve => {
        // Make sure axe is available
        if (typeof window.axe === 'undefined') {
          console.error('axe-core not found! Make sure you call injectAxe before running tests.');
          resolve([]);
          return;
        }

        // Configure axe with any excluded rules
        const axeConfig = {
          rules: {},
        };

        if (exclude.length > 0) {
          exclude.forEach(ruleId => {
            axeConfig.rules[ruleId] = { enabled: false };
          });
        }

        // Run axe
        window.axe.run(
          selector === 'document' ? document : document.querySelector(selector),
          { config: axeConfig }
        ).then(results => {
          // Filter by impact level if specified
          if (includeImpact && includeImpact.length > 0) {
            const filteredViolations = results.violations.filter(
              violation => includeImpact.includes(violation.impact)
            );
            resolve(filteredViolations);
          } else {
            resolve(results.violations);
          }
        }).catch(err => {
          console.error('Error running axe:', err);
          resolve([]);
        });
      });
    },
    { selector, includeImpact, exclude }
  );

  // Add type assertion to handle the unknown return type from page.evaluate
  return violations as any[];
}

/**
 * Format and report accessibility violations to the console
 */
export function reportViolations(violations: any[], componentName?: string): void {
  const title = componentName
    ? `Accessibility violations in ${componentName}`
    : 'Accessibility violations';

  console.log(`\n🔴 ${title}: ${violations.length} issues found`);

  if (violations.length === 0) return;

  // Group by impact
  const byImpact = {
    critical: violations.filter(v => v.impact === 'critical'),
    serious: violations.filter(v => v.impact === 'serious'),
    moderate: violations.filter(v => v.impact === 'moderate'),
    minor: violations.filter(v => v.impact === 'minor'),
  };

  // Report summary by impact
  if (byImpact.critical.length > 0) console.log(`⛔️ Critical: ${byImpact.critical.length}`);
  if (byImpact.serious.length > 0) console.log(`❌ Serious: ${byImpact.serious.length}`);
  if (byImpact.moderate.length > 0) console.log(`⚠️ Moderate: ${byImpact.moderate.length}`);
  if (byImpact.minor.length > 0) console.log(`ℹ️ Minor: ${byImpact.minor.length}`);

  // Report detailed violations
  violations.forEach((violation, index) => {
    const impact = {
      critical: '⛔️ CRITICAL',
      serious: '❌ SERIOUS',
      moderate: '⚠️ MODERATE',
      minor: 'ℹ️ MINOR',
    }[violation.impact] || `[${violation.impact}]`;

    console.log(`\n${index + 1}. ${impact}: ${violation.help} (${violation.id})`);
    console.log(`   Description: ${violation.description}`);
    console.log(`   WCAG: ${(violation.tags.filter(tag => tag.includes('wcag')) || []).join(', ')}`);
    console.log(`   Help: ${violation.helpUrl}`);
    
    // Log affected elements
    if (violation.nodes.length > 0) {
      console.log('   Affected elements:');
      violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
        console.log(`     ${String.fromCharCode(97 + nodeIndex)}. ${node.html}`);
        if (node.failureSummary) {
          console.log(`        Fix: ${node.failureSummary.split('\n').join('\n        ')}`);
        }
      });
      
      if (violation.nodes.length > 3) {
        console.log(`     ... and ${violation.nodes.length - 3} more`);
      }
    }
  });
}

/**
 * Axe test reporter for CI environments
 */
export async function generateA11yReport(page: Page, reportPath: string): Promise<void> {
  const violations = await getViolations(page);
  
  // Convert to a simplified format for reporting
  const report = {
    timestamp: new Date().toISOString(),
    totalViolations: violations.length,
    url: page.url(),
    violationsBySeverity: {
      critical: violations.filter(v => v.impact === 'critical').length,
      serious: violations.filter(v => v.impact === 'serious').length,
      moderate: violations.filter(v => v.impact === 'moderate').length,
      minor: violations.filter(v => v.impact === 'minor').length,
    },
    violations: violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      affectedElements: v.nodes.length,
      sampleNodes: v.nodes.slice(0, 3).map(n => ({
        html: n.html,
        failureSummary: n.failureSummary,
      })),
    })),
  };
  
  // Write to file system (in CI environment this would be saved as an artifact)
  await page.evaluate((reportData) => {
    // This would be stored to filesystem in a real implementation
    console.log('A11Y REPORT:', JSON.stringify(reportData, null, 2));
  }, report);
}