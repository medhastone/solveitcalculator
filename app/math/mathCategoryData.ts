export interface MathToolItem {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  path: string;
  icon: string;
  keywords: string[];
  formula?: string;
  supportsSteps?: boolean;
}

export interface MathCategory {
  id: string;
  name: string;
  icon: string;
  desc: string;
  tools: {
    name: string;
    desc: string;
    path: string;
  }[];
}

export interface MathGoal {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tools: {
    name: string;
    desc: string;
    path: string;
  }[];
}

export interface MathFormulaItem {
  name: string;
  category: string;
  formula: string;
  latex: string;
  variables: { symbol: string; meaning: string }[];
  whenToUse: string;
  calculatorPath: string;
  calculatorName: string;
  explanation: string;
}

export interface QuickAnswerExample {
  id: string;
  question: string;
  answer: string;
  topic: string;
  steps: {
    stepNumber: number;
    title: string;
    content: string;
    mathExpression?: string;
  }[];
  calculatorPath: string;
  calculatorName: string;
}

export interface ConceptComparison {
  id: string;
  title: string;
  termA: string;
  termB: string;
  definitionA: string;
  definitionB: string;
  keyDifference: string;
  example: string;
  whenToUse: string;
  calculatorPath: string;
  calculatorName: string;
}

export interface MathGuide {
  title: string;
  desc: string;
  readTime: string;
  topic: string;
  calculatorPath: string;
  calculatorName: string;
}

