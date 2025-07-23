# Cloudflare Pages Deployment Guide

## 🚀 Quick Setup

### 1. Prepare Your Repository

First, fix the pnpm lockfile issue:

```bash
# Delete the old lockfile
rm pnpm-lock.yaml

# Regenerate it
pnpm install
```

### 2. Cloudflare Pages Configuration

In your Cloudflare Dashboard:

1. Go to **Pages** → **Create a project**
2. Connect your GitHub repository
3. Use these build settings:

```
Build command: npm run build
Build output directory: .next
Root directory: mywebsite
Node.js version: 22.16.0
```

### 3. Environment Variables

Add these in Cloudflare Pages → Settings → Environment Variables:

```
BANDSINTOWN_ARTIST_NAME=your-artist-name
BANDSINTOWN_APP_ID=your-app-id
PATREON_CLIENT_ID=your-patreon-client-id
PATREON_CLIENT_SECRET=your-patreon-client-secret
NEXTAUTH_URL=https://your-domain.pages.dev
NEXTAUTH_SECRET=your-generated-secret
```

### 4. Custom Build Settings

Create these files in your repository:

**`_headers`** (for caching and security):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-cache, no-store, must-revalidate
```

**`_redirects`** (for SPA routing):
```
/api/* /api/:splat 200
/shop /#shop 302
/book /#book 302
/tours /#tours 302
/about /#about 302
/* /index.html 200
```

## 🛠️ Manual Deployment Steps

If automatic deployment fails:

### Option 1: Switch to npm

```bash
# Remove pnpm files
rm pnpm-lock.yaml
rm -rf node_modules

# Install with npm
npm install

# Commit the new package-lock.json
git add package-lock.json
git commit -m "Switch to npm for Cloudflare compatibility"
git push
```

### Option 2: Fix pnpm in Cloudflare

In Cloudflare Pages build settings, override the install command:

```
Install command: pnpm install --no-frozen-lockfile
Build command: pnpm run build
```

## 🔧 Edge Runtime Compatibility

Your code is already configured with Edge Runtime:

- ✅ All pages have `export const runtime = "edge"`
- ✅ API routes use Edge Runtime
- ✅ Images are optimized for Cloudflare
- ✅ No Node.js-specific APIs used

## 🚨 Common Issues & Solutions

### Issue: "pnpm lockfile out of sync"
**Solution**: Delete `pnpm-lock.yaml` and run `pnpm install`

### Issue: "Build fails with module errors"
**Solution**: Switch to npm instead of pnpm

### Issue: "API routes not working"
**Solution**: Ensure environment variables are set in Cloudflare dashboard

### Issue: "Images not loading"
**Solution**: Check that image domains are in `next.config.mjs`

## 📱 Testing Your Deployment

After deployment, test these features:

1. **Navigation**: All links should work
2. **Theme Toggle**: Dark/light mode switching
3. **API Routes**: Tour dates should load
4. **Forms**: Booking form should submit
5. **Mobile**: Responsive design works

## 🔄 Continuous Deployment

Once set up, every push to your main branch will automatically:

1. Trigger a new build
2. Deploy to your Cloudflare Pages domain
3. Update your live site

## 📞 Support

If you encounter issues:

1. Check Cloudflare Pages build logs
2. Verify environment variables are set
3. Test locally with `npm run build` first
4. Check the Functions tab in Cloudflare for API route errors

Your site will be available at: `https://your-repo-name.pages.dev`

Custom domains can be added in: Pages → Custom domains