import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  DEFAULT_AD_SETTINGS,
  DEFAULT_BOOKS,
  DEFAULT_INSIGHTS,
} from './data/defaultBooks';
import {
  subscribeAdSettings,
  subscribeBooks,
  subscribeInsights,
} from './services/firestoreService';
import { AdSetting, AdSlotKey, Book, BookCategory, Insight } from './types';
import { AdminPanel } from './components/AdminPanel';
import { AdSlot } from './components/AdSlot';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { CategoryStrip } from './components/CategoryStrip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutModal, IntroModal } from './components/IntroAboutModals';
import { KnowledgeSection, KnowledgeTab } from './components/KnowledgeSection';
import { SeoManager } from './components/SeoManager';
import { Sidebar } from './components/Sidebar';

function isAdminPath(): boolean {
  return (
    window.location.pathname.startsWith('/admin') ||
    window.location.hash === '#admin'
  );
}

function getBookIdFromPath(): string | null {
  const match = window.location.pathname.match(/^\/books\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getInitialSearchQuery(): string {
  return new URLSearchParams(window.location.search).get('q') || '';
}

const DEFAULT_AD_MAP: Record<AdSlotKey, AdSetting> = DEFAULT_AD_SETTINGS.reduce(
  (acc, item) => {
    acc[item.slotKey] = item;
    return acc;
  },
  {} as Record<AdSlotKey, AdSetting>
);

function SoulAndSochApp() {
  const [adminView, setAdminView] = useState<boolean>(isAdminPath);
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);
  const [insights, setInsights] = useState<Insight[]>(DEFAULT_INSIGHTS);
  const [adSettings, setAdSettings] = useState<Record<AdSlotKey, AdSetting>>(DEFAULT_AD_MAP);

  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearchQuery);
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(() => {
    const id = getBookIdFromPath();
    return id ? DEFAULT_BOOKS.find((b) => b.id === id) || null : null;
  });
  const [knowledgeTab, setKnowledgeTab] = useState<KnowledgeTab>('shloka');
  const [introOpen, setIntroOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Live Firestore subscriptions with graceful curated starter fallback
  useEffect(() => {
    const unsubBooks = subscribeBooks((liveBooks) => {
      if (liveBooks.length > 0) {
        setBooks(liveBooks);
        const urlBookId = getBookIdFromPath();
        if (urlBookId) {
          const matched = liveBooks.find((b) => b.id === urlBookId);
          if (matched) setActiveBook(matched);
        }
      }
    });

    const unsubInsights = subscribeInsights((liveInsights) => {
      if (liveInsights.length > 0) {
        setInsights(liveInsights);
      }
    });

    const unsubAds = subscribeAdSettings((liveAds) => {
      setAdSettings(liveAds);
    });

    return () => {
      unsubBooks();
      unsubInsights();
      unsubAds();
    };
  }, []);

  // Browser URL & secret Ctrl+Shift+A shortcut for hidden Admin Studio
  useEffect(() => {
    const onPopState = () => {
      setAdminView(isAdminPath());
      const urlBookId = getBookIdFromPath();
      setActiveBook(urlBookId ? books.find((b) => b.id === urlBookId) || null : null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdmin();
      }
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [books]);

  const openBook = (book: Book) => {
    setActiveBook(book);
    const targetPath = `/books/${encodeURIComponent(book.id)}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const closeBook = () => {
    setActiveBook(null);
    if (window.location.pathname.startsWith('/books/')) {
      window.history.pushState({}, '', '/');
    }
  };

  const openAdmin = () => {
    setActiveBook(null);
    window.history.pushState({}, '', '/admin');
    setAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdmin = () => {
    window.history.pushState({}, '', '/');
    setAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToElement = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;
      const matchesQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.subtitle.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q) ||
        book.summary.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [books, selectedCategory, searchQuery]);

  const displayedBooks = useMemo(() => {
    if (showAllBooks || selectedCategory !== 'All' || searchQuery.trim()) {
      return filteredBooks;
    }
    const popular = filteredBooks.filter((b) => b.featured);
    return (popular.length > 0 ? popular : filteredBooks).slice(0, 5);
  }, [filteredBooks, showAllBooks, selectedCategory, searchQuery]);

  const weeklyWisdom = useMemo(() => {
    return (
      insights.find((i) => i.featuredWeekly) ||
      insights.find((i) => i.type === 'wisdom') ||
      DEFAULT_INSIGHTS[0]
    );
  }, [insights]);

  if (adminView) {
    return (
      <>
        <SeoManager activeBook={null} isAdmin={true} />
        <AdminPanel
          books={books}
          insights={insights}
          adSettings={adSettings}
          onBackToSite={closeAdmin}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F2EA] text-[#1D1B18]">
      <SeoManager activeBook={activeBook} isAdmin={false} />
      <Header
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (val.trim()) {
            scrollToElement('#popular-books');
          }
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setShowAllBooks(cat === 'All');
          scrollToElement('#popular-books');
        }}
        onNavigateKnowledge={(tab) => {
          setKnowledgeTab(tab);
          scrollToElement('#knowledge-section');
        }}
        onOpenAbout={() => setAboutOpen(true)}
        onJoinJourney={() => scrollToElement('#newsletter-box')}
        onGoHome={() => {
          setSelectedCategory('All');
          setSearchQuery('');
          setShowAllBooks(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        <Hero
          onExploreBooks={() => {
            setShowAllBooks(true);
            scrollToElement('#popular-books');
          }}
          onWatchIntro={() => setIntroOpen(true)}
        />

        <CategoryStrip
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToElement('#popular-books');
          }}
        />

        {/* Main 2-Column Editorial Workspace */}
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Primary Book Catalog & Knowledge Column */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-10">
              <section id="popular-books">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B57B2C]">
                      <span className="w-6 h-[1px] bg-[#C98A3A]" />
                      <span>EXPLORE</span>
                      <span className="w-6 h-[1px] bg-[#C98A3A]" />
                    </div>
                    <h2 className="mt-1 font-serif-display text-[30px] sm:text-[34px] font-semibold text-[#1D1B18] leading-tight">
                      {selectedCategory !== 'All'
                        ? selectedCategory
                        : searchQuery.trim()
                        ? `Results for "${searchQuery.trim()}"`
                        : showAllBooks
                        ? 'All Books & Summaries'
                        : 'Popular Books'}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    {(selectedCategory !== 'All' || searchQuery.trim()) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All');
                          setSearchQuery('');
                        }}
                        className="text-xs font-medium text-[#696054] hover:text-[#1D1B18] underline underline-offset-4 cursor-pointer"
                      >
                        Reset filter
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowAllBooks(!showAllBooks)}
                      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#B57B2C] hover:text-[#8E5B17] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{showAllBooks ? 'Show Featured 5' : 'View All Books'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {displayedBooks.length === 0 ? (
                  <div className="p-10 rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] text-center">
                    <p className="font-serif-display text-xl text-[#1D1B18]">
                      No books matched your search
                    </p>
                    <p className="mt-1 text-sm text-[#5F584D]">
                      Try clearing your search or choosing another reading category.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                    {displayedBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onSelect={openBook}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Banner Ad Placement */}
              <AdSlot
                variant="banner"
                setting={adSettings.slot_banner}
                globalAdsense={adSettings.adsense_global}
                onAnchorClick={(href) => scrollToElement(href)}
              />

              {/* Gita Shlokas, Free Online PDFs, Reading Lists & Insights */}
              <KnowledgeSection
                activeTab={knowledgeTab}
                onTabChange={setKnowledgeTab}
                insights={insights}
                books={books}
                onSelectBook={openBook}
              />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <Sidebar
                weeklyWisdom={weeklyWisdom}
                adSettings={adSettings}
                onQuickLinkClick={(tab) => {
                  setKnowledgeTab(tab);
                  scrollToElement('#knowledge-section');
                }}
                onAnchorClick={(href) => scrollToElement(href)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Editorial Footer with Discreet Curator Access */}
      <footer className="border-t border-[#E5DEC9] bg-[#F1ECE1] py-6">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#696054]">
          <p>
            &copy; {new Date().getFullYear()} Soul &amp; Soch &mdash; Books, Ideas &amp; Timeless Wisdom.
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="hover:text-[#1D1B18] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => {
                setKnowledgeTab('free');
                scrollToElement('#knowledge-section');
              }}
              className="hover:text-[#1D1B18] transition-colors cursor-pointer"
            >
              Free PDFs
            </button>
            <button
              type="button"
              onClick={openAdmin}
              className="text-[#8E8577] hover:text-[#1D1B18] transition-colors cursor-pointer"
              title="Curator Studio"
            >
              Curator
            </button>
          </div>
        </div>
      </footer>

      <BookDetailModal
        book={activeBook}
        adSettings={adSettings}
        onClose={closeBook}
        onAnchorClick={(href) => scrollToElement(href)}
      />

      <IntroModal
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        onExploreBooks={() => {
          setShowAllBooks(true);
          scrollToElement('#popular-books');
        }}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SoulAndSochApp />
    </ErrorBoundary>
  );
}
