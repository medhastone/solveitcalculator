export type MeasurementStandardId = 'us_customary' | 'metric' | 'us_legal';

export interface MeasurementStandardSpec {
  id: MeasurementStandardId;
  name: string;
  shortLabel: string;
  cupMl: number;
  tbspMl: number;
  tspMl: number;
  description: string;
}

export const MEASUREMENT_STANDARDS: Record<MeasurementStandardId, MeasurementStandardSpec> = {
  us_customary: {
    id: 'us_customary',
    name: 'US Customary Standard',
    shortLabel: 'US Cup (236.59 mL)',
    cupMl: 236.5882365,
    tbspMl: 14.78676478,
    tspMl: 4.92892159,
    description:
      '1 US Customary cup = 236.59 mL (8 US fl oz), 1 tbsp = 14.79 mL, 1 tsp = 4.93 mL. Used in standard American recipes and USDA reference tables.',
  },
  metric: {
    id: 'metric',
    name: 'Metric Kitchen Standard',
    shortLabel: 'Metric Cup (250 mL)',
    cupMl: 250,
    tbspMl: 15,
    tspMl: 5,
    description:
      '1 Metric cup = 250 mL, 1 tbsp = 15 mL, 1 tsp = 5 mL. Used in Commonwealth/international metric baking recipes.',
  },
  us_legal: {
    id: 'us_legal',
    name: 'US FDA Nutrition Labeling',
    shortLabel: 'US Legal Cup (240 mL)',
    cupMl: 240,
    tbspMl: 15,
    tspMl: 5,
    description:
      '1 US Legal cup = 240 mL, 1 tbsp = 15 mL, 1 tsp = 5 mL. Used on US nutrition facts panels.',
  },
};

export interface VerifiedIngredientReference {
  id: string;
  name: string;
  category:
    | 'Flours & Grains'
    | 'Sugars & Sweeteners'
    | 'Fats & Dairy'
    | 'Liquids & Oils'
    | 'Baking & Pantry';
  aliases: string[];
  /** Reference mass in grams per 1 US Customary Cup (236.588 mL) */
  gramsPerUsCup: number;
  /** Physical density in grams per millilitre (derived from gramsPerUsCup / 236.5882365) */
  gramsPerMl: number;
  referenceStandard: string;
  source: string;
  preparationNote: string;
}

const US_CUP_ML = 236.5882365;

function createIngredient(
  item: Omit<VerifiedIngredientReference, 'gramsPerMl' | 'referenceStandard'>
): VerifiedIngredientReference {
  return {
    ...item,
    gramsPerMl: item.gramsPerUsCup / US_CUP_ML,
    referenceStandard: '1 US Customary cup (236.59 mL)',
  };
}

/**
 * Maintainable, verified ingredient density reference table.
 * Values are based on published USDA FoodData Central and King Arthur Baking reference weights.
 * Do not apply a single universal density across ingredients.
 */
