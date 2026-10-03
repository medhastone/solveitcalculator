import { CANONICAL_TOOLS, CANONICAL_CATEGORIES, CanonicalTool } from './registry';
import { ADDITIONAL_HUB_CONFIGS } from './categoryHubConfigsExtended';

export interface HubGuide {
  title: string;
  formula: string;
  formulaDescription: string;
  howItWorks: string[];
  example: {
    scenario: string;
    inputs: Record<string, string>;
    calculation: string;
    result: string;
  };
  commonMistakes: string[];
  practicalTips: string[];
}

export interface HubGoal {
  task: string;
  description: string;
  targetToolTitle: string;
  targetUrl: string;
  badge: string;
}

export interface HubSubcategory {
  id: string;
  name: string;
  path: string;
  description: string;
  representativeToolSlugs: string[];
}

export interface HubFaq {
  question: string;
  answer: string;
}

export interface HubTrust {
  formulasUsed: string;
  sourceReferences: string[];
  assumptions: string[];
  updateProcess: string;
  limitations: string[];
}

export interface HubAfterToolsSection {
  badge?: string;
  subheadingLine1: string;
  subheadingLine2: string;
  paragraph: string;
}

export interface CategoryHubConfig {
  slug: string;
  categoryName: string;
  h1: string;
  intro: string;
  afterToolsSection?: HubAfterToolsSection;
  popularToolSlugs: string[];
  goals: HubGoal[];
  subcategories: HubSubcategory[];
  guides: HubGuide[];
  relatedCategorySlugs: string[];
  faqs: HubFaq[];
  trust: HubTrust;
}

