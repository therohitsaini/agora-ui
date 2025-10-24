// Content Security Policy Configuration for Development
export const getCSPConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // More permissive CSP for development
    return {
      'frame-src': [
        'app.shopify.com',
        '*.shopifyapps.com',
        '*.myshopify.com',
        'https://*',
        'http://*',
        'shopify-pos://*',
        'hcaptcha.com',
        '*.hcaptcha.com',
        'https://localhost:*',
        'http://localhost:*',
        'http://localhost:5001/',
        'http://localhost:5173/',
        'blob:',
        'data:'
      ],
      'connect-src': [
        'https://*.shopify.com',
        'https://*.myshopify.com',
        'https://localhost:*',
        'http://localhost:*',
        'http://localhost:5001/',
        'http://localhost:5173/',
        'wss://localhost:*',
        'ws://localhost:*',
        'https://*',
        'http://*'
      ],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://cdn.shopify.com',
        'https://checkout.razorpay.com',
        'https://*',
        'http://*'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://cdn.shopify.com',
        'https://*',
        'http://*'
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
        'http:',
        'blob:'
      ],
      'font-src': [
        "'self'",
        'data:',
        'https:',
        'http:'
      ]
    };
  }
  
  // Production CSP (more restrictive)
  return {
    'frame-src': [
      'app.shopify.com',
      '*.shopifyapps.com',
      '*.myshopify.com',
      'https://*',
      'shopify-pos://*',
      'hcaptcha.com',
      '*.hcaptcha.com',
      'blob:'
    ],
    'connect-src': [
      'https://*.shopify.com',
      'https://*.myshopify.com'
    ],
    'script-src': [
      "'self'",
      'https://cdn.shopify.com',
      'https://checkout.razorpay.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:'
    ],
    'font-src': [
      "'self'",
      'data:',
      'https:'
    ]
  };
};

// Generate CSP string from config
export const generateCSPString = () => {
  const config = getCSPConfig();
  return Object.entries(config)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};
