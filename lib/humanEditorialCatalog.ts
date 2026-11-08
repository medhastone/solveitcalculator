export type LayoutArchetype =
  | 'metrology'
  | 'financial-scenario'
  | 'tax-statutory'
  | 'business-margin'
  | 'math-proof'
  | 'personal-lab';

export interface BenchmarkTableConfig {
  heading: string;
  subheading: string;
  columns: [string, string, string, string];
  rows: Array<{
    col1: string;
    col2: string;
    col3: string;
    col4: string;
  }>;
}

export interface PractitionerFieldNote {
  kicker: string;
  heading: string;
  body: string;
  commonMistakeTitle: string;
  commonMistakeText: string;
  proTipTitle: string;
  proTipText: string;
}

export interface CustomSectionHeadings {
  formulaSectionH2: string;
  exampleSectionH2: string;
  howToUseH2: string;
  howItWorksH2: string;
  understandingResultH2: string;
  faqSectionH2: string;
  relatedSectionH2: string;
}

export interface HumanEditorialProfile {
  archetype: LayoutArchetype;
  /** 0, 1, 2, or 3 — controls the vertical DOM order of sections so pages don't share one template */
  sectionOrderVariant: 0 | 1 | 2 | 3;
  headings: CustomSectionHeadings;
  /** Natural human-written narrative override for "How It Works" */
  humanHowItWorksParagraph?: string;
  humanClosingNote?: string;
  /** Natural human-written narrative override for "Understanding Your Result" */
  humanResultContext?: string;
  fieldNote: PractitionerFieldNote;
  benchmarkTable: BenchmarkTableConfig;
}

/**
 * Curated, human-written editorial profiles for individual calculator slugs.
 * Written in a direct, practitioner-grade voice with varied sentence lengths
 * (burstiness), concrete real-world numbers, and zero generic AI filler.
 */
