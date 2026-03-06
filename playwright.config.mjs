/*
 * playwright config file
 * @see https://playwright.dev/docs/test-configuration
 */
import { defineConfig, devices } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
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
const projects = JSON.parse(readFileSync(projectsFile, 'utf8'));

// Set environment variable for plugin root
process.env.PLUGIN_DIR = __dirname;
process.env.PLUGIN_ID = 'hostgator';
process.env.WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME || 'admin';
process.env.WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'password';
process.env.WP_VERSION = process.env.WP_VERSION || wpVersion;
process.env.PHP_VERSION = process.env.PHP_VERSION || phpVersion;

export default defineConfig({
  globalSetup: resolve(__dirname, './tests/playwright/global-setup.js'),
  projects: projects,
  testIgnore: [
    // Don't ignore anything - we want to include gitignored files that playwright needs to find
    // playwright needs to find vendor files, so we override the default playwright ignore list here
  ],
  use: {
    ...devices['Desktop Chrome'],
    headless: true,
    viewport: { width: 1200, height: 800 },
    baseURL: `http://localhost:${_port}`,
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    contextOptions: {
      reducedMotion: 'reduce',
      strictSelectors: true,
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: process.env.CI ? undefined : {
    command: 'npx wp-env start',
    port: _port,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 1,
  outputDir: 'tests/playwright/test-results',
  reporter: [
    ['list', { printSteps: true }],
  ],
});
