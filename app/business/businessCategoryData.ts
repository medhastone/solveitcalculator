export interface BusinessTool {
  id: string;
  name: string;
  description: string;
  href: string;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  formula?: string;
  inputs?: string[];
  output?: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  iconName: string;
  tools: BusinessTool[];
}

export interface MarginMarkupRow {
  cost: number;
  markupPercent: number;
  price: number;
  profit: number;
  marginPercent: number;
  description: string;
}

export interface SaaSBenchmark {
  metric: string;
  good: string;
  great: string;
  worldClass: string;
  description: string;
  impact: string;
}

export interface FinancialRatio {
  category: string;
  name: string;
  formula: string;
  idealRange: string;
  interpretation: string;
}

export interface RoleWorkbench {
  id: string;
  title: string;
  role: string;
  description: string;
  icon: string;
  toolSlugs: string[];
}

export interface BusinessFaq {
  question: string;
  answer: string;
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'pricing-margins',
    name: 'Pricing Strategy & Margins',
    slug: 'pricing-margins',
    tagline: 'Optimize unit pricing, keystone markups, and profit margins',
    description:
      'Set profitable pricing models, calculate gross and contribution margins, and convert between markups and margin percentages with precision.',
    iconName: 'Percent',
    tools: [
      {
        id: 'profit-margin-calculator',
        name: 'Profit Margin Calculator',
        description: 'Calculate gross profit, net profit margin percentage, and markup from cost and revenue.',
        href: '/business/profit-margin-calculator',
        badge: 'Essential',
        isPopular: true,
        isFeatured: true,
        formula: 'Margin = ((Revenue - Cost) / Revenue) × 100',
        inputs: ['Cost of Goods Sold ($)', 'Selling Price ($)'],
        output: 'Gross Margin %, Net Profit ($), Markup %',
      },
      {
        id: 'markup-calculator',
        name: 'Markup Calculator',
        description: 'Determine exact selling prices based on product cost and target markup percentages.',
        href: '/business/markup-calculator',
        badge: 'Retail',
        isPopular: true,
        formula: 'Price = Cost × (1 + Markup% / 100)',
        inputs: ['Wholesale Cost ($)', 'Desired Markup (%)'],
        output: 'Selling Price ($), Gross Profit ($)',
      },
      {
        id: 'contribution-margin-calculator',
        name: 'Contribution Margin Calculator',
        description: 'Measure profitability on individual products after deducting variable production costs.',
        href: '/business/contribution-margin-calculator',
        isPopular: true,
        formula: 'CM = (Revenue - Variable Costs) / Revenue',
        inputs: ['Unit Price ($)', 'Unit Variable Cost ($)'],
        output: 'Contribution Margin ($ and %)',
      },
      {
        id: 'keystone-pricing-calculator',
        name: 'Keystone Pricing Calculator',
        description: 'Standard retail 50% gross margin rule calculation and tiered wholesale pricing tiers.',
        href: '/business/keystone-pricing-calculator',
        inputs: ['Manufacture Cost ($)', 'Wholesale Tier (%)'],
        output: 'Wholesale Price ($), MSRP ($)',
      },
      {
        id: 'discount-and-rebate-calculator',
        name: 'Volume Discount & Rebate Calculator',
        description: 'Model tiered quantity pricing, cash terms discounts (e.g., 2/10 Net 30), and channel rebates.',
        href: '/business/discount-calculator',
        inputs: ['List Price ($)', 'Tier Volume', 'Discount %'],
        output: 'Net Invoice Price ($), Realized Margin %',
      },
      {
        id: 'dynamic-surge-pricing-calculator',
        name: 'Demand Elasticity & Pricing Calculator',
        description: 'Analyze price elasticity of demand (PED) to maximize total gross revenue.',
        href: '/business/price-elasticity-calculator',
        inputs: ['Base Price ($)', 'Base Volume', 'Price Change (%)', 'Elasticity Coeff'],
        output: 'Forecasted Quantity, Projected Total Revenue',
      },
    ],
  },
  {
    id: 'startups-saas',
    name: 'Startups & SaaS Metrics',
    slug: 'startups-saas',
    tagline: 'Venture economics, subscription churn, and CAC payback',
    description:
      'Evaluate customer lifetime value (LTV), customer acquisition cost (CAC), monthly recurring revenue (MRR) expansion, and investor deck KPIs.',
    iconName: 'Rocket',
    tools: [
      {
        id: 'saas-ltv-cac-calculator',
        name: 'SaaS LTV to CAC Calculator',
        description: 'Compute Customer Lifetime Value to CAC ratio and determine cohort growth sustainability.',
        href: '/business/saas-ltv-cac-calculator',
        badge: 'Venture KPI',
        isPopular: true,
        isFeatured: true,
        formula: 'LTV = (ARPU × Gross Margin%) / Churn Rate',
        inputs: ['Monthly ARPU ($)', 'Gross Margin %', 'Monthly Churn %', 'Blended CAC ($)'],
        output: 'LTV ($), LTV:CAC Ratio, Health Status',
      },
      {
        id: 'cac-payback-period-calculator',
        name: 'CAC Payback Period Calculator',
        description: 'Determine the number of months required to recover the cost of acquiring new customers.',
        href: '/business/cac-payback-calculator',
        badge: 'SaaS Core',
        isPopular: true,
        formula: 'Payback (Months) = CAC / (ARPU × Gross Margin %)',
        inputs: ['CAC ($)', 'Monthly ARPU ($)', 'Subscription Margin %'],
        output: 'Months to Capital Recovery',
      },
      {
        id: 'churn-rate-calculator',
        name: 'Customer & Revenue Churn Calculator',
        description: 'Track logo churn vs net revenue churn (NRR) including upgrades and contractions.',
        href: '/business/churn-rate-calculator',
        isPopular: true,
        formula: 'Logo Churn = (Lost Customers / Starting Customers) × 100',
        inputs: ['Beginning Customers', 'Lost Customers', 'Starting MRR', 'Expansion MRR'],
        output: 'Logo Churn %, Net Revenue Retention (NRR %)',
      },
      {
        id: 'mrr-arr-growth-calculator',
        name: 'MRR & ARR Waterfall Forecaster',
        description: 'Simulate monthly recurring revenue trajectories with new bookings, expansion, and churn.',
        href: '/business/mrr-arr-calculator',
        inputs: ['Starting MRR ($)', 'New MRR ($)', 'Expansion ($)', 'Churned MRR ($)'],
        output: 'Net New MRR ($), Ending ARR ($), Annual Growth %',
      },
      {
        id: 'saas-magic-number-calculator',
        name: 'SaaS Magic Number & Sales Efficiency',
        description: 'Measure sales and marketing efficiency in generating net new recurring revenue.',
        href: '/business/saas-magic-number-calculator',
        formula: 'Magic Number = (Q_n ARR - Q_n-1 ARR) / Q_n-1 S&M Expense',
        inputs: ['Current Quarter ARR', 'Prior Quarter ARR', 'Prior Q Sales & Marketing Expense'],
        output: 'Magic Number, Efficiency Tier',
      },
      {
        id: 'burn-multiple-calculator',
        name: 'Burn Multiple Calculator',
        description: 'Venture capital capital-efficiency metric: Net Burn divided by Net New ARR added.',
        href: '/business/burn-multiple-calculator',
        inputs: ['Net Burn in Period ($)', 'Net New ARR Added ($)'],
        output: 'Burn Multiple (e.g. 1.2x = Efficient)',
      },
    ],
  },
  {
    id: 'cash-flow-runway',
    name: 'Cash Flow, Burn Rate & Runway',
    slug: 'cash-flow-runway',
    tagline: 'Manage liquidity, cash burn, and zero-cash date projections',
    description:
      'Forecast financial runway, monitor monthly gross and net cash burn, and model operating liquidity reserves under various growth scenarios.',
    iconName: 'Flame',
    tools: [
      {
        id: 'cash-runway-calculator',
        name: 'Startup Cash Runway Calculator',
        description: 'Calculate remaining survival months based on cash reserves, revenues, and operating expenses.',
        href: '/business/cash-runway-calculator',
        badge: 'Founders',
        isPopular: true,
        isFeatured: true,
        formula: 'Runway (Months) = Cash Balance / Net Monthly Burn',
        inputs: ['Cash in Bank ($)', 'Monthly Operating Expenses ($)', 'Monthly Revenue ($)'],
        output: 'Runway (Months), Zero Cash Date',
      },
      {
        id: 'burn-rate-calculator',
        name: 'Gross vs Net Burn Rate Calculator',
        description: 'Separate total monthly operating spend (gross burn) from cash lost after receipts (net burn).',
        href: '/business/burn-rate-calculator',
        isPopular: true,
        formula: 'Net Burn = Gross Cash Outflows - Cash Inflows',
        inputs: ['Payroll ($)', 'Server/SaaS ($)', 'Rent ($)', 'Cash Receipts ($)'],
        output: 'Gross Burn ($/mo), Net Burn ($/mo)',
      },
      {
        id: 'working-capital-cycle-calculator',
        name: 'Working Capital & Cash Conversion Cycle (CCC)',
        description: 'Measure Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Days Payable (DPO).',
        href: '/business/cash-conversion-cycle-calculator',
        badge: 'Treasury',
        formula: 'CCC = DIO + DSO - DPO',
        inputs: ['Days Inventory (DIO)', 'Days Receivables (DSO)', 'Days Payables (DPO)'],
        output: 'Cash Conversion Cycle (Days)',
      },
      {
        id: 'operating-cash-flow-calculator',
        name: 'Operating Cash Flow (OCF) Estimator',
        description: 'Convert Net Income into true operational cash flow by adjusting for D&A and working capital changes.',
        href: '/business/operating-cash-flow-calculator',
        inputs: ['Net Income ($)', 'Depreciation ($)', 'Δ Working Capital ($)'],
        output: 'Operating Cash Flow ($)',
      },
      {
        id: 'free-cash-flow-firm-calculator',
        name: 'Free Cash Flow to Firm (FCFF) Calculator',
        description: 'Calculate unlevered cash flow available to all capital providers after CapEx investments.',
        href: '/business/fcff-calculator',
        formula: 'FCFF = EBIT × (1 - Tax Rate) + D&A - CapEx - ΔNWC',
        inputs: ['EBIT ($)', 'Tax Rate (%)', 'CapEx ($)', 'Depreciation ($)', 'Δ Working Capital ($)'],
        output: 'FCFF ($)',
      },
    ],
  },
  {
    id: 'corporate-finance',
    name: 'Corporate Finance & Ratios',
    slug: 'corporate-finance',
    tagline: 'DuPont analysis, liquidity, leverage, and profitability ratios',
    description:
      'Perform institutional financial statement analysis with standard ratios including Return on Equity (ROE), Debt-to-Equity, and Current Ratios.',
    iconName: 'BarChart3',
    tools: [
      {
        id: 'dupont-roe-calculator',
        name: '3-Step & 5-Step DuPont ROE Analyzer',
        description: 'Decompose Return on Equity into Operating Margin, Asset Turnover, and Financial Leverage.',
        href: '/business/dupont-roe-calculator',
        badge: 'CFO Suite',
        isPopular: true,
        isFeatured: true,
        formula: 'ROE = (Net Income/Revenue) × (Revenue/Assets) × (Assets/Equity)',
        inputs: ['Net Income ($)', 'Revenue ($)', 'Total Assets ($)', 'Shareholders Equity ($)'],
        output: 'ROE %, Net Margin %, Asset Turnover, Equity Multiplier',
      },
      {
        id: 'ebitda-calculator',
        name: 'EBITDA & Adjusted EBITDA Calculator',
        description: 'Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization with normalization adds.',
        href: '/business/ebitda-calculator',
        isPopular: true,
        formula: 'EBITDA = Operating Income + Depreciation + Amortization',
        inputs: ['Net Income ($)', 'Interest ($)', 'Taxes ($)', 'D&A ($)', 'One-time Adjustments ($)'],
        output: 'EBITDA ($), EBITDA Margin %',
      },
      {
        id: 'current-quick-ratio-calculator',
        name: 'Current & Quick Liquidity Ratio Calculator',
        description: 'Assess short-term solvency and ability to cover near-term obligations without selling inventory.',
        href: '/business/current-quick-ratio-calculator',
        formula: 'Quick Ratio = (Cash + Marketable Securities + A/R) / Current Liabilities',
        inputs: ['Cash ($)', 'A/R ($)', 'Inventory ($)', 'Current Liabilities ($)'],
        output: 'Current Ratio, Acid-Test Quick Ratio',
      },
      {
        id: 'debt-to-equity-calculator',
        name: 'Debt-to-Equity & Leverage Ratios',
        description: 'Measure corporate capital structure risk, financial leverage, and interest coverage ratios.',
        href: '/business/debt-to-equity-calculator',
        formula: 'D/E = Total Debt / Total Shareholders Equity',
        inputs: ['Short-Term Debt ($)', 'Long-Term Debt ($)', 'Total Equity ($)', 'EBIT ($)', 'Interest ($)'],
        output: 'D/E Ratio, Interest Coverage Ratio (TIE)',
      },
      {
        id: 'wacc-calculator',
        name: 'Weighted Average Cost of Capital (WACC)',
        description: 'Calculate firm hurdle rate combining cost of equity (CAPM) and after-tax cost of debt.',
        href: '/business/wacc-calculator',
        formula: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))',
        inputs: ['Market Value Equity', 'Market Value Debt', 'Cost of Equity %', 'Cost of Debt %', 'Tax Rate %'],
        output: 'WACC Discount Rate %',
      },
      {
        id: 'return-on-invested-capital-calculator',
        name: 'ROIC & Economic Value Added (EVA)',
        description: 'Assess return generated on all deployed capital relative to WACC hurdle rates.',
        href: '/business/roic-calculator',
        formula: 'ROIC = NOPAT / Invested Capital',
        inputs: ['Operating Profit ($)', 'Tax Rate (%)', 'Total Debt ($)', 'Total Equity ($)', 'Cash ($)'],
        output: 'ROIC %, Value Creation Spread',
      },
    ],
  },
  {
    id: 'operations-breakeven',
    name: 'Break-Even & Cost-Volume-Profit',
    slug: 'operations-breakeven',
    tagline: 'Break-even point, margin of safety, and capacity utilization',
    description:
      'Perform cost-volume-profit (CVP) simulations to determine minimum sales required to cover fixed overhead and target desired profit levels.',
    iconName: 'Scale',
    tools: [
      {
        id: 'break-even-calculator',
        name: 'Break-Even Point Calculator',
        description: 'Find required unit volume and dollar revenue to cover all fixed and variable operating costs.',
        href: '/business/break-even-calculator',
        badge: 'Managerial',
        isPopular: true,
        isFeatured: true,
        formula: 'Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit)',
        inputs: ['Total Fixed Costs ($)', 'Sale Price Per Unit ($)', 'Variable Cost Per Unit ($)'],
        output: 'Break-Even Units, Break-Even Revenue ($)',
      },
      {
        id: 'margin-of-safety-calculator',
        name: 'Margin of Safety Calculator',
        description: 'Determine the percentage revenue can decline before a business begins operating at a loss.',
        href: '/business/margin-of-safety-calculator',
        isPopular: true,
        formula: 'Margin of Safety % = ((Current Sales - Break-Even Sales) / Current Sales) × 100',
        inputs: ['Current Expected Sales ($)', 'Break-Even Sales ($)'],
        output: 'Margin of Safety ($ and %)',
      },
      {
        id: 'target-profit-volume-calculator',
        name: 'Target Profit Volume Solver',
        description: 'Calculate unit sales necessary to achieve a specific target dollar operating income.',
        href: '/business/target-profit-calculator',
        formula: 'Target Units = (Fixed Costs + Desired Profit) / Unit Contribution Margin',
        inputs: ['Fixed Costs ($)', 'Target Profit ($)', 'Unit Price ($)', 'Unit Variable Cost ($)'],
        output: 'Required Unit Sales, Required Total Revenue ($)',
      },
      {
        id: 'operating-leverage-calculator',
        name: 'Degree of Operating Leverage (DOL)',
        description: 'Measure how sensitive operating income is to percentage changes in sales volume.',
        href: '/business/operating-leverage-calculator',
        formula: 'DOL = Contribution Margin / Net Operating Income',
        inputs: ['Gross Revenue ($)', 'Variable Costs ($)', 'Fixed Costs ($)'],
        output: 'DOL Multiplier (e.g. 2.5x)',
      },
      {
        id: 'overhead-allocation-calculator',
        name: 'Activity-Based Overhead Allocation Calculator',
        description: 'Apportion indirect factory and administrative overhead across product lines.',
        href: '/business/overhead-allocation-calculator',
        inputs: ['Total Overhead Pool ($)', 'Cost Driver Units', 'Product Allocation Activity'],
        output: 'Overhead Rate ($/unit), Fully Absorbed Cost',
      },
    ],
  },
  {
    id: 'freelance-workforce',
    name: 'Freelance, Payroll & Human Capital',
    slug: 'freelance-workforce',
    tagline: 'Billable hourly rates, meeting costs, and employee burden',
    description:
      'Price consulting services, calculate true fully burdened employee labor costs, and estimate the real-time financial cost of business meetings.',
    iconName: 'Briefcase',
    tools: [
      {
        id: 'freelance-hourly-rate-calculator',
        name: 'Freelance Billable Hourly Rate Calculator',
        description: 'Determine target hourly consulting rates accounting for taxes, unbillable time, and overhead.',
        href: '/freelance-hourly-rate-calculator',
        badge: 'Freelancers',
        isPopular: true,
        isFeatured: true,
        formula: 'Rate = (Target Income + Expenses + Taxes) / (Annual Billable Hours)',
        inputs: ['Desired Take-Home ($)', 'Business Overhead ($)', 'Billable Hours/Week', 'Vacation Weeks'],
        output: 'Minimum Hourly Rate ($/hr), Day Rate ($)',
      },
      {
        id: 'meeting-cost-calculator',
        name: 'Real-Time Meeting Cost Calculator',
        description: 'Track the cumulative financial cost of team meetings based on participant salaries.',
        href: '/meeting-cost-calculator',
        badge: 'Productivity',
        isPopular: true,
        formula: 'Cost = Σ (Participant Hourly Rate × Meeting Duration)',
        inputs: ['Number of Attendees', 'Average Annual Salary ($)', 'Meeting Duration (Mins)'],
        output: 'Total Meeting Cost ($), Burn Rate ($/min)',
      },
      {
        id: 'billable-hours-calculator',
        name: 'Billable Hours & Utilization Calculator',
        description: 'Measure team billable utilization rate against target agency billability benchmarks.',
        href: '/billable-hours-calculator',
        isPopular: true,
        formula: 'Utilization % = (Billable Hours / Total Available Work Hours) × 100',
        inputs: ['Logged Billable Hours', 'Total Working Hours in Period'],
        output: 'Utilization Rate %, Realized Revenue',
      },
      {
        id: 'employee-burden-rate-calculator',
        name: 'Fully Burdened Labor Cost Calculator',
        description: 'Calculate real employee cost including payroll taxes, health benefits, 401(k), and equipment.',
        href: '/business/employee-burden-calculator',
        formula: 'Burdened Cost = Base Salary + Taxes + Benefits + Overhead',
        inputs: ['Base Salary ($)', 'Health Insurance ($)', 'Payroll Tax Rate (%)', 'Equipment & Perks ($)'],
        output: 'Fully Burdened Cost ($), Burden Multiplier (e.g. 1.28x)',
      },
      {
        id: 'employee-turnover-cost-calculator',
        name: 'Employee Turnover Cost Calculator',
        description: 'Estimate total replacement cost including recruiting, onboarding lag, and lost productivity.',
        href: '/business/employee-turnover-calculator',
        inputs: ['Departing Employee Salary ($)', 'Recruiting Fees ($)', 'Ramp-up Months'],
        output: 'Estimated Replacement Cost ($)',
      },
    ],
  },
  {
    id: 'valuation-investment',
    name: 'Valuation & Investment Yield',
    slug: 'valuation-investment',
    tagline: 'DCF valuation, startup dilution, and ROI yields',
    description:
      'Perform discounted cash flow (DCF) intrinsic valuations, calculate investment internal rates of return (IRR), and model equity dilution.',
    iconName: 'TrendingUp',
    tools: [
      {
        id: 'dcf-valuation-calculator',
        name: 'Discounted Cash Flow (DCF) Calculator',
        description: 'Estimate intrinsic business enterprise value based on projected cash flows and terminal value.',
        href: '/business/dcf-valuation-calculator',
        badge: 'M&A',
        isPopular: true,
        isFeatured: true,
        formula: 'NPV = Σ [CF_t / (1 + r)^t] + [Terminal Value / (1 + r)^n]',
        inputs: ['5-Year Projected Cash Flows', 'Discount Rate (WACC %)', 'Perpetual Growth Rate (%)'],
        output: 'Enterprise Value ($), Implied Share Price',
      },
      {
        id: 'startup-dilution-calculator',
        name: 'Startup Cap Table & Equity Dilution Calculator',
        description: 'Model post-money valuation, investor ownership percentages, and ESOP pool expansion.',
        href: '/business/startup-dilution-calculator',
        badge: 'Founders',
        isPopular: true,
        formula: 'Investor Ownership % = Investment Amount / Post-Money Valuation',
        inputs: ['Pre-Money Valuation ($)', 'Investment Amount ($)', 'Option Pool Increase %'],
        output: 'Post-Money Valuation ($), Dilution %',
      },
      {
        id: 'business-roi-calculator',
        name: 'Business ROI & Payback Period Calculator',
        description: 'Measure return on investment yield and capital payback period for capital expenditures.',
        href: '/business/roi-calculator',
        isPopular: true,
        formula: 'ROI % = ((Net Return - Initial Cost) / Initial Cost) × 100',
        inputs: ['Initial Capital Outlay ($)', 'Net Annual Gain ($)', 'Investment Horizon (Years)'],
        output: 'ROI %, Annualized Yield %, Simple Payback (Years)',
      },
      {
        id: 'net-present-value-irr-calculator',
        name: 'NPV & IRR Project Decision Calculator',
        description: 'Compare multi-year capital projects using Net Present Value and Internal Rate of Return.',
        href: '/business/npv-irr-calculator',
        formula: 'NPV = -Initial Outlay + Σ [CF_t / (1 + r)^t]',
        inputs: ['Initial Investment ($)', 'Annual Cash Flows ($)', 'Hurdle Rate (%)'],
        output: 'NPV ($), Internal Rate of Return (IRR %)',
      },
      {
        id: 'business-valuation-multiples-calculator',
        name: 'Valuation Multiples (EV/EBITDA & P/S) Calculator',
        description: 'Value private businesses based on industry peer revenue and EBITDA transaction multiples.',
        href: '/business/valuation-multiples-calculator',
        inputs: ['Annual Revenue ($)', 'Annual EBITDA ($)', 'Industry EV/EBITDA Multiple', 'EV/Sales Multiple'],
        output: 'Implied Valuation Range ($)',
      },
    ],
  },
  {
    id: 'operations-logistics',
    name: 'Inventory, Supply Chain & Operations',
    slug: 'operations-logistics',
    tagline: 'Economic Order Quantity (EOQ), inventory turns, and safety stock',
    description:
      'Optimize warehouse holding costs, reorder triggers, inventory turnover ratios, and supply chain working capital.',
    iconName: 'Boxes',
    tools: [
      {
        id: 'economic-order-quantity-calculator',
        name: 'Economic Order Quantity (EOQ) Calculator',
        description: 'Minimize total inventory holding costs and ordering setup costs with the classic Wilson EOQ model.',
        href: '/business/eoq-calculator',
        badge: 'Supply Chain',
        isPopular: true,
        formula: 'EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost per Unit)',
        inputs: ['Annual Unit Demand', 'Order Setup Cost ($)', 'Annual Unit Holding Cost ($)'],
        output: 'Optimal Order Quantity (Units), Total Inventory Cost ($)',
      },
      {
        id: 'inventory-turnover-calculator',
        name: 'Inventory Turnover & Days Sales of Inventory (DSI)',
        description: 'Assess how many times inventory is sold and replaced over a year.',
        href: '/business/inventory-turnover-calculator',
        formula: 'Inventory Turnover = COGS / Average Inventory',
        inputs: ['Cost of Goods Sold ($)', 'Beginning Inventory ($)', 'Ending Inventory ($)'],
        output: 'Turnover Ratio (X/yr), Days Sales of Inventory (DSI)',
      },
      {
        id: 'reorder-point-safety-stock-calculator',
        name: 'Reorder Point (ROP) & Safety Stock Calculator',
        description: 'Prevent out-of-stock events by determining precise restock trigger levels under demand volatility.',
        href: '/business/reorder-point-calculator',
        formula: 'ROP = (Lead Time Demand) + Safety Stock',
        inputs: ['Average Daily Demand', 'Lead Time (Days)', 'Service Level Z-Score', 'Demand Std Dev'],
        output: 'Reorder Point (Units), Buffer Safety Stock (Units)',
      },
      {
        id: 'shrinkage-calculator',
        name: 'Retail & Warehouse Inventory Shrinkage Calculator',
        description: 'Quantify stock loss resulting from shoplifting, vendor fraud, and inventory damage.',
        href: '/business/inventory-shrinkage-calculator',
        inputs: ['Booked Inventory Value ($)', 'Physical Count Value ($)', 'Total Retail Sales ($)'],
        output: 'Shrinkage ($), Shrinkage Rate % of Sales',
      },
    ],
  },
];

