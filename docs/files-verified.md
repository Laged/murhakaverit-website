# Files Verification & Atomic Design Refactor

## ✨ Features

### Parallax Scrolling
- ✅ Multi-layer background parallax on Hero section
- ✅ Logo moves slower (0.3x) - creates depth
- ✅ Background pattern moves at medium speed (0.5x)
- ✅ Crime scene tape moves slightly faster (1.2x)
- ✅ Performance optimized with requestAnimationFrame
- ✅ GPU-accelerated with `transform: translate3d()`

**Implementation:** `src/hooks/useParallax.ts` - Reusable parallax hook

---

## ✅ Verified Files (Following Documentation)

### Entry Points
- ✅ `src/app/layout.tsx` - Root layout with fonts, follows theme
- ✅ `src/app/page.tsx` - Landing page composition
- ✅ `src/app/globals.css` - Uses @theme directive correctly
- ✅ `src/app/themes/horror.css` - Theme colors with @theme

### Components - Current Structure

#### Landing Page (Hero Section)
- ✅ `src/components/hero/Hero.tsx` - Uses `bg-almost-black` utility
- ✅ `src/components/hero/AnimatedLogo.tsx` - Logo animation
- ✅ `src/components/hero/AnimatedLetter.tsx` - Letter animation (used by AnimatedLogo)
- ✅ `src/components/hero/CrimeScene.tsx` - Scrolling tape
- ✅ `src/components/hero/crime-scene.css` - Uses theme variables correctly
- ❌ `src/components/hero/PoisonBackground.tsx` - **UNUSED, DELETE**
- ❌ `src/components/hero/poison-background.css` - **UNUSED, DELETE**

#### Summary Section
- ✅ `src/components/Summary.tsx` - Uses texture class correctly
- ✅ `src/components/common/FuturisticCardContainer.tsx` - Reusable container
- ✅ `src/components/common/FuturisticButton.tsx` - Styled button

#### NKL Project Components
- ⚠️ `src/components/common/FuturisticCard.tsx` - **NEEDS REFACTOR: Hardcoded theme colors**
- ✅ `src/components/common/ScrollProgress.tsx` - Uses theme correctly
- ✅ `src/components/common/FontSizeContext.tsx` - No styling issues
- ✅ `src/components/common/FontSizeControls.tsx` - Uses theme correctly

### NKL-2068 App Structure
- ✅ `src/app/nkl-2068/layout.tsx` - Clean, uses FontSizeProvider
- ✅ `src/app/nkl-2068/page.tsx` - Uses FuturisticCard correctly
- ✅ `src/app/nkl-2068/notes/[...slug]/page.tsx` - Dynamic routing
- ✅ `src/app/nkl-2068/SiteHeader.tsx` - Server component
- ✅ `src/app/nkl-2068/SiteHeaderClient.tsx` - Client navigation
- ✅ `src/app/nkl-2068/FooterButtons.tsx` - Portal pattern
- ✅ `src/app/nkl-2068/FooterButtonsContext.tsx` - Context provider
- ✅ `src/app/nkl-2068/FooterButtonsRenderer.tsx` - Portal renderer
- ✅ `src/app/nkl-2068/lib/notes.ts` - Data loading logic
- ✅ `src/app/nkl-2068/lib/wiki-links.ts` - Wiki link transformer

---

## 🔄 Atomic Design Refactor Plan

### Atomic Design Levels

**Atoms** (Basic UI elements)
- Button
- Heading
- Paragraph
- Input
- Icon

**Molecules** (Simple component groups)
- Card
- NavItem
- FormField

**Organisms** (Complex UI sections)
- Header
- Footer
- Hero Section
- Content Section

**Templates** (Page layouts)
- LandingPageTemplate
- ContentPageTemplate

**Pages** (Specific instances)
- HomePage
- NKL2068Page

---

## 📦 Proposed Component Structure

```
src/components/
├── atoms/                  # Basic UI elements
│   ├── Button.tsx         # Base button (extracted from FuturisticButton)
│   ├── Heading.tsx        # Reusable heading with glow
│   ├── Paragraph.tsx      # Styled paragraph
│   └── Text.tsx           # Base text component
│
├── molecules/             # Simple combinations
│   ├── FuturisticButton.tsx    # Styled button (uses Button atom)
│   ├── GlowingHeading.tsx      # Heading with glow effect
│   ├── ContentCard.tsx         # Simple card
│   └── NavLink.tsx
│
├── organisms/             # Complex sections
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   ├── AnimatedLogo.tsx
│   │   ├── AnimatedLetter.tsx
│   │   └── CrimeScene.tsx
│   ├── Summary/
│   │   └── Summary.tsx
│   ├── FuturisticCard/
│   │   ├── FuturisticCard.tsx
│   │   └── FuturisticCardContainer.tsx
│   └── Navigation/
│       ├── SiteHeader.tsx
│       └── FooterButtons.tsx
│
└── templates/             # Page layouts
    ├── LandingPageTemplate.tsx
    └── ContentPageTemplate.tsx
```

---

## 🎯 Refactoring Tasks

