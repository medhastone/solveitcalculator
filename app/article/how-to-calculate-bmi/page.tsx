import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How To Calculate BMI: Formula, Categories & Limitations | SolveIt Calculator',
  description: 'Learn the exact mathematical formula for Body Mass Index (BMI), its clinical categories as defined by the WHO, and why the Quetelet index has limitations.',
  keywords: ['calculate BMI', 'BMI formula', 'Body Mass Index math', 'Quetelet index', 'health calculator guide', 'BMI categories WHO', 'how to calculate bmi manually'],
  alternates: {
    canonical: 'https://solveitcalculator.com/article/how-to-calculate-bmi',
  }
};

export default function ArticleBMI() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "How To Calculate BMI: Formula, Categories & Limitations",
        "author": {
          "@type": "Organization",
          "name": "SolveIt Medical & Scientific Editorial Board",
          "url": "https://solveitcalculator.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "SolveIt Calculator",
          "logo": {
            "@type": "ImageObject",
            "url": "https://solveitcalculator.com/logo.png"
          }
        },
        "datePublished": "2024-01-15",
        "dateModified": "2024-10-25",
        "description": "Learn the exact mathematical formula for Body Mass Index (BMI), its clinical categories as defined by the WHO, and why the Quetelet index has limitations."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is BMI an accurate measure of health?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "BMI is a useful screening tool for populations, but it is not a diagnostic tool for individuals. It does not distinguish between fat and muscle mass, meaning highly muscular individuals may be incorrectly classified as overweight or obese."
            }
          },
          {
            "@type": "Question",
            "name": "What is a healthy BMI for a woman?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For both adult men and women, the World Health Organization (WHO) defines a healthy or normal BMI range as 18.5 to 24.9. However, women naturally carry slightly more body fat than men, which BMI does not account for."
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
        <span className="text-on-surface font-medium truncate">How To Calculate BMI</span>
      </nav>

      {/* Article Header & Editorial Review Badge */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
            Clinical Epidemiology &amp; Biometrics
          </span>
          <span className="text-on-surface-variant text-xs font-body-sm">
            8 Min Read • Updated October 2024
          </span>
        </div>
        
        <h1 className="font-headline-lg md:font-display-hero text-on-surface font-bold tracking-tight mb-4">
          How To Calculate BMI: Mathematical Formulas, WHO Standards &amp; Clinical Limitations
        </h1>
        
        <p className="font-body-lg text-on-surface-variant leading-relaxed mb-6">
          A definitive mathematical analysis of the 1830s Quetelet index, the metric and imperial formulas, World Health Organization classifications, ethnic variations, and why lean mass creates false positives.
        </p>

        {/* Medically Reviewed & Fact-Checked Banner */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <div>
              <div className="font-semibold text-on-surface">Medically Reviewed &amp; Fact-Checked</div>
              <div className="text-on-surface-variant text-xs">
                SolveIt Medical &amp; Scientific Review Board (Endocrinology &amp; Biostatistics)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Peer-Reviewed Literature Cited</span>
          </div>
        </div>
      </header>

      {/* Visual Infographic SVG */}
      <div className="mb-10 rounded-2xl bg-surface-container-low p-4 sm:p-6 border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
          Diagnostic Spectrum: WHO Adult Body Mass Index Thresholds
        </div>
        <svg viewBox="0 0 760 210" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="760" height="210" rx="12" fill="#0f172a" />
          
          {/* Header Formula Banner */}
          <rect x="25" y="16" width="710" height="42" rx="8" fill="#1e293b" />
          <text x="45" y="42" fill="#94a3b8" fontSize="13" fontFamily="monospace">
            Formula: BMI = weight (kg) / [height (m)]²  |  Imperial: [weight (lb) × 703] / [height (in)]²
          </text>
          
          {/* Spectrum Bars */}
          {/* Underweight */}
          <rect x="25" y="75" width="130" height="60" rx="6" fill="#3b82f6" fillOpacity="0.85" />
          <text x="35" y="100" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Underweight</text>
          <text x="35" y="122" fill="#bfdbfe" fontSize="12" fontFamily="monospace">&lt; 18.5</text>
          
          {/* Normal */}
          <rect x="160" y="75" width="180" height="60" rx="6" fill="#10b981" fillOpacity="0.85" />
          <text x="172" y="100" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Normal Weight</text>
          <text x="172" y="122" fill="#a7f3d0" fontSize="12" fontFamily="monospace">18.5 – 24.9</text>
          
          {/* Overweight */}
          <rect x="345" y="75" width="150" height="60" rx="6" fill="#f59e0b" fillOpacity="0.85" />
          <text x="357" y="100" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Overweight</text>
          <text x="357" y="122" fill="#fde68a" fontSize="12" fontFamily="monospace">25.0 – 29.9</text>
          
          {/* Obese Class I */}
          <rect x="500" y="75" width="115" height="60" rx="6" fill="#f97316" fillOpacity="0.85" />
          <text x="508" y="100" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Obese Class I</text>
          <text x="508" y="122" fill="#fed7aa" fontSize="12" fontFamily="monospace">30.0 – 34.9</text>
          
          {/* Obese Class II & III */}
          <rect x="620" y="75" width="115" height="60" rx="6" fill="#ef4444" fillOpacity="0.85" />
          <text x="628" y="100" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Severe/Morbid</text>
          <text x="628" y="122" fill="#fecaca" fontSize="12" fontFamily="monospace">≥ 35.0</text>
          
          {/* Footnote */}
          <text x="25" y="165" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
            * Asian Population Action Point: Overweight threshold lowered to ≥ 23.0 kg/m² per WHO Expert Consultation (Lancet 2004).
          </text>
          <text x="25" y="185" fill="#64748b" fontSize="11" fontFamily="sans-serif">
            * Does not differentiate between fat mass and skeletal muscle hypertrophy (Keys et al., J Chronic Dis 1972).
          </text>
        </svg>
      </div>

      <div className="space-y-8">
        
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">What is Body Mass Index (BMI)?</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            Body Mass Index (BMI) is a heuristic mathematical formula developed in the 1830s by Belgian statistician, sociologist, and astronomer <strong>Adolphe Quetelet</strong>. Originally termed the <em>Quetelet Index</em>, it was designed to measure the "average man" to assist the government in allocating resources. It was never intended by its creator to be a diagnostic tool for individual clinical health.
          </p>
          <p className="font-body-md text-on-surface-variant mb-0">
            Despite its origins, in 1972, physiologist <a href="https://pubmed.ncbi.nlm.nih.gov/4650629/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">Ancel Keys et al. published a landmark comparative study in the <em>Journal of Chronic Diseases</em></a> evaluating body density against relative weight, establishing BMI as an accessible indicator of relative body fatness. Today, it remains the primary diagnostic screening tool designated by the <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">World Health Organization (WHO)</a>, the <a href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">U.S. Centers for Disease Control and Prevention (CDC)</a>, and the National Institutes of Health (NIH).
          </p>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">The Mathematical Formula (How to Calculate)</h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            The mathematics behind BMI are deliberately simple. It establishes a ratio between a person's mass (weight) and their height squared. Because it relies on a two-dimensional square (height × height) to measure a three-dimensional body, it scales predictably.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md mt-0 mb-4 text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">straighten</span>
                Metric System
              </h3>
              <p className="font-body-sm text-on-surface-variant mb-4">Used globally and in clinical research.</p>
              <code className="block bg-surface-container-lowest p-4 rounded-lg text-body-lg text-on-surface font-data-mono mb-4 border border-outline-variant/20 shadow-sm">
                BMI = weight (kg) / [height (m)]²
              </code>
              <div className="mt-4 text-sm font-body-sm text-on-surface-variant bg-primary/5 p-4 rounded-lg">
                <strong className="text-on-surface">Example:</strong> A person weighing 70 kg and measuring 1.75 meters tall.<br/><br/>
                1. Square the height: 1.75 × 1.75 = 3.0625<br/>
                2. Divide weight by height²: 70 / 3.0625 = <strong className="text-on-surface">22.86</strong>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md mt-0 mb-4 text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined">square_foot</span>
                Imperial System
              </h3>
              <p className="font-body-sm text-on-surface-variant mb-4">Used primarily in the United States.</p>
              <code className="block bg-surface-container-lowest p-4 rounded-lg text-body-lg text-on-surface font-data-mono mb-4 border border-outline-variant/20 shadow-sm">
                BMI = 703 × (weight (lbs) / [height (in)]²)
              </code>
              <div className="mt-4 text-sm font-body-sm text-on-surface-variant bg-secondary/5 p-4 rounded-lg">
                <strong className="text-on-surface">Example:</strong> A person weighing 150 lbs and measuring 5'5" (65 inches) tall.<br/><br/>
                1. Square the height: 65 × 65 = 4225<br/>
                2. Divide weight by height²: 150 / 4225 = 0.0355...<br/>
                3. Multiply by 703: 0.0355... × 703 = <strong className="text-on-surface">24.96</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">Standard WHO BMI Categories</h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            Once you have computed your BMI value, it is mapped against established thresholds to categorize weight status. The World Health Organization established the following universal guidelines for adults (aged 20 and over):
          </p>
          
          <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[600px] m-0">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Category</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">BMI Range (kg/m²)</th>
                  <th className="p-4 font-headline-sm text-on-surface font-bold">Health Risk Level</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md text-on-surface-variant">
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">Severe Thinness</td>
                  <td className="p-4">&lt; 16.0</td>
                  <td className="p-4">High (Nutritional deficiency)</td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-blue-500 dark:text-blue-300">Underweight</td>
                  <td className="p-4">16.0 – 18.4</td>
                  <td className="p-4">Moderate to High</td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-green-600 dark:text-green-500">Normal (Healthy Weight)</td>
                  <td className="p-4">18.5 – 24.9</td>
                  <td className="p-4">Low / Baseline</td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-yellow-600 dark:text-yellow-500">Overweight</td>
                  <td className="p-4">25.0 – 29.9</td>
                  <td className="p-4">Increased</td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-orange-500 dark:text-orange-400">Obese (Class I)</td>
                  <td className="p-4">30.0 – 34.9</td>
                  <td className="p-4">High</td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-red-500 dark:text-red-400">Obese (Class II)</td>
                  <td className="p-4">35.0 – 39.9</td>
                  <td className="p-4">Very High</td>
                </tr>
                <tr className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-semibold text-red-700 dark:text-red-600">Obese (Class III)</td>
                  <td className="p-4">&ge; 40.0</td>
                  <td className="p-4">Extremely High</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">BMI for Children and Teens (Ages 2 to 19)</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            While the mathematical formula for calculating BMI is exactly the same for children and teens as it is for adults, the <em>interpretation</em> of that number is completely different.
          </p>
          <p className="font-body-md text-on-surface-variant mb-4">
            Because children are constantly growing and their body fat percentages change drastically as they mature—and because boys and girls develop at different rates—BMI for youth is plotted on a <strong>percentile chart</strong> relative to other children of the same age and sex.
          </p>
          <ul className="list-disc pl-5 font-body-md text-on-surface-variant space-y-2">
            <li><strong className="text-on-surface">Underweight:</strong> Less than the 5th percentile</li>
            <li><strong className="text-on-surface">Healthy Weight:</strong> 5th percentile to less than the 85th percentile</li>
            <li><strong className="text-on-surface">Overweight:</strong> 85th to less than the 95th percentile</li>
            <li><strong className="text-on-surface">Obesity:</strong> 95th percentile or greater</li>
          </ul>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-6 mt-0">The Severe Limitations of BMI</h2>
          <p className="font-body-md text-on-surface-variant mb-8">
            While computationally efficient and useful for tracking population-level trends, BMI has significant clinical blind spots. Because it uses a strict two-dimensional measurement (height squared) to estimate a three-dimensional body, it often fails at the individual level.
          </p>
          
          <div className="space-y-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-on-surface mt-0 mb-2">1. Muscle Density vs. Fat (The Athlete's Paradox)</h3>
              <p className="font-body-md text-on-surface-variant mb-0">
                Muscle tissue is approximately 18% denser than fat tissue. A highly trained athlete, such as an NFL linebacker or an Olympic sprinter, may weigh significantly more than a sedentary person of the exact same height. BMI does not distinguish between a kilogram of muscle and a kilogram of fat. Consequently, many elite athletes are medically classified as "Obese" according to BMI, despite possessing single-digit body fat percentages.
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-on-surface mt-0 mb-2">2. Age and Bone Mass Atrophy</h3>
              <p className="font-body-md text-on-surface-variant mb-0">
                As we age, we naturally lose both muscle mass (sarcopenia) and bone density. A 75-year-old may have the exact same BMI as a 25-year-old, but their body composition is entirely different. The elderly individual may have a high proportion of dangerous visceral fat, yet remain hidden in the "Normal Weight" BMI category.
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <h3 className="font-headline-md text-on-surface mt-0 mb-2">3. Ethnic and Genetic Variances</h3>
              <p className="font-body-md text-on-surface-variant mb-0">
                The original Quetelet index was based exclusively on Caucasian populations in 19th-century Europe. Modern endocrinology research documented in <a href="https://pubmed.ncbi.nlm.nih.gov/14726171/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium"><em>The Lancet</em> (WHO Expert Consultation, 2004)</a> demonstrates that Asian and South Asian populations experience high cardiovascular and Type 2 diabetes risk at significantly lower BMI thresholds. Consequently, many international health guidelines recognize an overweight threshold of <strong className="text-on-surface">23.0 kg/m²</strong> for Asian descent.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">Better Alternatives to BMI</h2>
          <p className="font-body-md text-on-surface-variant mb-4">
            Because of these limitations, modern clinicians prefer composite metrics to assess metabolic health:
          </p>
          <ul className="list-disc pl-5 font-body-md text-on-surface-variant space-y-3">
            <li><strong className="text-on-surface">Waist-to-Height Ratio (WHtR):</strong> A superior predictor of cardiovascular risk and visceral adipose accumulation compared to BMI (<a href="https://pubmed.ncbi.nlm.nih.gov/22432658/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">Ashwell et al., <em>Obesity Reviews</em></a>). Keeping your waist circumference under 50% of your height significantly diminishes metabolic syndrome risk.</li>
            <li><strong className="text-on-surface">Fat-Free Mass Index (FFMI):</strong> Normalized lean mass index derived from dual-energy X-ray absorptiometry or skinfold calipers that separates muscular hypertrophy from excess adiposity.</li>
            <li><strong className="text-on-surface">Waist-to-Hip Ratio (WHR):</strong> Quantifies android vs. gynoid adipose distribution (<a href="https://www.who.int/publications/i/item/9789241501491" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 font-medium">WHO Technical Report on Waist Circumference</a>).</li>
            <li><strong className="text-on-surface">DEXA Scans:</strong> Dual-energy X-ray absorptiometry is the gold standard for measuring exact bone density, lean muscle, and visceral fat percentages.</li>
          </ul>
        </section>

        {/* References Section */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-lg text-on-surface mb-4 mt-0">Peer-Reviewed References &amp; Clinical Guidelines</h2>
          <ol className="list-decimal pl-5 font-body-sm text-on-surface-variant space-y-3">
            <li>
              World Health Organization. (2024). <em>Obesity and Overweight: Fact Sheet and Global Health Observatory Guidelines</em>.{' '}
              <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
              </a>
            </li>
            <li>
              Centers for Disease Control and Prevention. (2024). <em>About Adult BMI: Clinical Criteria &amp; Health Consequences</em>.{' '}
              <a href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 break-all">
                https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html
              </a>
            </li>
            <li>
              Keys, A., Fidanza, F., Karvonen, M. J., Kimura, N., &amp; Taylor, H. L. (1972). Indices of relative weight and obesity.{' '}
              <em>Journal of Chronic Diseases</em>, 25(6-7), 329–343.{' '}
              <a href="https://pubmed.ncbi.nlm.nih.gov/4650629/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                PubMed PMID: 4650629
              </a>
            </li>
            <li>
              WHO Expert Consultation. (2004). Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies.{' '}
              <em>The Lancet</em>, 363(9403), 157–163.{' '}
              <a href="https://pubmed.ncbi.nlm.nih.gov/14726171/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                PubMed PMID: 14726171
              </a>
            </li>
            <li>
              Ashwell, M., Gunn, P., &amp; Gibson, S. (2012). Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk factors: systematic review and meta-analysis.{' '}
              <em>Obesity Reviews</em>, 13(3), 275–286.{' '}
              <a href="https://pubmed.ncbi.nlm.nih.gov/22432658/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                PubMed PMID: 22432658
              </a>
            </li>
          </ol>
        </section>

        <div className="bg-primary/10 border-l-4 border-primary p-8 my-10 rounded-r-xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="mt-0 text-primary mb-2">Stop Doing the Math by Hand</h3>
            <p className="mb-0 text-on-surface-variant font-body-sm">
              Use our interactive clinical-grade calculator. It instantly computes your exact BMI to two decimal places, places you on the WHO visual spectrum, and calculates your ideal weight range based on your height.
            </p>
          </div>
          <div>
            <Link 
              href="/health-fitness-calculators/bmi" 
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 hover:shadow-md transition-all whitespace-nowrap"
            >
              Open BMI Calculator
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-10 border-t border-outline-variant/30">
          <h2 className="mt-0 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                Is BMI an accurate measure of health?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                BMI is a useful, rapid screening tool for large populations, but it is not a perfect diagnostic tool for individuals. Because it cannot distinguish between fat and muscle mass, highly muscular individuals may be incorrectly classified as overweight or obese. It should always be used alongside other metrics like waist circumference or blood pressure.
              </div>
            </details>
            
            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                What is a healthy BMI for a woman?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                For both adult men and women, the World Health Organization (WHO) defines a healthy or normal BMI range as 18.5 to 24.9. The mathematical formula does not change based on gender. However, women naturally carry slightly more essential body fat than men for reproductive health, which BMI does not explicitly account for.
              </div>
            </details>

            <details className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-headline-sm text-body-lg text-on-surface cursor-pointer select-none">
                Does age affect my BMI?
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                No, the adult BMI calculation remains exactly the same whether you are 25 or 75. However, older adults tend to lose muscle mass and gain fat. Therefore, a senior citizen with a "Healthy" BMI of 23 might actually have an unhealthy body fat percentage. Some clinical studies suggest a slightly higher BMI (25-27) may actually be protective against mortality in the elderly.
              </div>
            </details>
          </div>
        </div>

      </div>
    </article>
  );
}
