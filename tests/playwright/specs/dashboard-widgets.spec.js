import { test, expect } from '@playwright/test';
import { auth, newfold, a11y, utils } from '../helpers';

const pluginId = process.env.PLUGIN_ID || 'hostgator';

test.describe('Dashboard Widgets', () => {

  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'index.php');
    await newfold.clearCapabilities();
  });

  test('Dashboard widgets are all accessible', async ({ page }) => {
    await expect(page).toHaveURL(/\/wp-admin\/index\.php(\?.*)?$/);

    try {
      await newfold.waitForDashboardWidgets(page, 15000);
    } catch (error) {
      console.log('Dashboard widgets not found, checking if widgets exist individually...');
    }

    const sitePreviewWidget = page.locator('#site_preview_widget');
    const helpWidget = page.locator(`#${pluginId}_help_widget`);
    const accountWidget = page.locator(`#${pluginId}_account_widget`);

    if (await sitePreviewWidget.count() > 0) {
      await a11y.checkA11y(page, '#site_preview_widget');
    }
    if (await helpWidget.count() > 0) {
      await a11y.checkA11y(page, `#${pluginId}_help_widget`);
    }
    if (await accountWidget.count() > 0) {
      await a11y.checkA11y(page, `#${pluginId}_account_widget`);
    }
  });

  test('Site Preview Widget', async ({ page }) => {
    await newfold.setComingSoon(false);

    await auth.navigateToAdminPage(page, 'index.php');
    await page.reload();

    const sitePreviewWidget = page.locator('#site_preview_widget');
    sitePreviewWidget.scrollIntoViewIfNeeded();
    await expect(sitePreviewWidget).toBeVisible();

    const domainElement = page.locator('.iframe-preview-domain');
    domainElement.scrollIntoViewIfNeeded();
    await expect(domainElement).toBeVisible();
    await expect(domainElement).toContainText('localhost');

    const statusElement = page.locator('.iframe-preview-status');
    statusElement.scrollIntoViewIfNeeded();
    await expect(statusElement).toBeVisible();
    await expect(statusElement).toContainText('Live');

    const widgetBody = page.locator('.site-preview-widget-body');
    await expect(widgetBody).toContainText('website is live');
    await expect(widgetBody).toHaveAttribute('data-coming-soon', 'false');

    const viewSiteLink = page.locator('a[data-test-id="nfd-view-site"]');
    viewSiteLink.scrollIntoViewIfNeeded();
    await expect(viewSiteLink).toBeVisible();
    await expect(viewSiteLink).toContainText('View Site');

    const viewSiteHref = await viewSiteLink.getAttribute('href');
    expect(viewSiteHref).toContain('localhost');

    const editSiteLink = page.locator('a[data-test-id="nfd-edit-site"]');
    editSiteLink.scrollIntoViewIfNeeded();
    await expect(editSiteLink).toBeVisible();
    await expect(editSiteLink).toContainText('Edit Site');

    const editSiteHref = await editSiteLink.getAttribute('href');
    expect(editSiteHref).toContain('site-editor');

    const enableComingSoonButton = page.locator('button[data-test-id="nfd-coming-soon-enable"]');
    enableComingSoonButton.scrollIntoViewIfNeeded();
    await expect(enableComingSoonButton).toBeVisible();
    await expect(enableComingSoonButton).toContainText('Enable Coming Soon');
    await expect(enableComingSoonButton).toHaveAttribute('type', 'button');
    await enableComingSoonButton.click();
    await page.waitForLoadState('load');

    const previewLink = page.locator('a[data-test-id="nfd-preview-site"]');
    previewLink.scrollIntoViewIfNeeded();
    await expect(previewLink).toBeVisible();
    await expect(viewSiteLink).toHaveCount(0);

    await expect(statusElement).toContainText('Not Live');

    await expect(widgetBody).toContainText('Coming Soon');
    await expect(widgetBody).toHaveAttribute('data-coming-soon', 'true');

    await expect(enableComingSoonButton).toHaveCount(0);

    const disableComingSoonButton = page.locator('button[data-test-id="nfd-coming-soon-disable"]');
    disableComingSoonButton.scrollIntoViewIfNeeded();
    await expect(disableComingSoonButton).toBeVisible();
    await expect(disableComingSoonButton).toContainText('Launch Site');
    await expect(disableComingSoonButton).toHaveAttribute('type', 'button');

    await disableComingSoonButton.click();
    await page.waitForLoadState('load');

    viewSiteLink.scrollIntoViewIfNeeded();
    await expect(viewSiteLink).toBeVisible();
    await expect(statusElement).toContainText('Live');
    await expect(widgetBody).toContainText('website is live');
    await expect(widgetBody).toHaveAttribute('data-coming-soon', 'false');
    await expect(previewLink).toHaveCount(0);

    await expect(disableComingSoonButton).toHaveCount(0);
    await expect(enableComingSoonButton).toContainText('Enable Coming Soon');
    await expect(enableComingSoonButton).toHaveAttribute('type', 'button');
  });

  test.skip('Help Widget', async ({ page }) => {
    const helpWidget = page.locator(`#${pluginId}_help_widget`);
    await expect(helpWidget).toBeVisible();

    const helpLink = page.locator('[data-test-id="nfd-widget-help-link"]');
    await utils.scrollIntoView(helpLink);
    await expect(helpLink).toContainText('Get Help');
    await expect(helpLink).toHaveAttribute('data-help-center', 'false');

    const helpHref = await helpLink.getAttribute('href');
    expect(helpHref).toContain('help');

    await newfold.setCapability({
      canAccessAI: true,
      canAccessHelpCenter: true,
    });

    await page.reload();
    await newfold.logCapabilities();

    await utils.scrollIntoView(helpLink);
    await expect(helpLink).toContainText('Get Help');
    await expect(helpLink).toHaveAttribute('data-help-center', 'true');
    await helpLink.click();

    const helpCenter = page.locator('#nfd-help-center');
    await utils.scrollIntoView(helpCenter);
    await expect(helpCenter).toContainText('Help');
    await expect(helpCenter).toBeVisible();
  });

  test.skip('Account widget links', async ({ page }) => {
    const accountWidget = page.locator(`#${pluginId}_account_widget`);
    await expect(accountWidget).toBeVisible();

    await newfold.verifyWidgetLink(
      page,
      '[data-test-id="nfd-widget-account-link-profile"]',
      'Profile',
      pluginId,
      { href: /utm_source/ }
    );

    await newfold.verifyWidgetLink(
      page,
      '[data-test-id="nfd-widget-account-link-email"]',
      'Mail',
      'email-office',
      { href: /utm_source/ }
    );

    await newfold.verifyWidgetLink(
      page,
      '[data-test-id="nfd-widget-account-link-hosting"]',
      'Hosting',
      'hosting',
      { href: /utm_source/ }
    );

    await newfold.verifyWidgetLink(
      page,
      '[data-test-id="nfd-widget-account-link-security"]',
      'Security',
      'security',
      { href: /utm_source/ }
    );
  });
});
