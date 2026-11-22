import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A3A] rounded-lg cursor-pointer shrink-0"
    >
      {/* Wisdom Tree emerging from Open Book SVG */}
      <svg
        viewBox="0 0 64 56"
        className="w-11 h-10 text-[#1D1B18] shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Open book pages */}
        <path
          d="M8 44C15 41 24 41 32 46C40 41 49 41 56 44"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M6 48C14 45 23 45 32 50C41 45 50 45 58 48"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 40C17 37.5 25 38 32 42.5C39 38 47 37.5 53 40"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Tree trunk & roots */}
        <path
          d="M32 43V23M32 33L24 26M32 29L40 22M32 24L27 17M32 23L36 16"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Canopy leaves */}
        <circle cx="32" cy="12" r="3.5" fill="currentColor" />
        <circle cx="24" cy="14" r="3" fill="currentColor" />
        <circle cx="40" cy="14" r="3" fill="currentColor" />
        <circle cx="18" cy="20" r="2.8" fill="currentColor" />
        <circle cx="46" cy="20" r="2.8" fill="currentColor" />
        <circle cx="21" cy="26" r="2.5" fill="currentColor" />
        <circle cx="43" cy="26" r="2.5" fill="currentColor" />
        <circle cx="28" cy="19" r="2.6" fill="currentColor" />
        <circle cx="36" cy="19" r="2.6" fill="currentColor" />
        <circle cx="15" cy="25" r="2" fill="currentColor" />
        <circle cx="49" cy="25" r="2" fill="currentColor" />
        <circle cx="28" cy="8" r="2.4" fill="currentColor" />
        <circle cx="36" cy="8" r="2.4" fill="currentColor" />
      </svg>

      <div className="flex flex-col leading-none">
        <span className="font-serif-display text-[22px] sm:text-[24px] font-semibold tracking-tight text-[#1D1B18] whitespace-nowrap">
          Soul &amp; Soch
        </span>
        {!compact && (
          <span className="text-[11px] font-medium tracking-[0.04em] text-[#5F584D] mt-1 whitespace-nowrap">
            Books &bull; Ideas &bull; A Better You
          </span>
        )}
      </div>
    </button>
  );
};
