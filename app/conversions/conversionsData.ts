// Authoritative, technically verified data for SolveItCalculator Unit Conversion Hub
// No fake metrics, no unsupported certifications, strictly substantiated relationships.

export interface PopularPair {
  id: string;
  categoryId: string;
  categoryName: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  fromSymbol: string;
  toSymbol: string;
  sampleInput: number;
  sampleResult: string;
  factorText: string;
  isExact: boolean;
  slug: string;
}

export const POPULAR_CONVERSION_PAIRS: PopularPair[] = [
  {
    id: 'cm-to-in',
    categoryId: 'length',
    categoryName: 'Length',
    fromId: 'cm',
    toId: 'in',
    fromName: 'Centimeters',
    toName: 'Inches',
    fromSymbol: 'cm',
    toSymbol: 'in',
    sampleInput: 10,
    sampleResult: '3.93701 in',
    factorText: '1 in = 2.54 cm',
    isExact: true,
    slug: 'cm-to-in',
  },
  {
    id: 'in-to-cm',
    categoryId: 'length',
    categoryName: 'Length',
    fromId: 'in',
    toId: 'cm',
    fromName: 'Inches',
    toName: 'Centimeters',
    fromSymbol: 'in',
    toSymbol: 'cm',
    sampleInput: 5,
    sampleResult: '12.7 cm',
    factorText: '1 in = 2.54 cm',
    isExact: true,
    slug: 'in-to-cm',
  },
  {
    id: 'kg-to-lb',
    categoryId: 'weight',
    categoryName: 'Weight & Mass',
    fromId: 'kg',
    toId: 'lb',
    fromName: 'Kilograms',
    toName: 'Pounds',
    fromSymbol: 'kg',
    toSymbol: 'lb',
    sampleInput: 70,
    sampleResult: '154.324 lb',
    factorText: '1 lb = 0.45359237 kg',
    isExact: true,
    slug: 'kg-to-lb',
  },
  {
    id: 'lb-to-kg',
    categoryId: 'weight',
    categoryName: 'Weight & Mass',
    fromId: 'lb',
    toId: 'kg',
    fromName: 'Pounds',
    toName: 'Kilograms',
    fromSymbol: 'lb',
    toSymbol: 'kg',
    sampleInput: 150,
    sampleResult: '68.0389 kg',
    factorText: '1 lb = 0.45359237 kg',
    isExact: true,
    slug: 'lb-to-kg',
  },
  {
    id: 'c-to-f',
    categoryId: 'temperature',
    categoryName: 'Temperature',
    fromId: 'c',
    toId: 'f',
    fromName: 'Celsius',
    toName: 'Fahrenheit',
    fromSymbol: '°C',
    toSymbol: '°F',
    sampleInput: 20,
    sampleResult: '68 °F',
    factorText: '°F = (°C × 9/5) + 32',
    isExact: true,
    slug: 'c-to-f',
  },
  {
    id: 'f-to-c',
    categoryId: 'temperature',
    categoryName: 'Temperature',
    fromId: 'f',
    toId: 'c',
    fromName: 'Fahrenheit',
    toName: 'Celsius',
    fromSymbol: '°F',
    toSymbol: '°C',
    sampleInput: 98.6,
    sampleResult: '37 °C',
    factorText: '°C = (°F - 32) × 5/9',
    isExact: true,
    slug: 'f-to-c',
  },
  {
    id: 'm-to-ft',
    categoryId: 'length',
    categoryName: 'Length',
    fromId: 'm',
    toId: 'ft',
    fromName: 'Meters',
    toName: 'Feet',
    fromSymbol: 'm',
    toSymbol: 'ft',
    sampleInput: 1.8,
    sampleResult: '5.90551 ft',
    factorText: '1 ft = 0.3048 m',
    isExact: true,
    slug: 'm-to-ft',
  },
  {
    id: 'ft-to-m',
    categoryId: 'length',
    categoryName: 'Length',
    fromId: 'ft',
    toId: 'm',
    fromName: 'Feet',
    toName: 'Meters',
    fromSymbol: 'ft',
    toSymbol: 'm',
    sampleInput: 10,
    sampleResult: '3.048 m',
    factorText: '1 ft = 0.3048 m',
    isExact: true,
    slug: 'ft-to-m',
  },
  {
    id: 'mi-to-km',
    categoryId: 'length',
    categoryName: 'Length',
    fromId: 'mi',
    toId: 'km',
    fromName: 'Miles',
    toName: 'Kilometers',
    fromSymbol: 'mi',
    toSymbol: 'km',
    sampleInput: 60,
    sampleResult: '96.5606 km',
    factorText: '1 mi = 1.609344 km',
    isExact: true,
    slug: 'mi-to-km',
  },
  {
    id: 'km-to-mi',
    categoryId: 'length',
    categoryName: 'Length',
    fromId: 'km',
    toId: 'mi',
    fromName: 'Kilometers',
    toName: 'Miles',
    fromSymbol: 'km',
    toSymbol: 'mi',
    sampleInput: 100,
    sampleResult: '62.1371 mi',
    factorText: '1 km ≈ 0.621371 mi',
    isExact: false,
    slug: 'km-to-mi',
  },
  {
    id: 'l-to-gal',
    categoryId: 'volume',
    categoryName: 'Volume',
    fromId: 'l',
    toId: 'gal',
    fromName: 'Liters',
    toName: 'US Gallons',
    fromSymbol: 'L',
    toSymbol: 'gal (US)',
    sampleInput: 10,
    sampleResult: '2.64172 gal',
    factorText: '1 gal (US) = 3.785411784 L',
    isExact: true,
    slug: 'l-to-gal',
  },
  {
    id: 'gal-to-l',
    categoryId: 'volume',
    categoryName: 'Volume',
    fromId: 'gal',
    toId: 'l',
    fromName: 'US Gallons',
    toName: 'Liters',
    fromSymbol: 'gal (US)',
    toSymbol: 'L',
    sampleInput: 15,
    sampleResult: '56.7812 L',
    factorText: '1 gal (US) = 3.785411784 L',
    isExact: true,
    slug: 'gal-to-l',
  },
  {
    id: 'mph-to-kmh',
    categoryId: 'speed',
    categoryName: 'Speed',
    fromId: 'mph',
    toId: 'kmh',
    fromName: 'Miles per hour',
    toName: 'Kilometers per hour',
    fromSymbol: 'mph',
    toSymbol: 'km/h',
    sampleInput: 65,
    sampleResult: '104.607 km/h',
    factorText: '1 mph = 1.609344 km/h',
    isExact: true,
    slug: 'mph-to-kmh',
  },
  {
    id: 'kmh-to-mph',
    categoryId: 'speed',
    categoryName: 'Speed',
    fromId: 'kmh',
    toId: 'mph',
    fromName: 'Kilometers per hour',
    toName: 'Miles per hour',
    fromSymbol: 'km/h',
    toSymbol: 'mph',
    sampleInput: 120,
    sampleResult: '74.5645 mph',
    factorText: '1 km/h ≈ 0.621371 mph',
    isExact: false,
    slug: 'kmh-to-mph',
  },
];

