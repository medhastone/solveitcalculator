export interface MathToolData {
  title: string;
  description: string;
  h1: string;
  seoMeta: {
    title: string;
    description: string;
    keywords: string;
  };
  overview: string;
  howToUse: string[];
  formula?: string;
  example?: {
    question: string;
    steps: string[];
    answer: string;
  };
  faqs: { q: string; a: string }[];
}

export const mathToolsData: Record<string, MathToolData> = {
  'quadratic-formula-solver-with-steps': {
    title: 'Quadratic Formula Solver with Steps',
    description: 'Solve quadratic equations step-by-step using the quadratic formula. Find real and complex roots, vertex, and discriminant easily.',
    h1: 'Quadratic Formula Solver with Steps',
    seoMeta: {
      title: 'Quadratic Formula Solver with Steps | Free Online Calculator',
      description: 'Use our free quadratic formula solver to find the roots of any quadratic equation. Get step-by-step solutions, vertex, and graph details.',
      keywords: 'quadratic formula solver, quadratic equation calculator, find roots, step by step math solver'
    },
    overview: 'The Quadratic Formula Solver is a powerful mathematical tool designed to find the roots of any quadratic equation in the form ax² + bx + c = 0. Whether you are dealing with real or complex roots, this solver provides a comprehensive step-by-step breakdown of the derivation process, making it an essential E-E-A-T verified resource for students and educators.',
    howToUse: [
      'Enter the coefficients a, b, and c from your quadratic equation.',
      'Click "Calculate Roots" to evaluate the equation.',
      'Review the discriminant (Δ) to understand the nature of the roots.',
      'Follow the step-by-step breakdown to see exactly how the quadratic formula is applied.'
    ],
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    example: {
      question: 'Solve for x: 2x² - 4x - 6 = 0',
      steps: [
        'Identify coefficients: a = 2, b = -4, c = -6',
        'Calculate the discriminant (Δ = b² - 4ac): (-4)² - 4(2)(-6) = 16 + 48 = 64',
        'Apply the formula: x = (4 ± √64) / 4',
        'Simplify: x = (4 ± 8) / 4',
        'Find the roots: x₁ = 12 / 4 = 3, x₂ = -4 / 4 = -1'
      ],
      answer: 'The roots are x = 3 and x = -1.'
    },
    faqs: [
      { q: 'What is the quadratic formula?', a: 'The quadratic formula is a closed-form expression used to find the solutions (or roots) of a quadratic equation of the form ax² + bx + c = 0.' },
      { q: 'What does the discriminant tell us?', a: 'The discriminant (b² - 4ac) indicates the nature of the roots. If Δ > 0, there are two real roots. If Δ = 0, there is one real root. If Δ < 0, there are two complex roots.' }
    ]
  },
  'polynomial-factoring-root-finder': {
    title: 'Polynomial Factoring & Root Finder',
    description: 'Factor polynomials and find their roots step-by-step. Supports rational root theorem and synthetic division techniques.',
    h1: 'Polynomial Factoring & Root Finder',
    seoMeta: {
      title: 'Polynomial Factoring Calculator | Find Roots Step-by-Step',
      description: 'Factor complex polynomials and find real or imaginary roots instantly. Free mathematical root finder with step-by-step synthetic division.',
      keywords: 'polynomial factoring, root finder, synthetic division, rational root theorem'
    },
    overview: 'Factoring polynomials can be tedious. This tool uses algebraic algorithms and the Rational Root Theorem to break down higher-degree polynomials into their simplest factored forms, identifying all x-intercepts accurately.',
    howToUse: [
      'Enter your polynomial expression (e.g., x^3 - 4x^2 + x + 6).',
      'Select the variable used (default is x).',
      'Click "Factor Polynomial".',
      'Review the factored form and the listed roots.'
    ],
    faqs: [
      { q: 'What is the Rational Root Theorem?', a: 'It is a theorem that provides a list of all possible rational roots of a polynomial equation, derived from the factors of the constant term divided by the factors of the leading coefficient.' }
    ]
  },
  'system-of-linear-equations-2x2-3x3': {
    title: 'System of Linear Equations (2x2, 3x3)',
    description: 'Solve systems of linear equations using substitution, elimination, or matrix formulas (Cramer\'s rule).',
    h1: 'System of Linear Equations Solver (2x2 & 3x3)',
    seoMeta: {
      title: 'System of Linear Equations Calculator | 2x2 & 3x3 Solver',
      description: 'Solve linear equation systems algebraically. Step-by-step matrix, elimination, and substitution methods.',
      keywords: 'system of linear equations, 3x3 matrix solver, 2x2 elimination, cramers rule'
    },
    overview: 'Solving multiple equations simultaneously is fundamental in algebra and linear algebra. This calculator handles 2-variable (2x2) and 3-variable (3x3) systems, offering solutions through matrix determinants (Cramer\'s Rule) and standard elimination.',
    howToUse: [
      'Select the system size (2x2 or 3x3).',
      'Input the coefficients for each variable and the constant term for each equation.',
      'Click "Solve System" to calculate the intersection point.'
    ],
    formula: 'For Ax = B, x = A⁻¹B',
    faqs: [
      { q: 'What does it mean if a system has no solution?', a: 'Geometrically, it means the lines or planes represented by the equations are parallel and never intersect. Algebraically, it results in a false statement like 0 = 5.' }
    ]
  }
};

export function getToolData(slug: string): MathToolData {
  if (mathToolsData[slug]) {
    return mathToolsData[slug];
  }
  
  // Generic Fallback for E-E-A-T
  const formattedName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: formattedName,
    description: `Free online ${formattedName} calculator. Get step-by-step solutions, formulas, and expert mathematical guidance.`,
    h1: formattedName,
    seoMeta: {
      title: `${formattedName} | Free Online Calculator & Solver`,
      description: `Use our highly accurate ${formattedName} to solve complex math problems instantly. Includes step-by-step explanations and formulas.`,
      keywords: `${formattedName.toLowerCase()}, calculator, math solver, step by step`
    },
    overview: `The ${formattedName} is an expert-level utility designed to provide accurate, step-by-step mathematical resolutions. Built for students, educators, and professionals, this tool adheres to rigorous mathematical standards to ensure trustworthy and deterministic results.`,
    howToUse: [
      'Input your mathematical parameters into the designated fields.',
      'Ensure all values are in the correct format or units.',
      'Click the calculate button to process the algorithm.',
      'Review the step-by-step derivation and final output.'
    ],
    faqs: [
      { q: `How accurate is the ${formattedName}?`, a: 'This tool uses deterministic mathematical algorithms and high-precision floating-point arithmetic to guarantee exact results for standard inputs.' },
      { q: 'Can I use this for homework or academic research?', a: 'Yes. The step-by-step breakdowns are specifically designed to serve as an educational aid and verification tool for academic work.' }
    ]
  };
}
