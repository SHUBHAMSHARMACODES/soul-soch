import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lightbulb, Mail } from 'lucide-react';
import { addSubscriber } from '../services/firestoreService';
import { AdSetting, AdSlotKey, Insight } from '../types';
import { AdSlot } from './AdSlot';

interface SidebarProps {
  weeklyWisdom?: Insight;
  adSettings: Record<AdSlotKey, AdSetting>;
  onQuickLinkClick: (tab: 'shloka' | 'free' | 'reading_list' | 'insight') => void;
  onAnchorClick?: (href: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  weeklyWisdom,
  adSettings,
  onQuickLinkClick,
  onAnchorClick,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    try {
      await addSubscriber(trimmed);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMsg('Could not subscribe right now. Please try again.');
    }
  };

  const quoteText =
    weeklyWisdom?.content ||
    'You are what you repeatedly do. Excellence, then, is not an act, but a habit.';
  const quoteAuthor = weeklyWisdom?.source || 'Aristotle';

  return (
    <aside className="space-y-6">
      {/* Weekly Wisdom Card */}
      <div className="bg-[#EFE9DC] border border-[#E3DAC6] rounded-xl p-6 shadow-[0_4px_20px_rgba(29,27,24,0.04)]">
        <div className="flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-[#CE8E37]" strokeWidth={1.8} />
          <h3 className="font-serif-display text-[21px] font-semibold text-[#1D1B18]">
            Weekly Wisdom
          </h3>
        </div>

        <blockquote className="mt-4">
          <p className="font-serif-display italic text-[17px] leading-[1.55] text-[#2A2621]">
            “{quoteText}”
          </p>
          <footer className="mt-2.5 text-[13.5px] font-semibold text-[#2A2621]">
            — {quoteAuthor}
          </footer>
        </blockquote>

        <div className="my-5 border-t border-[#DED5C1]" />

        <div>
          <h4 className="font-serif-display text-[17px] font-semibold text-[#1D1B18] mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-[14px]">
            <li>
              <button
                type="button"
                onClick={() => onQuickLinkClick('shloka')}
                className="inline-flex items-center gap-2 text-[#453E35] hover:text-[#B87D2F] transition-colors cursor-pointer group"
              >
                <span>Read Gita Shlokas</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B87D2F] transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickLinkClick('free')}
                className="inline-flex items-center gap-2 text-[#453E35] hover:text-[#B87D2F] transition-colors cursor-pointer group"
              >
                <span>Free Books Online</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B87D2F] transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickLinkClick('reading_list')}
                className="inline-flex items-center gap-2 text-[#453E35] hover:text-[#B87D2F] transition-colors cursor-pointer group"
              >
                <span>Curated Reading Lists</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B87D2F] transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickLinkClick('insight')}
                className="inline-flex items-center gap-2 text-[#453E35] hover:text-[#B87D2F] transition-colors cursor-pointer group"
              >
                <span>Thoughts &amp; Insights</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B87D2F] transition-transform group-hover:translate-x-0.5" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Card */}
      <div
        id="newsletter-box"
        className="bg-[#1C1A17] text-[#FAF7F0] rounded-xl p-6 shadow-[0_8px_24px_rgba(29,27,24,0.14)]"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg border border-[#3E3932] bg-[#26231F] shrink-0">
            <Mail className="w-4 h-4 text-[#E3AE59]" />
          </div>
          <div>
            <h3 className="font-serif-display text-[17px] font-semibold text-[#FAF7F0] leading-snug">
              Join our newsletter
            </h3>
            <p className="mt-1 text-[12.5px] leading-[1.45] text-[#C8BFB0]">
              Get weekly book recommendations, insights and ideas.
            </p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#2B2722] border border-[#494238] px-3.5 py-2.5 text-[13px] text-[#E8C88B]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Welcome to Soul &amp; Soch! You are subscribed.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row lg:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg bg-[#FAF7F0] text-[#1D1B18] text-[13px] placeholder-[#827A6E] focus:outline-none focus:ring-2 focus:ring-[#E3AE59]"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-4 py-2.5 rounded-lg bg-[#D69B46] hover:bg-[#C68934] text-[#1D1B18] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              {status === 'submitting' ? 'Saving...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && errorMsg && (
          <p className="mt-2 text-xs text-[#F29D94]">{errorMsg}</p>
        )}
      </div>

      {/* Sidebar Ad Placement */}
      <AdSlot
        variant="sidebar"
        setting={adSettings.slot_sidebar}
        globalAdsense={adSettings.adsense_global}
        onAnchorClick={onAnchorClick}
      />
    </aside>
  );
};
