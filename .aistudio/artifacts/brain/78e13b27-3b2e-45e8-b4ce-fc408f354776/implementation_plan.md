# Science Calculators & Interactive Multi-Discipline Science Workbench Hub (`/science`)

A comprehensive, research-grade scientific computation hub featuring an interactive Multi-Discipline Science Workbench, real-time kinematics and projectile solvers, thermodynamics and Ideal Gas Law calculators, interactive periodic table molar mass lookup, orbital velocity and celestial gravity engines, quantum photon wave mechanics, and 50+ specialized scientific tools across 7 core disciplines.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product design and architectural choices have been confirmed for the Science Hub (`/science`):

- **Confirmed Scope**: Comprehensive scientific suite covering Classical Mechanics & Physics, Chemistry & Stoichiometry, Thermodynamics & Fluid Dynamics, Astronomy & Space Physics, Quantum & Nuclear Physics, Electromagnetism & Optics, and Biology & Environmental Science (7 domains, 50+ specialized tools).
- **Confirmed Primary Workbench**: Live Multi-Discipline Science Workbench positioned at the top of `/science` with 5 interactive solver modes:
  1. **Kinematics & 2D Projectile Solver**: Real-time initial velocity, launch angle, launch height, gravitational acceleration ($g$), trajectory range, apex height, flight time, and impact velocity.
  2. **Thermodynamics & Ideal Gas Law ($PV = nRT$) Engine**: Bi-directional calculation solving for Pressure ($P$), Volume ($V$), Amount of Substance ($n$), or Temperature ($T$) using universal gas constant ($R = 8.314462\text{ J/(mol}\cdot\text{K)}$).
  3. **Interactive Periodic Table & Molar Mass Quick Solver**: Quick search/selection across standard elements (H through Og) with atomic weights, group/period classifications, valence electrons, and multi-element chemical formula molar mass calculator (e.g. $\text{H}_2\text{SO}_4$, $\text{C}_6\text{H}_{12}\text{O}_6$).
  4. **Astronomy, Orbital Velocity & Escape Velocity Solver**: Celestial body presets (Earth, Moon, Mars, Jupiter, Sun, ISS LEO, Geostationary) with orbital altitude, gravitational parameter ($GM$), circular orbital speed, orbital period, and escape velocity.
  5. **Quantum Photon Energy & Electromagnetic Spectrum Solver**: Convert between wavelength ($\lambda$), frequency ($f$), photon energy ($E = h\nu$ in Joules and eV), with spectral band mapping (Radio, Microwave, IR, Visible, UV, X-Ray, Gamma).
- **Confirmed Auxiliary Reference Tables & Scientific Standards**:
  - **CODATA Fundamental Physical Constants Table**: Speed of light ($c$), Gravitational constant ($G$), Planck constant ($h, \hbar$), Boltzmann constant ($k_B$), Avogadro constant ($N_A$), Elementary charge ($e$), Electron mass ($m_e$), Permittivity ($\varepsilon_0$).
  - **Electromagnetic Spectrum & Wavelength Reference Chart**: Frequency bands, photon energies, atmospheric transmission, and representative applications.
  - **Standard SI Metric Prefixes Scale**: Comprehensive decade scale from quecto ($10^{-30}$) and atto ($10^{-18}$) to exa ($10^{18}$) and quetta ($10^{30}$).
  - **6 Curated Academic & Laboratory Workbenches**: Physics Students & Researchers, Analytical Chemists & Lab Techs, Aerospace Engineers & Astronomers, Mechanical & Materials Engineers, Biophysics & Genomics Specialists, and Environmental Scientists.
  - **15 In-Depth Scientific FAQs** with complete Schema.org `FAQPage` structured data.
- **Theme & Aesthetic Standards**: Clinical lab precision standard from `references/8_science_space_biotech.md`, hairline borders, laser cyan and cobalt telemetry accents, and strict `font-mono tabular-nums` for scientific notation and significant figures.

---

## 1. Overview & Core Concept

- **What It Does**: `/science` serves as an empirical computation and reference workbench for scientists, engineering students, educators, and laboratory researchers. It enables instant physical modeling, stoichiometry validation, orbital flight planning, and unit-calibrated scientific problem-solving.
- **Target Audience / Persona**:
  - **Physics & Mechanics Students**: Solving kinematics, harmonic motion, conservation of momentum, and rotational dynamics.
  - **Chemistry & Laboratory Researchers**: Formulating molar solutions, calculating buffer pH, balancing gas laws, and finding molecular weights.
  - **Aerospace & Astronomy Enthusiasts**: Calculating orbital velocities, Keplerian periods, and gravitational escape thresholds.
  - **Quantum & Photonics Engineers**: Computing laser wavelengths, photon energy flux, and de Broglie wavelengths.
- **Key Value**: Provides zero-latency scientific calculations with explicit formula derivations, standard SI units, and verified empirical constants (NIST/CODATA).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive Workbench Exploration**:
   - User accesses the top workbench and chooses between **Kinematics**, **Ideal Gas Law**, **Periodic Table**, **Orbital Velocity**, and **Photon Energy**.
   - Scrubbing sliders or entering numeric values recalculates parameters in real time ($<1\text{ms}$).
   - Step-by-step mathematical breakdowns show standard physical formulas with substituted values.
   - 1-click clipboard copy for results, scientific notation values, and derived equations.
2. **Directory Search & Scientific Discipline Filtering**:
   - Real-time search across 50+ scientific calculators matching tool names, descriptions, and formulas.
   - Domain filter pills (*All, Physics, Chemistry, Thermodynamics, Astronomy, Quantum, Electromagnetism, Biology*).
