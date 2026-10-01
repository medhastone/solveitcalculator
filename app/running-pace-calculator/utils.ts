import { SplitCheckpoint, SplitStrategy, SplitViewUnit } from './types';

export const MILES_TO_KM = 1.609344;
export const KM_TO_MILES = 0.621371192;
export const METERS_TO_KM = 0.001;
export const YARDS_TO_KM = 0.0009144;

export const OFFICIAL_DISTANCES_KM = {
  fiveK: 5.0,
  tenK: 10.0,
  halfMarathon: 21.0975,
  marathon: 42.195,
  fiftyK: 50.0,
};

export function formatTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00:00';
  const sec = Math.round(totalSeconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
}

export function formatPace(paceSec: number): string {
  if (isNaN(paceSec) || paceSec <= 0) return '0:00';
  const sec = Math.round(paceSec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function secondsToHms(totalSeconds: number): { h: number; m: number; s: number } {
  if (isNaN(totalSeconds) || totalSeconds < 0) return { h: 0, m: 0, s: 0 };
  const sec = Math.round(totalSeconds);
  return {
    h: Math.floor(sec / 3600),
    m: Math.floor((sec % 3600) / 60),
    s: sec % 60,
  };
}

export function toKilometers(val: number, unit: 'km' | 'miles' | 'meters' | 'yards'): number {
  if (isNaN(val) || val <= 0) return 0;
  if (unit === 'miles') return val * MILES_TO_KM;
  if (unit === 'meters') return val * METERS_TO_KM;
  if (unit === 'yards') return val * YARDS_TO_KM;
  return val;
}

export function fromKilometers(kmVal: number, unit: 'km' | 'miles' | 'meters' | 'yards'): number {
  if (isNaN(kmVal) || kmVal <= 0) return 0;
  if (unit === 'miles') return kmVal * KM_TO_MILES;
  if (unit === 'meters') return kmVal * 1000;
  if (unit === 'yards') return kmVal / YARDS_TO_KM;
  return kmVal;
}

/**
 * Peter Riegel's Race Time Prediction Formula (1977)
 * T2 = T1 * (D2 / D1)^b
 * Standard fatigue exponent b = 1.06
 */
export function calculateRiegelProjection(
  baseDistanceKm: number,
  baseTimeSec: number,
  targetDistanceKm: number,
  fatigueExponent: number = 1.06
): { projectedSec: number; formattedTime: string; paceSecKm: number } {
  if (baseDistanceKm <= 0 || baseTimeSec <= 0 || targetDistanceKm <= 0) {
    return { projectedSec: 0, formattedTime: '00:00:00', paceSecKm: 0 };
  }
  const projectedSec = Math.round(baseTimeSec * Math.pow(targetDistanceKm / baseDistanceKm, fatigueExponent));
  const paceSecKm = projectedSec / targetDistanceKm;
  return {
    projectedSec,
    formattedTime: formatTime(projectedSec),
    paceSecKm,
  };
}

/**
 * Jack Daniels & Jimmy Gilbert VDOT Formula (1979)
 * VO2 = -4.60 + 0.182258 * v + 0.000104 * v^2
 * %VO2max = 0.8 + 0.1894393 * e^(-0.012778 * t) + 0.2989558 * e^(-0.1932605 * t)
 * VDOT = VO2 / %VO2max
 * where v = velocity in meters/min, t = race time in minutes
 */
export function calculateVDOT(distanceKm: number, totalSeconds: number): number {
  if (distanceKm <= 0 || totalSeconds <= 0) return 40;
  const timeMinutes = totalSeconds / 60;
  const distanceMeters = distanceKm * 1000;
  const velocity = distanceMeters / timeMinutes; // m/min

  const vo2 = -4.6 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
  const percentMax =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMinutes) +
    0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  if (percentMax <= 0) return 40;
  const vdot = vo2 / percentMax;
  return Math.min(85, Math.max(25, Math.round(vdot * 10) / 10));
}

/**
 * Inverts the Jack Daniels oxygen-cost equation to compute velocity (m/min)
 * and pace (sec/km) for a specific percentage of VDOT.
 * 0.000104 * v^2 + 0.182258 * v - (targetVO2 + 4.6) = 0
 */
export function vdotToPaceSecPerKm(vdot: number, intensityFraction: number): number {
  const targetVO2 = vdot * intensityFraction;
  const a = 0.000104;
  const b = 0.182258;
  const c = -(targetVO2 + 4.6);

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return 300;
  const velocityMpm = (-b + Math.sqrt(discriminant)) / (2 * a);
  if (velocityMpm <= 0) return 300;

  // Velocity is m/min -> 1000m takes 1000 / velocity minutes -> (1000 / velocity) * 60 seconds
  return (1000 / velocityMpm) * 60;
}

export interface TrainingZone {
  code: string;
  name: string;
  pctHr: string;
  pctVdot: string;
  paceRangeKm: string;
  paceRangeMile: string;
  purpose: string;
  color: string;
  badgeColor: string;
}

export function getDanielsTrainingZones(vdot: number): TrainingZone[] {
  // Easy (E): 62% - 74% VDOT
  const ePaceSlow = vdotToPaceSecPerKm(vdot, 0.62);
  const ePaceFast = vdotToPaceSecPerKm(vdot, 0.74);

  // Marathon (M): 75% - 84% VDOT
  const mPaceSlow = vdotToPaceSecPerKm(vdot, 0.75);
  const mPaceFast = vdotToPaceSecPerKm(vdot, 0.84);

  // Threshold (T): 86% - 88% VDOT
  const tPaceSlow = vdotToPaceSecPerKm(vdot, 0.86);
  const tPaceFast = vdotToPaceSecPerKm(vdot, 0.88);

  // Interval (I): 95% - 100% VDOT
  const iPaceSlow = vdotToPaceSecPerKm(vdot, 0.95);
  const iPaceFast = vdotToPaceSecPerKm(vdot, 1.00);

  // Repetition (R): 105% - 110% VDOT
  const rPaceSlow = vdotToPaceSecPerKm(vdot, 1.05);
  const rPaceFast = vdotToPaceSecPerKm(vdot, 1.10);

  return [
    {
      code: 'Zone 1 (Easy)',
      name: 'Easy & Recovery Runs',
      pctHr: '65% - 79% Heart Rate',
      pctVdot: 'Comfortable & Conversational',
      paceRangeKm: `${formatPace(ePaceFast)} - ${formatPace(ePaceSlow)} /km`,
      paceRangeMile: `${formatPace(ePaceFast * MILES_TO_KM)} - ${formatPace(ePaceSlow * MILES_TO_KM)} /mi`,
      purpose: 'Builds stamina, burns fat, and helps muscles recover safely without fatigue.',
      color: 'border-emerald-200/80 bg-emerald-50/70 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-100',
      badgeColor: 'bg-emerald-100/90 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border dark:border-emerald-700/50',
    },
    {
      code: 'Zone 2 (Steady)',
      name: 'Steady Marathon Pace',
      pctHr: '80% - 87% Heart Rate',
      pctVdot: 'Controlled & Sustainable',
      paceRangeKm: `${formatPace(mPaceFast)} - ${formatPace(mPaceSlow)} /km`,
      paceRangeMile: `${formatPace(mPaceFast * MILES_TO_KM)} - ${formatPace(mPaceSlow * MILES_TO_KM)} /mi`,
      purpose: 'Teaches your body to hold a steady, comfortable rhythm over long distances with smooth form.',
      color: 'border-sky-200/80 bg-sky-50/70 text-sky-950 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-100',
      badgeColor: 'bg-sky-100/90 text-sky-900 dark:bg-sky-900/60 dark:text-sky-200 dark:border dark:border-sky-700/50',
    },
    {
      code: 'Zone 3 (Tempo)',
      name: 'Comfortably Hard (Tempo)',
      pctHr: '88% - 92% Heart Rate',
      pctVdot: 'Challenging but Steady',
      paceRangeKm: `${formatPace(tPaceFast)} - ${formatPace(tPaceSlow)} /km`,
      paceRangeMile: `${formatPace(tPaceFast * MILES_TO_KM)} - ${formatPace(tPaceSlow * MILES_TO_KM)} /mi`,
      purpose: 'Builds stamina and trains your body to delay tiredness during sustained, faster efforts.',
      color: 'border-indigo-200/80 bg-indigo-50/70 text-indigo-950 dark:border-indigo-500/30 dark:bg-indigo-950/30 dark:text-indigo-100',
      badgeColor: 'bg-indigo-100/90 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200 dark:border dark:border-indigo-700/50',
    },
    {
      code: 'Zone 4 (Hard)',
      name: 'Speed Intervals',
      pctHr: '93% - 97% Heart Rate',
      pctVdot: 'Near Maximum Effort',
      paceRangeKm: `${formatPace(iPaceFast)} - ${formatPace(iPaceSlow)} /km`,
      paceRangeMile: `${formatPace(iPaceFast * MILES_TO_KM)} - ${formatPace(iPaceSlow * MILES_TO_KM)} /mi`,
      purpose: 'Boosts aerobic power and lung capacity through short, high-energy push intervals.',
      color: 'border-amber-200/80 bg-amber-50/70 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100',
      badgeColor: 'bg-amber-100/90 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 dark:border dark:border-amber-700/50',
    },
    {
      code: 'Zone 5 (Sprint)',
      name: 'Fast Repeats & Sprints',
      pctHr: '98%+ Heart Rate (Max)',
      pctVdot: 'Top Speed Drills',
      paceRangeKm: `${formatPace(rPaceFast)} - ${formatPace(rPaceSlow)} /km`,
      paceRangeMile: `${formatPace(rPaceFast * MILES_TO_KM)} - ${formatPace(rPaceSlow * MILES_TO_KM)} /mi`,
      purpose: 'Develops quick leg turnover, better running form, and explosive sprint speed.',
      color: 'border-rose-200/80 bg-rose-50/70 text-rose-950 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-100',
      badgeColor: 'bg-rose-100/90 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200 dark:border dark:border-rose-700/50',
    },
  ];
}

/**
 * Caloric expenditure based on ACSM and Margaria et al.:
 * Gross Energy Cost = ~1.036 kcal / kg / km on flat asphalt
 * + Elevation cost: ~0.9 kcal / kg per 100m vertical climb
 * * Surface coefficient: track 0.99, road 1.0, treadmill 0.96, trail 1.08
 */
export function calculateCaloricExpenditure(
  distanceKm: number,
  weightKg: number,
  elevationGainMeters: number = 0,
  terrainType: string = 'road'
): number {
  if (distanceKm <= 0 || weightKg <= 0) return 0;

  let terrainFactor = 1.0;
  if (terrainType === 'track') terrainFactor = 0.99;
  else if (terrainType === 'treadmill') terrainFactor = 0.96;
  else if (terrainType === 'trail') terrainFactor = 1.08;

  const baseCost = distanceKm * weightKg * 1.036 * terrainFactor;
  const elevationCost = (elevationGainMeters / 100) * weightKg * 0.9;
  return Math.max(0, Math.round(baseCost + elevationCost));
}

/**
 * Generates accurate lap splits for any distance and pacing strategy.
 * Raw interval durations are normalized so cumulative time EXACTLY equals target time.
 */
export function generateSplits(
  distKm: number,
  totalSec: number,
  basePaceSecPerKm: number,
  strategy: SplitStrategy,
  viewUnit: SplitViewUnit
): SplitCheckpoint[] {
  if (distKm <= 0 || totalSec <= 0) return [];

  const isKm = viewUnit === 'km';
  const unitFactor = isKm ? 1 : MILES_TO_KM;
  const totalUnits = distKm / unitFactor;
  const wholeUnits = Math.floor(totalUnits);
  const remainder = totalUnits - wholeUnits;

  const splitsCount = remainder > 0.01 ? wholeUnits + 1 : wholeUnits;
  if (splitsCount === 0) return [];

  const rawDeltas: number[] = [];
  for (let i = 0; i < splitsCount; i++) {
    const isLast = i === splitsCount - 1 && remainder > 0.01;
    const intervalDist = isLast ? remainder : 1;

    let strategyFactor = 1.0;
    if (strategy === 'negative') {
      // Starts ~2.5% slower, finishes ~2.5% faster
      strategyFactor = 1.025 - 0.05 * (i / Math.max(1, splitsCount - 1));
    } else if (strategy === 'positive') {
      // Starts ~2.5% faster, finishes ~2.5% slower
      strategyFactor = 0.975 + 0.05 * (i / Math.max(1, splitsCount - 1));
    }

    const rawIntervalSec = intervalDist * (basePaceSecPerKm * unitFactor) * strategyFactor;
    rawDeltas.push(rawIntervalSec);
  }

  const rawSum = rawDeltas.reduce((a, b) => a + b, 0);
  const normScale = rawSum > 0 ? totalSec / rawSum : 1;

  let cumulativeSec = 0;
  const results: SplitCheckpoint[] = [];

  for (let i = 0; i < splitsCount; i++) {
    const isLast = i === splitsCount - 1 && remainder > 0.01;
    const intervalDist = isLast ? remainder : 1;
    const intervalDistFormatted = intervalDist.toFixed(2);

    let splitDurationSec: number;
    if (i === splitsCount - 1) {
      splitDurationSec = Math.max(1, Math.round(totalSec - cumulativeSec));
      cumulativeSec = totalSec;
    } else {
      splitDurationSec = Math.round(rawDeltas[i] * normScale);
      cumulativeSec += splitDurationSec;
    }

    const splitPaceSec = intervalDist > 0 ? splitDurationSec / intervalDist : basePaceSecPerKm * unitFactor;
    const baseUnitPace = basePaceSecPerKm * unitFactor;
    const deltaDiff = splitPaceSec - baseUnitPace;

    let deltaText = 'EVEN (±0s)';
    let deltaColorClass = 'text-on-surface-variant font-medium';

    if (Math.abs(deltaDiff) >= 0.5) {
      const diffSec = Math.abs(Math.round(deltaDiff));
      if (deltaDiff > 0) {
        deltaText = `+${diffSec}s slower`;
        deltaColorClass = 'text-amber-700 font-semibold';
      } else {
        deltaText = `-${diffSec}s faster`;
        deltaColorClass = 'text-emerald-700 font-semibold';
      }
    }

    const unitLabel = isKm ? 'km' : 'mi';
    const checkPointDist = isLast ? totalUnits.toFixed(2) : (i + 1).toString();
    const label = isLast
      ? `Finish (${checkPointDist} ${unitLabel})`
      : `${checkPointDist} ${unitLabel}`;

    results.push({
      label,
      unitDistance: intervalDist,
      intervalDistanceText: `${intervalDistFormatted} ${unitLabel}`,
      splitDurationSec,
      splitDurationFormatted: formatTime(splitDurationSec),
      splitPaceSec,
      cumulativeSec,
      deltaText,
      deltaColorClass,
    });
  }

  return results;
}
