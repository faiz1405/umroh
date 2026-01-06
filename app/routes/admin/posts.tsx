import { useState } from 'react';
import { Form, Link } from 'react-router';
import slugify from 'slugify';
import type { Route } from './+types/posts';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { PenSquare, Eye, Trash2, FileText } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return { posts };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAuth(request);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'create') {
    const title = formData.get('title')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const excerpt = formData.get('excerpt')?.toString() || '';
    const published = formData.get('published') === 'on';
    const slug = slugify(title, { lower: true, strict: true });

    await db.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        publishedAt: published ? new Date() : null,
      },
    });
  } else if (intent === 'update') {
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const excerpt = formData.get('excerpt')?.toString() || '';
    const published = formData.get('published') === 'on';
    const slug = slugify(title, { lower: true, strict: true });

    if (id) {
      const currentPost = await db.post.findUnique({ where: { id } });
      await db.post.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          excerpt,
          published,
          publishedAt:
            published && !currentPost?.published ? new Date() : currentPost?.publishedAt,
        },
      });
    }
  } else if (intent === 'delete') {
    const id = formData.get('id')?.toString();
    if (id) {
      await db.post.delete({ where: { id } });
    }
  } else if (intent === 'toggle-publish') {
    const id = formData.get('id')?.toString();
    if (id) {
      const post = await db.post.findUnique({ where: { id } });
      if (post) {
        await db.post.update({
          where: { id },
          data: {
            published: !post.published,
            publishedAt: !post.published ? new Date() : post.publishedAt,
          },
        });
      }
    }
  }

  return { success: true };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Kelola Blog Posts - Admin UmrohKita' }];
}

export default function Posts({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const [editingPost, setEditingPost] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Tulis, edit, atau hapus artikel blog</p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setMarkdownContent('');
              setEditingPost(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPost(null);
                setMarkdownContent('');
              }}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Tulis Artikel Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </DialogTitle>
            </DialogHeader>

            <Form
              method="post"
              onSubmit={() => {
                setDialogOpen(false);
                setMarkdownContent('');
              }}
            >
              <input
                type="hidden"
                name="intent"
                value={editingPost ? 'update' : 'create'}
              />
              {editingPost && (
                <input type="hidden" name="id" value={editingPost.id} />
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul Artikel</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingPost?.title || ''}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt (Ringkasan)</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    defaultValue={editingPost?.excerpt || ''}
                    rows={2}
                    placeholder="Ringkasan singkat artikel..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Konten (Markdown)</Label>
                  <div className="mt-2" data-color-mode="light">
                    <MDEditor
                      value={markdownContent || editingPost?.content || ''}
                      onChange={(val) => setMarkdownContent(val || '')}
                      height={400}
                    />
                    <textarea
                      name="content"
                      value={markdownContent || editingPost?.content || ''}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    defaultChecked={editingPost?.published || false}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Publikasikan artikel ini
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  {editingPost ? 'Update Artikel' : 'Tambah Artikel'}
                </Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>
            {posts.length} artikel total • {posts.filter(p => p.published).length} dipublikasikan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Belum ada artikel. Klik "Tulis Artikel Baru" untuk memulai.</p>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {post.published && (
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="inline-block"
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Lihat
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPost(post);
                            setMarkdownContent(post.content);
                            setDialogOpen(true);
                          }}
                        >
                          <PenSquare className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Form method="post" style={{ display: 'inline' }}>
                          <input type="hidden" name="intent" value="toggle-publish" />
                          <input type="hidden" name="id" value={post.id} />
                          <Button variant="outline" size="sm" type="submit">
                            {post.published ? 'Unpublish' : 'Publish'}
                          </Button>
                        </Form>
                        <Form method="post" style={{ display: 'inline' }}>
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="id" value={post.id} />
                          <Button
                            variant="destructive"
                            size="sm"
                            type="submit"
                            onClick={(e) => {
                              if (!confirm('Yakin ingin menghapus artikel ini?')) {
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

