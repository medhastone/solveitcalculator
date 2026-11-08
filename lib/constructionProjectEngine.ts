/**
 * Pure calculation engine for the Construction Project Calculator workflow:
 * Stage 1: Measurements -> Stage 2: Quantity -> Stage 3: Waste Allowance -> Stage 4: Estimated Cost
 *
 * Non-negotiable engineering rules:
 * - Never use eval() or new Function().
 * - Normalize all dimensions to a common base unit before calculating area or volume.
 * - Support switching measurement systems (Imperial <-> Metric) and individual units while preserving physical meaning.
 * - Support Feet + Inches compound inputs and fractional inputs (e.g., "10 1/2", "3/4").
 * - Never invent a universal product yield or default material price; require user input for package yield and price.
 */

export type ConstructionShapeType =
  | 'rectangular-area'
  | 'concrete-slab'
  | 'cylindrical-holes';

export type MeasurementSystem = 'imperial' | 'metric';

export type LinearUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm' | 'mm';
export type AreaUnit = 'sqft' | 'sqm' | 'sqyd';
export type VolumeUnit = 'cuyd' | 'cuft' | 'cum' | 'liters';
export type QuantityKind = 'area' | 'volume';

export type CostPricingMode = 'package' | 'unit';

export interface FeetInchesInput {
  feet: string;
  inches: string;
}

export interface ConstructionProjectInputs {
  shape: ConstructionShapeType;
  system: MeasurementSystem;
  useFeetInches: boolean;

  // Rectangular area & Concrete slab
  length: string;
  lengthUnit: LinearUnit;
  lengthFtIn?: FeetInchesInput;

  width: string;
  widthUnit: LinearUnit;
  widthFtIn?: FeetInchesInput;

  // Concrete slab thickness
  thickness: string;
  thicknessUnit: LinearUnit;

  // Cylindrical post holes
  diameter: string;
  diameterUnit: LinearUnit;
  depth: string;
  depthUnit: LinearUnit;
   depthFtIn?: FeetInchesInput;
  numberOfHoles: string;

  // Stage 3: Waste allowance (%)
  wastePercent: string;

  // Stage 4: Optional coverage/yield & price
  pricingMode: CostPricingMode;
  /** Coverage per package (for area) or Yield per bag/container (for volume). Empty string if not provided. */
  packageYield: string;
  packageYieldUnit: AreaUnit | VolumeUnit;
  /** Price per package/bag OR price per unit of area/volume. Empty string if not provided. */
  unitOrPackagePrice: string;
  priceUnit: AreaUnit | VolumeUnit;
}

export interface NormalizedDimensions {
  lengthMeters?: number;
  lengthFeet?: number;
  widthMeters?: number;
  widthFeet?: number;
  thicknessMeters?: number;
  thicknessFeet?: number;
  diameterMeters?: number;
  diameterFeet?: number;
  depthMeters?: number;
  depthFeet?: number;
  numberOfHoles?: number;
}

export interface AreaQuantities {
  sqft: number;
  sqm: number;
  sqyd: number;
}

export interface VolumeQuantities {
  cuft: number;
  cuyd: number;
  cum: number;
  liters: number;
}

export interface ConstructionCalculationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: Partial<Record<string, string>>;
  shape: ConstructionShapeType;
  quantityKind: QuantityKind;
  normalized: NormalizedDimensions;
  formulaText: string;
  formulaSubstitutionText: string;

  // Stage 2: Base quantity
  baseArea?: AreaQuantities;
  baseVolume?: VolumeQuantities;
  singleHoleVolume?: VolumeQuantities;
  slabSurfaceArea?: AreaQuantities;

  // Stage 3: Waste-adjusted quantity
  wastePercent: number;
  wasteAmountPrimary: number;
  adjustedArea?: AreaQuantities;
  adjustedVolume?: VolumeQuantities;

  // Primary display values based on selected system
  primaryUnit: AreaUnit | VolumeUnit;
  primaryUnitLabel: string;
  basePrimaryValue: number;
  adjustedPrimaryValue: number;

  // Stage 4: Package count & Estimated cost
  pricingMode: CostPricingMode;
  hasYieldInput: boolean;
  hasPriceInput: boolean;
  packageYieldValue: number | null;
  packageYieldUnit: AreaUnit | VolumeUnit;
  packageCount: number | null;
  totalPurchasedQuantityInYieldUnit: number | null;
  surplusFromPackageRoundingInYieldUnit: number | null;
  enteredPriceValue: number | null;
  estimatedTotalCost: number | null;
  missingCostPrompts: string[];

  // Explicit assumptions & disclosures
  isEstimate: boolean;
  assumptions: string[];
}

