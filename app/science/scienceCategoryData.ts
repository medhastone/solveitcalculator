export interface ScienceTool {
  id: string;
  name: string;
  description: string;
  href: string;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  formula?: string;
  inputs?: string[];
  output?: string;
}

export interface ScienceCategory {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  iconName: string;
  tools: ScienceTool[];
}

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: 'alkali' | 'alkaline' | 'transition' | 'post-transition' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble' | 'lanthanide' | 'actinide';
  period: number;
  group: number;
  valence: number;
}

export interface PhysicalConstant {
  symbol: string;
  name: string;
  value: string;
  unit: string;
  description: string;
  source: string;
}

export interface EMSpectrumBand {
  name: string;
  wavelengthRange: string;
  frequencyRange: string;
  photonEnergyRange: string;
  applications: string;
}

export interface SIPrefix {
  prefix: string;
  symbol: string;
  factor: string;
  decimal: string;
  name: string;
}

export interface AcademicWorkbench {
  id: string;
  title: string;
  audience: string;
  description: string;
  icon: string;
  toolSlugs: string[];
}

export interface ScienceFaq {
  question: string;
  answer: string;
}

export const SCIENCE_CATEGORIES: ScienceCategory[] = [
  {
    id: 'classical-mechanics',
    name: 'Classical Mechanics & Physics',
    slug: 'classical-mechanics',
    tagline: 'Kinematics, Newton’s laws, projectile trajectories, and rotational dynamics',
    description:
      'Solve linear motion, 2D projectile physics, circular velocity, gravitational attraction, kinetic and potential energy, and momentum conservation.',
    iconName: 'Orbit',
    tools: [
      {
        id: 'projectile-motion-calculator',
        name: '2D Projectile Motion Calculator',
        description: 'Calculate maximum trajectory height, flight time, horizontal range, and impact velocity.',
        href: '/science/projectile-motion-calculator',
        badge: 'Mechanics',
        isPopular: true,
        isFeatured: true,
        formula: 'R = (v₀² × sin(2θ)) / g',
        inputs: ['Initial Velocity (m/s)', 'Launch Angle (°)', 'Initial Height (m)', 'Gravity (m/s²)'],
        output: 'Max Height (m), Flight Time (s), Range (m), Impact Speed (m/s)',
      },
      {
        id: 'kinematics-solver',
        name: 'Kinematics Motion Equations Solver',
        description: 'Solve the 4 kinematic equations of constant acceleration for displacement, velocity, time, or acceleration.',
        href: '/science/kinematics-calculator',
        badge: 'Core Physics',
        isPopular: true,
        isFeatured: true,
        formula: 'v = v₀ + at,  Δx = v₀t + ½at²,  v² = v₀² + 2aΔx',
        inputs: ['Initial Velocity (v₀)', 'Final Velocity (v)', 'Acceleration (a)', 'Time (t)', 'Distance (Δx)'],
        output: 'Selected Unknown Motion Variables',
      },
      {
        id: 'newtons-second-law-calculator',
        name: 'Newton’s Second Law (F = ma) & Momentum',
        description: 'Calculate net force, mass, acceleration, momentum (p = mv), and impulse (J = FΔt).',
        href: '/science/newtons-law-calculator',
        isPopular: true,
        formula: 'F = m × a,  p = m × v',
        inputs: ['Mass (kg)', 'Acceleration (m/s²)', 'Velocity (m/s)'],
        output: 'Net Force (N), Linear Momentum (kg·m/s)',
      },
      {
        id: 'kinetic-potential-energy-calculator',
        name: 'Kinetic & Potential Energy Calculator',
        description: 'Compute translational kinetic energy (½mv²), gravitational potential energy (mgh), and spring PE (½kx²).',
        href: '/science/energy-calculator',
        isPopular: true,
        formula: 'KE = ½mv²,  PE = mgh',
        inputs: ['Mass (kg)', 'Velocity (m/s)', 'Height (m)', 'Spring Constant (N/m)'],
        output: 'Kinetic Energy (J), Gravitational PE (J), Total Mechanical Energy (J)',
      },
      {
        id: 'centripetal-force-calculator',
        name: 'Centripetal Force & Circular Acceleration',
        description: 'Determine centripetal acceleration, angular velocity (ω), and inward radial force for curved motion.',
        href: '/science/centripetal-force-calculator',
        formula: 'F_c = (m × v²) / r = m × ω² × r',
        inputs: ['Mass (kg)', 'Radius (m)', 'Velocity (m/s)'],
        output: 'Centripetal Force (N), Centripetal Acceleration (m/s²)',
      },
      {
        id: 'torque-rotational-dynamics-calculator',
        name: 'Torque & Rotational Inertia Calculator',
        description: 'Calculate rotational torque (τ = rFsinθ), moment of inertia for standard geometries, and angular acceleration.',
        href: '/science/torque-calculator',
        formula: 'τ = r × F × sin(θ) = I × α',
        inputs: ['Lever Arm (m)', 'Applied Force (N)', 'Angle (°)', 'Moment of Inertia (kg·m²)'],
        output: 'Net Torque (N·m), Angular Acceleration (rad/s²)',
      },
      {
        id: 'simple-harmonic-motion-calculator',
        name: 'Pendulum & Spring Harmonic Motion (SHM)',
        description: 'Calculate oscillation period (T), resonant frequency (f), and angular frequency (ω) for pendulums and springs.',
        href: '/science/harmonic-motion-calculator',
        formula: 'T_pendulum = 2π√(L/g),  T_spring = 2π√(m/k)',
        inputs: ['Length (m) / Mass (kg)', 'Spring Constant (N/m)', 'Gravity (m/s²)'],
        output: 'Period (s), Frequency (Hz), Angular Frequency (rad/s)',
      },
    ],
  },
  {
    id: 'chemistry-stoichiometry',
    name: 'Chemistry, Solutions & Stoichiometry',
    slug: 'chemistry-stoichiometry',
    tagline: 'Molar mass, molarity, solution dilutions, and pH buffer chemistry',
    description:
      'Perform chemical laboratory calculations including molar mass determination, molarity dilutions (M₁V₁ = M₂V₂), acid-base pH, and stoichiometry yields.',
    iconName: 'FlaskConical',
    tools: [
      {
        id: 'molar-mass-calculator',
        name: 'Molar Mass & Molecular Weight Calculator',
        description: 'Calculate total molar mass (g/mol) and element mass percentages from any chemical formula.',
        href: '/science/molar-mass-calculator',
        badge: 'Chemistry Core',
        isPopular: true,
        isFeatured: true,
        formula: 'M = Σ (Atomic Mass_i × Subscript_i)',
        inputs: ['Chemical Formula (e.g. C6H12O6, H2SO4, Fe2(SO4)3)'],
        output: 'Molar Mass (g/mol), Elemental Percentage Breakdown',
      },
      {
        id: 'molarity-solution-calculator',
        name: 'Molarity & Solution Concentration Calculator',
        description: 'Determine solution molarity (M), mass of solute required, or final solution volume.',
        href: '/science/molarity-calculator',
        badge: 'Lab Tool',
        isPopular: true,
        isFeatured: true,
        formula: 'M = moles of solute / Liters of solution',
        inputs: ['Solute Mass (g)', 'Molar Mass (g/mol)', 'Volume (mL or L)'],
        output: 'Molarity (mol/L or M), Total Moles',
      },
      {
        id: 'solution-dilution-calculator',
        name: 'Serial Dilution Calculator (M₁V₁ = M₂V₂)',
        description: 'Calculate initial or final stock concentrations and required solvent aliquot volumes.',
        href: '/science/dilution-calculator',
        isPopular: true,
        formula: 'C₁ × V₁ = C₂ × V₂',
        inputs: ['Stock Concentration (C₁)', 'Stock Volume (V₁)', 'Target Concentration (C₂)', 'Target Volume (V₂)'],
        output: 'Unknown Concentration or Volume, Dilution Factor',
      },
      {
        id: 'ph-poh-calculator',
        name: 'pH, pOH & Hydronium Concentration Calculator',
        description: 'Convert between pH, pOH, [H⁺] / [H₃O⁺], and [OH⁻] concentrations for strong and weak acids/bases.',
        href: '/science/ph-calculator',
        isPopular: true,
        formula: 'pH = -log₁₀[H⁺],  pH + pOH = 14',
        inputs: ['pH or [H⁺] (mol/L) or [OH⁻] (mol/L)'],
        output: 'pH, pOH, [H⁺] Concentration, [OH⁻] Concentration, Acid/Base Classification',
      },
      {
        id: 'percent-yield-calculator',
        name: 'Theoretical & Percent Yield Calculator',
        description: 'Calculate stoichiometric limiting reactant theoretical yields and experimental percent recovery.',
        href: '/science/percent-yield-calculator',
        formula: 'Percent Yield = (Actual Yield / Theoretical Yield) × 100%',
        inputs: ['Actual Experimental Yield (g)', 'Theoretical Calculated Yield (g)'],
        output: 'Percent Yield (%), Mass Deficit (g)',
      },
      {
        id: 'henderson-hasselbalch-calculator',
        name: 'Buffer Solutions & Henderson-Hasselbalch',
        description: 'Calculate buffer solution pH from acid dissociation constant (pKa) and conjugate base/acid ratio.',
        href: '/science/buffer-ph-calculator',
        formula: 'pH = pK_a + log₁₀([A⁻] / [HA])',
        inputs: ['Acid pKa', 'Conjugate Base Concentration [A⁻]', 'Weak Acid Concentration [HA]'],
        output: 'Buffer pH, Buffer Capacity Assessment',
      },
    ],
  },
  {
    id: 'thermodynamics-fluids',
    name: 'Thermodynamics & Fluid Dynamics',
    slug: 'thermodynamics-fluids',
    tagline: 'Ideal Gas Law, heat transfer, Bernoulli fluid flow, and thermal expansion',
    description:
      'Thermodynamic state equations, specific heat capacity ($Q = mc\Delta T$), Bernoulli fluid pressure, Reynolds number, and thermal expansion.',
    iconName: 'Flame',
    tools: [
      {
        id: 'ideal-gas-law-calculator',
        name: 'Ideal Gas Law Solver (PV = nRT)',
        description: 'Solve for pressure (P), volume (V), moles (n), or absolute temperature (T) under standard gas constants.',
        href: '/science/ideal-gas-law-calculator',
        badge: 'Thermodynamics',
        isPopular: true,
        isFeatured: true,
        formula: 'P × V = n × R × T',
        inputs: ['Pressure (atm/kPa)', 'Volume (L/m³)', 'Moles (mol)', 'Temperature (°C/K)'],
        output: 'Unknown State Variable, Standard Molar Volume',
      },
      {
        id: 'specific-heat-capacity-calculator',
        name: 'Heat Transfer & Specific Heat (Q = mcΔT)',
        description: 'Calculate thermal energy required to change temperature across water, metals, and gases.',
        href: '/science/specific-heat-calculator',
        isPopular: true,
        formula: 'Q = m × c × ΔT',
        inputs: ['Mass (kg)', 'Specific Heat Capacity c (J/kg·K)', 'Initial Temp (°C)', 'Final Temp (°C)'],
        output: 'Thermal Heat Energy Q (Joules / kJ / kcal)',
      },
      {
        id: 'bernoulli-equation-calculator',
        name: 'Bernoulli Fluid Flow & Pressure Calculator',
        description: 'Apply the conservation of energy in flowing fluids to compute static pressure, dynamic pressure, and flow velocity.',
        href: '/science/bernoulli-calculator',
        formula: 'P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂',
        inputs: ['Fluid Density ρ (kg/m³)', 'Velocity v₁ (m/s)', 'Pressure P₁ (kPa)', 'Height h (m)'],
        output: 'Downstream Pressure P₂, Dynamic Velocity v₂',
      },
      {
        id: 'reynolds-number-calculator',
        name: 'Reynolds Number & Pipe Flow Regime',
        description: 'Determine laminar versus turbulent fluid flow regimes in pipes and open channels.',
        href: '/science/reynolds-number-calculator',
        formula: 'Re = (ρ × v × D) / μ = (v × D) / ν',
        inputs: ['Fluid Density (kg/m³)', 'Flow Velocity (m/s)', 'Hydraulic Diameter (m)', 'Dynamic Viscosity (Pa·s)'],
        output: 'Reynolds Number (Re), Flow Regime (Laminar / Transitional / Turbulent)',
      },
      {
        id: 'thermal-expansion-calculator',
        name: 'Linear & Volumetric Thermal Expansion',
        description: 'Model dimensional expansion and thermal stress in structural materials across temperature swings.',
        href: '/science/thermal-expansion-calculator',
        formula: 'ΔL = α × L₀ × ΔT,  ΔV = β × V₀ × ΔT',
        inputs: ['Initial Length (m)', 'Coefficient of Linear Expansion α (1/K)', 'Temperature Change ΔT (°C)'],
        output: 'Change in Length ΔL (mm), Final Length (m)',
      },
    ],
  },
  {
    id: 'astronomy-space-physics',
    name: 'Astronomy, Gravitation & Space Physics',
    slug: 'astronomy-space-physics',
    tagline: 'Orbital velocity, escape velocity, Kepler’s third law, and celestial bodies',
    description:
      'Compute orbital velocity, gravitational forces between celestial bodies ($F = G M_1 M_2 / r^2$), escape velocities, and planetary surface gravity.',
    iconName: 'Telescope',
    tools: [
      {
        id: 'orbital-velocity-calculator',
        name: 'Orbital Velocity & Period Calculator',
        description: 'Calculate circular orbital speed and orbital period around Earth, Mars, Jupiter, or custom stellar bodies.',
        href: '/science/orbital-velocity-calculator',
        badge: 'Astrophysics',
        isPopular: true,
        isFeatured: true,
        formula: 'v = √(G × M / r),  T = 2π × √(r³ / (G × M))',
        inputs: ['Central Body Mass (kg)', 'Orbital Altitude (km)', 'Body Radius (km)'],
        output: 'Orbital Velocity (km/s), Orbital Period (Hours/Mins)',
      },
      {
        id: 'escape-velocity-calculator',
        name: 'Escape Velocity Calculator',
        description: 'Determine the minimum speed required for an unpropelled projectile to escape a celestial body’s gravitational field.',
        href: '/science/escape-velocity-calculator',
        badge: 'Space Flight',
        isPopular: true,
        formula: 'v_e = √(2 × G × M / r)',
        inputs: ['Planet/Moon Mass (kg)', 'Surface Radius (km)'],
        output: 'Escape Velocity (km/s, mph, Mach)',
      },
      {
        id: 'newtons-universal-gravitation-calculator',
        name: 'Newton’s Universal Law of Gravitation',
        description: 'Calculate mutual gravitational attraction force between any two masses across astronomical distances.',
        href: '/science/gravitation-calculator',
        isPopular: true,
        formula: 'F = G × (m₁ × m₂) / r²',
        inputs: ['Mass 1 (kg)', 'Mass 2 (kg)', 'Center-to-Center Distance (m or AU)'],
        output: 'Gravitational Force (N), Gravitational Field Strength (m/s²)',
      },
      {
        id: 'keplers-third-law-calculator',
        name: 'Kepler’s Third Law of Planetary Motion',
        description: 'Relate semi-major orbital axis distance (a) to orbital period (T) for planets and exoplanets.',
        href: '/science/keplers-law-calculator',
        formula: 'T² = (4π² / (G(M₁ + M₂))) × a³',
        inputs: ['Semi-Major Axis (AU or km)', 'Stellar Host Mass (Solar Masses)'],
        output: 'Orbital Period (Earth Years / Days)',
      },
      {
        id: 'surface-gravity-calculator',
        name: 'Planetary Surface Gravity & Weight Calculator',
        description: 'Calculate local surface gravity acceleration ($g = GM/r^2$) and compare human body weight across all solar system bodies.',
        href: '/science/surface-gravity-calculator',
        formula: 'g = (G × M) / r²',
        inputs: ['Planetary Mass (kg)', 'Planetary Radius (km)', 'Earth Weight (kg or lbs)'],
        output: 'Surface Gravity g (m/s²), g-factor (relative to Earth), Surface Weight',
      },
    ],
  },
  {
    id: 'quantum-nuclear-physics',
    name: 'Quantum, Atomic & Nuclear Physics',
    slug: 'quantum-nuclear-physics',
    tagline: 'Photon energy, de Broglie wavelength, radioactive half-life decay, and mass-energy',
    description:
      'Quantum mechanics equations ($E = h\nu$), de Broglie particle-wave duality, radioactive decay law ($N(t) = N_0 e^{-\lambda t}$), and Einstein’s $E = mc^2$.',
    iconName: 'Atom',
    tools: [
      {
        id: 'photon-energy-wavelength-calculator',
        name: 'Photon Energy, Frequency & Wavelength Calculator',
        description: 'Convert between photon wavelength (nm), frequency (Hz), and quantum energy (Joules and electron-volts eV).',
        href: '/science/photon-energy-calculator',
        badge: 'Quantum',
        isPopular: true,
        isFeatured: true,
        formula: 'E = h × ν = (h × c) / λ',
        inputs: ['Wavelength (nm / μm / m) or Frequency (Hz / THz)'],
        output: 'Photon Energy (Joules & eV), Wave Number (cm⁻¹), Spectral Color',
      },
      {
        id: 'radioactive-decay-half-life-calculator',
        name: 'Radioactive Decay & Half-Life Calculator',
        description: 'Model exponential radionuclide decay, remaining isotope mass, activity in Becquerels (Bq), and radiocarbon age.',
        href: '/science/half-life-calculator',
        badge: 'Nuclear',
        isPopular: true,
        isFeatured: true,
        formula: 'N(t) = N₀ × (½)^(t / t½) = N₀ × e^(-λt)',
        inputs: ['Initial Mass (g or Bq)', 'Half-Life (Years/Days)', 'Elapsed Time (Years/Days)'],
        output: 'Remaining Mass, Decayed Fraction %, Decay Constant λ',
      },
      {
        id: 'de-broglie-wavelength-calculator',
        name: 'de Broglie Matter Wave Calculator',
        description: 'Calculate quantum matter wavelength for moving electrons, protons, neutrons, or macro particles.',
        href: '/science/de-broglie-calculator',
        formula: 'λ = h / p = h / (m × v)',
        inputs: ['Particle Mass (kg)', 'Velocity (m/s) or Kinetic Energy (eV)'],
        output: 'de Broglie Wavelength (pm / nm / Ångströms)',
      },
      {
        id: 'mass-energy-equivalence-calculator',
        name: 'Mass-Energy Equivalence (E = mc²)',
        description: 'Calculate rest energy released from mass conversion in nuclear fusion, fission, or antimatter annihilation.',
        href: '/science/mass-energy-calculator',
        formula: 'E = m × c²',
        inputs: ['Converted Mass (g / kg / atomic mass units u)'],
        output: 'Total Energy Output (Joules, kWh, Megatons of TNT)',
      },
      {
        id: 'rydberg-formula-hydrogen-calculator',
        name: 'Rydberg Formula for Hydrogen Spectral Lines',
        description: 'Calculate emitted and absorbed photon wavelengths across Lyman, Balmer, Paschen, and Brackett series.',
        href: '/science/rydberg-calculator',
        formula: '1/λ = R_H × (1/n₁² - 1/n₂²)',
        inputs: ['Lower Energy Level (n₁)', 'Upper Energy Level (n₂)'],
        output: 'Transition Wavelength (nm), Spectral Series Name, Photon Energy (eV)',
      },
    ],
  },
  {
    id: 'electromagnetism-optics',
    name: 'Electromagnetism, Waves & Optics',
    slug: 'electromagnetism-optics',
    tagline: 'Coulomb’s law, Snell’s law refraction, thin lens equation, and wave speed',
    description:
      'Electrostatic force ($F = k_e q_1 q_2 / r^2$), Snell’s law of light refraction ($n_1 \sin\theta_1 = n_2 \sin\theta_2$), focal lengths, and Doppler wave shift.',
    iconName: 'Zap',
    tools: [
      {
        id: 'snells-law-refraction-calculator',
        name: 'Snell’s Law of Refraction & Critical Angle',
        description: 'Calculate angle of refraction, refractive indices, and total internal reflection (TIR) critical angle for optical media.',
        href: '/science/snells-law-calculator',
        badge: 'Optics',
        isPopular: true,
        isFeatured: true,
        formula: 'n₁ × sin(θ₁) = n₂ × sin(θ₂),  θ_crit = arcsin(n₂ / n₁)',
        inputs: ['Medium 1 Index (n₁)', 'Medium 2 Index (n₂)', 'Incident Angle (θ₁)'],
        output: 'Refracted Angle (θ₂), Critical Angle (θ_crit), TIR State',
      },
      {
        id: 'thin-lens-equation-calculator',
        name: 'Thin Lens & Mirror Equation Calculator',
        description: 'Determine image distance, focal length, and optical magnification ($M = -d_i / d_o$) for convex/concave lenses.',
        href: '/science/thin-lens-calculator',
        isPopular: true,
        formula: '1/f = 1/d_o + 1/d_i,  M = -d_i / d_o',
        inputs: ['Object Distance d_o (cm)', 'Focal Length f (cm)'],
        output: 'Image Distance d_i (cm), Magnification M, Image Type (Real/Virtual, Inverted/Upright)',
      },
      {
        id: 'coulombs-law-calculator',
        name: 'Coulomb’s Law Electrostatic Force Calculator',
        description: 'Compute attraction or repulsion force between electrostatic charges in vacuum or dielectric mediums.',
        href: '/science/coulombs-law-calculator',
        formula: 'F = k_e × (|q₁ × q₂|) / r²',
        inputs: ['Charge 1 q₁ (μC)', 'Charge 2 q₂ (μC)', 'Separation Distance r (m)'],
        output: 'Electrostatic Force (N), Interaction Type (Repulsion / Attraction)',
      },
      {
        id: 'doppler-effect-wave-calculator',
        name: 'Doppler Effect Wave Frequency Shift',
        description: 'Calculate observed sound and light frequencies for moving sources, moving observers, or cosmological redshift.',
        href: '/science/doppler-effect-calculator',
        formula: 'f_obs = f_src × ((v ± v_obs) / (v ∓ v_src))',
        inputs: ['Emitted Frequency (Hz)', 'Wave Speed v (m/s)', 'Source Speed (m/s)', 'Observer Speed (m/s)'],
        output: 'Observed Frequency (Hz), Pitch Shift Factor, Relative Velocity',
      },
    ],
  },
  {
    id: 'biology-earth-science',
    name: 'Biology, Genetics & Environmental Science',
    slug: 'biology-earth-science',
    tagline: 'Hardy-Weinberg equilibrium, doubling time, bacterial growth, and air density',
    description:
      'Population genetics allele frequencies ($p^2 + 2pq + q^2 = 1$), exponential bacterial culture doubling, barometric air density, and atmospheric pressure.',
    iconName: 'Dna',
    tools: [
      {
        id: 'hardy-weinberg-calculator',
        name: 'Hardy-Weinberg Equilibrium & Allele Frequency',
        description: 'Calculate dominant (p) and recessive (q) allele frequencies, homozygous, and heterozygous genotype proportions.',
        href: '/science/hardy-weinberg-calculator',
        badge: 'Genetics',
        isPopular: true,
        isFeatured: true,
        formula: 'p + q = 1,  p² + 2pq + q² = 1',
        inputs: ['Recessive Genotype Frequency (q²) or Recessive Phenotype Count'],
        output: 'Allele Frequency p and q, Homozygous Dominant (p²), Heterozygous (2pq)',
      },
      {
        id: 'bacterial-growth-doubling-calculator',
        name: 'Exponential Bacterial Growth & Generation Time',
        description: 'Model microbial culture colony growth over time, generation doubling intervals, and specific growth rates.',
        href: '/science/bacterial-growth-calculator',
        formula: 'N(t) = N₀ × 2^(t / g) = N₀ × e^(μt)',
        inputs: ['Initial Population (N₀)', 'Doubling Time (Hours/Mins)', 'Incubation Time (Hours)'],
        output: 'Final Population N(t), Number of Generations, Growth Rate Constant μ',
      },
      {
        id: 'barometric-formula-altitude-calculator',
        name: 'Barometric Formula & Atmospheric Pressure vs Altitude',
        description: 'Model atmospheric air pressure, air density, and boiling point of water at any elevation above sea level.',
        href: '/science/barometric-formula-calculator',
        formula: 'P = P₀ × exp(-(M × g × h) / (R × T))',
        inputs: ['Altitude above Sea Level (m or ft)', 'Sea-Level Temp (°C)'],
        output: 'Atmospheric Pressure (kPa / atm / mmHg), Air Density (kg/m³), Water Boiling Point (°C)',
      },
    ],
  },
];

