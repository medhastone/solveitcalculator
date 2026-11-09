import { GUIDES_DATA } from './guidesData';

export type SearchEntryType = 'Calculator' | 'Guide' | 'Category';

export interface SearchEntry {
  id: string;
  title: string;
  type: SearchEntryType;
  category: string;
  categoryHref: string;
  description: string;
  href: string;
  keywords: string[];
}

export interface CategoryHubLink {
  name: string;
  subtitle: string;
  href: string;
  keywords: string[];
}

export const CATEGORY_HUB_LINKS: CategoryHubLink[] = [
  {
    name: 'Math Calculators',
    subtitle: 'Percentages, fractions, ratios, averages, scientific & algebra',
    href: '/math',
    keywords: ['math', 'algebra', 'geometry', 'number', 'equation', 'percent', 'fraction', 'ratio', 'average', 'workspace'],
  },
  {
    name: 'Finance Calculators',
    subtitle: 'Loans, mortgages, compound interest, salary, tax & savings',
    href: '/finance',
    keywords: ['finance', 'money', 'loan', 'mortgage', 'tax', 'salary', 'interest', 'invest', 'pay', 'debt', 'payment'],
  },
  {
    name: 'Home & Construction',
    subtitle: 'Flooring project estimator, room area, concrete, paint & roofing',
    href: '/home-construction',
    keywords: ['home', 'construction', 'flooring', 'room', 'area', 'square feet', 'tile', 'laminate', 'paint', 'concrete', 'roof'],
  },
  {
    name: 'Unit Conversion',
    subtitle: 'Length, weight, area, volume, temperature, speed & storage',
    href: '/conversions',
    keywords: ['unit', 'convert', 'conversion', 'length', 'weight', 'temperature', 'meters', 'feet', 'kg', 'lbs', 'liters', 'gallons'],
  },
  {
    name: 'Date & Time Calculators',
    subtitle: 'Exact age, date difference, workdays & time duration',
    href: '/date-time',
    keywords: ['date', 'time', 'age', 'birthday', 'calendar', 'days', 'hours', 'duration', 'workdays'],
  },
  {
    name: 'Health & Fitness',
    subtitle: 'BMI, daily calorie needs (TDEE), BMR, body fat & ideal weight',
    href: '/health-fitness',
    keywords: ['health', 'fitness', 'bmi', 'calorie', 'weight', 'body', 'diet', 'nutrition', 'bmr', 'tdee', 'workout'],
  },
  {
    name: 'Business Calculators',
    subtitle: 'Profit margin, gross margin, markup, break-even, ROI & VAT/GST',
    href: '/finance/business',
    keywords: ['business', 'margin', 'markup', 'profit', 'revenue', 'break even', 'roi', 'vat', 'gst', 'sales', '1099'],
  },
  {
    name: 'Science Calculators',
    subtitle: "Density, force, Ohm's law, molarity, percent error & logs",
    href: '/science',
    keywords: ['science', 'physics', 'chemistry', 'density', 'force', 'ohms', 'molarity', 'velocity', 'energy', 'lab'],
  },
  {
    name: 'Retirement & Super',
    subtitle: '401(k), Roth vs. Traditional, RMD, FIRE & safe withdrawal rate',
    href: '/retirement-and-super',
    keywords: ['retirement', '401k', 'ira', 'roth', 'rmd', 'fire', 'pension', 'super', 'withdrawal'],
  },
];

const SPELLING_ALIASES: Record<string, string> = {
  precentage: 'percentage',
  persentage: 'percentage',
  percntage: 'percentage',
  percnt: 'percentage',
  pct: 'percentage',
  percent: 'percentage',
  percentages: 'percentage',
  discnt: 'discount',
  discont: 'discount',
  discounts: 'discount',
  frakshun: 'fraction',
  fration: 'fraction',
  fractions: 'fraction',
  raito: 'ratio',
  ratios: 'ratio',
  morgage: 'mortgage',
  mortage: 'mortgage',
  lone: 'loan',
  lons: 'loan',
  intrest: 'interest',
  calclator: 'calculator',
  calculater: 'calculator',
  temprature: 'temperature',
  convetor: 'converter',
  floring: 'flooring',
  florring: 'flooring',
  pemdas: 'order of operations',
  bodmas: 'order of operations',
  bidmas: 'order of operations',
  gcf: 'gcd',
  hcf: 'gcd',
  emi: 'loan payment',
};

