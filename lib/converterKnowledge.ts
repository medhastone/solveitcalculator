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
  standardOrg: string;
  baseEquivalence: string;
}

export interface StepByStepCalculation {
  formulaText: string;
  reverseFormulaText: string;
  sampleInput: number;
  sampleResult: string;
  reverseSampleInput: number;
  reverseSampleResult: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  reverseStep1: string;
  reverseStep2: string;
  reverseStep3: string;
  reverseStep4: string;
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
  citations: {
    title: string;
    organization: string;
    linkText: string;
    url: string;
    sourceType?: string;
    description: string;
  }[];
}

export function getStepByStepCalculation(
  val: number,
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  precision: 'auto' | '2' | '4' | '6' | '8' | 'scientific' = '4'
): StepByStepCalculation {
  const currentVal = isNaN(val) || val === 0 ? 5 : val;
  const res = convertValue(currentVal, category.id, fromUnit.id, toUnit.id);
  const formatted = formatResult(res.resultNumber, precision);

  // Reverse calculation
  const reverseRes = convertValue(res.resultNumber, category.id, toUnit.id, fromUnit.id);
  const reverseFormatted = formatResult(reverseRes.resultNumber, precision);

  if (category.id === 'temperature') {
    if (fromUnit.id === 'c' && toUnit.id === 'f') {
      const mult = currentVal * 1.8;
      const reverseVal = res.resultNumber;
      const reverseSub = reverseVal - 32;
      return {
        formulaText: `°F = (°C × 9/5) + 32`,
        reverseFormulaText: `°C = (°F - 32) × 5/9`,
        sampleInput: currentVal,
        sampleResult: `${formatted} °F`,
        reverseSampleInput: parseFloat(reverseVal.toFixed(2)),
        reverseSampleResult: `${currentVal} °C`,
        step1: `Write down the temperature conversion formula: °F = (°C × 9/5) + 32`,
        step2: `Substitute the value: °F = (${currentVal} × 1.8) + 32`,
        step3: `Perform the multiplication: ${currentVal} × 1.8 = ${mult.toFixed(4)}`,
        step4: `Add 32 to get the final Fahrenheit temperature: ${mult.toFixed(4)} + 32 = ${formatted} °F`,
        reverseStep1: `Write down the reverse formula: °C = (°F - 32) × 5/9`,
        reverseStep2: `Substitute ${formatted} °F: °C = (${formatted} - 32) × 5/9`,
        reverseStep3: `Perform subtraction inside parentheses: ${formatted} - 32 = ${reverseSub.toFixed(4)}`,
        reverseStep4: `Multiply by 5/9 (0.5556) to obtain Celsius: ${reverseFormatted} °C`
      };
    }
    if (fromUnit.id === 'f' && toUnit.id === 'c') {
      const sub = currentVal - 32;
      const reverseVal = res.resultNumber;
      return {
        formulaText: `°C = (°F - 32) × 5/9`,
        reverseFormulaText: `°F = (°C × 9/5) + 32`,
        sampleInput: currentVal,
        sampleResult: `${formatted} °C`,
        reverseSampleInput: parseFloat(reverseVal.toFixed(2)),
        reverseSampleResult: `${currentVal} °F`,
        step1: `Write down the temperature conversion formula: °C = (°F - 32) × 5/9`,
        step2: `Substitute the value: °C = (${currentVal} - 32) × (5/9)`,
        step3: `Subtract 32: ${currentVal} - 32 = ${sub.toFixed(4)}`,
        step4: `Multiply by 5/9 (0.5556): ${sub.toFixed(4)} × 0.5556 = ${formatted} °C`,
        reverseStep1: `Write down the reverse formula: °F = (°C × 9/5) + 32`,
        reverseStep2: `Substitute ${formatted} °C: °F = (${formatted} × 1.8) + 32`,
        reverseStep3: `Multiply by 1.8: ${formatted} × 1.8 = ${(parseFloat(formatted) * 1.8).toFixed(4)}`,
        reverseStep4: `Add 32: ${(parseFloat(formatted) * 1.8).toFixed(4)} + 32 = ${currentVal} °F`
      };
    }
  }

  // Energy: kilocalorie to calorie
  if (fromUnit.id === 'kcal' && toUnit.id === 'cal') {
    return {
      formulaText: `calories = kilocalories × 1,000`,
      reverseFormulaText: `kilocalories = calories ÷ 1,000`,
      sampleInput: currentVal,
      sampleResult: `${formatted} cal`,
      reverseSampleInput: res.resultNumber,
      reverseSampleResult: `${currentVal} kcal`,
      step1: `State the conversion ratio: 1 kilocalorie (kcal) = 1,000 small calories (cal).`,
      step2: `Substitute the value into the equation: calories = ${currentVal} kcal × 1,000`,
      step3: `Perform the multiplication: ${currentVal} × 1,000 = ${res.resultNumber}`,
      step4: `State the final result: ${currentVal} kcal is equal to ${formatted} calories.`,
      reverseStep1: `State the inverse formula: kilocalories = calories ÷ 1,000`,
      reverseStep2: `Substitute the calorie value: kilocalories = ${res.resultNumber} ÷ 1,000`,
      reverseStep3: `Perform the division: ${res.resultNumber} ÷ 1,000 = ${currentVal}`,
      reverseStep4: `Final reverse statement: ${res.resultNumber} calories is equal to ${currentVal} kcal.`
    };
  }

  // Linear standard conversion
  const factor = res.factor;
  const factorDisplay =
    typeof factor === 'number'
      ? factor < 0.0001 || factor > 10000
        ? factor.toExponential(4)
        : factor.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
      : '1';

  const reverseFactor = factor !== 0 ? 1 / (typeof factor === 'number' ? factor : 1) : 1;
  const reverseFactorDisplay =
    reverseFactor < 0.0001 || reverseFactor > 10000
      ? reverseFactor.toExponential(4)
      : reverseFactor.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');

  return {
    formulaText: `${toUnit.name.toLowerCase()} = ${fromUnit.name.toLowerCase()} × ${factorDisplay}`,
    reverseFormulaText: `${fromUnit.name.toLowerCase()} = ${toUnit.name.toLowerCase()} ÷ ${factorDisplay}`,
    sampleInput: currentVal,
    sampleResult: `${formatted} ${toUnit.symbol}`,
    reverseSampleInput: parseFloat(res.resultNumber.toFixed(4)),
    reverseSampleResult: `${currentVal} ${fromUnit.symbol}`,
    step1: `Identify the conversion factor: 1 ${fromUnit.name} = ${factorDisplay} ${toUnit.name}s.`,
    step2: `Substitute the value into the formula: ${currentVal} ${fromUnit.symbol} × ${factorDisplay}`,
    step3: `Perform the arithmetic multiplication: ${currentVal} × ${factorDisplay} = ${res.resultNumber.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}`,
    step4: `State the final converted value: ${currentVal} ${fromUnit.name} = ${formatted} ${toUnit.name} (${toUnit.symbol}).`,
    reverseStep1: `Identify the inverse conversion formula: Divide ${toUnit.name} by ${factorDisplay} (or multiply by ${reverseFactorDisplay}).`,
    reverseStep2: `Substitute the target value: ${formatted} ÷ ${factorDisplay}`,
    reverseStep3: `Compute the division: ${formatted} ÷ ${factorDisplay} = ${currentVal}`,
    reverseStep4: `Final reverse result: ${formatted} ${toUnit.symbol} = ${currentVal} ${fromUnit.symbol}.`
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
  const isKcalToCal = fromUnit.id === 'kcal' && toUnit.id === 'cal';
  const isCalToKcal = fromUnit.id === 'cal' && toUnit.id === 'kcal';

  // 1. From Unit Details
  const fromUnitDetail: UnitDetail = getUnitDetail(fromUnit, category);
  const toUnitDetail: UnitDetail = getUnitDetail(toUnit, category);

  // 2. Factor and formulas
  let exactFactor: number | string = '1';
  let factorText = '';
  let formula = '';
  let reverseFormula = '';
  let mentalMathTip = '';
  const commonMistakes: string[] = [];

  if (isKcalToCal) {
    exactFactor = '1000';
    factorText = '1 kilocalorie (kcal) = 1,000 calories (cal)';
    formula = 'calories = kilocalories × 1,000';
    reverseFormula = 'kilocalories = calories ÷ 1,000';
    mentalMathTip =
      'Simply multiply the kilocalories by 1,000 by shifting the decimal point three places to the right (e.g., 2.5 kcal = 2,500 cal).';
    commonMistakes.push(
      'Confusing the large "food Calorie" (capital "C", which is a kilocalorie) with the small gram calorie (lowercase "c").',
      'Assuming that 1 calorie on a nutritional food label equals 1 gram calorie—nutrition labels always cite kilocalories (Calories).',
      'Forgetting that 1 kcal is also equal to exactly 4,184 Joules (4.184 kJ).'
    );
  } else if (isCalToKcal) {
    exactFactor = '0.001';
    factorText = '1 calorie (cal) = 0.001 kilocalories (kcal)';
    formula = 'kilocalories = calories ÷ 1,000 (or cal × 0.001)';
    reverseFormula = 'calories = kilocalories × 1,000';
    mentalMathTip =
      'Divide by 1,000 by shifting the decimal point three places to the left (e.g., 500 cal = 0.5 kcal).';
    commonMistakes.push(
      'Mixing up calories (cal) and Calories (kcal). 1 food Calorie is 1,000 small calories.',
      'Treating calorie conversion factors differently across dietary and mechanical engineering contexts.'
    );
  } else if (isCmToIn) {
    exactFactor = '0.3937007874';
    factorText = '1 cm = 1 ÷ 2.54 in ≈ 0.393700787 in (exact: 1 in = 2.54 cm)';
    formula = 'inches = centimeters ÷ 2.54 (or cm × 0.3937008)';
    reverseFormula = 'centimeters = inches × 2.54';
    mentalMathTip =
      'Quick mental estimation: Multiply cm by 4 and drop the last digit (e.g. 20 cm × 4 = 80 → ~8 inches; actual 7.87 in), or divide by 2.5.';
    commonMistakes.push(
      'Using 2.5 instead of 2.54 for precision carpentry, which introduces a 1.6% compounding dimensional error.',
      'Confounding millimeter and centimeter decimal points (e.g. 15 mm is 1.5 cm, not 15 cm).',
      'Forgetting that 1 inch is legally defined as exactly 25.4 mm worldwide.'
    );
  } else if (isInToCm) {
    exactFactor = '2.54';
    factorText = '1 in = exactly 2.54 cm (defined by 1959 International Agreement)';
    formula = 'centimeters = inches × 2.54';
    reverseFormula = 'inches = centimeters ÷ 2.54';
    mentalMathTip =
      'Multiply by 2.5 and add a tiny sliver (e.g. 10 inches × 2.5 = 25 cm, actual is 25.4 cm).';
    commonMistakes.push(
      'Rounding 2.54 down to 2.5 prematurely in engineering calculations.',
      'Treating imperial fractions (like 5/8") as decimals incorrectly (5/8 = 0.625 inches).'
    );
  } else if (isKgToLb) {
    exactFactor = '2.2046226218';
    factorText = '1 kg ≈ 2.20462262 lb (exact definition: 1 lb = 0.45359237 kg)';
    formula = 'pounds = kilograms × 2.20462262';
    reverseFormula = 'kilograms = pounds ÷ 2.20462262';
    mentalMathTip =
      'Double the kilogram value and add 10% of that double. Example: 70 kg × 2 = 140; 140 + 14 = 154 lbs (exact is 154.32 lbs). Very fast and remarkably accurate within 0.2%!';
    commonMistakes.push(
      'Confusing mass (kg) with weight/force in non-standard gravity environments.',
      'Using 2.2 for large medical or aviation payloads, leading to safety margins being breached.'
    );
  } else if (isLbToKg) {
    exactFactor = '0.45359237';
    factorText = '1 lb = exactly 0.45359237 kg';
    formula = 'kilograms = pounds × 0.45359237';
    reverseFormula = 'pounds = kilograms ÷ 0.45359237';
    mentalMathTip =
      'Divide the pounds by 2, then subtract 10% of that result. Example: 200 lbs ÷ 2 = 100; 100 - 10 = 90 kg (exact is 90.7 kg).';
    commonMistakes.push(
      'Confusing Troy ounces/pounds (used in gold) with Avoirdupois pounds (commercial weight).'
    );
  } else if (isCToF) {
    exactFactor = '1.8 (+ 32)';
    factorText = '°F = (°C × 1.8) + 32';
    formula = '°F = (°C × 9/5) + 32';
    reverseFormula = '°C = (°F - 32) × 5/9';
    mentalMathTip =
      'Double the Celsius temperature, subtract 10%, and add 32. Example: 20°C × 2 = 40; 40 - 4 = 36; 36 + 32 = 68°F (exact room temp!).';
    commonMistakes.push(
      'Forgetting to add 32 after multiplying by 1.8.',
      'Assuming temperature intervals scale identically: a 1°C increase equals a 1.8°F increase.'
    );
  } else if (isFToC) {
    exactFactor = '0.555556 (- 32)';
    factorText = '°C = (°F - 32) × 5/9';
    formula = '°C = (°F - 32) × 5/9';
    reverseFormula = '°F = (°C × 9/5) + 32';
    mentalMathTip =
      'Subtract 30 and divide by 2 for everyday weather. Example: 70°F - 30 = 40; 40 ÷ 2 = 20°C (exact is 21.1°C).';
    commonMistakes.push(
      'Dividing before subtracting 32 (order of operations error).',
      'Forgetting that -40° is the exact intersection point where -40°C equals -40°F.'
    );
  } else if (isMToFt) {
    exactFactor = '3.280839895';
    factorText = '1 m ≈ 3.28084 ft (exact: 1 ft = 0.3048 m)';
    formula = 'feet = meters × 3.28084';
    reverseFormula = 'meters = feet × 0.3048';
    mentalMathTip =
      'Multiply meters by 3 and add 10%. Example: 5 meters × 3 = 15; 15 + 1.5 = 16.5 ft (actual 16.4 ft).';
    commonMistakes.push(
      'Confusing decimal feet (e.g. 5.5 ft) with feet and inches (5 ft 6 in, not 5 ft 5 in).'
    );
  } else if (isMphToKmh) {
    exactFactor = '1.609344';
    factorText = '1 mph = exactly 1.609344 km/h';
    formula = 'km/h = mph × 1.609344';
    reverseFormula = 'mph = km/h ÷ 1.609344';
    mentalMathTip =
      'Use Fibonacci pairs: 3 mph ≈ 5 km/h, 5 mph ≈ 8 km/h, 8 mph ≈ 13 km/h, 50 mph ≈ 80 km/h, 60 mph ≈ 100 km/h.';
    commonMistakes.push(
      'Confusing statute miles (1.609 km) with nautical miles per hour (knots, 1.852 km/h).'
    );
  } else {
    // Dynamic fallback for any other pair
    const res = convertValue(1, category.id, fromUnit.id, toUnit.id);
    exactFactor =
      typeof res.factor === 'number'
        ? res.factor.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
        : '1';
    factorText = `1 ${fromUnit.symbol} = ${exactFactor} ${toUnit.symbol}`;
    formula = `${toUnit.name.toLowerCase()} = ${fromUnit.name.toLowerCase()} × ${exactFactor}`;
    reverseFormula = `${fromUnit.name.toLowerCase()} = ${toUnit.name.toLowerCase()} ÷ ${exactFactor}`;
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

  // 5. Standards Citations
  const citations = getCitations(category);

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
    faqs,
    citations
  };
}

function getUnitDetail(unit: UnitDefinition, category: CategoryDefinition): UnitDetail {
  const id = unit.id;

  if (id === 'kcal') {
    return {
      name: 'Kilocalorie',
      symbol: 'kcal (or Cal / large calorie)',
      system: 'Non-SI Metric Metric Unit of Energy',
      whatIs:
        'A kilocalorie (symbol: kcal) is a unit of energy equal to 1,000 small calories or exactly 4,184 Joules (4.184 kJ). It is defined as the amount of heat energy required to raise the temperature of one kilogram of pure water by 1 degree Celsius at standard atmospheric pressure (from 14.5 °C to 15.5 °C).',
      history:
        'First introduced by French chemist Nicolas Clément in 1824 during lectures on heat engines. In nutrition, it became the standard measure of dietary food energy, where 1 kilocalorie is commonly designated with a capitalized "Calorie".',
      usage:
        'Universal standard for dietary nutrition facts labels, metabolic rate calculations (BMR/TDEE), human exercise caloric burn, and biochemical energy metabolism.',
      countries: 'Recognized globally; standard on food packages across the United States, EU, UK, Canada, and Asia.',
      standardOrg: 'BIPM SI Brochure & USDA FoodData Central / Codex Alimentarius',
      baseEquivalence: '1 kcal = 1,000 cal = 4,184 J = 3.9683 BTU'
    };
  }

  if (id === 'cal') {
    return {
      name: 'Calorie (Gram Calorie / Small Calorie)',
      symbol: 'cal (small calorie)',
      system: 'CGS / Metric Unit of Heat',
      whatIs:
        'A calorie (symbol: cal, often termed the small calorie or gram calorie) is a unit of thermal energy equal to approximately 4.184 Joules. It is defined as the quantity of heat required to raise the temperature of one gram of pure water by 1 degree Celsius.',
      history:
        'Coined from the Latin word "calor" (meaning heat). Standardized in physical chemistry during the 19th century and formally defined as the thermochemical calorie (4.184 J) by the US National Bureau of Standards in 1953.',
      usage:
        'Widely used in physics, chemistry thermochemistry laboratories, bomb calorimetry, and molecular thermodynamics.',
      countries: 'Used globally in chemistry and scientific education.',
      standardOrg: 'International Union of Pure and Applied Chemistry (IUPAC) & NIST',
      baseEquivalence: '1 cal = 0.001 kcal = 4.184 J = 0.003968 BTU'
    };
  }

  if (id === 'cm') {
    return {
      name: 'Centimeter',
      symbol: 'cm',
      system: 'International System of Units (SI Metric)',
      whatIs:
        'A centimeter is a decimal metric unit of length equal to one-hundredth of a meter (10⁻² m). It corresponds to the distance light travels in vacuum in 1/29,979,245,800 of a second.',
      history:
        'Originated during the French Revolution in the 1790s with the establishment of the metric system. It became the foundational unit of length in the CGS (centimeter-gram-second) system before MKS and SI standardizations.',
      usage:
        'Widely used in everyday life worldwide for height measurement, apparel sizing, interior dimensions, construction, biology, and school education.',
      countries: 'Used officially across 95%+ of nations worldwide (all countries except primary customary use in the US).',
      standardOrg: 'International Bureau of Weights and Measures (BIPM)',
      baseEquivalence: '1 cm = 0.01 m = 0.3937 in = 10 mm'
    };
  }

  if (id === 'in') {
    return {
      name: 'Inch',
      symbol: 'in (or ″)',
      system: 'Imperial & US Customary System',
      whatIs:
        'An inch is a non-metric unit of length equal to 1/12 of a foot and 1/36 of a yard. By international legal treaty, 1 inch is defined as exactly 25.4 millimeters (0.0254 meters).',
      history:
        'Historically derived from the Roman "uncia" (meaning "twelfth part") and traditionally associated with the width of a human thumb. Formalized in 1959 by the International Yard and Pound Agreement.',
      usage:
        'Standard unit for screen displays (TVs, laptops, smartphones), bicycle wheel sizing, lumber dimensions (2x4s), pipe fittings, fastener threads, and consumer goods.',
      countries:
        'Primary official usage in the United States, Liberia, and Myanmar; widely understood in the UK, Canada, and global consumer electronics.',
      standardOrg: 'NIST Handbook 44 & ANSI',
      baseEquivalence: '1 in = 2.54 cm = 25.4 mm = 1/12 ft'
    };
  }

  if (id === 'kg') {
    return {
      name: 'Kilogram',
      symbol: 'kg',
      system: 'SI Base Unit',
      whatIs:
        'The kilogram is the fundamental SI base unit of mass. Under the 2019 BIPM redefinition, it is defined by taking the fixed numerical value of the Planck constant h to be exactly 6.62607015 × 10⁻³⁴ J·s.',
      history:
        'Originally defined in 1795 as the mass of one liter of pure water at freezing. For over a century it was embodied by the physical Platinum-Iridium cylinder ("Le Grand K") kept in Sèvres, France, until physical constants replaced physical artifacts.',
      usage:
        'Global gold standard for commerce, medicine, aerospace, science, packaging, food logistics, and engineering.',
      countries: 'Universal global standard adopted by international treaty across every country.',
      standardOrg: 'BIPM & CGPM (General Conference on Weights and Measures)',
      baseEquivalence: '1 kg = 1,000 g = 2.20462 lb = 35.274 oz'
    };
  }

  if (id === 'lb') {
    return {
      name: 'Pound (Avoirdupois)',
      symbol: 'lb',
      system: 'Imperial & US Customary System',
      whatIs:
        'The avoirdupois pound is legally defined as exactly 0.45359237 kilograms. It is subdivided into 16 avoirdupois ounces or 7,000 grains.',
      history:
        'Descended from the Roman libra (hence the symbol "lb"). Standardized in England during the reign of Queen Elizabeth I to establish fair commerce for grain, wool, and butchery.',
      usage:
        'Body weight, culinary recipes, grocery produce, gym weights, shipping freight, and aircraft weight calculations in the United States.',
      countries: 'Primary use in the United States; colloquially used in the UK, Canada, and Caribbean nations.',
      standardOrg: 'NIST & UK National Physical Laboratory (NPL)',
      baseEquivalence: '1 lb = 0.45359237 kg = 16 oz = 453.592 g'
    };
  }

  if (id === 'c') {
    return {
      name: 'Degree Celsius',
      symbol: '°C',
      system: 'SI Derived Unit (Metric)',
      whatIs:
        'A metric temperature scale where 0 °C is the freezing point of water and 100 °C is the boiling point of water at standard atmospheric pressure (101.325 kPa).',
      history:
        'Conceived in 1742 by Swedish astronomer Anders Celsius. Originally inverted (0 was boiling, 100 was freezing), it was inverted to its modern form shortly after his death by Carl Linnaeus.',
      usage:
        'Weather reporting, medicine, cooking, scientific labs, refrigeration, and HVAC controls worldwide.',
      countries: 'Used by the entire world with the exception of the United States and several associated territories.',
      standardOrg: 'BIPM (SI Standard Scale)',
      baseEquivalence: '0 °C = 32 °F = 273.15 K'
    };
  }

  if (id === 'f') {
    return {
      name: 'Degree Fahrenheit',
      symbol: '°F',
      system: 'US Customary & Imperial System',
      whatIs:
        'A temperature scale where water freezes at 32 °F and boils at 212 °F, establishing a 180-degree interval between the phase changes of water at sea level.',
      history:
        'Proposed in 1724 by physicist Daniel Gabriel Fahrenheit. He calibrated 0 °F using an ice-salt brine, 32 °F as freezing water, and ~96 °F as healthy human body temperature.',
      usage:
        'Weather forecasting, residential heating/cooling, baking ovens, meat culinary temperatures, and industrial processes in the US.',
      countries:
        'United States, Bahamas, Cayman Islands, Palau, Federated States of Micronesia, and Marshall Islands.',
      standardOrg: 'NIST Special Publication 811',
      baseEquivalence: '32 °F = 0 °C = 273.15 K'
    };
  }

  // Generic fallback detail
  return {
    name: unit.name,
    symbol: unit.symbol,
    system:
      unit.system === 'metric'
        ? 'Metric System (SI)'
        : unit.system === 'imperial'
        ? 'Imperial System'
        : 'Standard Metrology',
    whatIs: `The ${unit.name} (${unit.symbol}) is a recognized unit in ${category.name.toLowerCase()} measurement with exact conversion factors defined against standard base units.`,
    history: `Developed and standardized through historical metrology agreements to maintain consistency across commerce, engineering, and science.`,
    usage: `Commonly employed in technical specifications, commercial exchanges, scientific measurement, and everyday quantification.`,
    countries:
      unit.system === 'metric'
        ? 'Standardized globally across metric jurisdictions.'
        : 'Used primarily in customary or specific technical industries.',
    standardOrg: 'NIST & International Metrology Guidelines',
    baseEquivalence: `Standard coherent factor defined against ${category.baseUnitId}`
  };
}

function getRealWorldExamples(
  category: CategoryDefinition,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition
): RealWorldExample[] {
  if (category.id === 'energy') {
    return [
      {
        title: 'Medium Banana',
        fromVal: 105,
        fromFormatted: '105 kcal (Calories)',
        toFormatted: '105,000 calories',
        description: 'Standard dietary nutrition label energy content of one fresh medium banana.',
        icon: 'nutrition'
      },
      {
        title: 'One Teaspoon of Pure Sugar',
        fromVal: 16,
        fromFormatted: '16 kcal (Calories)',
        toFormatted: '16,000 calories',
        description: 'Chemical energy stored in 4 grams of granulated sucrose.',
        icon: 'cookie'
      },
      {
        title: 'Daily Adult Recommended Intake',
        fromVal: 2000,
        fromFormatted: '2,000 kcal (Calories)',
        toFormatted: '2,000,000 calories',
        description: 'Standard FDA / USDA guideline for average daily adult metabolic energy maintenance.',
        icon: 'restaurant'
      },
      {
        title: 'One Mile of Moderate Running',
        fromVal: 100,
        fromFormatted: '100 kcal (Calories)',
        toFormatted: '100,000 calories',
        description: 'Approximate metabolic mechanical and thermal energy expended running 1 mile at 6 mph.',
        icon: 'directions_run'
      }
    ];
  }

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
        description:
          'ISO/IEC 7810 ID-1 standard dimensions for all global credit cards, debit cards, and driver licenses.',
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
        description:
          'Standard reference physiological mass used in pharmacology, aircraft seat loading, and elevators.',
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

  // Default benchmarks
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
  if (fromUnit.id === 'kcal' && toUnit.id === 'cal') {
    return [
      {
        q: 'How do you convert kilocalories (kcal) to calories (cal)?',
        a: 'To convert kilocalories to calories, multiply the number of kilocalories by 1,000. For example, to convert 5 kcal to calories: 5 × 1,000 = 5,000 calories.'
      },
      {
        q: 'Is a kilocalorie the same as a food Calorie?',
        a: 'Yes. In nutrition and on food labels, 1 "Calorie" (capitalized C) is equal to 1 kilocalorie (kcal), which equals 1,000 small gram calories (lowercase c). When you see 250 Calories on a snack label, it actually represents 250,000 small calories.'
      },
      {
        q: 'How do you convert calories to kilocalories in reverse?',
        a: 'To convert calories to kilocalories, divide the number of calories by 1,000. For example: 3,500 cal ÷ 1,000 = 3.5 kcal.'
      },
      {
        q: 'How many Joules are in 1 kilocalorie?',
        a: 'One thermochemical kilocalorie is defined as exactly 4,184 Joules (4.184 kilojoules). In the International System of Units (SI), the Joule is the standard coherent unit of energy, but kilocalories remain standard in dietary health.'
      },
      {
        q: 'Why do food labels use Calories instead of Joules in the US?',
        a: 'The United States FDA regulations mandate Calories (kilocalories) on Nutrition Facts labels due to historical dietary convention. In the European Union, Australia, and New Zealand, food labels list both Kilojoules (kJ) and Kilocalories (kcal).'
      }
    ];
  }

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
      q: `Why can results differ between approximate and exact converters?`,
      a: `Some basic converters use rounded shortcuts (e.g. rounding 2.54 to 2.5, or 2.20462 to 2.2). SolveIt Calculator calculates using exact standard definitions (e.g., 1 inch is defined as exactly 25.4 mm, and 1 pound is exactly 0.45359237 kg) to ensure scientific precision.`
    },
    {
      q: `How do I quickly estimate this conversion in my head?`,
      a: `For rapid everyday approximations without a calculator, you can use mental math rounding shortcuts. Look at the mental math tip provided in our breakdown above to estimate values instantly.`
    }
  ];
}