export interface CategoryGroup {
  groupName: string;
  description: string;
  categories: {
    id: string;
    name: string;
    icon: string;
    description: string;
    path: string;
    popularExamples: string[];
    unitCount: number;
  }[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    groupName: 'Everyday Unit Converters',
    description: 'Common measurements used in daily tasks, travel, home projects, health, and cooking.',
    categories: [
      {
        id: 'length',
        name: 'Length Converter',
        icon: 'straighten',
        description: 'Quickly convert between inches, feet, meters, centimeters, and miles.',
        path: '/length-converter',
        popularExamples: ['cm → inches', 'm → feet', 'km → miles', 'feet → meters'],
        unitCount: 14,
      },
      {
        id: 'weight',
        name: 'Weight & Mass Converter',
        icon: 'scale',
        description: 'Easily switch between pounds, kilograms, ounces, grams, and stones for gym, luggage, and recipes.',
        path: '/weight-mass-converter',
        popularExamples: ['kg → lbs', 'lbs → kg', 'grams → ounces', 'ounces → grams'],
        unitCount: 12,
      },
      {
        id: 'temperature',
        name: 'Temperature Converter',
        icon: 'thermostat',
        description: 'Convert Celsius, Fahrenheit, and Kelvin for weather, fever, baking, and cooking recipes.',
        path: '/temperature-converter',
        popularExamples: ['°C → °F', '°F → °C', '°C → K', 'K → °C'],
        unitCount: 4,
      },
      {
        id: 'volume',
        name: 'Volume & Capacity Converter',
        icon: 'water_drop',
        description: 'Convert liters, gallons, cups, tablespoons, teaspoons, and fluid ounces for cooking and liquids.',
        path: '/volume-converter',
        popularExamples: ['liters → gallons', 'gallons → liters', 'mL → fl oz', 'cups → mL'],
        unitCount: 13,
      },
      {
        id: 'area',
        name: 'Area Converter',
        icon: 'square_foot',
        description: 'Convert square feet, square meters, acres, and hectares for floor plans, gardens, and land.',
        path: '/area-converter',
        popularExamples: ['sq ft → sq m', 'sq m → sq ft', 'acres → hectares', 'sq yards → sq m'],
        unitCount: 10,
      },
      {
        id: 'speed',
        name: 'Speed & Velocity Converter',
        icon: 'speed',
        description: 'Convert speeds between miles per hour (mph), kilometers per hour (km/h), and knots.',
        path: '/speed-converter',
        popularExamples: ['mph → km/h', 'km/h → mph', 'm/s → km/h', 'knots → mph'],
        unitCount: 6,
      },
      {
        id: 'time',
        name: 'Time Converter',
        icon: 'schedule',
        description: 'Convert seconds, minutes, hours, days, weeks, months, and calendar years.',
        path: '/time-converter',
        popularExamples: ['hours → minutes', 'days → hours', 'seconds → hours', 'weeks → days'],
        unitCount: 9,
      },
    ],
  },
  {
    groupName: 'Workshop & Science Converters',
    description: 'Helpful tools for car maintenance, home power, workshop tools, and science classes.',
    categories: [
      {
        id: 'pressure',
        name: 'Pressure Converter',
        icon: 'compress',
        description: 'Convert car tire PSI, bar, atmospheres, and pascals for tires and air pumps.',
        path: '/pressure-converter',
        popularExamples: ['PSI → bar', 'bar → PSI', 'kPa → PSI', 'atm → bar'],
        unitCount: 8,
      },
      {
        id: 'energy',
        name: 'Energy & Work Converter',
        icon: 'bolt',
        description: 'Convert calories, food kcal, kilowatt-hours (kWh), and joules for nutrition and power bills.',
        path: '/energy-converter',
        popularExamples: ['kWh → Joules', 'Joules → Calories', 'BTU → Joules', 'kcal → kJ'],
        unitCount: 8,
      },
      {
        id: 'power',
        name: 'Power Converter',
        icon: 'offline_bolt',
        description: 'Convert car horsepower (HP), kilowatts (kW), and watts for engines and appliances.',
        path: '/power-converter',
        popularExamples: ['HP → kW', 'kW → HP', 'Watts → HP', 'BTU/hr → Watts'],
        unitCount: 6,
      },
      {
        id: 'torque',
        name: 'Torque Converter',
        icon: 'settings_backup_restore',
        description: 'Convert pound-feet (lb-ft) and newton-meters (N·m) for car wheels and bicycle bolts.',
        path: '/torque-converter',
        popularExamples: ['N·m → lb-ft', 'lb-ft → N·m', 'N·m → kg-cm', 'lb-in → lb-ft'],
        unitCount: 6,
      },
      {
        id: 'frequency',
        name: 'Frequency Converter',
        icon: 'waves',
        description: 'Convert hertz (Hz), kilohertz (kHz), megahertz (MHz), and engine RPM.',
        path: '/frequency-converter',
        popularExamples: ['Hz → kHz', 'MHz → GHz', 'RPM → Hz', 'rad/s → RPM'],
        unitCount: 6,
      },
      {
        id: 'electrical',
        name: 'Electrical Converter',
        icon: 'electric_meter',
        description: 'Convert volts, millivolts, amps, milliamps, and ohms for home batteries and wiring.',
        path: '/electrical-converter',
        popularExamples: ['V → mV', 'mA → A', 'Ω → kΩ', 'F → µF'],
        unitCount: 10,
      },
      {
        id: 'engineering',
        name: 'Engineering Converter',
        icon: 'engineering',
        description: 'Convert material strength (MPa, ksi) and fluid pipe flow rates (L/min, GPM).',
        path: '/engineering-converter',
        popularExamples: ['MPa → ksi', 'GPM → L/min', 'cP → Pa·s', 'psi → MPa'],
        unitCount: 7,
      },
      {
        id: 'scientific',
        name: 'Scientific Converter',
        icon: 'science',
        description: 'Convert angles (degrees, radians), light levels (lux), and science class units.',
        path: '/scientific-converter',
        popularExamples: ['radians → degrees', 'degrees → radians', 'mol → mmol', 'lux → fc'],
        unitCount: 8,
      },
    ],
  },
  {
    groupName: 'Computers & Internet',
    description: 'Convert phone storage, hard drive capacity, download speeds, and computer numbers.',
    categories: [
      {
        id: 'data_storage',
        name: 'Data Storage Converter',
        icon: 'sd_storage',
        description: 'Convert megabytes (MB), gigabytes (GB), and terabytes (TB) for phone and hard drive storage.',
        path: '/data-storage-converter',
        popularExamples: ['MB → MiB', 'GB → GiB', 'TB → GB', 'Bytes → KB'],
        unitCount: 11,
      },
      {
        id: 'data_transfer',
        name: 'Data Transfer Rate Converter',
        icon: 'network_check',
        description: 'Convert internet speed test numbers (Mbps) into actual file download speeds (MB/s).',
        path: '/data-transfer-rate-converter',
        popularExamples: ['Mbps → MB/s', 'Gbps → MB/s', 'Kbps → Mbps', 'MB/s → Mbps'],
        unitCount: 9,
      },
      {
        id: 'number_systems',
        name: 'Number Systems Converter',
        icon: 'tag',
        description: 'Convert numbers between regular decimal (10), binary (01), hex, and Roman numerals.',
        path: '/number-systems-converter',
        popularExamples: ['Dec → Binary', 'Hex → Dec', 'Binary → Hex', 'Dec → Roman'],
        unitCount: 5,
      },
    ],
  },
  {
    groupName: 'Everyday Specialties',
    description: 'Practical tools for comparing car gas mileage and baking recipes.',
    categories: [
      {
        id: 'fuel_economy',
        name: 'Fuel Economy Converter',
        icon: 'local_gas_station',
        description: 'Easily compare car gas mileage between US MPG, UK MPG, and Liters/100km.',
        path: '/fuel-economy-converter',
        popularExamples: ['US MPG → L/100 km', 'L/100 km → US MPG', 'US MPG → UK MPG', 'km/L → MPG'],
        unitCount: 4,
      },
      {
        id: 'cooking',
        name: 'Cooking & Kitchen Converter',
        icon: 'soup_kitchen',
        description: 'Convert recipe cups, tablespoons, teaspoons, and grams for stress-free kitchen baking.',
        path: '/cooking-converter',
        popularExamples: ['cups → tbsp', 'tbsp → tsp', 'cups → mL', 'fl oz → mL'],
        unitCount: 12,
      },
    ],
  },
];

