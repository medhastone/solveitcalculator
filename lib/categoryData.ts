// Category-specific rich metadata, benchmarks, domain scenarios, and metrology guides
export interface CategoryBenchmark {
  title: string;
  category: string;
  fromValue: number;
  fromUnitId: string;
  toUnitId: string;
  icon: string;
  summary: string;
  detail: string;
}

export interface CategoryScenario {
  title: string;
  tag: string;
  description: string;
  icon: string;
  tip: string;
}

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface CategoryMetaRecord {
  tagline: string;
  heroPlaceholder: string;
  popularChips: { label: string; from: string; to: string }[];
  benchmarks: CategoryBenchmark[];
  scenarios: CategoryScenario[];
  historyGuide: {
    origin: string;
    standards: string;
    pitfalls: string;
  };
  faqs: CategoryFAQ[];
}

export const CATEGORY_RICH_DATA: Record<string, CategoryMetaRecord> = {
  length: {
    tagline: 'Quickly convert between inches, feet, meters, centimeters, and miles with exact formulas.',
    heroPlaceholder: 'Search length conversions (e.g., cm to inches, meters to feet)...',
    popularChips: [
      { label: 'Centimeters to Inches', from: 'cm', to: 'in' },
      { label: 'Inches to Centimeters', from: 'in', to: 'cm' },
      { label: 'Meters to Feet', from: 'm', to: 'ft' },
      { label: 'Feet to Meters', from: 'ft', to: 'm' },
      { label: 'Miles to Kilometers', from: 'mi', to: 'km' },
      { label: 'Kilometers to Miles', from: 'km', to: 'mi' },
      { label: 'Millimeters to Inches', from: 'mm', to: 'in' },
      { label: 'Yards to Meters', from: 'yd', to: 'm' }
    ],
    benchmarks: [
      {
        title: 'Standard Credit Card Width',
        category: 'Everyday Objects',
        fromValue: 85.6,
        fromUnitId: 'mm',
        toUnitId: 'in',
        icon: 'credit_card',
        summary: '85.6 mm = 3.37 Inches',
        detail: 'The standard width of credit cards, bank cards, and driver licenses in your wallet.'
      },
      {
        title: 'Average Adult Height',
        category: 'People & Health',
        fromValue: 175,
        fromUnitId: 'cm',
        toUnitId: 'ft',
        icon: 'person',
        summary: '175 cm = 5.74 Feet (5 ft 9 in)',
        detail: 'Typical height for an adult man (around 69 inches).'
      },
      {
        title: 'Olympic Swimming Pool Length',
        category: 'Sports & Outdoors',
        fromValue: 50,
        fromUnitId: 'm',
        toUnitId: 'ft',
        icon: 'pool',
        summary: '50 Meters = 164.04 Feet',
        detail: 'Official standard competition length of an Olympic racing pool.'
      },
      {
        title: 'Marathon Race Distance',
        category: 'Sports & Running',
        fromValue: 42.195,
        fromUnitId: 'km',
        toUnitId: 'mi',
        icon: 'directions_run',
        summary: '42.195 km = 26.22 Miles',
        detail: 'The official distance of a full marathon road race.'
      },
      {
        title: 'Mount Everest Peak Elevation',
        category: 'Nature & Mountains',
        fromValue: 8848.86,
        fromUnitId: 'm',
        toUnitId: 'ft',
        icon: 'terrain',
        summary: '8,848.86 m = 29,031.7 Feet',
        detail: 'The highest mountain peak on Earth above sea level.'
      },
      {
        title: 'Nautical Mile Definition',
        category: 'Travel & Navigation',
        fromValue: 1,
        fromUnitId: 'nmi',
        toUnitId: 'km',
        icon: 'sailing',
        summary: '1 Nautical Mile = 1.852 Kilometers',
        detail: 'Used worldwide by ships and airplanes for navigation across oceans.'
      }
    ],
    scenarios: [
      {
        title: 'Home Improvement & Room Sizes',
        tag: 'Everyday Home',
        description: 'Converting wall lengths, furniture measurements, and room sizes between feet, inches, and meters.',
        icon: 'architecture',
        tip: '1 Foot is exactly 0.3048 meters; 1 Inch is legally defined as exactly 25.4 millimeters.'
      },
      {
        title: 'Air Travel & Ocean Navigation',
        tag: 'Travel',
        description: 'Airplane flight altitude is measured in feet, while maritime travel and flight distances use nautical miles.',
        icon: 'flight',
        tip: '1 Nautical Mile (1,852 m) is about 15% longer than a regular road mile (1,609 m).'
      },
      {
        title: 'Clothing & Fabric Patterns',
        tag: 'Shopping',
        description: 'Fabric bolts are sold in yards or meters, while body sizes and inseams use inches or centimeters.',
        icon: 'strikethrough_s',
        tip: '1 Yard is exactly 3 feet, or 36 inches (0.9144 meters).'
      }
    ],
    historyGuide: {
      origin: 'Early length units were based on human body parts—such as a foot, a forearm (cubit), or an armspan (fathom). In 1799, the meter was created in France so that everyone around the world could use the same clear decimal standard.',
      standards: 'In 1959, countries officially agreed that 1 inch equals exactly 25.4 millimeters, giving everyone the exact same numbers worldwide.',
      pitfalls: 'Remember that sea miles (nautical miles: 1,852 m) are longer than regular road miles (statute miles: 1,609 m).'
    },
    faqs: [
      {
        question: 'Why is an inch defined as exactly 25.4 millimeters?',
        answer: 'In 1959, the United States, Britain, and other countries signed the International Yard and Pound Agreement. They set 1 yard to exactly 0.9144 meters, which makes 1 inch exactly 25.4 millimeters.'
      },
      {
        question: 'How can I quickly convert centimeters to inches in my head?',
        answer: 'Divide the centimeter number by 2.5 (or divide by 10 and multiply by 4). For example: 50 cm ÷ 2.5 = 20 inches (exact answer is 19.69 inches).'
      },
      {
        question: 'What is the difference between a kilometer and a mile?',
        answer: '1 Kilometer is 1,000 meters (about 0.62 miles). 1 Mile is 5,280 feet (about 1.61 kilometers). A quick rule of thumb: 5 km is about 3.1 miles, and 10 km is about 6.2 miles.'
      }
    ]
  },

  weight: {
    tagline: 'Easily switch between pounds, kilograms, ounces, grams, and stones for health, gym weights, shipping, or luggage.',
    heroPlaceholder: 'Search weight & mass conversions (e.g., kg to lbs, grams to ounces)...',
    popularChips: [
      { label: 'Kilograms to Pounds', from: 'kg', to: 'lb' },
      { label: 'Pounds to Kilograms', from: 'lb', to: 'kg' },
      { label: 'Grams to Ounces', from: 'g', to: 'oz' },
      { label: 'Grams to Pounds', from: 'g', to: 'lb' },
      { label: 'Grams to Kilograms', from: 'g', to: 'kg' },
      { label: 'Grams to Milligrams', from: 'g', to: 'mg' },
      { label: 'Ounces to Grams', from: 'oz', to: 'g' },
      { label: 'Milligrams to Grams', from: 'mg', to: 'g' }
    ],
    benchmarks: [
      {
        title: 'Standard US Paperclip',
        category: 'Office & Desk',
        fromValue: 1,
        fromUnitId: 'g',
        toUnitId: 'oz',
        icon: 'attach_file',
        summary: '1 Gram = 0.035 Ounces',
        detail: 'A standard small paperclip weighs almost exactly 1 gram.'
      },
      {
        title: 'Smartphone in Hand',
        category: 'Everyday Tech',
        fromValue: 200,
        fromUnitId: 'g',
        toUnitId: 'oz',
        icon: 'smartphone',
        summary: '200 Grams = 7.05 Ounces',
        detail: 'Average weight of a modern smartphone (about 0.44 pounds).'
      },
      {
        title: 'Bag of Flour or Sugar',
        category: 'Kitchen & Baking',
        fromValue: 5,
        fromUnitId: 'lb',
        toUnitId: 'kg',
        icon: 'shopping_bag',
        summary: '5 Pounds = 2.27 Kilograms',
        detail: 'Standard pantry bag of flour or sugar in grocery stores.'
      },
      {
        title: 'Average Adult Weight',
        category: 'Health & Fitness',
        fromValue: 70,
        fromUnitId: 'kg',
        toUnitId: 'lb',
        icon: 'fitness_center',
        summary: '70 Kilograms = 154.32 Pounds',
        detail: 'Common benchmark average human adult body weight (11 stone).'
      },
      {
        title: 'Compact Passenger Car',
        category: 'Automotive',
        fromValue: 1500,
        fromUnitId: 'kg',
        toUnitId: 'lb',
        icon: 'directions_car',
        summary: '1,500 kg = 3,307 Pounds',
        detail: 'Typical curb weight of a compact hatchback or crossover vehicle (about 1.65 US tons).'
      },
      {
        title: 'Adult Blue Whale',
        category: 'Nature & Wildlife',
        fromValue: 150,
        fromUnitId: 't',
        toUnitId: 'us_ton',
        icon: 'waves',
        summary: '150 Metric Tons = 165.35 US Tons',
        detail: 'The largest animal on Earth, weighing up to 330,000 pounds.'
      }
    ],
    scenarios: [
      {
        title: 'Health & Medication Dosing',
        tag: 'Health',
        description: 'Doctor prescriptions and vitamin doses are calculated per kilogram of body weight (mg/kg).',
        icon: 'medication',
        tip: 'Divide weight in pounds by 2.2 to find your approximate weight in kilograms.'
      },
      {
        title: 'Airline Luggage & Shipping',
        tag: 'Travel',
        description: 'Airline baggage allowances are usually 50 lbs (23 kg) or 70 lbs (32 kg).',
        icon: 'local_shipping',
        tip: 'A standard checked bag limit of 23 kg is equal to 50.7 pounds.'
      },
      {
        title: 'Gym Weights & Barbell Plates',
        tag: 'Fitness',
        description: 'Gym weight plates use kilograms (20 kg, 25 kg) or pounds (45 lbs), depending on your gym.',
        icon: 'sports',
        tip: 'A standard 20 kg barbell plate is very close to 44 pounds (44.09 lbs).'
      }
    ],
    historyGuide: {
      origin: 'Ancient merchants weighed goods against seeds (such as carob seeds for carats) and water. In 1795, the kilogram was created in France as the weight of 1 liter of pure water.',
      standards: 'Today, all international trade uses official standard definitions agreed upon worldwide so 1 kilogram always equals exactly 2.20462 pounds.',
      pitfalls: 'Note the difference between a US Short Ton (2,000 lbs) and a Metric Ton (2,204.62 lbs or 1,000 kg).'
    },
    faqs: [
      {
        question: 'How do you convert kilograms to pounds in your head?',
        answer: 'Double the kg number, then add 10% of that result. For example: 80 kg × 2 = 160; 10% of 160 is 16; 160 + 16 = 176 lbs (exact: 176.37 lbs).'
      },
      {
        question: 'What is the difference between a US ton and a metric ton?',
        answer: 'A US Short Ton is 2,000 lbs (907.2 kg). A Metric Ton (also spelled tonne) is 1,000 kg (2,204.6 lbs). A metric ton is about 10% heavier than a US ton.'
      },
      {
        question: 'How many pounds are in a stone?',
        answer: 'There are exactly 14 pounds in 1 stone (about 6.35 kg). Stones are commonly used in the UK and Ireland for personal body weight.'
      }
    ]
  },

  temperature: {
    tagline: 'Convert temperatures instantly between Celsius, Fahrenheit, and Kelvin for weather, recipes, baking, or science.',
    heroPlaceholder: 'Search temperature conversions (e.g., Celsius to Fahrenheit, Kelvin)...',
    popularChips: [
      { label: 'Celsius to Fahrenheit', from: 'c', to: 'f' },
      { label: 'Fahrenheit to Celsius', from: 'f', to: 'c' },
      { label: 'Celsius to Kelvin', from: 'c', to: 'k' },
      { label: 'Kelvin to Celsius', from: 'k', to: 'c' },
      { label: 'Fahrenheit to Kelvin', from: 'f', to: 'k' },
      { label: 'Rankine to Fahrenheit', from: 'r', to: 'f' }
    ],
    benchmarks: [
      {
        title: 'Absolute Zero',
        category: 'Science',
        fromValue: -273.15,
        fromUnitId: 'c',
        toUnitId: 'f',
        icon: 'ac_unit',
        summary: '-273.15 °C = -459.67 °F (0 K)',
        detail: 'The coldest possible temperature in the universe, where all thermal heat stops.'
      },
      {
        title: 'Water Freezing Point',
        category: 'Everyday Weather',
        fromValue: 0,
        fromUnitId: 'c',
        toUnitId: 'f',
        icon: 'severe_cold',
        summary: '0 °C = 32.00 °F (273.15 K)',
        detail: 'The temperature where liquid water freezes into solid ice under normal conditions.'
      },
      {
        title: 'Comfortable Room Temperature',
        category: 'Home & Office',
        fromValue: 21,
        fromUnitId: 'c',
        toUnitId: 'f',
        icon: 'thermostat',
        summary: '21 °C = 69.80 °F',
        detail: 'A comfortable, normal indoor temperature for homes, schools, and offices.'
      },
      {
        title: 'Normal Human Body Temperature',
        category: 'Health & Fever',
        fromValue: 37,
        fromUnitId: 'c',
        toUnitId: 'f',
        icon: 'favorite',
        summary: '37.0 °C = 98.60 °F',
        detail: 'Normal healthy human body temperature.'
      },
      {
        title: 'Water Boiling Point',
        category: 'Kitchen & Cooking',
        fromValue: 100,
        fromUnitId: 'c',
        toUnitId: 'f',
        icon: 'local_fire_department',
        summary: '100.0 °C = 212.00 °F',
        detail: 'The temperature where water boils into steam in your kitchen kettle.'
      },
      {
        title: 'Surface of the Sun',
        category: 'Nature & Space',
        fromValue: 5500,
        fromUnitId: 'c',
        toUnitId: 'f',
        icon: 'wb_sunny',
        summary: '5,500 °C = 9,932 °F',
        detail: 'The scorching temperature on the visible outer surface of the Sun.'
      }
    ],
    scenarios: [
      {
        title: 'Baking & Kitchen Oven Settings',
        tag: 'Cooking',
        description: 'International recipes often give oven temperatures in Celsius (like 180°C or 200°C), while American ovens use Fahrenheit.',
        icon: 'bakery_dining',
        tip: '350°F is about 175°C to 180°C; 400°F is about 200°C.'
      },
      {
        title: 'Weather Forecasts & International Travel',
        tag: 'Travel',
        description: 'Most countries report daily weather in Celsius, while the US uses Fahrenheit.',
        icon: 'cloud',
        tip: 'A quick rule: 20°C is 68°F (pleasant), 30°C is 86°F (hot), and 0°C is 32°F (freezing).'
      },
      {
        title: 'Science Labs & Cold Storage',
        tag: 'Science',
        description: 'Scientific experiments and ultra-cold medical freezers use Kelvin or negative Celsius.',
        icon: 'science',
        tip: '-40° is the unique magic point where -40°C is exactly equal to -40°F.'
      }
    ],
    historyGuide: {
      origin: 'Daniel Gabriel Fahrenheit built the first modern mercury thermometer in 1714. In 1742, Swedish astronomer Anders Celsius created the 100-degree scale between freezing (0°) and boiling (100°).',
      standards: 'Kelvin is used by scientists because 0 K represents true absolute zero, with no negative numbers needed.',
      pitfalls: 'Unlike feet or pounds, temperature has different starting zero points: 0°C is 32°F. That is why you must add or subtract 32 in the formula.'
    },
    faqs: [
      {
        question: 'What is the formula to convert Celsius to Fahrenheit?',
        answer: 'Multiply Celsius by 1.8 (or 9/5), then add 32: °F = (°C × 1.8) + 32. For example, 20°C × 1.8 = 36; 36 + 32 = 68°F.'
      },
      {
        question: 'At what temperature are Celsius and Fahrenheit equal?',
        answer: 'Celsius and Fahrenheit meet at -40°: -40°C is exactly -40°F.'
      },
      {
        question: 'Why does Kelvin not have a degree symbol (°)?',
        answer: 'Kelvin is an absolute scale starting at absolute zero, not an arbitrary interval scale. We write 300 K, without the degree sign.'
      }
    ]
  },

  area: {
    tagline: 'Calculate property, construction, and architectural land coverage with exact hectare and acre ratios.',
    heroPlaceholder: 'Search area conversions (e.g., sq ft to sq meters, acres to hectares)...',
    popularChips: [
      { label: 'Square Feet to Square Meters', from: 'sqft', to: 'm2' },
      { label: 'Square Meters to Square Feet', from: 'm2', to: 'sqft' },
      { label: 'Acres to Hectares', from: 'acre', to: 'ha' },
      { label: 'Hectares to Acres', from: 'ha', to: 'acre' },
      { label: 'Square Inches to Square Centimeters', from: 'sqin', to: 'sqcm' },
      { label: 'Square Miles to Square Kilometers', from: 'sqmi', to: 'sqkm' }
    ],
    benchmarks: [
      {
        title: 'Single Sheet of A4 Paper',
        category: 'Office & Stationery',
        fromValue: 623.7,
        fromUnitId: 'sqcm',
        toUnitId: 'sqin',
        icon: 'description',
        summary: '623.7 cm² = 96.67 sq in',
        detail: 'Exact standard dimensions of 210 mm × 297 mm, derived from 1/16 of a square meter.'
      },
      {
        title: 'One-Bedroom Apartment Floor Plan',
        category: 'Real Estate',
        fromValue: 650,
        fromUnitId: 'sqft',
        toUnitId: 'm2',
        icon: 'apartment',
        summary: '650 sq ft = 60.39 m²',
        detail: 'Standard urban residential layout including living room, kitchen, and bathroom.'
      },
      {
        title: 'Professional Tennis Court',
        category: 'Sports',
        fromValue: 260.76,
        fromUnitId: 'm2',
        toUnitId: 'sqft',
        icon: 'sports_tennis',
        summary: '260.76 m² = 2,806.8 sq ft',
        detail: 'Standard singles and doubles regulation playing surface dimensions (78 ft × 36 ft).'
      },
      {
        title: 'Standard NFL Football Field',
        category: 'Athletics',
        fromValue: 1.32,
        fromUnitId: 'acre',
        toUnitId: 'm2',
        icon: 'stadium',
        summary: '1.32 Acres = 5,351 m²',
        detail: 'Complete field surface including end zones (360 ft × 160 ft).'
      },
      {
        title: 'Central Park, New York City',
        category: 'Urban Geography',
        fromValue: 843,
        fromUnitId: 'acre',
        toUnitId: 'ha',
        icon: 'park',
        summary: '843 Acres = 341.15 Hectares',
        detail: 'Iconic Manhattan park spanning 3.41 square kilometers or 1.31 square miles.'
      }
    ],
    scenarios: [
      {
        title: 'Real Estate Valuation & Leasing',
        tag: 'Property',
        description: 'Commercial and residential leases in North America price by dollar per square foot ($/sq ft), whereas European and Asian markets quote monthly rent per square meter (€/m²).',
        icon: 'domain',
        tip: '1 Square Meter is approximately 10.764 Square Feet.'
      },
      {
        title: 'Agricultural Land Surveying',
        tag: 'Farming',
        description: 'Crop yields, pesticide spraying rates, and farmland sales in the US and UK use acres, while the rest of the world standardizes on metric hectares.',
        icon: 'agriculture',
        tip: '1 Hectare (10,000 m²) equals exactly 2.47105 Acres.'
      }
    ],
    historyGuide: {
      origin: 'Historically, an acre was defined as the amount of land that one yoke of oxen could plow in one single day (a chain of 66 feet by a furlong of 660 feet = 43,560 sq ft).',
      standards: 'The SI unit of area is the square meter (m²). 1 Hectare is defined as a square of 100 meters on each side (10,000 m²).',
      pitfalls: 'Remember that when converting linear units to area units, the factor is squared: 1 meter = 3.28084 feet, but 1 square meter = (3.28084)² = 10.7639 square feet.'
    },
    faqs: [
      {
        question: 'How many square feet are in a square meter?',
        answer: 'There are exactly 10.7639104 square feet in 1 square meter. To convert m² to sq ft in your head, multiply by 10 and add roughly 7.5%.'
      },
      {
        question: 'How many square feet are in an acre?',
        answer: 'There are exactly 43,560 square feet in 1 acre. An acre is roughly 208.71 feet by 208.71 feet if shaped as a square.'
      }
    ]
  },

  speed: {
    tagline: 'Automotive, aerospace, and marine velocity conversions from knots to Mach numbers.',
    heroPlaceholder: 'Search speed conversions (e.g., mph to km/h, knots to mph, Mach)...',
    popularChips: [
      { label: 'MPH to km/h', from: 'mph', to: 'kmh' },
      { label: 'km/h to MPH', from: 'kmh', to: 'mph' },
      { label: 'Meters/sec to km/h', from: 'mps', to: 'kmh' },
      { label: 'Knots to MPH', from: 'knot', to: 'mph' },
      { label: 'Feet/sec to MPH', from: 'fps', to: 'mph' },
      { label: 'Mach to km/h', from: 'mach', to: 'kmh' }
    ],
    benchmarks: [
      {
        title: 'Brisk Human Walking Pace',
        category: 'Daily Living',
        fromValue: 5,
        fromUnitId: 'kmh',
        toUnitId: 'mph',
        icon: 'directions_walk',
        summary: '5.0 km/h = 3.11 MPH (1.39 m/s)',
        detail: 'Standard pedestrian velocity used in urban crosswalk timing and fitness tracking.'
      },
      {
        title: 'Interstate Highway Speed Limit',
        category: 'Automotive',
        fromValue: 70,
        fromUnitId: 'mph',
        toUnitId: 'kmh',
        icon: 'speed',
        summary: '70 MPH = 112.65 km/h',
        detail: 'Common vehicular speed limit across US expressways and rural highways.'
      },
      {
        title: 'Commercial Airliner Cruising Speed',
        category: 'Aviation',
        fromValue: 480,
        fromUnitId: 'knot',
        toUnitId: 'kmh',
        icon: 'flight',
        summary: '480 Knots = 888.96 km/h (552.37 MPH)',
        detail: 'Typical transcontinental cruise speed for Boeing 737 and Airbus A320 airliners.'
      },
      {
        title: 'Speed of Sound in Air (Mach 1)',
        category: 'Acoustics & Aerospace',
        fromValue: 1,
        fromUnitId: 'mach',
        toUnitId: 'kmh',
        icon: 'hearing',
        summary: 'Mach 1 = 1,234.8 km/h (767.27 MPH)',
        detail: 'Sonic velocity in dry air at 20°C (68°F) at sea level atmospheric pressure.'
      }
    ],
    scenarios: [
      {
        title: 'Highway Driving & Speedometers',
        tag: 'Automotive',
        description: 'Vehicular navigation between the United States (MPH) and Canada/Mexico/Europe (km/h) requires rapid mental adjustment.',
        icon: 'car_rental',
        tip: 'To convert km/h to mph in your head, multiply by 0.62 (e.g. 100 km/h ≈ 62 mph).'
      },
      {
        title: 'Maritime Navigation & Ocean Currents',
        tag: 'Marine',
        description: 'Vessel speeds across all commercial shipping and navies are logged in knots (nautical miles per hour).',
        icon: 'anchor',
        tip: '1 Knot = 1.15078 mph = 1.852 km/h.'
      }
    ],
    historyGuide: {
      origin: 'The knot originated in the 16th century, where sailors threw a wooden log attached to a knotted rope behind the ship and counted how many knots passed in 30 seconds as timed by an hourglass.',
      standards: 'In the SI system, the coherent unit of speed is meters per second (m/s). 1 km/h is exactly (1/3.6) m/s.',
      pitfalls: 'Do not confuse speed (scalar magnitude) with velocity (vector containing magnitude and direction).'
    },
    faqs: [
      {
        question: 'How do you quickly convert km/h to mph?',
        answer: 'Multiply km/h by 0.62. Or multiply by 6 and divide by 10. For example: 80 km/h × 0.62 = 49.6 mph (exact: 49.71 mph).'
      },
      {
        question: 'What is a knot in nautical terms?',
        answer: 'A knot is one nautical mile per hour (1.852 km/h or approximately 1.151 mph).'
      }
    ]
  },

  pressure: {
    tagline: 'Industrial tire, hydraulic, HVAC, and meteorological atmospheric pressures.',
    heroPlaceholder: 'Search pressure conversions (e.g., PSI to Bar, kPa to PSI, atm)...',
    popularChips: [
      { label: 'PSI to Bar', from: 'psi', to: 'bar' },
      { label: 'Bar to PSI', from: 'bar', to: 'psi' },
      { label: 'kPa to PSI', from: 'kpa', to: 'psi' },
      { label: 'PSI to kPa', from: 'psi', to: 'kpa' },
      { label: 'Atmospheres to Bar', from: 'atm', to: 'bar' },
      { label: 'Bar to Megapascals', from: 'bar', to: 'mpa' }
    ],
    benchmarks: [
      {
        title: 'Passenger Car Tire Inflation',
        category: 'Automotive',
        fromValue: 32,
        fromUnitId: 'psi',
        toUnitId: 'bar',
        icon: 'tire_repair',
        summary: '32 PSI = 2.206 Bar (220.6 kPa)',
        detail: 'Standard recommended cold inflation pressure for passenger sedans.'
      },
      {
        title: 'Standard Sea-Level Atmosphere',
        category: 'Meteorology',
        fromValue: 1,
        fromUnitId: 'atm',
        toUnitId: 'psi',
        icon: 'cloud',
        summary: '1 atm = 14.696 PSI (1.01325 Bar)',
        detail: 'The ambient atmospheric pressure exerted by Earth’s air column at mean sea level.'
      },
      {
        title: 'Espresso Machine Brewing Pressure',
        category: 'Culinary Engineering',
        fromValue: 9,
        fromUnitId: 'bar',
        toUnitId: 'psi',
        icon: 'coffee',
        summary: '9 Bar = 130.53 PSI',
        detail: 'The optimal water pressure for extracting authentic Italian espresso crema.'
      },
      {
        title: 'Scuba Diving Air Cylinder',
        category: 'Diving & Marine',
        fromValue: 3000,
        fromUnitId: 'psi',
        toUnitId: 'bar',
        icon: 'scuba_diving',
        summary: '3,000 PSI = 206.84 Bar',
        detail: 'Full working pressure for a standard 80 cu ft aluminum scuba tank.'
      }
    ],
    scenarios: [
      {
        title: 'Automotive Tire Care & Diagnostics',
        tag: 'Maintenance',
        description: 'US vehicles display tire pressures in PSI (Pounds per Square Inch), while European and Asian vehicles use Bar or kPa.',
        icon: 'directions_car',
        tip: '1 Bar equals exactly 100 kPa or approximately 14.5038 PSI.'
      },
      {
        title: 'Hydraulic Machinery & Heavy Equipment',
        tag: 'Engineering',
        description: 'Hydraulic pumps, excavators, and presses operate at pressures exceeding 200 to 350 Bar (3,000 to 5,000 PSI).',
        icon: 'precision_manufacturing',
        tip: '1 Megapascal (MPa) equals exactly 10 Bar.'
      }
    ],
    historyGuide: {
      origin: 'Evangelista Torricelli invented the mercury barometer in 1643, leading to the millimeter of mercury (mmHg or Torr) unit. Blaise Pascal later demonstrated atmospheric pressure variations with altitude.',
      standards: 'The SI unit is the Pascal (Pa), defined as 1 Newton of force per square meter (N/m²). Standard atmospheric pressure is defined as exactly 101,325 Pa.',
      pitfalls: 'Gauge Pressure (psig) measures pressure relative to ambient atmosphere, whereas Absolute Pressure (psia) includes atmospheric baseline (psig + 14.7 = psia).'
    },
    faqs: [
      {
        question: 'How do I convert PSI to Bar?',
        answer: 'Divide PSI by 14.5038 (or multiply by 0.068947). For example: 32 PSI / 14.5038 ≈ 2.21 Bar.'
      },
      {
        question: 'What is 1 atmosphere in Bar and PSI?',
        answer: '1 standard atmosphere (atm) = 1.01325 Bar = 101.325 kPa = 14.6959 PSI.'
      }
    ]
  },

  time: {
    tagline: 'Astronomical, standard, and microsecond intervals for schedules, science, and computing.',
    heroPlaceholder: 'Search time conversions (e.g., hours to minutes, days to seconds)...',
    popularChips: [
      { label: 'Hours to Minutes', from: 'hr', to: 'min' },
      { label: 'Minutes to Seconds', from: 'min', to: 's' },
      { label: 'Days to Hours', from: 'day', to: 'hr' },
      { label: 'Milliseconds to Seconds', from: 'ms', to: 's' },
      { label: 'Weeks to Days', from: 'week', to: 'day' },
      { label: 'Years to Days', from: 'year', to: 'day' }
    ],
    benchmarks: [
      {
        title: 'Single Human Heartbeat',
        category: 'Physiology',
        fromValue: 857,
        fromUnitId: 'ms',
        toUnitId: 's',
        icon: 'favorite',
        summary: '857 ms = 0.857 Seconds',
        detail: 'Average resting cardiac cycle duration at 70 beats per minute.'
      },
      {
        title: 'Full Day & Night Cycle',
        category: 'Planetary Astronomy',
        fromValue: 24,
        fromUnitId: 'hr',
        toUnitId: 's',
        icon: 'sunny',
        summary: '24 Hours = 86,400 Seconds',
        detail: 'Mean solar day representing one complete rotation of the Earth relative to the Sun.'
      },
      {
        title: 'Lunar Orbital Period',
        category: 'Astronomy',
        fromValue: 27.32,
        fromUnitId: 'day',
        toUnitId: 'hr',
        icon: 'bedtime',
        summary: '27.32 Days = 655.68 Hours',
        detail: 'Sidereal orbital period of the Moon revolving around Earth.'
      },
      {
        title: 'Solar Tropical Year',
        category: 'Astronomy',
        fromValue: 365.2422,
        fromUnitId: 'day',
        toUnitId: 'hr',
        icon: 'public',
        summary: '365.24 Days = 8,765.8 Hours',
        detail: 'The time taken for Earth to complete one full seasonal orbit around the Sun.'
      }
    ],
    scenarios: [
      {
        title: 'Computer Science & Software Latency',
        tag: 'Computing',
        description: 'Processor cycles execute in nanoseconds (ns), network pings in milliseconds (ms), and cron jobs in minutes.',
        icon: 'terminal',
        tip: '1 millisecond (ms) = 1,000 microseconds (µs) = 1,000,000 nanoseconds (ns).'
      },
      {
        title: 'Payroll, Billing & Project Management',
        tag: 'Business',
        description: 'Converting decimal hours (e.g. 7.75 hours) to billable hours and minutes (7 hours 45 minutes).',
        icon: 'payments',
        tip: 'Multiply the decimal portion by 60 to obtain exact minutes (0.75 × 60 = 45 min).'
      }
    ],
    historyGuide: {
      origin: 'Ancient Babylonians divided the day sexagesimally (base 60), giving us 60 minutes in an hour and 60 seconds in a minute.',
      standards: 'The SI Second is defined by fixing the unperturbed ground-state hyperfine transition frequency of the Caesium-133 atom at 9,192,631,770 Hz.',
      pitfalls: 'Calendar months vary from 28 to 31 days; for scientific conversion, an average month is 30.4375 days.'
    },
    faqs: [
      {
        question: 'How many seconds are in one full day?',
        answer: 'There are exactly 86,400 seconds in a 24-hour day (24 × 60 × 60).'
      },
      {
        question: 'How do you convert decimal hours into minutes?',
        answer: 'Take the fractional portion and multiply by 60. For example, 4.35 hours = 4 hours and (0.35 × 60) = 21 minutes.'
      }
    ]
  },

  energy: {
    tagline: 'Mechanical work, electrical power consumption, heat calories, and thermal units.',
    heroPlaceholder: 'Search energy conversions (e.g., kWh to Joules, Calories to Joules, BTU)...',
    popularChips: [
      { label: 'Kilowatt-hours to Joules', from: 'kwh', to: 'j' },
      { label: 'Joules to Calories', from: 'j', to: 'cal' },
      { label: 'Kilocalories to Kilojoules', from: 'kcal', to: 'kj' },
      { label: 'BTU to Joules', from: 'btu', to: 'j' },
      { label: 'Watt-hours to Joules', from: 'wh', to: 'j' },
      { label: 'Foot-pounds to Joules', from: 'ftlb', to: 'j' }
    ],
    benchmarks: [
      {
        title: 'Lifting an Apple One Meter',
        category: 'Physics 101',
        fromValue: 1,
        fromUnitId: 'j',
        toUnitId: 'cal',
        icon: 'apple',
        summary: '1 Joule = 0.239 Calories',
        detail: 'The mechanical work required to lift a 100-gram apple vertically against Earth gravity by 1 meter.'
      },
      {
        title: 'Dietary Food Calorie (kcal)',
        category: 'Nutrition',
        fromValue: 1,
        fromUnitId: 'kcal',
        toUnitId: 'kj',
        icon: 'nutrition',
        summary: '1 Food Calorie = 4.184 Kilojoules',
        detail: 'One dietary Calorie (large Cal) is actually 1 kilocalorie (1,000 small gram calories).'
      },
      {
        title: 'Home Electricity Daily Use',
        category: 'Clean Energy',
        fromValue: 30,
        fromUnitId: 'kwh',
        toUnitId: 'mj',
        icon: 'bolt',
        summary: '30 kWh = 108 Megajoules',
        detail: 'Average daily residential electrical consumption for a typical single-family household.'
      },
      {
        title: 'Gallon of Gasoline Energy Content',
        category: 'Petroleum Fuels',
        fromValue: 114000,
        fromUnitId: 'btu',
        toUnitId: 'kwh',
        icon: 'local_gas_station',
        summary: '114,000 BTU = 33.4 kWh',
        detail: 'Thermal combustion energy contained in one US gallon of regular unleaded gasoline.'
      }
    ],
    scenarios: [
      {
        title: 'Electric Vehicle (EV) Battery Capacity',
        tag: 'Automotive',
        description: 'EV battery packs are rated in kilowatt-hours (kWh), representing usable stored electrical energy.',
        icon: 'electric_car',
        tip: '1 kWh = 3,600,000 Joules (3.6 MJ).'
      },
      {
        title: 'Dietary Nutrition & Metabolic Burn',
        tag: 'Health',
        description: 'Nutrition labels in the United States report Calories (kcal), while European and Australian labels report Kilojoules (kJ).',
        icon: 'fitness_center',
        tip: 'Multiply kcal by 4.184 to get kJ.'
      }
    ],
    historyGuide: {
      origin: 'Named after James Prescott Joule, who proved the mechanical equivalence of heat in the 1840s.',
      standards: 'The SI unit is the Joule (J = 1 kg·m²·s⁻² = 1 N·m = 1 W·s).',
      pitfalls: 'Be careful to distinguish between a small calorie (cal = 4.184 J) and a food Calorie (kcal = 4,184 J).'
    },
    faqs: [
      {
        question: 'How many Joules are in 1 kilowatt-hour (kWh)?',
        answer: 'There are exactly 3,600,000 Joules (3.6 Megajoules) in 1 kWh (1,000 Watts × 3,600 seconds).'
      },
      {
        question: 'How do you convert food Calories to Kilojoules?',
        answer: 'Multiply Calories by 4.184. For example, a 250-calorie snack contains approximately 1,046 kJ.'
      }
    ]
  },

  power: {
    tagline: 'Mechanical horsepower, electrical wattage, and heating/cooling BTU outputs.',
    heroPlaceholder: 'Search power conversions (e.g., HP to kW, Watts to HP, BTU/hr)...',
    popularChips: [
      { label: 'Horsepower to Kilowatts', from: 'hp', to: 'kw' },
      { label: 'Kilowatts to Horsepower', from: 'kw', to: 'hp' },
      { label: 'Watts to Horsepower', from: 'w', to: 'hp' },
      { label: 'BTU/hr to Watts', from: 'btu_hr', to: 'w' },
      { label: 'Metric HP (PS) to Imperial HP', from: 'ps', to: 'hp' }
    ],
    benchmarks: [
      {
        title: 'Resting Human Metabolic Rate',
        category: 'Biology',
        fromValue: 80,
        fromUnitId: 'w',
        toUnitId: 'hp',
        icon: 'person',
        summary: '80 Watts = 0.107 HP',
        detail: 'Continuous heat output emitted by a relaxed adult human body at rest.'
      },
      {
        title: 'Elite Cyclist Maximum Sprint',
        category: 'Athletics',
        fromValue: 1500,
        fromUnitId: 'w',
        toUnitId: 'hp',
        icon: 'directions_bike',
        summary: '1,500 Watts = 2.01 HP',
        detail: 'Peak 5-second power output generated during a track cycling sprint.'
      },
      {
        title: 'Modern Compact Family SUV',
        category: 'Automotive',
        fromValue: 180,
        fromUnitId: 'hp',
        toUnitId: 'kw',
        icon: 'directions_car',
        summary: '180 HP = 134.23 kW',
        detail: 'Standard internal combustion or hybrid four-cylinder engine output.'
      },
      {
        title: 'Locomotive Diesel Engine',
        category: 'Heavy Rail',
        fromValue: 4400,
        fromUnitId: 'hp',
        toUnitId: 'mw',
        icon: 'train',
        summary: '4,400 HP = 3.28 MW',
        detail: 'Standard heavy-haul freight locomotive diesel-electric powertrain.'
      }
    ],
    scenarios: [
      {
        title: 'Automotive Engine Ratings & EVs',
        tag: 'Automotive',
        description: 'Comparing internal combustion engines (rated in HP) with electric motors (rated in kW).',
        icon: 'electric_bolt',
        tip: '1 Mechanical Horsepower (hp) equals approximately 745.7 Watts (0.7457 kW).'
      },
      {
        title: 'HVAC Air Conditioning Cooling Capacity',
        tag: 'HVAC',
        description: 'Air conditioner outputs are rated in BTU/hour or Tons of Refrigeration (1 Ton = 12,000 BTU/h = 3.517 kW).',
        icon: 'mode_fan',
        tip: 'A 12,000 BTU/h mini-split cooling unit produces roughly 3.52 kW of thermal extraction.'
      }
    ],
    historyGuide: {
      origin: 'James Watt invented the term horsepower to compare steam engine performance against working draft pit horses (defined as lifting 33,000 ft-lb per minute).',
      standards: 'The SI unit is the Watt (W), equal to 1 Joule per second (J/s).',
      pitfalls: 'Mechanical/Imperial HP (745.7 W) is slightly higher than Metric HP (PS/CV = 735.5 W).'
    },
    faqs: [
      {
        question: 'How do you convert horsepower to kilowatts?',
        answer: 'Multiply horsepower by 0.7457 (or divide by 1.341). For example, a 200 hp engine produces 149.14 kW.'
      },
      {
        question: 'What is the difference between mechanical HP and metric HP (PS)?',
        answer: 'Mechanical HP is based on imperial units (550 ft-lb/s = 745.6999 W). Metric HP (PS) is 75 kgf-m/s = 735.4988 W. 100 PS = 98.63 HP.'
      }
    ]
  },

  data_storage: {
    tagline: 'Binary (1024-based GiB/MiB) and Decimal (1000-based GB/MB) computing capacities.',
    heroPlaceholder: 'Search storage conversions (e.g., GB to TB, MB to GB, GiB vs GB)...',
    popularChips: [
      { label: 'Gigabytes to Terabytes', from: 'gb', to: 'tb' },
      { label: 'Terabytes to Gigabytes', from: 'tb', to: 'gb' },
      { label: 'Megabytes to Gigabytes', from: 'mb', to: 'gb' },
      { label: 'Gibibytes (GiB) to Gigabytes (GB)', from: 'gib', to: 'gb' },
      { label: 'Gigabytes to Megabytes', from: 'gb', to: 'mb' },
      { label: 'Bytes to Kilobytes', from: 'b', to: 'kb' }
    ],
    benchmarks: [
      {
        title: 'High-Res Digital Photo',
        category: 'Photography',
        fromValue: 12,
        fromUnitId: 'mb',
        toUnitId: 'kb',
        icon: 'photo_camera',
        summary: '12 MB = 12,000 KB',
        detail: 'Average uncompressed JPEG file size captured by a 48MP smartphone camera.'
      },
      {
        title: '4K Ultra HD Streaming Movie',
        category: 'Digital Media',
        fromValue: 20,
        fromUnitId: 'gb',
        toUnitId: 'mb',
        icon: 'movie',
        summary: '20 GB = 20,000 MB',
        detail: 'Typical data consumed streaming a 2-hour 4K HDR feature film on Netflix or Apple TV.'
      },
      {
        title: 'Modern Solid State Drive (SSD)',
        category: 'Hardware',
        fromValue: 1,
        fromUnitId: 'tb',
        toUnitId: 'gb',
        icon: 'storage',
        summary: '1 TB = 1,000 GB (931.32 GiB in Windows)',
        detail: 'Standard consumer NVMe SSD drive size for gaming and professional workstations.'
      }
    ],
    scenarios: [
      {
        title: 'Why 1TB Drive Shows as 931 GB in Windows',
        tag: 'Operating Systems',
        description: 'Hard drive manufacturers sell drives in decimal units (1 TB = 1,000,000,000,000 Bytes). Windows calculates capacity in binary gibibytes (GiB = 1,073,741,824 Bytes), reporting 931 GiB while labeling it "GB".',
        icon: 'laptop',
        tip: '1 TB = 1,000,000,000,000 ÷ 1,073,741,824 = 931.32 GiB.'
      }
    ],
    historyGuide: {
      origin: 'In the early computing era, programmers adopted kilo (1000) to approximate 2¹⁰ = 1024. In 1998, the IEC introduced KiB, MiB, GiB to eliminate ambiguity with decimal metric SI prefixes.',
      standards: 'SI prefixes (KB, MB, GB) are strictly powers of 10 (10³, 10⁶, 10⁹). IEC binary prefixes (KiB, MiB, GiB) are strictly powers of 2 (2¹⁰, 2²⁰, 2³⁰).',
      pitfalls: 'Always verify if a specification refers to decimal Gigabytes (GB) or binary Gibibytes (GiB).'
    },
    faqs: [
      {
        question: 'Why does my 500 GB drive only show 465 GB in Windows?',
        answer: 'Storage drive makers use decimal (500,000,000,000 bytes). Windows calculates in binary gibibytes (divided by 1024³ = 1,073,741,824), which equals 465.66 GiB.'
      },
      {
        question: 'What is the difference between a Bit and a Byte?',
        answer: 'There are exactly 8 bits in 1 Byte. Storage is measured in Bytes (B), while network speeds are measured in bits (b).'
      }
    ]
  },

  data_transfer: {
    tagline: 'Network bandwidth speed tests, fiber optics, and file download transfer times.',
    heroPlaceholder: 'Search speed conversions (e.g., Mbps to MB/s, Gbps to Mbps)...',
    popularChips: [
      { label: 'Megabits/s to Megabytes/s', from: 'mbps', to: 'mbs' },
      { label: 'Megabytes/s to Megabits/s', from: 'mbs', to: 'mbps' },
      { label: 'Gigabits/s to Megabits/s', from: 'gbps', to: 'mbps' },
      { label: 'Kilobits/s to Kilobytes/s', from: 'kbps', to: 'kbs' }
    ],
    benchmarks: [
      {
        title: 'Fiber Internet 1 Gbps Connection',
        category: 'Telecommunications',
        fromValue: 1,
        fromUnitId: 'gbps',
        toUnitId: 'mbs',
        icon: 'network_check',
        summary: '1 Gbps = 125 MB/s',
        detail: 'A Gigabit fiber connection can download a full 50 GB game in under 7 minutes.'
      },
      {
        title: '5G Mobile Broadband Speed',
        category: 'Cellular Networks',
        fromValue: 250,
        fromUnitId: 'mbps',
        toUnitId: 'mbs',
        icon: 'signal_cellular_alt',
        summary: '250 Mbps = 31.25 MB/s',
        detail: 'Average real-world mid-band 5G download speed in modern metropolitan areas.'
      }
    ],
    scenarios: [
      {
        title: 'Calculating Real File Download Times',
        tag: 'Networking',
        description: 'Internet service providers advertise speeds in Megabits per second (Mbps). Files on your computer are measured in Megabytes (MB). Divide your ISP speed by 8 to get true download speed.',
        icon: 'download',
        tip: 'A 100 Mbps internet connection downloads at a theoretical maximum of 12.5 MB/s.'
      }
    ],
    historyGuide: {
      origin: 'Modems were historically rated in baud and bits per second (e.g., 300 bps in 1970, 56 kbps in 1997).',
      standards: '1 Byte/s = 8 bits/s. 1 Mbps = 1,000,000 bits/sec.',
      pitfalls: 'Lowercase "b" indicates bits (Mbps); uppercase "B" indicates bytes (MB/s).'
    },
    faqs: [
      {
        question: 'Why does my 100 Mbps internet only download at 12 MB/s?',
        answer: 'Internet speeds are sold in bits, but downloads are reported in bytes. Because 1 byte = 8 bits, 100 Mbps / 8 = 12.5 MB/s.'
      }
    ]
  },

  fuel_economy: {
    tagline: 'Vehicle consumption rates across US MPG, UK Imperial MPG, and metric L/100km.',
    heroPlaceholder: 'Search fuel economy conversions (e.g., MPG to L/100km)...',
    popularChips: [
      { label: 'MPG (US) to L/100km', from: 'mpg_us', to: 'l100km' },
      { label: 'L/100km to MPG (US)', from: 'l100km', to: 'mpg_us' },
      { label: 'MPG (US) to MPG (UK)', from: 'mpg_us', to: 'mpg_uk' },
      { label: 'km/L to MPG (US)', from: 'km_l', to: 'mpg_us' }
    ],
    benchmarks: [
      {
        title: 'Standard Hybrid Vehicle',
        category: 'Automotive',
        fromValue: 50,
        fromUnitId: 'mpg_us',
        toUnitId: 'l100km',
        icon: 'electric_car',
        summary: '50 MPG (US) = 4.70 L/100km (60.05 MPG UK)',
        detail: 'Typical fuel efficiency rating for modern gasoline-electric hybrid sedans.'
      },
      {
        title: 'Full-Size Pickup Truck',
        category: 'Automotive',
        fromValue: 18,
        fromUnitId: 'mpg_us',
        toUnitId: 'l100km',
        icon: 'local_shipping',
        summary: '18 MPG (US) = 13.07 L/100km',
        detail: 'Average combined fuel economy for V8 full-size commercial trucks.'
      }
    ],
    scenarios: [
      {
        title: 'Inverted Scale: Why L/100km is Reciprocal',
        tag: 'Analytics',
        description: 'In the US and UK, higher MPG is better (distance per unit fuel). In Europe and Asia, lower L/100km is better (fuel consumed per 100 km).',
        icon: 'analytics',
        tip: 'Formula: L/100km = 235.215 / MPG (US).'
      }
    ],
    historyGuide: {
      origin: 'Different countries adopted either distance-per-volume (MPG, km/L) or volume-per-distance (L/100km).',
      standards: 'Metric standard is Liters per 100 Kilometers (L/100km). UK Gallons are 20% larger than US Gallons.',
      pitfalls: '1 Imperial Gallon (4.546 L) is larger than 1 US Gallon (3.785 L), so UK MPG numbers look higher than US MPG for the same car.'
    },
    faqs: [
      {
        question: 'How do you convert US MPG to L/100km?',
        answer: 'Divide 235.215 by the MPG number. For example: 235.215 / 30 MPG = 7.84 L/100km.'
      },
      {
        question: 'Why is UK MPG higher than US MPG?',
        answer: 'An Imperial (UK) gallon is 4.546 liters, while a US gallon is 3.785 liters. A car getting 30 US MPG will get 36.03 UK MPG.'
      }
    ]
  },

  number_systems: {
    tagline: 'Computer architecture radices across Decimal (10), Binary (2), Hex (16), Octal (8), and Roman Numerals.',
    heroPlaceholder: 'Search number radix conversions (e.g., Decimal to Hex, Binary to Decimal)...',
    popularChips: [
      { label: 'Decimal to Hexadecimal', from: 'dec', to: 'hex' },
      { label: 'Hexadecimal to Decimal', from: 'hex', to: 'dec' },
      { label: 'Decimal to Binary', from: 'dec', to: 'bin' },
      { label: 'Binary to Decimal', from: 'bin', to: 'dec' },
      { label: 'Decimal to Roman Numerals', from: 'dec', to: 'roman' },
      { label: 'Hexadecimal to Binary', from: 'hex', to: 'bin' }
    ],
    benchmarks: [
      {
        title: 'Single Byte Maximum Value (8-bit)',
        category: 'Computing',
        fromValue: 255,
        fromUnitId: 'dec',
        toUnitId: 'hex',
        icon: 'memory',
        summary: '255 DEC = 0xFF (11111111 BIN = CCLV)',
        detail: 'The maximum integer value that can be held in an unsigned 8-bit byte.'
      },
      {
        title: '16-Bit Half-Word Maximum',
        category: 'Computing',
        fromValue: 65535,
        fromUnitId: 'dec',
        toUnitId: 'hex',
        icon: 'developer_board',
        summary: '65,535 DEC = 0xFFFF (16 ones)',
        detail: 'The maximum value of an unsigned 16-bit word, familiar in TCP/UDP port numbers.'
      }
    ],
    scenarios: [
      {
        title: 'Web Design Hex Color Codes',
        tag: 'Frontend UI',
        description: 'CSS colors represent Red, Green, and Blue channels as 2-digit hex values from 00 to FF (0 to 255). Pure red is #FF0000 (255, 0, 0).',
        icon: 'palette',
        tip: 'Hex uses digits 0-9 and letters A-F (A=10, B=11, C=12, D=13, E=14, F=15).'
      }
    ],
    historyGuide: {
      origin: 'Binary was formalized by Gottfried Wilhelm Leibniz in 1679. Hexadecimal became standard with IBM System/360 in 1964.',
      standards: 'Base 2 (Binary), Base 8 (Octal), Base 10 (Decimal), Base 16 (Hexadecimal).',
      pitfalls: 'Roman numerals lack a zero character and cannot express negative numbers or fractions natively.'
    },
    faqs: [
      {
        question: 'How do you convert Decimal to Hexadecimal?',
        answer: 'Repeatedly divide the number by 16 and record the remainders. For example, 254 / 16 = 15 remainder 14. 15 = F, 14 = E, so 254 is FE in hex.'
      }
    ]
  }
};

