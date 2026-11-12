'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Calculator,
  ArrowRight,
  ChevronRight,
  Flame,
  FolderOpen,
  Lightbulb,
  Settings,
  HelpCircle,
  LayoutGrid,
  ArrowLeftRight,
  Calendar,
  Heart,
  BarChart3,
  FlaskConical,
  Coins,
  Home,
  Clock,
  Scale,
  PiggyBank,
  TrendingUp,
  Ruler,
  Thermometer,
  Droplets,
  Gauge,
  Database,
  Activity,
  Flame as FlameIcon,
  Atom,
  Zap,
  Percent,
  Hammer,
  PaintBucket,
  Layers,
  Landmark,
  BookOpen,
  Hash,
} from 'lucide-react';

export type CategoryIconName =
  | 'calculator'
  | 'arrow-left-right'
  | 'calendar'
  | 'heart'
  | 'bar-chart'
  | 'flask'
  | 'coins'
  | 'home'
  | 'clock'
  | 'scale'
  | 'piggy-bank'
  | 'trending-up'
  | 'ruler'
  | 'thermometer'
  | 'droplets'
  | 'gauge'
  | 'database'
  | 'activity'
  | 'flame'
  | 'atom'
  | 'zap'
  | 'percent'
  | 'hammer'
  | 'paint-bucket'
  | 'layers'
  | 'landmark';

export interface CategoryToolRow {
  id: string;
  name: string;
  description: string;
  href: string;
  category: string;
  displayBadge: string;
  iconName: CategoryIconName;
  symbolText?: string;
  iconBg: string;
  iconColor: string;
  isPopular?: boolean;
  isComingSoon?: boolean;
}

export interface RelatedCategoryItem {
  name: string;
  href: string;
  iconName: CategoryIconName;
  iconBg: string;
  iconColor: string;
}

export interface ChooseStepItem {
  step: number;
  title: string;
  description: string;
}

export interface CategoryFaqItem {
  question: string;
  answer: string;
}

export interface CategoryCheatSheetRow {
  metricOrConversion: string;
  formulaOrFactor: string;
  exampleApplication: string;
}

export interface MatchingGuideLink {
  title: string;
  description: string;
  href: string;
}

export interface CategoryHubConfig {
  id: string;
  breadcrumbLabel: string;
  parentBreadcrumb?: { label: string; href: string };
  title: string;
  shortTitle: string;
  introduction: string;
  searchPlaceholder: string;
  headerIconName: CategoryIconName;
  heroBadgeTopLeft: string;
  heroBadgeBottomLeft: string;
  filters: string[];
  tools: CategoryToolRow[];
  relatedCategories: RelatedCategoryItem[];
  chooseGuideHeading: string;
  chooseSteps: ChooseStepItem[];
  faqs: CategoryFaqItem[];
  cheatSheetRows?: CategoryCheatSheetRow[];
  matchingGuides?: MatchingGuideLink[];
}

