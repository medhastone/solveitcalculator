# SolveIt Calculator — Theme, Design System & Architecture Specification

> **CRITICAL MANDATE FOR ALL FUTURE IMPLEMENTATIONS:**  
> **DO NOT CHANGE, OVERWRITE, OR DRIFT AWAY FROM THE MAIN THEME, COLOR TOKENS, APP SHELL, HEADER, FOOTER, OR CORE ARCHITECTURAL PATTERNS.**  
> Any new features, calculators, converters, subpages, or components must strictly adhere to and reuse this design system and architecture.

---

## 1. Executive Summary & Brand Identity
- **Application Name:** SolveIt Calculator
- **Tagline:** Every Calculation. One Place. High-precision algorithms delivered through an Apple-inspired SaaS aesthetic.
- **Design Philosophy:** Clean, authoritative, clutter-free, high-precision engineering aesthetic. Zero-latency client-side calculations, high readability, seamless dark and light mode duality.

---

## 2. Color Palette & Design Tokens (Semantic CSS Variables)

The design system is defined in `/app/globals.css` with `@theme` bindings in Tailwind CSS v4.

### Dark Theme (Default)
| Token | Variable | Hex / Value | Semantic Role |
|---|---|---|---|
| Deep Space Canvas | `--color-surface` | `#0b1120` | Root background for entire viewport |
| Container Lowest | `--color-surface-container-lowest` | `#0f172a` | Header, cards, active popovers, modals |
| Container Low / Base | `--color-surface-container` | `#1e293b` | Calculator workbench, panel bodies, input boxes |
| Container High | `--color-surface-container-high` | `#334155` | Hover states, tab pills, secondary badges |
| Container Highest | `--color-surface-container-highest`| `#475569` | Distinctive chip borders, active tab fills |
| Text Primary | `--color-on-surface` | `#f8fafc` | Main readable text, headings, numbers |
| Text Secondary / Muted| `--color-on-surface-variant` | `#cbd5e1` | Subtitles, labels, formula descriptions |
| Brand Primary | `--color-primary` | `#38bdf8` | Sky Blue — Key buttons, active states, highlights |
| Contrast on Primary | `--color-on-primary` | `#0f172a` | Text on sky-blue action buttons |
| Secondary Accent | `--color-secondary` | `#2dd4bf` | Teal — Success states, secondary metrics, graphs |
| Tertiary Accent | `--color-tertiary` | `#fbbf24` | Warm Amber — Warnings, conversion factors, stars |
| Error Accent | `--color-error` | `#f87171` | Coral Red — Validation errors, negative cashflows |
| Outline / Borders | `--color-outline` | `#64748b` | Distinct borders for interactive inputs |
| Outline Subtle | `--color-outline-variant` | `#334155` | Subtle dividers, container borders |

### Light Theme (Crisp High-Contrast Daylight Mode)
| Token | Variable | Hex / Value | Semantic Role |
|---|---|---|---|
| Daylight Canvas | `--color-surface` | `#f1f5f9` | Clean daylight slate background |
| Container Lowest | `--color-surface-container-lowest` | `#ffffff` | Pure white cards, header backdrop, popups |
| Container Low / Base | `--color-surface-container` | `#e2e8f0` | Subtle contrast panels, inputs, workbench |
| Container High | `--color-surface-container-high` | `#cbd5e1` | Hover states, active borders |
| Container Highest | `--color-surface-container-highest`| `#94a3b8` | Muted chip backgrounds |
| Text Primary | `--color-on-surface` | `#0f172a` | Deep navy-slate high contrast typography |
| Text Secondary | `--color-on-surface-variant` | `#334155` | Slate secondary descriptive labels |
| Brand Primary | `--color-primary` | `#0284c7` | Deep sapphire blue primary accent |
| Contrast on Primary | `--color-on-primary` | `#ffffff` | Pure white text on primary buttons |
| Secondary Accent | `--color-secondary` | `#0d9488` | Deep Teal — Growth, positive delta |
| Tertiary Accent | `--color-tertiary` | `#d97706` | Amber — Highlights, rates, warnings |
| Error Accent | `--color-error` | `#dc2626` | Red — Form validation, deduction metrics |
| Outline / Borders | `--color-outline` | `#94a3b8` | Structured input boundaries |
| Outline Subtle | `--color-outline-variant` | `#cbd5e1` | Soft panel and section separators |

---

## 3. Theme Toggle & Anti-FOUC Implementation

