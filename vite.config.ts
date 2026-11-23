import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {DEFAULT_BOOKS} from './src/data/defaultBooks';
import {
  buildBookJsonLd,
  getBookCanonicalUrl,
  getBookSeoDescription,
  getBookSeoTitle,
  resolveBookImageUrl,
} from './src/seo/seoConfig';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
      // Generates pre-rendered SEO HTML pages at dist/books/<id>/index.html
      // so crawlers and social bots get unique per-book meta tags, canonical URLs,
      // and Book + BreadcrumbList JSON-LD directly with HTTP 200 OK.
      {
        name: 'generate-book-seo-pages',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const indexHtmlPath = path.join(distDir, 'index.html');
          if (!fs.existsSync(indexHtmlPath)) {
            return;
          }

          const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

          for (const book of DEFAULT_BOOKS) {
            const title = escapeHtml(getBookSeoTitle(book));
            const description = escapeHtml(getBookSeoDescription(book));
            const canonical = escapeHtml(getBookCanonicalUrl(book.id));
            const image = escapeHtml(resolveBookImageUrl(book.coverUrl));
            const jsonLd = JSON.stringify(buildBookJsonLd(book));

            let pageHtml = baseHtml
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
