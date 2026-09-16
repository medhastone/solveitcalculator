import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import StandardDeviationClient from './StandardDeviationClient';

const canonicalUrl = 'https://solveitcalculator.com/math/standard-deviation-calculator';

export const metadata: Metadata = {
  title: 'Standard Deviation Calculator | Population & Sample Variance',
  description: 'Calculate standard deviation, variance, and mean for any dataset. Supports both sample and population calculations with step-by-step mathematical breakdowns.',
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Standard Deviation Calculator | Population & Sample Variance',
    description: 'Calculate standard deviation, variance, and mean for any dataset. Supports both sample and population calculations with step-by-step mathematical breakdowns.',
    url: canonicalUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Standard Deviation Calculator | Population & Sample Variance',
    description: 'Calculate standard deviation, variance, and mean for any dataset. Supports both sample and population calculations with step-by-step mathematical breakdowns.',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Standard Deviation Calculator",
      "url": canonicalUrl,
      "description": "Calculate standard deviation, variance, and mean for any dataset.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any"
    },
    {
      "@type": "SoftwareApplication",
      "name": "Standard Deviation Calculator",
      "url": canonicalUrl,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All"
    },
    {
      "@type": "Article",
      "headline": "Standard Deviation Calculator & Variance Formula Guide",
      "url": canonicalUrl,
      "description": "A comprehensive tool and guide to calculating population and sample standard deviation.",
      "author": {
        "@type": "Organization",
        "name": "SolveIt Calculator"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between sample and population standard deviation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Population standard deviation measures the dispersion of an entire population and divides the sum of squared deviations by N. Sample standard deviation estimates the dispersion based on a sample and divides by N-1 (Bessel's correction) to provide an unbiased estimate."
          }
        },
        {
          "@type": "Question",
          "name": "What does standard deviation tell you?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard deviation measures the amount of variation or dispersion in a set of values. A low standard deviation indicates that values are clustered close to the mean, while a high standard deviation indicates that values are spread out over a wider range."
          }
        },
        {
          "@type": "Question",
          "name": "How do I calculate standard deviation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To calculate it manually: 1) Find the mean of the data set. 2) Subtract the mean from each data point and square the result. 3) Find the mean of those squared differences (this is the variance). 4) Take the square root of the variance."
          }
        },
        {
          "@type": "Question",
          "name": "Why is the sample formula divided by N-1?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dividing by N-1, known as Bessel's correction, corrects the bias in the estimation of the population variance. It mathematically adjusts the estimate upward, preventing the sample from underestimating the true population spread."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Calculate Standard Deviation",
      "description": "Step-by-step guide to manually calculate the standard deviation of a dataset.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Calculate the Mean",
          "text": "Add all the numbers in the dataset together and divide by the total count (N)."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate the Deviations",
          "text": "Subtract the mean from every single value in the dataset."
        },
        {
          "@type": "HowToStep",
          "name": "Square the Deviations",
          "text": "Square each of the differences obtained in the previous step."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate the Variance",
          "text": "Sum all the squared deviations. Divide this sum by N (for a population) or N-1 (for a sample)."
        },
        {
          "@type": "HowToStep",
          "name": "Find the Square Root",
          "text": "Take the square root of the variance to get the standard deviation."
        }
      ]
    }
  ]
};

