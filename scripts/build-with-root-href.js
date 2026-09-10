#!/usr/bin/env node
/**
 * Build for webconreeb.com:
 * - Hub catalog at / (promoted from public/demos/index.html)
 * - Individual demos stay at /demos/<rubro>/
 * - /demos/ redirects to / (legacy catalog URL)
 * - Angular CV at /cv/ (base-href /cv/)
 *
 * Legacy: remap --base-href /reeb-tech/ or / to /cv/.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist', 'manuelreeb', 'browser');
const CV_DIR = path.join(OUT, 'cv');

const PUBLIC_TOP_DIRS = new Set(['demos', 'docs', 'media', 'tech']);
const PUBLIC_TOP_FILES = new Set([
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'og.png',
  'logo.svg',
  'bp4.png',
  'fiserv.svg',
  'siskit.png',
  'reeb.png',
  'reeb2.png',
  'r.jpg',
  'R@.png',
  'RR.png',
  'apple-touch-icon.png',
  'apple-touch-icon-hub.png',
  'apple-touch-icon-cv.png',
  'favicon.ico',
  'favicon.svg',
  'favicon-16.png',
  'favicon-32.png',
  'favicon-hub.svg',
  'logofavico.png',
  'screenshot-2025-02-05-130401.png',
  'unnamed.webp',
]);

const HUB_FAVICON_VERSION = 'hub33';

const DEMOS_REDIRECT_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Web con REEB · Ejemplos por rubro</title>
  <meta name="description" content="El catálogo de páginas web por rubro está en la raíz del sitio.">
  <link rel="canonical" href="https://webconreeb.com/">
  <meta property="og:url" content="https://webconreeb.com/">
  <link rel="icon" href="/favicon.svg?v=${HUB_FAVICON_VERSION}" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png?v=${HUB_FAVICON_VERSION}" type="image/png" sizes="32x32">
  <link rel="shortcut icon" href="/favicon.ico?v=${HUB_FAVICON_VERSION}">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=${HUB_FAVICON_VERSION}" sizes="180x180">
  <meta http-equiv="refresh" content="0; url=/">
  <script>location.replace('/' + (location.hash || '') + (location.search || ''));</script>
</head>
<body>
  <p style="font-family: system-ui, sans-serif; padding: 2rem;">
    <a href="/">Ir al catálogo de ejemplos por rubro</a>
  </p>
</body>
</html>
`;

/** Hub R oro/ember icons that must win at site root (never Angular defaults). */
const HUB_ROOT_ICONS = [
  'favicon.ico',
  'favicon.svg',
  'favicon-hub.svg',
  'favicon-16.png',
  'favicon-32.png',
  'apple-touch-icon.png',
  'apple-touch-icon-hub.png',
];

function remapBaseHref(args) {
  const out = [...args];
  let hasBase = false;
  for (let i = 0; i < out.length; i++) {
    if (out[i] === '--base-href' && typeof out[i + 1] === 'string') {
      hasBase = true;
      const href = out[i + 1];
      if (href === '/reeb-tech/' || href === '/reeb-tech' || href === '/' || href === '/cv' || href === '/cv/') {
        out[i + 1] = '/cv/';
      }
    }
  }
  if (!hasBase) {
    out.push('--base-href', '/cv/');
  }
  return out;
}

function isAngularArtifact(name) {
  if (PUBLIC_TOP_DIRS.has(name) || PUBLIC_TOP_FILES.has(name) || name === 'cv') {
    return false;
  }
  return true;
}

function preparePublishLayout() {
  if (!fs.existsSync(OUT)) {
    console.error('Build output missing:', OUT);
    process.exit(1);
  }

  fs.mkdirSync(CV_DIR, { recursive: true });

  for (const name of fs.readdirSync(OUT)) {
    if (!isAngularArtifact(name)) continue;
    const from = path.join(OUT, name);
    const to = path.join(CV_DIR, name);
    if (fs.existsSync(to)) {
      fs.rmSync(to, { recursive: true, force: true });
    }
    fs.renameSync(from, to);
  }

  const hubSource = path.join(OUT, 'demos', 'index.html');
  if (!fs.existsSync(hubSource)) {
    console.error('Hub source missing:', hubSource);
    process.exit(1);
  }

  // Promote catalog to site root; keep vertical demos under /demos/<rubro>/.
  fs.copyFileSync(hubSource, path.join(OUT, 'index.html'));
  fs.writeFileSync(path.join(OUT, 'demos', 'index.html'), DEMOS_REDIRECT_HTML, 'utf8');

  // After ng build + CV move: force hub favicons at publish root (and demos mirror).
  // Prevents any Angular/public race from leaving a stale /favicon.ico at /.
  const publicDir = path.join(ROOT, 'public');
  for (const name of HUB_ROOT_ICONS) {
    const src = path.join(publicDir, name);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(OUT, name));
  }
  // Root apple-touch must be hub (oro/ember), not CV parchment.
  const hubTouch = path.join(publicDir, 'apple-touch-icon-hub.png');
  if (fs.existsSync(hubTouch)) {
    fs.copyFileSync(hubTouch, path.join(OUT, 'apple-touch-icon.png'));
  }
  const demosDir = path.join(OUT, 'demos');
  if (fs.existsSync(demosDir)) {
    for (const name of ['favicon.ico', 'favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon.png', 'apple-touch-icon.png']) {
      const srcName = name === 'favicon.png' ? 'favicon-32.png' : name === 'apple-touch-icon.png' ? 'apple-touch-icon-hub.png' : name;
      const src = path.join(publicDir, srcName === 'apple-touch-icon-hub.png' ? 'apple-touch-icon-hub.png' : srcName);
      const alt = path.join(publicDir, name);
      const from = fs.existsSync(src) ? src : alt;
      if (fs.existsSync(from)) {
        fs.copyFileSync(from, path.join(demosDir, name));
      }
    }
  }

  // Drop any accidental Angular favicon left under /cv/ so it cannot be confused with root.
  for (const name of ['favicon.ico', 'favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon-hub.svg']) {
    const cvIcon = path.join(CV_DIR, name);
    if (fs.existsSync(cvIcon)) {
      fs.rmSync(cvIcon, { force: true });
    }
  }

  console.log('Pages layout: / = hub catalog; /demos/ → /; Angular CV at /cv/; hub favicons forced at root.');
}

const args = remapBaseHref(process.argv.slice(2));
const result = spawnSync('npx', ['ng', 'build', ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
  cwd: ROOT,
});

if (result.status !== 0) {
  process.exit(result.status === null ? 1 : result.status);
}

preparePublishLayout();
process.exit(0);
