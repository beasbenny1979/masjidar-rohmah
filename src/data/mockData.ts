import {
  FridayOfficer,
  CommitteeMember,
  MosqueFacility,
  FinancialTransaction,
  FinancialSummary,
  AgendaEvent,
  BankAccount,
  DonorPrayer,
  Article,
  MosqueImage,
} from '../types';

export const INITIAL_MOSQUE_IMAGES: MosqueImage[] = [
  {
    id: 'img-1',
    title: 'Kemegahan Kubah & Halaman Masjid Ar-Rohmah',
    category: 'Eksterior',
    imageUrl: '/images/masjid_arrohmah_eksterior_1791855999083.jpg',
    caption: 'Tampak depan Masjid Ar-Rohmah dengan kubah hijau khas, menara azan, serta pelataran asri di Komplek Bumi Narimbang Indah.',
    uploadedAt: '12 Oktober 2026',
  },
  {
    id: 'img-2',
    title: 'Ruang Sholat Utama Ber-AC & Karpet Turki',
    category: 'Ruang Sholat',
    imageUrl: '/images/masjid_ruang_utama_1791855999934.jpg',
    caption: 'Kenyamanan shalat berjamaah dengan karpet shaf tebal, mimbar kayu jati berukir kaligrafi, dan pendingin ruangan sejuk.',
    uploadedAt: '12 Oktober 2026',
  },
  {
    id: 'img-3',
    title: 'Area Mihrab & Mimbar Khutbah',
    category: 'Ruang Sholat',
    imageUrl: '/images/masjid_ruang_utama_1791855999934.jpg',
    caption: 'Mihrab marmer putih elegan tempat imam memimpin shalat 5 waktu dan shalat Jumat.',
    uploadedAt: '10 Oktober 2026',
  },
  {
    id: 'img-4',
    title: 'Pelataran & Penghijauan Masjid',
    category: 'Fasilitas',
    imageUrl: '/images/masjid_arrohmah_eksterior_1791855999083.jpg',
    caption: 'Area hijau taman dan parkiran luas yang aman dilengkapi CCTV 24 jam untuk kenyamanan jamaah.',
    uploadedAt: '8 Oktober 2026',
  },
];

export const MOSQUE_INFO = {
  name: 'Masjid Ar-Rohmah',
  tagline: 'Pusat Ibadah, Dakwah, dan Ukhuwah Umat di Bumi Narimbang Indah',
  address: 'Komplek Bumi Narimbang Indah, Jl. Jendral Sudirman No.KM 2, Kelurahan Jatimulya, Kecamatan Rangkasbitung, Kabupaten Lebak, Banten 42315',
  email: 'mjdarrohmah@gmail.com',
  phone: '0812-1926-6161',
  phoneFormatted: '+62 812-1926-6161',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.48566418876!2d106.2486!3d-6.3615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjEnNDEuNCJTIDEwNsKwMTQnNTUuMCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  mapsDirectUrl: 'https://maps.google.com/?q=-6.3615,106.2486',
  dkmSkNumber: 'SK Kemenag Lebak No. B-412/Kk.28.02/BA.01.1/2023',
  establishedYear: '2012',
  qiblaDirection: '295.2° Barat Laut (NW)',
  historyText: 'Masjid Ar-Rohmah didirikan atas inisiatif dan swadaya warga muslim Komplek Bumi Narimbang Indah, Jatimulya, Rangkasbitung sebagai pusat ibadah shalat berjamaah 5 waktu, pembinaan akhlak anak-anak santri, kajian keislaman keluarga sakinah, serta wadah persaudaraan ukhuwah islamiyah di Kabupaten Lebak, Banten.',
  visionText: 'Terwujudnya Masjid Ar-Rohmah sebagai pusat ibadah yang makmur, mandiri, berkeadaban, dan melayani umat demi kemaslahatan dunia dan akhirat.',
  missionsList: [
    'Memakmurkan ibadah salat 5 waktu dan shalat Jumat dengan kenyamanan optimal.',
    'Menyelenggarakan kajian keislaman yang menyejukkan, moderat (wasathiyah), dan mencerdaskan umat.',
    'Pengelolaan dana ZISWAF dan kas masjid yang transparan, profesional, dan akuntabel.',
    'Pemberdayaan sosial kemasyarakatan, santunan anak yatim & dhuafa di wilayah Jatimulya.',
    'Membina generasi qur’ani berakhlak mulia melalui TPA dan Remaja Islam Masjid (RISMA).'
  ],
  heroBadge: 'Portal Resmi DKM Masjid Ar-Rohmah Rangkasbitung',
  heroTitle: 'Masjid Ar-Rohmah, Rangkasbitung',
  heroSubtitle: 'Pusat ibadah, kajian keislaman, pembinaan generasi qur’ani, dan pelayanan sosial kemasyarakatan yang transparan dan amanah di Rangkasbitung, Kabupaten Lebak.',
  heroImageUrl: '',
  quranVerseArabic: 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ ۖ فَعَسَىٰ أُولَٰئِكَ أَنْ يَكُونُوا مِنَ الْمُهْتَدِينَ',
  quranVerseTranslation: '"Sesungguhnya yang memakmurkan masjid Allah hanyalah orang-orang yang beriman kepada Allah dan hari kemudian, serta (tetap) melaksanakan shalat, menunaikan zakat dan tidak takut (kepada apa pun) kecuali kepada Allah. Maka mudah-mudahan mereka termasuk orang-orang yang mendapat petunjuk."',
  quranVerseReference: '(QS. At-Taubah: 18)',
  philosophyTitle: '"Ar-Rohmah" (Menebar Kasih Sayang)',
  philosophyText: 'Nama Ar-Rohmah diambil dari sifat Allah SWT yang Maha Pengasih dan Penyayang (Rahmatan lil \'Alamin). Masjid ini didedikasikan menjadi naungan kasih sayang bagi segenap jamaah, tempat berlindung, serta mata air kebaikan bagi lingkungan sekitar.',
  qrisImageUrl: '',
  qrisNmid: 'ID1023098412938',
};