export const MARGIN_MARKUP_TABLE: MarginMarkupRow[] = [
  { cost: 100, markupPercent: 5.26, price: 105.26, profit: 5.26, marginPercent: 5.0, description: 'High-volume commodities / wholesale groceries' },
  { cost: 100, markupPercent: 11.11, price: 111.11, profit: 11.11, marginPercent: 10.0, description: 'Consumer electronics & hardware distribution' },
  { cost: 100, markupPercent: 17.65, price: 117.65, profit: 17.65, marginPercent: 15.0, description: 'Automotive parts & large appliances' },
  { cost: 100, markupPercent: 25.0, price: 125.0, profit: 25.0, marginPercent: 20.0, description: 'General retail & industrial supply' },
  { cost: 100, markupPercent: 33.33, price: 133.33, profit: 33.33, marginPercent: 25.0, description: 'Specialty food, beverage & distribution' },
  { cost: 100, markupPercent: 42.86, price: 142.86, profit: 42.86, marginPercent: 30.0, description: 'Sporting goods & home furnishings' },
  { cost: 100, markupPercent: 53.85, price: 153.85, profit: 53.85, marginPercent: 35.0, description: 'Direct-to-consumer goods & books' },
  { cost: 100, markupPercent: 66.67, price: 166.67, profit: 66.67, marginPercent: 40.0, description: 'Apparel & department store retail' },
  { cost: 100, markupPercent: 81.82, price: 181.82, profit: 81.82, marginPercent: 45.0, description: 'Specialty gift & boutique goods' },
  { cost: 100, markupPercent: 100.0, price: 200.0, profit: 100.0, marginPercent: 50.0, description: 'Keystone standard retail pricing' },
  { cost: 100, markupPercent: 150.0, price: 250.0, profit: 150.0, marginPercent: 60.0, description: 'Luxury apparel, cosmetics & jewelry' },
  { cost: 100, markupPercent: 233.33, price: 333.33, profit: 233.33, marginPercent: 70.0, description: 'Enterprise software & digital products' },
  { cost: 100, markupPercent: 400.0, price: 500.0, profit: 400.0, marginPercent: 80.0, description: 'B2B SaaS gross margin standard' },
  { cost: 100, markupPercent: 900.0, price: 1000.0, profit: 900.0, marginPercent: 90.0, description: 'Cloud API & developer platform gross margin' },
];

