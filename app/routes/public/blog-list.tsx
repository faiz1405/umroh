import { motion } from 'framer-motion';
import { Link } from 'react-router';
import type { Route } from './+types/blog-list';
import { db } from '~/lib/db.server';
import { generateMetaTags } from '~/components/seo';
import { Navbar } from '~/components/navbar';
import { Footer } from '~/components/footer';
import { FloatingWhatsApp } from '~/components/floating-whatsapp';
import { fadeInUp, staggerContainer } from '~/lib/animations';

export async function loader() {
  const [siteConfig, posts] = await Promise.all([
    db.siteConfig.findFirst(),
    db.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    }),
  ]);

  return { siteConfig, posts };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Blog & Artikel - UmrohKita' },
    ...generateMetaTags({
      title: 'Blog & Artikel - UmrohKita',
      description:
        'Baca artikel, tips, dan panduan seputar persiapan umroh dan haji. Informasi bermanfaat untuk perjalanan ibadah Anda.',
    }),
  ];
}

export default function BlogList({ loaderData }: Route.ComponentProps) {
  const { siteConfig, posts } = loaderData;

  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingWhatsApp phoneNumber={siteConfig?.whatsappNumber} />

      {/* Hero */}
      <motion.section
        className="relative pt-32 pb-24 px-4 bg-linear-to-br from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] opacity-10 bg-repeat bg-center mix-blend-overlay"></div>
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm">
              Blog & Artikel
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Wawasan & Inspirasi
          </h1>
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
             Temukan artikel terbaru, tips persiapan ibadah, dan panduan lengkap seputar umroh dan haji.
          </p>
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum ada artikel</h3>
              <p className="text-gray-600 text-lg">
                Nantikan artikel inspiratif dari kami segera.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {posts.map((post) => (
                <motion.article key={post.id} variants={fadeInUp} className="h-full">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden">
                       <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
                    </div>
                    <div className="p-8 flex flex-col grow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          Artikel
                        </span>
                        <time className="text-sm text-gray-500">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : ''}
                        </time>
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-base line-clamp-3 leading-relaxed grow mb-6">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      <div className="mt-auto flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                        Baca Selengkapnya 
                        <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer config={siteConfig || undefined} />
    </div>
  );
}