// Default fallback generator for remaining specialized categories (torque, frequency, electrical, cooking, engineering, scientific)
export function getCategoryRichData(categoryId: string): CategoryMetaRecord {
  if (CATEGORY_RICH_DATA[categoryId]) {
    return CATEGORY_RICH_DATA[categoryId];
  }

  // Generate dynamic fallback
  return {
    tagline: `Accurate, certified unit conversions for ${categoryId.replace(/_/g, ' ')} with real-time formulas and benchmark tables.`,
    heroPlaceholder: `Search ${categoryId.replace(/_/g, ' ')} conversions...`,
    popularChips: [],
    benchmarks: [
      {
        title: 'Standard Baseline Magnitude (1.0)',
        category: 'Metrology',
        fromValue: 1,
        fromUnitId: '',
        toUnitId: '',
        icon: 'analytics',
        summary: 'Baseline Reference Unit',
        detail: `The fundamental international coherent unit for ${categoryId.replace(/_/g, ' ')}.`
      },
      {
        title: 'Decade Scale (×10)',
        category: 'Metrology',
        fromValue: 10,
        fromUnitId: '',
        toUnitId: '',
        icon: 'trending_up',
        summary: 'Decade Multiplier',
        detail: `Common engineering scale benchmark.`
      }
    ],
    scenarios: [
      {
        title: `Professional Standards & Engineering`,
        tag: 'Technical',
        description: `Ensure zero algorithmic drift across metric and imperial systems for ${categoryId.replace(/_/g, ' ')}.`,
        icon: 'precision_manufacturing',
        tip: 'All calculations are executed using 64-bit double-precision floating-point arithmetic.'
      }
    ],
    historyGuide: {
      origin: `Units for ${categoryId.replace(/_/g, ' ')} were developed to quantify industrial and physical laboratory phenomena.`,
      standards: 'Standardized by the International System of Units (SI) and BIPM guidelines.',
      pitfalls: 'Always check the unit prefix and definition standard when transferring values between legacy and modern systems.'
    },
    faqs: [
      {
        question: `How accurate is this ${categoryId.replace(/_/g, ' ')} converter?`,
        answer: 'SolveIt Calculator uses 64-bit double-precision math based on NIST SP 811 and BIPM standards for exact laboratory-grade accuracy.'
      }
    ]
  };
}
