import { Book } from '../types';

export const SITE_URL = 'https://soul-soch.vercel.app';
export const SITE_NAME = 'Soul & Soch';
export const HOME_TITLE = 'Soul & Soch – Books, Wisdom, Quotes & Life Lessons';
export const HOME_DESCRIPTION =
  'Discover meaningful books, powerful quotes, timeless wisdom, Bhagavad Gita teachings and life-changing ideas with Soul & Soch.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/src/assets/images/hero_mountain_reader_1795361233616.jpg`;

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

export function injectBookSeoHtml(
  baseHtml: string,
  book: Pick<Book, 'id' | 'title' | 'author' | 'category' | 'subtitle' | 'summary' | 'coverUrl'>
): string {
  const title = escapeHtml(getBookSeoTitle(book));
  const description = escapeHtml(getBookSeoDescription(book));
  const canonical = escapeHtml(getBookCanonicalUrl(book.id));
  const image = escapeHtml(resolveBookImageUrl(book.coverUrl));
  const jsonLd = JSON.stringify(buildBookJsonLd(book)).replace(/<\/script/gi, '<\\/script');

  return baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<link\s+rel="canonical"[\s\S]*?\/>/,
      `<link rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:type"[\s\S]*?\/>/,
      `<meta property="og:type" content="book" />`
    )
    .replace(
      /<meta\s+property="og:url"[\s\S]*?\/>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta\s+property="og:image"[\s\S]*?\/>/,
      `<meta property="og:image" content="${image}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"[\s\S]*?\/>/,
      `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${description}" />`
    )
    .replace(
      /<meta\s+name="twitter:image"[\s\S]*?\/>/,
      `<meta name="twitter:image" content="${image}" />`
    )
    .replace(
      /<script id="soul-soch-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="soul-soch-jsonld" type="application/ld+json">${jsonLd}</script>`
    )
    .replace(
      /<noscript>[\s\S]*?<\/noscript>/,
      `<noscript><main style="max-width:760px;margin:2rem auto;padding:1rem;font-family:Georgia,serif;"><h1>${escapeHtml(book.title)}</h1><p>By ${escapeHtml(book.author)} &mdash; ${escapeHtml(book.category)}</p><p>${escapeHtml(book.summary)}</p><p><a href="/">Back to Soul &amp; Soch</a></p></main></noscript>`
    );
}

export function injectNotFoundSeoHtml(baseHtml: string, path: string): string {
  const title = `Book Not Found – ${SITE_NAME}`;
  const canonical = escapeHtml(`${SITE_URL}${path}`);

  return baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="robots"[\s\S]*?\/>/,
      `<meta name="robots" content="noindex, nofollow" />`
    )
    .replace(
      /<link\s+rel="canonical"[\s\S]*?\/>/,
      `<link rel="canonical" href="${canonical}" />`
    );
}

export interface SitemapBookEntry {
  id: string;
  lastmod?: string;
  featured?: boolean;
}

export function buildSitemapXml(entries: SitemapBookEntry[]): string {
  const seen = new Set<string>();
  const urlNodes: string[] = [
    `  <url>
    <loc>${escapeXml(`${SITE_URL}/`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
  ];

  for (const entry of entries) {
    if (!entry.id || seen.has(entry.id)) continue;
    seen.add(entry.id);
    const loc = escapeXml(getBookCanonicalUrl(entry.id));
    const lastmodTag = entry.lastmod
      ? `\n    <lastmod>${escapeXml(entry.lastmod.slice(0, 10))}</lastmod>`
      : '';
    const priority = entry.featured ? '0.9' : '0.8';
    urlNodes.push(`  <url>
    <loc>${loc}</loc>${lastmodTag}
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes.join('\n')}
</urlset>
`;
}

interface FirestoreRestDoc {
  name?: string;
  updateTime?: string;
  fields?: Record<
    string,
    {
      stringValue?: string;
      booleanValue?: boolean;
      integerValue?: string;
      doubleValue?: number;
      arrayValue?: { values?: Array<{ stringValue?: string }> };
    }
  >;
}

export interface FirestoreBookRecord extends Book {
  lastmod?: string;
}

export async function fetchBooksFromFirestoreRest(
  projectId: string,
  databaseId: string
): Promise<FirestoreBookRecord[] | null> {
  if (!projectId) return null;
  const dbId = databaseId || '(default)';
  const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/${encodeURIComponent(dbId)}/documents/books?pageSize=200`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { documents?: FirestoreRestDoc[] };
    const docs = data.documents;
    if (!Array.isArray(docs) || docs.length === 0) return null;

    const books: FirestoreBookRecord[] = docs
      .map((docItem): FirestoreBookRecord | null => {
        const docName = docItem.name || '';
        const id = docName.split('/').pop() || '';
        const f = docItem.fields || {};
        const title = f.title?.stringValue || '';
        const author = f.author?.stringValue || '';
        if (!id || !title || !author) return null;

        return {
          id,
          title,
          subtitle: f.subtitle?.stringValue || '',
          author,
          category: (f.category?.stringValue as Book['category']) || 'Books & Literature',
          coverUrl: f.coverUrl?.stringValue || '',
          coverStyle: (f.coverStyle?.stringValue as Book['coverStyle']) || 'custom',
          summary: f.summary?.stringValue || '',
          keyTakeaways:
            f.keyTakeaways?.arrayValue?.values
              ?.map((v) => v.stringValue || '')
              .filter(Boolean) || [],
          quote: f.quote?.stringValue || '',
          pdfUrl: f.pdfUrl?.stringValue || '',
          readTime: f.readTime?.stringValue || '10 min read',
          featured: Boolean(f.featured?.booleanValue),
          displayOrder: Number(f.displayOrder?.integerValue ?? f.displayOrder?.doubleValue ?? 0),
          lastmod: docItem.updateTime,
        };
      })
      .filter((item): item is FirestoreBookRecord => item !== null)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return books.length > 0 ? books : null;
  } catch {
    return null;
  }
}
