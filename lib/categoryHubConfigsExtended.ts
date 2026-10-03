import { CategoryHubConfig } from './categoryHubConfigs';

export const ADDITIONAL_HUB_CONFIGS: Record<string, CategoryHubConfig> = {
  electrical: {
    slug: 'electrical',
    categoryName: 'Electrical',
    h1: 'Electrical Calculators',
    intro: 'Free, easy-to-use electrical calculators for wire thickness, voltage loss over long distances, electricity costs, circuit breaker ratings, and solar battery storage.\nGet instant results and clear, step-by-step math to help you wire safely and plan your home or workshop electrical projects with confidence.',
    afterToolsSection: {
      badge: 'Complete Guide to Our Electrical Tools',
      subheadingLine1: 'Safe, Accurate Electrical Planning Made Simple',
      subheadingLine2: 'Clear Tools for Wire Sizing, Voltage Drop, and Power Needs',
      paragraph: 'SolveItCalculator’s electrical tools help homeowners, DIYers, and technicians make fast, safe calculations. Whether you are running power to a garage, sizing an extension cord, adding solar panels, or checking if your circuit breaker can handle new appliances, these tools give you immediate answers based on standard electrical safety guidelines. Easily find the right wire thickness to prevent overheating and power loss, check appliance wattage, estimate monthly electricity bills, and calculate backup battery runtimes.'
    },
    popularToolSlugs: [
      'electrical-calculators-sizing-tools',
      'power-converter',
      'energy-converter'
    ],
    goals: [
      {
        task: 'Find the right wire size to prevent power loss over long distances',
        description: 'Check how much voltage drops over long wire runs and find the safest wire gauge for your tools and appliances.',
        targetToolTitle: 'Wire Size & Voltage Loss Calculator',
        targetUrl: '/electrical',
        badge: 'Safe Wiring'
      },
      {
        task: 'Calculate Voltage, Current (Amps), Resistance, or Power (Watts)',
        description: 'Quickly find how many amps an appliance pulls or how many watts it uses on 120V or 240V power.',
        targetToolTitle: 'Power & Current Calculator',
        targetUrl: '/electrical',
        badge: 'Power & Watts'
      },
      {
        task: 'Check circuit breaker size and safe continuous load limits',
        description: 'Make sure your heaters, air conditioners, or power tools do not overload your breaker box.',
        targetToolTitle: 'Circuit Breaker Sizing Tool',
        targetUrl: '/electrical',
        badge: 'Breaker Safety'
      }
    ],
    subcategories: [
      {
        id: 'wire-sizing',
        name: 'Wire Thickness & Voltage Loss',
        path: '/electrical',
        description: 'Choose the right gauge wire and keep power delivery strong over any distance.',
        representativeToolSlugs: ['electrical-calculators-sizing-tools']
      },
      {
        id: 'circuits',
        name: 'Power, Watts & Amps',
        path: '/electrical',
        description: 'Simple formulas connecting current (amps), voltage (volts), and power (watts).',
        representativeToolSlugs: ['power-converter']
      }
    ],
    guides: [
      {
        title: 'How to Prevent Voltage Loss over Long Wires',
        formula: 'Voltage Lost = (2 × Wire Resistance Factor × Current in Amps × Distance in Feet) / Wire Thickness',
        formulaDescription: 'Power drops when electricity travels through long wires. Keeping voltage loss under 3% keeps motors and electronics running safely.',
        howItWorks: [
          'Electricity experiences slight friction (resistance) as it travels through copper or aluminum wire.',
          'The longer the wire distance and the higher the amperage, the more voltage is lost along the way.',
          'If voltage drops more than 3%, appliances can overheat or fail to start properly.',
          'Using a thicker wire gauge (smaller AWG number) reduces resistance and restores full voltage.'
        ],
        example: {
          scenario: 'Powering a 16-amp table saw 100 feet away on a standard 120V circuit using 12-gauge wire',
          inputs: { Voltage: '120 Volts', Current: '16 Amps', Distance: '100 Feet', Wire: '12-Gauge Copper' },
          calculation: 'Voltage lost = 6.32 Volts (a 5.27% drop, which exceeds the 3% safe guideline)',
          result: 'Step up to thicker 10-gauge wire to cut voltage loss down to 3.31 Volts (2.76%), keeping your tool safe.'
        },
        commonMistakes: [
          'Using thin extension cords with high-power heaters or heavy power tools, causing the cord to heat up.',
          'Forgetting that electricity travels back and forth (round-trip distance is twice the one-way distance).'
        ],
        practicalTips: [
          'If your extension cord feels warm to the touch, switch to a thicker gauge cord immediately.',
          'Always upsize by one wire thickness when running cables to a detached shed, garage, or outdoor pump.'
        ]
      },
      {
        title: 'How Power (Watts), Current (Amps), and Voltage Work Together',
        formula: 'Power (Watts) = Voltage (Volts) × Current (Amps)',
        formulaDescription: 'Watts tell you the total power an appliance uses, Volts is the electrical pressure, and Amps is the rate of flow.',
        howItWorks: [
          'Multiply your wall voltage (usually 120V in North America) by the amps listed on your appliance label.',
          'The result gives you total watts consumed per hour of continuous use.',
          'To avoid tripping a breaker, continuous loads running for 3+ hours should stay under 80% of the breaker limit (e.g. 1,440W on a 15A circuit).'
        ],
        example: {
          scenario: 'Running a 1,500-watt space heater on a standard 120V household circuit',
          inputs: { Power: '1,500 Watts', Voltage: '120 Volts' },
          calculation: 'Current = 1,500 Watts ÷ 120 Volts = 12.5 Amps',
          result: 'The heater draws 12.5 Amps, which takes up almost all the capacity of a standard 15-amp circuit.'
        },
        commonMistakes: [
          'Plugging two 1,500W heaters or a microwave and coffee maker into the same wall circuit simultaneously.',
          'Ignoring startup surges from air conditioners and refrigerators, which can temporarily draw 3× their normal amps.'
        ],
        practicalTips: [
          'To find monthly running cost: multiply Watts × Hours Used Per Month ÷ 1,000 × Your Local Electricity Rate per kWh.'
        ]
      }
    ],
    relatedCategorySlugs: ['conversions', 'home-construction', 'science', 'technology'],
    faqs: [
      {
        question: 'What is the 3% voltage drop rule and why is it important?',
        answer: 'Standard electrical safety guidelines recommend keeping voltage drop on any branch circuit under 3%. If voltage drops too much over long distances, electric motors run hot and burn out faster, lights dim, and battery chargers take much longer.'
      },
      {
        question: 'Why should I only use 80% of a circuit breaker’s capacity?',
        answer: 'For appliances that run continuously for 3 hours or more (such as space heaters, EV chargers, or servers), electrical safety standards require sizing the circuit at 125% of the load. This ensures the breaker stays at or below 80% capacity to avoid nuisance trips from internal heat buildup.'
      },
      {
        question: 'What is the difference between copper and aluminum wiring?',
        answer: 'Copper conducts electricity more easily and has lower resistance than aluminum, meaning you can use a thinner copper wire for the same electrical load. Aluminum is lighter and less expensive for large service entrance cables, but requires a thicker gauge.'
      },
      {
        question: 'How do I convert Watts to Amps?',
        answer: 'Divide Watts by Volts. For example, a 1,200W hair dryer plugged into a standard 120V outlet draws: 1,200 ÷ 120 = 10 Amps.'
      },
      {
        question: 'What is the difference between 120V, 240V, and 3-Phase power?',
        answer: '120V is standard for everyday household wall plugs (lamps, TVs, laptops). 240V is used for high-power home appliances like electric dryers, ovens, water heaters, and EV chargers. 3-Phase power is used in commercial buildings and factories for heavy industrial machinery.'
      },
      {
        question: 'Do these online calculators replace an inspection by a licensed electrician?',
        answer: 'No. Our calculators provide accurate mathematical formulas and reference guidelines for planning your projects. For physical installations, panel upgrades, and permitted work, always consult your local municipal codes and a licensed electrician.'
      }
    ],
    trust: {
      formulasUsed: 'National Electrical Code (NEC / NFPA 70 guidelines), standard Ohm’s law formulas, and verified electrical engineering principles.',
      sourceReferences: [
        'National Electrical Code (NEC / NFPA 70 Guidelines)',
        'IEEE Standard Electrical Sizing Guidelines',
        'National Institute of Standards and Technology (NIST) Reference Tables'
      ],
      assumptions: [
        'Conductors are copper or aluminum operating at standard temperatures (75°C insulation rating) unless specified otherwise.',
        'AC systems assume standard 60 Hz household supply.'
      ],
      updateProcess: 'All formulas and wire sizing tables are regularly reviewed against standard code revisions.',
      limitations: [
        'Reference only. Always verify local building codes and work with a licensed professional for electrical installations.'
      ]
    }
  },

  automotive: {
    slug: 'automotive',
    categoryName: 'Automotive',
    h1: 'Automotive Calculators',
    intro: 'SolveItCalculator’s automotive engineering and vehicle suite provides authoritative calculators for tire size comparison and speedometer error calibration, engine displacement and compression ratios, horsepower, torque, gear ratios, fuel economy (MPG and L/100km), trip fuel expenses, and auto loan financing. Developed for mechanics, automotive enthusiasts, track racers, and vehicle buyers, our tools adhere to standard SAE International mechanical dynamics, EPA fuel efficiency standards, and banking loan formulas.',
    afterToolsSection: {
      badge: 'Complete Automotive Engineering & Ownership Suite',
      subheadingLine1: 'Physics-Based Vehicle Dynamics & Smart Buying Tools',
      subheadingLine2: 'Calibrated for Tires, Engine Geometry, Speedometer Error, and Auto Financing',
      paragraph: 'From comparing aftermarket tire diameters to rebuilding an engine block or calculating monthly auto loan payments, SolveItCalculator gives you instant, accurate mechanical calculations. Easily check speedometer calibration offsets after upgrading wheels, compute engine displacement in cubic inches (CID) and liters, estimate carburetor CFM requirements, convert torque to horsepower, and calculate total interest on car loans and leases.'
    },
    popularToolSlugs: [
      'gear-ratio-calculator',
      'engine-rpm-calculator',
      'fuel-economy-converter',
      'speed-converter'
    ],
    goals: [
      {
        task: 'Compare tire sizes and calculate speedometer calibration error',
        description: 'Check diameter changes, sidewall profile height, revolutions per mile, and speed difference when upsizing or downsizing tires.',
        targetToolTitle: 'Tire Size Comparison & Speedometer Error Tool',
        targetUrl: '/automotive',
        badge: 'Tires & Wheels'
      },
      {
        task: 'Calculate engine displacement (CID, cc, Liters) from bore and stroke',
        description: 'Compute swept cylinder displacement, compression ratio, and mean piston speed at peak RPM.',
        targetToolTitle: 'Engine Displacement & Piston Calculator',
        targetUrl: '/automotive',
        badge: 'Engine Rebuild'
      },
      {
        task: 'Calculate Horsepower, Torque, and Quarter-Mile Performance',
        description: 'Convert between torque and horsepower at specific RPMs, or estimate 1/4-mile elapsed time and trap speed from curb weight.',
        targetToolTitle: 'Horsepower & Quarter-Mile Simulator',
        targetUrl: '/automotive',
        badge: 'Performance'
      },
      {
        task: 'Calculate trip fuel costs, MPG efficiency, and fuel consumption',
        description: 'Determine total fuel required, cost per mile, and convert seamlessly between US MPG, Imperial MPG, and L/100km.',
        targetToolTitle: 'Trip Fuel & MPG Calculator',
        targetUrl: '/conversions/fuel-economy',
        badge: 'Fuel & Costs'
      },
      {
        task: 'Calculate monthly auto loan payments and total financing interest',
        description: 'Estimate monthly car payments, total loan cost, and lease fee breakdowns with custom down payments and interest rates.',
        targetToolTitle: 'Auto Loan & Lease Payment Calculator',
        targetUrl: '/automotive',
        badge: 'Vehicle Loans'
      }
    ],
    subcategories: [
      {
        id: 'engine-trans',
        name: 'Engine & Transmission Calculators',
        path: '/automotive',
        description: 'Engine displacement (CID & cc), compression ratio, carburetor CFM, horsepower, torque, RPM, gear ratios, and piston speed.',
        representativeToolSlugs: ['gear-ratio-calculator', 'engine-rpm-calculator']
      },
      {
        id: 'wheels-tires',
        name: 'Wheels & Tires Calculators',
        path: '/automotive',
        description: 'Tire size comparison, diameter and circumference, speedometer error after tire changes, and wheel offset/backspacing.',
        representativeToolSlugs: ['speed-converter']
      },
      {
        id: 'fuel-economy',
        name: 'Fuel & Fuel Economy Calculators',
        path: '/conversions/fuel-economy',
        description: 'Miles per gallon (MPG), fuel cost per trip, fuel consumption converter (L/100km & km/L), and EV range estimators.',
        representativeToolSlugs: ['fuel-economy-converter']
      },
      {
        id: 'vehicle-finance',
        name: 'Vehicle Financing & Ownership Calculators',
        path: '/automotive',
        description: 'Auto loan monthly payments, car lease costs, depreciation estimators, and RV/boat/motorcycle loan calculators.',
        representativeToolSlugs: ['gear-ratio-calculator']
      },
      {
        id: 'performance-speed',
        name: 'Performance & Speed Calculators',
        path: '/automotive',
        description: 'Quarter-mile ET and trap speed, speedometer calibration, transmission gear ratios, and marine boat top speed.',
        representativeToolSlugs: ['engine-rpm-calculator']
      }
    ],
    guides: [
      {
        title: 'How Speed, Gear Ratios, and Tire Diameter Determine Engine RPM',
        formula: 'RPM = (Speed in MPH × Gear Ratio × Final Drive Ratio × 336) / Tire Diameter in Inches',
        formulaDescription: 'Where 336 is the standard dimensional constant converting inches and minutes to miles and hours (5,280 ft/mi × 12 in/ft ÷ 60 min/hr ÷ π).',
        howItWorks: [
          'Multiply transmission gear ratio by the differential axle ratio to get total drivetrain reduction.',
          'Calculate overall tire rolling diameter: Wheel Diameter + 2 × (Tire Width × Aspect Ratio ÷ 25.4).',
          'Solve for cruising engine RPM or determine theoretical top road speed.'
        ],
        example: {
          scenario: 'Cruising at 70 mph in 5th gear (0.82 overdrive), 3.73 axle ratio, with 28-inch tires',
          inputs: { Speed: '70 MPH', 'Gear Ratio': '0.82', 'Axle Ratio': '3.73', 'Tire Diameter': '28.0 in' },
          calculation: 'RPM = (70 × 0.82 × 3.73 × 336) / 28 = 71,944 / 28',
          result: 'Engine RPM = 2,569 RPM at 70 mph'
        },
        commonMistakes: [
          'Neglecting tire sidewall deflection under vehicle weight (rolling radius is ~3% smaller than static diameter).',
          'Forgetting torque converter slip in non-lockup torque converter automatics.'
        ],
        practicalTips: [
          'Taller tires lower engine cruising RPM on highways, but reduce wheel torque and acceleration off the line.'
        ]
      },
      {
        title: 'Calculating Speedometer Calibration Error After Changing Tires',
        formula: 'Speed Error (%) = ((New Tire Diameter - Stock Tire Diameter) / Stock Tire Diameter) × 100%',
        formulaDescription: 'Taller tires travel further per revolution, causing the vehicle to travel faster than the speedometer displays.',
        howItWorks: [
          'Compute stock OEM tire diameter and new aftermarket tire diameter.',
          'Calculate diameter scaling factor: New Diameter ÷ Stock Diameter.',
          'Actual Speed = Indicated Speedometer Reading × (New Diameter ÷ Stock Diameter).'
        ],
        example: {
          scenario: 'Replacing 28.0-inch stock tires with 33.0-inch off-road tires, speedometer reading 65 mph',
          inputs: { 'Stock Diameter': '28.0 in', 'New Diameter': '33.0 in', 'Indicated Speed': '65 mph' },
          calculation: 'Speedometer Error = ((33 - 28) / 28) × 100% = +17.86%. Actual Speed = 65 × (33 / 28) = 76.61 mph.',
          result: 'When speedometer reads 65 mph, your actual vehicle speed is 76.6 mph'
        },
        commonMistakes: [
          'Assuming speedometer error is a fixed constant (it is a percentage multiplier that increases at higher speeds).'
        ],
        practicalTips: [
          'Reprogram your vehicle ECU tire revolutions-per-mile setting when diameter variance exceeds ±3% to preserve ABS and stability control.'
        ]
      },
      {
        title: 'Calculating Engine Displacement from Cylinder Bore and Stroke',
        formula: 'Displacement (CID) = π × (Bore ÷ 2)² × Stroke × Number of Cylinders',
        formulaDescription: 'Swept volume inside the engine block. To convert Cubic Inches to Liters: multiply CID by 0.016387.',
        howItWorks: [
          'Measure cylinder bore diameter and crankshaft piston stroke in inches.',
          'Calculate cross-sectional area of one cylinder: π × radius².',
          'Multiply by stroke length to find single cylinder volume, then multiply by total cylinders.'
        ],
        example: {
          scenario: 'Small Block V8 with 4.000 in bore and 3.480 in stroke (8 cylinders)',
          inputs: { Bore: '4.000 in', Stroke: '3.480 in', Cylinders: '8' },
          calculation: 'Volume = 3.14159 × (2.000)² × 3.480 × 8 = 3.14159 × 4 × 3.480 × 8 = 349.85 CID.',
          result: 'Displacement = 350 Cubic Inches (5.73 Liters / 5,733 cc)'
        },
        commonMistakes: [
          'Using cylinder diameter directly in the area formula instead of the radius (half the bore).',
          'Mixing metric millimeters with imperial inches without unit conversion.'
        ],
        practicalTips: [
          'To convert cubic centimeters (cc) to liters, divide by 1,000 (e.g. 5,733 cc = 5.73 L).'
        ]
      }
    ],
    relatedCategorySlugs: ['conversions', 'electrical', 'math', 'business'],
    faqs: [
      {
        question: 'What automotive tools are included in the automotive calculators suite?',
        answer: 'Our suite includes all 5 major competitor categories: Engine & Transmission (displacement, compression ratio, carburetor CFM, horsepower, torque, RPM, gear ratio, piston speed), Wheels & Tires (tire comparison, speedometer error, offset & backspacing), Fuel Economy (MPG, trip fuel cost, L/100km conversion, EV charging), Vehicle Financing (auto loans, lease payments, true cost of ownership), and Performance (quarter-mile ET and trap speed, marine speed).'
      },
      {
        question: 'How do I calculate speedometer error when changing tire sizes?',
        answer: 'Calculate the ratio of the new tire diameter divided by the stock tire diameter: Speed Ratio = New Diameter ÷ Stock Diameter. Multiply your speedometer reading by this ratio. For instance, moving from 28-inch tires to 33-inch tires increases speed by 17.86%, meaning a speedometer reading of 65 mph is actually 76.6 mph on the road.'
      },
      {
        question: 'How do you calculate Carburetor CFM for an engine?',
        answer: 'Carburetor CFM = (Engine Displacement in CID × Maximum Operating RPM × Volumetric Efficiency) ÷ 3,456. A street engine typically operates at 80% to 85% volumetric efficiency, while racing engines operate at 95% to 110% with forced induction.'
      },
      {
        question: 'What is the relationship between Horsepower and Torque?',
        answer: 'Horsepower (HP) and Torque (lb-ft) are related by engine speed: Horsepower = (Torque × RPM) ÷ 5,252. Torque measures rotational force, while horsepower measures how rapidly that force does work over time. At exactly 5,252 RPM, horsepower and torque curves will always intersect and be numerically equal.'
      },
      {
        question: 'How is an auto loan monthly payment calculated?',
        answer: 'Monthly Payment = [Loan Amount × r × (1 + r)^n] ÷ [(1 + r)^n - 1], where r is the monthly interest rate (annual APR ÷ 12) and n is the total number of monthly payments (years × 12). Subtracting your down payment and vehicle trade-in credit reduces the financed principal.'
      },
      {
        question: 'How does tire aspect ratio affect overall tire diameter?',
        answer: 'In a metric tire size like 225/65R17, 225 is the section width in millimeters, 65 is the aspect ratio (sidewall height is 65% of 225 mm = 146.25 mm or 5.76 inches), and 17 is the wheel rim diameter in inches. Total diameter = Wheel Rim + (2 × Sidewall Height).'
      }
    ],
    trust: {
      formulasUsed: 'SAE International vehicle dynamics equations, EPA fuel economy guidelines, and standard banking amortization physics.',
      sourceReferences: [
        'SAE International Automotive Engineering Technical Papers',
        'EPA (Environmental Protection Agency) Fuel Economy Testing Methodology (40 CFR Part 600)',
        'Tire and Rim Association (TRA) Standards and Dimensional Guidelines'
      ],
      assumptions: [
        'Drivetrain calculations assume rigid tire contact without extreme rotational tire growth at supersonic speeds.',
        'Combustion fuel consumption estimates assume stoichiometric burn conditions.'
      ],
      updateProcess: 'Fuel price averages and EV charging standard metrics are verified periodically against US Department of Energy figures.',
      limitations: [
        'Real-world vehicle performance varies with aerodynamic drag, road gradient, ambient temperature, and driving behavior.'
      ]
    }
  },

  'home-construction': {
    slug: 'home-construction',
    categoryName: 'Home & Construction',
    h1: 'Home & Construction Calculators',
    intro: 'SolveItCalculator’s home improvement and building construction hub offers material estimation tools for concrete slabs and footings, framing lumber and drywall sheets, roof pitch and shingle squares, flooring square footage with cut-waste buffers, paint coverage, and HVAC heating/cooling BTU requirements. Created for general contractors, carpenters, masonry masons, architects, and DIY homeowners, our tools incorporate International Residential Code (IRC) and ASTM building standards. Users can calculate exact cubic yards of premix concrete required for foundations, determine the number of 4x8 drywall panels needed for room ceilings and walls, convert roof rise/run slope into true surface area squares, and compute square footage of irregular polygon layouts.',
    popularToolSlugs: [
      'home-construction-calculators',
      'area-converter',
      'volume-converter'
    ],
    goals: [
      {
        task: 'Calculate cubic yards of concrete for slabs, footings, and patios',
        description: 'Compute exact ready-mix concrete volume with mandatory 10% spillage and sub-base allowance.',
        targetToolTitle: 'Concrete Slab & Footing Calculator',
        targetUrl: '/home-construction',
        badge: 'Concrete & Masonry'
      },
      {
        task: 'Calculate square footage and flooring materials with waste factor',
        description: 'Estimate hardwood, tile, or laminate boxes needed with 10–15% layout cut-waste buffer.',
        targetToolTitle: 'Flooring Square Footage Calculator',
        targetUrl: '/conversions/area',
        badge: 'Flooring & Tile'
      },
      {
        task: 'Calculate roof pitch, slope, and roofing shingle bundles',
        description: 'Convert roof rise-over-run pitch into rafter lengths and 100-sq-ft shingle squares.',
        targetToolTitle: 'Roof Pitch & Shingle Calculator',
        targetUrl: '/home-construction',
        badge: 'Roofing'
      },
      {
        task: 'Calculate paint gallons for interior and exterior walls',
        description: 'Deduct door and window openings to determine exact paint gallons for 1 or 2 coats.',
        targetToolTitle: 'Paint Coverage Calculator',
        targetUrl: '/home-construction',
        badge: 'Painting & Drywall'
      }
    ],
    subcategories: [
      {
        id: 'masonry',
        name: 'Concrete, Masonry & Foundations',
        path: '/home-construction',
        description: 'Cubic yard volume, slab thickness, sonotube footings, and rebar grid weights.',
        representativeToolSlugs: ['home-construction-calculators']
      },
      {
        id: 'finishes',
        name: 'Flooring, Paint & Drywall',
        path: '/conversions/area',
        description: 'Square footage calculations, tile layout waste, paint coverage, and 4x8 sheet counts.',
        representativeToolSlugs: ['area-converter']
      }
    ],
    guides: [
      {
        title: 'How to Calculate Concrete Slab Volume in Cubic Yards',
        formula: 'Volume (yd³) = [Length (ft) × Width (ft) × Thickness (in) / 12] / 27 × 1.10',
        formulaDescription: 'Where 27 converts cubic feet to cubic yards (3 ft × 3 ft × 3 ft = 27 ft³/yd³), and 1.10 includes a standard 10% waste buffer.',
        howItWorks: [
          'Multiply length by width in feet to calculate surface area in square feet.',
          'Divide thickness in inches by 12 to convert depth into feet.',
          'Multiply area by depth to get volume in cubic feet, then divide by 27 for cubic yards.',
          'Always multiply by 1.10 (add 10%) for grade unevenness, form bulging, and spillage.'
        ],
        example: {
          scenario: '20 ft × 30 ft patio slab, 4 inches thick',
          inputs: { Length: '30 ft', Width: '20 ft', Thickness: '4 in' },
          calculation: 'Area = 600 sq ft. Volume = (600 × 4/12) / 27 = 200 / 27 = 7.41 yd³. With 10% waste: 7.41 × 1.10 = 8.15 yd³.',
          result: 'Order 8.25 cubic yards of ready-mix concrete'
        },
        commonMistakes: [
          'Forgetting to convert 4 inches to feet (dividing by 12) before multiplying with feet measurements.',
          'Ordering exact calculated volume without a 5-10% buffer, leaving the pour short when forms bow under pressure.'
        ],
        practicalTips: [
          'Ready-mix suppliers deliver in 1/4 cubic yard increments (e.g. 8.25 or 8.50 yards).'
        ]
      },
      {
        title: 'Roof Pitch and the Pythagorean Rafter Multiplier',
        formula: 'Roof Pitch Factor = √[1 + (Rise / 12)²] ; Actual Roof Area = Flat Footprint × Pitch Factor',
        formulaDescription: 'Roof slope is expressed as inches of vertical rise per 12 inches of horizontal run (e.g., 6/12 pitch).',
        howItWorks: [
          'Determine the roof pitch (e.g. 6/12 means 6 inches rise per 12 inches run).',
          'Calculate multiplier: √[1 + (6/12)²] = √[1 + 0.25] = √1.25 ≈ 1.118.',
          'Multiply flat horizontal building footprint (plus eaves) by 1.118 to find true sloped roof surface area.'
        ],
        example: {
          scenario: '2,000 sq ft building footprint with a 6/12 roof pitch',
          inputs: { 'Building Footprint': '2,000 sq ft', 'Pitch (Rise/12)': '6/12', Multiplier: '1.118' },
          calculation: 'True Surface Area = 2,000 × 1.118 = 2,236 sq ft. Total Squares (100 sq ft/square) = 22.36 squares.',
          result: '22.36 Squares (Order 25 squares including 10% valley/starter waste, or 75 total shingle bundles)'
        },
        commonMistakes: [
          'Estimating shingle bundles from flat aerial satellite square footage without applying the pitch multiplier.',
          'Forgetting that 3 standard asphalt shingle bundles equal 1 roofing square (100 sq ft).'
        ],
        practicalTips: [
          'Steeper roofs (8/12 and above) require 15% waste allowance due to increased diagonal rake and valley cuts.'
        ]
      }
    ],
    relatedCategorySlugs: ['electrical', 'conversions', 'business', 'math'],
    faqs: [
      {
        question: 'How many 80 lb bags of concrete make one cubic yard?',
        answer: 'One cubic yard is 27 cubic feet. An 80 lb bag yields approximately 0.60 cubic feet of mixed concrete. Therefore, it requires 45 bags of 80 lb concrete (or 60 bags of 60 lb concrete) to make 1 cubic yard.'
      },
      {
        question: 'What is a "Square" in residential roofing materials?',
        answer: 'In the construction industry, one "square" of roofing equals exactly 100 square feet of roof surface area. Standard architectural shingles are packaged 3 bundles per square.'
      },
      {
        question: 'What is the standard waste factor recommended for tile and hardwood flooring?',
        answer: 'A 10% waste buffer is standard for straight grid installations. For diagonal, herringbone, or chevron patterns with high edge cutoffs, a 15% to 20% waste factor is recommended.'
      },
      {
        question: 'How many square feet does one gallon of interior wall paint cover?',
        answer: 'One standard gallon of interior acrylic paint covers approximately 350 to 400 square feet on primed drywall. Rough or unprimed surfaces absorb more and average 250 to 300 square feet per gallon.'
      },
      {
        question: 'How is drywall sheet count calculated for a room?',
        answer: 'Total room surface area (Perimeter × Wall Height + Ceiling Area - Door/Window openings) divided by sheet area (32 sq ft for 4x8 ft sheets, or 48 sq ft for 4x12 ft sheets), plus a 10% cut-waste allowance.'
      },
      {
        question: 'How do you calculate HVAC BTU heating and cooling capacity?',
        answer: 'A baseline rule of thumb is 20 BTU per square foot of living space with standard 8-ft ceilings, adjusted for regional climate zone, window insulation ratings, and ceiling height (Manual J calculations).'
      }
    ],
    trust: {
      formulasUsed: 'International Residential Code (IRC 2024), ASTM International concrete standards, and standard geometric solid volume equations.',
      sourceReferences: [
        'International Code Council (ICC) International Residential Code (IRC)',
        'American Concrete Institute (ACI 318: Building Code Requirements for Structural Concrete)',
        'ASTM International Material Specifications for Concrete and Aggregates'
      ],
      assumptions: [
        'Sub-grade excavation is leveled and compacted according to standard engineering specifications.',
        'Lumber dimensions use actual dressed sizes (e.g. 2x4 is actually 1.5 in × 3.5 in).'
      ],
      updateProcess: 'Building material density constants and IRC code requirements are audited annually.',
      limitations: [
        'Structural framing calculations do not replace certified civil/structural engineer load-bearing stamp drawings.'
      ]
    }
  },

  education: {
    slug: 'education',
    categoryName: 'Education',
    h1: 'Education Calculators',
    intro: 'SolveItCalculator’s education and academic planning hub provides tools for Grade Point Average (GPA) calculations, weighted and unweighted honor point scales, final exam target grade estimators, semester course planning, and student loan repayment. Tailored for high school students, university undergraduates, graduate researchers, and academic advisors, our calculators bring clarity to academic performance tracking. Users can calculate cumulative GPA on standard 4.0 and weighted 5.0 scales, determine the exact score needed on a comprehensive final exam to maintain a course letter grade, calculate college credit hour progress, and estimate student debt amortization.',
    popularToolSlugs: [
      'education-calculators-academic-planning-tools',
      'percentage-calculator',
      'scientific-calculator'
    ],
    goals: [
      {
        task: 'Calculate unweighted (4.0) and weighted (5.0) cumulative GPA',
        description: 'Factor course credits and letter grades across standard, Honors, AP, and IB course tiers.',
        targetToolTitle: 'GPA & Honor Point Calculator',
        targetUrl: '/education',
        badge: 'Grade Point Average'
      },
      {
        task: 'Calculate required final exam score to achieve target class grade',
        description: 'Determine exact percentage needed on the final based on current grade and exam weighting.',
        targetToolTitle: 'Final Grade Calculator',
        targetUrl: '/education',
        badge: 'Exam Planning'
      },
      {
        task: 'Calculate weighted average course grade across assignments',
        description: 'Combine homework, midterm exams, quizzes, and class projects with custom percentage weights.',
        targetToolTitle: 'Weighted Grade Calculator',
        targetUrl: '/education',
        badge: 'Coursework'
      }
    ],
    subcategories: [
      {
        id: 'gpa',
        name: 'GPA & Academic Performance',
        path: '/education',
        description: 'Cumulative GPA, semester weighted GPA, and AP/Honors course multipliers.',
        representativeToolSlugs: ['education-calculators-academic-planning-tools']
      },
      {
        id: 'grades',
        name: 'Course Grades & Exam Solvers',
        path: '/education',
        description: 'Final exam score requirements, weighted assignment categories, and grading curves.',
        representativeToolSlugs: ['percentage-calculator']
      }
    ],
    guides: [
      {
        title: 'How Cumulative GPA and Credit Hours Are Calculated',
        formula: 'GPA = Σ (Course Grade Points × Credit Hours) / Total Credit Hours',
        formulaDescription: 'Grade points: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0. In weighted scales, add +0.5 for Honors and +1.0 for AP/IB.',
        howItWorks: [
          'Multiply each course numerical grade point by the course credit hours to find Quality Points.',
          'Sum all Quality Points across all enrolled courses.',
          'Divide total Quality Points by total attempted credit hours.'
        ],
        example: {
          scenario: 'Student takes 4 courses: Math (4 cr, A), Physics (4 cr, B), English (3 cr, A), History (3 cr, C)',
          inputs: { Math: '4 cr × 4.0 = 16.0', Physics: '4 cr × 3.0 = 12.0', English: '3 cr × 4.0 = 12.0', History: '3 cr × 2.0 = 6.0' },
          calculation: 'Total Quality Points = 16 + 12 + 12 + 6 = 46.0. Total Credit Hours = 4 + 4 + 3 + 3 = 14.0. GPA = 46.0 / 14.0.',
          result: 'Cumulative GPA = 3.29'
        },
        commonMistakes: [
          'Averaging letter grades directly without weighting by course credit hours (a 4-credit lab carries double the weight of a 2-credit seminar).',
          'Counting Pass/Fail credits in the GPA denominator (P/F courses earn credits toward graduation but do not affect GPA).'
        ],
        practicalTips: [
          'Retaking a course to replace a low grade produces the highest mathematical lift in cumulative GPA.'
        ]
      },
      {
        title: 'Calculating Your Required Final Exam Score',
        formula: 'Required Exam % = [Target Grade % - (Current Grade % × (1 - Exam Weight))] / Exam Weight',
        formulaDescription: 'Computes the minimum percentage score needed on a weighted comprehensive final to secure a target letter grade.',
        howItWorks: [
          'Determine current standing grade percentage in the course.',
          'Determine percentage weight of the final exam (e.g., 25% = 0.25).',
          'Solve for the required exam percentage score.'
        ],
        example: {
          scenario: 'Current grade is 84.0% (B), target grade is 90.0% (A), final exam is worth 25% of total grade',
          inputs: { 'Current Grade': '84.0%', 'Target Grade': '90.0%', 'Exam Weight': '25% (0.25)' },
          calculation: 'Current Component = 84 × 0.75 = 63.0. Required = (90.0 - 63.0) / 0.25 = 27.0 / 0.25 = 108.0%.',
          result: 'Required Final Exam Score = 108.0% (Mathematically impossible without extra credit)'
        },
        commonMistakes: [
          'Entering exam weight as a whole number without decimal conversion in calculation engines.',
          'Assuming 90% is needed on the final to get an A when a lower score might suffice if current grade is already high.'
        ],
        practicalTips: [
          'If the required final exam score exceeds 100%, adjust your realistic target to the next achievable letter grade bracket.'
        ]
      }
    ],
    relatedCategorySlugs: ['math', 'time-date', 'finance', 'science'],
    faqs: [
      {
        question: 'What is the difference between Weighted and Unweighted GPA?',
        answer: 'Unweighted GPA measures academic achievement on a standard 0.0 to 4.0 scale regardless of course difficulty. Weighted GPA assigns extra quality points (typically +0.5 for Honors and +1.0 for AP/IB courses) on a 5.0 scale to reward rigorous academic coursework.'
      },
      {
        question: 'How do plus/minus letter grades convert to grade points?',
        answer: 'Standard 4.0 collegiate grading scales assign: A+ (4.0/4.3), A (4.0), A- (3.7), B+ (3.3), B (3.0), B- (2.7), C+ (2.3), C (2.0), C- (1.7), D+ (1.3), D (1.0), F (0.0).'
      },
      {
        question: 'Can a final exam bring down my current course letter grade?',
        answer: 'Yes. If your final exam score is lower than your current class average, your overall semester grade will decrease proportionally to the weight of the exam.'
      },
      {
        question: 'How do college credit hours determine full-time enrollment status?',
        answer: 'In US higher education, 12 or more credit hours per semester is defined as full-time status for federal financial aid (FAFSA) purposes, with 15 credits per semester required to graduate in 4 years (120 total credits).'
      },
      {
        question: 'Are high school and college GPA calculation methods identical?',
        answer: 'The core mathematical formula (Quality Points divided by Credits) is identical. However, colleges rarely use 5.0 weighted GPA scales on official transcripts, whereas high schools frequently do for class rank determination.'
      },
      {
        question: 'Does this calculator support international grading systems (ECTS, UK Honours, Australian ATAR)?',
        answer: 'Yes, our conversion modules allow mapping between US letter grades, UK Class Honours (First, 2:1, 2:2), and European ECTS scales.'
      }
    ],
    trust: {
      formulasUsed: 'Standardized US Higher Education Quality Point GPA formulas and weighted mathematical average algorithms.',
      sourceReferences: [
        'College Board Standardized Grading & AP Weighted Scales',
        'National Association for College Admission Counseling (NACAC) Transcript Guidelines',
        'US Department of Education Federal Student Aid (FAFSA) Credit Hour Definitions'
      ],
      assumptions: [
        'Standard 4.0 unweighted grading scale unless an advanced academic tier is explicitly selected.',
        'All entered grades and credit weights are non-negative real numbers.'
      ],
      updateProcess: 'Academic scaling conventions are reviewed annually against College Board recommendations.',
      limitations: [
        'Individual institutions and school districts maintain sovereign autonomy over local grading scales and rounding thresholds.'
      ]
    }
  },

  science: {
    slug: 'science',
    categoryName: 'Science',
    h1: 'Science Calculators',
    intro: 'SolveItCalculator’s scientific and physical sciences hub provides computational engines for classical Newtonian kinematics, thermodynamics, electromagnetism, chemical molarity and stoichiometry, wave optics, quantum energy, and astronomical ephemeris. Designed for physics researchers, chemistry students, laboratory technicians, and science educators, these tools solve dimensional equations with verified physical constants defined by the Committee on Data for Science and Technology (CODATA). Users can calculate gravitational projectile trajectories, solve the Ideal Gas Law (PV = nRT), compute wave frequencies and photon energy using Planck’s constant, calculate radioactive half-life decay, and determine solution dilution molarities.',
    popularToolSlugs: [
      'science-calculators-scientific-tools',
      'scientific-calculator',
      'scientific-converter',
      'energy-converter'
    ],
    goals: [
      {
        task: 'Solve Ideal Gas Law (PV = nRT) for pressure, volume, or temperature',
        description: 'Calculate molar gas dynamics with standard universal gas constant R = 8.314 J/(mol·K).',
        targetToolTitle: 'Ideal Gas Law Calculator',
        targetUrl: '/science',
        badge: 'Thermodynamics'
      },
      {
        task: 'Calculate projectile motion, flight time, and maximum trajectory height',
        description: 'Model 2D kinematic trajectory under gravitational acceleration with launch angle and initial velocity.',
        targetToolTitle: 'Kinematics & Projectile Calculator',
        targetUrl: '/science',
        badge: 'Classical Physics'
      },
      {
        task: 'Compute photon energy and wavelength via Planck’s equation',
        description: 'Calculate energy (E = hf = hc/λ) across the electromagnetic spectrum from radio to gamma rays.',
        targetToolTitle: 'Photon Energy & Wave Calculator',
        targetUrl: '/science',
        badge: 'Quantum Physics'
      }
    ],
    subcategories: [
      {
        id: 'physics',
        name: 'Classical Physics & Kinematics',
        path: '/science',
        description: 'Velocity, acceleration, force (F=ma), kinetic and potential energy, and circular motion.',
        representativeToolSlugs: ['science-calculators-scientific-tools']
      },
      {
        id: 'chemistry',
        name: 'Chemistry & Thermodynamics',
        path: '/science',
        description: 'Ideal gas law, molarity, solution dilutions, and radioactive half-life decay.',
        representativeToolSlugs: ['scientific-converter']
      }
    ],
    guides: [
      {
        title: 'The Ideal Gas Law and Thermodynamic State Equations',
        formula: 'P × V = n × R × T',
        formulaDescription: 'Where P is pressure (Pa), V is volume (m³), n is amount of substance (moles), R is universal gas constant (8.314462 J·mol⁻¹·K⁻¹), and T is absolute temperature (Kelvin).',
        howItWorks: [
          'Convert temperature to absolute Kelvin scale (T = °C + 273.15).',
          'Ensure pressure is expressed in Pascals (1 atm = 101,325 Pa) and volume in cubic meters (1 L = 0.001 m³).',
          'Solve for the single unknown variable using algebraic substitution.'
        ],
        example: {
          scenario: '2.0 moles of ideal gas occupying 0.05 m³ at 300 Kelvin',
          inputs: { 'Moles (n)': '2.0 mol', 'Volume (V)': '0.05 m³', 'Temp (T)': '300 K', R: '8.314 J/(mol·K)' },
          calculation: 'P = (n × R × T) / V = (2.0 × 8.314 × 300) / 0.05 = 4,988.4 / 0.05 = 99,768 Pa',
          result: 'Pressure P = 99,768 Pa (0.985 atm or 14.47 psi)'
        },
        commonMistakes: [
          'Using Celsius rather than Kelvin for thermodynamic temperature.',
          'Mismatched units between gas constant R and pressure/volume dimensions (e.g. using L·atm vs J·m³).'
        ],
        practicalTips: [
          'Standard Temperature and Pressure (STP) is defined as 0°C (273.15 K) and 1 bar (100 kPa).'
        ]
      },
      {
        title: 'Kinematics: 2D Projectile Motion Flight Time and Range',
        formula: 'Range R = (v₀² × sin(2θ)) / g ; Max Height H = (v₀² × sin²(θ)) / (2g)',
        formulaDescription: 'Where v₀ is launch velocity, θ is launch angle, and g is standard gravitational acceleration (9.80665 m/s²).',
        howItWorks: [
          'Decompose initial velocity into horizontal (v₀ cos θ) and vertical (v₀ sin θ) vectors.',
          'Vertical motion determines total time of flight under gravity.',
          'Horizontal range equals horizontal velocity multiplied by total flight time (in zero air resistance).'
        ],
        example: {
          scenario: 'Projectile launched at 50 m/s at a 45° angle over flat terrain',
          inputs: { 'Initial Velocity (v₀)': '50 m/s', 'Angle (θ)': '45°', 'Gravity (g)': '9.807 m/s²' },
          calculation: 'Range = (50² × sin(90°)) / 9.807 = (2500 × 1.0) / 9.807 = 254.92 meters.',
          result: 'Maximum Horizontal Range = 254.92 meters'
        },
        commonMistakes: [
          'Assuming a 45° launch angle maximizes range when air drag and aerodynamic lift are present.',
          'Forgetting that vertical velocity is exactly zero at the apex of maximum flight height.'
        ],
        practicalTips: [
          'In a vacuum, 45° yields maximum theoretical range; in atmospheric air resistance, optimal launch angle drops to 35°–42°.'
        ]
      }
    ],
    relatedCategorySlugs: ['math', 'conversions', 'electrical', 'technology'],
    faqs: [
      {
        question: 'What value is used for gravitational acceleration (g)?',
        answer: 'Standard standard Earth gravitational acceleration is defined as exactly g = 9.80665 m/s² (32.1740 ft/s²) by the International Bureau of Weights and Measures (BIPM).'
      },
      {
        question: 'What is Planck’s constant and how is photon energy computed?',
        answer: 'Planck’s constant (h = 6.62607015 × 10⁻³⁴ J·s) relates photon frequency (f) to its quantum energy: E = hf. Since speed of light c = λf, energy can also be written E = hc / λ.'
      },
      {
        question: 'How is solution molarity (M) calculated?',
        answer: 'Molarity (M) = Moles of Solute ÷ Liters of Solution. For chemical dilution, use the conservation equation M₁V₁ = M₂V₂.'
      },
      {
        question: 'How does radioactive half-life decay work?',
        answer: 'Decay follows exponential reduction: N(t) = N₀ × (1/2)^(t / t_half) = N₀ × e^(-λt), where λ = ln(2) / t_half is the decay constant.'
      },
      {
        question: 'Are relativistic effects included in kinematic tools?',
        answer: 'Standard kinematics use classical Newtonian mechanics, which is accurate for speeds below 10% the speed of light (v < 0.1c). For relativistic velocities, Lorentz factor corrections (γ = 1/√(1 - v²/c²)) apply.'
      },
      {
        question: 'Are scientific constants updated according to international redefinitions?',
        answer: 'Yes, all fundamental constants (c, h, e, k, N_A) match the 2019 SI redefinition where base constants are assigned exact mathematical numerical values.'
      }
    ],
    trust: {
      formulasUsed: 'CODATA recommended fundamental physical constants, IUPAC chemical standards, and classical/quantum physical principles.',
      sourceReferences: [
        'CODATA (Committee on Data for Science and Technology) Fundamental Physical Constants',
        'IUPAC (International Union of Pure and Applied Chemistry) Compendium of Chemical Terminology',
        'NIST Physical Reference Data & Metric Practice'
      ],
      assumptions: [
        'Ideal gas models assume point-mass particles with zero intermolecular attraction or volume exclusion.',
        'Kinematic projectile models assume standard sea-level gravitational acceleration without aerodynamic turbulence unless specified.'
      ],
      updateProcess: 'Physical constants are synchronized with official CODATA four-year release cycles.',
      limitations: [
        'Extreme astrophysical or quantum field conditions require specialized relativistic tensor modeling.'
      ]
    }
  },

  technology: {
    slug: 'technology',
    categoryName: 'Technology',
    h1: 'Technology Calculators',
    intro: 'SolveItCalculator’s technology hub gives you easy-to-use tools for everyday computer, internet, and tech questions. Whether you want to know how long a game download will take, why your 1 TB hard drive only shows 931 GB on your computer, how strong your password really is, or how much memory your server needs, our tools explain the math in clear, simple everyday words.',
    popularToolSlugs: [
      'download-time-calculator',
      'binary-storage-converter',
      'password-strength-checker',
      'ipv4-subnet-calculator',
      'rem-to-px-calculator',
      'server-power-cost-calculator'
    ],
    goals: [
      {
        task: 'Find out how long a file or game will take to download',
        description: 'Pick your internet speed and file size to see the download time in minutes and hours.',
        targetToolTitle: 'Download Time Estimator',
        targetUrl: '/technology#workbench-download',
        badge: 'Networking'
      },
      {
        task: 'See why drive sizes look smaller in Windows (GB vs GiB)',
        description: 'Understand the simple math behind decimal sales packaging versus binary computer memory.',
        targetToolTitle: 'Binary Storage Converter',
        targetUrl: '/technology#workbench-storage',
        badge: 'Storage'
      },
      {
        task: 'Test how long it would take a hacker to guess your password',
        description: 'Check your password length and character mix to see instant brute-force cracking estimates.',
        targetToolTitle: 'Password Strength & Entropy Checker',
        targetUrl: '/technology#workbench-password',
        badge: 'Cybersecurity'
      },
      {
        task: 'Calculate web layout units between pixels and rems',
        description: 'Convert CSS rem units to exact pixel values for responsive website design.',
        targetToolTitle: 'REM to PX Converter',
        targetUrl: '/technology#directory',
        badge: 'Web Development'
      },
      {
        task: 'Estimate computer electricity consumption and running costs',
        description: 'Calculate monthly electricity bills for desktop PCs, homelabs, and servers.',
        targetToolTitle: 'Server Power & Electricity Cost Sizer',
        targetUrl: '/technology#directory',
        badge: 'Hardware'
      }
    ],
    subcategories: [
      {
        id: 'networking',
        name: 'Networking & Internet',
        path: '/technology#networking',
        description: 'Download times, internet speeds (Mbps vs MB/s), home Wi-Fi bandwidth, and IP addresses explained simply.',
        representativeToolSlugs: ['download-time-calculator', 'ipv4-subnet-calculator']
      },
      {
        id: 'storage',
        name: 'Storage & Memory',
        path: '/technology#storage',
        description: 'Hard drives, SSDs, flash drives, GB vs GiB sizing, RAID backup protection, and photo/video capacity.',
        representativeToolSlugs: ['binary-storage-converter', 'raid-calculator']
      },
      {
        id: 'hardware',
        name: 'Hardware & Systems',
        path: '/technology#hardware',
        description: 'Computer power consumption, screen pixel density (PPI), CPU utilization, and UPS battery backup runtime.',
        representativeToolSlugs: ['server-power-cost-calculator', 'screen-ppi-calculator']
      },
      {
        id: 'web-dev',
        name: 'Web Development & Design',
        path: '/technology#web-dev',
        description: 'Screen aspect ratios (16:9), CSS REM to PX scaling, image compression sizes, and website loading speed.',
        representativeToolSlugs: ['rem-to-px-calculator', 'aspect-ratio-calculator']
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity & Privacy',
        path: '/technology#cybersecurity',
        description: 'Password cracking time, password entropy bits, data encryption safety, and secure hash verification.',
        representativeToolSlugs: ['password-strength-checker', 'encryption-key-space']
      }
    ],
    guides: [
      {
        title: 'How Download Time Works: The Simple 8-to-1 Rule',
        formula: 'Download Time (seconds) = (File Size in Megabytes × 8) ÷ Internet Speed in Megabits per second',
        formulaDescription: 'Internet providers sell speeds in "bits" (lowercase b, like Mbps), but files on your computer are measured in "bytes" (capital B, like MB). There are 8 bits in every byte.',
        howItWorks: [
          'Multiply your file size in Megabytes (MB) by 8 to get the size in Megabits (Mb).',
          'Add a small buffer (about 5% to 10%) for internet protocol packaging (headers and checks).',
          'Divide by your plan download speed in Mbps to get the time in seconds.'
        ],
        example: {
          scenario: 'Downloading a 60 Gigabyte (GB) modern game on a 200 Mbps home internet connection',
          inputs: { 'Game Size': '60 GB (60,000 MB)', 'Internet Speed': '200 Mbps', 'Overhead': '5%' },
          calculation: '60,000 MB × 8 = 480,000 Megabits. Adding 5% overhead = 504,000 Megabits. Time = 504,000 ÷ 200 = 2,520 seconds.',
          result: '2,520 seconds = 42 minutes total download time.'
        },
        commonMistakes: [
          'Dividing 60,000 MB by 200 Mbps directly (yielding 300 seconds or 5 minutes), which forgets the 8 bits in every byte and gives a time that is 8 times too fast!',
          'Assuming Wi-Fi gets 100% of your advertised cable speed when sitting far from your router.'
        ],
        practicalTips: [
          'Quick rule of thumb: Divide your Mbps download speed by 10 to get your real-world download speed in Megabytes per second (e.g., a 100 Mbps plan downloads about 10 MB per second).'
        ]
      },
      {
        title: 'Why Your New 1 TB Drive Only Shows 931 GB in Windows',
        formula: 'Windows Reported Size (GiB) = Drive Label Size (Bytes) ÷ 1,073,741,824',
        formulaDescription: 'Storage manufacturers count in tens (decimal: 1,000 bytes = 1 KB), while Windows counts in computer binary powers of two (1,024 bytes = 1 KiB).',
        howItWorks: [
          'The store package says 1 TB = 1,000,000,000,000 bytes (1 trillion bytes).',
          'Windows measures a "Gibibyte" (GiB) as 1,024 × 1,024 × 1,024 = 1,073,741,824 bytes.',
          'When Windows divides 1,000,000,000,000 by 1,073,741,824, you get 931.32 GiB. No space was lost or stolen!'
        ],
        example: {
          scenario: 'Plugging a brand-new 2 TB external SSD into a Windows computer',
          inputs: { 'Manufacturer Capacity': '2,000,000,000,000 Bytes (2 TB)' },
          calculation: '2,000,000,000,000 ÷ (1,024³) = 2,000,000,000,000 ÷ 1,073,741,824 = 1,862.64 GiB.',
          result: 'Windows displays 1.86 TB (1,862 GiB). You have all 2 trillion bytes you paid for!'
        },
        commonMistakes: [
          'Believing the hard drive is defective or that the manufacturer formatted away 70 GB of empty storage space.'
        ],
        practicalTips: [
          'Apple macOS changed in 2009 to display decimal units, so that same 1 TB drive will show as a full 1,000 GB on a Mac, but 931 GB on Windows.'
        ]
      },
      {
        title: 'Password Strength: Why Length Beats Complexity Every Time',
        formula: 'Total Combinations = (Available Characters)^(Password Length)',
        formulaDescription: 'Every letter or symbol you add multiplies the total number of guesses a hacker computer has to try.',
        howItWorks: [
          'If you use only lowercase letters (26 characters), an 8-letter password has 26⁸ = 208 billion combinations (cracked in under 1 second by a modern GPU).',
          'If you make a 16-character passphrase using lowercase letters and spaces (27 characters), combinations jump to 27¹⁶ = 3.4 × 10²² combinations (taking millions of years to crack).',
          'Adding just 4 characters makes a password exponentially harder to crack than adding an exclamation mark.'
        ],
        example: {
          scenario: 'Comparing an 8-character complex password vs a 16-character four-word passphrase',
          inputs: { 'Option A': 'P@$$w0rd (8 chars, 94 charset)', 'Option B': 'correct horse battery staple (28 chars, 27 charset)' },
          calculation: 'Option A: 94⁸ = 6.09 × 10¹⁵ combinations (~3 hours with a hacker GPU rig). Option B: 27²⁸ = 4.19 × 10⁴⁰ combinations (trillions of years).',
          result: 'Option B is vastly safer and much easier to remember!'
        },
        commonMistakes: [
          'Making short 8-character passwords with complicated symbols that you forget, instead of long easy-to-remember multi-word phrases.'
        ],
        practicalTips: [
          'Aim for at least 14 to 16 characters. A memorable 4-word phrase like "blue-ocean-sunset-guitar" is virtually uncrackable.'
        ]
      }
    ],
    relatedCategorySlugs: ['conversions', 'math', 'science', 'business'],
    faqs: [
      {
        question: 'What is the simple difference between Mbps and MB/s?',
        answer: 'Mbps (Megabits per second with a small "b") measures how fast your internet connection is. MB/s (Megabytes per second with a capital "B") measures file download speed and hard drive speed. Because 1 Byte contains 8 bits, an 80 Mbps internet speed downloads files at about 10 MB/s.'
      },
      {
        question: 'Why does my download take longer than what internet speed tests say?',
        answer: 'Speed tests connect to a dedicated local test server under ideal conditions. Real-world downloads can be slower because: 1) The website sending the file might limit download speeds, 2) Other family members or apps might be using the Wi-Fi at the same time, 3) Wi-Fi signals weaken through walls, and 4) Network packaging overhead takes up roughly 5% to 10% of total bandwidth.'
      },
      {
        question: 'Why does a 500 GB hard drive show up as 465 GB on Windows?',
        answer: 'Hard drive manufacturers count 1 Gigabyte as exactly 1,000,000,000 bytes (standard decimal). But Windows measures memory using binary powers of two, where 1 Gibibyte equals 1,073,741,824 bytes. When you divide 500 billion bytes by 1.0737 billion, you get 465.66 GB. You have all the bytes you paid for—it is just two different ways of measuring.'
      },
      {
        question: 'How long should my password be to stay safe from hackers?',
        answer: 'Experts recommend at least 14 to 16 characters. A modern graphics card can test billions of short passwords every single second. But with 16 characters or more, even a room full of supercomputers would need hundreds of thousands of years to guess your combination.'
      },
      {
        question: 'What is a subnet mask and an IP address in simple terms?',
        answer: 'Think of an IP address like a house address. A house address has a street name (the network part) and a house number (the specific device). The subnet mask is the divider line that tells your computer which numbers represent your home network and which number is your individual phone, TV, or laptop.'
      },
      {
        question: 'What is the difference between REM and PX in web design?',
        answer: 'PX stands for pixels, which are fixed dot sizes on a screen. REM is a relative unit based on the user’s default browser font size (typically 16 pixels = 1 rem). Using rems makes websites accessible because if someone with vision impairment changes their default browser text size, the entire website scales cleanly.'
      },
      {
        question: 'How much electricity does a desktop computer or home server use?',
        answer: 'A standard office computer uses about 60 to 100 Watts (around $2 to $4 per month if left on during work hours). A powerful gaming PC running a demanding 3D game uses 300 to 500 Watts. A small home server or NAS usually runs continuously at only 20 to 40 Watts, costing about $3 to $5 per month on average electric rates.'
      },
      {
        question: 'What is RAID and does it replace regular backups?',
        answer: 'RAID connects multiple hard drives together so if one drive breaks, your computer keeps running without losing files. However, RAID is not a backup! RAID cannot protect you from accidental file deletion, viruses, ransomware, or fire. You still need an external backup drive or cloud backup.'
      }
    ],
    trust: {
      formulasUsed: 'IEEE 802.3 Ethernet network standards, NIST Special Publication 800-63B password guidelines, IEC 80000-13 binary storage prefixes, and W3C CSS specifications.',
      sourceReferences: [
        'National Institute of Standards and Technology (NIST) Digital Identity Guidelines SP 800-63B',
        'International Electrotechnical Commission (IEC) 80000-13 Data Units',
        'Institute of Electrical and Electronics Engineers (IEEE) 802.3 Networking Standards',
        'World Wide Web Consortium (W3C) CSS Values and Units Module'
      ],
      assumptions: [
        'Download estimates assume standard TCP/IP protocol packaging overhead (defaulting to 5%).',
        'Password brute-force cracking estimates assume high-end parallel GPU clusters testing up to 100 billion hash guesses per second.',
        'Electricity cost calculations use standard residential kilowatt-hour (kWh) utility pricing.'
      ],
      updateProcess: 'All technical conversion factors, computing specifications, and cybersecurity benchmarks are regularly verified against NIST and IEEE publications.',
      limitations: [
        'Real-world internet download speeds fluctuate based on server load, network congestion, and Wi-Fi signal interference.'
      ]
    }
  }
};

export function getHubConfig(categorySlug: string): CategoryHubConfig | null {
  // Normalize slug
  const normalized = categorySlug.replace(/^\//, '').replace(/\/$/, '');
  const baseConfigs = require('./categoryHubConfigs').CATEGORY_HUB_CONFIGS;
  return baseConfigs[normalized] || ADDITIONAL_HUB_CONFIGS[normalized] || null;
}

