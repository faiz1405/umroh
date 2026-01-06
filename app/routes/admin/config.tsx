import { useEffect } from 'react';
import { Form, useNavigation, useFetcher, useActionData } from 'react-router';
import type { Route } from './+types/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { db } from '~/lib/db.server';
import { requireAuth } from '~/lib/auth.server';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  let siteConfig = await db.siteConfig.findFirst();
  const heroSlides = await db.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

  // Create default config if doesn't exist
  if (!siteConfig) {
    siteConfig = await db.siteConfig.create({
      data: {
        id: '1',
        heroTitle: 'Wujudkan Ibadah Impian Anda',
        heroSubtitle: 'Layanan Umroh & Haji Terpercaya dengan Fasilitas Terbaik',
        heroImage: '',
        whatsappNumber: '',
        facebookUrl: '',
        instagramUrl: '',
        metaTitleTemplate: 'UmrohKita',
        metaDescription: 'Layanan umroh dan haji terpercaya',
      },
    });
  }

  return { siteConfig, heroSlides };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAuth(request);

  const formData = await request.formData();
  const intent = formData.get('_action')?.toString() || 'updateSiteConfig';

  if (intent === 'updateSiteConfig') {
  const data = {
    heroTitle: formData.get('heroTitle')?.toString() || '',
    heroSubtitle: formData.get('heroSubtitle')?.toString() || '',
    heroImage: formData.get('heroImage')?.toString() || '',
    whatsappNumber: formData.get('whatsappNumber')?.toString() || '',
    facebookUrl: formData.get('facebookUrl')?.toString() || '',
    instagramUrl: formData.get('instagramUrl')?.toString() || '',
    metaTitleTemplate: formData.get('metaTitleTemplate')?.toString() || '',
    metaDescription: formData.get('metaDescription')?.toString() || '',
  };

  const existing = await db.siteConfig.findFirst();
  if (existing) {
    await db.siteConfig.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await db.siteConfig.create({
      data: { ...data, id: '1' },
    });
  }

  return { success: true, message: 'Konfigurasi berhasil disimpan' };
  }

  if (intent === 'createHeroSlide') {
    const imageUrlField = formData.get('imageUrl')?.toString().trim() || '';
    const imageFile = formData.get('imageFile');
    const orderRaw = formData.get('order')?.toString() || '0';
    const order = Number.isNaN(Number(orderRaw)) ? 0 : Number(orderRaw);

    let imageUrl = imageUrlField;

    if (imageFile && typeof imageFile !== 'string') {
      const file = imageFile as File;
      if (file.size > 0) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'hero-slides');
        await fs.mkdir(uploadsDir, { recursive: true });

        const originalName = file.name || 'hero-slide.jpg';
        const safeName = originalName.replace(/[^a-z0-9.\-]/gi, '_').toLowerCase();
        const filename = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadsDir, filename);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(filePath, buffer);

        imageUrl = `/uploads/hero-slides/${filename}`;
      }
    }

    if (imageUrl) {
      await db.heroSlide.create({
        data: {
          imageUrl,
          order,
        },
      });
      return { success: true, message: 'Slide berhasil ditambahkan' };
    }

    return { success: false, error: 'Gambar tidak valid' };
  }

  if (intent === 'updateHeroSlideOrder') {
    const id = formData.get('id')?.toString();
    const orderRaw = formData.get('order')?.toString() || '0';
    const order = Number.isNaN(Number(orderRaw)) ? 0 : Number(orderRaw);

    if (id) {
      await db.heroSlide.update({
        where: { id },
        data: { order },
      });
      return { success: true, message: 'Urutan slide berhasil diperbarui' };
    }

    return { success: false, error: 'Slide tidak ditemukan' };
  }

  if (intent === 'deleteHeroSlide') {
    const id = formData.get('id')?.toString();

    if (id) {
      await db.heroSlide.delete({
        where: { id },
      });
      return { success: true, message: 'Slide berhasil dihapus' };
    }

    return { success: false, error: 'Slide tidak ditemukan' };
  }

  return { success: false };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Konfigurasi Website - Admin UmrohKita' }];
}

