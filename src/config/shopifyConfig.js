// Shopify App Bridge Configuration
export const shopifyConfig = {
  // API Key from shopify.app.toml
  apiKey: "9670f701d5332dc0e886440fd2277221",
  
  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Suppress analytics errors in development
  suppressAnalyticsErrors: process.env.NODE_ENV === 'development',
  
  // Token refresh interval (in milliseconds)
  tokenRefreshInterval: 5000,
  
  // Maximum retry attempts for App Bridge initialization
  maxRetryAttempts: 30,
  
  // Timeout for XHR header setup (in milliseconds)
  xhrTimeout: 1000,
  
  // CSP configuration for development
  cspConfig: {
    frameSrc: [
      'app.shopify.com',
      '*.shopifyapps.com', 
      '*.myshopify.com',
      'https://*',
      'shopify-pos://*',
      'hcaptcha.com',
      '*.hcaptcha.com',
      'https://localhost:*',
      'http://localhost:*',
      'blob:'
    ],
    connectSrc: [
      'https://*.shopify.com',
      'https://*.myshopify.com',
      'https://localhost:*',
      'http://localhost:*',
      'wss://localhost:*',
      'ws://localhost:*'
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://cdn.shopify.com',
      'https://checkout.razorpay.com'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com'
    ]
  }
};

// Error suppression patterns for development
export const suppressErrorPatterns = [
  'SendBeacon failed',
  'context-slice-metrics',
  'context-slice-graphql',
  'Refused to frame',
  'Content Security Policy',
  'localhost:5001',
  'localhost:5173',
  'violates the following Content Security Policy directive'
];

// Performance optimization settings
export const performanceConfig = {
  // Use requestAnimationFrame for better performance
  useRequestAnimationFrame: true,
  
  // Debounce token retrieval
  debounceTokenRetrieval: true,
  
  // Clean up intervals on unmount
  cleanupOnUnmount: true
};