3. **Reference Matrix & Constants Exploration**:
   - CODATA Physical Constants table with search and quick copy.
   - Interactive Electromagnetic Spectrum breakdown.
   - SI Prefix conversion ruler.
4. **Role Collections & FAQs**:
   - 6 specialized academic and industry tool bundles.
   - 15 accordion-expandable FAQs covering classical mechanics, quantum theory, and chemistry formulas.

### Visual Identity & Theme (Scientific Instrument Constitution)
- **Aesthetic Direction**: High-precision laboratory console adhering to `references/8_science_space_biotech.md`.
- **Color Palette**:
  - Light: Clinical white background (`bg-slate-50`), pristine instrument panels (`bg-white`), hairline dividers (`border-slate-200`), dark slate typography (`text-slate-900`), and laser cyan/cobalt accents (`text-cyan-600`, `text-blue-600`).
  - Dark: Deep space obsidian canvas (`dark:bg-slate-950`), elevated instrument cards (`dark:bg-slate-900`), subtle border dividers (`dark:border-slate-800`), luminous phosphor indicators (`dark:text-cyan-400`, `dark:text-emerald-400`).
- **Typography & Numerals**:
  - Crisp neo-grotesque hierarchy.
  - Monospace tabular numbers (`font-mono tabular-nums`) for all values, coordinates, powers of ten, and physical units ($\text{m/s}^2$, $\text{J/(mol}\cdot\text{K)}$, $\text{eV}$, $\text{kg/m}^3$).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Deterministic Mathematical Engine**:
  - *Chosen Approach*: Pure TypeScript scientific solver algorithms calibrated against NIST CODATA constants.
  - *Why*: Delivers instantaneous interactive slider feedback without server roundtrips.
- **Decision 2: Comprehensive 7-Domain Taxonomy**:
  - *Chosen Approach*: Organize 50+ specialized scientific calculators across physics, chemistry, thermodynamics, astronomy, quantum mechanics, electromagnetism, and biophysics.
  - *Why*: Provides complete curriculum and laboratory coverage from high school AP Physics/Chemistry to university and professional engineering levels.
- **Decision 3: Complete Schema.org JSON-LD Graph**:
  - *Chosen Approach*: Embed structured data for `CollectionPage`, `BreadcrumbList`, `ItemList` (all 50+ tools), and `FAQPage` (15 FAQs).
  - *Why*: Ensures maximum search engine visibility and rich snippet eligibility.

---

## 4. Technical Architecture & System Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                         /app/science/page.tsx                          │
│   (Server Component: Metadata, OpenGraph, Canonical, Schema.org Graph) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    ScienceHubClient.tsx (Client Hub)                   │
│  - Hero Header & Scientific Metrics                                    │
│  - Directory Search & Discipline Filter Pills                          │
│  - CODATA Physical Constants Reference Table                           │
│  - Electromagnetic Spectrum & SI Metric Prefix Scale                   │
│  - 6 Curated Academic & Laboratory Workbenches                         │
│  - 15 Comprehensive FAQs with Accordion State                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│          InteractiveScienceWorkbench.tsx (Interactive Engine)          │
│  ┌─────────────────────────┬─────────────────────────┬──────────────┐  │
│  │ 1. Kinematics & 2D Mot. │ 2. Ideal Gas (PV=nRT)   │ 3. Chemistry │  │
│  ├─────────────────────────┼─────────────────────────┼──────────────┤  │
│  │ 4. Orbital Mechanics    │ 5. Quantum Photon Wave  │ Quick Copy   │  │
│  └─────────────────────────┴─────────────────────────┴──────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                  scienceCategoryData.ts (Data Store)                   │
│  - 7 Scientific Domains & 50+ Precision Tools                          │
│  - Periodic Table Element Dataset (H to Og with atomic weights)        │
│  - CODATA Fundamental Physical Constants                               │
│  - Electromagnetic Spectrum Wavelength Bands                           │
│  - 6 Role-Based Collections & 15 In-Depth Scientific FAQs              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

1. **`scienceCategoryData.ts`**:
   - 7 Category definitions with icons, descriptions, and 50+ tools with real routing paths.
   - Comprehensive Periodic Table element database with molar weights.
   - CODATA physical constants table with symbols, values, and SI units.
   - Electromagnetic spectrum wavelength data and SI metric prefix scales.
   - 6 Academic and laboratory workbench configurations.
   - 15 Detailed FAQs covering physics, chemistry, thermodynamics, astronomy, and quantum mechanics.
2. **`InteractiveScienceWorkbench.tsx`**:
   - 5 solver modes with fine-tuned sliders, preset selectors, step-by-step formula derivations, and copy-to-clipboard.
   - Tabular figures (`font-mono tabular-nums`), responsive Light/Dark theme support.
3. **`ScienceHubClient.tsx`**:
   - Hero header with breadcrumb navigation.
   - Integrated live workbench.
   - Instant search and category filter.
   - Directory grid with 50+ tool cards.
   - CODATA physical constants table, EM spectrum guide, and SI prefix chart.
   - Role-based collections and FAQ accordion.
4. **`page.tsx`**:
   - Server Component with metadata, OpenGraph, Twitter card, canonical URL, and Schema.org JSON-LD (`CollectionPage`, `BreadcrumbList`, `ItemList`, `FAQPage`).
5. **Quality Verification**:
   - Run ESLint, TypeScript check (`tsc --noEmit`), and dev server verification for zero errors.
