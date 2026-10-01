export type UnitCategory =
  | 'mass'
  | 'volume'
  | 'length'
  | 'temperature'
  | 'speed'
  | 'area'
  | 'time'
  | 'pressure'
  | 'energy'
  | 'power';

export interface Unit {
  id: string; // e.g. 'gram', 'pound'
  symbol: string; // e.g. 'g', 'lb'
  namePlural: string; // e.g. 'Grams', 'Pounds'
  nameSingular: string; // e.g. 'Gram', 'Pound'
  category: UnitCategory;
  baseFactor: number; // Factor to convert to base unit
  description?: string; // HTML or string describing the unit
}

export const UNITS: Unit[] = [
  // MASS (Base: gram)
  { id: 'gram', symbol: 'g', namePlural: 'Grams', nameSingular: 'Gram', category: 'mass', baseFactor: 1.0,
    description: 'A gram is a unit of mass equal to 1/1,000 of a kilogram or 0.035274 ounces, and is equivalent to the mass of one cubic centimeter, or one milliliter, of water.' },
  { id: 'kilogram', symbol: 'kg', namePlural: 'Kilograms', nameSingular: 'Kilogram', category: 'mass', baseFactor: 1000.0,
    description: 'The kilogram is the base unit of mass in the International System of Units (SI).' },
  { id: 'milligram', symbol: 'mg', namePlural: 'Milligrams', nameSingular: 'Milligram', category: 'mass', baseFactor: 0.001,
    description: 'A milligram is a unit of mass equal to 1/1,000 of a gram.' },
  { id: 'pound', symbol: 'lb', namePlural: 'Pounds', nameSingular: 'Pound', category: 'mass', baseFactor: 453.59237,
    description: 'Pounds are a widely used unit of weight in the United States and the imperial system. One pound is equal to 16 ounces.' },
  { id: 'ounce', symbol: 'oz', namePlural: 'Ounces', nameSingular: 'Ounce', category: 'mass', baseFactor: 28.349523125,
    description: 'An ounce is a unit of mass used in most British derived customary systems of measurement.' },
  { id: 'tonne', symbol: 't', namePlural: 'Metric Tonnes', nameSingular: 'Metric Tonne', category: 'mass', baseFactor: 1000000.0,
    description: 'A metric ton is equal to 1,000 kilograms.' },
  { id: 'stone', symbol: 'st', namePlural: 'Stones', nameSingular: 'Stone', category: 'mass', baseFactor: 6350.29318,
    description: 'A stone is an imperial unit of mass equal to 14 pounds.' },

  // VOLUME (Base: milliliter)
  { id: 'milliliter', symbol: 'ml', namePlural: 'Milliliters', nameSingular: 'Milliliter', category: 'volume', baseFactor: 1.0,
    description: 'A milliliter is a unit of volume equal to 1/1,000 of a liter.' },
  { id: 'liter', symbol: 'L', namePlural: 'Liters', nameSingular: 'Liter', category: 'volume', baseFactor: 1000.0,
    description: 'A liter is a metric unit of volume.' },
  { id: 'gallon', symbol: 'gal', namePlural: 'Gallons', nameSingular: 'Gallon', category: 'volume', baseFactor: 3785.41,
    description: 'A gallon is a US customary and imperial unit of volume.' },
  { id: 'cup', symbol: 'cup', namePlural: 'Cups', nameSingular: 'Cup', category: 'volume', baseFactor: 240.0,
    description: 'A cup is a measure of volume used in cooking.' },
  { id: 'tablespoon', symbol: 'tbsp', namePlural: 'Tablespoons', nameSingular: 'Tablespoon', category: 'volume', baseFactor: 14.7868,
    description: 'A tablespoon is a large spoon used for serving or eating, and also as a culinary measure.' },
  { id: 'teaspoon', symbol: 'tsp', namePlural: 'Teaspoons', nameSingular: 'Teaspoon', category: 'volume', baseFactor: 4.92892,
    description: 'A teaspoon is a unit of volume measure used in culinary recipes.' },

  // LENGTH (Base: meter)
  { id: 'meter', symbol: 'm', namePlural: 'Meters', nameSingular: 'Meter', category: 'length', baseFactor: 1.0,
    description: 'The meter is the base unit of length in the International System of Units (SI).' },
  { id: 'kilometer', symbol: 'km', namePlural: 'Kilometers', nameSingular: 'Kilometer', category: 'length', baseFactor: 1000.0,
    description: 'A kilometer is equal to 1,000 meters.' },
  { id: 'centimeter', symbol: 'cm', namePlural: 'Centimeters', nameSingular: 'Centimeter', category: 'length', baseFactor: 0.01 },
  { id: 'millimeter', symbol: 'mm', namePlural: 'Millimeters', nameSingular: 'Millimeter', category: 'length', baseFactor: 0.001 },
  { id: 'inch', symbol: 'in', namePlural: 'Inches', nameSingular: 'Inch', category: 'length', baseFactor: 0.0254 },
  { id: 'feet', symbol: 'ft', namePlural: 'Feet', nameSingular: 'Foot', category: 'length', baseFactor: 0.3048 },
  { id: 'yard', symbol: 'yd', namePlural: 'Yards', nameSingular: 'Yard', category: 'length', baseFactor: 0.9144 },
  { id: 'mile', symbol: 'mi', namePlural: 'Miles', nameSingular: 'Mile', category: 'length', baseFactor: 1609.344 },

  // SPEED (Base: m/s)
  { id: 'meter_per_second', symbol: 'm/s', namePlural: 'Meters per Second', nameSingular: 'Meter per Second', category: 'speed', baseFactor: 1.0 },
  { id: 'kilometer_per_hour', symbol: 'km/h', namePlural: 'Kilometers per Hour', nameSingular: 'Kilometer per Hour', category: 'speed', baseFactor: 0.277778 },
  { id: 'miles_per_hour', symbol: 'mph', namePlural: 'Miles per Hour', nameSingular: 'Mile per Hour', category: 'speed', baseFactor: 0.44704 },
  { id: 'knot', symbol: 'kn', namePlural: 'Knots', nameSingular: 'Knot', category: 'speed', baseFactor: 0.514444 },

  // AREA (Base: sq meter)
  { id: 'square_meter', symbol: 'm²', namePlural: 'Square Meters', nameSingular: 'Square Meter', category: 'area', baseFactor: 1.0 },
  { id: 'square_foot', symbol: 'ft²', namePlural: 'Square Feet', nameSingular: 'Square Foot', category: 'area', baseFactor: 0.092903 },
  { id: 'acre', symbol: 'ac', namePlural: 'Acres', nameSingular: 'Acre', category: 'area', baseFactor: 4046.86 },
  { id: 'hectare', symbol: 'ha', namePlural: 'Hectares', nameSingular: 'Hectare', category: 'area', baseFactor: 10000.0 },

  // PRESSURE (Base: Pa)
  { id: 'pascal', symbol: 'Pa', namePlural: 'Pascals', nameSingular: 'Pascal', category: 'pressure', baseFactor: 1.0 },
  { id: 'kilopascal', symbol: 'kPa', namePlural: 'Kilopascals', nameSingular: 'Kilopascal', category: 'pressure', baseFactor: 1000.0 },
  { id: 'bar', symbol: 'bar', namePlural: 'Bars', nameSingular: 'Bar', category: 'pressure', baseFactor: 100000.0 },
  { id: 'psi', symbol: 'psi', namePlural: 'Pounds per Square Inch', nameSingular: 'Pound per Square Inch', category: 'pressure', baseFactor: 6894.76 },
  { id: 'atmosphere', symbol: 'atm', namePlural: 'Standard Atmospheres', nameSingular: 'Standard Atmosphere', category: 'pressure', baseFactor: 101325.0 },

  // TIME (Base: second)
  { id: 'second', symbol: 's', namePlural: 'Seconds', nameSingular: 'Second', category: 'time', baseFactor: 1.0 },
  { id: 'minute', symbol: 'min', namePlural: 'Minutes', nameSingular: 'Minute', category: 'time', baseFactor: 60.0 },
  { id: 'hour', symbol: 'hr', namePlural: 'Hours', nameSingular: 'Hour', category: 'time', baseFactor: 3600.0 },
  { id: 'day', symbol: 'd', namePlural: 'Days', nameSingular: 'Day', category: 'time', baseFactor: 86400.0 },
];

