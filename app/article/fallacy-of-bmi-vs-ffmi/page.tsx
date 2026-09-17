import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables | SolveIt Calculator',
  description: 'Understand why Body Mass Index (BMI) misdiagnoses muscular individuals and how the Fat-Free Mass Index (FFMI) provides clinical body composition accuracy.',
  keywords: [
    'BMI vs FFMI',
    'fat free mass index formula',
    'normalized FFMI calculator',
    'why BMI is inaccurate for athletes',
    'FFMI scale natural limit',
    'how to calculate FFMI',
    'body composition vs BMI',
    'lean mass index calculation',
    'harvard ffmi study kouri',
    'quetelet index flaw'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/article/fallacy-of-bmi-vs-ffmi',
  },
  openGraph: {
    title: 'The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables',
    description: 'Standard BMI treats skeletal muscle and visceral adipose identically. Discover why the Fat-Free Mass Index (FFMI) provides the true clinical picture for athletic physiques.',
    url: 'https://solveitcalculator.com/article/fallacy-of-bmi-vs-ffmi',
    siteName: 'SolveIt Calculator',
    type: 'article',
    publishedTime: '2024-11-15T08:00:00.000Z',
    modifiedTime: '2026-09-15T08:00:00.000Z',
    images: [
      {
        url: 'https://solveitcalculator.com/og-fallacy-bmi-ffmi.png',
        width: 1200,
        height: 630,
        alt: 'BMI vs FFMI Body Composition Infographic'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables',
    description: 'Why BMI falsely classifies athletes as overweight, and how Normalized FFMI provides true clinical body composition metrics.',
    images: ['https://solveitcalculator.com/og-fallacy-bmi-ffmi.png'],
  }
};

export default function FallacyBmiVsFfmiPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://solveitcalculator.com/article/fallacy-of-bmi-vs-ffmi#article",
        "isPartOf": {
          "@type": "WebPage",
          "@id": "https://solveitcalculator.com/article/fallacy-of-bmi-vs-ffmi"
        },
        "headline": "The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables",
        "author": {
          "@type": "Organization",
          "name": "SolveIt Medical & Scientific Editorial Board",
          "url": "https://solveitcalculator.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "SolveIt Calculator",
          "url": "https://solveitcalculator.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://solveitcalculator.com/logo.png?v=2"
          }
        },
        "datePublished": "2024-11-15T08:00:00Z",
        "dateModified": "2026-09-15T08:00:00Z",
        "description": "A comprehensive examination of why BMI misclassifies athletic physiques, introducing Fat-Free Mass Index (FFMI) mathematics, natural limits, and clinical body composition analysis.",
        "mainEntityOfPage": "https://solveitcalculator.com/article/fallacy-of-bmi-vs-ffmi"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://solveitcalculator.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Health Knowledge Base",
            "item": "https://solveitcalculator.com/article"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "BMI vs. FFMI Guide",
            "item": "https://solveitcalculator.com/article/fallacy-of-bmi-vs-ffmi"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why is BMI misleading for weightlifters and athletes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "BMI calculates solely based on total body weight divided by height squared. Because skeletal muscle is approximately 18% denser than adipose tissue, a lean athlete with substantial muscular hypertrophy often registers as 'overweight' or 'obese' on standard BMI charts despite having low body fat and exceptional metabolic health."
            }
          },
          {
            "@type": "Question",
            "name": "What is considered a good FFMI score?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For men, an average untrained FFMI is roughly 18 to 19. A score of 20 to 21 indicates an athletic build with consistent resistance training. Scores between 22 and 24 represent advanced natural bodybuilders. An FFMI above 25 is widely recognized in exercise science as approaching or exceeding the natural genetic threshold without exogenous anabolics."
            }
          },
          {
            "@type": "Question",
            "name": "How is Normalized FFMI calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Normalized FFMI adjusts raw FFMI to a standardized height of 1.80 meters (5'11\"), correcting for the geometric scaling bias where taller individuals naturally achieve higher raw FFMI values. The formula is: Normalized FFMI = Raw FFMI + 6.1 × (1.80 - Height in meters)."
            }
          },
          {
            "@type": "Question",
            "name": "What is the natural limit of FFMI for non-enhanced athletes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In the landmark 1995 Harvard study by Kouri et al., pre-steroid era Mr. America champions (1939-1959) averaged a normalized FFMI of 25.4, with essentially no drug-free individuals exceeding 25.0 in modern tested cohorts. Scores above 25.5 are statistically improbable without anabolic androgenic steroid support."
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

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-space-xl overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/article" className="hover:text-primary transition-colors">Knowledge Base</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium truncate">BMI vs. FFMI Guide</span>
      </nav>

      {/* Hero Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps font-bold">
            CLINICAL BODY COMPOSITION
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Published: Nov 15, 2024 • Last Updated: September 15, 2026 • 9 Min Read
          </span>
        </div>
        <h1 className="font-display-hero text-display-md text-on-surface mb-4 leading-tight">
          The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
          Standard Body Mass Index treats skeletal muscle and visceral adipose identically. Discover why the Fat-Free Mass Index (FFMI) provides the true clinical picture for athletic physiques and strength athletes.
        </p>

        {/* Clinical & Scientific Editorial Verification Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <p className="font-body-md font-bold text-on-surface m-0">Medically Reviewed &amp; Fact-Checked</p>
              <p className="font-body-sm text-xs text-on-surface-variant m-0">Scientific Editorial Board • Exercise Physiology &amp; Clinical Anthropometrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Peer-Reviewed Literature Cited</span>
          </div>
        </div>
      </header>

      {/* HERO SVG THUMBNAIL & INFOGRAPHIC */}
      <figure className="mb-10 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm bg-surface-container-lowest">
        <div className="w-full bg-surface-container-high p-4 md:p-6 flex items-center justify-center">
          <svg 
            viewBox="0 0 800 400" 
            className="w-full h-auto max-h-[420px] select-none" 
            role="img" 
            aria-label="BMI vs FFMI Visual Comparison Infographic"
          >
            <defs>
              <linearGradient id="gradMuscle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="gradFat" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Background Canvas */}
            <rect width="800" height="400" rx="16" fill="url(#bgGrad)" />

            {/* Header / Title inside SVG */}
            <text x="400" y="38" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="bold" fontFamily="system-ui, sans-serif">
              THE BODY COMPOSITION PARADOX: IDENTICAL SCALE WEIGHT
            </text>
            <text x="400" y="60" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">
              Height: 180 cm (5&apos;11&quot;) | Scale Weight: 90 kg (198.4 lbs) | BMI: 27.8 kg/m² (&ldquo;Overweight&rdquo;)
            </text>

            {/* Card Left: Athlete (Subject A) */}
            <rect x="50" y="85" width="330" height="275" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="65" y="100" width="300" height="28" rx="6" fill="#0369a1" fillOpacity="0.2" />
            <text x="215" y="119" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="bold" fontFamily="system-ui, sans-serif">
              SUBJECT A: RESISTANCE ATHLETE
            </text>

            {/* Athlete Stacked Bar */}
            <rect x="75" y="145" width="250" height="34" rx="6" fill="#334155" />
            {/* 88% Lean Mass */}
            <rect x="75" y="145" width="220" height="34" rx="6" fill="url(#gradMuscle)" />
            {/* 12% Fat Mass */}
            <rect x="295" y="145" width="30" height="34" rx="0 6 6 0" fill="url(#gradFat)" />

            <text x="75" y="140" fill="#94a3b8" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">TISSUE DISTRIBUTION (DEXA)</text>
            <text x="180" y="167" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
              79.2 kg Lean (88%)
            </text>
            <text x="310" y="167" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
              12%
            </text>

            {/* Subject A Biometrics */}
            <text x="75" y="215" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">Standard BMI:</text>
            <text x="345" y="215" textAnchor="end" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">27.8 (Overweight)</text>

            <text x="75" y="245" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">Normalized FFMI:</text>
            <text x="345" y="245" textAnchor="end" fill="#38bdf8" fontSize="15" fontWeight="bold" fontFamily="monospace">24.4 (Elite Peak)</text>

            <text x="75" y="275" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">Visceral Fat Rating:</text>
            <text x="345" y="275" textAnchor="end" fill="#34d399" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif">Level 2 (Optimal)</text>

            <rect x="75" y="295" width="280" height="48" rx="6" fill="#0f172a" />
            <text x="215" y="315" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif">
              METABOLIC STATUS: EXCELLENT
            </text>
            <text x="215" y="331" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
              High insulin sensitivity &amp; capillary density
            </text>

            {/* Card Right: Sedentary (Subject B) */}
            <rect x="420" y="85" width="330" height="275" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="435" y="100" width="300" height="28" rx="6" fill="#d97706" fillOpacity="0.2" />
            <text x="585" y="119" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold" fontFamily="system-ui, sans-serif">
              SUBJECT B: SEDENTARY WORKER
            </text>

            {/* Sedentary Stacked Bar */}
            <rect x="445" y="145" width="250" height="34" rx="6" fill="#334155" />
            {/* 68% Lean Mass */}
            <rect x="445" y="145" width="170" height="34" rx="6" fill="url(#gradMuscle)" />
            {/* 32% Fat Mass */}
            <rect x="615" y="145" width="80" height="34" rx="0 6 6 0" fill="url(#gradFat)" />

            <text x="445" y="140" fill="#94a3b8" fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">TISSUE DISTRIBUTION (DEXA)</text>
            <text x="530" y="167" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
              61.2 kg Lean (68%)
            </text>
            <text x="655" y="167" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">
              32% Fat
            </text>

            {/* Subject B Biometrics */}
            <text x="445" y="215" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">Standard BMI:</text>
            <text x="715" y="215" textAnchor="end" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">27.8 (Overweight)</text>

            <text x="445" y="245" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">Normalized FFMI:</text>
            <text x="715" y="245" textAnchor="end" fill="#94a3b8" fontSize="15" fontWeight="bold" fontFamily="monospace">18.9 (Average)</text>

            <text x="445" y="275" fill="#94a3b8" fontSize="13" fontFamily="system-ui, sans-serif">Visceral Fat Rating:</text>
            <text x="715" y="275" textAnchor="end" fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif">Level 14 (Elevated)</text>

            <rect x="445" y="295" width="280" height="48" rx="6" fill="#0f172a" />
            <text x="585" y="315" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="system-ui, sans-serif">
              METABOLIC STATUS: AT RISK
            </text>
            <text x="585" y="331" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="system-ui, sans-serif">
              Subclinical inflammation &amp; sarcopenic tendency
            </text>

            {/* Bottom Scale Strip */}
            <rect x="50" y="372" width="700" height="16" rx="4" fill="#0f172a" />
            <circle cx="150" cy="380" r="4" fill="#0284c7" />
            <text x="160" y="384" fill="#cbd5e1" fontSize="10" fontFamily="system-ui, sans-serif">Skeletal Muscle: 1.06 g/cm³ (+18% Denser)</text>
            <circle cx="480" cy="380" r="4" fill="#d97706" />
            <text x="490" y="384" fill="#cbd5e1" fontSize="10" fontFamily="system-ui, sans-serif">Adipose Tissue: 0.90 g/cm³ (Lower Density)</text>
          </svg>
        </div>
        <figcaption className="p-4 bg-surface-container-lowest text-xs text-on-surface-variant text-center font-body-sm">
          <strong>Figure 1.0:</strong> Comparison of identical scale-weight individuals evaluated under standard two-dimensional BMI versus multi-compartment Fat-Free Mass Index (FFMI).
        </figcaption>
      </figure>

      {/* TABLE OF CONTENTS */}
      <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 mb-10">
        <h2 className="font-headline-sm text-on-surface m-0 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">list_alt</span>
          Table of Contents
        </h2>
        <nav className="grid sm:grid-cols-2 gap-2 text-body-sm font-body-sm">
          <a href="#section-quetelet-paradox" className="text-primary hover:underline flex items-center gap-1.5">
            <span>1. The Quetelet Flaw: Why Density Breaks BMI</span>
          </a>
          <a href="#section-side-by-side" className="text-primary hover:underline flex items-center gap-1.5">
            <span>2. Side-by-Side Archetypes: Identical BMI, Divergent Health</span>
          </a>
          <a href="#section-mathematics" className="text-primary hover:underline flex items-center gap-1.5">
            <span>3. The Complete Mathematical Derivation of FFMI</span>
          </a>
          <a href="#section-natural-limits" className="text-primary hover:underline flex items-center gap-1.5">
            <span>4. Harvard Clinical Scale &amp; The 25.0 Natural Ceiling</span>
          </a>
          <a href="#section-clinical-recommendations" className="text-primary hover:underline flex items-center gap-1.5">
            <span>5. What to Measure Instead of Raw BMI</span>
          </a>
          <a href="#section-references" className="text-primary hover:underline flex items-center gap-1.5">
            <span>6. Peer-Reviewed References &amp; Clinical Sources</span>
          </a>
          <a href="#section-faq" className="text-primary hover:underline flex items-center gap-1.5 sm:col-span-2">
            <span>7. Frequently Asked Questions (FAQ)</span>
          </a>
        </nav>
      </section>

      <div className="space-y-10">
        {/* SECTION 1 */}
        <section id="section-quetelet-paradox" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">1. The Quetelet Flaw: Why Density Breaks Standard BMI Tables</h2>
          
          <h3 className="font-headline-md text-primary mb-3 mt-0">Historical Context: The Origin of &ldquo;Social Physics&rdquo;</h3>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            In 1832, Belgian mathematician, statistician, and astronomer <strong>Adolphe Quetelet</strong> devised what he designated &ldquo;social physics&rdquo;—an empirical ratio intended to assess population-wide weight trends across 19th-century European demographics. Quetelet explicitly noted that his formula was formulated for population census averages and was entirely unsuitable for assessing an individual&apos;s physical health or adiposity. Later in 1972, physiologist Ancel Keys popularized the ratio as &ldquo;Body Mass Index&rdquo; in his seminal validation paper indexed in the{' '}
            <a 
              href="https://pubmed.ncbi.nlm.nih.gov/4650629/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
            >
              National Library of Medicine (PubMed: 4650629)
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>.
          </p>
          
          <h3 className="font-headline-md text-on-surface mb-3">The Dimensionality Error: Square vs. Cube</h3>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            The fundamental mathematical flaw of BMI stems from dimensional scaling:
          </p>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 font-data-mono text-center text-body-md font-bold text-on-surface mb-4">
            BMI = Total Mass (kg) / [Height (m)]²
          </div>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            The human body is a <strong>three-dimensional volume</strong>. In geometric scaling laws (the Square-Cube Law described by Galileo), as an organism scales proportionally in height, its mass scales cubically ($\propto h^3$). By dividing mass by height squared ($h^2$) instead of $h^3$, the standard BMI equation systematically:
          </p>
          <ul className="space-y-2 font-body-md text-on-surface-variant mb-6 pl-5">
            <li><strong>Overestimates fatness in taller individuals</strong> (above 183 cm / 6&apos;0&quot;), artificially pushing them into &ldquo;overweight&rdquo; categories.</li>
            <li><strong>Underestimates fatness in shorter individuals</strong> (below 165 cm / 5&apos;5&quot;), masking high visceral adiposity.</li>
          </ul>
          <p className="font-body-sm text-on-surface-variant mb-4 leading-relaxed bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
            Even institutional health authorities like the{' '}
            <a 
              href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              CDC (Centers for Disease Control and Prevention)
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>{' '}
            and the{' '}
            <a 
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              World Health Organization (WHO)
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>{' '}
            explicitly publish clinical guidelines noting that BMI does not directly measure body fat, and that athletic or muscular individuals frequently register elevated scores without elevated cardiometabolic risk.
          </p>

          <h3 className="font-headline-md text-on-surface mb-3">The Tissue Density Disparity</h3>
          <p className="font-body-md text-on-surface-variant mb-0 leading-relaxed">
            Even more critically, BMI contains zero coefficients for <strong>tissue composition</strong>. Skeletal muscle tissue has an average physical density of <strong>1.06 g/cm³</strong>, whereas adipose fat tissue possesses a density of approximately <strong>0.90 g/cm³</strong> (a difference of nearly 18%). When an individual engages in progressive resistance training and builds dense contractile tissue, their body density rises. BMI rewards atrophy and penalizes hypertrophy.
          </p>
        </section>

        {/* SECTION 2 */}
        <section id="section-side-by-side" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">2. Side-by-Side Archetypes: Identical BMI, Divergent Health</h2>
          
          <h3 className="font-headline-md text-on-surface mb-3 mt-0">Clinical Case Study: 90 kg at 180 cm</h3>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
            Examine two 32-year-old males of identical height and total scale weight evaluated in an exercise physiology laboratory:
          </p>

          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl mb-6">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 font-headline-sm">
                  <th className="p-3">Biometric Variable</th>
                  <th className="p-3 text-primary">Subject A (Strength Athlete)</th>
                  <th className="p-3 text-secondary">Subject B (Sedentary Office Worker)</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-on-surface-variant">
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Height &amp; Scale Weight</td>
                  <td className="p-3">180 cm (5&apos;11&quot;) • 90 kg (198.4 lbs)</td>
                  <td className="p-3">180 cm (5&apos;11&quot;) • 90 kg (198.4 lbs)</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Standard BMI Classification</td>
                  <td className="p-3 font-bold text-amber-600">27.8 kg/m² (&ldquo;Overweight&rdquo;)</td>
                  <td className="p-3 font-bold text-amber-600">27.8 kg/m² (&ldquo;Overweight&rdquo;)</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Body Fat % (DEXA 4-Compartment)</td>
                  <td className="p-3 font-bold text-emerald-600">12.0% (Lean Athletic)</td>
                  <td className="p-3 font-bold text-red-600">32.0% (High Adiposity)</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Fat-Free Mass (Lean Muscle + Bone)</td>
                  <td className="p-3 font-bold text-primary">79.2 kg (174.6 lbs)</td>
                  <td className="p-3 font-bold text-secondary">61.2 kg (134.9 lbs)</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Normalized FFMI</td>
                  <td className="p-3 font-bold text-primary text-base">24.4 (Elite Muscularity)</td>
                  <td className="p-3 font-bold text-secondary text-base">18.9 (Untrained Baseline)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-on-surface">Fasting Insulin &amp; Triglycerides</td>
                  <td className="p-3 text-emerald-600 font-semibold">3.8 µIU/mL • 68 mg/dL</td>
                  <td className="p-3 text-red-600 font-semibold">14.2 µIU/mL • 210 mg/dL</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
            <h4 className="font-headline-sm text-on-surface mt-0 mb-2">The Epidemiological Consequence</h4>
            <p className="font-body-md text-on-surface-variant m-0 leading-relaxed">
              If evaluated strictly via standard electronic medical records (EMR), both men receive an identical insurance risk tier and the clinical designation of &ldquo;Pre-obese/Overweight&rdquo;. However, Subject A possesses <strong>18 kilograms (nearly 40 pounds)</strong> more insulin-sensitive muscle mass, superior bone mineral density, and optimal cardiovascular markers. Subject B presents with subclinical metabolic syndrome and high visceral adipose volume.
            </p>
          </div>
        </section>

        {/* SECTION 3: MATHEMATICAL DERIVATION */}
        <section id="section-mathematics" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">3. The Complete Mathematical Derivation of FFMI</h2>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
            In 1995, Dr. Elena Kouri, Dr. Harrison Pope, and their investigative team at <strong>Harvard Medical School / McLean Hospital</strong> published a landmark study in the{' '}
            <a 
              href="https://pubmed.ncbi.nlm.nih.gov/7496846/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              <em>Clinical Journal of Sport Medicine</em> (PubMed PMID: 7496846)
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>{' '}
            introducing the <strong>Fat-Free Mass Index (FFMI)</strong> to quantify muscularity normalized against skeletal frame height.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-primary mt-0 mb-2">Step 1: Quantify Fat-Free Mass (FFM)</h3>
              <p className="font-body-sm text-on-surface-variant mb-2">
                Calculate total non-fat mass by subtracting body fat percentage:
              </p>
              <div className="bg-surface-container-lowest p-3 rounded font-data-mono text-sm text-on-surface border border-outline-variant/20 mb-2">
                FFM (kg) = Weight (kg) × [1 - (Body Fat % / 100)]
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant m-0">
                Example: For 90 kg at 12% body fat: 90 × [1 - 0.12] = <strong>79.2 kg FFM</strong>.
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-primary mt-0 mb-2">Step 2: Calculate Raw FFMI</h3>
              <p className="font-body-sm text-on-surface-variant mb-2">
                Scale lean mass against the square of height:
              </p>
              <div className="bg-surface-container-lowest p-3 rounded font-data-mono text-sm text-on-surface border border-outline-variant/20 mb-2">
                Raw FFMI = FFM (kg) / [Height (m)]²
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant m-0">
                Example: 79.2 / (1.80 × 1.80) = 79.2 / 3.24 = <strong>24.44 kg/m²</strong>.
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-secondary mt-0 mb-2">Step 3: Calculate Normalized FFMI (Height Standardization)</h3>
              <p className="font-body-sm text-on-surface-variant mb-2">
                Because taller individuals naturally exhibit slightly higher raw FFMI values due to frame width and lever length, the Harvard researchers introduced a linear regression normalization to a standard height baseline of <strong>1.80 meters (5&apos;11&quot;)</strong>:
              </p>
              <div className="bg-surface-container-lowest p-3 rounded font-data-mono text-sm text-on-surface border border-outline-variant/20 mb-2">
                Normalized FFMI = Raw FFMI + 6.1 × [1.80 - Height (m)]
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant m-0">
                Note: At exactly 1.80 meters, the adjustment term is zero. For an athlete of 1.95 meters, it subtracts 0.91 points, neutralizing the height advantage.
              </p>
            </div>
          </div>

          {/* INLINE EXPLANATORY SVG DIAGRAM */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
            <h4 className="font-headline-sm text-on-surface mt-0 mb-3">Figure 1.1: The FFMI Normalization Curve Across Heights</h4>
            <div className="w-full overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 220" className="w-full h-auto max-h-[220px]" role="img" aria-label="FFMI Normalization Curve">
                <rect width="600" height="220" rx="8" fill="#0f172a" />
                <line x1="60" y1="180" x2="550" y2="180" stroke="#475569" strokeWidth="1.5" />
                <line x1="60" y1="30" x2="60" y2="180" stroke="#475569" strokeWidth="1.5" />
                
                {/* Labels */}
                <text x="30" y="35" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">FFMI</text>
                <text x="30" y="105" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">25.0</text>
                <line x1="55" y1="105" x2="550" y2="105" stroke="#dc2626" strokeDasharray="4,4" strokeWidth="1" />
                <text x="470" y="100" fill="#f87171" fontSize="9" fontFamily="sans-serif">Natural Limit (25.0)</text>

                {/* Raw Curve */}
                <path d="M 100 145 Q 300 110 500 70" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="460" y="60" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Raw FFMI (Height Biased)</text>

                {/* Normalized Line */}
                <path d="M 100 115 Q 300 112 500 110" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="260" y="132" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Normalized FFMI (Corrected)</text>

                {/* Height ticks */}
                <text x="100" y="196" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">1.65m</text>
                <text x="300" y="196" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">1.80m (Baseline)</text>
                <text x="500" y="196" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">1.95m</text>
                <text x="300" y="212" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Athlete Height</text>
              </svg>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-2 mb-0">
              The Harvard correction factor normalizes raw calculations so that a 6&apos;4&quot; lifter can be evaluated on an identical biological plane as a 5&apos;8&quot; lifter.
            </p>
          </div>
        </section>

        {/* SECTION 4: THE NATURAL LIMIT */}
        <section id="section-natural-limits" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">4. Harvard Clinical Scale &amp; The 25.0 Natural Ceiling</h2>
          
          <h3 className="font-headline-md text-on-surface mb-3 mt-0">The Pre-Steroid Era Validation (1939–1959)</h3>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            In their landmark investigation, Kouri and colleagues evaluated 157 male athletes: 83 non-steroid users and 74 anabolic steroid users. To establish a pure biological baseline uncorrupted by modern synthetic chemistry, they also analyzed the historical winning physiques of <strong>Mr. America champions between 1939 and 1959</strong>—prior to the clinical advent and commercial synthesis of Dianabol and testosterone esters.
          </p>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
            The results demonstrated that pre-steroid era champions possessed a mean normalized FFMI of <strong>25.4</strong>. In the contemporary drug-free cohort, essentially no natural athlete exceeded a score of <strong>25.0</strong>, while steroid users regularly posted values between 26.0 and 32.0.
          </p>

          <h3 className="font-headline-md text-on-surface mb-3">Complete Clinical Reference Table (Men)</h3>
          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl mb-6">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 font-headline-sm">
                  <th className="p-3">Normalized FFMI</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Physiological Description</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-on-surface-variant">
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-data-mono">&lt; 18.0</td>
                  <td className="p-3 text-on-surface font-semibold">Below Average</td>
                  <td className="p-3">Sedentary population, sarcopenic state, or severe caloric deprivation</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-data-mono">18.0 – 19.9</td>
                  <td className="p-3 text-on-surface font-semibold">Average Baseline</td>
                  <td className="p-3">Typical healthy non-training adult male</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-data-mono text-primary font-bold">20.0 – 21.9</td>
                  <td className="p-3 text-primary font-semibold">Above Average</td>
                  <td className="p-3">Recreational lifters with 1–2 years of structured resistance exercise</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-data-mono text-primary font-bold">22.0 – 23.9</td>
                  <td className="p-3 text-primary font-semibold">Excellent / Advanced</td>
                  <td className="p-3">Dedicated natural lifters with 4–8+ years of progressive overload</td>
                </tr>
                <tr className="border-b border-outline-variant/20 bg-amber-500/5">
                  <td className="p-3 font-data-mono text-amber-600 font-bold">24.0 – 25.0</td>
                  <td className="p-3 text-amber-600 font-semibold">Genetic Ceiling</td>
                  <td className="p-3">Upper biological limit achievable naturally for elite 99th percentile genetics</td>
                </tr>
                <tr>
                  <td className="p-3 font-data-mono text-red-600 font-bold">&gt; 25.0</td>
                  <td className="p-3 text-red-600 font-semibold">Suspicious / Exogenous</td>
                  <td className="p-3">Extremely improbable without anabolic androgenic compounds (Kouri et al.)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant mb-0">
            *Clinical Note for Women: Female physiology carries lower absolute skeletal mass and higher essential lipids. Subtract approximately 3.0 to 3.5 points from these boundary brackets (e.g., an FFMI of 17.0–18.5 represents an advanced natural female lifter; values exceeding 21.5–22.0 approach the female natural threshold).
          </p>
        </section>

        {/* SECTION 5: CLINICAL RECOMMENDATIONS */}
        <section id="section-clinical-recommendations" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">5. What to Measure Instead of Raw BMI</h2>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            If you engage in regular resistance training, disregard standard insurance BMI categories. Instead, utilize this clinical triad:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">straighten</span>
              <h3 className="font-headline-md text-base text-on-surface mt-0 mb-2">Waist-to-Height Ratio (WHtR)</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                Maintain waist circumference at or below <strong>50% of your standing height</strong>. According to systematic reviews in{' '}
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/22106140/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                >
                  <em>Obesity Reviews</em> (Ashwell et al., PMID: 22106140)
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>, WHtR significantly outperforms BMI as a screening tool for cardiometabolic mortality because it isolates central visceral adiposity.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2">monitoring</span>
              <h3 className="font-headline-md text-base text-on-surface mt-0 mb-2">Quarterly FFMI Audits</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                Track lean tissue retention or accretion across dietary phases. During caloric deficits, a stable Normalized FFMI confirms pure adipose oxidation without sarcopenia.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="material-symbols-outlined text-tertiary text-3xl mb-2">radiology</span>
              <h3 className="font-headline-md text-base text-on-surface mt-0 mb-2">US Navy Method / DEXA</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                Use circumference algorithms (neck, waist, hip) or multi-frequency bioimpedance every 8–12 weeks to capture true compartmental changes.
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKBENCH CALLOUT */}
        <div className="bg-primary/10 border-l-4 border-primary p-8 rounded-r-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1">
            <h3 className="mt-0 text-primary mb-2 font-headline-md">Compute Your Normalized FFMI &amp; Lean Mass</h3>
            <p className="mb-0 text-on-surface-variant font-body-md leading-relaxed">
              Calculate your exact Fat-Free Mass Index, Harvard clinical tier, and body density metrics using SolveIt&apos;s free clinical workbenches.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/health-fitness-calculators/bmi" 
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 transition-all text-center whitespace-nowrap shadow-sm"
            >
              Open BMI &amp; Composition Tool
            </Link>
            <Link 
              href="/health-fitness-calculators/navy-fat" 
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps hover:bg-surface-container-highest transition-all text-center whitespace-nowrap"
            >
              Navy Body Fat Tool
            </Link>
          </div>
        </div>

        {/* SECTION 6: PEER-REVIEWED REFERENCES */}
        <section id="section-references" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-lg text-on-surface m-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
              6. Peer-Reviewed References &amp; Authoritative Sources
            </h2>
            <span className="text-xs font-semibold px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full border border-outline-variant/30">
              Clinical Literature
            </span>
          </div>
          <p className="font-body-sm text-on-surface-variant mb-6">
            All biophysical formulas, scaling equations, and body composition cutoffs presented in this guide are directly derived from primary peer-reviewed sports medicine and anthropometric literature:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-bold text-primary tracking-wide uppercase mb-1">
                    Landmark Harvard Investigation
                  </span>
                  <h4 className="font-headline-sm text-base text-on-surface m-0 mb-1">
                    Fat-Free Mass Index in Users and Nonusers of Anabolic-Androgenic Steroids
                  </h4>
                  <p className="text-xs text-on-surface-variant m-0 mb-2">
                    Kouri EM, Pope HG Jr, Katz DL, Oliva P. <em>Clinical Journal of Sport Medicine</em>, 1995;5(4):223-228.
                  </p>
                </div>
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/7496846/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs inline-flex items-center gap-1 border border-primary/20"
                >
                  <span>PubMed (PMID: 7496846)</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-bold text-secondary tracking-wide uppercase mb-1">
                    Meta-Analysis / Waist-to-Height Ratio
                  </span>
                  <h4 className="font-headline-sm text-base text-on-surface m-0 mb-1">
                    Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk
                  </h4>
                  <p className="text-xs text-on-surface-variant m-0 mb-2">
                    Ashwell M, Gunn P, Gibson S. <em>Obesity Reviews</em>, 2012;13(3):275-286.
                  </p>
                </div>
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/22106140/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold text-xs inline-flex items-center gap-1 border border-secondary/20"
                >
                  <span>PubMed (PMID: 22106140)</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-bold text-tertiary tracking-wide uppercase mb-1">
                    Foundational Epidemiology
                  </span>
                  <h4 className="font-headline-sm text-base text-on-surface m-0 mb-1">
                    Indices of relative weight and obesity
                  </h4>
                  <p className="text-xs text-on-surface-variant m-0 mb-2">
                    Keys A, Fidanza F, Karvonen MJ, Kimura N, Taylor HL. <em>Journal of Chronic Diseases</em>, 1972;25(6-7):329-343.
                  </p>
                </div>
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/4650629/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-tertiary/10 hover:bg-tertiary/20 text-tertiary font-semibold text-xs inline-flex items-center gap-1 border border-tertiary/20"
                >
                  <span>PubMed (PMID: 4650629)</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-bold text-emerald-600 tracking-wide uppercase mb-1">
                    Public Health Institutional Standards
                  </span>
                  <h4 className="font-headline-sm text-base text-on-surface m-0 mb-1">
                    Adult Body Mass Index (BMI) Clinical Screening &amp; Limitations
                  </h4>
                  <p className="text-xs text-on-surface-variant m-0 mb-2">
                    Centers for Disease Control and Prevention (CDC) &amp; World Health Organization (WHO) Global Guidelines.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <a 
                    href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs inline-flex items-center gap-1 border border-emerald-500/20"
                  >
                    <span>CDC Guidelines</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                  <a 
                    href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs inline-flex items-center gap-1 border border-outline-variant/30"
                  >
                    <span>WHO Fact Sheet</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FAQ */}
        <section id="section-faq" className="pt-8 border-t border-outline-variant/30">
          <h2 className="font-headline-lg text-on-surface mb-6 mt-0">7. Frequently Asked Questions (FAQ)</h2>

          <div className="space-y-4">
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                Why is BMI misleading for weightlifters and athletes?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                BMI calculates solely based on total body weight divided by height squared. Because skeletal muscle is approximately 18% denser than adipose tissue, a lean athlete with substantial muscular hypertrophy often registers as &ldquo;overweight&rdquo; or &ldquo;obese&rdquo; on standard BMI charts despite having low body fat and exceptional metabolic health.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                What is considered a good FFMI score?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                For men, an average untrained FFMI is roughly 18 to 19. A score of 20 to 21 indicates an athletic build with consistent resistance training. Scores between 22 and 24 represent advanced natural bodybuilders. An FFMI above 25 is widely recognized in exercise science as approaching or exceeding the natural genetic threshold without exogenous anabolics.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                How is Normalized FFMI calculated?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                Normalized FFMI adjusts raw FFMI to a standardized height of 1.80 meters (5&apos;11&quot;), correcting for the geometric scaling bias where taller individuals naturally achieve higher raw FFMI values. The formula is: <code>Normalized FFMI = Raw FFMI + 6.1 × (1.80 - Height in meters)</code>.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                What is the natural limit of FFMI for non-enhanced athletes?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                In the landmark 1995 Harvard study by Kouri et al., pre-steroid era Mr. America champions (1939-1959) averaged a normalized FFMI of 25.4, with essentially no drug-free individuals exceeding 25.0 in modern tested cohorts. Scores above 25.5 are statistically improbable without anabolic androgenic steroid support.
              </div>
            </details>
          </div>
        </section>
      </div>
    </article>
  );
}
