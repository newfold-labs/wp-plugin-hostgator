/**
 * Newfold/HostGator Plugin-Specific Test Helpers
 */

import { expect } from '@playwright/test';
import wordpress from './wordpress.mjs';
import utils from './utils.mjs';

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

function satisfiesMin(version, minVersion) {
  return compareVersions(version, minVersion) >= 0;
}

let _envVersions = null;

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

function clearVersionCache() {
  _envVersions = null;
}

const PLUGIN_REQUIREMENTS = {
  woocommerce: { minWp: '6.8.0', minPhp: '7.4.0' },
  jetpack: { minWp: '6.8.0', minPhp: '7.2.0' },
  yoast: { minWp: '6.8.0', minPhp: '7.4.0' },
  wonderTheme: { minWp: '6.5.0', minPhp: '7.0.0' },
};

async function supportsPlugin(pluginKey) {
  const requirements = PLUGIN_REQUIREMENTS[pluginKey];
  if (!requirements) {
    throw new Error(`Unknown plugin: ${pluginKey}`);
  }
  const { wpVersion, phpVersion } = await getEnvironmentVersions();
  return satisfiesMin(wpVersion, requirements.minWp) && satisfiesMin(phpVersion, requirements.minPhp);
}

async function supportsWoo() {
  return supportsPlugin('woocommerce');
}

async function supportsJetpack() {
  return supportsPlugin('jetpack');
}

async function supportsYoast() {
  return supportsPlugin('yoast');
}

async function supportsWonderTheme() {
  return supportsPlugin('wonderTheme');
}

async function getSkipMessage(pluginKey) {
  const requirements = PLUGIN_REQUIREMENTS[pluginKey];
  const { wpVersion, phpVersion } = await getEnvironmentVersions();
  return `Skipping: ${pluginKey} requires WP >=${requirements.minWp} & PHP >=${requirements.minPhp}, ` +
    `current: WP ${wpVersion} & PHP ${phpVersion}`;
}

async function setCapability(capabilitiesJSON, expiration = 3600) {
  utils.fancyLog(`🔐 Setting capabilities: ${JSON.stringify(capabilitiesJSON)}`);
  const expiry = Math.floor(new Date().getTime() / 1000.0) + expiration;
  await Promise.all([
    wordpress.wpCli(`option update _transient_nfd_site_capabilities '${JSON.stringify(capabilitiesJSON)}' --format=json`),
    wordpress.wpCli(`option update _transient_timeout_nfd_site_capabilities ${expiry}`),
  ]);
}

async function clearCapabilities() {
  return await wordpress.wpCli('option delete _transient_nfd_site_capabilities');
}

async function logCapabilities() {
  const result = await wordpress.wpCli('option get _transient_nfd_site_capabilities --format=json');
  utils.fancyLog('📋 Current capabilities:');
  try {
    const capabilities = JSON.parse(result);
    if (typeof capabilities === 'object' && capabilities !== null) {
      Object.entries(capabilities).forEach(([key, value]) => {
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        utils.fancyLog(`- ${key}: ${valueStr}`, 55, 'gray', ' ');
      });
    }
    return capabilities;
  } catch (error) {
    utils.fancyLog(`${result}`, 55, 'gray', ' ');
    return result;
  }
}

async function isComingSoonEnabled(page) {
  const response = await page.request.get('/wp-json/wp/v2/options/nfd_coming_soon');
  if (response.ok()) {
    const data = await response.json();
    return data === '1' || data === true;
  }
  return false;
}

async function setComingSoon(enabled) {
  return await wordpress.setOption('nfd_coming_soon', enabled);
}

async function toggleComingSoon(page, enable = true) {
  const buttonSelector = enable
    ? '[data-cy="nfd-coming-soon-enable"]'
    : '[data-cy="nfd-coming-soon-disable"]';
  const button = page.locator(buttonSelector);
  await button.click();
  await page.waitForTimeout(1000);
}

async function verifyComingSoonStatus(page, expectedEnabled) {
  const statusText = expectedEnabled ? 'Not Live' : 'Live';
  const bodyText = expectedEnabled ? 'Coming Soon' : 'website is live';
  const dataAttribute = expectedEnabled ? 'true' : 'false';
  await expect(page.locator('.iframe-preview-status')).toContainText(statusText);
  await expect(page.locator('.site-preview-widget-body')).toContainText(bodyText);
  await expect(page.locator('.site-preview-widget-body')).toHaveAttribute('data-coming-soon', dataAttribute);
}

async function verifyWidgetLink(page, linkSelector, expectedText, expectedHref, expectedAttributes = {}) {
  const link = page.locator(linkSelector);
  await expect(link).toContainText(expectedText);
  const href = await link.getAttribute('href');
  if (typeof expectedHref === 'string') {
    expect(href).toContain(expectedHref);
  } else {
    expect(href).toMatch(expectedHref);
  }
  for (const [attr, value] of Object.entries(expectedAttributes)) {
    await expect(link).toHaveAttribute(attr, value);
  }
}

async function waitForDashboardWidgets(page, timeout = 10000) {
  await page.waitForSelector('#dashboard-widgets-wrap', { timeout });
}

async function navigateToPluginPage(page, pluginId, path = '') {
  await page.goto(`/wp-admin/admin.php?page=${pluginId}${path}`);
  await waitForWordPressAdmin(page);
}

async function waitForWordPressAdmin(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('#wpadminbar');
}

async function getAdminMenuItems(page) {
  return await page.$$eval('#adminmenu > li > a .wp-menu-text', (elements) =>
    elements.map((el) => el.textContent.trim())
  );
}

async function waitForRestAPI(page) {
  const response = await page.request.get('/wp-json/wp/v2/users/me');
  if (!response.ok()) {
    throw new Error('WordPress REST API not available');
  }
}

export default {
  compareVersions,
  satisfiesMin,
  getEnvironmentVersions,
  clearVersionCache,
  PLUGIN_REQUIREMENTS,
  supportsPlugin,
  supportsWoo,
  supportsJetpack,
  supportsYoast,
  supportsWonderTheme,
  getSkipMessage,
  setCapability,
  clearCapabilities,
  logCapabilities,
  isComingSoonEnabled,
  setComingSoon,
  toggleComingSoon,
  verifyComingSoonStatus,
  verifyWidgetLink,
  waitForDashboardWidgets,
  navigateToPluginPage,
  waitForWordPressAdmin,
  getAdminMenuItems,
  waitForRestAPI,
};
