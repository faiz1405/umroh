import { Link } from 'react-router';
import type { Route } from './+types/dashboard';
import { db } from '~/lib/db.server';
import { requireAuth } from '~/lib/auth.server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Package, FileText, CheckCircle2, Mail, Settings, PenSquare, Inbox } from 'lucide-react';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  const [totalServices, totalPosts, publishedPosts, unreadMessages] =
    await Promise.all([
      db.service.count(),
      db.post.count(),
      db.post.count({ where: { published: true } }),
      db.contactMessage.count({ where: { status: 'UNREAD' } }),
    ]);

  return {
    stats: {
      totalServices,
      totalPosts,
      publishedPosts,
      unreadMessages,
    },
  };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard - Admin UmrohKita' }];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData;

  const statCards = [
    {
      title: 'Total Layanan',
      value: stats.totalServices,
      description: 'Paket layanan tersedia',
      icon: Package,
      trend: '+12.5%',
      trendText: 'dari bulan lalu',
      className: 'text-blue-600',
    },
    {
      title: 'Total Artikel',
      value: stats.totalPosts,
      description: 'Artikel blog',
      icon: FileText,
      trend: '+8.2%',
      trendText: 'dari bulan lalu',
      className: 'text-green-600',
    },
    {
      title: 'Artikel Published',
      value: stats.publishedPosts,
      description: 'Artikel yang dipublikasikan',
      icon: CheckCircle2,
      trend: `${Math.round((stats.publishedPosts / Math.max(stats.totalPosts, 1)) * 100)}%`,
      trendText: 'dari total artikel',
      className: 'text-purple-600',
    },
    {
      title: 'Pesan Belum Dibaca',
      value: stats.unreadMessages,
      description: 'Pesan menunggu respons',
      icon: Mail,
      trend: stats.unreadMessages > 0 ? 'Perlu perhatian' : 'Semua terbaca',
      trendText: '',
      className: stats.unreadMessages > 0 ? 'text-orange-600' : 'text-gray-600',
    },
  ];

  const quickActions = [
    {
      title: 'Kelola Layanan',
      description: 'Tambah atau edit paket layanan',
      href: '/admin/services',
      icon: Package,
      className: 'hover:border-blue-500 hover:bg-blue-50',
    },
    {
      title: 'Kelola Blog',
      description: 'Tulis atau edit artikel blog',
      href: '/admin/posts',
      icon: PenSquare,
      className: 'hover:border-green-500 hover:bg-green-50',
    },
    {
      title: 'Inbox',
      description: 'Lihat pesan dari pengunjung',
      href: '/admin/inbox',
      icon: Inbox,
      className: 'hover:border-orange-500 hover:bg-orange-50',
    },
    {
      title: 'Konfigurasi',
      description: 'Edit pengaturan website',
      href: '/admin/config',
      icon: Settings,
      className: 'hover:border-purple-500 hover:bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang di panel administrasi UmrohKita
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.className}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                {card.trend && (
                  <div className="flex items-center mt-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {card.trend}
                    </span>
                    {card.trendText && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {card.trendText}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Akses cepat ke fitur-fitur utama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${action.className}`}
                >
                  <div className={`p-2 rounded-md bg-muted`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold leading-none">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

