'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
  FaqItem,
} from '@/components/calculator-page/SingleCalculatorPageShell';

export type ScienceCalculatorSlug =
  | 'density-calculator'
  | 'force-calculator'
  | 'ohms-law-calculator'
  | 'molarity-calculator';

const SCIENCE_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Scientific Calculator',
    description: 'Evaluate trigonometry, logarithms, exponents, and constants.',
    href: '/math/scientific-calculator',
    iconVariant: 'calc-blue',
  },
  {
    name: 'Percent Error Calculator',
    description: 'Compare experimental measurements against theoretical values.',
    href: '/math/percent-error-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Logarithm & pH Calculator',
    description: 'Compute common (base 10) and natural (ln) logarithms.',
    href: '/math/log-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'SI & Metric Unit Converter',
    description: 'Convert mass, volume, temperature, speed, and energy.',
    href: '/conversions',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Quadratic & Projectile Solver',
    description: 'Solve second-degree kinematics and equilibrium equations.',
    href: '/math/quadratic-equation-calculator',
    iconVariant: 'fraction-purple',
  },
];

export default function ScienceCalculatorsClient({
  slug,
}: {
  slug: ScienceCalculatorSlug;
}) {
  // 1. DENSITY CALCULATOR STATE
  const [densityTarget, setDensityTarget] = useState<'density' | 'mass' | 'volume'>('density');
  const [massGrams, setMassGrams] = useState<number>(250);
  const [volumeCm3, setVolumeCm3] = useState<number>(100);
  const [densityGcm3, setDensityGcm3] = useState<number>(2.5);

  // 2. FORCE CALCULATOR STATE (F = m * a)
  const [forceTarget, setForceTarget] = useState<'force' | 'mass' | 'acceleration'>('force');
  const [forceMassKg, setForceMassKg] = useState<number>(15);
  const [accelerationMs2, setAccelerationMs2] = useState<number>(9.81);
  const [forceNewtons, setForceNewtons] = useState<number>(147.15);

  // 3. OHM'S LAW CALCULATOR STATE (V = I * R, P = V * I)
  const [ohmsTarget, setOhmsTarget] = useState<'voltage' | 'current' | 'resistance'>('voltage');
  const [voltageV, setVoltageV] = useState<number>(12);
  const [currentA, setCurrentA] = useState<number>(2);
  const [resistanceOhm, setResistanceOhm] = useState<number>(6);

  // 4. MOLARITY CALCULATOR STATE (M = moles / L, mass = M * L * MW)
  const [molarityTarget, setMolarityTarget] = useState<'molarity' | 'mass' | 'volume'>('molarity');
  const [soluteMassG, setSoluteMassG] = useState<number>(58.44);
  const [molarMassGmol, setMolarMassGmol] = useState<number>(58.44); // NaCl default
  const [solutionVolumeL, setSolutionVolumeL] = useState<number>(1);
  const [targetMolarityM, setTargetMolarityM] = useState<number>(1);

  // Compute active calculator result
  const computed = useMemo(() => {
    if (slug === 'density-calculator') {
      if (densityTarget === 'density') {
        const safeVol = volumeCm3 > 0 ? volumeCm3 : 0;
        const rho = safeVol > 0 ? massGrams / safeVol : 0;
        const kgM3 = rho * 1000;
        const floatsInWater = rho < 1.0;
        return {
          valid: safeVol > 0 && massGrams >= 0,
          errorMsg: safeVol <= 0 ? 'Volume must be greater than zero to avoid division by zero.' : null,
          promptSummary: `Density for mass = ${massGrams} g and volume = ${volumeCm3} cm³`,
          mainValue: `${Number(rho.toFixed(4))} g/cm³`,
          equation: `ρ = ${massGrams} g ÷ ${volumeCm3} cm³ = ${Number(rho.toFixed(4))} g/cm³ (${Number(kgM3.toFixed(1))} kg/m³)`,
          secondaryNote: `SI Equivalent: ${Number(kgM3.toFixed(1))} kg/m³ · Water comparison (1.00 g/cm³): ${floatsInWater ? 'Floats in pure water' : 'Sinks in pure water'}`,
        };
      }
      if (densityTarget === 'mass') {
        const m = densityGcm3 * volumeCm3;
        return {
          valid: densityGcm3 >= 0 && volumeCm3 >= 0,
          errorMsg: null,
          promptSummary: `Mass for density = ${densityGcm3} g/cm³ and volume = ${volumeCm3} cm³`,
          mainValue: `${Number(m.toFixed(4))} g`,
          equation: `m = ${densityGcm3} g/cm³ × ${volumeCm3} cm³ = ${Number(m.toFixed(4))} g (${Number((m / 1000).toFixed(4))} kg)`,
          secondaryNote: `Kilograms: ${Number((m / 1000).toFixed(4))} kg · Pounds: ${Number((m * 0.00220462).toFixed(4))} lb`,
        };
      }
      const safeRho = densityGcm3 > 0 ? densityGcm3 : 0;
      const v = safeRho > 0 ? massGrams / safeRho : 0;
      return {
        valid: safeRho > 0 && massGrams >= 0,
        errorMsg: safeRho <= 0 ? 'Density must be greater than zero to calculate volume.' : null,
        promptSummary: `Volume for mass = ${massGrams} g and density = ${densityGcm3} g/cm³`,
        mainValue: `${Number(v.toFixed(4))} cm³`,
        equation: `V = ${massGrams} g ÷ ${densityGcm3} g/cm³ = ${Number(v.toFixed(4))} cm³ (mL)`,
        secondaryNote: `Liters: ${Number((v / 1000).toFixed(4))} L · Cubic meters: ${(v / 1_000_000).toExponential(3)} m³`,
      };
    }

    if (slug === 'force-calculator') {
      if (forceTarget === 'force') {
        const f = forceMassKg * accelerationMs2;
        const lbf = f * 0.224808943;
        return {
          valid: forceMassKg >= 0,
          errorMsg: forceMassKg < 0 ? 'Mass cannot be negative.' : null,
          promptSummary: `Net Force for m = ${forceMassKg} kg and a = ${accelerationMs2} m/s²`,
          mainValue: `${Number(f.toFixed(3))} N`,
          equation: `F = ${forceMassKg} kg × ${accelerationMs2} m/s² = ${Number(f.toFixed(3))} N`,
          secondaryNote: `Kilonewtons: ${Number((f / 1000).toFixed(4))} kN · Pound-force: ${Number(lbf.toFixed(3))} lbf`,
        };
      }
      if (forceTarget === 'mass') {
        const safeA = Math.abs(accelerationMs2) > 0 ? accelerationMs2 : 0;
        const m = safeA !== 0 ? forceNewtons / safeA : 0;
        return {
          valid: safeA !== 0 && m >= 0,
          errorMsg: safeA === 0 ? 'Acceleration cannot be zero when solving for mass.' : null,
          promptSummary: `Mass for F = ${forceNewtons} N and a = ${accelerationMs2} m/s²`,
          mainValue: `${Number(m.toFixed(4))} kg`,
          equation: `m = ${forceNewtons} N ÷ ${accelerationMs2} m/s² = ${Number(m.toFixed(4))} kg`,
          secondaryNote: `Grams: ${Number((m * 1000).toFixed(1))} g · Pounds: ${Number((m * 2.20462).toFixed(3))} lb`,
        };
      }
      const safeM = forceMassKg > 0 ? forceMassKg : 0;
      const a = safeM > 0 ? forceNewtons / safeM : 0;
      const gUnits = a / 9.80665;
      return {
        valid: safeM > 0,
        errorMsg: safeM <= 0 ? 'Mass must be greater than zero when solving for acceleration.' : null,
        promptSummary: `Acceleration for F = ${forceNewtons} N and m = ${forceMassKg} kg`,
        mainValue: `${Number(a.toFixed(4))} m/s²`,
        equation: `a = ${forceNewtons} N ÷ ${forceMassKg} kg = ${Number(a.toFixed(4))} m/s²`,
        secondaryNote: `Standard Gravity Comparison: ${Number(gUnits.toFixed(3))} g (where 1 g = 9.80665 m/s²)`,
      };
    }

    if (slug === 'ohms-law-calculator') {
      if (ohmsTarget === 'voltage') {
        const v = currentA * resistanceOhm;
        const powerW = v * currentA;
        return {
          valid: resistanceOhm >= 0,
          errorMsg: resistanceOhm < 0 ? 'Resistance cannot be negative.' : null,
          promptSummary: `Voltage & Power for I = ${currentA} A and R = ${resistanceOhm} Ω`,
          mainValue: `${Number(v.toFixed(4))} V`,
          equation: `V = ${currentA} A × ${resistanceOhm} Ω = ${Number(v.toFixed(4))} V  |  P = ${Number(powerW.toFixed(4))} W`,
          secondaryNote: `Electrical Power (P = V × I): ${Number(powerW.toFixed(4))} Watts (${Number((powerW / 1000).toFixed(5))} kW)`,
        };
      }
      if (ohmsTarget === 'current') {
        const safeR = resistanceOhm > 0 ? resistanceOhm : 0;
        const i = safeR > 0 ? voltageV / safeR : 0;
        const powerW = voltageV * i;
        return {
          valid: safeR > 0,
          errorMsg: safeR <= 0 ? 'Resistance must be greater than zero to avoid a short-circuit division by zero.' : null,
          promptSummary: `Current & Power for V = ${voltageV} V and R = ${resistanceOhm} Ω`,
          mainValue: `${Number(i.toFixed(4))} A`,
          equation: `I = ${voltageV} V ÷ ${resistanceOhm} Ω = ${Number(i.toFixed(4))} A (${Number((i * 1000).toFixed(2))} mA)`,
          secondaryNote: `Electrical Power (P = V² ÷ R): ${Number(powerW.toFixed(4))} Watts · Milliamps: ${Number((i * 1000).toFixed(2))} mA`,
        };
      }
      const safeI = Math.abs(currentA) > 0 ? currentA : 0;
      const r = safeI !== 0 ? voltageV / safeI : 0;
      const powerW = voltageV * currentA;
      return {
        valid: safeI !== 0 && r >= 0,
        errorMsg: safeI === 0 ? 'Current cannot be zero when solving for resistance.' : null,
        promptSummary: `Resistance & Power for V = ${voltageV} V and I = ${currentA} A`,
        mainValue: `${Number(r.toFixed(4))} Ω`,
        equation: `R = ${voltageV} V ÷ ${currentA} A = ${Number(r.toFixed(4))} Ω  |  P = ${Number(powerW.toFixed(4))} W`,
        secondaryNote: `Electrical Power (P = V × I): ${Number(powerW.toFixed(4))} Watts · Kilohms: ${Number((r / 1000).toFixed(5))} kΩ`,
      };
    }

    // molarity-calculator
    const safeMW = molarMassGmol > 0 ? molarMassGmol : 0;
    if (molarityTarget === 'molarity') {
      const safeVol = solutionVolumeL > 0 ? solutionVolumeL : 0;
      const moles = safeMW > 0 ? soluteMassG / safeMW : 0;
      const molarity = safeVol > 0 ? moles / safeVol : 0;
      return {
        valid: safeMW > 0 && safeVol > 0 && soluteMassG >= 0,
        errorMsg:
          safeMW <= 0 || safeVol <= 0
            ? 'Molar mass and solution volume must both be greater than zero.'
            : null,
        promptSummary: `Molarity for ${soluteMassG} g solute (MW = ${molarMassGmol} g/mol) in ${solutionVolumeL} L`,
        mainValue: `${Number(molarity.toFixed(4))} M`,
        equation: `n = ${soluteMassG} ÷ ${molarMassGmol} = ${Number(moles.toFixed(4))} mol  ⇒  M = ${Number(moles.toFixed(4))} mol ÷ ${solutionVolumeL} L = ${Number(molarity.toFixed(4))} mol/L`,
        secondaryNote: `Millimolar: ${Number((molarity * 1000).toFixed(2))} mM · Moles of solute: ${Number(moles.toFixed(4))} mol`,
      };
    }
    if (molarityTarget === 'mass') {
      const moles = targetMolarityM * solutionVolumeL;
      const massRequired = moles * molarMassGmol;
      return {
        valid: targetMolarityM >= 0 && solutionVolumeL > 0 && molarMassGmol > 0,
        errorMsg:
          solutionVolumeL <= 0 || molarMassGmol <= 0
            ? 'Volume and molar mass must be greater than zero.'
            : null,
        promptSummary: `Solute Mass needed for ${targetMolarityM} M in ${solutionVolumeL} L (MW = ${molarMassGmol} g/mol)`,
        mainValue: `${Number(massRequired.toFixed(4))} g`,
        equation: `Mass = ${targetMolarityM} mol/L × ${solutionVolumeL} L × ${molarMassGmol} g/mol = ${Number(massRequired.toFixed(4))} g`,
        secondaryNote: `Milligrams: ${Number((massRequired * 1000).toFixed(1))} mg · Moles required: ${Number(moles.toFixed(4))} mol`,
      };
    }
    const moles = safeMW > 0 ? soluteMassG / safeMW : 0;
    const safeM = targetMolarityM > 0 ? targetMolarityM : 0;
    const volL = safeM > 0 ? moles / safeM : 0;
    return {
      valid: safeMW > 0 && safeM > 0 && soluteMassG >= 0,
      errorMsg:
        safeMW <= 0 || safeM <= 0
          ? 'Target molarity and molar mass must be greater than zero.'
          : null,
      promptSummary: `Solution Volume for ${soluteMassG} g solute at ${targetMolarityM} M`,
      mainValue: `${Number(volL.toFixed(4))} L`,
      equation: `V = (${soluteMassG} g ÷ ${molarMassGmol} g/mol) ÷ ${targetMolarityM} M = ${Number(volL.toFixed(4))} L (${Number((volL * 1000).toFixed(1))} mL)`,
      secondaryNote: `Milliliters: ${Number((volL * 1000).toFixed(1))} mL · Moles of solute: ${Number(moles.toFixed(4))} mol`,
    };
  }, [
    slug,
    densityTarget,
    massGrams,
    volumeCm3,
    densityGcm3,
    forceTarget,
    forceMassKg,
    accelerationMs2,
    forceNewtons,
    ohmsTarget,
    voltageV,
    currentA,
    resistanceOhm,
    molarityTarget,
    soluteMassG,
    molarMassGmol,
    solutionVolumeL,
    targetMolarityM,
  ]);

  const handleReset = () => {
    setDensityTarget('density');
    setMassGrams(250);
    setVolumeCm3(100);
    setDensityGcm3(2.5);
    setForceTarget('force');
    setForceMassKg(15);
    setAccelerationMs2(9.81);
    setForceNewtons(147.15);
    setOhmsTarget('voltage');
    setVoltageV(12);
    setCurrentA(2);
    setResistanceOhm(6);
    setMolarityTarget('molarity');
    setSoluteMassG(58.44);
    setMolarMassGmol(58.44);
    setSolutionVolumeL(1);
    setTargetMolarityM(1);
  };

  const pageMeta: Record<
    ScienceCalculatorSlug,
    {
      title: string;
      subtitle: string;
      heroSymbol: string;
      formulaCard: {
        introText: string;
        formulaText: string;
        exampleTitle: string;
        exampleSteps: string[];
      };
      howToUseSteps: string[];
      howItWorks: {
        paragraph: string;
        formulaBox: string;
        closingNote: string;
      };
      faqs: FaqItem[];
    }
  > = {
    'density-calculator': {
      title: 'Density Calculator',
      subtitle:
        'Calculate density (ρ), mass (m), or volume (V) using ρ = m ÷ V with automatic conversion to kg/m³ and pure-water buoyancy comparison.',
      heroSymbol: 'ρ',
      formulaCard: {
        introText: 'The standard physics and chemistry formula for density is:',
        formulaText: 'Density (ρ) = Mass (m) ÷ Volume (V)',
        exampleTitle: 'Find the density of 250 g occupying 100 cm³:',
        exampleSteps: [
          'Substitute mass = 250 g and volume = 100 cm³',
          'ρ = 250 g ÷ 100 cm³ = 2.5 g/cm³',
          'In SI units: 2.5 × 1,000 = 2,500 kg/m³',
        ],
      },
      howToUseSteps: [
        'Choose whether you want to solve for Density (ρ), Mass (m), or Volume (V).',
        'Enter the two known measurements into the input fields.',
        'Check your calculated answer in both g/cm³ (g/mL) and SI kg/m³.',
        'Review whether the material floats or sinks relative to pure water (1.00 g/cm³).',
      ],
      howItWorks: {
        paragraph:
          'Density measures how much mass is packed into a given unit of volume. In laboratory chemistry, density is commonly expressed in grams per cubic centimeter (g/cm³) or grams per milliliter (g/mL), while the SI standard unit is kilograms per cubic meter (kg/m³).',
        formulaBox: 'ρ = m / V   |   m = ρ × V   |   V = m / ρ',
        closingNote:
          '1 g/cm³ equals exactly 1,000 kg/m³. Pure liquid water at 4°C has a reference density of approximately 1.000 g/cm³.',
      },
      faqs: [
        {
          question: 'How do you convert g/cm³ to kg/m³?',
          answer:
            'Multiply the density in g/cm³ by 1,000. Because 1 kg = 1,000 g and 1 m³ = 1,000,000 cm³, 1 g/cm³ equals 1,000 kg/m³.',
        },
        {
          question: 'How do I know if an object will float in water?',
          answer:
            'If an object’s average bulk density is less than the density of water (approx. 1.00 g/cm³), it will float. If its density is greater than 1.00 g/cm³, it will sink.',
        },
        {
          question: 'Are 1 cm³ and 1 mL the exact same volume?',
          answer:
            'Yes. One cubic centimeter (1 cm³ or 1 cc) is identically equal to one milliliter (1 mL), so density in g/cm³ is numerically identical to g/mL.',
        },
      ],
    },
    'force-calculator': {
      title: 'Force Calculator',
      subtitle:
        'Calculate net force (N), mass (kg), or acceleration (m/s²) using Newton’s Second Law of Motion (F = m × a).',
      heroSymbol: 'F',
      formulaCard: {
        introText: 'Newton’s Second Law of Motion relates net force, mass, and acceleration:',
        formulaText: 'Net Force (F) = Mass (m) × Acceleration (a)',
        exampleTitle: 'Calculate the gravitational force on a 15 kg mass at 9.81 m/s²:',
        exampleSteps: [
          'Identify mass m = 15 kg and acceleration a = 9.81 m/s²',
          'F = 15 kg × 9.81 m/s²',
          'F = 147.15 Newtons (N)',
        ],
      },
      howToUseSteps: [
        'Select whether you are solving for Net Force (F), Mass (m), or Acceleration (a).',
        'Enter the two known values in standard SI units (kg, m/s², or N).',
        'Review the result along with Kilonewtons (kN), Pound-force (lbf), or g-force equivalents.',
        'Use the Reset button to return to standard Earth gravity (9.81 m/s²).',
      ],
      howItWorks: {
        paragraph:
          'One Newton (1 N) is defined as the net force required to accelerate a 1-kilogram mass at a rate of 1 meter per second squared (1 N = 1 kg·m/s²). Rearranging the equation lets you find unknown mass (m = F ÷ a) or acceleration (a = F ÷ m).',
        formulaBox: 'F = m × a   |   m = F ÷ a   |   a = F ÷ m',
        closingNote:
          '1 Newton equals approximately 0.22481 pound-force (lbf). Standard Earth gravitational acceleration (1 g) is 9.80665 m/s².',
      },
      faqs: [
        {
          question: 'What is 1 Newton of force in everyday terms?',
          answer:
            'One Newton is roughly the weight of a small apple (about 102 grams) under Earth’s gravity.',
        },
        {
          question: 'What is the difference between mass and weight?',
          answer:
            'Mass (measured in kilograms) is the amount of matter in an object and stays constant everywhere. Weight is the gravitational force (F = m × g, measured in Newtons) acting on that mass.',
        },
        {
          question: 'How do you convert Newtons to pound-force (lbf)?',
          answer:
            'Multiply Newtons by 0.224809 (or divide by 4.44822). For example, 100 N equals 22.48 lbf.',
        },
      ],
    },
    'ohms-law-calculator': {
      title: "Ohm's Law Calculator",
      subtitle:
        'Calculate Voltage (V), Current (I), Resistance (R), and Electrical Power (W) for DC and resistive AC circuits.',
      heroSymbol: 'Ω',
      formulaCard: {
        introText: 'Ohm’s Law and Joule’s Power Law govern electrical circuits:',
        formulaText: 'V = I × R   and   Power (P) = V × I = I² × R = V² ÷ R',
        exampleTitle: 'Find voltage and power for a 2 A current through a 6 Ω resistor:',
        exampleSteps: [
          'Voltage: V = 2 A × 6 Ω = 12 Volts (V)',
          'Power: P = 12 V × 2 A = 24 Watts (W)',
          'Check via I²R: (2 A)² × 6 Ω = 4 × 6 = 24 W',
        ],
      },
      howToUseSteps: [
        'Choose which circuit variable you want to solve for: Voltage (V), Current (I), or Resistance (R).',
        'Enter the two known electrical values.',
        'View the solved variable along with the active power dissipation in Watts (W).',
        'Check milliamp (mA), kilohm (kΩ), and kilowatt (kW) conversions automatically.',
      ],
      howItWorks: {
        paragraph:
          'Ohm’s Law states that the electrical current (I, in Amperes) flowing through an ideal conductor is directly proportional to the applied voltage (V, in Volts) and inversely proportional to resistance (R, in Ohms). Simultaneously, electrical power (P, in Watts) equals Voltage multiplied by Current.',
        formulaBox: 'V = I × R   |   I = V ÷ R   |   R = V ÷ I   |   P = V × I',
        closingNote:
          'When sizing physical resistors, always choose a power rating (e.g., 1/4 W, 1/2 W, 1 W) at least 2× higher than the calculated heat dissipation P.',
      },
      faqs: [
        {
          question: 'What happens to current if resistance is doubled at constant voltage?',
          answer:
            'Because I = V ÷ R, doubling the resistance cuts the electrical current in half if voltage remains constant.',
        },
        {
          question: 'How is electrical power in Watts calculated from Ohm’s Law?',
          answer:
            'Power equals Voltage times Current (P = V × I). Substituting Ohm’s Law also gives P = I² × R and P = V² ÷ R.',
        },
        {
          question: 'Does Ohm’s Law apply to AC circuits?',
          answer:
            'For purely resistive AC loads (like heaters and incandescent bulbs), Ohm’s Law applies directly using RMS voltage and current. For inductive or capacitive AC circuits, Resistance (R) is replaced by Impedance (Z).',
        },
      ],
    },
    'molarity-calculator': {
      title: 'Molarity Calculator',
      subtitle:
        'Calculate solution molarity (mol/L), required solute mass (g), or solution volume (L) for chemistry lab preparations.',
      heroSymbol: 'M',
      formulaCard: {
        introText: 'The molarity and mass-concentration formulas for solutions are:',
        formulaText: 'Molarity (M) = Moles (n) ÷ Volume (L)  ;  Mass (g) = M × Volume (L) × Molar Mass (g/mol)',
        exampleTitle: 'Prepare 1 Liter of 1.0 M NaCl (Molar Mass = 58.44 g/mol):',
        exampleSteps: [
          'Moles required: n = 1.0 mol/L × 1.0 L = 1.0 mol',
          'Mass required: 1.0 mol × 58.44 g/mol = 58.44 g NaCl',
          'Dissolve 58.44 g NaCl in water and bring total volume to 1.0 L',
        ],
      },
      howToUseSteps: [
        'Choose whether to solve for Molarity (M), Required Solute Mass (g), or Solution Volume (L).',
        'Enter the compound’s Molar Mass (molecular weight in g/mol, e.g., 58.44 for NaCl).',
        'Enter the known mass, volume, or target molarity.',
        'Read the exact result along with millimolar (mM), milligram (mg), or milliliter (mL) lab units.',
      ],
      howItWorks: {
        paragraph:
          'Molarity (M) measures molar concentration: the number of moles of solute dissolved per liter of total solution (mol/L). Because laboratory balances measure mass in grams rather than moles, dividing solute mass (g) by molar mass (g/mol) converts grams into moles.',
        formulaBox: 'M = (Mass in g ÷ Molar Mass in g/mol) ÷ Solution Volume in L',
        closingNote:
          'Note that volume in the molarity formula refers to the final total solution volume in liters (L), not simply the volume of solvent added.',
      },
      faqs: [
        {
          question: 'What is the difference between molarity (M) and molality (m)?',
          answer:
            'Molarity (M) is moles of solute per liter of total solution (mol/L), whereas molality (m) is moles of solute per kilogram of solvent (mol/kg).',
        },
        {
          question: 'How do I convert milliliters (mL) to liters (L) for molarity calculations?',
          answer:
            'Divide milliliters by 1,000. For example, 250 mL equals 0.250 L.',
        },
        {
          question: 'What are common molar masses used in chemistry labs?',
          answer:
            'Sodium chloride (NaCl) is 58.44 g/mol, Glucose (C₆H₁₂O₆) is 180.16 g/mol, Sodium hydroxide (NaOH) is 40.00 g/mol, and Hydrochloric acid (HCl) is 36.46 g/mol.',
        },
      ],
    },
  };

  const currentMeta = pageMeta[slug];

  const calculatorCard = (
    <section
      id="calculator"
      aria-label={`${currentMeta.title} input panel`}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
              {currentMeta.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Select the target variable you want to solve for and enter your known values.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector per Science Tool */}
      {slug === 'density-calculator' && (
        <>
          <div role="group" aria-label="Solve for variable" className="flex flex-wrap gap-2">
            {(
              [
                { id: 'density', label: 'Solve for Density (ρ = m ÷ V)' },
                { id: 'mass', label: 'Solve for Mass (m = ρ × V)' },
                { id: 'volume', label: 'Solve for Volume (V = m ÷ ρ)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDensityTarget(opt.id)}
                aria-pressed={densityTarget === opt.id}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  densityTarget === opt.id
                    ? 'bg-[#2457D6] text-white border-[#2457D6]'
                    : 'bg-[#F1F5F9] text-[#152238] border-[#CBD5E1] hover:border-[#2457D6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {densityTarget !== 'mass' && (
              <div>
                <label htmlFor="sci-mass-g" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Mass (g) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-mass-g"
                  type="number"
                  step="any"
                  min={0}
                  value={massGrams}
                  onChange={(e) => setMassGrams(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Mass in grams (1 kg = 1,000 g)</p>
              </div>
            )}
            {densityTarget !== 'volume' && (
              <div>
                <label htmlFor="sci-vol-cm3" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Volume (cm³ or mL) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-vol-cm3"
                  type="number"
                  step="any"
                  min={0.0001}
                  value={volumeCm3}
                  onChange={(e) => setVolumeCm3(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Volume in cubic centimeters (1 L = 1,000 cm³)</p>
              </div>
            )}
            {densityTarget !== 'density' && (
              <div>
                <label htmlFor="sci-rho" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Density (g/cm³) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-rho"
                  type="number"
                  step="any"
                  min={0.0001}
                  value={densityGcm3}
                  onChange={(e) => setDensityGcm3(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Water = 1.00 g/cm³, Aluminum = 2.70 g/cm³</p>
              </div>
            )}
          </div>
        </>
      )}

      {slug === 'force-calculator' && (
        <>
          <div role="group" aria-label="Solve for variable" className="flex flex-wrap gap-2">
            {(
              [
                { id: 'force', label: 'Solve for Force (F = m × a)' },
                { id: 'mass', label: 'Solve for Mass (m = F ÷ a)' },
                { id: 'acceleration', label: 'Solve for Acceleration (a = F ÷ m)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setForceTarget(opt.id)}
                aria-pressed={forceTarget === opt.id}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  forceTarget === opt.id
                    ? 'bg-[#2457D6] text-white border-[#2457D6]'
                    : 'bg-[#F1F5F9] text-[#152238] border-[#CBD5E1] hover:border-[#2457D6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {forceTarget !== 'mass' && (
              <div>
                <label htmlFor="sci-force-mass" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Mass (kg) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-force-mass"
                  type="number"
                  step="any"
                  min={0.0001}
                  value={forceMassKg}
                  onChange={(e) => setForceMassKg(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Object mass in kilograms (kg)</p>
              </div>
            )}
            {forceTarget !== 'acceleration' && (
              <div>
                <label htmlFor="sci-force-acc" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Acceleration (m/s²) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-force-acc"
                  type="number"
                  step="any"
                  value={accelerationMs2}
                  onChange={(e) => setAccelerationMs2(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Earth standard gravity g ≈ 9.81 m/s²</p>
              </div>
            )}
            {forceTarget !== 'force' && (
              <div>
                <label htmlFor="sci-force-n" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Net Force (Newtons, N) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-force-n"
                  type="number"
                  step="any"
                  value={forceNewtons}
                  onChange={(e) => setForceNewtons(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">1 N = 1 kg·m/s²</p>
              </div>
            )}
          </div>
        </>
      )}

      {slug === 'ohms-law-calculator' && (
        <>
          <div role="group" aria-label="Solve for variable" className="flex flex-wrap gap-2">
            {(
              [
                { id: 'voltage', label: 'Solve for Voltage (V = I × R)' },
                { id: 'current', label: 'Solve for Current (I = V ÷ R)' },
                { id: 'resistance', label: 'Solve for Resistance (R = V ÷ I)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setOhmsTarget(opt.id)}
                aria-pressed={ohmsTarget === opt.id}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  ohmsTarget === opt.id
                    ? 'bg-[#2457D6] text-white border-[#2457D6]'
                    : 'bg-[#F1F5F9] text-[#152238] border-[#CBD5E1] hover:border-[#2457D6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ohmsTarget !== 'voltage' && (
              <div>
                <label htmlFor="sci-ohm-v" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Voltage (Volts, V) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-ohm-v"
                  type="number"
                  step="any"
                  value={voltageV}
                  onChange={(e) => setVoltageV(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Electrical potential difference in Volts</p>
              </div>
            )}
            {ohmsTarget !== 'current' && (
              <div>
                <label htmlFor="sci-ohm-i" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Current (Amperes, A) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-ohm-i"
                  type="number"
                  step="any"
                  value={currentA}
                  onChange={(e) => setCurrentA(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">1 A = 1,000 mA</p>
              </div>
            )}
            {ohmsTarget !== 'resistance' && (
              <div>
                <label htmlFor="sci-ohm-r" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Resistance (Ohms, Ω) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-ohm-r"
                  type="number"
                  step="any"
                  min={0.0001}
                  value={resistanceOhm}
                  onChange={(e) => setResistanceOhm(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">1,000 Ω = 1 kΩ</p>
              </div>
            )}
          </div>
        </>
      )}

      {slug === 'molarity-calculator' && (
        <>
          <div role="group" aria-label="Solve for variable" className="flex flex-wrap gap-2">
            {(
              [
                { id: 'molarity', label: 'Find Molarity (M)' },
                { id: 'mass', label: 'Find Solute Mass Needed (g)' },
                { id: 'volume', label: 'Find Solution Volume (L)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMolarityTarget(opt.id)}
                aria-pressed={molarityTarget === opt.id}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  molarityTarget === opt.id
                    ? 'bg-[#2457D6] text-white border-[#2457D6]'
                    : 'bg-[#F1F5F9] text-[#152238] border-[#CBD5E1] hover:border-[#2457D6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {molarityTarget !== 'mass' && (
              <div>
                <label htmlFor="sci-mol-mass" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Solute Mass (g) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-mol-mass"
                  type="number"
                  step="any"
                  min={0}
                  value={soluteMassG}
                  onChange={(e) => setSoluteMassG(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Grams of solute weighed</p>
              </div>
            )}
            {molarityTarget !== 'molarity' && (
              <div>
                <label htmlFor="sci-mol-target" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Target Molarity (M, mol/L) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-mol-target"
                  type="number"
                  step="any"
                  min={0.0001}
                  value={targetMolarityM}
                  onChange={(e) => setTargetMolarityM(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Desired concentration (mol/L)</p>
              </div>
            )}
            {molarityTarget !== 'volume' && (
              <div>
                <label htmlFor="sci-mol-vol" className="block text-sm font-extrabold text-[#152238] mb-2">
                  Solution Volume (L) <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="sci-mol-vol"
                  type="number"
                  step="any"
                  min={0.0001}
                  value={solutionVolumeL}
                  onChange={(e) => setSolutionVolumeL(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
                />
                <p className="text-xs text-[#64748B] mt-1">Total volume in liters (0.5 L = 500 mL)</p>
              </div>
            )}
            <div>
              <label htmlFor="sci-mol-mw" className="block text-sm font-extrabold text-[#152238] mb-2">
                Molar Mass (g/mol) <span className="text-[#E11D48]">*</span>
              </label>
              <input
                id="sci-mol-mw"
                type="number"
                step="any"
                min={0.01}
                value={molarMassGmol}
                onChange={(e) => setMolarMassGmol(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] tabular-nums focus:border-[#2457D6] focus:outline-none"
              />
              <p className="text-xs text-[#64748B] mt-1">NaCl = 58.44, Glucose = 180.16</p>
            </div>
          </div>
        </>
      )}

      {computed.errorMsg && (
        <div
          role="alert"
          className="rounded-xl bg-[#FEF2F2] border border-[#DC2626]/40 px-4 py-3 text-xs sm:text-sm font-semibold text-[#DC2626]"
        >
          {computed.errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
        <button
          type="button"
          onClick={() => {}}
          className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>Calculate Result</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Science', href: '/science' },
        { label: currentMeta.title },
      ]}
      title={currentMeta.title}
      subtitle={currentMeta.subtitle}
      heroSymbol={currentMeta.heroSymbol}
      heroBadgeBg="bg-[#EBF2FF]"
      heroBadgeColor="text-[#2457D6]"
      categoryName="Science"
      categoryHref="/science"
      otherCalculatorsTitle="Other Science & Lab Calculators"
      otherCalculators={SCIENCE_RELATED_LINKS}
      relatedCalculators={SCIENCE_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: computed.promptSummary,
        promptSuffix: 'is:',
        mainValue: computed.mainValue,
        equation: computed.equation,
        secondaryNote: computed.secondaryNote,
      }}
      formulaCard={currentMeta.formulaCard}
      howToUseSteps={currentMeta.howToUseSteps}
      howItWorks={currentMeta.howItWorks}
      understandingResult={{
        paragraph: (
          <>
            Your calculated result is{' '}
            <strong className="font-bold text-[#152238]">{computed.mainValue}</strong>.{' '}
            {computed.secondaryNote}
          </>
        ),
      }}
      faqs={currentMeta.faqs}
    />
  );
}