export const INITIAL_FRIDAY_OFFICERS: FridayOfficer[] = [
  {
    id: 'fri-01',
    date: 'Jumat, 2 Oktober 2026',
    hijriDate: '21 Rabiul Akhir 1448 H',
    khatib: 'K.H. Ahmad Hasan Basri, M.Ag',
    imam: 'Ust. Muhammad Ilham, Lc',
    muadzin: 'Ust. Hendra Setiawan',
    bilal: 'Sdr. Fajar Ramadhan',
    khutbahTheme: 'Menjaga Kemurnian Hati dan Memakmurkan Rumah Allah di Era Modern',
    note: 'Salat Jumat dimulai tepat saat azan Dzuhur berkumandang. Jamaah diimbau datang lebih awal untuk mendengarkan khutbah dengan khusyu.',
  },
  {
    id: 'fri-02',
    date: 'Jumat, 9 Oktober 2026',
    hijriDate: '28 Rabiul Akhir 1448 H',
    khatib: 'Dr. H. Tb. Mulyana, M.Si',
    imam: 'K.H. Ahmad Hasan Basri, M.Ag',
    muadzin: 'Ust. Deden Supriatna',
    bilal: 'Sdr. Ari Wibowo',
    khutbahTheme: 'Urgensi Zakat dan Kepedulian Sosial Menopang Ketahanan Umat',
    note: 'Akan diadakan santunan pekanan untuk 25 anak yatim setelah shalat Jumat.',
  },
  {
    id: 'fri-03',
    date: 'Jumat, 16 Oktober 2026',
    hijriDate: '5 Jumadil Ula 1448 H',
    khatib: 'Ust. H. Syarif Hidayatullah, S.Q',
    imam: 'Ust. H. Syarif Hidayatullah, S.Q',
    muadzin: 'Ust. Hendra Setiawan',
    bilal: 'Sdr. Rizky Pratama',
    khutbahTheme: 'Mencetak Generasi Qurani yang Berakhlakul Karimah dari Masjid',
    note: 'Infaq kotak Jumat pekan ini didedikasikan untuk operasional TPA Ar-Rohmah.',
  },
  {
    id: 'fri-04',
    date: 'Jumat, 23 Oktober 2026',
    hijriDate: '12 Jumadil Ula 1448 H',
    khatib: 'K.H. Munawar Kholil',
    imam: 'Ust. Muhammad Ilham, Lc',
    muadzin: 'Ust. Deden Supriatna',
    bilal: 'Sdr. Fajar Ramadhan',
    khutbahTheme: 'Hakikat Rezeki dan Keberkahan Sedekah di Waktu Pagi',
    note: 'Pengumuman laporan kas bulanan DKM akan dibacakan sebelum khutbah.',
  },
];

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    id: 'cm-1',
    name: 'Bapak Rafiudin',
    role: 'Pelindung DKM',
    division: 'Pelindung',
    phone: '0812-1926-6161',
    avatarUrl: '/images/bapak_rafiudin_pelindung_1791855997576.jpg',
    bio: 'Pelindung DKM Masjid Ar-Rohmah, mengayomi kerukunan warga dan kemakmuran komplek Bumi Narimbang Indah.',
  },
  {
    id: 'cm-2',
    name: 'Bapak Adih',
    role: 'Ketua DKM',
    division: 'Ketua',
    phone: '0812-1926-6161',
    avatarUrl: '/images/bapak_adih_ketua_dkm_1791855998348.jpg',
    bio: 'Ketua Dewan Kemakmuran Masjid (DKM) Ar-Rohmah, memimpin dan mengkoordinasikan kegiatan peribadatan, dakwah, serta pelayanan umat.',
  },
  {
    id: 'cm-3',
    name: 'Bapak Heri Kristiyanto',
    role: 'Bendahara DKM',
    division: 'Bendahara',
    phone: '0812-1926-6161',
    avatarUrl: '/images/bapak_heri_bendahara_1791855999466.jpg',
    bio: 'Bendahara DKM Masjid Ar-Rohmah, mengelola pembukuan kas, transparansi keuangan umat, dan akuntabilitas pelaporan infaq & sedekah.',
  },
];

