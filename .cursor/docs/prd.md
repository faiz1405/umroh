Product Requirements Document (PRD)
Project Name: React Router 7 CMS Monolith Version: 1.0 Status: Approved for Development

1. Ringkasan Proyek
Membangun sistem website monolith yang terdiri dari Public Landing Page yang interaktif dan ramah SEO, serta Admin CMS yang aman untuk pengelolaan konten.

Target User: Pengunjung umum (calon klien) & Administrator.

Tech Stack: React Router 7, Neon (PostgreSQL), Prisma, Tailwind CSS.

Library UI/UX: Shadcn UI (untuk Admin & Komponen UI), Framer Motion (untuk animasi interaktif).

2. Struktur Halaman (Sitemap)
A. Public Pages (Pengunjung)
Home (/): Halaman utama dengan struktur SEO.

About (/about): Informasi perusahaan.

Layanan (/layanan): Daftar lengkap layanan.

Blog (/blog): Daftar artikel.

Blog Detail (/blog/:slug): Halaman baca artikel.

Kontak (/contact): Form hubungi kami.

B. Admin Pages (CMS)
Semua route di bawah ini dilindungi oleh Login Auth.

Login (/login): Halaman masuk admin.

Dashboard (/admin): Ringkasan statisik.

Config (/admin/config): Edit Hero Section, Info Kontak, & SEO Global.

Services (/admin/services): CRUD Layanan.

Posts (/admin/posts): CRUD Artikel Blog.

Inbox (/admin/inbox): Membaca pesan masuk dari form kontak.

3. Detail Fitur & Spesifikasi
A. Public Landing Page (SEO & Interactive)
Setiap perpindahan halaman atau scroll section harus memiliki transisi halus menggunakan Framer Motion (misal: fade-in up saat di-scroll).

1. Homepage Section
Urutan section untuk memaksimalkan SEO dan Konversi:

Hero Section: Judul Besar (H1), Sub-judul, Gambar/Ilustrasi, Tombol CTA. Data diambil dari tabel SiteConfig.

Introduction (Pain Points): Penjelasan singkat masalah user dan solusi kita.

Featured Services: Menampilkan 3-4 layanan unggulan. Setiap kartu layanan bisa diklik menuju halaman /layanan.

Latest Articles: Menampilkan 3 artikel blog terbaru (Judul, Excerpt, Tanggal). Penting untuk SEO (Fresh Content).

Social Proof: Bagian logo klien atau angka statistik sederhana.

FAQ: Pertanyaan umum menggunakan schema markup (Accordion).

CTA Final: Ajakan bertindak sebelum footer.

2. Fitur Interaksi
Floating WhatsApp: Tombol WA yang melayang di pojok kanan bawah, selalu terlihat.

Contact Form: Input Nama, Email, Pesan.

Action: Simpan ke database tabel ContactMessage.

Feedback: Tampilkan pesan sukses ("Terima kasih, pesan terkirim") tanpa reload halaman (Optimistic UI).

B. Admin CMS (Shadcn UI)
Desain menggunakan komponen Shadcn (Card, Table, Sheet, Form, Dialog) agar bersih dan konsisten.

1. Autentikasi
Sistem login menggunakan Session/Cookie.

Admin dapat lebih dari satu (Multi-admin), namun pendaftaran admin baru dilakukan langsung via database (seeding) atau halaman khusus super-admin (fase 2), tidak ada fitur "Sign Up" publik.

2. Manajemen Konten
Site Configuration: Form tunggal untuk mengedit Judul Hero, Deskripsi Hero, Link Sosmed, dan No WA.

Layanan (Services):

Tabel daftar layanan (bisa di-sort/drag-drop urutannya - opsional).

Form Tambah/Edit: Judul, Deskripsi, Icon/Gambar.

Blog (Posts):

Editor teks ( Markdown editor sederhana).

Otomatis generate slug dari Judul (misal: "Cara Belajar Coding" -> cara-belajar-coding).

Status: Draft vs Published.

Inbox:

Tabel pesan masuk.

Fitur tandai sebagai "Sudah Dibaca".

4. Kebutuhan Database (Schema Summary)
Mengacu pada Schema Prisma yang telah disepakati sebelumnya:

User: email, password (hashed).

SiteConfig: heroTitle, heroDescription, whatsappNumber, dll (Single row).

Service: title, description, imageUrl, order.

Post: title, slug, content, published.

ContactMessage: name, email, message, status.

5. Non-Functional Requirements
Performance: Loading time halaman utama < 2 detik (Gunakan optimasi gambar dan loader React Router).

Responsive: Tampilan wajib rapi di Mobile, Tablet, dan Desktop.

SEO: Setiap halaman harus memiliki Meta Title dan Meta Description yang dinamis.