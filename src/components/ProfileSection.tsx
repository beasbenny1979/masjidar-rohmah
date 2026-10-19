import React from 'react';
import {
  ShieldCheck,
  Users,
  Building,
  Crown,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { CommitteeMember, MosqueInfo } from '../types';
import { resolveImageUrl, handleImageError } from '../utils/imageUtils';

interface ProfileSectionProps {
  members: CommitteeMember[];
  mosqueInfo?: MosqueInfo;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  members,
  mosqueInfo,
}) => {
  // 3 Key Leaders of DKM Masjid Ar-Rohmah
  const ketuaPelindung = members.find((m) => m.role.toLowerCase().includes('pelindung') || m.name.toLowerCase().includes('rafiudin')) || members[0];
  const ketuaDkm = members.find((m) => m.role.toLowerCase().includes('ketua dkm') || (m.role.toLowerCase().includes('ketua') && !m.role.toLowerCase().includes('pelindung')) || m.name.toLowerCase().includes('adih')) || members[1];
  const bendahara = members.find((m) => m.role.toLowerCase().includes('bendahara') || m.name.toLowerCase().includes('heri')) || members[2];

  return (
    <section id="profil" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mengenal Masjid Ar-Rohmah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Profil, Sejarah & Struktur Pengurus DKM
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Dedikasi warga Komplek Bumi Narimbang Indah dalam mewujudkan pusat peradaban Islam yang ramah, mandiri, dan berkhidmat untuk umat di Rangkasbitung.
          </p>
        </div>

        {/* Story & History Section */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 mb-14 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Latar Belakang & Sejarah Berdirinya Masjid
              </h3>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed text-justify">
                <p>
                  {mosqueInfo?.historyText ||
                    'Masjid Ar-Rohmah berdiri atas prakarsa dan gotong royong warga muslim di Komplek Bumi Narimbang Indah, Kelurahan Jatimulya, Kecamatan Rangkasbitung. Bertolak dari rasa kerinduan bersama akan adanya sarana ibadah fardhu berjamaah yang representatif, pembinaan generasi muda islami, serta wadah perekat silaturahmi warga perumahan dan masyarakat sekitar.'}
                </p>
                <p>
                  Melalui musyawarah warga, dibentuklah panitia pembangunan yang secara swadaya menghimpun wakaf tanah fasilitas umum (fasum) komplek dan infaq jariyah dari para muhsinin. Dari sebuah musholla sederhana, kini Masjid Ar-Rohmah telah berkembang menjadi bangunan dua lantai yang kokoh, asri, dan nyaman bagi jamaah.
                </p>
                <p>
                  Kini, kepengurusan DKM Masjid Ar-Rohmah dipimpin oleh <strong>Bapak Adih (Ketua DKM)</strong> dengan perlindungan dan pembinaan dari <strong>Bapak Rafiudin (Ketua Pelindung)</strong>, serta pengelolaan perbendaharaan kas transparan oleh <strong>Bapak Heri Kristiyanto (Bendahara DKM)</strong>.
                </p>
              </div>
            </div>

            {/* Visual Highlights Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                    <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold">
                      Filosofi Nama
                    </span>
                    <span className="font-arabic text-xl text-amber-300">الرَّحْمَة</span>
                  </div>

                  <h4 className="text-lg font-bold text-white">
                    {mosqueInfo?.philosophyTitle || '"Ar-Rohmah" (Menebar Kasih Sayang)'}
                  </h4>

                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    {mosqueInfo?.philosophyText ||
                      'Nama Ar-Rohmah diambil dari sifat Allah SWT yang Maha Pengasih dan Penyayang (Rahmatan lil \'Alamin). Masjid ini didedikasikan menjadi naungan kasih sayang bagi segenap jamaah, tempat berlindung, serta mata air kebaikan bagi lingkungan sekitar.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STRUKTUR PENGURUS DKM MASJID AR-ROHMAH (PELINDUNG, KETUA, DAN BENDAHARA) */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5 text-emerald-700" />
              <span>Struktur Pengurus Resmi DKM</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Struktur Pengurus DKM Masjid Ar-Rohmah
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Amanah kepengurusan dan takmir Masjid Ar-Rohmah diemban oleh <strong>Bapak Rafiudin</strong> (Ketua Pelindung), <strong>Bapak Adih</strong> (Ketua DKM), dan <strong>Bapak Heri Kristiyanto</strong> (Bendahara DKM).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. BAPAK RAFIUDIN - KETUA PELINDUNG */}
            {ketuaPelindung && (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200/90 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  {/* Photo Container: Half-body crop showing fingers on knees */}
                  <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-200 relative group shadow-inner">
                    {ketuaPelindung.avatarUrl ? (
                      <img
                        src={resolveImageUrl(ketuaPelindung.avatarUrl)}
                        alt="Bapak Rafiudin - Ketua Pelindung"
                        onError={(e) => handleImageError(e, 'avatar')}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        style={{ objectPosition: 'center 20%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-bold">
                        Bapak Rafiudin
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                      Ketua Pelindung
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                      {ketuaPelindung.division}
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      {ketuaPelindung.name}
                    </h4>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      {ketuaPelindung.role}
                    </span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {ketuaPelindung.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BAPAK ADIH - KETUA DKM */}
            {ketuaDkm && (
              <div className="bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl p-6 border-2 border-emerald-500 shadow-lg hover:shadow-xl transition-all flex flex-col relative ring-2 ring-emerald-400/20">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-800 text-amber-300 font-extrabold text-[11px] px-3.5 py-0.5 rounded-full shadow-sm tracking-wide">
                  KETUA DKM
                </div>

                <div>
                  {/* Photo Container */}
                  <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-emerald-300 relative group shadow-inner">
                    {ketuaDkm.avatarUrl ? (
                      <img
                        src={resolveImageUrl(ketuaDkm.avatarUrl)}
                        alt="Bapak Adih - Ketua DKM"
                        onError={(e) => handleImageError(e, 'avatar')}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-bold">
                        Bapak Adih
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-600">
                      Ketua DKM
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      {ketuaDkm.division}
                    </span>
                    <h4 className="text-xl font-black text-slate-900">
                      {ketuaDkm.name}
                    </h4>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-800 text-white text-xs font-bold shadow-2xs">
                      {ketuaDkm.role}
                    </span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {ketuaDkm.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BAPAK HERI KRISTIYANTO - BENDAHARA */}
            {bendahara && (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200/90 shadow-md hover:shadow-xl transition-all flex flex-col">
                <div>
                  {/* Photo Container: Centered face, white background, black suit */}
                  <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white mb-4 border border-slate-200 relative group shadow-inner">
                    {bendahara.avatarUrl ? (
                      <img
                        src={resolveImageUrl(bendahara.avatarUrl)}
                        alt="Bapak Heri Kristiyanto - Bendahara"
                        onError={(e) => handleImageError(e, 'avatar')}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-bold">
                        Bapak Heri Kristiyanto
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                      Bendahara DKM
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                      {bendahara.division}
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      {bendahara.name}
                    </h4>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      {bendahara.role}
                    </span>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {bendahara.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
