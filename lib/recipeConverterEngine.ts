import {
  MEASUREMENT_STANDARDS,
  VERIFIED_INGREDIENTS,
} from './recipeIngredientsData.ts';
import type {
  MeasurementStandardId,
  VerifiedIngredientReference,
} from './recipeIngredientsData.ts';

export type RecipeUnitId =
  | 'g'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'ml'
  | 'l'
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'fl_oz'
  | 'pt'
  | 'qt'
  | 'gal';

export type UnitDimension = 'mass' | 'volume';

export interface RecipeUnitSpec {
  id: RecipeUnitId;
  label: string;
  shortLabel: string;
  dimension: UnitDimension;
}

export const RECIPE_UNITS: Record<RecipeUnitId, RecipeUnitSpec> = {
  g: { id: 'g', label: 'Grams (g)', shortLabel: 'g', dimension: 'mass' },
  kg: { id: 'kg', label: 'Kilograms (kg)', shortLabel: 'kg', dimension: 'mass' },
  oz: { id: 'oz', label: 'Ounces (oz)', shortLabel: 'oz', dimension: 'mass' },
  lb: { id: 'lb', label: 'Pounds (lb)', shortLabel: 'lb', dimension: 'mass' },
  ml: { id: 'ml', label: 'Millilitres (mL)', shortLabel: 'mL', dimension: 'volume' },
  l: { id: 'l', label: 'Litres (L)', shortLabel: 'L', dimension: 'volume' },
  tsp: { id: 'tsp', label: 'Teaspoons (tsp)', shortLabel: 'tsp', dimension: 'volume' },
  tbsp: { id: 'tbsp', label: 'Tablespoons (tbsp)', shortLabel: 'tbsp', dimension: 'volume' },
  cup: { id: 'cup', label: 'Cups (cup)', shortLabel: 'cup', dimension: 'volume' },
  fl_oz: { id: 'fl_oz', label: 'Fluid Ounces (fl oz)', shortLabel: 'fl oz', dimension: 'volume' },
  pt: { id: 'pt', label: 'US Pints (pt)', shortLabel: 'pt', dimension: 'volume' },
  qt: { id: 'qt', label: 'US Quarts (qt)', shortLabel: 'qt', dimension: 'volume' },
  gal: { id: 'gal', label: 'US Gallons (gal)', shortLabel: 'gal', dimension: 'volume' },
};

const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '¼': 0.25,
  '¾': 0.75,
  '⅕': 0.2,
  '⅖': 0.4,
  '⅗': 0.6,
  '⅘': 0.8,
  '⅙': 1 / 6,
  '⅚': 5 / 6,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

/**
 * Safely parses decimal, simple fraction ("3/4"), mixed fraction ("1 1/2" or "1-1/2"),
 * or unicode fraction ("1½") quantities without using eval() or new Function().
 */
export function parseRecipeQuantity(rawInput: string | number): {
  isValid: boolean;
  value: number | null;
  error?: string;
} {
  if (typeof rawInput === 'number') {
    if (!Number.isFinite(rawInput) || rawInput <= 0) {
      return {
        isValid: false,
        value: null,
        error: 'Enter a positive quantity greater than zero.',
      };
    }
    return { isValid: true, value: rawInput };
  }

  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      isValid: false,
      value: null,
      error: 'Enter a quantity (e.g., 1.5, 3/4, or 1 1/2).',
    };
  }

  if (trimmed.length > 32) {
    return {
      isValid: false,
      value: null,
      error: 'Quantity input is too long.',
    };
  }

  // Check for standalone unicode fraction or whole + unicode fraction (e.g., "1½" or "1 ½")
  for (const [char, fracVal] of Object.entries(UNICODE_FRACTIONS)) {
    if (trimmed === char) {
      return { isValid: true, value: fracVal };
    }
    if (trimmed.endsWith(char)) {
      const wholePartStr = trimmed.slice(0, -char.length).trim();
      if (/^\d+$/.test(wholePartStr)) {
        const whole = Number(wholePartStr);
        const total = whole + fracVal;
        if (Number.isFinite(total) && total > 0) {
          return { isValid: true, value: total };
        }
      }
    }
  }

  // Standard decimal number: e.g. "2", "1.5", ".75"
  if (/^(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    const val = Number(trimmed);
    if (!Number.isFinite(val) || val <= 0) {
      return {
        isValid: false,
        value: null,
        error: 'Quantity must be greater than zero.',
      };
    }
    return { isValid: true, value: val };
  }

  // Simple fraction: e.g. "3/4"
  const simpleFractionMatch = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (simpleFractionMatch) {
    const numerator = Number(simpleFractionMatch[1]);
    const denominator = Number(simpleFractionMatch[2]);
    if (denominator === 0) {
      return {
        isValid: false,
        value: null,
        error: 'Fraction denominator cannot be zero.',
      };
    }
    const val = numerator / denominator;
    if (!Number.isFinite(val) || val <= 0) {
      return {
        isValid: false,
        value: null,
        error: 'Quantity must be greater than zero.',
      };
    }
    return { isValid: true, value: val };
  }

  // Mixed fraction: e.g. "1 1/2" or "1-1/2"
  const mixedFractionMatch = trimmed.match(/^(\d+)(?:\s+|-)\s*(\d+)\s*\/\s*(\d+)$/);
  if (mixedFractionMatch) {
    const whole = Number(mixedFractionMatch[1]);
    const numerator = Number(mixedFractionMatch[2]);
    const denominator = Number(mixedFractionMatch[3]);
    if (denominator === 0) {
      return {
        isValid: false,
        value: null,
        error: 'Fraction denominator cannot be zero.',
      };
    }
    const val = whole + numerator / denominator;
    if (!Number.isFinite(val) || val <= 0) {
      return {
        isValid: false,
        value: null,
        error: 'Quantity must be greater than zero.',
      };
    }
    return { isValid: true, value: val };
  }

  return {
    isValid: false,
    value: null,
    error: 'Invalid quantity. Use a positive number or fraction such as 1.5, 3/4, or 1 1/2.',
  };
}

