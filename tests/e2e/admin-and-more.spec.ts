import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';
import { capture, pause, recordFailureImage, stepWithCapture } from './helpers/ui';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await pause(page, 500);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'users-final');
    await recordFailureImage(page, testInfo);
  });

  test('creates a new user', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: /user management/i }).first().click();
    await page.getByRole('button', { name: /add new user/i }).click();
    await page.getByPlaceholder(/john doe/i).fill('QA User');
    await page.getByPlaceholder(/john@example\.com/i).fill('qa-user@example.com');
    await stepWithCapture(page, testInfo, 'users-form-filled');

    await page.getByRole('button', { name: /^create user$/i }).click();
    await expect(page.getByText('QA User')).toBeVisible();
    await stepWithCapture(page, testInfo, 'users-created');
  });
});

test.describe('Role Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await pause(page, 500);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'roles-final');
    await recordFailureImage(page, testInfo);
  });

  test('creates a new role', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: /role management/i }).first().click();
    await page.getByRole('button', { name: /create new role/i }).click();
    await page.getByPlaceholder(/sales executive/i).fill('QA Role');
    await page.getByPlaceholder(/sales_exec/i).fill('QA_ROLE');
    await page.getByPlaceholder(/briefly describe/i).fill('Automation test role');
    await stepWithCapture(page, testInfo, 'roles-form-filled');

    await page.getByRole('button', { name: /^create role$/i }).click();
    await expect(page.getByText('QA Role')).toBeVisible();
    await stepWithCapture(page, testInfo, 'roles-created');
  });
});

test.describe('Outward Dispatch', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await pause(page, 500);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'outward-final');
    await recordFailureImage(page, testInfo);
  });

  test('negative: blocks dispatch without invoice/po info', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: /^outward$/i }).first().click();
    await page.getByRole('button', { name: /new dispatch/i }).click();
    await page.getByPlaceholder(/customer/i).fill('No Docs Customer');

    let dialogSeen = false;
    page.on('dialog', async (dialog) => {
      dialogSeen = true;
      await dialog.accept();
    });

    await page.getByRole('button', { name: /complete dispatch/i }).click();
    await expect.poll(() => dialogSeen).toBe(true);
    await stepWithCapture(page, testInfo, 'outward-negative-validation');
  });

  test('creates a new dispatch', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: /^outward$/i }).first().click();
    await page.getByRole('button', { name: /new dispatch/i }).click();
    await page.getByPlaceholder(/customer/i).fill('QA Dispatch');
    await page.getByPlaceholder(/^inv-/i).fill('INV-1001');
    await stepWithCapture(page, testInfo, 'outward-form-filled');

    await page.getByRole('button', { name: /complete dispatch/i }).click();
    await expect(page.getByText('QA Dispatch')).toBeVisible();
    await stepWithCapture(page, testInfo, 'outward-created');
  });
});

test.describe('Mobile more/settings flow', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'mobile-more-final');
    await recordFailureImage(page, testInfo);
  });

  test('opens settings from more and signs out', async ({ page }, testInfo) => {
    await loginAsSuperAdmin(page);

    await page.getByRole('button', { name: /^more$/i }).click();
    await expect(page.getByRole('heading', { name: /^more$/i })).toBeVisible();
    await stepWithCapture(page, testInfo, 'mobile-more-screen');

    await page.getByRole('button', { name: /^settings$/i }).first().click();
    await expect(page.getByText(/^settings$/i)).toBeVisible();
    await stepWithCapture(page, testInfo, 'mobile-settings-screen');

    await page.getByRole('button', { name: /sign out/i }).first().click();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await stepWithCapture(page, testInfo, 'mobile-after-signout');
  });
});
