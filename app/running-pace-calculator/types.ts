export type CalculationMode =
  | 'pace'
  | 'time'
  | 'distance'
  | '5k'
  | '10k'
  | 'half'
  | 'marathon'
  | 'splits'
  | 'target'
  | 'zones';

export type DistanceUnit = 'km' | 'miles' | 'meters' | 'yards';
export type PaceUnit = 'km' | 'mile';
export type SplitStrategy = 'even' | 'negative' | 'positive';
export type SplitViewUnit = 'km' | 'miles';

export interface SplitCheckpoint {
  label: string;
  unitDistance?: number;
  intervalDistanceText?: string;
  splitDurationSec: number;
  splitDurationFormatted?: string;
  splitPaceSec: number;
  cumulativeSec: number;
  deltaText: string;
  deltaColorClass: string;
}
