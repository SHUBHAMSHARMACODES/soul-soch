import React from 'react';
import { BookOpen, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { Book, Insight } from '../types';

export type KnowledgeTab = 'shloka' | 'free' | 'reading_list' | 'insight';

interface KnowledgeSectionProps {
  activeTab: KnowledgeTab;
  onTabChange: (tab: KnowledgeTab) => void;
  insights: Insight[];
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const TABS: Array<{ id: KnowledgeTab; label: string }> = [
  { id: 'shloka', label: 'Gita Shlokas' },
  { id: 'free', label: 'Free Books Online' },
  { id: 'reading_list', label: 'Curated Reading Lists' },
  { id: 'insight', label: 'Thoughts & Insights' },
];

export const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({
  activeTab,
  onTabChange,
  insights,
  books,
  onSelectBook,
}) => {
  const filteredInsights = insights.filter((item) => item.type === activeTab);
  const pdfBooks = books.filter((b) => Boolean(b.pdfUrl));

  return (
    <section id="knowledge-section" className="pt-8 border-t border-[#E5DEC9]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#B57B2C]">
            <span className="w-5 h-[1px] bg-[#C98A3A]" />
            <span>KNOWLEDGE ARCHIVE</span>
            <span className="w-5 h-[1px] bg-[#C98A3A]" />
          </div>
          <h2 className="mt-1 font-serif-display text-2xl sm:text-[28px] font-semibold text-[#1D1B18]">
            Shlokas, Free PDFs &amp; Insights
          </h2>
        </div>

        {/* Functional Tab Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#EFE9DC] p-1 rounded-lg border border-[#E2D9C5]">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1D1B18] text-[#FAF7F0] shadow-xs'
                    : 'text-[#4B443B] hover:text-[#1D1B18]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'free' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pdfBooks.length === 0 ? (
            <p className="text-sm text-[#5F584D] py-6">
              No external PDF links added yet. Add online PDF links from the Curator Studio.
            </p>
          ) : (
            pdfBooks.map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-xl bg-[#FBF9F4] border border-[#E5DEC9] flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#7B7264]">
                    <span>{book.category}</span>
                    <span>{book.readTime}</span>
                  </div>
                  <h3 className="mt-1.5 font-serif-display text-lg font-semibold text-[#1D1B18]">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#696054] mt-0.5">By {book.author}</p>
                  <p className="mt-2 text-[13.5px] text-[#4A443C] line-clamp-2">
                    {book.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#EAE2D3]">
                  <button
                    type="button"
                    onClick={() => onSelectBook(book)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B554B] hover:text-[#1D1B18] cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Summary</span>
                  </button>
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E3AE59] hover:bg-[#D39B43] text-[#1D1B18] text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.length === 0 ? (
            <div className="col-span-full p-6 rounded-xl bg-[#FBF9F4] border border-[#E5DEC9] text-sm text-[#5F584D]">
              New entries for this section are being curated.
            </div>
          ) : (
            filteredInsights.map((item) => (
              <article
                key={item.id}
                className="p-5 rounded-xl bg-[#FBF9F4] border border-[#E5DEC9] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#B57B2C] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.source || 'Soul & Soch'}</span>
                  </div>
                  <h3 className="mt-2 font-serif-display text-[19px] font-semibold text-[#1D1B18] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.65] text-[#453E35]">
                    {item.content}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};