/**
 * Matches an ingredient by ID, exact name, or alias (case-insensitive).
 */
export function resolveVerifiedIngredient(
  queryOrId: string
): VerifiedIngredientReference | null {
  const normalized = queryOrId.trim().toLowerCase();
  if (!normalized) return null;

  for (const ing of VERIFIED_INGREDIENTS) {
    if (ing.id.toLowerCase() === normalized) return ing;
    if (ing.name.toLowerCase() === normalized) return ing;
    if (ing.aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return ing;
    }
  }
  return null;
}

/**
 * Computes and validates the recipe serving scaling factor.
 * Scaling Factor = Desired Servings ÷ Original Servings
 */
export function calculateServingScale(
  originalServingsInput: string | number,
  desiredServingsInput: string | number
): {
  isValid: boolean;
  originalServings: number | null;
  desiredServings: number | null;
  scalingFactor: number;
  error?: string;
} {
  const orig = Number(originalServingsInput);
  const desired = Number(desiredServingsInput);

  if (!Number.isFinite(orig) || orig <= 0) {
    return {
      isValid: false,
      originalServings: null,
      desiredServings: null,
      scalingFactor: 1,
      error: 'Original servings must be a positive number greater than zero.',
    };
  }

  if (!Number.isFinite(desired) || desired <= 0) {
    return {
      isValid: false,
      originalServings: orig,
      desiredServings: null,
      scalingFactor: 1,
      error: 'Desired servings must be a positive number greater than zero.',
    };
  }

  const factor = desired / orig;
  return {
    isValid: true,
    originalServings: orig,
    desiredServings: desired,
    scalingFactor: factor,
  };
}

export function unitToGrams(value: number, unit: RecipeUnitId): number {
  switch (unit) {
    case 'g':
      return value;
    case 'kg':
      return value * 1000;
    case 'oz':
      return value * 28.349523125;
    case 'lb':
      return value * 453.59237;
    default:
      throw new Error(`Unit ${unit} is not a mass unit.`);
  }
}

export function gramsToUnit(grams: number, unit: RecipeUnitId): number {
  switch (unit) {
    case 'g':
      return grams;
    case 'kg':
      return grams / 1000;
    case 'oz':
      return grams / 28.349523125;
    case 'lb':
      return grams / 453.59237;
    default:
      throw new Error(`Unit ${unit} is not a mass unit.`);
  }
}

export function unitToMillilitres(
  value: number,
  unit: RecipeUnitId,
  standardId: MeasurementStandardId = 'us_customary'
): number {
  const std = MEASUREMENT_STANDARDS[standardId];
  switch (unit) {
    case 'ml':
      return value;
    case 'l':
      return value * 1000;
    case 'tsp':
      return value * std.tspMl;
    case 'tbsp':
      return value * std.tbspMl;
    case 'cup':
      return value * std.cupMl;
    case 'fl_oz':
      return value * 29.5735295625;
    case 'pt':
      return value * 473.176473;
    case 'qt':
      return value * 946.352946;
    case 'gal':
      return value * 3785.411784;
    default:
      throw new Error(`Unit ${unit} is not a volume unit.`);
  }
}

