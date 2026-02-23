import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';
import { capture, pause, recordFailureImage, stepWithCapture } from './helpers/ui';

test.describe('Inventory Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.getByRole('button', { name: /^inventory$/i }).first().click();
    await pause(page, 500);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'inventory-final');
    await recordFailureImage(page, testInfo);
  });

  test('negative: shows no results on invalid search', async ({ page }, testInfo) => {
    await page.getByPlaceholder(/search devices/i).fill('ZZZ-DOES-NOT-EXIST');
    await expect(page.getByText(/no results/i)).toBeVisible();
    await stepWithCapture(page, testInfo, 'inventory-negative-no-results');
  });

  test('filters inventory and opens device detail', async ({ page }, testInfo) => {
    await expect(page.getByRole('heading', { name: /^inventory$/i })).toBeVisible();
    await stepWithCapture(page, testInfo, 'inventory-home');

    await page.getByPlaceholder(/search devices/i).fill('L-APP-1925');
    await expect(page.getByText('L-APP-1925')).toBeVisible();
    await stepWithCapture(page, testInfo, 'inventory-search-result');

    await page.getByText('L-APP-1925').click();
    await expect(page.getByRole('heading', { name: /device details/i })).toBeVisible();
    await expect(page.getByText(/specifications/i)).toBeVisible();
    await stepWithCapture(page, testInfo, 'inventory-device-details');
  });
});
