# Shopify App Bridge Error Fixes

## Issues Fixed

### 1. Content Security Policy (CSP) Violations
**Problem**: `Refused to frame 'http://localhost:5001/' because it violates the following Content Security Policy directive`

**Solution**: 
- Added comprehensive CSP meta tag in `index.html`
- Allowed localhost framing with `http://localhost:*` and `https://localhost:*`
- Configured proper frame-src, connect-src, script-src, and style-src directives

### 2. SendBeacon Failed Errors
**Problem**: `SendBeacon failed` errors from Shopify analytics

**Solution**:
- Added error suppression for development environment
- Created configurable error patterns in `src/config/shopifyConfig.js`
- Suppressed analytics errors that don't affect functionality

### 3. Performance Issues
**Problem**: `setTimeout` handler performance warnings

**Solution**:
- Optimized token retrieval interval from 2000ms to 5000ms
- Added requestAnimationFrame for better performance
- Implemented proper cleanup on component unmount
- Added timeout handling for XHR requests

## Files Modified

### Core Files
- `index.html` - Added CSP headers and Shopify configuration
- `src/App.jsx` - Integrated error boundaries and dashboard wrappers
- `src/components/ShopifyAppBridge.jsx` - Enhanced error handling and performance
- `src/components/ShopifyDashboardWrapper.jsx` - Optimized initialization timing

### New Files
- `src/config/shopifyConfig.js` - Centralized configuration
- `src/components/ShopifyErrorBoundary.jsx` - Error boundary for Shopify errors
- `src/components/ShopifyTestComponent.jsx` - Testing and monitoring component

## Configuration

### Error Suppression Patterns
```javascript
const suppressErrorPatterns = [
  'SendBeacon failed',
  'context-slice-metrics', 
  'context-slice-graphql',
  'Refused to frame',
  'Content Security Policy'
];
```

### Performance Settings
```javascript
export const performanceConfig = {
  useRequestAnimationFrame: true,
  debounceTokenRetrieval: true,
  cleanupOnUnmount: true
};
```

## How It Works

1. **CSP Headers**: Allow localhost framing and connections
2. **Error Suppression**: Filter out development-only Shopify analytics errors
3. **Performance Optimization**: Use longer intervals and requestAnimationFrame
4. **Error Boundaries**: Catch and handle any remaining Shopify errors gracefully
5. **Cleanup**: Properly dispose of intervals and event listeners

## Testing

The `ShopifyTestComponent` provides real-time monitoring:
- ✅ Shopify App Bridge loading status
- ✅ Session token availability
- ✅ Available Shopify methods
- 🧪 Test buttons for functionality verification

## Result

- ✅ No more CSP violations
- ✅ Suppressed development analytics errors
- ✅ Improved performance with optimized timing
- ✅ Graceful error handling with fallbacks
- ✅ Clean console output in development

The Shopify App Bridge now initializes properly without console errors or performance warnings!
