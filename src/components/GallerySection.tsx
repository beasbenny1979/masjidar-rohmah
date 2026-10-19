import React, { useState, useRef } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { MosqueImage } from '../types';
import { resolveImageUrl, handleImageError } from '../utils/imageUtils';

interface GallerySectionProps {
  images: MosqueImage[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  images,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedLightbox, setSelectedLightbox] = useState<MosqueImage | null>(null);
  const categories = ['Semua', 'Eksterior', 'Ruang Sholat', 'Fasilitas', 'Kegiatan'];

  const filteredImages =
    activeCategory === 'Semua'
      ? images
      : images.filter((img) => img.category === activeCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="galeri" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Dokumentasi & Galeri Foto</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri Foto Masjid Ar-Rohmah
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Suasana kemakmuran, keindahan arsitektur, dan fasilitas ibadah di Komplek Bumi Narimbang Indah. Geser ke kanan atau kiri untuk melihat dokumentasi lainnya.
            </p>
          </div>

          {/* Scroll Navigation Arrows */}
          <div className="flex items-center gap-1.5 self-start md:self-end">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Geser ke kiri"
              title="Geser ke kiri"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Geser ke kanan"
              title="Geser ke kanan"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap hidden sm:inline">
            Menampilkan {filteredImages.length} Foto
          </span>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'thin' }}
        >
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedLightbox(image)}
              className="group relative shrink-0 w-[290px] sm:w-[360px] md:w-[400px] bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer snap-start border border-slate-200"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src={resolveImageUrl(image.imageUrl)}
                  alt={image.title}
                  onError={(e) => handleImageError(e, 'mosque')}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold tracking-wide uppercase border border-slate-700">
                    {image.category}
                  </span>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption at bottom */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-snug drop-shadow-xs">
                    {image.title}
                  </h3>
                  {image.caption && (
                    <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 opacity-90">
                      {image.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll helper indicator */}
        <div className="flex items-center justify-center text-xs text-slate-500 mt-2 px-1">
          <span>Geser horizontal (scroll kanan / kiri) untuk melihat dokumentasi foto lainnya</span>
        </div>

        {/* Lightbox Modal */}
        {selectedLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
            <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <button
                onClick={() => setSelectedLightbox(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] flex items-center justify-center bg-black overflow-hidden">
                <img
                  src={resolveImageUrl(selectedLightbox.imageUrl)}
                  alt={selectedLightbox.title}
                  onError={(e) => handleImageError(e, 'mosque')}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {selectedLightbox.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                    {selectedLightbox.title}
                  </h3>
                  {selectedLightbox.caption && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                      {selectedLightbox.caption}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-400 shrink-0">
                  Diupload: {selectedLightbox.uploadedAt}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
