import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDimensionString,
  parseAndNormalizeFeetInches,
  convertLinearValue,
  switchMeasurementSystemPreservingDimensions,
  calculateConstructionProject,
  type ConstructionProjectInputs,
} from './constructionProjectEngine.ts';

function createDefaultInputs(
  overrides: Partial<ConstructionProjectInputs> = {}
): ConstructionProjectInputs {
  return {
    shape: 'rectangular-area',
    system: 'imperial',
    useFeetInches: false,
    length: '12',
    lengthUnit: 'ft',
    lengthFtIn: { feet: '12', inches: '0' },
    width: '10',
    widthUnit: 'ft',
    widthFtIn: { feet: '10', inches: '0' },
    thickness: '4',
    thicknessUnit: 'in',
    diameter: '12',
    diameterUnit: 'in',
    depth: '3',
    depthUnit: 'ft',
    depthFtIn: { feet: '3', inches: '0' },
    numberOfHoles: '1',
    wastePercent: '10',
    pricingMode: 'package',
    packageYield: '',
    packageYieldUnit: 'sqft',
    unitOrPackagePrice: '',
    priceUnit: 'sqft',
    ...overrides,
  };
}

describe('constructionProjectEngine — Dimension Parsing & Normalization', () => {
  it('parses decimal, integer, and fractional dimensions accurately', () => {
    assert.equal(parseDimensionString('12.5'), 12.5);
    assert.equal(parseDimensionString('10 1/2'), 10.5);
    assert.equal(parseDimensionString('3/4'), 0.75);
    assert.equal(parseDimensionString('1,250.5'), 1250.5);
    assert.ok(Number.isNaN(parseDimensionString('')));
    assert.ok(Number.isNaN(parseDimensionString('abc')));
    assert.ok(Number.isNaN(parseDimensionString('5 / 0')));
  });

  it('normalizes Feet + Inches inputs including inches >= 12 and fractional inches', () => {
    const res1 = parseAndNormalizeFeetInches({ feet: '10', inches: '6' });
    assert.equal(res1.isValid, true);
    assert.equal(res1.totalFeet, 10.5);
    assert.equal(res1.normalizedFeet, 10);
    assert.equal(res1.normalizedInches, 6);

    // 5 ft 18 in -> 6 ft 6 in = 6.5 ft
    const res2 = parseAndNormalizeFeetInches({ feet: '5', inches: '18' });
    assert.equal(res2.isValid, true);
    assert.equal(res2.totalFeet, 6.5);
    assert.equal(res2.normalizedFeet, 6);
    assert.equal(res2.normalizedInches, 6);

    // Fractional inches: 8 ft 4 1/2 in -> 8.375 ft
    const res3 = parseAndNormalizeFeetInches({ feet: '8', inches: '4 1/2' });
    assert.equal(res3.isValid, true);
    assert.equal(res3.totalFeet, 8.375);
  });

  it('switches between Imperial and Metric systems without changing physical meaning', () => {
    const imperialInputs = createDefaultInputs({
      shape: 'rectangular-area',
      system: 'imperial',
      length: '10',
      lengthUnit: 'ft',
      width: '20',
      widthUnit: 'ft',
      wastePercent: '10',
    });

    const imperialResult = calculateConstructionProject(imperialInputs);
    const metricInputs = switchMeasurementSystemPreservingDimensions(
      imperialInputs,
      'metric'
    );
    const metricResult = calculateConstructionProject(metricInputs);

    assert.equal(metricInputs.system, 'metric');
    assert.equal(metricInputs.lengthUnit, 'm');
    // 10 ft = 3.048 m, 20 ft = 6.096 m -> 200 sq ft = 18.580608 sq m
    assert.ok(Math.abs(imperialResult.baseArea!.sqft - 200) < 1e-3);
    assert.ok(Math.abs(metricResult.baseArea!.sqft - 200) < 1e-2);
    assert.ok(
      Math.abs(imperialResult.baseArea!.sqm - metricResult.baseArea!.sqm) < 1e-3
    );
  });

  it('converts linear units accurately', () => {
    assert.ok(Math.abs(convertLinearValue(1, 'yd', 'ft') - 3) < 1e-9);
    assert.ok(Math.abs(convertLinearValue(12, 'in', 'ft') - 1) < 1e-9);
    assert.ok(Math.abs(convertLinearValue(100, 'cm', 'm') - 1) < 1e-9);
    assert.ok(Math.abs(convertLinearValue(1000, 'mm', 'm') - 1) < 1e-9);
  });
});