export const SAAS_BENCHMARKS: SaaSBenchmark[] = [
  {
    metric: 'LTV to CAC Ratio',
    good: '3.0x – 4.0x',
    great: '4.0x – 6.0x',
    worldClass: '> 6.0x (or under-investing in growth)',
    description: 'Measures lifetime customer gross profit generated per dollar spent on sales and marketing.',
    impact: 'Below 3.0x indicates unsustainable acquisition costs; above 6.0x indicates room to invest more aggressively.',
  },
  {
    metric: 'CAC Payback Period',
    good: '< 18 Months',
    great: '< 12 Months',
    worldClass: '< 6 Months (Enterprise / PLG)',
    description: 'Time required to recover fully burdened sales and marketing acquisition spend from customer subscription margin.',
    impact: 'Directly dictates capital efficiency and cash runway requirements.',
  },
  {
    metric: 'Net Revenue Retention (NRR)',
    good: '100% – 110%',
    great: '110% – 125%',
    worldClass: '> 130% (Snowflake / Datadog tier)',
    description: 'Percentage of recurring revenue retained from existing cohort including expansions, minus churn and downgrades.',
    impact: 'NRR > 120% drives compounding organic growth even with zero new logo additions.',
  },
  {
    metric: 'Monthly Logo Churn',
    good: '< 2.0% (SMB)',
    great: '< 1.0% (Mid-Market)',
    worldClass: '< 0.5% (Enterprise)',
    description: 'Percentage of customers canceling subscriptions during a single month.',
    impact: 'High churn caps maximum achievable ARR ceiling.',
  },
  {
    metric: 'Gross Margin %',
    good: '70% – 75%',
    great: '75% – 82%',
    worldClass: '> 85%',
    description: 'Revenue minus hosting (AWS/GCP), customer support, and third-party API integration costs.',
    impact: 'High gross margins fund R&D and aggressive go-to-market motions.',
  },
  {
    metric: 'SaaS Magic Number',
    good: '0.75x – 1.0x',
    great: '1.0x – 1.5x',
    worldClass: '> 1.5x',
    description: 'Net new ARR generated in quarter divided by prior quarter Sales & Marketing spend.',
    impact: 'Above 1.0x signals immediate green light to accelerate go-to-market spending.',
  },
];

