// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pastikan connection string ada
const connectionString = process.env.DATABASE_URL || process.env.VITE_DB_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

let dbInstance: PrismaClient;
if (globalForPrisma.prisma) {
  dbInstance = globalForPrisma.prisma;
} else {

  const adapter = new PrismaNeon({ connectionString });
  
  dbInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const db = dbInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;