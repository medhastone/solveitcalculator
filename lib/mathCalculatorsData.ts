export type MathFilterCategory =
  | 'All'
  | 'Basic Math'
  | 'Percentages'
  | 'Fractions'
  | 'Ratios'
  | 'Algebra';

export type MathSymbolBadgeType =
  | 'percent'
  | 'bar-chart-green'
  | 'fraction-half'
  | 'ratio-nodes'
  | 'sigma'
  | 'scientific-calc'
  | 'sqrt-x'
  | 'exponent-x2'
  | 'abs-x'
  | 'lcm-gcd'
  | 'matrix-grid'
  | 'equation-x'
  | 'discount-tag';

export interface MathCalculatorItem {
  id: string;
  slug: string;
  name: string;
  category: Exclude<MathFilterCategory, 'All'>;
  displayBadge?: string;
  symbolType: MathSymbolBadgeType;
  iconName:
    | 'percent'
    | 'trending-up'
    | 'divide'
    | 'scale'
    | 'bar-chart'
    | 'calculator'
    | 'tag'
    | 'arrow-left-right'
    | 'superscript'
    | 'function-square'
    | 'grid'
    | 'sigma';
  description: string;
  commonUseCase: string;
  examplePrompt: string;
  formulaPreview: string;
  isPopular?: boolean;
  showInDirectory?: boolean;
  defaultInputs: {
    labelA: string;
    valueA: number;
    labelB: string;
    valueB: number;
    labelC?: string;
    valueC?: number;
    unitA?: string;
    unitB?: string;
  };
}

export const MATH_FILTER_CATEGORIES: MathFilterCategory[] = [
  'All',
  'Basic Math',
  'Percentages',
  'Fractions',
  'Ratios',
  'Algebra',
];

