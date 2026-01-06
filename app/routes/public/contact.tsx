import { motion } from 'framer-motion';
import { Form, redirect } from 'react-router';
import type { Route } from './+types/contact';
import { db } from '~/lib/db.server';
import { generateMetaTags } from '~/components/seo';
import { Navbar } from '~/components/navbar';
import { Footer } from '~/components/footer';
import { FloatingWhatsApp } from '~/components/floating-whatsapp';
import { fadeInUp, staggerContainer } from '~/lib/animations';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';

export async function loader() {
  const siteConfig = await db.siteConfig.findFirst();
  return { siteConfig };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const message = formData.get('message')?.toString();

  if (!name || !email || !message) {
    return { error: 'Semua field harus diisi' };
  }

  try {
    await db.contactMessage.create({
      data: {
        name,
        email,
        message,
        status: 'UNREAD',
      },
    });

    return redirect('/contact?success=true');
  } catch (error) {
    return { error: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Hubungi Kami - UmrohKita' },
    ...generateMetaTags({
      title: 'Hubungi Kami - UmrohKita',
      description:
        'Hubungi kami untuk konsultasi gratis seputar paket umroh dan haji. Tim kami siap membantu Anda.',
    }),
  ];
}

export default function Contact({ loaderData, actionData }: Route.ComponentProps) {
  const { siteConfig } = loaderData;
  const url = new URL(window.location.href);
  const success = url.searchParams.get('success');

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
              Hubungi Kami
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Mulai Perjalanan Anda</h1>
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
            Tim kami siap membantu menjawab pertanyaan dan merencanakan ibadah impian Anda dengan pelayanan terbaik.
          </p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="grid lg:grid-cols-2 gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Contact Info */}
            <motion.div variants={fadeInUp} className="space-y-10">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">Informasi Kontak</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Jangan ragu untuk menghubungi kami melalui saluran berikut. Kami akan dengan senang hati melayani Anda.
                </p>
              </div>
              
              <div className="space-y-6">
                {siteConfig?.whatsappNumber && (
                  <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-3xl shrink-0 text-green-600">
                        📱
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">WhatsApp</h3>
                      <p className="text-gray-500 mb-3 text-sm">Chat langsung dengan tim kami</p>
                      <a
                        href={`https://wa.me/${siteConfig.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-green-600 hover:text-green-700 hover:underline"
                      >
                        {siteConfig.whatsappNumber}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl shrink-0 text-blue-600">
                    ✉️
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Email</h3>
                    <p className="text-gray-500 mb-3 text-sm">Kirim pertanyaan via email</p>
                    <a
                      href="mailto:info@umrohkita.com"
                      className="text-lg font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      info@umrohkita.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-3xl shrink-0 text-red-600">
                    📍
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Alamat Kantor</h3>
                     <p className="text-gray-500 mb-3 text-sm">Kunjungi kantor kami</p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Jl. Contoh No. 123
                      <br />
                      Jakarta Selatan, Indonesia
                    </p>
                  </div>
                </div>
              </div>

              {(siteConfig?.facebookUrl || siteConfig?.instagramUrl) && (
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900">Ikuti Sosial Media Kami</h3>
                  <div className="flex gap-4">
                    {siteConfig.facebookUrl && (
                      <a
                        href={siteConfig.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all hover:-translate-y-1 shadow-md shadow-blue-600/20"
                      >
                        Facebook
                      </a>
                    )}
                    {siteConfig.instagramUrl && (
                      <a
                        href={siteConfig.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-linear-to-br from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all hover:-translate-y-1 shadow-md shadow-pink-600/20"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900 relative z-10">Kirim Pesan</h2>

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800"
                  >
                    <span className="text-xl mt-0.5">✅</span>
                    <div>
                        <p className="font-semibold">Pesan Terkirim!</p>
                        <p className="text-sm">Terima kasih! Kami akan segera menghubungi Anda kembali.</p>
                    </div>
                  </motion.div>
                )}

                {actionData?.error && (
                   <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800"
                  >
                    <span className="text-xl mt-0.5">❌</span>
                    <p>{actionData.error}</p>
                  </motion.div>
                )}

                <Form method="post" className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold text-gray-700">Nama Lengkap</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Masukkan nama lengkap Anda"
                      required
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold text-gray-700">Alamat Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="contoh@email.com"
                      required
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-semibold text-gray-700">Pesan</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tuliskan pertanyaan atau kebutuhan Anda..."
                      required
                      className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 transition-all resize-none p-4"
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-lg shadow-blue-600/20">
                    Kirim Pesan Sekarang
                  </Button>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer config={siteConfig || undefined} />
    </div>
  );
}

