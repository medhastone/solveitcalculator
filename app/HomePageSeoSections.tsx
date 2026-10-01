import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HomePageSeoSections() {
  return (
    <>
      {/* ================= SEO EDUCATIONAL & METRIC CONTENT ================= */}
      <section className="w-full py-12 sm:py-16 bg-surface-container-low/40 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary uppercase tracking-wider border border-outline-variant/40 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Verified Computational Standards</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                The Best Free Online Calculators For Every Need
              </h2>
            </div>

            {/* Platform Overview Card */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-xs text-left">
              <div className="text-xs sm:text-sm text-on-surface-variant space-y-4 leading-relaxed">
                <p>
                  Welcome to <strong className="text-on-surface">SolveItCalculator</strong>, your trusted destination for free online calculators. Whether you are planning your retirement, estimating monthly payments with our mortgage calculator, or calculating investment growth, we provide the accurate, reliable tools you need.
                </p>
                <p>
                  SolveItCalculator offers a comprehensive suite of financial, health, time, math, and conversion tools that run instantly in your browser with zero latency and 100% client-side privacy.
                </p>
                <p>
                  Designed for students, professionals, and everyday families alike, all calculators are completely free with no registration or subscriptions required.
                </p>
              </div>
            </div>

            {/* Why Use SolveIt Grid Card */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <span>Why Use SolveIt Calculators?</span>
              </h3>
              <ul className="list-none pl-0 space-y-3 m-0 text-xs sm:text-sm text-on-surface-variant">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-on-surface font-semibold">100% In-Browser Privacy:</strong> We do not log, store, or transmit your personal financial numbers or health metrics to external servers. All calculations happen directly on your device.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-on-surface font-semibold">Transparent Mathematical Models:</strong> All equations follow standard financial, statistical, and clinical guidelines with step-by-step arithmetic shown openly.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-on-surface font-semibold">Zero Paywalls or Distractions:</strong> Enjoy clean, fast tools without artificial limits, accounts, or payment prompts.
                  </span>
                </li>
              </ul>
            </div>

            {/* Step-by-Step Card */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-on-surface mb-2">
                How Do Our Calculators Work?
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed">
                Using a SolveIt calculator is designed to be fast and intuitive across all smartphones, tablets, and computers:
              </p>
              <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                <li>
                  <strong className="text-on-surface">Select Your Tool:</strong> Use our instant search bar, browse categories, or choose your goal.
                </li>
                <li>
                  <strong className="text-on-surface">Input Your Numbers:</strong> Enter your numbers with clean, touch-friendly inputs and instant unit toggles.
                </li>
                <li>
                  <strong className="text-on-surface">Instant Results &amp; Breakdowns:</strong> Outputs update immediately with step-by-step breakdowns and summaries.
                </li>
                <li>
                  <strong className="text-on-surface">Save &amp; Export:</strong> Save your results to your browser or print clean schedules whenever needed.
                </li>
              </ol>
            </div>

            {/* Comparison Table Card */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-on-surface mb-2">
                SolveIt Calculator vs. Traditional Tools
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed">
                When compounding numbers over decades, accuracy and speed matter. Here is how SolveIt stacks up:
              </p>

              <div className="overflow-x-auto border border-outline-variant/40 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant/40 text-xs font-bold text-on-surface-variant">
                      <th className="p-3.5">Feature</th>
                      <th className="p-3.5 text-primary">SolveIt Calculator</th>
                      <th className="p-3.5">Other Sites</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-on-surface divide-y divide-outline-variant/20">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3.5 font-medium">Privacy</td>
                      <td className="p-3.5 text-primary font-bold">100% Client-Side (Zero Logging)</td>
                      <td className="p-3.5 text-on-surface-variant">Server database submissions</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3.5 font-medium">Calculation Speed</td>
                      <td className="p-3.5 text-primary font-bold">Instant (~12ms native)</td>
                      <td className="p-3.5 text-on-surface-variant">Slow network roundtrips</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3.5 font-medium">Mobile Experience</td>
                      <td className="p-3.5 text-primary font-bold">Touch-first, large tap targets</td>
                      <td className="p-3.5 text-on-surface-variant">Cramped desktop layouts</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3.5 font-medium">Math Transparency</td>
                      <td className="p-3.5 text-primary font-bold">Documented step-by-step formulas</td>
                      <td className="p-3.5 text-on-surface-variant">Hidden black-box math</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer Box */}
            <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/30 text-center">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface font-semibold">Important Note:</strong> Calculators provided on SolveItCalculator are for informational and educational purposes. Always consult a qualified professional before making major financial, tax, or medical decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
