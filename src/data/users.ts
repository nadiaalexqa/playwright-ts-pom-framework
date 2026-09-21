/**
 * Test users for Sauce Demo.
 * Source: https://www.saucedemo.com/ (public test accounts)
 */
export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
} as const;

export type User = (typeof USERS)[keyof typeof USERS];
