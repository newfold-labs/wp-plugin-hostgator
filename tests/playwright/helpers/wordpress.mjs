import { execSync } from 'child_process';

/**
 * Core WordPress Test Helpers
 * 
 * Utilities for core WordPress functionality: authentication, admin navigation,
 * permalinks, and basic WordPress operations.
 */

import { Admin, PageUtils } from '@wordpress/e2e-test-utils-playwright';
import utils from './utils.mjs';

/** @type {string|undefined} */
let pluginRoot;

/**
 * Plugin root must match wp-env's cwd (loadConfig uses path.resolve('.')).
 * Prefer PLUGIN_DIR when Playwright config has run; otherwise use process cwd.
 *
 * @returns {string}
 */
function getPluginRoot() {
  if (pluginRoot) {
    return pluginRoot;
  }

  pluginRoot = process.env.PLUGIN_DIR || process.cwd();
  return pluginRoot;
}

/**
 * Wait for WordPress admin to be ready
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function waitForWordPressAdmin(page) {
  // Wait for WordPress admin bar or body class
  await page.waitForSelector('body.wp-admin', { timeout: 10000 });
  
  // Wait for admin menu to be visible
  await page.waitForSelector('#adminmenu', { timeout: 5000 });
}

/**
 * Navigate to plugin page
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} pluginSlug - Plugin slug (e.g., 'hostgator')
 * @param {string} subPage - Sub-page hash (e.g., '#/settings')
 * @returns {void}
 */
async function navigateToPluginPage(page, pluginSlug, subPage = '') {
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  
  await admin.visitAdminPage(`admin.php?page=${pluginSlug}${subPage}`);
}

/**
 * Check if plugin is active
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} pluginSlug - Plugin slug
 * @returns {boolean} True if plugin is active
 */
async function isPluginActive(page, pluginSlug) {
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  
  await admin.visitAdminPage('plugins.php');
  
  const pluginRow = page.locator(`tr[data-plugin*="${pluginSlug}"]`);
  const deactivateLink = pluginRow.locator('a[href*="deactivate"]');
  
  return await deactivateLink.isVisible();
}

/** Default execSync timeout for wp-env CLI calls (2 minutes). Pass `timeout: 0` to disable. */
const DEFAULT_WP_CLI_TIMEOUT_MS = 120_000;

/**
 * Execute WordPress CLI command
 *
 * @param {string} command - WP-CLI command to execute
 * @param {Object} [options]
 * @param {string} [options.cwd] - Override auto-detected plugin root for wp-env
 * @param {number} [options.timeout] - execSync timeout in ms (default: 120000; use 0 to disable)
 * @param {boolean} [options.failOnNonZeroExit] - When true, throw on non-zero exit code
 * @returns {Promise<string|number>} Output string if available, 0 for success, or error info
 */
async function wpCli(command, options = {}) {
  // TODO: bail early if no cli access (live site or not wp-env setup)

  const {
    timeout = DEFAULT_WP_CLI_TIMEOUT_MS,
    failOnNonZeroExit,
    cwd,
  } = options;

  utils.fancyLog(`🔧 WP-CLI command: ${command}`);
  try {
    const output = execSync(`npx wp-env run cli wp ${command}`, {
      cwd: cwd ?? getPluginRoot(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...(timeout > 0 ? { timeout } : {}),
    });

    return output.trim() ? output.trim() : 0;
  } catch (err) {
    if (failOnNonZeroExit) {
      const detail = err.stderr ? err.stderr.toString().trim() : err.message;
      throw new Error(`wp ${command}: ${detail}`);
    }
    if (err.stderr) {
      return `Error: ${err.stderr.toString().trim()}`;
    }
    return err.status || 1;
  }
}

/**
 * Whether a wpCli() result indicates failure (when failOnNonZeroExit is false).
 *
 * @param {string|number} result - wpCli return value
 * @returns {boolean}
 */
function isWpCliFailure(result) {
  return (
    (typeof result === 'string' && result.startsWith('Error:')) ||
    (typeof result === 'number' && result !== 0)
  );
}

/**
 * Format a wpCli() result for logs.
 *
 * @param {string|number} result - wpCli return value
 * @returns {string}
 */
function formatWpCliResult(result) {
  if (result === 0) {
    return 'ok';
  }
  return String(result);
}

/**
 * Run wpCli() with retries on failure (uses isWpCliFailure).
 *
 * @param {string} command - WP-CLI command to execute
 * @param {Object} [options] - Passed to wpCli()
 * @param {{ maxAttempts?: number, delayMs?: number }} [retry]
 * @returns {Promise<{ result: string|number, attempt: number }>}
 */
async function wpCliWithRetry(command, options = {}, retry = {}) {
  const { maxAttempts = 2, delayMs = 2000 } = retry;
  let lastResult;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    lastResult = await wpCli(command, options);
    if (!isWpCliFailure(lastResult)) {
      return { result: lastResult, attempt };
    }
    if (attempt < maxAttempts) {
      utils.fancyLog(
        `↻ WP-CLI retry ${attempt + 1}/${maxAttempts} in ${delayMs}ms: ${command}`,
        120,
        'yellow',
        '',
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return { result: lastResult, attempt: maxAttempts };
}

/**
 * Set WordPress option via WP-CLI
 * 
 * @param {string} option - Option name
 * @param {string|boolean} value - Option value
 * @returns {Promise<string|number>} Output string if available, 0 for success, or error info
 */
async function setOption(option, value) {
  utils.fancyLog(`⚙️  Setting WordPress option: ${option} = ${value}`);
  const command = `option update ${option} ${value}`;
  return await wpCli(command);
}

// Track if permalink structure has been set to prevent duplicate calls
let permalinkStructureSet = false;

/**
 * Set WordPress permalink structure and flush rewrite rules
 * Note: Permalinks are typically set in global-setup.js via WP-CLI before tests run.
 * This function is available for changing permalinks during tests if needed.
 * This will only run once, even if called from multiple test files.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} structure - Permalink structure (default: '/%postname%/')
 * @returns {boolean} True if permalink structure was set successfully
 */
async function setPermalinkStructure(page, structure = '/%postname%/') {
  // If permalink structure has already been set, skip
  if (permalinkStructureSet) {
    return true;
  }

  utils.fancyLog(`🔗 Setting permalink structure to: ${structure}`);

  // navigate to permalink settings
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  await admin.visitAdminPage('options-permalink.php');

  // set pemalink structure
  if ( structure === '/%postname%/' ) {
    await page.locator('#permalink-input-post-name').check();
  } else {
    await page.locator('#custom_selection').check();
    await page.locator('#permalink_structure').fill(structure);
  }
  // click submit
  await page.locator('#submit').click();
  // wait for success message to be visible
  const success = await page.locator('.notice-success').isVisible();
  
  if (success) {
    permalinkStructureSet = true;
  }
  
  return success;
}

export default {
  // Core WordPress functionality
  waitForWordPressAdmin,
  
  // Plugin management
  navigateToPluginPage,
  isPluginActive,
  
  // WordPress CLI and options
  wpCli,
  wpCliWithRetry,
  isWpCliFailure,
  formatWpCliResult,
  setOption,
  setPermalinkStructure,
};