### State Storage & Synchronization (`/lib/theme.ts`)
- Key: `'solveit_theme'` in `localStorage` ('light' | 'dark').
- Event Broadcast: `window.dispatchEvent(new CustomEvent('solveit-theme-change', { detail: theme }))`.
- Cross-tab sync: Listens to `'storage'` event.
- Instant Zero-Flash Script in `/app/layout.tsx`:
```javascript
(function() {
  try {
    var stored = localStorage.getItem('solveit_theme');
    var theme = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
```

---

## 4. Typography & Layout Geometry

### Font Hierarchy
1. **Body & Interface:** Apple-inspired system sans-serif:
   `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
2. **Numeric & Computational Data:** Monospace engine font:
   `font-data-mono` -> `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
   (Applied to currency numbers, conversion results, equations, and timestamp counters)
3. **Micro-Labels & Metric Tags:** `font-label-caps` (0.75rem, uppercase, tracking-wider, font-semibold).
4. **Section Headlines:** `font-headline-lg` (2.25rem / font-extrabold) and `font-headline-md` (1.5rem / font-bold).

### Canvas Sizing & Spacing
- **Max Width Container:** `.max-w-max-width-canvas` (1400px), auto-centered.
- **Responsive Gutters:**
  - Mobile: `.px-gutter-mobile` (1.25rem / 20px, scales to 2rem / 32px on sm).
  - Desktop: `.px-gutter-desktop` (2rem on md, 3rem on lg, 4rem on xl).
- **Sticky Pro Header:**
  - Height: 64px (`h-16`) on mobile, 80px (`h-20`) on desktop.
  - Backdrop: `bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/60`.
  - Elevation: Subtle shadow on scroll (`shadow-md shadow-black/10 dark:shadow-black/40`).

---

## 5. Core Architectural Components (`/components`)

1. **`AppShell.tsx`**
   - Universal application frame. Wraps every page with sticky `Header`, `GlobalQuickActionsBar`, main content slot, and `Footer`.
   - Global modal coordination: `SearchModal`, `GlobalHistoryDrawer`, and `SavedToolsModal`.
   - Global Keyboard listener: `Cmd+K` / `Ctrl+K` for instant tool search.

2. **`Header.tsx`**
   - Brand logo with gradient icon tile (`from-sky-500 via-blue-600 to-indigo-600`).
   - "Categories" mega-menu with grouped links and tool previews.
   - Global action triggers: Search, Bookmarks badge, History drawer, Live Grounding currency rates, and Theme Toggle button.
   - Fully responsive slide-down mobile menu.

3. **`GlobalQuickActionsBar.tsx`**
   - High-speed pill bar below the header providing single-click access to top tools (EMI, Unit Converter, Time & Date, Scientific, BMI, Payroll).

4. **`Footer.tsx`**
   - Multi-column categorized directory of tools, legal, privacy, terms, live clock, and platform specs.

5. **`SearchModal.tsx` (`Cmd+K`)**
   - Instant search across all 250+ calculators and converters with fuzzy matching, synonyms, and category indicators.

6. **`GlobalHistoryDrawer.tsx`**
   - Slide-over drawer storing calculations made by the user with one-click restore and copy.

7. **`SavedToolsModal.tsx`**
   - Pin and manage favorite calculators for rapid daily access.

---

## 6. Calculator Page Architectural Standards

When implementing or extending any calculator or converter:
1. **Zero-Latency Client-Side Computation:** Calculations must run reactively on state change with instant numerical feedback.
2. **Dual-Input Paradigm:** Provide synchronized slider + numeric input controls for continuous values.
3. **Structured Breakdown:** Display summary cards, amortization/delta tables, or visual breakdown meters using semantic tokens (`text-primary`, `text-secondary`, `text-tertiary`).
4. **Action Bar:** Include Quick Save (Bookmark), Copy Result, Print/Export, and Reset defaults.
5. **SEO & Educational Context:** Include formula breakdown, practical examples, FAQ schema, and related calculators list.

---

## 7. Permanent Rules for Future Implementations

1. **NEVER modify or delete the color tokens in `globals.css`.**
2. **NEVER change the header layout or brand styling (SolveIt Calculator sky-blue accent).**
3. **ALWAYS support both dark and light modes** by using semantic classes (`bg-surface`, `bg-surface-container`, `text-on-surface`, `border-outline-variant`).
4. **ALWAYS use Lucide icons (`lucide-react`)** or standard Material Symbols.
5. **MAINTAIN `AppShell` integration** across all subroutes and pages.
