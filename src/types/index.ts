export type PrayerKey = 'imsak' | 'subuh' | 'terbit' | 'dhuha' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export interface PrayerTime {
  key: PrayerKey;
  name: string;
  arabic: string;
  time: string; // HH:mm
  iqamahTime?: string; // HH:mm
  iqamahDelayMinutes?: number;
}

export interface FridayOfficer {
  id: string;
  date: string; // YYYY-MM-DD or readable
  hijriDate: string;
  khatib: string;
  imam: string;
  muadzin: string;
  bilal?: string;
  khutbahTheme: string;
  note?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  division: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface MosqueImage {
  id: string;
  title: string;
  category: 'Eksterior' | 'Ruang Sholat' | 'Fasilitas' | 'Kegiatan';
  imageUrl: string;
  caption?: string;
  uploadedAt: string;
}

export interface MosqueInfo {
  name: string;
  tagline: string;
  address: string;
  email: string;
  phone: string;
  phoneFormatted: string;
  mapsEmbedUrl: string;
  mapsDirectUrl: string;
  dkmSkNumber: string;
  establishedYear: string;
  qiblaDirection: string;
  historyText?: string;
  visionText?: string;
  missionsList?: string[];
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  quranVerseArabic?: string;
  quranVerseTranslation?: string;
  quranVerseReference?: string;
  philosophyTitle?: string;
  philosophyText?: string;
  qrisImageUrl?: string;
  qrisNmid?: string;
}

export interface MosqueFacility {
  id: string;
  title: string;
  description: string;
  iconName: string;
  capacity?: string;
  status: 'Tersedia' | 'Sedang Digunakan' | 'Dalam Pemeliharaan';
}

export type CashCategory = 'operasional' | 'pembangunan' | 'ziswaf' | 'yatim';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'masuk' | 'keluar';
  category: CashCategory;
  categoryLabel: string;
  description: string;
  amount: number;
  recordedBy: string;
  referenceNumber?: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  operasionalBalance: number;
  pembangunanBalance: number;
  ziswafBalance: number;
  yatimBalance: number;
  lastUpdated: string;
  lastReconciledAt?: string;
}

export type AgendaCategory = 'kajian_rutin' | 'kajian_tematik' | 'phbi' | 'sosial' | 'tpa';

export interface AgendaEvent {
  id: string;
  title: string;
  category: AgendaCategory;
  speaker?: string;
  themeOrKitab?: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isRecurring?: boolean;
  recurrenceText?: string;
  hasLiveStream?: boolean;
  liveStreamUrl?: string;
  status: 'Mendatang' | 'Berjalan' | 'Selesai';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  badge?: string;
  logoText?: string;
}

export interface DonorPrayer {
  id: string;
  donorName: string;
  amount?: number;
  category: string;
  prayer: string;
  date: string;
}

export interface DonationSubmission {
  donorName: string;
  phone: string;
  program: string;
  amount: number;
  bankDestination: string;
  prayer?: string;
  isAnonymous?: boolean;
  transferDate: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'tausiyah' | 'berita' | 'pengumuman' | 'ziswaf';
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string; // rich paragraphs & arabic quotes
  imageUrl?: string;
  featured?: boolean;
}

export interface ServiceInquiry {
  fullName: string;
  whatsapp: string;
  email?: string;
  serviceType: 'akad_nikah' | 'pengurusan_jenazah' | 'konsultasi_agama' | 'pinjam_aula' | 'ziswaf_jemput' | 'lainnya';
  dateRequired?: string;
  notes: string;
}
