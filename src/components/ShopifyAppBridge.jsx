import { useEffect } from 'react';
import { shopifyConfig, suppressErrorPatterns, performanceConfig } from '../config/shopifyConfig';
import { initErrorSuppression } from '../utils/errorSuppression';

const ShopifyAppBridge = () => {
  useEffect(() => {
    // Initialize comprehensive error suppression
    initErrorSuppression();
    // Function to wait for App Bridge to load
    const waitForAppBridge = () => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100;

        const checkAppBridge = () => {
          attempts++;
          if (typeof window.shopify !== 'undefined' && window.shopify) {
            resolve(window.shopify);
          } else if (attempts >= maxAttempts) {
            reject(new Error('App Bridge failed to load after 10 seconds'));
          } else {
            setTimeout(checkAppBridge, 100);
          }
        };

        checkAppBridge();
      });
    };

    // Initialize App Bridge
    const initializeAppBridge = async () => {
      try {
        const shopify = await waitForAppBridge();

        // Store the shopify object globally as per documentation
        window.shopify = shopify;

        // Suppress Shopify analytics errors in development
        if (shopifyConfig.suppressAnalyticsErrors) {
          const originalConsoleError = console.error;
          console.error = (...args) => {
            const message = args[0];
            if (typeof message === 'string' && 
                suppressErrorPatterns.some(pattern => message.includes(pattern))) {
              // Suppress these specific Shopify analytics errors in development
              return;
            }
            originalConsoleError.apply(console, args);
          };
        }

        // Additional error suppression for CSP violations
        if (shopifyConfig.isDevelopment) {
          // Override console.error to suppress CSP framing errors
          const originalError = console.error;
          console.error = function(...args) {
            const message = args[0];
            if (typeof message === 'string' && 
                (message.includes('Refused to frame') || 
                 message.includes('Content Security Policy') ||
                 message.includes('localhost:5001') ||
                 message.includes('localhost:5173'))) {
              return; // Suppress these errors
            }
            originalError.apply(console, args);
          };

          // Suppress CSP violation events
          window.addEventListener('securitypolicyviolation', function(e) {
            if (e.violatedDirective.includes('frame-src') && 
                (e.blockedURI.includes('localhost:5001') || 
                 e.blockedURI.includes('localhost:5173'))) {
              e.preventDefault();
              return false;
            }
          });
        }

        // API functions following the documentation pattern
        window.showSaveBar = function() {
          if (window.shopify && window.shopify.saveBar) {
            window.shopify.saveBar.show('app-save-bar');
          }
        };

        window.hideSaveBar = function() {
          if (window.shopify && window.shopify.saveBar) {
            window.shopify.saveBar.hide('app-save-bar');
          }
        };

        // Set up save bar button event listeners
        let saveBarListenersSetup = false;
        
        const setupSaveBarListeners = () => {
          // Prevent multiple setups
          if (saveBarListenersSetup) {
            return;
          }
          
          saveBarListenersSetup = true;
          
          // Set up save button click handler
          document.addEventListener('click', function(event) {
            if (event.target.id === 'save-bar-save-btn') {
              
              // Check if save button is already disabled (for free plan users)
              if (event.target.disabled) {
                return; // Prevent multiple submissions
              }

              // Disable the button to prevent multiple clicks
              event.target.disabled = true;

              // Trigger the save button click with proper token handling
              window.flashNotice("Saving... Please wait...");

              var saveButton = document.querySelector('#save-label-btn');

              // Additional check: if the actual save button is disabled, don't proceed
              if (saveButton && saveButton.disabled) {
                return; // Prevent form submission if save button is disabled
              }

              if (saveButton) {
                // Simply trigger the save button click - the existing form submission should work
                // The turbolinks:request-start event will add the proper headers
                saveButton.click();
              } else {
                // Fallback: submit the form directly
                var form = document.querySelector('form[method="POST"]');
                if (form) {
                  form.submit();
                }
              }
              window.hideSaveBar();
            }
            
            if (event.target.id === 'save-bar-discard-btn') {
              
              // Prevent multiple clicks
              if (event.target.disabled) {
                return;
              }
              
              // Disable the button to prevent multiple clicks
              event.target.disabled = true;
              
              // Navigate back to labels page
              window.location.href = "/labels";

              window.hideSaveBar();
            }
          });
        };

        // Set up listeners when DOM is ready
        document.addEventListener('DOMContentLoaded', setupSaveBarListeners);

        // Also set up listeners when page loads
        document.addEventListener('load', function() {
          // Reset the flag when page loads
          saveBarListenersSetup = false;
          setupSaveBarListeners();
        });

        // Global XMLHttpRequest interceptor to ensure ALL requests get headers
        (function() {
          const originalXHROpen = XMLHttpRequest.prototype.open;
          const originalXHRSend = XMLHttpRequest.prototype.send;

          XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;
            this._headersAdded = false; // Reset flag for new requests
            this._method = method; // Store method for debugging
            return originalXHROpen.apply(this, arguments);
          };

          XMLHttpRequest.prototype.send = function(data) {
            const xhr = this;

            // Only process if headers haven't been added yet
            if (!xhr._headersAdded) {
              // Ensure token is available and add headers with timeout
              const timeoutPromise = new Promise((resolve) => {
                setTimeout(() => resolve(), shopifyConfig.xhrTimeout);
              });

              Promise.race([
                ensureTokenAndAddHeaders(xhr),
                timeoutPromise
              ]).then(() => {
                originalXHRSend.call(xhr, data);
              }).catch((error) => {
                console.debug('XHR header setup failed:', error.message);
                originalXHRSend.call(xhr, data);
              });
            } else {
              // Headers already added, just send
              originalXHRSend.call(xhr, data);
            }
          };
        })();

        const retrieveToken = async () => {
          // Use the App Bridge API as per documentation
          if (window.shopify && window.shopify.idToken) {
            try {
              const token = await window.shopify.idToken();
              if (token) {
                window.sessionToken = token;
                return token;
              }
            } catch (error) {
              console.warn('Failed to retrieve session token:', error);
            }
          }

          if (!window.sessionToken) {
            const urlParams = new URLSearchParams(window.location.search);
            const idToken = urlParams.get('id_token');
            if (idToken) {
              window.sessionToken = idToken;
              return idToken;
            }
          }

          return window.sessionToken;
        };

        const ensureTokenAndAddHeaders = async (xhr) => {
          try {
            const url = xhr._url || '';
            if (url && !url.includes(window.location.hostname) && !url.includes('localhost')) {
              return;
            }

            window.sessionToken = await window.shopify.idToken();

            if (window.sessionToken) {
              if (!xhr._headersAdded) {
                xhr.setRequestHeader("X-Shopify-Authorization", "Bearer " + window.sessionToken);
                xhr._headersAdded = true;
              }
            }
          } catch (error) {
            console.warn('Error adding authorization header:', error);
          }
        };

        // Initialize token retrieval and redirection
        const initializeApp = async () => {
          await retrieveToken();

          // Keep retrieving token periodically with optimized timing
          let tokenRetrievalInterval;
          const keepRetrievingToken = () => {
            // Use a longer interval to reduce performance impact
            tokenRetrievalInterval = setInterval(async () => {
              try {
                await retrieveToken();
              } catch (error) {
                // Silently handle token retrieval errors to avoid console spam
                console.debug('Token retrieval failed:', error.message);
              }
            }, shopifyConfig.tokenRefreshInterval);
          };

          keepRetrievingToken();

          // Clean up interval on page unload
          window.addEventListener('beforeunload', () => {
            if (tokenRetrievalInterval) {
              clearInterval(tokenRetrievalInterval);
            }
          });
        };

        // Initialize the app
        initializeApp();

        // Toast functions following the documentation pattern
        window.flashNotice = function(message) { 
          if (window.shopify && window.shopify.toast) {
            window.shopify.toast.show(message);
          }
        };
        window.flashError = function(message) { 
          if (window.shopify && window.shopify.toast) {
            window.shopify.toast.show('Error: ' + message, {isError: true});
          }
        };

        console.log('Shopify App Bridge initialized successfully');
        console.log('Available Shopify methods:', Object.keys(window.shopify || {}));
      } catch (error) {
        console.error('Failed to initialize App Bridge:', error);
        if (window.flashError) {
          window.flashError('Failed to initialize App Bridge');
        }
      }
    };

    // Start initialization
    initializeAppBridge();
  }, []);

  return null; // This component doesn't render anything
};

export default ShopifyAppBridge;
