// scripts/copy-ocr-assets.js
// Copies the OCR (tesseract.js) worker, WebAssembly core and English language
// data into public/tesseract/ so scanned payslips are read from our own origin.
//
// Why: by default tesseract.js downloads these from cdn.jsdelivr.net and starts
// its worker from a blob: URL. The site's Content-Security-Policy (firebase.json)
// allows neither, so OCR silently failed on the web (verified 2026-11-18 with
// docs/audit-tools/ocr-csp-check.js). Serving them same-origin also avoids
// loading third-party code. Runs before start/build (see package.json).
// Output is gitignored; it is regenerated from node_modules on every build.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'tesseract');
const files = [
  ['node_modules/tesseract.js/dist/worker.min.js', 'worker.min.js'],
  // LSTM-only cores (tesseract.js 7 default engine): SIMD for modern devices, plain as fallback
  ['node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js', 'tesseract-core-simd-lstm.wasm.js'],
  ['node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js', 'tesseract-core-lstm.wasm.js'],
  // same model tesseract.js would fetch from the CDN for LSTM-only mode
  ['node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz', 'eng.traineddata.gz'],
];

fs.mkdirSync(outDir, { recursive: true });
let copied = 0;
for (const [from, to] of files) {
  const src = path.join(root, from);
  const dest = path.join(outDir, to);
  if (!fs.existsSync(src)) {
    console.error(`[copy-ocr-assets] missing ${from} — run npm install`);
    process.exit(1);
  }
  const srcStat = fs.statSync(src);
  if (fs.existsSync(dest) && fs.statSync(dest).size === srcStat.size) continue;
  fs.copyFileSync(src, dest);
  copied++;
}
console.log(`[copy-ocr-assets] public/tesseract ready (${copied} file(s) updated)`);
