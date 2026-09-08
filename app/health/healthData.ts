export interface HealthToolItem {
  id: string;
  name: string;
  sub: string;
  badge: string;
  desc: string;
  tag: string;
  goalIds: string[];
}

export interface HealthCategorySection {
  id: string;
  name: string;
  icon: string;
  desc: string;
  tools: HealthToolItem[];
}

export const HEALTH_GOALS = [
  { id: 'fat-loss', icon: '🔥', title: 'Lose Fat & Lean Down', count: '8 Tools', desc: 'Calculate sustainable deficits, preserve lean mass, and track true hydrostatic body fat percentages.', tags: ['Calorie Deficit', 'Navy Fat %', 'Macro Split'] },
  { id: 'muscle', icon: '💪', title: 'Build Strength & Muscle', count: '10 Tools', desc: 'Maximize hypertrophy with 1-Rep Max equations, lean mass indexing (FFMI), and protein thresholds.', tags: ['1-Rep Max', 'FFMI Index', 'Protein RDA'] },
  { id: 'cardio', icon: '❤️', title: 'Optimize Cardiovascular Health', count: '7 Tools', desc: 'Establish precise Karvonen aerobic baseline zones, mean arterial pressure, and VO2 max indices.', tags: ['Zone 2 Aerobic', 'MAP Blood Pressure', 'VO2 Max'] },
  { id: 'hydration', icon: '💧', title: 'Achieve Peak Hydration', count: '5 Tools', desc: 'Calculate dynamic fluid requirements factoring ambient temperature, sweat loss, and athletic exertion.', tags: ['Daily Water Needs', 'Sweat Loss Rate', 'Electrolytes'] },
  { id: 'sleep', icon: '😴', title: 'Master Sleep & Recovery', count: '6 Tools', desc: 'Sync bedtimes to natural 90-minute circadian ultradian cycles, eliminate sleep debt, and track HRV.', tags: ['90-Min REM Cycle', 'Sleep Debt', 'Wake-Up Time'] },
  { id: 'nutrition', icon: '🍎', title: 'Dial In Nutrition & Macros', count: '11 Tools', desc: 'Personalize grams per kilogram of protein, fat, and carbohydrates tailored to body recomposition.', tags: ['Keto Net Carbs', 'Carb Cycling', 'Protein RDA'] },
  { id: 'endurance', icon: '🏃', title: 'Enhance Endurance & Pace', count: '9 Tools', desc: 'Calculate marathon race paces, cycling wattage, MET energy expenditure, and lactate thresholds.', tags: ['Running Pace', 'Cycling FTP', 'METs Burn'] },
  { id: 'maternity', icon: '👶', title: 'Track Maternity & Family', count: '6 Tools', desc: 'Estimate clinical due dates with Naegele’s Rule, track trimesters, and pediatric growth percentiles.', tags: ['Due Date', 'Ovulation Window', 'Gestational Age'] },
  { id: 'longevity', icon: '🩺', title: 'Monitor Vital Longevity', count: '7 Tools', desc: 'Assess cardiovascular mortality risks using waist-to-height ratio, biological aging, and arterial MAP.', tags: ['Waist-to-Height', 'ABSI Index', 'Heart Recovery'] },
];

