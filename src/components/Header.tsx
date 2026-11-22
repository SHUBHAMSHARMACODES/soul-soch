import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, Search, X, Menu } from 'lucide-react';
import { BOOK_CATEGORIES, BookCategory } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectCategory: (cat: BookCategory | 'All') => void;
  onNavigateKnowledge: (tab: 'shloka' | 'free' | 'reading_list' | 'insight') => void;
  onOpenAbout: () => void;
  onJoinJourney: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onNavigateKnowledge,
  onOpenAbout,
  onJoinJourney,
  onGoHome,
}) => {
  const [openMenu, setOpenMenu] = useState<'explore' | 'knowledge' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-40 bg-[#FAF7F0]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-8 pt-3.5 pb-4 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Lockup */}
        <BrandLogo onClick={onGoHome} />

        {/* Zone 2: Navigation Links + Search */}
        <div
          ref={menuRef}
          className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#2A2621]"
        >
          <button
            type="button"
            onClick={onGoHome}
            className="px-4 py-1.5 rounded-full bg-[#1D1B18] text-[#FAF7F0] text-[13.5px] font-medium transition-colors hover:bg-[#332F2A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Home
          </button>

          {/* Explore Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'explore' ? null : 'explore')}
              className="flex items-center gap-1 py-1.5 text-[#2A2621] hover:text-[#B97D2F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>
            {openMenu === 'explore' && (
              <div className="absolute left-0 top-full mt-2 w-60 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl shadow-[0_12px_32px_rgba(29,27,24,0.12)] py-2 z-50">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('All');
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#1D1B18] font-medium hover:bg-[#EFE9DC] transition-colors cursor-pointer"
                >
                  All Books &amp; Summaries
                </button>
                <div className="my-1 border-t border-[#EAE2D3]" />
                {BOOK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#4A443C] hover:bg-[#EFE9DC] hover:text-[#1D1B18] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Knowledge Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'knowledge' ? null : 'knowledge')}
              className="flex items-center gap-1 py-1.5 text-[#2A2621] hover:text-[#B97D2F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Knowledge</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>
            {openMenu === 'knowledge' && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl shadow-[0_12px_32px_rgba(29,27,24,0.12)] py-2 z-50">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateKnowledge('shloka');
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#4A443C] hover:bg-[#EFE9DC] hover:text-[#1D1B18] transition-colors cursor-pointer"
                >
                  Read Gita Shlokas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateKnowledge('free');
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#4A443C] hover:bg-[#EFE9DC] hover:text-[#1D1B18] transition-colors cursor-pointer"
                >
                  Free Books Online (PDFs)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateKnowledge('reading_list');
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#4A443C] hover:bg-[#EFE9DC] hover:text-[#1D1B18] transition-colors cursor-pointer"
                >
                  Curated Reading Lists
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateKnowledge('insight');
                    setOpenMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#4A443C] hover:bg-[#EFE9DC] hover:text-[#1D1B18] transition-colors cursor-pointer"
                >
                  Thoughts &amp; Insights
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenAbout}
            className="py-1.5 text-[#2A2621] hover:text-[#B97D2F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            About
          </button>

          {/* Search Pill */}
          <div className="relative w-56 xl:w-64">
            <Search className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search books, ideas..."
              aria-label="Search books and ideas"
              className="w-full pl-9 pr-8 py-2 text-[13px] rounded-full bg-white border border-[#E5DFD3] text-[#1D1B18] placeholder-[#8C8375] focus:outline-none focus:border-[#C98A3A] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#1D1B18] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Primary CTA + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onJoinJourney}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1D1B18] text-[#FAF7F0] text-[13.5px] font-medium hover:bg-[#332F2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Join the Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-2.5 rounded-lg border border-[#E5DFD3] text-[#1D1B18] bg-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE2D3] bg-[#FAF7F0] px-4 py-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search books, ideas..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full bg-white border border-[#E5DFD3] text-[#1D1B18]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="px-3.5 py-2 rounded-lg bg-[#1D1B18] text-white text-xs font-medium cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('All');
                setMobileMenuOpen(false);
              }}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#E5DFD3] text-xs font-medium text-[#1D1B18] cursor-pointer"
            >
              All Books
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateKnowledge('shloka');
                setMobileMenuOpen(false);
              }}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#E5DFD3] text-xs font-medium text-[#1D1B18] cursor-pointer"
            >
              Gita Shlokas
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#E5DFD3] text-xs font-medium text-[#1D1B18] cursor-pointer"
            >
              About
            </button>
          </div>
        </div>
      )}

      {/* Subtle organic cream wave edge dipping over Hero */}
      <div className="pointer-events-none absolute left-0 right-0 -bottom-5 h-6 overflow-hidden">
        <svg
          viewBox="0 0 1440 36"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0,0 L1440,0 L1440,12 C1180,32 920,28 640,12 C380,-2 180,26 0,18 Z"
            fill="#FAF7F0"
          />
        </svg>
      </div>
    </header>
  );
};
