import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { AdSetting } from '../types';

interface AdSlotProps {
  setting?: AdSetting;
  globalAdsense?: AdSetting;
  variant: 'banner' | 'sidebar' | 'reader';
  onAnchorClick?: (href: string) => void;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({
  setting,
  globalAdsense,
  variant,
  onAnchorClick,
}) => {
  const adPushed = useRef(false);

  const clientId = setting?.adsenseClientId || globalAdsense?.adsenseClientId || '';
  const slotId = setting?.adsenseSlotId || '';
  const shouldRenderAdSense =
    Boolean(setting?.enabled) &&
    setting?.mode === 'adsense' &&
    Boolean(clientId) &&
    Boolean(slotId);

  useEffect(() => {
    if (!shouldRenderAdSense || !clientId) return;

    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        clientId
      )}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    if (!adPushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushed.current = true;
      } catch {
        // Ignore AdSense push timing before script loads
      }
    }
  }, [shouldRenderAdSense, clientId]);

  if (!setting || !setting.enabled) {
    return null;
  }

  if (shouldRenderAdSense) {
    return (
      <div
        className={`rounded-xl border border-[#E7E0D3] bg-[#FBF9F5] p-3 text-center overflow-hidden ${
          variant === 'banner' ? 'w-full min-h-[100px]' : ''
        } ${variant === 'sidebar' ? 'w-full min-h-[250px]' : ''} ${
          variant === 'reader' ? 'w-full min-h-[100px] my-6' : ''
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#8B8273] mb-1.5">
          Advertisement
        </p>
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Editorial Sponsor / Partner Ad Card
  const handleLinkClick = (e: React.MouseEvent) => {
    const url = setting.sponsorUrl || '';
    if (url.startsWith('#') && onAnchorClick) {
      e.preventDefault();
      onAnchorClick(url);
    }
  };

  if (variant === 'sidebar') {
    return (
      <aside className="rounded-xl border border-[#E5DEC9] bg-[#FBF9F4] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.16em] font-medium text-[#8C8375]">
            Sponsored
          </span>
        </div>
        {setting.sponsorImageUrl && (
          <div className="mb-3 rounded-lg overflow-hidden border border-[#EAE2D3] aspect-[16/10] bg-[#EFE9DC]">
            <img
              src={setting.sponsorImageUrl}
              alt={setting.sponsorTitle || 'Sponsored partner'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h4 className="font-serif-display text-[17px] font-semibold text-[#1D1B18] leading-snug">
          {setting.sponsorTitle || 'Partner Recommendation'}
        </h4>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#5F584D]">
          {setting.sponsorDescription}
        </p>
        {setting.sponsorUrl && (
          <a
            href={setting.sponsorUrl}
            target={setting.sponsorUrl.startsWith('#') ? undefined : '_blank'}
            rel={setting.sponsorUrl.startsWith('#') ? undefined : 'noopener noreferrer'}
            onClick={handleLinkClick}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#EFE7D6] hover:bg-[#E4B363] text-[#1D1B18] text-[12.5px] font-semibold transition-colors"
          >
            <span>{setting.sponsorCtaText || 'Learn More'}</span>
            {!setting.sponsorUrl.startsWith('#') && <ExternalLink className="w-3.5 h-3.5" />}
          </a>
        )}
      </aside>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[#E5DEC9] bg-[#FBF9F4] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        variant === 'reader' ? 'my-6' : ''
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        {setting.sponsorImageUrl && (
          <img
            src={setting.sponsorImageUrl}
            alt={setting.sponsorTitle || 'Sponsor'}
            referrerPolicy="no-referrer"
            className="w-16 h-12 rounded-md object-cover border border-[#EAE2D3] shrink-0"
          />
        )}
        <div className="min-w-0">
          <span className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[#8C8375]">
            Sponsored
          </span>
          <h4 className="font-serif-display text-[16px] font-semibold text-[#1D1B18] truncate">
            {setting.sponsorTitle || 'Featured Reading Partner'}
          </h4>
          <p className="text-[12.5px] text-[#5F584D] line-clamp-1">
            {setting.sponsorDescription}
          </p>
        </div>
      </div>

      {setting.sponsorUrl && (
        <a
          href={setting.sponsorUrl}
          target={setting.sponsorUrl.startsWith('#') ? undefined : '_blank'}
          rel={setting.sponsorUrl.startsWith('#') ? undefined : 'noopener noreferrer'}
          onClick={handleLinkClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1D1B18] hover:bg-[#34302A] text-[#FAF7F0] text-[12.5px] font-medium transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <span>{setting.sponsorCtaText || 'Explore'}</span>
          {!setting.sponsorUrl.startsWith('#') && <ExternalLink className="w-3.5 h-3.5" />}
        </a>
      )}
    </div>
  );
};
