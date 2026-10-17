import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Printer,
  ChevronDown,
  ChevronUp,
  User,
  Sparkles,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { PrayerTime, FridayOfficer } from '../types';
import {
  generateMonthlyCalendar,
  getHijriDate,
} from '../utils/prayerTimes';

interface PrayerSectionProps {
  prayers: PrayerTime[];
  upcomingInfo: {
    nextPrayer: PrayerTime;
    currentActivePrayer: PrayerTime;
    formattedCountdown: string;
  };
  fridayOfficers: FridayOfficer[];
  currentTime: Date;
}

export const PrayerSection: React.FC<PrayerSectionProps> = ({
  prayers,
  upcomingInfo,
  fridayOfficers,
  currentTime,
}) => {
  const [activeTab, setActiveTab] = useState<'harian' | 'jumat' | 'bulanan'>('harian');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentTime.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentTime.getFullYear());
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const thisWeekFriday = fridayOfficers[0];
  const upcomingFridays = fridayOfficers.slice(1);

  const toggleSound = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      setNotificationMsg('Notifikasi audio azan diaktifkan.');
      // Play a soft test chime
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch {
        // audio context fallback
      }
      setTimeout(() => setNotificationMsg(null), 3000);
    } else {
      setSoundEnabled(false);
      setNotificationMsg('Notifikasi audio dimatikan.');
      setTimeout(() => setNotificationMsg(null), 2500);
    }
  };

  const monthlyData = generateMonthlyCalendar(selectedYear, selectedMonth);

  const handlePrintMonthly = () => {
    window.print();
  };

  return (
    <section id="jadwal-salat" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Kemenag RI & Titik Koordinat Rangkasbitung</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Jadwal Salat Harian & Salat Jumat
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Waktu azan dan jadwal salat akurat untuk wilayah Kecamatan Rangkasbitung, Kabupaten Lebak (WIB UTC+7) serta susunan petugas Jumat bergilir.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-8 p-1.5 bg-slate-200/80 rounded-xl max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('harian')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'harian'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Salat Harian
          </button>
          <button
            onClick={() => setActiveTab('jumat')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'jumat'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Petugas Sholat Jumat
          </button>
          <button
            onClick={() => setActiveTab('bulanan')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'bulanan'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jadwal 1 Bulan
          </button>
        </div>

        {notificationMsg && (
          <div className="max-w-md mx-auto mb-6 p-3 rounded-lg bg-emerald-800 text-white text-xs text-center shadow-lg transition-all">
            {notificationMsg}
          </div>
        )}

        {/* TAB 1: SALAT HARIAN */}
        {activeTab === 'harian' && (
          <div className="space-y-8">
            {/* Live Indicator Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Clock className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
                      {currentTime.toLocaleTimeString('id-ID', { hour12: false })} WIB
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {getHijriDate(currentTime)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={toggleSound}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    soundEnabled
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Alarm Azan: Aktif</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-400" />
                      <span>Bunyikan Alarm Azan</span>
                    </>
                  )}
                </button>

                <div className="px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                  Menuju <span className="font-bold">{upcomingInfo.nextPrayer.name}</span>:{' '}
                  <span className="font-mono font-bold text-amber-800">{upcomingInfo.formattedCountdown}</span>
                </div>
              </div>
            </div>

            {/* Prayers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {prayers.map((prayer) => {
                const isNext = upcomingInfo.nextPrayer.key === prayer.key;
                const isCurrent = upcomingInfo.currentActivePrayer.key === prayer.key;

                return (
                  <div
                    key={prayer.key}
                    className={`relative rounded-2xl p-4 transition-all border ${
                      isNext
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                        : isCurrent
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-200 hover:shadow-xs'
                    }`}
                  >
                    {isNext && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Berikutnya
                      </span>
                    )}

                    <div className="text-center space-y-1">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider block ${
                          isNext ? 'text-slate-950 font-black' : isCurrent ? 'text-emerald-800' : 'text-slate-500'
                        }`}
                      >
                        {prayer.name}
                      </span>
                      <span className="font-arabic text-sm opacity-70 block">{prayer.arabic}</span>
                      <div className="text-xl sm:text-2xl font-black font-mono tracking-tight pt-1 pb-1">
                        {prayer.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PETUGAS SHALAT JUMAT */}
        {activeTab === 'jumat' && (
          <div className="space-y-8">
            {/* Featured This Week Friday */}
            {thisWeekFriday && (
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-extrabold rounded-full uppercase tracking-wider">
                        Pekan Ini
                      </span>
                      <span className="text-base sm:text-lg font-bold text-emerald-200">
                        {thisWeekFriday.date}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-300 font-mono">
                      {thisWeekFriday.hijriDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                      Judul Khutbah Jumat
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
                      "{thisWeekFriday.khutbahTheme}"
                    </h3>
                  </div>

                  {/* Officer Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 rounded-xl p-4">
                      <span className="text-xs text-emerald-300 block font-medium">Khatib Sholat Jumat</span>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                          KH
                        </div>
                        <span className="text-sm font-bold text-white">{thisWeekFriday.khatib}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 rounded-xl p-4">
                      <span className="text-xs text-emerald-300 block font-medium">Imam Sholat Jumat</span>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                          IM
                        </div>
                        <span className="text-sm font-bold text-white">{thisWeekFriday.imam}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 rounded-xl p-4">
                      <span className="text-xs text-emerald-300 block font-medium">Muadzin</span>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                          MZ
                        </div>
                        <span className="text-sm font-bold text-white">{thisWeekFriday.muadzin}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/60 rounded-xl p-4">
                      <span className="text-xs text-emerald-300 block font-medium">Bilal / Muraqqi</span>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center font-bold text-xs">
                          BL
                        </div>
                        <span className="text-sm font-bold text-white">{thisWeekFriday.bilal || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {thisWeekFriday.note && (
                    <p className="text-xs text-emerald-200/90 italic bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80">
                      Catatan DKM: {thisWeekFriday.note}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Upcoming Friday Officer Rotation */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>Jadwal Petugas Shalat Jumat Pekan Berikutnya</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingFridays.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <span className="font-bold text-sm text-emerald-900">{item.date}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{item.hijriDate}</span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-800 mb-3 line-clamp-2">
                        "{item.khutbahTheme}"
                      </h4>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-500">Khatib</span>
                          <span className="font-semibold text-slate-800 text-right">{item.khatib}</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-500">Imam</span>
                          <span className="font-semibold text-slate-800 text-right">{item.imam}</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                          <span className="text-slate-500">Muadzin</span>
                          <span className="font-semibold text-slate-800 text-right">{item.muadzin}</span>
                        </div>
                      </div>
                    </div>

                    {item.note && (
                      <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 italic">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JADWAL 1 BULAN & CETAK */}
        {activeTab === 'bulanan' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Jadwal Waktu Salat Rangkasbitung 1 Bulan Penuh
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berdasarkan hisab astronomi standar Kementerian Agama Republik Indonesia (+2 menit ihtiyat).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={9}>Oktober 2026</option>
                  <option value={10}>November 2026</option>
                  <option value={11}>Desember 2026</option>
                </select>

                <button
                  onClick={handlePrintMonthly}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Jadwal</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Tanggal</th>
                    <th className="py-2.5 px-2">Hijriah</th>
                    <th className="py-2.5 px-2 text-center">Imsak</th>
                    <th className="py-2.5 px-2 text-center font-extrabold text-emerald-900">Subuh</th>
                    <th className="py-2.5 px-2 text-center">Terbit</th>
                    <th className="py-2.5 px-2 text-center">Dhuha</th>
                    <th className="py-2.5 px-2 text-center font-extrabold text-emerald-900">Dzuhur</th>
                    <th className="py-2.5 px-2 text-center font-extrabold text-emerald-900">Ashar</th>
                    <th className="py-2.5 px-2 text-center font-extrabold text-emerald-900">Maghrib</th>
                    <th className="py-2.5 px-2 text-center font-extrabold text-emerald-900 rounded-r-lg">Isya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyData.map((row, idx) => {
                    const isToday =
                      row.date.getDate() === currentTime.getDate() &&
                      row.date.getMonth() === currentTime.getMonth();

                    const prayerMap = Object.fromEntries(row.times.map((p) => [p.key, p.time]));

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isToday ? 'bg-amber-100/60 font-bold text-slate-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-3 whitespace-nowrap">
                          {row.dateStr}
                          {isToday && (
                            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-[10px] text-slate-900 rounded">
                              Hari ini
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-slate-500 whitespace-nowrap">{row.hijriStr}</td>
                        <td className="py-2 px-2 text-center font-mono text-slate-600">{prayerMap.imsak}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-900">{prayerMap.subuh}</td>
                        <td className="py-2 px-2 text-center font-mono text-slate-500">{prayerMap.terbit}</td>
                        <td className="py-2 px-2 text-center font-mono text-slate-600">{prayerMap.dhuha}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-900">{prayerMap.dzuhur}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-900">{prayerMap.ashar}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-900">{prayerMap.maghrib}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-900">{prayerMap.isya}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>
    </section>
  );
};
