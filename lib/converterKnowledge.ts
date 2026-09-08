import { CategoryDefinition, UnitDefinition, convertValue, formatResult } from './conversions';

export interface RealWorldExample {
  title: string;
  fromVal: number;
  fromFormatted: string;
  toFormatted: string;
  description: string;
  icon: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface UnitDetail {
  name: string;
  symbol: string;
  system: string;
  whatIs: string;
  history: string;
  usage: string;
  countries: string;
}

export interface StepByStepCalculation {
  formulaText: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
}

export interface ConverterKnowledge {
  fromUnitDetail: UnitDetail;
  toUnitDetail: UnitDetail;
  factorText: string;
  exactFactor: number | string;
  formula: string;
  reverseFormula: string;
  mentalMathTip: string;
  commonMistakes: string[];
  realWorldExamples: RealWorldExample[];
  faqs: FAQItem[];
}

export function getStepByStepCalculation(
  val: number,
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  precision: 'auto' | '2' | '4' | '6' | '8' | 'scientific' = '4'
): StepByStepCalculation {
  const res = convertValue(val, category.id, fromUnit.id, toUnit.id);
  const formatted = formatResult(res.resultNumber, precision);

  if (category.id === 'temperature') {
    if (fromUnit.id === 'c' && toUnit.id === 'f') {
      const mult = val * 1.8;
      return {
        formulaText: `°F = (°C × 9/5) + 32`,
        step1: `Identify the thermodynamic formula: Multiply temperature in Celsius by 9/5 (or 1.8), then add 32.`,
        step2: `Substitute the value: (${val} × 1.8) + 32`,
        step3: `Perform multiplication first: ${val} × 1.8 = ${mult.toFixed(4)}`,
        step4: `Add 32 offset: ${mult.toFixed(4)} + 32 = ${formatted} °F`
      };
    }
    if (fromUnit.id === 'f' && toUnit.id === 'c') {
      const sub = val - 32;
      return {
        formulaText: `°C = (°F - 32) × 5/9`,
        step1: `Identify the thermodynamic formula: Subtract 32 from Fahrenheit, then multiply by 5/9.`,
        step2: `Substitute the value: (${val} - 32) × (5/9)`,
        step3: `Perform subtraction inside parentheses: ${val} - 32 = ${sub.toFixed(4)}`,
        step4: `Multiply by 5/9: ${sub.toFixed(4)} × 0.555556 = ${formatted} °C`
      };
    }
    if (fromUnit.id === 'c' && toUnit.id === 'k') {
      return {
        formulaText: `K = °C + 273.15`,
        step1: `Identify the absolute temperature formula: Kelvin begins at absolute zero (-273.15 °C).`,
        step2: `Substitute the value: ${val} + 273.15`,
        step3: `Perform additive shift: ${val} + 273.15`,
        step4: `Final thermodynamic result: ${formatted} K`
      };
    }
  }

  // Linear standard conversion
  let factor = res.factor;
  let factorDisplay = typeof factor === 'number' ? (factor < 0.0001 || factor > 10000 ? factor.toExponential(4) : factor.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')) : '1';

  return {
    formulaText: `${toUnit.symbol} = ${fromUnit.symbol} × ${factorDisplay}`,
    step1: `Identify conversion factor: 1 ${fromUnit.name} = ${factorDisplay} ${toUnit.name}s.`,
    step2: `Substitute input into equation: ${val} ${fromUnit.symbol} × ${factorDisplay}`,
    step3: `Compute arithmetic multiplication: ${val} × ${factorDisplay} = ${res.resultNumber.toFixed(8).replace(/0+$/, '').replace(/\.$/, '')}`,
    step4: `Round to desired precision (${precision}): ${formatted} ${toUnit.symbol}`
  };
}

// Generate rich knowledge and metrological information for the pair
export function getConverterKnowledge(
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): ConverterKnowledge {
  const isCmToIn = fromUnit.id === 'cm' && toUnit.id === 'in';
  const isInToCm = fromUnit.id === 'in' && toUnit.id === 'cm';
  const isKgToLb = fromUnit.id === 'kg' && toUnit.id === 'lb';
  const isLbToKg = fromUnit.id === 'lb' && toUnit.id === 'kg';
  const isCToF = fromUnit.id === 'c' && toUnit.id === 'f';
  const isFToC = fromUnit.id === 'f' && toUnit.id === 'c';
  const isMToFt = fromUnit.id === 'm' && toUnit.id === 'ft';
  const isFtToM = fromUnit.id === 'ft' && toUnit.id === 'm';
  const isMphToKmh = fromUnit.id === 'mph' && toUnit.id === 'kmh';
  const isKmhToMph = fromUnit.id === 'kmh' && toUnit.id === 'mph';

  // 1. From Unit Details
  const fromUnitDetail: UnitDetail = getUnitDetail(fromUnit, category);
  const toUnitDetail: UnitDetail = getUnitDetail(toUnit, category);

  // 2. Factor and formulas
  let exactFactor = '1';
  let factorText = '';
  let formula = '';
  let reverseFormula = '';
  let mentalMathTip = '';
  const commonMistakes: string[] = [];

  if (isCmToIn) {
    exactFactor = '0.3937007874';
    factorText = '1 cm = 1 ÷ 2.54 in ≈ 0.393700787 in';
    formula = 'inches = centimeters ÷ 2.54 (or cm × 0.3937008)';
    reverseFormula = 'centimeters = inches × 2.54';
    mentalMathTip = 'Quick mental estimation: To convert cm to inches in your head, multiply by 4 and drop the last digit (e.g. 20 cm × 4 = 80 → ~8 inches; actual 7.87 in), or divide by 2.5.';
    commonMistakes.push(
      'Using 2.5 instead of 2.54 for precision carpentry, which introduces a 1.6% compounding dimensional error.',
      'Confounding millimeter and centimeter decimal points (e.g. 15 mm is 1.5 cm, not 15 cm).',
      'Forgetting that 1 inch is legally defined as exactly 25.4 mm worldwide.'
    );
  } else if (isInToCm) {
    exactFactor = '2.54';
    factorText = '1 in = exactly 2.54 cm';
    formula = 'centimeters = inches × 2.54';
    reverseFormula = 'inches = centimeters ÷ 2.54';
    mentalMathTip = 'Multiply by 2.5 and add a tiny sliver (e.g. 10 inches × 2.5 = 25 cm, actual is 25.4 cm).';
    commonMistakes.push(
      'Rounding 2.54 down to 2.5 prematurely in engineering calculations.',
      'Treating imperial fractions (like 5/8") as decimals incorrectly (5/8 = 0.625 inches).'
    );
  } else if (isKgToLb) {
    exactFactor = '2.2046226218';
    factorText = '1 kg ≈ 2.20462262 lb (exact definition: 1 lb = 0.45359237 kg)';
    formula = 'pounds = kilograms × 2.20462262';
    reverseFormula = 'kilograms = pounds ÷ 2.20462262';
    mentalMathTip = 'Double the kilogram value and add 10% of that double. Example: 70 kg × 2 = 140; 140 + 14 = 154 lbs (exact is 154.32 lbs). Very fast and remarkably accurate within 0.2%!';
    commonMistakes.push(
      'Confusing mass (kg) with weight/force in non-standard gravity environments.',
      'Using 2.2 for large medical or aviation payloads, leading to safety margins being breached.'
    );
  } else if (isLbToKg) {
    exactFactor = '0.45359237';
    factorText = '1 lb = exactly 0.45359237 kg';
    formula = 'kilograms = pounds × 0.45359237';
    reverseFormula = 'pounds = kilograms ÷ 0.45359237';
    mentalMathTip = 'Divide the pounds by 2, then subtract 10% of that result. Example: 200 lbs ÷ 2 = 100; 100 - 10 = 90 kg (exact is 90.7 kg).';
    commonMistakes.push(
      'Confusing Troy ounces/pounds (used in gold) with Avoirdupois pounds (commercial weight).'
    );
  } else if (isCToF) {
    exactFactor = '1.8 (+ 32)';
    factorText = '°F = (°C × 1.8) + 32';
    formula = '°F = (°C × 9/5) + 32';
    reverseFormula = '°C = (°F - 32) × 5/9';
    mentalMathTip = 'Double the Celsius temperature, subtract 10%, and add 32. Example: 20°C × 2 = 40; 40 - 4 = 36; 36 + 32 = 68°F (exact room temp!).';
    commonMistakes.push(
      'Forgetting to add 32 after multiplying by 1.8.',
      'Assuming temperature intervals scale identically: a 1°C increase equals a 1.8°F increase.'
    );
  } else if (isFToC) {
    exactFactor = '0.555556 (- 32)';
    factorText = '°C = (°F - 32) × 5/9';
    formula = '°C = (°F - 32) × 5/9';
    reverseFormula = '°F = (°C × 9/5) + 32';
    mentalMathTip = 'Subtract 30 and divide by 2 for everyday weather. Example: 70°F - 30 = 40; 40 ÷ 2 = 20°C (exact is 21.1°C).';
    commonMistakes.push(
      'Dividing before subtracting 32 (order of operations error).',
      'Forgetting that -40° is the exact intersection point where -40°C equals -40°F.'
    );
  } else if (isMToFt) {
    exactFactor = '3.280839895';
    factorText = '1 m ≈ 3.28084 ft (exact: 1 ft = 0.3048 m)';
    formula = 'feet = meters × 3.28084';
    reverseFormula = 'meters = feet × 0.3048';
    mentalMathTip = 'Multiply meters by 3 and add 10%. Example: 5 meters × 3 = 15; 15 + 1.5 = 16.5 ft (actual 16.4 ft).';
    commonMistakes.push(
      'Confusing decimal feet (e.g. 5.5 ft) with feet and inches (5 ft 6 in, not 5 ft 5 in).'
    );
  } else if (isMphToKmh) {
    exactFactor = '1.609344';
    factorText = '1 mph = exactly 1.609344 km/h';
    formula = 'km/h = mph × 1.609344';
    reverseFormula = 'mph = km/h ÷ 1.609344';
    mentalMathTip = 'Use Fibonacci pairs: 3 mph ≈ 5 km/h, 5 mph ≈ 8 km/h, 8 mph ≈ 13 km/h, 50 mph ≈ 80 km/h, 60 mph ≈ 100 km/h.';
    commonMistakes.push(
      'Confusing statute miles (1.609 km) with nautical miles per hour (knots, 1.852 km/h).'
    );
  } else {
    // Dynamic fallback for any other pair
    const res = convertValue(1, category.id, fromUnit.id, toUnit.id);
    exactFactor = typeof res.factor === 'number' ? res.factor.toFixed(6).replace(/0+$/, '').replace(/\.$/, '') : '1';
    factorText = `1 ${fromUnit.symbol} = ${exactFactor} ${toUnit.symbol}`;
    formula = `${toUnit.name} = ${fromUnit.name} × ${exactFactor}`;
    reverseFormula = `${fromUnit.name} = ${toUnit.name} ÷ ${exactFactor}`;
    mentalMathTip = `Remember that 1 ${fromUnit.name} equals approximately ${exactFactor} ${toUnit.name}.`;
    commonMistakes.push(
      'Using rounded factors when compounding calculations over large magnitudes.',
      'Overlooking whether units are defined under metric SI or US customary definitions.'
    );
  }

  // 3. Real World Examples
  const realWorldExamples: RealWorldExample[] = getRealWorldExamples(category, fromUnit, toUnit);

  // 4. Rich FAQ
  const faqs: FAQItem[] = getFAQs(category, fromUnit, toUnit, factorText, formula);

  return {
    fromUnitDetail,
    toUnitDetail,
    factorText,
    exactFactor,
    formula,
    reverseFormula,
    mentalMathTip,
    commonMistakes,
    realWorldExamples,
    faqs
  };
}

function getUnitDetail(unit: UnitDefinition, category: CategoryDefinition): UnitDetail {
  const id = unit.id;

  if (id === 'cm') {
    return {
      name: 'Centimeter',
      symbol: 'cm',
      system: 'International System of Units (SI Metric)',
      whatIs: 'A centimeter is a decimal metric unit of length equal to one-hundredth of a meter (10⁻² m). It corresponds to the distance light travels in vacuum in 1/29,979,245,800 of a second.',
      history: 'Originated during the French Revolution in the 1790s with the establishment of the metric system. It became the foundational unit of length in the CGS (centimeter-gram-second) system before MKS and SI standardizations.',
      usage: 'Widely used in everyday life worldwide for height measurement, apparel sizing, interior dimensions, construction, biology, and school education.',
      countries: 'Used officially across 95%+ of nations worldwide (all countries except primary customary use in the US).'
    };
  }
  if (id === 'in') {
    return {
      name: 'Inch',
      symbol: 'in (or ″)',
      system: 'Imperial & US Customary System',
      whatIs: 'An inch is a non-metric unit of length equal to 1/12 of a foot and 1/36 of a yard. By international legal treaty, 1 inch is defined as exactly 25.4 millimeters (0.0254 meters).',
      history: 'Historically derived from the Roman "uncia" (meaning "twelfth part") and traditionally associated with the width of a human thumb or the length of three dry barleycorns laid end-to-end. Formalized in 1959 by the International Yard and Pound Agreement.',
      usage: 'Standard unit for screen displays (TVs, laptops, smartphones), bicycle wheel sizing, lumber dimensions (2x4s), pipe fittings, fastener threads, and consumer goods.',
      countries: 'Primary official usage in the United States, Liberia, and Myanmar; widely understood in the UK, Canada, and global consumer electronics.'
    };
  }
  if (id === 'kg') {
    return {
      name: 'Kilogram',
      symbol: 'kg',
      system: 'SI Base Unit',
      whatIs: 'The kilogram is the fundamental SI base unit of mass. Under the 2019 BIPM redefinition, it is defined by taking the fixed numerical value of the Planck constant h to be exactly 6.62607015 × 10⁻³⁴ J·s.',
      history: 'Originally defined in 1795 as the mass of one liter of pure water at freezing. For over a century it was embodied by the physical Platinum-Iridium cylinder ("Le Grand K") kept in Sèvres, France, until physical constants replaced physical artifacts.',
      usage: 'Global gold standard for commerce, medicine, aerospace, science, packaging, food logistics, and engineering.',
      countries: 'Universal global standard adopted by international treaty across every country.'
    };
  }
  if (id === 'lb') {
    return {
      name: 'Pound (Avoirdupois)',
      symbol: 'lb',
      system: 'Imperial & US Customary System',
      whatIs: 'The avoirdupois pound is legally defined as exactly 0.45359237 kilograms. It is subdivided into 16 avoirdupois ounces or 7,000 grains.',
      history: 'Descended from the Roman libra (hence the symbol "lb"). Standardized in England during the reign of Queen Elizabeth I to establish fair commerce for grain, wool, and butchery.',
      usage: 'Body weight, culinary recipes, grocery produce, gym weights, shipping freight, and aircraft weight calculations in the United States.',
      countries: 'Primary use in the United States; colloquially used in the UK, Canada, and Caribbean nations.'
    };
  }
  if (id === 'c') {
    return {
      name: 'Degree Celsius',
      symbol: '°C',
      system: 'SI Derived Unit (Metric)',
      whatIs: 'A metric temperature scale where 0 °C is the freezing point of water and 100 °C is the boiling point of water at standard atmospheric pressure (101.325 kPa).',
      history: 'Conceived in 1742 by Swedish astronomer Anders Celsius. Originally inverted (0 was boiling, 100 was freezing), it was inverted to its modern form shortly after his death by Carl Linnaeus.',
      usage: 'Weather reporting, medicine, cooking, scientific labs, refrigeration, and HVAC controls worldwide.',
      countries: 'Used by the entire world with the exception of the United States and several associated territories.'
    };
  }
  if (id === 'f') {
    return {
      name: 'Degree Fahrenheit',
      symbol: '°F',
      system: 'US Customary & Imperial System',
      whatIs: 'A temperature scale where water freezes at 32 °F and boils at 212 °F, establishing a 180-degree interval between the phase changes of water at sea level.',
      history: 'Proposed in 1724 by physicist Daniel Gabriel Fahrenheit. He calibrated 0 °F using an ice-salt brine, 32 °F as freezing water, and ~96 °F as healthy human body temperature.',
      usage: 'Weather forecasting, residential heating/cooling, baking ovens, meat culinary temperatures, and industrial processes in the US.',
      countries: 'United States, Bahamas, Cayman Islands, Palau, Federated States of Micronesia, and Marshall Islands.'
    };
  }

  // Generic fallback detail
  return {
    name: unit.name,
    symbol: unit.symbol,
    system: unit.system === 'metric' ? 'Metric System (SI)' : unit.system === 'imperial' ? 'Imperial System' : 'Standard Metrology',
    whatIs: `The ${unit.name} (${unit.symbol}) is a recognized unit in ${category.name.toLowerCase()} measurement with exact conversion factors defined against standard base units.`,
    history: `Developed and standardized through historical metrology agreements to maintain consistency across commerce, engineering, and science.`,
    usage: `Commonly employed in technical specifications, commercial exchanges, scientific measurement, and everyday quantification.`,
    countries: unit.system === 'metric' ? 'Standardized globally across metric jurisdictions.' : 'Used primarily in customary or specific technical industries.'
  };
}

function getRealWorldExamples(
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): RealWorldExample[] {
  if (category.id === 'length') {
    return [
      {
        title: 'Flagship Smartphone Screen',
        fromVal: 15.5,
        fromFormatted: '15.5 cm',
        toFormatted: '6.1 inches',
        description: 'Standard modern smartphone diagonal display dimension (e.g. iPhone 16 / Galaxy S24).',
        icon: 'smartphone'
      },
      {
        title: 'Standard Credit Card Width',
        fromVal: 8.56,
        fromFormatted: '8.56 cm',
        toFormatted: '3.37 inches',
        description: 'ISO/IEC 7810 ID-1 standard dimensions for all global credit cards, debit cards, and driver licenses.',
        icon: 'credit_card'
      },
      {
        title: 'Living Room 65" 4K Television',
        fromVal: 144,
        fromFormatted: '144 cm',
        toFormatted: '56.7 inches',
        description: 'Actual horizontal width of a typical 65-inch widescreen television bezel.',
        icon: 'tv'
      },
      {
        title: 'Average Adult Human Height',
        fromVal: 175,
        fromFormatted: '175 cm',
        toFormatted: '68.9 in (5 ft 8.9 in)',
        description: 'Global benchmark adult stature comparison in medical charts and ergonomic seating.',
        icon: 'accessibility_new'
      },
      {
        title: 'Standard A4 Paper Height',
        fromVal: 29.7,
        fromFormatted: '29.7 cm',
        toFormatted: '11.69 inches',
        description: 'ISO 216 paper standard used internationally, compared to US Letter (11.0 inches).',
        icon: 'description'
      }
    ];
  }

  if (category.id === 'weight') {
    return [
      {
        title: 'Standard Smartphone',
        fromVal: 0.2,
        fromFormatted: '0.2 kg (200 g)',
        toFormatted: '0.44 lbs (7.05 oz)',
        description: 'Average weight of a modern smartphone with glass and aluminum chassis.',
        icon: 'smartphone'
      },
      {
        title: 'Gallon of Fresh Water',
        fromVal: 3.78,
        fromFormatted: '3.78 kg',
        toFormatted: '8.34 lbs',
        description: 'The exact mass of one US liquid gallon of pure water at maximum density (4 °C).',
        icon: 'water_drop'
      },
      {
        title: 'Average Adult Human',
        fromVal: 70,
        fromFormatted: '70 kg',
        toFormatted: '154.32 lbs',
        description: 'Standard reference physiological mass used in pharmacology, aircraft seat loading, and elevators.',
        icon: 'person'
      },
      {
        title: 'Family Electric Vehicle (EV)',
        fromVal: 1800,
        fromFormatted: '1,800 kg',
        toFormatted: '3,968 lbs',
        description: 'Curb weight of a midsize electric sedan including traction lithium battery pack.',
        icon: 'directions_car'
      }
    ];
  }

  if (category.id === 'temperature') {
    return [
      {
        title: 'Freezing Point of Water',
        fromVal: 0,
        fromFormatted: '0 °C',
        toFormatted: '32 °F',
        description: 'The exact equilibrium temperature where liquid water solidifies into ice at sea level.',
        icon: 'ac_unit'
      },
      {
        title: 'Comfortable Room Temperature',
        fromVal: 21,
        fromFormatted: '21 °C',
        toFormatted: '69.8 °F',
        description: 'Recommended ambient residential climate setting for energy efficiency and human comfort.',
        icon: 'home'
      },
      {
        title: 'Healthy Human Core Body',
        fromVal: 37,
        fromFormatted: '37 °C',
        toFormatted: '98.6 °F',
        description: 'Clinical standard normothermic internal human temperature established by Carl Wunderlich.',
        icon: 'favorite'
      },
      {
        title: 'Boiling Point of Water',
        fromVal: 100,
        fromFormatted: '100 °C',
        toFormatted: '212 °F',
        description: 'Vaporization transition point for pure water at standard atmospheric pressure (1 atm).',
        icon: 'local_fire_department'
      }
    ];
  }

  // Default benchmarks for speed, pressure, etc.
  return [
    {
      title: 'Common Benchmark Unit Value',
      fromVal: 1,
      fromFormatted: `1 ${fromUnit.symbol}`,
      toFormatted: `${convertValue(1, category.id, fromUnit.id, toUnit.id).resultNumber.toFixed(4)} ${toUnit.symbol}`,
      description: `Basic unit conversion ratio between ${fromUnit.name} and ${toUnit.name}.`,
      icon: 'sync_alt'
    },
    {
      title: 'Decade Scale Value (×10)',
      fromVal: 10,
      fromFormatted: `10 ${fromUnit.symbol}`,
      toFormatted: `${convertValue(10, category.id, fromUnit.id, toUnit.id).resultNumber.toFixed(4)} ${toUnit.symbol}`,
      description: `Common order of magnitude for ${category.name.toLowerCase()} measurements.`,
      icon: 'speed'
    },
    {
      title: 'Century Scale Value (×100)',
      fromVal: 100,
      fromFormatted: `100 ${fromUnit.symbol}`,
      toFormatted: `${convertValue(100, category.id, fromUnit.id, toUnit.id).resultNumber.toFixed(4)} ${toUnit.symbol}`,
      description: `Engineering scale comparison for ${fromUnit.name}.`,
      icon: 'analytics'
    }
  ];
}

function getFAQs(
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  factorText: string,
  formula: string
): FAQItem[] {
  return [
    {
      q: `How do you convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()}?`,
      a: `To convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()}, use the formula: ${formula}. For example, 10 ${fromUnit.symbol} converted using this formula equals ${convertValue(10, category.id, fromUnit.id, toUnit.id).resultNumber.toFixed(4)} ${toUnit.symbol}.`
    },
    {
      q: `What is the exact conversion factor between ${fromUnit.name} and ${toUnit.name}?`,
      a: `The relationship is defined as: ${factorText}. All calculations in this tool adhere to international metrology standards (NIST SP 811 and BIPM SI definitions) to ensure zero algorithmic drift.`
    },
    {
      q: `Can I convert negative numbers or decimals?`,
      a: `Yes. SolveIt Calculator fully supports decimals, floating-point fractions, and negative values (where physically meaningful, such as temperature scales, elevation changes, and offset measurements).`
    },
    {
      q: `Why is an inch defined as exactly 2.54 centimeters?`,
      a: `Before 1959, the United States and the United Kingdom used slightly differing definitions of the inch based on physical yard bars. On July 1, 1959, the International Yard and Pound Agreement was signed by the US, UK, Canada, Australia, New Zealand, and South Africa, formally binding 1 yard to exactly 0.9144 meters, which mathematically defines 1 inch as exactly 25.4 millimeters (2.54 cm).`
    },
    {
      q: `How accurate is this conversion tool?`,
      a: `This calculator performs conversions using 64-bit IEEE 754 double-precision arithmetic. Results are calculated with exact rational fractions where available, guaranteeing laboratory-grade precision suitable for academic, engineering, and trade applications.`
    },
    {
      q: `How do I quickly estimate this conversion in my head?`,
      a: `For rapid everyday approximations without a calculator, you can use mental math rounding shortcuts. For centimeters to inches, multiply by 4 and divide by 10 (or divide by 2.5). For kilograms to pounds, double the value and add 10%.`
    }
  ];
}