export const MOSQUE_FACILITIES: MosqueFacility[] = [
  {
    id: 'fac-1',
    title: 'Ruang Sholat Utama Ber-AC',
    description: 'Ruang sholat yang sejuk dan hening beralaskan karpet tebal standar Turki yang nyaman untuk seluruh jamaah.',
    iconName: 'Airplay',
    capacity: 'Tersedia Lengkap',
    status: 'Tersedia',
  },
  {
    id: 'fac-2',
    title: 'Tempat Wudhu & Toilet Bersih Terpisah',
    description: 'Area wudhu higienis terpisah untuk ikhwan (pria) dan akhwat (wanita) dengan kran air melimpah dari sumur bor.',
    iconName: 'Droplets',
    capacity: '24 Titik Kran',
    status: 'Tersedia',
  },
  {
    id: 'fac-3',
    title: 'Sound System & Layar Digital TV',
    description: 'Tata suara akustik jernih untuk khutbah dan sholat, dilengkapi smart display TV jadwal salat dan running text.',
    iconName: 'Tv',
    capacity: 'Layar 55 Inch & Audio Hi-Fi',
    status: 'Tersedia',
  },
  {
    id: 'fac-4',
    title: 'Area Parkir Luas & Aman',
    description: 'Halaman parkir tertata rapi untuk puluhan mobil dan motor dengan pengawasan kamera CCTV 24 jam.',
    iconName: 'Car',
    capacity: '40 Mobil & 120 Motor',
    status: 'Tersedia',
  },
  {
    id: 'fac-5',
    title: 'Ruang Serbaguna & TPA Ar-Rohmah',
    description: 'Ruang belajar mengajar Al-Qur’an bagi santri cilik serta aula pertemuan pengurus warga dan majelis ta’lim.',
    iconName: 'BookOpen',
    capacity: '80 Santri',
    status: 'Tersedia',
  },
  {
    id: 'fac-6',
    title: 'Layanan Fardhu Kifayah & Kereta Jenazah',
    description: 'Perlengkapan pemulasaraan jenazah lengkap (kain kafan, tempat pemandian stainless, tenda) siap melayani 24 jam.',
    iconName: 'HeartHandshake',
    capacity: 'Siap Siaga 24 Jam',
    status: 'Tersedia',
  },
  {
    id: 'fac-7',
    title: 'Pojok Baca & Mini Perpustakaan Islam',
    description: 'Koleksi tafsir Ibnu Katsir, Riyadhus Shalihin, fiqih ibadah, sejarah nabi, dan buku bacaan anak-anak islami.',
    iconName: 'Library',
    capacity: '350+ Koleksi Buku',
    status: 'Tersedia',
  },
  {
    id: 'fac-8',
    title: 'Akses Wi-Fi Jamaah & Kursi Roda',
    description: 'Fasilitas ramah lansia & disabilitas dengan ramp jalur khusus kursi roda serta Wi-Fi untuk kajian online.',
    iconName: 'Wifi',
    capacity: 'Fasilitas Ramah Lansia',
    status: 'Tersedia',
  },
];

