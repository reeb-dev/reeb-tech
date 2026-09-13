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

const PUBLIC_TOP_DIRS = new Set(['demos', 'docs', 'media', 'tech', 'brand', 'soluciones']);
const PUBLIC_TOP_FILES = new Set([
  'CNAME',
  '.nojekyll',
  'robots.txt',
  'sitemap.xml',
  'og.png',
  'og.jpg',
  'og-webconreeb.jpg',
  'og-cv.png',
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
  '404.html',
]);

/** Cache-bust token for icon links (change when replacing mark art). */
const HUB_FAVICON_VERSION = '20260911force';

const DEMOS_REDIRECT_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Web con REEB · Ejemplos por rubro</title>
  <meta name="description" content="El catálogo de páginas web por rubro está en la raíz del sitio.">
  <link rel="canonical" href="https://webconreeb.com/">
  <meta property="og:url" content="https://webconreeb.com/">
  <link rel="icon" href="/brand/reeb-mark.svg?v=${HUB_FAVICON_VERSION}" type="image/svg+xml">
  <link rel="icon" href="/brand/reeb-mark-32.png?v=${HUB_FAVICON_VERSION}" type="image/png" sizes="32x32">
  <link rel="icon" href="/brand/hub-mark.ico?v=${HUB_FAVICON_VERSION}" sizes="any">
  <link rel="shortcut icon" href="/brand/hub-mark.ico?v=${HUB_FAVICON_VERSION}">
  <link rel="apple-touch-icon" href="/brand/reeb-mark-180.png?v=${HUB_FAVICON_VERSION}" sizes="180x180">
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

/** Hub R oro/ember — source of truth for every published favicon.ico / svg. */
const BRAND_MARK_ICO = path.join('brand', 'reeb-mark.ico');
const BRAND_MARK_SVG = path.join('brand', 'reeb-mark.svg');

function forceHubFaviconsEverywhere(publicDir) {
  const markIco = path.join(publicDir, BRAND_MARK_ICO);
  const markSvg = path.join(publicDir, BRAND_MARK_SVG);
  if (!fs.existsSync(markIco) || !fs.existsSync(markSvg)) {
    console.error('Missing hub brand mark icons under public/brand/');
    process.exit(1);
  }

  // Always overwrite root publish icons AFTER ng build (never leave Angular defaults).
  const rootCopies = [
    [markIco, path.join(OUT, 'favicon.ico')],
    [markSvg, path.join(OUT, 'favicon.svg')],
    [markSvg, path.join(OUT, 'favicon-hub.svg')],
    [path.join(publicDir, 'brand', 'reeb-mark-16.png'), path.join(OUT, 'favicon-16.png')],
    [path.join(publicDir, 'brand', 'reeb-mark-32.png'), path.join(OUT, 'favicon-32.png')],
    [path.join(publicDir, 'brand', 'reeb-mark-180.png'), path.join(OUT, 'apple-touch-icon.png')],
    [path.join(publicDir, 'brand', 'reeb-mark-180.png'), path.join(OUT, 'apple-touch-icon-hub.png')],
    [markIco, path.join(OUT, 'brand', 'hub-mark.ico')],
  ];
  for (const [src, dest] of rootCopies) {
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  // Ensure /brand/* exists in publish output (Angular assets usually copy it; re-copy to be sure).
  const brandOut = path.join(OUT, 'brand');
  fs.mkdirSync(brandOut, { recursive: true });
  for (const name of fs.readdirSync(path.join(publicDir, 'brand'))) {
    fs.copyFileSync(path.join(publicDir, 'brand', name), path.join(brandOut, name));
  }

  // Overwrite every favicon.ico under the publish tree (root, demos, nested).
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'cv') continue; // CV uses brand links, not a local ico
        walk(full);
      } else if (ent.name === 'favicon.ico' || ent.name === 'favicon.svg') {
        fs.copyFileSync(ent.name.endsWith('.svg') ? markSvg : markIco, full);
      }
    }
  }
  walk(OUT);

  // CV must not ship an Angular favicon.ico
  for (const name of ['favicon.ico', 'favicon.svg', 'favicon-16.png', 'favicon-32.png', 'favicon-hub.svg']) {
    const cvIcon = path.join(CV_DIR, name);
    if (fs.existsSync(cvIcon)) fs.rmSync(cvIcon, { force: true });
  }

  const rootIco = path.join(OUT, 'favicon.ico');
  const bytes = fs.statSync(rootIco).size;
  // Classic Angular CLI favicon is ~15086 bytes; refuse to ship that.
  if (bytes > 12000 && bytes < 16000) {
    console.error('Refusing to publish: root favicon.ico looks like Angular default (' + bytes + ' bytes)');
    process.exit(1);
  }
  console.log('Hub favicons forced: /favicon.ico (' + bytes + ' B) + /brand/reeb-mark.*');
}

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

  forceHubFaviconsEverywhere(path.join(ROOT, 'public'));
  // Disable Jekyll so folders/files like shared assets are published as-is.
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');


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
