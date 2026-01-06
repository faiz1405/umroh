# Setup Instructions

## Important: Complete These Steps Before Running the Application

### 1. Database Setup

You need a Neon PostgreSQL database to run this application.

#### Option A: Create a New Neon Database

1. Visit [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string

#### Option B: Use Existing Neon Database

If you already have a Neon database, get your connection string from the dashboard.

### 2. Configure Environment Variables

1. Open the `.env` file in the root directory
2. Replace the placeholder `VITE_DB_URL` with your actual Neon connection string:

```env
VITE_DB_URL="postgresql://user:password@host/database?sslmode=require"
SESSION_SECRET="your-random-secret-key-here"
```

**Important**: Make sure to replace:
- `user` with your Neon username
- `password` with your Neon password
- `host` with your Neon host (e.g., `ep-xxx.us-east-2.aws.neon.tech`)
- `database` with your database name (usually `neondb`)

### 3. Run Database Migrations

After setting up your database connection, run:

```bash
npm run db:migrate
```

This will create all the necessary tables in your database.

### 4. Seed the Database (Optional but Recommended)

To populate the database with example data:

```bash
npm run db:seed
```

This will create:
- 1 admin user (email: `admin@example.com`, password: `admin123`)
- 1 site configuration with default values
- 4 example services
- 4 example blog posts
- 2 example contact messages

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 6. Login to Admin Panel

Visit `http://localhost:5173/login` and use:
- **Email**: admin@example.com
- **Password**: admin123

**⚠️ Important**: Change these credentials immediately after first login by:
1. Connecting to your database with Prisma Studio: `npm run db:studio`
2. Updating the user record with a new hashed password

---

## Troubleshooting

### Type Generation Errors

If you see errors about missing `+types` modules:

1. Start the dev server: `npm run dev`
2. The types will be auto-generated on first run
3. If issues persist, delete `.react-router` folder and restart dev server

### Database Connection Errors

- Verify your `VITE_DB_URL` is correct
- Ensure your Neon database is active (not suspended)
- Check that your IP is allowed (Neon allows all by default)

### Migration Errors

If migrations fail:

1. Check database connectivity
2. Verify Prisma schema syntax
3. Try resetting: `npx prisma migrate reset` (⚠️ This will delete all data!)

---

## Next Steps

After setup:

1. **Customize Site Config**: Visit `/admin/config` to edit hero text, contact info, and SEO
2. **Add Services**: Visit `/admin/services` to manage your service offerings
3. **Write Blog Posts**: Visit `/admin/posts` to create content
4. **Check Inbox**: Visit `/admin/inbox` to see contact form submissions

Enjoy building with UmrohKita! 🚀