export const PERIODIC_TABLE_ELEMENTS: ChemicalElement[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'nonmetal', period: 1, group: 1, valence: 1 },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'noble', period: 1, group: 18, valence: 2 },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'alkali', period: 2, group: 1, valence: 1 },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'alkaline', period: 2, group: 2, valence: 2 },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'metalloid', period: 2, group: 13, valence: 3 },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'nonmetal', period: 2, group: 14, valence: 4 },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'nonmetal', period: 2, group: 15, valence: 5 },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'nonmetal', period: 2, group: 16, valence: 6 },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'halogen', period: 2, group: 17, valence: 7 },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.18, category: 'noble', period: 2, group: 18, valence: 8 },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.99, category: 'alkali', period: 3, group: 1, valence: 1 },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'alkaline', period: 3, group: 2, valence: 2 },
  { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.982, category: 'post-transition', period: 3, group: 13, valence: 3 },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'metalloid', period: 3, group: 14, valence: 4 },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'nonmetal', period: 3, group: 15, valence: 5 },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'nonmetal', period: 3, group: 16, valence: 6 },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'halogen', period: 3, group: 17, valence: 7 },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'noble', period: 3, group: 18, valence: 8 },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'alkali', period: 4, group: 1, valence: 1 },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'alkaline', period: 4, group: 2, valence: 2 },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'transition', period: 4, group: 8, valence: 2 },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'transition', period: 4, group: 11, valence: 2 },
  { number: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, category: 'transition', period: 4, group: 12, valence: 2 },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'transition', period: 5, group: 11, valence: 1 },
  { number: 53, symbol: 'I', name: 'Iodine', mass: 126.9, category: 'halogen', period: 5, group: 17, valence: 7 },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'transition', period: 6, group: 11, valence: 1 },
  { number: 80, symbol: 'Hg', name: 'Mercury', mass: 200.59, category: 'transition', period: 6, group: 12, valence: 2 },
  { number: 82, symbol: 'Pb', name: 'Lead', mass: 207.2, category: 'post-transition', period: 6, group: 14, valence: 4 },
  { number: 92, symbol: 'U', name: 'Uranium', mass: 238.03, category: 'actinide', period: 7, group: 3, valence: 6 },
];

