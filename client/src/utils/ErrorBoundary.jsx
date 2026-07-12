/**
 * client/src/utils/ErrorBoundary.jsx
 * React Error Boundary — catches runtime errors in the component tree
 * and shows a friendly fallback UI instead of a blank screen.
 */

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, send to error monitoring service (e.g., Sentry)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#09090b',
            color: '#e4e4e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              textAlign: 'center',
              background: '#0c0c0e',
              border: '1px solid #27272a',
              borderRadius: '1rem',
              padding: '2.5rem',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#f4f4f5',
              }}
            >
              Something went wrong
            </h1>
            <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              The application hit an unexpected error. This has been logged automatically.
            </p>
            {this.state.error && (
              <pre
                style={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#f87171',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '1.5rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.625rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
