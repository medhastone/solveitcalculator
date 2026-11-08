import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title:
    'Science & Engineering Calculators — Physics, Chemistry, Molarity & Ohm’s Law | SolveItCalculator',
  description:
    'Free science, physics, and chemistry calculators for molarity, solution dilution, Ohm’s law, kinematics, percent error, logarithms, and SI laboratory unit conversions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/science',
  },
  openGraph: {
    title:
      'Science & Laboratory Calculators — Physics, Chemistry & Electrical Tools | SolveItCalculator',
    description:
      'Solve physics, chemistry, and laboratory problems with step-by-step formulas, reference tables, and instant SI unit conversions.',
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
    'Solve physics, chemistry, and laboratory problems with step-by-step clarity. Calculate percent error, scientific functions, logarithms, exponents, and SI unit conversions.',
  searchPlaceholder: 'Find a science calculator',
  headerIconName: 'flask',
  heroBadgeTopLeft: 'E=mc²',
  heroBadgeBottomLeft: 'mol',
  filters: [
    'All',
    'Scientific Functions',
    'Lab & Chemistry',
    'Physics & Motion',
    'Exponents & Logs',
    'SI Unit Conversion',
  ],
  tools: [
    {
      id: 'scientific-calculator',
      name: 'Scientific Calculator',
      description:
        'Evaluate trigonometry (sin, cos, tan), logarithms, powers, factorials, roots, and constants like π and e.',
      href: '/math/scientific-calculator',
      category: 'Scientific Functions',
      displayBadge: 'Scientific Math',
      iconName: 'flask',
      symbolText: 'f(x)',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'percent-error-calculator',
      name: 'Percent Error Calculator (Experimental vs. Theoretical)',
      description:
        'Measure laboratory accuracy by comparing your experimental measurement against the accepted theoretical value.',
      href: '/math/percent-error-calculator',
      category: 'Lab & Chemistry',
      displayBadge: 'Lab & Chemistry',
      iconName: 'percent',
      symbolText: '|%e|',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
      isPopular: true,
    },
    {
      id: 'exponent-power-calculator',
      name: 'Exponent & Scientific Power Calculator',
      description:
        'Compute positive, negative, and fractional exponents (xⁿ) and orders of magnitude for scientific notation.',
      href: '/math/exponent-calculator',
      category: 'Exponents & Logs',
      displayBadge: 'Exponents & Logs',
      iconName: 'atom',
      symbolText: 'xⁿ',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'logarithm-ph-scale-calculator',
      name: 'Logarithm Calculator (log₁₀, ln & Base-b)',
      description:
        'Calculate common logarithms (base 10), natural logarithms (base e), and custom bases used in pH, decibels, and half-life.',
      href: '/math/log-calculator',
      category: 'Exponents & Logs',
      displayBadge: 'Exponents & Logs',
      iconName: 'calculator',
      symbolText: 'log',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'si-unit-measurement-converter',
      name: 'SI & Metric Unit Converter (Mass, Temperature, Energy)',
      description:
        'Convert Kelvin, Celsius, Joules, Pascals, meters, kilograms, and liters for physics and chemistry problems.',
      href: '/unit-converter',
      category: 'SI Unit Conversion',
      displayBadge: 'SI Units',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'density-calculator',
      name: 'Density, Mass & Volume Calculator (ρ = m ÷ V)',
      description:
        'Calculate density in g/cm³ and kg/m³, or solve for unknown mass or volume with water buoyancy comparison.',
      href: '/science/density-calculator',
      category: 'Lab & Chemistry',
      displayBadge: 'Lab & Chemistry',
      iconName: 'flask',
      symbolText: 'ρ',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'force-calculator',
      name: 'Force Calculator (Newton’s Second Law F = m × a)',
      description:
        'Calculate net force in Newtons (N), mass in kg, or acceleration in m/s² with lbf and g-force conversions.',
      href: '/science/force-calculator',
      category: 'Physics & Motion',
      displayBadge: 'Physics & Motion',
      iconName: 'atom',
      symbolText: 'F=ma',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'ohms-law-calculator',
      name: "Ohm's Law & Electrical Power Calculator (V = I × R)",
      description:
        'Solve for Voltage (V), Current (I), Resistance (Ω), and active Power dissipation in Watts (W).',
      href: '/science/ohms-law-calculator',
      category: 'Physics & Motion',
      displayBadge: 'Physics & Motion',
      iconName: 'zap',
      symbolText: 'Ω',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'molarity-calculator',
      name: 'Molarity & Solution Concentration Calculator',
      description:
        'Calculate solution molarity (mol/L), required solute mass in grams, or total solution volume from molar mass.',
      href: '/science/molarity-calculator',
      category: 'Lab & Chemistry',
      displayBadge: 'Lab & Chemistry',
      iconName: 'flask',
      symbolText: 'mol/L',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'quadratic-kinematics-solver',
      name: 'Quadratic Equation & Projectile Trajectory Solver',
      description:
        'Solve second-degree equations (ax² + bx + c = 0) commonly used in projectile motion and chemical equilibrium.',
      href: '/math/quadratic-equation-solver',
      category: 'Physics & Motion',
      displayBadge: 'Physics & Motion',
      iconName: 'atom',
      symbolText: 'x²',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'square-root-radical-calculator',
      name: 'Square Root & Principal Radical Calculator',
      description:
        'Calculate exact and decimal square roots (√x) for root-mean-square speed, standard deviation, and vector magnitudes.',
      href: '/math/square-root-calculator',
      category: 'Scientific Functions',
      displayBadge: 'Scientific Math',
      iconName: 'calculator',
      symbolText: '√x',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      id: 'statistical-dataset-analyzer',
      name: 'Experimental Data Mean, Median & Range Calculator',
      description:
        'Analyze repeated laboratory trials by finding the sample mean, median, mode, and spread.',
      href: '/math/mean-median-mode-calculator',
      category: 'Lab & Chemistry',
      displayBadge: 'Lab & Chemistry',
      iconName: 'bar-chart',
      symbolText: 'Σ',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
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
      name: 'Unit Conversion',
      href: '/unit-conversion',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Date & Time Calculators',
      href: '/date-time',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF0F0]',
      iconColor: 'text-[#E11D48]',
    },
    {
      name: 'Home & Construction',
      href: '/home-construction',
      iconName: 'home',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Finance Calculators',
      href: '/finance',
      iconName: 'coins',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
  ],
  chooseGuideHeading: 'How to choose the right science calculator',
  chooseSteps: [
    {
      step: 1,
      title: 'Identify your scientific task',
      description:
        'Decide whether you are evaluating a trig/log expression, checking lab percent error, or converting SI units.',
    },
    {
      step: 2,
      title: 'Verify unit consistency',
      description:
        'Make sure all measurements are converted to consistent SI base units (meters, kilograms, seconds, Kelvin) before calculating.',
    },
    {
      step: 3,
      title: 'Open the calculator',
      description:
        'Select the matching scientific or lab calculator from the directory list above.',
    },
    {
      step: 4,
      title: 'Review the formula & steps',
      description:
        'Check the step-by-step substitution to verify significant figures and equation setup.',
    },
  ],
  faqs: [
    {
      question: 'How do you calculate percent error in a chemistry or physics lab?',
      answer:
        'Subtract the theoretical (accepted) value from your experimental value, take the absolute value, divide by the theoretical value, and multiply by 100: |Experimental − Theoretical| ÷ |Theoretical| × 100%.',
    },
    {
      question: 'Should I use degrees or radians in the Scientific Calculator?',
      answer:
        'Use degrees (DEG) when working with geometric angles, navigation, or surveying measured in degrees (0° to 360°), and switch to radians (RAD) when solving calculus, harmonic motion, or angular velocity equations.',
    },
    {
      question: 'What is the difference between log (base 10) and ln (natural log)?',
      answer:
        'The common logarithm (log or log₁₀) uses base 10 and is used in pH, Richter, and decibel scales. The natural logarithm (ln) uses Euler’s constant e (≈ 2.71828) and is used in radioactive decay, reaction kinetics, and continuous compounding.',
    },
    {
      question: 'How do I convert Celsius to Kelvin for gas law equations?',
      answer:
        'Add 273.15 to the Celsius temperature (K = °C + 273.15). Absolute zero is 0 K, which equals −273.15 °C. Always use Kelvin when applying the Ideal Gas Law (PV = nRT).',
    },
    {
      question: 'How do you calculate molarity (M) from grams and milliliters?',
      answer:
        'First divide the solute mass in grams by its molar mass (g/mol) to find moles. Next convert the solution volume from milliliters to liters (mL ÷ 1,000). Finally divide moles by liters: M = moles ÷ liters.',
    },
    {
      question: 'How do Ohm’s Law and electrical power formulas work together?',
      answer:
        'Ohm’s Law states that Voltage equals Current times Resistance (V = I × R). Electrical power in watts equals Voltage times Current (P = V × I), which can also be written as P = I²R or P = V² ÷ R.',
    },
    {
      question: 'How is radioactive half-life or exponential decay calculated?',
      answer:
        'Remaining quantity after elapsed time t is N(t) = N₀ × (1/2)^(t ÷ t₁/₂), where N₀ is the initial amount and t₁/₂ is the half-life period. After 3 half-lives, (1/2)³ = 1/8 (12.5%) of the original sample remains.',
    },
    {
      question: 'What are the rules for significant figures in scientific calculations?',
      answer:
        'When multiplying or dividing, round the final result to match the measurement with the fewest significant figures. When adding or subtracting, round to the least precise decimal place.',
    },
  ],
};

export default function ScienceCategoryPage() {
  return <CategoryHubPageClient config={SCIENCE_CONFIG} />;
}
