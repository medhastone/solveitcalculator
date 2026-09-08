// High Search Volume, Low KD SEO metadata & keyword configuration for SolveIt Conversion Categories

export interface CategorySeoConfig {
  id: string;
  name: string;
  seoTitle: string; // Used in <title> and OpenGraph
  h1: string; // Primary H1 head term
  h1Highlight: string; // Accent high-volume/low-KD long-tail modifier
  description: string; // High-CTR, keyword-rich meta description
  targetKeywords: string[]; // Primary and secondary target keywords
}

export const CATEGORY_SEO_CONFIGS: Record<string, CategorySeoConfig> = {
  length: {
    id: 'length',
    name: 'Length',
    seoTitle: 'Length Converter - Convert Feet, Meters, Inches, cm & km | SolveIt',
    h1: 'Length Converter',
    h1Highlight: '& Distance Calculator',
    description: 'Free online length converter. Instantly convert between feet, meters, inches, centimeters (cm), millimeters, and miles with exact imperial & metric formulas.',
    targetKeywords: [
      'length converter',
      'feet to meters',
      'cm to inches',
      'inches to cm',
      'distance converter',
      'length unit calculator'
    ]
  },
  weight: {
    id: 'weight',
    name: 'Weight & Mass',
    seoTitle: 'Weight Converter - Convert kg to lbs, Grams, Ounces & Stones | SolveIt',
    h1: 'Weight & Mass Converter',
    h1Highlight: '& Mass Calculator',
    description: 'Free weight converter to convert kilograms to pounds (kg to lbs), grams to ounces, stones to kg, and metric tons. Instant, accurate weight and mass calculations.',
    targetKeywords: [
      'weight converter',
      'kg to lbs',
      'pounds to kg',
      'grams to ounces',
      'lbs to kg converter',
      'weight unit converter'
    ]
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    seoTitle: 'Temperature Converter - Celsius to Fahrenheit (°C to °F) | SolveIt',
    h1: 'Temperature Converter',
    h1Highlight: '(°C, °F, Kelvin)',
    description: 'Convert temperature instantly between Celsius, Fahrenheit, Kelvin, and Rankine. Free online °C to °F formula calculator with real-time thermal scales.',
    targetKeywords: [
      'temperature converter',
      'celsius to fahrenheit',
      'fahrenheit to celsius',
      'c to f converter',
      'kelvin to celsius',
      'temperature calculator'
    ]
  },
  volume: {
    id: 'volume',
    name: 'Volume & Capacity',
    seoTitle: 'Volume Converter - Convert Gallons, Liters, Cups, mL & Ounces | SolveIt',
    h1: 'Volume Converter',
    h1Highlight: '& Liquid Capacity Calculator',
    description: 'Free online volume converter. Easily convert gallons to liters, milliliters (mL) to cups, fluid ounces, pints, quarts, and cubic meters with exact conversion ratios.',
    targetKeywords: [
      'volume converter',
      'gallons to liters',
      'liters to gallons',
      'cups to ml',
      'fluid ounces to ml',
      'capacity converter',
      'liquid converter'
    ]
  },
  area: {
    id: 'area',
    name: 'Area',
    seoTitle: 'Area Converter - Square Feet to Square Meters, Acres & Hectares | SolveIt',
    h1: 'Area Converter',
    h1Highlight: '& Land Measurement Calculator',
    description: 'Free area unit converter to calculate square feet to square meters (sq ft to sq m), acres to hectares, and square inches. Perfect for real estate and construction.',
    targetKeywords: [
      'area converter',
      'square feet to square meters',
      'sq ft to sq m',
      'acres to hectares',
      'land area converter',
      'square meters to square feet'
    ]
  },
  speed: {
    id: 'speed',
    name: 'Speed & Velocity',
    seoTitle: 'Speed Converter - mph to km/h, m/s & Knots Calculator | SolveIt',
    h1: 'Speed & Velocity Converter',
    h1Highlight: '(mph, km/h, Knots, m/s)',
    description: 'Instantly convert speed between miles per hour (mph), kilometers per hour (km/h), knots, and meters per second (m/s). Free automotive and aerospace calculator.',
    targetKeywords: [
      'speed converter',
      'mph to kmh',
      'kmh to mph',
      'knots to mph',
      'velocity converter',
      'speed unit converter'
    ]
  },
  time: {
    id: 'time',
    name: 'Time',
    seoTitle: 'Time Converter - Convert Hours, Minutes, Seconds & Days | SolveIt',
    h1: 'Time Converter',
    h1Highlight: '& Duration Calculator',
    description: 'Free time unit converter. Calculate hours to minutes, minutes to seconds, days to hours, and milliseconds. Exact duration calculations for schedules & science.',
    targetKeywords: [
      'time converter',
      'hours to minutes',
      'minutes to seconds',
      'days to hours',
      'time unit calculator',
      'duration converter'
    ]
  },
  pressure: {
    id: 'pressure',
    name: 'Pressure',
    seoTitle: 'Pressure Converter - PSI to Bar, kPa & Atmospheres | SolveIt',
    h1: 'Pressure Converter',
    h1Highlight: '(PSI, Bar, kPa, atm)',
    description: 'Convert pressure units easily between PSI, Bar, Kilopascals (kPa), Atmospheres (atm), and Torr. Free calculator for automotive tires, hydraulics & HVAC.',
    targetKeywords: [
      'pressure converter',
      'psi to bar',
      'bar to psi',
      'kpa to psi',
      'tire pressure converter',
      'atm to psi'
    ]
  },
  energy: {
    id: 'energy',
    name: 'Energy & Work',
    seoTitle: 'Energy Converter - Joules, Calories, kWh & BTU Calculator | SolveIt',
    h1: 'Energy & Work Converter',
    h1Highlight: '(Joules, Calories, kWh)',
    description: 'Free energy converter to convert Joules to calories, kilowatt-hours (kWh) to Joules, and BTUs. Accurate calculations for electricity bills, nutrition & physics.',
    targetKeywords: [
      'energy converter',
      'joules to calories',
      'kwh to joules',
      'calories to joules',
      'btu to joules',
      'work converter'
    ]
  },
  power: {
    id: 'power',
    name: 'Power',
    seoTitle: 'Power Converter - Horsepower to Kilowatts (HP to kW) & Watts | SolveIt',
    h1: 'Power Converter',
    h1Highlight: '(Watts, Kilowatts, Horsepower)',
    description: 'Convert power units instantly between Horsepower (hp) and Kilowatts (kW), Watts, and BTU/hr. Free electrical and automotive engine power calculator.',
    targetKeywords: [
      'power converter',
      'hp to kw',
      'kw to hp',
      'horsepower to kilowatts',
      'watts to kilowatts',
      'power unit calculator'
    ]
  },
  torque: {
    id: 'torque',
    name: 'Torque',
    seoTitle: 'Torque Converter - Foot-Pounds to Newton-Meters (ft-lb to N·m) | SolveIt',
    h1: 'Torque Converter',
    h1Highlight: '(ft-lb to N·m, in-lb)',
    description: 'Easily convert torque between foot-pounds (ft-lb, lb-ft), newton-meters (N·m), inch-pounds, and kgf·m. Free calculator for automotive mechanics & engineering.',
    targetKeywords: [
      'torque converter',
      'ft lb to nm',
      'nm to ft lb',
      'foot pounds to newton meters',
      'torque unit converter',
      'in lb to ft lb'
    ]
  },
  frequency: {
    id: 'frequency',
    name: 'Frequency',
    seoTitle: 'Frequency Converter - Hz to kHz, MHz, GHz & RPM Calculator | SolveIt',
    h1: 'Frequency Converter',
    h1Highlight: '(Hz, kHz, MHz, RPM)',
    description: 'Convert frequency units between Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), Gigahertz (GHz), and RPM. Free audio acoustics and radio wave calculator.',
    targetKeywords: [
      'frequency converter',
      'hz to khz',
      'rpm to hz',
      'mhz to ghz',
      'frequency unit calculator',
      'hertz converter'
    ]
  },
  fuel_economy: {
    id: 'fuel_economy',
    name: 'Fuel Economy',
    seoTitle: 'Fuel Economy Converter - MPG to L/100km & km/L Calculator | SolveIt',
    h1: 'Fuel Economy Converter',
    h1Highlight: '(MPG to L/100km, km/L)',
    description: 'Convert vehicle gas mileage between US MPG, UK Imperial MPG, Liters per 100km (L/100km), and km/L. Instant fuel consumption calculator for cars and trucks.',
    targetKeywords: [
      'fuel economy converter',
      'mpg to l100km',
      'l100km to mpg',
      'gas mileage converter',
      'km per liter to mpg',
      'fuel consumption converter'
    ]
  },
  data_storage: {
    id: 'data_storage',
    name: 'Data Storage',
    seoTitle: 'Data Storage Converter - GB to MB, TB, KB & Bytes Calculator | SolveIt',
    h1: 'Data Storage Converter',
    h1Highlight: '(MB, GB, TB, Bytes)',
    description: 'Convert digital file storage sizes between Bytes, KB, MB, GB, TB, and binary GiB/TiB. Fast and accurate computer memory and hard drive size calculator.',
    targetKeywords: [
      'data storage converter',
      'gb to mb',
      'tb to gb',
      'mb to gb',
      'file size converter',
      'bytes to mb',
      'byte converter'
    ]
  },
  data_transfer: {
    id: 'data_transfer',
    name: 'Data Transfer Rate',
    seoTitle: 'Data Transfer Rate Converter - Mbps to MB/s & Gbps Speed Calculator | SolveIt',
    h1: 'Data Transfer Rate Converter',
    h1Highlight: '(Mbps to MB/s, Gbps)',
    description: 'Convert internet connection and download speeds between Mbps, MB/s, Kbps, and Gbps. Calculate file download transfer times and network bandwidth accurately.',
    targetKeywords: [
      'data transfer converter',
      'mbps to mbs',
      'megabits to megabytes',
      'internet speed converter',
      'download speed calculator',
      'bandwidth converter'
    ]
  },
  electrical: {
    id: 'electrical',
    name: 'Electrical Units',
    seoTitle: 'Electrical Unit Converter - Volts, Amperes, Ohms & Farads | SolveIt',
    h1: 'Electrical Unit Converter',
    h1Highlight: '(Volts, Amps, Ohms, Farads)',
    description: 'Convert electrical units across Voltage (V, mV, kV), Current (Amperes, mA), Resistance (Ohms, kΩ, MΩ), and Capacitance. Free electronics engineering calculator.',
    targetKeywords: [
      'electrical unit converter',
      'volts to millivolts',
      'amps to milliamps',
      'ohms to kilohms',
      'electrical conversion calculator'
    ]
  },
  cooking: {
    id: 'cooking',
    name: 'Culinary & Cooking',
    seoTitle: 'Cooking Measurement Converter - Tablespoons to Teaspoons, Cups & mL | SolveIt',
    h1: 'Cooking Measurement Converter',
    h1Highlight: '& Kitchen Recipe Calculator',
    description: 'Free kitchen recipe converter. Convert tablespoons to teaspoons (tbsp to tsp), cups to fluid ounces, milliliters, and pints. Scale recipes with accurate measurements.',
    targetKeywords: [
      'cooking converter',
      'tablespoons to teaspoons',
      'tbsp to tsp',
      'cups to ounces',
      'recipe converter',
      'kitchen measurement converter',
      'cooking volume converter'
    ]
  },
  engineering: {
    id: 'engineering',
    name: 'Engineering Units',
    seoTitle: 'Engineering Unit Converter - MPa to PSI, ksi, GPM & Viscosity | SolveIt',
    h1: 'Engineering Unit Converter',
    h1Highlight: '(Stress, Pressure & Flow Rate)',
    description: 'Convert mechanical engineering units for material yield stress (MPa, GPa, ksi), volumetric fluid flow (GPM, L/min, m³/h), and viscosity. Free engineering tool.',
    targetKeywords: [
      'engineering converter',
      'mpa to psi',
      'ksi to mpa',
      'gpm to lpm',
      'stress converter',
      'volumetric flow rate converter'
    ]
  },
  scientific: {
    id: 'scientific',
    name: 'Scientific & Photometry',
    seoTitle: 'Scientific Unit Converter - Radians to Degrees, Lux & Moles | SolveIt',
    h1: 'Scientific & Photometry Converter',
    h1Highlight: '(Radians, Lux, Moles)',
    description: 'Convert scientific and photometry units: Angular Degrees to Radians, Illuminance Lux to Foot-candles, and chemical Moles to Millimoles. Free physics calculator.',
    targetKeywords: [
      'scientific converter',
      'radians to degrees',
      'degrees to radians',
      'lux to foot candles',
      'photometry converter',
      'moles to millimoles'
    ]
  },
  number_systems: {
    id: 'number_systems',
    name: 'Number Systems',
    seoTitle: 'Number Base Converter - Binary to Decimal, Hex & Roman Numerals | SolveIt',
    h1: 'Number Base Converter',
    h1Highlight: '(Binary, Decimal, Hex, Octal)',
    description: 'Convert numbers across Binary (Base 2), Decimal (Base 10), Hexadecimal (Base 16), Octal (Base 8), and Roman Numerals. Free computer science base calculator.',
    targetKeywords: [
      'number base converter',
      'binary to decimal',
      'decimal to hex',
      'hex to binary',
      'number system converter',
      'roman numerals converter'
    ]
  }
};

