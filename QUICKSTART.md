# 🚀 Quick Start Guide

Get UmrohKita CMS up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL account (free tier available)

## Step 1: Get Your Neon Database

1. Visit [console.neon.tech](https://console.neon.tech)
2. Create a new project (or use existing)
3. Copy your connection string

It looks like:
```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Step 2: Configure Environment

Open the `.env` file and paste your connection string:

```env
VITE_DB_URL="postgresql://your-actual-connection-string-here"
SESSION_SECRET="change-this-to-a-random-secret"
```

## Step 3: Setup Database

Run these commands:

```bash
# Install dependencies (if not already done)
npm install

# Run migrations (creates tables)
npm run db:migrate

# Seed database (adds example data)
npm run db:seed
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Access the Application

Open your browser to:

- **Public Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/login

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## Step 6: Customize Your Site

After logging in:

1. **Site Configuration** (`/admin/config`)
   - Update hero title and subtitle
   - Add your WhatsApp number (format: 6281234567890)
   - Add social media URLs
   - Set SEO meta tags

2. **Services** (`/admin/services`)
   - Edit or add your service packages
   - Set the order for display

3. **Blog Posts** (`/admin/posts`)
   - Write your first article
   - Use Markdown for formatting
   - Publish when ready

4. **Check Inbox** (`/admin/inbox`)
   - View messages from the contact form

## What's Included Out of the Box

✅ **4 Example Services**: Umroh Regular, Umroh Plus, Umroh VIP, Haji  
✅ **4 Example Blog Posts**: Ready to edit or replace  
✅ **Responsive Design**: Works on mobile, tablet, desktop  
✅ **SEO Optimized**: Meta tags and structured data  
✅ **Animations**: Smooth Framer Motion effects  
✅ **Markdown Editor**: Write rich blog content  

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run db:studio

# Check types
npm run typecheck
```

## Troubleshooting

### "Database connection failed"
- Check your `VITE_DB_URL` in `.env`
- Ensure your Neon database is active
- Verify the connection string format

### "Module not found: +types"
- Just start the dev server: `npm run dev`
- Types are auto-generated on first run

### "Cannot login"
- Make sure you ran `npm run db:seed`
- Default credentials: admin@example.com / admin123
- Check browser console for errors

## Need Help?

- Read the full [SETUP.md](SETUP.md) for detailed instructions
- Check [README.md](README.md) for project overview
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

---

Happy building! 🎉

