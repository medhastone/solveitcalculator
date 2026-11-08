'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Flame,
  Folder,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Link2,
  HelpCircle,
  Users,
  ArrowLeftRight,
  Plus,
  Trash2,
  Copy,
  Check,
  Printer,
  Download,
  Scale,
  AlertCircle,
  BookOpen,
  RotateCcw,
  FileText,
  Utensils,
  Calculator,
  X,
} from 'lucide-react';
import {
  MEASUREMENT_STANDARDS,
  MeasurementStandardId,
  VERIFIED_INGREDIENTS,
} from '@/lib/recipeIngredientsData';
import {
  RECIPE_UNITS,
  RecipeUnitId,
  calculateServingScale,
  convertRecipeIngredient,
  formatRecipeNumber,
} from '@/lib/recipeConverterEngine';

interface RecipeRowItem {
  rowId: string;
  ingredientQuery: string;
  quantityInput: string;
  fromUnit: RecipeUnitId;
  toUnit: RecipeUnitId;
  customGramsPerCup: string;
  note: string;
}

export type PopularToolId =
  | 'recipe-scaler'
  | 'cups-to-grams'
  | 'grams-to-cups'
  | 'tbsp-to-grams'
  | 'tsp-to-ml'
  | 'cups-to-ml'
  | 'oz-to-grams'
  | 'butter-converter';

interface PopularRecipeToolCard {
  id: PopularToolId;
  title: string;
  description: string;
  tags: string[];
  category: string;
  iconBg: string;
  iconColor: string;
  iconType:
    | 'scaler'
    | 'cup-red'
    | 'weight-green'
    | 'spoon-orange'
    | 'spoon-purple'
    | 'cup-blue'
    | 'weight-oz'
    | 'butter';
  presetConfig: {
    mode: 'batch' | 'single';
    recipeTitle: string;
    originalServings: string;
    desiredServings: string;
    rows: RecipeRowItem[];
  };
}

const DEFAULT_COOKIE_RECIPE: RecipeRowItem[] = [
  {
    rowId: 'row-1',
    ingredientQuery: 'All-Purpose Flour',
    quantityInput: '2 1/4',
    fromUnit: 'cup',
    toUnit: 'g',
    customGramsPerCup: '',
    note: 'Spooned & leveled',
  },
  {
    rowId: 'row-2',
    ingredientQuery: 'Butter (Salted or Unsalted)',
    quantityInput: '1',
    fromUnit: 'cup',
    toUnit: 'g',
    customGramsPerCup: '',
    note: 'Softened (2 sticks)',
  },
  {
    rowId: 'row-3',
    ingredientQuery: 'Granulated White Sugar',
    quantityInput: '3/4',
    fromUnit: 'cup',
    toUnit: 'g',
    customGramsPerCup: '',
    note: '',
  },
  {
    rowId: 'row-4',
    ingredientQuery: 'Brown Sugar (Light or Dark, Packed)',
    quantityInput: '3/4',
    fromUnit: 'cup',
    toUnit: 'g',
    customGramsPerCup: '',
    note: 'Firmly packed',
  },
  {
    rowId: 'row-5',
    ingredientQuery: 'Chocolate Chips (Semi-Sweet)',
    quantityInput: '2',
    fromUnit: 'cup',
    toUnit: 'g',
    customGramsPerCup: '',
    note: '',
  },
];

