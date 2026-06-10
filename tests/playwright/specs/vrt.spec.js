/**
 * Visual Regression Testing
 * 
 * This test is used to verify that the plugin is rendering correctly in the browser.
 * The paths are all visited and the screenshot is compared to the baseline screenshot.
 * 
 * To update the baseline screenshots, run the test with the --update-snapshots flag:
 * npx playwright test tests/playwright/specs/vrt.spec.js --update-snapshots
 */

import { test, expect } from '@playwright/test';
import { auth } from '../helpers';

const pluginId = process.env.PLUGIN_ID || 'hostgator';
const paths = [
    'wp-admin/index.php',
    'wp-admin/admin.php?page=' + pluginId + '#/home',
    'wp-admin/admin.php?page=' + pluginId + '#/settings',
    'wp-admin/admin.php?page=' + pluginId + '#/settings/performance',
    'wp-admin/admin.php?page=' + pluginId + '#/settings/settings',
    'wp-admin/admin.php?page=' + pluginId + '#/settings/staging',
    'wp-admin/admin.php?page=' + pluginId + '#/commerce',
    'wp-admin/admin.php?page=' + pluginId + '#/marketplace',
    'wp-admin/admin.php?page=' + pluginId + '#/help',
    '/wp-admin/plugins.php',
    '/wp-admin/plugin-install.php',
    'wp-admin/plugin-install.php?tab=premium-marketplace'
];

test.beforeEach(async ({ page }) => {
    // Login and navigate to the dashboard page
    await auth.navigateToAdminPage(page, 'index.php');
});

/* Skipping for now until we get tests fully migrated to Playwright */
test.describe.skip('VRT', () => {
    for (const path of paths) {
        test(`${path}`, async ({ page }) => {
            await page.goto(path);
            await page.waitForLoadState('domcontentloaded');
            await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
        });
    }
});