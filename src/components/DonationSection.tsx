import React, { useState } from 'react';
import {
  Heart,
  Copy,
  Check,
  QrCode,
  Calculator,
  Send,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Building,
  User,
  Phone
} from 'lucide-react';
import { BANK_ACCOUNTS, MOSQUE_INFO } from '../data/mockData';
import { DonationSubmission, BankAccount, MosqueInfo } from '../types';

interface DonationSectionProps {
  bankAccounts?: BankAccount[];
  mosqueInfo?: MosqueInfo;
}

export const DonationSection: React.FC<DonationSectionProps> = ({ bankAccounts, mosqueInfo }) => {
  const info = mosqueInfo || MOSQUE_INFO;
  const accounts = bankAccounts || BANK_ACCOUNTS;
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rekening' | 'qris' | 'kalkulator' | 'konfirmasi'>('rekening');

  // Zakat Calculator State
  const [zakatType, setZakatType] = useState<'profesi' | 'maal' | 'fitrah'>('profesi');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [otherIncome, setOtherIncome] = useState<string>('');
  const [totalAssetMaal, setTotalAssetMaal] = useState<string>('');
  const [fitrahSouls, setFitrahSouls] = useState<number>(1);

  // Form Confirmation State
  const [formData, setFormData] = useState<DonationSubmission>({
    donorName: '',
    phone: '',
    program: 'Infaq Operasional Masjid',
    amount: 100000,
    bankDestination: 'BSI (7182938401)',
    prayer: '',
    isAnonymous: false,
    transferDate: new Date().toISOString().slice(0, 10),
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleCopy = (bankId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankId(bankId);
    setTimeout(() => {
      setCopiedBankId(null);
    }, 2500);
  };

  // Zakat Calculations
  // Gold price assumption ~ Rp 1.400.000 / gram -> 85 gram = Rp 119.000.000 / year (~ Rp 9.916.666 / month)
  const goldPricePerGram = 1400000;
  const monthlyNisabProfesi = (85 * goldPricePerGram) / 12;
  const yearlyNisabMaal = 85 * goldPricePerGram;
  const fitrahPricePerSoul = 40000; // Standar beras 2.5 kg di Lebak Banten

  const calculatedProfesi = () => {
    const inc = (Number(monthlyIncome) || 0) + (Number(otherIncome) || 0);
    const wajib = inc >= monthlyNisabProfesi;
    const zakatDue = wajib ? inc * 0.025 : 0;
    return { inc, wajib, zakatDue };
  };

  const calculatedMaal = () => {
    const asset = Number(totalAssetMaal) || 0;
    const wajib = asset >= yearlyNisabMaal;
    const zakatDue = wajib ? asset * 0.025 : 0;
    return { asset, wajib, zakatDue };
  };

  const calculatedFitrah = () => {
    return fitrahSouls * fitrahPricePerSoul;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName && !formData.isAnonymous) return;

    const displayDonor = formData.isAnonymous ? 'Hamba Allah' : formData.donorName;

    // Compose formatted WhatsApp confirmation message
    const msg =
      `*KONFIRMASI DONASI / ZISWAF MASJID AR-ROHMAH*\n\n` +
      `👤 *Nama*: ${displayDonor}\n` +
      `📱 *No. HP/WA*: ${formData.phone}\n` +
      `🏷 *Program*: ${formData.program}\n` +
      `💰 *Jumlah*: ${formatRupiah(formData.amount)}\n` +
      `🏦 *Tujuan Transfer*: ${formData.bankDestination}\n` +
      `🗓 *Tanggal*: ${formData.transferDate}\n` +
      (formData.prayer ? `🤲 *Titipan Doa / Hajat*:\n"${formData.prayer}"\n\n` : '\n') +
      `_Mohon dicatat dan didoakan semoga Allah memberikan keberkahan berlipat ganda. Syukron Katsiran._`;

    const waUrl = `https://wa.me/62${(info.phone || '0812-1926-6161').replace(/[^0-9]/g, '').replace(/^0/, '')}?text=${encodeURIComponent(msg)}`;

    setSubmissionSuccess(true);
    window.open(waUrl, '_blank');
  };

  return (
    <section id="donasi" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-emerald-800" />
            <span>Layanan Infaq, Sedekah, Zakat & Wakaf</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pintu Kebaikan & Donasi ZISWAF
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Salurkan infaq operasional, sedekah subuh, zakat maal, wakaf pembangunan, dan santunan anak yatim secara aman melalui rekening resmi DKM Masjid Ar-Rohmah.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 p-1.5 bg-slate-200/80 rounded-xl max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('rekening')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'rekening'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekening Bank Resmi
          </button>
          <button
            onClick={() => setActiveTab('qris')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'qris'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            QRIS Resmi
          </button>
          <button
            onClick={() => setActiveTab('kalkulator')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'kalkulator'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kalkulator Zakat
          </button>
          <button
            onClick={() => setActiveTab('konfirmasi')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'konfirmasi'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Konfirmasi / Titip Doa
          </button>
        </div>

        {/* TAB 1: REKENING BANK RESMI */}
        {activeTab === 'rekening' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {accounts.map((bank) => (
                <div
                  key={bank.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {bank.badge}
                      </span>
                      <span className="font-extrabold text-sm text-slate-800 font-mono">
                        {bank.logoText}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 block mb-1">Nama Bank</span>
                    <h3 className="text-base font-bold text-slate-900 mb-3">{bank.bankName}</h3>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3">
                      <span className="text-[11px] text-slate-500 block">Nomor Rekening:</span>
                      <div className="text-lg font-mono font-black text-emerald-950 tracking-wider">
                        {bank.accountNumber}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400 block text-[11px]">Atas Nama:</span>
                      <strong className="text-slate-800">{bank.accountHolder}</strong>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleCopy(bank.id, bank.accountNumber)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        copiedBankId === bank.id
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      {copiedBankId === bank.id ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Nomor Rekening Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-amber-300" />
                          <span>Salin Nomor Rekening</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QRIS RESMI */}
        {activeTab === 'qris' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <QrCode className="w-4 h-4" />
              <span>Standar Pembayaran Nasional (Bank Indonesia & ASPI)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              QRIS DKM MASJID AR-ROHMAH NARIMBANG
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Scan dengan aplikasi Mobile Banking atau Dompet Digital apa saja: BCA, Mandiri, BRI, BNI, BSI, GoPay, OVO, Dana, ShopeePay, LinkAja.
            </p>

            {/* QRIS Display Container */}
            <div className="inline-block p-6 bg-slate-50 border-2 border-dashed border-emerald-400 rounded-3xl shadow-sm text-center">
              {/* QRIS Header */}
              <div className="flex items-center justify-between border-b pb-2 mb-3 w-64 mx-auto text-[11px] font-bold text-slate-700">
                <span className="text-rose-600 font-extrabold text-xs">QRIS</span>
                <span>NMID: {info.qrisNmid || 'ID1023098412938'}</span>
              </div>

              {/* QR Graphic / Image */}
              {info.qrisImageUrl ? (
                <div className="w-64 h-64 mx-auto bg-white p-2 rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={info.qrisImageUrl}
                    alt="QRIS Masjid Ar-Rohmah"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-white p-3 rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center justify-center relative">
                  {/* SVG QR Code Simulation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                    {/* Outer corner squares */}
                    <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="11" y="11" width="13" height="13" fill="currentColor" />
                    <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="76" y="11" width="13" height="13" fill="currentColor" />
                    <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                    <rect x="11" y="76" width="13" height="13" fill="currentColor" />
                    {/* Decorative data dots */}
                    <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="35" y="24" width="8" height="8" fill="currentColor" />
                    <rect x="48" y="24" width="8" height="8" fill="currentColor" />
                    <rect x="10" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="24" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="38" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="52" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="66" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="80" y="38" width="8" height="8" fill="currentColor" />
                    <rect x="38" y="52" width="8" height="8" fill="currentColor" />
                    <rect x="52" y="52" width="8" height="8" fill="currentColor" />
                    <rect x="66" y="52" width="8" height="8" fill="currentColor" />
                    <rect x="38" y="66" width="8" height="8" fill="currentColor" />
                    <rect x="52" y="66" width="8" height="8" fill="currentColor" />
                    <rect x="70" y="70" width="8" height="8" fill="currentColor" />
                    <rect x="84" y="70" width="8" height="8" fill="currentColor" />
                    <rect x="70" y="84" width="8" height="8" fill="currentColor" />
                    <rect x="84" y="84" width="8" height="8" fill="currentColor" />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-emerald-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                      AR-ROHMAH
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-slate-600 font-bold">
                DKM MASJID AR ROHMAH
              </div>
              <div className="text-[11px] text-slate-500">
                Komplek Bumi Narimbang Indah, Rangkasbitung
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('konfirmasi')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Sudah Transfer? Konfirmasi Di Sini
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KALKULATOR ZAKAT */}
        {activeTab === 'kalkulator' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-2 border-b pb-4">
              <button
                onClick={() => setZakatType('profesi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  zakatType === 'profesi'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Zakat Penghasilan / Profesi
              </button>
              <button
                onClick={() => setZakatType('maal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  zakatType === 'maal'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Zakat Maal (Tabungan/Emas)
              </button>
              <button
                onClick={() => setZakatType('fitrah')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  zakatType === 'fitrah'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Zakat Fitrah
              </button>
            </div>

            {/* Profesi Calculator */}
            {zakatType === 'profesi' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <strong>Ketentuan Nisab Zakat Profesi:</strong> Setara 85 gram emas per tahun (~
                  <strong>{formatRupiah(monthlyNisabProfesi)}</strong> / bulan). Kadar zakat yang wajib dikeluarkan adalah 2,5%.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Penghasilan / Gaji Pokok per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 10000000"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Pendapatan Lain / Bonus per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 2000000"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(e.target.value)}
                      className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                {/* Calculation Result */}
                {monthlyIncome && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Total Penghasilan Bulanan:</span>
                      <strong className="font-mono">{formatRupiah(calculatedProfesi().inc)}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Status Kewajiban Zakat:</span>
                      <strong className={calculatedProfesi().wajib ? 'text-emerald-700' : 'text-amber-700'}>
                        {calculatedProfesi().wajib ? 'Wajib Menunaikan Zakat (Mencapai Nisab)' : 'Belum Wajib Zakat (Disunnahkan Infaq)'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t">
                      <span>Zakat yang Wajib Dikeluarkan (2.5%):</span>
                      <span className="font-mono text-emerald-800 text-lg">
                        {formatRupiah(calculatedProfesi().zakatDue)} / bulan
                      </span>
                    </div>

                    {calculatedProfesi().wajib && (
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            program: 'Zakat Penghasilan / Profesi',
                            amount: Math.round(calculatedProfesi().zakatDue),
                          });
                          setActiveTab('konfirmasi');
                        }}
                        className="w-full mt-3 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors"
                      >
                        Tunaikan Zakat ini Sekarang
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Maal Calculator */}
            {zakatType === 'maal' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <strong>Ketentuan Zakat Maal:</strong> Harta simpanan (tabungan, emas, investasi) yang telah mencapai haul (1 tahun) dan mencapai nisab 85g emas (~
                  <strong>{formatRupiah(yearlyNisabMaal)}</strong>). Kadar zakat adalah 2,5%.
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Total Tabungan / Deposito / Nilai Emas Tersimpan (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 150000000"
                    value={totalAssetMaal}
                    onChange={(e) => setTotalAssetMaal(e.target.value)}
                    className="w-full text-sm py-2 px-3 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                {totalAssetMaal && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Status Haul & Nisab:</span>
                      <strong className={calculatedMaal().wajib ? 'text-emerald-700' : 'text-amber-700'}>
                        {calculatedMaal().wajib ? 'Wajib Zakat Maal' : 'Belum Mencapai Nisab'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t">
                      <span>Zakat Maal yang Harus Ditunaikan:</span>
                      <span className="font-mono text-emerald-800 text-lg">
                        {formatRupiah(calculatedMaal().zakatDue)}
                      </span>
                    </div>

                    {calculatedMaal().wajib && (
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            program: 'Zakat Maal',
                            amount: Math.round(calculatedMaal().zakatDue),
                          });
                          setActiveTab('konfirmasi');
                        }}
                        className="w-full mt-3 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors"
                      >
                        Tunaikan Zakat Maal via DKM Ar-Rohmah
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Fitrah Calculator */}
            {zakatType === 'fitrah' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <strong>Zakat Fitrah:</strong> Wajib bagi setiap jiwa muslim yang hidup di bulan Ramadhan. Ketetapan BAZNAS Kab. Lebak setara 2,5 kg beras premium atau senilai <strong>Rp 40.000 / jiwa</strong>.
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jumlah Jiwa / Anggota Keluarga
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFitrahSouls(Math.max(1, fitrahSouls - 1))}
                      className="w-9 h-9 rounded-lg bg-slate-200 font-bold text-base hover:bg-slate-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-mono font-bold w-12 text-center">
                      {fitrahSouls}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFitrahSouls(fitrahSouls + 1)}
                      className="w-9 h-9 rounded-lg bg-slate-200 font-bold text-base hover:bg-slate-300"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-500">Orang / Jiwa</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Setara Beras:</span>
                    <strong>{(fitrahSouls * 2.5).toFixed(1)} Kg Beras</strong>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t">
                    <span>Total Nilai Rupiah:</span>
                    <span className="font-mono text-emerald-800 text-lg">
                      {formatRupiah(calculatedFitrah())}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        program: 'Zakat Fitrah',
                        amount: calculatedFitrah(),
                      });
                      setActiveTab('konfirmasi');
                    }}
                    className="w-full mt-3 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                    Salurkan Zakat Fitrah via DKM
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FORM KONFIRMASI DONASI & TITIP DOA */}
        {activeTab === 'konfirmasi' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Formulir Konfirmasi Donasi & Titipan Doa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfirmasi donasi akan otomatis terhubung ke WhatsApp Panitia ZISWAF DKM Masjid Ar-Rohmah (0812-1926-6161).
              </p>
            </div>

            {submissionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Konfirmasi berhasil dikirim! Doa Anda telah dicantumkan di papan kebaikan.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Nama Donatur / Muhsinin</label>
                  <label className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    <span>Hamba Allah (Anonim)</span>
                  </label>
                </div>
                <input
                  type="text"
                  required={!formData.isAnonymous}
                  disabled={formData.isAnonymous}
                  placeholder={formData.isAnonymous ? 'Hamba Allah' : 'Nama Lengkap Anda'}
                  value={formData.isAnonymous ? 'Hamba Allah' : formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Program Amal
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Infaq Operasional Masjid">Infaq Operasional Masjid</option>
                    <option value="Sedekah Subuh Berkah">Sedekah Subuh Berkah</option>
                    <option value="Santunan Anak Yatim & Dhuafa">Santunan Anak Yatim & Dhuafa</option>
                    <option value="Wakaf Pembangunan & Sarana">Wakaf Pembangunan & Sarana</option>
                    <option value="Zakat Maal">Zakat Maal</option>
                    <option value="Zakat Fitrah">Zakat Fitrah</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nominal Transfer (Rp)
                  </label>
                  <input
                    type="number"
                    min="10000"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tujuan Rekening Bank
                </label>
                <select
                  value={formData.bankDestination}
                  onChange={(e) => setFormData({ ...formData, bankDestination: e.target.value })}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="BSI (7182938401)">Bank Syariah Indonesia (BSI) - 7182938401</option>
                  <option value="Bank BJB Syariah (521020088190)">Bank BJB Syariah - 521020088190</option>
                  <option value="Bank Mandiri (1630009841235)">Bank Mandiri - 1630009841235</option>
                  <option value="QRIS Standar Nasional">QRIS Standar Nasional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Titipan Doa / Permohonan Hajat
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan permohonan doa untuk keluarga, almarhum orang tua, kesehatan, atau kelapangan rezeki..."
                  value={formData.prayer}
                  onChange={(e) => setFormData({ ...formData, prayer: e.target.value })}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Kirim Konfirmasi ke WhatsApp DKM (0812-1926-6161)</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
