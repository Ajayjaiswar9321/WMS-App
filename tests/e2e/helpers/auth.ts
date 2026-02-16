import { expect, Page } from '@playwright/test';

const LOGIN_EMAIL = 'superadmin@gmail.com';
const LOGIN_PASSWORD = '123456';

export async function resetClientState(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();
  await page.reload();
}

export async function loginAsSuperAdmin(page: Page) {
  await resetClientState(page);

  await page.getByLabel(/email address/i).fill(LOGIN_EMAIL);
  await page.getByLabel(/^password$/i).fill(LOGIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page.getByText(/status overview/i)).toBeVisible();
}