// Kitchen ingredient density database for mass-to-volume conversions
export interface CookingIngredient {
  id: string;
  name: string;
  densityGPerMl: number; // grams per milliliter
  cupWeightG: number; // approximate grams per US legal cup (240 mL)
  tbspWeightG: number; // approximate grams per tablespoon (15 mL)
}

export const COOKING_INGREDIENTS: CookingIngredient[] = [
  { id: 'water', name: 'Water (Pure)', densityGPerMl: 1.0, cupWeightG: 240, tbspWeightG: 15.0 },
  { id: 'milk', name: 'Whole Milk', densityGPerMl: 1.03, cupWeightG: 247.2, tbspWeightG: 15.45 },
  { id: 'flour_ap', name: 'All-Purpose Flour (Scooped)', densityGPerMl: 0.53, cupWeightG: 127.2, tbspWeightG: 7.95 },
  { id: 'sugar_granulated', name: 'Granulated White Sugar', densityGPerMl: 0.85, cupWeightG: 204.0, tbspWeightG: 12.75 },
  { id: 'sugar_brown', name: 'Brown Sugar (Packed)', densityGPerMl: 0.90, cupWeightG: 216.0, tbspWeightG: 13.5 },
  { id: 'butter', name: 'Butter (Solid)', densityGPerMl: 0.96, cupWeightG: 230.4, tbspWeightG: 14.4 },
  { id: 'olive_oil', name: 'Olive Oil / Vegetable Oil', densityGPerMl: 0.92, cupWeightG: 220.8, tbspWeightG: 13.8 },
  { id: 'honey', name: 'Honey / Molasses', densityGPerMl: 1.42, cupWeightG: 340.8, tbspWeightG: 21.3 },
  { id: 'rolled_oats', name: 'Rolled Oats', densityGPerMl: 0.38, cupWeightG: 91.2, tbspWeightG: 5.7 },
  { id: 'cocoa_powder', name: 'Cocoa Powder (Unsweetened)', densityGPerMl: 0.42, cupWeightG: 100.8, tbspWeightG: 6.3 },
];

