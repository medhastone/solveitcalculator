export interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
  system: 'metric' | 'imperial' | 'us_customary' | 'scientific' | 'digital' | 'astronomy' | 'other';
  // Conversion factor relative to standard base unit for that category
  // value_in_base = (value + offset) * factor
  // value = (value_in_base / factor) - offset
  factor: number;
  offset?: number;
  description?: string;
  popular?: boolean;
}

export interface ConversionCategoryType {
  id: string;
  name: string;
  iconName: string;
  baseUnit: string;
  baseUnitSymbol: string;
  description: string;
  formulaDescription: string;
  standardFormula: string;
  units: ConversionUnit[];
  presetExamples: {
    label: string;
    fromValue: number;
    fromUnitId: string;
    toUnitId: string;
  }[];
}

export interface ConversionToolItem {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  path: string;
  icon: string;
  keywords: string[];
  fromUnit: string;
  toUnit: string;
  formula: string;
  isPopular?: boolean;
}

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  tools: {
    name: string;
    desc: string;
    path: string;
    badge?: string;
  }[];
}

export interface MetricImperialPair {
  quantity: string;
  metricUnit: string;
  imperialUnit: string;
  metricToImperialRatio: string;
  imperialToMetricRatio: string;
  practicalExample: string;
}

export interface SIPrefixItem {
  prefix: string;
  symbol: string;
  power: number;
  multiplier: string;
  decimalValue: string;
  scaleExample: string;
  realm: 'macro' | 'everyday' | 'micro' | 'nano';
}

export interface ConversionWorkbenchKit {
  id: string;
  title: string;
  persona: string;
  desc: string;
  icon: string;
  recommendedTools: {
    name: string;
    path: string;
    purpose: string;
  }[];
}

