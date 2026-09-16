import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Knowledge Base & Mathematical Guides | SolveIt Calculator',
  description: 'Explore detailed proofs, formula breakdowns, and practical guidance from domain specialists on finance, health, and mathematics.',
};

export default function ArticleIndex() {
  const articles = [
    {
      href: "/article/fallacy-of-bmi-vs-ffmi",
      category: "BODY COMPOSITION",
      title: "The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables",
      desc: "Standard BMI treats muscular mass and visceral adipose identically. Learn how the Fat-Free Mass Index provides clinical resolution.",
    },
    {
      href: "/article/zone-2-cardio-training",
      category: "CARDIOLOGY",
      title: "Zone 2 Cardio Training: Mitochondrial Density & Fat Oxidation Rates",
      desc: "Why training at 1.5–2.0 mmol/L blood lactate stimulates maximal lipid clearance and mitochondrial biogenesis.",
    },
    {
      href: "/article/science-of-90-minute-sleep-cycles",
      category: "CIRCADIAN SCIENCE",
      title: "The Science of 90-Minute Sleep Cycles: How to Awaken Without Inertia",
      desc: "Why waking midway through slow-wave deep sleep triggers profound grogginess, and how ultradian cycles restore alertness.",
    },
    {
      href: "/article/computational-physiology-guide",
      category: "PHYSIOLOGY",
      title: "Computational Physiology Guide: Formulas for Energy, Heart Rate & Body Composition",
      desc: "Peer-reviewed mathematical models for BMR, Karvonen heart rate kinetics, and US Navy body fat algorithms.",
    },
    {
      href: "/article/how-to-calculate-bmi",
      category: "HEALTH",
      title: "How To Calculate BMI: Formula, Categories & Limitations",
      desc: "Why Quetelet index works for large demographics but under-reports muscular density.",
    },
    {
      href: "/article/how-emi-works",
      category: "FINANCE",
      title: "How EMI Works: The Mathematical Breakdown of Amortization",
      desc: "Unpacking the reducing balance method and how bi-weekly payments shave 6+ years off loans.",
      updated: "September 15, 2026",
    },
    {
      href: "/article/understanding-gst",
      category: "BUSINESS",
      title: "Understanding GST: Step-by-Step Calculation for Buyers & Sellers",
      desc: "Reverse tax math demystified: extracting inclusive base costs and input credit pass-throughs.",
      updated: "September 15, 2026",
    },
    {
      href: "/article/investment-planning-basics",
      category: "INVESTING",
      title: "Investment Planning Basics: The Power of Compound Interest & SIP",
      desc: "The exponential arithmetic of reinvested dividends modeled over 10, 20, and 30-year horizons.",
      updated: "September 15, 2026",
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-space-xl">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">Articles</span>
      </nav>

      <h1 className="font-display-hero text-display-md text-on-surface mb-4">Knowledge Base</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-3xl max-w-2xl">
        Detailed guides, mathematical breakdowns, and expert-reviewed methodologies behind our calculators.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {articles.map((article, idx) => (
          <Link href={article.href} key={idx} className="block group">
            <article className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 group-hover:border-primary/40 group-hover:shadow-md transition-all h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-caps text-label-caps text-primary tracking-widest inline-block">
                  {article.category}
                </span>
                {article.updated && (
                  <span className="text-[11px] font-body-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                    Updated: {article.updated}
                  </span>
                )}
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
                {article.desc}
              </p>
              <div className="mt-6 flex items-center text-primary font-body-sm font-medium gap-1">
                Read Article
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