export const VERIFIED_INGREDIENTS: VerifiedIngredientReference[] = [
  createIngredient({
    id: 'all-purpose-flour',
    name: 'All-Purpose Flour',
    category: 'Flours & Grains',
    aliases: [
      'flour',
      'all purpose flour',
      'ap flour',
      'plain flour',
      'white flour',
      'unbleached all-purpose flour',
    ],
    gramsPerUsCup: 120,
    source: 'King Arthur Baking Ingredient Weight Chart / USDA FoodData Central',
    preparationNote: 'Spooned and leveled into measuring cup',
  }),
  createIngredient({
    id: 'bread-flour',
    name: 'Bread Flour',
    category: 'Flours & Grains',
    aliases: ['strong flour', 'high gluten flour', 'unbleached bread flour'],
    gramsPerUsCup: 120,
    source: 'King Arthur Baking Ingredient Weight Chart',
    preparationNote: 'Spooned and leveled',
  }),
  createIngredient({
    id: 'cake-flour',
    name: 'Cake Flour',
    category: 'Flours & Grains',
    aliases: ['pastry flour', 'soft wheat flour', 'swans down cake flour'],
    gramsPerUsCup: 114,
    source: 'USDA FoodData Central (Wheat flour, white, cake, enriched)',
    preparationNote: 'Spooned and leveled, unsifted',
  }),
  createIngredient({
    id: 'whole-wheat-flour',
    name: 'Whole Wheat Flour',
    category: 'Flours & Grains',
    aliases: ['wholemeal flour', 'graham flour', 'whole grain wheat flour'],
    gramsPerUsCup: 113,
    source: 'King Arthur Baking Ingredient Weight Chart / USDA FoodData Central',
    preparationNote: 'Spooned and leveled',
  }),
  createIngredient({
    id: 'almond-flour',
    name: 'Almond Flour (Blanched)',
    category: 'Flours & Grains',
    aliases: ['almond meal', 'ground almonds', 'blanched almond flour'],
    gramsPerUsCup: 96,
    source: 'King Arthur Baking Ingredient Weight Chart',
    preparationNote: 'Spooned and leveled, unpacked',
  }),
  createIngredient({
    id: 'rolled-oats',
    name: 'Rolled Oats (Old-Fashioned)',
    category: 'Flours & Grains',
    aliases: ['oats', 'old fashioned oats', 'oatmeal', 'porridge oats'],
    gramsPerUsCup: 89,
    source: 'King Arthur Baking Ingredient Weight Chart / USDA FoodData Central',
    preparationNote: 'Uncooked, level cup',
  }),
  createIngredient({
    id: 'white-rice-uncooked',
    name: 'White Rice (Long-Grain, Uncooked)',
    category: 'Flours & Grains',
    aliases: ['rice', 'white rice', 'uncooked rice', 'long grain rice', 'jasmine rice'],
    gramsPerUsCup: 185,
    source: 'USDA FoodData Central (Rice, white, long-grain, regular, raw)',
    preparationNote: 'Dry, uncooked',
  }),
  createIngredient({
    id: 'granulated-sugar',
    name: 'Granulated White Sugar',
    category: 'Sugars & Sweeteners',
    aliases: ['sugar', 'white sugar', 'caster sugar', 'cane sugar', 'table sugar', 'granulated sugar'],
    gramsPerUsCup: 200,
    source: 'USDA FoodData Central / King Arthur Baking Ingredient Weight Chart',
    preparationNote: 'Level measuring cup',
  }),
  createIngredient({
    id: 'brown-sugar-packed',
    name: 'Brown Sugar (Light or Dark, Packed)',
    category: 'Sugars & Sweeteners',
    aliases: ['brown sugar', 'light brown sugar', 'dark brown sugar', 'packed brown sugar'],
    gramsPerUsCup: 213,
    source: 'King Arthur Baking Ingredient Weight Chart / USDA FoodData Central',
    preparationNote: 'Firmly packed into cup',
  }),
  createIngredient({
    id: 'powdered-sugar',
    name: 'Powdered Sugar (Confectioners’ Sugar)',
    category: 'Sugars & Sweeteners',
    aliases: ['confectioners sugar', 'icing sugar', 'powdered sugar', '10x sugar'],
    gramsPerUsCup: 120,
    source: 'USDA FoodData Central (Sugars, powdered, unsifted)',
    preparationNote: 'Unsifted, spooned and leveled',
  }),
  createIngredient({
    id: 'honey',
    name: 'Honey',
    category: 'Sugars & Sweeteners',
    aliases: ['raw honey', 'liquid honey', 'clover honey'],
    gramsPerUsCup: 339,
    source: 'USDA FoodData Central (Honey, 1 cup = 339 g)',
    preparationNote: 'Liquid at room temperature',
  }),
  createIngredient({
    id: 'maple-syrup',
    name: 'Pure Maple Syrup',
    category: 'Sugars & Sweeteners',
    aliases: ['syrup', 'maple syrup'],
    gramsPerUsCup: 312,
    source: 'King Arthur Baking Ingredient Weight Chart / USDA FoodData Central',
    preparationNote: 'Liquid at room temperature',
  }),
  createIngredient({
    id: 'butter',
    name: 'Butter (Salted or Unsalted)',
    category: 'Fats & Dairy',
    aliases: ['unsalted butter', 'salted butter', 'melted butter', 'softened butter', 'dairy butter'],
    gramsPerUsCup: 227,
    source: 'USDA FoodData Central (Butter, 1 cup / 2 sticks = 227 g)',
    preparationNote: 'Solid or melted (1 US stick = 1/2 cup = 113.5 g)',
  }),
  createIngredient({
    id: 'whole-milk',
    name: 'Milk (Whole or 2%)',
    category: 'Fats & Dairy',
    aliases: ['milk', 'whole milk', 'skim milk', 'dairy milk', '2% milk'],
    gramsPerUsCup: 244,
    source: 'USDA FoodData Central (Milk, whole, 3.25% milkfat, 1 cup = 244 g)',
    preparationNote: 'Liquid measurement',
  }),
  createIngredient({
    id: 'heavy-cream',
    name: 'Heavy Whipping Cream',
    category: 'Fats & Dairy',
    aliases: ['cream', 'heavy cream', 'whipping cream', 'double cream'],
    gramsPerUsCup: 238,
    source: 'USDA FoodData Central (Cream, fluid, heavy whipping)',
    preparationNote: 'Liquid unwhipped',
  }),
  createIngredient({
    id: 'greek-yogurt',
    name: 'Plain Yogurt / Sour Cream',
    category: 'Fats & Dairy',
    aliases: ['yogurt', 'greek yogurt', 'sour cream', 'plain yogurt'],
    gramsPerUsCup: 245,
    source: 'USDA FoodData Central',
    preparationNote: 'Level cup',
  }),
  createIngredient({
    id: 'water',
    name: 'Water',
    category: 'Liquids & Oils',
    aliases: ['tap water', 'warm water', 'cold water', 'boiling water', 'ice water'],
    gramsPerUsCup: 236.59,
    source: 'NIST / Pure Water Reference Density (~1.00 g/mL at 20°C)',
    preparationNote: 'Liquid at room temperature',
  }),
  createIngredient({
    id: 'vegetable-oil',
    name: 'Vegetable / Canola Oil',
    category: 'Liquids & Oils',
    aliases: ['oil', 'canola oil', 'cooking oil', 'sunflower oil', 'neutral oil'],
    gramsPerUsCup: 218,
    source: 'USDA FoodData Central (Oil, vegetable, canola, 1 cup = 218 g)',
    preparationNote: 'Liquid at room temperature',
  }),
  createIngredient({
    id: 'olive-oil',
    name: 'Olive Oil',
    category: 'Liquids & Oils',
    aliases: ['extra virgin olive oil', 'evoo'],
    gramsPerUsCup: 216,
    source: 'USDA FoodData Central (Oil, olive, salad or cooking, 1 cup = 216 g)',
    preparationNote: 'Liquid at room temperature',
  }),
  createIngredient({
    id: 'cocoa-powder',
    name: 'Unsweetened Cocoa Powder',
    category: 'Baking & Pantry',
    aliases: ['cocoa', 'cocoa powder', 'dutch process cocoa', 'baking cocoa'],
    gramsPerUsCup: 84,
    source: 'King Arthur Baking Ingredient Weight Chart / USDA FoodData Central',
    preparationNote: 'Spooned and leveled, unsifted',
  }),
  createIngredient({
    id: 'cornstarch',
    name: 'Cornstarch',
    category: 'Baking & Pantry',
    aliases: ['cornflour', 'corn starch'],
    gramsPerUsCup: 128,
    source: 'USDA FoodData Central (Cornstarch, 1 cup = 128 g)',
    preparationNote: 'Level measurement',
  }),
  createIngredient({
    id: 'baking-powder',
    name: 'Baking Powder',
    category: 'Baking & Pantry',
    aliases: ['double acting baking powder'],
    gramsPerUsCup: 230.4,
    source: 'USDA FoodData Central (1 tsp = 4.8 g; 48 tsp/cup = 230.4 g)',
    preparationNote: 'Level spoon measurement (1 tsp = 4.8 g)',
  }),
  createIngredient({
    id: 'baking-soda',
    name: 'Baking Soda (Bicarbonate of Soda)',
    category: 'Baking & Pantry',
    aliases: ['bicarbonate of soda', 'bicarb soda', 'sodium bicarbonate'],
    gramsPerUsCup: 220.8,
    source: 'USDA FoodData Central (1 tsp = 4.6 g; 48 tsp/cup = 220.8 g)',
    preparationNote: 'Level spoon measurement (1 tsp = 4.6 g)',
  }),
  createIngredient({
    id: 'table-salt',
    name: 'Table Salt (Fine)',
    category: 'Baking & Pantry',
    aliases: ['salt', 'fine salt', 'iodized salt', 'fine sea salt'],
    gramsPerUsCup: 288,
    source: 'USDA FoodData Central (Salt, table, 1 tsp = 6 g; 1 cup = 288 g)',
    preparationNote: 'Fine grain (Note: flaky kosher salt weighs less per spoon)',
  }),
  createIngredient({
    id: 'chocolate-chips',
    name: 'Chocolate Chips (Semi-Sweet)',
    category: 'Baking & Pantry',
    aliases: ['chocolate chips', 'semi sweet chocolate chips', 'dark chocolate chips', 'morsels'],
    gramsPerUsCup: 170,
    source: 'King Arthur Baking Ingredient Weight Chart (1 cup = 6 oz / 170 g)',
    preparationNote: 'Standard morsels, level cup',
  }),
];
