import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {DEFAULT_BOOKS} from './src/data/defaultBooks';
import {
  buildSitemapXml,
  fetchBooksFromFirestoreRest,
  injectBookSeoHtml,
  SitemapBookEntry,
} from './src/seo/seoConfig';

function cleanEnv(val?: string): string {
  return (val || '').replace(/[\s"']/g, '');
}

function resolveBuildFirebaseIds(rootDir: string): {
  projectId: string;
  databaseId: string;
} {
  let projectId = cleanEnv(process.env.VITE_FIREBASE_PROJECT_ID);
  let databaseId = cleanEnv(process.env.VITE_FIREBASE_DATABASE_ID);

  if (!projectId) {
    const configPath = path.resolve(rootDir, 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as {
          projectId?: string;
          firestoreDatabaseId?: string;
        };
        projectId = cleanEnv(parsed.projectId);
        databaseId = cleanEnv(parsed.firestoreDatabaseId);
      } catch {
        // Ignore parse error
      }
    }
  }

  return {
    projectId,
    databaseId: databaseId || '(default)',
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
      // Serves dynamic /sitemap.xml during local Vite dev/preview
      {
        name: 'dynamic-sitemap-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/sitemap.xml', async (_req, res) => {
            const {projectId, databaseId} = resolveBuildFirebaseIds(__dirname);
            const liveBooks = await fetchBooksFromFirestoreRest(
              projectId,
              databaseId
            );
            const sourceBooks =
              liveBooks && liveBooks.length > 0 ? liveBooks : DEFAULT_BOOKS;
            const entries: SitemapBookEntry[] = sourceBooks.map((b) => ({
              id: b.id,
              featured: b.featured,
              lastmod:
                'lastmod' in b && typeof b.lastmod === 'string'
                  ? b.lastmod
                  : undefined,
            }));
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.end(buildSitemapXml(entries));
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use('/sitemap.xml', async (_req, res) => {
            const {projectId, databaseId} = resolveBuildFirebaseIds(__dirname);
            const liveBooks = await fetchBooksFromFirestoreRest(
              projectId,
              databaseId
            );
            const sourceBooks =
              liveBooks && liveBooks.length > 0 ? liveBooks : DEFAULT_BOOKS;
            const entries: SitemapBookEntry[] = sourceBooks.map((b) => ({
              id: b.id,
              featured: b.featured,
              lastmod:
                'lastmod' in b && typeof b.lastmod === 'string'
                  ? b.lastmod
                  : undefined,
            }));
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.end(buildSitemapXml(entries));
          });
        },
      },
      // Pre-renders static SEO HTML pages at dist/books/<id>/index.html
      // from Firestore + starter books at build time.
      {
        name: 'generate-book-seo-pages',
        apply: 'build',
        async closeBundle(error?: Error): Promise<void> {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const indexHtmlPath = path.join(distDir, 'index.html');
          if (!fs.existsSync(indexHtmlPath)) {
            return;
          }

          const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
          const {projectId, databaseId} = resolveBuildFirebaseIds(__dirname);
          const liveBooks = await fetchBooksFromFirestoreRest(
            projectId,
            databaseId
          );

          const mergedMap = new Map<string, (typeof DEFAULT_BOOKS)[number]>();
          for (const book of DEFAULT_BOOKS) {
            mergedMap.set(book.id, book);
          }
          if (liveBooks) {
            for (const book of liveBooks) {
              mergedMap.set(book.id, book);
            }
          }

          for (const book of mergedMap.values()) {
            const pageHtml = injectBookSeoHtml(baseHtml, book);
            const bookDir = path.join(distDir, 'books', book.id);
            fs.mkdirSync(bookDir, {recursive: true});
            fs.writeFileSync(path.join(bookDir, 'index.html'), pageHtml, 'utf-8');
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('node_modules/react')) {
              return 'vendor-react';
            }
            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
