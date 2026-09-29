/**
 * Playwright Test Helpers
 * 
 * Centralized helper functions for WordPress e2e tests.
 * Import specific helpers as needed to avoid bloating test files.
 */

// Authentication helpers
import auth from './auth.js';

// Core WordPress functionality
import wordpress from './wordpress.js';

// Newfold/HostGator plugin-specific helpers
import newfold from './newfold.js';

// Accessibility testing helpers
import a11y from './a11y.js';

// General test utilities
import utils from './utils.js';

export {
  auth,
  wordpress,
  newfold,
  a11y,
  utils
};
