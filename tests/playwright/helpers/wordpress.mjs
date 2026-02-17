import { execSync } from 'child_process';
import { Admin, PageUtils } from '@wordpress/e2e-test-utils-playwright';
import utils from './utils.mjs';

async function waitForWordPressAdmin(page) {
  await page.waitForSelector('body.wp-admin', { timeout: 10000 });
  await page.waitForSelector('#adminmenu', { timeout: 5000 });
}

async function navigateToPluginPage(page, pluginSlug, subPage = '') {
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  await admin.visitAdminPage(`admin.php?page=${pluginSlug}${subPage}`);
}

async function isPluginActive(page, pluginSlug) {
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  await admin.visitAdminPage('plugins.php');
  const pluginRow = page.locator(`tr[data-plugin*="${pluginSlug}"]`);
  const deactivateLink = pluginRow.locator('a[href*="deactivate"]');
  return await deactivateLink.isVisible();
}

async function wpCli(command) {
  utils.fancyLog(`🔧 WP-CLI command: ${command}`);
  try {
    const output = execSync(`npx wp-env run cli wp ${command}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output.trim() ? output.trim() : 0;
  } catch (err) {
    if (err.stderr) {
      return `Error: ${err.stderr.toString().trim()}`;
    }
    return err.status || 1;
  }
}

async function setOption(option, value) {
  utils.fancyLog(`⚙️  Setting WordPress option: ${option} = ${value}`);
  return await wpCli(`option update ${option} ${value}`);
}

let permalinkStructureSet = false;

async function setPermalinkStructure(page, structure = '/%postname%/') {
  if (permalinkStructureSet) {
    return true;
  }
  utils.fancyLog(`🔗 Setting permalink structure to: ${structure}`);
  const pageUtils = new PageUtils({ page });
  const admin = new Admin({ page, pageUtils });
  await admin.visitAdminPage('options-permalink.php');
  if (structure === '/%postname%/') {
    await page.locator('#permalink-input-post-name').check();
  } else {
    await page.locator('#custom_selection').check();
    await page.locator('#permalink_structure').fill(structure);
  }
  await page.locator('#submit').click();
  const success = await page.locator('.notice-success').isVisible();
  if (success) {
    permalinkStructureSet = true;
  }
  return success;
}

export default {
  waitForWordPressAdmin,
  navigateToPluginPage,
  isPluginActive,
  wpCli,
  setOption,
  setPermalinkStructure,
};