export function millilitresToUnit(
  ml: number,
  unit: RecipeUnitId,
  standardId: MeasurementStandardId = 'us_customary'
): number {
  const std = MEASUREMENT_STANDARDS[standardId];
  switch (unit) {
    case 'ml':
      return ml;
    case 'l':
      return ml / 1000;
    case 'tsp':
      return ml / std.tspMl;
    case 'tbsp':
      return ml / std.tbspMl;
    case 'cup':
      return ml / std.cupMl;
    case 'fl_oz':
      return ml / 29.5735295625;
    case 'pt':
      return ml / 473.176473;
    case 'qt':
      return ml / 946.352946;
    case 'gal':
      return ml / 3785.411784;
    default:
      throw new Error(`Unit ${unit} is not a volume unit.`);
  }
}

export interface IngredientConversionInput {
  ingredientQuery: string;
  quantityInput: string | number;
  fromUnit: RecipeUnitId;
  toUnit: RecipeUnitId;
  scalingFactor?: number;
  standardId?: MeasurementStandardId;
  /** Optional user-supplied weight in grams per 1 cup (in the selected standard) when ingredient is unverified */
  customGramsPerCup?: string | number;
}

export type ConversionStatus =
  | 'ok'
  | 'invalid_input'
  | 'needs_custom_density';

export interface IngredientConversionResult {
  status: ConversionStatus;
  parsedQuantity: number | null;
  scaledFromQuantity: number | null;
  convertedQuantity: number | null;
  fromUnit: RecipeUnitId;
  toUnit: RecipeUnitId;
  verifiedIngredient: VerifiedIngredientReference | null;
  densitySource: 'not_needed' | 'verified' | 'user_custom' | 'missing';
  effectiveGramsPerCup: number | null;
  statusMessage: string;
  formulaNote: string;
}

/**
 * Converts and scales a single recipe ingredient line item.
 * Never uses a single universal density for volume-to-mass conversions.
 */