export const UNIFIED_SEARCH_INDEX: SearchEntry[] = [
  // Featured New Tools
  {
    id: 'calculation-workspace',
    title: 'Calculation Workspace',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description:
      'Calculate multi-step expressions, review previous steps, keep running totals, and reuse results without starting over.',
    href: '/calculation-workspace',
    keywords: [
      'workspace',
      'calculation workspace',
      'running total',
      'tape calculator',
      'adding machine',
      'history',
      'subtotal',
      'expressions',
      'multi step calculator',
      'notepad calculator',
    ],
  },
  {
    id: 'construction-project-calculator',
    title: 'Construction Project Calculator (Area, Concrete Slab & Post Holes)',
    type: 'Calculator',
    category: 'Home & Construction',
    categoryHref: '/home-construction',
    description:
      'Guided 4-stage workflow (Measurements → Quantity → Waste allowance → Estimated cost) for flooring, rectangular areas, concrete slabs, and cylindrical post holes.',
    href: '/construction-project-calculator',
    keywords: [
      'construction',
      'construction calculator',
      'construction project calculator',
      'concrete calculator',
      'concrete slab',
      'post hole',
      'cylindrical hole',
      'cubic yards',
      'bags of concrete',
      'square footage',
      'waste allowance',
      'material estimator',
    ],
  },
  {
    id: 'flooring-project-calculator',
    title: 'Flooring Calculator (Room Area, Waste & Material Cost)',
    type: 'Calculator',
    category: 'Home & Construction',
    categoryHref: '/home-construction',
    description:
      'Calculate room area in sq ft or sq m, add 5%–15% waste allowance, estimate boxes/packs, and calculate material cost.',
    href: '/home-construction/flooring-calculator',
    keywords: [
      'flooring',
      'flooring calculator',
      'laminate',
      'hardwood',
      'vinyl plank',
      'tile',
      'room area',
      'square footage',
      'waste allowance',
      'boxes of flooring',
    ],
  },
  {
    id: 'recipe-converter',
    title: 'Recipe Converter (Scale Servings & Cups to Grams)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Scale recipes by serving size and convert between cups, tablespoons, teaspoons, millilitres, and grams using verified ingredient densities.',
    href: '/recipe-converter',
    keywords: [
      'recipe converter',
      'recipe scaler',
      'cups to grams',
      'grams to cups',
      'baking conversion',
      'cooking converter',
      'flour cups to grams',
      'sugar cups to grams',
      'butter cups to grams',
      'ingredient density',
      'serving size calculator',
    ],
  },
  {
    id: 'salary-calculator',
    title: 'Country-Specific Salary & Take-Home Pay Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description:
      'Estimate net take-home pay, progressive income tax, statutory social deductions, marginal rate, and effective tax rate for the US, UK, Canada, Australia, and India.',
    href: '/salary-calculator',
    keywords: [
      'salary calculator',
      'take home pay calculator',
      'net pay calculator',
      'after tax salary',
      'us salary calculator',
      'uk take home pay',
      'canada paycheck calculator',
      'australia pay calculator',
      'india in hand salary calculator',
      'marginal vs effective tax rate',
    ],
  },

  // Math Calculators
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description:
      'Calculate percentages, find what percent X is of Y, and increase or decrease any number by a percentage.',
    href: '/math/percentage-calculator',
    keywords: ['percentage', 'percent', 'percentage of a number', 'find percent', 'rate', 'part of whole'],
  },
  {
    id: 'percentage-change-calculator',
    title: 'Percentage Change Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Find the percentage increase or decrease between an original value and a new value.',
    href: '/math/percentage-change-calculator',
    keywords: ['percentage change', 'percent change', 'percent increase', 'percent decrease', 'growth rate'],
  },
  {
    id: 'percentage-increase-calculator',
    title: 'Percentage Increase Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Calculate the exact percentage increase and difference from a starting number to a higher number.',
    href: '/math/percentage-change-calculator?mode=increase',
    keywords: ['percentage increase', 'percent increase', 'price increase', 'raise percentage'],
  },
  {
    id: 'percentage-decrease-calculator',
    title: 'Percentage Decrease Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Calculate the percentage decrease or drop from an original value to a lower value.',
    href: '/math/percentage-change-calculator?mode=decrease',
    keywords: ['percentage decrease', 'percent decrease', 'reduction', 'weight loss percent'],
  },
  {
    id: 'percentage-difference-calculator',
    title: 'Percentage Difference Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Compare two independent numbers using their symmetric average as the baseline.',
    href: '/math/percentage-change-calculator?mode=difference',
    keywords: ['percentage difference', 'percent difference', 'compare two numbers', 'relative difference'],
  },
  {
    id: 'discount-calculator',
    title: 'Discount Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Calculate final sale price, total money saved, stacked discounts, and sales tax.',
    href: '/math/discount-calculator',
    keywords: ['discount', 'sale price', 'percent off', 'coupon', 'markdown', 'shopping', 'savings'],
  },
  {
    id: 'fraction-calculator',
    title: 'Fraction Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Add, subtract, multiply, divide, and simplify fractions and mixed numbers step by step.',
    href: '/math/fraction-calculator',
    keywords: ['fraction', 'numerator', 'denominator', 'mixed number', 'simplify fraction', 'improper fraction'],
  },
  {
    id: 'ratio-calculator',
    title: 'Ratio Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Simplify ratios to lowest terms and solve missing values in proportions (A:B = C:D).',
    href: '/math/ratio-calculator',
    keywords: ['ratio', 'proportion', 'scale', 'aspect ratio', 'equivalent ratio'],
  },
  {
    id: 'average-calculator',
    title: 'Average Calculator (Mean, Median, Mode & Range)',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Calculate the arithmetic mean, median, mode, range, sum, and count of any number list.',
    href: '/math/average-calculator',
    keywords: ['average', 'mean', 'median', 'mode', 'range', 'statistics', 'dataset'],
  },
  {
    id: 'scientific-calculator',
    title: 'Scientific Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Evaluate trigonometry (sin, cos, tan), logarithms, exponents, roots, factorials, and π.',
    href: '/math/scientific-calculator',
    keywords: ['scientific calculator', 'trigonometry', 'sin', 'cos', 'tan', 'logarithm', 'radians', 'degrees'],
  },
  {
    id: 'square-root-calculator',
    title: 'Square Root & Radical Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Find exact principal square roots, cube roots, and nth radicals with simplification.',
    href: '/math/square-root-calculator',
    keywords: ['square root', 'cube root', 'radical', 'sqrt', 'nth root'],
  },
  {
    id: 'exponent-calculator',
    title: 'Exponent & Power Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Calculate bases raised to positive, negative, zero, or fractional exponents (x^n).',
    href: '/math/exponent-calculator',
    keywords: ['exponent', 'power', 'scientific notation', 'squared', 'cubed'],
  },
  {
    id: 'log-calculator',
    title: 'Logarithm Calculator (log₁₀, ln & Custom Base)',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Compute common logarithms (base 10), natural logarithms (base e), and custom base logs.',
    href: '/math/log-calculator',
    keywords: ['logarithm', 'log', 'ln', 'natural log', 'base 10', 'ph scale'],
  },
  {
    id: 'quadratic-equation-calculator',
    title: 'Quadratic Equation Solver',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Solve ax² + bx + c = 0 using the quadratic formula, discriminant, and vertex form.',
    href: '/math/quadratic-equation-calculator',
    keywords: ['quadratic', 'quadratic formula', 'parabola', 'discriminant', 'roots', 'algebra'],
  },
  {
    id: 'equation-solver',
    title: 'Linear & Algebraic Equation Solver',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Solve single-variable linear equations and 2×2 systems of linear equations.',
    href: '/math/equation-solver',
    keywords: ['linear equation', 'solve for x', 'system of equations', 'slope intercept', 'algebra'],
  },
  {
    id: 'gcd-and-lcm-calculator',
    title: 'GCD & LCM Calculator (Greatest Common Divisor)',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Find the Least Common Multiple (LCM) and Greatest Common Factor (GCF/GCD) with prime factorization.',
    href: '/math/gcd-and-lcm-calculator',
    keywords: ['lcm', 'gcd', 'gcf', 'hcf', 'least common multiple', 'greatest common divisor', 'prime factors'],
  },
  {
    id: 'percent-error-calculator',
    title: 'Percent Error Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Measure experimental accuracy by comparing measured values against theoretical values.',
    href: '/math/percent-error-calculator',
    keywords: ['percent error', 'experimental error', 'relative error', 'lab accuracy', 'chemistry', 'physics'],
  },
  {
    id: 'fraction-to-decimal-calculator',
    title: 'Fraction to Decimal & Percent Calculator',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Convert fractions and mixed numbers into exact decimals and percentages.',
    href: '/math/fraction-to-decimal-calculator',
    keywords: ['decimal to fraction', 'fraction to decimal', 'convert decimal', 'repeating decimal'],
  },
  {
    id: 'proportion-calculator',
    title: 'Proportion Calculator (Cross-Multiplication)',
    type: 'Calculator',
    category: 'Math',
    categoryHref: '/math',
    description: 'Solve for the missing variable X in two equivalent fractions A/B = C/D.',
    href: '/math/proportion-calculator',
    keywords: ['proportion', 'cross multiply', 'missing value', 'scale factor'],
  },

  // Finance Calculators
  {
    id: 'loan-calculator',
    title: 'Loan Payment Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Calculate monthly payments, total interest cost, and full amortization schedule for any loan.',
    href: '/loan-calculator',
    keywords: ['loan', 'loan payment', 'emi', 'personal loan', 'auto loan', 'car loan', 'amortization', 'borrow', 'loan payoff'],
  },
  {
    id: 'mortgage-calculator',
    title: 'Mortgage Calculator (PITI & Extra Payments)',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Estimate monthly home loan principal, interest, property taxes, homeowners insurance, and HOA.',
    href: '/mortgage-calculator',
    keywords: ['mortgage', 'home loan', 'house payment', 'piti', 'down payment', 'property tax', 'real estate'],
  },
  {
    id: 'compound-interest-calculator',
    title: 'Compound Interest & Savings Growth Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Project how savings and investments grow over time with compound interest and monthly deposits.',
    href: '/compound-interest-calculator',
    keywords: ['compound interest', 'savings growth', 'investment return', 'apy', 'interest rate', 'future value', 'simple interest', 'savings goal'],
  },
  {
    id: 'take-home-pay-calculator',
    title: 'Salary & Take-Home Paycheck Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Convert annual salary to hourly, weekly, biweekly, and monthly net take-home pay after tax.',
    href: '/finance/take-home-pay-calculator',
    keywords: ['salary', 'paycheck', 'take home pay', 'hourly to salary', 'wage', 'income tax', 'net pay'],
  },
  {
    id: 'home-affordability-calculator',
    title: 'Home Affordability Calculator (28/36 Debt-to-Income)',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Calculate the maximum home purchase price and loan amount your household budget supports.',
    href: '/finance/home-affordability-calculator',
    keywords: ['home affordability', 'how much house can i afford', '28/36 rule', 'dti', 'debt to income'],
  },
  {
    id: 'refinance-calculator',
    title: 'Mortgage Refinance & Break-Even Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Compare your current mortgage against a lower refinance rate and closing cost break-even month.',
    href: '/finance/refinance-calculator',
    keywords: ['refinance', 'mortgage refinance', 'closing costs', 'lower interest rate'],
  },
  {
    id: 'rent-vs-buy-calculator',
    title: 'Rent vs. Buy Home Comparison Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Compare 5-to-30 year net cost and equity build of buying a home versus renting and investing.',
    href: '/finance/rent-vs-buy-calculator',
    keywords: ['rent vs buy', 'homeownership', 'home equity', 'down payment opportunity cost'],
  },
  {
    id: 'investment-growth-calculator',
    title: 'Investment Growth, ROI & CAGR Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Project long-term portfolio growth, ROI, and Compound Annual Growth Rate (CAGR).',
    href: '/finance/investment-growth-calculator',
    keywords: ['investment growth', 'roi', 'cagr', 'portfolio growth', 'stock returns'],
  },
  {
    id: 'real-rate-of-return-calculator',
    title: 'Real Rate of Return & Inflation-Adjusted Yield Calculator',
    type: 'Calculator',
    category: 'Finance',
    categoryHref: '/finance',
    description: 'Calculate purchasing-power investment yield after inflation and taxes using the Fisher equation.',
    href: '/finance/real-rate-of-return-calculator',
    keywords: ['real rate of return', 'inflation calculator', 'fisher equation', 'purchasing power'],
  },
  {
    id: 'safe-withdrawal-rate-calculator',
    title: 'Safe Withdrawal Rate (4% Rule) Calculator',
    type: 'Calculator',
    category: 'Retirement & Super',
    categoryHref: '/retirement-and-super',
    description: 'Simulate retirement portfolio longevity with annual inflation-adjusted withdrawals.',
    href: '/finance/safe-withdrawal-rate-calculator',
    keywords: ['safe withdrawal rate', '4% rule', 'trinity study', 'retirement withdrawal'],
  },
  {
    id: '401k-calculator',
    title: '401(k) Retirement & Employer Match Calculator',
    type: 'Calculator',
    category: 'Retirement & Super',
    categoryHref: '/retirement-and-super',
    description: 'Project your 401(k) retirement balance with salary deferrals, employer match, and compounding.',
    href: '/finance/401k-calculator',
    keywords: ['401k', 'employer match', 'retirement', 'nest egg', 'pension'],
  },
  {
    id: 'roth-vs-traditional-calculator',
    title: 'Roth vs. Traditional Retirement Calculator',
    type: 'Calculator',
    category: 'Retirement & Super',
    categoryHref: '/retirement-and-super',
    description: 'Compare pre-tax Traditional vs. after-tax Roth contributions across current and retirement tax brackets.',
    href: '/finance/roth-vs-traditional-calculator',
    keywords: ['roth vs traditional', 'roth ira', 'traditional ira', 'retirement tax'],
  },
  {
    id: 'rmd-calculator',
    title: 'Required Minimum Distribution (RMD) Calculator',
    type: 'Calculator',
    category: 'Retirement & Super',
    categoryHref: '/retirement-and-super',
    description: 'Calculate mandatory annual retirement withdrawals using IRS Uniform Lifetime tables.',
    href: '/finance/rmd-calculator',
    keywords: ['rmd', 'required minimum distribution', 'irs table', 'retirement withdrawal'],
  },
  {
    id: 'fire-forecaster',
    title: 'FIRE Forecaster & Financial Independence Calculator',
    type: 'Calculator',
    category: 'Retirement & Super',
    categoryHref: '/retirement-and-super',
    description: 'Calculate your Financial Independence (FIRE) target number, years to retirement, and 4% rule withdrawals.',
    href: '/fire-forecaster',
    keywords: ['fire', 'financial independence', 'retire early', '4% rule', 'safe withdrawal rate'],
  },

  // Business Calculators
  {
    id: 'profit-margin-calculator',
    title: 'Profit Margin Calculator',
    type: 'Calculator',
    category: 'Business',
    categoryHref: '/finance/business',
    description: 'Compute gross, operating, and net profit margins from revenue and costs.',
    href: '/finance/profit-margin-calculator',
    keywords: ['profit margin', 'gross margin', 'net margin', 'operating margin', 'business'],
  },
  {
    id: 'margin-calculator',
    title: 'Gross Margin & Markup Calculator',
    type: 'Calculator',
    category: 'Business',
    categoryHref: '/finance/business',
    description: 'Convert between cost, markup percentage, gross margin percentage, and selling price.',
    href: '/finance/margin-calculator',
    keywords: ['margin', 'markup', 'cost to price', 'wholesale', 'retail', 'gross profit'],
  },
  {
    id: 'break-even-calculator',
    title: 'Break-Even Point Calculator',
    type: 'Calculator',
    category: 'Business',
    categoryHref: '/finance/business',
    description: 'Find the exact unit sales and revenue needed to cover fixed and variable costs.',
    href: '/finance/break-even-calculator',
    keywords: ['break even', 'fixed costs', 'variable costs', 'contribution margin', 'unit sales'],
  },
  {
    id: 'self-employment-tax-calculator',
    title: 'Self-Employment & Freelance Tax Calculator',
    type: 'Calculator',
    category: 'Business',
    categoryHref: '/finance/business',
    description: 'Estimate Social Security, Medicare SE tax, and quarterly estimated tax payments.',
    href: '/finance/self-employment-tax-calculator',
    keywords: ['self employment tax', 'freelance tax', '1099 tax', 'schedule se', 'quarterly tax'],
  },
  {
    id: '1099-vs-w2-calculator',
    title: '1099 Contractor vs. W-2 Salary Calculator',
    type: 'Calculator',
    category: 'Business',
    categoryHref: '/finance/business',
    description: 'Compare independent contractor hourly rates against salaried W-2 employment and benefits.',
    href: '/finance/1099-vs-w2-calculator',
    keywords: ['1099 vs w2', 'contractor rate', 'freelance vs salary', 'consulting rate'],
  },

  // Unit Conversion
  {
    id: 'conversions-length',
    title: 'Millimeters to Inches & Length Converter (mm to in, cm to in)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), feet, meters, and kilometers using NIST SP 811 factors.',
    href: '/conversions/length',
    keywords: [
      'length converter',
      'mm to in',
      'millimeters to inches',
      '8mm to inches',
      '10mm to inches',
      'cm to in',
      '50cm to inches',
      'inches to feet',
      'meters to feet',
      '100 km to miles',
    ],
  },
  {
    id: 'conversions-weight',
    title: 'Kilograms to Pounds & Weight Converter (kg to lbs, g to oz)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert kilograms to pounds (kg to lbs), pounds to kilograms, grams to pounds, ounces, stone, and metric tons.',
    href: '/conversions/weight',
    keywords: [
      'weight converter',
      'kg to lbs',
      'kilograms to pounds',
      '60 kg to lbs',
      '80kg to lbs',
      'lbs to kg',
      '165 lbs to kg',
      'grams to pounds',
      '500 grams to pounds',
      '100g to oz',
      '24 oz to lbs',
    ],
  },
  {
    id: 'conversions-temperature',
    title: 'Celsius to Fahrenheit & Temperature Converter (°C to °F, K)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius (°F to °C), and Kelvin with exact offset formulas and oven tables.',
    href: '/conversions/temperature',
    keywords: [
      'temperature converter',
      'celsius to fahrenheit',
      'c to f',
      '200 c to f',
      '24 celsius to fahrenheit',
      '37 c to fahrenheit',
      '60 f to c',
      '75 f to c',
      'kelvin to celsius',
    ],
  },
  {
    id: 'conversions-cooking',
    title: 'Tablespoons to Cups & Cooking Converter (tbsp, tsp, cups)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert tablespoons to cups, teaspoons to tablespoons, fluid ounces to cups, and milliliters for cooking and baking.',
    href: '/conversions/cooking',
    keywords: [
      'cooking converter',
      'tablespoons to cups',
      'tbsp to cup',
      '4 tablespoons to cups',
      '6 tablespoons to cups',
      '16 oz to cups',
      'teaspoons to tablespoons',
    ],
  },
  {
    id: 'conversions-volume',
    title: 'Milliliters to Ounces & Liquid Volume Converter (mL to fl oz, L to gal)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert milliliters to fluid ounces (750 mL to oz, 500 mL to oz), pints to quarts, quarts to gallons, and liters to US gallons.',
    href: '/conversions/volume',
    keywords: [
      'volume converter',
      'ml to oz',
      '750 ml to oz',
      '500 ml to oz',
      '50 ml to oz',
      'pints in a quart',
      'quarts in a gallon',
      '12 quarts to gallons',
      'liters to gallons',
    ],
  },
  {
    id: 'conversions-speed',
    title: 'Kilometers per Hour to mph & Speed Converter (km/h to mph, knots)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert kilometers per hour to miles per hour (100 km/h to mph, 300 km/h to mph), knots to mph, m/s to mph, and feet per second.',
    href: '/conversions/speed',
    keywords: [
      'speed converter',
      'kmh to mph',
      '100 kmh to mph',
      '300 kmh to mph',
      'knots to mph',
      'm/s to mph',
      'fps to mph',
    ],
  },
  {
    id: 'conversions-area',
    title: 'Square Meters to Square Feet & Area Converter (m² to ft², acres)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert square meters to square feet (m² to sq ft), acres to square miles, acres to square feet (28 acres, 0.3 acres), and square inches to sq ft.',
    href: '/conversions/area',
    keywords: [
      'area converter',
      'm2 to sq ft',
      'acres to square miles',
      'how many acres are in a square mile',
      '28 acres to square feet',
      '0.3 acres to square feet',
      'square inch to square foot',
    ],
  },
  {
    id: 'conversions-digital',
    title: 'Kilobytes to Megabytes & MB to GB Data Converter (KB, MB, GB, Gbit)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert kilobytes to megabytes (KB to MB), megabytes to gigabytes (MB to GB), gigabits to megabytes (1 Gbit = 125 MB), and binary MiB/GiB.',
    href: '/conversions/digital',
    keywords: [
      'data converter',
      'kb to mb',
      'mb to gb',
      'kb vs mb',
      'gigabit to megabyte',
      '1 gigabit to megabytes',
      '8192 mb to gb',
      '0.04gb is how much storage',
    ],
  },
  {
    id: 'conversions-energy',
    title: 'Kilojoules to Joules & Calories Energy Converter (kJ, J, kcal, kWh)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert kilojoules to joules (kJ to J), kilocalories to small calories (kcal to cal), joules to calories, and kilowatt-hours to joules.',
    href: '/conversions/energy',
    keywords: [
      'energy converter',
      'kj to j',
      'j to kj',
      'kcal to cal',
      '259 kcal to calories',
      'cal to joules',
      'kwh to j',
    ],
  },
  {
    id: 'conversions-fuel-economy',
    title: 'L/100km to MPG & km/L Fuel Economy Converter',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert liters per 100 km to US and UK miles per gallon (L/100km to mpg) and kilometers per liter (30 MPG to km/L).',
    href: '/conversions/fuel-economy',
    keywords: ['l100km to mpg', 'l/100km to mpg', 'km/l to mpg', 'mpg to kml', '30 mpg in kmpl', 'fuel economy converter'],
  },
  {
    id: 'conversions-torque',
    title: 'Newton-Meters to Foot-Pounds Torque Converter (N·m to ft-lb, in-lb)',
    type: 'Calculator',
    category: 'Unit Conversion',
    categoryHref: '/conversions',
    description:
      'Convert Newton-meters (N·m) to foot-pounds (25 N·m to ft-lbs) and inch-pounds (10 N·m to in-lbs) for fastener and engine torque.',
    href: '/conversions/torque',
    keywords: [
      'newton meters to foot pounds',
      'nm to ft lbs',
      '25 nm to ft lbs',
      '10 nm to inch pounds',
      'in lbs to nm',
      'torque converter',
    ],
  },

  // Date & Time
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    type: 'Calculator',
    category: 'Date & Time',
    categoryHref: '/date-time',
    description: 'Find your exact age in years, months, weeks, and days from your date of birth.',
    href: '/age-calculator',
    keywords: ['age', 'age calculator', 'birthday', 'date of birth', 'how old am i', 'next birthday'],
  },
  {
    id: 'date-difference-calculator',
    title: 'Date Difference & Business Days Calculator',
    type: 'Calculator',
    category: 'Date & Time',
    categoryHref: '/date-time',
    description: 'Calculate exact calendar days, weeks, months, or working weekdays between two dates.',
    href: '/date-difference-calculator',
    keywords: ['date difference', 'days between dates', 'workdays', 'business days', 'add days to date', 'calendar'],
  },
  {
    id: 'time-duration-calculator',
    title: 'Time Duration & Work Hours Calculator',
    type: 'Calculator',
    category: 'Date & Time',
    categoryHref: '/date-time',
    description: 'Calculate elapsed hours, minutes, seconds, and decimal payroll hours between two times.',
    href: '/time-duration-calculator',
    keywords: ['time duration', 'hours between times', 'work hours', 'timesheet', 'shift calculator', 'elapsed time'],
  },

  // Health & Fitness
  {
    id: 'bmi-calculator',
    title: 'BMI, Calorie (TDEE), BMR & Body Fat Calculator',
    type: 'Calculator',
    category: 'Health & Fitness',
    categoryHref: '/health-fitness',
    description: 'Calculate Body Mass Index (BMI), daily calorie needs (TDEE), BMR, ideal weight, and body fat.',
    href: '/bmi-calculator',
    keywords: ['bmi', 'body mass index', 'calorie calculator', 'tdee', 'bmr', 'ideal weight', 'body fat', 'health'],
  },

  // Science Calculators
  {
    id: 'density-calculator',
    title: 'Density Calculator (ρ = m ÷ V)',
    type: 'Calculator',
    category: 'Science',
    categoryHref: '/science',
    description: 'Solve for density, mass, or volume across metric and imperial scientific units.',
    href: '/science/density-calculator',
    keywords: ['density', 'mass', 'volume', 'physics', 'chemistry'],
  },
  {
    id: 'force-calculator',
    title: "Force Calculator (Newton's Second Law F = m × a)",
    type: 'Calculator',
    category: 'Science',
    categoryHref: '/science',
    description: 'Calculate net force in Newtons, mass, or acceleration using F = m × a.',
    href: '/science/force-calculator',
    keywords: ['force', 'newtons', 'mass', 'acceleration', 'physics'],
  },
  {
    id: 'ohms-law-calculator',
    title: "Ohm's Law & Electrical Power Calculator",
    type: 'Calculator',
    category: 'Science',
    categoryHref: '/science',
    description: 'Calculate voltage (V), current (I), resistance (R), and power (Watts) in electrical circuits.',
    href: '/science/ohms-law-calculator',
    keywords: ['ohms law', 'voltage', 'current', 'resistance', 'watts', 'amps', 'ohms', 'electricity'],
  },
  {
    id: 'molarity-calculator',
    title: 'Molarity & Solution Concentration Calculator',
    type: 'Calculator',
    category: 'Science',
    categoryHref: '/science',
    description: 'Calculate molarity (M), moles of solute, gram mass, and solution volume for chemistry labs.',
    href: '/science/molarity-calculator',
    keywords: ['molarity', 'moles', 'concentration', 'solute', 'molecular weight', 'chemistry'],
  },

  // Guides (All 13 Canonical Guides from GUIDES_DATA)
  ...GUIDES_DATA.map((guide) => ({
    id: `guide-${guide.slug}`,
    title: guide.title,
    type: 'Guide' as const,
    category: guide.category,
    categoryHref: '/guides',
    description: guide.heroIntro,
    href: `/guides/${guide.slug}`,
    keywords: guide.keywords,
  })),

  // Category Hub Entries
  ...CATEGORY_HUB_LINKS.map((cat, idx) => ({
    id: `cat-${idx}-${cat.href.replace(/\W+/g, '')}`,
    title: cat.name,
    type: 'Category' as const,
    category: cat.name.replace(' Calculators', ''),
    categoryHref: cat.href,
    description: cat.subtitle,
    href: cat.href,
    keywords: cat.keywords,
  })),
];

