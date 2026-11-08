export type ConversionCategorySlug =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'volume'
  | 'cooking'
  | 'area'
  | 'speed'
  | 'digital'
  | 'energy'
  | 'fuel-economy'
  | 'torque';

export interface PopularPairCard {
  id: string;
  label: string;
  abbrLabel: string;
  fromUnit: string;
  toUnit: string;
  sampleInput: number;
  /** Only set if a dedicated canonical pair page exists; otherwise uses on-page anchor + instant load */
  pairHref?: string;
  anchorId: string;
  factorSummary: string;
}

export interface CommonValueRowSpec {
  inputValue: number;
  fromUnit: string;
  fromAbbr: string;
  toUnit: string;
  toAbbr: string;
  keywordLabel: string;
  workingFormula: string;
}

export interface ComputedCommonValueRow extends CommonValueRowSpec {
  computedOutput: string;
  rawOutput: number;
}

export interface UnitGuideItem {
  unit: string;
  symbol: string;
  system: 'Metric (SI)' | 'US Customary / Imperial' | 'International / Scientific';
  baseEquivalent: string;
  commonUse: string;
}

export interface UnitComparisonBox {
  title: string;
  unitALabel: string;
  unitADetail: string;
  unitBLabel: string;
  unitBDetail: string;
  takeaway: string;
  routingLink?: {
    label: string;
    href: string;
  };
}

export interface ConversionFaqItem {
  question: string;
  answer: string;
}

export interface ConversionAuditReport {
  beforeTitle: string;
  afterTitle: string;
  beforeMeta: string;
  afterMeta: string;
  beforeH1: string;
  afterH1: string;
  keywordsPlaced: { keyword: string; zone: string }[];
  keywordsSkipped: { keyword: string; reason: string }[];
  calculationsVerified: { label: string; working: string; result: string }[];
}

export interface ConversionCategoryConfig {
  slug: ConversionCategorySlug;
  canonicalPath: string;
  categoryLabel: string;
  shortLabel: string;
  /** Step 2.1: <Primary pair> Converter (<abbr>) | <Category> | SolveIt Calculator (~60 chars) */
  metaTitle: string;
  /** Step 2.1: 150-160 chars */
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  /** Step 2.2: H1 in plain words */
  h1: string;
  h1Highlight: string;
  subtitle: string;
  /** Step 2.5: 1-line answer near top of the page for the top question-type keyword */
  topQuestionBanner: {
    question: string;
    oneLineAnswer: string;
  };
  defaultFromUnit: string;
  defaultToUnit: string;
  defaultInputValue: string;
  baseUnitLabel: string;
  units: string[];
  toBase: (val: number, unit: string) => number;
  fromBase: (baseVal: number, unit: string) => number;
  popularPairs: PopularPairCard[];
  commonValueSpecs: CommonValueRowSpec[];
  unitGuide: UnitGuideItem[];
  comparisonBox?: UnitComparisonBox;
  formulaCard: {
    introText: string;
    formulaText: string;
    exampleTitle: string;
    exampleSteps: string[];
  };
  howItWorks: {
    paragraph: string;
    formulaBox: string;
    closingNote: string;
  };
  faqs: ConversionFaqItem[];
  routingNotice?: {
    text: string;
    linkLabel: string;
    linkHref: string;
  };
  auditReport?: ConversionAuditReport;
}

export function formatConversionNumber(val: number, maxDecimals = 4): string {
  if (!Number.isFinite(val)) return '0';
  const abs = Math.abs(val);
  if (abs === 0) return '0';
  if (abs >= 0.0001 && abs < 1_000_000_000) {
    return Number(val.toFixed(maxDecimals)).toLocaleString('en-US', {
      maximumFractionDigits: maxDecimals,
    });
  }
  return val.toExponential(4);
}

