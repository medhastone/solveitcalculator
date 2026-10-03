/**
 * Authoritative Single Source of Truth for SolveItCalculator
 * Verified metrics derived from the active repository routes and calculation catalogs.
 */

export interface CategoryMetadata {
  id: string;
  name: string;
  slug: string;
  href: string;
  description: string;
  toolCount: number;
}

export const SITE_INVENTORY = {
  platformName: 'SolveIt Calculator',
  domain: 'https://solveitcalculator.com',
  lastVerifiedAudit: 'October 2026',
  totalIndexedPages: 224,
  coreCategoriesCount: 11,
  primaryCalculatorsCount: 65,
  conversionFamiliesCount: 22,
};

export const CORE_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'finance',
    name: 'Finance & Banking',
    slug: 'finance',
    href: '/finance',
    description: 'Mortgage, loans, amortization, compound growth, savings, credit cards, and tax estimators.',
    toolCount: 15,
  },
  {
    id: 'conversions',
    name: 'Unit Converters',
    slug: 'conversions',
    href: '/conversions',
    description: 'Length, mass, volume, temperature, pressure, energy, speed, and culinary measurements.',
    toolCount: 22,
  },
  {
    id: 'math',
    name: 'Math & Statistics',
    slug: 'math',
    href: '/math',
    description: 'Percentages, fractions, scientific computation, algebra, and symmetric variance.',
    toolCount: 8,
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    slug: 'health-fitness-calculators',
    href: '/health-fitness-calculators',
    description: 'Body Mass Index (BMI), running pace, lap splits, and heart rate zones.',
    toolCount: 6,
  },
  {
    id: 'time-date',
    name: 'Time & Date',
    slug: 'time-date',
    href: '/time-date',
    description: 'Age, date differences, event countdowns, Julian day numbers, and leap years.',
    toolCount: 12,
  },
  {
    id: 'science',
    name: 'Science & Physics',
    slug: 'science',
    href: '/science',
    description: 'Astronomical dates, celestial ephemerides, solar eclipses, and physical formulas.',
    toolCount: 6,
  },
  {
    id: 'technology',
    name: 'Technology & Data',
    slug: 'technology',
    href: '/technology',
    description: 'Data storage, transfer bandwidth, frequency, and number systems.',
    toolCount: 8,
  },
  {
    id: 'automotive',
    name: 'Automotive & Mechanical',
    slug: 'automotive',
    href: '/automotive',
    description: 'Gear ratios, speed-at-RPM, engine displacement, and fuel economy.',
    toolCount: 5,
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    slug: 'electrical',
    href: '/electrical',
    description: 'Wire sizing, voltage drop, Ohm’s law, and three-phase power.',
    toolCount: 6,
  },
  {
    id: 'home-construction',
    name: 'Home & Construction',
    slug: 'home-construction',
    href: '/home-construction',
    description: 'Concrete volume, flooring area, framing lumber, and roofing materials.',
    toolCount: 5,
  },
  {
    id: 'education',
    name: 'Education & Academics',
    slug: 'education',
    href: '/education',
    description: 'GPA calculations, grade curves, study schedules, and student planning.',
    toolCount: 5,
  },
];

export function getVerifiedToolCount(): number {
  return SITE_INVENTORY.primaryCalculatorsCount;
}

export function getVerifiedCategoriesCount(): number {
  return SITE_INVENTORY.coreCategoriesCount;
}

export function getVerifiedAuditDate(): string {
  return SITE_INVENTORY.lastVerifiedAudit;
}
