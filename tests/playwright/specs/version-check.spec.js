import { test, expect } from '@playwright/test';
import { auth } from '../helpers';

test.describe('Version Check', () => {
  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'site-health.php?tab=debug');
  });

  test('Is running the correct WP version', async ({ page }) => {
    await page.locator('#health-check-accordion-block-wp-core').locator('..').first().click();
    await page.waitForTimeout(500);
    const versionCell = page.locator('#health-check-accordion-block-wp-core')
      .locator('tr')
      .first()
      .locator('td')
      .last();
    const expectedVersion = process.env.WP_VERSION;
    const versionText = await versionCell.textContent();
    expect(versionText).toMatch(new RegExp(`^${expectedVersion}`));
  });

  test('Is running the correct PHP version', async ({ page }) => {
    await page.locator('#health-check-accordion-block-wp-server').locator('..').first().click();
    await page.waitForTimeout(500);
    const phpVersionCell = page.locator('#health-check-accordion-block-wp-server')
      .locator('tr')
      .nth(2)
      .locator('td')
      .last();
    const expectedPhpVersion = process.env.PHP_VERSION;
    const phpVersionText = await phpVersionCell.textContent();
    expect(phpVersionText).toContain(expectedPhpVersion);
  });
});