export const BASE_CATEGORY_HUB_CONFIGS: Record<string, CategoryHubConfig> = {
  finance: {
    slug: 'finance',
    categoryName: 'Finance',
    h1: 'Finance Calculators',
    intro: 'Easy and accurate financial calculators for home mortgages, loan payments, investment growth, taxes, and debt payoff.\nInstant payment schedules and simple, transparent math to help you make confident personal and business money decisions.',
    afterToolsSection: {
      badge: 'Complete Guide to Our Finance Tools',
      subheadingLine1: 'Simple, Accurate Financial Planning for Everyone',
      subheadingLine2: 'Clear Tools for Mortgages, Savings, Taxes, and Wealth',
      paragraph: 'SolveItCalculator’s finance tools provide clear, accurate calculators for personal budgeting, home mortgage payments, savings growth, paying off debt, and estimating income taxes. Used by future homeowners, everyday savers, small business owners, and financial planners, these tools take the guesswork out of important money decisions. You can quickly find your monthly mortgage payments, compare fixed versus adjustable loans, see how regular monthly savings grow over time with compound interest, compare the fastest ways to pay off credit cards and loans, and plan how much you can safely spend in retirement. The finance section is organized into nine easy-to-browse topics: Mortgages & Real Estate, Loans & Monthly Payments, Investing & Savings Growth, Retirement Planning, Income & Sales Tax Calculators, Banking Accounts, Savings & Cash Reserves, Credit Cards & Debt Payoff, and Salary & Paycheck.'
    },
    popularToolSlugs: [
      'mortgage-calculator',
      'compound-interest-calculator',
      'investment-calculator',
      'emi-calculator',
      'fire-forecaster'
    ],
    goals: [
      {
        task: 'Find your exact monthly mortgage payment including taxes and insurance',
        description: 'See your principal, interest, property taxes, home insurance, and private mortgage insurance (PMI) broken down month by month.',
        targetToolTitle: 'Mortgage Calculator',
        targetUrl: '/finance/mortgage-calculator',
        badge: 'Home Buying'
      },
      {
        task: 'See how your savings and investments grow with compound interest',
        description: 'Calculate how monthly deposits grow over 5 to 40 years with annual returns and inflation adjustments.',
        targetToolTitle: 'Compound Interest Calculator',
        targetUrl: '/finance/compound-interest-calculator',
        badge: 'Growing Wealth'
      },
      {
        task: 'Find how much money you need to retire comfortably',
        description: 'Calculate your target retirement savings based on your annual spending and safe yearly withdrawal guidelines.',
        targetToolTitle: 'FIRE Forecaster',
        targetUrl: '/finance/fire-forecaster',
        badge: 'Retirement'
      },
      {
        task: 'Calculate monthly loan payments (EMI) and total interest',
        description: 'See payment breakdowns and total interest costs for auto, personal, or business loans.',
        targetToolTitle: 'EMI Calculator',
        targetUrl: '/finance/emi-calculator',
        badge: 'Loans & Debt'
      },
      {
        task: 'Forecast your investment returns and regular monthly deposits',
        description: 'Estimate your future portfolio value, growth over time, and regular contribution returns.',
        targetToolTitle: 'Investment Calculator',
        targetUrl: '/finance/investment-calculator',
        badge: 'Investing'
      }
    ],
    subcategories: [
      {
        id: 'mortgages',
        name: 'Mortgages & Real Estate',
        path: '/finance/mortgages',
        description: 'Fixed-rate and adjustable mortgage calculators, property taxes, home insurance, and home equity schedules.',
        representativeToolSlugs: ['mortgage-calculator']
      },
      {
        id: 'loans',
        name: 'Loans & Monthly Payments',
        path: '/finance/loans',
        description: 'Monthly payment estimators (EMI), interest rate comparisons, and easy payment schedules.',
        representativeToolSlugs: ['emi-calculator']
      },
      {
        id: 'investing',
        name: 'Investing & Savings Growth',
        path: '/finance/investing',
        description: 'Compound interest growth, monthly investment plans, and long-term portfolio forecasts.',
        representativeToolSlugs: ['compound-interest-calculator', 'investment-calculator']
      },
      {
        id: 'retirement',
        name: 'Retirement & Future Planning',
        path: '/finance/retirement',
        description: 'Retirement savings targets, safe yearly spending rules, and long-term savings plans.',
        representativeToolSlugs: ['fire-forecaster']
      },
      {
        id: 'taxes',
        name: 'Tax Calculators & Estimators',
        path: '/finance/taxes',
        description: 'Simple income tax bracket calculators, standard deductions, GST, and sales tax estimates.',
        representativeToolSlugs: ['global-tax-calculator']
      },
      {
        id: 'credit-cards',
        name: 'Credit Cards & Debt Payoff',
        path: '/finance/credit-cards',
        description: 'Debt payoff schedules, minimum payment calculators, and interest-saving strategies.',
        representativeToolSlugs: ['credit-cards-and-revolving']
      }
    ],
    guides: [
      {
        title: 'How Mortgage Monthly Payments Work',
        formula: 'Monthly Payment = Loan Amount × [Monthly Rate × (1 + Monthly Rate)^Months] / [(1 + Monthly Rate)^Months - 1]',
        formulaDescription: 'Where the payment is calculated using your total loan amount, the monthly interest rate (yearly rate ÷ 12), and the total number of months.',
        howItWorks: [
          'Multiply your total loan balance by the monthly interest rate.',
          'Divide by the payment discount factor to find your fixed monthly amount.',
          'Each payment is split: part covers interest owed, and the rest pays down your loan balance.',
          'As your loan balance shrinks, less interest is charged each month, so more of your payment pays off the loan.'
        ],
        example: {
          scenario: '$400,000 30-year fixed-rate mortgage at 6.50% annual interest',
          inputs: { 'Loan Amount': '$400,000', 'Interest Rate': '6.50% yearly', Term: '30 Years (360 Months)' },
          calculation: 'Monthly Payment = 400000 × [0.0054167 × (1.0054167)^360] / [(1.0054167)^360 - 1]',
          result: 'Base monthly principal & interest payment = $2,528.27'
        },
        commonMistakes: [
          'Confusing the headline interest rate with your total APR (which includes lender fees).',
          'Forgetting to budget for property taxes, homeowner insurance, and private mortgage insurance (PMI).',
          'Assuming that equal amounts of principal are paid off in year 1 compared to year 25.'
        ],
        practicalTips: [
          'Making just one extra mortgage payment per year can shorten a 30-year mortgage by 4 to 6 years and save tens of thousands in interest.',
          'Refinancing makes the most sense when the lower interest rate saves you enough money to pay off the closing fees within the time you plan to stay in the home.'
        ]
      },
      {
        title: 'How Compound Interest Helps Your Money Grow',
        formula: 'Future Value = Initial Deposit × (1 + Rate/Periods)^(Total Periods) + Monthly Deposit × Growth Factor',
        formulaDescription: 'Your total balance grows from both your initial deposit and regular monthly additions compounding over time.',
        howItWorks: [
          'Your initial deposit earns interest over time.',
          'The interest earned is added back to your balance, so future interest is calculated on a larger amount.',
          'Regular monthly deposits boost this growth significantly because each new deposit begins earning compound interest right away.'
        ],
        example: {
          scenario: '$10,000 starting balance with $500 monthly savings at an 8% average yearly return over 20 years',
          inputs: { 'Starting Balance': '$10,000', 'Monthly Deposit': '$500', 'Yearly Return': '8%', Horizon: '20 Years' },
          calculation: 'Future Value = 10000(1+0.08/12)^240 + 500[((1+0.08/12)^240 - 1) / (0.08/12)]',
          result: 'Total Savings = $344,570.18 (Your Deposits: $130,000; Total Interest Earned: $214,570.18)'
        },
        commonMistakes: [
          'Forgetting how inflation reduces what your money can buy in the future.',
          'Overlooking how small investment management fees (even 1%) can eat into your total returns over 30 years.'
        ],
        practicalTips: [
          'Set up automatic transfers on payday so you save and invest consistently without having to think about it.',
          'Use tax-advantaged accounts (like 401(k)s, IRAs, or ISAs) whenever possible to keep more of your investment gains.'
        ]
      }
    ],
    relatedCategorySlugs: ['business', 'math', 'time-date', 'conversions'],
    faqs: [
      {
        question: 'What is the difference between an interest rate and APR?',
        answer: 'The interest rate is the basic annual cost of borrowing the money. The Annual Percentage Rate (APR) includes both the interest rate and extra lender fees (like origination fees and closing costs). APR gives you the true, all-in yearly cost of the loan so you can easily compare offers from different lenders.'
      },
      {
        question: 'How do loan payments work in the early years?',
        answer: 'When you start repaying a loan, interest is calculated on the full starting balance, so most of your early monthly payments go toward interest. As you gradually pay down the balance, less interest is charged each month, and a larger portion of each payment goes directly toward paying off the actual loan.'
      },
      {
        question: 'What is the 4% rule in retirement planning?',
        answer: 'The 4% rule is a popular retirement guideline based on historical financial studies. It suggests that if you have a balanced portfolio of stocks and bonds, you can withdraw 4% of your total savings during your first year of retirement, adjust that dollar amount for inflation each year, and have a very high chance of your money lasting at least 30 years.'
      },
      {
        question: 'How accurate are these financial calculators?',
        answer: 'All calculations use standard financial formulas and round numbers to exact dollars and cents (2 decimal places) to give you reliable, real-world numbers without rounding errors.'
      },
      {
        question: 'Can these calculators show what happens if I make extra payments?',
        answer: 'Yes! Our loan and mortgage tools let you test extra monthly, yearly, or one-time payments so you can see exactly how much money you will save on interest and how many months or years you will shave off your loan.'
      },
      {
        question: 'Are the tax calculators based on official tax rules?',
        answer: 'Yes, our tax estimators use official tax brackets and standard deductions (such as IRS publications, HMRC rates, and ATO guidelines). They are great for budgeting and estimating what you might owe, though they are meant for planning rather than official tax filing.'
      }
    ],
    trust: {
      formulasUsed: 'Standard financial equations from government consumer protection guidelines, official tax publications, and widely respected retirement research.',
      sourceReferences: [
        'Consumer Financial Protection Bureau (CFPB) mortgage & loan calculation standards',
        'IRS Publication 15-T (Income Tax Withholding & Deduction Guidelines)',
        'FINRA Foundation standards for compound interest and investing',
        'William Bengen historical retirement research (The 4% Rule)'
      ],
      assumptions: [
        'Interest rates remain constant throughout the loan term unless you choose an adjustable-rate option.',
        'Interest is compounded regularly on schedule (such as monthly or yearly).',
        'Property taxes and insurance costs are estimates based on your input and may change over time.'
      ],
      updateProcess: 'All tax brackets, standard deduction amounts, and benchmark limits are reviewed and updated every year when official government figures are released.',
      limitations: [
        'These calculators are designed for educational and planning purposes and do not replace personalized advice from a licensed financial advisor, CPA, or tax professional.',
        'Actual loan approval and interest rates depend on your credit score, income, and individual lender requirements.'
      ]
    }
  },

  math: {
    slug: 'math',
    categoryName: 'Math',
    h1: 'Math Calculators',
    intro: 'SolveItCalculator’s mathematics and statistics hub offers exact, step-by-step computational engines for algebra, percentages, geometry, trigonometry, calculus, and statistical distributions. Designed for students, researchers, engineers, educators, and working professionals, our math tools provide transparent intermediate steps and formula proofs alongside definitive numerical solutions. Users can calculate percentage increases and decreases, evaluate standard deviations and variances, solve quadratic equations, calculate geometric areas and volumes, and determine combinatorial probabilities. Key subcategories include Algebra & Equations, Statistics & Probability, Geometry & Trigonometry, Percentages & Fractions, and Calculus & Discrete Math.',
    popularToolSlugs: [
      'percentage-calculator',
      'standard-deviation-calculator',
      'scientific-calculator'
    ],
    goals: [
      {
        task: 'Calculate percentage change, markups, and differences',
        description: 'Find percentage increase, decrease, proportion, and discount calculations with clear breakdown.',
        targetToolTitle: 'Percentage Calculator',
        targetUrl: '/math/percentage-calculator',
        badge: 'Everyday Math'
      },
      {
        task: 'Compute sample and population standard deviation',
        description: 'Calculate mean, variance, standard deviation (s and σ), and standard error for datasets.',
        targetToolTitle: 'Standard Deviation Calculator',
        targetUrl: '/math/standard-deviation-calculator',
        badge: 'Statistics'
      },
      {
        task: 'Evaluate complex scientific and trigonometric expressions',
        description: 'Compute logarithms, exponents, powers, roots, and trigonometric radian/degree functions.',
        targetToolTitle: 'Scientific Calculator',
        targetUrl: '/scientific-calculator',
        badge: 'Scientific'
      }
    ],
    subcategories: [
      {
        id: 'percentages',
        name: 'Percentages & Ratios',
        path: '/math/percentage-calculator',
        description: 'Percentage difference, growth rate, margins, and proportion solvers.',
        representativeToolSlugs: ['percentage-calculator']
      },
      {
        id: 'statistics',
        name: 'Statistics & Probability',
        path: '/math/standard-deviation-calculator',
        description: 'Mean, median, mode, standard deviation, variance, and normal distributions.',
        representativeToolSlugs: ['standard-deviation-calculator']
      },
      {
        id: 'scientific',
        name: 'Scientific & Advanced Math',
        path: '/scientific-calculator',
        description: 'Trigonometry, logarithms, exponential notation, and complex number operations.',
        representativeToolSlugs: ['scientific-calculator']
      }
    ],
    guides: [
      {
        title: 'Understanding Percentage Increase and Decrease',
        formula: 'Percentage Change = ((New Value - Old Value) / |Old Value|) × 100%',
        formulaDescription: 'Measures relative change compared to the original baseline reference quantity.',
        howItWorks: [
          'Subtract the original value from the updated value to calculate absolute difference.',
          'Divide the absolute difference by the positive magnitude of the original baseline.',
          'Multiply by 100 to convert the decimal fraction to a standard percentage.'
        ],
        example: {
          scenario: 'A product price rises from $80 to $100',
          inputs: { 'Original Price': '$80', 'New Price': '$100' },
          calculation: '((100 - 80) / 80) × 100% = (20 / 80) × 100% = 0.25 × 100%',
          result: '+25.0% price increase'
        },
        commonMistakes: [
          'Dividing by the new value instead of the original baseline value.',
          'Confusing percentage points with percentage change (e.g. 5% to 6% is a 1 percentage point rise, but a 20% relative increase).'
        ],
        practicalTips: [
          'When reversing a percentage discount, divide the sale price by (1 - discount rate) rather than adding the discount percentage directly.'
        ]
      },
      {
        title: 'Sample vs. Population Standard Deviation (Bessel’s Correction)',
        formula: 'Sample s = √[ Σ(x_i - x̄)² / (N - 1) ] ; Population σ = √[ Σ(x_i - μ)² / N ]',
        formulaDescription: 'Sample standard deviation uses N - 1 in the denominator to correct for downward bias in variance estimation.',
        howItWorks: [
          'Compute the arithmetic mean of all data observations.',
          'Calculate the difference between each data point and the mean, then square each difference.',
          'Sum all squared differences.',
          'Divide by N - 1 for a sample or N for an entire population, then take the square root.'
        ],
        example: {
          scenario: 'Sample dataset of test scores: [10, 12, 14, 16, 18]',
          inputs: { Dataset: '10, 12, 14, 16, 18', Mean: '14.0', 'Sample Size (N)': '5' },
          calculation: 'Sum of squares = (16 + 4 + 0 + 4 + 16) = 40. Sample Variance = 40 / (5 - 1) = 10. s = √10',
          result: 'Sample Standard Deviation s ≈ 3.162'
        },
        commonMistakes: [
          'Using N instead of N - 1 when analyzing sample data drawn from a larger unknown population.',
          'Forgetting to take the square root of variance to return to the original measurement units.'
        ],
        practicalTips: [
          'In standard normal distributions, roughly 68% of data falls within 1 standard deviation, and 95% within 2 standard deviations.'
        ]
      }
    ],
    relatedCategorySlugs: ['conversions', 'finance', 'science', 'technology'],
    faqs: [
      {
        question: 'Why does sample standard deviation divide by N - 1 instead of N?',
        answer: 'Dividing by N - 1 is known as Bessel’s correction. When estimating population variance from a sample, the sample mean is closer to the sample observations than the true unknown population mean is. Dividing by N underestimates the variance; N - 1 provides an unbiased estimator.'
      },
      {
        question: 'How do you calculate a reverse percentage?',
        answer: 'To find the original price before a discount of d%, divide the sale price by (1 - d/100). For example, if an item is $80 after a 20% discount, the original price is $80 ÷ 0.80 = $100.'
      },
      {
        question: 'Are mathematical constants exact in these calculators?',
        answer: 'Calculations utilize full IEEE 754 double-precision representations for π (3.141592653589793), Euler’s number e (2.718281828459045), and mathematical functions with 53 bits of precision.'
      },
      {
        question: 'Can I export or copy intermediate calculation steps?',
        answer: 'Yes, our solvers output clearly marked formulas, substituted values, and intermediate arithmetic steps that can be copied directly for academic or engineering documentation.'
      },
      {
        question: 'What is the difference between mean, median, and mode?',
        answer: 'The mean is the arithmetic average of all numbers. The median is the physical middle value when numbers are sorted in order. The mode is the value that appears most frequently in the dataset.'
      },
      {
        question: 'Does the scientific calculator support radian and degree angle modes?',
        answer: 'Yes, users can toggle seamlessly between Radians (rad) and Degrees (deg) for all trigonometric, inverse trigonometric, and hyperbolic functions.'
      }
    ],
    trust: {
      formulasUsed: 'Rigorous algebraic proofs, NIST statistical definitions, and IEEE 754 floating-point arithmetic.',
      sourceReferences: [
        'NIST/SEMATECH e-Handbook of Statistical Methods',
        'IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)',
        'Abramowitz and Stegun: Handbook of Mathematical Functions'
      ],
      assumptions: [
        'Datasets for statistical models assume real numerical values unless complex mode is explicitly enabled.',
        'Continuous probability distributions assume asymptotic normality where sample sizes satisfy central limit theorems.'
      ],
      updateProcess: 'Computational algorithms are verified against reference test suites from the National Institute of Standards and Technology.',
      limitations: [
        'Extreme numerical values approaching 10^308 or 10^-308 may encounter floating-point overflow or underflow boundaries.'
      ]
    }
  },

  conversions: {
    slug: 'conversions',
    categoryName: 'Conversions',
    h1: 'Unit Conversion Calculators',
    intro: 'SolveItCalculator’s universal unit conversions hub delivers exact, bidirectional transformations across physical dimensions, imperial, US customary, and SI metric standards. Essential for engineers, scientists, culinary professionals, international logistics coordinators, and students, these converters guarantee metrological accuracy according to NIST SP 811 and ISO 80000 guidelines. Users can convert length (meters, feet, inches, centimeters, miles), mass and weight (kilograms, pounds, grams, ounces, stones), liquid volume and capacity (gallons, liters, milliliters, fluid ounces, cups), temperature scales (Celsius, Fahrenheit, Kelvin), speed, pressure, energy, and digital data storage units. The directory spans 14 core scientific domains with instant formula derivations, multiplication conversion factors, and verified dimensional tables.',
    popularToolSlugs: [
      'length-converter',
      'weight-converter',
      'volume-converter',
      'temperature-converter',
      'speed-converter'
    ],
    goals: [
      {
        task: 'Convert between inches, feet, centimeters, and meters',
        description: 'Instantly convert distance and length measurements with exact metric and imperial ratios.',
        targetToolTitle: 'Length Converter',
        targetUrl: '/conversions/length',
        badge: 'Length & Distance'
      },
      {
        task: 'Convert kilograms, grams, pounds, and ounces',
        description: 'Accurate mass conversions for shipping, international recipes, and scientific experiments.',
        targetToolTitle: 'Weight & Mass Converter',
        targetUrl: '/conversions/weight',
        badge: 'Weight & Mass'
      },
      {
        task: 'Convert Celsius, Fahrenheit, and Kelvin',
        description: 'Thermal conversion with visual thermometer scale, formulas, and exact freezing/boiling points.',
        targetToolTitle: 'Temperature Converter',
        targetUrl: '/conversions/temperature',
        badge: 'Thermal'
      },
      {
        task: 'Convert gallons, liters, fluid ounces, and milliliters',
        description: 'Fluid volume conversions for culinary measurements, fuel tanks, and chemical volumes.',
        targetToolTitle: 'Volume Converter',
        targetUrl: '/conversions/volume',
        badge: 'Volume & Capacity'
      },
      {
        task: 'Convert mph, km/h, m/s, and knots',
        description: 'Speed and velocity conversion for automotive, aviation, nautical, and athletic applications.',
        targetToolTitle: 'Speed Converter',
        targetUrl: '/conversions/speed',
        badge: 'Speed & Motion'
      }
    ],
    subcategories: [
      {
        id: 'length',
        name: 'Length & Distance',
        path: '/conversions/length',
        description: 'Meters, inches, feet, centimeters, millimeters, kilometers, miles, and yards.',
        representativeToolSlugs: ['length-converter']
      },
      {
        id: 'weight',
        name: 'Weight & Mass',
        path: '/conversions/weight',
        description: 'Kilograms, pounds, grams, ounces, metric tons, and stones.',
        representativeToolSlugs: ['weight-converter']
      },
      {
        id: 'temperature',
        name: 'Temperature Scales',
        path: '/conversions/temperature',
        description: 'Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R).',
        representativeToolSlugs: ['temperature-converter']
      },
      {
        id: 'volume',
        name: 'Volume & Liquid Capacity',
        path: '/conversions/volume',
        description: 'Liters, gallons (US & Imperial), milliliters, fluid ounces, cups, and cubic meters.',
        representativeToolSlugs: ['volume-converter']
      },
      {
        id: 'speed',
        name: 'Speed & Velocity',
        path: '/conversions/speed',
        description: 'Miles per hour (mph), kilometers per hour (km/h), meters per second (m/s), and knots.',
        representativeToolSlugs: ['speed-converter']
      }
    ],
    guides: [
      {
        title: 'The Exact Imperial-to-Metric International Yard and Pound Agreement',
        formula: '1 inch ≡ 25.4 mm (exact) ; 1 pound (lb) ≡ 0.45359237 kg (exact)',
        formulaDescription: 'Established by the 1959 International Yard and Pound Agreement between the US, UK, Canada, Australia, and New Zealand.',
        howItWorks: [
          'All imperial distance measurements are defined legally as exact multiples of the SI meter.',
          'To convert inches to centimeters: multiply by 2.54 exactly.',
          'To convert pounds to kilograms: multiply by 0.45359237 exactly.'
        ],
        example: {
          scenario: 'Convert 5 feet 10 inches to centimeters',
          inputs: { Height: '5 ft 10 in (70 total inches)' },
          calculation: '70 in × 2.54 cm/in = 177.8 cm',
          result: '177.8 centimeters exactly'
        },
        commonMistakes: [
          'Using truncated conversion ratios like 2.2 instead of 2.20462262 for high-precision mass transformations.',
          'Confusing US liquid gallons (3.78541 L) with UK Imperial gallons (4.54609 L).'
        ],
        practicalTips: [
          'For rapid mental estimation: 10 cm is approximately 4 inches, and 1 kg is roughly 2.2 lbs.'
        ]
      },
      {
        title: 'Temperature Scale Offset and Ratio Transformations',
        formula: '°F = (°C × 9/5) + 32 ; °C = (°F - 32) × 5/9 ; K = °C + 273.15',
        formulaDescription: 'Temperature conversions require both multiplicative scaling (9/5) and additive origin shifts (+32) because scales have different zero points.',
        howItWorks: [
          'From Celsius to Fahrenheit: multiply the Celsius degree by 1.8 (9/5) and add 32.',
          'From Fahrenheit to Celsius: subtract 32 first to zero the freezing point, then multiply by 5/9 (0.5556).',
          'Absolute zero is defined as 0 Kelvin or -273.15°C.'
        ],
        example: {
          scenario: 'Convert human body temperature 98.6°F to Celsius',
          inputs: { Temperature: '98.6°F' },
          calculation: '(98.6 - 32) × (5 / 9) = 66.6 × 0.555556 = 37.0°C',
          result: '37.0°C exactly'
        },
        commonMistakes: [
          'Multiplying by 9/5 before subtracting 32 when converting from Fahrenheit to Celsius.',
          'Using degree symbols for Kelvin (Kelvin is an absolute thermodynamic unit: write K, not °K).'
        ],
        practicalTips: [
          '-40° is the unique crossover point where both Celsius and Fahrenheit read identically (-40°C = -40°F).'
        ]
      }
    ],
    relatedCategorySlugs: ['math', 'science', 'electrical', 'technology'],
    faqs: [
      {
        question: 'Why is 1 inch exactly 2.54 centimeters?',
        answer: 'Under the 1959 International Yard and Pound Agreement, participating nations standardized the definition of 1 yard as exactly 0.9144 meters. Dividing 0.9144 by 36 inches yields exactly 0.0254 meters or 2.54 centimeters.'
      },
      {
        question: 'What is the difference between a US fluid ounce and an Imperial fluid ounce?',
        answer: 'A US fluid ounce is approximately 29.5735 mL, whereas a British Imperial fluid ounce is approximately 28.4131 mL. A US gallon contains 128 US fl oz (3.785 L), while an Imperial gallon contains 160 Imperial fl oz (4.546 L).'
      },
      {
        question: 'How does digital storage conversion differ between binary (GiB) and decimal (GB)?',
        answer: 'In the International Electrotechnical Commission (IEC) standard, binary prefixes (KiB, MiB, GiB) operate on powers of 2 (1 GiB = 1,024 MiB = 1,073,741,824 bytes). The SI decimal standard (KB, MB, GB) operates on powers of 10 (1 GB = 1,000 MB = 1,000,000,000 bytes).'
      },
      {
        question: 'Can I copy the conversion formula for my own records?',
        answer: 'Yes, every conversion page includes the exact scientific formula, step-by-step mathematical substitution, and multiplication factor.'
      },
      {
        question: 'How are fractional inches handled?',
        answer: 'Our converters accept both decimal input (e.g. 5.625 in) and standard fractional measurements (e.g. 5 5/8 in) with instant conversion to metric equivalents.'
      },
      {
        question: 'Are all conversion factors certified against international standards?',
        answer: 'Yes, all constants and conversion factors are referenced directly from the National Institute of Standards and Technology (NIST Special Publication 811) and ISO 80000.'
      }
    ],
    trust: {
      formulasUsed: 'Linear dimensional transformations using exact NIST SP 811 multiplication constants and ISO 80000 standards.',
      sourceReferences: [
        'NIST Special Publication 811: Guide for the Use of the International System of Units (SI)',
        'ISO 80000: Quantities and units international standard series',
        'BIPM (Bureau International des Poids et Mesures) SI Brochure (9th edition)'
      ],
      assumptions: [
        'Standard atmospheric pressure (101.325 kPa) and standard gravity (9.80665 m/s²) apply to weight-mass conversions.',
        'Fluids are assumed to be pure water at 4°C for standard volume-to-mass approximations where density is 1.000 g/mL.'
      ],
      updateProcess: 'Standards are reviewed against BIPM and NIST metrology publications.',
      limitations: [
        'Density-dependent conversions (e.g., grams to cups of flour vs. sugar) require specific ingredient density selection.'
      ]
    }
  },

  'time-date': {
    slug: 'time-date',
    categoryName: 'Time & Date',
    h1: 'Time & Date Calculators',
    intro: 'SolveItCalculator’s time and date hub provides high-precision chronometry, payroll timesheets, astronomical ephemeris models, and international timezone coordination engines. Designed for remote engineering teams, human resources professionals, project managers, event organizers, and astronomers, these tools resolve complex calendar calculations including Gregorian leap years, daylight saving time (DST) offsets, sexagesimal time arithmetic, and working-day deductions. Users can calculate exact chronological age down to the day and minute, compute gross shift hours with FLSA overtime deductions, measure the duration between historical dates, track retirement countdowns in working days, and calculate astronomical solar and lunar cycles. The suite includes four primary branches: Work Hours & Timesheets, Calendar & Chronometry, Astronomical Ephemeris, and Focus & Productivity Timers.',
    popularToolSlugs: [
      'age-calculator',
      'work-hours',
      'date-difference-calculator',
      'countdown-timer',
      'retirement-countdown'
    ],
    goals: [
      {
        task: 'Calculate exact age in years, months, days, hours, and minutes',
        description: 'Determine chronological age, upcoming milestones, and days lived with leap year precision.',
        targetToolTitle: 'Age Calculator',
        targetUrl: '/time-date/age-calculator',
        badge: 'Chronometry'
      },
      {
        task: 'Calculate timesheet hours, unpaid lunch, and overtime',
        description: 'Track daily clock-in/out shifts, calculate weekly totals, and compute 1.5× FLSA overtime.',
        targetToolTitle: 'Work Hours Calculator',
        targetUrl: '/time-date/work-hours',
        badge: 'Payroll & HR'
      },
      {
        task: 'Count exact days and business days between dates',
        description: 'Compute calendar days, business days, weekends, and holidays between any two historical or future dates.',
        targetToolTitle: 'Date Difference Calculator',
        targetUrl: '/time-date/date-difference-calculator',
        badge: 'Calendar'
      },
      {
        task: 'Track remaining workdays and shifts until retirement',
        description: 'Calculate net shifts until retirement after subtracting accrued PTO, holidays, and weekends.',
        targetToolTitle: 'Retirement Countdown',
        targetUrl: '/time-date/retirement-countdown',
        badge: 'Career Planning'
      },
      {
        task: 'Set a precision live countdown for events or exams',
        description: 'Live ticking chronometer with sound alerts, full-screen mode, and timezone synchronicity.',
        targetToolTitle: 'Countdown Timer',
        targetUrl: '/time-date/countdown-timer',
        badge: 'Timers'
      }
    ],
    subcategories: [
      {
        id: 'work-time',
        name: 'Work Hours & Timesheets',
        path: '/time-date/work-hours',
        description: 'Shift calculators, lunch break deductions, hourly wages, and overtime models under FLSA.',
        representativeToolSlugs: ['work-hours']
      },
      {
        id: 'calendar',
        name: 'Calendar & Chronometry',
        path: '/time-date/age-calculator',
        description: 'Age calculations, days between dates, Julian days, leap years, and sexagesimal time arithmetic.',
        representativeToolSlugs: ['age-calculator', 'date-difference-calculator', 'retirement-countdown']
      },
      {
        id: 'timers',
        name: 'Productivity Timers & Countdowns',
        path: '/time-date/focus-and-break-timers',
        description: 'Pomodoro focus clocks, 52/17 ultradian intervals, and event countdown timers.',
        representativeToolSlugs: ['countdown-timer', 'focus-and-break-timers']
      },
      {
        id: 'astronomy',
        name: 'Astronomical & Ephemeris',
        path: '/time-date/solar-eclipse-calculator',
        description: 'Solar eclipses, sunrise and sunset times, equinoxes, solstices, and lunar phases.',
        representativeToolSlugs: ['solar-eclipse-calculator']
      }
    ],
    guides: [
      {
        title: 'How Gregorian Calendar Intercalary Leap Years Function',
        formula: 'Leap Year = (Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0)',
        formulaDescription: 'The Gregorian reform corrects the 365.2422-day tropical year by adding an intercalary leap day (Feb 29) on qualifying century and quadrennial years.',
        howItWorks: [
          'Years evenly divisible by 4 are leap years.',
          'Century years (ending in 00) are NOT leap years UNLESS they are also evenly divisible by 400.',
          'Year 2000 was a leap year (divisible by 400); Year 1900 was not; Year 2100 will not be a leap year.'
        ],
        example: {
          scenario: 'Test whether years 2024 and 2100 are leap years',
          inputs: { 'Year A': '2024', 'Year B': '2100' },
          calculation: '2024 is divisible by 4 and not a century -> Leap Year (366 days). 2100 is divisible by 100 but not 400 -> Common Year (365 days).',
          result: '2024: Leap Year (366 days); 2100: Common Year (365 days)'
        },
        commonMistakes: [
          'Assuming every 4th century year is skipped instead of retained.',
          'Calculating date differences by multiplying 30.4375 days without true calendar leap-year interpolation.'
        ],
        practicalTips: [
          'For accurate software scheduling across century boundaries, always use ISO 8601 compliant epoch libraries.'
        ]
      },
      {
        title: 'Calculating Gross Work Hours & FLSA Overtime Pay',
        formula: 'Regular Hours = min(40, Gross - Breaks) ; OT Hours = max(0, Gross - Breaks - 40)',
        formulaDescription: 'Under US Fair Labor Standards Act (FLSA), non-exempt employees receive 1.5× regular hourly pay for hours worked exceeding 40 in a workweek.',
        howItWorks: [
          'Sum daily shift intervals: Clock Out Time minus Clock In Time.',
          'Subtract bona fide meal periods (typically 30 to 60 unpaid minutes).',
          'Sum net weekly hours: hours up to 40 are paid at base rate, hours above 40 are paid at 1.5× base rate.'
        ],
        example: {
          scenario: '46 total weekly hours at $25.00/hour base wage',
          inputs: { 'Total Net Hours': '46.0', 'Base Rate': '$25.00/hr' },
          calculation: 'Regular Pay = 40 × $25.00 = $1,000.00. Overtime Pay = 6 × ($25.00 × 1.5) = 6 × $37.50 = $225.00.',
          result: 'Total Gross Compensation = $1,225.00'
        },
        commonMistakes: [
          'Averaging hours across a bi-weekly 80-hour pay period instead of calculating overtime on a strict 7-day workweek.',
          'Deducting short rest breaks (5 to 20 minutes) which are legally compensable under federal labor standards.'
        ],
        practicalTips: [
          'Export timesheet logs weekly in CSV format to maintain transparent compliance records for payroll auditing.'
        ]
      }
    ],
    relatedCategorySlugs: ['finance', 'business', 'math', 'education'],
    faqs: [
      {
        question: 'How do SolveItCalculator time tools account for Daylight Saving Time (DST)?',
        answer: 'Calculators utilize standard UTC timestamps and IANA timezone database offsets. When computing spans across spring forward or fall back dates, duration is calculated in absolute elapsed solar seconds.'
      },
      {
        question: 'What is a Julian Day Number (JDN) in astronomical calculators?',
        answer: 'A Julian Day is a continuous count of days since the beginning of the Julian Period (January 1, 4713 BCE at Greenwich noon). It provides a uniform astronomical timeline without the complications of varying month lengths and calendar reforms.'
      },
      {
        question: 'Are unpaid breaks deducted automatically from timesheet totals?',
        answer: 'Yes. You can specify custom unpaid break durations (e.g. 30, 45, or 60 minutes) for each shift, and the tool deducts them from total gross elapsed shift time.'
      },
      {
        question: 'How is exact age computed when born on February 29th (Leap Day)?',
        answer: 'In common years without a Feb 29, standard legal chronometry recognizes the birthday on March 1st (or February 28th depending on jurisdiction), and our age tool reports exact elapsed days and months.'
      },
      {
        question: 'Can I calculate working days excluding official public holidays?',
        answer: 'Yes. The date difference and retirement countdown tools include country and regional holiday databases to filter out statutory public holidays alongside weekends.'
      },
      {
        question: 'Does the Pomodoro timer support customizable work and break intervals?',
        answer: 'Yes, users can choose standard 25/5 intervals, 50/10 deep-work blocks, or 52/17 ergonomic productivity rhythms with customizable audio cues.'
      }
    ],
    trust: {
      formulasUsed: 'ISO 8601 calendar arithmetic, Gregorian leap year intercalation rules, and FLSA 29 CFR Part 778 labor calculations.',
      sourceReferences: [
        'ISO 8601: Date and time — Representations for information interchange',
        'US Fair Labor Standards Act (FLSA 29 CFR Part 778 - Overtime Compensation)',
        'IERS (International Earth Rotation and Reference Systems Service) Astronomical Conventions'
      ],
      assumptions: [
        'A standard workday is assumed to span 8 hours, and a standard workweek spans 40 hours unless customized.',
        'Local time zone transformations utilize standard IANA time zone rules.'
      ],
      updateProcess: 'IANA time zone definitions and global holiday schedules are reviewed every quarter.',
      limitations: [
        'Local labor regulations or collective bargaining agreements may impose daily overtime rules (e.g. over 8 hours in a day) distinct from standard weekly FLSA rules.'
      ]
    }
  },

  'health-fitness': {
    slug: 'health-fitness-calculators',
    categoryName: 'Health & Fitness',
    h1: 'Health & Fitness Calculators',
    intro: 'SolveItCalculator’s health and physiology hub provides evidence-based computational models for body mass index (BMI), basal metabolic rate (BMR), total daily energy expenditure (TDEE), target heart rate training zones, body fat percentage, and macro-nutritional intake. Used by fitness coaches, runners, healthcare researchers, and individuals pursuing body recomposition, these tools ground physiological estimations in peer-reviewed science from the World Health Organization (WHO), American College of Sports Medicine (ACSM), and CDC. Users can evaluate BMI category thresholds, calculate resting metabolic burn using Mifflin-St Jeor and Katch-McArdle equations, determine cardiovascular training zones (Zone 2 to Zone 5), and calculate running paces. Key subcategories include Anthropometrics & Body Composition, Metabolic Rate & Energy Expenditure, Cardiovascular & Heart Rate Zones, and Athletic Performance.',
    popularToolSlugs: [
      'bmi',
      'bmr-calculator',
      'tdee-calculator',
      'running-pace-calculator',
      'target-heart-rate-calculator'
    ],
    goals: [
      {
        task: 'Calculate Body Mass Index (BMI) and healthy weight range',
        description: 'Determine BMI classification, prime ratio, and healthy weight boundaries for adult height.',
        targetToolTitle: 'BMI Calculator',
        targetUrl: '/health-fitness-calculators/bmi',
        badge: 'Anthropometrics'
      },
      {
        task: 'Calculate Basal Metabolic Rate (BMR) and daily calories',
        description: 'Estimate baseline resting energy expenditure using the validated Mifflin-St Jeor formula.',
        targetToolTitle: 'BMR Calculator',
        targetUrl: '/health-fitness-calculators/bmr',
        badge: 'Metabolism'
      },
      {
        task: 'Calculate Total Daily Energy Expenditure (TDEE)',
        description: 'Determine maintenance calories based on occupational and athletic activity multipliers.',
        targetToolTitle: 'TDEE Calculator',
        targetUrl: '/health-fitness-calculators/tdee',
        badge: 'Nutrition & Energy'
      },
      {
        task: 'Calculate running pace, lap splits, and race finish times',
        description: 'Compute speed, splits per mile/km, and projected finish times for 5K, 10K, half, and full marathons.',
        targetToolTitle: 'Running Pace Calculator',
        targetUrl: '/time-date/running-pace-calculator',
        badge: 'Athletic Training'
      }
    ],
    subcategories: [
      {
        id: 'anthropometrics',
        name: 'Body Composition & Metrics',
        path: '/health-fitness-calculators/bmi',
        description: 'BMI, body fat estimators, waist-to-hip ratios, and ideal body weight formulas.',
        representativeToolSlugs: ['bmi']
      },
      {
        id: 'metabolism',
        name: 'Metabolic & Daily Caloric Expenditure',
        path: '/health-fitness-calculators/bmr',
        description: 'Basal metabolic rate, total daily energy expenditure, and macronutrient targets.',
        representativeToolSlugs: ['bmr', 'tdee']
      },
      {
        id: 'athletics',
        name: 'Athletic & Endurance Training',
        path: '/time-date/running-pace-calculator',
        description: 'Running pace calculators, lap splits, and cardiovascular training zones.',
        representativeToolSlugs: ['running-pace-calculator']
      }
    ],
    guides: [
      {
        title: 'How BMI Is Computed and Its Physiological Boundaries',
        formula: 'BMI = weight (kg) / [height (m)]²  OR  BMI = 703 × weight (lbs) / [height (in)]²',
        formulaDescription: 'Standardized WHO metric for classifying adult weight status into underweight (<18.5), normal (18.5–24.9), overweight (25.0–29.9), and obesity (≥30.0).',
        howItWorks: [
          'Convert body mass to kilograms and height to meters (or use US customary scaling factor 703).',
          'Square the height in meters.',
          'Divide body weight by the squared height to obtain the BMI index value.'
        ],
        example: {
          scenario: 'Adult weighing 75 kg with a height of 1.78 meters',
          inputs: { Weight: '75.0 kg', Height: '1.78 m' },
          calculation: 'BMI = 75 / (1.78 × 1.78) = 75 / 3.1684 = 23.67 kg/m²',
          result: 'BMI = 23.7 (Normal weight category: 18.5 – 24.9)'
        },
        commonMistakes: [
          'Using BMI as a direct measure of body fat in muscular athletes (BMI does not distinguish between lean muscle mass and adipose tissue).',
          'Applying standard adult BMI cutoffs to children and adolescents without CDC age-and-sex growth percentiles.'
        ],
        practicalTips: [
          'Pair BMI measurements with waist-to-height ratio or skinfold calipers for a comprehensive evaluation of metabolic health.'
        ]
      },
      {
        title: 'Mifflin-St Jeor Basal Metabolic Rate (BMR) Equation',
        formula: 'Men: BMR = (10 × kg) + (6.25 × cm) - (5 × age) + 5 ; Women: BMR = (10 × kg) + (6.25 × cm) - (5 × age) - 161',
        formulaDescription: 'Recognized by the Academy of Nutrition and Dietetics as the most clinically reliable resting metabolic equation.',
        howItWorks: [
          'Multiply body weight in kilograms by 10.',
          'Multiply height in centimeters by 6.25 and add to weight score.',
          'Multiply chronological age by 5 and subtract from subtotal.',
          'Add +5 for males or subtract -161 for females to establish baseline resting burn.'
        ],
        example: {
          scenario: '35-year-old male, 80 kg, 180 cm tall',
          inputs: { Gender: 'Male', Weight: '80 kg', Height: '180 cm', Age: '35' },
          calculation: 'BMR = (10 × 80) + (6.25 × 180) - (5 × 35) + 5 = 800 + 1125 - 175 + 5 = 1,755 kcal/day',
          result: 'Basal Metabolic Rate = 1,755 calories/day'
        },
        commonMistakes: [
          'Confusing BMR (resting energy expenditure in a fasted, motionless state) with TDEE (which includes physical activity).',
          'Setting calorie deficits too aggressively below BMR, which can suppress thyroid and metabolic adaptation.'
        ],
        practicalTips: [
          'Multiply BMR by your Physical Activity Level (PAL) factor (1.2 for sedentary up to 1.9 for very active) to determine maintenance calories.'
        ]
      }
    ],
    relatedCategorySlugs: ['time-date', 'science', 'conversions', 'math'],
    faqs: [
      {
        question: 'Why is the Mifflin-St Jeor formula preferred over the older Harris-Benedict equation?',
        answer: 'Validation studies demonstrate that the original 1919 Harris-Benedict equation tends to overestimate resting metabolic rate by approximately 5% in modern populations, while the 1990 Mifflin-St Jeor formula demonstrates superior accuracy within ±10% of indirect calorimetry measurements.'
      },
      {
        question: 'What are the limitations of Body Mass Index (BMI)?',
        answer: 'BMI relies exclusively on height and weight. It does not measure body fat percentage, lean muscle distribution, bone density, or visceral fat. Muscular individuals may be categorized as overweight despite having low body fat.'
      },
      {
        question: 'What are Heart Rate Training Zones (Zone 1 to Zone 5)?',
        answer: 'Training zones divide cardiovascular intensity into percentages of your Maximum Heart Rate (HRmax) or Heart Rate Reserve (Karvonen formula): Zone 1 (50-60% active recovery), Zone 2 (60-70% aerobic endurance & fat oxidation), Zone 3 (70-80% aerobic tempo), Zone 4 (80-90% anaerobic threshold), and Zone 5 (90-100% neuromuscular VO2 max).'
      },
      {
        question: 'How do I calculate running pace for a target marathon time?',
        answer: 'Divide total target finish time in seconds by total race distance (26.2188 miles or 42.195 km). For example, a 4:00:00 marathon requires an average pace of 9:09 per mile (5:41 per kilometer).'
      },
      {
        question: 'Is medical diagnosis provided by these health tools?',
        answer: 'No. All calculations are intended strictly for educational, fitness planning, and informational purposes. They do not constitute clinical diagnosis or personalized medical therapy.'
      },
      {
        question: 'Can I switch between metric and imperial units?',
        answer: 'Yes, all our health calculators support instantaneous switching between kilograms/centimeters and pounds/feet/inches.'
      }
    ],
    trust: {
      formulasUsed: 'World Health Organization (WHO) BMI classifications, Mifflin-St Jeor resting metabolic equations, and ACSM cardiovascular exercise guidelines.',
      sourceReferences: [
        'World Health Organization (WHO) Expert Consultation on Body Mass Index',
        'Mifflin, M. D., et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr.',
        'American College of Sports Medicine (ACSM) Guidelines for Exercise Testing and Prescription (11th Edition)'
      ],
      assumptions: [
        'Calculations assume adult physiological benchmarks (ages 18+) unless pediatric charts are selected.',
        'Metabolic calculations represent population-level averages and individual rates may vary based on endocrine profile.'
      ],
      updateProcess: 'Physiological guidelines and empirical equations are audited against current ACSM, WHO, and CDC published literature.',
      limitations: [
        'Tools do not account for underlying metabolic disorders, pregnancy, or severe fluid retention.'
      ]
    }
  },

  business: {
    slug: 'business',
    categoryName: 'Business',
    h1: 'Business Calculators',
    intro: 'SolveItCalculator’s business calculators hub delivers computational tools for profit margins, break-even analysis, customer acquisition cost (CAC), customer lifetime value (LTV), retail pricing markups, inventory turnover, and commercial payroll. Tailored for startup founders, retail merchants, ecommerce operators, accountants, and commercial executives, these calculators simplify financial feasibility modeling and commercial forecasting. Users can calculate gross and net profit margins, determine exact unit sales required to cover fixed overhead, model SaaS subscriber retention metrics, project cash runway, and compute billable hourly rates. Key subtopics include Profitability & Margins, Pricing & Break-Even, SaaS & Ecommerce Metrics, Working Capital & Cash Flow, and Commercial Payroll.',
    popularToolSlugs: [
      'profit-margin-calculator',
      'break-even-calculator',
      'roi-calculator',
      'billable-hours-calculator',
      'meeting-cost-calculator'
    ],
    goals: [
      {
        task: 'Calculate gross profit margin, net margin, and markup percentage',
        description: 'Determine profit margin on cost versus selling price to ensure healthy retail profitability.',
        targetToolTitle: 'Profit Margin Calculator',
        targetUrl: '/business',
        badge: 'Margins'
      },
      {
        task: 'Find your break-even point in units and sales revenue',
        description: 'Calculate exact unit volume required to cover fixed overhead and variable production costs.',
        targetToolTitle: 'Break-Even Calculator',
        targetUrl: '/business',
        badge: 'Feasibility'
      },
      {
        task: 'Calculate Return on Investment (ROI) and annualized yields',
        description: 'Measure net financial gain relative to capital outlay across marketing campaigns and equipment purchases.',
        targetToolTitle: 'ROI Calculator',
        targetUrl: '/business',
        badge: 'Capital Allocation'
      },
      {
        task: 'Calculate freelance hourly rate to meet annual target income',
        description: 'Factor in non-billable administrative hours, tax burdens, health insurance, and profit margins.',
        targetToolTitle: 'Billable Hours Calculator',
        targetUrl: '/billable-hours-calculator',
        badge: 'Freelance & Consulting'
      }
    ],
    subcategories: [
      {
        id: 'profitability',
        name: 'Margins & Profitability',
        path: '/business',
        description: 'Gross margin, net profit margin, markup on cost, and operating ratio solvers.',
        representativeToolSlugs: ['profit-margin-calculator']
      },
      {
        id: 'pricing',
        name: 'Pricing & Break-Even Analysis',
        path: '/business',
        description: 'Break-even unit volume, target profit pricing, and contribution margin models.',
        representativeToolSlugs: ['break-even-calculator']
      },
      {
        id: 'consulting',
        name: 'Consulting & Hourly Rates',
        path: '/billable-hours-calculator',
        description: 'Billable rate formulas, meeting cost counters, and productivity compensation models.',
        representativeToolSlugs: ['billable-hours-calculator', 'meeting-cost-calculator']
      }
    ],
    guides: [
      {
        title: 'The Critical Difference Between Profit Margin and Markup',
        formula: 'Margin = (Revenue - Cost) / Revenue × 100% ; Markup = (Revenue - Cost) / Cost × 100%',
        formulaDescription: 'Margin expresses profit as a percentage of total selling price; markup expresses profit as a percentage of product cost.',
        howItWorks: [
          'Profit dollar amount is identical in both equations (Selling Price minus Cost).',
          'Margin divides profit by the final selling price (never exceeds 100%).',
          'Markup divides profit by the wholesale cost (can exceed 100% on high-margin goods).'
        ],
        example: {
          scenario: 'Product costs $50 to manufacture and sells for $100',
          inputs: { 'Cost of Goods Sold (COGS)': '$50', 'Retail Price': '$100' },
          calculation: 'Profit = $50. Margin = ($50 / $100) × 100% = 50.0%. Markup = ($50 / $50) × 100% = 100.0%.',
          result: '50% Profit Margin is equivalent to a 100% Markup on Cost'
        },
        commonMistakes: [
          'Applying a 30% markup expecting a 30% margin (a 30% markup on a $100 cost yields a $130 price, which is only a 23.08% margin).',
          'Failing to factor merchant processing fees (2-3%) into net margin calculations.'
        ],
        practicalTips: [
          'To achieve a desired margin M, calculate required selling price: Price = Cost ÷ (1 - Margin).'
        ]
      },
      {
        title: 'Break-Even Volume and Contribution Margin Analysis',
        formula: 'Break-Even Units = Total Fixed Costs / (Price per Unit - Variable Cost per Unit)',
        formulaDescription: 'Calculates the exact unit sales volume at which total revenues equal total combined costs (zero net profit/loss).',
        howItWorks: [
          'Determine total monthly or annual fixed overhead (rent, salaries, software subscriptions).',
          'Calculate contribution margin per unit (Unit Selling Price minus Variable Production Cost).',
          'Divide total fixed overhead by unit contribution margin.'
        ],
        example: {
          scenario: '$20,000 monthly fixed costs, selling for $50/unit with $10 variable cost',
          inputs: { 'Fixed Costs': '$20,000/mo', 'Unit Price': '$50', 'Variable Cost': '$10' },
          calculation: 'Contribution Margin = $50 - $10 = $40/unit. Break-Even Volume = $20,000 / $40 = 500 units.',
          result: '500 units/month required to break even ($25,000 in monthly revenue)'
        },
        commonMistakes: [
          'Treating semi-variable costs (like tiered cloud hosting or overtime wages) as purely fixed overhead.',
          'Ignoring sales tax collections in top-line revenue expectations.'
        ],
        practicalTips: [
          'Every unit sold beyond the break-even threshold contributes 100% of its contribution margin directly to pre-tax operating profit.'
        ]
      }
    ],
    relatedCategorySlugs: ['finance', 'math', 'technology', 'time-date'],
    faqs: [
      {
        question: 'Why does a 50% markup not equal a 50% profit margin?',
        answer: 'Margin is calculated on the selling price, while markup is calculated on the cost. A $100 product marked up 50% sells for $150. The $50 profit divided by the $150 price equals a 33.3% margin.'
      },
      {
        question: 'What is the LTV:CAC ratio and what is considered healthy?',
        answer: 'Customer Lifetime Value (LTV) divided by Customer Acquisition Cost (CAC) measures unit economics efficiency in subscription and recurring revenue businesses. A ratio of 3:1 is widely considered the benchmark for sustainable growth.'
      },
      {
        question: 'How do you calculate burn rate and cash runway for a startup?',
        answer: 'Monthly Gross Burn is total monthly cash expenses; Net Burn is expenses minus monthly cash collections. Cash Runway (in months) equals current available liquid cash reserves divided by monthly Net Burn.'
      },
      {
        question: 'Can I factor in corporate income taxes in break-even modeling?',
        answer: 'Break-even occurs at zero operating income, meaning tax liability is zero at the exact break-even threshold. For target net profit after taxes, adjust required profit: Target Operating Income = Target Net Profit ÷ (1 - Corporate Tax Rate).'
      },
      {
        question: 'How is meeting cost calculated in the workforce tools?',
        answer: 'Meeting Cost = (Average Hourly Compensation × Number of Attendees) × (Meeting Duration in Minutes ÷ 60). It highlights the direct labor cost of organizational meetings.'
      },
      {
        question: 'Are inventory turnover calculations included?',
        answer: 'Yes, Inventory Turnover Ratio is computed as Cost of Goods Sold (COGS) divided by Average Inventory Value, indicating how many times inventory is cycled annually.'
      }
    ],
    trust: {
      formulasUsed: 'Generally Accepted Accounting Principles (GAAP) standard managerial cost accounting equations and standard SaaS financial metrics.',
      sourceReferences: [
        'Managerial Accounting Standards (Garrison, Noreen, Brewer)',
        'Financial Accounting Standards Board (FASB) Revenue Recognition Guidelines',
        'SaaS Capital Metrics Benchmarking Standards'
      ],
      assumptions: [
        'Unit selling prices and variable costs per unit are assumed constant across the analyzed volume range.',
        'Calculations assume linear cost behavior without non-linear volume discount discontinuities unless modeled.'
      ],
      updateProcess: 'Managerial models and financial benchmark standards are reviewed semiannually.',
      limitations: [
        'Tools provide financial models for operational planning and do not substitute for formal certified public accountant (CPA) auditing.'
      ]
    }
  }
};

export const CATEGORY_HUB_CONFIGS: Record<string, CategoryHubConfig> = {
  ...BASE_CATEGORY_HUB_CONFIGS,
  ...ADDITIONAL_HUB_CONFIGS
};

export function getCategoryHubConfig(categorySlug: string): CategoryHubConfig | null {
  const normalized = categorySlug.replace(/^\//, '').replace(/\/$/, '');
  return CATEGORY_HUB_CONFIGS[normalized] || null;
}
