import { describe, it, expect } from 'bun:test';
import { calculateUsFederalTax } from './us-federal-tax';

describe('US Federal Income Tax Engine (IRS 2024/2025 Rules)', () => {
  it('accurately calculates 2025 Single tax for $100,000 salary with standard deduction', () => {
    const result = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: 'single',
      wages: 100000,
      taxesWithheld: 15000,
    });

    expect(result.totalGrossIncome).toBe(100000);
    expect(result.agi).toBe(100000);
    expect(result.standardDeduction).toBe(15000);
    expect(result.effectiveDeduction).toBe(15000);
    expect(result.taxableIncome).toBe(85000);

    // 2025 Brackets:
    // 10% on $11,925 = $1,192.50
    // 12% on ($48,475 - $11,925 = $36,550) = $4,386.00
    // 22% on ($85,000 - $48,475 = $36,525) = $8,035.50
    // Total = $13,614.00
    expect(result.taxBeforeCredits).toBeCloseTo(13614.0, 1);
    expect(result.taxAfterCredits).toBeCloseTo(13614.0, 1);
    expect(result.marginalTaxRatePercent).toBe(22);
    expect(result.effectiveTaxRatePercent).toBeCloseTo(13.61, 1);

    // Withholding = $15,000, Tax = $13,614 -> Refund = $1,386
    expect(result.refundOrOwedType).toBe('refund');
    expect(result.refundAmount).toBeCloseTo(1386.0, 1);
    expect(result.amountOwed).toBe(0);
  });

  it('reduces taxable income with pre-tax 401(k) and HSA contributions', () => {
    const result = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: 'single',
      wages: 100000,
      preTaxDeductions: {
        traditional401k: 10000,
        hsa: 4000,
      },
    });

    expect(result.totalGrossIncome).toBe(100000);
    expect(result.totalPreTaxDeductions).toBe(14000);
    expect(result.agi).toBe(86000);
    expect(result.taxableIncome).toBe(86000 - 15000); // $71,000
    expect(result.marginalTaxRatePercent).toBe(22);
  });

  it('correctly caps SALT deduction at $10,000 when itemizing', () => {
    const result = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: 'single',
      wages: 150000,
      deductionType: 'itemized',
      itemizedDeductions: {
        saltStateAndLocalTax: 16000, // should cap at $10,000
        mortgageInterest: 8000,
        charitableDonations: 2000,
      },
    });

    expect(result.saltDeductionCapped).toBe(10000);
    expect(result.saltExcessLost).toBe(6000);
    expect(result.itemizedTotal).toBe(10000 + 8000 + 2000); // $20,000
    expect(result.effectiveDeduction).toBe(20000);
    expect(result.recommendedDeductionType).toBe('itemized');
  });

  it('correctly applies tax credits and determines amount owed', () => {
    const result = calculateUsFederalTax({
      taxYear: '2025',
      filingStatus: 'marriedFilingJointly',
      wages: 120000,
      taxCredits: {
        childTaxCredit: 4000, // 2 children
      },
      taxesWithheld: 3000,
    });

    expect(result.standardDeduction).toBe(30000);
    expect(result.taxableIncome).toBe(90000);
    // Married filing jointly 2025:
    // 10% on $23,850 = $2,385.00
    // 12% on ($90,000 - $23,850 = $66,150) = $7,938.00
    // Total before credits = $10,323.00
    expect(result.taxBeforeCredits).toBeCloseTo(10323.0, 1);
    // After $4,000 credit = $6,323.00
    expect(result.taxAfterCredits).toBeCloseTo(6323.0, 1);
    // Withheld $3,000 -> Owes $3,323.00
    expect(result.refundOrOwedType).toBe('owed');
    expect(result.amountOwed).toBeCloseTo(3323.0, 1);
    expect(result.refundAmount).toBe(0);
  });
});
