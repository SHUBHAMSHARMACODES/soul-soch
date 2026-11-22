import React from 'react';
import { BookOpen, Compass, ExternalLink, X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onExploreBooks?: () => void;
}

export const IntroModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onExploreBooks,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141210]/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Soul & Soch Introduction"
    >
      <div
        className="max-w-xl w-full bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#B57B2C]">
            Welcome to Soul &amp; Soch
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close introduction"
            className="p-1.5 rounded-lg hover:bg-[#EFE9DC] text-[#4A443C] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1D1B18] leading-snug">
          Read Beyond Words. Think Beyond Beliefs.
        </h3>

        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#453E35]">
          <p>
            Soul &amp; Soch is a quiet sanctuary for readers seeking clarity in a noisy world. Instead of endless feeds, we distill timeless books, the Bhagavad Gita, Stoic philosophy, and modern psychology into readable summaries.
          </p>
          <p>
            Every book page gives you the core ideas, practical takeaways for daily life, and direct links to read the full online PDF whenever you want to dive deeper.
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-[#EAE2D3] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#696054]">
            <BookOpen className="w-4 h-4 text-[#B57B2C]" />
            <span>Free summaries &bull; Direct online PDF access</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onExploreBooks?.();
            }}
            className="px-5 py-2.5 rounded-full bg-[#1D1B18] hover:bg-[#332F2A] text-[#FAF7F0] text-sm font-medium transition-colors cursor-pointer"
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC<ModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141210]/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About Soul & Soch"
    >
      <div
        className="max-w-xl w-full bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#B57B2C]">
            <Compass className="w-4 h-4" />
            <span>About the Platform</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close about modal"
            className="p-1.5 rounded-lg hover:bg-[#EFE9DC] text-[#4A443C] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1D1B18]">
          Books &bull; Ideas &bull; A Better You
        </h3>

        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#453E35]">
          <p>
            Soul &amp; Soch brings together Eastern spiritual classics like the Bhagavad Gita alongside Western philosophy, psychology, science, and timeless literature.
          </p>
          <p>
            Whether you have five minutes for a book summary or want to open a full online PDF edition, every entry is curated to help you reflect deeply and act wisely.
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[#EFE9DC] border border-[#E2D9C5] text-xs text-[#4A443C] flex items-center justify-between gap-4">
          <span>All summaries are free to read with zero account required.</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#1D1B18] shrink-0">
            <ExternalLink className="w-3.5 h-3.5" />
            Direct PDFs
          </span>
        </div>
      </div>
    </div>
  );
};
