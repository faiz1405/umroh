# UmrohKita - CMS Monolith

Sistem website monolith untuk layanan umroh dan haji yang terdiri dari Public Landing Page yang interaktif dan ramah SEO, serta Admin CMS yang aman untuk pengelolaan konten.

## Tech Stack

- **Framework**: React Router 7 (SSR + SPA)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **Animations**: Framer Motion
- **Authentication**: Custom session/cookie with bcrypt
- **Markdown Editor**: @uiw/react-md-editor

## Features

### Public Website
- 🏠 Homepage dengan Hero Section, Featured Services, Latest Articles, FAQ
- 📄 Halaman About, Services, Blog, Contact
- 📱 Responsive design untuk mobile, tablet, dan desktop
- ✨ Animasi smooth dengan Framer Motion
- 🔍 SEO optimized dengan meta tags dinamis dan JSON-LD schema
- 💬 Floating WhatsApp button
- 📧 Contact form dengan Optimistic UI

### Admin CMS
- 🔐 Secure authentication dengan session/cookie
- 📊 Dashboard dengan statistik
- ⚙️ Site Configuration (Hero, Kontak, SEO)
- 📦 Service Management (CRUD)
- 📝 Blog Post Management dengan Markdown editor
- 📧 Inbox untuk pesan dari contact form

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Neon PostgreSQL account ([console.neon.tech](https://console.neon.tech))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd umroh
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Then edit `.env` and add your Neon database URL:
```
VITE_DB_URL="postgresql://user:password@host/database?sslmode=require"
SESSION_SECRET="your-random-secret-key-here"
```

4. Run database migrations and seed:
```bash
npm run db:migrate
npm run db:seed
```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Default Admin Credentials

After seeding the database, you can login with:
- **Email**: admin@example.com
- **Password**: admin123

**⚠️ Change these credentials in production!**

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed database with example data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
app/
├── routes/
│   ├── public/          # Public pages (home, about, services, blog, contact)
│   ├── admin/           # Admin CMS pages (dashboard, config, services, posts, inbox)
│   ├── admin-layout.tsx # Admin layout with sidebar
│   ├── login.tsx        # Login page
│   └── logout.tsx       # Logout handler
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── navbar.tsx       # Public site navigation
│   ├── footer.tsx       # Footer with social links
│   ├── floating-whatsapp.tsx
│   ├── admin-sidebar.tsx
│   └── seo.tsx          # SEO utilities
├── lib/
│   ├── auth.server.ts   # Authentication utilities
│   ├── session.server.ts # Session management
│   ├── db.server.ts     # Prisma client singleton
│   └── animations.ts    # Framer Motion variants
└── routes.ts            # Route configuration
```

## Database Schema

- **User**: Admin users (email, password hashed with bcrypt)
- **SiteConfig**: Website configuration (hero, contact info, SEO)
- **Service**: Service offerings (title, description, image, order)
- **Post**: Blog posts (title, slug, content in Markdown, published status)
- **ContactMessage**: Messages from contact form (name, email, message, status)

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components for a consistent and modern design system.

## SEO

- Dynamic meta tags for all public pages
- JSON-LD structured data (Organization, BlogPosting, FAQPage)
- Automatic slug generation for blog posts
- Sitemap ready (optional implementation)

## Security

- Passwords hashed with bcrypt
- Session-based authentication
- Protected admin routes
- CSRF protection via React Router forms
- Environment variables for sensitive data

---

Built with ❤️ using React Router 7, Neon, and Prisma.
