import { describe, it, expect } from 'bun:test';
import {
  calculateRmd,
  getRmdStartAge,
  getUniformLifetimeFactor,
  getJointLifeExpectancyFactor,
} from './rmd';

describe('RMD Calculator Engine (IRS Pub 590-B & SECURE 2.0 Act)', () => {
  it('determines SECURE 2.0 RMD starting ages by birth year cohort', () => {
    expect(getRmdStartAge(1950).rmdStartAge).toBe(72);
    expect(getRmdStartAge(1951).rmdStartAge).toBe(73);
    expect(getRmdStartAge(1959).rmdStartAge).toBe(73);
    expect(getRmdStartAge(1960).rmdStartAge).toBe(75);
  });

  it('calculates Uniform Lifetime Table (Table III) RMD accurately at age 73', () => {
    // At age 73, IRS Uniform Lifetime Table factor = 26.5
    // Prior year-end balance = $500,000 -> RMD = 500000 / 26.5 = $18,867.9245
    const res = calculateRmd({
      birthYear: 1953,
      ownerAge: 73,
      distributionYear: 2026,
      priorYearEndBalance: 500000,
      isSpouseMoreThan10YearsYounger: false,
    });

    expect(res.distributionPeriod).toBe(26.5);
    expect(res.rmdAmount).toBeCloseTo(18867.92, 2);
    expect(res.rmdPercentOfBalance).toBeCloseTo(3.7736, 3);
    expect(res.standardPenaltyRatePercent).toBe(25);
    expect(res.timelyCorrectionPenaltyRatePercent).toBe(10);
  });

  it('uses Joint Life Expectancy Table (Table II) when sole beneficiary spouse is >10 years younger', () => {
    // Owner age 75, spouse age 60 (15 years younger) -> Joint Life Table factor = 28.2 (vs 24.6 Uniform)
    const factor = getJointLifeExpectancyFactor(75, 60);
    expect(factor).toBe(28.2);
    expect(factor).toBeGreaterThan(getUniformLifetimeFactor(75));

    const res = calculateRmd({
      birthYear: 1951,
      ownerAge: 75,
      distributionYear: 2026,
      priorYearEndBalance: 600000,
      isSpouseMoreThan10YearsYounger: true,
      spouseAge: 60,
    });

    expect(res.qualifiesForJointLifeTable).toBe(true);
    expect(res.distributionPeriod).toBe(28.2);
    expect(res.rmdAmount).toBeCloseTo(600000 / 28.2, 2);
  });
});
