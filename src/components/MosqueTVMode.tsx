import React, { useState, useEffect } from 'react';
import {
  Clock,
  Volume2,
  Minimize2,
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Info
} from 'lucide-react';
import { PrayerTime, FridayOfficer } from '../types';
import { MOSQUE_INFO } from '../data/mockData';
import { getHijriDate } from '../utils/prayerTimes';

interface MosqueTVModeProps {
  onClose: () => void;
  prayers: PrayerTime[];
  upcomingInfo: {
    nextPrayer: PrayerTime;
    currentActivePrayer: PrayerTime;
    formattedCountdown: string;
  };
  fridayOfficer?: FridayOfficer;
}

export const MosqueTVMode: React.FC<MosqueTVModeProps> = ({
  onClose,
  prayers,
  upcomingInfo,
  fridayOfficer,
}) => {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hijri = getHijriDate(clock);
  const mainPrayers = prayers.filter((p) =>
    ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].includes(p.key)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-emerald-900/60 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-amber-300 shadow-lg border border-emerald-600/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
              <path d="M12 2v3m0 0a5 5 0 0 0-5 5v2h10v-2a5 5 0 0 0-5-5z" />
              <path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{MOSQUE_INFO.name}</span>
              <span className="text-xs font-mono font-bold bg-emerald-900 text-amber-300 px-2.5 py-0.5 rounded-full border border-emerald-700">
                DISPLAY MASJID
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-300/80">
              Komplek Bumi Narimbang Indah · Rangkasbitung, Lebak, Banten
            </p>
          </div>
        </div>

        {/* Huge Digital Clock */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-black text-amber-300 tracking-tight">
              {clock.toLocaleTimeString('id-ID', { hour12: false })}
            </div>
            <div className="text-xs sm:text-sm text-emerald-200 font-medium mt-0.5">
              {clock.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {hijri}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Keluar dari Mode TV"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Spotlight & Prayer Grid */}
      <div className="my-auto py-6 space-y-8">
        {/* Next Prayer Countdown Spotlight Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-2 border-emerald-600/50 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              WAKTU SALAT BERIKUTNYA
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              {upcomingInfo.nextPrayer.name}
              <span className="font-mono text-amber-300 ml-4">
                {upcomingInfo.nextPrayer.time} WIB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-6 py-4 rounded-2xl border border-emerald-700/60 shadow-inner">
            <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
            <div>
              <span className="text-xs text-emerald-300 block font-medium">Hitung Mundur Azan:</span>
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-300">
                {upcomingInfo.formattedCountdown}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Main Prayer Times Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {mainPrayers.map((prayer) => {
            const isNext = upcomingInfo.nextPrayer.key === prayer.key;

            return (
              <div
                key={prayer.key}
                className={`rounded-3xl p-5 sm:p-6 text-center transition-all border ${
                  isNext
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-2xl scale-105 ring-4 ring-amber-400/40'
                    : 'bg-emerald-950/50 text-white border-emerald-800/80'
                }`}
              >
                <span
                  className={`text-xs sm:text-sm font-black uppercase tracking-wider block ${
                    isNext ? 'text-slate-950 font-black' : 'text-emerald-300'
                  }`}
                >
                  {prayer.name}
                </span>
                <span className="font-arabic text-sm sm:text-base opacity-75 block mb-1">
                  {prayer.arabic}
                </span>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight my-2">
                  {prayer.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* Friday Officer Announcement Bar */}
        {fridayOfficer && (
          <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-800 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs">
                JUMAT PEKAN INI
              </span>
              <span className="text-white font-semibold">{fridayOfficer.date}:</span>
              <span className="text-emerald-200 italic">"{fridayOfficer.khutbahTheme}"</span>
            </div>

            <div className="flex items-center gap-4 text-emerald-200">
              <span>Khatib: <strong className="text-white">{fridayOfficer.khatib}</strong></span>
              <span>·</span>
              <span>Imam: <strong className="text-white">{fridayOfficer.imam}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Running Text Ticker */}
      <div className="bg-slate-900 border-t border-emerald-900/60 pt-3 flex items-center gap-4">
        <div className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider shrink-0">
          WARTA MASJID
        </div>
        <div className="overflow-hidden whitespace-nowrap text-xs sm:text-sm text-emerald-200">
          <div className="inline-block animate-marquee">
            ✦ Lurus dan rapatkan shaf shalat berjamaah karena lurusnya shaf merupakan bagian dari kesempurnaan shalat. ✦ Mohon menonaktifkan atau mengubah nada dering telepon genggam (HP) ke mode hening saat berada di dalam ruang shalat. ✦ Salurkan infaq, sedekah subuh, dan zakat melalui rekening resmi BSI 7182938401 a.n DKM Masjid Ar-Rohmah Narimbang. ✦ Kajian Subuh Mengaji rutin setiap Ahad Subuh bersama K.H. Ahmad Hasan Basri, M.Ag.
          </div>
        </div>
      </div>
    </div>
  );
};