export const CONVERSION_CATEGORIES: Record<ConversionCategorySlug, ConversionCategoryConfig> = {
  length: {
    slug: 'length',
    canonicalPath: '/conversions/length',
    categoryLabel: 'Length & Distance',
    shortLabel: 'Length',
    metaTitle: 'Millimeters to Inches Converter (mm to in) | Length | SolveIt',
    metaDescription:
      'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), feet, and meters with NIST SP 811 factors, quick tables, and worked formulas.',
    ogTitle: 'Millimeters to Inches Converter (mm to in) | Length | SolveIt',
    ogDescription:
      'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), feet, and meters with NIST SP 811 factors, quick tables, and worked formulas.',
    h1: 'Millimeters to Inches and Length',
    h1Highlight: 'Converter',
    subtitle:
      'Convert millimeters to inches, centimeters to inches, feet, meters, and kilometers using exact conversion factors that follow NIST SP 811.',
    topQuestionBanner: {
      question: 'How many inches is 8 mm?',
      oneLineAnswer:
        '8 mm is about 0.315 inches (8 ÷ 25.4 = 0.314961 in), because 1 inch equals exactly 25.4 millimeters.',
    },
    defaultFromUnit: 'Millimeters',
    defaultToUnit: 'Inches',
    defaultInputValue: '8',
    baseUnitLabel: 'Meters (m)',
    units: [
      'Millimeters',
      'Centimeters',
      'Meters',
      'Kilometers',
      'Inches',
      'Feet',
      'Yards',
      'Miles',
      'Nautical Miles',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        Meters: 1,
        Kilometers: 1000,
        Centimeters: 0.01,
        Millimeters: 0.001,
        Feet: 0.3048,
        Inches: 0.0254,
        Yards: 0.9144,
        Miles: 1609.344,
        'Nautical Miles': 1852,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        Meters: 1,
        Kilometers: 0.001,
        Centimeters: 100,
        Millimeters: 1000,
        Feet: 1 / 0.3048,
        Inches: 1 / 0.0254,
        Yards: 1 / 0.9144,
        Miles: 1 / 1609.344,
        'Nautical Miles': 1 / 1852,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'mm-to-in',
        label: 'Millimeters to Inches',
        abbrLabel: 'mm to in',
        fromUnit: 'Millimeters',
        toUnit: 'Inches',
        sampleInput: 8,
        anchorId: 'pair-mm-to-in',
        factorSummary: '1 in = 25.4 mm (exact)',
      },
      {
        id: 'cm-to-in',
        label: 'Centimeters to Inches',
        abbrLabel: 'cm to in',
        fromUnit: 'Centimeters',
        toUnit: 'Inches',
        sampleInput: 50,
        anchorId: 'pair-cm-to-in',
        factorSummary: '1 in = 2.54 cm (exact)',
      },
      {
        id: 'in-to-ft',
        label: 'Inches to Feet',
        abbrLabel: 'in to ft',
        fromUnit: 'Inches',
        toUnit: 'Feet',
        sampleInput: 80,
        anchorId: 'pair-in-to-ft',
        factorSummary: '1 ft = 12 in (exact)',
      },
      {
        id: 'ft-to-in',
        label: 'Feet to Inches',
        abbrLabel: 'ft to in',
        fromUnit: 'Feet',
        toUnit: 'Inches',
        sampleInput: 8,
        anchorId: 'pair-ft-to-in',
        factorSummary: '1 ft × 12 = 12 in',
      },
      {
        id: 'm-to-ft',
        label: 'Meters to Feet',
        abbrLabel: 'm to ft',
        fromUnit: 'Meters',
        toUnit: 'Feet',
        sampleInput: 200,
        anchorId: 'pair-m-to-ft',
        factorSummary: '1 ft = 0.3048 m (exact)',
      },
      {
        id: 'km-to-mi',
        label: 'Kilometers to Miles',
        abbrLabel: 'km to mi',
        fromUnit: 'Kilometers',
        toUnit: 'Miles',
        sampleInput: 100,
        anchorId: 'pair-km-to-mi',
        factorSummary: '1 mi = 1.609344 km (exact)',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 8,
        fromUnit: 'Millimeters',
        fromAbbr: 'mm',
        toUnit: 'Inches',
        toAbbr: 'in',
        keywordLabel: '8 mm to inches',
        workingFormula: '8 ÷ 25.4',
      },
      {
        inputValue: 10,
        fromUnit: 'Millimeters',
        fromAbbr: 'mm',
        toUnit: 'Inches',
        toAbbr: 'in',
        keywordLabel: '10 mm to inches',
        workingFormula: '10 ÷ 25.4',
      },
      {
        inputValue: 20,
        fromUnit: 'Millimeters',
        fromAbbr: 'mm',
        toUnit: 'Inches',
        toAbbr: 'in',
        keywordLabel: '20 mm to inches',
        workingFormula: '20 ÷ 25.4',
      },
      {
        inputValue: 24,
        fromUnit: 'Centimeters',
        fromAbbr: 'cm',
        toUnit: 'Inches',
        toAbbr: 'in',
        keywordLabel: '24 cm to inches',
        workingFormula: '24 ÷ 2.54',
      },
      {
        inputValue: 50,
        fromUnit: 'Centimeters',
        fromAbbr: 'cm',
        toUnit: 'Inches',
        toAbbr: 'in',
        keywordLabel: '50 cm to inches',
        workingFormula: '50 ÷ 2.54',
      },
      {
        inputValue: 80,
        fromUnit: 'Inches',
        fromAbbr: 'in',
        toUnit: 'Feet',
        toAbbr: 'ft',
        keywordLabel: '80 inches in feet',
        workingFormula: '80 ÷ 12',
      },
      {
        inputValue: 8,
        fromUnit: 'Feet',
        fromAbbr: 'ft',
        toUnit: 'Inches',
        toAbbr: 'in',
        keywordLabel: '8 ft to inches',
        workingFormula: '8 × 12',
      },
      {
        inputValue: 200,
        fromUnit: 'Meters',
        fromAbbr: 'm',
        toUnit: 'Feet',
        toAbbr: 'ft',
        keywordLabel: '200 meters to feet',
        workingFormula: '200 ÷ 0.3048',
      },
      {
        inputValue: 100,
        fromUnit: 'Kilometers',
        fromAbbr: 'km',
        toUnit: 'Miles',
        toAbbr: 'mi',
        keywordLabel: '100 km to miles',
        workingFormula: '100 ÷ 1.609344',
      },
    ],
    unitGuide: [
      {
        unit: 'Millimeter',
        symbol: 'mm',
        system: 'Metric (SI)',
        baseEquivalent: '0.001 m (1/25.4 in)',
        commonUse: 'Sizing metric socket wrenches, drill bits, and mechanical fasteners such as 8 mm or 10 mm bolts.',
      },
      {
        unit: 'Centimeter',
        symbol: 'cm',
        system: 'Metric (SI)',
        baseEquivalent: '0.01 m (1/2.54 in)',
        commonUse: 'Measuring furniture dimensions, shipping boxes, and international garment size charts.',
      },
      {
        unit: 'Meter',
        symbol: 'm',
        system: 'Metric (SI)',
        baseEquivalent: '1 m (SI base unit)',
        commonUse: 'Architectural floor plans, Olympic track distances, and room ceiling heights.',
      },
      {
        unit: 'Kilometer',
        symbol: 'km',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 m',
        commonUse: 'Highway distance signage, road race courses, and city-to-city travel planning.',
      },
      {
        unit: 'Inch',
        symbol: 'in',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.0254 m (25.4 mm)',
        commonUse: 'TV and monitor screen diagonals, dimensional lumber thickness, and plumbing pipe diameters.',
      },
      {
        unit: 'Foot',
        symbol: 'ft',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.3048 m (12 in)',
        commonUse: 'Residential room dimensions, building elevations, and commercial aviation altitude.',
      },
      {
        unit: 'Yard',
        symbol: 'yd',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.9144 m (3 ft)',
        commonUse: 'Buying fabric bolts by the yard, landscaping turf layout, and American football field markings.',
      },
      {
        unit: 'Mile',
        symbol: 'mi',
        system: 'US Customary / Imperial',
        baseEquivalent: '1,609.344 m (5,280 ft)',
        commonUse: 'US and UK highway distance markers, odometer readings, and marathon race distances.',
      },
      {
        unit: 'Nautical Mile',
        symbol: 'nmi',
        system: 'International / Scientific',
        baseEquivalent: '1,852 m (≈ 1.15078 mi)',
        commonUse: 'Marine chart navigation and international air routing equal to one minute of Earth latitude.',
      },
    ],
    comparisonBox: {
      title: 'Statute Mile (mi) vs. Nautical Mile (nmi)',
      unitALabel: 'Statute Mile (1,609.344 m)',
      unitADetail:
        'Fixed at 5,280 international feet (1,760 yards). Used on road signs and automobile odometers in the United States and United Kingdom.',
      unitBLabel: 'Nautical Mile (1,852 m)',
      unitBDetail:
        'Defined internationally as exactly 1,852 meters (about 6,076.12 feet or 1.15078 statute miles) to match one arcminute of latitude on charts.',
      takeaway:
        'Never interchange road miles and nautical miles in marine or aviation logs: 100 nautical miles equals 115.08 statute miles.',
    },
    formulaCard: {
      introText: 'Divide millimeters by 25.4 to get inches, or multiply inches by 25.4 to get millimeters:',
      formulaText: 'Inches (in) = Millimeters (mm) ÷ 25.4',
      exampleTitle: 'Convert 8 mm to inches:',
      exampleSteps: [
        '1 inch = 25.4 millimeters (exact international definition)',
        'Inches = 8 ÷ 25.4',
        'Result = 0.314961 inches (about 0.315 in)',
      ],
    },
    howItWorks: {
      paragraph:
        'Since the 1959 International Yard and Pound Agreement, 1 inch is defined as exactly 25.4 millimeters (2.54 centimeters), and 1 foot is defined as exactly 0.3048 meters. All conversion factors follow NIST SP 811.',
      formulaBox: 'Target Length = Input Value × (From Unit in Meters ÷ To Unit in Meters)',
      closingNote:
        'To convert centimeters to inches, divide by 2.54. To convert meters to feet, divide by 0.3048 (or multiply by 3.2808399).',
    },
    faqs: [
      {
        question: 'How many inches is 8 mm?',
        answer:
          '8 mm is about 0.315 inches (8 / 25.4 = 0.314961 in), which is just over 5/16 of an inch (0.3125 in).',
      },
      {
        question: 'How do I convert 50 cm to inches?',
        answer:
          'Divide 50 by 2.54 to get about 19.685 inches (50 / 2.54 = 19.685039 in).',
      },
      {
        question: 'How many feet is 80 inches?',
        answer:
          '80 inches is 6.6667 feet, or 6 feet 8 inches (80 / 12 = 6 remainder 8).',
      },
      {
        question: 'How many miles is 100 km?',
        answer:
          '100 kilometers is about 62.137 miles (100 / 1.609344 = 62.137119 mi).',
      },
      {
        question: 'What is a linear foot, and how do you convert linear feet to feet?',
        answer:
          '1 linear foot is simply 1 foot (12 inches or 0.3048 meters) measured in a straight line regardless of material width. To convert linear feet to square feet for lumber or flooring, multiply linear feet by the board width in feet.',
      },
      {
        question: 'What is the actual thickness of 1/2-inch plywood in inches and millimeters?',
        answer:
          'Nominal 1/2-inch construction plywood has a standard sanded thickness of 15/32 inch, which equals 0.46875 inches or 11.906 millimeters (0.46875 × 25.4).',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Millimeters to Inches Converter (mm to in) | Length | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), feet, and meters with NIST SP 811 factors, quick tables, and worked formulas.',
      beforeH1: 'Unit Converter',
      afterH1: 'Millimeters to Inches and Length Converter',
      keywordsPlaced: [
        { keyword: 'millimeters to inches / mm to in', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'centimeters to inches / cm to in', zone: 'Meta / Pair Card 2' },
        { keyword: 'inches to feet / in to ft', zone: 'Pair Card 3' },
        { keyword: 'feet to inches / ft to in', zone: 'Pair Card 4' },
        { keyword: 'meters to feet / m to ft', zone: 'Pair Card 5' },
        { keyword: 'kilometers to miles / km to mi', zone: 'Pair Card 6' },
        { keyword: '8mm to inches', zone: 'Top 1-Line Answer / Common-Values Table / FAQ 1' },
        { keyword: '10mm to inches', zone: 'Common-Values Table / Unit Guide (mm)' },
        { keyword: '20mm to inches', zone: 'Common-Values Table' },
        { keyword: '24 cm to inches', zone: 'Common-Values Table' },
        { keyword: '50cm to inches', zone: 'Common-Values Table / FAQ 2' },
        { keyword: '80 inches in feet', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '8 ft to inches', zone: 'Common-Values Table' },
        { keyword: '200 meters to feet', zone: 'Common-Values Table' },
        { keyword: '100 km to miles', zone: 'Common-Values Table / FAQ 4' },
        { keyword: 'what is a linear foot / linear feet to feet', zone: 'FAQ 5' },
        { keyword: '1/2 plywood thickness (15/32 in to mm)', zone: 'FAQ 6' },
      ],
      keywordsSkipped: [
        { keyword: '15 km en miles / pulgadas a cm', reason: 'Flagged non-English query' },
        { keyword: 'fut / milimeter', reason: 'Misspelling — never placed in visible text' },
        { keyword: "5'10 in cm / 5 3 inches cm", reason: 'Belongs on dedicated Height Converter page' },
        { keyword: '3/8 to millimeters / 5/16 to millimeters', reason: 'Belongs on fractional SAE to Metric Converter page' },
      ],
      calculationsVerified: [
        { label: '8 mm to in', working: '8 / 25.4', result: '0.314961 in (≈ 0.315 in)' },
        { label: '10 mm to in', working: '10 / 25.4', result: '0.393701 in (≈ 0.394 in)' },
        { label: '20 mm to in', working: '20 / 25.4', result: '0.787402 in (≈ 0.787 in)' },
        { label: '24 cm to in', working: '24 / 2.54', result: '9.448819 in (≈ 9.45 in)' },
        { label: '50 cm to in', working: '50 / 2.54', result: '19.685039 in (≈ 19.69 in)' },
        { label: '80 in to ft', working: '80 / 12', result: '6.6667 ft (6 ft 8 in)' },
        { label: '8 ft to in', working: '8 × 12', result: '96 in' },
        { label: '200 m to ft', working: '200 / 0.3048', result: '656.168 ft' },
        { label: '100 km to mi', working: '100 / 1.609344', result: '62.1371 mi' },
        { label: '15/32 in plywood to mm', working: '0.46875 × 25.4', result: '11.9063 mm' },
      ],
    },
  },

  weight: {
    slug: 'weight',
    canonicalPath: '/conversions/weight',
    categoryLabel: 'Weight & Mass',
    shortLabel: 'Weight',
    metaTitle: 'Kilograms to Pounds Converter (kg to lbs) | Weight | SolveIt',
    metaDescription:
      'Convert kilograms to pounds (kg to lbs), pounds to kilograms, grams to pounds, and ounces using NIST SP 811 factors, quick tables, and worked formulas.',
    ogTitle: 'Kilograms to Pounds Converter (kg to lbs) | Weight | SolveIt',
    ogDescription:
      'Convert kilograms to pounds (kg to lbs), pounds to kilograms, grams to pounds, and ounces using NIST SP 811 factors, quick tables, and worked formulas.',
    h1: 'Kilograms to Pounds and Weight',
    h1Highlight: 'Converter',
    subtitle:
      'Convert kilograms to pounds, pounds to kilograms, grams, ounces, stone, and metric tons with conversion factors that follow NIST SP 811.',
    topQuestionBanner: {
      question: 'How many pounds is 60 kg?',
      oneLineAnswer:
        '60 kg is about 132.28 pounds (60 ÷ 0.45359237 = 132.2774 lbs), because 1 kilogram equals approximately 2.20462 pounds.',
    },
    defaultFromUnit: 'Kilograms',
    defaultToUnit: 'Pounds',
    defaultInputValue: '60',
    baseUnitLabel: 'Kilograms (kg)',
    units: [
      'Kilograms',
      'Pounds',
      'Grams',
      'Ounces',
      'Milligrams',
      'Stone',
      'Tons (Metric)',
      'Tons (US Short)',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        Kilograms: 1,
        Grams: 0.001,
        Milligrams: 0.000001,
        Pounds: 0.45359237,
        Ounces: 0.028349523125,
        Stone: 6.35029318,
        'Tons (Metric)': 1000,
        'Tons (US Short)': 907.18474,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        Kilograms: 1,
        Grams: 1000,
        Milligrams: 1_000_000,
        Pounds: 1 / 0.45359237,
        Ounces: 1 / 0.028349523125,
        Stone: 1 / 6.35029318,
        'Tons (Metric)': 0.001,
        'Tons (US Short)': 1 / 907.18474,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'kg-to-lbs',
        label: 'Kilograms to Pounds',
        abbrLabel: 'kg to lbs',
        fromUnit: 'Kilograms',
        toUnit: 'Pounds',
        sampleInput: 60,
        anchorId: 'pair-kg-to-lbs',
        factorSummary: '1 kg ≈ 2.20462 lbs',
      },
      {
        id: 'lbs-to-kg',
        label: 'Pounds to Kilograms',
        abbrLabel: 'lbs to kg',
        fromUnit: 'Pounds',
        toUnit: 'Kilograms',
        sampleInput: 165,
        anchorId: 'pair-lbs-to-kg',
        factorSummary: '1 lb = 0.45359237 kg (exact)',
      },
      {
        id: 'g-to-lbs',
        label: 'Grams to Pounds',
        abbrLabel: 'g to lbs',
        fromUnit: 'Grams',
        toUnit: 'Pounds',
        sampleInput: 500,
        anchorId: 'pair-g-to-lbs',
        factorSummary: '1 lb = 453.59237 g (exact)',
      },
      {
        id: 'g-to-oz',
        label: 'Grams to Ounces',
        abbrLabel: 'g to oz',
        fromUnit: 'Grams',
        toUnit: 'Ounces',
        sampleInput: 100,
        anchorId: 'pair-g-to-oz',
        factorSummary: '1 oz = 28.349523 g',
      },
      {
        id: 'oz-to-lbs',
        label: 'Ounces to Pounds',
        abbrLabel: 'oz to lbs',
        fromUnit: 'Ounces',
        toUnit: 'Pounds',
        sampleInput: 24,
        anchorId: 'pair-oz-to-lbs',
        factorSummary: '16 oz = 1 lb (exact)',
      },
      {
        id: 'st-to-lbs',
        label: 'Stone to Pounds',
        abbrLabel: 'st to lbs',
        fromUnit: 'Stone',
        toUnit: 'Pounds',
        sampleInput: 10,
        anchorId: 'pair-st-to-lbs',
        factorSummary: '1 stone = 14 lbs (exact)',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 50,
        fromUnit: 'Kilograms',
        fromAbbr: 'kg',
        toUnit: 'Pounds',
        toAbbr: 'lbs',
        keywordLabel: '50 kg to lbs',
        workingFormula: '50 ÷ 0.45359237',
      },
      {
        inputValue: 60,
        fromUnit: 'Kilograms',
        fromAbbr: 'kg',
        toUnit: 'Pounds',
        toAbbr: 'lbs',
        keywordLabel: '60 kg to lbs',
        workingFormula: '60 ÷ 0.45359237',
      },
      {
        inputValue: 80,
        fromUnit: 'Kilograms',
        fromAbbr: 'kg',
        toUnit: 'Pounds',
        toAbbr: 'lbs',
        keywordLabel: '80 kg to lbs',
        workingFormula: '80 ÷ 0.45359237',
      },
      {
        inputValue: 100,
        fromUnit: 'Kilograms',
        fromAbbr: 'kg',
        toUnit: 'Pounds',
        toAbbr: 'lbs',
        keywordLabel: '100 kg to lbs',
        workingFormula: '100 ÷ 0.45359237',
      },
      {
        inputValue: 165,
        fromUnit: 'Pounds',
        fromAbbr: 'lbs',
        toUnit: 'Kilograms',
        toAbbr: 'kg',
        keywordLabel: '165 lbs to kg',
        workingFormula: '165 × 0.45359237',
      },
      {
        inputValue: 200,
        fromUnit: 'Pounds',
        fromAbbr: 'lbs',
        toUnit: 'Kilograms',
        toAbbr: 'kg',
        keywordLabel: '200 lbs to kg',
        workingFormula: '200 × 0.45359237',
      },
      {
        inputValue: 500,
        fromUnit: 'Grams',
        fromAbbr: 'g',
        toUnit: 'Pounds',
        toAbbr: 'lbs',
        keywordLabel: '500 grams to pounds',
        workingFormula: '500 ÷ 453.59237',
      },
      {
        inputValue: 100,
        fromUnit: 'Grams',
        fromAbbr: 'g',
        toUnit: 'Ounces',
        toAbbr: 'oz',
        keywordLabel: '100 g to oz',
        workingFormula: '100 ÷ 28.349523',
      },
      {
        inputValue: 24,
        fromUnit: 'Ounces',
        fromAbbr: 'oz',
        toUnit: 'Pounds',
        toAbbr: 'lbs',
        keywordLabel: '24 oz to lbs',
        workingFormula: '24 ÷ 16',
      },
    ],
    unitGuide: [
      {
        unit: 'Kilogram',
        symbol: 'kg',
        system: 'Metric (SI)',
        baseEquivalent: '1 kg (SI base unit)',
        commonUse: 'International body weight scales, Olympic barbell plates, and airline baggage allowances.',
      },
      {
        unit: 'Gram',
        symbol: 'g',
        system: 'Metric (SI)',
        baseEquivalent: '0.001 kg',
        commonUse: 'Digital kitchen food scales, nutrition label serving sizes, and postal letter weights.',
      },
      {
        unit: 'Milligram',
        symbol: 'mg',
        system: 'Metric (SI)',
        baseEquivalent: '0.000001 kg (0.001 g)',
        commonUse: 'Micronutrient supplement labels and analytical laboratory sample weighing.',
      },
      {
        unit: 'Pound',
        symbol: 'lb / lbs',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.45359237 kg (16 oz)',
        commonUse: 'US body weight scales, supermarket meat and produce pricing, and parcel freight rates.',
      },
      {
        unit: 'Ounce (Avoirdupois)',
        symbol: 'oz',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.02834952 kg (28.35 g)',
        commonUse: 'Packaged dry goods, coffee bean bags, and first-class mail weight tiers.',
      },
      {
        unit: 'Stone',
        symbol: 'st',
        system: 'US Customary / Imperial',
        baseEquivalent: '6.35029318 kg (14 lbs)',
        commonUse: 'Everyday personal body weight reporting across the United Kingdom and Ireland.',
      },
      {
        unit: 'Metric Ton (Tonne)',
        symbol: 't',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 kg (≈ 2,204.62 lbs)',
        commonUse: 'International shipping containers, industrial steel orders, and vehicle curb weights.',
      },
      {
        unit: 'US Short Ton',
        symbol: 'ton (US)',
        system: 'US Customary / Imperial',
        baseEquivalent: '907.18474 kg (2,000 lbs)',
        commonUse: 'North American aggregate gravel, landscaping stone, and asphalt tonnage estimates.',
      },
    ],
    comparisonBox: {
      title: 'Weight Ounces (oz) vs. Fluid Ounces (fl oz) & Metric Ton vs. Short Ton',
      unitALabel: 'Avoirdupois Ounce (oz) — Mass',
      unitADetail:
        'Measures dry mass: 1 oz equals exactly 28.349523125 grams (1/16 of a pound). Used for solid food, postal packages, and metals.',
      unitBLabel: 'US Fluid Ounce (fl oz) — Volume',
      unitBDetail:
        'Measures liquid volume: 1 US fl oz equals 29.5735 milliliters (1/8 of a US cup). Converting cups or spoons to grams depends on ingredient density.',
      takeaway:
        'Also note that 1 Metric Ton (1,000 kg = 2,204.62 lbs) is about 10.2% heavier than 1 US Short Ton (2,000 lbs = 907.18 kg).',
      routingLink: {
        label: 'Open Cooking & Ingredient Converter for Cups/Tbsp to Grams',
        href: '/conversions/cooking',
      },
    },
    formulaCard: {
      introText: 'Divide kilograms by 0.45359237 (or multiply by 2.20462262) to get pounds:',
      formulaText: 'Pounds (lbs) = Kilograms (kg) ÷ 0.45359237',
      exampleTitle: 'Convert 60 kg to lbs:',
      exampleSteps: [
        '1 pound = 0.45359237 kilograms (exact international avoirdupois pound)',
        'Pounds = 60 ÷ 0.45359237 (or 60 × 2.20462262)',
        'Result = 132.2774 lbs (about 132.28 lbs)',
      ],
    },
    howItWorks: {
      paragraph:
        'The international avoirdupois pound is defined as exactly 0.45359237 kilograms (453.59237 grams). Every weight unit on this page is normalized to kilograms and converted using factors that follow NIST SP 811.',
      formulaBox: 'Target Mass = Input Value × (From Unit in kg ÷ To Unit in kg)',
      closingNote:
        'Because 1 pound contains exactly 16 ounces, 1 ounce equals 28.349523125 grams and 1 stone equals 14 pounds (6.35029318 kg).',
    },
    faqs: [
      {
        question: 'How many pounds is 80 kg?',
        answer:
          '80 kg is about 176.37 pounds (80 / 0.45359237 = 176.3698 lbs).',
      },
      {
        question: 'How do I convert 165 lbs to kg?',
        answer:
          'Multiply 165 by 0.45359237 to get about 74.84 kilograms (165 × 0.45359237 = 74.8427 kg).',
      },
      {
        question: 'How many pounds is 500 grams?',
        answer:
          '500 grams is about 1.102 pounds, or 17.64 ounces (500 / 453.59237 = 1.102311 lbs).',
      },
      {
        question: 'How many pounds is 24 ounces?',
        answer:
          '24 ounces equals exactly 1.5 pounds because there are 16 ounces in 1 pound (24 / 16 = 1.5).',
      },
      {
        question: 'How much does a gallon of milk weigh in pounds and kilograms?',
        answer:
          '1 US gallon of whole or 2% milk (16 US cups at 244 g/cup, or 1.031 g/mL) weighs 3,904 grams (3.904 kg) or about 8.61 pounds (3,904 / 453.59237 = 8.6068 lbs), slightly heavier than 1 US gallon of water at 8.34 pounds.',
      },
      {
        question: '1 cubic yard is how many tons of gravel or topsoil?',
        answer:
          'Because 1 US short ton equals 2,000 pounds, volume-to-tonnage depends on bulk density: 1 cubic yard (27 ft³) of crushed gravel (~105 lb/ft³) weighs about 2,835 lbs or 1.42 US tons, while screened topsoil (~75–80 lb/ft³) weighs about 1.0 to 1.1 US tons.',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Kilograms to Pounds Converter (kg to lbs) | Weight | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert kilograms to pounds (kg to lbs), pounds to kilograms, grams to pounds, and ounces using NIST SP 811 factors, quick tables, and worked formulas.',
      beforeH1: 'Unit Converter',
      afterH1: 'Kilograms to Pounds and Weight Converter',
      keywordsPlaced: [
        { keyword: 'kilograms to pounds / kg to lbs', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'pounds to kilograms / lbs to kg', zone: 'Meta / Pair Card 2' },
        { keyword: 'grams to pounds / g to lbs', zone: 'Meta / Pair Card 3' },
        { keyword: 'grams to ounces / g to oz', zone: 'Pair Card 4' },
        { keyword: 'ounces to pounds / oz to lbs', zone: 'Pair Card 5' },
        { keyword: 'stone to pounds / st to lbs', zone: 'Pair Card 6' },
        { keyword: '60 kg to lbs', zone: 'Top 1-Line Answer / Common-Values Table / Formula Card' },
        { keyword: '50kg to lbs', zone: 'Common-Values Table' },
        { keyword: '80kg to lbs', zone: 'Common-Values Table / FAQ 1' },
        { keyword: '100kg to lbs', zone: 'Common-Values Table' },
        { keyword: '165 lbs to kg', zone: 'Common-Values Table / FAQ 2' },
        { keyword: '200 lbs to kg', zone: 'Common-Values Table' },
        { keyword: '500 grams to pounds', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '100g to oz', zone: 'Common-Values Table' },
        { keyword: '24 oz to lbs', zone: 'Common-Values Table / FAQ 4' },
        { keyword: 'how much does milk weigh a gallon / gallon of milk weight', zone: 'FAQ 5 (with Recipe Converter routing)' },
        { keyword: '1 cubic yard is how many tons / cubic yard to ton conversion', zone: 'FAQ 6 / Unit Guide (US Short Ton)' },
      ],
      keywordsSkipped: [
        { keyword: '110 pounds en kilos / 180lbs en kg / 190 libre in kg', reason: 'Flagged non-English query' },
        { keyword: 'punds / 6 0unces in grams', reason: 'Misspelling / typo — never placed in visible text' },
        { keyword: 'cup gm / 32 oz to cups', reason: 'Belongs on Cooking & Ingredient Converter (/conversions/cooking)' },
      ],
      calculationsVerified: [
        { label: '50 kg to lbs', working: '50 / 0.45359237', result: '110.2311 lbs' },
        { label: '60 kg to lbs', working: '60 / 0.45359237', result: '132.2774 lbs' },
        { label: '80 kg to lbs', working: '80 / 0.45359237', result: '176.3698 lbs' },
        { label: '100 kg to lbs', working: '100 / 0.45359237', result: '220.4623 lbs' },
        { label: '165 lbs to kg', working: '165 × 0.45359237', result: '74.8427 kg' },
        { label: '200 lbs to kg', working: '200 × 0.45359237', result: '90.7185 kg' },
        { label: '500 g to lbs', working: '500 / 453.59237', result: '1.1023 lbs' },
        { label: '100 g to oz', working: '100 / 28.349523125', result: '3.5274 oz' },
        { label: '24 oz to lbs', working: '24 / 16', result: '1.5 lbs' },
        { label: '1 US gal milk to lbs', working: '(16 cups × 244 g) / 453.59237', result: '8.6068 lbs (3.904 kg)' },
      ],
    },
  },

  temperature: {
    slug: 'temperature',
    canonicalPath: '/conversions/temperature',
    categoryLabel: 'Temperature',
    shortLabel: 'Temperature',
    metaTitle: 'Celsius to Fahrenheit Converter (°C to °F) | Temp | SolveIt',
    metaDescription:
      'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius (°F to °C), and Kelvin with exact NIST SP 811 offset formulas, oven tables, and worked steps.',
    ogTitle: 'Celsius to Fahrenheit Converter (°C to °F) | Temp | SolveIt',
    ogDescription:
      'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius (°F to °C), and Kelvin with exact NIST SP 811 offset formulas, oven tables, and worked steps.',
    h1: 'Celsius to Fahrenheit and Temperature',
    h1Highlight: 'Converter',
    subtitle:
      'Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K) using exact thermodynamic offset equations that follow NIST SP 811.',
    topQuestionBanner: {
      question: 'What is 200 °C in Fahrenheit?',
      oneLineAnswer:
        '200 °C equals exactly 392 °F ((200 × 1.8) + 32 = 392 °F).',
    },
    defaultFromUnit: 'Celsius',
    defaultToUnit: 'Fahrenheit',
    defaultInputValue: '200',
    baseUnitLabel: 'Celsius (°C)',
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    toBase: (v, u) => {
      if (u === 'Celsius') return v;
      if (u === 'Fahrenheit') return ((v - 32) * 5) / 9;
      if (u === 'Kelvin') return v - 273.15;
      return v;
    },
    fromBase: (b, u) => {
      if (u === 'Celsius') return b;
      if (u === 'Fahrenheit') return (b * 9) / 5 + 32;
      if (u === 'Kelvin') return b + 273.15;
      return b;
    },
    popularPairs: [
      {
        id: 'c-to-f',
        label: 'Celsius to Fahrenheit',
        abbrLabel: '°C to °F',
        fromUnit: 'Celsius',
        toUnit: 'Fahrenheit',
        sampleInput: 200,
        anchorId: 'pair-c-to-f',
        factorSummary: '°F = (°C × 1.8) + 32',
      },
      {
        id: 'f-to-c',
        label: 'Fahrenheit to Celsius',
        abbrLabel: '°F to °C',
        fromUnit: 'Fahrenheit',
        toUnit: 'Celsius',
        sampleInput: 60,
        anchorId: 'pair-f-to-c',
        factorSummary: '°C = (°F − 32) ÷ 1.8',
      },
      {
        id: 'c-to-k',
        label: 'Celsius to Kelvin',
        abbrLabel: '°C to K',
        fromUnit: 'Celsius',
        toUnit: 'Kelvin',
        sampleInput: 25,
        anchorId: 'pair-c-to-k',
        factorSummary: 'K = °C + 273.15',
      },
      {
        id: 'k-to-c',
        label: 'Kelvin to Celsius',
        abbrLabel: 'K to °C',
        fromUnit: 'Kelvin',
        toUnit: 'Celsius',
        sampleInput: 300,
        anchorId: 'pair-k-to-c',
        factorSummary: '°C = K − 273.15',
      },
      {
        id: 'f-to-k',
        label: 'Fahrenheit to Kelvin',
        abbrLabel: '°F to K',
        fromUnit: 'Fahrenheit',
        toUnit: 'Kelvin',
        sampleInput: 75,
        anchorId: 'pair-f-to-k',
        factorSummary: 'K = (°F − 32) ÷ 1.8 + 273.15',
      },
      {
        id: 'k-to-f',
        label: 'Kelvin to Fahrenheit',
        abbrLabel: 'K to °F',
        fromUnit: 'Kelvin',
        toUnit: 'Fahrenheit',
        sampleInput: 273.15,
        anchorId: 'pair-k-to-f',
        factorSummary: '°F = (K − 273.15) × 1.8 + 32',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 15,
        fromUnit: 'Celsius',
        fromAbbr: '°C',
        toUnit: 'Fahrenheit',
        toAbbr: '°F',
        keywordLabel: '15 c to f',
        workingFormula: '(15 × 1.8) + 32',
      },
      {
        inputValue: 23,
        fromUnit: 'Celsius',
        fromAbbr: '°C',
        toUnit: 'Fahrenheit',
        toAbbr: '°F',
        keywordLabel: '23 c to f',
        workingFormula: '(23 × 1.8) + 32',
      },
      {
        inputValue: 24,
        fromUnit: 'Celsius',
        fromAbbr: '°C',
        toUnit: 'Fahrenheit',
        toAbbr: '°F',
        keywordLabel: '24 celsius to fahrenheit',
        workingFormula: '(24 × 1.8) + 32',
      },
      {
        inputValue: 37,
        fromUnit: 'Celsius',
        fromAbbr: '°C',
        toUnit: 'Fahrenheit',
        toAbbr: '°F',
        keywordLabel: '37 c to fahrenheit',
        workingFormula: '(37 × 1.8) + 32',
      },
      {
        inputValue: 190,
        fromUnit: 'Celsius',
        fromAbbr: '°C',
        toUnit: 'Fahrenheit',
        toAbbr: '°F',
        keywordLabel: '190 c to f',
        workingFormula: '(190 × 1.8) + 32',
      },
      {
        inputValue: 200,
        fromUnit: 'Celsius',
        fromAbbr: '°C',
        toUnit: 'Fahrenheit',
        toAbbr: '°F',
        keywordLabel: '200 c to f',
        workingFormula: '(200 × 1.8) + 32',
      },
      {
        inputValue: 50,
        fromUnit: 'Fahrenheit',
        fromAbbr: '°F',
        toUnit: 'Celsius',
        toAbbr: '°C',
        keywordLabel: '50 f to c',
        workingFormula: '(50 − 32) ÷ 1.8',
      },
      {
        inputValue: 60,
        fromUnit: 'Fahrenheit',
        fromAbbr: '°F',
        toUnit: 'Celsius',
        toAbbr: '°C',
        keywordLabel: '60 f to c',
        workingFormula: '(60 − 32) ÷ 1.8',
      },
      {
        inputValue: 75,
        fromUnit: 'Fahrenheit',
        fromAbbr: '°F',
        toUnit: 'Celsius',
        toAbbr: '°C',
        keywordLabel: '75 f to c',
        workingFormula: '(75 − 32) ÷ 1.8',
      },
    ],
    unitGuide: [
      {
        unit: 'Celsius',
        symbol: '°C',
        system: 'Metric (SI)',
        baseEquivalent: '0 °C = 273.15 K (water freezes)',
        commonUse: 'International weather forecasts, metric recipe oven settings (such as 190 °C or 200 °C), and room thermometers.',
      },
      {
        unit: 'Fahrenheit',
        symbol: '°F',
        system: 'US Customary / Imperial',
        baseEquivalent: '32 °F = 0 °C (water freezes)',
        commonUse: 'United States weather reports, home HVAC thermostats (such as 60 °F to 75 °F), and US baking recipes.',
      },
      {
        unit: 'Kelvin',
        symbol: 'K',
        system: 'International / Scientific',
        baseEquivalent: '0 K = −273.15 °C (absolute zero)',
        commonUse: 'Thermodynamic gas law equations, cryogenic physics, and LED lighting color temperature ratings.',
      },
    ],
    comparisonBox: {
      title: 'Why Celsius (°C) vs. Fahrenheit (°F) Uses Both 1.8 and +32',
      unitALabel: 'Degree Interval Size (9/5 = 1.8)',
      unitADetail:
        'Between the freezing and boiling points of water at 1 atm, Celsius spans 100 degrees (0 °C to 100 °C) while Fahrenheit spans 180 degrees (32 °F to 212 °F), making 1 °C interval equal to 1.8 °F.',
      unitBLabel: 'Zero-Point Offset (+32 & +273.15)',
      unitBDetail:
        'Because 0 °C starts at 32 °F, you must add 32 after multiplying °C by 1.8 (or subtract 32 before dividing °F by 1.8). The two scales cross at exactly −40°.',
      takeaway:
        'Quick mental check: 0 °C = 32 °F, 20 °C = 68 °F, 37 °C = 98.6 °F, 100 °C = 212 °F, and 200 °C = 392 °F.',
    },
    formulaCard: {
      introText: 'Multiply the Celsius temperature by 1.8 (9/5) and add 32:',
      formulaText: '°F = (°C × 1.8) + 32   |   °C = (°F − 32) ÷ 1.8',
      exampleTitle: 'Convert 200 °C to Fahrenheit:',
      exampleSteps: [
        'Multiply Celsius by 1.8: 200 × 1.8 = 360',
        'Add 32 for the zero-point offset: 360 + 32 = 392',
        'Result = 392 °F',
      ],
    },
    howItWorks: {
      paragraph:
        'Unlike length or weight units that share a zero point, temperature scales have different starting points. This converter applies the exact thermodynamic offset equations defined in NIST SP 811.',
      formulaBox: '°F = (°C × 9/5) + 32   |   K = °C + 273.15',
      closingNote:
        'Values below absolute zero (0 K, −273.15 °C, or −459.67 °F) trigger a physical boundary warning.',
    },
    faqs: [
      {
        question: 'What is 200 °C in Fahrenheit?',
        answer:
          '200 °C is exactly 392 °F ((200 × 1.8) + 32 = 392), a common baking temperature.',
      },
      {
        question: 'What is 24 Celsius in Fahrenheit?',
        answer:
          '24 °C equals 75.2 °F ((24 × 1.8) + 32 = 75.2), which is a warm indoor temperature.',
      },
      {
        question: 'What is 60 °F in Celsius?',
        answer:
          '60 °F is about 15.56 °C ((60 − 32) / 1.8 = 15.5556 °C).',
      },
      {
        question: 'What is 37 °C in Fahrenheit?',
        answer:
          '37 °C equals exactly 98.6 °F ((37 × 1.8) + 32 = 98.6).',
      },
      {
        question: 'How do you convert conventional oven temperature to an air fryer?',
        answer:
          'For oven to air fryer conversion, reduce the conventional oven temperature by 25 °F (about 15 °C) and cut cook time by roughly 20%. For example, a 400 °F (204 °C) oven recipe converts to 375 °F (190 °C) in an air fryer, and 350 °F (177 °C) converts to 325 °F (163 °C).',
      },
      {
        question: 'What is the safe internal temperature for ham in Fahrenheit and Celsius?',
        answer:
          'According to USDA food safety guidelines, pre-cooked ham should be reheated to an internal temperature of 140 °F (60 °C), while fresh uncooked ham requires 145 °F (62.8 °C) followed by a 3-minute rest.',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Celsius to Fahrenheit Converter (°C to °F) | Temp | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius (°F to °C), and Kelvin with exact NIST SP 811 offset formulas, oven tables, and worked steps.',
      beforeH1: 'Unit Converter',
      afterH1: 'Celsius to Fahrenheit and Temperature Converter',
      keywordsPlaced: [
        { keyword: 'celsius to fahrenheit / c to f', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'fahrenheit to celsius / f to c', zone: 'Meta / Pair Card 2' },
        { keyword: 'celsius to kelvin / c to k', zone: 'Pair Card 3' },
        { keyword: 'kelvin to celsius / k to c', zone: 'Pair Card 4' },
        { keyword: '200 c to f', zone: 'Top 1-Line Answer / Common-Values Table / FAQ 1' },
        { keyword: '15 c to f', zone: 'Common-Values Table' },
        { keyword: '23 c to f', zone: 'Common-Values Table' },
        { keyword: '24 celsius to fahrenheit', zone: 'Common-Values Table / FAQ 2' },
        { keyword: '37 c to fahrenheit', zone: 'Common-Values Table / FAQ 4' },
        { keyword: '190 c to f', zone: 'Common-Values Table / Unit Guide (°C)' },
        { keyword: '50 f to c', zone: 'Common-Values Table' },
        { keyword: '60 f to c', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '75 f to c', zone: 'Common-Values Table / Unit Guide (°F)' },
        { keyword: 'oven to air fryer conversion / convert oven to air fryer', zone: 'FAQ 5' },
        { keyword: 'ham internal temperature (140 °F / 60 °C)', zone: 'FAQ 6' },
      ],
      keywordsSkipped: [
        { keyword: 'celcius / 200 celcius to fahrenheit / farenheit', reason: 'Misspelling — never placed in visible text' },
        { keyword: 'grados centigrados a fahrenheit', reason: 'Flagged non-English query' },
      ],
      calculationsVerified: [
        { label: '15 °C to °F', working: '(15 × 1.8) + 32', result: '59 °F' },
        { label: '23 °C to °F', working: '(23 × 1.8) + 32', result: '73.4 °F' },
        { label: '24 °C to °F', working: '(24 × 1.8) + 32', result: '75.2 °F' },
        { label: '37 °C to °F', working: '(37 × 1.8) + 32', result: '98.6 °F' },
        { label: '190 °C to °F', working: '(190 × 1.8) + 32', result: '374 °F' },
        { label: '200 °C to °F', working: '(200 × 1.8) + 32', result: '392 °F' },
        { label: '50 °F to °C', working: '(50 − 32) / 1.8', result: '10 °C' },
        { label: '60 °F to °C', working: '(60 − 32) / 1.8', result: '15.5556 °C' },
        { label: '75 °F to °C', working: '(75 − 32) / 1.8', result: '23.8889 °C' },
        { label: '140 °F ham temp to °C', working: '(140 − 32) / 1.8', result: '60 °C' },
      ],
    },
  },

  volume: {
    slug: 'volume',
    canonicalPath: '/conversions/volume',
    categoryLabel: 'Volume & Capacity',
    shortLabel: 'Volume',
    metaTitle: 'Milliliters to Ounces Converter (mL to fl oz) | Volume | SolveIt',
    metaDescription:
      'Convert milliliters to fluid ounces (mL to fl oz), pints to quarts, quarts to gallons, and liters to gallons with NIST SP 811 factors and quick tables.',
    ogTitle: 'Milliliters to Ounces Converter (mL to fl oz) | Volume | SolveIt',
    ogDescription:
      'Convert milliliters to fluid ounces (mL to fl oz), pints to quarts, quarts to gallons, and liters to gallons with NIST SP 811 factors and quick tables.',
    h1: 'Milliliters to Fluid Ounces and Volume',
    h1Highlight: 'Converter',
    subtitle:
      'Convert liquid and cubic volume between milliliters (mL), liters (L), US fluid ounces (fl oz), pints, quarts, gallons, cubic feet, and cubic yards using conversion factors that follow NIST SP 811.',
    topQuestionBanner: {
      question: 'How many pints are in a quart, and how many ounces is 750 mL?',
      oneLineAnswer:
        'There are exactly 2 US pints in 1 US quart (4 quarts in a gallon), and 750 mL is about 25.36 US fluid ounces (750 ÷ 29.57353).',
    },
    defaultFromUnit: 'Milliliters',
    defaultToUnit: 'US Fluid Ounces',
    defaultInputValue: '750',
    baseUnitLabel: 'Liters (L)',
    units: [
      'Milliliters',
      'Liters',
      'US Fluid Ounces',
      'US Pints',
      'US Quarts',
      'US Gallons',
      'Cubic Meters',
      'Cubic Feet',
      'Cubic Yards',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        Liters: 1,
        Milliliters: 0.001,
        'US Gallons': 3.785411784,
        'US Quarts': 0.946352946,
        'US Pints': 0.473176473,
        'US Fluid Ounces': 0.0295735295625,
        'Cubic Meters': 1000,
        'Cubic Feet': 28.316846592,
        'Cubic Yards': 764.554857984,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        Liters: 1,
        Milliliters: 1000,
        'US Gallons': 1 / 3.785411784,
        'US Quarts': 1 / 0.946352946,
        'US Pints': 1 / 0.473176473,
        'US Fluid Ounces': 1 / 0.0295735295625,
        'Cubic Meters': 0.001,
        'Cubic Feet': 1 / 28.316846592,
        'Cubic Yards': 1 / 764.554857984,
      };
      return b * (factors[u] ?? 1);
    },
    routingNotice: {
      text: 'Need kitchen cups, tablespoons, or teaspoons? Cup, tablespoon, and teaspoon conversions live on our Cooking Measurement Converter page.',
      linkLabel: 'Go to Cooking Converter (/conversions/cooking)',
      linkHref: '/conversions/cooking',
    },
    popularPairs: [
      {
        id: 'ml-to-floz',
        label: 'Milliliters to US Fluid Ounces',
        abbrLabel: 'mL to fl oz',
        fromUnit: 'Milliliters',
        toUnit: 'US Fluid Ounces',
        sampleInput: 750,
        anchorId: 'pair-ml-to-floz',
        factorSummary: '1 fl oz = 29.57353 mL',
      },
      {
        id: 'floz-to-ml',
        label: 'US Fluid Ounces to Milliliters',
        abbrLabel: 'fl oz to mL',
        fromUnit: 'US Fluid Ounces',
        toUnit: 'Milliliters',
        sampleInput: 16,
        anchorId: 'pair-floz-to-ml',
        factorSummary: '1 fl oz × 29.57353 = mL',
      },
      {
        id: 'pt-to-qt',
        label: 'US Pints to US Quarts',
        abbrLabel: 'pt to qt',
        fromUnit: 'US Pints',
        toUnit: 'US Quarts',
        sampleInput: 2,
        anchorId: 'pair-pt-to-qt',
        factorSummary: '2 pt = 1 qt (exact)',
      },
      {
        id: 'qt-to-gal',
        label: 'US Quarts to US Gallons',
        abbrLabel: 'qt to gal',
        fromUnit: 'US Quarts',
        toUnit: 'US Gallons',
        sampleInput: 12,
        anchorId: 'pair-qt-to-gal',
        factorSummary: '4 qt = 1 gal (exact)',
      },
      {
        id: 'gal-to-l',
        label: 'US Gallons to Liters',
        abbrLabel: 'gal to L',
        fromUnit: 'US Gallons',
        toUnit: 'Liters',
        sampleInput: 1,
        anchorId: 'pair-gal-to-l',
        factorSummary: '1 US gal = 3.78541 L',
      },
      {
        id: 'gal-to-floz',
        label: 'US Gallons to Fluid Ounces',
        abbrLabel: 'gal to fl oz',
        fromUnit: 'US Gallons',
        toUnit: 'US Fluid Ounces',
        sampleInput: 1,
        anchorId: 'pair-gal-to-floz',
        factorSummary: '1 US gal = 128 fl oz',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 30,
        fromUnit: 'Milliliters',
        fromAbbr: 'mL',
        toUnit: 'US Fluid Ounces',
        toAbbr: 'fl oz',
        keywordLabel: '30 ml to oz',
        workingFormula: '30 ÷ 29.57353',
      },
      {
        inputValue: 50,
        fromUnit: 'Milliliters',
        fromAbbr: 'mL',
        toUnit: 'US Fluid Ounces',
        toAbbr: 'fl oz',
        keywordLabel: '50 ml to oz',
        workingFormula: '50 ÷ 29.57353',
      },
      {
        inputValue: 200,
        fromUnit: 'Milliliters',
        fromAbbr: 'mL',
        toUnit: 'US Fluid Ounces',
        toAbbr: 'fl oz',
        keywordLabel: '200 ml to oz',
        workingFormula: '200 ÷ 29.57353',
      },
      {
        inputValue: 500,
        fromUnit: 'Milliliters',
        fromAbbr: 'mL',
        toUnit: 'US Fluid Ounces',
        toAbbr: 'fl oz',
        keywordLabel: '500 ml to oz',
        workingFormula: '500 ÷ 29.57353',
      },
      {
        inputValue: 750,
        fromUnit: 'Milliliters',
        fromAbbr: 'mL',
        toUnit: 'US Fluid Ounces',
        toAbbr: 'fl oz',
        keywordLabel: '750 ml to oz',
        workingFormula: '750 ÷ 29.57353',
      },
      {
        inputValue: 16,
        fromUnit: 'US Fluid Ounces',
        fromAbbr: 'fl oz',
        toUnit: 'Milliliters',
        toAbbr: 'mL',
        keywordLabel: '16 oz to ml',
        workingFormula: '16 × 29.57353',
      },
      {
        inputValue: 32,
        fromUnit: 'US Fluid Ounces',
        fromAbbr: 'fl oz',
        toUnit: 'Milliliters',
        toAbbr: 'mL',
        keywordLabel: '32 oz to ml',
        workingFormula: '32 × 29.57353',
      },
      {
        inputValue: 12,
        fromUnit: 'US Quarts',
        fromAbbr: 'qt',
        toUnit: 'US Gallons',
        toAbbr: 'gal',
        keywordLabel: '12 quarts to gallons',
        workingFormula: '12 ÷ 4',
      },
      {
        inputValue: 1,
        fromUnit: 'US Gallons',
        fromAbbr: 'gal',
        toUnit: 'US Fluid Ounces',
        toAbbr: 'fl oz',
        keywordLabel: '1 gallon to oz',
        workingFormula: '1 × 128',
      },
    ],
    unitGuide: [
      {
        unit: 'Milliliter',
        symbol: 'mL',
        system: 'Metric (SI)',
        baseEquivalent: '0.001 L (1 cm³)',
        commonUse: 'Beverage and wine bottle capacities (such as 500 mL or 750 mL), travel toiletries (50 mL), and liquid medicine droppers.',
      },
      {
        unit: 'Liter',
        symbol: 'L',
        system: 'Metric (SI)',
        baseEquivalent: '1 L (0.001 m³)',
        commonUse: 'Soda and water bottles, automotive engine displacement ratings, and backpack hydration bladders.',
      },
      {
        unit: 'US Fluid Ounce',
        symbol: 'fl oz',
        system: 'US Customary / Imperial',
        baseEquivalent: '29.57353 mL (1/128 gal)',
        commonUse: 'Single-serve drink cans (12 fl oz), water tumblers (16 fl oz or 32 fl oz), and bar jiggers.',
      },
      {
        unit: 'US Liquid Pint',
        symbol: 'pt',
        system: 'US Customary / Imperial',
        baseEquivalent: '473.176 mL (16 fl oz)',
        commonUse: 'Draft beer glasses, ice cream cartons, and fresh berry containers.',
      },
      {
        unit: 'US Liquid Quart',
        symbol: 'qt',
        system: 'US Customary / Imperial',
        baseEquivalent: '946.353 mL (2 pt / 32 fl oz)',
        commonUse: 'Automotive motor oil bottles, kitchen stockpots, and liquid broth cartons.',
      },
      {
        unit: 'US Liquid Gallon',
        symbol: 'gal',
        system: 'US Customary / Imperial',
        baseEquivalent: '3.78541 L (4 qt / 128 fl oz)',
        commonUse: 'US fuel pumps, grocery milk jugs, aquarium tank ratings, and interior latex paint cans.',
      },
      {
        unit: 'Cubic Meter',
        symbol: 'm³',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 L',
        commonUse: 'Municipal water utility billing, swimming pool volumes, and ocean freight container volume.',
      },
      {
        unit: 'Cubic Foot',
        symbol: 'ft³',
        system: 'US Customary / Imperial',
        baseEquivalent: '28.31685 L (1,728 in³)',
        commonUse: 'Refrigerator and freezer interior capacity, potting soil bags, and natural gas meters.',
      },
      {
        unit: 'Cubic Yard',
        symbol: 'yd³',
        system: 'US Customary / Imperial',
        baseEquivalent: '764.55486 L (27 ft³)',
        commonUse: 'Ordering ready-mix concrete, landscape mulch, topsoil, and crushed gravel.',
      },
    ],
    comparisonBox: {
      title: 'US Liquid Gallon (3.785 L) vs. UK Imperial Gallon (4.546 L)',
      unitALabel: 'US Liquid Gallon (128 US fl oz)',
      unitADetail:
        'Defined as exactly 231 cubic inches, or 3.785411784 liters. One US fluid ounce equals 29.57353 mL.',
      unitBLabel: 'UK Imperial Gallon (160 Imp fl oz)',
      unitBDetail:
        'Defined as exactly 4.54609 liters (about 1.20095 US gallons). One UK imperial fluid ounce equals 28.41306 mL.',
      takeaway:
        'A UK imperial gallon is 20.1% larger than a US gallon. For kitchen cups, tablespoons, and teaspoons, visit our Cooking Measurement Converter.',
      routingLink: {
        label: 'Open Cooking Measurement Converter (/conversions/cooking)',
        href: '/conversions/cooking',
      },
    },
    formulaCard: {
      introText: 'Divide milliliters by 29.5735296 to get US fluid ounces, or multiply gallons by 3.785411784 for liters:',
      formulaText: 'US fl oz = Milliliters (mL) ÷ 29.57353   |   1 gal = 4 qt = 8 pt = 128 fl oz',
      exampleTitle: 'Convert 750 mL to US Fluid Ounces:',
      exampleSteps: [
        '1 US fluid ounce = 29.5735296 milliliters (NIST SP 811)',
        'Fluid Ounces = 750 ÷ 29.5735296',
        'Result = 25.3605 US fl oz (about 25.36 fl oz)',
      ],
    },
    howItWorks: {
      paragraph:
        'All liquid and cubic volume measurements are normalized to liters (1 L = 1,000 mL = 0.001 m³) and converted using exact factors that follow NIST SP 811.',
      formulaBox: 'Target Volume = Input Value × (From Unit in Liters ÷ To Unit in Liters)',
      closingNote:
        'Cup, tablespoon, and teaspoon conversions are placed exclusively on the Cooking Measurement Converter (/conversions/cooking).',
    },
    faqs: [
      {
        question: 'How many ounces is 750 mL?',
        answer:
          '750 mL is about 25.36 US fluid ounces (750 / 29.57353 = 25.3605 fl oz), the standard volume of a wine or spirits bottle.',
      },
      {
        question: 'How many pints are in a quart?',
        answer:
          'There are exactly 2 US pints in 1 US quart (946.35 mL / 473.18 mL = 2), or 32 US fluid ounces per quart.',
      },
      {
        question: 'How many quarts are in a gallon?',
        answer:
          'There are 4 US quarts in 1 US gallon, so 12 quarts equals 3 gallons (12 / 4 = 3).',
      },
      {
        question: 'How many fluid ounces is 500 mL?',
        answer:
          '500 mL is about 16.91 US fluid ounces (500 / 29.57353 = 16.907 fl oz), the size of a standard single-serve water bottle.',
      },
      {
        question: 'How many cubic yards is 1,000 square feet?',
        answer:
          'Multiply 1,000 sq ft by the depth in feet and divide by 27 (ft³ per yd³): at 3 inches (0.25 ft) mulch depth, 1,000 sq ft is 9.26 cubic yards (250 / 27); at 4 inches (0.333 ft) concrete slab depth, 1,000 sq ft is 12.35 cubic yards (333.33 / 27).',
      },
      {
        question: 'How do you convert cubic feet to US gallons for a pool or pipe?',
        answer:
          'Multiply cubic feet by 7.48052 because 1 cubic foot (1,728 in³) holds 7.48052 US gallons (231 in³ per gallon). For a round pipe, US Gallons = 0.0408 × (Inner Diameter in inches)² × Length in feet.',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Milliliters to Ounces Converter (mL to fl oz) | Volume | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert milliliters to fluid ounces (mL to fl oz), pints to quarts, quarts to gallons, and liters to gallons with NIST SP 811 factors and quick tables.',
      beforeH1: 'Unit Converter',
      afterH1: 'Milliliters to Fluid Ounces and Volume Converter',
      keywordsPlaced: [
        { keyword: 'milliliters to fluid ounces / ml to oz', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'fluid ounces to milliliters / oz to ml', zone: 'Pair Card 2' },
        { keyword: 'pints in a quart / pt to qt', zone: 'Meta / Top 1-Line Answer / Pair Card 3 / FAQ 2' },
        { keyword: 'quarts in a gallon / qt to gal', zone: 'Meta / Pair Card 4 / FAQ 3' },
        { keyword: 'gallons to liters / gal to L', zone: 'Meta / Pair Card 5' },
        { keyword: '1 gallon to oz / gal to fl oz', zone: 'Pair Card 6 / Common-Values Table' },
        { keyword: '30 ml to oz', zone: 'Common-Values Table' },
        { keyword: '50 ml to oz', zone: 'Common-Values Table / Unit Guide (mL)' },
        { keyword: '200 ml to oz', zone: 'Common-Values Table' },
        { keyword: '500 ml to oz', zone: 'Common-Values Table / FAQ 4' },
        { keyword: '750 ml to oz', zone: 'Top 1-Line Answer / Common-Values Table / Formula Card / FAQ 1' },
        { keyword: '16 oz to ml', zone: 'Common-Values Table' },
        { keyword: '32 oz to ml', zone: 'Common-Values Table' },
        { keyword: '12 quarts to gallons', zone: 'Common-Values Table / FAQ 3' },
        { keyword: 'how many cubic yard is 1000 sq ft / sf to cubic yards', zone: 'FAQ 5' },
        { keyword: 'pool gallon calculator / pipe volume calculator gallons', zone: 'FAQ 6' },
      ],
      keywordsSkipped: [
        { keyword: '32 oz to cups / 8 oz to cups / cup to tbsp', reason: 'Cup, tablespoon, and teaspoon queries belong on /conversions/cooking' },
        { keyword: 'cup gm / ml as grams', reason: 'Volume-to-mass density queries belong on /recipe-converter' },
        { keyword: '24 0z in ml / 16 oz to mils', reason: 'Typo ("0z" / "mils") — covered cleanly as 16 oz to mL' },
        { keyword: '130 pints (beer cases)', reason: 'Off-topic beverage packaging query' },
      ],
      calculationsVerified: [
        { label: '30 mL to fl oz', working: '30 / 29.5735296', result: '1.0144 fl oz' },
        { label: '50 mL to fl oz', working: '50 / 29.5735296', result: '1.6907 fl oz' },
        { label: '200 mL to fl oz', working: '200 / 29.5735296', result: '6.7628 fl oz' },
        { label: '500 mL to fl oz', working: '500 / 29.5735296', result: '16.9070 fl oz' },
        { label: '750 mL to fl oz', working: '750 / 29.5735296', result: '25.3605 fl oz' },
        { label: '16 fl oz to mL', working: '16 × 29.5735296', result: '473.1765 mL' },
        { label: '32 fl oz to mL', working: '32 × 29.5735296', result: '946.3529 mL' },
        { label: '12 qt to gal', working: '12 / 4', result: '3 gal' },
        { label: '1 gal to fl oz', working: '1 × 128', result: '128 fl oz' },
        { label: '1,000 sq ft @ 4" to yd³', working: '(1,000 × 4/12) / 27', result: '12.3457 yd³' },
        { label: '1 ft³ to US gal', working: '1,728 / 231', result: '7.48052 gal' },
      ],
    },
  },

  cooking: {
    slug: 'cooking',
    canonicalPath: '/conversions/cooking',
    categoryLabel: 'Cooking & Kitchen Volume',
    shortLabel: 'Cooking',
    metaTitle: 'Tablespoons to Cups Converter (tbsp to cup) | Cooking | SolveIt',
    metaDescription:
      'Convert tablespoons to cups (tbsp to cup), teaspoons to tablespoons (tsp to tbsp), fluid ounces to cups, and quarts to cups with NIST SP 811 kitchen tables.',
    ogTitle: 'Tablespoons to Cups Converter (tbsp to cup) | Cooking | SolveIt',
    ogDescription:
      'Convert tablespoons to cups (tbsp to cup), teaspoons to tablespoons (tsp to tbsp), fluid ounces to cups, and quarts to cups with NIST SP 811 kitchen tables.',
    h1: 'Tablespoons to Cups and Cooking',
    h1Highlight: 'Converter',
    subtitle:
      'Convert kitchen recipe measurements between US cups, tablespoons (tbsp), teaspoons (tsp), fluid ounces (fl oz), pints, quarts, and milliliters using exact NIST SP 811 factors.',
    topQuestionBanner: {
      question: 'How many teaspoons are in a tablespoon, and how many tablespoons are in 1/2 cup?',
      oneLineAnswer:
        'There are 3 teaspoons in 1 tablespoon (15 mL) and 8 tablespoons in 1/2 US cup (16 tbsp = 1 cup).',
    },
    defaultFromUnit: 'US Tablespoons',
    defaultToUnit: 'US Cups',
    defaultInputValue: '8',
    baseUnitLabel: 'Milliliters (mL)',
    units: [
      'US Tablespoons',
      'US Cups',
      'US Teaspoons',
      'US Fluid Ounces',
      'Milliliters',
      'US Pints',
      'US Quarts',
      'Liters',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        Milliliters: 1,
        Liters: 1000,
        'US Cups': 236.5882365,
        'US Fluid Ounces': 29.5735295625,
        'US Tablespoons': 14.78676478125,
        'US Teaspoons': 4.92892159375,
        'US Pints': 473.176473,
        'US Quarts': 946.352946,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        Milliliters: 1,
        Liters: 0.001,
        'US Cups': 1 / 236.5882365,
        'US Fluid Ounces': 1 / 29.5735295625,
        'US Tablespoons': 1 / 14.78676478125,
        'US Teaspoons': 1 / 4.92892159375,
        'US Pints': 1 / 473.176473,
        'US Quarts': 1 / 946.352946,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'tbsp-to-cup',
        label: 'Tablespoons to Cups',
        abbrLabel: 'tbsp to cup',
        fromUnit: 'US Tablespoons',
        toUnit: 'US Cups',
        sampleInput: 8,
        anchorId: 'pair-tbsp-to-cup',
        factorSummary: '16 tbsp = 1 cup (exact)',
      },
      {
        id: 'tsp-to-tbsp',
        label: 'Teaspoons to Tablespoons',
        abbrLabel: 'tsp to tbsp',
        fromUnit: 'US Teaspoons',
        toUnit: 'US Tablespoons',
        sampleInput: 3,
        anchorId: 'pair-tsp-to-tbsp',
        factorSummary: '3 tsp = 1 tbsp (exact)',
      },
      {
        id: 'cup-to-tbsp',
        label: 'Cups to Tablespoons',
        abbrLabel: 'cup to tbsp',
        fromUnit: 'US Cups',
        toUnit: 'US Tablespoons',
        sampleInput: 0.25,
        anchorId: 'pair-cup-to-tbsp',
        factorSummary: '1 cup = 16 tbsp (exact)',
      },
      {
        id: 'floz-to-cup',
        label: 'Fluid Ounces to Cups',
        abbrLabel: 'fl oz to cup',
        fromUnit: 'US Fluid Ounces',
        toUnit: 'US Cups',
        sampleInput: 16,
        anchorId: 'pair-floz-to-cup',
        factorSummary: '8 fl oz = 1 cup (exact)',
      },
      {
        id: 'qt-to-cup',
        label: 'Quarts to Cups',
        abbrLabel: 'qt to cup',
        fromUnit: 'US Quarts',
        toUnit: 'US Cups',
        sampleInput: 1,
        anchorId: 'pair-qt-to-cup',
        factorSummary: '1 qt = 4 cups (exact)',
      },
      {
        id: 'pt-to-cup',
        label: 'Pints to Cups',
        abbrLabel: 'pt to cup',
        fromUnit: 'US Pints',
        toUnit: 'US Cups',
        sampleInput: 1,
        anchorId: 'pair-pt-to-cup',
        factorSummary: '1 pt = 2 cups (exact)',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 3,
        fromUnit: 'US Teaspoons',
        fromAbbr: 'tsp',
        toUnit: 'US Tablespoons',
        toAbbr: 'tbsp',
        keywordLabel: '3 tsp to tbsp',
        workingFormula: '3 ÷ 3',
      },
      {
        inputValue: 3,
        fromUnit: 'US Tablespoons',
        fromAbbr: 'tbsp',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '3 tablespoons to cups',
        workingFormula: '3 ÷ 16',
      },
      {
        inputValue: 4,
        fromUnit: 'US Tablespoons',
        fromAbbr: 'tbsp',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '4 tablespoons to cups',
        workingFormula: '4 ÷ 16 (1/4 cup)',
      },
      {
        inputValue: 6,
        fromUnit: 'US Tablespoons',
        fromAbbr: 'tbsp',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '6 tablespoons to cups',
        workingFormula: '6 ÷ 16 (3/8 cup)',
      },
      {
        inputValue: 8,
        fromUnit: 'US Tablespoons',
        fromAbbr: 'tbsp',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '8 tbsp to cups',
        workingFormula: '8 ÷ 16 (1/2 cup)',
      },
      {
        inputValue: 12,
        fromUnit: 'US Tablespoons',
        fromAbbr: 'tbsp',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '12 tbsp to cups',
        workingFormula: '12 ÷ 16 (3/4 cup)',
      },
      {
        inputValue: 8,
        fromUnit: 'US Fluid Ounces',
        fromAbbr: 'fl oz',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '8 oz to cups',
        workingFormula: '8 ÷ 8',
      },
      {
        inputValue: 16,
        fromUnit: 'US Fluid Ounces',
        fromAbbr: 'fl oz',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '16 oz to cups',
        workingFormula: '16 ÷ 8',
      },
      {
        inputValue: 32,
        fromUnit: 'US Fluid Ounces',
        fromAbbr: 'fl oz',
        toUnit: 'US Cups',
        toAbbr: 'cups',
        keywordLabel: '32 oz to cups',
        workingFormula: '32 ÷ 8',
      },
    ],
    unitGuide: [
      {
        unit: 'US Customary Cup',
        symbol: 'cup (c)',
        system: 'US Customary / Imperial',
        baseEquivalent: '236.588 mL (16 tbsp / 8 fl oz)',
        commonUse: 'Measuring flour, sugar, milk, and stocks in American baking and stovetop recipes.',
      },
      {
        unit: 'US Tablespoon',
        symbol: 'tbsp (T)',
        system: 'US Customary / Imperial',
        baseEquivalent: '14.787 mL (3 tsp / 0.5 fl oz)',
        commonUse: 'Measuring butter sticks (8 tbsp per 1/2-cup stick), cooking oils, and salad dressings.',
      },
      {
        unit: 'US Teaspoon',
        symbol: 'tsp (t)',
        system: 'US Customary / Imperial',
        baseEquivalent: '4.929 mL (1/3 tbsp)',
        commonUse: 'Measuring baking powder, baking soda, vanilla extract, salt, and ground spices.',
      },
      {
        unit: 'US Fluid Ounce',
        symbol: 'fl oz',
        system: 'US Customary / Imperial',
        baseEquivalent: '29.574 mL (2 tbsp)',
        commonUse: 'Liquid measuring cup graduations, espresso shots, and cocktail recipe jiggers.',
      },
      {
        unit: 'Milliliter',
        symbol: 'mL',
        system: 'Metric (SI)',
        baseEquivalent: '1 mL (1 cm³)',
        commonUse: 'International recipe liquid measurements and precision kitchen measuring jugs.',
      },
      {
        unit: 'US Liquid Pint',
        symbol: 'pt',
        system: 'US Customary / Imperial',
        baseEquivalent: '473.176 mL (2 cups)',
        commonUse: 'Heavy whipping cream cartons, sour cream tubs, and canning jars.',
      },
      {
        unit: 'US Liquid Quart',
        symbol: 'qt',
        system: 'US Customary / Imperial',
        baseEquivalent: '946.353 mL (4 cups / 2 pt)',
        commonUse: 'Chicken or vegetable stock cartons, soup batches, and deep-frying oil quantities.',
      },
      {
        unit: 'Liter',
        symbol: 'L',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 mL (≈ 4.2268 US cups)',
        commonUse: 'Large batch beverages, commercial kitchen stockpots, and metric pitch-markings.',
      },
    ],
    comparisonBox: {
      title: 'US Customary Cup (236.59 mL) vs. Metric Cup (250 mL) & Dry Ingredient Grams',
      unitALabel: 'US Customary Cup (236.588 mL)',
      unitADetail:
        'Used in American measuring cup sets and recipes: 1 US cup = 8 US fl oz = 16 tbsp = 48 tsp (236.588 mL). Note that US FDA nutrition labels round 1 legal cup to 240 mL.',
      unitBLabel: 'Commonwealth Metric Cup (250 mL)',
      unitBDetail:
        'Used in Australia, New Zealand, Canada, and the UK: 1 metric cup = 250 mL. When converting cups to grams (e.g., flour vs. sugar), weight depends on ingredient density.',
      takeaway:
        'For converting cups or spoons to grams of flour, sugar, butter, or oats, use our Ingredient-Aware Recipe Converter.',
      routingLink: {
        label: 'Open Ingredient Recipe Converter (/recipe-converter)',
        href: '/recipe-converter',
      },
    },
    formulaCard: {
      introText: 'Divide US tablespoons by 16 to get US cups, or divide teaspoons by 3 to get tablespoons:',
      formulaText: 'US Cups = Tablespoons ÷ 16   |   Tablespoons = Teaspoons ÷ 3',
      exampleTitle: 'Convert 6 Tablespoons to Cups:',
      exampleSteps: [
        '1 US Cup = 16 US Tablespoons (exact)',
        'Cups = 6 ÷ 16',
        'Result = 0.375 Cups (3/8 cup)',
      ],
    },
    howItWorks: {
      paragraph:
        'US customary kitchen spoons and cups follow exact binary and ternary ratios: 1 gallon = 4 quarts = 8 pints = 16 cups = 128 fluid ounces = 256 tablespoons = 768 teaspoons. All factors follow NIST SP 811.',
      formulaBox: '1 Cup = 8 fl oz = 16 tbsp = 48 tsp = 236.588 mL',
      closingNote:
        'To convert dry ingredients (flour, sugar, cocoa, butter) between volume and grams, visit /recipe-converter.',
    },
    faqs: [
      {
        question: 'How many tablespoons are in 1/4 cup and 1/3 cup?',
        answer:
          'There are 4 tablespoons in 1/4 US cup (16 / 4 = 4 tbsp), and 5 tablespoons plus 1 teaspoon in 1/3 US cup (16 / 3 = 5.333 tbsp).',
      },
      {
        question: 'How many cups is 6 tablespoons?',
        answer:
          '6 tablespoons equals 0.375 cups, or 3/8 of a cup (6 / 16 = 0.375 cups, which is 1/4 cup plus 2 tablespoons).',
      },
      {
        question: 'How many cups is 16 oz and 32 oz?',
        answer:
          'Because 1 US cup equals 8 fluid ounces, 16 fl oz equals 2 cups (16 / 8 = 2) and 32 fl oz equals 4 cups, or 1 quart (32 / 8 = 4).',
      },
      {
        question: 'How many cups are in a quart and a pint?',
        answer:
          'There are 2 US cups in 1 pint (473.18 mL) and 4 US cups in 1 quart (946.35 mL).',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Tablespoons to Cups Converter (tbsp to cup) | Cooking | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert tablespoons to cups (tbsp to cup), teaspoons to tablespoons (tsp to tbsp), fluid ounces to cups, and quarts to cups with NIST SP 811 kitchen tables.',
      beforeH1: 'Unit Converter',
      afterH1: 'Tablespoons to Cups and Cooking Converter',
      keywordsPlaced: [
        { keyword: 'tablespoons to cups / tbsp to cup', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'how many tsp in tbsp / tsp to tbsp', zone: 'Meta / Top 1-Line Answer / Pair Card 2 / Common-Values Table' },
        { keyword: 'cups to tablespoons / 1/4 cup in tablespoons', zone: 'Pair Card 3 / FAQ 1' },
        { keyword: 'fluid ounces to cups / fl oz to cup', zone: 'Meta / Pair Card 4' },
        { keyword: 'how many cups is a quart / qt to cup', zone: 'Meta / Pair Card 5 / FAQ 4' },
        { keyword: 'cups in a pint / pt to cup', zone: 'Pair Card 6 / FAQ 4' },
        { keyword: '3 tablespoons to cups', zone: 'Common-Values Table' },
        { keyword: '4 tablespoons to cups', zone: 'Common-Values Table / FAQ 1' },
        { keyword: '6 tablespoons to cups', zone: 'Common-Values Table / Formula Card / FAQ 2' },
        { keyword: 'how many tablespoons in 1/2 cup / 8 tbsp to cups', zone: 'Top 1-Line Answer / Common-Values Table' },
        { keyword: '12 tbsp to cups', zone: 'Common-Values Table' },
        { keyword: '8 oz to cups', zone: 'Common-Values Table' },
        { keyword: 'how many cups is 16 oz / 16 oz to cups', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '32 oz to cups', zone: 'Common-Values Table / FAQ 3' },
      ],
      keywordsSkipped: [
        { keyword: 'how much is 2 0z in cups / 3 0z is how many cups', reason: 'Typo ("0z" with zero) — never placed in visible text' },
        { keyword: 'how many spoonfuls is 1/4 cup / how many spoons is 1/2 cup', reason: 'Ambiguous "spoon" wording — answered clearly with exact tbsp and tsp values' },
        { keyword: 'cup gm / flour cups to grams', reason: 'Ingredient density conversions belong on /recipe-converter' },
      ],
      calculationsVerified: [
        { label: '3 tsp to tbsp', working: '3 / 3', result: '1 tbsp' },
        { label: '3 tbsp to cups', working: '3 / 16', result: '0.1875 cups (3/16 cup)' },
        { label: '4 tbsp to cups', working: '4 / 16', result: '0.25 cups (1/4 cup)' },
        { label: '6 tbsp to cups', working: '6 / 16', result: '0.375 cups (3/8 cup)' },
        { label: '8 tbsp to cups', working: '8 / 16', result: '0.5 cups (1/2 cup)' },
        { label: '12 tbsp to cups', working: '12 / 16', result: '0.75 cups (3/4 cup)' },
        { label: '8 fl oz to cups', working: '8 / 8', result: '1 cup' },
        { label: '16 fl oz to cups', working: '16 / 8', result: '2 cups' },
        { label: '32 fl oz to cups', working: '32 / 8', result: '4 cups' },
      ],
    },
  },

  area: {
    slug: 'area',
    canonicalPath: '/conversions/area',
    categoryLabel: 'Area & Land',
    shortLabel: 'Area',
    metaTitle: 'Square Meters to Square Feet Converter (m² to ft²) | SolveIt',
    metaDescription:
      'Convert square meters to square feet (m² to ft²), acres to square miles, acres to square feet, and square inches to sq ft with NIST SP 811 factors.',
    ogTitle: 'Square Meters to Square Feet Converter (m² to ft²) | SolveIt',
    ogDescription:
      'Convert square meters to square feet (m² to ft²), acres to square miles, acres to square feet, and square inches to sq ft with NIST SP 811 factors.',
    h1: 'Square Meters to Square Feet and Area',
    h1Highlight: 'Converter',
    subtitle:
      'Convert floor plans, land parcels, and engineering surfaces between square meters (m²), square feet (ft²), acres, square miles, hectares, square yards, square inches, and square centimeters using NIST SP 811 factors.',
    topQuestionBanner: {
      question: 'How many acres are in a square mile, and how many square feet are in an acre?',
      oneLineAnswer:
        'There are exactly 640 acres in 1 square mile (2.58999 km²), and 1 acre equals 43,560 square feet (4,046.856 m²).',
    },
    defaultFromUnit: 'Square Meters',
    defaultToUnit: 'Square Feet',
    defaultInputValue: '100',
    baseUnitLabel: 'Square Meters (m²)',
    units: [
      'Square Meters',
      'Square Feet',
      'Acres',
      'Square Miles',
      'Hectares',
      'Square Yards',
      'Square Inches',
      'Square Centimeters',
      'Square Millimeters',
      'Square Kilometers',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        'Square Meters': 1,
        'Square Feet': 0.09290304,
        'Square Yards': 0.83612736,
        'Square Inches': 0.00064516,
        'Square Centimeters': 0.0001,
        'Square Millimeters': 0.000001,
        Acres: 4046.8564224,
        Hectares: 10000,
        'Square Kilometers': 1_000_000,
        'Square Miles': 2_589_988.110336,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        'Square Meters': 1,
        'Square Feet': 1 / 0.09290304,
        'Square Yards': 1 / 0.83612736,
        'Square Inches': 1 / 0.00064516,
        'Square Centimeters': 10000,
        'Square Millimeters': 1_000_000,
        Acres: 1 / 4046.8564224,
        Hectares: 0.0001,
        'Square Kilometers': 0.000001,
        'Square Miles': 1 / 2_589_988.110336,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'sqm-to-sqft',
        label: 'Square Meters to Square Feet',
        abbrLabel: 'm² to sq ft',
        fromUnit: 'Square Meters',
        toUnit: 'Square Feet',
        sampleInput: 100,
        anchorId: 'pair-sqm-to-sqft',
        factorSummary: '1 m² ≈ 10.7639 sq ft',
      },
      {
        id: 'acres-to-sqmi',
        label: 'Acres to Square Miles',
        abbrLabel: 'acres to sq mi',
        fromUnit: 'Acres',
        toUnit: 'Square Miles',
        sampleInput: 640,
        anchorId: 'pair-acres-to-sqmi',
        factorSummary: '640 acres = 1 sq mi (exact)',
      },
      {
        id: 'acres-to-sqft',
        label: 'Acres to Square Feet',
        abbrLabel: 'acres to sq ft',
        fromUnit: 'Acres',
        toUnit: 'Square Feet',
        sampleInput: 28,
        anchorId: 'pair-acres-to-sqft',
        factorSummary: '1 acre = 43,560 sq ft (exact)',
      },
      {
        id: 'sqin-to-sqft',
        label: 'Square Inches to Square Feet',
        abbrLabel: 'in² to ft²',
        fromUnit: 'Square Inches',
        toUnit: 'Square Feet',
        sampleInput: 144,
        anchorId: 'pair-sqin-to-sqft',
        factorSummary: '144 in² = 1 ft² (exact)',
      },
      {
        id: 'cm2-to-m2',
        label: 'Square Centimeters to Square Meters',
        abbrLabel: 'cm² to m²',
        fromUnit: 'Square Centimeters',
        toUnit: 'Square Meters',
        sampleInput: 10000,
        anchorId: 'pair-cm2-to-m2',
        factorSummary: '10,000 cm² = 1 m² (exact)',
      },
      {
        id: 'ha-to-sqmi',
        label: 'Hectares to Square Miles',
        abbrLabel: 'ha to sq mi',
        fromUnit: 'Hectares',
        toUnit: 'Square Miles',
        sampleInput: 258.9988,
        anchorId: 'pair-ha-to-sqmi',
        factorSummary: '258.9988 ha = 1 sq mi',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 9,
        fromUnit: 'Square Feet',
        fromAbbr: 'ft²',
        toUnit: 'Square Meters',
        toAbbr: 'm²',
        keywordLabel: '9 sq ft to sq meters',
        workingFormula: '9 × 0.09290304',
      },
      {
        inputValue: 100,
        fromUnit: 'Square Meters',
        fromAbbr: 'm²',
        toUnit: 'Square Feet',
        toAbbr: 'ft²',
        keywordLabel: '100 m2 to sq ft',
        workingFormula: '100 ÷ 0.09290304',
      },
      {
        inputValue: 0.3,
        fromUnit: 'Acres',
        fromAbbr: 'ac',
        toUnit: 'Square Feet',
        toAbbr: 'ft²',
        keywordLabel: '0.3 acres to square feet',
        workingFormula: '0.3 × 43,560',
      },
      {
        inputValue: 0.6,
        fromUnit: 'Acres',
        fromAbbr: 'ac',
        toUnit: 'Square Feet',
        toAbbr: 'ft²',
        keywordLabel: '0.6 acres to square feet',
        workingFormula: '0.6 × 43,560',
      },
      {
        inputValue: 28,
        fromUnit: 'Acres',
        fromAbbr: 'ac',
        toUnit: 'Square Feet',
        toAbbr: 'ft²',
        keywordLabel: '28 acres to square feet',
        workingFormula: '28 × 43,560',
      },
      {
        inputValue: 640,
        fromUnit: 'Acres',
        fromAbbr: 'ac',
        toUnit: 'Square Miles',
        toAbbr: 'mi²',
        keywordLabel: '640 acres to square miles',
        workingFormula: '640 ÷ 640',
      },
      {
        inputValue: 258.9988,
        fromUnit: 'Hectares',
        fromAbbr: 'ha',
        toUnit: 'Square Miles',
        toAbbr: 'mi²',
        keywordLabel: '258.9988 hectares to sq mi',
        workingFormula: '258.9988 ÷ 258.998811',
      },
      {
        inputValue: 93.5,
        fromUnit: 'Square Inches',
        fromAbbr: 'in²',
        toUnit: 'Square Meters',
        toAbbr: 'm²',
        keywordLabel: '93.5 square inches to square meters',
        workingFormula: '93.5 × 0.00064516',
      },
      {
        inputValue: 40000,
        fromUnit: 'Acres',
        fromAbbr: 'ac',
        toUnit: 'Square Kilometers',
        toAbbr: 'km²',
        keywordLabel: '40000 acres to km2',
        workingFormula: '40,000 × 0.0040468564',
      },
    ],
    unitGuide: [
      {
        unit: 'Square Meter',
        symbol: 'm²',
        system: 'Metric (SI)',
        baseEquivalent: '1 m² (SI derived unit)',
        commonUse: 'International architectural floor plans, ceramic tile boxes, and commercial office leases.',
      },
      {
        unit: 'Square Foot',
        symbol: 'ft² (sq ft)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.09290304 m² (144 in²)',
        commonUse: 'US residential real estate listings, hardwood flooring estimates, and drywall panel coverage.',
      },
      {
        unit: 'Acre',
        symbol: 'ac',
        system: 'US Customary / Imperial',
        baseEquivalent: '4,046.8564224 m² (43,560 ft²)',
        commonUse: 'Suburban residential lot sizing (such as 0.3 or 0.6 acres), farm parcels, and rural land deeds.',
      },
      {
        unit: 'Square Mile',
        symbol: 'mi² (sq mi)',
        system: 'US Customary / Imperial',
        baseEquivalent: '2,589,988.11 m² (640 acres)',
        commonUse: 'Municipal city boundaries, county survey sections, and watershed catchment maps.',
      },
      {
        unit: 'Hectare',
        symbol: 'ha',
        system: 'Metric (SI)',
        baseEquivalent: '10,000 m² (≈ 2.47105 acres)',
        commonUse: 'International agricultural yields, vineyard estates, and forestry conservation tracts.',
      },
      {
        unit: 'Square Yard',
        symbol: 'yd² (sy)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.83612736 m² (9 ft²)',
        commonUse: 'Broadloom carpet rolls, artificial turf installation, and highway paving specifications.',
      },
      {
        unit: 'Square Inch',
        symbol: 'in² (sq in)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.00064516 m² (6.4516 cm²)',
        commonUse: 'Hydraulic cylinder piston cross-sections, tire contact patches, and structural bolt bearing plates.',
      },
      {
        unit: 'Square Centimeter',
        symbol: 'cm²',
        system: 'Metric (SI)',
        baseEquivalent: '0.0001 m² (100 mm²)',
        commonUse: 'Solar cell active surface area, laboratory filter membranes, and medical wound dressings.',
      },
      {
        unit: 'Square Millimeter',
        symbol: 'mm²',
        system: 'Metric (SI)',
        baseEquivalent: '0.000001 m² (0.01 cm²)',
        commonUse: 'IEC electrical wire gauge cross-sections and semiconductor die sizes.',
      },
      {
        unit: 'Square Kilometer',
        symbol: 'km²',
        system: 'Metric (SI)',
        baseEquivalent: '1,000,000 m² (100 ha)',
        commonUse: 'National park boundaries, satellite land-cover mapping, and population density statistics.',
      },
    ],
    comparisonBox: {
      title: 'Acre (43,560 sq ft) vs. Hectare (10,000 m²) vs. Square Mile (640 Acres)',
      unitALabel: '1 Acre = 43,560 ft² = 4,046.856 m²',
      unitADetail:
        'Historically defined as 1 furlong (660 ft) by 1 chain (66 ft). Exactly 640 acres make 1 square mile (1 section of land in the US Public Land Survey System).',
      unitBLabel: '1 Hectare = 10,000 m² ≈ 2.47105 Acres',
      unitBDetail:
        'A metric square measuring 100 meters on each side (0.01 km²). 1 square mile equals 258.9988 hectares (2.589988 km²).',
      takeaway:
        'To convert hectares to acres, multiply by 2.4710538; to convert acres to square miles, divide by 640.',
    },
    formulaCard: {
      introText: 'Divide square meters by 0.09290304 for square feet, or multiply acres by 43,560 for square feet:',
      formulaText: 'ft² = m² ÷ 0.09290304   |   1 mi² = 640 Acres = 258.9988 ha',
      exampleTitle: 'Convert 28 Acres to Square Feet:',
      exampleSteps: [
        '1 Acre = 43,560 Square Feet (exact)',
        'Square Feet = 28 × 43,560',
        'Result = 1,219,680 ft² (or 113,311.98 m²)',
      ],
    },
    howItWorks: {
      paragraph:
        'Surface area units are normalized to square meters (m²) and converted using exact squared linear factors that follow NIST SP 811.',
      formulaBox: '1 ft² = 0.09290304 m²   |   1 in² = 6.4516 cm²   |   1 Acre = 4,046.8564224 m²',
      closingNote:
        'Remember that squaring a linear unit squares its conversion ratio: 1 ft = 12 in, so 1 ft² = 144 in²; 1 m = 100 cm, so 1 m² = 10,000 cm².',
    },
    faqs: [
      {
        question: 'How many acres are in a square mile?',
        answer:
          'There are exactly 640 acres in 1 square mile (27,878,400 sq ft / 43,560 sq ft = 640), which is also equal to 258.9988 hectares.',
      },
      {
        question: 'How many square feet is 0.3 acres and 28 acres?',
        answer:
          'Multiply acres by 43,560: 0.3 acres is 13,068 square feet (0.3 × 43,560), and 28 acres is 1,219,680 square feet (28 × 43,560).',
      },
      {
        question: 'How do you convert square inches to square feet?',
        answer:
          'Divide square inches by 144 (since 12 in × 12 in = 144 in² per sq ft); for example, 288 in² equals 2 ft².',
      },
      {
        question: 'How many square centimeters and square millimeters are in 1 square meter?',
        answer:
          '1 square meter equals 10,000 square centimeters (100 cm × 100 cm) and 1,000,000 square millimeters (1,000 mm × 1,000 mm).',
      },
      {
        question: 'How do you convert linear feet to square feet (and square feet to linear feet)?',
        answer:
          'Multiply linear feet by the board or roll width in feet: Square Feet = Linear Feet × (Width in inches / 12). For example, 100 linear feet of 6-inch-wide planks (0.5 ft) covers 50 sq ft; conversely, Linear Feet = Square Feet / Width in feet.',
      },
      {
        question: 'How many square feet is a standard 4×8 sheet of plywood?',
        answer:
          'A standard 4 ft × 8 ft plywood or OSB subfloor sheet covers 32 square feet (2.973 m²). Dividing 1,000 sq ft by 32 sq ft per sheet equals 31.25 sheets (32 full sheets before waste).',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Square Meters to Square Feet Converter (m² to ft²) | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert square meters to square feet (m² to ft²), acres to square miles, acres to square feet, and square inches to sq ft with NIST SP 811 factors.',
      beforeH1: 'Unit Converter',
      afterH1: 'Square Meters to Square Feet and Area Converter',
      keywordsPlaced: [
        { keyword: 'm2 to sq ft / square meter to square foot', zone: 'Title / H1 / Meta / Pair Card 1 / Common-Values Table' },
        { keyword: 'acres to square miles / how many acres are in a square mile', zone: 'Meta / Top 1-Line Answer / Pair Card 2 / Common-Values Table / FAQ 1' },
        { keyword: 'acres to square feet / 28 acres to square feet', zone: 'Meta / Pair Card 3 / Common-Values Table / Formula Card / FAQ 2' },
        { keyword: 'sq ft from inches / square inch to square foot / in2 to ft2', zone: 'Meta / Pair Card 4 / FAQ 3' },
        { keyword: 'cm 2 to m 2 / square centimeters to square meters', zone: 'Pair Card 5 / FAQ 4' },
        { keyword: '258.9988 hectares', zone: 'Pair Card 6 / Common-Values Table / Comparison Box / FAQ 1' },
        { keyword: '9 foot meter / 9 sq ft to sq meters', zone: 'Common-Values Table' },
        { keyword: '0.3 acres to square feet', zone: 'Common-Values Table / Unit Guide (Acre) / FAQ 2' },
        { keyword: '0.6 acres to square feet', zone: 'Common-Values Table / Unit Guide (Acre)' },
        { keyword: '93.5 square inches to square meters', zone: 'Common-Values Table' },
        { keyword: '40000 acres to km2', zone: 'Common-Values Table' },
        { keyword: 'm 2 to mm 2', zone: 'FAQ 4 / Unit Guide (mm²)' },
        { keyword: 'linear feet to square feet / convert square feet to linear feet', zone: 'FAQ 5' },
        { keyword: 'plywood sizes (4×8 sheet = 32 sq ft)', zone: 'FAQ 6' },
      ],
      keywordsSkipped: [
        { keyword: 'acres en km2', reason: 'Flagged non-English ("en" French/Spanish) — covered in English as 40,000 acres to km²' },
        { keyword: 'hectare to hectare', reason: 'Redundant same-unit query (1 ha = 1 ha)' },
      ],
      calculationsVerified: [
        { label: '9 ft² to m²', working: '9 × 0.09290304', result: '0.8361 m²' },
        { label: '100 m² to ft²', working: '100 / 0.09290304', result: '1,076.3910 ft²' },
        { label: '0.3 acres to ft²', working: '0.3 × 43,560', result: '13,068 ft²' },
        { label: '0.6 acres to ft²', working: '0.6 × 43,560', result: '26,136 ft²' },
        { label: '28 acres to ft²', working: '28 × 43,560', result: '1,219,680 ft²' },
        { label: '640 acres to mi²', working: '640 / 640', result: '1 mi²' },
        { label: '258.9988 ha to mi²', working: '258.9988 / 258.998811', result: '1 mi²' },
        { label: '93.5 in² to m²', working: '93.5 × 0.00064516', result: '0.0603 m²' },
        { label: '40,000 acres to km²', working: '40,000 × 0.0040468564224', result: '161.8743 km²' },
        { label: '100 LF × 6" board to sq ft', working: '100 × (6 / 12)', result: '50 ft²' },
      ],
    },
  },

  speed: {
    slug: 'speed',
    canonicalPath: '/conversions/speed',
    categoryLabel: 'Speed & Velocity',
    shortLabel: 'Speed',
    metaTitle: 'Kilometers per Hour to mph Converter (km/h to mph) | SolveIt',
    metaDescription:
      'Convert kilometers per hour to miles per hour (km/h to mph), knots to mph, meters per second (m/s to mph), and ft/s using exact NIST SP 811 factors.',
    ogTitle: 'Kilometers per Hour to mph Converter (km/h to mph) | SolveIt',
    ogDescription:
      'Convert kilometers per hour to miles per hour (km/h to mph), knots to mph, meters per second (m/s to mph), and ft/s using exact NIST SP 811 factors.',
    h1: 'Kilometers per Hour to Miles per Hour',
    h1Highlight: 'Converter',
    subtitle:
      'Convert road, wind, marine, and aviation speeds between km/h, mph, knots, meters per second (m/s), and feet per second (ft/s) using factors that follow NIST SP 811.',
    topQuestionBanner: {
      question: 'How do you convert knots to mph and km/h to mph?',
      oneLineAnswer:
        '1 knot equals about 1.15078 mph (1,852 m ÷ 1,609.344 m), and 100 km/h equals about 62.14 mph (100 ÷ 1.609344).',
    },
    defaultFromUnit: 'Kilometers per hour (km/h)',
    defaultToUnit: 'Miles per hour (mph)',
    defaultInputValue: '100',
    baseUnitLabel: 'Meters per second (m/s)',
    units: [
      'Kilometers per hour (km/h)',
      'Miles per hour (mph)',
      'Knots',
      'Meters per second (m/s)',
      'Feet per second (ft/s)',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        'Miles per hour (mph)': 0.44704,
        'Kilometers per hour (km/h)': 1 / 3.6,
        'Meters per second (m/s)': 1,
        'Feet per second (ft/s)': 0.3048,
        Knots: 1852 / 3600,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        'Miles per hour (mph)': 1 / 0.44704,
        'Kilometers per hour (km/h)': 3.6,
        'Meters per second (m/s)': 1,
        'Feet per second (ft/s)': 1 / 0.3048,
        Knots: 3600 / 1852,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'kmh-to-mph',
        label: 'Kilometers per Hour to mph',
        abbrLabel: 'km/h to mph',
        fromUnit: 'Kilometers per hour (km/h)',
        toUnit: 'Miles per hour (mph)',
        sampleInput: 100,
        anchorId: 'pair-kmh-to-mph',
        factorSummary: '1 mph = 1.609344 km/h (exact)',
      },
      {
        id: 'knots-to-mph',
        label: 'Knots to Miles per Hour',
        abbrLabel: 'knots to mph',
        fromUnit: 'Knots',
        toUnit: 'Miles per hour (mph)',
        sampleInput: 20,
        anchorId: 'pair-knots-to-mph',
        factorSummary: '1 knot ≈ 1.15078 mph',
      },
      {
        id: 'ms-to-mph',
        label: 'Meters per Second to mph',
        abbrLabel: 'm/s to mph',
        fromUnit: 'Meters per second (m/s)',
        toUnit: 'Miles per hour (mph)',
        sampleInput: 10,
        anchorId: 'pair-ms-to-mph',
        factorSummary: '1 m/s ≈ 2.23694 mph',
      },
      {
        id: 'fps-to-mph',
        label: 'Feet per Second to mph',
        abbrLabel: 'fps to mph',
        fromUnit: 'Feet per second (ft/s)',
        toUnit: 'Miles per hour (mph)',
        sampleInput: 88,
        anchorId: 'pair-fps-to-mph',
        factorSummary: '88 ft/s = 60 mph (exact)',
      },
      {
        id: 'mph-to-kmh',
        label: 'Miles per Hour to km/h',
        abbrLabel: 'mph to km/h',
        fromUnit: 'Miles per hour (mph)',
        toUnit: 'Kilometers per hour (km/h)',
        sampleInput: 70,
        anchorId: 'pair-mph-to-kmh',
        factorSummary: '1 mph × 1.609344 = km/h',
      },
      {
        id: 'mph-to-fps',
        label: 'Miles per Hour to Feet per Second',
        abbrLabel: 'mph to ft/s',
        fromUnit: 'Miles per hour (mph)',
        toUnit: 'Feet per second (ft/s)',
        sampleInput: 60,
        anchorId: 'pair-mph-to-fps',
        factorSummary: '1 mph = 1.46667 ft/s',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 70,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '70 kmh to mph',
        workingFormula: '70 ÷ 1.609344',
      },
      {
        inputValue: 100,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '100 kmh to mph',
        workingFormula: '100 ÷ 1.609344',
      },
      {
        inputValue: 110,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '110 kmh to mph',
        workingFormula: '110 ÷ 1.609344',
      },
      {
        inputValue: 120,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '120 kmh to mph',
        workingFormula: '120 ÷ 1.609344',
      },
      {
        inputValue: 140,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '140 kmh to mph',
        workingFormula: '140 ÷ 1.609344',
      },
      {
        inputValue: 150,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '150 kph to mph',
        workingFormula: '150 ÷ 1.609344',
      },
      {
        inputValue: 200,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '200 kmh to mph',
        workingFormula: '200 ÷ 1.609344',
      },
      {
        inputValue: 300,
        fromUnit: 'Kilometers per hour (km/h)',
        fromAbbr: 'km/h',
        toUnit: 'Miles per hour (mph)',
        toAbbr: 'mph',
        keywordLabel: '300 kmh to mph',
        workingFormula: '300 ÷ 1.609344',
      },
      {
        inputValue: 70,
        fromUnit: 'Miles per hour (mph)',
        fromAbbr: 'mph',
        toUnit: 'Kilometers per hour (km/h)',
        toAbbr: 'km/h',
        keywordLabel: '70 mph to kmh',
        workingFormula: '70 × 1.609344',
      },
    ],
    unitGuide: [
      {
        unit: 'Kilometers per hour',
        symbol: 'km/h (kph)',
        system: 'Metric (SI)',
        baseEquivalent: '0.277778 m/s (1 ÷ 3.6)',
        commonUse: 'Road speed limit signs and vehicle speedometers across Europe, Canada, Asia, and Australia.',
      },
      {
        unit: 'Miles per hour',
        symbol: 'mph',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.44704 m/s (exact)',
        commonUse: 'US and UK highway speed limits (such as 70 mph), baseball pitch radar, and hurricane wind ratings.',
      },
      {
        unit: 'Knot',
        symbol: 'kn / kt',
        system: 'International / Scientific',
        baseEquivalent: '0.514444 m/s (1.852 km/h)',
        commonUse: 'Aviation airspeed indicators, marine vessel logs, and NOAA coastal wind forecasts.',
      },
      {
        unit: 'Meters per second',
        symbol: 'm/s',
        system: 'Metric (SI)',
        baseEquivalent: '1 m/s (SI derived unit)',
        commonUse: 'Physics kinematics equations, acoustic wave velocities, and scientific anemometers.',
      },
      {
        unit: 'Feet per second',
        symbol: 'ft/s (fps)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.3048 m/s (exact)',
        commonUse: 'Projectile chronograph testing, structural wind-load engineering, and hydraulic pipe flow.',
      },
    ],
    comparisonBox: {
      title: 'Knots (kn) vs. Miles per Hour (mph)',
      unitALabel: '1 Knot = 1 Nautical Mile per Hour (1.852 km/h)',
      unitADetail:
        'Based on the international nautical mile (1,852 meters), which corresponds to one minute of latitude on navigation charts. 1 knot equals about 1.15078 mph (0.514444 m/s).',
      unitBLabel: '1 Mile per Hour = 1 Statute Mile per Hour (1.609344 km/h)',
      unitBDetail:
        'Based on the land statute mile (5,280 feet or 1,609.344 meters). 1 mph equals 0.44704 m/s, or about 0.868976 knots.',
      takeaway:
        'A 20-knot marine breeze equals 23.02 mph (20 × 1.150779), and 60 mph equals exactly 88 feet per second.',
    },
    formulaCard: {
      introText: 'Divide kilometers per hour by 1.609344 to get miles per hour, or multiply m/s by 2.236936:',
      formulaText: 'mph = km/h ÷ 1.609344   |   mph = Knots × 1.150779',
      exampleTitle: 'Convert 100 km/h to mph:',
      exampleSteps: [
        '1 statute mile = 1.609344 kilometers (exact)',
        'mph = 100 ÷ 1.609344',
        'Result = 62.1371 mph (about 62.14 mph)',
      ],
    },
    howItWorks: {
      paragraph:
        'All speed and velocity units are normalized to meters per second (m/s) and converted using exact linear and time factors that follow NIST SP 811.',
      formulaBox: '1 m/s = 3.6 km/h   |   1 mph = 0.44704 m/s   |   1 knot = 1,852/3,600 m/s',
      closingNote: 'To convert mph to feet per second (ft/s), multiply mph by 5,280 ÷ 3,600 (or 22 ÷ 15 ≈ 1.46667).',
    },
    faqs: [
      {
        question: 'How fast is 100 km/h and 300 km/h in mph?',
        answer:
          '100 km/h is about 62.14 mph (100 / 1.609344 = 62.1371 mph), and 300 km/h is about 186.41 mph (300 / 1.609344 = 186.4114 mph).',
      },
      {
        question: 'How do I convert knots to mph?',
        answer:
          'Multiply knots by 1.15077945 (since 1,852 m / 1,609.344 m = 1.15077945); for example, 20 knots is about 23.02 mph.',
      },
      {
        question: 'How do I convert meters per second (m/s) to mph?',
        answer:
          'Divide meters per second by 0.44704 (or multiply by 2.23693629); for example, 10 m/s is about 22.37 mph (10 / 0.44704).',
      },
      {
        question: 'What is the formula to convert mph to feet per second (fps)?',
        answer:
          'Multiply mph by 1.46667 (5,280 ft / 3,600 s); for example, 60 mph equals exactly 88 feet per second (60 × 5,280 / 3,600 = 88 ft/s).',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Kilometers per Hour to mph Converter (km/h to mph) | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert kilometers per hour to miles per hour (km/h to mph), knots to mph, meters per second (m/s to mph), and ft/s using exact NIST SP 811 factors.',
      beforeH1: 'Unit Converter',
      afterH1: 'Kilometers per Hour to Miles per Hour Converter',
      keywordsPlaced: [
        { keyword: 'kilometers per hour to miles per hour / kmh to mph', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'knots to mph', zone: 'Meta / Top 1-Line Answer / Pair Card 2 / FAQ 2' },
        { keyword: 'm/s to mph / meters per second to mph', zone: 'Meta / Pair Card 3 / FAQ 3' },
        { keyword: 'fps to mph', zone: 'Pair Card 4' },
        { keyword: 'mph to kmh / 70 mph to kmh', zone: 'Pair Card 5 / Common-Values Table' },
        { keyword: 'miles per hour to feet per second formula', zone: 'Pair Card 6 / FAQ 4' },
        { keyword: '70 kmh to mph', zone: 'Common-Values Table' },
        { keyword: '100 kmh to mph', zone: 'Top 1-Line Answer / Common-Values Table / Formula Card / FAQ 1' },
        { keyword: '110 kmh to mph', zone: 'Common-Values Table' },
        { keyword: '120 kmh to mph', zone: 'Common-Values Table' },
        { keyword: '140 kmh to mph', zone: 'Common-Values Table' },
        { keyword: '150 kph to mph', zone: 'Common-Values Table' },
        { keyword: '200 kmh to mph', zone: 'Common-Values Table' },
        { keyword: '300 kmh to mph', zone: 'Common-Values Table / FAQ 1' },
      ],
      keywordsSkipped: [
        { keyword: 'mph till kmh', reason: 'Flagged non-English ("till" Swedish)' },
        { keyword: 'second to m/s', reason: 'Dimensionally invalid query (time vs velocity)' },
      ],
      calculationsVerified: [
        { label: '70 km/h to mph', working: '70 / 1.609344', result: '43.4960 mph' },
        { label: '100 km/h to mph', working: '100 / 1.609344', result: '62.1371 mph' },
        { label: '110 km/h to mph', working: '110 / 1.609344', result: '68.3508 mph' },
        { label: '120 km/h to mph', working: '120 / 1.609344', result: '74.5645 mph' },
        { label: '140 km/h to mph', working: '140 / 1.609344', result: '86.9920 mph' },
        { label: '150 km/h to mph', working: '150 / 1.609344', result: '93.2057 mph' },
        { label: '200 km/h to mph', working: '200 / 1.609344', result: '124.2742 mph' },
        { label: '300 km/h to mph', working: '300 / 1.609344', result: '186.4114 mph' },
        { label: '70 mph to km/h', working: '70 × 1.609344', result: '112.6541 km/h' },
        { label: '20 knots to mph', working: '20 × (1852 / 1609.344)', result: '23.0156 mph' },
        { label: '10 m/s to mph', working: '10 / 0.44704', result: '22.3694 mph' },
        { label: '60 mph to ft/s', working: '60 × (5280 / 3600)', result: '88 ft/s (exact)' },
      ],
    },
  },

  digital: {
    slug: 'digital',
    canonicalPath: '/conversions/digital',
    categoryLabel: 'Digital Data & Storage',
    shortLabel: 'Digital',
    metaTitle: 'Kilobytes to Megabytes & MB to GB Converter | Data | SolveIt',
    metaDescription:
      'Convert kilobytes to megabytes (KB to MB), megabytes to gigabytes (MB to GB), gigabits to megabytes (Gbit to MB), and binary MiB/GiB units.',
    ogTitle: 'Kilobytes to Megabytes & MB to GB Converter | Data | SolveIt',
    ogDescription:
      'Convert kilobytes to megabytes (KB to MB), megabytes to gigabytes (MB to GB), gigabits to megabytes (Gbit to MB), and binary MiB/GiB units.',
    h1: 'Kilobytes, Megabytes, and Gigabytes Data',
    h1Highlight: 'Converter',
    subtitle:
      'Convert digital file sizes, memory capacities, and transfer units between KB, MB, GB, TB (SI base-1000), KiB, MiB, GiB (IEC binary base-1024), and bits/gigabits following NIST SP 811.',
    topQuestionBanner: {
      question: 'How many megabytes (MB) are in a gigabyte (GB), and how many megabytes is 1 gigabit (Gbit)?',
      oneLineAnswer:
        '1 GB equals 1,000 MB in decimal SI storage (or 1,024 MiB in binary RAM), and 1 gigabit (Gbit) equals 125 megabytes (1,000 Mbit ÷ 8 bits/byte).',
    },
    defaultFromUnit: 'Megabytes (MB)',
    defaultToUnit: 'Gigabytes (GB)',
    defaultInputValue: '1000',
    baseUnitLabel: 'Megabytes (MB)',
    units: [
      'Kilobytes (KB)',
      'Megabytes (MB)',
      'Gigabytes (GB)',
      'Terabytes (TB)',
      'Bytes (B)',
      'Bits (bit)',
      'Kilobits (kbit)',
      'Megabits (Mbit)',
      'Gigabits (Gbit)',
      'Kibibytes (KiB)',
      'Mebibytes (MiB)',
      'Gibibytes (GiB)',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        'Bits (bit)': 1e-6 / 8,
        'Kilobits (kbit)': 0.001 / 8,
        'Megabits (Mbit)': 1 / 8,
        'Gigabits (Gbit)': 1000 / 8,
        'Bytes (B)': 1e-6,
        'Kilobytes (KB)': 0.001,
        'Megabytes (MB)': 1,
        'Gigabytes (GB)': 1000,
        'Terabytes (TB)': 1_000_000,
        'Kibibytes (KiB)': 1024 / 1_000_000,
        'Mebibytes (MiB)': 1_048_576 / 1_000_000,
        'Gibibytes (GiB)': 1_073_741_824 / 1_000_000,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        'Bits (bit)': 8_000_000,
        'Kilobits (kbit)': 8000,
        'Megabits (Mbit)': 8,
        'Gigabits (Gbit)': 0.008,
        'Bytes (B)': 1_000_000,
        'Kilobytes (KB)': 1000,
        'Megabytes (MB)': 1,
        'Gigabytes (GB)': 0.001,
        'Terabytes (TB)': 1e-6,
        'Kibibytes (KiB)': 1_000_000 / 1024,
        'Mebibytes (MiB)': 1_000_000 / 1_048_576,
        'Gibibytes (GiB)': 1_000_000 / 1_073_741_824,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'kb-to-mb',
        label: 'Kilobytes to Megabytes',
        abbrLabel: 'KB to MB',
        fromUnit: 'Kilobytes (KB)',
        toUnit: 'Megabytes (MB)',
        sampleInput: 1000,
        anchorId: 'pair-kb-to-mb',
        factorSummary: '1,000 KB = 1 MB (SI)',
      },
      {
        id: 'mb-to-gb',
        label: 'Megabytes to Gigabytes',
        abbrLabel: 'MB to GB',
        fromUnit: 'Megabytes (MB)',
        toUnit: 'Gigabytes (GB)',
        sampleInput: 5000,
        anchorId: 'pair-mb-to-gb',
        factorSummary: '1,000 MB = 1 GB (SI)',
      },
      {
        id: 'gbit-to-mb',
        label: 'Gigabits to Megabytes',
        abbrLabel: 'Gbit to MB',
        fromUnit: 'Gigabits (Gbit)',
        toUnit: 'Megabytes (MB)',
        sampleInput: 1,
        anchorId: 'pair-gbit-to-mb',
        factorSummary: '1 Gbit = 125 MB (exact)',
      },
      {
        id: 'gbit-to-mbit',
        label: 'Gigabits to Megabits',
        abbrLabel: 'Gbit to Mbit',
        fromUnit: 'Gigabits (Gbit)',
        toUnit: 'Megabits (Mbit)',
        sampleInput: 1,
        anchorId: 'pair-gbit-to-mbit',
        factorSummary: '1 Gbit = 1,000 Mbit',
      },
      {
        id: 'kb-to-gb',
        label: 'Kilobytes to Gigabytes',
        abbrLabel: 'KB to GB',
        fromUnit: 'Kilobytes (KB)',
        toUnit: 'Gigabytes (GB)',
        sampleInput: 1000000,
        anchorId: 'pair-kb-to-gb',
        factorSummary: '1,000,000 KB = 1 GB',
      },
      {
        id: 'gb-to-b',
        label: 'Gigabytes to Bytes',
        abbrLabel: 'GB to Bytes',
        fromUnit: 'Gigabytes (GB)',
        toUnit: 'Bytes (B)',
        sampleInput: 1,
        anchorId: 'pair-gb-to-b',
        factorSummary: '1 GB = 10⁹ Bytes',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 0.04,
        fromUnit: 'Gigabytes (GB)',
        fromAbbr: 'GB',
        toUnit: 'Megabytes (MB)',
        toAbbr: 'MB',
        keywordLabel: '0.04 GB to MB',
        workingFormula: '0.04 × 1,000',
      },
      {
        inputValue: 1,
        fromUnit: 'Gigabits (Gbit)',
        fromAbbr: 'Gbit',
        toUnit: 'Megabytes (MB)',
        toAbbr: 'MB',
        keywordLabel: '1 gigabit to megabytes',
        workingFormula: '1,000 Mbit ÷ 8',
      },
      {
        inputValue: 6,
        fromUnit: 'Megabytes (MB)',
        fromAbbr: 'MB',
        toUnit: 'Kilobytes (KB)',
        toAbbr: 'KB',
        keywordLabel: '6 MB to KB',
        workingFormula: '6 × 1,000',
      },
      {
        inputValue: 5000,
        fromUnit: 'Megabytes (MB)',
        fromAbbr: 'MB',
        toUnit: 'Gigabytes (GB)',
        toAbbr: 'GB',
        keywordLabel: '5000 MB to GB',
        workingFormula: '5,000 ÷ 1,000',
      },
      {
        inputValue: 6000,
        fromUnit: 'Megabytes (MB)',
        fromAbbr: 'MB',
        toUnit: 'Gigabytes (GB)',
        toAbbr: 'GB',
        keywordLabel: '6000 MB to GB',
        workingFormula: '6,000 ÷ 1,000',
      },
      {
        inputValue: 8192,
        fromUnit: 'Megabytes (MB)',
        fromAbbr: 'MB',
        toUnit: 'Gigabytes (GB)',
        toAbbr: 'GB',
        keywordLabel: '8192 MB to GB',
        workingFormula: '8,192 ÷ 1,000 (or 8 GiB)',
      },
      {
        inputValue: 8192,
        fromUnit: 'Mebibytes (MiB)',
        fromAbbr: 'MiB',
        toUnit: 'Gibibytes (GiB)',
        toAbbr: 'GiB',
        keywordLabel: '8192 MiB to GiB (Binary)',
        workingFormula: '8,192 ÷ 1,024',
      },
      {
        inputValue: 1,
        fromUnit: 'Gigabytes (GB)',
        fromAbbr: 'GB',
        toUnit: 'Bytes (B)',
        toAbbr: 'Bytes',
        keywordLabel: '1 GB to Bytes',
        workingFormula: '1 × 1,000,000,000',
      },
      {
        inputValue: 1,
        fromUnit: 'Gigabytes (GB)',
        fromAbbr: 'GB',
        toUnit: 'Bits (bit)',
        toAbbr: 'bits',
        keywordLabel: '1 GB in bits',
        workingFormula: '1,000,000,000 × 8',
      },
    ],
    unitGuide: [
      {
        unit: 'Bit',
        symbol: 'b / bit',
        system: 'International / Scientific',
        baseEquivalent: '1/8 Byte (0.125 B)',
        commonUse: 'Binary logic states (0 or 1), network transmission headers, and cryptography key lengths.',
      },
      {
        unit: 'Byte',
        symbol: 'B',
        system: 'International / Scientific',
        baseEquivalent: '8 bits (1e-6 MB)',
        commonUse: 'Single ASCII text characters, CPU register widths, and low-level file offsets.',
      },
      {
        unit: 'Kilobyte',
        symbol: 'KB',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 Bytes (0.001 MB)',
        commonUse: 'Plain-text documents, JSON API payloads, web icons, and email message bodies.',
      },
      {
        unit: 'Megabyte',
        symbol: 'MB',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 KB (1,000,000 Bytes)',
        commonUse: 'Smartphone JPEG/RAW photos (such as 6 MB), MP3 songs, and PDF brochures.',
      },
      {
        unit: 'Gigabyte',
        symbol: 'GB',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 MB (10⁹ Bytes)',
        commonUse: 'Smartphone storage tiers, USB flash drives, 4K movie downloads, and mobile data plans.',
      },
      {
        unit: 'Terabyte',
        symbol: 'TB',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 GB (10¹² Bytes)',
        commonUse: 'External backup hard drives, NVMe SSD arrays, and cloud object storage buckets.',
      },
      {
        unit: 'Gigabit',
        symbol: 'Gbit (Gb)',
        system: 'Metric (SI)',
        baseEquivalent: '125 MB (1,000 Mbit)',
        commonUse: 'Fiber-optic internet speed tiers (1 Gbps) and Gigabit Ethernet NIC ratings.',
      },
      {
        unit: 'Gibibyte',
        symbol: 'GiB',
        system: 'International / Scientific',
        baseEquivalent: '1,024 MiB (1,073,741,824 Bytes)',
        commonUse: 'DDR4/DDR5 RAM modules (such as 8,192 MiB = 8 GiB) and OS disk partition tables.',
      },
    ],
    comparisonBox: {
      title: 'Kilobyte (KB) vs. Megabyte (MB) & Megabit (Mb) vs. Megabyte (MB)',
      unitALabel: 'KB vs. MB & Decimal (1,000) vs. Binary (1,024)',
      unitADetail:
        '1 Megabyte (MB) is 1,000 times larger than 1 Kilobyte (KB) in SI decimal storage (1 MB = 1,000 KB = 1,000,000 Bytes), or 1,024 times larger in binary IEC memory (1 MiB = 1,024 KiB).',
      unitBLabel: 'Bits (b) vs. Bytes (B): Why 1 Gigabit = 125 Megabytes',
      unitBDetail:
        'Internet speeds are rated in bits (lowercase "b") while file sizes are measured in Bytes (uppercase "B", where 1 Byte = 8 bits). Divide megabits or gigabits by 8 to get megabytes or gigabytes.',
      takeaway:
        'A 1 Gigabit per second (1,000 Mbps) fiber connection downloads at a theoretical maximum of 125 Megabytes per second (1,000 ÷ 8 = 125 MB/s).',
    },
    formulaCard: {
      introText: 'Divide Kilobytes by 1,000 for Megabytes, or divide Gigabits by 8 (× 1,000) for Megabytes:',
      formulaText: 'GB = MB ÷ 1,000   |   MB = Gbit × 125   |   1 Byte = 8 bits',
      exampleTitle: 'Convert 1 Gigabit (Gbit) to Megabytes (MB):',
      exampleSteps: [
        '1 Gigabit = 1,000 Megabits (Mbit)',
        '1 Byte = 8 bits, so divide Megabits by 8: 1,000 ÷ 8',
        'Result = 125 Megabytes (MB)',
      ],
    },
    howItWorks: {
      paragraph:
        'This converter supports SI decimal prefixes (powers of 1,000: KB, MB, GB, TB), IEC binary prefixes (powers of 1,024: KiB, MiB, GiB), and bit-based units (bit, kbit, Mbit, Gbit) as defined in NIST SP 811.',
      formulaBox: '1 GB = 1,000 MB = 10⁹ Bytes = 8×10⁹ bits   |   1 GiB = 1,024 MiB = 2³⁰ Bytes',
      closingNote: 'For RAM blocks like 8,192 MB, divide by 1,024 to get 8 GiB or by 1,000 to get 8.192 GB.',
    },
    faqs: [
      {
        question: 'Which is bigger, a kilobyte (KB) or a megabyte (MB)?',
        answer:
          'A megabyte (MB) is 1,000 times larger than a kilobyte (KB) in decimal storage (1 MB = 1,000 KB), so a 6 MB photo equals 6,000 KB.',
      },
      {
        question: 'How many megabytes (MB) is 1 gigabit (Gbit)?',
        answer:
          '1 gigabit equals 125 megabytes because 1 gigabit is 1,000 megabits and there are 8 bits in 1 byte (1,000 / 8 = 125 MB).',
      },
      {
        question: 'How much storage is 0.04 GB and 8,192 MB?',
        answer:
          '0.04 GB equals 40 MB (0.04 × 1,000 = 40 MB), while 8,192 MB equals 8.192 decimal GB (8,192 / 1,000) or exactly 8 binary GiB (8,192 / 1,024 = 8).',
      },
      {
        question: 'How many bytes and bits are in 1 gigabyte (GB)?',
        answer:
          '1 decimal gigabyte contains 1,000,000,000 bytes (10⁹ B) and 8,000,000,000 bits (8 × 10⁹ bits).',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Kilobytes to Megabytes & MB to GB Converter | Data | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert kilobytes to megabytes (KB to MB), megabytes to gigabytes (MB to GB), gigabits to megabytes (Gbit to MB), and binary MiB/GiB units.',
      beforeH1: 'Unit Converter',
      afterH1: 'Kilobytes, Megabytes, and Gigabytes Data Converter',
      keywordsPlaced: [
        { keyword: 'kb to mb / kilobytes to megabytes', zone: 'Title / H1 / Meta / Pair Card 1 / FAQ 1' },
        { keyword: 'mb to gb / mbs to gbs', zone: 'Title / H1 / Meta / Pair Card 2' },
        { keyword: 'gigabit to megabyte / 1 gigabit to megabytes / gbit to mb', zone: 'Meta / Top 1-Line Answer / Pair Card 3 / Common-Values Table / Formula Card / FAQ 2' },
        { keyword: 'gbit to mbit', zone: 'Pair Card 4' },
        { keyword: 'kb in gb / convert kbytes to gigabytes', zone: 'Pair Card 5' },
        { keyword: 'byte to giga byte / gb to bytes / 1gb to bytes', zone: 'Pair Card 6 / Common-Values Table / FAQ 4' },
        { keyword: 'kb vs mb', zone: 'Comparison Box / FAQ 1' },
        { keyword: '0.04gb is how much storage', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '6mb to kb', zone: 'Common-Values Table / Unit Guide (MB) / FAQ 1' },
        { keyword: '5000mb to gb', zone: 'Common-Values Table' },
        { keyword: '6000 mb to gb', zone: 'Common-Values Table' },
        { keyword: '8192 mb to gb', zone: 'Common-Values Table / Unit Guide (GiB) / FAQ 3' },
        { keyword: 'how many bits in a gigabyte / 1 gb in bits', zone: 'Common-Values Table / FAQ 4' },
      ],
      keywordsSkipped: [
        { keyword: 'kb en gb / conversion kb en gb', reason: 'Flagged non-English ("en" French/Spanish) — covered in English as KB to GB' },
        { keyword: 'gb to gb', reason: 'Redundant same-unit query' },
      ],
      calculationsVerified: [
        { label: '0.04 GB to MB', working: '0.04 × 1,000', result: '40 MB' },
        { label: '1 Gbit to MB', working: '1,000 / 8', result: '125 MB' },
        { label: '6 MB to KB', working: '6 × 1,000', result: '6,000 KB' },
        { label: '5,000 MB to GB', working: '5,000 / 1,000', result: '5 GB' },
        { label: '6,000 MB to GB', working: '6,000 / 1,000', result: '6 GB' },
        { label: '8,192 MB to GB', working: '8,192 / 1,000', result: '8.192 GB' },
        { label: '8,192 MiB to GiB', working: '8,192 / 1,024', result: '8 GiB' },
        { label: '1 GB to Bytes', working: '1 × 1,000,000,000', result: '1,000,000,000 Bytes' },
        { label: '1 GB to bits', working: '1,000,000,000 × 8', result: '8,000,000,000 bits' },
      ],
    },
  },

  energy: {
    slug: 'energy',
    canonicalPath: '/conversions/energy',
    categoryLabel: 'Energy & Work',
    shortLabel: 'Energy',
    metaTitle: 'Kilojoules to Joules & Calories Converter (kJ, kcal) | SolveIt',
    metaDescription:
      'Convert kilojoules to joules (kJ to J), kilocalories to calories (kcal to cal), joules to calories, and kWh to joules using NIST SP 811 factors.',
    ogTitle: 'Kilojoules to Joules & Calories Converter (kJ, kcal) | SolveIt',
    ogDescription:
      'Convert kilojoules to joules (kJ to J), kilocalories to calories (kcal to cal), joules to calories, and kWh to joules using NIST SP 811 factors.',
    h1: 'Kilojoules, Joules, and Calories Energy',
    h1Highlight: 'Converter',
    subtitle:
      'Convert thermal, dietary, and electrical energy between Kilojoules (kJ), Joules (J), Kilocalories (kcal), small calories (cal), Kilowatt-hours (kWh), and BTUs following NIST SP 811.',
    topQuestionBanner: {
      question: 'How many calories are in 1 kilocalorie (kcal), and how many joules are in 1 kilojoule (kJ)?',
      oneLineAnswer:
        '1 kilocalorie (food Calorie) equals 1,000 small calories (4,184 joules), and 1 kilojoule (kJ) equals exactly 1,000 joules.',
    },
    defaultFromUnit: 'Kilojoules (kJ)',
    defaultToUnit: 'Joules (J)',
    defaultInputValue: '1',
    baseUnitLabel: 'Joules (J)',
    units: [
      'Kilojoules (kJ)',
      'Joules (J)',
      'Kilocalories (kcal)',
      'Calories (cal)',
      'Kilowatt-hours (kWh)',
      'Watt-hours (Wh)',
      'BTU (International)',
    ],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        'Joules (J)': 1,
        'Kilojoules (kJ)': 1000,
        'Calories (cal)': 4.184,
        'Kilocalories (kcal)': 4184,
        'Watt-hours (Wh)': 3600,
        'Kilowatt-hours (kWh)': 3_600_000,
        'BTU (International)': 1055.05585,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        'Joules (J)': 1,
        'Kilojoules (kJ)': 0.001,
        'Calories (cal)': 1 / 4.184,
        'Kilocalories (kcal)': 1 / 4184,
        'Watt-hours (Wh)': 1 / 3600,
        'Kilowatt-hours (kWh)': 1 / 3_600_000,
        'BTU (International)': 1 / 1055.05585,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'kj-to-j',
        label: 'Kilojoules to Joules',
        abbrLabel: 'kJ to J',
        fromUnit: 'Kilojoules (kJ)',
        toUnit: 'Joules (J)',
        sampleInput: 1,
        anchorId: 'pair-kj-to-j',
        factorSummary: '1 kJ = 1,000 J (exact)',
      },
      {
        id: 'j-to-kj',
        label: 'Joules to Kilojoules',
        abbrLabel: 'J to kJ',
        fromUnit: 'Joules (J)',
        toUnit: 'Kilojoules (kJ)',
        sampleInput: 1000,
        anchorId: 'pair-j-to-kj',
        factorSummary: '1,000 J = 1 kJ (exact)',
      },
      {
        id: 'kcal-to-cal',
        label: 'Kilocalories to Calories',
        abbrLabel: 'kcal to cal',
        fromUnit: 'Kilocalories (kcal)',
        toUnit: 'Calories (cal)',
        sampleInput: 259,
        anchorId: 'pair-kcal-to-cal',
        factorSummary: '1 kcal = 1,000 cal (exact)',
      },
      {
        id: 'j-to-cal',
        label: 'Joules to Calories',
        abbrLabel: 'J to cal',
        fromUnit: 'Joules (J)',
        toUnit: 'Calories (cal)',
        sampleInput: 100,
        anchorId: 'pair-j-to-cal',
        factorSummary: '1 cal = 4.184 J (exact)',
      },
      {
        id: 'kj-to-kcal',
        label: 'Kilojoules to Kilocalories',
        abbrLabel: 'kJ to kcal',
        fromUnit: 'Kilojoules (kJ)',
        toUnit: 'Kilocalories (kcal)',
        sampleInput: 1000,
        anchorId: 'pair-kj-to-kcal',
        factorSummary: '1 kcal = 4.184 kJ (exact)',
      },
      {
        id: 'kwh-to-j',
        label: 'Kilowatt-hours to Joules',
        abbrLabel: 'kWh to J',
        fromUnit: 'Kilowatt-hours (kWh)',
        toUnit: 'Joules (J)',
        sampleInput: 1,
        anchorId: 'pair-kwh-to-j',
        factorSummary: '1 kWh = 3,600,000 J',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 1,
        fromUnit: 'Calories (cal)',
        fromAbbr: 'cal',
        toUnit: 'Kilocalories (kcal)',
        toAbbr: 'kcal',
        keywordLabel: '1 cal to kcal',
        workingFormula: '1 ÷ 1,000',
      },
      {
        inputValue: 1,
        fromUnit: 'Joules (J)',
        fromAbbr: 'J',
        toUnit: 'Calories (cal)',
        toAbbr: 'cal',
        keywordLabel: '1 J to calories',
        workingFormula: '1 ÷ 4.184',
      },
      {
        inputValue: 1,
        fromUnit: 'Kilocalories (kcal)',
        fromAbbr: 'kcal',
        toUnit: 'Joules (J)',
        toAbbr: 'J',
        keywordLabel: '1 kcal to joules',
        workingFormula: '1 × 4,184',
      },
      {
        inputValue: 259,
        fromUnit: 'Kilocalories (kcal)',
        fromAbbr: 'kcal',
        toUnit: 'Calories (cal)',
        toAbbr: 'cal',
        keywordLabel: '259 kcal to calories',
        workingFormula: '259 × 1,000',
      },
      {
        inputValue: 300,
        fromUnit: 'Kilocalories (kcal)',
        fromAbbr: 'kcal',
        toUnit: 'Calories (cal)',
        toAbbr: 'cal',
        keywordLabel: '300 kcal to calories',
        workingFormula: '300 × 1,000',
      },
      {
        inputValue: 500,
        fromUnit: 'Kilocalories (kcal)',
        fromAbbr: 'kcal',
        toUnit: 'Calories (cal)',
        toAbbr: 'cal',
        keywordLabel: '500 kcal to calories',
        workingFormula: '500 × 1,000',
      },
      {
        inputValue: 1000,
        fromUnit: 'Kilojoules (kJ)',
        fromAbbr: 'kJ',
        toUnit: 'Kilocalories (kcal)',
        toAbbr: 'kcal',
        keywordLabel: '1000 kJ to kcal',
        workingFormula: '1,000 ÷ 4.184',
      },
      {
        inputValue: 1,
        fromUnit: 'Kilowatt-hours (kWh)',
        fromAbbr: 'kWh',
        toUnit: 'Joules (J)',
        toAbbr: 'J',
        keywordLabel: '1 kWh to J',
        workingFormula: '1 × 3,600,000',
      },
    ],
    unitGuide: [
      {
        unit: 'Joule',
        symbol: 'J',
        system: 'Metric (SI)',
        baseEquivalent: '1 J (1 N·m = 1 W·s)',
        commonUse: 'SI mechanical work equations, capacitor pulse ratings, and surge protector energy absorption.',
      },
      {
        unit: 'Kilojoule',
        symbol: 'kJ',
        system: 'Metric (SI)',
        baseEquivalent: '1,000 J (≈ 0.239 kcal)',
        commonUse: 'Food energy packaging labels in Australia, New Zealand, Europe, and South Africa.',
      },
      {
        unit: 'Kilocalorie (Food Calorie)',
        symbol: 'kcal (Cal)',
        system: 'Metric (SI)',
        baseEquivalent: '4,184 J (1,000 small cal)',
        commonUse: 'US/UK nutrition facts panels (written as "Calories") and fitness tracker expenditure.',
      },
      {
        unit: 'Small Calorie (Thermochemical)',
        symbol: 'cal',
        system: 'Metric (SI)',
        baseEquivalent: '4.184 J (0.001 kcal)',
        commonUse: 'Chemistry calorimetry experiments measuring the energy to heat 1 gram of water by 1 °C.',
      },
      {
        unit: 'Watt-hour',
        symbol: 'Wh',
        system: 'Metric (SI)',
        baseEquivalent: '3,600 J (0.001 kWh)',
        commonUse: 'Laptop battery airline limits (100 Wh) and portable power bank ratings.',
      },
      {
        unit: 'Kilowatt-hour',
        symbol: 'kWh',
        system: 'Metric (SI)',
        baseEquivalent: '3,600,000 J (3.6 MJ)',
        commonUse: 'Residential utility electricity meters and electric vehicle battery pack capacities.',
      },
      {
        unit: 'BTU (International Table)',
        symbol: 'BTU',
        system: 'US Customary / Imperial',
        baseEquivalent: '1,055.05585 J',
        commonUse: 'Residential gas furnaces, air conditioner cooling capacities, and outdoor grill burners.',
      },
    ],
    comparisonBox: {
      title: 'Food Calorie (kcal) vs. Chemistry Small Calorie (cal)',
      unitALabel: 'Kilocalorie (kcal / uppercase "Calorie") = 4,184 J',
      unitADetail:
        'On food labels, "1 Calorie" is actually 1 kilocalorie (1,000 thermochemical calories), equal to 4.184 kilojoules (4,184 J). A 259 kcal snack contains 259,000 small calories.',
      unitBLabel: 'Small Calorie (cal / gram calorie) = 4.184 J',
      unitBDetail:
        'Used in chemistry and physics: the thermal energy required to raise the temperature of 1 gram of water by 1 °C. 1 joule equals about 0.239006 small calories.',
      takeaway:
        'Divide small calories by 1,000 for kcal, or multiply kilocalories by 4.184 to get kilojoules (kJ).',
    },
    formulaCard: {
      introText: 'Divide joules by 1,000 for kilojoules, or divide kilojoules by 4.184 for kilocalories:',
      formulaText: 'kJ = J ÷ 1,000   |   kcal = kJ ÷ 4.184   |   1 kcal = 1,000 cal',
      exampleTitle: 'Convert 1,000 kJ to Kilocalories (kcal):',
      exampleSteps: [
        '1 thermochemical kilocalorie = 4.184 kilojoules (NIST SP 811)',
        'kcal = 1,000 ÷ 4.184',
        'Result = 239.0057 kcal',
      ],
    },
    howItWorks: {
      paragraph:
        'All energy inputs are normalized to Joules (J) and converted using thermochemical (1 cal = 4.184 J) and International Steam Table factors from NIST SP 811.',
      formulaBox: '1 kcal = 1,000 cal = 4,184 J   |   1 kWh = 3,600,000 J   |   1 BTU = 1,055.06 J',
      closingNote: 'For rotational force (N·m to ft-lb), use our dedicated Torque Converter (/conversions/torque).',
    },
    faqs: [
      {
        question: 'How do you convert kilojoules (kJ) to joules (J) and vice versa?',
        answer:
          'Multiply kilojoules by 1,000 to get joules (1 kJ = 1,000 J), or divide joules by 1,000 to get kilojoules.',
      },
      {
        question: 'How many small calories are in 259 kcal?',
        answer:
          'Because 1 kilocalorie equals 1,000 small calories, 259 kcal equals 259,000 small calories (or 259 dietary food Calories).',
      },
      {
        question: 'How many joules are in 1 calorie and 1 kilocalorie?',
        answer:
          '1 small thermochemical calorie equals 4.184 joules (so 1 J ≈ 0.239 cal), and 1 kilocalorie (kcal) equals 4,184 joules.',
      },
      {
        question: 'How many joules are in 1 kilowatt-hour (kWh)?',
        answer:
          '1 kilowatt-hour equals 3,600,000 joules (3.6 megajoules), calculated as 1,000 watts × 3,600 seconds.',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Kilojoules to Joules & Calories Converter (kJ, kcal) | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert kilojoules to joules (kJ to J), kilocalories to calories (kcal to cal), joules to calories, and kWh to joules using NIST SP 811 factors.',
      beforeH1: 'Unit Converter',
      afterH1: 'Kilojoules, Joules, and Calories Energy Converter',
      keywordsPlaced: [
        { keyword: 'kj to j / kilojoules to joules', zone: 'Title / H1 / Meta / Top 1-Line Answer / Pair Card 1 / FAQ 1' },
        { keyword: 'j to kj', zone: 'Pair Card 2 / Formula Card / FAQ 1' },
        { keyword: 'kcal to cal / kcal of cal', zone: 'Title / Meta / Top 1-Line Answer / Pair Card 3 / Comparison Box' },
        { keyword: 'j in calories / joules to cal / cal to joules', zone: 'Meta / Pair Card 4 / Common-Values Table / FAQ 3' },
        { keyword: 'kj to kilocalories / kilocalories to kilojoules', zone: 'Pair Card 5 / Common-Values Table / Formula Card' },
        { keyword: 'kwh to j', zone: 'Meta / Pair Card 6 / Common-Values Table / FAQ 4' },
        { keyword: '1 cal to kcal', zone: 'Common-Values Table' },
        { keyword: '1 j to calories', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '1 kcal to joules', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '259 kcal to calories', zone: 'Common-Values Table / Comparison Box / FAQ 2' },
        { keyword: '300 kcal to calories', zone: 'Common-Values Table' },
        { keyword: '500 kcal to calories', zone: 'Common-Values Table' },
      ],
      keywordsSkipped: [
        { keyword: 'joule en calorie', reason: 'Flagged non-English ("en" French) — covered in English as Joules to Calories' },
        { keyword: 'to j', reason: 'Incomplete fragment query' },
      ],
      calculationsVerified: [
        { label: '1 cal to kcal', working: '1 / 1,000', result: '0.001 kcal' },
        { label: '1 J to cal', working: '1 / 4.184', result: '0.2390 cal' },
        { label: '1 kcal to J', working: '1 × 4,184', result: '4,184 J' },
        { label: '259 kcal to cal', working: '259 × 1,000', result: '259,000 cal' },
        { label: '300 kcal to cal', working: '300 × 1,000', result: '300,000 cal' },
        { label: '500 kcal to cal', working: '500 × 1,000', result: '500,000 cal' },
        { label: '1,000 kJ to kcal', working: '1,000 / 4.184', result: '239.0057 kcal' },
        { label: '1 kWh to J', working: '1,000 × 3,600', result: '3,600,000 J' },
      ],
    },
  },

  'fuel-economy': {
    slug: 'fuel-economy',
    canonicalPath: '/conversions/fuel-economy',
    categoryLabel: 'Automotive & Fuel',
    shortLabel: 'Fuel Economy',
    metaTitle: 'L/100km to MPG Converter (L/100km to mpg, km/L) | SolveIt',
    metaDescription:
      'Convert liters per 100 km to miles per gallon (L/100km to US & UK mpg), MPG to km/L, and km/L to MPG with the exact 235.2146 NIST SP 811 formula.',
    ogTitle: 'L/100km to MPG Converter (L/100km to mpg, km/L) | SolveIt',
    ogDescription:
      'Convert liters per 100 km to miles per gallon (L/100km to US & UK mpg), MPG to km/L, and km/L to MPG with the exact 235.2146 NIST SP 811 formula.',
    h1: 'L/100km to MPG and km/L Fuel Economy',
    h1Highlight: 'Converter',
    subtitle:
      'Convert vehicle fuel consumption and efficiency between Liters per 100 km (L/100km), US Miles per Gallon (MPG), UK Imperial MPG, and Kilometers per Liter (km/L) using NIST SP 811 factors.',
    topQuestionBanner: {
      question: 'How do you convert L/100km to US MPG and 30 MPG to km/L?',
      oneLineAnswer:
        'Divide 235.214583 by L/100km to get US MPG (8 L/100km = 29.40 MPG), and multiply US MPG by 0.425144 to get km/L (30 MPG = 12.75 km/L).',
    },
    defaultFromUnit: 'Liters per 100 km (L/100km)',
    defaultToUnit: 'US Miles per Gallon (MPG US)',
    defaultInputValue: '8',
    baseUnitLabel: 'Kilometers per Liter (km/L)',
    units: [
      'Liters per 100 km (L/100km)',
      'US Miles per Gallon (MPG US)',
      'Kilometers per Liter (km/L)',
      'UK Imperial MPG (MPG UK)',
    ],
    // Base is km/L; note that L/100km is an inverse relation (100 / val)
    toBase: (v, u) => {
      if (v <= 0) return 0;
      if (u === 'Kilometers per Liter (km/L)') return v;
      if (u === 'Liters per 100 km (L/100km)') return 100 / v;
      if (u === 'US Miles per Gallon (MPG US)') return v * (1.609344 / 3.785411784);
      if (u === 'UK Imperial MPG (MPG UK)') return v * (1.609344 / 4.54609);
      return v;
    },
    fromBase: (b, u) => {
      if (b <= 0) return 0;
      if (u === 'Kilometers per Liter (km/L)') return b;
      if (u === 'Liters per 100 km (L/100km)') return 100 / b;
      if (u === 'US Miles per Gallon (MPG US)') return b / (1.609344 / 3.785411784);
      if (u === 'UK Imperial MPG (MPG UK)') return b / (1.609344 / 4.54609);
      return b;
    },
    popularPairs: [
      {
        id: 'l100km-to-mpg',
        label: 'L/100km to US MPG',
        abbrLabel: 'L/100km to mpg',
        fromUnit: 'Liters per 100 km (L/100km)',
        toUnit: 'US Miles per Gallon (MPG US)',
        sampleInput: 8,
        anchorId: 'pair-l100km-to-mpg',
        factorSummary: 'MPG (US) = 235.2146 ÷ (L/100km)',
      },
      {
        id: 'mpg-to-l100km',
        label: 'US MPG to L/100km',
        abbrLabel: 'mpg to L/100km',
        fromUnit: 'US Miles per Gallon (MPG US)',
        toUnit: 'Liters per 100 km (L/100km)',
        sampleInput: 30,
        anchorId: 'pair-mpg-to-l100km',
        factorSummary: 'L/100km = 235.2146 ÷ MPG (US)',
      },
      {
        id: 'mpg-to-kml',
        label: 'US MPG to Kilometers per Liter',
        abbrLabel: 'mpg to km/L',
        fromUnit: 'US Miles per Gallon (MPG US)',
        toUnit: 'Kilometers per Liter (km/L)',
        sampleInput: 30,
        anchorId: 'pair-mpg-to-kml',
        factorSummary: '1 MPG (US) = 0.425144 km/L',
      },
      {
        id: 'kml-to-mpg',
        label: 'Kilometers per Liter to US MPG',
        abbrLabel: 'km/L to mpg',
        fromUnit: 'Kilometers per Liter (km/L)',
        toUnit: 'US Miles per Gallon (MPG US)',
        sampleInput: 15,
        anchorId: 'pair-kml-to-mpg',
        factorSummary: '1 km/L = 2.352146 MPG (US)',
      },
      {
        id: 'kml-to-l100km',
        label: 'km/L to L/100km',
        abbrLabel: 'km/L to L/100km',
        fromUnit: 'Kilometers per Liter (km/L)',
        toUnit: 'Liters per 100 km (L/100km)',
        sampleInput: 12.5,
        anchorId: 'pair-kml-to-l100km',
        factorSummary: 'L/100km = 100 ÷ (km/L)',
      },
      {
        id: 'l100km-to-ukmpg',
        label: 'L/100km to UK Imperial MPG',
        abbrLabel: 'L/100km to UK mpg',
        fromUnit: 'Liters per 100 km (L/100km)',
        toUnit: 'UK Imperial MPG (MPG UK)',
        sampleInput: 8,
        anchorId: 'pair-l100km-to-ukmpg',
        factorSummary: 'MPG (UK) = 282.4809 ÷ (L/100km)',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 5,
        fromUnit: 'Liters per 100 km (L/100km)',
        fromAbbr: 'L/100km',
        toUnit: 'US Miles per Gallon (MPG US)',
        toAbbr: 'MPG (US)',
        keywordLabel: '5 L/100km to mpg',
        workingFormula: '235.214583 ÷ 5',
      },
      {
        inputValue: 6,
        fromUnit: 'Liters per 100 km (L/100km)',
        fromAbbr: 'L/100km',
        toUnit: 'US Miles per Gallon (MPG US)',
        toAbbr: 'MPG (US)',
        keywordLabel: '6 L/100km to mpg',
        workingFormula: '235.214583 ÷ 6',
      },
      {
        inputValue: 7,
        fromUnit: 'Liters per 100 km (L/100km)',
        fromAbbr: 'L/100km',
        toUnit: 'US Miles per Gallon (MPG US)',
        toAbbr: 'MPG (US)',
        keywordLabel: '7 L/100km to mpg',
        workingFormula: '235.214583 ÷ 7',
      },
      {
        inputValue: 8,
        fromUnit: 'Liters per 100 km (L/100km)',
        fromAbbr: 'L/100km',
        toUnit: 'US Miles per Gallon (MPG US)',
        toAbbr: 'MPG (US)',
        keywordLabel: '8 L/100km to mpg',
        workingFormula: '235.214583 ÷ 8',
      },
      {
        inputValue: 10,
        fromUnit: 'Liters per 100 km (L/100km)',
        fromAbbr: 'L/100km',
        toUnit: 'US Miles per Gallon (MPG US)',
        toAbbr: 'MPG (US)',
        keywordLabel: '10 L/100km to mpg',
        workingFormula: '235.214583 ÷ 10',
      },
      {
        inputValue: 30,
        fromUnit: 'US Miles per Gallon (MPG US)',
        fromAbbr: 'MPG (US)',
        toUnit: 'Kilometers per Liter (km/L)',
        toAbbr: 'km/L',
        keywordLabel: '30 mpg in kmpl',
        workingFormula: '30 × 0.4251437',
      },
      {
        inputValue: 30,
        fromUnit: 'US Miles per Gallon (MPG US)',
        fromAbbr: 'MPG (US)',
        toUnit: 'Liters per 100 km (L/100km)',
        toAbbr: 'L/100km',
        keywordLabel: '30 mpg us to L/100km',
        workingFormula: '235.214583 ÷ 30',
      },
      {
        inputValue: 15,
        fromUnit: 'Kilometers per Liter (km/L)',
        fromAbbr: 'km/L',
        toUnit: 'US Miles per Gallon (MPG US)',
        toAbbr: 'MPG (US)',
        keywordLabel: '15 km/L to mpg',
        workingFormula: '15 × 2.3521458',
      },
    ],
    unitGuide: [
      {
        unit: 'Liters per 100 km',
        symbol: 'L/100km',
        system: 'Metric (SI)',
        baseEquivalent: '100 ÷ (km/L)',
        commonUse: 'Official vehicle fuel consumption stickers in Canada, Europe, China, and Australia (lower numbers indicate better efficiency).',
      },
      {
        unit: 'US Miles per Gallon',
        symbol: 'MPG (US)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.4251437 km/L (235.2146 ÷ L/100km)',
        commonUse: 'EPA window sticker city/highway fuel economy ratings in the United States (based on the 3.7854-liter US gallon).',
      },
      {
        unit: 'Kilometers per Liter',
        symbol: 'km/L (kmpl)',
        system: 'Metric (SI)',
        baseEquivalent: '1 km/L (base distance-per-volume)',
        commonUse: 'Automotive and motorcycle fuel efficiency displays in Japan, India, Brazil, and Latin America.',
      },
      {
        unit: 'UK Imperial MPG',
        symbol: 'MPG (UK)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.354006 km/L (282.4809 ÷ L/100km)',
        commonUse: 'Vehicle fuel economy figures in the United Kingdom and Ireland (based on the 4.5461-liter Imperial gallon).',
      },
    ],
    comparisonBox: {
      title: 'US MPG (235.21 ÷ L/100km) vs. UK Imperial MPG (282.48 ÷ L/100km)',
      unitALabel: 'US Miles per Gallon (3.78541 L per US gal)',
      unitADetail:
        'Uses the 231-cubic-inch US liquid gallon. At 8 L/100km (12.5 km/L), a car achieves 29.40 US MPG (235.214583 ÷ 8).',
      unitBLabel: 'UK Imperial MPG (4.54609 L per Imp gal)',
      unitBDetail:
        'Uses the larger UK Imperial gallon (+20.1% volume). At the same 8 L/100km, the identical car is rated at 35.31 UK MPG (282.480936 ÷ 8).',
      takeaway:
        'Always check whether an MPG rating uses US or UK gallons: 1 US MPG = 1.20095 UK MPG = 0.425144 km/L.',
    },
    formulaCard: {
      introText: 'Divide 235.214583 by L/100km for US MPG, or multiply US MPG by 0.4251437 for km/L:',
      formulaText: 'US MPG = 235.214583 ÷ (L/100km)   |   km/L = US MPG × 0.4251437',
      exampleTitle: 'Convert 30 US MPG to km/L and L/100km:',
      exampleSteps: [
        '1 US MPG = 1.609344 km ÷ 3.785411784 L = 0.4251437 km/L',
        'km/L = 30 × 0.4251437 = 12.7543 km/L',
        'L/100km = 235.214583 ÷ 30 = 7.8405 L/100km',
      ],
    },
    howItWorks: {
      paragraph:
        'L/100km measures fuel volume consumed per 100 km (an inverse relationship), whereas MPG and km/L measure distance traveled per unit of fuel.',
      formulaBox: 'MPG (US) = 235.214583 ÷ (L/100km)   |   MPG (US) = km/L × 2.352146   |   L/100km = 100 ÷ (km/L)',
      closingNote: 'Conversion factors follow NIST SP 811 (1 mi = 1.609344 km, 1 US gal = 3.785411784 L, 1 UK gal = 4.54609 L).',
    },
    faqs: [
      {
        question: 'How do I convert L/100km to US MPG?',
        answer:
          'Divide 235.214583 by the L/100km value; for example, 8 L/100km equals 29.40 US MPG (235.214583 / 8 = 29.4018 MPG).',
      },
      {
        question: 'What is 30 MPG in km/L (kmpl)?',
        answer:
          '30 US MPG is about 12.75 km/L (30 × 0.4251437 = 12.7543 km/L), which corresponds to 7.84 L/100km.',
      },
      {
        question: 'How do you convert km/L to MPG?',
        answer:
          'Multiply kilometers per liter by 2.3521458 for US MPG (for example, 15 km/L × 2.3521458 = 35.28 US MPG).',
      },
      {
        question: 'How do you convert km/L to L/100km?',
        answer:
          'Divide 100 by the km/L value; for example, 12.5 km/L equals 8 L/100km (100 / 12.5 = 8).',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'L/100km to MPG Converter (L/100km to mpg, km/L) | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert liters per 100 km to miles per gallon (L/100km to US & UK mpg), MPG to km/L, and km/L to MPG with the exact 235.2146 NIST SP 811 formula.',
      beforeH1: 'Unit Converter',
      afterH1: 'L/100km to MPG and km/L Fuel Economy Converter',
      keywordsPlaced: [
        { keyword: 'l100km to mpg / l/100km to mpg / liters to 100km to mpg', zone: 'Title / H1 / Meta / Top 1-Line Answer / Pair Card 1 / FAQ 1' },
        { keyword: 'mpg us to l/100 / miles per gallon to liters per 100', zone: 'Pair Card 2 / Common-Values Table' },
        { keyword: 'mpg to kml / miles per gallon to kmpl', zone: 'Title / H1 / Meta / Pair Card 3 / Formula Card / FAQ 2' },
        { keyword: 'km/l to mpg / kml to mpg', zone: 'Meta / Pair Card 4 / Common-Values Table / FAQ 3' },
        { keyword: 'km/litre to litres/100km', zone: 'Pair Card 5 / FAQ 4' },
        { keyword: '30 mpg in kmpl', zone: 'Top 1-Line Answer / Common-Values Table / Formula Card / FAQ 2' },
      ],
      keywordsSkipped: [
        { keyword: 'km/100l to mpg', reason: 'Inverted unit phrasing — answered via L/100km and km/L' },
      ],
      calculationsVerified: [
        { label: '5 L/100km to US MPG', working: '235.214583 / 5', result: '47.0429 MPG' },
        { label: '6 L/100km to US MPG', working: '235.214583 / 6', result: '39.2024 MPG' },
        { label: '7 L/100km to US MPG', working: '235.214583 / 7', result: '33.6021 MPG' },
        { label: '8 L/100km to US MPG', working: '235.214583 / 8', result: '29.4018 MPG' },
        { label: '10 L/100km to US MPG', working: '235.214583 / 10', result: '23.5215 MPG' },
        { label: '30 US MPG to km/L', working: '30 × (1.609344 / 3.785411784)', result: '12.7543 km/L' },
        { label: '30 US MPG to L/100km', working: '235.214583 / 30', result: '7.8405 L/100km' },
        { label: '15 km/L to US MPG', working: '15 × 2.35214583', result: '35.2822 MPG' },
      ],
    },
  },

  torque: {
    slug: 'torque',
    canonicalPath: '/conversions/torque',
    categoryLabel: 'Torque & Rotational Force',
    shortLabel: 'Torque',
    metaTitle: 'Newton-Meters to Foot-Pounds Converter (N·m to ft-lb) | SolveIt',
    metaDescription:
      'Convert Newton-meters to foot-pounds (N·m to ft-lbs), foot-pounds to N·m, and Newton-meters to inch-pounds (in-lbs) using exact NIST SP 811 factors.',
    ogTitle: 'Newton-Meters to Foot-Pounds Converter (N·m to ft-lb) | SolveIt',
    ogDescription:
      'Convert Newton-meters to foot-pounds (N·m to ft-lbs), foot-pounds to N·m, and Newton-meters to inch-pounds (in-lbs) using exact NIST SP 811 factors.',
    h1: 'Newton-Meters to Foot-Pounds Torque',
    h1Highlight: 'Converter',
    subtitle:
      'Convert automotive, bicycle, and mechanical fastener torque settings between Newton-meters (N·m), Foot-pounds (ft-lb), and Inch-pounds (in-lb) using factors that follow NIST SP 811.',
    topQuestionBanner: {
      question: 'How many foot-pounds is 25 N·m, and how do you convert N·m to ft-lbs?',
      oneLineAnswer:
        '25 N·m is about 18.44 foot-pounds (25 ÷ 1.355818 = 18.4391 ft-lbs); multiply any N·m value by 0.73756215 to get ft-lbs.',
    },
    defaultFromUnit: 'Newton-meters (N·m)',
    defaultToUnit: 'Foot-pounds (ft-lb)',
    defaultInputValue: '25',
    baseUnitLabel: 'Newton-meters (N·m)',
    units: ['Newton-meters (N·m)', 'Foot-pounds (ft-lb)', 'Inch-pounds (in-lb)'],
    toBase: (v, u) => {
      const factors: Record<string, number> = {
        'Newton-meters (N·m)': 1,
        'Foot-pounds (ft-lb)': 1.3558179483314,
        'Inch-pounds (in-lb)': 1.3558179483314 / 12,
      };
      return v * (factors[u] ?? 1);
    },
    fromBase: (b, u) => {
      const factors: Record<string, number> = {
        'Newton-meters (N·m)': 1,
        'Foot-pounds (ft-lb)': 1 / 1.3558179483314,
        'Inch-pounds (in-lb)': 12 / 1.3558179483314,
      };
      return b * (factors[u] ?? 1);
    },
    popularPairs: [
      {
        id: 'nm-to-ftlb',
        label: 'Newton-meters to Foot-pounds',
        abbrLabel: 'N·m to ft-lb',
        fromUnit: 'Newton-meters (N·m)',
        toUnit: 'Foot-pounds (ft-lb)',
        sampleInput: 25,
        anchorId: 'pair-nm-to-ftlb',
        factorSummary: '1 N·m = 0.737562 ft-lb',
      },
      {
        id: 'ftlb-to-nm',
        label: 'Foot-pounds to Newton-meters',
        abbrLabel: 'ft-lb to N·m',
        fromUnit: 'Foot-pounds (ft-lb)',
        toUnit: 'Newton-meters (N·m)',
        sampleInput: 15,
        anchorId: 'pair-ftlb-to-nm',
        factorSummary: '1 ft-lb = 1.355818 N·m',
      },
      {
        id: 'nm-to-inlb',
        label: 'Newton-meters to Inch-pounds',
        abbrLabel: 'N·m to in-lb',
        fromUnit: 'Newton-meters (N·m)',
        toUnit: 'Inch-pounds (in-lb)',
        sampleInput: 10,
        anchorId: 'pair-nm-to-inlb',
        factorSummary: '1 N·m = 8.850746 in-lb',
      },
      {
        id: 'inlb-to-nm',
        label: 'Inch-pounds to Newton-meters',
        abbrLabel: 'in-lb to N·m',
        fromUnit: 'Inch-pounds (in-lb)',
        toUnit: 'Newton-meters (N·m)',
        sampleInput: 120,
        anchorId: 'pair-inlb-to-nm',
        factorSummary: '1 in-lb = 0.112985 N·m',
      },
      {
        id: 'ftlb-to-inlb',
        label: 'Foot-pounds to Inch-pounds',
        abbrLabel: 'ft-lb to in-lb',
        fromUnit: 'Foot-pounds (ft-lb)',
        toUnit: 'Inch-pounds (in-lb)',
        sampleInput: 10,
        anchorId: 'pair-ftlb-to-inlb',
        factorSummary: '1 ft-lb = 12 in-lb (exact)',
      },
      {
        id: 'inlb-to-ftlb',
        label: 'Inch-pounds to Foot-pounds',
        abbrLabel: 'in-lb to ft-lb',
        fromUnit: 'Inch-pounds (in-lb)',
        toUnit: 'Foot-pounds (ft-lb)',
        sampleInput: 120,
        anchorId: 'pair-inlb-to-ftlb',
        factorSummary: '12 in-lb = 1 ft-lb (exact)',
      },
    ],
    commonValueSpecs: [
      {
        inputValue: 5,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Inch-pounds (in-lb)',
        toAbbr: 'in-lb',
        keywordLabel: '5 nm to in lbs',
        workingFormula: '5 × 8.850746',
      },
      {
        inputValue: 8,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Inch-pounds (in-lb)',
        toAbbr: 'in-lb',
        keywordLabel: '8 nm to inch lbs',
        workingFormula: '8 × 8.850746',
      },
      {
        inputValue: 10,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Inch-pounds (in-lb)',
        toAbbr: 'in-lb',
        keywordLabel: '10 nm to inch pounds',
        workingFormula: '10 × 8.850746',
      },
      {
        inputValue: 12,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Inch-pounds (in-lb)',
        toAbbr: 'in-lb',
        keywordLabel: '12 nm to in lbs',
        workingFormula: '12 × 8.850746',
      },
      {
        inputValue: 20,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Foot-pounds (ft-lb)',
        toAbbr: 'ft-lb',
        keywordLabel: '20 nm in ft/lbs',
        workingFormula: '20 ÷ 1.355818',
      },
      {
        inputValue: 25,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Foot-pounds (ft-lb)',
        toAbbr: 'ft-lb',
        keywordLabel: '25 nm to ft lbs',
        workingFormula: '25 ÷ 1.355818',
      },
      {
        inputValue: 35,
        fromUnit: 'Newton-meters (N·m)',
        fromAbbr: 'N·m',
        toUnit: 'Foot-pounds (ft-lb)',
        toAbbr: 'ft-lb',
        keywordLabel: '35nm to ft lbs',
        workingFormula: '35 ÷ 1.355818',
      },
      {
        inputValue: 8,
        fromUnit: 'Foot-pounds (ft-lb)',
        fromAbbr: 'ft-lb',
        toUnit: 'Newton-meters (N·m)',
        toAbbr: 'N·m',
        keywordLabel: '8 ft lbs to nm',
        workingFormula: '8 × 1.355818',
      },
      {
        inputValue: 15,
        fromUnit: 'Foot-pounds (ft-lb)',
        fromAbbr: 'ft-lb',
        toUnit: 'Newton-meters (N·m)',
        toAbbr: 'N·m',
        keywordLabel: '15 foot pounds to newton meters',
        workingFormula: '15 × 1.355818',
      },
    ],
    unitGuide: [
      {
        unit: 'Newton-meter',
        symbol: 'N·m',
        system: 'Metric (SI)',
        baseEquivalent: '1 N·m (SI derived torque unit)',
        commonUse: 'Metric click-type torque wrenches, carbon bicycle stem/seatpost specs (such as 5 N·m to 12 N·m), and European/Asian automotive service manuals.',
      },
      {
        unit: 'Foot-pound (Pound-foot)',
        symbol: 'ft-lb (lbf·ft)',
        system: 'US Customary / Imperial',
        baseEquivalent: '1.35581795 N·m (12 in-lb)',
        commonUse: 'Wheel lug nut torque specifications, spark plugs, oil drain plugs (20–35 N·m), and cylinder head bolts.',
      },
      {
        unit: 'Inch-pound (Pound-inch)',
        symbol: 'in-lb (lbf·in)',
        system: 'US Customary / Imperial',
        baseEquivalent: '0.11298483 N·m (1/12 ft-lb)',
        commonUse: '1/4-inch drive micro torque wrenches for rifle scope rings, valve cover bolts, and small engine carburetors.',
      },
    ],
    comparisonBox: {
      title: 'Foot-Pounds (ft-lb) vs. Inch-Pounds (in-lb) & Torque (N·m) vs. Energy (Joules)',
      unitALabel: '1 Foot-Pound (ft-lb) = 12 Inch-Pounds (in-lb) = 1.3558 N·m',
      unitADetail:
        'Never confuse ft-lb and in-lb when setting a wrench: 1 ft-lb is 12 times stronger than 1 in-lb. For example, 10 N·m equals 88.51 in-lb, or just 7.38 ft-lb.',
      unitBLabel: 'Torque (N·m, vector cross product) vs. Work/Energy (Joule, scalar)',
      unitBDetail:
        'Although both have dimensions of force × distance, NIST SP 811 specifies that torque is a rotational moment (Newton-meter, N·m) and must never be expressed in Joules.',
      takeaway:
        'For small fasteners under 20 N·m (such as 5 N·m, 8 N·m, or 10 N·m), convert to inch-pounds (× 8.8507) rather than foot-pounds for better wrench accuracy.',
    },
    formulaCard: {
      introText: 'Divide Newton-meters by 1.35581795 for foot-pounds, or multiply N·m by 8.85074579 for inch-pounds:',
      formulaText: 'ft-lb = N·m ÷ 1.355818   |   in-lb = N·m × 8.850746',
      exampleTitle: 'Convert 25 N·m to Foot-Pounds (ft-lb):',
      exampleSteps: [
        '1 foot-pound = 1.35581795 Newton-meters (NIST SP 811)',
        'Foot-pounds = 25 ÷ 1.35581795 (or 25 × 0.73756215)',
        'Result = 18.4391 ft-lb (about 18.44 ft-lbs, or 221.27 in-lbs)',
      ],
    },
    howItWorks: {
      paragraph:
        'Torque conversion factors are derived from the international foot (0.3048 m), avoirdupois pound (0.45359237 kg), and standard acceleration of gravity (9.80665 m/s²) per NIST SP 811.',
      formulaBox: '1 ft-lb = 1.35581795 N·m   |   1 N·m = 0.73756215 ft-lb = 8.85074579 in-lb',
      closingNote: 'To convert foot-pounds to inch-pounds, multiply by 12; to convert inch-pounds to foot-pounds, divide by 12.',
    },
    faqs: [
      {
        question: 'How many foot-pounds is 25 N·m, 20 N·m, and 35 N·m?',
        answer:
          'Divide by 1.355818: 25 N·m is about 18.44 ft-lbs (25 / 1.355818 = 18.4391), 20 N·m is about 14.75 ft-lbs, and 35 N·m is about 25.81 ft-lbs.',
      },
      {
        question: 'How many inch-pounds is 10 N·m and 5 N·m?',
        answer:
          'Multiply Newton-meters by 8.850746: 10 N·m equals about 88.51 inch-pounds (10 × 8.850746) and 5 N·m equals about 44.25 inch-pounds.',
      },
      {
        question: 'How do you convert 8 ft-lbs and 15 ft-lbs to Newton-meters?',
        answer:
          'Multiply foot-pounds by 1.355818: 8 ft-lbs is about 10.85 N·m (8 × 1.355818 = 10.8465 N·m) and 15 ft-lbs is about 20.34 N·m.',
      },
      {
        question: 'How do I convert inch-pounds (in-lbs) to Newton-meters (N·m)?',
        answer:
          'Multiply inch-pounds by 0.11298483 (or divide by 8.850746); for example, 100 in-lbs equals about 11.30 N·m.',
      },
    ],
    auditReport: {
      beforeTitle: 'Unit Converter - Length, Weight, Temperature, Speed & Area',
      afterTitle: 'Newton-Meters to Foot-Pounds Converter (N·m to ft-lb) | SolveIt',
      beforeMeta: 'Instant conversion between Metric and Imperial units for everyday calculations.',
      afterMeta:
        'Convert Newton-meters to foot-pounds (N·m to ft-lbs), foot-pounds to N·m, and Newton-meters to inch-pounds (in-lbs) using exact NIST SP 811 factors.',
      beforeH1: 'Unit Converter',
      afterH1: 'Newton-Meters to Foot-Pounds Torque Converter',
      keywordsPlaced: [
        { keyword: 'nm ft pounds / newton meters to foot pounds', zone: 'Title / H1 / Meta / Pair Card 1' },
        { keyword: 'ft lb to nm / conversion from lb ft to nm / foot-pound to nm', zone: 'Meta / Pair Card 2 / FAQ 3' },
        { keyword: 'nm to inlb / 10 nm to inch pounds', zone: 'Meta / Pair Card 3 / Common-Values Table / FAQ 2' },
        { keyword: 'in lbs to nm / lb in to nm', zone: 'Pair Card 4 / FAQ 4' },
        { keyword: '5 nm in in lbs', zone: 'Common-Values Table / Unit Guide (N·m) / FAQ 2' },
        { keyword: '8 nm to inch lbs', zone: 'Common-Values Table' },
        { keyword: '12 nm to in lbs', zone: 'Common-Values Table / Unit Guide (N·m)' },
        { keyword: '20 nm in ft/lbs', zone: 'Common-Values Table / FAQ 1' },
        { keyword: '25 nm to ft lbs', zone: 'Top 1-Line Answer / Common-Values Table / Formula Card / FAQ 1' },
        { keyword: '35nm to ft lbs', zone: 'Common-Values Table / FAQ 1' },
        { keyword: '8 ft lbs to nm', zone: 'Common-Values Table / FAQ 3' },
        { keyword: '15 foot pounds to newton meters', zone: 'Common-Values Table / FAQ 3' },
      ],
      keywordsSkipped: [
        { keyword: '10 nm in lbs', reason: 'Ambiguous ("lbs" instead of "ft-lbs" or "in-lbs") — clarified in Comparison Box with both 7.38 ft-lbs and 88.51 in-lbs' },
      ],
      calculationsVerified: [
        { label: '5 N·m to in-lb', working: '5 × (12 / 1.35581795)', result: '44.2537 in-lb' },
        { label: '8 N·m to in-lb', working: '8 × (12 / 1.35581795)', result: '70.8060 in-lb' },
        { label: '10 N·m to in-lb', working: '10 × (12 / 1.35581795)', result: '88.5075 in-lb' },
        { label: '12 N·m to in-lb', working: '12 × (12 / 1.35581795)', result: '106.2089 in-lb' },
        { label: '20 N·m to ft-lb', working: '20 / 1.35581795', result: '14.7512 ft-lb' },
        { label: '25 N·m to ft-lb', working: '25 / 1.35581795', result: '18.4391 ft-lb' },
        { label: '35 N·m to ft-lb', working: '35 / 1.35581795', result: '25.8147 ft-lb' },
        { label: '8 ft-lb to N·m', working: '8 × 1.35581795', result: '10.8465 N·m' },
        { label: '15 ft-lb to N·m', working: '15 × 1.35581795', result: '20.3373 N·m' },
      ],
    },
  },
};

