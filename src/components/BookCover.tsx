import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { CoverStyle } from '../types';

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string;
  coverStyle: CoverStyle;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  coverUrl,
  coverStyle,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Essentialism crisp graphic cover matching the screenshot
  if (coverStyle === 'essentialism' && !coverUrl) {
    return (
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#FAF8F4] border border-[#E5DFD3] shadow-[0_6px_18px_rgba(29,27,24,0.1)] select-none flex items-center justify-center ${className}`}
      >
        <svg viewBox="0 0 240 320" className="w-full h-full" aria-hidden="true">
          <rect width="240" height="320" fill="#FAF8F4" />
          {/* Messy tangled outer circles */}
          <g fill="none" stroke="#1E1C19" strokeWidth="1.2" opacity="0.85">
            <ellipse cx="122" cy="158" rx="82" ry="74" transform="rotate(-12 122 158)" />
            <ellipse cx="118" cy="162" rx="76" ry="86" transform="rotate(18 118 162)" />
            <ellipse cx="125" cy="155" rx="88" ry="66" transform="rotate(34 125 155)" />
            <ellipse cx="116" cy="164" rx="70" ry="90" transform="rotate(-28 116 164)" />
            <ellipse cx="120" cy="160" rx="64" ry="72" transform="rotate(8 120 160)" />
            <path d="M40 165 C25 110, 80 75, 130 85 C190 95, 215 155, 185 215 C155 265, 65 255, 42 195" />
            <path d="M52 135 C75 75, 165 70, 195 130 C220 180, 175 245, 110 242 C55 240, 30 185, 52 135" />
            {/* Left scribble density */}
            <path d="M22 195 C38 180, 32 225, 50 205 C62 190, 44 238, 66 218 C75 210, 62 248, 82 232" />
            <path d="M18 175 C42 162, 26 212, 48 192 C60 180, 42 226, 62 206" />
          </g>
          {/* Clean white inner square framing title */}
          <rect
            x="64"
            y="138"
            width="112"
            height="42"
            fill="#FAF8F4"
            stroke="#1E1C19"
            strokeWidth="0.9"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center px-3">
          <span className="font-sans-ui text-[15px] sm:text-[17px] font-semibold tracking-tight text-[#B53732] bg-[#FAF8F4]/95 px-2.5 py-0.5">
            {title}
          </span>
        </div>
      </div>
    );
  }

  // Atomic Habits crisp radial gold dot cover matching the screenshot
  if (coverStyle === 'atomic' && !coverUrl) {
    const rings = [24, 34, 44, 54, 65, 76, 88];
    const dots: Array<{ x: number; y: number; r: number; o: number }> = [];
    rings.forEach((radius, ringIdx) => {
      const count = 14 + ringIdx * 6;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + ringIdx * 0.2;
        dots.push({
          x: 120 + Math.cos(angle) * radius,
          y: 160 + Math.sin(angle) * radius * 1.12,
          r: Math.max(0.8, 1.9 - ringIdx * 0.16),
          o: Math.max(0.35, 0.9 - ringIdx * 0.08),
        });
      }
    });

    return (
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#EFE9DC] border border-[#E2DAC9] shadow-[0_6px_18px_rgba(29,27,24,0.1)] select-none flex items-center justify-center ${className}`}
      >
        <svg viewBox="0 0 240 320" className="w-full h-full" aria-hidden="true">
          <rect width="240" height="320" fill="#EFE9DC" />
          {dots.map((d, idx) => (
            <circle
              key={idx}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill="#C79853"
              opacity={d.o}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="font-serif-display text-[22px] sm:text-[26px] leading-[1.08] font-semibold text-[#A77636] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {title.split(' ').map((word, idx) => (
              <span key={idx} className="block">
                {word}
              </span>
            ))}
          </span>
        </div>
      </div>
    );
  }

  // Photographic generated or custom URL cover
  if (coverUrl && !imgError) {
    return (
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#25211C] shadow-[0_6px_18px_rgba(29,27,24,0.14)] select-none ${className}`}
      >
        <img
          src={coverUrl}
          alt={`${title} book cover`}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {coverStyle === 'gita' && (
          <div className="absolute inset-x-0 top-0 pt-4 pb-6 px-3 bg-gradient-to-b from-black/75 via-black/35 to-transparent text-center">
            <p className="font-serif-display text-[15px] sm:text-[17px] tracking-[0.14em] uppercase font-semibold text-[#F4D58D] drop-shadow">
              {title}
            </p>
          </div>
        )}
        {coverStyle === 'meaning' && (
          <div className="absolute inset-x-0 top-0 pt-5 pb-10 px-3 bg-gradient-to-b from-[#0E1624]/85 via-[#0E1624]/45 to-transparent text-center">
            <p className="font-serif-display text-[14px] sm:text-[16px] leading-snug tracking-[0.12em] uppercase font-medium text-[#F3EFE6] drop-shadow">
              {title}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Fallback / Custom classic monograph cover
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-gradient-to-br from-[#2C2721] via-[#1F1C18] to-[#141210] border border-[#3E372E] shadow-[0_6px_18px_rgba(29,27,24,0.14)] p-4 flex flex-col justify-between text-[#F5EFE4] select-none ${className}`}
    >
      <div className="flex items-center justify-between text-[#D9A758]/80">
        <span className="text-[10px] uppercase tracking-[0.18em] font-medium">
          Soul &amp; Soch
        </span>
        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
      <div className="my-auto py-2 border-y border-[#D9A758]/25 text-center">
        <p className="font-serif-display text-lg font-semibold leading-snug text-[#FAF5EC] text-balance">
          {title}
        </p>
      </div>
      <p className="text-[11px] tracking-wide text-[#C4B8A5] text-center truncate">
        {author}
      </p>
    </div>
  );
};
