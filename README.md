# Murhakaverit Website

NKL 2068 Jubensha vault with futuristic card UI.

## Quick Start

```bash
# Development
nix develop --command bun run dev

# Build static site
nix develop --command bun run build

# Run tests
nix develop --command bun run test
```

## Features

- ✅ Static site generation (Next.js 15)
- ✅ Markdown notes with wiki-style links
- ✅ Futuristic card UI with dual scroll indicators
- ✅ Font size controls
- ✅ Comprehensive e2e tests

## Tech Stack

- **Framework:** Next.js 15.5.4 (App Router + Turbopack)
- **React:** 19.1.0
- **Styling:** Tailwind CSS 4
- **Testing:** Playwright 1.54.1
- **Runtime:** Bun 1.1+ or Node 20.17+

## Documentation

See [`documentation/`](./documentation/) folder for:
- [ARCHITECTURE.md](./documentation/ARCHITECTURE.md) - System architecture
- [TESTING.md](./documentation/TESTING.md) - Test setup & usage
- [NIXOS_TEST_SETUP.md](./documentation/NIXOS_TEST_SETUP.md) - NixOS configuration
- [TODO.md](./documentation/TODO.md) - Implementation checklist
- [OPTIMIZATION_RECOMMENDATIONS.md](./documentation/OPTIMIZATION_RECOMMENDATIONS.md) - Future improvements

## License

Private project for Murhakaverit ry