#!/usr/bin/env node
/**
 * scripts/gsc-check.js
 * Google Search Console CLI — uses existing Google OAuth credentials from functions/.env
 *
 * SETUP (one-time):
 *   In Google Cloud Console → APIs & Services → Credentials → edit your OAuth 2.0 Client:
 *   Add  http://localhost:3333  to "Authorized redirect URIs"
 *
 * USAGE:
 *   node scripts/gsc-check.js           → inspect key URLs + list sitemaps
 *   node scripts/gsc-check.js check     → same as above
 *   node scripts/gsc-check.js sitemaps  → list sitemaps only
 *   node scripts/gsc-check.js submit    → submit sitemap.xml
 *   node scripts/gsc-check.js logout    → clear saved token
 */

const path  = require('path');
const fs    = require('fs');
const http  = require('http');
const { google } = require('../functions/node_modules/googleapis');

// ─── Config ──────────────────────────────────────────────────────────────────

const SITE_URL    = 'sc-domain:orary.app';
const SITEMAP_URL = 'https://orary.app/sitemap.xml';
const PORT        = 3333;
const REDIRECT    = `http://localhost:${PORT}`;
const TOKEN_FILE  = path.join(__dirname, '.gsc-token.json');
const SCOPES      = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/webmasters.readonly',
];
const URLS_TO_CHECK = [
  'https://orary.app/',
  'https://orary.app/terms',
  'https://orary.app/privacy',
  'https://orary.app/australia-88',
  'https://orary.app/faq',
];

// ─── Read credentials from functions/.env ────────────────────────────────────

const envPath = path.join(__dirname, '../functions/.env');
if (!fs.existsSync(envPath)) {
  console.error('❌  functions/.env not found. Cannot read Google credentials.');
  process.exit(1);
}

const envVars = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const eq = line.indexOf('=');
  if (eq > 0) {
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim();
    envVars[k] = v;
  }
});

const CLIENT_ID     = envVars.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = envVars.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌  GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing in functions/.env');
  process.exit(1);
}

// ─── OAuth client ─────────────────────────────────────────────────────────────

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);

// ─── Token helpers ────────────────────────────────────────────────────────────

function loadToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      const tok = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
      oauth2Client.setCredentials(tok);
      // Auto-refresh when token expires
      oauth2Client.on('tokens', updated => saveToken({ ...tok, ...updated }));
      return true;
    } catch { /* corrupt file */ }
  }
  return false;
}

function saveToken(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

// ─── OAuth flow via local callback server ─────────────────────────────────────

async function authenticate() {
  if (loadToken() && oauth2Client.credentials?.access_token) return;

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n─────────────────────────────────────────────────────────────');
  console.log(' SETUP REMINDER (one-time, if not done):');
  console.log('   Google Cloud Console → Credentials → your OAuth 2.0 Client');
  console.log(`   Add to Authorized redirect URIs:  ${REDIRECT}`);
  console.log('─────────────────────────────────────────────────────────────\n');
  console.log('Opening browser for Google authorization...\n');

  // Try to open the browser automatically
  try {
    const open = (await import('open').catch(() => null));
    if (open?.default) await open.default(authUrl);
    else throw new Error('no open module');
  } catch {
    console.log('If the browser did not open, paste this URL manually:\n');
    console.log(authUrl);
  }

  console.log('\nWaiting for authorization...');

  const tokens = await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const reqUrl = new URL(req.url, `http://localhost:${PORT}/`);
      const code   = reqUrl.searchParams.get('code');
      const error  = reqUrl.searchParams.get('error');

      if (error) {
        res.end('<h1 style="font-family:sans-serif;color:red">Authorization denied. You can close this tab.</h1>');
        server.close();
        reject(new Error(`Authorization denied: ${error}`));
        return;
      }

      if (code) {
        res.end('<h1 style="font-family:sans-serif;color:green">Authorization successful! You can close this tab.</h1>');
        server.close();
        try {
          const { tokens } = await oauth2Client.getToken(code);
          resolve(tokens);
        } catch (err) {
          reject(err);
        }
      }
    });

    server.listen(PORT, () => {});
    server.on('error', reject);
    // Timeout after 5 minutes
    setTimeout(() => { server.close(); reject(new Error('Authorization timed out (5 min)')); }, 5 * 60 * 1000);
  });

  oauth2Client.setCredentials(tokens);
  saveToken(tokens);
  console.log('Authorization successful. Token saved.\n');
}

// ─── GSC operations ───────────────────────────────────────────────────────────

async function inspectUrls() {
  const sc  = google.searchconsole({ version: 'v1', auth: oauth2Client });

  console.log('═══ URL Inspection ════════════════════════════════════════════\n');

  for (const inspectionUrl of URLS_TO_CHECK) {
    try {
      const res = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl, siteUrl: SITE_URL },
      });

      const idx = res.data.inspectionResult?.indexStatusResult;
      const verdict = idx?.verdict ?? 'UNKNOWN';
      const icon = verdict === 'PASS' ? '✅' : verdict === 'NEUTRAL' ? '⚠️ ' : '❌';

      console.log(`${icon}  ${inspectionUrl}`);
      console.log(`    Verdict:            ${verdict}`);
      console.log(`    Coverage state:     ${idx?.coverageState ?? 'N/A'}`);
      console.log(`    Google canonical:   ${idx?.googleCanonical ?? 'N/A'}`);
      console.log(`    User canonical:     ${idx?.userCanonical ?? 'N/A'}`);
      console.log(`    Last crawl:         ${idx?.lastCrawlTime ?? 'Not yet crawled'}`);
      if (idx?.robotsTxtState) console.log(`    robots.txt:         ${idx.robotsTxtState}`);
      if (idx?.indexingState)  console.log(`    Indexing state:     ${idx.indexingState}`);
      console.log();
    } catch (err) {
      console.log(`❌  ${inspectionUrl}`);
      console.log(`    Error: ${err.message}\n`);
    }
  }
}

