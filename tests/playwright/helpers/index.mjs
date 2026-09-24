// Native ESM shim for vendor modules that load this file via pathToFileURL().
// Static re-exports from './index.js' fail because Playwright compiles .js files
// as CJS; CJS named exports are not available at ESM static link time.
// Dynamic import resolves at evaluation time, after the CJS module runs, so
// named exports on module.exports are accessible.
const m = await import('./index.js');
export const auth = m.auth;
export const wordpress = m.wordpress;
export const newfold = m.newfold;
export const a11y = m.a11y;
export const utils = m.utils;
