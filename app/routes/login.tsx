import { Form, redirect } from 'react-router';
import { motion } from 'framer-motion';
import type { Route } from './+types/login';
import { verifyLogin } from '~/lib/auth.server';
import { createUserSession, getUserId } from '~/lib/session.server';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { fadeInUp } from '~/lib/animations';

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect('/admin');
  }
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email dan password harus diisi' };
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return { error: 'Email atau password salah' };
  }

  const session = await createUserSession(user.id, '/admin');
  return redirect('/admin', {
    headers: session.headers,
  });
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Login Admin - UmrohKita' }];
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Masuk ke panel administrasi UmrohKita
          </p>
        </div>

        {actionData?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-2"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Masuk
          </Button>
        </Form>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ← Kembali ke Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}