export const PHYSICAL_CONSTANTS: PhysicalConstant[] = [
  {
    symbol: 'c',
    name: 'Speed of Light in Vacuum',
    value: '299,792,458',
    unit: 'm / s',
    description: 'Fundamental speed limit of spacetime and electromagnetic wave propagation.',
    source: 'NIST CODATA 2022 (Exact)',
  },
  {
    symbol: 'G',
    name: 'Newtonian Gravitational Constant',
    value: '6.67430 × 10⁻¹¹',
    unit: 'm³ / (kg · s²)',
    description: 'Proportionality factor in Newton’s law of universal gravitation and Einstein’s Field Equations.',
    source: 'NIST CODATA 2022',
  },
  {
    symbol: 'h',
    name: 'Planck Constant',
    value: '6.62607015 × 10⁻³⁴',
    unit: 'J · s',
    description: 'Relates photon frequency to quantum energy in quantum mechanics (Exact SI Definition).',
    source: 'NIST CODATA 2022 (Exact)',
  },
  {
    symbol: 'ℏ',
    name: 'Reduced Planck Constant (h-bar)',
    value: '1.054571817 × 10⁻³⁴',
    unit: 'J · s',
    description: 'Quantum of angular momentum: ℏ = h / (2π).',
    source: 'NIST CODATA 2022',
  },
  {
    symbol: 'k_B',
    name: 'Boltzmann Constant',
    value: '1.380649 × 10⁻²³',
    unit: 'J / K',
    description: 'Relates average kinetic energy of particles in a gas with thermodynamic temperature.',
    source: 'NIST CODATA 2022 (Exact)',
  },
  {
    symbol: 'N_A',
    name: 'Avogadro Constant',
    value: '6.02214076 × 10²³',
    unit: 'mol⁻¹',
    description: 'Number of constituent particles in one mole of any chemical substance.',
    source: 'NIST CODATA 2022 (Exact)',
  },
  {
    symbol: 'e',
    name: 'Elementary Charge',
    value: '1.602176634 × 10⁻¹⁹',
    unit: 'C (Coulombs)',
    description: 'Electric charge carried by a single proton or magnitude of charge on an electron.',
    source: 'NIST CODATA 2022 (Exact)',
  },
  {
    symbol: 'm_e',
    name: 'Electron Rest Mass',
    value: '9.1093837015 × 10⁻³¹',
    unit: 'kg',
    description: 'Rest mass of a fundamental electron (equivalent to 0.510998950 MeV/c²).',
    source: 'NIST CODATA 2022',
  },
  {
    symbol: 'R',
    name: 'Universal Molar Gas Constant',
    value: '8.314462618',
    unit: 'J / (mol · K)',
    description: 'Constant of proportionality in Ideal Gas Law: R = N_A × k_B.',
    source: 'NIST CODATA 2022 (Exact)',
  },
  {
    symbol: 'ε₀',
    name: 'Vacuum Electric Permittivity',
    value: '8.8541878128 × 10⁻¹²',
    unit: 'F / m',
    description: 'Capability of vacuum space to permit electric field lines.',
    source: 'NIST CODATA 2022',
  },
];

