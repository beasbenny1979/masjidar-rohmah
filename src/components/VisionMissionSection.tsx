import React from 'react';
import { Target, Compass } from 'lucide-react';
import { MosqueInfo } from '../types';

interface VisionMissionSectionProps {
  mosqueInfo?: MosqueInfo;
}

export const VisionMissionSection: React.FC<VisionMissionSectionProps> = ({ mosqueInfo }) => {
  return (
    <section id="visi-misi" className="py-10 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Visi & Misi - Dibuat Jadi Satu Card Ringkas */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                Visi & Misi Masjid Ar-Rohmah
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Amanah, komitmen pelayanan ibadah, dan panduan dakwah DKM Masjid Ar-Rohmah
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            {/* Visi */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-center shadow-xs border border-emerald-800/80">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Visi Masjid</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/95 leading-relaxed font-medium italic">
                "{mosqueInfo?.visionText || 'Terwujudnya Masjid Ar-Rohmah sebagai pusat ibadah yang makmur, mandiri, berkeadaban, dan melayani umat demi kemaslahatan dunia dan akhirat.'}"
              </p>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2.5">
                <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Misi Utama DKM:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(mosqueInfo?.missionsList || [
                  'Memakmurkan Ibadah Salat 5 Waktu berjamaah tepat waktu secara istiqomah.',
                  'Menyelenggarakan Dakwah & Kajian Komprehensif berwawasan wasathiyah.',
                  'Pengelolaan ZISWAF yang Transparan, Akuntabel, dan Tepat Sasaran.',
                  'Pemberdayaan Sosial & Santunan Yatim Dhuafa di lingkungan sekitar.',
                  'Pembinaan Generasi Muda Islam melalui TPA dan Remaja Masjid.'
                ]).map((misi, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/90 hover:border-emerald-300 transition-colors shadow-2xs ${
                      idx === 4 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-emerald-800 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-medium text-slate-800 leading-snug">{misi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
