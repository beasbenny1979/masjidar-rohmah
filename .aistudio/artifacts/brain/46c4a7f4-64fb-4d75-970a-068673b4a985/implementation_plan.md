# Publikasi Web Server & Sinkronisasi Kas Masjid Ar-Rohmah (Poin No. 2)

Rencana kerja komprehensif untuk memastikan sistem Laporan Keuangan & Kas Masjid (poin no. 2: saldo awal Rp 0, grafik tren arus kas bulanan, dan buku mutasi) tersinkronisasi otomatis dengan database backend, serta menyiapkan konfigurasi build dan deployment produksi yang siap dipublikasikan ke web server.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Poin Utama yang Disepakati:**
> - **Fokus Poin No. 2**: Laporan keuangan, saldo kas awal, pemasukan/pengeluaran bulan ini, grafik tren arus kas, dan buku mutasi kas dimulai dari Rp 0 bersih di level file database server (`db.json`) dan `localStorage` browser, dengan auto-sync real-time saat ada input baru via Admin DKM.
> - **Target Publikasi Web Server**: Menggunakan arsitektur Full-Stack Node.js/Express (`server.ts`) yang menyajikan bundel produksi (`dist/`) bersama file database persisten (`db.json`) dan static assets (`/images`, `/uploads`) pada port 3000 / `process.env.PORT`.

- **Keputusan 1**: Reset data kas di `src/data/db.json` dan `mockData.ts` dikunci pada nilai awal Rp 0 dengan array transaksi kosong, sehingga saat web server pertama kali di-deploy, website menampilkan status kas bersih siap input.
- **Keputusan 2**: Penyediaan script build & runtime produksi (`npm run build` dan `npm run start`) serta routing statis lengkap di `server.ts` agar server web dapat dijalankan langsung di VPS, Cloud Run, Docker, maupun hosting cPanel Node.js.

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: 
  1. Penyelarasan menyeluruh modul Laporan Keuangan & Kas (poin no. 2) agar seluruh pos kas (Operasional, Pembangunan, ZISWAF, Santunan Yatim), total pemasukan, total pengeluaran, saldo terkumpul, grafik tren batang bulanan, dan riwayat mutasi berada pada posisi awal Rp 0 baik di client maupun server.
  2. Otomatisasi sinkronisasi data keuangan via Admin DKM yang langsung tersimpan ke `localStorage` dan file `db.json` server tanpa jeda.
  3. Konfigurasi build dan runtime web server mandiri (*production-ready web server*) yang menyajikan SPA hasil kompilasi Vite beserta API persisten dan aset gambar.
- **Pengguna Target**: Pengurus DKM Masjid Ar-Rohmah (Bapak Rafiudin, Bapak Adih, Bapak Heri Kristiyanto) untuk pembukuan kas, serta seluruh jamaah dan muhsinin Komplek Bumi Narimbang Indah melalui peramban web di desktop maupun ponsel.
- **Nilai Manfaat**: Akuntabilitas keuangan transparan 100%, sistem tidak akan kembali ke data dummy lama saat server di-restart, dan kemudahan proses deployment ke server hosting publik.

---

## 2. User Experience & Visual Design

- **Alur Pengguna & Tampilan Laporan Kas**:
  1. **Tampilan Awal Jamaah**:
     - Bagian Keuangan menampilkan 4 kartu saldo bernilai `Rp 0`.
     - Status Rekonsiliasi menampilkan tanggal dan jam rekonsiliasi terbaru dengan format Indonesia.
     - Grafik tren arus kas menampilkan sumbu bulan dengan nilai nol yang elegan tanpa error rendering.
     - Tabel buku mutasi menampilkan status kosong bersih (*empty state*) dengan pesan santun: *"Belum ada mutasi kas yang dicatat untuk periode ini. Pencatatan resmi dikelola langsung oleh Bendahara DKM."*
  2. **Alur Pencatatan Admin DKM**:
     - Bendahara DKM masuk via Google Account `mjdarrohmah@gmail.com` dan password resmi.
     - Input mutasi pemasukan/pengeluaran baru atau unggah file Excel/CSV rekonsiliasi kas.
     - Saldo terkumpul, grafik tren bulanan, dan tabel mutasi langsung terhitung dan ter-update seketika di layar.
     - Indikator *Sync Browser & Server* di sudut atas panel menyala hijau mengonfirmasi bahwa data telah tersimpan di browser dan server web.

