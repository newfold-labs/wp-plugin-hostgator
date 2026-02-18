import { test, expect } from '@playwright/test';
import { auth, a11y, utils } from '../helpers';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'admin.php?page=hostgator#/home');
  });

  test('Is accessible', async ({ page }) => {
    await page.waitForSelector('#hgwp-app-rendered', { timeout: 10000 });
    await page.waitForSelector('.hgwp-app-body', { state: 'visible', timeout: 10000 });
    await page.waitForTimeout(500);
    await a11y.checkA11y(page, '.hgwp-app-body', {
      disabledRules: ['region'],
    });
  });

  test('Home page content is visible', async ({ page }) => {
    await page.waitForSelector('#hgwp-app-rendered', { timeout: 10000 });
    const appBody = page.locator('.hgwp-app-body');
    await utils.scrollIntoView(appBody);
    await expect(appBody).toBeVisible();
    const heading = appBody.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
