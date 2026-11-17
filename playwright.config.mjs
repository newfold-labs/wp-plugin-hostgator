/*
* playwright config file
* @see https://playwright.dev/docs/test-configuration
*/
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { writeProjectsFile } from './.github/scripts/generate-playwright-projects.mjs';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read wp-env.json to get the correct port and default values
const wpEnvConfig = JSON.parse(readFileSync('./.wp-env.json', 'utf8'));
const { phpVersion: _phpVersion, core: _core, port: _port } = wpEnvConfig;

// Check if .wp-env.override.json exists (created by CI workflows with matrix values)
const overrideFile = './.wp-env.override.json';
let phpVersion, core, wpVersion;

if (existsSync(overrideFile)) {
  // Use override values from matrix workflow
  const overrideConfig = JSON.parse(readFileSync(overrideFile, 'utf8'));
  phpVersion = overrideConfig.phpVersion || _phpVersion;
  core = overrideConfig.core || _core;
  // Extract version from core string (e.g., "WordPress/WordPress#tags/6.8" -> "6.8")
  wpVersion = /[^/]*$/.exec(core)[0];
} else {
  // Use default values from .wp-env.json
  phpVersion = _phpVersion;
  core = _core;
  wpVersion = /[^/]*$/.exec(core)[0];
}

// Generate projects file if it doesn't exist or is stale
const projectsFile = './tests/playwright/playwright-projects.json';
if (!existsSync(projectsFile)) {
  writeProjectsFile();
}

// Load projects from generated file
let projects = JSON.parse(readFileSync(projectsFile, 'utf8'));
// Merge per-project overrides from module (e.g. tests/playwright/project-overrides.json)
projects = projects.map((p) => {
  const overridesPath = resolve(__dirname, p.testDir, '..', 'project-overrides.json');
  if (existsSync(overridesPath)) {
    const overrides = JSON.parse(readFileSync(overridesPath, 'utf8'));
    return { ...p, ...overrides };
  }
  return p;
});

// Set environment variable for plugin root
process.env.PLUGIN_DIR = __dirname;
process.env.PLUGIN_ID = 'hostgator';
// App CSS prefix (e.g. `.hgwp-app-settings-coming-soon`)
process.env.APP_ID = 'hgwp';
process.env.WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin';
process.env.WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';
process.env.WP_VERSION = process.env.WP_VERSION || wpVersion;
process.env.PHP_VERSION = process.env.PHP_VERSION || phpVersion;

/**
 * Paths passed to page.goto('/foo') are resolved against the URL *origin* only, not baseURL's path.
 * For WordPress in a subdirectory, baseURL must end with '/' and navigations must use relative paths
 * (e.g. 'wp-login.php'), or /foo incorrectly hits https://domain/foo instead of https://domain/blog/foo.
 * @param {string} raw
 * @param {string} fallback e.g. http://localhost:8882
 */
function normalizePlaywrightBaseURL(raw, fallback) {
  const base = String(raw || fallback).trim();
  try {
    const u = new URL(base);
    if (u.pathname !== '/' && !u.pathname.endsWith('/')) {
      u.pathname += '/';
    }
    return u.href;
  } catch {
    return base;
  }
}

/** CI Playground job: mount the PR preview zip via @wp-playground/cli in a child process. */
const isPlaygroundMode = Boolean(process.env.PLAYGROUND_PLUGIN_DIR);
const playgroundPort = Number(process.env.PLAYGROUND_PORT || 9400);
const playgroundBaseURL = `http://127.0.0.1:${playgroundPort}/`;

if (isPlaygroundMode && !process.env.BASE_URL) {
  process.env.BASE_URL = playgroundBaseURL;
}
if (isPlaygroundMode) {
  process.env.PLAYGROUND_AUTO_LOGIN = '1';
  if (!process.env.PLAYGROUND_READY_FILE) {
    process.env.PLAYGROUND_READY_FILE = join(
      process.env.RUNNER_TEMP || tmpdir(),
      'playground-http-ready'
    );
  }
}

const resolvedBaseURL = normalizePlaywrightBaseURL(
  process.env.BASE_URL,
  `http://localhost:${_port}`
);

/** When BASE_URL is set, run against that site (deploy / remote smoke) instead of wp-env. */
const isRemoteMode = Boolean(process.env.BASE_URL);

export default defineConfig({
  globalSetup: isPlaygroundMode
    ? resolve(__dirname, './tests/playwright/playground-global-setup.js')
    : isRemoteMode
      ? undefined
      : resolve(__dirname, './tests/playwright/global-setup.js'),
  // Remote: allow @env-any and @env-remote. CI Playground/deploy pass --grep @env-any.
  // Local: full suite except @env-remote (prod-only). Override with --grep @env-remote if needed.
  grep: isRemoteMode ? /@env-any|@env-remote/ : undefined,
  grepInvert: isRemoteMode ? undefined : /@env-remote/,
  projects: projects,
  testIgnore: [
    // Don't ignore anything - we want to include gitignored files that playwright needs to find
    // playwright needs to find vendor files, so we override the default playwright ignore list here
  ],
  use: {
    ...devices['Desktop Chrome'],
    headless: true,
    viewport: { width: 1200, height: 800 },
    baseURL: resolvedBaseURL,
    ignoreHTTPSErrors: true,
    // WordPress-optimized settings
    locale: 'en-US',
    contextOptions: {
      reducedMotion: 'reduce', // Accessibility testing
      strictSelectors: true,   // Better selector reliability
    },
    // Debugging features
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: isPlaygroundMode
    ? {
        command: 'node .github/scripts/start-playground-server.mjs',
        // Playground may redirect or 502 wp-admin during auto-login; wait for the port instead.
        port: playgroundPort,
        reuseExistingServer: !process.env.CI,
        timeout: 300 * 1000,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : (process.env.CI || isRemoteMode)
      ? undefined
      : {
          command: 'wp-env start',
          port: _port, // Use port from wp-env.json
          reuseExistingServer: true,
          timeout: 120 * 1000, // 2 minutes
        },
  timeout: 30 * 1000, // 30 seconds
  expect: {
    timeout: 10 * 1000, // 10 seconds
    toHaveScreenshot: {
      maxDiffPixels: 100,
      pathTemplate: '{testDir}/screenshots{/projectName}/{testFilePath}/{arg}{ext}',
      fullPage: true,
    },
  },
  retries: process.env.CI ? 1 : 1, // 0 retries on CI, 1 for local
  workers: process.env.CI ? 1 : 1, // Use default (number of CPU cores) for local, 1 for CI
  outputDir: 'tests/playwright/test-results',
  reporter: [
    ['list', { printSteps: true }],
    // ['json', {  outputFile: 'tests/playwright/reports/test-results.json' }],
    // ['html', { outputFolder: 'tests/playwright/reports/html' }],
    // ['@estruyf/github-actions-reporter'] // https://github.com/estruyf/playwright-github-actions-reporter
  ]
});