export const HEALTH_CATEGORIES: HealthCategorySection[] = [
  {
    id: 'body-tools',
    name: 'Body Composition & Anthropometry',
    icon: '🧍',
    desc: 'Validated clinical formulas for morphology, frame sizing, and fat-free tissue estimation.',
    tools: [
      { id: 'bmi', name: 'BMI Calculator (Standard & Asian)', sub: 'Quetelet Index', badge: 'Standard', desc: 'WHO standard cutoffs (18.5-24.9) and South Asian cutoffs (18.5-22.9).', tag: 'kg/m²', goalIds: ['fat-loss', 'longevity'] },
      { id: 'navy-fat', name: 'Navy Body Fat Calculator', sub: 'US Navy DoD', badge: 'Hydrostatic Proxy', desc: 'Circumference method for men and women without calipers.', tag: 'Fat %', goalIds: ['fat-loss', 'muscle'] },
      { id: 'ibw', name: 'Ideal Body Weight (IBW)', sub: 'Devine, Robinson, Hamwi', badge: 'Multi-Formula', desc: 'Side-by-side comparison of 4 clinical pharmacy dosing formulas.', tag: 'IBW kg', goalIds: ['fat-loss', 'longevity'] },
      { id: 'lbm', name: 'Lean Body Mass Calculator', sub: 'Boer & James Formula', badge: 'LBM', desc: 'Determine active tissue mass excluding stored triglycerides.', tag: 'LBM kg', goalIds: ['muscle', 'fat-loss'] },
      { id: 'ffmi', name: 'Fat-Free Mass Index (FFMI)', sub: 'Kouri et al. 1995', badge: 'Hypertrophy', desc: 'Normalize muscularity against height. Physiological natural limit threshold (25.0).', tag: 'FFMI', goalIds: ['muscle'] },
      { id: 'whr', name: 'Waist-to-Hip Ratio Calculator', sub: 'WHO Android/Gynoid', badge: 'WHR', desc: 'Determine visceral adiposity risk patterns for metabolic syndrome.', tag: 'WHR', goalIds: ['longevity', 'cardio'] },
      { id: 'whtr', name: 'Waist-to-Height Ratio (WHtR)', sub: 'Ashwell Curve', badge: 'WHtR', desc: 'Rule of thumb: Keep waist circumference less than half your height.', tag: 'WHtR', goalIds: ['longevity', 'fat-loss'] },
      { id: 'bsa', name: 'Body Surface Area (BSA)', sub: 'Du Bois & Mosteller', badge: 'Clinical m²', desc: 'Metric essential for medication clearance and cardiac output indexing.', tag: 'BSA m²', goalIds: ['longevity'] },
      { id: 'absi', name: 'A Body Shape Index (ABSI)', sub: 'Krakauer (PLoS ONE)', badge: 'Mortality Index', desc: 'Adjusts BMI for waist circumference to predict premature mortality.', tag: 'ABSI', goalIds: ['longevity'] },
    ]
  },
  {
    id: 'nutrition-tools',
    name: 'Nutrition, Macros & Metabolic Expenditure',
    icon: '🍎',
    desc: 'Calibrated thermogenesis equations, macro allocation, and energy balances.',
    tools: [
      { id: 'bmr', name: 'BMR Calculator (Mifflin & Harris)', sub: 'Mifflin-St Jeor', badge: 'Gold Standard', desc: 'Calculates basal energy requirements with gender and age coefficients.', tag: 'kcal/day', goalIds: ['fat-loss', 'nutrition'] },
      { id: 'tdee', name: 'TDEE Daily Calorie Calculator', sub: 'PAL Multipliers', badge: 'TDEE', desc: 'Factors in BMR, exercise volume, and non-exercise activity thermogenesis (NEAT).', tag: 'TDEE kcal', goalIds: ['fat-loss', 'muscle', 'nutrition'] },
      { id: 'deficit', name: 'Calorie Deficit & Surplus Planner', sub: 'Wishnofsky Rule', badge: 'Deficit / Surplus', desc: 'Simulate targeted fat reduction or hypercaloric muscular gains over 12 weeks.', tag: 'Planner', goalIds: ['fat-loss', 'muscle'] },
      { id: 'macro-split', name: 'Macronutrient Distribution Splitter', sub: '4:4:9 Caloric Split', badge: 'Custom Ratios', desc: 'Convert calorie goals into precise grams of protein, carbs, and dietary lipids.', tag: 'Macros g', goalIds: ['nutrition', 'muscle', 'fat-loss'] },
      { id: 'protein-rda', name: 'Protein RDA & Hypertrophy Calculator', sub: 'Morton et al. 2018', badge: '1.6 - 2.2 g/kg', desc: 'Compare baseline RDA (0.8g/kg) vs sports medicine resistance training targets.', tag: 'Protein g', goalIds: ['muscle', 'nutrition'] },
      { id: 'carb-cycling', name: 'Carbohydrate Cycling Calculator', sub: 'High / Low Day', badge: 'Glycogen Re-feed', desc: 'Sync higher carb days to heavy training and lower carb days to recovery rest.', tag: 'Carb Split', goalIds: ['nutrition', 'fat-loss'] },
      { id: 'keto', name: 'Keto Net Carb & Fat Matrix', sub: 'Ketogenic Ratio', badge: '<30g Net Carbs', desc: 'Formulate the classic 70/25/5 ketogenic macronutrient breakdown.', tag: 'Keto Net', goalIds: ['nutrition', 'fat-loss'] },
      { id: 'water-matrix', name: 'Water Intake Baseline & Exercise Matrix', sub: 'Dynamic Fluid', badge: 'EFSA / NASEM', desc: 'Adjusts fluid baseline for temperature, workout duration, and sweat rate.', tag: 'Liters/Day', goalIds: ['hydration'] },
      { id: 'velocity', name: 'Weight Loss Velocity Simulator', sub: 'Hall et al. NIH Model', badge: 'Velocity', desc: 'Non-linear metabolic adaptation curves for realistic body transformation.', tag: 'Simulation', goalIds: ['fat-loss'] },
    ]
  },
  {
    id: 'fitness-tools',
    name: 'Athletic Performance, Strength & Speed',
    icon: '🏋',
    desc: 'Kinematic benchmarks, submaximal strength conversions, and VO2 max proxies.',
    tools: [
      { id: '1rm', name: 'One Rep Max (1RM) Calculator', sub: 'Brzycki, Epley, Lander', badge: 'Submaximal 1RM', desc: 'Predict maximal lifting thresholds safely without testing to true mechanical failure.', tag: '1RM kg', goalIds: ['muscle'] },
      { id: 'mets', name: 'METs Calories Burned Calculator', sub: 'Compendium of Activities', badge: 'METs', desc: 'Translates 800+ physical activities into metabolic energy equivalents.', tag: 'METs kcal', goalIds: ['endurance', 'fat-loss'] },
      { id: 'running-pace', name: 'Running Pace & Marathon Splits', sub: 'Riegel\'s Power Law', badge: 'Splits', desc: 'Convert km/h to min/mile, 5K, 10K, half-marathon, and full-marathon projections.', tag: 'Pace/km', goalIds: ['endurance'] },
      { id: 'ftp', name: 'Cycling FTP & Power-to-Weight (W/kg)', sub: 'Coggan Power Zones', badge: 'Watts / FTP', desc: 'Determine 7 training power zones from 20-minute field test values.', tag: 'FTP W', goalIds: ['endurance'] },
      { id: 'vo2max', name: 'VO2 Max Test Estimator', sub: 'Cooper 12-Minute', badge: 'Cardio Fitness', desc: 'Field estimate for maximum rate of oxygen consumption during exercise.', tag: 'mL/kg/min', goalIds: ['cardio', 'endurance'] },
      { id: 'rucking', name: 'Hiking & Rucking Calorie Burn', sub: 'Pandolf Equation', badge: 'Incline & Pack', desc: 'Calculates metabolic load with graded terrain incline and pack weight.', tag: 'Burn kcal', goalIds: ['endurance', 'fat-loss'] },
    ]
  },
  {
    id: 'heart-tools',
    name: 'Cardiovascular Vitals & Hemodynamics',
    icon: '❤️',
    desc: 'Arterial pressures, recovery kinetics, and metabolic cardiac benchmarks.',
    tools: [
      { id: 'thr', name: 'Target Heart Rate Zones', sub: 'Karvonen Method', badge: 'Zone 1 to 5', desc: 'Calibrates training intensity against your true measured resting heart rate.', tag: 'Zones BPM', goalIds: ['cardio', 'endurance'] },
      { id: 'zone2', name: 'Zone 2 Aerobic Base Calculator', sub: 'Mitochondrial Health', badge: 'Lactate <2 mmol/L', desc: 'Optimizes mitochondrial density, fat oxidation, and metabolic flexibility.', tag: 'Zone 2 BPM', goalIds: ['cardio', 'endurance', 'fat-loss'] },
      { id: 'map', name: 'Mean Arterial Pressure (MAP)', sub: 'Perfusion Pressure', badge: '2/3 DBP + 1/3 SBP', desc: 'Calculates organ tissue perfusion pressure across one cardiac cycle.', tag: 'MAP mmHg', goalIds: ['cardio', 'longevity'] },
      { id: 'hrr', name: 'Heart Rate Recovery (HRR)', sub: 'Vagal Reactivation', badge: '1-Min & 2-Min', desc: 'Clinical marker of parasympathetic autonomic nervous system reactivation.', tag: 'Drop BPM', goalIds: ['cardio', 'longevity'] },
      { id: 'pulse-pressure', name: 'Pulse Pressure & Arterial Stiffness', sub: 'AHA Guidelines', badge: 'Pulse Pressure', desc: 'Evaluates the difference between systolic and diastolic arterial pressures.', tag: 'Δ mmHg', goalIds: ['cardio', 'longevity'] },
      { id: 'max-hr', name: 'Maximum Heart Rate (HR Max)', sub: 'Tanaka Formula', badge: '208 - (0.7 × Age)', desc: 'Replaces outdated 220 - Age with peer-reviewed modern regression models.', tag: 'HR Max', goalIds: ['cardio', 'endurance'] },
    ]
  },
  {
    id: 'sleep-tools',
    name: 'Sleep Architecture & Circadian Rhythm',
    icon: '😴',
    desc: 'Ultradian cycle planning, sleep debt balance, and recovery readiness.',
    tools: [
      { id: 'sleep-wake', name: 'Sleep Cycle Wake-Time Optimizer', sub: '90-Minute Ultradian', badge: 'Circadian Timing', desc: 'Calculate wake times aligned with the natural end of light NREM/REM sleep cycles.', tag: 'Bedtime', goalIds: ['sleep'] },
      { id: 'sleep-debt', name: 'Sleep Debt Accumulator & Repayment', sub: '14-Day Cumulative', badge: 'Sleep Debt', desc: 'Quantify accrued cognitive sleep loss and simulate safe recovery protocols.', tag: 'Debt Hours', goalIds: ['sleep'] },
      { id: 'ess', name: 'Daytime Sleepiness Scale (ESS)', sub: 'Epworth Score', badge: 'ESS Screening', desc: 'Standard clinical questionnaire assessing excessive daytime somnolence.', tag: 'Score /24', goalIds: ['sleep'] },
    ]
  },
  {
    id: 'maternity-tools',
    name: 'Pregnancy, Gestation & Family Planning',
    icon: '👶',
    desc: 'ACOG-standard clinical due date calculation, trimester trackers, and growth charts.',
    tools: [
      { id: 'due-date', name: 'Pregnancy Due Date Calculator', sub: 'Naegele\'s Rule', badge: 'ACOG Standard', desc: 'Calculate Estimated Date of Delivery (EDD) with customized menstrual cycle lengths.', tag: 'EDD Date', goalIds: ['maternity'] },
      { id: 'ovulation', name: 'Ovulation & Conception Window', sub: 'Luteal Phase (14-Day)', badge: 'Fertility Window', desc: 'Predict the 6-day fertile window to optimize conception or track cycles.', tag: 'Fertile Days', goalIds: ['maternity'] },
      { id: 'hcg', name: 'Beta hCG Doubling Time Calculator', sub: '48-72h Doubling Rate', badge: 'Early Gestation', desc: 'Evaluates serum quantitative hCG rise kinetics in early pregnancy.', tag: 'Doubling h', goalIds: ['maternity'] },
    ]
  }
];

