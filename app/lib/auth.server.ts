import bcrypt from 'bcryptjs';
import { db } from './db.server';
import { getUserId } from './session.server';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function verifyLogin(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return { id: user.id, email: user.email };
}

export async function getSessionUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  return user;
}

export async function requireAuth(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    throw new Response('Unauthorized', {
      status: 302,
      headers: {
        Location: '/login',
      },
    });
  }
  return user;
}

