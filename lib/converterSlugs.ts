import { CONVERSION_CATEGORIES, CategoryDefinition, UnitDefinition } from './conversions';
import { getCategorySeo } from './categorySeo';

export interface ResolvedPair {
  type: 'pair';
  slug: string;
  category: CategoryDefinition;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  title: string;
  shortTitle: string;
  h1: string;
  description: string;
  canonicalUrl: string;
}

export interface ResolvedCategory {
  type: 'category';
  slug: string;
  category: CategoryDefinition;
  title: string;
  h1: string;
  description: string;
  canonicalUrl: string;
}

export type ResolvedSlug = ResolvedPair | ResolvedCategory | null;

// Common alias dictionary to map colloquial search phrases or plural forms into canonical unit IDs
export const UNIT_ALIASES: Record<string, string> = {
  // Length
  'cm': 'cm',
  'centimeter': 'cm',
  'centimeters': 'cm',
  'in': 'in',
  'inch': 'in',
  'inches': 'in',
  'm': 'm',
  'meter': 'm',
  'meters': 'm',
  'metre': 'm',
  'metres': 'm',
  'ft': 'ft',
  'foot': 'ft',
  'feet': 'ft',
  'mm': 'mm',
  'millimeter': 'mm',
  'millimeters': 'mm',
  'km': 'km',
  'kilometer': 'km',
  'kilometers': 'km',
  'yd': 'yd',
  'yard': 'yd',
  'yards': 'yd',
  'mi': 'mi',
  'mile': 'mi',
  'miles': 'mi',
  'nm': 'nm',
  'nanometer': 'nm',
  'nanometers': 'nm',
  'um': 'um',
  'micrometer': 'um',
  'micrometers': 'um',
  'micron': 'um',
  'nmi': 'nmi',
  'nautical-mile': 'nmi',
  'nautical-miles': 'nmi',

  // Weight
  'kg': 'kg',
  'kilogram': 'kg',
  'kilograms': 'kg',
  'kilo': 'kg',
  'kilos': 'kg',
  'lb': 'lb',
  'lbs': 'lb',
  'pound': 'lb',
  'pounds': 'lb',
  'g': 'g',
  'gram': 'g',
  'grams': 'g',
  'mg': 'mg',
  'milligram': 'mg',
  'milligrams': 'mg',
  'oz': 'oz',
  'ounce': 'oz',
  'ounces': 'oz',
  'st': 'st',
  'stone': 'st',
  'stones': 'st',
  't': 't',
  'tonne': 't',
  'tonnes': 't',
  'metric-ton': 't',
  'us-ton': 'us_ton',
  'short-ton': 'us_ton',
  'uk-ton': 'uk_ton',
  'long-ton': 'uk_ton',

  // Temperature
  'c': 'c',
  'celsius': 'c',
  'centigrade': 'c',
  'f': 'f',
  'fahrenheit': 'f',
  'k': 'k',
  'kelvin': 'k',
  'r': 'r',
  'rankine': 'r',

  // Speed
  'mph': 'mph',
  'kmh': 'kmh',
  'km-h': 'kmh',
  'km-per-hour': 'kmh',
  'mps': 'mps',
  'm-s': 'mps',
  'meters-per-second': 'mps',
  'fps': 'fps',
  'feet-per-second': 'fps',
  'knot': 'knot',
  'knots': 'knot',
  'mach': 'mach',

  // Volume
  'l': 'l',
  'liter': 'l',
  'liters': 'l',
  'litre': 'l',
  'litres': 'l',
  'ml': 'ml',
  'milliliter': 'ml',
  'milliliters': 'ml',
  'gal': 'gal',
  'gallon': 'gal',
  'gallons': 'gal',
  'gal-us': 'gal',
  'gal-uk': 'gal_uk',
  'fl-oz': 'fl_oz',
  'cup': 'cup',
  'cups': 'cup',
  'pt': 'pt',
  'pint': 'pt',
  'pints': 'pt',
  'qt': 'qt',
  'quart': 'qt',
  'quarts': 'qt',

  // Area
  'sqft': 'sqft',
  'sq-ft': 'sqft',
  'square-feet': 'sqft',
  'square-foot': 'sqft',
  'sqm': 'm2',
  'sq-m': 'm2',
  'square-meter': 'm2',
  'square-meters': 'm2',
  'm2': 'm2',
  'acre': 'acre',
  'acres': 'acre',
  'ha': 'ha',
  'hectare': 'ha',
  'hectares': 'ha',
  'sqin': 'sqin',
  'sq-in': 'sqin',
  'square-inch': 'sqin',
  'square-inches': 'sqin',

  // Pressure
  'psi': 'psi',
  'bar': 'bar',
  'kpa': 'kpa',
  'mpa': 'mpa',
  'pa': 'pa',
  'pascal': 'pa',
  'pascals': 'pa',
  'atm': 'atm',
  'torr': 'torr',

  // Power & Energy
  'hp': 'hp',
  'horsepower': 'hp',
  'kw': 'kw',
  'kilowatt': 'kw',
  'kilowatts': 'kw',
  'w': 'w',
  'watt': 'w',
  'watts': 'w',
  'mw': 'mw',
  'j': 'j',
  'joule': 'j',
  'joules': 'j',
  'kj': 'kj',
  'kwh': 'kwh',
  'cal': 'cal',
  'kcal': 'kcal',
  'btu': 'btu',

  // Data
  'b': 'b',
  'byte': 'b',
  'bytes': 'b',
  'bit': 'bit',
  'bits': 'bit',
  'kb': 'kb',
  'mb': 'mb',
  'gb': 'gb',
  'tb': 'tb',
  'pb': 'pb'
};

