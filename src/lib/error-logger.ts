/**
 * Centralized error logging and monitoring for API calls
 * 
 * Provides consistent error handling, logging, and monitoring capabilities
 * for the CinCin Hotels application.
 */

import { ApiError } from '../types/api';

// Error severity levels
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error context information
export interface ErrorContext {
  // The component or module where the error occurred
  source: string;
  // User information (if applicable)
  user?: {
    id?: string;
    ip?: string;
    userAgent?: string;
  };
  // Request information (if applicable)
  request?: {
    method?: string;
    path?: string;
    query?: Record<string, any>;
    body?: Record<string, any>;
  };
  // Additional contextual data
  data?: Record<string, any>;
  // Tags for categorizing errors
  tags?: string[];
}

// Error log entry
interface ErrorLogEntry {
  // Unique identifier for the error
  id: string;
  // ISO timestamp when the error occurred
  timestamp: string;
  // Error message
  message: string;
  // Error name/code
  code: string;
  // Error severity level
  severity: ErrorSeverity;
  // Stack trace (if available)
  stack?: string;
  // Original error
  originalError?: Error | unknown;
  // Context information
  context: ErrorContext;
}

// Error logging strategy (console, service, etc.)
export interface ErrorLogger {
  log(entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>): void;
}

// In-memory error log store for development and testing
class InMemoryErrorLogger implements ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs: number;

  constructor(maxLogs = 100) {
    this.maxLogs = maxLogs;
  }

  log(entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>): void {
    const logEntry: ErrorLogEntry = {
      ...entry,
      id: crypto.randomUUID ? crypto.randomUUID() : `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    // Add to memory log
    this.logs.unshift(logEntry);
    
    // Trim logs to max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Always log to console in development
    if (process.env.NODE_ENV !== 'production' || entry.severity === ErrorSeverity.CRITICAL) {
      const color = this.getSeverityColor(entry.severity);
      console.error(
        `%c${entry.severity.toUpperCase()}%c ${entry.message} [${entry.code}]`,
        `background: ${color}; color: white; padding: 2px 6px; border-radius: 2px; font-weight: bold;`,
        'color: inherit',
        { context: entry.context, stack: entry.stack }
      );
    }
  }

  getRecentLogs(limit = 20, severity?: ErrorSeverity): ErrorLogEntry[] {
    return this.logs
      .filter(log => !severity || log.severity === severity)
      .slice(0, limit);
  }

  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  private getSeverityColor(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.DEBUG: return '#6c757d';
      case ErrorSeverity.INFO: return '#0d6efd';
      case ErrorSeverity.WARNING: return '#ffc107';
      case ErrorSeverity.ERROR: return '#dc3545';
      case ErrorSeverity.CRITICAL: return '#6f42c1';
      default: return '#000000';
    }
  }
}

// Console error logger for simpler environments
class ConsoleErrorLogger implements ErrorLogger {
  log(entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>): void {
    const { message, code, severity, stack, context } = entry;
    
    switch (severity) {
      case ErrorSeverity.DEBUG:
        console.debug(`[${code}] ${message}`, { context, stack });
        break;
      case ErrorSeverity.INFO:
        console.info(`[${code}] ${message}`, { context, stack });
        break;
      case ErrorSeverity.WARNING:
        console.warn(`[${code}] ${message}`, { context, stack });
        break;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        console.error(`[${code}] ${message}`, { context, stack });
        break;
      default:
        console.log(`[${code}] ${message}`, { context, stack });
    }
  }
}

// Singleton pattern for the error logger
class ErrorLoggerService {
  private static instance: ErrorLoggerService;
  private logger: ErrorLogger;

  private constructor() {
    // Use in-memory logger by default
    this.logger = process.env.NODE_ENV === 'production'
      ? new ConsoleErrorLogger()
      : new InMemoryErrorLogger();
  }

  public static getInstance(): ErrorLoggerService {
    if (!ErrorLoggerService.instance) {
      ErrorLoggerService.instance = new ErrorLoggerService();
    }
    return ErrorLoggerService.instance;
  }

  // Set a custom logger
  public setLogger(logger: ErrorLogger): void {
    this.logger = logger;
  }

  // Log any error
  public logError(
    error: Error | ApiError | string,
    context: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.ERROR
  ): void {
    const code = typeof error === 'string'
      ? 'UNKNOWN_ERROR'
      : 'code' in error
        ? error.code || 'API_ERROR'
        : (error instanceof Error) ? error.name || 'UNKNOWN_ERROR' : 'UNKNOWN_ERROR';
    
    const message = typeof error === 'string'
      ? error
      : error.message || 'An unknown error occurred';
    
    const stack = typeof error !== 'string' && error instanceof Error
      ? error.stack
      : undefined;

    // Log the error
    this.logger.log({
      message,
      code,
      severity,
      stack,
      originalError: error,
      context
    });
  }

  // Log API errors specifically
  public logApiError(
    error: Error | ApiError,
    context: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.ERROR
  ): void {
    // Create more API-specific context
    const apiContext: ErrorContext = {
      ...context,
      tags: [...(context.tags || []), 'api'],
    };

    // Log the API error
    this.logError(error, apiContext, severity);
  }

  // Log critical errors
  public logCritical(
    error: Error | ApiError | string,
    context: ErrorContext
  ): void {
    this.logError(error, context, ErrorSeverity.CRITICAL);
  }

  // Convenience method for warning level errors
  public logWarning(
    message: string,
    context: ErrorContext,
    code = 'WARNING'
  ): void {
    this.logger.log({
      message,
      code,
      severity: ErrorSeverity.WARNING,
      context
    });
  }

  // Get recent logs if using in-memory logger
  public getRecentLogs(limit = 20, severity?: ErrorSeverity): ErrorLogEntry[] {
    if (this.logger instanceof InMemoryErrorLogger) {
      return this.logger.getRecentLogs(limit, severity);
    }
    return [];
  }
}

// Export the singleton instance
export const errorLogger = ErrorLoggerService.getInstance();

/**
 * Helper function to convert an unknown error to an ApiError
 */
export function normalizeError(error: unknown): ApiError {
  if (typeof error === 'string') {
    return {
      statusCode: 500,
      code: 'UNKNOWN_ERROR',
      message: error
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 'statusCode' in error ? (error as any).statusCode : 500,
      code: error.name || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      originalError: error
    };
  }

  // Handle API errors
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      statusCode: 'statusCode' in error ? (error as any).statusCode : 500,
      code: 'code' in error ? (error as any).code : 'API_ERROR',
      message: (error as any).message || 'An API error occurred',
      details: 'details' in error ? (error as any).details : undefined,
      originalError: error as Error
    };
  }

  // Last resort for unknown error types
  return {
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred'
  };
}

/**
 * Utility for monitoring API performance
 */
export class ApiPerformanceMonitor {
  private static readonly TIMINGS = new Map<string, number[]>();
  private static readonly MAX_SAMPLES = 100;

  // Start timing an API call
  public static startTiming(endpoint: string): () => number {
    const startTime = performance.now();
    
    // Return function to end timing and record duration
    return () => {
      const duration = performance.now() - startTime;
      this.recordTiming(endpoint, duration);
      return duration;
    };
  }

  // Record a timing sample
  private static recordTiming(endpoint: string, duration: number): void {
    if (!this.TIMINGS.has(endpoint)) {
      this.TIMINGS.set(endpoint, []);
    }
    
    const timings = this.TIMINGS.get(endpoint)!;
    timings.push(duration);
    
    // Keep only the most recent samples
    if (timings.length > this.MAX_SAMPLES) {
      timings.shift();
    }
  }

  // Get performance statistics for an endpoint
  public static getStats(endpoint: string): {
    count: number;
    average: number;
    median: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const timings = this.TIMINGS.get(endpoint);
    if (!timings || timings.length === 0) {
      return null;
    }
    
    // Sort timings for percentile calculations
    const sorted = [...timings].sort((a, b) => a - b);
    
    // Calculate statistics
    const count = sorted.length;
    const min = sorted[0];
    const max = sorted[count - 1];
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const average = sum / count;
    
    // Calculate median
    const medianIndex = Math.floor(count / 2);
    const median = count % 2 === 0
      ? (sorted[medianIndex - 1] + sorted[medianIndex]) / 2
      : sorted[medianIndex];
    
    // Calculate 95th percentile
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index];
    
    return {
      count,
      average,
      median,
      min,
      max,
      p95
    };
  }

  // Get all endpoints being monitored
  public static getEndpoints(): string[] {
    return Array.from(this.TIMINGS.keys());
  }

  // Clear performance data
  public static clear(endpoint?: string): void {
    if (endpoint) {
      this.TIMINGS.delete(endpoint);
    } else {
      this.TIMINGS.clear();
    }
  }
}