export const HUMAN_PAGE_EDITORIAL_PROFILES: Record<string, HumanEditorialProfile> = {
  'percentage-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: 'The Core Percentage Equation',
      exampleSectionH2: 'Real-World Dollar & Score Walkthrough',
      howToUseH2: 'Quick Steps to Run Your Numbers',
      howItWorksH2: 'Why Moving the Decimal Two Places Works',
      understandingResultH2: 'Mental Math Shortcuts for Everyday Percentages',
      faqSectionH2: 'Common Questions About Percentages',
      relatedSectionH2: 'More Percentage & Ratio Tools',
    },
    humanHowItWorksParagraph:
      'A percentage is just a fraction with 100 locked in the denominator. The word itself comes from the Latin "per centum"—literally "by the hundred." When you need 25% of 200, you are really asking: if I split 200 into 100 equal slices (each worth 2), how much do 25 of those slices add up to? Multiply 25 by 2 and you land on 50.',
    humanClosingNote:
      'In a hurry without a screen? Flip the numbers. Because multiplication is commutative, 8% of 50 is the exact same number as 50% of 8—which is obviously 4.',
    humanResultContext:
      'Check whether your question asks for a share of a whole ("What is 15% of $80?") or a shift between two numbers ("From $80 to $92"). Mixing those two up is the single most common slip on invoices and retail tags.',
    fieldNote: {
      kicker: 'Practitioner Field Note · The Reversible Percentage Trap',
      heading: 'Why a 20% drop followed by a 20% gain leaves you 4% short',
      body: 'Percentages always anchor to the starting number of that specific step. If a $100 stock drops 20%, it falls to $80. If it rallies 20% the next day, that 20% is calculated on $80—adding just $16 to reach $96. To recover from a 20% loss, you actually need a 25% gain ($20 ÷ $80).',
      commonMistakeTitle: 'Adding stacked discounts together',
      commonMistakeText:
        'A store sign offering "30% off, plus an extra 20% off at register" is not 50% off. On a $100 jacket, 30% off drops it to $70, and 20% off $70 subtracts another $14—leaving you at $56 (a 44% total discount).',
      proTipTitle: 'The 10% + 5% restaurant tip split',
      proTipText:
        'To leave a 15% tip in two seconds, move the decimal one spot left for 10% ($46.00 → $4.60), cut that number in half for 5% ($2.30), and add them together ($6.90).',
    },
    benchmarkTable: {
      heading: 'Everyday Percentage, Fraction & Decimal Benchmarks',
      subheading:
        'Memorize these six anchor equivalents to estimate tips, tax, and markdowns in your head.',
      columns: ['Percentage', 'Decimal Multiplier', 'Simplified Fraction', 'Fast Mental Rule'],
      rows: [
        {
          col1: '5%',
          col2: '0.05',
          col3: '1 / 20',
          col4: 'Find 10% (shift decimal 1 left), then divide by 2',
        },
        {
          col1: '12.5%',
          col2: '0.125',
          col3: '1 / 8',
          col4: 'Cut the number in half three times (÷2, ÷2, ÷2)',
        },
        {
          col1: '15%',
          col2: '0.15',
          col3: '3 / 20',
          col4: 'Take 10% of the total and add half of that 10%',
        },
        {
          col1: '20%',
          col2: '0.20',
          col3: '1 / 5',
          col4: 'Divide by 10, then double the result',
        },
        {
          col1: '33.33%',
          col2: '0.3333',
          col3: '1 / 3',
          col4: 'Divide the starting number directly by 3',
        },
        {
          col1: '75%',
          col2: '0.75',
          col3: '3 / 4',
          col4: 'Find 25% (divide by 4) and subtract it from the total',
        },
      ],
    },
  },

  'percentage-change-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'Relative Change Formula (New vs. Baseline)',
      exampleSectionH2: 'Worked Revenue & Price Shift Example',
      howToUseH2: 'Entering Baseline and Final Values',
      howItWorksH2: 'Why the Starting Value Always Sits in the Denominator',
      understandingResultH2: 'Percent Change vs. Percentage Points',
      faqSectionH2: 'Questions on Growth Rates & Decreases',
      relatedSectionH2: 'Related Growth & Comparison Calculators',
    },
    humanHowItWorksParagraph:
      'Every percentage change calculation measures movement relative to where you started. Subtract the old value from the new value to get the raw change, then divide by the absolute value of the old number. A positive result means growth; a negative sign means shrinkage.',
    humanClosingNote:
      'Watch the terminology when reading financial news: if a mortgage rate rises from 4% to 5%, that is a 1 percentage-point rise, but a 25% relative increase ((5 − 4) ÷ 4).',
    fieldNote: {
      kicker: 'Analyst Field Note · Percentage Points vs. Relative Change',
      heading: 'Don’t confuse a 2-point shift with a 2% growth rate',
      body: 'When a company’s profit margin moves from 8% to 10%, executives often debate whether to call it a "2% increase" or a "25% increase." Both describe the same event, but in strict financial reporting, it is a +200 basis-point (+2 percentage point) expansion, which represents a 25% relative jump in margin.',
      commonMistakeTitle: 'Dividing by the new number instead of the original',
      commonMistakeText:
        'If your rent jumps from $1,600 to $2,000, the $400 increase must be divided by the original $1,600 (+25%), never by the new $2,000 (which would understate the hike as 20%).',
      proTipTitle: 'Direct multiplier shortcut',
      proTipText:
        'Divide New ÷ Old directly (2,000 ÷ 1,600 = 1.25). Subtract 1 to get +0.25 (+25%). If New ÷ Old is 0.82, subtract 1 to get −0.18 (−18%).',
    },
    benchmarkTable: {
      heading: 'Loss Recovery Asymmetric Multiplier Table',
      subheading:
        'Because losses shrink your base capital, recovering back to break-even requires a larger percentage gain than the initial drop.',
      columns: ['Initial Drop (%)', 'Value of $1,000 After Drop', 'Gain Required to Break Even', 'Exact Recovery Math'],
      rows: [
        {
          col1: '−10% Loss',
          col2: '$900',
          col3: '+11.11% Gain',
          col4: '$100 needed ÷ $900 base = 11.11%',
        },
        {
          col1: '−20% Loss',
          col2: '$800',
          col3: '+25.00% Gain',
          col4: '$200 needed ÷ $800 base = 25.00%',
        },
        {
          col1: '−25% Loss',
          col2: '$750',
          col3: '+33.33% Gain',
          col4: '$250 needed ÷ $750 base = 33.33%',
        },
        {
          col1: '−50% Loss',
          col2: '$500',
          col3: '+100.00% Gain',
          col4: '$500 needed ÷ $500 base = 100.00% (Double)',
        },
      ],
    },
  },

  'fraction-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Common Denominator & Reduction Rules',
      exampleSectionH2: 'Step-by-Step Fraction Addition & Simplification',
      howToUseH2: 'Working with Numerators and Denominators',
      howItWorksH2: 'Why You Need a Shared Denominator to Add or Subtract',
      understandingResultH2: 'Improper Fractions, Mixed Numbers & Inch Ticks',
      faqSectionH2: 'Fraction Math & Tape Measure Questions',
      relatedSectionH2: 'Related Ratio & Decimal Tools',
    },
    humanHowItWorksParagraph:
      'You cannot add 3/4 of an inch and 5/8 of an inch until both fractions speak the same unit size. The denominator tells you how many slices make a whole; the numerator counts how many slices you hold. Once you scale 3/4 into 6/8, adding 5/8 is just counting eighths: 6 + 5 = 11/8, or 1 and 3/8 inches.',
    humanClosingNote:
      'After adding or multiplying, divide both top and bottom by their Greatest Common Divisor (GCD) so 6/8 reduces cleanly to 3/4.',
    fieldNote: {
      kicker: 'Woodworking & Shop Field Note · Reading 16ths on a Tape Measure',
      heading: 'Why carpenters convert decimals to the nearest 1/16th of an inch',
      body: 'Calculator screens love decimals like 0.6875 inches, but a steel tape measure is marked in halves, quarters, eighths, and sixteenths. To turn the decimal tail (.6875) into a tape-measure fraction, multiply it by 16: 0.6875 × 16 = 11, giving you exactly 11/16 of an inch.',
      commonMistakeTitle: 'Adding denominators straight across',
      commonMistakeText:
        'Writing 1/2 + 1/2 = 2/4 is a classic trap. Two halves of a pizza make 1 whole pizza (2/2), not two-fourths.',
      proTipTitle: 'Dividing fractions: Keep, Change, Flip',
      proTipText:
        'To divide 3/4 by 1/2, keep 3/4, change ÷ to ×, and flip 1/2 into 2/1. Multiply straight across: (3 × 2) / (4 × 1) = 6/4 = 1 ½.',
    },
    benchmarkTable: {
      heading: 'Shop & Kitchen Fraction-to-Decimal Conversion Chart',
      subheading:
        'Standard inch-tape and measuring-cup fractions paired with exact decimal and percentage equivalents.',
      columns: ['Fraction', 'Exact Decimal', 'Percentage', 'Millimeter Equivalent (in → mm)'],
      rows: [
        { col1: '1/16', col2: '0.0625', col3: '6.25%', col4: '1.5875 mm' },
        { col1: '1/8', col2: '0.125', col3: '12.50%', col4: '3.1750 mm' },
        { col1: '1/4', col2: '0.25', col3: '25.00%', col4: '6.3500 mm' },
        { col1: '3/8', col2: '0.375', col3: '37.50%', col4: '9.5250 mm' },
        { col1: '1/2', col2: '0.50', col3: '50.00%', col4: '12.7000 mm' },
        { col1: '3/4', col2: '0.75', col3: '75.00%', col4: '19.0500 mm' },
      ],
    },
  },

  'loan-calculator': {
    archetype: 'financial-scenario',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'Fixed-Rate Loan Amortization Equation',
      exampleSectionH2: 'Worked $25,000 Auto & Personal Loan Breakdown',
      howToUseH2: 'Setting Up Your Principal, APR, and Term',
      howItWorksH2: 'Why Early Payments Go Mostly Toward Interest',
      understandingResultH2: 'How Term Length Trades Monthly Cash Flow Against Total Cost',
      faqSectionH2: 'Borrower Questions on APR, Prepayment & Amortization',
      relatedSectionH2: 'Mortgage & Debt Payoff Calculators',
    },
    humanHowItWorksParagraph:
      'Fixed-rate installment loans—whether for a car, equipment, or debt consolidation—keep your monthly bill identical from month one to the final payoff date. Behind the scenes, however, the split between interest and principal shifts every 30 days. Interest is charged on your remaining balance each month (Balance × APR ÷ 12). As your balance shrinks, the interest slice shrinks too, meaning more of your fixed payment attacks the principal each month.',
    humanClosingNote:
      'Even an extra $50 a month applied directly to principal cuts months off a 5-year loan because it permanently eliminates future interest on that $50.',
    fieldNote: {
      kicker: 'Borrower Field Note · The 72-Month Auto Loan Stretch',
      heading: 'stretching a loan from 48 to 72 months lowers the bill—but spikes total interest by 52%',
      body: 'Dealership finance desks love quoting monthly payments instead of total loan cost. Stretching a $30,000 car loan at 7% APR from 48 months to 72 months drops the monthly payment by $206 (from $718 to $512), which feels easier on a monthly budget. But those two extra years cost an extra $2,390 in pure interest and keep you "underwater" (owing more than the car is worth) much longer.',
      commonMistakeTitle: 'Confusing nominal interest rate with APR',
      commonMistakeText:
        'The advertised note rate only covers interest on the principal. APR folds in mandatory origination fees and prepaid finance charges, making APR the only honest number for comparing two lenders.',
      proTipTitle: 'Make sure extra payments are marked "Principal Only"',
      proTipText:
        'Some loan servicers treat an extra check as "paying next month’s bill early," which still accrues interest on schedule. Always select "Apply to Principal" in your portal.',
    },
    benchmarkTable: {
      heading: 'Term-Length Trade-Off Matrix ($30,000 Loan at 7.00% APR)',
      subheading:
        'See how choosing a shorter or longer repayment horizon changes both your monthly obligation and total interest paid.',
      columns: ['Loan Term', 'Monthly Payment', 'Total Interest Paid', 'Total Cost (Principal + Interest)'],
      rows: [
        {
          col1: '36 Months (3 Yrs)',
          col2: '$926.31 / mo',
          col3: '$3,347.24',
          col4: '$33,347.24',
        },
        {
          col1: '48 Months (4 Yrs)',
          col2: '$718.39 / mo',
          col3: '$4,482.60',
          col4: '$34,482.60',
        },
        {
          col1: '60 Months (5 Yrs)',
          col2: '$594.04 / mo',
          col3: '$5,642.16',
          col4: '$35,642.16',
        },
        {
          col1: '72 Months (6 Yrs)',
          col2: '$511.47 / mo',
          col3: '$6,825.85',
          col4: '$36,825.85',
        },
      ],
    },
  },

  'mortgage-calculator': {
    archetype: 'financial-scenario',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Monthly PITI (Principal, Interest, Taxes & Insurance) Math',
      exampleSectionH2: 'Sample $400,000 Home Purchase Breakdown',
      howToUseH2: 'Entering Home Price, Down Payment & Escrow Costs',
      howItWorksH2: 'Why Principal & Interest Are Only Part of Your Monthly Housing Check',
      understandingResultH2: 'The 20% Down Payment Threshold & Private Mortgage Insurance (PMI)',
      faqSectionH2: 'Homebuyer Questions on Escrow, PMI & 15-vs-30 Year Terms',
      relatedSectionH2: 'Affordability & Refinance Tools',
    },
    humanHowItWorksParagraph:
      'First-time buyers often get blindsided when they only calculate Principal and Interest (P&I). In reality, your lender collects four items every month—known in real estate as PITI: Principal, Interest, Property Taxes, and Homeowners Insurance (plus HOA dues and Private Mortgage Insurance if you put less than 20% down). Taxes and insurance go into an escrow account so the lender can pay your county tax bill and hazard policy on time.',
    humanClosingNote:
      'Property taxes and homeowners insurance are reassessed annually, so even on a 30-year fixed-rate mortgage, your total monthly escrow payment can creep up over time.',
    fieldNote: {
      kicker: 'Homebuyer Field Note · Removing PMI at 80% Loan-to-Value',
      heading: 'You don’t have to refinance to drop Private Mortgage Insurance',
      body: 'Under the US Homeowners Protection Act, once your principal balance reaches 80% of the home’s original purchase price, you can request in writing that your servicer cancel PMI—and they are legally required to terminate it automatically once you hit 78% LTV. On a $350,000 loan, dropping PMI saves roughly $150 to $250 every single month.',
      commonMistakeTitle: 'Using the seller’s old property tax bill to budget',
      commonMistakeText:
        'In many states (like California under Prop 13 or Florida under Save Our Homes), a longtime owner’s taxes are capped low. When you buy the house, the county reassesses the value at your purchase price, which can double the annual tax bill overnight.',
      proTipTitle: 'One extra mortgage payment per year cuts ~4.5 years off a 30-year loan',
      proTipText:
        'Splitting your monthly P&I in half and paying bi-weekly results in 26 half-payments (13 full payments) per year—shaving years off your payoff date without refinancing.',
    },
    benchmarkTable: {
      heading: '15-Year vs. 30-Year Fixed Mortgage Comparison ($360,000 Loan)',
      subheading:
        'Comparing typical rate spreads and total lifetime interest on a $450,000 home with 20% ($90,000) down.',
      columns: ['Mortgage Structure', 'Typical Rate', 'Monthly P&I Payment', 'Lifetime Interest Paid'],
      rows: [
        {
          col1: '30-Year Fixed Standard',
          col2: '6.50% APR',
          col3: '$2,275.44 / mo',
          col4: '$459,160 total interest',
        },
        {
          col1: '30-Year + $250/mo Extra Principal',
          col2: '6.50% APR',
          col3: '$2,525.44 / mo',
          col4: '$338,410 (Saves $120,750 & 6.3 yrs)',
        },
        {
          col1: '20-Year Fixed Intermediate',
          col2: '6.25% APR',
          col3: '$2,631.34 / mo',
          col4: '$271,522 total interest',
        },
        {
          col1: '15-Year Fixed Accelerated',
          col2: '5.85% APR',
          col3: '$3,008.73 / mo',
          col4: '$181,571 (Saves $277,589)',
        },
      ],
    },
  },

  'compound-interest-calculator': {
    archetype: 'financial-scenario',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: 'Compound Growth + Recurring Contribution Formula',
      exampleSectionH2: 'How $10,000 + $300/Month Grows Over 20 Years',
      howToUseH2: 'Setting Initial Balance, Monthly Savings & Compounding Cadence',
      howItWorksH2: 'Why Time in the Market Beats Chasing an Extra 1% Return',
      understandingResultH2: 'Nominal Account Balance vs. Inflation-Adjusted Purchasing Power',
      faqSectionH2: 'Investor Questions on APY, Compounding Frequency & Rule of 72',
      relatedSectionH2: 'Retirement & Savings Goal Calculators',
    },
    humanHowItWorksParagraph:
      'Simple interest only pays you on the money you personally deposited. Compound interest pays you interest on your deposits plus interest on all the previous interest you have already earned. In the first five years, the curve looks almost flat—your own monthly deposits do most of the heavy lifting. By year 15 or 20, the accumulated earnings begin generating more money each year than your paycheck contributions.',
    humanClosingNote:
      'Switching from annual compounding to daily compounding on a 5% high-yield savings account boosts the effective annual yield (APY) from 5.00% to 5.127%—helpful, but far less impactful than starting five years earlier.',
    fieldNote: {
      kicker: 'Investor Field Note · The Rule of 72 & The Cost of Waiting',
      heading: 'Divide 72 by your annual return to see how fast your money doubles',
      body: 'Want to know how long it takes to double a lump sum without opening a spreadsheet? Divide 72 by your annual rate of return. At 8% per year, money doubles every 9 years (72 ÷ 8). Over a 36-year career, that means four doublings ($10,000 → $20k → $40k → $80k → $160k). Waiting just 9 years to start costs you the final doubling—cutting your ending balance from $160,000 in half to $80,000.',
      commonMistakeTitle: 'Forgetting to subtract 2.5%–3% inflation on multi-decade horizons',
      commonMistakeText:
        'A projected $1,000,000 balance in 30 years sounds huge, but at 3% annual inflation its real purchasing power in today’s grocery-store dollars is roughly $412,000.',
      proTipTitle: 'Compare savings accounts by APY, never APR',
      proTipText:
        'APY (Annual Percentage Yield) already bakes in the exact compounding frequency (daily vs. monthly), giving you an apples-to-apples return figure.',
    },
    benchmarkTable: {
      heading: 'Rule of 72 Doubling Time & $10,000 Growth Over 30 Years',
      subheading:
        'How different annual return assumptions affect doubling speed and 30-year lump-sum growth (compounded monthly, before taxes).',
      columns: ['Annual Return (APR)', 'Approximate Doubling Time', '$10,000 After 15 Years', '$10,000 After 30 Years'],
      rows: [
        {
          col1: '4.0% (High-Yield Cash / Bonds)',
          col2: '~18.0 Years',
          col3: '$18,203',
          col4: '$33,135',
        },
        {
          col1: '6.0% (Balanced 60/40 Portfolio)',
          col2: '~12.0 Years',
          col3: '$24,541',
          col4: '$60,226',
        },
        {
          col1: '8.0% (Historical Real Equity Avg)',
          col2: '~9.0 Years',
          col3: '$33,069',
          col4: '$109,357',
        },
        {
          col1: '10.0% (Nominal S&P 500 Long-Term)',
          col2: '~7.2 Years',
          col3: '$44,539',
          col4: '$198,374',
        },
      ],
    },
  },

  'bmi-calculator': {
    archetype: 'personal-lab',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Quetelet BMI, Mifflin-St Jeor BMR & US Navy Body Fat Equations',
      exampleSectionH2: 'Worked Height, Weight & Daily Calorie Example',
      howToUseH2: 'Entering Metric or Imperial Body Measurements',
      howItWorksH2: 'How BMI, Basal Metabolic Rate (BMR) & TDEE Fit Together',
      understandingResultH2: 'What BMI Measures Well—and Where It Misclassifies Athletes',
      faqSectionH2: 'Health & Nutrition Questions on BMI, TDEE & Body Fat',
      relatedSectionH2: 'Age & Daily Planning Calculators',
    },
    humanHowItWorksParagraph:
      'Belgian mathematician Adolphe Quetelet invented the Body Mass Index in the 1830s as a population-level statistical snapshot—never as a solo diagnostic test for an individual athlete. It divides your weight in kilograms by the square of your height in meters (kg/m²). That is why this tool pairs BMI with the Mifflin-St Jeor Basal Metabolic Rate (BMR) and the US Navy circumference method: waist-to-neck ratio catches visceral abdominal fat that scale weight alone misses.',
    humanClosingNote:
      'A 500 kcal/day deficit below your TDEE equates to roughly 3,500 kcal per week—or about 1 pound (0.45 kg) of fat loss per week without extreme crash dieting.',
    fieldNote: {
      kicker: 'Clinical & Coaching Field Note · The Muscle Mass Blind Spot',
      heading: 'Why strength athletes frequently score "Overweight" on a BMI chart at 12% body fat',
      body: 'Skeletal muscle is dense. A 5\'10" (178 cm) rugby player or lifter weighing 205 lbs (93 kg) with a 31-inch waist has a BMI of 29.4—just hair-breadth below the "Obesity Class I" cutoff of 30.0—despite having visible abs and low cardiovascular risk. Conversely, an inactive adult can have a "Normal" 23.5 BMI while carrying elevated visceral fat ("normal-weight obesity"). Always cross-check BMI against waist circumference (ideally under half your height).',
      commonMistakeTitle: 'Eating below your Basal Metabolic Rate (BMR) for weeks',
      commonMistakeText:
        'Your BMR is the energy your brain, heart, liver, and kidneys burn just to keep you alive in bed. Cutting calories far below BMR triggers lean muscle loss and metabolic downregulation.',
      proTipTitle: 'The Waist-to-Height Ratio (WHtR) sanity check',
      proTipText:
        'Measure your waist at the navel and divide by your height in the same units. Keeping your waist under 0.50 of your height (e.g., under 35 inches if you are 70 inches tall) is one of the strongest predictors of cardiometabolic health.',
    },
    benchmarkTable: {
      heading: 'WHO Adult BMI Classifications & Waist-to-Height Cross-Check',
      subheading:
        'Standard World Health Organization adult cutoffs alongside practical body-composition context.',
      columns: ['Category Label', 'BMI Range (kg/m²)', 'Waist-to-Height Sanity Check', 'Practical Interpretation'],
      rows: [
        {
          col1: 'Underweight',
          col2: 'Below 18.5',
          col3: 'WHtR typically < 0.40',
          col4: 'May indicate insufficient caloric reserves or low lean mass',
        },
        {
          col1: 'Normal / Healthy Weight',
          col2: '18.5 – 24.9',
          col3: 'WHtR 0.40 – 0.49',
          col4: 'Lowest population-wide cardiometabolic risk band',
        },
        {
          col1: 'Overweight',
          col2: '25.0 – 29.9',
          col3: 'Check if WHtR < 0.50 (Athletic) vs ≥ 0.50',
          col4: 'Distinguish heavy lean muscle from central adipose tissue',
        },
        {
          col1: 'Obesity (Class I–III)',
          col2: '30.0 and above',
          col3: 'WHtR ≥ 0.53+',
          col4: 'Elevated metabolic strain; focus on sustainable TDEE deficit',
        },
      ],
    },
  },

  'age-calculator': {
    archetype: 'personal-lab',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'Gregorian Calendar Borrowing & Leap-Year Rules',
      exampleSectionH2: 'Worked Chronological Age Calculation Across Month Boundaries',
      howToUseH2: 'Selecting Birth Date and Target Reference Date',
      howItWorksH2: 'Why Calendar Months Cannot Be Divided by a Flat 30.44 Days',
      understandingResultH2: 'Legal Age Milestones, Leap-Day Birthdays & Total Days Lived',
      faqSectionH2: 'Questions on Exact Age, Leap Years & Statutory Cutoffs',
      relatedSectionH2: 'Date Difference & Workday Calculators',
    },
    humanHowItWorksParagraph:
      'Calculating exact age in years, months, and days is trickier than dividing total days by 365.2425 because calendar months vary from 28 to 31 days. Calendar subtraction works from right to left—days first, then months, then years. When the target day-of-month is smaller than your birth day-of-month (say, calculating age on May 10 for someone born on January 25), the algorithm borrows the exact number of days from the month immediately preceding the target date (April’s 30 days) before subtracting.',
    humanClosingNote:
      'For total days lived, the calculator counts every Gregorian leap year (years divisible by 4, except century years not divisible by 400 like 1900) between your birth date and target date.',
    fieldNote: {
      kicker: 'Legal & Administrative Field Note · Leap-Year Birthdays & IRS Age Rules',
      heading: 'When does someone born on February 29 legally turn a year older?',
      body: 'In non-leap years, most common-law jurisdictions (including the UK and the majority of US states) treat March 1 as the legal birthday for someone born on February 29, because their birth occurred after February 28 ended. Meanwhile, for US retirement tax rules (such as catch-up contributions at 50 or penalty-free 59½ withdrawals), the IRS looks at the age you reach by December 31 of that tax year.',
      commonMistakeTitle: 'Dividing total days by 30 to estimate months',
      commonMistakeText:
        'Because seven months have 31 days, dividing a 365-day year by 30 gives "12 months and 5 days"—an error that throws off infant pediatric charts and contract notice periods.',
      proTipTitle: 'Checking age as of a future school or retirement cutoff date',
      proTipText:
        'Change the "Age at the Date of" field from today to September 1 (for school enrollment) or your target retirement date to see your exact age on that milestone day.',
    },
    benchmarkTable: {
      heading: 'Key Statutory, Financial & Retirement Age Milestones (US / International)',
      subheading:
        'Common legal and financial thresholds where exact chronological age in years and months matters.',
      columns: ['Age Milestone', 'Exact Threshold', 'Statutory / Financial Rule', 'Practical Impact'],
      rows: [
        {
          col1: 'Age 50 (Catch-Up Eligible)',
          col2: '50 Years, 0 Months (by Dec 31)',
          col3: 'IRS 401(k) & IRA Catch-Up',
          col4: 'Unlocks higher annual pre-tax / Roth contribution caps',
        },
        {
          col1: 'Age 59½ (Penalty-Free Access)',
          col2: '59 Years, 6 Months',
          col3: 'IRC Section 72(t)',
          col4: 'Ends the 10% early withdrawal penalty on retirement accounts',
        },
        {
          col1: 'Age 62 vs. 67 (Social Security)',
          col2: '62 Earliest / 67 Full Retirement',
          col3: 'SSA Benefit Formula',
          col4: 'Claiming at 62 permanently reduces monthly checks by ~30%',
        },
        {
          col1: 'Age 73 (Mandatory RMDs)',
          col2: '73 Years (SECURE Act 2.0)',
          col3: 'Required Minimum Distributions',
          col4: 'Must begin annual taxable withdrawals from traditional accounts',
        },
      ],
    },
  },

  'discount-calculator': {
    archetype: 'business-margin',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Sale Price, Dollar Savings & Stacked Coupon Math',
      exampleSectionH2: 'Register Walkthrough: Markdown + Promo Code + Sales Tax',
      howToUseH2: 'Entering Sticker Price and Discount Percentage',
      howItWorksH2: 'Why Multiplying by the Complement (1 − Discount%) Is Faster',
      understandingResultH2: 'Does Sales Tax Apply Before or After a Coupon?',
      faqSectionH2: 'Retail Markdown & Stacked Coupon Questions',
      relatedSectionH2: 'Margin, Markup & Percentage Calculators',
    },
    humanHowItWorksParagraph:
      'Instead of calculating 30% of $80 ($24) and then subtracting $24 from $80, retail buyers do it in one step: if 30% is taken off, 70% of the price remains. Multiply $80 × 0.70 and you land directly on the $56 sale price. When a store lets you stack a second coupon—say an extra 15% off—multiply that $56 by 0.85 ($47.60).',
    humanClosingNote:
      'Note that the order in which you apply two percentage discounts never changes the final price ($100 × 0.70 × 0.85 equals $100 × 0.85 × 0.70 = $59.50).',
    fieldNote: {
      kicker: 'Retail & Checkout Field Note · Manufacturer vs. Store Coupons',
      heading: 'Why sales tax sometimes gets charged on the pre-coupon price',
      body: 'In most US states, if a retailer gives you a store markdown or promo code, sales tax is calculated on the discounted price you actually pay. However, if you redeem a manufacturer’s rebate or third-party coupon (where the manufacturer reimburses the store for the difference), state tax laws generally require the register to charge sales tax on the full original price before the coupon is subtracted.',
      commonMistakeTitle: 'Thinking "Buy One, Get One 50% Off" is 50% off your cart',
      commonMistakeText:
        'Buying two $40 shirts under a BOGO 50% promo means paying $40 for the first and $20 for the second ($60 total instead of $80)—which is an effective 25% discount across the two items.',
      proTipTitle: 'Combine a dollar-off coupon before a percentage-off coupon if allowed',
      proTipText:
        'If a store applies a $20 reward certificate after a 20% discount on $100, you pay ($100 × 0.80) − $20 = $60. Applied in reverse, ($100 − $20) × 0.80 = $64.',
    },
    benchmarkTable: {
      heading: 'Common Retail Promo Structures & True Effective Discount',
      subheading:
        'Translating store promotional banners into the actual percentage you save at checkout (assuming equal-priced items).',
      columns: ['Store Promotion Wording', 'Math on $100 Item(s)', 'You Actually Pay', 'True Effective Discount %'],
      rows: [
        { col1: 'Buy 1, Get 1 Free (BOGO)', col2: '2 items ($200 value) for $100', col3: '$50.00 per item', col4: '50.0% Off' },
        { col1: 'Buy 1, Get 1 50% Off', col2: '$100 + $50 = $150 for 2', col3: '$75.00 per item', col4: '25.0% Off' },
        { col1: 'Buy 2, Get 1 Free', col2: '3 items ($300 value) for $200', col3: '$66.67 per item', col4: '33.3% Off' },
        { col1: '30% Off + Extra 20% Off', col2: '$100 × 0.70 × 0.80', col3: '$56.00', col4: '44.0% Off (Not 50%)' },
      ],
    },
  },

  'date-difference-calculator': {
    archetype: 'personal-lab',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Julian Day Count & Business-Day Filtering Logic',
      exampleSectionH2: 'Counting Calendar Days vs. Working Days Across Months',
      howToUseH2: 'Picking Start Date, End Date & Inclusive Day Options',
      howItWorksH2: 'Fencepost Counting: When to Add +1 for Inclusive Dates',
      understandingResultH2: 'Contract Notice Windows, Visa Stays & Project Timelines',
      faqSectionH2: 'Questions on Inclusive Days, Weekends & Leap Years',
      relatedSectionH2: 'Age & Work-Hour Duration Tools',
    },
    humanHowItWorksParagraph:
      'Subtracting March 5 from March 15 gives 10 days—which is the exact span between the two dates. However, if you are booking vacation PTO from March 5 through March 15 inclusive (meaning you are off work on both March 5 and March 15), you are actually taking 11 days off. Mathematicians call this the "Fencepost Error": 10 ten-foot fence panels require 11 fenceposts.',
    humanClosingNote:
      'For Schengen 90/180-day travel rules and hotel bookings, check whether your ruleset counts nights (span = 10) or calendar days touched (inclusive = 11).',
    fieldNote: {
      kicker: 'Contract & Legal Field Note · "30 Days" vs. "1 Calendar Month"',
      heading: 'Why a 30-day escrow deadline and a 1-month deadline land on different dates',
      body: 'Real estate contracts, commercial leases, and court filing rules draw a sharp line between "30 calendar days" and "1 calendar month." Thirty days from January 31 lands on March 2 (or March 1 in a leap year), whereas one calendar month from January 31 snaps to the last day of February (Feb 28 or 29). Furthermore, if a statutory deadline lands on a Saturday, Sunday, or federal holiday, most civil procedure rules roll the due date to the next business day.',
      commonMistakeTitle: 'Off-by-one ("Fencepost") errors on PTO and equipment rentals',
      commonMistakeText:
        'Renting a trencher from Friday morning through Monday afternoon spans 3 nights (Monday − Friday = 3), but the rental yard bills for 4 calendar days because the machine is out on both Friday and Monday.',
      proTipTitle: 'Rule of thumb: 1 calendar year ≈ 260 weekdays (before holidays)',
      proTipText:
        'A 52-week year has 104 weekend days (52 Saturdays + 52 Sundays), leaving 260–261 raw Monday–Friday workdays, or roughly 250 net working days after 10 public holidays.',
    },
    benchmarkTable: {
      heading: 'Standard Calendar & Business-Day Reference Spans',
      subheading:
        'Typical calendar-day vs. weekday counts across common project, legal, and payroll intervals.',
      columns: ['Time Span Label', 'Total Calendar Days', 'Monday–Friday Weekdays', 'Typical Net Workdays (Less Holidays)'],
      rows: [
        { col1: '2-Week Sprint / Pay Period', col2: '14 Days', col3: '10 Weekdays', col4: '9–10 Workdays' },
        { col1: 'Standard 30-Day Notice', col2: '30 Days', col3: '21–22 Weekdays', col4: '20–21 Workdays' },
        { col1: '1 Financial Quarter (Q1–Q4)', col2: '90–92 Days', col3: '64–66 Weekdays', col4: '62–63 Workdays' },
        { col1: 'Standard Non-Leap Year', col2: '365 Days (52w + 1d)', col3: '261 Weekdays', col4: '~250–251 Workdays' },
      ],
    },
  },

  'time-duration-calculator': {
    archetype: 'personal-lab',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: '24-Hour Clock Modulo & Payroll Decimal Conversion',
      exampleSectionH2: 'Worked Shift Calculation With Unpaid Lunch Deduction',
      howToUseH2: 'Entering Clock-In, Clock-Out & Break Minutes',
      howItWorksH2: 'Handling Overnight Shifts That Cross Midnight (00:00)',
      understandingResultH2: 'Clock Format (8h 45m) vs. Payroll Decimal Hours (8.75 hrs)',
      faqSectionH2: 'Timesheet, Overtime & Overnight Shift Questions',
      relatedSectionH2: 'Date & Hourly Paycheck Calculators',
    },
    humanHowItWorksParagraph:
      'Time math uses base-60 (sexagesimal) for minutes and seconds, and base-24 for hours. To find the duration between 08:45 AM and 05:15 PM, convert both timestamps into total minutes since midnight: 08:45 is 525 minutes (8 × 60 + 45) and 17:15 is 1,035 minutes (17 × 60 + 15). Subtract 525 from 1,035 to get 510 minutes—which divides by 60 into 8 hours and 30 minutes (8.50 decimal hours).',
    humanClosingNote:
      'If your clock-out time is earlier than your clock-in time (such as a 10:00 PM to 06:30 AM hospital or warehouse shift), add 1,440 minutes (24 hours) to the end time before subtracting.',
    fieldNote: {
      kicker: 'Payroll & FLSA Field Note · The 7-Minute (Quarter-Hour) Rounding Rule',
      heading: 'How the federal 7-minute rule rounds clock-in punches to 15-minute blocks',
      body: 'Under US Department of Labor (29 CFR § 785.48) rules, employers that round timecard punches to the nearest quarter-hour (15 minutes) must use the 7-minute split so rounding averages out fairly over time. Punches from 1 to 7 minutes past the quarter-hour round back down (e.g., 8:06 AM → 8:00 AM = .00), while punches from 8 to 14 minutes round forward (e.g., 8:08 AM → 8:15 AM = .25).',
      commonMistakeTitle: 'Typing "8.30" into payroll software for an 8-hour, 30-minute shift',
      commonMistakeText:
        'Payroll systems multiply hourly wage by base-10 decimals. Typing 8.30 pays for 8 hours and 18 minutes (0.30 × 60 = 18m), shorting the worker 12 minutes of pay every single shift.',
      proTipTitle: 'Convert minutes to decimal by dividing by 60',
      proTipText:
        'For any minute count, divide by 60: 12 minutes = 0.20 hrs, 20 minutes = 0.33 hrs, 36 minutes = 0.60 hrs, and 48 minutes = 0.80 hrs.',
    },
    benchmarkTable: {
      heading: 'Payroll Minute-to-Decimal Conversion Chart (6-Minute & 15-Minute Increments)',
      subheading:
        'Standard conversion table used by payroll processors, legal billing (1/10th hour = 6 min), and contractor timesheets.',
      columns: ['Clock Minutes', 'Payroll Decimal (÷ 60)', '15-Min Quarter Rounding', 'Legal 6-Min Tenths'],
      rows: [
        { col1: '06 Minutes', col2: '0.10 Hours', col3: 'Rounds to .00 (0m)', col4: '0.1 Billable Hour' },
        { col1: '15 Minutes', col2: '0.25 Hours', col3: 'Exact .25 Quarter', col4: '0.3 Billable Hours (18m)' },
        { col1: '24 Minutes', col2: '0.40 Hours', col3: 'Rounds to .50 (30m)', col4: '0.4 Billable Hours' },
        { col1: '30 Minutes', col2: '0.50 Hours', col3: 'Exact .50 Half-Hour', col4: '0.5 Billable Hours' },
        { col1: '45 Minutes', col2: '0.75 Hours', col3: 'Exact .75 Three-Quarter', col4: '0.8 Billable Hours (48m)' },
        { col1: '54 Minutes', col2: '0.90 Hours', col3: 'Rounds to 1.00 (60m)', col4: '0.9 Billable Hours' },
      ],
    },
  },

  'ratio-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Cross-Multiplication & GCD Ratio Reduction',
      exampleSectionH2: 'Scaling a 16:9 Screen & 4:1 Concrete Mix',
      howToUseH2: 'Solving A : B = C : D or Simplifying Two Numbers',
      howItWorksH2: 'How Ratios Differ From Fractions in Mixing & Scaling',
      understandingResultH2: 'Part-to-Part Ratios vs. Part-to-Whole Shares',
      faqSectionH2: 'Ratio Scaling, Aspect Ratio & Mixing Questions',
      relatedSectionH2: 'Fraction, Proportion & Percentage Calculators',
    },
    humanHowItWorksParagraph:
      'A ratio compares two quantities side by side. When you solve a proportion like 16 : 9 = 1920 : X, cross-multiplication states that the product of the outer terms ("extremes") equals the product of the inner terms ("means"): 16 × X = 9 × 1920. Divide 17,280 by 16 and you get X = 1,080 pixels.',
    humanClosingNote:
      'To reduce a messy ratio like 1920 : 1080 down to its cleanest whole numbers, divide both sides by their Greatest Common Divisor (GCD = 120) to get 16 : 9.',
    fieldNote: {
      kicker: 'Trade & Kitchen Field Note · Part-to-Part vs. Part-to-Whole',
      heading: 'A "1 : 4" dilution ratio means 5 total parts—not 4',
      body: 'Read chemical, concrete, and bar-syrup labels carefully. A "1:4 part-to-part ratio" of concentrate to water means 1 cup of concentrate mixed with 4 cups of water, yielding 5 cups of total solution (a 20% concentration). If you accidentally top the pitcher up to the 4-cup line instead of the 5-cup line, your mix is 25% strong instead of 20%.',
      commonMistakeTitle: 'Adding the same number to both sides to scale a ratio',
      commonMistakeText:
        'Ratios only stay equal when you multiply or divide both sides. Adding 2 to both sides of 2:3 turns it into 4:5 (0.80), which is a completely different proportion from 2:3 (0.667).',
      proTipTitle: 'To split a total budget by a 3 : 2 : 5 ratio, sum the parts first',
      proTipText:
        'Add the ratio parts (3 + 2 + 5 = 10 total shares). Divide your $5,000 budget by 10 ($500 per share), then multiply by 3 ($1,500), 2 ($1,000), and 5 ($2,500).',
    },
    benchmarkTable: {
      heading: 'Common Aspect Ratios, Map Scales & Trade Mixing Ratios',
      subheading:
        'Real-world reference ratios across video displays, photography, 2-stroke engine fuel, and concrete.',
      columns: ['Application Domain', 'Standard Ratio', 'Decimal Quotient (A ÷ B)', 'Real-World Example'],
      rows: [
        { col1: 'HD / 4K Widescreen Video', col2: '16 : 9', col3: '1.7778 : 1', col4: '1920×1080 (FHD) or 3840×2160 (4K)' },
        { col1: '35mm DSLR Photo Sensor', col2: '3 : 2', col3: '1.5000 : 1', col4: '6000×4000 px or 4×6 inch print' },
        { col1: 'Golden Ratio (Design)', col2: '1.618 : 1 (φ)', col3: '1.6180 : 1', col4: '(1 + √5) ÷ 2 architectural proportion' },
        { col1: '2-Stroke Chainsaw Fuel', col2: '50 : 1 (Gas : Oil)', col3: '2.0% Oil Mix', col4: '2.6 fl oz oil per 1 US gallon (128 oz) gas' },
        { col1: 'Standard Structural Concrete', col2: '1 : 2 : 3', col3: '6 Total Parts', col4: '1 part cement, 2 sand, 3 gravel' },
      ],
    },
  },

  'average-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'Arithmetic Mean, Median, Mode & Range Equations',
      exampleSectionH2: 'How a Single Outlier Skews the Mean vs. the Median',
      howToUseH2: 'Pasting Your Dataset or Comma-Separated Numbers',
      howItWorksH2: 'Why Statisticians Always Check Mean and Median Together',
      understandingResultH2: 'When to Trust the Median Over the Simple Average',
      faqSectionH2: 'Questions on Mean, Median, Weighted Averages & Outliers',
      relatedSectionH2: 'Percentage, Scientific & Ratio Calculators',
    },
    humanHowItWorksParagraph:
      'In everyday conversation, "average" almost always means the arithmetic mean: add every number up and divide by how many numbers are in the list. While the mean uses every data point, that is also its Achilles’ heel—one giant number drags the mean upward. Sorting the list from smallest to largest and picking the middle number gives you the median, which refuses to budge when an outlier appears.',
    humanClosingNote:
      'If your list has an even count of numbers (say 6 values), the median is the simple average of the two middle numbers (positions 3 and 4).',
    fieldNote: {
      kicker: 'Data Analysis Field Note · The Billionaire Walks Into a Bar Effect',
      heading: 'Why neighborhood home prices and salaries are always reported as medians, not means',
      body: 'Imagine nine teachers in a coffee shop each earning $60,000 a year. Both the mean and median income in the room are $60,000. If a billionaire earning $100,000,000 walks in to buy an espresso, the "average" (mean) income of the 10 people rockets to $10,054,000—making everyone look like a decamillionaire on paper. The median, however, stays anchored at $60,000.',
      commonMistakeTitle: 'Averaging two averages from unequal group sizes',
      commonMistakeText:
        'If Class A (10 students) averages 90% on an exam and Class B (30 students) averages 70%, the combined average is not 80%. You must weight by student count: (10×90 + 30×70) ÷ 40 = 75%.',
      proTipTitle: 'Compare Mean minus Median to spot skewness instantly',
      proTipText:
        'When Mean > Median, your data has a high-end tail (right-skewed, like income or latency spikes). When Mean ≈ Median, your distribution is roughly symmetrical.',
    },
    benchmarkTable: {
      heading: 'Choosing the Right "Average" Metric for Your Data',
      subheading:
        'Which central-tendency formula gives the honest number for salaries, grades, investment returns, and speeds.',
      columns: ['Metric Name', 'Core Formula', 'Best Used For', 'Failure Mode / Outlier Sensitivity'],
      rows: [
        { col1: 'Arithmetic Mean', col2: 'Σx ÷ n', col3: 'Exam scores, symmetric test measurements', col4: 'Heavily distorted by extreme high/low outliers' },
        { col1: 'Median (Middle Value)', col2: '50th Percentile after sort', col3: 'Home prices, household income, API latency', col4: 'Ignores the exact magnitude of tail values' },
        { col1: 'Mode (Most Frequent)', col2: 'Value with highest count', col3: 'Shoe sizes, inventory SKUs, categorical votes', col4: 'Continuous decimals may have no repeating mode' },
        { col1: 'Weighted Average', col2: 'Σ(wᵢ × xᵢ) ÷ Σwᵢ', col3: 'Course GPA, portfolio cost basis', col4: 'Requires accurate weight totals (Σwᵢ)' },
      ],
    },
  },

  'square-root-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Principal Radical (√x), Nth Root & Fractional Exponents',
      exampleSectionH2: 'Perfect Squares vs. Newton-Raphson Approximation',
      howToUseH2: 'Calculating Square Roots, Cube Roots & Custom Indices',
      howItWorksH2: 'How Computers Converge on Irrational Roots in Five Iterations',
      understandingResultH2: 'Why Every Positive Number Has Two Roots (Principal vs. ±)',
      faqSectionH2: 'Questions on Perfect Squares, Cube Roots & Negative Radicands',
      relatedSectionH2: 'Scientific, Fraction & Algebra Calculators',
    },
    humanHowItWorksParagraph:
      'Taking a square root runs squaring in reverse: √x asks what non-negative number multiplied by itself produces x. When x is a perfect square like 144 (12 × 12) or 225 (15 × 15), the answer is an exact integer. For non-perfect squares like √2, the decimal never ends or repeats (1.41421356...), so calculators use the Babylonian / Newton-Raphson method—averaging a guess g with x/g repeatedly until 15 digits lock in.',
    humanClosingNote:
      'In algebra, the radical symbol √144 strictly denotes the positive "principal" root (+12). You only write ±12 when solving an equation with an even power like x² = 144.',
    fieldNote: {
      kicker: 'Carpentry & Construction Field Note · The 3-4-5 Pythagorean Corner Check',
      heading: 'How framers use √(3² + 4²) = 5 to square a deck or foundation without a protractor',
      body: 'Every right-angle triangle obeys a² + b² = c², which means the diagonal hypotenuse c equals √(a² + b²). On a jobsite, framers measure 3 feet along one wall and 4 feet along the perpendicular wall. Since √(9 + 16) = √25 = 5, if the tape measure across the diagonal reads 5 feet on the dot, the corner is a dead-true 90° angle.',
      commonMistakeTitle: 'Splitting a square root across a plus sign',
      commonMistakeText:
        '√(9 + 16) equals √25 = 5. It does NOT equal √9 + √16 (3 + 4 = 7). You can factor multiplication inside a root (√(9 × 16) = 3 × 4 = 12), never addition.',
      proTipTitle: 'Rewrite any nth root as a fractional exponent',
      proTipText:
        'The square root √x is x^(1/2), the cube root ∛x is x^(1/3), and the fourth root is x^(0.25). This makes chaining powers on any keyboard effortless.',
    },
    benchmarkTable: {
      heading: 'Perfect Squares, Cube Roots & Key Irrational Constants',
      subheading:
        'Essential integer roots and irrational constants that appear across geometry, trigonometry, and engineering.',
      columns: ['Expression', 'Exact or 8-Digit Value', 'Inverse Verification', 'Where It Appears in Practice'],
      rows: [
        { col1: '√2 (Pythagorean Constant)', col2: '1.41421356', col3: '1.41421356² = 2', col4: 'Diagonal of a 1×1 square; ISO A4 paper ratio' },
        { col1: '√3 (Theodorus Constant)', col2: '1.73205081', col3: '1.73205081² = 3', col4: '3-phase AC electrical voltage (480V = 277V × √3)' },
        { col1: '√144 & √169', col2: '12 and 13', col3: '12² = 144; 13² = 169', col4: '5-12-13 right triangle framing check' },
        { col1: '∛27 & ∛64 (Cube Roots)', col2: '3 and 4', col3: '3³ = 27; 4³ = 64', col4: 'Finding box edge length from cubic volume' },
        { col1: '∛(−8) (Odd Root of Negative)', col2: '−2', col3: '(−2) × (−2) × (−2) = −8', col4: 'Odd roots accept negative inputs in real numbers' },
      ],
    },
  },

  'us-federal-income-tax-calculator': {
    archetype: 'tax-statutory',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: 'IRS Progressive Bracket & FICA Payroll Tax Equations',
      exampleSectionH2: 'Worked $95,000 W-2 Single Filer Tax Return & Paycheck',
      howToUseH2: 'Selecting Filing Status, Pre-Tax 401(k)/HSA & Deductions',
      howItWorksH2: 'How the Standard Deduction & Progressive Brackets Slice Your Income',
      understandingResultH2: 'Marginal Tax Bracket vs. Effective Tax Rate (Why Raises Never Lose Money)',
      faqSectionH2: 'US Federal Tax, FICA Social Security Cap & W-4 Questions',
      relatedSectionH2: 'Take-Home Pay, 401(k) & Hourly Calculators',
    },
    humanHowItWorksParagraph:
      'Your gross salary is never taxed at a single flat percentage. First, pre-tax payroll contributions—like traditional 401(k) deferrals and HSA contributions—are subtracted from your W-2 wages. Next, you subtract either the IRS Standard Deduction ($15,000 Single / $30,000 Married Filing Jointly) or your itemized deductions to arrive at your "Taxable Income." Only that remaining taxable income flows through the seven IRS progressive brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%).',
    humanClosingNote:
      'Separate from federal income tax, FICA payroll taxes take 6.2% for Social Security (up to the annual wage base cap) and 1.45% for Medicare from your very first dollar of wages, because the standard deduction does not apply to FICA.',
    fieldNote: {
      kicker: 'CPA & Payroll Field Note · Marginal Bracket vs. Effective Tax Rate',
      heading: 'Being "in the 22% tax bracket" usually means paying an ~11% effective federal tax rate',
      body: 'If a single filer earns $85,000 and takes the $15,000 standard deduction, their taxable income is $70,000. Their top dollars sit in the 22% marginal bracket, so coworkers often assume 22% of their $85,000 paycheck disappears to the IRS. In reality, the first $15,000 is taxed at 0%, the next $11,925 is taxed at 10%, the next $36,550 is taxed at 12%, and only the last $21,525 is taxed at 22%—resulting in a total federal income tax of $10,314, or an effective rate of just 12.1% on gross pay.',
      commonMistakeTitle: 'Thinking bonuses are taxed permanently higher at 22%',
      commonMistakeText:
        'Employers withhold a flat 22% supplemental rate on bonuses when they cut the check, but at tax-return time your bonus is lumped into regular income—any over-withholding is refunded to you.',
      proTipTitle: 'Traditional 401(k) and HSA dollars save tax at your top marginal rate',
      proTipText:
        'If your top dollars are in the 22% or 24% bracket, putting $5,000 into a pre-tax 401(k) or HSA trims $1,100 to $1,200 directly off your federal tax bill.',
    },
    benchmarkTable: {
      heading: 'US Federal Income Tax & FICA Effective Tax Benchmarks (Single Filer, Standard Deduction)',
      subheading:
        'How gross W-2 income translates into taxable income, marginal bracket, and actual federal + FICA burden.',
      columns: ['Gross W-2 Salary', 'Top Marginal Bracket', 'Effective Federal Income Tax %', 'Combined Federal + FICA %'],
      rows: [
        { col1: '$50,000 / yr', col2: '12% Bracket', col3: '~7.9% ($3,962)', col4: '~15.6% ($7,787 total)' },
        { col1: '$85,000 / yr', col2: '22% Bracket', col3: '~12.1% ($10,314)', col4: '~19.8% ($16,817 total)' },
        { col1: '$135,000 / yr', col2: '24% Bracket', col3: '~15.9% ($21,519)', col4: '~23.6% ($31,847 total)' },
        { col1: '$225,000 / yr', col2: '32% Bracket', col3: '~19.7% ($44,358)', col4: '~25.9% (SS capped + Medicare)' },
      ],
    },
  },

  'india-income-tax-calculator': {
    archetype: 'tax-statutory',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'New Tax Regime vs. Old Regime Slab & Cess Calculation',
      exampleSectionH2: 'Worked ₹15,00,000 CTC Slab-by-Slab Tax Comparison',
      howToUseH2: 'Entering Annual Income, 80C/80D Deductions & HRA',
      howItWorksH2: 'How Section 87A Rebate & Standard Deduction Change the Break-Even Point',
      understandingResultH2: 'When the Old Regime Still Beats the Default New Tax Regime',
      faqSectionH2: 'Indian Income Tax, Section 87A Rebate & 80C Questions',
      relatedSectionH2: 'In-Hand Salary, PF & Tax Calculators',
    },
    humanHowItWorksParagraph:
      'India operates two parallel personal income tax structures: the default New Tax Regime (which offers lower slab rates and a ₹75,000 salaried standard deduction, but strips away most exemptions) and the Old Tax Regime (which keeps a ₹50,000 standard deduction and lets you deduct Section 80C investments up to ₹1.5 lakh, 80D health insurance, and House Rent Allowance). After computing slab tax and any Section 87A rebate, a mandatory 4% Health and Education Cess is added to the tax amount.',
    humanClosingNote:
      'Unless your combined HRA + Section 80C + 80D + Section 24(b) home-loan interest deductions exceed roughly ₹3.75 lakh to ₹4.25 lakh, the New Tax Regime usually results in a lower tax bill.',
    fieldNote: {
      kicker: 'Chartered Accountant Field Note · Marginal Relief Near the Section 87A Cliff',
      heading: 'Why earning ₹10,000 above the rebate threshold doesn’t trigger ₹60,000 in sudden tax',
      body: 'Taxpayers whose taxable income sits just above the Section 87A zero-tax rebate threshold often panic that a small bonus will trigger full slab taxes on their entire income. Under the Income Tax Act’s "Marginal Relief" provision, the extra tax payable (before 4% cess) cannot exceed the exact amount of income that crossed the rebate threshold—preventing your net post-tax income from ever dropping after an increment.',
      commonMistakeTitle: 'Confusing CTC (Cost to Company) with Gross Taxable Salary',
      commonMistakeText:
        'Your offer letter’s CTC includes employer EPF contributions, gratuity provisioning, and insurance premiums that never hit your bank account and are not taxed the same way as basic salary.',
      proTipTitle: 'Employer NPS contribution under Section 80CCD(2) works in BOTH regimes',
      proTipText:
        'Even if you choose the New Tax Regime, corporate NPS contributions made by your employer (up to 14% of Basic Salary under the New Regime) remain deductible from taxable income.',
    },
    benchmarkTable: {
      heading: 'Deduction Break-Even Matrix: New Tax Regime vs. Old Tax Regime',
      subheading:
        'Approximate total Chapter VI-A + HRA deductions required for the Old Regime to match or beat the New Regime.',
      columns: ['Gross Salaried Income', 'New Regime Standard Deduction', 'Approx. Deductions Needed for Old Regime', 'Recommended Default Choice'],
      rows: [
        { col1: 'Up to ₹12,75,000', col2: '₹75,000 Std Deduction', col3: 'N/A (₹0 Tax via Sec 87A in New)', col4: 'New Regime (Zero Tax)' },
        { col1: '₹15,00,000 / yr', col2: '₹75,000 Std Deduction', col3: '> ₹3,75,000 in 80C + HRA + 80D', col4: 'New Regime unless high HRA' },
        { col1: '₹20,00,000 / yr', col2: '₹75,000 Std Deduction', col3: '> ₹4,25,000 in total exemptions', col4: 'Compare both side-by-side' },
        { col1: '₹30,00,000+ / yr', col2: '₹75,000 Std Deduction', col3: '> ₹4,50,000+ (HRA + Home Loan)', col4: 'New Regime unless large HRA' },
      ],
    },
  },

  length: {
    archetype: 'metrology',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: '1959 International Yard & 25.4 mm/Inch Standard',
      exampleSectionH2: 'Shop Walkthrough: Millimeters to Fractional Inches',
      howToUseH2: 'Switching Between Metric & Imperial Length Units',
      howItWorksH2: 'Why Every Inch Equals Exactly 25.4 Millimeters',
      understandingResultH2: 'Decimal Inches vs. Carpentry Tape-Measure Fractions',
      faqSectionH2: 'Length, Distance & Socket-Size Conversion Questions',
      relatedSectionH2: 'Area, Volume & Speed Converters',
    },
    humanHowItWorksParagraph:
      'Before 1959, the United States, the United Kingdom, and Commonwealth nations actually used slightly different definitions of an inch—a headache for machinists making aircraft bolts and gauge blocks. Under the 1959 International Yard and Pound Agreement, six nations locked 1 international yard at 0.9144 meters, which defines 1 inch as 25.4 millimeters (2.54 centimeters) with zero rounding error.',
    humanClosingNote:
      'Because 25.4 is an exact definition, multiplying inches by 25.4 to get millimeters is exact to infinite decimal places.',
    fieldNote: {
      kicker: 'Machining & Mechanics Field Note · Metric vs. SAE Wrench Clearances',
      heading: 'Which metric and SAE wrench sizes are close enough to swap—and which strip bolt heads?',
      body: 'In an auto shop, an 8 mm wrench (0.3150 in) and a 5/16-inch wrench (0.3125 in) differ by just 0.0025 inches (0.06 mm)—about the thickness of a sheet of printer paper—making them practically interchangeable on hex bolts. Likewise, 19 mm (0.748 in) and 3/4-inch (0.750 in) are nearly identical. However, a 10 mm bolt (0.3937 in) has no clean SAE twin: a 3/8-inch socket (0.375 in = 9.525 mm) won’t fit, and a 7/16-inch socket (11.11 mm) will round the corners right off.',
      commonMistakeTitle: 'Reading "5.5 feet" as 5 feet 5 inches',
      commonMistakeText:
        'A foot has 12 inches, not 10. Half a foot (0.5 ft) is 6 inches (0.5 × 12), so 5.5 feet is 5 ft 6 in—and 5.75 feet is 5 ft 9 in.',
      proTipTitle: 'Turn decimal inches into 16ths of an inch by multiplying the decimal by 16',
      proTipText:
        'If 12 mm converts to 0.4724 inches, take 0.4724 × 16 = 7.56, which tells you 12 mm sits right between 7/16" (11.11 mm) and 1/2" (12.70 mm).',
    },
    benchmarkTable: {
      heading: 'Shop & Engineering Length Tolerances & Wrench Cross-Reference',
      subheading:
        'Practical mechanical equivalents between millimeter fasteners, decimal inches, and nearest fractional inch sizes.',
      columns: ['Metric Size (mm)', 'Exact Decimal Inches', 'Nearest Fractional Inch', 'Mechanical Fit / Clearance Note'],
      rows: [
        { col1: '6.35 mm', col2: '0.2500 in', col3: '1/4 inch (Exact)', col4: 'Standard hex bit shank & guitar jack' },
        { col1: '8.00 mm', col2: '0.3150 in', col3: '5/16 inch (0.3125 in)', col4: 'Within 0.0025" — interchangeable in a pinch' },
        { col1: '10.00 mm', col2: '0.3937 in', col3: 'No exact SAE match (≈25/64")', col4: 'Never use 7/16" (11.1 mm); will strip 10 mm head' },
        { col1: '12.70 mm', col2: '0.5000 in', col3: '1/2 inch (Exact)', col4: 'Standard 1/2" drive breaker bar & plumbing' },
        { col1: '19.00 mm', col2: '0.7480 in', col3: '3/4 inch (0.7500 in)', col4: 'Within 0.002" — common lug-nut cross-fit' },
      ],
    },
  },

  weight: {
    archetype: 'metrology',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'International Avoirdupois Pound (0.45359237 kg) Equation',
      exampleSectionH2: 'Gym Plate, Parcel & Body-Weight Conversion Walkthrough',
      howToUseH2: 'Converting Kilograms, Pounds, Ounces, Grams & UK Stone',
      howItWorksH2: 'Why Mass (kg) and Weight (lbs) Convert Cleanly on Earth',
      understandingResultH2: 'Avoirdupois Ounces (28.35 g) vs. Precious-Metal Troy Ounces (31.10 g)',
      faqSectionH2: 'Weight, Shipping & Barbell Conversion Questions',
      relatedSectionH2: 'Cooking Weight, Volume & BMI Tools',
    },
    humanHowItWorksParagraph:
      'By international treaty, 1 avoirdupois pound is defined as 0.45359237 kilograms. Flipping that fraction (1 ÷ 0.45359237) gives the famous multiplier 1 kg ≈ 2.20462262 pounds. Each everyday pound splits into 16 avoirdupois ounces (28.3495 grams per ounce), while in the UK and Ireland body weight is traditionally grouped into "stone" of 14 pounds each (6.3503 kg).',
    humanClosingNote:
      'For fast mental math at the gym or airport baggage scale, multiply kilograms by 2 and add 10% of that product (e.g., 70 kg × 2 = 140; + 14 = 154 lbs).',
    fieldNote: {
      kicker: 'Metrology & Bullion Field Note · Never Weigh Gold in Kitchen Ounces',
      heading: 'Why a 1-ounce gold coin weighs 10% more than a 1-ounce slice of cheese',
      body: 'Grocery scales and postal counters use the avoirdupois system, where 1 ounce equals 28.3495 grams and 16 ounces make a pound (453.59 g). Precious metals (gold, silver, platinum) and gemstones are traded in the medieval Troy system, where 1 troy ounce equals 31.1035 grams—nearly 2.75 grams heavier per ounce. Bizarrely, a troy pound only has 12 troy ounces (373.24 g), meaning an ounce of gold is heavier than an ounce of feathers, but a pound of gold is lighter than a pound of feathers!',
      commonMistakeTitle: 'Converting 2.5 lbs into "2 lbs 5 oz"',
      commonMistakeText:
        'Because there are 16 ounces in a pound (not 10), 0.5 lbs is 8 ounces (0.5 × 16). So 2.5 lbs equals 2 pounds 8 ounces.',
      proTipTitle: 'Standard Olympic barbell plate equivalents',
      proTipText:
        'A standard men’s Olympic bar is 20 kg (44.09 lbs, usually rounded to 45 lbs in US gyms), and one "red" 25 kg competition plate equals 55.12 lbs.',
    },
    benchmarkTable: {
      heading: 'Everyday Weight, Barbell & Shipping Reference Benchmarks',
      subheading:
        'Exact metric-to-imperial anchors for gym plates, airline luggage limits, and kitchen scales.',
      columns: ['Benchmark Item', 'Kilograms / Grams', 'Pounds & Ounces', 'UK Stone Equivalent'],
      rows: [
        { col1: '1 Avoirdupois Ounce (Food/Mail)', col2: '28.3495 g', col3: '1.00 oz (0.0625 lb)', col4: '0.0045 st' },
        { col1: '1 Troy Ounce (Gold/Silver)', col2: '31.1035 g', col3: '1.0971 avoirdupois oz', col4: 'Used only for bullion' },
        { col1: '1 UK Stone (14 lbs)', col2: '6.3503 kg', col3: '14.00 lbs (224 oz)', col4: '1.00 stone' },
        { col1: 'Standard Airline Checked Bag', col2: '22.6796 kg (~23 kg)', col3: '50.00 lbs', col4: '3 st 8 lbs' },
        { col1: 'Olympic Competition Barbell', col2: '20.0000 kg', col3: '44.09 lbs', col4: '3 st 2.1 lbs' },
      ],
    },
  },

  temperature: {
    archetype: 'metrology',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Slope (1.8×) + Zero-Offset (+32 & +273.15) Equations',
      exampleSectionH2: 'Oven Baking, Weather & Fever Walkthrough',
      howToUseH2: 'Converting Between Celsius (°C), Fahrenheit (°F) & Kelvin (K)',
      howItWorksH2: 'Why Temperature Cannot Be Converted by a Simple Multiplier Alone',
      understandingResultH2: 'Where Celsius and Fahrenheit Cross (−40°) & Absolute Zero',
      faqSectionH2: 'Weather, Oven Baking & Clinical Temperature Questions',
      relatedSectionH2: 'Cooking, Energy & Pressure Converters',
    },
    humanHowItWorksParagraph:
      'Every other unit converter on this site—length, weight, volume—multiplies by a single ratio because 0 meters IS 0 inches. Temperature is different because Daniel Gabriel Fahrenheit and Anders Celsius parked their zero marks at different temperatures, and made their degree steps different sizes. Between water’s freezing point (0 °C / 32 °F) and boiling point (100 °C / 212 °F), Celsius spans 100 degrees while Fahrenheit spans 180 degrees. That makes 1 °C step equal to 1.8 °F steps (9/5), plus a +32 offset.',
    humanClosingNote:
      'In science and thermodynamics, Kelvin (K) uses the exact same degree step size as Celsius, shifted by 273.15 so 0 K sits at absolute zero.',
    fieldNote: {
      kicker: 'Thermodynamics & Kitchen Field Note · Temperature Point vs. Temperature Interval',
      heading: 'A temperature of 10 °C is 50 °F—but a temperature rise of 10 °C is only 18 °F',
      body: 'Engineers and cooks frequently trip over the difference between a thermometer reading and a temperature change (ΔT). If a room warms up by 10 °C (say from 20 °C to 30 °C), do NOT add 32! A change of 10 °C is simply 10 × 1.8 = 18 °F of warming (from 68 °F to 86 °F). You only add or subtract 32 when converting an actual thermometer reading.',
      commonMistakeTitle: 'Forgetting to drop 25 °F (15 °C) for Convection / Fan-Assisted Ovens',
      commonMistakeText:
        'A British recipe calling for "180 °C Fan" corresponds to a 200 °C (400 °F) conventional non-fan American oven, because the fan blows hot air across the pan faster.',
      proTipTitle: 'Fast mental weather rule: Double °C and add 30',
      proTipText:
        'For outdoor weather between 0 °C and 35 °C, double the Celsius number and add 30 (e.g., 20 °C × 2 + 30 = 70 °F; exact is 68 °F).',
    },
    benchmarkTable: {
      heading: 'Key Physical, Weather, Clinical & Oven Temperature Anchors',
      subheading:
        'Exact thermodynamic and culinary reference points across Celsius, Fahrenheit, and Kelvin.',
      columns: ['Physical / Culinary Milestone', 'Celsius (°C)', 'Fahrenheit (°F)', 'Kelvin (K)'],
      rows: [
        { col1: 'Absolute Zero (Molecular Stop)', col2: '−273.15 °C', col3: '−459.67 °F', col4: '0.00 K' },
        { col1: 'Scale Parity Crossover Point', col2: '−40.00 °C', col3: '−40.00 °F', col4: '233.15 K' },
        { col1: 'Water Freezing Point (1 atm)', col2: '0.00 °C', col3: '32.00 °F', col4: '273.15 K' },
        { col1: 'Normal Human Core Body Temp', col2: '37.00 °C', col3: '98.60 °F', col4: '310.15 K' },
        { col1: 'Water Boiling Point (Sea Level)', col2: '100.00 °C', col3: '212.00 °F', col4: '373.15 K' },
        { col1: 'Moderate Baking Oven (Gas Mark 4)', col2: '180.00 °C', col3: '356.00 °F (~350 °F)', col4: '453.15 K' },
      ],
    },
  },

  volume: {
    archetype: 'metrology',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Liters, Cubic Meters & US Liquid Gallon Factors',
      exampleSectionH2: 'Tank Capacity, Hydration Bottle & Gallon Walkthrough',
      howToUseH2: 'Converting Liters, Milliliters, Gallons, Quarts & Cubic Feet',
      howItWorksH2: 'How Cubic Length (cm³ and m³) Connects Directly to Liters',
      understandingResultH2: 'Why a UK Imperial Gallon Is 20% Larger Than a US Gallon',
      faqSectionH2: 'Tank Volume, Liters-to-Gallons & Fluid Ounce Questions',
      relatedSectionH2: 'Cooking Volume, Recipe Weight & Fuel Economy Tools',
    },
    humanHowItWorksParagraph:
      'In the metric system, volume and length lock together cleanly: 1 milliliter (mL) is the exact volume inside a 1 cm × 1 cm × 1 cm cube (1 cc), and 1,000 liters fill a 1 m × 1 m × 1 m cubic meter. By contrast, the US liquid gallon derives from the old 1707 English Queen Anne wine gallon—defined as exactly 231 cubic inches, which works out to 3.785411784 liters.',
    humanClosingNote:
      'For kitchen recipe cups, tablespoons, and teaspoons, visit our dedicated Cooking Measurement Converter or Ingredient Recipe Converter.',
    fieldNote: {
      kicker: 'International Trade Field Note · The 20% US vs. UK Gallon Discrepancy',
      heading: 'Why 1 Imperial gallon (4.546 L) holds 20% more liquid than 1 US gallon (3.785 L)',
      body: 'In 1824, Britain replaced its old wine and ale gallons with the Imperial gallon—defined as the volume of 10 pounds of distilled water at 62 °F (4.54609 liters, divided into 160 imperial fluid ounces). The United States kept the 231-cubic-inch wine gallon (3.78541 liters, divided into 128 US fluid ounces). That 20% gap explains why a British car rated at "50 MPG Imperial" is actually getting 41.6 MPG on an American sticker.',
      commonMistakeTitle: 'Confusing a 16 oz British pub pint (568 mL) with a US pint (473 mL)',
      commonMistakeText:
        'An Imperial pint contains 20 imperial fluid ounces (568.26 mL), whereas an American pint contains 16 US fluid ounces (473.18 mL)—nearly 100 mL smaller.',
      proTipTitle: 'Medical & engine displacement rule: 1 cc = 1 mL = 1 cm³',
      proTipText:
        'Whether on a syringe barrel or a 2,000 cc (2.0 L) car engine block, cubic centimeters (cc) and milliliters (mL) are 1-to-1 identical.',
    },
    benchmarkTable: {
      heading: 'US Customary vs. UK Imperial vs. Metric Volume Comparison',
      subheading:
        'Side-by-side comparison showing how fluid ounces, pints, quarts, and gallons diverge across systems.',
      columns: ['Volume Unit Name', 'US Customary (Liquid)', 'UK Imperial Equivalent', 'Exact Metric Volume'],
      rows: [
        { col1: '1 Fluid Ounce (fl oz)', col2: '29.5735 mL (1/128 US gal)', col3: '28.4131 mL (1/160 Imp gal)', col4: 'US fl oz is 4.1% larger than UK fl oz' },
        { col1: '1 Pint (pt)', col2: '16 US fl oz (473.18 mL)', col3: '20 Imp fl oz (568.26 mL)', col4: 'UK pub pint is 20.1% larger' },
        { col1: '1 Quart (qt)', col2: '32 US fl oz (0.9464 L)', col3: '40 Imp fl oz (1.1365 L)', col4: '1 Liter = 1.0567 US quarts' },
        { col1: '1 Gallon (gal)', col2: '128 US fl oz (3.7854 L)', col3: '160 Imp fl oz (4.5461 L)', col4: '1 Imp gal = 1.20095 US gal' },
        { col1: '1 Cubic Meter (m³)', col2: '264.172 US Gallons', col3: '219.969 Imp Gallons', col4: '1,000.00 Liters (35.315 ft³)' },
      ],
    },
  },

  cooking: {
    archetype: 'metrology',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'US Kitchen Hierarchy (1 Cup = 16 Tbsp = 48 Tsp = 236.59 mL)',
      exampleSectionH2: 'Scaling Half-Recipes & Converting Cups to Milliliters',
      howToUseH2: 'Converting Cups, Tablespoons, Teaspoons, Fluid Ounces & mL',
      howItWorksH2: 'How the 3-Teaspoons-Per-Tablespoon Ladder Simplifies Recipe Scaling',
      understandingResultH2: 'Liquid Volume (fl oz) vs. Dry Ingredient Weight (Grams)',
      faqSectionH2: 'Kitchen Measuring Spoons, Butter Sticks & International Cup Questions',
      relatedSectionH2: 'Recipe Scaler, Weight & Oven Temperature Tools',
    },
    humanHowItWorksParagraph:
      'American recipes run on a clean binary-and-ternary volume ladder: 1 US customary cup equals 8 US fluid ounces (236.588 mL), which divides into 16 tablespoons (14.787 mL each), and each tablespoon divides into 3 teaspoons (4.929 mL each). That means 1 cup holds 48 teaspoons, 1/4 cup holds 4 tablespoons, and 1/8 cup holds 2 tablespoons.',
    humanClosingNote:
      'Need to convert cups of flour, sugar, or oats into grams on a digital kitchen scale? Use our Ingredient Recipe Converter, which accounts for each ingredient’s unique density.',
    fieldNote: {
      kicker: 'Pastry & Baking Field Note · Why International Measuring Cups Vary from 200 mL to 284 mL',
      heading: 'Australian tablespoons hold 20 mL (4 tsp)—not the 15 mL (3 tsp) used in the US and UK',
      body: 'When baking from an international cookbook, check where the author lives. A US legal nutrition cup is 240 mL (customary cup = 236.59 mL), a Commonwealth metric cup (UK/AU/NZ/CA) is 250 mL, and a Japanese rice-cooker cup (gō) is 180–200 mL. Even more surprising: Australia is the only country that defines 1 tablespoon as 20 mL (4 teaspoons) instead of 15 mL (3 teaspoons)—a 33% difference on baking powder or yeast!',
      commonMistakeTitle: 'Measuring dry flour in a spouted glass liquid measuring pitcher',
      commonMistakeText:
        'Packing flour into a cup can swing its weight from 115 g (sifted) to 155 g (scooped straight from the bag), turning cakes dry and dense.',
      proTipTitle: 'How to cut 1/3 cup in half when scaling a recipe by 50%',
      proTipText:
        'Since 1/3 cup equals 5 tablespoons + 1 teaspoon (16 tsp total), half of 1/3 cup is exactly 2 tablespoons + 2 teaspoons (8 tsp).',
    },
    benchmarkTable: {
      heading: 'Complete Kitchen Measuring Cup, Spoon & Butter Stick Chart',
      subheading:
        'Quick kitchen counter reference for splitting cups into tablespoons, teaspoons, fluid ounces, and milliliters.',
      columns: ['Cup Measure', 'Tablespoons (Tbsp)', 'Teaspoons (Tsp)', 'Fluid Ounces / Milliliters'],
      rows: [
        { col1: '1/16 Cup (Splash)', col2: '1 Tbsp', col3: '3 Tsp', col4: '0.5 fl oz (14.79 mL)' },
        { col1: '1/8 Cup (Coffee Scoop)', col2: '2 Tbsp', col3: '6 Tsp', col4: '1.0 fl oz (29.57 mL)' },
        { col1: '1/4 Cup (Half Butter Stick)', col2: '4 Tbsp', col3: '12 Tsp', col4: '2.0 fl oz (59.15 mL)' },
        { col1: '1/3 Cup', col2: '5 Tbsp + 1 Tsp', col3: '16 Tsp', col4: '2.67 fl oz (78.86 mL)' },
        { col1: '1/2 Cup (1 Full US Butter Stick)', col2: '8 Tbsp', col3: '24 Tsp', col4: '4.0 fl oz (118.29 mL)' },
        { col1: '1 Full US Cup', col2: '16 Tbsp', col3: '48 Tsp', col4: '8.0 fl oz (236.59 mL)' },
      ],
    },
  },

  area: {
    archetype: 'metrology',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Squared Linear Conversion Factors (1 m² = 10.76391 ft²)',
      exampleSectionH2: 'Apartment Floor Plan & Land Parcel Walkthrough',
      howToUseH2: 'Converting Square Meters, Square Feet, Acres & Hectares',
      howItWorksH2: 'Why You Must Square the Linear Conversion Factor for Area',
      understandingResultH2: 'Acres (43,560 ft²) vs. Hectares (10,000 m²) in Land Deeds',
      faqSectionH2: 'Real Estate Area, Acreage & Flooring Questions',
      relatedSectionH2: 'Length, Flooring Project & Construction Calculators',
    },
    humanHowItWorksParagraph:
      'The single biggest trap in area conversion is forgetting that length gets squared in two dimensions. Everyone knows 1 yard equals 3 feet, and 1 meter equals 100 centimeters. But a 1-yard by 1-yard square carpet tile covers 3 ft × 3 ft = 9 square feet (not 3), and a 1-meter square covers 100 cm × 100 cm = 10,000 square centimeters.',
    humanClosingNote:
      'Since 1 foot is 0.3048 meters, 1 square foot equals 0.3048² = 0.09290304 m², and 1 square meter equals 1 ÷ 0.09290304 = 10.7639104 ft².',
    fieldNote: {
      kicker: 'Real Estate & Surveying Field Note · Visualizing Acres and Hectares',
      heading: 'One acre is roughly 91% of an American football field (between the goal lines)',
      body: 'Originally defined in medieval England as the area a yoke of oxen could plow in one day (1 furlong of 660 feet by 1 chain of 66 feet), 1 acre equals 43,560 square feet (4,046.86 m²). An American football field between the goal lines (300 ft × 160 ft) is 48,000 sq ft—meaning 1 acre is about 90.75% of the playing field. A metric hectare (100 m × 100 m = 10,000 m²) equals 2.47105 acres, or roughly two and a half football fields.',
      commonMistakeTitle: 'Confusing "10 feet square" with "10 square feet"',
      commonMistakeText:
        'A patio described as "10 feet square" measures 10 ft × 10 ft = 100 square feet. "10 square feet" is a tiny 2 ft × 5 ft closet floor.',
      proTipTitle: 'Order 10% extra square footage for plank flooring, 15% for diagonal tile',
      proTipText:
        'Calculated room area is net surface area; always add 10% waste for end-cuts and starter-row offcuts when ordering boxes.',
    },
    benchmarkTable: {
      heading: 'Architectural, Flooring & Land Parcel Area Reference Table',
      subheading:
        'Exact two-dimensional conversion factors across interior real estate and agricultural land units.',
      columns: ['Area Unit', 'Square Feet (ft²)', 'Square Meters (m²)', 'Real-World Visual Anchor'],
      rows: [
        { col1: '1 Square Yard (yd²)', col2: '9.00 ft² (3×3 ft)', col3: '0.8361 m²', col4: 'Standard unit for broadloom carpet rolls' },
        { col1: '1 Square Meter (m²)', col2: '10.7639 ft²', col3: '1.0000 m²', col4: 'Half of a standard interior door area' },
        { col1: '1 Roofing "Square"', col2: '100.00 ft² (10×10 ft)', col3: '9.2903 m²', col4: '3 bundles of architectural shingles' },
        { col1: '1 Acre (ac)', col2: '43,560.00 ft²', col3: '4,046.86 m² (0.4047 ha)', col4: '~91% of a football field (no end zones)' },
        { col1: '1 Hectare (ha)', col2: '107,639.10 ft² (2.471 ac)', col3: '10,000.00 m² (100×100 m)', col4: 'International FIFA soccer pitch + sidelines' },
      ],
    },
  },

  speed: {
    archetype: 'metrology',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Velocity Conversion Factors (3.6 km/h per m/s & 1.609344 km/mi)',
      exampleSectionH2: 'Highway Speedometer, 5K Pace & Wind-Knot Walkthrough',
      howToUseH2: 'Converting MPH, km/h, Meters/Second & Aviation Knots',
      howItWorksH2: 'Why Multiplying Meters per Second by 3.6 Gives Kilometers per Hour',
      understandingResultH2: 'Statute Miles per Hour (MPH) vs. Nautical Knots (kn)',
      faqSectionH2: 'Speedometer, Wind Speed & Aviation Knot Questions',
      relatedSectionH2: 'Length, Fuel Economy & Time Duration Tools',
    },
    humanHowItWorksParagraph:
      'Speed is distance divided by time. Because there are 3,600 seconds in 1 hour and 1,000 meters in 1 kilometer, moving at 1 meter per second covers 3,600 meters (3.6 kilometers) in an hour. That makes the conversion between m/s and km/h an exact 3.6 multiplier. Between US/UK miles per hour (mph) and kilometers per hour (km/h), the factor is the exact length of a statute mile: 1 mph = 1.609344 km/h.',
    humanClosingNote:
      'In aviation and maritime navigation, 1 knot equals 1 nautical mile (1,852 meters) per hour—which is 1.15078 mph or 1.852 km/h.',
    fieldNote: {
      kicker: 'Aviation & Navigation Field Note · Why Pilots and Captains Measure Speed in Knots',
      heading: 'One knot equals one arc-minute of latitude per hour on a Mercator chart',
      body: 'Aircraft and ships don’t use knots out of nostalgia—they use them because a nautical mile (1,852 m) corresponds to 1 minute of latitude (1/60th of a degree) on Earth’s curved surface. If a pilot flies due north at 120 knots for 1 hour, the plane covers 120 nautical miles, which equals 2 full degrees of latitude on the navigation chart without any conversion math.',
      commonMistakeTitle: 'Confusing running pace (minutes per mile) with speed (miles per hour)',
      commonMistakeText:
        'Pace and speed are reciprocals: Divide 60 by your speed in mph to get pace in min/mile. Running at 7.5 mph equals a 8:00 min/mile pace (60 ÷ 7.5 = 8).',
      proTipTitle: 'Use Fibonacci numbers (3, 5, 8, 13, 21, 34, 55, 89) for instant mph ↔ km/h',
      proTipText:
        'Because the Golden Ratio (1.618) is virtually identical to 1.609 km/mi, consecutive Fibonacci numbers convert mph to km/h on the spot: 55 mph ≈ 89 km/h, and 34 mph ≈ 55 km/h.',
    },
    benchmarkTable: {
      heading: 'Road, Track, Weather & Aerospace Speed Reference Benchmarks',
      subheading:
        'Exact velocity equivalents across meters per second, kilometers per hour, miles per hour, and knots.',
      columns: ['Velocity Benchmark', 'Meters/Sec (m/s)', 'Kilometers/Hr (km/h)', 'MPH & Nautical Knots'],
      rows: [
        { col1: 'Brisk Human Walking Pace', col2: '1.3889 m/s', col3: '5.00 km/h', col4: '3.11 mph (2.70 knots)' },
        { col1: '100 km/h Highway Limit', col2: '27.7778 m/s', col3: '100.00 km/h', col4: '62.14 mph (54.00 knots)' },
        { col1: 'Category 1 Hurricane Threshold', col2: '33.0810 m/s', col3: '119.09 km/h', col4: '74.00 mph (64.30 knots)' },
        { col1: 'Speed of Sound (Mach 1 @ 20 °C)', col2: '343.0000 m/s', col3: '1,234.80 km/h', col4: '767.27 mph (666.73 knots)' },
      ],
    },
  },

  pressure: {
    archetype: 'metrology',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: 'Pascals (N/m²), Bar, PSI & Standard Atmosphere Factors',
      exampleSectionH2: 'Tire Gauge, Espresso Machine & Weather Barometer Walkthrough',
      howToUseH2: 'Converting Bar, PSI, Kilopascals (kPa), Atmospheres & Torr',
      howItWorksH2: 'How 1 Bar (100 kPa) Nearly Matches Sea-Level Atmospheric Pressure',
      understandingResultH2: 'Gauge Pressure (PSIG on a Tire) vs. Absolute Pressure (PSIA)',
      faqSectionH2: 'Tire Pressure, Bar-to-PSI & Barometric Pressure Questions',
      relatedSectionH2: 'Force, Torque & Temperature Tools',
    },
    humanHowItWorksParagraph:
      'Pressure measures force spread over a surface area. In the metric SI system, 1 Pascal (Pa) is 1 Newton of force pressing on 1 square meter—a tiny puff of pressure, so engineers group Pascals into kilopascals (1 kPa = 1,000 Pa) and bar (1 bar = 100,000 Pa = 100 kPa). In North America, tire gauges and hydraulic hoses read in Pounds per Square Inch (PSI), where 1 bar equals 14.50377 PSI.',
    humanClosingNote:
      'Most car door-jamb stickers list both kPa and PSI side by side: 220 kPa (2.2 bar) equals 31.9 PSI (~32 PSI).',
    fieldNote: {
      kicker: 'Automotive & HVAC Field Note · Gauge Pressure (psig) vs. Absolute Pressure (psia)',
      heading: 'Why a flat tire sitting on the rim still has 14.7 PSI of air inside it',
      body: 'At sea level, Earth’s atmosphere presses down on everything at 14.696 PSI (101.325 kPa / 1 atm). A handheld tire pressure gauge zeroes out that ambient air pressure—so when it reads "32 PSI" (gauge pressure, or PSIG), the total absolute pressure (PSIA) inside the tire casing is actually 32 + 14.7 = 46.7 PSIA. When a tire goes completely flat, the gauge reads 0 PSIG simply because inside pressure equals outside air pressure.',
      commonMistakeTitle: 'Checking tire PSI right after driving on a hot highway',
      commonMistakeText:
        'Tire pressure rises roughly 1 PSI for every 10 °F (5.6 °C) increase in temperature. Always set tire pressure "cold" (parked for 3+ hours) to match the door-jamb sticker.',
      proTipTitle: 'Espresso machine 9-bar extraction rule',
      proTipText:
        'A classic Italian espresso pump set to 9 bar is pushing water through the coffee puck at 9 × 14.504 = 130.5 PSI.',
    },
    benchmarkTable: {
      heading: 'Automotive, Weather & Industrial Pressure Reference Benchmarks',
      subheading:
        'Side-by-side pressure equivalents across Bar, PSI, Kilopascals (kPa), and Atmospheres (atm).',
      columns: ['Real-World Pressure Scenario', 'Bar', 'Pounds/Sq Inch (PSI)', 'Kilopascals (kPa) & Atm'],
      rows: [
        { col1: 'Standard Sea-Level Atmosphere', col2: '1.01325 bar', col3: '14.6959 PSI', col4: '101.325 kPa (1.000 atm)' },
        { col1: 'Passenger Car Tire (Cold)', col2: '2.2063 bar', col3: '32.0000 PSI', col4: '220.63 kPa (2.177 atm)' },
        { col1: 'Road Bicycle High-Pressure Tire', col2: '6.8948 bar', col3: '100.0000 PSI', col4: '689.48 kPa (6.805 atm)' },
        { col1: 'Commercial Espresso Extraction', col2: '9.0000 bar', col3: '130.5340 PSI', col4: '900.00 kPa (8.882 atm)' },
      ],
    },
  },

  energy: {
    archetype: 'metrology',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'Joules, Kilowatt-Hours (3.6 MJ), Calories & BTU Equations',
      exampleSectionH2: 'Utility Bill kWh, Food Label kcal & HVAC BTU Walkthrough',
      howToUseH2: 'Converting Joules, kWh, Food Kilocalories & BTUs',
      howItWorksH2: 'How Mechanical Work (Joules), Electrical kWh & Heat Calories Connect',
      understandingResultH2: 'Dietary "Calories" (Kilocalories = 4,184 J) vs. Lab Gram Calories (4.184 J)',
      faqSectionH2: 'Electricity kWh, Food Calorie & BTU Conversion Questions',
      relatedSectionH2: 'Power, Force & BMI Calorie Tools',
    },
    humanHowItWorksParagraph:
      'Whether you are paying an electric bill, reading a cereal box, or sizing an air conditioner, you are measuring the exact same physical quantity: energy. One Joule (J) is the work done by 1 Watt of power in 1 second. Since an hour has 3,600 seconds and a kilowatt is 1,000 Watts, 1 kilowatt-hour (kWh) on your utility meter equals 1,000 × 3,600 = 3,600,000 Joules (3.6 Megajoules).',
    humanClosingNote:
      'In nutrition, 1 thermochemical food "Calorie" (kcal) equals exactly 4,184 Joules (4.184 kJ).',
    fieldNote: {
      kicker: 'Nutrition & Physics Field Note · The Capital-C Food Calorie Secret',
      heading: 'A "250 Calorie" snack bar actually contains 250,000 chemistry calories',
      body: 'In physics and chemistry, 1 small-c calorie (cal) is the heat needed to warm 1 gram of water by 1 °C (4.184 Joules). Because that unit is tiny for human meals, nutrition labels in the US and Canada write "Calorie" with a capital C to mean 1 kilocalorie (1 kcal = 1,000 small calories = 4.184 kilojoules). On European and Australian food packages, you will see both numbers printed side by side: e.g., "1,046 kJ / 250 kcal."',
      commonMistakeTitle: 'Confusing Energy (kWh) with Power (kW)',
      commonMistakeText:
        'Power (kW) is how fast you use electricity right now (like speedometer mph); Energy (kWh) is total electricity used over time (like odometer miles). Running a 1.5 kW space heater for 4 hours uses 6 kWh.',
      proTipTitle: '1 Wh of battery capacity = 3,600 Joules',
      proTipText:
        'Airline carry-on rules cap lithium laptop/power-bank batteries at 100 Watt-hours (0.1 kWh), which equals 360,000 Joules.',
    },
    benchmarkTable: {
      heading: 'Electrical, Nutritional & Thermal Energy Reference Benchmarks',
      subheading:
        'Cross-converting household electricity (kWh), food energy (kcal), metric Joules, and HVAC BTUs.',
      columns: ['Energy Benchmark', 'Joules / Kilojoules', 'Food Kilocalories (kcal)', 'Electrical kWh / BTU'],
      rows: [
        { col1: '1 Small Gram Calorie (cal)', col2: '4.184 J', col3: '0.001 kcal', col4: '0.00397 BTU' },
        { col1: '1 Dietary Food Calorie (kcal)', col2: '4,184 J (4.184 kJ)', col3: '1.000 kcal', col4: '3.9657 BTU (0.00116 kWh)' },
        { col1: '1 British Thermal Unit (BTU)', col2: '1,055.06 J (1.055 kJ)', col3: '0.2522 kcal', col4: '1.000 BTU (0.000293 kWh)' },
        { col1: '1 Kilowatt-Hour (1 kWh)', col2: '3,600,000 J (3,600 kJ)', col3: '860.42 kcal', col4: '3,412.14 BTU (1.000 kWh)' },
      ],
    },
  },

  digital: {
    archetype: 'metrology',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'Decimal SI (10³ = 1,000) vs. Binary IEC (2¹⁰ = 1,024) Byte Math',
      exampleSectionH2: 'Why a 1 TB SSD Shows Up as 931 GB in Windows',
      howToUseH2: 'Converting Bits, Bytes, KB, MB, GB, TB & Binary Mebibytes',
      howItWorksH2: 'How the 8-Bits-Per-Byte Rule Controls Internet Download Times',
      understandingResultH2: 'Network Speeds in Megabits (Mbps) vs. File Sizes in Megabytes (MB)',
      faqSectionH2: 'Hard Drive Capacity, Mbps-to-MB/s & Binary Storage Questions',
      relatedSectionH2: 'Ratio, Scientific & Percentage Calculators',
    },
    humanHowItWorksParagraph:
      'Digital data has two traps that trip up almost everyone: bits vs. bytes, and 1,000 vs. 1,024. First, 1 Byte (capital B) is a group of 8 bits (lowercase b). Internet service providers advertise line speeds in megabits per second (Mbps), while your browser downloads files in Megabytes per second (MB/s)—so you must divide your Mbps speed by 8. Second, storage manufacturers use decimal SI prefixes (1 KB = 1,000 B; 1 GB = 10⁹ B), whereas RAM chips and Windows file explorers count in powers of two (1 KiB = 1,024 B; 1 GiB = 2³⁰ = 1,073,741,824 B).',
    humanClosingNote:
      'On a 100 Mbps fiber connection, your theoretical maximum download speed in Megabytes is 100 ÷ 8 = 12.5 MB per second.',
    fieldNote: {
      kicker: 'Storage & Networking Field Note · The Missing 7% on Every New Hard Drive',
      heading: 'Your "1 Terabyte" drive isn’t missing 69 GB—Windows is measuring it in Tebibytes',
      body: 'When you unbox a 1 TB NVMe SSD, the manufacturer built it with exactly 1,000,000,000,000 bytes (10¹² bytes, the official ISO/IEC standard for 1 TB). When you plug it into a Windows PC, Windows divides that byte count by 1,024⁴ (1,099,511,627,776 bytes per Tebibyte) and displays "931 GB" instead of labeling it "931 GiB." macOS (since OS X Snow Leopard) and Ubuntu use base-1000 for disk space, so the exact same drive reads 1.00 TB on a Mac.',
      commonMistakeTitle: 'Expecting a 1 Gbps internet plan to download a 1 GB file in 1 second',
      commonMistakeText:
        '1 Gbps (Gigabit/sec) is 125 MB/s (Megabytes/sec) before TCP/IP overhead. A 1 GB (1,000 MB) file takes roughly 8 to 9 seconds at full gigabit line speed.',
      proTipTitle: 'Divide Mbps by 8 (or multiply by 0.125) for real download MB/s',
      proTipText:
        'A 400 Mbps connection downloads at 400 ÷ 8 = 50 MB/s—meaning a 60 GB game update takes about 20 minutes.',
    },
    benchmarkTable: {
      heading: 'Decimal SI (Base-1000) vs. Binary IEC (Base-1024) Storage Discrepancy Chart',
      subheading:
        'How storage drive labels (1000ⁿ) compare against binary operating-system reporting (1024ⁿ) and network transfer times.',
      columns: ['Prefix Tier', 'Decimal SI (Drive Box)', 'Binary IEC (RAM / Windows)', 'Apparent OS Size Difference'],
      rows: [
        { col1: 'Kilo / Kibi (KB vs KiB)', col2: '1,000 Bytes (10³)', col3: '1,024 Bytes (2¹⁰)', col4: '2.4% difference (1 KB = 0.977 KiB)' },
        { col1: 'Mega / Mebi (MB vs MiB)', col2: '1,000,000 Bytes (10⁶)', col3: '1,048,576 Bytes (2²⁰)', col4: '4.9% difference (100 MB = 95.37 MiB)' },
        { col1: 'Giga / Gibi (GB vs GiB)', col2: '1,000,000,000 Bytes (10⁹)', col3: '1,073,741,824 Bytes (2³⁰)', col4: '7.4% difference (500 GB = 465.66 GiB)' },
        { col1: 'Tera / Tebi (TB vs TiB)', col2: '10¹² Bytes (1,000 GB)', col3: '2⁴⁰ Bytes (1,024 GiB)', col4: '9.95% difference (1 TB shows as 931 GiB)' },
      ],
    },
  },

  'fuel-economy': {
    archetype: 'metrology',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Reciprocal Consumption Equation (235.214583 ÷ L/100km)',
      exampleSectionH2: 'Converting European L/100km Sticker Ratings to US & UK MPG',
      howToUseH2: 'Switching Between L/100km, US MPG, UK Imperial MPG & km/L',
      howItWorksH2: 'Why Lower L/100km Numbers Mean Higher MPG (Inverse Math)',
      understandingResultH2: 'The "MPG Illusion": Why Jumping From 15 to 20 MPG Saves More Gas Than 35 to 50 MPG',
      faqSectionH2: 'Fuel Consumption, L/100km-to-MPG & Imperial Gallon Questions',
      relatedSectionH2: 'Volume, Speed & Distance Converters',
    },
    humanHowItWorksParagraph:
      'North America and the UK measure fuel efficiency as distance per unit of fuel (Miles per Gallon—where bigger is better). Continental Europe, Canada, Australia, and New Zealand measure fuel consumption as fuel burned per fixed distance (Liters per 100 kilometers—where smaller is better). Because one fraction is upside-down relative to the other, you cannot multiply L/100km by a constant to get MPG; instead, you divide 235.214583 by the L/100km figure (or 282.480936 for UK Imperial MPG).',
    humanClosingNote:
      'Notice the symmetry: 235.21 ÷ 10 L/100km = 23.52 US MPG, and 235.21 ÷ 23.52 US MPG = 10 L/100km.',
    fieldNote: {
      kicker: 'Automotive Engineering Field Note · The MPG Illusion Explained',
      heading: 'Why replacing a 15 MPG truck with a 20 MPG SUV saves more fuel than trading a 35 MPG sedan for a 50 MPG hybrid',
      body: 'Human brains assume a +15 MPG improvement is three times better than a +5 MPG improvement. Let’s check the actual gallons burned over 10,000 miles of driving: at 15 MPG you burn 667 gallons, and at 20 MPG you burn 500 gallons—saving 167 gallons of gas. Now look at the sedan: at 35 MPG you burn 286 gallons over 10,000 miles, and at 50 MPG you burn 200 gallons—saving only 86 gallons! This is why European engineers prefer L/100km: it scales linearly with fuel burned and money spent.',
      commonMistakeTitle: 'Comparing UK car reviews (Imperial MPG) directly against US EPA window stickers',
      commonMistakeText:
        'Because a UK Imperial gallon (4.546 L) is 20.1% larger than a US gallon (3.785 L), a car rated at 60 MPG in a British magazine equals 50 MPG in the United States.',
      proTipTitle: 'Convert km/L to L/100km by dividing 100 by km/L',
      proTipText:
        'In Japan, India, and Brazil, efficiency is quoted in kilometers per liter (km/L). An average of 20 km/L equals 100 ÷ 20 = 5.0 L/100km (47.0 US MPG).',
    },
    benchmarkTable: {
      heading: 'Global Fuel Economy Cross-Reference & Annual Fuel Used (15,000 km / ~9,320 mi)',
      subheading:
        'Side-by-side comparison across L/100km, km/L, US MPG, and UK Imperial MPG.',
      columns: ['Liters / 100 km', 'Kilometers / Liter (km/L)', 'US MPG (3.785 L gal)', 'UK Imperial MPG (4.546 L gal)'],
      rows: [
        { col1: '4.0 L/100km (Hybrid)', col2: '25.00 km/L', col3: '58.80 MPG (US)', col4: '70.62 MPG (UK)' },
        { col1: '6.0 L/100km (Compact)', col2: '16.67 km/L', col3: '39.20 MPG (US)', col4: '47.08 MPG (UK)' },
        { col1: '8.0 L/100km (Midsize SUV)', col2: '12.50 km/L', col3: '29.40 MPG (US)', col4: '35.31 MPG (UK)' },
        { col1: '10.0 L/100km (Crossover/V6)', col2: '10.00 km/L', col3: '23.52 MPG (US)', col4: '28.25 MPG (UK)' },
        { col1: '12.0 L/100km (Full-Size Truck)', col2: '8.33 km/L', col3: '19.60 MPG (US)', col4: '23.54 MPG (UK)' },
      ],
    },
  },

  torque: {
    archetype: 'metrology',
    sectionOrderVariant: 0,
    headings: {
      formulaSectionH2: 'Rotational Force Equations (1 N·m = 0.737562 ft-lb = 8.85075 in-lb)',
      exampleSectionH2: 'Wheel Lug Nut, Spark Plug & Cylinder Head Torque Walkthrough',
      howToUseH2: 'Converting Newton-Meters (N·m), Foot-Pounds (ft-lb) & Inch-Pounds (in-lb)',
      howItWorksH2: 'How Lever Arm Length × Perpendicular Force Creates Torque',
      understandingResultH2: 'Why Confusing Foot-Pounds (ft-lb) With Inch-Pounds (in-lb) Snaps Bolts',
      faqSectionH2: 'Torque Wrench Settings, N·m-to-ft-lb & Fastener Questions',
      relatedSectionH2: 'Force, Pressure & Length Converters',
    },
    humanHowItWorksParagraph:
      'Torque is rotational twist: force multiplied by the length of the lever arm (τ = r × F). Applying 1 Newton of force at the end of a 1-meter wrench handle produces 1 Newton-meter (N·m) of torque. Applying 1 pound-force at the end of a 1-foot wrench produces 1 foot-pound (ft-lb), which equals 1.355818 N·m. And because a 1-foot lever is 12 inches long, 1 foot-pound equals exactly 12 inch-pounds (in-lb).',
    humanClosingNote:
      'Note on physics notation: Torque is written as N·m or lb-ft (vector cross product), whereas mechanical work/energy is written as Joules or ft-lb (scalar dot product).',
    fieldNote: {
      kicker: 'Master Mechanic Field Note · The 12× Inch-Pound vs. Foot-Pound Disaster',
      heading: 'Reading "108 in-lb" as "108 ft-lb" applies 12 times the spec torque and shears aluminum threads',
      body: 'Small engine fasteners—like valve cover bolts, oil pan bolts, bicycle carbon stems, and intake manifold bolts—are specified in Newton-meters (N·m) or inch-pounds (in-lb). For example, an M6 aluminum valve cover bolt typically calls for 10 N·m, which equals 88.5 inch-pounds (just 7.4 foot-pounds). If a DIY mechanic grabs a 1/2-inch-drive click wrench and dials in 88 foot-pounds instead of 88 inch-pounds, they will snap the bolt head off before the wrench ever clicks.',
      commonMistakeTitle: 'Using thread lubricant or anti-seize on a dry torque spec without reducing torque',
      commonMistakeText:
        'Factory wheel lug specs (e.g., 100 ft-lb / 135 N·m) assume clean, DRY threads. Oiling or greasing threads cuts friction so drastically that 100 ft-lb over-stretches the stud by 25%–35%.',
      proTipTitle: 'Always back a click-type torque wrench down to its lowest scale mark before storing',
      proTipText:
        'Leaving a micrometer click wrench wound up at 100 ft-lb in your toolbox compresses the internal calibration spring and knocks the wrench out of accuracy.',
    },
    benchmarkTable: {
      heading: 'Automotive & Bicycle Fastener Torque Spec Reference Chart',
      subheading:
        'Typical real-world fastener torque specifications across Newton-meters (N·m), foot-pounds (ft-lb), and inch-pounds (in-lb).',
      columns: ['Fastener Application', 'Newton-Meters (N·m)', 'Foot-Pounds (ft-lb)', 'Inch-Pounds (in-lb)'],
      rows: [
        { col1: 'Carbon Bike Stem / Faceplate Bolt', col2: '5.0 N·m', col3: '3.69 ft-lb', col4: '44.25 in-lb (Use 1/4" drive)' },
        { col1: 'M6 Valve Cover / Oil Pan Bolt', col2: '10.0 N·m', col3: '7.38 ft-lb', col4: '88.51 in-lb' },
        { col1: 'Standard M14 Spark Plug (Aluminum Head)', col2: '25.0 N·m', col3: '18.44 ft-lb', col4: '221.27 in-lb' },
        { col1: 'Engine Oil Drain Plug (Typical)', col2: '40.0 N·m', col3: '29.50 ft-lb', col4: '354.03 in-lb' },
        { col1: 'Passenger Car Wheel Lug Nut (M12)', col2: '135.0 N·m', col3: '99.57 ft-lb (~100 ft-lb)', col4: '1,194.85 in-lb (Use 1/2" drive)' },
      ],
    },
  },

  'scientific-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 1,
    headings: {
      formulaSectionH2: 'PEMDAS Operator Precedence & Trigonometric Mode Identities',
      exampleSectionH2: 'Evaluating Nested Exponents, Logs & Trig Functions Step by Step',
      howToUseH2: 'Switching Between Degrees (DEG) and Radians (RAD) & Entering Expressions',
      howItWorksH2: 'How the Expression Parser Handles Parentheses, Roots & Right-Associative Powers',
      understandingResultH2: 'Why sin(30) Gives 0.5 in Degree Mode vs. −0.988 in Radian Mode',
      faqSectionH2: 'Scientific Notation (10^x), Inverse Trig & Order-of-Operations Questions',
      relatedSectionH2: 'Exponent, Logarithm & Equation Solvers',
    },
    humanHowItWorksParagraph:
      'A pocket arithmetic calculator executes operations in the exact order you press the keys—so typing 2 + 3 × 4 naively outputs 20. A true scientific calculator parses the entire mathematical expression tree first: parentheses and function arguments evaluate innermost-out, exponents evaluate right-to-left (2^3^2 = 2^9 = 512), multiplication and division execute left-to-right, and addition and subtraction come last (2 + 3 × 4 = 14).',
    humanClosingNote:
      'Before hitting sin, cos, or tan, always glance at the angle-unit indicator: geometry and navigation problems use Degrees (360° per circle), whereas calculus and physics wave equations use Radians (2π rad per circle).',
    fieldNote: {
      kicker: 'Engineering & Exam Field Note · The −3² vs. (−3)² Trap',
      heading: 'Why typing −3^2 into a scientific calculator returns −9 instead of +9',
      body: 'In standard algebraic precedence, exponentiation binds tighter than unary negation. When you type −3^2 without parentheses, the parser reads it as −(3²) = −9. Whenever you are squaring a negative number—for instance, substituting b = −3 into the quadratic discriminant b² − 4ac—wrap the negative value in parentheses: (−3)^2 = +9.',
      commonMistakeTitle: 'Leaving the calculator in RAD mode during a surveying or trig triangle test',
      commonMistakeText:
        'Quick sanity check: type sin(30). If the display shows 0.5, you are in Degree mode; if it shows −0.98803, you are in Radian mode.',
      proTipTitle: 'Use ln(x) for natural base-e logs and log(x) for base-10 pH/decibel scales',
      proTipText:
        'Need a base-2 logarithm for computer science? Use the change-of-base identity: log₂(x) = ln(x) ÷ ln(2).',
    },
    benchmarkTable: {
      heading: 'Essential Trigonometric, Logarithmic & Constant Reference Benchmarks',
      subheading:
        'Exact and floating-point values for the most common scientific calculator checks.',
      columns: ['Expression', 'Degree Mode (DEG)', 'Radian Equivalent (RAD)', 'Exact Algebraic Form'],
      rows: [
        { col1: 'sin(30°) / sin(π/6)', col2: '0.500000', col3: 'π/6 ≈ 0.523599 rad', col4: '1 / 2' },
        { col1: 'cos(45°) / cos(π/4)', col2: '0.707107', col3: 'π/4 ≈ 0.785398 rad', col4: '√2 / 2' },
        { col1: 'tan(60°) / tan(π/3)', col2: '1.732051', col3: 'π/3 ≈ 1.047198 rad', col4: '√3' },
        { col1: 'ln(e) & log₁₀(1,000)', col2: 'ln(e) = 1.000000', col3: 'log₁₀(1000) = 3.000000', col4: 'e ≈ 2.718281828' },
      ],
    },
  },

  'quadratic-equation-calculator': {
    archetype: 'math-proof',
    sectionOrderVariant: 2,
    headings: {
      formulaSectionH2: 'The Quadratic Formula x = (−b ± √(b² − 4ac)) ÷ 2a & Discriminant Δ',
      exampleSectionH2: 'Solving 2x² − 5x − 3 = 0 for Exact Roots and Vertex Coordinates',
      howToUseH2: 'Entering Coefficients a, b, and c from Standard Form ax² + bx + c = 0',
      howItWorksH2: 'How the Discriminant (b² − 4ac) Tells You Whether Roots Are Real or Complex',
      understandingResultH2: 'Reading x-Intercepts, Axis of Symmetry (−b / 2a) & Parabola Vertex',
      faqSectionH2: 'Quadratic Roots, Factoring vs. Formula & Complex Imaginary Root Questions',
      relatedSectionH2: 'Linear Equation, Exponent & Scientific Calculators',
    },
    humanHowItWorksParagraph:
      'Every parabola written in standard form ax² + bx + c = 0 (where a ≠ 0) can be solved by completing the square—which condenses into the universal quadratic formula x = (−b ± √(b² − 4ac)) ÷ (2a). The expression underneath the square root sign, Δ = b² − 4ac, is called the discriminant because it discriminates between three geometric possibilities before you even finish the arithmetic.',
    humanClosingNote:
      'When Δ > 0, the parabola crosses the x-axis twice (two distinct real roots); when Δ = 0, its vertex kisses the x-axis at a single point (−b / 2a); when Δ < 0, the parabola floats completely above or below the x-axis (two complex conjugate roots).',
    fieldNote: {
      kicker: 'Algebra & Physics Field Note · Signs of Coefficients a, b, and c',
      heading: 'Why dropping the minus sign on b or c flips the discriminant from negative to positive',
      body: 'In the equation 2x² − 5x − 3 = 0, the coefficients are a = 2, b = −5, and c = −3. Because c is negative, the −4ac term in b² − 4ac becomes −4(2)(−3) = +24, making the discriminant (−5)² + 24 = 49 (a clean perfect square, √49 = 7). If you accidentally enter c = +3 instead of −3, the discriminant shrinks to 25 − 24 = 1 and gives completely wrong roots.',
      commonMistakeTitle: 'Dividing only the √(b² − 4ac) term by 2a instead of the entire numerator',
      commonMistakeText:
        'The fraction bar stretches under BOTH −b and ±√Δ: x = (−b ± √Δ) / (2a).',
      proTipTitle: 'Quick root-sum and root-product check (Vieta’s Formulas)',
      proTipText:
        'Your two roots r₁ and r₂ must always add up to −b/a and multiply to c/a. For 2x² − 5x − 3 = 0, roots 3 and −0.5 sum to 2.5 (−(−5)/2) and multiply to −1.5 (−3/2).',
    },
    benchmarkTable: {
      heading: 'Quadratic Discriminant (Δ = b² − 4ac) & Root Behavior Reference Table',
      subheading:
        'How the value of the discriminant determines root count, factoring, and graph geometry.',
      columns: ['Discriminant Value (Δ)', 'Example Quadratic', 'Root Classification', 'Parabola x-Axis Geometry'],
      rows: [
        { col1: 'Δ > 0 (Perfect Square, Δ = 49)', col2: '2x² − 5x − 3 = 0', col3: '2 Rational Roots (x = 3, −0.5)', col4: 'Crosses x-axis at two clean fractions' },
        { col1: 'Δ > 0 (Non-Square, Δ = 8)', col2: 'x² − 4x + 2 = 0', col3: '2 Irrational Roots (2 ± √2)', col4: 'Crosses x-axis at 0.586 and 3.414' },
        { col1: 'Δ = 0 (Zero Discriminant)', col2: 'x² − 6x + 9 = 0', col3: '1 Repeated Real Root (x = 3)', col4: 'Vertex touches x-axis at (3, 0)' },
        { col1: 'Δ < 0 (Negative, Δ = −16)', col2: 'x² + 2x + 5 = 0', col3: '2 Complex Roots (−1 ± 2i)', col4: 'Never touches real x-axis' },
      ],
    },
  },

  'profit-margin-calculator': {
    archetype: 'business-margin',
    sectionOrderVariant: 3,
    headings: {
      formulaSectionH2: 'Gross Profit Margin Equation ((Revenue − COGS) ÷ Revenue × 100)',
      exampleSectionH2: 'Unit Economics Walkthrough: $60 Wholesale Cost Sold at $100 Retail',
      howToUseH2: 'Entering Cost of Goods Sold (COGS) and Selling Price',
      howItWorksH2: 'How Gross Margin, Operating Margin & Net Profit Margin Differ',
      understandingResultH2: 'Margin vs. Markup: Why a 50% Markup Yields Only a 33.3% Profit Margin',
      faqSectionH2: 'Gross Margin, Retail Markup & Break-Even Pricing Questions',
      relatedSectionH2: 'Discount, Markup, Break-Even & ROI Calculators',
    },
    humanHowItWorksParagraph:
      'Profit margin measures how many cents of profit your business keeps out of every dollar of sales revenue. You subtract direct Cost of Goods Sold (COGS) from net selling price to get gross profit dollars, then divide that profit by the selling price: Margin % = (Revenue − Cost) ÷ Revenue × 100. Notice the denominator is Revenue, not Cost.',
    humanClosingNote:
      'To hit a target gross margin M (as a decimal) on an item that costs C, set your selling price using Price = Cost ÷ (1 − M)—never Cost × (1 + M).',
    fieldNote: {
      kicker: 'Retail & SaaS Pricing Field Note · The Margin vs. Markup Trap',
      heading: 'Why marking up a $100 product by 40% ($140) only gives you a 28.6% gross margin',
      body: 'Founders and store buyers routinely confuse markup (profit divided by cost) with margin (profit divided by selling price). If a jacket costs $100 from the factory and you want a 40% gross margin, charging $140 only gives you $40 ÷ $140 = 28.57% margin. Once you offer a 15% seasonal promo code on $140 (dropping the price to $119), your gross profit plunges to $19 (16% margin). To earn a true 40% margin on a $100 cost, you must divide $100 by (1 − 0.40) = $100 ÷ 0.60 = $166.67.',
      commonMistakeTitle: 'Multiplying cost by (1 + target margin) to set list prices',
      commonMistakeText:
        'Multiplying cost by 1.50 gives a 50% markup, which is only a 33.33% margin. Always divide cost by (1 − target margin) instead.',
      proTipTitle: 'Include payment processing (2.9% + $0.30) and inbound freight in COGS',
      proTipText:
        'Leaving credit-card swipe fees and fulfillment packaging out of COGS overstates true unit gross margin by 4 to 7 percentage points.',
    },
    benchmarkTable: {
      heading: 'Gross Margin vs. Markup Conversion & Pricing Multiplier Chart',
      subheading:
        'Exact selling price multiplier needed on a $100 unit cost to achieve each target gross profit margin.',
      columns: ['Target Gross Margin', 'Equivalent Markup %', 'Formula (Cost ÷ (1 − Margin))', 'Selling Price on $100 Cost'],
      rows: [
        { col1: '20.0% Gross Margin', col2: '25.0% Markup', col3: 'Cost ÷ 0.80 (1.25×)', col4: '$125.00 ($25.00 profit)' },
        { col1: '30.0% Gross Margin', col2: '42.9% Markup', col3: 'Cost ÷ 0.70 (1.4286×)', col4: '$142.86 ($42.86 profit)' },
        { col1: '33.3% Gross Margin', col2: '50.0% Markup', col3: 'Cost ÷ 0.6667 (1.50×)', col4: '$150.00 ($50.00 profit)' },
        { col1: '40.0% Gross Margin', col2: '66.7% Markup', col3: 'Cost ÷ 0.60 (1.6667×)', col4: '$166.67 ($66.67 profit)' },
        { col1: '50.0% Gross Margin (Keystone)', col2: '100.0% Markup', col3: 'Cost ÷ 0.50 (2.00×)', col4: '$200.00 ($100.00 profit)' },
      ],
    },
  },
};

