import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Navigation,
  Compass,
  Train,
  Car,
  Clock,
  CheckCircle2,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { MOSQUE_INFO } from '../data/mockData';
import { ServiceInquiry, MosqueInfo } from '../types';

interface ContactSectionProps {
  mosqueInfo?: MosqueInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ mosqueInfo }) => {
  const info = mosqueInfo || MOSQUE_INFO;
  const [inquiry, setInquiry] = useState<ServiceInquiry>({
    fullName: '',
    whatsapp: '',
    email: '',
    serviceType: 'konsultasi_agama',
    dateRequired: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.fullName || !inquiry.whatsapp) return;

    const serviceLabels = {
      akad_nikah: 'Pelaksanaan Akad Nikah di Masjid',
      pengurusan_jenazah: 'Layanan Fardhu Kifayah & Mobil Jenazah (24 Jam)',
      konsultasi_agama: 'Konsultasi Agama / Bimbingan Mualaf',
      pinjam_aula: 'Peminjaman Aula & Sarana Masjid',
      ziswaf_jemput: 'Layanan Jemput ZISWAF ke Rumah',
      lainnya: 'Lainnya / Pertanyaan Umum',
    };

    const text =
      `*FORMULIR LAYANAN JAMAAH - MASJID AR-ROHMAH*\n\n` +
      `👤 *Nama*: ${inquiry.fullName}\n` +
      `📱 *WhatsApp*: ${inquiry.whatsapp}\n` +
      (inquiry.email ? `📧 *Email*: ${inquiry.email}\n` : '') +
      `📌 *Jenis Layanan*: ${serviceLabels[inquiry.serviceType]}\n` +
      (inquiry.dateRequired ? `🗓 *Rencana Waktu/Tanggal*: ${inquiry.dateRequired}\n` : '') +
      `📝 *Catatan / Keperluan*:\n${inquiry.notes}\n\n` +
      `_Mohon informasi tindak lanjut dari sekretariat DKM Masjid Ar-Rohmah._`;

    const waUrl = `https://wa.me/62${(info.phone || '0812-1926-6161').replace(/[^0-9]/g, '').replace(/^0/, '')}?text=${encodeURIComponent(text)}`;

    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  return (
    <section id="kontak" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Akses & Sekretariat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kontak, Alamat & Peta Lokasi
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Pusat informasi dan layanan jamaah Masjid Ar-Rohmah. Jamaah dan tamu dapat menghubungi sekretariat atau langsung mengunjungi lokasi masjid.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* Address */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Alamat Lengkap</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {info.address}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200">
              <a
                href={info.mapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Buka Petunjuk Arah Google Maps</span>
              </a>
            </div>
          </div>

          {/* Phone / WA */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Telepon / WhatsApp</h3>
              <p className="text-xs text-slate-500 mb-2">
                Hotline sekretariat DKM melayani informasi ibadah, kajian, dan konfirmasi ZISWAF.
              </p>
              <div className="text-xl font-bold font-mono text-emerald-950">
                {info.phone}
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-200">
              <a
                href={`https://wa.me/62${(info.phone || '0812-1926-6161').replace(/[^0-9]/g, '').replace(/^0/, '')}?text=Assalamu%27alaikum%20Pengurus%20Masjid%20Ar-Rohmah`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                <span>Kirim Pesan WhatsApp Sekarang</span>
              </a>
            </div>
          </div>

          {/* Email & Operasional */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Email & Layanan</h3>
              <p className="text-xs text-slate-500 mb-2">
                Korespondensi resmi, proposal kerjasama, dan surat-menyurat DKM.
              </p>
              <div className="text-sm font-semibold font-mono text-slate-800 break-all">
                {info.email}
              </div>
            </div>
          </div>
        </div>

        {/* Map & Navigation Route Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-center">
          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xs h-96 relative">
            <iframe
              title="Peta Lokasi Masjid Ar-Rohmah Rangkasbitung"
              src={info.mapsEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-md text-xs font-semibold text-slate-800">
              <a
                href={info.mapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buka di Aplikasi Google Maps</span>
              </a>
            </div>
          </div>

          {/* Route Directions */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Panduan Menuju Lokasi
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Petunjuk Arah & Akses Transportasi
            </h3>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Dari Stasiun KRL Rangkasbitung (~3.2 Km)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Hanya 7-10 menit berkendara melalui Jl. Sunan Kalijaga lalu masuk Jl. Jendral Sudirman arah Pandeglang/Leuwidamar. Komplek berada di KM 2 sebelah kiri jalan.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Dari Alun-alun Rangkasbitung (~2.5 Km)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Sekitar 5-7 menit perjalanan lurus menuju arah Selatan melalui Jl. Jendral Sudirman.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Layanan Fardhu Kifayah 24 Jam
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Untuk keadaan darurat duka cita / pemulasaraan jenazah warga, nomor hotline <strong>{MOSQUE_INFO.phone}</strong> dapat dihubungi 24 jam nonstop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layanan Jamaah / Form Inquiry */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Khidmat DKM
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Formulir Permohonan Layanan Jamaah
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ajukan permohonan pelaksanaan akad nikah, fardhu kifayah jenazah, bimbingan keagamaan, atau peminjaman aula serbaguna masjid.
            </p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Permohonan Anda berhasil diajukan! Sekretariat DKM akan segera memproses melalui nomor WhatsApp Anda.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Lengkap Pemohon
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Rahmat Hidayat"
                  value={inquiry.fullName}
                  onChange={(e) => setInquiry({ ...inquiry, fullName: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081219266161"
                  value={inquiry.whatsapp}
                  onChange={(e) => setInquiry({ ...inquiry, whatsapp: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jenis Layanan yang Dibutuhkan
                </label>
                <select
                  value={inquiry.serviceType}
                  onChange={(e) => setInquiry({ ...inquiry, serviceType: e.target.value as ServiceInquiry['serviceType'] })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="akad_nikah">Akad Nikah di Masjid Ar-Rohmah</option>
                  <option value="pengurusan_jenazah">Fardhu Kifayah & Mobil Jenazah (24 Jam)</option>
                  <option value="konsultasi_agama">Bimbingan Mualaf & Konsultasi Agama</option>
                  <option value="pinjam_aula">Peminjaman Aula Serbaguna / Sarpras</option>
                  <option value="ziswaf_jemput">Layanan Jemput ZISWAF ke Rumah</option>
                  <option value="lainnya">Pertanyaan Umum / Saran Jamaah</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Rencana Tanggal / Waktu (Jika ada)
                </label>
                <input
                  type="date"
                  value={inquiry.dateRequired}
                  onChange={(e) => setInquiry({ ...inquiry, dateRequired: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Rinci / Rincian Kebutuhan
              </label>
              <textarea
                rows={3}
                required
                placeholder="Jelaskan kebutuhan, jumlah perkiraan jamaah/hadirin, atau alamat rumah pemohon..."
                value={inquiry.notes}
                onChange={(e) => setInquiry({ ...inquiry, notes: e.target.value })}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>Kirim Permohonan Layanan ke Sekretariat DKM</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
