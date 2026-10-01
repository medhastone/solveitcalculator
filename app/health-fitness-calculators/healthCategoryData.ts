export interface HealthTool {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  categorySlug: string;
  path: string;
  badge?: string;
  icon: string;
  keywords: string[];
  formulaSummary?: string;
}

export interface HealthGoal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tools: {
    name: string;
    desc: string;
    path: string;
  }[];
}

export interface FeaturedTool {
  id: string;
  name: string;
  category: string;
  icon: string;
  path: string;
  problemSolved: string;
  userEnters: string;
  userReceives: string;
}

export interface HealthCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  tools: {
    name: string;
    desc: string;
    path: string;
  }[];
}

export interface FormulaSpec {
  name: string;
  whatItCalculates: string;
  inputs: string;
  formula: string;
  units: string;
  assumptions: string;
  limitations: string;
  source: string;
  year: string;
}

export interface HealthSourceTrust {
  organization: string;
  fullName: string;
  scope: string;
  guideline: string;
  lastReviewed: string;
  referenceUrl: string;
}

export interface HealthGuide {
  title: string;
  description: string;
  readTime: string;
  toolPath: string;
  toolName: string;
}

export interface HealthFaq {
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// 1. MASTER HEALTH CATALOG (ALL 35+ REAL CALCULATORS)
// ---------------------------------------------------------------------------
export const HEALTH_CATALOG: HealthTool[] = [
  // Body & Weight
  {
    id: 'bmi',
    name: 'BMI Calculator',
    shortDesc: 'Compute Body Mass Index using metric or imperial units with standard adult and regional reference cutoffs.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/bmi',
    badge: 'Screening',
    icon: 'straighten',
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'underweight', 'overweight', 'obesity', 'quetelet'],
    formulaSummary: 'Weight (kg) / [Height (m)]²',
  },
  {
    id: 'navy-fat',
    name: 'Body Fat Calculator (U.S. Navy)',
    shortDesc: 'Estimate body fat percentage using body circumference measurements without skinfold calipers or water submersion.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/navy-fat',
    badge: 'Circumference',
    icon: 'accessibility_new',
    keywords: ['body fat', 'navy body fat', 'fat percentage', 'lean mass', 'waist', 'neck', 'hip', 'adipose'],
    formulaSummary: 'Logarithmic circumference equation (Hodgdon & Beckett)',
  },
  {
    id: 'ibw',
    name: 'Ideal Body Weight Calculator (IBW)',
    shortDesc: 'Compare baseline reference weight targets across established formulas including Devine, Robinson, and Hamwi.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/ibw',
    badge: 'Multi-Formula',
    icon: 'scale',
    keywords: ['ibw', 'ideal body weight', 'devine formula', 'healthy weight', 'target weight'],
    formulaSummary: 'Devine, Robinson, and Hamwi height-regression formulas',
  },
  {
    id: 'lbm',
    name: 'Lean Body Mass Calculator (LBM)',
    shortDesc: 'Estimate total non-fat tissue mass (muscles, organs, bone, and water) using the Boer and James equations.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/lbm',
    badge: 'Tissue Mass',
    icon: 'fitness_center',
    keywords: ['lean body mass', 'lbm', 'fat free mass', 'boer', 'james formula'],
    formulaSummary: 'Boer & James stature-weight regressions',
  },
  {
    id: 'ffmi',
    name: 'Fat-Free Mass Index (FFMI)',
    shortDesc: 'Calculate height-normalized muscularity to track natural muscle development over training cycles.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/ffmi',
    badge: 'Muscularity',
    icon: 'exercise',
    keywords: ['ffmi', 'fat free mass index', 'muscle mass', 'natural limit', 'hypertrophy'],
    formulaSummary: 'FFM (kg) / [Height (m)]² + 6.1 × (1.8 - Height)',
  },
  {
    id: 'whtr',
    name: 'Waist-to-Height Ratio (WHtR)',
    shortDesc: 'Evaluate central abdominal fat distribution against total height using established reference boundaries.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/whtr',
    badge: 'Central Adiposity',
    icon: 'aspect_ratio',
    keywords: ['waist to height', 'whtr', 'abdominal fat', 'ashwell', 'central obesity'],
    formulaSummary: 'Waist Circumference / Height',
  },
  {
    id: 'whr',
    name: 'Waist-to-Hip Ratio (WHR)',
    shortDesc: 'Assess android versus gynoid body fat distribution patterns from simple tape circumference inputs.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/whr',
    badge: 'Body Shape',
    icon: 'pie_chart',
    keywords: ['waist to hip', 'whr', 'body shape', 'visceral fat', 'apple pear shape'],
    formulaSummary: 'Waist Circumference / Hip Circumference',
  },
  {
    id: 'bsa',
    name: 'Body Surface Area Calculator (BSA)',
    shortDesc: 'Calculate total external body surface area using the Mosteller and Du Bois mathematical formulas.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/bsa',
    badge: 'Metric Area',
    icon: 'space_dashboard',
    keywords: ['bsa', 'body surface area', 'mosteller', 'du bois', 'surface area'],
    formulaSummary: 'Mosteller: √[(Height cm × Weight kg) / 3600]',
  },
  {
    id: 'absi',
    name: 'A Body Shape Index (ABSI)',
    shortDesc: 'Calculate ABSI to explore research-derived risk context adjusting BMI for waist circumference.',
    category: 'Body & Weight',
    categorySlug: 'body-weight',
    path: '/health-fitness-calculators/absi',
    badge: 'Research Index',
    icon: 'scatter_plot',
    keywords: ['absi', 'a body shape index', 'krakauer', 'waist adjustment', 'body shape'],
    formulaSummary: 'Waist / (BMI^(2/3) × Height^(1/2))',
  },

