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
    const comingSoonSection = page.locator('.hgwp-app-settings-coming-soon');
    await utils.scrollIntoView(comingSoonSection);
    await expect(comingSoonSection).toBeVisible();
  });

  test('Autoupdate toggles function properly', async ({ page }) => {
    const updatesSection = page.locator('.hgwp-app-settings-update');
    await utils.scrollIntoView(updatesSection);
    await expect(updatesSection).toBeVisible();

    const allToggle = page.locator('[data-id="autoupdate-all-toggle"]');
    await expect(allToggle).toHaveAttribute('aria-checked', 'true');

    const coreToggle = page.locator('[data-id="autoupdate-core-toggle"]');
    await expect(coreToggle).toBeDisabled();
    await expect(coreToggle).toHaveAttribute('aria-checked', 'true');

    const pluginsToggle = page.locator('[data-id="autoupdate-plugins-toggle"]');
    await expect(pluginsToggle).toBeDisabled();
    await expect(pluginsToggle).toHaveAttribute('aria-checked', 'true');

    const themesToggle = page.locator('[data-id="autoupdate-themes-toggle"]');
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
    const emptyTrashSelect = page.locator('[data-id="empty-trash-select"]');
    await emptyTrashSelect.click();
    await page.waitForTimeout(500);
    await emptyTrashSelect.locator('..').locator('+ .nfd-select__options .nfd-select__option:nth-child(2)').click();
    await page.waitForTimeout(100);
    const description = page.locator('#empty-trash-select__description');
    await expect(description).toContainText('The trash will automatically empty every 2 weeks.');
  });

  test('Comment settings work', async ({ page }) => {
    const commentsSection = page.locator('.hgwp-app-settings-comments');
    await utils.scrollIntoView(commentsSection);
    await expect(commentsSection).toBeVisible();

    const disableCommentsToggle = page.locator('[data-id="disable-comments-toggle"]');
    await expect(disableCommentsToggle).toHaveAttribute('aria-checked', 'false');
    const closeCommentsDaysSelect = page.locator('[data-id="close-comments-days-select"]');
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
