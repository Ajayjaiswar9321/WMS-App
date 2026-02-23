import { expect, test } from '@playwright/test';
import { loginAsSuperAdmin } from './helpers/auth';
import { capture, pause, recordFailureImage, stepWithCapture } from './helpers/ui';

const sections = [
  { menu: 'Dashboard', text: /status overview/i, shot: 'nav-dashboard' },
  { menu: 'Inward', text: /^inward$/i, shot: 'nav-inward' },
  { menu: 'Inspection', text: /^inspection$/i, shot: 'nav-inspection' },
  { menu: 'Spares', text: /spares management/i, shot: 'nav-spares' },
  { menu: 'Repair', text: /repair station/i, shot: 'nav-repair' },
  { menu: 'Paint', text: /paint shop/i, shot: 'nav-paint' },
  { menu: 'QC', text: /quality control/i, shot: 'nav-qc' },
  { menu: 'Inventory', text: /^inventory$/i, shot: 'nav-inventory' },
  { menu: 'Outward', text: /^outward$/i, shot: 'nav-outward' },
  { menu: 'User Management', text: /user management/i, shot: 'nav-users' },
  { menu: 'Role Management', text: /role management/i, shot: 'nav-roles' },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
    await pause(page, 500);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await capture(page, testInfo, 'navigation-final');
    await recordFailureImage(page, testInfo);
  });

  test('navigates through all sidebar modules with UI checks', async ({ page }, testInfo) => {
    for (const section of sections) {
      await page.getByRole('button', { name: new RegExp(`^${section.menu}$`, 'i') }).first().click();
      await expect(page.getByText(section.text).first()).toBeVisible();
      await stepWithCapture(page, testInfo, section.shot, 500);
    }
  });
});
