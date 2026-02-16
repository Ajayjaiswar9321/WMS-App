import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
  });

  test('creates a new user', async ({ page }) => {
    await page.getByRole('button', { name: /user management/i }).first().click();
    await page.getByRole('button', { name: /add new user/i }).click();
    await page.getByPlaceholder(/john doe/i).fill('QA User');
    await page.getByPlaceholder(/john@example\.com/i).fill('qa-user@example.com');
    await page.getByRole('button', { name: /^create user$/i }).click();
    await expect(page.getByText('QA User')).toBeVisible();
  });
});

test.describe('Role Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
  });

  test('creates a new role', async ({ page }) => {
    await page.getByRole('button', { name: /role management/i }).first().click();
    await page.getByRole('button', { name: /create new role/i }).click();
    await page.getByPlaceholder(/sales executive/i).fill('QA Role');
    await page.getByPlaceholder(/sales_exec/i).fill('QA_ROLE');
    await page.getByPlaceholder(/briefly describe/i).fill('Automation test role');
    await page.getByRole('button', { name: /^create role$/i }).click();
    await expect(page.getByText('QA Role')).toBeVisible();
  });
});

test.describe('Outward Dispatch', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
  });

  test('creates a new dispatch', async ({ page }) => {
    await page.getByRole('button', { name: /^outward$/i }).first().click();
    await page.getByRole('button', { name: /new dispatch/i }).click();
    await page.getByPlaceholder(/customer/i).fill('QA Dispatch');
    await page.getByPlaceholder(/^inv-/i).fill('INV-1001');
    await page.getByRole('button', { name: /complete dispatch/i }).click();
    await expect(page.getByText('QA Dispatch')).toBeVisible();
  });
});

test.describe('Mobile more/settings flow', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens settings from more and signs out', async ({ page }) => {
    await loginAsSuperAdmin(page);

    await page.getByRole('button', { name: /^more$/i }).click();
    await expect(page.getByRole('heading', { name: /^more$/i })).toBeVisible();

    await page.getByRole('button', { name: /^settings$/i }).first().click();
    await expect(page.getByText(/^settings$/i)).toBeVisible();

    await page.getByRole('button', { name: /sign out/i }).first().click();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