// Common conversion reference tables
export interface ConversionTableRow {
  from: string;
  to: string;
  factorText: string;
  isExact: boolean;
  notes: string;
}

export const CONVERSION_REFERENCE_TABLES: Record<string, { title: string; rows: ConversionTableRow[] }> = {
  length: {
    title: 'Length & Distance',
    rows: [
      { from: '1 inch (in)', to: '2.54 centimeters (cm)', factorText: '1 in = 0.0254 m', isExact: true, notes: 'Defined exactly by 1959 International Yard and Pound Agreement' },
      { from: '1 foot (ft)', to: '0.3048 meters (m)', factorText: '1 ft = 12 in = 0.3048 m', isExact: true, notes: 'Exact international definition' },
      { from: '1 yard (yd)', to: '0.9144 meters (m)', factorText: '1 yd = 3 ft = 0.9144 m', isExact: true, notes: 'Exact international definition' },
      { from: '1 mile (mi)', to: '1.609344 kilometers (km)', factorText: '1 mi = 5,280 ft = 1,609.344 m', isExact: true, notes: 'Statute mile defined exactly' },
      { from: '1 nautical mile (nmi)', to: '1,852 meters (m)', factorText: '1 nmi = 1.852 km', isExact: true, notes: 'First International Extraordinary Hydrographic Conference 1929' },
      { from: '1 meter (m)', to: '3.280839895 feet (ft)', factorText: '1 m ≈ 3.28084 ft', isExact: false, notes: 'Reciprocal of 0.3048 m/ft (rounded display)' },
      { from: '1 kilometer (km)', to: '0.621371192 miles (mi)', factorText: '1 km ≈ 0.621371 mi', isExact: false, notes: 'Reciprocal of 1.609344 km/mi (rounded display)' },
    ],
  },
  weight: {
    title: 'Weight & Mass',
    rows: [
      { from: '1 pound (lb)', to: '0.45359237 kilograms (kg)', factorText: '1 lb = 0.45359237 kg', isExact: true, notes: 'Defined exactly by international agreement (1959)' },
      { from: '1 ounce (oz)', to: '28.349523125 grams (g)', factorText: '1 oz = 1/16 lb', isExact: true, notes: 'Exact fraction of international pound' },
      { from: '1 stone (st)', to: '6.35029318 kilograms (kg)', factorText: '1 st = 14 lb', isExact: true, notes: 'British imperial customary weight unit' },
      { from: '1 short ton (US ton)', to: '907.18474 kilograms (kg)', factorText: '1 ton (US) = 2,000 lb', isExact: true, notes: 'US customary short ton' },
      { from: '1 long ton (UK ton)', to: '1,016.0469088 kilograms (kg)', factorText: '1 ton (UK) = 2,240 lb', isExact: true, notes: 'British imperial long ton' },
      { from: '1 metric ton (tonne, t)', to: '1,000 kilograms (kg)', factorText: '1 t = 1,000 kg', isExact: true, notes: 'SI coherent metric ton' },
      { from: '1 kilogram (kg)', to: '2.2046226218 pounds (lb)', factorText: '1 kg ≈ 2.20462 lb', isExact: false, notes: 'Reciprocal of 0.45359237 kg/lb (rounded display)' },
    ],
  },
  volume: {
    title: 'Volume & Fluid Capacity',
    rows: [
      { from: '1 US fluid gallon', to: '3.785411784 liters (L)', factorText: '1 gal (US) = 231 in³', isExact: true, notes: 'Historical Queen Anne wine gallon (exactly 231 cubic inches)' },
      { from: '1 Imperial gallon (UK)', to: '4.54609 liters (L)', factorText: '1 gal (UK) = 4.54609 L', isExact: true, notes: 'Weights and Measures Act 1985 (approx 20% larger than US gallon)' },
      { from: '1 US liquid quart', to: '0.946352946 liters (L)', factorText: '1 qt = 1/4 gal (US)', isExact: true, notes: 'US customary quart' },
      { from: '1 US legal cup', to: '240 milliliters (mL)', factorText: '1 cup = 240 mL', isExact: true, notes: 'US FDA nutrition labeling standard' },
      { from: '1 US customary cup', to: '236.5882365 milliliters (mL)', factorText: '1 cup = 1/16 gal (US)', isExact: true, notes: 'Traditional US recipe cup' },
      { from: '1 cubic meter (m³)', to: '1,000 liters (L)', factorText: '1 m³ = 1,000 L', isExact: true, notes: 'Coherent SI derived volume' },
      { from: '1 cubic foot (ft³)', to: '28.316846592 liters (L)', factorText: '1 ft³ = (0.3048 m)³', isExact: true, notes: 'Cubed exact foot factor' },
    ],
  },
  temperature: {
    title: 'Temperature Scales',
    rows: [
      { from: 'Celsius to Fahrenheit', to: '°F = (°C × 9/5) + 32', factorText: 'Affine scaling', isExact: true, notes: 'Freezing 0°C = 32°F; Boiling 100°C = 212°F' },
      { from: 'Fahrenheit to Celsius', to: '°C = (°F - 32) × 5/9', factorText: 'Affine scaling', isExact: true, notes: 'Freezing 32°F = 0°C; Body temp 98.6°F = 37°C' },
      { from: 'Celsius to Kelvin', to: 'K = °C + 273.15', factorText: 'Zero-point shift', isExact: true, notes: 'Absolute zero 0 K = -273.15 °C' },
      { from: 'Fahrenheit to Rankine', to: '°R = °F + 459.67', factorText: 'Zero-point shift', isExact: true, notes: 'Absolute zero 0 °R = -459.67 °F' },
    ],
  },
  data: {
    title: 'Data Storage (Decimal vs Binary)',
    rows: [
      { from: '1 Kilobyte (KB - SI Decimal)', to: '1,000 Bytes', factorText: '10³ Bytes', isExact: true, notes: 'Standard SI metric prefix (drive manufacturers)' },
      { from: '1 Kibibyte (KiB - IEC Binary)', to: '1,024 Bytes', factorText: '2¹⁰ Bytes', isExact: true, notes: 'IEC 60027-2 binary prefix (operating systems)' },
      { from: '1 Megabyte (MB - SI Decimal)', to: '1,000,000 Bytes', factorText: '10⁶ Bytes', isExact: true, notes: 'Standard SI metric prefix' },
      { from: '1 Mebibyte (MiB - IEC Binary)', to: '1,048,576 Bytes', factorText: '2²⁰ Bytes', isExact: true, notes: 'IEC binary prefix (4.86% larger than 1 MB)' },
      { from: '1 Gigabyte (GB - SI Decimal)', to: '1,000,000,000 Bytes', factorText: '10⁹ Bytes', isExact: true, notes: 'Standard SI metric prefix' },
      { from: '1 Gibibyte (GiB - IEC Binary)', to: '1,073,741,824 Bytes', factorText: '2³⁰ Bytes', isExact: true, notes: 'IEC binary prefix (7.37% larger than 1 GB)' },
      { from: '1 Terabyte (TB - SI Decimal)', to: '1,000,000,000,000 Bytes', factorText: '10¹² Bytes', isExact: true, notes: 'A 1 TB drive appears as ~931.3 GiB in Windows' },
    ],
  },
};