describe('constructionProjectEngine — Stage 2, 3, 4 Calculations', () => {
  it('calculates rectangular area, waste allowance, package ceiling rounding, and total cost', () => {
    // 15 ft x 12 ft = 180 sq ft base
    // 10% waste = +18 sq ft -> 198 sq ft adjusted
    // Box coverage = 20 sq ft/box -> Math.ceil(198 / 20) = 10 boxes (200 sq ft purchased)
    // Price = $45.50/box -> $455.00 total
    const result = calculateConstructionProject(
      createDefaultInputs({
        shape: 'rectangular-area',
        system: 'imperial',
        length: '15',
        lengthUnit: 'ft',
        width: '12',
        widthUnit: 'ft',
        wastePercent: '10',
        pricingMode: 'package',
        packageYield: '20',
        packageYieldUnit: 'sqft',
        unitOrPackagePrice: '45.50',
      })
    );

    assert.equal(result.isValid, true);
    assert.ok(Math.abs(result.baseArea!.sqft - 180) < 1e-6);
    assert.ok(Math.abs(result. baseArea!.sqyd - 20) < 1e-6);
    assert.ok(Math.abs(result.adjustedArea!.sqft - 198) < 1e-6);
    assert.equal(result.packageCount, 10);
    assert.ok(Math.abs(result.totalPurchasedQuantityInYieldUnit! - 200) < 1e-6);
    assert.ok(Math.abs(result.surplusFromPackageRoundingInYieldUnit! - 2) < 1e-6);
    assert.ok(Math.abs(result.estimatedTotalCost! - 455) < 1e-6);
  });

  it('calculates rectangular concrete slab volume across mixed units (ft and in) and bag yield', () => {
    // 10 ft x 10 ft x 4 in slab:
    // 4 in = 1/3 ft -> Base Volume = 10 * 10 * (1/3) = 33.333333 cu ft = 1.234568 cu yd
    // 5% waste -> Adjusted Volume = 35.0 cu ft = 1.296296 cu yd
    // User enters 0.6 cu ft yield per bag -> Math.ceil(35.0 / 0.6) = Math.ceil(58.3333) = 59 bags
    // At $6.00 per bag -> 59 * 6 = $354.00
    const result = calculateConstructionProject(
      createDefaultInputs({
        shape: 'concrete-slab',
        system: 'imperial',
        length: '10',
        lengthUnit: 'ft',
        width: '10',
        widthUnit: 'ft',
        thickness: '4',
        thicknessUnit: 'in',
        wastePercent: '5',
        pricingMode: 'package',
        packageYield: '0.6',
        packageYieldUnit: 'cuft',
        unitOrPackagePrice: '6.00',
      })
    );

    assert.equal(result.isValid, true);
    assert.ok(Math.abs(result.baseVolume!.cuft - 100 / 3) < 1e-5);
    assert.ok(Math.abs(result.baseVolume!.cuyd - 100 / 81) < 1e-5);
    assert.ok(Math.abs(result.adjustedVolume!.cuft - 35) < 1e-5);
    assert.equal(result.packageCount, 59);
    assert.ok(Math.abs(result.estimatedTotalCost! - 354) < 1e-5);
  });

  it('calculates cylindrical post holes for single and multiple holes accurately', () => {
    // Diameter = 12 in (1 ft -> radius 0.5 ft)
    // Depth = 4 ft
    // Single hole volume = pi * (0.5)^2 * 4 = pi * 1 = 3.14159265 cu ft
    // Number of holes = 10 -> Total base volume = 10 * pi = 31.4159265 cu ft
    // 10% waste -> Adjusted volume = 11 * pi = 34.557519 cu ft
    const result = calculateConstructionProject(
      createDefaultInputs({
        shape: 'cylindrical-holes',
        system: 'imperial',
        diameter: '12',
        diameterUnit: 'in',
        depth: '4',
        depthUnit: 'ft',
        numberOfHoles: '10',
        wastePercent: '10',
        pricingMode: 'package',
        packageYield: '',
        packageYieldUnit: 'cuft',
        unitOrPackagePrice: '',
      })
    );

    assert.equal(result.isValid, true);
    assert.ok(Math.abs(result.singleHoleVolume!.cuft - Math.PI) < 1e-5);
    assert.ok(Math.abs(result.baseVolume!.cuft - 10 * Math.PI) < 1e-5);
    assert.ok(Math.abs(result.adjustedVolume!.cuft - 11 * Math.PI) < 1e-5);
    // Because yield and price were not entered, packageCount and estimatedTotalCost are null and prompts are returned
    assert.equal(result.packageCount, null);
    assert.equal(result.estimatedTotalCost, null);
    assert.ok(result.missingCostPrompts.length > 0);
  });

  it('supports direct unit price mode (e.g., ready-mix concrete per cubic yard)', () => {
    // 27 ft x 10 ft x 6 in (0.5 ft) = 135 cu ft = 5.0 cu yd base
    // 10% waste -> 5.5 cu yd adjusted
    // Ready-mix price = $160 per cu yd -> 5.5 * 160 = $880.00
    const result = calculateConstructionProject(
      createDefaultInputs({
        shape: 'concrete-slab',
        system: 'imperial',
        length: '27',
        lengthUnit: 'ft',
        width: '10',
        widthUnit: 'ft',
        thickness: '6',
        thicknessUnit: 'in',
        wastePercent: '10',
        pricingMode: 'unit',
        unitOrPackagePrice: '160',
        priceUnit: 'cuyd',
      })
    );

    assert.equal(result.isValid, true);
    assert.ok(Math.abs(result.baseVolume!.cuyd - 5) < 1e-6);
    assert.ok(Math.abs(result.adjustedVolume!.cuyd - 5.5) < 1e-6);
    assert.ok(Math.abs(result.estimatedTotalCost! - 880) < 1e-5);
  });

  it('rejects zero, negative, non-numeric, and unreasonably large inputs', () => {
    const zeroResult = calculateConstructionProject(
      createDefaultInputs({ length: '0' })
    );
    assert.equal(zeroResult.isValid, false);
    assert.ok(zeroResult.fieldErrors.length);

    const negResult = calculateConstructionProject(
      createDefaultInputs({ width: '-5' })
    );
    assert.equal(negResult.isValid, false);
    assert.ok(negResult.fieldErrors.width);

    const hugeResult = calculateConstructionProject(
      createDefaultInputs({ length: '50000', lengthUnit: 'm' })
    );
    assert.equal(hugeResult.isValid, false);
    assert.ok(hugeResult.fieldErrors.length);

    const badHoles = calculateConstructionProject(
      createDefaultInputs({ shape: 'cylindrical-holes', numberOfHoles: '2.5' })
    );
    assert.equal(badHoles.isValid, false);
    assert.ok(badHoles.fieldErrors.numberOfHoles);
  });
});