  // Calories & Nutrition
  {
    id: 'tdee',
    name: 'TDEE Calculator (Total Daily Energy Expenditure)',
    shortDesc: 'Estimate total daily calorie requirements factoring in basal metabolism and chosen daily physical activity levels.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/tdee',
    badge: 'Energy Balance',
    icon: 'local_fire_department',
    keywords: ['tdee', 'total daily energy expenditure', 'maintenance calories', 'daily calories', 'energy expenditure'],
    formulaSummary: 'BMR × Physical Activity Level (PAL)',
  },
  {
    id: 'bmr',
    name: 'BMR Calculator (Basal Metabolic Rate)',
    shortDesc: 'Calculate estimated calories burned at complete physical rest using the Mifflin-St Jeor and Harris-Benedict formulas.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/bmr',
    badge: 'Resting Energy',
    icon: 'speed',
    keywords: ['bmr', 'basal metabolic rate', 'resting calories', 'mifflin st jeor', 'harris benedict'],
    formulaSummary: 'Mifflin-St Jeor resting energy expenditure equation',
  },
  {
    id: 'deficit',
    name: 'Calorie Deficit & Surplus Planner',
    shortDesc: 'Model steady weight loss deficits or lean surplus trajectories with weekly adjustment intervals.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/deficit',
    badge: 'Planning',
    icon: 'trending_down',
    keywords: ['calorie deficit', 'calorie surplus', 'weight loss planner', 'fat loss', 'cutting', 'bulking'],
    formulaSummary: 'TDEE ± Desired Energy Adjustment (kcal/day)',
  },
  {
    id: 'macro-split',
    name: 'Macronutrient Split Calculator',
    shortDesc: 'Break down daily calorie goals into grams of protein, carbohydrates, and dietary fats using standard caloric densities.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/macro-split',
    badge: 'Macros',
    icon: 'donut_small',
    keywords: ['macros', 'macronutrient calculator', 'protein carbs fat', 'macro split', 'flexible dieting'],
    formulaSummary: 'Calories allocated via 4 kcal/g (protein/carb) and 9 kcal/g (fat)',
  },
  {
    id: 'protein-rda',
    name: 'Daily Protein Calculator',
    shortDesc: 'Estimate daily protein targets comparing baseline health guidelines with sports nutrition recommendations.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/protein-rda',
    badge: 'Target Intake',
    icon: 'egg_alt',
    keywords: ['protein', 'protein intake', 'protein rda', 'grams protein', 'muscle protein synthesis'],
    formulaSummary: '0.8 g/kg (baseline) to 1.6–2.2 g/kg (training targets)',
  },
  {
    id: 'water-matrix',
    name: 'Daily Water Intake Calculator',
    shortDesc: 'Calculate recommended baseline fluid intake factoring body weight, exercise duration, and climate conditions.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/water-matrix',
    badge: 'Hydration',
    icon: 'water_drop',
    keywords: ['water intake', 'hydration', 'fluid intake', 'liters water', 'water calculator'],
    formulaSummary: 'Baseline body weight fluid factor + exercise sweat offset',
  },
  {
    id: 'carb-cycling',
    name: 'Carb Cycling Calculator',
    shortDesc: 'Plan high-carbohydrate training days and low-carbohydrate rest days while keeping average weekly energy balanced.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/carb-cycling',
    badge: 'Cycle Planning',
    icon: 'calendar_month',
    keywords: ['carb cycling', 'high carb low carb', 'refeed', 'glycogen', 'macro cycling'],
    formulaSummary: 'Weighted 7-day caloric and carbohydrate distribution',
  },
  {
    id: 'keto',
    name: 'Keto Macro Calculator',
    shortDesc: 'Calculate macronutrient ratios for a standard ketogenic approach emphasizing healthy fats and low net carbohydrates.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/keto',
    badge: 'Low-Carb',
    icon: 'restaurant',
    keywords: ['keto', 'ketogenic', 'net carbs', 'keto macros', 'low carb'],
    formulaSummary: '70–75% fat, 20–25% protein, 5–10% net carbs by calorie',
  },
  {
    id: 'velocity',
    name: 'Weight Loss Velocity Calculator',
    shortDesc: 'Model realistic timeframes for body weight changes based on conservative, moderate, or aggressive energy deficits.',
    category: 'Calories & Nutrition',
    categorySlug: 'nutrition',
    path: '/health-fitness-calculators/velocity',
    badge: 'Projection',
    icon: 'timeline',
    keywords: ['weight loss velocity', 'fat loss speed', 'timeline', 'realistic weight loss'],
    formulaSummary: 'Cumulative energy deficit over projected time',
  },

  // Fitness & Training
  {
    id: 'running-pace',
    name: 'Running Pace Calculator',
    shortDesc: 'Calculate pace per mile or kilometer and project finish times for 5K, 10K, half marathon, and marathon distances.',
    category: 'Fitness & Training',
    categorySlug: 'fitness',
    path: '/health-fitness-calculators/running-pace',
    badge: 'Pace & Splits',
    icon: 'directions_run',
    keywords: ['running pace', 'pace calculator', '5k pace', 'marathon pace', 'min per mile', 'splits'],
    formulaSummary: 'Pace = Time / Distance; Riegel formula for projections',
  },
  {
    id: '1rm',
    name: 'One-Rep Max Calculator (1RM)',
    shortDesc: 'Estimate maximum lifting capacity from submaximal repetitions using the Brzycki, Epley, and Lander formulas.',
    category: 'Fitness & Training',
    categorySlug: 'fitness',
    path: '/health-fitness-calculators/1rm',
    badge: 'Strength',
    icon: 'fitness_center',
    keywords: ['one rep max', '1rm', 'strength', 'brzycki formula', 'epley formula', 'bench press max'],
    formulaSummary: 'Brzycki: Weight / [1.0278 - (0.0278 × Reps)]',
  },
  {
    id: 'vo2max',
    name: 'VO2 Max Estimator (Cooper Test)',
    shortDesc: 'Estimate maximal oxygen uptake (mL/kg/min) from 12-minute run distance or 1.5-mile field test inputs.',
    category: 'Fitness & Training',
    categorySlug: 'fitness',
    path: '/health-fitness-calculators/vo2max',
    badge: 'Cardio Fitness',
    icon: 'pulmonology',
    keywords: ['vo2 max', 'aerobic capacity', 'cooper test', 'cardiovascular fitness', 'oxygen uptake'],
    formulaSummary: 'Cooper test distance-to-oxygen correlation regression',
  },
  {
    id: 'mets',
    name: 'METs Calories Burned Calculator',
    shortDesc: 'Estimate calories burned during physical activities using standard Metabolic Equivalent of Task values.',
    category: 'Fitness & Training',
    categorySlug: 'fitness',
    path: '/health-fitness-calculators/mets',
    badge: 'Energy Burn',
    icon: 'bolt',
    keywords: ['mets', 'calories burned', 'exercise calories', 'metabolic equivalent', 'workout calories'],
    formulaSummary: 'Calories = MET × Weight (kg) × Duration (hours)',
  },
  {
    id: 'ftp',
    name: 'Cycling FTP & Power Zones Calculator',
    shortDesc: 'Calculate Functional Threshold Power and Coggan 7-zone training wattages from a standard 20-minute power test.',
    category: 'Fitness & Training',
    categorySlug: 'fitness',
    path: '/health-fitness-calculators/ftp',
    badge: 'Cycling Power',
    icon: 'directions_bike',
    keywords: ['ftp', 'functional threshold power', 'cycling zones', 'watts per kg', 'coggan power zones'],
    formulaSummary: 'FTP = 95% of 20-minute average power output',
  },
  {
    id: 'rucking',
    name: 'Rucking & Pack Walking Calorie Calculator',
    shortDesc: 'Estimate energy expenditure for walking with weighted backpacks across terrain using the Pandolf equation.',
    category: 'Fitness & Training',
    categorySlug: 'fitness',
    path: '/health-fitness-calculators/rucking',
    badge: 'Load Carriage',
    icon: 'hiking',
    keywords: ['rucking', 'backpack walking', 'ruck calories', 'pandolf equation', 'loaded carry'],
    formulaSummary: 'Pandolf metabolic load equation factoring grade, pack weight, and speed',
  },

