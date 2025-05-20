/**
 * Circuit Breaker Pattern Implementation
 * 
 * Provides resilience to external API calls by automatically detecting failures
 * and preventing cascading failures in distributed systems.
 */

// Circuit state enumeration
export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation - requests pass through
  OPEN = 'OPEN',         // Circuit is open - fast fail without executing function
  HALF_OPEN = 'HALF_OPEN' // Testing if the service is back - allow limited requests
}

// Circuit breaker options
export interface CircuitBreakerOptions {
  // Failure threshold percentage (0-100) to open the circuit
  failureThreshold: number;
  // Number of requests to sample for threshold calculation
  requestVolumeThreshold: number;
  // Time in milliseconds to wait before moving from OPEN to HALF_OPEN
  resetTimeout: number;
  // Function to determine if an error should count as a failure
  isFailure?: (error: any) => boolean;
  // Number of consecutive successful calls to close circuit from HALF_OPEN
  halfOpenSuccessThreshold: number;
  // Optional name to identify this circuit breaker
  name?: string;
}

// Default options
const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 50,          // 50% failure rate opens circuit
  requestVolumeThreshold: 10,    // Minimum 10 requests before calculating failure rate
  resetTimeout: 30000,           // 30 seconds before attempting to recover
  halfOpenSuccessThreshold: 5,   // 5 consecutive successes to close circuit
  isFailure: (error: any) => !!error, // Any error is considered a failure
};

// Statistics tracked by the circuit breaker
interface CircuitStats {
  // Total requests processed since creation
  totalRequests: number;
  // Total failures tracked
  totalFailures: number;
  // Last N request success/failure status (true = success, false = failure)
  recentRequests: boolean[];
  // Consecutive successes (used in HALF_OPEN state)
  consecutiveSuccesses: number;
  // Timestamp when the circuit last opened (or 0 if never opened)
  lastOpenTimestamp: number;
}

/**
 * Circuit Breaker implementation to protect against cascading failures
 */
export class CircuitBreaker {
  private options: CircuitBreakerOptions;
  private state: CircuitState = CircuitState.CLOSED;
  private stats: CircuitStats = {
    totalRequests: 0,
    totalFailures: 0,
    recentRequests: [],
    consecutiveSuccesses: 0,
    lastOpenTimestamp: 0,
  };

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check circuit state before executing
    if (this.state === CircuitState.OPEN) {
      // Check if reset timeout has elapsed to transition to HALF_OPEN
      if (Date.now() - this.stats.lastOpenTimestamp >= this.options.resetTimeout) {
        this.transitionToState(CircuitState.HALF_OPEN);
      } else {
        // Fast fail with circuit open error
        throw new CircuitOpenError(this.options.name || 'unnamed');
      }
    }