export const FINANCIAL_RATIOS: FinancialRatio[] = [
  {
    category: 'Profitability',
    name: 'Return on Equity (ROE)',
    formula: 'Net Income / Shareholders Equity',
    idealRange: '15% – 25%',
    interpretation: 'Measures profitability generated per dollar of shareholder investment capital.',
  },
  {
    category: 'Profitability',
    name: 'Return on Invested Capital (ROIC)',
    formula: 'NOPAT / Invested Capital',
    idealRange: '> WACC + 5%',
    interpretation: 'Tests if company creates economic value above its capital hurdle rate.',
  },
  {
    category: 'Liquidity',
    name: 'Current Ratio',
    formula: 'Current Assets / Current Liabilities',
    idealRange: '1.5x – 3.0x',
    interpretation: 'Ability to cover short-term debt obligations within the next 12 months.',
  },
  {
    category: 'Liquidity',
    name: 'Quick Ratio (Acid-Test)',
    formula: '(Cash + Equivalents + A/R) / Current Liabilities',
    idealRange: '1.0x – 1.5x',
    interpretation: 'Instant liquidity coverage excluding illiquid inventory stockpiles.',
  },
  {
    category: 'Leverage',
    name: 'Debt-to-Equity (D/E)',
    formula: 'Total Debt / Shareholders Equity',
    idealRange: '0.5x – 1.5x (varies by industry)',
    interpretation: 'Proportion of company financing funded by debt lenders vs equity owners.',
  },
  {
    category: 'Efficiency',
    name: 'Asset Turnover',
    formula: 'Revenue / Total Assets',
    idealRange: '0.8x – 2.5x',
    interpretation: 'Efficiency in generating dollar sales per dollar of operational asset base.',
  },
];

