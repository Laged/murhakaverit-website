# Changelog

All notable changes to the Murhakaverit website are documented here.

## [Unreleased] - 2025-10-03

### Fixed
- Footer button flashing on navigation (context pattern instead of portals)
- Horizontal progress bar colors to match vertical indicator
- Font size controls now properly affect content
- SSR localStorage bug in FontSizeContext
- Scroll sync between vertical (card) and horizontal (header) indicators

### Added
- Comprehensive Playwright test suite (14 tests, all passing)
- Smooth fade-in animations for page transitions
- CHANGELOG.md for tracking changes
- LATEST_CHANGES.md for detailed commit summaries

### Improved
- Button border visibility (increased opacity)
- Page transitions (smoother, more consistent)
- Realtime scroll updates

### Removed
- Unnecessary loading.tsx files (static site)
- Stale WIP documentation files

### Documentation
- Updated AGENTS.md with Nix command requirements and TDD workflow
- Updated TESTING.md with correct test count
- Reset TODO.md for next iteration
