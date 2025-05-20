// @ts-nocheck
'use client';

import React, { ComponentType, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component for catching and handling errors in React components
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary 
 *   fallback={<p>Something went wrong!</p>}
 *   onError={(error, errorInfo) => console.error(error, errorInfo)}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Or with a function fallback:
 * ```tsx
 * <ErrorBoundary 
 *   fallback={(error, errorInfo) => (
 *     <div>
 *       <h2>Something went wrong!</h2>
 *       <details>
 *         <summary>Error details</summary>
 *         <p>{error.toString()}</p>
 *         <p>{errorInfo.componentStack}</p>
 *       </details>
 *     </div>
 *   )}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function' && this.state.error && this.state.errorInfo) {
          return this.props.fallback(this.state.error, this.state.errorInfo);
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback">
          <h2>Ein unerwarteter Fehler ist aufgetreten</h2>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details>
              <summary>Details anzeigen</summary>
              <p>{this.state.error.toString()}</p>
              <p>Komponenten-Stack:</p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Seite neu laden
          </button>
        </div>
      );
    }

    // No error, render children
    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 * 
 * Usage:
 * ```tsx
 * const SafeComponent = withErrorBoundary(YourComponent, {
 *   fallback: <p>Something went wrong!</p>,
 *   onError: (error, errorInfo) => console.error(error, errorInfo)
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';

  const WrappedComponent = (props: P): JSX.Element => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;

  return WrappedComponent;
}

export default ErrorBoundary;