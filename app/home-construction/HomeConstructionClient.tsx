'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function HomeConstructionClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('all');
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

  // --- Workbench 1: Concrete Slab & Footing State ---
  const [concLength, setConcLength] = useState<number>(24);
  const [concWidth, setConcWidth] = useState<number>(16);
  const [concDepth, setConcDepth] = useState<number>(4);

  const concreteResult = useMemo(() => {
    const l = Number(concLength) || 0;
    const w = Number(concWidth) || 0;
    const d = Number(concDepth) || 0;
    // Cubic feet = l * w * (d / 12)
    const cuFt = l * w * (d / 12);
    // Cubic yards with 10% waste
    const cuYards = (cuFt / 27) * 1.10;
    const bags80 = Math.ceil(cuYards * 45);
    // Rough rebar grid estimation (18" OC)
    const rebarFt = Math.round((l * (w / 1.5)) + (w * (l / 1.5)));
    return {
      cuYards: cuYards.toFixed(2),
      bags80: `${bags80} bags`,
      rebarFt: `${rebarFt} lin ft`
    };
  }, [concLength, concWidth, concDepth]);

  // --- Workbench 2: Paint & Surface Coating State ---
  const [paintPerim, setPaintPerim] = useState<number>(60);
  const [paintHeight, setPaintHeight] = useState<number>(9);
  const [paintOpenings, setPaintOpenings] = useState<number>(3);

  const paintResult = useMemo(() => {
    const p = Number(paintPerim) || 0;
    const h = Number(paintHeight) || 0;
    const o = Number(paintOpenings) || 0;
    // Net sq ft = (perim * height) - (doors/windows * 21 sq ft)
    const netSqFt = Math.max(0, p * h - o * 21);
    // 2 coats standard @ 350 sq ft per gal
    const gallons = (netSqFt / 350) * 2;
    const primer = (netSqFt / 300).toFixed(1);
    const ceiling = ((p * 0.25 * (p * 0.25)) / 400).toFixed(1); // rough square estimate
    return {
      netSqFt,
      gallons: gallons.toFixed(1),
      primer: `${primer} gal`,
      ceiling: `${ceiling} gal`
    };
  }, [paintPerim, paintHeight, paintOpenings]);

  // --- Multi-Step Workflow State ("Build A Concrete Patio & Firepit") ---
  const [workflowPhase, setWorkflowPhase] = useState<number>(1);
  const [patioLength, setPatioLength] = useState<number>(20);
  const [patioWidth, setPatioWidth] = useState<number>(15);
  const [baseDepthOption, setBaseDepthOption] = useState<number>(4); // inches
  const [bomExported, setBomExported] = useState<boolean>(false);

  const workflowCalculations = useMemo(() => {
    const l = Number(patioLength) || 0;
    const w = Number(patioWidth) || 0;
    const area = l * w;
    const perimeter = 2 * (l + w);

    // Concrete slab: 4" depth with 10% waste
    const slabCuYards = ((area * (4 / 12)) / 27) * 1.10;
    const slabCost = Math.round(slabCuYards * 130);

    // Sub-base gravel (baseDepthOption) with compaction factor (1.15)
    const gravelCuYards = ((area * (baseDepthOption / 12)) / 27) * 1.15;
    const gravelTons = (gravelCuYards * 1.4).toFixed(1);
    const gravelCost = Math.round(Number(gravelTons) * 55);

    // Subgrade excavation & fabric
    const fabricCost = Math.round(area * 0.36);

    const totalCost = slabCost + gravelCost + fabricCost;

    // Rebar #4 18" OC
    const rebarLinFt = Math.round((l * (w / 1.5)) + (w * (l / 1.5)));
    const rebarBars = Math.ceil(rebarLinFt / 20);

    return {
      area,
      perimeter,
      slabCuYards: slabCuYards.toFixed(2),
      slabCost,
      gravelCuYards: gravelCuYards.toFixed(2),
      gravelTons,
      gravelCost,
      fabricCost,
      totalCost,
      rebarLinFt,
      rebarBars
    };
  }, [patioLength, patioWidth, baseDepthOption]);

  const handleExportBOM = () => {
    setBomExported(true);
    setTimeout(() => setBomExported(false), 3000);
  };

  // --- Smart Recommender State ---
  const [recPhase, setRecPhase] = useState<string>('Planning & Budget');
  const [recTrade, setRecTrade] = useState<string>('Ready-Mix Concrete');

  const recommendedTool = useMemo(() => {
    if (recTrade === 'Ready-Mix Concrete') {
      return {
        title: 'ASTM C94 Ready-Mix Batch & Slump Matrix',
        matchedCount: 3,
        desc: 'Calculates volumetric yardage, compressive PSI batch mix ratios, and 10% spill safety.'
      };
    }
    if (recTrade === 'Framing Lumber') {
      return {
        title: 'IBC Wall Framing & Stud Distribution Suite',
        matchedCount: 4,
        desc: 'On-center 16" and 24" stud calculations, double top plates, header sizing, and king/jack studs.'
      };
    }
    if (recTrade === 'Roofing & Truss') {
      return {
        title: 'Roof Pitch Slope Multiplier & Shingle Sizer',
        matchedCount: 3,
        desc: 'Converts pitch (x:12) to horizontal footprint multipliers, rafter lengths, and bundle squares.'
      };
    }
    if (recTrade === 'Drywall & Finishes') {
      return {
        title: 'Drywall Sheets, Joint Mud & Screw Grid Optimizer',
        matchedCount: 4,
        desc: 'Computes 4x8 and 4x12 gypsum wall/ceiling panel requirements with 12% scrap cutting factor.'
      };
    }
    if (recTrade === 'Tile & Masonry') {
      return {
        title: 'Ceramic/Porcelain Tile Layout & Grout Index',
        matchedCount: 5,
        desc: 'Grid layout solver with dead-center alignments, 1/8" grout lines, and 15% diagonal waste.'
      };
    }
    return {
      title: 'Earthwork Cut/Fill & Aggregate Bulk Sizer',
      matchedCount: 4,
      desc: 'Screened topsoil depth, compacted gravel base tonnage, and sod roll dimensioning.'
    };
  }, [recTrade]);

  // --- Taxonomy Data ---
  const taxonomyClusters = [
    {
      id: 'house-structural',
      number: '1',
      title: 'House & Structural',
      icon: 'foundation',
      count: '18 Tools',
      desc: 'Foundation to rafters structural sizing and materials.',
      tools: [
        'Whole House Construction Cost Model',
        'Cement, Sand & Aggregate Proportioning',
        'Steel Reinforcement Tonnage & Grade',
        'Spread Footing Bearing Capacity'
      ]
    },
    {
      id: 'concrete-masonry',
      number: '2',
      title: 'Concrete & Masonry',
      icon: 'view_in_ar',
      count: '24 Tools',
      desc: 'Volumetric yardage, mixes, pre-cast, and footings.',
      tools: [
        'Cubic Yard Concrete Slab Volume',
        'Cylindrical Pier & Post Hole Pour',
        'Concrete Bag Converter (40, 60, 80 lb)',
        'Rebar Weight & Overlap Splicing'
      ]
    },
    {
      id: 'brick-block',
      number: '3',
      title: 'Brick, Block & Wall',
      icon: 'domain',
      count: '15 Tools',
      desc: 'Modular units, mortar ratios, and retaining structures.',
      tools: [
        'Standard Modular Brick (3/8" Mortar)',
        '8×8×16 Concrete Block (CMU) Counter',
        'Retaining Wall Gravity & Geogrid',
        'Mortar & Sand Mix Batch Calculator'
      ]
    },
    {
      id: 'roofing',
      number: '4',
      title: 'Roofing & Enclosures',
      icon: 'roofing',
      count: '21 Tools',
      desc: 'Slope multipliers, weather membranes, and flashing.',
      tools: [
        'Roof Pitch to Slope Angle Multiplier',
        'Asphalt Shingles & Ridge Bundles',
        'Standing Seam Metal Panel Yield',
        'Rafter Span & Truss Wind Deflection'
      ]
    },
    {
      id: 'flooring',
      number: '5',
      title: 'Flooring & Tile Layout',
      icon: 'floor',
      count: '19 Tools',
      desc: 'Hardwood planks, vinyl click, tile, and carpet yardage.',
      tools: [
        'Ceramic / Porcelain Tile with Grout Lines',
        'Hardwood Floor Board Footage Yield',
        'Luxury Vinyl Plank (LVP) Carton Sizer',
        'Carpet Yardage & Underpad Rolls'
      ]
    },
    {
      id: 'paint-drywall',
      number: '6',
      title: 'Paint, Finishes & Drywall',
      icon: 'format_paint',
      count: '17 Tools',
      desc: 'Surface coatings, 4×8 & 4×12 gypsum, and joint compound.',
      tools: [
        'Drywall Sheets & Screw Grid Sizer',
        'Joint Compound / Mud & Tape Length',
        'Wall & Ceiling Paint Gallon Yield',
        'Wallpaper Pattern Roll Estimator'
      ]
    },
    {
      id: 'lumber',
      number: '7',
      title: 'Lumber & Carpentry',
      icon: 'carpenter',
      count: '26 Tools',
      desc: 'Board footage, dimensional framing, spans, and trims.',
      tools: [
        'Board Foot (BF) Volumetric Calculator',
        '2×4 & 2×6 Stud Count at 16" / 24" O.C.',
        'Plywood & OSB Subfloor Layout',
        'Baseboard, Casing & Crown Molding'
      ]
    },
    {
      id: 'decks-porches',
      number: '8',
      title: 'Decks, Patios & Porches',
      icon: 'deck',
      count: '16 Tools',
      desc: 'Decking boards, stair stringers, and baluster safety spacing.',
      tools: [
        'Deck Surface Board Count & Screws',
        'Stair Stringer, Tread & Riser Geometry',
        'Baluster 4" Max Code Spacing Solver',
        'Paver Sand Bedding & Polymeric Joint'
      ]
    },
    {
      id: 'fences',
      number: '9',
      title: 'Fences & Enclosures',
      icon: 'fence',
      count: '12 Tools',
      desc: 'Posts, rails, pickets, and concrete anchor footings.',
      tools: [
        'Post Spacing & Run Optimization (6\'/8\')',
        'Post Hole Concrete Premix Bags',
        'Privacy Fence Picket Count & Spacing',
        'Chain Link Fabric & Top Rail Yield'
      ]
    },
    {
      id: 'landscaping',
      number: '10',
      title: 'Landscaping & Soil',
      icon: 'landscape',
      count: '22 Tools',
      desc: 'Bulk materials, mulch coverage, sod, and earthworks.',
      tools: [
        'Mulch Bed Cubic Yards (3" Depth)',
        'Screened Topsoil & Compost Tonnage',
        'Crushed Stone, 57 Gravel & Sand',
        'Turf Sod Roll & Grass Seed Density'
      ]
    },
    {
      id: 'hvac',
      number: '11',
      title: 'Mechanical & HVAC',
      icon: 'hvac',
      count: '15 Tools',
      desc: 'BTU loads, air exchange CFM, pipe flows, and septic volume.',
      tools: [
        'BTU Heating & AC Load per Room Volume',
        'Ductwork CFM & Static Pressure Loss',
        'PEX / Copper Pipe Flow & Friction',
        'Septic Tank Minimum Gallon Capacity'
      ]
    },
    {
      id: 'metrology-costs',
      number: '12 & 13',
      title: 'Metrology & Costs',
      icon: 'calculate',
      count: '30+ Tools',
      desc: 'Geometry conversion matrix and trade cost models.',
      tools: [
        'Multi-Room Square Footage Aggregator',
        'Decimal Feet to 1/16" Inches Fraction',
        'Whole House Cost per Square Foot Tier',
        'Bathroom & Kitchen Renovation Sizer'
      ]
    }
  ];

  // Search Filter
  const filteredClusters = useMemo(() => {
    if (!searchQuery.trim()) return taxonomyClusters;
    const q = searchQuery.toLowerCase();
    return taxonomyClusters.filter(
      cluster =>
        cluster.title.toLowerCase().includes(q) ||
        cluster.desc.toLowerCase().includes(q) ||
        cluster.tools.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery, taxonomyClusters]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      <Header />

      <main className="w-full pt-20 bg-surface flex-1">
        {/* Category Sub-Navigation Strip */}
        <div className="w-full bg-surface-container-low border-b border-outline-variant/30">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop h-10 flex items-center">
            <nav className="flex items-center gap-space-xs overflow-x-auto w-full text-body-sm font-body-sm">
              {[
                { id: 'all', label: 'All Construction Tools' },
                { id: 'materials', label: 'Materials & Estimators' },
                { id: 'workflows', label: 'Project Workflows' },
                { id: 'diy', label: 'DIY vs Contractor' },
                { id: 'costs', label: 'Cost Estimators' },
                { id: 'geometry', label: 'Measurement & Geometry' },
                { id: 'guides', label: 'Guides & Learning' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-space-xs py-1 rounded-md whitespace-nowrap transition-all ${
                    activeSubTab === tab.id
                      ? 'bg-surface-container-highest text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* SECTION 0: METROLOGY TELEMETRY TICKER */}
        <section className="w-full bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/30 py-space-xs px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto flex flex-wrap items-center justify-between gap-y-space-xs gap-x-space-md text-on-surface-variant font-label-caps text-label-caps">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="tracking-wider uppercase text-on-surface font-headline-md text-xs font-semibold">
                Deterministic Metrology Feed
              </span>
              <span className="text-outline-variant">|</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-primary">verified</span> ASTM C94 &amp; IBC 2024 Calibrated
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-2xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">trending_up</span> 10% Waste Factor Auto-Compounding
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-primary">bolt</span> 0.04ms Local WASM Execution
              </span>
              <span className="flex items-center gap-1 text-on-surface">
                <span className="material-symbols-outlined text-[15px] text-primary">lock</span> Air-Gapped Sandbox: Zero Telemetry
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: HERO & REAL-TIME SEARCH */}
        <section className="w-full relative overflow-hidden py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none -z-10"></div>
          <div className="max-w-max-width-canvas mx-auto flex flex-col items-center text-center">
            {/* Metrology Overline Badge */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-widest shadow-sm">
              <span className="material-symbols-outlined text-[16px]">architecture</span>
              <span>Trade-Grade Construction &amp; Structural Architecture Engine</span>
            </div>
            <h1 className="mt-space-md font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold max-w-4xl">
              Home &amp; Construction Calculators
            </h1>
            <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Deterministic material estimators, structural load formulas, project cost models, and trade-grade calculators for builders, architects, and homeowners. Calculate concrete, roofing, lumber, drywall, and renovations with zero guesswork.
            </p>

            {/* Key Performance Metrics Bar */}
            <div className="mt-space-xl grid grid-cols-2 md:grid-cols-4 gap-space-md w-full max-w-3xl">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-data-mono font-bold text-headline-md text-primary">500+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-0.5">Calculators &amp; Specs</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-data-mono font-bold text-headline-md text-on-surface">100+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-0.5">Trade Blueprints</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-data-mono font-bold text-headline-md text-tertiary">10%</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-0.5">Auto Cut/Waste Buffer</span>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-data-mono font-bold text-headline-md text-secondary">0.0s</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mt-0.5">Compute Latency</span>
              </div>
            </div>

            {/* Real-time Filter/Search Input Box */}
            <div className="mt-space-xl w-full max-w-2xl relative">
              <div className="relative flex items-center shadow-lg rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 focus-within:ring-2 focus-within:ring-primary/40">
                <span className="material-symbols-outlined text-outline text-[22px] ml-space-md">search</span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full py-space-md pl-space-xs pr-space-xl bg-transparent font-body-md text-on-surface placeholder:text-outline focus:outline-none"
                  id="catalog-search"
                  placeholder="Search construction calculators, materials, or codes (e.g., 'concrete slab', 'roof pitch', 'drywall sheets')..."
                  type="text"
                />
                <div className="flex items-center gap-space-2xs pr-space-md">
                  <kbd className="hidden sm:inline-block px-2 py-0.5 bg-surface-container font-data-mono text-[11px] text-on-surface-variant rounded shadow-sm">
                    /
                  </kbd>
                </div>
              </div>
              {/* Quick filter chips */}
              <div className="flex flex-wrap items-center justify-center gap-space-2xs mt-space-sm">
                <span className="font-label-caps text-label-caps text-outline uppercase mr-1">Trending:</span>
                {[
                  'Concrete Slab',
                  'Paint & Primer',
                  'Tile & Grout',
                  'Roof Pitch & Shingles',
                  'Framing Lumber',
                  'Fence Posts',
                  'Square Footage'
                ].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setSearchQuery(chip)}
                    className="px-space-xs py-1 rounded-full bg-surface-container hover:bg-surface-container-highest text-primary font-label-caps text-label-caps transition-all border border-outline-variant/20"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROJECT STARTER HUB ("I WANT TO...") */}
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low/50 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-xs">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                  Guided Action Launchpad
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5 font-bold">I Want To...</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Launch orchestrated multi-stage estimators that guide material takeoffs from excavation through final trim finishing.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                {
                  title: 'Build A House',
                  desc: 'Full lifecycle: foundation footings, framing studs, truss pitch, drywall sheets, and budget model.',
                  icon: 'home_work',
                  link: '#workflow-anchor',
                  meta: '8 Linked Modules'
                },
                {
                  title: 'Pour Concrete',
                  desc: 'Patios, grade slabs, post piers, volumetric premix 60/80lb bag counts, and ASTM slump ratios.',
                  icon: 'view_in_ar',
                  link: '#concrete-calc',
                  meta: 'Cubic Yards & Rebar'
                },
                {
                  title: 'Paint A Room',
                  desc: 'Wall & ceiling area, window/door subtractions, primer coats, sheen spread rates, and gallon yields.',
                  icon: 'format_paint',
                  link: '#paint-calc',
                  meta: 'Gallons & Primer'
                },
                {
                  title: 'Build A Deck',
                  desc: 'Footing spacing, ledger flashing, joist spans (12"/16"), deck boards, balusters, and stair risers.',
                  icon: 'deck',
                  link: '#lumber-calc',
                  meta: 'Lumber & Hardware'
                },
                {
                  title: 'Landscape Yard',
                  desc: 'Mulch volume, screened topsoil depth, river gravel base, sod roll dimensions, and seed density.',
                  icon: 'yard',
                  link: '#landscaping',
                  meta: 'Tons & Cubic Yards'
                },
                {
                  title: 'Build A Wall',
                  desc: 'Standard modular brick, 8x8x16 CMU blocks, Type N/S mortar bags, sand ratios, and geogrid ties.',
                  icon: 'domain',
                  link: '#brick-calc',
                  meta: 'Masonry Units'
                },
                {
                  title: 'Replace Roofing',
                  desc: 'Pitch slope multipliers, squares (100 sq ft), bundles of architectural shingles, and underlayment rolls.',
                  icon: 'roofing',
                  link: '#roof-calc',
                  meta: 'Pitch & Bundles'
                },
                {
                  title: 'Renovate A Room',
                  desc: 'Kitchen and bathroom overhaul: tile grout grids, luxury vinyl flooring, cabinets, and plumbing rough-ins.',
                  icon: 'handyman',
                  link: '#remodel-calc',
                  meta: 'Budget & Materials'
                }
              ].map(action => (
                <a
                  key={action.title}
                  href={action.link}
                  className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden border border-outline-variant/30"
                >
                  <div className="space-y-space-xs">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">{action.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{action.desc}</p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-primary font-semibold border-t border-outline-variant/15">
                    <span>{action.meta}</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED & TRENDING FLAGSHIP WORKBENCHES */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                Real-Time Interactive Engines
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Flagship Computational Workbenches
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Live client-side execution. Tweak parameters instantly to watch volume, cut-loss adjustments, and material yields adapt in sub-milliseconds.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              {/* Workbench 1: Concrete Slab & Footing (6 Cols) */}
              <div
                className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-space-xl shadow-md border border-outline-variant/30 flex flex-col justify-between"
                id="concrete-calc"
              >
                <div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="p-2 rounded bg-primary-fixed text-primary font-headline-md flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">layers</span>
                      </span>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Concrete Slab &amp; Footing</h3>
                        <p className="font-label-caps text-label-caps text-outline uppercase">ASTM C94 Batch Model</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps font-semibold">
                      WASM Active
                    </span>
                  </div>
                  {/* Interactive Mini-Inputs */}
                  <div className="grid grid-cols-3 gap-space-xs mt-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Length (ft)</label>
                      <input
                        className="w-full px-2 py-1.5 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/20"
                        id="conc-length"
                        type="number"
                        value={concLength}
                        onChange={e => setConcLength(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Width (ft)</label>
                      <input
                        className="w-full px-2 py-1.5 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/20"
                        id="conc-width"
                        type="number"
                        value={concWidth}
                        onChange={e => setConcWidth(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Depth (in)</label>
                      <input
                        className="w-full px-2 py-1.5 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/20"
                        id="conc-depth"
                        type="number"
                        value={concDepth}
                        onChange={e => setConcDepth(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  {/* Dynamic Result Card */}
                  <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                    <div className="flex items-baseline justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Net Ready-Mix Volume
                      </span>
                      <span className="font-label-caps text-label-caps text-primary font-semibold">+10% Waste Added</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-numerical-display text-numerical-display text-primary font-bold" id="conc-result">
                        {concreteResult.cuYards}
                      </span>
                      <span className="font-headline-md text-headline-md text-on-surface-variant">Cubic Yards (yd³)</span>
                    </div>
                    {/* Rebar & Bags Breakdown */}
                    <div className="grid grid-cols-2 gap-2 mt-space-sm pt-space-xs border-t border-outline-variant/30 font-body-sm text-body-sm">
                      <div>
                        <span className="text-on-surface-variant">Premix 80lb Bags:</span>
                        <span className="font-data-mono font-bold text-on-surface ml-1" id="conc-bags80">
                          {concreteResult.bags80}
                        </span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">#4 Rebar (18&quot; OC):</span>
                        <span className="font-data-mono font-bold text-on-surface ml-1" id="conc-rebar">
                          {concreteResult.rebarFt}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Visual Cross-Section Diagram (SVG) */}
                  <div className="mt-space-md bg-surface-container p-space-xs rounded-lg flex items-center justify-center border border-outline-variant/20">
                    <svg className="w-full h-16 text-primary" fill="none" viewBox="0 0 320 60">
                      <rect fill="currentColor" fillOpacity="0.15" height="28" rx="2" width="300" x="10" y="24"></rect>
                      <line stroke="currentColor" strokeDasharray="4 2" strokeWidth="2" x1="10" x2="310" y1="24" y2="24"></line>
                      <circle cx="50" cy="38" fill="currentColor" r="3"></circle>
                      <circle cx="110" cy="38" fill="currentColor" r="3"></circle>
                      <circle cx="170" cy="38" fill="currentColor" r="3"></circle>
                      <circle cx="230" cy="38" fill="currentColor" r="3"></circle>
                      <circle cx="290" cy="38" fill="currentColor" r="3"></circle>
                      <text className="font-data-mono text-[10px]" fill="currentColor" fontWeight="600" x="15" y="18">
                        {concDepth}&quot; Concrete Slab with #4 Reinforcement Grid
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="mt-space-lg flex items-center justify-between border-t border-outline-variant/20 pt-space-sm">
                  <span className="font-label-caps text-label-caps text-outline">Formula: (L × W × (D/12)) / 27 × 1.10</span>
                  <button
                    onClick={() => {
                      setConcLength(24);
                      setConcWidth(16);
                      setConcDepth(4);
                    }}
                    className="px-space-md py-1.5 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary-container transition-all shadow-sm"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Workbench 2: Paint & Surface Planner (6 Cols) */}
              <div
                className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-space-xl shadow-md border border-outline-variant/30 flex flex-col justify-between"
                id="paint-calc"
              >
                <div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="p-2 rounded bg-secondary-fixed text-secondary font-headline-md flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">brush</span>
                      </span>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Room Paint &amp; Surface Coating</h3>
                        <p className="font-label-caps text-label-caps text-outline uppercase">350 Sq Ft/Gal Architectural Index</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-caps text-label-caps font-semibold">
                      2 Coats Std
                    </span>
                  </div>
                  {/* Interactive Mini-Inputs */}
                  <div className="grid grid-cols-3 gap-space-xs mt-space-md">
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Room Perim (ft)</label>
                      <input
                        className="w-full px-2 py-1.5 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/20"
                        id="paint-perim"
                        type="number"
                        value={paintPerim}
                        onChange={e => setPaintPerim(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Height (ft)</label>
                      <input
                        className="w-full px-2 py-1.5 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/20"
                        id="paint-height"
                        type="number"
                        value={paintHeight}
                        onChange={e => setPaintHeight(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Doors/Windows</label>
                      <input
                        className="w-full px-2 py-1.5 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/20"
                        id="paint-openings"
                        type="number"
                        value={paintOpenings}
                        onChange={e => setPaintOpenings(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  {/* Dynamic Result Card */}
                  <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                    <div className="flex items-baseline justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Net Wall Area (deductions applied)
                      </span>
                      <span className="font-label-caps text-label-caps text-secondary font-semibold">
                        {paintResult.netSqFt} sq ft
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-numerical-display text-numerical-display text-secondary font-bold" id="paint-result">
                        {paintResult.gallons}
                      </span>
                      <span className="font-headline-md text-headline-md text-on-surface-variant">Gallons (2 Full Coats)</span>
                    </div>
                    {/* Breakdown */}
                    <div className="grid grid-cols-2 gap-2 mt-space-sm pt-space-xs border-t border-outline-variant/30 font-body-sm text-body-sm">
                      <div>
                        <span className="text-on-surface-variant">Primer Needed:</span>
                        <span className="font-data-mono font-bold text-on-surface ml-1">{paintResult.primer}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant">Ceiling 1 Coat:</span>
                        <span className="font-data-mono font-bold text-on-surface ml-1">{paintResult.ceiling}</span>
                      </div>
                    </div>
                  </div>
                  {/* Mini Progress Visualizer */}
                  <div className="mt-space-md bg-surface-container p-space-xs rounded-lg flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="font-body-sm text-body-sm text-on-surface">Coverage: Eggshell / Satin Finishes</span>
                    </div>
                    <span className="font-data-mono text-xs text-on-surface-variant">400 sq ft / gal rated</span>
                  </div>
                </div>
                <div className="mt-space-lg flex items-center justify-between border-t border-outline-variant/20 pt-space-sm">
                  <span className="font-label-caps text-label-caps text-outline">
                    Formula: ((Perim × H) - (Openings × 21)) / 350 × Coats
                  </span>
                  <button
                    onClick={() => {
                      setPaintPerim(60);
                      setPaintHeight(9);
                      setPaintOpenings(3);
                    }}
                    className="px-space-md py-1.5 bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-medium hover:opacity-90 transition-all shadow-sm"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Workbench 3: Ceramic & Porcelain Tile Layout (4 Cols) */}
              <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="p-1.5 rounded bg-surface-container text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Tile &amp; Grout Layout</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    12&quot;×24&quot; &amp; 12&quot;×12&quot; layout solver with 1/8&quot; grout lines and 15% diagonal waste allowance.
                  </p>
                  <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant">
                      <span>Room: 120 Sq Ft</span>
                      <span className="text-primary font-bold">+15% Cut Margin</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">76</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Tiles (12×24)</span>
                    </div>
                    <div className="font-data-mono text-xs text-outline mt-1">Grout: 1.4 Bags (25lb)</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Tile Layout: 120 sq ft room with 15% waste requires 138 sq ft of tile coverage (~76 pcs 12x24).')}
                  className="mt-space-md w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-caps text-label-caps uppercase transition-all font-semibold"
                >
                  Inspect Specifications
                </button>
              </div>

              {/* Workbench 4: Complete Framing Lumber & Stud (4 Cols) */}
              <div
                className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                id="lumber-calc"
              >
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="p-1.5 rounded bg-surface-container text-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">view_week</span>
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Framing Studs &amp; Plates</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    16&quot; and 24&quot; on-center wall framing, double top plates, sole plates, and corner stud packs.
                  </p>
                  <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant">
                      <span>Wall: 48 Linear Ft</span>
                      <span className="text-tertiary font-bold">16&quot; O.C. Spacing</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">43</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Studs (2×4×8)</span>
                    </div>
                    <div className="font-data-mono text-xs text-outline mt-1">Plates: 9 Pcs (2×4×16)</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Wall Studs: 48 linear ft / 1.333 + 1 end stud + corners/waste = 43 studs (2x4x8).')}
                  className="mt-space-md w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-caps text-label-caps uppercase transition-all font-semibold"
                >
                  Inspect Specifications
                </button>
              </div>

              {/* Workbench 5: Roof Pitch & Shingle Calculator (4 Cols) */}
              <div
                className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                id="roof-calc"
              >
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="p-1.5 rounded bg-surface-container text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">change_history</span>
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Roof Pitch &amp; Shingles</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    Slope conversion (e.g. 6:12 slope = 1.118 multiplier), rafter span, squares, and bundles.
                  </p>
                  <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant">
                      <span>Footprint: 1,800 Sq Ft</span>
                      <span className="text-primary font-bold">6/12 Pitch Multiplier</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">63</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Bundles (21 Squares)</span>
                    </div>
                    <div className="font-data-mono text-xs text-outline mt-1">Underlayment: 5 Rolls</div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Roofing: 1,800 sq ft × 1.118 = 2,012 sq ft (+10% waste = 21 squares = 63 bundles).')}
                  className="mt-space-md w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-label-caps text-label-caps uppercase transition-all font-semibold"
                >
                  Inspect Specifications
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: EXHAUSTIVE 13 CATEGORY CLUSTERS */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-xs">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                  Deterministic Category Directory
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Comprehensive Construction Taxonomy
                </h2>
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                500+ Specialized metrology &amp; sizing tools
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {filteredClusters.map(cluster => (
                <div
                  key={cluster.id}
                  className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded bg-surface-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined">{cluster.icon}</span>
                      </span>
                      <span className="font-data-mono text-xs text-outline">{cluster.count}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-space-sm">
                      {cluster.number}. {cluster.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {cluster.desc}
                    </p>
                    <ul className="mt-space-sm space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                      {cluster.tools.map((tool, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            const el = document.getElementById('concrete-calc');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="hover:text-primary cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="#concrete-calc"
                    className="mt-space-md inline-flex items-center gap-1 text-primary font-label-caps text-label-caps uppercase font-semibold hover:underline"
                  >
                    Browse Category <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE MULTI-STEP PROJECT WORKFLOW */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface" id="workflow-anchor">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-3xl mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                Multi-Phase Workflow Demo
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Build A Concrete Patio &amp; Firepit</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Live step-by-step metrology pipeline ensuring zero material shortfall from earthwork through curing schedules.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Step Pipeline Navigator */}
              <div className="lg:col-span-4 space-y-space-xs">
                {[
                  {
                    phase: 1,
                    tag: 'Phase 01',
                    title: 'Area & Perimeter Boundary',
                    desc: `${patioLength}' × ${patioWidth}' = ${workflowCalculations.area} sq ft footprint with ${workflowCalculations.perimeter}' perimeter forming boards.`
                  },
                  {
                    phase: 2,
                    tag: 'Phase 02',
                    title: 'Excavation & Gravel Sub-Base',
                    desc: `${baseDepthOption}" depth compacted #57 crushed limestone = ${workflowCalculations.gravelCuYards} cu yd (${workflowCalculations.gravelTons} tons).`
                  },
                  {
                    phase: 3,
                    tag: 'Phase 03',
                    title: 'Slab Volume & Waste Factor',
                    desc: `4" slab with 10% spill factor = ${workflowCalculations.slabCuYards} cubic yards ready-mix concrete.`
                  },
                  {
                    phase: 4,
                    tag: 'Phase 04',
                    title: 'Rebar Grid #4 Reinforcement',
                    desc: `18" on-center spacing with 2" chairs = ${workflowCalculations.rebarLinFt} lin ft (${workflowCalculations.rebarBars} pieces of 20ft bars).`
                  },
                  {
                    phase: 5,
                    tag: 'Phase 05',
                    title: 'Curing & Cost Aggregation',
                    desc: `Estimated material cost: $${workflowCalculations.totalCost}. Curing time: 7 days to 70% strength.`
                  }
                ].map(step => (
                  <div
                    key={step.phase}
                    onClick={() => setWorkflowPhase(step.phase)}
                    className={`p-space-md rounded-xl cursor-pointer transition-all border ${
                      workflowPhase === step.phase
                        ? 'bg-surface-container-high border-l-4 border-primary shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-label-caps text-label-caps uppercase font-bold ${
                          workflowPhase === step.phase ? 'text-primary' : 'text-outline'
                        }`}
                      >
                        {step.tag}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          workflowPhase >= step.phase ? 'text-primary' : 'text-outline'
                        }`}
                      >
                        {workflowPhase >= step.phase ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface text-base mt-1 font-bold">{step.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* Active Phase Visual Workbench */}
              <div className="lg:col-span-8 bg-surface-container-lowest p-space-xl rounded-xl shadow-md border border-outline-variant/30">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-md">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
                      Workbench Active State (Phase {workflowPhase})
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Ground Prep, Excavation &amp; Sub-Base Specs
                    </h3>
                  </div>
                  <span className="px-space-sm py-1 bg-surface-container-high text-primary rounded-full font-label-caps text-label-caps font-semibold">
                    Deterministic ASTM D2940
                  </span>
                </div>
                {/* Interactive Parameter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-lg">
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                      Patio Length (ft)
                    </label>
                    <input
                      className="w-full px-space-xs py-2 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                      type="number"
                      value={patioLength}
                      onChange={e => setPatioLength(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                      Patio Width (ft)
                    </label>
                    <input
                      className="w-full px-space-xs py-2 bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                      type="number"
                      value={patioWidth}
                      onChange={e => setPatioWidth(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                      Compacted Base Depth
                    </label>
                    <select
                      value={baseDepthOption}
                      onChange={e => setBaseDepthOption(parseInt(e.target.value))}
                      className="w-full px-space-xs py-2 bg-surface-container-low rounded font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                    >
                      <option value={4}>4 inches (Standard)</option>
                      <option value={6}>6 inches (Heavy Load)</option>
                      <option value={8}>8 inches (Commercial)</option>
                    </select>
                  </div>
                </div>
                {/* Dynamic Cross-Section Visualizer */}
                <div className="mt-space-lg p-space-md bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-semibold">
                    Excavation Cross-Section Layering
                  </span>
                  <div className="mt-space-xs space-y-2">
                    <div className="bg-primary/20 p-2 rounded flex items-center justify-between font-data-mono text-xs text-primary font-bold">
                      <span>Top Layer: 4.00&quot; Concrete Slab (3,500 PSI)</span>
                      <span>
                        {workflowCalculations.slabCuYards} yd³ (${workflowCalculations.slabCost})
                      </span>
                    </div>
                    <div className="bg-outline/20 p-2 rounded flex items-center justify-between font-data-mono text-xs text-on-surface-variant font-bold">
                      <span>Mid Layer: {baseDepthOption}.00&quot; Compacted Crusher Run Gravel Base</span>
                      <span>
                        {workflowCalculations.gravelCuYards} yd³ / {workflowCalculations.gravelTons} Tons ($
                        {workflowCalculations.gravelCost})
                      </span>
                    </div>
                    <div className="bg-tertiary/20 p-2 rounded flex items-center justify-between font-data-mono text-xs text-tertiary font-bold">
                      <span>Subgrade: Native Soil Excavation &amp; Geotextile Fabric</span>
                      <span>
                        {workflowCalculations.area} sq ft (${workflowCalculations.fabricCost})
                      </span>
                    </div>
                  </div>
                </div>
                {/* Action Footer */}
                <div className="mt-space-xl flex items-center justify-between">
                  <div className="text-on-surface font-body-sm">
                    <span className="text-on-surface-variant">Estimated Material Total:</span>
                    <span className="font-data-mono font-bold text-headline-md text-primary ml-1">
                      ${workflowCalculations.totalCost.toLocaleString()}.00
                    </span>
                  </div>
                  <button
                    onClick={handleExportBOM}
                    className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>{bomExported ? 'BOM Exported Successfully!' : 'Save & Export BOM'}</span>
                    <span className="material-symbols-outlined text-[18px]">
                      {bomExported ? 'check' : 'download'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: SMART CALCULATOR RECOMMENDER */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low/60 border-b border-outline-variant/20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
              Algorithmic Matcher
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Find The Exact Construction Formula
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
              Answer two quick parameters to filter from over 500 deterministic metrology tools.
            </p>
            <div className="mt-space-xl bg-surface-container-lowest p-space-xl rounded-xl shadow-md text-left border border-outline-variant/30">
              {/* Step 1 */}
              <div>
                <label className="font-label-caps text-label-caps text-primary uppercase font-bold">
                  1. Select Project Phase
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mt-space-xs">
                  {['Planning & Budget', 'Procurement', 'Site Execution', 'Finishing'].map(phase => (
                    <button
                      key={phase}
                      onClick={() => setRecPhase(phase)}
                      className={`px-space-xs py-2 rounded font-label-caps text-label-caps uppercase text-center transition-all ${
                        recPhase === phase
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
              </div>
              {/* Step 2 */}
              <div className="mt-space-lg">
                <label className="font-label-caps text-label-caps text-primary uppercase font-bold">
                  2. Select Trade or Material
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs mt-space-xs">
                  {[
                    'Ready-Mix Concrete',
                    'Framing Lumber',
                    'Roofing & Truss',
                    'Drywall & Finishes',
                    'Tile & Masonry',
                    'Earthwork / Yard'
                  ].map(trade => (
                    <button
                      key={trade}
                      onClick={() => setRecTrade(trade)}
                      className={`px-space-xs py-2 rounded font-label-caps text-label-caps uppercase text-center transition-all ${
                        recTrade === trade
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {trade}
                    </button>
                  ))}
                </div>
              </div>
              {/* Live Recommended Suite */}
              <div className="mt-space-lg p-space-md rounded-lg bg-surface-container flex items-center justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                    Match Result ({recommendedTool.matchedCount} Tools Identified)
                  </span>
                  <div className="font-headline-md text-headline-md text-on-surface mt-0.5 font-bold">
                    {recommendedTool.title}
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{recommendedTool.desc}</p>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('concrete-calc');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-space-md py-2 rounded bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container transition-all shadow-sm shrink-0 ml-4"
                >
                  Open Suite
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: VISUAL MATERIAL ESTIMATION DASHBOARDS & STANDARD HEURISTICS */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-xl text-center md:text-left">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                Standard Trade Heuristics
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Material Consumption Formulas
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Validated mathematical formulas used by estimators, quantity surveyors, and IBC inspectors.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Formula 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border-t-4 border-primary border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Concrete Slab</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">view_in_ar</span>
                  </div>
                  <div className="mt-space-sm font-data-mono text-headline-md text-on-surface font-bold">(L × W × D) / 27</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Where L and W are in feet, and D is in fractional feet (depth in inches ÷ 12). Add +10% standard volumetric spill loss.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-outline border-t border-outline-variant/15">
                  1 Cu Yd = 27 Cu Ft = 45 Bags (80lb)
                </div>
              </div>
              {/* Formula 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border-t-4 border-secondary border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary uppercase font-bold">Drywall Sheets</span>
                    <span className="material-symbols-outlined text-[18px] text-secondary">grid_4x4</span>
                  </div>
                  <div className="mt-space-sm font-data-mono text-headline-md text-on-surface font-bold">Area / 32 or 48</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Divide total wall + ceiling sq ft by 32 (for 4×8 sheets) or 48 (for 4×12 sheets). Include +12% scrap cutting allowance.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-outline border-t border-outline-variant/15">
                  Screws: ~32 per 4×8 panel
                </div>
              </div>
              {/* Formula 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border-t-4 border-tertiary border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold">Paint Spread</span>
                    <span className="material-symbols-outlined text-[18px] text-tertiary">format_paint</span>
                  </div>
                  <div className="mt-space-sm font-data-mono text-headline-md text-on-surface font-bold">Net Area / 350 × C</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Net area after deducting standard doors (21 sq ft) and windows (15 sq ft). C = coats. 1 gallon yields ~350–400 sq ft.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-outline border-t border-outline-variant/15">
                  Primer: 250–300 sq ft/gal on bare drywall
                </div>
              </div>
              {/* Formula 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border-t-4 border-primary border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Roof Squares</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">roofing</span>
                  </div>
                  <div className="mt-space-sm font-data-mono text-headline-md text-on-surface font-bold">(Area × Pitch) / 100</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Multiply horizontal footprint by the pitch slope factor (e.g., 6:12 = 1.118). 1 Square = 100 sq ft = 3 standard shingle bundles.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-outline border-t border-outline-variant/15">
                  Include +10% starter/hip/valley waste
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: CONTRACTOR SUITE VS DIY WORKBENCH */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                Dual Precision Profiles
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Engineered for Both Trades &amp; Homeowners
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Switch perspectives with one toggle: from jobsite bid margins down to weekend hardware store shopping lists.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
              {/* Contractor Suite */}
              <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-space-xs py-1 rounded bg-primary-fixed text-primary font-label-caps text-label-caps uppercase font-bold">
                      Commercial &amp; Trade
                    </span>
                    <span className="material-symbols-outlined text-primary text-[22px]">engineering</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-sm">
                    Professional Contractor Suite
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                    High-density metrology tools built for estimators, general contractors, and structural engineers.
                  </p>
                  <div className="mt-space-md space-y-space-xs">
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check</span>
                      <div>
                        <span className="font-headline-md text-headline-md text-base text-on-surface font-bold">
                          ASTM C94 Concrete Batching Verification
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Verify mix cylinder compression (PSI) and slump tolerance metrics.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check</span>
                      <div>
                        <span className="font-headline-md text-headline-md text-base text-on-surface font-bold">
                          Labor Multiplier &amp; Trade Burden Rates
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Factor worker compensation, local union scale, and overhead percentages.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check</span>
                      <div>
                        <span className="font-headline-md text-headline-md text-base text-on-surface font-bold">
                          BOM CSV &amp; PDF Jobsite Export
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          One-click materials takeoff sheet export directly into your quoting workflow.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Contractor Mode active. Precision margin tolerance set to ±0.5% with BOM exports enabled.')}
                  className="mt-space-lg w-full py-2.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container shadow-sm transition-all"
                >
                  Launch Contractor Mode
                </button>
              </div>

              {/* DIY Homeowner Suite */}
              <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-space-xs py-1 rounded bg-secondary-fixed text-secondary font-label-caps text-label-caps uppercase font-bold">
                      Homeowner &amp; DIY
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[22px]">cottage</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-sm">
                    Homeowner Project Center
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                    Zero-jargon calculators that translate complex engineering units into clean shopping cart tallies.
                  </p>
                  <div className="mt-space-md space-y-space-xs">
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">check</span>
                      <div>
                        <span className="font-headline-md text-headline-md text-base text-on-surface font-bold">
                          Store Bag &amp; Carton Translators
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Know exactly how many 80lb Quikrete bags or tile boxes to load in your vehicle.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">check</span>
                      <div>
                        <span className="font-headline-md text-headline-md text-base text-on-surface font-bold">
                          Smart Tool Rental Checklist
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Calculates plate compactor, wet tile saw, and paint sprayer rental durations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">check</span>
                      <div>
                        <span className="font-headline-md text-headline-md text-base text-on-surface font-bold">
                          Step-By-Step Visual Instructions
                        </span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Plain-English explanations for screeding, mortar buttering, and paint cut-ins.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Homeowner Mode active. Units converted to store packaging sizes with shopping checklists.')}
                  className="mt-space-lg w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-all border border-outline-variant/30"
                >
                  Launch DIY Mode
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: CONSTRUCTION MATERIAL COMPARISONS */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="max-w-2xl mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                Analytical Material Decisions
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Head-to-Head Trade Material Comparisons
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Objective comparisons based on lifecycle durability, 25-year total cost of ownership, and installation complexity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              {/* Comparison 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Concrete Slab vs. Concrete Pavers</h3>
                  <span className="font-data-mono text-xs text-primary font-bold">Patio Surface</span>
                </div>
                <div className="grid grid-cols-2 gap-space-md mt-space-md font-body-sm text-body-sm">
                  <div className="space-y-1">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Poured Concrete Slab
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$6–$12 / sq ft</strong> installed
                    </p>
                    <p className="text-on-surface-variant">Lifespan: 30+ years</p>
                    <p className="text-on-surface-variant">Risk: Prone to hairline frost-heave cracks</p>
                    <p className="text-on-surface-variant">DIY Effort: High (time-sensitive pour)</p>
                  </div>
                  <div className="space-y-1 border-l border-outline-variant/20 pl-space-md">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Interlocking Pavers
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$12–$22 / sq ft</strong> installed
                    </p>
                    <p className="text-on-surface-variant">Lifespan: 50+ years</p>
                    <p className="text-on-surface-variant">Risk: Joint sand weed growth</p>
                    <p className="text-on-surface-variant">DIY Effort: Moderate (modular pace)</p>
                  </div>
                </div>
              </div>

              {/* Comparison 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Asphalt Shingles vs. Standing Seam Metal</h3>
                  <span className="font-data-mono text-xs text-primary font-bold">Roofing</span>
                </div>
                <div className="grid grid-cols-2 gap-space-md mt-space-md font-body-sm text-body-sm">
                  <div className="space-y-1">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Architectural Asphalt
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$4.50–$7.50 / sq ft</strong>
                    </p>
                    <p className="text-on-surface-variant">Lifespan: 20–25 years</p>
                    <p className="text-on-surface-variant">Wind Rating: Up to 110–130 MPH</p>
                    <p className="text-on-surface-variant">Weight: ~240 lbs / Square</p>
                  </div>
                  <div className="space-y-1 border-l border-outline-variant/20 pl-space-md">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Standing Seam Metal
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$11.00–$18.00 / sq ft</strong>
                    </p>
                    <p className="text-on-surface-variant">Lifespan: 50–70 years</p>
                    <p className="text-on-surface-variant">Wind Rating: Class 4 (140+ MPH)</p>
                    <p className="text-on-surface-variant">Weight: ~150 lbs / Square (Light)</p>
                  </div>
                </div>
              </div>

              {/* Comparison 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Pressure-Treated Pine vs. Composite</h3>
                  <span className="font-data-mono text-xs text-primary font-bold">Decking</span>
                </div>
                <div className="grid grid-cols-2 gap-space-md mt-space-md font-body-sm text-body-sm">
                  <div className="space-y-1">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Treated Pine (PT)
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$20–$35 / sq ft</strong> built
                    </p>
                    <p className="text-on-surface-variant">Maintenance: Annual stain &amp; seal</p>
                    <p className="text-on-surface-variant">Lifespan: 15–20 years</p>
                    <p className="text-on-surface-variant">Splintering: Yes over time</p>
                  </div>
                  <div className="space-y-1 border-l border-outline-variant/20 pl-space-md">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Composite (Trex / TimberTech)
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$40–$70 / sq ft</strong> built
                    </p>
                    <p className="text-on-surface-variant">Maintenance: Soap and water wash</p>
                    <p className="text-on-surface-variant">Lifespan: 25–40 years</p>
                    <p className="text-on-surface-variant">Splintering: Zero / UV Stabilized</p>
                  </div>
                </div>
              </div>

              {/* Comparison 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Porcelain Tile vs. Luxury Vinyl Plank</h3>
                  <span className="font-data-mono text-xs text-primary font-bold">Flooring</span>
                </div>
                <div className="grid grid-cols-2 gap-space-md mt-space-md font-body-sm text-body-sm">
                  <div className="space-y-1">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Porcelain Tile
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$8–$18 / sq ft</strong> installed
                    </p>
                    <p className="text-on-surface-variant">Waterproof: 100% impervious (&lt;0.5%)</p>
                    <p className="text-on-surface-variant">Subfloor: Rigid cement backer required</p>
                    <p className="text-on-surface-variant">Feel: Cool to touch, hard surface</p>
                  </div>
                  <div className="space-y-1 border-l border-outline-variant/20 pl-space-md">
                    <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                      Luxury Vinyl Plank (LVP)
                    </span>
                    <p className="text-on-surface-variant">
                      <strong className="text-on-surface">$4–$9 / sq ft</strong> installed
                    </p>
                    <p className="text-on-surface-variant">Waterproof: 100% synthetic core</p>
                    <p className="text-on-surface-variant">Subfloor: Floating click, forgiving</p>
                    <p className="text-on-surface-variant">Feel: Warm underfoot, softer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: EDUCATIONAL GUIDES, METROLOGY FAQS */}
        <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low/50 border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              {/* Educational Articles Column (5 Cols) */}
              <div className="lg:col-span-5 space-y-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                    Field Knowledge Base
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Metrology Guides</h2>
                </div>
                <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex gap-space-md items-start">
                  <span className="p-2 bg-surface-container text-primary rounded-lg shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">menu_book</span>
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-base text-on-surface hover:text-primary cursor-pointer transition-colors font-bold">
                      How to Calculate Concrete Volume Without Ordering Shortfall
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Understanding form deflections, ground spillage, and why a true 10% safety multiplier prevents catastrophic cold joints.
                    </p>
                    <span className="font-data-mono text-[12px] text-outline mt-2 inline-block">7 min read • ASTM C94 Reference</span>
                  </div>
                </article>
                <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex gap-space-md items-start">
                  <span className="p-2 bg-surface-container text-primary rounded-lg shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">square_foot</span>
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-base text-on-surface hover:text-primary cursor-pointer transition-colors font-bold">
                      Demystifying Roof Pitch Ratios: From Degrees to Squares
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      Converting steep slopes into precise multiplication factors: how a 12:12 pitch expands flat rafter area by a massive 1.414 multiplier.
                    </p>
                    <span className="font-data-mono text-[12px] text-outline mt-2 inline-block">5 min read • IBC Chapter 15</span>
                  </div>
                </article>
                <article className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex gap-space-md items-start">
                  <span className="p-2 bg-surface-container text-primary rounded-lg shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">grid_on</span>
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-base text-on-surface hover:text-primary cursor-pointer transition-colors font-bold">
                      Tile Layout &amp; Centerline Alignment Heuristics
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      How establishing a dead-center grid avoids thin sliver cuts at room perimeters while optimizing tile carton purchase batches.
                    </p>
                    <span className="font-data-mono text-[12px] text-outline mt-2 inline-block">6 min read • ANSI A108.02</span>
                  </div>
                </article>
              </div>

              {/* Technical FAQs Accordions (7 Cols) */}
              <div className="lg:col-span-7 space-y-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                    Metrology Standards
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-space-xs">
                  {[
                    {
                      q: 'Why does SolveIt automatically compound a 10% waste buffer?',
                      a: 'In structural trades like concrete pours, masonry, and lumber framing, physical conditions never match theoretical models. Sub-grade un-evenness, formwork bowing, scrap cutoffs, and edge trimming require an absolute minimum safety allowance of 10% to prevent running out of material mid-pour (which creates structural cold joints) or stopping a framing crew due to split studs.'
                    },
                    {
                      q: 'Are these calculators calibrated against local building codes (IBC / IRC)?',
                      a: 'Yes. All formulas incorporate baseline standards from the International Building Code (IBC 2024), International Residential Code (IRC), ASTM C94 (Ready-Mixed Concrete), and ACI 318 (Structural Concrete). While our tools provide exact engineering yields, you should always submit final architectural blueprints to local building authorities for municipal variance approval.'
                    },
                    {
                      q: 'Can I toggle between Imperial (feet/inches) and Metric (meters/mm)?',
                      a: 'Every calculation engine on SolveIt features a deterministic unit toggle switch. Calculations run on double-precision 64-bit IEEE 754 floats to guarantee zero rounding artifacts whether computing in cubic yards or cubic meters.'
                    },
                    {
                      q: 'Is my construction takeoff data stored on your cloud servers?',
                      a: 'Never. SolveIt is strictly an air-gapped web platform. All calculation engines execute locally in your browser\'s WebAssembly sandbox. Your project dimensions, bid values, square footage tallies, and material schedules stay 100% private to your local device.'
                    }
                  ].map((faq, i) => (
                    <details
                      key={i}
                      className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 open:shadow-md transition-all [&_summary::-webkit-details-marker]:hidden"
                      open={i === 0}
                    >
                      <summary className="font-headline-md text-headline-md text-base text-on-surface flex items-center justify-between cursor-pointer list-none font-bold">
                        <span>{faq.q}</span>
                        <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">
                          expand_more
                        </span>
                      </summary>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs pt-space-xs border-t border-outline-variant/30 leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
