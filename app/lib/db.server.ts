// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pastikan connection string ada
const connectionString = process.env.DATABASE_URL || process.env.VITE_DB_URL;

// #region agent log
fetch('http://127.0.0.1:7243/ingest/53c20ac2-d9eb-4c54-8700-f481c728cd83',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.server.ts:11',message:'DB init start',data:{hasDbUrl:!!process.env.DATABASE_URL,hasViteDbUrl:!!process.env.VITE_DB_URL,connectionStringExists:!!connectionString,nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
// #endregion

if (!connectionString) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/53c20ac2-d9eb-4c54-8700-f481c728cd83',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.server.ts:18',message:'No connection string',data:{error:'DATABASE_URL is not set'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  throw new Error('DATABASE_URL is not set');
}

// #region agent log
fetch('http://127.0.0.1:7243/ingest/53c20ac2-d9eb-4c54-8700-f481c728cd83',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.server.ts:25',message:'Before PrismaClient init with Neon adapter',data:{usingAdapter:true},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
// #endregion

let dbInstance: PrismaClient;
try {
  if (globalForPrisma.prisma) {
    dbInstance = globalForPrisma.prisma;
  } else {
    // Gunakan Neon adapter untuk serverless environment (Vercel)
    // PrismaNeon constructor menerima PoolConfig object, bukan Pool instance
    const adapter = new PrismaNeon({ connectionString });
    
    dbInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/53c20ac2-d9eb-4c54-8700-f481c728cd83',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.server.ts:44',message:'PrismaClient init SUCCESS with Neon adapter',data:{success:true},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
} catch (error) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/53c20ac2-d9eb-4c54-8700-f481c728cd83',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.server.ts:49',message:'PrismaClient init FAILED',data:{errorName:(error as Error).name,errorMessage:(error as Error).message},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  throw error;
}

export const db = dbInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;