import { motion } from 'framer-motion';
import type { Route } from './+types/services';
import { db } from '~/lib/db.server';
import { generateMetaTags } from '~/components/seo';
import { Navbar } from '~/components/navbar';
import { Footer } from '~/components/footer';
import { FloatingWhatsApp } from '~/components/floating-whatsapp';
import { fadeInUp, staggerContainer } from '~/lib/animations';
import { Link } from 'react-router';

export async function loader() {
  const [siteConfig, services] = await Promise.all([
    db.siteConfig.findFirst(),
    db.service.findMany({
      orderBy: { order: 'asc' },
    }),
  ]);

  return { siteConfig, services };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Paket Layanan - UmrohKita' },
    ...generateMetaTags({
      title: 'Paket Layanan Umroh & Haji - UmrohKita',
      description:
        'Pilihan lengkap paket umroh dan haji dengan berbagai fasilitas. Dari paket ekonomis hingga VIP, temukan yang sesuai dengan kebutuhan Anda.',
    }),
  ];
}

export default function Services({ loaderData }: Route.ComponentProps) {
  const { siteConfig, services } = loaderData;

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
              Layanan Kami
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Paket Ibadah Pilihan
          </h1>
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
            Temukan paket umroh dan haji yang sesuai dengan kebutuhan, jadwal, dan preferensi Anda.
          </p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden">
                   <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
                </div>
                <div className="p-8 flex flex-col grow">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">{service.title}</h2>
                  <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed grow">
                    {service.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-gray-100">
                    <Link
                      to="/contact"
                      className="flex-1 text-center bg-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors hover:shadow-lg shadow-blue-600/20"
                    >
                      Konsultasi
                    </Link>
                    {siteConfig?.whatsappNumber && (
                      <a
                        href={`https://wa.me/${siteConfig.whatsappNumber}?text=Halo, saya ingin bertanya tentang ${service.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-green-600 transition-colors hover:shadow-lg shadow-green-500/20"
                      >
                        <span className="text-lg">💬</span> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-24 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="container mx-auto text-center max-w-4xl bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Butuh Paket Khusus?
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Kami memahami setiap jamaah memiliki kebutuhan berbeda. Diskusikan kebutuhan perjalanan ibadah Anda, dan kami akan buatkan paket custom spesial untuk Anda.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Hubungi Tim Kami
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer config={siteConfig || undefined} />
    </div>
  );
}

