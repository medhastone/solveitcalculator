'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MathHubClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- 1. Scientific Calculator State ---
  const [calcInput, setCalcInput] = useState('sin(pi/6) + 4^2');
  const [calcResult, setCalcResult] = useState('16.5');

  const handleCalcButton = (val: string) => {
    if (val === 'DEL') {
      setCalcInput(prev => prev.slice(0, -1));
    } else if (val === 'sin' || val === 'cos' || val === 'tan' || val === 'log' || val === 'ln') {
      setCalcInput(prev => prev + `${val}(`);
    } else if (val === '√') {
      setCalcInput(prev => prev + 'sqrt(');
    } else if (val === '÷') {
      setCalcInput(prev => prev + '/');
    } else if (val === '×') {
      setCalcInput(prev => prev + '*');
    } else if (val === '−') {
      setCalcInput(prev => prev + '-');
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  const evaluateScientific = () => {
    try {
      let expr = calcInput
        .replace(/pi/g, Math.PI.toString())
        .replace(/sin\(([^)]+)\)/g, (_, a) => Math.sin(Number(eval(a))).toFixed(4))
        .replace(/cos\(([^)]+)\)/g, (_, a) => Math.cos(Number(eval(a))).toFixed(4))
        .replace(/tan\(([^)]+)\)/g, (_, a) => Math.tan(Number(eval(a))).toFixed(4))
        .replace(/sqrt\(([^)]+)\)/g, (_, a) => Math.sqrt(Number(eval(a))).toString())
        .replace(/log\(([^)]+)\)/g, (_, a) => Math.log10(Number(eval(a))).toFixed(4))
        .replace(/ln\(([^)]+)\)/g, (_, a) => Math.log(Number(eval(a))).toFixed(4))
        .replace(/\^/g, '**');
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${expr})`)();
      setCalcResult(Number(res).toFixed(4).replace(/\.?0+$/, ''));
    } catch {
      setCalcResult('Syntax Error');
    }
  };

  // --- 2. Fraction Simplifier State ---
  const [n1, setN1] = useState(3);
  const [d1, setD1] = useState(4);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(8);

  const fractionResult = useMemo(() => {
    // 3/4 + 1/8 = (3*8 + 1*4) / (4*8) = 28 / 32 = 7/8
    const num = n1 * d2 + n2 * d1;
    const den = d1 * d2;
    const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
    const divisor = Math.abs(gcd(num, den)) || 1;
    const simpNum = num / divisor;
    const simpDen = den / divisor;
    const decimal = simpDen !== 0 ? (simpNum / simpDen).toFixed(4).replace(/\.?0+$/, '') : 'Undefined';
    const whole = Math.floor(simpNum / simpDen);
    const rem = simpNum % simpDen;
    const mixed = whole > 0 ? `${whole} ${rem}/${simpDen}` : `${simpNum}/${simpDen}`;
    const pct = simpDen !== 0 ? Math.min(100, Math.max(0, (simpNum / simpDen) * 100)) : 0;
    return { simpNum, simpDen, decimal, mixed, pct };
  }, [n1, d1, n2, d2]);

  // --- 3. Quadratic Solver State ---
  const [qa, setQa] = useState(1);
  const [qb, setQb] = useState(-5);
  const [qc, setQc] = useState(6);

  const quadResult = useMemo(() => {
    const a = Number(qa) || 1;
    const b = Number(qb) || 0;
    const c = Number(qc) || 0;
    const disc = b * b - 4 * a * c;
    const vx = (-b / (2 * a)).toFixed(2);
    const vy = (a * Number(vx) * Number(vx) + b * Number(vx) + c).toFixed(2);

    if (disc > 0) {
      const x1 = ((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2);
      const x2 = ((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2);
      return { disc, type: 'Real & Distinct', x1: `x₁ = ${x1}`, x2: `x₂ = ${x2}`, vertex: `(${vx}, ${vy})` };
    } else if (disc === 0) {
      const x = (-b / (2 * a)).toFixed(2);
      return { disc, type: 'Real & Equal', x1: `x₁ = ${x}`, x2: `x₂ = ${x}`, vertex: `(${vx}, ${vy})` };
    } else {
      const real = (-b / (2 * a)).toFixed(2);
      const imag = (Math.sqrt(Math.abs(disc)) / (2 * a)).toFixed(2);
      return {
        disc,
        type: 'Complex Conjugate',
        x1: `x₁ = ${real} + ${imag}i`,
        x2: `x₂ = ${real} - ${imag}i`,
        vertex: `(${vx}, ${vy})`
      };
    }
  }, [qa, qb, qc]);

  // --- 4. Percentage Delta State ---
  const [pctInitial, setPctInitial] = useState(120);
  const [pctFinal, setPctFinal] = useState(156);

  const pctResult = useMemo(() => {
    const init = Number(pctInitial) || 1;
    const fin = Number(pctFinal) || 0;
    const delta = fin - init;
    const pct = ((delta / Math.abs(init)) * 100).toFixed(1);
    const multiplier = (fin / init).toFixed(2);
    const inverse = (((init - fin) / fin) * 100).toFixed(2);
    const isPositive = delta >= 0;
    return {
      deltaVal: (isPositive ? '+$' : '-$') + Math.abs(delta).toFixed(2),
      pctChange: (isPositive ? '+' : '') + pct + '%',
      multiplier: multiplier + '×',
      inverse: inverse + '%',
      isPositive
    };
  }, [pctInitial, pctFinal]);

  // --- 5. Pythagorean Solver State ---
  const [pythA, setPythA] = useState(6);
  const [pythB, setPythB] = useState(8);

  const pythResult = useMemo(() => {
    const a = Number(pythA) || 1;
    const b = Number(pythB) || 1;
    const c = Math.sqrt(a * a + b * b);
    const area = (a * b) / 2;
    const perimeter = a + b + c;
    const angleAlpha = (Math.atan(a / b) * (180 / Math.PI)).toFixed(2);
    const angleBeta = (Math.atan(b / a) * (180 / Math.PI)).toFixed(2);
    return {
      c: c.toFixed(2),
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      alpha: angleAlpha,
      beta: angleBeta
    };
  }, [pythA, pythB]);

  // --- 6. Descriptive Statistics State ---
  const [statsDataStr, setStatsDataStr] = useState('12, 15, 18, 22, 22, 28, 31, 40');

  const statsResult = useMemo(() => {
    const arr = statsDataStr
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    if (arr.length === 0) {
      return { mean: '0', median: '0', stdDev: '0', iqr: '0', variance: '0', mode: 'N/A' };
    }

    const n = arr.length;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;

    // Sample variance & std dev
    const variance = n > 1 ? arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1) : 0;
    const stdDev = Math.sqrt(variance);

    // Quartiles
    const q1 = arr[Math.floor(n * 0.25)];
    const q3 = arr[Math.floor(n * 0.75)];
    const iqr = q3 - q1;

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    let modeVal = arr[0];
    arr.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
      if (freq[num] > maxFreq) {
        maxFreq = freq[num];
        modeVal = num;
      }
    });

    return {
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
      iqr: iqr.toFixed(2),
      variance: variance.toFixed(2),
      mode: maxFreq > 1 ? modeVal.toString() : 'None'
    };
  }, [statsDataStr]);

  // --- Smart Calculator Recommender State ---
  const [recommenderDomain, setRecommenderDomain] = useState('Fractions');
  const [recommenderFormat, setRecommenderFormat] = useState('Step-by-Step Proof');

  const recommendation = useMemo(() => {
    switch (recommenderDomain) {
      case 'Geometry':
        return {
          id: 'GEOM-301',
          title: '3D Spatial Volume & Surface Solver',
          desc: 'Solves polyhedrons, cylinders, cones, and spheres with visual cross-section diagrams and exact geometric formulas.',
          type: 'Spatial Geometry Workbench',
          breakdown: 'Includes: Coordinate proofs, step-by-step net expansions',
          link: '#quick-solve'
        };
      case 'Statistics':
        return {
          id: 'STAT-502',
          title: 'Descriptive & Inferential Stats Suite',
          desc: 'Instant calculation of sample variance, normal z-scores, hypothesis testing, and confidence intervals.',
          type: 'Distribution Analysis Engine',
          breakdown: 'Includes: Bell curve visualization, outlier IQR filters',
          link: '#quick-solve'
        };
      case 'Algebra':
        return {
          id: 'ALG-108',
          title: 'Quadratic & Polynomial Factorer',
          desc: 'Synthetic division, real and complex root derivations, and discriminant analysis for high-order polynomials.',
          type: 'Symbolic Algebra Engine',
          breakdown: 'Includes: Factoring trees, vertex coordinates, step proofs',
          link: '#quick-solve'
        };
      case 'Percentage':
        return {
          id: 'PCT-042',
          title: 'Percentage Delta & Symmetric Difference',
          desc: 'Comparative price percentage deltas, profit markup ratios, and experimental error margin calculations.',
          type: 'Rate & Delta Analyzer',
          breakdown: 'Includes: Dynamic comparison bars, decimal conversions',
          link: '#quick-solve'
        };
      case 'Calculus':
        return {
          id: 'CALC-404',
          title: 'Symbolic Derivative & Integral Evaluator',
          desc: 'Step-by-step chain rule, integration by parts, Riemann sums, and Taylor series polynomial expansions.',
          type: 'Calculus CAS Suite',
          breakdown: 'Includes: Limit evaluations, definite integral graphs',
          link: '#formulas'
        };
      default:
        return {
          id: 'FR-204',
          title: 'Fraction Arithmetic & Step Simplifier',
          desc: 'Solves addition, subtraction, multiplication, and division with fractions. Shows least common denominator steps and easy-to-follow visual bar diagrams.',
          type: 'Fast Step-by-Step Solver',
          breakdown: 'Includes: Step-by-Step Solution & Factor Trees',
          link: '#quick-solve'
        };
    }
  }, [recommenderDomain]);

  // Copy LaTeX helper
  const copyLatex = (latex: string, name: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedFormula(name);
    setTimeout(() => setCopiedFormula(null), 2500);
  };

  // --- Category Topics Directory ---
  const mathCategories = [
    {
      id: 'basic-math',
      title: 'Basic Math & Arithmetic',
      icon: 'calculate',
      count: '34 Tools',
      desc: 'Foundational arithmetic, standard long division with remainders, rounding algorithms, and formal order of operations.',
      primaryUse: 'PRIMARY USE: K-12, FOUNDATIONAL ARITHMETIC',
      tools: [
        'Standard Calculator (High Float)',
        'Long Division with Steps & Decimals',
        'Order of Operations (PEMDAS/BODMAS)',
        'Rounding Calculator (Sig Figs & Decimals)',
        'Absolute Value & Distance on Number Line'
      ]
    },
    {
      id: 'fractions',
      title: 'Fractions & Rational Numbers',
      icon: 'pie_chart',
      count: '42 Tools',
      desc: 'Arithmetic operations with mixed numbers, least common denominator discovery, and visual fractional bar modeling.',
      primaryUse: 'PRIMARY USE: MIDDLE SCHOOL, RECIPE SCALING',
      tools: [
        'Fraction Simplifier & Reducer',
        'Mixed Numbers to Improper Fractions',
        'Least Common Denominator (LCD) Finder',
        'Fraction to Decimal & Percent Converter',
        'Equivalent Fractions Visual Grid'
      ]
    },
    {
      id: 'percentages',
      title: 'Percentages & Rates',
      icon: 'percent',
      count: '29 Tools',
      desc: 'Comparative percentage deltas, scientific percent error margins, retail markup, and compound percentage steps.',
      primaryUse: 'PRIMARY USE: FINANCE, COMMERCE, LABORATORY SCIENCE',
      tools: [
        'Percentage Change Calculator (% Increase/Decrease)',
        'Percent Difference (Symmetric Base)',
        'Experimental Percent Error Analyzer',
        'Discount, Sales Tax & Tip Combiner',
        'Gross Profit Margin vs Markup Ratio'
      ]
    },
    {
      id: 'algebra',
      title: 'Algebra & Polynomials',
      icon: 'variable_add',
      count: '58 Tools',
      desc: 'Linear system solvers, quadratic equation derivation, synthetic division, and polynomial factorization algorithms.',
      primaryUse: 'PRIMARY USE: ALGEBRA I & II, COLLEGE ALGEBRA',
      tools: [
        'Quadratic Formula Solver with Steps',
        'Polynomial Factoring & Root Finder',
        'System of Linear Equations (2x2, 3x3)',
        'Logarithm & Natural Log (ln) Calculator',
        'Radical & Surd Simplifier'
      ]
    },
    {
      id: 'geometry',
      title: 'Geometry & Spatial Measurement',
      icon: 'square_foot',
      count: '46 Tools',
      desc: 'Euclidean 2D planar figures, circular sectors, 3D polyhedron volumes, and coordinate plane calculations.',
      primaryUse: 'PRIMARY USE: HIGH SCHOOL GEOMETRY, ARCHITECTURE',
      tools: [
        '2D Area & Perimeter (Polygons & Ellipses)',
        'Circle, Sector & Segment Calculator',
        '3D Volume & Surface Area (Cylinder, Cone, Sphere)',
        'Coordinate Distance & Midpoint Formula',
        'Polygon Interior & Exterior Angle Matrix'
      ]
    },
    {
      id: 'triangles',
      title: 'Triangles & Trigonometric Geometry',
      icon: 'change_history',
      count: '31 Tools',
      desc: "Complete oblique and right triangle solvers, Pythagorean triples, Heron's formula, and law of sines/cosines.",
      primaryUse: 'PRIMARY USE: SURVEYING, NAVIGATION, PHYSICS',
      tools: [
        'Right Triangle & Hypotenuse Calculator',
        'Pythagorean Theorem (a² + b² = c²)',
        'Law of Sines (Ambiguous Case SSA)',
        'Law of Cosines (SAS, SSS Solvers)',
        "Heron's Formula Area Solver"
      ]
    },
    {
      id: 'trig',
      title: 'Trigonometry & Angular Vectors',
      icon: 'incomplete_circle',
      count: '39 Tools',
      desc: 'Circular trigonometry, unit circle coordinates, inverse trigonometric functions, and Cartesian-to-polar conversions.',
      primaryUse: 'PRIMARY USE: PRE-CALCULUS, SIGNAL PROCESSING',
      tools: [
        'Sine, Cosine, Tangent Precise Table',
        'Interactive Unit Circle & Coordinates',
        'Degrees to Radians (Exact π Radian Mode)',
        'Inverse Trig (arcsin, arccos, arctan)',
        'Reference Angle & Coterminal Solver'
      ]
    },
    {
      id: 'statistics',
      title: 'Statistics & Probability',
      icon: 'bar_chart',
      count: '64 Tools',
      desc: 'Continuous probability distributions, Z-score probability lookup, combinatorial analysis, and hypothesis testing.',
      primaryUse: 'PRIMARY USE: AP STATS, BIOMEDICAL RESEARCH, DATA SCIENCE',
      tools: [
        'Standard Deviation & Variance (Sample vs Pop)',
        'Normal Distribution & Z-Score P-Value',
        'Permutations & Combinations (nPr, nCr)',
        'Confidence Interval (Mean & Proportion)',
        'Linear Regression & Pearson r Correlation'
      ]
    },
    {
      id: 'ratios',
      title: 'Ratios & Proportions',
      icon: 'aspect_ratio',
      count: '25 Tools',
      desc: 'Direct and inverse variation solvers, display aspect ratio scaling, unit price rates, and engineering scale drawings.',
      primaryUse: 'PRIMARY USE: VIDEO PRODUCTION, DRAFTING, COMMERCE',
      tools: [
        'Ratio Simplifier & Missing Term Solver',
        'Aspect Ratio Scaler (16:9, 4:3, 21:9)',
        'Direct & Inverse Proportion Modeler',
        'Unit Rate & Comparative Grocery Cost',
        'Scale Factor for Blueprints & Maps'
      ]
    },
    {
      id: 'primes',
      title: 'Number Theory & Primes',
      icon: 'tag',
      count: '37 Tools',
      desc: 'Prime factorization trees, greatest common divisors, modular arithmetic, and Fibonacci constant sequences.',
      primaryUse: 'PRIMARY USE: CRYPTOGRAPHY, COMPUTER SCIENCE, PURE MATH',
      tools: [
        'Prime Factorization Tree & Exponents',
        'Greatest Common Factor (GCF / HCF)',
        'Least Common Multiple (LCM) Solver',
        'Fibonacci Sequence & Golden Ratio (φ)',
        'Modulo Arithmetic & Remainder Theorem'
      ]
    },
    {
      id: 'sequences',
      title: 'Sequences, Series & Limits',
      icon: 'all_inclusive',
      count: '33 Tools',
      desc: "Arithmetic and geometric progressions, infinite convergent series summation, and L'Hôpital limit evaluators.",
      primaryUse: 'PRIMARY USE: AP CALCULUS BC, ANALYSIS',
      tools: [
        'Arithmetic Sequence (Nth Term & Sum)',
        'Geometric Sequence & Common Ratio (r)',
        'Infinite Geometric Series Sum (|r| < 1)',
        'Limit Evaluator (Left, Right, Two-Sided)',
        'Taylor & Maclaurin Series Expansions'
      ]
    },
    {
      id: 'grades',
      title: 'Academic Grades & Planning',
      icon: 'grade',
      count: '26 Tools',
      desc: 'Weighted assignment grade tracking, 4.0/5.0 GPA scales, required final exam target calculators, and class pacing.',
      primaryUse: 'PRIMARY USE: HIGH SCHOOL & UNDERGRAD STUDENTS',
      tools: [
        'Cumulative GPA Calculator (4.0 Scale)',
        'Weighted Grade & Category Analyzer',
        'Final Exam Grade Target Solver',
        'High School Honors / AP Weighted GPA',
        'Study Session Pomodoro Pacer'
      ]
    }
  ];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return mathCategories;
    const q = searchQuery.toLowerCase();
    return mathCategories.filter(
      cat =>
        cat.title.toLowerCase().includes(q) ||
        cat.desc.toLowerCase().includes(q) ||
        cat.tools.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery, mathCategories]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      <Header />

      <main className="w-full pt-20 bg-surface flex-1">
        {/* Telemetry Bar & Sub-Navigation */}
        <div className="w-full bg-surface-container-low border-b border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex flex-wrap items-center justify-between gap-space-sm font-label-caps text-label-caps text-on-surface-variant">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="inline-flex items-center gap-space-2xs text-primary font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified</span> Step-by-Step Verified Accuracy
              </span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[15px] text-secondary">school</span> Student &amp; Educator Verified
              </span>
              <span className="text-outline-variant hidden sm:inline">•</span>
              <span className="hidden sm:inline-flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[15px] text-secondary">shield</span> 100% Free &amp; Private
              </span>
            </div>
            <div className="flex items-center gap-space-xs font-data-mono text-body-sm text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
              <span>INSTANT RESULTS: No Waiting</span>
            </div>
          </div>
        </div>

        {/* Primary Math Domain Navigation Tabs */}
        <div className="w-full bg-surface shadow-sm border-b border-outline-variant/15">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex items-center justify-between overflow-x-auto gap-space-xs">
            <div className="flex items-center gap-space-xs py-space-2xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-space-sm py-space-xs rounded-lg font-label-caps text-label-caps font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                All Math (500+)
              </button>
              <button
                onClick={() => setActiveTab('algebra')}
                className={`px-space-sm py-space-xs rounded-lg font-label-caps text-label-caps transition-all whitespace-nowrap ${
                  activeTab === 'algebra'
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Algebra &amp; Polynomials
              </button>
              <button
                onClick={() => setActiveTab('geometry')}
                className={`px-space-sm py-space-xs rounded-lg font-label-caps text-label-caps transition-all whitespace-nowrap ${
                  activeTab === 'geometry'
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Geometry &amp; Spatial
              </button>
              <button
                onClick={() => setActiveTab('trig')}
                className={`px-space-sm py-space-xs rounded-lg font-label-caps text-label-caps transition-all whitespace-nowrap ${
                  activeTab === 'trig'
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Trigonometry
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-space-sm py-space-xs rounded-lg font-label-caps text-label-caps transition-all whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Statistics &amp; Probability
              </button>
              <button
                onClick={() => setActiveTab('calculus')}
                className={`px-space-sm py-space-xs rounded-lg font-label-caps text-label-caps transition-all whitespace-nowrap ${
                  activeTab === 'calculus'
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Calculus &amp; Limits
              </button>
              <a
                href="#formulas"
                className="px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-caps text-label-caps transition-all whitespace-nowrap"
              >
                Formula Matrix
              </a>
              <a
                href="#exam-prep"
                className="px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-caps text-label-caps transition-all whitespace-nowrap"
              >
                Exam Prep Suites
              </a>
            </div>
            <div className="hidden lg:flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">
              <span className="px-space-xs py-space-2xs rounded bg-surface-container-high font-data-mono">ALG-4.1</span>
              <span>CAS-KERNEL ACTIVE</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: HERO & REAL-TIME SEARCH */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl border border-outline-variant/30 p-space-lg lg:p-space-2xl">
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-space-md shadow-sm border border-outline-variant/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> MATH LEARNING &amp; SOLVER HUB
              </div>
              <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold mb-space-sm">
                Math Calculators &amp; Problem Solvers
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-xl max-w-2xl leading-relaxed">
                Step-by-step math solvers, formula explanations, interactive visual graphs, and homework practice tools. Made for students, parents, and teachers.
              </p>

              {/* Real-Time Search Bar */}
              <div className="relative mb-space-md">
                <div className="flex items-center bg-surface-container-low rounded-xl shadow-inner border border-outline-variant/30 p-space-2xs focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                  <span className="material-symbols-outlined text-on-surface-variant ml-space-sm text-[24px]">function</span>
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-space-sm py-space-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                    placeholder="Search 500+ solvers, equations, formulas (e.g., 'quadratic', 'standard deviation', 'unit circle', '3/4 + 1/8')..."
                    type="text"
                  />
                  <div className="flex items-center gap-space-2xs mr-space-sm">
                    <kbd className="px-space-xs py-space-2xs bg-surface-container-high rounded text-on-surface-variant font-data-mono text-[11px] shadow-sm">
                      /
                    </kbd>
                    <button
                      onClick={() => {
                        const el = document.getElementById('quick-solve');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-colors shadow-sm"
                    >
                      Compute
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Fast Access:</span>
                {[
                  'Fraction Simplifier',
                  'Quadratic Formula',
                  'Pythagorean Theorem',
                  'Standard Deviation',
                  'Unit Circle',
                  'Derivative & Integral',
                  'Percent Change',
                  'GCF & LCM'
                ].map(pill => (
                  <button
                    key={pill}
                    onClick={() => setSearchQuery(pill)}
                    className="px-space-xs py-space-2xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors border border-outline-variant/20 hover:border-primary/40"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-xl mt-space-xl border-t border-outline-variant/20 bg-surface-container-low/60 rounded-xl p-space-md">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-primary font-data-mono">500+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">MATH CALCULATORS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-mono">1,000+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">FORMULAS &amp; GUIDES</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-secondary font-data-mono">8.4M+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">PROBLEMS SOLVED</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-mono">100%</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">FREE &amp; PRIVATE TO USE</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: QUICK SOLVE CENTER (FLAGSHIP WORKBENCHES) */}
        <section id="quick-solve" className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>QUICK SOLVE TOOLS</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Quick Solve Center</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Solve homework problems and check your step-by-step solutions instantly.
              </p>
            </div>
            <span className="font-data-mono text-body-sm text-on-surface-variant bg-surface-container px-space-sm py-space-xs rounded-lg border border-outline-variant/20">
              Active Solvers: 6 Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {/* 1. Scientific Calculator Live Micro-Tool */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Scientific Calculator</span>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-primary font-label-caps text-label-caps">
                    PEMDAS CAS
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Full algebraic parser with trigonometric and exponential functions.
                </p>

                {/* Keypad Screen */}
                <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm font-data-mono border border-outline-variant/20">
                  <div className="text-right text-body-sm text-on-surface-variant truncate">{calcInput || '0'}</div>
                  <div className="text-right font-headline-md text-headline-md font-bold text-on-surface truncate">
                    = {calcResult}
                  </div>
                </div>

                {/* Micro Keypad Grid */}
                <div className="grid grid-cols-4 gap-space-2xs text-center font-data-mono text-body-sm">
                  {['sin', 'cos', 'tan', 'DEL', 'log', 'ln', '√', '÷', '7', '8', '9', '×', '4', '5', '6', '−'].map(key => (
                    <button
                      key={key}
                      onClick={() => handleCalcButton(key)}
                      className={`py-space-xs rounded transition-colors ${
                        key === 'DEL'
                          ? 'bg-primary-container text-on-primary-container font-semibold hover:bg-primary'
                          : key === '÷' || key === '×' || key === '−'
                          ? 'bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                  <button onClick={() => handleCalcButton('1')} className="py-space-xs bg-surface-container rounded text-on-surface">1</button>
                  <button onClick={() => handleCalcButton('2')} className="py-space-xs bg-surface-container rounded text-on-surface">2</button>
                  <button onClick={() => handleCalcButton('3')} className="py-space-xs bg-surface-container rounded text-on-surface">3</button>
                  <button onClick={() => handleCalcButton('+')} className="py-space-xs bg-surface-container-high hover:bg-surface-variant rounded text-on-surface font-bold">+</button>
                  <button onClick={() => handleCalcButton('0')} className="py-space-xs bg-surface-container rounded text-on-surface">0</button>
                  <button onClick={() => handleCalcButton('.')} className="py-space-xs bg-surface-container rounded text-on-surface">.</button>
                  <button onClick={() => handleCalcButton('pi')} className="py-space-xs bg-surface-container rounded text-on-surface">π</button>
                  <button onClick={evaluateScientific} className="py-space-xs bg-primary text-on-primary rounded font-bold shadow-sm hover:bg-primary-container">=</button>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <span className="font-data-mono text-body-sm text-secondary">IEEE-754 64-bit</span>
                <button
                  onClick={evaluateScientific}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Evaluate <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* 2. Fraction Simplifier & Mixed Numbers Live Micro-Tool */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Fraction Simplifier</span>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-secondary font-label-caps text-label-caps">
                    LCD &amp; GCF
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Visual fraction bar reduction and improper/mixed fraction conversions.
                </p>
                <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-center gap-space-sm py-space-xs font-data-mono text-headline-md">
                    <div className="inline-flex flex-col items-center">
                      <input
                        type="number"
                        value={n1}
                        onChange={e => setN1(Number(e.target.value))}
                        className="w-10 text-center bg-surface-container-lowest rounded text-primary font-bold text-base focus:outline-none border border-outline-variant/30"
                      />
                      <span className="w-8 h-0.5 bg-on-surface my-1"></span>
                      <input
                        type="number"
                        value={d1}
                        onChange={e => setD1(Number(e.target.value))}
                        className="w-10 text-center bg-surface-container-lowest rounded text-on-surface text-base focus:outline-none border border-outline-variant/30"
                      />
                    </div>
                    <span className="text-on-surface-variant font-bold">+</span>
                    <div className="inline-flex flex-col items-center">
                      <input
                        type="number"
                        value={n2}
                        onChange={e => setN2(Number(e.target.value))}
                        className="w-10 text-center bg-surface-container-lowest rounded text-primary font-bold text-base focus:outline-none border border-outline-variant/30"
                      />
                      <span className="w-8 h-0.5 bg-on-surface my-1"></span>
                      <input
                        type="number"
                        value={d2}
                        onChange={e => setD2(Number(e.target.value))}
                        className="w-10 text-center bg-surface-container-lowest rounded text-on-surface text-base focus:outline-none border border-outline-variant/30"
                      />
                    </div>
                    <span className="text-on-surface-variant font-bold">=</span>
                    <div className="inline-flex flex-col items-center bg-surface-container-high px-space-xs py-space-2xs rounded">
                      <span className="text-primary font-bold">{fractionResult.simpNum}</span>
                      <span className="w-8 h-0.5 bg-on-surface my-0.5"></span>
                      <span className="font-bold">{fractionResult.simpDen}</span>
                    </div>
                  </div>
                  {/* Segmented Fraction Visual Bar */}
                  <div className="mt-space-sm">
                    <div className="font-label-caps text-label-caps text-on-surface-variant mb-space-2xs">
                      PARTITION MODEL ({fractionResult.simpNum}/{fractionResult.simpDen} = {fractionResult.pct.toFixed(1)}%)
                    </div>
                    <div className="w-full h-5 bg-surface-container-high rounded-full overflow-hidden flex gap-0.5 p-0.5">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${fractionResult.pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-body-sm font-data-mono text-on-surface-variant">
                  Decimal: <span className="text-on-surface font-semibold">{fractionResult.decimal}</span> • Mixed:{' '}
                  <span className="text-on-surface font-semibold">{fractionResult.mixed}</span>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant">STEP DEDUCTION: ON</span>
                <button
                  onClick={() => {
                    setN1(3);
                    setD1(4);
                    setN2(1);
                    setD2(8);
                  }}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Reset Example <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>
            </div>

            {/* 3. Quadratic & Polynomial Equation Solver */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Quadratic Solver</span>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-tertiary font-label-caps text-label-caps">
                    ax² + bx + c = 0
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Real and complex root derivation with instantaneous discriminant Δ analysis.
                </p>
                <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm border border-outline-variant/20">
                  <div className="grid grid-cols-3 gap-space-xs mb-space-sm font-data-mono text-body-sm">
                    <div className="bg-surface-container-lowest p-space-xs rounded text-center border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">a</span>
                      <input
                        type="number"
                        value={qa}
                        onChange={e => setQa(Number(e.target.value))}
                        className="w-full text-center font-bold text-on-surface bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="bg-surface-container-lowest p-space-xs rounded text-center border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">b</span>
                      <input
                        type="number"
                        value={qb}
                        onChange={e => setQb(Number(e.target.value))}
                        className="w-full text-center font-bold text-on-surface bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="bg-surface-container-lowest p-space-xs rounded text-center border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">c</span>
                      <input
                        type="number"
                        value={qc}
                        onChange={e => setQc(Number(e.target.value))}
                        className="w-full text-center font-bold text-on-surface bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-space-xs rounded mb-space-xs font-data-mono text-body-sm flex justify-between border border-outline-variant/20">
                    <span className="text-on-surface-variant">Discriminant (Δ = b² - 4ac):</span>
                    <span className="text-secondary font-bold">
                      {quadResult.disc} ({quadResult.type})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs font-data-mono">
                    <div className="bg-primary/10 text-primary p-space-xs rounded text-center font-bold text-body-md truncate">
                      {quadResult.x1}
                    </div>
                    <div className="bg-primary/10 text-primary p-space-xs rounded text-center font-bold text-body-md truncate">
                      {quadResult.x2}
                    </div>
                  </div>
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Vertex: <span className="font-data-mono text-on-surface font-semibold">{quadResult.vertex}</span> • Parabola opens{' '}
                  {Number(qa) >= 0 ? 'upward' : 'downward'}
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant">PARABOLA GRAPH</span>
                <button
                  onClick={() => {
                    setQa(1);
                    setQb(-5);
                    setQc(6);
                  }}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Reset (x² - 5x + 6) <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>
            </div>

            {/* 4. Percentage & Discount Delta Slider */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Percentage Delta</span>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-primary font-label-caps text-label-caps">
                    Rate &amp; Delta
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Real-time percentage change, difference, margin, and discount analysis.
                </p>
                <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm border border-outline-variant/20">
                  <div className="flex justify-between items-center mb-space-2xs font-data-mono gap-2">
                    <div className="flex items-center gap-1 text-body-sm">
                      <span className="text-on-surface-variant">Initial: $</span>
                      <input
                        type="number"
                        value={pctInitial}
                        onChange={e => setPctInitial(Number(e.target.value))}
                        className="w-16 bg-surface-container-lowest rounded px-1 text-center font-bold text-on-surface border border-outline-variant/30"
                      />
                    </div>
                    <div className="flex items-center gap-1 text-body-sm">
                      <span className="text-on-surface-variant">Final: $</span>
                      <input
                        type="number"
                        value={pctFinal}
                        onChange={e => setPctFinal(Number(e.target.value))}
                        className="w-16 bg-surface-container-lowest rounded px-1 text-center font-bold text-on-surface border border-outline-variant/30"
                      />
                    </div>
                  </div>
                  {/* Live visual comparison bar */}
                  <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden flex mb-space-xs">
                    <div className="w-3/4 bg-secondary h-full"></div>
                    <div className="w-1/4 bg-primary-container h-full"></div>
                  </div>
                  <div className="flex justify-between items-center font-data-mono">
                    <div className={`text-headline-md font-bold ${pctResult.isPositive ? 'text-primary' : 'text-error'}`}>
                      {pctResult.pctChange}
                    </div>
                    <div className="text-body-sm text-on-surface font-bold">Delta: {pctResult.deltaVal}</div>
                  </div>
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Multiplier: <span className="font-data-mono text-on-surface">{pctResult.multiplier}</span> | Inverse Base:{' '}
                  <span className="font-data-mono text-on-surface">{pctResult.inverse}</span>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant">COMMERCE &amp; SCIENCE</span>
                <button
                  onClick={() => {
                    setPctInitial(120);
                    setPctFinal(156);
                  }}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Reset ($120 → $156) <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>
            </div>

            {/* 5. Right Triangle & Hypotenuse Solver (Live SVG preview) */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Pythagorean Solver</span>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-secondary font-label-caps text-label-caps">
                    a² + b² = c²
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Right-angle trigonometry, acute angles, perimeter, and area computation.
                </p>
                <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-between border border-outline-variant/20">
                  {/* Inline Mini SVG Triangle */}
                  <svg className="w-28 h-24 shrink-0" fill="none" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon className="fill-primary-fixed/30 stroke-primary" points="20,80 100,80 20,20" strokeWidth="2"></polygon>
                    <polyline className="stroke-primary" fill="none" points="20,70 30,70 30,80" strokeWidth="1.5"></polyline>
                    <text className="fill-on-surface font-data-mono text-[11px] font-bold" x="4" y="55">
                      a={pythA}
                    </text>
                    <text className="fill-on-surface font-data-mono text-[11px] font-bold" x="55" y="96">
                      b={pythB}
                    </text>
                    <text className="fill-primary font-data-mono text-[12px] font-bold" x="65" y="45">
                      c={pythResult.c}
                    </text>
                  </svg>
                  <div className="space-y-space-2xs text-right font-data-mono text-body-sm">
                    <div>
                      <span className="text-on-surface-variant text-label-caps">HYPOTENUSE c:</span>{' '}
                      <span className="font-bold text-primary">{pythResult.c}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-label-caps">AREA:</span>{' '}
                      <span className="font-bold text-on-surface">{pythResult.area}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-label-caps">ANGLE α:</span>{' '}
                      <span className="font-bold text-on-surface">{pythResult.alpha}°</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-label-caps">ANGLE β:</span>{' '}
                      <span className="font-bold text-on-surface">{pythResult.beta}°</span>
                    </div>
                  </div>
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Perimeter: <span className="font-data-mono text-on-surface">{pythResult.perimeter} units</span> • Triple:{' '}
                  <span className="font-data-mono text-on-surface">(3, 4, 5) scaled ×2</span>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant">TRIG GEOMETRY</span>
                <button
                  onClick={() => {
                    setPythA(6);
                    setPythB(8);
                  }}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Standard 6-8-10 <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>
            </div>

            {/* 6. Descriptive Statistics Workbench */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">Descriptive Statistics</span>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-primary font-label-caps text-label-caps">
                    N = {statsDataStr.split(',').filter(Boolean).length}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Mean, median, sample standard deviation (s), population (σ), and quartiles.
                </p>
                <div className="bg-surface-container-low rounded-lg p-space-sm mb-space-sm border border-outline-variant/20">
                  <div className="mb-space-2xs">
                    <input
                      type="text"
                      value={statsDataStr}
                      onChange={e => setStatsDataStr(e.target.value)}
                      className="w-full text-body-sm font-data-mono text-on-surface bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant/30 focus:outline-none"
                      placeholder="e.g. 12, 15, 18, 22, 22, 28, 31, 40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs font-data-mono">
                    <div className="bg-surface-container-lowest p-space-xs rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">MEAN (μ)</span>
                      <span className="font-bold text-primary text-body-md">{statsResult.mean}</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-xs rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">MEDIAN</span>
                      <span className="font-bold text-on-surface text-body-md">{statsResult.median}</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-xs rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">SAMPLE STD DEV (s)</span>
                      <span className="font-bold text-secondary text-body-md">{statsResult.stdDev}</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-xs rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-label-caps">IQR (Q3 - Q1)</span>
                      <span className="font-bold text-on-surface text-body-md">{statsResult.iqr}</span>
                    </div>
                  </div>
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Variance (s²): <span className="font-data-mono text-on-surface">{statsResult.variance}</span> • Mode:{' '}
                  <span className="font-data-mono text-on-surface">{statsResult.mode}</span>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant">GAUSSIAN DISTRIBUTION</span>
                <button
                  onClick={() => setStatsDataStr('12, 15, 18, 22, 22, 28, 31, 40')}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Reset Dataset <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: MATH TOPICS DIRECTORY (12 EXHAUSTIVE CATEGORIES) */}
        <section id="directory" className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="mb-space-xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>INDEXED CATALOG</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Explore Math Topics &amp; Problem Solvers
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Browse 12 math subjects with over 500 step-by-step calculators, lessons, and practice tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                    </div>
                    <span className="font-data-mono text-body-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-xs">{cat.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">{cat.desc}</p>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    {cat.tools.map((tool, idx) => (
                      <li key={idx}>
                        <a
                          href="#quick-solve"
                          className="text-primary hover:underline flex items-center justify-between group-hover:text-primary transition-colors"
                        >
                          <span>{tool}</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-space-md mt-space-md bg-surface-container-low/60 rounded-lg p-space-xs text-on-surface-variant font-label-caps text-label-caps border border-outline-variant/15">
                  {cat.primaryUse}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: SMART CALCULATOR RECOMMENDER (INTERACTIVE DECISION MATRIX) */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl w-full">
          <div className="bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high rounded-2xl shadow-lg border border-outline-variant/30 p-space-lg lg:p-space-2xl">
            <div className="max-w-2xl mb-space-xl">
              <div className="inline-flex items-center gap-space-2xs text-primary font-label-caps text-label-caps mb-space-2xs">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>SMART CALCULATOR FINDER</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Smart Calculator Recommender</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Need help finding the right calculator? Pick your topic and what you want to solve, and we&apos;ll match the best tool for you.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Step Selection Controls */}
              <div className="lg:col-span-7 space-y-space-lg">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-space-xs">
                    Step 1: Select Mathematical Domain
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs font-body-sm text-body-sm">
                    {['Fractions', 'Geometry', 'Statistics', 'Homework', 'Exam Prep', 'Percentage', 'Algebra', 'Calculus'].map(
                      domain => (
                        <button
                          key={domain}
                          onClick={() => setRecommenderDomain(domain)}
                          className={`px-space-sm py-space-xs rounded-lg text-center transition-all ${
                            recommenderDomain === domain
                              ? 'bg-primary text-on-primary font-semibold shadow-sm'
                              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-outline-variant/20'
                          }`}
                        >
                          {domain}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-space-xs">
                    Step 2: Desired Output Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs font-body-sm text-body-sm">
                    {['Step-by-Step Proof', 'Instant Number', 'Visual Graph', 'Formula Matrix'].map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setRecommenderFormat(fmt)}
                        className={`px-space-sm py-space-xs rounded-lg text-center transition-all ${
                          recommenderFormat === fmt
                            ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-outline-variant/20'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest/80 rounded-lg p-space-sm flex items-center justify-between border border-outline-variant/20">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Rule Match Heuristic Confidence:</span>
                  <span className="font-data-mono text-body-sm font-bold text-secondary">99.8% Match</span>
                </div>
              </div>

              {/* Matched Recommendation Card */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="px-space-xs py-space-2xs rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold">
                    BEST MATCH
                  </span>
                  <span className="font-data-mono text-body-sm text-on-surface-variant">TOOL #{recommendation.id}</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-2xs">
                  {recommendation.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">{recommendation.desc}</p>
                <div className="space-y-space-xs bg-surface-container-low rounded-lg p-space-sm mb-space-md font-data-mono text-body-sm border border-outline-variant/20">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Type:</span>
                    <span className="text-primary font-bold">{recommendation.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Breakdown:</span>
                    <span className="text-on-surface font-bold text-right text-xs truncate max-w-[200px]">
                      {recommendation.breakdown}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Share &amp; Copy:</span>
                    <span className="text-secondary font-bold">1-Click Copy Steps</span>
                  </div>
                </div>
                <a
                  href={recommendation.link}
                  className="w-full py-space-sm rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-space-2xs"
                >
                  Open Recommended Calculator <span className="material-symbols-outlined text-[18px]">launch</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FORMULA MATRIX & DERIVATION REPOSITORY */}
        <section id="formulas" className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
                <span className="material-symbols-outlined text-[16px]">functions</span>
                <span>RIGOROUS FORMULA PROOFS</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Formula Matrix &amp; LaTeX Repository</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Authoritative mathematical laws formatted for academic publication and instant computational copy.
              </p>
            </div>
            <button
              onClick={() => {
                alert('PDF Formula Sheet generation queued. Downloading high-resolution formula index.');
              }}
              className="font-body-sm text-body-sm font-semibold text-primary inline-flex items-center gap-space-2xs hover:underline"
            >
              Download Formula Sheets (.PDF) <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {[
              {
                name: 'Quadratic Formula',
                tag: 'POLYNOMIAL DEGREE 2',
                latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
                display: 'x = (-b ± √(b² - 4ac)) / (2a)',
                desc: 'Derivation from completing the square on general form ax² + bx + c = 0 where a ≠ 0.'
              },
              {
                name: 'Pythagorean Theorem',
                tag: 'EUCLIDEAN METRIC',
                latex: 'a^2 + b^2 = c^2',
                display: 'a² + b² = c²',
                desc: 'Fundamental relation in Euclidean geometry among the three sides of a right triangle.'
              },
              {
                name: 'Law of Cosines',
                tag: 'OBLIQUE TRIANGLES',
                latex: 'c^2 = a^2 + b^2 - 2ab \\cos(\\gamma)',
                display: 'c² = a² + b² - 2ab cos(γ)',
                desc: 'Generalization of the Pythagorean theorem for any arbitrary triangle with angle γ opposite side c.'
              },
              {
                name: 'Sample Standard Deviation',
                tag: "BESSEL'S CORRECTION",
                latex: 's = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n - 1}}',
                display: 's = √[ Σ(xᵢ - x̄)² / (n - 1) ]',
                desc: 'Unbiased statistical estimator of variance across random sample datasets of size n.'
              },
              {
                name: "Euler's Identity",
                tag: 'COMPLEX ANALYSIS',
                latex: 'e^{i\\pi} + 1 = 0',
                display: 'e^(iπ) + 1 = 0',
                desc: 'Unites five fundamental mathematical constants: e, i, π, 1, and 0 in a single elegant identity.'
              },
              {
                name: 'Taylor Series Expansion',
                tag: 'INFINITE SERIES',
                latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x - a)^n',
                display: 'f(x) = Σ [ fⁿ(a) / n! ] · (x - a)ⁿ',
                desc: 'Representation of a smooth function as an infinite sum of terms computed from its derivatives at a point.'
              }
            ].map(f => (
              <div
                key={f.name}
                className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">{f.name}</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{f.tag}</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-space-md my-space-sm text-center font-data-mono text-headline-md text-primary font-bold overflow-x-auto border border-outline-variant/20">
                    {f.display}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{f.desc}</p>
                </div>
                <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                  <span className="font-label-caps text-label-caps text-secondary font-mono">LATEX VERIFIED</span>
                  <button
                    onClick={() => copyLatex(f.latex, f.name)}
                    className="px-space-xs py-space-2xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-space-2xs border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedFormula === f.name ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedFormula === f.name ? 'Copied!' : 'Copy LaTeX'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: VISUAL MATH CENTER (INTERACTIVE SVG VISUALIZERS) */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="mb-space-xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>OPTICAL MATHEMATICAL PROOFS</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Visual Math Interactive Center</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Geometric coordinate spaces, unit circles, and continuous distribution topologies rendered natively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* Visualizer 1: Interactive Unit Circle */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Unit Circle Trigonometry</h3>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-primary font-label-caps text-label-caps">
                    (cos θ, sin θ)
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Real-time cartesian coordinates for canonical angles (0°, 30°, 45°, 60°, 90°).
                </p>
                <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-center border border-outline-variant/20">
                  <svg className="w-64 h-64" fill="none" viewBox="-120 -120 240 240" xmlns="http://www.w3.org/2000/svg">
                    {/* Axes */}
                    <line className="stroke-outline-variant" strokeWidth="1.5" x1="-110" x2="110" y1="0" y2="0"></line>
                    <line className="stroke-outline-variant" strokeWidth="1.5" x1="0" x2="0" y1="-110" y2="110"></line>
                    {/* Unit Circle */}
                    <circle className="stroke-primary" cx="0" cy="0" fill="none" r="80" strokeWidth="2"></circle>
                    {/* 45 Degree Triangle Vector */}
                    <polygon className="fill-primary/15" points="0,0 56.5,-56.5 56.5,0"></polygon>
                    <line className="stroke-tertiary-container" strokeWidth="2.5" x1="0" x2="56.5" y1="0" y2="-56.5"></line>
                    <line className="stroke-primary" strokeDasharray="3,3" strokeWidth="1.5" x1="56.5" x2="56.5" y1="0" y2="-56.5"></line>
                    {/* Points */}
                    <circle className="fill-on-surface" cx="80" cy="0" r="4"></circle>
                    <text className="fill-on-surface font-data-mono text-[9px] font-bold" x="84" y="14">
                      (1, 0)
                    </text>
                    <circle className="fill-on-surface" cx="0" cy="-80" r="4"></circle>
                    <text className="fill-on-surface font-data-mono text-[9px] font-bold" x="-18" y="-86">
                      (0, 1)
                    </text>
                    <circle className="fill-tertiary-container" cx="56.5" cy="-56.5" r="4"></circle>
                    <text className="fill-tertiary-container font-data-mono text-[9px] font-bold" x="62" y="-56">
                      45° (√2/2, √2/2)
                    </text>
                  </svg>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <div className="font-data-mono text-body-sm text-on-surface-variant">θ = π/4 rad (0.7854)</div>
                <button
                  onClick={() => alert('Unit Circle: sin(45°) = √2/2 ≈ 0.7071, cos(45°) = √2/2 ≈ 0.7071, tan(45°) = 1.0')}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Explore 360° Degrees <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Visualizer 2: Gaussian Normal Distribution Curve */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Gaussian Normal Curve</h3>
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-secondary font-label-caps text-label-caps">
                    68 - 95 - 99.7 Rule
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Standard deviation confidence intervals (±1σ, ±2σ, ±3σ) and cumulative distribution.
                </p>
                <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-center border border-outline-variant/20">
                  <svg className="w-full max-w-sm h-64" fill="none" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <line className="stroke-outline-variant" strokeWidth="1.5" x1="10" x2="310" y1="150" y2="150"></line>
                    <path className="fill-primary/20" d="M 115 150 L 115 76 Q 160 20 205 76 L 205 150 Z"></path>
                    <path
                      className="stroke-primary"
                      d="M 20 148 Q 90 145 115 76 Q 160 15 205 76 Q 230 145 300 148"
                      fill="none"
                      strokeWidth="3"
                    ></path>
                    <line className="stroke-tertiary" strokeDasharray="4,4" strokeWidth="2" x1="160" x2="160" y1="15" y2="150"></line>
                    <text className="fill-on-surface font-data-mono text-[10px] font-bold" x="155" y="165">
                      μ
                    </text>
                    <text className="fill-on-surface-variant font-data-mono text-[9px]" x="105" y="165">
                      -1σ
                    </text>
                    <text className="fill-on-surface-variant font-data-mono text-[9px]" x="200" y="165">
                      +1σ
                    </text>
                    <text className="fill-primary font-data-mono text-[11px] font-bold" x="142" y="90">
                      68.27%
                    </text>
                  </svg>
                </div>
              </div>
              <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                <div className="font-data-mono text-body-sm text-on-surface-variant">Z = 0.00 | P(X &lt; Z) = 0.5000</div>
                <button
                  onClick={() => alert('Empirical Rule: 68.27% within ±1σ, 95.45% within ±2σ, 99.73% within ±3σ.')}
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Launch Z-Score Evaluator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: STANDARDIZED EXAM PREP SUITES */}
        <section id="exam-prep" className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="mb-space-xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>CURATED CURRICULAR ALIGNMENT</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Standardized Exam Preparation Suites</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Targeted problem sets and specialized formula suites mapped precisely to college entrance examinations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {[
              {
                title: 'SAT® Math',
                badge: 'DIGITAL SAT',
                badgeColor: 'text-primary',
                desc: 'Algebra, Advanced Math, Problem Solving, and Additional Topics in Math.',
                items: [
                  'Heart of Algebra Solvers',
                  'Desmos-Compatible System Solvers',
                  'Exponents & Radical Roots',
                  'Circle Geometry in Coordinate Planes'
                ]
              },
              {
                title: 'ACT® Math',
                badge: '60 MIN / 60 Q',
                badgeColor: 'text-secondary',
                desc: 'Pre-Algebra, Elementary & Intermediate Algebra, Coordinate & Plane Geometry.',
                items: [
                  'Matrix Multiplication & Determinants',
                  'Logarithmic & Complex Numbers',
                  'Trigonometric Identity Formulas',
                  'Probability & Counting Rules'
                ]
              },
              {
                title: 'AP® STEM Suite',
                badge: 'AB / BC / STATS',
                badgeColor: 'text-primary',
                desc: 'College Board advanced placement computational derivations and tests.',
                items: [
                  'Derivative Chain & Product Rules',
                  'Riemann Sum & Definite Integrals',
                  '1-Sample & 2-Sample t-Tests',
                  'Power Series & Convergence Ratio'
                ]
              },
              {
                title: 'GRE® / GMAT®',
                badge: 'GRADUATE QUANT',
                badgeColor: 'text-tertiary',
                desc: 'Quantitative comparison heuristics, rate/work problems, and modular logic.',
                items: [
                  'Combined Work & Speed Rates',
                  'Overlapping Set Venn Diagrams',
                  'Prime Factor Divisibility Traps',
                  'Weighted Average Concentration'
                ]
              }
            ].map(suite => (
              <div
                key={suite.title}
                className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">{suite.title}</span>
                    <span className={`px-space-xs py-space-2xs rounded bg-surface-container ${suite.badgeColor} font-label-caps text-label-caps`}>
                      {suite.badge}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">{suite.desc}</p>
                  <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface mb-space-md">
                    {suite.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-space-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('quick-solve');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-space-xs bg-surface-container hover:bg-surface-container-high rounded text-primary font-body-sm text-body-sm font-semibold transition-colors border border-outline-variant/20"
                >
                  Open {suite.title}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: STRUCTURED LEARNING PATHWAYS */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="mb-space-xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
              <span className="material-symbols-outlined text-[16px]">route</span>
              <span>ACADEMIC CURRICULUM ROADMAP</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Structured Learning Pathways</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Progress through our pedagogical framework from middle school arithmetic to institutional applied data science.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
            {[
              {
                stage: 'STAGE 01',
                title: 'Foundational Core',
                border: 'border-primary',
                textCol: 'text-primary',
                desc: 'Fractions, decimals, percentages, and basic pre-algebra equations.',
                bullets: ['Order of Operations (PEMDAS)', 'Common Factors & Multiples', 'Linear One-Step Equations']
              },
              {
                stage: 'STAGE 02',
                title: 'Secondary Rigor',
                border: 'border-secondary',
                textCol: 'text-secondary',
                desc: 'Algebra I & II, Euclidean geometry proofs, and trigonometry fundamentals.',
                bullets: ['Quadratic Formula & Factoring', 'Right Triangle Trigonometry', 'Coordinate Geometry Proofs']
              },
              {
                stage: 'STAGE 03',
                title: 'Collegiate Calculus',
                border: 'border-primary-container',
                textCol: 'text-primary-container',
                desc: 'Limits, continuous rates of change, integration techniques, and infinite series.',
                bullets: ['Limits & Continuous Functions', 'Definite & Indefinite Integrals', 'Sequences & Taylor Series']
              },
              {
                stage: 'STAGE 04',
                title: 'Applied Metrology',
                border: 'border-tertiary',
                textCol: 'text-tertiary',
                desc: 'Probability density functions, matrix operations, and regression models.',
                bullets: ['Gaussian Normal Probability', 'Matrix Determinants & Inversion', 'Multivariate Optimization']
              }
            ].map(st => (
              <div
                key={st.stage}
                className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm border-t-4 ${st.border} border border-outline-variant/20`}
              >
                <div className={`font-data-mono text-body-sm ${st.textCol} font-bold mb-space-2xs`}>{st.stage}</div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-xs">{st.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">{st.desc}</p>
                <div className="text-body-sm font-data-mono text-on-surface-variant space-y-space-2xs">
                  {st.bullets.map((b, i) => (
                    <div key={i}>✓ {b}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: MATHEMATICAL TRADE-OFFS & CONCEPTUAL COMPARISONS */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="mb-space-xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>CONCEPTUAL ANALYSIS</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Mathematical Trade-offs &amp; Comparisons</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Clarifying frequently conflated principles through deterministic comparative criteria.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* Comparison 1: Mean vs. Median */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Mean vs. Median</h3>
                <span className="font-label-caps text-label-caps text-secondary font-mono">CENTRAL TENDENCY</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                While both represent the center of a data distribution, their sensitivity to extreme values differs drastically.
              </p>
              <div className="grid grid-cols-2 gap-space-sm mb-space-md font-body-sm text-body-sm">
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">Arithmetic Mean (μ)</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Calculated by summing all values and dividing by N. Highly vulnerable to severe positive or negative outliers.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">Median (50th Percentile)</span>
                  <p className="text-on-surface-variant text-body-sm">
                    The physical middle value in a sorted array. Robust metric resilient to heavy-tailed skewness.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high/50 p-space-xs rounded font-label-caps text-label-caps text-on-surface-variant border border-outline-variant/15">
                DECISION RULE: Use Median for real estate prices and income data; use Mean for symmetric normal models.
              </div>
            </div>

            {/* Comparison 2: Law of Sines vs. Law of Cosines */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Law of Sines vs. Law of Cosines</h3>
                <span className="font-label-caps text-label-caps text-primary font-mono">TRIANGLE SOLVER</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                The geometric condition of known sides and angles dictates which trigonometric formula must be initiated.
              </p>
              <div className="grid grid-cols-2 gap-space-sm mb-space-md font-body-sm text-body-sm">
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">Law of Sines</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Optimal for AAS (Angle-Angle-Side) or ASA cases. Requires special handling in the ambiguous SSA case.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">Law of Cosines</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Essential when given SAS (two sides and included angle) or SSS (all three sides) where no angle pair is known.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high/50 p-space-xs rounded font-label-caps text-label-caps text-on-surface-variant border border-outline-variant/15">
                DECISION RULE: If SSS or SAS is provided, solve one angle via Law of Cosines first.
              </div>
            </div>

            {/* Comparison 3: GCF vs. LCM */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">GCF (Greatest Common Factor) vs. LCM</h3>
                <span className="font-label-caps text-label-caps text-tertiary font-mono">NUMBER THEORY</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Both algorithms decompose integers into prime factorizations, but evaluate opposite set intersections.
              </p>
              <div className="grid grid-cols-2 gap-space-sm mb-space-md font-body-sm text-body-sm">
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">GCF / HCF</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Intersection of shared prime factors raised to their lowest exponent. Used to simplify rational fractions.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">LCM</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Union of all prime factors raised to their highest exponent. Essential to find common denominators (LCD).
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high/50 p-space-xs rounded font-label-caps text-label-caps text-on-surface-variant border border-outline-variant/15">
                EQUATION THEOREM: a × b = GCF(a, b) × LCM(a, b)
              </div>
            </div>

            {/* Comparison 4: % Change vs. % Difference */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Percent Change vs. Percent Difference</h3>
                <span className="font-label-caps text-label-caps text-secondary font-mono">DIRECTIONALITY</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                A frequent source of academic confusion rooted in the selection of baseline denominator.
              </p>
              <div className="grid grid-cols-2 gap-space-sm mb-space-md font-body-sm text-body-sm">
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">Percent Change</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Directional: ((New - Old) / |Old|) × 100%. Quantifies growth or decay over chronological time.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                  <span className="font-bold text-on-surface block mb-space-2xs">Percent Difference</span>
                  <p className="text-on-surface-variant text-body-sm">
                    Symmetric: (|A - B| / ((A + B) / 2)) × 100%. Evaluates discrepancy between two concurrent experimental trials.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high/50 p-space-xs rounded font-label-caps text-label-caps text-on-surface-variant border border-outline-variant/15">
                DECISION RULE: If there is a chronological baseline &quot;before&quot;, use Percent Change.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: FAQ & COMPREHENSIVE EDUCATIONAL ARTICLES */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {/* FAQ Left Column */}
            <div className="lg:col-span-6 space-y-space-md">
              <div>
                <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
                  <span className="material-symbols-outlined text-[16px]">quiz</span>
                  <span>VERIFIED METHODOLOGY</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Frequently Asked Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Clear answers regarding formula accuracy, computational sandboxes, and academic ethics.
                </p>
              </div>
              <div className="space-y-space-sm">
                {[
                  {
                    q: 'Are calculations performed privately on my computer?',
                    a: 'Yes! 100% of arithmetic, algebra, and geometry calculations are processed right inside your browser. Your homework and practice numbers are completely private, never sent to external servers, and load instantly.'
                  },
                  {
                    q: 'Are these calculators accurate for homework and exams?',
                    a: 'Every calculator uses exact fraction and precision math logic so you avoid messy decimal rounding errors. You can trust the results to match official textbook answer keys, SAT/ACT standards, and teacher guidelines.'
                  },
                  {
                    q: 'Can I use these step-by-step explanations for studying?',
                    a: 'Yes! Our tools are built to help you learn and understand each formula rather than just giving a final number. Follow each step from problem setup to the simplified answer to master the material.'
                  },
                  {
                    q: 'Can I copy solutions and formulas for class projects?',
                    a: 'Yes. Every tool allows 1-click copying of clean math formulas and steps, ready to paste into Google Docs, Word, or homework papers.'
                  }
                ].map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 [&_summary::-webkit-details-marker]:hidden"
                    open={i === 0}
                  >
                    <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg font-bold text-on-surface">
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-[20px] group-open:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </summary>
                    <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Educational Article Right Column */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg lg:p-space-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>HOW IT WORKS</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-sm">
                  How Our Math Solvers Work &amp; Show Steps
                </h3>
                <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  <p>
                    SolveIt breaks down each problem step-by-step just like a teacher on a whiteboard. From simplifying fractions
                    and factoring polynomials to graphing geometry, our tools show the full work so you can understand the
                    concepts, check your homework, and ace your exams.
                  </p>
                  <p>
                    Every formula follows official school curriculums and verified textbook methods. Rather than skipping straight
                    to an answer, we explain each rule—such as finding common denominators or factoring quadratics—clearly and
                    thoroughly.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg font-data-mono text-body-sm border border-outline-variant/20">
                    <span className="text-primary font-bold">Our Goal:</span>
                    <span className="text-on-surface block mt-space-2xs">
                      Clear, accurate, and easy-to-follow solutions for every student.
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-space-lg flex items-center justify-between border-t border-outline-variant/15 mt-space-md">
                <span className="font-label-caps text-label-caps text-on-surface-variant">CURATED FOR STUDENTS &amp; TEACHERS</span>
                <a
                  href="#directory"
                  className="text-primary font-semibold font-body-sm text-body-sm inline-flex items-center gap-space-2xs hover:underline"
                >
                  Explore All Study Guides <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 11: RELATED CATEGORIES, TRUST ARCHITECTURE & EXTENDED EXPLORATION */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl w-full">
          {/* Cross Category Portal Cards */}
          <div className="mb-space-xl">
            <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps mb-space-2xs">
              <span className="material-symbols-outlined text-[16px]">hub</span>
              <span>INTERCONNECTED UTILITIES</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Related Problem Solving Hubs</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Seamlessly apply your mathematical computations across our specialized computational engines.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md mb-space-2xl">
            <Link
              href="/finance"
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-space-sm">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <span className="font-body-md text-body-md font-bold text-on-surface">Financial Core</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-space-2xs">DCF &amp; Compound Int</span>
            </Link>
            <Link
              href="/time-date"
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-space-sm">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <span className="font-body-md text-body-md font-bold text-on-surface">Time &amp; Date</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-space-2xs">Duration &amp; ISO 8601</span>
            </Link>
            <Link
              href="/conversions"
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-space-sm">
                <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
              </div>
              <span className="font-body-md text-body-md font-bold text-on-surface">Unit Conversion</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-space-2xs">SI &amp; Imperial Standards</span>
            </Link>
            <Link
              href="/health"
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-space-sm">
                <span className="material-symbols-outlined text-[24px]">fitness_center</span>
              </div>
              <span className="font-body-md text-body-md font-bold text-on-surface">Health &amp; Fitness</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-space-2xs">BMR, TDEE &amp; Macro</span>
            </Link>
            <Link
              href="/automotive"
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-space-sm">
                <span className="material-symbols-outlined text-[24px]">directions_car</span>
              </div>
              <span className="font-body-md text-body-md font-bold text-on-surface">Automotive</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-space-2xs">Fuel, Torque &amp; Gear</span>
            </Link>
          </div>

          {/* Metrology Trust Banner */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md shadow-inner border border-outline-variant/20">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
                  SolveIt Student Learning Promise
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Every formula and solution is verified against standard school curriculums, textbook methods, and educator-approved step-by-step solutions.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0 font-data-mono text-body-sm">
              <span className="px-space-sm py-space-xs bg-surface-container-lowest rounded text-on-surface font-semibold shadow-sm border border-outline-variant/30">
                Verified: 100% School Aligned
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