export const HEALTH_FAQS = [
  {
    q: 'How accurate are these online health and fitness calculators?',
    a: 'All SolveIt calculators utilize equations with documented statistical confidence intervals published in medical literature. For instance, the Mifflin-St Jeor equation estimates resting metabolic rate within 10% of indirect calorimetry for over 82% of individuals, while the U.S. Navy circumference method correlates with hydrostatic weighing at r = 0.92. Individual biological variations in bone density, hormonal status, and genetic baseline will naturally apply.'
  },
  {
    q: 'Can these calculators diagnose metabolic conditions or heart disease?',
    a: 'No. Computational formulas provide population-calibrated estimates and educational models. They cannot substitute for direct medical diagnosis, blood panel assays, in-clinic electrocardiograms (ECGs), or cardiopulmonary exercise testing (CPET). Consult a licensed medical practitioner for diagnostic evaluations.'
  },
  {
    q: 'Which calculator should I start with for fat loss or muscle hypertrophy?',
    a: 'The foundational sequence starts with the TDEE Calorie Calculator to establish your maintenance energy intake. Then, use the Macro Splitter to guarantee adequate protein intake (1.6–2.2 g/kg of body weight) while setting an intentional 300–500 calorie deficit or surplus. To monitor tissue composition rather than just total scale weight, cross-reference progress using the Navy Body Fat Calculator and FFMI every 4 weeks.'
  },
  {
    q: 'Why does the Navy Body Fat method differ from DEXA scan results?',
    a: 'DEXA operates via dual-energy X-ray absorptiometry measuring bone mineral, lean mass, and regional adipose tissue. The Navy method uses anthropometric circumference proxies developed by Hodgdon and Beckett. While DEXA offers higher granular precision, the Navy equation tracks relative changes over time with exceptional consistency (typically within 3-4% variance).'
  },
  {
    q: 'Are my private health inputs (such as weight, cycle dates, or age) saved?',
    a: 'Never. Calculations execute entirely in your web browser via client-side JavaScript. No form values are ever transmitted to any database, analytics endpoint, or cloud server. When you close or refresh your tab, ephemeral inputs are instantly discarded.'
  }
];

