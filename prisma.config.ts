import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || process.env.VITE_DB_URL,
    // Direct URL for migrations (same as pooled URL for Neon)
    directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.VITE_DB_URL,
  },
});