export interface MathFaq {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// 1. POPULAR MATH TOOLS (8 Core High-Value Calculators)
// ---------------------------------------------------------------------------
export const POPULAR_MATH_TOOLS: MathToolItem[] = [
  {
    id: 'scientific',
    name: 'Scientific Calculator',
    shortDesc: 'Evaluate algebraic expressions, trigonometry (deg/rad), powers, roots, and logarithms.',
    category: 'Basic Math & Algebra',
    path: '/scientific-calculator',
    icon: 'calculate',
    keywords: ['scientific calculator', 'trig', 'sin', 'cos', 'tan', 'log', 'ln', 'square root', 'powers'],
    supportsSteps: true,
  },
  {
    id: 'fraction',
    name: 'Fraction Calculator',
    shortDesc: 'Add, subtract, multiply, divide, and simplify fractions with exact common denominators.',
    category: 'Fractions',
    path: '#quick-answers',
    icon: 'pie_chart',
    keywords: ['fraction calculator', 'simplify fraction', 'add fractions', 'mixed numbers', 'lcd'],
    supportsSteps: true,
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    shortDesc: 'Calculate percent of a number, percentage increase/decrease, and relative difference.',
    category: 'Percentages',
    path: '/percentage-calculator',
    icon: 'percent',
    keywords: ['percentage calculator', 'percent change', 'percent difference', 'discount', 'markup'],
    supportsSteps: true,
  },
  {
    id: 'quadratic',
    name: 'Quadratic Equation Solver',
    shortDesc: 'Solve ax² + bx + c = 0 using the quadratic formula with real or complex roots and vertex steps.',
    category: 'Algebra',
    path: '/math/quadratic-formula-solver-with-steps',
    icon: 'variable_add',
    keywords: ['quadratic formula', 'quadratic solver', 'discriminant', 'parabola vertex', 'polynomial roots'],
    supportsSteps: true,
  },
  {
    id: 'pythagorean',
    name: 'Pythagorean Theorem Calculator',
    shortDesc: 'Calculate missing triangle sides (a² + b² = c²), perimeter, area, and acute angles.',
    category: 'Geometry & Triangles',
    path: '#interactive-visuals',
    icon: 'change_history',
    keywords: ['pythagorean theorem', 'hypotenuse', 'right triangle', 'a2 b2 c2', 'triangle solver'],
    supportsSteps: true,
  },
  {
    id: 'gcf-lcm',
    name: 'GCF & LCM Calculator',
    shortDesc: 'Find the greatest common factor and least common multiple using prime factorization.',
    category: 'Number Theory',
    path: '#math-categories',
    icon: 'tag',
    keywords: ['gcf', 'lcm', 'greatest common factor', 'least common multiple', 'prime factors'],
    supportsSteps: true,
  },
  {
    id: 'statistics',
    name: 'Statistics Calculator',
    shortDesc: 'Compute sample and population mean, median, mode, variance, standard deviation, and IQR.',
    category: 'Statistics & Probability',
    path: '/math/standard-deviation-calculator',
    icon: 'bar_chart',
    keywords: ['statistics calculator', 'standard deviation', 'mean', 'median', 'mode', 'variance', 'iqr'],
    supportsSteps: true,
  },
  {
    id: 'unit-conversion',
    name: 'Unit Conversion Calculator',
    shortDesc: 'Convert metric and imperial units across length, area, volume, mass, speed, and temperature.',
    category: 'Applied Math',
    path: '/conversion',
    icon: 'sync_alt',
    keywords: ['unit converter', 'metric to imperial', 'length converter', 'area converter', 'mass converter'],
    supportsSteps: false,
  },
];

// ---------------------------------------------------------------------------
// 2. MATH CATEGORIES (11 Structured Topics from Prompt)
// ---------------------------------------------------------------------------
export const MATH_CATEGORIES: MathCategory[] = [
  {
    id: 'basic-math',
    name: 'Basic Math',
    icon: 'calculate',
    desc: 'Foundational arithmetic, standard long division, rounding, factors, multiples, and formal order of operations.',
    tools: [
      { name: 'Arithmetic Calculator', desc: 'Addition, subtraction, multiplication, and division with decimal precision.', path: '/scientific-calculator' },
      { name: 'Order of Operations (PEMDAS/BODMAS)', desc: 'Parentheses, exponents, multiplication, division, addition, subtraction.', path: '/scientific-calculator' },
      { name: 'Rounding & Significant Figures', desc: 'Round to nearest decimal places, whole numbers, or significant digits.', path: '/scientific-calculator' },
      { name: 'Factors & Multiples Finder', desc: 'List all positive and negative factors and multiples for any integer.', path: '#interactive-visuals' },
      { name: 'Absolute Value & Number Line', desc: 'Compute absolute difference and geometric distance on the real number line.', path: '/scientific-calculator' },
    ],
  },
  {
    id: 'fractions',
    name: 'Fractions',
    icon: 'pie_chart',
    desc: 'Perform exact fraction arithmetic, find least common denominators, and convert between mixed and improper fractions.',
    tools: [
      { name: 'Fraction Simplifier & Reducer', desc: 'Reduce fractions to their simplest rational form using GCF.', path: '#quick-answers' },
      { name: 'Add & Subtract Fractions', desc: 'Compute common denominators and exact fractional sums and differences.', path: '#quick-answers' },
      { name: 'Multiply & Divide Fractions', desc: 'Direct multiplication of numerators and cross-multiplication for division.', path: '#quick-answers' },
      { name: 'Mixed Numbers to Improper Fractions', desc: 'Convert whole-and-fraction mixed numbers into single improper fractions.', path: '#quick-answers' },
      { name: 'Fraction to Decimal & Percentage', desc: 'Convert rational fractions into exact decimals and percentage values.', path: '/percentage-calculator' },
    ],
  },
  {
    id: 'percentages',
    name: 'Percentages',
    icon: 'percent',
    desc: 'Calculate baseline percentages, percentage change, symmetric percent difference, markups, and discounts.',
    tools: [
      { name: 'Percentage of a Number', desc: 'Quickly find what percentage X is of Y or calculate P% of any value.', path: '/percentage-calculator' },
      { name: 'Percent Change (% Increase/Decrease)', desc: 'Calculate relative change from initial to final value over time.', path: '/percentage-calculator' },
      { name: 'Percent Difference (Symmetric Base)', desc: 'Compare two positive values using their average as the denominator.', path: '/percentage-calculator' },
      { name: 'Discount & Sales Tax Calculator', desc: 'Apply retail store discounts, coupons, and regional sales taxes.', path: '/percentage-calculator' },
      { name: 'Markup & Profit Margin Ratio', desc: 'Calculate wholesale markup percentage vs. retail gross profit margin.', path: '/percentage-calculator' },
      { name: 'Percentage Points Difference', desc: 'Calculate the absolute arithmetic difference between two percentage rates.', path: '/percentage-calculator' },
    ],
  },
  {
    id: 'algebra',
    name: 'Algebra',
    icon: 'variable_add',
    desc: 'Solve linear systems, quadratic equations, high-degree polynomials, exponents, and logarithmic functions.',
    tools: [
      { name: 'Linear Equations Solver', desc: 'Solve single-variable equations in the form ax + b = c with full steps.', path: '/math/system-of-linear-equations-2x2-3x3' },
      { name: 'Quadratic Equation Solver', desc: 'Find real and complex roots, vertex coordinates, and discriminant analysis.', path: '/math/quadratic-formula-solver-with-steps' },
      { name: 'Polynomial Factoring & Root Finder', desc: 'Factor polynomials and identify rational roots using synthetic division.', path: '/math/polynomial-factoring-root-finder' },
      { name: 'System of Linear Equations (2x2, 3x3)', desc: 'Solve simultaneous linear equations via substitution or elimination.', path: '/math/system-of-linear-equations-2x2-3x3' },
      { name: 'Exponents & Radical Simplifier', desc: 'Simplify rational powers, radicals, surds, and scientific notation.', path: '/scientific-calculator' },
      { name: 'Logarithms & Natural Log (ln)', desc: 'Compute base-10, base-2, and natural logarithms with change of base.', path: '/scientific-calculator' },
    ],
  },
  {
    id: 'geometry',
    name: 'Geometry',
    icon: 'square_foot',
    desc: 'Calculate area, perimeter, surface area, and volume for 2D polygons and 3D solids, plus coordinate geometry.',
    tools: [
      { name: '2D Area & Perimeter Calculator', desc: 'Squares, rectangles, triangles, parallelograms, trapezoids, and circles.', path: '#interactive-visuals' },
      { name: 'Circle, Radius & Sector Area', desc: 'Compute radius, diameter, circumference, arc length, and sector area.', path: '#interactive-visuals' },
      { name: '3D Volume & Surface Area', desc: 'Prisms, cylinders, cones, pyramids, and spheres with step-by-step formulas.', path: '#interactive-visuals' },
      { name: 'Coordinate Distance & Midpoint', desc: 'Find Cartesian distance, midpoint, and segment slope between two points.', path: '#interactive-visuals' },
      { name: 'Polygon Angles & Triangles', desc: 'Calculate interior and exterior angle sums for regular and irregular polygons.', path: '#interactive-visuals' },
    ],
  },
  {
    id: 'trigonometry',
    name: 'Trigonometry',
    icon: 'incomplete_circle',
    desc: 'Evaluate circular trig functions (sin, cos, tan), angle conversions, unit circle coordinates, and oblique triangle laws.',
    tools: [
      { name: 'Sine, Cosine & Tangent Calculator', desc: 'Compute trigonometric ratios in both degree (°) and radian (rad) modes.', path: '/scientific-calculator' },
      { name: 'Interactive Unit Circle Explorer', desc: 'Visualize terminal side angles, (x, y) coordinates, and exact radical values.', path: '#interactive-visuals' },
      { name: 'Right Triangle & Hypotenuse Solver', desc: 'Solve right triangles using SOH-CAH-TOA and the Pythagorean theorem.', path: '#interactive-visuals' },
      { name: 'Law of Sines (AAS, ASA, SSA)', desc: 'Solve oblique triangles and explore the ambiguous SSA case.', path: '#formula-library' },
      { name: 'Law of Cosines (SAS, SSS)', desc: 'Solve triangles when three sides or two sides and the included angle are given.', path: '#formula-library' },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistics & Probability',
    icon: 'bar_chart',
    desc: 'Compute central tendency, dispersion metrics, normal distribution z-scores, probability, and combinatorial counts.',
    tools: [
      { name: 'Mean, Median, Mode & Range', desc: 'Descriptive summary statistics for ungrouped discrete and continuous data.', path: '/math/standard-deviation-calculator' },
      { name: 'Standard Deviation & Variance', desc: 'Calculate sample (n-1) and population (N) variance and standard deviation.', path: '/math/standard-deviation-calculator' },
      { name: 'Normal Distribution & Z-Score', desc: 'Convert raw values to z-scores and find cumulative normal curve probabilities.', path: '#interactive-visuals' },
      { name: 'Permutations & Combinations (nPr, nCr)', desc: 'Calculate ordered permutations and unordered combinations with factorials.', path: '#formula-library' },
      { name: 'Probability & Odds Calculator', desc: 'Calculate single-event, compound, and conditional probabilities.', path: '#quick-answers' },
    ],
  },
  {
    id: 'ratios-proportions',
    name: 'Ratios & Proportions',
    icon: 'aspect_ratio',
    desc: 'Simplify mathematical ratios, solve proportional statements, calculate unit rates, and scale dimensions.',
    tools: [
      { name: 'Ratio Simplifier & Formatter', desc: 'Reduce ratios of two or three terms to lowest integer terms.', path: '#quick-answers' },
      { name: 'Proportion Solver (a/b = c/d)', desc: 'Solve for the missing fourth variable in equivalent ratios.', path: '#quick-answers' },
      { name: 'Unit Rate & Pricing Comparison', desc: 'Determine cost per unit, speed, and comparative consumer rates.', path: '/percentage-calculator' },
      { name: 'Scale Factor & Dimension Scaler', desc: 'Scale architectural blueprints, maps, models, and image aspect ratios.', path: '#quick-answers' },
      { name: 'Direct & Inverse Variation', desc: 'Model y = kx and y = k/x relationships and find the constant of variation.', path: '#formula-library' },
    ],
  },
  {
    id: 'number-theory',
    name: 'Number Theory',
    icon: 'tag',
    desc: 'Identify prime numbers, calculate prime factorization trees, modular arithmetic, and greatest common factors.',
    tools: [
      { name: 'Greatest Common Factor (GCF)', desc: 'Determine the highest shared divisor using Euclidean division algorithms.', path: '#quick-answers' },
      { name: 'Least Common Multiple (LCM)', desc: 'Find the lowest shared multiple for two, three, or more integers.', path: '#quick-answers' },
      { name: 'Prime Factorization Tree', desc: 'Decompose composite numbers into unique prime factors with exponents.', path: '#quick-answers' },
      { name: 'Modular Arithmetic & Remainder', desc: 'Calculate a mod b, modular congruence, and clock arithmetic remainders.', path: '/scientific-calculator' },
      { name: 'Prime Number Validator & List', desc: 'Test whether a number is prime or composite using deterministic checks.', path: '#quick-answers' },
    ],
  },
  {
    id: 'sequences-calculus',
    name: 'Sequences, Series & Calculus',
    icon: 'all_inclusive',
    desc: 'Progressions, arithmetic and geometric series sums, finite limits, derivatives, and integral approximations.',
    tools: [
      { name: 'Arithmetic Sequence (Nth Term & Sum)', desc: 'Calculate explicit terms, common difference (d), and partial sums.', path: '#formula-library' },
      { name: 'Geometric Sequence & Series Sum', desc: 'Compute common ratio (r), nth term, and infinite convergent sums (|r| < 1).', path: '#formula-library' },
      { name: 'Limit Evaluator (Left, Right, Two-Sided)', desc: 'Analyze function limits approaching finite points or infinity.', path: '#formula-library' },
      { name: 'Derivative Rules & Power Rule', desc: 'Calculate first and higher-order derivatives for polynomial and power terms.', path: '#formula-library' },
      { name: 'Definite Integral Approximator', desc: 'Approximate area under curve using Riemann midpoint and trapezoidal rules.', path: '#formula-library' },
    ],
  },
  {
    id: 'grades-study',
    name: 'Grades & Study',
    icon: 'grade',
    desc: 'Calculate college and high school GPAs, weighted assignment averages, final exam score targets, and pacing.',
    tools: [
      { name: 'Cumulative GPA Calculator (4.0 & 5.0)', desc: 'Calculate unweighted and honors/AP weighted grade point averages.', path: '#quick-answers' },
      { name: 'Weighted Course Grade Calculator', desc: 'Calculate overall semester grade factoring test, homework, and quiz weights.', path: '#quick-answers' },
      { name: 'Final Exam Target Score Solver', desc: 'Find the exact score needed on your final exam to achieve a target letter grade.', path: '#quick-answers' },
      { name: 'Attendance & Class Pacing Tracker', desc: 'Calculate minimum required attendance percentage for academic credit.', path: '#quick-answers' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. WHAT ARE YOU WORKING ON? (6 Goal-Oriented Everyday Categories)
// ---------------------------------------------------------------------------
export const MATH_GOALS: MathGoal[] = [
  {
    id: 'homework',
    title: 'HOMEWORK & CLASSWORK',
    desc: 'Check step-by-step solutions for assignments in fractions, equations, geometry proofs, and statistics.',
    icon: 'assignment',
    tools: [
      { name: 'Fraction Simplifier', desc: 'Step-by-step reduction to simplest rational form.', path: '#quick-answers' },
      { name: 'Linear Equations Solver', desc: 'Solve algebraic single-variable linear equations.', path: '/math/system-of-linear-equations-2x2-3x3' },
      { name: 'Pythagorean Theorem', desc: 'Calculate hypotenuse, leg lengths, and right triangle areas.', path: '#interactive-visuals' },
      { name: 'Standard Deviation Tool', desc: 'Full step variance and standard deviation breakdown.', path: '/math/standard-deviation-calculator' },
      { name: 'Trigonometry Table & Units', desc: 'Look up sin, cos, and tan with exact radical values.', path: '/scientific-calculator' },
    ],
  },
  {
    id: 'everyday-math',
    title: 'EVERYDAY MATH',
    desc: 'Fast, practical calculations for shopping discounts, tip splits, fuel economy, and percentage changes.',
    icon: 'shopping_bag',
    tools: [
      { name: 'Percentage Calculator', desc: 'Calculate percent of a value, discounts, and markups.', path: '/percentage-calculator' },
      { name: 'Percent Change Calculator', desc: 'Determine percent increase or decrease between two values.', path: '/percentage-calculator' },
      { name: 'Unit Price & Comparison', desc: 'Compare price per ounce, gram, or liter to find the best deal.', path: '/percentage-calculator' },
      { name: 'Averages Calculator', desc: 'Calculate arithmetic mean and running averages quickly.', path: '/math/standard-deviation-calculator' },
      { name: 'Unit Converter', desc: 'Convert length, area, volume, mass, and temperature.', path: '/conversion' },
    ],
  },
  {
    id: 'algebra',
    title: 'ALGEBRA',
    desc: 'Work through linear systems, quadratic equations, polynomial factoring, and logarithmic expressions.',
    icon: 'functions',
    tools: [
      { name: 'Quadratic Equation Solver', desc: 'Solve ax² + bx + c = 0 with complete discriminant steps.', path: '/math/quadratic-formula-solver-with-steps' },
      { name: 'Polynomial Factoring', desc: 'Factor polynomials and find rational roots.', path: '/math/polynomial-factoring-root-finder' },
      { name: 'System of Linear Equations', desc: 'Solve 2x2 and 3x3 simultaneous linear systems.', path: '/math/system-of-linear-equations-2x2-3x3' },
      { name: 'Exponents & Radicals', desc: 'Simplify rational powers, cube roots, and surds.', path: '/scientific-calculator' },
      { name: 'Logarithm Calculator', desc: 'Compute base-10, natural ln, and arbitrary base logs.', path: '/scientific-calculator' },
    ],
  },
  {
    id: 'geometry',
    title: 'GEOMETRY',
    desc: 'Calculate spatial dimensions, perimeter, area, 3D volume, angles, and coordinate plane metrics.',
    icon: 'architecture',
    tools: [
      { name: 'Area & Perimeter Calculator', desc: 'Formulas for polygons, circles, and irregular shapes.', path: '#interactive-visuals' },
      { name: 'Circle & Arc Length', desc: 'Compute radius, circumference, and circular sector area.', path: '#interactive-visuals' },
      { name: '3D Volume & Surface Area', desc: 'Prisms, cylinders, cones, pyramids, and spheres.', path: '#interactive-visuals' },
      { name: 'Coordinate Distance & Slope', desc: 'Find distance, midpoint, and slope between (x₁, y₁) and (x₂, y₂).', path: '#interactive-visuals' },
      { name: 'Triangle Solver', desc: 'Right triangles, Pythagorean theorem, and Law of Cosines.', path: '#interactive-visuals' },
    ],
  },
  {
    id: 'data-stats',
    title: 'DATA & STATISTICS',
    desc: 'Analyze quantitative datasets, compute standard deviation, find z-scores, and calculate probabilities.',
    icon: 'query_stats',
    tools: [
      { name: 'Mean, Median & Mode', desc: 'Measures of central tendency for ungrouped data.', path: '/math/standard-deviation-calculator' },
      { name: 'Standard Deviation & Variance', desc: 'Sample (n-1) and population (N) dispersion metrics.', path: '/math/standard-deviation-calculator' },
      { name: 'Normal Distribution Curve', desc: 'Z-score probability calculations and percentile lookup.', path: '#interactive-visuals' },
      { name: 'Permutations & Combinations', desc: 'Factorial counting rules for ordered and unordered sets.', path: '#formula-library' },
      { name: 'Interquartile Range (IQR)', desc: 'First quartile, third quartile, and outlier boundaries.', path: '/math/standard-deviation-calculator' },
    ],
  },
  {
    id: 'advanced-math',
    title: 'ADVANCED MATH',
    desc: 'Explore calculus limits, derivative rules, series summation, vectors, and modular arithmetic.',
    icon: 'psychology',
    tools: [
      { name: 'Derivative Evaluator', desc: 'Differentiate polynomial, trigonometric, and power functions.', path: '#formula-library' },
      { name: 'Limit Evaluator', desc: 'Evaluate one-sided and two-sided limits as x approaches c.', path: '#formula-library' },
      { name: 'Arithmetic & Geometric Sequences', desc: 'Nth term formulas and infinite series summation.', path: '#formula-library' },
      { name: 'Modular Arithmetic', desc: 'Modulus division, congruence classes, and remainder theorem.', path: '/scientific-calculator' },
      { name: 'Vector Distance & Magnitude', desc: '2D and 3D Euclidean vector magnitude and dot product.', path: '#interactive-visuals' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 4. MATH FORMULA LIBRARY (17 Standard Formulations with Variables & LaTeX)
// ---------------------------------------------------------------------------
export const MATH_FORMULAS: MathFormulaItem[] = [
  {
    name: 'Quadratic Formula',
    category: 'Algebra',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    variables: [
      { symbol: 'a', meaning: 'Quadratic coefficient (coefficient of x², a ≠ 0)' },
      { symbol: 'b', meaning: 'Linear coefficient (coefficient of x)' },
      { symbol: 'c', meaning: 'Constant numerical term' },
      { symbol: 'b² - 4ac', meaning: 'Discriminant (Δ): >0 (2 real roots), =0 (1 real root), <0 (2 complex roots)' },
    ],
    whenToUse: 'Use to find the exact roots (x-intercepts) of any quadratic equation in standard form ax² + bx + c = 0.',
    calculatorPath: '/math/quadratic-formula-solver-with-steps',
    calculatorName: 'Quadratic Formula Solver',
    explanation: 'Derived by completing the square on the general quadratic equation ax² + bx + c = 0. It provides the exact algebraic solutions for all degree-2 polynomials.',
  },
  {
    name: 'Pythagorean Theorem',
    category: 'Geometry',
    formula: 'a² + b² = c²',
    latex: 'a^2 + b^2 = c^2',
    variables: [
      { symbol: 'a', meaning: 'Length of one perpendicular leg of the right triangle' },
      { symbol: 'b', meaning: 'Length of the second perpendicular leg' },
      { symbol: 'c', meaning: 'Length of the hypotenuse (side opposite the 90° right angle)' },
    ],
    whenToUse: 'Use to find the missing side length of any right triangle when the lengths of the other two sides are known.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Pythagorean Calculator',
    explanation: 'A cornerstone of Euclidean geometry stating that the area of the square whose side is the hypotenuse equals the sum of the areas of the squares on the other two legs.',
  },
  {
    name: 'Law of Sines',
    category: 'Trigonometry',
    formula: 'a / sin(A) = b / sin(B) = c / sin(C)',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
    variables: [
      { symbol: 'a, b, c', meaning: 'Side lengths of the oblique triangle' },
      { symbol: 'A, B, C', meaning: 'Opposite interior angles corresponding to sides a, b, c' },
    ],
    whenToUse: 'Use to solve non-right (oblique) triangles when two angles and one side (AAS or ASA) or two sides and a non-included angle (SSA) are known.',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Scientific Calculator',
    explanation: 'Relates the ratios of the lengths of sides to the sines of their opposite angles in any planar triangle. Useful for surveying and navigation.',
  },
  {
    name: 'Law of Cosines',
    category: 'Trigonometry',
    formula: 'c² = a² + b² - 2ab · cos(C)',
    latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)',
    variables: [
      { symbol: 'a, b', meaning: 'Lengths of the two known adjacent sides' },
      { symbol: 'c', meaning: 'Length of the unknown opposite side' },
      { symbol: 'C', meaning: 'Interior angle enclosed between sides a and b' },
    ],
    whenToUse: 'Use to solve any oblique triangle when two sides and the included angle (SAS) are known, or when all three sides (SSS) are known.',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Scientific Calculator',
    explanation: 'A general generalization of the Pythagorean theorem applicable to any planar triangle. When angle C = 90°, cos(90°) = 0, reducing exactly to a² + b² = c².',
  },
  {
    name: 'Distance Formula (2D Cartesian)',
    category: 'Geometry',
    formula: 'd = √((x₂ - x₁)² + (y₂ - y₁)²)',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    variables: [
      { symbol: '(x₁, y₁)', meaning: 'Coordinates of the first point' },
      { symbol: '(x₂, y₂)', meaning: 'Coordinates of the second point' },
      { symbol: 'd', meaning: 'Straight-line Euclidean distance between the points' },
    ],
    whenToUse: 'Use to determine the exact straight-line geometric distance between any two coordinate pairs on a 2D Cartesian plane.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Coordinate Geometry Tool',
    explanation: 'Derived directly from the Pythagorean theorem by treating the horizontal difference (Δx) and vertical difference (Δy) as perpendicular triangle legs.',
  },
  {
    name: 'Midpoint Formula',
    category: 'Geometry',
    formula: 'M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)',
    latex: 'M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)',
    variables: [
      { symbol: '(x₁, y₁)', meaning: 'First endpoint coordinates' },
      { symbol: '(x₂, y₂)', meaning: 'Second endpoint coordinates' },
      { symbol: 'M', meaning: 'Exact midpoint coordinates dividing the segment equally' },
    ],
    whenToUse: 'Use to find the exact point that lies equidistant between two endpoints on a line segment.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Coordinate Geometry Tool',
    explanation: 'Calculates the arithmetic mean of the x-coordinates and the y-coordinates respectively to find the center of mass or midpoint of a segment.',
  },
  {
    name: 'Slope Formula',
    category: 'Algebra & Geometry',
    formula: 'm = (y₂ - y₁) / (x₂ - x₁)',
    latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}',
    variables: [
      { symbol: 'm', meaning: 'Slope (steepness and direction of the line)' },
      { symbol: '(x₁, y₁), (x₂, y₂)', meaning: 'Two distinct points on the straight line' },
      { symbol: 'Δy, Δx', meaning: 'Vertical rise and horizontal run' },
    ],
    whenToUse: 'Use to find the constant rate of change or inclination of a non-vertical line passing through two known coordinate points.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Coordinate Geometry Tool',
    explanation: 'Measures the vertical change divided by the horizontal change ("rise over run"). A vertical line has an undefined slope where x₁ = x₂.',
  },
  {
    name: 'Area of a Circle',
    category: 'Geometry',
    formula: 'A = π · r²',
    latex: 'A = \\pi r^2',
    variables: [
      { symbol: 'A', meaning: 'Total 2D surface area enclosed by the circle' },
      { symbol: 'π', meaning: 'Mathematical constant Pi (~3.14159)' },
      { symbol: 'r', meaning: 'Radius (distance from center to perimeter edge, d/2)' },
    ],
    whenToUse: 'Use to determine the 2D surface area enclosed by a circle from its radius or diameter.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Circle Area Calculator',
    explanation: 'Proven through integration and exhaustion methods, showing that circular area equals half the circumference times the radius: (2πr · r) / 2 = πr².',
  },
  {
    name: 'Area of a Triangle',
    category: 'Geometry',
    formula: 'A = (1/2) · b · h',
    latex: 'A = \\frac{1}{2}bh',
    variables: [
      { symbol: 'A', meaning: 'Total surface area of the planar triangle' },
      { symbol: 'b', meaning: 'Base length of the triangle' },
      { symbol: 'h', meaning: 'Perpendicular height measured from the base to the opposite apex' },
    ],
    whenToUse: 'Use to find the area of any planar triangle when the length of one base and its corresponding perpendicular height are known.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Triangle Area Tool',
    explanation: 'Any triangle can be duplicated and reflected to form a parallelogram of base b and height h. Since parallelogram area is b · h, the triangle is exactly half.',
  },
  {
    name: 'Simple Interest Formula',
    category: 'Applied Math',
    formula: 'I = P · r · t',
    latex: 'I = P \\cdot r \\cdot t',
    variables: [
      { symbol: 'I', meaning: 'Total simple interest earned or owed' },
      { symbol: 'P', meaning: 'Principal investment or initial borrowed balance' },
      { symbol: 'r', meaning: 'Annual interest rate as a decimal (e.g., 5% = 0.05)' },
      { symbol: 't', meaning: 'Time duration in years' },
    ],
    whenToUse: 'Use for linear short-term loans or simple savings where interest is calculated strictly on the original principal balance without compounding.',
    calculatorPath: '/percentage-calculator',
    calculatorName: 'Percentage & Interest Tool',
    explanation: 'Models linear non-compounding interest. Total future balance is calculated as A = P(1 + rt).',
  },
  {
    name: 'Compound Interest Formula',
    category: 'Applied Math',
    formula: 'A = P · (1 + r/n)^(n·t)',
    latex: 'A = P \\left(1 + \\frac{r}{n}\\right)^{nt}',
    variables: [
      { symbol: 'A', meaning: 'Final accrued amount (principal + interest)' },
      { symbol: 'P', meaning: 'Initial principal balance' },
      { symbol: 'r', meaning: 'Annual nominal interest rate as a decimal' },
      { symbol: 'n', meaning: 'Number of compounding periods per year (e.g., 12 for monthly)' },
      { symbol: 't', meaning: 'Time duration in years' },
    ],
    whenToUse: 'Use to calculate savings growth, mortgages, or loan amortization where accumulated interest generates additional interest over time.',
    calculatorPath: '/percentage-calculator',
    calculatorName: 'Compound Interest Tool',
    explanation: 'Captures geometric exponential growth over discrete intervals. As n approaches infinity, it converges to continuous compounding A = P · e^(rt).',
  },
  {
    name: 'Sample Standard Deviation',
    category: 'Statistics',
    formula: 's = √[ ∑(x_i - x̄)² / (n - 1) ]',
    latex: 's = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}}',
    variables: [
      { symbol: 's', meaning: 'Sample standard deviation' },
      { symbol: 'x_i', meaning: 'Individual data value in the dataset' },
      { symbol: 'x̄', meaning: 'Sample arithmetic mean' },
      { symbol: 'n', meaning: 'Sample size (number of observations)' },
      { symbol: 'n - 1', meaning: 'Bessel’s correction factor for degrees of freedom' },
    ],
    whenToUse: 'Use to quantify the dispersion or spread of values around the mean for a sample drawn from a broader population.',
    calculatorPath: '/math/standard-deviation-calculator',
    calculatorName: 'Standard Deviation Calculator',
    explanation: 'Uses Bessel’s correction (n - 1 in the denominator) to provide an unbiased estimator of the true population variance from a subset sample.',
  },
  {
    name: 'Arithmetic Mean',
    category: 'Statistics',
    formula: 'x̄ = (∑ x_i) / n',
    latex: '\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}',
    variables: [
      { symbol: 'x̄', meaning: 'Arithmetic mean (average)' },
      { symbol: '∑ x_i', meaning: 'Sum of all numerical observations in the set' },
      { symbol: 'n', meaning: 'Total count of observations' },
    ],
    whenToUse: 'Use to find the central balancing point of a numerical dataset without extreme outliers.',
    calculatorPath: '/math/standard-deviation-calculator',
    calculatorName: 'Descriptive Statistics Tool',
    explanation: 'The mathematical center of mass of a dataset. Sensitive to extreme skewed values or outliers, where median is often preferred.',
  },
  {
    name: 'Permutations Formula (nPr)',
    category: 'Statistics',
    formula: 'nPr = n! / (n - r)!',
    latex: '_nP_r = \\frac{n!}{(n - r)!}',
    variables: [
      { symbol: 'n', meaning: 'Total number of items in the set' },
      { symbol: 'r', meaning: 'Number of items selected and arranged' },
      { symbol: '!', meaning: 'Factorial product (n! = n · (n-1) · ... · 1)' },
    ],
    whenToUse: 'Use when calculating the number of possible arrangements where order matters (such as race rankings, pin codes, or seating arrangements).',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Permutations Calculator',
    explanation: 'Counts ordered sequences without replacement from a finite set of n distinct elements.',
  },
  {
    name: 'Combinations Formula (nCr)',
    category: 'Statistics',
    formula: 'nCr = n! / [ r! · (n - r)! ]',
    latex: '_nC_r = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}',
    variables: [
      { symbol: 'n', meaning: 'Total number of distinct items available' },
      { symbol: 'r', meaning: 'Number of items chosen for the group' },
      { symbol: 'nCr', meaning: 'Binomial coefficient ("n choose r")' },
    ],
    whenToUse: 'Use when calculating the number of possible selections where order does not matter (such as lottery numbers, committees, or card hands).',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Combinations Calculator',
    explanation: 'Divides the permutation count by r! to eliminate duplicate arrangements of the same subset of items.',
  },
  {
    name: 'Product of Powers Exponent Rule',
    category: 'Algebra',
    formula: 'a^m · a^n = a^(m + n)',
    latex: 'a^m \\cdot a^n = a^{m+n}',
    variables: [
      { symbol: 'a', meaning: 'Common non-zero base' },
      { symbol: 'm, n', meaning: 'Real exponents (powers)' },
    ],
    whenToUse: 'Use to combine and simplify algebraic terms with identical bases multiplied together.',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Exponent Rules Calculator',
    explanation: 'Since a^m represents m factors of a and a^n represents n factors of a, multiplying them gives (m + n) total factors of a.',
  },
  {
    name: 'Logarithm Product & Quotient Rules',
    category: 'Algebra',
    formula: 'log_b(xy) = log_b(x) + log_b(y)',
    latex: '\\log_b(xy) = \\log_b(x) + \\log_b(y)',
    variables: [
      { symbol: 'b', meaning: 'Logarithmic base (b > 0, b ≠ 1)' },
      { symbol: 'x, y', meaning: 'Positive real arguments (x > 0, y > 0)' },
    ],
    whenToUse: 'Use to expand complicated logarithmic expressions or condense multiple logarithm terms into a single argument.',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Logarithm Calculator',
    explanation: 'Logarithms are the inverses of exponential operations. The logarithm of a product equals the sum of the individual logarithms.',
  },
];

// ---------------------------------------------------------------------------
// 5. QUICK MATH ANSWERS (Representative Examples with 5-Step Explanations)
// ---------------------------------------------------------------------------
export const QUICK_ANSWER_EXAMPLES: QuickAnswerExample[] = [
  {
    id: 'percent-example',
    question: 'What is 15% of 240?',
    answer: '36',
    topic: 'Percentages',
    calculatorPath: '/percentage-calculator',
    calculatorName: 'Percentage Calculator',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify the formula',
        content: 'To find a percentage of a number, multiply the base value by the decimal form of the percentage: Part = Base × (Percentage / 100).',
        mathExpression: 'Part = 240 × (15 / 100)',
      },
      {
        stepNumber: 2,
        title: 'Convert percentage to a decimal',
        content: 'Divide 15 by 100 to convert from percentage to decimal notation.',
        mathExpression: '15 / 100 = 0.15',
      },
      {
        stepNumber: 3,
        title: 'Multiply by the base value',
        content: 'Multiply 240 by 0.15 to calculate the numerical portion.',
        mathExpression: '240 × 0.15 = 36',
      },
      {
        stepNumber: 4,
        title: 'State the final answer',
        content: 'The calculated portion of 240 is 36.',
        mathExpression: '36',
      },
      {
        stepNumber: 5,
        title: 'Explain the result',
        content: '10% of 240 is 24, and 5% is half of that (12). Adding 24 + 12 = 36, which confirms the mathematical calculation.',
      },
    ],
  },
  {
    id: 'sqrt-example',
    question: 'What is √144?',
    answer: '12',
    topic: 'Powers & Roots',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Scientific Calculator',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify the mathematical operation',
        content: 'The principal square root √x asks: "What non-negative number multiplied by itself equals 144?"',
        mathExpression: 'y² = 144, where y ≥ 0',
      },
      {
        stepNumber: 2,
        title: 'Examine prime factorization',
        content: 'Break 144 into prime factors: 144 = 2 × 2 × 2 × 2 × 3 × 3 = 2⁴ × 3².',
        mathExpression: '144 = 2⁴ × 3²',
      },
      {
        stepNumber: 3,
        title: 'Apply square root exponent rule',
        content: 'Take half of each exponent: √(2⁴ × 3²) = 2^(4/2) × 3^(2/2) = 2² × 3¹.',
        mathExpression: '2² × 3 = 4 × 3',
      },
      {
        stepNumber: 4,
        title: 'Perform calculation',
        content: 'Multiply 4 by 3 to reach 12.',
        mathExpression: '4 × 3 = 12',
      },
      {
        stepNumber: 5,
        title: 'Verify the result',
        content: '12 × 12 = 144. While (-12)² is also 144, the radical symbol √ indicates the principal positive root, which is 12.',
      },
    ],
  },
  {
    id: 'fraction-example',
    question: 'What is 3/4 + 1/8?',
    answer: '7/8',
    topic: 'Fractions',
    calculatorPath: '#math-categories',
    calculatorName: 'Fraction Calculator',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify common denominator',
        content: 'Fractions can only be added directly when denominators are equal. The least common multiple (LCM) of 4 and 8 is 8.',
        mathExpression: 'LCM(4, 8) = 8',
      },
      {
        stepNumber: 2,
        title: 'Convert to equivalent fractions',
        content: 'Multiply both numerator and denominator of 3/4 by 2 to obtain a denominator of 8.',
        mathExpression: '(3 × 2) / (4 × 2) = 6/8',
      },
      {
        stepNumber: 3,
        title: 'Add numerators over common denominator',
        content: 'Keep the denominator 8 and add the numerators 6 and 1.',
        mathExpression: '(6 + 1) / 8 = 7/8',
      },
      {
        stepNumber: 4,
        title: 'Check if fraction can be simplified',
        content: 'The greatest common divisor of 7 and 8 is 1. The fraction is already in simplest rational form.',
        mathExpression: 'GCF(7, 8) = 1',
      },
      {
        stepNumber: 5,
        title: 'Decimal equivalent',
        content: '7 divided by 8 is equal to exactly 0.875 (or 87.5%).',
      },
    ],
  },
  {
    id: 'linear-example',
    question: 'Solve 2x + 5 = 17',
    answer: 'x = 6',
    topic: 'Algebra',
    calculatorPath: '/math/system-of-linear-equations-2x2-3x3',
    calculatorName: 'Linear Equation Solver',
    steps: [
      {
        stepNumber: 1,
        title: 'Isolate variable term',
        content: 'Subtract 5 from both sides of the equation to isolate the term containing x.',
        mathExpression: '2x + 5 - 5 = 17 - 5',
      },
      {
        stepNumber: 2,
        title: 'Simplify both sides',
        content: 'Perform the subtraction to simplify the linear equation.',
        mathExpression: '2x = 12',
      },
      {
        stepNumber: 3,
        title: 'Divide by the coefficient of x',
        content: 'Divide both sides of the equation by 2 to solve for x.',
        mathExpression: '(2x / 2) = (12 / 2)',
      },
      {
        stepNumber: 4,
        title: 'State the solution',
        content: 'The solution is x = 6.',
        mathExpression: 'x = 6',
      },
      {
        stepNumber: 5,
        title: 'Verify by substitution',
        content: 'Substitute x = 6 back into original equation: 2(6) + 5 = 12 + 5 = 17. The equation holds true.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 6. WHAT'S THE DIFFERENCE? (11 Mathematical Concept Comparisons)
// ---------------------------------------------------------------------------
export const CONCEPT_COMPARISONS: ConceptComparison[] = [
  {
    id: 'mean-median',
    title: 'Mean vs Median',
    termA: 'Mean (Average)',
    termB: 'Median (Middle Value)',
    definitionA: 'The arithmetic sum of all numbers divided by the total count of values.',
    definitionB: 'The exact physical middle value when data is sorted in ascending order.',
    keyDifference: 'Mean is heavily pulled by extreme outliers, whereas median remains robust and resistant to skew.',
    example: 'For [2, 3, 4, 5, 100]: Mean = 22.8, while Median = 4.',
    whenToUse: 'Use Mean for symmetrical distributions (e.g., test scores); use Median for skewed distributions (e.g., housing prices or personal incomes).',
    calculatorPath: '/math/standard-deviation-calculator',
    calculatorName: 'Statistics Calculator',
  },
  {
    id: 'mean-mode',
    title: 'Mean vs Mode',
    termA: 'Mean',
    termB: 'Mode',
    definitionA: 'The arithmetic center balancing all values in a quantitative dataset.',
    definitionB: 'The value that appears with the highest frequency in a dataset.',
    keyDifference: 'A dataset has exactly one mean, but can have zero, one, or multiple modes (bimodal/multimodal). Mode can also be calculated for categorical data.',
    example: 'For shoe sizes [8, 9, 9, 10, 11]: Mode is 9 (most common inventory item).',
    whenToUse: 'Use Mode when determining the most popular size, item, or frequent occurrence.',
    calculatorPath: '/math/standard-deviation-calculator',
    calculatorName: 'Statistics Calculator',
  },
  {
    id: 'gcf-lcm',
    title: 'GCF vs LCM',
    termA: 'Greatest Common Factor (GCF)',
    termB: 'Least Common Multiple (LCM)',
    definitionA: 'The largest integer that divides evenly into two or more numbers without a remainder.',
    definitionB: 'The smallest positive integer that is a common multiple of two or more numbers.',
    keyDifference: 'GCF is always less than or equal to the smallest number; LCM is always greater than or equal to the largest number.',
    example: 'For 12 and 18: GCF = 6 (divides both), while LCM = 36 (both divide into it).',
    whenToUse: 'Use GCF to simplify fractions; use LCM to find common denominators when adding or subtracting fractions.',
    calculatorPath: '#math-categories',
    calculatorName: 'GCF & LCM Calculator',
  },
  {
    id: 'change-diff',
    title: 'Percent Change vs Percent Difference',
    termA: 'Percent Change',
    termB: 'Percent Difference',
    definitionA: 'Measures change from a specific historical baseline: [(New - Old) / |Old|] × 100.',
    definitionB: 'Compares two positive values without an implied direction: [|A - B| / ((A + B)/2)] × 100.',
    keyDifference: 'Percent change has a chronological starting point and can be positive or negative. Percent difference is symmetric and always positive.',
    example: 'Old price $80 to New $100 is +25% change. Comparing $80 and $100 symmetrically gives a 22.2% difference.',
    whenToUse: 'Use Percent Change for price inflation or progress over time; use Percent Difference to compare two simultaneous measurements.',
    calculatorPath: '/percentage-calculator',
    calculatorName: 'Percentage Calculator',
  },
  {
    id: 'area-perimeter',
    title: 'Area vs Perimeter',
    termA: 'Area',
    termB: 'Perimeter',
    definitionA: 'The two-dimensional space enclosed within the boundary of a shape (measured in square units, cm² or ft²).',
    definitionB: 'The one-dimensional total distance around the outside edge of a shape (measured in linear units, cm or ft).',
    keyDifference: 'Area measures surface interior; perimeter measures boundary length.',
    example: 'A 5m × 4m room has a perimeter of 18 meters (baseboards needed) and an area of 20 square meters (carpet needed).',
    whenToUse: 'Use Perimeter for fencing, borders, and framing; use Area for flooring, paint, and plot sizing.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Geometry Explorer',
  },
  {
    id: 'radius-diameter',
    title: 'Radius vs Diameter',
    termA: 'Radius (r)',
    termB: 'Diameter (d)',
    definitionA: 'Distance from the center point of a circle to any point on its circumference.',
    definitionB: 'Distance across the circle passing directly through the center point (d = 2r).',
    keyDifference: 'Diameter is always exactly twice the radius of the circle.',
    example: 'A bicycle wheel with a 14-inch radius has a 28-inch diameter.',
    whenToUse: 'Radius is used in area (πr²) and spherical volume; diameter is commonly used in physical sizing and manufacturing measurements.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Circle Calculator',
  },
  {
    id: 'var-stddev',
    title: 'Variance vs Standard Deviation',
    termA: 'Variance (s²)',
    termB: 'Standard Deviation (s)',
    definitionA: 'The average of squared deviations from the arithmetic mean.',
    definitionB: 'The square root of variance, returning dispersion to original measurement units.',
    keyDifference: 'Variance is expressed in squared units (e.g., dollars² or kg²); standard deviation is in the original raw units (dollars or kg).',
    example: 'If weight variance is 25 kg², the standard deviation is 5 kg.',
    whenToUse: 'Use Variance in mathematical statistical modeling; use Standard Deviation for clear, human-interpretable reporting.',
    calculatorPath: '/math/standard-deviation-calculator',
    calculatorName: 'Standard Deviation Calculator',
  },
  {
    id: 'perm-comb',
    title: 'Permutation vs Combination',
    termA: 'Permutation (nPr)',
    termB: 'Combination (nCr)',
    definitionA: 'An arrangement of elements where the specific order matters.',
    definitionB: 'A grouping of elements where the order does not matter.',
    keyDifference: 'For elements A and B: {A, B} and {B, A} are two distinct permutations, but only one single combination.',
    example: 'Lock passcode (1-2-3 ≠ 3-2-1) is a permutation; choosing 3 fruit toppings for ice cream is a combination.',
    whenToUse: 'Use Permutation for rankings, passwords, and assigned positions; use Combination for committees, hands of cards, and groups.',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Combinatorics Tool',
  },
  {
    id: 'prob-odds',
    title: 'Probability vs Odds',
    termA: 'Probability',
    termB: 'Odds',
    definitionA: 'Ratio of favorable outcomes to total possible outcomes: P = F / (F + U).',
    definitionB: 'Ratio of favorable outcomes to unfavorable outcomes: Odds = F / U.',
    keyDifference: 'Probability is expressed between 0 and 1 (or 0% to 100%); odds are expressed as a ratio (e.g., 3 to 1).',
    example: 'Rolling a 1 on a fair 6-sided die: Probability is 1/6 (16.7%); Odds in favor are 1 to 5.',
    whenToUse: 'Use Probability in scientific data analysis; use Odds in sports wagering and epidemiological risk modeling.',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Probability Calculator',
  },
  {
    id: 'slope-roc',
    title: 'Slope vs Rate of Change',
    termA: 'Slope',
    termB: 'Rate of Change',
    definitionA: 'The geometric steepness of a line on a Cartesian coordinate plane (Δy / Δx).',
    definitionB: 'How one real-world quantity changes in relation to another over time or space.',
    keyDifference: 'Slope is a purely mathematical geometric ratio; rate of change incorporates physical contextual units (e.g., miles per hour, dollars per year).',
    example: 'On a graph of distance vs. time, a slope of 60 represents a rate of change of 60 miles per hour.',
    whenToUse: 'Use Slope when working with geometric equations and graphing; use Rate of Change in physics, economics, and biology.',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Coordinate Geometry Tool',
  },
  {
    id: 'seq-series',
    title: 'Sequence vs Series',
    termA: 'Sequence',
    termB: 'Series',
    definitionA: 'An ordered list of numbers following a specific mathematical rule or pattern.',
    definitionB: 'The cumulative sum of the terms of a sequence.',
    keyDifference: 'A sequence is a comma-separated list: a₁, a₂, a₃... A series is an additive sum: a₁ + a₂ + a₃...',
    example: 'Sequence: 2, 4, 8, 16. Corresponding Series: 2 + 4 + 8 + 16 = 30.',
    whenToUse: 'Use Sequence to model discrete steps and cycles; use Series to calculate accumulated totals and convergent limits.',
    calculatorPath: '#formula-library',
    calculatorName: 'Sequences & Series Tool',
  },
];

// ---------------------------------------------------------------------------
// 7. EDUCATIONAL GUIDES (8 In-Depth Topic Articles)
// ---------------------------------------------------------------------------
export const MATH_GUIDES: MathGuide[] = [
  {
    title: 'How to Solve a Quadratic Equation Step-by-Step',
    desc: 'Master the three primary methods: factoring, completing the square, and using the quadratic formula with discriminant analysis.',
    readTime: '6 min read',
    topic: 'Algebra',
    calculatorPath: '/math/quadratic-formula-solver-with-steps',
    calculatorName: 'Quadratic Equation Solver',
  },
  {
    title: 'How to Add, Subtract, Multiply, and Divide Fractions',
    desc: 'A complete visual guide to finding common denominators, converting mixed numbers, and simplifying rational fractions.',
    readTime: '5 min read',
    topic: 'Fractions',
    calculatorPath: '#quick-answers',
    calculatorName: 'Fraction Calculator',
  },
  {
    title: 'How to Calculate Percentage Change and Difference',
    desc: 'Understand the mathematical difference between percent increase, percent decrease, and symmetric percent difference.',
    readTime: '4 min read',
    topic: 'Percentages',
    calculatorPath: '/percentage-calculator',
    calculatorName: 'Percentage Calculator',
  },
  {
    title: 'How to Find the Area and Circumference of a Circle',
    desc: 'Learn why the formula is πr², how diameter relates to radius, and how to calculate circular sectors and arcs.',
    readTime: '4 min read',
    topic: 'Geometry',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Circle Area Calculator',
  },
  {
    title: 'How to Calculate Standard Deviation & Variance by Hand',
    desc: 'Step-by-step breakdown of mean subtraction, squaring deviations, Bessel’s correction (n-1), and taking the square root.',
    readTime: '7 min read',
    topic: 'Statistics',
    calculatorPath: '/math/standard-deviation-calculator',
    calculatorName: 'Standard Deviation Tool',
  },
  {
    title: 'How to Find the Slope of a Line from Two Points',
    desc: 'Calculate rise over run, understand positive, negative, zero, and undefined slopes, and convert to slope-intercept form (y = mx + b).',
    readTime: '4 min read',
    topic: 'Algebra',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Coordinate Geometry Tool',
  },
  {
    title: 'How to Use the Pythagorean Theorem in Real Life',
    desc: 'Practical applications for finding TV screen diagonal sizes, construction squaring (3-4-5 rule), and navigation distance.',
    readTime: '5 min read',
    topic: 'Geometry',
    calculatorPath: '#interactive-visuals',
    calculatorName: 'Pythagorean Calculator',
  },
  {
    title: 'How to Calculate Basic Probability and Odds',
    desc: 'Understand theoretical vs. experimental probability, independent events, mutually exclusive rules, and odds ratios.',
    readTime: '5 min read',
    topic: 'Statistics',
    calculatorPath: '/scientific-calculator',
    calculatorName: 'Probability Calculator',
  },
];

// ---------------------------------------------------------------------------
// 8. MATH FAQS (15 Practical, Honest Questions from Prompt)
// ---------------------------------------------------------------------------
export const MATH_FAQS: MathFaq[] = [
  {
    q: 'What math calculators are available on SolveItCalculator?',
    a: 'We provide free calculators and step-by-step problem solvers across Basic Math, Fractions, Percentages, Algebra, Geometry, Trigonometry, Statistics & Probability, Ratios & Proportions, Number Theory, Sequences & Series, and Academic Grade Planning.',
  },
  {
    q: 'Are the math calculators free to use?',
    a: 'Yes. All calculators and problem solvers on SolveItCalculator are 100% free with no account registration, subscriptions, or paywalls required.',
  },
  {
    q: 'Can I solve equations step by step?',
    a: 'Yes. For calculators that support multi-step methods (such as our Quadratic Formula Solver, Linear Equation Solvers, Fraction Simplifiers, and Descriptive Statistics tools), you can expand the solution to inspect each substitution, arithmetic step, and conceptual explanation.',
  },
  {
    q: 'Can I enter fractions directly into the calculators?',
    a: 'Yes. Our fraction calculators and scientific solver allow entering fractions as numerators and denominators (e.g., 3/4 + 1/8) and preserve exact rational fraction representation without prematurely converting to rounded decimals.',
  },
  {
    q: 'Can I enter equations with variables like x and y?',
    a: 'Yes. In our algebra and linear equation tools, you can enter standard algebraic equations such as 2x + 5 = 17 or ax² + bx + c = 0 to solve for unknown variables.',
  },
  {
    q: 'Can I toggle between degrees and radians for trigonometry?',
    a: 'Yes. In the Scientific Calculator and trigonometric tools, you can switch between Degree (°) mode and Radian (rad) mode at any time. Angle mode is always clearly indicated so you know which unit is active.',
  },
  {
    q: 'How accurate are the results?',
    a: 'Calculations use standard high-precision IEEE 754 floating-point mathematics and exact rational arithmetic where supported. For irrational numbers (like π or square roots) and repeating decimals, results are rounded to reasonable precision (typically 4 to 6 decimal places). We transparently display rounding conventions on each tool.',
  },
  {
    q: 'Why might two calculators show slightly different results?',
    a: 'Calculators can produce different results due to different rounding rules, differences between sample (n-1) and population (N) statistics formulas, trigonometric angle mode settings (degrees vs. radians), or differences in operator precedence conventions.',
  },
  {
    q: 'Can these calculators help me with homework?',
    a: 'Yes. Use these calculators to check your work, identify calculation errors, and understand the step-by-step methodology behind challenging problems. They are designed to facilitate learning rather than just providing uncontextualized answers.',
  },
  {
    q: 'Do all calculators show step-by-step explanations?',
    a: 'Complex procedural calculators (such as polynomial factoring, quadratic formulas, fraction arithmetic, and standard deviation) provide step-by-step explanations. Simple direct calculators (such as unit converters or basic addition) present immediate numerical answers without artificial filler steps.',
  },
  {
    q: 'Can I see the underlying mathematical formula?',
    a: 'Yes. Every calculator page and our Math Formula Library explicitly displays the mathematical equation, variable definitions, and usage context.',
  },
  {
    q: 'Can I graph functions and equations?',
    a: 'Yes. Our Interactive Math Visuals section includes interactive function graph visualizers, coordinate plotting planes, unit circle angle visualizers, and normal distribution probability curves.',
  },
  {
    q: 'Can I use these math tools on my mobile phone or tablet?',
    a: 'Yes. All calculators are mobile-first responsive and support touch inputs, virtual math keypads, and responsive layouts across phones, tablets, and desktop computers.',
  },
  {
    q: 'Are these calculators affiliated with any standardized exam provider (SAT, ACT, AP)?',
    a: 'No. SolveItCalculator is an independent educational resource. We are not officially affiliated with, endorsed by, or certified by the College Board (SAT/AP), ACT Inc., or ETS (GRE). Our practice sections help students practice general mathematical concepts relevant to those exams.',
  },
  {
    q: 'Do these calculators replace a teacher or math tutor?',
    a: 'No. While these tools provide step-by-step guidance and formula explanations, they are intended as supplemental study and verification tools. They do not replace classroom instruction, teachers, or professional tutoring.',
  },
];
