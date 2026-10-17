import React from 'react';
import {
  Building,
  Airplay,
  Droplets,
  Tv,
  Car,
  BookOpen,
  HeartHandshake,
  Library,
  Wifi,
} from 'lucide-react';
import { MosqueFacility } from '../types';
import { MOSQUE_FACILITIES } from '../data/mockData';

interface FacilitiesSectionProps {
  facilities?: MosqueFacility[];
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
}) => {
  return (
    <section id="fasilitas" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sarana Penunjang Ibadah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fasilitas Masjid Ar-Rohmah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Fasilitas lengkap untuk menunjang kenyamanan beribadah segenap jamaah ikhwan maupun akhwat serta penyelenggaraan layanan fardhu kifayah umat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(facilities && facilities.length > 0 ? facilities : MOSQUE_FACILITIES).map((fac) => {
            const norm = (fac.iconName || '').toLowerCase();
            let IconComp = Building;
            if (norm.includes('airplay') || norm.includes('ac')) IconComp = Airplay;
            else if (norm.includes('droplet') || norm.includes('wudhu')) IconComp = Droplets;
            else if (norm.includes('tv') || norm.includes('audio') || norm.includes('sound')) IconComp = Tv;
            else if (norm.includes('car') || norm.includes('parkir')) IconComp = Car;
            else if (norm.includes('book') || norm.includes('tpa') || norm.includes('baca')) IconComp = BookOpen;
            else if (norm.includes('heart') || norm.includes('jenazah') || norm.includes('kifayah')) IconComp = HeartHandshake;
            else if (norm.includes('lib') || norm.includes('pustaka')) IconComp = Library;
            else if (norm.includes('wifi') || norm.includes('internet')) IconComp = Wifi;

            return (
              <div
                key={fac.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {fac.capacity && (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {fac.capacity}
                        </span>
                      )}
                      {fac.status && fac.status !== 'Tersedia' && (
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            fac.status === 'Dalam Pemeliharaan'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {fac.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{fac.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
