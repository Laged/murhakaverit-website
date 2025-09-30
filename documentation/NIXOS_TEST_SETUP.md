# NixOS Playwright Test Setup

This document explains how Playwright tests are configured to work identically on NixOS (local) and GitHub Actions (CI).

## Overview

The project uses **Determinate Systems Nix** in both environments:
- **Local**: NixOS with flake.nix
- **CI**: Ubuntu with Determinate Nix Installer

This ensures:
- ✅ Identical test environments locally and in CI
- ✅ Same system chromium from nixpkgs
- ✅ No FHS compatibility issues
- ✅ Consistent browser versions
- ✅ Same commands work everywhere

## Configuration

### 1. Nix Flake (`flake.nix`)

The development shell includes:
- `pkgs.chromium` - System browser for Playwright
- Environment variables set in `shellHook`:
  - `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` - Points to system chromium
  - `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` - Prevents downloading browsers

Test command via flake apps:
```nix
apps.test = {
  type = "app";
  program = toString (pkgs.writeShellScript "test" ''
    export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=${pkgs.chromium}/bin/chromium
    export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
    ${pkgs.bun}/bin/bunx playwright test "$@"
  '');
};
```

### 2. Playwright Config (`playwright.config.ts`)

Simple configuration - same for both environments:
```typescript
launchOptions: {
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
}

webServer: {
  command: 'nix develop --command bun run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
}
```

### 3. Version Compatibility

**IMPORTANT**: The Playwright npm package version must match the version in nixpkgs.

Current setup:
- nixpkgs (24.11): Playwright 1.54.1
- package.json: `"@playwright/test": "1.54.1"`

If you see browser version errors, check:
```bash
nix-env -qaP chromium --json | jq '.[].meta.version'
```

## Running Tests

### Local Development (NixOS)

```bash
# Run tests via flake app (recommended)
nix run .#test

# Run with UI mode
nix run .#test -- --ui

# Run with visible browser
nix run .#test -- --headed

# Or enter dev shell first
nix develop
bun run test
bun run test:ui
```

### CI/CD (GitHub Actions)

The GitHub Actions workflow uses Determinate Nix:
```yaml
- name: Install Nix
  uses: DeterminateSystems/nix-installer-action@main

- name: Install dependencies
  run: nix develop --command bun install

- name: Run linter
  run: nix develop --command bun run lint

- name: Run build
  run: nix develop --command bun run build

- name: Run tests
  run: nix run .#test
```

**Identical commands locally and in CI!**

Both local and CI use:
- Same Nix flake environment
- Same system chromium from nixpkgs
- Same `nix run .#test` command

## Precommit Hook

The `.husky/pre-commit` hook runs:
1. Linter: `nix develop --command bun run lint`

Tests run in CI/CD to keep commits fast (~12s test suite).

## Troubleshooting

### "Executable doesn't exist" error

This means Playwright version mismatch. Fix:
1. Check nixpkgs version
2. Update `package.json` to match
3. Run `bun install`

### "Browser not found" in dev shell

Make sure you're in the nix development shell:
```bash
nix develop
echo $PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
# Should show: /nix/store/.../bin/chromium
```

### Tests fail in CI but pass locally

Since both use the same Nix environment, this should be rare. Check:
- Timing issues (CI might be slower)
- Network issues in CI
- Environment-specific settings

## Benefits of Determinate Nix in CI

- 🚀 Fast installation (under 1 second)
- 📦 Built-in binary cache (FlakeHub Cache)
- 🔒 Reproducible environments
- ✅ Same setup locally and in CI
- 🎯 No environment drift

## Test Results

All 12 tests passing! 🎉

```
✅ homepage should render the landing note
✅ note page should render correctly
✅ note content should be rendered
✅ navigation between notes should work
✅ wiki links should be rendered as clickable links
✅ metadata should be displayed correctly
✅ vertical scroll indicator should be present on card
✅ horizontal scroll progress should be present in header
✅ scroll indicators should sync when scrolling
✅ markdown content should have proper paragraph spacing
✅ 404 page should work for non-existent notes
✅ all content files should be accessible

12 passed (11.9s)
```

## References

- [Determinate Nix Installer](https://github.com/DeterminateSystems/nix-installer-action)
- [NixOS Wiki - Playwright](https://nixos.wiki/wiki/Playwright)
- [Playwright Documentation](https://playwright.dev/docs/intro)