export const ROLE_WORKBENCHES: RoleWorkbench[] = [
  {
    id: 'startup-founders',
    title: 'Startup Founders & Venture Operators',
    role: 'Early-stage Seed to Series B',
    description: 'Track cash runway, net burn rate, cap table dilution, and investor deck unit economics.',
    icon: 'Rocket',
    toolSlugs: [
      'cash-runway-calculator',
      'burn-rate-calculator',
      'saas-ltv-cac-calculator',
      'startup-dilution-calculator',
      'burn-multiple-calculator',
      'cac-payback-calculator',
    ],
  },
  {
    id: 'cfos-controllers',
    title: 'CFOs, Controllers & Treasurers',
    role: 'Corporate Financial Management',
    description: 'Decompose DuPont ROE, optimize working capital cycles, and model capital structure WACC.',
    icon: 'Building2',
    toolSlugs: [
      'dupont-roe-calculator',
      'ebitda-calculator',
      'wacc-calculator',
      'current-quick-ratio-calculator',
      'cash-conversion-cycle-calculator',
      'dcf-valuation-calculator',
    ],
  },
  {
    id: 'ecommerce-retail',
    title: 'E-Commerce & Retail Merchants',
    role: 'Merchandising & Channel Pricing',
    description: 'Calculate keystone markups, gross margin dollars, inventory turns, and volume discounts.',
    icon: 'ShoppingCart',
    toolSlugs: [
      'profit-margin-calculator',
      'markup-calculator',
      'keystone-pricing-calculator',
      'inventory-turnover-calculator',
      'eoq-calculator',
      'discount-calculator',
    ],
  },
  {
    id: 'saas-product-leaders',
    title: 'SaaS Growth & Product Leaders',
    role: 'Subscription Growth & Retention',
    description: 'Monitor cohort logo churn, net revenue retention (NRR), MRR waterfalls, and Magic Numbers.',
    icon: 'LineChart',
    toolSlugs: [
      'saas-ltv-cac-calculator',
      'churn-rate-calculator',
      'mrr-arr-calculator',
      'saas-magic-number-calculator',
      'cac-payback-calculator',
      'contribution-margin-calculator',
    ],
  },
  {
    id: 'freelancers-agencies',
    title: 'Freelancers, Consultants & Agencies',
    role: 'Professional Services & Billing',
    description: 'Price consulting hours, monitor billable utilization rates, and calculate true meeting burn.',
    icon: 'Briefcase',
    toolSlugs: [
      'freelance-hourly-rate-calculator',
      'meeting-cost-calculator',
      'billable-hours-calculator',
      'employee-burden-calculator',
      'break-even-calculator',
      'target-profit-calculator',
    ],
  },
  {
    id: 'operations-supply-chain',
    title: 'Operations & Supply Chain Managers',
    role: 'Manufacturing & Fulfillment',
    description: 'Optimize Economic Order Quantity (EOQ), reorder triggers, safety stock, and CVP break-even.',
    icon: 'Boxes',
    toolSlugs: [
      'break-even-calculator',
      'eoq-calculator',
      'reorder-point-calculator',
      'inventory-turnover-calculator',
      'margin-of-safety-calculator',
      'overhead-allocation-calculator',
    ],
  },
];