  // Heart & Vitals
  {
    id: 'thr',
    name: 'Target Heart Rate Zones Calculator',
    shortDesc: 'Calculate individualized cardiovascular training zones (Zones 1–5) using the Karvonen heart rate reserve method.',
    category: 'Heart & Vitals',
    categorySlug: 'heart-vitals',
    path: '/health-fitness-calculators/thr',
    badge: 'Karvonen Method',
    icon: 'favorite',
    keywords: ['target heart rate', 'karvonen', 'heart rate zones', 'aerobic zone', 'training heart rate'],
    formulaSummary: 'THR = [(Max HR - Resting HR) × % Intensity] + Resting HR',
  },
  {
    id: 'zone2',
    name: 'Zone 2 Heart Rate Calculator',
    shortDesc: 'Determine target heart rate boundaries for sustainable aerobic base endurance training and mitochondrial health.',
    category: 'Heart & Vitals',
    categorySlug: 'heart-vitals',
    path: '/health-fitness-calculators/zone2',
    badge: 'Aerobic Base',
    icon: 'monitor_heart',
    keywords: ['zone 2', 'aerobic base', 'endurance training', 'fat burning zone', 'mitochondrial'],
    formulaSummary: '60%–70% of Heart Rate Reserve or ~65–75% Max HR',
  },
  {
    id: 'map',
    name: 'Mean Arterial Pressure Calculator (MAP)',
    shortDesc: 'Calculate average arterial pressure throughout a single cardiac cycle from resting systolic and diastolic values.',
    category: 'Heart & Vitals',
    categorySlug: 'heart-vitals',
    path: '/health-fitness-calculators/map',
    badge: 'Perfusion',
    icon: 'blood_pressure',
    keywords: ['map', 'mean arterial pressure', 'blood pressure', 'diastolic', 'systolic', 'perfusion'],
    formulaSummary: 'MAP = Diastolic BP + [1/3 × (Systolic BP - Diastolic BP)]',
  },
  {
    id: 'pulse-pressure',
    name: 'Pulse Pressure Calculator',
    shortDesc: 'Calculate the mathematical difference between systolic and diastolic blood pressure readings.',
    category: 'Heart & Vitals',
    categorySlug: 'heart-vitals',
    path: '/health-fitness-calculators/pulse-pressure',
    badge: 'Pressure Delta',
    icon: 'show_chart',
    keywords: ['pulse pressure', 'blood pressure difference', 'systolic diastolic gap', 'vascular stiffness'],
    formulaSummary: 'Pulse Pressure = Systolic BP - Diastolic BP',
  },
  {
    id: 'hrr',
    name: 'Heart Rate Recovery Calculator (HRR)',
    shortDesc: 'Evaluate post-exercise heart rate drop after 1 and 2 minutes of recovery to monitor autonomic recovery trends.',
    category: 'Heart & Vitals',
    categorySlug: 'heart-vitals',
    path: '/health-fitness-calculators/hrr',
    badge: 'Autonomic Trend',
    icon: 'hourglass_bottom',
    keywords: ['heart rate recovery', 'hrr', 'vagal tone', 'cardiac recovery', 'post exercise heart rate'],
    formulaSummary: 'HR Drop = Peak Exercise HR - HR at 1 or 2 Minutes Post-Exercise',
  },
  {
    id: 'max-hr',
    name: 'Maximum Heart Rate Calculator (Tanaka)',
    shortDesc: 'Estimate theoretical peak heart rate comparing the modern Tanaka regression with the traditional 220-age rule.',
    category: 'Heart & Vitals',
    categorySlug: 'heart-vitals',
    path: '/health-fitness-calculators/max-hr',
    badge: 'Regression',
    icon: 'ecg_heart',
    keywords: ['max heart rate', 'tanaka formula', 'hr max', '220 minus age', 'peak heart rate'],
    formulaSummary: 'Tanaka: 208 - (0.7 × Age)',
  },

  // Sleep & Recovery
  {
    id: 'sleep-wake',
    name: 'Sleep Cycle & Wake-Time Calculator',
    shortDesc: 'Explore suggested bedtimes or wake-up times based on typical 90-minute sleep cycle planning assumptions.',
    category: 'Sleep & Recovery',
    categorySlug: 'sleep',
    path: '/health-fitness-calculators/sleep-wake',
    badge: 'Timing Model',
    icon: 'bedtime',
    keywords: ['sleep cycle', 'sleep calculator', 'wake up time', 'bedtime', 'rem sleep', 'sleep timing'],
    formulaSummary: 'Target Time ± (N × 90 min cycles) + 15 min sleep latency',
  },
  {
    id: 'sleep-debt',
    name: 'Sleep Debt Calculator',
    shortDesc: 'Quantify cumulative differences between personal sleep needs and actual sleep duration over 7 to 14 days.',
    category: 'Sleep & Recovery',
    categorySlug: 'sleep',
    path: '/health-fitness-calculators/sleep-debt',
    badge: 'Tracking',
    icon: 'alarm_off',
    keywords: ['sleep debt', 'sleep deficit', 'sleep tracking', 'hours slept', 'recovery sleep'],
    formulaSummary: 'Sum of [Daily Need - Actual Sleep Duration] over observation period',
  },
  {
    id: 'ess',
    name: 'Epworth Sleepiness Scale (ESS)',
    shortDesc: 'Complete the standardized 8-question informational questionnaire reflecting self-reported daytime sleepiness.',
    category: 'Sleep & Recovery',
    categorySlug: 'sleep',
    path: '/health-fitness-calculators/ess',
    badge: 'Questionnaire',
    icon: 'checklist',
    keywords: ['epworth sleepiness scale', 'ess', 'daytime sleepiness', 'sleep questionnaire', 'somnolence'],
    formulaSummary: 'Sum of 8 situational scores (0–3 scale, total 0–24)',
  },

  // Pregnancy & Family Planning
  {
    id: 'due-date',
    name: 'Pregnancy Due Date Calculator',
    shortDesc: 'Estimate expected date of delivery using Naegele’s Rule from your last menstrual period or known conception date.',
    category: 'Pregnancy & Family Planning',
    categorySlug: 'pregnancy',
    path: '/health-fitness-calculators/due-date',
    badge: 'Naegele’s Rule',
    icon: 'child_care',
    keywords: ['due date calculator', 'pregnancy due date', 'estimated delivery date', 'naegele rule', 'conception date'],
    formulaSummary: 'LMP + 280 days (adjusted for individual cycle length)',
  },
  {
    id: 'ovulation',
    name: 'Ovulation & Fertile Window Calculator',
    shortDesc: 'Estimate the approximate 6-day fertile window based on average cycle duration and typical 14-day luteal phase.',
    category: 'Pregnancy & Family Planning',
    categorySlug: 'pregnancy',
    path: '/health-fitness-calculators/ovulation',
    badge: 'Calendar Model',
    icon: 'event_available',
    keywords: ['ovulation calculator', 'fertile window', 'conception timing', 'luteal phase', 'cycle calendar'],
    formulaSummary: 'Estimated Ovulation = Cycle Length - 14 days from subsequent LMP',
  },
  {
    id: 'hcg',
    name: 'hCG Doubling Time Calculator',
    shortDesc: 'Calculate rate of increase and doubling hours between two quantitative blood serum hCG lab results.',
    category: 'Pregnancy & Family Planning',
    categorySlug: 'pregnancy',
    path: '/health-fitness-calculators/hcg',
    badge: 'Kinetics',
    icon: 'biotech',
    keywords: ['hcg doubling', 'beta hcg', 'hcg calculator', 'pregnancy hormone', 'doubling time'],
    formulaSummary: 'Doubling Time = [Elapsed Hours × ln(2)] / ln(hCG2 / hCG1)',
  },
];

