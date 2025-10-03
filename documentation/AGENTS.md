# Repository Guidelines

This guide outlines expectations for agents working on the Murhakaverit website.

## ⚠️ CRITICAL: Command Execution

**ALWAYS** prefix commands with `nix develop --command` - there are NO global installs.

### Correct Command Pattern
```bash
nix develop --command bun install
nix develop --command bun run dev
nix develop --command bun run test
```

### NEVER Run Directly
```bash
bun install         # ❌ WRONG - bun not globally available
npm run dev         # ❌ WRONG - npm not globally available
playwright test     # ❌ WRONG - playwright not globally available
```

## Project Structure & Module Organization
- `src/app` handles Next.js App Router pages, layouts, and shared styling (`globals.css`, `layers.css`).
- `src/components` holds UI primitives; keep files focused and colocate component-specific logic.
- `src/lib` contains data helpers such as note loaders and wiki-link transforms; keep these framework-agnostic.
- `content` mirrors the Obsidian vault after `nix develop --command bun run sync-content`; treat it as generated input.
- `public` stores static assets, while `scripts` hosts maintenance utilities like the sync script.

## Build, Test, and Development Commands
- `nix develop --command bun install` installs dependencies; rerun when lockfiles change.
- `nix develop --command bun run dev` starts the Turbopack dev server at http://localhost:3000.
- `nix develop --command bun run sync-content [path]` refreshes `content` from the vault; pass a custom path if the default differs.
- `nix develop --command bun run lint` executes ESLint; fix warnings before opening a PR.
- `nix develop --command bun run build` creates a production bundle; `nix develop --command bun start` serves it for smoke tests.
- `nix run .#test` runs Playwright tests (alternative: `nix develop --command bun run test`).

## Coding Style & Naming Conventions
Use strict TypeScript with two-space indentation and semicolons. Name React components with PascalCase, utilities with camelCase, and folders with kebab-case. Styling relies on Tailwind CSS v4 utilities; reserve bespoke CSS for layout tweaks in `src/app/layers.css`. Import shared modules through the `@/` alias defined in `tsconfig.json`.

## Testing Guidelines

### Test-Driven Development
For major changes, ALWAYS start with a test-driven approach:
1. Write tests first that define expected behavior
2. Run tests and verify they fail (red)
3. Implement the feature
4. Run tests and verify they pass (green)
5. Refactor if needed while keeping tests green

### Running Tests
Playwright tests are configured and passing (14 tests). Run `nix develop --command bun run test` before opening PRs. Tests cover homepage rendering, note routing, wiki links, navigation, metadata, scroll indicators, and realtime scroll sync. Always validate flows locally via `nix develop --command bun run dev`.

## Commit & Pull Request Workflow

### ⚠️ CRITICAL: Never Auto-Commit or Auto-Merge

**ALWAYS require manual approval before committing or merging.** Follow this workflow:

1. **Before Committing:**
   - Clean up WIP `.md` files from `documentation/` (keep only: `AGENTS.md`, `ARCHITECTURE.md`, `TESTING.md`, `NIXOS_TEST_SETUP.md`, `STATIC_EXPORT_NOTES.md`, `TODO.md`)
   - Create/update `CHANGELOG.md` with summary of changes
   - Update `TODO.md` to be ready for next work session
   - Present a **changelog of all changes** for manual testing
   - Wait for explicit user approval

2. **Commit Message Format:**
   - Follow conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
   - Use concise, present-tense summaries
   - Group related changes together

3. **Pull Request Guidelines:**
   - Describe the problem and solution
   - Include changelog/list of changes for manual testing
   - Attach screenshots for UI updates
   - Ensure `nix develop --command bun run lint` and `nix develop --command bun run build` pass
   - Wait for manual review and approval

## Content Sync & Vault Integration
Keep the source Obsidian vault tidy; only publish markdown meant for the site. After updating vault content, rerun `nix develop --command bun run sync-content` and commit the generated `content` changes alongside any UI updates. Avoid editing generated markdown directly—fix issues upstream in the vault.