export const MATH_CALCULATORS: MathCalculatorItem[] = [
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'Percentages',
    displayBadge: 'Percentages',
    symbolType: 'percent',
    iconName: 'percent',
    description:
      'Calculate the percentage of a number, find percentage increase or decrease, and get clear results with step-by-step explanation.',
    commonUseCase: 'Tips, sales tax, test scores, and everyday proportions',
    examplePrompt: 'Find 25% of 200:',
    formulaPreview: 'Result = Percentage × Number ÷ 100',
    isPopular: true,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Percentage (%)',
      valueA: 25,
      labelB: 'Number',
      valueB: 200,
      unitA: '%',
      unitB: 'Number',
    },
  },
  {
    id: 'percentage-change-calculator',
    slug: 'percentage-change-calculator',
    name: 'Percentage Change Calculator',
    category: 'Percentages',
    displayBadge: 'Percentages',
    symbolType: 'bar-chart-green',
    iconName: 'trending-up',
    description:
      'Find the percentage increase or decrease between two values.',
    commonUseCase: 'Price changes, salary raises, utility bills, and revenue growth',
    examplePrompt: 'From 120 to 150 is a +25% increase',
    formulaPreview: 'Change % = ((New − Original) ÷ |Original|) × 100',
    isPopular: false,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Original Value',
      valueA: 120,
      labelB: 'New Value',
      valueB: 150,
    },
  },
  {
    id: 'fraction-calculator',
    slug: 'fraction-calculator',
    name: 'Fraction Calculator',
    category: 'Fractions',
    displayBadge: 'Fractions',
    symbolType: 'fraction-half',
    iconName: 'divide',
    description:
      'Add, subtract, multiply and divide fractions. Convert between fractions and decimals.',
    commonUseCase: 'Cooking measurements, woodworking dimensions, and school math',
    examplePrompt: '3/4 + 1/2 = 5/4 (1 1/4 or 1.25)',
    formulaPreview: 'a/b + c/d = (a·d + b·c) / (b·d)',
    isPopular: true,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'First Fraction Numerator (a/4)',
      valueA: 3,
      labelB: 'Second Fraction Numerator (c/4)',
      valueB: 2,
      labelC: 'Common Denominator',
      valueC: 4,
    },
  },
  {
    id: 'ratio-calculator',
    slug: 'ratio-calculator',
    name: 'Ratio Calculator',
    category: 'Ratios',
    displayBadge: 'Ratios',
    symbolType: 'ratio-nodes',
    iconName: 'scale',
    description:
      'Simplify ratios, find missing values and compare quantities.',
    commonUseCase: 'Recipe scaling, screen aspect ratios, and mixing proportions',
    examplePrompt: '16 : 9 scaled to width 1920 → height 1080',
    formulaPreview: 'A : B = C : X  ⇒  X = (B × C) ÷ A',
    isPopular: true,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Ratio Part A',
      valueA: 16,
      labelB: 'Ratio Part B',
      valueB: 9,
      labelC: 'Target Value for A',
      valueC: 1440,
    },
  },
  {
    id: 'average-calculator',
    slug: 'average-calculator',
    name: 'Average Calculator',
    category: 'Basic Math',
    displayBadge: 'Basic Math',
    symbolType: 'sigma',
    iconName: 'bar-chart',
    description:
      'Find the mean, median, mode and range of a set of numbers.',
    commonUseCase: 'Class grades, monthly household expenses, and sports scores',
    examplePrompt: 'Average of 78, 84, 92 is 84.67',
    formulaPreview: 'Mean = Sum of All Values ÷ Count of Values',
    isPopular: true,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'First Value',
      valueA: 78,
      labelB: 'Second Value',
      valueB: 84,
      labelC: 'Third Value',
      valueC: 93,
    },
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'Algebra',
    displayBadge: 'Algebra',
    symbolType: 'scientific-calc',
    iconName: 'calculator',
    description:
      'Perform advanced calculations with trigonometry, logarithms, exponents and more.',
    commonUseCase: 'High school and college math, physics, and engineering formulas',
    examplePrompt: '√(144) + 2³ = 20',
    formulaPreview: 'y = x^n, √x, log₁₀(x), ln(x), sin(θ), cos(θ)',
    isPopular: true,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Base Number (x)',
      valueA: 12,
      labelB: 'Exponent / Power (n)',
      valueB: 2,
    },
  },
  {
    id: 'square-root-calculator',
    slug: 'square-root-calculator',
    name: 'Square Root Calculator',
    category: 'Basic Math',
    displayBadge: 'Basic Math',
    symbolType: 'sqrt-x',
    iconName: 'superscript',
    description:
      'Find the square root of a number and solve related problems.',
    commonUseCase: 'Geometry side lengths, area measurements, and radical simplification',
    examplePrompt: '√144 = 12',
    formulaPreview: '√x = y  where  y × y = x',
    isPopular: true,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Number (x)',
      valueA: 144,
      labelB: 'Root Degree (2 = Square Root)',
      valueB: 2,
    },
  },
  {
    id: 'exponent-calculator',
    slug: 'exponent-calculator',
    name: 'Exponent Calculator',
    category: 'Algebra',
    displayBadge: 'Algebra',
    symbolType: 'exponent-x2',
    iconName: 'superscript',
    description:
      'Calculate powers, exponents and scientific notation.',
    commonUseCase: 'Compound growth math, powers of 10, and polynomial expressions',
    examplePrompt: '2¹⁰ = 1,024',
    formulaPreview: 'x^n = x × x × ... (n times)',
    isPopular: false,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Base Number (x)',
      valueA: 2,
      labelB: 'Exponent / Power (n)',
      valueB: 10,
    },
  },
  {
    id: 'absolute-value-calculator',
    slug: 'absolute-value-calculator',
    name: 'Absolute Value Calculator',
    category: 'Basic Math',
    displayBadge: 'Basic Math',
    symbolType: 'abs-x',
    iconName: 'function-square',
    description:
      'Find the absolute value of a number and solve expressions.',
    commonUseCase: 'Distance between numbers, error tolerances, and magnitude checks',
    examplePrompt: '|-42.5| = 42.5',
    formulaPreview: '|x| = x if x ≥ 0, and −x if x < 0',
    isPopular: false,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'First Value (x)',
      valueA: -42.5,
      labelB: 'Second Value (y) for |x − y|',
      valueB: 18,
    },
  },
  {
    id: 'gcd-and-lcm-calculator',
    slug: 'gcd-and-lcm-calculator',
    name: 'GCD and LCM Calculator',
    category: 'Basic Math',
    displayBadge: 'Number Theory',
    symbolType: 'lcm-gcd',
    iconName: 'grid',
    description:
      'Find the greatest common divisor (GCD) and least common multiple (LCM) for two or more numbers.',
    commonUseCase: 'Finding common denominators for fractions and scheduling intervals',
    examplePrompt: 'For 12 and 18: GCD = 6, LCM = 36',
    formulaPreview: 'LCM(a, b) = (|a × b|) ÷ GCD(a, b)',
    isPopular: false,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'First Whole Number',
      valueA: 12,
      labelB: 'Second Whole Number',
      valueB: 18,
    },
  },
  {
    id: 'matrix-calculator',
    slug: 'matrix-calculator',
    name: 'Matrix Calculator',
    category: 'Algebra',
    displayBadge: 'Algebra',
    symbolType: 'matrix-grid',
    iconName: 'grid',
    description:
      'Perform matrix operations like addition, multiplication and find the inverse.',
    commonUseCase: 'Linear algebra systems, 2×2 determinants, and matrix transformations',
    examplePrompt: 'det([4, 2; 3, 5]) = 14',
    formulaPreview: 'det(A) = a·d − b·c  for a 2×2 matrix [[a, b], [c, d]]',
    isPopular: false,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Diagonal Product (a × d)',
      valueA: 20,
      labelB: 'Off-Diagonal Product (b × c)',
      valueB: 6,
      labelC: 'Scalar Multiplier (k)',
      valueC: 2,
    },
  },
  {
    id: 'equation-solver',
    slug: 'equation-solver',
    name: 'Equation Solver',
    category: 'Algebra',
    displayBadge: 'Algebra',
    symbolType: 'equation-x',
    iconName: 'function-square',
    description:
      'Solve linear and quadratic equations step by step.',
    commonUseCase: 'Algebra coursework, finding unknown variables, and quadratic roots',
    examplePrompt: 'x² − 5x + 6 = 0  ⇒  x = 2 and x = 3',
    formulaPreview: 'x = [−b ± √(b² − 4ac)] ÷ (2a)',
    isPopular: false,
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Coefficient a (x²)',
      valueA: 1,
      labelB: 'Coefficient b (x)',
      valueB: -5,
      labelC: 'Constant c',
      valueC: 6,
    },
  },
  // Additional linked calculators so all homepage and internal links resolve cleanly
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'Percentages',
    displayBadge: 'Percentages',
    symbolType: 'discount-tag',
    iconName: 'tag',
    description:
      'Find the final price after a percentage discount, total money saved, and optional sales tax on retail purchases.',
    commonUseCase: 'Store sales, promotional coupons, and seasonal markdowns',
    examplePrompt: '$85.00 item at 20% off costs $68.00 (Save $17.00)',
    formulaPreview: 'Sale Price = Original Price × (1 − Discount % ÷ 100)',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Original Price ($)',
      valueA: 85,
      labelB: 'Discount (%)',
      valueB: 20,
      unitA: '$',
      unitB: '%',
    },
  },
  {
    id: 'fraction-to-decimal-calculator',
    slug: 'fraction-to-decimal-calculator',
    name: 'Fraction to Decimal & Percent Converter',
    category: 'Fractions',
    displayBadge: 'Fractions',
    symbolType: 'fraction-half',
    iconName: 'arrow-left-right',
    description:
      'Convert any proper, improper, or mixed fraction into its exact decimal and percentage representation with long-division steps.',
    commonUseCase: 'Converting inch rulers (3/8") to decimals (0.375) and percentages',
    examplePrompt: '3 / 8 = 0.375 = 37.5%',
    formulaPreview: 'Decimal = Numerator ÷ Denominator ; Percent = Decimal × 100',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Numerator (Top Number)',
      valueA: 3,
      labelB: 'Denominator (Bottom Number)',
      valueB: 8,
    },
  },
  {
    id: 'proportion-calculator',
    slug: 'proportion-calculator',
    name: 'Proportion & Cross-Multiplication Calculator',
    category: 'Ratios',
    displayBadge: 'Ratios',
    symbolType: 'ratio-nodes',
    iconName: 'scale',
    description:
      'Solve for the unknown variable X in two equal fractions (A/B = C/X) using step-by-step cross-multiplication.',
    commonUseCase: 'Map distances, dosage scaling, and currency or unit estimates',
    examplePrompt: 'If 3 items cost $12, then 7 items cost $28',
    formulaPreview: 'A / B = C / X  ⇒  X = (B × C) ÷ A',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Known Quantity A',
      valueA: 3,
      labelB: 'Known Cost / Result B',
      valueB: 12,
      labelC: 'Target Quantity C',
      valueC: 7,
    },
  },
  {
    id: 'quadratic-equation-calculator',
    slug: 'quadratic-equation-calculator',
    name: 'Quadratic Equation Solver',
    category: 'Algebra',
    displayBadge: 'Algebra',
    symbolType: 'equation-x',
    iconName: 'function-square',
    description:
      'Solve second-degree polynomial equations (ax² + bx + c = 0) using the quadratic formula and inspect the discriminant and vertex.',
    commonUseCase: 'Algebra coursework, projectile motion, and area optimization',
    examplePrompt: 'x² − 5x + 6 = 0  ⇒  x = 2 and x = 3',
    formulaPreview: 'x = [−b ± √(b² − 4ac)] ÷ (2a)',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Coefficient a (x²)',
      valueA: 1,
      labelB: 'Coefficient b (x)',
      valueB: -5,
      labelC: 'Constant c',
      valueC: 6,
    },
  },
  {
    id: 'percentage-to-decimal-calculator',
    slug: 'percentage-to-decimal-calculator',
    name: 'Percentage to Decimal Calculator',
    category: 'Percentages',
    displayBadge: 'Percentages',
    symbolType: 'percent',
    iconName: 'arrow-left-right',
    description:
      'Convert any percentage value into its exact decimal form and see the step-by-step division by 100.',
    commonUseCase: 'Interest rate formulas, tax rates, and spreadsheet equations',
    examplePrompt: '25% = 0.25',
    formulaPreview: 'Decimal = Percentage ÷ 100',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Percentage (%)',
      valueA: 25,
      labelB: 'Decimal Places (Precision)',
      valueB: 4,
      unitA: '%',
    },
  },
  {
    id: 'percentage-to-fraction-calculator',
    slug: 'percentage-to-fraction-calculator',
    name: 'Percentage to Fraction Calculator',
    category: 'Percentages',
    displayBadge: 'Percentages',
    symbolType: 'fraction-half',
    iconName: 'divide',
    description:
      'Convert any percentage into a simplified fraction or mixed number in lowest terms.',
    commonUseCase: 'School math, recipe ratios, and measurement conversions',
    examplePrompt: '25% = 25/100 = 1/4',
    formulaPreview: 'Fraction = Percentage / 100 (simplified by GCD)',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Percentage (%)',
      valueA: 25,
      labelB: 'Scale Factor',
      valueB: 100,
      unitA: '%',
    },
  },
  {
    id: 'percent-error-calculator',
    slug: 'percent-error-calculator',
    name: 'Percent Error Calculator',
    category: 'Percentages',
    displayBadge: 'Lab & Science',
    symbolType: 'percent',
    iconName: 'percent',
    description:
      'Measure laboratory accuracy by comparing your experimental measurement against the accepted theoretical value.',
    commonUseCase: 'Chemistry, physics, and biology lab accuracy checks',
    examplePrompt: 'Experimental 9.8 vs Theoretical 10.0 = 2% error',
    formulaPreview: 'Percent Error = (|Experimental − Theoretical| ÷ |Theoretical|) × 100',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Experimental Value',
      valueA: 9.8,
      labelB: 'Theoretical Value',
      valueB: 10,
    },
  },
  {
    id: 'log-calculator',
    slug: 'log-calculator',
    name: 'Logarithm Calculator (log₁₀, ln & Base-b)',
    category: 'Algebra',
    displayBadge: 'Algebra',
    symbolType: 'scientific-calc',
    iconName: 'function-square',
    description:
      'Calculate common logarithms (base 10), natural logarithms (base e), and custom bases used in algebra, pH, and decibels.',
    commonUseCase: 'Algebra, pH scale chemistry, decibels, and exponential growth',
    examplePrompt: 'log₁₀(1000) = 3',
    formulaPreview: 'log_b(x) = ln(x) ÷ ln(b)',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'Number (x)',
      valueA: 1000,
      labelB: 'Logarithm Base (b)',
      valueB: 10,
    },
  },
  {
    id: 'mean-median-mode-calculator',
    slug: 'mean-median-mode-calculator',
    name: 'Mean, Median, Mode & Range Calculator',
    category: 'Basic Math',
    displayBadge: 'Statistics',
    symbolType: 'sigma',
    iconName: 'bar-chart',
    description:
      'Analyze datasets and laboratory trials by finding the arithmetic mean, median, mode, sum, and spread.',
    commonUseCase: 'Statistics homework, test scores, and experimental data analysis',
    examplePrompt: 'Mean of 78, 84, 93 is 85',
    formulaPreview: 'Mean = Sum of Values ÷ Count of Values',
    showInDirectory: true,
    defaultInputs: {
      labelA: 'First Value',
      valueA: 78,
      labelB: 'Second Value',
      valueB: 84,
      labelC: 'Third Value',
      valueC: 93,
    },
  },
];