export const BUSINESS_FAQS: BusinessFaq[] = [
  {
    question: 'What is the mathematical difference between Profit Margin and Markup?',
    answer:
      'While both measure profitability, they use different denominators. Profit Margin expresses gross profit as a percentage of Selling Price: Margin % = ((Price - Cost) / Price) × 100. Markup expresses profit as a percentage of Cost: Markup % = ((Price - Cost) / Cost) × 100. Because price is higher than cost, markup percentage is always mathematically higher than profit margin for any profitable product. For example, a 50% margin requires a 100% markup.',
  },
  {
    question: 'How do you calculate the Break-Even Point in units and revenue?',
    answer:
      'The Break-Even Point is the exact sales volume where Total Revenue equals Total Costs (Fixed Costs + Variable Costs), resulting in $0 net operating income. Break-Even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). Break-Even Revenue = Break-Even Units × Selling Price per Unit. The difference (Price - Variable Cost) is known as the Unit Contribution Margin.',
  },
  {
    question: 'What is considered a healthy SaaS LTV to CAC Ratio?',
    answer:
      'In SaaS and subscription business models, an LTV:CAC ratio of 3.0x to 4.0x is considered healthy and sustainable for venture-backed and bootstrapped companies. A ratio below 3.0x indicates high acquisition costs or excessive customer churn that erodes cash reserves. A ratio exceeding 6.0x suggests that the business may be under-investing in marketing and sales growth, leaving market share vulnerable to competitors.',
  },
  {
    question: 'How is Startup Cash Runway calculated, and how does Net Burn differ from Gross Burn?',
    answer:
      'Startup Runway (in months) equals Total Liquid Cash Reserves divided by Net Monthly Burn. Gross Burn is the total cash spent across payroll, hosting, rent, and overhead in a given month. Net Burn is Gross Burn minus actual cash collected from customer revenue. For example, if a startup has $1,200,000 in cash, spends $150,000/mo, and collects $50,000/mo in revenue, Net Burn is $100,000/mo, providing 12 months of runway.',
  },
  {
    question: 'What is the 3-Step DuPont Analysis formula for Return on Equity (ROE)?',
    answer:
      'The 3-Step DuPont Analysis breaks Return on Equity into three distinct operational drivers: ROE = Net Profit Margin × Asset Turnover × Financial Leverage. Formally: (Net Income / Revenue) × (Revenue / Total Assets) × (Total Assets / Shareholders Equity). This allows executives and investors to pinpoint whether high returns stem from superior operational profitability, efficient asset utilization, or aggressive debt financing.',
  },
  {
    question: 'What is Keystone Pricing in retail?',
    answer:
      'Keystone pricing is a traditional retail pricing rule of thumb where a merchant sets the retail price at exactly double the wholesale cost, which represents a 100% markup and a 50% gross profit margin. For example, an item purchased from a manufacturer for $25 is sold at a retail price of $50.',
  },
  {
    question: 'How do you calculate a freelance consulting hourly rate from a target salary?',
    answer:
      'To calculate an accurate consulting rate: 1) Start with target annual take-home pay. 2) Add self-employment taxes (approx. 25-35%), healthcare, and retirement contributions. 3) Add business overhead (software, hardware, insurance). 4) Divide by realistic annual billable hours (typically 50-60% of total working hours, or 1,000–1,200 hours per year) to account for unpaid marketing, billing, and proposals.',
  },
  {
    question: 'What is Net Revenue Retention (NRR) and why is it crucial for SaaS valuation?',
    answer:
      'Net Revenue Retention (NRR) measures the percentage of recurring revenue retained from an existing cohort over a 12-month period, factoring in upgrades, expansions, cross-sells, downgrades, and churn: NRR = ((Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR) × 100. An NRR above 100% means the business grows automatically even without acquiring a single new customer, which commands premium valuation multiples from investors.',
  },
  {
    question: 'What is the Cash Conversion Cycle (CCC) and why does a negative CCC benefit companies?',
    answer:
      'The Cash Conversion Cycle measures the time in days required to convert raw materials and inventory purchases into liquid cash from sales: CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO). A negative CCC (achieved by companies like Amazon and Dell) means the business collects cash from customers before paying suppliers, effectively financing operational expansion with vendor float.',
  },
  {
    question: 'What is EBITDA and why do M&A buyers focus on it instead of Net Income?',
    answer:
      'EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. M&A buyers and private equity investors use EBITDA as a proxy for pure operational cash generation because it strips away non-cash accounting charges (D&A), discretionary capital structure choices (debt interest), and jurisdictional tax variations, facilitating direct peer company comparisons.',
  },
  {
    question: 'How does Economic Order Quantity (EOQ) minimize total inventory cost?',
    answer:
      'Economic Order Quantity (EOQ) finds the exact order batch size that minimizes the sum of inventory holding costs (storage, insurance, obsolescence) and order placement costs (shipping, receiving, admin). The formula is EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost per Unit per Year). Ordering at EOQ achieves the lowest total logistics cost.',
  },
  {
    question: 'What is Margin of Safety in managerial accounting?',
    answer:
      'Margin of Safety measures the cushion between actual (or budgeted) sales and the break-even sales volume: Margin of Safety ($) = Current Sales - Break-Even Sales; Margin of Safety (%) = (Margin of Safety $ / Current Sales) × 100. It tells managers how much sales can drop before the business begins incurring net financial losses.',
  },
  {
    question: 'What is the difference between Weighted Average Cost of Capital (WACC) and Hurdle Rate?',
    answer:
      'WACC is the blended after-tax cost of a firm’s equity and debt capital: WACC = (Equity/Total Value × Cost of Equity) + (Debt/Total Value × Cost of Debt × (1 - Tax Rate)). A hurdle rate is the minimum required rate of return a company demands before approving a capital investment project, typically set at WACC plus an additional risk premium (e.g. WACC + 3-5%).',
  },
  {
    question: 'What is Customer Acquisition Cost (CAC) Payback Period and what is the benchmark?',
    answer:
      'CAC Payback Period calculates the number of months required for a newly acquired customer to generate enough gross profit to fully pay back the sales and marketing dollars spent to acquire them: CAC Payback (Months) = CAC / (Monthly ARPU × Gross Margin %). Top-tier SaaS companies aim for CAC payback under 12 months for SMBs and under 18 months for Enterprise contracts.',
  },
  {
    question: 'How does Degree of Operating Leverage (DOL) impact business risk?',
    answer:
      'Degree of Operating Leverage measures the proportion of fixed costs to variable costs in a company’s cost structure: DOL = Contribution Margin / Operating Income. A company with high fixed costs (like software or manufacturing) has a high DOL, meaning a small percentage increase in sales yields a massive percentage surge in operating profits, but sales declines cause equally steep losses.',
  },
];
