import React, { useState, useEffect } from 'react';
import {
  Clock,
  Menu,
  X,
  Heart,
  Tv,
  MapPin,
  ChevronRight,
  Phone,
  Calendar,
  FileText,
  ShieldCheck,
  BookOpen,
  Camera,
  Target,
  Building,
  Settings,
} from 'lucide-react';
import { MOSQUE_INFO } from '../data/mockData';
import { MosqueInfo } from '../types';
import { calculatePrayerTimes, getUpcomingPrayerInfo, getHijriDate } from '../utils/prayerTimes';

interface NavbarProps {
  onOpenTvMode: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  mosqueInfo?: MosqueInfo;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTvMode, onOpenAdmin, activeSection, onNavigate, mosqueInfo }) => {
  const info = mosqueInfo || MOSQUE_INFO;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prayers = calculatePrayerTimes(currentTime);
  const upcomingInfo = getUpcomingPrayerInfo(prayers, currentTime);
  const hijriString = getHijriDate(currentTime);

  const navItems = [
    { id: 'jadwal-salat', label: 'Jadwal Salat & Jumat', icon: Clock },
    { id: 'visi-misi', label: 'Visi & Misi', icon: Target },
    { id: 'profil', label: 'Profil & Pengurus', icon: ShieldCheck },
    { id: 'galeri', label: 'Galeri Foto', icon: Camera },
    { id: 'fasilitas', label: 'Fasilitas Masjid', icon: Building },
    { id: 'donasi', label: 'Infaq & ZISWAF', icon: Heart },
    { id: 'keuangan', label: 'Laporan Kas', icon: FileText },
    { id: 'agenda', label: 'Agenda & Kajian', icon: Calendar },
    { id: 'berita', label: 'Artikel & Berita', icon: BookOpen },
    { id: 'kontak', label: 'Kontak & Lokasi', icon: MapPin },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 sm:px-6 border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 truncate">
            <span className="flex items-center gap-1 font-medium text-amber-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Komplek Bumi Narimbang Indah, Rangkasbitung</span>
            </span>
            <span className="hidden md:inline text-emerald-500">|</span>
            <span className="hidden md:inline text-emerald-200">
              {hijriString}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200">
              <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>
                Menuju {upcomingInfo?.nextPrayer?.name || 'Subuh'}: <strong className="text-white font-mono">{upcomingInfo?.formattedCountdown || '00:00:00'}</strong>
              </span>
            </div>

            <a
              href={`https://wa.me/62${(info.phone || '0812-1926-6161').replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Assalamu%27alaikum%20Pengurus%20Masjid%20Ar-Rohmah`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{info.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full bg-white/95 backdrop-blur-md transition-shadow duration-200 border-b border-emerald-100 ${
          isScrolled ? 'shadow-md py-2.5' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Mosque Identity */}
          <button
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-400 shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                {/* Islamic Dome & Crescent Icon */}
                <path d="M12 2v3m0 0a5 5 0 0 0-5 5v2h10v-2a5 5 0 0 0-5-5z" />
                <path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z" />
                <path d="M10 22v-4a2 2 0 0 1 4 0v4" />
                <circle cx="12" cy="2" r="0.75" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-950 tracking-tight leading-none">
                  {info.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                {info.tagline || 'Bumi Narimbang Indah · Lebak Banten'}
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-emerald-900 bg-emerald-50 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              title="Panel Admin DKM - Edit Wording, Foto & Data"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
              <span>Admin DKM</span>
            </button>

            <button
              onClick={onOpenTvMode}
              title="Tampilkan Mode Layar TV Masjid (Digital Signage)"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/80 transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-emerald-700" />
              <span>Display TV</span>
            </button>

            <button
              onClick={() => handleNavClick('donasi')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 rounded-lg shadow-sm transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Infaq / ZISWAF</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenTvMode}
              title="Tampilkan Mode Layar TV Masjid"
              className="p-2 text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              <Tv className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2 mb-2 bg-emerald-50/70 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                <span>Waktu Sholat Berikutnya:</span>
                <span className="font-bold">
                  {upcomingInfo.nextPrayer.name} ({upcomingInfo.nextPrayer.time} WIB)
                </span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-800 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm rounded-lg border border-amber-300"
                >
                  <Settings className="w-4 h-4 text-amber-700" />
                  <span>Panel Admin DKM (Edit Website)</span>
                </button>

                <button
                  onClick={() => handleNavClick('donasi')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm"
                >
                  <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Donasi & ZISWAF Online</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