export const INITIAL_FINANCIAL_SUMMARY: FinancialSummary = {
  totalBalance: 0,
  totalIncomeThisMonth: 0,
  totalExpenseThisMonth: 0,
  operasionalBalance: 0,
  pembangunanBalance: 0,
  ziswafBalance: 0,
  yatimBalance: 0,
  lastUpdated: '17 Oktober 2026, Pukul 09:00 WIB',
  lastReconciledAt: 'Sabtu, 17 Oktober 2026, Pukul 09:00 WIB',
};

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: 'ev-1',
    title: 'Kajian Subuh Mengaji: Kitab Riyadhus Shalihin',
    category: 'kajian_rutin',
    speaker: 'K.H. Ahmad Hasan Basri, M.Ag',
    themeOrKitab: 'Bab Ikhlas dan Niat dalam Setiap Amal Perbuatan',
    date: 'Setiap Hari Ahad Subuh',
    time: 'Ba’da Sholat Subuh (05:00 - 06:15 WIB)',
    location: 'Ruang Sholat Utama Masjid Ar-Rohmah',
    description: 'Kajian rutin mingguan untuk memperdalam hadits-hadits Rasulullah SAW yang aplikatif dalam kehidupan sehari-hari keluarga muslim. Disediakan sarapan pagi bersama.',
    isRecurring: true,
    recurrenceText: 'Rutin Setiap Ahad Subuh',
    hasLiveStream: true,
    liveStreamUrl: 'https://youtube.com/@masjid_arrohmah_narimbang',
    status: 'Mendatang',
  },
  {
    id: 'ev-2',
    title: 'Kajian Fiqih Muslimah: Manajemen Rumah Tangga Sakinah',
    category: 'kajian_rutin',
    speaker: 'Ustadzah Hj. Nurul Hidayati, Lc',
    themeOrKitab: 'Adab Berkeluarga & Mendidik Anak Menjadi Pejuang Agama',
    date: 'Setiap Hari Sabtu Pagi',
    time: '08:30 - 10:30 WIB',
    location: 'Ruang Utama & Serbaguna Masjid Ar-Rohmah',
    description: 'Kajian khusus ibu-ibu dan remaja putri komplek Narimbang Indah dan sekitarnya guna memperkuat ketahanan keluarga islami.',
    isRecurring: true,
    recurrenceText: 'Rutin Setiap Sabtu Pagi',
    hasLiveStream: false,
    status: 'Mendatang',
  },
  {
    id: 'ev-3',
    title: 'Tahsin & Tahfidz Al-Qur’an Jamaah Dewasa',
    category: 'kajian_rutin',
    speaker: 'Ust. Muhammad Ilham, Lc & Ust. H. Syarif, S.Q',
    themeOrKitab: 'Metode Talaqqi & Perbaikan Makharijul Huruf',
    date: 'Setiap Selasa & Kamis Malam',
    time: 'Ba’da Maghrib s/d Isya (18:15 - 19:15 WIB)',
    location: 'Serambi Kanan Masjid Ar-Rohmah',
    description: 'Bimbingan membaca Al-Qur’an dengan fasih, tartil, dan hafalan juz 30 untuk bapak-bapak dan pemuda.',
    isRecurring: true,
    recurrenceText: 'Rutin Setiap Selasa & Kamis',
    hasLiveStream: false,
    status: 'Mendatang',
  },
  {
    id: 'ev-4',
    title: 'Tabligh Akbar Peringatan Maulid Nabi Muhammad SAW 1448 H',
    category: 'phbi',
    speaker: 'Habib Ali Zaenal Abidin Al-Hamid & Da’i Kondang Banten',
    themeOrKitab: 'Meneladani Akhlak Mulia Rasulullah SAW sebagai Pemimpin Peradaban',
    date: 'Sabtu Malam, 24 Oktober 2026',
    time: 'Ba’da Isya (19:30 - 22:30 WIB)',
    location: 'Halaman & Ruang Utama Masjid Ar-Rohmah',
    description: 'Peringatan puncak Hari Besar Islam yang dihadiri seluruh warga Komplek Bumi Narimbang Indah dan masyarakat Lebak, dirangkai dengan santunan akbar yatim.',
    isRecurring: false,
    hasLiveStream: true,
    liveStreamUrl: 'https://youtube.com/@masjid_arrohmah_narimbang',
    status: 'Mendatang',
  },
  {
    id: 'ev-5',
    title: 'Aksi Bersih Bersih Masjid (BBM) & Kerja Bakti Lingkungan',
    category: 'sosial',
    speaker: 'Koordinator: Ir. Dedi Kurniawan (DKM) & RW 07',
    themeOrKitab: 'Kebersihan Sebagian dari Iman',
    date: 'Ahad, 18 Oktober 2026',
    time: '06:30 - 10:00 WIB',
    location: 'Area Masjid & Fasum Komplek Narimbang Indah',
    description: 'Gotong royong membersihkan karpet, tempat wudhu, drainase, dan penanaman pohon penghijauan di lingkungan masjid.',
    isRecurring: false,
    hasLiveStream: false,
    status: 'Mendatang',
  },
  {
    id: 'ev-6',
    title: 'Penerimaan Santri Baru TPA / TPQ Ar-Rohmah Semester Ganjil',
    category: 'tpa',
    speaker: 'Ustadzah Siti Aminah & Tim Pengajar TPA',
    themeOrKitab: 'Kurikulum Iqro, Al-Qur’an, Doa Harian, & Praktik Sholat',
    date: 'Senin - Jumat Setiap Pekan',
    time: 'Sesi Sore: 16:00 - 17:30 WIB',
    location: 'Gedung TPA Sayap Kiri Masjid',
    description: 'Membuka pendaftaran santri usia 4-13 tahun untuk bimbingan dasar baca tulis Al-Qur’an dan hafalan doa.',
    isRecurring: true,
    recurrenceText: 'Senin s/d Jumat',
    hasLiveStream: false,
    status: 'Berjalan',
  },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7182938401',
    accountHolder: 'DKM MASJID AR ROHMAH NARIMBANG',
    badge: 'Rekening Utama',
    logoText: 'BSI',
  },
];

