// Comprehensive error suppression for Shopify App Bridge in development
export const suppressShopifyErrors = () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Error patterns to suppress
  const errorPatterns = [
    'Refused to frame',
    'Content Security Policy',
    'SendBeacon failed',
    'context-slice-metrics',
    'context-slice-graphql',
    'localhost:5001',
    'localhost:5173',
    'violates the following Content Security Policy directive',
    'frame-src',
    'shopifycloud/web/assets'
  ];

  // Override console.error
  console.error = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        errorPatterns.some(pattern => message.includes(pattern))) {
      return; // Suppress these errors
    }
    originalConsoleError.apply(console, args);
  };

  // Override console.warn for CSP violations
  console.warn = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        errorPatterns.some(pattern => message.includes(pattern))) {
      return; // Suppress these warnings
    }
    originalConsoleWarn.apply(console, args);
  };

  // Suppress CSP violation events
  window.addEventListener('securitypolicyviolation', function(e) {
    if (e.violatedDirective.includes('frame-src') && 
        (e.blockedURI.includes('localhost:5001') || 
         e.blockedURI.includes('localhost:5173') ||
         e.blockedURI.includes('localhost'))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // Suppress unhandled promise rejections from Shopify
  window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.message && 
        errorPatterns.some(pattern => e.reason.message.includes(pattern))) {
      e.preventDefault();
      return false;
    }
  });

  console.log('Shopify error suppression activated for development');
};

// Initialize error suppression
export const initErrorSuppression = () => {
  // Run immediately
  suppressShopifyErrors();
  
  // Also run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suppressShopifyErrors);
  }
  
  // Run on window load
  window.addEventListener('load', suppressShopifyErrors);
};
