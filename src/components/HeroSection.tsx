import React from 'react';
import {
  MapPin,
  Clock,
  Heart,
  ChevronRight,
  Sparkles,
  PhoneCall,
  CalendarCheck
} from 'lucide-react';
import { MOSQUE_INFO } from '../data/mockData';
import { PrayerTime, MosqueInfo } from '../types';
import { resolveImageUrl } from '../utils/imageUtils';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  prayers: PrayerTime[];
  upcomingInfo: {
    nextPrayer: PrayerTime;
    currentActivePrayer: PrayerTime;
    formattedCountdown: string;
    hoursLeft: number;
    minsLeft: number;
  };
  hijriDate: string;
  mosqueInfo?: MosqueInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  prayers,
  upcomingInfo,
  hijriDate,
  mosqueInfo,
}) => {
  const info = mosqueInfo || MOSQUE_INFO;
  const mainPrayers = prayers.filter((p) =>
    ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].includes(p.key)
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative Islamic Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="islamic-geo-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 0 L80 40 L40 80 L0 40 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="40" cy="40" r="18" fill="none" stroke="#ffffff" strokeWidth="1" />
              <circle cx="0" cy="0" r="10" fill="none" stroke="#ffffff" strokeWidth="1" />
              <circle cx="80" cy="0" r="10" fill="none" stroke="#ffffff" strokeWidth="1" />
              <circle cx="0" cy="80" r="10" fill="none" stroke="#ffffff" strokeWidth="1" />
              <circle cx="80" cy="80" r="10" fill="none" stroke="#ffffff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-geo-pattern)" />
        </svg>
      </div>

      {/* Dynamic Hero Image if set by Admin */}
      {info.heroImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-luminosity"
          style={{ backgroundImage: `url(${resolveImageUrl(info.heroImageUrl)})` }}
        />
      )}

      {/* Radiant Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Mosque Introduction & Key Info */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{info.heroBadge || 'Portal Resmi DKM Masjid Ar-Rohmah Rangkasbitung'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {info.heroTitle ? (
                  info.heroTitle
                ) : (
                  <>
                    {info.name}, <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-200 bg-clip-text text-transparent">
                      Rangkasbitung
                    </span>
                  </>
                )}
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {info.heroSubtitle || 'Pusat ibadah, kajian keislaman, pembinaan generasi qur’ani, dan pelayanan sosial kemasyarakatan yang transparan dan amanah di Rangkasbitung, Kabupaten Lebak.'}
              </p>
            </div>

            {/* Address & Mosque Credentials */}
            <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0 text-amber-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-white">Lokasi Masjid:</p>
                <p className="text-emerald-200/90 text-xs sm:text-xs leading-relaxed">
                  {info.address}
                </p>
              </div>
              <button
                onClick={() => onNavigate('kontak')}
                className="self-stretch sm:self-center px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-200 hover:text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Lihat Rute Peta
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => onNavigate('jadwal-salat')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
              >
                <Clock className="w-4 h-4 text-slate-900" />
                <span>Jadwal Salat & Sholat Jumat</span>
                <ChevronRight className="w-4 h-4 text-slate-900" />
              </button>

              <button
                onClick={() => onNavigate('donasi')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-600/70 text-white font-semibold text-sm transition-all"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Donasi & ZISWAF</span>
              </button>

              <a
                href={`https://wa.me/62${(info.phone || '0812-1926-6161').replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Assalamu%27alaikum%20Pengurus%20DKM%20Masjid%20Ar-Rohmah,%20saya%20ingin%20bertanya`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-200 text-sm font-medium border border-slate-700 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp DKM</span>
              </a>
            </div>

            {/* Quran Verse */}
            <div className="pt-2 border-t border-emerald-800/50 text-left">
              <p className="font-arabic text-right text-base sm:text-lg text-amber-200/95 leading-relaxed" dir="rtl">
                {info.quranVerseArabic || 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ وَأَقَامَ الصَّلَاةَ وَآتَى الزَّكَاةَ وَلَمْ يَخْشَ إِلَّا اللَّهَ ۖ فَعَسَىٰ أُولَٰئِكَ أَنْ يَكُونُوا مِنَ الْمُهْتَدِينَ'}
              </p>
              <p className="text-xs text-emerald-300/80 italic mt-1 leading-relaxed">
                {info.quranVerseTranslation || '"Sesungguhnya yang memakmurkan masjid Allah hanyalah orang-orang yang beriman kepada Allah dan hari kemudian, serta (tetap) melaksanakan shalat, menunaikan zakat dan tidak takut (kepada apa pun) kecuali kepada Allah. Maka mudah-mudahan mereka termasuk orang-orang yang mendapat petunjuk."'}
                <span className="font-semibold text-amber-300 ml-1"> {info.quranVerseReference || '(QS. At-Taubah: 18)'}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Prayer Card & Live Status */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/95 to-emerald-950/95 border border-emerald-700/50 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header Card */}
              <div className="flex items-center justify-between border-b border-emerald-800/70 pb-4 mb-4">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                    Waktu Sholat Rangkasbitung
                  </span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span>{hijriDate}</span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-emerald-800/90 text-amber-300 text-xs font-mono font-bold border border-emerald-700">
                    WIB (UTC+7)
                  </span>
                </div>
              </div>

              {/* Next Prayer Countdown Spotlight */}
              <div className="bg-gradient-to-r from-emerald-900/80 to-teal-950/80 border border-emerald-600/40 rounded-xl p-4 text-center mb-5">
                <span className="text-xs text-emerald-200">Menuju Waktu Shalat</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 font-sans tracking-wide">
                  {upcomingInfo.nextPrayer.name}
                  <span className="text-amber-300 text-xl font-normal ml-2 font-mono">
                    ({upcomingInfo.nextPrayer.time} WIB)
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs text-emerald-300">Hitung Mundur:</span>
                  <span className="font-mono text-base font-bold text-amber-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                    {upcomingInfo.formattedCountdown}
                  </span>
                </div>
              </div>

              {/* 5 Main Prayer Times Grid */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center mb-5">
                {mainPrayers.map((item) => {
                  const isNext = upcomingInfo.nextPrayer.key === item.key;
                  return (
                    <div
                      key={item.key}
                      className={`p-2 rounded-xl transition-all ${
                        isNext
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md scale-105'
                          : 'bg-emerald-900/40 hover:bg-emerald-800/40 text-emerald-100 border border-emerald-800/50'
                      }`}
                    >
                      <span className={`text-[11px] block font-medium ${isNext ? 'text-slate-900' : 'text-emerald-300'}`}>
                        {item.name}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-extrabold block mt-0.5">
                        {item.time}
                      </span>
                      <span className={`text-[10px] block opacity-80 ${isNext ? 'text-slate-800' : 'text-emerald-400'}`}>
                        {item.arabic}
                      </span>
                    </div>
                  );
                })}
              </div>



              <div className="mt-4">
                <button
                  onClick={() => onNavigate('jadwal-salat')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-emerald-100 transition-colors"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Lihat Jadwal Khatib Jumat & Jadwal Sebulan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
