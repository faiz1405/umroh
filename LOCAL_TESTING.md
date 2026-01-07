# 🧪 Local Production Testing

## Error Saat `npm start`

Jika kamu mendapat error:
```
Error: DATABASE_URL is not set. Please configure it in your environment variables.
```

Ini **NORMAL**! `npm start` menjalankan production build yang tidak auto-load `.env` file.

---

## ✅ Cara Test Production Build Locally:

### **Option 1: Gunakan Dev Mode (Recommended untuk Local Testing)**

```bash
npm run dev
```

**Kenapa ini lebih baik untuk testing lokal:**
- ✅ Auto-load `.env` file
- ✅ Hot reload saat edit code
- ✅ Better error messages
- ✅ Development tools enabled

---

### **Option 2: Set Env Vars Manual (Windows PowerShell)**

```powershell
# Set env vars untuk session ini saja
$env:DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
$env:SESSION_SECRET="your-secret-key"
$env:NODE_ENV="production"

# Jalankan production server
npm start
```

**Atau gunakan script yang sudah saya buat:**

```powershell
# Run PowerShell script (auto-load .env)
.\test-production.ps1
```

---

### **Option 3: Buat File `.env.local` untuk Production Testing**

1. **Copy `.env` ke `.env.local`:**
   ```powershell
   Copy-Item .env .env.local
   ```

2. **Install `dotenv-cli`:**
   ```bash
   npm install -D dotenv-cli
   ```

3. **Update `package.json`:**
   ```json
   {
     "scripts": {
       "start": "react-router-serve ./build/server/index.js",
       "start:local": "dotenv -e .env.local -- npm start"
     }
   }
   ```

4. **Run:**
   ```bash
   npm run start:local
   ```

---

### **Option 4: One-Liner (Quick Test)**

```powershell
# Windows PowerShell - One command
$env:DATABASE_URL=(Get-Content .env | Where-Object {$_ -match 'DATABASE_URL='}) -replace 'DATABASE_URL=',''; npm start
```

---

## 🎯 Recommended Testing Workflow:

### **Development (Local Changes):**
```bash
npm run dev
# Auto-loads .env
# Hot reload enabled
# Test di http://localhost:5173
```

### **Production Build (Pre-Deploy Check):**
```bash
# 1. Build
npm run build

# 2. Test dengan env vars
.\test-production.ps1

# atau manual:
$env:DATABASE_URL="..."; npm start
```

### **Vercel Production (Actual Deployment):**
```bash
git push origin main
# Vercel auto-deploy
# Env vars dari Vercel Dashboard
```

---

## ⚠️ Penting untuk Deployment ke Vercel:

**Local testing dengan `npm start` adalah OPTIONAL!**

Kamu **tidak perlu** test production build secara lokal untuk deploy ke Vercel.

**Langsung deploy saja:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Vercel akan:**
1. ✅ Build project otomatis
2. ✅ Load env vars dari dashboard
3. ✅ Deploy ke production
4. ✅ Handle semua environment setup

---

## 🔍 Troubleshooting Local Production Testing

### Error: "Cannot find module"

**Cause:** Build belum di-run atau stale
**Fix:**
```bash
npm run build
npm start
```

### Error: "Database connection failed"

**Cause:** DATABASE_URL salah atau database offline
**Fix:**
- Verify connection string di `.env`
- Test connection: 
  ```bash
  psql "$(Get-Content .env | Where-Object {$_ -match 'DATABASE_URL='})"
  ```

### Error: "Port already in use"

**Cause:** Previous server masih running
**Fix:**
```bash
# Find and kill process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

## 💡 Best Practice:

**Untuk development/testing lokal:**
```bash
npm run dev  # ✅ Recommended
```

**Untuk verify production build:**
```bash
npm run build  # ✅ Check for build errors
# Test local optional - Vercel akan handle sisanya
```

**Untuk deployment:**
```bash
git push  # ✅ Let Vercel handle environment
```

---

## 🚀 Skip Local Production Testing?

Jika kamu mau **langsung deploy tanpa test local production build**, it's totally fine!

**Vercel environment** berbeda dari local environment, jadi:
- ✅ Build di Vercel pasti beda dari local
- ✅ Serverless functions di Vercel managed
- ✅ Env vars auto-injected by Vercel
- ✅ Database connection optimized untuk production

**Langsung push saja:**
```bash
git add .
git commit -m "Fix database adapter - Ready for Vercel"
git push origin main
```

Then monitor Vercel deployment logs! 📊

---

## ✅ Summary:

**Local Testing:**
- Use `npm run dev` untuk development
- Use `npm start` dengan env vars untuk production testing (optional)

**Vercel Deployment:**
- Just push to Git
- Set env vars di Vercel Dashboard
- Let Vercel handle the rest

**Don't overthink local production testing - Vercel environment is different anyway!** 🚀


