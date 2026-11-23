import fs from 'fs';
import path from 'path';
import { DEFAULT_BOOKS } from '../src/data/defaultBooks';
import {
  fetchBooksFromFirestoreRest,
  injectBookSeoHtml,
  injectNotFoundSeoHtml,
  SITE_URL,
} from '../src/seo/seoConfig';

interface VercelRequest {
  query?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

function cleanEnv(val?: string): string {
  return (val || '').replace(/[\s"']/g, '');
}

function resolveFirebaseIds(): { projectId: string; databaseId: string } {
  let projectId = cleanEnv(process.env.VITE_FIREBASE_PROJECT_ID);
  let databaseId = cleanEnv(process.env.VITE_FIREBASE_DATABASE_ID);

  if (!projectId) {
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as {
          projectId?: string;
          firestoreDatabaseId?: string;
        };
        projectId = cleanEnv(parsed.projectId);
        databaseId = cleanEnv(parsed.firestoreDatabaseId);
      }
    } catch {
      // Ignore config read error
    }
  }

  return {
    projectId,
    databaseId: databaseId || '(default)',
  };
}

let cachedIndexHtml: string | null = null;

async function loadBaseIndexHtml(): Promise<string | null> {
  if (cachedIndexHtml) return cachedIndexHtml;

  const localDistPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(localDistPath)) {
    cachedIndexHtml = fs.readFileSync(localDistPath, 'utf-8');
    return cachedIndexHtml;
  }

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : SITE_URL;

  try {
    const resp = await fetch(`${origin}/index.html`);
    if (!resp.ok) return null;
    cachedIndexHtml = await resp.text();
    return cachedIndexHtml;
  } catch {
    return null;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const rawSlug = Array.isArray(req.query?.slug)
    ? req.query?.slug[0]
    : req.query?.slug;
  const slug = (rawSlug || '').trim();

  const baseHtml = await loadBaseIndexHtml();
  if (!baseHtml) {
    res.status(500).send('Unable to load application shell.');
    return;
  }

  if (!slug || !/^[a-zA-Z0-9_-]{1,128}$/.test(slug)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(404).send(injectNotFoundSeoHtml(baseHtml, `/books/${slug}`));
    return;
  }

  const { projectId, databaseId } = resolveFirebaseIds();
  const liveBooks = await fetchBooksFromFirestoreRest(projectId, databaseId);
  const catalog = liveBooks && liveBooks.length > 0 ? liveBooks : DEFAULT_BOOKS;
  const matchedBook = catalog.find((b) => b.id === slug);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!matchedBook) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(404).send(injectNotFoundSeoHtml(baseHtml, `/books/${slug}`));
    return;
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=3600'
  );
  res.status(200).send(injectBookSeoHtml(baseHtml, matchedBook));
}
