import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import { join } from 'path';

// Detect if we have a flake.nix file (NixOS project)
// In CI, we don't use nix, we use regular bun
const hasFlake = existsSync(join(process.cwd(), 'flake.nix'));
const isCI = !!process.env.CI;

// Use regular bun command in CI, even if flake exists
const webServerCommand = !isCI && hasFlake
  ? 'nix develop --command bun run dev'  // Local NixOS development
  : 'bun run dev';                        // CI/CD or non-Nix environments

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use system chromium on NixOS, downloaded chromium in CI
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        } : {},
      },
    },
  ],
  webServer: {
    command: webServerCommand,
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});