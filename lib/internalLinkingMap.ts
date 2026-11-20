export interface GuideLinkTarget {
  slug: string;
  href: string;
  title: string;
  description: string;
}

export interface CalculatorCatalogEntry {
  path: string;
  name: string;
  description: string;
}

export interface CalculatorInternalLinkEntry {
  path: string;
  name: string;
  guides: GuideLinkTarget[];
  relatedCalculators: CalculatorCatalogEntry[];
}

export interface GuidePrimaryCalculatorTarget {
  guideSlug: string;
  guideHref: string;
  calculatorPath: string;
  calculatorName: string;
  ctaLabel: string;
  tagline: string;
}

const BASE_URL = 'https://solveitcalculator.com';

export const GUIDE_TARGETS: Record<string, GuideLinkTarget> = {
  'how-to-calculate-a-percentage': {
    slug: 'how-to-calculate-a-percentage',
    href: '/guides/how-to-calculate-a-percentage',
    title: 'How to Calculate a Percentage',
    description: 'Core percent formulas, decimal conversion, and everyday worked examples.',
  },
  'how-to-calculate-percentage-change': {
    slug: 'how-to-calculate-percentage-change',
    href: '/guides/how-to-calculate-percentage-change',
    title: 'How to Calculate Percentage Change (Increase & Decrease)',
    description: 'Relative increase, decrease, percent error, and base-value pitfalls explained.',
  },
  'how-to-simplify-and-calculate-fractions': {
    slug: 'how-to-simplify-and-calculate-fractions',
    href: '/guides/how-to-simplify-and-calculate-fractions',
    title: 'How to Simplify, Add, and Multiply Fractions',
    description: 'GCD reduction, common denominators, mixed numbers, and decimal conversions.',
  },
  'how-to-calculate-ratios-and-averages': {
    slug: 'how-to-calculate-ratios-and-averages',
    href: '/guides/how-to-calculate-ratios-and-averages',
    title: 'How to Calculate Ratios, Proportions, and Averages',
    description: 'Scaling ratios, solving proportions, and comparing mean, median, and mode.',
  },
  'how-to-calculate-compound-interest': {
    slug: 'how-to-calculate-compound-interest',
    href: '/guides/how-to-calculate-compound-interest',
    title: 'How to Calculate Compound Interest and Investment Growth',
    description: 'Compounding frequency, real return vs. inflation, and exponential growth math.',
  },
  'how-to-calculate-loan-and-mortgage-payments': {
    slug: 'how-to-calculate-loan-and-mortgage-payments',
    href: '/guides/how-to-calculate-loan-and-mortgage-payments',
    title: 'How to Calculate Monthly Loan and Mortgage Payments',
    description: 'Standard amortization formula, PITI escrow breakdown, and payoff math.',
  },
  'how-to-calculate-discounts-and-profit-margin': {
    slug: 'how-to-calculate-discounts-and-profit-margin',
    href: '/guides/how-to-calculate-discounts-and-profit-margin',
    title: 'How to Calculate Retail Discounts, Profit Margin, and Markup',
    description: 'Sale prices, gross margin vs. markup formulas, and break-even pricing.',
  },
  'how-to-measure-room-area-and-flooring': {
    slug: 'how-to-measure-room-area-and-flooring',
    href: '/guides/how-to-measure-room-area-and-flooring',
    title: 'How to Measure Room Area, Flooring, and Paint Coverage',
    description: 'Square footage, cubic yards, waste factors, and material box counts.',
  },
  'how-to-convert-metric-and-imperial-units': {
    slug: 'how-to-convert-metric-and-imperial-units',
    href: '/guides/how-to-convert-metric-and-imperial-units',
    title: 'How to Convert Metric and Imperial Units Accurately',
    description: 'Exact SI conversion factors for length, weight, volume, temperature, and speed.',
  },
  'how-to-calculate-bmi-and-daily-calories': {
    slug: 'how-to-calculate-bmi-and-daily-calories',
    href: '/guides/how-to-calculate-bmi-and-daily-calories',
    title: 'How to Calculate BMI and Daily Calorie Needs (TDEE)',
    description: 'BMI formula and limitations, BMR equations, activity multipliers, and ideal weight.',
  },
  'how-to-calculate-exact-age-and-date-difference': {
    slug: 'how-to-calculate-exact-age-and-date-difference',
    href: '/guides/how-to-calculate-exact-age-and-date-difference',
    title: 'How to Calculate Exact Age and Days Between Two Dates',
    description: 'Calendar-aware date subtraction, leap years, business days, and time duration math.',
  },
  'how-to-estimate-401k-and-retirement-growth': {
    slug: 'how-to-estimate-401k-and-retirement-growth',
    href: '/guides/how-to-estimate-401k-and-retirement-growth',
    title: 'How to Estimate 401(k) and Retirement Savings Growth',
    description: 'Employer match, Roth vs. Traditional tax trade-offs, RMDs, and the 4% rule.',
  },
  'how-to-calculate-net-salary-and-sales-tax': {
    slug: 'how-to-calculate-net-salary-and-sales-tax',
    href: '/guides/how-to-calculate-net-salary-and-sales-tax',
    title: 'How to Calculate Net Salary, Take-Home Pay, and Sales Tax / GST',
    description: 'Progressive tax brackets, payroll withholdings, hourly pay, and take-home estimates.',
  },
};

