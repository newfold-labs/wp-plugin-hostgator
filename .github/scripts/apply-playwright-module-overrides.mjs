import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, isAbsolute, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import { getLocalModules } from './generate-playwright-projects.mjs';

const SPEC_PATTERN = /\.spec\.(mjs|js)$/;
const OVERRIDES_SUBDIR = join('tests', 'playwright', 'module-overrides');

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walkFilePaths(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...walkFilePaths(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

/**
 * Resolve a module install root (from composer.local: local path, or vendor) for a wp-module name.
 * Local modules from composer.local take precedence over vendor (same as generate-playwright-projects).
 * @param {string} pluginRoot
 * @param {string} moduleName e.g. wp-module-next-steps
 * @param {Map<string, string>} localByName
 */
function getModuleTargetRoot(pluginRoot, moduleName, localByName) {
  if (localByName.has(moduleName)) {
    const p = localByName.get(moduleName);
    return isAbsolute(p) ? p : resolve(pluginRoot, p);
  }
  return join(pluginRoot, 'vendor', 'newfold-labs', moduleName);
}

/**
 * @param {string} dirName e.g. wp-module-ecommerce (same as `vendor/newfold-labs/<name>`)
 * @returns {string|null} module name, or null if not a module override folder
 */
function getModuleNameFromOverrideDir(dirName) {
  if (!dirName.startsWith('wp-module-') || dirName.length <= 'wp-module-'.length) {
    return null;
  }
  return dirName;
}

/**
 * Map an override file path to the destination under the module's tests/playwright tree.
 * - `helpers/**` → tests/playwright/helpers/**
 * - `specs/**` → tests/playwright/specs/**
 * - `fixtures/**` → tests/playwright/fixtures/**
 * - Other paths: only `*.spec.mjs` / `*.spec.js` → tests/playwright/specs/<same relative path>
 * @param {string} moduleOverrideRoot
 * @param {string} src absolute path to source file
 * @param {string} targetRoot module install root
 * @returns {string|null} destination path, or null if this file should be skipped
 */
function resolveOverrideDestination(moduleOverrideRoot, src, targetRoot) {
  const relRaw = relative(moduleOverrideRoot, src);
  const segments = relRaw.replace(/\\/g, '/').split('/').filter(Boolean);
  const first = segments[0];

  if (first === 'helpers') {
    const tail = segments.slice(1);
    if (tail.length === 0) {
      return null;
    }
    return join(targetRoot, 'tests', 'playwright', 'helpers', ...tail);
  }

  if (first === 'specs') {
    const tail = segments.slice(1);
    if (tail.length === 0) {
      return null;
    }
    return join(targetRoot, 'tests', 'playwright', 'specs', ...tail);
  }

  if (first === 'fixtures') {
    const tail = segments.slice(1);
    if (tail.length === 0) {
      return null;
    }
    return join(targetRoot, 'tests', 'playwright', 'fixtures', ...tail);
  }

  if (SPEC_PATTERN.test(src)) {
    return join(targetRoot, 'tests', 'playwright', 'specs', relRaw);
  }

  return null;
}

/**
 * Copy plugin test overrides into the installed module tree so imports (e.g. ../helpers) stay valid.
 * See tests/playwright/module-overrides/readme.md
 * @param {string} [pluginRoot] - plugin root (from global-setup: tests/playwright → ../..); defaults to process.cwd() when run as a CLI
 */
export function applyPlaywrightModuleOverrides(pluginRoot = process.cwd()) {
  const overridesBase = join(pluginRoot, OVERRIDES_SUBDIR);
  if (!existsSync(overridesBase)) {
    return;
  }

  const locals = getLocalModules();
  const localByName = new Map(locals.map((m) => [m.name, m.path]));
  let applied = 0;

  for (const ent of readdirSync(overridesBase, { withFileTypes: true })) {
    if (!ent.isDirectory()) {
      continue;
    }
    const moduleName = getModuleNameFromOverrideDir(ent.name);
    if (!moduleName) {
      continue;
    }
    const moduleOverrideRoot = join(overridesBase, ent.name);
    const targetRoot = getModuleTargetRoot(pluginRoot, moduleName, localByName);
    if (!existsSync(targetRoot)) {
      console.warn(
        `⚠️ [playwright module-overrides] Skipping ${ent.name} (${moduleName}): not installed (expected at ${targetRoot})`
      );
      continue;
    }
    for (const src of walkFilePaths(moduleOverrideRoot)) {
      const dest = resolveOverrideDestination(moduleOverrideRoot, src, targetRoot);
      if (!dest) {
        continue;
      }
      const relFromModuleFolder = relative(moduleOverrideRoot, src);
      const destDir = dirname(dest);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(src, dest);
      const top = relFromModuleFolder.replace(/\\/g, '/').split('/')[0];
      const label =
        top === 'helpers' ? 'helper' : top === 'fixtures' ? 'fixture' : 'spec';
      console.warn(
        `⚠️ [playwright module-overrides] module playwright test ${label} overridden: ${ent.name}: ${relFromModuleFolder}`
      );
      applied += 1;
    }
  }
  if (applied > 0) {
    console.warn(
      `⚠️ [playwright module-overrides] ${applied} file(s) applied. Don't forget to update the module repo and remove overrides when done; do not release with test overrides in place.`
    );
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  applyPlaywrightModuleOverrides();
}
