import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';

test.describe('Inventory Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.getByRole('button', { name: /^inventory$/i }).first().click();
  });

  test('filters inventory and opens device detail', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /^inventory$/i })).toBeVisible();

    await page.getByPlaceholder(/search devices/i).fill('L-APP-1925');
    await expect(page.getByText('L-APP-1925')).toBeVisible();

    await page.getByText('L-APP-1925').click();
    await expect(page.getByRole('heading', { name: /device details/i })).toBeVisible();
    await expect(page.getByText(/specifications/i)).toBeVisible();
  });
});