export const CALCULATOR_CATALOG: Record<string, CalculatorCatalogEntry> = {
  '/calculation-workspace': {
    path: '/calculation-workspace',
    name: 'Calculation Workspace',
    description: 'Multi-step expression scratchpad with running subtotals and history.',
  },
  '/mortgage-calculator': {
    path: '/mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Monthly PITI mortgage payment, PMI, and full amortization breakdown.',
  },
  '/loan-calculator': {
    path: '/loan-calculator',
    name: 'Loan Calculator',
    description: 'Monthly installment payments, total interest, and extra-payment savings.',
  },
  '/compound-interest-calculator': {
    path: '/compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description: 'Project savings growth across daily, monthly, or annual compounding.',
  },
  '/salary-calculator': {
    path: '/salary-calculator',
    name: 'Salary & Take-Home Pay Calculator',
    description: 'Estimate net paycheck after federal, state, and statutory payroll taxes.',
  },
  '/fire-forecaster': {
    path: '/fire-forecaster',
    name: 'FIRE Forecaster',
    description: 'Model Financial Independence targets, Coast FIRE, and safe withdrawal timelines.',
  },
  '/construction-project-calculator': {
    path: '/construction-project-calculator',
    name: 'Construction Project Calculator',
    description: 'Calculate concrete cubic yards, gravel tonnage, fence posts, and waste.',
  },
  '/home-construction/flooring-calculator': {
    path: '/home-construction/flooring-calculator',
    name: 'Flooring Calculator',
    description: 'Estimate room square footage, waste allowance, box count, and project cost.',
  },
  '/recipe-converter': {
    path: '/recipe-converter',
    name: 'Recipe Converter',
    description: 'Scale servings and convert cups to grams using USDA ingredient densities.',
  },
  '/bmi-calculator': {
    path: '/bmi-calculator',
    name: 'BMI Calculator',
    description: 'Adult Body Mass Index and WHO healthy weight range in Metric or US units.',
  },
  '/tdee-calculator': {
    path: '/tdee-calculator',
    name: 'TDEE Calorie Calculator',
    description: 'Daily energy expenditure and calorie targets for maintenance, loss, or gain.',
  },
  '/bmr-calculator': {
    path: '/bmr-calculator',
    name: 'BMR Calculator',
    description: 'Resting basal metabolic rate using the Mifflin-St Jeor equation.',
  },
  '/body-fat-calculator': {
    path: '/body-fat-calculator',
    name: 'Body Fat Percentage Calculator',
    description: 'Estimate body fat percentage and lean mass via the U.S. Navy method.',
  },
  '/ideal-weight-calculator': {
    path: '/ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    description: 'Healthy reference weight range by height using Devine, Robinson, and BMI formulas.',
  },
  '/date-difference-calculator': {
    path: '/date-difference-calculator',
    name: 'Date Difference Calculator',
    description: 'Count exact years, months, weeks, and days between any two dates.',
  },
  '/days-from-today-calculator': {
    path: '/days-from-today-calculator',
    name: 'Days From Today Calculator',
    description: 'Add or subtract days, weeks, or months from today or any start date.',
  },
  '/business-days-calculator': {
    path: '/business-days-calculator',
    name: 'Business Days Calculator',
    description: 'Count working weekdays between dates while excluding weekends.',
  },
  '/age-calculator': {
    path: '/age-calculator',
    name: 'Age Calculator',
    description: 'Exact chronological age in years, months, weeks, and days from birth date.',
  },
  '/countdown-calculator': {
    path: '/countdown-calculator',
    name: 'Countdown Calculator',
    description: 'Track exact days, hours, and minutes remaining until any target date.',
  },
  '/time-duration-calculator': {
    path: '/time-duration-calculator',
    name: 'Time Duration Calculator',
    description: 'Add, subtract, or find elapsed hours, minutes, and seconds between timestamps.',
  },
  '/work-hours-calculator': {
    path: '/work-hours-calculator',
    name: 'Work Hours Calculator',
    description: 'Sum weekly timesheet shifts, unpaid breaks, and gross pay totals.',
  },
  '/timer-stopwatch': {
    path: '/timer-stopwatch',
    name: 'Timer & Stopwatch',
    description: 'Precision online countdown timer and lap stopwatch.',
  },
  '/military-time-converter': {
    path: '/military-time-converter',
    name: 'Military Time Converter',
    description: 'Convert between 24-hour military time and 12-hour AM/PM clock format.',
  },
  '/time-unit-converter': {
    path: '/time-unit-converter',
    name: 'Time Unit Converter',
    description: 'Convert seconds, minutes, hours, days, weeks, months, and years.',
  },
  '/finance/take-home-pay-calculator': {
    path: '/finance/take-home-pay-calculator',
    name: 'Take-Home Pay Calculator',
    description: 'Break down net salary per paycheck, month, and year after taxes.',
  },
  '/finance/salary-to-hourly-calculator': {
    path: '/finance/salary-to-hourly-calculator',
    name: 'Salary to Hourly Calculator',
    description: 'Convert annual salary into hourly, daily, weekly, and biweekly rates.',
  },
  '/finance/overtime-pay-calculator': {
    path: '/finance/overtime-pay-calculator',
    name: 'Overtime Pay Calculator',
    description: 'Compute regular wages plus 1.5× or 2× overtime earnings per pay period.',
  },
  '/finance/pay-raise-calculator': {
    path: '/finance/pay-raise-calculator',
    name: 'Pay Raise Calculator',
    description: 'Measure annual and monthly salary increases from percentage or flat raises.',
  },
  '/finance/bonus-tax-calculator': {
    path: '/finance/bonus-tax-calculator',
    name: 'Bonus Tax Calculator',
    description: 'Estimate supplemental federal, FICA, and state withholding on bonuses.',
  },
  '/finance/1099-vs-w2-calculator': {
    path: '/finance/1099-vs-w2-calculator',
    name: '1099 vs W-2 Calculator',
    description: 'Compare freelance contractor net income against salaried W-2 compensation.',
  },
  '/finance/us-federal-income-tax-calculator': {
    path: '/finance/us-federal-income-tax-calculator',
    name: 'US Federal Income Tax Calculator',
    description: 'Calculate marginal bracket, effective tax rate, and federal liability.',
  },
  '/finance/us-state-take-home-calculator': {
    path: '/finance/us-state-take-home-calculator',
    name: 'US State Take-Home Calculator',
    description: 'Compare after-tax paycheck across all 50 U.S. states.',
  },
  '/finance/self-employment-tax-calculator': {
    path: '/finance/self-employment-tax-calculator',
    name: 'Self-Employment Tax Calculator',
    description: 'Estimate Schedule SE Social Security, Medicare, and deduction amounts.',
  },
  '/finance/capital-gains-tax-calculator': {
    path: '/finance/capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator',
    description: 'Estimate short-term vs. long-term capital gains tax on investment sales.',
  },
  '/finance/uk-paye-calculator': {
    path: '/finance/uk-paye-calculator',
    name: 'UK PAYE Tax Calculator',
    description: 'Estimate UK Income Tax, National Insurance, and net take-home salary.',
  },
  '/finance/canada-income-tax-calculator': {
    path: '/finance/canada-income-tax-calculator',
    name: 'Canada Income Tax Calculator',
    description: 'Calculate Canadian federal, provincial tax, CPP, and EI deductions.',
  },
  '/finance/india-income-tax-calculator': {
    path: '/finance/india-income-tax-calculator',
    name: 'India Income Tax Calculator',
    description: 'Compare Old vs. New Tax Regime slabs, rebates, and cess in India.',
  },
  '/finance/in-hand-salary-calculator': {
    path: '/finance/in-hand-salary-calculator',
    name: 'In-Hand Salary Calculator',
    description: 'Convert CTC to monthly in-hand take-home pay with PF and tax deductions.',
  },
  '/finance/hra-exemption-calculator': {
    path: '/finance/hra-exemption-calculator',
    name: 'HRA Exemption Calculator',
    description: 'Compute Section 10(13A) House Rent Allowance tax exemption in India.',
  },
  '/finance/india-capital-gains-tax-calculator': {
    path: '/finance/india-capital-gains-tax-calculator',
    name: 'India Capital Gains Tax Calculator',
    description: 'Estimate STCG and LTCG tax on Indian equities, mutual funds, and property.',
  },
  '/finance/germany-income-tax-calculator': {
    path: '/finance/germany-income-tax-calculator',
    name: 'Germany Income Tax Calculator',
    description: 'Estimate German Einkommensteuer, social contributions, and net salary.',
  },
  '/finance/france-income-tax-calculator': {
    path: '/finance/france-income-tax-calculator',
    name: 'France Income Tax Calculator',
    description: 'Calculate French progressive income tax brackets and net take-home pay.',
  },
  '/finance/singapore-income-tax-calculator': {
    path: '/finance/singapore-income-tax-calculator',
    name: 'Singapore Income Tax Calculator',
    description: 'Estimate IRAS resident income tax and CPF take-home pay.',
  },
  '/finance/uae-income-tax-calculator': {
    path: '/finance/uae-income-tax-calculator',
    name: 'UAE Income Tax Calculator',
    description: 'Model tax-free UAE net compensation and housing/allowance breakdown.',
  },
  '/finance/401k-calculator': {
    path: '/finance/401k-calculator',
    name: '401(k) Retirement Calculator',
    description: 'Project 401(k) balance with employee contributions and employer matching.',
  },
  '/finance/roth-vs-traditional-calculator': {
    path: '/finance/roth-vs-traditional-calculator',
    name: 'Roth vs Traditional Calculator',
    description: 'Compare after-tax retirement wealth under Roth vs. Traditional accounts.',
  },
  '/finance/rmd-calculator': {
    path: '/finance/rmd-calculator',
    name: 'RMD Calculator',
    description: 'Compute IRS Required Minimum Distributions using Uniform Lifetime divisors.',
  },
  '/finance/safe-withdrawal-rate-calculator': {
    path: '/finance/safe-withdrawal-rate-calculator',
    name: 'Safe Withdrawal Rate Calculator',
    description: 'Calculate annual and monthly retirement withdrawals at 3% to 5% SWR.',
  },
  '/finance/investment-growth-calculator': {
    path: '/finance/investment-growth-calculator',
    name: 'Investment Growth Calculator',
    description: 'Forecast portfolio compounding with initial capital and recurring deposits.',
  },
  '/finance/real-rate-of-return-calculator': {
    path: '/finance/real-rate-of-return-calculator',
    name: 'Real Rate of Return Calculator',
    description: 'Adjust nominal investment yields for inflation using the Fisher equation.',
  },
  '/finance/home-affordability-calculator': {
    path: '/finance/home-affordability-calculator',
    name: 'Home Affordability Calculator',
    description: 'Determine maximum home price using the 28/36 debt-to-income rule.',
  },
  '/finance/refinance-calculator': {
    path: '/finance/refinance-calculator',
    name: 'Mortgage Refinance Calculator',
    description: 'Calculate monthly savings, break-even month, and lifetime refinance gain.',
  },
  '/finance/rent-vs-buy-calculator': {
    path: '/finance/rent-vs-buy-calculator',
    name: 'Rent vs Buy Calculator',
    description: 'Compare total multi-year wealth impact of renting vs. buying a home.',
  },
  '/finance/profit-margin-calculator': {
    path: '/finance/profit-margin-calculator',
    name: 'Profit Margin Calculator',
    description: 'Compute gross, operating, and net profit margin from revenue and cost.',
  },
  '/finance/margin-calculator': {
    path: '/finance/margin-calculator',
    name: 'Margin Calculator',
    description: 'Solve selling price, gross profit, and gross margin percentage.',
  },
  '/finance/markup-calculator': {
    path: '/finance/markup-calculator',
    name: 'Markup Calculator',
    description: 'Calculate retail price from cost and markup percentage alongside margin.',
  },
  '/finance/break-even-calculator': {
    path: '/finance/break-even-calculator',
    name: 'Break-Even Calculator',
    description: 'Find break-even units and revenue from fixed costs and contribution margin.',
  },
  '/conversions/length': {
    path: '/conversions/length',
    name: 'Length Converter',
    description: 'Convert millimeters, centimeters, meters, inches, feet, yards, and miles.',
  },
  '/conversions/weight': {
    path: '/conversions/weight',
    name: 'Weight & Mass Converter',
    description: 'Convert grams, kilograms, ounces, pounds, stones, and metric tons.',
  },
  '/conversions/temperature': {
    path: '/conversions/temperature',
    name: 'Temperature Converter',
    description: 'Convert Celsius, Fahrenheit, and Kelvin with exact linear formulas.',
  },
  '/conversions/cooking': {
    path: '/conversions/cooking',
    name: 'Cooking Measurement Converter',
    description: 'Convert teaspoons, tablespoons, cups, fluid ounces, and milliliters.',
  },
  '/conversions/volume': {
    path: '/conversions/volume',
    name: 'Volume Converter',
    description: 'Convert liters, milliliters, gallons, quarts, pints, and cubic feet.',
  },
  '/conversions/area': {
    path: '/conversions/area',
    name: 'Area Converter',
    description: 'Convert square feet, square meters, acres, hectares, and square yards.',
  },
  '/conversions/speed': {
    path: '/conversions/speed',
    name: 'Speed Converter',
    description: 'Convert mph, km/h, m/s, knots, and feet per second.',
  },
  '/conversions/digital': {
    path: '/conversions/digital',
    name: 'Digital Storage Converter',
    description: 'Convert bits, bytes, KB, MB, GB, TB, and binary IEC units.',
  },
  '/conversions/energy': {
    path: '/conversions/energy',
    name: 'Energy Converter',
    description: 'Convert joules, kilojoules, calories, kWh, and BTUs.',
  },
  '/conversions/fuel-economy': {
    path: '/conversions/fuel-economy',
    name: 'Fuel Economy Converter',
    description: 'Convert MPG (US & UK), L/100km, and km/L accurately.',
  },
  '/conversions/torque': {
    path: '/conversions/torque',
    name: 'Torque Converter',
    description: 'Convert Newton-meters, foot-pounds, and inch-pounds.',
  },
  '/science/force-calculator': {
    path: '/science/force-calculator',
    name: 'Force Calculator',
    description: 'Solve Newton’s Second Law (F = m × a) for force, mass, or acceleration.',
  },
  '/science/ohms-law-calculator': {
    path: '/science/ohms-law-calculator',
    name: "Ohm's Law Calculator",
    description: 'Calculate voltage, current, resistance, and electrical power (V = I × R).',
  },
  '/science/molarity-calculator': {
    path: '/science/molarity-calculator',
    name: 'Molarity Calculator',
    description: 'Calculate solution concentration (M = mol ÷ L), solute mass, and dilution.',
  },
  '/science/density-calculator': {
    path: '/science/density-calculator',
    name: 'Density Calculator',
    description: 'Solve density, mass, or volume using ρ = m ÷ V.',
  },
  '/math/percentage-calculator': {
    path: '/math/percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Find X% of Y, what percent A is of B, and step-by-step percent math.',
  },
  '/math/percentage-change-calculator': {
    path: '/math/percentage-change-calculator',
    name: 'Percentage Change Calculator',
    description: 'Compute percentage increase or decrease between an initial and new value.',
  },
  '/math/discount-calculator': {
    path: '/math/discount-calculator',
    name: 'Discount Calculator',
    description: 'Calculate sale price, dollar savings, and stacked discounts with tax.',
  },
  '/math/percent-error-calculator': {
    path: '/math/percent-error-calculator',
    name: 'Percent Error Calculator',
    description: 'Measure relative experimental error against an accepted theoretical value.',
  },
  '/math/percentage-to-decimal-calculator': {
    path: '/math/percentage-to-decimal-calculator',
    name: 'Percentage to Decimal Calculator',
    description: 'Convert any percentage directly to a decimal by dividing by 100.',
  },
  '/math/percentage-to-fraction-calculator': {
    path: '/math/percentage-to-fraction-calculator',
    name: 'Percentage to Fraction Calculator',
    description: 'Convert percentages into simplified lowest-term fractions.',
  },
  '/math/fraction-calculator': {
    path: '/math/fraction-calculator',
    name: 'Fraction Calculator',
    description: 'Add, subtract, multiply, divide, and simplify fractions with steps.',
  },
  '/math/fraction-to-decimal-calculator': {
    path: '/math/fraction-to-decimal-calculator',
    name: 'Fraction to Decimal Calculator',
    description: 'Convert simple and mixed fractions into exact or rounded decimals.',
  },
  '/math/ratio-calculator': {
    path: '/math/ratio-calculator',
    name: 'Ratio Calculator',
    description: 'Simplify ratios, solve proportions (A:B = C:D), and scale quantities.',
  },
  '/math/average-calculator': {
    path: '/math/average-calculator',
    name: 'Average Calculator',
    description: 'Calculate arithmetic mean, median, mode, sum, and range of a dataset.',
  },
  '/math/scientific-calculator': {
    path: '/math/scientific-calculator',
    name: 'Scientific Calculator',
    description: 'Evaluate trigonometry, logarithms, roots, powers, and order of operations.',
  },
  '/math/square-root-calculator': {
    path: '/math/square-root-calculator',
    name: 'Square Root Calculator',
    description: 'Compute principal square roots, nth roots, and radical simplifications.',
  },
  '/math/exponent-calculator': {
    path: '/math/exponent-calculator',
    name: 'Exponent Calculator',
    description: 'Evaluate positive, negative, and fractional powers (bⁿ) step by step.',
  },
  '/math/log-calculator': {
    path: '/math/log-calculator',
    name: 'Logarithm Calculator',
    description: 'Compute base-10, natural (ln), binary, and custom-base logarithms.',
  },
  '/math/absolute-value-calculator': {
    path: '/math/absolute-value-calculator',
    name: 'Absolute Value Calculator',
    description: 'Evaluate |x| distance from zero and absolute difference equations.',
  },
  '/math/gcd-and-lcm-calculator': {
    path: '/math/gcd-and-lcm-calculator',
    name: 'GCD & LCM Calculator',
    description: 'Find greatest common divisor and least common multiple via Euclidean steps.',
  },
  '/math/equation-solver': {
    path: '/math/equation-solver',
    name: 'Equation Solver',
    description: 'Solve linear algebraic equations for x with step-by-step isolation.',
  },
  '/math/quadratic-equation-calculator': {
    path: '/math/quadratic-equation-calculator',
    name: 'Quadratic Equation Calculator',
    description: 'Solve ax² + bx + c = 0 using the quadratic formula and discriminant.',
  },
  '/math/matrix-calculator': {
    path: '/math/matrix-calculator',
    name: 'Matrix Calculator',
    description: 'Add, multiply, transpose, and find determinants of matrices.',
  },
};

