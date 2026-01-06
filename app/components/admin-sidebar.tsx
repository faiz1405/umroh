import { Link, useLocation } from 'react-router';
import { Form } from 'react-router';
import { cn } from '~/lib/utils';
import { LayoutDashboard, Settings, Package, FileText, Inbox, LogOut, Home } from 'lucide-react';

export function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/config', label: 'Konfigurasi', icon: Settings },
    { to: '/admin/services', label: 'Layanan', icon: Package },
    { to: '/admin/posts', label: 'Blog Posts', icon: FileText },
    { to: '/admin/inbox', label: 'Inbox', icon: Inbox },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-4 w-4" />
            </div>
            <span className="text-lg">UmrohKita</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

