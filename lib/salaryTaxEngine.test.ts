import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSalaryTakeHome } from './salaryTaxEngine.ts';

describe('Salary & Take-Home Pay Calculation Engine', () => {
  describe('Validation & Boundary Cases', () => {
    it('handles zero salary cleanly across jurisdictions', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 0,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.grossAnnual, 0);
        assert.equal(res.incomeTaxAnnual, 0);
        assert.equal(res.socialContributionsAnnual, 0);
        assert.equal(res.netPayAnnual, 0);
        assert.equal(res.effectiveTaxAndStatutoryRatePercent, 0);
      }
    });

    it('rejects negative salary amounts with a clear error message', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'uk',
        taxYearId: '2025-26',
        grossAmount: -5000,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.match(res.errorMessage, /non-negative/i);
      }
    });

    it('rejects out-of-range pension percentages', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 100000,
        payFrequency: 'annual',
        preTaxPensionPercent: 75,
      });
      assert.equal(res.ok, false);
    });
  });

  describe('United States (IRS Federal + FICA)', () => {
    it('charges $0 federal income tax when gross pay is below the 2025 $15,000 Single standard deduction', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 14000,
        payFrequency: 'annual',
        usFilingStatus: 'single',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.taxableIncomeAnnual, 0);
        assert.equal(res.incomeTaxAnnual, 0);
        // FICA 7.65% of $14,000 = $1,071
        assert.equal(res.socialContributionsAnnual, 1071);
        assert.equal(res.netPayAnnual, 12929);
      }
    });

    it('accurately computes 2025 US Single progressive brackets and FICA for $85,000 gross', () => {
      // $85,000 gross - $15,000 standard deduction = $70,000 taxable
      // 10% on first $11,925 = $1,192.50
      // 12% on ($48,475 - $11,925 = $36,550) = $4,386.00
      // 22% on ($70,000 - $48,475 = $21,525) = $4,735.50
      // Total Federal Tax = $10,314.00
      // Social Security (6.2% of $85,000) = $5,270.00
      // Medicare (1.45% of $85,000) = $1,232.50
      // Total FICA = $6,502.50
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 85000,
        payFrequency: 'annual',
        usFilingStatus: 'single',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.taxableIncomeAnnual, 70000);
        assert.equal(res.incomeTaxAnnual, 10314);
        assert.equal(res.socialContributionsAnnual, 6502.5);
        assert.equal(res.netPayAnnual, 68183.5);
        assert.equal(res.marginalIncomeTaxRatePercent, 22);
      }
    });

    it('caps Social Security tax at the 2025 $176,100 OASDI wage base and applies Additional Medicare Tax above $200,000', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 250000,
        payFrequency: 'annual',
        usFilingStatus: 'single',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        const ssItem = res.deductionLineItems.find((d) => d.id === 'us_ss');
        const medItem = res.deductionLineItems.find(
          (d) => d.id === 'us_medicare'
        );
        // 6.2% of $176,100 = $10,918.20
        assert.equal(ssItem?.annualAmount, 10918.2);
        // 1.45% of $250,000 ($3,625) + 0.9% of $50,000 ($450) = $4,075
        assert.equal(medItem?.annualAmount, 4075);
      }
    });
  });

  describe('United Kingdom (HMRC PAYE + Class 1 NI)', () => {
    it('charges £0 Income Tax and £0 NI at £12,570 Personal Allowance threshold', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'uk',
        taxYearId: '2025-26',
        grossAmount: 12570,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.incomeTaxAnnual, 0);
        assert.equal(res.socialContributionsAnnual, 0);
        assert.equal(res.netPayAnnual, 12570);
      }
    });

    it('correctly calculates UK Basic + Higher rate tax and Class 1 NI at £60,000 gross', () => {
      // £60,000 gross - £12,570 Personal Allowance = £47,430 taxable
      // Basic rate: 20% on £37,700 = £7,540
      // Higher rate: 40% on (£47,430 - £37,700 = £9,730) = £3,892
      // Total Income Tax = £11,432
      // Class 1 NI: 8% on (£50,270 - £12,570 = £37,700) = £3,016 + 2% on (£60,000 - £50,270 = £9,730) = £194.60 -> Total NI = £3,210.60
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'uk',
        taxYearId: '2025-26',
        grossAmount: 60000,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.taxableIncomeAnnual, 47430);
        assert.equal(res.incomeTaxAnnual, 11432);
        assert.equal(res.socialContributionsAnnual, 3210.6);
        assert.equal(res.netPayAnnual, 45357.4);
      }
    });

    it('tapers the UK Personal Allowance to £0 at £125,140 adjusted net income', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'uk',
        taxYearId: '2025-26',
        grossAmount: 130000,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.statutoryAllowanceOrDeductionAnnual, 0);
        assert.equal(res.taxableIncomeAnnual, 130000);
      }
    });
  });

  describe('Canada (CRA Federal + CPP/CPP2 + EI)', () => {
    it('caps CPP1, CPP2, and EI contributions at their 2025 maximums for high earners', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'ca',
        taxYearId: '2025',
        grossAmount: 100000,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        // CPP1 max: (71300 - 3500) * 0.0595 = 4034.10
        // CPP2 max: (81200 - 71300) * 0.04 = 396.00
        // Total CPP = 4430.10
        // EI max: 65700 * 0.0164 = 1077.48
        const cppItem = res.deductionLineItems.find((d) => d.id === 'ca_cpp');
        const eiItem = res.deductionLineItems.find((d) => d.id === 'ca_ei');
        assert.equal(cppItem?.annualAmount, 4430.1);
        assert.equal(eiItem?.annualAmount, 1077.48);
      }
    });
  });

  describe('Australia (ATO Stage 3 Resident Rates + LITO + Medicare Levy)', () => {
    it('applies $0 tax and $0 Medicare Levy at the $18,200 tax-free threshold', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'au',
        taxYearId: '2024-25',
        grossAmount: 18200,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.incomeTaxAnnual, 0);
        assert.equal(res.socialContributionsAnnual, 0);
        assert.equal(res.netPayAnnual, 18200);
      }
    });

    it('accurately calculates 2024-25 Stage 3 resident tax and 2% Medicare Levy at $90,000 gross', () => {
      // $0 - $18,200: $0
      // $18,200 - $45,000 ($26,800 @ 16%): $4,288
      // $45,000 - $90,000 ($45,000 @ 30%): $13,500
      // Total Income Tax = $17,788 (LITO is $0 above $66,667)
      // Medicare Levy (2% of $90,000) = $1,800
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'au',
        taxYearId: '2024-25',
        grossAmount: 90000,
        payFrequency: 'annual',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.incomeTaxAnnual, 17788);
        assert.equal(res.socialContributionsAnnual, 1800);
        assert.equal(res.netPayAnnual, 70412);
      }
    });
  });

  describe('India (FY 2024-25 Salaried Income Tax + Section 87A Rebate + 4% Cess)', () => {
    it('charges ₹0 tax up to ₹7,75,000 gross salary in the New Tax Regime due to ₹75,000 Standard Deduction + Section 87A Rebate', () => {
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'in',
        taxYearId: '2024-25',
        grossAmount: 775000,
        payFrequency: 'annual',
        indiaTaxRegime: 'new_regime',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.taxableIncomeAnnual, 700000);
        assert.equal(res.grossBracketTaxAnnual, 20000);
        assert.equal(res.taxCreditsOrRebatesAnnual, 20000);
        assert.equal(res.incomeTaxAnnual, 0);
        assert.equal(res.socialContributionsAnnual, 0);
        assert.equal(res.netPayAnnual, 775000);
      }
    });

    it('accurately computes New Regime slab tax + 4% Cess on ₹15,75,000 gross (₹15,00,000 taxable)', () => {
      // Taxable = ₹15,00,000
      // 0-3L: 0
      // 3L-7L (4L @ 5%): ₹20,000
      // 7L-10L (3L @ 10%): ₹30,000
      // 10L-12L (2L @ 15%): ₹30,000
      // 12L-15L (3L @ 20%): ₹60,000
      // Total Slab Tax = ₹1,40,000
      // 4% Cess = ₹5,600
      const res = calculateSalaryTakeHome({
        jurisdictionId: 'in',
        taxYearId: '2024-25',
        grossAmount: 1575000,
        payFrequency: 'annual',
        indiaTaxRegime: 'new_regime',
      });
      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.taxableIncomeAnnual, 1500000);
        assert.equal(res.incomeTaxAnnual, 140000);
        assert.equal(res.socialContributionsAnnual, 5600);
        assert.equal(res.netPayAnnual, 1429400);
      }
    });
  });

  describe('Pay-Frequency Normalization', () => {
    it('normalizes monthly gross pay ($5,000/month) identically to $60,000/year', () => {
      const monthlyInput = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 5000,
        payFrequency: 'monthly',
      });
      const annualInput = calculateSalaryTakeHome({
        jurisdictionId: 'us',
        taxYearId: '2025',
        grossAmount: 60000,
        payFrequency: 'annual',
      });
      assert.equal(monthlyInput.ok, true);
      assert.equal(annualInput.ok, true);
      if (monthlyInput.ok && annualInput.ok) {
        assert.equal(monthlyInput.grossAnnual, 60000);
        assert.equal(monthlyInput.netPayAnnual, annualInput.netPayAnnual);
        assert.equal(
          monthlyInput.periodBreakdowns.monthly.netPay,
          annualInput.periodBreakdowns.monthly.netPay
        );
      }
    });
  });
});
