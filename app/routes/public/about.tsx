import { motion } from 'framer-motion';
import type { Route } from './+types/about';
import { db } from '~/lib/db.server';
import { generateMetaTags } from '~/components/seo';
import { Navbar } from '~/components/navbar';
import { Footer } from '~/components/footer';
import { FloatingWhatsApp } from '~/components/floating-whatsapp';
import { fadeInUp, staggerContainer } from '~/lib/animations';

export async function loader() {
  const siteConfig = await db.siteConfig.findFirst();
  return { siteConfig };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tentang Kami - UmrohKita' },
    ...generateMetaTags({
      title: 'Tentang Kami - UmrohKita',
      description:
        'Kenali lebih dekat UmrohKita, mitra terpercaya Anda dalam menunaikan ibadah umroh dan haji dengan pelayanan terbaik.',
    }),
  ];
}

export default function About({ loaderData }: Route.ComponentProps) {
  const { siteConfig } = loaderData;

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
              Tentang UmrohKita
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Tentang Kami</h1>
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
            Mitra Terpercaya untuk Ibadah Umroh & Haji Anda dengan pengalaman melayani ribuan jamaah.
          </p>
        </div>
      </motion.section>

      {/* Company Story */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
              <div className="aspect-4/3 bg-gray-200 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-gray-200"></div>
                {/* Image placeholder */}
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10"></div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">Cerita Perjalanan Kami</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-blue-700">UmrohKita</span> didirikan dengan misi mulia untuk membantu umat Muslim
                  menunaikan ibadah umroh dan haji dengan mudah, nyaman, dan
                  terjangkau. Berawal dari pengalaman pribadi yang merasakan
                  sulitnya mencari layanan umroh yang terpercaya, kami bertekad
                  untuk memberikan solusi terbaik.
                </p>
                <p>
                  Dengan pengalaman lebih dari 10 tahun dalam industri perjalanan
                  ibadah, kami telah melayani ribuan jamaah dengan tingkat kepuasan yang
                  tinggi. Tim kami terdiri dari profesional berpengalaman yang
                  memahami kebutuhan jamaah secara mendalam dan berkomitmen untuk memberikan
                  pelayanan prima dari keberangkatan hingga kepulangan.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Visi Kami</h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi penyedia layanan umroh dan haji terdepan yang dipercaya
                oleh umat Muslim Indonesia, dengan standar pelayanan internasional
                dan harga yang terjangkau, serta menjadi jembatan kebaikan bagi setiap tamu Allah.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6">✨</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Misi Kami</h3>
              <ul className="text-gray-600 space-y-4">
                <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Memberikan pelayanan terbaik, profesional, dan sepenuh hati.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Menyediakan paket yang transparan, terjangkau, dan sesuai syariat.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Membimbing jamaah dengan manasik yang komprehensif sesuai sunnah.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Memastikan keamanan dan kenyamanan selama perjalanan ibadah.</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">Nilai-Nilai Utama</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Prinsip yang kami pegang teguh dalam setiap langkah pelayanan kami kepada jamaah.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: '🤝',
                title: 'Amanah',
                desc: 'Kami menjaga kepercayaan jamaah sebagai tanggung jawab utama.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: '❤️',
                title: 'Ikhlas',
                desc: 'Melayani dengan ketulusan hati untuk kenyamanan ibadah Anda.',
                color: 'bg-pink-50 text-pink-600',
              },
              {
                icon: '⭐',
                title: 'Profesional',
                desc: 'Bekerja dengan standar tinggi dan tim yang berpengalaman.',
                color: 'bg-yellow-50 text-yellow-600',
              },
              {
                icon: '🎯',
                title: 'Transparan',
                desc: 'Keterbukaan dalam harga dan fasilitas tanpa ada yang ditutupi.',
                color: 'bg-green-50 text-green-600',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${value.color}`}>
                    {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="grid md:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-blue-800"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { number: '10+', label: 'Tahun Pengalaman' },
              { number: '5k+', label: 'Jamaah Terlayani' },
              { number: '98%', label: 'Tingkat Kepuasan' },
              { number: '24/7', label: 'Layanan Support' },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="pt-8 md:pt-0 px-4">
                <div className="text-5xl md:text-6xl font-bold mb-4 text-blue-200">{stat.number}</div>
                <div className="text-lg font-medium text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer config={siteConfig || undefined} />
    </div>
  );
}