export default function StandardDeviationPage() {
  return (
    <main className="w-full bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* HEADER SECTION */}
      <header className="bg-surface-container-low py-space-xl border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <nav className="flex items-center text-sm font-medium text-on-surface-variant mb-space-sm">
              <Link href="/math" className="hover:text-primary transition-colors">Math</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-on-surface">Standard Deviation</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-sm">
              Standard Deviation Calculator
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Instantly calculate standard deviation, variance, mean, and sum of squares for any numerical dataset. Compare population and sample variance with full step-by-step mathematical working.
            </p>
          </div>
        </div>
      </header>

      {/* CALCULATOR APPLET */}
      <section className="py-space-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StandardDeviationClient />
        </div>
      </section>

      {/* EDUCATIONAL CONTENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-space-xl space-y-space-xl">
        
        {/* Quick Answer */}
        <div className="bg-primary-container/30 p-6 md:p-8 rounded-3xl border border-primary/10">
          <h2 className="font-headline-md text-on-surface flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Quick Answer: What is Standard Deviation?
          </h2>
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
            Standard deviation is a statistical measure that calculates the dispersion of a dataset relative to its mean. If the standard deviation is low, the data points tend to be very close to the mean. If it is high, the data points are spread out over a large range of values.
          </p>
          <ul className="list-disc list-inside font-body-md text-on-surface-variant space-y-2">
            <li><strong>Symbol:</strong> <span className="font-mono bg-surface-container px-2 py-0.5 rounded">σ</span> (Sigma) for Population, <span className="font-mono bg-surface-container px-2 py-0.5 rounded">s</span> for Sample.</li>
            <li><strong>Variance:</strong> Standard deviation is exactly the square root of the variance.</li>
            <li><strong>Normal Distribution:</strong> In a normal curve, 68% of values fall within 1 standard deviation, 95% within 2, and 99.7% within 3.</li>
          </ul>
        </div>

        {/* Formulas */}
        <div>
          <h2 className="font-headline-md text-on-surface mb-6">The Formulas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
              <h3 className="font-headline-sm text-on-surface mb-3">Population Standard Deviation (σ)</h3>
              <p className="font-body-sm text-on-surface-variant mb-4">
                Use when your data represents the <strong>entire</strong> population of interest.
              </p>
              <div className="bg-surface-container-highest p-4 rounded-xl flex items-center justify-center mb-4">
                <span className="font-serif italic text-xl text-on-surface">σ = √( Σ(x - μ)² / N )</span>
              </div>
              <ul className="text-sm text-on-surface-variant space-y-1">
                <li><strong>μ</strong> = Population Mean</li>
                <li><strong>N</strong> = Size of the population</li>
                <li><strong>x</strong> = Each individual value</li>
              </ul>
            </div>

            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
              <h3 className="font-headline-sm text-on-surface mb-3">Sample Standard Deviation (s)</h3>
              <p className="font-body-sm text-on-surface-variant mb-4">
                Use when your data represents a <strong>sample subset</strong> of a larger population.
              </p>
              <div className="bg-surface-container-highest p-4 rounded-xl flex items-center justify-center mb-4">
                <span className="font-serif italic text-xl text-on-surface">s = √( Σ(x - x̄)² / (n - 1) )</span>
              </div>
              <ul className="text-sm text-on-surface-variant space-y-1">
                <li><strong>x̄</strong> = Sample Mean</li>
                <li><strong>n</strong> = Size of the sample</li>
                <li><strong>n - 1</strong> = Bessel's correction</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div>
          <h2 className="font-headline-md text-on-surface mb-6">Population vs. Sample Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-outline-variant/20 rounded-2xl overflow-hidden">
              <thead className="bg-surface-container">
                <tr>
                  <th className="py-4 px-4 font-semibold text-on-surface">Feature</th>
                  <th className="py-4 px-4 font-semibold text-on-surface">Population (σ)</th>
                  <th className="py-4 px-4 font-semibold text-on-surface">Sample (s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr>
                  <td className="py-3 px-4 font-medium text-on-surface">Use Case</td>
                  <td className="py-3 px-4 text-on-surface-variant">When analyzing the entire group.</td>
                  <td className="py-3 px-4 text-on-surface-variant">When estimating a larger group from a subset.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-on-surface">Denominator</td>
                  <td className="py-3 px-4 text-on-surface-variant">N (Total Count)</td>
                  <td className="py-3 px-4 text-on-surface-variant">n - 1 (Bessel's Correction)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-on-surface">Mean Symbol</td>
                  <td className="py-3 px-4 text-on-surface-variant">μ (Mu)</td>
                  <td className="py-3 px-4 text-on-surface-variant">x̄ (x-bar)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-on-surface">Result Magnitude</td>
                  <td className="py-3 px-4 text-on-surface-variant">Always smaller (tighter)</td>
                  <td className="py-3 px-4 text-on-surface-variant">Always slightly larger (more conservative)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Calculate */}
        <div>
          <h2 className="font-headline-md text-on-surface mb-6">How to Calculate Standard Deviation By Hand</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-semibold text-on-surface mb-1">Calculate the Mean</h4>
                <p className="text-on-surface-variant font-body-sm">Add up all the data points and divide by the total number of data points.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-semibold text-on-surface mb-1">Calculate the Deviations</h4>
                <p className="text-on-surface-variant font-body-sm">Subtract the mean from each individual data point.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold text-on-surface mb-1">Square the Deviations</h4>
                <p className="text-on-surface-variant font-body-sm">Multiply each deviation by itself. This removes negative numbers and exponentially penalizes outliers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-semibold text-on-surface mb-1">Calculate the Variance</h4>
                <p className="text-on-surface-variant font-body-sm">Find the sum of all the squared deviations. Divide this sum by N (for population) or N-1 (for a sample).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">5</div>
              <div>
                <h4 className="font-semibold text-on-surface mb-1">Take the Square Root</h4>
                <p className="text-on-surface-variant font-body-sm">Finally, take the square root of the variance to scale the number back down to the original units of your data.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="font-headline-md text-on-surface mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group bg-surface-container p-6 rounded-2xl border border-outline-variant/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-on-surface cursor-pointer">
                What does a standard deviation of 0 mean?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body-sm leading-relaxed">
                A standard deviation of zero means there is absolutely no variation in the dataset. Every single data point is exactly the same, which means they are all identical to the mean.
              </div>
            </details>
            
            <details className="group bg-surface-container p-6 rounded-2xl border border-outline-variant/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-on-surface cursor-pointer">
                Can standard deviation be negative?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body-sm leading-relaxed">
                No, standard deviation can never be negative. Because you square the deviations before averaging them and then take the principal (positive) square root, the result is always a positive number or zero.
              </div>
            </details>
            
            <details className="group bg-surface-container p-6 rounded-2xl border border-outline-variant/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-on-surface cursor-pointer">
                Why do we square the deviations instead of taking absolute values?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body-sm leading-relaxed">
                Squaring the differences not only makes all negative values positive, but it also gives more weight (or penalty) to data points that are further from the mean (outliers). This mathematical property makes standard deviation highly sensitive to outliers, which is often desirable in statistics.
              </div>
            </details>

            <details className="group bg-surface-container p-6 rounded-2xl border border-outline-variant/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-on-surface cursor-pointer">
                What is the Empirical Rule (68-95-99.7 rule)?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body-sm leading-relaxed">
                If your data follows a normal distribution (a bell curve), the empirical rule states that approximately 68% of your data will fall within one standard deviation of the mean, 95% will fall within two standard deviations, and 99.7% will fall within three standard deviations.
              </div>
            </details>
          </div>
        </div>

        {/* EEAT Section */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 mt-12 text-sm text-on-surface-variant">
          <h3 className="font-semibold text-on-surface mb-2">Methodology & Accuracy</h3>
          <p className="mb-4">
            This calculator is designed to provide clinical-grade statistical outputs utilizing established mathematical formulas (Bessel's Correction for sample sets and standard division for population sets). It is capable of handling heavy floating-point precision and large comma-separated arrays.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Expert Reviewed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">update</span>
              <span>Updated: Sept 2026</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Strict Formula Compliance</span>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
