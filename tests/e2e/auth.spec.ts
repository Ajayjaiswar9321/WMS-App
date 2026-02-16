import { expect, test } from '@playwright/test';
import { resetClientState } from './helpers/auth';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await resetClientState(page);
  });

  test('shows login screen by default', async ({ page }) => {
    await expect(page.getByText('COMPRINT')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('rejects invalid password', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('superadmin@gmail.com');
    await page.getByLabel(/^password$/i).fill('wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('logs in and signs out from sidebar', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('superadmin@gmail.com');
    await page.getByLabel(/^password$/i).fill('123456');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/status overview/i)).toBeVisible();
    await page.getByRole('button', { name: /sign out/i }).first().click();

    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
