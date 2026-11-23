import React, { useEffect } from 'react';
import { Book } from '../types';
import {
  buildBookJsonLd,
  buildHomeJsonLd,
  DEFAULT_OG_IMAGE,
  getBookCanonicalUrl,
  getBookSeoDescription,
  getBookSeoTitle,
  HOME_DESCRIPTION,
  HOME_TITLE,
  resolveBookImageUrl,
  SITE_NAME,
  SITE_URL,
} from '../seo/seoConfig';

interface SeoManagerProps {
  activeBook: Book | null;
  isAdmin: boolean;
  notFoundSlug?: string | null;
}

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLd(data: Record<string, unknown> | null) {
  const scriptId = 'soul-soch-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!data) {
    if (script) script.remove();
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export const SeoManager: React.FC<SeoManagerProps> = ({
  activeBook,
  isAdmin,
  notFoundSlug,
}) => {
  useEffect(() => {
    if (isAdmin) {
      document.title = `Curator Studio – ${SITE_NAME}`;
      upsertMeta('name', 'robots', 'noindex, nofollow');
      upsertMeta('name', 'description', 'Private Curator Studio for Soul & Soch.');
      upsertCanonical(`${SITE_URL}/admin`);
      upsertJsonLd(null);
      return;
    }

    if (notFoundSlug) {
      document.title = `Book Not Found – ${SITE_NAME}`;
      upsertMeta('name', 'robots', 'noindex, nofollow');
      upsertMeta('name', 'description', HOME_DESCRIPTION);
      upsertCanonical(getBookCanonicalUrl(notFoundSlug));
      upsertJsonLd(null);
      return;
    }

    if (activeBook) {
      const title = getBookSeoTitle(activeBook);
      const description = getBookSeoDescription(activeBook);
      const canonical = getBookCanonicalUrl(activeBook.id);
      const image = resolveBookImageUrl(activeBook.coverUrl);

      document.title = title;
      upsertMeta('name', 'description', description);
      upsertMeta(
        'name',
        'robots',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
      upsertCanonical(canonical);

      upsertMeta('property', 'og:type', 'book');
      upsertMeta('property', 'og:site_name', SITE_NAME);
      upsertMeta('property', 'og:url', canonical);
      upsertMeta('property', 'og:title', title);
      upsertMeta('property', 'og:description', description);
      upsertMeta('property', 'og:image', image);

      upsertMeta('name', 'twitter:card', 'summary_large_image');
      upsertMeta('name', 'twitter:title', title);
      upsertMeta('name', 'twitter:description', description);
      upsertMeta('name', 'twitter:image', image);

      upsertJsonLd(buildBookJsonLd(activeBook));
      return;
    }

    const homeCanonical = `${SITE_URL}/`;
    document.title = HOME_TITLE;
    upsertMeta('name', 'description', HOME_DESCRIPTION);
    upsertMeta(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    upsertCanonical(homeCanonical);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:url', homeCanonical);
    upsertMeta('property', 'og:title', HOME_TITLE);
    upsertMeta('property', 'og:description', HOME_DESCRIPTION);
    upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', HOME_TITLE);
    upsertMeta('name', 'twitter:description', HOME_DESCRIPTION);
    upsertMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);

    upsertJsonLd(buildHomeJsonLd());
  }, [activeBook, isAdmin, notFoundSlug]);

  return null;
};
