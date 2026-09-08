// High-precision conversion definitions and math engines for SolveIt Calculator Conversion Center

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  system?: 'metric' | 'imperial' | 'us' | 'si' | 'binary' | 'scientific' | 'industrial' | 'other';
  factorToBase: number | ((val: number) => number); // Convert from this unit to base unit
  factorFromBase: number | ((val: number) => number); // Convert from base unit to this unit
  description?: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  icon: string;
  baseUnitId: string;
  countLabel: string;
  popularPair: { from: string; to: string; label: string };
  description: string;
  units: UnitDefinition[];
}

// Roman numeral helper
export function toRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) return 'Valid for 1-3999';
  const lookup: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let res = '';
  let n = num;
  for (const [val, roman] of lookup) {
    while (n >= val) {
      res += roman;
      n -= val;
    }
  }
  return res;
}

export function fromRoman(str: string): number | null {
  const romanMap: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };
  const clean = str.trim().toUpperCase();
  if (!clean || !/^[IVXLCDM]+$/.test(clean)) return null;
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const curr = romanMap[clean[i]];
    const next = romanMap[clean[i + 1]] || 0;
    if (curr < next) {
      total -= curr;
    } else {
      total += curr;
    }
  }
  return total;
}

export const CONVERSION_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'length',
    name: 'Length',
    icon: 'straighten',
    baseUnitId: 'm',
    countLabel: '14 Units',
    popularPair: { from: 'cm', to: 'in', label: 'Centimeters to Inches' },
    description: 'Transform between metric, imperial, astronomical, and sub-atomic dimensions with nanometer precision.',
    units: [
      { id: 'nm', name: 'Nanometer', symbol: 'nm', system: 'metric', factorToBase: 1e-9, factorFromBase: 1e9 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', system: 'metric', factorToBase: 1e-6, factorFromBase: 1e6 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', system: 'metric', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', system: 'metric', factorToBase: 0.01, factorFromBase: 100 },
      { id: 'm', name: 'Meter', symbol: 'm', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'in', name: 'Inch', symbol: 'in', system: 'imperial', factorToBase: 0.0254, factorFromBase: 39.37007874 },
      { id: 'ft', name: 'Foot', symbol: 'ft', system: 'imperial', factorToBase: 0.3048, factorFromBase: 3.280839895 },
      { id: 'yd', name: 'Yard', symbol: 'yd', system: 'imperial', factorToBase: 0.9144, factorFromBase: 1.093613298 },
      { id: 'mi', name: 'Mile', symbol: 'mi', system: 'imperial', factorToBase: 1609.344, factorFromBase: 0.000621371192 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', system: 'other', factorToBase: 1852, factorFromBase: 0.000539956803 },
      { id: 'ly', name: 'Light Year', symbol: 'ly', system: 'other', factorToBase: 9.460730472e15, factorFromBase: 1.057000834e-16 },
      { id: 'furlong', name: 'Furlong', symbol: 'fur', system: 'imperial', factorToBase: 201.168, factorFromBase: 0.0049709695 },
      { id: 'angstrom', name: 'Angstrom', symbol: 'Å', system: 'other', factorToBase: 1e-10, factorFromBase: 1e10 },
    ]
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    icon: 'scale',
    baseUnitId: 'kg',
    countLabel: '12 Units',
    popularPair: { from: 'kg', to: 'lb', label: 'Kilograms to Pounds' },
    description: 'Accurate conversion between metric grams/tonnes and imperial pounds, ounces, and stones.',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', system: 'metric', factorToBase: 1e-6, factorFromBase: 1e6 },
      { id: 'g', name: 'Gram', symbol: 'g', system: 'metric', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 't', name: 'Metric Ton (Tonne)', symbol: 't', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', system: 'imperial', factorToBase: 0.028349523125, factorFromBase: 35.27396195 },
      { id: 'lb', name: 'Pound', symbol: 'lb', system: 'imperial', factorToBase: 0.45359237, factorFromBase: 2.2046226218 },
      { id: 'st', name: 'Stone', symbol: 'st', system: 'imperial', factorToBase: 6.35029318, factorFromBase: 0.157473044 },
      { id: 'us_ton', name: 'Short Ton (US)', symbol: 'ton (US)', system: 'us', factorToBase: 907.18474, factorFromBase: 0.00110231131 },
      { id: 'uk_ton', name: 'Long Ton (UK)', symbol: 'ton (UK)', system: 'imperial', factorToBase: 1016.0469088, factorFromBase: 0.0009842065 },
      { id: 'carat', name: 'Carat', symbol: 'ct', system: 'other', factorToBase: 0.0002, factorFromBase: 5000 },
      { id: 'grain', name: 'Grain', symbol: 'gr', system: 'imperial', factorToBase: 0.00006479891, factorFromBase: 15432.35835 },
      { id: 'slug', name: 'Slug', symbol: 'slug', system: 'imperial', factorToBase: 14.5939029, factorFromBase: 0.068521765 }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: 'thermostat',
    baseUnitId: 'c',
    countLabel: '4 Units',
    popularPair: { from: 'c', to: 'f', label: 'Celsius to Fahrenheit' },
    description: 'Instant thermal conversions across Celsius, Fahrenheit, Kelvin, and Rankine scales.',
    units: [
      {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        system: 'metric',
        factorToBase: (v: number) => v,
        factorFromBase: (v: number) => v
      },
      {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        system: 'imperial',
        factorToBase: (v: number) => (v - 32) * (5 / 9),
        factorFromBase: (v: number) => (v * 9) / 5 + 32
      },
      {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        system: 'si',
        factorToBase: (v: number) => v - 273.15,
        factorFromBase: (v: number) => v + 273.15
      },
      {
        id: 'r',
        name: 'Rankine',
        symbol: '°R',
        system: 'imperial',
        factorToBase: (v: number) => (v - 491.67) * (5 / 9),
        factorFromBase: (v: number) => ((v + 273.15) * 9) / 5
      }
    ]
  },
  {
    id: 'volume',
    name: 'Volume & Capacity',
    icon: 'water_drop',
    baseUnitId: 'l',
    countLabel: '22 Units',
    popularPair: { from: 'l', to: 'gal', label: 'Liters to Gallons' },
    description: 'Liquid and dry volume across metric liters, US gallons, fluid ounces, pints, and cubic meters.',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'mL', system: 'metric', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'l', name: 'Liter', symbol: 'L', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'cm3', name: 'Cubic Centimeter', symbol: 'cm³', system: 'metric', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'mm3', name: 'Cubic Millimeter', symbol: 'mm³', system: 'metric', factorToBase: 1e-6, factorFromBase: 1e6 },
      { id: 'ul', name: 'Microliter', symbol: 'µL', system: 'scientific', factorToBase: 1e-6, factorFromBase: 1e6 },
      { id: 'nl', name: 'Nanoliter', symbol: 'nL', system: 'scientific', factorToBase: 1e-9, factorFromBase: 1e9 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz (US)', system: 'us', factorToBase: 0.0295735295625, factorFromBase: 33.8140227 },
      { id: 'fl_oz_uk', name: 'Fluid Ounce (UK)', symbol: 'fl oz (UK)', system: 'imperial', factorToBase: 0.0284130625, factorFromBase: 35.1950797 },
      { id: 'cup', name: 'Cup (US Legal)', symbol: 'cup', system: 'us', factorToBase: 0.24, factorFromBase: 4.16666667 },
      { id: 'pt', name: 'Pint (US Liquid)', symbol: 'pt (US)', system: 'us', factorToBase: 0.473176473, factorFromBase: 2.11337642 },
      { id: 'pt_uk', name: 'Pint (UK Imperial)', symbol: 'pt (UK)', system: 'imperial', factorToBase: 0.56826125, factorFromBase: 1.75975399 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt (US)', system: 'us', factorToBase: 0.946352946, factorFromBase: 1.05668821 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal (US)', system: 'us', factorToBase: 3.785411784, factorFromBase: 0.264172052 },
      { id: 'gal_uk', name: 'Gallon (UK)', symbol: 'gal (UK)', system: 'imperial', factorToBase: 4.54609, factorFromBase: 0.219969248 },
      { id: 'in3', name: 'Cubic Inch', symbol: 'in³', system: 'imperial', factorToBase: 0.016387064, factorFromBase: 61.0237441 },
      { id: 'ft3', name: 'Cubic Foot', symbol: 'ft³', system: 'imperial', factorToBase: 28.316846592, factorFromBase: 0.0353146667 },
      { id: 'yd3', name: 'Cubic Yard', symbol: 'yd³', system: 'imperial', factorToBase: 764.554857984, factorFromBase: 0.00130795062 },
      { id: 'bbl', name: 'Oil Barrel', symbol: 'bbl', system: 'industrial', factorToBase: 158.987294928, factorFromBase: 0.00628981077 },
      { id: 'drum', name: '55-Gal Drum', symbol: 'drum', system: 'industrial', factorToBase: 208.19764812, factorFromBase: 0.00480312822 },
      { id: 'tbsp', name: 'Tablespoon (US)', symbol: 'tbsp', system: 'us', factorToBase: 0.01478676478, factorFromBase: 67.6280454 },
      { id: 'tsp', name: 'Teaspoon (US)', symbol: 'tsp', system: 'us', factorToBase: 0.00492892159, factorFromBase: 202.884136 }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    icon: 'crop_free',
    baseUnitId: 'm2',
    countLabel: '10 Units',
    popularPair: { from: 'sqft', to: 'sqm', label: 'Square Feet to Square Meters' },
    description: 'Calculate property, construction, and architectural land coverage with exact hectare and acre ratios.',
    units: [
      { id: 'sqmm', name: 'Square Millimeter', symbol: 'mm²', system: 'metric', factorToBase: 1e-6, factorFromBase: 1e6 },
      { id: 'sqcm', name: 'Square Centimeter', symbol: 'cm²', system: 'metric', factorToBase: 0.0001, factorFromBase: 10000 },
      { id: 'm2', name: 'Square Meter', symbol: 'm²', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', system: 'metric', factorToBase: 10000, factorFromBase: 0.0001 },
      { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', system: 'metric', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'sqin', name: 'Square Inch', symbol: 'in²', system: 'imperial', factorToBase: 0.00064516, factorFromBase: 1550.0031 },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', system: 'imperial', factorToBase: 0.09290304, factorFromBase: 10.7639104 },
      { id: 'sqyd', name: 'Square Yard', symbol: 'yd²', system: 'imperial', factorToBase: 0.83612736, factorFromBase: 1.19599005 },
      { id: 'acre', name: 'Acre', symbol: 'ac', system: 'imperial', factorToBase: 4046.8564224, factorFromBase: 0.00024710538 },
      { id: 'sqmi', name: 'Square Mile', symbol: 'mi²', system: 'imperial', factorToBase: 2589988.110336, factorFromBase: 3.86102159e-7 }
    ]
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    icon: 'speed',
    baseUnitId: 'mps',
    countLabel: '7 Units',
    popularPair: { from: 'mph', to: 'kmh', label: 'Miles/hr to Kilometers/hr' },
    description: 'Automotive, aerospace, and marine velocity conversions from knots to Mach numbers.',
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'kmh', name: 'Kilometers per hour', symbol: 'km/h', system: 'metric', factorToBase: 1 / 3.6, factorFromBase: 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', system: 'imperial', factorToBase: 0.44704, factorFromBase: 2.236936292 },
      { id: 'knot', name: 'Knot (Nautical mi/h)', symbol: 'kn', system: 'other', factorToBase: 1852 / 3600, factorFromBase: 3600 / 1852 },
      { id: 'fps', name: 'Feet per second', symbol: 'ft/s', system: 'imperial', factorToBase: 0.3048, factorFromBase: 3.280839895 },
      { id: 'mach', name: 'Mach (at sea level, 20°C)', symbol: 'Ma', system: 'other', factorToBase: 343, factorFromBase: 1 / 343 },
      { id: 'c', name: 'Speed of Light in Vacuum', symbol: 'c', system: 'si', factorToBase: 299792458, factorFromBase: 1 / 299792458 }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    icon: 'schedule',
    baseUnitId: 's',
    countLabel: '10 Units',
    popularPair: { from: 'hr', to: 'min', label: 'Hours to Minutes' },
    description: 'Astronomical, standard, and micro-second intervals for schedules, science, and computing.',
    units: [
      { id: 'ns', name: 'Nanosecond', symbol: 'ns', system: 'metric', factorToBase: 1e-9, factorFromBase: 1e9 },
      { id: 'us', name: 'Microsecond', symbol: 'µs', system: 'metric', factorToBase: 1e-6, factorFromBase: 1e6 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', system: 'metric', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 's', name: 'Second', symbol: 's', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'min', name: 'Minute', symbol: 'min', system: 'other', factorToBase: 60, factorFromBase: 1 / 60 },
      { id: 'hr', name: 'Hour', symbol: 'h', system: 'other', factorToBase: 3600, factorFromBase: 1 / 3600 },
      { id: 'day', name: 'Day', symbol: 'd', system: 'other', factorToBase: 86400, factorFromBase: 1 / 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', system: 'other', factorToBase: 604800, factorFromBase: 1 / 604800 },
      { id: 'month', name: 'Month (Average 30.44d)', symbol: 'mo', system: 'other', factorToBase: 2629800, factorFromBase: 1 / 2629800 },
      { id: 'year', name: 'Year (Julian 365.25d)', symbol: 'yr', system: 'other', factorToBase: 31557600, factorFromBase: 1 / 31557600 }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: 'compress',
    baseUnitId: 'pa',
    countLabel: '9 Units',
    popularPair: { from: 'psi', to: 'bar', label: 'PSI to Bar' },
    description: 'Industrial tire, hydraulic, HVAC, and meteorological atmospheric pressures.',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', system: 'metric', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'bar', name: 'Bar', symbol: 'bar', system: 'metric', factorToBase: 100000, factorFromBase: 0.00001 },
      { id: 'mbar', name: 'Millibar', symbol: 'mbar', system: 'metric', factorToBase: 100, factorFromBase: 0.01 },
      { id: 'psi', name: 'Pound per square inch', symbol: 'psi', system: 'imperial', factorToBase: 6894.757293, factorFromBase: 0.0001450377 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', system: 'other', factorToBase: 101325, factorFromBase: 1 / 101325 },
      { id: 'torr', name: 'Torr (mmHg)', symbol: 'Torr', system: 'other', factorToBase: 133.3223684, factorFromBase: 0.0075006168 },
      { id: 'inhg', name: 'Inches of Mercury', symbol: 'inHg', system: 'imperial', factorToBase: 3386.3886666, factorFromBase: 0.0002952998 }
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Work',
    icon: 'bolt',
    baseUnitId: 'j',
    countLabel: '10 Units',
    popularPair: { from: 'kwh', to: 'j', label: 'Kilowatt-hours to Joules' },
    description: 'Mechanical work, electrical power consumption, heat calories, and thermal units.',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mj', name: 'Megajoule', symbol: 'MJ', system: 'metric', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'cal', name: 'Calorie (gram)', symbol: 'cal', system: 'metric', factorToBase: 4.184, factorFromBase: 1 / 4.184 },
      { id: 'kcal', name: 'Kilocalorie (food Cal)', symbol: 'kcal', system: 'metric', factorToBase: 4184, factorFromBase: 1 / 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', system: 'other', factorToBase: 3600, factorFromBase: 1 / 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', system: 'other', factorToBase: 3600000, factorFromBase: 1 / 3600000 },
      { id: 'btu', name: 'British Thermal Unit (ISO)', symbol: 'BTU', system: 'imperial', factorToBase: 1055.05585, factorFromBase: 1 / 1055.05585 },
      { id: 'ftlb', name: 'Foot-pound force', symbol: 'ft·lbf', system: 'imperial', factorToBase: 1.355817948, factorFromBase: 0.737562149 },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', system: 'si', factorToBase: 1.602176634e-19, factorFromBase: 6.241509074e18 }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    icon: 'offline_bolt',
    baseUnitId: 'w',
    countLabel: '7 Units',
    popularPair: { from: 'hp', to: 'kw', label: 'Horsepower to Kilowatts' },
    description: 'Mechanical horsepower, electrical wattage, and heating/cooling BTU outputs.',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', system: 'metric', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'hp', name: 'Horsepower (Mechanical/Imperial)', symbol: 'hp', system: 'imperial', factorToBase: 745.699871582, factorFromBase: 1 / 745.699871582 },
      { id: 'ps', name: 'Metric Horsepower (Pferdestärke)', symbol: 'PS', system: 'metric', factorToBase: 735.49875, factorFromBase: 1 / 735.49875 },
      { id: 'btu_hr', name: 'BTU per hour', symbol: 'BTU/h', system: 'imperial', factorToBase: 0.29307107, factorFromBase: 3.41214163 },
      { id: 'ftlb_s', name: 'Foot-pound per second', symbol: 'ft·lbf/s', system: 'imperial', factorToBase: 1.355817948, factorFromBase: 0.737562149 }
    ]
  },
  {
    id: 'torque',
    name: 'Torque',
    icon: 'refresh',
    baseUnitId: 'nm',
    countLabel: '5 Units',
    popularPair: { from: 'lbft', to: 'nm', label: 'Pound-feet to Newton-meters' },
    description: 'Rotational force conversions crucial for automotive engines, fasteners, and machinery.',
    units: [
      { id: 'nm', name: 'Newton-meter', symbol: 'N·m', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'lbft', name: 'Pound-foot', symbol: 'lb·ft', system: 'imperial', factorToBase: 1.3558179483314, factorFromBase: 0.737562149277 },
      { id: 'lbin', name: 'Pound-inch', symbol: 'lb·in', system: 'imperial', factorToBase: 0.112984829, factorFromBase: 8.85074579 },
      { id: 'kgm', name: 'Kilogram-force meter', symbol: 'kgf·m', system: 'metric', factorToBase: 9.80665, factorFromBase: 1 / 9.80665 },
      { id: 'dyncm', name: 'Dyne-centimeter', symbol: 'dyn·cm', system: 'other', factorToBase: 1e-7, factorFromBase: 1e7 }
    ]
  },
  {
    id: 'frequency',
    name: 'Frequency',
    icon: 'waves',
    baseUnitId: 'hz',
    countLabel: '7 Units',
    popularPair: { from: 'rpm', to: 'hz', label: 'RPM to Hertz' },
    description: 'Electromagnetic wave frequencies, audio acoustics, and engine revolutions.',
    units: [
      { id: 'hz', name: 'Hertz', symbol: 'Hz', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'khz', name: 'Kilohertz', symbol: 'kHz', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mhz', name: 'Megahertz', symbol: 'MHz', system: 'metric', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'ghz', name: 'Gigahertz', symbol: 'GHz', system: 'metric', factorToBase: 1e9, factorFromBase: 1e-9 },
      { id: 'thz', name: 'Terahertz', symbol: 'THz', system: 'metric', factorToBase: 1e12, factorFromBase: 1e-12 },
      { id: 'rpm', name: 'Revolutions per minute', symbol: 'RPM', system: 'other', factorToBase: 1 / 60, factorFromBase: 60 },
      { id: 'rad_s', name: 'Radians per second', symbol: 'rad/s', system: 'si', factorToBase: 1 / (2 * Math.PI), factorFromBase: 2 * Math.PI }
    ]
  },
  {
    id: 'fuel_economy',
    name: 'Fuel Economy',
    icon: 'local_gas_station',
    baseUnitId: 'mpg_us',
    countLabel: '4 Units',
    popularPair: { from: 'mpg_us', to: 'l100km', label: 'MPG (US) to L/100km' },
    description: 'Vehicle consumption rates across US MPG, UK Imperial MPG, and metric L/100km.',
    units: [
      {
        id: 'mpg_us',
        name: 'Miles per Gallon (US)',
        symbol: 'MPG (US)',
        system: 'us',
        factorToBase: (v: number) => v,
        factorFromBase: (v: number) => v
      },
      {
        id: 'mpg_uk',
        name: 'Miles per Gallon (UK)',
        symbol: 'MPG (UK)',
        system: 'imperial',
        factorToBase: (v: number) => v / 1.20095,
        factorFromBase: (v: number) => v * 1.20095
      },
      {
        id: 'km_l',
        name: 'Kilometers per Liter',
        symbol: 'km/L',
        system: 'metric',
        factorToBase: (v: number) => v * 2.35214583,
        factorFromBase: (v: number) => v / 2.35214583
      },
      {
        id: 'l100km',
        name: 'Liters per 100km',
        symbol: 'L/100km',
        system: 'metric',
        factorToBase: (v: number) => (v === 0 ? 0 : 235.214583 / v),
        factorFromBase: (v: number) => (v === 0 ? 0 : 235.214583 / v)
      }
    ]
  },
  {
    id: 'data_storage',
    name: 'Data Storage',
    icon: 'hard_drive',
    baseUnitId: 'b',
    countLabel: '11 Units',
    popularPair: { from: 'gb', to: 'tb', label: 'Gigabytes to Terabytes' },
    description: 'Binary (1024-based GiB/MiB) and Decimal (1000-based GB/MB) computing capacities.',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', system: 'si', factorToBase: 1 / 8, factorFromBase: 8 },
      { id: 'b', name: 'Byte', symbol: 'B', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'kb', name: 'Kilobyte (10³)', symbol: 'KB', system: 'si', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mb', name: 'Megabyte (10⁶)', symbol: 'MB', system: 'si', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'gb', name: 'Gigabyte (10⁹)', symbol: 'GB', system: 'si', factorToBase: 1e9, factorFromBase: 1e-9 },
      { id: 'tb', name: 'Terabyte (10¹²)', symbol: 'TB', system: 'si', factorToBase: 1e12, factorFromBase: 1e-12 },
      { id: 'pb', name: 'Petabyte (10¹⁵)', symbol: 'PB', system: 'si', factorToBase: 1e15, factorFromBase: 1e-15 },
      { id: 'kib', name: 'Kibibyte (2¹⁰)', symbol: 'KiB', system: 'binary', factorToBase: 1024, factorFromBase: 1 / 1024 },
      { id: 'mib', name: 'Mebibyte (2²⁰)', symbol: 'MiB', system: 'binary', factorToBase: 1048576, factorFromBase: 1 / 1048576 },
      { id: 'gib', name: 'Gibibyte (2³⁰)', symbol: 'GiB', system: 'binary', factorToBase: 1073741824, factorFromBase: 1 / 1073741824 },
      { id: 'tib', name: 'Tebibyte (2⁴⁰)', symbol: 'TiB', system: 'binary', factorToBase: 1099511627776, factorFromBase: 1 / 1099511627776 }
    ]
  },
  {
    id: 'data_transfer',
    name: 'Data Transfer Rate',
    icon: 'swap_calls',
    baseUnitId: 'bps',
    countLabel: '9 Units',
    popularPair: { from: 'mbps', to: 'mbs', label: 'Megabits/s to Megabytes/s' },
    description: 'Network bandwidth speed tests, fiber optics, and file download transfer times.',
    units: [
      { id: 'bps', name: 'Bits per second', symbol: 'bps', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'kbps', name: 'Kilobits per second', symbol: 'Kbps', system: 'si', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mbps', name: 'Megabits per second', symbol: 'Mbps', system: 'si', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'gbps', name: 'Gigabits per second', symbol: 'Gbps', system: 'si', factorToBase: 1e9, factorFromBase: 1e-9 },
      { id: 'tbps', name: 'Terabits per second', symbol: 'Tbps', system: 'si', factorToBase: 1e12, factorFromBase: 1e-12 },
      { id: 'bs', name: 'Bytes per second', symbol: 'B/s', system: 'si', factorToBase: 8, factorFromBase: 0.125 },
      { id: 'kbs', name: 'Kilobytes per second', symbol: 'KB/s', system: 'si', factorToBase: 8000, factorFromBase: 0.000125 },
      { id: 'mbs', name: 'Megabytes per second', symbol: 'MB/s', system: 'si', factorToBase: 8e6, factorFromBase: 1.25e-7 },
      { id: 'gbs', name: 'Gigabytes per second', symbol: 'GB/s', system: 'si', factorToBase: 8e9, factorFromBase: 1.25e-10 }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Units',
    icon: 'electrical_services',
    baseUnitId: 'v',
    countLabel: '10 Units',
    popularPair: { from: 'kv', to: 'v', label: 'Kilovolts to Volts' },
    description: 'Ohmic resistance, electrical charge, electromotive potential, and current flow.',
    units: [
      { id: 'mv', name: 'Millivolt', symbol: 'mV', system: 'si', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'v', name: 'Volt', symbol: 'V', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'kv', name: 'Kilovolt', symbol: 'kV', system: 'si', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'ma', name: 'Milliampere', symbol: 'mA', system: 'si', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'a', name: 'Ampere', symbol: 'A', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'ohm', name: 'Ohm', symbol: 'Ω', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'kohm', name: 'Kilohm', symbol: 'kΩ', system: 'si', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'mohm', name: 'Megohm', symbol: 'MΩ', system: 'si', factorToBase: 1e6, factorFromBase: 1e-6 },
      { id: 'coulomb', name: 'Coulomb', symbol: 'C', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'farad', name: 'Farad', symbol: 'F', system: 'si', factorToBase: 1, factorFromBase: 1 }
    ]
  },
  {
    id: 'cooking',
    name: 'Culinary & Cooking',
    icon: 'restaurant',
    baseUnitId: 'ml',
    countLabel: '12 Units',
    popularPair: { from: 'tbsp', to: 'tsp', label: 'Tablespoons to Teaspoons' },
    description: 'Recipe scaling and culinary kitchen measures across spoons, cups, and fluid ounces.',
    units: [
      { id: 'tsp', name: 'Teaspoon (US)', symbol: 'tsp', system: 'us', factorToBase: 4.92892, factorFromBase: 1 / 4.92892 },
      { id: 'tbsp', name: 'Tablespoon (US)', symbol: 'tbsp', system: 'us', factorToBase: 14.7868, factorFromBase: 1 / 14.7868 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz', system: 'us', factorToBase: 29.5735, factorFromBase: 1 / 29.5735 },
      { id: 'cup', name: 'Cup (US Legal)', symbol: 'cup', system: 'us', factorToBase: 240, factorFromBase: 1 / 240 },
      { id: 'pt', name: 'Pint (US)', symbol: 'pt', system: 'us', factorToBase: 473.176, factorFromBase: 1 / 473.176 },
      { id: 'qt', name: 'Quart (US)', symbol: 'qt', system: 'us', factorToBase: 946.353, factorFromBase: 1 / 946.353 },
      { id: 'gal', name: 'Gallon (US)', symbol: 'gal', system: 'us', factorToBase: 3785.41, factorFromBase: 1 / 3785.41 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'l', name: 'Liter', symbol: 'L', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'pinch', name: 'Pinch (approx 1/16 tsp)', symbol: 'pinch', system: 'other', factorToBase: 0.308, factorFromBase: 1 / 0.308 },
      { id: 'dash', name: 'Dash (approx 1/8 tsp)', symbol: 'dash', system: 'other', factorToBase: 0.616, factorFromBase: 1 / 0.616 },
      { id: 'drop', name: 'Drop (approx 0.05 mL)', symbol: 'gtt', system: 'other', factorToBase: 0.05, factorFromBase: 20 }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering Units',
    icon: 'precision_manufacturing',
    baseUnitId: 'mpa',
    countLabel: '8 Units',
    popularPair: { from: 'ksi', to: 'mpa', label: 'ksi to Megapascals' },
    description: 'Material yield strength, young modulus, volumetric flow rates, and dynamic stress.',
    units: [
      { id: 'mpa', name: 'Megapascal (Stress)', symbol: 'MPa', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'gpa', name: 'Gigapascal (Modulus)', symbol: 'GPa', system: 'metric', factorToBase: 1000, factorFromBase: 0.001 },
      { id: 'ksi', name: 'Kip per square inch', symbol: 'ksi', system: 'imperial', factorToBase: 6.894757, factorFromBase: 1 / 6.894757 },
      { id: 'psi_stress', name: 'Pound per sq in (Stress)', symbol: 'psi', system: 'imperial', factorToBase: 0.006894757, factorFromBase: 145.038 },
      { id: 'lpm', name: 'Flow: Liters per minute', symbol: 'L/min', system: 'metric', factorToBase: 1, factorFromBase: 1 },
      { id: 'gpm', name: 'Flow: Gallons (US)/min', symbol: 'GPM', system: 'us', factorToBase: 3.78541, factorFromBase: 1 / 3.78541 },
      { id: 'm3h', name: 'Flow: Cubic meters/hour', symbol: 'm³/h', system: 'metric', factorToBase: 16.66667, factorFromBase: 0.06 },
      { id: 'poise', name: 'Viscosity: Centipoise', symbol: 'cP', system: 'other', factorToBase: 0.001, factorFromBase: 1000 }
    ]
  },
  {
    id: 'scientific',
    name: 'Scientific & Photometry',
    icon: 'science',
    baseUnitId: 'mol',
    countLabel: '8 Units',
    popularPair: { from: 'rad', to: 'deg', label: 'Radians to Degrees' },
    description: 'Chemistry amount of substance, optical illuminance, radioactivity, and angular radians.',
    units: [
      { id: 'mol', name: 'Mole', symbol: 'mol', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'mmol', name: 'Millimole', symbol: 'mmol', system: 'si', factorToBase: 0.001, factorFromBase: 1000 },
      { id: 'deg', name: 'Angular Degree', symbol: '°', system: 'other', factorToBase: Math.PI / 180, factorFromBase: 180 / Math.PI },
      { id: 'rad', name: 'Radian', symbol: 'rad', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'grad', name: 'Gradian', symbol: 'grad', system: 'other', factorToBase: Math.PI / 200, factorFromBase: 200 / Math.PI },
      { id: 'lux', name: 'Lux (Illuminance)', symbol: 'lx', system: 'si', factorToBase: 1, factorFromBase: 1 },
      { id: 'fc', name: 'Foot-candle (Illuminance)', symbol: 'fc', system: 'us', factorToBase: 10.7639, factorFromBase: 1 / 10.7639 },
      { id: 'sv', name: 'Sievert (Radiation Dose)', symbol: 'Sv', system: 'si', factorToBase: 1, factorFromBase: 1 }
    ]
  },
  {
    id: 'number_systems',
    name: 'Number Systems',
    icon: 'pin',
    baseUnitId: 'dec',
    countLabel: '5 Systems',
    popularPair: { from: 'dec', to: 'hex', label: 'Decimal to Hexadecimal' },
    description: 'Computer architecture radices across Decimal (10), Binary (2), Hex (16), Octal (8), and Roman Numerals.',
    units: [
      { id: 'dec', name: 'Decimal (Base 10)', symbol: 'DEC', system: 'other', factorToBase: 1, factorFromBase: 1 },
      { id: 'bin', name: 'Binary (Base 2)', symbol: 'BIN', system: 'other', factorToBase: 1, factorFromBase: 1 },
      { id: 'hex', name: 'Hexadecimal (Base 16)', symbol: 'HEX', system: 'other', factorToBase: 1, factorFromBase: 1 },
      { id: 'oct', name: 'Octal (Base 8)', symbol: 'OCT', system: 'other', factorToBase: 1, factorFromBase: 1 },
      { id: 'roman', name: 'Roman Numerals', symbol: 'ROM', system: 'other', factorToBase: 1, factorFromBase: 1 }
    ]
  }
];

// Perform exact conversion between any two units in a category
export function convertValue(
  value: number | string,
  categoryId: string,
  fromUnitId: string,
  toUnitId: string
): {
  resultNumber: number;
  resultString: string;
  formula: string;
  factor: number;
} {
  const category = CONVERSION_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) {
    return { resultNumber: 0, resultString: '0', formula: '', factor: 1 };
  }

  // Handle Number Systems special radix conversion
  if (categoryId === 'number_systems') {
    let decVal = 0;
    const strVal = String(value).trim();
    if (!strVal) return { resultNumber: 0, resultString: '0', formula: '0 = 0', factor: 1 };

    if (fromUnitId === 'dec') {
      decVal = parseInt(strVal, 10);
    } else if (fromUnitId === 'bin') {
      decVal = parseInt(strVal, 2);
    } else if (fromUnitId === 'hex') {
      decVal = parseInt(strVal, 16);
    } else if (fromUnitId === 'oct') {
      decVal = parseInt(strVal, 8);
    } else if (fromUnitId === 'roman') {
      decVal = fromRoman(strVal) || 0;
    }

    if (isNaN(decVal)) {
      return { resultNumber: NaN, resultString: 'Invalid Input', formula: 'Radix Parse Error', factor: 1 };
    }

    let outStr = '';
    if (toUnitId === 'dec') outStr = decVal.toString(10);
    else if (toUnitId === 'bin') outStr = decVal.toString(2);
    else if (toUnitId === 'hex') outStr = decVal.toString(16).toUpperCase();
    else if (toUnitId === 'oct') outStr = decVal.toString(8);
    else if (toUnitId === 'roman') outStr = toRoman(decVal);

    return {
      resultNumber: decVal,
      resultString: outStr,
      formula: `Radix conversion: Base [${fromUnitId.toUpperCase()}] → Base [${toUnitId.toUpperCase()}]`,
      factor: 1
    };
  }

  const numVal = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numVal)) {
    return { resultNumber: 0, resultString: '0', formula: '', factor: 1 };
  }

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) {
    return { resultNumber: numVal, resultString: String(numVal), formula: '1:1 Direct Identity', factor: 1 };
  }

  if (fromUnit.id === toUnit.id) {
    return {
      resultNumber: numVal,
      resultString: String(numVal),
      formula: `${numVal} ${fromUnit.symbol} = ${numVal} ${toUnit.symbol}`,
      factor: 1
    };
  }

  // 1. Convert to base unit
  let baseVal: number;
  if (typeof fromUnit.factorToBase === 'function') {
    baseVal = fromUnit.factorToBase(numVal);
  } else {
    baseVal = numVal * fromUnit.factorToBase;
  }

  // 2. Convert from base unit to target unit
  let targetVal: number;
  if (typeof toUnit.factorFromBase === 'function') {
    targetVal = toUnit.factorFromBase(baseVal);
  } else {
    targetVal = baseVal * toUnit.factorFromBase;
  }

  // Calculate ratio factor for standard linear conversions
  let factor = 1;
  if (typeof fromUnit.factorToBase === 'number' && typeof toUnit.factorFromBase === 'number') {
    factor = fromUnit.factorToBase * toUnit.factorFromBase;
  }

  let formula = '';
  if (category.id === 'temperature') {
    if (fromUnit.id === 'c' && toUnit.id === 'f') formula = `(${numVal} × 9/5) + 32 = ${targetVal.toFixed(2)} °F`;
    else if (fromUnit.id === 'f' && toUnit.id === 'c') formula = `(${numVal} - 32) × 5/9 = ${targetVal.toFixed(2)} °C`;
    else if (fromUnit.id === 'c' && toUnit.id === 'k') formula = `${numVal} + 273.15 = ${targetVal.toFixed(2)} K`;
    else formula = `Thermal scale function transformation`;
  } else if (category.id === 'fuel_economy') {
    formula = `Non-linear reciprocal automotive formula`;
  } else {
    formula = `Multiply the ${fromUnit.name} value by ${factor < 0.0001 || factor > 10000 ? factor.toExponential(4) : factor.toFixed(6).replace(/0+$/, '').replace(/\\.$/, '')}`;
  }

  return {
    resultNumber: targetVal,
    resultString: targetVal.toString(),
    formula,
    factor
  };
}

// Format numbers nicely according to precision mode
export function formatResult(val: number, precision: 'auto' | '2' | '4' | '6' | '8' | 'scientific'): string {
  if (isNaN(val)) return '0';
  if (precision === 'scientific') {
    return val.toExponential(4);
  }
  if (precision === 'auto') {
    if (val === 0) return '0';
    if (Math.abs(val) < 1e-6 || Math.abs(val) >= 1e9) {
      return val.toExponential(4);
    }
    // Up to 6 significant digits without trailing zeroes
    const formatted = parseFloat(val.toPrecision(7));
    return formatted.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  const digits = parseInt(precision, 10);
  return val.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}
