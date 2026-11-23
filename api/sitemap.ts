import fs from 'fs';
import path from 'path';
import { DEFAULT_BOOKS } from '../src/data/defaultBooks';
import {
  buildSitemapXml,
  fetchBooksFromFirestoreRest,
  SitemapBookEntry,
} from '../src/seo/seoConfig';

interface VercelRequest {
  method?: string;
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

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const { projectId, databaseId } = resolveFirebaseIds();
  const liveBooks = await fetchBooksFromFirestoreRest(projectId, databaseId);
  const sourceBooks = liveBooks && liveBooks.length > 0 ? liveBooks : DEFAULT_BOOKS;

  const entries: SitemapBookEntry[] = sourceBooks.map((book) => ({
    id: book.id,
    featured: book.featured,
    lastmod:
      'lastmod' in book && typeof book.lastmod === 'string'
        ? book.lastmod
        : undefined,
  }));

  const xml = buildSitemapXml(entries);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=3600'
  );
  res.status(200).send(xml);
}