const POPULAR_RECIPE_TOOLS: PopularRecipeToolCard[] = [
  {
    id: 'recipe-scaler',
    title: 'Recipe Scaler',
    description: 'Increase or decrease ingredient amounts for any serving size.',
    tags: ['Recipe Scaling', 'Cups', 'Grams'],
    category: 'Recipe Scaling',
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    iconType: 'scaler',
    presetConfig: {
      mode: 'batch',
      recipeTitle: 'Classic Chocolate Chip Cookies (Scaled 2×)',
      originalServings: '12',
      desiredServings: '24',
      rows: DEFAULT_COOKIE_RECIPE,
    },
  },
  {
    id: 'cups-to-grams',
    title: 'Cups to Grams Converter',
    description: 'Convert cups to grams for different ingredients.',
    tags: ['Cups', 'Grams', 'Ingredient Conversions', 'Baking Measurements'],
    category: 'Ingredient Conversions',
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
    iconType: 'cup-red',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Cups to Grams Ingredient Conversion',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'ctg-1',
          ingredientQuery: 'All-Purpose Flour',
          quantityInput: '1',
          fromUnit: 'cup',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 US cup = 120 g',
        },
        {
          rowId: 'ctg-2',
          ingredientQuery: 'Granulated White Sugar',
          quantityInput: '1',
          fromUnit: 'cup',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 US cup = 200 g',
        },
        {
          rowId: 'ctg-3',
          ingredientQuery: 'Butter (Salted or Unsalted)',
          quantityInput: '1',
          fromUnit: 'cup',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 US cup = 227 g',
        },
      ],
    },
  },
  {
    id: 'grams-to-cups',
    title: 'Grams to Cups Converter',
    description: 'Convert grams to cups for baking and cooking ingredients.',
    tags: ['Grams', 'Cups', 'Ingredient Conversions', 'Baking Measurements'],
    category: 'Ingredient Conversions',
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    iconType: 'weight-green',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Grams to Cups Ingredient Conversion',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'gtc-1',
          ingredientQuery: 'All-Purpose Flour',
          quantityInput: '240',
          fromUnit: 'g',
          toUnit: 'cup',
          customGramsPerCup: '',
          note: '240 g = 2 US cups',
        },
        {
          rowId: 'gtc-2',
          ingredientQuery: 'Granulated White Sugar',
          quantityInput: '200',
          fromUnit: 'g',
          toUnit: 'cup',
          customGramsPerCup: '',
          note: '200 g = 1 US cup',
        },
      ],
    },
  },
  {
    id: 'tbsp-to-grams',
    title: 'Tablespoons to Grams Converter',
    description: 'Convert tablespoons to grams for accurate measurements.',
    tags: ['Tablespoons', 'Grams', 'Baking Measurements', 'Cooking Measurements'],
    category: 'Baking Measurements',
    iconBg: 'bg-[#FFF3E6]',
    iconColor: 'text-[#EA580C]',
    iconType: 'spoon-orange',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Tablespoons to Grams Conversion',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'ttg-1',
          ingredientQuery: 'Butter (Salted or Unsalted)',
          quantityInput: '2',
          fromUnit: 'tbsp',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 tbsp butter ≈ 14.2 g',
        },
        {
          rowId: 'ttg-2',
          ingredientQuery: 'Granulated White Sugar',
          quantityInput: '3',
          fromUnit: 'tbsp',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 tbsp sugar ≈ 12.5 g',
        },
      ],
    },
  },
  {
    id: 'tsp-to-ml',
    title: 'Teaspoons to Milliliters Converter',
    description: 'Convert teaspoons to milliliters quickly and easily.',
    tags: ['Teaspoons', 'Milliliters', 'Volume Conversions', 'Cooking Measurements'],
    category: 'Volume Conversions',
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6D28D9]',
    iconType: 'spoon-purple',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Teaspoons to Milliliters Conversion',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'ttm-1',
          ingredientQuery: 'Water',
          quantityInput: '1',
          fromUnit: 'tsp',
          toUnit: 'ml',
          customGramsPerCup: '',
          note: '1 US tsp = 4.93 mL (1 metric tsp = 5 mL)',
        },
        {
          rowId: 'ttm-2',
          ingredientQuery: 'Vanilla Extract',
          quantityInput: '3',
          fromUnit: 'tsp',
          toUnit: 'ml',
          customGramsPerCup: '',
          note: '3 tsp = 1 tbsp = 14.79 mL',
        },
      ],
    },
  },
  {
    id: 'cups-to-ml',
    title: 'Cups to Milliliters Converter',
    description: 'Convert cups to milliliters for liquid and dry ingredients.',
    tags: ['Cups', 'Milliliters', 'Volume Conversions', 'Cooking Measurements'],
    category: 'Volume Conversions',
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    iconType: 'cup-blue',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Cups to Milliliters Conversion',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'ctm-1',
          ingredientQuery: 'Milk (Whole or 2%)',
          quantityInput: '1',
          fromUnit: 'cup',
          toUnit: 'ml',
          customGramsPerCup: '',
          note: '1 US cup = 236.59 mL (Metric cup = 250 mL)',
        },
        {
          rowId: 'ctm-2',
          ingredientQuery: 'Water',
          quantityInput: '2',
          fromUnit: 'cup',
          toUnit: 'ml',
          customGramsPerCup: '',
          note: '2 US cups = 1 pint = 473.18 mL',
        },
      ],
    },
  },
  {
    id: 'oz-to-grams',
    title: 'Ounces to Grams Converter',
    description: 'Convert ounces to grams for cooking and baking.',
    tags: ['Ounces', 'Grams', 'Weight Conversions'],
    category: 'Weight Conversions',
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    iconType: 'weight-oz',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Ounces to Grams Weight Conversion',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'otg-1',
          ingredientQuery: 'Chocolate Chips (Semi-Sweet)',
          quantityInput: '8',
          fromUnit: 'oz',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 oz = 28.35 g (8 oz = 226.8 g)',
        },
        {
          rowId: 'otg-2',
          ingredientQuery: 'All-Purpose Flour',
          quantityInput: '16',
          fromUnit: 'oz',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '16 oz = 1 lb = 453.59 g',
        },
      ],
    },
  },
  {
    id: 'butter-converter',
    title: 'Butter Measurement Converter',
    description: 'Convert butter measurements (cups, tablespoons, grams, etc.).',
    tags: ['Cups', 'Tablespoons', 'Grams', 'Ounces', 'Baking Measurements'],
    category: 'Baking Measurements',
    iconBg: 'bg-[#FFF6E0]',
    iconColor: 'text-[#D97706]',
    iconType: 'butter',
    presetConfig: {
      mode: 'single',
      recipeTitle: 'Butter Measurement Converter (Sticks, Cups, Tbsp & Grams)',
      originalServings: '1',
      desiredServings: '1',
      rows: [
        {
          rowId: 'but-1',
          ingredientQuery: 'Butter (Salted or Unsalted)',
          quantityInput: '1/2',
          fromUnit: 'cup',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '1 US Stick = 1/2 cup = 8 tbsp = 113.5 g = 4 oz',
        },
        {
          rowId: 'but-2',
          ingredientQuery: 'Butter (Salted or Unsalted)',
          quantityInput: '1',
          fromUnit: 'cup',
          toUnit: 'g',
          customGramsPerCup: '',
          note: '2 US Sticks = 1 cup = 16 tbsp = 227 g = 8 oz',
        },
      ],
    },
  },
];

const QUICK_FILTER_CHIPS = [
  'Cups',
  'Tablespoons',
  'Teaspoons',
  'Grams',
  'Milliliters',
  'Ounces',
  'Recipe Scaling',
] as const;

const BROWSE_CATEGORIES = [
  {
    id: 'Recipe Scaling',
    title: 'Recipe Scaling',
    description: 'Adjust recipes for different servings',
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    toolId: 'recipe-scaler' as PopularToolId,
  },
  {
    id: 'Ingredient Conversions',
    title: 'Ingredient Conversions',
    description: 'Convert between different ingredients',
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
    toolId: 'cups-to-grams' as PopularToolId,
  },
  {
    id: 'Volume Conversions',
    title: 'Volume Conversions',
    description: 'Cups, tablespoons, teaspoons, milliliters and more',
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    toolId: 'cups-to-ml' as PopularToolId,
  },
  {
    id: 'Weight Conversions',
    title: 'Weight Conversions',
    description: 'Grams, ounces, pounds and more',
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    toolId: 'oz-to-grams' as PopularToolId,
  },
  {
    id: 'Baking Measurements',
    title: 'Baking Measurements',
    description: 'Flour, sugar, butter and baking ingredients',
    iconBg: 'bg-[#FFF3E6]',
    iconColor: 'text-[#EA580C]',
    toolId: 'butter-converter' as PopularToolId,
  },
  {
    id: 'Cooking Measurements',
    title: 'Cooking Measurements',
    description: 'Common kitchen measurements',
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
    toolId: 'tsp-to-ml' as PopularToolId,
  },
];

