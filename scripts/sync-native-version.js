// scripts/sync-native-version.js
// Copies the version in package.json to the native projects so every store
// upload carries a new version (they were stuck at 1.0 / build 1).
//   Android: versionName = "3.2.1", versionCode = 30201 (major*10000 + minor*100 + patch)
//   iOS:     MARKETING_VERSION = 3.2.1, CURRENT_PROJECT_VERSION = 30201
// Bump "version" in package.json before a release; runs as part of `npm run cap:sync`.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { version } = require(path.join(root, 'package.json'));
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
if (!match) {
  console.error(`[sync-native-version] package.json version "${version}" is not x.y.z`);
  process.exit(1);
}
const [major, minor, patch] = match.slice(1).map(Number);
if (minor > 99 || patch > 99) {
  console.error('[sync-native-version] minor and patch must be <= 99 for the build number scheme');
  process.exit(1);
}
const build = major * 10000 + minor * 100 + patch;

const edit = (rel, replacers) => {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return console.warn(`[sync-native-version] skipped ${rel} (not found)`);
  let text = fs.readFileSync(file, 'utf8');
  for (const [re, value] of replacers) {
    if (!re.test(text)) throw new Error(`pattern ${re} not found in ${rel}`);
    text = text.replace(re, value);
  }
  fs.writeFileSync(file, text);
};

edit('android/app/build.gradle', [
  [/versionCode \d+/, `versionCode ${build}`],
  [/versionName "[^"]*"/, `versionName "${version}"`],
]);
edit('ios/App/App.xcodeproj/project.pbxproj', [
  [/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${version};`],
  [/CURRENT_PROJECT_VERSION = [^;]+;/g, `CURRENT_PROJECT_VERSION = ${build};`],
]);
console.log(`[sync-native-version] native apps set to ${version} (build ${build})`);
