#!/usr/bin/env node
/**
 * CI still passes --base-href /reeb-tech/ (workflow push needs `workflow` scope).
 * Remap that path to / so the custom domain apex works.
 */
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base-href' && typeof args[i + 1] === 'string') {
    const href = args[i + 1];
    if (href === '/reeb-tech/' || href === '/reeb-tech') {
      args[i + 1] = '/';
    }
  }
}

const result = spawnSync('npx', ['ng', 'build', ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

process.exit(result.status === null ? 1 : result.status);
