import { defineConfig, devices } from '@playwright/test';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3100';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: `npm run start -- --port ${new URL(baseURL).port || '3100'}`, url: baseURL, reuseExistingServer: !process.env.CI },
});
