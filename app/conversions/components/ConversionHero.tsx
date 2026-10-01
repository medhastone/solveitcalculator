'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface ConversionHeroProps {
  onSelectQuery?: (query: string) => void;
  onSelectPair?: (categoryId: string, fromId: string, toId: string, value?: number) => void;
}

export default function ConversionHero({ onSelectPair }: ConversionHeroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Natural query suggestions database
  const searchSuggestions = useMemo(() => {
    const raw = searchTerm.trim().toLowerCase();
    if (!raw) return [];

    const candidates = [
      { text: '10 cm to inches', cat: 'length', from: 'cm', to: 'in', val: 10, label: 'Centimeters → Inches' },
      { text: 'inches to cm', cat: 'length', from: 'in', to: 'cm', val: 1, label: 'Inches → Centimeters' },
      { text: '100 kg to lbs', cat: 'weight', from: 'kg', to: 'lb', val: 100, label: 'Kilograms → Pounds' },
      { text: 'lbs to kg', cat: 'weight', from: 'lb', to: 'kg', val: 150, label: 'Pounds → Kilograms' },
      { text: '72°F to °C', cat: 'temperature', from: 'f', to: 'c', val: 72, label: 'Fahrenheit → Celsius' },
      { text: 'celsius to fahrenheit', cat: 'temperature', from: 'c', to: 'f', val: 20, label: 'Celsius → Fahrenheit' },
      { text: 'meters to feet', cat: 'length', from: 'm', to: 'ft', val: 1.8, label: 'Meters → Feet' },
      { text: 'feet to meters', cat: 'length', from: 'ft', to: 'm', val: 10, label: 'Feet → Meters' },
      { text: 'miles to km', cat: 'length', from: 'mi', to: 'km', val: 60, label: 'Miles → Kilometers' },
      { text: 'km to miles', cat: 'length', from: 'km', to: 'mi', val: 100, label: 'Kilometers → Miles' },
      { text: 'liters to gallons', cat: 'volume', from: 'l', to: 'gal', val: 10, label: 'Liters → US Gallons' },
      { text: 'gallons to liters', cat: 'volume', from: 'gal', to: 'l', val: 5, label: 'US Gallons → Liters' },
      { text: '65 mph to km/h', cat: 'speed', from: 'mph', to: 'kmh', val: 65, label: 'Miles/hr → Kilometers/hr' },
      { text: 'km/h to mph', cat: 'speed', from: 'kmh', to: 'mph', val: 100, label: 'Kilometers/hr → Miles/hr' },
      { text: '25 mbps to mb/s', cat: 'data_transfer', from: 'mbps', to: 'mbs', val: 25, label: 'Megabits/sec → Megabytes/sec' },
      { text: 'psi to bar', cat: 'pressure', from: 'psi', to: 'bar', val: 32, label: 'PSI → Bar' },
      { text: 'bar to psi', cat: 'pressure', from: 'bar', to: 'psi', val: 2.2, label: 'Bar → PSI' },
      { text: 'kw to hp', cat: 'power', from: 'kw', to: 'hp', val: 150, label: 'Kilowatts → Horsepower' },
      { text: 'hp to kw', cat: 'power', from: 'hp', to: 'kw', val: 200, label: 'Horsepower → Kilowatts' },
      { text: 'cups to ml', cat: 'cooking', from: 'cup', to: 'ml', val: 1, label: 'US Cups → Milliliters' },
      { text: 'mb to mib', cat: 'data_storage', from: 'mb', to: 'mib', val: 1000, label: 'Megabytes (SI) → Mebibytes (IEC)' },
    ];

    return candidates.filter((item) => {
      return (
        item.text.toLowerCase().includes(raw) ||
        item.label.toLowerCase().includes(raw) ||
        item.from.toLowerCase() === raw ||
        item.to.toLowerCase() === raw
      );
    }).slice(0, 6);
  }, [searchTerm]);

  const handleSuggestionClick = (item: { cat: string; from: string; to: string; val?: number }) => {
    if (onSelectPair) {
      onSelectPair(item.cat, item.from, item.to, item.val);
    }
    setSearchTerm('');
    setIsFocused(false);
  };

  const quickPills = [
    { label: '10 cm to inches', cat: 'length', from: 'cm', to: 'in', val: 10 },
    { label: '70 kg to lbs', cat: 'weight', from: 'kg', to: 'lb', val: 70 },
    { label: '20°C to °F', cat: 'temperature', from: 'c', to: 'f', val: 20 },
    { label: '65 mph to km/h', cat: 'speed', from: 'mph', to: 'kmh', val: 65 },
    { label: '32 PSI to bar', cat: 'pressure', from: 'psi', to: 'bar', val: 32 },
    { label: '25 Mbps to MB/s', cat: 'data_transfer', from: 'mbps', to: 'mbs', val: 25 },
  ];

  return (
    <section className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/15">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Home</span>
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-semibold">Conversions</span>
        </nav>

        {/* Primary Page Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            <span>Universal Measurement Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            Unit Converter for Length, Weight, Temperature &amp; More
          </h1>

          <p className="text-base sm:text-lg font-medium text-primary">
            Convert Any Unit. Understand the Result.
          </p>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            Convert measurements across metric, imperial, US customary, scientific, engineering, cooking, data, and other supported units. See exact mathematical factors, step-by-step conversion formulas, and reference tables.
          </p>
        </div>

        {/* Universal Unit Search */}
        <div className="relative max-w-3xl">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-xl pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Try “10 cm to inches”, “100 kg to lbs”, “72°F to °C”, or “25 Mbps to MB/s”"
              className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface text-sm sm:text-base placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs"
              aria-label="Search unit conversions"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1 rounded-md"
                aria-label="Clear search input"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Autocomplete / Suggestions Dropdown */}
          {isFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-outline-variant/30 rounded-xl shadow-xl z-30 overflow-hidden divide-y divide-outline-variant/10">
              {searchSuggestions.map((item) => (
                <button
                  key={item.text}
                  type="button"
                  onMouseDown={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-base">
                      arrow_forward
                    </span>
                    <div>
                      <div className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                        {item.text}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {item.label}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary px-2.5 py-1 rounded bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                    Convert
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Query Pills */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-on-surface-variant mr-1">
              Popular searches:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleSuggestionClick(pill)}
                className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/25 text-xs text-on-surface hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
