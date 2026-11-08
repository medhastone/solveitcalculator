import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateServingScale,
  convertRecipeIngredient,
  parseRecipeQuantity,
  resolveVerifiedIngredient,
} from './recipeConverterEngine.ts';

describe('Recipe Converter Engine', () => {
  describe('Verified ingredients & aliases', () => {
    it('resolves flour, granulated sugar, butter, and water by ID, name, and aliases', () => {
      const flour = resolveVerifiedIngredient('ap flour');
      assert.ok(flour);
      assert.equal(flour.id, 'all-purpose-flour');
      assert.equal(flour.gramsPerUsCup, 120);

      const sugar = resolveVerifiedIngredient('granulated sugar');
      assert.ok(sugar);
      assert.equal(sugar.id, 'granulated-sugar');
      assert.equal(sugar.gramsPerUsCup, 200);

      const butter = resolveVerifiedIngredient('unsalted butter');
      assert.ok(butter);
      assert.equal(butter.id, 'butter');
      assert.equal(butter.gramsPerUsCup, 227);

      const water = resolveVerifiedIngredient('Water');
      assert.ok(water);
      assert.equal(water.id, 'water');
      assert.equal(water.gramsPerUsCup, 236.59);
    });

    it('converts 1 US cup of flour, sugar, butter, and water to distinct gram weights', () => {
      const flourRes = convertRecipeIngredient({
        ingredientQuery: 'all-purpose-flour',
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        standardId: 'us_customary',
      });
      assert.equal(flourRes.status, 'ok');
      assert.ok(Math.abs((flourRes.convertedQuantity ?? 0) - 120) < 0.01);

      const sugarRes = convertRecipeIngredient({
        ingredientQuery: 'granulated-sugar',
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        standardId: 'us_customary',
      });
      assert.equal(sugarRes.status, 'ok');
      assert.ok(Math.abs((sugarRes.convertedQuantity ?? 0) - 200) < 0.01);

      const butterRes = convertRecipeIngredient({
        ingredientQuery: 'butter',
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        standardId: 'us_customary',
      });
      assert.equal(butterRes.status, 'ok');
      assert.ok(Math.abs((butterRes.convertedQuantity ?? 0) - 227) < 0.01);

      const waterRes = convertRecipeIngredient({
        ingredientQuery: 'water',
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        standardId: 'us_customary',
      });
      assert.equal(waterRes.status, 'ok');
      assert.ok(Math.abs((waterRes.convertedQuantity ?? 0) - 236.59) < 0.01);
    });
  });

  describe('Decimal and fractional quantity parsing', () => {
    it('parses decimals, simple fractions, mixed numbers, and unicode fractions safely', () => {
      assert.equal(parseRecipeQuantity('2.5').value, 2.5);
      assert.equal(parseRecipeQuantity('3/4').value, 0.75);
      assert.equal(parseRecipeQuantity('1 1/2').value, 1.5);
      assert.equal(parseRecipeQuantity('2-1/4').value, 2.25);
      assert.equal(parseRecipeQuantity('½').value, 0.5);
      assert.equal(parseRecipeQuantity('1¾').value, 1.75);
    });

    it('rejects zero, negative values, division by zero, and malformed expressions', () => {
      assert.equal(parseRecipeQuantity('0').isValid, false);
      assert.equal(parseRecipeQuantity('-2').isValid, false);
      assert.equal(parseRecipeQuantity('1/0').isValid, false);
      assert.equal(parseRecipeQuantity('abc').isValid, false);
      assert.equal(parseRecipeQuantity('').isValid, false);
    });
  });

  describe('Serving scaling', () => {
    it('computes Desired Servings / Original Servings and scales converted quantities', () => {
      const scale = calculateServingScale(4, 10);
      assert.equal(scale.isValid, true);
      assert.equal(scale.scalingFactor, 2.5);

      // 1 1/2 cups of flour (180 g) scaled by 2.5x = 450 g
      const res = convertRecipeIngredient({
        ingredientQuery: 'flour',
        quantityInput: '1 1/2',
        fromUnit: 'cup',
        toUnit: 'g',
        scalingFactor: scale.scalingFactor,
        standardId: 'us_customary',
      });
      assert.equal(res.status, 'ok');
      assert.ok(Math.abs((res.scaledFromQuantity ?? 0) - 3.75) < 0.001);
      assert.ok(Math.abs((res.convertedQuantity ?? 0) - 450) < 0.05);
    });

    it('rejects zero or negative serving counts', () => {
      assert.equal(calculateServingScale(0, 8).isValid, false);
      assert.equal(calculateServingScale(4, -2).isValid, false);
    });
  });

  describe('Measurement standards & unavailable conversion factors', () => {
    it('adjusts cup volume when switching between US Customary (236.59 mL) and Metric (250 mL)', () => {
      const metricFlour = convertRecipeIngredient({
        ingredientQuery: 'all-purpose-flour',
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        standardId: 'metric',
      });
      assert.equal(metricFlour.status, 'ok');
      // 120 g * (250 / 236.5882365) ≈ 126.80 g
      assert.ok(Math.abs((metricFlour.convertedQuantity ?? 0) - 126.8) < 0.1);
    });

    it('flags unavailable density for unknown ingredients when converting volume to mass, and supports user-supplied custom density', () => {
      const missingRes = convertRecipeIngredient({
        ingredientQuery: 'Dragonfruit Puree',
        quantityInput: '2',
        fromUnit: 'cup',
        toUnit: 'g',
        scalingFactor: 1.5,
      });
      assert.equal(missingRes.status, 'needs_custom_density');
      assert.equal(missingRes.scaledFromQuantity, 3);
      assert.equal(missingRes.convertedQuantity, null);

      const customRes = convertRecipeIngredient({
        ingredientQuery: 'Dragonfruit Puree',
        quantityInput: '2',
        fromUnit: 'cup',
        toUnit: 'g',
        scalingFactor: 1.5,
        customGramsPerCup: '240',
      });
      assert.equal(customRes.status, 'ok');
      assert.equal(customRes.densitySource, 'user_custom');
      assert.ok(Math.abs((customRes.convertedQuantity ?? 0) - 720) < 0.05);
    });
  });
});
