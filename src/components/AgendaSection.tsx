import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Share2,
  CalendarPlus,
  Video,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { AgendaEvent, AgendaCategory } from '../types';
import { AGENDA_EVENTS, MOSQUE_INFO } from '../data/mockData';

interface AgendaSectionProps {
  events?: AgendaEvent[];
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({ events }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const displayEvents = events && events.length > 0 ? events : AGENDA_EVENTS;

  const categories = [
    { key: 'all', label: 'Semua Agenda' },
    { key: 'kajian_rutin', label: 'Kajian Rutin Pekanan' },
    { key: 'phbi', label: 'Acara Besar & PHBI' },
    { key: 'sosial', label: 'Kegiatan Sosial' },
    { key: 'tpa', label: 'Pendidikan & TPA' },
  ];

  const filteredEvents =
    activeCategory === 'all'
      ? displayEvents
      : displayEvents.filter((e) => e.category === activeCategory);

  const handleShareWA = (event: AgendaEvent) => {
    const text = `*Informasi Agenda Masjid Ar-Rohmah Rangkasbitung*\n\n📌 *${event.title}*\n🎙 Pemateri: ${event.speaker || '-'}\n📖 Tema/Kitab: ${event.themeOrKitab || '-'}\n🗓 Waktu: ${event.date} (${event.time})\n📍 Tempat: ${event.location}\n\n${event.description}\n\nMari hadir bersama keluarga untuk memakmurkan rumah Allah SWT!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleAddToCalendar = (event: AgendaEvent) => {
    // Generate Google Calendar Link
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `${event.description}\n\nPemateri: ${event.speaker || '-'}\nKitab: ${event.themeOrKitab || '-'}\nMasjid Ar-Rohmah Rangkasbitung`
    );
    const location = encodeURIComponent(`${MOSQUE_INFO.name}, ${MOSQUE_INFO.address}`);
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  return (
    <section id="agenda" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kajian & Peringatan Hari Besar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Agenda Kegiatan & Majelis Ilmu
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Jadwal pengajian rutin pekanan, tabligh akbar hari besar Islam, bimbingan generasi qur’ani, dan bakti sosial di lingkungan Komplek Bumi Narimbang Indah.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Belum ada agenda pada kategori ini</p>
            <p className="text-xs text-slate-500 mt-1">Pengurus DKM dapat menambahkan jadwal baru melalui Panel Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
            const isPhbi = event.category === 'phbi';

            return (
              <div
                key={event.id}
                className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  isPhbi
                    ? 'bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-white border-amber-300 shadow-sm ring-1 ring-amber-400/40'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isPhbi
                          ? 'bg-amber-400 text-slate-950 font-extrabold'
                          : event.category === 'kajian_rutin'
                          ? 'bg-emerald-100 text-emerald-800'
                          : event.category === 'sosial'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {event.recurrenceText || (isPhbi ? 'Tabligh Akbar' : 'Agenda Masjid')}
                    </span>

                    {event.hasLiveStream && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <Video className="w-3 h-3 text-rose-500" />
                        <span>Live Youtube</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mb-2">
                    {event.title}
                  </h3>

                  {event.themeOrKitab && (
                    <div className="flex items-start gap-1.5 text-xs text-emerald-900 font-medium bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 mb-3">
                      <BookOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{event.themeOrKitab}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    {event.speaker && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800">{event.speaker}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAddToCalendar(event)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    title="Tambahkan ke Google Calendar"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Ingatkan Saya</span>
                  </button>

                  <button
                    onClick={() => handleShareWA(event)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                    title="Bagikan info kajian ke WhatsApp keluarga & jamaah"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Sebarkan Info</span>
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}

      </div>
    </section>
  );
};