async function listSitemaps() {
  const wm = google.webmasters({ version: 'v3', auth: oauth2Client });

  console.log('═══ Sitemaps ══════════════════════════════════════════════════\n');
  try {
    const res = await wm.sitemaps.list({ siteUrl: SITE_URL });
    const maps = res.data.sitemap;

    if (!maps || maps.length === 0) {
      console.log('⚠️   No sitemaps found for', SITE_URL);
      console.log('    Run:  node scripts/gsc-check.js submit  to submit sitemap.xml\n');
      return;
    }

    for (const s of maps) {
      const urls      = s.contents?.[0];
      const submitted = urls?.submitted ?? '?';
      const indexed   = urls?.indexed   ?? '?';
      const icon      = indexed > 0 ? '✅' : '⚠️ ';
      console.log(`${icon}  ${s.path}`);
      console.log(`    Last submitted:  ${s.lastSubmitted ?? 'N/A'}`);
      console.log(`    Last downloaded: ${s.lastDownloaded ?? 'N/A'}`);
      console.log(`    URLs submitted:  ${submitted}`);
      console.log(`    URLs indexed:    ${indexed}`);
      console.log();
    }
  } catch (err) {
    console.log('❌  Error listing sitemaps:', err.message, '\n');
  }
}

async function submitSitemap() {
  const wm = google.webmasters({ version: 'v3', auth: oauth2Client });
  console.log(`Submitting ${SITEMAP_URL} ...`);
  try {
    await wm.sitemaps.submit({ siteUrl: SITE_URL, feedpath: SITEMAP_URL });
    console.log('✅  Sitemap submitted successfully.\n');
    console.log('    Google may take a few days to process it.');
  } catch (err) {
    console.log('❌  Error submitting sitemap:', err.message);
    if (err.message.includes('403') || err.message.includes('not verified')) {
      console.log('\n    Make sure https://orary.app/ is verified as a property in GSC first.');
    }
  }
}

async function logout() {
  if (fs.existsSync(TOKEN_FILE)) {
    fs.unlinkSync(TOKEN_FILE);
    console.log('✅  Token cleared. Next run will ask for authorization again.');
  } else {
    console.log('No saved token found.');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function submitIndexNow() {
  const INDEXNOW_KEY = 'fff1a922bd2b201aa08441f60b5cfcf9';
  const KEY_LOCATION = `https://orary.app/${INDEXNOW_KEY}.txt`;

  const body = JSON.stringify({
    host: 'orary.app',
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS_TO_CHECK,
  });

  // IndexNow endpoint — notifies Bing, Yandex, and other participants simultaneously
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  console.log('═══ IndexNow Submission ════════════════════════════════════════\n');
  console.log('URLs:', URLS_TO_CHECK.join(', '));
  console.log();

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });

      const engine = endpoint.includes('bing') ? 'Bing' : 'IndexNow (Bing + Yandex + others)';
      if (res.status === 200 || res.status === 202) {
        console.log(`✅  ${engine} — accepted (${res.status})`);
      } else if (res.status === 400) {
        console.log(`⚠️   ${engine} — invalid request (400). Check key file is deployed.`);
      } else if (res.status === 403) {
        console.log(`❌  ${engine} — key not verified (403). Deploy the key file first.`);
      } else if (res.status === 422) {
        console.log(`⚠️   ${engine} — URL not belonging to host (422).`);
      } else if (res.status === 429) {
        console.log(`⚠️   ${engine} — too many requests (429). Try again later.`);
      } else {
        console.log(`⚠️   ${engine} — status ${res.status}`);
      }
    } catch (err) {
      console.log(`❌  ${err.message}`);
    }
  }

  console.log('\nCoverage: Bing, DuckDuckGo, Yahoo (all use Bing index) + Yandex\n');
}

async function listSites() {
  const wm = google.webmasters({ version: 'v3', auth: oauth2Client });
  console.log('═══ Verified Sites in GSC ══════════════════════════════════════\n');
  try {
    const res = await wm.sites.list();
    const sites = res.data.siteEntry;
    if (!sites || sites.length === 0) {
      console.log('No verified sites found for this account.\n');
      return;
    }
    for (const s of sites) {
      const isOrary = s.siteUrl.includes('orary');
      console.log(`${isOrary ? '→ ' : '  '}${s.siteUrl}  (permission: ${s.permissionLevel})`);
    }
    console.log('\nCopy the exact URL marked with → and update SITE_URL in the script.');
  } catch (err) {
    console.log('❌  Error:', err.message);
  }
}

async function main() {
  const cmd = process.argv[2] ?? 'check';

  if (cmd === 'logout') { await logout(); return; }

  await authenticate();

  switch (cmd) {
    case 'check':
      await inspectUrls();
      await listSitemaps();
      break;
    case 'sitemaps':
      await listSitemaps();
      break;
    case 'submit':
      await submitSitemap();
      break;
    case 'sites':
      await listSites();
      break;
    case 'indexnow':
      await submitIndexNow();
      break;
    default:
      console.log('Usage: node scripts/gsc-check.js [check|sitemaps|submit|sites|indexnow|logout]');
  }
}

main().catch(err => { console.error('Fatal error:', err.message); process.exit(1); });
