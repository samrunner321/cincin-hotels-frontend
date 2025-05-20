import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
// Import the actual AxeResults type from axe-core
import type { AxeResults } from 'axe-core';

/**
 * Utilities for accessibility testing
 */

/**
 * Available Accessibility Violation Impact Levels
 */
export type ImpactLevel = 'minor' | 'moderate' | 'serious' | 'critical';

/**
 * Interface for accessibility scan options
 */
export interface AccessibilityScanOptions {
  includedImpacts?: ImpactLevel[];
  disableRules?: string[];
  withRules?: string[]; // Changed from enableRules to withRules to match AxeBuilder API
  scope?: string; // CSS selector to limit the scope of the scan
}

/**
 * Run an accessibility scan on the current page
 */
export async function runAccessibilityScan(
  page: Page, 
  options: AccessibilityScanOptions = {}
): Promise<AxeResults> {
  let axeBuilder = new AxeBuilder({ page });
  
  // Apply options if provided
  if (options.includedImpacts?.length) {
    axeBuilder = axeBuilder.withTags(options.includedImpacts);
  }
  
  if (options.disableRules?.length) {
    axeBuilder = axeBuilder.disableRules(options.disableRules);
  }
  
  if (options.withRules?.length) {
    axeBuilder = axeBuilder.withRules(options.withRules);
  }
  
  if (options.scope) {
    axeBuilder = axeBuilder.include(options.scope);
  }
  
  return await axeBuilder.analyze();
}

/**
 * Helper function to get a more readable report from Axe results
 */
export function formatAccessibilityViolations(results: AxeResults): string {
  if (results.violations.length === 0) {
    return 'No accessibility violations detected.';
  }
  
  let report = `Found ${results.violations.length} accessibility violations:\n\n`;
  
  results.violations.forEach((violation, index) => {
    report += `${index + 1}. ${violation.impact ? violation.impact.toUpperCase() : 'UNKNOWN'}: ${violation.help} (${violation.id})\n`;
    report += `   Help URL: ${violation.helpUrl}\n`;
    report += `   Affected nodes: ${violation.nodes.length}\n`;
    
    // Include details for the first few affected nodes
    const nodesToShow = Math.min(3, violation.nodes.length);
    for (let i = 0; i < nodesToShow; i++) {
      const node = violation.nodes[i];
      report += `   - HTML: ${node.html}\n`;
      if (node.failureSummary) {
        report += `     Failure Summary: ${node.failureSummary}\n`;
      }
    }
    
    report += '\n';
  });
  
  return report;
}

/**
 * Check if an axe rule should be ignored based on configuration
 */
export function shouldIgnoreRule(ruleId: string): boolean {
  // List of rule IDs that we want to ignore in our tests
  // This could be loaded from a configuration file
  const ignoredRules: string[] = [
    // Add IDs of rules to ignore here
    // Example: 'color-contrast'
  ];
  
  return ignoredRules.includes(ruleId);
}

/**
 * Filter accessibility results to only include violations we care about
 */
export function filterAccessibilityViolations(results: AxeResults): AxeResults {
  const filteredViolations = results.violations.filter(
    violation => !shouldIgnoreRule(violation.id)
  );
  
  // Create a new object with filtered violations
  return {
    ...results,
    violations: filteredViolations
  } as AxeResults;
}