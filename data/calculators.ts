export interface CalculatorMeta {
  id: string;
  name: string;
  category:
    | 'Retirement'
    | 'Mortgage'
    | 'Investment'
    | 'Loans'
    | 'Tax & Income'
    | 'Business'
    | 'Health'
    | 'Conversions'
    | 'Science'
    | 'Date & Time'
    | 'Home & Construction'
    | 'Math';
  description: string;
  path: string;
  icon: string;
  popular?: boolean;
  tags: string[];
}

export const CALCULATORS: CalculatorMeta[] = [
  // Math & Workspace
  {
    id: 'calculation-workspace',
    name: 'Calculation Workspace (Expression & History Calculator)',
    category: 'Math',
    description:
      'Calculate expressions, review previous steps, save named subtotals, and reuse results without starting over.',
    path: '/calculation-workspace',
    icon: 'Calculator',
    popular: true,
    tags: [
      'calculation workspace',
      'expression calculator',
      'running total',
      'history calculator',
      'subtotal',
      'multi-step calculator',
    ],
  },
  // Retirement
  {
    id: '401k',
    name: '401(k) Retirement Calculator',
    category: 'Retirement',
    description:
      'Calculate 401(k) growth with employer matching, salary increases, and inflation-adjusted projections.',
    path: '/finance/401k-calculator',
    icon: 'TrendingUp',
    popular: true,
    tags: ['401k', 'retirement', 'pension', 'employer match', 'nest egg', 'superannuation'],
  },
  {
    id: 'fire-forecaster',
    name: 'FIRE Forecaster (Financial Independence Calculator)',
    category: 'Retirement',
    description:
      'Calculate your FIRE target number, years to financial independence, Coast FIRE, and Lean/Fat FIRE milestones.',
    path: '/fire-forecaster',
    icon: 'Flame',
    popular: true,
    tags: ['fire', 'financial independence', 'retire early', 'coast fire', 'lean fire', '4% rule'],
  },
  {
    id: 'safe-withdrawal-rate',
    name: 'Safe Withdrawal Rate (SWR) & 4% Rule Calculator',
    category: 'Retirement',
    description:
      'Calculate your sustainable annual and monthly retirement income and required nest egg under the 4% rule.',
    path: '/finance/safe-withdrawal-rate-calculator',
    icon: 'ShieldCheck',
    tags: ['swr', 'safe withdrawal rate', '4% rule', 'retirement income', 'trinity study'],
  },
  {
    id: 'roth-ira',
    name: 'Roth IRA Calculator',
    category: 'Retirement',
    description:
      'Compare tax-free Roth IRA growth against traditional tax-deferred retirement accounts.',
    path: '/finance/roth-ira-calculator',
    icon: 'ShieldCheck',
    tags: ['roth', 'ira', 'tax-free', 'retirement', 'investing'],
  },
  {
    id: 'social-security',
    name: 'Social Security Retirement Estimator',
    category: 'Retirement',
    description:
      'Compare claiming Social Security at age 62, Full Retirement Age (67), and age 70.',
    path: '/finance/social-security-calculator',
    icon: 'Calendar',
    tags: ['social security', 'retirement age', 'fra', 'claiming age'],
  },

  // Mortgage & Real Estate
  {
    id: 'mortgage',
    name: 'Mortgage Payment Calculator (PITI)',
    category: 'Mortgage',
    description:
      'Estimate monthly mortgage payments including principal, interest, taxes, insurance (PITI), and PMI.',
    path: '/mortgage-calculator',
    icon: 'Home',
    popular: true,
    tags: ['mortgage', 'home loan', 'piti', 'real estate', 'interest', 'amortization'],
  },
  {
    id: 'home-affordability',
    name: 'Home Affordability Calculator (28/36 Rule)',
    category: 'Mortgage',
    description:
      'Calculate the maximum house price you can afford based on gross income, monthly debt, and down payment.',
    path: '/finance/home-affordability-calculator',
    icon: 'Home',
    popular: true,
    tags: ['home affordability', 'how much house can i afford', '28/36 rule', 'dti'],
  },
  {
    id: 'refinance',
    name: 'Mortgage Refinance & Break-Even Calculator',
    category: 'Mortgage',
    description:
      'Compare your current mortgage against a refinance offer to find monthly savings and break-even months.',
    path: '/finance/refinance-calculator',
    icon: 'RefreshCw',
    tags: ['refinance', 'break even', 'closing costs', 'lower mortgage rate'],
  },
  {
    id: 'rent-vs-buy',
    name: 'Rent vs. Buy Home Comparison Calculator',
    category: 'Mortgage',
    description:
      'Compare the multi-year net cost of buying a home versus renting with appreciation and equity.',
    path: '/finance/rent-vs-buy-calculator',
    icon: 'Scale',
    tags: ['rent vs buy', 'home buying', 'renting', 'real estate'],
  },

  // Investment
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    category: 'Investment',
    description:
      'Calculate compound investment growth with regular deposits, multiple compounding frequencies, and return rates.',
    path: '/compound-interest-calculator',
    icon: 'LineChart',
    popular: true,
    tags: ['compound interest', 'investing', 'growth', 'stocks', 'portfolio', 'savings'],
  },
  {
    id: 'investment-growth',
    name: 'Investment Portfolio Growth Calculator',
    category: 'Investment',
    description:
      'Project long-term portfolio growth with initial lump sum, monthly contributions, and inflation adjustment.',
    path: '/finance/investment-growth-calculator',
    icon: 'TrendingUp',
    tags: ['investment growth', 'portfolio projection', 'wealth calculator'],
  },
  {
    id: 'real-rate-of-return',
    name: 'Real Rate of Return & Inflation Calculator',
    category: 'Investment',
    description:
      'Compute true inflation-adjusted investment return using the exact Fisher equation.',
    path: '/finance/real-rate-of-return-calculator',
    icon: 'Percent',
    tags: ['real rate of return', 'fisher equation', 'inflation adjusted return'],
  },

  // Loans & Debt
  {
    id: 'loan',
    name: 'Personal & Auto Loan Calculator',
    category: 'Loans',
    description:
      'Determine monthly loan payments, total interest paid, and payoff dates with extra payments.',
    path: '/loan-calculator',
    icon: 'CreditCard',
    popular: true,
    tags: ['loan', 'car loan', 'auto loan', 'personal loan', 'debt payoff', 'apr'],
  },

  // Tax & Income
  {
    id: 'salary-tax',
    name: 'Salary & Net Pay Calculator',
    category: 'Tax & Income',
    description:
      'Calculate take-home pay after federal tax brackets, FICA (Social Security & Medicare), and deductions.',
    path: '/salary-tax-calculator',
    icon: 'DollarSign',
    popular: true,
    tags: ['salary', 'paycheck', 'take home pay', 'net income', 'income tax', 'fica'],
  },
  {
    id: 'us-federal-tax',
    name: 'US Federal Income Tax Calculator',
    category: 'Tax & Income',
    description:
      'Estimate IRS federal tax liability, effective tax rate, and marginal bracket.',
    path: '/finance/us-federal-income-tax-calculator',
    icon: 'DollarSign',
    tags: ['federal income tax', 'irs brackets', 'tax refund', 'standard deduction'],
  },
  {
    id: 'self-employment-tax',
    name: 'Self-Employment & 1099 Tax Calculator',
    category: 'Tax & Income',
    description:
      'Calculate 15.3% Social Security and Medicare SE tax, deductible half, and quarterly payments.',
    path: '/finance/self-employment-tax-calculator',
    icon: 'Briefcase',
    tags: ['self employment tax', '1099 tax', 'freelance tax', 'quarterly tax'],
  },

  // Business
  {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    category: 'Business',
    description:
      'Compute gross, operating, and net profit margins and dollar profit from revenue and costs.',
    path: '/finance/profit-margin-calculator',
    icon: 'PieChart',
    tags: ['profit margin', 'gross margin', 'net margin', 'business'],
  },
  {
    id: 'margin-and-markup',
    name: 'Margin vs. Markup Converter & Pricing Calculator',
    category: 'Business',
    description:
      'Calculate selling price, gross profit, gross margin %, and markup % from unit cost.',
    path: '/finance/margin-and-markup-calculator',
    icon: 'Percent',
    tags: ['margin vs markup', 'markup calculator', 'margin calculator', 'pricing'],
  },
  {
    id: 'break-even',
    name: 'Break-Even Point Calculator',
    category: 'Business',
    description:
      'Calculate break-even units and revenue needed to cover fixed and variable costs.',
    path: '/finance/break-even-calculator',
    icon: 'Target',
    tags: ['break even', 'fixed costs', 'contribution margin', 'unit sales'],
  },

  // Health & Fitness
  {
    id: 'bmi',
    name: 'BMI Calculator (Body Mass Index)',
    category: 'Health',
    description:
      'Calculate Body Mass Index (BMI) using Metric or US Imperial units with WHO healthy weight ranges.',
    path: '/bmi-calculator',
    icon: 'Activity',
    popular: true,
    tags: ['bmi', 'body mass index', 'weight', 'health', 'fitness', 'ideal weight'],
  },
  {
    id: 'tdee-calorie',
    name: 'Daily Calorie & TDEE Calculator',
    category: 'Health',
    description:
      'Estimate Total Daily Energy Expenditure (TDEE) and daily calorie targets for weight loss or muscle gain.',
    path: '/bmi-calculator?mode=tdee',
    icon: 'Flame',
    popular: true,
    tags: ['tdee', 'calorie calculator', 'daily calories', 'weight loss calories', 'nutrition'],
  },
  {
    id: 'bmr',
    name: 'Basal Metabolic Rate (BMR) Calculator',
    category: 'Health',
    description:
      'Compute resting metabolic calorie burn using the Mifflin-St Jeor and Harris-Benedict formulas.',
    path: '/bmi-calculator?mode=bmr',
    icon: 'Activity',
    tags: ['bmr', 'basal metabolic rate', 'resting calories', 'mifflin st jeor'],
  },
  {
    id: 'ideal-weight',
    name: 'Ideal & Healthy Weight Range Calculator',
    category: 'Health',
    description:
      'Find your healthy weight range (WHO BMI 18.5–24.9) plus Devine, Robinson, and Miller ideal weights.',
    path: '/bmi-calculator?mode=ideal-weight',
    icon: 'Scale',
    tags: ['ideal weight', 'healthy weight range', 'devine formula', 'target weight'],
  },
  {
    id: 'body-fat',
    name: 'Body Fat Percentage Calculator (U.S. Navy Method)',
    category: 'Health',
    description:
      'Estimate body fat percentage, fat mass, and lean body mass from waist, neck, and height.',
    path: '/bmi-calculator?mode=body-fat',
    icon: 'Heart',
    tags: ['body fat percentage', 'navy body fat', 'lean body mass', 'body composition'],
  },

  // Conversions
  {
    id: 'length-converter',
    name: 'Millimeters to Inches & Length Converter (mm to in)',
    category: 'Conversions',
    description:
      'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), feet, meters, and kilometers using NIST SP 811 factors.',
    path: '/conversions/length',
    icon: 'Layers',
    popular: true,
    tags: [
      'length converter',
      'mm to in',
      'millimeters to inches',
      '8mm to inches',
      'cm to in',
      '50cm to inches',
      'meters to feet',
      '100 km to miles',
    ],
  },
  {
    id: 'weight-converter',
    name: 'Kilograms to Pounds & Weight Converter (kg to lbs)',
    category: 'Conversions',
    description:
      'Convert kilograms to pounds (kg to lbs), pounds to kilograms, grams to pounds, and ounces using NIST SP 811 factors.',
    path: '/conversions/weight',
    icon: 'Scale',
    popular: true,
    tags: [
      'weight converter',
      'kg to lbs',
      'kilograms to pounds',
      '60 kg to lbs',
      '80kg to lbs',
      'lbs to kg',
      '500 grams to pounds',
      '100g to oz',
    ],
  },
  {
    id: 'temperature-converter',
    name: 'Celsius to Fahrenheit & Temperature Converter (°C to °F)',
    category: 'Conversions',
    description:
      'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius (°F to °C), and Kelvin with exact offset formulas and oven tables.',
    path: '/conversions/temperature',
    icon: 'Flame',
    popular: true,
    tags: [
      'temperature converter',
      'celsius to fahrenheit',
      'c to f',
      '200 c to f',
      '24 celsius to fahrenheit',
      '60 f to c',
      'kelvin to celsius',
    ],
  },
  {
    id: 'volume-converter',
    name: 'Milliliters to Ounces & Volume Converter (mL to fl oz)',
    category: 'Conversions',
    description:
      'Convert milliliters to fluid ounces (750 mL to oz, 500 mL to oz), pints to quarts, quarts to gallons, and liters to gallons.',
    path: '/conversions/volume',
    icon: 'Layers',
    popular: true,
    tags: [
      'volume converter',
      'ml to oz',
      '750 ml to oz',
      '500 ml to oz',
      'pints in a quart',
      'quarts in a gallon',
      'gallons to liters',
    ],
  },
  {
    id: 'cooking-converter',
    name: 'Tablespoons to Cups & Cooking Measurement Converter',
    category: 'Conversions',
    description:
      'Convert kitchen tablespoons to cups (tbsp to cup), teaspoons to tablespoons (tsp to tbsp), fluid ounces to cups, and quarts to cups.',
    path: '/conversions/cooking',
    icon: 'Layers',
    tags: [
      'cooking converter',
      'tablespoons to cups',
      'tbsp to cup',
      'teaspoons to tablespoons',
      'fluid ounces to cups',
    ],
  },
  {
    id: 'speed-converter',
    name: 'Kilometers per Hour to mph & Speed Converter (km/h to mph)',
    category: 'Conversions',
    description:
      'Convert kilometers per hour to miles per hour (100 km/h to mph, 300 km/h to mph), knots to mph, m/s to mph, and ft/s to mph.',
    path: '/conversions/speed',
    icon: 'Gauge',
    tags: [
      'speed converter',
      'kmh to mph',
      '100 kmh to mph',
      'knots to mph',
      'm/s to mph',
      'fps to mph',
    ],
  },
  {
    id: 'area-converter',
    name: 'Square Meters to Square Feet & Area Converter (m² to ft²)',
    category: 'Conversions',
    description:
      'Convert square meters to square feet (m² to sq ft), acres to square miles, acres to square feet, and square inches to square feet.',
    path: '/conversions/area',
    icon: 'Layers',
    tags: [
      'area converter',
      'm2 to sq ft',
      'acres to square miles',
      'acres to square feet',
      '28 acres to square feet',
      'square inch to square foot',
    ],
  },
  {
    id: 'torque-converter',
    name: 'Newton-Meters to Foot-Pounds Torque Converter (N·m to ft-lb)',
    category: 'Conversions',
    description:
      'Convert Newton-meters to foot-pounds (25 N·m to ft-lbs), foot-pounds to N·m, and Newton-meters to inch-pounds (10 N·m to in-lbs).',
    path: '/conversions/torque',
    icon: 'Gauge',
    tags: [
      'torque converter',
      'nm to ft lbs',
      'newton meters to foot pounds',
      '25 nm to ft lbs',
      '10 nm to inch pounds',
      'in lbs to nm',
    ],
  },
  {
    id: 'digital-converter',
    name: 'Kilobytes to Megabytes & MB to GB Data Converter',
    category: 'Conversions',
    description:
      'Convert kilobytes to megabytes (KB to MB), megabytes to gigabytes (MB to GB), gigabits to megabytes (1 Gbit = 125 MB), and binary GiB.',
    path: '/conversions/digital',
    icon: 'Layers',
    tags: [
      'data converter',
      'kb to mb',
      'mb to gb',
      'gigabit to megabyte',
      '8192 mb to gb',
      '0.04 gb to mb',
    ],
  },
  {
    id: 'energy-converter',
    name: 'Kilojoules to Joules & Calories Energy Converter (kJ, kcal)',
    category: 'Conversions',
    description:
      'Convert kilojoules to joules (kJ to J), kilocalories to small calories (kcal to cal), joules to calories, and kWh to joules.',
    path: '/conversions/energy',
    icon: 'Zap',
    tags: [
      'energy converter',
      'kj to j',
      'j to kj',
      'kcal to cal',
      '259 kcal to calories',
      'kwh to j',
    ],
  },
  {
    id: 'fuel-economy-converter',
    name: 'L/100km to MPG & km/L Fuel Economy Converter',
    category: 'Conversions',
    description:
      'Convert liters per 100 km to US and UK miles per gallon (L/100km to mpg) and kilometers per liter (30 MPG to km/L).',
    path: '/conversions/fuel-economy',
    icon: 'Gauge',
    tags: ['l100km to mpg', 'fuel economy converter', 'km/l to mpg', 'mpg to kml', '30 mpg in kmpl'],
  },

  // Science
  {
    id: 'density-calculator',
    name: 'Density, Mass & Volume Calculator',
    category: 'Science',
    description:
      'Solve for density (ρ = m ÷ V), mass, or volume across g/cm³, kg/m³, g/mL, and lb/ft³.',
    path: '/science/density-calculator',
    icon: 'FlaskConical',
    tags: ['density calculator', 'mass volume density', 'buoyancy', 'physics', 'chemistry'],
  },
  {
    id: 'force-calculator',
    name: 'Force Calculator (Newton’s Second Law F = m × a)',
    category: 'Science',
    description:
      'Calculate net force in Newtons (N), mass (kg), or acceleration (m/s²) with g-force comparison.',
    path: '/science/force-calculator',
    icon: 'Gauge',
    tags: ['force calculator', 'newtons second law', 'f=ma', 'acceleration', 'physics'],
  },
  {
    id: 'ohms-law-calculator',
    name: "Ohm's Law & Electrical Power Calculator (V, I, R, P)",
    category: 'Science',
    description:
      'Calculate voltage (V), current (A), resistance (Ω), and electrical power (W) from any two inputs.',
    path: '/science/ohms-law-calculator',
    icon: 'Zap',
    tags: ['ohms law', 'voltage', 'current', 'resistance', 'watts', 'electrical'],
  },
  {
    id: 'molarity-calculator',
    name: 'Molarity & Solution Concentration Calculator',
    category: 'Science',
    description:
      'Calculate molarity (mol/L), required solute mass in grams, or solution volume from molecular weight.',
    path: '/science/molarity-calculator',
    icon: 'FlaskConical',
    tags: ['molarity calculator', 'moles', 'solution concentration', 'molar mass', 'chemistry'],
  },

  // Date & Time
  {
    id: 'age-calculator',
    name: 'Chronological Age Calculator',
    category: 'Date & Time',
    description:
      'Find your exact age in years, months, weeks, and days plus next birthday countdown.',
    path: '/age-calculator',
    icon: 'Calendar',
    popular: true,
    tags: ['age calculator', 'birthday', 'chronological age', 'date of birth'],
  },
  {
    id: 'date-difference',
    name: 'Date Difference & Working Days Calculator',
    category: 'Date & Time',
    description:
      'Count calendar days, weeks, months, and business weekdays between any two dates.',
    path: '/date-difference-calculator',
    icon: 'Calendar',
    tags: ['date difference', 'days between dates', 'working days', 'business days'],
  },
  {
    id: 'time-duration',
    name: 'Time Duration & Shift Hours Calculator',
    category: 'Date & Time',
    description:
      'Calculate elapsed hours, minutes, seconds, and decimal payroll hours between two times.',
    path: '/time-duration-calculator',
    icon: 'Clock',
    tags: ['time duration', 'hours between times', 'work hours', 'shift calculator'],
  },

  // Home & Construction
  {
    id: 'flooring-calculator',
    name: 'Flooring & Room Material Estimator',
    category: 'Home & Construction',
    description:
      'Calculate room square footage, waste allowance, boxes needed, and total flooring project cost.',
    path: '/home-construction/flooring-calculator',
    icon: 'Home',
    tags: ['flooring calculator', 'square footage', 'tile', 'laminate', 'hardwood'],
  },
];

export const CATEGORIES = [
  'All',
  'Retirement',
  'Mortgage',
  'Investment',
  'Loans',
  'Tax & Income',
  'Business',
  'Health',
  'Conversions',
  'Science',
  'Date & Time',
  'Home & Construction',
] as const;