// Map sibling slugs and guide slugs to their canonical practitioner profiles
HUMAN_PAGE_EDITORIAL_PROFILES['margin-calculator'] = HUMAN_PAGE_EDITORIAL_PROFILES['profit-margin-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['markup-calculator'] = HUMAN_PAGE_EDITORIAL_PROFILES['profit-margin-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['equation-solver'] = HUMAN_PAGE_EDITORIAL_PROFILES['quadratic-equation-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-calculate-percentage-change'] = HUMAN_PAGE_EDITORIAL_PROFILES['percentage-change-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-convert-inches-to-cm'] = HUMAN_PAGE_EDITORIAL_PROFILES['length'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-convert-kg-to-lbs'] = HUMAN_PAGE_EDITORIAL_PROFILES['weight'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-calculate-compound-interest'] = HUMAN_PAGE_EDITORIAL_PROFILES['compound-interest-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-calculate-loan-payments'] = HUMAN_PAGE_EDITORIAL_PROFILES['loan-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-calculate-bmi'] = HUMAN_PAGE_EDITORIAL_PROFILES['bmi-calculator'];
HUMAN_PAGE_EDITORIAL_PROFILES['how-to-calculate-age-from-date-of-birth'] = HUMAN_PAGE_EDITORIAL_PROFILES['age-calculator'];




/**
 * Generates a unique, domain-authentic editorial profile for any page that does not
 * have a dedicated manual entry in HUMAN_PAGE_EDITORIAL_PROFILES, ensuring zero pages
 * ever fall back to generic template headings or the synthetic 0.5x/2.0x table.
 */
export function resolveHumanEditorialProfile(params: {
  slug: string;
  title: string;
  categoryName: string;
  subcategory?: string;
}): HumanEditorialProfile {
  const cleanSlug = params.slug.replace(/^\/+|\/+$/g, '').split('/').pop() || params.slug;
  if (HUMAN_PAGE_EDITORIAL_PROFILES[cleanSlug]) {
    return HUMAN_PAGE_EDITORIAL_PROFILES[cleanSlug];
  }

  // Deterministic variant index (0..3) from slug characters so adjacent tools have different DOM section orders
  let hash = 0;
  for (let i = 0; i < cleanSlug.length; i++) {
    hash = (hash * 31 + cleanSlug.charCodeAt(i)) >>> 0;
  }
  const sectionOrderVariant = (hash % 4) as 0 | 1 | 2 | 3;

  const lowerSlug = cleanSlug.toLowerCase();
  const lowerCat = params.categoryName.toLowerCase();
  const cleanSubject = params.title
    .replace(/\s+Calculator$/i, '')
    .replace(/\s+Converter$/i, '')
    .replace(/\s+Solver$/i, '');

  // 1. Business, Margin, Markup, Discount, Break-Even, ROI
  if (
    params.subcategory === 'business' ||
    lowerSlug.includes('margin') ||
    lowerSlug.includes('markup') ||
    lowerSlug.includes('break-even') ||
    lowerSlug.includes('discount') ||
    lowerSlug.includes('roi')
  ) {
    return {
      archetype: 'business-margin',
      sectionOrderVariant,
      headings: {
        formulaSectionH2: `${cleanSubject} Equation & Unit Economics`,
        exampleSectionH2: `Real Storefront & P&L Pricing Walkthrough`,
        howToUseH2: `Entering Cost, Revenue & Pricing Inputs`,
        howItWorksH2: `How ${cleanSubject} Drives Bottom-Line Profit`,
        understandingResultH2: `Reading Your ${cleanSubject} Numbers Without Confusing Markup and Margin`,
        faqSectionH2: `Pricing & Unit Economics Q&A`,
        relatedSectionH2: `More Pricing, Margin & Break-Even Tools`,
      },
      fieldNote: {
        kicker: 'Unit Economics Field Note · The Margin vs. Markup Trap',
        heading: 'Why a 50% markup only puts a 33.3% gross margin in your bank account',
        body: `In retail and contracting, mixing up markup and gross margin is the fastest way to underprice a job. Markup divides profit by your cost; margin divides profit by the final selling price. If a part costs you $100 and you mark it up 50% to sell at $150, your profit is $50—which is only 33.3% of the $150 revenue ($50 ÷ $150). To land a true 50% gross margin on a $100 cost, you must divide cost by (1 − 0.50) and charge $200 (a 100% "Keystone" markup).`,
        commonMistakeTitle: 'Offering a 20% promo discount on a 25% margin product without checking volume',
        commonMistakeText:
          'Cutting your selling price by 20% when your gross margin is 25% wipes out four-fifths of your profit per unit—meaning you must sell 5× as many units just to make the same total dollars.',
        proTipTitle: 'Price from target margin using Cost ÷ (1 − Margin%)',
        proTipText:
          'Never multiply cost by (1 + Margin%). Divide your unit cost by (1 − target margin decimal) so your P&L hits the exact margin percentage after the sale.',
      },
      benchmarkTable: {
        heading: 'Gross Margin vs. Markup Conversion Reference Table',
        subheading:
          'Side-by-side lookup showing what markup multiplier is required on a $100 unit cost to achieve your target gross margin.',
        columns: ['Target Gross Margin', 'Required Markup %', 'Selling Price on $100 Cost', 'Gross Profit Kept'],
        rows: [
          { col1: '20.0% Margin', col2: '25.0% Markup', col3: '$125.00', col4: '$25.00 per unit' },
          { col1: '25.0% Margin', col2: '33.3% Markup', col3: '$133.33', col4: '$33.33 per unit' },
          { col1: '33.3% Margin', col2: '50.0% Markup', col3: '$150.00', col4: '$50.00 per unit' },
          { col1: '40.0% Margin', col2: '66.7% Markup', col3: '$166.67', col4: '$66.67 per unit' },
          { col1: '50.0% Margin (Keystone)', col2: '100.0% Markup', col3: '$200.00', col4: '$100.00 per unit' },
        ],
      },
    };
  }

  // 2. Salary, Tax, Paycheck, 1099, Self-Employment, International Tax
  if (
    params.subcategory === 'tax' ||
    lowerSlug.includes('tax') ||
    lowerSlug.includes('salary') ||
    lowerSlug.includes('pay') ||
    lowerSlug.includes('overtime') ||
    lowerSlug.includes('1099') ||
    lowerSlug.includes('bonus')
  ) {
    return {
      archetype: 'tax-statutory',
      sectionOrderVariant,
      headings: {
        formulaSectionH2: `Statutory ${cleanSubject} Formula & Bracket Logic`,
        exampleSectionH2: `Paystub & Tax Return Walkthrough`,
        howToUseH2: `Entering Gross Pay, Filing Status & Pre-Tax Deductions`,
        howItWorksH2: `How Progressive Tax Brackets & Payroll Withholdings Actually Work`,
        understandingResultH2: `Marginal Bracket Rate vs. Effective Tax Rate on Your Paycheck`,
        faqSectionH2: `Payroll, Withholding & Tax Filing Questions`,
        relatedSectionH2: `Related Salary, Tax & Take-Home Calculators`,
      },
      fieldNote: {
        kicker: 'Payroll & Tax Field Note · The Marginal Tax Bracket Myth',
        heading: 'Getting a raise into a higher tax bracket never lowers your take-home pay',
        body: `One of the most stubborn workplace myths is that a pay raise or bonus can "push you into a higher tax bracket and make you take home less money." Progressive tax systems (US IRS, UK HMRC, Canada CRA, India Income Tax) work like water filling a series of buckets. Only the dollars sitting above the new bracket threshold are taxed at the higher rate; every dollar below that line stays taxed at the lower rates.`,
        commonMistakeTitle: 'Confusing bi-weekly (26 paychecks) with semi-monthly (24 paychecks)',
        commonMistakeText:
          'Being paid every two weeks (bi-weekly) produces 26 paychecks in a 52-week year—meaning two months each year deliver three paychecks. Semi-monthly (1st and 15th) produces 24 slightly larger checks.',
        proTipTitle: 'Pre-tax retirement contributions save tax at your top marginal rate',
        proTipText:
          'Every $1,000 directed into a pre-tax 401(k), traditional pension, or HSA comes off the very top of your taxable income—saving you your highest marginal federal + state rate immediately.',
      },
      benchmarkTable: {
        heading: 'Standard Pay Frequency & Work-Hour Conversion Multipliers',
        subheading:
          'How payroll systems translate a $100,000 annual salary across standard pay cadences (assuming 40 hrs/week, 52 weeks/year = 2,080 hours).',
        columns: ['Pay Frequency', 'Paychecks / Year', 'Gross Per Paycheck ($100k/yr)', 'Hours Covered Per Check'],
        rows: [
          { col1: 'Hourly (Full-Time Base)', col2: '2,080 Hours / Yr', col3: '$48.08 / hr', col4: '1.0 billable hour' },
          { col1: 'Weekly Payroll', col2: '52 Checks / Yr', col3: '$1,923.08', col4: '40.0 hours' },
          { col1: 'Bi-Weekly (Every 2 Weeks)', col2: '26 Checks / Yr', col3: '$3,846.15', col4: '80.0 hours' },
          { col1: 'Semi-Monthly (1st & 15th)', col2: '24 Checks / Yr', col3: '$4,166.67', col4: '86.67 hours avg' },
          { col1: 'Monthly Payroll', col2: '12 Checks / Yr', col3: '$8,333.33', col4: '173.33 hours avg' },
        ],
      },
    };
  }

  // 3. Finance, Retirement, 401k, Roth, RMD, FIRE, Savings, Refinance, Affordability
  if (
    lowerCat.includes('finance') ||
    lowerCat.includes('retirement') ||
    lowerSlug.includes('401k') ||
    lowerSlug.includes('roth') ||
    lowerSlug.includes('rmd') ||
    lowerSlug.includes('fire') ||
    lowerSlug.includes('savings') ||
    lowerSlug.includes('interest') ||
    lowerSlug.includes('refinance') ||
    lowerSlug.includes('affordability') ||
    lowerSlug.includes('debt')
  ) {
    return {
      archetype: 'financial-scenario',
      sectionOrderVariant,
      headings: {
        formulaSectionH2: `${cleanSubject} Mathematical Model & Key Variables`,
        exampleSectionH2: `Real-World Portfolio & Cash-Flow Scenario`,
        howToUseH2: `Configuring Your Balances, Rates & Time Horizon`,
        howItWorksH2: `The Mechanics Behind ${cleanSubject}`,
        understandingResultH2: `Evaluating Your ${cleanSubject} Projection Under Real Market Conditions`,
        faqSectionH2: `Planning & Strategy Questions`,
        relatedSectionH2: `More Finance & Retirement Planning Tools`,
      },
      fieldNote: {
        kicker: 'Financial Planning Field Note · Real vs. Nominal Purchasing Power',
        heading: 'Always stress-test long-term projections with a 2.5%–3.0% inflation haircut',
        body: `When modeling a 15- to 30-year financial plan, a 9% nominal stock market return looks dramatic on paper, but inflation quietly erodes what those future dollars can buy. Subtracting 2.5% to 3.0% for inflation gives you a 6.0% to 6.5% "real return," which shows your future nest egg in today's purchasing power so you can compare it directly against your current monthly living expenses.`,
        commonMistakeTitle: 'Leaving free employer 401(k) match dollars on the table',
        commonMistakeText:
          'A dollar-for-dollar or 50% employer match up to 6% of pay is an instant, risk-free 50% to 100% return before market compounding even starts.',
        proTipTitle: 'Check your break-even month before paying refinance closing costs',
        proTipText:
          'Divide total closing costs by your monthly payment savings (e.g., $4,200 closing costs ÷ $175/mo savings = 24 months). If you plan to sell or move before month 24, refinancing loses money.',
      },
      benchmarkTable: {
        heading: 'Long-Term Savings Rate vs. Years to Financial Independence',
        subheading:
          'How the percentage of take-home pay you invest determines how many years it takes to build a 25× annual-expense portfolio (assuming 5% real inflation-adjusted return).',
        columns: ['Savings Rate (% of Net Pay)', 'Annual Expenses Covered', 'Approx. Years to 25× Expenses', 'Safe 4% Withdrawal Target'],
        rows: [
          { col1: '10% Savings Rate', col2: '90% spent / 10% invested', col3: '~51 Years', col4: 'Replaces 100% of spending at 25×' },
          { col1: '20% Savings Rate', col2: '80% spent / 20% invested', col3: '~37 Years', col4: 'Standard 35–40 yr career track' },
          { col1: '35% Savings Rate', col2: '65% spent / 35% invested', col3: '~25 Years', col4: 'Accelerated early-retirement track' },
          { col1: '50% Savings Rate', col2: '50% spent / 50% invested', col3: '~17 Years', col4: 'Every working year funds 1 year off' },
        ],
      },
    };
  }

  // 4. Science, Physics, Chemistry, Lab, Date & Time
  if (
    lowerCat.includes('science') ||
    lowerCat.includes('date') ||
    lowerCat.includes('time') ||
    lowerSlug.includes('density') ||
    lowerSlug.includes('force') ||
    lowerSlug.includes('ohm') ||
    lowerSlug.includes('molarity') ||
    lowerSlug.includes('duration') ||
    lowerSlug.includes('date')
  ) {
    return {
      archetype: 'personal-lab',
      sectionOrderVariant,
      headings: {
        formulaSectionH2: `${cleanSubject} Equation & Unit Consistency`,
        exampleSectionH2: `Step-by-Step Worked Lab & Practical Example`,
        howToUseH2: `Entering Your Measurements & Units`,
        howItWorksH2: `How the ${cleanSubject} Relationship Works`,
        understandingResultH2: `Checking Significant Figures & Unit Prefixes`,
        faqSectionH2: `Practical & Lab Questions`,
        relatedSectionH2: `Related Science & Time Tools`,
      },
      fieldNote: {
        kicker: 'Lab & Engineering Field Note · Unit Prefix Mismatches',
        heading: '90% of calculation errors come from mixing milliliters with liters or grams with kilograms',
        body: `Before plugging numbers into any physical or time formula, check that every input shares the same base unit family. In Molarity (M = mol ÷ L), a 250 mL beaker must be entered as 0.250 L—entering 250 directly makes your concentration 1,000 times too small. Likewise, in payroll time duration, 8 hours and 30 minutes is 8.50 decimal hours, never 8.30.`,
        commonMistakeTitle: 'Entering 45 minutes as ".45" on a decimal payroll timesheet',
        commonMistakeText:
          'Because an hour has 60 minutes, 15 minutes is 0.25 hrs, 30 minutes is 0.50 hrs, and 45 minutes is 0.75 hrs (45 ÷ 60). Writing 7.45 instead of 7.75 shortchanges 18 minutes of pay.',
        proTipTitle: 'Track significant figures from your least precise instrument',
        proTipText:
          'If your scale reads to 2 decimal places (12.45 g) and your graduated cylinder reads to 2 significant figures (50 mL), round your final reported lab answer to match the least precise measurement.',
      },
      benchmarkTable: {
        heading: 'Standard Time-to-Decimal & SI Unit Prefix Reference',
        subheading:
          'Quick lookup for converting clock minutes to decimal payroll hours and standard metric lab prefixes.',
        columns: ['Clock Minutes / Prefix', 'Decimal Hours / Multiplier', 'Scientific Notation', 'Everyday Example'],
        rows: [
          { col1: '15 Minutes (Quarter Hour)', col2: '0.25 Hours', col3: '15 ÷ 60 = 1/4 hr', col4: '7h 15m = 7.25 decimal hrs' },
          { col1: '30 Minutes (Half Hour)', col2: '0.50 Hours', col3: '30 ÷ 60 = 1/2 hr', col4: '8h 30m = 8.50 decimal hrs' },
          { col1: '45 Minutes (Three-Quarter)', col2: '0.75 Hours', col3: '45 ÷ 60 = 3/4 hr', col4: '8h 45m = 8.75 decimal hrs' },
          { col1: 'Milli- (m) → Base Unit', col2: '÷ 1,000 (0.001)', col3: '10⁻³', col4: '500 mL = 0.500 L; 250 mg = 0.250 g' },
          { col1: 'Kilo- (k) → Base Unit', col2: '× 1,000 (1,000)', col3: '10³', col4: '2.5 kg = 2,500 g; 1.2 kW = 1,200 W' },
        ],
      },
    };
  }

  // 5. Default Math, Algebra, Statistics, Ratios, Square Roots, Exponents
  return {
    archetype: 'math-proof',
    sectionOrderVariant,
    headings: {
      formulaSectionH2: `${cleanSubject} Formula & Algebraic Identity`,
      exampleSectionH2: `Worked Step-by-Step Verification`,
      howToUseH2: `Entering Your Numbers & Parameters`,
      howItWorksH2: `Why the ${cleanSubject} Method Works`,
      understandingResultH2: `Practical Applications & Sanity-Checking Your Answer`,
      faqSectionH2: `Common Questions About ${cleanSubject}`,
      relatedSectionH2: `More Math & Algebra Calculators`,
    },
    fieldNote: {
      kicker: 'Math & Problem-Solving Field Note · Order of Operations & Sign Checks',
      heading: 'Always sanity-check the magnitude and sign before trusting a raw number',
      body: `Calculators execute exactly what you type, which means a misplaced negative sign or parenthesis changes everything. For instance, −4² in strict operator precedence means −(4 × 4) = −16, whereas (−4)² means (−4) × (−4) = +16. Similarly, when averaging a dataset with one extreme outlier (like home prices on a block with one mansion), check the median alongside the mean so a single huge number doesn't skew your conclusion.`,
      commonMistakeTitle: 'Rounding intermediate steps too early',
      commonMistakeText:
        'If a multi-step formula produces 0.333333 in step one, keep full precision until the final line. Rounding to 0.3 midway can introduce a 10% drift by the end of the problem.',
      proTipTitle: 'Estimate the ballpark in your head first',
      proTipText:
        'Before reading the exact decimal, round the inputs to easy whole numbers to predict the rough size of the answer. If you expect ~150 and see 1,500, you immediately spot a slipped decimal.',
    },
    benchmarkTable: {
      heading: 'Essential Mathematical Identities, Powers & Reference Constants',
      subheading:
        'Quick verification benchmarks for powers, roots, order of operations, and statistical measures.',
      columns: ['Mathematical Rule / Identity', 'Symbolic Form', 'Concrete Numerical Check', 'Key Edge Case to Watch'],
      rows: [
        {
          col1: 'Zero Exponent Identity',
          col2: 'x⁰ = 1 (for x ≠ 0)',
          col3: '5⁰ = 1, 100⁰ = 1',
          col4: '0⁰ is indeterminate in analysis',
        },
        {
          col1: 'Negative Exponent Reciprocal',
          col2: 'x⁻ⁿ = 1 ÷ xⁿ',
          col3: '2⁻³ = 1 ÷ 8 = 0.125',
          col4: 'Negative exponent flips to denominator, not a negative result',
        },
        {
          col1: 'Square Root Product Rule',
          col2: '√(a × b) = √a × √b',
          col3: '√144 = √(9 × 16) = 3 × 4 = 12',
          col4: 'Note: √(a + b) does NOT equal √a + √b',
        },
        {
          col1: 'Cross-Multiplication (Proportions)',
          col2: 'a / b = c / x ⇒ x = (b × c) ÷ a',
          col3: '3 / 4 = 9 / x ⇒ x = 36 ÷ 3 = 12',
          col4: 'Keep matching units on the same horizontal row',
        },
      ],
    },
  };
}

export interface SearchFaqEntry {
  question: string;
  answer: string;
}

const SLUG_GOOGLE_SEARCH_FAQS: Record<string, SearchFaqEntry[]> = {
  'discount-calculator': [
    {
      question: 'How do you calculate 20% off a price in your head?',
      answer:
        'Move the decimal point one place to the left to find 10% of the price, double that amount to get 20%, and subtract it from the original price. For example, on an $85 item, 10% is $8.50, so 20% off saves $17.00, leaving a final sale price of $68.00.',
    },
    {
      question: 'How do stacked discounts like "20% off plus an extra 10% off" work?',
      answer:
        'Stacked retail discounts are applied sequentially, not added together. First take 20% off $100 to get $80, then take 10% off the new $80 subtotal ($8), giving a final price of $72—which equals a 28% total discount, not 30%.',
    },
    {
      question: 'Is sales tax calculated before or after a store discount?',
      answer:
        'For regular store markdowns and retailer promo codes, sales tax is calculated on the discounted sale price after the percentage reduction is subtracted. Only certain manufacturer rebates may be taxed on the pre-discount price depending on state law.',
    },
    {
      question: 'How do I find the original price if I only know the sale price and discount percent?',
      answer:
        'Divide the final sale price by (1 − Discount % ÷ 100). For example, if a jacket is on sale for $60 after a 25% discount, divide $60 by 0.75 to find the original $80.00 sticker price.',
    },
  ],
  'percentage-to-decimal-calculator': [
    {
      question: 'How do you convert a percentage to a decimal without a calculator?',
      answer:
        'Remove the percent sign (%) and move the decimal point exactly two places to the left (which is the same as dividing by 100). For example, 25% becomes 0.25, 7.5% becomes 0.075, and 150% becomes 1.5.',
    },
    {
      question: 'What is 0.5% written as a decimal?',
      answer:
        '0.5% written as a decimal is 0.005 (not 0.05). Because 1% equals 0.01, half of one percent (0.5 ÷ 100) shifts two decimal places to the left to become 0.005.',
    },
    {
      question: 'How do you convert a decimal back into a percentage?',
      answer:
        'Multiply the decimal number by 100 (or shift the decimal point two places to the right) and attach the % symbol. For instance, 0.375 × 100 = 37.5%.',
    },
    {
      question: 'Why do finance and tax formulas require converting percentages to decimals?',
      answer:
        'Mathematical equations for interest, sales tax, and discounts operate on unit ratios rather than per-hundred notation. Converting 6.5% into 0.065 lets you multiply directly by a dollar balance ($1,000 × 0.065 = $65.00).',
    },
  ],
  'decimal-to-percent-calculator': [
    {
      question: 'How do you turn a decimal into a percentage?',
      answer:
        'Multiply the decimal value by 100—or move the decimal point two places to the right—and add the percent (%) sign. For example, 0.45 becomes 45%, 0.0825 becomes 8.25%, and 1.25 becomes 125%.',
    },
    {
      question: 'What is 0.125 as a percentage?',
      answer:
        '0.125 as a percentage is 12.5% (0.125 × 100 = 12.5%). In fraction form, 0.125 also equals 1/8.',
    },
    {
      question: 'Can a decimal greater than 1 be converted to a percentage?',
      answer:
        'Yes. Any decimal greater than 1 represents more than 100% of the base value. For example, 1.5 equals 150%, and 2.75 equals 275% (which means 2.75 times the original amount).',
    },
    {
      question: 'What is 0.01 vs 0.1 as a percent?',
      answer:
        '0.01 equals 1% (one hundredth), whereas 0.1 equals 10% (one tenth). Adding a trailing zero (0.10) makes it easy to see that 0.10 is 10%.',
    },
  ],
  'percentage-calculator': [
    {
      question: 'How do I calculate a percentage of a number?',
      answer:
        'Convert the percentage to a decimal by dividing by 100, then multiply by the total number: (Percent ÷ 100) × Number. For example, 15% of 200 is (15 ÷ 100) × 200 = 30.',
    },
    {
      question: 'How do I find what percentage one number is of another?',
      answer:
        'Divide the part by the whole and multiply the result by 100: (Part ÷ Whole) × 100. For example, 45 out of 60 is (45 ÷ 60) × 100 = 75%.',
    },
    {
      question: 'How do I add or subtract a percentage from a price?',
      answer:
        'To add X% (such as sales tax or a tip), multiply the price by (1 + X ÷ 100). To subtract X% (such as a sale discount), multiply the price by (1 − X ÷ 100).',
    },
    {
      question: 'What is the difference between percentage change and percentage difference?',
      answer:
        'Percentage change measures directional growth or decline from a specific starting value: (New − Old) ÷ Old × 100. Percentage difference compares two peer numbers when neither is the "before" value by dividing their absolute gap by their average.',
    },
  ],
};

export function ensureMinimumSearchFaqs(
  existingFaqs: SearchFaqEntry[],
  context: {
    slug: string;
    title: string;
    categoryName: string;
    formulaText: string;
    exampleTitle: string;
    exampleSteps: string[];
    fieldNote: HumanFieldNote;
    benchmarkRows: HumanBenchmarkRow[];
  },
  minCount = 6
): SearchFaqEntry[] {
  const result: SearchFaqEntry[] = [...existingFaqs];
  const seenQuestions = new Set(
    existingFaqs.map((f) => f.question.trim().toLowerCase())
  );

  const pushIfUnique = (q: string, a: string) => {
    const norm = q.trim().toLowerCase();
    if (!norm || !a.trim() || seenQuestions.has(norm)) return;
    seenQuestions.add(norm);
    result.push({ question: q.trim(), answer: a.trim() });
  };

  // 1. Add slug-specific high-volume Google Search queries if available
  const slugSpecific = SLUG_GOOGLE_SEARCH_FAQS[context.slug] || [];
  for (const item of slugSpecific) {
    pushIfUnique(item.question, item.answer);
  }

  const cleanTitle = context.title.replace(/\s*\(.*?\)\s*/g, '').trim();

  // 2. Add high-intent Google Search "People Also Ask" queries derived from this calculator's exact formula, worked example, practitioner pitfall, and pro tip
  pushIfUnique(
    `What is the exact formula used by the ${cleanTitle}?`,
    `The core mathematical formula is ${context.formulaText}. ${
      context.exampleSteps.length > 0
        ? `For example (${context.exampleTitle}): ${context.exampleSteps.join(' ')}`
        : ''
    }`
  );

  if (context.fieldNote.commonMistakeTitle && context.fieldNote.commonMistakeText) {
    pushIfUnique(
      `What is the most common mistake when calculating ${cleanTitle.toLowerCase()}?`,
      `${context.fieldNote.commonMistakeTitle}: ${context.fieldNote.commonMistakeText}`
    );
  }

  if (context.fieldNote.proTipTitle && context.fieldNote.proTipText) {
    pushIfUnique(
      `What is a quick mental math or practitioner tip for ${cleanTitle.toLowerCase()}?`,
      `${context.fieldNote.proTipTitle} — ${context.fieldNote.proTipText}`
    );
  }

  if (context.benchmarkRows.length >= 2) {
    const sampleBenchmarks = context.benchmarkRows
      .slice(0, 3)
      .map((r) => `${r.col1}: ${r.col2} (${r.col3})`)
      .join('; ');
    pushIfUnique(
      `What are the most common reference benchmarks for ${cleanTitle.toLowerCase()}?`,
      `Key verified reference benchmarks include — ${sampleBenchmarks}. You can view the full reference table on this page or enter your own numbers into the calculator above.`
    );
  }

  // 3. Category-specific Google Search PAA fallback questions to guarantee >= minCount (at least 6-7 FAQs)
  const catLower = context.categoryName.toLowerCase();
  if (catLower.includes('finance') || catLower.includes('tax') || catLower.includes('business')) {
    pushIfUnique(
      `How accurate are the results from this ${cleanTitle}?`,
      `This ${cleanTitle} uses published statutory formulas, standard compounding conventions, and unrounded floating-point intermediate math before rounding the final currency display. For formal tax filings or loan contracts, always verify with your official statement or advisor.`
    );
    pushIfUnique(
      `Can I use the ${cleanTitle} on mobile and print or copy the breakdown?`,
      `Yes. The ${cleanTitle} updates immediately on mobile, tablet, and desktop browsers, and includes one-click Copy Result and Print actions with zero sign-up required.`
    );
  } else if (catLower.includes('conversion') || catLower.includes('unit')) {
    pushIfUnique(
      `Does this ${cleanTitle} use official NIST SP 811 conversion factors?`,
      `Yes. All unit conversions on SolveItCalculator follow exact International System of Units (SI) and NIST Special Publication 811 standards (such as 1 inch = 25.4 mm and 1 lb = 0.45359237 kg) with full decimal precision.`
    );
    pushIfUnique(
      `How do I reverse the conversion direction in the ${cleanTitle}?`,
      `Click the Swap Units button between the From and To selectors (or pick any preset pair card) to flip the conversion direction immediately while preserving your input value.`
    );
  } else {
    pushIfUnique(
      `How do I verify my ${cleanTitle.toLowerCase()} answer step by step?`,
      `Every result card displays both the final numerical answer and the substituted step-by-step equation (${context.formulaText}) so you can verify how your inputs were evaluated.`
    );
    pushIfUnique(
      `Is the ${cleanTitle} free to use for homework, business, and everyday calculations?`,
      `Yes. The ${cleanTitle} is 100% free, runs instantaneously in your browser without registration, and works seamlessly on phones, tablets, and computers.`
    );
  }

  return result.slice(0, Math.max(minCount, existingFaqs.length, 7));
}

