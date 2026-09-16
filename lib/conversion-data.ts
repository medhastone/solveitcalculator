export interface Ingredient {
  id: string;
  name: string;
  category: string;
  density: number; // g/mL
  usda: string;
  cupGrams: number;
}

export const INGREDIENTS: Ingredient[] = [
  // Baking Essentials & Flours
  { id: 'flour_ap', name: 'All-Purpose Flour (Wheat, Unbleached)', category: 'baking', density: 0.528, usda: '168894', cupGrams: 126.7 },
  { id: 'flour_bread', name: 'Bread Flour (High Gluten)', category: 'baking', density: 0.537, usda: '168897', cupGrams: 128.9 },
  { id: 'flour_cake', name: 'Cake Flour (Sifted, Soft Wheat)', category: 'baking', density: 0.485, usda: '168901', cupGrams: 116.4 },
  { id: 'flour_almond', name: 'Almond Flour (Blanched, Fine)', category: 'baking', density: 0.460, usda: '170567', cupGrams: 110.4 },
  { id: 'flour_coconut', name: 'Coconut Flour (Organic)', category: 'baking', density: 0.480, usda: '174245', cupGrams: 115.2 },
  { id: 'cocoa_powder', name: 'Cocoa Powder (Unsweetened Dutch)', category: 'baking', density: 0.400, usda: '169593', cupGrams: 96.0 },
  { id: 'baking_soda', name: 'Baking Soda (Sodium Bicarbonate)', category: 'baking', density: 0.900, usda: '173468', cupGrams: 216.0 },
  { id: 'baking_powder', name: 'Baking Powder (Double Acting)', category: 'baking', density: 0.880, usda: '173467', cupGrams: 211.2 },
  { id: 'cornstarch', name: 'Cornstarch (Pure Maize Starch)', category: 'baking', density: 0.540, usda: '169697', cupGrams: 129.6 },
  { id: 'table_salt', name: 'Table Salt (Fine Sodium Chloride)', category: 'baking', density: 1.217, usda: '173469', cupGrams: 292.1 },
  
  // Sweeteners & Syrups
  { id: 'sugar_gran', name: 'Granulated White Sugar (Sucrose)', category: 'sweeteners', density: 0.849, usda: '169655', cupGrams: 203.8 },
  { id: 'sugar_brown_pack', name: 'Brown Sugar (Packed tightly)', category: 'sweeteners', density: 0.930, usda: '168833', cupGrams: 223.2 },
  { id: 'sugar_powdered', name: 'Powdered / Confectioners Sugar', category: 'sweeteners', density: 0.560, usda: '168834', cupGrams: 134.4 },
  { id: 'honey', name: 'Pure Clover Honey (Natural)', category: 'sweeteners', density: 1.420, usda: '169640', cupGrams: 340.8 },
  { id: 'maple_syrup', name: 'Pure Maple Syrup (Grade A)', category: 'sweeteners', density: 1.333, usda: '169656', cupGrams: 319.9 },
  { id: 'molasses', name: 'Blackstrap Molasses (Unsulphured)', category: 'sweeteners', density: 1.410, usda: '169658', cupGrams: 338.4 },
  { id: 'agave', name: 'Agave Nectar (Blue)', category: 'sweeteners', density: 1.380, usda: '174312', cupGrams: 331.2 },
  
  // Oils & Liquid Lipids
  { id: 'olive_oil', name: 'Extra Virgin Olive Oil', category: 'oils', density: 0.918, usda: '171413', cupGrams: 220.3 },
  { id: 'canola_oil', name: 'Canola Oil (Refined)', category: 'oils', density: 0.914, usda: '172336', cupGrams: 219.4 },
  { id: 'coconut_oil', name: 'Virgin Coconut Oil (Liquid at 25°C)', category: 'oils', density: 0.924, usda: '171412', cupGrams: 221.8 },
  { id: 'butter_unsalted', name: 'Unsalted Butter (Clarified/Melted)', category: 'oils', density: 0.911, usda: '173410', cupGrams: 218.6 },
  { id: 'sesame_oil', name: 'Toasted Sesame Oil', category: 'oils', density: 0.920, usda: '171015', cupGrams: 220.8 },
  
  // Dairy & Alternatives
  { id: 'water', name: 'Pure Water (H2O at 4°C Standard)', category: 'chemistry', density: 1.000, usda: 'NIST-01', cupGrams: 240.0 },
  { id: 'milk_whole', name: 'Whole Milk (3.25% Butterfat)', category: 'dairy', density: 1.032, usda: '171265', cupGrams: 247.7 },
  { id: 'heavy_cream', name: 'Heavy Whipping Cream (36% Fat)', category: 'dairy', density: 0.994, usda: '170859', cupGrams: 238.6 },
  { id: 'greek_yogurt', name: 'Plain Greek Yogurt (0% Fat)', category: 'dairy', density: 1.060, usda: '170889', cupGrams: 254.4 },
  { id: 'buttermilk', name: 'Cultured Low-fat Buttermilk', category: 'dairy', density: 1.033, usda: '170868', cupGrams: 247.9 },
  { id: 'almond_milk', name: 'Almond Milk (Unsweetened)', category: 'dairy', density: 1.015, usda: '174832', cupGrams: 243.6 },
  
  // Sports Powders & Grains
  { id: 'whey_protein', name: 'Whey Protein Isolate (Dry Powder)', category: 'powders', density: 0.380, usda: '173420', cupGrams: 91.2 },
  { id: 'creatine', name: 'Creatine Monohydrate (Micronized)', category: 'powders', density: 0.860, usda: 'CAS-60-27-5', cupGrams: 206.4 },
  { id: 'rolled_oats', name: 'Rolled Oats (Old Fashioned)', category: 'flours', density: 0.450, usda: '169705', cupGrams: 108.0 },
  { id: 'white_rice', name: 'Long Grain White Rice (Uncooked)', category: 'flours', density: 0.850, usda: '169756', cupGrams: 204.0 },
  
  // Chemistry Reagents
  { id: 'ethanol', name: 'Ethanol (100% Anhydrous)', category: 'chemistry', density: 0.789, usda: 'CAS-64-17-5', cupGrams: 189.4 },
  { id: 'glycerol', name: 'Glycerin / Glycerol (99.5% USP)', category: 'chemistry', density: 1.261, usda: 'CAS-56-81-5', cupGrams: 302.6 }
];