export const EM_SPECTRUM_BANDS: EMSpectrumBand[] = [
  {
    name: 'Radio Waves',
    wavelengthRange: '> 1 mm (up to 100,000 km)',
    frequencyRange: '< 300 GHz',
    photonEnergyRange: '< 1.24 meV',
    applications: 'AM/FM broadcasting, cellular LTE/5G, Wi-Fi, radio astronomy (VLA, ALMA).',
  },
  {
    name: 'Microwaves',
    wavelengthRange: '1 mm – 1 m',
    frequencyRange: '300 MHz – 300 GHz',
    photonEnergyRange: '1.24 μeV – 1.24 meV',
    applications: 'Radar navigation, satellite communications, microwave ovens, cosmic microwave background (CMB).',
  },
  {
    name: 'Infrared (IR)',
    wavelengthRange: '750 nm – 1 mm',
    frequencyRange: '300 GHz – 400 THz',
    photonEnergyRange: '1.24 meV – 1.65 eV',
    applications: 'Thermal imaging, night vision, fiber optic telecommunications, James Webb Space Telescope (JWST).',
  },
  {
    name: 'Visible Light',
    wavelengthRange: '380 nm – 750 nm',
    frequencyRange: '400 THz – 790 THz',
    photonEnergyRange: '1.65 eV – 3.26 eV',
    applications: 'Human vision, photosynthesis, optical microscopy, laser surgery, RGB color spectrum.',
  },
  {
    name: 'Ultraviolet (UV)',
    wavelengthRange: '10 nm – 380 nm',
    frequencyRange: '790 THz – 30 PHz',
    photonEnergyRange: '3.26 eV – 124 eV',
    applications: 'Sterilization/germicidal lamps, semiconductor photolithography, blacklights, vitamin D synthesis.',
  },
  {
    name: 'X-Rays',
    wavelengthRange: '0.01 nm – 10 nm',
    frequencyRange: '30 PHz – 30 EHz',
    photonEnergyRange: '124 eV – 124 keV',
    applications: 'Medical radiography (CT scans, dental), airport baggage security, X-ray crystallography.',
  },
  {
    name: 'Gamma Rays',
    wavelengthRange: '< 0.01 nm (10 pm)',
    frequencyRange: '> 30 EHz',
    photonEnergyRange: '> 124 keV (up to TeV)',
    applications: 'Radiation cancer therapy, radioactive decay tracing, supernova astrophysics, nuclear fission reactions.',
  },
];

