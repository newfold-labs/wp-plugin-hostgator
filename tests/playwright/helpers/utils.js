/**
 * General Test Utilities
 *
 * Common utilities for Playwright tests that aren't WordPress-specific.
 */

import { expect } from '@playwright/test';

/**
 * Scroll element into view and wait for it to be stable
 *
 * @param {import('@playwright/test').Locator} locator - Playwright locator
 * @param {Object} options - Scroll options
 */
async function scrollIntoView(locator, options = {}) {
  const { timeout = 15000 } = options;
  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for the HostGator plugin SPA to finish booting on a hash route.
 *
 * The app shell (#hgwp-app-rendered) mounts before settings are fetched;
 * route content (e.g. Admin toggles) only renders after boot completes.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Wait options
 * @param {string} options.pageKebab - Route slug for hgwp-page-* (e.g. 'admin', 'home')
 * @param {string} [options.contentSelector] - Selector that must exist once booted
 * @param {number} [options.timeout=30000] - Timeout in milliseconds
 */
async function waitForHostGatorAppPage(page, { pageKebab, contentSelector, timeout = 30000 } = {}) {
  const app = page.locator('#hgwp-app-rendered');
  await app.waitFor({ state: 'visible', timeout });

  if (pageKebab) {
    await expect(app).toHaveClass(new RegExp(`\\bhgwp-page-${pageKebab}\\b`), { timeout });
  }

  await page.waitForFunction(
    ({ pageClass, selector }) => {
      const main = document.querySelector('#hgwp-app-rendered');
      if (!main) {
        return false;
      }
      if (pageClass && !main.classList.contains(pageClass)) {
        return false;
      }
      if (main.querySelector('.components-spinner')) {
        return false;
      }
      if (selector && !document.querySelector(selector)) {
        return false;
      }
      return true;
    },
    {
      pageClass: pageKebab ? `hgwp-page-${pageKebab}` : null,
      selector: contentSelector || null,
    },
    { timeout }
  );
}

/**
 * Wait for notification to appear and contain specific text
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} text - Text to look for in notification
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
async function waitForNotification(page, text, timeout = 5000) {
  const notification = page.locator('.nfd-notifications').filter({ hasText: text });
  await notification.waitFor({ state: 'visible', timeout });
  return notification;
}

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Fancy log wrapper: truncates long lines, optional ANSI color.
 *
 * @param {unknown} message - Message to log
 * @param {number} [maxLength=100] - Max characters before truncation
 * @param {string} [color='gray'] - gray, white, red, green, yellow, blue, magenta, cyan
 * @param {string} [indent='        '] - Leading indent (often empty string in global setup)
 */
function fancyLog(message, maxLength = 100, color = 'gray', indent = '        ') {
  const stringMessage = String(message);
  const formattedMessage =
    stringMessage.length > maxLength ? `${stringMessage.substring(0, maxLength)}...` : stringMessage;

  const colorCode = colors[color] || colors.gray;
  console.log(`${indent}${colorCode}${formattedMessage}${colors.reset}`);
}

export default {
  scrollIntoView,
  waitForHostGatorAppPage,
  waitForNotification,
  fancyLog,
};
