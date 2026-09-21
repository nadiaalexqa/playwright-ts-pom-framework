import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the playwright-ts-pom-framework project.
 *
 * Key design decisions:
 * - baseURL points at Sauce Demo (industry-standard QA target).
 * - Trace, screenshot, and video are captured only on failure to keep runs fast.
 * - Local runs execute Chromium only (avoids a known headless Firefox profile
 *   bug on macOS). CI runs Chromium + Firefox for full cross-browser coverage.
 * - Retries and workers are tuned for CI stability without slowing local runs.
 */
export default defineConfig({
  testDir: './tests',

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only — local failures should fail fast for fast feedback. */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI for predictable resource usage. */
  workers: process.env.CI ? 1 : undefined,

  /* HTML reporter gives a rich, clickable report after every run. */
  reporter: 'html',

  /* Shared settings for all projects below. */
  use: {
    baseURL: 'https://www.saucedemo.com',

    /* Capture debugging artifacts only when a test fails or retries. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /*
   * Projects: define the browsers to test against.
   *
   * Local (macOS): Chromium only — Playwright's Firefox build cannot create
   * its temporary profile in headless mode on macOS, causing the launch to
   * fail with "Could not find profile folder".
   *
   * CI (Linux): Chromium + Firefox — the macOS bug does not exist on Linux,
   * so we get full cross-browser coverage where it matters most.
   */
  projects: process.env.CI
    ? [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
      ]
    : [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ],

  /* Run the local dev server before starting tests if needed (not used here). */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
