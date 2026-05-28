/**
 * Newfold/HostGator Plugin-Specific Test Helpers
 * 
 * Utilities for testing Newfold Labs modules and HostGator-specific functionality.
 * Includes capabilities, coming soon, dashboard widgets, plugin-specific features,
 * and version compatibility checks for third-party plugin integrations.
 */

import { expect } from '@playwright/test';
import wordpress from './wordpress.mjs';
import utils from './utils.mjs';

/**
 * Plugin support requirements
 * Update these when plugin requirements change
 */
const PLUGIN_REQUIREMENTS = {
  // https://wordpress.org/plugins/woocommerce/
  woocommerce: { minWp: '6.9.0', minPhp: '7.4.0' },
  // https://wordpress.org/plugins/jetpack/
  jetpack: { minWp: '6.8.0', minPhp: '7.2.0' },
  // https://wordpress.org/plugins/wordpress-seo/
  yoast: { minWp: '6.8.0', minPhp: '7.4.0' },
  // https://github.com/newfold-labs/yith-wonder/blob/master/style.css
  wonderTheme: { minWp: '6.5.0', minPhp: '7.0.0' },
};

// ============================================================================
// VERSION COMPARISON UTILITIES
// ============================================================================

/**
 * Compare two semantic version strings
 * @param {string} a - First version (e.g., "6.8.0")
 * @param {string} b - Second version (e.g., "6.7.0")
 * @returns {number} -1 if a < b, 0 if equal, 1 if a > b
 */
function compareVersions(a, b) {
  const partsA = String(a).split('.').map(Number);
  const partsB = String(b).split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }
  return 0;
}

/**
 * Check if version satisfies minimum requirement (>=)
 * @param {string} version - Current version
 * @param {string} minVersion - Minimum required version
 * @returns {boolean}
 */
function satisfiesMin(version, minVersion) {
  return compareVersions(version, minVersion) >= 0;
}

// ============================================================================
// ENVIRONMENT VERSION DETECTION
// ============================================================================

/** Cached environment versions */
let _envVersions = null;

/**
 * Get WordPress and PHP versions from the environment
 * Caches the result to avoid repeated WP-CLI calls
 * @returns {Promise<{wpVersion: string, phpVersion: string}>}
 */
async function getEnvironmentVersions() {
  if (_envVersions) {
    return _envVersions;
  }

  const [wpVersion, phpVersion] = await Promise.all([
    wordpress.wpCli('core version'),
    wordpress.wpCli('eval "echo PHP_VERSION;"'),
  ]);

  _envVersions = {
    wpVersion: wpVersion.trim(),
    phpVersion: phpVersion.trim(),
  };

  utils.fancyLog(`📦 Environment: WP ${_envVersions.wpVersion}, PHP ${_envVersions.phpVersion}`);

  return _envVersions;
}

/**
 * Clear cached environment versions (useful for testing)
 */
function clearVersionCache() {
  _envVersions = null;
}

// ============================================================================
// THIRD-PARTY PLUGIN SUPPORT CHECKS
// Based on plugin requirements
//
// Example usage:
// const wooSupported = await newfold.supportsWoo();		
// test.skip(!wooSupported, await newfold.getSkipMessage('woocommerce'));
//
// ============================================================================

/**
 * Check if the current environment supports a specific plugin
 * @param {'woocommerce' | 'jetpack' | 'yoast' | 'wonderTheme'} pluginKey - Plugin identifier
 * @returns {Promise<boolean>}
 */
async function supportsPlugin(pluginKey) {
  const requirements = PLUGIN_REQUIREMENTS[pluginKey];
  if (!requirements) {
    throw new Error(`Unknown plugin: ${pluginKey}. Available: ${Object.keys(PLUGIN_REQUIREMENTS).join(', ')}`);
  }

  const { wpVersion, phpVersion } = await getEnvironmentVersions();

  return satisfiesMin(wpVersion, requirements.minWp) &&
    satisfiesMin(phpVersion, requirements.minPhp);
}

/**
 * Check if current environment supports WooCommerce
 * Requires: WP >= 6.8.0, PHP >= 7.4.0
 * @returns {Promise<boolean>}
 */
