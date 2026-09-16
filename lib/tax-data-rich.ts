export interface TaxConfig {
  slug: string;
  name: string;
  regulator: string;
  rate: number;
  currency: string;
  symbol: string;
  heroTitle: string;
  heroSubtitle: string;
  badgeText: string;
  formulaText: string;
  hasDynamicRates: boolean;
  subRates?: { label: string; rate: number }[];
  sourceLink: string;
  faqs: { question: string; answer: string }[];
}

export const taxConfigData: Record<string, TaxConfig> = {
  australia: {
    slug: 'australia',
    name: 'Australia',
    regulator: 'ATO',
    rate: 10.0,
    currency: 'AUD',
    symbol: '$',
    heroTitle: 'Australia GST Calculator (ATO 10%)',
    heroSubtitle: 'Add GST, strip GST, reverse-calculate tax fractions, and generate statutory tax invoice compliance breakdowns compliant with the Australian Taxation Office (ATO). Updated for 2026 standards.',
    badgeText: 'Australia ATO Compliance Breakdown',
    formulaText: 'ATO Section 9-70 Standard Supply',
    hasDynamicRates: false,
    sourceLink: 'https://www.ato.gov.au/business/gst/',
    faqs: [
      {
        question: "How do I calculate 10% GST on an exclusive price?",
        answer: "To add 10% GST to an exclusive price, multiply the price by 0.10. To find the total inclusive price, multiply the exclusive price by 1.10."
      },
      {
        question: "What is the exact ATO formula to reverse calculate GST?",
        answer: "Under ATO guidelines, when a price includes 10% GST, the tax amount is calculated by dividing the total price by 11 (or multiplying by 10/110). For example, if an invoice is $220 inclusive of GST: $220 ÷ 11 = $20.00 GST."
      },
      {
        question: "When must an Australian business register for GST?",
        answer: "Registration with the ATO is mandatory within 21 days if your business turnover reaches or exceeds $75,000 AUD ($150,000 for non-profit entities) in current or projected annual gross sales."
      },
      {
        question: "What is the difference between GST-Free and Input-Taxed supplies?",
        answer: "GST-Free means you do not charge GST but can claim Input Tax Credits (e.g. basic food). Input-Taxed means you do not charge GST and CANNOT claim Input Tax Credits (e.g. residential rent)."
      }
    ]
  },
  canada: {
    slug: 'canada',
    name: 'Canada',
    regulator: 'CRA',
    rate: 5.0,
    currency: 'CAD',
    symbol: '$',
    heroTitle: 'Canada GST / HST / PST Calculator',
    heroSubtitle: 'Calculate federal 5% GST, blended Harmonized Sales Tax (HST up to 15%), and provincial sales taxes across Ontario, BC, Quebec, and Alberta.',
    badgeText: 'Canada Revenue Agency (CRA) Compliance',
    formulaText: 'Excise Tax Act Part IX',
    hasDynamicRates: true,
    subRates: [
      { label: 'Federal GST Only (AB, NT, NU, YT) - 5%', rate: 5.0 },
      { label: 'Ontario (HST) - 13%', rate: 13.0 },
      { label: 'Maritimes (NB, NL, NS, PE HST) - 15%', rate: 15.0 },
      { label: 'British Columbia (GST 5% + PST 7%) - 12%', rate: 12.0 },
      { label: 'Quebec (GST 5% + QST 9.975%) - 14.975%', rate: 14.975 },
    ],
    sourceLink: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html',
    faqs: [
      {
        question: "How do Canada's GST, HST, and PST rates interact?",
        answer: "Canada applies a 5% Federal GST across the nation. In participating provinces (Ontario, New Brunswick, Newfoundland, Nova Scotia, PEI), the federal and provincial rates are merged into a single Harmonized Sales Tax (HST) ranging from 13% to 15%. In non-participating provinces (British Columbia, Saskatchewan, Manitoba, Quebec), businesses collect 5% GST alongside separate Provincial Sales Taxes (PST/QST)."
      },
      {
        question: "How do I calculate 13% HST for Ontario?",
        answer: "To add 13% HST, multiply the base amount by 0.13. To extract 13% HST from an inclusive total, divide the total by 1.13 to get the base amount, then subtract the base from the total to find the tax component."
      },
      {
        question: "When is a business required to register for GST/HST in Canada?",
        answer: "You must register for GST/HST if your total worldwide taxable supplies (including those of your associates) exceed $30,000 CAD in a single calendar quarter or over four consecutive calendar quarters."
      }
    ]
  },
  singapore: {
    slug: 'singapore',
    name: 'Singapore',
    regulator: 'IRAS',
    rate: 9.0,
    currency: 'SGD',
    symbol: 'S$',
    heroTitle: 'Singapore GST Calculator (IRAS 9%)',
    heroSubtitle: 'Updated for the statutory 9% GST rate enforced by the Inland Revenue Authority of Singapore (IRAS) for 2024–2026 transactions.',
    badgeText: 'Singapore IRAS Statutory Compliance',
    formulaText: 'Singapore GST Act 1993',
    hasDynamicRates: false,
    sourceLink: 'https://www.iras.gov.sg/taxes/goods-services-tax-(gst)',
    faqs: [
      {
        question: "What is the current GST rate in Singapore?",
        answer: "The current standard GST rate in Singapore is 9%, which came into effect on January 1, 2024 (stepped up from 8% in 2023)."
      },
      {
        question: "How do I reverse calculate 9% GST?",
        answer: "To extract the 9% GST from an inclusive total, multiply the gross amount by (9/109), or divide the gross amount by 1.09 to find the exclusive net amount."
      },
      {
        question: "Who is required to register for GST in Singapore?",
        answer: "Registration is compulsory if your taxable turnover at the end of any calendar year is more than SGD $1 million, or if you expect your taxable turnover to exceed SGD $1 million in the next 12 months."
      }
    ]
  },
  'new-zealand': {
    slug: 'new-zealand',
    name: 'New Zealand',
    regulator: 'IRD',
    rate: 15.0,
    currency: 'NZD',
    symbol: '$',
    heroTitle: 'New Zealand GST Calculator (IRD 15%)',
    heroSubtitle: 'Universal 15% GST computations for Inland Revenue Department (IRD / Te Tari Taake) compliance and business invoicing.',
    badgeText: 'New Zealand IRD Comprehensive System',
    formulaText: 'NZ GST Act 1985 Section 8',
    hasDynamicRates: false,
    sourceLink: 'https://www.ird.govt.nz/gst',
    faqs: [
      {
        question: "How do I calculate 15% GST in New Zealand?",
        answer: "To add 15% GST to an exclusive price, multiply it by 1.15. To extract the 15% GST from a tax-inclusive price, multiply the price by 3/23 (which is exactly 15/115)."
      },
      {
        question: "When do I need to register for GST with the IRD?",
        answer: "You must register for GST if you carry out a taxable activity and your turnover was more than NZD $60,000 in the last 12 months, or you expect it to be more than $60,000 in the next 12 months."
      },
      {
        question: "What items are zero-rated for GST in NZ?",
        answer: "Zero-rated supplies have a GST rate of 0% but you can still claim back GST on your expenses. Common zero-rated items include exported goods, sales of going concerns, and certain land transactions between GST-registered parties."
      }
    ]
  },
  india: {
    slug: 'india',
    name: 'India',
    regulator: 'CBIC / GST Council',
    rate: 18.0,
    currency: 'INR',
    symbol: '₹',
    heroTitle: 'India GST Calculator (CGST / SGST / IGST)',
    heroSubtitle: 'Compute multi-slab 5%, 12%, 18%, and 28% GST with automated 50/50 dual Central & State GST splits for intra-state and IGST inter-state filing.',
    badgeText: 'CBIC / GST Council Statutory Engine',
    formulaText: 'CGST Act 2017 Section 9',
    hasDynamicRates: true,
    subRates: [
      { label: 'Nil / Exempt Slab - 0%', rate: 0.0 },
      { label: 'Mass Consumption Slab - 5%', rate: 5.0 },
      { label: 'Standard Rate 1 Slab - 12%', rate: 12.0 },
      { label: 'Standard Rate 2 Slab (Services/Tech) - 18%', rate: 18.0 },
      { label: 'Luxury / Demerit Slab - 28%', rate: 28.0 },
    ],
    sourceLink: 'https://cbic-gst.gov.in/',
    faqs: [
      {
        question: "How does India split CGST, SGST, and IGST on tax invoices?",
        answer: "If the supplier and recipient are in the same state (Intra-State), the applicable rate is bifurcated 50/50 between Central GST (CGST) and State GST (SGST). If the supply crosses state borders (Inter-State), Integrated GST (IGST) is charged at the full combined statutory rate."
      },
      {
        question: "How do I calculate 18% GST reverse charge?",
        answer: "To extract 18% GST from a total inclusive amount, divide the total amount by 1.18. The difference between the total and this new base amount is your GST."
      },
      {
        question: "What is the GST registration limit in India?",
        answer: "The threshold for GST registration is generally ₹40 Lakhs for goods (₹20 Lakhs for special category states) and ₹20 Lakhs for service providers, though some specific mandatory registrations exist regardless of turnover."
      },
      {
        question: "How to claim Input Tax Credit (ITC)?",
        answer: "To claim ITC, you must possess a valid tax invoice, the goods or services must have been received, the supplier must have paid the tax to the government, and you must have filed the relevant GST returns."
      }
    ]
  },
  custom: {
    slug: 'custom',
    name: 'Global Custom',
    regulator: 'Universal',
    rate: 20.0,
    currency: 'VAT',
    symbol: '$',
    heroTitle: 'Custom VAT & GST Global Calculator',
    heroSubtitle: 'Enter any ad-valorem indirect sales tax or value added tax rate worldwide to compute forward and backwards tax breakdowns.',
    badgeText: 'Universal Metrology Workbench',
    formulaText: 'Standard Indirect Tax Formula',
    hasDynamicRates: false,
    sourceLink: '#',
    faqs: [
      {
        question: "How does a generic Value Added Tax (VAT) work?",
        answer: "VAT is collected fractionally at every stage of production. A business collects VAT on its sales, pays VAT on its purchases, and remits the net difference to the tax authority."
      },
      {
        question: "How to calculate a custom tax reverse extraction?",
        answer: "For any percentage rate 'R', the formula to find the base exclusive amount from an inclusive total 'T' is: Base = T / (1 + (R/100))."
      }
    ]
  }
};