function getCitations(category: CategoryDefinition) {
  if (category.id === 'energy') {
    return [
      {
        title: 'NIST Special Publication 811: Energy Units, Joules & Thermochemical Calories',
        organization: 'National Institute of Standards and Technology (NIST)',
        linkText: 'NIST PML Energy Conversion Guide',
        url: 'https://www.nist.gov/pml/special-publication-811',
        sourceType: 'National Metrology Institute',
        description:
          'Authoritative US standard defining the exact 4.184 Joule thermochemical equivalence for kilocalories and nutritional energy factors.'
      },
      {
        title: 'USDA FoodData Central Nutritional Guidelines & Energy Conversion',
        organization: 'U.S. Department of Agriculture & FAO',
        linkText: 'USDA FoodData Central Database',
        url: 'https://fdc.nal.usda.gov',
        sourceType: 'Government Standards Agency',
        description:
          'Official nutritional databases providing standard caloric metrics and kilocalorie definitions for dietary assessment and food labeling.'
      },
      {
        title: 'BIPM SI Brochure: The Joule as the SI Derived Unit of Energy',
        organization: 'Bureau International des Poids et Mesures (BIPM)',
        linkText: 'BIPM Official SI Brochure',
        url: 'https://www.bipm.org/en/publications/si-brochure',
        sourceType: 'International Treaty Body',
        description:
          'Global treaty standard publication defining derived dimensional quantities of work, heat, and energy (J = kg·m²·s⁻²).'
      },
      {
        title: 'ISO 80000-5: Quantities and Units — Thermodynamics',
        organization: 'International Organization for Standardization (ISO)',
        linkText: 'ISO 80000-5 Thermodynamics Standard',
        url: 'https://www.iso.org/standard/64973.html',
        sourceType: 'Global Standards Body',
        description:
          'International standard harmonizing temperature scales, thermodynamic relations, and caloric conversions across engineering.'
      }
    ];
  }

  if (category.id === 'length') {
    return [
      {
        title: 'NIST Special Publication 811: Factors for Units of Length and Distance',
        organization: 'National Institute of Standards and Technology (NIST)',
        linkText: 'NIST PML Length Standards Guide',
        url: 'https://www.nist.gov/pml/special-publication-811',
        sourceType: 'National Metrology Institute',
        description:
          'Official US standard defining the exact international yard and pound agreement (1 inch = exactly 25.4 mm).'
      },
      {
        title: 'BIPM SI Brochure: Definition of the Metre via Speed of Light',
        organization: 'Bureau International des Poids et Mesures (BIPM)',
        linkText: 'BIPM SI Metre Definition',
        url: 'https://www.bipm.org/en/publications/si-brochure',
        sourceType: 'International Treaty Body',
        description:
          'Fundamental definition of the metre as the path length travelled by light in vacuum during 1/299,792,458 of a second.'
      },
      {
        title: 'ISO 80000-3: Space and Time Quantities & Distance Measurements',
        organization: 'International Organization for Standardization (ISO)',
        linkText: 'ISO 80000-3 Measurement Standard',
        url: 'https://www.iso.org/standard/64973.html',
        sourceType: 'Global Standards Body',
        description:
          'Worldwide engineering standard for symbols, decimal prefixes, and unit definitions across physical space and distance.'
      },
      {
        title: 'CODATA Recommended Values of the Fundamental Physical Constants',
        organization: 'Committee on Data for Science and Technology (CODATA)',
        linkText: 'CODATA Physical Constants',
        url: 'https://physics.nist.gov/cuu/Constants/',
        sourceType: 'International Scientific Union',
        description:
          'Internationally recommended physical constants including speed of light and universal distance relations.'
      }
    ];
  }

  return [
    {
      title: 'NIST Special Publication 811: Guide for the Use of the International System of Units (SI)',
      organization: 'National Institute of Standards and Technology (NIST)',
      linkText: 'NIST PML Official SI Publication',
      url: 'https://www.nist.gov/pml/special-publication-811',
      sourceType: 'National Metrology Institute',
      description:
        'Official United States government standard guide for metric and customary unit conversion factors, precision rules, and physical constants.'
    },
    {
      title: 'The International System of Units (SI Brochure, 9th Edition)',
      organization: 'Bureau International des Poids et Mesures (BIPM)',
      linkText: 'BIPM Official SI Brochure',
      url: 'https://www.bipm.org/en/publications/si-brochure',
      sourceType: 'International Treaty Body',
      description:
        'The foundational global treaty publication defining the 7 base SI units and coherent derived dimensions by the General Conference on Weights and Measures (CGPM).'
    },
    {
      title: 'ISO/IEC 80000 International Standard for Quantities and Units',
      organization: 'International Organization for Standardization (ISO)',
      linkText: 'ISO 80000 Series Reference',
      url: 'https://www.iso.org/standard/64973.html',
      sourceType: 'Global Standards Body',
      description:
        'Harmonized worldwide engineering and physical standards for symbols, mathematical signs, and dimensional quantities across physics and chemistry.'
    },
    {
      title: 'CODATA Internationally Recommended Values of Physical Constants',
      organization: 'National Institute of Standards and Technology & CODATA',
      linkText: 'NIST CODATA Constants Reference',
      url: 'https://physics.nist.gov/cuu/Constants/',
      sourceType: 'International Scientific Union',
      description:
        'Authoritative international reference for physical measurement calibration, atomic mass constants, and dimensional conversion ratios.'
    }
  ];
}
