import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the Sauce Demo inventory (products) page.
 * Shown after a successful login.
 */
export class InventoryPage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent()) ?? '';
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const rawPrices = await this.page
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    return rawPrices.map((p) => parseFloat(p.replace('$', '')));
  }

  /**
   * Select a sort option. Values: 'az' | 'za' | 'lohi' | 'hilo'
   */
  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  /**
   * Add an item to the cart by its visible product name.
   * Uses the product's data-test attribute derived from the name.
   */
  async addToCartByName(productName: string): Promise<void> {
    const item = this.page.locator('[data-test="inventory-item"]').filter({ hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    const text = (await this.cartBadge.textContent()) ?? '0';
    return parseInt(text, 10);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
