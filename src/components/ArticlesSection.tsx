import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  User,
  Clock,
  Share2,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Article } from '../types';
import { ARTICLES_DATA } from '../data/mockData';

interface ArticlesSectionProps {
  articles?: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const displayArticles = articles && articles.length > 0 ? articles : ARTICLES_DATA;

  const categories = [
    { key: 'all', label: 'Semua Konten' },
    { key: 'tausiyah', label: 'Tausiyah & Hikmah' },
    { key: 'berita', label: 'Kabar Masjid' },
    { key: 'pengumuman', label: 'Pengumuman DKM' },
    { key: 'ziswaf', label: 'Edukasi ZISWAF' },
  ];

  const filteredArticles =
    selectedCategory === 'all'
      ? displayArticles
      : displayArticles.filter((a) => a.category === selectedCategory);

  const handleShareWA = (article: Article) => {
    const text = `*${article.title}*\nOleh: ${article.author}\n\n"${article.summary}"\n\nBaca selengkapnya di website resmi Masjid Ar-Rohmah Rangkasbitung: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="berita" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kajian Dakwah & Informasi Warga</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Artikel, Tausiyah & Warta Masjid
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Materi dakwah keislaman, rilis berita kegiatan fisik, maklumat pengurus DKM, serta wawasan seputar kegiatan sosial di Komplek Bumi Narimbang Indah.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Belum ada artikel atau warta pada kategori ini</p>
            <p className="text-xs text-slate-500 mt-1">Pengurus DKM dapat mempublikasikan artikel baru melalui Panel Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => {
              const categoryLabels: Record<string, string> = {
                tausiyah: 'Tausiyah',
                berita: 'Kabar Masjid',
                pengumuman: 'Pengumuman DKM',
                ziswaf: 'ZISWAF',
              };

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider text-[10px]">
                        {categoryLabels[article.category] || article.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.date}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug hover:text-emerald-800 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.author}</span>
                    </div>

                    <button
                      onClick={() => setActiveArticle(article)}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Full Article Reader */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-5">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Tutup artikel"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider inline-block">
                  {activeArticle.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug pr-8">
                  {activeArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="font-semibold text-slate-800">Penulis: {activeArticle.author}</span>
                  <span>·</span>
                  <span>{activeArticle.date}</span>
                  <span>·</span>
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>

              {/* Rich Content */}
              <div className="border-t border-slate-100 pt-4 space-y-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeArticle.content}
              </div>

              {/* Share & Close Actions */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareWA(activeArticle)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan ke WA</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
