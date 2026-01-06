import { createCookieSessionStorage } from 'react-router';

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

// Session storage configuration
const { getSession, commitSession, destroySession } = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret-change-in-production'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export { getSession, commitSession, destroySession };

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await getSession();
  session.set('userId', userId);
  
  return {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
    redirect: redirectTo,
  };
}

export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  return userId || null;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = '/login'
): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response('Unauthorized', {
      status: 302,
      headers: {
        Location: redirectTo,
      },
    });
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
    redirect: '/login',
  };
}

