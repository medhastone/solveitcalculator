'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ConversionVisualAnalyzer from '@/components/ConversionVisualAnalyzer';
import { getCurrentTheme, toggleTheme as globalToggleTheme } from '@/lib/theme';
import {
  CONVERSION_CATEGORIES,
  convertValue,
  formatResult,
  CategoryDefinition,
  UnitDefinition
} from '@/lib/conversions';

export const getCategoryHref = (categoryId: string) => {
  if (categoryId === 'volume') return '/volume-converter';
  return `/${categoryId.replace(/_/g, '-')}-converter`;
};

interface RecentConversion {
  id: string;
  categoryId: string;
  categoryName: string;
  fromUnitId: string;
  fromUnitName: string;
  fromUnitSymbol: string;
  toUnitId: string;
  toUnitName: string;
  toUnitSymbol: string;
  inputValue: number | string;
  resultValue: string;
  timestamp: number;
}

interface FavoritePair {
  id: string;
  categoryId: string;
  fromUnitId: string;
  toUnitId: string;
  label: string;
  categoryName: string;
}

const POPULAR_CONVERSIONS_DATA = [
  { categoryId: 'length', fromUnitId: 'cm', toUnitId: 'in', fromSymbol: 'cm', toSymbol: 'in', label: 'cm → inches', name: 'Centimeters to Inches', searches: '3.2M', trend: '+14%', ratio: '1 cm = 0.3937 in' },
  { categoryId: 'length', fromUnitId: 'in', toUnitId: 'cm', fromSymbol: 'in', toSymbol: 'cm', label: 'inches → cm', name: 'Inches to Centimeters', searches: '2.9M', trend: '+9%', ratio: '1 in = 2.54 cm' },
  { categoryId: 'weight', fromUnitId: 'kg', toUnitId: 'lb', fromSymbol: 'kg', toSymbol: 'lb', label: 'kg → lbs', name: 'Kilograms to Pounds', searches: '2.4M', trend: '+18%', ratio: '1 kg = 2.2046 lb' },
  { categoryId: 'weight', fromUnitId: 'lb', toUnitId: 'kg', fromSymbol: 'lb', toSymbol: 'kg', label: 'lbs → kg', name: 'Pounds to Kilograms', searches: '2.1M', trend: '+7%', ratio: '1 lb = 0.4536 kg' },
  { categoryId: 'speed', fromUnitId: 'mph', toUnitId: 'kmh', fromSymbol: 'mph', toSymbol: 'km/h', label: 'mph → km/h', name: 'Miles/hr to Kilometers/hr', searches: '1.8M', trend: '+12%', ratio: '1 mph = 1.6093 km/h' },
  { categoryId: 'speed', fromUnitId: 'kmh', toUnitId: 'mph', fromSymbol: 'km/h', toSymbol: 'mph', label: 'km/h → mph', name: 'Kilometers/hr to Miles/hr', searches: '1.6M', trend: '+11%', ratio: '1 km/h = 0.6214 mph' },
  { categoryId: 'temperature', fromUnitId: 'c', toUnitId: 'f', fromSymbol: '°C', toSymbol: '°F', label: '°C → °F', name: 'Celsius to Fahrenheit', searches: '2.8M', trend: '+22%', ratio: '0 °C = 32 °F' },
  { categoryId: 'temperature', fromUnitId: 'f', toUnitId: 'c', fromSymbol: '°F', toSymbol: '°C', label: '°F → °C', name: 'Fahrenheit to Celsius', searches: '2.5M', trend: '+15%', ratio: '32 °F = 0 °C' },
  { categoryId: 'volume', fromUnitId: 'l', toUnitId: 'gal', fromSymbol: 'L', toSymbol: 'gal (US)', label: 'liters → gallons', name: 'Liters to Gallons (US)', searches: '1.4M', trend: '+8%', ratio: '1 L = 0.2642 gal' },
  { categoryId: 'length', fromUnitId: 'm', toUnitId: 'ft', fromSymbol: 'm', toSymbol: 'ft', label: 'meters → feet', name: 'Meters to Feet', searches: '1.9M', trend: '+16%', ratio: '1 m = 3.2808 ft' },
];

const TRENDING_TODAY_DATA = [
  { categoryId: 'energy', from: 'kwh', to: 'j', label: 'kWh → Joules', topic: 'Clean Energy & EV Battery Storage', change: '+28%', momentum: 'High' },
  { categoryId: 'pressure', from: 'psi', to: 'bar', label: 'PSI → Bar', topic: 'Automotive Tire Diagnostics & Turbo Boost', change: '+21%', momentum: 'High' },
  { categoryId: 'data_transfer', from: 'mbps', to: 'mbs', label: 'Mbps → MB/s', topic: 'Fiber Internet & File Download Velocity', change: '+19%', momentum: 'Steady' },
  { categoryId: 'power', from: 'hp', to: 'kw', label: 'Horsepower → kW', topic: 'Electric Powertrains & Motor Output', change: '+17%', momentum: 'High' },
  { categoryId: 'torque', from: 'lbft', to: 'nm', label: 'lb·ft → N·m', topic: 'Chassis Tuning & Lug Nut Specs', change: '+14%', momentum: 'Steady' },
  { categoryId: 'area', from: 'sqft', to: 'sqm', label: 'Square Feet → m²', topic: 'Real Estate & Architectural Floor Plans', change: '+12%', momentum: 'Steady' },
];

const FAQS = [
  {
    q: 'How does SolveIt Calculator ensure conversion accuracy?',
    a: 'Every calculation uses international standards (BIPM SI Broshure, NIST SP 811, and ISO 80000). Conversion factors between base units (such as 1 inch = 0.0254 meters exact) are defined with mathematical exactness rather than rounded approximations, eliminating compounding errors.'
  },
  {
    q: 'Why are US gallons different from British Imperial gallons?',
    a: 'The US gallon is historically based on the 18th-century English Queen Anne wine gallon (231 cubic inches, approximately 3.7854 liters). In 1824, the British Weights and Measures Act established the Imperial gallon as the volume of 10 pounds of distilled water at 62°F (approximately 277.42 cubic inches or 4.546 liters). An Imperial gallon is roughly 20% larger than a US gallon.'
  },
  {
    q: 'How does temperature conversion work between Celsius and Fahrenheit?',
    a: 'Unlike proportional scales like length or mass, temperature scales feature different zero points (freezing point of water is 0°C but 32°F) and step sizes (100°C degrees between freezing and boiling vs 180°F degrees). Therefore, to convert Celsius to Fahrenheit we multiply by 9/5 (1.8) and add 32: F = (C × 9/5) + 32.'
  },
  {
    q: 'What is the difference between binary (KiB, MiB, GiB) and decimal (KB, MB, GB) data storage?',
    a: 'Decimal data units (defined by SI) use powers of 10: 1 Kilobyte (KB) = 1,000 Bytes, and 1 Megabyte (MB) = 1,000,000 Bytes. Binary data units (IEC standard) use powers of 2: 1 Kibibyte (KiB) = 1,024 Bytes, and 1 Gibibyte (GiB) = 1,073,741,824 Bytes. Operating systems like Windows often report GiB but label it as GB, which is why a 1TB drive appears as ~931 GB in File Explorer.'
  },
  {
    q: 'How many decimal places of precision can I choose?',
    a: 'SolveIt Calculator allows you to choose from Auto (intelligently formatted up to 6 significant figures), 2, 4, 6, 8 decimals, or Scientific Notation. In all modes, internal arithmetic retains double-precision 64-bit IEEE floating-point fidelity.'
  },
  {
    q: 'Can I bookmark my favorite conversion pairs?',
    a: 'Yes! Click the Bookmark/Favorite star icon on any conversion or card. Your favorites are stored directly in your browser’s local storage and sync instantly across visits without requiring an account.'
  },
  {
    q: 'What is the physical difference between Mass and Weight?',
    a: 'Mass (measured in kilograms or pounds-mass) is the amount of matter in an object and remains identical everywhere in the universe. Weight (measured in Newtons or pounds-force) is the gravitational force exerted on that mass. On Earth at standard gravity, 1 kg experiences 9.80665 N of force.'
  },
  {
    q: 'Does SolveIt Calculator work offline?',
    a: 'Yes. All unit conversions, radix number translations, and formula lookups run client-side in your browser. Once loaded, you can perform hundreds of instant conversions without an active internet connection.'
  }
];