async function supportsWoo() {
  return supportsPlugin('woocommerce');
}

/**
 * Check if current environment supports Jetpack
 *
 * @returns {Promise<boolean>}
 */
async function supportsJetpack() {
  return supportsPlugin('jetpack');
}

/**
 * Check if current environment supports Yoast SEO
 *
 * @returns {Promise<boolean>}
 */
async function supportsYoast() {
  return supportsPlugin('yoast');
}

/**
 * Check if current environment supports Wonder Theme
 *
 * @returns {Promise<boolean>}
 */
async function supportsWonderTheme() {
  // theme support is determined the same way as a plugin
  return supportsPlugin('wonderTheme');
}

/**
 * Get a skip message for unsupported plugin
 * @param {'woocommerce' | 'jetpack' | 'yoast' | 'wonderTheme'} pluginKey
 * @returns {Promise<string>}
 */
async function getSkipMessage(pluginKey) {
  const requirements = PLUGIN_REQUIREMENTS[pluginKey];
  const { wpVersion, phpVersion } = await getEnvironmentVersions();

  return `Skipping: ${pluginKey} requires WP >=${requirements.minWp} & PHP >=${requirements.minPhp}, ` +
    `current: WP ${wpVersion} & PHP ${phpVersion}`;
}

/**
 * Set plugin capabilities (brand plugin functionality)
 * 
 * @param {Object} capabilities - Capabilities object
 * @param {number} expiration - Expiration time in seconds (default: 3600)
 * @returns {Promise<void>}
 */
async function setCapability(capabilities, expiration = 3600) {
  utils.fancyLog(`🔐 Setting capabilities: ${JSON.stringify(capabilities)}`);
  const expiry = Math.floor(new Date().getTime() / 1000.0) + expiration;

  // Use Promise.all to ensure both operations complete before returning
  await Promise.all([
    wordpress.wpCli(`option update _transient_nfd_site_capabilities '${JSON.stringify(
      capabilities
    )}' --format=json`),
    wordpress.wpCli(`option update _transient_timeout_nfd_site_capabilities ${expiry}`)
  ]);
}

/**
 * Clear all plugin capabilities
 */
async function clearCapabilities() {
  // Clear all capability options
  return await wordpress.wpCli('option delete _transient_nfd_site_capabilities');
}

/**
 * Log the current capabilities option from the database
 * 
 * @returns {Promise<Object>} The current capabilities object
 */
async function logCapabilities() {
  const result = await wordpress.wpCli('option get _transient_nfd_site_capabilities --format=json');

  utils.fancyLog('📋 Current capabilities:');

  try {
    // Parse JSON and iterate over key-value pairs
    const capabilities = JSON.parse(result);

    if (typeof capabilities === 'object' && capabilities !== null) {
      Object.entries(capabilities).forEach(([key, value]) => {
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        utils.fancyLog(`- ${key}: ${valueStr}`, 100, 'gray', '            ');
      });
    } else {
      utils.fancyLog(`- ${String(capabilities)}`, 100, 'gray', '            ');
    }

    return capabilities;
  } catch (error) {
    // Fallback if JSON parsing fails
    utils.fancyLog(`${result}`, 100, 'gray', '            ');
    return result;
  }
}

/**
 * Check if coming soon is enabled
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} True if coming soon is enabled
 */
async function isComingSoonEnabled(page) {
  const response = await page.request.get('/wp-json/wp/v2/options/nfd_coming_soon');
  if (response.ok()) {
    const data = await response.json();
    return data === '1' || data === true;
  }
  return false;
}

/**
 * Enable or disable coming soon mode
 * 
 * @param {boolean} enabled - Whether to enable coming soon
 */
async function setComingSoon(enabled) {
  return await wordpress.setOption('nfd_coming_soon', enabled);
}

/**
 * Click coming soon toggle button
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {boolean} enable - Whether to enable (true) or disable (false) coming soon
 */
