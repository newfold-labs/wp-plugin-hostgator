/**
 * Some Composer-installed modules ship a nested `node_modules` tree that includes
 * `playwright` / `@playwright/*`. That causes Playwright to error with:
 * "Requiring @playwright/test second time".
 *
 * This script removes known duplicate Playwright installs under `vendor/newfold-labs/*`.
 * Safe to run repeatedly; only deletes paths that exist.
 */
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['vendor/newfold-labs/wp-module-help-center/node_modules'];
const nested = ['playwright', 'playwright-core', '@playwright'];

for (const root of roots) {
  const base = join(process.cwd(), root);
  if (!existsSync(base)) continue;
  for (const name of nested) {
    const target = join(base, name);
    if (existsSync(target)) {
      console.warn(`[playwright] Removing nested duplicate: ${target}`);
      rmSync(target, { recursive: true, force: true });
    }
  }
}