interface RawMappingRow {
  path: string;
  guides: string[];
  related: [string, string, string];
}

const RAW_INTERNAL_LINK_ROWS: RawMappingRow[] = [
  // Flagship & Top-Level Tools (9 including calculation-workspace)
  {
    path: '/calculation-workspace',
    guides: ['how-to-calculate-a-percentage', 'how-to-calculate-ratios-and-averages'],
    related: ['/math/scientific-calculator', '/math/percentage-calculator', '/math/equation-solver'],
  },
  {
    path: '/mortgage-calculator',
    guides: ['how-to-calculate-loan-and-mortgage-payments', 'how-to-calculate-compound-interest'],
    related: ['/loan-calculator', '/finance/home-affordability-calculator', '/finance/refinance-calculator'],
  },
  {
    path: '/loan-calculator',
    guides: ['how-to-calculate-loan-and-mortgage-payments', 'how-to-calculate-compound-interest'],
    related: ['/mortgage-calculator', '/compound-interest-calculator', '/finance/refinance-calculator'],
  },
  {
    path: '/compound-interest-calculator',
    guides: ['how-to-calculate-compound-interest', 'how-to-estimate-401k-and-retirement-growth'],
    related: ['/finance/investment-growth-calculator', '/finance/401k-calculator', '/finance/real-rate-of-return-calculator'],
  },
  {
    path: '/salary-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/take-home-pay-calculator', '/finance/us-federal-income-tax-calculator', '/finance/salary-to-hourly-calculator'],
  },
  {
    path: '/fire-forecaster',
    guides: ['how-to-estimate-401k-and-retirement-growth', 'how-to-calculate-compound-interest'],
    related: ['/finance/safe-withdrawal-rate-calculator', '/finance/401k-calculator', '/compound-interest-calculator'],
  },
  {
    path: '/construction-project-calculator',
    guides: ['how-to-measure-room-area-and-flooring', 'how-to-convert-metric-and-imperial-units'],
    related: ['/home-construction/flooring-calculator', '/conversions/area', '/conversions/volume'],
  },
  {
    path: '/home-construction/flooring-calculator',
    guides: ['how-to-measure-room-area-and-flooring'],
    related: ['/construction-project-calculator', '/conversions/area', '/conversions/length'],
  },
  {
    path: '/recipe-converter',
    guides: ['how-to-convert-metric-and-imperial-units', 'how-to-calculate-ratios-and-averages'],
    related: ['/conversions/cooking', '/conversions/weight', '/conversions/volume'],
  },

  // Health & Fitness Standalone Tools (5)
  {
    path: '/bmi-calculator',
    guides: ['how-to-calculate-bmi-and-daily-calories'],
    related: ['/ideal-weight-calculator', '/body-fat-calculator', '/tdee-calculator'],
  },
  {
    path: '/tdee-calculator',
    guides: ['how-to-calculate-bmi-and-daily-calories'],
    related: ['/bmr-calculator', '/bmi-calculator', '/ideal-weight-calculator'],
  },
  {
    path: '/bmr-calculator',
    guides: ['how-to-calculate-bmi-and-daily-calories'],
    related: ['/tdee-calculator', '/bmi-calculator', '/body-fat-calculator'],
  },
  {
    path: '/body-fat-calculator',
    guides: ['how-to-calculate-bmi-and-daily-calories'],
    related: ['/bmi-calculator', '/ideal-weight-calculator', '/tdee-calculator'],
  },
  {
    path: '/ideal-weight-calculator',
    guides: ['how-to-calculate-bmi-and-daily-calories'],
    related: ['/bmi-calculator', '/body-fat-calculator', '/tdee-calculator'],
  },

  // Date & Time Standalone Tools (10)
  {
    path: '/date-difference-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/age-calculator', '/days-from-today-calculator', '/business-days-calculator'],
  },
  {
    path: '/days-from-today-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/date-difference-calculator', '/business-days-calculator', '/countdown-calculator'],
  },
  {
    path: '/business-days-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/date-difference-calculator', '/days-from-today-calculator', '/work-hours-calculator'],
  },
  {
    path: '/age-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/date-difference-calculator', '/days-from-today-calculator', '/countdown-calculator'],
  },
  {
    path: '/countdown-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/date-difference-calculator', '/days-from-today-calculator', '/timer-stopwatch'],
  },
  {
    path: '/time-duration-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/work-hours-calculator', '/time-unit-converter', '/military-time-converter'],
  },
  {
    path: '/work-hours-calculator',
    guides: ['how-to-calculate-exact-age-and-date-difference', 'how-to-calculate-net-salary-and-sales-tax'],
    related: ['/time-duration-calculator', '/finance/salary-to-hourly-calculator', '/finance/overtime-pay-calculator'],
  },
  {
    path: '/timer-stopwatch',
    guides: ['how-to-calculate-exact-age-and-date-difference'],
    related: ['/countdown-calculator', '/time-duration-calculator', '/time-unit-converter'],
  },
  {
    path: '/military-time-converter',
    guides: ['how-to-calculate-exact-age-and-date-difference', 'how-to-convert-metric-and-imperial-units'],
    related: ['/time-duration-calculator', '/time-unit-converter', '/work-hours-calculator'],
  },
  {
    path: '/time-unit-converter',
    guides: ['how-to-convert-metric-and-imperial-units', 'how-to-calculate-exact-age-and-date-difference'],
    related: ['/time-duration-calculator', '/military-time-converter', '/date-difference-calculator'],
  },

  // Finance, Payroll, Tax, Retirement & Business Tools (33)
  {
    path: '/finance/take-home-pay-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/us-federal-income-tax-calculator', '/finance/us-state-take-home-calculator'],
  },
  {
    path: '/finance/salary-to-hourly-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/overtime-pay-calculator', '/finance/take-home-pay-calculator', '/work-hours-calculator'],
  },
  {
    path: '/finance/overtime-pay-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/salary-to-hourly-calculator', '/work-hours-calculator', '/finance/take-home-pay-calculator'],
  },
  {
    path: '/finance/pay-raise-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax', 'how-to-calculate-percentage-change'],
    related: ['/finance/take-home-pay-calculator', '/finance/salary-to-hourly-calculator', '/math/percentage-change-calculator'],
  },
  {
    path: '/finance/bonus-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/take-home-pay-calculator', '/finance/us-federal-income-tax-calculator', '/finance/pay-raise-calculator'],
  },
  {
    path: '/finance/1099-vs-w2-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/self-employment-tax-calculator', '/finance/take-home-pay-calculator', '/finance/us-federal-income-tax-calculator'],
  },
  {
    path: '/finance/us-federal-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/us-state-take-home-calculator', '/finance/take-home-pay-calculator', '/finance/capital-gains-tax-calculator'],
  },
  {
    path: '/finance/us-state-take-home-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/us-federal-income-tax-calculator', '/finance/take-home-pay-calculator', '/salary-calculator'],
  },
  {
    path: '/finance/self-employment-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/1099-vs-w2-calculator', '/finance/us-federal-income-tax-calculator', '/finance/take-home-pay-calculator'],
  },
  {
    path: '/finance/capital-gains-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax', 'how-to-calculate-compound-interest'],
    related: ['/finance/us-federal-income-tax-calculator', '/finance/investment-growth-calculator', '/finance/india-capital-gains-tax-calculator'],
  },
  {
    path: '/finance/uk-paye-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/take-home-pay-calculator', '/finance/canada-income-tax-calculator'],
  },
  {
    path: '/finance/canada-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/take-home-pay-calculator', '/finance/uk-paye-calculator'],
  },
  {
    path: '/finance/india-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/in-hand-salary-calculator', '/finance/hra-exemption-calculator', '/finance/india-capital-gains-tax-calculator'],
  },
  {
    path: '/finance/in-hand-salary-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/india-income-tax-calculator', '/finance/hra-exemption-calculator', '/salary-calculator'],
  },
  {
    path: '/finance/hra-exemption-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/india-income-tax-calculator', '/finance/in-hand-salary-calculator', '/finance/india-capital-gains-tax-calculator'],
  },
  {
    path: '/finance/india-capital-gains-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax', 'how-to-calculate-compound-interest'],
    related: ['/finance/india-income-tax-calculator', '/finance/capital-gains-tax-calculator', '/finance/investment-growth-calculator'],
  },
  {
    path: '/finance/germany-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/france-income-tax-calculator', '/finance/uk-paye-calculator'],
  },
  {
    path: '/finance/france-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/germany-income-tax-calculator', '/finance/uk-paye-calculator'],
  },
  {
    path: '/finance/singapore-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/uae-income-tax-calculator', '/finance/take-home-pay-calculator'],
  },
  {
    path: '/finance/uae-income-tax-calculator',
    guides: ['how-to-calculate-net-salary-and-sales-tax'],
    related: ['/salary-calculator', '/finance/singapore-income-tax-calculator', '/finance/take-home-pay-calculator'],
  },
  {
    path: '/finance/401k-calculator',
    guides: ['how-to-estimate-401k-and-retirement-growth', 'how-to-calculate-compound-interest'],
    related: ['/finance/roth-vs-traditional-calculator', '/fire-forecaster', '/compound-interest-calculator'],
  },
  {
    path: '/finance/roth-vs-traditional-calculator',
    guides: ['how-to-estimate-401k-and-retirement-growth', 'how-to-calculate-net-salary-and-sales-tax'],
    related: ['/finance/401k-calculator', '/finance/rmd-calculator', '/fire-forecaster'],
  },
  {
    path: '/finance/rmd-calculator',
    guides: ['how-to-estimate-401k-and-retirement-growth'],
    related: ['/finance/401k-calculator', '/finance/roth-vs-traditional-calculator', '/finance/safe-withdrawal-rate-calculator'],
  },
  {
    path: '/finance/safe-withdrawal-rate-calculator',
    guides: ['how-to-estimate-401k-and-retirement-growth', 'how-to-calculate-compound-interest'],
    related: ['/fire-forecaster', '/finance/401k-calculator', '/finance/rmd-calculator'],
  },
  {
    path: '/finance/investment-growth-calculator',
    guides: ['how-to-calculate-compound-interest', 'how-to-estimate-401k-and-retirement-growth'],
    related: ['/compound-interest-calculator', '/finance/real-rate-of-return-calculator', '/finance/401k-calculator'],
  },
  {
    path: '/finance/real-rate-of-return-calculator',
    guides: ['how-to-calculate-compound-interest'],
    related: ['/compound-interest-calculator', '/finance/investment-growth-calculator', '/fire-forecaster'],
  },
  {
    path: '/finance/home-affordability-calculator',
    guides: ['how-to-calculate-loan-and-mortgage-payments'],
    related: ['/mortgage-calculator', '/finance/rent-vs-buy-calculator', '/finance/refinance-calculator'],
  },
  {
    path: '/finance/refinance-calculator',
    guides: ['how-to-calculate-loan-and-mortgage-payments'],
    related: ['/mortgage-calculator', '/loan-calculator', '/finance/home-affordability-calculator'],
  },
  {
    path: '/finance/rent-vs-buy-calculator',
    guides: ['how-to-calculate-loan-and-mortgage-payments', 'how-to-calculate-compound-interest'],
    related: ['/mortgage-calculator', '/finance/home-affordability-calculator', '/compound-interest-calculator'],
  },
  {
    path: '/finance/profit-margin-calculator',
    guides: ['how-to-calculate-discounts-and-profit-margin'],
    related: ['/finance/margin-calculator', '/finance/markup-calculator', '/finance/break-even-calculator'],
  },
  {
    path: '/finance/margin-calculator',
    guides: ['how-to-calculate-discounts-and-profit-margin'],
    related: ['/finance/profit-margin-calculator', '/finance/markup-calculator', '/finance/break-even-calculator'],
  },
  {
    path: '/finance/markup-calculator',
    guides: ['how-to-calculate-discounts-and-profit-margin', 'how-to-calculate-a-percentage'],
    related: ['/finance/margin-calculator', '/finance/profit-margin-calculator', '/math/discount-calculator'],
  },
  {
    path: '/finance/break-even-calculator',
    guides: ['how-to-calculate-discounts-and-profit-margin'],
    related: ['/finance/profit-margin-calculator', '/finance/margin-calculator', '/finance/markup-calculator'],
  },

  // Universal Unit Conversion Calculators (11)
  {
    path: '/conversions/length',
    guides: ['how-to-convert-metric-and-imperial-units', 'how-to-measure-room-area-and-flooring'],
    related: ['/conversions/area', '/conversions/speed', '/home-construction/flooring-calculator'],
  },
  {
    path: '/conversions/weight',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/volume', '/recipe-converter', '/bmi-calculator'],
  },
  {
    path: '/conversions/temperature',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/energy', '/conversions/cooking', '/recipe-converter'],
  },
  {
    path: '/conversions/cooking',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/recipe-converter', '/conversions/volume', '/conversions/weight'],
  },
  {
    path: '/conversions/volume',
    guides: ['how-to-convert-metric-and-imperial-units', 'how-to-measure-room-area-and-flooring'],
    related: ['/conversions/cooking', '/conversions/weight', '/construction-project-calculator'],
  },
  {
    path: '/conversions/area',
    guides: ['how-to-measure-room-area-and-flooring', 'how-to-convert-metric-and-imperial-units'],
    related: ['/home-construction/flooring-calculator', '/conversions/length', '/construction-project-calculator'],
  },
  {
    path: '/conversions/speed',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/length', '/conversions/fuel-economy', '/time-unit-converter'],
  },
  {
    path: '/conversions/digital',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/speed', '/math/exponent-calculator', '/time-unit-converter'],
  },
  {
    path: '/conversions/energy',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/temperature', '/science/force-calculator', '/science/ohms-law-calculator'],
  },
  {
    path: '/conversions/fuel-economy',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/speed', '/conversions/volume', '/conversions/length'],
  },
  {
    path: '/conversions/torque',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/science/force-calculator', '/conversions/energy', '/conversions/length'],
  },

  // Science Calculators (4)
  {
    path: '/science/force-calculator',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/conversions/torque', '/conversions/energy', '/science/density-calculator'],
  },
  {
    path: '/science/ohms-law-calculator',
    guides: ['how-to-convert-metric-and-imperial-units', 'how-to-calculate-ratios-and-averages'],
    related: ['/conversions/energy', '/science/force-calculator', '/math/equation-solver'],
  },
  {
    path: '/science/molarity-calculator',
    guides: ['how-to-convert-metric-and-imperial-units', 'how-to-calculate-ratios-and-averages'],
    related: ['/science/density-calculator', '/conversions/volume', '/conversions/weight'],
  },
  {
    path: '/science/density-calculator',
    guides: ['how-to-convert-metric-and-imperial-units'],
    related: ['/science/molarity-calculator', '/conversions/weight', '/conversions/volume'],
  },

  // Math Calculators (19)
  {
    path: '/math/percentage-calculator',
    guides: ['how-to-calculate-a-percentage', 'how-to-calculate-percentage-change'],
    related: ['/math/percentage-change-calculator', '/math/discount-calculator', '/math/percentage-to-decimal-calculator'],
  },
  {
    path: '/math/percentage-change-calculator',
    guides: ['how-to-calculate-percentage-change', 'how-to-calculate-a-percentage'],
    related: ['/math/percentage-calculator', '/math/percent-error-calculator', '/math/discount-calculator'],
  },
  {
    path: '/math/discount-calculator',
    guides: ['how-to-calculate-discounts-and-profit-margin', 'how-to-calculate-a-percentage'],
    related: ['/math/percentage-calculator', '/finance/margin-calculator', '/finance/markup-calculator'],
  },
  {
    path: '/math/percent-error-calculator',
    guides: ['how-to-calculate-percentage-change', 'how-to-calculate-a-percentage'],
    related: ['/math/percentage-change-calculator', '/math/percentage-calculator', '/math/absolute-value-calculator'],
  },
  {
    path: '/math/percentage-to-decimal-calculator',
    guides: ['how-to-calculate-a-percentage'],
    related: ['/math/percentage-calculator', '/math/percentage-to-fraction-calculator', '/math/fraction-to-decimal-calculator'],
  },
  {
    path: '/math/percentage-to-fraction-calculator',
    guides: ['how-to-calculate-a-percentage', 'how-to-simplify-and-calculate-fractions'],
    related: ['/math/fraction-calculator', '/math/percentage-to-decimal-calculator', '/math/percentage-calculator'],
  },
  {
    path: '/math/fraction-calculator',
    guides: ['how-to-simplify-and-calculate-fractions'],
    related: ['/math/fraction-to-decimal-calculator', '/math/gcd-and-lcm-calculator', '/math/percentage-to-fraction-calculator'],
  },
  {
    path: '/math/fraction-to-decimal-calculator',
    guides: ['how-to-simplify-and-calculate-fractions'],
    related: ['/math/fraction-calculator', '/math/percentage-to-decimal-calculator', '/math/percentage-to-fraction-calculator'],
  },
  {
    path: '/math/ratio-calculator',
    guides: ['how-to-calculate-ratios-and-averages', 'how-to-simplify-and-calculate-fractions'],
    related: ['/math/fraction-calculator', '/math/average-calculator', '/math/percentage-calculator'],
  },
  {
    path: '/math/average-calculator',
    guides: ['how-to-calculate-ratios-and-averages'],
    related: ['/math/ratio-calculator', '/math/percentage-calculator', '/math/scientific-calculator'],
  },
  {
    path: '/math/scientific-calculator',
    guides: ['how-to-calculate-a-percentage', 'how-to-calculate-ratios-and-averages'],
    related: ['/math/exponent-calculator', '/math/log-calculator', '/math/square-root-calculator'],
  },
  {
    path: '/math/square-root-calculator',
    guides: ['how-to-calculate-ratios-and-averages'],
    related: ['/math/exponent-calculator', '/math/scientific-calculator', '/math/quadratic-equation-calculator'],
  },
  {
    path: '/math/exponent-calculator',
    guides: ['how-to-calculate-compound-interest', 'how-to-calculate-ratios-and-averages'],
    related: ['/math/log-calculator', '/math/square-root-calculator', '/math/scientific-calculator'],
  },
  {
    path: '/math/log-calculator',
    guides: ['how-to-calculate-compound-interest'],
    related: ['/math/exponent-calculator', '/math/scientific-calculator', '/math/equation-solver'],
  },
  {
    path: '/math/absolute-value-calculator',
    guides: ['how-to-calculate-percentage-change'],
    related: ['/math/equation-solver', '/math/percent-error-calculator', '/math/scientific-calculator'],
  },
  {
    path: '/math/gcd-and-lcm-calculator',
    guides: ['how-to-simplify-and-calculate-fractions'],
    related: ['/math/fraction-calculator', '/math/ratio-calculator', '/math/fraction-to-decimal-calculator'],
  },
  {
    path: '/math/equation-solver',
    guides: ['how-to-calculate-ratios-and-averages'],
    related: ['/math/quadratic-equation-calculator', '/math/scientific-calculator', '/math/matrix-calculator'],
  },
  {
    path: '/math/quadratic-equation-calculator',
    guides: ['how-to-calculate-ratios-and-averages'],
    related: ['/math/equation-solver', '/math/square-root-calculator', '/math/exponent-calculator'],
  },
  {
    path: '/math/matrix-calculator',
    guides: ['how-to-calculate-ratios-and-averages'],
    related: ['/math/equation-solver', '/math/scientific-calculator', '/math/average-calculator'],
  },
];