export const getUnitById = (id: string): Unit | undefined => {
  const normalized = id.toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    lbs: 'pound',
    lb: 'pound',
    pounds: 'pound',
    inches: 'inch',
    in: 'inch',
    cm: 'centimeter',
    centimeters: 'centimeter',
    mm: 'millimeter',
    millimeters: 'millimeter',
    m: 'meter',
    meters: 'meter',
    ft: 'feet',
    foot: 'feet',
    yd: 'yard',
    yards: 'yard',
    kg: 'kilogram',
    kilograms: 'kilogram',
    g: 'gram',
    grams: 'gram',
    mg: 'milligram',
    milligrams: 'milligram',
    oz: 'ounce',
    ounces: 'ounce',
    km: 'kilometer',
    kilometers: 'kilometer',
    mi: 'mile',
    miles: 'mile',
    mph: 'miles_per_hour',
    kmh: 'kilometer_per_hour',
    'km/h': 'kilometer_per_hour',
    mps: 'meter_per_second',
    'm/s': 'meter_per_second',
    kn: 'knot',
    knots: 'knot',
    sqm: 'square_meter',
    'm2': 'square_meter',
    'm²': 'square_meter',
    sqft: 'square_foot',
    'ft2': 'square_foot',
    'ft²': 'square_foot',
    ac: 'acre',
    acres: 'acre',
    ha: 'hectare',
    hectares: 'hectare',
    pa: 'pascal',
    kpa: 'kilopascal',
    bars: 'bar',
    psis: 'psi',
    atm: 'atmosphere',
    atms: 'atmosphere',
    s: 'second',
    sec: 'second',
    secs: 'second',
    seconds: 'second',
    min: 'minute',
    mins: 'minute',
    minutes: 'minute',
    h: 'hour',
    hr: 'hour',
    hrs: 'hour',
    hours: 'hour',
    d: 'day',
    days: 'day',
    t: 'tonne',
    ton: 'tonne',
    tonnes: 'tonne',
    st: 'stone',
    stones: 'stone',
    ml: 'milliliter',
    milliliters: 'milliliter',
    l: 'liter',
    liters: 'liter',
    gal: 'gallon',
    gallons: 'gallon',
    cups: 'cup',
    tbsp: 'tablespoon',
    tablespoons: 'tablespoon',
    tsp: 'teaspoon',
    teaspoons: 'teaspoon',
  };

  const targetId = aliasMap[normalized] || normalized;
  return UNITS.find(
    (u) =>
      u.id.toLowerCase() === targetId ||
      u.symbol.toLowerCase() === targetId ||
      u.nameSingular.toLowerCase() === targetId ||
      u.namePlural.toLowerCase() === targetId
  );
};

export const parseSlug = (slug: string): { from?: Unit, to?: Unit } => {
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    return {
      from: getUnitById(parts[0]),
      to: getUnitById(parts[1])
    };
  }
  return {};
};
