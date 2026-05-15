import { test, expect } from '@playwright/test';
import { a11y } from '../helpers';

const WRAPPER = '#loginform .nfd-sso-hosting-login';
const BUTTON = '.nfd-sso-hosting-login__button';
const DIVIDER = '.nfd-sso-hosting-login__divider';
const ICON = '.nfd-sso-hosting-login__button .nfd-sso-hosting-login__icon svg';

test.describe('wp-login.php — Login with HostGator button', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/wp-login.php');
  });

  test('renders the wrapper, divider, and button on the default login screen', async ({ page }) => {
    await expect(page.locator(WRAPPER)).toBeVisible();

    const orText = await page.locator(`${DIVIDER} span`).innerText();
    expect(orText.trim().toLowerCase()).toBe('or');

    const button = page.locator(BUTTON);
    await expect(button).toBeVisible();
    await expect(button).toContainText('Login with HostGator');
  });

  test('links to the HostGator portal with link-tracker params', async ({ page }) => {
    const href = await page.locator(BUTTON).getAttribute('href');
    expect(href).toMatch(/hostgator\.com/i);
    expect(href).toMatch(/channelid=/);
    expect(href).toMatch(/utm_medium=/);
    expect(href).toMatch(/utm_source=/);
  });

  test('uses an accent color via the inline CSS custom property', async ({ page }) => {
    const style = await page.locator('.nfd-sso-hosting-login').getAttribute('style');
    expect(style).toMatch(/--nfd-sso-hosting-login-accent:\s*#[0-9a-f]{3,8}/i);
  });

  test('renders an inline brand SVG inside the button', async ({ page }) => {
    const svg = page.locator(ICON);
    await expect(svg).toHaveCount(1);
    // Bluehost uses a 3×3 grid of rects; HostGator uses the snappy mark (path).
    const marks = svg.locator('path, rect');
    await expect(marks.first()).toBeVisible();
    await expect(marks).not.toHaveCount(0);
  });

  test('sits below the submit row in the visual flex order', async ({ page }) => {
    const submitBox = await page.locator('#loginform p.submit').boundingBox();
    const wrapBox = await page.locator(WRAPPER).boundingBox();
    expect(submitBox && wrapBox).toBeTruthy();
    expect(wrapBox.y).toBeGreaterThan(submitBox.y + submitBox.height);
  });

  test('is hidden on the lostpassword screen', async ({ page }) => {
    await page.goto('/wp-login.php?action=lostpassword');
    await expect(page.locator('#lostpasswordform')).toBeVisible();
    await expect(page.locator('.nfd-sso-hosting-login')).toHaveCount(0);
  });

  test('has no critical a11y violations on the login screen', async ({ page }) => {
    await a11y.checkA11y(page, WRAPPER);
  });
});
