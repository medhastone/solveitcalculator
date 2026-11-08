/**
 * Shared Finance Core Library - SolveIt Calculator
 * Unified, tested mathematical and domain algorithms for financial & retirement tools.
 */

export {
  calculateFourOhOneK,
  getIrsElectiveDeferralLimit,
  IRS_401K_LIMITS,
  type CompoundingTiming,
  type FourOhOneKInput,
  type FourOhOneKYearRow,
  type FourOhOneKResult,
} from './401k';

export {
  calculateRothVsTraditional,
  VERIFIED_IRS_RETIREMENT_LIMITS,
  VERIFIED_IRS_RMD_TABLE,
  type ContributionFrequencyMode,
  type RothVsTraditionalInput,
  type RothVsTraditionalYearRow,
  type RetirementRateSensitivityRow,
  type RothVsTraditionalResult,
} from './roth-vs-traditional';

export {
  calculateRmd,
  getRmdStartAge,
  getUniformLifetimeFactor,
  getJointLifeExpectancyFactor,
  type RmdInput,
  type RmdFirstYearDeferral,
  type RmdScheduleRow,
  type RmdResult,
} from './rmd';

import limitsRetirementData from '../../data/limits-retirement-us.json';
import rmdTablesData from '../../data/rmd-tables.json';

export { limitsRetirementData, rmdTablesData };
