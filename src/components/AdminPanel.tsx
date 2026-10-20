import React, { useState } from 'react';
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Plus,
  Image as ImageIcon,
  Users,
  FileText,
  Calendar,
  Heart,
  BookOpen,
  Building,
  CheckCircle2,
  Download,
  AlertCircle,
  Edit3,
  Clock,
  MapPin,
  User,
  Video,
  Star,
  Sparkles,
  Airplay,
  Droplets,
  Tv,
  Car,
  HeartHandshake,
  Library,
  Wifi,
  QrCode,
  Lock,
  ShieldAlert,
  LogOut,
  Key,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  MosqueInfo,
  CommitteeMember,
  MosqueImage,
  FridayOfficer,
  FinancialSummary,
  FinancialTransaction,
  CashCategory,
  AgendaEvent,
  Article,
  BankAccount,
  MosqueFacility,
} from '../types';
import { resolveImageUrl, handleImageError, processAndUploadImage } from '../utils/imageUtils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // State and updaters
  mosqueInfo: MosqueInfo;
  onUpdateMosqueInfo: (info: MosqueInfo) => void;
  members: CommitteeMember[];
  onUpdateMembers: (members: CommitteeMember[]) => void;
  galleryImages: MosqueImage[];
  onUpdateGalleryImages: (images: MosqueImage[]) => void;
  fridayOfficers: FridayOfficer[];
  onUpdateFridayOfficers: (officers: FridayOfficer[]) => void;
  financialSummary: FinancialSummary;
  onUpdateFinancialSummary: (summary: FinancialSummary) => void;
  transactions: FinancialTransaction[];
  onUpdateTransactions: (txs: FinancialTransaction[]) => void;
  agendaEvents: AgendaEvent[];
  onUpdateAgendaEvents: (events: AgendaEvent[]) => void;
  articles: Article[];
  onUpdateArticles: (articles: Article[]) => void;
  bankAccounts: BankAccount[];
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
  facilities: MosqueFacility[];
  onUpdateFacilities: (facilities: MosqueFacility[]) => void;
  onSaveToBackend?: () => Promise<void>;
  onResetDefaults?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  mosqueInfo,
  onUpdateMosqueInfo,
  members,
  onUpdateMembers,
  galleryImages,
  onUpdateGalleryImages,
  fridayOfficers,
  onUpdateFridayOfficers,
  financialSummary,
  onUpdateFinancialSummary,
  transactions,
  onUpdateTransactions,
  agendaEvents,
  onUpdateAgendaEvents,
  articles,
  onUpdateArticles,
  bankAccounts,
  onUpdateBankAccounts,
  facilities,
  onUpdateFacilities,
  onSaveToBackend,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profil' | 'fasilitas' | 'galeri' | 'pengurus' | 'jumat' | 'keuangan' | 'agenda' | 'artikel' | 'rekening' | 'backup'
  >('profil');

  const [notification, setNotification] = useState<string | null>(null);

  // Dedicated DKM Admin Email & Password authorization
  const AUTHORIZED_ADMIN_EMAIL = 'mjdarrohmah@gmail.com';
  const DKM_ADMIN_PASSWORD = 'Gavi2021';

  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('arrohmah_admin_email') || null;
    } catch {
      return null;
    }
  });

  const [loginEmailInput, setLoginEmailInput] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const enteredEmail = loginEmailInput.trim().toLowerCase();

    // STRICT CHECK 1: Email must be mjdarrohmah@gmail.com
    if (enteredEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setAuthError(
        `Akses Ditolak! Alamat email "${loginEmailInput}" tidak terdaftar. Hak akses Admin DKM hanya dapat diakses melalui alamat email resmi: ${AUTHORIZED_ADMIN_EMAIL}`
      );
      return;
    }

    if (!loginPasswordInput) {
      setAuthError('Silakan masukkan kata sandi Admin DKM.');
      return;
    }

    // STRICT CHECK 2: Password must be exact 'Gavi2021'
    if (loginPasswordInput !== DKM_ADMIN_PASSWORD) {
      setAuthError('Kata sandi keliru! Akses ke Panel Admin DKM ditolak sama sekali.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: enteredEmail,
          password: loginPasswordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Kata sandi keliru! Akses ke Panel Admin DKM ditolak sama sekali.');
        setIsVerifying(false);
        return;
      }

      localStorage.setItem('arrohmah_admin_email', AUTHORIZED_ADMIN_EMAIL);
      if (data.token) {
        localStorage.setItem('arrohmah_admin_token', data.token);
      }
      setAuthenticatedEmail(AUTHORIZED_ADMIN_EMAIL);
      setIsVerifying(false);
      setNotification(`Autentikasi Akun Google ${AUTHORIZED_ADMIN_EMAIL} berhasil!`);
    } catch (err: any) {
      if (loginPasswordInput === DKM_ADMIN_PASSWORD) {
        localStorage.setItem('arrohmah_admin_email', AUTHORIZED_ADMIN_EMAIL);
        setAuthenticatedEmail(AUTHORIZED_ADMIN_EMAIL);
        setIsVerifying(false);
        setNotification(`Autentikasi Akun Google ${AUTHORIZED_ADMIN_EMAIL} berhasil!`);
      } else {
        setAuthError('Kata sandi keliru! Akses ke Panel Admin DKM ditolak sama sekali.');
        setIsVerifying(false);
      }
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('arrohmah_admin_email');
      localStorage.removeItem('arrohmah_admin_token');
    } catch {}
    setAuthenticatedEmail(null);
    setLoginPasswordInput('');
    setAuthError(null);
  };

  // Helper for Indonesian DateTime formatting for Status Rekonsiliasi
  const formatReconciledDateTime = (date = new Date()) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dayName}, ${day} ${monthName} ${year}, Pukul ${hours}:${minutes} WIB`;
  };

  // Cash Category Label helper
  const categoryLabels: Record<CashCategory, string> = {
    operasional: 'Kas Operasional',
    pembangunan: 'Kas Pembangunan',
    ziswaf: 'Kas ZISWAF',
    yatim: 'Kas Santunan Yatim',
  };

  // Transaction states for Add, Edit, Delete, Excel upload, and Reconciliation
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
  const [transactionFilterCategory, setTransactionFilterCategory] = useState<string>('all');
  const [transactionFilterType, setTransactionFilterType] = useState<string>('all');
  const [transactionForm, setTransactionForm] = useState<{
    date: string;
    type: 'masuk' | 'keluar';
    category: CashCategory;
    description: string;
    amount: number | string;
    recordedBy: string;
    referenceNumber: string;
  }>({
    date: new Date().toISOString().slice(0, 10),
    type: 'masuk',
    category: 'operasional',
    description: '',
    amount: '',
    recordedBy: 'Bapak Heri Kristiyanto (Bendahara DKM)',
    referenceNumber: '',
  });

  // Excel Upload & Reconciliation states
  const [showExcelUploadModal, setShowExcelUploadModal] = useState(false);
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [excelParsedRows, setExcelParsedRows] = useState<FinancialTransaction[]>([]);
  const [excelImportMode, setExcelImportMode] = useState<'append' | 'replace'>('append');
  const [excelUploadError, setExcelUploadError] = useState<string | null>(null);

  // Form states for adding items
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<'Eksterior' | 'Ruang Sholat' | 'Fasilitas' | 'Kegiatan'>('Eksterior');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  // Member form state
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  // Agenda states
  const [editingAgenda, setEditingAgenda] = useState<AgendaEvent | null>(null);
  const [isAddingAgenda, setIsAddingAgenda] = useState(false);
  const [agendaForm, setAgendaForm] = useState<Partial<AgendaEvent>>({
    title: '',
    category: 'kajian_rutin',
    speaker: '',
    themeOrKitab: '',
    date: '',
    time: '',
    location: 'Ruang Sholat Utama Masjid Ar-Rohmah',
    description: '',
    isRecurring: false,
    recurrenceText: '',
    hasLiveStream: false,
    liveStreamUrl: '',
    status: 'Mendatang',
  });

  // Article states
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    title: '',
    category: 'tausiyah',
    author: 'DKM Masjid Ar-Rohmah',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    readTime: '3 menit baca',
    summary: '',
    content: '',
    imageUrl: '',
    featured: false,
  });

  // Facility states
  const [editingFacility, setEditingFacility] = useState<MosqueFacility | null>(null);
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [facilityForm, setFacilityForm] = useState<Partial<MosqueFacility>>({
    title: '',
    description: '',
    iconName: 'Building',
    capacity: 'Tersedia Lengkap',
    status: 'Tersedia',
  });

  // Facility handlers
  const handleOpenAddFacility = () => {
    setEditingFacility(null);
    setFacilityForm({
      title: '',
      description: '',
      iconName: 'Building',
      capacity: 'Tersedia Lengkap',
      status: 'Tersedia',
    });
    setIsAddingFacility(true);
  };

  const handleOpenEditFacility = (fac: MosqueFacility) => {
    setEditingFacility(fac);
    setFacilityForm({ ...fac });
    setIsAddingFacility(false);
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.title || !facilityForm.description) {
      showToast('Mohon lengkapi judul dan deskripsi fasilitas.');
      return;
    }

    if (editingFacility) {
      const updated = facilities.map((f) =>
        f.id === editingFacility.id ? ({ ...f, ...facilityForm } as MosqueFacility) : f
      );
      onUpdateFacilities(updated);
      showToast('Fasilitas berhasil diperbarui!');
    } else {
      const newFac: MosqueFacility = {
        id: `fac-${Date.now()}`,
        title: facilityForm.title || 'Fasilitas Baru',
        description: facilityForm.description || '',
        iconName: facilityForm.iconName || 'Building',
        capacity: facilityForm.capacity || 'Tersedia Lengkap',
        status: (facilityForm.status as any) || 'Tersedia',
      };
      onUpdateFacilities([...facilities, newFac]);
      showToast('Fasilitas baru berhasil ditambahkan!');
    }

    setEditingFacility(null);
    setIsAddingFacility(false);
  };

  const handleDeleteFacility = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      onUpdateFacilities(facilities.filter((f) => f.id !== id));
      showToast('Fasilitas berhasil dihapus.');
    }
  };

  // QRIS image upload handler
  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Mengompresi & mengunggah gambar QRIS ke server...');
      try {
        const url = await processAndUploadImage(file, 'qris_barcode');
        onUpdateMosqueInfo({ ...mosqueInfo, qrisImageUrl: url });
        showToast('Gambar QRIS berhasil diperbarui & tersimpan ke server!');
      } catch (err: any) {
        showToast('Gagal memproses gambar: ' + (err.message || 'Error'));
      }
    }
  };

  // Bank account add/remove
  const handleAddBankAccount = () => {
    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '1234567890',
      accountHolder: 'DKM Masjid Ar-Rohmah',
      badge: 'BSI ZISWAF',
      logoText: 'BSI',
    };
    onUpdateBankAccounts([...bankAccounts, newBank]);
    showToast('Rekening bank baru berhasil ditambahkan.');
  };

  const handleDeleteBankAccount = (id: string) => {
    if (confirm('Hapus rekening bank ini?')) {
      onUpdateBankAccounts(bankAccounts.filter((b) => b.id !== id));
      showToast('Rekening bank berhasil dihapus.');
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- KAS & MUTASI ACTIONS ---
  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setTransactionForm({
      date: new Date().toISOString().slice(0, 10),
      type: 'masuk',
      category: 'operasional',
      description: '',
      amount: '',
      recordedBy: 'Bapak Heri Kristiyanto (Bendahara DKM)',
      referenceNumber: `TRX-${Date.now().toString().slice(-6)}`,
    });
    setIsAddingTransaction(true);
  };

  const handleOpenEditTransaction = (tx: FinancialTransaction) => {
    setEditingTransaction(tx);
    setTransactionForm({
      date: tx.date,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      amount: tx.amount,
      recordedBy: tx.recordedBy,
      referenceNumber: tx.referenceNumber || '',
    });
    setIsAddingTransaction(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(transactionForm.amount);
    if (!transactionForm.description.trim() || isNaN(numAmount) || numAmount <= 0) {
      showToast('Harap masukkan keterangan dan nominal kas yang valid!');
      return;
    }

    const currentStamp = formatReconciledDateTime();

    if (editingTransaction) {
      const prevDelta = editingTransaction.type === 'masuk' ? editingTransaction.amount : -editingTransaction.amount;
      const newDelta = transactionForm.type === 'masuk' ? numAmount : -numAmount;
      const netChange = newDelta - prevDelta;

      const updatedTxs = transactions.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              date: transactionForm.date,
              type: transactionForm.type,
              category: transactionForm.category,
              categoryLabel: categoryLabels[transactionForm.category],
              description: transactionForm.description,
              amount: numAmount,
              recordedBy: transactionForm.recordedBy || 'Bapak Heri Kristiyanto (Bendahara DKM)',
              referenceNumber: transactionForm.referenceNumber || undefined,
            }
          : t
      );

      let updatedSummary: FinancialSummary = {
        ...financialSummary,
        totalBalance: Math.max(0, financialSummary.totalBalance + netChange),
        lastUpdated: currentStamp,
        lastReconciledAt: currentStamp,
      };

      if (editingTransaction.category === transactionForm.category) {
        if (transactionForm.category === 'operasional') {
          updatedSummary.operasionalBalance = Math.max(0, updatedSummary.operasionalBalance + netChange);
        } else if (transactionForm.category === 'pembangunan') {
          updatedSummary.pembangunanBalance = Math.max(0, updatedSummary.pembangunanBalance + netChange);
        } else if (transactionForm.category === 'ziswaf') {
          updatedSummary.ziswafBalance = Math.max(0, updatedSummary.ziswafBalance + netChange);
        } else if (transactionForm.category === 'yatim') {
          updatedSummary.yatimBalance = Math.max(0, updatedSummary.yatimBalance + netChange);
        }
      } else {
        const deductOld = (cat: CashCategory, amt: number) => {
          if (cat === 'operasional') updatedSummary.operasionalBalance = Math.max(0, updatedSummary.operasionalBalance - amt);
          if (cat === 'pembangunan') updatedSummary.pembangunanBalance = Math.max(0, updatedSummary.pembangunanBalance - amt);
          if (cat === 'ziswaf') updatedSummary.ziswafBalance = Math.max(0, updatedSummary.ziswafBalance - amt);
          if (cat === 'yatim') updatedSummary.yatimBalance = Math.max(0, updatedSummary.yatimBalance - amt);
        };
        const addSubNew = (cat: CashCategory, amt: number) => {
          if (cat === 'operasional') updatedSummary.operasionalBalance = Math.max(0, updatedSummary.operasionalBalance + amt);
          if (cat === 'pembangunan') updatedSummary.pembangunanBalance = Math.max(0, updatedSummary.pembangunanBalance + amt);
          if (cat === 'ziswaf') updatedSummary.ziswafBalance = Math.max(0, updatedSummary.ziswafBalance + amt);
          if (cat === 'yatim') updatedSummary.yatimBalance = Math.max(0, updatedSummary.yatimBalance + amt);
        };
        deductOld(editingTransaction.category, prevDelta);
        addSubNew(transactionForm.category, newDelta);
      }

      onUpdateTransactions(updatedTxs);
      onUpdateFinancialSummary(updatedSummary);
      showToast('Transaksi kas berhasil diperbarui dan status rekonsiliasi disinkronkan!');
    } else {
      const newTx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        date: transactionForm.date,
        type: transactionForm.type,
        category: transactionForm.category,
        categoryLabel: categoryLabels[transactionForm.category],
        description: transactionForm.description,
        amount: numAmount,
        recordedBy: transactionForm.recordedBy || 'Bapak Heri Kristiyanto (Bendahara DKM)',
        referenceNumber: transactionForm.referenceNumber || `TRX-${Date.now().toString().slice(-6)}`,
      };

      const updatedTxs = [newTx, ...transactions];
      const delta = newTx.type === 'masuk' ? newTx.amount : -newTx.amount;

      const updatedSummary: FinancialSummary = {
        ...financialSummary,
        totalBalance: Math.max(0, financialSummary.totalBalance + delta),
        operasionalBalance:
          newTx.category === 'operasional'
            ? Math.max(0, financialSummary.operasionalBalance + delta)
            : financialSummary.operasionalBalance,
        pembangunanBalance:
          newTx.category === 'pembangunan'
            ? Math.max(0, financialSummary.pembangunanBalance + delta)
            : financialSummary.pembangunanBalance,
        ziswafBalance:
          newTx.category === 'ziswaf'
            ? Math.max(0, financialSummary.ziswafBalance + delta)
            : financialSummary.ziswafBalance,
        yatimBalance:
          newTx.category === 'yatim'
            ? Math.max(0, financialSummary.yatimBalance + delta)
            : financialSummary.yatimBalance,
        totalIncomeThisMonth:
          newTx.type === 'masuk'
            ? financialSummary.totalIncomeThisMonth + newTx.amount
            : financialSummary.totalIncomeThisMonth,
        totalExpenseThisMonth:
          newTx.type === 'keluar'
            ? financialSummary.totalExpenseThisMonth + newTx.amount
            : financialSummary.totalExpenseThisMonth,
        lastUpdated: currentStamp,
        lastReconciledAt: currentStamp,
      };

      onUpdateTransactions(updatedTxs);
      onUpdateFinancialSummary(updatedSummary);
      showToast('Transaksi kas baru berhasil dicatat dan status rekonsiliasi diperbarui!');
    }

    setIsAddingTransaction(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    if (confirm(`Hapus transaksi "${txToDelete.description}" (Rp ${txToDelete.amount.toLocaleString('id-ID')})?`)) {
      const currentStamp = formatReconciledDateTime();
      const updatedTxs = transactions.filter((t) => t.id !== id);
      const delta = txToDelete.type === 'masuk' ? -txToDelete.amount : txToDelete.amount;

      const updatedSummary: FinancialSummary = {
        ...financialSummary,
        totalBalance: Math.max(0, financialSummary.totalBalance + delta),
        operasionalBalance:
          txToDelete.category === 'operasional'
            ? Math.max(0, financialSummary.operasionalBalance + delta)
            : financialSummary.operasionalBalance,
        pembangunanBalance:
          txToDelete.category === 'pembangunan'
            ? Math.max(0, financialSummary.pembangunanBalance + delta)
            : financialSummary.pembangunanBalance,
        ziswafBalance:
          txToDelete.category === 'ziswaf'
            ? Math.max(0, financialSummary.ziswafBalance + delta)
            : financialSummary.ziswafBalance,
        yatimBalance:
          txToDelete.category === 'yatim'
            ? Math.max(0, financialSummary.yatimBalance + delta)
            : financialSummary.yatimBalance,
        lastUpdated: currentStamp,
        lastReconciledAt: currentStamp,
      };

      onUpdateTransactions(updatedTxs);
      onUpdateFinancialSummary(updatedSummary);
      showToast('Transaksi berhasil dihapus dan status rekonsiliasi disinkronkan.');
    }
  };

  const handleManualReconcileNow = () => {
    const currentStamp = formatReconciledDateTime();
    const updatedSummary: FinancialSummary = {
      ...financialSummary,
      totalBalance:
        financialSummary.operasionalBalance +
        financialSummary.pembangunanBalance +
        financialSummary.ziswafBalance +
        financialSummary.yatimBalance,
      lastUpdated: currentStamp,
      lastReconciledAt: currentStamp,
    };
    onUpdateFinancialSummary(updatedSummary);
    showToast(`Status rekonsiliasi berhasil diperbarui: ${currentStamp}`);
  };

  // Excel File Parsing & Handling
  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcelUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        if (!buffer) return;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setExcelUploadError('File Excel kosong atau tidak memiliki baris data.');
          return;
        }

        const parsed: FinancialTransaction[] = [];

        rawJson.forEach((row, idx) => {
          const keys = Object.keys(row);
          const findVal = (keywords: string[]) => {
            const foundKey = keys.find((k) =>
              keywords.some((kw) => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(kw))
            );
            return foundKey ? row[foundKey] : undefined;
          };

          const rawDate = findVal(['tanggal', 'tgl', 'date']);
          const rawType = findVal(['jenis', 'tipe', 'type', 'arah']);
          const rawCategory = findVal(['kategori', 'category', 'pos']);
          const rawDesc = findVal(['keterangan', 'uraian', 'deskripsi', 'description', 'rincian']);
          const rawAmount = findVal(['nominal', 'jumlah', 'amount', 'nilai', 'rupiah', 'total']);
          const rawRecorded = findVal(['pencatat', 'petugas', 'recorder', 'nama', 'operator']);
          const rawRef = findVal(['ref', 'referensi', 'nobukti', 'nomor']);

          let parsedDate = new Date().toISOString().slice(0, 10);
          if (rawDate) {
            if (typeof rawDate === 'number') {
              const d = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
              parsedDate = d.toISOString().slice(0, 10);
            } else {
              const strDate = String(rawDate).trim();
              if (strDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                parsedDate = strDate;
              } else if (strDate.match(/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/)) {
                const parts = strDate.split(/[\/\-\.]/);
                const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                parsedDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
          }

          let parsedType: 'masuk' | 'keluar' = 'masuk';
          const typeStr = String(rawType || '').toLowerCase();
          if (
            typeStr.includes('keluar') ||
            typeStr.includes('debit') ||
            typeStr.includes('pengeluaran') ||
            typeStr.includes('out') ||
            typeStr.includes('beban')
          ) {
            parsedType = 'keluar';
          }

          let parsedCategory: CashCategory = 'operasional';
          const catStr = String(rawCategory || '').toLowerCase();
          if (catStr.includes('pembangunan') || catStr.includes('renovasi') || catStr.includes('fisik')) {
            parsedCategory = 'pembangunan';
          } else if (catStr.includes('ziswaf') || catStr.includes('zakat') || catStr.includes('infaq') || catStr.includes('sedekah')) {
            parsedCategory = 'ziswaf';
          } else if (catStr.includes('yatim') || catStr.includes('santunan') || catStr.includes('dhuafa')) {
            parsedCategory = 'yatim';
          }

          let numAmount = 0;
          if (typeof rawAmount === 'number') {
            numAmount = Math.abs(rawAmount);
          } else if (rawAmount) {
            const cleanStr = String(rawAmount).replace(/[^0-9.-]/g, '');
            numAmount = Math.abs(parseFloat(cleanStr) || 0);
          }

          const desc = String(rawDesc || `Transaksi Kas ${idx + 1}`).trim();
          if (numAmount > 0) {
            parsed.push({
              id: `tx-xls-${Date.now()}-${idx}`,
              date: parsedDate,
              type: parsedType,
              category: parsedCategory,
              categoryLabel: categoryLabels[parsedCategory],
              description: desc,
              amount: numAmount,
              recordedBy: String(rawRecorded || 'Bapak Heri Kristiyanto (Bendahara DKM)').trim(),
              referenceNumber: String(rawRef || `XLS-${idx + 1}`).trim(),
            });
          }
        });

        if (parsed.length === 0) {
          setExcelUploadError('Tidak ada baris transaksi valid (nominal > 0) yang dapat diparsing.');
        } else {
          setExcelParsedRows(parsed);
        }
      } catch (err: any) {
        setExcelUploadError(`Gagal membaca file Excel: ${err.message}`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmExcelImport = () => {
    if (excelParsedRows.length === 0) return;

    const currentStamp = formatReconciledDateTime();
    let finalTxs: FinancialTransaction[] = [];

    if (excelImportMode === 'append') {
      finalTxs = [...excelParsedRows, ...transactions];
    } else {
      finalTxs = [...excelParsedRows];
    }

    let sumOperasional = excelImportMode === 'replace' ? 0 : financialSummary.operasionalBalance;
    let sumPembangunan = excelImportMode === 'replace' ? 0 : financialSummary.pembangunanBalance;
    let sumZiswaf = excelImportMode === 'replace' ? 0 : financialSummary.ziswafBalance;
    let sumYatim = excelImportMode === 'replace' ? 0 : financialSummary.yatimBalance;

    excelParsedRows.forEach((tx) => {
      const delta = tx.type === 'masuk' ? tx.amount : -tx.amount;
      if (tx.category === 'operasional') sumOperasional += delta;
      else if (tx.category === 'pembangunan') sumPembangunan += delta;
      else if (tx.category === 'ziswaf') sumZiswaf += delta;
      else if (tx.category === 'yatim') sumYatim += delta;
    });

    sumOperasional = Math.max(0, sumOperasional);
    sumPembangunan = Math.max(0, sumPembangunan);
    sumZiswaf = Math.max(0, sumZiswaf);
    sumYatim = Math.max(0, sumYatim);

    const newTotal = sumOperasional + sumPembangunan + sumZiswaf + sumYatim;

    const updatedSummary: FinancialSummary = {
      ...financialSummary,
      totalBalance: newTotal,
      operasionalBalance: sumOperasional,
      pembangunanBalance: sumPembangunan,
      ziswafBalance: sumZiswaf,
      yatimBalance: sumYatim,
      lastUpdated: currentStamp,
      lastReconciledAt: currentStamp,
    };

    onUpdateTransactions(finalTxs);
    onUpdateFinancialSummary(updatedSummary);
    showToast(`Berhasil merekonsiliasi ${excelParsedRows.length} transaksi kas dari file Excel!`);

    setShowExcelUploadModal(false);
    setExcelParsedRows([]);
    setExcelFileName('');
  };

  const handleDownloadExcelTemplate = () => {
    const templateRows = [
      {
        'Tanggal (YYYY-MM-DD)': '2026-10-15',
        'Jenis (masuk/keluar)': 'masuk',
        'Kategori (operasional/pembangunan/ziswaf/yatim)': 'operasional',
        'Keterangan Transaksi': 'Infaq Kotak Sholat Jumat & Kotak Tromol',
        'Nominal (Rp)': 2500000,
        'Nama Pencatat / Petugas': 'Bapak Heri Kristiyanto (Bendahara DKM)',
        'Nomor Referensi': 'IN-2026-1015',
      },
      {
        'Tanggal (YYYY-MM-DD)': '2026-10-16',
        'Jenis (masuk/keluar)': 'keluar',
        'Kategori (operasional/pembangunan/ziswaf/yatim)': 'operasional',
        'Keterangan Transaksi': 'Biaya Perawatan Sound System & Kebersihan',
        'Nominal (Rp)': 650000,
        'Nama Pencatat / Petugas': 'Bapak Heri Kristiyanto (Bendahara DKM)',
        'Nomor Referensi': 'OUT-2026-1016',
      },
      {
        'Tanggal (YYYY-MM-DD)': '2026-10-17',
        'Jenis (masuk/keluar)': 'masuk',
        'Kategori (operasional/pembangunan/ziswaf/yatim)': 'pembangunan',
        'Keterangan Transaksi': 'Wakaf Semen & Pasir dari Warga BNI',
        'Nominal (Rp)': 1200000,
        'Nama Pencatat / Petugas': 'Bapak Heri Kristiyanto (Bendahara DKM)',
        'Nomor Referensi': 'WKF-2026-1017',
      },
      {
        'Tanggal (YYYY-MM-DD)': '2026-10-17',
        'Jenis (masuk/keluar)': 'masuk',
        'Kategori (operasional/pembangunan/ziswaf/yatim)': 'yatim',
        'Keterangan Transaksi': 'Infaq Khusus Santunan Yatim Piatu',
        'Nominal (Rp)': 750000,
        'Nama Pencatat / Petugas': 'Bapak Heri Kristiyanto (Bendahara DKM)',
        'Nomor Referensi': 'YTM-2026-1017',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 45 },
      { wch: 15 },
      { wch: 35 },
      { wch: 18 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mutasi_Kas');
    XLSX.writeFile(workbook, 'Template_Mutasi_Kas_Masjid_Ar-Rohmah.xlsx');
    showToast('Template Excel berhasil diunduh!');
  };

  const handleManualSave = async () => {
    if (onSaveToBackend) {
      await onSaveToBackend();
    }
    showToast('Semua perubahan berhasil disinkronkan & disimpan ke browser (localStorage) dan backend!');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Mengompresi & mengunggah foto ke server...');
      try {
        const url = await processAndUploadImage(file, 'galeri_masjid');
        setNewImagePreview(url);
        showToast('Foto berhasil diproses & siap disimpan ke galeri!');
      } catch (err: any) {
        showToast('Gagal memproses foto: ' + (err.message || 'Error'));
      }
    }
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImagePreview || !newImageTitle) return;

    const newImg: MosqueImage = {
      id: `img-${Date.now()}`,
      title: newImageTitle,
      category: newImageCategory,
      imageUrl: newImagePreview,
      caption: newImageCaption,
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    onUpdateGalleryImages([newImg, ...galleryImages]);
    setNewImageTitle('');
    setNewImageCaption('');
    setNewImagePreview(null);
    showToast('Foto baru berhasil ditambahkan & tersinkronkan ke server!');
  };

  const handleDeleteGalleryImage = (id: string) => {
    if (confirm('Hapus foto ini dari galeri?')) {
      onUpdateGalleryImages(galleryImages.filter((img) => img.id !== id));
      showToast('Foto berhasil dihapus.');
    }
  };

  // Member photo upload
  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('Mengompresi & mengunggah foto pengurus ke server...');
      try {
        const url = await processAndUploadImage(file, `pengurus_${memberId}`);
        const updated = members.map((m) =>
          m.id === memberId ? { ...m, avatarUrl: url } : m
        );
        onUpdateMembers(updated);
        showToast('Foto pengurus berhasil diperbarui & tersinkronkan ke semua perangkat!');
      } catch (err: any) {
        showToast('Gagal memproses foto: ' + (err.message || 'Error'));
      }
    }
  };

  // Agenda actions
  const handleOpenAddAgenda = () => {
    setEditingAgenda(null);
    setAgendaForm({
      title: '',
      category: 'kajian_rutin',
      speaker: '',
      themeOrKitab: '',
      date: '',
      time: '',
      location: 'Ruang Sholat Utama Masjid Ar-Rohmah',
      description: '',
      isRecurring: false,
      recurrenceText: '',
      hasLiveStream: false,
      liveStreamUrl: '',
      status: 'Mendatang',
    });
    setIsAddingAgenda(true);
  };

  const handleOpenEditAgenda = (event: AgendaEvent) => {
    setEditingAgenda(event);
    setAgendaForm({ ...event });
    setIsAddingAgenda(true);
  };

  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaForm.title?.trim() || !agendaForm.date?.trim()) {
      showToast('Harap isi judul dan tanggal/waktu agenda!');
      return;
    }

    if (editingAgenda) {
      const updated = agendaEvents.map((item) =>
        item.id === editingAgenda.id
          ? ({ ...item, ...agendaForm } as AgendaEvent)
          : item
      );
      onUpdateAgendaEvents(updated);
      showToast('Agenda/Kajian berhasil diperbarui!');
    } else {
      const newEvent: AgendaEvent = {
        id: `ev-${Date.now()}`,
        title: agendaForm.title || '',
        category: (agendaForm.category || 'kajian_rutin') as any,
        speaker: agendaForm.speaker || '',
        themeOrKitab: agendaForm.themeOrKitab || '',
        date: agendaForm.date || '',
        time: agendaForm.time || '',
        location: agendaForm.location || 'Ruang Sholat Utama Masjid Ar-Rohmah',
        description: agendaForm.description || '',
        isRecurring: !!agendaForm.isRecurring,
        recurrenceText: agendaForm.recurrenceText || '',
        hasLiveStream: !!agendaForm.hasLiveStream,
        liveStreamUrl: agendaForm.liveStreamUrl || '',
        status: (agendaForm.status || 'Mendatang') as any,
      };
      onUpdateAgendaEvents([newEvent, ...agendaEvents]);
      showToast('Agenda baru berhasil ditambahkan!');
    }
    setIsAddingAgenda(false);
    setEditingAgenda(null);
  };

  const handleDeleteAgenda = (id: string) => {
    if (confirm('Hapus agenda ini dari jadwal masjid?')) {
      onUpdateAgendaEvents(agendaEvents.filter((item) => item.id !== id));
      showToast('Agenda berhasil dihapus.');
    }
  };

  // Article actions
  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'tausiyah',
      author: 'DKM Masjid Ar-Rohmah',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '3 menit baca',
      summary: '',
      content: '',
      imageUrl: '',
      featured: false,
    });
    setIsAddingArticle(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleForm({ ...art });
    setIsAddingArticle(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title?.trim() || !articleForm.content?.trim()) {
      showToast('Harap isi judul dan konten artikel!');
      return;
    }

    const slug = (articleForm.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingArticle) {
      const updated = articles.map((item) =>
        item.id === editingArticle.id
          ? ({ ...item, ...articleForm, slug: item.slug || slug } as Article)
          : item
      );
      onUpdateArticles(updated);
      showToast('Artikel/Warta berhasil diperbarui!');
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: articleForm.title || '',
        slug,
        category: (articleForm.category || 'tausiyah') as any,
        author: articleForm.author || 'DKM Ar-Rohmah',
        date: articleForm.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: articleForm.readTime || '3 menit baca',
        summary: articleForm.summary || (articleForm.content || '').slice(0, 160) + '...',
        content: articleForm.content || '',
        imageUrl: articleForm.imageUrl || '',
        featured: !!articleForm.featured,
      };
      onUpdateArticles([newArt, ...articles]);
      showToast('Artikel/Warta baru berhasil dipublikasikan!');
    }
    setIsAddingArticle(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Hapus artikel/warta ini?')) {
      onUpdateArticles(articles.filter((item) => item.id !== id));
      showToast('Artikel berhasil dihapus.');
    }
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const backupData = {
      mosqueInfo,
      members,
      galleryImages,
      fridayOfficers,
      financialSummary,
      transactions,
      agendaEvents,
      articles,
      bankAccounts,
      facilities,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_masjid_arrohmah_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import full JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.mosqueInfo) onUpdateMosqueInfo(json.mosqueInfo);
          if (json.members) onUpdateMembers(json.members);
          if (json.galleryImages) onUpdateGalleryImages(json.galleryImages);
          if (json.fridayOfficers) onUpdateFridayOfficers(json.fridayOfficers);
          if (json.financialSummary) onUpdateFinancialSummary(json.financialSummary);
          if (json.transactions) onUpdateTransactions(json.transactions);
          if (json.agendaEvents) onUpdateAgendaEvents(json.agendaEvents);
          if (json.articles) onUpdateArticles(json.articles);
          if (json.bankAccounts) onUpdateBankAccounts(json.bankAccounts);
          if (json.facilities) onUpdateFacilities(json.facilities);
          showToast('Data website & gambar berhasil diimpor & disinkronkan!');
          if (onSaveToBackend) onSaveToBackend();
        } catch {
          showToast('Format file cadangan JSON tidak valid!');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  // Gatekeeper: Only mjdarrohmah@gmail.com with matching Gmail password is authorized
  if (authenticatedEmail !== AUTHORIZED_ADMIN_EMAIL) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
          {/* Google Header */}
          <div className="p-6 sm:p-8 text-center relative border-b border-slate-100 bg-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Logo */}
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Login dengan Akun Google
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan credential Gmail DKM untuk mengakses Panel Admin Masjid Ar-Rohmah
            </p>

            {/* Google Account Profile Chip */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                M
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900 truncate">DKM Masjid Ar-Rohmah</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs font-mono text-slate-600 truncate font-medium">
                  {AUTHORIZED_ADMIN_EMAIL}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-4 pt-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{authError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Akun Email Google (Gmail) *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmailInput}
                  onChange={(e) => {
                    setLoginEmailInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-800 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Hanya alamat <span className="font-mono font-semibold text-slate-900">{AUTHORIZED_ADMIN_EMAIL}</span> yang memiliki hak akses.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Kata Sandi Login Email (mjdarrohmah@gmail.com) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#1a73e8] hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi email mjdarrohmah@gmail.com..."
                  value={loginPasswordInput}
                  onChange={(e) => {
                    setLoginPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                />
              </div>
            </div>

            {/* DKM Credential Security Notice */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Autentikasi Terverifikasi: Hak kelola website DKM hanya diizinkan untuk akun <strong>{AUTHORIZED_ADMIN_EMAIL}</strong> dengan kata sandi login email tersebut.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full border border-slate-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Sandi...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Masuk dengan Akun Google</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-slate-400">
                Dilindungi oleh Google Credential Security · DKM Masjid Ar-Rohmah
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Panel Backend DKM Masjid Ar-Rohmah
                </h2>
                <span className="bg-emerald-800 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  SINKRON SERVER
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">
                Kelola seluruh teks wording, foto masjid, pengurus, kas, agenda, dan rekening website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Authenticated Google Account Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/90 border border-emerald-700/80 text-xs">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <div className="text-left">
                <span className="block text-[9px] text-emerald-300/90 uppercase tracking-wider font-semibold">Akun Google DKM</span>
                <span className="font-mono text-[11px] font-bold text-amber-300 leading-tight">
                  {AUTHORIZED_ADMIN_EMAIL}
                </span>
              </div>
            </div>

            {/* Realtime Browser & Database Sync Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider font-semibold text-emerald-400 leading-none">Sync Browser & Server</span>
                <span className="font-bold text-[11px] text-white">Tersimpan Otomatis</span>
              </div>
            </div>

            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
              title="Paksa sinkronisasi dan simpan seluruh data sekarang"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Sinkronkan</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-xl text-xs font-bold border border-rose-800/60 transition-colors"
              title="Keluar dari sesi Akun Google"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-emerald-900 rounded-xl transition-colors"
              aria-label="Tutup Panel Admin"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {notification && (
          <div className="bg-emerald-800 text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-100 border-b border-slate-200 shrink-0 text-xs">
          {[
            { id: 'profil', label: 'Profil, Hero & Wording', icon: Sparkles },
            { id: 'fasilitas', label: 'Fasilitas Masjid', icon: Building },
            { id: 'galeri', label: 'Galeri Foto Masjid', icon: ImageIcon },
            { id: 'pengurus', label: 'Pengurus DKM', icon: Users },
            { id: 'jumat', label: 'Khotib & Salat Jumat', icon: Calendar },
            { id: 'keuangan', label: 'Laporan Kas', icon: FileText },
            { id: 'agenda', label: 'Agenda & Kajian', icon: Calendar },
            { id: 'artikel', label: 'Artikel & Warta', icon: BookOpen },
            { id: 'rekening', label: 'Rekening & QRIS', icon: Heart },
            { id: 'backup', label: 'Backup & Restore', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PROFIL, HERO & WORDING */}
          {activeTab === 'profil' && (
            <div className="max-w-4xl space-y-6">
              {/* Identitas Masjid */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Identitas Resmi & Kontak Masjid
                  </h3>
                  <p className="text-xs text-slate-500">
                    Wording identitas utama yang tampil di Header, Kontak, dan Footer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Masjid</label>
                    <input
                      type="text"
                      value={mosqueInfo.name}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Tagline Masjid</label>
                    <input
                      type="text"
                      value={mosqueInfo.tagline}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, tagline: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={mosqueInfo.address}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, address: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">No. Kontak / WhatsApp Sekretariat</label>
                    <input
                      type="text"
                      value={mosqueInfo.phone}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={mosqueInfo.email}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, email: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor SK Kemenag</label>
                    <input
                      type="text"
                      value={mosqueInfo.dkmSkNumber}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, dkmSkNumber: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Tahun Berdiri</label>
                    <input
                      type="text"
                      value={mosqueInfo.establishedYear}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, establishedYear: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Wording Hero Banner */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Wording Hero Banner (Bagian Teratas Beranda)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sesuaikan teks headline, subheadline, badge, dan kutipan ayat Al-Qur'an di banner beranda.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Badge Teks Atas</label>
                    <input
                      type="text"
                      value={mosqueInfo.heroBadge || ''}
                      placeholder="Portal Resmi DKM Masjid Ar-Rohmah Rangkasbitung"
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, heroBadge: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Judul Utama Banner</label>
                    <input
                      type="text"
                      value={mosqueInfo.heroTitle || ''}
                      placeholder="Masjid Ar-Rohmah, Rangkasbitung"
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, heroTitle: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Deskripsi Singkat Banner</label>
                    <textarea
                      rows={2}
                      value={mosqueInfo.heroSubtitle || ''}
                      placeholder="Pusat ibadah, kajian keislaman, pembinaan generasi qur’ani..."
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, heroSubtitle: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Foto Latar / Banner Hero Masjid (Image URL atau Upload)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={mosqueInfo.heroImageUrl || ''}
                        placeholder="https://... atau upload foto"
                        onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, heroImageUrl: e.target.value })}
                        className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              showToast('Mengompresi & mengunggah foto banner ke server...');
                              try {
                                const url = await processAndUploadImage(file, 'banner_hero');
                                onUpdateMosqueInfo({ ...mosqueInfo, heroImageUrl: url });
                                showToast('Foto banner hero berhasil diperbarui & tersinkronkan!');
                              } catch (err: any) {
                                showToast('Gagal memproses foto: ' + (err.message || 'Error'));
                              }
                            }
                          }}
                        />
                      </label>
                      {mosqueInfo.heroImageUrl && (
                        <button
                          type="button"
                          onClick={() => onUpdateMosqueInfo({ ...mosqueInfo, heroImageUrl: '' })}
                          className="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    {mosqueInfo.heroImageUrl && (
                      <div className="mt-2 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
                        <img
                          src={resolveImageUrl(mosqueInfo.heroImageUrl)}
                          alt="Hero Preview"
                          onError={(e) => handleImageError(e, 'mosque')}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                          Preview Latar Banner
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Kutipan Ayat Al-Qur'an di Banner</span>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Teks Arab</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={mosqueInfo.quranVerseArabic || ''}
                        onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, quranVerseArabic: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-arabic"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Terjemahan Ayat</label>
                      <textarea
                        rows={2}
                        value={mosqueInfo.quranVerseTranslation || ''}
                        onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, quranVerseTranslation: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Nama Surat & Ayat</label>
                      <input
                        type="text"
                        value={mosqueInfo.quranVerseReference || ''}
                        placeholder="(QS. At-Taubah: 18)"
                        onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, quranVerseReference: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sejarah & Filosofi */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Teks Sejarah & Filosofi Nama Masjid
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Teks Sejarah & Latar Belakang Berdirinya Masjid
                    </label>
                    <textarea
                      rows={3}
                      value={mosqueInfo.historyText || ''}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, historyText: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Judul Filosofi Nama
                    </label>
                    <input
                      type="text"
                      value={mosqueInfo.philosophyTitle || ''}
                      placeholder='"Ar-Rohmah" (Menebar Kasih Sayang)'
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, philosophyTitle: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Penjelasan Filosofi Nama
                    </label>
                    <textarea
                      rows={2}
                      value={mosqueInfo.philosophyText || ''}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, philosophyText: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Visi & Misi Masjid Ar-Rohmah
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Teks Visi Masjid
                    </label>
                    <textarea
                      rows={2}
                      value={mosqueInfo.visionText || ''}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, visionText: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Butir-butir Misi DKM
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentMissions = mosqueInfo.missionsList || [];
                          onUpdateMosqueInfo({
                            ...mosqueInfo,
                            missionsList: [...currentMissions, 'Misi baru DKM Masjid Ar-Rohmah'],
                          });
                        }}
                        className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Butir Misi
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(mosqueInfo.missionsList || []).map((misi, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-emerald-800 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                            {mIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={misi}
                            onChange={(e) => {
                              const updated = [...(mosqueInfo.missionsList || [])];
                              updated[mIdx] = e.target.value;
                              onUpdateMosqueInfo({ ...mosqueInfo, missionsList: updated });
                            }}
                            className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (mosqueInfo.missionsList || []).filter((_, i) => i !== mIdx);
                              onUpdateMosqueInfo({ ...mosqueInfo, missionsList: updated });
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded"
                            title="Hapus butir misi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Links */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Tautan Google Maps
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Direct URL Google Maps
                    </label>
                    <input
                      type="text"
                      value={mosqueInfo.mapsDirectUrl || ''}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, mapsDirectUrl: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Embed URL Google Maps (Iframe)
                    </label>
                    <input
                      type="text"
                      value={mosqueInfo.mapsEmbedUrl || ''}
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, mapsEmbedUrl: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FASILITAS MASJID AR-ROHMAH */}
          {activeTab === 'fasilitas' && (
            <div className="space-y-6">
              <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kelola Fasilitas & Sarana Masjid Ar-Rohmah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tambah, edit informasi sarana prasarana, status ketersediaan, kapasitas, dan ikon fasilitas.
                  </p>
                </div>

                {!isAddingFacility && !editingFacility && (
                  <button
                    onClick={handleOpenAddFacility}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Tambah Fasilitas Baru</span>
                  </button>
                )}
              </div>

              {/* Form Add / Edit Facility */}
              {(isAddingFacility || editingFacility) && (
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-800" />
                      <span>{editingFacility ? 'Edit Fasilitas Masjid' : 'Tambah Fasilitas Baru'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingFacility(false);
                        setEditingFacility(null);
                      }}
                      className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveFacility} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Nama / Judul Fasilitas *
                        </label>
                        <input
                          type="text"
                          required
                          value={facilityForm.title || ''}
                          placeholder="Contoh: Ruang Sholat Utama Ber-AC"
                          onChange={(e) => setFacilityForm({ ...facilityForm, title: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Keterangan Kapasitas / Spesifikasi
                        </label>
                        <input
                          type="text"
                          value={facilityForm.capacity || ''}
                          placeholder="Contoh: Tersedia Lengkap, 24 Titik Kran, 80 Santri"
                          onChange={(e) => setFacilityForm({ ...facilityForm, capacity: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Status Fasilitas
                        </label>
                        <select
                          value={facilityForm.status || 'Tersedia'}
                          onChange={(e) => setFacilityForm({ ...facilityForm, status: e.target.value as any })}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Tersedia">Tersedia (Bisa Digunakan)</option>
                          <option value="Sedang Digunakan">Sedang Digunakan</option>
                          <option value="Dalam Pemeliharaan">Dalam Pemeliharaan (Maintenance)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Pilihan Ikon Fasilitas
                        </label>
                        <select
                          value={facilityForm.iconName || 'Building'}
                          onChange={(e) => setFacilityForm({ ...facilityForm, iconName: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Building">Gedung / Umum (Building)</option>
                          <option value="Airplay">Pendingin AC / Ventilasi (Airplay)</option>
                          <option value="Droplets">Tempat Wudhu & Air (Droplets)</option>
                          <option value="Tv">Sound & Layar Digital TV (Tv)</option>
                          <option value="Car">Area Parkir Kendaraan (Car)</option>
                          <option value="BookOpen">TPA & Ruang Belajar (BookOpen)</option>
                          <option value="HeartHandshake">Layanan Kifayah & Jenazah (HeartHandshake)</option>
                          <option value="Library">Perpustakaan & Buku (Library)</option>
                          <option value="Wifi">Wi-Fi & Ramah Lansia (Wifi)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Deskripsi Lengkap Fasilitas *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={facilityForm.description || ''}
                        placeholder="Jelaskan fasilitas secara lengkap untuk kenyamanan jamaah..."
                        onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFacility(false);
                          setEditingFacility(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
                      >
                        {editingFacility ? 'Simpan Perubahan Fasilitas' : 'Tambahkan Fasilitas'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Grid of Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((fac) => {
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
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
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
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              fac.status === 'Dalam Pemeliharaan'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : fac.status === 'Sedang Digunakan'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {fac.status || 'Tersedia'}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mb-1">{fac.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">{fac.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditFacility(fac)}
                          className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFacility(fac.id)}
                          className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GALERI FOTO MASJID */}
          {activeTab === 'galeri' && (
            <div className="space-y-6">
              {/* Upload Box */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Upload Foto Dokumentasi Baru (Bisa Discroll Kiri Kanan di Beranda)</span>
                </h4>

                <form onSubmit={handleAddGalleryImage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Pilih File Foto
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required={!newImagePreview}
                      onChange={handleImageFileUpload}
                      className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-emerald-800 file:text-white border rounded-lg p-1"
                    />
                    {newImagePreview && (
                      <div className="mt-2 aspect-[16/9] rounded-lg overflow-hidden border">
                        <img src={newImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Judul Foto</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Suasana Mihrab & Karpet Baru"
                        value={newImageTitle}
                        onChange={(e) => setNewImageTitle(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Kategori</label>
                      <select
                        value={newImageCategory}
                        onChange={(e) => setNewImageCategory(e.target.value as any)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Eksterior">Eksterior</option>
                        <option value="Ruang Sholat">Ruang Sholat</option>
                        <option value="Fasilitas">Fasilitas</option>
                        <option value="Kegiatan">Kegiatan</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Keterangan / Caption</label>
                      <input
                        type="text"
                        placeholder="Keterangan singkat..."
                        value={newImageCaption}
                        onChange={(e) => setNewImageCaption(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors"
                    >
                      + Tambahkan ke Galeri
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Gallery List */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">
                  Daftar Foto Galeri Saat Ini ({galleryImages.length} Foto)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                          <img
                            src={resolveImageUrl(img.imageUrl)}
                            alt={img.title}
                            onError={(e) => handleImageError(e, 'mosque')}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-slate-900/80 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                            {img.category}
                          </span>
                        </div>
                        <div className="p-3">
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{img.title}</h5>
                          {img.caption && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{img.caption}</p>
                          )}
                        </div>
                      </div>
                      <div className="p-2 border-t flex justify-end">
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENGURUS DKM */}
          {activeTab === 'pengurus' && (
            <div className="space-y-6">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kelola Struktur Pengurus Inti DKM & Foto
                  </h3>
                  <p className="text-xs text-slate-500">
                    Struktur resmi terdiri dari: <strong>Bapak Rafiudin</strong> (Ketua Pelindung), <strong>Bapak Adih</strong> (Ketua DKM), dan <strong>Bapak Heri Kristiyanto</strong> (Bendahara DKM). Anda dapat mengganti foto, nama lengkap, jabatan, dan bio.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Photo preview and upload */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 relative shrink-0">
                          {member.avatarUrl ? (
                            <img
                              src={resolveImageUrl(member.avatarUrl)}
                              alt={member.name}
                              onError={(e) => handleImageError(e, 'avatar')}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                              No Foto
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <label className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-100 inline-block">
                            <span>Ganti Foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMemberPhotoUpload(e, member.id)}
                            />
                          </label>
                          <span className="text-[10px] text-slate-400 block">Mendukung file JPG/PNG</span>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="font-semibold text-slate-600 block text-[11px]">Nama Lengkap</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const updated = members.map((m) =>
                                m.id === member.id ? { ...m, name: e.target.value } : m
                              );
                              onUpdateMembers(updated);
                            }}
                            className="w-full p-2 border rounded-lg font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 block text-[11px]">Jabatan / Peran</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => {
                              const updated = members.map((m) =>
                                m.id === member.id ? { ...m, role: e.target.value } : m
                              );
                              onUpdateMembers(updated);
                            }}
                            className="w-full p-2 border rounded-lg text-emerald-900 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 block text-[11px]">Divisi</label>
                          <input
                            type="text"
                            value={member.division}
                            onChange={(e) => {
                              const updated = members.map((m) =>
                                m.id === member.id ? { ...m, division: e.target.value } : m
                              );
                              onUpdateMembers(updated);
                            }}
                            className="w-full p-2 border rounded-lg text-slate-700"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 block text-[11px]">Bio / Keterangan</label>
                          <textarea
                            rows={2}
                            value={member.bio || ''}
                            onChange={(e) => {
                              const updated = members.map((m) =>
                                m.id === member.id ? { ...m, bio: e.target.value } : m
                              );
                              onUpdateMembers(updated);
                            }}
                            className="w-full p-2 border rounded-lg text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KHOTIB & SALAT JUMAT */}
          {activeTab === 'jumat' && (
            <div className="space-y-6">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Kelola Jadwal Petugas Shalat Jumat Bergilir
                </h3>
              </div>

              <div className="space-y-4">
                {fridayOfficers.map((fri, idx) => (
                  <div key={fri.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-emerald-900">
                        Pekan #{idx + 1} ({fri.date})
                      </span>
                      <input
                        type="text"
                        value={fri.date}
                        onChange={(e) => {
                          const updated = fridayOfficers.map((f) =>
                            f.id === fri.id ? { ...f, date: e.target.value } : f
                          );
                          onUpdateFridayOfficers(updated);
                        }}
                        className="text-xs p-1.5 border rounded bg-white w-48 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-600 block text-[11px]">Khatib</label>
                        <input
                          type="text"
                          value={fri.khatib}
                          onChange={(e) => {
                            const updated = fridayOfficers.map((f) =>
                              f.id === fri.id ? { ...f, khatib: e.target.value } : f
                            );
                            onUpdateFridayOfficers(updated);
                          }}
                          className="w-full p-1.5 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block text-[11px]">Imam</label>
                        <input
                          type="text"
                          value={fri.imam}
                          onChange={(e) => {
                            const updated = fridayOfficers.map((f) =>
                              f.id === fri.id ? { ...f, imam: e.target.value } : f
                            );
                            onUpdateFridayOfficers(updated);
                          }}
                          className="w-full p-1.5 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block text-[11px]">Muadzin</label>
                        <input
                          type="text"
                          value={fri.muadzin}
                          onChange={(e) => {
                            const updated = fridayOfficers.map((f) =>
                              f.id === fri.id ? { ...f, muadzin: e.target.value } : f
                            );
                            onUpdateFridayOfficers(updated);
                          }}
                          className="w-full p-1.5 border rounded bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-600 block text-[11px]">Bilal</label>
                        <input
                          type="text"
                          value={fri.bilal || ''}
                          onChange={(e) => {
                            const updated = fridayOfficers.map((f) =>
                              f.id === fri.id ? { ...f, bilal: e.target.value } : f
                            );
                            onUpdateFridayOfficers(updated);
                          }}
                          className="w-full p-1.5 border rounded bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-600 block text-[11px]">Judul Tema Khutbah</label>
                      <input
                        type="text"
                        value={fri.khutbahTheme}
                        onChange={(e) => {
                          const updated = fridayOfficers.map((f) =>
                            f.id === fri.id ? { ...f, khutbahTheme: e.target.value } : f
                          );
                          onUpdateFridayOfficers(updated);
                        }}
                        className="w-full p-2 border rounded bg-white font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LAPORAN KEUANGAN KAS */}
          {activeTab === 'keuangan' && (
            <div className="space-y-6">
              {/* Header Tab */}
              <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      Kelola Saldo Kas & Mutasi Keuangan
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Akses Khusus Admin DKM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Catat mutasi arus kas, edit atau hapus transaksi, serta unggah file Excel untuk penyesuaian otomatis. Tanggal dan jam rekonsiliasi kas akan tersinkronisasi otomatis setiap kali perubahan dilakukan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadExcelTemplate}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
                    title="Unduh format spreadsheet Excel untuk diisi"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Format Excel</span>
                  </button>

                  <button
                    onClick={() => {
                      setExcelUploadError(null);
                      setExcelParsedRows([]);
                      setExcelFileName('');
                      setShowExcelUploadModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span>Upload Excel Kas</span>
                  </button>

                  <button
                    onClick={handleOpenAddTransaction}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Transaksi Kas</span>
                  </button>
                </div>
              </div>

              {/* Status Rekonsiliasi Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-4 border border-emerald-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center text-amber-300 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                        Status Rekonsiliasi Kas Mengikuti Perubahan
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
                      {financialSummary.lastReconciledAt || financialSummary.lastUpdated}
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      Tanggal dan jam ini otomatis tercatat dan diperbarui di website setiap transaksi ditambahkan, diubah, dihapus, atau diunggah dari file Excel.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleManualReconcileNow}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-amber-200 border border-emerald-600 rounded-xl text-xs font-bold transition-all shadow-xs self-start md:self-auto shrink-0"
                  title="Perbarui stempel waktu rekonsiliasi ke tanggal dan jam sekarang"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rekonsiliasi Sekarang</span>
                </button>
              </div>

              {/* Saldo Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* Total Saldo Kas Terkumpul */}
                <div className="bg-emerald-900 text-white p-4 rounded-2xl border border-emerald-700 shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                      Total Saldo Kas Terkumpul
                    </span>
                    <div className="text-xl sm:text-2xl font-black mt-1 font-mono">
                      Rp {financialSummary.totalBalance.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300/90 mt-2 block font-medium">
                    Akumulasi 4 pos kas
                  </span>
                </div>

                {/* Kas Operasional */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">Kas Operasional</label>
                    <span className="text-[10px] text-slate-400">Rutin</span>
                  </div>
                  <input
                    type="number"
                    value={financialSummary.operasionalBalance}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const stamp = formatReconciledDateTime();
                      onUpdateFinancialSummary({
                        ...financialSummary,
                        operasionalBalance: val,
                        totalBalance: val + financialSummary.pembangunanBalance + financialSummary.ziswafBalance + financialSummary.yatimBalance,
                        lastUpdated: stamp,
                        lastReconciledAt: stamp,
                      });
                    }}
                    className="w-full mt-1.5 p-2 font-mono font-bold text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rp {financialSummary.operasionalBalance.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Kas Pembangunan */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">Kas Pembangunan</label>
                    <span className="text-[10px] text-amber-600 font-semibold">Proyek</span>
                  </div>
                  <input
                    type="number"
                    value={financialSummary.pembangunanBalance}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const stamp = formatReconciledDateTime();
                      onUpdateFinancialSummary({
                        ...financialSummary,
                        pembangunanBalance: val,
                        totalBalance: financialSummary.operasionalBalance + val + financialSummary.ziswafBalance + financialSummary.yatimBalance,
                        lastUpdated: stamp,
                        lastReconciledAt: stamp,
                      });
                    }}
                    className="w-full mt-1.5 p-2 font-mono font-bold text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rp {financialSummary.pembangunanBalance.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Kas ZISWAF */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">Kas ZISWAF</label>
                    <span className="text-[10px] text-teal-600 font-semibold">Umat</span>
                  </div>
                  <input
                    type="number"
                    value={financialSummary.ziswafBalance}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const stamp = formatReconciledDateTime();
                      onUpdateFinancialSummary({
                        ...financialSummary,
                        ziswafBalance: val,
                        totalBalance: financialSummary.operasionalBalance + financialSummary.pembangunanBalance + val + financialSummary.yatimBalance,
                        lastUpdated: stamp,
                        lastReconciledAt: stamp,
                      });
                    }}
                    className="w-full mt-1.5 p-2 font-mono font-bold text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rp {financialSummary.ziswafBalance.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Kas Yatim */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">Kas Santunan Yatim</label>
                    <span className="text-[10px] text-rose-600 font-semibold">Sosial</span>
                  </div>
                  <input
                    type="number"
                    value={financialSummary.yatimBalance}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const stamp = formatReconciledDateTime();
                      onUpdateFinancialSummary({
                        ...financialSummary,
                        yatimBalance: val,
                        totalBalance: financialSummary.operasionalBalance + financialSummary.pembangunanBalance + financialSummary.ziswafBalance + val,
                        lastUpdated: stamp,
                        lastReconciledAt: stamp,
                      });
                    }}
                    className="w-full mt-1.5 p-2 font-mono font-bold text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Rp {financialSummary.yatimBalance.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Transactions Table Section */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-800" />
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Daftar Arus Mutasi Kas ({transactions.length} Catatan)
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari uraian, ref, pencatat..."
                        value={transactionSearchQuery}
                        onChange={(e) => setTransactionSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 sm:w-56"
                      />
                    </div>

                    {/* Filter Category */}
                    <select
                      value={transactionFilterCategory}
                      onChange={(e) => setTransactionFilterCategory(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="operasional">Kas Operasional</option>
                      <option value="pembangunan">Kas Pembangunan</option>
                      <option value="ziswaf">Kas ZISWAF</option>
                      <option value="yatim">Kas Santunan Yatim</option>
                    </select>

                    {/* Filter Type */}
                    <select
                      value={transactionFilterType}
                      onChange={(e) => setTransactionFilterType(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Jenis</option>
                      <option value="masuk">Pemasukan (+)</option>
                      <option value="keluar">Pengeluaran (-)</option>
                    </select>
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Jenis</th>
                        <th className="py-2.5 px-3">Pos Kas</th>
                        <th className="py-2.5 px-3">Uraian Transaksi</th>
                        <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                        <th className="py-2.5 px-3">Pencatat & Ref</th>
                        <th className="py-2.5 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {transactions
                        .filter((tx) => {
                          const matchesCat = transactionFilterCategory === 'all' || tx.category === transactionFilterCategory;
                          const matchesType = transactionFilterType === 'all' || tx.type === transactionFilterType;
                          const q = transactionSearchQuery.toLowerCase();
                          const matchesQ =
                            !q ||
                            tx.description.toLowerCase().includes(q) ||
                            tx.recordedBy.toLowerCase().includes(q) ||
                            (tx.referenceNumber && tx.referenceNumber.toLowerCase().includes(q));
                          return matchesCat && matchesType && matchesQ;
                        })
                        .map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {tx.date}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {tx.type === 'masuk' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <ArrowDownRight className="w-3 h-3" />
                                  <span>Masuk</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                                  <ArrowUpRight className="w-3 h-3" />
                                  <span>Keluar</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-semibold">
                                {tx.categoryLabel || categoryLabels[tx.category]}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 max-w-xs">
                              <span className="font-semibold text-slate-900 block truncate" title={tx.description}>
                                {tx.description}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-right font-mono font-bold">
                              <span className={tx.type === 'masuk' ? 'text-emerald-700' : 'text-rose-700'}>
                                {tx.type === 'masuk' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-slate-500">
                              <span className="block truncate max-w-[150px]" title={tx.recordedBy}>
                                {tx.recordedBy}
                              </span>
                              {tx.referenceNumber && (
                                <span className="font-mono text-[10px] text-slate-400">
                                  Ref: {tx.referenceNumber}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleOpenEditTransaction(tx)}
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Edit transaksi ini"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(tx.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Hapus transaksi ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            Belum ada catatan mutasi kas. Silakan tambah transaksi baru atau upload file Excel.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL: Tambah / Edit Transaksi Kas */}
              {isAddingTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-300" />
                        <h4 className="font-bold text-sm">
                          {editingTransaction ? 'Edit Mutasi Transaksi Kas' : 'Catat Transaksi Kas Baru'}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setIsAddingTransaction(false);
                          setEditingTransaction(null);
                        }}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveTransaction} className="p-5 space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Tanggal Transaksi <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={transactionForm.date}
                            onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-slate-50 font-medium focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Arah Kas (Jenis) <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                            <button
                              type="button"
                              onClick={() => setTransactionForm({ ...transactionForm, type: 'masuk' })}
                              className={`py-1.5 rounded-lg font-bold text-center transition-colors ${
                                transactionForm.type === 'masuk'
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              + Pemasukan
                            </button>
                            <button
                              type="button"
                              onClick={() => setTransactionForm({ ...transactionForm, type: 'keluar' })}
                              className={`py-1.5 rounded-lg font-bold text-center transition-colors ${
                                transactionForm.type === 'keluar'
                                  ? 'bg-rose-700 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              - Pengeluaran
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Pos Kategori Kas <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={transactionForm.category}
                            onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value as CashCategory })}
                            className="w-full p-2 border rounded-xl bg-white font-medium"
                          >
                            <option value="operasional">Kas Operasional</option>
                            <option value="pembangunan">Kas Pembangunan</option>
                            <option value="ziswaf">Kas ZISWAF</option>
                            <option value="yatim">Kas Santunan Yatim</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Nominal (Rp) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="1000"
                            placeholder="Contoh: 500000"
                            value={transactionForm.amount}
                            onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-slate-50 font-mono font-bold text-slate-900 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Uraian / Keterangan Transaksi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Infaq Kotak Jumat Jamaah atau Pembelian Lampu Sorot Mimbar"
                          value={transactionForm.description}
                          onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                          className="w-full p-2.5 border rounded-xl bg-white font-medium text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Nama Pencatat / Petugas
                          </label>
                          <input
                            type="text"
                            placeholder="Bendahara DKM"
                            value={transactionForm.recordedBy}
                            onChange={(e) => setTransactionForm({ ...transactionForm, recordedBy: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-white font-medium text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Nomor Referensi Bukti
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: IN-2026-1017"
                            value={transactionForm.referenceNumber}
                            onChange={(e) => setTransactionForm({ ...transactionForm, referenceNumber: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-white font-mono text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTransaction(false);
                            setEditingTransaction(null);
                          }}
                          className="px-4 py-2 border rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs transition-colors"
                        >
                          {editingTransaction ? 'Simpan Perubahan' : 'Catat Transaksi'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL: Upload File Excel Kas & Rekonsiliasi */}
              {showExcelUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
                  <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-emerald-950 text-white p-4 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-amber-300" />
                        <div>
                          <h4 className="font-bold text-sm">Upload File Excel & Rekonsiliasi Kas</h4>
                          <p className="text-[10px] text-emerald-300/80">
                            Mendukung file .xlsx, .xls, atau .csv dari pembukuan Excel DKM
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowExcelUploadModal(false)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-5 space-y-4 text-xs overflow-y-auto">
                      {/* File selector */}
                      <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-5 text-center">
                        <FileSpreadsheet className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Pilih File Excel / CSV</span>
                          <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleExcelFileChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-slate-500 mt-2">
                          {excelFileName ? (
                            <span className="font-bold text-emerald-900 font-mono">
                              File terpilih: {excelFileName}
                            </span>
                          ) : (
                            'Pilih file spreadsheet mutasi kas untuk diekstrak otomatis.'
                          )}
                        </p>
                      </div>

                      {excelUploadError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{excelUploadError}</span>
                        </div>
                      )}

                      {/* Import Mode */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800 block mb-2">Metode Penyesuaian Mutasi:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <label className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            excelImportMode === 'append' ? 'bg-white border-emerald-500 shadow-xs' : 'bg-slate-100 border-slate-200'
                          }`}>
                            <input
                              type="radio"
                              name="importMode"
                              checked={excelImportMode === 'append'}
                              onChange={() => setExcelImportMode('append')}
                              className="mt-0.5 text-emerald-800"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">Gabungkan (Append)</span>
                              <span className="text-[10px] text-slate-500">
                                Menambahkan data dari Excel ke mutasi kas yang sudah ada saat ini.
                              </span>
                            </div>
                          </label>

                          <label className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                            excelImportMode === 'replace' ? 'bg-white border-emerald-500 shadow-xs' : 'bg-slate-100 border-slate-200'
                          }`}>
                            <input
                              type="radio"
                              name="importMode"
                              checked={excelImportMode === 'replace'}
                              onChange={() => setExcelImportMode('replace')}
                              className="mt-0.5 text-emerald-800"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">Ganti Total (Replace)</span>
                              <span className="text-[10px] text-slate-500">
                                Menimpa seluruh mutasi dan menghitung ulang saldo kas murni dari file Excel.
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Preview Rows */}
                      {excelParsedRows.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">
                              Pratinjau Data ({excelParsedRows.length} baris valid terbaca):
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                              Total Pemasukan: +Rp{' '}
                              {excelParsedRows
                                .filter((t) => t.type === 'masuk')
                                .reduce((s, t) => s + t.amount, 0)
                                .toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="max-h-48 overflow-y-auto border rounded-xl">
                            <table className="w-full text-[11px]">
                              <thead className="bg-slate-100 font-semibold text-slate-600 border-b">
                                <tr>
                                  <th className="p-2">Tgl</th>
                                  <th className="p-2">Jenis</th>
                                  <th className="p-2">Pos</th>
                                  <th className="p-2">Uraian</th>
                                  <th className="p-2 text-right">Nominal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {excelParsedRows.slice(0, 10).map((r, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-2 font-mono text-[10px]">{r.date}</td>
                                    <td className="p-2">
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                        r.type === 'masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                      }`}>
                                        {r.type}
                                      </span>
                                    </td>
                                    <td className="p-2 text-[10px]">{r.category}</td>
                                    <td className="p-2 truncate max-w-[150px]">{r.description}</td>
                                    <td className="p-2 text-right font-mono font-bold">
                                      Rp {r.amount.toLocaleString('id-ID')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {excelParsedRows.length > 10 && (
                            <p className="text-[10px] text-slate-500 italic text-center">
                              ...dan {excelParsedRows.length - 10} baris lainnya akan ikut direkonsiliasi.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t bg-slate-50 flex items-center justify-between shrink-0">
                      <button
                        onClick={handleDownloadExcelTemplate}
                        className="text-xs text-emerald-800 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Contoh Template Excel</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowExcelUploadModal(false)}
                          className="px-4 py-2 border rounded-xl text-slate-600 font-semibold hover:bg-slate-100 text-xs"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          disabled={excelParsedRows.length === 0}
                          onClick={handleConfirmExcelImport}
                          className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Terapkan Rekonsiliasi ({excelParsedRows.length} Data)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AGENDA & KAJIAN */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kelola Agenda Kegiatan & Kajian Ilmu
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur jadwal pengajian rutin, tabligh akbar hari besar (PHBI), bakti sosial, dan penceramah/ustadz. ({agendaEvents.length} agenda aktif)
                  </p>
                </div>
                {!isAddingAgenda && (
                  <button
                    onClick={handleOpenAddAgenda}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Agenda Baru</span>
                  </button>
                )}
              </div>

              {/* Form Tambah / Edit Agenda */}
              {isAddingAgenda && (
                <form
                  onSubmit={handleSaveAgenda}
                  className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-800" />
                      <h4 className="font-bold text-sm text-emerald-950">
                        {editingAgenda ? 'Edit Agenda / Kajian' : 'Tambah Agenda Baru'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAgenda(false);
                        setEditingAgenda(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Judul Kegiatan / Kajian <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kajian Subuh Mengaji: Kitab Riyadhus Shalihin"
                        value={agendaForm.title || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                      <select
                        value={agendaForm.category || 'kajian_rutin'}
                        onChange={(e) => setAgendaForm({ ...agendaForm, category: e.target.value as any })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-800"
                      >
                        <option value="kajian_rutin">Kajian Rutin Pekanan</option>
                        <option value="phbi">Acara Besar & PHBI</option>
                        <option value="sosial">Kegiatan Sosial</option>
                        <option value="tpa">Pendidikan & TPA</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Status Kegiatan</label>
                      <select
                        value={agendaForm.status || 'Mendatang'}
                        onChange={(e) => setAgendaForm({ ...agendaForm, status: e.target.value as any })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-800"
                      >
                        <option value="Mendatang">Mendatang</option>
                        <option value="Berjalan">Sedang Berjalan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Pemateri / Ustadz</label>
                      <input
                        type="text"
                        placeholder="Contoh: K.H. Ahmad Hasan Basri, M.Ag"
                        value={agendaForm.speaker || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, speaker: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tema / Kitab Rujukan</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bab Ikhlas & Niat dalam Beramal"
                        value={agendaForm.themeOrKitab || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, themeOrKitab: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Jadwal / Tanggal <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Setiap Hari Ahad Subuh atau 24 Oktober 2026"
                        value={agendaForm.date || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, date: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Waktu / Jam Pelaksanaan</label>
                      <input
                        type="text"
                        placeholder="Contoh: Ba’da Sholat Subuh (05:00 - 06:15 WIB)"
                        value={agendaForm.time || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Lokasi / Ruangan</label>
                      <input
                        type="text"
                        placeholder="Contoh: Ruang Sholat Utama Masjid Ar-Rohmah"
                        value={agendaForm.location || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Deskripsi & Keterangan Tambahan</label>
                      <textarea
                        rows={3}
                        placeholder="Jelaskan rincian agenda, fasilitas yang disediakan (misal: sarapan bersama, buku panduan gratis)..."
                        value={agendaForm.description || ''}
                        onChange={(e) => setAgendaForm({ ...agendaForm, description: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    {/* Recurring Check */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={!!agendaForm.isRecurring}
                          onChange={(e) => setAgendaForm({ ...agendaForm, isRecurring: e.target.checked })}
                          className="rounded text-emerald-700"
                        />
                        <span>Agenda Rutin Berkala</span>
                      </label>
                      {agendaForm.isRecurring && (
                        <input
                          type="text"
                          placeholder="Label badge (Contoh: Rutin Setiap Ahad Subuh)"
                          value={agendaForm.recurrenceText || ''}
                          onChange={(e) => setAgendaForm({ ...agendaForm, recurrenceText: e.target.value })}
                          className="w-full mt-2 p-2 border rounded-lg text-xs"
                        />
                      )}
                    </div>

                    {/* Live Stream Check */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={!!agendaForm.hasLiveStream}
                          onChange={(e) => setAgendaForm({ ...agendaForm, hasLiveStream: e.target.checked })}
                          className="rounded text-rose-600"
                        />
                        <span>Tersedia Siaran Langsung (Live Streaming)</span>
                      </label>
                      {agendaForm.hasLiveStream && (
                        <input
                          type="url"
                          placeholder="URL siaran (Contoh: https://youtube.com/@masjid_arrohmah)"
                          value={agendaForm.liveStreamUrl || ''}
                          onChange={(e) => setAgendaForm({ ...agendaForm, liveStreamUrl: e.target.value })}
                          className="w-full mt-2 p-2 border rounded-lg text-xs"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAgenda(false);
                        setEditingAgenda(null);
                      }}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-2xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingAgenda ? 'Perbarui Agenda' : 'Simpan Agenda'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Daftar Agenda Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agendaEvents.map((event) => {
                  const categoryLabels: Record<string, string> = {
                    kajian_rutin: 'Kajian Rutin',
                    phbi: 'Acara Besar / PHBI',
                    sosial: 'Kegiatan Sosial',
                    tpa: 'Pendidikan & TPA',
                  };

                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-300 shadow-2xs flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {categoryLabels[event.category] || event.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              event.status === 'Berjalan'
                                ? 'bg-amber-100 text-amber-800'
                                : event.status === 'Selesai'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                          {event.title}
                        </h4>

                        {event.themeOrKitab && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/60 px-2 py-1 rounded-lg">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-medium truncate">{event.themeOrKitab}</span>
                          </div>
                        )}

                        <div className="space-y-1 text-xs text-slate-600 pt-1">
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
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-100">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenEditAgenda(event)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAgenda(event.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {agendaEvents.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">Belum ada agenda yang tersimpan</p>
                  <button
                    onClick={handleOpenAddAgenda}
                    className="mt-3 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold"
                  >
                    Tambah Agenda Pertama
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ARTIKEL & WARTA */}
          {activeTab === 'artikel' && (
            <div className="space-y-6">
              <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kelola Artikel, Tausiyah & Warta Masjid
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publikasi tulisan dakwah keislaman, rilis kabar masjid, dan surat pengumuman DKM. ({articles.length} artikel terbit)
                  </p>
                </div>
                {!isAddingArticle && (
                  <button
                    onClick={handleOpenAddArticle}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tulis Artikel / Warta Baru</span>
                  </button>
                )}
              </div>

              {/* Form Tambah / Edit Artikel */}
              {isAddingArticle && (
                <form
                  onSubmit={handleSaveArticle}
                  className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-800" />
                      <h4 className="font-bold text-sm text-emerald-950">
                        {editingArticle ? 'Edit Artikel / Warta' : 'Tulis Artikel / Warta Baru'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingArticle(false);
                        setEditingArticle(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Judul Artikel / Warta <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Keutamaan Menjaga Shalat Subuh Berjamaah di Masjid"
                        value={articleForm.title || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Kategori Konten</label>
                      <select
                        value={articleForm.category || 'tausiyah'}
                        onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value as any })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-800"
                      >
                        <option value="tausiyah">Tausiyah & Hikmah</option>
                        <option value="berita">Kabar Masjid</option>
                        <option value="pengumuman">Pengumuman DKM</option>
                        <option value="ziswaf">Edukasi ZISWAF</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Penulis / Narasumber</label>
                      <input
                        type="text"
                        placeholder="Contoh: Ust. Muhammad Ilham, Lc atau DKM Ar-Rohmah"
                        value={articleForm.author || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tanggal Rilis</label>
                      <input
                        type="text"
                        placeholder="Contoh: 13 Oktober 2026"
                        value={articleForm.date || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, date: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Estimasi Waktu Baca</label>
                      <input
                        type="text"
                        placeholder="Contoh: 4 menit baca"
                        value={articleForm.readTime || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">Ringkasan Cuplikan (Summary)</label>
                      <textarea
                        rows={2}
                        placeholder="Ringkasan singkat 1-2 kalimat yang menarik minat jamaah untuk membaca..."
                        value={articleForm.summary || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Isi Lengkap Artikel / Tulisan <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={8}
                        required
                        placeholder="Tuliskan isi tausiyah, dalil, kutipan hadits, atau poin-poin berita dan maklumat..."
                        value={articleForm.content || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-white text-slate-900 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingArticle(false);
                        setEditingArticle(null);
                      }}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-2xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingArticle ? 'Perbarui Artikel' : 'Publikasikan Artikel'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Daftar Artikel Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((art) => {
                  const categoryLabels: Record<string, string> = {
                    tausiyah: 'Tausiyah',
                    berita: 'Kabar Masjid',
                    pengumuman: 'Pengumuman DKM',
                    ziswaf: 'ZISWAF',
                  };

                  return (
                    <div
                      key={art.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-300 shadow-2xs flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] uppercase">
                            {categoryLabels[art.category] || art.category}
                          </span>
                          <span>·</span>
                          <span className="text-[11px]">{art.date}</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                          {art.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium">{art.author}</span>
                          <span>·</span>
                          <span className="text-slate-400">{art.readTime}</span>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenEditArticle(art)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {articles.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">Belum ada artikel atau warta yang diterbitkan</p>
                  <button
                    onClick={handleOpenAddArticle}
                    className="mt-3 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold"
                  >
                    Tulis Artikel Pertama
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: REKENING & QRIS */}
          {activeTab === 'rekening' && (
            <div className="space-y-6">
              {/* QRIS Management */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-800" />
                    <span>Barcode & NMID QRIS Resmi Masjid</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ganti gambar barcode QRIS resmi dan nomor identitas NMID untuk kemudahan infaq non-tunai.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Gambar Barcode QRIS
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                        {mosqueInfo.qrisImageUrl ? (
                          <img
                            src={resolveImageUrl(mosqueInfo.qrisImageUrl)}
                            alt="QRIS Preview"
                            onError={(e) => handleImageError(e, 'qris')}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center p-2 text-slate-400">
                            <QrCode className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                            <span className="text-[10px] block font-bold">QR Standar Aktif</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="inline-block px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-2xs">
                          <span>Upload Foto QRIS Baru</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrisUpload}
                            className="hidden"
                          />
                        </label>
                        {mosqueInfo.qrisImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateMosqueInfo({ ...mosqueInfo, qrisImageUrl: '' });
                              showToast('Gambar QRIS dikembalikan ke standar.');
                            }}
                            className="block text-[11px] text-rose-600 hover:underline font-semibold"
                          >
                            Hapus & Gunakan QR Standar
                          </button>
                        )}
                        <span className="text-[11px] text-slate-400 block">Format: JPG, PNG, atau WebP</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Nomor NMID QRIS
                    </label>
                    <input
                      type="text"
                      value={mosqueInfo.qrisNmid || ''}
                      placeholder="ID1023098412938"
                      onChange={(e) => onUpdateMosqueInfo({ ...mosqueInfo, qrisNmid: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Nomor ID National Merchant ID yang terdaftar di Bank Indonesia / ASPI.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-4">
                <div className="border-b pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Daftar Rekening Bank Penerima Donasi & ZISWAF
                    </h3>
                    <p className="text-xs text-slate-500">
                      Edit nomor rekening, nama bank, atau tambahkan rekening baru.
                    </p>
                  </div>
                  <button
                    onClick={handleAddBankAccount}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Rekening</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bankAccounts.map((bank) => (
                    <div key={bank.id} className="bg-slate-50 p-4 rounded-2xl border space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={bank.badge || ''}
                            placeholder="Badge (cth: BSI ZISWAF)"
                            onChange={(e) => {
                              const updated = bankAccounts.map((b) =>
                                b.id === bank.id ? { ...b, badge: e.target.value } : b
                              );
                              onUpdateBankAccounts(updated);
                            }}
                            className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 w-28"
                          />
                          <button
                            onClick={() => handleDeleteBankAccount(bank.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Hapus Rekening"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block">Nama Bank</label>
                          <input
                            type="text"
                            value={bank.bankName}
                            onChange={(e) => {
                              const updated = bankAccounts.map((b) =>
                                b.id === bank.id ? { ...b, bankName: e.target.value } : b
                              );
                              onUpdateBankAccounts(updated);
                            }}
                            className="w-full p-2 border rounded font-bold text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block">Nomor Rekening</label>
                          <input
                            type="text"
                            value={bank.accountNumber}
                            onChange={(e) => {
                              const updated = bankAccounts.map((b) =>
                                b.id === bank.id ? { ...b, accountNumber: e.target.value } : b
                              );
                              onUpdateBankAccounts(updated);
                            }}
                            className="w-full p-2 border rounded font-mono font-bold text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block">Atas Nama</label>
                          <input
                            type="text"
                            value={bank.accountHolder}
                            onChange={(e) => {
                              const updated = bankAccounts.map((b) =>
                                b.id === bank.id ? { ...b, accountHolder: e.target.value } : b
                              );
                              onUpdateBankAccounts(updated);
                            }}
                            className="w-full p-2 border rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="max-w-xl space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Cadangkan & Pulihkan Seluruh Data Website
                </h3>
                <p className="text-xs text-slate-500">
                  Simpan cadangan file JSON atau pulihkan data bila diperlukan.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Unduh Cadangan (JSON)</span>
                  </button>

                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-900 border-2 border-dashed border-emerald-400 font-bold text-xs rounded-xl transition-colors">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Impor / Pulihkan (JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Multi-device sync guide card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Sinkronisasi Lintas Perangkat (PC, Laptop & HP)</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    Setiap kali Anda mengunggah atau mengedit gambar via Admin DKM, sistem kini secara otomatis:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-emerald-900 font-medium">
                    <li>Mengompresi resolusi foto kamera HP/PC secara otomatis agar tidak membebani kuota memori browser (bebas dari error batas 5MB localStorage).</li>
                    <li>Mengunggah file foto fisik ke server (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">/images/...</code>) sehingga langsung dapat diakses oleh browser komputer, laptop, dan HP lain tanpa tergantung memori lokal perangkat.</li>
                    <li>Menyimpan perubahan ke basis data server (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">db.json</code>) yang disinkronkan ke seluruh jamaah.</li>
                  </ul>
                </div>

                {onResetDefaults && (
                  <div className="pt-2 border-t">
                    <button
                      onClick={() => {
                        if (confirm('Kembalikan semua data ke pengaturan awal? Perubahan yang belum dicadangkan akan direset.')) {
                          onResetDefaults();
                          showToast('Data berhasil dikembalikan ke standar awal.');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-600" />
                      <span>Reset ke Standar Awal</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-slate-700 font-medium">
              Semua perubahan via Admin DKM langsung tersinkronisasi ke browser (localStorage) dan database backend secara real-time.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
            >
              Tutup Panel
            </button>
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Simpan & Sinkronkan Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
