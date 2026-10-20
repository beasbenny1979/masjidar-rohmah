import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PrayerSection } from './components/PrayerSection';
import { VisionMissionSection } from './components/VisionMissionSection';
import { GallerySection } from './components/GallerySection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { ProfileSection } from './components/ProfileSection';
import { FinancialSection } from './components/FinancialSection';
import { AgendaSection } from './components/AgendaSection';
import { DonationSection } from './components/DonationSection';
import { ArticlesSection } from './components/ArticlesSection';
import { ContactSection } from './components/ContactSection';
import { MosqueTVMode } from './components/MosqueTVMode';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import {
  MOSQUE_INFO,
  COMMITTEE_MEMBERS,
  INITIAL_MOSQUE_IMAGES,
  INITIAL_FINANCIAL_SUMMARY,
  INITIAL_TRANSACTIONS,
  INITIAL_FRIDAY_OFFICERS,
  AGENDA_EVENTS,
  ARTICLES_DATA,
  BANK_ACCOUNTS,
  MOSQUE_FACILITIES,
} from './data/mockData';
import {
  calculatePrayerTimes,
  getUpcomingPrayerInfo,
  getHijriDate,
} from './utils/prayerTimes';
import {
  MosqueInfo,
  CommitteeMember,
  MosqueImage,
  FridayOfficer,
  FinancialTransaction,
  FinancialSummary,
  AgendaEvent,
  Article,
  BankAccount,
  MosqueFacility,
} from './types';

const filterOnlyCoreLeaders = (list: CommitteeMember[]): CommitteeMember[] => {
  if (!Array.isArray(list) || list.length === 0) return COMMITTEE_MEMBERS;
  const filtered = list.filter((m) => {
    const r = (m.role || '').toLowerCase();
    const n = (m.name || '').toLowerCase();
    return (
      r.includes('pelindung') ||
      r.includes('ketua') ||
      r.includes('bendahara') ||
      n.includes('rafiudin') ||
      n.includes('adih') ||
      n.includes('heri')
    );
  });
  return filtered.length > 0 ? filtered.slice(0, 3) : COMMITTEE_MEMBERS;
};

