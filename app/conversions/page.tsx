import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title: 'Unit Conversion Calculators (mm to in, kg to lbs, °C to °F) | SolveIt',
  description:
    'Convert length (mm to inches, cm to in), weight (kg to lbs, grams to oz), temperature (°C to °F), cooking volume (tbsp to cups), fuel economy, and torque.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions',
  },
  openGraph: {
    title: 'Unit Conversion Calculators (mm to in, kg to lbs, °C to °F) | SolveIt',
    description:
      'Convert length (mm to inches, cm to in), weight (kg to lbs, grams to oz), temperature (°C to °F), cooking volume (tbsp to cups), fuel economy, and torque.',
    url: 'https://solveitcalculator.com/conversions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Conversion Calculators (mm to in, kg to lbs, °C to °F) | SolveIt',
    description: 'Convert length (mm to inches, cm to in), weight (kg to lbs, grams to oz), temperature (°C to °F), cooking volume (tbsp to cups), fuel economy, and torque.',
  },
};

export const CONVERSIONS_HUB_CONFIG: CategoryHubConfig = {
  id: 'conversions',
  breadcrumbLabel: 'Unit Conversions',
  title: 'Unit Conversion Calculators',
  shortTitle: 'Unit Conversions',
  introduction:
    'Convert measurements between metric, imperial, and US customary units. Every calculator uses conversion factors that follow NIST SP 811, worked formulas, and quick-load reference tables.',
  searchPlaceholder: 'Find a unit conversion calculator (e.g. mm to in, kg to lbs, °C to °F)',
  headerIconName: 'arrow-left-right',
  heroBadgeTopLeft: 'mm',
  heroBadgeBottomLeft: 'kg',
  filters: [
    'All',
    'Length & Distance',
    'Weight & Mass',
    'Temperature & Speed',
    'Volume & Cooking',
    'Area & Land',
    'Automotive & Torque',
    'Digital & Energy',
  ],
  tools: [
    {
      id: 'length-converter',
      name: 'Millimeters to Inches & Length Converter (mm, cm, ft, m)',
      description:
        'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), feet, meters, and kilometers with worked examples.',
      href: '/conversions/length',
      category: 'Length & Distance',
      displayBadge: 'Length',
      iconName: 'ruler',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'weight-mass-converter',
      name: 'Kilograms to Pounds & Weight Converter (kg to lbs, g, oz)',
      description:
        'Convert kilograms to pounds (kg to lbs), pounds to kilograms, grams to pounds, ounces, stone, and metric tons.',
      href: '/conversions/weight',
      category: 'Weight & Mass',
      displayBadge: 'Weight & Mass',
      iconName: 'scale',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'temperature-converter',
      name: 'Celsius to Fahrenheit & Temperature Converter (°C, °F, K)',
      description:
        'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius, and Kelvin with oven and weather reference tables.',
      href: '/conversions/temperature',
      category: 'Temperature & Speed',
      displayBadge: 'Temperature',
      iconName: 'thermometer',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
      isPopular: true,
    },
    {
      id: 'cooking-measurement-converter',
      name: 'Tablespoons to Cups & Cooking Converter (tbsp, tsp, cups)',
      description:
        'Convert kitchen tablespoons to cups, teaspoons, fluid ounces, and milliliters for cooking and baking.',
      href: '/conversions/cooking',
      category: 'Volume & Cooking',
      displayBadge: 'Cooking',
      iconName: 'droplets',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'recipe-converter',
      name: 'Ingredient-Aware Recipe Converter & Batch Scaler (Cups to Grams)',
      description:
        'Scale recipes by serving count and convert cups, tablespoons, and milliliters to grams using verified ingredient densities.',
      href: '/recipe-converter',
      category: 'Volume & Cooking',
      displayBadge: 'Cooking & Baking',
      iconName: 'scale',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'volume-liquid-converter',
      name: 'Liters to Gallons & Volume Converter (L, gal, qt, mL)',
      description:
        'Convert liters to US gallons, quarts to gallons, milliliters, fluid ounces, cubic feet, and cubic yards.',
      href: '/conversions/volume',
      category: 'Volume & Cooking',
      displayBadge: 'Volume',
      iconName: 'droplets',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'area-land-converter',
      name: 'Square Meters to Square Feet & Area Converter (m², ft², acres)',
      description:
        'Convert square meters to square feet, square yards, acres, hectares, and square kilometers.',
      href: '/conversions/area',
      category: 'Area & Land',
      displayBadge: 'Area',
      iconName: 'layers',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'speed-velocity-converter',
      name: 'Kilometers per Hour to mph & Speed Converter (km/h, mph, m/s)',
      description:
        'Convert kilometers per hour to miles per hour (km/h to mph), meters per second, feet per second, and knots.',
      href: '/conversions/speed',
      category: 'Temperature & Speed',
      displayBadge: 'Speed',
      iconName: 'gauge',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      id: 'fuel-economy-converter',
      name: 'Fuel Economy Converter (L/100km to MPG & km/L)',
      description:
        'Convert liters per 100 km to US and UK miles per gallon (L/100km to mpg) and kilometers per liter.',
      href: '/conversions/fuel-economy',
      category: 'Automotive & Torque',
      displayBadge: 'Fuel',
      iconName: 'gauge',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      id: 'torque-converter',
      name: 'Torque Converter (Newton-Meters to Foot-Pounds, N·m to ft-lb)',
      description:
        'Convert Newton-meters (N·m) to foot-pounds (ft-lb) and inch-pounds (in-lb) for fastener and engine specs.',
      href: '/conversions/torque',
      category: 'Automotive & Torque',
      displayBadge: 'Torque',
      iconName: 'zap',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'digital-storage-converter',
      name: 'Digital Data Storage Converter (MB to GB, TB, MiB, GiB)',
      description:
        'Convert bytes, kilobytes (KB), megabytes (MB), gigabytes (GB), and terabytes (TB) in decimal SI or binary IEC.',
      href: '/conversions/digital',
      category: 'Digital & Energy',
      displayBadge: 'Digital',
      iconName: 'database',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'energy-power-converter',
      name: 'Energy & Work Unit Converter (Joules, kJ, kcal, kWh, BTU)',
      description:
        'Convert joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours (kWh), and BTUs.',
      href: '/conversions/energy',
      category: 'Digital & Energy',
      displayBadge: 'Energy',
      iconName: 'zap',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
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
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Date & Time Calculators',
      href: '/date-time',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF0F0]',
      iconColor: 'text-[#E11D48]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Finance Calculators',
      href: '/finance',
      iconName: 'coins',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
  ],
  chooseGuideHeading: 'How to choose the right unit conversion calculator',
  chooseSteps: [
    {
      step: 1,
      title: 'Pick your measurement category',
      description:
        'Select Length, Weight, Temperature, Cooking, Liquid Volume, Area, Speed, Fuel Economy, or Torque.',
    },
    {
      step: 2,
      title: 'Use Cooking for cups and spoons',
      description:
        'Open /conversions/cooking for cups, tablespoons, and teaspoons, or /recipe-converter for cups-to-grams by ingredient.',
    },
    {
      step: 3,
      title: 'Load a popular pair or common value',
      description:
        'Click any popular pair card or Load button in the reference table to populate the calculator immediately.',
    },
    {
      step: 4,
      title: 'Verify the NIST SP 811 formula',
      description:
        'Review the converted output along with the exact multiplier or offset equation.',
    },
  ],
  faqs: [
    {
      question: 'How many millimeters are in an inch?',
      answer:
        '1 inch is defined internationally as exactly 25.4 millimeters (2.54 centimeters). To convert mm to inches, divide by 25.4—for example, 8 mm is about 0.315 inches (8 ÷ 25.4 = 0.31496 in).',
    },
    {
      question: 'How do I convert kilograms to pounds (kg to lbs)?',
      answer:
        'Divide the weight in kilograms by 0.45359237 (or multiply by 2.20462262). For example, 60 kg is about 132.28 pounds (60 × 2.20462262 = 132.277 lbs).',
    },
    {
      question: 'What is the formula to convert Celsius to Fahrenheit?',
      answer:
        'Multiply the Celsius temperature by 1.8 (9/5) and add 32. For example, 200 °C equals 392 °F ((200 × 1.8) + 32 = 392). To convert Fahrenheit to Celsius, subtract 32 first and divide by 1.8.',
    },
    {
      question: 'How many tablespoons and teaspoons are in a cup?',
      answer:
        '1 US customary cup equals 16 tablespoons or 48 teaspoons (236.588 milliliters). Each US tablespoon equals exactly 3 teaspoons (14.787 mL).',
    },
    {
      question: 'How many feet and inches are in a meter?',
      answer:
        '1 meter equals approximately 3.28084 feet, which is 3 feet and 3.37 inches (39.3701 inches total). To convert meters to feet, multiply meters by 3.28084.',
    },
    {
      question: 'What is the difference between a US gallon and a UK Imperial gallon?',
      answer:
        'A US liquid gallon is 3.78541 liters (128 US fluid ounces), whereas a UK Imperial gallon is 4.54609 liters (160 Imperial fluid ounces)—making the Imperial gallon about 20.1% larger.',
    },
    {
      question: 'How do you convert L/100km to MPG (miles per gallon)?',
      answer:
        'Divide 235.215 by the fuel consumption in L/100km to get US MPG (or divide 282.481 by L/100km for UK Imperial MPG). For example, 8 L/100km equals 235.215 ÷ 8 = 29.4 US MPG.',
    },
    {
      question: 'Where do I convert recipe ingredient weights like grams to cups?',
      answer:
        'Kitchen spoon and cup volume conversions live on our Cooking Measurement Converter (/conversions/cooking), while density-specific ingredient conversions (flour, sugar, butter, oats) live on our Recipe Converter (/recipe-converter).',
    },
  ],
};

export default function ConversionsHubPage() {
  return <CategoryHubPageClient config={CONVERSIONS_HUB_CONFIG} />;
}
