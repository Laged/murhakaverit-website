# Changelog

All notable changes to the Murhakaverit website are documented here.

## [Unreleased] - 2025-10-03

### Fixed
- Footer button flashing on navigation (context pattern instead of portals)
- Horizontal progress bar colors to match vertical indicator
- Font size controls now properly affect content
- SSR localStorage bug in FontSizeContext
- Scroll sync between vertical (card) and horizontal (header) indicators
- Navigation glow effects being clipped on edge items (A and E characters)

### Added
- Comprehensive Playwright test suite (16 tests, all passing)
- Smooth fade-in animations for page transitions using React's unstable_ViewTransition
- View Transitions API support for card background and content layers
- Enhanced futuristic selection highlight with animated underline and ambient glow
- CHANGELOG.md for tracking changes
- LATEST_CHANGES.md for detailed commit summaries

### Improved
- Button border visibility (increased opacity)
- Page transitions (smoother, more consistent with browser View Transitions API)
- Realtime scroll updates
- Navigation selection highlighting - now uses subtle animated underline and radial glow instead of button-like appearance
- Mobile spacing - significantly reduced header and footer padding for more content space
- Title glow animation - slower and more subtle with cyan accents

### Removed
- Unnecessary loading.tsx files (static site)
- Stale WIP documentation files

### Documentation
- Updated AGENTS.md with Nix command requirements and TDD workflow
- Updated TESTING.md with correct test count
- Reset TODO.md for next iteration