export interface MathCalculationOutput {
  headlineResult: string;
  secondaryNote: string;
  steps: string[];
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function computeMathToolResult(
  slug: string,
  a: number,
  b: number,
  c = 1
): MathCalculationOutput {
  switch (slug) {
    case 'percentage-calculator': {
      const result = (a * b) / 100;
      const reversePct = b !== 0 ? (a / b) * 100 : 0;
      return {
        headlineResult: `${Number(result.toFixed(4)).toLocaleString()}`,
        secondaryNote: `${a}% of ${b.toLocaleString()} = ${Number(result.toFixed(4)).toLocaleString()} (Also: ${a} is ${reversePct.toFixed(2)}% of ${b.toLocaleString()})`,
        steps: [
          `Result = ${a} × ${b} ÷ 100`,
          `Result = ${Number((a * b).toFixed(4))} ÷ 100`,
          `Result = ${Number(result.toFixed(4))}`,
        ],
      };
    }
    case 'percentage-to-decimal-calculator': {
      const dec = a / 100;
      const places = Math.min(8, Math.max(1, Math.round(b || 4)));
      return {
        headlineResult: `${Number(dec.toFixed(places))}`,
        secondaryNote: `${a}% expressed as a decimal is ${Number(dec.toFixed(places))}.`,
        steps: [
          `Divide the percentage by 100: ${a} ÷ 100 = ${Number(dec.toFixed(places))}.`,
          `Move the decimal point two places to the left: ${a}% = ${Number(dec.toFixed(places))}.`,
        ],
      };
    }
    case 'percentage-to-fraction-calculator': {
      const num = Math.round(a * 100);
      const den = 10000;
      const g = gcd(num, den);
      const simpNum = num / g;
      const simpDen = den / g;
      return {
        headlineResult: `${simpNum}/${simpDen}`,
        secondaryNote: `${a}% = ${a}/100 = ${simpNum}/${simpDen} in lowest terms (Decimal: ${(a / 100).toFixed(4)}).`,
        steps: [
          `Write the percentage over 100: ${a} / 100.`,
          `Divide top and bottom by their Greatest Common Divisor to simplify: ${simpNum}/${simpDen}.`,
        ],
      };
    }
    case 'percentage-change-calculator': {
      if (a === 0) {
        return {
          headlineResult: 'Original value cannot be 0',
          secondaryNote: 'Enter a non-zero starting number to compute percentage change.',
          steps: ['Division by zero is undefined when the starting value is 0.'],
        };
      }
      const diff = b - a;
      const pct = (diff / Math.abs(a)) * 100;
      const direction = diff >= 0 ? 'increase' : 'decrease';
      return {
        headlineResult: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}% (${direction} of ${Math.abs(diff).toLocaleString()})`,
        secondaryNote: `Moving from ${a.toLocaleString()} to ${b.toLocaleString()} changes the value by ${diff >= 0 ? '+' : ''}${diff.toLocaleString()}.`,
        steps: [
          `Find the difference: New (${b}) − Original (${a}) = ${diff}.`,
          `Divide by the original value: ${diff} ÷ ${Math.abs(a)} = ${(diff / Math.abs(a)).toFixed(4)}.`,
          `Multiply by 100 to express as a percentage: ${pct.toFixed(2)}% ${direction}.`,
        ],
      };
    }
    case 'fraction-calculator': {
      const denom = c > 0 ? Math.round(c) : 4;
      const numSum = Math.round(a) + Math.round(b);
      const divisor = gcd(numSum, denom);
      const simpNum = numSum / divisor;
      const simpDen = denom / divisor;
      const dec = numSum / denom;
      return {
        headlineResult: `${Math.round(a)}/${denom} + ${Math.round(b)}/${denom} = ${simpNum}/${simpDen} (${dec.toFixed(4)})`,
        secondaryNote:
          simpNum >= simpDen && simpDen > 1
            ? `Mixed number: ${Math.floor(simpNum / simpDen)} ${simpNum % simpDen}/${simpDen}`
            : `Decimal equivalent: ${dec.toFixed(4)} (${(dec * 100).toFixed(2)}%)`,
        steps: [
          `Add numerators over common denominator ${denom}: (${Math.round(a)} + ${Math.round(b)}) / ${denom} = ${numSum}/${denom}.`,
          `Divide top and bottom by their Greatest Common Factor (${divisor}): ${simpNum}/${simpDen}.`,
        ],
      };
    }
    case 'ratio-calculator':
    case 'proportion-calculator': {
      const safeA = a !== 0 ? a : 1;
      const g = gcd(safeA, b);
      const scaledB = (b * c) / safeA;
      return {
        headlineResult: `${safeA} : ${b} = ${c} : ${Number(scaledB.toFixed(2))}`,
        secondaryNote: `Simplified base ratio: ${safeA / g} : ${b / g} (Multiplier: ${(c / safeA).toFixed(2)}×)`,
        steps: [
          `Set up the proportion: ${safeA} / ${b} = ${c} / X.`,
          `Cross-multiply and divide: X = (${b} × ${c}) ÷ ${safeA} = ${Number(scaledB.toFixed(4))}.`,
        ],
      };
    }
    case 'average-calculator':
    case 'mean-median-mode-calculator': {
      const nums = [a, b, c];
      const sum = a + b + c;
      const mean = sum / 3;
      const sorted = [...nums].sort((x, y) => x - y);
      const median = sorted[1];
      const range = sorted[2] - sorted[0];
      return {
        headlineResult: `Mean (Average) = ${mean.toFixed(2)}`,
        secondaryNote: `Sum = ${sum.toLocaleString()} · Median = ${median} · Range = ${range}`,
        steps: [
          `Add all values together: ${a} + ${b} + ${c} = ${sum}.`,
          `Divide by the count of numbers (3): ${sum} ÷ 3 = ${mean.toFixed(4)}.`,
        ],
      };
    }
    case 'percent-error-calculator': {
      const safeTheo = b !== 0 ? Math.abs(b) : 1;
      const absErr = Math.abs(a - b);
      const pctErr = (absErr / safeTheo) * 100;
      return {
        headlineResult: `Percent Error = ${Number(pctErr.toFixed(4))}%`,
        secondaryNote: `Absolute Error |${a} − ${b}| = ${Number(absErr.toFixed(4))}`,
        steps: [
          `Find absolute error: |${a} − ${b}| = ${Number(absErr.toFixed(4))}.`,
          `Divide by theoretical value and multiply by 100: (${Number(absErr.toFixed(4))} ÷ ${safeTheo}) × 100 = ${Number(pctErr.toFixed(4))}%.`,
        ],
      };
    }
    case 'log-calculator': {
      const safeX = a > 0 ? a : 1;
      const safeBase = b > 0 && b !== 1 ? b : 10;
      const logVal = Math.log(safeX) / Math.log(safeBase);
      const lnVal = Math.log(safeX);
      return {
        headlineResult: `log_${safeBase}(${safeX}) = ${Number(logVal.toFixed(6))}`,
        secondaryNote: `Natural log ln(${safeX}) = ${Number(lnVal.toFixed(6))} · log₁₀(${safeX}) = ${Number(Math.log10(safeX).toFixed(6))}`,
        steps: [
          `Apply change-of-base formula: log_${safeBase}(${safeX}) = ln(${safeX}) ÷ ln(${safeBase}).`,
          `Result = ${Number(lnVal.toFixed(6))} ÷ ${Number(Math.log(safeBase).toFixed(6))} = ${Number(logVal.toFixed(6))}.`,
        ],
      };
    }
    case 'square-root-calculator': {
      const nonNeg = Math.max(0, a);
      const deg = b !== 0 ? b : 2;
      const rootVal = Math.pow(nonNeg, 1 / deg);
      return {
        headlineResult: `√${nonNeg.toLocaleString()} = ${Number(Math.sqrt(nonNeg).toFixed(6))}`,
        secondaryNote: `${deg}-th root of ${nonNeg.toLocaleString()} = ${Number(rootVal.toFixed(6))} · Square (${nonNeg}²) = ${(nonNeg * nonNeg).toLocaleString()}`,
        steps: [
          `Find the principal square root y such that y × y = ${nonNeg}: √${nonNeg} = ${Number(Math.sqrt(nonNeg).toFixed(6))}.`,
          `Compute the ${deg}-th root using fractional exponent: ${nonNeg}^(1/${deg}) = ${Number(rootVal.toFixed(6))}.`,
        ],
      };
    }
    case 'absolute-value-calculator': {
      const absA = Math.abs(a);
      const absDiff = Math.abs(a - b);
      return {
        headlineResult: `|${a}| = ${absA.toLocaleString()}`,
        secondaryNote: `Distance |${a} − ${b}| = ${absDiff.toLocaleString()} · |${b}| = ${Math.abs(b).toLocaleString()}`,
        steps: [
          `Remove the negative sign to find distance from zero: |${a}| = ${absA}.`,
          `Compute absolute difference between ${a} and ${b}: |${a} − (${b})| = |${a - b}| = ${absDiff}.`,
        ],
      };
    }
    case 'matrix-calculator': {
      const det = a - b;
      const scaledDet = det * c;
      return {
        headlineResult: `Determinant det(A) = ${det.toLocaleString()}`,
        secondaryNote:
          det !== 0
            ? `Matrix is invertible (det ≠ 0) · Scaled Determinant (k=${c}): ${scaledDet.toLocaleString()}`
            : 'Matrix is singular (det = 0, no inverse exists)',
        steps: [
          `Subtract off-diagonal product (${b}) from main diagonal product (${a}): ${a} − ${b} = ${det}.`,
          det !== 0
            ? `Multiply determinant by scalar factor ${c}: ${det} × ${c} = ${scaledDet}.`
            : `Because det(A) = 0, the matrix rows are linearly dependent.`,
        ],
      };
    }
    case 'discount-calculator': {
      const saved = a * (b / 100);
      const finalPrice = a - saved;
      return {
        headlineResult: `Final Price: $${finalPrice.toFixed(2)} (You Save $${saved.toFixed(2)})`,
        secondaryNote: `${b}% off $${a.toFixed(2)} reduces the price by $${saved.toFixed(2)}.`,
        steps: [
          `Calculate discount savings: $${a.toFixed(2)} × (${b} ÷ 100) = $${saved.toFixed(2)}.`,
          `Subtract savings from original price: $${a.toFixed(2)} − $${saved.toFixed(2)} = $${finalPrice.toFixed(2)}.`,
        ],
      };
    }
    case 'fraction-to-decimal-calculator': {
      const safeDenom = b !== 0 ? b : 1;
      const dec = a / safeDenom;
      const pct = dec * 100;
      const g = gcd(a, safeDenom);
      return {
        headlineResult: `${a}/${safeDenom} = ${Number(dec.toFixed(6))} (${Number(pct.toFixed(4))}%)`,
        secondaryNote: `Lowest terms fraction: ${Math.round(a) / g}/${Math.round(safeDenom) / g}`,
        steps: [
          `Divide the numerator (${a}) by the denominator (${safeDenom}): ${a} ÷ ${safeDenom} = ${Number(dec.toFixed(6))}.`,
          `Multiply by 100 to convert to a percentage: ${Number(dec.toFixed(6))} × 100 = ${Number(pct.toFixed(4))}%.`,
        ],
      };
    }
    case 'gcd-and-lcm-calculator':
    case 'gcf-lcm-calculator': {
      const intA = Math.max(1, Math.abs(Math.round(a)));
      const intB = Math.max(1, Math.abs(Math.round(b)));
      const g = gcd(intA, intB);
      const lcm = (intA * intB) / g;
      return {
        headlineResult: `GCD = ${g}  ·  LCM = ${lcm.toLocaleString()}`,
        secondaryNote: `For numbers ${intA} and ${intB}: greatest common divisor is ${g}; least common multiple is ${lcm.toLocaleString()}.`,
        steps: [
          `Find Greatest Common Divisor of ${intA} and ${intB} via Euclidean algorithm: GCD = ${g}.`,
          `Calculate Least Common Multiple: (${intA} × ${intB}) ÷ ${g} = ${lcm.toLocaleString()}.`,
        ],
      };
    }
    case 'equation-solver':
    case 'quadratic-equation-calculator':
    case 'quadratic-equation-solver': {
      const safeA = a !== 0 ? a : 1;
      const disc = b * b - 4 * safeA * c;
      if (disc < 0) {
        const realPart = (-b / (2 * safeA)).toFixed(2);
        const imagPart = (Math.sqrt(-disc) / (2 * safeA)).toFixed(2);
        return {
          headlineResult: `Complex Roots: x = ${realPart} ± ${imagPart}i`,
          secondaryNote: `Discriminant (b² − 4ac) = ${disc} (negative, so no real x-intercepts).`,
          steps: [
            `Compute discriminant Δ = (${b})² − 4(${safeA})(${c}) = ${disc}.`,
            `Since Δ < 0, roots are complex conjugates: ${realPart} ± ${imagPart}i.`,
          ],
        };
      }
      const x1 = (-b + Math.sqrt(disc)) / (2 * safeA);
      const x2 = (-b - Math.sqrt(disc)) / (2 * safeA);
      return {
        headlineResult: `x₁ = ${Number(x1.toFixed(4))} ,  x₂ = ${Number(x2.toFixed(4))}`,
        secondaryNote: `Discriminant Δ = ${disc} · Vertex at x = ${Number((-b / (2 * safeA)).toFixed(4))}`,
        steps: [
          `Compute discriminant Δ = (${b})² − 4(${safeA})(${c}) = ${disc}.`,
          `Apply quadratic formula: x = [${-b} ± √${disc}] ÷ ${2 * safeA}.`,
        ],
      };
    }
    case 'scientific-calculator':
    case 'exponent-calculator':
    case 'exponent-root-calculator':
    default: {
      const powerVal = Math.pow(a, b);
      const rootVal = a >= 0 && b !== 0 ? Math.pow(a, 1 / b) : NaN;
      return {
        headlineResult: `${a}^${b} = ${Number.isFinite(powerVal) ? powerVal.toLocaleString(undefined, { maximumFractionDigits: 6 }) : 'Overflow'}`,
        secondaryNote: Number.isFinite(rootVal)
          ? `Root equivalent: ${b}√${a} = ${rootVal.toFixed(4)} · √${a} = ${Math.sqrt(Math.max(0, a)).toFixed(4)}`
          : `Square root of |${a}| = ${Math.sqrt(Math.abs(a)).toFixed(4)}`,
        steps: [
          `Raise base (${a}) to exponent (${b}): ${a}^${b} = ${Number(powerVal.toFixed(6))}.`,
          Number.isFinite(rootVal)
            ? `Compute ${b}-th root of ${a}: ${a}^(1/${b}) = ${rootVal.toFixed(4)}.`
            : `Log₁₀(|${a}|) = ${Math.log10(Math.max(1, Math.abs(a))).toFixed(4)}.`,
        ],
      };
    }
  }
}

export const RELATED_CATEGORIES = [
  {
    name: 'Finance Calculators',
    path: '/finance',
    description: 'Loans, mortgages, compound interest, savings, and tax estimators.',
  },
  {
    name: 'Unit Conversion',
    path: '/conversions',
    description: 'Convert length, weight, volume, temperature, and area measurements.',
  },
  {
    name: 'Date & Time Calculators',
    path: '/date-difference-calculator',
    description: 'Exact age, days between dates, and time duration calculators.',
  },
  {
    name: 'Health & Fitness Calculators',
    path: '/bmi-calculator',
    description: 'Body mass index (BMI), daily calorie needs, and health ranges.',
  },
  {
    name: 'Business Calculators',
    path: '/finance/business',
    description: 'Gross profit margin, retail markup, and break-even unit volume.',
  },
  {
    name: 'Science Calculators',
    path: '/math/scientific-calculator',
    description: 'Trigonometry, logarithms, exponents, and scientific notation.',
  },
];

export const MATH_CHOOSE_STEPS = [
  {
    step: 1,
    title: 'Identify your calculation',
    description:
      'Choose the type of math problem you want to solve (e.g., percentage, fraction, ratio, algebra).',
  },
  {
    step: 2,
    title: 'Enter your values',
    description: 'Input the required numbers and click calculate.',
  },
  {
    step: 3,
    title: 'Open the calculator',
    description: 'Click on the calculator from the list above.',
  },
  {
    step: 4,
    title: 'Review the result',
    description:
      'See the answer with a clear explanation and formula (where available).',
  },
];

export const MATH_CHOOSE_GUIDE = [
  {
    question: 'Working with discounts, tips, tax, or price changes?',
    recommendation: 'Use the Percentage Calculator or Percentage Change Calculator',
    explanation:
      'Choose the Percentage Calculator when you know the percent and want the dollar or number amount (such as a 15% tip or 8% tax). Choose the Percentage Change Calculator when you have a "before" and "after" number and want to know how much it grew or shrank.',
    targetSlug: 'percentage-calculator',
    secondarySlug: 'percentage-change-calculator',
  },
  {
    question: 'Splitting measurements, recipes, or ruler dimensions?',
    recommendation: 'Use the Fraction Calculator or Ratio Calculator',
    explanation:
      'Choose the Fraction Calculator when adding or subtracting parts of a whole (like 3/4 cup plus 1/2 cup, or 5/8 inch lumber). Choose the Ratio Calculator when scaling two linked quantities up or down together (like doubling a 2:3 recipe or resizing a 16:9 photo).',
    targetSlug: 'fraction-calculator',
    secondarySlug: 'ratio-calculator',
  },
  {
    question: 'Summarizing a list of grades, bills, or measurements?',
    recommendation: 'Use the Average Calculator',
    explanation:
      'Enter your numbers to see the arithmetic mean (typical average), median (middle value that ignores extreme outliers), and total sum in one step.',
    targetSlug: 'average-calculator',
  },
  {
    question: 'Solving exponents, roots, or algebra equations?',
    recommendation: 'Use the Scientific Calculator or Equation Solver',
    explanation:
      'Use the Scientific Calculator for square roots, powers, and trigonometry, or open the Equation Solver to find exact roots for linear and quadratic equations.',
    targetSlug: 'scientific-calculator',
    secondarySlug: 'equation-solver',
  },
];

export const MATH_FAQS = [
  {
    question: 'What is a percentage calculator?',
    answer:
      'A percentage calculator finds a given percent of a number, determines what percentage one number is of another, or calculates the percentage increase or decrease between two values. For example, 15% of 240 is (15 ÷ 100) × 240 = 36.',
  },
  {
    question: 'How do I calculate percentage increase or decrease between two numbers?',
    answer:
      'Subtract the original number from the new number, divide that difference by the original number, and multiply by 100: ((New − Old) ÷ Old) × 100. For example, going from 80 to 100 is ((100 − 80) ÷ 80) × 100 = +25% increase.',
  },
  {
    question: 'How do I convert a fraction to a decimal and a percentage?',
    answer:
      'Divide the top number (numerator) by the bottom number (denominator). For example, to convert 3/8 to a decimal, divide 3 by 8 to get 0.375. Multiply that decimal by 100 to get the percentage (37.5%).',
  },
  {
    question: 'What is the difference between GCD and LCM?',
    answer:
      'The Greatest Common Divisor (GCD) is the largest whole number that divides two or more numbers without a remainder (for 12 and 18, the GCD is 6). The Least Common Multiple (LCM) is the smallest positive number that is a multiple of both numbers (for 12 and 18, the LCM is 36).',
  },
  {
    question: 'How do you solve a ratio or proportion with a missing value (A:B = C:X)?',
    answer:
      'Use cross-multiplication: multiply the diagonal pair of known numbers and divide by the remaining known number. In 2 : 5 = 6 : X, multiply 5 × 6 = 30, then divide by 2 to get X = 15.',
  },
  {
    question: 'What is the difference between mean, median, and mode?',
    answer:
      'The mean is the arithmetic average (sum of values divided by count). The median is the middle value when numbers are sorted in order, which resists extreme outliers. The mode is the value that occurs most frequently in the dataset.',
  },
  {
    question: 'Can I use the scientific calculator for trigonometry and logarithms?',
    answer:
      'Yes. The Scientific Calculator supports trigonometric functions (sine, cosine, tangent in both Degrees and Radians), common and natural logarithms (log and ln), powers, roots, factorials, and parentheses with step-by-step formulas.',
  },
  {
    question: 'Are these math calculators free to use for homework and exams?',
    answer:
      'Yes. Every calculator on SolveItCalculator.com is 100% free to use, requires no registration or download, and shows the underlying mathematical formula and worked steps on desktop, tablet, and mobile devices.',
  },
];

