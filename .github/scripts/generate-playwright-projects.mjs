import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, basename, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const VENDOR_DIR = 'vendor/newfold-labs';

function getLocalModules() {
  const localModules = [];
  try {
    if (existsSync('composer.local.json')) {
      const composerLocal = JSON.parse(readFileSync('composer.local.json', 'utf8'));
      if (composerLocal.repositories) {
        for (const repo of composerLocal.repositories) {
          if (repo.type === 'path' && repo.url && repo.url.includes('modules/')) {
            const moduleName = repo.url.split('/').pop();
            const resolvedPath = resolve(repo.url);
            // Correct path resolution if needed, based on the project's root
            const correctedPath = resolvedPath.replace('/wordpress/modules/', '/modules/');
            const playwrightDir = join(correctedPath, 'tests', 'playwright');
            if (existsSync(playwrightDir)) {
              localModules.push({ name: moduleName, path: correctedPath });
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Could not read composer.local.json:', error.message);
  }
  return localModules.sort((a, b) => a.name.localeCompare(b.name));
}

function getVendorModules() {
  const vendorModules = [];
  try {
    const result = execSync(`find ${VENDOR_DIR} -maxdepth 2 -type d -name "wp-module-*"`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    if (result.trim()) {
      const modulePaths = result.trim().split('\n');
      modulePaths.forEach(modulePath => {
        const moduleName = basename(modulePath);
        const playwrightDir = join(modulePath, 'tests', 'playwright');
        if (existsSync(playwrightDir)) {
          vendorModules.push({ name: moduleName, path: modulePath });
        }
      });
    }
  } catch (error) {
    // No vendor directories found, continue
  }
  return vendorModules.sort((a, b) => a.name.localeCompare(b.name));
}

// Modules whose specs toggle plugin activation state (e.g. deactivate the whole
// plugin mid-test). Deferred to run last so a still-deactivated plugin can't be
// caught mid-teardown by another module's test setup running sequentially after it.
// https://github.com/newfold-labs/wp-plugin-hostgator/pull/1380
const RUN_LAST_MODULES = new Set(['wp-module-deactivation']);

function generateProjects() {
  console.log('🔍 Playwright Projects Discovery:');
  const projects = [
    {
      name: 'newfold-labs/wp-plugin-hostgator',
      testDir: './tests/playwright/specs',
      testMatch: '*.spec.{js,mjs}',
    }
  ];

  const localModules = getLocalModules();
  const vendorModules = getVendorModules();
  const discoveredModules = new Set();
  const deferredProjects = [];

  const addModule = (module, projectName) => {
    if (discoveredModules.has(module.name)) {
      return;
    }
    discoveredModules.add(module.name);
    const project = {
      name: projectName,
      testDir: `./${module.path}/tests/playwright/specs`,
      testMatch: '*.spec.{js,mjs}',
    };
    if (RUN_LAST_MODULES.has(module.name)) {
      deferredProjects.push(project);
    } else {
      projects.push(project);
    }
  };

  // Add local modules first (they take precedence)
  localModules.forEach(module => addModule(module, `newfold-labs/${module.name}-local`));

  // Add vendor modules if no local version exists
  vendorModules.forEach(module => addModule(module, `newfold-labs/${module.name}`));

  // Append run-last modules at the very end, in their original discovery order.
  projects.push(...deferredProjects);
  if (deferredProjects.length > 0) {
    console.log(`⏭️  Deferring ${deferredProjects.length} project(s) to run last: ${deferredProjects.map(p => p.name).join(', ')}`);
  }

  console.log(`📁 Found ${projects.length} project(s):`);
  projects.forEach(p => {
    const type = p.name.startsWith('plugin') ? 'PLUGIN' : (p.name.startsWith('local') ? 'LOCAL' : 'VENDOR');
    console.log(`  - ${p.name} (${type}): ${p.testDir}`);
  });

  return projects;
}

function writeProjectsFile() {
  const projects = generateProjects();
  const projectsFile = 'tests/playwright/playwright-projects.json';
  
  console.log(`\n📝 Writing projects to ${projectsFile}...`);
  writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
  console.log(`✅ Projects written to ${projectsFile}`);
  
  return projects;
}

// If this script is run directly, generate and write the projects file
// ES module equivalent of require.main === module
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  writeProjectsFile();
}

export { 
  generateProjects, 
  writeProjectsFile,
  getLocalModules,
  getVendorModules
};