// Educational guides data
export interface KnowledgeGuide {
  title: string;
  slug: string;
  category: string;
  summary: string;
  keyTakeaway: string;
  relatedToolPath: string;
}

export const KNOWLEDGE_GUIDES: KnowledgeGuide[] = [
  {
    title: 'What Is a Conversion Factor?',
    slug: 'what-is-a-conversion-factor',
    category: 'Foundations',
    summary: 'A conversion factor is a ratio or multiplier expressing how many of one unit equal another, derived from physical definitions or legal standards.',
    keyTakeaway: 'Multiplying by a conversion factor is mathematically equivalent to multiplying by 1, changing the numerical scale without altering physical magnitude.',
    relatedToolPath: '/length-converter',
  },
  {
    title: 'Metric vs Imperial vs US Customary',
    slug: 'metric-vs-imperial-vs-us-customary',
    category: 'Measurement Systems',
    summary: 'The metric (SI) system uses coherent decimal powers of 10. The US customary and British Imperial systems share common ancestry but diverge on volume and hundredweights.',
    keyTakeaway: 'A US gallon is exactly 231 cubic inches (~3.785 L), whereas a British Imperial gallon is ~4.546 L (about 20% larger).',
    relatedToolPath: '/volume-converter',
  },
  {
    title: 'What Are SI Units?',
    slug: 'what-are-si-units',
    category: 'Standards',
    summary: 'The International System of Units (SI) defines seven fundamental base units: meter (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), and candela (cd).',
    keyTakeaway: 'All other physical units (such as Joules, Newtons, Watts, and Pascals) are derived mathematically from these seven fundamental physical constants.',
    relatedToolPath: '/scientific-converter',
  },
  {
    title: 'Exact vs Rounded Conversion Factors',
    slug: 'exact-vs-rounded-factors',
    category: 'Mathematics',
    summary: 'Certain unit relationships are defined by exact mathematical decree (1 inch = 0.0254 m), while others are irrational or repeating fractions.',
    keyTakeaway: 'When converting 1 kg to pounds, the reciprocal (1 ÷ 0.45359237 ≈ 2.20462262...) produces an infinite decimal and must be rounded for display.',
    relatedToolPath: '/weight-mass-converter',
  },
  {
    title: 'How Significant Figures Affect Conversions',
    slug: 'significant-figures-and-rounding',
    category: 'Data Integrity',
    summary: 'Displaying 8 decimal places does not make a measurement more precise if the original measurement was only accurate to two digits.',
    keyTakeaway: 'Always distinguish between instrument measurement uncertainty and mathematical display precision in your calculations.',
    relatedToolPath: '/scientific-converter',
  },
  {
    title: 'Why Square Units Convert Differently (Area)',
    slug: 'why-square-units-convert-differently',
    category: 'Geometry',
    summary: 'When converting area, the linear conversion factor must be squared. Because 1 m = 100 cm, 1 m² = (100 cm)² = 10,000 cm².',
    keyTakeaway: 'Never apply a linear conversion factor to an area calculation. 1 yard = 3 feet, but 1 square yard = 9 square feet.',
    relatedToolPath: '/area-converter',
  },
  {
    title: 'Why Cubic Units Convert Differently (Volume)',
    slug: 'why-cubic-units-convert-differently',
    category: 'Geometry',
    summary: 'When converting volume in 3D space, the linear conversion factor must be cubed. Because 1 foot = 12 inches, 1 cubic foot = 12³ = 1,728 cubic inches.',
    keyTakeaway: 'Volume expands with the cube of length: 1 meter = 1,000 mm, so 1 cubic meter = 1,000,000,000 cubic millimeters.',
    relatedToolPath: '/volume-converter',
  },
  {
    title: 'Mass vs Weight: The Crucial Physical Difference',
    slug: 'mass-vs-weight-difference',
    category: 'Physics',
    summary: 'Mass is the invariant quantity of matter inside an object (measured in kg). Weight is the downward gravitational force acting on that mass (measured in Newtons).',
    keyTakeaway: 'Your mass is identical on Earth and the Moon, but your weight on the Moon is roughly 1/6th of your weight on Earth.',
    relatedToolPath: '/weight-mass-converter',
  },
  {
    title: 'Mass vs Volume: Why Density Matters',
    slug: 'mass-vs-volume-density',
    category: 'Physics & Cooking',
    summary: 'A direct unit converter cannot convert grams into cups without an ingredient density assumption. 1 cup of honey weighs ~340 g, while 1 cup of flour weighs ~127 g.',
    keyTakeaway: 'Never use a fixed conversion factor between mass (weight) and volume without specifying the density of the substance.',
    relatedToolPath: '/cooking-converter',
  },
  {
    title: 'US Gallons vs Imperial Gallons',
    slug: 'us-gallons-vs-imperial-gallons',
    category: 'Fluid Measurements',
    summary: 'In the US, 1 gallon is based on the 1707 British wine gallon (231 cu in). In 1824, Britain replaced it with the Imperial gallon (277.42 cu in).',
    keyTakeaway: 'An Imperial gallon is roughly 1.20095 times larger than a US liquid gallon. 1 Imperial gallon = 4.546 L vs 1 US gallon = 3.785 L.',
    relatedToolPath: '/volume-converter',
  },
  {
    title: 'MPG vs L/100 km: Fuel Economy Reciprocal Math',
    slug: 'mpg-vs-l-100km-reciprocal',
    category: 'Automotive',
    summary: 'Miles per gallon (MPG) measures distance per volume of fuel (higher is better). Liters per 100 km measures volume of fuel per distance (lower is better).',
    keyTakeaway: 'Because the relationship is inverse, going from 15 to 20 MPG saves far more fuel over 10,000 miles than going from 45 to 50 MPG.',
    relatedToolPath: '/fuel-economy-converter',
  },
  {
    title: 'MB vs MiB: Decimal vs Binary Storage Conventions',
    slug: 'mb-vs-mib-storage-conventions',
    category: 'Computing',
    summary: 'Storage manufacturers use SI decimal prefixes (1 MB = 1,000,000 bytes). Computer operating systems often count in powers of 2 (1 MiB = 1,048,576 bytes).',
    keyTakeaway: 'A hard drive advertised as 1 TB has 1,000,000,000,000 bytes, which Windows displays as 931.32 GB (which are actually GiB).',
    relatedToolPath: '/data-storage-converter',
  },
];