export default function Config({ loaderData, actionData }: Route.ComponentProps) {
  const { siteConfig, heroSlides } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData && 'success' in actionData && actionData.success && 'message' in actionData && typeof actionData.message === 'string') {
      toast.success(actionData.message);
    }
    if (actionData && 'error' in actionData && actionData.error && typeof actionData.error === 'string') {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Konfigurasi Website</h1>
        <p className="text-muted-foreground mt-2">
          Edit pengaturan umum website dan informasi kontak
        </p>
      </div>

      <Form method="post">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Konfigurasi bagian hero di halaman utama
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Judul Hero</Label>
                <Input
                  type="text"
                  id="heroTitle"
                  name="heroTitle"
                  defaultValue={siteConfig.heroTitle}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Sub-judul Hero</Label>
                <Input
                  type="text"
                  id="heroSubtitle"
                  name="heroSubtitle"
                  defaultValue={siteConfig.heroSubtitle}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="heroImage">URL Gambar Hero</Label>
                <Input
                  type="text"
                  id="heroImage"
                  name="heroImage"
                  defaultValue={siteConfig.heroImage}
                  placeholder="/images/hero.jpg"
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Informasi kontak dan media sosial
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
                <Input
                  type="text"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  defaultValue={siteConfig.whatsappNumber}
                  placeholder="6281234567890"
                  disabled={isSubmitting}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format: 6281234567890 (dengan kode negara, tanpa +)
                </p>
              </div>

              <div>
                <Label htmlFor="facebookUrl">URL Facebook</Label>
                <Input
                  type="text"
                  id="facebookUrl"
                  name="facebookUrl"
                  defaultValue={siteConfig.facebookUrl}
                  placeholder="https://facebook.com/umrohkita"
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="instagramUrl">URL Instagram</Label>
                <Input
                  type="text"
                  id="instagramUrl"
                  name="instagramUrl"
                  defaultValue={siteConfig.instagramUrl}
                  placeholder="https://instagram.com/umrohkita"
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Pengaturan SEO untuk optimasi mesin pencari
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitleTemplate">Template Title</Label>
                <Input
                  type="text"
                  id="metaTitleTemplate"
                  name="metaTitleTemplate"
                  defaultValue={siteConfig.metaTitleTemplate}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={siteConfig.metaDescription}
                  rows={3}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <input type="hidden" name="_action" value="updateSiteConfig" />

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </Button>
        </div>
      </Form>

      {/* Hero Slider Management */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Slider (Banner)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola gambar slider di halaman utama. Gunakan URL gambar (misalnya dari CDN atau storage)
              dan atur urutan tampilnya.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Create new slide */}
            <Form
              method="post"
              encType="multipart/form-data"
              className="space-y-4 border rounded-lg p-4 bg-muted/50"
            >
              <div className="grid md:grid-cols-[2fr_1fr] gap-4">
                <div>
                  <Label htmlFor="imageFile">Upload Gambar</Label>
                  <Input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Gambar horizontal resolusi tinggi (disarankan minimal 1600x900).
                  </p>
                </div>
                <div>
                  <Label htmlFor="imageUrl">URL Gambar (opsional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    placeholder="https://.../banner.jpg"
                    disabled={isSubmitting}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Jika diisi, URL akan digunakan. Jika kosong, gunakan gambar upload.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                <div className="md:w-40">
                  <Label htmlFor="order">Urutan</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min={0}
                    defaultValue={heroSlides.length}
                    disabled={isSubmitting}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Angka paling kecil akan tampil lebih dulu.
                  </p>
                </div>
                <div className="md:ml-auto">
                  <input type="hidden" name="_action" value="createHeroSlide" />
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menambahkan...
                      </>
                    ) : (
                      'Tambah Slide'
                    )}
                  </Button>
                </div>
              </div>
            </Form>

            {/* Existing slides list */}
            {heroSlides.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Daftar Slide</h3>
                <div className="space-y-3">
                  {heroSlides.map((slide: any) => (
                    <div
                      key={slide.id}
                      className="flex flex-col md:flex-row gap-4 items-center border rounded-lg p-3 bg-card"
                    >
                      <div
                        className="w-full md:w-48 h-24 rounded-md bg-gray-100 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                      />
                      <div className="flex-1 w-full">
                        <p className="text-sm font-mono break-all text-muted-foreground">
                          {slide.imageUrl}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                        <HeroSlideOrderForm slide={slide} />
                        <HeroSlideDeleteButton slide={slide} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada slide. Tambahkan minimal satu gambar untuk mengisi banner slider.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HeroSlideOrderForm({ slide }: { slide: any }) {
  const fetcher = useFetcher();
  const isPending = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post" className="flex items-center gap-2">
      <Input
        type="number"
        name="order"
        defaultValue={slide.order}
        disabled={isPending}
        className="w-20 text-sm"
      />
      <input type="hidden" name="id" value={slide.id} />
      <input type="hidden" name="_action" value="updateHeroSlideOrder" />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Menyimpan...
          </>
        ) : (
          'Simpan'
        )}
      </Button>
    </fetcher.Form>
  );
}

function HeroSlideDeleteButton({ slide }: { slide: any }) {
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
      <input type="hidden" name="id" value={slide.id} />
      <input type="hidden" name="_action" value="deleteHeroSlide" />
      <Button
        type="submit"
        size="sm"
        variant="destructive"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Menghapus...
          </>
        ) : (
          'Hapus'
        )}
      </Button>
    </fetcher.Form>
  );
}

