import React, { useState, useRef } from 'react';
import {
  Music,
  X,
  Play,
  Pause,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MusicGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MUSIC_PRESETS = [
  {
    title: 'Gambus & Oud Padang Pasir',
    prompt: 'Gentle contemplative Middle Eastern oud and nay flute, meditative Islamic ambient instrumental with soft desert breeze, traditional modal scale, peaceful and spiritual atmosphere.',
  },
  {
    title: 'Rebana & Perkusi Shalawat',
    prompt: 'Rhythmic acoustic frame drums, gentle duff and riq percussion with uplifting joyful Islamic celebratory tone, acoustic instruments, warm reverbs.',
  },
  {
    title: 'Kecapi Suling Damai Banten',
    prompt: 'Soothing Sundanese bamboo suling flute and gentle acoustic kecapi zither, peaceful village morning near the mosque, meditative natural ambient soundscape.',
  },
  {
    title: 'Renungan Khidmat Qolbu',
    prompt: 'Solemn and serene acoustic instrumental, warm cello and gentle acoustic strings, deeply emotional and calming Islamic reflection background music.',
  },
];

export const MusicGeneratorModal: React.FC<MusicGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState(MUSIC_PRESETS[0].prompt);
  const [trackType, setTrackType] = useState<'clip' | 'pro'>('clip');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: trackType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghasilkan musik dari Lyria AI.');
      }

      // Decode base64 audio into a playable Blob URL
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
      setLyrics(data.lyrics || null);
      setModelUsed(data.modelUsed || (trackType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview'));
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (err: any) {
      console.error('Lyria generation error:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses musik.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white flex items-center justify-between shrink-0 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Studio Musik & Instrumen Islami (Lyria AI)
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Lyria-3
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                Hasilkan lantunan musik latar, gambus, suling, dan instrumen syahdu untuk video masjid & relaksasi jamaah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Track Duration / Model Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Model & Durasi Musik</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrackType('clip')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  trackType === 'clip'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">Klip Pendek (Hingga 30 Detik)</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    lyria-3-clip-preview
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Optimal untuk latar reels, cuplikan kegiatan masjid, atau ringtone pengingat jadwal salat.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTrackType('pro')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  trackType === 'pro'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">Lagu Penuh (Full-length Track)</span>
                  <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    lyria-3-pro-preview
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Komposisi instrumen penuh untuk latar kajian majelis taklim dan video profil masjid.
                </p>
              </button>
            </div>
          </div>

          {/* Preset Prompts */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Inspirasi Tema Musik Islami:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MUSIC_PRESETS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(item.prompt)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 text-left transition-all"
                >
                  <p className="font-bold text-[11px] text-slate-800 line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">Pilih tema ini</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Deskripsi Prompt Musik (Instrumen, Nuansa & Tempo)
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: Gentle Islamic acoustic oud and flute with soft ambient reverb, peaceful meditative atmosphere..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none leading-relaxed"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all text-xs"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Menghasilkan Musik dengan {trackType === 'pro' ? 'Lyria Pro' : 'Lyria Clip'}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hasilkan Musik Islami Sekarang</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Membuat Musik</p>
                <p className="text-[11px] mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Audio Player Card */}
          {audioUrl && (
            <div className="p-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl text-white space-y-3 shadow-lg border border-emerald-800/60 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center">
                    <Music className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">Audio Hasil Generasi Lyria</h4>
                    <p className="text-[10px] text-emerald-300/80 font-mono">
                      Model: {modelUsed} • Durasi: {formatTime(duration)}
                    </p>
                  </div>
                </div>

                <a
                  href={audioUrl}
                  download={`musik_masjid_arrohmah_${Date.now()}.wav`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-200 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh WAV</span>
                </a>
              </div>

              {/* Hidden native audio element */}
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Progress Seek Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-emerald-300/70 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <span className="text-[11px] text-emerald-300/80 font-medium">
                  {isPlaying ? 'Sedang Memutar...' : 'Siap Diputar'}
                </span>
              </div>

              {lyrics && (
                <div className="pt-2 border-t border-emerald-900/60">
                  <p className="text-[10px] text-amber-300 font-bold mb-0.5">Lirik / Catatan Komposisi:</p>
                  <p className="text-[11px] text-slate-300 italic leading-relaxed whitespace-pre-wrap">{lyrics}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Mendukung Lyria-3 Clip & Lyria-3 Pro untuk audio resmi DKM</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
