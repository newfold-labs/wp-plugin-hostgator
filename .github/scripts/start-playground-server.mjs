/**
 * Long-running WordPress Playground server for Playwright webServer.
 * Run as a child process — do not call runCLI in the same process as Playwright tests.
 *
 * Env:
 *   PLAYGROUND_PLUGIN_DIR — absolute path to unzipped plugin files
 *   PLAYGROUND_PORT — optional (default 9400)
 *   PLAYGROUND_READY_FILE — path to write when boot completes (parent polls this)
 */
import { runCLI } from '@wp-playground/cli';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const pluginDir = process.env.PLAYGROUND_PLUGIN_DIR?.trim();
const port = Number(process.env.PLAYGROUND_PORT || 9400);
const readyFile = process.env.PLAYGROUND_READY_FILE?.trim();

if (!pluginDir) {
  console.error('PLAYGROUND_PLUGIN_DIR is required');
  process.exit(1);
}

if (!readyFile) {
  console.error('PLAYGROUND_READY_FILE is required');
  process.exit(1);
}

if (existsSync(readyFile)) {
  unlinkSync(readyFile);
}

const resolvedPluginDir = path.resolve(pluginDir);
if (!existsSync(path.join(resolvedPluginDir, 'wp-plugin-hostgator.php'))) {
  console.error(
    `Expected wp-plugin-hostgator.php in ${resolvedPluginDir}`
  );
  process.exit(1);
}

const pluginFolderName = path.basename(resolvedPluginDir);
const pluginPath = `${pluginFolderName}/wp-plugin-hostgator.php`;

console.log(`Starting Playground on port ${port}`);
console.log(`Mounting ${resolvedPluginDir} as wp-content/plugins/${pluginFolderName}`);

const cli = await runCLI({
  command: 'server',
  port,
  workers: 1,
  php: '8.1',
  wp: 'latest',
  login: true,
  mount: [
    {
      hostPath: resolvedPluginDir,
      vfsPath: `/wordpress/wp-content/plugins/${pluginFolderName}`,
    },
  ],
  blueprint: {
    landingPage: '/wp-admin/admin.php?page=hostgator#/home',
    preferredVersions: { php: '8.1', wp: 'latest' },
    login: true,
    steps: [
      {
        step: 'activatePlugin',
        pluginPath,
      },
    ],
  },
});

// runCLI resolves after Playground prints "Ready!" — do not HTTP-poll from this
// process; same-thread fetch can starve the server event loop and deadlock boot.
const baseURL = cli.serverUrl.endsWith('/') ? cli.serverUrl : `${cli.serverUrl}/`;

writeFileSync(readyFile, baseURL, 'utf8');
console.log(`Playground ready at ${baseURL}`);
console.log(`Playground ready file: ${readyFile}`);

async function shutdown() {
  try {
    if (existsSync(readyFile)) {
      unlinkSync(readyFile);
    }
    if (cli?.server) {
      await new Promise((resolve) => {
        cli.server.close(() => resolve());
      });
    }
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
