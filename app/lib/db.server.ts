// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Ambil URL dari environment
const connectionString = process.env.DATABASE_URL || process.env.VITE_DB_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 👇 PENTING: Ini fitur baru Prisma 7 pengganti url di schema
    datasourceUrl: connectionString, 
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;