export const CONVERSION_CATEGORY_SLUGS = Object.keys(
  CONVERSION_CATEGORIES
) as ConversionCategorySlug[];

/** Resolve common aliases (e.g. weight-mass -> weight, volume-capacity -> volume) */
export function resolveConversionCategorySlug(
  rawSlug: string
): ConversionCategorySlug | null {
  const normalized = rawSlug.trim().toLowerCase();
  if (normalized in CONVERSION_CATEGORIES) {
    return normalized as ConversionCategorySlug;
  }
  const aliasMap: Record<string, ConversionCategorySlug> = {
    'weight-mass': 'weight',
    'mass-volume': 'cooking',
    'volume-capacity': 'volume',
    data: 'digital',
    temp: 'temperature',
    'length-converter': 'length',
    'weight-converter': 'weight',
    'temperature-converter': 'temperature',
  };
  return aliasMap[normalized] ?? null;
}

/** Dynamically compute every Common-Values Reference Table row using the category's own toBase/fromBase factors */
export function computeCommonValueRows(
  config: ConversionCategoryConfig
): ComputedCommonValueRow[] {
  return config.commonValueSpecs.map((spec) => {
    const baseVal = config.toBase(spec.inputValue, spec.fromUnit);
    const rawOutput = config.fromBase(baseVal, spec.toUnit);
    return {
      ...spec,
      rawOutput,
      computedOutput: formatConversionNumber(rawOutput, 4),
    };
  });
}
