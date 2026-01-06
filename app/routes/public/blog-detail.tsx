import { motion } from 'framer-motion';
import { data } from 'react-router';
import ReactMarkdown from 'react-markdown';
import type { Route } from './+types/blog-detail';
import { db } from '~/lib/db.server';
import { generateMetaTags, generateBlogPostSchema } from '~/components/seo';
import { Navbar } from '~/components/navbar';
import { Footer } from '~/components/footer';
import { FloatingWhatsApp } from '~/components/floating-whatsapp';
import { fadeInUp } from '~/lib/animations';
import { Link } from 'react-router';

export async function loader({ params }: Route.LoaderArgs) {
  const [siteConfig, post] = await Promise.all([
    db.siteConfig.findFirst(),
    db.post.findUnique({
      where: { slug: params.slug },
    }),
  ]);

  if (!post || !post.published) {
    throw data('Post not found', { status: 404 });
  }

  return { siteConfig, post };
}

export function meta({ data }: Route.MetaArgs) {
  const post = data?.post;
  if (!post) {
    return [{ title: 'Post Not Found - UmrohKita' }];
  }

  const title = `${post.title} - UmrohKita`;
  const description = post.excerpt || post.content.substring(0, 160);

  return [
    { title },
    ...generateMetaTags({
      title,
      description,
      type: 'article',
      article: {
        publishedTime: post.publishedAt?.toString(),
      },
    }),
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(
        generateBlogPostSchema({
          title: post.title,
          description,
          image: '/images/og-default.jpg',
          publishedAt: post.publishedAt?.toString() || '',
          url: `https://umrohkita.com/blog/${post.slug}`,
        })
      ),
    },
  ];
}

export default function BlogDetail({ loaderData }: Route.ComponentProps) {
  const { siteConfig, post } = loaderData;

  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingWhatsApp phoneNumber={siteConfig?.whatsappNumber} />

      {/* Hero */}
      <motion.section
        className="pt-32 pb-16 px-4 bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container mx-auto max-w-4xl text-center">
           <Link to="/blog" className="inline-flex items-center text-blue-600 font-medium mb-8 hover:underline">
            ← Kembali ke Blog
           </Link>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Artikel</span>
             <span>•</span>
             <time>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </time>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-900 leading-tight tracking-tight">
            {post.title}
          </h1>
          {/* Featured Image Placeholder */}
           <div className="aspect-21/9 bg-gray-200 rounded-3xl overflow-hidden shadow-lg relative">
             <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-gray-100"></div>
           </div>
        </div>
      </motion.section>

      {/* Content */}
      <motion.article
        className="py-12 px-4 bg-white"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container mx-auto max-w-3xl">
          <div className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Share Buttons */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900 text-center">Bagikan Artikel Ini</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://umrohkita.com/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all hover:-translate-y-1 shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <span>Facebook</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `https://umrohkita.com/blog/${post.slug}`
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all hover:-translate-y-1 shadow-lg shadow-sky-500/20 flex items-center gap-2"
              >
                <span>Twitter</span>
              </a>
              {siteConfig?.whatsappNumber && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${post.title} - https://umrohkita.com/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all hover:-translate-y-1 shadow-lg shadow-green-500/20 flex items-center gap-2"
                >
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      <Footer config={siteConfig || undefined} />
    </div>
  );
}

