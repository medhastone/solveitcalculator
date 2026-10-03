'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Info,
  Grid,
  ListFilter,
  Atom,
  FlaskConical,
  Compass,
  Scale,
  Microscope,
  Calculator,
  BookOpen,
  Thermometer,
  Flame,
  Orbit,
  Binary,
  Activity,
  Globe2,
  Gauge,
  Radio,
  Clock,
  HelpCircle
} from 'lucide-react';

interface ToolItem {
  name: string;
  desc: string;
  action: string;
  href?: string;
  badge?: string;
}

interface CategoryGroup {
  id: string;
  num: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'cyan' | 'rose' | 'indigo';
  count: string;
  group: 'Physics' | 'Chemistry' | 'Biology' | 'Earth & Space' | 'Lab & Math';
  tools: ToolItem[];
}

export default function ScienceClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Physics' | 'Chemistry' | 'Biology' | 'Earth & Space' | 'Lab & Math'>('all');
  const [viewDensity, setViewDensity] = useState<'compact' | 'detailed'>('compact');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Workbench 1: Density & Material Identifier ---
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
        material: 'Enter weight and volume to check',
      };
    }
    const d = mass / vol;
    const densityStr = d.toFixed(2);
    const kgm3Str = (d * 1000).toLocaleString(undefined, { maximumFractionDigits: 1 });
    const lbft3Str = (d * 62.428).toFixed(1);

    let material = 'Custom Material';
    if (Math.abs(d - 2.7) < 0.15) {
      material = 'Matches: Aluminum (lightweight metal, 2.70 g/cm³)';
    } else if (Math.abs(d - 7.87) < 0.3) {
      material = 'Matches: Iron / Steel (7.87 g/cm³)';
    } else if (Math.abs(d - 1.0) < 0.08) {
      material = 'Matches: Plain Water (1.00 g/cm³)';
    } else if (Math.abs(d - 19.32) < 0.5) {
      material = 'Matches: Pure Gold (very heavy, 19.32 g/cm³)';
    } else if (Math.abs(d - 0.92) < 0.05) {
      material = 'Matches: Ice (floats on water, 0.92 g/cm³)';
    } else if (Math.abs(d - 8.96) < 0.3) {
      material = 'Matches: Copper (8.96 g/cm³)';
    }

    return {
      density: densityStr,
      kgm3: kgm3Str,
      lbft3: lbft3Str,
      material,
    };
  }, [wbDensityMass, wbDensityVol]);

  // --- Workbench 2: Liquid Strength & Mixing (Molarity) ---
  const [wbMolMass, setWbMolMass] = useState<number>(14.61); // Table salt grams
  const [wbMolMw, setWbMolMw] = useState<number>(58.44); // NaCl
  const [wbMolVol, setWbMolVol] = useState<number>(500); // 500 mL water

  const molarityResult = useMemo(() => {
    const mass = Number(wbMolMass) || 0;
    const mw = Number(wbMolMw) || 1;
    const volMl = Number(wbMolVol) || 1;
    if (mw <= 0 || volMl <= 0) {
      return { molarity: '0.000', moles: '0.000', strengthDesc: 'No powder dissolved' };
    }
    const moles = mass / mw;
    const liters = volMl / 1000;
    const molarity = moles / liters;
    return {
      molarity: molarity.toFixed(3),
      moles: moles.toFixed(3),
      strengthDesc: `${(moles * 1000).toFixed(0)} millimoles in ${(volMl / 1000).toFixed(2)} liters of water`,
    };
  }, [wbMolMass, wbMolMw, wbMolVol]);

  // --- Workbench 3: Motion & Impact Energy ---
  const [wbKeMass, setWbKeMass] = useState<number>(1200); // 1200 kg car
  const [wbKeVel, setWbKeVel] = useState<number>(25); // 25 m/s (~90 km/h)

  const keResult = useMemo(() => {
    const m = Number(wbKeMass) || 0;
    const v = Number(wbKeVel) || 0;
    const joules = 0.5 * m * (v * v);
    const kJ = joules / 1000;
    const kmh = (v * 3.6).toFixed(0);
    const mph = (v * 2.237).toFixed(0);
    return {
      kJ: kJ.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      speedText: `${kmh} km/h (${mph} mph)`,
      calories: (joules / 4184).toFixed(0),
    };
  }, [wbKeMass, wbKeVel]);

  // --- Workbench 4: Air & Gas Expansion ---
  const [wbGasP, setWbGasP] = useState<number>(1.00); // 1 atmosphere standard air pressure
  const [wbGasV, setWbGasV] = useState<number>(22.4); // liters of gas
  const [wbGasT, setWbGasT] = useState<number>(20); // 20 °C room temp

  const gasResult = useMemo(() => {
    const p = Number(wbGasP) || 0;
    const v = Number(wbGasV) || 0;
    const tempC = Number(wbGasT) || 0;
    const kelvin = tempC + 273.15;
    const R = 0.082057; // L·atm / (mol·K)
    if (kelvin <= 0) return '0.00';
    const moles = (p * v) / (R * kelvin);
    return {
      moles: moles.toFixed(2),
      kelvin: `${kelvin.toFixed(1)} K`,
    };
  }, [wbGasP, wbGasV, wbGasT]);

  // --- Complete 18-Category Directory in Everyday Words ---
  const allCategories: CategoryGroup[] = [
    {
      id: 'cat-mechanics',
      num: '01',
      title: 'Speed, Motion & Forces',
      desc: 'Calculate how fast objects move, how hard they hit, braking distances, and thrown ball paths.',
      icon: Atom,
      color: 'blue',
      count: '6 Tools',
      group: 'Physics',
      tools: [
        { name: 'Speed, Distance & Acceleration', desc: 'Find how long it takes to travel, speed up, or come to a full stop.', action: 'Calculate Speed', href: '/speed-velocity-converter', badge: 'Popular' },
        { name: 'Pushing Force & Weight (F = ma)', desc: 'Find how much push or pull force is needed to move any heavy object.', action: 'Calculate Force' },
        { name: 'Thrown Ball & Projectile Flight Path', desc: 'Calculate how high, how far, and how long a ball or rocket stays in the air.', action: 'Find Flight Path' },
        { name: 'Car Crashes & Bouncing Collisions', desc: 'See what happens to speed and momentum when two moving objects hit each other.', action: 'Test Collision' },
        { name: 'Spinning & Turning Force', desc: 'Calculate the sideways pull when taking sharp turns in a car or on a ride.', action: 'Calculate Turn' },
        { name: 'Lever & Wrench Turning Power (Torque)', desc: 'Find how much easier a long wrench or lever makes loosening tight bolts.', action: 'Calculate Leverage', href: '/torque-converter' },
      ],
    },
    {
      id: 'cat-thermo',
      num: '02',
      title: 'Heat, Temperature & Cooling',
      desc: 'How much heat is needed to warm water, how engines work, and how materials expand.',
      icon: Flame,
      color: 'amber',
      count: '5 Tools',
      group: 'Physics',
      tools: [
        { name: 'Heat Needed to Warm or Boil Water', desc: 'Find the electricity or gas energy needed to heat water, metals, or food.', action: 'Calculate Heat', href: '/energy-converter', badge: 'Essential' },
        { name: 'Engine & Heat Efficiency', desc: 'Calculate the maximum percentage of fuel energy an engine can turn into work.', action: 'Check Efficiency' },
        { name: 'Metal Expansion in Hot Weather', desc: 'Find how much bridge joints, pipes, and metal rails expand when heated.', action: 'Check Expansion' },
        { name: 'Heat Radiated from Hot Surfaces', desc: 'Calculate the heat coming off hot stoves, radiators, and sunshine.', action: 'Check Radiation' },
        { name: 'Coldness, Heat Flow & Entropy', desc: 'Measure how heat naturally spreads out from hot areas to cold rooms.', action: 'Check Heat Flow' },
      ],
    },
    {
      id: 'cat-electromagnetism',
      num: '03',
      title: 'Electricity, Circuits & Magnets',
      desc: 'Voltage, household electric current, battery life, and magnetic forces.',
      icon: Zap,
      color: 'purple',
      count: '5 Tools',
      group: 'Physics',
      tools: [
        { name: "Voltage, Amps & Watts (Ohm's Law)", desc: 'Calculate how much electrical power your appliances and electronics use.', action: 'Check Power', href: '/power-converter', badge: 'Everyday' },
        { name: 'Static Electricity Attraction & Sparks', desc: 'Find how strongly positive and negative static charges pull together.', action: 'Calculate Pull' },
        { name: 'Battery & Capacitor Energy Storage', desc: 'Find how much electrical energy a battery pack or circuit capacitor stores.', action: 'Check Storage' },
        { name: 'Electromagnet & Wire Magnet Strength', desc: 'Calculate the magnetic pulling power of wire coils and electromagnets.', action: 'Check Magnet' },
        { name: 'Magnetic Push on Moving Electricity', desc: 'How electric motors turn magnetic fields into physical spinning power.', action: 'Check Motor Power' },
      ],
    },
    {
      id: 'cat-optics',
      num: '04',
      title: 'Light, Lenses & Sound Waves',
      desc: 'How magnifying glasses work, how light bends in water, and sound pitch changes.',
      icon: Radio,
      color: 'cyan',
      count: '5 Tools',
      group: 'Physics',
      tools: [
        { name: 'How Light Bends in Water & Glass', desc: 'Calculate light reflection, underwater viewing angles, and prism colors.', action: 'Bend Light', badge: 'Visual' },
        { name: 'Magnifying Glasses & Camera Lenses', desc: 'Find where an image focuses, how big it appears, and lens zoom power.', action: 'Check Focus' },
        { name: 'Siren Pitch Change as Cars Pass (Doppler)', desc: 'Calculate how pitch sounds higher when approaching and lower when moving away.', action: 'Shift Pitch' },
        { name: 'Laser Beam & Rainbow Slit Spacing', desc: 'Calculate color separation and rainbow bands through narrow slits.', action: 'Split Light' },
        { name: 'Sound Wave Speed, Pitch & Frequency', desc: 'Convert musical note frequencies into physical sound wave lengths.', action: 'Check Sound' },
      ],
    },
    {
      id: 'cat-quantum',
      num: '05',
      title: 'Atoms, Radiation & Nuclear Energy',
      desc: 'Einstein energy, radioactive decay times, photon light energy, and atom layers.',
      icon: Compass,
      color: 'indigo',
      count: '5 Tools',
      group: 'Physics',
      tools: [
        { name: 'Light Particle (Photon) Energy', desc: 'Find the energy inside ultraviolet rays, visible sunlight, and laser beams.', action: 'Check Light Energy', href: '/energy-converter', badge: 'Modern' },
        { name: 'Tiny Electron Wave Speed', desc: 'Calculate the microscopic wave nature of electrons in electron microscopes.', action: 'Find Wave' },
        { name: 'Radioactive Half-Life & Decay Timer', desc: 'See how many years it takes for radioactive elements and medical isotopes to disappear.', action: 'Check Half-Life' },
        { name: "Energy Stored in Mass (E = mc²)", desc: "Calculate the massive amount of energy locked inside tiny amounts of matter.", action: 'Calculate Energy' },
        { name: 'Hydrogen Glow & Spectral Colors', desc: 'Calculate the exact colors and wavelengths glowing hydrogen gas emits.', action: 'Check Colors' },
      ],
    },
    {
      id: 'cat-fluids',
      num: '06',
      title: 'Water Pressure, Floating & Flow',
      desc: 'Deep water pressure, why heavy boats float, and water flow through pipes.',
      icon: Gauge,
      color: 'blue',
      count: '5 Tools',
      group: 'Physics',
      tools: [
        { name: 'Water Pressure at Any Depth', desc: 'Find the pressure at the bottom of a swimming pool, lake, or deep ocean trench.', action: 'Check Pressure', href: '/pressure-converter', badge: 'Helpful' },
        { name: 'Water Speed in Narrow Pipes', desc: 'Calculate how water speeds up when squeezed through a garden hose nozzle.', action: 'Check Speed' },
        { name: 'Why Objects Float or Sink (Buoyancy)', desc: 'Find how much weight a boat or float can carry before sinking.', action: 'Test Floating' },
        { name: 'Smooth vs Rough Pipe Flow', desc: 'Check whether water flows smoothly or swirls into choppy turbulence.', action: 'Check Flow' },
        { name: 'Thick Liquid Flow (Syrup & Oil)', desc: 'Calculate how fast honey, oil, or paint pours through small tubes.', action: 'Calculate Pouring' },
      ],
    },
    {
      id: 'cat-stoichiometry',
      num: '07',
      title: 'Chemical Formulas & Recipes',
      desc: 'Molecules, recipe weights, how much chemical reaction product you get.',
      icon: FlaskConical,
      color: 'emerald',
      count: '5 Tools',
      group: 'Chemistry',
      tools: [
        { name: 'Chemical Weight & Ingredient Split', desc: 'Type any chemical formula (like H2O or C6H12O6) to get weight and element percentages.', action: 'Weigh Formula', badge: 'Everyday' },
        { name: 'Reaction Recipe: Maximum Product Made', desc: 'Find which ingredient runs out first and how much finished product you will get.', action: 'Find Output' },
        { name: 'Simplest Recipe Finder (Empirical Formula)', desc: 'Work backward from percentage weights to find a chemical compound recipe.', action: 'Find Recipe' },
        { name: 'Burning & Fuel Analysis', desc: 'Analyze smoke and water vapor from burnt fuel to identify the exact fuel type.', action: 'Analyze Fuel' },
        { name: 'Percentage of Each Element in a Powder', desc: 'Find what percentage of a mineral or powder is made of iron, carbon, or oxygen.', action: 'Check Percentages' },
      ],
    },
    {
      id: 'cat-solutions',
      num: '08',
      title: 'Liquid Mixing, Dilution & Strength',
      desc: 'Making liquids stronger or weaker, mixing powders into water, and lab dilutions.',
      icon: FlaskConical,
      color: 'cyan',
      count: '5 Tools',
      group: 'Chemistry',
      tools: [
        { name: 'Liquid Strength & Mixing (Molarity)', desc: 'Find how much powder to dissolve in water to get the exact strength you want.', action: 'Mix Liquid', badge: 'Lab Favorite' },
        { name: 'How to Dilute Strong Liquid (M₁V₁ = M₂V₂)', desc: 'Calculate how much water to add to dilute a strong stock liquid to a weaker mix.', action: 'Dilute Liquid' },
        { name: 'Concentration by Weight (Molality)', desc: 'Calculate mixture strength that stays exact even when heated or chilled.', action: 'Check Molality' },
        { name: 'Percentage Strength (5% Solution, PPM)', desc: 'Convert between percentages (like 3% hydrogen peroxide), parts per million, and grams.', action: 'Convert Strength' },
        { name: 'Acid-Base Drops & Neutralization', desc: 'Calculate how many drops of base are needed to completely neutralize an acid.', action: 'Neutralize Drops' },
      ],
    },
    {
      id: 'cat-kinetics',
      num: '09',
      title: 'Reaction Speed & Spontaneous Change',
      desc: 'Why some reactions happen on their own, how heat speeds up reactions.',
      icon: Flame,
      color: 'amber',
      count: '5 Tools',
      group: 'Chemistry',
      tools: [
        { name: 'Will a Reaction Happen on Its Own? (Gibbs)', desc: 'Check if a chemical reaction will start automatically or needs heat to run.', action: 'Check Reaction' },
        { name: 'How Heat Speeds Up Chemical Reactions', desc: 'Calculate how much faster food cooks or chemicals react at higher temperatures.', action: 'Check Speedup' },
        { name: 'Reaction Balance (Le Chatelier)', desc: 'Predict which way a reaction shifts when you add more ingredients or change pressure.', action: 'Check Balance' },
        { name: 'Temperature Effect on Chemical Balance', desc: 'See whether warming up a mixture creates more product or reverses the reaction.', action: 'Shift Balance' },
        { name: 'How Fast Ingredients Disappear Over Time', desc: 'Calculate how long it takes for half of your starting chemical to react away.', action: 'Track Timing' },
      ],
    },
    {
      id: 'cat-aqueous',
      num: '10',
      title: 'Acids, Bases & pH Water Levels',
      desc: 'Measuring acidity, swimming pool pH, balancing weak acids, and water hardness.',
      icon: FlaskConical,
      color: 'purple',
      count: '5 Tools',
      group: 'Chemistry',
      tools: [
        { name: 'pH Scale & Acidity Converter', desc: 'Convert between pH numbers (1 to 14) and actual acid amounts in liquids.', action: 'Convert pH', badge: 'Practical' },
        { name: 'pH Buffer (Keep Water pH Steady)', desc: 'Mix ingredients that keep your aquarium, pool, or lab water pH from changing.', action: 'Make Buffer' },
        { name: 'Vinegar & Weak Acid Acidity', desc: 'Find how acidic vinegar, lemon juice, or weak acid cleaners really are.', action: 'Check Acidity' },
        { name: 'Hard Water Minerals & Precipitates', desc: 'Check if dissolved minerals will precipitate out as cloudy scale in pipes.', action: 'Check Mineral Cloud' },
        { name: 'Multi-Step Acids (Citric & Phosphoric)', desc: 'See how sour flavor acids like lemon juice lose their sourness step by step.', action: 'Check Acid Steps' },
      ],
    },
    {
      id: 'cat-biochem',
      num: '11',
      title: 'Proteins, Enzymes & Lab Tests',
      desc: 'How enzymes speed up body digestion, measuring proteins with light color.',
      icon: Microscope,
      color: 'rose',
      count: '4 Tools',
      group: 'Biology',
      tools: [
        { name: 'Enzyme Digestion Speed', desc: 'Calculate how fast enzymes break down food and sugars at different concentrations.', action: 'Check Speed', badge: 'Biology Core' },
        { name: 'Enzyme Blocker & Medicine Impact', desc: 'See how medicines slow down or stop specific target enzymes in the body.', action: 'Test Blocker' },
        { name: 'Measuring Protein by Color Darkness', desc: 'Determine exact protein amounts by how much light is absorbed through a test tube.', action: 'Check Protein' },
        { name: 'Protein Neutral Electric Charge Point', desc: 'Find the exact pH where a protein molecule has zero electric charge.', action: 'Find Neutral Point' },
      ],
    },
    {
      id: 'cat-genetics',
      num: '12',
      title: 'DNA, Traits & Family Inheritance',
      desc: 'Predict eye colors, family traits, DNA primer melting, and bacterial growth.',
      icon: Binary,
      color: 'emerald',
      count: '4 Tools',
      group: 'Biology',
      tools: [
        { name: 'Gene Frequencies in a Town or Herd', desc: 'Calculate how common brown eyes vs blue eyes or genetic traits are in a population.', action: 'Count Traits', badge: 'Popular' },
        { name: 'Punnett Square: Baby Trait Chances', desc: 'Find the percentage chance a child inherits brown eyes, curly hair, or family traits.', action: 'Predict Traits' },
        { name: 'DNA Test Heating Temperature (PCR)', desc: 'Calculate the exact temperature needed to unzip DNA strands in lab testing.', action: 'Check Temp' },
        { name: 'Bacterial Growth & Doubling Timer', desc: 'See how fast a few bacteria multiply into millions if food is left out warm.', action: 'Grow Bacteria' },
      ],
    },
    {
      id: 'cat-ecology',
      num: '13',
      title: 'Wildlife, Forest & Plant Math',
      desc: 'How many wild animals live in a forest, food chain energy losses.',
      icon: Globe2,
      color: 'blue',
      count: '4 Tools',
      group: 'Biology',
      tools: [
        { name: 'Forest Animal & Tree Diversity Index', desc: 'Measure how healthy and varied species are in a park, lake, or nature reserve.', action: 'Score Diversity' },
        { name: 'Maximum Animal Population a Forest Can Hold', desc: 'Model animal population growth up to the limit of food and water available.', action: 'Check Forest Limit' },
        { name: 'Catch-and-Release Fish & Wildlife Count', desc: 'Estimate total wild deer or fish in a lake using tagging and recapture numbers.', action: 'Count Animals' },
        { name: 'Food Chain Energy Loss (10% Rule)', desc: 'See why it takes 1,000 kg of grass to feed 100 kg of deer to feed 10 kg of wolves.', action: 'Check Food Chain' },
      ],
    },
    {
      id: 'cat-earth',
      num: '14',
      title: 'Earthquakes, Rocks & Atmosphere',
      desc: 'Earthquake shaking power, identifying rocks by weight, and mountain air pressure.',
      icon: Globe2,
      color: 'amber',
      count: '4 Tools',
      group: 'Earth & Space',
      tools: [
        { name: 'Earthquake Magnitude & Energy', desc: 'See how much more powerful a 7.0 earthquake is compared to a 5.0 quake.', action: 'Check Energy' },
        { name: 'Identify Unknown Rocks by Weight in Water', desc: 'Weigh a rock dry and in water to identify if it is quartz, gold, pyrite, or granite.', action: 'Identify Rock' },
        { name: 'Mountain Altitude & Air Pressure', desc: 'See how air gets thinner and water boils at lower temperatures on tall mountains.', action: 'Check Altitude' },
        { name: 'Carbon Dating for Ancient Artifacts', desc: 'Estimate how many thousands of years old an ancient bone, wood, or cloth artifact is.', action: 'Date Artifact' },
      ],
    },
    {
      id: 'cat-astronomy',
      num: '15',
      title: 'Space, Planets & the Universe',
      desc: 'Planet orbit times, rocket launch speed to leave Earth, and distant galaxies.',
      icon: Orbit,
      color: 'indigo',
      count: '4 Tools',
      group: 'Earth & Space',
      tools: [
        { name: 'Planet Orbit Time Around the Sun', desc: 'Calculate how many Earth months or years a planet takes to complete one orbit.', action: 'Check Orbit', badge: 'Astro' },
        { name: 'Speed Needed to Escape Earth into Space', desc: 'Find how fast a rocket must go (11.2 km/s) to break free of Earth gravity.', action: 'Calculate Speed' },
        { name: 'Expanding Universe Galaxy Speed', desc: 'Calculate how fast distant stars and galaxies are moving away from Earth.', action: 'Track Galaxies' },
        { name: 'Light-Years & Star Distance Converter', desc: 'Convert huge space distances into miles, kilometers, light-years, and parsecs.', action: 'Convert Distance' },
      ],
    },
    {
      id: 'cat-labstats',
      num: '16',
      title: 'Averages, Spread & Test Accuracy',
      desc: 'Average values, spread of scores, and checking if test differences are real.',
      icon: Scale,
      color: 'purple',
      count: '4 Tools',
      group: 'Lab & Math',
      tools: [
        { name: 'Average & Spread (Standard Deviation)', desc: 'Calculate the true middle average and how spread out test scores or measurements are.', action: 'Find Average', href: '/math/standard-deviation-calculator', badge: 'Essential' },
        { name: '95% Confidence Range for Polls & Tests', desc: 'Find the margin of error (+/- 3%) for survey results and scientific tests.', action: 'Find Margin' },
        { name: 'Is the Difference Real or Luck? (t-Test)', desc: 'Check if a new treatment or medicine really made a statistically significant difference.', action: 'Run Test' },
        { name: 'Best-Fit Line for Graph Data (R²)', desc: 'Draw the best straight line through scatter points to find the trend formula.', action: 'Fit Trend Line' },
      ],
    },
    {
      id: 'cat-conversions',
      num: '17',
      title: 'Scientific Unit Converters',
      desc: 'Fahrenheit to Celsius, metric prefixes (milli, micro, nano), pressure, and energy.',
      icon: Compass,
      color: 'emerald',
      count: '4 Tools',
      group: 'Lab & Math',
      tools: [
        { name: 'Temperature Converter (°C, °F, Kelvin)', desc: 'Convert everyday cooking and outdoor temperatures to absolute scientific Kelvin.', action: 'Convert Temp', href: '/temperature-converter', badge: 'Everyday' },
        { name: 'Pressure Units (psi, bar, atm, Pascals)', desc: 'Convert car tire pressure (psi) into bar, atmospheres, and millibars.', action: 'Convert Pressure', href: '/pressure-converter' },
        { name: 'Energy & Work Converter (Joules, Calories, BTU)', desc: 'Convert food calories into electrical Joules, kilowatt-hours, and heater BTUs.', action: 'Convert Energy', href: '/energy-converter' },
        { name: 'Metric Prefixes (Kilo, Mega, Micro, Nano)', desc: 'Easily convert between billions (Giga), millions (Mega), thousandths (milli), and billionths (nano).', action: 'Convert Metric', href: '/scientific-converter' },
      ],
    },
    {
      id: 'cat-helpers',
      num: '18',
      title: 'Homework & Formula Helpers',
      desc: 'Scientific notation, measuring error percentage, and step-by-step math check.',
      icon: BookOpen,
      color: 'blue',
      count: '4 Tools',
      group: 'Lab & Math',
      tools: [
        { name: 'Scientific Notation (e.g. 1.5 × 10⁶)', desc: 'Write huge numbers and microscopic decimals in clean scientific notation.', action: 'Format Numbers', href: '/scientific-calculator' },
        { name: 'Percentage Error in Lab Experiments', desc: 'Calculate how close your lab experiment answer was to the actual official answer.', action: 'Check Accuracy' },
        { name: 'Unit Check for Physics Homework', desc: 'Verify that physical units match up correctly before turning in assignments.', action: 'Check Units' },
        { name: 'Test Tube Serial Dilution Table', desc: 'Make an easy recipe card showing how much liquid to pipette into each test tube.', action: 'Make Table' },
      ],
    },
  ];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let result = allCategories;

    // Filter by group tab
    if (activeTab !== 'all') {
      result = result.filter(c => c.group === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map(cat => ({
          ...cat,
          tools: cat.tools.filter(
            t =>
              t.name.toLowerCase().includes(q) ||
              t.desc.toLowerCase().includes(q) ||
              cat.title.toLowerCase().includes(q) ||
              cat.desc.toLowerCase().includes(q)
          ),
        }))
        .filter(cat => cat.tools.length > 0 || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
    }

    return result;
  }, [searchQuery, activeTab, allCategories]);

  // Total tool count
  const totalToolsCount = useMemo(() => {
    return allCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [allCategories]);

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      hover: 'hover:border-emerald-500/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      hover: 'hover:border-blue-500/40',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
      hover: 'hover:border-purple-500/40',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      hover: 'hover:border-amber-500/40',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      hover: 'hover:border-cyan-500/40',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      hover: 'hover:border-rose-500/40',
      icon: 'text-rose-600 dark:text-rose-400',
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
      hover: 'hover:border-indigo-500/40',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
  };

  // 8 Structured FAQ Cards in Everyday Plain English
  const persistentFaqs = [
    {
      q: 'How accurate are the science formulas on SolveIt?',
      a: 'Every formula uses officially verified scientific constants (such as the speed of light, gravity on Earth, and atom weights). Calculations use high-precision computer math so numbers stay exact with no rounding mistakes.',
      icon: Atom,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
      takeaway: 'Exact & Reliable: Uses official verified scientific standards',
    },
    {
      q: 'Is my school homework or research data kept private?',
      a: '100% private. All calculations run right on your phone, tablet, or computer browser. None of your homework numbers, grades, or research notes are ever saved or sent over the internet.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      takeaway: 'Zero Data Collected: Everything stays privately on your device',
    },
    {
      q: 'What is the easy difference between Molarity and Molality?',
      a: 'Molarity means how many grams of powder are dissolved in 1 Liter of total liquid. Molality means how much powder is mixed with 1 kilogram of pure water (which never changes even if the liquid gets hot or cold).',
      icon: Compass,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
      takeaway: 'Rule: Molarity = per Liter liquid; Molality = per Kilogram water',
    },
    {
      q: 'Can I use these calculators to mix liquids in a laboratory or classroom?',
      a: 'Yes. You can figure out how much chemical powder to weigh on a scale, how much water to add to dilute a strong acid or base, and what the final pH level will be.',
      icon: FlaskConical,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      takeaway: 'Lab Friendly: Step-by-step liquid mixing and dilution recipes',
    },
    {
      q: 'What is the simple difference between Mass and Weight?',
      a: 'Mass is the actual amount of matter in an object (measured in kilograms) and never changes anywhere in the universe. Weight is the gravitational downward pull on that object (which would be 6 times lighter on the Moon).',
      icon: Scale,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      takeaway: 'Remember: Your mass stays the same, but your weight changes on the Moon',
    },
    {
      q: 'Can I use these calculators offline without an internet connection?',
      a: 'Yes. Once you open the web page on your phone or laptop, all calculators continue working offline without any internet connection. Great for field trips, camping, or basements with poor reception.',
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      takeaway: 'Works Offline: Calculate anywhere without needing Wi-Fi',
    },
    {
      q: 'Can I convert between Metric (Celsius, Grams) and US/Imperial (Fahrenheit, Pounds)?',
      a: 'Yes. All unit tools instantly convert back and forth between Celsius and Fahrenheit, grams and ounces, meters and feet, and Joules and calories with one tap.',
      icon: Calculator,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
      takeaway: 'Instant Conversions: Switch between Metric and US measurements',
    },
    {
      q: 'Is SolveIt Calculator completely free for students and teachers?',
      a: 'Yes. Everything is 100% free with no sign-ups, accounts, or subscriptions required. Teachers can share links directly with students on Google Classroom or school worksheets.',
      icon: BookOpen,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      takeaway: 'Free for Everyone: No paywalls, logins, or ads getting in the way',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* ================= BREADCRUMB BAR ================= */}
      <section className="w-full bg-surface-container-low/50 py-2 border-b border-outline-variant/30">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <span className="text-outline-variant/60">/</span>
            <span className="text-on-surface font-semibold">Science Calculators</span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-on-surface-variant/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{totalToolsCount} Tools • 100% Free &amp; Private</span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: HERO & COMPACT SEARCH ================= */}
      <section className="w-full pt-6 pb-8 sm:pt-8 sm:pb-10 bg-gradient-to-b from-surface-container-low/40 via-background to-background relative overflow-hidden border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
            {/* Header Eyebrow Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-primary text-xs font-semibold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Easy Science &amp; Homework Calculators</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-on-surface tracking-tight leading-tight">
              Science Calculators &amp; Easy Problem Solvers
            </h1>

            {/* Subheading in Plain English */}
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Simple, accurate calculators for physics, chemistry mixing, biology traits, planet orbits, temperature conversions, and science homework.
            </p>

            {/* Compact Search Bar */}
            <div className="w-full max-w-2xl pt-1">
              <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-on-surface-variant ml-3.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  id="science-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tools: speed, liquid mixing, density, pH, energy, temperature..."
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-2 text-on-surface-variant hover:text-on-surface rounded transition-colors text-xs"
                    title="Clear search"
                  >
                    Clear
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center justify-center mr-3 bg-surface-container px-2 py-0.5 rounded text-[11px] font-mono text-on-surface-variant font-semibold border border-outline-variant/30">
                  /
                </kbd>
              </div>

              {/* Quick Filter Tag Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 text-xs">
                <span className="text-on-surface-variant/70 text-[11px] font-semibold uppercase tracking-wider mr-1">
                  Popular:
                </span>
                {[
                  'Density',
                  'Liquid Mixing',
                  'Speed & Motion',
                  'Temperature',
                  'Acids & pH',
                  'Kinetic Energy',
                  'Electric Power',
                  'Punnett Square',
                ].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      searchInputRef.current?.focus();
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${
                      searchQuery.toLowerCase() === tag.toLowerCase()
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Plain-English Highlights Strip */}
            <div className="w-full pt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-container-lowest/80 backdrop-blur-xs rounded-xl p-2.5 border border-outline-variant/40 shadow-2xs">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Atom className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">Verified Formulas</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Official Standards</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">Easy Lab Math</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Liquid Dilutions</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">100% Private</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Runs in Your Browser</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">18 Categories</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Physics, Chem &amp; Bio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: COMPACT DISCIPLINE EXPLORER ================= */}
      <section className="w-full py-6 sm:py-8 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Explore by Topic
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                What do you want to solve today?
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant">
              Click any topic to jump directly
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {[
              {
                title: 'Speed & Motion',
                desc: 'Acceleration, forces & travel time',
                count: '6 Tools',
                icon: Atom,
                color: 'text-blue-500 bg-blue-500/10',
                link: '#cat-mechanics',
              },
              {
                title: 'Chemical Formulas',
                desc: 'Molecule weight & recipes',
                count: '5 Tools',
                icon: FlaskConical,
                color: 'text-emerald-500 bg-emerald-500/10',
                link: '#cat-stoichiometry',
              },
              {
                title: 'Mixing Liquids',
                desc: 'Liquid dilutions & strengths',
                count: '5 Tools',
                icon: FlaskConical,
                color: 'text-cyan-500 bg-cyan-500/10',
                link: '#cat-solutions',
              },
              {
                title: 'Heat & Boiling',
                desc: 'Energy needed to warm water',
                count: '5 Tools',
                icon: Flame,
                color: 'text-amber-500 bg-amber-500/10',
                link: '#cat-thermo',
              },
              {
                title: 'DNA & Eye Color',
                desc: 'Inherited family traits & Punnett',
                count: '4 Tools',
                icon: Binary,
                color: 'text-rose-500 bg-rose-500/10',
                link: '#cat-genetics',
              },
              {
                title: 'Space & Planets',
                desc: 'Orbits, rockets & stars',
                count: '4 Tools',
                icon: Orbit,
                color: 'text-indigo-500 bg-indigo-500/10',
                link: '#cat-astronomy',
              },
            ].map(item => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.link}
                  className="group bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 hover:border-primary/50 hover:shadow-xs transition-all flex flex-col justify-between min-h-[92px]"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-on-surface-variant font-medium bg-surface-container px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                      <span className="truncate">{item.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                    </h3>
                    <p className="text-[10px] text-on-surface-variant/80 truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: 4 LIVE INTERACTIVE SOLVERS ================= */}
      <section className="w-full py-6 sm:py-10 bg-surface-container-low/30 border-b border-outline-variant/20" id="workbenches">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Instant Solvers
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Live Interactive Science Solvers
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Change the numbers below to see instant answers calculated directly in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* WORKBENCH 1: Density & Material Identifier */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Atom className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Density &amp; Material Checker
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Divide weight by volume to see what material you have
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Weight ÷ Volume
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Object Weight (grams)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={wbDensityMass}
                        onChange={e => setWbDensityMass(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">g</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Water Displaced (mL / cm³)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                      <input
                        type="number"
                        step="0.5"
                        min="0.1"
                        value={wbDensityVol}
                        onChange={e => setWbDensityVol(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">mL</span>
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Density
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-primary block mt-0.5">
                      {densityResult.density} g/cm³
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Metric (kg/m³)
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {densityResult.kgm3}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      US (lb/cu ft)
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {densityResult.lbft3}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {densityResult.material}
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-mechanics"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Motion &amp; Weight Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 2: Liquid Strength & Concentration */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Liquid Mixing &amp; Concentration
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Find how strong a liquid solution is when dissolving powder in water
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Liquid Math
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Powder Weight (g)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="0.1"
                        value={wbMolMass}
                        onChange={e => setWbMolMass(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Molecule Weight
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="0.01"
                        value={wbMolMw}
                        onChange={e => setWbMolMw(parseFloat(e.target.value) || 1)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Water Added (mL)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="50"
                        value={wbMolVol}
                        onChange={e => setWbMolVol(parseFloat(e.target.value) || 1)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Liquid Strength (Molarity)
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400 block mt-0.5">
                      {molarityResult.molarity} M
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Active Molecules
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {molarityResult.moles} moles
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center text-[11px] text-on-surface-variant">
                  {molarityResult.strengthDesc}
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-solutions"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Liquid Mixing &amp; Dilutions <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 3: Motion & Impact Energy */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Speed &amp; Impact Energy (Kinetic Energy)
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate how much energy a moving car, ball, or runner has
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Energy of Motion
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Weight of Object (kg)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="10"
                        value={wbKeMass}
                        onChange={e => setWbKeMass(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">kg</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Speed (meters per second)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="1"
                        value={wbKeVel}
                        onChange={e => setWbKeVel(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">m/s</span>
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Impact Energy
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {keResult.kJ} kJ
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Speed in mph / kmh
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-on-surface block mt-1">
                      {keResult.speedText}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Food Calories
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {keResult.calories} kcal
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-thermo"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Energy &amp; Heat Calculators <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 4: Air & Gas Room Expansion */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Air Pressure &amp; Tank Volume (Gas Law)
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate how much gas fits in a tank based on pressure and temperature
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Tank Math
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Pressure (atm)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="0.1"
                        value={wbGasP}
                        onChange={e => setWbGasP(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Tank Size (Liters)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="1"
                        value={wbGasV}
                        onChange={e => setWbGasV(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Temp (°Celsius)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="5"
                        value={wbGasT}
                        onChange={e => setWbGasT(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Gas Amount Inside
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-amber-600 dark:text-amber-400 block mt-0.5">
                      {gasResult.moles} moles
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Absolute Temperature
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {gasResult.kelvin}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#cat-thermo"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Gas &amp; Pressure Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: COMPLETE 18-CATEGORY DIRECTORY ================= */}
      <section className="w-full py-8 sm:py-12 bg-background" id="directory">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Complete Tool Index
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                All 18 Science Calculator Categories
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-0.5">
                Organized simply by topic: Physics, Chemistry, Biology, Earth &amp; Space, and Homework Math.
              </p>
            </div>

            {/* Filter Tabs & Density Switcher */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs">
                {(['all', 'Physics', 'Chemistry', 'Biology', 'Earth & Space', 'Lab & Math'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab === 'all' ? 'All (18)' : tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setViewDensity(viewDensity === 'compact' ? 'detailed' : 'compact')}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs text-on-surface-variant border border-outline-variant/30 transition-colors"
                title="Toggle density"
              >
                {viewDensity === 'compact' ? (
                  <>
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Detailed</span>
                  </>
                ) : (
                  <>
                    <Grid className="w-3.5 h-3.5" />
                    <span>Compact</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search notification when filtering */}
          {searchQuery && (
            <div className="mb-4 p-2.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between text-xs text-on-surface">
              <span>
                Showing results matching <strong>&ldquo;{searchQuery}&rdquo;</strong> across {filteredCategories.length} categories
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary font-bold hover:underline"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Directory Grid */}
          <div className="space-y-4 sm:space-y-6">
            {filteredCategories.map(cat => {
              const IconComp = cat.icon;
              const colorStyle = colorClasses[cat.color] || colorClasses.blue;

              return (
                <div
                  key={cat.id}
                  id={cat.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs transition-shadow hover:shadow-sm"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-outline-variant/20 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorStyle.bg}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">
                            {cat.num}. {cat.title}
                          </h3>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded shrink-0">
                      {cat.tools.length} Tools
                    </span>
                  </div>

                  {/* Category Tools Grid */}
                  <div className={`grid gap-2 ${viewDensity === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {cat.tools.map(tool => (
                      <Link
                        key={tool.name}
                        href={tool.href || '#workbenches'}
                        className={`group p-2.5 sm:p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low border border-outline-variant/30 ${colorStyle.hover} transition-all flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 line-clamp-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary shrink-0 transition-colors" />
                              <span>{tool.name}</span>
                            </span>
                            {tool.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary/10 text-primary shrink-0">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          {viewDensity === 'detailed' && (
                            <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                              {tool.desc}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant/70 text-[10px]">
                            {tool.action}
                          </span>
                          <span className="text-primary font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            Open Tool <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: EASY SCIENTIFIC COMPARISONS ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Everyday Explanations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
              Side-by-Side Science Comparisons
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Clear, simple explanations for concepts that often get mixed up.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Comparison 1 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Liquids
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Molarity vs Molality
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Molarity (M)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Grams of powder dissolved in <strong>1 Liter total liquid</strong>. Changes slightly if heated.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Molality (m)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Powder mixed with <strong>1 kg of pure water</strong>. Never changes with temperature.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison 2 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Physics
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Mass vs Weight
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Mass (kg)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      The real amount of matter in your body. Identical on Earth, the Moon, or Mars.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Weight (lbs / N)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      The gravity pull pulling you down. 6 times lighter on the Moon.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison 3 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Motion
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Speed vs Velocity
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Speed</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Just how fast you are moving (like 60 mph on your dashboard), in any direction.
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Velocity</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Both your speed AND compass heading (like 60 mph Heading North).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison 4 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Chemistry
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Strong Acid vs Weak Acid
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Strong Acid</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Completely splits into ions in water (like battery acid or hydrochloric acid).
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Weak Acid</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Only partially releases acid into water (like vinegar or lemon juice).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison 5 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Genetics
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Genotype vs Phenotype
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Genotype</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      The hidden DNA code inherited from parents (like Bb genes).
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Phenotype</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      The visible physical trait you actually see (like brown eyes or black hair).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison 6 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Energy
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Energy (Joules) vs Power (Watts)
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Energy (Joules)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      Total capacity to do work (like total gallons of gas in your tank).
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
                    <strong className="text-on-surface block text-[11px]">Power (Watts)</strong>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-tight">
                      How fast energy is being burned every second (1 Watt = 1 Joule per second).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: SIMPLE LAB GUIDES ================= */}
      <section className="w-full py-8 sm:py-10 bg-background border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Simple Lab Walkthroughs
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Step-by-Step Practical Guides
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Easy formulas and step-by-step instructions for science labs and homework.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Guide 1: Solution Dilution */}
            <article className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold mb-2">
                  <span className="uppercase tracking-wider text-[10px]">Liquid Diluting</span>
                  <span className="font-mono text-[11px] font-normal">5 min read</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface">
                  How to Dilute a Strong Liquid Solution
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  How to add water to strong stock solution to get the exact weaker strength you need.
                </p>

                {/* Mathematical Formula Callout */}
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-mono">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-sans font-bold">
                    Core Formula
                  </span>
                  <div className="text-cyan-600 dark:text-cyan-400 font-bold mt-1 text-[11px]">
                    (Strength 1 × Volume 1) = (Strength 2 × Volume 2)
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Water to Add = Target Volume - Stock Volume
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  Safety: Always add acid to water
                </span>
                <a
                  href="#cat-solutions"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Open Dilution Tool <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>

            {/* Guide 2: Percent Error */}
            <article className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">
                  <span className="uppercase tracking-wider text-[10px]">Homework Math</span>
                  <span className="font-mono text-[11px] font-normal">4 min read</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface">
                  How to Calculate Your Lab Percent Error
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Check how close your measured lab numbers are to the textbook answer.
                </p>

                {/* Mathematical Formula Callout */}
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-mono">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-sans font-bold">
                    Core Formula
                  </span>
                  <div className="text-purple-600 dark:text-purple-400 font-bold mt-1 text-[11px]">
                    Percent Error = (|Your Answer - True Answer| ÷ True Answer) × 100%
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Goal: Keep error below 5%
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  Standard Classroom Formula
                </span>
                <a
                  href="#cat-labstats"
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Error Solver <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>

            {/* Guide 3: 2D Projectiles */}
            <article className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold mb-2">
                  <span className="uppercase tracking-wider text-[10px]">Physics Motion</span>
                  <span className="font-mono text-[11px] font-normal">6 min read</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface">
                  How to Solve Thrown Ball &amp; Flight Paths
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Split horizontal travel from vertical gravity pull to find where a thrown ball lands.
                </p>

                {/* Mathematical Formula Callout */}
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-mono">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-sans font-bold">
                    Core Formula
                  </span>
                  <div className="text-blue-600 dark:text-blue-400 font-bold mt-1 text-[11px]">
                    Distance = Sideways Speed × Air Time
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Gravity Pull = 9.8 meters/second² downward
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  Best Throw Angle: 45 Degrees
                </span>
                <a
                  href="#cat-mechanics"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Flight Solver <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: 2-COLUMN ALWAYS-VISIBLE FAQ GRID ================= */}
      <section className="w-full py-8 sm:py-12 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
              Science Questions &amp; Answers
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Clear, straightforward answers about formula accuracy, school use, and privacy.
            </p>
          </div>

          {/* Responsive Two-Column Grid with Persistent Always-Visible Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {persistentFaqs.map((faq, idx) => {
              const IconComp = faq.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/40 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${faq.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-on-surface leading-snug">
                          {faq.q}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] text-on-surface-variant/90">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-medium truncate">{faq.takeaway}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: TRUST & PRIVACY FOOTER ================= */}
      <section className="w-full py-6 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Atom className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                  Free, Private &amp; Simple Science Calculators
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  All calculations happen directly inside your web browser. No accounts or downloads required.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant shrink-0">
              <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant/30 font-semibold">
                100% Free &amp; Private
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
