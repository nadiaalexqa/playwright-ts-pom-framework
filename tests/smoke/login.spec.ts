import { test, expect } from '@fixtures/pom-fixtures';
import { USERS } from '../../src/data/users';

test.describe('Login @smoke', () => {
  test('standard user can log in successfully', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await expect(inventoryPage.title).toHaveText('Products');
    await expect(await inventoryPage.getItemCount()).toBeGreaterThan(0);
  });

  test('locked out user sees an error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });
});
