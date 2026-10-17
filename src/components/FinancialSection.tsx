import React, { useState } from 'react';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  ShieldCheck,
  ChevronDown,
  BarChart3,
  Clock,
  X,
  FileSpreadsheet,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FinancialSummary, FinancialTransaction, CashCategory, CommitteeMember, MosqueInfo } from '../types';
import { MOSQUE_INFO } from '../data/mockData';

interface FinancialSectionProps {
  summary: FinancialSummary;
  transactions: FinancialTransaction[];
  members?: CommitteeMember[];
  mosqueInfo?: MosqueInfo;
}

export const FinancialSection: React.FC<FinancialSectionProps> = ({
  summary,
  transactions,
  members,
  mosqueInfo,
}) => {
  const info = mosqueInfo || MOSQUE_INFO;
  const ketuaMember = members?.find(
    (m) =>
      m.role.toLowerCase().includes('ketua dkm') ||
      (m.role.toLowerCase().includes('ketua') && !m.role.toLowerCase().includes('pelindung')) ||
      m.name.toLowerCase().includes('adih')
  );
  const ketuaName = ketuaMember ? ketuaMember.name : 'Bapak Adih';

  const bendaharaMember = members?.find(
    (m) => m.role.toLowerCase().includes('bendahara') || m.name.toLowerCase().includes('heri')
  );
  const bendaharaName = bendaharaMember ? bendaharaMember.name : 'Bapak Heri Kristiyanto';

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [printTxLimit, setPrintTxLimit] = useState<'15' | 'all'>('15');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recordedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceNumber && tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch;
  });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatShortRupiah = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)} Jt`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)} Rb`;
    return `${val}`;
  };

  // Dynamic calculation for Current Month Inflow/Outflow based on transactions (Starts from 0)
  const currentMonthInflow = transactions.length > 0
    ? transactions.filter((tx) => tx.type === 'masuk').reduce((sum, tx) => sum + tx.amount, 0)
    : (summary.totalIncomeThisMonth || 0);

  const currentMonthOutflow = transactions.length > 0
    ? transactions.filter((tx) => tx.type === 'keluar').reduce((sum, tx) => sum + tx.amount, 0)
    : (summary.totalExpenseThisMonth || 0);

  // Monthly Trend Data for Recharts Bar Chart starting from 0, populated dynamically as mutasi occurs
  const monthNames = [
    { key: '05', short: 'Mei', full: 'Mei 2026' },
    { key: '06', short: 'Jun', full: 'Juni 2026' },
    { key: '07', short: 'Jul', full: 'Juli 2026' },
    { key: '08', short: 'Agu', full: 'Agustus 2026' },
    { key: '09', short: 'Sep', full: 'September 2026' },
    { key: '10', short: 'Okt', full: 'Oktober 2026 (Berjalan)' },
  ];

  const monthlyChartData = monthNames.map((m) => {
    const inSum = transactions
      .filter((tx) => tx.type === 'masuk' && (tx.date.includes(`-` + m.key + `-`) || (m.key === '10' && !tx.date.includes('-'))))
      .reduce((s, tx) => s + tx.amount, 0);
    const outSum = transactions
      .filter((tx) => tx.type === 'keluar' && (tx.date.includes(`-` + m.key + `-`) || (m.key === '10' && !tx.date.includes('-'))))
      .reduce((s, tx) => s + tx.amount, 0);

    return {
      month: m.short,
      fullName: m.full,
      pemasukan: inSum,
      pengeluaran: outSum,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pMasuk = payload.find((p: any) => p.dataKey === 'pemasukan')?.value || 0;
      const pKeluar = payload.find((p: any) => p.dataKey === 'pengeluaran')?.value || 0;
      const surplus = pMasuk - pKeluar;
      const fullLabel = payload[0]?.payload?.fullName || label;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 border border-slate-700 min-w-[210px] animate-in fade-in">
          <p className="font-bold text-amber-300 border-b border-slate-700 pb-1.5 flex items-center justify-between">
            <span>{fullLabel}</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Rekap Kas</span>
          </p>
          <div className="flex items-center justify-between text-emerald-300">
            <span>Pemasukan:</span>
            <span className="font-mono font-bold">+{formatRupiah(pMasuk)}</span>
          </div>
          <div className="flex items-center justify-between text-rose-300">
            <span>Pengeluaran:</span>
            <span className="font-mono font-bold">-{formatRupiah(pKeluar)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-200 pt-1.5 border-t border-slate-700 font-semibold">
            <span>Surplus / Saldo:</span>
            <span className={`font-mono font-bold ${surplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatRupiah(surplus)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal', 'Pencatat', 'Ref'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.date,
      tx.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran',
      tx.categoryLabel,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.amount,
      `"${tx.recordedBy}"`,
      tx.referenceNumber || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_Masjid_Ar-Rohmah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintOfficial = () => {
    setShowPrintModal(true);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleDownloadStandaloneReport = () => {
    const reportElem = document.getElementById('printable-report');
    if (!reportElem) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan_Resmi_DKM_Masjid_Ar-Rohmah_${new Date().toISOString().slice(0, 10)}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 12mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; background: #fff; margin: 0; padding: 25px; line-height: 1.4; font-size: 10pt; }
    .report-wrap { max-width: 820px; margin: 0 auto; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .uppercase { text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 12px; font-size: 8.5pt; }
    th, td { border: 1px solid #475569; padding: 4.5px 6px; }
    th { background-color: #f1f5f9; font-weight: bold; }
    .stamp-circle {
      width: 76px; height: 76px; border: 2px dashed #047857; border-radius: 50%;
      display: inline-flex; flex-direction: column; align-items: center; justify-content: center;
      color: #047857; font-size: 7.5pt; font-weight: bold; text-align: center; text-transform: uppercase;
      padding: 4px; line-height: 1.1; margin: 0 auto;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-wrap">
    ${reportElem.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Resmi_DKM_Masjid_Ar-Rohmah_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="keuangan" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Akuntabilitas & Transparansi Umat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Laporan Keuangan & Kas Masjid
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Setiap rupiah amanah jamaah dan muhsinin dicatat dan dilaporkan secara jujur, akuntabel, dan dapat dipantau oleh seluruh jamaah Masjid Ar-Rohmah.
          </p>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Balance */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
                  Total Saldo Kas Terkumpul
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black mt-2 font-sans tracking-tight text-white">
                {formatRupiah(summary.totalBalance)}
              </div>
            </div>
            <div className="pt-3 border-t border-emerald-800/80 mt-4 flex flex-col gap-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span>Status: Rekonsiliasi Tanggal & Jam</span>
              </div>
              <div className="text-amber-200 font-mono text-[11px] font-medium">
                {summary.lastReconciledAt || summary.lastUpdated}
              </div>
            </div>
          </div>

          {/* Kas Operasional */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Kas Operasional Rutin
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {formatRupiah(summary.operasionalBalance)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Listrik, air, kebersihan, sound system, & honor marbot.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-emerald-700 font-semibold">
              Terverifikasi oleh Bendahara
            </div>
          </div>

          {/* Kas Pembangunan & Perawatan */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Kas Pembangunan Fisik
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {formatRupiah(summary.pembangunanBalance)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Renovasi gedung, pengecatan, pengadaan karpet shaf.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-amber-700 font-semibold">
              Dana Khusus Proyek Wakaf
            </div>
          </div>

          {/* Kas ZISWAF & Yatim */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Kas ZISWAF & Yatim
                </span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {formatRupiah(summary.ziswafBalance + summary.yatimBalance)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Zakat Maal, Zakat Fitrah, & Santunan Rutin Anak Yatim.
              </p>
            </div>
            <div className="pt-2 text-[11px] text-teal-700 font-semibold">
              Penyaluran Mustahik Jatimulya
            </div>
          </div>
        </div>

        {/* Monthly Inflow / Outflow Summary Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Pemasukan Bulan Ini</span>
                  <span className="text-base font-extrabold text-emerald-800">
                    +{formatRupiah(summary.totalIncomeThisMonth)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Pengeluaran Bulan Ini</span>
                  <span className="text-base font-extrabold text-rose-700">
                    -{formatRupiah(summary.totalExpenseThisMonth)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Download / Print / Add */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrintOfficial}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                title="Buka pratinjau format laporan resmi DKM untuk cetak atau simpan PDF"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Pratinjau Resmi (Cetak / PDF)</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                title="Unduh data tabel dalam file CSV Excel"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unduh Excel / CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visualisasi Grafik Batang Tren Bulanan (Pemasukan vs Pengeluaran menggunakan Recharts) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Grafik Tren Arus Kas Bulanan
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Visualisasi komparasi pergerakan pemasukan dan pengeluaran kas Masjid Ar-Rohmah (Mei s/d Oktober 2026)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
                <span className="text-slate-600 font-medium">Pemasukan (Infaq/Ziswaf)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-600 inline-block" />
                <span className="text-slate-600 font-medium">Pengeluaran (Operasional/Pembangunan)</span>
              </div>
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                barGap={6}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={formatShortRupiah}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
                  formatter={(value) => (value === 'pemasukan' ? 'Pemasukan Kas' : 'Pengeluaran Kas')}
                />
                <Bar
                  dataKey="pemasukan"
                  name="pemasukan"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="pengeluaran"
                  name="pengeluaran"
                  fill="#e11d48"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Table with Filters & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari transaksi, ref, atau pencatat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Filter Type */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('masuk')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    filterType === 'masuk' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setFilterType('keluar')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    filterType === 'keluar' ? 'bg-rose-700 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pengeluaran
                </button>
              </div>

              {/* Filter Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua Pos Kas</option>
                <option value="operasional">Kas Operasional</option>
                <option value="pembangunan">Kas Pembangunan</option>
                <option value="ziswaf">Kas ZISWAF</option>
                <option value="yatim">Kas Santunan Yatim</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tanggal & Ref</th>
                  <th className="py-3 px-3">Pos Kas</th>
                  <th className="py-3 px-4">Uraian / Keterangan</th>
                  <th className="py-3 px-3">Penanggung Jawab</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{tx.date}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{tx.referenceNumber}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            tx.category === 'operasional'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : tx.category === 'pembangunan'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : tx.category === 'ziswaf'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {tx.categoryLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{tx.description}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        {tx.recordedBy}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-mono font-bold text-sm ${
                            tx.type === 'masuk' ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {tx.type === 'masuk' ? '+' : '-'} {formatRupiah(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Tidak ada catatan transaksi yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Menampilkan {filteredTransactions.length} dari {transactions.length} mutasi</span>
            <span className="italic">Data disinkronkan langsung dari buku kas DKM</span>
          </div>
        </div>

        {/* Modal: Pratinjau Format Laporan Resmi DKM untuk Cetak / Simpan PDF */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="bg-slate-100 rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-300 flex flex-col overflow-hidden max-h-[95vh]">
              {/* Modal Toolbar - Hidden during Print */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 shrink-0 no-print">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 font-bold shrink-0">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                        Pratinjau Format Laporan Resmi DKM
                      </h3>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-800/90 text-amber-300 text-[10px] font-mono font-bold">
                        STANDAR A4
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Dokumen resmi ber-Kop Surat DKM Masjid Ar-Rohmah, siap dicetak atau disimpan ke format PDF.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Selector: 15 vs Semua */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setPrintTxLimit('15')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        printTxLimit === '15'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      15 Mutasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintTxLimit('all')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        printTxLimit === 'all'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Semua ({transactions.length})
                    </button>
                  </div>

                  <button
                    onClick={handleDownloadStandaloneReport}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    title="Unduh file dokumen laporan mandiri (.html) siap dibuka dan dicetak kapan saja"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Unduh</span> Dokumen (.html)
                  </button>

                  <button
                    onClick={handleTriggerPrint}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    title="Buka dialog cetak atau simpan sebagai PDF"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak / Simpan PDF</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    aria-label="Tutup Pratinjau"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Document Preview Container */}
              <div className="overflow-y-auto p-3 sm:p-8 flex justify-center bg-slate-200/70">
                {/* Official Printable Report Document (A4 Canvas) */}
                <div
                  id="printable-report"
                  className="bg-white w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 text-slate-900 font-serif leading-relaxed text-[11px]"
                >
                  {/* Basmalah */}
                  <p className="text-center font-arabic text-lg sm:text-xl text-emerald-950 mb-3 tracking-wide">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>

                  {/* KOP SURAT RESMI DKM */}
                  <div className="border-b-2 border-slate-950 pb-2 flex items-center justify-between gap-4">
                    {/* Emblem DKM */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-900 border-2 border-amber-400 flex flex-col items-center justify-center text-white shrink-0 shadow-sm">
                      <Building className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
                      <span className="text-[7.5px] font-sans font-black tracking-widest text-amber-200 uppercase mt-0.5">
                        AR-ROHMAH
                      </span>
                    </div>

                    {/* Teks Kop Surat */}
                    <div className="text-center flex-1">
                      <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-950 font-sans">
                        DEWAN KEMAKMURAN MASJID (DKM) AR-ROHMAH
                      </h2>
                      <p className="text-[10px] font-sans font-semibold text-emerald-900 tracking-wide">
                        SK KEMENAG / BADAN HUKUM: {info.dkmSkNumber || 'SK.DKM/014/KEMAG-LBK/X/2024'}
                      </p>
                      <p className="text-[9.5px] font-sans text-slate-700 mt-0.5 leading-snug">
                        {info.address || 'Komplek Bumi Narimbang Indah, Blok B & C, RT 03 / RW 09, Desa Jatimulya, Kec. Rangkasbitung, Kab. Lebak, Banten 42315'}
                      </p>
                      <p className="text-[9px] font-sans text-slate-600 mt-0.5 font-medium">
                        Sekretariat: {info.phone || '0812-1926-6161'} | Email: {info.email || 'mjdarrohmah@gmail.com'} | Website: ar-rohmah-bni.id
                      </p>
                    </div>

                    {/* Logo Banten / Lambang Keislaman */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 hidden sm:flex flex-col items-center justify-center text-emerald-900 shrink-0">
                      <ShieldCheck className="w-8 h-8 text-emerald-800" />
                      <span className="text-[7px] font-sans font-bold text-slate-500 uppercase">AKUNTABEL</span>
                    </div>
                  </div>
                  {/* Thin line under thick line */}
                  <div className="border-b border-slate-950 pt-0.5 mb-5" />

                  {/* Document Title & Meta */}
                  <div className="text-center mb-5 font-sans">
                    <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-950 underline decoration-1 underline-offset-4">
                      SURAT LAPORAN PERTANGGUNGJAWABAN KAS & KEUANGAN MASJID
                    </h3>
                    <p className="text-[10.5px] font-mono text-slate-600 mt-1">
                      Nomor Dokumen: DKM-AR/LPJ-KEU/2026/X/084
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Status Rekonsiliasi Terkini: <strong>{summary.lastReconciledAt || summary.lastUpdated}</strong>
                    </p>
                  </div>

                  {/* Bagian I: Rekapitulasi 4 Pos Kas */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between border-b border-slate-400 pb-1 mb-2 font-sans">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                        I. REKAPITULASI POS SALDO KAS MASJID
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">Per {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>

                    <table className="w-full text-[10.5px] border border-slate-400 text-left font-sans">
                      <thead className="bg-slate-100 border-b border-slate-400">
                        <tr>
                          <th className="p-2 w-10 text-center border-r border-slate-400">No</th>
                          <th className="p-2 border-r border-slate-400">Nama Pos Kas</th>
                          <th className="p-2 border-r border-slate-400">Peruntukan & Alokasi Anggaran</th>
                          <th className="p-2 text-right">Saldo Terkumpul (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        <tr>
                          <td className="p-2 text-center border-r border-slate-300 font-mono">1</td>
                          <td className="p-2 font-bold border-r border-slate-300">Kas Operasional Rutin</td>
                          <td className="p-2 text-slate-600 border-r border-slate-300 text-[10px]">
                            Listrik PLN, PDAM, Insentif Marbot/Imam, Kebersihan & Perlengkapan Harian
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {formatRupiah(summary.operasionalBalance)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-center border-r border-slate-300 font-mono">2</td>
                          <td className="p-2 font-bold border-r border-slate-300">Kas Pembangunan & Fisik</td>
                          <td className="p-2 text-slate-600 border-r border-slate-300 text-[10px]">
                            Renovasi Fasilitas, Pengadaan Karpet Shaf, Pengecatan & Sound System
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {formatRupiah(summary.pembangunanBalance)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-center border-r border-slate-300 font-mono">3</td>
                          <td className="p-2 font-bold border-r border-slate-300">Kas ZISWAF (Zakat & Infaq)</td>
                          <td className="p-2 text-slate-600 border-r border-slate-300 text-[10px]">
                            Zakat Maal, Zakat Fitrah, Fidyah, dan Penyaluran Mustahik Warga
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {formatRupiah(summary.ziswafBalance)}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-center border-r border-slate-300 font-mono">4</td>
                          <td className="p-2 font-bold border-r border-slate-300">Kas Santunan Anak Yatim</td>
                          <td className="p-2 text-slate-600 border-r border-slate-300 text-[10px]">
                            Santunan Bulanan, Beasiswa Pendidikan Anak Yatim & Dhuafa BNI Jatimulya
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {formatRupiah(summary.yatimBalance)}
                          </td>
                        </tr>
                        <tr className="bg-emerald-50/70 border-t-2 border-slate-900 font-bold">
                          <td colSpan={3} className="p-2.5 text-right uppercase tracking-wider text-emerald-950 font-black border-r border-slate-400">
                            TOTAL SALDO KAS TERKUMPUL (BERSIH)
                          </td>
                          <td className="p-2.5 text-right font-mono text-sm text-emerald-950 font-black">
                            {formatRupiah(summary.totalBalance)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Bagian II: Ringkasan Arus Kas Bulan Berjalan */}
                  <div className="mb-5 bg-slate-50 border border-slate-300 rounded-xl p-3 font-sans">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                      II. REKAPITULASI ARUS KAS BULAN BERJALAN
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Total Penerimaan Kas</span>
                        <span className="font-mono font-bold text-emerald-700 text-sm">
                          +{formatRupiah(currentMonthInflow)}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Total Pengeluaran Kas</span>
                        <span className="font-mono font-bold text-rose-700 text-sm">
                          -{formatRupiah(currentMonthOutflow)}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Surplus / Arus Berjalan</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {formatRupiah(currentMonthInflow - currentMonthOutflow)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian III: Buku Catatan Arus Mutasi Kas */}
                  <div className="mb-6 font-sans">
                    <div className="flex items-center justify-between border-b border-slate-400 pb-1 mb-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-950">
                        III. DAFTAR BUKU ARUS MUTASI KAS ({printTxLimit === 'all' ? `Semua ${transactions.length} Data` : '15 Transaksi Terakhir'})
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Buku Kas Resmi DKM
                      </span>
                    </div>

                    <table className="w-full text-[10px] border border-slate-400 text-left">
                      <thead className="bg-slate-100 border-b border-slate-400 font-bold text-slate-700">
                        <tr>
                          <th className="p-1.5 w-8 text-center border-r border-slate-400">No</th>
                          <th className="p-1.5 border-r border-slate-400">Tanggal</th>
                          <th className="p-1.5 border-r border-slate-400">No. Ref</th>
                          <th className="p-1.5 border-r border-slate-400">Pos Kas</th>
                          <th className="p-1.5 border-r border-slate-400">Uraian / Keterangan</th>
                          <th className="p-1.5 text-right border-r border-slate-400">Pemasukan</th>
                          <th className="p-1.5 text-right">Pengeluaran</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {(printTxLimit === 'all' ? transactions : transactions.slice(0, 15)).map((tx, idx) => (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="p-1.5 text-center font-mono border-r border-slate-300">{idx + 1}</td>
                            <td className="p-1.5 whitespace-nowrap font-mono border-r border-slate-300 text-[9.5px]">
                              {tx.date}
                            </td>
                            <td className="p-1.5 font-mono border-r border-slate-300 text-[9px] text-slate-500">
                              {tx.referenceNumber || '-'}
                            </td>
                            <td className="p-1.5 border-r border-slate-300 text-[9.5px]">
                              {tx.categoryLabel || tx.category}
                            </td>
                            <td className="p-1.5 border-r border-slate-300 max-w-[200px] truncate" title={tx.description}>
                              {tx.description}
                            </td>
                            <td className="p-1.5 text-right font-mono font-bold text-emerald-800 border-r border-slate-300">
                              {tx.type === 'masuk' ? formatRupiah(tx.amount) : '-'}
                            </td>
                            <td className="p-1.5 text-right font-mono font-bold text-rose-800">
                              {tx.type === 'keluar' ? formatRupiah(tx.amount) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bagian IV: Pengesahan & Tanda Tangan Resmi DKM */}
                  <div className="pt-4 font-sans text-xs">
                    <p className="text-right text-[11px] text-slate-700 mb-2">
                      Ditetapkan di: Rangkasbitung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <div className="grid grid-cols-2 text-center mt-3 pt-2">
                      {/* Ketua DKM */}
                      <div className="space-y-1">
                        <p className="text-slate-600 text-[10.5px]">Mengetahui & Menyetujui,</p>
                        <p className="font-extrabold uppercase text-slate-900 text-xs tracking-wider">
                          Ketua DKM Masjid Ar-Rohmah
                        </p>

                        {/* Stempel & Tanda Tangan */}
                        <div className="h-20 flex items-center justify-center relative my-1">
                          {/* Stempel Lingkaran Digital DKM */}
                          <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-700 text-emerald-800 flex flex-col items-center justify-center text-[7px] font-black uppercase tracking-tighter leading-none shadow-xs rotate-[-8deg] bg-emerald-50/30">
                            <span>* DKM *</span>
                            <span className="text-[8px] font-bold">AR-ROHMAH</span>
                            <span>LEBAK</span>
                            <span className="text-[6px] text-emerald-600 mt-0.5">TERTANDA</span>
                          </div>
                        </div>

                        <p className="font-black underline text-slate-950 text-xs">{ketuaName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Amanah Umat DKM</p>
                      </div>

                      {/* Bendahara DKM */}
                      <div className="space-y-1">
                        <p className="text-slate-600 text-[10.5px]">Dibuat & Dilaporkan Oleh,</p>
                        <p className="font-extrabold uppercase text-slate-900 text-xs tracking-wider">
                          Bendahara DKM Masjid Ar-Rohmah
                        </p>

                        {/* Stempel & Tanda Tangan */}
                        <div className="h-20 flex items-center justify-center relative my-1">
                          {/* Stempel Lingkaran Digital Bendahara */}
                          <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal-700 text-teal-800 flex flex-col items-center justify-center text-[7px] font-black uppercase tracking-tighter leading-none shadow-xs rotate-[6deg] bg-teal-50/30">
                            <span>* BENDAHARA *</span>
                            <span className="text-[8px] font-bold">KAS DKM</span>
                            <span>RANGKASBITUNG</span>
                            <span className="text-[6px] text-teal-600 mt-0.5">VALID</span>
                          </div>
                        </div>

                        <p className="font-black underline text-slate-950 text-xs">{bendaharaName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Pengelola Keuangan Kas</p>
                      </div>
                    </div>
                  </div>

                  {/* Footnote Dokumen */}
                  <div className="mt-8 pt-3 border-t border-slate-300 text-[9px] text-slate-500 text-center font-sans italic">
                    Laporan resmi ini diterbitkan secara sah dan akuntabel oleh Pengurus DKM Masjid Ar-Rohmah sebagai wujud transparansi kepada seluruh jamaah dan muhsinin. Dokumen dapat dicetak atau disimpan sebagai arsip PDF resmi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
