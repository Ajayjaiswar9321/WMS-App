import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';

test.describe('Inward Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.getByRole('button', { name: /^inward$/i }).first().click();
  });

  test('creates a batch and adds a device to it', async ({ page }) => {
    await page.getByRole('button', { name: /new batch/i }).first().click();

    await page.getByLabel(/customer/i).fill('QA Batch Customer');
    await page.getByLabel(/vehicle number/i).fill('MH12AB1234');
    await page.getByLabel(/driver name/i).fill('Test Driver');
    await page.getByLabel(/po number/i).fill('PO-9001');

    await page.getByRole('button', { name: /create batch/i }).click();
    await expect(page.getByText('QA Batch Customer')).toBeVisible();

    await page.getByText('QA Batch Customer').click();
    await expect(page.getByText(/batch details/i)).toBeVisible();

    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText(/add new product/i)).toBeVisible();

    await page.getByPlaceholder(/dell|hp|apple/i).fill('Dell');
    await page.getByPlaceholder(/latitude|macbook/i).fill('Latitude QA');
    await page.getByPlaceholder(/enter serial/i).fill('SER-9001');
    await page.getByPlaceholder(/scan or enter barcode/i).fill('BAR-9001');

    await page.getByRole('button', { name: /add device to batch/i }).click();

    await expect(page.getByText(/batch details/i)).toBeVisible();
    await expect(page.getByText('Latitude QA')).toBeVisible();
  });
});