// ---------------------------------------------------------------------------
// 2. POPULAR HEALTH CALCULATORS (TOP HIGH-VALUE TOOLS)
// ---------------------------------------------------------------------------
export const POPULAR_HEALTH_TOOLS = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    shortDesc: 'Screen body size using metric or imperial height and weight values.',
    category: 'Body & Weight',
    path: '/health-fitness-calculators/bmi',
    icon: 'straighten',
  },
  {
    id: 'deficit',
    name: 'Calorie Calculator',
    shortDesc: 'Estimate daily calorie intake for maintenance, steady loss, or lean surplus.',
    category: 'Calories & Nutrition',
    path: '/health-fitness-calculators/deficit',
    icon: 'local_fire_department',
  },
  {
    id: 'bmr',
    name: 'BMR Calculator',
    shortDesc: 'Calculate estimated basal energy burned at rest via the Mifflin-St Jeor equation.',
    category: 'Calories & Nutrition',
    path: '/health-fitness-calculators/bmr',
    icon: 'speed',
  },
  {
    id: 'tdee',
    name: 'TDEE Calculator',
    shortDesc: 'Determine total daily energy expenditure combining BMR and activity levels.',
    category: 'Calories & Nutrition',
    path: '/health-fitness-calculators/tdee',
    icon: 'bolt',
  },
  {
    id: 'navy-fat',
    name: 'Body Fat Calculator',
    shortDesc: 'Estimate body fat percentage using standard U.S. Navy tape measurements.',
    category: 'Body & Weight',
    path: '/health-fitness-calculators/navy-fat',
    icon: 'accessibility_new',
  },
  {
    id: 'ibw',
    name: 'Ideal Weight Calculator',
    shortDesc: 'Compare healthy weight reference baselines across 4 clinical formulas.',
    category: 'Body & Weight',
    path: '/health-fitness-calculators/ibw',
    icon: 'scale',
  },
  {
    id: 'protein-rda',
    name: 'Protein Calculator',
    shortDesc: 'Estimate daily protein targets for baseline health or athletic training.',
    category: 'Calories & Nutrition',
    path: '/health-fitness-calculators/protein-rda',
    icon: 'egg_alt',
  },
  {
    id: 'water-matrix',
    name: 'Water Intake Calculator',
    shortDesc: 'Calculate daily fluid hydration targets adjusted for weight and exercise.',
    category: 'Calories & Nutrition',
    path: '/health-fitness-calculators/water-matrix',
    icon: 'water_drop',
  },
  {
    id: 'running-pace',
    name: 'Running Pace Calculator',
    shortDesc: 'Convert speed, calculate split times, and project race finishes.',
    category: 'Fitness & Training',
    path: '/health-fitness-calculators/running-pace',
    icon: 'directions_run',
  },
  {
    id: 'thr',
    name: 'Heart Rate Calculator',
    shortDesc: 'Calculate target heart rate training zones using resting and max HR.',
    category: 'Heart & Vitals',
    path: '/health-fitness-calculators/thr',
    icon: 'favorite',
  },
  {
    id: 'sleep-wake',
    name: 'Sleep Calculator',
    shortDesc: 'Explore suggested bedtime and wake-up times using 90-minute cycle models.',
    category: 'Sleep & Recovery',
    path: '/health-fitness-calculators/sleep-wake',
    icon: 'bedtime',
  },
  {
    id: 'due-date',
    name: 'Pregnancy Due Date Calculator',
    shortDesc: 'Estimate delivery dates using Naegele’s Rule from your last menstrual period.',
    category: 'Pregnancy & Family Planning',
    path: '/health-fitness-calculators/due-date',
    icon: 'child_care',
  },
];

