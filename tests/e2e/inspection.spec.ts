import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';
import { capture, pause, recordFailureImage, stepWithCapture } from './helpers/ui';

test.describe('Inspection Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await pause(page, 500);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'inspection-final');
    await recordFailureImage(page, testInfo);
  });

  test('negative: does not move to inspect screen for unknown barcode', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: /^inspection$/i }).first().click();
    await page.getByPlaceholder(/enter barcode/i).fill('UNKNOWN-BARCODE-001');
    await page.locator('button:has(svg.lucide-search)').click();

    await expect(page.getByText(/recently received/i)).toBeVisible();
    await expect(page.getByText(/checklist audit/i)).toHaveCount(0);
    await stepWithCapture(page, testInfo, 'inspection-negative-unknown-barcode');
  });

  test('shows a newly added device in inspection scan list', async ({ page }, testInfo) => {
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
    await stepWithCapture(page, testInfo, 'inspection-home');

    await expect(page.getByText('BAR-INSP-01')).toBeVisible();
    await page.getByText('BAR-INSP-01').click();

    await expect(page.getByText(/checklist audit/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /finish inspection/i })).toBeDisabled();
    await stepWithCapture(page, testInfo, 'inspection-checklist-screen');
  });
});