// Conversions for everyday work cards
export interface EverydayWorkCase {
  title: string;
  tag: string;
  icon: string;
  description: string;
  examples: { from: string; to: string; formula: string }[];
  primaryPath: string;
}

export const EVERYDAY_WORK_CASES: EverydayWorkCase[] = [
  {
    title: 'Home & Real Estate',
    tag: 'Living Space & Architecture',
    icon: 'home',
    description: 'Renovation dimensions, floor plan square footages, room heights, and lumber sizes.',
    examples: [
      { from: 'Square Feet', to: 'Square Meters', formula: '1 sq ft = 0.092903 m²' },
      { from: 'Inches', to: 'Centimeters', formula: '1 in = 2.54 cm' },
      { from: 'Feet', to: 'Meters', formula: '1 ft = 0.3048 m' },
    ],
    primaryPath: '/area-converter',
  },
  {
    title: 'Automotive & Travel',
    tag: 'Vehicles & Performance',
    icon: 'directions_car',
    description: 'Highway speeds, tire pressures, engine torque specifications, and fuel consumption.',
    examples: [
      { from: 'MPH', to: 'KM/H', formula: '1 mph = 1.609344 km/h' },
      { from: 'PSI', to: 'Bar', formula: '1 bar = 14.5038 PSI' },
      { from: 'US MPG', to: 'L/100 km', formula: 'L/100km = 235.215 / MPG' },
    ],
    primaryPath: '/speed-converter',
  },
  {
    title: 'Kitchen & Baking',
    tag: 'Culinary Recipes',
    icon: 'cookie',
    description: 'Translating international recipes between volumetric cups and weighed grams.',
    examples: [
      { from: 'US Cups', to: 'Milliliters', formula: '1 cup = 240 mL (legal)' },
      { from: 'Tablespoons', to: 'Teaspoons', formula: '1 tbsp = 3 tsp' },
      { from: 'Ounces', to: 'Grams', formula: '1 oz = 28.3495 g' },
    ],
    primaryPath: '/cooking-converter',
  },
  {
    title: 'Technology & Networking',
    tag: 'Computing & Bandwidth',
    icon: 'terminal',
    description: 'Internet download speed estimation, file server capacity, and base number translation.',
    examples: [
      { from: 'Mbps', to: 'MB/s', formula: '8 Mbps = 1 MB/s' },
      { from: 'GB (Decimal)', to: 'GiB (Binary)', formula: '1 GB = 0.931323 GiB' },
      { from: 'Decimal', to: 'Binary', formula: 'Radix Base 10 to Base 2' },
    ],
    primaryPath: '/data-transfer-rate-converter',
  },
  {
    title: 'Engineering & Fabrication',
    tag: 'Mechanical & Civil',
    icon: 'construction',
    description: 'Structural yield stress, horsepower ratings, fluid pipe flow, and tightening torque.',
    examples: [
      { from: 'Megapascals (MPa)', to: 'ksi', formula: '1 MPa = 0.145038 ksi' },
      { from: 'Horsepower (HP)', to: 'Kilowatts (kW)', formula: '1 HP = 0.7456999 kW' },
      { from: 'N·m', to: 'lb·ft', formula: '1 N·m = 0.737562 lb·ft' },
    ],
    primaryPath: '/engineering-converter',
  },
  {
    title: 'Laboratory & Science',
    tag: 'Physics & Chemistry',
    icon: 'biotech',
    description: 'Thermal transformations, gas law pressures, thermodynamic joules, and molar quantities.',
    examples: [
      { from: 'Celsius', to: 'Kelvin', formula: 'K = °C + 273.15' },
      { from: 'Pascals', to: 'Atmospheres', formula: '1 atm = 101,325 Pa' },
      { from: 'Joules', to: 'Calories', formula: '1 cal = 4.184 J' },
    ],
    primaryPath: '/scientific-converter',
  },
];

