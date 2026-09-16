import React from 'react';

export default function HomePageSeoSections() {
  return (
    <>
      {/* ================= SECTION 12: SEO EDUCATIONAL CONTENT ================= */}
      <section className="w-full py-space-3xl bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-4xl mx-auto px-gutter-mobile md:px-gutter-desktop space-y-8">
          
          <div className="text-center mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              The Best Free Online Calculators For Every Need
            </h2>
          </div>

          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm mb-8 text-left">
            <div className="font-body-md text-body-md text-on-surface-variant space-y-4">
              <p>
                Welcome to <strong>SolveItCalculator</strong>, your ultimate destination for free online calculators. Whether you're planning your future with a comprehensive retirement calculator, estimating monthly payments with our mortgage calculator, or optimizing your budget with an advanced investment calculator, we have the precision tools you need.
              </p>
              <p>
                Recognized as a leading calculator website, SolveItCalculator offers an extensive suite of financial calculators—including tax calculators and savings estimators—that run instantly in your browser with zero latency and complete privacy. 
              </p>
              <p>
                Discover thousands of free calculator tools designed for students, professionals, and everyday users. Fast, accurate, and incredibly easy to use, our platform requires no registration. <strong>Start calculating smarter today.</strong>
              </p>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-primary mt-0 mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined">verified</span>
               Why Use SolveIt Calculators?
            </h3>
            <ul className="list-none pl-0 space-y-4 m-0 text-on-surface-variant font-body-sm text-body-sm">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">check_circle</span>
                <span><strong className="text-on-surface">100% Client-Side Processing:</strong> We never log, store, or transmit your financial data or health metrics to our servers. All calculations happen instantly in your browser memory.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">check_circle</span>
                <span><strong className="text-on-surface">Verified Mathematical Models:</strong> Our algorithms adhere strictly to statutory rules, metrology constants, and clinical thresholds.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">check_circle</span>
                <span><strong className="text-on-surface">No Paywalls or Intrusive Ads:</strong> Enjoy a clean, minimal interface without artificial credit gates, sign-ups, or pop-ups.</span>
              </li>
            </ul>
          </section>

          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 mt-0">
              How Do Our Calculators Work? (Step-by-Step)
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Using a SolveIt calculator is designed to be frictionless, especially on mobile devices:
            </p>
            <ol className="list-decimal pl-5 space-y-4 text-on-surface-variant font-body-sm text-body-sm mb-0">
              <li><strong className="text-on-surface">Select Your Tool:</strong> Use our intelligent search bar or browse the specialized categories to find the exact formula solver you need.</li>
              <li><strong className="text-on-surface">Input Your Parameters:</strong> Enter your baseline data (e.g., loan amount, interest rate, age, weight). Our sliders and numpad-friendly inputs adapt to your device.</li>
              <li><strong className="text-on-surface">Instant Results & Visualizations:</strong> As you type, outputs are recalculated instantly. Look for the dynamic SVG charts, amortization tables, and depletion curves that map your trajectory.</li>
              <li><strong className="text-on-surface">Export or Print:</strong> Save your detailed payment schedules, SIP projections, or conversion tables directly to PDF without creating an account.</li>
            </ol>
          </section>

          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 mt-0">
              Industry Standard vs. SolveIt Calculator
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Not all calculators are created equal. When compounding thousands of dollars over decades, rounding errors matter. Here is how SolveIt stacks up against the competition.
            </p>
            
            <div className="overflow-x-auto border border-outline-variant/30 rounded-xl mb-0">
              <table className="w-full text-left border-collapse min-w-[600px] m-0">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30">
                    <th className="p-4 font-headline-sm text-body-sm text-on-surface-variant font-bold">Feature</th>
                    <th className="p-4 font-headline-sm text-body-sm text-primary font-bold">SolveIt Calculator</th>
                    <th className="p-4 font-headline-sm text-body-sm text-on-surface-variant font-bold">Other Platforms</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm font-body-sm text-on-surface">
                  <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold">Privacy Model</td>
                    <td className="p-4 text-primary font-medium">Client-side execution (Zero logging)</td>
                    <td className="p-4">Server-side form submissions</td>
                  </tr>
                  <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold">Latency / Speed</td>
                    <td className="p-4 text-primary font-medium">~12ms (Native React CPU)</td>
                    <td className="p-4">300ms+ (Network roundtrips)</td>
                  </tr>
                  <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold">Visualizations</td>
                    <td className="p-4 text-primary font-medium">Interactive SVG curves & matrices</td>
                    <td className="p-4">Static numbers only</td>
                  </tr>
                  <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold">Float Precision</td>
                    <td className="p-4 text-primary font-medium">IEEE 754 Big.js (No rounding drift)</td>
                    <td className="p-4">Standard native float (Inaccurate over 30 yrs)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-semibold">Mobile Ergonomics</td>
                    <td className="p-4 text-primary font-medium">Targeted minimum 44px tap areas</td>
                    <td className="p-4">Desktop-first, cramped inputs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 mt-0">
              Professional Standards
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Our financial formulas are reviewed by certified professionals to ensure adherence strictly to Truth in Lending Act (TILA) and CARD Act provisions. Medical calculators (like BMI, TDEE, and Macro Splits) are benchmarked against the latest World Health Organization (WHO) and National Institutes of Health (NIH) publications.
            </p>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-0 italic">
                <strong className="text-on-surface">Disclaimer:</strong> The tools and calculators provided on this website are for educational and informational purposes only. They do not constitute professional financial, medical, or tax advice. Always consult a certified professional before making major life decisions.
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* ================= SECTION 13: FAQ (PEOPLE ALSO ASK) ================= */}
      <section className="w-full py-space-3xl bg-surface-container-low">
        <div className="max-w-3xl mx-auto px-gutter-mobile md:px-gutter-desktop">
          <div className="mb-space-xl text-center">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">Frequently Asked Questions</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2 tracking-tight">People Also Ask (PAA)</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "What is the most accurate online calculator?",
                a: "SolveIt Calculator provides some of the most accurate computational tools by utilizing precise IEEE-754 floating-point logic combined with high-precision arbitrary arithmetic libraries where needed, preventing standard JavaScript rounding errors common in legacy calculators."
              },
              {
                q: "Are the financial calculators free to use?",
                a: "Yes. Every single tool—including our complex mortgage amortization schedules, SIP returns, compound interest models, and credit card payoff visualizers—is 100% free forever. No registration or premium paywalls."
              },
              {
                q: "Do you store my financial or health data?",
                a: "No. SolveIt Calculator uses an 'offline-first' architecture. Your inputs (salary, weight, debts, net worth) are processed locally in your device's browser using React state. We do not have database servers storing your personal metrics."
              },
              {
                q: "Can I use the calculators on my phone?",
                a: "Absolutely. SolveIt Calculator is designed with a mobile-first philosophy, utilizing native mobile numpads, touch-friendly sliders, and responsive SVG charts that look perfectly crisp on iOS and Android devices."
              },
              {
                q: "How often are the tax and interest algorithms updated?",
                a: "Our core team updates the global variables (like IRS tax brackets, standard deduction limits, and national average benchmark APRs) annually or whenever there is a major federal or statutory change."
              },
              {
                q: "Can I save or print the calculation results?",
                a: "Yes. Most of our complex tools, such as the EMI or Mortgage suites, feature a dedicated 'Print' or 'Export' button that generates a clean, ad-free PDF layout of your amortization tables and charts."
              },
              {
                q: "What formulas are used for the health calculators?",
                a: "Our health tools utilize globally recognized clinical standards. For example, our BMR calculator uses the Mifflin-St Jeor equation (the clinical gold standard), and our body fat tool uses the U.S. Navy circumference method."
              },
              {
                q: "Are the scientific tools capable of handling complex equations?",
                a: "Yes. Our scientific suite can handle deep algebraic parentheses nesting, logarithms, trigonometry (radians and degrees), permutations, and complex matrix inversions up to an 8x8 order."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                  {faq.q}
                  <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-5 pb-5 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