export const MAX_DIMENSION_METERS = 10000; // 10 km safety ceiling for building projects
export const MAX_HOLES_COUNT = 10000;
export const MAX_WASTE_PERCENT = 100;

const METERS_PER_UNIT: Record<LinearUnit, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
  yd: 0.9144,
};

export const LINEAR_UNIT_LABELS: Record<LinearUnit, string> = {
  ft: 'feet (ft)',
  in: 'inches (in)',
  yd: 'yards (yd)',
  m: 'meters (m)',
  cm: 'centimeters (cm)',
  mm: 'millimeters (mm)',
};

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  sqft: 'sq ft (ft²)',
  sqm: 'sq m (m²)',
  sqyd: 'sq yd (yd²)',
};

export const VOLUME_UNIT_LABELS: Record<VolumeUnit, string> = {
  cuyd: 'cubic yards (yd³)',
  cuft: 'cubic feet (ft³)',
  cum: 'cubic meters (m³)',
  liters: 'liters (L)',
};

/**
 * Safely parses a positive or zero numeric string, supporting decimals and simple fractions
 * such as "10.5", "10 1/2", or "3/4". Never uses eval().
 */
export function parseDimensionString(raw: string): number {
  if (typeof raw !== 'string') return NaN;
  const trimmed = raw.trim().replace(/,/g, '');
  if (!trimmed) return NaN;

  // Mixed fraction e.g. "10 1/2" or "-10 1/2"
  const mixedMatch = /^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(trimmed);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const num = Number(mixedMatch[2]);
    const den = Number(mixedMatch[3]);
    if (den === 0 || !Number.isFinite(whole) || !Number.isFinite(num) || !Number.isFinite(den)) {
      return NaN;
    }
    const sign = whole < 0 || trimmed.startsWith('-') ? -1 : 1;
    return sign * (Math.abs(whole) + num / den);
  }

  // Simple fraction e.g. "3/4"
  const fractionMatch = /^([+-]?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(trimmed);
  if (fractionMatch) {
    const num = Number(fractionMatch[1]);
    const den = Number(fractionMatch[2]);
    if (den === 0 || !Number.isFinite(num) || !Number.isFinite(den)) {
      return NaN;
    }
    return num / den;
  }

  // Standard decimal or integer
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) {
    return NaN;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : NaN;
}

/**
 * Normalizes a Feet + Inches compound input into total feet, total meters,
 * and normalized whole feet + remaining inches (so e.g. 5 ft 18 in -> 6 ft 6 in = 6.5 ft).
 */
export function parseAndNormalizeFeetInches(ftIn: FeetInchesInput): {
  isValid: boolean;
  error?: string;
  totalFeet: number;
  totalMeters: number;
  normalizedFeet: number;
  normalizedInches: number;
} {
  const rawFeetStr = (ftIn.feet ?? '').trim();
  const rawInchesStr = (ftIn.inches ?? '').trim();

  const feetVal = rawFeetStr === '' ? 0 : parseDimensionString(rawFeetStr);
  const inchesVal = rawInchesStr === '' ? 0 : parseDimensionString(rawInchesStr);

  if (Number.isNaN(feetVal) || Number.isNaN(inchesVal)) {
    return {
      isValid: false,
      error: 'Enter valid numbers or fractions for feet and inches.',
      totalFeet: 0,
      totalMeters: 0,
      normalizedFeet: 0,
      normalizedInches: 0,
    };
  }

  if (feetVal < 0 || inchesVal < 0) {
    return {
      isValid: false,
      error: 'Feet and inches cannot be negative.',
      totalFeet: 0,
      totalMeters: 0,
      normalizedFeet: 0,
      normalizedInches: 0,
    };
  }

  const totalInches = feetVal * 12 + inchesVal;
  if (totalInches <= 0) {
    return {
      isValid: false,
      error: 'Combined feet and inches must be greater than zero.',
      totalFeet: 0,
      totalMeters: 0,
      normalizedFeet: 0,
      normalizedInches: 0,
    };
  }

  const totalFeet = totalInches / 12;
  const totalMeters = totalFeet * METERS_PER_UNIT.ft;
  const normalizedFeet = Math.floor(totalInches / 12);
  const normalizedInches = Number((totalInches - normalizedFeet * 12).toFixed(4));

  return {
    isValid: true,
    totalFeet,
    totalMeters,
    normalizedFeet,
    normalizedInches,
  };
}