export default function App() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [tvModeOpen, setTvModeOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('beranda');

  // 1. Mosque Info & Wording
  const [mosqueInfo, setMosqueInfo] = useState<MosqueInfo>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_mosque_info');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOSQUE_INFO;
  });

  // 2. Committee Members (Pengurus DKM - Hanya Pelindung, Ketua, dan Bendahara)
  const [members, setMembers] = useState<CommitteeMember[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_members');
      if (saved) return filterOnlyCoreLeaders(JSON.parse(saved));
    } catch {}
    return COMMITTEE_MEMBERS;
  });

  // 3. Mosque Gallery Images
  const [galleryImages, setGalleryImages] = useState<MosqueImage[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_gallery_images');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MOSQUE_IMAGES;
  });

  // 4. Friday Officers
  const [fridayOfficers, setFridayOfficers] = useState<FridayOfficer[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_friday_officers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FRIDAY_OFFICERS;
  });

  // 5. Financial Summary & Transactions (Mulai dari 0)
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_financial_summary');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.totalBalance === 64750000) {
          localStorage.setItem('arrohmah_financial_summary', JSON.stringify(INITIAL_FINANCIAL_SUMMARY));
          return INITIAL_FINANCIAL_SUMMARY;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_FINANCIAL_SUMMARY;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id === 'tx-01') {
          localStorage.setItem('arrohmah_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
          return INITIAL_TRANSACTIONS;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  // 6. Agenda Events
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_agenda_events');
      if (saved) return JSON.parse(saved);
    } catch {}
    return AGENDA_EVENTS;
  });

  // 7. Articles & News
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_articles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ARTICLES_DATA;
  });

  // 8. Bank Accounts & QRIS
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_bank_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return BANK_ACCOUNTS;
  });

  // 9. Facilities (Fasilitas Masjid Ar-Rohmah)
  const [facilities, setFacilities] = useState<MosqueFacility[]>(() => {
    try {
      const saved = localStorage.getItem('arrohmah_facilities');
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOSQUE_FACILITIES;
  });

  // Keep a mutable ref of current full state to prevent any stale closure issues
  const stateRef = useRef({
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
  });

  useEffect(() => {
    stateRef.current = {
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
    };
  }, [
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
  ]);

  // Persist full state to browser localStorage and backend
  const saveAllToBackend = useCallback(async () => {
    const currentState = stateRef.current;
    const nowIso = new Date().toISOString();
    const payload = {
      ...currentState,
      savedAt: nowIso,
    };

    // 1. Immediately save to browser localStorage
    try {
      localStorage.setItem('arrohmah_mosque_info', JSON.stringify(currentState.mosqueInfo));
      localStorage.setItem('arrohmah_members', JSON.stringify(currentState.members));
      localStorage.setItem('arrohmah_gallery_images', JSON.stringify(currentState.galleryImages));
      localStorage.setItem('arrohmah_friday_officers', JSON.stringify(currentState.fridayOfficers));
      localStorage.setItem('arrohmah_financial_summary', JSON.stringify(currentState.financialSummary));
      localStorage.setItem('arrohmah_transactions', JSON.stringify(currentState.transactions));
      localStorage.setItem('arrohmah_agenda_events', JSON.stringify(currentState.agendaEvents));
      localStorage.setItem('arrohmah_articles', JSON.stringify(currentState.articles));
      localStorage.setItem('arrohmah_bank_accounts', JSON.stringify(currentState.bankAccounts));
      localStorage.setItem('arrohmah_facilities', JSON.stringify(currentState.facilities));
      localStorage.setItem('arrohmah_last_saved', nowIso);
    } catch {}

    // 2. Persist to Express backend file database (db.json)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': 'mjdarrohmah@gmail.com',
        },
        body: JSON.stringify({ ...payload, adminEmail: 'mjdarrohmah@gmail.com' }),
      });
    } catch (e) {
      console.warn('Backend API sync notice:', e);
    }
  }, []);

  // Debounced auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveAllToBackend();
    }, 600);
  }, [saveAllToBackend]);

  // Multi-tab sync: Listen to changes made in other browser tabs or windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      try {
        const val = JSON.parse(e.newValue);
        if (e.key === 'arrohmah_mosque_info') setMosqueInfo(val);
        if (e.key === 'arrohmah_members') setMembers(filterOnlyCoreLeaders(val));
        if (e.key === 'arrohmah_gallery_images') setGalleryImages(val);
        if (e.key === 'arrohmah_friday_officers') setFridayOfficers(val);
        if (e.key === 'arrohmah_financial_summary') setFinancialSummary(val);
        if (e.key === 'arrohmah_transactions') setTransactions(val);
        if (e.key === 'arrohmah_agenda_events') setAgendaEvents(val);
        if (e.key === 'arrohmah_articles') setArticles(val);
        if (e.key === 'arrohmah_bank_accounts') setBankAccounts(val);
        if (e.key === 'arrohmah_facilities') setFacilities(val);
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Multi-device backend sync function
  const syncFromBackend = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const localSavedAt = localStorage.getItem('arrohmah_last_saved');

        // Apply backend data when opening on another device (PC, laptop, HP) or if backend is newer
        if (d.savedAt) {
          if (!localSavedAt || new Date(d.savedAt).getTime() >= new Date(localSavedAt).getTime()) {
            if (d.mosqueInfo) {
              setMosqueInfo(d.mosqueInfo);
              try { localStorage.setItem('arrohmah_mosque_info', JSON.stringify(d.mosqueInfo)); } catch {}
            }
            if (d.members) {
              const filtered = filterOnlyCoreLeaders(d.members);
              setMembers(filtered);
              try { localStorage.setItem('arrohmah_members', JSON.stringify(filtered)); } catch {}
            }
            if (d.galleryImages) {
              setGalleryImages(d.galleryImages);
              try { localStorage.setItem('arrohmah_gallery_images', JSON.stringify(d.galleryImages)); } catch {}
            }
            if (d.fridayOfficers) {
              setFridayOfficers(d.fridayOfficers);
              try { localStorage.setItem('arrohmah_friday_officers', JSON.stringify(d.fridayOfficers)); } catch {}
            }
            if (d.financialSummary) {
              setFinancialSummary(d.financialSummary);
              try { localStorage.setItem('arrohmah_financial_summary', JSON.stringify(d.financialSummary)); } catch {}
            }
            if (d.transactions) {
              setTransactions(d.transactions);
              try { localStorage.setItem('arrohmah_transactions', JSON.stringify(d.transactions)); } catch {}
            }
            if (d.agendaEvents) {
              setAgendaEvents(d.agendaEvents);
              try { localStorage.setItem('arrohmah_agenda_events', JSON.stringify(d.agendaEvents)); } catch {}
            }
            if (d.articles) {
              setArticles(d.articles);
              try { localStorage.setItem('arrohmah_articles', JSON.stringify(d.articles)); } catch {}
            }
            if (d.bankAccounts) {
              setBankAccounts(d.bankAccounts);
              try { localStorage.setItem('arrohmah_bank_accounts', JSON.stringify(d.bankAccounts)); } catch {}
            }
            if (d.facilities) {
              setFacilities(d.facilities);
              try { localStorage.setItem('arrohmah_facilities', JSON.stringify(d.facilities)); } catch {}
            }
            try { localStorage.setItem('arrohmah_last_saved', d.savedAt); } catch {}
          }
        }
      }
    } catch (e) {
      console.warn('Backend sync check notice:', e);
    }
  }, []);

  // Fetch initial content from backend on mount and sync across devices
  useEffect(() => {
    syncFromBackend();

    // Check for updates whenever user focuses the tab or returns to browser
    const handleFocus = () => syncFromBackend();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromBackend();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Periodic sync poll every 25 seconds for multi-device sync (e.g. PC edits -> phone browser updates)
    const pollTimer = setInterval(() => {
      syncFromBackend();
    }, 25000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(pollTimer);
    };
  }, [syncFromBackend]);

  // Keep live clock running
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['beranda', 'jadwal-salat', 'visi-misi', 'profil', 'galeri', 'fasilitas', 'donasi', 'keuangan', 'agenda', 'berita', 'kontak'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAddTransaction = (newTx: FinancialTransaction) => {
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    try {
      localStorage.setItem('arrohmah_transactions', JSON.stringify(updatedTxs));
    } catch {}

    const delta = newTx.type === 'masuk' ? newTx.amount : -newTx.amount;
    const newSummary: FinancialSummary = {
      ...financialSummary,
      totalBalance: financialSummary.totalBalance + delta,
      totalIncomeThisMonth:
        newTx.type === 'masuk'
          ? financialSummary.totalIncomeThisMonth + newTx.amount
          : financialSummary.totalIncomeThisMonth,
      totalExpenseThisMonth:
        newTx.type === 'keluar'
          ? financialSummary.totalExpenseThisMonth + newTx.amount
          : financialSummary.totalExpenseThisMonth,
      operasionalBalance:
        newTx.category === 'operasional'
          ? financialSummary.operasionalBalance + delta
          : financialSummary.operasionalBalance,
      pembangunanBalance:
        newTx.category === 'pembangunan'
          ? financialSummary.pembangunanBalance + delta
          : financialSummary.pembangunanBalance,
      ziswafBalance:
        newTx.category === 'ziswaf'
          ? financialSummary.ziswafBalance + delta
          : financialSummary.ziswafBalance,
      yatimBalance:
        newTx.category === 'yatim'
          ? financialSummary.yatimBalance + delta
          : financialSummary.yatimBalance,
      lastUpdated: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, Pukul ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
    };

    setFinancialSummary(newSummary);
    try {
      localStorage.setItem('arrohmah_financial_summary', JSON.stringify(newSummary));
    } catch {}
  };

  // Synchronized Update Handlers (React State + localStorage + Auto-Sync Backend)
  const handleUpdateMosqueInfo = (info: MosqueInfo) => {
    setMosqueInfo(info);
    try {
      localStorage.setItem('arrohmah_mosque_info', JSON.stringify(info));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateMembers = (newMembers: CommitteeMember[]) => {
    const filtered = filterOnlyCoreLeaders(newMembers);
    setMembers(filtered);
    try {
      localStorage.setItem('arrohmah_members', JSON.stringify(filtered));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateGalleryImages = (images: MosqueImage[]) => {
    setGalleryImages(images);
    try {
      localStorage.setItem('arrohmah_gallery_images', JSON.stringify(images));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateFridayOfficers = (officers: FridayOfficer[]) => {
    setFridayOfficers(officers);
    try {
      localStorage.setItem('arrohmah_friday_officers', JSON.stringify(officers));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateFinancialSummary = (newSummary: FinancialSummary) => {
    setFinancialSummary(newSummary);
    try {
      localStorage.setItem('arrohmah_financial_summary', JSON.stringify(newSummary));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateTransactions = (newTxs: FinancialTransaction[]) => {
    setTransactions(newTxs);
    try {
      localStorage.setItem('arrohmah_transactions', JSON.stringify(newTxs));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateAgendaEvents = (newEvents: AgendaEvent[]) => {
    setAgendaEvents(newEvents);
    try {
      localStorage.setItem('arrohmah_agenda_events', JSON.stringify(newEvents));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem('arrohmah_articles', JSON.stringify(newArticles));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateBankAccounts = (newAccounts: BankAccount[]) => {
    setBankAccounts(newAccounts);
    try {
      localStorage.setItem('arrohmah_bank_accounts', JSON.stringify(newAccounts));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleUpdateFacilities = (newFacilities: MosqueFacility[]) => {
    setFacilities(newFacilities);
    try {
      localStorage.setItem('arrohmah_facilities', JSON.stringify(newFacilities));
      localStorage.setItem('arrohmah_last_saved', new Date().toISOString());
    } catch {}
    triggerAutoSave();
  };

  const handleResetDefaults = () => {
    setMosqueInfo(MOSQUE_INFO);
    setMembers(COMMITTEE_MEMBERS);
    setGalleryImages(INITIAL_MOSQUE_IMAGES);
    setFridayOfficers(INITIAL_FRIDAY_OFFICERS);
    setFinancialSummary(INITIAL_FINANCIAL_SUMMARY);
    setTransactions(INITIAL_TRANSACTIONS);
    setAgendaEvents(AGENDA_EVENTS);
    setArticles(ARTICLES_DATA);
    setBankAccounts(BANK_ACCOUNTS);
    setFacilities(MOSQUE_FACILITIES);
    localStorage.clear();
    fetch('/api/reset', { method: 'POST' }).catch(() => {});
  };

  // Astronomical calculations for Rangkasbitung
  const prayers = calculatePrayerTimes(currentTime);
  const upcomingInfo = getUpcomingPrayerInfo(prayers, currentTime);
  const hijriDate = getHijriDate(currentTime);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-800 selection:text-amber-200">
      {/* Smart TV Display Mode Modal */}
      {tvModeOpen && (
        <MosqueTVMode
          onClose={() => setTvModeOpen(false)}
          prayers={prayers}
          upcomingInfo={upcomingInfo}
          fridayOfficer={fridayOfficers[0]}
        />
      )}

      {/* Admin Backend Panel Modal */}
      {adminOpen && (
        <AdminPanel
          isOpen={adminOpen}
          onClose={() => {
            saveAllToBackend();
            setAdminOpen(false);
          }}
          mosqueInfo={mosqueInfo}
          onUpdateMosqueInfo={handleUpdateMosqueInfo}
          members={members}
          onUpdateMembers={handleUpdateMembers}
          galleryImages={galleryImages}
          onUpdateGalleryImages={handleUpdateGalleryImages}
          fridayOfficers={fridayOfficers}
          onUpdateFridayOfficers={handleUpdateFridayOfficers}
          financialSummary={financialSummary}
          onUpdateFinancialSummary={handleUpdateFinancialSummary}
          transactions={transactions}
          onUpdateTransactions={handleUpdateTransactions}
          agendaEvents={agendaEvents}
          onUpdateAgendaEvents={handleUpdateAgendaEvents}
          articles={articles}
          onUpdateArticles={handleUpdateArticles}
          bankAccounts={bankAccounts}
          onUpdateBankAccounts={handleUpdateBankAccounts}
          facilities={facilities}
          onUpdateFacilities={handleUpdateFacilities}
          onSaveToBackend={saveAllToBackend}
          onResetDefaults={handleResetDefaults}
        />
      )}

      {/* Main Header / Navigation */}
      <Navbar
        onOpenTvMode={() => setTvModeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        mosqueInfo={mosqueInfo}
      />

      <main>
        {/* Hero Section */}
        <div id="beranda">
          <HeroSection
            onNavigate={handleNavigate}
            prayers={prayers}
            upcomingInfo={upcomingInfo}
            hijriDate={hijriDate}
            mosqueInfo={mosqueInfo}
          />
        </div>

        {/* 1. Jadwal Salat Harian & Jumat */}
        <PrayerSection
          prayers={prayers}
          upcomingInfo={upcomingInfo}
          fridayOfficers={fridayOfficers}
          currentTime={currentTime}
        />

        {/* Visi & Misi Masjid Ar-Rohmah */}
        <VisionMissionSection mosqueInfo={mosqueInfo} />

        {/* 2. Profil dan Sejarah Masjid + Struktur Pengurus */}
        <ProfileSection
          members={members}
          mosqueInfo={mosqueInfo}
        />

        {/* Gallery: Galeri Foto Masjid Ar-Rohmah (Dipindahkan ke atas Fasilitas) */}
        <GallerySection
          images={galleryImages}
        />

        {/* Fasilitas Masjid Ar-Rohmah */}
        <FacilitiesSection
          facilities={facilities}
        />

        {/* Layanan Infaq, Sedekah, Zakat & Wakaf (Donasi & ZISWAF) */}
        <DonationSection
          bankAccounts={bankAccounts}
          mosqueInfo={mosqueInfo}
        />

        {/* Laporan Keuangan & Kas Masjid Transparan */}
        <FinancialSection
          summary={financialSummary}
          transactions={transactions}
          members={members}
          mosqueInfo={mosqueInfo}
        />

        {/* Agenda Kegiatan dan Kajian */}
        <AgendaSection events={agendaEvents} />

        {/* 7. Artikel dan Berita Islami */}
        <ArticlesSection articles={articles} />

        {/* 6. Kontak dan Lokasi */}
        <ContactSection
          mosqueInfo={mosqueInfo}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTvMode={() => setTvModeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        mosqueInfo={mosqueInfo}
      />
    </div>
  );
}