export const SI_PREFIXES: SIPrefix[] = [
  { prefix: 'giga', symbol: 'G', factor: '10⁹', decimal: '1,000,000,000', name: 'Billion' },
  { prefix: 'mega', symbol: 'M', factor: '10⁶', decimal: '1,000,000', name: 'Million' },
  { prefix: 'kilo', symbol: 'k', factor: '10³', decimal: '1,000', name: 'Thousand' },
  { prefix: 'hecto', symbol: 'h', factor: '10²', decimal: '100', name: 'Hundred' },
  { prefix: 'deca', symbol: 'da', factor: '10¹', decimal: '10', name: 'Ten' },
  { prefix: '(base unit)', symbol: '—', factor: '10⁰', decimal: '1', name: 'One (meter, gram, second)' },
  { prefix: 'deci', symbol: 'd', factor: '10⁻¹', decimal: '0.1', name: 'Tenth' },
  { prefix: 'centi', symbol: 'c', factor: '10⁻²', decimal: '0.01', name: 'Hundredth' },
  { prefix: 'milli', symbol: 'm', factor: '10⁻³', decimal: '0.001', name: 'Thousandth' },
  { prefix: 'micro', symbol: 'μ', factor: '10⁻⁶', decimal: '0.000001', name: 'Millionth' },
  { prefix: 'nano', symbol: 'n', factor: '10⁻⁹', decimal: '0.000000001', name: 'Billionth' },
  { prefix: 'pico', symbol: 'p', factor: '10⁻¹²', decimal: '0.000000000001', name: 'Trillionth' },
  { prefix: 'femto', symbol: 'f', factor: '10⁻¹⁵', decimal: '0.000000000000001', name: 'Quadrillionth' },
];

