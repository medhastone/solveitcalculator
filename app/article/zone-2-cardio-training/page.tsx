import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zone 2 Cardio Training: Mitochondrial Density & Fat Oxidation Rates | SolveIt Calculator',
  description: 'The clinical guide to Zone 2 endurance training: cellular mitochondrial biogenesis, the lactate kinetics curve, FatMax, and exact heart rate reserve calculations.',
  keywords: [
    'zone 2 cardio training',
    'mitochondrial density exercise',
    'fat oxidation rate zone 2',
    'how to calculate zone 2 heart rate',
    'zone 2 heart rate formula',
    'lactate threshold zone 2',
    'aerobic base training',
    'FatMax exercise science',
    'karvonen formula zone 2',
    'inigo san millan zone 2'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/article/zone-2-cardio-training',
  },
  openGraph: {
    title: 'Zone 2 Cardio Training: Mitochondrial Density & Fat Oxidation Rates',
    description: 'Why exercising at 1.5–2.0 mmol/L blood lactate triggers maximal lipid clearance, upregulates cellular mitochondrial biogenesis, and extends healthspan.',
    url: 'https://solveitcalculator.com/article/zone-2-cardio-training',
    siteName: 'SolveIt Calculator',
    type: 'article',
    publishedTime: '2024-11-20T08:00:00.000Z',
    modifiedTime: '2025-01-15T08:00:00.000Z',
    images: [
      {
        url: 'https://solveitcalculator.com/og-zone-2-cardio.png',
        width: 1200,
        height: 630,
        alt: 'Zone 2 Metabolic Substrate & Lactate Curve'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zone 2 Cardio Training: Mitochondrial Density & Fat Oxidation Rates',
    description: 'Comprehensive exercise physiology guide to Zone 2 heart rate zones, FatMax kinetics, and mitochondrial biogenesis.',
    images: ['https://solveitcalculator.com/og-zone-2-cardio.png'],
  }
};

export default function Zone2CardioTrainingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://solveitcalculator.com/article/zone-2-cardio-training#article",
        "isPartOf": {
          "@type": "WebPage",
          "@id": "https://solveitcalculator.com/article/zone-2-cardio-training"
        },
        "headline": "Zone 2 Cardio Training: Mitochondrial Density & Fat Oxidation Rates",
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
            "url": "https://solveitcalculator.com/logo.png"
          }
        },
        "datePublished": "2024-11-20T08:00:00Z",
        "dateModified": "2025-01-15T08:00:00Z",
        "description": "An in-depth physiological guide to Zone 2 cardio, mitochondrial biogenesis, lactate clearance kinetics, and maximizing whole-body fat oxidation rates.",
        "mainEntityOfPage": "https://solveitcalculator.com/article/zone-2-cardio-training"
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
            "name": "Zone 2 Cardio Training",
            "item": "https://solveitcalculator.com/article/zone-2-cardio-training"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What exactly is Zone 2 cardio training?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zone 2 is low-to-moderate intensity aerobic exercise performed at an intensity where blood lactate concentrations remain strictly between 1.5 and 2.0 mmol/L. At this exact metabolic threshold, type I slow-twitch muscle fibers rely almost exclusively on beta-oxidation (fat burning) without overwhelming mitochondrial clearance capacity."
            }
          },
          {
            "@type": "Question",
            "name": "How do I calculate my Zone 2 target heart rate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The most practical mathematical approach without a blood lactate meter is the Karvonen Heart Rate Reserve (HRR) formula: Zone 2 Target = Resting HR + [(Max HR - Resting HR) × 0.60 to 0.70]. A validated subjective metric is the 'Talk Test': you should be able to speak complete sentences continuously without gasping, but unable to sing comfortably."
            }
          },
          {
            "@type": "Question",
            "name": "How many hours per week of Zone 2 is recommended for longevity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Clinical exercise physiologists recommend a minimum baseline of 150 to 180 minutes per week of Zone 2 training, divided across 3 to 4 sessions lasting 45 to 60 minutes each. This volume is required to stimulate significant mitochondrial biogenesis and improve insulin sensitivity."
            }
          },
          {
            "@type": "Question",
            "name": "Can Zone 2 training replace High-Intensity Interval Training (HIIT)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. In polarized endurance programming (such as Dr. Stephen Seiler's 80/20 model), approximately 80% of total aerobic volume is conducted in Zone 2 to build mitochondrial foundation, while 20% is performed at high intensity (Zone 4/5) to stimulate cardiac stroke volume and maximal VO2 uptake."
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
        <span className="text-on-surface font-medium truncate">Zone 2 Cardio Guide</span>
      </nav>

      {/* Hero Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-caps text-label-caps font-bold">
            EXERCISE PHYSIOLOGY &amp; CARDIOMETABOLIC HEALTH
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Published: Nov 20, 2024 • Updated: Jan 15, 2025 • 10 Min Read
          </span>
        </div>
        <h1 className="font-display-hero text-display-md text-on-surface mb-4 leading-tight">
          Zone 2 Cardio Training: Mitochondrial Density &amp; Fat Oxidation Rates
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
          Why exercising at 1.5–2.0 mmol/L blood lactate triggers maximal lipid clearance, upregulates cellular mitochondrial biogenesis, and lays the physiological bedrock for longevity.
        </p>

        {/* Clinical & Scientific Editorial Verification Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <p className="font-body-md font-bold text-on-surface m-0">Medically Reviewed &amp; Fact-Checked</p>
              <p className="font-body-sm text-xs text-on-surface-variant m-0">Scientific Editorial Board • Bioenergetics &amp; Exercise Endocrinology</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Peer-Reviewed Literature Cited</span>
          </div>
        </div>
      </header>

      {/* HERO SVG THUMBNAIL & INFOGRAPHIC */}
      <figure className="mb-10 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm bg-surface-container-lowest">
        <div className="w-full bg-surface-container-high p-4 md:p-6 flex items-center justify-center">
          <svg 
            viewBox="0 0 800 420" 
            className="w-full h-auto max-h-[440px] select-none" 
            role="img" 
            aria-label="Zone 2 Metabolic Substrate Crossover and Lactate Kinetics Chart"
          >
            <defs>
              <linearGradient id="z2Highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="bgDark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Background Canvas */}
            <rect width="800" height="420" rx="16" fill="url(#bgDark)" />

            {/* Title inside SVG */}
            <text x="400" y="36" textAnchor="middle" fill="#f8fafc" fontSize="19" fontWeight="bold" fontFamily="system-ui, sans-serif">
              SUBSTRATE CROSSOVER &amp; LACTATE KINETICS ACROSS TRAINING ZONES
            </text>
            <text x="400" y="58" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="system-ui, sans-serif">
              FatMax Peak in Zone 2 (1.5 - 2.0 mmol/L Lactate) vs Glycolytic Dominance in Zones 3-5
            </text>

            {/* Graph Grid Lines */}
            <line x1="80" y1="90" x2="740" y2="90" stroke="#334155" strokeDasharray="3,3" />
            <line x1="80" y1="160" x2="740" y2="160" stroke="#334155" strokeDasharray="3,3" />
            <line x1="80" y1="230" x2="740" y2="230" stroke="#334155" strokeDasharray="3,3" />
            <line x1="80" y1="300" x2="740" y2="300" stroke="#334155" strokeDasharray="3,3" />
            
            {/* Zone Highlight Column for Zone 2 */}
            <rect x="210" y="80" width="140" height="260" fill="url(#z2Highlight)" rx="4" />
            <rect x="210" y="76" width="140" height="4" fill="#14b8a6" />

            {/* Axes */}
            <line x1="80" y1="340" x2="740" y2="340" stroke="#64748b" strokeWidth="2" />
            <line x1="80" y1="80" x2="80" y2="340" stroke="#64748b" strokeWidth="2" />

            {/* Axis Y Left: Substrate % */}
            <text x="70" y="95" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="sans-serif">100%</text>
            <text x="70" y="165" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="sans-serif">75%</text>
            <text x="70" y="235" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="sans-serif">50%</text>
            <text x="70" y="305" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="sans-serif">25%</text>
            <text x="70" y="340" fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="sans-serif">0%</text>

            {/* Axis X: Zones */}
            <text x="145" y="360" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">ZONE 1</text>
            <text x="145" y="375" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">&lt;1.2 mmol/L</text>

            <text x="280" y="360" fill="#2dd4bf" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">ZONE 2 (FatMax)</text>
            <text x="280" y="375" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">1.5 - 2.0 mmol/L</text>

            <text x="420" y="360" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">ZONE 3 (Tempo)</text>
            <text x="420" y="375" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">2.0 - 3.0 mmol/L</text>

            <text x="560" y="360" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">ZONE 4 (Threshold)</text>
            <text x="560" y="375" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">3.0 - 4.0 mmol/L</text>

            <text x="680" y="360" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">ZONE 5 (VO2 Max)</text>
            <text x="680" y="375" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">&gt;4.0 mmol/L</text>

            {/* CURVE 1: Fat Oxidation Rate (Teal) */}
            {/* Starts moderate in Z1, peaks high in Z2 (FatMax), plummets in Z3-Z5 */}
            <path 
              d="M 90 190 Q 210 130 280 115 T 430 240 Q 560 310 720 330" 
              fill="none" 
              stroke="#2dd4bf" 
              strokeWidth="3.5" 
            />
            {/* FatMax Indicator Circle */}
            <circle cx="280" cy="115" r="6" fill="#14b8a6" stroke="#ffffff" strokeWidth="2" />
            <text x="280" y="102" fill="#2dd4bf" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              FatMax Peak (0.8–1.3 g/min)
            </text>

            {/* CURVE 2: Carbohydrate Oxidation Rate (Orange) */}
            {/* Low in Z1 and Z2, crosses over at Z3, dominates Z4 and Z5 */}
            <path 
              d="M 90 320 Q 210 310 280 280 T 430 220 Q 560 120 720 95" 
              fill="none" 
              stroke="#fb923c" 
              strokeWidth="3" 
            />

            {/* CURVE 3: Blood Lactate (Red dashed) */}
            <path 
              d="M 90 330 L 210 325 Q 350 310 450 280 Q 560 210 720 100" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="4,4" 
            />

            {/* Crossover point callout */}
            <circle cx="430" cy="225" r="5" fill="#fbbf24" />
            <text x="430" y="205" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Crossover Point (50/50)
            </text>

            {/* Legend at Bottom */}
            <rect x="120" y="392" width="560" height="24" rx="6" fill="#0f172a" />
            <circle cx="160" cy="404" r="5" fill="#2dd4bf" />
            <text x="172" y="408" fill="#e2e8f0" fontSize="11" fontFamily="sans-serif">Fat Oxidation</text>

            <circle cx="340" cy="404" r="5" fill="#fb923c" />
            <text x="352" y="408" fill="#e2e8f0" fontSize="11" fontFamily="sans-serif">Carbohydrate Oxidation</text>

            <line x1="515" y1="404" x2="535" y2="404" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
            <text x="542" y="408" fill="#f87171" fontSize="11" fontFamily="sans-serif">Blood Lactate (mmol/L)</text>
          </svg>
        </div>
        <figcaption className="p-4 bg-surface-container-lowest text-xs text-on-surface-variant text-center font-body-sm">
          <strong>Figure 2.0:</strong> Substrate turnover kinetics across exercise intensities. Notice that whole-body fat oxidation peaks directly within Zone 2 and collapses rapidly as blood lactate crosses the 2.0 mmol/L threshold.
        </figcaption>
      </figure>

      {/* TABLE OF CONTENTS */}
      <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 mb-10">
        <h2 className="font-headline-sm text-on-surface m-0 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">list_alt</span>
          Table of Contents
        </h2>
        <nav className="grid sm:grid-cols-2 gap-2 text-body-sm font-body-sm">
          <a href="#section-bioenergetics" className="text-secondary hover:underline flex items-center gap-1.5">
            <span>1. What is Zone 2? Bioenergetics of Aerobic Base</span>
          </a>
          <a href="#section-cellular-mechanisms" className="text-secondary hover:underline flex items-center gap-1.5">
            <span>2. Cellular Adaptations: PGC-1α &amp; MCT-1 Shuttles</span>
          </a>
          <a href="#section-fatmax-crossover" className="text-secondary hover:underline flex items-center gap-1.5">
            <span>3. FatMax vs. The Glycolytic Crossover</span>
          </a>
          <a href="#section-calculating-zones" className="text-secondary hover:underline flex items-center gap-1.5">
            <span>4. Calculating Your Target: Karvonen vs. Talk Test</span>
          </a>
          <a href="#section-programming" className="text-secondary hover:underline flex items-center gap-1.5">
            <span>5. Weekly Programming Protocol: The 80/20 Rule</span>
          </a>
          <a href="#section-references" className="text-secondary hover:underline flex items-center gap-1.5">
            <span>6. Peer-Reviewed References &amp; Clinical Sources</span>
          </a>
          <a href="#section-faq" className="text-secondary hover:underline flex items-center gap-1.5 sm:col-span-2">
            <span>7. Frequently Asked Questions (FAQ)</span>
          </a>
        </nav>
      </section>

      <div className="space-y-10">
        {/* SECTION 1: BIOENERGETICS */}
        <section id="section-bioenergetics" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">1. What is Zone 2? Bioenergetics of Aerobic Base</h2>
          
          <h3 className="font-headline-md text-secondary mb-3 mt-0">Defining the Lactate Steady-State Window</h3>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            In modern exercise physiology and cardiometabolic medicine, training outputs are stratified into 5 distinct metabolic zones. Among these, <strong>Zone 2</strong> occupies a uniquely restorative, high-capacity metabolic niche: it denotes the highest workload an athlete can sustain while relying near-maximally on lipid oxidation and aerobic mitochondrial phosphorylation.
          </p>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            Established in peer-reviewed investigations by Dr. Iñigo San Millán (University of Colorado School of Medicine) and Dr. George Brooks (UC Berkeley) published in{' '}
            <a 
              href="https://pubmed.ncbi.nlm.nih.gov/29299839/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-secondary hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              <em>Sports Medicine</em> (PubMed PMID: 29299839)
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>, Zone 2 is clinically demarcated by resting-to-steady-state blood lactate concentrations residing between <strong>1.5 and 2.0 mmol/L</strong>. At this exact metabolic output:
          </p>
          <ul className="space-y-2 font-body-md text-on-surface-variant mb-6 pl-5">
            <li>Type I (slow-twitch) muscle fibers clear and combust lactate as fast as it is produced by baseline glycolysis via the intracellular lactate shuttle described in{' '}
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/30206121/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-secondary hover:underline font-medium inline-flex items-center gap-0.5"
              >
                <em>Cell Metabolism</em> (Brooks GA, PMID: 30206121)
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>.
            </li>
            <li>Free fatty acids supply 60% to 85% of ATP synthesis through beta-oxidation.</li>
            <li>Sympathetic nervous system stimulation and systemic autonomic fatigue remain remarkably low, permitting high cumulative training volume.</li>
          </ul>
        </section>

        {/* SECTION 2: CELLULAR MECHANISMS */}
        <section id="section-cellular-mechanisms" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">2. Cellular Adaptations: PGC-1α &amp; MCT-1 Shuttles</h2>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
            Mitochondria are the intracellular engines generating adenosine triphosphate (ATP) via the electron transport chain. When you train in Zone 2 for 45 to 90 minutes, your myocytes experience steady mechanical and metabolic tension that triggers three profound molecular cascades:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2">grain</span>
              <h3 className="font-headline-md text-base text-on-surface mt-0 mb-2">PGC-1α Biogenesis</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                Steady calcium fluxes activate <strong>Peroxisome proliferator-activated receptor-gamma coactivator 1-alpha</strong>, instructing muscle nuclei to generate new mitochondria and expand matrix density.
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">local_fire_department</span>
              <h3 className="font-headline-md text-base text-on-surface mt-0 mb-2">MCT-1 Lactate Clearance</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                Upregulates <strong>Monocarboxylate Transporter-1 (MCT-1)</strong> channels on sarcolemmal membranes, allowing working muscle cells to pull circulating lactate into mitochondria for instant clean oxidation.
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-tertiary text-3xl mb-2">water_drop</span>
              <h3 className="font-headline-md text-base text-on-surface mt-0 mb-2">CPT-1 Fatty Acid Influx</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                Enhances <strong>Carnitine Palmitoyltransferase-1</strong> enzyme activity, eliminating the bottleneck that limits how rapidly long-chain acyl-CoA fats can enter the mitochondrial interior.
              </p>
            </div>
          </div>

          {/* INLINE EXPLANATORY SVG DIAGRAM */}
          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
            <h4 className="font-headline-sm text-on-surface mt-0 mb-3">Figure 2.1: The Cellular Lactate Shuttle in Type I Muscle Fibers</h4>
            <div className="w-full overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 240" className="w-full h-auto max-h-[240px]" role="img" aria-label="Type I Fiber Bioenergetics Diagram">
                <rect width="600" height="240" rx="8" fill="#0f172a" />
                
                {/* Cell Membrane */}
                <rect x="30" y="30" width="540" height="180" rx="14" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="50" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">TYPE I SLOW-TWITCH MYOCYTE</text>

                {/* MCT-1 Transporter Channel */}
                <rect x="18" y="90" width="24" height="60" rx="4" fill="#14b8a6" />
                <text x="30" y="125" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" transform="rotate(-90 30 125)" fontFamily="sans-serif">MCT-1</text>
                
                {/* Lactate Flow */}
                <text x="5" y="80" fill="#f87171" fontSize="10" fontFamily="sans-serif">Lactate</text>
                <path d="M 10 95 L 45 95" fill="none" stroke="#f87171" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* Mitochondrion Inside */}
                <rect x="260" y="55" width="280" height="130" rx="20" fill="#0f766e" fillOpacity="0.3" stroke="#14b8a6" strokeWidth="1.5" />
                <text x="400" y="80" fill="#2dd4bf" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">MITOCHONDRIAL MATRIX</text>
                
                {/* Inside Bioenergetics */}
                <text x="300" y="115" fill="#cbd5e1" fontSize="11" fontFamily="monospace">Beta-Oxidation (CPT-1 Fatty Acids)</text>
                <text x="300" y="135" fill="#cbd5e1" fontSize="11" fontFamily="monospace">Lactate -&gt; Pyruvate (mLDH)</text>
                <text x="300" y="160" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">High ATP Yield + Zero Acidosis</text>

                {/* PGC-1a Stimulus */}
                <circle cx="140" cy="140" r="30" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="140" y="138" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PGC-1α</text>
                <text x="140" y="152" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Coactivator</text>

                <path d="M 175 140 L 255 140" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                <text x="215" y="132" fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Biogenesis</text>
              </svg>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-2 mb-0">
              Zone 2 maintains the exact intracellular milieu where the Monocarboxylate Transporter-1 (MCT-1) moves circulating lactate directly into mitochondria for complete oxidation, preserving glycogen reserves.
            </p>
          </div>
        </section>

        {/* SECTION 3: FATMAX & CROSSOVER */}
        <section id="section-fatmax-crossover" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">3. FatMax vs. The Glycolytic Crossover</h2>
          
          <h3 className="font-headline-md text-on-surface mb-3 mt-0">The Substrate Competition Principle</h3>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            During physical exertion, your skeletal muscles utilize an ongoing combination of fatty acids and carbohydrates (glycogen/glucose). As intensity ramps upward, mechanical recruitment recruits fast-twitch Type IIa and IIx muscle fibers. Because fast-twitch fibers contain few mitochondria and rely on rapid non-oxidative glycolysis, lactate begins to spill into the bloodstream.
          </p>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
            Crucially, elevated circulating lactate <strong>directly inhibits CPT-1 enzyme activity</strong>, functionally shutting down fatty acid transport into mitochondria. Once blood lactate breaches 2.0 to 2.5 mmol/L, fat burning plummets by 50% to 80% within minutes.
          </p>

          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl mb-4">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 font-headline-sm">
                  <th className="p-3">Intensity Tier</th>
                  <th className="p-3">Blood Lactate</th>
                  <th className="p-3">Primary Fuel Substrate</th>
                  <th className="p-3">Mitochondrial Stimulus</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-on-surface-variant">
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Zone 1 (Active Recovery)</td>
                  <td className="p-3">&lt; 1.2 mmol/L</td>
                  <td className="p-3">Fats (85%+)</td>
                  <td className="p-3">Minimal signaling threshold</td>
                </tr>
                <tr className="border-b border-outline-variant/20 bg-secondary/5">
                  <td className="p-3 font-bold text-secondary">Zone 2 (Endurance Base)</td>
                  <td className="p-3 font-bold text-secondary">1.5 – 2.0 mmol/L</td>
                  <td className="p-3 font-bold text-secondary">FatMax (Peak Lipid Turnover)</td>
                  <td className="p-3 font-bold text-secondary">Peak PGC-1α &amp; mitochondrial expansion</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Zone 3 (Tempo / &ldquo;No Man&apos;s Land&rdquo;)</td>
                  <td className="p-3">2.0 – 3.0 mmol/L</td>
                  <td className="p-3">50% Fat / 50% Carbohydrate</td>
                  <td className="p-3">Moderate fatigue accumulation without elite adaptation</td>
                </tr>
                <tr className="border-b border-outline-variant/20">
                  <td className="p-3 font-semibold text-on-surface">Zone 4 (Lactate Threshold)</td>
                  <td className="p-3">3.5 – 4.5 mmol/L</td>
                  <td className="p-3">Carbohydrate (80%+)</td>
                  <td className="p-3">Acidosis tolerance and buffering capacity</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-on-surface">Zone 5 (VO2 Max / Anaerobic)</td>
                  <td className="p-3">&gt; 5.0 mmol/L</td>
                  <td className="p-3">100% Glycogen</td>
                  <td className="p-3">Cardiac stroke volume &amp; pulmonary maximal flux</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: CALCULATING ZONES */}
        <section id="section-calculating-zones" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">4. Calculating Your Target: Karvonen vs. Talk Test</h2>
          <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
            Without access to a metabolic cart or finger-stick lactate analyzer, athletes can determine their Zone 2 boundary with exceptional clinical fidelity using protocols validated in exercise physiology literature:
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-primary mt-0 mb-2">Method 1: Karvonen Heart Rate Reserve (HRR) Formula</h3>
              <p className="font-body-sm text-on-surface-variant mb-3">
                First formulated by Dr. Martti Karvonen in landmark cardiological studies indexed on{' '}
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/13444008/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-secondary hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  PubMed (PMID: 13444008)
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>, the Karvonen formula incorporates your <strong>Resting Heart Rate (RHR)</strong> to calibrate training intensity to baseline autonomic tone:
              </p>
              <div className="bg-surface-container-lowest p-3 rounded font-data-mono text-sm text-on-surface border border-outline-variant/20 mb-3">
                Target HR = Resting HR + [(Max HR - Resting HR) × 0.60 to 0.70]
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant m-0 leading-relaxed">
                <strong>Worked Example:</strong> A 42-year-old athlete with a Max HR of 178 bpm and a morning Resting HR of 58 bpm:
                <br />
                • Heart Rate Reserve (HRR) = 178 - 58 = 120 bpm
                <br />
                • Zone 2 Floor (60%): 58 + (120 × 0.60) = <strong>130 bpm</strong>
                <br />
                • Zone 2 Ceiling (70%): 58 + (120 × 0.70) = <strong>142 bpm</strong>
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-secondary mt-0 mb-2">Method 2: The Ventilatory &ldquo;Talk Test&rdquo;</h3>
              <p className="font-body-sm text-on-surface-variant mb-2">
                The Talk Test tracks the first ventilatory threshold (VT1). In Zone 2, your breathing rate increases, but you remain strictly below the point of hypercapnic respiratory compensation.
              </p>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 font-body-sm text-on-surface">
                <strong>The Clinical Diagnostic Criterion:</strong> You can carry out a continuous conversational dialogue across multiple full sentences without pausing to catch your breath, but you can no longer comfortably sing a full song.
              </div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-tertiary mt-0 mb-2">Method 3: Nasal Breathing Exclusivity</h3>
              <p className="font-body-sm text-on-surface-variant m-0 leading-relaxed">
                If performing cycling or running workouts, breathing strictly in and out through the nose serves as a mechanical governor. If you feel an instinctive urge to open your mouth to draw oxygen, you have breached VT1 and slipped into Zone 3 glycolytic stress.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: WEEKLY PROGRAMMING PROTOCOL */}
        <section id="section-programming" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">5. Weekly Programming Protocol: The 80/20 Polarized Rule</h2>
          
          <h3 className="font-headline-md text-on-surface mb-3 mt-0">Volume Recommendations for Longevity vs. Competition</h3>
          <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
            Mitochondrial biogenesis is volumetric. It responds to accumulated time under low-level steady metabolic tension rather than peak acute agony. Clinical guidelines established by the{' '}
            <a 
              href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-secondary hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              American Heart Association (AHA)
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>{' '}
            and the{' '}
            <a 
              href="https://www.cdc.gov/physical-activity-basics/guidelines/adults.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-secondary hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              CDC Physical Activity Guidelines
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>{' '}
            indicate:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h4 className="font-headline-sm text-secondary mt-0 mb-2">General Health &amp; Metabolic Longevity</h4>
              <ul className="font-body-sm text-on-surface-variant space-y-1.5 pl-4 m-0">
                <li><strong>Total Weekly Volume:</strong> 150 to 180 minutes of moderate aerobic training</li>
                <li><strong>Session Cadence:</strong> 3 to 4 sessions of 45 to 60 minutes</li>
                <li><strong>Modality:</strong> Incline treadmill walking, stationary bike, or rowing</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h4 className="font-headline-sm text-primary mt-0 mb-2">Endurance &amp; Competitive Performance</h4>
              <ul className="font-body-sm text-on-surface-variant space-y-1.5 pl-4 m-0">
                <li><strong>Total Weekly Volume:</strong> 300 to 480+ minutes</li>
                <li><strong>Session Cadence:</strong> 4 to 6 sessions, including one 90–120 min long workout</li>
                <li><strong>Distribution:</strong> 80% Zone 2 / 20% Zone 4/5 based on Dr. Stephen Seiler&apos;s model in{' '}
                  <a 
                    href="https://pubmed.ncbi.nlm.nih.gov/20861519/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-secondary hover:underline font-semibold inline-flex items-center gap-0.5"
                  >
                    <em>IJSPP</em> (PubMed PMID: 20861519)
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
            <h4 className="font-headline-sm text-on-surface mt-0 mb-2">The &ldquo;Zone 3 Black Hole&rdquo; Warning</h4>
            <p className="font-body-md text-on-surface-variant m-0 leading-relaxed">
              The single most common error in amateur endurance training is working too hard on easy days (slipping into Zone 3 &ldquo;tempo&rdquo;), which creates persistent autonomic fatigue and suppresses mitochondrial biogenesis while simultaneously reducing performance capacity on high-intensity interval days.
            </p>
          </div>
        </section>

        {/* SECTION 6: PEER-REVIEWED REFERENCES */}
        <section id="section-references" className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">library_books</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-on-surface m-0">6. Peer-Reviewed References &amp; Authoritative Sources</h2>
              <p className="font-body-sm text-on-surface-variant m-0">Primary physiological literature, clinical consensus guidelines, and indexed metabolic citations.</p>
            </div>
          </div>

          <div className="space-y-4 text-body-sm font-body-sm">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-secondary/15 text-secondary">
                  Landmark Lactate &amp; FatMax Study
                </span>
                <p className="text-on-surface font-semibold m-0">
                  San-Millán, I., &amp; Brooks, G. A. (2018). Assessment of Metabolic Flexibility by Means of Measuring Blood Lactate, Fat, and Carbohydrate Oxidation in High-Level Athletes, Active Subjects, and Individuals with Metabolic Syndrome. <em>Sports Medicine</em>, 48(2), 467–479.
                </p>
              </div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/29299839/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary hover:text-on-secondary transition-colors font-medium text-xs"
              >
                <span>View on PubMed (PMID: 29299839)</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-secondary/15 text-secondary">
                  Cellular Lactate Shuttle
                </span>
                <p className="text-on-surface font-semibold m-0">
                  Brooks, G. A. (2018). The Science and Translation of Lactate Shuttle Theory. <em>Cell Metabolism</em>, 27(4), 757–785.
                </p>
              </div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/30206121/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary hover:text-on-secondary transition-colors font-medium text-xs"
              >
                <span>View on PubMed (PMID: 30206121)</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-primary/15 text-primary">
                  80/20 Polarized Training Model
                </span>
                <p className="text-on-surface font-semibold m-0">
                  Seiler, S. (2010). What is best practice for training characteristics and phase-reversal of polarized training in endurance athletes? <em>International Journal of Sports Physiology and Performance</em>, 5(3), 276–291.
                </p>
              </div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/20861519/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors font-medium text-xs"
              >
                <span>View on PubMed (PMID: 20861519)</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-tertiary/15 text-tertiary">
                  FatMax Exercise Kinetics
                </span>
                <p className="text-on-surface font-semibold m-0">
                  Jeukendrup, A. E., &amp; Achten, J. (2001). Fatmax: a new concept to optimize fat oxidation during exercise? <em>European Journal of Sport Science / Int J Sports Med</em>, 22(5), 332–338.
                </p>
              </div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/11712111/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-tertiary hover:bg-tertiary hover:text-on-tertiary transition-colors font-medium text-xs"
              >
                <span>View on PubMed (PMID: 11712111)</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-outline/20 text-on-surface">
                  Karvonen Heart Rate Reserve Formula
                </span>
                <p className="text-on-surface font-semibold m-0">
                  Karvonen, M. J., Kentala, E., &amp; Mustala, O. (1957). The effects of training on heart rate; a longitudinal study. <em>Annales Medicinae Experimentalis et Biologiae Fenniae</em>, 35(3), 307–315.
                </p>
              </div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/13444008/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-on-surface hover:text-surface transition-colors font-medium text-xs"
              >
                <span>View on PubMed (PMID: 13444008)</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-primary/15 text-primary">
                  Clinical Guidelines
                </span>
                <p className="text-on-surface font-semibold m-0">
                  American Heart Association &amp; Centers for Disease Control and Prevention. Physical Activity Guidelines for Aerobic Health and Cardiometabolic Disease Prevention.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a 
                  href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors font-medium text-xs"
                >
                  <span>AHA Guidelines</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
                <a 
                  href="https://www.cdc.gov/physical-activity-basics/guidelines/adults.html" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors font-medium text-xs"
                >
                  <span>CDC Guidelines</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKBENCH CALLOUT */}
        <div className="bg-secondary/10 border-l-4 border-secondary p-8 rounded-r-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1">
            <h3 className="mt-0 text-secondary mb-2 font-headline-md">Calculate Your Exact Zone 2 Heart Rate Targets</h3>
            <p className="mb-0 text-on-surface-variant font-body-md leading-relaxed">
              Use SolveIt&apos;s Target Heart Rate Calculator to compute your personal Karvonen Heart Rate Reserve intervals, Zone 1–5 thresholds, and VO2 Max targets in seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/health-fitness-calculators/heart-rate" 
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-secondary text-on-secondary font-label-caps text-label-caps hover:bg-secondary/90 transition-all text-center whitespace-nowrap shadow-sm"
            >
              Target Heart Rate Calculator
            </Link>
            <Link 
              href="/health-fitness-calculators/bmr" 
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps hover:bg-surface-container-highest transition-all text-center whitespace-nowrap"
            >
              BMR &amp; Calorie Burn
            </Link>
          </div>
        </div>

        {/* SECTION 7: FAQ */}
        <section id="section-faq" className="pt-8 border-t border-outline-variant/30">
          <h2 className="font-headline-lg text-on-surface mb-6 mt-0">7. Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                What exactly is Zone 2 cardio training?
                <span className="material-symbols-outlined text-secondary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                Zone 2 is low-to-moderate intensity aerobic exercise performed at an intensity where blood lactate concentrations remain strictly between 1.5 and 2.0 mmol/L. At this exact metabolic threshold, type I slow-twitch muscle fibers rely almost exclusively on beta-oxidation (fat burning) without overwhelming mitochondrial clearance capacity.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                How do I calculate my Zone 2 target heart rate?
                <span className="material-symbols-outlined text-secondary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                The most practical mathematical approach without a blood lactate meter is the Karvonen Heart Rate Reserve (HRR) formula: <code>Zone 2 Target = Resting HR + [(Max HR - Resting HR) × 0.60 to 0.70]</code>. A validated subjective metric is the &ldquo;Talk Test&rdquo;: you should be able to speak complete sentences continuously without gasping, but unable to sing comfortably.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                How many hours per week of Zone 2 is recommended for longevity?
                <span className="material-symbols-outlined text-secondary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                Clinical exercise physiologists recommend a minimum baseline of 150 to 180 minutes per week of Zone 2 training, divided across 3 to 4 sessions lasting 45 to 60 minutes each. This volume is required to stimulate significant mitochondrial biogenesis and improve insulin sensitivity.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                Can Zone 2 training replace High-Intensity Interval Training (HIIT)?
                <span className="material-symbols-outlined text-secondary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-on-surface-variant leading-relaxed">
                No. In polarized endurance programming (such as Dr. Stephen Seiler&apos;s 80/20 model), approximately 80% of total aerobic volume is conducted in Zone 2 to build mitochondrial foundation, while 20% is performed at high intensity (Zone 4/5) to stimulate cardiac stroke volume and maximal VO2 uptake.
              </div>
            </details>
          </div>
        </section>
      </div>
    </article>
  );
}
