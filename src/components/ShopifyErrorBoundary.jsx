import React from 'react';

class ShopifyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a Shopify-related error
    const isShopifyError = error.message && (
      error.message.includes('shopify') ||
      error.message.includes('App Bridge') ||
      error.message.includes('SendBeacon') ||
      error.message.includes('context-slice')
    );

    if (isShopifyError) {
      // Suppress Shopify-related errors in development
      if (process.env.NODE_ENV === 'development') {
        console.debug('Shopify error suppressed:', error.message);
        return { hasError: false };
      }
    }

    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error but don't crash the app for Shopify errors
    if (error.message && error.message.includes('shopify')) {
      console.debug('Shopify error caught and handled:', error.message);
      return;
    }

    console.error('Error caught by ShopifyErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          margin: '20px'
        }}>
          <h3 style={{ color: '#d63031', margin: '0 0 10px 0' }}>
            Something went wrong
          </h3>
          <p style={{ color: '#636e72', margin: '0' }}>
            There was an error loading the dashboard. Please refresh the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#d63031',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ShopifyErrorBoundary;
