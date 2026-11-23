import { Book } from '../types';

export const SITE_URL = 'https://soul-soch.vercel.app';
export const SITE_NAME = 'Soul & Soch';
export const HOME_TITLE = 'Soul & Soch – Books, Wisdom, Quotes & Life Lessons';
export const HOME_DESCRIPTION =
  'Discover meaningful books, powerful quotes, timeless wisdom, Bhagavad Gita teachings and life-changing ideas with Soul & Soch.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/src/assets/images/hero_mountain_reader_1795361233616.jpg`;

export function getBookCanonicalUrl(bookId: string): string {
  return `${SITE_URL}/books/${encodeURIComponent(bookId)}`;
}

export function getBookSeoTitle(book: Pick<Book, 'title' | 'author'>): string {
  return `${book.title} by ${book.author} – Book Summary & Wisdom | ${SITE_NAME}`;
}

export function getBookSeoDescription(
  book: Pick<Book, 'title' | 'author' | 'subtitle' | 'summary'>
): string {
  const firstParagraph = book.summary
    .split(/\n\s*\n/)[0]
    ?.replace(/\s+/g, ' ')
    .trim();

  const raw = book.subtitle
    ? `Read the summary and key lessons from ${book.title} by ${book.author}. ${book.subtitle} ${firstParagraph || ''}`
    : `Read the summary and key lessons from ${book.title} by ${book.author}. ${firstParagraph || ''}`;

  const normalized = raw.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 158) {
    return normalized;
  }
  return `${normalized.slice(0, 155).replace(/\s+\S*$/, '')}...`;
}

export function resolveBookImageUrl(coverUrl?: string): string {
  if (!coverUrl) return DEFAULT_OG_IMAGE;
  if (coverUrl.startsWith('https://') || coverUrl.startsWith('http://')) {
    return coverUrl;
  }
  if (coverUrl.startsWith('/')) {
    return `${SITE_URL}${coverUrl}`;
  }
  return DEFAULT_OG_IMAGE;
}

export function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        inLanguage: 'en',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: HOME_DESCRIPTION,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
        },
      },
    ],
  };
}

export function buildBookJsonLd(
  book: Pick<Book, 'id' | 'title' | 'author' | 'category' | 'subtitle' | 'summary' | 'coverUrl'>
) {
  const canonicalUrl = getBookCanonicalUrl(book.id);
  const description = getBookSeoDescription(book);

  const bookNode: Record<string, unknown> = {
    '@type': 'Book',
    '@id': `${canonicalUrl}#book`,
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    description,
    genre: book.category,
    url: canonicalUrl,
    inLanguage: 'en',
  };

  if (book.coverUrl) {
    bookNode.image = resolveBookImageUrl(book.coverUrl);
  }

  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: book.title,
        item: canonicalUrl,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: getBookSeoTitle(book),
        description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        breadcrumb: {
          '@id': `${canonicalUrl}#breadcrumb`,
        },
        mainEntity: {
          '@id': `${canonicalUrl}#book`,
        },
      },
      bookNode,
      breadcrumbNode,
    ],
  };
}
