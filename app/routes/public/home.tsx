import { motion } from 'framer-motion';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { db } from '~/lib/db.server';
import {
  generateMetaTags,
  generateOrganizationSchema,
  generateFAQSchema,
} from '~/components/seo';
import { Navbar } from '~/components/navbar';
import { Footer } from '~/components/footer';
import { FloatingWhatsApp } from '~/components/floating-whatsapp';
import { fadeInUp, staggerContainer } from '~/lib/animations';
import { HeroSlider } from '~/components/hero-slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

export async function loader() {
  const [siteConfig, services, posts, heroSlides] = await Promise.all([
    db.siteConfig.findFirst(),
    db.service.findMany({
      orderBy: { order: 'asc' },
      take: 4,
    }),
    db.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    db.heroSlide.findMany({
      orderBy: { order: 'asc' },
    }),
  ]);

  return { siteConfig, services, posts, heroSlides };
}

export function meta({ data }: Route.MetaArgs) {
  const config = data?.siteConfig;
  const title = config?.heroTitle || 'UmrohKita - Layanan Umroh & Haji Terpercaya';
  const description =
    config?.metaDescription ||
    'Layanan umroh dan haji terpercaya dengan fasilitas terbaik dan harga terjangkau';

  return [
    { title },
    ...generateMetaTags({ title, description }),
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(generateOrganizationSchema()),
    },
    {
      tagName: 'script',
      type: 'application/ld+json',
      children: JSON.stringify(
        generateFAQSchema([
          {
            question: 'Apa saja dokumen yang diperlukan untuk umroh?',
            answer:
              'Dokumen yang diperlukan meliputi paspor dengan masa berlaku minimal 6 bulan, foto ukuran 4x6, dan buku vaksinasi meningitis.',
          },
          {
            question: 'Berapa lama waktu pelaksanaan umroh?',
            answer: 'Umumnya paket umroh berkisar antara 9-16 hari, tergantung paket yang dipilih.',
          },
          {
            question: 'Apakah tersedia pembimbing selama perjalanan?',
            answer:
              'Ya, setiap rombongan akan didampingi oleh pembimbing yang berpengalaman dalam manasik umroh.',
          },
        ])
      ),
    },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { siteConfig, services, posts, heroSlides } = loaderData;

  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingWhatsApp phoneNumber={siteConfig?.whatsappNumber} />

      {/* Hero Section */}
      <HeroSlider siteConfig={siteConfig} slides={heroSlides} />

      {/* Introduction/Pain Points */}
      <section className="py-24 px-4 bg-white relative">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                    Mengapa Memilih Kami Sebagai Mitra Ibadah Anda?
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Kami memahami bahwa menunaikan ibadah umroh dan haji adalah impian
                    setiap muslim. Namun, banyak kendala yang sering dihadapi seperti
                    biaya yang mahal, pelayanan yang kurang memuaskan, dan
                    ketidakjelasan program.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    <span className="font-semibold text-blue-700">UmrohKita</span> hadir sebagai solusi terpercaya dengan harga
                    transparan, pelayanan prima, dan bimbingan manasik yang
                    komprehensif untuk kekhusyukan ibadah Anda.
                  </p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-6">
              {[
                { icon: '💰', title: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi, sesuai dengan akad.' },
                { icon: '🏨', title: 'Fasilitas Terbaik', desc: 'Hotel dekat Masjidil Haram & Nabawi.' },
                { icon: '👳', title: 'Pembimbing Ahli', desc: 'Muthawif berpengalaman & bersertifikat.' },
                { icon: '🕰️', title: 'Layanan 24/7', desc: 'Tim support siap membantu kapanpun.' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <span className="text-4xl bg-blue-100 w-16 h-16 flex items-center justify-center rounded-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Paket Layanan Pilihan
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Pilih paket ibadah yang sesuai dengan kebutuhan, jadwal, dan budget Anda.
              Kami menyediakan berbagai opsi dari paket hemat hingga VIP.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {services.map((service: any) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                <div className="aspect-4/3 bg-gray-200 relative overflow-hidden">
                  {/* Placeholder gradient instead of empty gray box if no image */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed grow">
                    {service.description}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors mt-auto"
                  >
                    Lihat Detail <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
             <Link to="/services" className="inline-block px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all duration-300">
                Lihat Semua Paket
             </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                  Artikel & Tips Terbaru
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Dapatkan informasi bermanfaat seputar persiapan ibadah, tips perjalanan,
                  dan berita terkini.
                </p>
            </div>
            <Link to="/blog" className="text-blue-600 font-bold hover:text-blue-800 transition-colors whitespace-nowrap hidden md:block">
                Lihat Semua Artikel →
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {posts.map((post: any) => (
              <motion.article key={post.id} variants={fadeInUp} className="h-full">
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <time className="text-sm font-medium text-blue-600 mb-2 block">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : ''}
                    </time>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed grow">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
          
          <div className="text-center mt-8 md:hidden">
            <Link to="/blog" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                Lihat Semua Artikel →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Temukan jawaban atas pertanyaan umum seputar layanan kami
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-xl px-2 border border-gray-100 shadow-sm overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50 rounded-lg text-lg font-semibold text-gray-800 text-left">
                  Apa saja dokumen yang diperlukan untuk umroh?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600 leading-relaxed pb-4">
                  Dokumen yang diperlukan meliputi paspor dengan masa berlaku
                  minimal 6 bulan, foto ukuran 4x6 dengan latar putih (80% wajah), buku nikah/akte lahir (untuk hubungan keluarga), dan buku vaksinasi meningitis.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white rounded-xl px-2 border border-gray-100 shadow-sm overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50 rounded-lg text-lg font-semibold text-gray-800 text-left">
                  Berapa lama waktu pelaksanaan umroh?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600 leading-relaxed pb-4">
                  Umumnya paket umroh berkisar antara 9-16 hari, tergantung paket
                  yang dipilih. Paket reguler biasanya 9 hari (3 hari Madinah, 4 hari Makkah, 2 hari perjalanan).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white rounded-xl px-2 border border-gray-100 shadow-sm overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50 rounded-lg text-lg font-semibold text-gray-800 text-left">
                  Apakah tersedia pembimbing selama perjalanan?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600 leading-relaxed pb-4">
                  Ya, setiap rombongan akan didampingi oleh Tour Leader dari Indonesia dan Muthawif (pembimbing ibadah) yang berpengalaman dan mukim di Saudi Arabia.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white rounded-xl px-2 border border-gray-100 shadow-sm overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50 rounded-lg text-lg font-semibold text-gray-800 text-left">
                  Bagaimana sistem pembayaran paket umroh?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600 leading-relaxed pb-4">
                  Kami menyediakan sistem pembayaran yang fleksibel dengan DP awal untuk booking seat, dan pelunasan dilakukan maksimal 30 hari sebelum keberangkatan. Tersedia juga opsi cicilan syariah.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        className="py-24 px-4 bg-linear-to-br from-blue-700 to-blue-900 text-white text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Siap Wujudkan Impian Ibadah Anda?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Jangan tunda niat baik Anda. Konsultasikan rencana perjalanan ibadah Anda bersama kami sekarang juga.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Hubungi Kami Sekarang
          </Link>
        </div>
      </motion.section>

      <Footer config={siteConfig || undefined} />
    </div>
  );
}

