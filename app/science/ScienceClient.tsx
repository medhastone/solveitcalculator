'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ScienceClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' focus search
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

  const quickFillSearch = (term: string) => {
    setSearchQuery(term);
    searchInputRef.current?.focus();
  };

  // --- Workbench 1: Density ---
  const [wbDensityMass, setWbDensityMass] = useState<number>(250);
  const [wbDensityVol, setWbDensityVol] = useState<number>(92.5);

  const densityResult = useMemo(() => {
    const mass = Number(wbDensityMass) || 0;
    const vol = Number(wbDensityVol) || 0;
    if (vol <= 0 || mass <= 0) {
      return {
        density: '0.00',
        kgm3: '0',
        lbft3: '0.0',
        material: 'Indeterminate'
      };
    }
    const d = mass / vol;
    const densityStr = d.toFixed(2);
    const kgm3Str = (d * 1000).toLocaleString(undefined, { maximumFractionDigits: 1 });
    const lbft3Str = (d * 62.428).toFixed(1);

    let material = 'Custom Solid/Liquid';
    if (Math.abs(d - 2.7) < 0.15) {
      material = 'Identified: Aluminum (2.70)';
    } else if (Math.abs(d - 7.87) < 0.3) {
      material = 'Identified: Iron / Steel (7.87)';
    } else if (Math.abs(d - 1.0) < 0.08) {
      material = 'Identified: Water (1.00)';
    } else if (Math.abs(d - 19.32) < 0.5) {
      material = 'Identified: Gold (19.32)';
    } else if (Math.abs(d - 0.92) < 0.05) {
      material = 'Identified: Ice (0.92)';
    }

    return {
      density: densityStr,
      kgm3: kgm3Str,
      lbft3: lbft3Str,
      material
    };
  }, [wbDensityMass, wbDensityVol]);

  // --- Workbench 2: Molarity & Osmolarity ---
  const [wbMolMass, setWbMolMass] = useState<number>(14.61);
  const [wbMolMw, setWbMolMw] = useState<number>(58.44);
  const [wbMolVol, setWbMolVol] = useState<number>(500);

  const molarityResult = useMemo(() => {
    const mass = Number(wbMolMass) || 0;
    const mw = Number(wbMolMw) || 1;
    const volMl = Number(wbMolVol) || 1;
    if (mw <= 0 || volMl <= 0) {
      return { molarity: '0.000', moles: '0.000', osmolarity: '0.00' };
    }
    const moles = mass / mw;
    const liters = volMl / 1000;
    const molarity = moles / liters;
    const osmolarity = molarity * 2; // NaCl i=2
    return {
      molarity: molarity.toFixed(3),
      moles: moles.toFixed(3),
      osmolarity: osmolarity.toFixed(2)
    };
  }, [wbMolMass, wbMolMw, wbMolVol]);

  // --- Workbench 3: Kinetic Energy ---
  const [wbKeMass, setWbKeMass] = useState<number>(1200);
  const [wbKeVel, setWbKeVel] = useState<number>(25);

  const keResult = useMemo(() => {
    const m = Number(wbKeMass) || 0;
    const v = Number(wbKeVel) || 0;
    const joules = 0.5 * m * (v * v);
    const kJ = joules / 1000;
    const kcal = (joules / 4184).toFixed(1);
    const ftlb = Math.round(joules * 0.737562).toLocaleString();
    const kmh = (v * 3.6).toFixed(1);
    return {
      kJ: kJ.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      joules: Math.round(joules).toLocaleString(),
      kcal,
      ftlb,
      kmh
    };
  }, [wbKeMass, wbKeVel]);

  // --- Workbench 4: Ideal Gas Law ---
  const [wbGasP, setWbGasP] = useState<number>(1.00);
  const [wbGasV, setWbGasV] = useState<number>(22.414);
  const [wbGasT, setWbGasT] = useState<number>(273.15);

  const gasResult = useMemo(() => {
    const p = Number(wbGasP) || 0;
    const v = Number(wbGasV) || 0;
    const t = Number(wbGasT) || 1;
    const R = 0.082057; // L atm / (mol K)
    if (t <= 0) return '0.000';
    const moles = (p * v) / (R * t);
    return moles.toFixed(3);
  }, [wbGasP, wbGasV, wbGasT]);

  // --- Smart Science Assistant State ---
  const [assistantMode, setAssistantMode] = useState<'chem' | 'physics' | 'bio' | 'astro'>('chem');

  const assistantData = {
    chem: {
      title: 'Chemistry Lab Benchwork',
      tools: [
        { title: 'Solution Molarity & Stock Dilution', desc: 'Direct grams to moles and M1V1 = M2V2 aliquot prep.' },
        { title: 'Buffer Henderson-Hasselbalch', desc: 'Compute target conjugate base/acid ratios for strict pH maintenance.' },
        { title: 'Significant Figures Evaluator', desc: 'Clean automatic uncertainty rounding during volumetric calculations.' },
        { title: 'Percent Yield & Stoichiometry', desc: 'Assess synthesis efficacy against theoretical balanced yield.' }
      ]
    },
    physics: {
      title: 'AP & College Physics',
      tools: [
        { title: '2D Projectile Trajectory Solver', desc: 'Calculate apex height, range, and impact time with gravity vectors.' },
        { title: 'Work-Energy & Kinetic Theorem', desc: 'Calculate conservation states between spring, gravity, and velocity.' },
        { title: 'SUVAT Kinematics Variable Isolator', desc: 'Solve for any 5th variable using foundational linear equations.' },
        { title: 'Coulomb Electrostatic Force', desc: 'Compute vector force magnitudes between charged point particles.' }
      ]
    },
    bio: {
      title: 'Genetics & Biological Studies',
      tools: [
        { title: 'Hardy-Weinberg Equilibrium', desc: 'Determine carrier frequency (2pq) from recessive phenotype frequency (q²).' },
        { title: 'Dihybrid Punnett Cross Helper', desc: '16-square genetic cross outcome ratios and probability calculation.' },
        { title: 'Bacterial Doubling Time', desc: 'Model exponential growth curves and colony division intervals.' },
        { title: 'Michaelis-Menten Kinetics', desc: 'Calculate enzyme Vmax and Km affinity constants from substrate levels.' }
      ]
    },
    astro: {
      title: 'Astrophysics & Deep Space',
      tools: [
        { title: 'Kepler Third Law Solver', desc: 'Harmonic orbital periods for exoplanets and solar system satellites.' },
        { title: 'Schwarzschild Radius Model', desc: 'Calculate gravitational event horizon radius for any mass scale.' },
        { title: 'Cosmological Redshift z', desc: 'Translate spectral line shifts to radial recession velocities.' },
        { title: 'Escape Velocity Calculator', desc: 'Calculate planetary escape thresholds based on mass and radius.' }
      ]
    }
  };

  // --- FAQ State ---
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });
  const toggleFaq = (idx: number) => {
    setOpenFaqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // --- 20-Category Science Directory Data ---
  const categoriesList = [
    {
      id: 'cat-1',
      title: '1. Physics Fundamentals',
      badge: '12 Tools',
      badgeColor: 'primary',
      desc: 'Foundational Newtonian classical physics and linear dynamics.',
      linkText: 'Explore Fundamentals',
      tools: [
        'Force (F = ma) Calculator',
        'Mass, Weight & Local Gravity',
        'Velocity & Acceleration Vectors',
        'Momentum (p = mv) & Impulse',
        'Mechanical Work & Power Output',
        'Pressure & Pascal Units',
        'Percent Error & Experimental Variance'
      ]
    },
    {
      id: 'cat-2',
      title: '2. Motion & Kinematics',
      badge: '10 Tools',
      badgeColor: 'secondary',
      desc: '1D and 2D kinematic trajectory modelling, free fall, and rotation.',
      linkText: 'Explore Kinematics',
      tools: [
        '2D Projectile Motion Simulator',
        'Free Fall with Drag & Terminal Speed',
        'SUVAT Kinematic Solver',
        'Angular Velocity & Centripetal Accel',
        'Circular Motion Force (Fc = mv²/r)'
      ]
    },
    {
      id: 'cat-3',
      title: '3. Energy, Work & Power',
      badge: '14 Tools',
      badgeColor: 'tertiary',
      desc: 'Conservative mechanical energy, spring systems, and photon quanta.',
      linkText: 'Explore Energy & Work',
      tools: [
        'Kinetic Energy (KE = ½mv²)',
        'Gravitational Potential Energy (mgh)',
        "Hooke's Law Elastic Potential",
        'Work-Energy Equivalence Theorem',
        'Planck-Einstein Photon Energy (E = hf)'
      ]
    },
    {
      id: 'cat-4',
      title: '4. Gravity & Astronomy',
      badge: '11 Tools',
      badgeColor: 'primary',
      desc: 'Astrophysics, planetary mechanics, relativistic metrics, and space flight.',
      linkText: 'Explore Astronomy',
      tools: [
        "Universal Gravitation (F = G*m1*m2/r²)",
        'Planetary Escape Velocity Calculator',
        "Kepler's Third Law Harmonic Orbit",
        'Schwarzschild Black Hole Radius',
        'Astronomical Unit, Parsec & Light-Year'
      ]
    },
    {
      id: 'cat-5',
      title: '5. Waves, Acoustics & Optics',
      badge: '9 Tools',
      badgeColor: 'secondary',
      desc: 'Refraction, lens focal lengths, acoustic propagation, and wave speeds.',
      linkText: 'Explore Waves & Optics',
      tools: [
        'Wave Speed (v = f·λ) & Frequency',
        "Snell's Law Index of Refraction",
        'Thin Lens & Mirror Equation',
        'Doppler Effect Frequency Shift',
        'Light Intensity Inverse Square Law'
      ]
    },
    {
      id: 'cat-6',
      title: '6. Thermodynamics & Heat',
      badge: '13 Tools',
      badgeColor: 'tertiary',
      desc: 'Calorimetry, thermal expansion, Carnot heat engine cycles, and gas laws.',
      linkText: 'Explore Thermodynamics',
      tools: [
        'Specific Heat Transfer (Q = mcΔT)',
        'Thermal Linear Expansion (ΔL = αL0ΔT)',
        'Carnot Cycle Maximum Efficiency',
        "Boyle's & Charles's Gas Laws",
        'Stefan-Boltzmann Thermal Radiation'
      ]
    },
    {
      id: 'cat-7',
      title: '7. Electricity & Magnetism',
      badge: '15 Tools',
      badgeColor: 'primary',
      desc: 'Coulomb electrostatics, Lorentz force, capacitance, and magnetic flux.',
      linkText: 'Explore Electromagnetism',
      tools: [
        "Coulomb's Electrostatic Force",
        'Electric Field Strength & Potential',
        'Lorentz Magnetic Force (F = qvB)',
        'Parallel Plate Capacitance (C = εA/d)',
        'Faraday Induction & Magnetic Flux'
      ]
    },
    {
      id: 'cat-8',
      title: '8. Chemistry Fundamentals',
      badge: '16 Tools',
      badgeColor: 'secondary',
      desc: 'Stoichiometry, periodic table weights, empirical formulas, and molar conversions.',
      linkText: 'Explore Chemistry',
      tools: [
        'Molar Mass from Formula',
        'Grams to Moles & Molecules',
        'Stoichiometry Limiting Reactant',
        'Percent Mass Composition',
        'Empirical to Molecular Formula'
      ]
    },
    {
      id: 'cat-9',
      title: '9. Solutions & Concentration',
      badge: '12 Tools',
      badgeColor: 'tertiary',
      desc: 'Solution prep, molality, normality, stock dilution, and parts-per-million.',
      linkText: 'Explore Solutions',
      tools: [
        'Molarity (M = mol / L) Calculator',
        'Dilution Equation (M1V1 = M2V2)',
        'Molality (m = mol / kg solvent)',
        'Normality & Equivalent Weight',
        'Parts Per Million (ppm) & ppb'
      ]
    },
    {
      id: 'cat-10',
      title: '10. Acids, Bases & pH Buffers',
      badge: '11 Tools',
      badgeColor: 'primary',
      desc: 'Henderson-Hasselbalch buffer calculations, titration equivalence, Ka and pKa.',
      linkText: 'Explore Acid-Base Tools',
      tools: [
        'pH & pOH from [H+] and [OH-]',
        'Ka, Kb, pKa and pKb Dissociation',
        'Henderson-Hasselbalch Buffer Solver',
        'Acid-Base Titration Equivalence',
        'Buffer Capacity Index'
      ]
    },
    {
      id: 'cat-11',
      title: '11. Chemical Kinetics & Energy',
      badge: '10 Tools',
      badgeColor: 'secondary',
      desc: 'Gibbs free energy, equilibrium constants Kc/Kp, and reaction rates.',
      linkText: 'Explore Kinetics',
      tools: [
        'Percent Yield & Theoretical Mass',
        'Gibbs Free Energy (ΔG = ΔH - TΔS)',
        'Equilibrium Constant Kc & Kp',
        'Arrhenius Equation Activation Energy',
        'Half-Life of First Order Reactions'
      ]
    },
    {
      id: 'cat-12',
      title: '12. Biology & Cell Physiology',
      badge: '14 Tools',
      badgeColor: 'tertiary',
      desc: 'Cell division rates, osmolarity tonicity, enzyme kinetics, and metabolic rates.',
      linkText: 'Explore Cell Biology',
      tools: [
        'Cell Doubling Time & Division Rate',
        'Michaelis-Menten Enzyme Kinetics',
        "Tonicity & Van 't Hoff Osmolarity",
        'Surface Area to Volume Ratio',
        'Cellular Respiration ATP Yield'
      ]
    },
    {
      id: 'cat-13',
      title: '13. Genetics & Heredity',
      badge: '8 Tools',
      badgeColor: 'primary',
      desc: 'Mendelian inheritance crosses, dihybrid grids, and population equilibrium.',
      linkText: 'Explore Genetics',
      tools: [
        'Monohybrid & Dihybrid Punnett Square',
        'Hardy-Weinberg (p² + 2pq + q² = 1)',
        'Genetic Recombination Frequency',
        'Chi-Square Test for Mendelian Ratios'
      ]
    },
    {
      id: 'cat-14',
      title: '14. Microbiology & Culture',
      badge: '9 Tools',
      badgeColor: 'secondary',
      desc: 'Bacterial growth curve exponential models, colony forming units (CFU), and dilution plates.',
      linkText: 'Explore Microbiology',
      tools: [
        'Bacterial Growth Curve (N = N0·2^n)',
        'CFU/mL Colony Density Estimator',
        'Serial Dilution Plating Factor',
        'Hemocytometer Cell Count Helper'
      ]
    },
    {
      id: 'cat-15',
      title: '15. Environmental Science',
      badge: '11 Tools',
      badgeColor: 'tertiary',
      desc: 'Solar irradiance insolation, carbon footprints, AQI, and ecosystem trophic efficiencies.',
      linkText: 'Explore Environment',
      tools: [
        'Carbon Dioxide Equivalent Footprint',
        'Solar Radiation Flux & Insolation',
        'Air Quality Index (AQI) Calculation',
        'Lindeman 10% Trophic Efficiency'
      ]
    },
    {
      id: 'cat-16',
      title: '16. Earth Science & Geology',
      badge: '10 Tools',
      badgeColor: 'primary',
      desc: 'Seismic magnitude, rock mineral density, groundwater flow, and barometric elevation.',
      linkText: 'Explore Earth Science',
      tools: [
        'Earthquake Richter Energy & Moment Mw',
        'Rock Specific Gravity & Porosity',
        'Hydrostatic Pressure (P = ρgh)',
        'Atmospheric Barometric Lapse Rate'
      ]
    },
    {
      id: 'cat-17',
      title: '17. Laboratory Bench Utilities',
      badge: '13 Tools',
      badgeColor: 'secondary',
      desc: 'PCR master mixes, centrifuge RCF conversion, spectrophotometry, and sig figs.',
      linkText: 'Explore Lab Utilities',
      tools: [
        'Centrifuge RPM to RCF (g-force)',
        'Beer-Lambert Absorbance (A = εcl)',
        'PCR Reaction Master Mix Calculator',
        'Significant Figures & Rounding Rules'
      ]
    },
    {
      id: 'cat-18',
      title: '18. Research Statistics & Metrics',
      badge: '15 Tools',
      badgeColor: 'tertiary',
      desc: 'Descriptive stats, confidence limits, t-tests, standard deviation, and regression.',
      linkText: 'Explore Research Stats',
      tools: [
        'Sample & Population Standard Deviation',
        '95% Confidence Interval for Means',
        "Two-Sample Student's t-Test & p-Value",
        'Linear Regression & Pearson r / R²'
      ]
    },
    {
      id: 'cat-19',
      title: '19. Scientific Unit Conversions',
      badge: '18 Tools',
      badgeColor: 'primary',
      desc: 'SI to imperial, Kelvin to Celsius, standard atmosphere, Joules to electron-volts.',
      linkText: 'Explore Unit Converters',
      tools: [
        'Temperature: Celsius, Fahrenheit, Kelvin',
        'Pressure: atm, bar, torr, psi, Pascals',
        'Energy: Joules, eV, Calories, BTU',
        'Length: Nanometers, Angstroms, Microns'
      ]
    },
    {
      id: 'cat-20',
      title: '20. Student Science Helpers',
      badge: '12 Tools',
      badgeColor: 'secondary',
      desc: 'Formula variable isolation, uncertainty propagation, and lab report formatting.',
      linkText: 'Explore Student Helpers',
      tools: [
        'Formula Variable Isolator & Rearranger',
        'Scientific Notation E-Notation Formatter',
        'Error Propagation (Sum & Product Rules)',
        'Dimensional Analysis Unit Verifier'
      ]
    }
  ];

  // Search filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    const q = searchQuery.toLowerCase();
    return categoriesList
      .map(cat => ({
        ...cat,
        tools: cat.tools.filter(
          t => t.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.tools.length > 0 || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
  }, [searchQuery, categoriesList]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex flex-col justify-between">
      <Header />

      <main className="w-full pt-20 bg-background flex-1">
        {/* Breadcrumbs & Trust Ribbon */}
        <div className="w-full bg-surface-container-low py-space-sm px-gutter-mobile lg:px-gutter-desktop border-b border-outline-variant/15">
          <div className="max-w-max-width-canvas mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs text-body-sm font-body-sm">
            <nav className="flex items-center gap-space-2xs text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="/">Home</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Science Calculators</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface-variant">Science Learning &amp; Problem Solvers Hub</span>
            </nav>
            <div className="flex flex-wrap items-center gap-space-2xs">
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-lowest text-primary font-label-caps text-label-caps shadow-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-[13px]">lock</span> 100% Free &amp; Private
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps shadow-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-[13px] text-secondary">verified</span> NIST &amp; CODATA Aligned
              </span>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps shadow-sm border border-outline-variant/20">
                <span className="material-symbols-outlined text-[13px] text-tertiary">bolt</span> Instant Results
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop relative overflow-hidden bg-surface">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-sm">
                <div className="inline-flex items-center gap-space-xs w-max px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">science</span>
                  Science Education &amp; Research Platform
                </div>
                <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold">
                  Science Calculators &amp; Scientific Tools
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Interactive physics, chemistry, biology, earth science, and laboratory problem solvers. Built for students, educators, and researchers to explore formulas, analyze laboratory data, and master scientific principles with instant calculations.
                </p>

                {/* Search Bar */}
                <div className="mt-space-md w-full max-w-2xl">
                  <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-md p-1.5 focus-within:shadow-xl transition-all border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[22px] ml-space-sm mr-space-xs">search</span>
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full py-2 bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline"
                      id="science-search"
                      placeholder="Search 500+ formulas, e.g. Molarity, Projectile, F=ma, pH..."
                      type="search"
                    />
                    <kbd className="hidden sm:inline-block px-2 py-1 bg-surface-container font-data-mono text-data-mono text-on-surface-variant rounded-md mr-space-xs">
                      /
                    </kbd>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-2xs mt-space-sm font-label-caps text-label-caps text-on-surface-variant">
                    <span className="font-semibold uppercase tracking-wider text-outline">Quick Pick:</span>
                    {['Density', 'Molarity', 'pH Buffer', 'Kinetic Energy', 'Ideal Gas Law', 'Punnett Square', 'Half-Life'].map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => quickFillSearch(term)}
                        className="px-space-xs py-1 rounded-md bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Metrics Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-space-sm bg-surface-container rounded-xl p-space-lg shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                    Live System Telemetry
                  </span>
                  <span className="inline-flex items-center gap-1 font-label-caps text-label-caps text-primary font-bold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Real-Time
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                    <div className="font-numerical-display text-headline-lg text-primary font-bold">500+</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Science Solvers</div>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                    <div className="font-numerical-display text-headline-lg text-secondary font-bold">30+</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Core Disciplines</div>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                    <div className="font-numerical-display text-headline-lg text-tertiary font-bold">22.4M</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Problems Solved</div>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                    <div className="font-numerical-display text-headline-lg text-on-surface font-bold">&lt; 1ms</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Instant Compute</div>
                  </div>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-high flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span>All formulas run directly on your browser. No data leaves your machine.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Goal Finder */}
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
              <div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                  Adaptive Exploration
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  What are you exploring or solving today?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Pick a scientific discipline to dive directly into interactive calculators, unit matrices, and guides.
                </p>
              </div>
              <span className="font-body-sm text-body-sm text-outline">8 Interactive Gateways</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                {
                  title: 'Solve Chemistry Problems',
                  desc: 'Molarity, stoichiometry, titration curves, pH buffer systems, and limiting reactants.',
                  count: '68 CALCULATORS',
                  color: 'primary',
                  icon: 'science',
                  href: '#cat-8'
                },
                {
                  title: 'Learn Physics',
                  desc: "Kinematics SUVAT, Newton's laws, work-energy, momentum, projectile motion, and circuits.",
                  count: '94 CALCULATORS',
                  color: 'secondary',
                  icon: 'rocket_launch',
                  href: '#cat-1'
                },
                {
                  title: 'Study Biology',
                  desc: 'Punnett squares, Hardy-Weinberg population genetics, enzyme kinetics, and cell doubling.',
                  count: '45 CALCULATORS',
                  color: 'tertiary',
                  icon: 'strikethrough_s',
                  href: '#cat-12'
                },
                {
                  title: 'Explore Earth Science',
                  desc: 'Richter scale energy, mineral density, hydrostatic pressure, elevation lapse rates.',
                  count: '32 CALCULATORS',
                  color: 'on-surface',
                  icon: 'public',
                  href: '#cat-16'
                },
                {
                  title: 'Study Astronomy',
                  desc: "Kepler's third law, orbital velocities, escape velocity, cosmological redshift, light-years.",
                  count: '36 CALCULATORS',
                  color: 'primary',
                  icon: 'stars',
                  href: '#cat-4'
                },
                {
                  title: 'Laboratory Results',
                  desc: 'Serial dilutions, Beer-Lambert spectrophotometry, PCR master mixes, centrifuge RPM to g-force.',
                  count: '42 CALCULATORS',
                  color: 'secondary',
                  icon: 'biotech',
                  href: '#cat-17'
                },
                {
                  title: 'Scientific Research',
                  desc: "Standard deviation, confidence intervals, Student's t-test, linear regression R² metrics.",
                  count: '50 CALCULATORS',
                  color: 'tertiary',
                  icon: 'analytics',
                  href: '#cat-18'
                },
                {
                  title: 'Environmental Studies',
                  desc: 'Solar radiation flux, AQI air quality indexes, carbon emissions, and water footprint models.',
                  count: '28 CALCULATORS',
                  color: 'primary',
                  icon: 'eco',
                  href: '#cat-15'
                }
              ].map(goal => (
                <a
                  key={goal.title}
                  className="group p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30"
                  href={goal.href}
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-space-sm group-hover:scale-110 transition-transform ${
                        goal.color === 'primary'
                          ? 'bg-primary-fixed text-primary'
                          : goal.color === 'secondary'
                          ? 'bg-secondary-fixed text-secondary'
                          : goal.color === 'tertiary'
                          ? 'bg-tertiary-fixed text-tertiary'
                          : 'bg-surface-variant text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined">{goal.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-2xs text-lg">
                      {goal.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {goal.desc}
                    </p>
                  </div>
                  <div
                    className={`mt-space-md pt-space-xs flex items-center justify-between font-label-caps text-label-caps font-semibold ${
                      goal.color === 'primary'
                        ? 'text-primary'
                        : goal.color === 'secondary'
                        ? 'text-secondary'
                        : goal.color === 'tertiary'
                        ? 'text-tertiary'
                        : 'text-on-surface'
                    }`}
                  >
                    <span>{goal.count}</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Flagship Live Workbenches */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface" id="workbenches">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-3xl mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                Interactive Workbenches
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Try Live Science Models
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Direct mathematical evaluations executing instantaneously right inside this viewport with dynamic variable re-computation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
              {/* Live Workbench 1: Density */}
              <div className="p-space-lg rounded-xl bg-surface-container shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary">scale</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Density &amp; Material Identifier
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono bg-surface-container-high px-2 py-0.5 rounded text-primary">
                      ρ = m / V
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Calculate volumetric mass density and match against typical reference tables for solids and liquids.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Mass (m)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-density-mass"
                          type="number"
                          step="any"
                          value={wbDensityMass}
                          onChange={e => setWbDensityMass(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">g</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Volume (V)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-density-vol"
                          type="number"
                          step="any"
                          value={wbDensityVol}
                          onChange={e => setWbDensityVol(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">cm³</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Computed Density (ρ)</span>
                    <div className="flex items-baseline gap-space-2xs">
                      <span className="font-numerical-display text-numerical-display text-primary font-bold" id="wb-density-result">
                        {densityResult.density}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant font-semibold">g/cm³</span>
                    </div>
                    <span className="font-data-mono text-data-mono text-outline" id="wb-density-equiv">
                      {densityResult.kgm3} kg/m³ | {densityResult.lbft3} lb/ft³
                    </span>
                  </div>
                  <div className="px-space-sm py-2 rounded bg-primary-fixed text-on-primary-fixed font-body-sm text-body-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span id="wb-density-material">{densityResult.material}</span>
                  </div>
                </div>
              </div>

              {/* Live Workbench 2: Molarity & Dilution */}
              <div className="p-space-lg rounded-xl bg-surface-container shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary">water_drop</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Solution Molarity &amp; Osmolarity
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono bg-surface-container-high px-2 py-0.5 rounded text-secondary">
                      M = mol / L
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Determine solution concentration from mass and molar weight (configured for standard Sodium Chloride NaCl).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Mass of Solute</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-mol-mass"
                          type="number"
                          step="any"
                          value={wbMolMass}
                          onChange={e => setWbMolMass(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">g</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Molar Mass (MW)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-mol-mw"
                          type="number"
                          step="any"
                          value={wbMolMw}
                          onChange={e => setWbMolMw(parseFloat(e.target.value) || 1)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">g/mol</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Solution Volume</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-mol-vol"
                          type="number"
                          step="any"
                          value={wbMolVol}
                          onChange={e => setWbMolVol(parseFloat(e.target.value) || 1)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">mL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Calculated Concentration</span>
                    <div className="flex items-baseline gap-space-2xs">
                      <span className="font-numerical-display text-numerical-display text-secondary font-bold" id="wb-mol-result">
                        {molarityResult.molarity}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant font-semibold">M (mol/L)</span>
                    </div>
                    <span className="font-data-mono text-data-mono text-outline" id="wb-mol-sub">
                      Moles: {molarityResult.moles} mol | Osmolarity: {molarityResult.osmolarity} Osm/L (NaCl)
                    </span>
                  </div>
                  <div className="px-space-sm py-2 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-body-sm text-body-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">opacity</span>
                    <span>Physiological Saline Stock</span>
                  </div>
                </div>
              </div>

              {/* Live Workbench 3: Kinetic Energy */}
              <div className="p-space-lg rounded-xl bg-surface-container shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-tertiary">speed</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Kinetic Energy &amp; Work
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono bg-surface-container-high px-2 py-0.5 rounded text-tertiary">
                      KE = ½mv²
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Interactive mechanical energy calculator illustrating dynamic velocity squared scaling.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Body Mass (m)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-ke-mass"
                          type="number"
                          step="any"
                          value={wbKeMass}
                          onChange={e => setWbKeMass(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">kg</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Velocity (v)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-ke-vel"
                          type="number"
                          step="any"
                          value={wbKeVel}
                          onChange={e => setWbKeVel(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">m/s</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Kinetic Energy</span>
                    <div className="flex items-baseline gap-space-2xs">
                      <span className="font-numerical-display text-numerical-display text-tertiary font-bold" id="wb-ke-result">
                        {keResult.kJ}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant font-semibold">kJ (kiloJoules)</span>
                    </div>
                    <span className="font-data-mono text-data-mono text-outline" id="wb-ke-equiv">
                      {keResult.joules} J | {keResult.kcal} kcal | {keResult.ftlb} ft·lbf
                    </span>
                  </div>
                  <div className="px-space-sm py-2 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-body-sm text-body-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>{keResult.kmh} km/h Vehicle Impact</span>
                  </div>
                </div>
              </div>

              {/* Live Workbench 4: Ideal Gas Law */}
              <div className="p-space-lg rounded-xl bg-surface-container shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary">cloud</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        Ideal Gas Equation (PV = nRT)
                      </h3>
                    </div>
                    <span className="font-data-mono text-data-mono bg-surface-container-high px-2 py-0.5 rounded text-primary">
                      R = 0.08206 L·atm/(mol·K)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Compute molar quantity or change variables to observe state behavior at standard temperature and pressure.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Pressure (P)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-gas-p"
                          type="number"
                          step="any"
                          value={wbGasP}
                          onChange={e => setWbGasP(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">atm</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Volume (V)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-gas-v"
                          type="number"
                          step="any"
                          value={wbGasV}
                          onChange={e => setWbGasV(parseFloat(e.target.value) || 0)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">L</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Temperature (T)</label>
                      <div className="flex bg-surface-container-lowest rounded-lg p-2 items-center border border-outline-variant/20">
                        <input
                          className="w-full bg-transparent font-data-mono text-data-mono text-on-surface focus:outline-none"
                          id="wb-gas-t"
                          type="number"
                          step="any"
                          value={wbGasT}
                          onChange={e => setWbGasT(parseFloat(e.target.value) || 1)}
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant">K</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Computed Amount of Substance (n)</span>
                    <div className="flex items-baseline gap-space-2xs">
                      <span className="font-numerical-display text-numerical-display text-primary font-bold" id="wb-gas-result">
                        {gasResult}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant font-semibold">mol</span>
                    </div>
                    <span className="font-data-mono text-data-mono text-outline">STP Conditions: 0 °C, 1.00 atm, 22.414 L/mol</span>
                  </div>
                  <div className="px-space-sm py-2 rounded bg-primary-fixed text-on-primary-fixed font-body-sm text-body-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Avogadro Molar Vol</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Complete 20-Category Science Directory */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low border-t border-outline-variant/20" id="science-directory">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-space-2xl gap-space-sm">
              <div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                  Comprehensive Directory
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  500+ Verified Science Calculators
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Curated across 20 disciplines with explicit variable inputs, conversion matrices, and standard references.
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-data-mono text-data-mono text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20">
                  20 Core Sections
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30"
                  id={cat.id}
                >
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          cat.badgeColor === 'primary'
                            ? 'bg-primary-fixed text-primary'
                            : cat.badgeColor === 'secondary'
                            ? 'bg-secondary-fixed text-secondary'
                            : 'bg-tertiary-fixed text-tertiary'
                        }`}
                      >
                        <span className="material-symbols-outlined">science</span>
                      </div>
                      <span
                        className={`font-label-caps text-label-caps uppercase font-bold px-2 py-0.5 rounded ${
                          cat.badgeColor === 'primary'
                            ? 'text-primary bg-primary-fixed/40'
                            : cat.badgeColor === 'secondary'
                            ? 'text-secondary bg-secondary-fixed/40'
                            : 'text-tertiary bg-tertiary-fixed/40'
                        }`}
                      >
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-xs text-lg">
                      {cat.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      {cat.desc}
                    </p>
                    <ul className="space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                      {cat.tools.map(tool => (
                        <li key={tool} className="hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer">
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              cat.badgeColor === 'primary'
                                ? 'text-primary'
                                : cat.badgeColor === 'secondary'
                                ? 'text-secondary'
                                : 'text-tertiary'
                            }`}
                          >
                            arrow_right
                          </span>{' '}
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    className={`mt-space-md pt-space-xs flex items-center gap-1 font-body-sm text-body-sm font-semibold ${
                      cat.badgeColor === 'primary'
                        ? 'text-primary'
                        : cat.badgeColor === 'secondary'
                        ? 'text-secondary'
                        : 'text-tertiary'
                    }`}
                    href="#workbenches"
                  >
                    <span>{cat.linkText}</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Interactive Learning Roadmaps */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-3xl mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                Curriculum Roadmaps
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Science Learning Pathways
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Structured progressions designed for AP/IB courses, undergraduate degrees, and independent laboratory research.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {/* Pathway 1 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-space-xs mb-space-sm">
                    <span className="material-symbols-outlined text-primary">rocket</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Physics Path</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    From kinematics to quantum electromagnetism.
                  </p>
                  <div className="space-y-2.5">
                    {[
                      '1D & 2D Kinematics',
                      'Newtonian Force & Momentum',
                      'Conservation of Energy',
                      'Thermodynamics & Optics',
                      'Electromagnetism & Relativity'
                    ].map((step, idx) => (
                      <div key={step} className="p-space-xs rounded-lg bg-surface-container-lowest flex items-center gap-2 border border-outline-variant/20">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-body-sm text-body-sm font-semibold">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-primary font-label-caps text-label-caps font-semibold">
                  5 MODULES • 94 CALCULATORS
                </div>
              </div>

              {/* Pathway 2 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-space-xs mb-space-sm">
                    <span className="material-symbols-outlined text-secondary">science</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Chemistry Path</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    From basic moles to dynamic reaction kinetics.
                  </p>
                  <div className="space-y-2.5">
                    {[
                      'Atomic Mass & Mole Concept',
                      'Reaction Stoichiometry',
                      'Solution Molarity & Dilutions',
                      'Acid-Base pH & Buffers',
                      'Chemical Equilibrium & ΔG'
                    ].map((step, idx) => (
                      <div key={step} className="p-space-xs rounded-lg bg-surface-container-lowest flex items-center gap-2 border border-outline-variant/20">
                        <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary font-label-caps text-label-caps flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-body-sm text-body-sm font-semibold">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-secondary font-label-caps text-label-caps font-semibold">
                  5 MODULES • 68 CALCULATORS
                </div>
              </div>

              {/* Pathway 3 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-space-xs mb-space-sm">
                    <span className="material-symbols-outlined text-tertiary">strikethrough_s</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Biology Path</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    From cell mitosis to ecosystem dynamics.
                  </p>
                  <div className="space-y-2.5">
                    {[
                      'Cell Division & Doubling',
                      'Mendelian Punnett Squares',
                      'Hardy-Weinberg Genetics',
                      'Enzyme Michaelis-Menten',
                      'Ecological Energy Transfer'
                    ].map((step, idx) => (
                      <div key={step} className="p-space-xs rounded-lg bg-surface-container-lowest flex items-center gap-2 border border-outline-variant/20">
                        <span className="w-5 h-5 rounded-full bg-tertiary text-on-tertiary font-label-caps text-label-caps flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-body-sm text-body-sm font-semibold">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-tertiary font-label-caps text-label-caps font-semibold">
                  5 MODULES • 45 CALCULATORS
                </div>
              </div>

              {/* Pathway 4 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-space-xs mb-space-sm">
                    <span className="material-symbols-outlined text-primary">stars</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">Astronomy Path</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    From solar system kinematics to deep cosmos.
                  </p>
                  <div className="space-y-2.5">
                    {[
                      'Gravitational Force',
                      'Kepler Planetary Orbits',
                      'Escape Velocity & Thrust',
                      'Stellar Magnitude & AU',
                      'Schwarzschild & Redshift'
                    ].map((step, idx) => (
                      <div key={step} className="p-space-xs rounded-lg bg-surface-container-lowest flex items-center gap-2 border border-outline-variant/20">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-body-sm text-body-sm font-semibold">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-primary font-label-caps text-label-caps font-semibold">
                  5 MODULES • 36 CALCULATORS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Smart Science Assistant & Recommender */}
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-5">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                  Custom Laboratory Bundle
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1 mb-space-xs">
                  Smart Science Assistant
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  Select your current academic focus or practical lab scenario to assemble recommended computational modules instantly.
                </p>
                <div className="flex flex-wrap gap-space-2xs">
                  {[
                    { key: 'chem', label: 'Chemistry Lab' },
                    { key: 'physics', label: 'AP Physics' },
                    { key: 'bio', label: 'Genetics & Bio' },
                    { key: 'astro', label: 'Astrophysics' }
                  ].map(btn => (
                    <button
                      key={btn.key}
                      onClick={() => setAssistantMode(btn.key as typeof assistantMode)}
                      className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm transition-all cursor-pointer ${
                        assistantMode === btn.key
                          ? 'bg-primary text-on-primary font-semibold shadow-sm'
                          : 'bg-surface-container hover:bg-primary/20 text-on-surface'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-surface-container p-space-lg rounded-xl border border-outline-variant/20">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                    Recommended Toolset for: <strong className="text-primary">{assistantData[assistantMode].title}</strong>
                  </span>
                  <span className="font-data-mono text-data-mono text-on-surface-variant text-body-sm">
                    4 Curated Tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  {assistantData[assistantMode].tools.map(tool => (
                    <div key={tool.title} className="p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                      <div className="font-body-sm text-body-sm font-semibold text-on-surface">{tool.title}</div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Core Formula Library & Visual Metrology */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-3xl mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                Standard Metrology
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Core Scientific Formula Library
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Validated mathematical descriptions with defined SI units, physical constants, and canonical forms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {/* Formula 1 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-data-mono text-headline-md text-primary font-bold mb-space-xs">F = m · a</div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-2xs text-base">
                    Newton's Second Law
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force.
                  </p>
                  <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-2 rounded-lg border border-outline-variant/20">
                    <div><strong>F:</strong> Net Force (Newtons, N)</div>
                    <div><strong>m:</strong> Inertial Mass (kg)</div>
                    <div><strong>a:</strong> Acceleration (m/s²)</div>
                  </div>
                </div>
                <div className="mt-space-md text-primary font-label-caps text-label-caps font-semibold">
                  CLASSICAL MECHANICS
                </div>
              </div>

              {/* Formula 2 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-data-mono text-headline-md text-secondary font-bold mb-space-xs">PV = nRT</div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-2xs text-base">
                    Ideal Gas Equation
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    Relates the macroscopic properties of an ideal gas sample under thermal equilibrium conditions.
                  </p>
                  <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-2 rounded-lg border border-outline-variant/20">
                    <div><strong>P:</strong> Absolute Pressure (atm or Pa)</div>
                    <div><strong>V:</strong> Enclosed Volume (L or m³)</div>
                    <div><strong>R:</strong> Universal Constant (8.314 J/mol·K)</div>
                  </div>
                </div>
                <div className="mt-space-md text-secondary font-label-caps text-label-caps font-semibold">
                  THERMODYNAMICS
                </div>
              </div>

              {/* Formula 3 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-data-mono text-headline-md text-tertiary font-bold mb-space-xs">pH = -log₁₀[H⁺]</div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-2xs text-base">
                    Sørensen pH Scale
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    Logarithmic measurement expressing the aqueous molar concentration of hydrogen / hydronium ions.
                  </p>
                  <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-2 rounded-lg border border-outline-variant/20">
                    <div><strong>[H+]:</strong> Hydronium Activity (mol/L)</div>
                    <div><strong>Neutral:</strong> 7.00 at 25 °C</div>
                    <div><strong>pOH:</strong> 14.00 - pH</div>
                  </div>
                </div>
                <div className="mt-space-md text-tertiary font-label-caps text-label-caps font-semibold">
                  AQUEOUS CHEMISTRY
                </div>
              </div>

              {/* Formula 4 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="font-data-mono text-headline-md text-on-surface font-bold mb-space-xs">p² + 2pq + q² = 1</div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-2xs text-base">
                    Hardy-Weinberg
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    Predicts allele and genotype frequencies in a stable population devoid of evolutionary influences.
                  </p>
                  <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-2 rounded-lg border border-outline-variant/20">
                    <div><strong>p:</strong> Dominant allele frequency</div>
                    <div><strong>q:</strong> Recessive allele frequency</div>
                    <div><strong>2pq:</strong> Heterozygous genotype</div>
                  </div>
                </div>
                <div className="mt-space-md text-on-surface font-label-caps text-label-caps font-semibold">
                  POPULATION GENETICS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Side-by-Side Scientific Comparisons */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-3xl mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                Conceptual Clarity
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Side-by-Side Science Comparisons
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Resolve frequent scientific confusions with concise, high-contrast definitions and dimensional differences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {/* Comparison 1 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Solutions</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">compare_arrows</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Molarity (M)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Moles solute per <strong>liter of total solution</strong>. Temperature dependent (thermal expansion).
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Molality (m)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Moles solute per <strong>kilogram of solvent</strong>. Invariant with temperature variations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison 2 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Mechanics</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">compare_arrows</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Mass (m)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Fundamental scalar property measuring amount of matter (kg). Invariant across gravity fields.
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Weight (W)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Gravitational force vector (W = mg) in Newtons (N). Changes on the Moon or in orbit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison 3 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">Kinematics</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">compare_arrows</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Speed</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Scalar magnitude rate of distance traveled over time regardless of heading (e.g. 60 km/h).
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Velocity</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Vector quantity indicating both speed and spatial direction vector (e.g. 60 km/h Due North).
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison 4 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Acids &amp; Bases</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">compare_arrows</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Strong Acid</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Dissociates 100% completely in water (e.g. HCl → H⁺ + Cl⁻), negligible equilibrium Ka.
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Weak Acid</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Reversibly and partially dissociates governed by an equilibrium constant Ka (e.g. Acetic acid).
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison 5 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Genetics</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">compare_arrows</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Genotype</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      The internal genetic makeup of alleles inherited for a trait (e.g. homozygous Bb or BB).
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Phenotype</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      The physical, observable manifestation of traits influenced by environment (e.g. brown eye color).
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparison 6 */}
              <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">Work &amp; Energy</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">compare_arrows</span>
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Energy (Joules)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      The capacity to perform physical work or generate heat. Stored or transferred capacity.
                    </p>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="font-body-sm text-body-sm font-bold text-on-surface">Power (Watts)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      The temporal rate at which work is performed or energy transformed (1 Watt = 1 Joule per second).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Step-by-Step Laboratory & Classroom Guides */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-3xl mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                Practicum Methodology
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Step-by-Step Laboratory Guides
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Clear, repeatable procedures for foundational laboratory calculations and error propagation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl">
              {/* Guide 1 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2 text-primary font-label-caps text-label-caps font-bold mb-space-xs">
                    <span className="material-symbols-outlined text-[18px]">biotech</span> GUIDE 01
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-sm text-lg">
                    How to Prepare a Solution from Stock
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    Step-by-step volumetric dilution method using the core equation M₁V₁ = M₂V₂.
                  </p>
                  <ol className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant list-decimal list-inside leading-relaxed">
                    <li>Identify target concentration (M₂) and final volume needed (V₂).</li>
                    <li>Rearrange to solve for stock aliquot: V₁ = (M₂ × V₂) / M₁.</li>
                    <li>Measure V₁ of stock accurately with a calibrated micropipette or volumetric pipette.</li>
                    <li>Transfer V₁ into a volumetric flask pre-filled with 50% solvent.</li>
                    <li>Bring flask carefully to the etched calibration meniscus and invert gently.</li>
                  </ol>
                </div>
                <div className="mt-space-md pt-space-xs bg-surface-container-lowest p-2 rounded-lg text-body-sm font-body-sm text-on-surface-variant border border-outline-variant/20">
                  <strong>Rule:</strong> Always add concentrated acid to water (&ldquo;AAA&rdquo;), never water directly into acid.
                </div>
              </div>

              {/* Guide 2 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2 text-secondary font-label-caps text-label-caps font-bold mb-space-xs">
                    <span className="material-symbols-outlined text-[18px]">calculate</span> GUIDE 02
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-sm text-lg">
                    How to Calculate Percent Error
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    Quantifying discrepancy between laboratory measurements and literature standards.
                  </p>
                  <ol className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant list-decimal list-inside leading-relaxed">
                    <li>Record your experimental laboratory mean value (Vₑ).</li>
                    <li>Look up standard accepted literature reference value (Vₐ).</li>
                    <li>Compute the absolute difference: |Vₑ - Vₐ|.</li>
                    <li>Divide absolute difference by the accepted reference: |Vₑ - Vₐ| / Vₐ.</li>
                    <li>Multiply by 100 to express uncertainty as a clean percentage value.</li>
                  </ol>
                </div>
                <div className="mt-space-md pt-space-xs bg-surface-container-lowest p-2 rounded-lg text-body-sm font-body-sm text-on-surface-variant border border-outline-variant/20">
                  <strong>Standard Formula:</strong> % Error = (|Experimental - Accepted| / Accepted) × 100%
                </div>
              </div>

              {/* Guide 3 */}
              <div className="p-space-lg rounded-xl bg-surface-container flex flex-col justify-between border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2 text-tertiary font-label-caps text-label-caps font-bold mb-space-xs">
                    <span className="material-symbols-outlined text-[18px]">sports_cricket</span> GUIDE 03
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-sm text-lg">
                    How to Solve 2D Projectiles
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    Decoupling planar motion into independent horizontal and vertical vectors.
                  </p>
                  <ol className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant list-decimal list-inside leading-relaxed">
                    <li>Resolve initial launch velocity into vectors: V₀ₓ = V₀ cos(θ), V₀y = V₀ sin(θ).</li>
                    <li>Set horizontal acceleration aₓ = 0 (constant horizontal velocity).</li>
                    <li>Set vertical acceleration ay = -g (-9.81 m/s²).</li>
                    <li>Solve vertical time of flight using: y = V₀y·t - ½gt².</li>
                    <li>Calculate horizontal range by multiplying horizontal speed: x = V₀ₓ × t.</li>
                  </ol>
                </div>
                <div className="mt-space-md pt-space-xs bg-surface-container-lowest p-2 rounded-lg text-body-sm font-body-sm text-on-surface-variant border border-outline-variant/20">
                  <strong>Key Insight:</strong> Time (t) is the unified link bridging both independent dimensions.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Frequently Asked Questions (FAQ) */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-max-width-calculator mx-auto">
            <div className="text-center mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                Frequently Asked Questions
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                Science Platform FAQ
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Everything you need to know about precision, international standards, and privacy.
              </p>
            </div>

            <div className="space-y-space-sm">
              {[
                {
                  id: 0,
                  q: 'Are SolveIt Science calculations calibrated against international metrology standards?',
                  icon: 'verified',
                  a: 'Yes. All physical constants (speed of light, Planck constant, gravitational constant, Avogadro constant) are strictly calibrated against the 2018 CODATA internationally recommended values and National Institute of Standards and Technology (NIST) databases.'
                },
                {
                  id: 1,
                  q: 'Is my homework, thesis data, or laboratory research kept private?',
                  icon: 'lock',
                  a: '100% private. All computations occur exclusively client-side in your local browser window. No figures, formulas, or numbers are ever transmitted, tracked, or stored on external cloud servers.'
                },
                {
                  id: 2,
                  q: 'Can these calculators be used offline during field trips or in disconnected labs?',
                  icon: 'cloud_off',
                  a: "Yes. Once this page loads, the computational logic resides in your browser's local memory. You can disconnect your network connection, calculate in remote field stations, or run experiments without interruption."
                },
                {
                  id: 3,
                  q: 'How does SolveIt handle significant figures and rounding errors?',
                  icon: 'rule',
                  a: 'Our calculators perform internal calculations using standard 64-bit IEEE floating-point precision to prevent intermediate truncation errors. Users can toggle display modes between high-precision scientific decimal notation and standard significant figure outputs.'
                },
                {
                  id: 4,
                  q: 'Is this platform free for schools, colleges, and educational districts?',
                  icon: 'school',
                  a: 'Yes. SolveIt is completely free without paywalls, sign-up requirements, or seat licenses. Teachers and students can bookmark and embed links directly inside syllabus modules, Google Classroom, Canvas, or Blackboard.'
                }
              ].map(faq => (
                <div key={faq.id} className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between text-left font-headline-md text-body-lg text-on-surface font-semibold focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {faq.icon}
                    </span>
                  </button>
                  {openFaqs[faq.id] && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed border-t border-surface-container pt-2">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* High-Authority Scientific Organizations Ribbon */}
        <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop bg-surface border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="text-body-sm font-body-sm text-on-surface-variant text-center md:text-left">
              Standard Constants &amp; Definitions Referenced From:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-lg font-label-caps text-label-caps font-semibold text-outline">
              <span className="hover:text-primary transition-colors cursor-pointer">NIST / CODATA</span>
              <span>•</span>
              <span className="hover:text-primary transition-colors cursor-pointer">IUPAC GOLD BOOK</span>
              <span>•</span>
              <span className="hover:text-primary transition-colors cursor-pointer">IUPAP PHYSICS</span>
              <span>•</span>
              <span className="hover:text-primary transition-colors cursor-pointer">NCBI GENBANK</span>
              <span>•</span>
              <span className="hover:text-primary transition-colors cursor-pointer">NASA HORIZONS</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
