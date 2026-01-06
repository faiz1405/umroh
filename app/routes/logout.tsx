import { redirect } from 'react-router';
import type { Route } from './+types/logout';
import { logout } from '~/lib/session.server';

export async function action({ request }: Route.ActionArgs) {
  const result = await logout(request);
  return redirect(result.redirect, {
    headers: result.headers,
  });
}

export async function loader() {
  return redirect('/login');
}

