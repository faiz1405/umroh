import 'dotenv/config';
import { createRequire } from 'module';
import type { PrismaClient as PrismaClientType } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Ensure Prisma sees DATABASE_URL (fallback from VITE_DB_URL)
if (!process.env.DATABASE_URL && process.env.VITE_DB_URL) {
  process.env.DATABASE_URL = process.env.VITE_DB_URL;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL or VITE_DB_URL must be set');
}

// Use CommonJS require so Prisma's generated CJS client works in ESM/Vite SSR
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../../generated/prisma') as typeof import('../../generated/prisma');

// Setup pg adapter for Neon PostgreSQL (works with Neon connection strings)
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}