export const ACADEMIC_WORKBENCHES: AcademicWorkbench[] = [
  {
    id: 'physics-students',
    title: 'AP & University Physics Suite',
    audience: 'Classical Mechanics & Electrodynamics',
    description: 'Kinematics motion solvers, projectile trajectories, Newton’s laws, harmonic oscillations, and Coulomb’s electrostatic force.',
    icon: 'Orbit',
    toolSlugs: [
      'projectile-motion-calculator',
      'kinematics-calculator',
      'newtons-law-calculator',
      'energy-calculator',
      'centripetal-force-calculator',
      'coulombs-law-calculator',
    ],
  },
  {
    id: 'chemistry-lab',
    title: 'Analytical Chemistry & Wet Lab',
    audience: 'Stoichiometry & Solution Preparation',
    description: 'Compute molecular weights from chemical formulas, prepare molar stock dilutions, and calibrate Henderson-Hasselbalch buffers.',
    icon: 'FlaskConical',
    toolSlugs: [
      'molar-mass-calculator',
      'molarity-calculator',
      'dilution-calculator',
      'ph-calculator',
      'percent-yield-calculator',
      'buffer-ph-calculator',
    ],
  },
  {
    id: 'aerospace-astronomy',
    title: 'Aerospace & Astrophysics Mission Tools',
    audience: 'Orbital Mechanics & Planetary Physics',
    description: 'Calculate circular orbital velocities, escape speeds, Keplerian orbital periods, and planetary surface gravity.',
    icon: 'Telescope',
    toolSlugs: [
      'orbital-velocity-calculator',
      'escape-velocity-calculator',
      'gravitation-calculator',
      'keplers-law-calculator',
      'surface-gravity-calculator',
      'projectile-motion-calculator',
    ],
  },
  {
    id: 'thermodynamics-fluids',
    title: 'Thermal & Fluid Engineering',
    audience: 'Mechanical & Chemical Engineers',
    description: 'Evaluate Ideal Gas Law state parameters, heat transfer specific capacities, pipe Reynolds numbers, and Bernoulli pressures.',
    icon: 'Flame',
    toolSlugs: [
      'ideal-gas-law-calculator',
      'specific-heat-calculator',
      'bernoulli-calculator',
      'reynolds-number-calculator',
      'thermal-expansion-calculator',
      'barometric-formula-calculator',
    ],
  },
  {
    id: 'quantum-optics',
    title: 'Quantum Physics, Laser & Photonics',
    audience: 'Optics & Particle Physics Researchers',
    description: 'Convert photon energies across electron-volts, evaluate de Broglie matter waves, Snell refraction, and thin lens magnifications.',
    icon: 'Atom',
    toolSlugs: [
      'photon-energy-calculator',
      'half-life-calculator',
      'de-broglie-calculator',
      'snells-law-calculator',
      'thin-lens-calculator',
      'rydberg-calculator',
    ],
  },
  {
    id: 'biology-genetics',
    title: 'Genetics, Ecology & Bio-Computing',
    audience: 'Biophysicists & Life Science Researchers',
    description: 'Model Hardy-Weinberg population allele frequencies, exponential bacterial colony doublings, and barometric oxygen pressure.',
    icon: 'Dna',
    toolSlugs: [
      'hardy-weinberg-calculator',
      'bacterial-growth-calculator',
      'barometric-formula-calculator',
      'half-life-calculator',
      'molarity-calculator',
      'ph-calculator',
    ],
  },
];

