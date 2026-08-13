/**
 * Playwright Test Helpers
 * 
 * Centralized helper functions for WordPress e2e tests.
 * Import specific helpers as needed to avoid bloating test files.
 */

// Authentication helpers
import auth from './auth.mjs';

// Core WordPress functionality
import wordpress from './wordpress.mjs';

// Newfold/HostGator plugin-specific helpers
import newfold from './newfold.mjs';

// Accessibility testing helpers
import a11y from './a11y.mjs';

// General test utilities
import utils from './utils.mjs';

export {
  auth,
  wordpress,
  newfold,
  a11y,
  utils
};
