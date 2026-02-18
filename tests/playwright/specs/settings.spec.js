import { test, expect } from '@playwright/test';
import { auth, a11y, utils } from '../helpers';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'admin.php?page=hostgator#/settings');
  });

  test('Is accessible', async ({ page }) => {
    await page.waitForSelector('#hgwp-app-rendered', { timeout: 10000 });
    await page.waitForSelector('.hgwp-app-body', { timeout: 10000 });
    await a11y.checkA11y(page, '.hgwp-app-body');
  });

  test('Has coming soon section', async ({ page }) => {
    const generalSettings = page.locator('.settings-details');
    await generalSettings.locator('summary').click();
    await page.waitForTimeout(300);
    const comingSoonSection = page.locator('.hgwp-app-settings-coming-soon');
    await utils.scrollIntoView(comingSoonSection);
    await expect(comingSoonSection).toBeVisible();
  });

  test('Autoupdate toggles function properly', async ({ page }) => {
    const generalSettings = page.locator('.settings-details');
    if (!(await generalSettings.getAttribute('open'))) {
      await generalSettings.locator('summary').click();
      await page.waitForTimeout(300);
    }
    const updatesSection = page.locator('.hgwp-app-settings-update');
    await utils.scrollIntoView(updatesSection);
    await expect(updatesSection).toBeVisible();

    const allToggle = page.locator('#autoupdate-all-toggle, [data-id="autoupdate-all-toggle"]').first();
    await expect(allToggle).toHaveAttribute('aria-checked', 'true');

    const coreToggle = page.locator('#autoupdate-core-toggle, [data-id="autoupdate-core-toggle"]').first();
    await expect(coreToggle).toBeDisabled();
    await expect(coreToggle).toHaveAttribute('aria-checked', 'true');

    const pluginsToggle = page.locator('#autoupdate-plugins-toggle, [data-id="autoupdate-plugins-toggle"]').first();
    await expect(pluginsToggle).toBeDisabled();
    await expect(pluginsToggle).toHaveAttribute('aria-checked', 'true');

    const themesToggle = page.locator('#autoupdate-themes-toggle, [data-id="autoupdate-themes-toggle"]').first();
    await expect(themesToggle).toBeDisabled();
    await expect(themesToggle).toHaveAttribute('aria-checked', 'true');

    await allToggle.click();
    await page.waitForTimeout(100);
    await utils.waitForNotification(page, 'Disabled All auto-updates');
    await expect(allToggle).toHaveAttribute('aria-checked', 'false');
    await expect(coreToggle).not.toBeDisabled();
    await expect(pluginsToggle).not.toBeDisabled();
    await expect(themesToggle).not.toBeDisabled();
  });

  test('Content settings work', async ({ page }) => {
    const generalSettings = page.locator('.settings-details');
    if (!(await generalSettings.getAttribute('open'))) {
      await generalSettings.locator('summary').click();
      await page.waitForTimeout(300);
    }
    const emptyTrashSelect = page.locator('#empty-trash-select, [data-id="empty-trash-select"]').first();
    await emptyTrashSelect.click();
    await page.waitForTimeout(500);
    await page.locator('.nfd-select__options .nfd-select__option').filter({ hasText: /^2$/ }).first().click();
    await page.waitForTimeout(100);
    const description = page.locator('[id="empty-trash-select__description"], .nfd-select-field__description').filter({ hasText: '2 weeks' });
    await expect(description).toContainText('2 weeks');
  });

  test('Comment settings work', async ({ page }) => {
    const generalSettings = page.locator('.settings-details');
    if (!(await generalSettings.getAttribute('open'))) {
      await generalSettings.locator('summary').click();
      await page.waitForTimeout(300);
    }
    const commentsSection = page.locator('.hgwp-app-settings-comments');
    await utils.scrollIntoView(commentsSection);
    await expect(commentsSection).toBeVisible();

    const disableCommentsToggle = page.locator('#disable-comments-toggle, [data-id="disable-comments-toggle"]').first();
    await expect(disableCommentsToggle).toHaveAttribute('aria-checked', 'false');
    const closeCommentsDaysSelect = page.locator('#close-comments-days-select, [data-id="close-comments-days-select"]').first();
    await expect(closeCommentsDaysSelect).toBeDisabled();

    await disableCommentsToggle.click();
    await page.waitForTimeout(100);
    await expect(disableCommentsToggle).toHaveAttribute('aria-checked', 'true');
    await expect(closeCommentsDaysSelect).not.toBeDisabled();

    await disableCommentsToggle.click();
    await page.waitForTimeout(100);
    await expect(disableCommentsToggle).toHaveAttribute('aria-checked', 'false');
    await expect(closeCommentsDaysSelect).toBeDisabled();
  });
});
