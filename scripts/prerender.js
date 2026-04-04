// scripts/prerender.js
// Pre-renders public routes to static HTML after `npm run build`.
// Usage:  npm run prerender   (or as part of npm run build:prod)
//
// How it works:
//  1. Starts a minimal static HTTP server serving the build/ directory
//  2. For each public route, loads the page in headless Chrome (puppeteer)
//  3. Blocks all Firebase/Google API requests so auth never hangs
//  4. Waits for React to fully render (#root > *)
//  5. Saves the resulting HTML to build/<route>/index.html
//  6. Firebase Hosting serves static files before applying rewrites,
//     so these pre-rendered files are served to Google on the first crawl.

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ─── Configuration ─────────────────────────────────────────────────────────
const BUILD_DIR = path.join(__dirname, '..', 'build');
const PORT = 3737;

// Custom user agent that AuthContext detects to skip Firebase loading
const PRERENDER_USER_AGENT = 'OraryPrerender';

// Public routes to pre-render (never include protected/auth-required routes)
const ROUTES = ['/', '/login', '/register', '/forgot-password'];

// Third-party domains to block (Firebase, Google APIs, analytics, payment)
const BLOCKED_DOMAINS = [
  'firebaseio.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'googleapis.com',
  'gstatic.com',
  'google-analytics.com',
  'googletagmanager.com',
  'stripe.com',
  'bigdatacloud.net',
  'frankfurter.app',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ─── Minimal static file server ────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let pathname = parsedUrl.pathname;

      // Normalize double slashes
      pathname = pathname.replace(/\/+/g, '/');

      let filePath = path.join(BUILD_DIR, pathname);

      // If no extension → SPA route → serve index.html
      if (!path.extname(pathname)) {
        // First check if a pre-rendered index.html exists for this route
        const routeIndex = path.join(BUILD_DIR, pathname, 'index.html');
        filePath = fs.existsSync(routeIndex)
          ? routeIndex
          : path.join(BUILD_DIR, 'index.html');
      }

      // Security: prevent directory traversal
      if (!filePath.startsWith(BUILD_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      if (!fs.existsSync(filePath)) {
        // Fallback to main index.html (SPA catch-all)
        filePath = path.join(BUILD_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Server error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    });

    server.listen(PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

// ─── Main pre-render function ───────────────────────────────────────────────
async function prerender() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌  build/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('\n🔧  Starting pre-render server...');
  const server = await startServer();
  console.log(`✅  Static server on http://localhost:${PORT}`);

  // Use system Chrome if available (faster than downloading Chromium)
  const systemChrome =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (() => {
      const candidates = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
      ];
      return candidates.find((p) => fs.existsSync(p));
    })();

  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
    ],
  };

  if (systemChrome) {
    launchOptions.executablePath = systemChrome;
    console.log(`🌐  Using Chrome: ${systemChrome}`);
  }

  const browser = await puppeteer.launch(launchOptions);
  console.log('\n🚀  Pre-rendering routes...\n');

  let successCount = 0;
  let failCount = 0;

  for (const route of ROUTES) {
    let page;
    try {
      page = await browser.newPage();

      // Set the custom user agent — detected by AuthContext to skip Firebase
      await page.setUserAgent(PRERENDER_USER_AGENT);

      // Force English so pre-rendered content matches the default locale
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
      await page.evaluateOnNewDocument(() => {
        localStorage.setItem('i18nextLng', 'en');
      });

      // Block third-party requests (Firebase, Analytics, Fonts, etc.)
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const reqUrl = request.url();
        const isLocal = reqUrl.startsWith(`http://localhost:${PORT}`);
        const isBlocked = !isLocal && BLOCKED_DOMAINS.some((d) => reqUrl.includes(d));
        if (isBlocked) {
          request.abort();
        } else {
          request.continue();
        }
      });

      // Suppress console noise from the page
      page.on('console', () => {});
      page.on('pageerror', () => {});

      const pageUrl = `http://localhost:${PORT}${route}`;
      process.stdout.write(`  📄  ${route.padEnd(25)}`);

      await page.goto(pageUrl, {
        waitUntil: 'networkidle0',
        timeout: 10000,
      });

      // Wait for React to render something inside #root
      await page.waitForSelector('#root > *', { timeout: 6000 }).catch(() => {
        // #root might still be empty if auth/loading blocks render
      });

      // Small stabilization delay for animations to settle
      await new Promise((r) => setTimeout(r, 300));

      const html = await page.content();

      // Determine output path
      let outputPath;
      if (route === '/') {
        outputPath = path.join(BUILD_DIR, 'index.html');
      } else {
        const dir = path.join(BUILD_DIR, route.replace(/^\//, ''));
        fs.mkdirSync(dir, { recursive: true });
        outputPath = path.join(dir, 'index.html');
      }

      fs.writeFileSync(outputPath, html, 'utf8');
      const sizeKb = Math.round(Buffer.byteLength(html, 'utf8') / 1024);
      console.log(`✅  saved (${sizeKb} KB)`);
      successCount++;
    } catch (err) {
      console.log(`❌  failed: ${err.message}`);
      failCount++;
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }

  await browser.close();
  server.close();

  console.log(`\n────────────────────────────────────────`);
  console.log(`Pre-render complete: ${successCount} ✅  ${failCount} ❌`);
  console.log(`────────────────────────────────────────\n`);

  if (failCount > 0) process.exit(1);
}

prerender().catch((err) => {
  console.error('\n❌  Pre-render fatal error:', err.message);
  process.exit(1);
});