/**
 * Converts a linear value from one unit to another while preserving physical meaning.
 */
export function convertLinearValue(
  value: number,
  fromUnit: LinearUnit,
  toUnit: LinearUnit
): number {
  if (!Number.isFinite(value)) return NaN;
  if (fromUnit === toUnit) return value;
  const meters = value * METERS_PER_UNIT[fromUnit];
  return meters / METERS_PER_UNIT[toUnit];
}

/**
 * Formats a converted dimension string cleanly so switching units doesn't produce ugly floating-point noise.
 */
export function formatConvertedDimension(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '';
  const rounded4 = Number(value.toFixed(4));
  return String(rounded4);
}

/**
 * Converts a full set of inputs between Imperial and Metric systems without changing
 * the physical meaning of the user's entered measurements.
 */
export function switchMeasurementSystemPreservingDimensions(
  inputs: ConstructionProjectInputs,
  targetSystem: MeasurementSystem
): ConstructionProjectInputs {
  if (inputs.system === targetSystem) return inputs;

  const convertField = (
    rawVal: string,
    currentUnit: LinearUnit,
    targetUnit: LinearUnit,
    ftIn?: FeetInchesInput
  ): { value: string; unit: LinearUnit; ftIn: FeetInchesInput } => {
    let meters = NaN;
    if (inputs.useFeetInches && ftIn && (currentUnit === 'ft' || currentUnit === 'in')) {
      const parsed = parseAndNormalizeFeetInches(ftIn);
      if (parsed.isValid) {
        meters = parsed.totalMeters;
      }
    } else {
      const num = parseDimensionString(rawVal);
      if (!Number.isNaN(num) && num > 0) {
        meters = num * METERS_PER_UNIT[currentUnit];
      }
    }

    if (Number.isNaN(meters) || meters <= 0) {
      return {
        value: rawVal,
        unit: targetUnit,
        ftIn: ftIn ?? { feet: '', inches: '0' },
      };
    }

    const convertedVal = meters / METERS_PER_UNIT[targetUnit];
    const totalInches = meters / METERS_PER_UNIT.in;
    const wholeFeet = Math.floor(totalInches / 12);
    const remInches = Number((totalInches - wholeFeet * 12).toFixed(2));

    return {
      value: formatConvertedDimension(convertedVal),
      unit: targetUnit,
      ftIn: {
        feet: String(wholeFeet),
        inches: String(remInches),
      },
    };
  };

  if (targetSystem === 'metric') {
    const nextLength = convertField(inputs.length, inputs.lengthUnit, 'm', inputs.lengthFtIn);
    const nextWidth = convertField(inputs.width, inputs.widthUnit, 'm', inputs.widthFtIn);
    const nextThickness = convertField(inputs.thickness, inputs.thicknessUnit, 'cm');
    const nextDiameter = convertField(inputs.diameter, inputs.diameterUnit, 'cm');
    const nextDepth = convertField(inputs.depth, inputs.depthUnit, 'm', inputs.depthFtIn);

    const isArea = inputs.shape === 'rectangular-area';
    return {
      ...inputs,
      system: 'metric',
      useFeetInches: false,
      length: nextLength.value,
      lengthUnit: nextLength.unit,
      lengthFtIn: nextLength.ftIn,
      width: nextWidth.value,
      widthUnit: nextWidth.unit,
      widthFtIn: nextWidth.ftIn,
      thickness: nextThickness.value,
      thicknessUnit: nextThickness.unit,
      diameter: nextDiameter.value,
      diameterUnit: nextDiameter.unit,
      depth: nextDepth.value,
      depthUnit: nextDepth.unit,
      depthFtIn: nextDepth.ftIn,
      packageYieldUnit: isArea ? 'sqm' : 'cum',
      priceUnit: isArea ? 'sqm' : 'cum',
    };
  } else {
    const nextLength = convertField(inputs.length, inputs.lengthUnit, 'ft', inputs.lengthFtIn);
    const nextWidth = convertField(inputs.width, inputs.widthUnit, 'ft', inputs.widthFtIn);
    const nextThickness = convertField(inputs.thickness, inputs.thicknessUnit, 'in');
    const nextDiameter = convertField(inputs.diameter, inputs.diameterUnit, 'in');
    const nextDepth = convertField(inputs.depth, inputs.depthUnit, 'ft', inputs.depthFtIn);

    const isArea = inputs.shape === 'rectangular-area';
    return {
      ...inputs,
      system: 'imperial',
      length: nextLength.value,
      lengthUnit: nextLength.unit,
      lengthFtIn: nextLength.ftIn,
      width: nextWidth.value,
      widthUnit: nextWidth.unit,
      widthFtIn: nextWidth.ftIn,
      thickness: nextThickness.value,
      thicknessUnit: nextThickness.unit,
      diameter: nextDiameter.value,
      diameterUnit: nextDiameter.unit,
      depth: nextDepth.value,
      depthUnit: nextDepth.unit,
      depthFtIn: nextDepth.ftIn,
      packageYieldUnit: isArea ? 'sqft' : 'cuft',
      priceUnit: isArea ? 'sqft' : 'cuyd',
    };
  }
}