### Phase 1: Create Atoms
- [ ] Create `atoms/Heading.tsx` - Extract heading styles from Summary
- [ ] Create `atoms/Paragraph.tsx` - Extract paragraph styles from Summary
- [ ] Create `atoms/Text.tsx` - Base text with font-body
- [ ] Create `atoms/Button.tsx` - Base button (no futuristic styling)

### Phase 2: Refactor Molecules
- [ ] Update `FuturisticButton` to use `Button` atom
- [ ] Create `GlowingHeading` molecule using `Heading` atom
- [ ] Simplify `FuturisticCardContainer`

### Phase 3: Refactor Organisms
- [ ] Move hero components to `organisms/Hero/`
- [ ] Move Summary to `organisms/Summary/`
- [ ] Refactor Summary to use atoms/molecules

### Phase 4: Cleanup
- [ ] Delete unused components (PoisonBackground, poison-background.css)
- [ ] Update imports across the project
- [ ] Verify all tests pass

---

## 🎨 Reusable Style Patterns

### Heading with Glow (Extract to Atom)
```tsx
// atoms/Heading.tsx
export function Heading({ level = 1, glow = false, children, className = '' }) {
  const Tag = `h${level}`;
  const glowStyle = glow ? {
    textShadow: `
      0 0 12px rgba(255,255,255,0.9),
      0 0 24px rgba(255,255,255,0.6),
      0 0 36px rgba(56,189,248,0.5),
      0 0 48px rgba(56,189,248,0.3)
    `,
    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.7))",
    animation: "simpleGlow 1s ease-in-out infinite alternate",
  } : {};

  return (
    <Tag
      className={`font-audiowide text-white ${className}`}
      style={glowStyle}
    >
      {children}
    </Tag>
  );
}
```

### Styled Paragraph (Extract to Atom)
```tsx
// atoms/Paragraph.tsx
export function Paragraph({ children, className = '' }) {
  return (
    <p
      className={`text-white/90 leading-relaxed text-sm sm:text-base font-body ${className}`}
    >
      {children}
    </p>
  );
}
```

### Summary Refactored (Using Atoms)
```tsx
// organisms/Summary/Summary.tsx
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { FuturisticButton } from '@/components/molecules/FuturisticButton';
import { FuturisticCardContainer } from '@/components/molecules/FuturisticCardContainer';

export function Summary() {
  return (
    <div className="w-screen flex items-center justify-center px-4 sm:px-8 texture-subtle-stripes" style={{ height: "98vh" }}>
      <div className="w-full h-full py-6 sm:py-8">
        <FuturisticCardContainer>
          <div className="h-full flex flex-col items-center justify-center p-8 sm:p-12">

            <Heading
              level={1}
              glow
              className="mb-8 leading-none text-center text-[clamp(3rem,12vw,8rem)] tracking-[0.15em]"
            >
              <div>NKL</div>
              <div>2068</div>
            </Heading>

            <div className="space-y-4 max-w-2xl mb-8 text-left">
              <Paragraph>
                <strong>
                  Ensimmäinen alkuperäinen Jubensha-pelimme on työn alla.
                  <br />
                  Ensimmäiset peli-illat järjestetään loppuvuodesta 2026.
                </strong>
              </Paragraph>

              <Paragraph>
                Jubensha tarjoaa pelaajilleen noin neljän tunnin murhamysteeri-illan...
              </Paragraph>

              <Paragraph>
                Tervetuloa vuoteen 2068, jossa Eurooppa on pelastettu teknokratiaksi...
              </Paragraph>
            </div>

            <FuturisticButton href="/nkl-2068" variant="primary">
              Lue lisää →
            </FuturisticButton>
          </div>
        </FuturisticCardContainer>
      </div>
    </div>
  );
}
```

---

## 🗑️ Files to Delete
- `src/components/hero/PoisonBackground.tsx` - Unused component
- `src/components/hero/poison-background.css` - Unused styles

## ⚠️ Issues Found in NKL-2068

### FuturisticCard.tsx - Theme Color Issue

**Problem:** Hardcoded theme colors instead of using CSS variables

```tsx
// ❌ CURRENT - Hardcoded colors
const themeColors = {
  blue: {
    primary: '#5ef2ff',
    glow: '#3b82f6',
    // ...
  },
  red: { /* ... */ },
  // ...
};
```

**Solution:** Use CSS variables from theme

```tsx
// ✅ PROPOSED - Use CSS variables
const themeColors = {
  blue: {
    primary: 'var(--color-gamma-accent)',
    glow: 'var(--color-gamma-glow)',
    gradientStart: 'var(--color-gamma-gradient-start)',
    gradientEnd: 'var(--color-gamma-gradient-end)',
  },
  // Define these in globals.css @theme
};
```

**Impact:**
- Character theme colors (red, orange, yellow, green, purple) work correctly
- BUT: Not using centralized theme system
- Inconsistent with landing page approach

**Priority:** Medium - Works fine, but should align with theme system eventually

---

## 📝 Recommended Next Steps

1. **Consider FuturisticCard refactor** - Move theme colors to CSS variables
2. **Add character theme colors to horror.css** - Centralize all theme definitions
3. **Test both landing page and NKL-2068** - Ensure consistency
4. **Document character themes** - Update THEME.md with current implementation
