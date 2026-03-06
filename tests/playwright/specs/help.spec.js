import { test, expect } from '@playwright/test';
import { auth, a11y, utils } from '../helpers';

test.describe('Help Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/newfold-marketplace**/v1**/marketplace**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ products: [], notifications: [] }),
      });
    });
    await page.route('**/newfold-notifications**/v1**/notifications**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ notifications: [] }),
      });
    });
    await auth.navigateToAdminPage(page, 'admin.php?page=hostgator#/help');
  });

  test('A11y and cards each exist', async ({ page }) => {
    await page.waitForSelector('#hgwp-app-rendered', { timeout: 10000 });
    await page.waitForSelector('.hgwp-app-body', { timeout: 10000 });
    await a11y.checkA11y(page, '.hgwp-app-body');

    const helpCards = [
      { selector: '.card-help-phone', title: 'Phone' },
      { selector: '.card-help-chat', title: 'Chat' },
      { selector: '.card-help-twitter', title: 'Tweet' },
      { selector: '.card-help-kb', title: 'Knowledge Base' },
      { selector: '.card-help-blog', title: 'Blog' },
      { selector: '.card-help-video', title: 'Video Tutorials' },
    ];

    for (const card of helpCards) {
      const cardElement = page.locator(card.selector);
      await utils.scrollIntoView(cardElement);
      await expect(cardElement).toBeVisible();
      await expect(cardElement.locator('h3')).toContainText(card.title);
    }
  });
});
