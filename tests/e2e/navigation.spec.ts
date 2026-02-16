import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';

const sections = [
  { menu: 'Dashboard', text: /status overview/i },
  { menu: 'Inward', text: /^inward$/i },
  { menu: 'Inspection', text: /^inspection$/i },
  { menu: 'Spares', text: /spares management/i },
  { menu: 'Repair', text: /repair station/i },
  { menu: 'Paint', text: /paint shop/i },
  { menu: 'QC', text: /quality control/i },
  { menu: 'Inventory', text: /^inventory$/i },
  { menu: 'Outward', text: /^outward$/i },
  { menu: 'User Management', text: /user management/i },
  { menu: 'Role Management', text: /role management/i },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
  });

  test('navigates through all sidebar modules', async ({ page }) => {
    for (const section of sections) {
      await page.getByRole('button', { name: new RegExp(`^${section.menu}$`, 'i') }).first().click();
      await expect(page.getByText(section.text).first()).toBeVisible();
    }
  });
});
