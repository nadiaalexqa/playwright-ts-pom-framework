import { test, expect } from '@fixtures/pom-fixtures';
import { USERS } from '../../src/data/users';

/**
 * Regression tests for the inventory page.
 * These are more exhaustive than smoke tests and run nightly in CI.
 */
test.describe('Inventory @regression', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('inventory page lists 6 products', async ({ inventoryPage }) => {
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test.describe('Sorting', () => {
    test('sorts by name A-Z', async ({ inventoryPage }) => {
      await inventoryPage.sortBy('az');
      const names = await inventoryPage.getProductNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);
    });

    test('sorts by name Z-A', async ({ inventoryPage }) => {
      await inventoryPage.sortBy('za');
      const names = await inventoryPage.getProductNames();
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sorted);
    });

    test('sorts by price low to high', async ({ inventoryPage }) => {
      await inventoryPage.sortBy('lohi');
      const prices = await inventoryPage.getProductPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });

    test('sorts by price high to low', async ({ inventoryPage }) => {
      await inventoryPage.sortBy('hilo');
      const prices = await inventoryPage.getProductPrices();
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });
  });

  test.describe('Cart', () => {
    test('cart badge is hidden initially', async ({ inventoryPage }) => {
      expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    });

    test('cart badge shows 1 after adding one item', async ({ inventoryPage }) => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack');
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    test('cart badge increments when adding multiple items', async ({ inventoryPage }) => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack');
      await inventoryPage.addToCartByName('Sauce Labs Bike Light');
      await inventoryPage.addToCartByName('Sauce Labs Bolt T-Shirt');
      expect(await inventoryPage.getCartBadgeCount()).toBe(3);
    });

    test('navigating to cart preserves added items', async ({ inventoryPage, page }) => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack');
      await inventoryPage.openCart();
      await expect(page).toHaveURL(/cart\.html/);
      await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    });
  });
});