// FAQs matching section 47 of master prompt
export interface ConversionFaq {
  q: string;
  a: string;
}

export const CONVERSION_FAQS: ConversionFaq[] = [
  {
    q: 'What is a unit converter?',
    a: 'A unit converter is a quick tool that changes a measurement from one unit to another—like turning inches into centimeters, pounds into kilograms, or Celsius into Fahrenheit—without having to do the math by hand.',
  },
  {
    q: 'How does unit conversion work?',
    a: 'Most conversions multiply or divide by a verified standard number (for example, multiplying inches by 2.54 gives centimeters). For temperatures like Celsius and Fahrenheit, a small formula also adds or subtracts because their zero points start at different temperatures.',
  },
  {
    q: 'Are all conversion factors exact?',
    a: 'Some conversions are 100% exact by international law (like 1 inch being exactly 2.54 cm, or 1 pound being exactly 0.45359237 kg). Others produce long decimals that never end (like 1 kg ≈ 2.20462 lb), which are rounded neatly for everyday reading.',
  },
  {
    q: 'Why can two unit converters show slightly different results?',
    a: 'Differences usually come from: (1) showing more or fewer decimal places, (2) using rough shortcuts like 1 kg = 2.2 lb instead of 2.20462 lb, (3) mixing up US gallons with larger British Imperial gallons, or (4) computer hard drives counting in 1,000s while operating systems count in 1,024s.',
  },
  {
    q: 'What is the difference between metric and imperial units?',
    a: 'The metric system (meters, kilograms, liters) uses tens, hundreds, and thousands, making math easy. The imperial and US systems (inches, feet, pounds, gallons) grew from traditional historical trading measures.',
  },
  {
    q: 'What is the difference between US and Imperial gallons?',
    a: 'A US gallon holds about 3.79 liters. A British Imperial gallon holds about 4.55 liters, making it about 20% larger than a US gallon.',
  },
  {
    q: 'What is the difference between MB and MiB in data storage?',
    a: 'Hard drive and phone makers count storage in powers of 10 (1 GB = 1,000 MB). Computer operating systems like Windows often count in powers of 2 (1 GiB = 1,024 MiB). That is why a 1 TB external drive shows up as about 931 GB on your computer screen.',
  },
  {
    q: 'Can grams be converted directly to cups?',
    a: 'Grams measure weight, while cups measure space (volume). Converting grams to cups depends on what food you are using: 1 cup of granulated sugar weighs about 204 grams, while 1 cup of light flour weighs only about 127 grams.',
  },
  {
    q: 'How do I convert Celsius to Fahrenheit and vice versa?',
    a: 'To turn Celsius into Fahrenheit: multiply by 1.8 and add 32 (°F = °C × 1.8 + 32). To turn Fahrenheit into Celsius: subtract 32 and divide by 1.8 (°C = (°F - 32) ÷ 1.8).',
  },
  {
    q: 'How do I convert MPG to L/100 km?',
    a: 'Because MPG tells you how far you go on one gallon, and L/100 km tells you how much gas you burn over 100 kilometers, the math flips upside down: divide 235.215 by your US MPG to get L/100 km.',
  },
  {
    q: 'Why are area conversions different from length conversions?',
    a: 'Area measures both length and width. Because 1 meter equals 100 centimeters in both directions, 1 square meter is 100 × 100 = 10,000 square centimeters. The conversion factor gets multiplied by itself.',
  },
  {
    q: 'Why are volume conversions different from length conversions?',
    a: 'Volume measures 3D space (length, width, and height). Because 1 foot is 12 inches, 1 cubic foot equals 12 × 12 × 12 = 1,728 cubic inches.',
  },
  {
    q: 'Can I convert between any two arbitrary units?',
    a: 'You can only convert between units that measure the same physical thing. You can change feet into meters or pounds into kilograms, but you cannot convert speed into weight or gallons into miles without knowing extra details.',
  },
  {
    q: 'What does display precision mean?',
    a: 'Display precision lets you choose how many numbers appear after the decimal point. Choosing 2 decimals rounds 3.937 to 3.94 for easy reading, without changing the underlying mathematical accuracy.',
  },
];
