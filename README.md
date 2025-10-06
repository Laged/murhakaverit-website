# Murhakaverit Website

Futuristic vault-style website for Murhakaverit murder mystery content, built with Next.js 15 and static export.

## Quick Start

### Prerequisites

- NixOS or Nix with flakes enabled
- Git

### Development

```bash
# Enter development environment
nix develop

# Install dependencies
bun install

# Sync content from Obsidian vault
bun run sync-content

# Start dev server
bun run dev
```

Visit http://localhost:3000

## Testing

```bash
# Run Playwright tests
nix run .#test

# Run with UI mode
nix run .#test -- --ui

# Run just linting
nix develop --command bun run lint

# Run just build
nix develop --command bun run build
```

## Project Structure

```
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   └── lib/          # Data loaders and utilities
├── content/          # Generated from Obsidian vault
├── public/           # Static assets
├── tests/            # Playwright E2E tests
└── documentation/    # Technical documentation
```

## Documentation

### Architecture & Setup
- [ARCHITECTURE.md](./documentation/ARCHITECTURE.md) - Architecture overview
- [NIXOS_TEST_SETUP.md](./documentation/NIXOS_TEST_SETUP.md) - NixOS Playwright setup
- [STATIC_EXPORT_NOTES.md](./documentation/STATIC_EXPORT_NOTES.md) - Static export behavior
- [TESTING.md](./documentation/TESTING.md) - Testing guide

### Styling & Theming
- [style-guide.md](./docs/style-guide.md) - **Tailwind CSS v4 styling best practices (START HERE)**
- [THEME.md](./documentation/THEME.md) - Legacy theme documentation (character themes)

### Development
- [AGENTS.md](./documentation/AGENTS.md) - AI agent guidelines for this project

## Tech Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4
- **Testing**: Playwright
- **Development**: NixOS with flakes
- **CI/CD**: GitHub Actions with Determinate Nix

## Contributing

1. Make changes
2. Run `bun run lint` to check code
3. Commit (precommit hook runs linting)
4. Push (CI runs full checks)

## License

Proprietary - All rights reserved
