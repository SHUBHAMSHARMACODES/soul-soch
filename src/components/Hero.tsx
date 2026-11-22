import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HERO_IMAGE_PATH } from '../data/defaultBooks';

interface HeroProps {
  onExploreBooks: () => void;
  onWatchIntro: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreBooks, onWatchIntro }) => {
  return (
    <section className="relative overflow-hidden bg-[#171411] text-[#FAF7F0]">
      {/* Atmospheric Mountain Cliff Reader Backdrop (mirrored so reader rests right-of-center) */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE_PATH}
          alt="Reader sitting on a mountain cliff at golden hour"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-x-[-1]"
        />
        {/* Measured contrast scrim for crisp headline legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100E]/92 via-[#161310]/65 to-[#161310]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E]/65 via-transparent to-[#12100E]/30" />
      </div>

      <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-8 pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          {/* Left Hero Typography & Actions */}
          <div className="max-w-[600px]">
            <h1 className="font-serif-display text-[42px] sm:text-[54px] lg:text-[62px] leading-[1.06] tracking-[-0.015em] font-medium text-[#FAF7F0] text-balance">
              Read <span className="italic text-[#E8B86B] font-normal">Beyond</span> Words.
              <br />
              Think <span className="italic text-[#E8B86B] font-normal">Beyond</span> Beliefs.
            </h1>

            <p className="mt-5 text-[16px] sm:text-[18px] leading-[1.6] text-[#E6DFD3] max-w-[520px] font-normal">
              Discover timeless wisdom from books, the Bhagavad Gita, philosophy and psychology — and find ideas that truly matter in your life.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={onExploreBooks}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E3AE59] hover:bg-[#D49D45] text-[#1D1B18] text-[15px] font-semibold transition-colors shadow-[0_6px_20px_rgba(227,174,89,0.28)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Books</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onWatchIntro}
                className="inline-flex items-center gap-3 text-[15px] font-medium text-[#FAF7F0] hover:text-[#E8B86B] transition-colors whitespace-nowrap shrink-0 cursor-pointer group"
              >
                <span className="w-10 h-10 rounded-full border border-[#FAF7F0]/55 group-hover:border-[#E8B86B] flex items-center justify-center bg-black/25 backdrop-blur-xs transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>Watch Introduction</span>
              </button>
            </div>
          </div>

          {/* Right Socrates Quote */}
          <div className="lg:self-center lg:pr-4 max-w-[300px]">
            <blockquote className="text-left lg:text-right">
              <p className="font-serif-display italic text-[22px] sm:text-[25px] leading-[1.35] text-[#F5EFE4]/95">
                <span className="text-[#E8B86B] not-italic text-3xl leading-none mr-1">“</span>
                The unexamined life is not worth living.
                <span className="text-[#E8B86B] not-italic text-2xl leading-none ml-0.5">”</span>
              </p>
              <footer className="mt-3 text-[14px] text-[#D4CBB9] tracking-wide">
                <span className="inline-block w-4 h-[1px] bg-[#D4CBB9]/60 align-middle mr-2" />
                <span className="underline decoration-[#D4CBB9]/40 underline-offset-4">Socrates</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
