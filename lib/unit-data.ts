export type UnitCategory = 'mass' | 'volume' | 'length';

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
  { id: 'centimeter', symbol: 'cm', namePlural: 'Centimeters', nameSingular: 'Centimeter', category: 'length', baseFactor: 0.01 },
  { id: 'millimeter', symbol: 'mm', namePlural: 'Millimeters', nameSingular: 'Millimeter', category: 'length', baseFactor: 0.001 },
  { id: 'inch', symbol: 'in', namePlural: 'Inches', nameSingular: 'Inch', category: 'length', baseFactor: 0.0254 },
  { id: 'feet', symbol: 'ft', namePlural: 'Feet', nameSingular: 'Foot', category: 'length', baseFactor: 0.3048 },
  { id: 'yard', symbol: 'yd', namePlural: 'Yards', nameSingular: 'Yard', category: 'length', baseFactor: 0.9144 },
];

export const getUnitById = (id: string): Unit | undefined => {
  return UNITS.find(u => u.id === id);
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
