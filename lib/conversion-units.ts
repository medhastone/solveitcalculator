export type UnitType = 'volume' | 'mass';

export interface ConversionUnit {
  id: string; // e.g. "teaspoons"
  name: string; // e.g. "Teaspoons"
  symbol: string; // e.g. "tsp"
  type: UnitType;
  multiplierFromBase: number; // for volume, base is mL. for mass, base is g.
  description: string;
  heroText: string;
  faqs: { q: string; a: string }[];
}

export const UNIT_DATABASE: Record<string, ConversionUnit> = {
  'teaspoons': {
    id: 'teaspoons',
    name: 'Teaspoons',
    symbol: 'tsp',
    type: 'volume',
    multiplierFromBase: 0.202884, // 1 mL = 0.202884 tsp (US)
    description: 'Convert grams to teaspoons instantly. Perfect for small-scale culinary measurements, spices, and baking powder using standard US teaspoons.',
    heroText: 'Convert grams to US teaspoons using calibrated ingredient densities. A crucial tool for translating precise weight-based baking recipes into accessible spoon measurements.',
    faqs: [
      { q: 'How many grams are in a teaspoon?', a: 'It depends entirely on the ingredient. A teaspoon of water is exactly 4.93 grams. However, a teaspoon of ground cinnamon is only about 2.6 grams, while a teaspoon of salt is nearly 6 grams. You must factor in the ingredient\'s density.' },
      { q: 'Is a US teaspoon different from a UK teaspoon?', a: 'Yes. A US teaspoon is exactly 4.92892 mL. A UK (metric) teaspoon is exactly 5 mL. This calculator uses the standard US teaspoon by default, though the difference (1.4%) is generally negligible for home cooking.' }
    ]
  },
  'tablespoons': {
    id: 'tablespoons',
    name: 'Tablespoons',
    symbol: 'tbsp',
    type: 'volume',
    multiplierFromBase: 0.067628, // 1 mL = 0.067628 tbsp (US)
    description: 'Convert grams to tablespoons. Translate metric recipes into convenient tablespoon measurements for butter, sugar, and liquids.',
    heroText: 'Convert metric grams into standard US tablespoons. Since tablespoons measure volume and grams measure weight, this calculator uses specific ingredient densities to provide exact equivalents.',
    faqs: [
      { q: 'How many grams are in a tablespoon of butter?', a: 'One US tablespoon of butter weighs approximately 14.2 grams. Therefore, if a recipe calls for 50 grams of butter, you need about 3.5 tablespoons.' },
      { q: 'Can I use this for dry and liquid ingredients?', a: 'Yes. Whether you are measuring olive oil, flour, or cocoa powder, simply select the ingredient from the database and the calculator will apply the correct specific gravity for the conversion.' }
    ]
  },
  'fluid-ounces': {
    id: 'fluid-ounces',
    name: 'Fluid Ounces',
    symbol: 'fl oz',
    type: 'volume',
    multiplierFromBase: 0.033814, // 1 mL = 0.033814 fl oz (US)
    description: 'Convert grams to US fluid ounces. Ideal for converting metric liquid weights into standard imperial fluid ounces.',
    heroText: 'Calculate US fluid ounces from grams. Fluid ounces strictly measure volume, so converting from grams (mass) requires knowing the substance\'s density. Perfect for mixology and culinary scaling.',
    faqs: [
      { q: 'Is a fluid ounce the same as a dry ounce?', a: 'No! A fluid ounce (fl oz) measures volume (how much space something takes up), while a standard ounce (oz) measures weight/mass. 1 fluid ounce of water happens to weigh about 1.04 dry ounces, but for other ingredients, they are completely different.' },
      { q: 'How many fluid ounces is 100 grams of water?', a: '100 grams of pure water is exactly 100 milliliters, which converts to approximately 3.38 US fluid ounces.' }
    ]
  },
  'cups': {
    id: 'cups',
    name: 'Cups',
    symbol: 'cup',
    type: 'volume',
    multiplierFromBase: 0.00422675, // 1 mL = 0.00422675 cup (US)
    description: 'Convert grams to US cups. Translate professional weight-based baking recipes into standard cup measurements.',
    heroText: 'Convert grams to US cups using ingredient-specific density factors. Avoid the "scoop and sweep" error by finding the exact volumetric cup equivalent for your weighed ingredients.',
    faqs: [
      { q: 'How many cups is 100 grams of flour?', a: '100 grams of all-purpose flour is approximately 0.79 US cups. Flour is easily compacted, so its volume can vary, but this calculator uses the standard bulk density of 0.528 g/mL.' },
      { q: 'Why do European recipes use grams instead of cups?', a: 'Grams measure mass, which is absolute. Cups measure volume, which changes based on how an ingredient is packed (e.g., sifted vs. scooped flour). Using grams ensures the recipe turns out identical every single time.' }
    ]
  },
  'pints': {
    id: 'pints',
    name: 'Pints',
    symbol: 'pt',
    type: 'volume',
    multiplierFromBase: 0.00211338, // 1 mL = 0.00211338 pt (US)
    description: 'Convert grams to US liquid pints. Useful for large-batch culinary preparations and fluid conversions.',
    heroText: 'Convert grams directly to US liquid pints. Essential for scaling up recipes or converting bulk ingredient weights into standardized pint volumes.',
    faqs: [
      { q: 'How many grams in a pint of water?', a: 'A US liquid pint is 473.176 milliliters. Since water has a density of 1 g/mL, a pint of water weighs exactly 473.176 grams.' },
      { q: 'Are US and UK pints the same?', a: 'No. A US liquid pint is roughly 473 mL, while a UK imperial pint is larger, at 568 mL. This tool uses the standard US liquid pint.' }
    ]
  },
  'quarts': {
    id: 'quarts',
    name: 'Quarts',
    symbol: 'qt',
    type: 'volume',
    multiplierFromBase: 0.00105669, // 1 mL = 0.00105669 qt (US)
    description: 'Convert grams to US quarts. Calculate the volume of bulk metric ingredients for food service and catering.',
    heroText: 'Convert metric grams to US quarts. Since a quart is a measure of volume (a quarter of a gallon), this calculator factors in the specific gravity of the ingredient to provide accurate conversions.',
    faqs: [
      { q: 'How many grams in a quart of milk?', a: 'A US quart is 946.35 mL. Whole milk has a density of about 1.03 g/mL. Therefore, a quart of milk weighs approximately 974.7 grams.' },
      { q: 'What is a quart equivalent to?', a: 'One US liquid quart is equal to 2 pints, 4 cups, or 32 fluid ounces.' }
    ]
  },
  'gallons': {
    id: 'gallons',
    name: 'Gallons',
    symbol: 'gal',
    type: 'volume',
    multiplierFromBase: 0.000264172, // 1 mL = 0.000264172 gal (US)
    description: 'Convert grams to US gallons. Essential for industrial formulations, brewing, and large-scale manufacturing.',
    heroText: 'Translate bulk mass in grams into US liquid gallons. This tool applies metrology-grade density offsets to calculate exact volumetric gallons from metric weights.',
    faqs: [
      { q: 'How many grams are in a gallon of water?', a: 'One US gallon is equal to 3,785.41 milliliters. Therefore, a gallon of pure water weighs 3,785.41 grams (or about 3.78 kilograms).' },
      { q: 'Can I calculate dry gallons?', a: 'This calculator defaults to US liquid gallons. If converting dry powders (like flour or sugar), it calculates the volume space those powders would occupy if poured into a gallon container.' }
    ]
  },
  'liters': {
    id: 'liters',
    name: 'Liters',
    symbol: 'L',
    type: 'volume',
    multiplierFromBase: 0.001, // 1 mL = 0.001 L
    description: 'Convert grams to liters. Standard metric mass-to-volume conversion using substance density.',
    heroText: 'Convert grams (g) to liters (L). Both are SI metric units, but translating mass to volume requires the specific density of the substance being measured.',
    faqs: [
      { q: 'Is 1000 grams always 1 liter?', a: 'Only for pure water at 4°C! For everything else, it varies. 1000 grams of dense honey is only about 0.7 liters, while 1000 grams of flour takes up nearly 1.9 liters of space.' },
      { q: 'What is the relationship between mL and Liters?', a: 'There are exactly 1,000 milliliters (mL) in 1 Liter (L).' }
    ]
  },
  'ounces': {
    id: 'ounces',
    name: 'Ounces (Dry)',
    symbol: 'oz',
    type: 'mass',
    multiplierFromBase: 0.035274, // 1 g = 0.035274 oz
    description: 'Convert grams to standard ounces (oz). Fast, precise weight-to-weight translation for international cooking and postage.',
    heroText: 'Convert metric grams (g) into imperial dry ounces (oz). Because both units measure mass/weight, this is a direct mathematical conversion requiring no density factors.',
    faqs: [
      { q: 'Is this the same as fluid ounces?', a: 'No. Standard ounces (oz) measure weight, while fluid ounces (fl oz) measure volume. This calculator converts to dry weight ounces.' },
      { q: 'How many grams are in 1 ounce?', a: 'There are exactly 28.3495 grams in one standard international avoirdupois ounce.' }
    ]
  },
  'pounds': {
    id: 'pounds',
    name: 'Pounds',
    symbol: 'lb',
    type: 'mass',
    multiplierFromBase: 0.00220462, // 1 g = 0.00220462 lb
    description: 'Convert grams to pounds (lbs). Accurate mass conversion for body weight, freight, and bulk ingredient scaling.',
    heroText: 'Convert metric grams to imperial pounds (lbs). A pure mass-to-mass calculation essential for global logistics, fitness tracking, and culinary scaling.',
    faqs: [
      { q: 'How many grams in a pound?', a: 'There are exactly 453.592 grams in one standard international pound.' },
      { q: 'How do I quickly estimate grams to pounds?', a: 'A quick mental shortcut is to divide the grams by 1,000 (to get kilograms) and then multiply by 2.2.' }
    ]
  },
  'milligrams': {
    id: 'milligrams',
    name: 'Milligrams',
    symbol: 'mg',
    type: 'mass',
    multiplierFromBase: 1000, // 1 g = 1000 mg
    description: 'Convert grams to milligrams (mg). Precision SI-prefix scaling for pharmacology, supplements, and micro-measurements.',
    heroText: 'Convert grams directly to milligrams. Since both are base-10 metric units of mass, this is a simple magnitude shift used heavily in scientific and medical dosing.',
    faqs: [
      { q: 'How many milligrams in a gram?', a: 'There are exactly 1,000 milligrams in 1 gram. The prefix "milli-" means one-thousandth.' },
      { q: 'Why use milligrams instead of grams?', a: 'Milligrams are used for extremely small masses, such as the active ingredients in pharmaceutical pills (e.g., 200mg of ibuprofen) or nutritional supplements where a full gram would be an overdose.' }
    ]
  },
  'kilograms': {
    id: 'kilograms',
    name: 'Kilograms',
    symbol: 'kg',
    type: 'mass',
    multiplierFromBase: 0.001, // 1 g = 0.001 kg
    description: 'Convert grams to kilograms (kg). Standard metric scaling for bodyweight, heavy ingredients, and freight.',
    heroText: 'Convert grams into kilograms. A fundamental base-10 metric conversion widely used in science, fitness, and international trade.',
    faqs: [
      { q: 'How many grams make a kilogram?', a: 'There are exactly 1,000 grams in 1 kilogram. The prefix "kilo-" means one thousand.' },
      { q: 'Which is the SI base unit?', a: 'Interestingly, the kilogram (kg), not the gram, is the official base unit of mass in the International System of Units (SI).' }
    ]
  }
};
