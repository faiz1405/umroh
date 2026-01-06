import { useState } from 'react';
import { Form, useNavigate } from 'react-router';
import type { Route } from './+types/services';
import { db } from '~/lib/db.server';
import { requireAuth } from '~/lib/auth.server';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Package, Plus, PenSquare, Trash2 } from 'lucide-react';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  const services = await db.service.findMany({
    orderBy: { order: 'asc' },
  });

  return { services };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAuth(request);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'create') {
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const imageUrl = formData.get('imageUrl')?.toString() || '';
    const order = parseInt(formData.get('order')?.toString() || '0');

    await db.service.create({
      data: { title, description, imageUrl, order },
    });
  } else if (intent === 'update') {
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const imageUrl = formData.get('imageUrl')?.toString() || '';
    const order = parseInt(formData.get('order')?.toString() || '0');

    if (id) {
      await db.service.update({
        where: { id },
        data: { title, description, imageUrl, order },
      });
    }
  } else if (intent === 'delete') {
    const id = formData.get('id')?.toString();
    if (id) {
      await db.service.delete({ where: { id } });
    }
  }

  return { success: true };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Kelola Layanan - Admin UmrohKita' }];
}

export default function Services({ loaderData }: Route.ComponentProps) {
  const { services } = loaderData;
  const [editingService, setEditingService] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Layanan</h1>
          <p className="text-muted-foreground mt-2">Tambah, edit, atau hapus paket layanan</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Layanan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </DialogTitle>
            </DialogHeader>

            <Form method="post" onSubmit={() => setDialogOpen(false)}>
              <input
                type="hidden"
                name="intent"
                value={editingService ? 'update' : 'create'}
              />
              {editingService && (
                <input type="hidden" name="id" value={editingService.id} />
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul Layanan</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingService?.title || ''}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingService?.description || ''}
                    rows={6}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={editingService?.imageUrl || ''}
                    placeholder="/images/service.jpg"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="order">Urutan</Label>
                  <Input
                    type="number"
                    id="order"
                    name="order"
                    defaultValue={editingService?.order || 0}
                    className="mt-2"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingService ? 'Update Layanan' : 'Tambah Layanan'}
                </Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Layanan</CardTitle>
          <CardDescription>
            {services.length} layanan tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Belum ada layanan. Klik "Tambah Layanan Baru" untuk memulai.</p>
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.order}</TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setDialogOpen(true);
                          }}
                        >
                          <PenSquare className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Form method="post" style={{ display: 'inline' }}>
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={service.id} />
                          <Button
                            variant="destructive"
                            size="sm"
                            type="submit"
                            onClick={(e) => {
                              if (!confirm('Yakin ingin menghapus layanan ini?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </Form>
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