export function computeAreaQuantitiesFromSquareMeters(sqm: number): AreaQuantities {
  const sqft = sqm / (0.3048 * 0.3048);
  const sqyd = sqft / 9;
  return {
    sqft,
    sqm,
    sqyd,
  };
}

export function computeVolumeQuantitiesFromCubicMeters(cum: number): VolumeQuantities {
  const cuft = cum / Math.pow(0.3048, 3);
  const cuyd = cuft / 27;
  const liters = cum * 1000;
  return {
    cuft,
    cuyd,
    cum,
    liters,
  };
}

export function getAreaInUnit(area: AreaQuantities, unit: AreaUnit): number {
  switch (unit) {
    case 'sqft':
      return area.sqft;
    case 'sqm':
      return area.sqm;
    case 'sqyd':
      return area.sqyd;
  }
}

export function getVolumeInUnit(volume: VolumeQuantities, unit: VolumeUnit): number {
  switch (unit) {
    case 'cuyd':
      return volume.cuyd;
    case 'cuft':
      return volume.cuft;
    case 'cum':
      return volume.cum;
    case 'liters':
      return volume.liters;
  }
}

/**
 * Main calculation function for the 4-stage Construction Project Calculator workflow.
 */
export function calculateConstructionProject(
  inputs: ConstructionProjectInputs
): ConstructionCalculationResult {
  const errors: string[] = [];
  const fieldErrors: Partial<Record<string, string>> = {};
  const normalized: NormalizedDimensions = {};
  const quantityKind: QuantityKind =
    inputs.shape === 'rectangular-area' ? 'area' : 'volume';

  const parseLinearDimension = (
    fieldKey: string,
    label: string,
    rawVal: string,
    unit: LinearUnit,
    useFtIn?: boolean,
    ftIn?: FeetInchesInput
  ): { meters: number; feet: number; valid: boolean } => {
    if (useFtIn && ftIn) {
      const parsed = parseAndNormalizeFeetInches(ftIn);
      if (!parsed.isValid) {
        const msg = `${label}: ${parsed.error}`;
        errors.push(msg);
        fieldErrors[fieldKey] = parsed.error;
        return { meters: 0, feet: 0, valid: false };
      }
      if (parsed.totalMeters > MAX_DIMENSION_METERS) {
        const msg = `${label} exceeds the maximum supported project dimension (${MAX_DIMENSION_METERS.toLocaleString()} m).`;
        errors.push(msg);
        fieldErrors[fieldKey] = msg;
        return { meters: 0, feet: 0, valid: false };
      }
      return {
        meters: parsed.totalMeters,
        feet: parsed.totalFeet,
        valid: true,
      };
    }

    const val = parseDimensionString(rawVal);
    if (Number.isNaN(val)) {
      const msg = `Please enter a valid number for ${label.toLowerCase()}.`;
      errors.push(msg);
      fieldErrors[fieldKey] = msg;
      return { meters: 0, feet: 0, valid: false };
    }
    if (val <= 0) {
      const msg = `${label} must be greater than zero.`;
      errors.push(msg);
      fieldErrors[fieldKey] = msg;
      return { meters: 0, feet: 0, valid: false };
    }

    const meters = val * METERS_PER_UNIT[unit];
    if (meters > MAX_DIMENSION_METERS) {
      const msg = `${label} is unreasonably large (maximum ${MAX_DIMENSION_METERS.toLocaleString()} meters).`;
      errors.push(msg);
      fieldErrors[fieldKey] = msg;
      return { meters: 0, feet: 0, valid: false };
    }
    const feet = meters / METERS_PER_UNIT.ft;
    return { meters, feet, valid: true };
  };

  let baseArea: AreaQuantities | undefined;
  let baseVolume: VolumeQuantities | undefined;
  let singleHoleVolume: VolumeQuantities | undefined;
  let slabSurfaceArea: AreaQuantities | undefined;
  let formulaText = '';
  let formulaSubstitutionText = '';

  if (inputs.shape === 'rectangular-area') {
    formulaText = 'Area = Length × Width';
    const len = parseLinearDimension(
      'length',
      'Length',
      inputs.length,
      inputs.lengthUnit,
      inputs.system === 'imperial' && inputs.useFeetInches,
      inputs.lengthFtIn
    );
    const wid = parseLinearDimension(
      'width',
      'Width',
      inputs.width,
      inputs.widthUnit,
      inputs.system === 'imperial' && inputs.useFeetInches,
      inputs.widthFtIn
    );

    if (len.valid && wid.valid) {
      normalized.lengthMeters = len.meters;
      normalized.lengthFeet = len.feet;
      normalized.widthMeters = wid.meters;
      normalized.widthFeet = wid.feet;

      const areaSqm = len.meters * wid.meters;
      baseArea = computeAreaQuantitiesFromSquareMeters(areaSqm);

      if (inputs.system === 'imperial') {
        formulaSubstitutionText = `${len.feet.toFixed(2)} ft × ${wid.feet.toFixed(2)} ft = ${baseArea.sqft.toFixed(2)} sq ft`;
      } else {
        formulaSubstitutionText = `${len.meters.toFixed(2)} m × ${wid.meters.toFixed(2)} m = ${baseArea.sqm.toFixed(2)} sq m`;
      }
    }
  } else if (inputs.shape === 'concrete-slab') {
    formulaText = 'Volume = Length × Width × Thickness';
    const len = parseLinearDimension(
      'length',
      'Slab Length',
      inputs.length,
      inputs.lengthUnit,
      inputs.system === 'imperial' && inputs.useFeetInches,
      inputs.lengthFtIn
    );
    const wid = parseLinearDimension(
      'width',
      'Slab Width',
      inputs.width,
      inputs.widthUnit,
      inputs.system === 'imperial' && inputs.useFeetInches,
      inputs.widthFtIn
    );
    const thk = parseLinearDimension(
      'thickness',
      'Slab Thickness',
      inputs.thickness,
      inputs.thicknessUnit,
      false
    );

    if (len.valid && wid.valid && thk.valid) {
      normalized.lengthMeters = len.meters;
      normalized.lengthFeet = len.feet;
      normalized.widthMeters = wid.meters;
      normalized.widthFeet = wid.feet;
      normalized.thicknessMeters = thk.meters;
      normalized.thicknessFeet = thk.feet;

      const volCum = len.meters * wid.meters * thk.meters;
      baseVolume = computeVolumeQuantitiesFromCubicMeters(volCum);
      slabSurfaceArea = computeAreaQuantitiesFromSquareMeters(len.meters * wid.meters);

      if (inputs.system === 'imperial') {
        formulaSubstitutionText = `${len.feet.toFixed(2)} ft × ${wid.feet.toFixed(2)} ft × ${thk.feet.toFixed(3)} ft = ${baseVolume.cuft.toFixed(2)} cu ft (${baseVolume.cuyd.toFixed(2)} cu yd)`;
      } else {
        formulaSubstitutionText = `${len.meters.toFixed(2)} m × ${wid.meters.toFixed(2)} m × ${thk.meters.toFixed(3)} m = ${baseVolume.cum.toFixed(3)} cu m`;
      }
    }
  } else if (inputs.shape === 'cylindrical-holes') {
    formulaText = 'Volume = π × (Diameter ÷ 2)² × Depth × Number of Holes';
    const dia = parseLinearDimension(
      'diameter',
      'Hole Diameter',
      inputs.diameter,
      inputs.diameterUnit,
      false
    );
    const dep = parseLinearDimension(
      'depth',
      'Hole Depth',
      inputs.depth,
      inputs.depthUnit,
      inputs.system === 'imperial' && inputs.useFeetInches,
      inputs.depthFtIn
    );

    const rawHoles = parseDimensionString(inputs.numberOfHoles);
    let holesValid = false;
    let holesCount = 0;
    if (Number.isNaN(rawHoles) || !Number.isInteger(rawHoles) || rawHoles <= 0) {
      const msg = 'Number of holes must be a positive whole number (1 or more).';
      errors.push(msg);
      fieldErrors.numberOfHoles = msg;
    } else if (rawHoles > MAX_HOLES_COUNT) {
      const msg = `Number of holes cannot exceed ${MAX_HOLES_COUNT.toLocaleString()}.`;
      errors.push(msg);
      fieldErrors.numberOfHoles = msg;
    } else {
      holesValid = true;
      holesCount = rawHoles;
      normalized.numberOfHoles = holesCount;
    }

    if (dia.valid && dep.valid && holesValid) {
      normalized.diameterMeters = dia.meters;
      normalized.diameterFeet = dia.feet;
      normalized.depthMeters = dep.meters;
      normalized.depthFeet = dep.feet;

      const radiusMeters = dia.meters / 2;
      const singleCum = Math.PI * radiusMeters * radiusMeters * dep.meters;
      const totalCum = singleCum * holesCount;

      singleHoleVolume = computeVolumeQuantitiesFromCubicMeters(singleCum);
      baseVolume = computeVolumeQuantitiesFromCubicMeters(totalCum);

      if (inputs.system === 'imperial') {
        const radiusFeet = dia.feet / 2;
        formulaSubstitutionText = `π × (${dia.feet.toFixed(2)} ft ÷ 2)² × ${dep.feet.toFixed(2)} ft × ${holesCount} = ${baseVolume.cuft.toFixed(2)} cu ft (${baseVolume.cuyd.toFixed(2)} cu yd)`;
        void radiusFeet;
      } else {
        formulaSubstitutionText = `π × (${dia.meters.toFixed(2)} m ÷ 2)² × ${dep.meters.toFixed(2)} m × ${holesCount} = ${baseVolume.cum.toFixed(3)} cu m`;
      }
    }
  }

  // Stage 3: Waste allowance validation
  const rawWaste = inputs.wastePercent.trim() === '' ? 0 : parseDimensionString(inputs.wastePercent);
  let wastePercent = 0;
  if (Number.isNaN(rawWaste) || rawWaste < 0 || rawWaste > MAX_WASTE_PERCENT) {
    const msg = `Waste allowance must be between 0% and ${MAX_WASTE_PERCENT}%.`;
    errors.push(msg);
    fieldErrors.wastePercent = msg;
  } else {
    wastePercent = rawWaste;
  }

  const wasteMultiplier = 1 + wastePercent / 100;

  let adjustedArea: AreaQuantities | undefined;
  let adjustedVolume: VolumeQuantities | undefined;

  if (baseArea) {
    adjustedArea = computeAreaQuantitiesFromSquareMeters(baseArea.sqm * wasteMultiplier);
  }
  if (baseVolume) {
    adjustedVolume = computeVolumeQuantitiesFromCubicMeters(baseVolume.cum * wasteMultiplier);
  }

  // Determine primary unit & values for display
  let primaryUnit: AreaUnit | VolumeUnit;
  let primaryUnitLabel: string;
  let basePrimaryValue = 0;
  let adjustedPrimaryValue = 0;

  if (quantityKind === 'area') {
    primaryUnit = inputs.system === 'imperial' ? 'sqft' : 'sqm';
    primaryUnitLabel = AREA_UNIT_LABELS[primaryUnit];
    if (baseArea && adjustedArea) {
      basePrimaryValue = getAreaInUnit(baseArea, primaryUnit);
      adjustedPrimaryValue = getAreaInUnit(adjustedArea, primaryUnit);
    }
  } else {
    primaryUnit = inputs.system === 'imperial' ? 'cuyd' : 'cum';
    primaryUnitLabel = VOLUME_UNIT_LABELS[primaryUnit];
    if (baseVolume && adjustedVolume) {
      basePrimaryValue = getVolumeInUnit(baseVolume, primaryUnit);
      adjustedPrimaryValue = getVolumeInUnit(adjustedVolume, primaryUnit);
    }
  }

  const wasteAmountPrimary = Math.max(0, adjustedPrimaryValue - basePrimaryValue);

  // Stage 4: Package/Bag Yield & Cost Estimation
  const rawYieldStr = inputs.packageYield.trim();
  const rawPriceStr = inputs.unitOrPackagePrice.trim();

  let hasYieldInput = false;
  let packageYieldValue: number | null = null;
  if (rawYieldStr !== '') {
    const parsedYield = parseDimensionString(rawYieldStr);
    if (Number.isNaN(parsedYield) || parsedYield <= 0) {
      const msg =
        quantityKind === 'area'
          ? 'Coverage per package must be a number greater than zero.'
          : 'Yield per bag/container must be a number greater than zero.';
      errors.push(msg);
      fieldErrors.packageYield = msg;
    } else {
      hasYieldInput = true;
      packageYieldValue = parsedYield;
    }
  }

  let hasPriceInput = false;
  let enteredPriceValue: number | null = null;
  if (rawPriceStr !== '') {
    const parsedPrice = parseDimensionString(rawPriceStr);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      const msg = 'Price must be zero or a positive number.';
      errors.push(msg);
      fieldErrors.unitOrPackagePrice = msg;
    } else {
      hasPriceInput = true;
      enteredPriceValue = parsedPrice;
    }
  }

  const isValid = errors.length === 0 && (Boolean(baseArea) || Boolean(baseVolume));

  let packageCount: number | null = null;
  let totalPurchasedQuantityInYieldUnit: number | null = null;
  let surplusFromPackageRoundingInYieldUnit: number | null = null;
  let estimatedTotalCost: number | null = null;
  const missingCostPrompts: string[] = [];

  if (isValid) {
    if (inputs.pricingMode === 'package') {
      if (hasYieldInput && packageYieldValue !== null) {
        const adjustedInYieldUnit =
          quantityKind === 'area' && adjustedArea
            ? getAreaInUnit(adjustedArea, inputs.packageYieldUnit as AreaUnit)
            : adjustedVolume
              ? getVolumeInUnit(adjustedVolume, inputs.packageYieldUnit as VolumeUnit)
              : 0;

        packageCount = Math.ceil(adjustedInYieldUnit / packageYieldValue);
        totalPurchasedQuantityInYieldUnit = packageCount * packageYieldValue;
        surplusFromPackageRoundingInYieldUnit =
          totalPurchasedQuantityInYieldUnit - adjustedInYieldUnit;

        if (hasPriceInput && enteredPriceValue !== null) {
          estimatedTotalCost = packageCount * enteredPriceValue;
        } else {
          missingCostPrompts.push(
            quantityKind === 'area'
              ? 'Enter the price per package/box to calculate your estimated total cost.'
              : 'Enter the price per bag/container to calculate your estimated total cost.'
          );
        }
      } else {
        missingCostPrompts.push(
          quantityKind === 'area'
            ? 'Enter the coverage per package/box from your product label to calculate how many packages to buy.'
            : 'Enter the yield per bag/container from your concrete mix label (for example, in cu ft, cu m, or liters) to calculate the number of bags needed.'
        );
        if (!hasPriceInput) {
          missingCostPrompts.push(
            quantityKind === 'area'
              ? 'Enter the price per package/box to estimate total material cost.'
              : 'Enter the price per bag/container to estimate total material cost.'
          );
        }
      }
    } else {
      // Direct price per unit area or volume (e.g., ready-mix concrete per cubic yard or flooring per sq ft)
      if (hasPriceInput && enteredPriceValue !== null) {
        const adjustedInPriceUnit =
          quantityKind === 'area' && adjustedArea
            ? getAreaInUnit(adjustedArea, inputs.priceUnit as AreaUnit)
            : adjustedVolume
              ? getVolumeInUnit(adjustedVolume, inputs.priceUnit as VolumeUnit)
              : 0;
        estimatedTotalCost = adjustedInPriceUnit * enteredPriceValue;
      } else {
        const unitLabel =
          quantityKind === 'area'
            ? AREA_UNIT_LABELS[inputs.priceUnit as AreaUnit]
            : VOLUME_UNIT_LABELS[inputs.priceUnit as VolumeUnit];
        missingCostPrompts.push(
          `Enter your supplier's unit price per ${unitLabel} to calculate an estimated total cost.`
        );
      }
    }
  }

  // Build explicit assumptions list
  const assumptions: string[] = [];
  if (isValid) {
    assumptions.push(`Formula applied: ${formulaText} (${formulaSubstitutionText}).`);
    assumptions.push(
      'All measurements were normalized to standard base units (meters and feet) prior to computing quantities.'
    );
    if (wastePercent > 0) {
      assumptions.push(
        `Includes a user-selected ${wastePercent}% waste allowance (Adjusted Quantity = Base Quantity × ${(
          1 +
          wastePercent / 100
        ).toFixed(4)}). Waste allowance is an adjustable planning estimate, not a universal construction standard.`
      );
    } else {
      assumptions.push(
        'Waste allowance is set to 0% (net exact geometric quantity only, with no buffer for cuts, spillage, or subgrade unevenness).'
      );
    }

    if (inputs.pricingMode === 'package' && packageCount !== null && packageYieldValue !== null) {
      const yieldUnitLabel =
        quantityKind === 'area'
          ? AREA_UNIT_LABELS[inputs.packageYieldUnit as AreaUnit]
          : VOLUME_UNIT_LABELS[inputs.packageYieldUnit as VolumeUnit];
      assumptions.push(
        `Package/bag count is rounded up to the next whole unit using Math.ceil(Adjusted Quantity ÷ ${packageYieldValue} ${yieldUnitLabel} per unit) = ${packageCount} units.`
      );
    }

    if (estimatedTotalCost !== null && enteredPriceValue !== null) {
      if (inputs.pricingMode === 'package' && packageCount !== null) {
        assumptions.push(
          `Estimated material cost is based on purchasing ${packageCount} whole packages/bags at your entered price of ${enteredPriceValue.toFixed(
            2
          )} each (excludes delivery, taxes, tools, and labor).`
        );
      } else {
        const priceUnitLabel =
          quantityKind === 'area'
            ? AREA_UNIT_LABELS[inputs.priceUnit as AreaUnit]
            : VOLUME_UNIT_LABELS[inputs.priceUnit as VolumeUnit];
        assumptions.push(
          `Estimated material cost is based on the waste-adjusted quantity multiplied by your entered rate of ${enteredPriceValue.toFixed(
            2
          )} per ${priceUnitLabel} (excludes delivery, minimum-load fees, taxes, and labor).`
        );
      }
    }
  }

  const isEstimate =
    wastePercent > 0 || hasYieldInput || hasPriceInput;

  return {
    isValid,
    errors,
    fieldErrors,
    shape: inputs.shape,
    quantityKind,
    normalized,
    formulaText,
    formulaSubstitutionText,
    baseArea,
    baseVolume,
    singleHoleVolume,
    slabSurfaceArea,
    wastePercent,
    wasteAmountPrimary,
    adjustedArea,
    adjustedVolume,
    primaryUnit,
    primaryUnitLabel,
    basePrimaryValue,
    adjustedPrimaryValue,
    pricingMode: inputs.pricingMode,
    hasYieldInput,
    hasPriceInput,
    packageYieldValue,
    packageYieldUnit: inputs.packageYieldUnit,
    packageCount,
    totalPurchasedQuantityInYieldUnit,
    surplusFromPackageRoundingInYieldUnit,
    enteredPriceValue,
    estimatedTotalCost,
    missingCostPrompts,
    isEstimate,
    assumptions,
  };
}
