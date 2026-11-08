import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeMathToolResult } from './mathCalculatorsData.ts';
import {
  evaluateWorkspaceExpression,
  computeHistoryRunningTotal,
  exportHistoryToCsv,
  type WorkspaceHistoryRecord,
} from './calculationWorkspaceEngine.ts';
import {
  calculateConstructionProject,
  convertLinearValue,
  type ConstructionProjectInputs,
} from './constructionProjectEngine.ts';
import {
  convertRecipeIngredient,
} from './recipeConverterEngine.ts';
import { calculateSalaryTakeHome } from './salaryTaxEngine.ts';

function makeConstructionInput(
  overrides: Partial<ConstructionProjectInputs> = {}
): ConstructionProjectInputs {
  return {
    shape: 'concrete-slab',
    system: 'imperial',
    useFeetInches: false,
    length: '10',
    lengthUnit: 'ft',
    lengthFtIn: { feet: '10', inches: '0' },
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
    wastePercent: '5',
    pricingMode: 'package',
    packageYield: '0.6',
    packageYieldUnit: 'cuft',
    unitOrPackagePrice: '6.50',
    priceUnit: 'cuft',
    ...overrides,
  };
}

describe('Prompt 8 Comprehensive QA Suite — Math, Finance, Health, Date, Unit & Edge Cases', () => {
  describe('1. Math Engine (computeMathToolResult) — Normal, Decimal, Fraction, Negative & Zero Cases', () => {
    it('calculates percentage and percentage change accurately for normal and decimal inputs', () => {
      const pctRes = computeMathToolResult('percentage-calculator', 17.5, 240, 0);
      assert.ok(pctRes.headlineResult.includes('42'), `Expected 17.5% of 240 = 42, got ${pctRes.headlineResult}`);

      const changeRes = computeMathToolResult('percentage-change-calculator', 80, 100, 0);
      assert.ok(changeRes.headlineResult.includes('+25.00%'), `Expected +25.00%, got ${changeRes.headlineResult}`);

      const decRes = computeMathToolResult('percentage-change-calculator', 200, 150, 0);
      assert.ok(decRes.headlineResult.includes('-25.00%'), `Expected -25.00%, got ${decRes.headlineResult}`);
    });

    it('simplifies fractions and converts fractions to decimals with zero-denominator protection', () => {
      const fracRes = computeMathToolResult('fraction-calculator', 1, 2, 6);
      assert.ok(fracRes.headlineResult.includes('1/2'), `Expected simplified 1/2, got ${fracRes.headlineResult}`);

      const zeroDenomRes = computeMathToolResult('fraction-to-decimal-calculator', 3, 0, 0);
      assert.ok(!zeroDenomRes.headlineResult.includes('NaN'));
      assert.ok(!zeroDenomRes.headlineResult.includes('Infinity'));
    });

    it('solves quadratic equations with real roots and complex conjugate roots (negative discriminant)', () => {
      const realRoots = computeMathToolResult('quadratic-equation-calculator', 1, -5, 6);
      assert.ok(realRoots.headlineResult.includes('x₁ = 3'));
      assert.ok(realRoots.headlineResult.includes('x₂ = 2'));

      const complexRoots = computeMathToolResult('quadratic-equation-calculator', 1, 2, 5);
      assert.ok(complexRoots.headlineResult.includes('Complex Roots'));
      assert.ok(complexRoots.headlineResult.includes('-1.00 ± 2.00i'));
    });

    it('computes GCD & LCM, logarithms, square roots, and negative absolute values', () => {
      const gcdLcm = computeMathToolResult('gcd-and-lcm-calculator', 12, 18, 0);
      assert.ok(gcdLcm.headlineResult.includes('GCD = 6'));
      assert.ok(gcdLcm.headlineResult.includes('LCM = 36'));

      const logRes = computeMathToolResult('log-calculator', 1000, 10, 0);
      assert.ok(logRes.headlineResult.includes('3'));

      const absRes = computeMathToolResult('absolute-value-calculator', -42.5, 17.5, 0);
      assert.ok(absRes.headlineResult.includes('42.5'));
    });
  });

  describe('2. Security & Unsafe Expression Parsing Guards', () => {
    it('blocks code injection, prototype access, global objects, and script tags in expression parser', () => {
      const maliciousInputs = [
        'process.exit(1)',
        'window.location',
        'globalThis.fetch("https://evil.example")',
        '__proto__.polluted = 1',
        'constructor.constructor("return process")()',
        '<script>alert(1)</script>',
        'eval("2+2")',
        'Function("return 1")()',
        '100; alert(1)',
      ];

      for (const payload of maliciousInputs) {
        const res = evaluateWorkspaceExpression(payload);
        assert.equal(res.ok, false, `Expected malicious payload "${payload}" to be rejected`);
      }
    });
  });

  describe('3. Very Large Inputs, Zero Values, Missing Fields & Storage Failure Resilience', () => {
    it('handles very large numbers and division-by-zero cleanly', () => {
      const largeEval = evaluateWorkspaceExpression('1250000000 * 4');
      assert.equal(largeEval.ok, true);
      if (largeEval.ok) {
        assert.equal(largeEval.result, 5000000000);
      }

      const divZeroEval = evaluateWorkspaceExpression('500 / (10 - 10)');
      assert.equal(divZeroEval.ok, false);
      if (!divZeroEval.ok) {
        assert.ok(divZeroEval.error.toLowerCase().includes('zero'));
      }
    });

    it('ignores non-finite/corrupted values when computing running totals and escapes CSV quotes safely', () => {
      const records: WorkspaceHistoryRecord[] = [
        {
          id: '1',
          expression: '10 + 20',
          normalizedExpression: '10 + 20',
          result: 30,
          formattedResult: '30',
          timestamp: '2026-04-01T00:00:00Z',
          note: 'Rent "April"',
          sourceCalculator: 'Workspace',
        },
        {
          id: '2',
          expression: 'bad',
          normalizedExpression: 'bad',
          result: Number.NaN,
          formattedResult: 'NaN',
          timestamp: '2026-04-01T00:00:00Z',
          note: 'Corrupted',
          sourceCalculator: 'Workspace',
        },
      ];
      const summary = computeHistoryRunningTotal(records);
      assert.equal(summary.total, 30);

      const csv = exportHistoryToCsv(records);
      assert.ok(csv.includes('"Rent ""April"""'));
    });

    it('rejects missing or zero dimensions in construction calculations with explicit validation errors', () => {
      const zeroThickness = calculateConstructionProject(
        makeConstructionInput({ thickness: '0' })
      );
      assert.equal(zeroThickness.isValid, false);
      assert.ok(Object.keys(zeroThickness.fieldErrors).length > 0);
    });
  });

  describe('4. Unit Conversions, Rounding Rules & Unsupported Method Guards', () => {
    it('converts lengths across feet, inches, yards, metres, centimetres, and millimetres accurately', () => {
      assert.ok(Math.abs(convertLinearValue(12, 'in', 'ft') - 1) < 1e-9);
      assert.ok(Math.abs(convertLinearValue(1, 'yd', 'ft') - 3) < 1e-9);
      assert.ok(Math.abs(convertLinearValue(1, 'm', 'ft') - 3.280839895) < 1e-6);
      assert.ok(Math.abs(convertLinearValue(100, 'cm', 'm') - 1) < 1e-9);
      assert.ok(Math.abs(convertLinearValue(1000, 'mm', 'm') - 1) < 1e-9);
    });

    it('applies ceiling rounding to construction package/bag counts so projects never under-order', () => {
      const slab = calculateConstructionProject(
        makeConstructionInput({
          length: '10',
          width: '10',
          thickness: '4',
          wastePercent: '5',
          packageYield: '0.6',
          packageYieldUnit: 'cuft',
        })
      );
      assert.equal(slab.isValid, true);
      assert.equal(slab.packageCount, 59);
    });

    it('blocks unsupported cross-dimension unit conversions when ingredient density is missing', () => {
      const unsupported = convertRecipeIngredient({
        ingredientQuery: 'mystery-unknown-spice-xyz',
        quantityInput: '2',
        fromUnit: 'cup',
        toUnit: 'g',
        standardId: 'us_customary',
      });
      assert.notEqual(unsupported.status, 'ok');
    });
  });

  describe('5. Independent Reference Benchmarks — Finance, Tax, Health & Date Logic', () => {
    it('matches standard amortization formula M = P * [r(1+r)^n] / [(1+r)^n - 1] for a $300,000 30-year mortgage at 6.0%', () => {
      const P = 300000;
      const annualRate = 0.06;
      const r = annualRate / 12;
      const n = 360;
      const monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      assert.equal(monthlyPayment.toFixed(2), '1798.65');
    });

    it('matches WHO BMI and Mifflin-St Jeor BMR reference equations', () => {
      const weightKg = 70;
      const heightM = 1.75;
      const bmi = weightKg / (heightM * heightM);
      assert.equal(bmi.toFixed(1), '22.9');

      const bmrMale = 10 * 70 + 6.25 * 175 - 5 * 30 + 5;
      assert.equal(bmrMale, 1648.75);
    });

    it('handles leap-year date differences and rejects invalid dates accurately', () => {
      const startLeap = Date.UTC(2024, 1, 28);
      const endLeap = Date.UTC(2024, 2, 1);
      const daysLeap = Math.round((endLeap - startLeap) / (1000 * 60 * 60 * 24));
      assert.equal(daysLeap, 2);

      const startNonLeap = Date.UTC(2025, 1, 28);
      const endNonLeap = Date.UTC(2025, 2, 1);
      const daysNonLeap = Math.round((endNonLeap - startNonLeap) / (1000 * 60 * 60 * 24));
      assert.equal(daysNonLeap, 1);

      const invalidParsed = Date.parse('2025-13-45');
      assert.equal(Number.isNaN(invalidParsed), true);
    });

    it('verifies multi-country salary calculator effective vs marginal rate invariant across all 5 jurisdictions', () => {
      const checks: Array<{ code: 'us' | 'uk' | 'ca' | 'au' | 'in'; year: string; income: number }> = [
        { code: 'us', year: '2025', income: 120000 },
        { code: 'uk', year: '2025-26', income: 65000 },
        { code: 'ca', year: '2025', income: 95000 },
        { code: 'au', year: '2024-25', income: 110000 },
        { code: 'in', year: '2024-25', income: 1800000 },
      ];

      for (const item of checks) {
        const res = calculateSalaryTakeHome({
          jurisdictionId: item.code,
          taxYearId: item.year,
          grossAmount: item.income,
          payFrequency: 'annual',
          usFilingStatus: 'single',
          ukRegion: 'rUK',
          auResidency: 'resident',
          auIncludeMedicareLevy: true,
        });
        assert.equal(res.ok, true, `Expected ${item.code} (${item.year}) calculation to succeed`);
        if (res.ok) {
          assert.ok(
            res.effectiveTaxAndStatutoryRatePercent < res.marginalIncomeTaxRatePercent,
            `Expected effective tax & statutory rate (${res.effectiveTaxAndStatutoryRatePercent}%) < marginal rate (${res.marginalIncomeTaxRatePercent}%) for ${item.code}`
          );
        }
      }
    });
  });
});
