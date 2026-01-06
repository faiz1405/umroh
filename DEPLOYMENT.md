# 🚀 Deployment Guide - Vercel

Panduan lengkap untuk deploy UmrohKita CMS ke Vercel dengan Neon PostgreSQL.

---

## Persiapan Sebelum Deploy

### 1. Pastikan Database Neon Sudah Siap

Kamu harus punya:
- ✅ Neon database aktif di [console.neon.tech](https://console.neon.tech)
- ✅ Connection string sudah dicatat
- ✅ Migrasi sudah berjalan di database (sudah ada tabel)

Jika belum, jalankan dulu:

```bash
npm run db:migrate
npm run db:seed
```

---

## Deploy ke Vercel

### Step 1: Install Vercel CLI (Opsional)

```bash
npm install -g vercel
```

Atau bisa langsung deploy via web dashboard.

---

### Step 2: Push ke Git Repository

Vercel butuh Git repo (GitHub/GitLab/Bitbucket).

```bash
git init
git add .
git commit -m "Initial commit - UmrohKita CMS"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

---

### Step 3: Import Project ke Vercel

#### Via Web Dashboard:

1. **Buka [vercel.com](https://vercel.com)** dan login
2. **Klik "Add New Project"**
3. **Import** repository kamu
4. **Configure Project:**
   - Framework Preset: **Other** (atau biarkan Auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `build/client`
   - Install Command: `npm install`

5. **Klik "Deploy"** (jangan khawatir kalau fail dulu, kita belum setup env vars)

#### Via CLI:

```bash
vercel
```

Ikuti prompt dan jawab:
- Setup and deploy? **Y**
- Which scope? Pilih account kamu
- Link to existing project? **N**
- Project name? **umrohkita** (atau nama lain)
- In which directory? **./** (Enter)
- Override settings? **Y**
  - Build Command: `npm run build`
  - Output Directory: `build/client`
  - Development Command: `npm run dev`

---

### Step 4: Set Environment Variables

Ini **PENTING!** Tanpa ini app tidak akan jalan.

#### Via Web Dashboard:

1. Buka project di Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Tambahkan variable berikut:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | Production, Preview, Development |
| `DIRECT_URL` | `postgresql://user:pass@host/db` (tanpa -pooler) | Production, Preview, Development |
| `SESSION_SECRET` | `your-random-secret-at-least-32-chars` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

**Catatan penting untuk Neon:**
- `DATABASE_URL`: Gunakan yang dengan `-pooler` untuk pooling connection
- `DIRECT_URL`: Gunakan yang tanpa `-pooler` untuk migrations

Contoh:
```
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=super-secret-key-change-this-to-random-string-min-32-chars
NODE_ENV=production
```

#### Via CLI:

```bash
vercel env add DATABASE_URL
# Paste connection string saat diminta

vercel env add DIRECT_URL
# Paste direct connection string

vercel env add SESSION_SECRET
# Paste random secret

vercel env add NODE_ENV
# Type: production
```

---

### Step 5: Run Migrations di Production

Setelah environment variables di-set, jalankan migrations di production database:

**Cara 1 - Via Local (Recommended):**

```bash
# Set env vars temporary di terminal
$env:DATABASE_URL="postgresql://..."  # Windows PowerShell
# atau
export DATABASE_URL="postgresql://..."  # Linux/Mac

# Run migration
npm run db:migrate:deploy

# Opsional: Seed production database
npm run db:seed
```

**Cara 2 - Via Vercel Build Hook:**

Vercel akan auto-run `postinstall` script yang sudah kita set (`prisma generate`), tapi migrations perlu di-run manual atau via CI/CD.

---

### Step 6: Redeploy

Setelah env vars dan migrations ready:

#### Via Web:
1. **Deployments** tab
2. **... (menu)** pada deployment terakhir
3. **Redeploy**

#### Via CLI:
```bash
vercel --prod
```

---

## Verify Deployment

Setelah deploy sukses:

1. **Buka URL production** (e.g., `https://umrohkita.vercel.app`)
2. **Test public pages:**
   - Homepage: `https://your-app.vercel.app/`
   - Blog: `https://your-app.vercel.app/blog`
   - Contact: `https://your-app.vercel.app/contact`

3. **Test admin login:**
   - Login: `https://your-app.vercel.app/login`
   - Credentials: `admin@example.com` / `admin123`

4. **Test CRUD operations** di admin panel

---

## Custom Domain (Opsional)

### Tambah Custom Domain:

1. **Vercel Dashboard** → **Settings** → **Domains**
2. **Add Domain**: `umrohkita.com`
3. **Configure DNS** di domain registrar:
   - Type: `CNAME`
   - Name: `@` (atau `www`)
   - Value: `cname.vercel-dns.com`

4. **Wait for DNS propagation** (5-30 menit)
5. **SSL auto-enabled** by Vercel

---

## Troubleshooting

### ❌ Build Failed - "Prisma generate error"

**Fix:**
- Pastikan `postinstall` script ada di `package.json`
- Pastikan env vars `DATABASE_URL` sudah di-set di Vercel

### ❌ Runtime Error - "Can't connect to database"

**Fix:**
- Verify `DATABASE_URL` di Vercel environment variables
- Pastikan database Neon aktif (tidak suspended)
- Test connection string secara manual

### ❌ 404 on Routes

**Fix:**
- Pastikan `vercel.json` ada dan benar
- Output directory: `build/client`
- Framework: Other atau React Router

### ❌ "PrismaClient is unable to be run in the browser"

**Fix:**
- Pastikan semua Prisma imports ada `.server.ts` extension
- Jangan import Prisma di client components

### ❌ Session/Auth Not Working

**Fix:**
- Pastikan `SESSION_SECRET` sudah di-set
- Minimal 32 characters
- Harus sama across all deployments

---

## Update Production

Setiap kali push ke Git:

```bash
git add .
git commit -m "Update feature XYZ"
git push origin main
```

Vercel akan **auto-deploy** branch `main` ke production.

### Manual Deploy:

```bash
vercel --prod
```

---

## Database Migrations in Production

Setiap kali ada perubahan schema:

```bash
# 1. Buat migration di local
npm run db:migrate

# 2. Test di local dulu
npm run dev

# 3. Deploy migration ke production
$env:DATABASE_URL="<production-url>"
npm run db:migrate:deploy

# 4. Push code ke Git
git push origin main
```

---

## Environment Variables Reference

### Required (Wajib):

```env
DATABASE_URL=postgresql://user:pass@host-pooler.region.aws.neon.tech/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host.region.aws.neon.tech/db?sslmode=require
SESSION_SECRET=random-secret-min-32-characters
NODE_ENV=production
```

### Optional:

```env
# Jika pakai Neon Accelerate (caching)
# ACCELERATE_URL=prisma://accelerate.prisma-data.net/?api_key=...

# Jika pakai custom analytics
# ANALYTICS_ID=...
```

---

## Production Checklist

Sebelum go-live, pastikan:

- ✅ Environment variables sudah di-set
- ✅ Database migrations sudah di-run
- ✅ Database sudah di-seed (atau content sudah ada)
- ✅ Admin password sudah diganti dari default
- ✅ Site config sudah diupdate (hero, contact, social links)
- ✅ Test all pages (public + admin)
- ✅ Test CRUD operations
- ✅ Test contact form
- ✅ Test login/logout
- ✅ Custom domain configured (jika ada)
- ✅ SSL certificate aktif (auto by Vercel)

---

## Performance Tips

### 1. Optimize Images

Gunakan CDN untuk images (Cloudinary, ImageKit, dll):

```tsx
// Ganti hardcoded imageUrl dengan CDN
imageUrl: "https://res.cloudinary.com/your-cloud/image/upload/v1/umroh-regular.jpg"
```

### 2. Enable Neon Pooling

Connection string di `DATABASE_URL` harus pakai `-pooler`:

```
postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/db
```

### 3. Prisma Connection Pool

Di production, Vercel functions stateless jadi Prisma sudah handle pooling otomatis.

---

## Monitoring

### Vercel Dashboard:

- **Analytics**: Traffic, performance
- **Logs**: Runtime errors
- **Deployments**: Deploy history

### Neon Dashboard:

- **Monitoring**: Database queries, connections
- **Branching**: Create preview databases

---

## Backup Strategy

### Database Backups:

Neon auto-backup dengan Point-in-Time Recovery:
- Retention: 7 hari (Free tier)
- Restoration: Via Neon Console

### Code Backups:

- Git repository (GitHub/GitLab) = source of truth
- Vercel deployment history

---

## Cost Estimation

### Vercel (Hobby - Free):

- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions

Upgrade ke Pro ($20/month) jika butuh:
- Custom domain
- More bandwidth
- Team collaboration

### Neon (Free Tier):

- ✅ 0.5 GB storage
- ✅ 191 compute hours/month
- ✅ Auto-suspend after 5 min idle
- ✅ 1 project

Upgrade ke Scale ($0.16/GB + $0.102/compute hour) jika butuh:
- More storage
- Always-on compute
- Multiple projects

**Total: $0 untuk start!** 🎉

---

## Next Steps

Setelah deploy:

1. **Share URL** ke tim/client
2. **Update site config** via `/admin/config`
3. **Add real content** (services, blog posts)
4. **Setup monitoring/alerts**
5. **Configure custom domain**
6. **Setup backups strategy**
7. **Add more admins** (via Prisma Studio)

---

Selamat! UmrohKita CMS sudah live di production! 🚀

Butuh bantuan? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [React Router Docs](https://reactrouter.com/en/main)
- [Prisma Docs](https://www.prisma.io/docs)