export interface ConversionFaq {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// 1. LIVE WORKBENCH UNIT DEFINITIONS ACROSS 12 PHYSICAL DISCIPLINES
// ---------------------------------------------------------------------------
export const CONVERSION_CATEGORIES_DATA: ConversionCategoryType[] = [
  {
    id: 'length',
    name: 'Length & Distance',
    iconName: 'Ruler',
    baseUnit: 'Meter',
    baseUnitSymbol: 'm',
    description: 'Convert between metric and imperial distances from nanometers to astronomical light years.',
    formulaDescription: 'Base unit is the Meter (m). All length values convert through exact NIST SP 811 ratios (1 in = 0.0254 m).',
    standardFormula: 'd_{dest} = (d_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 Mile to Kilometers', fromValue: 1, fromUnitId: 'mi', toUnitId: 'km' },
      { label: '100 Meters to Feet', fromValue: 100, fromUnitId: 'm', toUnitId: 'ft' },
      { label: '6 Feet to Centimeters', fromValue: 6, fromUnitId: 'ft', toUnitId: 'cm' },
      { label: '1 Light Year to Kilometers', fromValue: 1, fromUnitId: 'ly', toUnitId: 'km' },
    ],
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', system: 'metric', factor: 1, popular: true, description: 'SI base unit of length' },
      { id: 'km', name: 'Kilometer', symbol: 'km', system: 'metric', factor: 1000, popular: true, description: '1,000 meters' },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', system: 'metric', factor: 0.01, popular: true, description: '0.01 meters' },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', system: 'metric', factor: 0.001, popular: true, description: '1/1,000th of a meter' },
      { id: 'um', name: 'Micrometer (Micron)', symbol: 'µm', system: 'scientific', factor: 1e-6, description: '10⁻⁶ meters' },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', system: 'scientific', factor: 1e-9, description: '10⁻⁹ meters' },
      { id: 'mi', name: 'Mile', symbol: 'mi', system: 'imperial', factor: 1609.344, popular: true, description: '5,280 international feet' },
      { id: 'yd', name: 'Yard', symbol: 'yd', system: 'imperial', factor: 0.9144, popular: true, description: '3 feet = 36 inches' },
      { id: 'ft', name: 'Foot', symbol: 'ft', system: 'imperial', factor: 0.3048, popular: true, description: '12 international inches' },
      { id: 'in', name: 'Inch', symbol: 'in', system: 'imperial', factor: 0.0254, popular: true, description: 'Exact standard: 25.4 mm' },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'NM', system: 'other', factor: 1852, description: 'Exact navigation standard: 1,852 m' },
      { id: 'au', name: 'Astronomical Unit', symbol: 'AU', system: 'astronomy', factor: 149597870700, description: 'Mean Earth-Sun distance' },
      { id: 'ly', name: 'Light Year', symbol: 'ly', system: 'astronomy', factor: 9460730472580800, description: 'Distance light travels in 1 Julian year' },
    ],
  },
  {
    id: 'mass',
    name: 'Weight & Mass',
    iconName: 'Scale',
    baseUnit: 'Kilogram',
    baseUnitSymbol: 'kg',
    description: 'Convert between metric kilograms, grams, imperial pounds, ounces, stones, and troy ounces.',
    formulaDescription: 'Base unit is Kilogram (kg). 1 International Pound is defined exactly as 0.45359237 kg.',
    standardFormula: 'm_{dest} = (m_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 Kilogram to Pounds', fromValue: 1, fromUnitId: 'kg', toUnitId: 'lb' },
      { label: '150 Pounds to Kilograms', fromValue: 150, fromUnitId: 'lb', toUnitId: 'kg' },
      { label: '1 Troy Ounce to Grams', fromValue: 1, fromUnitId: 'ozt', toUnitId: 'g' },
      { label: '1 Metric Ton to Short Tons', fromValue: 1, fromUnitId: 't', toUnitId: 'ton_us' },
    ],
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', system: 'metric', factor: 1, popular: true, description: 'SI base unit of mass' },
      { id: 'g', name: 'Gram', symbol: 'g', system: 'metric', factor: 0.001, popular: true, description: '1/1,000th of a kilogram' },
      { id: 'mg', name: 'Milligram', symbol: 'mg', system: 'metric', factor: 1e-6, popular: true, description: '10⁻⁶ kilograms' },
      { id: 'ug', name: 'Microgram', symbol: 'µg', system: 'scientific', factor: 1e-9, description: '10⁻⁹ kilograms' },
      { id: 't', name: 'Metric Ton (Tonne)', symbol: 't', system: 'metric', factor: 1000, popular: true, description: '1,000 kg (Megagram)' },
      { id: 'lb', name: 'Pound (Avoirdupois)', symbol: 'lb', system: 'imperial', factor: 0.45359237, popular: true, description: '16 avoirdupois ounces' },
      { id: 'oz', name: 'Ounce (Avoirdupois)', symbol: 'oz', system: 'imperial', factor: 0.028349523125, popular: true, description: '1/16th of a pound ≈ 28.35 g' },
      { id: 'st', name: 'Stone', symbol: 'st', system: 'imperial', factor: 6.35029318, description: '14 international pounds' },
      { id: 'ton_us', name: 'Short Ton (US)', symbol: 'ton (US)', system: 'us_customary', factor: 907.18474, description: '2,000 US pounds' },
      { id: 'ton_uk', name: 'Long Ton (Imperial)', symbol: 'ton (UK)', system: 'imperial', factor: 1016.0469088, description: '2,240 imperial pounds' },
      { id: 'ozt', name: 'Troy Ounce (Precious Metals)', symbol: 'oz t', system: 'other', factor: 0.0311034768, description: 'Exact 31.1034768 grams' },
      { id: 'ct', name: 'Carat (Gemstones)', symbol: 'ct', system: 'other', factor: 0.0002, description: '200 milligrams' },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    baseUnit: 'Kelvin',
    baseUnitSymbol: 'K',
    description: 'Convert between Celsius, Fahrenheit, Kelvin, Rankine, and historical thermodynamic scales.',
    formulaDescription: 'Thermodynamic absolute scale base is Kelvin (K). Celsius offset is +273.15; Fahrenheit offset is +459.67.',
    standardFormula: 'T_{K} = \\text{scale-specific affine function}',
    presetExamples: [
      { label: '100°C (Boiling) to Fahrenheit', fromValue: 100, fromUnitId: 'c', toUnitId: 'f' },
      { label: '98.6°F (Body Temp) to Celsius', fromValue: 98.6, fromUnitId: 'f', toUnitId: 'c' },
      { label: '0 Kelvin (Absolute Zero) to °C', fromValue: 0, fromUnitId: 'k', toUnitId: 'c' },
      { label: '72°F (Room Temp) to Celsius', fromValue: 72, fromUnitId: 'f', toUnitId: 'c' },
    ],
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', system: 'metric', factor: 1, offset: 273.15, popular: true, description: 'Water freezes at 0°C, boils at 100°C' },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', system: 'imperial', factor: 5 / 9, offset: 459.67, popular: true, description: 'Water freezes at 32°F, boils at 212°F' },
      { id: 'k', name: 'Kelvin', symbol: 'K', system: 'scientific', factor: 1, offset: 0, popular: true, description: 'SI base unit of thermodynamic temperature' },
      { id: 'r', name: 'Rankine', symbol: '°R', system: 'scientific', factor: 5 / 9, offset: 0, description: 'Absolute Fahrenheit scale' },
      { id: 'reaumur', name: 'Réaumur', symbol: '°Ré', system: 'other', factor: 1.25, offset: 273.15, description: 'Water freezes at 0°Ré, boils at 80°Ré' },
    ],
  },
  {
    id: 'volume',
    name: 'Volume & Liquid Capacity',
    iconName: 'Droplets',
    baseUnit: 'Liter',
    baseUnitSymbol: 'L',
    description: 'Convert liters, milliliters, US gallons, UK gallons, fluid ounces, cups, tablespoons, and cubic meters.',
    formulaDescription: 'Base unit is Liter (L = 0.001 m³). US Gallon = 3.785411784 L; Imperial Gallon = 4.54609 L.',
    standardFormula: 'V_{dest} = (V_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 US Gallon to Liters', fromValue: 1, fromUnitId: 'gal_us', toUnitId: 'l' },
      { label: '1 Liter to US Fluid Ounces', fromValue: 1, fromUnitId: 'l', toUnitId: 'fl_oz_us' },
      { label: '1 Cubic Meter to Liters', fromValue: 1, fromUnitId: 'm3', toUnitId: 'l' },
      { label: '1 Cup (US) to Milliliters', fromValue: 1, fromUnitId: 'cup_us', toUnitId: 'ml' },
    ],
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', system: 'metric', factor: 1, popular: true, description: '1 cubic decimeter (dm³)' },
      { id: 'ml', name: 'Milliliter (cc)', symbol: 'mL', system: 'metric', factor: 0.001, popular: true, description: '1 cubic centimeter (cm³)' },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', system: 'metric', factor: 1000, popular: true, description: '1,000 liters' },
      { id: 'gal_us', name: 'Gallon (US Liquid)', symbol: 'gal (US)', system: 'us_customary', factor: 3.785411784, popular: true, description: '231 cubic inches' },
      { id: 'gal_uk', name: 'Gallon (Imperial / UK)', symbol: 'gal (UK)', system: 'imperial', factor: 4.54609, description: 'Exact 4.54609 liters' },
      { id: 'fl_oz_us', name: 'Fluid Ounce (US)', symbol: 'fl oz (US)', system: 'us_customary', factor: 0.0295735295625, popular: true, description: '1/128th of a US gallon' },
      { id: 'fl_oz_uk', name: 'Fluid Ounce (Imperial)', symbol: 'fl oz (UK)', system: 'imperial', factor: 0.0284130625, description: '1/160th of an Imperial gallon' },
      { id: 'cup_us', name: 'Cup (US Customary)', symbol: 'cup (US)', system: 'us_customary', factor: 0.2365882365, popular: true, description: '8 US fluid ounces ≈ 236.6 mL' },
      { id: 'cup_metric', name: 'Cup (Metric)', symbol: 'cup (metric)', system: 'metric', factor: 0.25, description: 'Exact 250 mL' },
      { id: 'pt_us', name: 'Pint (US Liquid)', symbol: 'pt (US)', system: 'us_customary', factor: 0.473176473, description: '16 US fluid ounces' },
      { id: 'qt_us', name: 'Quart (US Liquid)', symbol: 'qt (US)', system: 'us_customary', factor: 0.946352946, description: '32 US fluid ounces = 2 pints' },
      { id: 'tbsp_us', name: 'Tablespoon (US)', symbol: 'tbsp', system: 'us_customary', factor: 0.01478676478125, description: '3 teaspoons = 1/2 fl oz' },
      { id: 'tsp_us', name: 'Teaspoon (US)', symbol: 'tsp', system: 'us_customary', factor: 0.00492892159375, description: '1/3 tablespoon ≈ 4.93 mL' },
      { id: 'bbl_oil', name: 'Oil Barrel', symbol: 'bbl', system: 'other', factor: 158.987294928, description: '42 US gallons' },
    ],
  },
  {
    id: 'area',
    name: 'Area & Land Measure',
    iconName: 'Square',
    baseUnit: 'Square Meter',
    baseUnitSymbol: 'm²',
    description: 'Convert square meters, square feet, square kilometers, acres, hectares, and square miles.',
    formulaDescription: 'Base unit is Square Meter (m²). 1 Acre = 43,560 sq ft = 4,046.8564224 m²; 1 Hectare = 10,000 m².',
    standardFormula: 'A_{dest} = (A_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 Acre to Square Feet', fromValue: 1, fromUnitId: 'ac', toUnitId: 'ft2' },
      { label: '1 Hectare to Acres', fromValue: 1, fromUnitId: 'ha', toUnitId: 'ac' },
      { label: '100 Square Meters to Sq Ft', fromValue: 100, fromUnitId: 'm2', toUnitId: 'ft2' },
      { label: '1 Square Mile to Square Km', fromValue: 1, fromUnitId: 'mi2', toUnitId: 'km2' },
    ],
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', system: 'metric', factor: 1, popular: true, description: 'SI derived unit of area' },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', system: 'metric', factor: 1000000, popular: true, description: '1,000,000 square meters' },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', system: 'metric', factor: 0.0001, description: '10⁻⁴ square meters' },
      { id: 'ha', name: 'Hectare', symbol: 'ha', system: 'metric', factor: 10000, popular: true, description: '10,000 m² (100 m × 100 m)' },
      { id: 'ac', name: 'Acre', symbol: 'ac', system: 'imperial', factor: 4046.8564224, popular: true, description: '43,560 square feet' },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', system: 'imperial', factor: 0.09290304, popular: true, description: '144 square inches' },
      { id: 'in2', name: 'Square Inch', symbol: 'in²', system: 'imperial', factor: 0.00064516, description: 'Exact 6.4516 cm²' },
      { id: 'yd2', name: 'Square Yard', symbol: 'yd²', system: 'imperial', factor: 0.83612736, description: '9 square feet' },
      { id: 'mi2', name: 'Square Mile', symbol: 'mi²', system: 'imperial', factor: 2589988.110336, popular: true, description: '640 acres' },
    ],
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    iconName: 'Gauge',
    baseUnit: 'Meter per Second',
    baseUnitSymbol: 'm/s',
    description: 'Convert kilometers per hour, miles per hour, meters per second, knots, feet per second, and Mach.',
    formulaDescription: 'Base unit is m/s. 1 mph = 0.44704 m/s; 1 km/h = 1/3.6 m/s; 1 Knot = 1.852 km/h.',
    standardFormula: 'v_{dest} = (v_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '60 MPH to Kilometers per Hour', fromValue: 60, fromUnitId: 'mph', toUnitId: 'kmh' },
      { label: '100 km/h to Miles per Hour', fromValue: 100, fromUnitId: 'kmh', toUnitId: 'mph' },
      { label: '25 Knots to MPH', fromValue: 25, fromUnitId: 'kn', toUnitId: 'mph' },
      { label: 'Mach 1 to km/h', fromValue: 1, fromUnitId: 'mach', toUnitId: 'kmh' },
    ],
    units: [
      { id: 'ms', name: 'Meter per Second', symbol: 'm/s', system: 'metric', factor: 1, popular: true, description: 'SI base unit of velocity' },
      { id: 'kmh', name: 'Kilometer per Hour', symbol: 'km/h', system: 'metric', factor: 1 / 3.6, popular: true, description: 'Standard metric vehicle speed' },
      { id: 'mph', name: 'Mile per Hour', symbol: 'mph', system: 'imperial', factor: 0.44704, popular: true, description: 'Standard US/UK vehicle speed' },
      { id: 'kn', name: 'Knot', symbol: 'kn', system: 'other', factor: 1852 / 3600, popular: true, description: '1 nautical mile per hour' },
      { id: 'fts', name: 'Foot per Second', symbol: 'ft/s', system: 'imperial', factor: 0.3048, description: 'Imperial engineering unit' },
      { id: 'mach', name: 'Mach (Standard Sea Level)', symbol: 'Ma', system: 'scientific', factor: 340.29, description: 'Speed of sound in dry air at 15°C' },
      { id: 'c', name: 'Speed of Light in Vacuum', symbol: 'c', system: 'scientific', factor: 299792458, description: 'Fundamental constant c' },
    ],
  },
  {
    id: 'digital',
    name: 'Digital Storage & Data Transfer',
    iconName: 'HardDrive',
    baseUnit: 'Byte',
    baseUnitSymbol: 'B',
    description: 'Convert bits, bytes, KB, MB, GB, TB, PB with exact decimal (1000) and binary (1024 KiB/GiB) standards.',
    formulaDescription: 'Base unit is Byte (B = 8 bits). Standard SI decimal (1 GB = 10⁹ B) and IEC binary (1 GiB = 2³⁰ B).',
    standardFormula: 'S_{dest} = (S_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 Terabyte to Gigabytes', fromValue: 1, fromUnitId: 'tb', toUnitId: 'gb' },
      { label: '1 Gibibyte (GiB) to Megabytes', fromValue: 1, fromUnitId: 'gib', toUnitId: 'mb' },
      { label: '100 Megabits to Megabytes', fromValue: 100, fromUnitId: 'mbit', toUnitId: 'mb' },
      { label: '1 Gigabyte to Kilobytes', fromValue: 1, fromUnitId: 'gb', toUnitId: 'kb' },
    ],
    units: [
      { id: 'b', name: 'Bit', symbol: 'bit', system: 'digital', factor: 0.125, description: 'Smallest atomic data unit' },
      { id: 'byte', name: 'Byte', symbol: 'B', system: 'digital', factor: 1, popular: true, description: '8 bits' },
      { id: 'kb', name: 'Kilobyte (Decimal)', symbol: 'KB', system: 'digital', factor: 1000, popular: true, description: '1,000 bytes (10³)' },
      { id: 'mb', name: 'Megabyte (Decimal)', symbol: 'MB', system: 'digital', factor: 1000000, popular: true, description: '1,000,000 bytes (10⁶)' },
      { id: 'gb', name: 'Gigabyte (Decimal)', symbol: 'GB', system: 'digital', factor: 1e9, popular: true, description: '1,000,000,000 bytes (10⁹)' },
      { id: 'tb', name: 'Terabyte (Decimal)', symbol: 'TB', system: 'digital', factor: 1e12, popular: true, description: '10¹² bytes' },
      { id: 'pb', name: 'Petabyte (Decimal)', symbol: 'PB', system: 'digital', factor: 1e15, description: '10¹⁵ bytes' },
      { id: 'kib', name: 'Kibibyte (Binary)', symbol: 'KiB', system: 'digital', factor: 1024, description: '1,024 bytes (2¹⁰)' },
      { id: 'mib', name: 'Mebibyte (Binary)', symbol: 'MiB', system: 'digital', factor: 1048576, description: '1,048,576 bytes (2²⁰)' },
      { id: 'gib', name: 'Gibibyte (Binary)', symbol: 'GiB', system: 'digital', factor: 1073741824, popular: true, description: '1,073,741,824 bytes (2³⁰)' },
      { id: 'tib', name: 'Tebibyte (Binary)', symbol: 'TiB', system: 'digital', factor: 1099511627776, description: '2⁴⁰ bytes' },
      { id: 'mbit', name: 'Megabit (Network Rate)', symbol: 'Mb', system: 'digital', factor: 125000, description: '1,000,000 bits = 125,000 bytes' },
      { id: 'gbit', name: 'Gigabit (Network Rate)', symbol: 'Gb', system: 'digital', factor: 125000000, description: '1,000,000,000 bits = 125 MB' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy, Work & Heat',
    iconName: 'Zap',
    baseUnit: 'Joule',
    baseUnitSymbol: 'J',
    description: 'Convert Joules, Kilojoules, Calories, Dietary Kilocalories, Kilowatt-hours (kWh), BTU, and Electronvolts.',
    formulaDescription: 'Base unit is Joule (J = 1 N·m = 1 W·s). 1 kWh = 3,600,000 J; 1 cal = 4.184 J; 1 BTU = 1,055.05585 J.',
    standardFormula: 'E_{dest} = (E_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 Kilowatt-hour to Megajoules', fromValue: 1, fromUnitId: 'kwh', toUnitId: 'mj' },
      { label: '2,000 kcal (Dietary) to Kilojoules', fromValue: 2000, fromUnitId: 'kcal', toUnitId: 'kj' },
      { label: '1 BTU to Joules', fromValue: 1, fromUnitId: 'btu', toUnitId: 'j' },
      { label: '100 Joules to Foot-pounds', fromValue: 100, fromUnitId: 'j', toUnitId: 'ftlbf' },
    ],
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', system: 'metric', factor: 1, popular: true, description: 'SI unit of energy: 1 N · m' },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', system: 'metric', factor: 1000, popular: true, description: '1,000 joules' },
      { id: 'mj', name: 'Megajoule', symbol: 'MJ', system: 'metric', factor: 1000000, description: '1,000,000 joules' },
      { id: 'cal', name: 'Gram Calorie (Thermochemical)', symbol: 'cal', system: 'scientific', factor: 4.184, description: 'Heat to raise 1g water by 1°C' },
      { id: 'kcal', name: 'Kilocalorie (Dietary Calorie)', symbol: 'kcal', system: 'other', factor: 4184, popular: true, description: 'Food energy: 1,000 scientific cal' },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', system: 'scientific', factor: 3600, description: '3,600 joules' },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', system: 'metric', factor: 3600000, popular: true, description: 'Standard electrical utility unit (3.6 MJ)' },
      { id: 'btu', name: 'British Thermal Unit (ISO)', symbol: 'BTU', system: 'imperial', factor: 1055.05585262, popular: true, description: 'Energy to raise 1 lb water by 1°F' },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', system: 'scientific', factor: 1.602176634e-19, description: 'Kinetic energy of single electron' },
      { id: 'ftlbf', name: 'Foot-Pound Force', symbol: 'ft·lbf', system: 'imperial', factor: 1.3558179483314, description: 'Mechanical work in imperial system' },
    ],
  },
  {
    id: 'power',
    name: 'Power & Heat Flow',
    iconName: 'Flame',
    baseUnit: 'Watt',
    baseUnitSymbol: 'W',
    description: 'Convert Watts, Kilowatts, Megawatts, Mechanical Horsepower (hp), Metric Horsepower (PS), and BTU/hr.',
    formulaDescription: 'Base unit is Watt (W = 1 J/s). 1 Mechanical hp = 745.699872 W; 1 Metric PS = 735.49875 W.',
    standardFormula: 'P_{dest} = (P_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '100 Horsepower to Kilowatts', fromValue: 100, fromUnitId: 'hp', toUnitId: 'kw' },
      { label: '1 Kilowatt to BTU per hour', fromValue: 1, fromUnitId: 'kw', toUnitId: 'btuh' },
      { label: '1 Ton of Refrigeration to kW', fromValue: 1, fromUnitId: 'tr', toUnitId: 'kw' },
      { label: '500 Watts to Horsepower', fromValue: 500, fromUnitId: 'w', toUnitId: 'hp' },
    ],
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', system: 'metric', factor: 1, popular: true, description: 'SI unit of power (1 Joule/second)' },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', system: 'metric', factor: 1000, popular: true, description: '1,000 watts' },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', system: 'metric', factor: 1000000, description: '1,000,000 watts' },
      { id: 'hp', name: 'Horsepower (Mechanical / Imperial)', symbol: 'hp', system: 'imperial', factor: 745.69987158227022, popular: true, description: '33,000 ft·lbf/min ≈ 745.7 W' },
      { id: 'ps', name: 'Horsepower (Metric / DIN PS)', symbol: 'PS', system: 'metric', factor: 735.49875, description: '75 kp·m/s ≈ 735.5 W' },
      { id: 'btuh', name: 'BTU per Hour', symbol: 'BTU/h', system: 'imperial', factor: 0.29307107, popular: true, description: 'HVAC heating/cooling capacity' },
      { id: 'tr', name: 'Ton of Refrigeration', symbol: 'TR', system: 'other', factor: 3516.85284, description: '12,000 BTU/h ≈ 3.517 kW' },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure & Stress',
    iconName: 'CircleDot',
    baseUnit: 'Pascal',
    baseUnitSymbol: 'Pa',
    description: 'Convert Pascals, Kilopascals, Bar, PSI (Pounds per Square Inch), Atmospheres (atm), and mmHg (Torr).',
    formulaDescription: 'Base unit is Pascal (Pa = 1 N/m²). 1 Bar = 100,000 Pa; 1 atm = 101,325 Pa; 1 PSI ≈ 6,894.757 Pa.',
    standardFormula: 'p_{dest} = (p_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '1 Bar to PSI (Tire Pressure)', fromValue: 1, fromUnitId: 'bar', toUnitId: 'psi' },
      { label: '32 PSI to Bar', fromValue: 32, fromUnitId: 'psi', toUnitId: 'bar' },
      { label: '1 Atmosphere to Kilopascals', fromValue: 1, fromUnitId: 'atm', toUnitId: 'kpa' },
      { label: '760 mmHg to Atmosphere', fromValue: 760, fromUnitId: 'mmhg', toUnitId: 'atm' },
    ],
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', system: 'metric', factor: 1, popular: true, description: 'SI unit: 1 Newton per m²' },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', system: 'metric', factor: 1000, popular: true, description: '1,000 Pascals' },
      { id: 'mpa', name: 'Megapascal (Stress / Concrete)', symbol: 'MPa', system: 'metric', factor: 1000000, description: '1,000,000 Pascals (1 N/mm²)' },
      { id: 'bar', name: 'Bar', symbol: 'bar', system: 'metric', factor: 100000, popular: true, description: 'Exact 100,000 Pa ≈ 0.9869 atm' },
      { id: 'mbar', name: 'Millibar / Hectopascal', symbol: 'mbar (hPa)', system: 'metric', factor: 100, description: 'Standard atmospheric pressure unit' },
      { id: 'psi', name: 'Pound per Square Inch', symbol: 'psi', system: 'imperial', factor: 6894.757293168, popular: true, description: '1 lbf/in² ≈ 6.895 kPa' },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', system: 'scientific', factor: 101325, popular: true, description: 'Mean sea level air pressure (101.325 kPa)' },
      { id: 'mmhg', name: 'Millimeter of Mercury (Torr)', symbol: 'mmHg', system: 'scientific', factor: 133.322387415, popular: true, description: '1/760th of standard atm' },
      { id: 'inhg', name: 'Inch of Mercury', symbol: 'inHg', system: 'imperial', factor: 3386.389, description: 'Aviation barometric altimeter setting' },
    ],
  },
  {
    id: 'time',
    name: 'Time & Frequency',
    iconName: 'Clock',
    baseUnit: 'Second',
    baseUnitSymbol: 's',
    description: 'Convert seconds, milliseconds, minutes, hours, days, weeks, years, Hertz, kHz, MHz, and GHz.',
    formulaDescription: 'Base unit is Second (s). 1 minute = 60s, 1 hour = 3600s, 1 day = 86,400s, 1 Julian year = 31,557,600s.',
    standardFormula: 't_{dest} = (t_{src} \\times \\text{factor}_{src}) / \\text{factor}_{dest}',
    presetExamples: [
      { label: '86,400 Seconds to Hours', fromValue: 86400, fromUnitId: 's', toUnitId: 'h' },
      { label: '1 Year to Hours', fromValue: 1, fromUnitId: 'yr', toUnitId: 'h' },
      { label: '100 Milliseconds to Seconds', fromValue: 100, fromUnitId: 'ms', toUnitId: 's' },
      { label: '1 Gigahertz to Megahertz', fromValue: 1, fromUnitId: 'ghz', toUnitId: 'mhz' },
    ],
    units: [
      { id: 's', name: 'Second', symbol: 's', system: 'metric', factor: 1, popular: true, description: 'SI base unit of time' },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', system: 'metric', factor: 0.001, popular: true, description: '10⁻³ seconds' },
      { id: 'us', name: 'Microsecond', symbol: 'µs', system: 'scientific', factor: 1e-6, description: '10⁻⁶ seconds' },
      { id: 'ns', name: 'Nanosecond', symbol: 'ns', system: 'scientific', factor: 1e-9, description: '10⁻⁹ seconds' },
      { id: 'min', name: 'Minute', symbol: 'min', system: 'other', factor: 60, popular: true, description: '60 seconds' },
      { id: 'h', name: 'Hour', symbol: 'h', system: 'other', factor: 3600, popular: true, description: '3,600 seconds' },
      { id: 'd', name: 'Day', symbol: 'd', system: 'other', factor: 86400, popular: true, description: '24 hours = 86,400 seconds' },
      { id: 'wk', name: 'Week', symbol: 'wk', system: 'other', factor: 604800, popular: true, description: '7 days = 168 hours' },
      { id: 'yr', name: 'Year (Julian)', symbol: 'yr', system: 'other', factor: 31557600, popular: true, description: '365.25 days' },
      { id: 'hz', name: 'Hertz (Frequency)', symbol: 'Hz', system: 'metric', factor: 1, description: '1 cycle per second' },
      { id: 'khz', name: 'Kilohertz', symbol: 'kHz', system: 'metric', factor: 1000, description: '1,000 Hz' },
      { id: 'mhz', name: 'Megahertz', symbol: 'MHz', system: 'metric', factor: 1000000, description: '1,000,000 Hz' },
      { id: 'ghz', name: 'Gigahertz', symbol: 'GHz', system: 'metric', factor: 1e9, description: '1,000,000,000 Hz' },
    ],
  },
  {
    id: 'everyday',
    name: 'Culinary & Automotive Fuel',
    iconName: 'Car',
    baseUnit: 'Base Index',
    baseUnitSymbol: 'idx',
    description: 'Convert recipe units, fuel efficiency ratings (MPG US vs L/100km), torque (N·m vs lbf·ft), and running pace.',
    formulaDescription: 'Specialized non-linear equations for fuel consumption: L/100km = 235.214583 / MPG (US).',
    standardFormula: 'L/100\\text{km} = 235.214583 / \\text{MPG}_{US}',
    presetExamples: [
      { label: '30 MPG (US) to L/100km', fromValue: 30, fromUnitId: 'mpg_us', toUnitId: 'l100km' },
      { label: '100 N·m Torque to lbf·ft', fromValue: 100, fromUnitId: 'nm_torque', toUnitId: 'lbfft_torque' },
      { label: '8 min/mile Pace to min/km', fromValue: 8, fromUnitId: 'min_mile', toUnitId: 'min_km' },
    ],
    units: [
      { id: 'mpg_us', name: 'Miles per Gallon (US)', symbol: 'MPG (US)', system: 'us_customary', factor: 1, popular: true, description: 'US fuel efficiency rating' },
      { id: 'mpg_uk', name: 'Miles per Gallon (Imperial)', symbol: 'MPG (UK)', system: 'imperial', factor: 1.20095, description: 'UK fuel efficiency rating' },
      { id: 'l100km', name: 'Liters per 100 Kilometers', symbol: 'L/100km', system: 'metric', factor: 1, popular: true, description: 'Metric fuel consumption index' },
      { id: 'kml', name: 'Kilometers per Liter', symbol: 'km/L', system: 'metric', factor: 0.425144, description: 'Metric fuel efficiency ratio' },
      { id: 'nm_torque', name: 'Newton-Meter (Torque)', symbol: 'N·m', system: 'metric', factor: 1, popular: true, description: 'SI unit of torque' },
      { id: 'lbfft_torque', name: 'Pound-Foot (Torque)', symbol: 'lbf·ft', system: 'imperial', factor: 1.355818, popular: true, description: 'Imperial engine torque' },
      { id: 'min_mile', name: 'Minutes per Mile (Pace)', symbol: 'min/mi', system: 'imperial', factor: 1, description: 'Running pace per mile' },
      { id: 'min_km', name: 'Minutes per Kilometer (Pace)', symbol: 'min/km', system: 'metric', factor: 0.621371, description: 'Running pace per km' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. 12 COMPREHENSIVE CONVERSION CATEGORY GROUPS & 60+ SPECIALIZED TOOLS
// ---------------------------------------------------------------------------
export const CONVERSION_CATEGORIES: CategoryGroup[] = [
  {
    id: 'length',
    name: 'Length & Distance',
    icon: 'Ruler',
    tagline: 'Standard metric, imperial, nautical, and astronomical distance calculations.',
    tools: [
      { name: 'Length Converter', desc: 'Universal multi-unit distance converter with live matrix.', path: '/length-converter', badge: 'Core' },
      { name: 'Feet to Inches Converter', desc: 'Convert feet and fractional inches with architectural breakdown.', path: '/length-converter', badge: 'Popular' },
      { name: 'Meters to Feet Converter', desc: 'Exact SI meter to decimal and fractional feet ratios.', path: '/length-converter' },
      { name: 'Kilometers to Miles Converter', desc: 'Highway driving distances and running track benchmarks.', path: '/length-converter' },
      { name: 'Centimeters to Inches Converter', desc: 'Precision clothing, screen sizing, and height conversions.', path: '/length-converter' },
      { name: 'Millimeters to Inches Converter', desc: 'Engineering tolerances, machining, and bolt thread sizing.', path: '/length-converter' },
      { name: 'Nautical Miles to Kilometers', desc: 'Aviation and maritime navigation calculations (1 NM = 1,852 m).', path: '/length-converter' },
    ],
  },
  {
    id: 'mass',
    name: 'Weight & Mass',
    icon: 'Scale',
    tagline: 'Metric kilograms, imperial pounds, stones, troy ounces, and metric tons.',
    tools: [
      { name: 'Weight & Mass Converter', desc: 'Universal mass converter across metric, imperial, and troy scales.', path: '/weight-mass-converter', badge: 'Core' },
      { name: 'Kilograms to Pounds (kg to lbs)', desc: 'Body weight, gym plates, and luggage weight conversions.', path: '/weight-mass-converter', badge: 'Popular' },
      { name: 'Pounds to Kilograms (lbs to kg)', desc: 'Convert pounds to exact decimal and gram measurements.', path: '/weight-mass-converter' },
      { name: 'Grams to Ounces (g to oz)', desc: 'Kitchen baking, nutrition labels, and postal scale weight.', path: '/weight-mass-converter' },
      { name: 'Stones to Pounds & Kilograms', desc: 'UK and Irish body weight stone/pound dual conversions.', path: '/weight-mass-converter' },
      { name: 'Troy Ounces to Grams', desc: 'Gold, silver, and precious metals bullion weight calculations.', path: '/weight-mass-converter' },
      { name: 'Metric Tons to Short Tons (US)', desc: 'Freight, shipping containers, and industrial bulk cargo.', path: '/weight-mass-converter' },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: 'Thermometer',
    tagline: 'Thermodynamic conversions between Celsius, Fahrenheit, Kelvin, and Rankine.',
    tools: [
      { name: 'Temperature Converter', desc: 'Instant bi-directional thermal converter with formula proofs.', path: '/temperature-converter', badge: 'Core' },
      { name: 'Celsius to Fahrenheit (°C to °F)', desc: 'Convert weather, oven baking, and medical fever readings.', path: '/temperature-converter', badge: 'Popular' },
      { name: 'Fahrenheit to Celsius (°F to °C)', desc: 'Convert US weather forecasts and culinary temperatures.', path: '/temperature-converter' },
      { name: 'Celsius to Kelvin (K)', desc: 'Absolute temperature for chemistry, physics, and thermodynamics.', path: '/temperature-converter' },
      { name: 'Fahrenheit to Kelvin', desc: 'Direct cryogenic and aerospace temperature transformations.', path: '/temperature-converter' },
      { name: 'Rankine & Historical Scales', desc: 'Rankine (°R), Réaumur (°Ré), and Newton thermodynamic scales.', path: '/temperature-converter' },
    ],
  },
  {
    id: 'volume',
    name: 'Volume & Liquid Capacity',
    icon: 'Droplets',
    tagline: 'Liquid capacity, culinary volume, dry measure, and 3D geometric displacement.',
    tools: [
      { name: 'Volume & Capacity Converter', desc: 'Universal 3D volume, liquid, and culinary capacity hub.', path: '/volume-converter', badge: 'Core' },
      { name: 'Liters to Gallons (US / UK)', desc: 'Fuel tanks, aquarium volume, and beverage bottling ratios.', path: '/volume-converter', badge: 'Popular' },
      { name: 'Gallons to Liters', desc: 'US liquid gallon (3.785 L) and Imperial gallon (4.546 L) engine.', path: '/volume-converter' },
      { name: 'Milliliters to Fluid Ounces', desc: 'Cosmetic bottles, medicine dosing, and mixology fl oz.', path: '/volume-converter' },
      { name: 'Cups to Milliliters (US / Metric)', desc: 'Baking conversions with 236.6 mL (US) vs 250 mL (Metric).', path: '/volume-converter' },
      { name: 'Cubic Meters to Cubic Feet', desc: 'Room airflow, shipping volume, and HVAC load calculations.', path: '/volume-converter' },
      { name: 'Tablespoons & Teaspoons', desc: 'Sub-tablespoon culinary units and fluid drams breakdown.', path: '/volume-converter' },
    ],
  },
  {
    id: 'area',
    name: 'Area & Land Measure',
    icon: 'Square',
    tagline: 'Real estate square footage, agricultural hectares, acres, and floor plans.',
    tools: [
      { name: 'Area Converter', desc: 'Universal 2D surface and geographic land area engine.', path: '/area-converter', badge: 'Core' },
      { name: 'Square Meters to Square Feet', desc: 'Apartment listings, floor tiles, and construction coverage.', path: '/area-converter', badge: 'Popular' },
      { name: 'Acres to Hectares', desc: 'Agricultural farmland and zoning tract area transformations.', path: '/area-converter' },
      { name: 'Square Feet to Acres', desc: 'Real estate parcel sizing (1 acre = 43,560 sq ft).', path: '/area-converter' },
      { name: 'Square Miles to Square Kilometers', desc: 'National parks, territorial sizes, and municipal geography.', path: '/area-converter' },
      { name: 'Square Inches to Square Centimeters', desc: 'Precision engineering cross-sections and component sizing.', path: '/area-converter' },
    ],
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    icon: 'Gauge',
    tagline: 'Vehicular speed, nautical knots, wind velocity, and physical constants.',
    tools: [
      { name: 'Speed & Velocity Converter', desc: 'Multi-scale velocity and aeronautical speed transformations.', path: '/speed-converter', badge: 'Core' },
      { name: 'MPH to km/h Converter', desc: 'Automotive speed limits, speedometer calibration, and telemetry.', path: '/speed-converter', badge: 'Popular' },
      { name: 'km/h to MPH Converter', desc: 'International road travel and European highway speed conversions.', path: '/speed-converter' },
      { name: 'Knots to MPH & km/h', desc: 'Marine nautical navigation and aviation wind speed reports.', path: '/speed-converter' },
      { name: 'Meters per Second to km/h', desc: 'Physics kinematics, athletics sprint speeds, and wind gusts.', path: '/speed-converter' },
      { name: 'Mach Number & Sound Velocity', desc: 'Supersonic flight calculations relative to atmospheric conditions.', path: '/speed-converter' },
    ],
  },
  {
    id: 'digital',
    name: 'Digital Storage & Data Transfer',
    icon: 'HardDrive',
    tagline: 'Bits, bytes, MB, GB, TB, binary KiB/GiB, and bandwidth download times.',
    tools: [
      { name: 'Data Storage Converter', desc: 'Compare hard drive capacity in decimal (GB) and binary (GiB).', path: '/data-storage-converter', badge: 'Core' },
      { name: 'Data Transfer Rate Converter', desc: 'Bandwidth speeds from Mbps to actual download Megabytes/sec.', path: '/data-transfer-converter', badge: 'Popular' },
      { name: 'Megabytes to Gigabytes (MB to GB)', desc: 'File uploads, RAM sizing, and mobile data allowance math.', path: '/data-storage-converter' },
      { name: 'Gigabytes to Terabytes (GB to TB)', desc: 'Cloud storage plans, NVMe SSDs, and enterprise backup sizing.', path: '/data-storage-converter' },
      { name: 'Bits to Bytes Calculator', desc: 'Network protocol frames, telecom bandwidth, and raw byte sizing.', path: '/data-storage-converter' },
      { name: 'Download Time Calculator', desc: 'Estimate file transfer duration based on network connection speed.', path: '/data-transfer-converter' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy, Work & Heat',
    icon: 'Zap',
    tagline: 'Joules, calories, kilowatt-hours, BTUs, and electronvolts.',
    tools: [
      { name: 'Energy & Work Converter', desc: 'Thermodynamic, electrical, and mechanical energy converter.', path: '/energy-converter', badge: 'Core' },
      { name: 'Kilowatt-Hours to Joules (kWh to J)', desc: 'Electric bill meter readings, solar battery storage (1 kWh = 3.6 MJ).', path: '/energy-converter', badge: 'Popular' },
      { name: 'Calories to Joules (cal to J)', desc: 'Scientific thermochemical heat and mechanical work equivalents.', path: '/energy-converter' },
      { name: 'Dietary Calories (kcal) to Kilojoules', desc: 'Nutrition label energy conversion (1 kcal = 4.184 kJ).', path: '/energy-converter' },
      { name: 'BTU to Joules & kWh', desc: 'Natural gas heating, heat pumps, and air conditioner capacities.', path: '/energy-converter' },
      { name: 'Electronvolts (eV) to Joules', desc: 'Quantum mechanics, photon energy, and semiconductor band gaps.', path: '/energy-converter' },
    ],
  },
  {
    id: 'power',
    name: 'Power & Heat Flow',
    icon: 'Flame',
    tagline: 'Watts, kilowatts, mechanical horsepower (hp), metric PS, and BTU/hr.',
    tools: [
      { name: 'Power Converter', desc: 'Mechanical, electrical, and thermal power flow rate engine.', path: '/power-converter', badge: 'Core' },
      { name: 'Kilowatts to Horsepower (kW to HP)', desc: 'Electric vehicle (EV) motor power and ICE engine benchmarking.', path: '/power-converter', badge: 'Popular' },
      { name: 'Horsepower to Watts (HP to W)', desc: 'Industrial electric motors, pumps, and mechanical drivetrains.', path: '/power-converter' },
      { name: 'Watts to Kilowatts & Megawatts', desc: 'Solar generation, grid transmission, and power supply rating.', path: '/power-converter' },
      { name: 'BTU/hr to Kilowatts', desc: 'HVAC furnace ratings and chiller refrigeration tonnage.', path: '/power-converter' },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure & Stress',
    icon: 'CircleDot',
    tagline: 'Bar, PSI, Pascals, atmospheres, and barometric mercury columns.',
    tools: [
      { name: 'Pressure Converter', desc: 'Fluid dynamics, tire inflation, and atmospheric pressure engine.', path: '/pressure-converter', badge: 'Core' },
      { name: 'Bar to PSI Converter', desc: 'Automotive tire pressure, espresso machines, and scuba tanks.', path: '/pressure-converter', badge: 'Popular' },
      { name: 'PSI to Bar Converter', desc: 'Convert US tire pressure specs to European bar standard.', path: '/pressure-converter' },
      { name: 'Pascals to Kilopascals & Megapascals', desc: 'Structural civil engineering concrete strength (MPa).', path: '/pressure-converter' },
      { name: 'Atmosphere (atm) to Bar & kPa', desc: 'Meteorology, barometric altitude, and hyperbaric chambers.', path: '/pressure-converter' },
      { name: 'mmHg (Torr) to inHg & PSI', desc: 'Medical blood pressure, vacuum pumps, and weather barometers.', path: '/pressure-converter' },
    ],
  },
  {
    id: 'time',
    name: 'Time & Frequency',
    icon: 'Clock',
    tagline: 'Time durations, military clock, timestamp epochs, and cyclic frequencies.',
    tools: [
      { name: 'Time Converter', desc: 'Convert milliseconds, seconds, hours, weeks, and Julian years.', path: '/time-converter', badge: 'Core' },
      { name: 'Add & Subtract Time Calculator', desc: 'Add or subtract hours, minutes, and seconds across timestamps.', path: '/add-subtract-time-calculator', badge: 'Popular' },
      { name: 'Military Time Converter', desc: 'Convert 12-hour AM/PM to 24-hour military and aviation clock.', path: '/military-time-converter' },
      { name: 'Unix Timestamp Converter', desc: 'Convert POSIX epoch seconds/milliseconds to human UTC dates.', path: '/unix-timestamp-converter' },
      { name: 'Frequency Converter (Hz to GHz)', desc: 'Cyclic oscillation rates, acoustic audio, and RF wireless bands.', path: '/frequency-converter' },
      { name: 'Date Difference Calculator', desc: 'Calculate exact elapsed days, weeks, and business days.', path: '/date-difference-calculator' },
    ],
  },
  {
    id: 'everyday',
    name: 'Culinary, Fuel & Everyday',
    icon: 'Car',
    tagline: 'Recipe ingredient scaling, vehicle fuel economy, torque, and fitness pace.',
    tools: [
      { name: 'Cooking & Recipe Converter', desc: 'Scale tablespoons, cups, fluid ounces, and grams in baking.', path: '/cooking-converter', badge: 'Popular' },
      { name: 'Fuel Economy Converter', desc: 'Convert MPG (US/UK) to Liters per 100km and km/L.', path: '/fuel-economy-converter', badge: 'Popular' },
      { name: 'Torque Converter', desc: 'Engine torque from Newton-meters (N·m) to foot-pounds (lbf·ft).', path: '/torque-converter' },
      { name: 'Running Pace Calculator', desc: 'Convert min/mile to min/km and calculate marathon split times.', path: '/running-pace-calculator' },
      { name: 'Pet Age Converter', desc: 'Biological developmental age equivalents for dogs and cats.', path: '/pet-age-converter' },
      { name: 'Number Systems Converter', desc: 'Convert Binary, Hexadecimal, Octal, and Decimal integers.', path: '/number-systems-converter' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. METRIC TO IMPERIAL COMPARISON BRIDGE LOOKUP TABLES
// ---------------------------------------------------------------------------
export const METRIC_IMPERIAL_PAIRS: MetricImperialPair[] = [
  {
    quantity: 'Length (Everyday)',
    metricUnit: '1 Centimeter (cm)',
    imperialUnit: '0.3937 Inches (in)',
    metricToImperialRatio: '1 cm = 0.393701 in',
    imperialToMetricRatio: '1 in = 2.54 cm (Exact)',
    practicalExample: 'A standard credit card is 8.56 cm × 5.398 cm (3.37 in × 2.125 in).',
  },
  {
    quantity: 'Distance (Travel)',
    metricUnit: '1 Kilometer (km)',
    imperialUnit: '0.6214 Miles (mi)',
    metricToImperialRatio: '1 km = 0.621371 mi',
    imperialToMetricRatio: '1 mi = 1.609344 km',
    practicalExample: 'A 5K run is 3.107 miles; 100 km/h highway speed is 62.14 mph.',
  },
  {
    quantity: 'Mass / Body Weight',
    metricUnit: '1 Kilogram (kg)',
    imperialUnit: '2.2046 Pounds (lbs)',
    metricToImperialRatio: '1 kg = 2.204623 lbs',
    imperialToMetricRatio: '1 lb = 0.453592 kg',
    practicalExample: 'A 70 kg individual weighs approximately 154.32 lbs.',
  },
  {
    quantity: 'Liquid Volume',
    metricUnit: '1 Liter (L)',
    imperialUnit: '0.2642 Gallons (US)',
    metricToImperialRatio: '1 L = 0.264172 gal (US)',
    imperialToMetricRatio: '1 gal (US) = 3.785412 L',
    practicalExample: 'A standard 2-liter soda bottle contains 67.63 US fluid ounces (0.528 gal).',
  },
  {
    quantity: 'Surface Area',
    metricUnit: '1 Square Meter (m²)',
    imperialUnit: '10.7639 Square Feet (sq ft)',
    metricToImperialRatio: '1 m² = 10.76391 sq ft',
    imperialToMetricRatio: '100 sq ft = 9.2903 m²',
    practicalExample: 'A 100 m² modern apartment is approximately 1,076.39 square feet.',
  },
  {
    quantity: 'Tire & Fluid Pressure',
    metricUnit: '1 Bar (100 kPa)',
    imperialUnit: '14.5038 PSI (lbf/in²)',
    metricToImperialRatio: '1 bar = 14.503774 psi',
    imperialToMetricRatio: '32 psi = 2.2063 bar',
    practicalExample: 'Standard passenger car tire pressure (32–35 PSI) equals 2.2–2.4 Bar.',
  },
];

// ---------------------------------------------------------------------------
// 4. SI METRIC PREFIX SCALE REFERENCE (10^24 to 10^-24)
// ---------------------------------------------------------------------------
export const SI_PREFIXES_DATA: SIPrefixItem[] = [
  {
    prefix: 'Yotta',
    symbol: 'Y',
    power: 24,
    multiplier: '10²⁴',
    decimalValue: '1,000,000,000,000,000,000,000,000',
    scaleExample: 'Mass of the Earth’s oceans (~1.4 Yg)',
    realm: 'macro',
  },
  {
    prefix: 'Zetta',
    symbol: 'Z',
    power: 21,
    multiplier: '10²¹',
    decimalValue: '1,000,000,000,000,000,000,000',
    scaleExample: 'Global internet traffic volume per year (~3 ZB)',
    realm: 'macro',
  },
  {
    prefix: 'Exa',
    symbol: 'E',
    power: 18,
    multiplier: '10¹⁸',
    decimalValue: '1,000,000,000,000,000,000',
    scaleExample: 'Exascale supercomputers (10¹⁸ FLOPS)',
    realm: 'macro',
  },
  {
    prefix: 'Peta',
    symbol: 'P',
    power: 15,
    multiplier: '10¹⁵',
    decimalValue: '1,000,000,000,000,000',
    scaleExample: 'Large cloud data center storage (~100 PB)',
    realm: 'macro',
  },
  {
    prefix: 'Tera',
    symbol: 'T',
    power: 12,
    multiplier: '10¹²',
    decimalValue: '1,000,000,000,000',
    scaleExample: '1 Terabyte hard drive; distance to Saturn (~1.4 Tm)',
    realm: 'macro',
  },
  {
    prefix: 'Giga',
    symbol: 'G',
    power: 9,
    multiplier: '10⁹',
    decimalValue: '1,000,000,000',
    scaleExample: 'CPU clock speed (3.5 GHz); 1 Gigabyte memory',
    realm: 'everyday',
  },
  {
    prefix: 'Mega',
    symbol: 'M',
    power: 6,
    multiplier: '10⁶',
    decimalValue: '1,000,000',
    scaleExample: 'Power plant output (500 MW); digital photo size',
    realm: 'everyday',
  },
  {
    prefix: 'Kilo',
    symbol: 'k',
    power: 3,
    multiplier: '10³',
    decimalValue: '1,000',
    scaleExample: '1 Kilometer (1,000 m); 1 Kilogram (1,000 g)',
    realm: 'everyday',
  },
  {
    prefix: 'Centi',
    symbol: 'c',
    power: -2,
    multiplier: '10⁻²',
    decimalValue: '0.01',
    scaleExample: 'Width of a pencil (~0.7 cm)',
    realm: 'everyday',
  },
  {
    prefix: 'Milli',
    symbol: 'm',
    power: -3,
    multiplier: '10⁻³',
    decimalValue: '0.001',
    scaleExample: 'Thickness of a credit card (~0.76 mm)',
    realm: 'everyday',
  },
  {
    prefix: 'Micro',
    symbol: 'µ',
    power: -6,
    multiplier: '10⁻⁶',
    decimalValue: '0.000001',
    scaleExample: 'Human red blood cell diameter (~7 µm)',
    realm: 'micro',
  },
  {
    prefix: 'Nano',
    symbol: 'n',
    power: -9,
    multiplier: '10⁻⁹',
    decimalValue: '0.000000001',
    scaleExample: 'DNA double helix diameter (~2 nm); semiconductor gates',
    realm: 'nano',
  },
  {
    prefix: 'Pico',
    symbol: 'p',
    power: -12,
    multiplier: '10⁻¹²',
    decimalValue: '0.000000000001',
    scaleExample: 'Radius of a helium atom (~31 pm)',
    realm: 'nano',
  },
  {
    prefix: 'Femto',
    symbol: 'f',
    power: -15,
    multiplier: '10⁻¹⁵',
    decimalValue: '0.000000000000001',
    scaleExample: 'Diameter of an atomic proton (~0.84 fm)',
    realm: 'nano',
  },
  {
    prefix: 'Atto',
    symbol: 'a',
    power: -18,
    multiplier: '10⁻¹⁸',
    decimalValue: '0.000000000000000001',
    scaleExample: 'Attosecond laser physics (electron transit time)',
    realm: 'nano',
  },
];

// ---------------------------------------------------------------------------
// 5. 6 CURATED ACADEMIC & INDUSTRY WORKBENCHES
// ---------------------------------------------------------------------------
export const CONVERSION_WORKBENCHES: ConversionWorkbenchKit[] = [
  {
    id: 'engineering',
    title: 'Mechanical & Civil Engineering',
    persona: 'Engineers & Architects',
    desc: 'Stress analysis, hydraulic pressure, structural loads, torque, and thermodynamic power.',
    icon: 'Wrench',
    recommendedTools: [
      { name: 'Pressure & Stress (MPa / PSI)', path: '/pressure-converter', purpose: 'Material tensile strength and hydraulic pipe pressure.' },
      { name: 'Torque (N·m / lbf·ft)', path: '/torque-converter', purpose: 'Bolt tightening specs and engine shaft torque.' },
      { name: 'Power & Heat Flow (kW / HP)', path: '/power-converter', purpose: 'Motor ratings, pump sizing, and HVAC tonnage.' },
      { name: 'Area & Volume Converter', path: '/area-converter', purpose: 'Geometric displacement and structural cross-sections.' },
    ],
  },
  {
    id: 'science-physics',
    title: 'Physics & Chemistry Lab',
    persona: 'Researchers & STEM Students',
    desc: 'SI base units, thermodynamic temperatures, electronvolts, and molecular energy states.',
    icon: 'Atom',
    recommendedTools: [
      { name: 'Kelvin & Thermodynamic Scale', path: '/temperature-converter', purpose: 'Ideal gas law equations and cryogenic physics.' },
      { name: 'Energy & Electronvolts (eV)', path: '/energy-converter', purpose: 'Photon energy, ionization potential, and Planck radiation.' },
      { name: 'Frequency (Hz to GHz)', path: '/frequency-converter', purpose: 'Electromagnetic spectrum and resonance cycles.' },
      { name: 'Scientific Weight & Mass', path: '/weight-mass-converter', purpose: 'Micrograms, molar mass ratios, and chemical reagents.' },
    ],
  },
  {
    id: 'computing',
    title: 'Software, IT & Data Centers',
    persona: 'Developers & SysAdmins',
    desc: 'Decimal storage vs. binary memory, transfer bandwidth throughput, and epoch timestamps.',
    icon: 'Cpu',
    recommendedTools: [
      { name: 'Data Storage (GB vs GiB)', path: '/data-storage-converter', purpose: 'Reconcile storage vendor specs with OS filesystem capacity.' },
      { name: 'Data Transfer Rate (Mbps / MB/s)', path: '/data-transfer-converter', purpose: 'Cloud migration time and network bandwidth sizing.' },
      { name: 'Unix Timestamp Converter', path: '/unix-timestamp-converter', purpose: 'Convert POSIX epoch seconds to ISO UTC datetimes.' },
      { name: 'Number Systems (Hex / Bin / Dec)', path: '/number-systems-converter', purpose: 'Bitwise bitmasks, memory offsets, and color codes.' },
    ],
  },
  {
    id: 'culinary',
    title: 'Culinary Arts & Commercial Baking',
    persona: 'Chefs & Pastry Bakers',
    desc: 'Exact volume-to-weight scaling, oven temperature conversions, and spoon measurements.',
    icon: 'Utensils',
    recommendedTools: [
      { name: 'Cooking & Recipe Scaler', path: '/cooking-converter', purpose: 'Scale recipe proportions for commercial batch yields.' },
      { name: 'Oven Temperature (°C / °F)', path: '/temperature-converter', purpose: 'Convert European baking recipes for US convection ovens.' },
      { name: 'Volume (Cups to Milliliters)', path: '/volume-converter', purpose: 'US customary cups (236.6 mL) vs Metric baking cups (250 mL).' },
      { name: 'Weight (Grams to Ounces)', path: '/weight-mass-converter', purpose: 'Precision flour, yeast, and sourdough hydration ratios.' },
    ],
  },
  {
    id: 'travel-freight',
    title: 'International Travel & Logistics',
    persona: 'Travelers & Freight Brokers',
    desc: 'Luggage weight limits, highway speed limits, weather temperatures, and shipping volumes.',
    icon: 'Plane',
    recommendedTools: [
      { name: 'Luggage Weight (kg to lbs)', path: '/weight-mass-converter', purpose: 'Airline checked bag weight allowances (23 kg = 50.7 lbs).' },
      { name: 'Speed Limits (km/h to MPH)', path: '/speed-converter', purpose: 'Foreign rental car driving and speedometer adaptation.' },
      { name: 'Weather Forecast (°C to °F)', path: '/temperature-converter', purpose: 'Daily packing and ambient climate awareness.' },
      { name: 'Freight Tonnage (Tonne / US Ton)', path: '/weight-mass-converter', purpose: 'Intermodal container gross payload thresholds.' },
    ],
  },
  {
    id: 'trade-construction',
    title: 'Trade & Building Construction',
    persona: 'Contractors & Tradespeople',
    desc: 'Square footage, lumber dimensions, concrete volume, and structural fastener sizing.',
    icon: 'Building',
    recommendedTools: [
      { name: 'Square Feet to Square Meters', path: '/area-converter', purpose: 'Flooring, drywall, and roofing surface coverage.' },
      { name: 'Feet & Fractional Inches', path: '/length-converter', purpose: 'Rough carpentry framing and architectural blueprints.' },
      { name: 'Cubic Yards to Cubic Meters', path: '/volume-converter', purpose: 'Concrete pour estimation and gravel aggregate volume.' },
      { name: 'Pressure (PSI / Bar)', path: '/pressure-converter', purpose: 'Compressor air hose lines and plumbing hydro-testing.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 6. 15 COMPREHENSIVE CONVERSION FAQS (Schema.org FAQPage Compliant)
// ---------------------------------------------------------------------------
export const CONVERSION_FAQS: ConversionFaq[] = [
  {
    q: 'How does the SolveItCalculator unit conversion engine maintain mathematical precision?',
    a: 'All conversions are computed using standardized floating-point conversion factors directly traceable to NIST Special Publication 811, the Bureau International des Poids et Mesures (BIPM), and ISO 80000 standards. Calculations use high-precision 64-bit IEEE 754 arithmetic with a user-configurable precision controller (1 to 12 decimal places) and automatic scientific notation formatting for extreme values.',
  },
  {
    q: 'What is the difference between a Gigabyte (GB) and a Gibibyte (GiB)?',
    a: 'A Gigabyte (GB) uses the decimal SI prefix where 1 GB = 10⁹ bytes (1,000,000,000 bytes), which is standard for storage drive manufacturers and network telecom. A Gibibyte (GiB) uses the binary IEC standard where 1 GiB = 2³⁰ bytes (1,073,741,824 bytes), which is standard for operating systems (like Windows RAM and disk reporting). This is why a 1 TB hard drive reports as approximately 931.3 GiB in Windows.',
  },
  {
    q: 'Why is there a difference between US Liquid Gallons and Imperial (UK) Gallons?',
    a: 'The US Liquid Gallon is historically based on the British Wine Gallon of 1707 and is defined as exactly 231 cubic inches (approx. 3.78541 liters). The Imperial Gallon was standardized by the British Weights and Measures Act of 1824 as the volume of 10 pounds of distilled water at 62°F, defined as exactly 4.54609 liters (approx. 1.20095 US gallons).',
  },
  {
    q: 'How do you convert Celsius to Fahrenheit accurately without a calculator?',
    a: 'The exact formula is °F = (°C × 1.8) + 32. For a rapid mental approximation: double the Celsius value, subtract 10%, and add 32. For example, for 20°C: 20 × 2 = 40; 40 - 4 = 36; 36 + 32 = 68°F (exact matches 68°F).',
  },
  {
    q: 'What is the exact definition of an International Inch in millimeters?',
    a: 'Under the 1959 International Yard and Pound Agreement signed by the United States, United Kingdom, Canada, Australia, New Zealand, and South Africa, the international inch is defined as exactly 25.4 millimeters (0.0254 meters).',
  },
  {
    q: 'What is a Troy Ounce and when is it used instead of an Avoirdupois Ounce?',
    a: 'A Troy Ounce (oz t) is used exclusively for weighing precious metals (gold, silver, platinum, palladium) and gemstones. 1 Troy Ounce equals exactly 31.1034768 grams, whereas a standard everyday Avoirdupois Ounce (oz) equals approximately 28.3495 grams. Therefore, 1 Troy Ounce is approximately 9.7% heavier than a regular grocery ounce.',
  },
  {
    q: 'How does fuel economy convert between MPG and Liters per 100 km (L/100km)?',
    a: 'Because MPG measures distance per volume (efficiency) while L/100km measures volume per distance (consumption), their relationship is inversely proportional. To convert US MPG to L/100km, use: L/100km = 235.214583 / MPG (US). For Imperial (UK) MPG, use: L/100km = 282.481 / MPG (UK).',
  },
  {
    q: 'What is the difference between Gauge Pressure and Absolute Pressure?',
    a: 'Absolute Pressure (psia) is measured relative to a perfect vacuum (0 psi), whereas Gauge Pressure (psig) is measured relative to ambient atmospheric pressure (~14.7 psi or 1.013 bar at sea level). Tire pressure gauges measure gauge pressure: a tire reading of 32 PSI actually has an absolute internal pressure of 46.7 PSIA.',
  },
  {
    q: 'What is a Nautical Mile and why is it used in aviation and maritime shipping?',
    a: 'A Nautical Mile (NM) is defined internationally as exactly 1,852 meters (approx. 1.1508 standard statute miles). It historically represents one minute of latitude along any meridian of longitude on Earth, allowing navigators to calculate distances directly from navigational charts without spherical distortion corrections.',
  },
  {
    q: 'What are the SI metric prefixes from Nano to Giga?',
    a: 'The standard SI decimal prefixes are: Nano (n, 10⁻⁹), Micro (µ, 10⁻⁶), Milli (m, 10⁻³), Centi (c, 10⁻²), Kilo (k, 10³), Mega (M, 10⁶), and Giga (G, 10⁹). Each step from micro to giga represents a factor of 1,000 (10³).',
  },
  {
    q: 'How do I convert Kilowatt-Hours (kWh) to Megajoules (MJ)?',
    a: 'Because 1 Watt = 1 Joule per second, 1 Watt-hour = 3,600 Joules. Therefore, 1 Kilowatt-hour (kWh) = 1,000 Watts × 3,600 seconds = 3,600,000 Joules = 3.6 Megajoules (MJ). To convert kWh to MJ, simply multiply by 3.6.',
  },
  {
    q: 'Why do baking recipes fail when converting cups between the US and Europe?',
    a: 'In the United States, a standard recipe cup is 236.59 mL (8 US fluid ounces). In Commonwealth countries (Australia, UK, New Zealand) and Europe, a metric cup is defined as exactly 250 mL (approx. 5.7% larger). Furthermore, dry ingredients like flour vary heavily by humidity and packing density, which is why professional culinary kitchens measure by weight (grams) rather than volume (cups).',
  },
  {
    q: 'What is the relationship between Mach Number and air speed?',
    a: 'Mach number is the ratio of an object’s true airspeed to the local speed of sound in the surrounding fluid medium. At standard sea-level atmospheric conditions (15°C / 59°F), Mach 1 equals approximately 340.29 m/s (1,225 km/h or 761.2 mph). Because the speed of sound decreases at higher altitudes and colder air temperatures, Mach 1 at cruising altitude (36,000 ft) is only ~660 mph (1,062 km/h).',
  },
  {
    q: 'Can I bookmark or export my live conversion calculations?',
    a: 'Yes, every live conversion computed in the workbench can be copied to your clipboard with a single click in multiple formats (standard value, formatted algebraic formula, or tab-delimited text for spreadsheet pasting).',
  },
  {
    q: 'Are all calculators on SolveItCalculator free to use on mobile and desktop?',
    a: 'Yes, all 60+ conversion calculators and live engineering workbenches are 100% free, require no user account, work offline via cached browser execution, and are fully optimized for smartphones, tablets, and desktop workstations.',
  },
];
