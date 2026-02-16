import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';

test.describe('Inspection Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
  });

  test('shows a newly added device in inspection scan list', async ({ page }) => {
    await page.getByRole('button', { name: /^inward$/i }).first().click();
    await page.getByRole('button', { name: /new batch/i }).first().click();

    await page.getByLabel(/customer/i).fill('Inspection Flow Customer');
    await page.getByLabel(/vehicle number/i).fill('MH14XY4455');
    await page.getByLabel(/driver name/i).fill('Inspect Driver');
    await page.getByLabel(/po number/i).fill('PO-INSP-10');
    await page.getByRole('button', { name: /create batch/i }).click();

    await page.getByText('Inspection Flow Customer').click();
    await page.getByRole('button', { name: /^add$/i }).click();

    await page.getByPlaceholder(/dell|hp|apple/i).fill('HP');
    await page.getByPlaceholder(/latitude|macbook/i).fill('ProBook Inspect');
    await page.getByPlaceholder(/enter serial/i).fill('SN-INSP-01');
    await page.getByPlaceholder(/scan or enter barcode/i).fill('BAR-INSP-01');
    await page.getByRole('button', { name: /add device to batch/i }).click();

    await page.getByRole('button', { name: /^inspection$/i }).first().click();
    await expect(page.getByRole('heading', { name: /^inspection$/i })).toBeVisible();

    await expect(page.getByText('BAR-INSP-01')).toBeVisible();
    await page.getByText('BAR-INSP-01').click();

    await expect(page.getByText(/checklist audit/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /finish inspection/i })).toBeDisabled();
  });
});
