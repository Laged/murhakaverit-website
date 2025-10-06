# Style Guide

> Best practices for styling components in the Murhakaverit website using Tailwind CSS v4

## Table of Contents

1. [Theme Architecture](#theme-architecture)
2. [Using Theme Colors](#using-theme-colors)
3. [Creating New Components](#creating-new-components)
4. [CSS Best Practices](#css-best-practices)
5. [Texture & Pattern Classes](#texture--pattern-classes)

---

## Theme Architecture

Our project uses **Tailwind CSS v4** with the `@theme` directive for centralized design tokens.

### File Structure

```
src/app/
├── globals.css           # Main theme colors (Gamma palette, keywords)
└── themes/
    └── horror.css        # Horror/crime theme colors & textures
```

### Theme Directives

We use two approaches for defining colors:

1. **`@theme`** - Creates Tailwind utility classes
2. **`:root`** - Legacy CSS variables for backward compatibility

```css
/* In globals.css or horror.css */
@theme {
  /* This creates bg-blood-red, text-blood-red utilities */
  --color-blood-red: #8b0000;
}

:root {
  /* Legacy variable for direct CSS usage */
  --blood-red: var(--color-blood-red);
}
```

---

## Using Theme Colors

### ✅ Preferred: Tailwind Utilities

Use Tailwind classes whenever possible:

```tsx
// Good - using Tailwind utilities
<div className="bg-almost-black text-blood-red">
  <h1 className="text-gamma-contrast">Title</h1>
</div>
```

### Available Color Utilities

#### Horror Theme Colors
- `bg-blood-red` / `text-blood-red` - Primary blood red (#8b0000)
- `bg-blood-red-dark` / `text-blood-red-dark` - Dark blood red (#5c0000)
- `bg-blood-red-light` / `text-blood-red-light` - Light blood red (#a52a2a)
- `bg-blood-drip` / `text-blood-drip` - Blood drip color (#660000)
- `bg-crime-scene-yellow` / `text-crime-scene-yellow` - Crime tape yellow (#fbbf24)
- `bg-almost-black` / `text-almost-black` - Almost black (#0a0000)
- `bg-pure-black` / `text-pure-black` - Pure black (#000)

#### Gamma Theme Colors
- `bg-gamma-surface` / `text-gamma-surface` - Dark surface (#0d0f14)
- `bg-gamma-ambient` / `text-gamma-ambient` - Ambient color (#131a26)
- `bg-gamma-contrast` / `text-gamma-contrast` - High contrast (#f5f7ff)
- `bg-gamma-accent` / `text-gamma-accent` - Accent cyan (#5ef2ff)

#### Keyword Colors
- `text-keyword-character` - Character keyword (#7dfcff)
- `text-keyword-item` - Item keyword (#ffb85c)
- `text-keyword-evidence` - Evidence keyword (#8d6bff)
- `text-keyword-location` - Location keyword (#54e38f)
- `text-keyword-fact` - Fact keyword (#ffd36b)
- `text-keyword-important` - Important keyword (#ff5f8f)

### When to Use CSS Variables

Only use CSS variables for:
- Complex gradients
- Dynamic inline styles
- Legacy compatibility

```tsx
// Acceptable - for complex inline styles
<div style={{
  background: `radial-gradient(circle, var(--color-blood-red), transparent)`
}}>
```

---

## Creating New Components

### Component Styling Checklist

- [ ] Use Tailwind utilities for colors (`bg-*`, `text-*`)
- [ ] Use existing texture classes when applicable
- [ ] Avoid hardcoded hex colors
- [ ] Follow responsive design patterns
- [ ] Use theme colors for consistency

### Example: New Horror-Themed Card

```tsx
export function HorrorCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-almost-black border border-blood-red-dark p-6 rounded-lg">
      <div className="texture-subtle-stripes">
        {children}
      </div>
    </div>
  );
}
```

---

## CSS Best Practices

### 1. Layer Organization

Use `@layer` for organizing custom CSS:

```css
@layer base {
  /* Base styles, :root variables */
}

@layer components {
  /* Reusable component classes */
  .custom-button { ... }
}

@layer utilities {
  /* Custom utility classes */
  .rotate-45 { ... }
}
```

### 2. Adding New Theme Colors

**Step 1:** Add to `@theme` in appropriate file

```css
/* In src/app/themes/horror.css */
@theme {
  --color-new-horror-shade: #1a0505;
}
```

**Step 2:** Add legacy variable for compatibility

```css
@layer base {
  :root {
    --new-horror-shade: var(--color-new-horror-shade);
  }
}
```

**Step 3:** Use in components

```tsx
<div className="bg-new-horror-shade">
  Now available as Tailwind utility!
</div>
```

### 3. Naming Conventions

- Theme colors: `--color-{semantic-name}`
- Component-specific: `--{component}-{property}`
- Use kebab-case for all CSS variables

---

## Texture & Pattern Classes

### Available Texture Classes

Defined in `src/app/themes/horror.css`:

#### `.texture-subtle-stripes`
Subtle dark red stripes on black background
```tsx
<div className="texture-subtle-stripes">
  Content with subtle texture
</div>
```

#### `.texture-houndstooth`
Classic noir houndstooth pattern (broken - use inline)
```tsx
// Currently use Hero.tsx inline implementation as reference
```

#### `.texture-blood-cells`
Subtle organic blood cell pattern
```tsx
<div className="texture-blood-cells">
  Organic textured background
</div>
```

#### `.texture-cross-hatch`
Crime scene evidence marker pattern
```tsx
<div className="texture-cross-hatch">
  Yellow cross-hatch pattern
</div>
```

#### `.texture-noise`
Film grain/noise overlay
```tsx
<div className="texture-noise">
  Content with noise overlay
</div>
```

### Creating New Textures

1. Add to `@layer components` in `horror.css`
2. Use theme color variables
3. Document in this guide

```css
@layer components {
  .texture-custom-pattern {
    background-color: var(--color-almost-black);
    background-image: /* your pattern */;
  }
}
```

---

## Quick Reference

### Do's ✅
- Use Tailwind utilities: `bg-blood-red`, `text-gamma-contrast`
- Use theme color variables: `var(--color-blood-red)`
- Create reusable texture classes in `@layer components`
- Follow responsive design with Tailwind breakpoints

### Don'ts ❌
- Hardcode hex colors: `#8b0000`
- Use inline styles for simple colors
- Create one-off CSS classes without `@layer`
- Skip the `@theme` directive for new colors

---

## Examples

### Landing Page Hero Section
```tsx
// src/components/hero/Hero.tsx
export function Hero() {
  return (
    <div className="bg-almost-black h-screen flex items-center">
      <AnimatedLogo />
    </div>
  );
}
```

### Crime Scene Tape
```css
/* src/components/hero/crime-scene.css */
.crime-scene {
  background-color: var(--color-blood-red);
}

.crime-scene-border-content {
  background: repeating-linear-gradient(
    to right,
    var(--color-pure-black) 0,
    var(--color-pure-black) 12.5%,
    var(--color-blood-red-dark) 12.5%,
    var(--color-blood-red-dark) 25%
    /* ... */
  );
}
```

### Summary Section
```tsx
// src/components/Summary.tsx
export function Summary() {
  return (
    <div className="texture-subtle-stripes h-screen">
      <FuturisticCardContainer>
        <h1 className="text-gamma-contrast">NKL 2068</h1>
      </FuturisticCardContainer>
    </div>
  );
}
```

---

## Troubleshooting

### Colors not working?
1. Check if color is defined in `@theme` directive
2. Verify the naming: `--color-{name}` creates `bg-{name}` utility
3. Restart dev server after theme changes

### Pattern not showing?
1. Check layer order in CSS imports
2. Verify background color supports the pattern
3. Use `mixBlendMode` for overlay effects

### Tailwind class not generated?
1. Ensure color is in `@theme` not just `:root`
2. Check if class name matches the variable (remove `--color-` prefix)
3. Clear `.next` cache and rebuild

---

*Last updated: 2025-10-06*
