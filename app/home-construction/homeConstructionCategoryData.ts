export interface ConstructionToolItem {
  name: string;
  desc: string;
  path: string;
  badge?: string;
  keywords?: string[];
}

export interface ConstructionCategoryGroup {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  tools: ConstructionToolItem[];
}

export interface MaterialCoverageRule {
  material: string;
  standardUnit: string;
  ruleOfThumbCoverage: string;
  recommendedWasteBuffer: string;
  proTip: string;
}

export interface ConcreteSlabLookup {
  dimensions: string;
  areaSqFt: number;
  depthInches: number;
  cubicYards: number;
  bags60lb: number;
  bags80lb: number;
  typicalApplication: string;
}

export interface ConstructionWorkbenchKit {
  id: string;
  title: string;
  persona: string;
  desc: string;
  icon: string;
  recommendedTools: {
    name: string;
    path: string;
    purpose: string;
  }[];
}

export interface ConstructionFaq {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// 1. 10 COMPREHENSIVE TRADE CATEGORIES & 60+ SPECIALIZED ESTIMATION TOOLS
// ---------------------------------------------------------------------------
export const HOME_CONSTRUCTION_CATEGORIES: ConstructionCategoryGroup[] = [
  {
    id: 'concrete-masonry',
    name: 'Concrete, Masonry & Foundations',
    icon: 'Hammer',
    tagline: 'Slabs, footings, sonotubes, CMU block walls, mortar, and rebar grid sizing.',
    tools: [
      { name: 'Concrete Slab Calculator', desc: 'Calculate exact cubic yards, 60lb/80lb pre-mix bag counts, and ready-mix truck loads.', path: '/home-construction/concrete-slab-calculator', badge: 'Core' },
      { name: 'Concrete Footing & Sonotube Sizer', desc: 'Compute cylindrical pier and continuous spread footing concrete volume.', path: '/home-construction/concrete-footing-calculator', badge: 'Popular' },
      { name: 'Concrete Block (CMU) & Mortar Sizer', desc: 'Calculate standard 8x8x16 concrete masonry blocks and mortar mix bags.', path: '/home-construction/cmu-block-calculator' },
      { name: 'Rebar Grid & Spacing Estimator', desc: 'Estimate rebar linear footage, grid mesh layout (#4/#5), and rebar chairs.', path: '/home-construction/rebar-calculator' },
      { name: 'Retaining Wall Block Calculator', desc: 'Estimate interlocking landscape retaining wall blocks, capstones, and geogrid.', path: '/home-construction/retaining-wall-calculator' },
      { name: 'Gravel & Sand Base Volume Calculator', desc: 'Calculate compacted crushed stone, aggregate, and sand bedding in tons and yards.', path: '/home-construction/gravel-base-calculator' },
    ],
  },
  {
    id: 'framing-lumber',
    name: 'Framing, Lumber & Structural Wood',
    icon: 'Grid',
    tagline: 'Board footage, wall studs, floor joists, roof rafters, and subfloor sheathing.',
    tools: [
      { name: 'Board Foot (BF) Lumber Calculator', desc: 'Compute standard board feet (Thickness × Width × Length / 144) and lumber costs.', path: '/home-construction/board-foot-calculator', badge: 'Core' },
      { name: 'Wall Stud & Plate Estimator', desc: 'Calculate 2x4 and 2x6 studs (16" vs 24" on-center) plus top and bottom plates.', path: '/home-construction/stud-framing-calculator', badge: 'Popular' },
      { name: 'Floor Joist & Ceiling Rafter Sizer', desc: 'Determine joist spacing, span capacity, and subfloor dimensional lumber counts.', path: '/home-construction/floor-joist-calculator' },
      { name: 'Header & Load-Bearing Beam Sizer', desc: 'Estimate solid wood, LVL, and glulam beam load dimensions for window/door openings.', path: '/home-construction/beam-header-calculator' },
      { name: 'Plywood & OSB Subfloor Sheet Calculator', desc: 'Calculate 4x8 tongue-and-groove OSB or CDX plywood sheathing sheets needed.', path: '/home-construction/subfloor-sheathing-calculator' },
      { name: 'Stair Stringer & Riser Calculator', desc: 'Compute stair rise, run, stringer length, and total tread counts to IRC code.', path: '/home-construction/stair-calculator' },
    ],
  },
  {
    id: 'drywall-insulation',
    name: 'Drywall, Insulation & Interior Walls',
    icon: 'Layers',
    tagline: 'Sheetrock panel counts, joint compound, R-value insulation, and resilient channels.',
    tools: [
      { name: 'Drywall Sheet & Screws Calculator', desc: 'Calculate 4x8 and 4x12 drywall sheets, drywall screws, and corner beads.', path: '/home-construction/drywall-calculator', badge: 'Core' },
      { name: 'Joint Compound & Mud Estimator', desc: 'Estimate taping mud, all-purpose compound buckets, and drywall joint tape.', path: '/home-construction/joint-compound-calculator', badge: 'Popular' },
      { name: 'Fiberglass Batt & Blown Insulation Sizer', desc: 'Calculate attic and wall cavity insulation batts, rolls, and target R-values (R-13 to R-49).', path: '/home-construction/insulation-calculator' },
      { name: 'Soundproofing & Resilient Channel Sizer', desc: 'Estimate acoustic MLV barrier, Green Glue, and damping channel spacing.', path: '/home-construction/soundproofing-calculator' },
      { name: 'Drop Ceiling & Acoustic Tile Sizer', desc: 'Estimate 2x2 and 2x4 suspended ceiling grid tracks, main tees, and acoustic tiles.', path: '/home-construction/drop-ceiling-calculator' },
    ],
  },
  {
    id: 'roofing-siding',
    name: 'Roofing, Siding & Exterior Envelope',
    icon: 'Shield',
    tagline: 'Roofing squares, asphalt shingles, roof pitch slope multipliers, and siding panels.',
    tools: [
      { name: 'Roofing Shingle & Square Calculator', desc: 'Calculate roofing squares (100 sq ft), 3-tab and architectural shingle bundles (3/sq).', path: '/home-construction/roofing-calculator', badge: 'Core' },
      { name: 'Roof Pitch & Slope Multiplier', desc: 'Convert pitch (e.g. 4/12, 6/12, 8/12, 12/12) to exact surface area expansion factors.', path: '/home-construction/roof-pitch-calculator', badge: 'Popular' },
      { name: 'House Wrap & Underlayment Estimator', desc: 'Calculate rolls of synthetic roof underlayment, ice-and-water shield, and Tyvek vapor wrap.', path: '/home-construction/house-wrap-calculator' },
      { name: 'Vinyl & Hardie Plank Siding Sizer', desc: 'Estimate siding squares, starter strips, J-channels, and exterior corner posts.', path: '/home-construction/siding-calculator' },
      { name: 'Gutter & Downspout Sizer', desc: 'Calculate seamless gutter run linear footage, downspouts, and drainage pitch slope.', path: '/home-construction/gutter-calculator' },
    ],
  },
  {
    id: 'flooring-tile',
    name: 'Flooring, Tile & Tile Grout',
    icon: 'Square',
    tagline: 'Hardwood, luxury vinyl plank (LVP), ceramic tile, thinset mortar, and grout.',
    tools: [
      { name: 'Hardwood & Laminate Flooring Calculator', desc: 'Compute total floor square footage with 10% cut-waste buffer and box packaging counts.', path: '/home-construction/flooring-calculator', badge: 'Core' },
      { name: 'Tile & Thinset Mortar Estimator', desc: 'Calculate floor and shower tile counts, square footage, and thinset mortar bags.', path: '/home-construction/tile-calculator', badge: 'Popular' },
      { name: 'Tile Grout Coverage Calculator', desc: 'Calculate sanded and unsanded grout pounds based on tile dimensions and joint width.', path: '/home-construction/grout-calculator' },
      { name: 'Luxury Vinyl Plank (LVP/LVT) Sizer', desc: 'Estimate click-lock vinyl plank cartons, transitions, and perimeter expansion gaps.', path: '/home-construction/lvp-flooring-calculator' },
      { name: 'Carpet & Underlayment Padding Sizer', desc: 'Calculate 12ft and 15ft carpet rolls in square yards plus rebond foam padding.', path: '/home-construction/carpet-calculator' },
    ],
  },
  {
    id: 'paint-coating',
    name: 'Paint, Primer & Surface Coating',
    icon: 'Brush',
    tagline: 'Interior wall paint gallons, ceiling paint, primer, trim enamel, and deck stain.',
    tools: [
      { name: 'Interior Wall & Ceiling Paint Calculator', desc: 'Calculate paint gallons (350–400 sq ft/gal) with window/door deductions and coats.', path: '/home-construction/paint-calculator', badge: 'Core' },
      { name: 'Primer & Sealer Estimator', desc: 'Estimate drywall PVA primer and stain-blocking primer gallons for raw surfaces.', path: '/home-construction/primer-calculator', badge: 'Popular' },
      { name: 'Exterior Siding & Trim Paint Sizer', desc: 'Calculate exterior latex acrylic paint volume for siding, fascia, and shutters.', path: '/home-construction/exterior-paint-calculator' },
      { name: 'Deck Stain & Wood Sealant Sizer', desc: 'Calculate penetrating oil stain and water-repellent sealant gallons for deck boards.', path: '/home-construction/deck-stain-calculator' },
      { name: 'Wallpaper Roll Estimator', desc: 'Estimate standard single/double wallpaper rolls with pattern repeat matching buffers.', path: '/home-construction/wallpaper-calculator' },
    ],
  },
  {
    id: 'hvac-climate',
    name: 'HVAC, Heating & Cooling Sizing',
    icon: 'Flame',
    tagline: 'Room BTU heat gain/loss, air conditioner tonnage, ductwork CFM, and radiant heat.',
    tools: [
      { name: 'Room BTU Cooling & Heating Sizer', desc: 'Calculate exact room heating/cooling BTUs based on room volume, climate, and sun exposure.', path: '/home-construction/btu-calculator', badge: 'Core' },
      { name: 'AC Tonnage & Square Footage Estimator', desc: 'Size central AC condensers and heat pumps (1 Ton = 12,000 BTU/h) for residential square footage.', path: '/home-construction/ac-tonnage-calculator', badge: 'Popular' },
      { name: 'Ductwork Sizing & Airflow CFM Calculator', desc: 'Compute required airflow CFM and round/rectangular duct dimensions for balanced ventilation.', path: '/home-construction/duct-sizing-calculator' },
      { name: 'Radiant Floor Heating Wattage Sizer', desc: 'Estimate electric radiant floor heating cable wattage and mat square footage.', path: '/home-construction/radiant-heat-calculator' },
    ],
  },
  {
    id: 'electrical-wiring',
    name: 'Electrical, Wiring & Panel Sizing',
    icon: 'Zap',
    tagline: 'Circuit amperage, wire gauge (AWG), voltage drop, conduit fill, and lumens.',
    tools: [
      { name: 'Electrical Circuit Load & Amperage Sizer', desc: 'Calculate total circuit wattage, 15A/20A breaker sizing, and the 80% continuous load rule.', path: '/electrical', badge: 'Core' },
      { name: 'Wire Gauge (AWG) & Voltage Drop Sizer', desc: 'Determine copper/aluminum wire gauge to keep voltage drop under 3% over long distances.', path: '/electrical-converter', badge: 'Popular' },
      { name: 'Conduit Fill Capacity Estimator', desc: 'Calculate EMT, PVC, and rigid conduit fill capacity to NEC Chapter 9 Table 1 standards.', path: '/electrical-tools' },
      { name: 'Room Lighting Lumen & Foot-Candle Sizer', desc: 'Calculate required LED lumens and fixture counts for kitchens, workshops, and living spaces.', path: '/home-construction/lighting-calculator' },
    ],
  },
  {
    id: 'plumbing-drainage',
    name: 'Plumbing, Drainage & Water Flow',
    icon: 'Droplets',
    tagline: 'Pipe flow rates, tankless water heater sizing, French drains, and sump pumps.',
    tools: [
      { name: 'Pipe Flow Rate & Pressure Drop Sizer', desc: 'Calculate water velocity (ft/s) and Hazen-Williams friction head loss in PEX and copper pipes.', path: '/home-construction/pipe-sizing-calculator', badge: 'Core' },
      { name: 'Water Heater Sizing (Tankless vs Tank)', desc: 'Estimate peak hot water flow rate (GPM) and temperature rise for continuous showers.', path: '/home-construction/water-heater-calculator', badge: 'Popular' },
      { name: 'French Drain & Trench Gravel Estimator', desc: 'Calculate perforated pipe length, non-woven geotextile fabric, and drainage gravel tons.', path: '/home-construction/french-drain-calculator' },
      { name: 'Sump Pump Capacity Sizer', desc: 'Estimate required sump pump horsepower (1/3 HP vs 1/2 HP) and GPH flow rate against head height.', path: '/home-construction/sump-pump-calculator' },
    ],
  },
  {
    id: 'landscaping-hardscape',
    name: 'Landscaping, Hardscape & Earthwork',
    icon: 'Trees',
    tagline: 'Mulch, topsoil, patio pavers, grass seed, sod rolls, deck lumber, and fence pickets.',
    tools: [
      { name: 'Mulch, Topsoil & Compost Calculator', desc: 'Compute cubic yards and 2 cu ft / 3 cu ft bags at 2" to 4" layer thickness.', path: '/home-construction/mulch-calculator', badge: 'Core' },
      { name: 'Patio Paver & Sand Base Estimator', desc: 'Calculate paver unit counts, polymeric joint sand, and compacted gravel sub-base.', path: '/home-construction/paver-calculator', badge: 'Popular' },
      { name: 'Grass Seed & Sod Roll Sizer', desc: 'Calculate lawn overseeding pounds, new lawn seed, and 10 sq ft sod roll counts.', path: '/home-construction/sod-seed-calculator' },
      { name: 'Deck Lumber & Baluster Sizer', desc: 'Estimate 5/4x6 decking boards, joists, ledger board fasteners, and 4" code baluster spacing.', path: '/home-construction/deck-calculator' },
      { name: 'Fence Post & Picket Calculator', desc: 'Calculate 4x4 posts (6ft/8ft spacing), 2x4 rails, pickets, and concrete post mix bags.', path: '/home-construction/fence-calculator' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. STANDARD BUILDING MATERIAL COVERAGE RULES-OF-THUMB
// ---------------------------------------------------------------------------
export const MATERIAL_COVERAGE_RULES: MaterialCoverageRule[] = [
  {
    material: 'Ready-Mix Concrete',
    standardUnit: '1 Cubic Yard (yd³ = 27 ft³)',
    ruleOfThumbCoverage: '81 sq ft at 4" depth | 54 sq ft at 6" depth',
    recommendedWasteBuffer: '10% (Spillage & Uneven Sub-base)',
    proTip: 'Always order an extra 0.5 to 1.0 yd³ for ready-mix truck short-load insurance.',
  },
  {
    material: 'Pre-Mix Concrete Bags (60 lb)',
    standardUnit: '1 Bag (60 lbs)',
    ruleOfThumbCoverage: '0.45 ft³ volume (~60 bags per 1 yd³)',
    recommendedWasteBuffer: '10%',
    proTip: 'Use for small post holes and footing pads; order ready-mix if volume exceeds 1 yd³.',
  },
  {
    material: 'Interior Wall Paint',
    standardUnit: '1 US Gallon (gal)',
    ruleOfThumbCoverage: '350 – 400 sq ft per coat on primed drywall',
    recommendedWasteBuffer: '10% (Touch-ups & Roller Nap Absorption)',
    proTip: 'Unprimed fresh drywall or textured plaster absorbs 20–30% more paint on first coat.',
  },
  {
    material: 'Asphalt Roofing Shingles',
    standardUnit: '1 Roofing Square (100 sq ft)',
    ruleOfThumbCoverage: '3 Bundles = 1 Square (100 sq ft)',
    recommendedWasteBuffer: '10% (Simple Gables) | 15% (Valleys & Hips)',
    proTip: 'Starter shingles and ridge caps require separate linear bundle calculations.',
  },
  {
    material: 'Hardwood & LVP Flooring',
    standardUnit: '1 Box (~20 – 24 sq ft)',
    ruleOfThumbCoverage: 'Matches carton label rating',
    recommendedWasteBuffer: '10% (Straight Lay) | 15% (Diagonal / Herringbone)',
    proTip: 'Always save 1–2 unopened cartons from the same dye lot for future repairs.',
  },
  {
    material: 'Drywall Joint Compound (Mud)',
    standardUnit: '1 Bucket (4.5 gal / ~60 lbs)',
    ruleOfThumbCoverage: 'Approx. 500 sq ft of drywall surface (3 coats)',
    recommendedWasteBuffer: '10%',
    proTip: 'Use setting-type powder mud (Easy Sand 45/90) for embedding tape, pre-mix for finish skim.',
  },
  {
    material: 'Landscape Mulch & Topsoil',
    standardUnit: '1 Cubic Yard (yd³)',
    ruleOfThumbCoverage: '108 sq ft at 3" depth | 162 sq ft at 2" depth',
    recommendedWasteBuffer: '5% (Settling & Compaction)',
    proTip: '1 cubic yard equals 13.5 standard 2-cubic-foot bags from home improvement centers.',
  },
];

// ---------------------------------------------------------------------------
// 3. CONCRETE SLAB VOLUME & BAG LOOKUP MATRIX
// ---------------------------------------------------------------------------
export const CONCRETE_SLAB_LOOKUPS: ConcreteSlabLookup[] = [
  { dimensions: '8 ft × 10 ft', areaSqFt: 80, depthInches: 4, cubicYards: 0.99, bags60lb: 60, bags80lb: 45, typicalApplication: 'Small Utility Shed Slab or Walkway' },
  { dimensions: '10 ft × 10 ft', areaSqFt: 100, depthInches: 4, cubicYards: 1.23, bags60lb: 74, bags80lb: 56, typicalApplication: 'Backyard Patio or Storage Shed' },
  { dimensions: '10 ft × 20 ft', areaSqFt: 200, depthInches: 4, cubicYards: 2.47, bags60lb: 149, bags80lb: 111, typicalApplication: '1-Car Parking Pad or Long Patio' },
  { dimensions: '12 ft × 12 ft', areaSqFt: 144, depthInches: 4, cubicYards: 1.78, bags60lb: 107, bags80lb: 80, typicalApplication: 'Outdoor Dining Patio or Gazebo Pad' },
  { dimensions: '12 ft × 24 ft', areaSqFt: 288, depthInches: 4, cubicYards: 3.56, bags60lb: 214, bags80lb: 160, typicalApplication: '1-Car Garage Slab or Workshop' },
  { dimensions: '20 ft × 20 ft', areaSqFt: 400, depthInches: 4, cubicYards: 4.94, bags60lb: 297, bags80lb: 223, typicalApplication: 'Standard 2-Car Garage Slab (Residential)' },
  { dimensions: '24 ft × 24 ft', areaSqFt: 576, depthInches: 4, cubicYards: 7.11, bags60lb: 427, bags80lb: 320, typicalApplication: 'Spacious 2-Car Garage or Barn Slab' },
  { dimensions: '10 ft × 10 ft', areaSqFt: 100, depthInches: 6, cubicYards: 1.85, bags60lb: 111, bags80lb: 84, typicalApplication: 'Heavy-Duty RV Pad / Equipment Base' },
  { dimensions: '20 ft × 20 ft', areaSqFt: 400, depthInches: 6, cubicYards: 7.41, bags60lb: 445, bags80lb: 334, typicalApplication: 'Commercial Driveway or Heavy Machinery Slab' },
];

// ---------------------------------------------------------------------------
// 4. 6 CURATED TRADE WORKBENCHES
// ---------------------------------------------------------------------------
export const CONSTRUCTION_WORKBENCHES: ConstructionWorkbenchKit[] = [
  {
    id: 'general-contractors',
    title: 'General Contractors & Home Builders',
    persona: 'General Contractors, Project Leads & Estimators',
    desc: 'Full-house takeoffs from foundation footings to framing lumber, roofing, and interior drywall.',
    icon: 'Briefcase',
    recommendedTools: [
      { name: 'Concrete Slab & Footing Volume', path: '/home-construction/concrete-slab-calculator', purpose: 'Foundation pad yardage and batch orders.' },
      { name: 'Wall Stud & Framing Plate Estimator', path: '/home-construction/stud-framing-calculator', purpose: '2x4 / 2x6 framing lumber takeoffs.' },
      { name: 'Roofing Squares & Pitch Multiplier', path: '/home-construction/roofing-calculator', purpose: 'Roof surface square footage with pitch.' },
      { name: 'Drywall Sheets & Screws Sizer', path: '/home-construction/drywall-calculator', purpose: 'Interior sheetrock and finishing material.' },
    ],
  },
  {
    id: 'diy-homeowners',
    title: 'DIY Remodelers & Homeowners',
    persona: 'Homeowners & Weekend DIYers',
    desc: 'Budget-conscious material estimation for flooring, room painting, tile backsplashes, and decks.',
    icon: 'Hammer',
    recommendedTools: [
      { name: 'Interior Wall & Ceiling Paint Sizer', path: '/home-construction/paint-calculator', purpose: 'Gallons needed with door/window deductions.' },
      { name: 'Flooring Box & Waste Calculator', path: '/home-construction/flooring-calculator', purpose: 'Hardwood and LVP carton counts.' },
      { name: 'Patio Paver & Mulch Sizer', path: '/home-construction/mulch-calculator', purpose: 'Landscape yardage and paver base sand.' },
      { name: 'Deck Lumber & Board Foot Sizer', path: '/home-construction/deck-calculator', purpose: 'Decking boards, joists, and railing balusters.' },
    ],
  },
  {
    id: 'masonry-concrete',
    title: 'Concrete, Masonry & Earthwork Crews',
    persona: 'Concrete Finishers & Masons',
    desc: 'Cubic yard calculations, ready-mix truck loads, rebar grid weight, and retaining wall blocks.',
    icon: 'Grid',
    recommendedTools: [
      { name: 'Ready-Mix Concrete Slab Sizer', path: '/home-construction/concrete-slab-calculator', purpose: 'Cubic yards and pre-mix bag conversions.' },
      { name: 'Rebar Grid & Spacing Estimator', path: '/home-construction/rebar-calculator', purpose: '#4 and #5 grid layout with lap splices.' },
      { name: 'CMU Block & Mortar Calculator', path: '/home-construction/cmu-block-calculator', purpose: '8x8x16 concrete masonry units and mortar.' },
      { name: 'Crushed Stone & Gravel Base Sizer', path: '/home-construction/gravel-base-calculator', purpose: 'Tonnage and cubic yards for sub-base.' },
    ],
  },
  {
    id: 'roofing-exteriors',
    title: 'Roofing, Siding & Exterior Envelopes',
    persona: 'Roofing Contractors & Siding Installers',
    desc: 'Pitch slope expansion, shingle bundle takeoffs, house wrap rolls, and rain gutters.',
    icon: 'Shield',
    recommendedTools: [
      { name: 'Roof Pitch & Area Multiplier', path: '/home-construction/roof-pitch-calculator', purpose: 'Calculates true 3D roof slope area.' },
      { name: 'Roofing Shingle Bundles (3/Sq)', path: '/home-construction/roofing-calculator', purpose: 'Squares, bundles, and ridge cap shingles.' },
      { name: 'Vinyl & Hardie Siding Sizer', path: '/home-construction/siding-calculator', purpose: 'Siding squares, corners, and J-channels.' },
      { name: 'Gutter & Downspout Sizer', path: '/home-construction/gutter-calculator', purpose: 'Seamless gutter runs and drainage capacity.' },
    ],
  },
  {
    id: 'interior-finishers',
    title: 'Drywall, Tile & Flooring Finishers',
    persona: 'Drywall Installers, Tile Setters & Painters',
    desc: 'Precision square footage, tile cuts, grout pounds, mud buckets, and paint coats.',
    icon: 'Layers',
    recommendedTools: [
      { name: 'Drywall Sheet & Mud Estimator', path: '/home-construction/drywall-calculator', purpose: '4x8 / 4x12 sheets, screws, and taping mud.' },
      { name: 'Tile, Mortar & Grout Calculator', path: '/home-construction/tile-calculator', purpose: 'Tile counts, thinset bags, and grout pounds.' },
      { name: 'LVP & Hardwood Box Estimator', path: '/home-construction/lvp-flooring-calculator', purpose: 'Carton takeoffs with 10–15% waste buffers.' },
      { name: 'Wall & Trim Paint Estimator', path: '/home-construction/paint-calculator', purpose: 'Net surface area minus window/door openings.' },
    ],
  },
  {
    id: 'mep-trades',
    title: 'Mechanical, Electrical & Plumbing (MEP)',
    persona: 'HVAC Techs, Electricians & Plumbers',
    desc: 'BTU heat gain/loss, wire gauge voltage drop, pipe friction loss, and water heaters.',
    icon: 'Zap',
    recommendedTools: [
      { name: 'Room BTU HVAC Sizer', path: '/home-construction/btu-calculator', purpose: 'Heat pump and AC tonnage load sizing.' },
      { name: 'Wire Gauge & Voltage Drop Sizer', path: '/electrical-converter', purpose: 'NEC compliant wire sizing for long runs.' },
      { name: 'Pipe Flow & Pressure Drop Sizer', path: '/home-construction/pipe-sizing-calculator', purpose: 'Friction head loss in PEX and copper lines.' },
      { name: 'Lighting Lumens & Foot-Candles', path: '/home-construction/lighting-calculator', purpose: 'LED lumen output for code room lighting.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 5. 15 COMPREHENSIVE CONSTRUCTION FAQS (Schema.org FAQPage Compliant)
// ---------------------------------------------------------------------------
export const CONSTRUCTION_FAQS: ConstructionFaq[] = [
  {
    q: 'How do you calculate concrete cubic yards for a slab or patio?',
    a: 'To calculate concrete volume in cubic yards: multiply Length (feet) × Width (feet) × Thickness (converted to feet, by dividing inches by 12), then divide the total cubic feet by 27. Formula: Cubic Yards = (Length ft × Width ft × Thickness in/12) / 27. For example, a 10ft × 10ft slab that is 4 inches thick requires: (10 × 10 × 0.333) / 27 = 1.23 cubic yards (approx. 56 bags of 80lb concrete or 74 bags of 60lb concrete).',
  },
  {
    q: 'Why should I always add a 10% to 15% waste factor to building materials?',
    a: 'Building materials require cutting, trimming, pattern matching, and fitting around corners and obstacles, which naturally creates scrap. Uneven subgrades and minor excavation discrepancies also cause concrete overage. Adding a 10% waste buffer for simple rectangular rooms or 15% for complex layouts (e.g. diagonal tiles, hip roofs, herringbone floors) ensures you don’t run out of materials mid-project or suffer dye-lot mismatches.',
  },
  {
    q: 'What is a Roofing Square and how many shingle bundles are in one square?',
    a: 'In construction terminology, 1 Roofing Square equals exactly 100 square feet of roof surface area. Standard 3-tab and architectural asphalt shingles are packaged in bundles where 3 bundles equal 1 Roofing Square. Therefore, a 2,000 sq ft roof equals 20 squares, requiring 60 bundles of shingles plus extra for starter strips and ridge caps.',
  },
  {
    q: 'How many square feet does one gallon of interior paint cover?',
    a: 'A standard gallon of quality interior wall paint covers approximately 350 to 400 square feet per coat on smooth, primed drywall. Fresh, unprimed drywall or heavily textured plaster typically absorbs more paint, reducing coverage to approximately 250 to 300 square feet per gallon for the initial primer coat.',
  },
  {
    q: 'What is a Board Foot (BF) in lumber measurement and how is it calculated?',
    a: 'A Board Foot (BF) is a standardized volume measurement for hardwood and softwood lumber equal to a board 1 inch thick, 12 inches wide, and 12 inches long (144 cubic inches). Formula: Board Feet = (Thickness in inches × Width in inches × Length in inches) / 144. For example, a standard 2×6 board that is 8 feet long (96 inches) contains: (2 × 6 × 96) / 144 = 8 Board Feet.',
  },
  {
    q: 'How is roof pitch calculated and how does it affect total shingle area?',
    a: 'Roof pitch expresses the vertical rise over a 12-inch horizontal run (e.g., 6/12 means 6 inches of vertical rise per 12 inches of horizontal run). Because a sloped roof has a larger surface area than the flat footprint of the house below it, you must multiply the flat area by the roof pitch multiplier. For example, a 6/12 pitch has a multiplier of 1.118, meaning a 1,500 sq ft flat house footprint requires 1,500 × 1.118 = 1,677 sq ft of roofing shingles.',
  },
  {
    q: 'How many wall studs do I need for framing a wall at 16 inches on-center?',
    a: 'As a reliable rule of thumb for framing walls with studs spaced 16 inches on-center (OC): calculate 1 stud per linear foot of wall. This simple formula automatically accounts for standard stud spacing plus the extra studs required for corners, intersecting partition walls, and window/door rough openings. In addition, order linear lumber for 1 bottom sole plate and 2 top plates.',
  },
  {
    q: 'What is the standard rebar spacing for residential concrete slabs?',
    a: 'For 4-inch to 6-inch residential concrete slabs, driveways, and patios, #4 rebar (1/2" diameter) or #3 rebar (3/8" diameter) is typically arranged in a grid pattern spaced 18 inches to 24 inches on-center in both directions. Rebar should be supported on concrete chairs or plastic bolsters so it rests in the middle-to-upper third of the slab thickness.',
  },
  {
    q: 'How many bags of joint compound (mud) and screws do I need per drywall sheet?',
    a: 'For standard drywall installation, plan for approximately 1 pound of drywall screws (approx. 300–350 screws) per 4 to 5 sheets of 4x8 drywall (using ~32 screws per sheet for walls, ~48 for ceilings). For finishing, plan for approximately 4.5 to 5.0 gallons of joint compound per 500 square feet of drywall across three finish coats.',
  },
  {
    q: 'How many tons of gravel or crushed stone are in one cubic yard?',
    a: 'One cubic yard of standard crushed stone or gravel weighs approximately 1.35 to 1.5 tons (2,700 to 3,000 lbs) depending on aggregate moisture content and stone density. To convert cubic yards of gravel to tons, multiply the cubic yard volume by 1.4.',
  },
  {
    q: 'How do I calculate BTU cooling requirements for an air conditioner?',
    a: 'As a baseline rule of thumb under standard 8-foot ceiling heights: plan for approximately 20 to 25 BTUs per square foot of living space. Adjust upward by 10% to 20% for rooms with high ceilings (over 9 ft), heavy sun exposure, kitchens with cooking heat, or poor insulation. One Ton of air conditioning capacity equals 12,000 BTUs/hour.',
  },
  {
    q: 'How do I calculate the slope and drop needed for a French drain pipe?',
    a: 'A French drain requires a minimum downward slope of 1% (approx. 1/8 inch per linear foot) to 2% (approx. 1/4 inch per linear foot) toward the discharge outlet to ensure gravity carries water away without stagnation or sediment buildup. For every 10 feet of trench run, the pipe should drop at least 1.25 to 2.5 inches.',
  },
  {
    q: 'What is the difference between 4x8 and 4x12 drywall sheets in room installation?',
    a: 'A 4x8 drywall sheet covers 32 square feet and is easy for one person to maneuver. A 4x12 sheet covers 48 square feet and is preferred by professional hangers for rooms with 12-foot spans because it eliminates vertical butt joints on longer walls, resulting in a stronger wall and significantly less taping and mudding labor.',
  },
  {
    q: 'How many pavers do I need for a patio and how deep should the base be?',
    a: 'To estimate pavers: calculate the patio square footage, add 10% for edge cuts, and divide by the square footage of a single paver unit. For pedestrian patios, excavate 6 to 8 inches deep to allow for a 4-inch compacted crushed stone base, 1-inch bedding sand layer, and the paver thickness itself.',
  },
  {
    q: 'Are all Home & Construction calculators on SolveItCalculator free to use?',
    a: 'Yes, all 60+ construction, framing, roofing, concrete, and trade estimation calculators are 100% free, require no account registration, execute locally in browser memory for complete privacy, and work across mobile, tablet, and desktop.',
  },
];
