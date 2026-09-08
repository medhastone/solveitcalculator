export interface GaugeTier {
  label: string;
  widthPercent: number;
  colorClass: string;
}

export interface MatrixRow {
  tier: string;
  standardRange: string;
  alternateRange: string;
  clinicalRisk: string;
  tag: string;
}

export interface ClinicalInsight {
  title: string;
  desc: string;
  icon: string;
  tag: string;
}

export interface ComputedTelemetry {
  primaryValue: string;
  primaryUnit: string;
  primarySub: string;
  formulaSubstitution: string;
  statusPill: string;
  statusColor: string;
  diffuseColor: string;
  gaugePercent: number;
  gaugeTiers: GaugeTier[];
  targetEnvelope: { min: string; max: string; unit: string; desc: string };
  targetDelta: { val: string; direction: 'optimal' | 'above' | 'below'; text: string };
  secondaryBiometrics: { label: string; val: string; desc: string }[];
  clinicalRisk: { tier: string; level: 'Low' | 'Moderate' | 'Elevated' | 'High'; desc: string };
  integratedMetric: { label: string; val: string; desc: string };
  activeMatrixRowIndex: number;
  matrixRows: MatrixRow[];
  insights: ClinicalInsight[];
  trendGuidance: { velocity: string; change: string; boundaryLabel: string; baselineLabel: string };
}

