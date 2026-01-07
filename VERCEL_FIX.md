# 🔧 Fix Error 404 NOT_FOUND di Vercel

Error **404: NOT_FOUND** terjadi karena Vercel tidak tahu cara handle **React Router 7 SSR**. Berikut solusinya:

---

## ⚠️ Problem

React Router 7 menggunakan **SSR (Server-Side Rendering)**, bukan static site. Vercel perlu dikonfigurasi untuk menjalankan **Node.js server**.

---

## ✅ Solution

### **Option 1: Deploy sebagai Node.js App (Recommended)**

React Router 7 harus di-deploy sebagai **serverless function**, bukan static site.

#### 1. Update `vercel.json`:

Hapus konfigurasi lama dan gunakan ini:

```json
{
  "version": 2
}
```

Atau biarkan **KOSONG** (Vercel auto-detect).

#### 2. Buat file `build.sh`:

```bash
#!/bin/bash
prisma generate
npm run build
```

#### 3. Update Vercel Project Settings:

Di **Vercel Dashboard** → **Settings** → **General**:

- **Framework Preset**: `Other`
- **Build Command**: `npm run build`
- **Output Directory**: `build/client`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

Di **Settings** → **Functions**:
- **Node.js Version**: `20.x`

#### 4. Commit dan Push:

```bash
git add .
git commit -m "Fix Vercel 404 - Configure for SSR"
git push origin main
```

---

### **Option 2: Deploy dengan Vercel Adapter (Alternative)**

Jika Option 1 tidak work, gunakan Vercel adapter khusus untuk React Router.

#### 1. Install Vercel Adapter:

```bash
npm install -D @vercel/node
```

#### 2. Update `react-router.config.ts`:

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  serverBuildFile: "index.js",
  publicPath: "/build/",
} satisfies Config;
```

#### 3. Buat `api/index.js`:

```javascript
import { createRequestHandler } from "@react-router/node";
import * as build from "../build/server/index.js";

export default createRequestHandler({ build });
```

#### 4. Update `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "build/client/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/build/(.*)",
      "dest": "/build/client/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

---

### **Option 3: Switch ke SPA Mode (Paling Mudah tapi Kehilangan SSR)**

Jika kamu tidak butuh SSR, switch ke **SPA mode**:

#### 1. Update `react-router.config.ts`:

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // 👈 Disable SSR
} satisfies Config;
```

#### 2. Update `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 3. Rebuild dan Deploy:

```bash
npm run build
git add .
git commit -m "Switch to SPA mode"
git push origin main
```

**⚠️ Trade-off:**
- ❌ No SEO optimization
- ❌ No server-side data loading
- ✅ Lebih mudah deploy
- ✅ Faster cold start

---

## 🧪 Test Build Locally

Sebelum push ke Vercel, test dulu secara local:

```bash
# Build production
npm run build

# Test production build
npm start

# Buka http://localhost:3000
```

Pastikan:
- ✅ Homepage load
- ✅ Routing works (navigasi antar halaman)
- ✅ Admin login works
- ✅ Database connection works

---

## 🔍 Debug Vercel Deployment

### Check Vercel Logs:

1. **Vercel Dashboard** → **Deployments**
2. Click deployment terakhir
3. **View Function Logs**
4. Lihat error messages

### Common Issues:

#### ❌ "Module not found: @prisma/client"

**Fix:**
- Pastikan `postinstall: "prisma generate"` ada di `package.json`
- Check env var `DATABASE_URL` sudah di-set

#### ❌ "Cannot find module 'build/server/index.js'"

**Fix:**
- Build command salah
- Pastikan `npm run build` menghasilkan `build/server/index.js`
- Check Output Directory setting

#### ❌ "Database connection failed"

**Fix:**
- Check `DATABASE_URL` di environment variables
- Pastikan Neon database tidak suspended
- Test connection string manual

---

## 📋 Recommended Setup (Pilih Salah Satu)

### **Setup 1: React Router SSR on Vercel (Best for SEO)**

```
Pros:
✅ SEO optimized
✅ Server-side data loading
✅ Fast initial render

Cons:
❌ More complex setup
❌ Cold start latency
❌ Need proper Vercel config
```

**Use:** Option 1 atau Option 2 di atas

---

### **Setup 2: SPA Mode (Easiest)**

```
Pros:
✅ Simple deployment
✅ Fast after first load
✅ No server needed

Cons:
❌ Poor SEO
❌ Slow initial render
❌ Client-side only
```

**Use:** Option 3 di atas

---

### **Setup 3: Deploy ke Platform Lain**

Jika Vercel terlalu ribet, coba platform lain yang lebih friendly untuk Node.js SSR:

#### **Fly.io** (Recommended for React Router SSR):

```bash
# Install Fly CLI
# Windows: scoop install flyctl
# Mac: brew install flyctl

# Deploy
fly launch
fly deploy
```

**Pros:**
- ✅ Native Docker support
- ✅ Perfect untuk SSR
- ✅ Free tier 3GB RAM
- ✅ Global edge locations

#### **Railway.app**:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

**Pros:**
- ✅ Auto-detect Node.js
- ✅ $5 free credit/month
- ✅ Simple UI
- ✅ Automatic HTTPS

#### **Render.com**:

1. Connect GitHub repo
2. Select "Web Service"
3. Build: `npm run build`
4. Start: `npm start`

**Pros:**
- ✅ Zero config for Node.js
- ✅ Free tier
- ✅ Auto SSL
- ✅ PostgreSQL included

---

## 🎯 Quick Fix Summary

**Jika masih 404, coba langkah ini:**

1. **Hapus `vercel.json`** (biarkan Vercel auto-detect):
   ```bash
   git rm vercel.json
   git commit -m "Remove vercel.json"
   git push
   ```

2. **Atau gunakan minimal config**:
   ```json
   {
     "version": 2
   }
   ```

3. **Check Vercel Build Logs** untuk error messages

4. **Verify environment variables** di Vercel dashboard

5. **Test build locally** sebelum deploy

---

## 💬 Need Help?

Jika masih error:

1. **Share Vercel Build Log** (screenshot error di deployment logs)
2. **Share Vercel Function Log** (runtime errors)
3. **Confirm your Vercel settings:**
   - Framework Preset
   - Build Command
   - Output Directory
   - Node.js Version

Saya akan bantu debug lebih lanjut! 🚀


