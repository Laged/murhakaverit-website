# Theme System Documentation

## Overview

The Murhakaverit website uses a futuristic, cyberpunk-inspired design with support for dynamic theming based on page content. Each note can specify its own theme color through markdown frontmatter metadata.

## Color Palette

### Default Theme (Blue - Cyber Ice)
**Usage:** Default for all pages without theme metadata

```css
--theme-primary: #5ef2ff      /* Cyan accent */
--theme-secondary: #38bdf8    /* Sky blue */
--theme-glow: #3b82f6         /* Blue glow */
--theme-gradient-start: rgba(56,189,248,0.45)
--theme-gradient-end: rgba(147,197,253,0.35)
```

**Visual:** Ice blue, cyan holographic accents, cool metallic feel

---

### Character Themes (Rainbow Spectrum)

#### Hahmo A - Red (Crimson Pulse)
```css
--theme-primary: #ff5f8f       /* Hot pink-red */
--theme-secondary: #f87171     /* Soft red */
--theme-glow: #dc2626          /* Deep red glow */
--theme-gradient-start: rgba(248,113,113,0.45)
--theme-gradient-end: rgba(252,165,165,0.35)
```

**Visual:** Pulsing crimson, neon pink accents, passionate energy

#### Hahmo B - Orange (Solar Flare)
```css
--theme-primary: #ffb85c       /* Bright orange */
--theme-secondary: #fb923c     /* Warm orange */
--theme-glow: #ea580c          /* Deep orange glow */
--theme-gradient-start: rgba(251,146,60,0.45)
--theme-gradient-end: rgba(253,186,116,0.35)
```

**Visual:** Solar warmth, amber accents, energetic glow

#### Hahmo C - Yellow (Electric Gold)
```css
--theme-primary: #ffd36b       /* Golden yellow */
--theme-secondary: #fbbf24     /* Amber */
--theme-glow: #d97706          /* Deep gold glow */
--theme-gradient-start: rgba(251,191,36,0.45)
--theme-gradient-end: rgba(253,224,71,0.35)
```

**Visual:** Electric gold, lightning accents, bright energy

#### Hahmo D - Green (Neon Matrix)
```css
--theme-primary: #54e38f       /* Bright green */
--theme-secondary: #34d399     /* Emerald */
--theme-glow: #059669          /* Deep green glow */
--theme-gradient-start: rgba(52,211,153,0.45)
--theme-gradient-end: rgba(110,231,183,0.35)
```

**Visual:** Matrix green, terminal accents, tech vibes

#### Hahmo E - Purple (Void Plasma)
```css
--theme-primary: #8d6bff       /* Vibrant purple */
--theme-secondary: #a78bfa     /* Soft purple */
--theme-glow: #7c3aed          /* Deep purple glow */
--theme-gradient-start: rgba(167,139,250,0.45)
--theme-gradient-end: rgba(196,181,253,0.35)
```

**Visual:** Void purple, plasma accents, mystical energy

---

## Metadata Configuration

### Obsidian Frontmatter Format

Add theme metadata to your markdown files in Obsidian using YAML frontmatter:

```markdown
---
AIKA: 2068-01-15T10:00
RAKENNUS: NKL Tower
KERROS: 5
SIJAINTI: Office 501
THEME: red
---

# Your Content Here

This note will render with the red (Crimson Pulse) theme.
```

### Supported THEME Values

| Value    | Theme Name      | Character |
|----------|-----------------|-----------|
| `blue`   | Cyber Ice (default) | -     |
| `red`    | Crimson Pulse   | Hahmo A   |
| `orange` | Solar Flare     | Hahmo B   |
| `yellow` | Electric Gold   | Hahmo C   |
| `green`  | Neon Matrix     | Hahmo D   |
| `purple` | Void Plasma     | Hahmo E   |

### Example: Character-Specific Notes

```markdown
---
AIKA: 2068-01-15T14:30
RAKENNUS: NKL Tower
KERROS: 12
SIJAINTI: Interrogation Room
THEME: red
---

# Hahmo A - Interrogation Notes

Character A's perspective with crimson theme...
```

---

## Technical Implementation

### CSS Variables (globals.css)

The theme system uses CSS custom properties that can be overridden per-component:

