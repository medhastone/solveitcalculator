import React from 'react';

export default function MathMethodologyAndDifferences() {
  const steps = [
    {
      num: '01',
      title: 'Choose the Calculation',
      desc: 'Select the specific problem type—such as solving a quadratic equation, simplifying fractions, or computing sample standard deviation.',
    },
    {
      num: '02',
      title: 'Enter Required Values',
      desc: 'Provide input parameters with client-side constraint checking and validation for non-zero denominators and real domain boundaries.',
    },
    {
      num: '03',
      title: 'Apply Documented Formulas',
      desc: 'The tool executes standard mathematical algorithms in your browser without proprietary black-box calculations.',
    },
    {
      num: '04',
      title: 'Review Primary Result',
      desc: 'The verified answer is displayed immediately with clearly labeled units, degrees or radians, and exact rational fractions where supported.',
    },
    {
      num: '05',
      title: 'Explore Steps & Derivations',
      desc: 'Expand intermediate substitutions, factor trees, and pedagogical explanations to understand the underlying mathematics.',
    },
  ];

  const differenceReasons = [
    {
      factor: 'Degree vs. Radian Mode in Trigonometry',
      explanation:
        'Trigonometric functions like sin(30) yield 0.5 in Degree mode, but -0.988 in Radian mode. Always ensure your calculator matches the angle unit requested in your assignment.',
      example: 'sin(30°) = 0.5 vs. sin(30 rad) ≈ -0.9880',
    },
    {
      factor: 'Sample (n - 1) vs. Population (N) Standard Deviation',
      explanation:
        'Calculators designed for inferential statistics divide squared deviations by n - 1 (Bessel’s correction), whereas population tools divide by N. This produces slightly different standard deviation numbers on the exact same dataset.',
      example: 'Dataset [2, 4, 6]: Sample s = 2.0 vs. Population σ ≈ 1.633',
    },
    {
      factor: 'Intermediate Truncation vs. Exact Rational Fractions',
      explanation:
        'Rounding numbers during intermediate calculation steps (e.g., rounding 1/3 to 0.33 early) introduces compounding truncation error compared to calculators that preserve exact fractions throughout.',
      example: '3 × (1/3) = 1 (exact) vs. 3 × 0.333 = 0.999 (truncated)',
    },
    {
      factor: 'Percent Change vs. Percent Difference',
      explanation:
        'Percent change calculates relative growth from a chronological baseline [(New - Old) / Old], while percent difference uses the average of the two numbers [|A - B| / ((A + B)/2)].',
      example: 'Change from $50 to $75 is +50%; symmetric difference between $50 and $75 is 40%.',
    },
    {
      factor: 'Implicit Multiplication & Precedence Conventions',
      explanation:
        'Expressions like 6 ÷ 2(1 + 2) can be interpreted differently depending on whether implicit multiplication adjacent to parentheses takes precedence over standard left-to-right division.',
      example: 'Strict PEMDAS evaluates 6 ÷ 2 × 3 = 9; calculators prioritizing implicit multiplication evaluate 6 ÷ 6 = 1.',
    },
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section 1: How Our Math Calculators Work */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Deterministic Methodology
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              How Our Math Calculators Work
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Every tool executes transparent, documented mathematical methods in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <span className="font-mono text-xl font-bold text-primary mb-2 block">
                    {st.num}
                  </span>
                  <h3 className="font-bold text-on-surface text-sm sm:text-base mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Details Grid */}
          <div className="mt-8 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-on-surface-variant">
            <div>
              <div className="font-bold text-on-surface mb-1 flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-base">pin</span>
                <span>Arithmetic Precision</span>
              </div>
              <p className="leading-relaxed">
                We use high-precision numerical representations. Where exact rational representations are supported (such as fraction arithmetic), exact fractions are maintained rather than prematurely rounded.
              </p>
            </div>
            <div>
              <div className="font-bold text-on-surface mb-1 flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-base">domain_verification</span>
                <span>Domain Validation</span>
              </div>
              <p className="leading-relaxed">
                Inputs are sanitized and tested against mathematical domains: division by zero, non-positive logarithm arguments, and invalid square roots are caught with clear, helpful explanations.
              </p>
            </div>
            <div>
              <div className="font-bold text-on-surface mb-1 flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-base">rule</span>
                <span>Transparent Rounding</span>
              </div>
              <p className="leading-relaxed">
                When irrational constants (like π or e) or non-terminating decimals are evaluated, results are rounded to 4–6 decimal places with stated rounding conventions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Why Your Answer May Differ */}
        <div className="pt-12 border-t border-outline-variant/20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Comparative Nuance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Why Your Answer May Differ From Another Calculator
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              If two websites or textbook answer keys show slightly different values, here are the most common mathematical explanations:
            </p>
          </div>

          <div className="space-y-3.5">
            {differenceReasons.map((item) => (
              <div
                key={item.factor}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="md:w-3/5">
                  <h3 className="font-bold text-on-surface text-sm sm:text-base mb-1">
                    {item.factor}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
                <div className="md:w-2/5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 font-mono text-xs text-primary">
                  <span className="text-[10px] uppercase font-semibold text-on-surface-variant block mb-0.5">
                    Example Comparison:
                  </span>
                  {item.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