export const CALCULATOR_INTERNAL_LINKS_LIST: CalculatorInternalLinkEntry[] =
  RAW_INTERNAL_LINK_ROWS.map((row) => ({
    path: row.path,
    name: CALCULATOR_CATALOG[row.path].name,
    guides: row.guides.map((slug) => GUIDE_TARGETS[slug]),
    relatedCalculators: row.related.map((relPath) => CALCULATOR_CATALOG[relPath]),
  }));

export const CALCULATOR_INTERNAL_LINKS_BY_PATH: Record<
  string,
  CalculatorInternalLinkEntry
> = Object.fromEntries(
  CALCULATOR_INTERNAL_LINKS_LIST.map((entry) => [entry.path, entry])
);

export const GUIDE_PRIMARY_CALCULATORS: Record<
  string,
  GuidePrimaryCalculatorTarget
> = {
  'how-to-calculate-a-percentage': {
    guideSlug: 'how-to-calculate-a-percentage',
    guideHref: '/guides/how-to-calculate-a-percentage',
    calculatorPath: '/math/percentage-calculator',
    calculatorName: 'Percentage Calculator',
    ctaLabel: 'Use the Percentage Calculator',
    tagline: 'Solve X% of Y and step-by-step percent equations instantly.',
  },
  'how-to-calculate-percentage-change': {
    guideSlug: 'how-to-calculate-percentage-change',
    guideHref: '/guides/how-to-calculate-percentage-change',
    calculatorPath: '/math/percentage-change-calculator',
    calculatorName: 'Percentage Change Calculator',
    ctaLabel: 'Use the Percentage Change Calculator',
    tagline: 'Calculate exact percent increase or decrease between two values.',
  },
  'how-to-simplify-and-calculate-fractions': {
    guideSlug: 'how-to-simplify-and-calculate-fractions',
    guideHref: '/guides/how-to-simplify-and-calculate-fractions',
    calculatorPath: '/math/fraction-calculator',
    calculatorName: 'Fraction Calculator',
    ctaLabel: 'Use the Fraction Calculator',
    tagline: 'Add, subtract, multiply, divide, and simplify fractions with steps.',
  },
  'how-to-calculate-ratios-and-averages': {
    guideSlug: 'how-to-calculate-ratios-and-averages',
    guideHref: '/guides/how-to-calculate-ratios-and-averages',
    calculatorPath: '/math/ratio-calculator',
    calculatorName: 'Ratio Calculator',
    ctaLabel: 'Use the Ratio Calculator',
    tagline: 'Scale ratios and solve proportions with automatic GCD simplification.',
  },
  'how-to-calculate-compound-interest': {
    guideSlug: 'how-to-calculate-compound-interest',
    guideHref: '/guides/how-to-calculate-compound-interest',
    calculatorPath: '/compound-interest-calculator',
    calculatorName: 'Compound Interest Calculator',
    ctaLabel: 'Use the Compound Interest Calculator',
    tagline: 'Project savings growth across monthly, daily, or annual compounding.',
  },
  'how-to-calculate-loan-and-mortgage-payments': {
    guideSlug: 'how-to-calculate-loan-and-mortgage-payments',
    guideHref: '/guides/how-to-calculate-loan-and-mortgage-payments',
    calculatorPath: '/mortgage-calculator',
    calculatorName: 'Mortgage Calculator',
    ctaLabel: 'Use the Mortgage Calculator',
    tagline: 'Estimate monthly PITI payments, total interest, and amortization.',
  },
  'how-to-calculate-discounts-and-profit-margin': {
    guideSlug: 'how-to-calculate-discounts-and-profit-margin',
    guideHref: '/guides/how-to-calculate-discounts-and-profit-margin',
    calculatorPath: '/finance/profit-margin-calculator',
    calculatorName: 'Profit Margin Calculator',
    ctaLabel: 'Use the Profit Margin Calculator',
    tagline: 'Compute gross margin, markup, and net profit from revenue and cost.',
  },
  'how-to-measure-room-area-and-flooring': {
    guideSlug: 'how-to-measure-room-area-and-flooring',
    guideHref: '/guides/how-to-measure-room-area-and-flooring',
    calculatorPath: '/home-construction/flooring-calculator',
    calculatorName: 'Flooring Calculator',
    ctaLabel: 'Use the Flooring Calculator',
    tagline: 'Estimate room square footage, waste allowance, and box counts.',
  },
  'how-to-convert-metric-and-imperial-units': {
    guideSlug: 'how-to-convert-metric-and-imperial-units',
    guideHref: '/guides/how-to-convert-metric-and-imperial-units',
    calculatorPath: '/conversions/length',
    calculatorName: 'Length & Unit Converter',
    ctaLabel: 'Use the Unit Converter',
    tagline: 'Convert metric and imperial measurements with NIST precision.',
  },
  'how-to-calculate-bmi-and-daily-calories': {
    guideSlug: 'how-to-calculate-bmi-and-daily-calories',
    guideHref: '/guides/how-to-calculate-bmi-and-daily-calories',
    calculatorPath: '/bmi-calculator',
    calculatorName: 'BMI Calculator',
    ctaLabel: 'Use the BMI Calculator',
    tagline: 'Check adult Body Mass Index and WHO healthy weight range.',
  },
  'how-to-calculate-exact-age-and-date-difference': {
    guideSlug: 'how-to-calculate-exact-age-and-date-difference',
    guideHref: '/guides/how-to-calculate-exact-age-and-date-difference',
    calculatorPath: '/age-calculator',
    calculatorName: 'Age Calculator',
    ctaLabel: 'Use the Age Calculator',
    tagline: 'Calculate exact chronological age in years, months, and days.',
  },
  'how-to-estimate-401k-and-retirement-growth': {
    guideSlug: 'how-to-estimate-401k-and-retirement-growth',
    guideHref: '/guides/how-to-estimate-401k-and-retirement-growth',
    calculatorPath: '/finance/401k-calculator',
    calculatorName: '401(k) Calculator',
    ctaLabel: 'Use the 401(k) Calculator',
    tagline: 'Project retirement savings with employer match and annual limits.',
  },
  'how-to-calculate-net-salary-and-sales-tax': {
    guideSlug: 'how-to-calculate-net-salary-and-sales-tax',
    guideHref: '/guides/how-to-calculate-net-salary-and-sales-tax',
    calculatorPath: '/salary-calculator',
    calculatorName: 'Salary & Take-Home Pay Calculator',
    ctaLabel: 'Use the Salary Calculator',
    tagline: 'Calculate after-tax paycheck across brackets and statutory deductions.',
  },
};

export function getCalculatorInternalLinks(
  pathname: string | null | undefined
): CalculatorInternalLinkEntry | undefined {
  if (!pathname) return undefined;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return CALCULATOR_INTERNAL_LINKS_BY_PATH[normalized];
}

export function getGuidePrimaryCalculator(
  guideSlug: string | null | undefined
): GuidePrimaryCalculatorTarget | undefined {
  if (!guideSlug) return undefined;
  return GUIDE_PRIMARY_CALCULATORS[guideSlug.toLowerCase()];
}

export function generateInternalLinkingCsv(): string {
  const header = 'calculator_url,guide_urls,related_calculator_urls';
  const lines = CALCULATOR_INTERNAL_LINKS_LIST.map((entry) => {
    const calcUrl = `${BASE_URL}${entry.path}`;
    const guideUrls = entry.guides.map((g) => `${BASE_URL}${g.href}`).join(' | ');
    const relUrls = entry.relatedCalculators
      .map((r) => `${BASE_URL}${r.path}`)
      .join(' | ');
    return `"${calcUrl}","${guideUrls}","${relUrls}"`;
  });
  return [header, ...lines].join('\n');
}