```css
:root {
  /* Default Blue Theme */
  --gamma-surface: #0d0f14;
  --gamma-ambient: #131a26;
  --gamma-contrast: #f5f7ff;
  --gamma-accent: #5ef2ff;     /* Primary theme color */
  --gamma-grid: rgba(124, 162, 210, 0.16);
  --gamma-glow: rgba(122, 245, 214, 0.65);

  /* Theme variables (can be overridden) */
  --theme-primary: var(--gamma-accent);
  --theme-glow: #3b82f6;
  --theme-gradient-start: rgba(56,189,248,0.45);
  --theme-gradient-end: rgba(147,197,253,0.35);
}
```

### Component Integration (FuturisticCard.tsx)

The `FuturisticCard` component reads the `THEME` metadata and applies dynamic colors:

```tsx
const themeColor = metadata?.THEME ?? metadata?.theme ?? 'blue';

const themeColors = {
  blue: {
    primary: '#5ef2ff',
    glow: '#3b82f6',
    gradientStart: 'rgba(56,189,248,0.45)',
    gradientEnd: 'rgba(147,197,253,0.35)'
  },
  red: {
    primary: '#ff5f8f',
    glow: '#dc2626',
    gradientStart: 'rgba(248,113,113,0.45)',
    gradientEnd: 'rgba(252,165,165,0.35)'
  },
  // ... other colors
};

const theme = themeColors[themeColor] || themeColors.blue;
```

### What Gets Themed

1. **Card Background Gradients** - Radial gradients in card background
2. **Border Glow Effects** - Pulsing border animation colors
3. **Scroll Indicators** - "At bottom" state glow color
4. **Corner Accents** - L-shaped accent glow colors
5. **Text Shadows** - Title and header glow effects

### What Stays Consistent

- **Base colors:** Surface, ambient, contrast (grays/whites)
- **Layout:** Grid pattern, corner cuts, spacing
- **Typography:** Font families, sizes, weights
- **Animations:** Timing, easing functions

---

## Usage Examples

### Example 1: Default Blue Theme

```markdown
---
AIKA: 2068-01-15T10:00
---

# NKL 2068 Overview

This uses the default blue theme (no THEME specified).
```

### Example 2: Character-Specific Theme

```markdown
---
AIKA: 2068-01-15T14:30
THEME: purple
---

# Hahmo E - Private Notes

This renders with void purple theme.
```

### Example 3: Location-Based Theming

```markdown
---
AIKA: 2068-01-15T16:00
RAKENNUS: Medical Wing
THEME: green
---

# Medical Records

Green matrix theme for tech/medical content.
```

---

## Design Principles

### Futuristic Aesthetic
- **Neon accents:** Bright, saturated colors for holographic feel
- **Dark base:** Deep blacks and dark grays for contrast
- **Glowing effects:** Pulsing animations, drop shadows, text glows
- **Geometric precision:** Sharp corners, notched edges, L-shaped accents

### Color Psychology
- **Red:** Urgency, passion, danger
- **Orange:** Energy, warmth, action
- **Yellow:** Alert, bright, electric
- **Green:** Tech, nature, matrix
- **Blue:** Cool, calm, default
- **Purple:** Mystery, void, magic

### Accessibility
- **High contrast:** All themes maintain WCAG AA contrast ratios
- **Reduced motion:** Animations disabled via `prefers-reduced-motion`
- **Color independence:** Information never conveyed by color alone

---

## Future Extensions

### Planned Features
- [ ] Gradient themes (combining multiple colors)
- [ ] Time-based theme transitions
- [ ] User preference override (dark/light mode toggle)
- [ ] Custom theme definitions via JSON

### Potential Themes
- **Teal (Oceanic):** Underwater, deep sea vibes
- **Pink (Neon Dreams):** Cyberpunk, vaporwave aesthetic
- **White (Ghost Mode):** Inverted, light-on-dark reversed

---

## Testing Checklist

When adding new theme colors:

- [ ] Define all CSS variables (primary, secondary, glow, gradients)
- [ ] Test on FuturisticCard component
- [ ] Verify scroll indicator "at bottom" state
- [ ] Check border glow animation
- [ ] Test corner accent colors
- [ ] Validate contrast ratios (WCAG AA)
- [ ] Test with `prefers-reduced-motion`
- [ ] Update this documentation
- [ ] Add example markdown file

---

## Quick Reference

### Adding a New Theme Color

1. **Define colors in component:**
   ```tsx
   const themeColors = {
     newcolor: {
       primary: '#hexcode',
       glow: '#hexcode',
       gradientStart: 'rgba(...)',
       gradientEnd: 'rgba(...)'
     }
   };
   ```

2. **Use in Obsidian:**
   ```markdown
   ---
   THEME: newcolor
   ---
   ```

3. **Test the page** - Verify all visual elements update correctly

