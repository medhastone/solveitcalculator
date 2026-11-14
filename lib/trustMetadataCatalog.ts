export interface TrustSourceItem {
  label: string;
  url: string;
}

export interface ToolTrustMetadata {
  domain: 'tax' | 'finance' | 'health' | 'conversion' | 'general';
  lastUpdated: string;
  dataTaxYear?: string;
  disclaimer?: string;
  sources: TrustSourceItem[];
}

const DISCLAIMER_TAX =
  'Estimate only, not tax, payroll, or legal advice. Statutory tax brackets, standard deductions, and social insurance thresholds follow published government schedules; personal tax liability depends on your full return.';

const DISCLAIMER_FINANCE =
  'Estimate only, not financial, lending, or investment advice. Figures are mathematical projections based on your inputs and do not represent a loan offer or guaranteed return.';

const DISCLAIMER_HEALTH =
  'Estimate only, not medical or clinical advice. These equations provide general adult population screening estimates and are not a substitute for evaluation by a healthcare professional.';

const SLUG_TRUST_MAP: Record<string, ToolTrustMetadata> = {
  // ============================================================================
  // TAX & PAYROLL CALCULATORS
  // ============================================================================
  'us-federal-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 & 2024 US Federal Tax Years',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Revenue Procedure 2024-40 (2025 Federal Tax Brackets & Standard Deductions)',
        url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
      },
      {
        label: 'IRS Publication 17 (Your Federal Income Tax)',
        url: 'https://www.irs.gov/publications/p17',
      },
      {
        label: 'SSA 2025 Social Security OASDI Wage Base ($176,100)',
        url: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf',
      },
    ],
  },
  'us-state-take-home-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 US Federal & State Tax Year',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Revenue Procedure 2024-40 (2025 Federal Tax Tables)',
        url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
      },
      {
        label: 'IRS Publication 15-T (Federal Income Tax Withholding Methods)',
        url: 'https://www.irs.gov/publications/p15t',
      },
      {
        label: 'SSA 2025 FICA OASDI Wage Cap ($176,100)',
        url: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf',
      },
    ],
  },
  'take-home-pay-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 US Tax Year (IRS & SSA)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Revenue Procedure 2024-40 (2025 Federal Tax Brackets)',
        url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
      },
      {
        label: 'IRS Publication 15-T (Federal Withholding Tables)',
        url: 'https://www.irs.gov/publications/p15t',
      },
      {
        label: 'Social Security Administration (2025 FICA Wage Base)',
        url: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf',
      },
    ],
  },
  'uk-paye-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025/26 UK Tax Year (6 April 2025 – 5 April 2026)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'GOV.UK — HMRC Income Tax Rates and Personal Allowances (2025/26)',
        url: 'https://www.gov.uk/income-tax-rates',
      },
      {
        label: 'GOV.UK — Scottish Income Tax Rates and Bands (2025/26)',
        url: 'https://www.gov.uk/scottish-income-tax',
      },
      {
        label: 'GOV.UK — Class 1 National Insurance Rates and Thresholds',
        url: 'https://www.gov.uk/national-insurance-rates-letters',
      },
    ],
  },
  'canada-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 Canada Tax Year (CRA Federal, Provincial, CPP/CPP2 & EI)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Canada Revenue Agency (CRA) — 2025 Canadian Income Tax Rates',
        url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
      },
      {
        label: 'CRA — 2025 CPP & Second Additional CPP (CPP2) Contribution Rates',
        url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html',
      },
      {
        label: 'CRA — 2025 Employment Insurance (EI) Premium Rates and Maximums',
        url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html',
      },
    ],
  },
  'india-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'FY 2025–26 (AY 2026–27) & FY 2024–25 — Finance Act 2025',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Income Tax Department (CBDT India) — Section 115BAC New vs Old Tax Regime Slabs',
        url: 'https://www.incometaxindia.gov.in/',
      },
      {
        label: 'Union Budget 2025–26 Finance Bill Memorandum (₹12L Sec 87A Rebate & ₹75k Std Deduction)',
        url: 'https://www.indiabudget.gov.in/',
      },
    ],
  },
  'in-hand-salary-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'FY 2025–26 (AY 2026–27) India Payroll & Section 115BAC',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Income Tax Department India — FY 2025–26 Salary TDS & Section 115BAC Slabs',
        url: 'https://www.incometaxindia.gov.in/',
      },
      {
        label: 'EPFO India — Employees’ Provident Fund Statutory Contribution Rules (12% Basic)',
        url: 'https://www.epfindia.gov.in/',
      },
    ],
  },
  'hra-exemption-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'FY 2025–26 (AY 2026–27) — Income Tax Act Section 10(13A) & Rule 2A',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Income Tax Department India — Section 10(13A) & Income Tax Rule 2A (HRA Exemption)',
        url: 'https://www.incometaxindia.gov.in/',
      },
    ],
  },
  'india-capital-gains-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'FY 2025–26 (Effective Post-23 July 2024 Finance (No. 2) Act Rules)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Income Tax Department India — Sections 111A, 112 & 112A Capital Gains Tax Schedule',
        url: 'https://www.incometaxindia.gov.in/',
      },
      {
        label: 'CBDT Cost Inflation Index (CII) Notifications (Base Year 2001–02 = 100)',
        url: 'https://www.incometaxindia.gov.in/Pages/utilities/Cost-Inflation-Index.aspx',
      },
    ],
  },
  'germany-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 German Tax Year (Veranlagungszeitraum 2025)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Bundesministerium der Finanzen (BMF) — § 32a EStG Income Tax Formula 2025',
        url: 'https://www.bundesfinanzministerium.de/',
      },
      {
        label: 'BMF Official Wage & Income Tax Reference (Lohn- und Einkommensteuerrechner)',
        url: 'https://www.bmf-steuerrechner.de/',
      },
    ],
  },
  'france-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 French Income Tax Schedule (Loi de finances pour 2025)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Direction générale des Finances publiques (DGFiP) — Barème de l’impôt sur le revenu 2025',
        url: 'https://www.impots.gouv.fr/particulier/calcul-de-limpot',
      },
      {
        label: 'URSSAF — Cotisations salariales et CSG/CRDS 2025',
        url: 'https://www.urssaf.fr/',
      },
    ],
  },
  'uae-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 UAE Tax & Labour Schedule (0% Personal Income Tax)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'UAE Federal Tax Authority (FTA) — Federal Decree-Law No. 47 of 2022',
        url: 'https://tax.gov.ae/en/',
      },
      {
        label: 'UAE Ministry of Human Resources and Emiratisation (MOHRE) — Federal Decree-Law No. 33 of 2021',
        url: 'https://www.mohre.gov.ae/en/home.aspx',
      },
    ],
  },
  'singapore-income-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'Year of Assessment (YA) 2025 & 2025 CPF Contribution Schedule',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'Inland Revenue Authority of Singapore (IRAS) — Individual Income Tax Rates (YA 2025)',
        url: 'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates',
      },
      {
        label: 'Central Provident Fund (CPF) Board — 2025 CPF Contribution Rates & Ordinary Wage Ceiling',
        url: 'https://www.cpf.gov.sg/employer/employer-obligations/how-much-cpf-contributions-to-pay',
      },
    ],
  },
  'self-employment-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 US Tax Year (Schedule SE & IRC § 1401 / § 199A)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Schedule SE (Form 1040) — Self-Employment Tax Instructions',
        url: 'https://www.irs.gov/forms-pubs/about-schedule-se-form-1040',
      },
      {
        label: 'IRS Revenue Procedure 2024-40 & SSA 2025 OASDI Wage Base ($176,100)',
        url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
      },
    ],
  },
  '1099-vs-w2-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 US Tax Year (IRS Schedule C, Schedule SE & Form W-2)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Revenue Procedure 2024-40 (2025 Federal Tax Brackets & Standard Deductions)',
        url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
      },
      {
        label: 'IRS Publication 334 (Tax Guide for Small Business & Schedule SE)',
        url: 'https://www.irs.gov/publications/p334',
      },
    ],
  },
  'bonus-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 US Tax Year (IRS Publication 15 Supplemental Wage Rules)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Publication 15 (Circular E, Employer’s Tax Guide — Section 7 Supplemental Wages)',
        url: 'https://www.irs.gov/publications/p15',
      },
      {
        label: 'SSA 2025 Social Security OASDI Wage Base ($176,100)',
        url: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf',
      },
    ],
  },
  'capital-gains-tax-calculator': {
    domain: 'tax',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 US Tax Year (IRS Rev. Proc. 2024-40 & IRC § 1(h) / § 1411)',
    disclaimer: DISCLAIMER_TAX,
    sources: [
      {
        label: 'IRS Topic No. 409 & Publication 550 (Capital Gains and Losses)',
        url: 'https://www.irs.gov/taxtopics/tc409',
      },
      {
        label: 'IRS Revenue Procedure 2024-40 (2025 0% / 15% / 20% Long-Term Capital Gains Thresholds)',
        url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
      },
    ],
  },

  // ============================================================================
  // RETIREMENT, LOANS & FINANCE CALCULATORS
  // ============================================================================
  '401k-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 IRS Contribution Limits (Notice 2024-80 & SECURE 2.0 Act)',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'IRS Notice 2024-80 (2025 401(k) Elective Deferral & SECURE 2.0 Catch-Up Limits)',
        url: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf',
      },
      {
        label: 'IRS Publication 560 & 401(k) Resource Guide',
        url: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits',
      },
    ],
  },
  'roth-vs-traditional-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025 & 2024 IRS Retirement Limits (Notice 2024-80 & Pub 590-A/B)',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'IRS Notice 2024-80 (2025 IRA & 401(k) Contribution and MAGI Phase-Out Limits)',
        url: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf',
      },
      {
        label: 'IRS Publication 590-A (Contributions to Individual Retirement Arrangements)',
        url: 'https://www.irs.gov/publications/p590a',
      },
    ],
  },
  'rmd-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Distribution Years (IRS Pub 590-B & SECURE 2.0 Act)',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'IRS Publication 590-B (Appendix B — Table III Uniform Lifetime & Table II Joint Life)',
        url: 'https://www.irs.gov/publications/p590b',
      },
      {
        label: 'Treasury Reg. § 1.401(a)(9)-9 (Life Expectancy and Distribution Period Tables)',
        url: 'https://www.ecfr.gov/current/title-26/chapter-I/subchapter-A/part-1/subject-group-ECFR6f8c3724b50e44d/section-1.401(a)(9)-9',
      },
    ],
  },
  'mortgage-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 U.S. Fixed-Rate Amortization & Escrow Standards',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'Consumer Financial Protection Bureau (CFPB) — Regulation Z (12 CFR Part 1026)',
        url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/',
      },
      {
        label: 'Federal Reserve — Consumer Guide to Mortgage Settlement & Amortization',
        url: 'https://www.federalreserve.gov/pubs/mortgage/mortb_1.htm',
      },
    ],
  },
  'loan-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Standard Amortization & APR Reference (12 CFR Part 1026)',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'CFPB Regulation Z (12 CFR Part 1026 Appendix J — Closed-End APR Equations)',
        url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/',
      },
    ],
  },
  'compound-interest-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Standard Compounding & Savings Equations',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'U.S. SEC Investor.gov — Compound Interest & Time Value of Money Principles',
        url: 'https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-compound-interest',
      },
      {
        label: 'CFPB Regulation DD (12 CFR Part 1030 — Truth in Savings APY Formula)',
        url: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/',
      },
    ],
  },
  'profit-margin-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'January 2025 NYU Stern (Damodaran) U.S. Industry Margin Dataset',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'Aswath Damodaran (NYU Stern School of Business) — Operating & Net Margins by Sector (Jan 2025)',
        url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html',
      },
    ],
  },
  'salary-to-hourly-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 U.S. Department of Labor FLSA 2,080-Hour Workyear Standard',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'U.S. Department of Labor (DOL) — Fair Labor Standards Act (FLSA) Hours Worked & Pay Conversion',
        url: 'https://www.dol.gov/agencies/whd/flsa',
      },
      {
        label: 'U.S. Office of Personnel Management (OPM) — 2,087-Hour / 2,080-Hour Hourly Rate Fact Sheet',
        url: 'https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/computing-hourly-rates-of-pay-using-the-2087-hour-divisor/',
      },
    ],
  },
  'overtime-pay-calculator': {
    domain: 'finance',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Federal FLSA (29 CFR Part 778) & California Labor Code § 510',
    disclaimer: DISCLAIMER_FINANCE,
    sources: [
      {
        label: 'U.S. Department of Labor — 29 CFR Part 778 (Overtime Compensation & Regular Rate of Pay)',
        url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778',
      },
    ],
  },

  // ============================================================================
  // HEALTH & FITNESS CALCULATORS
  // ============================================================================
  'bmi-calculator': {
    domain: 'health',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 WHO, CDC & NIH Adult Reference Standards',
    disclaimer: DISCLAIMER_HEALTH,
    sources: [
      {
        label: 'World Health Organization (WHO) — Obesity and Overweight Adult BMI Classification',
        url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
      },
      {
        label: 'U.S. Centers for Disease Control and Prevention (CDC) — About Adult BMI',
        url: 'https://www.cdc.gov/bmi/adult-calculator/index.html',
      },
      {
        label: 'National Heart, Lung, and Blood Institute (NHLBI / NIH) — BMI Classification Guidelines',
        url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm',
      },
    ],
  },
  'tdee-calculator': {
    domain: 'health',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Mifflin-St Jeor & FAO/WHO/UNU Activity Factor Standards',
    disclaimer: DISCLAIMER_HEALTH,
    sources: [
      {
        label: 'Mifflin MD, St Jeor ST et al. (1990) — A new predictive equation for resting energy expenditure (PubMed)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      },
      {
        label: 'Dietary Guidelines for Americans (USDA / HHS) — Adult Calorie & Energy Expenditure Reference',
        url: 'https://www.dietaryguidelines.gov/',
      },
    ],
  },
  'bmr-calculator': {
    domain: 'health',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Mifflin-St Jeor (1990) & Roza-Shizgal (1984) Reference Equations',
    disclaimer: DISCLAIMER_HEALTH,
    sources: [
      {
        label: 'Mifflin MD, St Jeor ST et al. (1990) — Am J Clin Nutr 51(2):241–247 (PubMed)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      },
      {
        label: 'Roza AM, Shizgal HM (1984) — The Harris Benedict equation reevaluated (PubMed)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/6741850/',
      },
    ],
  },
  'body-fat-calculator': {
    domain: 'health',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 U.S. Navy Circumference Method (Hodgdon & Beckett) & ACE Ranges',
    disclaimer: DISCLAIMER_HEALTH,
    sources: [
      {
        label: 'Hodgdon JA, Beckett MB (1984) — Naval Health Research Center Reports No. 84-29 & 84-30',
        url: 'https://apps.dtic.mil/sti/citations/ADA143890',
      },
      {
        label: 'NIH / NHLBI — Waist Circumference and Body Composition Health Assessment',
        url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm',
      },
    ],
  },
  'ideal-weight-calculator': {
    domain: 'health',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: '2025–2026 Devine (1974), Robinson (1983), Miller (1983) & WHO Reference Ranges',
    disclaimer: DISCLAIMER_HEALTH,
    sources: [
      {
        label: 'World Health Organization (WHO) — Adult Healthy BMI Weight Range (18.5–24.9 kg/m²)',
        url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
      },
      {
        label: 'Pai MP, Paloucek FP (2000) — The Origin of the "Ideal" Body Weight Equations (PubMed)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/10981254/',
      },
    ],
  },

  // ============================================================================
  // CONVERSIONS (NIST SP 811 CITATION)
  // ============================================================================
  'weight': {
    domain: 'conversion',
    lastUpdated: 'November 13, 2026',
    dataTaxYear: 'NIST Special Publication 811 (SI / International Pound Exact Factor)',
    sources: [
      {
        label: 'NIST Special Publication 811 — Guide for the Use of the International System of Units (SI)',
        url: 'https://www.nist.gov/pml/special-publication-811',
      },
    ],
  },
};

export function resolveToolTrustMetadata({
  slug,
  categoryHref,
  categoryName,
}: {
  slug: string;
  categoryHref?: string;
  categoryName?: string;
}): ToolTrustMetadata | null {
  if (SLUG_TRUST_MAP[slug]) {
    return SLUG_TRUST_MAP[slug];
  }

  const catLower = `${categoryHref || ''} ${categoryName || ''} ${slug}`.toLowerCase();

  if (
    catLower.includes('health') ||
    catLower.includes('bmi') ||
    catLower.includes('tdee') ||
    catLower.includes('bmr') ||
    catLower.includes('body-fat') ||
    catLower.includes('ideal-weight')
  ) {
    return {
      domain: 'health',
      lastUpdated: 'November 13, 2026',
      dataTaxYear: '2025–2026 WHO, CDC & NIH Adult Reference Standards',
      disclaimer: DISCLAIMER_HEALTH,
      sources: [
        {
          label: 'World Health Organization (WHO) — Adult BMI & Anthropometric Reference',
          url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
        },
        {
          label: 'Mifflin MD, St Jeor ST et al. (1990) — Resting Energy Expenditure Equation (PubMed)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
        },
        {
          label: 'CDC — Assessing Adult Weight & BMI',
          url: 'https://www.cdc.gov/bmi/adult-calculator/index.html',
        },
      ],
    };
  }

  if (
    catLower.includes('tax') ||
    catLower.includes('paye') ||
    catLower.includes('hra') ||
    catLower.includes('1099') ||
    catLower.includes('w2') ||
    catLower.includes('take-home') ||
    catLower.includes('in-hand')
  ) {
    return {
      domain: 'tax',
      lastUpdated: 'November 13, 2026',
      dataTaxYear: '2025 Statutory Tax Year (IRS / HMRC / CRA / CBDT)',
      disclaimer: DISCLAIMER_TAX,
      sources: [
        {
          label: 'IRS Revenue Procedure 2024-40 (2025 Federal Tax Brackets & Deductions)',
          url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf',
        },
        {
          label: 'Social Security Administration — 2025 OASDI Wage Base ($176,100)',
          url: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf',
        },
      ],
    };
  }

  if (
    catLower.includes('finance') ||
    catLower.includes('loan') ||
    catLower.includes('mortgage') ||
    catLower.includes('interest') ||
    catLower.includes('401k') ||
    catLower.includes('rmd') ||
    catLower.includes('roth') ||
    catLower.includes('margin') ||
    catLower.includes('markup') ||
    catLower.includes('break-even') ||
    catLower.includes('salary') ||
    catLower.includes('pay') ||
    catLower.includes('savings') ||
    catLower.includes('investment') ||
    catLower.includes('return') ||
    catLower.includes('withdrawal')
  ) {
    return {
      domain: 'finance',
      lastUpdated: 'November 13, 2026',
      dataTaxYear: '2025–2026 Financial & Statutory Reference Standards',
      disclaimer: DISCLAIMER_FINANCE,
      sources: [
        {
          label: 'CFPB Regulation Z (12 CFR Part 1026 — Truth in Lending & Amortization Standards)',
          url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/',
        },
        {
          label: 'U.S. SEC Investor.gov — Compound Interest & Time Value of Money Equations',
          url: 'https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-compound-interest',
        },
        {
          label: 'IRS Notice 2024-80 & Rev. Proc. 2024-40 (2025 Tax & Retirement Reference)',
          url: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf',
        },
      ],
    };
  }

  if (catLower.includes('conversion')) {
    return {
      domain: 'conversion',
      lastUpdated: 'November 13, 2026',
      dataTaxYear: 'NIST Special Publication 811 (SI Conversion Factors)',
      sources: [
        {
          label: 'NIST Special Publication 811 — Guide for the Use of the International System of Units (SI)',
          url: 'https://www.nist.gov/pml/special-publication-811',
        },
      ],
    };
  }

  return null;
}
