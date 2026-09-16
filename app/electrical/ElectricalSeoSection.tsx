'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ElectricalFaq {
  id: number;
  q: string;
  a: string;
}

export const ELECTRICAL_FAQS: ElectricalFaq[] = [
  {
    id: 1,
    q: 'What is an electrical calculator?',
    a: "An electrical calculator is an online or digital computation tool engineered to solve mathematical and physical relationships in electrical systems. By leveraging standardized electrical formulas (such as Ohm’s Law, Joule’s Law, and Faraday’s principles) alongside statutory building standards (such as the National Electrical Code NFPA 70 and IEC 60364), electrical calculators determine conductor gauge, voltage drop, circuit breaker ratings, equipment ampacities, energy costs, and renewable energy system dimensions accurately."
  },
  {
    id: 2,
    q: 'How do I calculate wire size for an electrical circuit?',
    a: "Sizing an electrical wire involves three critical steps: (1) Determine Design Current by multiplying continuous loads by 125% and adding non-continuous loads at 100%. (2) Check Conductor Ampacity in standard reference tables (such as NEC Table 310.16) for copper or aluminum wire under your conductor temperature rating (60°C, 75°C, or 90°C), factoring in ambient temperature correction and conduit fill derating. (3) Verify Voltage Drop over the circuit length to ensure total voltage loss remains under 3% under full load. If voltage loss exceeds 3%, step up to the next larger gauge size."
  },
  {
    id: 3,
    q: 'What is voltage drop and why does it matter?',
    a: "Voltage drop is the reduction in electrical potential along a conductor path caused by the natural electrical resistance of the wire material (copper or aluminum). Excessive voltage drop starves connected electrical equipment of necessary operating voltage. This causes electric motors to draw excess current and overheat, electronic power supplies to glitch or reset, light fixtures to flicker, and energy to dissipate wastefully as heat inside walls and raceways."
  },
  {
    id: 4,
    q: 'How do I size a circuit breaker for a home appliance?',
    a: "Circuit breakers must be sized to protect the circuit conductor they feed, rather than the appliance alone. For continuous loads (defined as loads operating continuously for 3 hours or more, such as electric space heaters or EV chargers), the breaker must be rated for at least 125% of the continuous load amperage. For example, an electric vehicle charger drawing 32 Amps continuously requires a minimum 40-Amp breaker (32A × 1.25 = 40A) wired with 8 AWG copper conductors."
  },
  {
    id: 5,
    q: 'How do I calculate total electrical load for a house or building?',
    a: "Calculating residential service panel load follows standard demand calculations (such as NEC Article 220): (1) General Lighting & Receptacles: 3 Volt-Amps per square foot of living area. (2) Small Appliance & Laundry Circuits: 1,500 VA for each 20A kitchen and laundry branch circuit. (3) General Demand Factors: First 3,000 VA at 100%; remaining balance between 3,001 and 120,000 VA at 35%. (4) Fastened-in-Place Appliances: Total nameplate Volt-Amps for water heater, dishwasher, disposal, and clothes dryer. (5) HVAC Load: 100% of the larger load between heating and air conditioning. Divide the final Volt-Amps by 240 Volts to determine minimum service panel rating (e.g. 100A, 200A, or 400A)."
  },
  {
    id: 6,
    q: "What is Ohm's Law and how do I use it?",
    a: "Ohm's Law defines the relationship between potential (Voltage V in Volts), current (I in Amperes), and electrical resistance (R in Ohms): V = I × R, I = V / R, and R = V / I. Electrical power in Watts is calculated as P = V × I = I² × R = V² / R. These four equations form the foundational basis for sizing resistors, calculating heat dissipation, troubleshooting voltage sags, and analyzing circuit parameters."
  },
  {
    id: 7,
    q: 'How do I convert Amps to Watts?',
    a: "The conversion depends on your electrical system configuration: In Direct Current (DC) circuits, Watts = Amps × Volts. In AC single-phase circuits, Watts = Amps × Volts × Power Factor (PF = 1.0 for purely resistive loads like heaters, and ~0.85 for inductive motor loads). In AC balanced three-phase circuits (line-to-line), Watts = √3 × Amps × Volts × Power Factor (≈ 1.732 × Amps × Volts × PF)."
  },
  {
    id: 8,
    q: 'What is the difference between Watts (kW) and Volt-Amperes (kVA)?',
    a: "Watts (kW) represents real (active) power that performs physical mechanical work, such as producing heat, light, or shaft rotation. Volt-Amperes (kVA) represents apparent power, which is the total vector sum of active power and reactive power (power required to magnetize transformer cores and motor windings). They are related via the power factor: kW = kVA × PF. In purely resistive circuits, kW = kVA. In inductive circuits (like industrial plants with AC motors), the power factor drops to 0.80 or lower, meaning more kVA must be supplied than the actual kW used."
  },
  {
    id: 9,
    q: 'How do I calculate electricity consumption and operating costs?',
    a: "Electricity consumption is measured in kilowatt-hours (kWh). First, calculate daily energy usage: kWh = (Device Wattage × Operating Hours per Day) / 1,000. Second, calculate cost: Operating Cost = kWh × Utility Rate per kWh. For example, running a 1,500-watt space heater for 8 hours a day at $0.16/kWh equals: 1.5 kW × 8 hours = 12 kWh/day × $0.16 = $1.92 per day ($57.60 per month)."
  },
  {
    id: 10,
    q: 'What size backup generator do I need for my home?',
    a: "Sizing a standby generator requires totaling two distinct numbers: (1) Running (Continuous) Watts: Sum of all essential circuits you wish to run simultaneously (refrigerator ~600W, lights ~300W, electronics ~400W, sump pump ~800W). (2) Starting (Surge) Watts: Electric motor compressors (central air conditioning, well pumps, refrigerators) demand 2 to 4 times their running wattage during the first half-second of startup. A typical home requiring central AC, a well pump, and basic appliances usually requires a 12 kW to 22 kW standby generator."
  },
  {
    id: 11,
    q: 'How do I size an off-grid solar and battery storage system?',
    a: "Sizing renewable solar and storage requires: (1) Daily Consumption: Sum your appliance watt-hours per day (Wh/day). (2) Solar Array Size: Divide daily watt-hours by your region's lowest seasonal Peak Sun Hours (PSH), then divide by 0.75 to offset system losses: Array kW = Daily kWh / (Peak Sun Hours × 0.75). (3) Battery Capacity: Multiply daily watt-hours by desired days of autonomy (typically 2–3 days without sun), then divide by battery usable depth of discharge (80% for Lithium, 50% for Lead-Acid) and system DC voltage (12V, 24V, or 48V) to determine required Amp-Hours (Ah)."
  },
  {
    id: 12,
    q: 'What is conduit fill and what are the maximum limits?',
    a: "Conduit fill defines the cross-sectional percentage of an electrical raceway (EMT, PVC, RMC, or FMC) occupied by wires. Overfilling conduit leads to conductor jacket tearing during wire pulling and traps heat inside the pipe. The NEC Chapter 9, Table 1 dictates strict fill capacity limits: 1 Conductor: 53% maximum conduit area; 2 Conductors: 31% maximum conduit area; 3 or More Conductors: 40% maximum conduit area."
  },
  {
    id: 13,
    q: 'What is Power Factor and how does low power factor cost money?',
    a: "Power Factor (PF) is the ratio of real power (P in kW) to apparent power (S in kVA), represented by cos(θ). A power factor of 1.0 (unity) means all current is converted into useful work. Low power factor (typically caused by unloaded induction motors and transformers) causes excess current to cycle harmlessly yet heavily through utility lines. Commercial utilities levy hefty power factor surcharge penalties if your facility power factor falls below 0.90 or 0.95. Sizing power factor correction capacitor banks eliminates these penalties."
  },
  {
    id: 14,
    q: 'What is the 80% continuous load rule?',
    a: "Both the NEC (Section 210.20) and Canadian Electrical Code dictate that an overcurrent protective device (standard circuit breaker or fuse) must not be loaded to more than 80% of its nominal rating for any continuous load (a load sustained for 3 hours or more). Therefore, a standard 20-Amp branch breaker can only handle a continuous draw of 16 Amps (20A × 0.80 = 16A). Alternatively, the circuit breaker must be sized at 125% of the continuous load (16A × 1.25 = 20A)."
  },
  {
    id: 15,
    q: 'What is the difference between copper and aluminum conductors?',
    a: "Copper has superior electrical conductivity and lower electrical resistance than aluminum, allowing a smaller gauge conductor to carry equivalent amperage without overheating. Aluminum is approximately 60% lighter and considerably less expensive, making it the industry standard for large residential service entrance cables and utility transmission feeders. Aluminum wire requires anti-oxidant compound and dual-rated lugs (marked AL7CU or AL9CU) to prevent galvanic corrosion and thermal expansion loose connections."
  }
];

