import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Database,
  DollarSign,
  Download,
  Edit3,
  ExternalLink,
  Lightbulb,
  Lock,
  LogOut,
  Mail,
  Plus,
  Rocket,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { ADMIN_EMAIL, auth, googleProvider } from '../firebase';
import {
  fetchSubscribers,
  removeBook,
  removeInsight,
  removeSubscriber,
  saveAdSetting,
  saveBook,
  saveInsight,
  seedStarterContent,
} from '../services/firestoreService';
import {
  AdSetting,
  AdSlotKey,
  BOOK_CATEGORIES,
  Book,
  BookCategory,
  CoverStyle,
  Insight,
  InsightType,
  Subscriber,
} from '../types';
import { BrandLogo } from './BrandLogo';

interface AdminPanelProps {
  books: Book[];
  insights: Insight[];
  adSettings: Record<AdSlotKey, AdSetting>;
  onBackToSite: () => void;
}

type AdminTab = 'books' | 'ads' | 'insights' | 'subscribers' | 'deploy';

const COVER_PRESETS: Array<{ value: CoverStyle; label: string; url: string }> = [
  {
    value: 'custom',
    label: 'Classic Monograph / Custom Cover URL',
    url: '',
  },
  {
    value: 'gita',
    label: 'Bhagavad Gita Golden Artwork',
    url: '/src/assets/images/cover_bhagavad_gita_1795361233599.jpg',
  },
  {
    value: 'essentialism',
    label: 'Minimalist Ink Ring (Essentialism style)',
    url: '',
  },
  {
    value: 'meditations',
    label: 'Classical Marble Bust (Meditations style)',
    url: '/src/assets/images/cover_meditations_1795361233542.jpg',
  },
  {
    value: 'meaning',
    label: 'Dawn Horizon Trail (Man’s Search style)',
    url: '/src/assets/images/cover_mans_search_1795361233510.jpg',
  },
  {
    value: 'atomic',
    label: 'Warm Cream Gold Burst (Atomic Habits style)',
    url: '',
  },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  books,
  insights,
  adSettings,
  onBackToSite,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('books');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  // Book form state
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<BookCategory>('Philosophy');
  const [coverStyle, setCoverStyle] = useState<CoverStyle>('custom');
  const [coverUrl, setCoverUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [readTime, setReadTime] = useState('10 min read');
  const [quote, setQuote] = useState('');
  const [summary, setSummary] = useState('');
  const [takeawaysText, setTakeawaysText] = useState('');
  const [featured, setFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(books.length + 1);

  // Insight form state
  const [editingInsightId, setEditingInsightId] = useState<string | null>(null);
  const [insightTitle, setInsightTitle] = useState('');
  const [insightType, setInsightType] = useState<InsightType>('shloka');
  const [insightSource, setInsightSource] = useState('');
  const [insightContent, setInsightContent] = useState('');
  const [insightFeatured, setInsightFeatured] = useState(false);

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Local editable AdSettings draft
  const [adDrafts, setAdDrafts] = useState<Record<AdSlotKey, AdSetting>>(adSettings);

  useEffect(() => {
    setAdDrafts(adSettings);
  }, [adSettings]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const isAdminUser =
    Boolean(user) &&
    user?.emailVerified === true &&
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (isAdminUser && activeTab === 'subscribers') {
      setLoadingSubs(true);
      fetchSubscribers()
        .then(setSubscribers)
        .catch(() => {})
        .finally(() => setLoadingSubs(false));
    }
  }, [isAdminUser, activeTab]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Sign-in could not be completed.'
      );
    }
  };

  const resetBookForm = () => {
    setEditingBookId(null);
    setTitle('');
    setSubtitle('');
    setAuthor('');
    setCategory('Philosophy');
    setCoverStyle('custom');
    setCoverUrl('');
    setPdfUrl('');
    setReadTime('10 min read');
    setQuote('');
    setSummary('');
    setTakeawaysText('');
    setFeatured(true);
    setDisplayOrder(books.length + 1);
  };

  const handleEditBook = (book: Book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setSubtitle(book.subtitle);
    setAuthor(book.author);
    setCategory(book.category);
    setCoverStyle(book.coverStyle);
    setCoverUrl(book.coverUrl);
    setPdfUrl(book.pdfUrl);
    setReadTime(book.readTime);
    setQuote(book.quote);
    setSummary(book.summary);
    setTakeawaysText((book.keyTakeaways || []).join('\n'));
    setFeatured(book.featured);
    setDisplayOrder(book.displayOrder);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || summary.trim().length < 10) {
      showToast('Please fill in Title, Author, and at least 10 characters of Summary.');
      return;
    }

    setBusy(true);
    try {
      const takeaways = takeawaysText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      await saveBook(
        {
          id: editingBookId || undefined,
          title,
          subtitle,
          author,
          category,
          coverStyle,
          coverUrl,
          pdfUrl,
          readTime,
          quote,
          summary,
          keyTakeaways: takeaways,
          featured,
          displayOrder,
        },
        Boolean(editingBookId)
      );
      showToast(editingBookId ? 'Book updated in database.' : 'New book added to library.');
      resetBookForm();
    } catch {
      showToast('Failed to save book. Check your permissions or inputs.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    setBusy(true);
    try {
      await removeBook(bookId);
      if (editingBookId === bookId) resetBookForm();
      showToast('Book deleted.');
    } finally {
      setBusy(false);
    }
  };

  const handleSeedLibrary = async () => {
    setBusy(true);
    try {
      await seedStarterContent();
      showToast('Starter books, shlokas, and ad slots saved to Firestore.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightTitle.trim() || !insightContent.trim()) return;
    setBusy(true);
    try {
      await saveInsight(
        {
          id: editingInsightId || undefined,
          title: insightTitle,
          type: insightType,
          source: insightSource,
          content: insightContent,
          featuredWeekly: insightFeatured,
        },
        Boolean(editingInsightId)
      );
      setEditingInsightId(null);
      setInsightTitle('');
      setInsightSource('');
      setInsightContent('');
      setInsightFeatured(false);
      showToast('Wisdom / Insight saved.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveAdSlot = async (slotKey: AdSlotKey) => {
    const draft = adDrafts[slotKey];
    if (!draft) return;
    setBusy(true);
    try {
      await saveAdSetting({
        slotKey: draft.slotKey,
        enabled: draft.enabled,
        mode: draft.mode,
        adsenseClientId: draft.adsenseClientId,
        adsenseSlotId: draft.adsenseSlotId,
        sponsorTitle: draft.sponsorTitle,
        sponsorDescription: draft.sponsorDescription,
        sponsorCtaText: draft.sponsorCtaText,
        sponsorUrl: draft.sponsorUrl,
        sponsorImageUrl: draft.sponsorImageUrl,
      });
      showToast(`Saved ${slotKey} ad settings.`);
    } finally {
      setBusy(false);
    }
  };

  const exportSubscribersCsv = () => {
    const csv = ['Email', ...subscribers.map((s) => s.email)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soul-and-soch-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center p-6">
        <p className="text-sm text-[#5F584D]">Verifying studio session...</p>
      </div>
    );
  }

  // Hidden Admin Sign-In Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F6F2EA] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl p-8 shadow-[0_14px_40px_rgba(29,27,24,0.08)]">
          <div className="flex justify-center mb-6">
            <BrandLogo compact onClick={onBackToSite} />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-[#B57B2C] font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Curator Studio</span>
          </div>

          <h1 className="font-serif-display text-2xl font-semibold text-[#1D1B18] text-center">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-[#5F584D] text-center leading-relaxed">
            This studio is hidden from public visitors. Sign in with the authorized administrator Google account to manage books, PDF links, summaries, and ads.
          </p>

          {authError && (
            <p className="mt-4 p-3 rounded-lg bg-[#FCECEB] border border-[#E7B5B0] text-xs text-[#8C2D26]">
              {authError}
            </p>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-[#1D1B18] hover:bg-[#332F2A] text-[#FAF7F0] text-sm font-semibold transition-colors cursor-pointer"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={onBackToSite}
            className="mt-4 w-full py-2.5 text-xs font-medium text-[#696054] hover:text-[#1D1B18] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Soul &amp; Soch</span>
          </button>
        </div>
      </div>
    );
  }

  // Non-admin user denied
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl p-8 text-center shadow-lg">
          <ShieldAlert className="w-10 h-10 text-[#A8382B] mx-auto mb-3" />
          <h1 className="font-serif-display text-2xl font-semibold text-[#1D1B18]">
            Administrator Access Only
          </h1>
          <p className="mt-2 text-sm text-[#5F584D] leading-relaxed">
            Signed in as <span className="font-medium text-[#1D1B18]">{user.email}</span>. Only the designated admin account can access the Curator Studio.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => signOut(auth)}
              className="px-4 py-2 rounded-lg bg-[#1D1B18] text-white text-xs font-medium cursor-pointer"
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2 rounded-lg border border-[#D9D0BE] text-xs font-medium text-[#1D1B18] cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#1D1B18]">
      {/* Studio Top Bar */}
      <header className="bg-[#FAF7F0] border-b border-[#E5DEC9] sticky top-0 z-30">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo compact onClick={onBackToSite} />
            <span className="text-xs font-semibold text-[#B57B2C] border-l border-[#DFD6C4] pl-4">
              Curator Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSeedLibrary}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D8CEBC] bg-white hover:bg-[#EFE9DC] text-xs font-medium text-[#1D1B18] cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#B57B2C]" />
              <span>Sync Starter Library</span>
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1D1B18] text-[#FAF7F0] text-xs font-medium hover:bg-[#332F2A] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </button>
            <button
              type="button"
              onClick={() => signOut(auth)}
              aria-label="Sign out"
              className="p-2 rounded-lg border border-[#D8CEBC] text-[#5F584D] hover:text-[#1D1B18] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1D1B18] text-[#FAF7F0] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-[#E3AE59]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-[1340px] mx-auto px-4 sm:px-8 py-8">
        {/* Studio Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E5DEC9] pb-4">
          {[
            { id: 'books' as AdminTab, label: 'Books & PDF Links', icon: BookOpen },
            { id: 'ads' as AdminTab, label: 'Ads & Monetization', icon: DollarSign },
            { id: 'insights' as AdminTab, label: 'Wisdom & Shlokas', icon: Lightbulb },
            { id: 'subscribers' as AdminTab, label: 'Newsletter Subscribers', icon: Mail },
            { id: 'deploy' as AdminTab, label: 'Vercel Hosting Guide', icon: Rocket },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1D1B18] text-[#FAF7F0]'
                    : 'bg-[#FBF9F5] border border-[#E5DEC9] text-[#4A443C] hover:bg-[#EFE9DC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BOOKS & PDFs */}
        {activeTab === 'books' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Add / Edit Book Form */}
            <form
              onSubmit={handleSaveBook}
              className="lg:col-span-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif-display text-xl font-semibold">
                  {editingBookId ? 'Edit Book & PDF' : 'Add New Book'}
                </h2>
                {editingBookId && (
                  <button
                    type="button"
                    onClick={resetBookForm}
                    className="text-xs font-medium text-[#B57B2C] hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bhagavad Gita"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Marcus Aurelius"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Short Subtitle (1-line card hook)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Timeless lessons for modern life."
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BookCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  >
                    {BOOK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="10 min read"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Online PDF Redirect Link (https://...)
                </label>
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://example.com/book.pdf"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Cover Style Preset
                  </label>
                  <select
                    value={coverStyle}
                    onChange={(e) => {
                      const val = e.target.value as CoverStyle;
                      setCoverStyle(val);
                      const preset = COVER_PRESETS.find((p) => p.value === val);
                      if (preset && preset.url) setCoverUrl(preset.url);
                      if (val === 'essentialism' || val === 'atomic') setCoverUrl('');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  >
                    {COVER_PRESETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Custom Cover Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Notable Quote
                </label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="A memorable line from the book..."
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Book Summary *
                </label>
                <textarea
                  rows={5}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write a rich, clear summary of the book's main ideas..."
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Key Takeaways (one per line)
                </label>
                <textarea
                  rows={3}
                  value={takeawaysText}
                  onChange={(e) => setTakeawaysText(e.target.value)}
                  placeholder="First key lesson&#10;Second key lesson"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-[#35302A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-[#C9BFA9]"
                  />
                  <span>Show in Popular Books</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#696054]">Order</label>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded border border-[#DDD4C2] bg-white text-sm tabular-nums"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 px-4 rounded-xl bg-[#E3AE59] hover:bg-[#D49D45] text-[#1D1B18] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                <span>{editingBookId ? 'Update Book' : 'Publish Book to Library'}</span>
              </button>
            </form>

            {/* Library Table */}
            <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif-display text-xl font-semibold">
                  Published Library ({books.length})
                </h2>
                <span className="text-xs text-[#696054]">
                  Synced live with Firestore
                </span>
              </div>

              <div className="divide-y divide-[#EAE2D3]">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-display text-base font-semibold text-[#1D1B18] truncate">
                          {book.title}
                        </h3>
                        {book.featured && (
                          <span className="text-[11px] font-medium text-[#B57B2C]">
                            &middot; Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#696054] mt-0.5">
                        {book.author} &middot; {book.category}
                      </p>
                      {book.pdfUrl && (
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-[#9C6521] hover:underline truncate max-w-full"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{book.pdfUrl}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditBook(book)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DDD4C2] bg-white hover:bg-[#EFE9DC] text-xs font-medium cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-1.5 rounded-lg border border-[#E7C6C2] text-[#A8382B] hover:bg-[#FCECEB] cursor-pointer"
                        aria-label={`Delete ${book.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADS & MONETIZATION */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            <div className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6">
              <h2 className="font-serif-display text-xl font-semibold mb-1">
                Google AdSense &amp; Sponsor Placements
              </h2>
              <p className="text-sm text-[#5F584D] mb-6">
                Control all three monetization spots on Soul &amp; Soch. Use Google AdSense (by pasting your Publisher ID and Slot ID) or run direct Sponsored Book/Course banners.
              </p>

              {/* Global AdSense ID */}
              <div className="p-4 rounded-xl bg-[#EFE9DC] border border-[#E2D9C5] mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Global Google AdSense Publisher ID (e.g. ca-pub-1234567890123456)
                  </label>
                  <input
                    type="text"
                    value={adDrafts.adsense_global?.adsenseClientId || ''}
                    onChange={(e) =>
                      setAdDrafts((prev) => ({
                        ...prev,
                        adsense_global: {
                          ...prev.adsense_global,
                          adsenseClientId: e.target.value,
                        },
                      }))
                    }
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CEBC] bg-white text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveAdSlot('adsense_global')}
                  disabled={busy}
                  className="px-5 py-2 rounded-lg bg-[#1D1B18] text-white text-sm font-medium cursor-pointer whitespace-nowrap"
                >
                  Save Publisher ID
                </button>
              </div>

              {/* Per-Slot Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(
                  [
                    {
                      key: 'slot_banner' as AdSlotKey,
                      name: '1. Homepage Banner (728×90)',
                      location: 'Appears right below Popular Books.',
                    },
                    {
                      key: 'slot_sidebar' as AdSlotKey,
                      name: '2. Sidebar Rectangle (300×250)',
                      location: 'Appears below the Newsletter card.',
                    },
                    {
                      key: 'slot_reader' as AdSlotKey,
                      name: '3. Book Summary Reader Ad',
                      location: 'Appears inside every Book Summary before the PDF button.',
                    },
                  ] as const
                ).map((slotMeta) => {
                  const slot = adDrafts[slotMeta.key];
                  if (!slot) return null;

                  const updateSlot = (patch: Partial<AdSetting>) => {
                    setAdDrafts((prev) => ({
                      ...prev,
                      [slotMeta.key]: { ...prev[slotMeta.key], ...patch },
                    }));
                  };

                  return (
                    <div
                      key={slotMeta.key}
                      className="rounded-xl border border-[#E5DEC9] bg-white p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif-display text-lg font-semibold text-[#1D1B18]">
                              {slotMeta.name}
                            </h3>
                            <p className="text-xs text-[#696054]">{slotMeta.location}</p>
                          </div>
                          <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={slot.enabled}
                              onChange={(e) => updateSlot({ enabled: e.target.checked })}
                            />
                            <span>Active</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                            Ad Mode
                          </label>
                          <select
                            value={slot.mode}
                            onChange={(e) =>
                              updateSlot({
                                mode: e.target.value as 'adsense' | 'sponsor',
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] text-sm bg-[#FAF7F0]"
                          >
                            <option value="sponsor">Custom Sponsor / Affiliate Banner</option>
                            <option value="adsense">Google AdSense Unit</option>
                          </select>
                        </div>

                        {slot.mode === 'adsense' ? (
                          <div>
                            <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                              AdSense Ad Unit Slot ID
                            </label>
                            <input
                              type="text"
                              value={slot.adsenseSlotId}
                              onChange={(e) =>
                                updateSlot({ adsenseSlotId: e.target.value })
                              }
                              placeholder="e.g. 9876543210"
                              className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                                Sponsor Headline
                              </label>
                              <input
                                type="text"
                                value={slot.sponsorTitle}
                                onChange={(e) =>
                                  updateSlot({ sponsorTitle: e.target.value })
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-[#DDD4C2] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                                Description
                              </label>
                              <textarea
                                rows={2}
                                value={slot.sponsorDescription}
                                onChange={(e) =>
                                  updateSlot({ sponsorDescription: e.target.value })
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-[#DDD4C2] text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                                  Button Text
                                </label>
                                <input
                                  type="text"
                                  value={slot.sponsorCtaText}
                                  onChange={(e) =>
                                    updateSlot({ sponsorCtaText: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDD4C2] text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                                  Target URL
                                </label>
                                <input
                                  type="text"
                                  value={slot.sponsorUrl}
                                  onChange={(e) =>
                                    updateSlot({ sponsorUrl: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDD4C2] text-sm"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveAdSlot(slotMeta.key)}
                        disabled={busy}
                        className="w-full py-2 rounded-lg bg-[#E3AE59] hover:bg-[#D49D45] text-[#1D1B18] text-xs font-semibold cursor-pointer"
                      >
                        Save Placement
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WISDOM & SHLOKAS */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveInsight}
              className="lg:col-span-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6 space-y-4"
            >
              <h2 className="font-serif-display text-xl font-semibold">
                {editingInsightId ? 'Edit Wisdom / Shloka' : 'Add Wisdom, Shloka or Reading List'}
              </h2>
              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={insightTitle}
                  onChange={(e) => setInsightTitle(e.target.value)}
                  placeholder="e.g. Bhagavad Gita 2.47"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Section Type
                  </label>
                  <select
                    value={insightType}
                    onChange={(e) => setInsightType(e.target.value as InsightType)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  >
                    <option value="shloka">Gita Shloka</option>
                    <option value="wisdom">Weekly Wisdom Quote</option>
                    <option value="reading_list">Curated Reading List</option>
                    <option value="insight">Thought / Essay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                    Source / Author
                  </label>
                  <input
                    type="text"
                    value={insightSource}
                    onChange={(e) => setInsightSource(e.target.value)}
                    placeholder="e.g. Aristotle"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A443C] mb-1">
                  Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={insightContent}
                  onChange={(e) => setInsightContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD4C2] bg-white text-sm"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-[#35302A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={insightFeatured}
                  onChange={(e) => setInsightFeatured(e.target.checked)}
                />
                <span>Feature in Weekly Wisdom Sidebar Card</span>
              </label>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-xl bg-[#1D1B18] text-white text-sm font-semibold cursor-pointer"
              >
                {editingInsightId ? 'Update Entry' : 'Publish Entry'}
              </button>
            </form>

            <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6 divide-y divide-[#EAE2D3]">
              {insights.map((ins) => (
                <div key={ins.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B57B2C]">
                      {ins.type} {ins.featuredWeekly ? '· Featured Weekly' : ''}
                    </span>
                    <h3 className="font-serif-display text-base font-semibold text-[#1D1B18]">
                      {ins.title}
                    </h3>
                    <p className="text-xs text-[#5F584D] mt-1 line-clamp-2">{ins.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInsightId(ins.id);
                        setInsightTitle(ins.title);
                        setInsightType(ins.type);
                        setInsightSource(ins.source);
                        setInsightContent(ins.content);
                        setInsightFeatured(ins.featuredWeekly);
                      }}
                      className="px-3 py-1 rounded-lg border border-[#DDD4C2] bg-white text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeInsight(ins.id)}
                      className="p-1.5 rounded-lg border border-[#E7C6C2] text-[#A8382B] cursor-pointer"
                      aria-label={`Delete ${ins.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="font-serif-display text-xl font-semibold">
                  Newsletter Subscribers ({subscribers.length})
                </h2>
                <p className="text-xs text-[#696054]">
                  Protected by Firestore rules: only your admin account can read subscriber emails.
                </p>
              </div>
              {subscribers.length > 0 && (
                <button
                  type="button"
                  onClick={exportSubscribersCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1D1B18] text-white text-xs font-medium cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {loadingSubs ? (
              <p className="text-sm text-[#696054]">Loading subscribers...</p>
            ) : subscribers.length === 0 ? (
              <p className="text-sm text-[#696054]">No newsletter subscribers yet.</p>
            ) : (
              <div className="divide-y divide-[#EAE2D3]">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-[#1D1B18]">{sub.email}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await removeSubscriber(sub.id);
                        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
                      }}
                      className="text-xs text-[#A8382B] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VERCEL HOSTING GUIDE */}
        {activeTab === 'deploy' && (
          <div className="max-w-3xl bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-6 sm:p-8 space-y-5">
            <h2 className="font-serif-display text-2xl font-semibold text-[#1D1B18]">
              Deploying Soul &amp; Soch on Vercel
            </h2>
            <p className="text-sm text-[#5F584D] leading-relaxed">
              Your project is already pre-configured for zero-config static SPA hosting on Vercel (`vercel.json` is included so `/admin` routes work directly).
            </p>
            <ol className="space-y-4 text-sm text-[#35302A]">
              <li>
                <span className="font-semibold text-[#1D1B18]">01. Push &amp; Import in Vercel:</span>{' '}
                Push this codebase to GitHub (with <code>firebase-applet-config.json</code> gitignored) and import the repository in Vercel. Framework Preset: <strong>Vite</strong>, Build Command: <code>npm run build</code>, Output Directory: <code>dist</code>.
              </li>
              <li>
                <span className="font-semibold text-[#1D1B18]">02. Add Firebase Env Vars in Vercel:</span>{' '}
                In Vercel &rarr; Project Settings &rarr; Environment Variables, add the 7 <code>VITE_FIREBASE_*</code> variables listed in <code>.env.example</code> using the values from your local <code>firebase-applet-config.json</code>.
              </li>
              <li>
                <span className="font-semibold text-[#1D1B18]">03. Authorize Your Vercel Domain in Firebase:</span>{' '}
                In Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized domains, add your live Vercel domain (e.g. <code>your-site.vercel.app</code>) so Admin Google Sign-In works on your custom URL.
              </li>
              <li>
                <span className="font-semibold text-[#1D1B18]">04. Hidden Admin Access:</span>{' '}
                Visit <code>https://your-site.vercel.app/admin</code> or press <code>Ctrl+Shift+A</code> (<code>Cmd+Shift+A</code> on Mac) anytime to manage books, PDF links, summaries, and AdSense placements.
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
