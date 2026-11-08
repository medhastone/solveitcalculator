export type GuideCategory =
  | 'Math & Percentages'
  | 'Finance & Business'
  | 'Home & Everyday'
  | 'Retirement & Tax';

export interface GuideStep {
  title: string;
  lines: string[];
  highlightLastLine?: boolean;
}

export interface GuideTableRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideRelatedCalculator {
  name: string;
  href: string;
}

export interface GuideArticleData {
  slug: string;
  title: string;
  shortTitle: string;
  category: GuideCategory;
  breadcrumbCategory: string;
  badgeSymbol: string;
  badgeGradient: string;
  heroIntro: string;
  heroCalcScreenValue: string;
  keywords: string[];
  featured?: boolean;

  // Table of Contents labels
  tocLabels: {
    s1: string;
    s2: string;
    s3: string;
    s4: string;
    s5: string;
    s6: string;
    s7: string;
    s8: string;
    s9: string;
  };

  // Section 1: Concept Definition
  section1: {
    heading: string;
    paragraphs: string[];
    callout: string;
  };

  // Section 2: Core Formula
  section2: {
    heading: string;
    intro: string;
    formulaPrefix: string;
    formulaHighlight: string;
    formulaSuffix: string;
    fullFormulaText: string;
    variables: { term: string; definition: string }[];
  };

  // Section 3: 4-Step Worked Example + Green Result Card
  section3: {
    heading: string;
    exampleTask: string;
    steps: GuideStep[];
    resultPrompt: string;
    resultBigValue: string;
    resultEquation: string;
  };

  // Section 4: Variation / Scenario A
  section4: {
    heading: string;
    intro: string;
    formula: string;
    exampleLead: string;
    bullets: string[];
    closingText: string;
    ctaLinkText: string;
    ctaLinkHref: string;
  };

  // Section 5: Variation / Scenario B
  section5: {
    heading: string;
    intro: string;
    formula: string;
    exampleLead: string;
    bullets: string[];
    closingText: string;
    ctaLinkText: string;
    ctaLinkHref: string;
  };

  // Section 6: Reference Table
  section6: {
    heading: string;
    headers: [string, string, string, string];
    rows: GuideTableRow[];
  };

  // Section 7: Common Mistakes
  section7: {
    heading: string;
    mistakes: string[];
  };

  // Right Sidebar
  sidebar: {
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonLabel: string;
    ctaHref: string;
    relatedCalculators: GuideRelatedCalculator[];
    keyTakeaways: string[];
    exploreDescription: string;
    exploreButtonLabel: string;
    exploreHref: string;
    faqs: GuideFaq[];
    references: string[];
  };
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  'Math & Percentages',
  'Finance & Business',
  'Home & Everyday',
  'Retirement & Tax',
];

