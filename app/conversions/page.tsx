import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title: 'Unit Conversion Calculators: Metric & Imperial | SolveIt',
  description:
    'Convert metric and US imperial measurements across length, weight, temperature, cooking volume, area, speed, fuel economy, torque, energy, and digital storage.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions',
  },
  openGraph: {
    title: 'Unit Conversion Calculators: Metric & Imperial | SolveIt',
    description:
      'Convert length, weight, temperature, cooking ingredients, volume, area, speed, fuel economy, and digital storage with NIST conversion factors.',
    url: 'https://solveitcalculator.com/conversions',
    type: 'website',
  },
};

const UNIT_CONVERSION_CONFIG: CategoryHubConfig = {
  id: 'conversions',
  breadcrumbLabel: 'Unit Conversion',
  title: 'Unit Conversion Calculators',
  shortTitle: 'Unit Conversion',
  introduction:
    'Choose a converter below based on what you are measuring—whether you need to switch ruler dimensions between millimeters and inches, weigh parcels in kilograms or pounds, convert oven temperatures, or turn recipe cups into kitchen-scale grams.',
  searchPlaceholder:
    'Find a unit converter (e.g. length, weight, temperature, cups to grams, mpg...)',
  headerIconName: 'arrow-left-right',
  heroBadgeTopLeft: 'kg',
  heroBadgeBottomLeft: 'in↔cm',
  filters: [
    'All',
    'Length & Area',
    'Weight & Volume',
    'Cooking & Temperature',
    'Speed, Fuel & Power',
    'Digital & Data',
  ],
  tools: [
    {
      id: 'length-converter',
      name: 'Length & Distance Converter (mm, cm, m, in, ft, yd, mi)',
      description:
        'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.',
      href: '/conversions/length',
      category: 'Length & Area',
      displayBadge: 'Length & Distance',
      iconName: 'ruler',
      symbolText: 'in↔cm',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'area-converter',
      name: 'Area & Land Measurement Converter (sq ft, m², acres, ha)',
      description:
        'Convert square feet, square meters, square yards, acres, and hectares for rooms and land parcels.',
      href: '/conversions/area',
      category: 'Length & Area',
      displayBadge: 'Area & Land',
      iconName: 'ruler',
      symbolText: 'ft²↔m²',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'weight-mass-converter',
      name: 'Weight & Mass Converter (kg, g, mg, lbs, oz, stone)',
      description:
        'Convert kilograms, grams, milligrams, pounds, ounces, US tons, and imperial stones.',
      href: '/conversions/weight',
      category: 'Weight & Volume',
      displayBadge: 'Weight & Mass',
      iconName: 'scale',
      symbolText: 'kg↔lb',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'liquid-volume-converter',
      name: 'Liquid Volume & Capacity Converter (L, mL, gal, qt, pt, fl oz)',
      description:
        'Convert liters, milliliters, US gallons, quarts, pints, fluid ounces, and cubic meters.',
      href: '/conversions/volume',
      category: 'Weight & Volume',
      displayBadge: 'Liquid Volume',
      iconName: 'droplets',
      symbolText: 'L↔gal',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'cooking-measurement-converter',
      name: 'Cooking Volume Converter (Cups, Tbsp, Tsp & mL)',
      description:
        'Convert US customary cups, tablespoons, teaspoons, fluid ounces, and milliliters for kitchen liquids.',
      href: '/conversions/cooking',
      category: 'Cooking & Temperature',
      displayBadge: 'Cooking Volume',
      iconName: 'droplets',
      symbolText: 'cup↔mL',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
      isPopular: true,
    },
    {
      id: 'recipe-scaler-converter',
      name: 'Recipe Ingredient Weight Converter & Portion Scaler (Cups to Grams)',
      description:
        'Convert dry baking ingredients (flour, sugar, butter, oats) from cups to grams using ingredient density and scale servings.',
      href: '/recipe-converter',
      category: 'Cooking & Temperature',
      displayBadge: 'Baking & Density',
      iconName: 'scale',
      symbolText: 'cup→g',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'temperature-converter',
      name: 'Temperature Converter (Celsius, Fahrenheit & Kelvin)',
      description:
        'Convert °C, °F, and Kelvin temperatures for weather, baking ovens, fever checks, and lab work.',
      href: '/conversions/temperature',
      category: 'Cooking & Temperature',
      displayBadge: 'Temperature',
      iconName: 'thermometer',
      symbolText: '°C↔°F',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'speed-velocity-converter',
      name: 'Speed & Velocity Converter (mph, km/h, m/s, knots)',
      description:
        'Convert miles per hour, kilometers per hour, meters per second, and nautical knots.',
      href: '/conversions/speed',
      category: 'Speed, Fuel & Power',
      displayBadge: 'Speed',
      iconName: 'gauge',
      symbolText: 'mph',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'fuel-economy-converter',
      name: 'Fuel Economy & Consumption Converter (MPG ↔ L/100km)',
      description:
        'Convert between US MPG, UK Imperial MPG, kilometers per liter (km/L), and liters per 100 km.',
      href: '/conversions/fuel-economy',
      category: 'Speed, Fuel & Power',
      displayBadge: 'Fuel Economy',
      iconName: 'gauge',
      symbolText: 'MPG',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      id: 'torque-converter',
      name: 'Torque & Rotational Force Converter (Nm ↔ lb-ft & lb-in)',
      description:
        'Convert Newton-meters (Nm), foot-pounds (lb-ft), and inch-pounds (lb-in) for automotive torque wrenches.',
      href: '/conversions/torque',
      category: 'Speed, Fuel & Power',
      displayBadge: 'Automotive',
      iconName: 'gauge',
      symbolText: 'Nm',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'energy-work-converter',
      name: 'Energy, Work & Heat Converter (Joules, kWh, Calories, BTU)',
      description:
        'Convert Joules, kilojoules, kilowatt-hours (kWh), food kilocalories, and British Thermal Units (BTU).',
      href: '/conversions/energy',
      category: 'Speed, Fuel & Power',
      displayBadge: 'Energy & Power',
      iconName: 'zap',
      symbolText: 'J↔kWh',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
    },
    {
      id: 'digital-storage-converter',
      name: 'Digital Storage Converter (KB, MB, GB, TB & Binary GiB)',
      description:
        'Convert kilobytes, megabytes, gigabytes, and terabytes across decimal SI (1,000) and binary IEC (1,024) standards.',
      href: '/conversions/digital',
      category: 'Digital & Data',
      displayBadge: 'Data Storage',
      iconName: 'database',
      symbolText: 'GB↔TB',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
  ],
  relatedCategories: [
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Home & Construction',
      href: '/home-construction',
      iconName: 'home',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Science Calculators',
      href: '/science',
      iconName: 'flask',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
    },
    {
      name: 'Date & Time Calculators',
      href: '/date-time',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
  ],
  chooseGuideHeading: 'Which unit converter should I use?',
  chooseSteps: [
    {
      step: 1,
      title: 'Cooking Volume Converter vs. Recipe Weight Converter',
      description:
        'Use the Cooking Volume Converter when switching liquid spoons and cups to milliliters (1 cup = 236.59 mL). Use the Recipe Weight Converter when turning dry cups of flour, sugar, or oats into grams—because dry ingredients have different densities.',
    },
    {
      step: 2,
      title: 'Length Converter vs. Area Converter',
      description:
        'Use the Length Converter for 1D straight-line distances (inches, feet, meters). Use the Area Converter for 2D surfaces (square feet to square meters or acres), where the linear factor is squared (1 m² = 10.7639 sq ft).',
    },
    {
      step: 3,
      title: 'Weight & Mass Converter vs. Liquid Volume Converter',
      description:
        'Use Weight & Mass for shipping parcels and body weight (kg, lbs, oz). Use Liquid Volume for tank capacity and beverages (liters, US gallons, fluid ounces). Never equate fluid ounces (volume) with dryavoirdupois ounces (weight).',
    },
    {
      step: 4,
      title: 'Speed Converter vs. Fuel Economy Converter',
      description:
        'Use Speed Converter for travel velocity (mph to km/h). Use Fuel Economy Converter for inverse consumption metrics (US MPG to L/100km or UK Imperial gallons).',
    },
  ],
  matchingGuides: [
    {
      title: 'How to Convert Metric and Imperial Units Accurately',
      description:
        'Master NIST conversion factors for length, weight, volume, and temperature without rounding errors.',
      href: '/guides/how-to-convert-metric-and-imperial-units',
    },
    {
      title: 'How to Measure Room Area, Flooring, and Paint Coverage',
      description:
        'Learn how square feet, square meters, and cubic yards relate when estimating materials.',
      href: '/guides/how-to-measure-room-area-and-flooring',
    },
  ],
  faqs: [
    {
      question: 'How do I convert inches to centimeters and millimeters?',
      answer:
        'Multiply inches by 2.54 to get centimeters, or multiply inches by 25.4 to get millimeters. To convert millimeters back to inches, divide by 25.4.',
    },
    {
      question: 'How do I convert kilograms (kg) to pounds (lbs)?',
      answer:
        'Multiply kilograms by 2.20462262 to get pounds (for example, 70 kg × 2.20462 = 154.32 lbs). Divide pounds by 2.20462262 to convert back to kilograms.',
    },
    {
      question: 'What is the exact formula to convert Celsius (°C) to Fahrenheit (°F)?',
      answer:
        'Multiply the Celsius temperature by 9/5 (or 1.8) and add 32: °F = (°C × 1.8) + 32. To convert Fahrenheit to Celsius, subtract 32 first and multiply by 5/9.',
    },
    {
      question: 'Why does 1 cup of flour weigh fewer grams than 1 cup of sugar?',
      answer:
        'A cup measures volume (space), whereas grams measure mass. Because all-purpose flour is less dense than granulated sugar, 1 US cup of flour weighs about 120 grams while 1 US cup of sugar weighs 200 grams.',
    },
    {
      question: 'What is the difference between a US gallon and a UK Imperial gallon?',
      answer:
        'A US liquid gallon equals 3.78541 liters (128 US fluid ounces), whereas a UK Imperial gallon equals 4.54609 liters (160 Imperial fluid ounces)—making the UK gallon about 20% larger.',
    },
    {
      question: 'Why does a 1 TB hard drive show as 931 GB on my computer?',
      answer:
        'Storage manufacturers label drives using decimal SI units (1 TB = 1,000,000,000,000 bytes), while operating systems often report binary GiB (dividing by 1,024³), which equals 931.32 GiB.',
    },
  ],
};

export default function UnitConversionCategoryPage() {
  return <CategoryHubPageClient config={UNIT_CONVERSION_CONFIG} />;
}
