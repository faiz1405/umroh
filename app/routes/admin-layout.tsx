import { Outlet } from 'react-router';
import type { Route } from './+types/admin-layout';
import { requireAuth } from '~/lib/auth.server';
import { AdminSidebar } from '~/components/admin-sidebar';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  return { user };
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

