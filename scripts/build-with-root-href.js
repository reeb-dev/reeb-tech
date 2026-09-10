#!/usr/bin/env node
/**
 * Build for webconreeb.com:
 * - Angular CV at /cv/ (base-href /cv/)
 * - Demos hub stays at /demos/ (from public/)
 * - Site root index.html redirects to /demos/ so the business home is the catalog
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
  'favicon.ico',
  'favicon-16.png',
  'favicon-32.png',
  'favicon-hub.svg',
  'logofavico.png',
  'screenshot-2025-02-05-130401.png',
  'unnamed.webp',
]);

const REDIRECT_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Página web para su local — WhatsApp y panel | Web con REEB</title>
  <meta name="description" content="Página web a medida para su comercio u oficio: vitrina para clientes, panel para el día a día y WhatsApp. Ejemplos por rubro. Desarrollo a medida, no suscripción.">
  <link rel="canonical" href="https://webconreeb.com/demos/">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://webconreeb.com/demos/">
  <meta property="og:title" content="Página web para su local — WhatsApp y panel | Web con REEB">
  <meta property="og:description" content="Página web a medida para su comercio u oficio: vitrina para clientes, panel para el día a día y WhatsApp. Ejemplos por rubro.">
  <meta property="og:image" content="https://webconreeb.com/og.png">
  <link rel="icon" href="/demos/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/demos/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/demos/apple-touch-icon.png" sizes="180x180">
  <meta http-equiv="refresh" content="0; url=/demos/">
  <script>location.replace('/demos/' + (location.hash || '') + (location.search || ''));</script>
</head>
<body>
  <p style="font-family: system-ui, sans-serif; padding: 2rem;">
    <a href="/demos/">Ir al catálogo de ejemplos de sistemas</a>
  </p>
</body>
</html>
`;

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

  // Assets the CV references with absolute root paths stay at OUT root (from public/).
  // Favicons referenced from /cv/index.html with root-absolute hrefs also stay at root.

  fs.writeFileSync(path.join(OUT, 'index.html'), REDIRECT_HTML, 'utf8');
  console.log('Pages layout: / → /demos/ redirect; Angular CV at /cv/; hub at /demos/.');
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