export default function ElectricalSeoSection() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-surface-container-low border-t border-outline-variant/20 py-space-3xl">
      <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
        
        {/* Author / EEAT Reviewer Byline */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Engineering Authority &amp; Code Compliance
              </span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                Calibrated to 2024 NEC (NFPA 70), IEC 60364 &amp; IEEE Standards
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-body-sm text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>100% Client-Side Private Computation</span>
          </div>
        </div>

        {/* Featured Snippet Definition Callout */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-primary/20 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[22px]">electric_bolt</span>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-primary font-bold uppercase tracking-wider block mb-1">
                Quick Reference • What Is an Electrical Calculator?
              </span>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                <strong>An electrical calculator is a specialized engineering tool designed to determine vital electrical parameters—including wire gauge (AWG/mm²), circuit breaker ratings, voltage drop, conduit fill, and power requirements (Watts, Amps, Volts, and kVA).</strong> By applying established mathematical laws such as Ohm&apos;s Law and standard safety codes (such as NEC NFPA 70 and IEC 60364), an electrical calculator allows electricians, engineers, and technicians to size electrical circuits accurately, eliminate thermal hazards, and ensure safe, code-compliant installations.
              </p>
            </div>
          </div>
        </div>

        {/* H2: Essential Electrical Sizing & Engineering Calculators */}
        <article className="space-y-space-md text-left">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Essential Electrical Sizing &amp; Engineering Calculators
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Every electrical system design demands strict adherence to thermal limits, overcurrent coordination, and allowable voltage drop. Whether planning a 200-Amp residential panel upgrade, sizing solar string inverters, or balancing industrial 480V 3-phase motor feeders, our interactive calculation engines deliver instant, code-verified parameters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-primary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">cable</span>
                Conductors, Conduit &amp; Voltage Drop
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Determine minimum American Wire Gauge (AWG) or metric mm² cross-sections. Calculate continuous thermal ampacities, raceway conduit fill percentages (EMT, PVC, RMC), and one-way voltage drop to maintain circuit losses below the recommended 3% limit.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <a href="#workbench-cable" className="text-primary hover:underline flex items-center gap-1">
                  Wire Size Sizer →
                </a>
                <span className="text-outline-variant">•</span>
                <a href="#cat-3" className="text-primary hover:underline">
                  Conduit Fill Sizer →
                </a>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-secondary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">security</span>
                Overcurrent Protection &amp; Breaker Ratings
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Size circuit breakers and fast-acting fuses for non-continuous (100%) and continuous (125%) loads under NEC Article 240. Avoid nuisance tripping from high motor locked-rotor inrush current (LRA) and transformer magnetizing surges.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <a href="#cat-4" className="text-secondary hover:underline flex items-center gap-1">
                  Breaker Size Calculator →
                </a>
                <span className="text-outline-variant">•</span>
                <a href="#workbench-transformer" className="text-secondary hover:underline">
                  Transformer Protection →
                </a>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-tertiary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
                Load Calculations &amp; Power Conversions
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Execute seamless conversions between Amps, Volts, Watts, kW, and kVA for single-phase and balanced 3-phase systems. Calculate full residential service entrance demand loads and industrial power factor correction capacitor banks.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <a href="#cat-2" className="text-tertiary hover:underline flex items-center gap-1">
                  kW to Amps &amp; Watts →
                </a>
                <span className="text-outline-variant">•</span>
                <a href="#cat-17" className="text-tertiary hover:underline">
                  Home Load Calculator →
                </a>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">solar_power</span>
                Renewable Energy &amp; Standby Power Sizing
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Design off-grid and grid-tied solar photovoltaic arrays by balancing peak sun hours (PSH), inverter efficiency, and temperature coefficients. Size lithium iron phosphate (LiFePO4) battery banks and home emergency standby generators.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
                <a href="#workbench-solar" className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1">
                  Solar &amp; Battery Sizer →
                </a>
                <span className="text-outline-variant">•</span>
                <a href="#cat-10" className="text-emerald-700 dark:text-emerald-400 hover:underline">
                  Generator Sizing →
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* H2: How to Calculate Wire Size & Voltage Drop (NEC & IEC Compliance) */}
        <article className="space-y-space-md text-left bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            How to Calculate Wire Size &amp; Voltage Drop (NEC &amp; IEC Compliance)
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Proper conductor selection is governed by two complementary requirements: <strong>allowable thermal ampacity</strong> (to prevent conductor insulation degradation and electrical fires) and <strong>voltage drop limitation</strong> (to deliver adequate operating potential to terminal loads).
          </p>

          <div className="space-y-space-sm pt-2">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Calculating Allowable Ampacity Under Continuous Duty
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Under <strong>NEC Table 310.16</strong> and <strong>IEC 60364-5-52</strong>, conductor sizing begins by assessing circuit duty cycle. For non-continuous loads, conductors must carry 100% of the rated amperage. For continuous loads (defined by NEC Article 100 as loads operating continuously for 3 hours or more, like water heaters, space heating, and EV chargers), conductors must carry a minimum of <strong>125% of the continuous load current</strong>:
            </p>
            <div className="p-3 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
              Design Current (Amps) = (Continuous Load × 1.25) + (Non-Continuous Load × 1.0)
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              The conductor ampacity must then be corrected for ambient room temperatures exceeding 30°C (86°F) and derated if more than three current-carrying conductors are bundled in a single raceway.
            </p>
          </div>

          <div className="space-y-space-sm pt-2">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Limiting Branch and Feeder Voltage Drop Below 3%
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              When an electrical run extends over long distances, conductor electrical resistance produces an unavoidable loss in voltage. The National Electrical Code (NEC Sections 210.19(A) Informational Note 4 and 215.2(A)(1) Informational Note 2) recommends:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
              <li><strong>Maximum 3% voltage drop</strong> across any individual branch circuit or feeder.</li>
              <li><strong>Maximum 5% total voltage drop</strong> across combined feeders and branch circuits to the farthest outlet.</li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                <span className="font-bold text-primary block mb-1">Single-Phase Voltage Drop:</span>
                V_drop = (2 × K × I × L) / cmil
              </div>
              <div className="p-3 rounded-lg bg-surface-container font-data-mono text-xs text-on-surface">
                <span className="font-bold text-secondary block mb-1">Three-Phase Voltage Drop:</span>
                V_drop = (√3 × K × I × L) / cmil
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
              Where <em>K</em> is the conductor resistivity (10.4 Ω·cmil/ft for Copper at 75°C, 17.0 Ω·cmil/ft for Aluminum), <em>I</em> is current in Amperes, <em>L</em> is one-way run distance in feet, and <em>cmil</em> represents the conductor circular mil area.
            </p>
          </div>
        </article>

        {/* H2: How to Size Circuit Breakers & Overcurrent Protection Devices */}
        <article className="space-y-space-md text-left bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            How to Size Circuit Breakers &amp; Overcurrent Protection Devices
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Overcurrent protective devices (circuit breakers and fuses) serve as thermal and magnetic shields, opening the circuit before excessive current overheats wires or causes an electrical fire.
          </p>
          <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <p>
              <strong>The 80% Rule (NEC Section 210.20):</strong> Standard inverse-time circuit breakers are designed for continuous duty up to 80% of their nameplate rating. Therefore, a circuit breaker must be sized at <strong>125% of the continuous load current</strong>. For instance, an electric tankless water heater drawing 40 Amps continuous current requires a 50-Amp circuit breaker (40A × 1.25 = 50A) and minimum 6 AWG copper conductors.
            </p>
            <p>
              <strong>Motor Branch Circuits (NEC Article 430):</strong> AC induction motors exhibit dramatic inrush currents (Locked Rotor Amps) during startup, often drawing 500% to 800% of their running current for several seconds. To prevent the breaker from tripping instantly during motor starts:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-body-sm text-body-sm text-on-surface-variant">
              <li><strong>Branch Conductor Sizing:</strong> Sized at 125% of motor Full Load Amps (FLA) per NEC 430.22.</li>
              <li><strong>Inverse-Time Circuit Breaker:</strong> Sized up to 250% of motor FLA per NEC Table 430.52.</li>
              <li><strong>Motor Overload Relay:</strong> Sized separately at 115% to 125% of nameplate current to protect motor windings from sustained mechanical jams.</li>
            </ul>
          </div>
        </article>

        {/* H2: Converting Between Amps, Volts, Watts, and Horsepower */}
        <article className="space-y-space-md text-left bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Converting Between Amps, Volts, Watts, and Horsepower
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Understanding the relationships between electrical units is crucial when interpreting equipment nameplates, utility bills, and subpanel schedules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-surface-container text-xs font-data-mono text-on-surface">
              <span className="font-bold text-primary block text-sm mb-1">DC Circuits</span>
              Watts = Volts × Amps<br />
              Amps = Watts / Volts<br />
              Volts = Watts / Amps
            </div>
            <div className="p-3 rounded-xl bg-surface-container text-xs font-data-mono text-on-surface">
              <span className="font-bold text-secondary block text-sm mb-1">AC Single-Phase</span>
              Watts = V × I × PF<br />
              kVA = (V × I) / 1,000<br />
              kW = kVA × PF
            </div>
            <div className="p-3 rounded-xl bg-surface-container text-xs font-data-mono text-on-surface">
              <span className="font-bold text-tertiary block text-sm mb-1">AC Three-Phase</span>
              Watts = √3 × V × I × PF<br />
              kVA = (√3 × V × I) / 1,000<br />
              Amps = Watts / (√3 × V × PF)
            </div>
          </div>

          <div className="space-y-2 pt-2 text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
            <p>
              <strong>Mechanical Power Conversion:</strong> 1 Electric Horsepower (HP) equals precisely 746 Watts of mechanical output. When sizing motor inputs, remember that mechanical horsepower must be divided by motor efficiency (typically 85% to 95%) and power factor to yield true electrical input kW and kVA.
            </p>
          </div>
        </article>

        {/* H2: Sizing Solar Arrays, Battery Storage & Backup Generators */}
        <article className="space-y-space-md text-left bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Sizing Solar Arrays, Battery Storage &amp; Backup Generators
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Modern electrical systems increasingly integrate renewable generation and emergency backup reserves to bolster grid independence and resilience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-2">
            <div className="p-space-sm rounded-xl bg-surface-container space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-base">
                Solar Photovoltaic (PV) Sizing
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Solar capacity is determined by regional Peak Sun Hours (PSH) and daily kilowatt-hour demand. Sizing must factor in inverter DC-to-AC clipping, module thermal degradation (-0.35%/°C), and dirt deratings (totaling ~15–20% balance-of-system losses).
              </p>
              <div className="p-2 rounded bg-surface-container-lowest font-data-mono text-[11px]">
                Array kWp = Daily kWh / (Peak Sun Hours × 0.80 System PR)
              </div>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-base">
                Battery Storage Capacity
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Energy storage requires matching days of off-grid autonomy against chemistry-specific Depth of Discharge (DoD). Modern Lithium Iron Phosphate (LiFePO4) allows 80% to 90% usable capacity, compared to just 50% for traditional lead-acid banks.
              </p>
              <div className="p-2 rounded bg-surface-container-lowest font-data-mono text-[11px]">
                Battery Ah = (Daily Wh × Autonomy Days) / (System Volts × DoD)
              </div>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-2">
            <strong>Standby Generator Selection:</strong> Emergency generators must deliver continuous running capacity for steady-state appliances while handling starting surge power when well pumps and air conditioning compressors start up simultaneously.
          </p>
        </article>

        {/* H2: Safety Standards, Code Compliance & Practical Engineering Rules */}
        <article className="space-y-space-md text-left bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Safety Standards, Code Compliance &amp; Practical Engineering Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-2">
            <div className="space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-base">
                Conduit Fill Limits (NEC Chapter 9)
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                To prevent thermal buildup and jacket tears during wire pulling:
              </p>
              <ul className="list-disc pl-5 text-xs text-on-surface-variant space-y-1">
                <li>1 conductor in raceway: max 53% conduit cross-section.</li>
                <li>2 conductors in raceway: max 31% conduit cross-section.</li>
                <li>3 or more conductors: max 40% conduit cross-section.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-base">
                Copper vs. Aluminum Wiring
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Copper offers lower resistance and smaller dimensions for equivalent ampacities. Aluminum is significantly lighter and cost-effective for large subpanel and service entrance feeders, requiring dual-rated AL7CU lugs and anti-oxidant joint compound.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-on-surface font-body-sm leading-relaxed mt-3">
            <strong>Safety Notice:</strong> All electrical calculation results are provided for engineering planning and educational estimating purposes. Always verify final installations against your local building department jurisdiction and consult a licensed electrician or professional engineer before energizing high-voltage circuits.
          </div>
        </article>

        {/* H2: Frequently Asked Questions (FAQ) Section */}
        <article className="space-y-space-md text-left">
          <div className="text-center md:text-left mb- space-md">
            <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider block mb-1">
              HELP &amp; REFERENCE
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Comprehensive technical answers regarding wire sizing, breaker ratings, power formulas, and safety codes.
            </p>
          </div>

          <div className="space-y-space-xs">
            {ELECTRICAL_FAQS.map(faq => (
              <div
                key={faq.id}
                id={`faq-${faq.id}`}
                className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-outline-variant/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={openFaqId === faq.id}
                  className="w-full flex items-center justify-between text-left font-headline-md text-headline-md text-on-surface font-semibold text-base focus:outline-none cursor-pointer gap-4"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-primary text-[20px] transition-transform duration-200 shrink-0 ${
                      openFaqId === faq.id ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaqId === faq.id && (
                  <div className="mt-space-sm pt-space-xs border-t border-surface-container font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Internal Linking Hubs & Related Tools */}
        <article className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-left space-y-space-md shadow-xs">
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            Related Engineering, Physical &amp; Financial Calculators
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Expand your calculations across unit conversions, physics formulas, construction estimates, and utility cost analysis with our verified engineering hubs:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <Link
              href="/conversions"
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border border-outline-variant/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1 text-primary font-semibold text-sm">
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                <span>Unit Conversions</span>
              </div>
              <p className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                Convert wire gauge, cross-sectional area, energy, force, torque, and power units.
              </p>
            </Link>

            <Link
              href="/science"
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-secondary/40 border border-outline-variant/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1 text-secondary font-semibold text-sm">
                <span className="material-symbols-outlined text-[18px]">science</span>
                <span>Physics &amp; Science</span>
              </div>
              <p className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                Calculate thermodynamics, kinetic energy, fluid mechanics, and electrical charges.
              </p>
            </Link>

            <Link
              href="/finance"
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-tertiary/40 border border-outline-variant/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1 text-tertiary font-semibold text-sm">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Energy &amp; Utility Finance</span>
              </div>
              <p className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                Calculate solar payback period, utility cost per kWh, and energy ROI amortizations.
              </p>
            </Link>
          </div>
        </article>

      </div>

      {/* JSON-LD Structured Data Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://solveitcalculator.com/electrical-calculators-sizing-tools/#webpage',
                url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools',
                name: 'Electrical Calculators & Sizing Tools | Free Online Tools',
                description: 'Calculate wire size, voltage drop, breaker ratings, electrical loads, power usage, solar capacity, and more with free electrical calculators and sizing tools.',
                breadcrumb: {
                  '@id': 'https://solveitcalculator.com/electrical-calculators-sizing-tools/#breadcrumb'
                }
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://solveitcalculator.com/electrical-calculators-sizing-tools/#collection',
                name: 'Electrical Calculators & Sizing Tools',
                description: 'Complete collection of free online electrical calculators, wire gauge sizing, voltage drop, circuit breaker ratings, and power conversions.',
                hasPart: [
                  {
                    '@type': 'WebApplication',
                    name: 'Wire Size & Ampacity Calculator',
                    applicationCategory: 'UtilityApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'Voltage Drop Calculator',
                    applicationCategory: 'UtilityApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'Circuit Breaker Sizing Tool',
                    applicationCategory: 'UtilityApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'Three-Phase Motor FLA Calculator',
                    applicationCategory: 'UtilityApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'Transformer Full-Load & Protection Sizer',
                    applicationCategory: 'UtilityApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'Solar PV Array & Battery Storage Sizer',
                    applicationCategory: 'UtilityApplication',
                    operatingSystem: 'All'
                  }
                ]
              },
              {
                '@type': 'BreadcrumbList',
                '@id': 'https://solveitcalculator.com/electrical-calculators-sizing-tools/#breadcrumb',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com/'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Electrical Calculators & Sizing Tools',
                    item: 'https://solveitcalculator.com/electrical-calculators-sizing-tools'
                  }
                ]
              },
              {
                '@type': 'ItemList',
                '@id': 'https://solveitcalculator.com/electrical-calculators-sizing-tools/#itemlist',
                name: 'Electrical Sizing & Engineering Tools',
                numberOfItems: 10,
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Wire Size Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#workbench-cable'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Voltage Drop Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#workbench-cable'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Circuit Breaker Size Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#cat-4'
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: 'Electrical Load Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#cat-17'
                  },
                  {
                    '@type': 'ListItem',
                    position: 5,
                    name: 'Conduit Fill Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#cat-3'
                  },
                  {
                    '@type': 'ListItem',
                    position: 6,
                    name: 'Transformer Full-Load Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#workbench-transformer'
                  },
                  {
                    '@type': 'ListItem',
                    position: 7,
                    name: 'Three-Phase Motor FLA Sizer',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#workbench-motor'
                  },
                  {
                    '@type': 'ListItem',
                    position: 8,
                    name: "Ohm's Law Calculator",
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#cat-1'
                  },
                  {
                    '@type': 'ListItem',
                    position: 9,
                    name: 'Solar Panel & Battery Storage Sizer',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#workbench-solar'
                  },
                  {
                    '@type': 'ListItem',
                    position: 10,
                    name: 'Generator Sizing Calculator',
                    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools#cat-10'
                  }
                ]
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveitcalculator.com/electrical-calculators-sizing-tools/#faq',
                mainEntity: ELECTRICAL_FAQS.map(faq => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a
                  }
                }))
              }
            ]
          })
        }}
      />
    </section>
  );
}
