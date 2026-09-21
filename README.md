# Playwright TypeScript Page Object Model Framework

A production-oriented end-to-end test automation framework built with Playwright and TypeScript. It demonstrates maintainable UI testing practices for a QA Automation Engineer / SDET portfolio: Page Object Model (POM) abstraction, reusable fixtures, typed test data, smoke and regression suites, cross-browser CI execution, and actionable failure evidence.

The example application is [Sauce Demo](https://www.saucedemo.com/), a stable public e-commerce test application. Tests cover login validation, product inventory, sorting, and cart behavior.

## Highlights

- **Maintainable architecture:** page interactions live in page objects; test specifications describe business behavior.
- **Reusable test context:** custom Playwright fixtures inject page objects into tests.
- **Type safety:** TypeScript strict mode, path aliases, and typed locators/data catch errors before runtime.
- **Risk-based suites:** a fast smoke suite protects critical flows on every change; a broader regression suite validates key product behavior nightly.
- **Cross-browser confidence:** Chromium and Firefox run independently in CI.
- **Fast debugging:** failed or retried tests retain screenshots, videos, traces, HTML reports, and CI artifacts.
- **Quality gates:** ESLint, Prettier, and TypeScript checks run before automated tests.

## Technology Stack and Tooling

| Category                           | Tool                                                                              | Purpose                                                                                                    |
| ---------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Test runner and browser automation | [Playwright Test](https://playwright.dev/)                                        | Test execution, assertions, auto-waiting, browser control, tracing, screenshots, video, and HTML reporting |
| Language                           | [TypeScript](https://www.typescriptlang.org/)                                     | Strict, typed test and framework code                                                                      |
| Runtime and package manager        | Node.js 20+ / npm                                                                 | Local development and reproducible dependency installation                                                 |
| Linting                            | [ESLint](https://eslint.org/) 10, `typescript-eslint`, `eslint-plugin-playwright` | Static analysis and Playwright-specific test-quality rules                                                 |
| Formatting                         | [Prettier](https://prettier.io/)                                                  | Consistent, automated code formatting                                                                      |
| CI/CD                              | [GitHub Actions](https://github.com/features/actions)                             | Pull-request quality gates, smoke coverage, scheduled regression, and test-result retention                |

## Framework Architecture

```text
.
├── src/
│   ├── data/              # Typed test data and users
│   ├── fixtures/          # Custom Playwright fixtures
│   └── pages/             # Page Object Model classes and locators
├── tests/
│   ├── smoke/             # Critical-path, fast-feedback tests
│   └── regression/        # Broader functional coverage
├── .github/workflows/     # GitHub Actions CI/CD workflow
├── playwright.config.ts   # Projects, browser settings, reporters, and artifacts
├── eslint.config.mjs      # ESLint and Playwright lint rules
└── tsconfig.json          # Strict TypeScript configuration and aliases
```

Tests import `test` and `expect` from `src/fixtures/pom-fixtures.ts`. The fixture layer creates the `LoginPage` and `InventoryPage` instances for every test, keeping test scenarios focused on expected user outcomes rather than setup code. Page objects centralize stable, user-facing and `data-test` locators, making UI updates cheaper to maintain.

TypeScript path aliases keep imports readable:

```ts
import { test, expect } from '@fixtures/pom-fixtures';
import { LoginPage } from '@pages/login-page';
```

## Prerequisites

- Node.js **20 or later**
- npm
- Internet access to Sauce Demo

## Installation

```bash
git clone https://github.com/nadiaalexqa/playwright-ts-pom-framework.git
cd playwright-ts-pom-framework
npm ci
npx playwright install
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. Use `npx playwright install` again after upgrading Playwright to install its matching browser binaries.

## Running Tests

Playwright runs tests **headlessly by default**. Local runs use Chromium; CI runs Chromium and Firefox. Suites are selected by directory so that the intended test scope is explicit and easy to use in CI.

| Suite      | Purpose                                       | Headless                               | GUI / headed                                    |
| ---------- | --------------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| Smoke      | Critical login and core access checks         | `npx playwright test tests/smoke`      | `npx playwright test tests/smoke --headed`      |
| Regression | Broader inventory, sorting, and cart coverage | `npx playwright test tests/regression` | `npx playwright test tests/regression --headed` |
| Full suite | All smoke and regression tests                | `npx playwright test`                  | `npx playwright test --headed`                  |

Useful focused commands:

```bash
# Run one browser project explicitly
npx playwright test tests/smoke --project=chromium

# Run a single test file
npx playwright test tests/smoke/login.spec.ts

# Open Playwright's interactive UI mode
npx playwright test --ui

# Debug with Playwright Inspector
npx playwright test tests/smoke --debug

# Open the latest HTML report
npx playwright show-report
```

## Reporting and Failure Diagnostics

The framework uses Playwright's HTML reporter. After a run, open the result with:

```bash
npx playwright show-report
```

To balance diagnostic depth with execution speed, `playwright.config.ts` collects:

- **Trace:** on the first retry
- **Screenshot:** on failure
- **Video:** retained on failure

Artifacts are written locally to `playwright-report/` and `test-results/`; both are excluded from version control. Traces can be opened with `npx playwright show-trace path/to/trace.zip`.

## Code Quality

### ESLint

ESLint combines the recommended JavaScript and TypeScript configurations with Playwright rules. It flags common test automation problems, including skipped tests and conditional control flow inside tests. Unused variables are errors, while intentionally unused parameters may start with `_`.

```bash
# Check all source, test, and configuration files
npx eslint .

# Apply safe ESLint fixes where available
npx eslint . --fix
```

### Prettier

Prettier enforces two-space indentation, single quotes, semicolons, trailing commas, and a 100-character print width. Generated reports and dependencies are excluded through `.prettierignore`.

```bash
# Validate formatting without modifying files
npx prettier --check .

# Format repository files
npx prettier --write .
```

### Type Checking

The TypeScript compiler runs in strict mode with unused-local, unused-parameter, and implicit-return checks enabled.

```bash
npx tsc --noEmit
```

Run the three commands above before opening a pull request to reproduce the CI quality gate locally.

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/ci.yml` provides layered feedback:

1. **Triggering:** runs on pushes and pull requests targeting `main` or `master`, on manual dispatch, and nightly at **07:00 UTC**.
2. **Quality gate:** installs locked dependencies with `npm ci`, then runs ESLint, Prettier validation, and `tsc --noEmit`.
3. **Smoke tests:** after the quality gate passes, executes the smoke suite on Chromium and Firefox for every push and pull request.
4. **Regression tests:** runs only on the nightly schedule and manual workflow dispatch, also against Chromium and Firefox.
5. **Evidence retention:** every browser job uploads the HTML report and test results—including traces, screenshots, and videos—whether the job passes or fails. Artifacts are retained for 14 days.

The browser matrix uses `fail-fast: false`, so a failure in one browser does not suppress diagnostic results from the other browser. In CI, Playwright forbids accidental `test.only`, retries failures up to twice, and uses one worker for stable, predictable execution.

## Test Design Practices

- Keep tests independent and deterministic; each test owns its state and setup.
- Write scenarios in user and business terms; keep selectors and interaction mechanics inside page objects.
- Prefer resilient role, label, placeholder, and `data-test` locators over brittle CSS/XPath selectors.
- Use Playwright web-first assertions rather than arbitrary waits.
- Keep smoke coverage small and high value; place exhaustive functional and edge-case checks in regression.
- Review failed traces, screenshots, videos, and HTML reports before classifying a failure as a product defect or test issue.
- Add test data to `src/data/` and expose reusable page behavior through fixtures/page objects rather than duplicating setup in specifications.

## Contributing

1. Create a focused branch.
2. Add or update tests with the appropriate suite classification.
3. Run `npx eslint .`, `npx prettier --check .`, `npx tsc --noEmit`, and the affected Playwright suite.
4. Open a pull request; GitHub Actions must pass the quality gate and smoke tests before merge.

## Future Enhancements

The architecture can be extended with API setup/teardown, authenticated storage state, environment-specific configuration, accessibility checks, visual regression testing, test-result publishing, and test management integration without changing the POM and fixture conventions.
