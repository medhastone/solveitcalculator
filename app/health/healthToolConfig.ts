export interface ToolMetadataConfig {
  id: string;
  slug: string;
  aliases: string[];
  name: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  categoryName: string;
  standard: string;
  formulaDisplay: string;
  formulaNote: string;
  units: 'metric_imperial' | 'metric_only' | 'time' | 'date' | 'score' | 'distance';
  primaryMetricLabel: string;
  primaryUnit: string;
  citation: string;
  defaultInputs: Record<string, number | string>;
  presets: { name: string; desc: string; values: Record<string, number | string> }[];
  faqs: { q: string; a: string }[];
  personas: { name: string; ageSex: string; stats: string; diagnosis: string; recommendation: string }[];
  limitations: { title: string; desc: string }[];
  relatedToolIds: string[];
}

export const HEALTH_TOOL_CONFIGS: Record<string, ToolMetadataConfig> = {
  'tdee': {
    id: 'tdee',
    slug: 'tdee',
    aliases: ['tdee-calculator', 'daily-calorie-calculator', 'macro-calculator'],
    name: 'TDEE & Daily Energy Expenditure Calculator',
    title: 'TDEE Daily Energy Expenditure & Calorie Calculator',
    shortDesc: 'Compute total daily caloric expenditure factoring basal metabolism (BMR) and physical activity levels (PAL).',
    fullDesc: 'Determine your exact daily maintenance calories, thermic effect of food (TEF), non-exercise activity thermogenesis (NEAT), and targeted caloric deficits or surpluses for fat loss and hypertrophy.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'Mifflin-St Jeor & WHO PAL Guidelines',
    formulaDisplay: 'TDEE = BMR × PAL (Physical Activity Level)\nBMR (Male) = 10W + 6.25H - 5A + 5\nBMR (Female) = 10W + 6.25H - 5A - 161',
    formulaNote: 'W = weight in kg, H = height in cm, A = age in years. Validated ±10% via indirect calorimetry.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Maintenance Energy',
    primaryUnit: 'kcal / day',
    citation: 'Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990.',
    defaultInputs: {
      gender: 'male',
      age: 28,
      heightCm: 178,
      weightKg: 75,
      activityLevel: 1.55,
      goal: 'maintain',
    },
    presets: [
      { name: 'Desk Worker (Sedentary)', desc: 'Office employee, minimal weekly deliberate exercise.', values: { gender: 'male', age: 32, heightCm: 176, weightKg: 80, activityLevel: 1.2, goal: 'maintain' } },
      { name: 'Cross-Training Athlete', desc: '4-5 intensive weekly resistance & HIIT training sessions.', values: { gender: 'female', age: 26, heightCm: 168, weightKg: 63, activityLevel: 1.725, goal: 'cut' } },
      { name: 'Lean Hypertrophy', desc: 'Targeted caloric surplus with dedicated progressive overload.', values: { gender: 'male', age: 24, heightCm: 182, weightKg: 78, activityLevel: 1.55, goal: 'bulk' } },
    ],
    faqs: [
      { q: 'What is Total Daily Energy Expenditure (TDEE)?', a: 'TDEE represents the total number of calories your body burns in a 24-hour cycle. It comprises Basal Metabolic Rate (BMR ~60-70%), Non-Exercise Activity Thermogenesis (NEAT ~15%), Exercise Activity Thermogenesis (EAT ~5-10%), and the Thermic Effect of Food (TEF ~10%).' },
      { q: 'How large should my calorie deficit be for fat loss?', a: 'Clinical sports nutrition guidelines suggest a moderate deficit of 300 to 500 kcal/day, resulting in ~0.5 to 1.0 lb (0.25 to 0.5 kg) of fat loss per week while preserving metabolically active skeletal muscle mass.' },
      { q: 'Why does weight loss plateau after several weeks?', a: 'Metabolic adaptation occurs as body mass decreases: BMR drops because a lighter body requires less energy to move, NEAT unconsciously declines, and mitochondrial efficiency increases. Recalibrating TDEE every 4–6 weeks is vital.' },
      { q: 'How does the calculator handle macronutrient splits?', a: 'Standard evidence-based distribution allocates protein at 1.8–2.2g per kg of total body mass, dietary fats at 25–30% of total calories to sustain hormonal function, with remaining calories assigned to complex carbohydrates for glycogen restoration.' }
    ],
    personas: [
      { name: 'David M.', ageSex: '34y Male', stats: '180cm, 86kg, PAL 1.375', diagnosis: 'Mild visceral adiposity, maintenance 2,460 kcal', recommendation: 'Initiate a 450 kcal deficit (2,010 kcal target) with 160g protein to retain lean muscle.' },
      { name: 'Sarah L.', ageSex: '29y Female', stats: '165cm, 58kg, PAL 1.725', diagnosis: 'High endurance runner, maintenance 2,280 kcal', recommendation: 'Maintain energy balance with high carbohydrate availability (300g/day) on 20km long-run training days.' },
    ],
    limitations: [
      { title: 'PAL Categorization Subjectivity', desc: 'Self-reported activity multipliers frequently suffer from overestimation by 15-20%.' },
      { title: 'Body Composition Blindspot', desc: 'Standard Mifflin equation uses total body weight rather than lean tissue mass, underestimating muscular athletes and overestimating individuals with elevated adiposity.' },
      { title: 'Adaptive Thermogenesis', desc: 'Does not account for down-regulated thyroid output during prolonged caloric restriction.' },
      { title: 'TEF Variance Across Diets', desc: 'Protein has a 20-30% thermic cost compared to 0-3% for dietary lipids, causing dietary composition variations.' }
    ],
    relatedToolIds: ['bmr', 'macro-split', 'deficit', 'navy-fat', 'protein-rda']
  },

  'bmr': {
    id: 'bmr',
    slug: 'bmr',
    aliases: ['bmr-calculator', 'basal-metabolic-rate', 'mifflin-st-jeor'],
    name: 'BMR Calculator (Mifflin-St Jeor & Harris-Benedict)',
    title: 'Basal Metabolic Rate (BMR) Clinical Suite',
    shortDesc: 'Compute baseline cellular energy expenditure at complete physical, digestive, and thermoneutral rest.',
    fullDesc: 'Evaluate your resting cellular energy requirements using the peer-reviewed Mifflin-St Jeor, Revised Harris-Benedict (1984), and Katch-McArdle equations to establish true metabolic baselines.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'Mifflin-St Jeor & Roza-Shizgal Harris-Benedict',
    formulaDisplay: 'Mifflin (M): 10W + 6.25H - 5A + 5\nMifflin (F): 10W + 6.25H - 5A - 161\nHarris-Benedict (M): 88.362 + 13.397W + 4.799H - 5.677A\nHarris-Benedict (F): 447.593 + 9.247W + 3.098H - 4.330A',
    formulaNote: 'W in kg, H in cm, A in years. Validated in clinical thermoneutral calorimeter chambers.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Basal Metabolic Rate',
    primaryUnit: 'kcal / 24h',
    citation: 'Roza AM, Shizgal HM. The Harris Benedict equation reevaluated. Am J Clin Nutr. 1984.',
    defaultInputs: {
      gender: 'male',
      age: 30,
      heightCm: 178,
      weightKg: 74,
    },
    presets: [
      { name: 'Average Adult Male', desc: '30-year-old male, 178cm, 74kg.', values: { gender: 'male', age: 30, heightCm: 178, weightKg: 74 } },
      { name: 'Average Adult Female', desc: '30-year-old female, 165cm, 62kg.', values: { gender: 'female', age: 30, heightCm: 165, weightKg: 62 } },
      { name: 'Senior Demographic', desc: '65-year-old male, 172cm, 70kg showing age-adjusted metabolic drop.', values: { gender: 'male', age: 65, heightCm: 172, weightKg: 70 } },
    ],
    faqs: [
      { q: 'What is the exact definition of Basal Metabolic Rate?', a: 'BMR is the amount of energy expended while at complete rest in a neutrally temperate environment, in the post-absorptive state (after 12 hours of fasting). It powers involuntary autonomic functions: cardiac pumping, respiration, cellular ion transport, and renal filtration.' },
      { q: 'Which equation is more accurate: Mifflin or Harris-Benedict?', a: 'The American Dietetic Association confirmed the Mifflin-St Jeor equation is the most accurate predictive formula, estimating within 10% of indirect calorimetry for over 82% of non-obese and obese subjects, whereas Harris-Benedict tends to overestimate BMR by ~5%.' },
      { q: 'Can you permanently damage your BMR by dieting?', a: 'No clinical evidence shows permanent metabolic damage. While adaptive thermogenesis can suppress metabolic rate by 10-15% during prolonged starvation, resting rate rebounds to predicted levels once adequate calories and body weight are restored.' }
    ],
    personas: [
      { name: 'Robert C.', ageSex: '48y Male', stats: '181cm, 92kg, Sedentary', diagnosis: 'BMR computed at 1,840 kcal/day.', recommendation: 'Ensure daily intake does not drop below BMR to avoid hormonal down-regulation and extreme muscle catabolism.' }
    ],
    limitations: [
      { title: 'Absence of Thyroid Screening', desc: 'Hypo- or hyper-thyroidism can shift true metabolic burn by 20–30% away from population formulas.' },
      { title: 'Genetic Heterogeneity', desc: 'Mitochondrial uncoupling protein (UCP1) density introduces natural variance among identical twin studies.' }
    ],
    relatedToolIds: ['tdee', 'deficit', 'macro-split', 'lbm']
  },

  'navy-fat': {
    id: 'navy-fat',
    slug: 'navy-fat',
    aliases: ['navy-body-fat-calculator', 'body-fat-calculator', 'navy-calculator'],
    name: 'U.S. Navy Body Fat Calculator',
    title: 'U.S. Department of Defense Body Fat Matrix',
    shortDesc: 'Calculate body fat percentage and lean tissue mass using standardized Department of Defense circumference anthropometry.',
    fullDesc: 'The gold standard field method developed by Hodgdon and Beckett for the U.S. Navy. Measures neck, waist, and hip circumferences to estimate hydrostatic body density without calipers or radiation.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'U.S. Navy Physical Readiness Test (PRT) Standard',
    formulaDisplay: 'Men: %BF = 495 / (1.0324 - 0.19077×log10(Waist - Neck) + 0.15456×log10(Height)) - 450\nWomen: %BF = 495 / (1.29579 - 0.35004×log10(Waist + Hip - Neck) + 0.22100×log10(Height)) - 450',
    formulaNote: 'Circumferences in centimeters. Logarithms to base 10. Correlates at r = 0.92 with underwater hydrostatic weighing.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Body Fat Percentage',
    primaryUnit: '% Fat',
    citation: 'Hodgdon JA, Beckett MB. Prediction of percent body fat for U.S. Navy men and women from body circumferences. Naval Health Research Center Report. 1984.',
    defaultInputs: {
      gender: 'male',
      heightCm: 178,
      weightKg: 76,
      waistCm: 82,
      neckCm: 38,
      hipCm: 96,
    },
    presets: [
      { name: 'Athletic Male', desc: 'Low abdominal circumference, developed neck.', values: { gender: 'male', heightCm: 180, weightKg: 78, waistCm: 79, neckCm: 40, hipCm: 94 } },
      { name: 'Fitness Female', desc: 'Toned midsection and healthy gynoid hip distribution.', values: { gender: 'female', heightCm: 167, weightKg: 61, waistCm: 70, neckCm: 33, hipCm: 96 } },
      { name: 'Average Civilian', desc: 'Standard population waist and neck dimensions.', values: { gender: 'male', heightCm: 175, weightKg: 84, waistCm: 92, neckCm: 38, hipCm: 102 } },
    ],
    faqs: [
      { q: 'Where exactly should tape measurements be taken?', a: 'Neck: measured below the larynx (Adam\'s apple) perpendicular to the long axis of the neck. Waist (Men): measured horizontally at the level of the navel. Waist (Women): measured at the narrowest point of natural waist. Hips (Women): measured at the maximal anterior-posterior protrusion of the gluteal muscles.' },
      { q: 'How does the Navy method compare to DEXA scans?', a: 'While DEXA provides 3-compartment regional breakdown (bone mineral, lean mass, fat mass), the Navy method tracks within 3.5% standard error of estimate. It avoids DEXA radiation exposure and eliminates bioelectrical impedance hydration noise.' },
      { q: 'What is considered healthy body fat percentage for adults?', a: 'For men: Essential fat is 2-5%, Athletes 6-13%, Fitness 14-17%, Acceptable 18-24%, Obesity >25%. For women: Essential fat is 10-13%, Athletes 14-20%, Fitness 21-24%, Acceptable 25-31%, Obesity >32%.' }
    ],
    personas: [
      { name: 'Marcus T.', ageSex: '31y Male', stats: '178cm, 76kg, Waist 81cm, Neck 39cm', diagnosis: 'Body fat: 13.6% (Fitness category). Lean mass: 65.7 kg.', recommendation: 'Caloric maintenance recommended. Preserves hormonal vitality and athletic power.' }
    ],
    limitations: [
      { title: 'Muscular Trapezius Inflation', desc: 'Large neck circumferences from heavy deadlifts artificially reduce computed body fat.' },
      { title: 'Subcutaneous vs. Visceral Inability', desc: 'Cannot differentiate deep visceral fat surrounding internal organs from subcutaneous adipose layers.' }
    ],
    relatedToolIds: ['bmi', 'lbm', 'ffmi', 'whtr', 'tdee']
  },

  'water-matrix': {
    id: 'water-matrix',
    slug: 'water-matrix',
    aliases: ['water-calculator', 'daily-water-intake', 'hydration-calculator'],
    name: 'Daily Water Intake & Hydration Matrix',
    title: 'Clinical Hydration & Daily Water Requirement Matrix',
    shortDesc: 'Calculate personalized fluid replenishment targets factoring body mass, workout duration, sweat rate, and environmental climate.',
    fullDesc: 'Based on European Food Safety Authority (EFSA) and National Academy of Sciences (NASEM) baseline standards, calculating physiological fluid homeostasis.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'EFSA & NASEM Dietary Reference Intakes for Water',
    formulaDisplay: 'Fluid Baseline = Body Mass (kg) × 35 mL/kg\n+ Exercise Sweat Allowance: (Training Mins / 30) × 350 mL\n+ Climate Factor: Temperate (1.0x), Hot/Humid (1.15x), Tropical/Arid (1.25x)',
    formulaNote: 'Adjusted for non-caffeinated baseline fluids. Metabolic water production contributes an additional ~300ml.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Total Daily Fluid',
    primaryUnit: 'Liters / Day',
    citation: 'European Food Safety Authority (EFSA) Scientific Opinion on Dietary Reference Values for water. EFSA Journal. 2010.',
    defaultInputs: {
      weightKg: 74,
      workoutMins: 45,
      climate: 'temperate',
    },
    presets: [
      { name: 'Active Professional', desc: '74kg individual with 45m evening gym workout.', values: { weightKg: 74, workoutMins: 45, climate: 'temperate' } },
      { name: 'Hot Weather Athlete', desc: 'Summer marathon runner training in warm climate.', values: { weightKg: 68, workoutMins: 90, climate: 'hot' } },
      { name: 'Sedentary Indoor', desc: 'Desk worker in air-conditioned office environment.', values: { weightKg: 82, workoutMins: 0, climate: 'temperate' } },
    ],
    faqs: [
      { q: 'Does coffee or tea count toward my hydration goal?', a: 'Yes. Peer-reviewed research confirms moderate caffeine consumption (under 400mg/day) exerts minimal diuretic effect in habituated adults, meaning tea and coffee contribute positively to total net hydration.' },
      { q: 'What are the symptoms of hyponatremia (water intoxication)?', a: 'Overconsuming excessive plain water without electrolytes during prolonged exertion dilutes plasma sodium below 135 mmol/L, causing nausea, headache, confusion, and in extreme cases, cerebral edema.' },
      { q: 'How should fluid intake be paced throughout the day?', a: 'Optimal absorption is capped at ~800 to 1,000 mL per hour. Sip 250–350 mL every 60–90 minutes upon waking until 2 hours before bedtime.' }
    ],
    personas: [
      { name: 'Elena R.', ageSex: '27y Female', stats: '62kg, 60m HIIT, Warm Climate', diagnosis: 'Required intake: 3.2 Liters/day (~108 fl oz).', recommendation: 'Consume 500ml pre-workout with 300mg sodium, sipping 750ml throughout high-intensity sessions.' }
    ],
    limitations: [
      { title: 'Individual Sweat Sodium Variations', desc: 'Sweat sodium concentration varies widely from 20 to 80 mmol/L among individuals.' },
      { title: 'Renal & Cardiac Considerations', desc: 'Patients with congestive heart failure or end-stage renal disease must adhere to physician-restricted fluid protocols.' }
    ],
    relatedToolIds: ['tdee', 'zone2', 'running-pace', 'rucking']
  },

  'zone2': {
    id: 'zone2',
    slug: 'zone2',
    aliases: ['zone-2-calculator', 'target-heart-rate', 'karvonen-calculator', 'aerobic-base'],
    name: 'Karvonen Zone 2 Aerobic Heart Rate Calculator',
    title: 'Zone 2 Aerobic Base & Karvonen Target Heart Rate Calculator',
    shortDesc: 'Pinpoint precise cardiovascular BPM training zones to maximize mitochondrial biogenesis, lactate clearance, and fat oxidation.',
    fullDesc: 'Employs the peer-reviewed Karvonen Heart Rate Reserve (HRR) methodology alongside the modernized Tanaka regression model (208 - 0.7 × Age) to define aerobic endurance boundaries.',
    category: 'heart-tools',
    categoryName: 'Cardiovascular Vitals & Hemodynamics',
    standard: 'Tanaka & Karvonen Exercise Physiology Standards',
    formulaDisplay: 'HR_max = 208 - (0.7 × Age)\nHRR = HR_max - HR_rest\nZone 2 Range = (HRR × 0.60 to 0.70) + HR_rest',
    formulaNote: 'Zone 2 corresponds to blood lactate concentrations under 2.0 mmol/L and maximal fat oxidation (FatMax).',
    units: 'metric_only',
    primaryMetricLabel: 'Zone 2 Target BPM',
    primaryUnit: 'BPM',
    citation: 'Tanaka H, Monahan KD, Seals DR. Age-predicted maximal heart rate revisited. J Am Coll Cardiol. 2001.',
    defaultInputs: {
      age: 32,
      rhr: 58,
    },
    presets: [
      { name: 'Well-Conditioned Athlete', desc: '30-year-old with low resting heart rate (48 BPM).', values: { age: 30, rhr: 48 } },
      { name: 'Recreational Fitness', desc: '35-year-old with average resting heart rate (65 BPM).', values: { age: 35, rhr: 65 } },
      { name: 'Master Runner', desc: '52-year-old maintaining strong aerobic foundation.', values: { age: 52, rhr: 54 } },
    ],
    faqs: [
      { q: 'What is Zone 2 training and why is it essential?', a: 'Zone 2 is the intensity where your Type I slow-twitch muscle fibers produce energy almost entirely through oxidative phosphorylation of fatty acids. It spurs mitochondrial biogenesis, enhances capillary density, and preserves glycogen stores.' },
      { q: 'What is the "Talk Test" for Zone 2?', a: 'If you can maintain a full conversational sentence without gasping, but your breathing is deep enough that a listener knows you are exercising, you are operating within Zone 2.' },
      { q: 'Why is the Karvonen method better than standard 220 - Age?', a: 'Standard formulas ignore individual resting fitness. A fit person with an RHR of 45 and an untrained person with an RHR of 80 have completely different cardiac reserves despite identical ages.' }
    ],
    personas: [
      { name: 'Lucas P.', ageSex: '32y Male', stats: 'RHR 56 BPM, HR Max 186 BPM', diagnosis: 'Zone 2 Target: 134 – 147 BPM.', recommendation: 'Perform 3 to 4 weekly sessions of 45–60 minutes in this exact window to double mitochondrial volume.' }
    ],
    limitations: [
      { title: 'Cardiac Drift', desc: 'As body temperature rises and dehydration sets in during long sessions, heart rate drifts upward 5-15 BPM at identical power outputs.' },
      { title: 'Beta-Blocker Interference', desc: 'Cardiovascular medications artificially depress peak heart rate, requiring RPE (Borg Scale) calibration instead.' }
    ],
    relatedToolIds: ['map', 'vo2max', 'max-hr', 'running-pace', 'hrr']
  },

  'sleep-wake': {
    id: 'sleep-wake',
    slug: 'sleep-wake',
    aliases: ['sleep-calculator', 'sleep-cycle-calculator', 'circadian-optimizer'],
    name: 'Circadian Sleep Cycle & REM Optimizer',
    title: 'Circadian 90-Minute Ultradian Sleep Cycle Calculator',
    shortDesc: 'Eliminate morning sleep inertia by timing wake-up alarms to coincide with the conclusion of natural 90-minute NREM-REM cycles.',
    fullDesc: 'Synchronizes bedtimes and alarms with the human ultradian biological clock. Accounts for the 14-minute average sleep latency period to ensure waking from restorative light NREM sleep.',
    category: 'sleep-tools',
    categoryName: 'Sleep Architecture & Circadian Rhythm',
    standard: 'AASM Ultradian NREM/REM Architecture',
    formulaDisplay: 'Optimal Wake Times = Bedtime + 14m Latency + (N × 90m Cycles)\nIdeal Rest = 5 Cycles (7h 30m) or 6 Cycles (9h 00m)\nSleep Inertia Threshold: Waking in Deep Slow-Wave N3 Sleep',
    formulaNote: 'Ultradian sleep cycles transition from N1 -> N2 -> N3 (Slow Wave) -> REM over approximately 90 to 110 minutes.',
    units: 'time',
    primaryMetricLabel: 'Optimal Alarm Time',
    primaryUnit: 'AM / PM',
    citation: 'Carskadon MA, Dement WC. Normal Human Sleep: An Overview. Principles and Practice of Sleep Medicine. 2011.',
    defaultInputs: {
      mode: 'wake',
      bedtime: '23:00',
      wakeTime: '07:00',
    },
    presets: [
      { name: 'Early Bird (7:00 AM Wake)', desc: 'Alarm fixed for 7:00 AM, plan ideal evening bedtime.', values: { mode: 'wake', wakeTime: '07:00', bedtime: '23:00' } },
      { name: 'Night Owl (11:30 PM Sleep)', desc: 'Going to bed at 11:30 PM, plan natural morning alarm.', values: { mode: 'sleep', bedtime: '23:30', wakeTime: '07:00' } },
    ],
    faqs: [
      { q: 'Why do I feel groggy even after sleeping 9 hours?', a: 'This phenomenon is called sleep inertia. It occurs when your alarm shocks your central nervous system awake while you are submerged in Stage 3 Delta slow-wave sleep. Waking at the boundary of a completed 90-minute cycle avoids this.' },
      { q: 'Is 6 hours (4 cycles) of sleep sufficient for adults?', a: 'While 6 hours completes 4 full cycles, clinical sleep research proves chronic restriction below 7 hours impairs cognitive speed, glucose clearance, and immune resilience over time.' },
      { q: 'What is sleep latency?', a: 'Sleep latency is the duration required to transition from full wakefulness to Stage 1 sleep. For healthy adults, the standard physiological average is 10 to 20 minutes (calibrated to 14m).' }
    ],
    personas: [
      { name: 'Hannah B.', ageSex: '25y Female', stats: 'Needs to wake at 6:30 AM for clinic rounds', diagnosis: 'Ideal bedtimes: 11:16 PM (5 cycles) or 9:46 PM (6 cycles).', recommendation: 'Power down blue light screens by 10:30 PM to facilitate endogenous melatonin surge.' }
    ],
    limitations: [
      { title: 'Ultradian Cycle Variability', desc: 'Cycles vary from 80 minutes in the early night to 120 minutes toward morning.' },
      { title: 'Micro-Arousals', desc: 'Spontaneous awakenings due to environmental noise or sleep apnea disrupt cycle synchronization.' }
    ],
    relatedToolIds: ['sleep-debt', 'ess', 'zone2']
  },

  'due-date': {
    id: 'due-date',
    slug: 'due-date',
    aliases: ['pregnancy-due-date-calculator', 'pregnancy-calculator', 'gestational-age'],
    name: 'Pregnancy Due Date & Gestational Age Calculator',
    title: 'ACOG Clinical Pregnancy Due Date & Trimester Milestone Calculator',
    shortDesc: 'Compute clinical Estimated Date of Delivery (EDD), current gestational week/day, and developmental milestones using Naegele’s rule.',
    fullDesc: 'Calibrated to American College of Obstetricians and Gynecologists (ACOG) obstetric standards. Supports Last Menstrual Period (LMP) with customized cycle lengths or exact conception dates.',
    category: 'maternity-tools',
    categoryName: 'Pregnancy, Gestation & Family Planning',
    standard: 'ACOG & FIGO Naegele’s Obstetric Rule',
    formulaDisplay: 'EDD = First Day of LMP + 1 Year - 3 Months + 7 Days + (Cycle Length - 28 Days)\nGestational Age = Days Elapsed since LMP / 7\nTotal Gestation = 280 Days (40 Weeks)',
    formulaNote: 'Adjusted for follicular phase variations. Ultrasound crown-rump length (CRL) in 1st trimester provides secondary clinical verification.',
    units: 'date',
    primaryMetricLabel: 'Estimated Due Date',
    primaryUnit: 'EDD Date',
    citation: 'American College of Obstetricians and Gynecologists. Method for estimating the due date. Committee Opinion No. 700. 2017.',
    defaultInputs: {
      lmpDate: '2026-01-15',
      cycleLength: 28,
    },
    presets: [
      { name: 'Standard 28-Day Cycle', desc: 'Classic 28-day menstrual cycle tracking from LMP.', values: { lmpDate: '2026-02-01', cycleLength: 28 } },
      { name: 'Long 32-Day Cycle', desc: 'Compensates for 4-day later ovulation phase.', values: { lmpDate: '2026-01-20', cycleLength: 32 } },
    ],
    faqs: [
      { q: 'How many babies are actually born on their exact due date?', a: 'Only about 4% to 5% of babies arrive precisely on their computed EDD. However, approximately 90% arrive within the broader normal delivery window between 37 weeks 0 days and 41 weeks 6 days.' },
      { q: 'What is the breakdown of the three pregnancy trimesters?', a: 'First Trimester: Week 1 through Week 13 (organogenesis and embryogenesis). Second Trimester: Week 14 through Week 27 (fetal growth and anatomy scan). Third Trimester: Week 28 through delivery (pulmonary surfactant maturation and adipose gain).' },
      { q: 'Why does gestational age start 2 weeks before conception?', a: 'Obstetric standard counts gestational age from the first day of the last normal menstrual period (LMP) because the onset of menses is an objective observable date, whereas exact fertilization timing varies.' }
    ],
    personas: [
      { name: 'Rachel G.', ageSex: '30y Primigravida', stats: 'LMP: Jan 10, 2026, 28-day cycle', diagnosis: 'Estimated Due Date: October 17, 2026.', recommendation: 'Schedule first trimester nuchal translucency and dating ultrasound between weeks 11 and 13.' }
    ],
    limitations: [
      { title: 'Menstrual Irregularity Noise', desc: 'Cycles varying by >5 days can introduce up to 10-day errors in Naegele estimations.' },
      { title: 'Superseded by First-Trimester Sonography', desc: 'A crown-rump length (CRL) measurement taken prior to 14 weeks is clinically preferred over LMP if discrepancy exceeds 7 days.' }
    ],
    relatedToolIds: ['ovulation', 'hcg', 'water-matrix']
  },

  '1rm': {
    id: '1rm',
    slug: '1rm',
    aliases: ['1rm-calculator', 'one-rep-max', 'one-rep-max-calculator'],
    name: 'One Repetition Maximum (1RM) Strength Calculator',
    title: 'One-Repetition Max (1RM) Clinical Strength Suite',
    shortDesc: 'Calculate maximal voluntary neuromuscular lifting capacity safely using Brzycki, Epley, and Lander submaximal equations.',
    fullDesc: 'Predict single-rep maximums across bench press, back squat, deadlift, and overhead press without the catastrophic injury risk of testing to true structural failure.',
    category: 'fitness-tools',
    categoryName: 'Athletic Performance, Strength & Speed',
    standard: 'NSCA & ACSM Submaximal Strength Prediction',
    formulaDisplay: 'Brzycki: 1RM = Weight / (1.0278 - 0.0278 × Reps)\nEpley: 1RM = Weight × (1 + 0.0333 × Reps)\nLander: 1RM = (100 × Weight) / (101.3 - 2.67123 × Reps)',
    formulaNote: 'Accurate when repetitions are between 2 and 10. Errors increase substantially beyond 10 repetitions.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Estimated 1-Rep Max',
    primaryUnit: 'kg / lbs',
    citation: 'Brzycki M. Strength testing: Predicting a one-rep max from reps-to-fatigue. JOHPERD. 1993.',
    defaultInputs: {
      liftWeight: 100,
      reps: 5,
    },
    presets: [
      { name: '5-Rep Heavy Squat', desc: '120kg for 5 clean repetitions.', values: { liftWeight: 120, reps: 5 } },
      { name: '8-Rep Hypertrophy Bench', desc: '80kg for 8 chest-to-bar repetitions.', values: { liftWeight: 80, reps: 8 } },
      { name: '3-Rep Heavy Deadlift', desc: '160kg for 3 explosive repetitions.', values: { liftWeight: 160, reps: 3 } },
    ],
    faqs: [
      { q: 'Why should lifters avoid testing actual 1-rep maximums frequently?', a: 'True maximal attempts place immense mechanical stress on tendons, ligaments, and the central nervous system (CNS), with acute failure risks (e.g. pectoral tears or disc herniations). Submaximal formulas provide 97% accuracy.' },
      { q: 'Which formula is best: Brzycki or Epley?', a: 'Epley tends to yield superior accuracy for higher repetition sets (6 to 10 reps) and explosive powerlifters, while Brzycki is recognized as the gold standard for strict lower-rep resistance sets (3 to 6 reps).' },
      { q: 'How should training percentages be used in periodization?', a: 'Hypertrophy: 65–75% of 1RM (8–12 reps). Strength: 80–90% of 1RM (3–5 reps). Peaking/Power: 90–95% of 1RM (1–2 reps).' }
    ],
    personas: [
      { name: 'Alex K.', ageSex: '26y Male Lifter', stats: 'Bench pressed 100kg for 6 reps', diagnosis: 'Estimated 1RM: 116.1 kg (Brzycki) / 120.0 kg (Epley).', recommendation: 'Program 4x4 working sets at 95kg (82% of 1RM) for progressive overload.' }
    ],
    limitations: [
      { title: 'High Repetition Breakdown', desc: 'Performing >12 repetitions measures muscular anaerobic endurance rather than neuromuscular maximal force.' },
      { title: 'Muscle Fiber Composition', desc: 'Athletes with high fast-twitch glycolytic motor units drop off more sharply across reps than slow-twitch dominant lifters.' }
    ],
    relatedToolIds: ['ffmi', 'protein-rda', 'mets', 'vo2max']
  },

  'macro-split': {
    id: 'macro-split',
    slug: 'macro-split',
    aliases: ['macro-calculator', 'macro-splitter', 'macronutrient-calculator'],
    name: 'Macronutrient Distribution Splitter',
    title: 'Macronutrient Distribution & Gram Allocator',
    shortDesc: 'Convert total caloric intake into grams of protein, carbohydrates, and dietary fats tailored to body composition goals.',
    fullDesc: 'Allocate grams of macronutrients utilizing the 4:4:9 caloric density rule (4 kcal/g protein, 4 kcal/g carbohydrate, 9 kcal/g dietary fat) for balanced, keto, or athletic splits.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'ISSN Sports Nutrition & USDA Dietary Guidelines',
    formulaDisplay: 'Protein (g) = (Total Calories × %Protein) / 4\nCarbs (g) = (Total Calories × %Carbs) / 4\nFats (g) = (Total Calories × %Fats) / 9',
    formulaNote: 'Total percentages must equal 100%. Protein supports tissue synthesis; fats support endocrine hormone production.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Daily Protein Target',
    primaryUnit: 'grams / day',
    citation: 'Kerksick CM, et al. ISSN exercise & sports nutrition review update: research & recommendations. J Int Soc Sports Nutr. 2018.',
    defaultInputs: {
      targetCalories: 2400,
      splitProfile: 'athletic',
      proteinPct: 30,
      carbPct: 40,
      fatPct: 30,
    },
    presets: [
      { name: 'Athletic Hypertrophy (30P / 40C / 30F)', desc: 'Optimal balance for strength athletes and active trainers.', values: { targetCalories: 2500, splitProfile: 'athletic', proteinPct: 30, carbPct: 40, fatPct: 30 } },
      { name: 'Low Carb Cutting (40P / 25C / 35F)', desc: 'High satiety for rapid body recomposition and fat loss.', values: { targetCalories: 2000, splitProfile: 'lowcarb', proteinPct: 40, carbPct: 25, fatPct: 35 } },
      { name: 'Endurance Carb Load (20P / 60C / 20F)', desc: 'Maximizes muscular glycogen storage for half & full marathons.', values: { targetCalories: 2800, splitProfile: 'endurance', proteinPct: 20, carbPct: 60, fatPct: 20 } },
    ],
    faqs: [
      { q: 'Why is protein set to 4 kcal/g while fat is 9 kcal/g?', a: 'Lipids are more energy-dense hydrocarbon molecules, yielding 9 calories of heat energy per gram when oxidized, whereas amino acids and carbohydrates yield approximately 4 calories per gram.' },
      { q: 'What happens if dietary fat drops too low (under 15%)?', a: 'Dietary fats provide essential fatty acids (omega-3 and omega-6) and are the biochemical precursor to steroid hormones including testosterone and estrogen. Diets under 20% fat frequently induce endocrine dysfunction.' },
      { q: 'Are carbs essential for human survival?', a: 'While technically non-essential because the liver can synthesize glucose via gluconeogenesis, carbohydrates remain the primary glycolytic fuel for high-intensity muscular contractions and cerebral performance.' }
    ],
    personas: [
      { name: 'Tyler V.', ageSex: '28y Male', stats: 'Goal: 2,200 kcal cutting diet', diagnosis: 'Macro allocation: 165g Protein (660 kcal), 220g Carbs (880 kcal), 73g Fat (660 kcal).', recommendation: 'Distribute protein evenly across 4 meals of 40g to optimize muscle protein synthesis.' }
    ],
    limitations: [
      { title: 'Fiber & Net Carbohydrates', desc: 'Does not separate non-fermentable insoluble dietary fiber from glycemic carbohydrates.' },
      { title: 'Amino Acid Quality', desc: 'Does not account for DIAAS (Digestible Indispensable Amino Acid Score) bioavailability differences between plant and animal protein.' }
    ],
    relatedToolIds: ['tdee', 'protein-rda', 'keto', 'carb-cycling']
  },

  'protein-rda': {
    id: 'protein-rda',
    slug: 'protein-rda',
    aliases: ['protein-calculator', 'protein-intake-calculator', 'protein-requirement'],
    name: 'Protein RDA & Hypertrophy Calculator',
    title: 'Protein RDA & Skeletal Muscle Hypertrophy Suite',
    shortDesc: 'Compare baseline RDA survival minimums against sports medicine resistance training targets for lean muscle preservation.',
    fullDesc: 'Evaluates the scientific continuum from the standard government Recommended Dietary Allowance (0.8 g/kg) to the contemporary meta-analyzed athletic hypertrophy range (1.6 to 2.2 g/kg).',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'Morton et al. 2018 Sports Medicine Meta-Analysis',
    formulaDisplay: 'Sedentary RDA = 0.8 g / kg Body Mass\nEndurance Athlete = 1.2 to 1.4 g / kg\nResistance Hypertrophy = 1.6 to 2.2 g / kg\nHypocaloric Deficit Retention = 2.2 to 2.6 g / kg',
    formulaNote: 'Exceeding 2.2 g/kg in energy balance demonstrates diminishing returns for muscle protein synthesis.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Optimal Hypertrophy Protein',
    primaryUnit: 'g / day',
    citation: 'Morton RW, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training adaptations. Br J Sports Med. 2018.',
    defaultInputs: {
      weightKg: 75,
      trainingType: 'resistance',
    },
    presets: [
      { name: '75kg Lifter Building Muscle', desc: 'Targeting 2.0 g/kg for optimal skeletal hypertrophy.', values: { weightKg: 75, trainingType: 'resistance' } },
      { name: '60kg Runner Maintaining', desc: 'Targeting 1.4 g/kg for endurance muscular repair.', values: { weightKg: 60, trainingType: 'endurance' } },
      { name: '85kg Cut Deficit Protection', desc: 'Targeting 2.4 g/kg to guard muscle during aggressive deficit.', values: { weightKg: 85, trainingType: 'deficit' } },
    ],
    faqs: [
      { q: 'Why is the RDA set so low at 0.8 g/kg?', a: 'The RDA was established by the Institute of Medicine to prevent protein deficiency and negative nitrogen balance in 97.5% of healthy sedentary adults. It was never designed to optimize athletic performance, strength, or muscle hypertrophy.' },
      { q: 'Can eating high protein damage healthy kidneys?', a: 'Extensive randomized clinical trials confirm high protein diets (up to 3.3 g/kg/day) cause no deleterious alterations in renal biomarkers, glomerular filtration rate (GFR), or liver function in adults with healthy baseline kidneys.' },
      { q: 'What is the "Leucine Trigger"?', a: 'Leucine is an essential branched-chain amino acid that activates the mTORC1 kinase pathway initiating Muscle Protein Synthesis (MPS). Consuming 2.5–3.5g of leucine per meal (~25–35g high-quality protein) triggers maximal MPS.' }
    ],
    personas: [
      { name: 'Julian B.', ageSex: '23y Male Athlete', stats: '78kg, Heavy progressive resistance training', diagnosis: 'Optimal daily protein intake: 156g (1.6g/kg) to 172g (2.2g/kg).', recommendation: 'Distribute into 4 meals of 40-45g protein spaced every 3.5 to 4 hours.' }
    ],
    limitations: [
      { title: 'Scaling in Severe Obesity', desc: 'Using total body weight in individuals with BMI >35 overestimates protein needs; basing on ideal body weight or lean body mass is preferred.' }
    ],
    relatedToolIds: ['macro-split', '1rm', 'ffmi', 'tdee']
  },

  'ibw': {
    id: 'ibw',
    slug: 'ibw',
    aliases: ['ideal-body-weight-calculator', 'ibw-calculator', 'ideal-weight'],
    name: 'Ideal Body Weight (IBW) Multi-Formula Comparison',
    title: 'Ideal Body Weight (IBW) & Clinical Pharmacy Comparison',
    shortDesc: 'Side-by-side comparison of the four foundational medical dosing formulas: Devine, Robinson, Hamwi, and Miller.',
    fullDesc: 'Clinical pharmacology relies on IBW to dose narrow-therapeutic-index drugs (such as aminoglycosides, theophylline, and propofol) to prevent toxic overexposure.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'Devine (1974), Robinson (1983), Hamwi (1964), Miller (1983)',
    formulaDisplay: 'Devine (Men): 50.0 kg + 2.3 kg per inch over 5 feet\nDevine (Women): 45.5 kg + 2.3 kg per inch over 5 feet\nHamwi (Men): 48.0 kg + 2.7 kg per inch over 5 feet\nHamwi (Women): 45.5 kg + 2.2 kg per inch over 5 feet',
    formulaNote: 'Adjusted Body Weight (ABW) = IBW + 0.4 × (Actual Weight - IBW) for BMI > 30.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Devine IBW',
    primaryUnit: 'kg',
    citation: 'Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974.',
    defaultInputs: {
      gender: 'male',
      heightCm: 178,
      actualWeightKg: 82,
    },
    presets: [
      { name: 'Male 5\'10" (178cm)', desc: 'Standard adult male stature comparison across all 4 models.', values: { gender: 'male', heightCm: 178, actualWeightKg: 82 } },
      { name: 'Female 5\'5" (165cm)', desc: 'Standard adult female stature comparison.', values: { gender: 'female', heightCm: 165, actualWeightKg: 64 } },
    ],
    faqs: [
      { q: 'Why was the Devine formula originally invented?', a: 'Dr. Ben Devine published the equation in 1974 to calculate appropriate dosages of the antibiotic gentamicin and theophylline in patients with renal failure. It was subsequently adopted internationally in pharmacokinetics.' },
      { q: 'What is Adjusted Body Weight (ABW)?', a: 'In patients who are clinically obese (actual weight > 120% of IBW), lipophilic and hydrophilic drugs distribute into adipose tissue at approximately 40% the density of lean mass. ABW incorporates this correction.' }
    ],
    personas: [
      { name: 'Gregory S.', ageSex: '45y Male', stats: '183cm (6\'0"), Actual weight 94kg', diagnosis: 'Devine IBW: 77.6 kg. Robinson: 76.5 kg. Hamwi: 80.4 kg.', recommendation: 'Clinical dosing should use Adjusted Body Weight of 84.2 kg for aminoglycoside clearance.' }
    ],
    limitations: [
      { title: 'Arbitrary 5-Foot Baseline', desc: 'Formulas function poorly for adults under 5 feet (152cm) tall due to negative scaling.' }
    ],
    relatedToolIds: ['bmi', 'lbm', 'bsa', 'ffmi']
  },

  'lbm': {
    id: 'lbm',
    slug: 'lbm',
    aliases: ['lean-body-mass-calculator', 'lbm-calculator', 'lean-mass'],
    name: 'Lean Body Mass (LBM) Calculator',
    title: 'Lean Body Mass (LBM) Boer & James Clinical Matrix',
    shortDesc: 'Compute total active structural tissue weight excluding stored triglyceride adipose mass.',
    fullDesc: 'Evaluate functional somatic mass (skeletal muscle, organs, bones, blood volume) using the validated Boer (1984), James (1976), and Hume (1966) equations.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'Boer & James Pharmacological Standards',
    formulaDisplay: 'Boer (M): 0.407W + 0.267H - 19.2\nBoer (F): 0.252W + 0.473H - 48.3\nJames (M): 1.1W - 128 × (W / H)²\nJames (F): 1.07W - 148 × (W / H)²',
    formulaNote: 'W in kg, H in cm. High clinical utility for chemotherapy dosage and anaesthesia infusion.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Boer Lean Mass',
    primaryUnit: 'kg LBM',
    citation: 'Boer P. Estimated lean body mass as an index for normalization of body fluid volumes in man. Am J Physiol. 1984.',
    defaultInputs: {
      gender: 'male',
      heightCm: 178,
      weightKg: 78,
    },
    presets: [
      { name: 'Average Male (178cm, 78kg)', desc: 'Standard adult male body structure.', values: { gender: 'male', heightCm: 178, weightKg: 78 } },
      { name: 'Athletic Female (168cm, 62kg)', desc: 'High muscle mass ratio.', values: { gender: 'female', heightCm: 168, weightKg: 62 } },
    ],
    faqs: [
      { q: 'How does LBM differ from Fat-Free Mass (FFM)?', a: 'Lean Body Mass includes essential lipids in cell membranes, the central nervous system, and bone marrow (~3-5% of body weight in men, ~8-12% in women). Fat-Free Mass strictly excludes all lipids.' },
      { q: 'Why is LBM important for metabolic health?', a: 'Skeletal muscle and liver tissue account for over 70% of resting glucose disposal and basal thermogenesis. Higher LBM guarantees higher insulin sensitivity.' }
    ],
    personas: [
      { name: 'Kevin D.', ageSex: '30y Male', stats: '180cm, 82kg', diagnosis: 'Boer LBM: 62.2 kg. James LBM: 63.6 kg. Estimated fat mass: 19.8 kg.', recommendation: 'Focus on progressive overload resistance training to expand active lean tissue.' }
    ],
    limitations: [
      { title: 'Extreme Body Builder Distortion', desc: 'James formula can paradoxically yield declining LBM values at very high body weights in muscular athletes.' }
    ],
    relatedToolIds: ['ffmi', 'navy-fat', 'ibw', 'bmi']
  },

  'ffmi': {
    id: 'ffmi',
    slug: 'ffmi',
    aliases: ['ffmi-calculator', 'fat-free-mass-index'],
    name: 'Fat-Free Mass Index (FFMI) & Natural Genetic Ceiling',
    title: 'Fat-Free Mass Index (FFMI) & Muscularity Index',
    shortDesc: 'Normalize muscularity against stature to benchmark physiological muscular development against the natural genetic ceiling.',
    fullDesc: 'Developed by Kouri et al. (1995) comparing natural lifters against anabolic steroid users. Features the height-normalized adjustment factor to evaluate true muscular density.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'Kouri et al. (1995) Harvard Medical School Study',
    formulaDisplay: 'FFM = Weight × (1 - (BodyFat% / 100))\nFFMI = FFM / (Height_m)²\nNormalized FFMI = FFMI + 6.1 × (1.8 - Height_m)',
    formulaNote: 'Natural baseline: 18-20 (Average), 21-22 (Above Average), 23-25 (Top Tier Natural), >25 (Unlikely Natural without PEDs).',
    units: 'metric_imperial',
    primaryMetricLabel: 'Normalized FFMI',
    primaryUnit: 'kg/m²',
    citation: 'Kouri EM, et al. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med. 1995.',
    defaultInputs: {
      heightCm: 178,
      weightKg: 80,
      bodyFatPct: 14,
    },
    presets: [
      { name: 'Elite Natural Lifter', desc: '178cm, 82kg at 11% body fat (near natural limit).', values: { heightCm: 178, weightKg: 82, bodyFatPct: 11 } },
      { name: 'Recreational Trainer', desc: '175cm, 78kg at 16% body fat.', values: { heightCm: 175, weightKg: 78, bodyFatPct: 16 } },
      { name: 'Untrained Adult', desc: '180cm, 80kg at 22% body fat.', values: { heightCm: 180, weightKg: 80, bodyFatPct: 22 } },
    ],
    faqs: [
      { q: 'What is the natural genetic ceiling of FFMI?', a: 'In the landmark Kouri et al. study of 83 pre-steroid era Mr. America winners (1939–1959) and contemporary natural athletes, the maximum normalized FFMI achieved naturally had a mean of 21.8 and a soft ceiling of 25.0.' },
      { q: 'Why is standard FFMI adjusted for height?', a: 'Taller individuals naturally carry greater absolute fat-free mass per square meter of height due to 3D volumetric scaling. The Kouri normalized equation levels the playing field to 1.8 meters (5\'11").' }
    ],
    personas: [
      { name: 'Sean M.', ageSex: '27y Male Lifter', stats: '178cm, 80kg, 13% body fat', diagnosis: 'FFM: 69.6 kg. Normalized FFMI: 22.1 kg/m² (Excellent natural muscularity).', recommendation: 'Approaching optimal drug-free muscular potential. Continued gains will require refined micro-periodization.' }
    ],
    limitations: [
      { title: 'Body Fat Percentage Dependency', desc: 'Requires highly accurate body fat inputs; a 3% error in body fat estimation shifts FFMI by nearly 1.0 unit.' }
    ],
    relatedToolIds: ['navy-fat', 'lbm', '1rm', 'protein-rda']
  },

  'whtr': {
    id: 'whtr',
    slug: 'whtr',
    aliases: ['waist-to-height-ratio-calculator', 'whtr-calculator', 'ashwell-curve'],
    name: 'Waist-to-Height Ratio (WHtR) & Cardiometabolic Risk',
    title: 'Waist-to-Height Ratio (WHtR) & Ashwell Shape Chart',
    shortDesc: 'Evaluate central visceral adiposity and cardiovascular mortality risks with the Ashwell clinical rule: keep waist < half height.',
    fullDesc: 'Supported by NICE (National Institute for Health and Care Excellence) guidelines. Demonstrates superior diagnostic sensitivity over BMI for early detection of Type 2 diabetes and hypertension.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'Ashwell Shape Chart & UK NICE Clinical Guidelines',
    formulaDisplay: 'WHtR = Waist Circumference / Stature Height\nBoundary: < 0.40 (Underweight), 0.40 - 0.49 (Healthy), 0.50 - 0.59 (Increased Risk), ≥ 0.60 (Very High Risk)',
    formulaNote: 'Both waist and height must be measured in identical units (cm or inches).',
    units: 'metric_imperial',
    primaryMetricLabel: 'Waist-to-Height Ratio',
    primaryUnit: 'Ratio',
    citation: 'Ashwell M, Gibson S. Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk factors. Obes Rev. 2012.',
    defaultInputs: {
      waistCm: 82,
      heightCm: 178,
    },
    presets: [
      { name: 'Healthy Waist (WHtR 0.46)', desc: '178cm height with 82cm waist.', values: { waistCm: 82, heightCm: 178 } },
      { name: 'Borderline Risk (WHtR 0.52)', desc: '170cm height with 88cm waist.', values: { waistCm: 88, heightCm: 170 } },
      { name: 'Elevated Cardiometabolic Risk', desc: '175cm height with 108cm waist.', values: { waistCm: 108, heightCm: 175 } },
    ],
    faqs: [
      { q: 'Why does NICE recommend WHtR over BMI?', a: 'BMI fails to differentiate between subcutaneous thigh/arm mass and intra-abdominal visceral fat packed around the liver, pancreas, and mesenteric vessels. WHtR directly targets ectopic visceral fat.' },
      { q: 'What is the universal public health message?', a: '"Keep your waist circumference to less than half your height." This single rule applies across all ethnicities, sexes, and age groups.' }
    ],
    personas: [
      { name: 'Brian C.', ageSex: '42y Male', stats: '176cm, Waist 94cm', diagnosis: 'WHtR: 0.534 (Increased Cardiometabolic Risk threshold exceeded).', recommendation: 'Target a 7cm reduction in waist circumference to return within the safe <0.50 envelope.' }
    ],
    limitations: [
      { title: 'Post-Prandial Abdominal Distension', desc: 'Waist measurements taken after meals or with bloating can distort ratio by 0.02-0.03.' }
    ],
    relatedToolIds: ['whr', 'bmi', 'absi', 'map']
  },

  'running-pace': {
    id: 'running-pace',
    slug: 'running-pace',
    aliases: ['running-pace-calculator', 'pace-calculator', 'marathon-pace-calculator'],
    name: 'Running Pace, Speed & Marathon Split Calculator',
    title: 'Running Pace, Speed & Riegel Marathon Splits',
    shortDesc: 'Convert distances and finishing times into precise min/km, min/mile, and forecast 5K, 10K, Half, and Full marathon splits.',
    fullDesc: 'Features Pete Riegel’s famous aerobic fatigue power law: T2 = T1 × (D2 / D1)^1.06 to project race finishing times from short-distance benchmarks.',
    category: 'fitness-tools',
    categoryName: 'Athletic Performance, Strength & Speed',
    standard: 'Riegel’s Power Law & World Athletics Standards',
    formulaDisplay: 'Pace (min/km) = Time (min) / Distance (km)\nSpeed (km/h) = Distance (km) / (Time (min) / 60)\nRiegel Projection: T2 = T1 × (D2 / D1)^1.06',
    formulaNote: 'Riegel exponent 1.06 applies to well-trained endurance runners across aerobic distances.',
    units: 'distance',
    primaryMetricLabel: 'Pace per Kilometer',
    primaryUnit: 'min / km',
    citation: 'Riegel PS. Athletic records and human endurance. American Scientist. 1981.',
    defaultInputs: {
      distanceKm: 10,
      hours: 0,
      minutes: 48,
      seconds: 0,
    },
    presets: [
      { name: '10K in 48 Minutes', desc: 'Solid recreational benchmark pace (4:48/km).', values: { distanceKm: 10, hours: 0, minutes: 48, seconds: 0 } },
      { name: 'Sub-4 Marathon Attempt', desc: '42.195 km targeting 3 hours 58 minutes.', values: { distanceKm: 42.195, hours: 3, minutes: 58, seconds: 0 } },
      { name: 'Sub-20 5K Effort', desc: '5 km in 19 minutes 30 seconds (3:54/km pace).', values: { distanceKm: 5, hours: 0, minutes: 19, seconds: 30 } },
    ],
    faqs: [
      { q: 'What is a good marathon pace for a first-time runner?', a: 'The global average marathon finish time is approximately 4 hours 30 minutes, translating to an average pace of 6:24 min/km (10:18 min/mile).' },
      { q: 'How does Riegel\'s formula predict marathon time from a 5K?', a: 'The formula applies a fatigue coefficient of 1.06. However, if an athlete lacks sufficient weekly mileage (<60km/week), glycogen depletion ("the wall" at 30km) will cause actual finish times to be 5-10% slower.' }
    ],
    personas: [
      { name: 'Claire N.', ageSex: '31y Female Runner', stats: 'Recent 10K time: 46:30 (4:39/km pace)', diagnosis: 'Projected Half Marathon: 1:43:15. Projected Marathon: 3:34:40.', recommendation: 'Establish long run training pace between 5:15 and 5:30 min/km in aerobic Zone 2.' }
    ],
    limitations: [
      { title: 'Elevated Weather & Incline', desc: 'Does not model headwinds, heat index humidity, or hilly course elevation profiles.' }
    ],
    relatedToolIds: ['vo2max', 'zone2', 'water-matrix', 'mets']
  },

  'vo2max': {
    id: 'vo2max',
    slug: 'vo2max',
    aliases: ['vo2max-calculator', 'vo2-max-calculator', 'cooper-test'],
    name: 'VO2 Max Cardiorespiratory Fitness Estimator',
    title: 'VO2 Max Aerobic Capacity & Cooper Test Estimator',
    shortDesc: 'Estimate maximal oxygen uptake (mL/kg/min) using the Cooper 12-minute run or resting heart rate ratio formulas.',
    fullDesc: 'VO2 Max is the single strongest clinical predictor of all-cause and cardiovascular mortality. Employs Dr. Kenneth Cooper’s standardized field test and the Uth-Sørensen heart rate ratio method.',
    category: 'fitness-tools',
    categoryName: 'Athletic Performance, Strength & Speed',
    standard: 'Cooper 12-Minute Test & Uth-Sørensen HR Ratio',
    formulaDisplay: 'Cooper: VO2 Max = (Distance_meters - 504.9) / 44.73\nUth-Sørensen Ratio: VO2 Max = 15.3 × (HR_max / HR_rest)\nTanaka HR_max: 208 - (0.7 × Age)',
    formulaNote: 'Values expressed in mL of oxygen consumed per kilogram of body mass per minute.',
    units: 'metric_only',
    primaryMetricLabel: 'Estimated VO2 Max',
    primaryUnit: 'mL/kg/min',
    citation: 'Cooper KH. A means of assessing maximal oxygen intake. JAMA. 1968.',
    defaultInputs: {
      method: 'cooper',
      cooperDistanceMeters: 2600,
      age: 28,
      rhr: 56,
    },
    presets: [
      { name: 'Cooper Test (2,600m in 12m)', desc: 'Fit recreational runner achieving 6.5 laps on track.', values: { method: 'cooper', cooperDistanceMeters: 2600, age: 28, rhr: 56 } },
      { name: 'Elite Endurance (3,200m in 12m)', desc: '8 track laps in 12 minutes (sub-6 min/mile).', values: { method: 'cooper', cooperDistanceMeters: 3200, age: 25, rhr: 44 } },
      { name: 'Heart Rate Ratio Method', desc: 'RHR 52, Age 32 estimation.', values: { method: 'rhr', cooperDistanceMeters: 2400, age: 32, rhr: 52 } },
    ],
    faqs: [
      { q: 'Why is VO2 Max so critical for longevity?', a: 'Seminal research from the Cleveland Clinic demonstrates moving from the lowest cardiorespiratory fitness quartile to the highest elite quartile is associated with a 5-fold reduction in all-cause mortality risk—greater than eliminating smoking, coronary artery disease, or hypertension.' },
      { q: 'What are normal VO2 Max values by age?', a: 'For 30-year-old men: Poor <35, Average 39-43, Good 44-51, Superior >52. For 30-year-old women: Poor <29, Average 33-37, Good 38-45, Superior >46.' }
    ],
    personas: [
      { name: 'Eric J.', ageSex: '29y Male', stats: 'Ran 2,750m in Cooper 12-minute field test', diagnosis: 'Estimated VO2 Max: 50.2 mL/kg/min (Top 15th percentile for age).', recommendation: 'Incorporate one weekly 4x4-minute Norwegian interval session (90-95% HR Max) to push past 55 mL/kg/min.' }
    ],
    limitations: [
      { title: 'Submaximal Pacing Error', desc: 'Poor pacing during the 12-minute run understates true physiological aerobic capacity.' }
    ],
    relatedToolIds: ['zone2', 'running-pace', 'map', 'hrr']
  },

  'map': {
    id: 'map',
    slug: 'map',
    aliases: ['map-calculator', 'mean-arterial-pressure', 'blood-pressure-calculator'],
    name: 'Mean Arterial Pressure (MAP) & Perfusion Suite',
    title: 'Mean Arterial Pressure (MAP) & Organ Perfusion Calculator',
    shortDesc: 'Compute average organ perfusion pressure across a complete cardiac cycle from systolic and diastolic blood pressure readings.',
    fullDesc: 'Crucial clinical vital sign used in intensive care, cardiology, and emergency medicine to ensure adequate perfusion to vital organs (brain, kidneys, and myocardium).',
    category: 'heart-tools',
    categoryName: 'Cardiovascular Vitals & Hemodynamics',
    standard: 'AHA / ACC Hemodynamic Perfusion Guidelines',
    formulaDisplay: 'MAP = DBP + 1/3 (SBP - DBP)\nPulse Pressure (PP) = SBP - DBP\nTarget Resting Range: 70 to 100 mmHg\nCritical Hypoperfusion Threshold: < 60 mmHg',
    formulaNote: 'Diastole accounts for approximately two-thirds of the resting cardiac cycle time.',
    units: 'metric_only',
    primaryMetricLabel: 'Mean Arterial Pressure',
    primaryUnit: 'mmHg',
    citation: 'Whelton PK, et al. 2017 ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults. J Am Coll Cardiol. 2018.',
    defaultInputs: {
      sbp: 120,
      dbp: 80,
      hr: 70,
    },
    presets: [
      { name: 'Normal Optimal (120/80)', desc: 'Standard clinical baseline.', values: { sbp: 120, dbp: 80, hr: 70 } },
      { name: 'Stage 1 Hypertension (135/88)', desc: 'Elevated arterial resistance.', values: { sbp: 135, dbp: 88, hr: 75 } },
      { name: 'Athletic Hypotension (105/65)', desc: 'Clean arterial compliance in aerobic runners.', values: { sbp: 105, dbp: 65, hr: 52 } },
    ],
    faqs: [
      { q: 'Why is MAP more clinically relevant than just Systolic BP?', a: 'Systolic blood pressure represents only the peak pressure wave during ventricular contraction (~1/3 of the cycle). Diastolic pressure sustains organ tissue microcirculation during ventricular filling (~2/3 of the cycle). MAP integrates both into a continuous perfusion metric.' },
      { q: 'What occurs when MAP drops below 60 mmHg?', a: 'When MAP falls below 60 mmHg, renal autoregulation fails, leading to acute tubular necrosis, renal failure, cerebral ischemia, and cellular hypoxia.' }
    ],
    personas: [
      { name: 'Arthur K.', ageSex: '58y Male', stats: 'BP: 142/92 mmHg, HR 76', diagnosis: 'MAP: 108.7 mmHg. Pulse Pressure: 50 mmHg.', recommendation: 'MAP exceeds optimal ceiling (100 mmHg). Consult healthcare provider for lifestyle or pharmacological titration.' }
    ],
    limitations: [
      { title: 'Tachycardia Assumption', desc: 'At elevated heart rates (>110 BPM), systole and diastole approach equal 50/50 duration, making the 1/3 weighting formula slightly conservative.' }
    ],
    relatedToolIds: ['pulse-pressure', 'zone2', 'vo2max', 'max-hr']
  },

  'whr': {
    id: 'whr',
    slug: 'whr',
    aliases: ['waist-to-hip-ratio', 'whr-calculator', 'waist-hip-ratio'],
    name: 'Waist-to-Hip Ratio (WHR) Adiposity Distribution',
    title: 'Waist-to-Hip Ratio (WHR) & Android/Gynoid Risk Matrix',
    shortDesc: 'Distinguish android (apple-shaped) visceral adiposity from gynoid (pear-shaped) subcutaneous distribution using WHO standards.',
    fullDesc: 'Evaluates the distribution of body fat. High WHR indicates accumulation of deep visceral fat in the peritoneal cavity, which strongly correlates with atherogenic dyslipidemia and insulin resistance.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'World Health Organization (WHO) Metabolic Guidelines',
    formulaDisplay: 'WHR = Waist Circumference / Hip Circumference\nWHO Cutoff (Men): Low Risk ≤ 0.90, Moderate 0.90 - 0.99, High ≥ 1.00\nWHO Cutoff (Women): Low Risk ≤ 0.80, Moderate 0.81 - 0.85, High ≥ 0.86',
    formulaNote: 'Waist measured midway between lowest rib and iliac crest; hips measured at widest gluteal circumference.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Waist-to-Hip Ratio',
    primaryUnit: 'Ratio',
    citation: 'World Health Organization. Waist circumference and waist-hip ratio: report of a WHO expert consultation. Geneva. 2008.',
    defaultInputs: {
      gender: 'male',
      waistCm: 84,
      hipCm: 98,
    },
    presets: [
      { name: 'Healthy Male (WHR 0.85)', desc: 'Waist 84cm, Hip 98cm.', values: { gender: 'male', waistCm: 84, hipCm: 98 } },
      { name: 'Healthy Female (WHR 0.74)', desc: 'Waist 71cm, Hip 96cm.', values: { gender: 'female', waistCm: 71, hipCm: 96 } },
      { name: 'Android Male Risk (WHR 1.02)', desc: 'Waist 102cm, Hip 100cm.', values: { gender: 'male', waistCm: 102, hipCm: 100 } },
    ],
    faqs: [
      { q: 'What is the difference between Android and Gynoid fat?', a: 'Android fat accumulates around the abdomen (apple shape) and is metabolically active, releasing inflammatory cytokines (IL-6, TNF-alpha) directly into portal circulation. Gynoid fat accumulates around hips and glutes (pear shape) and is subcutaneous, carrying far lower cardiometabolic risk.' }
    ],
    personas: [
      { name: 'Simon L.', ageSex: '49y Male', stats: 'Waist 96cm, Hip 97cm', diagnosis: 'WHR: 0.990 (High metabolic risk boundary).', recommendation: 'Prioritize resistance training and reduced refined carbohydrates to target visceral fat depot reduction.' }
    ],
    limitations: [
      { title: 'Gluteal Muscle Confounding', desc: 'Heavy squatting lifters with developed gluteal musculature display artificially low WHR scores.' }
    ],
    relatedToolIds: ['whtr', 'bmi', 'absi', 'navy-fat']
  },

  'bsa': {
    id: 'bsa',
    slug: 'bsa',
    aliases: ['body-surface-area-calculator', 'bsa-calculator', 'dubois-bsa'],
    name: 'Body Surface Area (BSA) Clinical Suite',
    title: 'Body Surface Area (BSA) Du Bois & Mosteller Suite',
    shortDesc: 'Compute total external surface area (m²) of the human body for chemotherapy dosing, cardiac indexing, and renal clearance.',
    fullDesc: 'Compares the foundational Du Bois and Du Bois (1916), Mosteller (1987), Haycock (1978), and Gehan & George (1970) equations used in clinical oncology and nephrology.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'Du Bois & Mosteller Clinical Pharmacology Standards',
    formulaDisplay: 'Du Bois: BSA (m²) = 0.007184 × Weight(kg)^0.425 × Height(cm)^0.725\nMosteller: BSA (m²) = √((Height(cm) × Weight(kg)) / 3600)\nNormal Adult Average: ~ 1.7 to 1.9 m²',
    formulaNote: 'Essential for indexing Cardiac Output (Cardiac Index = CO / BSA) and GFR normalization.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Du Bois BSA',
    primaryUnit: 'm²',
    citation: 'Du Bois D, Du Bois EF. A formula to estimate the approximate surface area if height and weight be known. Arch Intern Med. 1916.',
    defaultInputs: {
      heightCm: 178,
      weightKg: 75,
    },
    presets: [
      { name: 'Standard Adult (178cm, 75kg)', desc: 'Du Bois BSA ~ 1.93 m².', values: { heightCm: 178, weightKg: 75 } },
      { name: 'Petite Adult (158cm, 50kg)', desc: 'Du Bois BSA ~ 1.48 m².', values: { heightCm: 158, weightKg: 50 } },
    ],
    faqs: [
      { q: 'Why is chemotherapy dosed by BSA instead of body weight?', a: 'BSA correlates much more closely with physiological parameters including renal blood flow, cardiac output, hepatic clearance, and metabolic turnover than total scale weight alone.' }
    ],
    personas: [
      { name: 'Diana W.', ageSex: '54y Female', stats: '164cm, 64kg', diagnosis: 'Du Bois BSA: 1.70 m². Mosteller BSA: 1.71 m².', recommendation: 'Use 1.70 m² for indexed clinical dosing and glomerular filtration normalization.' }
    ],
    limitations: [
      { title: 'Extreme Stature Extrapolation', desc: 'Du Bois sample included only 9 original patients, though Mosteller subsequently validated the simplified radical formula across large cohorts.' }
    ],
    relatedToolIds: ['ibw', 'bmi', 'map', 'lbm']
  },

  'absi': {
    id: 'absi',
    slug: 'absi',
    aliases: ['absi-calculator', 'a-body-shape-index'],
    name: 'A Body Shape Index (ABSI) Mortality Risk',
    title: 'A Body Shape Index (ABSI) Krakauer Mortality Risk',
    shortDesc: 'Quantify premature mortality hazard risk by decoupling waist circumference from BMI and height.',
    fullDesc: 'Developed by Nir Krakauer and Jesse Krakauer at the City College of New York from NHANES epidemiological data. Evaluates abdominal adiposity independent of overall body mass.',
    category: 'body-tools',
    categoryName: 'Body Composition & Anthropometry',
    standard: 'Krakauer & Krakauer (PLoS ONE 2012) NHANES Standard',
    formulaDisplay: 'ABSI = Waist_m / (BMI^(2/3) × Height_m^(1/2))\nHigh ABSI = Elevated central obesity relative to BMI\nLow ABSI = Favorable abdominal composition & reduced hazard ratio',
    formulaNote: 'Waist and Height in meters. Average population ABSI is approximately 0.080 m^(11/6) kg^(-2/3).',
    units: 'metric_imperial',
    primaryMetricLabel: 'Computed ABSI',
    primaryUnit: 'Index',
    citation: 'Krakauer NY, Krakauer JC. A new body shape index predicts mortality hazard independently of body mass index. PLoS ONE. 2012.',
    defaultInputs: {
      age: 40,
      gender: 'male',
      heightCm: 178,
      weightKg: 78,
      waistCm: 84,
    },
    presets: [
      { name: 'Favorable Body Shape', desc: '178cm, 78kg with lean 80cm waist.', values: { age: 40, gender: 'male', heightCm: 178, weightKg: 78, waistCm: 80 } },
      { name: 'High Hazard Central Adiposity', desc: '172cm, 74kg with elevated 94cm waist.', values: { age: 45, gender: 'male', heightCm: 172, weightKg: 74, waistCm: 94 } },
    ],
    faqs: [
      { q: 'Why was ABSI developed to fix BMI flaws?', a: 'BMI penalizes muscular athletes with heavy bones while failing to catch "normal weight obesity" (skinny-fat individuals with small limbs but dangerous visceral abdominal depots). ABSI directly isolates abdominal risk.' }
    ],
    personas: [
      { name: 'Paul V.', ageSex: '46y Male', stats: '175cm, 76kg, Waist 88cm (BMI 24.8)', diagnosis: 'ABSI: 0.0825 (Above population median, indicating elevated relative hazard).', recommendation: 'Engage in dietary and aerobic interventions to reduce waist circumference toward 80cm.' }
    ],
    limitations: [
      { title: 'Complex Calculation', desc: 'Requires non-linear fractional exponents, best computed via precision digital algorithms.' }
    ],
    relatedToolIds: ['whtr', 'whr', 'bmi', 'navy-fat']
  },

  'deficit': {
    id: 'deficit',
    slug: 'deficit',
    aliases: ['calorie-deficit-calculator', 'weight-loss-planner', 'surplus-calculator'],
    name: 'Calorie Deficit & Surplus Transformation Planner',
    title: 'Calorie Deficit, Surplus & Body Weight Transformation Planner',
    shortDesc: 'Simulate targeted fat reduction or hypercaloric muscular gains over 12 weeks using metabolic rate adaptations.',
    fullDesc: 'Translates daily caloric adjustments into weekly weight velocity projections using the classical 3,500 kcal per pound rule alongside Hall et al. metabolic dampening models.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'Wishnofsky Rule & Hall NIH Metabolic Adaptation Model',
    formulaDisplay: 'Weekly Fat Delta (kg) = (Daily Deficit × 7) / 7700 kcal\nRecommended Moderate Deficit: 300 - 500 kcal/day\nRecommended Lean Hypertrophy Surplus: 250 - 350 kcal/day',
    formulaNote: '1 kg of human adipose tissue contains approximately 7,700 kcal of chemical energy.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Weekly Projected Weight Delta',
    primaryUnit: 'kg / week',
    citation: 'Hall KD, et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet. 2011.',
    defaultInputs: {
      tdee: 2400,
      dailyAdjustment: -500,
      currentWeightKg: 80,
    },
    presets: [
      { name: 'Moderate Fat Loss (-500 kcal)', desc: 'Safe, sustainable loss of ~0.45 kg (1 lb) per week.', values: { tdee: 2400, dailyAdjustment: -500, currentWeightKg: 80 } },
      { name: 'Aggressive Deficit (-750 kcal)', desc: 'Faster fat loss (~0.68 kg/week) requiring high protein.', values: { tdee: 2600, dailyAdjustment: -750, currentWeightKg: 85 } },
      { name: 'Lean Muscle Surplus (+300 kcal)', desc: 'Controlled clean bulk minimizing adipose spillover.', values: { tdee: 2500, dailyAdjustment: 300, currentWeightKg: 75 } },
    ],
    faqs: [
      { q: 'Is 1 pound of fat always exactly 3,500 calories?', a: 'Max Wishnofsky’s 1958 rule estimates 1 lb of adipose tissue consists of ~87% triglycerides and 13% water/connective tissue, yielding ~3,500 kcal. However, non-linear metabolic slowing causes true long-term loss to require progressively larger adjustments.' }
    ],
    personas: [
      { name: 'Trevor K.', ageSex: '33y Male', stats: 'Current weight 86kg, Maintenance 2,550 kcal', diagnosis: 'Target Intake: 2,050 kcal (-500 kcal/day). 12-week goal: ~80.5 kg.', recommendation: 'Sustain 160g daily protein and perform 3 weekly resistance training sessions to prevent muscle wasting.' }
    ],
    limitations: [
      { title: 'Non-Linearity Over Time', desc: 'Initial weeks involve rapid glycogen-bound water loss (~3g water per 1g glycogen).' }
    ],
    relatedToolIds: ['tdee', 'macro-split', 'protein-rda', 'velocity']
  },

  'carb-cycling': {
    id: 'carb-cycling',
    slug: 'carb-cycling',
    aliases: ['carb-cycling-calculator', 'carb-cycler'],
    name: 'Carbohydrate Cycling Calculator (High / Medium / Low)',
    title: 'Carbohydrate Cycling & Glycogen Re-feed Calculator',
    shortDesc: 'Sync higher carbohydrate intake to intense resistance sessions and lower carbohydrates to rest/cardio days.',
    fullDesc: 'Optimizes insulin sensitivity, replenishes intramuscular glycogen stores on training days, and accelerates fatty acid beta-oxidation on recovery days.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'High/Low Day Periodization Guidelines',
    formulaDisplay: 'High Carb Day (Heavy Training): 50% Carbs, 30% Protein, 20% Fat\nMedium Day (Moderate Training): 35% Carbs, 35% Protein, 30% Fat\nLow Carb Day (Rest/Recovery): 15% Carbs, 45% Protein, 40% Fat',
    formulaNote: 'Total weekly caloric average aligns with overall target deficit or surplus.',
    units: 'metric_imperial',
    primaryMetricLabel: 'High Day Carbohydrates',
    primaryUnit: 'g / day',
    citation: 'Jeukendrup AE. Periodized Nutrition for Athletes. Sports Med. 2017.',
    defaultInputs: {
      averageCalories: 2200,
      highDaysPerWeek: 2,
      medDaysPerWeek: 3,
      lowDaysPerWeek: 2,
    },
    presets: [
      { name: '4-Day Split (2 High, 3 Med, 2 Low)', desc: 'Standard upper/lower training schedule.', values: { averageCalories: 2300, highDaysPerWeek: 2, medDaysPerWeek: 3, lowDaysPerWeek: 2 } },
    ],
    faqs: [
      { q: 'What is the purpose of a re-feed day?', a: 'Refeeding carbohydrates temporarily elevates circulating leptin (satiety hormone), stimulates thyroid T3 conversion, suppresses cortisol, and refills depleted liver/muscle glycogen.' }
    ],
    personas: [
      { name: 'Samira H.', ageSex: '26y Female Lifter', stats: '2,100 average kcal/day', diagnosis: 'High Day: 315g Carbs. Med Day: 184g Carbs. Low Day: 79g Carbs.', recommendation: 'Place High Carb days on heavy squat and deadlift training days.' }
    ],
    limitations: [
      { title: 'Compliance Complexity', desc: 'Requires tracking variable daily targets rather than a consistent routine.' }
    ],
    relatedToolIds: ['macro-split', 'tdee', 'keto', 'deficit']
  },

  'keto': {
    id: 'keto',
    slug: 'keto',
    aliases: ['keto-calculator', 'ketogenic-macro-calculator', 'net-carbs'],
    name: 'Keto Net Carb & Fat Matrix (70/25/5)',
    title: 'Ketogenic Macronutrient & Nutritional Ketosis Suite',
    shortDesc: 'Formulate precise ketogenic ratios keeping net carbohydrates under 25–30g to induce hepatic ketone production.',
    fullDesc: 'Computes macro distribution to maintain circulating beta-hydroxybutyrate (BHB) levels between 0.5 and 3.0 mmol/L for nutritional ketosis.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'Standard Ketogenic Diet (SKD) 70/25/5 Ratio',
    formulaDisplay: 'Net Carbs = Total Carbs - Dietary Fiber - Sugar Alcohols\nTarget Net Carbs ≤ 25g to 30g / day\nEnergy Split: 70-75% Healthy Fats, 20-25% Protein, 5% Net Carbs',
    formulaNote: 'Adequate sodium (3-5g) and potassium (1-2g) essential to counter the natriuresis of fasting.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Net Carbohydrate Ceiling',
    primaryUnit: 'g Net Carbs',
    citation: 'Volek JS, Phinney SD. The Art and Science of Low Carbohydrate Living. Beyond Obesity LLC. 2011.',
    defaultInputs: {
      targetCalories: 2000,
      netCarbLimit: 25,
      proteinPct: 25,
    },
    presets: [
      { name: 'Strict SKD (20g Net Carbs)', desc: 'Guaranteed nutritional ketosis induction.', values: { targetCalories: 1900, netCarbLimit: 20, proteinPct: 25 } },
      { name: 'High Protein Keto', desc: 'For resistance athletes maintaining lean mass.', values: { targetCalories: 2200, netCarbLimit: 30, proteinPct: 30 } },
    ],
    faqs: [
      { q: 'What is the "Keto Flu" and how is it prevented?', a: 'When transitioning into ketosis, insulin drops, causing the kidneys to rapidly excrete sodium and water. This causes lethargy, headaches, and cramps, which are eliminated by consuming sodium broth and electrolytes.' }
    ],
    personas: [
      { name: 'Martin G.', ageSex: '38y Male', stats: '2,000 kcal target', diagnosis: 'Macro plan: 25g Net Carbs (100 kcal), 125g Protein (500 kcal), 155g Fat (1,400 kcal).', recommendation: 'Monitor blood or breath ketones to ensure steady entry into 1.0–2.0 mmol/L BHB.' }
    ],
    limitations: [
      { title: 'Initial Anaerobic Power Drop', desc: 'Explosive high-intensity glycolytic exercise suffers until full keto-adaptation occurs (~4–6 weeks).' }
    ],
    relatedToolIds: ['macro-split', 'tdee', 'carb-cycling', 'deficit']
  },

  'mets': {
    id: 'mets',
    slug: 'mets',
    aliases: ['mets-calculator', 'metabolic-equivalent-calculator', 'calories-burned-calculator'],
    name: 'METs Calories Burned Activity Calculator',
    title: 'Metabolic Equivalent of Task (METs) Energy Calculator',
    shortDesc: 'Calculate actual calories burned across 800+ physical activities using the Ainsworth Compendium of Physical Activities.',
    fullDesc: '1 MET is defined as the resting oxygen consumption rate (3.5 mL of O2 per kg of body mass per minute), approximately equal to 1 kcal/kg/hour.',
    category: 'fitness-tools',
    categoryName: 'Athletic Performance, Strength & Speed',
    standard: 'Ainsworth Compendium of Physical Activities',
    formulaDisplay: 'Calories Burned = Duration (Hours) × MET Value × Weight (kg)\n1 MET = Resting Cellular Metabolic Rate = 1.0 kcal / kg / hour',
    formulaNote: 'Example METs: Walking 3mph = 3.3 MET, Jogging 5mph = 8.3 MET, Resistance Training = 6.0 MET.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Total Exercise Burn',
    primaryUnit: 'kcal Burned',
    citation: 'Ainsworth BE, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Med Sci Sports Exerc. 2011.',
    defaultInputs: {
      weightKg: 75,
      metValue: 8.3,
      durationMins: 45,
    },
    presets: [
      { name: 'Jogging (8.3 MET, 45m)', desc: '75kg adult running at 5 mph.', values: { weightKg: 75, metValue: 8.3, durationMins: 45 } },
      { name: 'Vigorous Weightlifting (6.0 MET, 60m)', desc: 'Heavy barbell compound lifting session.', values: { weightKg: 75, metValue: 6.0, durationMins: 60 } },
      { name: 'Moderate Cycling (7.0 MET, 45m)', desc: '12-14 mph road cycling.', values: { weightKg: 75, metValue: 7.0, durationMins: 45 } },
    ],
    faqs: [
      { q: 'How does MET calculation differ from fitness tracker estimates?', a: 'Smartwatches frequently overestimate calorie burn by 25-40% by counting arm movement and post-exercise EPOC. MET calculations provide calibrated laboratory averages.' }
    ],
    personas: [
      { name: 'Kelly S.', ageSex: '29y Female', stats: '64kg, 50-minute vigorous lap swimming (9.8 MET)', diagnosis: 'Total Energy Expended: 522.7 kcal.', recommendation: 'Ensure adequate post-workout carbohydrate replenishment (~60g) to restore hepatic glycogen.' }
    ],
    limitations: [
      { title: 'Efficiency Variance', desc: 'Highly skilled swimmers or runners expend fewer calories than novices due to superior biomechanical movement efficiency.' }
    ],
    relatedToolIds: ['tdee', 'running-pace', 'rucking', 'zone2']
  },

  'ftp': {
    id: 'ftp',
    slug: 'ftp',
    aliases: ['cycling-ftp-calculator', 'ftp-calculator', 'watts-per-kilogram'],
    name: 'Cycling Functional Threshold Power (FTP) & W/kg',
    title: 'Cycling Functional Threshold Power (FTP) & Coggan Zones',
    shortDesc: 'Compute 1-hour sustainable cycling wattage (FTP) from a 20-minute field test and establish Coggan 7 training power zones.',
    fullDesc: 'Functional Threshold Power (FTP) represents the highest mean wattage a cyclist can maintain for 60 minutes in quasi-steady state without progressive fatigue.',
    category: 'fitness-tools',
    categoryName: 'Athletic Performance, Strength & Speed',
    standard: 'Dr. Andrew Coggan Cycling Power Training Zones',
    formulaDisplay: 'FTP = 20-Minute Average Power (Watts) × 0.95\nPower-to-Weight = FTP / Weight (kg)\nZone 1: <55% | Zone 2 (Endurance): 56-75% | Zone 3 (Tempo): 76-90%\nZone 4 (Threshold): 91-105% | Zone 5 (VO2 Max): 106-120%',
    formulaNote: 'The 0.95 factor discounts anaerobic contribution during the 20-minute test.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Functional Threshold Power',
    primaryUnit: 'Watts (W)',
    citation: 'Allen H, Coggan A. Training and Racing with a Power Meter. VeloPress. 2010.',
    defaultInputs: {
      twentyMinWatts: 260,
      weightKg: 72,
    },
    presets: [
      { name: 'Cat 3 Road Cyclist (280W 20m)', desc: '70kg rider producing 280W (FTP 266W = 3.80 W/kg).', values: { twentyMinWatts: 280, weightKg: 70 } },
      { name: 'Enthusiast Club Rider (220W 20m)', desc: '75kg rider (FTP 209W = 2.78 W/kg).', values: { twentyMinWatts: 220, weightKg: 75 } },
    ],
    faqs: [
      { q: 'Why is Watts per Kilogram (W/kg) more important than total Watts?', a: 'On flat roads, raw watts overcome aerodynamic drag. On any incline (>3%), gravity dominates, making power-to-weight the definitive metric for climbing speed.' }
    ],
    personas: [
      { name: 'Simon R.', ageSex: '35y Male Cyclist', stats: '72kg, 20m test: 270W', diagnosis: 'FTP: 256.5 Watts (3.56 W/kg, Category 3 benchmark).', recommendation: 'Program 2x20-minute threshold intervals at 245-260W once weekly to raise FTP ceiling.' }
    ],
    limitations: [
      { title: 'Anaerobic Capacity Skew', desc: 'Riders with high anaerobic work capacity (AWC) can over-perform in 20 minutes, requiring a 0.90-0.92 multiplier.' }
    ],
    relatedToolIds: ['zone2', 'vo2max', 'running-pace', 'mets']
  },

  'rucking': {
    id: 'rucking',
    slug: 'rucking',
    aliases: ['rucking-calculator', 'hiking-calorie-calculator', 'pack-weight-burn'],
    name: 'Hiking & Rucking Calorie Burn (Pandolf Equation)',
    title: 'Rucking & Graded Incline Pack Calorie Calculator',
    shortDesc: 'Calculate metabolic energy expenditure carrying external pack weight across variable speeds and terrain inclines.',
    fullDesc: 'Employs the peer-reviewed Pandolf equation developed at the U.S. Army Research Institute of Environmental Medicine (USARIEM) for loaded military marches.',
    category: 'fitness-tools',
    categoryName: 'Athletic Performance, Strength & Speed',
    standard: 'Pandolf USARIEM Military Load Carriage Equation',
    formulaDisplay: 'M = 1.5W + 2.0(W + L)(L / W)² + η(W + L)[1.5V² + 0.35VG]\nW = Body Mass (kg), L = Pack Load (kg), V = Speed (m/s), G = Grade (%), η = Terrain Factor',
    formulaNote: 'Terrain factors: Pavement = 1.0, Dirt road = 1.1, Heavy sand/scree = 1.8 to 2.1.',
    units: 'metric_imperial',
    primaryMetricLabel: 'Metabolic Energy Burn',
    primaryUnit: 'kcal / hour',
    citation: 'Pandolf KB, et al. Predicting energy expenditure with loads while standing or walking very slowly. J Appl Physiol. 1977.',
    defaultInputs: {
      bodyWeightKg: 76,
      packWeightKg: 15,
      speedKmh: 5.5,
      inclinePct: 2,
      durationMins: 60,
    },
    presets: [
      { name: 'Standard Military Ruck (15kg Pack, 5.5 km/h)', desc: 'Pavement walk with 33 lb pack.', values: { bodyWeightKg: 76, packWeightKg: 15, speedKmh: 5.5, inclinePct: 1, durationMins: 60 } },
      { name: 'Heavy Mountain Ascent (20kg, 6% Grade)', desc: 'Alpine pack training on graded incline.', values: { bodyWeightKg: 80, packWeightKg: 20, speedKmh: 4.5, inclinePct: 6, durationMins: 90 } },
    ],
    faqs: [
      { q: 'Why is rucking considered superior to running for some athletes?', a: 'Rucking delivers 2x to 3x the caloric burn of walking with a fraction of the joint impact forces of running, while simultaneously strengthening posterior chain musculature and bone density.' }
    ],
    personas: [
      { name: 'Nathan W.', ageSex: '32y Male', stats: '78kg, 18kg pack, 5.0 km/h, 60m session', diagnosis: 'Energy expenditure: 685 kcal/hour (~3x standard walking).', recommendation: 'Ensure pack is held tight and high against the upper thoracic spine to minimize lumbar shear.' }
    ],
    limitations: [
      { title: 'Postural Fatigue', desc: 'Does not account for muscular fatigue degradation as core stabilizers tire on long marches.' }
    ],
    relatedToolIds: ['mets', 'tdee', 'water-matrix', 'zone2']
  },

  'thr': {
    id: 'thr',
    slug: 'thr',
    aliases: ['target-heart-rate-calculator', 'target-heart-rate-zones', 'karvonen-zones'],
    name: 'Target Heart Rate 5-Zone Matrix',
    title: 'Target Heart Rate 5-Zone Training Matrix',
    shortDesc: 'Calibrate all 5 cardiovascular training zones (Active Recovery to Anaerobic) against resting heart rate reserve.',
    fullDesc: 'Comprehensive 5-zone cardiovascular training matrix mapping Zone 1 (Active Recovery 50-60%), Zone 2 (Aerobic Base 60-70%), Zone 3 (Tempo 70-80%), Zone 4 (Threshold 80-90%), and Zone 5 (Neuromuscular 90-100%).',
    category: 'heart-tools',
    categoryName: 'Cardiovascular Vitals & Hemodynamics',
    standard: 'ACSM & Karvonen 5-Zone Cardiovascular Paradigm',
    formulaDisplay: 'HRR = HR_max - HR_rest\nTarget HR = (HRR × %Intensity) + HR_rest\nHR_max = 208 - (0.7 × Age)',
    formulaNote: 'Calibrating against true measured resting pulse eliminates 15-25 BPM zone errors.',
    units: 'metric_only',
    primaryMetricLabel: 'Anaerobic Threshold (Zone 4)',
    primaryUnit: 'BPM',
    citation: 'Karvonen MJ, et al. The effects of training on heart rate; a longitudinal study. Ann Med Exp Biol Fenn. 1957.',
    defaultInputs: {
      age: 30,
      rhr: 55,
    },
    presets: [
      { name: 'Trained Endurance Athlete', desc: 'Age 28, low RHR of 50 BPM.', values: { age: 28, rhr: 50 } },
      { name: 'General Population', desc: 'Age 40, average RHR of 68 BPM.', values: { age: 40, rhr: 68 } },
    ],
    faqs: [
      { q: 'What is the 80/20 polarized endurance training rule?', a: 'World-class endurance athletes spend 80% of their total weekly training volume in low-intensity Zone 1 and Zone 2, and only 20% in high-intensity Zones 4 and 5, avoiding chronic fatigue in Zone 3.' }
    ],
    personas: [
      { name: 'Danielle K.', ageSex: '34y Female', stats: 'Age 34, RHR 58 BPM, HR Max 184 BPM', diagnosis: 'Zone 1: 121-134 BPM | Zone 2: 134-146 BPM | Zone 3: 146-159 BPM | Zone 4: 159-171 BPM | Zone 5: 171-184 BPM.', recommendation: 'Dedicate 4 of 5 weekly sessions strictly within Zones 1-2.' }
    ],
    limitations: [
      { title: 'Temperature & Caffeine Fluctuations', desc: 'Stimulants like caffeine or thermal stress elevate heart rate independent of metabolic intensity.' }
    ],
    relatedToolIds: ['zone2', 'map', 'vo2max', 'max-hr']
  },

  'hrr': {
    id: 'hrr',
    slug: 'hrr',
    aliases: ['heart-rate-recovery', 'hrr-calculator', 'vagal-recovery'],
    name: 'Heart Rate Recovery (HRR) & Vagal Tone',
    title: 'Heart Rate Recovery (HRR) & Parasympathetic Vagal Tone',
    shortDesc: 'Assess autonomic nervous system health and cardiovascular mortality risk by measuring pulse drop 1 and 2 minutes post-exercise.',
    fullDesc: 'Quantifies the speed of parasympathetic vagal reactivation following maximal physical exertion. An abnormal 1-minute drop (<12 BPM) indicates autonomic dysfunction and elevated cardiovascular risk.',
    category: 'heart-tools',
    categoryName: 'Cardiovascular Vitals & Hemodynamics',
    standard: 'Cole et al. New England Journal of Medicine Landmark Study',
    formulaDisplay: '1-Minute HRR = Peak Exercise HR - HR at 1 Minute Rest\n2-Minute HRR = Peak Exercise HR - HR at 2 Minutes Rest\nClinical Cutoff (1-Min): ≥ 18 BPM (Normal/Good), 12-17 BPM (Borderline), < 12 BPM (Abnormal Risk)',
    formulaNote: 'Measured in upright or active cool-down standing position.',
    units: 'metric_only',
    primaryMetricLabel: '1-Minute HR Recovery',
    primaryUnit: 'BPM Drop',
    citation: 'Cole CR, et al. Heart-rate recovery immediately after exercise as a predictor of mortality. N Engl J Med. 1999.',
    defaultInputs: {
      peakHr: 175,
      hr1Min: 148,
      hr2Min: 126,
    },
    presets: [
      { name: 'Excellent Autonomic Tone', desc: '175 BPM peak dropping to 142 BPM at 1 min (33 BPM drop).', values: { peakHr: 175, hr1Min: 142, hr2Min: 120 } },
      { name: 'Borderline Recovery', desc: '170 BPM peak dropping to 156 BPM at 1 min (14 BPM drop).', values: { peakHr: 170, hr1Min: 156, hr2Min: 142 } },
    ],
    faqs: [
      { q: 'Why is heart rate recovery a strong predictor of mortality?', a: 'During heavy exertion, the sympathetic nervous system takes over. Immediately upon stopping, the parasympathetic vagus nerve must rapidly brake heart rate. Failure to do so signals autonomic nervous system imbalance.' }
    ],
    personas: [
      { name: 'Victor M.', ageSex: '50y Male', stats: 'Peak 168 BPM -> 1-Min 142 BPM (26 BPM drop)', diagnosis: 'Normal vigorous vagal reactivation. Robust autonomic tone.', recommendation: 'Continue aerobic interval conditioning to maintain rapid cardiovascular recovery kinetics.' }
    ],
    limitations: [
      { title: 'Cool-Down Protocol Differences', desc: 'Sitting or lying down yields a faster drop than active walking cool-down.' }
    ],
    relatedToolIds: ['map', 'zone2', 'vo2max', 'thr']
  },

  'pulse-pressure': {
    id: 'pulse-pressure',
    slug: 'pulse-pressure',
    aliases: ['pulse-pressure-calculator', 'arterial-stiffness'],
    name: 'Pulse Pressure & Arterial Compliance',
    title: 'Pulse Pressure & Arterial Stiffness Assessment',
    shortDesc: 'Evaluate the difference between systolic and diastolic blood pressures as a clinical marker of central large artery stiffness.',
    fullDesc: 'Pulse Pressure (SBP - DBP) reflects the stroke volume ejected by the left ventricle against the elasticity of the aorta. Elevated pulse pressure (>60 mmHg) in older adults indicates aortic stiffening.',
    category: 'heart-tools',
    categoryName: 'Cardiovascular Vitals & Hemodynamics',
    standard: 'Framingham Heart Study & AHA Guidelines',
    formulaDisplay: 'Pulse Pressure (PP) = Systolic BP - Diastolic BP\nNormal Healthy Target: 30 to 50 mmHg\nElevated Arterial Stiffness Risk: > 60 mmHg\nNarrow Perfusion Warning: < 25 mmHg (Tamponade or Low Stroke Volume)',
    formulaNote: 'A strong independent predictor of coronary events in individuals over 50 years of age.',
    units: 'metric_only',
    primaryMetricLabel: 'Pulse Pressure',
    primaryUnit: 'mmHg',
    citation: 'Franklin SS, et al. Hemodynamic patterns of age-related changes in blood pressure: the Framingham Heart Study. Circulation. 1997.',
    defaultInputs: {
      sbp: 124,
      dbp: 78,
    },
    presets: [
      { name: 'Optimal Elasticity (120/80)', desc: 'PP of 40 mmHg (ideal central compliance).', values: { sbp: 120, dbp: 80 } },
      { name: 'Isolated Systolic Hypertension (150/78)', desc: 'PP of 72 mmHg indicating significant aortic calcification.', values: { sbp: 150, dbp: 78 } },
    ],
    faqs: [
      { q: 'Why does pulse pressure rise with age?', a: 'Over decades, elastin fibers in the aortic wall fracture and are replaced by rigid collagen matrix (arteriosclerosis). The loss of the Windkessel cushioning effect amplifies the systolic wave.' }
    ],
    personas: [
      { name: 'Evelyn P.', ageSex: '67y Female', stats: 'BP: 148/74 mmHg', diagnosis: 'Pulse Pressure: 74 mmHg (Substantially elevated).', recommendation: 'Consult physician regarding isolated systolic hypertension and sodium/aerobic interventions.' }
    ],
    limitations: [
      { title: 'Aortic Regurgitation Skew', desc: 'Valvular incompetence creates wide pulse pressures independent of systemic arterial stiffness.' }
    ],
    relatedToolIds: ['map', 'zone2', 'max-hr']
  },

  'max-hr': {
    id: 'max-hr',
    slug: 'max-hr',
    aliases: ['max-heart-rate-calculator', 'hr-max-calculator', 'tanaka-calculator'],
    name: 'Maximum Heart Rate (HR Max) Tanaka & Gellish',
    title: 'Maximum Heart Rate (HR Max) Tanaka & Gellish Suite',
    shortDesc: 'Replace outdated 220 - Age with peer-reviewed regression models calibrated against laboratory stress tests.',
    fullDesc: 'Compares the modern Tanaka et al. (208 - 0.7 × Age) and Gellish et al. (207 - 0.7 × Age) equations against the classic Fox & Haskell (220 - Age) formula.',
    category: 'heart-tools',
    categoryName: 'Cardiovascular Vitals & Hemodynamics',
    standard: 'Tanaka & Gellish Regression Equations',
    formulaDisplay: 'Tanaka: HR_max = 208 - (0.7 × Age)\nGellish: HR_max = 207 - (0.7 × Age)\nClassic (Fox): HR_max = 220 - Age (Overestimates young, underestimates older)',
    formulaNote: 'Standard deviation across healthy population is approximately ±10 to 12 BPM.',
    units: 'metric_only',
    primaryMetricLabel: 'Tanaka HR Max',
    primaryUnit: 'BPM',
    citation: 'Gellish RL, et al. Longitudinal modeling of the relationship between age and maximal heart rate. Med Sci Sports Exerc. 2007.',
    defaultInputs: {
      age: 35,
    },
    presets: [
      { name: 'Young Adult (25 Years)', desc: 'Tanaka predicts 190.5 BPM vs 195 BPM classic.', values: { age: 25 } },
      { name: 'Middle Age (50 Years)', desc: 'Tanaka predicts 173.0 BPM vs 170 BPM classic.', values: { age: 50 } },
      { name: 'Senior Athlete (65 Years)', desc: 'Tanaka predicts 162.5 BPM vs 155 BPM classic.', values: { age: 65 } },
    ],
    faqs: [
      { q: 'Where did the 220 - Age formula come from?', a: 'It was devised arbitrarily in 1970 by Dr. William Haskell and Dr. Samuel Fox from a compilation of roughly 10 studies. It was never intended as a clinical standard.' }
    ],
    personas: [
      { name: 'Oscar T.', ageSex: '48y Male', stats: 'Age 48', diagnosis: 'Tanaka: 174 BPM. Gellish: 173 BPM. Fox Classic: 172 BPM.', recommendation: 'Base aerobic training zones on the Tanaka regression baseline.' }
    ],
    limitations: [
      { title: 'Intrinsic Pacemaker Variation', desc: 'Sinoatrial node intrinsic pacing rates vary by ±10 BPM due to genetics and cardiac chamber size.' }
    ],
    relatedToolIds: ['zone2', 'thr', 'vo2max', 'hrr']
  },

  'sleep-debt': {
    id: 'sleep-debt',
    slug: 'sleep-debt',
    aliases: ['sleep-debt-calculator', 'cumulative-sleep-loss'],
    name: 'Sleep Debt Accumulator & Repayment Planner',
    title: 'Sleep Debt Accumulator & Circadian Recovery Planner',
    shortDesc: 'Quantify accrued cumulative cognitive sleep loss over 14 days and simulate safe catch-up sleep repayment protocols.',
    fullDesc: 'Cumulative sleep loss degrades prefrontal executive function, glucose tolerance, and reaction times equivalent to legal alcohol intoxication.',
    category: 'sleep-tools',
    categoryName: 'Sleep Architecture & Circadian Rhythm',
    standard: 'Van Dongen et al. Chronic Sleep Restriction Model',
    formulaDisplay: 'Nightly Sleep Deficit = Sleep Need - Actual Sleep\n14-Day Cumulative Debt = ∑ (Nightly Deficits)\nSafe Repayment Rate = +60 to +90 Minutes Extra Rest per Night (Avoid Circadian Phase Shift)',
    formulaNote: 'Attempting to repay >20 hours of debt in one weekend induces social jetlag and insomnia.',
    units: 'time',
    primaryMetricLabel: 'Cumulative Sleep Debt',
    primaryUnit: 'Hours of Debt',
    citation: 'Van Dongen HP, et al. The cumulative cost of additional wakefulness: dose-response effects on neurobehavioral functions and sleep physiology. Sleep. 2003.',
    defaultInputs: {
      sleepNeedHours: 8.0,
      actualSleepHours: 6.5,
      consecutiveDays: 7,
    },
    presets: [
      { name: 'Typical Workweek Deficit', desc: '1.5h short per night for 5 business days (7.5h debt).', values: { sleepNeedHours: 8.0, actualSleepHours: 6.5, consecutiveDays: 5 } },
      { name: 'Severe Crunch Debt', desc: '2.5h short per night for 10 days (25h debt).', values: { sleepNeedHours: 8.0, actualSleepHours: 5.5, consecutiveDays: 10 } },
    ],
    faqs: [
      { q: 'Can you completely erase years of sleep debt?', a: 'Acute neurocognitive deficits recover with 3-4 consecutive nights of 8-9 hours sleep. However, chronic vascular inflammation and insulin resistance take weeks of consistent sleep.' }
    ],
    personas: [
      { name: 'Lisa C.', ageSex: '30y Resident Physician', stats: 'Sleep Need: 8.0h, Actual: 6.0h for 6 days', diagnosis: 'Accrued Debt: 12.0 Hours.', recommendation: 'Extend nightly sleep by 1 hour (9.0h) across the next 10 days rather than sleeping 14 hours on Sunday.' }
    ],
    limitations: [
      { title: 'Subjective Adaptation Illusion', desc: 'Individuals adapt subjectively to feeling tired while objective psychomotor vigilance tests continue to plummet.' }
    ],
    relatedToolIds: ['sleep-wake', 'ess', 'zone2']
  },

  'ess': {
    id: 'ess',
    slug: 'ess',
    aliases: ['epworth-sleepiness-scale', 'ess-calculator', 'sleepiness-scale'],
    name: 'Epworth Sleepiness Scale (ESS) Screener',
    title: 'Epworth Sleepiness Scale (ESS) Somnolence Screener',
    shortDesc: 'Clinical validated questionnaire assessing daytime sleepiness and screening for obstructive sleep apnea (OSA).',
    fullDesc: 'Developed by Dr. Murray Johns at Epworth Hospital in Melbourne. Scores 8 daily situations on a 0 to 3 scale to evaluate excessive daytime sleepiness.',
    category: 'sleep-tools',
    categoryName: 'Sleep Architecture & Circadian Rhythm',
    standard: 'Johns MW Epworth Sleepiness Scale (ESS) Clinical Standard',
    formulaDisplay: 'Total Score = Sum of 8 situations (0 to 3 each)\n0-5: Lower Normal Daytime Sleepiness\n6-10: Higher Normal Sleepiness\n11-12: Mild Excessive Somnolence\n13-15: Moderate Sleepiness | 16-24: Severe Sleepiness (OSA/Narcolepsy Screening Warranted)',
    formulaNote: '0 = would never doze, 1 = slight chance, 2 = moderate chance, 3 = high chance.',
    units: 'score',
    primaryMetricLabel: 'Epworth Score',
    primaryUnit: 'Score / 24',
    citation: 'Johns MW. A new method for measuring daytime sleepiness: the Epworth sleepiness scale. Sleep. 1991.',
    defaultInputs: {
      q1: 1, q2: 2, q3: 1, q4: 1, q5: 2, q6: 0, q7: 1, q8: 0,
    },
    presets: [
      { name: 'Normal Alert Adult', desc: 'Minimal chance of dozing (Score 4).', values: { q1: 0, q2: 1, q3: 1, q4: 0, q5: 1, q6: 0, q7: 1, q8: 0 } },
      { name: 'Suspected Obstructive Sleep Apnea', desc: 'Frequent daytime nodding off (Score 15).', values: { q1: 2, q2: 3, q3: 2, q4: 1, q5: 3, q6: 0, q7: 2, q8: 2 } },
    ],
    faqs: [
      { q: 'When should someone seek a sleep study (polysomnography)?', a: 'An ESS score of 11 or higher, especially combined with loud snoring, morning dry mouth, or witness-observed pauses in breathing, warrants evaluation by a board-certified sleep specialist.' }
    ],
    personas: [
      { name: 'Carl F.', ageSex: '52y Male', stats: 'ESS Score: 14/24', diagnosis: 'Moderate daytime somnolence. Elevated risk for Obstructive Sleep Apnea.', recommendation: 'Referral for home sleep apnea test (HSAT) or in-lab polysomnography.' }
    ],
    limitations: [
      { title: 'Self-Report Subjectivity', desc: 'Drivers and commercial pilots may consciously under-report sleepiness to protect licensing.' }
    ],
    relatedToolIds: ['sleep-wake', 'sleep-debt']
  },

  'ovulation': {
    id: 'ovulation',
    slug: 'ovulation',
    aliases: ['ovulation-calculator', 'fertile-window-calculator', 'conception-calculator'],
    name: 'Ovulation & Fertile Window Predictor',
    title: 'Ovulation & 6-Day Fertile Window Predictor',
    shortDesc: 'Predict the 6-day fertile window (5 days prior to ovulation plus ovulation day) to maximize conception probability.',
    fullDesc: 'Calculates the fertile window factoring the physiological 5-day lifespan of spermatozoa in fertile cervical mucus and the 12–24 hour viability of the released ovum.',
    category: 'maternity-tools',
    categoryName: 'Pregnancy, Gestation & Family Planning',
    standard: 'ACOG Luteal Phase (14-Day) Biological Standard',
    formulaDisplay: 'Ovulation Day = Cycle Length - 14 Days from next expected period\nFertile Window = Ovulation Day - 5 Days through Ovulation Day\nPeak Conception Probability: Ovulation Day - 2 Days & Ovulation Day - 1 Day',
    formulaNote: 'The follicular phase varies; the post-ovulatory luteal phase is consistently 14 days in healthy women.',
    units: 'date',
    primaryMetricLabel: 'Next Predicted Ovulation',
    primaryUnit: 'Date',
    citation: 'Wilcox AJ, et al. Timing of sexual intercourse in relation to ovulation. N Engl J Med. 1995.',
    defaultInputs: {
      lmpDate: '2026-02-14',
      cycleLength: 28,
    },
    presets: [
      { name: 'Standard 28-Day Cycle', desc: 'Ovulation occurs on day 14.', values: { lmpDate: '2026-02-14', cycleLength: 28 } },
      { name: 'Short 24-Day Cycle', desc: 'Ovulation occurs early on day 10.', values: { lmpDate: '2026-02-14', cycleLength: 24 } },
      { name: 'Extended 34-Day Cycle', desc: 'Ovulation occurs on day 20.', values: { lmpDate: '2026-02-14', cycleLength: 34 } },
    ],
    faqs: [
      { q: 'Which days have the highest probability of conception?', a: 'The two days immediately preceding ovulation (O-2 and O-1) have the highest biological conception rates (approx 25-30% per cycle).' }
    ],
    personas: [
      { name: 'Jessica M.', ageSex: '29y Female', stats: 'LMP: Feb 14, 2026, 30-day regular cycle', diagnosis: 'Predicted Ovulation: March 2, 2026. Fertile Window: Feb 25 to March 2.', recommendation: 'Utilize luteinizing hormone (LH) urine test strips starting Feb 26 to detect the surge.' }
    ],
    limitations: [
      { title: 'Cycle Length Fluctuations', desc: 'Emotional stress, illness, or travel can delay the follicular phase unpredictably.' }
    ],
    relatedToolIds: ['due-date', 'hcg']
  },

  'hcg': {
    id: 'hcg',
    slug: 'hcg',
    aliases: ['hcg-doubling-calculator', 'beta-hcg-calculator'],
    name: 'Beta hCG Doubling Time & Gestation Kinetics',
    title: 'Serum Beta-hCG Doubling Kinetics & Early Gestation Suite',
    shortDesc: 'Evaluate the rate of rise and doubling time of quantitative serum beta-hCG across 48–72 hour diagnostic intervals.',
    fullDesc: 'In viable early intrauterine pregnancies (<6,000 mIU/mL), quantitative hCG levels typically double every 48 to 72 hours. Slower rises warrant monitoring for ectopic pregnancy or early embryonic loss.',
    category: 'maternity-tools',
    categoryName: 'Pregnancy, Gestation & Family Planning',
    standard: 'ACOG Early Pregnancy Ultrasound & Biochemical Standards',
    formulaDisplay: 'Doubling Time (Hours) = (Time_hours × ln(2)) / ln(hCG_2 / hCG_1)\nNormal Viable Rise: Doubling time < 72 hours (levels < 6,000 mIU/mL)\nPercentage Rise in 48 Hours = ((hCG_2 / hCG_1)^(48 / Time_hours) - 1) × 100',
    formulaNote: 'Above 6,000 mIU/mL, transvaginal ultrasound provides superior clinical diagnosis.',
    units: 'time',
    primaryMetricLabel: 'hCG Doubling Time',
    primaryUnit: 'Hours',
    citation: 'Seeber BE, et al. Application of mathematical models to describe the rate of rise of beta-human chorionic gonadotropin in normal early pregnancy. Fertil Steril. 2006.',
    defaultInputs: {
      hcg1: 250,
      hcg2: 580,
      hoursBetween: 48,
    },
    presets: [
      { name: 'Normal Viable Doubling (48h Interval)', desc: '250 mIU/mL rising to 580 mIU/mL in 48 hours (doubling in 39.5 hours).', values: { hcg1: 250, hcg2: 580, hoursBetween: 48 } },
      { name: 'Sub-Optimal Rise Alert', desc: '400 mIU/mL rising to only 520 mIU/mL in 48 hours (doubling in 126 hours).', values: { hcg1: 400, hcg2: 520, hoursBetween: 48 } },
    ],
    faqs: [
      { q: 'What is the "Discriminatory Zone" for hCG?', a: 'The discriminatory zone is the serum hCG level (typically 1,500 to 2,000 mIU/mL) at which a gestational sac should reliably be visible on transvaginal ultrasonography.' }
    ],
    personas: [
      { name: 'Megan T.', ageSex: '31y Female', stats: 'Test 1: 320 mIU/mL, Test 2: 740 mIU/mL (48h later)', diagnosis: 'Doubling time: 39.7 hours. 48-hour increase: 131.2% (Healthy viable trajectory).', recommendation: 'Continue routine prenatal care and schedule 8-week dating sonogram.' }
    ],
    limitations: [
      { title: 'Plateauing Beyond 10 Weeks', desc: 'hCG naturally peaks around weeks 9-11 (approx 100,000-200,000 mIU/mL) and then declines, rendering doubling math invalid in late first trimester.' }
    ],
    relatedToolIds: ['due-date', 'ovulation']
  },

  'velocity': {
    id: 'velocity',
    slug: 'velocity',
    aliases: ['weight-loss-velocity-simulator', 'metabolic-adaptation-simulator'],
    name: 'Weight Loss Velocity & Metabolic Simulator',
    title: 'Non-Linear Weight Loss Velocity & Adaptation Simulator',
    shortDesc: 'Simulate non-linear weight loss curves factoring leptin suppression, NEAT drops, and metabolic adaptation over 24 weeks.',
    fullDesc: 'Static 3,500 kcal calculations falsely assume linear progress forever. This simulator models the real biological tapering that occurs as body surface area shrinks.',
    category: 'nutrition-tools',
    categoryName: 'Nutrition, Macros & Metabolic Expenditure',
    standard: 'NIH Body Weight Planner & Hall Mathematical Model',
    formulaDisplay: 'Day-to-Day: Body Mass(t+1) = Mass(t) - [Energy Deficit / (Adipose Cost + Lean Cost)]\nMetabolic Feedback: BMR drops ~15 kcal/day per kg lost\nNEAT suppression: ~50-100 kcal reduction unconsciously',
    formulaNote: 'Prevents patient demoralization by establishing realistic non-linear weight trajectories.',
    units: 'metric_imperial',
    primaryMetricLabel: '24-Week Projected Weight',
    primaryUnit: 'kg',
    citation: 'Hall KD, et al. A mathematical model of human metabolism. Lancet. 2011.',
    defaultInputs: {
      startWeightKg: 85,
      deficitKcal: 500,
    },
    presets: [
      { name: '85kg Adult (-500 kcal/day)', desc: 'Models 24-week realistic trajectory tapering from 85kg to ~74kg.', values: { startWeightKg: 85, deficitKcal: 500 } },
    ],
    faqs: [
      { q: 'Why does weight loss slow down after 8 weeks?', a: 'A lighter body burns fewer calories doing the exact same daily tasks (walking, sitting), while non-exercise activity thermogenesis (NEAT) drops as the brain attempts to defend setpoint weight.' }
    ],
    personas: [
      { name: 'Craig O.', ageSex: '41y Male', stats: 'Start: 90kg, 500 kcal deficit', diagnosis: 'Week 4: 86.8kg. Week 12: 82.5kg. Week 24: 78.4kg (Plateau approaching).', recommendation: 'Plan a 1-week diet break at maintenance calories around Week 12 to reset leptin.' }
    ],
    limitations: [
      { title: 'Water Retention Masking', desc: 'Cortisol spikes from caloric restriction can mask 2-3kg of true fat loss for weeks at a time.' }
    ],
    relatedToolIds: ['tdee', 'deficit', 'bmr', 'macro-split']
  }
};

// Aliases mapping helper
export function resolveToolConfig(slugOrAlias: string): ToolMetadataConfig | null {
  const clean = slugOrAlias.toLowerCase().trim();
  if (HEALTH_TOOL_CONFIGS[clean]) {
    return HEALTH_TOOL_CONFIGS[clean];
  }
  for (const key in HEALTH_TOOL_CONFIGS) {
    const config = HEALTH_TOOL_CONFIGS[key];
    if (config.slug === clean || config.id === clean || config.aliases.includes(clean)) {
      return config;
    }
  }
  return null;
}

export const ALL_HEALTH_SLUGS = Object.keys(HEALTH_TOOL_CONFIGS);