const DEFAULT_CATEGORY_CHEAT_SHEETS: Record<string, CategoryCheatSheetRow[]> = {
  'home-construction': [
    {
      metricOrConversion: 'Rectangular Room / Flooring Area',
      formulaOrFactor: 'Area = Length × Width (+ 5% to 15% Waste)',
      exampleApplication: '12 ft × 15 ft room = 180 sq ft (+10% waste = 198 sq ft)',
    },
    {
      metricOrConversion: 'Concrete Slab Volume (Cubic Yards)',
      formulaOrFactor: 'yd³ = [Length(ft) × Width(ft) × Depth(ft)] ÷ 27',
      exampleApplication: '10 ft × 10 ft × 4 in (0.333 ft) = 33.33 ft³ = 1.23 yd³',
    },
    {
      metricOrConversion: 'Cylindrical Post Hole Volume',
      formulaOrFactor: 'V = π × r² × Depth × Number of Holes',
      exampleApplication: '12 in dia (r = 0.5 ft) × 3 ft deep = 2.36 ft³ per hole',
    },
    {
      metricOrConversion: 'Pre-Mixed Concrete Bag Yields',
      formulaOrFactor: '80 lb bag ≈ 0.60 ft³ · 60 lb bag ≈ 0.45 ft³',
      exampleApplication: '35 ft³ slab ÷ 0.60 ft³ = 59 bags (80 lb) rounded up',
    },
  ],
  'unit-conversion': [
    {
      metricOrConversion: 'Length (Imperial ↔ Metric)',
      formulaOrFactor: '1 inch = 2.54 cm · 1 foot = 0.3048 m · 1 meter = 3.28084 ft',
      exampleApplication: '6 ft = 72 in = 182.88 cm = 1.8288 m',
    },
    {
      metricOrConversion: 'Weight & Mass (Pounds ↔ Kilograms)',
      formulaOrFactor: '1 kg = 2.20462 lb · 1 lb = 16 oz = 453.592 g',
      exampleApplication: '75 kg × 2.20462 = 165.35 lb',
    },
    {
      metricOrConversion: 'Cooking Volume & Baking Density',
      formulaOrFactor: '1 US Cup = 236.59 mL = 16 tbsp = 48 tsp',
      exampleApplication: '1 US Cup All-Purpose Flour ≈ 120 g · Granulated Sugar ≈ 200 g',
    },
    {
      metricOrConversion: 'Temperature (Celsius ↔ Fahrenheit)',
      formulaOrFactor: '°F = (°C × 9/5) + 32 · °C = (°F − 32) × 5/9',
      exampleApplication: '180°C baking oven = (180 × 1.8) + 32 = 356°F',
    },
  ],
  'date-time': [
    {
      metricOrConversion: 'Days Between Two Calendar Dates',
      formulaOrFactor: 'ΔDays = (UTC_End − UTC_Start) ÷ 86,400,000 ms',
      exampleApplication: 'Accounts for 28/29-day February leap years and 30/31-day months',
    },
    {
      metricOrConversion: 'Chronological Age Calculation',
      formulaOrFactor: 'Completed Years + Remaining Months + Remaining Days',
      exampleApplication: 'Born Mar 15, 1995 to Apr 20, 2026 = 31 Years, 1 Month, 5 Days',
    },
    {
      metricOrConversion: 'Standard Work Hours & Payroll Conversion',
      formulaOrFactor: 'Decimal Hours = Hours + (Minutes ÷ 60)',
      exampleApplication: '7 hours 45 minutes = 7.75 decimal hours',
    },
    {
      metricOrConversion: 'Leap Year Rule (Gregorian Calendar)',
      formulaOrFactor: 'Divisible by 4, except century years not divisible by 400',
      exampleApplication: '2024 and 2028 are leap years (366 days); 2025–2027 have 365 days',
    },
  ],
  'health-fitness': [
    {
      metricOrConversion: 'Body Mass Index (WHO Adult Standard)',
      formulaOrFactor: 'BMI = Weight(kg) ÷ [Height(m)]² = 703 × lb ÷ [in]²',
      exampleApplication: '70 kg at 1.75 m = 70 ÷ 3.0625 = 22.9 kg/m² (Normal range: 18.5–24.9)',
    },
    {
      metricOrConversion: 'Basal Metabolic Rate (Mifflin-St Jeor)',
      formulaOrFactor: '10×kg + 6.25×cm − 5×Age + (5 Male / −161 Female)',
      exampleApplication: '30-yr male, 70 kg, 175 cm = 1,648.75 kcal/day at rest',
    },
    {
      metricOrConversion: 'Total Daily Energy Expenditure (TDEE)',
      formulaOrFactor: 'TDEE = BMR × Activity Multiplier (1.2 to 1.9)',
      exampleApplication: 'Moderate exercise (1.55 × 1,649 BMR) ≈ 2,556 kcal/day maintenance',
    },
    {
      metricOrConversion: 'Target Heart Rate Zone (Karvonen)',
      formulaOrFactor: 'Max HR ≈ 220 − Age · Moderate Zone = 50%–70% Max HR',
      exampleApplication: 'Age 35 → Max HR 185 bpm · Aerobic zone: 130–157 bpm',
    },
  ],
  science: [
    {
      metricOrConversion: 'Ohm’s Law & Electrical Power',
      formulaOrFactor: 'V = I × R · P (Watts) = V × I = I² × R',
      exampleApplication: '120V circuit at 10A current = 1,200 Watts (12 Ω resistance)',
    },
    {
      metricOrConversion: 'Molarity & Solution Dilution',
      formulaOrFactor: 'M = moles ÷ Liters · M₁V₁ = M₂V₂',
      exampleApplication: '0.5 mol NaCl in 2 L solution = 0.25 M concentration',
    },
    {
      metricOrConversion: 'Kinematics & Constant Acceleration',
      formulaOrFactor: 'v = v₀ + a·t · d = v₀·t + ½·a·t²',
      exampleApplication: '0 to 20 m/s in 4s → a = 5 m/s², distance = 40 m',
    },
    {
      metricOrConversion: 'Percent Error (Experimental vs. Theoretical)',
      formulaOrFactor: '% Error = (|Experimental − Theoretical| ÷ |Theoretical|) × 100',
      exampleApplication: 'Measured 9.65 vs. 9.81 m/s² = 1.63% experimental error',
    },
  ],
};