export const HEALTH_EQUATIONS = [
  { name: 'Mifflin-St Jeor (BMR)', formula: 'Men: 10×W + 6.25×H - 5×A + 5\nWomen: 10×W + 6.25×H - 5×A - 161', note: '(W in kg, H in cm, A in years)' },
  { name: 'Karvonen Target Heart Rate', formula: 'THR = ((HR_max - HR_rest) × %Intensity) + HR_rest\nHR_max = 208 - (0.7 × Age)', note: '(Zone 2: 60% to 70% intensity)' },
  { name: 'Du Bois Body Surface Area (BSA)', formula: 'BSA = 0.007184 × W^0.425 × H^0.725', note: '(Result in m², validated for clinical dosing)' },
  { name: 'Brzycki 1-Repetition Max (1RM)', formula: '1RM = Weight / (1.0278 - (0.0278 × Reps))', note: '(Valid for repetitions < 10)' },
  { name: 'Mean Arterial Pressure (MAP)', formula: 'MAP = DBP + 1/3 (SBP - DBP)', note: '(Normal resting target: 70 - 100 mmHg)' },
  { name: 'Fat-Free Mass Index (FFMI)', formula: 'FFM = Weight × (1 - (BodyFat% / 100))\nFFMI = (FFM / (Height_m)²) + 6.1 × (1.8 - Height_m)', note: '(Normalized for stature)' },
];
