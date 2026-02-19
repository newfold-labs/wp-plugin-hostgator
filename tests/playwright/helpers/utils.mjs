/**
 * General Test Utilities
 *
 * Common utilities for Playwright tests that aren't WordPress-specific.
 */

/**
 * Scroll element into view and wait for it to be stable
 *
 * @param {import('@playwright/test').Locator} locator - Playwright locator
 * @param {Object} options - Scroll options
 */
async function scrollIntoView(locator, options = {}) {
  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: 'visible', timeout: 5000 });
  await locator.waitFor({ state: 'attached', timeout: 100 });
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

function fancyLog(message, maxLength = 55, color = 'gray', indent = '        ') {
  const stringMessage = String(message);
  const formattedMessage = stringMessage.length > maxLength
    ? stringMessage.substring(0, maxLength) + '...'
    : stringMessage;

  const colorCode = colors[color] || colors.gray;
  console.log(`${indent}${colorCode}${formattedMessage}${colors.reset}`);
}

export default {
  scrollIntoView,
  waitForNotification,
  fancyLog,
};
