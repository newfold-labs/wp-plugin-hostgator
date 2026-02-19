import { test, expect } from '@playwright/test';
import { auth } from '../helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'admin.php?page=hostgator');
  });

  test('Logo links to home', async ({ page }) => {
    await page.waitForSelector('#hgwp-app-rendered', { timeout: 10000 });
    const logoLink = page.locator('#hgwp-app-rendered a[href*="#/home"]').first();
    await logoLink.click();
    await page.waitForTimeout(500);
    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/home');
  });

  test('Admin submenu exists', async ({ page }) => {
    const { admin } = await auth.setupAuthenticatedContext(page);
    await admin.visitAdminPage('index.php');
    await expect(page.locator('#adminmenu #toplevel_page_hostgator ul.wp-submenu')).toBeVisible();
    await expect(page.locator('#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/home"]')).toBeVisible();
    await expect(page.locator('#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/settings"]')).toBeVisible();
    await expect(page.locator('#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/help"]')).toBeVisible();
  });

  test('Settings link properly navigates', async ({ page }) => {
    await auth.navigateToAdminPage(page, 'admin.php?page=hostgator');
    await page.hover('#adminmenu #toplevel_page_hostgator');
    await page.waitForTimeout(100);
    await page.click('#adminmenu #toplevel_page_hostgator ul.wp-submenu li a[href="admin.php?page=hostgator#/settings"]', { force: true });
    await page.waitForTimeout(500);
    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/settings');
  });
});
