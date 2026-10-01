'use client';

import React from 'react';
import Link from 'next/link';

export default function SpecificConversionDirectory() {
  const directPairs = [
    { label: 'cm to inches', path: '/conversion/cm-to-in', desc: 'Centimeters to Inches' },
    { label: 'inches to cm', path: '/conversion/in-to-cm', desc: 'Inches to Centimeters' },
    { label: 'kg to lbs', path: '/conversion/kg-to-lb', desc: 'Kilograms to Pounds' },
    { label: 'lbs to kg', path: '/conversion/lb-to-kg', desc: 'Pounds to Kilograms' },
    { label: 'celsius to fahrenheit', path: '/conversion/c-to-f', desc: 'Celsius to Fahrenheit' },
    { label: 'fahrenheit to celsius', path: '/conversion/f-to-c', desc: 'Fahrenheit to Celsius' },
    { label: 'meters to feet', path: '/conversion/m-to-ft', desc: 'Meters to Feet' },
    { label: 'feet to meters', path: '/conversion/ft-to-m', desc: 'Feet to Meters' },
    { label: 'miles to km', path: '/conversion/mi-to-km', desc: 'Miles to Kilometers' },
    { label: 'km to miles', path: '/conversion/km-to-mi', desc: 'Kilometers to Miles' },
    { label: 'liters to gallons', path: '/conversion/l-to-gal', desc: 'Liters to US Gallons' },
    { label: 'gallons to liters', path: '/conversion/gal-to-l', desc: 'US Gallons to Liters' },
    { label: 'mph to km/h', path: '/conversion/mph-to-kmh', desc: 'Miles per hour to KM/H' },
    { label: 'km/h to mph', path: '/conversion/kmh-to-mph', desc: 'Kilometers per hour to MPH' },
    { label: 'grams to ounces', path: '/conversion/g-to-oz', desc: 'Grams to Ounces' },
    { label: 'ounces to grams', path: '/conversion/oz-to-g', desc: 'Ounces to Grams' },
  ];

  const fullCategoryConverters = [
    { name: 'Length Converter', path: '/length-converter' },
    { name: 'Weight & Mass Converter', path: '/weight-mass-converter' },
    { name: 'Temperature Converter', path: '/temperature-converter' },
    { name: 'Volume Converter', path: '/volume-converter' },
    { name: 'Area Converter', path: '/area-converter' },
    { name: 'Speed Converter', path: '/speed-converter' },
    { name: 'Time Converter', path: '/time-converter' },
    { name: 'Pressure Converter', path: '/pressure-converter' },
    { name: 'Energy Converter', path: '/energy-converter' },
    { name: 'Power Converter', path: '/power-converter' },
    { name: 'Torque Converter', path: '/torque-converter' },
    { name: 'Frequency Converter', path: '/frequency-converter' },
    { name: 'Fuel Economy Converter', path: '/fuel-economy-converter' },
    { name: 'Data Storage Converter', path: '/data-storage-converter' },
    { name: 'Data Transfer Rate Converter', path: '/data-transfer-rate-converter' },
    { name: 'Electrical Converter', path: '/electrical-converter' },
    { name: 'Cooking Converter', path: '/cooking-converter' },
    { name: 'Engineering Converter', path: '/engineering-converter' },
    { name: 'Scientific Converter', path: '/scientific-converter' },
    { name: 'Number Systems Converter', path: '/number-systems-converter' },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Specific Pairs */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              Looking for a Specific Conversion?
            </h2>
            <p className="text-xs text-on-surface-variant">
              Direct access to dedicated conversion pages with step-by-step formulas, quick calculators, and reference tables.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
            {directPairs.map((p) => (
              <Link
                key={p.path}
                href={p.path}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container transition-all flex flex-col justify-between"
              >
                <span className="font-bold text-xs text-on-surface hover:text-primary">
                  {p.label}
                </span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">
                  {p.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* All Standalone Category Tools */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/15">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-bold text-on-surface">
              All 20 Measurement Discipline Calculators
            </h3>
            <span className="text-xs text-on-surface-variant">
              Full standalone tools with extended unit tables
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            {fullCategoryConverters.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 hover:border-primary/40 text-xs font-semibold text-on-surface hover:text-primary transition-colors flex items-center justify-between"
              >
                <span className="truncate">{tool.name.replace(' Converter', '')}</span>
                <span className="material-symbols-outlined text-xs shrink-0 text-on-surface-variant">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
