import { test, expect } from '@playwright/test';
import { auth, newfold, utils } from '../helpers';

/**
 * The admin notice shown on non-app wp-admin screens while Coming Soon is active
 * (defined in bootstrap.php via the `newfold/coming-soon/filter/args` filter).
 *
 * Both links in the notice — "coming soon page" and "launch your site" — should
 * take the user to the Coming Soon toggle in the plugin settings, which is the
 * control for turning the coming soon page on and off. Previously the "coming
 * soon page" link pointed at the front-end preview (`?preview=coming_soon`),
 * which rendered the live homepage rather than the toggle.
 */
test.describe('Coming Soon admin notice', () => {

  test.beforeEach(async () => {
    await newfold.setComingSoon(true);
  });

  test.afterEach(async () => {
    await newfold.setComingSoon(false);
  });

  test('Both notice links point to the coming soon settings toggle', async ({ page }) => {
    // A non-app admin screen, where the notice is rendered.
    await auth.navigateToAdminPage(page, 'options-general.php');

    const notice = page.locator('.notice-warning', {
      hasText: 'Your site is currently displaying a coming soon page',
    });
    await expect(notice).toBeVisible();

    const comingSoonLink = notice.getByRole('link', { name: 'coming soon page' });
    const launchLink = notice.getByRole('link', { name: 'launch your site' });

    // Both links resolve to the coming soon settings section. The route must be
    // `#/settings/settings` — with only `#/settings` the settings accordion stays
    // collapsed and the coming soon option is never shown.
    for (const link of [comingSoonLink, launchLink]) {
      const href = await link.getAttribute('href');
      expect(href).toContain('page=hostgator');
      expect(href).toContain('nfd-target=coming-soon-section');
      expect(href).toContain('#/settings/settings');
    }

    // The "coming soon page" link must no longer open the front-end preview.
    const comingSoonHref = await comingSoonLink.getAttribute('href');
    expect(comingSoonHref).not.toContain('preview=coming_soon');
  });

  test('Notice link destination shows the coming soon toggle', async ({ page }) => {
    // Follow the notice link's destination and confirm the coming soon control is
    // actually reachable there (accordion expanded), not just present in the DOM.
    await auth.navigateToAdminPage(page, 'options-general.php');
    const comingSoonLink = page
      .locator('.notice-warning', { hasText: 'Your site is currently displaying a coming soon page' })
      .getByRole('link', { name: 'coming soon page' });
    const href = await comingSoonLink.getAttribute('href');

    // Follow the exact route the notice link points at, via the same navigation
    // path the app expects (raw goto does not reliably mount the SPA).
    const url = new URL(href);
    const route = url.pathname.replace('/wp-admin/', '') + url.search + url.hash;
    await auth.navigateToAdminPage(page, route);
    await page.waitForSelector('#hgwp-app-rendered', { timeout: 10000 });

    const comingSoonSection = page.locator('.hgwp-app-settings-coming-soon');
    await utils.scrollIntoView(comingSoonSection);
    await expect(comingSoonSection).toBeVisible();

    // The `nfd-target=coming-soon-section` param briefly highlights (blinks) the
    // section so the user's eye lands on the right control.
    await expect(comingSoonSection).toHaveClass(/hgwp-animation-blink/);
  });
});