- **Desain & Aksesibilitas**:
  - Warna tema utama: Emerald Green (`#064e3b` / `#047857`) dan Aksen Emas/Amber (`#f59e0b`).
  - Tipografi: Angka keuangan menggunakan `font-mono tabular-nums` untuk perataan angka yang presisi.
  - Sesuai kaidah desain: Tidak menggunakan badge pill bertumpuk, tidak ada teks watermark pudar, dan menggunakan kontras teks WCAG AA.

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Arsitektur Persistensi Ganda (Hybrid Client + Server)**
  - *Pendekatan*: Mengombinasikan `localStorage` untuk kecepatan respon instan di sisi browser pengguna dengan endpoint REST API `/api/content` di `server.ts` untuk penyimpanan permanen di file `db.json`.
  - *Alasan*: Menjamin website tetap berfungsi cepat dan offline-resilient saat koneksi lambat, sekaligus memastikan data antar browser dan perangkat selalu sinkron.

- **Keputusan 2: Penyiapan Web Server Produksi Mandiri**
  - *Pendekatan*: Mengonfigurasi `server.ts` agar saat `NODE_ENV === 'production'`, Express langsung melayani file statis dari folder `dist/` dan menangani SPA client-side routing fallback ke `dist/index.html`.
  - *Alasan*: Memungkinkan aplikasi di-deploy sebagai layanan tunggal (*single container / single process*) tanpa membutuhkan konfigurasi reverse-proxy terpisah yang rumit.

---

## 4. Technical Architecture & Data Strategy

### Diagram Alur Data & Arsitektur Server

```
┌─────────────────────────────────────────────────────────────┐
│                       BROWSER CLIENT                        │
│                                                             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │   Halaman Web Publik  │       │    Panel Admin DKM    │  │
│  │  (Laporan Kas Rp 0 &  │       │ (Input Transaksi,     │  │
│  │   Grafik Arus Kas)    │       │  Import Excel, Saldo) │  │
│  └───────────▲───────────┘       └───────────┬───────────┘  │
│              │                               │              │
│              │       Multi-Tab Sync Event    │              │
│              ├───────────────────────────────┤              │
│              │   localStorage (Browser Cache)│              │
└──────────────┼───────────────────────────────┼──────────────┘
               │                               │
        GET /api/content               POST /api/content
        (Initial Load)                 (Debounced Auto-Save)
               │                               │
┌──────────────▼───────────────────────────────▼──────────────┐
│                    EXPRESS WEB SERVER (Node.js)             │
│                        (server.ts :3000)                    │
│                                                             │
│  ┌─────────────────────────┐     ┌───────────────────────┐  │
│  │   Static File Serves    │     │   API Router / Data   │  │
│  │  • dist/ (SPA Bundle)   │     │  • /api/content       │  │
│  │  • public/images/       │     │  • /api/auth/login    │  │
│  │  • public/uploads/      │     │  • /api/upload        │  │
│  └─────────────────────────┘     └───────────┬───────────┘  │
│                                              │              │
│                                  ┌───────────▼───────────┐  │
│                                  │ File DB (src/data/    │  │
│                                  │        db.json)       │  │
│                                  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Langkah Pelaksanaan:

1. **Sinkronisasi & Verifikasi Poin No. 2 (Data Kas Awal Rp 0)**:
   - Memastikan `src/data/db.json` dan `src/data/mockData.ts` memiliki nilai saldo kas `totalBalance: 0`, `totalIncomeThisMonth: 0`, `totalExpenseThisMonth: 0`, dan `transactions: []`.
   - Menguji perenderan grafik Recharts saat transaksi berjumlah 0 agar tetap rapi dengan pesan informasi yang elegan.
2. **Standardisasi Skrip Publish & Web Server Produksi**:
   - Memastikan `package.json` memiliki script `"build": "vite build"` dan `"start": "node server.ts"` (atau runner tsx yang kompatibel) serta port listening `process.env.PORT || 3000`.
   - Memastikan `server.ts` melayani `dist/` secara optimal saat mode produksi.
3. **Validasi Akhir**:
   - Menjalankan `npm run build` untuk memverifikasi kesiapan kompilasi bundel produksi web server.
   - Menguji fungsi ekspor laporan resmi DKM (Cetak/PDF) dan sinkronisasi mutasi kas.