function slugifySubcategory(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function RenderCategoryIcon({
  name,
  className = 'w-6 h-6',
}: {
  name: CategoryIconName;
  className?: string;
}) {
  switch (name) {
    case 'arrow-left-right':
      return <ArrowLeftRight className={className} aria-hidden="true" />;
    case 'calendar':
      return <Calendar className={className} aria-hidden="true" />;
    case 'heart':
      return <Heart className={className} aria-hidden="true" />;
    case 'bar-chart':
      return <BarChart3 className={className} aria-hidden="true" />;
    case 'flask':
      return <FlaskConical className={className} aria-hidden="true" />;
    case 'coins':
      return <Coins className={className} aria-hidden="true" />;
    case 'home':
      return <Home className={className} aria-hidden="true" />;
    case 'clock':
      return <Clock className={className} aria-hidden="true" />;
    case 'scale':
      return <Scale className={className} aria-hidden="true" />;
    case 'piggy-bank':
      return <PiggyBank className={className} aria-hidden="true" />;
    case 'trending-up':
      return <TrendingUp className={className} aria-hidden="true" />;
    case 'ruler':
      return <Ruler className={className} aria-hidden="true" />;
    case 'thermometer':
      return <Thermometer className={className} aria-hidden="true" />;
    case 'droplets':
      return <Droplets className={className} aria-hidden="true" />;
    case 'gauge':
      return <Gauge className={className} aria-hidden="true" />;
    case 'database':
      return <Database className={className} aria-hidden="true" />;
    case 'activity':
      return <Activity className={className} aria-hidden="true" />;
    case 'flame':
      return <FlameIcon className={className} aria-hidden="true" />;
    case 'atom':
      return <Atom className={className} aria-hidden="true" />;
    case 'zap':
      return <Zap className={className} aria-hidden="true" />;
    case 'percent':
      return <Percent className={className} aria-hidden="true" />;
    case 'hammer':
      return <Hammer className={className} aria-hidden="true" />;
    case 'paint-bucket':
      return <PaintBucket className={className} aria-hidden="true" />;
    case 'layers':
      return <Layers className={className} aria-hidden="true" />;
    case 'landmark':
      return <Landmark className={className} aria-hidden="true" />;
    case 'calculator':
    default:
      return <Calculator className={className} aria-hidden="true" />;
  }
}

export default function CategoryHubPageClient({
  config,
}: {
  config: CategoryHubConfig;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return config.tools.filter((tool) => {
      const matchesCat =
        selectedFilter === 'All' || tool.category === selectedFilter;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.displayBadge.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [config.tools, searchQuery, selectedFilter]);

  const subcategoryGroups = useMemo(() => {
    const nonAllFilters = config.filters.filter((f) => f !== 'All');
    const groups: { name: string; slug: string; tools: CategoryToolRow[] }[] = [];

    for (const subName of nonAllFilters) {
      const matching = config.tools.filter((t) => t.category === subName);
      if (matching.length > 0) {
        groups.push({
          name: subName,
          slug: slugifySubcategory(subName),
          tools: matching,
        });
      }
    }

    if (groups.length === 0 && config.tools.length > 0) {
      groups.push({
        name: config.shortTitle,
        slug: slugifySubcategory(config.shortTitle),
        tools: config.tools,
      });
    }

    return groups;
  }, [config.filters, config.tools, config.shortTitle]);

  const popularTools = useMemo(
    () => config.tools.filter((t) => t.isPopular),
    [config.tools]
  );

  const cheatSheet = useMemo(
    () =>
      config.cheatSheetRows ||
      DEFAULT_CATEGORY_CHEAT_SHEETS[config.id] ||
      DEFAULT_CATEGORY_CHEAT_SHEETS['unit-conversion'],
    [config.cheatSheetRows, config.id]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length === 1) {
      router.push(filteredTools[0].href);
    }
  };

  const liveTools = useMemo(
    () => config.tools.filter((t) => !t.isComingSoon && Boolean(t.href)),
    [config.tools]
  );

  // Build full Schema.org JSON-LD graph (CollectionPage + ItemList + FAQPage + BreadcrumbList)
  const categoryPath = `/${config.id}`;
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: config.title,
        description: config.introduction,
        url: `https://solveitcalculator.com${categoryPath}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: liveTools.length,
          itemListElement: liveTools.map((tool, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: tool.name,
            description: tool.description,
            url: `https://solveitcalculator.com${tool.href}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          ...(config.parentBreadcrumb
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: config.parentBreadcrumb.label,
                  item: `https://solveitcalculator.com${config.parentBreadcrumb.href}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: config.breadcrumbLabel,
                  item: `https://solveitcalculator.com${categoryPath}`,
                },
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: config.breadcrumbLabel,
                  item: `https://solveitcalculator.com${categoryPath}`,
                },
              ]),
        ],
      },
      ...(config.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: config.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  const renderToolCard = (tool: CategoryToolRow) => {
    if (tool.isComingSoon || !tool.href) {
      return (
        <div
          key={tool.id}
          role="listitem"
          className="rounded-xl bg-white/80 border border-dashed border-slate-300 px-4 py-3.5 opacity-85"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div
                className={`w-12 h-12 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0 font-extrabold text-sm`}
                aria-hidden="true"
              >
                {tool.symbolText ? (
                  <span>{tool.symbolText}</span>
                ) : (
                  <RenderCategoryIcon name={tool.iconName} className="w-6 h-6" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-base font-bold text-[#152238]">
                  {tool.name}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                  {tool.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-15 sm:pl-0">
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                {tool.displayBadge}
              </span>
              <span className="inline-flex items-center text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={tool.id}
        role="listitem"
        className="group rounded-xl bg-white border border-slate-200/90 px-4 py-3.5 hover:border-[#2457D6] hover:shadow-xs transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0 font-extrabold text-sm`}
              aria-hidden="true"
            >
              {tool.symbolText ? (
                <span>{tool.symbolText}</span>
              ) : (
                <RenderCategoryIcon name={tool.iconName} className="w-6 h-6" />
              )}
            </div>
            <div className="min-w-0">
              <Link
                href={tool.href}
                className="text-base font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
              >
                {tool.name}
              </Link>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
            <span className="text-[11px] font-semibold text-slate-700 bg-[#EEF3FA] border border-slate-200/80 dark:bg-[#1E2E4F] dark:text-[#E2E8F0] dark:border-[#334E7D] px-2.5 py-1 rounded-md">
              {tool.displayBadge}
            </span>
            <Link
              href={tool.href}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2457D6] hover:text-[#1d47b0] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md py-1 px-1.5"
            >
              <span>Open calculator</span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const isDefaultGroupedView =
    selectedFilter === 'All' && searchQuery.trim().length === 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* Category Header / Hero Section */}
      <section
        aria-labelledby={`${config.id}-category-heading`}
        className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#EAF2FF] via-[#F1F6FF] to-[#F5F7FA] pt-5 pb-6"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                >
                  Home
                </Link>
              </li>
              {config.parentBreadcrumb && (
                <>
                  <li aria-hidden="true" className="text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li>
                    <Link
                      href={config.parentBreadcrumb.href}
                      className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                    >
                      {config.parentBreadcrumb.label}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="text-[#2457D6] font-semibold">
                {config.breadcrumbLabel}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Icon + H1 + Intro + Search + Filters */}
            <div className="flex-1 max-w-4xl">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl bg-[#DCE8FF] border border-[#C6DBFF] text-[#2457D6] flex items-center justify-center shrink-0 shadow-2xs"
                  aria-hidden="true"
                >
                  <RenderCategoryIcon
                    name={config.headerIconName}
                    className="w-8 h-8 stroke-[2.2]"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#DCE8FF] text-[#1D4ED8] text-xs font-extrabold mb-1.5">
                    <span>{liveTools.length} Verified Calculators</span>
                    <span>•</span>
                    <span>Instant Step-by-Step Formulas</span>
                  </div>
                  <h1
                    id={`${config.id}-category-heading`}
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152238]"
                  >
                    {config.title}
                  </h1>
                  <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    {config.introduction}
                  </p>
                </div>
              </div>

              {/* Prominent Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label={config.searchPlaceholder}
                className="mt-5 flex items-center bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label
                  htmlFor={`${config.id}-category-search`}
                  className="sr-only"
                >
                  {config.searchPlaceholder}
                </label>
                <div className="pl-3 pr-2 text-[#152238] flex items-center pointer-events-none">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id={`${config.id}-category-search`}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={config.searchPlaceholder}
                  className="w-full py-2 px-2 text-sm sm:text-base text-[#152238] placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#2457D6] hover:bg-[#1d47b0] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  Search
                </button>
              </form>

              {/* Filter Controls */}
              <div
                role="group"
                aria-label={`Filter ${config.shortTitle.toLowerCase()} calculators by topic`}
                className="mt-3.5 flex flex-wrap items-center gap-2"
              >
                {config.filters.map((category) => {
                  const isActive = selectedFilter === category;
                  const count =
                    category === 'All'
                      ? liveTools.length
                      : liveTools.filter((t) => t.category === category)
                          .length;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedFilter(category)}
                      aria-pressed={isActive}
                      className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                          : 'bg-[#E2ECFC] hover:bg-[#D2E2FA] text-[#152238] border-[#C6DBFF] dark:bg-[#1E325C] dark:border-[#33528E] dark:text-[#F8FAFC] dark:hover:bg-[#284278]'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white/80 text-[#2457D6] dark:bg-slate-800 dark:text-blue-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Decorative Category Illustration */}
            <div
              aria-hidden="true"
              className="hidden xl:flex items-center justify-center relative w-64 h-44 shrink-0 select-none"
            >
              <div className="w-44 h-44 rounded-full bg-[#DCE8FF]/70 flex items-center justify-center relative">
                <div className="absolute -left-2 top-3 w-11 h-11 rounded-xl bg-[#16856B] text-white font-extrabold text-sm flex items-center justify-center shadow-sm -rotate-12">
                  {config.heroBadgeTopLeft}
                </div>
                <div className="absolute -left-5 bottom-8 w-11 h-10 rounded-xl bg-[#D1FAE5] text-[#16856B] font-extrabold text-xs flex items-center justify-center shadow-sm -rotate-6">
                  {config.heroBadgeBottomLeft}
                </div>
                <div className="w-24 h-32 rounded-2xl bg-[#2457D6] p-2.5 shadow-md rotate-12 flex flex-col justify-between border-2 border-[#3B82F6]">
                  <div className="h-6 rounded-md bg-[#93C5FD]/90 w-full" />
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#FBBF24]" />
                  </div>
                </div>
                <div className="absolute -right-3 top-12 w-11 h-11 rounded-xl bg-[#FBBF24] text-white font-extrabold text-lg flex items-center justify-center shadow-sm rotate-12">
                  <RenderCategoryIcon
                    name={config.headerIconName}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subcategory Silo Quick-Jump Bar */}
          {subcategoryGroups.length > 1 && (
            <nav
              aria-label="Subcategory quick-jump index"
              className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-xs"
            >
              <span className="font-extrabold text-[#152238] flex items-center gap-1 mr-1">
                <Hash className="w-3.5 h-3.5 text-[#2457D6]" aria-hidden="true" />
                Jump to Subcategory:
              </span>
              {subcategoryGroups.map((group) => (
                <a
                  key={group.slug}
                  href={`#subcat-${group.slug}`}
                  onClick={() => setSelectedFilter('All')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-[#EEF3FF] text-[#152238] hover:text-[#2457D6] border border-slate-200/90 font-semibold transition-colors shadow-2xs"
                >
                  <span>{group.name}</span>
                  <span className="text-[11px] font-bold text-[#2457D6]">
                    ({group.tools.filter((t) => !t.isComingSoon).length})
                  </span>
                </a>
              ))}
              <a
                href="#which-tool-guide"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] font-bold transition-colors"
              >
                <Settings className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Which One Should I Use?</span>
              </a>
              <a
                href="#category-faq"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-[#EEF3FF] text-[#152238] hover:text-[#2457D6] border border-slate-200/90 font-semibold transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#2457D6]" aria-hidden="true" />
                <span>FAQs</span>
              </a>
            </nav>
          )}
        </div>
      </section>

      {/* Main Two-Column Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {isDefaultGroupedView ? (
              <>
                {subcategoryGroups.map((group) => {
                  const activeCount = group.tools.filter((t) => !t.isComingSoon).length;
                  return (
                    <section
                      key={group.slug}
                      id={`subcat-${group.slug}`}
                      aria-labelledby={`heading-${group.slug}`}
                      className="scroll-mt-28 space-y-3.5"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <LayoutGrid
                            className="w-5 h-5 text-[#2457D6]"
                            aria-hidden="true"
                          />
                          <h2
                            id={`heading-${group.slug}`}
                            className="text-xl font-extrabold text-[#152238] tracking-tight"
                          >
                            {group.name} Calculators
                          </h2>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCE8FF] text-[#2457D6]">
                          {activeCount} {activeCount === 1 ? 'Tool' : 'Tools'}
                        </span>
                      </div>

                      <div className="space-y-3" role="list">
                        {group.tools.map((tool) => renderToolCard(tool))}
                      </div>
                    </section>
                  );
                })}
              </>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <LayoutGrid
                      className="w-5 h-5 text-[#2457D6]"
                      aria-hidden="true"
                    />
                    <h2 className="text-xl font-extrabold text-[#152238] tracking-tight">
                      {selectedFilter === 'All'
                        ? `Matching ${config.shortTitle} Calculators (${filteredTools.filter((t) => !t.isComingSoon).length})`
                        : `${selectedFilter} Calculators (${filteredTools.filter((t) => !t.isComingSoon).length})`}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
                    Choose a calculator below to open the interactive tool and formula guide.
                  </p>
                </div>

                {filteredTools.length > 0 ? (
                  <div className="space-y-3" role="list">
                    {filteredTools.map((tool) => renderToolCard(tool))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                    <p className="text-base font-bold text-[#152238]">
                      No matching {config.shortTitle.toLowerCase()} calculators found
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Try clearing your search query or switching the filter back to
                      &ldquo;All&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedFilter('All');
                      }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2457D6] text-white text-xs sm:text-sm font-semibold hover:bg-[#1d47b0] transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick-Reference Formula & Conversion Cheat Sheet Table */}
            <section
              id="cheat-sheet"
              aria-labelledby={`${config.id}-cheat-sheet-heading`}
              className="scroll-mt-28 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      id={`${config.id}-cheat-sheet-heading`}
                      className="text-lg font-extrabold text-[#152238]"
                    >
                      {config.shortTitle} Quick-Reference Formulas &amp; Conversion Chart
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Standard equations, conversion factors, and worked reference examples used across our {config.shortTitle.toLowerCase()} tools.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[#152238] font-extrabold">
                      <th scope="col" className="py-3 px-4">
                        Measurement / Calculation
                      </th>
                      <th scope="col" className="py-3 px-4">
                        Standard Formula / Factor
                      </th>
                      <th scope="col" className="py-3 px-4">
                        Worked Benchmark Example
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80">
                    {cheatSheet.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC]/80">
                        <td className="py-3 px-4 font-bold text-[#152238]">
                          {row.metricOrConversion}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-[#2457D6]">
                          {row.formulaOrFactor}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {row.exampleApplication}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Matching Formula Guides Section */}
            {config.matchingGuides && config.matchingGuides.length > 0 && (
              <section
                id="matching-guides"
                aria-labelledby={`${config.id}-guides-heading`}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2
                        id={`${config.id}-guides-heading`}
                        className="text-lg font-extrabold text-[#152238]"
                      >
                        Matching {config.shortTitle} Guides &amp; Worked Examples
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Step-by-step tutorials explaining the math and formulas behind these calculators.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/guides"
                    className="text-xs sm:text-sm font-bold text-[#2457D6] hover:underline shrink-0"
                  >
                    All Guides →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {config.matchingGuides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:bg-white hover:border-[#2457D6] p-4 transition-all flex flex-col justify-between gap-2"
                    >
                      <div>
                        <span className="text-sm font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                          {guide.title}
                        </span>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {guide.description}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2457D6] mt-1">
                        <span>Read guide</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar Column */}
          <aside
            aria-label="Popular and related calculators"
            className="lg:col-span-4 space-y-5 lg:sticky lg:top-24"
          >
            {/* Popular in Category */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Flame
                  className="w-5 h-5 text-[#EA580C] fill-[#EA580C]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Popular in {config.shortTitle}
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {popularTools
                  .filter((t) => !t.isComingSoon && Boolean(t.href))
                  .map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={tool.href}
                        className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0 font-extrabold text-xs`}
                          >
                            {tool.symbolText ? (
                              <span>{tool.symbolText}</span>
                            ) : (
                              <RenderCategoryIcon
                                name={tool.iconName}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                            {tool.name}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Related Calculator Categories */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FolderOpen
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Related Calculator Categories
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {config.relatedCategories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}
                        >
                          <RenderCategoryIcon
                            name={cat.iconName}
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need a different calculator? CTA Box */}
            <div className="rounded-2xl bg-[#EAF2FF] border border-[#CFE0FF] p-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                  <Lightbulb className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238]">
                    Need a different calculator?
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Browse all calculators or open the multi-step Calculation Workspace.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/calculators"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1d47b0] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  <span>View All Calculators</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/calculation-workspace"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F8FAFC] text-[#2457D6] border border-[#CFE0FF] text-xs font-bold py-2 px-4 rounded-xl transition-colors"
                >
                  <span>Open Calculation Workspace</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Two-Column Row: Which One Should I Use? Guide (Left) + Visible FAQs (Right) */}
        <section
          id="category-faq"
          aria-label="Calculator selection guide and FAQs"
          className="scroll-mt-28 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div
            id="which-tool-guide"
            className="scroll-mt-28 lg:col-span-6 rounded-2xl bg-[#EBF7F3] border border-[#BDE5D7] p-6"
          >
            <div className="flex items-center gap-2.5">
              <Settings
                className="w-5 h-5 text-[#16856B]"
                aria-hidden="true"
              />
              <h2 className="text-lg font-extrabold text-[#152238]">
                {config.chooseGuideHeading}
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-y-4">
              {config.chooseSteps.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 bg-white/80 dark:bg-slate-900/60 rounded-xl p-3.5 border border-[#BDE5D7]/80"
                >
                  <div className="w-7 h-7 rounded-full bg-[#D2EFE6] border border-[#BDE5D7] text-[#16856B] dark:bg-[#184239] dark:border-[#286658] dark:text-[#6EE7B7] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#152238]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle
                className="w-5 h-5 text-[#2457D6] fill-[#2457D6]/10"
                aria-hidden="true"
              />
              <h2 className="text-lg font-extrabold text-[#152238]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {config.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl bg-white border border-slate-200/90 p-4 shadow-2xs"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-[#152238]">
                    {faq.question}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
