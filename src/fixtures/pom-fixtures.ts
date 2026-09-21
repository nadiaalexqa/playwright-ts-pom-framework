import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { InventoryPage } from '@pages/inventory-page';

/**
 * Custom Playwright test with Page Object Model fixtures.
 * Tests import { test, expect } from this file — not from @playwright/test.
 */
type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
