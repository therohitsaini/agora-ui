# Vercel Deployment Fix for Rollup Error

## 🚨 Problem
```
Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
npm has a bug related to optional dependencies
```

## ✅ Solutions Applied

### 1. **Package.json Updates**
- Added `engines` to specify Node.js version
- Added `overrides` to force Rollup dependency resolution
- Added `optionalDependencies` for Linux binary
- Added `postinstall` script to handle missing dependencies
- Created `build:vercel` script with legacy peer deps

### 2. **Vercel Configuration**
- Updated `vercel.json` with proper build commands
- Added `installCommand` with `--legacy-peer-deps`
- Specified `outputDirectory` as `dist`
- Added Node.js runtime specification

### 3. **NPM Configuration**
- Created `.npmrc` file with legacy peer deps
- Disabled funding and audit for faster builds
- Enabled prefer-offline for caching

### 4. **Vite Configuration**
- Updated `vite.config.js` with better Rollup options
- Added manual chunk splitting
- Optimized dependencies for better builds

## 🚀 Deployment Steps

### Option 1: Automatic (Recommended)
1. Push your changes to GitHub
2. Vercel will automatically detect the new configuration
3. The build should now work with the updated settings

### Option 2: Manual Deploy
```bash
# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Build the project
npm run build:vercel

# Deploy to Vercel
vercel --prod
```

## 🔧 Key Files Modified

### `package.json`
```json
{
  "engines": { "node": ">=18.0.0" },
  "overrides": {
    "rollup": { "@rollup/rollup-linux-x64-gnu": "^4.0.0" }
  },
  "optionalDependencies": {
    "@rollup/rollup-linux-x64-gnu": "^4.0.0"
  },
  "postinstall": "npm install @rollup/rollup-linux-x64-gnu --no-save --legacy-peer-deps || true"
}
```

### `vercel.json`
```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### `.npmrc`
```
legacy-peer-deps=true
fund=false
audit=false
prefer-offline=true
```

## 🎯 Expected Results

- ✅ **Rollup native dependencies** will be properly installed on Vercel
- ✅ **Build process** will complete without MODULE_NOT_FOUND errors
- ✅ **Deployment** will succeed with all Shopify App Bridge features working
- ✅ **Performance** will be optimized with proper chunk splitting

## 🧪 Testing

After deployment, verify:
1. ✅ App loads without console errors
2. ✅ Shopify App Bridge initializes properly
3. ✅ All routes work correctly
4. ✅ No Rollup dependency errors in Vercel logs

The deployment should now work successfully! 🚀
