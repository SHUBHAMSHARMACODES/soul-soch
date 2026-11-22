import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ExternalLink,
  FileText,
  Quote,
  X,
} from 'lucide-react';
import { AdSetting, AdSlotKey, Book } from '../types';
import { AdSlot } from './AdSlot';
import { BookCover } from './BookCover';

interface BookDetailModalProps {
  book: Book | null;
  adSettings: Record<AdSlotKey, AdSetting>;
  onClose: () => void;
  onAnchorClick?: (href: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  adSettings,
  onClose,
  onAnchorClick,
}) => {
  if (!book) return null;

  const paragraphs = book.summary
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141210]/70 backdrop-blur-xs overflow-y-auto px-4 py-6 sm:py-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} summary`}
    >
      <div
        className="max-w-4xl mx-auto bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.28)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Utility Strip */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F3EEE3] border-b border-[#E5DEC9]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3B352D] hover:text-[#1D1B18] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close book reader"
            className="p-2 rounded-lg hover:bg-[#E7E0D1] text-[#4A443C] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          {/* Book Hero Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-44 sm:w-52 shrink-0 mx-auto md:mx-0">
              <BookCover
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                coverStyle={book.coverStyle}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#756C5E] font-medium">
                <span>{book.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {book.readTime || '10 min read'}
                </span>
              </div>

              <h2 className="mt-2 font-serif-display text-3xl sm:text-4xl font-semibold text-[#1D1B18] leading-tight text-balance">
                {book.title}
              </h2>

              <p className="mt-1.5 text-base text-[#5F584D]">
                By <span className="font-medium text-[#2A2621]">{book.author}</span>
              </p>

              {book.subtitle && (
                <p className="mt-3 text-[15px] text-[#4A443C] leading-relaxed">
                  {book.subtitle}
                </p>
              )}

              {/* Primary Online PDF Redirect CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {book.pdfUrl ? (
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E3AE59] hover:bg-[#D39B43] text-[#1D1B18] text-sm font-semibold transition-colors shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Read Full Online PDF</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#EFE9DC] text-[#696054] text-xs font-medium">
                    <BookOpen className="w-4 h-4" />
                    Summary Edition — PDF link coming soon
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Curated Quote */}
          {book.quote && (
            <blockquote className="my-8 py-5 px-6 rounded-xl bg-[#EFE9DC]/75 border border-[#E5DEC9]">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#C98A3A] shrink-0 mt-1" />
                <p className="font-serif-display italic text-lg sm:text-xl leading-relaxed text-[#24201B]">
                  “{book.quote}”
                </p>
              </div>
            </blockquote>
          )}

          {/* Editorial Summary */}
          <div className="max-w-prose">
            <h3 className="font-serif-display text-2xl font-semibold text-[#1D1B18] mb-4">
              Book Summary &amp; Core Ideas
            </h3>
            <div className="space-y-4 text-[15.5px] leading-[1.8] text-[#2F2B25]">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:font-serif-display first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:text-[#9C6521]'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* In-Reader Ad Placement */}
          <AdSlot
            variant="reader"
            setting={adSettings.slot_reader}
            globalAdsense={adSettings.adsense_global}
            onAnchorClick={(href) => {
              onClose();
              onAnchorClick?.(href);
            }}
          />

          {/* Key Takeaways */}
          {book.keyTakeaways && book.keyTakeaways.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#E5DEC9]">
              <h3 className="font-serif-display text-xl font-semibold text-[#1D1B18] mb-4">
                Key Takeaways for Daily Life
              </h3>
              <ol className="space-y-3">
                {book.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[15px] text-[#35302A] leading-relaxed">
                    <span className="font-serif-display font-semibold text-[#B87D2F] tabular-nums shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Bottom PDF Redirect Box */}
          {book.pdfUrl && (
            <div className="mt-8 p-5 rounded-xl bg-[#1D1B18] text-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-serif-display text-lg font-medium">
                  Want to read the complete text?
                </p>
                <p className="text-xs text-[#C8BFB0] mt-0.5">
                  Opens the external online PDF resource in a new tab.
                </p>
              </div>
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#E3AE59] hover:bg-[#D49D45] text-[#1D1B18] text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <span>Open Online PDF</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
