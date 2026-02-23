import { expect, test } from '@playwright/test';
import { resetClientState } from './helpers/auth';
import { capture, pause, recordFailureImage, stepWithCapture } from './helpers/ui';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await resetClientState(page);
    await pause(page, 400);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'auth-final');
    await recordFailureImage(page, testInfo);
  });

  test('shows login screen UI by default', async ({ page }, testInfo) => {
    await expect(page.getByText('COMPRINT')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await stepWithCapture(page, testInfo, 'auth-login-screen');
  });

  test('negative: browser blocks submit on empty required fields', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('#email')).toBeFocused();
    await stepWithCapture(page, testInfo, 'auth-negative-empty-fields');
  });

  test('logs in with arbitrary credentials in current mock auth mode', async ({ page }, testInfo) => {
    await page.locator('#email').fill('unknown-user@example.com');
    await page.locator('#password').fill('any-password');
    await stepWithCapture(page, testInfo, 'auth-filled-arbitrary');

    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/status overview/i)).toBeVisible();
    await stepWithCapture(page, testInfo, 'auth-post-login-arbitrary');
  });

  test('logs in and signs out from sidebar', async ({ page }, testInfo) => {
    await page.locator('#email').fill('superadmin@gmail.com');
    await page.locator('#password').fill('123456');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/status overview/i)).toBeVisible();
    await stepWithCapture(page, testInfo, 'auth-dashboard-after-login');

    await page.getByRole('button', { name: /sign out/i }).first().click();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await stepWithCapture(page, testInfo, 'auth-after-signout');
  });
});
