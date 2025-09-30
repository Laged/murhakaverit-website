# Murhakaverit Website Architecture

## 📁 Project Structure

```
murhakaverit-website/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Root layout with fonts & providers
│   │   ├── page.tsx            # Homepage (landing note)
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Global styles
│   │   ├── layers.css          # Futuristic card layer styles
│   │   └── notes/
│   │       └── [...slug]/
│   │           └── page.tsx    # Dynamic note pages
│   ├── components/             # React components
│   │   ├── FuturisticCard.tsx      # Main card component (339 lines)
│   │   ├── footer-buttons.tsx      # Navigation footer with portal
│   │   ├── futuristic-button.tsx   # Styled button component
│   │   ├── site-header.tsx         # Server component header
│   │   ├── site-header-client.tsx  # Client nav component
│   │   ├── FontSizeContext.tsx     # Font size state management
│   │   └── FontSizeControls.tsx    # Font size +/- buttons
│   └── lib/                    # Core business logic
│       ├── notes.ts            # Note reading & parsing (303 lines)
│       └── wiki-links.ts       # Wiki link transformer (62 lines)
├── content/                    # Markdown notes (synced from Obsidian)
│   ├── 1.0) NKL 2068.md
│   ├── 1.1) Suomi 2068.md
│   ├── 1.2) Hahmo A.md
│   └── ... (7 files total, 60KB)
├── scripts/
│   └── sync-content.mjs        # Sync script from Obsidian vault
├── tests/
│   └── notes.spec.ts           # Playwright e2e tests (9 scenarios)
├── public/                     # Static assets (empty)
├── out/                        # Static build output (generated)
├── next.config.ts              # Next.js config (static export)
├── playwright.config.ts        # Test configuration
├── flake.nix                   # Nix dev environment
├── package.json                # Dependencies & scripts
└── TODO.md                     # Project documentation

Total source code: ~1,079 lines (excluding tests)
```

## 🏗️ Architecture Overview

### **Type: Static Site Generator (SSG)**
- **Build Time:** All pages pre-rendered as HTML
- **Runtime:** Pure client-side (no server needed)
- **Deployment:** Any static host (Vercel, Cloudflare Pages, etc.)

### **Core Technologies**
- **Framework:** Next.js 15.5.4 with App Router + Turbopack
- **React:** 19.1.0 (latest)
- **Rendering:** Static Site Generation (SSG) with `output: 'export'`
- **Styling:** Tailwind CSS 4 + custom CSS layers
- **Markdown:** react-markdown + remark-gfm (GitHub Flavored Markdown)
- **State:** React Context API (FontSizeContext)
- **Testing:** Playwright 1.55.1
- **Runtime:** Bun 1.1+ or Node 20.17+

---

## 🔄 Data Flow

### 1. Content Pipeline
```
Obsidian Vault → sync-content.mjs → content/ → notes.ts → React Components → Static HTML
```

**Step-by-step:**
1. User writes markdown in Obsidian vault at `~/Jubensha/Pelit/NKL2068/1) Taustavaihe/`
2. Run `bun run sync-content` to copy `.md` files to `content/` (excludes files with `.9`)
3. Build time: `notes.ts` reads all markdown files
4. Parses frontmatter YAML and extracts metadata
5. Generates slug from filename (e.g., "1.0) NKL 2068.md" → `/notes/1/0/nkl-2068`)
6. `wiki-links.ts` transforms `[[Note Name]]` → `[Note Name](/notes/slug)`
7. Components render markdown to HTML
8. Next.js exports static HTML to `out/`

### 2. Routing Architecture
```
/                              → page.tsx (shows landing note "1.0) NKL 2068")
/notes/1/0/nkl-2068           → [...slug]/page.tsx
/notes/1/1/suomi-2068         → [...slug]/page.tsx
/notes/1/2/hahmo-a            → [...slug]/page.tsx
... (7 total note routes)
```

**Dynamic Routing:**
- `[...slug]` catch-all route handles all note URLs
- `generateStaticParams()` pre-generates all routes at build time
- `generateMetadata()` creates SEO meta tags for each note

### 3. Component Hierarchy
```
RootLayout (app/layout.tsx)
├── FontSizeProvider (Context)
├── Main Content Area
│   ├── HomePage or NotePage
│   │   └── FuturisticCard
│   │       └── ReactMarkdown (renders note content)
│   └── FooterButtons (via portal to #footer-slot)
│       ├── Previous Button
│       ├── FontSizeControls
│       └── Next Button
└── Footer Container
    ├── SiteHeader
    │   └── SiteHeaderClient
    │       ├── Navigation (Alku, Suomi 2068)
    │       └── Character Links (Hahmo A-E)
    └── #footer-slot (portal target)
```

---

## 📦 Key Components Explained

