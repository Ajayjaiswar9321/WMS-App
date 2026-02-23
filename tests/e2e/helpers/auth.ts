import { expect, Page } from '@playwright/test';

const LOGIN_EMAIL = 'superadmin@gmail.com';
const LOGIN_PASSWORD = '123456';

export async function resetClientState(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
}

export async function loginAsSuperAdmin(page: Page) {
  await resetClientState(page);

  await page.locator('#email').fill(LOGIN_EMAIL);
  await page.locator('#password').fill(LOGIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page.getByText(/status overview/i)).toBeVisible();
}
