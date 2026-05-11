/**
 * WordPress Authentication Helper for Playwright Tests
 * 
 * This module provides reusable authentication methods for WordPress e2e tests.
 * It handles wp-env specific authentication and integrates with WordPress e2e-test-utils-playwright.
 * Follows Playwright best practices for authentication and session management.
 */

import { Admin, PageUtils } from '@wordpress/e2e-test-utils-playwright';
import { readFileSync } from 'fs';

/**
 * Check if user is already logged in to WordPress
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} True if logged in, false otherwise
 */
async function isLoggedIn(page) {
  try {
    // Check current URL first
    const currentUrl = page.url();
    
    // If we're already on a login page, we're not logged in
    if (currentUrl.includes('/wp-login.php')) {
      return false;
    }
    
    // If we're on an admin page, check for logged-in indicators
    if (currentUrl.includes('/wp-admin/')) {
      const hasAdminBar = await page.locator('#wpadminbar').isVisible().catch(() => false);
      const hasLoggedInIndicator = await page.locator('body.logged-in').isVisible().catch(() => false);
      return hasAdminBar || hasLoggedInIndicator;
    }
    
    // If we're not on an admin page, try to access a protected page
    const response = await page.goto('/wp-admin/', { waitUntil: 'domcontentloaded', timeout: 5000 });
    
    // Check if we were redirected to login page
    const newUrl = page.url();
    const isOnLoginPage = newUrl.includes('/wp-login.php');
    
    // Check for admin bar or other logged-in indicators
    const hasAdminBar = await page.locator('#wpadminbar').isVisible().catch(() => false);
    const hasLoggedInIndicator = await page.locator('body.logged-in').isVisible().catch(() => false);
    
    return !isOnLoginPage && (hasAdminBar || hasLoggedInIndicator);
  } catch (error) {
    // If there's an error, assume not logged in
    return false;
  }
}

/**
 * Manual WordPress login method (reliable with wp-env)
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Login options
 * @param {string} options.username - WordPress username (default: 'admin')
 * @param {string} options.password - WordPress password (default: 'password')
 * @param {boolean} options.force - Force login even if already logged in (default: false)
 */
async function loginToWordPress(page, options = {}) {
  const { 
    username = process.env.WP_ADMIN_USERNAME, 
    password = process.env.WP_ADMIN_PASSWORD,
    force = false 
  } = options;

  // Check if already logged in (unless forced)
  if (!force && await isLoggedIn(page)) {
    return;
  }

  await page.goto('/wp-login.php');
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.press('#user_pass', 'Enter');
  
  // Wait for successful login: either left wp-login or landed on admin email verification (still wp-login.php?action=confirm_admin_email)
  await page.waitForURL(
    (url) => {
      if (!url.pathname.includes('/wp-login.php')) return true;
      if (url.searchParams.get('action') === 'confirm_admin_email') return true;
      return false;
    },
    { timeout: 10000 }
  );
}

/**
 * Create WordPress utilities with authentication
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Authentication options
 * @returns {Object} Object containing admin and pageUtils instances
 */
async function createWordPressUtils(page, options = {}) {
  const { 
    username = process.env.WP_ADMIN_USERNAME, 
    password = process.env.WP_ADMIN_PASSWORD,
    autoLogin = true 
  } = options;

  // Login if requested
  if (autoLogin) {
    await loginToWordPress(page, { username, password });
  }

  // Create WordPress utilities
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });

  return { admin, pageUtils };
}

/**
 * Navigate to a WordPress admin page with smart authentication
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} adminPage - Admin page path (e.g., 'admin.php?page=bluehost')
 * @param {Object} options - Navigation options
 * @param {boolean} options.forceLogin - Force login even if already logged in (default: false)
 * @returns {Object} Object containing admin and pageUtils instances
 */
async function navigateToAdminPage(page, adminPage, options = {}) {
  const { forceLogin = false } = options;
  
  // Check if we need to login first
  if (!await isLoggedIn(page) || forceLogin) {
    await loginToWordPress(page, { ...options, force: forceLogin });
  }
  
  // Navigate to the admin page
  const response = await page.goto(`/wp-admin/${adminPage}`, { waitUntil: 'domcontentloaded' });
  
  // Check if we were redirected to login (session expired)
  const currentUrl = page.url();
  if (currentUrl.includes('/wp-login.php')) {
    // Session expired, login again
    await loginToWordPress(page, { ...options, force: true });
    // Retry navigation
    await page.goto(`/${adminPage}`, { waitUntil: 'domcontentloaded' });
  }
  
  // Create WordPress utilities for additional functionality
  const { admin, pageUtils } = await createWordPressUtils(page, { ...options, autoLogin: false });
  
  return { admin, pageUtils };
}

/**
 * Save authentication state for reuse across tests
 * This improves performance by avoiding repeated logins
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} filePath - Path to save the state file
 * @param {Object} options - Login options
 */
async function saveAuthState(page, filePath = 'tests/playwright/auth-state.json', options = {}) {
  // Ensure we're logged in
  if (!await isLoggedIn(page)) {
    await loginToWordPress(page, options);
  }
  
  // Save the authentication state
  await page.context().storageState({ path: filePath });
}

/**
 * Restore authentication state from a saved file
 * 
 * @param {import('@playwright/test').BrowserContext} context - Playwright browser context
 * @param {string} filePath - Path to the saved state file
 */
async function restoreAuthState(context, filePath = 'tests/playwright/auth-state.json') {
  try {
    const authState = JSON.parse(readFileSync(filePath, 'utf-8'));
    await context.addCookies(authState.cookies);
  } catch (error) {
    // If state file doesn't exist or is invalid, continue without it
    console.warn('Could not restore auth state:', error.message);
  }
}

/**
 * Setup authenticated context for tests
 * This is useful for beforeEach hooks
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Setup options
 * @returns {Object} Object containing admin and pageUtils instances
 */
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
