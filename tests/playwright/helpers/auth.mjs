/**
 * WordPress Authentication Helper for Playwright Tests
 */

import { Admin, PageUtils } from '@wordpress/e2e-test-utils-playwright';
import { readFileSync } from 'fs';

async function isLoggedIn(page) {
  try {
    const currentUrl = page.url();
    if (currentUrl.includes('/wp-login.php')) {
      return false;
    }
    if (currentUrl.includes('/wp-admin/')) {
      const hasAdminBar = await page.locator('#wpadminbar').isVisible().catch(() => false);
      const hasLoggedInIndicator = await page.locator('body.logged-in').isVisible().catch(() => false);
      return hasAdminBar || hasLoggedInIndicator;
    }
    await page.goto('/wp-admin/', { waitUntil: 'domcontentloaded', timeout: 5000 });
    const newUrl = page.url();
    const isOnLoginPage = newUrl.includes('/wp-login.php');
    const hasAdminBar = await page.locator('#wpadminbar').isVisible().catch(() => false);
    const hasLoggedInIndicator = await page.locator('body.logged-in').isVisible().catch(() => false);
    return !isOnLoginPage && (hasAdminBar || hasLoggedInIndicator);
  } catch (error) {
    return false;
  }
}

async function loginToWordPress(page, options = {}) {
  const {
    username = process.env.WP_ADMIN_USERNAME,
    password = process.env.WP_ADMIN_PASSWORD,
    force = false
  } = options;

  if (!force && await isLoggedIn(page)) {
    return;
  }

  await page.goto('/wp-login.php');
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.press('#user_pass', 'Enter');
  await page.waitForURL(url => !url.pathname.includes('/wp-login.php'), { timeout: 10000 });
}

async function createWordPressUtils(page, options = {}) {
  const {
    username = process.env.WP_ADMIN_USERNAME,
    password = process.env.WP_ADMIN_PASSWORD,
    autoLogin = true
  } = options;

  if (autoLogin) {
    await loginToWordPress(page, { username, password });
  }

  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  return { admin, pageUtils };
}

async function navigateToAdminPage(page, adminPage, options = {}) {
  const { forceLogin = false } = options;

  if (!await isLoggedIn(page) || forceLogin) {
    await loginToWordPress(page, { ...options, force: forceLogin });
  }

  await page.goto(`/wp-admin/${adminPage}`, { waitUntil: 'domcontentloaded' });

  const currentUrl = page.url();
  if (currentUrl.includes('/wp-login.php')) {
    await loginToWordPress(page, { ...options, force: true });
    await page.goto(`/wp-admin/${adminPage}`, { waitUntil: 'domcontentloaded' });
  }

  const { admin, pageUtils } = await createWordPressUtils(page, { ...options, autoLogin: false });
  return { admin, pageUtils };
}

async function saveAuthState(page, filePath = 'tests/playwright/auth-state.json', options = {}) {
  if (!await isLoggedIn(page)) {
    await loginToWordPress(page, options);
  }
  await page.context().storageState({ path: filePath });
}

async function restoreAuthState(context, filePath = 'tests/playwright/auth-state.json') {
  try {
    const authState = JSON.parse(readFileSync(filePath, 'utf-8'));
    await context.addCookies(authState.cookies);
  } catch (error) {
    console.warn('Could not restore auth state:', error.message);
  }
}

async function setupAuthenticatedContext(page, options = {}) {
  return await createWordPressUtils(page, options);
}

export default {
  isLoggedIn,
  loginToWordPress,
  createWordPressUtils,
  navigateToAdminPage,
  setupAuthenticatedContext,
  saveAuthState,
  restoreAuthState,
};
