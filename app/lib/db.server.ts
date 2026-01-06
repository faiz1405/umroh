import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.VITE_DB_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is missing from environment variables');
  throw new Error('DATABASE_URL is not set. Please configure it in your environment variables.');
}

console.log(`🔌 Initializing database connection... (Length: ${connectionString.length})`);

// Setup Neon serverless adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
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