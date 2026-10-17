import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  Clock,
  ShieldCheck,
  ChevronRight,
  Tv,
  ArrowUp,
  Settings,
} from 'lucide-react';
import { MOSQUE_INFO } from '../data/mockData';
import { MosqueInfo } from '../types';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTvMode: () => void;
  onOpenAdmin?: () => void;
  mosqueInfo?: MosqueInfo;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTvMode, onOpenAdmin, mosqueInfo }) => {
  const info = mosqueInfo || MOSQUE_INFO;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Mosque Identity & Address */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-amber-400 shadow-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path d="M12 2v3m0 0a5 5 0 0 0-5 5v2h10v-2a5 5 0 0 0-5-5z" />
                  <path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {info.name}
                </h3>
                <p className="text-xs text-emerald-400">
                  {info.tagline || 'Komplek Bumi Narimbang Indah'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Pusat peradaban, ibadah berjamaah, pembinaan akhlak santri, dan transparansi tata kelola umat di Rangkasbitung, Kabupaten Lebak, Banten.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{info.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/62${(info.phone || '0812-1926-6161').replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  {info.phone} (Sekretariat DKM)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${info.email}`} className="hover:text-amber-300 transition-colors">
                  {info.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Menu Navigasi
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'jadwal-salat', label: 'Jadwal Salat Harian & Jumat' },
                { id: 'visi-misi', label: 'Visi & Misi DKM' },
                { id: 'galeri', label: 'Galeri Foto Dokumentasi' },
                { id: 'profil', label: 'Profil, Sejarah & Struktur DKM' },
                { id: 'donasi', label: 'Layanan Infaq, Sedekah & ZISWAF' },
                { id: 'keuangan', label: 'Laporan Keuangan & Kas Masjid' },
                { id: 'agenda', label: 'Agenda Pengajian & PHBI' },
                { id: 'berita', label: 'Artikel & Kabar Masjid' },
                { id: 'kontak', label: 'Kontak & Peta Lokasi' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan Umat */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Layanan Jamaah
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Salat Fardhu Berjamaah 5 Waktu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Salat Jumat & Khutbah Mingguan</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Kajian Subuh Mengaji & Fiqih Muslimah</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>TPA & Tahfidz Al-Qur'an Anak</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Pengurusan Jenazah & Ambulans 24 Jam</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Akad Nikah & Pembinaan Mualaf</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenTvMode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 text-xs font-semibold rounded-lg border border-emerald-700/60 transition-colors"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Layar Digital TV</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/40 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin DKM</span>
                </button>
              )}
            </div>
          </div>

          {/* Legalitas & Bank Info */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Legalitas & Rekening
            </h4>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
              <span className="text-slate-400 block font-medium">Nomor SK DKM:</span>
              <span className="text-slate-200 block font-mono text-[10px] break-all leading-tight">
                {MOSQUE_INFO.dkmSkNumber}
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
              <span className="text-slate-400 block font-medium">BSI ZISWAF:</span>
              <span className="text-amber-300 font-mono font-bold block text-xs">
                7182938401
              </span>
              <span className="text-slate-500 text-[10px] block">
                a.n DKM Masjid Ar-Rohmah
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Masjid Ar-Rohmah Komplek Bumi Narimbang Indah, Rangkasbitung, Lebak, Banten. Seluruh hak cipta dilindungi.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