// ---------------------------------------------------------------------------
// 3. USER GOALS DISCOVERY (EXACT 6 GOALS FROM PROMPT)
// ---------------------------------------------------------------------------
export const HEALTH_USER_GOALS: HealthGoal[] = [
  {
    id: 'manage-weight',
    title: 'MANAGE MY WEIGHT',
    subtitle: 'BMI, Calorie Needs, TDEE, BMR, Body Fat, Ideal Weight',
    description: 'Understand commonly used body and energy metrics while keeping the limitations of each measure in mind.',
    icon: 'monitor_weight',
    tools: [
      { name: 'BMI Calculator', desc: 'Screen body size against height-weight reference categories.', path: '/health-fitness-calculators/bmi' },
      { name: 'Calorie Needs Planner', desc: 'Plan sustainable daily caloric deficits or maintenance targets.', path: '/health-fitness-calculators/deficit' },
      { name: 'TDEE Calculator', desc: 'Estimate total daily calorie burn including activity.', path: '/health-fitness-calculators/tdee' },
      { name: 'BMR Calculator', desc: 'Find estimated baseline calories required at complete rest.', path: '/health-fitness-calculators/bmr' },
      { name: 'Body Fat Calculator', desc: 'Estimate body composition using tape circumference values.', path: '/health-fitness-calculators/navy-fat' },
      { name: 'Ideal Weight Calculator', desc: 'Review traditional reference weight ranges for your height.', path: '/health-fitness-calculators/ibw' },
    ],
  },
  {
    id: 'build-muscle',
    title: 'BUILD MUSCLE',
    subtitle: 'Protein, Macros, Lean Body Mass, FFMI, 1RM, Calorie Needs',
    description: 'Explore calculations related to body composition, nutrition, and strength training.',
    icon: 'fitness_center',
    tools: [
      { name: 'Protein Calculator', desc: 'Estimate daily protein intake targets for resistance training.', path: '/health-fitness-calculators/protein-rda' },
      { name: 'Macronutrient Splitter', desc: 'Allocate daily calories into protein, carbs, and dietary fat.', path: '/health-fitness-calculators/macro-split' },
      { name: 'Lean Body Mass (LBM)', desc: 'Estimate fat-free active tissue mass using stature formulas.', path: '/health-fitness-calculators/lbm' },
      { name: 'Fat-Free Mass Index (FFMI)', desc: 'Track height-normalized muscularity over training phases.', path: '/health-fitness-calculators/ffmi' },
      { name: 'One-Rep Max (1RM)', desc: 'Estimate lifting maximums from submaximal repetition sets.', path: '/health-fitness-calculators/1rm' },
      { name: 'Calorie Surplus Planner', desc: 'Plan a modest energy surplus to support muscular hypertrophy.', path: '/health-fitness-calculators/deficit' },
    ],
  },
  {
    id: 'improve-fitness',
    title: 'IMPROVE FITNESS',
    subtitle: 'Running Pace, Heart Rate, VO2 Max, Calories Burned, Training Metrics',
    description: 'Calculate common exercise and performance metrics using your selected inputs.',
    icon: 'directions_run',
    tools: [
      { name: 'Running Pace Calculator', desc: 'Calculate speed, mile splits, and projected race finishes.', path: '/health-fitness-calculators/running-pace' },
      { name: 'Target Heart Rate Zones', desc: 'Determine aerobic and threshold training intensities.', path: '/health-fitness-calculators/thr' },
      { name: 'VO2 Max Estimator', desc: 'Estimate aerobic capacity from standardized run test results.', path: '/health-fitness-calculators/vo2max' },
      { name: 'METs Calories Burned', desc: 'Calculate energy expenditure across 800+ physical activities.', path: '/health-fitness-calculators/mets' },
      { name: 'Cycling FTP & Wattage', desc: 'Determine functional threshold power and training watt zones.', path: '/health-fitness-calculators/ftp' },
    ],
  },
  {
    id: 'plan-nutrition',
    title: 'PLAN MY NUTRITION',
    subtitle: 'Calories, Protein, Macros, Water, BMR, TDEE',
    description: 'Estimate nutrition-related metrics using the assumptions selected in each calculator.',
    icon: 'nutrition',
    tools: [
      { name: 'Daily Calorie Needs', desc: 'Determine maintenance or target daily intake levels.', path: '/health-fitness-calculators/deficit' },
      { name: 'Protein Intake Calculator', desc: 'Calculate grams of daily protein adjusted for weight and activity.', path: '/health-fitness-calculators/protein-rda' },
      { name: 'Macro Distribution Split', desc: 'Convert total calories into balanced grams of macro groups.', path: '/health-fitness-calculators/macro-split' },
      { name: 'Daily Water Needs', desc: 'Estimate hydration targets factoring weight and daily workouts.', path: '/health-fitness-calculators/water-matrix' },
      { name: 'BMR Metabolic Rate', desc: 'Find your baseline metabolic floor before daily activity.', path: '/health-fitness-calculators/bmr' },
      { name: 'TDEE Energy Model', desc: 'Model total energy output including active exercise thermogenesis.', path: '/health-fitness-calculators/tdee' },
    ],
  },
  {
    id: 'improve-sleep',
    title: 'IMPROVE MY SLEEP',
    subtitle: 'Sleep Timing, Sleep Duration, Sleep Debt, Sleepiness Metrics',
    description: 'Explore sleep-related timing and duration calculations without treating them as medical diagnoses.',
    icon: 'bedtime',
    tools: [
      { name: 'Sleep Timing Calculator', desc: 'Explore bedtime and wake-up times using cycle models.', path: '/health-fitness-calculators/sleep-wake' },
      { name: 'Sleep Duration & Cycles', desc: 'Plan total hours in bed around 90-minute cycle estimates.', path: '/health-fitness-calculators/sleep-wake' },
      { name: 'Sleep Debt Accumulator', desc: 'Track cumulative differences between personal need and sleep time.', path: '/health-fitness-calculators/sleep-debt' },
      { name: 'Daytime Sleepiness (ESS)', desc: 'Complete the standardized 8-question somnolence questionnaire.', path: '/health-fitness-calculators/ess' },
    ],
  },
  {
    id: 'plan-pregnancy',
    title: 'PLAN PREGNANCY DATES',
    subtitle: 'Due Date, Gestational Age, Ovulation, Fertility Window, hCG Doubling',
    description: 'Calculate calendar-based pregnancy and cycle-related estimates and review the assumptions behind each result.',
    icon: 'child_friendly',
    tools: [
      { name: 'Pregnancy Due Date', desc: 'Estimate delivery dates via Naegele’s Rule from your LMP.', path: '/health-fitness-calculators/due-date' },
      { name: 'Ovulation & Fertile Window', desc: 'Calculate the approximate 6-day fertile window from cycle length.', path: '/health-fitness-calculators/ovulation' },
      { name: 'hCG Doubling Calculator', desc: 'Calculate the rate of rise and doubling hours between two lab values.', path: '/health-fitness-calculators/hcg' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 4. FEATURED HEALTH CALCULATORS (6-8 CORE TOOLS WITH WHAT/INPUT/OUTPUT)
// ---------------------------------------------------------------------------
export const FEATURED_HEALTH_TOOLS: FeaturedTool[] = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    category: 'Body & Weight',
    icon: 'straighten',
    path: '/health-fitness-calculators/bmi',
    problemSolved: 'Provides a quick, standardized preliminary screening of body size relative to height.',
    userEnters: 'Height (cm or ft/in) and body weight (kg or lbs).',
    userReceives: 'BMI numeric score, standard WHO classification category, and healthy weight baseline range.',
  },
  {
    id: 'tdee',
    name: 'TDEE Calculator',
    category: 'Calories & Nutrition',
    icon: 'local_fire_department',
    path: '/health-fitness-calculators/tdee',
    problemSolved: 'Estimates how many total calories your body expends daily to help plan energy balance.',
    userEnters: 'Age, biological sex, height, weight, and general physical activity level.',
    userReceives: 'Estimated maintenance calories, resting BMR, and breakdown across activity components.',
  },
  {
    id: 'bmr',
    name: 'BMR Calculator',
    category: 'Calories & Nutrition',
    icon: 'speed',
    path: '/health-fitness-calculators/bmr',
    problemSolved: 'Estimates minimum energy expenditure required to sustain vital organ functions at rest.',
    userEnters: 'Age, biological sex, height, and body weight.',
    userReceives: 'Resting calories per day via Mifflin-St Jeor and Harris-Benedict formulas.',
  },
  {
    id: 'navy-fat',
    name: 'Body Fat Calculator',
    category: 'Body & Weight',
    icon: 'accessibility_new',
    path: '/health-fitness-calculators/navy-fat',
    problemSolved: 'Estimates body composition without requiring expensive imaging scans or skinfold calipers.',
    userEnters: 'Height, neck circumference, waist circumference, and hip circumference (for females).',
    userReceives: 'Estimated body fat percentage, lean body mass, and fat mass in kilograms or pounds.',
  },
  {
    id: 'running-pace',
    name: 'Running Pace Calculator',
    category: 'Fitness & Training',
    icon: 'directions_run',
    path: '/health-fitness-calculators/running-pace',
    problemSolved: 'Translates running times and distances into actionable training paces and race target splits.',
    userEnters: 'Any two of: distance, total finish time, or desired running pace.',
    userReceives: 'Calculated pace per km/mile, speed in km/h or mph, and projected split times for 5K to marathon.',
  },
  {
    id: 'protein-rda',
    name: 'Protein Calculator',
    category: 'Calories & Nutrition',
    icon: 'egg_alt',
    path: '/health-fitness-calculators/protein-rda',
    problemSolved: 'Determines daily dietary protein targets based on body weight and personal exercise habits.',
    userEnters: 'Body weight, activity level, and primary training objective (endurance, maintenance, or strength).',
    userReceives: 'Recommended daily protein range in grams, per-meal targets, and grams per kilogram ratios.',
  },
  {
    id: 'water-matrix',
    name: 'Water Intake Calculator',
    category: 'Calories & Nutrition',
    icon: 'water_drop',
    path: '/health-fitness-calculators/water-matrix',
    problemSolved: 'Estimates daily fluid requirements accounting for body mass, ambient weather, and exercise.',
    userEnters: 'Body weight, workout duration, and environmental climate (moderate or hot/humid).',
    userReceives: 'Recommended daily fluid baseline in liters and ounces, plus workout hydration additions.',
  },
  {
    id: 'due-date',
    name: 'Pregnancy Due Date Calculator',
    category: 'Pregnancy & Family Planning',
    icon: 'child_care',
    path: '/health-fitness-calculators/due-date',
    problemSolved: 'Calculates the estimated date of delivery and current gestational age based on cycle timing.',
    userEnters: 'First day of last menstrual period (LMP) and average menstrual cycle length.',
    userReceives: 'Estimated due date (EDD), current gestational week and day, and trimester milestone schedule.',
  },
];

// ---------------------------------------------------------------------------
// 5. HEALTH CATEGORIES DIRECTORY (7 CATEGORIES FROM PROMPT)
// ---------------------------------------------------------------------------
export const HEALTH_CATEGORIES_DIRECTORY: HealthCategory[] = [
  {
    id: 'body-weight',
    name: 'Body & Weight',
    slug: 'body-weight',
    icon: 'accessibility',
    description: 'Calculate common body-size and body-composition metrics using clearly stated formulas and stated reference ranges.',
    tools: [
      { name: 'BMI Calculator', desc: 'Standard & Asian reference cutoffs for body mass index.', path: '/health-fitness-calculators/bmi' },
      { name: 'Body Fat Calculator', desc: 'U.S. Navy circumference method for men and women.', path: '/health-fitness-calculators/navy-fat' },
      { name: 'Ideal Body Weight (IBW)', desc: 'Comparison of Devine, Robinson, and Hamwi formulas.', path: '/health-fitness-calculators/ibw' },
      { name: 'Lean Body Mass (LBM)', desc: 'Estimate active tissue mass excluding stored body fat.', path: '/health-fitness-calculators/lbm' },
      { name: 'Fat-Free Mass Index (FFMI)', desc: 'Normalize muscularity against height for training progress.', path: '/health-fitness-calculators/ffmi' },
      { name: 'Waist-to-Height Ratio (WHtR)', desc: 'Screen central adiposity with the Ashwell boundary curve.', path: '/health-fitness-calculators/whtr' },
      { name: 'Waist-to-Hip Ratio (WHR)', desc: 'Evaluate android vs. gynoid body fat distribution patterns.', path: '/health-fitness-calculators/whr' },
      { name: 'Body Surface Area (BSA)', desc: 'Du Bois and Mosteller formulas for external skin surface area.', path: '/health-fitness-calculators/bsa' },
      { name: 'A Body Shape Index (ABSI)', desc: 'Adjusts BMI for waist circumference to evaluate shape metrics.', path: '/health-fitness-calculators/absi' },
    ],
  },
  {
    id: 'nutrition',
    name: 'Calories & Nutrition',
    slug: 'nutrition',
    icon: 'restaurant_menu',
    description: 'Estimate daily energy and nutrition-related metrics from user-selected assumptions and stated activity levels.',
    tools: [
      { name: 'Calorie Needs Planner', desc: 'Simulate steady caloric deficits, maintenance, or surpluses.', path: '/health-fitness-calculators/deficit' },
      { name: 'BMR Calculator', desc: 'Mifflin-St Jeor basal metabolic energy at complete rest.', path: '/health-fitness-calculators/bmr' },
      { name: 'TDEE Daily Calorie Model', desc: 'Factor in BMR, exercise volume, and non-exercise daily movement.', path: '/health-fitness-calculators/tdee' },
      { name: 'Macronutrient Splitter', desc: 'Convert daily calorie targets into grams of protein, carbs, and fat.', path: '/health-fitness-calculators/macro-split' },
      { name: 'Protein Intake Calculator', desc: 'Compare baseline dietary reference intakes with sports nutrition guidelines.', path: '/health-fitness-calculators/protein-rda' },
      { name: 'Daily Water Needs', desc: 'Calculate fluid baselines adjusted for body mass and workout duration.', path: '/health-fitness-calculators/water-matrix' },
      { name: 'Carb Cycling Calculator', desc: 'Plan higher carb workout days and lower carb recovery rest days.', path: '/health-fitness-calculators/carb-cycling' },
      { name: 'Keto Macro Matrix', desc: 'Formulate ketogenic macronutrient ratios and net carbohydrate caps.', path: '/health-fitness-calculators/keto' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Training',
    slug: 'fitness',
    icon: 'directions_run',
    description: 'Calculate common training, performance, pace, strength, and exercise metrics based on your provided inputs.',
    tools: [
      { name: 'Running Pace & Splits', desc: 'Pace conversions and finish projections for 5K to marathon.', path: '/health-fitness-calculators/running-pace' },
      { name: 'One-Rep Max (1RM)', desc: 'Predict maximal lifting thresholds safely without testing to failure.', path: '/health-fitness-calculators/1rm' },
      { name: 'VO2 Max Estimator', desc: 'Cooper 12-minute run field test for aerobic capacity.', path: '/health-fitness-calculators/vo2max' },
      { name: 'METs Calories Burned', desc: 'Convert 800+ physical activities into metabolic energy equivalents.', path: '/health-fitness-calculators/mets' },
      { name: 'Cycling FTP & Power Zones', desc: 'Determine 7 training power zones from 20-minute field test values.', path: '/health-fitness-calculators/ftp' },
      { name: 'Rucking & Pack Walking', desc: 'Pandolf metabolic load equation factoring pack load and incline.', path: '/health-fitness-calculators/rucking' },
    ],
  },
  {
    id: 'heart-vitals',
    name: 'Heart & Vitals',
    slug: 'heart-vitals',
    icon: 'favorite',
    description: 'Calculate selected cardiovascular and vital-sign metrics. Results are informational and should be interpreted in context.',
    tools: [
      { name: 'Target Heart Rate (Karvonen)', desc: 'Calibrate training zones against measured resting heart rate.', path: '/health-fitness-calculators/thr' },
      { name: 'Zone 2 Aerobic Base', desc: 'Target heart rate boundaries for sustainable endurance training.', path: '/health-fitness-calculators/zone2' },
      { name: 'Mean Arterial Pressure (MAP)', desc: 'Average organ perfusion pressure across one cardiac cycle.', path: '/health-fitness-calculators/map' },
      { name: 'Heart Rate Recovery (HRR)', desc: 'Drop in heart rate after 1 and 2 minutes of post-exercise recovery.', path: '/health-fitness-calculators/hrr' },
      { name: 'Pulse Pressure', desc: 'Difference between systolic and diastolic resting blood pressure.', path: '/health-fitness-calculators/pulse-pressure' },
      { name: 'Max Heart Rate (Tanaka)', desc: 'Age-regression model replacing the traditional 220-age rule.', path: '/health-fitness-calculators/max-hr' },
    ],
  },
  {
    id: 'sleep',
    name: 'Sleep & Recovery',
    slug: 'sleep',
    icon: 'bedtime',
    description: 'Explore sleep duration and timing calculations using clearly stated assumptions and simplified planning models.',
    tools: [
      { name: 'Sleep Cycle Wake Time', desc: 'Align bedtimes and wake times with standard 90-minute sleep cycles.', path: '/health-fitness-calculators/sleep-wake' },
      { name: 'Sleep Debt Accumulator', desc: 'Quantify cumulative differences between personal need and sleep time.', path: '/health-fitness-calculators/sleep-debt' },
      { name: 'Daytime Sleepiness Scale (ESS)', desc: 'Standard 8-question screening questionnaire for daytime somnolence.', path: '/health-fitness-calculators/ess' },
    ],
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy & Family Planning',
    slug: 'pregnancy',
    icon: 'child_care',
    description: 'Estimate calendar dates and selected pregnancy or cycle-related metrics from the information entered.',
    tools: [
      { name: 'Pregnancy Due Date', desc: 'Estimate delivery dates with Naegele’s Rule from your LMP.', path: '/health-fitness-calculators/due-date' },
      { name: 'Ovulation & Fertile Window', desc: 'Estimate fertile days assuming a typical 14-day luteal phase.', path: '/health-fitness-calculators/ovulation' },
      { name: 'Beta hCG Doubling Time', desc: 'Evaluate doubling kinetics between two quantitative hCG lab values.', path: '/health-fitness-calculators/hcg' },
    ],
  },
  {
    id: 'specialized',
    name: 'Specialized Health Calculators',
    slug: 'specialized',
    icon: 'biotech',
    description: 'Explore specialized mathematical health metrics with formula details, documented assumptions, and stated limitations.',
    tools: [
      { name: 'Body Surface Area (BSA)', desc: 'Clinical area calculations used in physiology and pharmacology.', path: '/health-fitness-calculators/bsa' },
      { name: 'A Body Shape Index (ABSI)', desc: 'Explore research context adjusting BMI for abdominal circumference.', path: '/health-fitness-calculators/absi' },
      { name: 'Weight Loss Velocity Model', desc: 'Simulate non-linear weight changes over multi-week planning windows.', path: '/health-fitness-calculators/velocity' },
      { name: 'Fat-Free Mass Index (FFMI)', desc: 'Stature-normalized muscularity for natural athletes.', path: '/health-fitness-calculators/ffmi' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 6. HEALTH METHODS & FORMULAS (TRANSPARENT SCIENTIFIC FORMULAS)
// ---------------------------------------------------------------------------
export const HEALTH_FORMULAS: FormulaSpec[] = [
  {
    name: 'Mifflin-St Jeor (Basal Metabolic Rate)',
    whatItCalculates: 'Resting energy expenditure (kcal/day) at complete thermal and physical rest.',
    inputs: 'Weight (kg), Height (cm), Age (years), Biological Sex.',
    formula: 'Men: (10 × W) + (6.25 × H) - (5 × A) + 5\nWomen: (10 × W) + (6.25 × H) - (5 × A) - 161',
    units: 'kcal / 24 hours',
    assumptions: 'Assumes standard ambient room temperature and normal thyroid/metabolic function.',
    limitations: 'May underestimate energy expenditure in heavily muscled athletes or overestimate in severe sarcopenia.',
    source: 'American Journal of Clinical Nutrition',
    year: '1990',
  },
  {
    name: 'Karvonen Method (Target Heart Rate)',
    whatItCalculates: 'Heart rate training zones customized to the individual’s true resting heart rate reserve.',
    inputs: 'Resting Heart Rate (BPM), Age (years), Desired Intensity (%).',
    formula: 'THR = [(Max HR - Resting HR) × % Intensity] + Resting HR\nMax HR = 208 - (0.7 × Age)',
    units: 'Beats Per Minute (BPM)',
    assumptions: 'Assumes heart rate reserve correlates linearly with percentage of VO2 reserve.',
    limitations: 'Medications affecting heart rate (such as beta-blockers) invalidate standard calculations.',
    source: 'Scandinavian Journal of Clinical and Laboratory Investigation',
    year: '1957 / Tanaka 2001',
  },
  {
    name: 'Du Bois & Du Bois (Body Surface Area)',
    whatItCalculates: 'Total external human body surface area in square meters.',
    inputs: 'Weight (kg), Height (cm).',
    formula: 'BSA (m²) = 0.007184 × Weight^0.425 × Height^0.725',
    units: 'Square meters (m²)',
    assumptions: 'Exponential regression based on geometric plaster casts of human subjects.',
    limitations: 'Original sample size was small (9 subjects); modern clinical practice often uses Mosteller as well.',
    source: 'Archives of Internal Medicine',
    year: '1916',
  },
  {
    name: 'Brzycki Formula (One-Rep Max)',
    whatItCalculates: 'Theoretical 1-repetition maximum lifting capacity from submaximal repetitions.',
    inputs: 'Weight Lifted (kg or lbs), Repetitions Completed.',
    formula: '1RM = Weight / [1.0278 - (0.0278 × Repetitions)]',
    units: 'Kilograms or Pounds',
    assumptions: 'Assumes linear relationship between repetitions to fatigue and percentage of 1RM.',
    limitations: 'Accuracy decreases significantly when repetitions exceed 10 reps.',
    source: 'Journal of Physical Education, Recreation & Dance',
    year: '1993',
  },
  {
    name: 'Fat-Free Mass Index (FFMI)',
    whatItCalculates: 'Muscular tissue mass normalized for height, independent of body fat.',
    inputs: 'Total Weight (kg), Body Fat Percentage (%), Height (meters).',
    formula: 'FFM = Weight × [1 - (Body Fat% / 100)]\nFFMI = [FFM / Height²] + 6.1 × (1.8 - Height)',
    units: 'kg / m²',
    assumptions: 'Normalizes lean tissue to a reference height of 1.80 meters.',
    limitations: 'Highly dependent on the accuracy of the underlying body fat measurement method.',
    source: 'Clinical Journal of Sport Medicine (Kouri et al.)',
    year: '1995',
  },
  {
    name: 'Mean Arterial Pressure (MAP)',
    whatItCalculates: 'Time-weighted average blood pressure in arteries during one complete cardiac cycle.',
    inputs: 'Systolic Blood Pressure (mmHg), Diastolic Blood Pressure (mmHg).',
    formula: 'MAP = Diastolic BP + [1/3 × (Systolic BP - Diastolic BP)]',
    units: 'Millimeters of mercury (mmHg)',
    assumptions: 'Assumes diastole accounts for approximately two-thirds of the resting cardiac cycle.',
    limitations: 'At elevated heart rates (e.g. during exercise), diastole shortens and the 1/3 fraction shifts.',
    source: 'Cardiovascular Physiology Principles',
    year: 'Standard Medical Physiology',
  },
  {
    name: 'Tanaka Equation (Maximum Heart Rate)',
    whatItCalculates: 'Age-predicted maximum achievable heart rate under maximal exertion.',
    inputs: 'Age (years).',
    formula: 'Max HR = 208 - (0.7 × Age)',
    units: 'Beats Per Minute (BPM)',
    assumptions: 'Meta-analysis regression over 351 studies and 18,712 subjects across all adult age groups.',
    limitations: 'Standard error of estimate is approximately ±10 BPM; individual true max HR varies.',
    source: 'Journal of the American College of Cardiology',
    year: '2001',
  },
  {
    name: 'Ashwell Waist-to-Height Ratio (WHtR)',
    whatItCalculates: 'Abdominal obesity screening relative to stature.',
    inputs: 'Waist Circumference (cm or in), Height (cm or in).',
    formula: 'WHtR = Waist Circumference / Height',
    units: 'Dimensionless ratio',
    assumptions: 'Boundary ratio of 0.50 ("keep your waist circumference to less than half your height").',
    limitations: 'Tape measurement technique and exact anatomical waist landmark must be consistent.',
    source: 'Obesity Reviews (Ashwell & Gibson)',
    year: '2016',
  },
];

// ---------------------------------------------------------------------------
// 7. SOURCES & TRUST ARCHITECTURE (REAL CITATIONS, NO FAKE BADGES)
// ---------------------------------------------------------------------------
export const HEALTH_SOURCES_TRUST: HealthSourceTrust[] = [
  {
    organization: 'CDC',
    fullName: 'Centers for Disease Control and Prevention',
    scope: 'Adult and Pediatric BMI Reference Guidelines & Cutoff Categories',
    guideline: 'Body Mass Index: Considerations for Practitioners',
    lastReviewed: 'September 2026',
    referenceUrl: 'https://www.cdc.gov/healthyweight/assessing/bmi/',
  },
  {
    organization: 'WHO',
    fullName: 'World Health Organization',
    scope: 'International Classification of Adult Underweight, Overweight & Obesity',
    guideline: 'WHO Technical Report Series 894 & Regional Asian Cutoffs',
    lastReviewed: 'September 2026',
    referenceUrl: 'https://www.who.gov/data/gho/data/themes/topics/topic-details/GHO/body-mass-index',
  },
  {
    organization: 'ACOG',
    fullName: 'American College of Obstetricians and Gynecologists',
    scope: 'Methods for Estimating the Due Date & Gestational Age Calculation',
    guideline: 'ACOG Committee Opinion No. 700: Methods for Estimating the Due Date',
    lastReviewed: 'September 2026',
    referenceUrl: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date',
  },
  {
    organization: 'ACSM',
    fullName: 'American College of Sports Medicine',
    scope: 'Cardiovascular Exercise Testing, Heart Rate Zones & Training Guidelines',
    guideline: 'ACSM’s Guidelines for Exercise Testing and Prescription (11th Edition)',
    lastReviewed: 'September 2026',
    referenceUrl: 'https://www.acsm.org/education-resources/books/guidelines-exercise-testing-prescription',
  },
  {
    organization: 'NASEM',
    fullName: 'National Academies of Sciences, Engineering, and Medicine',
    scope: 'Dietary Reference Intakes (DRIs) for Energy, Protein, Carbohydrates & Fluids',
    guideline: 'Dietary Reference Intakes for Electrolytes and Water / Macronutrients',
    lastReviewed: 'September 2026',
    referenceUrl: 'https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-nutrients',
  },
  {
    organization: 'NIH',
    fullName: 'National Institutes of Health (NIDDK)',
    scope: 'Mathematical Modeling of Human Metabolism and Energy Balance Dynamics',
    guideline: 'Hall et al. Quantification of the effect of energy imbalance on bodyweight',
    lastReviewed: 'September 2026',
    referenceUrl: 'https://www.niddk.nih.gov/research-funding/at-niddk/labs-branches/lmb/integrative-physiology-section',
  },
];

// ---------------------------------------------------------------------------
// 8. HEALTH CALCULATION GUIDES
// ---------------------------------------------------------------------------
export const HEALTH_CALCULATION_GUIDES: HealthGuide[] = [
  {
    title: 'What Does BMI Actually Measure?',
    description: 'Learn why BMI is a statistical screening metric for body size, how the formula works, and why it cannot differentiate muscle from adipose tissue.',
    readTime: '4 min read',
    toolPath: '/health-fitness-calculators/bmi',
    toolName: 'BMI Calculator',
  },
  {
    title: 'How Is BMR Calculated & What Does It Mean?',
    description: 'Explore the Mifflin-St Jeor resting energy expenditure equation and discover how age, sex, and weight determine your baseline metabolic floor.',
    readTime: '5 min read',
    toolPath: '/health-fitness-calculators/bmr',
    toolName: 'BMR Calculator',
  },
  {
    title: 'What Is the Difference Between BMR and TDEE?',
    description: 'Understand how daily movement, exercise activity, and the thermic effect of food transform baseline BMR into total daily energy expenditure.',
    readTime: '6 min read',
    toolPath: '/health-fitness-calculators/tdee',
    toolName: 'TDEE Calculator',
  },
  {
    title: 'How Does a Body-Fat Calculator Work?',
    description: 'Review the U.S. Navy circumference method, understand what tape measurements proxy, and learn why water retention affects tape readings.',
    readTime: '5 min read',
    toolPath: '/health-fitness-calculators/navy-fat',
    toolName: 'Body Fat Calculator',
  },
  {
    title: 'How Is Running Pace and Split Timing Calculated?',
    description: 'Learn how to convert minutes per mile to kilometers per hour, plan negative splits, and project finish times using Riegel’s power law.',
    readTime: '4 min read',
    toolPath: '/health-fitness-calculators/running-pace',
    toolName: 'Running Pace Calculator',
  },
  {
    title: 'How Are Heart Rate Training Zones Calculated?',
    description: 'Compare the traditional 220-age percentage formula against the Karvonen heart rate reserve method to understand aerobic and anaerobic zones.',
    readTime: '5 min read',
    toolPath: '/health-fitness-calculators/thr',
    toolName: 'Heart Rate Calculator',
  },
  {
    title: 'How Does a Due-Date Calculator Work?',
    description: 'Explore Naegele’s Rule for pregnancy dating, how cycle variations adjust delivery dates, and why ultrasound measurements refine clinical dates.',
    readTime: '4 min read',
    toolPath: '/health-fitness-calculators/due-date',
    toolName: 'Due Date Calculator',
  },
  {
    title: 'What Does FFMI Measure for Natural Athletes?',
    description: 'Discover how Fat-Free Mass Index normalizes muscular development for stature and why it provides deeper insight than scale weight alone.',
    readTime: '5 min read',
    toolPath: '/health-fitness-calculators/ffmi',
    toolName: 'FFMI Calculator',
  },
  {
    title: 'How Is Mean Arterial Pressure (MAP) Calculated?',
    description: 'Understand why MAP is not a simple mathematical average of systolic and diastolic readings and how organ perfusion pressure is modeled.',
    readTime: '4 min read',
    toolPath: '/health-fitness-calculators/map',
    toolName: 'MAP Calculator',
  },
  {
    title: 'What Is A Body Shape Index (ABSI)?',
    description: 'Read the epidemiological research behind ABSI, how it adjusts BMI for abdominal waist circumference, and its stated observational limitations.',
    readTime: '5 min read',
    toolPath: '/health-fitness-calculators/absi',
    toolName: 'ABSI Calculator',
  },
];

// ---------------------------------------------------------------------------
// 9. HEALTH FAQS (RESPONSIBLE, ACCURATE, UNBIASED)
// ---------------------------------------------------------------------------
export const HEALTH_FAQS: HealthFaq[] = [
  {
    q: 'What health calculators are available on SolveItCalculator?',
    a: 'We provide over 35 transparent, formula-driven calculators organized across Body & Weight, Calories & Nutrition, Fitness & Training, Heart & Vitals, Sleep & Recovery, and Pregnancy & Family Planning. Each tool provides transparent formula explanations and stated assumptions.',
  },
  {
    q: 'Are SolveItCalculator health calculators free to use?',
    a: 'Yes. All calculators on SolveItCalculator are completely free to use with no account registration, subscriptions, or paywalls required.',
  },
  {
    q: 'How do these health calculators work?',
    a: 'Each calculator takes user-entered numerical inputs (such as height, weight, age, or exercise durations) and processes them through documented mathematical formulas (such as Mifflin-St Jeor for BMR, Karvonen for heart rate, or Naegele’s rule for pregnancy dates) to produce formula-based estimates.',
  },
  {
    q: 'How accurate are health calculator results?',
    a: 'Calculator results are mathematical estimates based on population averages and specific formula assumptions. They provide helpful planning baselines, but they cannot account for individual biological nuances such as metabolic adaptation, hormonal variations, genetics, or medication effects.',
  },
  {
    q: 'Why can two calculators produce different results for the same inputs?',
    a: 'Different calculators frequently use different underlying formulas, activity multipliers, reference populations, or rounding conventions. For example, a BMR calculator using the Mifflin-St Jeor formula will produce a slightly different number than one using the Harris-Benedict or Katch-McArdle equation.',
  },
  {
    q: 'Does BMI measure body fat percentage?',
    a: 'No. BMI is a screening ratio calculated strictly from height and weight. It does not measure body fat directly and cannot distinguish between fat mass, skeletal muscle mass, bone density, or fluid retention.',
  },
  {
    q: 'What is the difference between BMR and TDEE?',
    a: 'Basal Metabolic Rate (BMR) is the estimated number of calories burned at complete physical rest just to sustain vital organ function. Total Daily Energy Expenditure (TDEE) includes BMR plus the calories burned through non-exercise daily movement, deliberate workout exercise, and digesting food.',
  },
  {
    q: 'Are calorie calculators exact?',
    a: 'No. Calorie calculators provide helpful planning estimates. True daily energy expenditure can fluctuate day-to-day based on spontaneous physical activity, ambient temperature, sleep quality, and individual metabolic efficiency.',
  },
  {
    q: 'Can a health calculator diagnose a medical condition?',
    a: 'No. Calculator outputs are strictly informational and mathematical tools. They are not diagnostic assessments and should never substitute for clinical evaluation, laboratory tests, or professional medical diagnosis.',
  },
  {
    q: 'Are pregnancy due-date calculator results exact delivery dates?',
    a: 'No. Due-date calculators provide an estimated date of delivery (EDD) assuming a standard 280-day gestation from the first day of your last menstrual period. Only a small percentage of babies are born on their exact calculated due date, and clinical ultrasound scans often adjust the date.',
  },
  {
    q: 'Do sleep-cycle calculators guarantee better sleep or eliminate grogginess?',
    a: 'No. Sleep cycle calculators use a simplified model assuming typical 90-minute sleep cycles. However, individual sleep cycle lengths naturally vary between people and across different stages of the night. They are planning guidelines, not guaranteed sleep optimizations.',
  },
  {
    q: 'How are the formulas on SolveItCalculator selected?',
    a: 'We select formulas with established documentation in peer-reviewed clinical, physiological, and sports medicine literature (such as publications in the American Journal of Clinical Nutrition, Journal of the American College of Cardiology, and ACOG clinical opinions).',
  },
  {
    q: 'Can I see the calculation method and formula used?',
    a: 'Yes. Every calculator page and our category methods section explicitly displays the underlying formula, input requirements, measurement units, assumptions, and known limitations.',
  },
  {
    q: 'Where do health-related reference ranges and guidelines come from?',
    a: 'Reference ranges displayed on our tools are drawn from recognized public health and clinical authorities including the CDC, WHO, ACSM, ACOG, and NASEM.',
  },
  {
    q: 'Are these calculators a substitute for professional medical advice?',
    a: 'No. The calculators and educational guides provided on SolveItCalculator are for informational and planning purposes only. Always consult a qualified physician or healthcare provider regarding any health concerns, diagnosis, or treatment decisions.',
  },
];
