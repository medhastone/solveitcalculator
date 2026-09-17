import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Understanding GST: Step-by-Step Calculation for Buyers & Sellers | SolveIt Calculator',
  description: 'Demystify Goods and Services Tax (GST) math. Learn how to extract inclusive base costs and calculate input tax credit (ITC) pass-throughs for businesses.',
  keywords: ['calculate GST', 'GST formula', 'inclusive tax math', 'exclusive tax calculation', 'input tax credit', 'business tax guide', 'value added tax math', 'how to calculate VAT'],
  alternates: {
    canonical: 'https://solveitcalculator.com/article/understanding-gst',
  }
};

export default function ArticleGST() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Understanding GST: Step-by-Step Calculation for Buyers & Sellers",
        "author": {
          "@type": "Organization",
          "name": "SolveIt Tax & Commercial Accounting Review Board",
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
        "datePublished": "2024-03-05",
        "dateModified": "2026-09-15",
        "description": "Demystify Goods and Services Tax (GST) math. Learn how to extract inclusive base costs and calculate input tax credit (ITC) pass-throughs for businesses."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the difference between GST and Sales Tax?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Traditional Sales Tax is collected only once at the final point of purchase by the end consumer. GST (a Value-Added Tax) is collected at every stage of the supply chain, but businesses can claim Input Tax Credits (ITC) for the tax they paid on raw materials, meaning only the final consumer bears the actual tax burden."
            }
          },
          {
            "@type": "Question",
            "name": "Why can't I just subtract the percentage to find the base price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Because percentages are not reversible linearly. If you add 10% to $100, you get $110. But if you subtract 10% of $110 ($11), you get $99. To extract a tax that has already been added, you must use division (Total / 1.10) to find the original base."
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
        <span className="text-on-surface font-medium truncate">Understanding GST Calculation</span>
      </nav>

      {/* Article Header & Editorial Review Badge */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
            Commercial Accounting &amp; Taxation
          </span>
          <span className="text-on-surface-variant text-xs font-body-sm">
            6 Min Read • Last Updated: September 15, 2026
          </span>
        </div>
        
        <h1 className="font-headline-lg md:font-display-hero text-on-surface font-bold tracking-tight mb-4">
          Understanding GST: Step-by-Step Calculation for Buyers &amp; Sellers
        </h1>
        
        <p className="font-body-lg text-on-surface-variant leading-relaxed mb-6">
          A definitive mathematical analysis of Goods and Services Tax (GST/VAT) dynamics, inclusive vs. exclusive price extraction formulas, and Input Tax Credit (ITC) supply chain pass-throughs.
        </p>

        {/* Audited & Fact-Checked Banner */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <div>
              <div className="font-semibold text-on-surface">Audited &amp; Fact-Checked</div>
              <div className="text-on-surface-variant text-xs">
                SolveIt Tax &amp; Commercial Accounting Review Board • Calibrated to OECD Guidelines
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>OECD &amp; Statutory Codes Cited</span>
          </div>
        </div>
      </header>

      {/* ITC Supply Chain SVG Infographic */}
      <div className="mb-10 rounded-2xl bg-surface-container-low p-4 sm:p-6 border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
          The Multi-Stage Value-Added Tax (GST) Pipeline &amp; Input Tax Credit (ITC)
        </div>
        <svg viewBox="0 0 760 180" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="760" height="180" rx="12" fill="#0f172a" />
          
          {/* Node 1: Manufacturer */}
          <rect x="25" y="35" width="150" height="105" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="100" y="60" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Manufacturer</text>
          <text x="100" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Base: $100</text>
          <text x="100" y="98" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="sans-serif">Tax Added (10%): $10</text>
          <text x="100" y="118" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Remit Gov: $10</text>

          {/* Node 2: Wholesaler */}
          <rect x="220" y="35" width="150" height="105" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="295" y="60" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Wholesaler</text>
          <text x="295" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Sale Base: $150</text>
          <text x="295" y="98" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="sans-serif">Tax (10%): $15</text>
          <text x="295" y="118" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold" fontFamily="sans-serif">ITC ($10) → Remit: $5</text>

          {/* Node 3: Retailer */}
          <rect x="415" y="35" width="150" height="105" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="490" y="60" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Retailer</text>
          <text x="490" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Sale Base: $200</text>
          <text x="490" y="98" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="sans-serif">Tax (10%): $20</text>
          <text x="490" y="118" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold" fontFamily="sans-serif">ITC ($15) → Remit: $5</text>

          {/* Node 4: Final Consumer */}
          <rect x="610" y="35" width="125" height="105" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="672" y="60" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Consumer</text>
          <text x="672" y="82" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">Final Price:</text>
          <text x="672" y="100" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">$220</text>
          <text x="672" y="120" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="sans-serif">Total Tax: $20</text>

          <text x="380" y="165" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            Total Government Collection = $10 + $5 + $5 = $20 (No double-taxation on cascaded value)
          </text>
        </svg>
      </div>

      <div className="space-y-8">
        
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">1. The Basics of Goods and Services Tax (Value-Added Tax)</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            Goods and Services Tax (GST), codified internationally under the <a href="https://doi.org/10.1787/9789264271401-en" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">OECD International VAT/GST Guidelines</a>, is a destination-based consumption tax levied on value added at each transaction point. While the tax is collected at multiple intermediate stages, statutory refund mechanisms prevent cascading tax burdens on registered entities.
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Destination-Based Multi-Stage Taxation Principles</h3>
          <p className="font-body-md text-on-surface-variant mb-4">
            In daily business operations, accountants, retailers, and software developers face two primary mathematical problems regarding GST:
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Two Core Mathematical Paradigms in Retail &amp; Accounting</h3>
          <ol className="list-decimal pl-5 font-body-md text-on-surface-variant space-y-3">
            <li><strong className="text-on-surface">Adding GST (Exclusive Math):</strong> Calculating the final sticker price to charge a consumer when you know your desired pre-tax profit margin (Base Price), as standardized by revenue services like the <a href="https://www.ato.gov.au/businesses/gst/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">Australian Taxation Office (ATO)</a> and <a href="https://www.gov.uk/vat-rates" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">HM Revenue &amp; Customs (HMRC)</a>.</li>
            <li><strong className="text-on-surface">Extracting GST (Inclusive Math):</strong> Finding the original base price and the exact tax amount from a final receipt total. (This is where 90% of business owners make mathematical errors).</li>
          </ol>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">2. Scenario 1: Adding GST (Exclusive Calculation)</h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            This is the simpler of the two calculations. If your business manufactures a chair and wants to sell it for a base price of $200 to hit your profit margins, and the local GST rate is 15%, the calculation is straightforward multiplication.
          </p>
          
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-headline-md text-on-surface text-lg mb-3">The Standard Forward Addition Formula</h3>
            <code className="block bg-surface-container-lowest p-6 rounded-lg text-headline-sm text-on-surface font-data-mono mb-6 text-center border border-outline-variant/20 shadow-sm">
              GST Amount = Base Price × (GST Rate / 100)<br/>
              Final Price = Base Price + GST Amount
            </code>
            <div className="bg-primary/5 p-5 rounded-lg text-sm font-body-sm text-on-surface-variant border border-primary/10">
              <h3 className="font-headline-md text-on-surface text-base mb-2 mt-0">Step-by-Step Retail Calculation Example ($200 Base at 15%)</h3>
              <ul className="mt-3 space-y-2">
                <li>Base Price = $200.00</li>
                <li>GST Rate = 15% (or 0.15)</li>
                <li>GST Amount = $200 × 0.15 = <strong className="text-on-surface">$30.00</strong></li>
                <li>Final Sticker Price = $200 + $30 = <strong className="text-on-surface">$230.00</strong></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">3. Scenario 2: Extracting GST (Inclusive Calculation)</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            This is the single most common mathematical error in retail and accounting. If you have a receipt for $230 that <em>includes</em> a 15% GST, you <strong>cannot</strong> simply calculate 15% of $230 ($34.50) and subtract it to find the base price. (230 - 34.50 = 195.50, which is incorrect).
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Why Simple Subtraction Fails: Non-Linearity of Percentages</h3>
          <p className="font-body-md text-on-surface-variant mb-6">
            Why? Because percentages are not linearly reversible. The 15% was originally calculated on the smaller base number, not the larger final number. To properly reverse-engineer the base price from an inclusive total, you must use division.
          </p>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
            <h3 className="font-headline-md text-on-surface text-lg mb-3">The Reverse Division Principle</h3>
            <code className="block bg-surface-container-lowest p-6 rounded-lg text-headline-sm text-on-surface font-data-mono mb-6 text-center border border-outline-variant/20 shadow-sm">
              Base Price = Final Price / [1 + (GST Rate / 100)]<br/>
              GST Amount = Final Price - Base Price
            </code>
            <div className="bg-secondary/5 p-5 rounded-lg text-sm font-body-sm text-on-surface-variant border border-secondary/10">
              <h3 className="font-headline-md text-on-surface text-base mb-2 mt-0">Step-by-Step Receipt Breakdown ($230 Total with 15% GST)</h3>
              <ul className="mt-3 space-y-2">
                <li>Final Receipt Price = $230.00</li>
                <li>GST Rate = 15% (Divisor becomes 1.15)</li>
                <li>Base Price = $230 / 1.15 = <strong className="text-on-surface">$200.00</strong></li>
                <li>GST Amount = $230 - $200 = <strong className="text-on-surface">$30.00</strong></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">4. Input Tax Credits (ITC) Explained</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            The true benefit of a value-added tax system like GST for businesses (as opposed to standard US Sales Tax) is the Input Tax Credit mechanism. When a registered business buys raw materials, they pay GST. When they sell the finished product, they collect GST.
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Mitigating Cascading Tax-on-Tax Compounding</h3>
          <p className="font-body-md text-on-surface-variant mb-4">
            The business only remits the <em>net difference</em> to the government:
          </p>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Net Tax Remittance Formula for Registered Entities</h3>
          <blockquote className="bg-surface-container-low border-l-4 border-primary p-5 rounded-r-lg font-headline-sm text-on-surface mb-6">
            GST Payable to Government = (GST Collected on Sales) - (GST Paid on Purchases)
          </blockquote>
          
          <h3 className="font-headline-md text-on-surface text-lg mb-3">Multi-Stage Supply Chain Case Study (Assuming 10% GST)</h3>
          <p className="font-body-md text-on-surface-variant mb-6">This ensures that the tax is only applied to the &ldquo;value added&rdquo; at each stage of the supply chain, preventing cascading taxes (tax on tax).</p>
          
          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl mb-4">
            <table className="w-full text-left border-collapse min-w-[600px] m-0">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Supply Chain Stage</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Base Price</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">GST (10%)</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">ITC Claimed</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Remitted to Govt</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md text-on-surface-variant">
                <tr className="border-b border-outline-variant/30">
                  <td className="p-4 font-semibold text-on-surface">1. Logger (Wood)</td>
                  <td className="p-4">$100</td>
                  <td className="p-4">$10</td>
                  <td className="p-4">$0</td>
                  <td className="p-4 font-bold text-primary">$10</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="p-4 font-semibold text-on-surface">2. Furniture Maker</td>
                  <td className="p-4">$200</td>
                  <td className="p-4">$20</td>
                  <td className="p-4">$10 (from Logger)</td>
                  <td className="p-4 font-bold text-primary">$10</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="p-4 font-semibold text-on-surface">3. Retail Store</td>
                  <td className="p-4">$300</td>
                  <td className="p-4">$30</td>
                  <td className="p-4">$20 (from Maker)</td>
                  <td className="p-4 font-bold text-primary">$10</td>
                </tr>
                <tr className="bg-surface-container-low">
                  <td colSpan={4} className="p-4 text-right font-bold text-on-surface">Total Tax Collected by Government:</td>
                  <td className="p-4 font-bold text-green-600 text-lg">$30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* References Section */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">5. Statutory Guidelines &amp; Tax Authority Standards</h2>
          <h3 className="font-headline-md text-on-surface text-lg mb-3">International Invoicing &amp; Regulatory Compliance</h3>
          <ol className="list-decimal pl-5 font-body-sm text-on-surface-variant space-y-3">
            <li>
              Organisation for Economic Co-operation and Development (OECD). (2017). <em>International VAT/GST Guidelines</em>. OECD Publishing, Paris.{' '}
              <a href="https://doi.org/10.1787/9789264271401-en" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://doi.org/10.1787/9789264271401-en
              </a>
            </li>
            <li>
              Australian Taxation Office (ATO). (2024). <em>GST Invoicing, Calculation Methods and Input Tax Credits</em>.{' '}
              <a href="https://www.ato.gov.au/businesses/gst/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://www.ato.gov.au/businesses/gst/
              </a>
            </li>
            <li>
              HM Revenue &amp; Customs (HMRC). (2024). <em>VAT Rates, Thresholds, and the Reverse Charge Mechanism</em>.{' '}
              <a href="https://www.gov.uk/vat-rates" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://www.gov.uk/vat-rates
              </a>
            </li>
            <li>
              Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance, India. <em>GST Law Manual &amp; Input Tax Credit Rules</em>.{' '}
              <a href="https://cbic-gst.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                https://cbic-gst.gov.in
              </a>
            </li>
          </ol>
        </section>

        <div className="bg-primary/10 border-l-4 border-primary p-8 my-10 rounded-r-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="mt-0 text-primary mb-2 font-headline-md text-xl">Automate Your Tax Calculations</h3>
            <p className="mb-0 text-on-surface-variant font-body-sm">
              Never make a reverse-tax division error again. Instantly add or extract taxes across global jurisdictions using our dedicated business calculators for VAT, GST, and standard sales tax.
            </p>
          </div>
          <div>
            <Link 
              href="/business" 
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 hover:shadow-md transition-all whitespace-nowrap"
            >
              Open Business Hub
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-10 border-t border-outline-variant/30">
          <h2 className="font-headline-lg text-on-surface mt-0 mb-8">6. Frequently Asked Questions (FAQ)</h2>
          
          <div className="space-y-4">
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                <h3 className="font-headline-sm text-body-lg text-on-surface m-0 font-bold">
                  What is the difference between GST and traditional Sales Tax?
                </h3>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Traditional Sales Tax (used heavily in the United States) is collected only once at the final point of purchase by the end consumer. GST (a Value-Added Tax used in most of the world) is collected at every stage of the supply chain, but businesses can claim Input Tax Credits (ITC) for the tax they paid on raw materials, meaning only the final consumer bears the actual tax burden.
              </div>
            </details>
            
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                <h3 className="font-headline-sm text-body-lg text-on-surface m-0 font-bold">
                  Why can&apos;t I just subtract the percentage to find the base price?
                </h3>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Because percentages are not reversible linearly. The original tax percentage was calculated on a smaller base number. If you add 10% to $100, you get $110. But if you subtract 10% of $110 ($11), you get $99. To extract a tax that has already been added and compounded, you must use the division formula (Total / 1.XX) to isolate the original base.
              </div>
            </details>
          </div>
        </div>

      </div>
    </article>
  );
}
