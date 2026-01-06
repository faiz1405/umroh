import { useState, useEffect } from 'react';
import { Form, useFetcher } from 'react-router';
import type { Route } from './+types/inbox';
import { db } from '~/lib/db.server';
import { requireAuth } from '~/lib/auth.server';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { Mail, MailOpen, Eye, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return { messages };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAuth(request);

  const formData = await request.formData();
  const intent = formData.get('intent');
  const id = formData.get('id')?.toString();

  if (intent === 'mark-read' && id) {
    await db.contactMessage.update({
      where: { id },
      data: { status: 'READ' },
    });
    return { success: true, message: 'Pesan ditandai sebagai sudah dibaca' };
  } else if (intent === 'mark-unread' && id) {
    await db.contactMessage.update({
      where: { id },
      data: { status: 'UNREAD' },
    });
    return { success: true, message: 'Pesan ditandai sebagai belum dibaca' };
  } else if (intent === 'delete' && id) {
    await db.contactMessage.delete({ where: { id } });
    return { success: true, message: 'Pesan berhasil dihapus' };
  }

  return { success: true };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Inbox - Admin UmrohKita' }];
}

export default function Inbox({ loaderData }: Route.ComponentProps) {
  const { messages } = loaderData;
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground mt-2">
          {unreadCount > 0 ? (
            <span className="font-medium text-orange-600">
              Anda memiliki {unreadCount} pesan yang belum dibaca
            </span>
          ) : (
            'Semua pesan telah dibaca'
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesan Masuk</CardTitle>
          <CardDescription>
            {messages.length} pesan total • {unreadCount} belum dibaca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Pesan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Belum ada pesan masuk.</p>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={
                      message.status === 'UNREAD' ? 'bg-blue-50/50 dark:bg-blue-950/20 font-medium' : ''
                    }
                  >
                    <TableCell>
                      {message.status === 'UNREAD' ? (
                        <Badge variant="default" className="gap-1">
                          <Mail className="h-3 w-3" />
                          Baru
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <MailOpen className="h-3 w-3" />
                          Dibaca
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell className="text-muted-foreground">{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {message.message}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Sheet
                          open={sheetOpen && selectedMessage?.id === message.id}
                          onOpenChange={(open) => {
                            setSheetOpen(open);
                            if (!open) setSelectedMessage(null);
                          }}
                        >
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMessage(message);
                                setSheetOpen(true);
                                // Auto mark as read when viewing
                                if (message.status === 'UNREAD') {
                                  const formData = new FormData();
                                  formData.append('intent', 'mark-read');
                                  formData.append('id', message.id);
                                  fetch('', { method: 'POST', body: formData });
                                }
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Lihat
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Detail Pesan</SheetTitle>
                            </SheetHeader>
                            {selectedMessage && (
                              <div className="mt-6 space-y-6">
                                <div>
                                  <label className="text-sm font-semibold text-muted-foreground">
                                    Nama
                                  </label>
                                  <p className="mt-1 text-base">{selectedMessage.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-muted-foreground">
                                    Email
                                  </label>
                                  <p className="mt-1">
                                    <a
                                      href={`mailto:${selectedMessage.email}`}
                                      className="text-primary hover:underline"
                                    >
                                      {selectedMessage.email}
                                    </a>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-muted-foreground">
                                    Tanggal
                                  </label>
                                  <p className="mt-1 text-base">
                                    {new Date(selectedMessage.createdAt).toLocaleString(
                                      'id-ID',
                                      {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-semibold text-muted-foreground">
                                    Pesan
                                  </label>
                                  <p className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap text-base">
                                    {selectedMessage.message}
                                  </p>
                                </div>
                                <div className="pt-4 border-t space-y-2">
                                  <InboxSheetMarkReadButton message={selectedMessage} />
                                  <InboxSheetDeleteButton 
                                    message={selectedMessage} 
                                    onDelete={() => setSheetOpen(false)} 
                                  />
                                </div>
                              </div>
                            )}
                          </SheetContent>
                        </Sheet>

                        <InboxMarkReadButton message={message} />
                      </div>
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function InboxMarkReadButton({ message }: { message: any }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.data && 'success' in fetcher.data && fetcher.data.success && 'message' in fetcher.data && typeof fetcher.data.message === 'string') {
      toast.success(fetcher.data.message);
    }
    if (fetcher.data && 'error' in fetcher.data && fetcher.data.error && typeof fetcher.data.error === 'string') {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" style={{ display: 'inline' }}>
      <input
        type="hidden"
        name="intent"
        value={message.status === 'READ' ? 'mark-unread' : 'mark-read'}
      />
      <input type="hidden" name="id" value={message.id} />
      <Button variant="outline" size="sm" type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Memproses...
          </>
        ) : message.status === 'READ' ? (
          <>
            <Mail className="h-4 w-4 mr-1" />
            Tandai Baru
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Tandai Dibaca
          </>
        )}
      </Button>
    </fetcher.Form>
  );
}

function InboxSheetMarkReadButton({ message }: { message: any }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.data && 'success' in fetcher.data && fetcher.data.success && 'message' in fetcher.data && typeof fetcher.data.message === 'string') {
      toast.success(fetcher.data.message);
    }
    if (fetcher.data && 'error' in fetcher.data && fetcher.data.error && typeof fetcher.data.error === 'string') {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post">
      <input
        type="hidden"
        name="intent"
        value={message.status === 'READ' ? 'mark-unread' : 'mark-read'}
      />
      <input type="hidden" name="id" value={message.id} />
      <Button
        type="submit"
        variant="outline"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Memproses...
          </>
        ) : message.status === 'READ' ? (
          <>
            <Mail className="h-4 w-4 mr-2" />
            Tandai Belum Dibaca
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Tandai Sudah Dibaca
          </>
        )}
      </Button>
    </fetcher.Form>
  );
}

function InboxSheetDeleteButton({ 
  message, 
  onDelete 
}: { 
  message: any; 
  onDelete: () => void;
}) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.message) {
      toast.success(fetcher.data.message);
      onDelete();
    }
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, onDelete]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="delete" />
      <input type="hidden" name="id" value={message.id} />
      <Button
        type="submit"
        variant="destructive"
        className="w-full"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm('Yakin ingin menghapus pesan ini?')) {
            e.preventDefault();
          }
        }}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Menghapus...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Pesan
          </>
        )}
      </Button>
    </fetcher.Form>
  );
}