async function toggleComingSoon(page, enable = true) {
  const buttonSelector = enable
    ? '[data-cy="nfd-coming-soon-enable"]'
    : '[data-cy="nfd-coming-soon-disable"]';

  const button = page.locator(buttonSelector);
  await button.click();

  // Wait for the toggle to take effect
  await page.waitForTimeout(1000);
}

/**
 * Verify coming soon status in site preview widget
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {boolean} expectedEnabled - Expected coming soon status
 */
async function verifyComingSoonStatus(page, expectedEnabled) {
  const statusText = expectedEnabled ? 'Not Live' : 'Live';
  const bodyText = expectedEnabled ? 'Coming Soon' : 'website is live';
  const dataAttribute = expectedEnabled ? 'true' : 'false';

  // Check status text
  await expect(page.locator('.iframe-preview-status')).toContainText(statusText);

  // Check body text
  await expect(page.locator('.site-preview-widget-body')).toContainText(bodyText);

  // Check data attribute
  await expect(page.locator('.site-preview-widget-body')).toHaveAttribute('data-coming-soon', dataAttribute);
}

/**
 * Verify widget link attributes
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} linkSelector - CSS selector for the link
 * @param {string} expectedText - Expected link text
 * @param {string|RegExp} expectedHref - Expected href pattern
 * @param {Object} expectedAttributes - Expected attributes (optional)
 */
async function verifyWidgetLink(page, linkSelector, expectedText, expectedHref, expectedAttributes = {}) {
  const link = page.locator(linkSelector);

  // Check text content
  await expect(link).toContainText(expectedText);

  // Check href
  const href = await link.getAttribute('href');
  if (typeof expectedHref === 'string') {
    expect(href).toContain(expectedHref);
  } else {
    expect(href).toMatch(expectedHref);
  }

  // Check additional attributes
  for (const [attr, value] of Object.entries(expectedAttributes)) {
    await expect(link).toHaveAttribute(attr, value);
  }
}

/**
 * Wait for dashboard widgets to load
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
async function waitForDashboardWidgets(page, timeout = 10000) {
  await page.waitForSelector('#dashboard-widgets-wrap', { timeout });
}

/**
 * Navigate to a specific plugin page in the WordPress admin.
 * Assumes the plugin ID is known.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} pluginId - The ID of the plugin (e.g., 'hostgator').
 * @param {string} path - The path within the plugin (e.g., '#/home').
 */
async function navigateToPluginPage(page, pluginId, path = '') {
  await page.goto(`/wp-admin/admin.php?page=${pluginId}${path}`);
  await waitForWordPressAdmin(page);
}

/**
 * Wait for WordPress admin to be ready (helper function)
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function waitForWordPressAdmin(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('#wpadminbar'); // Wait for admin bar to be visible
}

/**
 * Get admin menu items
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<Array<string>>} List of admin menu item texts
 */
async function getAdminMenuItems(page) {
  return await page.$$eval('#adminmenu > li > a .wp-menu-text', (elements) =>
    elements.map((el) => el.textContent.trim())
  );
}

/**
 * Wait for WordPress REST API to be available
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function waitForRestAPI(page) {
  // Try to access a simple REST endpoint
  const response = await page.request.get('/wp-json/wp/v2/users/me');
  if (!response.ok()) {
    throw new Error('WordPress REST API not available');
  }
}

export default {
  // Version Utilities
  compareVersions,
  satisfiesMin,
  getEnvironmentVersions,
  clearVersionCache,

  // Plugin Support Checks
  PLUGIN_REQUIREMENTS,
  supportsPlugin,
  supportsWoo,
  supportsJetpack,
  supportsYoast,
  supportsWonderTheme,
  getSkipMessage,

  // Capabilities
  setCapability,
  clearCapabilities,
  logCapabilities,

  // Coming Soon
  isComingSoonEnabled,
  setComingSoon,
  toggleComingSoon,
  verifyComingSoonStatus,

  // Dashboard Widgets
  verifyWidgetLink,
  waitForDashboardWidgets,

  // Plugin Navigation
  navigateToPluginPage,

  // WordPress Admin
  waitForWordPressAdmin,
  getAdminMenuItems,
  waitForRestAPI,
};