export const SCIENCE_FAQS: ScienceFaq[] = [
  {
    question: 'What are the 4 fundamental kinematic motion equations for constant acceleration?',
    answer:
      'The 4 kinematic equations describe 1D and 2D motion with uniform acceleration (a): 1) v = v₀ + at (velocity as a function of time); 2) Δx = v₀t + ½at² (displacement as a function of time); 3) v² = v₀² + 2aΔx (time-independent velocity-displacement relationship); 4) Δx = ((v₀ + v) / 2) × t (displacement from average velocity). In 2D projectile motion, horizontal motion has a_x = 0, while vertical motion is governed by a_y = -g (-9.80665 m/s² on Earth).',
  },
  {
    question: 'How does the Ideal Gas Law (PV = nRT) operate and what are its physical assumptions?',
    answer:
      'The Ideal Gas Law relates the four state variables of a hypothetical ideal gas: Pressure (P in Pa or atm), Volume (V in m³ or L), Amount of substance (n in moles), and Absolute Temperature (T in Kelvin), using the Universal Gas Constant R = 8.314462 J/(mol·K) = 0.082057 L·atm/(mol·K). It assumes point-mass particles with zero volume and perfectly elastic collisions with zero intermolecular attractive forces (accurate for noble gases and atmospheric air at moderate temperatures and pressures).',
  },
  {
    question: 'How is molecular Molar Mass calculated from a chemical formula?',
    answer:
      'Molar mass (expressed in grams per mole, g/mol) is the weighted sum of the standard atomic weights of all constituent atoms in one mole of a chemical substance: M = Σ (Atomic Mass_i × Subscript_i). For example, sulfuric acid (H₂SO₄) contains 2 Hydrogens (2 × 1.008 g/mol) + 1 Sulfur (1 × 32.06 g/mol) + 4 Oxygens (4 × 15.999 g/mol) = 98.076 g/mol.',
  },
  {
    question: 'How is Circular Orbital Velocity calculated around Earth or other celestial bodies?',
    answer:
      'Circular orbital velocity is determined by equating gravitational centripetal force to gravitational attraction: (m × v²) / r = (G × M × m) / r², which simplifies to v = √(GM / r), where G is the Newtonian gravitational constant (6.67430 × 10⁻¹¹ m³/kg·s²), M is the mass of the central celestial body (e.g. 5.972 × 10²⁴ kg for Earth), and r is the orbital radius from the center of mass (r = Body Radius + Orbital Altitude). For Low Earth Orbit (~400 km altitude for the ISS), v ≈ 7.67 km/s (27,600 km/h).',
  },
  {
    question: 'What is the mathematical relationship between Photon Energy, Wavelength, and Frequency?',
    answer:
      'Electromagnetic radiation exhibits wave-particle duality governed by Planck’s relation: E = h × ν = (h × c) / λ, where E is photon energy (in Joules or electron-volts eV), h is Planck’s constant (6.62607 × 10⁻³⁴ J·s), c is the speed of light (2.99792 × 10⁸ m/s), ν is frequency in Hertz (Hz), and λ is wavelength in meters. Because energy is inversely proportional to wavelength, shorter wavelengths (like gamma rays and X-rays) carry exponentially higher quantum energy than radio or microwave photons.',
  },
  {
    question: 'What is the formula for calculating Escape Velocity from a planet?',
    answer:
      'Escape velocity (v_e) is the theoretical minimum initial speed required for an unpropelled mass to completely overcome a planet’s gravitational potential well and reach infinite distance with zero residual kinetic energy: v_e = √(2GM / r) = √(2 × g × r). For Earth (mass 5.972 × 10²⁴ kg, mean radius 6,371 km), escape velocity is approximately 11.186 km/s (~25,000 mph). Escape velocity is exactly √2 (≈ 1.414) times the circular orbital speed at that same radius.',
  },
  {
    question: 'How do you calculate solution Molarity (M) and prepare a laboratory dilution?',
    answer:
      'Molarity (M) equals moles of solute divided by liters of total solution: M = (Mass of solute in grams / Molar Mass in g/mol) / Solution Volume in Liters. For dilutions, the conservation of solute mass dictates the dilution equation: C₁ × V₁ = C₂ × V₂, where C₁ is initial stock concentration, V₁ is stock volume aliquot, C₂ is target working concentration, and V₂ is final diluted volume.',
  },
  {
    question: 'What is the difference between pH and pOH in acid-base chemistry?',
    answer:
      'pH measures the negative base-10 logarithm of hydrogen/hydronium ion activity: pH = -log₁₀[H⁺], while pOH measures hydroxide concentration: pOH = -log₁₀[OH⁻]. In aqueous solutions at standard temperature (25 °C), the autoionization constant of water (K_w = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴) requires that pH + pOH = 14.00. Solutions with pH < 7 are acidic, pH = 7 is neutral pure water, and pH > 7 is basic/alkaline.',
  },
  {
    question: 'How is Radioactive Half-Life decay calculated over time?',
    answer:
      'Radioactive decay is a first-order exponential decay process: N(t) = N₀ × (½)^(t / t½) = N₀ × e^(-λt), where N₀ is initial radioactive substance mass or activity, t is elapsed time, t½ is the isotope half-life, and λ = ln(2) / t½ ≈ 0.69315 / t½ is the decay constant. After 1 half-life, 50% remains; after 2 half-lives, 25% remains; after 5 half-lives, only 3.125% remains.',
  },
  {
    question: 'What is Snell’s Law of Refraction and how does Total Internal Reflection occur?',
    answer:
      'Snell’s Law calculates the angular bending of light rays passing between media with different refractive indices: n₁ × sin(θ₁) = n₂ × sin(θ₂), where n is refractive index (c / v_medium) and θ is angle measured from the surface normal. When light travels from a higher-index medium to a lower-index medium (n₁ > n₂), there exists a critical angle θ_crit = arcsin(n₂ / n₁). For incident angles θ₁ > θ_crit, no light refracts across the boundary, causing 100% Total Internal Reflection (the foundation of fiber optic cables).',
  },
  {
    question: 'What is de Broglie Wavelength and how does it prove matter-wave duality?',
    answer:
      'Louis de Broglie postulated that every moving particle or object exhibits wave characteristics with a matter wavelength given by λ = h / p = h / (m × v), where h is Planck’s constant, p is momentum, m is particle mass, and v is velocity. For subatomic particles like electrons, this wavelength is on the order of picometers to nanometers, enabling electron microscopy with resolving powers 10,000× greater than optical light.',
  },
  {
    question: 'What is the Hardy-Weinberg equilibrium principle in genetics?',
    answer:
      'The Hardy-Weinberg law states that allele and genotype frequencies in a sexually reproducing diploid population remain constant across generations in the absence of evolutionary forces (mutation, selection, genetic drift, gene flow, non-random mating). For a two-allele locus: p + q = 1 (allele frequencies) and p² + 2pq + q² = 1 (genotype frequencies), where p² is homozygous dominant (AA), 2pq is heterozygous (Aa), and q² is homozygous recessive (aa).',
  },
  {
    question: 'What is Bernoulli’s Principle and how does it relate fluid velocity to pressure?',
    answer:
      'Bernoulli’s equation is a statement of conservation of mechanical energy for inviscid, incompressible fluid flow: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂, where P is static pressure, ½ρv² is dynamic pressure, and ρgh is hydrostatic potential energy. In horizontal flow (constant h), as fluid velocity increases through a constricted venturi nozzle, internal static pressure must simultaneously decrease.',
  },
  {
    question: 'What is the Reynolds Number (Re) and how does it predict turbulence?',
    answer:
      'The Reynolds Number is a dimensionless ratio of inertial forces to viscous forces in a fluid flow: Re = (ρ × v × D) / μ, where ρ is fluid density, v is velocity, D is pipe diameter, and μ is dynamic viscosity. In circular pipe flow: Re < 2,300 indicates smooth, predictable Laminar Flow; 2,300 < Re < 4,000 is Transitional Flow; and Re > 4,000 indicates chaotic, eddying Turbulent Flow.',
  },
  {
    question: 'What is the physical meaning of Einstein’s Mass-Energy Equivalence (E = mc²)?',
    answer:
      'Einstein’s formula E = mc² demonstrates that rest mass is an ultra-dense, concentrated form of energy. Because the speed of light squared (c² ≈ 8.98755 × 10¹⁶ m²/s²) is astronomical, converting just 1 gram (0.001 kg) of mass into pure energy yields E = 0.001 × (2.99792 × 10⁸)² = 8.988 × 10¹³ Joules (~25 million kilowatt-hours or the explosive energy of 21.5 kilotons of TNT).',
  },
];