export const GUIDES_DATA: GuideArticleData[] = [
  // ============================================================================
  // 1. HOW TO CALCULATE A PERCENTAGE (Flagship Guide)
  // ============================================================================
  {
    slug: 'how-to-calculate-a-percentage',
    title: 'How to Calculate a Percentage',
    shortTitle: 'Percentages',
    category: 'Math & Percentages',
    breadcrumbCategory: 'Math Guides',
    badgeSymbol: '%',
    badgeGradient: 'from-[#EF5350] to-[#D32F2F]',
    heroIntro:
      'Learn what a percentage is, how to calculate a percentage of a number, and how to find percentage increase and decrease with clear examples and step-by-step explanations.',
    heroCalcScreenValue: '37.5',
    featured: true,
    keywords: [
      'percentage',
      'how to calculate a percentage',
      'percentage formula',
      '15% of 250',
      'percentage increase',
      'percentage decrease',
      'percent of a number',
    ],
    tocLabels: {
      s1: 'What is a percentage?',
      s2: 'The percentage formula',
      s3: 'Step-by-step example',
      s4: 'Percentage increase',
      s5: 'Percentage decrease',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. What is a percentage?',
      paragraphs: [
        'A percentage is a way of expressing a number as a fraction of 100. The word “percent” means “out of 100” and is written with the % symbol.',
        'For example, 25% means 25 out of 100, which is the same as 0.25 or one quarter (1/4) of a whole.',
      ],
      callout:
        'A percentage can be greater than 100% and it can also be a decimal, such as 12.5%.',
    },
    section2: {
      heading: '2. The percentage formula',
      intro: 'To find a percentage of any number, use this simple formula:',
      formulaPrefix: 'Result = ',
      formulaHighlight: 'Percentage',
      formulaSuffix: ' × Number ÷ 100',
      fullFormulaText: 'Result = Percentage × Number ÷ 100',
      variables: [
        {
          term: 'Percentage',
          definition: 'is the percent value you want to find.',
        },
        {
          term: 'Number',
          definition: 'is the total or original value.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: '15% of 250',
      steps: [
        {
          title: 'Identify the values:',
          lines: ['Percentage = 15', 'Number = 250'],
        },
        {
          title: 'Substitute into the formula:',
          lines: ['Result = 15 × 250 ÷ 100'],
        },
        {
          title: 'Calculate:',
          lines: ['15 × 250 = 3,750', '3,750 ÷ 100 = 37.5'],
        },
        {
          title: 'Final answer:',
          lines: ['15% of 250 = 37.5'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '15% of 250 is:',
      resultBigValue: '37.5',
      resultEquation: '15 × 250 ÷ 100 = 37.5',
    },
    section4: {
      heading: '4. How to calculate a percentage increase',
      intro:
        'To find the percentage increase from an original value to a new higher value:',
      formula:
        'Percentage Increase = (New Value – Original Value) ÷ Original Value × 100',
      exampleLead: 'A price increases from 200 to 250.',
      bullets: [
        'Difference = 250 – 200 = 50',
        '50 ÷ 200 = 0.25',
        '0.25 × 100 = 25%',
      ],
      closingText:
        'So the percentage increase is 25%. You can also verify this instantly with the',
      ctaLinkText: 'Percentage Change Calculator',
      ctaLinkHref: '/math/percentage-change-calculator',
    },
    section5: {
      heading: '5. How to calculate a percentage decrease',
      intro: 'To find the percentage decrease when a value goes down:',
      formula:
        'Percentage Decrease = (Original Value – New Value) ÷ Original Value × 100',
      exampleLead: 'A price drops from 250 to 200.',
      bullets: [
        'Difference = 250 – 200 = 50',
        '50 ÷ 250 = 0.2',
        '0.2 × 100 = 20%',
      ],
      closingText:
        'So the percentage decrease is 20%. When comparing retail sale markdowns, try our',
      ctaLinkText: 'Discount Calculator',
      ctaLinkHref: '/math/discount-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Percentage', 'Number', 'Calculation', 'Result'],
      rows: [
        { col1: '10%', col2: '80', col3: '10 × 80 ÷ 100', col4: '8' },
        { col1: '15%', col2: '250', col3: '15 × 250 ÷ 100', col4: '37.5' },
        { col1: '25%', col2: '120', col3: '25 × 120 ÷ 100', col4: '30' },
        { col1: '50%', col2: '200', col3: '50 × 200 ÷ 100', col4: '100' },
        { col1: '12.5%', col2: '320', col3: '12.5 × 320 ÷ 100', col4: '40' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Forgetting to divide by 100.',
        'Dividing by the new value instead of the original value when finding percentage change.',
        'Confusing percentage points with percentage change.',
        'Mixing up the base number and the percentage.',
        'Rounding too early during multi-step calculations.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Percentage Calculator',
      ctaDescription:
        'Calculate percentages, increases, and decreases in seconds.',
      ctaButtonLabel: 'Open Percentage Calculator',
      ctaHref: '/math/percentage-calculator',
      relatedCalculators: [
        {
          name: 'Percentage Change Calculator',
          href: '/math/percentage-change-calculator',
        },
        { name: 'Discount Calculator', href: '/math/discount-calculator' },
        {
          name: 'Percentage Difference Calculator',
          href: '/math/percentage-difference-calculator',
        },
        {
          name: 'Percentage to Decimal',
          href: '/math/percentage-to-decimal-calculator',
        },
        { name: 'Percentage to Fraction', href: '/math/fraction-calculator' },
      ],
      keyTakeaways: [
        'A percentage means “out of 100”.',
        'Use Result = Percentage × Number ÷ 100.',
        'Always divide by the original value when calculating percentage increase or decrease.',
        'Convert percentages to decimals by dividing by 100.',
      ],
      exploreDescription: 'Check out all our free math calculators.',
      exploreButtonLabel: 'View All Math Calculators',
      exploreHref: '/math',
      faqs: [
        {
          question: 'What is the easiest way to calculate a percentage?',
          answer:
            'Multiply the percentage by the whole number, then divide the product by 100. For example, to find 15% of 250, multiply 15 × 250 to get 3,750, and divide by 100 to get 37.5.',
        },
        {
          question: 'How do I calculate 20% of a number quickly?',
          answer:
            'First find 10% of the number by moving the decimal point one place to the left, then double that result. For example, 10% of 80 is 8, so 20% of 80 is 16.',
        },
        {
          question:
            'What is the difference between percentage change and percentage difference?',
          answer:
            'Percentage change measures how much an original value has increased or decreased over time (dividing by the original value). Percentage difference compares two independent numbers where neither is the starting value (dividing by the average of the two numbers).',
        },
      ],
      references: [
        'Standard arithmetic and percentage definitions used in general mathematics education.',
      ],
    },
  },

  // ============================================================================
  // 2. HOW TO CALCULATE PERCENTAGE CHANGE (INCREASE & DECREASE)
  // ============================================================================
  {
    slug: 'how-to-calculate-percentage-change',
    title: 'How to Calculate Percentage Change (Increase & Decrease)',
    shortTitle: 'Percentage Change',
    category: 'Math & Percentages',
    breadcrumbCategory: 'Math Guides',
    badgeSymbol: 'Δ%',
    badgeGradient: 'from-[#2457D6] to-[#1D4ED8]',
    heroIntro:
      'Learn how to measure the exact percentage increase or decrease between a starting value and a final value, plus when to use percentage difference instead.',
    heroCalcScreenValue: '+22.5%',
    keywords: [
      'percentage change',
      'percent increase',
      'percent decrease',
      'percentage difference',
      'growth rate formula',
      'price change percentage',
    ],
    tocLabels: {
      s1: 'What is percentage change?',
      s2: 'Percentage change formula',
      s3: 'Step-by-step example',
      s4: 'Handling negative changes',
      s5: 'Change vs. difference',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. What is percentage change?',
      paragraphs: [
        'Percentage change measures how much a quantity grows or shrinks relative to its starting value. It expresses the change as a rate per 100 so you can compare shifts across different scales.',
        'Whether you are tracking monthly revenue, grocery prices, or website visitors, a positive result indicates a percentage increase and a negative result indicates a percentage decrease.',
      ],
      callout:
        'Always use the original starting value as the denominator—never the ending value.',
    },
    section2: {
      heading: '2. The percentage change formula',
      intro:
        'Subtract the original value from the new value, divide by the original value, and multiply by 100:',
      formulaPrefix: 'Change (%) = (',
      formulaHighlight: 'New Value – Original Value',
      formulaSuffix: ') ÷ Original Value × 100',
      fullFormulaText:
        'Change (%) = (New Value – Original Value) ÷ Original Value × 100',
      variables: [
        {
          term: 'Original Value',
          definition: 'is the starting baseline number before any change.',
        },
        {
          term: 'New Value',
          definition: 'is the ending number after the increase or decrease.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'a rent increase from 1,200 to 1,470',
      steps: [
        {
          title: 'Identify the starting and ending values:',
          lines: ['Original Value = 1,200', 'New Value = 1,470'],
        },
        {
          title: 'Find the absolute change:',
          lines: ['Difference = 1,470 – 1,200 = 270'],
        },
        {
          title: 'Divide by the original value and multiply by 100:',
          lines: ['270 ÷ 1,200 = 0.225', '0.225 × 100 = 22.5%'],
        },
        {
          title: 'Final answer:',
          lines: ['Percentage increase = +22.5%'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: 'Change from 1,200 to 1,470:',
      resultBigValue: '+22.5%',
      resultEquation: '(1,470 − 1,200) ÷ 1,200 × 100 = 22.5%',
    },
    section4: {
      heading: '4. How to interpret a negative result (decrease)',
      intro:
        'When the new value is smaller than the original value, the formula produces a negative number representing a percentage drop:',
      formula: 'Decrease (%) = (New Value – Original Value) ÷ Original Value × 100',
      exampleLead: 'Monthly electricity usage falls from 500 kWh to 410 kWh.',
      bullets: [
        'Change = 410 – 500 = –90 kWh',
        '–90 ÷ 500 = –0.18',
        '–0.18 × 100 = –18% (an 18% decrease)',
      ],
      closingText:
        'You can check both positive and negative shifts automatically in our',
      ctaLinkText: 'Percentage Change Calculator',
      ctaLinkHref: '/math/percentage-change-calculator',
    },
    section5: {
      heading: '5. Percentage change vs. percentage difference',
      intro:
        'Use percentage difference when comparing two peer numbers where neither is a “before” or “after” value (for example, comparing the height of two buildings):',
      formula: 'Percentage Difference = |A – B| ÷ [(A + B) ÷ 2] × 100',
      exampleLead: 'Comparing Store A ($80) and Store B ($100):',
      bullets: [
        'Absolute difference = |80 – 100| = 20',
        'Average of both stores = (80 + 100) ÷ 2 = 90',
        '20 ÷ 90 × 100 = 22.22% difference',
      ],
      closingText:
        'Compare any two independent values side by side using the',
      ctaLinkText: 'Percentage Difference Calculator',
      ctaLinkHref: '/math/percentage-difference-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Original Value', 'New Value', 'Calculation', 'Percentage Change'],
      rows: [
        { col1: '50', col2: '65', col3: '(65 – 50) ÷ 50 × 100', col4: '+30%' },
        { col1: '200', col2: '150', col3: '(150 – 200) ÷ 200 × 100', col4: '–25%' },
        { col1: '1,200', col2: '1,470', col3: '(1,470 – 1,200) ÷ 1,200 × 100', col4: '+22.5%' },
        { col1: '80', col2: '160', col3: '(160 – 80) ÷ 80 × 100', col4: '+100%' },
        { col1: '400', col2: '340', col3: '(340 – 400) ÷ 400 × 100', col4: '–15%' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Assuming a 20% increase followed by a 20% decrease returns to the original number (100 → 120 → 96).',
        'Dividing by the new value instead of the starting value.',
        'Using percentage change when neither number is the chronological starting point.',
        'Dropping the negative sign when a value decreases.',
        'Confusing a 100% increase (doubling) with a 200% increase (tripling).',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Percentage Change Calculator',
      ctaDescription:
        'Find exact percentage increases, decreases, and differences immediately.',
      ctaButtonLabel: 'Open Percentage Change Calculator',
      ctaHref: '/math/percentage-change-calculator',
      relatedCalculators: [
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        {
          name: 'Percentage Difference Calculator',
          href: '/math/percentage-difference-calculator',
        },
        { name: 'Discount Calculator', href: '/math/discount-calculator' },
        {
          name: 'Margin & Markup Calculator',
          href: '/finance/margin-and-markup-calculator',
        },
        { name: 'Ratio Calculator', href: '/math/ratio-calculator' },
      ],
      keyTakeaways: [
        'Always divide the difference by the original starting value.',
        'Positive results mean growth; negative results mean reduction.',
        'A 50% drop requires a 100% gain to recover to the starting value.',
        'Use percentage difference when neither number came first.',
      ],
      exploreDescription: 'Explore all our percentage and ratio tools.',
      exploreButtonLabel: 'View All Math Calculators',
      exploreHref: '/math',
      faqs: [
        {
          question:
            'Why does a 50% decrease need a 100% increase to recover?',
          answer:
            'If an item drops 50% from 100 to 50, the new base is 50. To get back to 100, you must add 50—which is 100% of the new base of 50.',
        },
        {
          question: 'Can a percentage decrease be more than 100%?',
          answer:
            'For physical quantities like prices or weight, a decrease cannot exceed 100% because a 100% reduction brings the value to zero.',
        },
        {
          question: 'What does a 100% increase mean?',
          answer:
            'A 100% increase means the value has doubled (for example, increasing from 40 to 80).',
        },
      ],
      references: [
        'Relative change and percentage difference conventions in applied statistics and economics.',
      ],
    },
  },

  // ============================================================================
  // 3. HOW TO SIMPLIFY, ADD, AND MULTIPLY FRACTIONS
  // ============================================================================
  {
    slug: 'how-to-simplify-and-calculate-fractions',
    title: 'How to Simplify, Add, and Multiply Fractions',
    shortTitle: 'Fractions',
    category: 'Math & Percentages',
    breadcrumbCategory: 'Math Guides',
    badgeSymbol: '¾',
    badgeGradient: 'from-[#16856B] to-[#0F6A54]',
    heroIntro:
      'Master numerators, denominators, common denominators, and reducing fractions to their simplest form with step-by-step arithmetic examples.',
    heroCalcScreenValue: '5/6',
    keywords: [
      'fractions',
      'how to add fractions',
      'simplify fractions',
      'multiply fractions',
      'common denominator',
      'numerator denominator',
      'fraction to decimal',
    ],
    tocLabels: {
      s1: 'Parts of a fraction',
      s2: 'Adding fractions formula',
      s3: 'Step-by-step example',
      s4: 'Multiplying & dividing',
      s5: 'Simplifying fractions',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. Understanding the parts of a fraction',
      paragraphs: [
        'A fraction represents a part of a whole. It consists of two numbers separated by a slash or horizontal bar: the numerator on top and the denominator on the bottom.',
        'The denominator tells you how many equal parts the whole is divided into, while the numerator tells you how many of those parts you have. For example, in 3/4, you have 3 out of 4 equal parts.',
      ],
      callout:
        'You can only add or subtract fractions directly when their denominators (bottom numbers) are identical.',
    },
    section2: {
      heading: '2. The formula for adding fractions',
      intro:
        'To add two fractions with different denominators, convert them to a common denominator:',
      formulaPrefix: 'a/b + c/d = ',
      formulaHighlight: '(a × d + b × c)',
      formulaSuffix: ' ÷ (b × d)',
      fullFormulaText: 'a/b + c/d = (a × d + b × c) ÷ (b × d)',
      variables: [
        {
          term: 'a and c',
          definition: 'are the top numerators of the two fractions.',
        },
        {
          term: 'b and d',
          definition: 'are the bottom denominators (neither can be zero).',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: '1/2 + 1/3',
      steps: [
        {
          title: 'Find a common denominator:',
          lines: ['Multiply the denominators: 2 × 3 = 6'],
        },
        {
          title: 'Convert each fraction to sixths:',
          lines: ['1/2 = (1 × 3) / (2 × 3) = 3/6', '1/3 = (1 × 2) / (3 × 2) = 2/6'],
        },
        {
          title: 'Add the numerators and keep the denominator:',
          lines: ['(3 + 2) / 6 = 5/6'],
        },
        {
          title: 'Final answer:',
          lines: ['1/2 + 1/3 = 5/6 (0.8333)'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '1/2 + 1/3 equals:',
      resultBigValue: '5/6',
      resultEquation: '3/6 + 2/6 = 5/6',
    },
    section4: {
      heading: '4. How to multiply and divide fractions',
      intro:
        'Multiplying fractions does not require a common denominator—simply multiply straight across:',
      formula: 'Multiply: (a/b) × (c/d) = (a × c) / (b × d)',
      exampleLead: 'Multiply 2/3 by 3/5:',
      bullets: [
        'Multiply numerators: 2 × 3 = 6',
        'Multiply denominators: 3 × 5 = 15',
        'Reduce 6/15 by dividing top and bottom by 3 = 2/5',
      ],
      closingText:
        'To divide fractions, flip the second fraction (its reciprocal) and multiply. Check your work with the',
      ctaLinkText: 'Fraction Calculator',
      ctaLinkHref: '/math/fraction-calculator',
    },
    section5: {
      heading: '5. How to simplify a fraction to lowest terms',
      intro:
        'A fraction is in simplest form when the numerator and denominator share no common factor other than 1:',
      formula: 'Simplified Fraction = (a ÷ GCD) / (b ÷ GCD)',
      exampleLead: 'Simplify 18/24 to lowest terms:',
      bullets: [
        'Factors of 18: 1, 2, 3, 6, 9, 18',
        'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24 → Greatest Common Divisor (GCD) = 6',
        'Divide top and bottom by 6: (18 ÷ 6) / (24 ÷ 6) = 3/4',
      ],
      closingText:
        'Convert between fractions, decimals, and percentages anytime using the',
      ctaLinkText: 'Percentage to Fraction Calculator',
      ctaLinkHref: '/math/fraction-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Fraction Expression', 'Common Denominator / Step', 'Unsimplified', 'Simplest Form'],
      rows: [
        { col1: '1/2 + 1/3', col2: '3/6 + 2/6', col3: '5/6', col4: '5/6 (0.833)' },
        { col1: '3/4 – 1/8', col2: '6/8 – 1/8', col3: '5/8', col4: '5/8 (0.625)' },
        { col1: '2/3 × 3/4', col2: '(2 × 3) / (3 × 4)', col3: '6/12', col4: '1/2 (0.5)' },
        { col1: '3/5 ÷ 2/5', col2: '3/5 × 5/2', col3: '15/10', col4: '3/2 or 1 ½' },
        { col1: '16/20', col2: 'Divide by GCD (4)', col3: '16/20', col4: '4/5 (0.8)' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Adding denominators together when adding fractions (writing 1/2 + 1/3 = 2/5).',
        'Forgetting to multiply the numerator when scaling a denominator.',
        'Flipping the first fraction instead of the second fraction during division.',
        'Leaving the final answer unreduced when a common factor exists.',
        'Forgetting to convert mixed numbers (like 2 ½) to improper fractions (5/2) before multiplying.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Fraction Calculator',
      ctaDescription:
        'Add, subtract, multiply, divide, and reduce fractions step by step.',
      ctaButtonLabel: 'Open Fraction Calculator',
      ctaHref: '/math/fraction-calculator',
      relatedCalculators: [
        { name: 'Fraction Calculator', href: '/math/fraction-calculator' },
        { name: 'Ratio Calculator', href: '/math/ratio-calculator' },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        {
          name: 'Percentage to Decimal',
          href: '/math/percentage-to-decimal-calculator',
        },
        { name: 'Average Calculator', href: '/math/average-calculator' },
      ],
      keyTakeaways: [
        'Find a common denominator before adding or subtracting fractions.',
        'Multiply numerators together and denominators together when multiplying.',
        'Divide by multiplying by the reciprocal of the second fraction.',
        'Divide top and bottom by their Greatest Common Divisor (GCD) to simplify.',
      ],
      exploreDescription: 'Browse all arithmetic and algebra calculators.',
      exploreButtonLabel: 'View All Math Calculators',
      exploreHref: '/math',
      faqs: [
        {
          question: 'How do I convert a fraction into a percentage?',
          answer:
            'Divide the numerator by the denominator, then multiply the decimal result by 100. For example, 3 ÷ 4 = 0.75, and 0.75 × 100 = 75%.',
        },
        {
          question: 'What is an improper fraction?',
          answer:
            'An improper fraction has a numerator larger than or equal to its denominator, such as 7/4, which equals the mixed number 1 ¾.',
        },
        {
          question: 'Do I need a common denominator to multiply fractions?',
          answer:
            'No. When multiplying fractions, multiply the numerators straight across and the denominators straight across.',
        },
      ],
      references: [
        'Elementary number theory and rational arithmetic curriculum standards.',
      ],
    },
  },

  // ============================================================================
  // 4. HOW TO CALCULATE RATIOS, PROPORTIONS, AND AVERAGES
  // ============================================================================
  {
    slug: 'how-to-calculate-ratios-and-averages',
    title: 'How to Calculate Ratios, Proportions, and Averages',
    shortTitle: 'Ratios & Averages',
    category: 'Math & Percentages',
    breadcrumbCategory: 'Math Guides',
    badgeSymbol: 'x̄',
    badgeGradient: 'from-[#7C3AED] to-[#5B21B6]',
    heroIntro:
      'Understand how to find the arithmetic mean, median, and mode of a dataset, and how to scale ratios and solve missing values in proportions.',
    heroCalcScreenValue: '24.5',
    keywords: [
      'average',
      'mean median mode',
      'how to calculate average',
      'ratio formula',
      'solve proportions',
      'cross multiplication',
    ],
    tocLabels: {
      s1: 'Mean, median & ratios',
      s2: 'Average & ratio formulas',
      s3: 'Step-by-step example',
      s4: 'Median & mode explained',
      s5: 'Scaling ratios (A:B = C:D)',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. What are averages and ratios?',
      paragraphs: [
        'An average (or arithmetic mean) summarizes a group of numbers with a single typical value. It is widely used for test scores, monthly expenses, and performance metrics.',
        'A ratio compares the relative size of two or more quantities, such as a 16:9 screen aspect ratio or mixing 1 part concentrate with 4 parts water.',
      ],
      callout:
        'When a dataset contains extreme outliers (like one billionaire in a small town), the median is often a fairer summary than the mean.',
    },
    section2: {
      heading: '2. The average and proportion formulas',
      intro:
        'To calculate the arithmetic mean of any list of numbers, divide their sum by the count:',
      formulaPrefix: 'Average (Mean) = ',
      formulaHighlight: 'Sum of Values',
      formulaSuffix: ' ÷ Count of Values',
      fullFormulaText: 'Average (Mean) = Sum of Values ÷ Count of Values',
      variables: [
        {
          term: 'Sum of Values',
          definition: 'is the total obtained by adding every number together.',
        },
        {
          term: 'Count of Values',
          definition: 'is how many numbers are in your list.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'the average of 18, 22, 25, and 33',
      steps: [
        {
          title: 'Count the numbers in the dataset:',
          lines: ['There are 4 numbers: 18, 22, 25, 33'],
        },
        {
          title: 'Add all the values together:',
          lines: ['Sum = 18 + 22 + 25 + 33 = 98'],
        },
        {
          title: 'Divide the sum by the count:',
          lines: ['98 ÷ 4 = 24.5'],
        },
        {
          title: 'Final answer:',
          lines: ['Mean average = 24.5'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: 'Average of 18, 22, 25, 33:',
      resultBigValue: '24.5',
      resultEquation: '(18 + 22 + 25 + 33) ÷ 4 = 24.5',
    },
    section4: {
      heading: '4. Finding the median and mode',
      intro:
        'The median is the middle number when sorted from smallest to largest, and the mode is the most frequent number:',
      formula: 'Even Count Median = Average of the Two Middle Numbers',
      exampleLead: 'Sorted dataset: 18, 22, 25, 33',
      bullets: [
        'Middle pair: 22 and 25',
        'Median = (22 + 25) ÷ 2 = 23.5',
        'Range = Largest – Smallest = 33 – 18 = 15',
      ],
      closingText:
        'Compute mean, median, mode, and range simultaneously with the',
      ctaLinkText: 'Average Calculator',
      ctaLinkHref: '/math/average-calculator',
    },
    section5: {
      heading: '5. How to solve a missing value in a ratio',
      intro:
        'Use cross-multiplication to solve for an unknown value x in two equivalent ratios:',
      formula: 'If A : B = C : x, then x = (B × C) ÷ A',
      exampleLead: 'A recipe uses 2 cups of flour for 3 servings. How much for 12 servings?',
      bullets: [
        'Set up proportion: 2 / 3 = x / 12',
        'Cross-multiply: 3 × x = 2 × 12 = 24',
        'Divide by 3: x = 24 ÷ 3 = 8 cups of flour',
      ],
      closingText: 'Scale recipes, maps, and aspect ratios easily with our',
      ctaLinkText: 'Ratio Calculator',
      ctaLinkHref: '/math/ratio-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Dataset / Ratio', 'Operation', 'Calculation', 'Result'],
      rows: [
        { col1: '10, 20, 30', col2: 'Mean', col3: '(10 + 20 + 30) ÷ 3', col4: '20' },
        { col1: '18, 22, 25, 33', col2: 'Mean', col3: '98 ÷ 4', col4: '24.5' },
        { col1: '4, 8, 8, 12, 18', col2: 'Median & Mode', col3: 'Middle = 8, Most frequent = 8', col4: '8' },
        { col1: '16 : 9 = x : 1080', col2: 'Proportion', col3: '(16 × 1080) ÷ 9', col4: '1920' },
        { col1: '24 : 36', col2: 'Simplify Ratio', col3: 'Divide both by 12', col4: '2 : 3' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Finding the median without sorting the numbers from lowest to highest first.',
        'Omitting zero values when counting how many numbers are in a dataset.',
        'Averaging two averages of differently sized groups without weighting them.',
        'Confusing a part-to-part ratio (2:3) with a part-to-whole fraction (2/5).',
        'Multiplying across instead of cross-multiplying when solving proportions.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Average & Ratio Calculators',
      ctaDescription:
        'Calculate mean, median, mode, or solve proportional ratios in one click.',
      ctaButtonLabel: 'Open Average Calculator',
      ctaHref: '/math/average-calculator',
      relatedCalculators: [
        { name: 'Average Calculator', href: '/math/average-calculator' },
        { name: 'Ratio Calculator', href: '/math/ratio-calculator' },
        { name: 'Fraction Calculator', href: '/math/fraction-calculator' },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        { name: 'Scientific Calculator', href: '/math/scientific-calculator' },
      ],
      keyTakeaways: [
        'Mean = Sum of all values divided by the total count.',
        'Always sort values in ascending order before finding the median.',
        'Simplify ratios just like fractions using the Greatest Common Divisor.',
        'Use cross-multiplication (x = B × C ÷ A) to solve missing proportions.',
      ],
      exploreDescription: 'Explore all statistics, ratio, and math calculators.',
      exploreButtonLabel: 'View All Math Calculators',
      exploreHref: '/math',
      faqs: [
        {
          question: 'Does a zero in my list count toward the average?',
          answer:
            'Yes. If zero is a valid recorded value (such as 0 points on a quiz), you must include it in the count when dividing.',
        },
        {
          question: 'Can a dataset have more than one mode?',
          answer:
            'Yes. If two numbers tie for appearing the most times, the dataset is bimodal; if all numbers appear once, there is no mode.',
        },
        {
          question: 'How do I convert a ratio like 2:3 into percentages?',
          answer:
            'Add the parts together (2 + 3 = 5) to find the whole. Then divide each part by 5: 2/5 = 40% and 3/5 = 60%.',
        },
      ],
      references: [
        'Descriptive statistics and proportional reasoning principles in foundational mathematics.',
      ],
    },
  },

  // ============================================================================
  // 5. HOW TO CALCULATE COMPOUND INTEREST AND INVESTMENT GROWTH
  // ============================================================================
  {
    slug: 'how-to-calculate-compound-interest',
    title: 'How to Calculate Compound Interest and Investment Growth',
    shortTitle: 'Compound Interest',
    category: 'Finance & Business',
    breadcrumbCategory: 'Finance Guides',
    badgeSymbol: 'A=P',
    badgeGradient: 'from-[#16856B] to-[#0D6E57]',
    heroIntro:
      'Learn how compound interest grows your savings over time, how compounding frequency affects returns, and how to use the compound interest formula.',
    heroCalcScreenValue: '$16,289',
    keywords: [
      'compound interest',
      'how to calculate compound interest',
      'compound interest formula',
      'investment growth',
      'rule of 72',
      'savings interest calculator',
    ],
    tocLabels: {
      s1: 'What is compound interest?',
      s2: 'Compound interest formula',
      s3: 'Step-by-step example',
      s4: 'Simple vs. compound interest',
      s5: 'The Rule of 72 shortcut',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. What is compound interest?',
      paragraphs: [
        'Compound interest is interest calculated on both your initial principal and the accumulated interest from previous periods. In short, your savings earn “interest on interest.”',
        'Over multi-year horizons, compounding creates an upward curve where each year’s dollar gain is larger than the year before, even if the interest rate stays constant.',
      ],
      callout:
        'The more frequently interest compounds (monthly vs. annually) and the longer your time horizon, the faster your balance grows.',
    },
    section2: {
      heading: '2. The compound interest formula',
      intro:
        'To calculate the future value of a lump-sum investment with compound interest:',
      formulaPrefix: 'A = ',
      formulaHighlight: 'P × (1 + r ÷ n)',
      formulaSuffix: '^(n × t)',
      fullFormulaText: 'A = P × (1 + r ÷ n)^(n × t)',
      variables: [
        {
          term: 'P (Principal)',
          definition: 'is your starting deposit or loan balance.',
        },
        {
          term: 'r (Annual Rate)',
          definition: 'is the annual interest rate written as a decimal (5% = 0.05).',
        },
        {
          term: 'n & t',
          definition:
            'n is the compounding periods per year (12 for monthly, 1 for annual) and t is the time in years.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: '$10,000 at 5% compounded annually for 10 years',
      steps: [
        {
          title: 'Identify the variables:',
          lines: ['P = 10,000, r = 0.05, n = 1, t = 10'],
        },
        {
          title: 'Substitute into the formula:',
          lines: ['A = 10,000 × (1 + 0.05 ÷ 1)^(1 × 10)'],
        },
        {
          title: 'Raise (1.05) to the 10th power and multiply:',
          lines: ['1.05^10 ≈ 1.62889', '10,000 × 1.62889 = $16,288.95'],
        },
        {
          title: 'Final answer:',
          lines: ['Ending balance = $16,288.95 ($6,288.95 interest earned)'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '$10,000 after 10 yrs at 5%:',
      resultBigValue: '$16,289',
      resultEquation: '10,000 × (1.05)^10 = $16,288.95',
    },
    section4: {
      heading: '4. Simple interest vs. compound interest',
      intro:
        'Simple interest only pays returns on the original principal, whereas compound interest reinvests each period’s gain:',
      formula: 'Simple Interest = P × r × t',
      exampleLead: 'Comparing $10,000 at 5% for 10 years:',
      bullets: [
        'Simple interest total = 10,000 + (10,000 × 0.05 × 10) = $15,000',
        'Annual compounding total = $16,288.95',
        'Monthly compounding total (n = 12) = $16,470.09',
      ],
      closingText:
        'Test monthly contributions and different compounding frequencies in the',
      ctaLinkText: 'Compound Interest Calculator',
      ctaLinkHref: '/compound-interest-calculator',
    },
    section5: {
      heading: '5. How to estimate doubling time with the Rule of 72',
      intro:
        'To quickly estimate how many years it takes for an investment to double in value, divide 72 by the annual interest rate:',
      formula: 'Years to Double ≈ 72 ÷ Annual Interest Rate (%)',
      exampleLead: 'At a 6% annual return:',
      bullets: [
        '72 ÷ 6 = 12 years to double your money',
        'At 8% annual return: 72 ÷ 8 = 9 years',
        'At 9% annual return: 72 ÷ 9 = 8 years',
      ],
      closingText:
        'For long-term retirement accounts with employer matching, try our',
      ctaLinkText: '401(k) Retirement Calculator',
      ctaLinkHref: '/finance/401k-calculator',
    },
    section6: {
      heading: '6. Examples ($10,000 Principal at 5% Annual Rate)',
      headers: ['Time Horizon', 'Simple Interest', 'Compounded Annually', 'Compounded Monthly'],
      rows: [
        { col1: '5 Years', col2: '$12,500.00', col3: '$12,762.82', col4: '$12,833.59' },
        { col1: '10 Years', col2: '$15,000.00', col3: '$16,288.95', col4: '$16,470.09' },
        { col1: '15 Years', col2: '$17,500.00', col3: '$20,789.28', col4: '$21,137.04' },
        { col1: '20 Years', col2: '$20,000.00', col3: '$26,532.98', col4: '$27,126.40' },
        { col1: '30 Years', col2: '$25,000.00', col3: '$43,219.42', col4: '$44,677.44' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Plugging the interest rate in as a whole number (5) instead of a decimal (0.05).',
        'Forgetting to divide the annual rate by 12 when compounding monthly.',
        'Ignoring the impact of inflation and account fees on real purchasing power.',
        'Confusing APR (nominal annual rate) with APY (effective annual yield after compounding).',
        'Rounding intermediate decimal powers too aggressively before multiplying by principal.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Compound Interest Calculator',
      ctaDescription:
        'Model lump sums, monthly deposits, and compounding schedules.',
      ctaButtonLabel: 'Open Compound Interest Calculator',
      ctaHref: '/compound-interest-calculator',
      relatedCalculators: [
        {
          name: 'Compound Interest Calculator',
          href: '/compound-interest-calculator',
        },
        { name: '401(k) Calculator', href: '/finance/401k-calculator' },
        { name: 'Loan Payment Calculator', href: '/loan-calculator' },
        { name: 'Mortgage Calculator', href: '/mortgage-calculator' },
        { name: 'Percentage Change Calculator', href: '/math/percentage-change-calculator' },
      ],
      keyTakeaways: [
        'Compound interest earns returns on both principal and prior interest.',
        'Convert the annual rate to a decimal (r = % ÷ 100) before calculating.',
        'Divide 72 by your annual return percentage to estimate doubling years.',
        'Time in the market has a larger impact than small changes in compounding frequency.',
      ],
      exploreDescription: 'Explore all savings, investment, and loan tools.',
      exploreButtonLabel: 'View All Finance Calculators',
      exploreHref: '/finance',
      faqs: [
        {
          question: 'What is the difference between APR and APY?',
          answer:
            'APR is the stated annual rate without compounding, while APY (Annual Percentage Yield) includes the effect of intra-year compounding. Savings accounts usually advertise APY.',
        },
        {
          question: 'Does daily compounding make a huge difference over monthly?',
          answer:
            'The jump from annual to monthly compounding is noticeable, but the difference between monthly and daily compounding on $10,000 at 5% over 10 years is only about $16.',
        },
        {
          question: 'How do monthly contributions fit into the formula?',
          answer:
            'Regular deposits use the future value of an annuity series: FV = PMT × [((1 + r/n)^(nt) – 1) ÷ (r/n)], added to the compounded principal.',
        },
      ],
      references: [
        'Standard time-value-of-money (TVM) and compound interest formulas in personal finance.',
      ],
    },
  },

  // ============================================================================
  // 6. HOW TO CALCULATE MONTHLY LOAN AND MORTGAGE PAYMENTS (EMI)
  // ============================================================================
  {
    slug: 'how-to-calculate-loan-and-mortgage-payments',
    title: 'How to Calculate Monthly Loan and Mortgage Payments',
    shortTitle: 'Loans & Mortgages',
    category: 'Finance & Business',
    breadcrumbCategory: 'Finance Guides',
    badgeSymbol: 'EMI',
    badgeGradient: 'from-[#2457D6] to-[#1E3A8A]',
    heroIntro:
      'Understand how loan amortization works, how to calculate your fixed monthly payment from principal, interest rate, and term, and how extra payments reduce total interest.',
    heroCalcScreenValue: '$477.42',
    keywords: [
      'loan payment formula',
      'mortgage calculator guide',
      'how to calculate emi',
      'monthly loan payment',
      'amortization schedule',
      'principal and interest',
    ],
    tocLabels: {
      s1: 'How loan amortization works',
      s2: 'Monthly payment formula',
      s3: 'Step-by-step example',
      s4: 'Total interest paid',
      s5: 'Impact of extra payments',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. How fixed-rate loan payments work',
      paragraphs: [
        'When you take out a fixed-rate auto loan, personal loan, or mortgage, you repay the debt in equal monthly installments (often called EMIs) over a set term.',
        'Each monthly payment is split into two parts: interest charged on the remaining balance and principal that reduces what you owe. Early in the loan, a larger share goes toward interest; later in the loan, most of the payment goes toward principal.',
      ],
      callout:
        'Always convert the annual interest rate into a monthly rate by dividing by 12 before using the monthly payment formula.',
    },
    section2: {
      heading: '2. The monthly loan payment formula',
      intro:
        'Standard amortizing loans use this formula to determine the exact monthly payment M:',
      formulaPrefix: 'M = P × ',
      formulaHighlight: '[r(1 + r)^n]',
      formulaSuffix: ' ÷ [(1 + r)^n – 1]',
      fullFormulaText: 'M = P × [r(1 + r)^n] ÷ [(1 + r)^n – 1]',
      variables: [
        {
          term: 'P (Principal)',
          definition: 'is the amount borrowed after any down payment.',
        },
        {
          term: 'r (Monthly Rate)',
          definition: 'is the annual interest rate divided by 12 (e.g., 6% ÷ 12 = 0.005).',
        },
        {
          term: 'n (Total Months)',
          definition: 'is the total number of monthly payments (Years × 12).',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'a $25,000 loan at 5.5% APR for 5 years (60 months)',
      steps: [
        {
          title: 'Convert annual rate and years to monthly figures:',
          lines: ['P = $25,000', 'r = 0.055 ÷ 12 = 0.0045833', 'n = 5 × 12 = 60 months'],
        },
        {
          title: 'Compute the compound factor (1 + r)^n:',
          lines: ['(1.0045833)^60 ≈ 1.315704'],
        },
        {
          title: 'Substitute into the payment formula:',
          lines: [
            'M = 25,000 × (0.0045833 × 1.315704) ÷ (1.315704 – 1)',
            'M = 25,000 × 0.006030 ÷ 0.315704 = $477.53',
          ],
        },
        {
          title: 'Final answer:',
          lines: ['Monthly payment = $477.53 per month'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '$25,000 over 60 mos at 5.5%:',
      resultBigValue: '$477.53',
      resultEquation: 'Total repaid: $28,651.80',
    },
    section4: {
      heading: '4. How to calculate total interest over the loan term',
      intro:
        'Once you know the monthly payment M, multiply it by the number of months n and subtract the original principal:',
      formula: 'Total Interest = (Monthly Payment × n) – Principal',
      exampleLead: 'For our $25,000 loan over 60 months at $477.53/month:',
      bullets: [
        'Total amount repaid = $477.53 × 60 = $28,651.80',
        'Original principal borrowed = $25,000.00',
        'Total interest cost = $28,651.80 – $25,000 = $3,651.80',
      ],
      closingText:
        'Generate a full payoff breakdown for any loan amount with the',
      ctaLinkText: 'Loan Payment Calculator',
      ctaLinkHref: '/loan-calculator',
    },
    section5: {
      heading: '5. How shorter terms and extra payments save interest',
      intro:
        'Choosing a shorter term increases your monthly payment slightly but cuts total interest dramatically because the balance compounds for fewer months:',
      formula: 'Interest Saved = Long-Term Total Interest – Short-Term Total Interest',
      exampleLead: 'Comparing a $25,000 loan at 5.5% over 36 vs. 60 months:',
      bullets: [
        '60-month term: $477.53/mo → $3,651.80 total interest',
        '36-month term: $754.90/mo → $2,176.32 total interest',
        'Total interest saved = $1,475.48',
      ],
      closingText:
        'If you are buying a home and want to include property taxes and insurance, use our',
      ctaLinkText: 'Mortgage Calculator',
      ctaLinkHref: '/mortgage-calculator',
    },
    section6: {
      heading: '6. Examples ($25,000 Principal at Different Terms & Rates)',
      headers: ['Annual Rate', 'Loan Term', 'Monthly Payment', 'Total Interest'],
      rows: [
        { col1: '4.5%', col2: '36 Months (3 yrs)', col3: '$743.67', col4: '$1,772.12' },
        { col1: '5.5%', col2: '36 Months (3 yrs)', col3: '$754.90', col4: '$2,176.32' },
        { col1: '5.5%', col2: '60 Months (5 yrs)', col3: '$477.53', col4: '$3,651.80' },
        { col1: '7.0%', col2: '60 Months (5 yrs)', col3: '$495.03', col4: '$4,701.80' },
        { col1: '7.0%', col2: '72 Months (6 yrs)', col3: '$426.23', col4: '$5,688.56' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Using the annual interest rate instead of dividing by 12 for monthly payments.',
        'Using years (5) instead of total months (60) for the exponent n.',
        'Forgetting that home mortgages also include property tax, homeowner’s insurance, and HOA fees.',
        'Focusing only on lowering the monthly payment by stretching the term, which inflates total interest.',
        'Confusing flat add-on interest with true declining-balance amortization.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Loan Payment Calculator',
      ctaDescription:
        'Calculate monthly payments, total interest, and payoff schedules.',
      ctaButtonLabel: 'Open Loan Calculator',
      ctaHref: '/loan-calculator',
      relatedCalculators: [
        { name: 'Loan Payment Calculator', href: '/loan-calculator' },
        { name: 'Mortgage Calculator', href: '/mortgage-calculator' },
        {
          name: 'Compound Interest Calculator',
          href: '/compound-interest-calculator',
        },
        { name: '401(k) Calculator', href: '/finance/401k-calculator' },
        {
          name: 'US Federal Income Tax Calculator',
          href: '/finance/us-federal-income-tax-calculator',
        },
      ],
      keyTakeaways: [
        'Divide the annual rate by 12 to get the monthly interest rate r.',
        'Multiply the loan term in years by 12 to get total payments n.',
        'Early payments go mostly toward interest; later payments reduce principal faster.',
        'Extra principal payments directly shorten the loan and reduce interest.',
      ],
      exploreDescription: 'Explore all loan, mortgage, and tax calculators.',
      exploreButtonLabel: 'View All Finance Calculators',
      exploreHref: '/finance',
      faqs: [
        {
          question: 'Why does so much of my first mortgage payment go to interest?',
          answer:
            'Interest each month is calculated as Remaining Balance × Monthly Rate. In month 1, your balance is at its highest, so the interest charge is also at its highest.',
        },
        {
          question: 'How do I calculate a 0% APR loan payment?',
          answer:
            'When the interest rate is 0%, simply divide the principal by the number of months: M = P ÷ n.',
        },
        {
          question: 'Does paying bi-weekly help pay off a mortgage faster?',
          answer:
            'Yes. Making 26 half-payments per year equals 13 full monthly payments instead of 12, shaving several years off a 30-year mortgage.',
        },
      ],
      references: [
        'Consumer lending truth-in-lending amortization formulas and standard actuarial practices.',
      ],
    },
  },

  // ============================================================================
  // 7. HOW TO CALCULATE RETAIL DISCOUNTS, PROFIT MARGIN, AND MARKUP
  // ============================================================================
  {
    slug: 'how-to-calculate-discounts-and-profit-margin',
    title: 'How to Calculate Retail Discounts, Profit Margin, and Markup',
    shortTitle: 'Discounts & Margin',
    category: 'Finance & Business',
    breadcrumbCategory: 'Business Guides',
    badgeSymbol: '$%',
    badgeGradient: 'from-[#D97706] to-[#B45309]',
    heroIntro:
      'Learn the fastest way to calculate sale prices and stacked discounts when shopping, plus the crucial difference between gross profit margin and markup in business.',
    heroCalcScreenValue: '$64.00',
    keywords: [
      'discount calculator guide',
      'how to calculate discount',
      'sale price formula',
      'profit margin vs markup',
      'gross margin formula',
      'percent off',
    ],
    tocLabels: {
      s1: 'Discounts, margin & markup',
      s2: 'Sale price & margin formulas',
      s3: 'Step-by-step example',
      s4: 'Stacked / double discounts',
      s5: 'Profit margin vs. markup',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. Understanding discounts, margin, and markup',
      paragraphs: [
        'A retail discount is a percentage reduction taken off the original list price of a product. You can find the final sale price either by subtracting the discount amount or by multiplying by the remaining percentage.',
        'For business owners, profit margin and markup both compare profit to price and cost—but margin divides profit by selling price, while markup divides profit by unit cost.',
      ],
      callout:
        'Shortcut: Taking 20% off a price is the exact same as paying 80% of the price (Original Price × 0.80).',
    },
    section2: {
      heading: '2. The discount and sale price formula',
      intro:
        'To find the dollar savings and final sale price of a discounted item:',
      formulaPrefix: 'Sale Price = ',
      formulaHighlight: 'Original Price',
      formulaSuffix: ' × (1 – Discount % ÷ 100)',
      fullFormulaText: 'Sale Price = Original Price × (1 – Discount % ÷ 100)',
      variables: [
        {
          term: 'Original Price',
          definition: 'is the full retail price before markdowns.',
        },
        {
          term: 'Discount %',
          definition: 'is the percentage off (e.g., 20 for 20% off).',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: '20% off an $80.00 jacket',
      steps: [
        {
          title: 'Identify original price and discount rate:',
          lines: ['Original Price = $80.00', 'Discount = 20%'],
        },
        {
          title: 'Calculate the dollar savings:',
          lines: ['Savings = $80.00 × (20 ÷ 100) = $16.00'],
        },
        {
          title: 'Subtract savings from original price:',
          lines: ['Sale Price = $80.00 – $16.00 = $64.00'],
        },
        {
          title: 'Final answer:',
          lines: ['You pay $64.00 and save $16.00'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '20% off $80.00:',
      resultBigValue: '$64.00',
      resultEquation: '$80.00 − $16.00 = $64.00',
    },
    section4: {
      heading: '4. How stacked (“extra % off”) discounts work',
      intro:
        'When a store offers “30% off plus an extra 10% off at checkout,” you apply the second discount to the already-reduced price, not by adding 30% + 10%:',
      formula: 'Final Price = Price × (1 – d₁) × (1 – d₂)',
      exampleLead: 'A $100 item with 30% off + an extra 10% coupon:',
      bullets: [
        'After first 30% off: $100 × 0.70 = $70.00',
        'After extra 10% off $70: $70 × 0.90 = $63.00',
        'Combined effective discount = 37% off (not 40% off)',
      ],
      closingText: 'Check single or stacked store markdowns instantly with the',
      ctaLinkText: 'Discount Calculator',
      ctaLinkHref: '/math/discount-calculator',
    },
    section5: {
      heading: '5. Profit margin vs. markup explained',
      intro:
        'Gross profit is Selling Price minus Cost. Margin expresses profit as a share of revenue; markup expresses profit as a percentage added onto cost:',
      formula: 'Margin % = (Price – Cost) ÷ Price × 100 | Markup % = (Price – Cost) ÷ Cost × 100',
      exampleLead: 'An item costs $60 to make and sells for $100 (Profit = $40):',
      bullets: [
        'Profit Margin = $40 ÷ $100 × 100 = 40% margin',
        'Markup Percentage = $40 ÷ $60 × 100 = 66.67% markup',
        'A 50% markup on cost produces a 33.3% gross profit margin',
      ],
      closingText: 'Price your products accurately with our',
      ctaLinkText: 'Margin & Markup Calculator',
      ctaLinkHref: '/finance/margin-and-markup-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Scenario', 'Input Values', 'Calculation', 'Final Result'],
      rows: [
        { col1: '15% Discount', col2: '$120.00 list price', col3: '$120 × 0.85', col4: '$102.00 (Save $18)' },
        { col1: '25% Discount', col2: '$60.00 list price', col3: '$60 × 0.75', col4: '$45.00 (Save $15)' },
        { col1: 'Stacked 20% + 10%', col2: '$100.00 list price', col3: '$100 × 0.80 × 0.90', col4: '$72.00 (Save 28%)' },
        { col1: 'Gross Profit Margin', col2: 'Cost $60, Price $100', col3: '($100 – $60) ÷ $100 × 100', col4: '40.0% Margin' },
        { col1: 'Retail Markup', col2: 'Cost $60, Price $100', col3: '($100 – $60) ÷ $60 × 100', col4: '66.7% Markup' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Adding two stacked discounts together (thinking 50% off + an extra 20% off equals 70% off instead of 60% off).',
        'Confusing markup on cost with gross profit margin on selling price.',
        'Multiplying cost by 1.30 when aiming for a 30% gross margin (instead of dividing cost by 0.70).',
        'Calculating sales tax on the pre-discount price instead of the final discounted sale price.',
        'Forgetting to include shipping or packaging in unit cost when calculating business margin.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Discount & Margin Calculators',
      ctaDescription:
        'Calculate sale prices, savings, profit margin, and markup in seconds.',
      ctaButtonLabel: 'Open Discount Calculator',
      ctaHref: '/math/discount-calculator',
      relatedCalculators: [
        { name: 'Discount Calculator', href: '/math/discount-calculator' },
        {
          name: 'Margin & Markup Calculator',
          href: '/finance/margin-and-markup-calculator',
        },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        {
          name: 'Percentage Change Calculator',
          href: '/math/percentage-change-calculator',
        },
        { name: 'Loan Payment Calculator', href: '/loan-calculator' },
      ],
      keyTakeaways: [
        'Sale Price = Original Price × (1 – Discount % ÷ 100).',
        'Stacked discounts apply sequentially, never by simple addition.',
        'Gross Margin divides profit by Selling Price; Markup divides profit by Cost.',
        'To achieve a target margin M, set Price = Cost ÷ (1 – M).',
      ],
      exploreDescription: 'Explore all business, pricing, and finance calculators.',
      exploreButtonLabel: 'View Business Calculators',
      exploreHref: '/finance/business',
      faqs: [
        {
          question: 'Does it matter if sales tax is applied before or after a discount?',
          answer:
            'Mathematically, multiplying by 0.80 (20% off) and then by 1.08 (8% tax) gives the exact same result as multiplying by 1.08 first—because multiplication is commutative.',
        },
        {
          question: 'How do I price an item to get a 40% profit margin?',
          answer:
            'Divide your unit cost by (1 – 0.40), which is 0.60. For example, if an item costs $30, divide $30 ÷ 0.60 = $50 selling price.',
        },
        {
          question: 'Can profit margin ever exceed 100%?',
          answer:
            'No. Because gross profit cannot exceed total selling price (assuming non-negative cost), profit margin is always under 100%, whereas markup can be 100%, 200%, or higher.',
        },
      ],
      references: [
        'Retail merchandising math and Managerial Accounting gross margin standards.',
      ],
    },
  },

  // ============================================================================
  // 8. HOW TO MEASURE ROOM AREA, FLOORING, AND PAINT COVERAGE
  // ============================================================================
  {
    slug: 'how-to-measure-room-area-and-flooring',
    title: 'How to Measure Room Area, Flooring, and Paint Coverage',
    shortTitle: 'Room Area & Flooring',
    category: 'Home & Everyday',
    breadcrumbCategory: 'Home & Construction Guides',
    badgeSymbol: 'm²',
    badgeGradient: 'from-[#16856B] to-[#115E59]',
    heroIntro:
      'Learn how to measure room length and width in metres or feet, add the right 5%–15% waste allowance for flooring or tile, and estimate total boxes and material cost.',
    heroCalcScreenValue: '22.0 m²',
    keywords: [
      'flooring calculator guide',
      'how to measure room area',
      'square footage formula',
      'square metres',
      'waste allowance flooring',
      'paint coverage',
    ],
    tocLabels: {
      s1: 'How room area is measured',
      s2: 'Area & waste formulas',
      s3: 'Step-by-step example',
      s4: 'Box & pack rounding',
      s5: 'L-shaped rooms & walls',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. How to measure a room for flooring or renovation',
      paragraphs: [
        'Area measures the two-dimensional surface of a floor, wall, or ceiling in square units—most commonly square metres (m²) or square feet (sq ft). For any rectangular space, multiplying the length by the width gives the base net area.',
        'When ordering physical materials like laminate planks, hardwood, or ceramic tile, you must also add a cutting and waste allowance (typically 5% to 15%) to account for board trims, corners, and damaged pieces.',
      ],
      callout:
        'Make sure both length and width are in the same unit (for example, both in metres or both in feet) before multiplying.',
    },
    section2: {
      heading: '2. The room area and waste allowance formula',
      intro:
        'Calculate the base room area first, then multiply by your waste factor to find total material required:',
      formulaPrefix: 'Total Material = ',
      formulaHighlight: '(Length × Width)',
      formulaSuffix: ' × (1 + Waste % ÷ 100)',
      fullFormulaText:
        'Total Material = (Length × Width) × (1 + Waste % ÷ 100)',
      variables: [
        {
          term: 'Length × Width',
          definition: 'gives the net floor area in square metres (m²) or square feet (sq ft).',
        },
        {
          term: 'Waste %',
          definition:
            'is the extra buffer: 5%–8% for straight rooms, 10% for standard planks/tiles, and 15% for diagonal or herringbone patterns.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'a 5 m × 4 m room with a 10% waste allowance',
      steps: [
        {
          title: 'Calculate net floor area:',
          lines: ['Area = 5 m × 4 m = 20 m²'],
        },
        {
          title: 'Calculate the 10% waste buffer:',
          lines: ['Waste Area = 20 m² × (10 ÷ 100) = 2.0 m²'],
        },
        {
          title: 'Add net area and waste allowance:',
          lines: ['Total Material Needed = 20 m² + 2.0 m² = 22.0 m²'],
        },
        {
          title: 'Final answer:',
          lines: ['Order 22.0 m² of flooring material'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '5 m × 4 m room (+10% waste):',
      resultBigValue: '22.0 m²',
      resultEquation: '20 m² × 1.10 = 22.0 m²',
    },
    section4: {
      heading: '4. Converting total area into boxes and material cost',
      intro:
        'Flooring is usually sold in full boxes covering a set area (such as 2.2 m² per box). Always round up to the next whole box:',
      formula: 'Boxes Needed = Ceiling(Total Material Area ÷ Coverage per Box)',
      exampleLead: 'Ordering 22.0 m² when each box covers 2.1 m² at ₹1,500 per m²:',
      bullets: [
        'Exact boxes = 22.0 ÷ 2.1 = 10.48 boxes → Round up to 11 full boxes',
        'Total area in 11 boxes = 11 × 2.1 = 23.1 m²',
        'Estimated material cost (22 m² × ₹1,500) = ₹33,000',
      ],
      closingText:
        'Run your own room dimensions, units, and box sizes through our 3-step',
      ctaLinkText: 'Flooring Project Calculator',
      ctaLinkHref: '/home-construction/flooring-calculator',
    },
    section5: {
      heading: '5. Measuring L-shaped rooms and converting sq ft to m²',
      intro:
        'For L-shaped rooms, split the floor plan into two separate rectangles (Section A and Section B), find the area of each, and add them together:',
      formula: '1 m² = 10.7639 sq ft | 1 sq ft = 0.0929 m²',
      exampleLead: 'Converting a 20 m² room into square feet:',
      bullets: [
        '20 m² × 10.7639 = 215.28 sq ft',
        'With 10% waste: 215.28 × 1.10 = 236.8 sq ft',
        'To convert centimetres to metres first, divide cm by 100 (e.g., 450 cm = 4.5 m)',
      ],
      closingText:
        'Convert between metres, feet, inches, and square units using the',
      ctaLinkText: 'Unit Conversion Calculator',
      ctaLinkHref: '/unit-converter',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Room Size', 'Net Area', 'Waste Buffer (10%)', 'Total to Order'],
      rows: [
        { col1: '3.5 m × 3.0 m (Bedroom)', col2: '10.50 m²', col3: '+1.05 m²', col4: '11.55 m²' },
        { col1: '5.0 m × 4.0 m (Living Room)', col2: '20.00 m²', col3: '+2.00 m²', col4: '22.00 m²' },
        { col1: '6.0 m × 4.5 m (Open Lounge)', col2: '27.00 m²', col3: '+2.70 m²', col4: '29.70 m²' },
        { col1: '12 ft × 15 ft (US Bedroom)', col2: '180.0 sq ft', col3: '+18.0 sq ft', col4: '198.0 sq ft' },
        { col1: '20 ft × 16 ft (Family Room)', col2: '320.0 sq ft', col3: '+32.0 sq ft', col4: '352.0 sq ft' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Ordering the exact net floor area with 0% waste, leaving you short after end-of-row cuts.',
        'Rounding box counts down instead of rounding up to the next full pack.',
        'Mixing feet and inches as a simple decimal (e.g., writing 10 ft 6 in as 10.6 ft instead of 10.5 ft).',
        'Forgetting to measure inside closets, doorways, and alcoves.',
        'Ignoring extra underlayment, adhesive, or transition strips in the project budget.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Flooring Project Calculator',
      ctaDescription:
        'Measure room area, add waste allowance, and estimate costs in 3 guided steps.',
      ctaButtonLabel: 'Open Flooring Calculator',
      ctaHref: '/home-construction/flooring-calculator',
      relatedCalculators: [
        {
          name: 'Flooring Project Calculator',
          href: '/home-construction/flooring-calculator',
        },
        { name: 'Unit Conversion Calculator', href: '/unit-converter' },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        { name: 'Discount Calculator', href: '/math/discount-calculator' },
        { name: 'Ratio Calculator', href: '/math/ratio-calculator' },
      ],
      keyTakeaways: [
        'Net Area = Length × Width (in matching units).',
        'Add 10% waste for standard installations and 15% for diagonal layouts.',
        'Always round up box counts to the next whole pack.',
        '1 square metre equals 10.764 square feet.',
      ],
      exploreDescription: 'Explore our home renovation and measurement tools.',
      exploreButtonLabel: 'View Home & Construction',
      exploreHref: '/home-construction',
      faqs: [
        {
          question: 'How do I convert inches to decimal feet?',
          answer:
            'Divide the number of inches by 12. For example, 6 inches ÷ 12 = 0.5 feet, and 9 inches ÷ 12 = 0.75 feet.',
        },
        {
          question: 'How much waste allowance should I use for large-format tiles?',
          answer:
            'Large-format tiles (such as 60×60 cm) and diagonal patterns generate larger off-cuts, so a 12% to 15% waste allowance is recommended.',
        },
        {
          question: 'How do I calculate wall area for painting?',
          answer:
            'Add the lengths of all four walls together to get the room perimeter, multiply by ceiling height, and subtract the area of doors and windows.',
        },
      ],
      references: [
        'Residential flooring installation standards and metric-imperial area conversion factors.',
      ],
    },
  },

  // ============================================================================
  // 9. HOW TO CONVERT METRIC AND IMPERIAL UNITS ACCURATELY
  // ============================================================================
  {
    slug: 'how-to-convert-metric-and-imperial-units',
    title: 'How to Convert Metric and Imperial Units Accurately',
    shortTitle: 'Unit Conversions',
    category: 'Home & Everyday',
    breadcrumbCategory: 'Unit Conversion Guides',
    badgeSymbol: '⇄',
    badgeGradient: 'from-[#2457D6] to-[#0284C7]',
    heroIntro:
      'Learn the exact conversion factors for length, weight, volume, and temperature—plus how dimensional analysis prevents multiplying when you should divide.',
    heroCalcScreenValue: '2.54 cm',
    keywords: [
      'unit conversion guide',
      'metric to imperial',
      'celsius to fahrenheit formula',
      'kg to lbs',
      'inches to cm',
      'miles to km',
    ],
    tocLabels: {
      s1: 'How unit conversion works',
      s2: 'Conversion factor formula',
      s3: 'Step-by-step example',
      s4: 'Temperature (°C to °F)',
      s5: 'Metric prefixes (kilo, milli)',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. How unit conversion works',
      paragraphs: [
        'Converting units changes the scale used to express a measurement without changing the physical quantity itself. For example, 1 inch and 2.54 centimetres describe the exact same length.',
        'The golden rule of unit conversion (dimensional analysis) is to multiply by a conversion ratio set up so the old unit cancels out, leaving only the target unit.',
      ],
      callout:
        'By international agreement since 1959, 1 inch is defined as exactly 2.54 centimetres, and 1 pound is defined as 0.45359237 kilograms.',
    },
    section2: {
      heading: '2. The unit conversion factor formula',
      intro:
        'For any linear measurement (length, mass, volume, or area), multiply the starting value by the ratio of target units per starting unit:',
      formulaPrefix: 'Target Value = ',
      formulaHighlight: 'Starting Value',
      formulaSuffix: ' × Conversion Factor',
      fullFormulaText: 'Target Value = Starting Value × Conversion Factor',
      variables: [
        {
          term: 'Starting Value',
          definition: 'is the measurement in your original unit.',
        },
        {
          term: 'Conversion Factor',
          definition:
            'is how many target units equal 1 original unit (e.g., 2.20462 lbs per 1 kg).',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'converting 70 kilograms (kg) to pounds (lbs)',
      steps: [
        {
          title: 'Find the conversion factor between kg and lbs:',
          lines: ['1 kilogram (kg) = 2.20462 pounds (lbs)'],
        },
        {
          title: 'Set up the multiplication so kg cancels out:',
          lines: ['Weight in lbs = 70 kg × 2.20462 lbs/kg'],
        },
        {
          title: 'Multiply and round to a sensible precision:',
          lines: ['70 × 2.20462 = 154.3234 lbs'],
        },
        {
          title: 'Final answer:',
          lines: ['70 kg = 154.32 lbs'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '70 kilograms in pounds:',
      resultBigValue: '154.32 lb',
      resultEquation: '70 × 2.20462 = 154.32 lbs',
    },
    section4: {
      heading: '4. How to convert Celsius (°C) and Fahrenheit (°F)',
      intro:
        'Temperature scales have different zero points (water freezes at 0°C but 32°F), so converting between them requires both multiplication and an offset:',
      formula: '°F = (°C × 1.8) + 32   |   °C = (°F – 32) ÷ 1.8',
      exampleLead: 'Convert 25°C (room temperature) to Fahrenheit:',
      bullets: [
        'Multiply by 1.8 (or 9/5): 25 × 1.8 = 45',
        'Add 32: 45 + 32 = 77°F',
        'Reverse check: (77 – 32) ÷ 1.8 = 45 ÷ 1.8 = 25°C',
      ],
      closingText:
        'Convert length, weight, temperature, and volume instantly with the',
      ctaLinkText: 'Unit Conversion Calculator',
      ctaLinkHref: '/unit-converter',
    },
    section5: {
      heading: '5. Moving decimal points across metric prefixes',
      intro:
        'The metric system is base-10, meaning you can convert between millimetres, metres, and kilometres simply by shifting the decimal point:',
      formula: '1 km = 1,000 m   |   1 m = 100 cm = 1,000 mm',
      exampleLead: 'Converting 3,450 millimetres into metres:',
      bullets: [
        'There are 1,000 mm in 1 m',
        'Divide 3,450 by 1,000 (move decimal 3 places left)',
        '3,450 mm = 3.45 m (or 345 cm)',
      ],
      closingText:
        'Need to convert room dimensions for a renovation project? Try the',
      ctaLinkText: 'Flooring Project Calculator',
      ctaLinkHref: '/home-construction/flooring-calculator',
    },
    section6: {
      heading: '6. Common Conversion Factors Reference Table',
      headers: ['From Unit', 'To Unit', 'Exact / Standard Factor', 'Quick Example'],
      rows: [
        { col1: 'Inches (in)', col2: 'Centimetres (cm)', col3: 'Multiply by 2.54', col4: '10 in = 25.4 cm' },
        { col1: 'Feet (ft)', col2: 'Metres (m)', col3: 'Multiply by 0.3048', col4: '10 ft = 3.048 m' },
        { col1: 'Miles (mi)', col2: 'Kilometres (km)', col3: 'Multiply by 1.60934', col4: '5 mi = 8.05 km' },
        { col1: 'Kilograms (kg)', col2: 'Pounds (lbs)', col3: 'Multiply by 2.20462', col4: '70 kg = 154.32 lbs' },
        { col1: 'Gallons (US)', col2: 'Litres (L)', col3: 'Multiply by 3.78541', col4: '10 gal = 37.85 L' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Multiplying when you should divide (check whether the target unit is smaller or larger than the starting unit).',
        'Forgetting to square the conversion factor when converting area (1 m = 3.2808 ft, so 1 m² = 3.2808² = 10.764 sq ft).',
        'Confusing US fluid ounces/gallons with UK Imperial fluid ounces/gallons.',
        'Subtracting 32 after dividing by 1.8 when converting Fahrenheit to Celsius (always subtract 32 first).',
        'Writing 12 inches per foot as base-10 decimals.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Unit Conversion Calculator',
      ctaDescription:
        'Convert length, weight, temperature, volume, and area accurately.',
      ctaButtonLabel: 'Open Unit Converter',
      ctaHref: '/unit-converter',
      relatedCalculators: [
        { name: 'Unit Conversion Calculator', href: '/unit-converter' },
        {
          name: 'Flooring Project Calculator',
          href: '/home-construction/flooring-calculator',
        },
        { name: 'BMI Calculator', href: '/bmi-calculator' },
        { name: 'Scientific Calculator', href: '/math/scientific-calculator' },
        { name: 'Ratio Calculator', href: '/math/ratio-calculator' },
      ],
      keyTakeaways: [
        '1 inch = 2.54 cm and 1 kg = 2.20462 lbs.',
        'For Celsius to Fahrenheit, multiply by 1.8 and add 32.',
        'When converting to a smaller unit (e.g., m to cm), the number gets larger.',
        'Square the linear factor for area (²); cube it for volume (³).',
      ],
      exploreDescription: 'Browse all unit and measurement conversion tools.',
      exploreButtonLabel: 'View Unit Converters',
      exploreHref: '/unit-conversion',
      faqs: [
        {
          question: 'Why does 1 square metre equal 10.76 square feet instead of 3.28?',
          answer:
            'Because area has two dimensions (length × width). Since 1 metre is 3.28084 feet, 1 square metre is 3.28084 ft × 3.28084 ft = 10.7639 sq ft.',
        },
        {
          question: 'What temperature is the same in Celsius and Fahrenheit?',
          answer:
            '–40 degrees is the unique point where both scales meet: (–40 × 1.8) + 32 = –40.',
        },
        {
          question: 'What is a quick mental shortcut for miles to kilometres?',
          answer:
            'Multiply miles by 1.6 (or multiply by 8 and divide by 5). For example, 50 miles × 8 ÷ 5 = 80 km.',
        },
      ],
      references: [
        'NIST (National Institute of Standards and Technology) SI and customary unit tables.',
      ],
    },
  },

  // ============================================================================
  // 10. HOW TO CALCULATE BMI AND DAILY CALORIE NEEDS (TDEE)
  // ============================================================================
  {
    slug: 'how-to-calculate-bmi-and-daily-calories',
    title: 'How to Calculate BMI and Daily Calorie Needs (TDEE)',
    shortTitle: 'BMI & Calories',
    category: 'Home & Everyday',
    breadcrumbCategory: 'Health & Fitness Guides',
    badgeSymbol: 'BMI',
    badgeGradient: 'from-[#16856B] to-[#059669]',
    heroIntro:
      'Learn how to calculate Body Mass Index (BMI) in metric and imperial units, how adult BMI categories are defined, and how Basal Metabolic Rate (BMR) estimates daily calorie needs.',
    heroCalcScreenValue: '22.9',
    keywords: [
      'bmi formula',
      'how to calculate bmi',
      'body mass index',
      'calorie calculator guide',
      'bmr tdee formula',
      'healthy weight range',
    ],
    tocLabels: {
      s1: 'What is BMI?',
      s2: 'Metric & imperial formulas',
      s3: 'Step-by-step example',
      s4: 'Standard BMI categories',
      s5: 'Estimating daily calories',
      s6: 'Example table',
      s7: 'Limitations & mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. What is Body Mass Index (BMI)?',
      paragraphs: [
        'Body Mass Index (BMI) is a simple screening ratio that relates an adult’s weight to the square of their height. It provides a quick reference range to help assess whether body weight is low, typical, or elevated for a given height.',
        'Because BMI only uses total weight and height, it is a general screening indicator rather than a direct measurement of body fat percentage or muscle mass.',
      ],
      callout:
        'When using the metric BMI formula, height must be in metres (m), not centimetres (e.g., 175 cm = 1.75 m).',
    },
    section2: {
      heading: '2. The BMI formula (metric and imperial)',
      intro:
        'Divide weight in kilograms by height in metres squared (or multiply by 703 when using pounds and inches):',
      formulaPrefix: 'BMI = ',
      formulaHighlight: 'Weight (kg)',
      formulaSuffix: ' ÷ [Height (m)]²',
      fullFormulaText:
        'BMI = Weight (kg) ÷ [Height (m)]²   |   Imperial: 703 × lbs ÷ in²',
      variables: [
        {
          term: 'Weight (kg)',
          definition: 'is body mass in kilograms (or pounds in the 703 imperial formula).',
        },
        {
          term: 'Height (m)²',
          definition:
            'is height in metres multiplied by itself (for 1.75 m, 1.75 × 1.75 = 3.0625 m²).',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'an adult weighing 70 kg at a height of 175 cm (1.75 m)',
      steps: [
        {
          title: 'Convert height from cm to metres:',
          lines: ['175 cm ÷ 100 = 1.75 m'],
        },
        {
          title: 'Square the height in metres:',
          lines: ['1.75 m × 1.75 m = 3.0625 m²'],
        },
        {
          title: 'Divide weight by squared height:',
          lines: ['70 ÷ 3.0625 = 22.857'],
        },
        {
          title: 'Final answer:',
          lines: ['BMI = 22.9 kg/m² (Normal healthy weight range)'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '70 kg at 175 cm height:',
      resultBigValue: '22.9',
      resultEquation: '70 ÷ (1.75 × 1.75) = 22.9',
    },
    section4: {
      heading: '4. World Health Organization (WHO) adult BMI categories',
      intro:
        'For adults aged 20 and older, standard international screening thresholds are:',
      formula: 'Healthy Weight Range = 18.5 to 24.9 kg/m²',
      exampleLead: 'How to find your healthy weight range for 1.75 m height:',
      bullets: [
        'Lower bound (18.5 BMI): 18.5 × 3.0625 = 56.7 kg (125 lbs)',
        'Upper bound (24.9 BMI): 24.9 × 3.0625 = 76.3 kg (168 lbs)',
        'Categories: Underweight (<18.5), Normal (18.5–24.9), Overweight (25.0–29.9), Obesity (≥30.0)',
      ],
      closingText:
        'Check your BMI in metric or imperial units anytime with our',
      ctaLinkText: 'BMI Calculator',
      ctaLinkHref: '/bmi-calculator',
    },
    section5: {
      heading: '5. How daily calorie needs (BMR & TDEE) are calculated',
      intro:
        'Basal Metabolic Rate (BMR) estimates the calories your body burns at rest using the Mifflin-St Jeor equation, which is then multiplied by an activity factor:',
      formula: 'Men: (10×kg) + (6.25×cm) – (5×age) + 5 | Women: (10×kg) + (6.25×cm) – (5×age) – 161',
      exampleLead: '30-year-old male, 70 kg, 175 cm with moderate exercise (×1.55):',
      bullets: [
        'Resting BMR = (10 × 70) + (6.25 × 175) – (5 × 30) + 5 = 1,649 kcal/day',
        'Total Daily Energy Expenditure (TDEE) = 1,649 × 1.55 = 2,556 kcal/day',
        'A 500 kcal/day deficit corresponds to roughly 0.45 kg (1 lb) per week',
      ],
      closingText:
        'Explore all health and wellness calculators in our',
      ctaLinkText: 'Health & Fitness Hub',
      ctaLinkHref: '/health-fitness',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Height', 'Weight', 'Calculation', 'BMI & Category'],
      rows: [
        { col1: '1.65 m (5\'5")', col2: '58 kg (128 lb)', col3: '58 ÷ (1.65)²', col4: '21.3 (Normal)' },
        { col1: '1.70 m (5\'7")', col2: '68 kg (150 lb)', col3: '68 ÷ (1.70)²', col4: '23.5 (Normal)' },
        { col1: '1.75 m (5\'9")', col2: '70 kg (154 lb)', col3: '70 ÷ (1.75)²', col4: '22.9 (Normal)' },
        { col1: '1.80 m (5\'11")', col2: '88 kg (194 lb)', col3: '88 ÷ (1.80)²', col4: '27.2 (Overweight)' },
        { col1: '70 in (5\'10")', col2: '165 lbs', col3: '703 × 165 ÷ 70²', col4: '23.7 (Normal)' },
      ],
    },
    section7: {
      heading: '7. Common mistakes & limitations',
      mistakes: [
        'Dividing weight by height in centimetres without converting to metres first.',
        'Dividing by height once instead of height squared (Height × Height).',
        'Forgetting the 703 conversion multiplier when using pounds and inches.',
        'Applying adult BMI cutoffs to children or teens (who require age- and sex-specific percentiles).',
        'Treating BMI as a standalone medical diagnosis for strength athletes with high muscle mass.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the BMI Calculator',
      ctaDescription:
        'Calculate your Body Mass Index and healthy weight range in kg/cm or lbs/ft.',
      ctaButtonLabel: 'Open BMI Calculator',
      ctaHref: '/bmi-calculator',
      relatedCalculators: [
        { name: 'BMI Calculator', href: '/bmi-calculator' },
        { name: 'Age Calculator', href: '/age-calculator' },
        { name: 'Unit Conversion Calculator', href: '/unit-converter' },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        { name: 'Average Calculator', href: '/math/average-calculator' },
      ],
      keyTakeaways: [
        'Metric BMI = Weight (kg) ÷ Height (m)².',
        'Imperial BMI = 703 × Weight (lbs) ÷ Height (in)².',
        'A standard healthy adult BMI range is 18.5 to 24.9.',
        'BMI is a general screening tool and does not distinguish muscle from fat.',
      ],
      exploreDescription: 'Check out our wellness and body metric calculators.',
      exploreButtonLabel: 'View Health Calculators',
      exploreHref: '/health-fitness',
      faqs: [
        {
          question: 'Why does the imperial BMI formula multiply by 703?',
          answer:
            '703 is the unit conversion factor between kg/m² and lb/in² (1 lb = 0.453592 kg and 1 in² = 0.00064516 m², so 0.453592 ÷ 0.00064516 ≈ 703.07).',
        },
        {
          question: 'Is BMI accurate for muscular athletes?',
          answer:
            'Because muscle is dense, strength athletes often have a BMI above 25 even with low body fat. Waist-to-height ratio or body composition scans provide extra context.',
        },
        {
          question: 'What is the difference between BMR and TDEE?',
          answer:
            'BMR is the energy your body uses at complete rest; TDEE multiplies BMR by your daily movement and exercise level.',
        },
      ],
      references: [
        'World Health Organization (WHO) BMI classification and Mifflin-St Jeor metabolic equations.',
      ],
    },
  },

  // ============================================================================
  // 11. HOW TO CALCULATE EXACT AGE AND DAYS BETWEEN TWO DATES
  // ============================================================================
  {
    slug: 'how-to-calculate-exact-age-and-date-difference',
    title: 'How to Calculate Exact Age and Days Between Two Dates',
    shortTitle: 'Age & Date Math',
    category: 'Home & Everyday',
    breadcrumbCategory: 'Date & Time Guides',
    badgeSymbol: '365',
    badgeGradient: 'from-[#E54D37] to-[#C2410C]',
    heroIntro:
      'Learn how chronological age in years, months, and days is calculated across uneven month lengths and leap years, plus when to include the end date in day counts.',
    heroCalcScreenValue: '28y 4m',
    keywords: [
      'age calculator guide',
      'how to calculate exact age',
      'days between dates',
      'leap year rule',
      'date difference formula',
      'chronological age',
    ],
    tocLabels: {
      s1: 'How calendar math works',
      s2: 'Year-month-day borrowing',
      s3: 'Step-by-step example',
      s4: 'Counting days between dates',
      s5: 'Leap year rules explained',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. Why calendar and age calculations are tricky',
      paragraphs: [
        'Unlike standard base-10 numbers, the Gregorian calendar has months of 28, 29, 30, and 31 days. Finding your exact age in completed years, months, and days requires subtracting the birth date from the target date from right to left (days, then months, then years) and borrowing when needed.',
        'Similarly, counting the exact number of days between two dates depends on whether you are measuring elapsed time (exclusive of the end date) or inclusive calendar days (such as a vacation from Monday through Friday).',
      ],
      callout:
        'Memory aid: April, June, September, and November have 30 days; February has 28 (or 29 in a leap year); all the rest have 31.',
    },
    section2: {
      heading: '2. The chronological age subtraction method',
      intro:
        'Write both dates as Year – Month – Day and subtract each component, borrowing from the previous month or year if the birth day or month is larger:',
      formulaPrefix: 'Age = ',
      formulaHighlight: '(Target Y – M – D)',
      formulaSuffix: ' – (Birth Y – M – D)',
      fullFormulaText: 'Age = (Target Year, Month, Day) – (Birth Year, Month, Day)',
      variables: [
        {
          term: 'Borrowing Days',
          definition:
            'If Target Day < Birth Day, borrow the exact number of days from the preceding month (28, 29, 30, or 31) and reduce Target Month by 1.',
        },
        {
          term: 'Borrowing Months',
          definition:
            'If Target Month < Birth Month, add 12 to Target Month and reduce Target Year by 1.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'age on 10 October 2026 for a birth date of 25 May 1998',
      steps: [
        {
          title: 'Compare the days (10 vs. 25):',
          lines: [
            'Since 10 < 25, borrow 30 days from September (month 9):',
            'Days = (10 + 30) – 25 = 15 days; Target Month becomes 9',
          ],
        },
        {
          title: 'Subtract the months (9 vs. 5):',
          lines: ['Months = 9 – 5 = 4 months'],
        },
        {
          title: 'Subtract the years (2026 vs. 1998):',
          lines: ['Years = 2026 – 1998 = 28 years'],
        },
        {
          title: 'Final answer:',
          lines: ['Exact age = 28 years, 4 months, and 15 days'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: '25 May 1998 to 10 Oct 2026:',
      resultBigValue: '28y 4m 15d',
      resultEquation: '28 Years, 4 Months, 15 Days',
    },
    section4: {
      heading: '4. Inclusive vs. exclusive day counting',
      intro:
        'Simple subtraction counts the nights or elapsed days between two dates. If both the start date and end date are active days (like a 5-day conference from May 10 to May 14), add 1:',
      formula: 'Elapsed Days = End – Start   |   Inclusive Days = (End – Start) + 1',
      exampleLead: 'Counting days from May 10 to May 14:',
      bullets: [
        'Exclusive difference: 14 – 10 = 4 days (e.g., 4 hotel nights)',
        'Inclusive span: (14 – 10) + 1 = 5 calendar days (May 10, 11, 12, 13, 14)',
        'Always check whether contracts specify “clear days” or “inclusive days”',
      ],
      closingText:
        'Find your exact age or count days between any two dates with our',
      ctaLinkText: 'Age Calculator',
      ctaLinkHref: '/age-calculator',
    },
    section5: {
      heading: '5. How the Gregorian leap year rule works',
      intro:
        'A leap year adds 1 extra day (February 29) so the calendar stays aligned with Earth’s 365.2422-day orbit:',
      formula: 'Leap Year = Divisible by 4 (except century years not divisible by 400)',
      exampleLead: 'Checking which years have 366 days:',
      bullets: [
        '2024 and 2028 are divisible by 4 → Leap years (366 days)',
        '2000 was divisible by 400 → Leap year (366 days)',
        '1900 and 2100 are divisible by 100 but not 400 → Common years (365 days)',
      ],
      closingText:
        'Count exact weeks, workdays, and days between dates in the',
      ctaLinkText: 'Date Difference Calculator',
      ctaLinkHref: '/date-difference-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Start / Birth Date', 'End / Target Date', 'Year-Month-Day Span', 'Total Days'],
      rows: [
        { col1: '01 Jan 2025', col2: '01 Jan 2026', col3: '1 year, 0 months, 0 days', col4: '365 days' },
        { col1: '01 Jan 2024 (Leap)', col2: '01 Jan 2025', col3: '1 year, 0 months, 0 days', col4: '366 days' },
        { col1: '25 May 1998', col2: '10 Oct 2026', col3: '28 years, 4 months, 15 days', col4: '10,365 days' },
        { col1: '01 Mar 2026', col2: '15 Jun 2026', col3: '0 years, 3 months, 14 days', col4: '106 days' },
        { col1: '10 May 2026', col2: '14 May 2026 (Incl.)', col3: '5 inclusive calendar days', col4: '4 nights / 5 days' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Borrowing 30 days unconditionally when the preceding month actually has 31 or 28 days.',
        'Forgetting to add 1 day when counting inclusive event days (the fencepost error).',
        'Multiplying years by 365 without adding 1 extra day for each leap year in the span.',
        'Assuming every month equals exactly 4 weeks (28 days) when calculating multi-month deadlines.',
        'Forgetting time zones or daylight saving shifts when calculating exact hour durations.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Age & Date Calculators',
      ctaDescription:
        'Find your exact age or count the days, weeks, and months between any two dates.',
      ctaButtonLabel: 'Open Age Calculator',
      ctaHref: '/age-calculator',
      relatedCalculators: [
        { name: 'Age Calculator', href: '/age-calculator' },
        {
          name: 'Date Difference Calculator',
          href: '/date-difference-calculator',
        },
        { name: 'Time Duration Calculator', href: '/time-duration-calculator' },
        { name: 'BMI Calculator', href: '/bmi-calculator' },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
      ],
      keyTakeaways: [
        'Subtract days first, then months, then years, borrowing as needed.',
        'Add 1 day to (End – Start) if both start and end dates are included.',
        'Leap years occur every 4 years, except century years not divisible by 400.',
        '4 months have 30 days, 7 months have 31 days, and February has 28 or 29.',
      ],
      exploreDescription: 'Explore all calendar, age, and time duration tools.',
      exploreButtonLabel: 'View Date & Time Calculators',
      exploreHref: '/date-time',
      faqs: [
        {
          question: 'When does someone born on February 29 celebrate in non-leap years?',
          answer:
            'In common years, most jurisdictions recognize either February 28 or March 1 as the legal birthday for age milestones.',
        },
        {
          question: 'Why is counting 90 days different from counting 3 months?',
          answer:
            'Three consecutive months usually contain 91 or 92 days (because two of the three months often have 31 days). Deadlines written as “90 days” must be counted day by day.',
        },
        {
          question: 'How do I calculate elapsed hours across midnight?',
          answer:
            'Calculate the time from the start time until 24:00 (midnight), then add the hours and minutes elapsed on the following day, or use our Time Duration Calculator.',
        },
      ],
      references: [
        'ISO 8601 calendar date standards and Gregorian leap year rules.',
      ],
    },
  },

  // ============================================================================
  // 12. HOW TO ESTIMATE 401(K) AND RETIREMENT SAVINGS GROWTH
  // ============================================================================
  {
    slug: 'how-to-estimate-401k-and-retirement-growth',
    title: 'How to Estimate 401(k) and Retirement Savings Growth',
    shortTitle: '401(k) & Retirement',
    category: 'Retirement & Tax',
    breadcrumbCategory: 'Retirement Guides',
    badgeSymbol: '401k',
    badgeGradient: 'from-[#16856B] to-[#1D4ED8]',
    heroIntro:
      'Learn how employee deferrals, employer matching contributions, and long-term compounding combine to build your retirement nest egg, plus how the 4% safe withdrawal rule works.',
    heroCalcScreenValue: '$685,400',
    keywords: [
      '401k calculator guide',
      'how to calculate retirement savings',
      'employer match formula',
      '4 percent rule retirement',
      'superannuation growth',
      'retirement nest egg',
    ],
    tocLabels: {
      s1: 'How retirement accounts grow',
      s2: 'Employer match & growth formula',
      s3: 'Step-by-step example',
      s4: 'Future value over 25 years',
      s5: 'The 4% withdrawal rule',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. How workplace retirement accounts work',
      paragraphs: [
        'Workplace retirement plans—such as a US 401(k), Australian Superannuation, or UK workplace pension—grow through three engines: your regular paycheck contributions, employer matching contributions, and tax-advantaged compound investment returns.',
        'Capturing your employer’s full match is an immediate 50% to 100% return on that portion of your contribution before market compounding even begins.',
      ],
      callout:
        'Always contribute at least enough to capture your employer’s maximum matching percentage—otherwise you leave part of your compensation on the table.',
    },
    section2: {
      heading: '2. The annual contribution and match formula',
      intro:
        'Your total annual retirement savings deposit combines your deferral rate and your employer’s match rate (up to the employer’s cap):',
      formulaPrefix: 'Annual Deposit = ',
      formulaHighlight: 'Salary × (Your % + Match %)',
      formulaSuffix: ' ÷ 100',
      fullFormulaText: 'Annual Deposit = Salary × (Your % + Match %) ÷ 100',
      variables: [
        {
          term: 'Your Contribution %',
          definition: 'is the percentage of gross salary you defer each paycheck.',
        },
        {
          term: 'Employer Match %',
          definition:
            'is the percentage your employer adds (for example, 100% match up to 4% of salary).',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask:
        '$80,000 salary, 8% employee contribution, and 100% employer match up to 4%',
      steps: [
        {
          title: 'Calculate your annual contribution (8% of $80,000):',
          lines: ['Employee Deposit = $80,000 × 0.08 = $6,400 / year'],
        },
        {
          title: 'Calculate the employer match (capped at 4% of $80,000):',
          lines: ['Employer Match = $80,000 × 0.04 = $3,200 / year'],
        },
        {
          title: 'Add both sources to find total annual investment:',
          lines: ['Total Annual Contribution = $6,400 + $3,200 = $9,600 / year ($800 / month)'],
        },
        {
          title: 'Final answer:',
          lines: ['$9,600 invested per year (12% effective savings rate)'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: 'Total annual 401(k) deposit:',
      resultBigValue: '$9,600/yr',
      resultEquation: '$6,400 (You) + $3,200 (Match)',
    },
    section4: {
      heading: '4. Projecting multi-decade growth',
      intro:
        'When $800 per month ($9,600/year) is invested consistently at an illustrative 7% annual return:',
      formula: 'FV = Monthly Deposit × [((1 + r/12)^n – 1) ÷ (r/12)]',
      exampleLead: 'Investing $800/month at 7% annual return over 25 years (300 months):',
      bullets: [
        'Total out-of-pocket employee deposits = $160,000',
        'Total employer match deposits = $80,000',
        'Projected balance after 25 years = ~$648,057 (over $408,000 in compound growth)',
      ],
      closingText:
        'Model your own age, salary, contribution rate, and employer match in the',
      ctaLinkText: '401(k) Retirement Calculator',
      ctaLinkHref: '/finance/401k-calculator',
    },
    section5: {
      heading: '5. Estimating retirement income with the 4% rule',
      intro:
        'A widely used retirement planning benchmark is the 4% rule, which estimates how much you can withdraw in year one of retirement (Or multiply desired annual spending by 25 to find your target nest egg):',
      formula: 'Target Nest Egg = Desired Annual Retirement Income × 25',
      exampleLead: 'Planning for $40,000 per year in portfolio withdrawals:',
      bullets: [
        'Target portfolio = $40,000 × 25 = $1,000,000',
        '4% of $1,000,000 = $40,000/year ($3,333/month)',
        'Adjust expectations for taxes, pension/Social Security, and healthcare costs',
      ],
      closingText:
        'Explore our complete suite of retirement and superannuation tools in the',
      ctaLinkText: 'Retirement & Super Hub',
      ctaLinkHref: '/retirement-and-super',
    },
    section6: {
      heading: '6. Examples ($800/Month Combined Contribution at 7% Annual Return)',
      headers: ['Years Invested', 'Your Deposits', 'Employer Match', 'Projected Balance'],
      rows: [
        { col1: '10 Years', col2: '$64,000', col3: '$32,000', col4: '$138,468' },
        { col1: '15 Years', col2: '$96,000', col3: '$48,000', col4: '$253,570' },
        { col1: '20 Years', col2: '$128,000', col3: '$64,000', col4: '$416,741' },
        { col1: '25 Years', col2: '$160,000', col3: '$80,000', col4: '$648,057' },
        { col1: '30 Years', col2: '$192,000', col3: '$96,000', col4: '$975,977' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Contributing less than the employer match threshold and missing free matching dollars.',
        'Assuming a 50% match up to 6% means the employer contributes 6% (it means they contribute 3% when you put in 6%).',
        'Overlooking annual fund expense ratios (a 1% fee can erode over 20% of a 30-year balance).',
        'Cashing out a retirement account early when changing jobs, triggering income taxes and early withdrawal penalties.',
        'Forgetting that traditional pre-tax retirement withdrawals are taxed as ordinary income in retirement.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the 401(k) Retirement Calculator',
      ctaDescription:
        'Project your retirement balance with salary growth and employer matching.',
      ctaButtonLabel: 'Open 401(k) Calculator',
      ctaHref: '/finance/401k-calculator',
      relatedCalculators: [
        { name: '401(k) Calculator', href: '/finance/401k-calculator' },
        {
          name: 'Compound Interest Calculator',
          href: '/compound-interest-calculator',
        },
        {
          name: 'US Federal Income Tax Calculator',
          href: '/finance/us-federal-income-tax-calculator',
        },
        { name: 'Retirement & Super Hub', href: '/retirement-and-super' },
        { name: 'Loan Payment Calculator', href: '/loan-calculator' },
      ],
      keyTakeaways: [
        'Capture 100% of your employer match first.',
        'Your effective savings rate equals Your % + Employer Match %.',
        'Starting 10 years earlier often beats doubling your contribution later.',
        'Multiply desired annual portfolio income by 25 to estimate your target nest egg.',
      ],
      exploreDescription: 'Explore all retirement, pension, and super calculators.',
      exploreButtonLabel: 'View Retirement Calculators',
      exploreHref: '/retirement-and-super',
      faqs: [
        {
          question: 'What does “50% match up to 6% of salary” mean?',
          answer:
            'It means for every dollar you contribute up to 6% of your pay, your employer adds 50 cents—giving you a maximum employer match equal to 3% of your salary.',
        },
        {
          question: 'What is the difference between Traditional and Roth contributions?',
          answer:
            'Traditional contributions reduce your taxable income today and are taxed when withdrawn in retirement. Roth contributions are made with after-tax dollars, so qualified withdrawals in retirement are tax-free.',
        },
        {
          question: 'What is a typical long-term return assumption for retirement planning?',
          answer:
            'Many planners model 6% to 7% annual returns to reflect a diversified portfolio after adjusting for historical inflation.',
        },
      ],
      references: [
        'IRS defined-contribution plan rules and standard actuarial retirement modeling.',
      ],
    },
  },

  // ============================================================================
  // 13. HOW TO CALCULATE NET SALARY, TAKE-HOME PAY, AND SALES TAX / GST
  // ============================================================================
  {
    slug: 'how-to-calculate-net-salary-and-sales-tax',
    title: 'How to Calculate Net Salary, Take-Home Pay, and Sales Tax / GST',
    shortTitle: 'Tax & Take-Home Pay',
    category: 'Retirement & Tax',
    breadcrumbCategory: 'Tax & Finance Guides',
    badgeSymbol: 'TAX',
    badgeGradient: 'from-[#152238] to-[#2457D6]',
    heroIntro:
      'Understand how progressive income tax brackets work (marginal vs. effective tax rate), how to estimate net take-home pay, and how to add or remove sales tax / GST.',
    heroCalcScreenValue: '13.8%',
    keywords: [
      'income tax guide',
      'marginal vs effective tax rate',
      'take home pay formula',
      'net salary calculator',
      'how to calculate sales tax',
      'remove gst from price',
    ],
    tocLabels: {
      s1: 'Gross vs. net pay',
      s2: 'Progressive tax brackets',
      s3: 'Step-by-step example',
      s4: 'Marginal vs. effective rate',
      s5: 'Adding & removing GST/Tax',
      s6: 'Example table',
      s7: 'Common mistakes',
      s8: 'Author & references',
      s9: 'FAQs',
    },
    section1: {
      heading: '1. Gross income, taxable income, and net take-home pay',
      paragraphs: [
        'Gross income is your total salary or wages before any deductions. Subtracting pre-tax retirement contributions and the standard (or itemized) deduction leaves your taxable income.',
        'Income tax is calculated using progressive brackets—meaning only the dollars sitting inside a higher bracket are taxed at that higher rate, never your entire salary.',
      ],
      callout:
        'Moving into a higher tax bracket never reduces your take-home pay, because the higher rate only applies to the income above the bracket threshold.',
    },
    section2: {
      heading: '2. The net pay and effective tax rate formulas',
      intro:
        'Subtract total taxes and payroll deductions from gross pay to find net take-home pay, and divide tax by gross income to find your effective tax rate:',
      formulaPrefix: 'Effective Tax Rate = (',
      formulaHighlight: 'Total Tax ÷ Gross Income',
      formulaSuffix: ') × 100',
      fullFormulaText:
        'Net Pay = Gross Income – Deductions – Total Tax   |   Effective Rate = Total Tax ÷ Gross × 100',
      variables: [
        {
          term: 'Marginal Tax Rate',
          definition: 'is the tax percentage applied to the very next dollar you earn.',
        },
        {
          term: 'Effective Tax Rate',
          definition: 'is the true average percentage of your total income paid in tax.',
        },
      ],
    },
    section3: {
      heading: '3. Step-by-step example',
      exampleTask: 'tax on $60,000 gross income with a $15,000 standard deduction',
      steps: [
        {
          title: 'Subtract the standard deduction to find taxable income:',
          lines: ['Taxable Income = $60,000 – $15,000 = $45,000'],
        },
        {
          title: 'Apply progressive brackets to the $45,000 taxable income:',
          lines: [
            'First $11,925 taxed at 10% = $1,192.50',
            'Remaining $33,075 ($45,000 – $11,925) taxed at 12% = $3,969.00',
          ],
        },
        {
          title: 'Add bracket taxes and find effective rate:',
          lines: [
            'Total Federal Income Tax = $1,192.50 + $3,969.00 = $5,161.50',
            'Effective Tax Rate = $5,161.50 ÷ $60,000 × 100 = 8.60%',
          ],
        },
        {
          title: 'Final answer:',
          lines: ['Federal tax = $5,161.50 (8.60% effective rate, 12% marginal bracket)'],
          highlightLastLine: true,
        },
      ],
      resultPrompt: 'Effective rate on $60,000:',
      resultBigValue: '8.60%',
      resultEquation: '$5,161.50 tax ÷ $60,000 gross',
    },
    section4: {
      heading: '4. Marginal tax rate vs. effective tax rate',
      intro:
        'In the example above, the taxpayer is in the “12% tax bracket,” yet their actual tax bill is only 8.60% of gross income:',
      formula: 'Taxable Income = Gross Income – Pre-Tax 401(k)/HSA – Standard Deduction',
      exampleLead: 'Why the effective rate is always lower than the top bracket:',
      bullets: [
        'First $15,000 (standard deduction) is taxed at 0%',
        'Next $11,925 is taxed at 10%',
        'Only the top $33,075 slice is taxed at 12%',
      ],
      closingText:
        'Calculate your exact bracket breakdown and effective rate with the',
      ctaLinkText: 'US Federal Income Tax Calculator',
      ctaLinkHref: '/finance/us-federal-income-tax-calculator',
    },
    section5: {
      heading: '5. How to add or reverse-calculate Sales Tax / GST / VAT',
      intro:
        'To add sales tax or GST to a pre-tax price, multiply by (1 + Tax Rate). To extract the pre-tax price from a tax-inclusive receipt, divide by (1 + Tax Rate):',
      formula: 'Add Tax: Total = Net × (1 + r)   |   Remove Tax: Net = Total ÷ (1 + r)',
      exampleLead: 'Removing 18% GST from a ₹1,180 tax-inclusive invoice:',
      bullets: [
        'Divide by 1.18: ₹1,180 ÷ 1.18 = ₹1,000 pre-tax price',
        'GST amount = ₹1,180 – ₹1,000 = ₹180',
        'Notice: Taking 18% off ₹1,180 directly would give ₹212.40 (incorrect!)',
      ],
      closingText:
        'For quick percentage tax additions and deductions, open the',
      ctaLinkText: 'Percentage Calculator',
      ctaLinkHref: '/math/percentage-calculator',
    },
    section6: {
      heading: '6. Examples',
      headers: ['Calculation Type', 'Input Amount', 'Formula Used', 'Result'],
      rows: [
        { col1: 'Federal Tax ($60k Single)', col2: '$45,000 taxable', col3: '10% + 12% brackets', col4: '$5,161.50 (8.6% eff.)' },
        { col1: 'Add 8.25% Sales Tax', col2: '$200.00 net price', col3: '$200 × 1.0825', col4: '$216.50 ($16.50 tax)' },
        { col1: 'Remove 10% GST', col2: '$110.00 inclusive', col3: '$110 ÷ 1.10', col4: '$100.00 net ($10 GST)' },
        { col1: 'Remove 18% GST', col2: '₹1,180 inclusive', col3: '₹1,180 ÷ 1.18', col4: '₹1,000 net (₹180 GST)' },
        { col1: 'Remove 20% VAT', col2: '£240.00 inclusive', col3: '£240 ÷ 1.20', col4: '£200.00 net (£40 VAT)' },
      ],
    },
    section7: {
      heading: '7. Common mistakes',
      mistakes: [
        'Multiplying your entire gross salary by your top marginal tax bracket percentage.',
        'Forgetting to subtract the standard deduction before applying tax brackets.',
        'Removing GST or VAT from a tax-inclusive price by multiplying by the tax rate instead of dividing by (1 + tax rate).',
        'Confusing a tax deduction (which reduces taxable income) with a tax credit (which reduces tax owed dollar-for-dollar).',
        'Forgetting FICA payroll taxes (Social Security and Medicare) and state taxes when estimating paycheck take-home pay.',
      ],
    },
    sidebar: {
      ctaTitle: 'Try the Income Tax Calculator',
      ctaDescription:
        'Estimate federal tax brackets, effective rates, and take-home income.',
      ctaButtonLabel: 'Open Income Tax Calculator',
      ctaHref: '/finance/us-federal-income-tax-calculator',
      relatedCalculators: [
        {
          name: 'US Federal Income Tax Calculator',
          href: '/finance/us-federal-income-tax-calculator',
        },
        { name: '401(k) Calculator', href: '/finance/401k-calculator' },
        { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
        { name: 'Discount Calculator', href: '/math/discount-calculator' },
        {
          name: 'Margin & Markup Calculator',
          href: '/finance/margin-and-markup-calculator',
        },
      ],
      keyTakeaways: [
        'Only the income inside a higher tax bracket is taxed at that higher rate.',
        'Effective tax rate = Total Tax ÷ Gross Income × 100.',
        'To remove tax from a tax-inclusive total, divide by (1 + tax rate).',
        'Tax credits reduce tax dollar-for-dollar; deductions reduce taxable income.',
      ],
      exploreDescription: 'Explore all tax, paycheck, and finance calculators.',
      exploreButtonLabel: 'View All Finance Calculators',
      exploreHref: '/finance',
      faqs: [
        {
          question: 'Can a pay raise push me into a higher bracket and lower my take-home pay?',
          answer:
            'No. Because income tax brackets are marginal, only the new dollars above the bracket line are taxed at the higher rate. Every dollar of a raise still increases your net take-home pay.',
        },
        {
          question: 'How do I quickly extract 10% GST from a receipt total?',
          answer:
            'Divide the receipt total by 11 to find the exact GST amount, or divide by 1.10 to find the pre-tax price.',
        },
        {
          question: 'What is the difference between a tax deduction and a tax credit?',
          answer:
            'A $1,000 tax deduction lowers your taxable income by $1,000 (saving you $220 if you are in the 22% bracket), whereas a $1,000 tax credit directly subtracts $1,000 from your tax bill.',
        },
      ],
      references: [
        'IRS progressive income tax tables and international VAT/GST accounting rules.',
      ],
    },
  },
];

export function getGuideBySlug(slug: string): GuideArticleData | undefined {
  return GUIDES_DATA.find((g) => g.slug === slug);
}
