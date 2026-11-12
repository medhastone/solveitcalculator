import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title: 'Science Calculators: Physics, Chemistry & Lab | SolveIt',
  description:
    'Solve physics, chemistry, electrical, and laboratory problems with step-by-step formulas for Newton’s Second Law force, Ohm’s Law, molarity, density, and percent error.',
  alternates: {
    canonical: 'https://solveitcalculator.com/science',
  },
  openGraph: {
    title: 'Science Calculators: Physics, Chemistry & Lab | SolveIt',
    description:
      'Solve physics, chemistry, and lab equations with step-by-step SI formulas for force, Ohm’s Law, molarity, density, and percent error.',
    url: 'https://solveitcalculator.com/science',
    type: 'website',
  },
};

const SCIENCE_CONFIG: CategoryHubConfig = {
  id: 'science',
  breadcrumbLabel: 'Science',
  title: 'Science Calculators',
  shortTitle: 'Science',
  introduction:
    'Select a physics, chemistry, or laboratory tool below—solve for force, mass, or acceleration under Newton’s Second Law, compute voltage, current, resistance, and power in DC circuits, prepare molar solutions in the lab, or check your experimental percent error.',
  searchPlaceholder:
    'Find a science calculator (e.g. force, Ohm’s law, molarity, density, percent error...)',
  headerIconName: 'flask',
  heroBadgeTopLeft: 'F=ma',
  heroBadgeBottomLeft: 'V=IR',
  filters: [
    'All',
    'Physics & Circuits',
    'Chemistry & Matter',
    'Lab & Scientific Math',
  ],
  tools: [
    {
      id: 'force-mass-acceleration-calculator',
      name: 'Force Calculator (Newton’s Second Law F = m × a)',
      description:
        'Calculate net force in Newtons (N), mass in kilograms (kg), or acceleration in m/s² using F = m × a.',
      href: '/science/force-calculator',
      category: 'Physics & Circuits',
      displayBadge: 'Mechanics',
      iconName: 'gauge',
      symbolText: 'F=ma',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'ohms-law-power-calculator',
      name: 'Ohm’s Law & Electrical Power Calculator (V, I, R, Watts)',
      description:
        'Calculate voltage (Volts), current (Amps), resistance (Ohms Ω), and electrical power (Watts) from any two circuit values.',
      href: '/science/ohms-law-calculator',
      category: 'Physics & Circuits',
      displayBadge: 'Electronics',
      iconName: 'zap',
      symbolText: 'V=IR',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'molarity-solution-calculator',
      name: 'Molarity & Solution Concentration Calculator (M = mol ÷ L)',
      description:
        'Calculate molarity (mol/L), required solute mass in grams, or solution volume from molecular weight.',
      href: '/science/molarity-calculator',
      category: 'Chemistry & Matter',
      displayBadge: 'Chemistry',
      iconName: 'flask',
      symbolText: 'mol/L',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'density-mass-volume-calculator',
      name: 'Density, Mass & Volume Calculator (ρ = m ÷ V)',
      description:
        'Solve for material density (g/cm³ or kg/m³), mass, or displaced volume and compare against water buoyancy.',
      href: '/science/density-calculator',
      category: 'Chemistry & Matter',
      displayBadge: 'Matter & Fluids',
      iconName: 'atom',
      symbolText: 'ρ=m/V',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'percent-error-lab-calculator',
      name: 'Experimental Percent Error Calculator',
      description:
        'Measure laboratory accuracy by comparing your experimental measurement against the accepted theoretical value.',
      href: '/math/percent-error-calculator',
      category: 'Lab & Scientific Math',
      displayBadge: 'Lab Analysis',
      iconName: 'percent',
      symbolText: '%Err',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
      isPopular: true,
    },
    {
      id: 'scientific-function-calculator',
      name: 'Scientific Calculator (Trig, Exponents & Scientific Notation)',
      description:
        'Evaluate trigonometric functions (deg/rad), powers, roots, factorials, and multi-step scientific expressions.',
      href: '/math/scientific-calculator',
      category: 'Lab & Scientific Math',
      displayBadge: 'Scientific Math',
      iconName: 'calculator',
      symbolText: 'sin·xⁿ',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      id: 'logarithm-ph-scale-calculator',
      name: 'Logarithm Calculator (log₁₀, Natural ln & Base-b)',
      description:
        'Calculate base-10 logarithms, natural logs (ln), and custom bases used in pH chemistry, decibels, and half-life decay.',
      href: '/math/log-calculator',
      category: 'Lab & Scientific Math',
      displayBadge: 'Logs & Decay',
      iconName: 'flask',
      symbolText: 'log₁₀',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      id: 'kinematics-projectile-motion-calculator',
      name: 'Kinematics & Projectile Motion Calculator (SUVAT Equations)',
      description:
        'Solve for displacement, initial/final velocity, time of flight, and constant acceleration using the four kinematic equations.',
      href: '',
      category: 'Physics & Circuits',
      displayBadge: 'Kinematics',
      iconName: 'gauge',
      symbolText: 'SUVAT',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      isComingSoon: true,
    },
    {
      id: 'ideal-gas-law-calculator',
      name: 'Ideal Gas Law Calculator (PV = nRT)',
      description:
        'Calculate gas pressure (atm, kPa, bar), volume (L), moles (n), or Kelvin temperature (T) using the universal gas constant R.',
      href: '',
      category: 'Chemistry & Matter',
      displayBadge: 'Thermodynamics',
      iconName: 'atom',
      symbolText: 'PV=nRT',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      isComingSoon: true,
    },
  ],
  relatedCategories: [
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Unit Conversion Calculators',
      href: '/conversions',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Home & Construction',
      href: '/home-construction',
      iconName: 'home',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
    },
  ],
  chooseGuideHeading: 'Which science calculator should I use?',
  chooseSteps: [
    {
      step: 1,
      title: 'Force Calculator (F = ma) vs. Density Calculator (ρ = m/V)',
      description:
        'Use the Force Calculator when analyzing motion and acceleration in Newtons (1 N = 1 kg·m/s²). Use the Density Calculator when comparing how much mass is packed into a given volume (g/cm³ or kg/m³).',
    },
    {
      step: 2,
      title: 'Molarity Calculator vs. Density Calculator',
      description:
        'Both relate amount of substance to volume, but Density uses mass per volume (g/mL) for pure solids/liquids, while Molarity uses chemical moles of dissolved solute per liter of solution (mol/L) based on molecular weight.',
    },
    {
      step: 3,
      title: 'Ohm’s Law Calculator for Voltage, Current, Resistance & Power',
      description:
        'Use the Ohm’s Law Calculator whenever you know any two electrical values (Volts, Amps, Ohms, or Watts) and want to solve for the remaining two simultaneously using V = I × R and P = V × I.',
    },
    {
      step: 4,
      title: 'Percent Error Calculator for Lab Reports',
      description:
        'After finishing a physics or chemistry experiment, open the Percent Error Calculator to measure how close your experimental value came to the textbook theoretical value.',
    },
  ],
  matchingGuides: [
    {
      title: 'How to Convert Metric and Imperial Units Accurately',
      description:
        'Convert measurements into base SI units (meters, kilograms, seconds, Kelvin, and liters) before plugging into physics formulas.',
      href: '/guides/how-to-convert-metric-and-imperial-units',
    },
    {
      title: 'How to Calculate Percentage Change and Percent Error',
      description:
        'Compare experimental error formulas against standard percentage change equations with worked examples.',
      href: '/guides/how-to-calculate-percentage-change',
    },
  ],
  faqs: [
    {
      question: 'Why must I convert inputs to SI units before using F = m × a?',
      answer:
        'One Newton (N) is defined as exactly 1 kg·m/s². If your mass is in grams or pounds, or acceleration is in cm/s², convert to kilograms and meters per second squared first so the resulting force is in Newtons.',
    },
    {
      question: 'How do I calculate electrical power in Watts from Voltage and Resistance?',
      answer:
        'Combine Ohm’s Law (I = V ÷ R) with the power law (P = V × I) to get P = V² ÷ R, or P = I² × R. For example, a 12V circuit across a 4 Ω resistor draws 3 Amps and dissipates 36 Watts.',
    },
    {
      question: 'How do I calculate the grams of solute needed for a target molarity?',
      answer:
        'Multiply your desired Molarity (mol/L) by the solution Volume (in Liters) to get moles, then multiply moles by the compound’s molar mass (g/mol): Grams = Molarity × Liters × Molar Mass.',
    },
    {
      question: 'What is the difference between percent error and percentage change?',
      answer:
        'Percent error compares an experimental measurement to a known theoretical standard: (|Experimental − Theoretical| ÷ |Theoretical|) × 100. Percentage change measures how a value shifts over time from an old value to a new value.',
    },
    {
      question: 'How do I convert density from g/cm³ to kg/m³?',
      answer:
        'Multiply g/cm³ by 1,000 to get kg/m³. Pure water has a density of 1.00 g/cm³ (or 1.00 g/mL) at 4°C, which equals 1,000 kg/m³.',
    },
  ],
};

export default function ScienceCategoryPage() {
  return <CategoryHubPageClient config={SCIENCE_CONFIG} />;
}