    // At this point, circuit is either CLOSED or HALF_OPEN
    try {
      // Execute the protected function
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure(error);
      throw error;
    }
  }

  /**
   * Record a successful execution
   */
  private recordSuccess(): void {
    // Increment request count
    this.stats.totalRequests++;

    // Update recent requests tracking
    this.updateRecentRequests(true);

    // In HALF_OPEN state, track consecutive successes to determine if we can close the circuit
    if (this.state === CircuitState.HALF_OPEN) {
      this.stats.consecutiveSuccesses++;
      if (this.stats.consecutiveSuccesses >= this.options.halfOpenSuccessThreshold) {
        this.transitionToState(CircuitState.CLOSED);
      }
    }
  }

  /**
   * Record a failed execution
   */
  private recordFailure(error: any): void {
    // Check if this error counts as a failure
    if (!this.options.isFailure || this.options.isFailure(error)) {
      // Increment counters
      this.stats.totalRequests++;
      this.stats.totalFailures++;

      // Update recent requests tracking
      this.updateRecentRequests(false);

      // Reset consecutive successes counter
      this.stats.consecutiveSuccesses = 0;

      // In HALF_OPEN state, a single failure will re-open the circuit
      if (this.state === CircuitState.HALF_OPEN) {
        this.transitionToState(CircuitState.OPEN);
      } else if (this.state === CircuitState.CLOSED) {
        // In CLOSED state, check if we should open the circuit
        this.evaluateState();
      }
    }
  }

  /**
   * Update the tracking of recent requests
   */
  private updateRecentRequests(success: boolean): void {
    // Add current result to the circular buffer
    this.stats.recentRequests.push(success);
    
    // Limit the size of the buffer to request volume threshold
    if (this.stats.recentRequests.length > this.options.requestVolumeThreshold) {
      this.stats.recentRequests.shift();
    }
  }

  /**
   * Evaluate the current failure rate and transition state if needed
   */
  private evaluateState(): void {
    // Only evaluate after we have enough data
    if (this.stats.recentRequests.length >= this.options.requestVolumeThreshold) {
      // Calculate failure percentage
      const failures = this.stats.recentRequests.filter(success => !success).length;
      const failurePercentage = (failures / this.stats.recentRequests.length) * 100;

      // If failure percentage exceeds threshold, open the circuit
      if (failurePercentage >= this.options.failureThreshold) {
        this.transitionToState(CircuitState.OPEN);
      }
    }
  }

  /**
   * Change the circuit state
   */
  private transitionToState(newState: CircuitState): void {
    // Skip if already in requested state
    if (this.state === newState) return;

    const prevState = this.state;
    this.state = newState;

    // Reset tracking stats when changing states
    if (newState === CircuitState.CLOSED) {
      // Reset tracking when closing the circuit
      this.stats.consecutiveSuccesses = 0;
    } else if (newState === CircuitState.OPEN) {
      // Record timestamp when opening for reset timeout calculation
      this.stats.lastOpenTimestamp = Date.now();
      this.stats.consecutiveSuccesses = 0;
    } else if (newState === CircuitState.HALF_OPEN) {
      // Reset success counter when moving to half-open
      this.stats.consecutiveSuccesses = 0;
    }

    // Log state transition
    console.info(
      `Circuit state transition: ${prevState} -> ${newState}`,
      this.options.name ? `[${this.options.name}]` : '',
      {
        totalRequests: this.stats.totalRequests,
        totalFailures: this.stats.totalFailures,
        failureRate: this.stats.totalRequests ? 
          (this.stats.totalFailures / this.stats.totalRequests * 100).toFixed(2) + '%' : '0%'
      }
    );
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get circuit statistics
   */
  getStats(): {
    state: CircuitState;
    metrics: {
      totalRequests: number;
      totalFailures: number;
      recentFailureRate: number;
      consecutiveSuccesses: number;
      timeInCurrentState: number;
    };
  } {
    const recentFailures = this.stats.recentRequests.filter(success => !success).length;
    
    return {
      state: this.state,
      metrics: {
        totalRequests: this.stats.totalRequests,
        totalFailures: this.stats.totalFailures,
        recentFailureRate: this.stats.recentRequests.length > 0 ?
          (recentFailures / this.stats.recentRequests.length) * 100 : 0,
        consecutiveSuccesses: this.stats.consecutiveSuccesses,
        timeInCurrentState: this.state === CircuitState.OPEN ?
          Date.now() - this.stats.lastOpenTimestamp : 0
      }
    };
  }

  /**
   * Reset the circuit breaker to initial state
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.stats = {
      totalRequests: 0,
      totalFailures: 0,
      recentRequests: [],
      consecutiveSuccesses: 0,
      lastOpenTimestamp: 0,
    };
  }
}

/**
 * Error thrown when a circuit is open
 */
export class CircuitOpenError extends Error {
  constructor(circuitName: string) {
    super(`Circuit '${circuitName}' is open`);
    this.name = 'CircuitOpenError';
  }
}

// Circuit breaker registry for global access
const circuitBreakerRegistry = new Map<string, CircuitBreaker>();

/**
 * Get a circuit breaker by name (creates one if it doesn't exist)
 */
export function getCircuitBreaker(name: string, options?: Partial<CircuitBreakerOptions>): CircuitBreaker {
  if (!circuitBreakerRegistry.has(name)) {
    circuitBreakerRegistry.set(
      name, 
      new CircuitBreaker({ 
        ...options, 
        name 
      })
    );
  }
  
  return circuitBreakerRegistry.get(name)!;
}

/**
 * Execute a function with circuit breaker protection
 */
export async function withCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitName: string,
  options?: Partial<CircuitBreakerOptions>
): Promise<T> {
  const circuitBreaker = getCircuitBreaker(circuitName, options);
  return circuitBreaker.execute(fn);
}