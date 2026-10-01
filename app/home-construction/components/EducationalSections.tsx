'use client';

import React from 'react';

export default function EducationalSections() {
  return (
    <div className="w-full space-y-16">
      {/* THREE CLEARLY SEPARATED PILLARS */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-low/40 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
              Core Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-2">
              Three Pillars of Project Estimation
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Successful builds require separating material takeoffs, sequencing logistics, and engineering codes into distinct disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Material Estimates */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">1. Material Estimates</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Calculates theoretical geometric volume, net square footage, deduction of voids (doors, windows), and package rounding (full bundles, bags, cartons, or sheets).
                </p>
                <ul className="space-y-1.5 text-xs text-on-surface">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Net area and volume math</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Configurable cut &amp; pattern waste %</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Commercial packaging roundups</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
                <strong>Focus:</strong> What to purchase at the lumber yard or supply house.
              </div>
            </div>

            {/* Pillar 2: Project Planning */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">event_note</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">2. Project Planning</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Covers construction sequencing, trade handoffs, site access, staging space, equipment rental windows, inspection milestones, and contingency buffers.
                </p>
                <ul className="space-y-1.5 text-xs text-on-surface">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Excavation &amp; subgrade prep</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Sequencing &amp; curing delays</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>10%–20% budget contingencies</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
                <strong>Focus:</strong> How time, labor, equipment, and cash flow are managed.
              </div>
            </div>

            {/* Pillar 3: Technical / Engineering Reference */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">rule</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">3. Technical &amp; Engineering</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  Dimensions, nominal vs actual lumber sizes, structural span capabilities, slope geometry, and aggregate compaction factors for reference.
                </p>
                <ul className="space-y-1.5 text-xs text-on-surface">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Nominal lumber dimensions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Pitch to degree slope multipliers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span>Soil bearing &amp; compaction ratios</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
                <strong>Focus:</strong> Geometric and dimensional specifications.
              </div>
            </div>
          </div>

          {/* Prominent Engineering & Building Code Disclaimer */}
          <div className="mt-8 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface">Engineering &amp; Code Authority Notice:</strong> Calculators provided across SolveItCalculator compute mathematical quantities and baseline volume. They do not substitute for certified structural engineering stamps, localized soil bearing tests, or municipal building code mandates (such as regional frost line depths, wind uplift requirements, or seismic fastening). Always verify final architectural plans with your local building department before starting work.
            </p>
          </div>
        </div>
      </section>

      {/* ESTIMATING BENCHMARK & COMPARISON TABLE */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
            Estimator Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-2">
            Modern Estimating vs. Static Web Calculators
          </h2>
          <p className="text-sm text-on-surface-variant mt-2">
            Why dynamic client-side estimation provides contractors and DIY builders with superior takeoff accuracy over traditional static tables (such as Inch Calculator).
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
          <table className="w-full text-left text-xs text-on-surface border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant/30">
                <th className="py-3.5 px-4 font-bold text-on-surface">Estimating Capability</th>
                <th className="py-3.5 px-4 font-bold text-primary">SolveItCalculator Interactive Suite</th>
                <th className="py-3.5 px-4 font-semibold text-on-surface-variant">Traditional Web Calculators (e.g. Inch Calc)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr>
                <td className="py-3 px-4 font-medium text-on-surface">Reactive In-Place Calculation</td>
                <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                  <span>Instant live recalculation on input slider/change</span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">Requires manual page reloads or separated sub-forms</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-on-surface">Configurable Waste &amp; Loss Margins</td>
                <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                  <span>Custom 0%–30% slider with project-specific presets</span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">Hardcoded 10% assumption with no interactive adjustment</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-on-surface">Commercial Packaging Roundups</td>
                <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                  <span>Exact unit package outputs (80lb bags, 3-bundle squares, 4×8 sheets)</span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">Often outputs raw decimals without packaged purchase units</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-on-surface">Unit System Flexibility</td>
                <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                  <span>US Customary, Metric, and Imperial with instant toggle</span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">Often US Customary only or isolated separate converter pages</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-on-surface">Bill of Materials (BOM) Export</td>
                <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                  <span>One-click clipboard takeoff summary and print sheet</span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">Manual copy-paste from screen</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-on-surface">Privacy &amp; Data Security</td>
                <td className="py-3 px-4 text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                  <span>100% client-side execution; zero external tracking</span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">Server-side tracking and third-party advertising scripts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 7: METHODOLOGY & WHY RESULTS DIFFER */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Methodology */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">functions</span>
              </span>
              <div>
                <h3 className="text-xl font-bold text-on-surface">How Construction Calculations Work</h3>
                <p className="text-xs text-on-surface-variant">Step-by-step mathematical methodology used in our estimators.</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs text-on-surface-variant leading-relaxed">
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Step 1: Net Geometric Surface or Volume
                </strong>
                Every estimation begins with gross dimensions (Length × Width for 2D surfaces, or Length × Width × Depth for 3D volumes). Fractions and inches are converted to decimal feet or metric meters.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Step 2: Subtractions for Openings &amp; Voids
                </strong>
                For walls and partitions, doors (standard 21 sq ft) and windows (average 15 sq ft) are subtracted from the gross envelope to prevent over-estimating paint, siding, and drywall.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Step 3: Slope &amp; Pitch Geometric Multipliers
                </strong>
                Sloped surfaces like roof rafters and roof sheathing multiply flat horizontal footprint by the hypotenuse pitch multiplier: √(1 + (Pitch/12)²).
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Step 4: Jobsite Waste Buffer Application
                </strong>
                Net geometric quantities are increased by a user-configured waste factor (typically 5%–15%) to account for perimeter offcuts, pattern matching, breakage, and irregular excavation trenches.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Step 5: Commercial Packaging Roundups
                </strong>
                Calculations round up to whole commercial purchasing units (80lb concrete bags, 3-bundle roofing squares, 20 sq ft flooring cartons, 4.5 gal joint compound buckets, and standard 8-foot lumber boards).
              </div>
            </div>
          </div>

          {/* Why Results Differ */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">difference</span>
              </span>
              <div>
                <h3 className="text-xl font-bold text-on-surface">Why Actual Jobsite Results Differ</h3>
                <p className="text-xs text-on-surface-variant">Real-world physical variables that affect material consumption.</p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs text-on-surface-variant leading-relaxed">
              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Subgrade Inconsistencies &amp; Uneven Digging
                </strong>
                Excavated soil is never laser-flat. A mere 1/2-inch variation in depth across a 24×24 ft garage slab slab foundation requires over 0.88 extra cubic yards of concrete.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Formwork Flexing &amp; Soil Spillage
                </strong>
                Wet concrete exerts hydrostatic pressure against 2×4 or 2×6 wood forms. Form deflection and perimeter over-digging always absorb additional cubic yardage beyond theoretical volume.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Pattern Layouts &amp; Off-Angle Trimmings
                </strong>
                Herringbone, diagonal, or pinwheel tile layouts generate substantially higher cut waste (often 15%–20%) than a standard 50% running bond or stack bond grid.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Surface Porosity &amp; Manufacturer Spread Rates
                </strong>
                Unprimed drywall, textured stucco, or weathered wood absorb up to 40% more paint or sealer on the first coat than smooth, pre-primed factory surfaces.
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <strong className="text-on-surface font-semibold block text-sm mb-1">
                  Compaction Shrinkage of Aggregates
                </strong>
                Crushed stone, #57 gravel, and decomposed granite compact between 10% and 20% when compacted mechanically with a vibrating plate tamper.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STANDARDS & REFERENCES + CONSTRUCTION GUIDES */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-low/30 border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Standards & References (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
                Industry Norms
              </span>
              <h3 className="text-xl font-bold text-on-surface">Standards &amp; Trade References</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Formulas and nominal dimensional standards are referenced against recognized building trade institutions:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">Ready-Mix Concrete</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">ASTM C94 / ACI 318</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Standard specification for ready-mixed concrete batching, air entrainment, slump measurement, and 28-day compressive test benchmarks.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">Wood Framing &amp; Spans</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">AWC / IRC Table R602</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    American Wood Council National Design Specification (NDS) and International Residential Code wall framing and floor joist span tables.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">Roofing &amp; Waterproofing</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">ARMA / NRCA Guidelines</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Asphalt Roofing Manufacturers Association installation guidelines for steep-slope underlayment overlap, fastener patterns, and valley flashings.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">Tile &amp; Grout Installations</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-primary font-semibold">TCNA Handbook / ANSI A108</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Tile Council of North America standards for substrate deflection (L/360 or L/720), expansion joint frequency, and mortar bond coverage.
                  </p>
                </div>
              </div>
            </div>

            {/* Construction Guides (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
                Practical Jobsite Guides
              </span>
              <h3 className="text-xl font-bold text-on-surface">Trade Reference Guides</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Rules of thumb and dimensional realities to remember when calculating materials on site:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-primary text-base">straighten</span>
                    Nominal vs. Actual Lumber Sizing
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    A 2×4 board is milled to 1-1/2&quot; × 3-1/2&quot;. A 2×6 is 1-1/2&quot; × 5-1/2&quot;. A 5/4×6 deck board is 1&quot; × 5-1/2&quot;. Always use actual dressed dimensions when calculating frame thickness and stair risers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-primary text-base">water_drop</span>
                    Concrete Hydration &amp; Ambient Weather
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Concrete does not dry; it cures through chemical hydration. In hot or windy conditions, surface moisture evaporates too rapidly, causing shrinkage cracks. Always keep fresh concrete moist or use a curing compound.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-primary text-base">square_foot</span>
                    Roof Pitch Safety &amp; Walkability
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Slopes up to 4/12 are gently walkable. 6/12 to 8/12 require specialized traction shoes and roof brackets. Pitches over 8/12 (33.7°) typically require safety harnesses and roped fall-arrest systems.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                  <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-primary text-base">format_paint</span>
                    Paint Sheen Durability vs. Imperfection
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Flat finishes hide drywall surface imperfections but scuff easily (ideal for ceilings). Satin and Eggshell offer balanced scrubbability for living rooms. Semi-Gloss resists moisture in kitchens and baths.
                  </p>
                </div>
              </div>

              {/* Methodology & Assumptions Table */}
              <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
                <h4 className="text-xs font-bold text-on-surface mb-2">Default Calculation Assumptions</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-on-surface-variant block">Concrete Bag Yield:</span>
                    <span className="font-mono font-semibold text-on-surface">80 lb = 0.60 cu ft</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Paint Wall Coverage:</span>
                    <span className="font-mono font-semibold text-on-surface">350 sq ft / gallon</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Roofing Square:</span>
                    <span className="font-mono font-semibold text-on-surface">100 sq ft = 3 bundles</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Crushed Stone Density:</span>
                    <span className="font-mono font-semibold text-on-surface">1.4 tons / cu yard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-2">
            Questions About Construction Calculations
          </h2>
          <p className="text-sm text-on-surface-variant mt-2">
            Clear, transparent answers on waste factors, code compliance, unit conversions, and estimating accuracy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {[
            {
              q: 'Why should I include a waste factor in my material order?',
              a: 'Construction materials are rarely installed without cutoffs. Framing studs must be trimmed to plumb lines; tiles are cut around outlets and perimeter edges; concrete pours push against flexible forms and uneven gravel beds. Applying a project-specific waste factor (5% to 15%) ensures you finish the job without costly emergency reorders or structural cold joints.',
            },
            {
              q: 'Do these calculators automatically apply local building codes?',
              a: 'No. Building codes are enacted at municipal, state, and provincial levels. For instance, foundation footing depth is strictly governed by your local frost line (which ranges from 0 inches in southern Florida to over 48 inches in northern states). These tools calculate geometric volume and baseline quantities. Always check your town or city building inspection department before breaking ground.',
            },
            {
              q: 'Why does my actual concrete order differ from theoretical slab volume?',
              a: 'Excavation subgrade is never completely flat. A half-inch dip across a 24×24 ft slab adds significant volume. Additionally, wood formwork bows slightly under the weight of wet concrete, and pump truck hoses retain residual mix. Concrete suppliers generally recommend ordering an extra 5% to 10% on slab pours to prevent short loads.',
            },
            {
              q: 'How are door and window openings deducted in paint and drywall estimates?',
              a: 'In paint calculations, standard doors (typically 21 sq ft) and windows (typically 15 sq ft) are subtracted from the gross wall perimeter. In drywall calculations, professional drywallers often do not deduct small window openings because whole sheets are fastened across the opening and routed out, creating scrap cutoffs rather than sheet savings.',
            },
            {
              q: 'Can I switch between Metric, US Customary, and Imperial measurements?',
              a: 'Yes. SolveItCalculator provides unit options for US Customary (feet, inches, cubic yards, gallons), Metric (meters, centimeters, cubic meters, liters), and Imperial measurements. All mathematical conversions execute with floating-point precision directly in your browser.',
            },
            {
              q: 'Is my project estimate data stored on external servers?',
              a: 'No. All calculations, dimensions, and cost figures execute client-side directly within your browser session. Your project dimensions and budgeting estimates remain private to your local device.',
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/30 shadow-xs open:shadow-sm transition-all"
            >
              <summary className="font-bold text-sm sm:text-base text-on-surface flex items-center justify-between cursor-pointer list-none select-none">
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform shrink-0 ml-2">
                  expand_more
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/20 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
