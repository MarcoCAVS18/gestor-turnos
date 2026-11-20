// scripts/gen-build-info.js
//
// Generates src/generated/buildInfo.json — the single source of truth for
// build-time metadata consumed by the app:
//   - version:    read from package.json (bump there, propagates everywhere)
//   - legalDates: last git commit date of each legal page, so the "Last updated"
//                 label reflects when the legal content actually changed.
//
// Runs automatically before `start` / `build` / `build:prod` (see the pre*
// scripts in package.json). Safe to commit the generated file; it is rewritten
// on every build.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const pkg = require(path.join(ROOT, 'package.json'));

// The page component and its translated text, in every language
const LEGAL_FILES = {
  terms: ['src/pages/legal/TermsOfService.jsx', 'src/locales/*/legal/terms.json'],
  privacy: ['src/pages/legal/PrivacyPolicy.jsx', 'src/locales/*/legal/privacy.json'],
};

// ISO date (YYYY-MM-DD); the legal pages format it in the reader's language
const formatDate = (date) => date.toISOString().slice(0, 10);

function lastCommitDate(files) {
  try {
    const paths = files.map((f) => `"${f}"`).join(' ');
    const iso = execSync(`git log -1 --format=%cI -- ${paths}`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    return iso ? formatDate(new Date(iso)) : formatDate(new Date());
  } catch {
    // No git history available (shallow clone, etc.) — fall back to today.
    return formatDate(new Date());
  }
}

const legalDates = {};
for (const [key, files] of Object.entries(LEGAL_FILES)) {
  legalDates[key] = lastCommitDate(files);
}

const buildInfo = { version: pkg.version, legalDates };

const dest = path.join(ROOT, 'src', 'generated', 'buildInfo.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, `${JSON.stringify(buildInfo, null, 2)}\n`);

console.log('[gen-build-info]', JSON.stringify(buildInfo));