const INGREDIENT_COMPARISON_CARDS = [
  {
    label: '1 cup flour',
    gramsText: '≈ 120 grams',
    imageSrc: '/assets/aistudio/recipe_cup_flour.png',
    ingredientQuery: 'All-Purpose Flour',
  },
  {
    label: '1 cup sugar',
    gramsText: '≈ 200 grams',
    imageSrc: '/assets/aistudio/recipe_cup_sugar.png',
    ingredientQuery: 'Granulated White Sugar',
  },
  {
    label: '1 cup butter',
    gramsText: '≈ 227 grams',
    imageSrc: '/assets/aistudio/recipe_cup_butter.png',
    ingredientQuery: 'Butter (Salted or Unsalted)',
  },
  {
    label: '1 cup milk',
    gramsText: '≈ 240 grams',
    imageSrc: '/assets/aistudio/recipe_cup_milk.png',
    ingredientQuery: 'Milk (Whole or 2%)',
  },
];

const RECIPE_FAQS = [
  {
    question: 'Are these conversions accurate for all ingredients?',
    answer:
      'Yes. Unlike basic volume converters that assume every ingredient weighs the same as water, our recipe converters use verified ingredient-specific bulk densities from USDA FoodData Central and King Arthur Baking charts (for example, 1 US cup of all-purpose flour is 120 g, granulated sugar is 200 g, and butter is 227 g).',
  },
  {
    question: 'Why do different ingredients weigh different amounts?',
    answer:
      'Each ingredient has a different physical density and particle packing structure. Fine, airy powders like sifted flour or cocoa trap air between particles and weigh much less per cup than dense crystalline sugar, solid butter, or viscous liquids like honey (339 g per cup).',
  },
  {
    question: 'Can I use these converters for baking?',
    answer:
      'Absolutely. Baking requires precise ratios of flour, fat, sugar, and liquids. Converting volumetric cups and spoons into grams lets you weigh ingredients on a digital kitchen scale for repeatable bakery-grade results.',
  },
  {
    question: 'What measurement system is used?',
    answer:
      'By default, conversions use US Customary kitchen units (1 US cup = 236.59 mL, 1 tbsp = 14.79 mL, 1 tsp = 4.93 mL). Inside the interactive calculator, you can switch between US Customary (236.59 mL), US Legal/FDA (240 mL), and Commonwealth Metric cups (250 mL).',
  },
  {
    question: 'Can I scale an entire recipe?',
    answer:
      'Yes. Open the Recipe Scaler to enter your original and desired serving counts (or click ½×, 2×, or 3×). Every ingredient line is automatically scaled and converted into your target unit, ready to copy, print, or download as a shopping list.',
  },
  {
    question: 'How much does a gallon of milk weigh?',
    answer:
      '1 US gallon of whole or 2% milk (16 US cups at 244 g per cup) weighs 3,904 grams (3.904 kg) or about 8.61 pounds (137.7 oz), slightly heavier than 1 US gallon of water at 8.34 pounds.',
  },
  {
    question: 'How do you convert conventional oven temperature to an air fryer?',
    answer:
      'Subtract 25 °F (about 15 °C) from the conventional oven recipe temperature and reduce the cook time by roughly 20%. For example, a 400 °F (204 °C) oven recipe converts to 375 °F (190 °C) in an air fryer.',
  },
];

const UNIT_OPTIONS: RecipeUnitId[] = [
  'g',
  'kg',
  'oz',
  'lb',
  'cup',
  'tbsp',
  'tsp',
  'ml',
  'l',
  'fl_oz',
  'pt',
  'qt',
  'gal',
];