export function getCategorySeo(categoryId: string): CategorySeoConfig {
  if (!categoryId) {
    return {
      id: 'general',
      name: 'Unit',
      seoTitle: 'Unit Converter - Free High-Precision Conversion Calculator | SolveIt',
      h1: 'Unit Converter',
      h1Highlight: '& Measurement Calculator',
      description: 'Free online unit converter. Instantly convert between hundreds of metric, imperial, and scientific units with high precision.',
      targetKeywords: ['unit converter', 'convert units', 'conversion calculator']
    };
  }

  const clean = categoryId.toLowerCase().trim();
  if (CATEGORY_SEO_CONFIGS[clean]) {
    return CATEGORY_SEO_CONFIGS[clean];
  }

  const altKey = clean.replace(/-/g, '_');
  if (CATEGORY_SEO_CONFIGS[altKey]) {
    return CATEGORY_SEO_CONFIGS[altKey];
  }

  const revAltKey = clean.replace(/_/g, '-');
  if (CATEGORY_SEO_CONFIGS[revAltKey]) {
    return CATEGORY_SEO_CONFIGS[revAltKey];
  }

  const name = categoryId
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: clean,
    name,
    seoTitle: `${name} Converter - Free Online Conversion Calculator | SolveIt`,
    h1: `${name} Converter`,
    h1Highlight: '& Unit Calculator',
    description: `Free online ${name.toLowerCase()} conversion calculator. Convert between units instantly with high precision and exact formulas.`,
    targetKeywords: [`${name.toLowerCase()} converter`, `convert ${name.toLowerCase()}`]
  };
}
