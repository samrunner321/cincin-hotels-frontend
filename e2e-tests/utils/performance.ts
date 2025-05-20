import { Page } from '@playwright/test';

/**
 * Utilities for performance testing
 */

/**
 * Interface for performance metrics
 */
export interface PerformanceMetrics {
  // Navigation timing metrics
  timeToFirstByte: number;
  domContentLoaded: number;
  loadTime: number;
  
  // Web Vitals
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  totalBlockingTime?: number;
  
  // Resource metrics
  resourceCount: number;
  resourceSize: number;
  
  // Script metrics
  scriptCount: number;
  scriptSize: number;
  
  // Custom metrics
  customMetrics?: Record<string, number>;
}

/**
 * Collect core performance metrics from the page
 */
export async function collectPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(() => {
    // Get basic navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    // Get First Contentful Paint
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    // Get resource entries
    const resourceEntries = performance.getEntriesByType('resource');
    const scriptEntries = resourceEntries.filter(entry => {
      // Need to cast to PerformanceResourceTiming to access initiatorType
      const resourceEntry = entry as PerformanceResourceTiming;
      return resourceEntry.initiatorType === 'script';
    });
    
    // Calculate total resource size
    let resourceSize = 0;
    let scriptSize = 0;
    
    resourceEntries.forEach(entry => {
      // Need to cast to PerformanceResourceTiming to access encodedBodySize
      const resourceEntry = entry as PerformanceResourceTiming;
      resourceSize += resourceEntry.encodedBodySize || 0;
    });
    
    scriptEntries.forEach(entry => {
      // Need to cast to PerformanceResourceTiming to access encodedBodySize
      const resourceEntry = entry as PerformanceResourceTiming;
      scriptSize += resourceEntry.encodedBodySize || 0;
    });
    
    // Web Vitals from the web-vitals API if available
    const webVitals: any = {};
    
    // For CLS and LCP, check if they are exposed via the Chrome DevTools Protocol
    if ('LayoutShift' in window) {
      // Example, implementation varies
      webVitals.cumulativeLayoutShift = (window as any).cumulativeLayoutShiftScore;
    }
    
    if ('LargestContentfulPaint' in window) {
      // Example, implementation varies
      webVitals.largestContentfulPaint = (window as any).largestContentfulPaintValue;
    }
    
    // Return combined metrics
    return {
      // Navigation timing
      timeToFirstByte: navigation ? navigation.responseStart - navigation.requestStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.startTime : 0,
      loadTime: navigation ? navigation.loadEventEnd - navigation.startTime : 0,
      
      // Web Vitals
      firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : undefined,
      firstPaint: firstPaint ? firstPaint.startTime : undefined,
      largestContentfulPaint: webVitals.largestContentfulPaint,
      cumulativeLayoutShift: webVitals.cumulativeLayoutShift,
      
      // Resource metrics
      resourceCount: resourceEntries.length,
      resourceSize,
      
      // Script metrics
      scriptCount: scriptEntries.length,
      scriptSize,
      
      // Add custom metrics from the window object if they exist
      customMetrics: (window as any).customMetrics || {},
    };
  });
  
  return metrics as PerformanceMetrics;
}

/**
 * Measure the time it takes to perform a specific action
 */
export async function measureActionTime(
  page: Page, 
  action: () => Promise<void>
): Promise<number> {
  await page.evaluate(() => {
    window.performance.mark('action-start');
  });
  
  await action();
  
  return await page.evaluate(() => {
    window.performance.mark('action-end');
    window.performance.measure('action-duration', 'action-start', 'action-end');
    const measure = window.performance.getEntriesByName('action-duration')[0];
    return measure.duration;
  });
}

/**
 * Simulate different network conditions
 */
export async function simulateNetworkCondition(
  page: Page, 
  condition: 'slow3g' | 'fast3g' | '4g' | 'offline'
): Promise<void> {
  const client = await page.context().newCDPSession(page);
  
  switch (condition) {
    case 'offline':
      await client.send('Network.emulateNetworkConditions', {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      });
      break;
      
    case 'slow3g':
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 100,
        downloadThroughput: 5 * 1024 * 8, // 5 Mbps
        uploadThroughput: 1 * 1024 * 8, // 1 Mbps
      });
      break;
      
    case 'fast3g':
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 40,
        downloadThroughput: 15 * 1024 * 8, // 15 Mbps
        uploadThroughput: 5 * 1024 * 8, // 5 Mbps
      });
      break;
      
    case '4g':
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 20,
        downloadThroughput: 40 * 1024 * 8, // 40 Mbps
        uploadThroughput: 15 * 1024 * 8, // 15 Mbps
      });
      break;
  }
}

/**
 * Format performance metrics in a readable form
 */
export function formatPerformanceMetrics(metrics: PerformanceMetrics): string {
  return `
Performance Metrics:
-------------------
Time to First Byte: ${metrics.timeToFirstByte.toFixed(2)}ms
DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms
Load Time: ${metrics.loadTime.toFixed(2)}ms

Web Vitals:
----------
First Contentful Paint: ${metrics.firstContentfulPaint ? metrics.firstContentfulPaint.toFixed(2) + 'ms' : 'N/A'}
Largest Contentful Paint: ${metrics.largestContentfulPaint ? metrics.largestContentfulPaint.toFixed(2) + 'ms' : 'N/A'}
Cumulative Layout Shift: ${metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(4) : 'N/A'}

Resources:
---------
Total Resources: ${metrics.resourceCount}
Total Resource Size: ${(metrics.resourceSize / 1024).toFixed(2)}KB
Script Count: ${metrics.scriptCount}
Script Size: ${(metrics.scriptSize / 1024).toFixed(2)}KB
`;
}