### **1. FuturisticCard.tsx** (339 lines)
The star of the show - the main content card with futuristic styling.

**Features:**
- Layered visual design (border → gradient → texture → content)
- Custom scroll hijacking (wheel + keyboard events)
- Scroll progress indicator on right side
- Metadata display (time, building, floor, location)
- Responsive design with resize observer

**State:**
- `scrollProgress` - 0 to 1, drives progress bar height
- `isAtBottom` - boolean, adds visual indicator when scrolled to bottom

**Props:**
```typescript
{
  title: string;           // Note title
  metadata?: Record<string, string>;  // YAML frontmatter
  children: React.ReactNode;  // Markdown content
  className?: string;
}
```

### **2. notes.ts** (303 lines)
Core library for reading and processing markdown files.

**Key Functions:**

```typescript
// Get all note summaries (cached)
getNoteSummaries(): Promise<NoteSummary[]>

// Get full note by slug
getNoteBySlug(slug: string | string[]): Promise<Note | undefined>
```

**Processing Pipeline:**
1. `collectNotes()` - Reads `content/` directory
2. `extractFrontMatter()` - Parses YAML metadata
3. `explodeSegment()` - Creates URL slugs from numbered filenames
4. `stripNumberedPrefix()` - Cleans titles (e.g., "1.0) Title" → "Title")
5. `ensureUniqueSlug()` - Handles duplicate slugs
6. `extractTitle()` - Pulls `# Heading` from markdown
7. `extractDescription()` - First paragraph for SEO

**Special Logic:**
- Filters out notes with slugSegments `[1, 9]` (excluded content)
- Sorts by filename alphabetically
- Uses `React.cache()` for deduplication

### **3. wiki-links.ts** (62 lines)
Transforms Obsidian-style wiki links to Next.js links.

**Pattern:** `[[Note Name|Optional Alias]]` → `[Optional Alias](/notes/slug)`

**Resolution Strategy:**
1. Try exact slug match
2. Try last segment match (e.g., "nkl-2068")
3. Try case-insensitive title match
4. If no match: render as bold text `**Note Name**`

**Example:**
```markdown
[[Suomi 2068]]          → [Suomi 2068](/notes/1/1/suomi-2068)
[[Hahmo A|Character A]] → [Character A](/notes/1/2/hahmo-a)
[[Unknown]]             → **Unknown**
```

### **4. FontSizeContext.tsx** (63 lines)
React Context for global font size management.

**Features:**
- localStorage persistence
- Range: 0.8x (12.8px) to 1.4x (22.4px)
- Default: 1.0x (16px)
- Increments: 0.1x per button click

**Usage:**
```typescript
const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();
```

### **5. Footer Portal Pattern**
Clever React portal architecture to inject footer into layout.

**Why?** Pages are async Server Components, but footer needs client-side navigation.

**Flow:**
1. `layout.tsx` defines `<div id="footer-slot"></div>` in footer
2. `footer-buttons.tsx` uses `createPortal(content, footer-slot)`
3. Content "teleports" from page to footer slot
4. Allows async pages with client interactivity

---

## 🎨 Styling Architecture

### **CSS Organization**
1. **globals.css** - Tailwind directives, CSS variables, font setup
2. **layers.css** - Futuristic card layer styles (`.futuristic-card`)
3. **Tailwind classes** - Utility-first styling in components

### **Design System**
- **Fonts:**
  - Body: Work Sans (300-700 weights)
  - Headings: Audiowide (400)
  - Mono: Geist Mono
- **Colors:** CSS variables for theming
- **Layout:** Flexbox + CSS Grid
- **Responsive:** Mobile-first with `sm:` breakpoints

---

## 🔧 Build Process

### **Development**
```bash
nix develop --command bun run dev
# Turbopack dev server on http://localhost:3000
# Hot reload, instant updates
```

### **Production Build**
```bash
nix develop --command bun run build

# Output:
# - .next/        (Next.js build artifacts)
# - out/          (Static HTML export)
#   ├── index.html
#   ├── 404.html
#   ├── notes/
#   │   └── 1/
#   │       ├── 0/nkl-2068.html
#   │       ├── 1/suomi-2068.html
#   │       └── ... (7 notes total)
#   └── _next/      (JS chunks, CSS)
```

### **Bundle Analysis**
```
Route (app)                   Size     First Load JS
┌ ○ /                         0 B      121 kB
├ ○ /_not-found               0 B      118 kB
└ ● /notes/[...slug]          0 B      121 kB
    ├ /notes/1/0/nkl-2068
    ├ /notes/1/1/suomi-2068
    └ [+5 more paths]
+ First Load JS shared        128 kB
  ├ chunks/753e53d64114daaf.js  59.2 kB
  ├ chunks/990de68478e0fcfd.js  17.2 kB
  ├ chunks/ee9593cd91662ea6.js  24.1 kB
  └ other shared chunks         27.5 kB
```