export function normalizeSearchQuery(rawQuery: string): {
  normalizedQuery: string;
  correctedFrom: string | null;
} {
  const trimmed = rawQuery.trim().toLowerCase();
  if (!trimmed) {
    return { normalizedQuery: '', correctedFrom: null };
  }
  const words = trimmed.split(/\s+/);
  let wasCorrected = false;
  const mappedWords = words.map((w) => {
    if (SPELLING_ALIASES[w]) {
      if (
        SPELLING_ALIASES[w] !== w &&
        w !== 'percent' &&
        w !== 'percentages' &&
        w !== 'pct'
      ) {
        wasCorrected = true;
      }
      return SPELLING_ALIASES[w];
    }
    return w;
  });
  return {
    normalizedQuery: mappedWords.join(' '),
    correctedFrom: wasCorrected ? rawQuery.trim() : null,
  };
}

export function searchInventory(
  rawQuery: string,
  filterType: 'All' | SearchEntryType = 'All',
  limit?: number
): SearchEntry[] {
  const { normalizedQuery } = normalizeSearchQuery(rawQuery);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of UNIFIED_SEARCH_INDEX) {
    if (filterType !== 'All' && entry.type !== filterType) continue;

    if (queryTokens.length === 0) {
      scored.push({ entry, score: 1 });
      continue;
    }

    const titleLower = entry.title.toLowerCase();
    const categoryLower = entry.category.toLowerCase();
    const descLower = entry.description.toLowerCase();
    const keywordsJoined = entry.keywords.join(' ').toLowerCase();
    const fullHaystack = `${titleLower} ${categoryLower} ${descLower} ${keywordsJoined}`;

    const matchesAllTokens = queryTokens.every((token) =>
      fullHaystack.includes(token)
    );
    if (!matchesAllTokens) continue;

    let score = 10;
    if (titleLower === normalizedQuery) score += 100;
    else if (titleLower.startsWith(normalizedQuery)) score += 60;
    else if (titleLower.includes(normalizedQuery)) score += 40;

    if (entry.keywords.some((k) => k.toLowerCase() === normalizedQuery)) {
      score += 50;
    } else if (
      entry.keywords.some((k) => k.toLowerCase().includes(normalizedQuery))
    ) {
      score += 25;
    }

    if (categoryLower.includes(normalizedQuery)) score += 15;
    if (entry.type === 'Calculator') score += 5;

    scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const results = scored.map((s) => s.entry);
  return typeof limit === 'number' ? results.slice(0, limit) : results;
}

export function getRelatedCategoriesForQuery(rawQuery: string): CategoryHubLink[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return CATEGORY_HUB_LINKS.slice(0, 4);

  const matched = CATEGORY_HUB_LINKS.filter(
    (cat) =>
      cat.name.toLowerCase().includes(q) ||
      cat.subtitle.toLowerCase().includes(q) ||
      cat.keywords.some((k) => k.includes(q) || q.includes(k))
  );

  if (matched.length >= 2) {
    return matched.slice(0, 4);
  }

  const defaults = CATEGORY_HUB_LINKS.filter((c) => !matched.includes(c));
  return [...matched, ...defaults].slice(0, 4);
}