export const INITIAL_DONOR_PRAYERS: DonorPrayer[] = [
  {
    id: 'dp-1',
    donorName: 'Hamba Allah (Komp. Narimbang Blok B)',
    amount: 500000,
    category: 'Sedekah Subuh',
    prayer: 'Semoga Allah senantiasa memberikan kesehatan berkah untuk kedua orang tua, melapangkan rezeki halal, dan memberkahi keturunan kami.',
    date: 'Hari ini, 05:14 WIB',
  },
  {
    id: 'dp-2',
    donorName: 'Keluarga Bpk. Hendra Gunawan',
    amount: 1000000,
    category: 'Infaq Pembangunan',
    prayer: 'Niat infaq atas nama almarhum ayahanda kami. Semoga menjadi amal jariyah yang menerangi kuburnya di sisi Allah SWT.',
    date: 'Kemarin, 19:30 WIB',
  },
  {
    id: 'dp-3',
    donorName: 'Ibu Hj. Rosmiati',
    amount: 750000,
    category: 'Santunan Anak Yatim',
    prayer: 'Titip santunan untuk adik-adik yatim di Jatimulya. Semoga anak-anak kami istiqomah shalat 5 waktu dan lulus ujian dengan ridho-Nya.',
    date: '30 Sep 2026, 14:10 WIB',
  },
  {
    id: 'dp-4',
    donorName: 'Hamba Allah',
    amount: 250000,
    category: 'Kas Operasional Masjid',
    prayer: 'Semoga para pengurus DKM Masjid Ar-Rohmah selalu diberikan keikhlasan dan kesehatan dalam melayani jamaah.',
    date: '29 Sep 2026, 09:45 WIB',
  },
  {
    id: 'dp-5',
    donorName: 'dr. Faisal Rahman & Keluarga',
    amount: 2000000,
    category: 'Zakat Maal',
    prayer: 'Tunaikan zakat maal tahunan. Semoga membersihkan harta kami dan mendatangkan keberkahan yang berlipat ganda untuk umat.',
    date: '28 Sep 2026, 21:05 WIB',
  },
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-1',
    title: 'Keutamaan Menjaga Shalat Subuh Berjamaah di Masjid',
    slug: 'keutamaan-shalat-subuh-berjamaah-di-masjid',
    category: 'tausiyah',
    author: 'Ust. Muhammad Ilham, Lc',
    date: '28 September 2026',
    readTime: '4 menit baca',
    featured: true,
    summary: 'Dua rakaat fajar lebih baik dari dunia dan seisinya. Simak rahasia spiritual dan keberkahan langkah kaki menuju rumah Allah di waktu fajar.',
    content: `Shalat Subuh berjamaah adalah salah satu tolok ukur keimanan seorang muslim. Rasulullah SAW bersabda dalam sebuah hadits sahih riwayat Imam Muslim:

« مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ »
"Barangsiapa yang mengerjakan shalat pada dua waktu yang dingin (yaitu shalat Subuh dan Ashar), maka ia akan masuk surga." (HR. Bukhari no. 574 dan Muslim no. 635)

Langkah kaki seorang mukmin di kegelapan malam menuju masjid dinilai sebagai cahaya yang sempurna pada hari kiamat kelak. Bagi warga di Komplek Bumi Narimbang Indah, mendengarkan lantunan azan Subuh dan melangkahkan kaki bersama tetangga menuju Masjid Ar-Rohmah bukan hanya menunaikan fardhu 'ain, namun juga sarana mengikat ukhuwah islamiyah yang kokoh.

Di antara keutamaan agung shalat Subuh berjamaah:
1. Berada dalam jaminan dan perlindungan Allah Ta'ala sepanjang hari.
2. Pahala setara dengan mendirikan shalat sepanjang malam suntuk.
3. Disaksikan langsung oleh malaikat malam dan malaikat siang yang bergantian bertugas.
4. Mendapatkan doa khusus keberkahan dari Baginda Rasulullah SAW: "Ya Allah, berkahilah umatku di waktu paginya."

Mari jadikan Masjid Ar-Rohmah sebagai rumah kedua kita, meramaikan shaf-shaf shalat Subuh, dan merasakan ketenangan batin yang tiada tara.`,
  },
  {
    id: 'art-2',
    title: 'Laporan Progres Pemasangan Partisi Kaca dan Tambahan Karpet Shaf Sayap Masjid',
    slug: 'laporan-progres-partisi-dan-karpet-shaf-masjid',
    category: 'berita',
    author: 'Sekretariat DKM Ar-Rohmah',
    date: '25 September 2026',
    readTime: '3 menit baca',
    featured: false,
    summary: 'Alhamdulillah, berkat infaq dan wakaf jamaah, pengerjaan partisi kaca dan penggelaran karpet shaf tambahan sayap barat telah selesai dengan baik.',
    content: `Assalamu’alaikum Warahmatullahi Wabarakatuh,

Segala puji hanya bagi Allah SWT, Tuhan semesta alam, yang telah memberikan kemudahan kepada segenap pengurus DKM dan jamaah Masjid Ar-Rohmah Komplek Bumi Narimbang Indah.

Kami sampaikan laporan bahwa per tanggal 24 September 2026, pekerjaan renovasi sarana:
1. Pemasangan partisi kaca kedap suara antara ruang shalat utama dan koridor sayap.
2. Penggelaran karpet shaf premium tebal sepanjang 3 shaf tambahan (mampu menampung sekitar 75 jamaah tambahan).
3. Pembersihan menyeluruh kisi-kisi pendingin udara (AC).

Telah tuntas 100% dan sudah dapat digunakan secara optimal oleh jamaah ikhwan maupun akhwat pada shalat lima waktu serta kajian rutin pekanan.

Total biaya realisasi proyek ini sebesar Rp 14.850.000 yang didanai sepenuhnya melalui Kas Wakaf Sarana & Donasi khusus jamaah warga Narimbang Indah. Kami mengucapkan jazakumullahu khairan katsiran kepada seluruh muhsinin dan donatur. Semoga menjadi amal jariyah yang terus mengalir pahalanya.`,
  },
  {
    id: 'art-3',
    title: 'Transparansi ZISWAF: Menunaikan Zakat Maal & Fitrah Tepat Sasaran',
    slug: 'transparansi-ziswaf-menunaikan-zakat-tepat-sasaran',
    category: 'ziswaf',
    author: 'Biro ZISWAF DKM Ar-Rohmah',
    date: '19 September 2026',
    readTime: '5 menit baca',
    featured: false,
    summary: 'Bagaimana DKM Masjid Ar-Rohmah mengelola dan mendistribusikan dana zakat, infaq, dan shadaqah secara amanah bagi mustahik di Kelurahan Jatimulya.',
    content: `Zakat merupakan rukun Islam yang mengaitkan kesalehan ritual dengan kesalehan sosial. Rasulullah SAW memerintahkan agar zakat diambil dari kalangan yang berpunya dan dibagikan kepada mereka yang membutuhkan di lingkungan sekitar.

Biro ZISWAF Masjid Ar-Rohmah berkomitmen mengedepankan prinsip:
1. Amanah Syar’i: Menyalurkan kepada 8 asnaf yang berhak berdasarkan ketentuan fiqih.
2. Transparan: Mencatat setiap rupiah yang masuk melalui nomor rekening resmi dan mengumumkan mutasi secara berkala.
3. Berkelanjutan: Tidak hanya menyalurkan bantuan konsumtif, tetapi juga membantu biaya pendidikan santri yatim dan modal usaha bergulir dhuafa warga sekitar.

Bagi jamaah yang ingin mengkonsultasikan hitungan zakat profesi atau menyerahkan zakat fitrah dan maal, pengurus ZISWAF siap melayani di sekretariat masjid setiap hari atau melalui layanan transfer bank resmi.`,
  },
  {
    id: 'art-4',
    title: 'Maklumat DKM: Pembentukan Panitia Peringatan Maulid Nabi SAW & Santunan Akbar',
    slug: 'maklumat-dkm-panitia-maulid-nabi-saw',
    category: 'pengumuman',
    author: 'Pengurus Harian DKM',
    date: '12 September 2026',
    readTime: '2 menit baca',
    featured: false,
    summary: 'Surat edaran pembentukan susunan panitia gabungan DKM, RISMA, dan Majelis Ta’lim untuk persiapan Tabligh Akbar Maulid Nabi 1448 H.',
    content: `Berdasarkan rapat pengurus DKM Masjid Ar-Rohmah bersama perwakilan RT/RW 07 Komplek Bumi Narimbang Indah pada tanggal 10 September 2026, telah disepakati:

1. Pembentukan Panitia Peringatan Hari Besar Islam (PHBI) Maulid Nabi Muhammad SAW 1448 H yang diketuai oleh Bpk. H. Ir. Mulyadi Saputra bersama Remaja Islam Masjid (RISMA).
2. Agenda Tabligh Akbar akan dilaksanakan pada hari Sabtu malam, 24 Oktober 2026 bertempat di Masjid Ar-Rohmah.
3. Target santunan akbar adalah 50 anak yatim dan 40 dhuafa di wilayah Kelurahan Jatimulya dan sekitarnya.
4. Partisipasi warga baik berupa donasi dana, konsumsi, maupun tenaga sangat dibuka.

Informasi konfirmasi partisipasi dan donasi dapat menghubungi nomor hotline sekretariat di 0812-1926-6161.`,
  },
];