**Optimization:**
- Shared chunks reduce per-page load
- Code splitting at component level
- Turbopack for fast builds

---

## 🧪 Testing Strategy

### **Playwright Tests (tests/notes.spec.ts)**
9 comprehensive e2e scenarios:

1. ✅ Homepage renders landing note
2. ✅ Note page renders correctly
3. ✅ Note content is present and substantial
4. ✅ Navigation between notes works
5. ✅ Wiki links are clickable and functional
6. ✅ Metadata displays correctly
7. ✅ Scroll indicator is present
8. ✅ 404 page works for non-existent notes
9. ✅ All 7 content files are accessible

**Run tests:**
```bash
# Install browser dependencies first (requires root/system access)
playwright install-deps

# Run tests
bun run test           # Headless
bun run test:ui        # Interactive UI mode
bun run test:headed    # Headed browser mode
```

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
vercel deploy
# Auto-detects Next.js, uses static export
# Deploys to global CDN
# Zero configuration needed
```

### **Other Static Hosts**
```bash
# Build first
nix develop --command bun run build

# Upload contents of ./out/ to:
# - Cloudflare Pages
# - GitHub Pages (set base path if needed)
# - Netlify
# - AWS S3 + CloudFront
# - Any static file host
```

### **Local Preview**
```bash
cd out && python -m http.server 8080
# Open http://localhost:8080
```

---

## 🔍 Important Implementation Details

### **1. Numbered Prefix Handling**
Files like "1.0) NKL 2068.md" get special treatment:

**Filename:** `1.0) NKL 2068.md`
- **Slug:** `/notes/1/0/nkl-2068` (split on dots/dashes)
- **Title:** "NKL 2068" (prefix stripped)
- **slugSegments:** `["1", "0", "nkl-2068"]`

**Filename:** `1.2) Hahmo A.md`
- **Slug:** `/notes/1/2/hahmo-a`
- **Title:** "Hahmo A"
- **slugSegments:** `["1", "2", "hahmo-a"]`

### **2. Metadata Extraction**
Two sources merged:

**YAML Frontmatter:**
```yaml
---
aika: "2068-03-15T14:30:00"
rakennus: "Keskustorni"
kerros: "42"
sijainti: "Toimisto"
---
```

**Inline Bold Fields (legacy):**
```markdown
**Aika: 2068-03-15T14:30:00**
**Rakennus: Keskustorni**
```

Both get normalized to uppercase keys: `AIKA`, `RAKENNUS`, `KERROS`, `SIJAINTI`

### **3. Landing Note Selection**
Homepage shows first note with `slugSegments[0] === "1" && slugSegments[1] === "0"`
Falls back to first note if not found.

### **4. Character Note Detection**
Header dynamically finds character notes by regex: `/^hahmo\s/i`
Strips "Hahmo " prefix for display (e.g., "Hahmo A" → "A")

---

## ⚙️ Configuration Files

### **next.config.ts**
```typescript
{
  output: "export",  // Static HTML export
  experimental: {
    optimizePackageImports: ["react", "react-dom"]
  }
}
```

### **tsconfig.json**
- Path alias: `@/*` → `./src/*`
- Strict TypeScript enabled
- Target: ES2017

### **flake.nix**
Nix development environment:
- Node.js 20
- Bun 1.1+
- Adds `node_modules/.bin` to PATH

---

## 📊 Performance Characteristics

### **Build Time**
- ~2 seconds for clean build (Turbopack)
- Incremental builds: <500ms

### **Page Load (Static)**
- Initial HTML: <50 KB
- First Load JS: 121 KB (gzipped ~35 KB)
- Time to Interactive: <1s on good connection

### **Scroll Performance**
- Custom scroll hijacking maintains 60fps
- ResizeObserver for responsive recalculation

---

## 🔒 Security Notes

### **Attack Surface: Minimal**
✅ No server-side code execution
✅ No database
✅ No user authentication
✅ No API endpoints
✅ Static files only

### **Potential Concerns:**
⚠️ Markdown content is trusted (from Obsidian vault)
⚠️ No XSS sanitization (react-markdown handles it)
⚠️ localStorage for font size (no sensitive data)

---

## 🐛 Known Limitations

1. **Playwright tests require system deps** - Can't run in pure Nix shell without host libraries
2. **Zustand dependency unused** - Still in package.json but not imported anywhere
3. **No image support** - Markdown images would need to be in `public/`
4. **No search functionality** - All navigation is manual/linear
5. **Finnish-only** - UI strings are hardcoded in Finnish

---

## 🎯 Future Optimization Opportunities

See "Additional Optimization Ideas" section below for details.