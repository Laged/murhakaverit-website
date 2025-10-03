# Theme System Examples

## How to Add Themes to Your Obsidian Notes

This guide shows you exactly how to add theme colors to your markdown files in Obsidian.

---

## Example 1: Hahmo A (Red Theme)

**File:** `Hahmo A.md`

```markdown
---
AIKA: 2068-01-15T14:30
RAKENNUS: NKL Tower
KERROS: 12
SIJAINTI: Interrogation Room
THEME: red
---

# Hahmo A - Investigation Notes

This character uses the **Crimson Pulse** theme with hot pink-red accents.

## Background
Character A is investigating the incident that occurred on floor 12...

## Evidence Collected
- Item 1
- Item 2
- Item 3
```

**Result:** Card renders with red/pink gradient background and crimson glow effects.

---

## Example 2: Hahmo B (Orange Theme)

**File:** `Hahmo B.md`

```markdown
---
AIKA: 2068-01-15T16:00
RAKENNUS: Medical Wing
KERROS: 8
SIJAINTI: Lab 803
THEME: orange
---

# Hahmo B - Lab Analysis

This character uses the **Solar Flare** theme with warm orange accents.

## Analysis Results
The samples collected show unusual properties...
```

**Result:** Card renders with orange gradient background and amber glow effects.

---

## Example 3: Hahmo C (Yellow Theme)

**File:** `Hahmo C.md`

```markdown
---
AIKA: 2068-01-15T18:00
RAKENNUS: Security Center
KERROS: 1
SIJAINTI: Control Room
THEME: yellow
---

# Hahmo C - Security Logs

This character uses the **Electric Gold** theme with bright yellow accents.

## Access Records
All entry points were secured at...
```

**Result:** Card renders with golden yellow gradient and electric glow effects.

---

## Example 4: Hahmo D (Green Theme)

**File:** `Hahmo D.md`

```markdown
---
AIKA: 2068-01-15T20:00
RAKENNUS: Server Room
KERROS: -2
SIJAINTI: Data Center
THEME: green
---

# Hahmo D - Network Analysis

This character uses the **Neon Matrix** theme with bright green accents.

## System Status
All servers operational. Network traffic shows...
```

**Result:** Card renders with matrix green gradient and tech-inspired glow.

---

## Example 5: Hahmo E (Purple Theme)

**File:** `Hahmo E.md`

```markdown
---
AIKA: 2068-01-15T22:00
RAKENNUS: Penthouse
KERROS: 50
SIJAINTI: Private Suite
THEME: purple
---

# Hahmo E - Personal Journal

This character uses the **Void Plasma** theme with vibrant purple accents.

## Reflections
The events of today have been extraordinary...
```

**Result:** Card renders with void purple gradient and mystical plasma glow.

---

## Example 6: Default (Blue Theme)

**File:** `NKL 2068.md`

```markdown
---
AIKA: 2068-01-15T10:00
RAKENNUS: NKL Tower
KERROS: 0
SIJAINTI: Lobby
---

# NKL 2068 - Overview

This note uses the **default Cyber Ice** theme (no THEME specified).

## About
Welcome to the NKL Tower in 2068...
```

**Result:** Card renders with default blue/cyan gradient and ice glow effects.

---

## Quick Copy-Paste Templates

### Red (Hahmo A)
```markdown
---
THEME: red
---
```

### Orange (Hahmo B)
```markdown
---
THEME: orange
---
```

### Yellow (Hahmo C)
```markdown
---
THEME: yellow
---
```

### Green (Hahmo D)
```markdown
---
THEME: green
---
```

### Purple (Hahmo E)
```markdown
---
THEME: purple
---
```

### Blue (Default)
```markdown
---
# No THEME needed - blue is default
---
```

---

## Important Notes

1. **Case Insensitive:** `THEME: red` and `THEME: Red` and `THEME: RED` all work
2. **Metadata Hidden:** The `THEME:` line won't show in the rendered note
3. **Fallback:** Invalid theme names default to blue
4. **Combine with Other Metadata:** You can use THEME with AIKA, RAKENNUS, etc.

---

## Testing Your Themes

After adding `THEME:` to your Obsidian notes:

1. Run `nix develop --command bun run sync-content` to copy notes
2. Start dev server: `nix develop --command bun run dev`
3. Navigate to your note
4. Verify the card background color matches your theme

---

## Character Theme Assignment

| Character | Theme | Color |
|-----------|-------|-------|
| Hahmo A   | red   | Crimson/Pink |
| Hahmo B   | orange | Solar/Amber |
| Hahmo C   | yellow | Gold/Electric |
| Hahmo D   | green | Matrix/Emerald |
| Hahmo E   | purple | Void/Plasma |
| Default   | blue  | Cyber/Ice |
