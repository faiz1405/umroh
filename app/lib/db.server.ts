// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pastikan connection string ada
const connectionString = process.env.DATABASE_URL || process.env.VITE_DB_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 👇 PERBAIKAN: Gunakan 'datasources'
    // Kunci 'db' harus sesuai dengan nama di schema.prisma (datasource db { ... })
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;