function ToolCardIcon({
  type,
  bgClass,
  colorClass,
}: {
  type: PopularRecipeToolCard['iconType'];
  bgClass: string;
  colorClass: string;
}) {
  return (
    <div
      className={`w-11 h-11 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      {type === 'scaler' && <FileText className="w-5 h-5 stroke-[2.2]" />}
      {type === 'cup-red' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h11v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V6Z" />
          <path d="M16 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
        </svg>
      )}
      {type === 'weight-green' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9h12l1.5 10H4.5L6 9Z" />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" />
          <path d="M12 12.5v4M10 14.5h4" />
        </svg>
      )}
      {type === 'spoon-orange' && <Utensils className="w-5 h-5 stroke-[2.2]" />}
      {type === 'spoon-purple' && <Utensils className="w-5 h-5 stroke-[2.2]" />}
      {type === 'cup-blue' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h11v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V6Z" />
          <path d="M16 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
        </svg>
      )}
      {type === 'weight-oz' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9h12l1.5 10H4.5L6 9Z" />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" />
          <text x="8.5" y="16.5" fontSize="6.5" fontWeight="bold" fill="currentColor" stroke="none">oz</text>
        </svg>
      )}
      {type === 'butter' && (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11l8-4 8 4-8 4-8-4Z" />
          <path d="M4 11v5l8 4 8-4v-5" />
          <path d="M12 15v5" />
        </svg>
      )}
    </div>
  );
}

export default function RecipeConverterClient() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterChip, setActiveFilterChip] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeToolId, setActiveToolId] = useState<PopularToolId>('recipe-scaler');
  const [showWorkspace, setShowWorkspace] = useState<boolean>(false);

  // Interactive Calculator Workspace state
  const [recipeTitle, setRecipeTitle] = useState<string>('Classic Chocolate Chip Cookies');
  const [originalServings, setOriginalServings] = useState<string>('12');
  const [desiredServings, setDesiredServings] = useState<string>('24');
  const [standardId, setStandardId] = useState<MeasurementStandardId>('us_customary');
  const [rows, setRows] = useState<RecipeRowItem[]>(DEFAULT_COOKIE_RECIPE);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [referenceSearch, setReferenceSearch] = useState<string>('');

  const workspaceRef = useRef<HTMLElement | null>(null);

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return POPULAR_RECIPE_TOOLS.filter((tool) => {
      const matchesChip =
        !activeFilterChip ||
        tool.tags.some((t) => t.toLowerCase() === activeFilterChip.toLowerCase()) ||
        tool.category.toLowerCase() === activeFilterChip.toLowerCase();

      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q));

      return matchesChip && matchesSearch;
    });
  }, [searchQuery, activeFilterChip]);

  const handleOpenTool = (toolId: PopularToolId) => {
    const found = POPULAR_RECIPE_TOOLS.find((t) => t.id === toolId);
    if (found) {
      setActiveToolId(toolId);
      setRecipeTitle(found.presetConfig.recipeTitle);
      setOriginalServings(found.presetConfig.originalServings);
      setDesiredServings(found.presetConfig.desiredServings);
      setRows(found.presetConfig.rows);
    }
    setShowWorkspace(true);
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleLoadSingleIngredientCup = (ingredientName: string) => {
    setActiveToolId('cups-to-grams');
    setRecipeTitle(`${ingredientName} — Cups to Grams`);
    setOriginalServings('1');
    setDesiredServings('1');
    setRows([
      {
        rowId: `ing-${Date.now()}`,
        ingredientQuery: ingredientName,
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        customGramsPerCup: '',
        note: '1 US Cup to Grams',
      },
    ]);
    setShowWorkspace(true);
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length > 0) {
      handleOpenTool(filteredTools[0].id);
    } else {
      setShowWorkspace(true);
      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  const scaleInfo = useMemo(
    () => calculateServingScale(originalServings, desiredServings),
    [originalServings, desiredServings]
  );

  const effectiveScaleFactor = scaleInfo.isValid ? scaleInfo.scalingFactor : 1;
  const activeStandard = MEASUREMENT_STANDARDS[standardId];

  const evaluatedRows = useMemo(() => {
    return rows.map((row) => {
      const result = convertRecipeIngredient({
        ingredientQuery: row.ingredientQuery,
        quantityInput: row.quantityInput,
        fromUnit: row.fromUnit,
        toUnit: row.toUnit,
        scalingFactor: effectiveScaleFactor,
        standardId,
        customGramsPerCup: row.customGramsPerCup,
      });
      return {
        row,
        result,
      };
    });
  }, [rows, effectiveScaleFactor, standardId]);

  const handleUpdateRow = (rowId: string, patch: Partial<RecipeRowItem>) => {
    setRows((prev) =>
      prev.map((item) => (item.rowId === rowId ? { ...item, ...patch } : item))
    );
  };

  const handleAddRow = () => {
    const nextId = `row-${Date.now()}-${rows.length + 1}`;
    setRows((prev) => [
      ...prev,
      {
        rowId: nextId,
        ingredientQuery: 'All-Purpose Flour',
        quantityInput: '1',
        fromUnit: 'cup',
        toUnit: 'g',
        customGramsPerCup: '',
        note: '',
      },
    ]);
  };

  const handleRemoveRow = (rowId: string) => {
    setRows((prev) => prev.filter((item) => item.rowId !== rowId));
  };

  const handleSetAllTargetUnits = (targetUnit: RecipeUnitId) => {
    setRows((prev) => prev.map((item) => ({ ...item, toUnit: targetUnit })));
  };

  const handleApplyQuickMultiplier = (multiplier: number) => {
    const orig = Number(originalServings);
    const base = Number.isFinite(orig) && orig > 0 ? orig : 4;
    if (!Number.isFinite(orig) || orig <= 0) {
      setOriginalServings('4');
    }
    const nextDesired = Number((base * multiplier).toFixed(2));
    setDesiredServings(String(nextDesired));
  };

  const buildShoppingListText = () => {
    const lines: string[] = [];
    lines.push(`${recipeTitle || 'Converted Recipe'} — Shopping & Prep List`);
    lines.push(
      `Servings: ${originalServings} → ${desiredServings} (Scale Factor: ${formatRecipeNumber(
        effectiveScaleFactor
      )}x)`
    );
    lines.push(`Measurement Standard: ${activeStandard.name} (${activeStandard.shortLabel})`);
    lines.push('------------------------------------------------------------');

    evaluatedRows.forEach(({ row, result }, idx) => {
      const fromShort = RECIPE_UNITS[row.fromUnit].shortLabel;
      const toShort = RECIPE_UNITS[row.toUnit].shortLabel;
      const scaledOrigStr =
        result.scaledFromQuantity !== null
          ? `${formatRecipeNumber(result.scaledFromQuantity)} ${fromShort}`
          : `${row.quantityInput} ${fromShort}`;

      if (result.status === 'ok' && result.convertedQuantity !== null) {
        lines.push(
          `${idx + 1}. ${row.ingredientQuery || 'Ingredient'}: ${formatRecipeNumber(
            result.convertedQuantity
          )} ${toShort} (Scaled from ${row.quantityInput} ${fromShort} → ${scaledOrigStr})${
            row.note ? ` — ${row.note}` : ''
          }`
        );
      } else {
        lines.push(
          `${idx + 1}. ${row.ingredientQuery || 'Ingredient'}: ${scaledOrigStr} [Conversion pending]`
        );
      }
    });

    lines.push('------------------------------------------------------------');
    lines.push('Generated via SolveItCalculator.com/recipe-converter');
    return lines.join('\n');
  };

  const handleCopyShoppingList = async () => {
    try {
      await navigator.clipboard.writeText(buildShoppingListText());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleDownloadShoppingList = () => {
    const text = buildShoppingListText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(recipeTitle || 'recipe-conversion')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-shopping-list.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredReferenceIngredients = useMemo(() => {
    const q = referenceSearch.trim().toLowerCase();
    if (!q) return VERIFIED_INGREDIENTS;
    return VERIFIED_INGREDIENTS.filter(
      (ing) =>
        ing.name.toLowerCase().includes(q) ||
        ing.category.toLowerCase().includes(q) ||
        ing.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }, [referenceSearch]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* HERO SECTION */}
      <section
        aria-labelledby="recipe-converters-heading"
        className="relative overflow-hidden border-b border-[#DCE5F2] bg-gradient-to-r from-[#EAF1FC] via-[#EEF4FC] to-[#F5F7FA]"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 py-6 sm:py-8 lg:py-0 lg:min-h-[290px]">
            {/* Left Column: Breadcrumb, H1, Subtitle, Search Bar, Quick Filter Chips */}
            <div className="lg:col-span-7 lg:py-7 z-10">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-3">
                <ol className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#475569]">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[#94A3B8]">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li aria-current="page" className="text-[#152238] font-semibold">
                    Recipe Converters
                  </li>
                </ol>
              </nav>

              {/* H1 */}
              <h1
                id="recipe-converters-heading"
                className="text-3xl sm:text-[44px] font-extrabold tracking-tight text-[#152238] leading-[1.12]"
              >
                Recipe <span className="text-[#2457D6]">Converters</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-2.5 text-sm sm:text-[16px] text-[#334155] leading-relaxed max-w-xl">
                Convert cooking measurements, scale ingredients, and adjust
                recipes with simple, accurate calculations.
              </p>

              {/* Prominent Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label="Search recipe converters"
                className="mt-5 max-w-xl flex items-center bg-white rounded-full border border-[#DCE3EE] shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label htmlFor="recipe-converters-search" className="sr-only">
                  Search recipe converters
                </label>
                <div className="pl-3.5 pr-2 text-[#64748B] flex items-center pointer-events-none">
                  <Search className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="recipe-converters-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipe converters..."
                  className="w-full py-1.5 px-1 text-sm sm:text-[15px] text-[#152238] placeholder:text-[#64748B] bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="p-1.5 mr-1 rounded-full text-[#64748B] hover:text-[#152238] hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="submit"
                  className="shrink-0 bg-[#0A58ED] hover:bg-[#1d47b0] text-white font-semibold text-sm px-6 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  Search
                </button>
              </form>

              {/* Quick Filter Chips */}
              <div
                role="group"
                aria-label="Filter recipe converters by unit or topic"
                className="mt-3.5 flex flex-wrap items-center gap-2"
              >
                {QUICK_FILTER_CHIPS.map((chip) => {
                  const isActive = activeFilterChip === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() =>
                        setActiveFilterChip(isActive ? null : chip)
                      }
                      aria-pressed={isActive}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                          : 'bg-white/95 hover:bg-white text-[#152238] border-[#DCE3EE] hover:border-[#2457D6]'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
                {activeFilterChip && (
                  <button
                    type="button"
                    onClick={() => setActiveFilterChip(null)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#2457D6] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Show All
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Realistic Kitchen Ingredients & Measuring Cups Photography */}
            <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-[290px] -mx-4 sm:mx-0 lg:-mr-8 overflow-hidden flex items-center justify-end">
              <div
                aria-hidden="true"
                className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#EEF4FC] via-[#EEF4FC]/70 to-transparent z-10 pointer-events-none"
              />
              <img
                src="/assets/aistudio/recipe_hero_ingredients.png"
                alt="Glass measuring cup with milk, flour canister, brown sugar, white sugar, and butter sticks"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center rounded-xl lg:rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* SECTION 1: POPULAR RECIPE TOOLS */}
        <section aria-labelledby="popular-recipe-tools-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <Flame
                className="w-6 h-6 text-[#EA580C] fill-[#EA580C]"
                aria-hidden="true"
              />
              <h2
                id="popular-recipe-tools-heading"
                className="text-xl sm:text-[22px] font-extrabold text-[#152238] tracking-tight"
              >
                Popular Recipe Tools
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569]">
              Explore our most used recipe converters.
            </p>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTools.map((tool) => {
                const isSelected = showWorkspace && activeToolId === tool.id;
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleOpenTool(tool.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenTool(tool.id);
                      }
                    }}
                    className={`group rounded-2xl bg-white border p-5 flex flex-col justify-between transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                      isSelected
                        ? 'border-[#2457D6] ring-2 ring-[#2457D6]/15 shadow-sm'
                        : 'border-[#E2E8F0] hover:border-[#2457D6] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <ToolCardIcon
                        type={tool.iconType}
                        bgClass={tool.iconBg}
                        colorClass={tool.iconColor}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors leading-snug">
                          {tool.title}
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pl-[58px]">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#2457D6] group-hover:text-[#1d47b0] whitespace-nowrap">
                        <span>Open Calculator</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-8 text-center">
              <p className="text-base font-bold text-[#152238]">
                No recipe tools match &ldquo;{searchQuery || activeFilterChip}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                Reset your search filter or open the full interactive recipe converter below.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilterChip(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#2457D6] text-white text-xs font-semibold hover:bg-[#1d47b0] transition-colors cursor-pointer"
                >
                  Show All 8 Recipe Tools
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenTool('recipe-scaler')}
                  className="px-4 py-2 rounded-lg border border-[#DCE3EE] bg-white text-[#152238] text-xs font-semibold hover:border-[#2457D6] transition-colors cursor-pointer"
                >
                  Open Interactive Recipe Converter
                </button>
              </div>
            </div>
          )}
        </section>

        {/* INTERACTIVE CALCULATOR WORKSPACE (Opens when any tool card is clicked, or via toggle button) */}
        <section
          ref={workspaceRef}
          aria-label="Interactive Recipe and Ingredient Calculator"
          className="scroll-mt-20"
        >
          {!showWorkspace ? (
            <div className="rounded-2xl bg-white border border-[#DCE3EE] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#152238]">
                    Interactive Multi-Ingredient Recipe Scaler &amp; Cups-to-Grams Calculator
                  </h2>
                  <p className="text-xs text-[#475569]">
                    Click any tool card above or launch the live calculator workspace to convert ingredients, scale servings, or check milk &amp; oven-to-air-fryer tables.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWorkspace(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457D6] hover:bg-[#1d47b0] text-white text-xs sm:text-sm font-bold px-5 py-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Open Live Calculator</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border-2 border-[#2457D6] p-5 sm:p-6 shadow-sm space-y-6">
              {/* Workspace Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-xs font-bold text-[#2457D6]">
                    Active Calculator Tool
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#152238]">
                    {POPULAR_RECIPE_TOOLS.find((t) => t.id === activeToolId)?.title ||
                      'Recipe Scaler & Ingredient Converter'}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenTool('recipe-scaler')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE3EE] bg-[#F8FAFC] hover:bg-[#EEF4FF] px-3 py-1.5 text-xs font-semibold text-[#152238] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Reset to Cookie Recipe
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWorkspace(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE3EE] bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#475569] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                    Minimize Calculator
                  </button>
                </div>
              </div>

              {/* Tool Switcher Tabs inside Workspace */}
              <div className="flex flex-wrap items-center gap-1.5">
                {POPULAR_RECIPE_TOOLS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleOpenTool(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      activeToolId === t.id
                        ? 'bg-[#2457D6] text-white'
                        : 'bg-[#F5F7FA] text-[#334155] hover:bg-[#EBF2FF] hover:text-[#2457D6]'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>

              {/* Scaling & Measurement Standard Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-bold text-[#152238] flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                      1. Recipe Yield &amp; Serving Scaling
                    </h3>
                    <span className="text-xs font-mono tabular-nums font-bold text-[#16856B]">
                      Scale Factor: {formatRecipeNumber(effectiveScaleFactor)}×
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label
                        htmlFor="recipe-title-input"
                        className="block text-xs font-semibold text-[#334155] mb-1"
                      >
                        Recipe / Batch Name
                      </label>
                      <input
                        id="recipe-title-input"
                        type="text"
                        value={recipeTitle}
                        onChange={(e) => setRecipeTitle(e.target.value)}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-sm text-[#152238] focus:border-[#2457D6] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="orig-servings-input"
                        className="block text-xs font-semibold text-[#334155] mb-1"
                      >
                        Original Servings
                      </label>
                      <input
                        id="orig-servings-input"
                        type="number"
                        min="0.1"
                        step="any"
                        value={originalServings}
                        onChange={(e) => setOriginalServings(e.target.value)}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-sm font-mono tabular-nums text-[#152238] focus:border-[#2457D6] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="desired-servings-input"
                        className="block text-xs font-semibold text-[#334155] mb-1"
                      >
                        Desired Servings
                      </label>
                      <input
                        id="desired-servings-input"
                        type="number"
                        min="0.1"
                        step="any"
                        value={desiredServings}
                        onChange={(e) => setDesiredServings(e.target.value)}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-sm font-mono tabular-nums text-[#152238] focus:border-[#2457D6] focus:outline-none"
                      />
                    </div>
                  </div>
                  {!scaleInfo.isValid && scaleInfo.error && (
                    <div
                      role="alert"
                      className="mt-2.5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{scaleInfo.error}</span>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-[#64748B] mr-1">Quick scale:</span>
                    {[
                      { label: '½× Half', mult: 0.5 },
                      { label: '1× Original', mult: 1 },
                      { label: '2× Double', mult: 2 },
                      { label: '3× Triple', mult: 3 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleApplyQuickMultiplier(btn.mult)}
                        className="rounded-md border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs font-semibold text-[#152238] hover:border-[#2457D6] hover:text-[#2457D6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#152238] mb-1.5">
                      2. Cup &amp; Spoon Measurement Standard
                    </h3>
                    <p className="text-xs text-[#475569] mb-2.5">
                      Select the regional cup volume used by your recipe:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(MEASUREMENT_STANDARDS) as MeasurementStandardId[]).map(
                        (key) => {
                          const std = MEASUREMENT_STANDARDS[key];
                          const isActive = standardId === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setStandardId(key)}
                              className={`rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                                isActive
                                  ? 'border-[#2457D6] bg-[#EBF2FF] text-[#2457D6]'
                                  : 'border-[#CBD5E1] bg-white text-[#152238] hover:border-[#2457D6]'
                              }`}
                            >
                              <div className="text-xs font-bold truncate">
                                {std.shortLabel}
                              </div>
                              <div className="text-[11px] text-[#475569] font-mono tabular-nums">
                                1 tbsp = {Number(std.tbspMl.toFixed(1))} mL
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-[#475569]">
                    Active: {activeStandard.description}
                  </p>
                </div>
              </div>

              {/* Datalist for ingredient autocomplete */}
              <datalist id="verified-recipe-ingredients-list">
                {VERIFIED_INGREDIENTS.map((ing) => (
                  <option
                    key={ing.id}
                    value={ing.name}
                    label={`${ing.category} — 1 US cup = ${ing.gramsPerUsCup} g`}
                  />
                ))}
              </datalist>

              {/* Ingredient Rows */}
              <div className="rounded-xl border border-[#E2E8F0] overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0]">
                  <span className="text-sm font-bold text-[#152238]">
                    3. Ingredients ({rows.length})
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetAllTargetUnits('g')}
                      className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs font-semibold text-[#152238] hover:border-[#2457D6] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      All to Grams (g)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAllTargetUnits('cup')}
                      className="rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1 text-xs font-semibold text-[#152238] hover:border-[#2457D6] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      All to Cups
                    </button>
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2457D6] px-3 py-1 text-xs font-bold text-white hover:bg-[#1d47b0] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      Add Ingredient
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {evaluatedRows.map(({ row, result }, index) => {
                    const fromSpec = RECIPE_UNITS[row.fromUnit];
                    const toSpec = RECIPE_UNITS[row.toUnit];
                    return (
                      <div key={row.rowId} className="p-3.5 sm:px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                          <div className="lg:col-span-4">
                            <label
                              htmlFor={`ing-name-${row.rowId}`}
                              className="block text-[11px] font-semibold text-[#475569] mb-1"
                            >
                              Ingredient #{index + 1}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-1.5">
                              <select
                                aria-label={`Select ingredient ${index + 1}`}
                                value={
                                  result.verifiedIngredient
                                    ? result.verifiedIngredient.name
                                    : '__custom__'
                                }
                                onChange={(e) => {
                                  handleUpdateRow(row.rowId, {
                                    ingredientQuery:
                                      e.target.value === '__custom__'
                                        ? 'Custom Ingredient'
                                        : e.target.value,
                                  });
                                }}
                                className="sm:w-44 shrink-0 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1.5 text-xs text-[#152238]"
                              >
                                {VERIFIED_INGREDIENTS.map((ing) => (
                                  <option key={ing.id} value={ing.name}>
                                    {ing.name} ({ing.gramsPerUsCup}g/cup)
                                  </option>
                                ))}
                                <option value="__custom__">Custom Ingredient...</option>
                              </select>
                              <input
                                id={`ing-name-${row.rowId}`}
                                type="text"
                                list="verified-recipe-ingredients-list"
                                value={row.ingredientQuery}
                                onChange={(e) =>
                                  handleUpdateRow(row.rowId, {
                                    ingredientQuery: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-xs sm:text-sm text-[#152238]"
                              />
                            </div>
                          </div>

                          <div className="lg:col-span-3">
                            <label
                              htmlFor={`ing-qty-${row.rowId}`}
                              className="block text-[11px] font-semibold text-[#475569] mb-1"
                            >
                              Quantity &amp; From Unit
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                id={`ing-qty-${row.rowId}`}
                                type="text"
                                inputMode="decimal"
                                value={row.quantityInput}
                                onChange={(e) =>
                                  handleUpdateRow(row.rowId, {
                                    quantityInput: e.target.value,
                                  })
                                }
                                className="w-24 rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-sm font-mono tabular-nums text-[#152238]"
                              />
                              <select
                                aria-label={`From unit ${index + 1}`}
                                value={row.fromUnit}
                                onChange={(e) =>
                                  handleUpdateRow(row.rowId, {
                                    fromUnit: e.target.value as RecipeUnitId,
                                  })
                                }
                                className="w-full rounded-lg border border-[#CBD5E1] bg-white px-2 py-1.5 text-xs text-[#152238]"
                              >
                                {UNIT_OPTIONS.map((u) => (
                                  <option key={u} value={u}>
                                    {RECIPE_UNITS[u].label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="lg:col-span-2">
                            <label
                              htmlFor={`ing-to-${row.rowId}`}
                              className="block text-[11px] font-semibold text-[#475569] mb-1"
                            >
                              Convert To
                            </label>
                            <select
                              id={`ing-to-${row.rowId}`}
                              value={row.toUnit}
                              onChange={(e) =>
                                handleUpdateRow(row.rowId, {
                                  toUnit: e.target.value as RecipeUnitId,
                                })
                              }
                              className="w-full rounded-lg border border-[#CBD5E1] bg-white px-2 py-1.5 text-xs text-[#152238]"
                            >
                              {UNIT_OPTIONS.map((u) => (
                                <option key={u} value={u}>
                                  {RECIPE_UNITS[u].label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="lg:col-span-2">
                            <span className="block text-[11px] font-semibold text-[#475569] mb-1">
                              Converted Result
                            </span>
                            {result.status === 'ok' &&
                            result.convertedQuantity !== null ? (
                              <div className="rounded-lg bg-[#E6F6F1] border border-[#BDE5D7] px-3 py-1.5">
                                <div className="text-sm font-extrabold font-mono tabular-nums text-[#16856B]">
                                  {formatRecipeNumber(result.convertedQuantity)}{' '}
                                  {toSpec.shortLabel}
                                </div>
                                <div className="text-[11px] font-mono tabular-nums text-[#475569]">
                                  Scaled: {formatRecipeNumber(result.scaledFromQuantity)}{' '}
                                  {fromSpec.shortLabel}
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800">
                                {result.status === 'invalid_input'
                                  ? 'Invalid Qty'
                                  : 'Enter density'}
                              </div>
                            )}
                          </div>

                          <div className="lg:col-span-1 flex justify-end pt-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.rowId)}
                              disabled={rows.length <= 1}
                              aria-label={`Remove row ${index + 1}`}
                              className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-red-600 hover:bg-red-50 disabled:opacity-40 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1.5 text-[11px] text-[#64748B]">
                          {result.statusMessage}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Export Bar */}
                <div className="bg-[#F8FAFC] px-4 py-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#475569]">
                    Ready to save or print your converted recipe:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyShoppingList}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#152238] hover:border-[#2457D6] cursor-pointer"
                    >
                      {copiedSummary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#16856B]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy List
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadShoppingList}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#152238] hover:border-[#2457D6] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download (.txt)
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#152238] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                  </div>
                </div>
              </div>

              {/* Searchable Verified Ingredient Density Table + Milk & Oven-to-Air-Fryer Reference */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
                <div className="lg:col-span-7 rounded-xl border border-[#E2E8F0] p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="text-sm font-bold text-[#152238] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#2457D6]" />
                      Verified Ingredient Weight Chart (1 US Cup)
                    </h3>
                    <input
                      type="search"
                      value={referenceSearch}
                      onChange={(e) => setReferenceSearch(e.target.value)}
                      placeholder="Filter ingredients..."
                      aria-label="Filter verified ingredient reference table"
                      className="w-full sm:w-48 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-2.5 py-1 text-xs text-[#152238]"
                    />
                  </div>
                  <div className="overflow-x-auto max-h-56 overflow-y-auto border border-[#E2E8F0] rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
                        <tr>
                          <th className="py-2 px-2.5 font-semibold">Ingredient</th>
                          <th className="py-2 px-2.5 font-semibold text-right">1 US Cup</th>
                          <th className="py-2 px-2.5 font-semibold text-right">1 Metric Cup</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {filteredReferenceIngredients.map((ing) => (
                          <tr key={ing.id} className="hover:bg-[#F8FAFC]">
                            <td className="py-1.5 px-2.5 font-medium text-[#152238]">
                              {ing.name}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono tabular-nums font-bold text-[#2457D6]">
                              {formatRecipeNumber(ing.gramsPerUsCup)} g
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono tabular-nums text-[#475569]">
                              {formatRecipeNumber(ing.gramsPerMl * 250)} g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2457D6] mb-1">
                      Milk Weight Reference (How Much Does a Gallon of Milk Weigh?)
                    </h3>
                    <p className="text-xs text-[#334155] leading-relaxed">
                      Per USDA FoodData Central (<code className="font-mono">244 g / US cup</code>),{' '}
                      <strong>1 US gallon of milk weighs 8.61 lbs (3,904 g / 3.904 kg)</strong>,{' '}
                      1 half-gallon weighs <strong>4.30 lbs (1,952 g)</strong>, and 1 quart weighs{' '}
                      <strong>2.15 lbs (976 g)</strong>.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2457D6] mb-1">
                      Oven to Air Fryer Conversion Rule
                    </h3>
                    <p className="text-xs text-[#334155] leading-relaxed">
                      Subtract <strong>25 °F (15 °C)</strong> from conventional oven temperature and reduce cook time by <strong>20%</strong>:{' '}
                      <span className="font-mono">350 °F → 325 °F</span>,{' '}
                      <span className="font-mono">375 °F → 350 °F</span>,{' '}
                      <span className="font-mono">400 °F → 375 °F</span>. USDA safe ham internal temperature: <strong>140 °F (60 °C)</strong> reheated or <strong>145 °F (62.8 °C)</strong> fresh.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: BROWSE BY CATEGORY */}
        <section aria-labelledby="browse-by-category-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <Folder
                className="w-6 h-6 text-[#2457D6] fill-[#2457D6]"
                aria-hidden="true"
              />
              <h2
                id="browse-by-category-heading"
                className="text-xl sm:text-[22px] font-extrabold text-[#152238] tracking-tight"
              >
                Browse by Category
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569]">
              Find the right recipe converter for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {BROWSE_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveFilterChip(cat.id);
                  handleOpenTool(cat.toolId);
                }}
                className="group text-left rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#2457D6] hover:shadow-xs p-4 flex flex-col justify-between transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <div className="flex items-center justify-between w-full mb-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}
                    aria-hidden="true"
                  >
                    {idx === 0 && <Calculator className="w-5 h-5 stroke-[2.2]" />}
                    {idx === 1 && <Scale className="w-5 h-5 stroke-[2.2]" />}
                    {idx === 2 && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 6h11v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V6Z" />
                        <path d="M16 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
                      </svg>
                    )}
                    {idx === 3 && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9h12l1.5 10H4.5L6 9Z" />
                        <path d="M9 9V7a3 3 0 0 1 6 0v2" />
                      </svg>
                    )}
                    {idx === 4 && <Utensils className="w-5 h-5 stroke-[2.2]" />}
                    {idx === 5 && (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5Z" />
                        <path d="M9 7h6M12 4v3" />
                      </svg>
                    )}
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-[#64748B] group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: FEATURED SECTION — "Make Recipe Measurements Easier" */}
        <section
          aria-labelledby="make-measurements-easier-heading"
          className="relative"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <h2
                id="make-measurements-easier-heading"
                className="text-2xl sm:text-[30px] font-extrabold text-[#152238] tracking-tight"
              >
                Make Recipe Measurements{' '}
                <span className="text-[#2457D6]">Easier</span>
              </h2>
              <p className="mt-1 text-sm sm:text-[15px] text-[#475569]">
                Simple tools to help you cook, bake, and adjust recipes with
                confidence.
              </p>
            </div>

            {/* Subtle Decorative Whisk & Mixing Bowl Line Graphic */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center justify-end select-none pointer-events-none"
            >
              <svg
                className="w-36 h-16 text-[#93B4E8]"
                viewBox="0 0 160 72"
                fill="none"
              >
                <ellipse
                  cx="80"
                  cy="44"
                  rx="48"
                  ry="24"
                  fill="#DCE8FF"
                  fillOpacity="0.65"
                />
                <path
                  d="M42 42h76c0 14-17 24-38 24S42 56 42 42Z"
                  stroke="#6491D9"
                  strokeWidth="2"
                  fill="#EAF2FF"
                />
                <ellipse
                  cx="80"
                  cy="42"
                  rx="38"
                  ry="7"
                  stroke="#6491D9"
                  strokeWidth="2"
                  fill="#FFFFFF"
                />
                <path
                  d="M92 38L122 8M98 40L128 10"
                  stroke="#6491D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Benefit 1 */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238] leading-snug">
                  Adjust recipes for different serving sizes.
                </h3>
                <p className="mt-1.5 text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                  Easily scale ingredient amounts up or down without manual
                  calculations.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h16a8 8 0 0 1-16 0Z" />
                  <path d="M8 8v1M12 6v2M16 8v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238] leading-snug">
                  Convert ingredients using ingredient-specific measurements.
                </h3>
                <p className="mt-1.5 text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                  Get accurate conversions for flour, sugar, butter, and more.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5 flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full bg-[#FFF3E6] text-[#EA580C] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <ArrowLeftRight className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238] leading-snug">
                  Switch between common metric and US customary units.
                </h3>
                <p className="mt-1.5 text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                  Convert between cups, grams, ounces, milliliters and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: EDUCATIONAL CONTENT + RELATED LINKS + FAQ */}
        <section
          aria-label="Ingredient weight comparison, related links, and FAQs"
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
        >
          {/* Left Card (6 cols): Why ingredient-specific conversions matter */}
          <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-[19px] font-extrabold text-[#152238]">
                Why ingredient-specific conversions matter
              </h2>
              <p className="mt-2 text-xs sm:text-[13.5px] text-[#475569] leading-relaxed">
                Not all ingredients have the same weight, even if they use the
                same cup measurement. A cup of flour is much lighter than a cup
                of sugar or butter. Using ingredient-specific conversions gives
                you more accurate results and better tasting recipes.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INGREDIENT_COMPARISON_CARDS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    handleLoadSingleIngredientCup(item.ingredientQuery)
                  }
                  className="group text-center rounded-xl p-1.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F5F7FA] mb-2">
                    <img
                      src={item.imageSrc}
                      alt={`${item.label} (${item.gramsText})`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-xs font-extrabold text-[#152238] group-hover:text-[#2457D6]">
                    {item.label}
                  </div>
                  <div className="text-xs font-mono tabular-nums text-[#475569]">
                    {item.gramsText}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Card (3 cols): Related Links */}
          <div className="lg:col-span-3 rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Link2
                className="w-5 h-5 text-[#2457D6]"
                aria-hidden="true"
              />
              <h2 className="text-base sm:text-[18px] font-extrabold text-[#152238]">
                Related Links
              </h2>
            </div>

            <ul className="divide-y divide-[#E2E8F0] flex-1 flex flex-col justify-between text-xs sm:text-[13.5px]">
              <li className="py-2.5 first:pt-1">
                <Link
                  href="/conversions/cooking"
                  className="group flex items-center justify-between gap-2 font-semibold text-[#2457D6] hover:text-[#1d47b0] transition-colors"
                >
                  <span>Cooking Measurement Guide</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li className="py-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenTool('cups-to-grams')}
                  className="w-full group flex items-center justify-between gap-2 font-semibold text-[#2457D6] hover:text-[#1d47b0] transition-colors text-left cursor-pointer"
                >
                  <span>Baking Ingredient Substitutions</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </button>
              </li>
              <li className="py-2.5">
                <Link
                  href="/conversions/volume"
                  className="group flex items-center justify-between gap-2 font-semibold text-[#2457D6] hover:text-[#1d47b0] transition-colors"
                >
                  <span>US to Metric Conversion Guide</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li className="py-2.5">
                <Link
                  href="/conversions/cooking#common-values"
                  className="group flex items-center justify-between gap-2 font-semibold text-[#2457D6] hover:text-[#1d47b0] transition-colors"
                >
                  <span>Common Kitchen Measurements</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li className="py-2.5 last:pb-0">
                <button
                  type="button"
                  onClick={() => handleOpenTool('recipe-scaler')}
                  className="w-full group flex items-center justify-between gap-2 font-semibold text-[#2457D6] hover:text-[#1d47b0] transition-colors text-left cursor-pointer"
                >
                  <span>How to Scale a Recipe</span>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </button>
              </li>
            </ul>
          </div>

          {/* Right Card (3 cols): FAQ */}
          <div className="lg:col-span-3 rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle
                className="w-5 h-5 text-[#2457D6] fill-[#2457D6]/10"
                aria-hidden="true"
              />
              <h2 className="text-base sm:text-[18px] font-extrabold text-[#152238]">
                FAQ
              </h2>
            </div>

            <div className="space-y-2 flex-1">
              {RECIPE_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-left text-xs font-bold text-[#152238] hover:text-[#2457D6] transition-colors cursor-pointer"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#2457D6] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3 pt-1 text-xs text-[#475569] leading-relaxed border-t border-[#E2E8F0] bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
