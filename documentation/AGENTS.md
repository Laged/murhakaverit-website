# Repository Guidelines

This guide outlines expectations for agents working on the Murhakaverit website.

## Project Structure & Module Organization
- `src/app` handles Next.js App Router pages, layouts, and shared styling (`globals.css`, `layers.css`).
- `src/components` holds UI primitives; keep files focused and colocate component-specific logic.
- `src/lib` contains data helpers such as note loaders and wiki-link transforms; keep these framework-agnostic.
- `content` mirrors the Obsidian vault after `bun run sync-content`; treat it as generated input.
- `public` stores static assets, while `scripts` hosts maintenance utilities like the sync script.

## Build, Test, and Development Commands
- `bun install` installs dependencies; rerun when lockfiles change.
- `bun dev` starts the Turbopack dev server at http://localhost:3000.
- `bun run sync-content [path]` refreshes `content` from the vault; pass a custom path if the default differs.
- `bun run lint` executes ESLint; fix warnings before opening a PR.
- `bun run build` creates a production bundle; `bun start` serves it for smoke tests.

## Coding Style & Naming Conventions
Use strict TypeScript with two-space indentation and semicolons. Name React components with PascalCase, utilities with camelCase, and folders with kebab-case. Styling relies on Tailwind CSS v4 utilities; reserve bespoke CSS for layout tweaks in `src/app/layers.css`. Import shared modules through the `@/` alias defined in `tsconfig.json`.

## Testing Guidelines
Automated tests are not yet wired. Document manual verification in each PR and, when adding features, create lightweight component or integration tests with React Testing Library under `src/__tests__` (create the folder if absent). Always validate flows locally via `bun dev`.

## Commit & Pull Request Guidelines
Follow the conventional prefixes in history (`feat:`, `fix:`, `chore:`) with concise, present-tense summaries and group related changes together. PRs should describe the problem, outline the solution, and call out follow-up steps such as rerunning `bun run sync-content`. Attach screenshots for UI updates, link relevant issues, and ensure `bun run lint` and `bun run build` pass before requesting review.

## Content Sync & Vault Integration
Keep the source Obsidian vault tidy; only publish markdown meant for the site. After updating vault content, rerun `bun run sync-content` and commit the generated `content` changes alongside any UI updates. Avoid editing generated markdown directly—fix issues upstream in the vault.
