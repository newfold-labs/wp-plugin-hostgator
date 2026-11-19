/**
 * Playwright Test Helpers
 *
 * Centralized helper functions for WordPress e2e tests.
 * Import specific helpers as needed to avoid bloating test files.
 */

import authModule from './auth.js';
import wordpressModule from './wordpress.js';
import newfoldModule from './newfold.js';
import a11yModule from './a11y.js';
import utilsModule from './utils.js';

/**
 * Playwright may compile helper modules to CJS; default exports then appear as
 * { default: helpers }. Vendor modules load this file via createRequire() —
 * unwrap so newfold.clearInstallerQueues and wpCli stay reachable.
 *
 * @param {unknown} mod
 * @returns {Record<string, unknown>}
 */
function unwrapHelperModule(mod) {
	if (
		mod &&
		typeof mod === 'object' &&
		mod.default &&
		typeof mod.default === 'object'
	) {
		return mod.default;
	}
	return mod;
}

const auth = unwrapHelperModule(authModule);
const wordpress = unwrapHelperModule(wordpressModule);
const newfold = unwrapHelperModule(newfoldModule);
const a11y = unwrapHelperModule(a11yModule);
const utils = unwrapHelperModule(utilsModule);

const helpers = { auth, wordpress, newfold, a11y, utils };

export { auth, wordpress, newfold, a11y, utils };
export default helpers;