export function convertRecipeIngredient(
  input: IngredientConversionInput
): IngredientConversionResult {
  const standardId = input.standardId ?? 'us_customary';
  const standard = MEASUREMENT_STANDARDS[standardId];
  const scalingFactor = input.scalingFactor ?? 1;

  if (!Number.isFinite(scalingFactor) || scalingFactor <= 0) {
    return {
      status: 'invalid_input',
      parsedQuantity: null,
      scaledFromQuantity: null,
      convertedQuantity: null,
      fromUnit: input.fromUnit,
      toUnit: input.toUnit,
      verifiedIngredient: null,
      densitySource: 'missing',
      effectiveGramsPerCup: null,
      statusMessage: 'Scaling factor must be a positive number.',
      formulaNote: '',
    };
  }

  const parsed = parseRecipeQuantity(input.quantityInput);
  if (!parsed.isValid || parsed.value === null) {
    return {
      status: 'invalid_input',
      parsedQuantity: null,
      scaledFromQuantity: null,
      convertedQuantity: null,
      fromUnit: input.fromUnit,
      toUnit: input.toUnit,
      verifiedIngredient: resolveVerifiedIngredient(input.ingredientQuery),
      densitySource: 'missing',
      effectiveGramsPerCup: null,
      statusMessage: parsed.error || 'Enter a valid positive quantity.',
      formulaNote: '',
    };
  }

  const scaledFromQuantity = parsed.value * scalingFactor;
  const fromSpec = RECIPE_UNITS[input.fromUnit];
  const toSpec = RECIPE_UNITS[input.toUnit];
  const verified = resolveVerifiedIngredient(input.ingredientQuery);

  // Case 1: Same dimension (Mass -> Mass OR Volume -> Volume)
  if (fromSpec.dimension === toSpec.dimension) {
    let converted = scaledFromQuantity;
    if (fromSpec.dimension === 'mass') {
      const grams = unitToGrams(scaledFromQuantity, input.fromUnit);
      converted = gramsToUnit(grams, input.toUnit);
    } else {
      const ml = unitToMillilitres(scaledFromQuantity, input.fromUnit, standardId);
      converted = millilitresToUnit(ml, input.toUnit, standardId);
    }

    return {
      status: 'ok',
      parsedQuantity: parsed.value,
      scaledFromQuantity,
      convertedQuantity: converted,
      fromUnit: input.fromUnit,
      toUnit: input.toUnit,
      verifiedIngredient: verified,
      densitySource: 'not_needed',
      effectiveGramsPerCup: verified
        ? verified.gramsPerMl * standard.cupMl
        : null,
      statusMessage:
        fromSpec.dimension === 'mass'
          ? 'Direct mass-to-mass conversion'
          : `Direct volume-to-volume conversion (${standard.shortLabel})`,
      formulaNote: `${formatRecipeNumber(parsed.value)} × ${formatRecipeNumber(
        scalingFactor
      )} scale = ${formatRecipeNumber(scaledFromQuantity)} ${fromSpec.shortLabel} → ${formatRecipeNumber(
        converted
      )} ${toSpec.shortLabel}`,
    };
  }

  // Case 2: Cross-dimension (Volume <-> Mass) — requires ingredient-specific density
  let gramsPerMl: number | null = null;
  let densitySource: 'verified' | 'user_custom' | 'missing' = 'missing';
  let effectiveGramsPerCup: number | null = null;

  if (verified) {
    gramsPerMl = verified.gramsPerMl;
    densitySource = 'verified';
    effectiveGramsPerCup = verified.gramsPerMl * standard.cupMl;
  } else if (
    input.customGramsPerCup !== undefined &&
    input.customGramsPerCup !== ''
  ) {
    const customNum = Number(input.customGramsPerCup);
    if (Number.isFinite(customNum) && customNum > 0) {
      gramsPerMl = customNum / standard.cupMl;
      densitySource = 'user_custom';
      effectiveGramsPerCup = customNum;
    }
  }

  if (gramsPerMl === null || effectiveGramsPerCup === null) {
    return {
      status: 'needs_custom_density',
      parsedQuantity: parsed.value,
      scaledFromQuantity,
      convertedQuantity: null,
      fromUnit: input.fromUnit,
      toUnit: input.toUnit,
      verifiedIngredient: null,
      densitySource: 'missing',
      effectiveGramsPerCup: null,
      statusMessage:
        'Verified density unavailable for this ingredient. Select a verified ingredient or enter a custom grams-per-cup value.',
      formulaNote: `Scaled amount: ${formatRecipeNumber(scaledFromQuantity)} ${fromSpec.shortLabel} (awaiting ingredient density for ${fromSpec.dimension}-to-${toSpec.dimension} conversion)`,
    };
  }

  let convertedQuantity: number;
  if (fromSpec.dimension === 'volume' && toSpec.dimension === 'mass') {
    const ml = unitToMillilitres(scaledFromQuantity, input.fromUnit, standardId);
    const grams = ml * gramsPerMl;
    convertedQuantity = gramsToUnit(grams, input.toUnit);
  } else {
    const grams = unitToGrams(scaledFromQuantity, input.fromUnit);
    const ml = grams / gramsPerMl;
    convertedQuantity = millilitresToUnit(ml, input.toUnit, standardId);
  }

  const refDisclosure =
    densitySource === 'verified' && verified
      ? `Verified reference: 1 US cup = ${verified.gramsPerUsCup} g (${verified.source})`
      : `User-supplied custom density: 1 ${standard.shortLabel} = ${formatRecipeNumber(
          effectiveGramsPerCup
        )} g (unverified user value)`;

  return {
    status: 'ok',
    parsedQuantity: parsed.value,
    scaledFromQuantity,
    convertedQuantity,
    fromUnit: input.fromUnit,
    toUnit: input.toUnit,
    verifiedIngredient: verified,
    densitySource,
    effectiveGramsPerCup,
    statusMessage: refDisclosure,
    formulaNote: `${formatRecipeNumber(scaledFromQuantity)} ${
      fromSpec.shortLabel
    } ↔ ${formatRecipeNumber(convertedQuantity)} ${
      toSpec.shortLabel
    } @ ${formatRecipeNumber(effectiveGramsPerCup)} g/${standard.shortLabel}`,
  };
}

/**
 * Formats recipe quantities cleanly with up to 2 decimal places (or 3 for small values).
 */
export function formatRecipeNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  if (Math.abs(value) >= 100) {
    return Number(value.toFixed(1)).toString();
  }
  if (Math.abs(value) >= 1) {
    return Number(value.toFixed(2)).toString();
  }
  return Number(value.toFixed(3)).toString();
}