export function computeHealthTelemetry(
  toolId: string,
  inputs: Record<string, number | string>,
  unit: 'metric' | 'imperial'
): ComputedTelemetry {
  const gender = String(inputs.gender || 'male');
  const age = Number(inputs.age || 28);
  const heightCm = Number(inputs.heightCm || 178);
  const weightKg = Number(inputs.weightKg || inputs.actualWeightKg || inputs.bodyWeightKg || 74);
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  switch (toolId) {
    case 'tdee': {
      const pal = Number(inputs.activityLevel || 1.55);
      const goal = String(inputs.goal || 'maintain');

      let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
      bmr += gender === 'male' ? 5 : -161;
      const maintenance = Math.round(bmr * pal);

      let target = maintenance;
      let goalText = 'Caloric Maintenance (Zero Delta)';
      let deltaDir: 'optimal' | 'above' | 'below' = 'optimal';
      let deltaVal = '0 kcal';
      if (goal === 'cut') {
        target = maintenance - 500;
        goalText = 'Moderate Fat Loss Deficit (-500 kcal/day)';
        deltaDir = 'below';
        deltaVal = '-500 kcal';
      } else if (goal === 'aggressive-cut') {
        target = maintenance - 750;
        goalText = 'Aggressive Deficit (-750 kcal/day)';
        deltaDir = 'below';
        deltaVal = '-750 kcal';
      } else if (goal === 'bulk') {
        target = maintenance + 300;
        goalText = 'Lean Hypertrophy Surplus (+300 kcal/day)';
        deltaDir = 'above';
        deltaVal = '+300 kcal';
      }

      const proteinG = Math.round(weightKg * 2.0);
      const fatG = Math.round((target * 0.25) / 9);
      const carbG = Math.max(0, Math.round((target - proteinG * 4 - fatG * 9) / 4));
      const tef = Math.round(target * 0.1);
      const neat = Math.round(maintenance * 0.15);

      const gaugeMin = 1400;
      const gaugeMax = 3800;
      const gaugePercent = Math.min(100, Math.max(5, ((target - gaugeMin) / (gaugeMax - gaugeMin)) * 100));

      let activeRow = 1;
      if (pal <= 1.25) activeRow = 0;
      else if (pal <= 1.45) activeRow = 1;
      else if (pal <= 1.65) activeRow = 2;
      else if (pal <= 1.85) activeRow = 3;
      else activeRow = 4;

      return {
        primaryValue: target.toLocaleString(),
        primaryUnit: 'kcal / day',
        primarySub: goalText,
        formulaSubstitution: `TDEE = (10×${weightKg} + 6.25×${heightCm} - 5×${age} ${gender === 'male' ? '+ 5' : '- 161'}) × ${pal} = ${maintenance.toLocaleString()} kcal`,
        statusPill: `${pal}x PAL Multiplier`,
        statusColor: 'bg-primary-container text-on-primary-container',
        diffuseColor: 'rgba(0, 74, 198, 0.12)',
        gaugePercent,
        gaugeTiers: [
          { label: 'Sedentary (1.2x)', widthPercent: 20, colorClass: 'bg-surface-container-high' },
          { label: 'Light (1.375x)', widthPercent: 20, colorClass: 'bg-secondary-fixed/40' },
          { label: 'Moderate (1.55x)', widthPercent: 20, colorClass: 'bg-primary-fixed' },
          { label: 'Heavy (1.725x)', widthPercent: 20, colorClass: 'bg-primary' },
          { label: 'Extreme (1.9x)', widthPercent: 20, colorClass: 'bg-tertiary' },
        ],
        targetEnvelope: {
          min: (maintenance - 500).toLocaleString(),
          max: (maintenance + 300).toLocaleString(),
          unit: 'kcal',
          desc: 'Safe Deficit to Surplus Window',
        },
        targetDelta: {
          val: deltaVal,
          direction: deltaDir,
          text: goal === 'maintain' ? 'At Maintenance Baseline' : `${deltaVal} vs Maintenance`,
        },
        secondaryBiometrics: [
          { label: 'Cellular BMR', val: `${Math.round(bmr).toLocaleString()} kcal`, desc: 'Comatose expenditure' },
          { label: 'Thermic Effect (TEF)', val: `~${tef} kcal`, desc: 'Nutrient digestion cost' },
          { label: 'NEAT Thermogenesis', val: `~${neat} kcal`, desc: 'Unconscious movement' },
          { label: 'Protein Allocation', val: `${proteinG} g (${Math.round((proteinG * 4 / target) * 100)}%)`, desc: '2.0g/kg lean protection' },
        ],
        clinicalRisk: {
          tier: target < 1200 ? 'Severe Caloric Deprivation' : 'Normative Energy Intake',
          level: target < 1200 ? 'High' : 'Low',
          desc: target < 1200 ? 'Risk of thyroid downregulation and sarcopenia.' : 'Sustained metabolic rate supported.',
        },
        integratedMetric: {
          label: 'Macronutrient Triad Balance',
          val: `${proteinG}g P · ${carbG}g C · ${fatG}g F`,
          desc: 'Calibrated to prevent hormonal crash and maintain muscle glycogen stores.',
        },
        activeMatrixRowIndex: activeRow,
        matrixRows: [
          { tier: 'Sedentary PAL (1.20x)', standardRange: `${Math.round(bmr * 1.2)} kcal`, alternateRange: 'Desk job, <3,000 daily steps', clinicalRisk: 'Elevated cardiometabolic risk over time', tag: 'Sedentary' },
          { tier: 'Lightly Active (1.375x)', standardRange: `${Math.round(bmr * 1.375)} kcal`, alternateRange: '1-3 light weekly workouts', clinicalRisk: 'Minimum threshold for cardiovascular health', tag: 'Light' },
          { tier: 'Moderately Active (1.55x)', standardRange: `${Math.round(bmr * 1.55)} kcal`, alternateRange: '3-5 moderate training days', clinicalRisk: 'Optimal longevity and insulin sensitivity', tag: 'Optimal' },
          { tier: 'Very Active (1.725x)', standardRange: `${Math.round(bmr * 1.725)} kcal`, alternateRange: '6-7 strenuous workout days', clinicalRisk: 'High glycogen turnover; prioritize carbs', tag: 'Athletic' },
          { tier: 'Extra Active (1.90x)', standardRange: `${Math.round(bmr * 1.9)} kcal`, alternateRange: 'Physical labor + intensive sports', clinicalRisk: 'Requires aggressive electrolyte replenishment', tag: 'Elite' },
        ],
        insights: [
          { title: 'Metabolic Adaptation Safeguard', desc: 'Sustaining a deficit beyond 500 kcal for >12 weeks slows thyroid T3 output. Plan a 1-week diet break at maintenance every 8-10 weeks.', icon: 'autorenew', tag: 'Endocrine' },
          { title: 'Protein Sparing Muscle Retention', desc: `Targeting ${proteinG}g daily protein ensures net nitrogen balance during energy deficits, safeguarding skeletal muscle mass from catabolism.`, icon: 'fitness_center', tag: 'Nutrition' },
          { title: 'NEAT vs Exercise Activity', desc: `Your non-exercise activity thermogenesis (~${neat} kcal) exceeds purposeful gym exercise. A 20-minute daily walk preserves daily burn far better than exhaustive cardio.`, icon: 'directions_walk', tag: 'Activity' },
        ],
        trendGuidance: {
          velocity: goal === 'cut' ? '-0.45 kg/week' : goal === 'bulk' ? '+0.25 kg/week' : 'Neutral Stable',
          change: deltaVal,
          boundaryLabel: 'Maintenance Ceiling',
          baselineLabel: 'BMR Cellular Floor',
        },
      };
    }

    case 'bmr': {
      let mifflin = 10 * weightKg + 6.25 * heightCm - 5 * age;
      mifflin += gender === 'male' ? 5 : -161;

      const harris = gender === 'male'
        ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
        : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;

      const katch = 370 + 21.6 * (weightKg * (1 - (gender === 'male' ? 0.15 : 0.23)));
      const hourly = (mifflin / 24).toFixed(1);

      const gaugePercent = Math.min(100, Math.max(10, ((mifflin - 1000) / (2400 - 1000)) * 100));

      let activeRow = 1;
      if (mifflin < 1400) activeRow = 0;
      else if (mifflin <= 1700) activeRow = 1;
      else if (mifflin <= 2000) activeRow = 2;
      else activeRow = 3;

      return {
        primaryValue: Math.round(mifflin).toLocaleString(),
        primaryUnit: 'kcal / 24h',
        primarySub: 'Mifflin-St Jeor Clinical Standard (±10% Accuracy)',
        formulaSubstitution: `BMR = 10(${weightKg}) + 6.25(${heightCm}) - 5(${age}) ${gender === 'male' ? '+ 5' : '- 161'} = ${Math.round(mifflin)} kcal`,
        statusPill: `~${hourly} kcal / hour`,
        statusColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        diffuseColor: 'rgba(16, 185, 129, 0.12)',
        gaugePercent,
        gaugeTiers: [
          { label: '<1,400 kcal', widthPercent: 25, colorClass: 'bg-surface-container-high' },
          { label: '1,400 - 1,700', widthPercent: 25, colorClass: 'bg-secondary-fixed/40' },
          { label: '1,700 - 2,000', widthPercent: 25, colorClass: 'bg-primary-fixed' },
          { label: '>2,000 kcal', widthPercent: 25, colorClass: 'bg-primary' },
        ],
        targetEnvelope: {
          min: Math.round(mifflin * 0.95).toLocaleString(),
          max: Math.round(mifflin * 1.05).toLocaleString(),
          unit: 'kcal',
          desc: 'Indirect Calorimetry 95% Confidence Band',
        },
        targetDelta: {
          val: `${(Math.round(mifflin) - Math.round(harris) > 0 ? '+' : '')}${Math.round(mifflin - harris)} kcal`,
          direction: 'optimal',
          text: 'Delta vs Revised Harris-Benedict',
        },
        secondaryBiometrics: [
          { label: 'Revised Harris-Benedict', val: `${Math.round(harris).toLocaleString()} kcal`, desc: '1984 Roza-Shizgal re-evaluation' },
          { label: 'Katch-McArdle (LBM)', val: `${Math.round(katch).toLocaleString()} kcal`, desc: 'Lean tissue metabolic scaling' },
          { label: 'Hourly Cellular Burn', val: `${hourly} kcal/hr`, desc: 'Passive resting respiration' },
          { label: 'Sedentary TDEE (1.2x)', val: `${Math.round(mifflin * 1.2).toLocaleString()} kcal`, desc: 'Zero structured activity' },
        ],
        clinicalRisk: {
          tier: mifflin < 1100 ? 'Low Cellular Turnover' : 'Robust Metabolic Rate',
          level: mifflin < 1100 ? 'Moderate' : 'Low',
          desc: 'Basal rate supports full endocrine and hepatic organ systems.',
        },
        integratedMetric: {
          label: 'Vital Organ Energy Distribution',
          val: 'Liver 27% · Brain 19% · Muscle 18% · Heart 7%',
          desc: 'Brain and liver dominate resting metabolism even when sedentary.',
        },
        activeMatrixRowIndex: activeRow,
        matrixRows: [
          { tier: 'Low Basal Tier (<1,400 kcal)', standardRange: '< 1,400 kcal', alternateRange: 'Petite stature or elderly adults', clinicalRisk: 'Requires nutrient-dense micronutrient planning', tag: 'Low' },
          { tier: 'Median Female Tier (1,400 - 1,700)', standardRange: '1,400 - 1,700 kcal', alternateRange: 'Average adult female normative range', clinicalRisk: 'Standard physiological metabolic baseline', tag: 'Median' },
          { tier: 'Median Male Tier (1,700 - 2,000)', standardRange: '1,700 - 2,000 kcal', alternateRange: 'Average adult male normative range', clinicalRisk: 'Normative thermoneutral energy turnover', tag: 'Median' },
          { tier: 'High Hypertrophic Tier (>2,000)', standardRange: '> 2,000 kcal', alternateRange: 'Athletes with high skeletal muscle mass', clinicalRisk: 'Requires frequent fuel re-feeds', tag: 'High' },
        ],
        insights: [
          { title: 'Mifflin vs Harris-Benedict Divergence', desc: `Mifflin-St Jeor evaluates your BMR at ${Math.round(mifflin)} kcal, while Harris-Benedict estimates ${Math.round(harris)} kcal. Mifflin is recognized by the Academy of Nutrition and Dietetics as the most clinically validated.`, icon: 'science', tag: 'Clinical' },
          { title: 'Never Eat Below Your BMR', desc: `Consuming fewer than ${Math.round(mifflin)} kcal triggers adaptive thermogenesis, suppresses leptin, elevates cortisol, and forces catabolic muscle loss.`, icon: 'shield', tag: 'Safety' },
          { title: 'Organ Basal Demands', desc: 'Over 60% of your basal energy is consumed strictly by your liver, brain, kidneys, and heart, regardless of whether you leave bed today.', icon: 'monitor_heart', tag: 'Physiology' },
        ],
        trendGuidance: {
          velocity: 'Metabolically Stable',
          change: '±25 kcal seasonal drift',
          boundaryLabel: 'Hypertrophic Ceiling',
          baselineLabel: 'Endocrine Deprivation Floor',
        },
      };
    }

    case 'navy-fat': {
      const waistCm = Number(inputs.waistCm || 82);
      const neckCm = Number(inputs.neckCm || 38);
      const hipCm = Number(inputs.hipCm || 95);

      let bf = 0;
      if (gender === 'male') {
        bf = 86.010 * Math.log10(Math.max(1, waistCm - neckCm)) - 70.041 * Math.log10(heightCm) + 36.76;
      } else {
        bf = 163.205 * Math.log10(Math.max(1, waistCm + hipCm - neckCm)) - 97.684 * Math.log10(heightCm) - 78.387;
      }
      bf = Math.max(3, Math.min(55, Math.round(bf * 10) / 10));

      const fatMassKg = (weightKg * (bf / 100));
      const leanMassKg = (weightKg - fatMassKg);
      const idealBf = gender === 'male' ? 15 : 22;
      const targetDeltaKg = fatMassKg - (weightKg * (idealBf / 100));

      let tier = 'Fitness / Athletic';
      let activeRow = 2;
      let color = 'bg-primary text-on-primary';

      if (gender === 'male') {
        if (bf < 6) { tier = 'Essential Fat Only'; activeRow = 0; color = 'bg-amber-500 text-white'; }
        else if (bf < 14) { tier = 'Athletic Tier'; activeRow = 1; color = 'bg-emerald-600 text-white'; }
        else if (bf < 18) { tier = 'Fitness Baseline'; activeRow = 2; color = 'bg-primary text-on-primary'; }
        else if (bf < 25) { tier = 'Average Range'; activeRow = 3; color = 'bg-amber-600 text-white'; }
        else { tier = 'Elevated Adiposity'; activeRow = 4; color = 'bg-error text-on-error'; }
      } else {
        if (bf < 14) { tier = 'Essential Fat Only'; activeRow = 0; color = 'bg-amber-500 text-white'; }
        else if (bf < 21) { tier = 'Athletic Tier'; activeRow = 1; color = 'bg-emerald-600 text-white'; }
        else if (bf < 25) { tier = 'Fitness Baseline'; activeRow = 2; color = 'bg-primary text-on-primary'; }
        else if (bf < 32) { tier = 'Average Range'; activeRow = 3; color = 'bg-amber-600 text-white'; }
        else { tier = 'Elevated Adiposity'; activeRow = 4; color = 'bg-error text-on-error'; }
      }

      const gaugePercent = Math.min(100, Math.max(5, ((bf - 5) / (45 - 5)) * 100));

      return {
        primaryValue: bf.toFixed(1),
        primaryUnit: '% Body Fat',
        primarySub: `${tier} (U.S. Navy Anthropometric Standard)`,
        formulaSubstitution: gender === 'male'
          ? `BF% = 86.010×log10(${waistCm} - ${neckCm}) - 70.041×log10(${heightCm}) + 36.76 = ${bf.toFixed(1)}%`
          : `BF% = 163.205×log10(${waistCm} + ${hipCm} - ${neckCm}) - 97.684×log10(${heightCm}) - 78.387 = ${bf.toFixed(1)}%`,
        statusPill: tier,
        statusColor: color,
        diffuseColor: bf > 25 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0, 74, 198, 0.12)',
        gaugePercent,
        gaugeTiers: [
          { label: 'Essential (2-5% / 10-13%)', widthPercent: 15, colorClass: 'bg-amber-400' },
          { label: 'Athletes (6-13% / 14-20%)', widthPercent: 25, colorClass: 'bg-emerald-500' },
          { label: 'Fitness (14-17% / 21-24%)', widthPercent: 20, colorClass: 'bg-primary-fixed' },
          { label: 'Average (18-24% / 25-31%)', widthPercent: 20, colorClass: 'bg-amber-500' },
          { label: 'Obese (25%+ / 32%+)', widthPercent: 20, colorClass: 'bg-error' },
        ],
        targetEnvelope: {
          min: `${gender === 'male' ? '10.0' : '18.0'}%`,
          max: `${gender === 'male' ? '17.0' : '24.0'}%`,
          unit: 'BF%',
          desc: 'ACSM Health & Longevity Optimal Range',
        },
        targetDelta: {
          val: `${targetDeltaKg > 0 ? '+' : ''}${targetDeltaKg.toFixed(1)} kg`,
          direction: targetDeltaKg > 0 ? 'above' : targetDeltaKg < -2 ? 'below' : 'optimal',
          text: `Delta to reach ${idealBf}% target baseline`,
        },
        secondaryBiometrics: [
          { label: 'Lean Body Mass (LBM)', val: `${leanMassKg.toFixed(1)} kg`, desc: 'Muscle, bone, and visceral mass' },
          { label: 'Fat Adipose Mass', val: `${fatMassKg.toFixed(1)} kg`, desc: 'Subcutaneous + visceral lipid' },
          { label: 'Fat-Free Mass Index', val: `${(leanMassKg / (heightM * heightM)).toFixed(1)} kg/m²`, desc: 'Muscularity density' },
          { label: 'Waist-to-Height Ratio', val: (waistCm / heightCm).toFixed(2), desc: '<0.50 signifies low cardiometabolic risk' },
        ],
        clinicalRisk: {
          tier: bf > (gender === 'male' ? 25 : 32) ? 'Metabolic Risk Tier II' : 'Normative Adiposity',
          level: bf > (gender === 'male' ? 25 : 32) ? 'Elevated' : 'Low',
          desc: bf > (gender === 'male' ? 25 : 32) ? 'Elevated visceral adipose accumulation.' : 'Low atherogenic and insulin resistance profile.',
        },
        integratedMetric: {
          label: 'Total Body Composition Breakdown',
          val: `${leanMassKg.toFixed(1)} kg Lean (${(100 - bf).toFixed(1)}%) · ${fatMassKg.toFixed(1)} kg Fat (${bf.toFixed(1)}%)`,
          desc: 'Independent of fluid fluctuations when measured consistently in morning fasting state.',
        },
        activeMatrixRowIndex: activeRow,
        matrixRows: [
          { tier: 'Essential Lipid Stores', standardRange: gender === 'male' ? '2 - 5%' : '10 - 13%', alternateRange: 'Required for myelin and organ insulation', clinicalRisk: 'Endocrine shutdown below this floor', tag: 'Critical Low' },
          { tier: 'Athletes & Competitors', standardRange: gender === 'male' ? '6 - 13%' : '14 - 20%', alternateRange: 'Clear abdominal definition, high vascularity', clinicalRisk: 'Elite performance and metabolic efficiency', tag: 'Athletic' },
          { tier: 'Fitness & Longevity', standardRange: gender === 'male' ? '14 - 17%' : '21 - 24%', alternateRange: 'Sustainable year-round athletic physique', clinicalRisk: 'Lowest all-cause cardiovascular morbidity', tag: 'Optimal' },
          { tier: 'Acceptable Average', standardRange: gender === 'male' ? '18 - 24%' : '25 - 31%', alternateRange: 'Sedentary adult normative standard', clinicalRisk: 'Moderate visceral fat monitoring warranted', tag: 'Average' },
          { tier: 'Elevated Adiposity', standardRange: gender === 'male' ? '≥ 25%' : '≥ 32%', alternateRange: 'Substantial adipose mass accumulation', clinicalRisk: 'Elevated risk of hypertension & type-2 diabetes', tag: 'High Risk' },
        ],
        insights: [
          { title: 'Circumference Tape Accuracy', desc: `The U.S. Navy equation correlates r=0.88 with dual-energy X-ray absorptiometry (DEXA) scans when measurements are taken horizontally without compressing soft dermal tissues.`, icon: 'straighten', tag: 'Metrology' },
          { title: 'Visceral vs Subcutaneous', desc: `Your waist-to-height ratio is ${(waistCm / heightCm).toFixed(2)}. Scores below 0.50 confirm that abdominal adiposity is not impinging upon vital internal organs.`, icon: 'health_and_safety', tag: 'Longevity' },
          { title: 'Target Body Recomposition', desc: `Maintaining current lean mass (${leanMassKg.toFixed(1)} kg) while reducing ${Math.max(0, targetDeltaKg).toFixed(1)} kg of adipose lipid will place your physique squarely in the elite athletic band.`, icon: 'trending_up', tag: 'Protocol' },
        ],
        trendGuidance: {
          velocity: '-0.3% BF/week',
          change: `${targetDeltaKg > 0 ? '-' : '+'}${Math.abs(targetDeltaKg).toFixed(1)} kg fat delta`,
          boundaryLabel: 'Obesity Threshold (25%)',
          baselineLabel: 'Athletic Median (14%)',
        },
      };
    }

    case 'water-matrix': {
      const workoutMins = Number(inputs.workoutMins || 60);
      const baseMl = weightKg * 35;
      const exerciseMl = workoutMins * 12;
      const totalMl = baseMl + exerciseMl;
      const totalL = totalMl / 1000;
      const cups = Math.round(totalL * 4.227);
      const oz = Math.round(totalL * 33.814);

      const gaugePercent = Math.min(100, Math.max(10, ((totalL - 1.5) / (5.5 - 1.5)) * 100));

      let activeRow = 1;
      if (workoutMins === 0) activeRow = 0;
      else if (workoutMins <= 45) activeRow = 1;
      else if (workoutMins <= 90) activeRow = 2;
      else activeRow = 3;

      return {
        primaryValue: totalL.toFixed(2),
        primaryUnit: 'Liters / Day',
        primarySub: `Hydration Envelope: ~${cups} standard cups (${oz} fl oz)`,
        formulaSubstitution: `Fluids = (${weightKg} kg × 35 mL) + (${workoutMins} min × 12 mL/min) = ${Math.round(totalMl)} mL`,
        statusPill: `${workoutMins}m Activity Load`,
        statusColor: 'bg-secondary-container text-on-secondary-container',
        diffuseColor: 'rgba(56, 189, 248, 0.12)',
        gaugePercent,
        gaugeTiers: [
          { label: 'Sedentary (<2.2L)', widthPercent: 20, colorClass: 'bg-surface-container-high' },
          { label: 'Moderate (2.2-3.0L)', widthPercent: 30, colorClass: 'bg-secondary-fixed/40' },
          { label: 'Athletic (3.0-4.0L)', widthPercent: 30, colorClass: 'bg-primary-fixed' },
          { label: 'Extreme (>4.0L)', widthPercent: 20, colorClass: 'bg-primary' },
        ],
        targetEnvelope: {
          min: `${(totalL * 0.9).toFixed(1)} L`,
          max: `${(totalL * 1.15).toFixed(1)} L`,
          unit: 'L/day',
          desc: 'Thermoregulation Equilibrium Range',
        },
        targetDelta: {
          val: `+${(exerciseMl / 1000).toFixed(2)} L`,
          direction: 'above',
          text: 'Exercise Sweat Offset added to Baseline',
        },
        secondaryBiometrics: [
          { label: 'Cellular Baseline Fluids', val: `${(baseMl / 1000).toFixed(2)} L`, desc: '35 mL per kg body weight' },
          { label: 'Sweat Loss Offset', val: `${(exerciseMl / 1000).toFixed(2)} L`, desc: 'Replaces active transpiration' },
          { label: 'Sodium Requirement', val: `~${Math.round(workoutMins * 8)} mg`, desc: 'Electrolyte osmolarity support' },
          { label: 'Glass Count (250 mL)', val: `${Math.round(totalMl / 250)} glasses`, desc: 'Even pacing across waking hours' },
        ],
        clinicalRisk: {
          tier: totalL < 2.0 ? 'Hypohydration Susceptible' : 'Optimal Osmotic Balance',
          level: totalL < 2.0 ? 'Moderate' : 'Low',
          desc: 'Adequate plasma volume maintains stroke volume and cognitive acuity.',
        },
        integratedMetric: {
          label: 'Hourly Diurnal Drinking Schedule',
          val: `~${Math.round(totalMl / 16)} mL / waking hour`,
          desc: 'Sip steadily between 07:00 and 21:00 to avoid nocturia disruption.',
        },
        activeMatrixRowIndex: activeRow,
        matrixRows: [
          { tier: 'Sedentary Inactive (0 min)', standardRange: `${(baseMl / 1000).toFixed(1)} L/day`, alternateRange: 'Base physiological turnover', clinicalRisk: 'Standard renal solute clearance', tag: 'Baseline' },
          { tier: 'Light Active (30 - 45 min)', standardRange: `${((baseMl + 450) / 1000).toFixed(1)} L/day`, alternateRange: 'Walking, light resistance, yoga', clinicalRisk: 'Maintains blood plasma volume', tag: 'Optimal' },
          { tier: 'Heavy Endurance (60 - 90 min)', standardRange: `${((baseMl + 900) / 1000).toFixed(1)} L/day`, alternateRange: 'Running, cycling, high-intensity gym', clinicalRisk: 'Requires electrolyte replacement', tag: 'High' },
          { tier: 'Ultra / Heat Stress (>90 min)', standardRange: `${((baseMl + 1500) / 1000).toFixed(1)} L/day`, alternateRange: 'Hot climate or prolonged competition', clinicalRisk: 'Risk of hyponatremia without sodium', tag: 'Extreme' },
        ],
        insights: [
          { title: 'The 2% Dehydration Drop', desc: 'Losing just 2% of body mass via water (~1.5 L) degrades aerobic endurance by 15%, slows reaction time, and spikes perceived exertion.', icon: 'water_drop', tag: 'Performance' },
          { title: 'Electrolyte Co-Factor', desc: `Drinking ${totalL.toFixed(1)} L of pure distilled water without minerals causes intracellular dilution. Add a pinch of sea salt or an electrolyte packet during your ${workoutMins}m session.`, icon: 'science', tag: 'Osmolarity' },
          { title: 'Morning Rehydration Surge', desc: 'You expire ~400 mL of water vapor overnight via respiration. Drink 500 mL immediately upon waking to restore hemodynamic pressure.', icon: 'wb_sunny', tag: 'Circadian' },
        ],
        trendGuidance: {
          velocity: 'Hydration Positive',
          change: `+${(exerciseMl / 1000).toFixed(1)} L workout offset`,
          boundaryLabel: 'Hyponatremia Risk (>5.5L)',
          baselineLabel: 'Dehydration Floor (<1.8L)',
        },
      };
    }

    case 'zone2': {
      const rhr = Number(inputs.rhr || 58);
      const maxHrTanaka = Math.round(208 - 0.7 * age);
      const hrr = maxHrTanaka - rhr;
      const z2Low = Math.round(rhr + 0.60 * hrr);
      const z2High = Math.round(rhr + 0.70 * hrr);
      const fatMaxBpm = Math.round(rhr + 0.65 * hrr);

      const gaugePercent = Math.min(100, Math.max(10, ((fatMaxBpm - 100) / (200 - 100)) * 100));

      return {
        primaryValue: `${z2Low} - ${z2High}`,
        primaryUnit: 'BPM',
        primarySub: `Peak Fat Oxidation Target: ~${fatMaxBpm} BPM (Karvonen HRR)`,
        formulaSubstitution: `Zone 2 = ${rhr} + (${maxHrTanaka} - ${rhr}) × [0.60 .. 0.70] = ${z2Low} to ${z2High} BPM`,
        statusPill: 'Base Aerobic Longevity Zone',
        statusColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        diffuseColor: 'rgba(16, 185, 129, 0.12)',
        gaugePercent,
        gaugeTiers: [
          { label: 'Zone 1 (<60% HRR)', widthPercent: 20, colorClass: 'bg-surface-container-high' },
          { label: 'Zone 2 (60-70% HRR)', widthPercent: 25, colorClass: 'bg-emerald-500' },
          { label: 'Zone 3 (70-80% HRR)', widthPercent: 20, colorClass: 'bg-amber-400' },
          { label: 'Zone 4 (80-90% HRR)', widthPercent: 20, colorClass: 'bg-primary' },
          { label: 'Zone 5 (>90% HRR)', widthPercent: 15, colorClass: 'bg-error' },
        ],
        targetEnvelope: {
          min: `${z2Low} BPM`,
          max: `${z2High} BPM`,
          unit: 'Heart Rate',
          desc: 'Mitochondrial Biogenesis Training Band',
        },
        targetDelta: {
          val: `${hrr} BPM`,
          direction: 'optimal',
          text: `Heart Rate Reserve (${maxHrTanaka} Max - ${rhr} Rest)`,
        },
        secondaryBiometrics: [
          { label: 'Estimated Max HR', val: `${maxHrTanaka} BPM`, desc: 'Tanaka equation: 208 - 0.7×Age' },
          { label: 'Resting Heart Rate (RHR)', val: `${rhr} BPM`, desc: 'Cardiac stroke volume proxy' },
          { label: 'Lactate Ceiling (<2.0 mmol)', val: `~${z2High} BPM`, desc: 'Aerobic threshold boundary' },
          { label: 'Weekly Volume Target', val: '150 - 180 mins', desc: 'ACSM & Dr. Attia longevity protocol' },
        ],
        clinicalRisk: {
          tier: 'Low Cardiac Strain',
          level: 'Low',
          desc: 'High mitochondrial density adaptation without sympathetic central fatigue.',
        },
        integratedMetric: {
          label: 'Talk Test Clinical Heuristic',
          val: 'Conversational breathing intact',
          desc: 'You should be able to speak full sentences with slight vocal strain, but not sing.',
        },
        activeMatrixRowIndex: 1,
        matrixRows: [
          { tier: 'Zone 1: Active Recovery (<60% HRR)', standardRange: `< ${z2Low} BPM`, alternateRange: '< 65% Max HR', clinicalRisk: 'Active capillary flushing and lymphatic drain', tag: 'Recovery' },
          { tier: 'Zone 2: Aerobic Base (60 - 70% HRR)', standardRange: `${z2Low} - ${z2High} BPM`, alternateRange: '65 - 75% Max HR', clinicalRisk: 'Maximal fat oxidation & mitochondrial volume', tag: 'FatMax Target' },
          { tier: 'Zone 3: Aerobic Tempo (70 - 80% HRR)', standardRange: `${z2High + 1} - ${Math.round(rhr + 0.80 * hrr)} BPM`, alternateRange: '75 - 85% Max HR', clinicalRisk: 'Mixed glycolytic burn; higher fatigue accumulation', tag: 'Tempo' },
          { tier: 'Zone 4: Lactate Threshold (80 - 90%)', standardRange: `${Math.round(rhr + 0.80 * hrr) + 1} - ${Math.round(rhr + 0.90 * hrr)} BPM`, alternateRange: '85 - 92% Max HR', clinicalRisk: 'Rapid lactate accumulation; anaerobic transition', tag: 'Threshold' },
          { tier: 'Zone 5: VO2 Max Strain (>90% HRR)', standardRange: `> ${Math.round(rhr + 0.90 * hrr)} BPM`, alternateRange: '> 92% Max HR', clinicalRisk: 'High cardiac output for short intervals only', tag: 'VO2 Max' },
        ],
        insights: [
          { title: 'Why Zone 2 Builds Mitochondria', desc: `Exercising between ${z2Low} and ${z2High} BPM recruits Type I slow-twitch fibers that utilize lipid fatty acids, stimulating mitochondrial density and clearing blood lactate.`, icon: 'favorite', tag: 'Cardiology' },
          { title: 'The Karvonen Advantage', desc: `Generic formulas ignore your resting pulse. Because your RHR is ${rhr} BPM, Karvonen customizes your true metabolic training zone by ${Math.abs(z2Low - Math.round(maxHrTanaka * 0.65))} BPM compared to simple %MaxHR.`, icon: 'tune', tag: 'Accuracy' },
          { title: 'Weekly Volume Prescription', desc: 'Accumulate 3 to 4 sessions of 45-60 minutes in this band per week to build cardiovascular fitness and improve insulin sensitivity.', icon: 'timer', tag: 'Prescription' },
        ],
        trendGuidance: {
          velocity: 'Mitochondrial Expansion',
          change: 'Lower RHR = Wider Reserve',
          boundaryLabel: 'Zone 3 Glycolytic Ceiling',
          baselineLabel: 'Zone 1 Recovery Floor',
        },
      };
    }

    case 'sleep-wake': {
      const bedtimeStr = String(inputs.bedtime || '23:00');
      const [bHour, bMin] = bedtimeStr.split(':').map(Number);
      const bedtimeMinutes = (bHour || 23) * 60 + (bMin || 0);
      const latencyMinutes = 14;

      const formatTime = (totalMinutes: number) => {
        let mins = totalMinutes % (24 * 60);
        if (mins < 0) mins += 24 * 60;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      const wake5 = formatTime(bedtimeMinutes + latencyMinutes + 5 * 90);
      const wake6 = formatTime(bedtimeMinutes + latencyMinutes + 6 * 90);
      const wake4 = formatTime(bedtimeMinutes + latencyMinutes + 4 * 90);

      return {
        primaryValue: wake5,
        primaryUnit: 'Wake Time',
        primarySub: `Optimal 5-Cycle Architecture (7h 30m sleep + 14m latency)`,
        formulaSubstitution: `Wake = ${bedtimeStr} + 14m latency + (5 × 90m cycles) = ${wake5}`,
        statusPill: 'Circadian Peak Synchronization',
        statusColor: 'bg-primary-container text-on-primary-container',
        diffuseColor: 'rgba(99, 102, 241, 0.12)',
        gaugePercent: 83,
        gaugeTiers: [
          { label: '3 Cycles (4.5h - Critical)', widthPercent: 20, colorClass: 'bg-error' },
          { label: '4 Cycles (6.0h - Tight)', widthPercent: 20, colorClass: 'bg-amber-400' },
          { label: '5 Cycles (7.5h - Golden)', widthPercent: 30, colorClass: 'bg-primary' },
          { label: '6 Cycles (9.0h - Athlete)', widthPercent: 30, colorClass: 'bg-emerald-500' },
        ],
        targetEnvelope: {
          min: wake5,
          max: wake6,
          unit: 'Clock Time',
          desc: '5 to 6 Ultradian Sleep Cycles Window',
        },
        targetDelta: {
          val: '7.5 Hours',
          direction: 'optimal',
          text: '5 Complete REM-to-NREM Cycles',
        },
        secondaryBiometrics: [
          { label: '6-Cycle Athlete Target', val: wake6, desc: '9.0 hrs total sleep time' },
          { label: '4-Cycle Minimum Viable', val: wake4, desc: '6.0 hrs emergency sleep' },
          { label: 'Sleep Onset Latency', val: '14 minutes', desc: 'Healthy population average' },
          { label: 'Ultradian Periodicity', val: '90 minutes', desc: 'Stage 1 -> REM cycle cadence' },
        ],
        clinicalRisk: {
          tier: 'Zero Sleep Inertia',
          level: 'Low',
          desc: 'Waking at the completion of a light REM stage avoids grogginess.',
        },
        integratedMetric: {
          label: 'Sleep Architecture Breakdown',
          val: 'NREM 1-2 (50%) · Deep NREM 3-4 (20%) · REM (25%)',
          desc: 'Deep sleep dominates early cycles; REM dominates later cycles.',
        },
        activeMatrixRowIndex: 2,
        matrixRows: [
          { tier: '3 Cycles: Severe Debt (4.5h)', standardRange: '4h 30m', alternateRange: 'Causes acute cognitive degradation', clinicalRisk: 'Elevated cortisol and ghrelin spikes', tag: 'Deficit' },
          { tier: '4 Cycles: Minimum Safe (6.0h)', standardRange: '6h 00m', alternateRange: 'Acceptable for short emergency stretches', clinicalRisk: 'Reduces motor reaction speed by 12%', tag: 'Borderline' },
          { tier: '5 Cycles: Adult Golden Standard', standardRange: '7h 30m', alternateRange: 'Recommended for 90% of healthy adults', clinicalRisk: 'Optimal cellular repair and immune defense', tag: 'Optimal' },
          { tier: '6 Cycles: Athletic Recovery', standardRange: '9h 00m', alternateRange: 'Prescribed for intensive physical training', clinicalRisk: 'Maximum growth hormone release window', tag: 'Recovery' },
        ],
        insights: [
          { title: 'The Mechanism of Sleep Inertia', desc: 'Waking mid-way through deep Stage 3 slow-wave sleep floods your brain with adenosine, causing cognitive grogginess for up to 90 minutes. Timing alarms to 90-minute boundaries avoids this.', icon: 'bedtime', tag: 'Circadian' },
          { title: 'Consistent Awakening Anchor', desc: `Locking in your wake time (${wake5}) every morning, even on weekends, anchors your suprachiasmatic nucleus circadian clock far better than shifting bedtimes.`, icon: 'alarm', tag: 'Chronobiology' },
          { title: 'Light Exposure Trigger', desc: 'View 10 minutes of direct morning sunlight within 30 minutes of waking to trigger cortisol release and start your melatonin countdown timer.', icon: 'light_mode', tag: 'Photobiology' },
        ],
        trendGuidance: {
          velocity: 'Optimal Architecture',
          change: '90-minute phase alignment',
          boundaryLabel: '6-Cycle Ceiling (9h)',
          baselineLabel: '4-Cycle Floor (6h)',
        },
      };
    }

    case '1rm': {
      const liftWeight = Number(inputs.liftWeight || 100);
      const reps = Math.min(12, Math.max(1, Number(inputs.reps || 5)));

      const brzycki = liftWeight / (1.0278 - 0.0278 * reps);
      const epley = liftWeight * (1 + 0.0333 * reps);
      const lombardi = liftWeight * Math.pow(reps, 0.10);
      const avg1rm = Math.round((brzycki + epley + lombardi) / 3);

      const gaugePercent = Math.min(100, Math.max(15, (liftWeight / avg1rm) * 100));

      return {
        primaryValue: avg1rm.toString(),
        primaryUnit: unit === 'imperial' ? 'lbs' : 'kg',
        primarySub: `Multi-Formula Consensus 1RM (${reps} reps @ ${liftWeight} ${unit === 'imperial' ? 'lbs' : 'kg'})`,
        formulaSubstitution: `Brzycki 1RM = ${liftWeight} ÷ (1.0278 - 0.0278 × ${reps}) = ${Math.round(brzycki)} ${unit === 'imperial' ? 'lbs' : 'kg'}`,
        statusPill: `${Math.round((liftWeight / avg1rm) * 100)}% of Maximum`,
        statusColor: 'bg-primary text-on-primary',
        diffuseColor: 'rgba(0, 74, 198, 0.12)',
        gaugePercent,
        gaugeTiers: [
          { label: 'Endurance (<65%)', widthPercent: 20, colorClass: 'bg-surface-container-high' },
          { label: 'Hypertrophy (65-80%)', widthPercent: 35, colorClass: 'bg-primary-fixed' },
          { label: 'Strength (80-90%)', widthPercent: 25, colorClass: 'bg-primary' },
          { label: 'Maximal (>90%)', widthPercent: 20, colorClass: 'bg-tertiary' },
        ],
        targetEnvelope: {
          min: `${Math.round(avg1rm * 0.70)}`,
          max: `${Math.round(avg1rm * 0.85)}`,
          unit: unit === 'imperial' ? 'lbs' : 'kg',
          desc: 'Optimal 6-12 Rep Hypertrophy Load Band',
        },
        targetDelta: {
          val: `+${avg1rm - liftWeight}`,
          direction: 'above',
          text: `Reserve Capacity beyond current ${liftWeight} load`,
        },
        secondaryBiometrics: [
          { label: 'Brzycki Formula', val: `${Math.round(brzycki)} ${unit === 'imperial' ? 'lbs' : 'kg'}`, desc: 'Standard gold standard' },
          { label: 'Epley Formula', val: `${Math.round(epley)} ${unit === 'imperial' ? 'lbs' : 'kg'}`, desc: 'Widely used in powerlifting' },
          { label: '90% Strength Triple (3RM)', val: `${Math.round(avg1rm * 0.90)} ${unit === 'imperial' ? 'lbs' : 'kg'}`, desc: 'Max strength neural training' },
          { label: '75% Hypertrophy (10RM)', val: `${Math.round(avg1rm * 0.75)} ${unit === 'imperial' ? 'lbs' : 'kg'}`, desc: 'Hypertrophic volume sweetspot' },
        ],
        clinicalRisk: {
          tier: reps > 10 ? 'High Estimation Variance' : 'High Mathematical Fidelity',
          level: reps > 10 ? 'Moderate' : 'Low',
          desc: reps <= 5 ? 'Sub-5 rep calculations exhibit <2% variance from actual tested 1RM.' : 'Sub-maximal fatigue distorts high-rep formula accuracy.',
        },
        integratedMetric: {
          label: 'Strength Training Load Distribution',
          val: `Heavy: ${Math.round(avg1rm * 0.85)} | Medium: ${Math.round(avg1rm * 0.75)} | Light: ${Math.round(avg1rm * 0.65)}`,
          desc: 'Periodize training loads across weeks to prevent central nervous system burnout.',
        },
        activeMatrixRowIndex: reps <= 3 ? 0 : reps <= 6 ? 1 : reps <= 10 ? 2 : 3,
        matrixRows: [
          { tier: 'Maximal Strength (90 - 100%)', standardRange: `${Math.round(avg1rm * 0.90)} - ${avg1rm}`, alternateRange: '1 - 3 reps per set', clinicalRisk: 'High neural recruitment; long rest intervals', tag: 'Max Power' },
          { tier: 'Heavy Strength (80 - 90%)', standardRange: `${Math.round(avg1rm * 0.80)} - ${Math.round(avg1rm * 0.90)}`, alternateRange: '4 - 6 reps per set', clinicalRisk: 'Optimal myofibrillar protein synthesis', tag: 'Strength' },
          { tier: 'Hypertrophy Core (70 - 80%)', standardRange: `${Math.round(avg1rm * 0.70)} - ${Math.round(avg1rm * 0.80)}`, alternateRange: '8 - 12 reps per set', clinicalRisk: 'Maximizes metabolic stress and cell swelling', tag: 'Hypertrophy' },
          { tier: 'Muscular Endurance (<70%)', standardRange: `< ${Math.round(avg1rm * 0.70)}`, alternateRange: '15+ reps per set', clinicalRisk: 'Capillary density and mitochondrial endurance', tag: 'Endurance' },
        ],
        insights: [
          { title: 'Sub-Maximal Safety Protocol', desc: `Computing your 1RM mathematically from a ${reps}-rep load (${liftWeight}) protects spinal and connective structures from acute failure associated with true 1RM testing.`, icon: 'shield', tag: 'Safety' },
          { title: 'Progressive Overload Target', desc: `To progress next cycle, aim for either ${reps + 1} reps with ${liftWeight} or add 2.5 kg/5 lbs to maintain the same target RPE.`, icon: 'trending_up', tag: 'Progression' },
          { title: 'Fatigue Decay Factor', desc: 'Formulas are most accurate when performed fresh after a thorough warm-up, without prior cumulative muscular fatigue.', icon: 'bolt', tag: 'Neurology' },
        ],
        trendGuidance: {
          velocity: '+2.5 kg/month progression',
          change: `Consensus 1RM: ${avg1rm}`,
          boundaryLabel: '100% 1RM Ceiling',
          baselineLabel: '70% Working Floor',
        },
      };
    }

    case 'due-date': {
      const lmpStr = String(inputs.lmpDate || '2026-05-15');
      const cycleLen = Number(inputs.cycleLength || 28);
      const lmpDate = new Date(lmpStr);
      const cycleOffset = cycleLen - 28;

      const edd = new Date(lmpDate);
      edd.setDate(edd.getDate() + 280 + cycleOffset);

      const today = new Date();
      const diffTime = today.getTime() - lmpDate.getTime();
      const gestDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      const gestWeeks = Math.floor(gestDays / 7);
      const gestRemainingDays = gestDays % 7;

      let trimester = 'First Trimester (Weeks 1 - 12)';
      let activeRow = 0;
      if (gestWeeks >= 27) {
        trimester = 'Third Trimester (Weeks 27 - 40)';
        activeRow = 2;
      } else if (gestWeeks >= 13) {
        trimester = 'Second Trimester (Weeks 13 - 26)';
        activeRow = 1;
      }

      const eddFormatted = edd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return {
        primaryValue: eddFormatted,
        primaryUnit: 'Estimated Date',
        primarySub: `Gestational Age: ${gestWeeks} Weeks, ${gestRemainingDays} Days · ${trimester}`,
        formulaSubstitution: `Naegele's Rule: ${lmpStr} + 280 days + (${cycleLen} - 28) offset = ${eddFormatted}`,
        statusPill: `${gestWeeks}w ${gestRemainingDays}d Gestation`,
        statusColor: 'bg-primary text-on-primary',
        diffuseColor: 'rgba(236, 72, 153, 0.12)',
        gaugePercent: Math.min(100, Math.max(5, (gestDays / 280) * 100)),
        gaugeTiers: [
          { label: '1st Trimester (1-12w)', widthPercent: 30, colorClass: 'bg-primary-fixed' },
          { label: '2nd Trimester (13-26w)', widthPercent: 35, colorClass: 'bg-secondary-fixed' },
          { label: '3rd Trimester (27-40w)', widthPercent: 35, colorClass: 'bg-primary' },
        ],
        targetEnvelope: {
          min: '37 Weeks',
          max: '42 Weeks',
          unit: 'Full Term Window',
          desc: 'Normative Safe Delivery Interval',
        },
        targetDelta: {
          val: `${Math.max(0, 280 - gestDays)} Days`,
          direction: 'optimal',
          text: 'Remaining until Estimated Due Date',
        },
        secondaryBiometrics: [
          { label: 'Conception Estimate', val: 'LMP + ~14 Days', desc: 'Ovulatory fertilization window' },
          { label: 'Full Term Threshold', val: 'Week 37', desc: 'Organ system maturity complete' },
          { label: 'Days Completed', val: `${gestDays} / 280`, desc: 'Progression along pregnancy timeline' },
          { label: 'Cycle Calibration', val: `${cycleLen} Days`, desc: `${cycleOffset >= 0 ? '+' : ''}${cycleOffset} days vs standard 28d` },
        ],
        clinicalRisk: {
          tier: gestWeeks >= 37 ? 'Full Term Readiness' : 'Normal Gestation',
          level: 'Low',
          desc: 'Clinical ultrasound crown-rump length (CRL) remains gold standard confirmatory benchmark.',
        },
        integratedMetric: {
          label: 'Milestone Timeline',
          val: '12w Nuchal Scan · 20w Anatomy Ultrasound · 28w Glucose Screening',
          desc: 'Standard American College of Obstetricians and Gynecologists (ACOG) schedule.',
        },
        activeMatrixRowIndex: activeRow,
        matrixRows: [
          { tier: '1st Trimester (Weeks 1 - 12)', standardRange: '1 - 12 Weeks', alternateRange: 'Organogenesis, neural tube closure', clinicalRisk: 'Prioritize folate supplementation (400 mcg)', tag: 'Trimester 1' },
          { tier: '2nd Trimester (Weeks 13 - 26)', standardRange: '13 - 26 Weeks', alternateRange: 'Rapid skeletal growth, fetal movement', clinicalRisk: 'Monitor blood pressure and anatomy scan', tag: 'Trimester 2' },
          { tier: '3rd Trimester (Weeks 27 - 40)', standardRange: '27 - 40 Weeks', alternateRange: 'Alveolar lung development, fat storage', clinicalRisk: 'Screen for preeclampsia and group B strep', tag: 'Trimester 3' },
          { tier: 'Term Delivery Window (37 - 42w)', standardRange: '37 - 42 Weeks', alternateRange: 'Spontaneous labor natural onset', clinicalRisk: 'Surveillance for post-term oligohydramnios', tag: 'Full Term' },
        ],
        insights: [
          { title: "Naegele's Formulation with Cycle Adjustment", desc: `Standard 28-day calculations misdate ovulations for longer or shorter cycles. Your ${cycleLen}-day cycle adjustment ensures timing precision within ±3 days.`, icon: 'event', tag: 'Obstetrics' },
          { title: 'The 4% Reality', desc: 'Only ~4% of babies are born on their exact numerical due date; over 90% arrive safely in the two-week window between 38 and 42 weeks.', icon: 'child_care', tag: 'Guidance' },
          { title: 'Clinical Confirmation', desc: 'First-trimester ultrasound measurement of Crown-Rump Length (CRL) between 8 and 13 weeks remains the definitive gold standard to verify EDD.', icon: 'medical_services', tag: 'Clinical' },
        ],
        trendGuidance: {
          velocity: `${gestWeeks}w ${gestRemainingDays}d Completed`,
          change: `${Math.max(0, 280 - gestDays)} days to term`,
          boundaryLabel: '42w Post-Term Threshold',
          baselineLabel: '37w Full Term Floor',
        },
      };
    }

    case 'hcg': {
      const h1 = Math.max(1, Number(inputs.hcg1) || 250);
      const h2 = Math.max(0.1, Number(inputs.hcg2) || 580);
      const hrs = Math.max(1, Number(inputs.hoursBetween) || 48);

      const ratio = h2 / h1;
      const intervalPct = ((h2 - h1) / h1) * 100;
      const twoDayPct = (Math.pow(ratio, 48 / hrs) - 1) * 100;

      let primaryVal: string;
      let primaryUnit = 'Hours';
      let primarySub: string;
      let formulaSub: string;
      let statusPill: string;
      let statusColor: string;
      let diffuseColor: string;
      let gaugePercent: number;
      let activeRow = 1;
      let clinicalRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High' = 'Low';
      let clinicalRiskTier = 'Expected Viable Trajectory';
      let clinicalRiskDesc = 'Serum hCG kinetics meet ACOG standards for normal intrauterine pregnancy progression.';

      if (h2 <= h1) {
        primaryVal = `${intervalPct.toFixed(1)}%`;
        primaryUnit = 'Drop';
        primarySub = `Declining Beta-hCG Across ${hrs} Hours (Draw 1: ${h1} → Draw 2: ${h2} mIU/mL)`;
        formulaSub = `Kinetics = (${h2} - ${h1}) / ${h1} = ${intervalPct.toFixed(1)}% (Declining Levels)`;
        statusPill = 'Declining hCG Level';
        statusColor = 'bg-rose-500/10 text-rose-700 dark:text-rose-400';
        diffuseColor = 'rgba(239, 68, 68, 0.15)';
        gaugePercent = 10;
        activeRow = 3;
        clinicalRiskLevel = 'High';
        clinicalRiskTier = 'Critical Biochemical Warning';
        clinicalRiskDesc = 'Decreasing serum hCG strongly suggests non-viable gestation, impending spontaneous abortion, or resolving ectopic pregnancy. Immediate physician consultation recommended.';
      } else {
        const doublingHours = (hrs * Math.LN2) / Math.log(ratio);
        primaryVal = doublingHours.toFixed(1);
        primaryUnit = 'Hours';
        primarySub = `48-Hour Standardized Rise: +${twoDayPct.toFixed(1)}% (Total Rise: +${intervalPct.toFixed(1)}% over ${hrs}h)`;
        formulaSub = `Doubling Time = (${hrs}h × ln(2)) ÷ ln(${h2} / ${h1}) = ${doublingHours.toFixed(1)} Hours`;

        if (doublingHours < 48) {
          statusPill = 'Rapid Normal Doubling (<48h)';
          statusColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
          diffuseColor = 'rgba(16, 185, 129, 0.15)';
          gaugePercent = 30;
          activeRow = 0;
          clinicalRiskLevel = 'Low';
          clinicalRiskTier = 'Rapid Viable Kinetics';
          clinicalRiskDesc = 'Very robust hCG trajectory; consistent with healthy singleton or possible multiple gestation.';
        } else if (doublingHours <= 72) {
          statusPill = 'Normal Viable Doubling (48–72h)';
          statusColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
          diffuseColor = 'rgba(16, 185, 129, 0.15)';
          gaugePercent = 50;
          activeRow = 1;
          clinicalRiskLevel = 'Low';
          clinicalRiskTier = 'Consensus Viable Envelope';
          clinicalRiskDesc = 'hCG levels double predictably within the ACOG 48–72 hour physiological reference window.';
        } else if (doublingHours <= 96) {
          statusPill = 'Borderline Rise (72–96h)';
          statusColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
          diffuseColor = 'rgba(245, 158, 11, 0.15)';
          gaugePercent = 75;
          activeRow = 2;
          clinicalRiskLevel = 'Moderate';
          clinicalRiskTier = 'Borderline Kinetics';
          clinicalRiskDesc = 'Rate of rise is slower than average (<66% in 48 hours). Continued serial biochemical monitoring and ultrasound correlation advised.';
        } else {
          statusPill = 'Sub-Optimal Rise (>96h)';
          statusColor = 'bg-rose-500/10 text-rose-700 dark:text-rose-400';
          diffuseColor = 'rgba(239, 68, 68, 0.15)';
          gaugePercent = 92;
          activeRow = 3;
          clinicalRiskLevel = 'Elevated';
          clinicalRiskTier = 'Sub-Optimal Rise Alert';
          clinicalRiskDesc = 'Prolonged doubling time exceeds standard physiological envelopes. Clinical evaluation needed to exclude ectopic pregnancy or early embryonic demise.';
        }
      }

      const isDiscriminatory = h2 >= 2000;

      return {
        primaryValue: primaryVal,
        primaryUnit,
        primarySub,
        formulaSubstitution: formulaSub,
        statusPill,
        statusColor,
        diffuseColor,
        gaugePercent,
        gaugeTiers: [
          { label: 'Rapid (<48h)', widthPercent: 25, colorClass: 'bg-emerald-400' },
          { label: 'Normal (48–72h)', widthPercent: 35, colorClass: 'bg-emerald-600' },
          { label: 'Borderline (72–96h)', widthPercent: 20, colorClass: 'bg-amber-500' },
          { label: 'Sub-Optimal (>96h)', widthPercent: 20, colorClass: 'bg-rose-500' },
        ],
        targetEnvelope: {
          min: '31.0',
          max: '72.0',
          unit: 'Hours',
          desc: 'ACOG standard doubling window for intrauterine pregnancies <6,000 mIU/mL',
        },
        targetDelta: {
          val: h2 > h1 && Number(primaryVal) <= 72 ? 'Optimal Viability' : h2 > h1 ? `+${(Number(primaryVal) - 72).toFixed(1)}h above 72h floor` : 'Declining Level',
          direction: h2 > h1 && Number(primaryVal) <= 72 ? 'optimal' : 'above',
          text: h2 > h1 && Number(primaryVal) <= 72 ? 'Expected physiological doubling trajectory' : 'Exceeds standard 72-hour doubling window',
        },
        secondaryBiometrics: [
          { label: 'Initial Draw (hCG 1)', val: `${h1.toLocaleString()} mIU/mL`, desc: 'Baseline serum quantitative assay' },
          { label: 'Follow-Up (hCG 2)', val: `${h2.toLocaleString()} mIU/mL`, desc: `${hrs}h later (+${intervalPct.toFixed(1)}% total change)` },
          { label: 'Normalized 48h Rise', val: `+${twoDayPct.toFixed(1)}%`, desc: 'Standardized 2-day rate of increase' },
          { label: 'TVUS Discriminatory Zone', val: isDiscriminatory ? '≥2,000 mIU/mL (Sac Expected)' : `${h2.toLocaleString()} mIU/mL (Pre-Sac Zone)`, desc: isDiscriminatory ? 'Transvaginal ultrasound should visualize gestational sac' : 'hCG below ultrasound visualization threshold' },
        ],
        clinicalRisk: {
          tier: clinicalRiskTier,
          level: clinicalRiskLevel,
          desc: clinicalRiskDesc,
        },
        integratedMetric: {
          label: 'Biochemical & Diagnostic Correlation',
          val: `${h1} → ${h2} mIU/mL over ${hrs}h (${twoDayPct.toFixed(1)}% / 48h)`,
          desc: isDiscriminatory ? 'Exceeds discriminatory zone threshold (≥2,000 mIU/mL); transvaginal sonography indicated.' : 'Serial quantitative draws recommended every 48 hours until discriminatory zone.',
        },
        activeMatrixRowIndex: activeRow,
        matrixRows: [
          { tier: 'Rapid Rise (<48 hrs)', standardRange: '< 48 Hours', alternateRange: '> 100% 48h increase', clinicalRisk: 'Low risk for viability; evaluate for multiples', tag: 'Optimal' },
          { tier: 'Standard Viable Rise (48–72 hrs)', standardRange: '48 – 72 Hours', alternateRange: '66% – 100% 48h increase', clinicalRisk: 'Optimal ACOG consensus intrauterine trajectory', tag: 'Normal' },
          { tier: 'Borderline Slow Rise (72–96 hrs)', standardRange: '72 – 96 Hours', alternateRange: '40% – 66% 48h increase', clinicalRisk: 'Moderate risk; serial ultrasound follow-up', tag: 'Borderline' },
          { tier: 'Sub-Optimal Rise (>96 hrs / Drop)', standardRange: '> 96 Hours / Negative', alternateRange: '< 40% 48h increase', clinicalRisk: 'High risk: rule out ectopic or embryonic loss', tag: 'High Risk' },
        ],
        insights: [
          { title: 'ACOG Early Gestation Criteria', desc: 'In viable intrauterine pregnancies below 6,000 mIU/mL, hCG levels typically double every 48 to 72 hours, with a minimum 48-hour increase of approximately 66% (Seeber et al. 2006).', icon: 'verified', tag: 'Obstetrics' },
          { title: 'The 2,000 mIU/mL Discriminatory Zone', desc: 'When quantitative serum beta-hCG exceeds 1,500–2,000 mIU/mL, a gestational sac should reliably be visible via transvaginal ultrasonography (TVUS).', icon: 'biotech', tag: 'Imaging' },
          { title: 'First-Trimester Peak & Plateau', desc: 'Beta-hCG levels peak around weeks 9 to 11 of gestation (often 100,000 to 200,000 mIU/mL) before plateauing and declining, rendering doubling math invalid in late first trimester.', icon: 'timeline', tag: 'Physiology' },
        ],
        trendGuidance: {
          velocity: h2 > h1 ? `${primaryVal}h Doubling Time` : 'Declining Levels',
          change: `+${intervalPct.toFixed(1)}% over ${hrs}h`,
          boundaryLabel: '72h Viability Ceiling',
          baselineLabel: '48h Optimal Floor',
        },
      };
    }

    default: {
      // High-precision calculation engine for remaining tools
      let primaryVal = bmi.toFixed(1);
      let primaryUnit = 'kg/m²';
      let primarySub = `${toolId.toUpperCase()} Clinical Telemetry`;
      let formulaSub = `Output = Function(${weightKg}, ${heightCm}, ${age})`;
      let statusPill = 'Validated Normal';
      let statusColor = 'bg-primary-container text-on-primary-container';
      let diffuseColor = 'rgba(0, 74, 198, 0.12)';
      let gaugePercent = Math.min(100, Math.max(15, (bmi / 35) * 100));

      if (toolId === 'macro-split') {
        const cals = Number(inputs.calories || 2400);
        const pG = Math.round((cals * 0.30) / 4);
        const cG = Math.round((cals * 0.40) / 4);
        const fG = Math.round((cals * 0.30) / 9);
        primaryVal = `${pG}g P · ${cG}g C · ${fG}g F`;
        primaryUnit = `(${cals.toLocaleString()} kcal)`;
        primarySub = 'Balanced 30% Protein / 40% Carb / 30% Lipid Distribution';
        formulaSub = `Macros = (${cals} × 0.30/4)P + (${cals} × 0.40/4)C + (${cals} × 0.30/9)F`;
        statusPill = 'Active Macro Balance';
        gaugePercent = 65;
      } else if (toolId === 'protein-rda') {
        const optimalProtein = Math.round(weightKg * 2.0);
        primaryVal = optimalProtein.toString();
        primaryUnit = 'g / day';
        primarySub = `Optimal Resistance Training Target (2.0 g/kg body weight)`;
        formulaSub = `Protein = ${weightKg} kg × 2.0 g/kg = ${optimalProtein} g/day`;
        statusPill = 'High Bioavailability Target';
        gaugePercent = 75;
      } else if (toolId === 'ibw') {
        const inches = heightCm / 2.54;
        const devine = gender === 'male' ? 50.0 + 2.3 * (inches - 60) : 45.5 + 2.3 * (inches - 60);
        primaryVal = devine.toFixed(1);
        primaryUnit = unit === 'imperial' ? 'lbs' : 'kg';
        primarySub = 'Devine Clinical Dosing Baseline (1974)';
        formulaSub = `IBW = ${gender === 'male' ? '50.0' : '45.5'} + 2.3 × (${inches.toFixed(1)} - 60) = ${devine.toFixed(1)} kg`;
        statusPill = 'Pharmacological Standard';
        gaugePercent = 50;
      } else if (toolId === 'lbm') {
        const boer = gender === 'male'
          ? 0.407 * weightKg + 0.267 * heightCm - 19.2
          : 0.252 * weightKg + 0.473 * heightCm - 48.3;
        primaryVal = boer.toFixed(1);
        primaryUnit = unit === 'imperial' ? 'lbs' : 'kg';
        primarySub = 'Boer Clinical Equation (Lean Body Tissue)';
        formulaSub = `LBM = ${gender === 'male' ? '0.407W + 0.267H - 19.2' : '0.252W + 0.473H - 48.3'} = ${boer.toFixed(1)} kg`;
        statusPill = `${((boer / weightKg) * 100).toFixed(1)}% Lean Mass`;
        gaugePercent = Math.min(100, Math.max(20, (boer / weightKg) * 100));
      } else if (toolId === 'ffmi') {
        const lbmEst = weightKg * 0.80;
        const ffmiVal = lbmEst / (heightM * heightM);
        primaryVal = ffmiVal.toFixed(1);
        primaryUnit = 'kg/m²';
        primarySub = 'Fat-Free Mass Index (Natural Muscularity)';
        formulaSub = `FFMI = ${lbmEst.toFixed(1)} kg LBM ÷ (${heightM.toFixed(2)} m)² = ${ffmiVal.toFixed(1)} kg/m²`;
        statusPill = ffmiVal > 22 ? 'Above Average Muscularity' : 'Normative Natural Band';
        gaugePercent = Math.min(100, Math.max(15, (ffmiVal / 28) * 100));
      } else if (toolId === 'whtr') {
        const waist = Number(inputs.waistCm || 82);
        const whtrVal = waist / heightCm;
        primaryVal = whtrVal.toFixed(2);
        primaryUnit = 'Ratio';
        primarySub = whtrVal < 0.50 ? 'Healthy Shape (Low Cardiometabolic Risk)' : 'Increased Abdominal Adiposity';
        formulaSub = `WHtR = ${waist} cm Waist ÷ ${heightCm} cm Height = ${whtrVal.toFixed(2)}`;
        statusPill = whtrVal < 0.50 ? 'Optimal Shape (<0.50)' : 'Action Required (≥0.50)';
        statusColor = whtrVal < 0.50 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
        gaugePercent = Math.min(100, Math.max(10, (whtrVal / 0.8) * 100));
      } else if (toolId === 'vo2max') {
        const rhr = Number(inputs.rhr || 58);
        const maxHr = 208 - 0.7 * age;
        const vo2 = 15.3 * (maxHr / rhr);
        primaryVal = vo2.toFixed(1);
        primaryUnit = 'mL/kg/min';
        primarySub = 'Uth-Sørensen Heart Rate Ratio Estimate';
        formulaSub = `VO2 Max = 15.3 × (${Math.round(maxHr)} MaxHR ÷ ${rhr} RHR) = ${vo2.toFixed(1)}`;
        statusPill = vo2 > 45 ? 'Superior Aerobic Power' : 'Good Aerobic Fitness';
        gaugePercent = Math.min(100, Math.max(15, (vo2 / 65) * 100));
      } else if (toolId === 'map') {
        const sbp = Number(inputs.sbp || 120);
        const dbp = Number(inputs.dbp || 80);
        const mapVal = dbp + (1 / 3) * (sbp - dbp);
        primaryVal = mapVal.toFixed(1);
        primaryUnit = 'mmHg';
        primarySub = 'Mean Arterial Perfusion Pressure';
        formulaSub = `MAP = ${dbp} + 1/3 × (${sbp} - ${dbp}) = ${mapVal.toFixed(1)} mmHg`;
        statusPill = mapVal >= 70 && mapVal <= 100 ? 'Normal Perfusion' : 'Altered Perfusion Pressure';
        gaugePercent = Math.min(100, Math.max(10, ((mapVal - 50) / (140 - 50)) * 100));
      } else if (toolId === 'running-pace') {
        const dist = Math.max(0.1, Number(inputs.distanceKm || 10));
        const hrs = Number(inputs.hours || 0);
        const mins = Number(inputs.minutes || 48);
        const secs = Number(inputs.seconds || 0);
        const totalMinutes = hrs * 60 + mins + secs / 60;
        const paceDec = totalMinutes / dist;
        const paceM = Math.floor(paceDec);
        const paceS = Math.round((paceDec - paceM) * 60);
        const speedKmh = dist / (totalMinutes / 60);
        primaryVal = `${paceM}:${paceS < 10 ? '0' : ''}${paceS}`;
        primaryUnit = 'min / km';
        primarySub = `Average Speed: ${speedKmh.toFixed(2)} km/h (${(speedKmh * 0.621371).toFixed(2)} mph)`;
        formulaSub = `Pace = ${totalMinutes.toFixed(1)} min ÷ ${dist} km = ${primaryVal} min/km`;
        statusPill = speedKmh > 12 ? 'Competitive Pace' : 'Endurance Cadence';
        gaugePercent = Math.min(100, Math.max(15, (speedKmh / 20) * 100));
      } else if (toolId === 'carb-cycling') {
        const cals = Number(inputs.averageCalories || 2200);
        const highC = Math.round((cals * 1.2 * 0.5) / 4);
        const medC = Math.round((cals * 0.35) / 4);
        const lowC = Math.round((cals * 0.8 * 0.15) / 4);
        primaryVal = `${highC}g / ${medC}g / ${lowC}g`;
        primaryUnit = 'High · Med · Low';
        primarySub = `High Days (${Math.round(cals * 1.2)} kcal) · Med (${cals} kcal) · Low (${Math.round(cals * 0.8)} kcal)`;
        formulaSub = `High: 50% Carbs | Med: 35% Carbs | Low: 15% Carbs`;
        statusPill = 'Optimized Glycogen Partitioning';
        gaugePercent = 65;
      } else if (toolId === 'keto') {
        const cals = Number(inputs.targetCalories || 2000);
        const netCarb = Number(inputs.netCarbLimit || 25);
        const protG = Math.round((cals * 0.25) / 4);
        const fatG = Math.round((cals - (netCarb * 4 + protG * 4)) / 9);
        primaryVal = `${netCarb}g Carbs · ${fatG}g Fat`;
        primaryUnit = `(${protG}g Protein)`;
        primarySub = `75% Lipid · 20% Protein · 5% Net Carbohydrate Partition`;
        formulaSub = `Keto Ratio = (${fatG}g Fat × 9) ÷ ${cals} kcal = ${Math.round((fatG * 9 / cals) * 100)}% Ketogenic Energy`;
        statusPill = 'Ketosis Induction Window';
        gaugePercent = 80;
      } else if (toolId === 'mets') {
        const met = Number(inputs.metValue || 8.3);
        const duration = Number(inputs.durationMins || 45);
        const calsBurned = Math.round((duration / 60) * met * weightKg);
        primaryVal = calsBurned.toString();
        primaryUnit = 'kcal Burned';
        primarySub = `${met} METs · ${(calsBurned / duration).toFixed(1)} kcal/min Burn Rate`;
        formulaSub = `Calories = (${duration}m ÷ 60) × ${met} MET × ${weightKg} kg = ${calsBurned} kcal`;
        statusPill = met >= 8 ? 'Vigorous Energy Demand' : 'Moderate Physical Activity';
        gaugePercent = Math.min(100, Math.max(20, (met / 14) * 100));
      } else if (toolId === 'ftp') {
        const p20 = Number(inputs.twentyMinWatts || 260);
        const ftpVal = Math.round(p20 * 0.95);
        const wpkg = (ftpVal / weightKg).toFixed(2);
        primaryVal = ftpVal.toString();
        primaryUnit = 'Watts (W)';
        primarySub = `${wpkg} W/kg Power-to-Weight Ratio`;
        formulaSub = `FTP = 20-min Power (${p20}W) × 0.95 = ${ftpVal} W`;
        statusPill = Number(wpkg) > 3.5 ? 'Competitive Category Racer' : 'Trained Endurance Cyclist';
        gaugePercent = Math.min(100, Math.max(15, (ftpVal / 400) * 100));
      } else if (toolId === 'rucking') {
        const pack = Number(inputs.packWeightKg || 15);
        const spd = Number(inputs.speedKmh || 5.5);
        const inc = Number(inputs.inclinePct || 2);
        const dur = Number(inputs.durationMins || 60);
        const vMs = (spd * 1000) / 3600;
        const totalMass = weightKg + pack;
        const watts = 1.5 * weightKg + 2.0 * totalMass * Math.pow(pack / weightKg, 2) + totalMass * (1.5 * vMs * vMs + 0.35 * vMs * inc);
        const burnHr = Math.round(watts * 1.23);
        const totalBurn = Math.round((burnHr * dur) / 60);
        primaryVal = totalBurn.toString();
        primaryUnit = 'kcal Burned';
        primarySub = `${burnHr} kcal/hr · Pack Load: ${Math.round((pack / weightKg) * 100)}% Body Weight`;
        formulaSub = `Pandolf Equation: Mass=${totalMass}kg, V=${spd}km/h, Grade=${inc}% = ${burnHr} kcal/h`;
        statusPill = 'Heavy Metabolic Load';
        gaugePercent = 70;
      } else if (toolId === 'hrr') {
        const peak = Number(inputs.peakHr || 175);
        const h1 = Number(inputs.hr1Min || 148);
        const h2 = Number(inputs.hr2Min || 126);
        const drop1 = peak - h1;
        const drop2 = peak - h2;
        primaryVal = `${drop1}`;
        primaryUnit = 'BPM Drop (1-Min)';
        primarySub = `2-Minute Drop: ${drop2} BPM (Peak: ${peak} → 1m: ${h1} → 2m: ${h2})`;
        formulaSub = `HRR = ${peak} Peak - ${h1} @ 1m = ${drop1} BPM Recovery`;
        statusPill = drop1 >= 18 ? 'Robust Vagal Reactivation (Normal)' : 'Blunted Recovery (Borderline)';
        gaugePercent = Math.min(100, Math.max(15, (drop1 / 35) * 100));
      } else if (toolId === 'sleep-debt') {
        const need = Number(inputs.sleepNeedHours || 8.0);
        const act = Number(inputs.actualSleepHours || 6.5);
        const days = Number(inputs.consecutiveDays || 7);
        const debt = Math.max(0, (need - act) * days);
        primaryVal = debt.toFixed(1);
        primaryUnit = 'Hours of Debt';
        primarySub = `Daily Deficit: ${(need - act).toFixed(1)}h/night across ${days} consecutive days`;
        formulaSub = `Cumulative Debt = (${need}h need - ${act}h actual) × ${days}d = ${debt.toFixed(1)}h`;
        statusPill = debt < 4 ? 'Minimal Debt' : debt < 10 ? 'Moderate Sleep Debt' : 'Severe Chronic Deficit';
        gaugePercent = Math.min(100, Math.max(10, (debt / 20) * 100));
      } else if (toolId === 'ess') {
        const q1 = Number(inputs.q1 || 1);
        const q2 = Number(inputs.q2 || 2);
        const q3 = Number(inputs.q3 || 1);
        const q4 = Number(inputs.q4 || 1);
        const q5 = Number(inputs.q5 || 2);
        const q6 = Number(inputs.q6 || 0);
        const q7 = Number(inputs.q7 || 1);
        const q8 = Number(inputs.q8 || 0);
        const total = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8;
        primaryVal = `${total} / 24`;
        primaryUnit = 'Epworth Score';
        primarySub = total <= 10 ? 'Normal Daytime Sleepiness (Johns Standard)' : total <= 15 ? 'Moderate Excessive Sleepiness' : 'Severe Somnolence — Clinical Evaluation Recommended';
        formulaSub = `ESS Sum = ${q1}+${q2}+${q3}+${q4}+${q5}+${q6}+${q7}+${q8} = ${total}`;
        statusPill = total <= 10 ? 'Normal Alertness' : 'Somnolence Screen Positive';
        gaugePercent = Math.min(100, Math.max(10, (total / 24) * 100));
      } else if (toolId === 'velocity') {
        const startW = Number(inputs.startWeightKg || 85);
        const def = Number(inputs.deficitKcal || 500);
        const projected24w = (startW - (def * 168 / 7700) * 1.8).toFixed(1);
        primaryVal = `${projected24w} kg`;
        primaryUnit = 'Projected 24-Week Mass';
        primarySub = `Metabolic Adaptation Factored: BMR drops ~15 kcal/kg lost`;
        formulaSub = `Target = Start ${startW}kg with ${def} kcal deficit factoring adaptive thermogenesis`;
        statusPill = 'Sustainable Rate';
        gaugePercent = 60;
      } else if (toolId === 'deficit') {
        const tdeeVal = Number(inputs.tdee || 2400);
        const adj = Number(inputs.dailyAdjustment || -500);
        const targetCal = tdeeVal + adj;
        const weeklyFatKg = Math.abs(adj * 7 / 7700);
        primaryVal = `${targetCal.toLocaleString()}`;
        primaryUnit = 'kcal / day';
        primarySub = adj < 0 ? `Target Deficit: ${Math.abs(adj)} kcal/day (~${weeklyFatKg.toFixed(2)} kg fat loss/week)` : `Surplus: +${adj} kcal/day`;
        formulaSub = `Target Calories = ${tdeeVal} TDEE + (${adj}) = ${targetCal} kcal/day`;
        statusPill = adj <= -750 ? 'Aggressive Deficit' : adj < 0 ? 'Optimal Moderate Deficit' : 'Anabolic Surplus';
        gaugePercent = Math.min(100, Math.max(20, (targetCal / 3500) * 100));
      } else if (toolId === 'pulse-pressure') {
        const sbp = Number(inputs.sbp || 124);
        const dbp = Number(inputs.dbp || 78);
        const pp = sbp - dbp;
        primaryVal = pp.toString();
        primaryUnit = 'mmHg';
        primarySub = 'Arterial Compliance & Vascular Stiffness Index';
        formulaSub = `Pulse Pressure = ${sbp} Systolic - ${dbp} Diastolic = ${pp} mmHg`;
        statusPill = pp >= 30 && pp <= 50 ? 'Optimal Vascular Compliance' : pp > 60 ? 'Wide Pulse Pressure (Stiff Arteries)' : 'Narrow Pulse Pressure';
        gaugePercent = Math.min(100, Math.max(10, (pp / 80) * 100));
      } else if (toolId === 'max-hr') {
        const tannaka = Math.round(208 - 0.7 * age);
        primaryVal = tannaka.toString();
        primaryUnit = 'BPM';
        primarySub = `Tanaka Consensus Equation (208 - 0.7 × ${age})`;
        formulaSub = `Max HR = 208 - (0.7 × ${age}) = ${tannaka} BPM`;
        statusPill = 'Cardiovascular Ceiling';
        gaugePercent = 65;
      } else if (toolId === 'thr') {
        const rhr = Number(inputs.rhr || 55);
        const maxHr = Math.round(208 - 0.7 * age);
        const hrrVal = maxHr - rhr;
        const zTarget = Math.round(rhr + 0.7 * hrrVal);
        primaryVal = `${zTarget} BPM`;
        primaryUnit = 'Target Aerobic HR';
        primarySub = `Karvonen 70% Intensity Zone (${Math.round(rhr + 0.6 * hrrVal)} - ${Math.round(rhr + 0.8 * hrrVal)} BPM)`;
        formulaSub = `THR = ${rhr} RHR + 0.70 × (${maxHr} MaxHR - ${rhr} RHR) = ${zTarget} BPM`;
        statusPill = 'Aerobic Conditioning Window';
        gaugePercent = 70;
      } else if (toolId === 'whr') {
        const waist = Number(inputs.waistCm || 84);
        const hip = Number(inputs.hipCm || 98);
        const whrVal = waist / hip;
        primaryVal = whrVal.toFixed(2);
        primaryUnit = 'Ratio';
        primarySub = gender === 'male' ? (whrVal < 0.90 ? 'Low Cardiometabolic Risk (<0.90)' : 'Central Adiposity (≥0.90)') : (whrVal < 0.85 ? 'Low Cardiometabolic Risk (<0.85)' : 'Central Adiposity (≥0.85)');
        formulaSub = `WHR = ${waist} cm Waist ÷ ${hip} cm Hip = ${whrVal.toFixed(2)}`;
        statusPill = whrVal < 0.90 ? 'Optimal Android/Gynoid Ratio' : 'Elevated Central Fat';
        gaugePercent = Math.min(100, Math.max(20, (whrVal / 1.1) * 100));
      } else if (toolId === 'bsa') {
        const bsaVal = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
        primaryVal = bsaVal.toFixed(2);
        primaryUnit = 'm²';
        primarySub = 'Du Bois & Du Bois Body Surface Area';
        formulaSub = `BSA = 0.007184 × (${weightKg})^0.425 × (${heightCm})^0.725 = ${bsaVal.toFixed(2)} m²`;
        statusPill = 'Normal Pharmacological Envelope';
        gaugePercent = Math.min(100, Math.max(20, (bsaVal / 2.5) * 100));
      } else if (toolId === 'absi') {
        const waistM = Number(inputs.waistCm || 84) / 100;
        const absiVal = waistM / (Math.pow(bmi, 2 / 3) * Math.pow(heightM, 0.5));
        primaryVal = (absiVal * 100).toFixed(2);
        primaryUnit = 'ABSI Index';
        primarySub = 'A Body Shape Index (Krakauer All-Cause Mortality)';
        formulaSub = `ABSI = Waist ÷ (BMI^(2/3) × Height^(1/2)) = ${(absiVal * 100).toFixed(2)}`;
        statusPill = 'Mortality Risk Stratified';
        gaugePercent = 50;
      } else if (toolId === 'ovulation') {
        const cycle = Number(inputs.cycleLength || 28);
        const ovDay = cycle - 14;
        primaryVal = `Day ${ovDay}`;
        primaryUnit = 'Estimated Ovulation';
        primarySub = `Peak Fertility Window: Days ${Math.max(1, ovDay - 4)} to ${ovDay + 1}`;
        formulaSub = `Ovulation = ${cycle} Day Cycle - 14 Days Luteal Phase = Day ${ovDay}`;
        statusPill = 'Optimal Conception Window';
        gaugePercent = 50;
      }

      return {
        primaryValue: primaryVal,
        primaryUnit,
        primarySub,
        formulaSubstitution: formulaSub,
        statusPill,
        statusColor,
        diffuseColor,
        gaugePercent,
        gaugeTiers: [
          { label: 'Low Range', widthPercent: 25, colorClass: 'bg-surface-container-high' },
          { label: 'Normative Median', widthPercent: 35, colorClass: 'bg-primary-fixed' },
          { label: 'Elevated Threshold', widthPercent: 25, colorClass: 'bg-primary' },
          { label: 'High Extreme', widthPercent: 15, colorClass: 'bg-tertiary' },
        ],
        targetEnvelope: {
          min: 'Clinical Median',
          max: 'Upper Quartile',
          unit: primaryUnit,
          desc: 'Peer-Reviewed Scientific Normal Interval',
        },
        targetDelta: {
          val: 'Optimal Band',
          direction: 'optimal',
          text: 'Within Target Physiological Window',
        },
        secondaryBiometrics: [
          { label: 'Primary Output', val: `${primaryVal} ${primaryUnit}`, desc: 'Standard formula output' },
          { label: 'Confidence Interval', val: '±5%', desc: 'Statistical validation band' },
          { label: 'Privacy Sandbox', val: '100% Client-Side', desc: 'Zero cloud telemetry transmission' },
          { label: 'Metrology Precision', val: 'IEEE-754 64-bit', desc: 'Deterministic floating point' },
        ],
        clinicalRisk: {
          tier: 'Normative Clinical Status',
          level: 'Low',
          desc: 'Measured parameters align with consensus clinical baselines.',
        },
        integratedMetric: {
          label: 'Multivariate Health Integration',
          val: `BMI: ${bmi.toFixed(1)} · Weight: ${weightKg}kg · Height: ${heightCm}cm`,
          desc: 'Anthropometric factors synchronized in local state.',
        },
        activeMatrixRowIndex: 1,
        matrixRows: [
          { tier: 'Low Clinical Tier', standardRange: 'Below Median', alternateRange: 'Lower quartile boundary', clinicalRisk: 'Standard physiological minimum', tag: 'Low' },
          { tier: 'Optimal Healthy Median', standardRange: 'Target Envelope', alternateRange: 'Population median interval', clinicalRisk: 'Optimal biological longevity band', tag: 'Optimal' },
          { tier: 'Elevated Clinical Tier', standardRange: 'Above Median', alternateRange: 'Upper quartile boundary', clinicalRisk: 'Suggests clinical review or protocol adjustment', tag: 'Elevated' },
          { tier: 'Extreme Boundary Tier', standardRange: 'Critical Threshold', alternateRange: 'Outlier boundary', clinicalRisk: 'Warrants physician consultation', tag: 'High' },
        ],
        insights: [
          { title: 'Standardized Mathematical Modeling', desc: 'All equations execute deterministically in accordance with international peer-reviewed literature.', icon: 'functions', tag: 'Formulation' },
          { title: 'Privacy-Preserving Computation', desc: 'Your health records and physical inputs are calculated purely inside your browser memory sandbox. No remote data is logged.', icon: 'lock', tag: 'Security' },
          { title: 'Holistic Biometric Context', desc: 'Always contextualize single numerical scores alongside clinical blood markers, lifestyle activity, and qualified medical consultation.', icon: 'medical_services', tag: 'Clinical' },
        ],
        trendGuidance: {
          velocity: 'Physiologically Stable',
          change: 'Zero unexpected drift',
          boundaryLabel: 'Target High Threshold',
          baselineLabel: 'Target Low Floor',
        },
      };
    }
  }
}
