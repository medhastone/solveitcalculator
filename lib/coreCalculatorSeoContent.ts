export interface CoreCalculatorFaqItem {
  question: string;
  answer: string;
}

export interface CoreCalculatorSeoEntry {
  slug:
    | 'mortgage-calculator'
    | 'bmi-calculator'
    | 'loan-calculator'
    | 'percentage-calculator'
    | 'age-calculator';
  path: string;
  name: string;
  url: string;
  applicationCategory: string;
  guideTitle: string;
  guideParagraphs: string[];
  faqs: [CoreCalculatorFaqItem, CoreCalculatorFaqItem, CoreCalculatorFaqItem];
}

export const CORE_CALCULATOR_SEO_ENTRIES: CoreCalculatorSeoEntry[] = [
  {
    slug: 'mortgage-calculator',
    path: '/mortgage-calculator',
    name: 'Mortgage Calculator',
    url: 'https://solveitcalculator.com/mortgage-calculator',
    applicationCategory: 'FinanceApplication',
    guideTitle: 'How to Use This Calculator & Why It Matters',
    guideParagraphs: [
      'A mortgage calculator turns a home price and loan terms into a clear monthly payment estimate before you apply with a lender. Buying a home is often the largest monthly bill a household takes on, so seeing how each number affects your budget helps you compare loan options with confidence. This tool uses the standard fixed-rate amortization formula, M = P × [r(1 + r)^n] / [(1 + r)^n − 1], where P is the loan amount, r is the monthly interest rate, and n is the total number of monthly payments.',
      'To use the calculator, enter five main inputs: the home price, your down payment (as a dollar amount or percent), the loan term in years (such as 15 or 30), and the annual interest rate. You can also include estimated yearly property taxes, homeowners insurance, HOA dues, and private mortgage insurance (PMI) if your down payment is below 20 percent. The tool shows both your base principal-and-interest payment and your full estimated monthly housing cost, along with total interest paid over the life of the loan.',
      'Consider a real-world example. Suppose you buy a $400,000 home and put 20 percent down, which is $80,000. Your loan principal is $320,000. On a 30-year fixed loan at a 6.5 percent annual interest rate, the monthly rate is 0.065 divided by 12, spread across 360 monthly payments. Using the amortization formula, your monthly principal and interest payment comes to $2,022.62. In month one, $1,733.33 goes toward interest and $289.29 pays down your balance. Adding $300 for property tax and $125 for insurance brings your monthly total to $2,447.62.',
      'One common mistake buyers make is checking only principal and interest while ignoring escrow costs like property taxes, homeowners insurance, HOA fees, and PMI. Those extras can add hundreds of dollars to every monthly bill. Including them right away gives you a realistic budget before you make an offer.',
    ],
    faqs: [
      {
        question: 'How is mortgage interest calculated monthly?',
        answer:
          'Monthly mortgage interest equals your remaining loan balance multiplied by the monthly interest rate, which is your annual rate divided by 12. For example, on a $320,000 balance at 6.5 percent, divide 0.065 by 12 to get 0.005417, then multiply by $320,000 to get $1,733.33 in first-month interest. As your balance drops each month, the interest share shrinks and more payment reduces principal.',
      },
      {
        question: 'How much does a 15-year mortgage save compared to a 30-year mortgage?',
        answer:
          'A 15-year mortgage has a higher monthly payment because you repay the principal in 180 months instead of 360, but it dramatically reduces total interest paid. Because your balance falls much faster each year, interest accrues on a smaller principal for half as long. You can enter both terms in the calculator with your loan amount and rate to compare exact monthly payments and lifetime interest side by side.',
      },
      {
        question: 'When do I have to pay private mortgage insurance (PMI)?',
        answer:
          'On most conventional home loans, lenders require private mortgage insurance when your down payment is less than 20 percent of the purchase price. PMI protects the lender if a borrower stops paying, not the homeowner. Once your loan balance drops to 80 percent of the home’s original value through regular payments or extra principal, you can typically ask your lender to remove PMI.',
      },
    ],
  },
  {
    slug: 'bmi-calculator',
    path: '/bmi-calculator',
    name: 'BMI Calculator',
    url: 'https://solveitcalculator.com/bmi-calculator',
    applicationCategory: 'HealthApplication',
    guideTitle: 'How to Use This Calculator & Why It Matters',
    guideParagraphs: [
      'A Body Mass Index (BMI) calculator estimates whether an adult’s weight falls within standard screening categories for their height. Doctors and health organizations use BMI as a quick starting point to spot potential weight-related health risks because it requires only two simple measurements and no special equipment. The formula is standard worldwide: in metric units, BMI = weight (kg) ÷ height (m)², and in US customary units, BMI = (weight in pounds × 703) ÷ (height in inches)².',
      'To use this calculator, pick your preferred unit system—Metric (kilograms and centimeters) or US Imperial (pounds, feet, and inches). Next, enter your current weight and standing height. The tool instantly computes your BMI score, maps it to the standard World Health Organization adult categories (underweight below 18.5, normal weight from 18.5 to 24.9, overweight from 25.0 to 29.9, and obesity at 30.0 or above), and shows the weight range linked to a healthy BMI for your height.',
      'Here is a straightforward worked example. Suppose an adult weighs 70 kilograms and stands 175 centimeters tall. First, convert 175 centimeters to meters by dividing by 100, which gives 1.75 meters. Next, square the height: 1.75 × 1.75 equals 3.0625. Finally, divide 70 by 3.0625 to get 22.86, which rounds to a BMI of 22.9. Because 22.9 sits comfortably between 18.5 and 24.9, it falls in the normal weight category, where a healthy weight for 175 centimeters spans roughly 56.7 to 76.3 kilograms.',
      'One common mistake is treating BMI as a direct measurement of body fat or overall health. BMI only compares total weight to height—it cannot tell muscle apart from fat, nor does it show where fat is stored. Very muscular athletes can score in the overweight range despite low body fat, while some older adults may have a normal BMI yet carry excess abdominal fat. Always view BMI alongside waist size, habits, and guidance from a healthcare professional.',
    ],
    faqs: [
      {
        question: 'What is a good BMI for a woman over 50?',
        answer:
          'Standard adult BMI guidelines do not change by age or sex, so the official normal range remains 18.5 to 24.9 for a woman over 50. However, body composition shifts with age as muscle mass and bone density naturally decline. Many clinicians also consider waist circumference, strength, blood pressure, and lab results alongside BMI, and slightly higher weights near the upper normal range are sometimes viewed carefully in older adults.',
      },
      {
        question: 'Why does the US imperial BMI formula multiply weight by 703?',
        answer:
          'The number 703 is a unit conversion factor that turns pounds and inches into the same scale as kilograms and square meters. Because 1 kilogram equals about 2.20462 pounds and 1 meter equals about 39.3701 inches, dividing 39.3701 squared by 2.20462 yields roughly 703.07. Multiplying pounds by 703 and dividing by inches squared ensures both unit systems produce the exact same BMI result.',
      },
      {
        question: 'Can I use an adult BMI calculator for children or teenagers?',
        answer:
          'No, standard adult BMI categories should not be used to interpret BMI for children or teens aged 2 to 19. While the underlying math (weight divided by height squared) is identical, young people are still growing and body fat levels shift rapidly by age and sex. Pediatric clinicians plot a child’s BMI on age- and sex-specific percentile growth charts instead of fixed adult cutoffs.',
      },
    ],
  },
  {
    slug: 'loan-calculator',
    path: '/loan-calculator',
    name: 'Loan Calculator',
    url: 'https://solveitcalculator.com/loan-calculator',
    applicationCategory: 'FinanceApplication',
    guideTitle: 'How to Use This Calculator & Why It Matters',
    guideParagraphs: [
      'A loan calculator shows what an installment loan truly costs before you sign a contract. Whether you are financing a car, consolidating debt, or taking out a personal loan, knowing both the monthly payment and the total interest lets you spot expensive terms quickly. This calculator applies the standard fixed-rate installment formula, M = P × [r(1 + r)^n] / [(1 + r)^n − 1], where P is the borrowed principal, r is the monthly interest rate, and n is the total number of monthly payments.',
      'Start by entering three core inputs: the loan amount you plan to borrow, the annual interest rate (or APR if fees are rolled into the rate), and the repayment term in months or years. You can also test an optional extra monthly payment to see how paying ahead shortens your payoff timeline. The output displays your fixed monthly payment, total interest paid across the full term, total repayment amount, and a clear payoff schedule.',
      'Walk through a practical car-loan scenario. Imagine you borrow $25,000 at a 6.5 percent annual interest rate for 60 months (5 years). Dividing 0.065 by 12 gives a monthly rate of 0.005417 across 60 payments. Plugging those numbers into the amortization formula gives a monthly payment of $489.15. Over five years, you repay $29,349.22 in total, which means $4,349.22 goes to interest. If you instead choose a 36-month term at the same 6.5 percent rate, your monthly payment rises to $766.23, but total interest falls to $2,584.10—saving $1,765.12.',
      'One common mistake borrowers make is shopping only by monthly payment and stretching the loan term to 72 or 84 months to make the bill look smaller. Longer terms keep your principal higher for more months, which multiplies total interest paid and can leave you owing more than an asset is worth. Always compare total interest alongside the monthly payment.',
    ],
    faqs: [
      {
        question: 'What is the difference between interest rate and APR on a loan?',
        answer:
          'The interest rate is the yearly percentage a lender charges strictly for borrowing the principal balance. Annual Percentage Rate (APR) is broader because it combines the interest rate with mandatory upfront charges such as origination fees, folded into one yearly cost figure. Comparing APRs across lenders gives a truer apples-to-apples view of total borrowing cost than comparing base interest rates alone.',
      },
      {
        question: 'How does making an extra monthly payment reduce loan interest?',
        answer:
          'When you pay extra toward your loan principal, your remaining balance shrinks ahead of schedule. Because lenders calculate each month’s interest on the current unpaid balance, a smaller balance generates less interest in every future month. That creates a snowball effect that cuts total interest and moves up your payoff date—just confirm with your lender that extra money is applied directly to principal with no prepayment penalty.',
      },
      {
        question: 'How is a monthly car loan payment calculated by hand?',
        answer:
          'Use the standard amortization formula: M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1]. Here, P is the loan amount after your down payment and trade-in, r is the annual interest rate divided by 12, and n is the number of monthly payments. For example, on a $25,000 loan at 6.5 percent over 60 months, r is 0.005417 and n is 60, resulting in $489.15 per month.',
      },
    ],
  },
  {
    slug: 'percentage-calculator',
    path: '/math/percentage-calculator',
    name: 'Percentage Calculator',
    url: 'https://solveitcalculator.com/math/percentage-calculator',
    applicationCategory: 'EducationalApplication',
    guideTitle: 'How to Use This Calculator & Why It Matters',
    guideParagraphs: [
      'A percentage calculator solves everyday percent math in seconds while showing every arithmetic step behind the answer. Because "percent" literally means "per hundred," percentages show up everywhere: store discounts, restaurant tips, sales tax, test grades, pay raises, and price comparisons. The three core formulas cover nearly every situation: finding a percent of a number uses (P ÷ 100) × Total, finding what percent A is of B uses (A ÷ B) × 100, and percent change uses [(New − Old) ÷ Old] × 100.',
      'To use the calculator, select the question format that matches your problem—such as "What is X% of Y?", "X is what percent of Y?", or "Percentage increase or decrease from X to Y." Type your known values into the input boxes, and the calculator immediately shows the exact result along with the step-by-step equation so you can double-check the math or write it down for homework or budgets.',
      'Consider a common shopping scenario. Suppose a jacket costs $80, is marked 25 percent off, and your local sales tax is 8 percent applied to the discounted price. First, find the discount: (25 ÷ 100) × $80 = 0.25 × $80 = $20. Subtract $20 from $80 to get the $60 sale price. Next, calculate sales tax on the new $60 price: (8 ÷ 100) × $60 = $4.80. Adding tax brings your final register total to $64.80. If you are checking a quiz score of 42 out of 50 instead, divide 42 by 50 to get 0.84, then multiply by 100 to get 84 percent.',
      'One common mistake is thinking a percentage increase and the same percentage decrease cancel out. They do not, because the starting base changes. Raising $100 by 20 percent adds $20 to reach $120, but cutting $120 by 20 percent removes $24—leaving $96 instead of $100. Always check which number is your base before calculating.',
    ],
    faqs: [
      {
        question: 'How do you calculate a percentage of a number without a calculator?',
        answer:
          'Convert the percentage to a decimal by moving the decimal point two places to the left, then multiply by the whole number. You can also break tricky percents into easy chunks like 10 percent and 5 percent. For example, to find 15 percent of 80, take 10 percent (8) plus half of that for 5 percent (4), giving 12. That mental shortcut works cleanly for tips and discounts.',
      },
      {
        question: 'What is the difference between percent change and percentage points?',
        answer:
          'Percentage points measure the simple arithmetic gap between two percentages, while percent change measures the relative shift compared to the starting value. If a loan rate rises from 4 percent to 6 percent, that is an increase of 2 percentage points (6 − 4 = 2). As a relative percent change, however, it is a 50 percent increase because (6 − 4) ÷ 4 equals 0.50, or 50 percent.',
      },
      {
        question: 'How do you find the original price before a percentage discount?',
        answer:
          'Divide the sale price by (1 − discount rate as a decimal). Do not add the discount percentage back onto the sale price, because the discount was taken off the higher original total. For instance, if a shirt costs $60 after a 25 percent discount, you paid 75 percent (0.75) of the original price. Dividing $60 by 0.75 correctly recovers the original $80 price.',
      },
    ],
  },
  {
    slug: 'age-calculator',
    path: '/age-calculator',
    name: 'Age Calculator',
    url: 'https://solveitcalculator.com/age-calculator',
    applicationCategory: 'UtilitiesApplication',
    guideTitle: 'How to Use This Calculator & Why It Matters',
    guideParagraphs: [
      'An age calculator finds the exact time between a birth date and today—or any past or future target date—broken down into years, months, and days. While most people know their age in whole years, exact calendar age matters for school enrollment cutoffs, passport and visa forms, retirement eligibility, milestone planning, and pediatric checkups. Instead of rough averages, this tool follows standard Gregorian calendar rules so every 28-, 29-, 30-, and 31-day month plus leap years is counted accurately.',
      'To use the calculator, enter the Date of Birth (month, day, and year). By default, the "Age at the Date of" field is set to today’s date, or you can change it to any future or historical date to see how old someone will be—or was—on that exact day. The result displays chronological age in years, months, and days, along with helpful conversions like total months, total weeks, total days lived, and the countdown to the next birthday.',
      'Look at a real-world example. Suppose someone was born on June 15, 1995, and wants their exact age on November 19, 2026. First, count full calendar years from June 15, 1995 to June 15, 2026, which equals 31 complete years. Next, count full calendar months from June 15, 2026 to November 15, 2026, giving 5 complete months. Finally, count the remaining days from November 15 to November 19, which adds 4 days. Their exact chronological age on that date is 31 years, 5 months, and 4 days, with the total day count automatically adding extra days for every leap year between 1995 and 2026.',
      'One common mistake when calculating age by hand is assuming every year has 365 days and every month has 30 days. Because months vary in length and leap years add February 29 roughly every four years, rough division drifts off by days over a lifetime. Calendar-aware date subtraction prevents those off-by-one errors.',
    ],
    faqs: [
      {
        question: 'How does an age calculator handle leap year birthdays on February 29?',
        answer:
          'A person born on February 29 gains one chronological year every full calendar year, not once every four years. In non-leap years, most legal systems and standard calendar age calculators recognize the completed year of age on either February 28 or March 1, depending on local law. Meanwhile, total days lived counts every actual calendar day elapsed, including each February 29 that occurs.',
      },
      {
        question: 'How do you calculate exact age in years, months, and days manually?',
        answer:
          'Subtract the birth year from the target year, then adjust if the birthday has not arrived yet in the target year. If the target month is earlier than the birth month, subtract 1 from years and add 12 to months. If the target day is smaller than the birth day, borrow the exact number of days from the previous calendar month (28, 29, 30, or 31) before subtracting.',
      },
      {
        question: 'Why does chronological age sometimes differ from age in total days divided by 365?',
        answer:
          'Dividing total days lived by 365 ignores leap years, which add an extra day every four years (except century years not divisible by 400, like 1900). Over a 40-year span, ten leap days accumulate, making a simple 365-day division drift more than a week away from your true birthday. Chronological calendar math tracks exact month and year boundaries instead of fixed 365-day blocks.',
      },
    ],
  },
];

export const CORE_CALCULATOR_SEO_BY_SLUG: Record<string, CoreCalculatorSeoEntry> =
  Object.fromEntries(
    CORE_CALCULATOR_SEO_ENTRIES.map((entry) => [entry.slug, entry])
  );

export const CORE_CALCULATOR_SEO_BY_PATH: Record<string, CoreCalculatorSeoEntry> =
  Object.fromEntries(
    CORE_CALCULATOR_SEO_ENTRIES.map((entry) => [entry.path, entry])
  );

export function getCoreCalculatorSeoBySlug(
  slug: string | null | undefined
): CoreCalculatorSeoEntry | undefined {
  if (!slug) return undefined;
  return CORE_CALCULATOR_SEO_BY_SLUG[slug.toLowerCase()];
}

export function getCoreCalculatorSeoByPath(
  pathname: string | null | undefined
): CoreCalculatorSeoEntry | undefined {
  if (!pathname) return undefined;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return CORE_CALCULATOR_SEO_BY_PATH[normalized];
}

export function buildCoreCalculatorJsonLd(entry: CoreCalculatorSeoEntry) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: entry.name,
        url: entry.url,
        applicationCategory: entry.applicationCategory,
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: entry.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
