import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How EMI Works: Mathematical Breakdown of Amortization | SolveIt Calculator',
  description: 'Unpack the reducing balance method of Equated Monthly Installments (EMI), the underlying mathematical formula, and how extra payments affect interest.',
  keywords: ['calculate EMI', 'EMI formula', 'amortization math', 'equated monthly installment', 'reducing balance method', 'loan calculator guide', 'how amortization works', 'EMI interest vs principal'],
  alternates: {
    canonical: 'https://solveitcalculator.com/article/how-emi-works',
  }
};

export default function ArticleEMI() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "How EMI Works: The Mathematical Breakdown of Amortization",
        "author": {
          "@type": "Organization",
          "name": "SolveIt Financial & Quantitative Review Board",
          "url": "https://solveitcalculator.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "SolveIt Calculator",
          "logo": {
            "@type": "ImageObject",
            "url": "https://solveitcalculator.com/logo.png?v=2"
          }
        },
        "datePublished": "2024-02-10",
        "dateModified": "2026-09-15",
        "description": "Unpack the reducing balance method of Equated Monthly Installments (EMI), the underlying mathematical formula, and how extra payments affect interest."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does my EMI change if the interest rate increases?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If you have a Fixed-Rate loan, your EMI remains exactly the same for the entire tenure. If you have a Floating or Variable Rate loan, the bank will typically adjust your EMI amount or extend your loan tenure when the underlying benchmark rate changes."
            }
          },
          {
            "@type": "Question",
            "name": "Why is the interest portion so high in the first year?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Because interest is calculated on the outstanding principal balance. In month one, you owe the maximum amount of principal, so the interest charge is at its absolute highest. As you slowly pay down the principal over the years, the interest calculated on the remaining balance decreases."
            }
          }
        ]
      }
    ]
  };

  return (
    <article className="max-w-4xl mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-space-xl overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/article" className="hover:text-primary transition-colors">Articles</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium truncate">How EMI Works</span>
      </nav>

      {/* Article Header & Editorial Review Badge */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
            Consumer Credit &amp; Amortization
          </span>
          <span className="text-on-surface-variant text-xs font-body-sm">
            7 Min Read • Last Updated: September 15, 2026
          </span>
        </div>
        
        <h1 className="font-headline-lg md:font-display-hero text-on-surface font-bold tracking-tight mb-4">
          How EMI Works: The Mathematical Breakdown of Reducing Balance Amortization
        </h1>
        
        <p className="font-body-lg text-on-surface-variant leading-relaxed mb-6">
          A rigorous quantitative analysis of Equated Monthly Installment algorithms, interest erosion curves, early payoff tipping points, and regulatory truth-in-lending disclosure frameworks.
        </p>

        {/* Actuarially Reviewed & Fact-Checked Banner */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <div>
              <div className="font-semibold text-on-surface">Actuarially Reviewed &amp; Audited</div>
              <div className="text-on-surface-variant text-xs">
                SolveIt Financial &amp; Quantitative Editorial Board • Calibrated to CFPB &amp; TILA Standards
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span>Statutory Regulations Cited</span>
          </div>
        </div>
      </header>

      {/* Amortization Curve SVG Infographic */}
      <div className="mb-10 rounded-2xl bg-surface-container-low p-4 sm:p-6 border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
          Amortization Dynamics: The Principal vs. Interest Tipping Point
        </div>
        <svg viewBox="0 0 760 220" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="760" height="220" rx="12" fill="#0f172a" />
          
          {/* Axis & Grid */}
          <line x1="60" y1="30" x2="60" y2="170" stroke="#334155" strokeWidth="1.5" />
          <line x1="60" y1="170" x2="720" y2="170" stroke="#334155" strokeWidth="1.5" />
          
          {/* Labels */}
          <text x="70" y="25" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">Monthly Payment ($)</text>
          <text x="60" y="190" fill="#64748b" fontSize="11" fontFamily="sans-serif">Month 1 (Loan Start)</text>
          <text x="360" y="190" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Tipping Point (Year ~16-18)</text>
          <text x="640" y="190" fill="#64748b" fontSize="11" fontFamily="sans-serif">Month 360 (Maturity)</text>
          
          {/* Fixed EMI Top Line */}
          <line x1="60" y1="50" x2="720" y2="50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
          <text x="630" y="44" fill="#cbd5e1" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Fixed Monthly EMI</text>
          
          {/* Interest Curve (Descending) */}
          <path d="M 60 60 C 260 70, 420 120, 720 165" fill="none" stroke="#ef4444" strokeWidth="3" />
          <text x="100" y="85" fill="#fca5a5" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Interest Payment Portion</text>
          
          {/* Principal Curve (Ascending) */}
          <path d="M 60 160 C 260 150, 420 100, 720 55" fill="none" stroke="#10b981" strokeWidth="3" />
          <text x="560" y="85" fill="#86efac" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Principal Reduction</text>
          
          {/* Center Cross Point */}
          <circle cx="410" cy="115" r="5" fill="#f59e0b" />
          <line x1="410" y1="50" x2="410" y2="170" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
          <text x="420" y="125" fill="#fbbf24" fontSize="10" fontFamily="sans-serif">Equal Split (50% / 50%)</text>
        </svg>
      </div>

      <div className="space-y-8">
        
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">1. What is an Equated Monthly Installment (EMI)?</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. The core design of an EMI is that it pays off <em>both</em> interest and principal each month simultaneously, ensuring that by the end of a specified term (tenure), the loan is fully retired under the regulatory framework of the <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-an-amortization-schedule-en-1959/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">Consumer Financial Protection Bureau (CFPB)</a>.
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">The Reducing Balance Method: Core Banking Principle</h3>
          <p className="font-body-md text-on-surface-variant mb-4">
            The most critical concept to grasp in consumer banking is the <strong>Reducing Balance Method</strong> (also recognized as standard amortization under <a href="https://www.federalreserve.gov/supervisionreg/regzcg.htm" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">Federal Reserve Regulation Z / Truth in Lending Act</a>). Your monthly payment stays the same, but the internal breakdown between interest and principal shifts drastically over time.
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Amortization Inversion: Interest vs. Principal Over Tenure</h3>
          <ul className="list-disc pl-5 font-body-md text-on-surface-variant space-y-3">
            <li><strong className="text-on-surface">Early Years:</strong> The vast majority of your fixed payment goes toward paying off interest. Only a sliver touches the principal.</li>
            <li><strong className="text-on-surface">Later Years:</strong> As the principal slowly decreases, the interest calculated on that smaller principal also decreases, meaning a larger percentage of your payment starts paying down the actual debt.</li>
          </ul>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">2. The Universal EMI Formula &amp; Algebraic Derivation</h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            Financial institutions across the globe—from Wall Street banks to local credit unions—use the exact same standard algebraic formula to determine your exact monthly payment.
          </p>
          
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-headline-md text-on-surface text-lg mb-3">The Standard Reducing Balance Equation</h3>
            <code className="block bg-surface-container-lowest p-6 rounded-lg text-headline-sm text-on-surface font-data-mono mb-6 text-center overflow-x-auto whitespace-nowrap shadow-sm border border-outline-variant/20">
              EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]
            </code>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-headline-md text-on-surface text-lg mb-3 mt-0">Detailed Formula Variables Breakdown</h3>
                <ul className="text-sm font-body-sm text-on-surface-variant mt-0 space-y-2">
                  <li><strong className="text-primary text-lg">P</strong> = Principal loan amount</li>
                  <li><strong className="text-primary text-lg">R</strong> = Monthly interest rate (Annual Rate / 12 / 100)</li>
                  <li><strong className="text-primary text-lg">N</strong> = Total number of monthly installments (Years × 12)</li>
                </ul>
              </div>
              <div className="bg-primary/5 p-5 rounded-lg text-sm font-body-sm text-on-surface-variant border border-primary/10">
                <h3 className="font-headline-md text-on-surface text-base mb-2 mt-0">The Periodic Interest Conversion Rule</h3>
                <p className="m-0 text-on-surface-variant text-sm">
                  The most common mistake people make is using the Annual Interest rate for &apos;R&apos;. You <em>must</em> divide your annual rate by 12, and then convert it to a decimal by dividing by 100. (e.g., 6% annual = 6/12 = 0.5% monthly = 0.005).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">3. Step-by-Step Calculation Walkthrough ($10,000 Loan at 9%)</h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            Let&apos;s demystify the algebra. Suppose you take a personal loan of <strong>$10,000</strong> at an annual interest rate of <strong>9%</strong> for <strong>3 years</strong>.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 font-data-mono text-sm leading-relaxed text-on-surface-variant">
              <h3 className="text-on-surface font-body-sm font-bold mb-2">Step 1: Define Variables &amp; Periodic Rates</h3>
              P = 10,000<br/>
              R = 9 / 12 / 100 = 0.0075<br/>
              N = 3 years × 12 months = 36
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 font-data-mono text-sm leading-relaxed text-on-surface-variant">
              <h3 className="text-on-surface font-body-sm font-bold mb-2">Step 2: Calculate the Growth Factor (Numerator)</h3>
              Numerator = 10,000 × 0.0075 × (1 + 0.0075)^36<br/>
              Numerator = 75 × (1.0075)^36<br/>
              Numerator = 75 × 1.3086 = <strong className="text-on-surface">98.148</strong>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 font-data-mono text-sm leading-relaxed text-on-surface-variant">
              <h3 className="text-on-surface font-body-sm font-bold mb-2">Step 3: Calculate the Compounding Discount Factor (Denominator)</h3>
              Denominator = (1 + 0.0075)^36 - 1<br/>
              Denominator = 1.3086 - 1 = <strong className="text-on-surface">0.3086</strong>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 font-data-mono text-sm leading-relaxed text-on-surface-variant">
              <h3 className="text-on-surface font-body-sm font-bold mb-2">Step 4: Compute the Final Monthly Installment</h3>
              EMI = 98.148 / 0.3086 = <strong className="text-primary text-xl">$318.00</strong>
            </div>
          </div>
          
          <p className="font-body-md text-on-surface-variant mb-0">Your exact monthly payment is $318.00. Over 36 months, you will pay a total of $11,448, meaning your total interest cost is $1,448.</p>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">4. The Impact of Loan Tenure: The Compounding Time Trap</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            When taking out a loan, many borrowers are tempted to choose the longest possible tenure (e.g., a 7-year car loan instead of a 4-year loan) to secure the lowest possible monthly EMI. 
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">The Monthly Payment vs. Total Borrowing Cost Trade-off</h3>
          <p className="font-body-md text-on-surface-variant mb-6">
            However, because interest compounds against time, <strong>extending the tenure drastically increases your total cost of borrowing.</strong> Look at the comparison below for a $50,000 loan at 7% interest:
          </p>

          <h3 className="font-headline-md text-on-surface text-lg mb-3">Comparative 3, 5, and 10-Year Amortization Schedule ($50,000 at 7%)</h3>
          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl mb-4">
            <table className="w-full text-left border-collapse min-w-[600px] m-0">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Loan Tenure</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Monthly EMI</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Total Interest Paid</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Total Amount Paid</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md text-on-surface-variant">
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-on-surface">3 Years (36 mo)</td>
                  <td className="p-4 text-orange-600 font-bold">$1,543.85</td>
                  <td className="p-4 text-green-600 font-bold">$5,578.77</td>
                  <td className="p-4">$55,578.77</td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-on-surface">5 Years (60 mo)</td>
                  <td className="p-4 text-orange-500 font-bold">$990.06</td>
                  <td className="p-4 text-green-700 font-bold">$9,403.60</td>
                  <td className="p-4">$59,403.60</td>
                </tr>
                <tr className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-on-surface">10 Years (120 mo)</td>
                  <td className="p-4 text-orange-400 font-bold">$580.54</td>
                  <td className="p-4 text-red-600 font-bold">$19,665.04</td>
                  <td className="p-4">$69,665.04</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm font-body-sm text-on-surface-variant italic mb-0">Notice how stretching the loan to 10 years drops the monthly payment by a few hundred dollars, but quadruples the interest paid to the bank.</p>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">5. The Magic of Prepayments &amp; Accelerated Amortization</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            Because of the reducing balance mechanics, making a single extra payment directed entirely at the <em>principal</em> early in the loan&apos;s lifecycle has a disproportionately massive impact on your total interest paid.
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">The Accelerated Bi-Weekly Strategy (13-Month Hack)</h3>
          <p className="font-body-md text-on-surface-variant mb-4">
            On a standard 30-year mortgage, if you take your standard monthly EMI, divide it in half, and pay that half every two weeks, you end up making 26 half-payments a year (which equals 13 full payments instead of 12). That single extra payment applied directly to the principal every year can reduce a 30-year mortgage to just 24 years, saving tens of thousands of dollars in interest, in accordance with disclosure guidance from the <a href="https://www.federalreserve.gov/pubs/arms/arms_english.htm" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">Federal Reserve Consumer Handbook</a>.
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Lump-Sum Principal Curtailment in Early Amortization Years</h3>
          <p className="font-body-md text-on-surface-variant mb-0">
            Applying annual tax refunds, annual corporate bonuses, or windfalls directly to principal curtailment in the first 3 to 5 years prevents decades of compounding interest on that tranche of debt.
          </p>
        </section>

        {/* References Section */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">6. Authoritative Standards &amp; Financial Regulations</h2>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Statutory Disclosure Compliance &amp; Regulatory Citations</h3>
          <ol className="list-decimal pl-5 font-body-sm text-on-surface-variant space-y-3">
            <li>
              Consumer Financial Protection Bureau (CFPB). (2024). <em>What is an Amortization Schedule and How Does it Work?</em> Consumer Education Portal.{' '}
              <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-an-amortization-schedule-en-1959/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://www.consumerfinance.gov/ask-cfpb/what-is-an-amortization-schedule-en-1959/
              </a>
            </li>
            <li>
              Board of Governors of the Federal Reserve System. <em>Consumer Handbook on Adjustable-Rate Mortgages &amp; Truth in Lending Disclosures</em>.{' '}
              <a href="https://www.federalreserve.gov/pubs/arms/arms_english.htm" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://www.federalreserve.gov/pubs/arms/arms_english.htm
              </a>
            </li>
            <li>
              Federal Deposit Insurance Corporation (FDIC). <em>Consumer Compliance Examination Manual: Truth in Lending Act (Regulation Z)</em>.{' '}
              <a href="https://www.fdic.gov/resources/supervision-and-examinations/consumer-compliance-examination-manual/documents/5/v-1-1.pdf" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                FDIC Compliance Manual Section V-1.1
              </a>
            </li>
            <li>
              Reserve Bank of India (RBI). (2023). <em>Reset of Floating Interest Rate on Equated Monthly Instalments (EMI) based Personal Loans</em>. RBI/2023-24/53 DOR.MCS.REC.32/01.01.001/2023-24.{' '}
              <a href="https://rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Reserve Bank of India Directives
              </a>
            </li>
          </ol>
        </section>

        <div className="bg-primary/10 border-l-4 border-primary p-8 my-10 rounded-r-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="mt-0 text-primary mb-2 font-headline-md text-xl">Interactive Amortization Engine</h3>
            <p className="mb-0 text-on-surface-variant font-body-sm">
              Don&apos;t guess how much of your payment is going to the bank versus your equity. Use our interactive EMI Calculator to instantly generate month-by-month payment tables and dynamic principal vs. interest charts.
            </p>
          </div>
          <div>
            <Link 
              href="/finance/emi-calculator" 
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 hover:shadow-md transition-all whitespace-nowrap"
            >
              Open EMI Calculator
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-10 border-t border-outline-variant/30">
          <h2 className="font-headline-lg text-on-surface mt-0 mb-8">7. Frequently Asked Questions (FAQ)</h2>
          
          <div className="space-y-4">
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                <h3 className="font-headline-sm text-body-lg text-on-surface m-0 font-bold">
                  Does my EMI change if the interest rate increases?
                </h3>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                If you have a Fixed-Rate loan, your EMI remains exactly the same for the entire tenure regardless of what the central banks do. If you have a Floating or Variable Rate loan (like an ARM mortgage), the bank will typically adjust your EMI amount or, alternatively, extend your loan tenure when the underlying benchmark rate changes.
              </div>
            </details>
            
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                <h3 className="font-headline-sm text-body-lg text-on-surface m-0 font-bold">
                  Why is the interest portion so high in the first year?
                </h3>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Interest is strictly calculated on the <em>outstanding principal balance</em>. In month one, you owe the maximum amount of principal, so the interest charge is at its absolute highest. As you slowly pay down the principal over the years, the interest calculated on the remaining balance naturally decreases.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                <h3 className="font-headline-sm text-body-lg text-on-surface m-0 font-bold">
                  Can I lower my EMI without changing my loan amount?
                </h3>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Yes, there are two primary ways: First, you can refinance the loan to secure a lower interest rate. Second, you can extend the tenure (e.g., from 5 years to 7 years). However, be warned that extending the tenure will significantly increase the total amount of interest you pay over the life of the loan.
              </div>
            </details>
          </div>
        </div>

      </div>
    </article>
  );
}
