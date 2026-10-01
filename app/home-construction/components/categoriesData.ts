import { CategoryGroup } from './types';

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'concrete-masonry',
    title: 'Concrete, Cement & Masonry',
    icon: 'view_in_ar',
    desc: 'Slabs, footings, post piers, sonotubes, mortar mix, brick coursing, and CMU concrete block estimators.',
    subcategories: [
      {
        title: 'Concrete Slabs & Footings',
        description: 'Cubic volume, premix 80lb/60lb/50lb bag yields, and metric cubic meters.',
        tools: [
          { name: 'Concrete Slab Calculator', description: 'Calculates volume, ready-mix yards, and bagged mix for rectangular slabs.', targetCalculator: 'concrete', badge: 'Popular' },
          { name: 'Concrete Footing & Pier Calculator', description: 'Continuous trench footings and round sonotube cylinder pier volumes.', targetCalculator: 'concrete' },
          { name: 'Concrete Curb & Gutter Calculator', description: 'Continuous pour linear curb profiles and municipal sidewalk sections.', targetCalculator: 'concrete' },
          { name: 'Concrete Stairs Calculator', description: 'Total volume for solid concrete step flights, risers, and landings.', targetCalculator: 'concrete' },
        ],
      },
      {
        title: 'Masonry, Brick & Block',
        description: 'Standard modular bricks, 8×8×16 CMU blocks, and Type N/S/M mortar mix bags.',
        tools: [
          { name: 'Brick Wall Calculator', description: 'Standard modular and king size brick counts with 3/8" mortar joints.', targetCalculator: 'concrete', badge: 'Trade' },
          { name: 'Concrete Block (CMU) Calculator', description: '8×8×16 block quantities, core fill grout, and horizontal bond beams.', targetCalculator: 'concrete' },
          { name: 'Mortar & Grout Estimator', description: 'Bags of Type S/N mortar mix and sand ratios per 100 block/brick units.', targetCalculator: 'concrete' },
          { name: 'Retaining Wall Block Calculator', description: 'Interlocking landscape block courses, step-downs, and cap stones.', targetCalculator: 'concrete' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Volume Converter', href: '/volume-converter' },
    ],
  },
  {
    id: 'carpentry-framing',
    title: 'Carpentry, Lumber & Framing',
    icon: 'carpenter',
    desc: 'Wall stud counts, plate linear runs, floor joists, ceiling rafters, plywood sheathing, and board feet.',
    subcategories: [
      {
        title: 'Wall & Partition Framing',
        description: 'Stud spacing at 16" or 24" O.C., corner posts, double top plates, and sole plates.',
        tools: [
          { name: 'Wall Stud Calculator', description: 'Calculates 2×4/2×6 studs at 16" or 24" O.C. plus top/sole plates and corner packs.', targetCalculator: 'lumber', badge: 'Essential' },
          { name: 'Board Feet (FBM) Calculator', description: 'Hardwood and softwood dimensional volume in standard commercial board feet.', targetCalculator: 'lumber' },
          { name: 'Header & Beam Span Sizer', description: 'Reference sizing for 2×8/2×10/2×12 built-up door and window headers.', targetCalculator: 'lumber' },
        ],
      },
      {
        title: 'Floor & Roof Framing',
        description: 'Joist spans, blocking, rafters, and subfloor plywood / OSB 4×8 sheathing.',
        tools: [
          { name: 'Floor Joist Calculator', description: 'Number of floor joists, rim boards, and mid-span bridging rows.', targetCalculator: 'lumber' },
          { name: 'Roof Rafter Length Calculator', description: 'Rafter run, common rise, birdsmouth notch depth, and ridge board.', targetCalculator: 'roofing' },
          { name: 'Subfloor & Sheathing Calculator', description: '4×8 OSB and plywood subfloor sheets with stagger pattern waste.', targetCalculator: 'drywall' },
          { name: 'Stair Stringer Calculator', description: 'Rise, run, total tread depth, and 2×12 stringer cut layouts.', targetCalculator: 'lumber' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Length Converter', href: '/length-converter' },
      { name: 'Area Converter', href: '/area-converter' },
    ],
  },
  {
    id: 'roofing-gutters',
    title: 'Roofing, Shingles & Gutters',
    icon: 'roofing',
    desc: 'Roof pitch multipliers, 100 sq ft squares, shingle bundles, underlayment rolls, and seamless gutters.',
    subcategories: [
      {
        title: 'Shingle & Metal Roofing',
        description: 'Pitch to surface area multipliers, architectural 3-bundle squares, and hip/valley waste.',
        tools: [
          { name: 'Roof Shingle & Square Calculator', description: 'Calculates pitch multiplier, true surface area, roofing squares, and bundles.', targetCalculator: 'roofing', badge: 'Popular' },
          { name: 'Roof Pitch & Slope Calculator', description: 'Converts pitch (x/12) into slope degrees, pitch ratio, and multiplier.', targetCalculator: 'roofing' },
          { name: 'Standing Seam Metal Roof Calculator', description: 'Panel counts, drip edge, ridge cap, and concealed fastener clips.', targetCalculator: 'roofing' },
          { name: 'Roof Underlayment & Ice/Water Shield', description: 'Roll counts for synthetic underlayment and self-adhering eaves membrane.', targetCalculator: 'roofing' },
        ],
      },
      {
        title: 'Gutters & Drainage',
        description: 'K-style seamless gutter runs, downspouts, and fascia board lengths.',
        tools: [
          { name: 'Gutter & Downspout Calculator', description: 'Linear feet of 5" or 6" gutters, corner miters, and downspout drops.', targetCalculator: 'roofing' },
          { name: 'Soffit & Fascia Calculator', description: 'Vented soffit panel square footage and aluminum fascia trim wrapping.', targetCalculator: 'roofing' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Angle Converter', href: '/angle-converter' },
    ],
  },
  {
    id: 'siding-exterior',
    title: 'Siding, Soffit & Exterior',
    icon: 'home',
    desc: 'Vinyl siding squares, fiber cement lap siding (Hardie), stone veneer, house wrap, and J-channel.',
    subcategories: [
      {
        title: 'Wall Siding & Cladding',
        description: 'Calculates net exterior wall area after window/door cutouts with pattern overlap.',
        tools: [
          { name: 'Vinyl Siding Calculator', description: '100 sq ft siding squares, starter strip, and inside/outside corner posts.', targetCalculator: 'roofing', badge: 'Exterior' },
          { name: 'HardiePlank / Lap Siding Calculator', description: 'Linear feet and board counts for 5.25", 6.25", 7.25", or 8.25" lap planks.', targetCalculator: 'roofing' },
          { name: 'Manufactured Stone Veneer Calculator', description: 'Flat square footage, corner pieces (lin ft), and scratch coat mortar bags.', targetCalculator: 'concrete' },
          { name: 'House Wrap & Weather Barrier', description: 'Rolls of Tyvek / weather-resistant barrier (WRB) with 6" seam overlaps.', targetCalculator: 'drywall' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Volume Converter', href: '/volume-converter' },
    ],
  },
  {
    id: 'decks-patios',
    title: 'Decks, Porches & Patios',
    icon: 'deck',
    desc: 'Decking boards, joists, ledger boards, deck screws, balusters, stair stringers, and post footings.',
    subcategories: [
      {
        title: 'Decking & Framing Materials',
        description: '5/4×6 composite or pressure-treated boards, hidden fasteners, and structural beam framing.',
        tools: [
          { name: 'Deck Board & Framing Calculator', description: 'Linear feet of 5/4×6 boards, framing joists (12"/16" OC), and beam spans.', targetCalculator: 'deck', badge: 'Popular' },
          { name: 'Deck Fastener & Screw Calculator', description: 'Calculates total screws/clips based on joist intersections (approx 3.5 screws/sq ft).', targetCalculator: 'deck' },
          { name: 'Deck Railing & Baluster Calculator', description: 'Linear feet of railing, post sleeves, and 4" max code-spaced balusters.', targetCalculator: 'deck' },
          { name: 'Deck Post Pier Concrete Calculator', description: 'Footing hole depth, sonotubes, and concrete bags per structural post.', targetCalculator: 'concrete' },
        ],
      },
      {
        title: 'Patios & Hardscaping',
        description: 'Concrete pavers, crushed gravel base, polymeric sand, and edge restraints.',
        tools: [
          { name: 'Paver Patio Calculator', description: 'Number of patio pavers, square footage, and cutting perimeter border waste.', targetCalculator: 'flooring' },
          { name: 'Polymeric Sand & Base Rock Sizer', description: 'Bags of joint sand and tons of compacted crushed rock base (4" to 6" depth).', targetCalculator: 'gravel' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Volume Converter', href: '/volume-converter' },
    ],
  },
  {
    id: 'flooring-tile',
    title: 'Flooring, Tile & Carpet',
    icon: 'grid_view',
    desc: 'Hardwood, luxury vinyl plank (LVP), laminate, carpet rolls, ceramic tile, grout, and thinset mortar.',
    subcategories: [
      {
        title: 'Plank & Sheet Flooring',
        description: 'Carton counts with 10% stagger waste, underlayment foam, and baseboard shoe molding.',
        tools: [
          { name: 'Flooring Carton Calculator', description: 'Room area, LVP/hardwood carton counts, and expansion gap allowances.', targetCalculator: 'flooring', badge: 'Popular' },
          { name: 'Carpet & Padding Roll Sizer', description: '12-foot and 15-foot broadloom rolls with seam layout optimization.', targetCalculator: 'flooring' },
          { name: 'Underlayment & Moisture Barrier', description: 'Square footage and roll counts for foam acoustic and vapor underlayment.', targetCalculator: 'flooring' },
        ],
      },
      {
        title: 'Ceramic Tile & Grout',
        description: 'Tile counts by dimensions (12×12, 12×24, 24×24), thinset bags, and grout pounds.',
        tools: [
          { name: 'Tile Grid & Pattern Calculator', description: 'Tile quantities for floors and shower walls with 10%–15% cut waste.', targetCalculator: 'flooring', badge: 'Trade' },
          { name: 'Tile Grout & Thinset Mortar Estimator', description: 'Calculates pounds of sanded/unsanded grout and 50 lb bags of thinset mortar.', targetCalculator: 'flooring' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Length Converter', href: '/length-converter' },
    ],
  },
  {
    id: 'paint-drywall',
    title: 'Paint, Drywall & Finishes',
    icon: 'format_paint',
    desc: 'Interior/exterior paint gallons, primer, drywall sheets, joint compound mud buckets, and drywall tape.',
    subcategories: [
      {
        title: 'Interior & Exterior Painting',
        description: 'Net wall surface area after subtracting doors/windows, coats, and spread rates.',
        tools: [
          { name: 'Paint Gallon Calculator', description: 'Calculates paint gallons for walls, ceilings, and primer coats (350 sq ft/gal).', targetCalculator: 'paint', badge: 'Popular' },
          { name: 'Door & Window Deduction Tool', description: 'Standard 21 sq ft door and 15 sq ft window deduction calculator.', targetCalculator: 'paint' },
          { name: 'Trim & Baseboard Enamel Estimator', description: 'Linear feet of casing and crown molding converted to quart/gallon enamel.', targetCalculator: 'paint' },
        ],
      },
      {
        title: 'Drywall & Wall Finishes',
        description: '4×8 and 4×12 gypsum panels, joint tape rolls, corner bead, and joint compound mud.',
        tools: [
          { name: 'Drywall Sheet & Mud Calculator', description: 'Panel counts (4×8 or 4×12), joint compound buckets (4.5 gal), and screws.', targetCalculator: 'drywall', badge: 'Trade' },
          { name: 'Drywall Tape & Corner Bead Sizer', description: 'Linear feet of paper/fiberglass tape and metal/vinyl outside corner bead.', targetCalculator: 'drywall' },
          { name: 'Insulation Batts & Rolls Sizer', description: 'R-13/R-19/R-30 fiberglass batt bags for 16" and 24" stud cavity bays.', targetCalculator: 'drywall' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Volume Converter', href: '/volume-converter' },
    ],
  },
  {
    id: 'fences-gates',
    title: 'Fences, Gates & Enclosures',
    icon: 'fence',
    desc: 'Wood privacy fences, chain link, vinyl fencing, aluminum railings, post spacing, and gate hardware.',
    subcategories: [
      {
        title: 'Wood Privacy & Shadowbox',
        description: 'Post counts at 6ft or 8ft bays, 2×4 horizontal runners, and dog-ear pickets.',
        tools: [
          { name: 'Wood Privacy Fence Calculator', description: 'Total pickets, 4×4 posts, 2×4 stringers, and post hole concrete bags.', targetCalculator: 'fence', badge: 'Popular' },
          { name: 'Post Hole Concrete Sizer', description: 'Number of 50 lb or 80 lb quick-setting concrete bags per fence post.', targetCalculator: 'concrete' },
          { name: 'Gate Framing & Hardware Estimator', description: 'Z-brace / diagonal brace lumber and heavy-duty gate hinge kits.', targetCalculator: 'fence' },
        ],
      },
      {
        title: 'Chain Link & Metal Fences',
        description: 'Fabric rolls (50 ft), top rail pipes, line posts, corner terminal posts, and tension wire.',
        tools: [
          { name: 'Chain Link Fence Calculator', description: 'Calculates fabric mesh rolls, terminal/corner posts, line posts, and top rail.', targetCalculator: 'fence' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Length Converter', href: '/length-converter' },
      { name: 'Volume Converter', href: '/volume-converter' },
    ],
  },
  {
    id: 'landscaping-soil',
    title: 'Landscaping, Soil & Gravel',
    icon: 'yard',
    desc: 'Bark mulch, topsoil, compost, lawn sod rolls, crushed stone, pea gravel, and decomposed granite.',
    subcategories: [
      {
        title: 'Bulk Materials & Topsoil',
        description: 'Cubic yards, 2 cu ft / 3 cu ft bagged mulch, garden bed topsoil, and soil amendments.',
        tools: [
          { name: 'Mulch & Bedding Calculator', description: 'Calculates bulk cubic yards and 2 cu ft bagged mulch with settling buffer.', targetCalculator: 'mulch', badge: 'Popular' },
          { name: 'Topsoil & Compost Calculator', description: 'Volume and weight for raised garden beds, grading, and loam soil.', targetCalculator: 'mulch' },
          { name: 'Lawn Sod Roll Calculator', description: 'Turf grass square footage, standard pallet counts (450–500 sq ft), and sod rolls.', targetCalculator: 'mulch' },
        ],
      },
      {
        title: 'Aggregates & Gravel Driveways',
        description: 'Crushed stone #57, road base, pea gravel, driveway rock tonnage, and compaction ratios.',
        tools: [
          { name: 'Gravel & Crushed Stone Tonnage Sizer', description: 'Cubic yardage converted to tons based on 1.4 tons/yd³ material density.', targetCalculator: 'gravel', badge: 'Popular' },
          { name: 'Driveway Base & Subbase Calculator', description: 'Crushed concrete and crusher run tonnage for stable vehicular base layers.', targetCalculator: 'gravel' },
          { name: 'Sand & Base Rock Density Sizer', description: 'Masonry sand and coarse aggregate weight calculator by depth and area.', targetCalculator: 'gravel' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Volume Converter', href: '/volume-converter' },
      { name: 'Weight Converter', href: '/weight-converter' },
    ],
  },
  {
    id: 'electrical-lighting',
    title: 'Electrical & Lighting',
    icon: 'bolt',
    desc: 'Romex wire length, circuit breaker sizing, voltage drop over distance, wattage load, and conduit fill.',
    subcategories: [
      {
        title: 'Wiring, Circuits & Conduit',
        description: 'Wire gauge selection (14/2, 12/2, 10/3), conduit fill percentages, and breaker amperage.',
        tools: [
          { name: 'Electrical Wire Length & Box Sizer', description: 'Estimates 14 AWG / 12 AWG Romex run footage including service loops and junction boxes.', targetCalculator: 'lumber', badge: 'Trade' },
          { name: 'Voltage Drop Calculator', description: 'Calculates percentage voltage drop over long electrical conduit runs.', targetCalculator: 'lumber' },
          { name: 'Conduit Fill & Wire Capacity Sizer', description: 'NEC 40% fill maximums for EMT, PVC, and rigid conduit pipe sizes.', targetCalculator: 'lumber' },
        ],
      },
      {
        title: 'Lighting & Load Calculations',
        description: 'Room lumens (foot-candles), recessed can light spacing, and continuous circuit watts.',
        tools: [
          { name: 'Recessed Lighting Spacing Calculator', description: 'Even grid spacing and distance from walls for 4" and 6" LED pot lights.', targetCalculator: 'paint' },
          { name: 'Circuit Wattage & Breaker Load Sizer', description: '80% continuous load safety calculation for 15A and 20A residential circuits.', targetCalculator: 'lumber' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Length Converter', href: '/length-converter' },
      { name: 'Area Converter', href: '/area-converter' },
    ],
  },
  {
    id: 'hvac-plumbing',
    title: 'HVAC & Plumbing',
    icon: 'hvac',
    desc: 'BTU heating/cooling sizers, CFM airflow, PEX/copper pipe lengths, water heater sizing, and slope pitch.',
    subcategories: [
      {
        title: 'HVAC & Air Sizing',
        description: 'Square footage heat gain/loss, tonnage rating, and room airflow CFM needs.',
        tools: [
          { name: 'HVAC BTU & Tonnage Sizer', description: 'Rule-of-thumb heating and cooling BTU requirements per climate zone.', targetCalculator: 'paint', badge: 'HVAC' },
          { name: 'Ductwork CFM Airflow Calculator', description: 'Round and rectangular HVAC duct airflow velocity and cross-sectional sizing.', targetCalculator: 'drywall' },
        ],
      },
      {
        title: 'Plumbing & Drainage',
        description: 'Drain pipe slope (1/4" per foot), PEX home run footage, and drainage fixture units (DFU).',
        tools: [
          { name: 'Plumbing Pipe Slope & Drop Sizer', description: 'Calculates total drop for gravity sewer and DWV pipes at 1/4" per foot pitch.', targetCalculator: 'roofing' },
          { name: 'PEX Pipe Footage & Fitting Estimator', description: 'Supply line manifold and branch footage with 10% expansion slack.', targetCalculator: 'lumber' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Temperature Converter', href: '/temperature-converter' },
      { name: 'Length Converter', href: '/length-converter' },
    ],
  },
  {
    id: 'measurement-cost',
    title: 'Measurement, Area & Project Cost',
    icon: 'calculate',
    desc: 'Square footage, cubic yardage, perimeter runs, unit converters, and cost budgeting estimators.',
    subcategories: [
      {
        title: 'Geometric Area & Volume',
        description: 'Multi-room composite floor areas, trapezoids, circles, and 3D volumetric shapes.',
        tools: [
          { name: 'Square Footage & Multi-Room Sizer', description: 'Combines multiple rectangular and irregular room dimensions into total gross area.', targetCalculator: 'flooring', badge: 'Essential' },
          { name: 'Cubic Yards to Cubic Meters Converter', description: 'Precise floating-point 3D volume conversion between US and Metric systems.', targetCalculator: 'concrete' },
          { name: 'Perimeter & Linear Run Calculator', description: 'Calculates gross outer boundary measurements for trim, baseboards, and fencing.', targetCalculator: 'fence' },
        ],
      },
      {
        title: 'Cost Estimating & Waste Allowance',
        description: 'Materials plus labor budgeting, 10%–20% contingency allowances, and sales tax.',
        tools: [
          { name: 'Construction Budget & Contingency Tool', description: 'Blends trade takeoff subtotals with 10%–20% unforeseen site condition reserves.', targetCalculator: 'concrete', badge: 'Financial' },
          { name: 'Material Waste Percentage Sizer', description: 'Computes net vs gross takeoff requirements for 5%, 10%, 15%, and 20% waste rates.', targetCalculator: 'concrete' },
        ],
      },
    ],
    relatedTools: [
      { name: 'Area Converter', href: '/area-converter' },
      { name: 'Volume Converter', href: '/volume-converter' },
      { name: 'Length Converter', href: '/length-converter' },
    ],
  },
];
