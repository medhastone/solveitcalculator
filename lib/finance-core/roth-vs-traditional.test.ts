import { describe, it, expect } from 'bun:test';
import { calculateRothVsTraditional } from './roth-vs-traditional';

describe('Roth vs Traditional Calculator Engine (Equal After-Tax Outlay)', () => {
  it('computes exact Traditional and Roth end values for single pre-tax contribution', () => {
    const res = calculateRothVsTraditional({
      preTaxContribution: 10000,
      currentMarginalRatePercent: 24,
      expectedRetirementRatePercent: 15,
      years: 25,
      annualReturnPercent: 7.0,
      contributionMode: 'single',
    });

    expect(res.equalAfterTaxOutlayPerPeriod).toBeCloseTo(7600, 2);
    expect(res.immediateTaxPaidOrSaved).toBeCloseTo(2400, 2);
    expect(res.traditionalPreTaxEndValue).toBeCloseTo(54274.33, 1);
    expect(res.traditionalAfterTaxEndValue).toBeCloseTo(46133.18, 1);
    expect(res.rothAfterTaxEndValue).toBeCloseTo(41248.49, 1);
    expect(res.differenceAbsolute).toBeCloseTo(4884.69, 1);
    expect(res.breakEvenRetirementRatePercent).toBe(24);
    expect(res.higherOutcome).toBe('traditional');
  });

  it('produces identical end values when expected retirement rate equals current marginal rate', () => {
    const res = calculateRothVsTraditional({
      preTaxContribution: 23500,
      currentMarginalRatePercent: 22,
      expectedRetirementRatePercent: 22,
      years: 30,
      annualReturnPercent: 8.0,
      contributionMode: 'single',
    });

    expect(res.higherOutcome).toBe('equal');
    expect(res.differenceAbsolute).toBeCloseTo(0, 6);
    expect(res.traditionalAfterTaxEndValue).toBeCloseTo(res.rothAfterTaxEndValue, 6);
    expect(res.breakEvenRetirementRatePercent).toBe(22);
  });

  it('favors Roth when expected retirement rate exceeds current marginal rate', () => {
    const res = calculateRothVsTraditional({
      preTaxContribution: 7000,
      currentMarginalRatePercent: 12,
      expectedRetirementRatePercent: 24,
      years: 30,
      annualReturnPercent: 7.5,
      contributionMode: 'single',
    });

    expect(res.higherOutcome).toBe('roth');
    expect(res.rothAfterTaxEndValue).toBeGreaterThan(res.traditionalAfterTaxEndValue);
    expect(res.differenceSigned).toBeGreaterThan(0);
    expect(res.breakEvenRetirementRatePercent).toBe(12);
  });

  it('correctly supports annual recurring contribution mode while preserving break-even rate = current rate', () => {
    const res = calculateRothVsTraditional({
      preTaxContribution: 10000,
      currentMarginalRatePercent: 24,
      expectedRetirementRatePercent: 24,
      years: 20,
      annualReturnPercent: 7.0,
      contributionMode: 'annual',
    });

    expect(res.higherOutcome).toBe('equal');
    expect(res.traditionalAfterTaxEndValue).toBeCloseTo(res.rothAfterTaxEndValue, 5);
    expect(res.breakEvenRetirementRatePercent).toBe(24);
    expect(res.timeline.length).toBe(20);
  });
});
