import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

// Make sure Prisma picks up the connection string
if (!process.env.DATABASE_URL && process.env.VITE_DB_URL) {
  process.env.DATABASE_URL = process.env.VITE_DB_URL;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL or VITE_DB_URL must be set');
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create site config
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      heroTitle: 'Wujudkan Ibadah Impian Anda',
      heroSubtitle: 'Layanan Umroh & Haji Terpercaya dengan Fasilitas Terbaik',
      heroImage: '/images/hero-umroh.jpg',
      whatsappNumber: '6281234567890',
      facebookUrl: 'https://facebook.com/umrohkita',
      instagramUrl: 'https://instagram.com/umrohkita',
      metaTitleTemplate: 'Umroh & Haji Terpercaya',
      metaDescription: 'Layanan umroh dan haji terpercaya dengan fasilitas terbaik dan harga terjangkau',
    },
  });
  console.log('✅ Created site config');

  // Create services
  const services = [
    {
      title: 'Umroh Regular',
      description: 'Paket umroh ekonomis dengan fasilitas lengkap dan nyaman. Cocok untuk Anda yang ingin beribadah dengan budget terjangkau tanpa mengurangi kualitas pelayanan.',
      imageUrl: '/images/umroh-regular.jpg',
      order: 1,
    },
    {
      title: 'Umroh Plus Turki',
      description: 'Paket umroh dengan perjalanan wisata religi ke Turki. Kunjungi tempat-tempat bersejarah Islam sambil menunaikan ibadah umroh.',
      imageUrl: '/images/umroh-plus-turki.jpg',
      order: 2,
    },
    {
      title: 'Umroh VIP',
      description: 'Paket umroh eksklusif dengan hotel bintang 5 dekat Masjidil Haram dan Nabawi. Nikmati kemewahan dan kenyamanan maksimal selama beribadah.',
      imageUrl: '/images/umroh-vip.jpg',
      order: 3,
    },
    {
      title: 'Haji Reguler',
      description: 'Program haji reguler sesuai kuota pemerintah. Pembimbing berpengalaman dan fasilitas memadai untuk kenyamanan ibadah Anda.',
      imageUrl: '/images/haji-regular.jpg',
      order: 4,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.title },
      update: {},
      create: {
        ...service,
        id: service.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }
  console.log('✅ Created', services.length, 'services');

  // Create blog posts
  const posts = [
    {
      title: 'Persiapan Umroh: Panduan Lengkap untuk Pertama Kali',
      slug: 'persiapan-umroh-panduan-lengkap',
      excerpt: 'Panduan lengkap persiapan umroh bagi Anda yang akan berangkat untuk pertama kalinya, mulai dari dokumen hingga perlengkapan.',
      content: `# Persiapan Umroh: Panduan Lengkap

Berangkat umroh untuk pertama kalinya? Jangan khawatir! Berikut panduan lengkap persiapan umroh yang perlu Anda ketahui.

## 1. Persiapan Dokumen

- Paspor dengan masa berlaku minimal 6 bulan
- Visa umroh (diurus oleh travel)
- Buku vaksinasi meningitis
- Foto ukuran 4x6

## 2. Persiapan Fisik

Pastikan kondisi tubuh fit dengan:
- Medical check-up
- Olahraga rutin minimal 1 bulan sebelum keberangkatan
- Konsultasi dengan dokter jika memiliki penyakit tertentu

## 3. Perlengkapan Wajib

- Pakaian ihram (pria)
- Mukena dan jilbab (wanita)
- Sandal yang nyaman
- Tas kecil untuk thawaf
- Obat-obatan pribadi

## 4. Persiapan Mental dan Spiritual

- Pelajari manasik umroh
- Niat yang tulus karena Allah
- Perbanyak doa dan istighfar

Semoga perjalanan ibadah Anda lancar dan diterima oleh Allah SWT.`,
      published: true,
      publishedAt: new Date('2024-12-01'),
    },
    {
      title: '10 Amalan Sunnah Saat Berada di Madinah',
      slug: '10-amalan-sunnah-di-madinah',
      excerpt: 'Berikut adalah 10 amalan sunnah yang dianjurkan untuk dilakukan saat berkunjung ke Madinah al-Munawwarah.',
      content: `# 10 Amalan Sunnah di Madinah

Madinah al-Munawwarah adalah kota yang penuh berkah. Berikut amalan sunnah yang bisa dilakukan:

## 1. Shalat di Masjid Nabawi
Satu shalat di Masjid Nabawi setara dengan 1000 shalat di masjid lainnya.

## 2. Mengunjungi Raudhah
Raudhah adalah taman surga di dunia, terletak antara mimbar dan makam Rasulullah.

## 3. Bershalawat kepada Nabi Muhammad SAW
Perbanyak shalawat saat berada di kota Nabi.

## 4. Ziarah ke Makam Rasulullah
Mengucapkan salam kepada Rasulullah SAW dan dua sahabatnya.

## 5. Berkunjung ke Masjid Quba
Masjid pertama yang dibangun oleh Rasulullah.

## 6. Ziarah ke Pemakaman Baqi'
Tempat peristirahatan para sahabat dan keluarga Nabi.

## 7. Mengunjungi Bukit Uhud
Tempat bersejarah perang Uhud.

## 8. Memperbanyak Sedekah
Berbagi rezeki kepada yang membutuhkan.

## 9. Membaca Al-Qur'an
Manfaatkan waktu untuk memperbanyak tilawah.

## 10. Berdoa untuk Keluarga dan Muslim Lainnya
Doa di tempat-tempat mulia memiliki keistimewaan.`,
      published: true,
      publishedAt: new Date('2024-12-15'),
    },
    {
      title: 'Perbedaan Haji dan Umroh yang Perlu Anda Ketahui',
      slug: 'perbedaan-haji-dan-umroh',
      excerpt: 'Memahami perbedaan mendasar antara ibadah haji dan umroh dari segi waktu, rukun, dan hukumnya.',
      content: `# Perbedaan Haji dan Umroh

Banyak yang masih bingung membedakan haji dan umroh. Mari kita bahas perbedaannya:

## Dari Segi Hukum

### Haji
- Wajib bagi yang mampu (rukun Islam ke-5)
- Dilaksanakan sekali seumur hidup

### Umroh
- Hukumnya sunnah muakkad
- Bisa dilakukan berkali-kali

## Dari Segi Waktu

### Haji
- Hanya bisa dilakukan pada bulan Dzulhijjah
- Ada hari-hari tertentu (8-13 Dzulhijjah)

### Umroh
- Bisa dilakukan kapan saja sepanjang tahun
- Tidak ada waktu khusus

## Rukun dan Wajib

### Haji
- Lebih banyak rukun (ihram, wukuf di Arafah, thawaf, sa'i, dll)
- Ada ritual wukuf, mabit di Mina, melontar jumrah

### Umroh
- Rukun lebih sedikit (ihram, thawaf, sa'i, tahallul)
- Lebih singkat, bisa selesai dalam beberapa jam

## Biaya

Haji umumnya lebih mahal karena waktu lebih lama dan fasilitas lebih kompleks.

Semoga bermanfaat!`,
      published: true,
      publishedAt: new Date('2025-01-01'),
    },
    {
      title: 'Tips Hemat Belanja Oleh-oleh di Arab Saudi',
      slug: 'tips-hemat-belanja-oleh-oleh',
      excerpt: 'Panduan berbelanja oleh-oleh yang hemat namun tetap berkualitas saat berada di Makkah dan Madinah.',
      content: `# Tips Hemat Belanja Oleh-oleh

Ingin membawa oleh-oleh untuk keluarga tanpa merogoh kocek terlalu dalam? Simak tipsnya!

## 1. Buat Daftar Belanjaan

Tentukan siapa saja yang akan diberi oleh-oleh dan barang apa yang akan dibeli.

## 2. Bandingkan Harga

Jangan langsung membeli di toko pertama. Bandingkan harga di beberapa tempat.

## 3. Belanja di Pasar Tradisional

Pasar seperti Souk Al Zal di Madinah umumnya lebih murah.

## 4. Hindari Area Dekat Masjidil Haram

Toko di area dekat masjid cenderung lebih mahal.

## 5. Tawar-menawar

Jangan sungkan untuk menawar, terutama untuk pembelian dalam jumlah banyak.

## Oleh-oleh Populer:

- Kurma Ajwa
- Parfum Arab (Oud)
- Tasbih
- Zamzam (sesuai ketentuan)
- Sajadah
- Gamis dan abaya

## 6. Perhatikan Batas Bagasi

Jangan lupa cek batas bagasi pesawat agar tidak kena biaya tambahan.

Selamat berbelanja!`,
      published: false,
      publishedAt: null,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ Created', posts.length, 'blog posts');

  // Create contact messages
  const messages = [
    {
      name: 'Ahmad Zaki',
      email: 'ahmad.zaki@email.com',
      message: 'Assalamualaikum, saya ingin menanyakan paket umroh untuk bulan Ramadan. Apakah masih ada seat tersedia? Mohon info lebih lanjut. Terima kasih.',
      status: 'UNREAD' as const,
    },
    {
      name: 'Siti Aminah',
      email: 'siti.aminah@email.com',
      message: 'Saya tertarik dengan paket umroh plus Turki. Bisa minta detail itinerary dan harganya? Rencana berangkat untuk 4 orang.',
      status: 'READ' as const,
    },
  ];

  for (const message of messages) {
    await prisma.contactMessage.create({
      data: message,
    });
  }
  console.log('✅ Created', messages.length, 'contact messages');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

