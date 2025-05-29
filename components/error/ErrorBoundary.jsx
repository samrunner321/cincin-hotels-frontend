'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Optionally report to an error tracking service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    const { fallback, children, id = 'unknown' } = this.props;
    
    if (this.state.hasError) {
      // Custom fallback UI
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.state.errorInfo) 
          : fallback;
      }
      
      // Default fallback UI
      return (
        <div className="error-boundary p-4 m-2 border border-red-500 rounded bg-red-50">
          <h2 className="text-lg font-semibold text-red-700">Something went wrong in component: {id}</h2>
          <details className="mt-2 text-sm text-gray-700">
            <summary>Click for error details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-96">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;