// Canonical popular conversions list for direct edge indexing and generation
export const CANONICAL_POPULAR_PAIRS = [
  { from: 'cm', to: 'in', slug: 'cm-to-inches', cat: 'length' },
  { from: 'in', to: 'cm', slug: 'inches-to-cm', cat: 'length' },
  { from: 'kg', to: 'lb', slug: 'kg-to-lbs', cat: 'weight' },
  { from: 'lb', to: 'kg', slug: 'lbs-to-kg', cat: 'weight' },
  { from: 'c', to: 'f', slug: 'celsius-to-fahrenheit', cat: 'temperature' },
  { from: 'f', to: 'c', slug: 'fahrenheit-to-celsius', cat: 'temperature' },
  { from: 'm', to: 'ft', slug: 'meters-to-feet', cat: 'length' },
  { from: 'ft', to: 'm', slug: 'feet-to-meters', cat: 'length' },
  { from: 'mph', to: 'kmh', slug: 'mph-to-kmh', cat: 'speed' },
  { from: 'kmh', to: 'mph', slug: 'kmh-to-mph', cat: 'speed' },
  { from: 'mm', to: 'in', slug: 'mm-to-inches', cat: 'length' },
  { from: 'in', to: 'mm', slug: 'inches-to-mm', cat: 'length' },
  { from: 'ft', to: 'in', slug: 'feet-to-inches', cat: 'length' },
  { from: 'in', to: 'ft', slug: 'inches-to-feet', cat: 'length' },
  { from: 'mi', to: 'km', slug: 'miles-to-km', cat: 'length' },
  { from: 'km', to: 'mi', slug: 'km-to-miles', cat: 'length' },
  { from: 'yd', to: 'm', slug: 'yards-to-meters', cat: 'length' },
  { from: 'm', to: 'yd', slug: 'meters-to-yards', cat: 'length' },
  { from: 'g', to: 'oz', slug: 'grams-to-ounces', cat: 'weight' },
  { from: 'oz', to: 'g', slug: 'ounces-to-grams', cat: 'weight' },
  { from: 'l', to: 'gal', slug: 'liters-to-gallons', cat: 'volume' },
  { from: 'gal', to: 'l', slug: 'gallons-to-liters', cat: 'volume' },
  { from: 'sqft', to: 'm2', slug: 'sqft-to-sqm', cat: 'area' },
  { from: 'm2', to: 'sqft', slug: 'sqm-to-sqft', cat: 'area' },
  { from: 'psi', to: 'bar', slug: 'psi-to-bar', cat: 'pressure' },
  { from: 'bar', to: 'psi', slug: 'bar-to-psi', cat: 'pressure' },
  { from: 'kw', to: 'hp', slug: 'kw-to-hp', cat: 'power' },
  { from: 'hp', to: 'kw', slug: 'hp-to-kw', cat: 'power' },
  { from: 'gb', to: 'tb', slug: 'gb-to-tb', cat: 'data_storage' },
  { from: 'tb', to: 'gb', slug: 'tb-to-gb', cat: 'data_storage' },
  { from: 'mb', to: 'gb', slug: 'mb-to-gb', cat: 'data_storage' },
  { from: 'gb', to: 'mb', slug: 'gb-to-mb', cat: 'data_storage' },
  { from: 'kwh', to: 'j', slug: 'kwh-to-joules', cat: 'energy' },
  { from: 'hr', to: 'min', slug: 'hours-to-minutes', cat: 'time' },
  { from: 'min', to: 's', slug: 'minutes-to-seconds', cat: 'time' },
  { from: 'days', to: 'hours', slug: 'days-to-hours', cat: 'time' }
];

