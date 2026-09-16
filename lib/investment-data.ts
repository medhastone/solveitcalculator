export type JurisdictionKey = 'india' | 'usa' | 'uk' | 'canada' | 'australia' | 'uae' | 'singapore';

export interface InvestmentConfig {
  slug: JurisdictionKey;
  name: string;
  flag: string;
  tabLabel: string;
  currency: string;
  code: string;
  badge: string;
  chipIndex: string;
  defaultReturn: number;
  defaultMonthly: number;
  sliderMonthlyMax: number;
  stepMonthly: number;
  cpi: number;
  taxName: string;
  taxRateLabel: string;
  taxDisclaimer: string;
  trustedSourceLabel: string;
  trustedSourceUrl: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  faqs: { question: string; answer: string }[];
  presets: number[];
}

export const investmentConfigData: Record<JurisdictionKey, InvestmentConfig> = {
  india: {
    slug: 'india',
    name: 'India',
    flag: '🇮🇳',
    tabLabel: 'India (SIP & Step-Up)',
    currency: '₹',
    code: 'INR',
    badge: 'India Edition: Mutual Fund SIP & Step-Up Workbench',
    chipIndex: 'Nifty 50 Index',
    defaultReturn: 12.5,
    defaultMonthly: 25000,
    sliderMonthlyMax: 200000,
    stepMonthly: 1000,
    cpi: 5.5,
    taxName: 'India LTCG Engine:',
    taxRateLabel: '12.5% > ₹1.25L/yr',
    taxDisclaimer: 'Statutory Disclosure (India AMFI/RBI): Projections apply month-beginning annuity formulas. FY 2024-25 Union Budget Section 112A provisions apply 12.5% Long-Term Capital Gains (LTCG) on Equity Mutual Funds for profits exceeding the ₹1,25,000 threshold. Index returns are based on 20-year rolling CAGR.',
    trustedSourceLabel: 'AMFI India Guidelines',
    trustedSourceUrl: 'https://www.amfiindia.com/',
    seoTitle: 'Step Up SIP Calculator with Annual Increment | Post-LTCG Return',
    seoDescription: 'Calculate actual mutual fund returns using our step up sip calculator with annual increment. Accurate sip return calculator after capital gains tax (LTCG).',
    heroTitle: 'Step Up SIP Calculator with Annual Increment',
    faqs: [
      { question: 'What is an SIP (Systematic Investment Plan)?', answer: 'An SIP is a method of investing a fixed sum regularly in a mutual fund scheme. It allows you to buy units on a given date each month, averaging out the market volatility over time.' },
      { question: 'Why use a step up sip calculator with annual increment?', answer: 'A step up sip calculator with annual increment helps you automatically align your investments with your rising income. Increasing your SIP by 10-15% annually boosts the long-term compounding effect drastically.' },
      { question: 'How accurate is this sip return calculator after capital gains tax?', answer: 'This sip return calculator after capital gains tax applies the 12.5% Long Term Capital Gains (LTCG) rule above ₹1.25 Lakhs, ensuring your maturity estimates reflect actual take-home wealth.' },
      { question: 'What are ELSS funds?', answer: 'Equity Linked Savings Schemes (ELSS) are tax-saving mutual funds under Section 80C of the Income Tax Act. They offer a deduction of up to ₹1.5 Lakhs per year and come with a mandatory 3-year lock-in period.' }
    ],
    presets: [5000, 10000, 25000, 50000, 100000]
  },
  usa: {
    slug: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    tabLabel: 'USA (DCA & S&P 500)',
    currency: '$',
    code: 'USD',
    badge: 'USA Edition: Dollar-Cost Averaging & 401(k) / Roth IRA',
    chipIndex: 'S&P 500 Large Cap',
    defaultReturn: 10.5,
    defaultMonthly: 1000,
    sliderMonthlyMax: 10000,
    stepMonthly: 100,
    cpi: 2.8,
    taxName: 'US Federal LTCG:',
    taxRateLabel: '15% Qualified CGT',
    taxDisclaimer: 'Statutory Disclosure (US SEC/FINRA): Projections adhere to FINRA guidelines. Standard taxable calculation estimates a 15% federal capital gains bracket. Roth IRA / 401(k) allocations may yield 100% tax-free growth upon qualified distribution after age 59½.',
    trustedSourceLabel: 'SEC Investor.gov',
    trustedSourceUrl: 'https://www.investor.gov/',
    seoTitle: 'DCA Return Calculator vs Lump Sum | Monthly DRIP Calculator',
    seoDescription: 'Interactive DCA return calculator vs lump sum comparison. Build long-term wealth with our recurring investment calculator with inflation and monthly dividend reinvestment drip scenarios.',
    heroTitle: 'DCA Return Calculator vs Lump Sum & DRIP Modeler',
    faqs: [
      { question: 'Should I use a DCA return calculator vs lump sum investing?', answer: 'Using a DCA return calculator vs lump sum comparison helps evaluate risk. While lump sum historically edges out slightly in bull markets, DCA (Dollar-Cost Averaging) minimizes downside volatility.' },
      { question: 'How do 401(k) and Traditional IRA contributions work?', answer: 'Contributions to Traditional 401(k)s and IRAs are typically tax-deductible, reducing your taxable income for the year. The investments grow tax-deferred until you withdraw them in retirement.' },
      { question: 'What is the advantage of a Roth IRA?', answer: 'Roth IRA contributions are made with after-tax dollars, meaning you do not get an upfront deduction. However, all growth and qualified withdrawals in retirement are 100% tax-free.' },
      { question: 'What are Long-Term Capital Gains taxes?', answer: 'Assets held for longer than one year are subject to long-term capital gains tax rates, which are generally lower (0%, 15%, or 20%) than ordinary income tax rates.' }
    ],
    presets: [250, 500, 1000, 2000, 5000]
  },
  uk: {
    slug: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    tabLabel: 'UK (ISA & RSP)',
    currency: '£',
    code: 'GBP',
    badge: 'UK Edition: Stocks & Shares ISA & SIPP Calculator',
    chipIndex: 'FTSE All-Share',
    defaultReturn: 8.0,
    defaultMonthly: 500,
    sliderMonthlyMax: 5000,
    stepMonthly: 50,
    cpi: 2.5,
    taxName: 'HMRC ISA Wrapper:',
    taxRateLabel: '0% Tax (£20k/yr ISA)',
    taxDisclaimer: 'Statutory Disclosure (HMRC Guidelines): Annual contributions under £20,000 per tax year sheltered inside a Stocks & Shares ISA are 100% exempt from UK Capital Gains and Dividend Tax. Non-sheltered taxable portfolios incur 20% CGT above annual allowance.',
    trustedSourceLabel: 'GOV.UK ISA Guidelines',
    trustedSourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    seoTitle: 'Regular Savings Plan Calculator: Stocks and Shares ISA',
    seoDescription: 'Use our regular savings plan calculator stocks and shares isa to model tax-free growth. Accurate monthly compound interest calculator with deposits for UK investors.',
    heroTitle: 'Regular Savings Plan Calculator: Stocks & Shares ISA',
    faqs: [
      { question: 'Is this a regular savings plan calculator stocks and shares isa?', answer: 'Yes, this functions as a regular savings plan calculator stocks and shares isa, specifically modeling the £20,000 tax-free allowance to map your exact tax-sheltered compounding over time.' },
      { question: 'Can I use this as a monthly compound interest calculator with deposits?', answer: 'Absolutely. It is built natively as a monthly compound interest calculator with deposits, applying compounding logic accurately at the start of each investment period.' },
      { question: 'How does Capital Gains Tax work outside an ISA?', answer: 'For investments held outside an ISA or pension, profits above the annual tax-free allowance (£3,000 for the 2024/25 tax year) are subject to Capital Gains Tax (typically 10% or 20% depending on your income band).' }
    ],
    presets: [100, 250, 500, 1000, 1666]
  },
  canada: {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    tabLabel: 'Canada (TFSA / RRSP)',
    currency: 'C$',
    code: 'CAD',
    badge: 'Canada Edition: TFSA & RRSP Pre-Authorized Contribution',
    chipIndex: 'TSX Composite',
    defaultReturn: 7.5,
    defaultMonthly: 600,
    sliderMonthlyMax: 6000,
    stepMonthly: 50,
    cpi: 2.6,
    taxName: 'CRA TFSA / RRSP:',
    taxRateLabel: '0% (TFSA Sheltered)',
    taxDisclaimer: 'Statutory Disclosure (CRA Standards): Modeled within Tax-Free Savings Account (TFSA) parameters where investment compounding and withdrawals are 100% exempt from Canadian income and capital gains inclusion.',
    trustedSourceLabel: 'CRA TFSA Guide',
    trustedSourceUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html',
    seoTitle: 'TFSA Monthly Contribution Calculator | Compound Return Tool',
    seoDescription: 'Forecast your tax-free wealth trajectory with our precise TFSA monthly contribution calculator. Adjust for inflation and model exponential RRSP & TFSA compounding.',
    heroTitle: 'TFSA Monthly Contribution & RRSP Compounding Calculator',
    faqs: [
      { question: 'How do I use this TFSA monthly contribution calculator?', answer: 'Use this TFSA monthly contribution calculator to model regular deposits. It automatically calculates the long-term tax-free growth trajectory within your CRA limits.' },
      { question: 'How does an RRSP differ from a TFSA?', answer: 'A Registered Retirement Savings Plan (RRSP) provides an immediate tax deduction on contributions. Investments grow tax-deferred, but withdrawals in retirement are taxed as ordinary income.' },
      { question: 'What is the Capital Gains inclusion rate?', answer: 'For investments in unregistered accounts, 50% of the capital gain is added to your taxable income for the year and taxed at your marginal tax rate.' }
    ],
    presets: [150, 300, 600, 1200, 2500]
  },
  australia: {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    tabLabel: 'Australia (Super & Managed)',
    currency: 'A$',
    code: 'AUD',
    badge: 'Australia Edition: Superannuation & ASX 200 Accumulator',
    chipIndex: 'ASX 200 Gross',
    defaultReturn: 9.0,
    defaultMonthly: 800,
    sliderMonthlyMax: 8000,
    stepMonthly: 50,
    cpi: 3.2,
    taxName: 'ATO Super / CGT:',
    taxRateLabel: '15% Concessional',
    taxDisclaimer: 'Statutory Disclosure (ATO / ASIC): Concessional super contributions and investment income inside complying funds are taxed at the 15% rate. Long-term individual holdings receive the statutory 50% CGT discount.',
    trustedSourceLabel: 'ATO Superannuation',
    trustedSourceUrl: 'https://www.ato.gov.au/Individuals/Super/',
    seoTitle: 'ASX Dollar Cost Averaging Calculator | Superannuation ROI',
    seoDescription: 'Model your ETF portfolio with our ASX dollar cost averaging calculator. Project superannuation returns, concessional tax rates, and the ATO 50% CGT discount.',
    heroTitle: 'ASX Dollar Cost Averaging & Superannuation Calculator',
    faqs: [
      { question: 'Does this work as an ASX dollar cost averaging calculator?', answer: 'Yes, this is an accurate ASX dollar cost averaging calculator. It models periodic investments into index funds (like the ASX 200) with local superannuation and 50% CGT discount tax rules applied.' },
      { question: 'What are Concessional Contributions?', answer: 'These are before-tax contributions to your super (like employer contributions or salary sacrifice) and are generally taxed at a concessional rate of 15%.' },
      { question: 'What is the CGT Discount?', answer: 'For assets held outside of superannuation for more than 12 months, individual Australian taxpayers can apply a 50% discount on capital gains, halving the taxable amount.' }
    ],
    presets: [200, 500, 800, 1500, 3000]
  },
  singapore: {
    slug: 'singapore',
    name: 'Singapore',
    flag: '🇸🇬',
    tabLabel: 'Singapore (RSP & CPF)',
    currency: 'S$',
    code: 'SGD',
    badge: 'Singapore Edition: Regular Savings Plan & CPF Modeler',
    chipIndex: 'Straits Times Index',
    defaultReturn: 6.5,
    defaultMonthly: 1000,
    sliderMonthlyMax: 10000,
    stepMonthly: 100,
    cpi: 3.0,
    taxName: 'MAS Capital Gains:',
    taxRateLabel: '0% Tax',
    taxDisclaimer: 'Statutory Disclosure (IRAS): Singapore does not impose capital gains tax. Investment income, including dividends and capital gains from RSPs or standard brokerage accounts, are generally tax-exempt for individuals.',
    trustedSourceLabel: 'IRAS Singapore',
    trustedSourceUrl: 'https://www.iras.gov.sg/taxes/individual-income-tax',
    seoTitle: 'RSP Calculator Singapore | POSB & OCBC Regular Savings Plan',
    seoDescription: 'Optimize your DBS, POSB, or OCBC RSP with our dedicated RSP calculator Singapore. Simulate 0% capital gains tax compounding on Straits Times Index & REITs.',
    heroTitle: 'RSP Calculator Singapore for POSB & OCBC Plans',
    faqs: [
      { question: 'Is this an RSP calculator Singapore / POSB OCBC RSP calculator?', answer: 'Yes, this acts as a highly accurate RSP calculator Singapore. It is perfectly suited for modeling POSB, OCBC, or DBS Regular Savings Plans (RSP) targeting local REITs, ETFs, or the STI.' },
      { question: 'Does Singapore tax investment capital gains?', answer: 'No, there is generally no capital gains tax in Singapore. Most investment profits from unit trusts, RSPs, and stocks are completely tax-exempt for retail investors.' }
    ],
    presets: [500, 1000, 2000, 3000, 5000]
  },
  uae: {
    slug: 'uae',
    name: 'UAE',
    flag: '🇦🇪',
    tabLabel: 'UAE (NRI FX Arbitrage)',
    currency: 'AED',
    code: 'AED',
    badge: 'UAE & NRI Edition: Cross-Border AED-to-INR Compounding Engine',
    chipIndex: 'Global Mixed Basket',
    defaultReturn: 11.0,
    defaultMonthly: 3000,
    sliderMonthlyMax: 30000,
    stepMonthly: 250,
    cpi: 2.4,
    taxName: 'UAE Tax Jurisdiction:',
    taxRateLabel: '0% Personal Tax',
    taxDisclaimer: 'Statutory Disclosure (UAE/RBI FEMA): UAE zero-tax regime guarantees 0% local taxation on global dividends and capital gains. Repatriation to Indian NRE accounts is exempt from Indian income taxation under current FEMA regulations.',
    trustedSourceLabel: 'UAE Ministry of Finance',
    trustedSourceUrl: 'https://mof.gov.ae/',
    seoTitle: 'NRI SIP Calculator AED to INR | SIP Calculator for UAE Residents',
    seoDescription: 'Leverage zero-tax rules with the top SIP calculator for UAE residents. Accurate NRI SIP calculator AED to INR to model aggressive FX arbitrage returns.',
    heroTitle: 'NRI SIP Calculator AED to INR for UAE Residents',
    faqs: [
      { question: 'Is this an NRI SIP calculator AED to INR?', answer: 'Yes, this functions perfectly as an NRI SIP calculator AED to INR. It allows you to project investments directly in Dirhams while targeting high-yield Indian markets.' },
      { question: 'Why is this the best SIP calculator for UAE residents?', answer: 'This SIP calculator for UAE residents strictly factors in the 0% personal tax regime locally, making it ideal for modeling 100% tax-free global returns and multi-currency FX arbitrage.' },
      { question: 'How does FX Arbitrage work for NRIs?', answer: 'NRIs often invest in higher-yielding Indian assets (like Nifty 50 or Indian FDs) using UAE savings. If the Indian asset yield outpaces the depreciation of the INR against the AED, the investor captures an arbitrage spread.' }
    ],
    presets: [1000, 2000, 3000, 5000, 10000]
  }
};