export default function ConversionCenterPage() {
  const router = useRouter();
  // Theme state: dark mode vs light mode (synchronized with global root theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setIsDarkMode(getCurrentTheme() === 'dark');
    }, 0);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDarkMode(customEvent.detail === 'dark');
      } else {
        setIsDarkMode(getCurrentTheme() === 'dark');
      }
    };

    window.addEventListener('solveit-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = globalToggleTheme();
    setIsDarkMode(next === 'dark');
  };

  // Universal Search
  const [universalQuery, setUniversalQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Widget State
  const [selectedCategory, setSelectedCategory] = useState<string>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('cm');
  const [toUnitId, setToUnitId] = useState<string>('in');
  const [precision, setPrecision] = useState<'auto' | '2' | '4' | '6' | '8' | 'scientific'>('auto');
  const [isSwapping, setIsSwapping] = useState(false);

  // Helper to switch category and align units atomically
  const handleSelectCategory = (catId: string, preferredFrom?: string, preferredTo?: string) => {
    setSelectedCategory(catId);
    const targetCat = CONVERSION_CATEGORIES.find((c) => c.id === catId) || CONVERSION_CATEGORIES[0];
    const nextFrom = preferredFrom && targetCat.units.some((u) => u.id === preferredFrom)
      ? preferredFrom
      : targetCat.units[0]?.id || '';
    const nextTo = preferredTo && targetCat.units.some((u) => u.id === preferredTo)
      ? preferredTo
      : targetCat.units[1]?.id || targetCat.units[0]?.id || '';
    setFromUnitId(nextFrom);
    setToUnitId(nextTo);
  };

  // Feedback toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Local Storage: Recently used & Favorites
  const [recentlyUsed, setRecentlyUsed] = useState<RecentConversion[]>([]);
  const [favorites, setFavorites] = useState<FavoritePair[]>([
    { id: 'fav-1', categoryId: 'length', fromUnitId: 'cm', toUnitId: 'in', label: 'Centimeters → Inches', categoryName: 'Length' },
    { id: 'fav-2', categoryId: 'weight', fromUnitId: 'kg', toUnitId: 'lb', label: 'Kilograms → Pounds', categoryName: 'Weight & Mass' },
    { id: 'fav-3', categoryId: 'temperature', fromUnitId: 'c', toUnitId: 'f', label: 'Celsius → Fahrenheit', categoryName: 'Temperature' },
    { id: 'fav-4', categoryId: 'speed', fromUnitId: 'mph', toUnitId: 'kmh', label: 'MPH → KM/H', categoryName: 'Speed' }
  ]);

  // Load from local storage asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedRecents = localStorage.getItem('solveit_conversion_recents');
        if (storedRecents) {
          setRecentlyUsed(JSON.parse(storedRecents));
        }
        const storedFavs = localStorage.getItem('solveit_conversion_favs');
        if (storedFavs) {
          setFavorites(JSON.parse(storedFavs));
        }
      } catch {
        // ignore parsing errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Click outside listener for search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener: ⌘K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current && !(document.activeElement instanceof HTMLInputElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Current category definition
  const currentCategory = useMemo<CategoryDefinition>(() => {
    return CONVERSION_CATEGORIES.find((c) => c.id === selectedCategory) || CONVERSION_CATEGORIES[0];
  }, [selectedCategory]);

  // Calculate live conversion
  const conversionResult = useMemo(() => {
    return convertValue(inputValue, selectedCategory, fromUnitId, toUnitId);
  }, [inputValue, selectedCategory, fromUnitId, toUnitId]);

  const fromUnitObj = useMemo<UnitDefinition | undefined>(() => {
    return currentCategory.units.find((u) => u.id === fromUnitId);
  }, [currentCategory, fromUnitId]);

  const toUnitObj = useMemo<UnitDefinition | undefined>(() => {
    return currentCategory.units.find((u) => u.id === toUnitId);
  }, [currentCategory, toUnitId]);

  // Reverse conversion for preview
  const reversePreview = useMemo(() => {
    const rev = convertValue(1, selectedCategory, toUnitId, fromUnitId);
    return `1 ${toUnitObj?.symbol || ''} = ${formatResult(rev.resultNumber, 'auto')} ${fromUnitObj?.symbol || ''}`;
  }, [selectedCategory, toUnitId, fromUnitId, toUnitObj, fromUnitObj]);

  // Formatted main display result
  const formattedResultDisplay = useMemo(() => {
    if (selectedCategory === 'number_systems') {
      return conversionResult.resultString;
    }
    return formatResult(conversionResult.resultNumber, precision);
  }, [conversionResult, precision, selectedCategory]);

  const numericInputValue = useMemo(() => {
    const val = parseFloat(inputValue);
    return isNaN(val) ? 1 : val;
  }, [inputValue]);

  // Top 6 related peer units in current category for Matrix
  const matrixUnits = useMemo(() => {
    return currentCategory.units.slice(0, 6);
  }, [currentCategory]);

  // Matrix benchmark comparison rows
  const matrixRows = useMemo(() => {
    const benchmarks = [0.1, 0.5, 1, 2, 5, 10, 25, 50, 100];
    const baseVal = numericInputValue !== 0 ? numericInputValue : 1;

    return benchmarks.map((multiplier) => {
      const testVal = parseFloat((baseVal * multiplier).toFixed(4));
      const conversions = matrixUnits.map((u) => {
        const res = convertValue(testVal, selectedCategory, fromUnitId, u.id);
        return {
          unit: u,
          formatted: formatResult(res.resultNumber, 'auto')
        };
      });
      return {
        multiplier,
        inputValue: testVal,
        values: conversions
      };
    });
  }, [numericInputValue, matrixUnits, selectedCategory, fromUnitId]);

  const handleNudge = (delta: number, isMultiplier = false) => {
    const current = parseFloat(inputValue) || 0;
    let next: number;
    if (isMultiplier) {
      next = delta > 0 ? current * delta : current / Math.abs(delta);
    } else {
      next = current + delta;
    }
    const rounded = Math.round(next * 10000) / 10000;
    setInputValue(String(rounded));
  };

  const handleResetDefaults = () => {
    setInputValue('1');
    showToast('Reset input value to default 1');
  };

  const handleExportMatrixCSV = () => {
    try {
      const headers = ['Input Value', ...matrixUnits.map((u) => `${u.name} (${u.symbol})`)];
      const rows = matrixRows.map((r) => [
        `${r.inputValue} ${fromUnitObj?.symbol || ''}`,
        ...r.values.map((v) => v.formatted)
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `solveit_${selectedCategory}_conversion_matrix.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported conversion matrix to CSV');
    } catch {
      showToast('Export failed');
    }
  };

  const handleCopyMatrixTable = () => {
    try {
      const text = matrixRows
        .map((r) => `${r.inputValue} ${fromUnitObj?.symbol || ''} = ` + r.values.map((v) => `${v.formatted} ${v.unit.symbol}`).join(' | '))
        .join('\n');
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      showToast('Copied conversion matrix to clipboard');
    } catch {
      showToast('Copy failed');
    }
  };

  const handleCopyFormula = () => {
    const formulaStr = conversionResult.formula || `${inputValue} ${fromUnitObj?.symbol || ''} = ${formattedResultDisplay} ${toUnitObj?.symbol || ''}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(formulaStr).catch(() => {});
    }
    showToast('Formula copied to clipboard');
  };

  const cognitiveAnalysis = useMemo(() => {
    const val = numericInputValue;
    const res = conversionResult.resultNumber;
    const fromSym = fromUnitObj?.symbol || '';
    const toSym = toUnitObj?.symbol || '';
    const fromName = fromUnitObj?.name || '';
    const toName = toUnitObj?.name || '';
    const catName = currentCategory.name;

    const absRes = Math.abs(res) || 1;
    const logMag = Math.log10(absRes);
    let magnitudeBand = 'Everyday Human Scale';
    let magnitudeSub = 'Domestic, commercial, and practical engineering operations';
    let magDot = 'bg-primary';

    if (logMag < -2) {
      magnitudeBand = 'Micro / Nanoscale Domain';
      magnitudeSub = 'Microscopic, laboratory, or microelectronic tolerances';
      magDot = 'bg-sky-500';
    } else if (logMag <= 3) {
      magnitudeBand = 'Human & Practical Scale';
      magnitudeSub = 'Standard architectural, automotive, and day-to-day measures';
      magDot = 'bg-primary';
    } else if (logMag <= 6) {
      magnitudeBand = 'Industrial & Heavy Scale';
      magnitudeSub = 'Heavy transport, civil infrastructure, and power grids';
      magDot = 'bg-emerald-500';
    } else {
      magnitudeBand = 'Macro / Astronomical Scale';
      magnitudeSub = 'Geological, aerospace, or telecommunications magnitudes';
      magDot = 'bg-error';
    }

    return {
      text: `At ${val} ${fromSym} (${fromName}) in the ${catName} domain, the equivalent measurement is ${formattedResultDisplay} ${toSym} (${toName}). This represents a direct scaling relation with an inverse conversion of ${reversePreview}. Calculations strictly adhere to BIPM SI standards and IEEE 754 floating-point accuracy.`,
      magnitudeBand,
      magnitudeSub,
      magDot
    };
  }, [numericInputValue, conversionResult.resultNumber, fromUnitObj, toUnitObj, currentCategory.name, formattedResultDisplay, reversePreview]);

  // Record conversion to recently used
  useEffect(() => {
    const num = parseFloat(inputValue);
    if ((isNaN(num) && selectedCategory !== 'number_systems') || !inputValue.trim()) return;

    const timer = setTimeout(() => {
      const newEntry: RecentConversion = {
        id: `${selectedCategory}-${fromUnitId}-${toUnitId}-${Date.now()}`,
        categoryId: selectedCategory,
        categoryName: currentCategory.name,
        fromUnitId,
        fromUnitName: fromUnitObj?.name || fromUnitId,
        fromUnitSymbol: fromUnitObj?.symbol || fromUnitId,
        toUnitId,
        toUnitName: toUnitObj?.name || toUnitId,
        toUnitSymbol: toUnitObj?.symbol || toUnitId,
        inputValue,
        resultValue: formattedResultDisplay,
        timestamp: Date.now()
      };

      setRecentlyUsed((prev) => {
        // Filter out identical pair if it was just added
        const filtered = prev.filter(
          (p) => !(p.categoryId === newEntry.categoryId && p.fromUnitId === newEntry.fromUnitId && p.toUnitId === newEntry.toUnitId)
        );
        const updated = [newEntry, ...filtered].slice(0, 10);
        try {
          localStorage.setItem('solveit_conversion_recents', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [inputValue, selectedCategory, fromUnitId, toUnitId, currentCategory, fromUnitObj, toUnitObj, formattedResultDisplay]);

  // Check if current pair is favorited
  const isFavorited = useMemo(() => {
    return favorites.some(
      (f) => f.categoryId === selectedCategory && f.fromUnitId === fromUnitId && f.toUnitId === toUnitId
    );
  }, [favorites, selectedCategory, fromUnitId, toUnitId]);

  const toggleFavoriteCurrent = () => {
    if (isFavorited) {
      const updated = favorites.filter(
        (f) => !(f.categoryId === selectedCategory && f.fromUnitId === fromUnitId && f.toUnitId === toUnitId)
      );
      setFavorites(updated);
      try {
        localStorage.setItem('solveit_conversion_favs', JSON.stringify(updated));
      } catch {}
      showToast('Removed from favorites');
    } else {
      const newFav: FavoritePair = {
        id: `fav-${Date.now()}`,
        categoryId: selectedCategory,
        fromUnitId,
        toUnitId,
        label: `${fromUnitObj?.name || fromUnitId} → ${toUnitObj?.name || toUnitId}`,
        categoryName: currentCategory.name
      };
      const updated = [newFav, ...favorites];
      setFavorites(updated);
      try {
        localStorage.setItem('solveit_conversion_favs', JSON.stringify(updated));
      } catch {}
      showToast('Saved to favorites');
    }
  };

  const removeFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    try {
      localStorage.setItem('solveit_conversion_favs', JSON.stringify(updated));
    } catch {}
    showToast('Removed favorite');
  };

  const clearRecents = () => {
    setRecentlyUsed([]);
    try {
      localStorage.removeItem('solveit_conversion_recents');
    } catch {}
    showToast('Conversion history cleared');
  };

  // Swap units
  const handleSwapUnits = () => {
    setIsSwapping(true);
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  // Load a pair directly into converter
  const loadConversionPair = (
    catId: string,
    from: string,
    to: string,
    val: string | number = '1'
  ) => {
    handleSelectCategory(catId, from, to);
    setInputValue(String(val));
    // Smoothly scroll to the converter widget
    const widget = document.getElementById('smart-converter-widget');
    if (widget) {
      widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast(`Loaded ${from.toUpperCase()} to ${to.toUpperCase()}`);
  };

  // Universal Search Live Suggestions
  const searchSuggestions = useMemo(() => {
    const raw = universalQuery.trim();
    if (!raw) return [];
    const q = raw.toLowerCase();

    interface SuggestionItem {
      type: 'pair' | 'category' | 'unit';
      title: string;
      subtitle: string;
      categoryId: string;
      fromId?: string;
      toId?: string;
      inputValue?: string;
      badge?: string;
    }

    const results: SuggestionItem[] = [];

    // 1. Natural Language Pattern matching (e.g. "100 km to miles", "50 c in f", "32 psi -> bar", "kg to lbs")
    const conversionPattern = /^([\d,.]+)?\s*([a-zA-Z°/·²³^%]+)\s*(?:to|in|into|->|=>|→|\/|\s+)\s*([a-zA-Z°/·²³^%]+)$/i;
    const match = q.match(conversionPattern);

    if (match) {
      const parsedVal = match[1] ? match[1].replace(/,/g, '') : '1';
      const fromStr = match[2].trim().toLowerCase();
      const toStr = match[3].trim().toLowerCase();

      // Find best matching category and units
      for (const cat of CONVERSION_CATEGORIES) {
        const fromUnit = cat.units.find(
          (u) => u.id.toLowerCase() === fromStr || u.symbol.toLowerCase() === fromStr || u.name.toLowerCase() === fromStr || u.name.toLowerCase().startsWith(fromStr)
        );
        const toUnit = cat.units.find(
          (u) => u.id.toLowerCase() === toStr || u.symbol.toLowerCase() === toStr || u.name.toLowerCase() === toStr || u.name.toLowerCase().startsWith(toStr)
        );

        if (fromUnit && toUnit) {
          results.push({
            type: 'pair',
            title: `Convert ${parsedVal} ${fromUnit.symbol} to ${toUnit.symbol}`,
            subtitle: `${fromUnit.name} → ${toUnit.name} • ${cat.name} Converter`,
            categoryId: cat.id,
            fromId: fromUnit.id,
            toId: toUnit.id,
            inputValue: parsedVal,
            badge: 'Direct Match'
          });
          break;
        }
      }
    }

    // 2. Check popular conversions
    for (const pop of POPULAR_CONVERSIONS_DATA) {
      if (
        pop.label.toLowerCase().includes(q) ||
        pop.name.toLowerCase().includes(q) ||
        pop.fromSymbol.toLowerCase() === q ||
        pop.toSymbol.toLowerCase() === q ||
        `${pop.fromSymbol} to ${pop.toSymbol}`.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'pair',
          title: pop.name,
          subtitle: `${pop.fromSymbol} to ${pop.toSymbol} (${pop.searches} searches)`,
          categoryId: pop.categoryId,
          fromId: pop.fromUnitId,
          toId: pop.toUnitId,
          badge: 'Popular'
        });
      }
    }

    // 3. Check category titles and keywords
    for (const cat of CONVERSION_CATEGORIES) {
      const catMatches = cat.name.toLowerCase().includes(q) ||
        cat.id.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        `${cat.name} converter`.toLowerCase().includes(q);

      if (catMatches) {
        results.push({
          type: 'category',
          title: `${cat.name} Converter`,
          subtitle: `${cat.countLabel} • ${cat.popularPair.label}`,
          categoryId: cat.id,
          fromId: cat.units[0]?.id,
          toId: cat.units[1]?.id || cat.units[0]?.id,
          badge: 'Tool'
        });
      }

      // 4. Check units within categories
      for (const u of cat.units) {
        const uMatches = u.name.toLowerCase().includes(q) ||
          u.symbol.toLowerCase() === q ||
          u.id.toLowerCase() === q ||
          (u as any).aliases?.some((a: string) => a.toLowerCase().includes(q));

        if (uMatches) {
          const targetUnit = cat.baseUnitId !== u.id ? cat.baseUnitId : cat.units.find((x) => x.id !== u.id)?.id || u.id;
          results.push({
            type: 'unit',
            title: `${u.name} (${u.symbol})`,
            subtitle: `${cat.name} unit • Convert from/to ${u.symbol}`,
            categoryId: cat.id,
            fromId: u.id,
            toId: targetUnit,
            badge: cat.name
          });
        }
      }
    }

    // Remove duplicates and limit results
    const seen = new Set<string>();
    return results.filter((item) => {
      const key = `${item.categoryId}-${item.fromId}-${item.toId}-${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 8);
  }, [universalQuery]);

  // Handle selecting a search suggestion
  const handleSelectSuggestion = (sug: {
    type: 'pair' | 'category' | 'unit';
    categoryId: string;
    fromId?: string;
    toId?: string;
    inputValue?: string;
  }) => {
    if (sug.type === 'category') {
      router.push(getCategoryHref(sug.categoryId));
    } else if (sug.categoryId && sug.fromId && sug.toId) {
      loadConversionPair(sug.categoryId, sug.fromId, sug.toId, sug.inputValue || inputValue);
    } else {
      handleSelectCategory(sug.categoryId);
    }
    setUniversalQuery('');
    setIsSearchFocused(false);
    setSelectedSuggestionIndex(-1);
  };

  // Copy result
  const handleCopyResult = () => {
    const textToCopy = `${inputValue} ${fromUnitObj?.symbol || ''} = ${formattedResultDisplay} ${toUnitObj?.symbol || ''}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    showToast('Result copied to clipboard');
  };

  // Copy share link
  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('cat', selectedCategory);
      url.searchParams.set('from', fromUnitId);
      url.searchParams.set('to', toUnitId);
      url.searchParams.set('val', inputValue);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url.toString()).catch(() => {});
      }
      showToast('Conversion link copied');
    }
  };

  // Knowledge Center Tab
  const [knowledgeTab, setKnowledgeTab] = useState<'guides' | 'units' | 'formulas' | 'systems'>('guides');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Peer comparison matrix (compare inputValue in other units of same category)
  const peerComparisons = useMemo(() => {
    if (selectedCategory === 'number_systems') return [];
    const peers = currentCategory.units.filter((u) => u.id !== fromUnitId).slice(0, 5);
    return peers.map((p) => {
      const res = convertValue(inputValue, selectedCategory, fromUnitId, p.id);
      return {
        unit: p,
        formatted: formatResult(res.resultNumber, precision)
      };
    });
  }, [currentCategory, fromUnitId, inputValue, selectedCategory, precision]);

  return (
    <div className="min-h-screen bg-surface text-on-surface transition-colors duration-200">
      {/* Main Container */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb & Standards Telemetry Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">swap_horiz</span>
              <span>Unit Converter &amp; Conversion Tools</span>
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              ISO 80000 &amp; NIST SP 811 Compliant
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-medium">
              IEEE 754 64-Bit Fidelity
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-mono">
              25+ Measurement Domains
            </span>
          </div>
        </div>
        {/* =========================================================================
            HERO SECTION: Apple & Linear Inspired Command Center
        ========================================================================= */}
        <section className="relative pt-6 md:pt-10 pb-4 text-center space-y-6">
          {/* Subtle glowing ambient backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[280px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-400/10 dark:from-blue-600/15 dark:via-purple-600/15 dark:to-cyan-400/15 blur-3xl pointer-events-none -z-10 rounded-full"></div>

          {/* Top Brand Tagline Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              SolveIt Calculator • Convert Anything. Instantly.
            </div>
          </div>

          {/* Hero Headings */}
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
              Unit Converter &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">Conversion Tools</span>
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 max-w-3xl mx-auto">
              Unit Converter &amp; Conversion Tools for Fast and Accurate Conversions
            </p>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto">
              Convert units instantly with free conversion tools for length, weight, volume, temperature, area, speed, time, data storage, cooking measurements, and more.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto pt-1">
              Explore free Unit Converter &amp; Conversion Tools designed to help students, professionals, engineers, cooks, travelers, and everyday users convert measurements quickly and accurately. Convert weight, length, area, volume, temperature, speed, pressure, energy, data storage, cooking ingredients, and many other units using easy-to-use conversion calculators.
            </p>
          </div>

          {/* Large Universal Search with Live Suggestions */}
          <div ref={searchContainerRef} className="max-w-2xl mx-auto relative z-30">
            <div className={`relative flex items-center rounded-2xl transition-all duration-200 shadow-lg ${
              isSearchFocused
                ? 'ring-2 ring-blue-500 shadow-blue-500/10 bg-white dark:bg-slate-900 border-transparent'
                : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl'
            }`}>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 ml-4 mr-2 text-[22px]">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={universalQuery}
                onChange={(e) => {
                  setUniversalQuery(e.target.value);
                  setIsSearchFocused(true);
                  setSelectedSuggestionIndex(-1);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (searchSuggestions.length > 0) {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedSuggestionIndex((prev) => (prev + 1) % searchSuggestions.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedSuggestionIndex((prev) => (prev <= 0 ? searchSuggestions.length - 1 : prev - 1));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const chosen = selectedSuggestionIndex >= 0 ? searchSuggestions[selectedSuggestionIndex] : searchSuggestions[0];
                      if (chosen) {
                        handleSelectSuggestion(chosen);
                      }
                    }
                  }
                }}
                placeholder="Search conversions (e.g. cm to inches, 100 kg to lbs, celsius, psi)..."
                className="w-full py-4 pr-12 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-none"
              />
              {universalQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setUniversalQuery('');
                    setSelectedSuggestionIndex(-1);
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <div className="mr-4 hidden sm:flex items-center gap-1">
                  <kbd className="px-2 py-0.5 text-xs font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner">
                    ⌘K
                  </kbd>
                </div>
              )}
            </div>

            {/* Live Suggestions Dropdown */}
            {isSearchFocused && universalQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-left z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3">
                  <span>Suggestions for &ldquo;{universalQuery}&rdquo;</span>
                  <span className="hidden sm:inline">Use ↑ ↓ to navigate, ↵ to select</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((sug, idx) => {
                      const isHighlighted = idx === selectedSuggestionIndex;
                      return (
                        <button
                          key={`${sug.categoryId}-${sug.fromId}-${sug.toId}-${idx}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(sug)}
                          onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                          className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors group cursor-pointer ${
                            isHighlighted
                              ? 'bg-blue-50/90 dark:bg-slate-800/90'
                              : 'hover:bg-blue-50/70 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] shrink-0">
                              {sug.type === 'category' ? 'category' : sug.type === 'unit' ? 'straighten' : 'swap_horiz'}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold truncate ${
                                  isHighlighted ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                }`}>
                                  {sug.title}
                                </span>
                                {sug.badge && (
                                  <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 shrink-0">
                                    {sug.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {sug.subtitle}
                              </div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[18px] transition-transform group-hover:translate-x-0.5 shrink-0 ml-2">
                            arrow_forward
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      No matching conversions found. Try searching by unit symbol (e.g. &ldquo;cm&rdquo;, &ldquo;psi&rdquo;, &ldquo;kw&rdquo;).
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick search chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Popular:</span>
              {[
                { label: 'cm to inches', cat: 'length', from: 'cm', to: 'in' },
                { label: 'kg to lbs', cat: 'weight', from: 'kg', to: 'lb' },
                { label: 'mph to km/h', cat: 'speed', from: 'mph', to: 'kmh' },
                { label: 'celsius to fahrenheit', cat: 'temperature', from: 'c', to: 'f' }
              ].map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => loadConversionPair(pill.cat, pill.from, pill.to)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  {pill.label}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* =========================================================================
            ADVANCED CONVERSION WORKBENCH & VISUAL LIVE ANALYSER
            (Directly referenced from Engine RPM & Gear Ratio Tool layout & telemetry)
        ========================================================================= */}
        <section id="smart-converter-widget" className="relative scroll-mt-28">
          <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl overflow-hidden">
            {/* Workbench Master Header & Controls */}
            <div className="p-5 sm:p-6 border-b border-outline-variant/20 bg-surface-container-low/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                  <span className="material-symbols-outlined text-[26px]">{currentCategory.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      {currentCategory.name} Unit Converter
                    </h2>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                      v4.2 Workbench
                    </span>
                    <Link
                      href={getCategoryHref(currentCategory.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                      title={`Open full dedicated ${currentCategory.name} tool`}
                    >
                      <span>Open {currentCategory.name} Page</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {currentCategory.description} • Exact IEEE 754 precision with real-time tachometer gauge &amp; curve response
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={toggleFavoriteCurrent}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isFavorited
                      ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                  }`}
                  title="Bookmark this conversion pair"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isFavorited ? 'star' : 'star_border'}
                  </span>
                  <span>{isFavorited ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Share link"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-1.5 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Reset to default 1"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Category horizontal scroll switcher (20 categories) */}
            <div className="px-5 py-3 border-b border-outline-variant/20 bg-surface-container-low/20 overflow-x-auto scrollbar-none flex items-center gap-1.5">
              {CONVERSION_CATEGORIES.map((cat) => {
                const isActive = cat.id === selectedCategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (cat.id === 'volume') {
                        router.push('/volume-converter');
                      } else {
                        handleSelectCategory(cat.id);
                      }
                    }}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-sm shadow-primary/30 font-semibold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75 font-data-mono">({cat.units.length})</span>
                    {cat.id === 'volume' && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                        Suite ↗
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* If Volume category is selected, show prominent direct suite link */}
            {selectedCategory === 'volume' && (
              <div className="mx-5 my-3 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">water_drop</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Volume &amp; Capacity Dedicated Converter
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Looking for the dedicated full-page converter with fluid physics simulation and NIST tables?
                    </div>
                  </div>
                </div>
                <Link
                  href="/volume-converter"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>Open Dedicated Volume Page</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            )}

            {/* 2-Column Responsive Layout: 7 Cols Inputs / 5 Cols Telemetry & Visual Analyser */}
            <div className="p-5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* =========================================================
                  LEFT COLUMN (7 COLS): ADVANCED INTERACTIVE INPUT CONTROLS
              ========================================================= */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Header Sub-bar */}
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Dimensional Input Parameters
                    </h3>
                  </div>
                  <span className="text-xs font-label-caps uppercase text-on-surface-variant font-semibold">
                    Category: {currentCategory.name}
                  </span>
                </div>

                {/* PARAMETER 1: SOURCE VALUE WITH RANGE SCRUBBER & FINE STEPPERS */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                      <span>Source Quantity ({fromUnitObj?.symbol || 'Unit'})</span>
                    </label>
                    <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-data-mono">
                      <span>Base Unit:</span>
                      <span className="font-semibold text-primary">{currentCategory.baseUnitId}</span>
                    </div>
                  </div>

                  {/* Large Input Field with Stepper Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="any"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-data-mono font-bold text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner"
                      />
                      {inputValue && (
                        <button
                          type="button"
                          onClick={() => setInputValue('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface rounded-md"
                          title="Clear input"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                    </div>
                    <div className="px-4 py-3.5 rounded-xl bg-surface-container font-bold text-on-surface text-base sm:text-lg border border-outline-variant/30 min-w-[75px] text-center font-data-mono">
                      {fromUnitObj?.symbol || 'Unit'}
                    </div>
                  </div>

                  {/* CONTINUOUS RANGE SLIDER FOR REAL-TIME SCRUBBING */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-on-surface-variant font-data-mono">
                      <span>Live Range Scrubber</span>
                      <span className="text-primary font-semibold">{inputValue || 0} {fromUnitObj?.symbol}</span>
                    </div>
                    <input
                      type="range"
                      min={currentCategory.id === 'temperature' ? -40 : 0.1}
                      max={
                        numericInputValue > 500
                          ? Math.ceil(numericInputValue * 1.5)
                          : currentCategory.id === 'temperature'
                          ? 120
                          : 100
                      }
                      step={currentCategory.id === 'temperature' ? 0.5 : 0.1}
                      value={numericInputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full h-2 rounded-lg bg-surface-container accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-data-mono">
                      <span>{currentCategory.id === 'temperature' ? '-40°' : '0.1'}</span>
                      <span>50% Mid</span>
                      <span>{numericInputValue > 500 ? Math.ceil(numericInputValue * 1.5) : currentCategory.id === 'temperature' ? '120°' : '100'}</span>
                    </div>
                  </div>

                  {/* Fine-Tuning Nudge Steppers */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-label-caps uppercase text-on-surface-variant mr-1 font-semibold">
                      Fine Nudge:
                    </span>
                    {[-10, -1, -0.1, 0.1, 1, 10].map((delta) => (
                      <button
                        key={delta}
                        type="button"
                        onClick={() => handleNudge(delta)}
                        className="px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono font-medium text-on-surface-variant hover:text-on-surface border border-outline-variant/20 transition-colors"
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleNudge(10, true)}
                      className="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-[11px] font-data-mono font-bold text-primary border border-primary/20 transition-colors"
                      title="Multiply by 10"
                    >
                      ×10
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNudge(-10, true)}
                      className="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-[11px] font-data-mono font-bold text-primary border border-primary/20 transition-colors"
                      title="Divide by 10"
                    >
                      ÷10
                    </button>
                  </div>

                  {/* Benchmark Multiplier Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-outline-variant/15">
                    <span className="text-[11px] font-label-caps uppercase text-on-surface-variant mr-1 font-semibold">
                      Presets:
                    </span>
                    {[0.1, 1, 5, 10, 25, 50, 100, 1000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInputValue(String(val))}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-data-mono transition-colors ${
                          Number(inputValue) === val
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/20'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PARAMETER 2 & 3: DUAL UNIT SELECTORS WITH SWAP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                  {/* FROM UNIT SELECTOR */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">logout</span>
                        <span>From Unit</span>
                      </span>
                      {fromUnitObj?.system && (
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-surface-container font-semibold text-primary">
                          {fromUnitObj.system}
                        </span>
                      )}
                    </div>
                    <select
                      value={fromUnitId}
                      onChange={(e) => setFromUnitId(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-xs"
                    >
                      {currentCategory.units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.symbol}) {u.system ? `• ${u.system.toUpperCase()}` : ''}
                        </option>
                      ))}
                    </select>
                    {fromUnitObj?.description && (
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 italic">
                        {fromUnitObj.description}
                      </p>
                    )}
                  </div>

                  {/* SWAP UNITS BUTTON (DESKTOP CENTER / MOBILE IN-LINE) */}
                  <div className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-10 flex justify-center -my-2 sm:my-0">
                    <button
                      type="button"
                      onClick={handleSwapUnits}
                      className={`p-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 shadow-md shadow-primary/30 transition-transform active:scale-95 cursor-pointer flex items-center justify-center ${
                        isSwapping ? 'rotate-180 duration-300' : ''
                      }`}
                      title="Swap Units (Keyboard: S)"
                    >
                      <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                    </button>
                  </div>

                  {/* TO UNIT SELECTOR */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-emerald-400">login</span>
                        <span>To Unit</span>
                      </span>
                      {toUnitObj?.system && (
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-surface-container font-semibold text-emerald-600 dark:text-emerald-400">
                          {toUnitObj.system}
                        </span>
                      )}
                    </div>
                    <select
                      value={toUnitId}
                      onChange={(e) => setToUnitId(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-xs"
                    >
                      {currentCategory.units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.symbol}) {u.system ? `• ${u.system.toUpperCase()}` : ''}
                        </option>
                      ))}
                    </select>
                    {toUnitObj?.description && (
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 italic">
                        {toUnitObj.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* TARGET PRECISION SELECTOR */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-label-caps uppercase text-on-surface-variant font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">decimal_increase</span>
                    <span>Precision Display:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {(['auto', '2', '4', '6', '8', 'scientific'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-data-mono font-medium transition-colors ${
                          precision === p
                            ? 'bg-primary text-on-primary font-bold shadow-xs'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {p === 'auto' ? 'Auto' : p === 'scientific' ? 'Sci' : `${p} Dec`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WORKBENCH BOTTOM ACTION CONTROLS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyResult}
                      className="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span>Copy Output</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyFormula}
                      className="px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">functions</span>
                      <span>Copy Formula</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          window.print();
                        } catch {}
                      }}
                      className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs font-semibold border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer"
                      title="Print Calculation Sheet"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span className="hidden sm:inline">Print</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-on-surface-variant font-data-mono hidden sm:flex items-center gap-2">
                    <span>Hotkeys:</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-[10px]">S</kbd> Swap
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-[10px]">C</kbd> Copy
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-[10px]">R</kbd> Reset
                  </div>
                </div>
              </div>

              {/* =========================================================
                  RIGHT COLUMN (5 COLS): TELEMETRY OUTPUT & VISUAL LIVE ANALYSER
                  (Directly referenced from Engine RPM Tachometer & Telemetry layout)
              ========================================================= */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* 4 TELEMETRY CARDS IN A 2-COL GRID */}
                <div className="grid grid-cols-2 gap-3">
                  {/* CARD 1 (FULL 2-SPAN): PRIMARY CONVERTED OUTPUT READOUT */}
                  <div className="col-span-2 p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="font-label-caps uppercase tracking-wider font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                        <span>Converted Readout</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Calibrated
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-numerical-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                        {formattedResultDisplay}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-on-surface font-data-mono">
                        {toUnitObj?.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant pt-1 border-t border-outline-variant/15 flex items-center justify-between">
                      <span>{toUnitObj?.name}</span>
                      <span className="font-data-mono font-medium text-[11px]">{reversePreview}</span>
                    </div>
                  </div>

                  {/* CARD 2: SCALING FACTOR / MULTIPLIER */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-1">
                    <span className="text-[11px] font-label-caps uppercase text-on-surface-variant font-semibold">
                      Forward Factor
                    </span>
                    <span className="font-data-mono text-base font-bold text-on-surface truncate">
                      {formatResult(
                        convertValue(1, selectedCategory, fromUnitId, toUnitId).resultNumber,
                        'auto'
                      )}
                    </span>
                    <span className="text-[10px] text-on-surface-variant truncate">
                      1 {fromUnitObj?.symbol} in {toUnitObj?.symbol}
                    </span>
                  </div>

                  {/* CARD 3: REVERSE RECIPROCAL RATE */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-1">
                    <span className="text-[11px] font-label-caps uppercase text-on-surface-variant font-semibold">
                      Reverse Reciprocal
                    </span>
                    <span className="font-data-mono text-base font-bold text-on-surface truncate">
                      {formatResult(
                        convertValue(1, selectedCategory, toUnitId, fromUnitId).resultNumber,
                        'auto'
                      )}
                    </span>
                    <span className="text-[10px] text-on-surface-variant truncate">
                      1 {toUnitObj?.symbol} in {fromUnitObj?.symbol}
                    </span>
                  </div>

                  {/* CARD 4 (FULL 2-SPAN): PHYSICAL SCALE BENCHMARK */}
                  <div className="col-span-2 px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cognitiveAnalysis.magDot}`}></span>
                      <span className="font-semibold text-on-surface">{cognitiveAnalysis.magnitudeBand}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant truncate font-data-mono">
                      BIPM Metric Standard
                    </span>
                  </div>
                </div>

                {/* VISUAL LIVE ANALYSER COMPONENT: TACHOMETER GAUGE + DUAL BARS + 2D GRAPH */}
                {fromUnitObj && toUnitObj && (
                  <ConversionVisualAnalyzer
                    category={currentCategory}
                    fromUnit={fromUnitObj}
                    toUnit={toUnitObj}
                    inputValue={numericInputValue}
                    resultValue={conversionResult.resultNumber}
                    formattedResult={formattedResultDisplay}
                    onSelectValue={(newVal) => setInputValue(String(newVal))}
                  />
                )}
              </div>
            </div>

            {/* =========================================================================
                SECTION 5: AUTOMATED COGNITIVE DIMENSIONAL ANALYSIS
                (Brain icon card matching Engine RPM & Gear Ratio Tool layout)
            ========================================================================= */}
            <div className="border-t border-outline-variant/20 p-5 sm:p-6 lg:p-8 bg-surface-container-low/30">
              <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">psychology</span>
                    </div>
                    <h4 className="text-base font-bold text-on-surface">
                      SolveIt Automated Dimensional Analysis
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-primary">
                      {currentCategory.name} Metrology
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                      NIST SP 811 Compliant
                    </span>
                  </div>
                </div>

                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {cognitiveAnalysis.text}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-outline-variant/20">
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <div className="font-semibold text-on-surface mb-0.5">Scaling Character</div>
                    <div className="text-on-surface-variant">
                      {currentCategory.id === 'fuel_economy' ? 'Hyperbolic / Non-linear Inverse' : currentCategory.id === 'temperature' ? 'Affine Offset Linear Model' : 'Exact Linear Proportional Ratio'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <div className="font-semibold text-on-surface mb-0.5">Measurement Domain</div>
                    <div className="text-on-surface-variant">{cognitiveAnalysis.magnitudeSub}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low text-xs">
                    <div className="font-semibold text-on-surface mb-0.5">Precision Guarantee</div>
                    <div className="text-on-surface-variant font-data-mono">IEEE 754 (64-bit IEEE float)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SECTION 6: MULTI-UNIT VALUE COMPARISON MATRIX
                (Directly modeled after Speed vs. Gear RPM Matrix in Engine RPM tool)
            ========================================================================= */}
            <div className="border-t border-outline-variant/20 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">grid_on</span>
                    <h3 className="text-lg font-bold text-on-surface">
                      {currentCategory.name} Multi-Unit Comparative Matrix
                    </h3>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Real-time matrix benchmarking scaled inputs against {matrixUnits.length} peer units in this category.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportMatrixCSV}
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyMatrixTable}
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Copy Matrix</span>
                  </button>
                </div>
              </div>

              {/* Responsive Scrollable Table */}
              <div className="w-full overflow-x-auto rounded-2xl border border-outline-variant/25 bg-surface-container-lowest shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/25 bg-surface-container-low/60 font-label-caps uppercase tracking-wider text-on-surface-variant">
                      <th className="p-3.5 font-bold">Input ({fromUnitObj?.symbol})</th>
                      <th className="p-3.5 font-bold">Scale Multiplier</th>
                      {matrixUnits.map((u) => (
                        <th key={u.id} className="p-3.5 font-bold whitespace-nowrap">
                          {u.name} ({u.symbol})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 font-data-mono">
                    {matrixRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-surface-container/50 transition-colors ${
                          row.multiplier === 1 ? 'bg-primary/5 font-semibold text-primary' : 'text-on-surface'
                        }`}
                      >
                        <td className="p-3.5 font-bold">
                          {row.inputValue} <span className="text-on-surface-variant text-[11px] font-normal">{fromUnitObj?.symbol}</span>
                          {row.multiplier === 1 && (
                            <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-primary text-on-primary font-bold">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-on-surface-variant font-normal">
                          {row.multiplier}×
                        </td>
                        {row.values.map((v) => (
                          <td key={v.unit.id} className="p-3.5 whitespace-nowrap">
                            <span className="font-semibold">{v.formatted}</span>{' '}
                            <span className="text-on-surface-variant text-[10px]">{v.unit.symbol}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* =========================================================================
                SECTION 7: MATHEMATICAL FORMULA & STEP-BY-STEP DERIVATION
            ========================================================================= */}
            <div className="border-t border-outline-variant/20 p-5 sm:p-6 lg:p-8 bg-surface-container-low/40">
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">functions</span>
                    <span>Mathematical Derivation &amp; Formula</span>
                  </div>
                  <div className="text-base font-data-mono font-bold text-on-surface">
                    {conversionResult.formula || `${inputValue} ${fromUnitObj?.symbol} = ${formattedResultDisplay} ${toUnitObj?.symbol}`}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Standard Reciprocal Relation: {reversePreview}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleCopyFormula}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Copy Formula</span>
                  </button>
                  <Link
                    href={`/convert/${selectedCategory}`}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant/30 flex items-center gap-1.5 transition-colors"
                  >
                    <span>View All {currentCategory.name} Tools</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            POPULAR CONVERSIONS: Large Modern Cards with Search Volume Indicators
        ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                High Volume Conversions
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Most Popular Conversions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Ranked by verified global search index frequency
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {POPULAR_CONVERSIONS_DATA.map((card) => (
              <div
                key={card.label}
                onClick={() => loadConversionPair(card.categoryId, card.fromUnitId, card.toUnitId)}
                className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">trending_up</span>
                      <span>{card.searches}/mo</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">{card.trend}</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <span>{card.label}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {card.name}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[11px]">{card.ratio}</span>
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            RECENTLY USED & FAVORITES: Stored Locally
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recently Used (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">history</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recently Used (Last 10)</h3>
              </div>
              {recentlyUsed.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecents}
                  className="text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            {recentlyUsed.length > 0 ? (
              <div className="space-y-2">
                {recentlyUsed.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadConversionPair(item.categoryId, item.fromUnitId, item.toUnitId, item.inputValue)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-mono font-bold">
                        {item.fromUnitSymbol}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.inputValue} {item.fromUnitSymbol} = {item.resultValue} {item.toUnitSymbol}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {item.categoryName} • {item.fromUnitName} to {item.toUnitName}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[18px]">
                      replay
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="material-symbols-outlined text-slate-400 text-[32px]">manage_history</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No conversion history yet</p>
                <p className="text-xs text-slate-400">Your recent conversions will automatically be saved here.</p>
              </div>
            )}
          </div>

          {/* Favorites / Bookmarks (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[20px]">star</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bookmarked Favorites</h3>
              </div>
              <span className="text-xs text-slate-400">{favorites.length} saved</span>
            </div>

            {favorites.length > 0 ? (
              <div className="space-y-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => loadConversionPair(fav.categoryId, fav.fromUnitId, fav.toUnitId)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {fav.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {fav.categoryName}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => removeFavorite(fav.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove bookmark"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-500 text-[18px]">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="material-symbols-outlined text-slate-400 text-[32px]">bookmark_border</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No bookmarks saved</p>
                <p className="text-xs text-slate-400">Click &ldquo;Bookmark&rdquo; in the converter to save quick access shortcuts.</p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            TRENDING TODAY: Most Used Conversions
        ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Live Surges &amp; Industry Momentum
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Trending Today
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Telemetry
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDING_TODAY_DATA.map((trend) => (
              <div
                key={trend.label}
                onClick={() => loadConversionPair(trend.categoryId, trend.from, trend.to)}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {trend.label}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                      {trend.change}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pt-1">
                    {trend.topic}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Momentum: <strong className="text-slate-700 dark:text-slate-200">{trend.momentum}</strong></span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-0.5">
                    Launch <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            CONVERSION CATEGORIES GRID: 20 Rich Categories
        ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Complete Ecosystem
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Conversion Categories
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              20 Specialized Measurement Disciplines • Hundreds of Calibrated Units
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONVERSION_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                      {cat.countLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Link href={getCategoryHref(cat.id)} className="hover:underline">
                        {cat.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400 text-[11px] block">Popular:</span>
                    <strong className="text-slate-900 dark:text-white">{cat.popularPair.label}</strong>
                  </div>
                </div>

                <div className="mt-5 pt-3 flex items-center gap-2">
                  <Link
                    href={getCategoryHref(cat.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Open {cat.name}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectCategory(cat.id, cat.popularPair.from, cat.popularPair.to);
                      const widget = document.getElementById('smart-converter-widget');
                      widget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      showToast(`Loaded ${cat.name} in workbench`);
                    }}
                    title="Load in workbench above"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            KNOWLEDGE CENTER: Conversion Guides, Unit Explanations, Formulas, Systems
        ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Educational Curriculum
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Knowledge Center
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Dimensional Analysis • Metrology Standards • Metric vs Imperial History
            </p>
          </div>

          {/* Knowledge Center Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none pb-2">
            {[
              { id: 'guides', label: 'Conversion Guides', icon: 'menu_book' },
              { id: 'units', label: 'Unit Explanations & SI Base', icon: 'science' },
              { id: 'formulas', label: 'Formulas Cheat Sheet', icon: 'functions' },
              { id: 'systems', label: 'Measurement Systems (Metric vs Imperial)', icon: 'public' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setKnowledgeTab(tab.id as typeof knowledgeTab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  knowledgeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content 1: Conversion Guides */}
          {knowledgeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Dimensional Analysis (The Factor-Label Method)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dimensional analysis converts any measurement by multiplying by a conversion ratio equal to 1. Because units cancel out algebraically in fractions, aligning target units in the numerator ensures correct division or multiplication without guesswork.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Significant Figures &amp; Rounding Traps
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When translating between systems (e.g. converting a nominal &ldquo;6-foot&rdquo; table into meters), avoid false precision like 1.828800 m. Match precision to the measurement instrument&rsquo;s actual tolerance to prevent engineering discrepancies.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Non-Linear Conversions (Offset &amp; Radix)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Not all conversions are simple multipliers. Temperature scales (Celsius to Fahrenheit) require additive zero-point shifts (+32°F). Fuel economy (MPG to L/100km) uses an inverse reciprocal equation (235.215 / MPG).
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 2: Unit Explanations & SI Base */}
          {knowledgeTab === 'units' && (
            <div className="space-y-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  The 7 Fundamental SI Base Units
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Defined by international consensus under the 2019 redefinition tied to exact universal physical constants.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Meter (m)', dim: 'Length', constant: 'Speed of light in vacuum (c)', symbol: 'm' },
                  { name: 'Kilogram (kg)', dim: 'Mass', constant: 'Planck constant (h)', symbol: 'kg' },
                  { name: 'Second (s)', dim: 'Time', constant: 'Cesium-133 transition frequency', symbol: 's' },
                  { name: 'Ampere (A)', dim: 'Electric Current', constant: 'Elementary electric charge (e)', symbol: 'A' },
                  { name: 'Kelvin (K)', dim: 'Thermodynamics', constant: 'Boltzmann constant (k)', symbol: 'K' },
                  { name: 'Mole (mol)', dim: 'Substance Amount', constant: 'Avogadro constant (NA)', symbol: 'mol' },
                  { name: 'Candela (cd)', dim: 'Luminous Intensity', constant: 'Luminous efficacy (Kcd)', symbol: 'cd' },
                  { name: 'Radian (rad)', dim: 'Plane Angle (Supplementary)', constant: 'Dimensionless arc-to-radius ratio', symbol: 'rad' }
                ].map((u) => (
                  <div key={u.name} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold">
                      <span>{u.dim}</span>
                      <span className="font-mono text-slate-500">{u.symbol}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Anchor: {u.constant}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: Formulas Cheat Sheet */}
          {knowledgeTab === 'formulas' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Essential Conversion Constants Cheat-Sheet
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Physical Domain</th>
                      <th className="p-3">From Unit</th>
                      <th className="p-3">To Unit</th>
                      <th className="p-3">Exact Multiplier / Formula</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Length</td>
                      <td className="p-3">Inch (in)</td>
                      <td className="p-3">Centimeter (cm)</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">× 2.54 (Exact)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Length</td>
                      <td className="p-3">Mile (mi)</td>
                      <td className="p-3">Kilometer (km)</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">× 1.609344 (Exact)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Mass</td>
                      <td className="p-3">Pound (lb)</td>
                      <td className="p-3">Kilogram (kg)</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">× 0.45359237 (Exact)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Thermal</td>
                      <td className="p-3">Celsius (°C)</td>
                      <td className="p-3">Fahrenheit (°F)</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">(°C × 9/5) + 32</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Volume</td>
                      <td className="p-3">Gallon (US)</td>
                      <td className="p-3">Liter (L)</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">× 3.785411784 (Exact)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Pressure</td>
                      <td className="p-3">Pound/sq in (psi)</td>
                      <td className="p-3">Bar</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">× 0.06894757</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900 dark:text-white">Energy</td>
                      <td className="p-3">Kilowatt-hour (kWh)</td>
                      <td className="p-3">Megajoule (MJ)</td>
                      <td className="p-3 text-blue-600 dark:text-blue-400">× 3.6 (Exact)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content 4: Measurement Systems */}
          {knowledgeTab === 'systems' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Metric System (SI) vs. Imperial &amp; US Customary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  A foundational comparison of decimal engineering scalability versus traditional human-scale anthropometric divisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>The International System of Units (SI Metric)</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                    <li><strong>Decimally Unified:</strong> Scaled by clean powers of 10 with standard prefixes (milli-, centi-, kilo-, mega-).</li>
                    <li><strong>Coherent Derivation:</strong> 1 Newton = 1 kg·m/s², 1 Joule = 1 N·m, 1 Watt = 1 J/s without arbitrary conversion constants.</li>
                    <li><strong>Global Standard:</strong> Adopted by 95%+ of global nations, international trade treaties, and scientific research.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                    <span>Imperial &amp; US Customary Systems</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                    <li><strong>Divisibility by 2, 3, and 4:</strong> 12 inches to a foot (divisible by 2, 3, 4, 6), 16 ounces to a pound, highly practical for carpentry fractions ($1/8&rdquo;, 1/16&rdquo;$).</li>
                    <li><strong>US vs. UK Divergence:</strong> A British Imperial gallon is 4.546 liters (160 imperial fluid ounces) while a US gallon is 3.785 liters (128 US fluid ounces).</li>
                    <li><strong>Legally Tied to Metric:</strong> Since the Mendenhall Order (1893) and 1959 treaty, the US inch is formally defined by metric law as exactly 25.4 mm.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            FAQ SECTION: SEO-Optimized Accordions
        ========================================================================= */}
        <section className="space-y-6">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Frequently Answered
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Conversion FAQs &amp; Measurement Standards
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Floating Feedback Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-blue-400 dark:text-blue-600 text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