export function resolveSlug(slug: string): ResolvedSlug {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();

  // Volume & Capacity specific slug aliases
  const volumeAliases = [
    'volume',
    'volume-converter',
    'capacity',
    'capacity-converter',
    'volume-and-capacity',
    'volume-and-capacity-converter',
    'volume-capacity',
    'volume-capacity-converter',
    'volume---capacity'
  ];
  if (volumeAliases.includes(clean)) {
    const volCat = CONVERSION_CATEGORIES.find((c) => c.id === 'volume');
    if (volCat) {
      const seo = getCategorySeo('volume');
      return {
        type: 'category',
        slug: clean,
        category: volCat,
        title: seo.seoTitle,
        h1: `${seo.h1} ${seo.h1Highlight}`,
        description: seo.description,
        canonicalUrl: `https://solveitcalculator.com/convert/${clean}`
      };
    }
  }

  // 1. Check if slug matches a Category (e.g. "length", "weight", "fuel-economy", "length-converter")
  const categoryMatch = CONVERSION_CATEGORIES.find(
    (c) =>
      c.id === clean ||
      c.id.replace(/_/g, '-') === clean ||
      c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === clean ||
      c.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '-') === clean ||
      `${c.id}-converter` === clean ||
      `${c.id.replace(/_/g, '-')}-converter` === clean ||
      `${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-converter` === clean ||
      `${c.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '-')}-converter` === clean
  );

  if (categoryMatch) {
    const seo = getCategorySeo(categoryMatch.id);
    return {
      type: 'category',
      slug: clean,
      category: categoryMatch,
      title: seo.seoTitle,
      h1: `${seo.h1} ${seo.h1Highlight}`,
      description: seo.description,
      canonicalUrl: `https://solveitcalculator.com/convert/${clean}`
    };
  }

  // 2. Check if slug matches a canonical pair slug in CANONICAL_POPULAR_PAIRS
  const canonMatch = CANONICAL_POPULAR_PAIRS.find((p) => p.slug === clean);
  if (canonMatch) {
    const cat = CONVERSION_CATEGORIES.find((c) => c.id === canonMatch.cat);
    if (cat) {
      const from = cat.units.find((u) => u.id === canonMatch.from);
      const to = cat.units.find((u) => u.id === canonMatch.to);
      if (from && to) {
        return buildResolvedPair(clean, cat, from, to);
      }
    }
  }

  // 3. Parse "[from]-to-[to]" pattern
  const parts = clean.split('-to-');
  if (parts.length === 2) {
    const rawFrom = parts[0];
    const rawTo = parts[1];

    const mappedFrom = UNIT_ALIASES[rawFrom] || rawFrom.replace(/-/g, '_');
    const mappedTo = UNIT_ALIASES[rawTo] || rawTo.replace(/-/g, '_');

    // Search across categories for a category containing both units
    for (const cat of CONVERSION_CATEGORIES) {
      const fromUnit = cat.units.find(
        (u) =>
          u.id === mappedFrom ||
          u.symbol.toLowerCase() === rawFrom ||
          u.name.toLowerCase().replace(/[^a-z0-9]/g, '') === rawFrom.replace(/[^a-z0-9]/g, '')
      );
      const toUnit = cat.units.find(
        (u) =>
          u.id === mappedTo ||
          u.symbol.toLowerCase() === rawTo ||
          u.name.toLowerCase().replace(/[^a-z0-9]/g, '') === rawTo.replace(/[^a-z0-9]/g, '')
      );

      if (fromUnit && toUnit) {
        return buildResolvedPair(clean, cat, fromUnit, toUnit);
      }
    }
  }

  return null;
}

function buildResolvedPair(
  slug: string,
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): ResolvedPair {
  const shortTitle = `${fromUnit.name} to ${toUnit.name}`;
  const h1 = `${fromUnit.name} to ${toUnit.name} Converter`;
  const title = `${fromUnit.name} to ${toUnit.name} Converter (${fromUnit.symbol} to ${toUnit.symbol}) | SolveIt Calculator`;
  const description = `Convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()} (${fromUnit.symbol} to ${toUnit.symbol}) instantly with accurate formulas, step-by-step arithmetic, live conversion table, and physical benchmarks.`;

  return {
    type: 'pair',
    slug,
    category,
    fromUnit,
    toUnit,
    title,
    shortTitle,
    h1,
    description,
    canonicalUrl: `https://solveitcalculator.com/convert/${slug}`
  };
}
