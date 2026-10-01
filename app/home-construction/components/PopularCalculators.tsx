'use client';

import React, { useState, useMemo } from 'react';
import { PopularCalcId, UnitSystem } from './types';

interface PopularCalculatorsProps {
  activeCalc: PopularCalcId;
  onSelectCalc: (calcId: PopularCalcId) => void;
  unitSystem: UnitSystem;
  onUnitChange: (unit: UnitSystem) => void;
}

export default function PopularCalculators({
  activeCalc,
  onSelectCalc,
  unitSystem,
  onUnitChange,
}: PopularCalculatorsProps) {
  // Global / Configurable Inputs
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [includeLabor, setIncludeLabor] = useState<boolean>(false);
  const [laborCostPerUnit, setLaborCostPerUnit] = useState<number>(25);

  // 1. Concrete State
  const [concLength, setConcLength] = useState<number>(24);
  const [concWidth, setConcWidth] = useState<number>(16);
  const [concDepthInches, setConcDepthInches] = useState<number>(4);
  const [concPricePerYard, setConcPricePerYard] = useState<number>(145);
  const [concBagType, setConcBagType] = useState<number>(80); // 80lb, 60lb, 50lb

  // 2. Roofing State
  const [roofFootprintSqFt, setRoofFootprintSqFt] = useState<number>(1800);
  const [roofPitch, setRoofPitch] = useState<number>(6); // 6/12 pitch
  const [shinglePricePerBundle, setShinglePricePerBundle] = useState<number>(36);

  // 3. Flooring & Tile State
  const [floorLength, setFloorLength] = useState<number>(16);
  const [floorWidth, setFloorWidth] = useState<number>(14);
  const [cartonCoverage, setCartonCoverage] = useState<number>(20);
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(3.5);

  // 4. Paint State
  const [paintPerimeter, setPaintPerimeter] = useState<number>(56);
  const [paintWallHeight, setPaintWallHeight] = useState<number>(9);
  const [paintDoors, setPaintDoors] = useState<number>(2);
  const [paintWindows, setPaintWindows] = useState<number>(3);
  const [paintCoats, setPaintCoats] = useState<number>(2);
  const [paintCoveragePerGal, setPaintCoveragePerGal] = useState<number>(350);
  const [paintPricePerGal, setPaintPricePerGal] = useState<number>(45);

  // 5. Drywall State
  const [drywallPerimeter, setDrywallPerimeter] = useState<number>(56);
  const [drywallHeight, setDrywallHeight] = useState<number>(9);
  const [drywallIncludeCeiling, setDrywallIncludeCeiling] = useState<boolean>(true);
  const [drywallSheetSize, setDrywallSheetSize] = useState<'4x8' | '4x12'>('4x8');
  const [drywallPricePerSheet, setDrywallPricePerSheet] = useState<number>(16);

  // 6. Lumber State
  const [lumberWallLength, setLumberWallLength] = useState<number>(48);
  const [lumberStudSpacing, setLumberStudSpacing] = useState<16 | 24>(16);
  const [lumberStudPrice, setLumberStudPrice] = useState<number>(5.5);

  // 7. Deck State
  const [deckLength, setDeckLength] = useState<number>(20);
  const [deckWidth, setDeckWidth] = useState<number>(12);
  const [deckBoardType, setDeckBoardType] = useState<number>(5.5); // 5.5 inches wide
  const [deckPricePerSqFt, setDeckPricePerSqFt] = useState<number>(8.5);

  // 8. Fence State
  const [fenceLength, setFenceLength] = useState<number>(120);
  const [fencePostSpacing, setFencePostSpacing] = useState<number>(8); // 8ft bays
  const [fencePicketWidth, setFencePicketWidth] = useState<number>(5.5); // 5.5" pickets
  const [fencePicketGap, setFencePicketGap] = useState<number>(0.25);
  const [fenceCostPerFoot, setFenceCostPerFoot] = useState<number>(18);

  // 9. Gravel State
  const [gravelLength, setGravelLength] = useState<number>(30);
  const [gravelWidth, setGravelWidth] = useState<number>(10);
  const [gravelDepthInches, setGravelDepthInches] = useState<number>(3);
  const [gravelPricePerTon, setGravelPricePerTon] = useState<number>(48);

  // 10. Mulch State
  const [mulchLength, setMulchLength] = useState<number>(40);
  const [mulchWidth, setMulchWidth] = useState<number>(8);
  const [mulchDepthInches, setMulchDepthInches] = useState<number>(3);
  const [mulchPricePerYard, setMulchPricePerYard] = useState<number>(38);

  // CALCULATIONS
  const wasteMultiplier = 1 + wastePercent / 100;

  // 1. Concrete Calc
  const concreteCalc = useMemo(() => {
    const depthFt = concDepthInches / 12;
    const cuFt = concLength * concWidth * depthFt;
    const cuYardsNet = cuFt / 27;
    const cuYardsGross = cuYardsNet * wasteMultiplier;
    const cuMetersGross = cuYardsGross * 0.764555;
    const bagFactor = concBagType === 80 ? 0.60 : concBagType === 60 ? 0.45 : 0.375;
    const bagsTotal = Math.ceil((cuYardsGross * 27) / bagFactor);
    const materialCost = cuYardsGross * concPricePerYard;
    const laborCost = includeLabor ? concLength * concWidth * (laborCostPerUnit / 10) : 0;
    return {
      cuYardsGross: cuYardsGross.toFixed(2),
      cuMetersGross: cuMetersGross.toFixed(2),
      bagsTotal,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [concLength, concWidth, concDepthInches, concPricePerYard, concBagType, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 2. Roofing Calc
  const roofingCalc = useMemo(() => {
    const pitchMultiplier = Math.sqrt(1 + Math.pow(roofPitch / 12, 2));
    const trueSurfaceSqFt = roofFootprintSqFt * pitchMultiplier;
    const grossSqFt = trueSurfaceSqFt * wasteMultiplier;
    const squares = Math.ceil(grossSqFt / 100);
    const bundles = squares * 3;
    const materialCost = bundles * shinglePricePerBundle;
    const laborCost = includeLabor ? squares * (laborCostPerUnit * 3) : 0;
    return {
      pitchMultiplier: pitchMultiplier.toFixed(3),
      grossSqFt: Math.round(grossSqFt),
      squares,
      bundles,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [roofFootprintSqFt, roofPitch, shinglePricePerBundle, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 3. Flooring Calc
  const flooringCalc = useMemo(() => {
    const netSqFt = floorLength * floorWidth;
    const grossSqFt = netSqFt * wasteMultiplier;
    const cartons = Math.ceil(grossSqFt / cartonCoverage);
    const materialCost = grossSqFt * pricePerSqFt;
    const laborCost = includeLabor ? grossSqFt * (laborCostPerUnit / 10) : 0;
    return {
      netSqFt,
      grossSqFt: Math.round(grossSqFt),
      cartons,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [floorLength, floorWidth, cartonCoverage, pricePerSqFt, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 4. Paint Calc
  const paintCalc = useMemo(() => {
    const grossWallArea = paintPerimeter * paintWallHeight;
    const deductions = paintDoors * 21 + paintWindows * 15;
    const netWallArea = Math.max(0, grossWallArea - deductions);
    const totalSqFtToCover = netWallArea * paintCoats;
    const gallonsNeeded = Math.ceil((totalSqFtToCover * wasteMultiplier) / paintCoveragePerGal);
    const materialCost = gallonsNeeded * paintPricePerGal;
    const laborCost = includeLabor ? totalSqFtToCover * (laborCostPerUnit / 20) : 0;
    return {
      netWallArea: Math.round(netWallArea),
      totalSqFtToCover: Math.round(totalSqFtToCover),
      gallonsNeeded,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [paintPerimeter, paintWallHeight, paintDoors, paintWindows, paintCoats, paintCoveragePerGal, paintPricePerGal, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 5. Drywall Calc
  const drywallCalc = useMemo(() => {
    const wallArea = drywallPerimeter * drywallHeight;
    const ceilingArea = drywallIncludeCeiling ? Math.pow(drywallPerimeter / 4, 2) : 0;
    const totalArea = (wallArea + ceilingArea) * wasteMultiplier;
    const sheetSqFt = drywallSheetSize === '4x8' ? 32 : 48;
    const sheets = Math.ceil(totalArea / sheetSqFt);
    const mudBuckets = Math.ceil(sheets / 8);
    const screwsCount = sheets * 32;
    const materialCost = sheets * drywallPricePerSheet + mudBuckets * 18;
    const laborCost = includeLabor ? sheets * (laborCostPerUnit / 2) : 0;
    return {
      totalArea: Math.round(totalArea),
      sheets,
      mudBuckets,
      screwsCount,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [drywallPerimeter, drywallHeight, drywallIncludeCeiling, drywallSheetSize, drywallPricePerSheet, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 6. Lumber Calc
  const lumberCalc = useMemo(() => {
    const baseStuds = Math.ceil((lumberWallLength * 12) / lumberStudSpacing);
    const totalStuds = Math.ceil((baseStuds + 4) * wasteMultiplier); // +4 for corners & plates
    const platesLinearFt = lumberWallLength * 3; // 2 top plates + 1 sole plate
    const materialCost = totalStuds * lumberStudPrice + (platesLinearFt / 8) * (lumberStudPrice * 1.1);
    const laborCost = includeLabor ? lumberWallLength * laborCostPerUnit : 0;
    return {
      totalStuds,
      platesLinearFt: Math.round(platesLinearFt),
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [lumberWallLength, lumberStudSpacing, lumberStudPrice, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 7. Deck Calc
  const deckCalc = useMemo(() => {
    const sqFt = deckLength * deckWidth;
    const boardWidthFt = deckBoardType / 12;
    const linearFtBoards = Math.ceil((sqFt / boardWidthFt) * wasteMultiplier);
    const joistsCount = Math.ceil((deckLength * 12) / 16) + 1;
    const pierCount = Math.ceil((deckLength / 6) + 1) * Math.ceil((deckWidth / 8) + 1);
    const materialCost = sqFt * deckPricePerSqFt * wasteMultiplier;
    const laborCost = includeLabor ? sqFt * (laborCostPerUnit / 2) : 0;
    return {
      sqFt,
      linearFtBoards,
      joistsCount,
      pierCount,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [deckLength, deckWidth, deckBoardType, deckPricePerSqFt, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 8. Fence Calc
  const fenceCalc = useMemo(() => {
    const postCount = Math.ceil(fenceLength / fencePostSpacing) + 1;
    const railsCount = Math.ceil((fenceLength / fencePostSpacing) * 3); // 3 rails per bay
    const picketCoverageInches = fencePicketWidth + fencePicketGap;
    const picketsCount = Math.ceil(((fenceLength * 12) / picketCoverageInches) * wasteMultiplier);
    const concreteBags = postCount * 2; // 2 bags per post
    const materialCost = fenceLength * fenceCostPerFoot * wasteMultiplier;
    const laborCost = includeLabor ? fenceLength * laborCostPerUnit : 0;
    return {
      postCount,
      railsCount,
      picketsCount,
      concreteBags,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [fenceLength, fencePostSpacing, fencePicketWidth, fencePicketGap, fenceCostPerFoot, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 9. Gravel Calc
  const gravelCalc = useMemo(() => {
    const cuFt = gravelLength * gravelWidth * (gravelDepthInches / 12);
    const cuYards = (cuFt / 27) * wasteMultiplier;
    const tons = cuYards * 1.4; // 1.4 tons per cu yd standard
    const materialCost = tons * gravelPricePerTon;
    const laborCost = includeLabor ? tons * laborCostPerUnit : 0;
    return {
      cuYards: cuYards.toFixed(2),
      tons: tons.toFixed(2),
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [gravelLength, gravelWidth, gravelDepthInches, gravelPricePerTon, wasteMultiplier, includeLabor, laborCostPerUnit]);

  // 10. Mulch Calc
  const mulchCalc = useMemo(() => {
    const cuFt = mulchLength * mulchWidth * (mulchDepthInches / 12);
    const cuYards = (cuFt / 27) * wasteMultiplier;
    const bags2CuFt = Math.ceil((cuYards * 27) / 2);
    const materialCost = cuYards * mulchPricePerYard;
    const laborCost = includeLabor ? cuYards * laborCostPerUnit : 0;
    return {
      cuYards: cuYards.toFixed(2),
      bags2CuFt,
      materialCost: Math.round(materialCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(materialCost + laborCost),
    };
  }, [mulchLength, mulchWidth, mulchDepthInches, mulchPricePerYard, wasteMultiplier, includeLabor, laborCostPerUnit]);

  const CALC_TABS: { id: PopularCalcId; name: string; icon: string }[] = [
    { id: 'concrete', name: 'Concrete', icon: 'view_in_ar' },
    { id: 'roofing', name: 'Roofing', icon: 'roofing' },
    { id: 'flooring', name: 'Flooring', icon: 'grid_view' },
    { id: 'paint', name: 'Paint', icon: 'format_paint' },
    { id: 'drywall', name: 'Drywall', icon: 'dashboard_customize' },
    { id: 'lumber', name: 'Lumber', icon: 'carpenter' },
    { id: 'deck', name: 'Deck', icon: 'deck' },
    { id: 'fence', name: 'Fence', icon: 'fence' },
    { id: 'gravel', name: 'Gravel', icon: 'layers' },
    { id: 'mulch', name: 'Mulch', icon: 'yard' },
  ];

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Interactive Estimator Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Popular Construction Calculators
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant max-w-2xl">
              Configurable trade estimators with dynamic waste factors, packaging roundups, and instant bill-of-materials.
            </p>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/30 text-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => onUnitChange('us')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                unitSystem === 'us'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              US Customary (ft, in, yd³)
            </button>
            <button
              type="button"
              onClick={() => onUnitChange('metric')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                unitSystem === 'metric'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Metric (m, cm, m³)
            </button>
          </div>
        </div>

        {/* Calculator Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 pb-3 no-scrollbar mb-8">
          {CALC_TABS.map(tab => {
            const isActive = activeCalc === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectCalc(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Global Config Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-on-surface">Jobsite Waste Buffer:</span>
              <div className="flex items-center gap-1.5">
                {[5, 10, 15, 20].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setWastePercent(pct)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      wastePercent === pct
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    +{pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={wastePercent}
                onChange={e => setWastePercent(Number(e.target.value))}
                className="w-24 accent-primary"
              />
              <span className="text-xs font-mono font-bold text-primary">{wastePercent}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLabor}
                onChange={e => setIncludeLabor(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
              />
              <span>Include Estimated Labor</span>
            </label>
            {includeLabor && (
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-on-surface-variant">$</span>
                <input
                  type="number"
                  value={laborCostPerUnit}
                  onChange={e => setLaborCostPerUnit(Math.max(0, Number(e.target.value)))}
                  className="w-16 px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-center"
                />
                <span className="text-on-surface-variant">/trade unit</span>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE CALCULATOR WORKBENCH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* INPUT FORM (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm">
            {activeCalc === 'concrete' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">view_in_ar</span>
                    <span>Concrete Slab &amp; Footing Volume</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate cubic yards, metric cubic meters, and 80lb/60lb premix bags with spillage allowance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Length (ft)</label>
                    <input
                      type="number"
                      value={concLength}
                      onChange={e => setConcLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Width (ft)</label>
                    <input
                      type="number"
                      value={concWidth}
                      onChange={e => setConcWidth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Thickness (in)</label>
                    <input
                      type="number"
                      value={concDepthInches}
                      onChange={e => setConcDepthInches(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Pre-Mix Bag Size</label>
                    <select
                      value={concBagType}
                      onChange={e => setConcBagType(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={80}>80 lb Bag (0.60 cu ft yield)</option>
                      <option value={60}>60 lb Bag (0.45 cu ft yield)</option>
                      <option value={50}>50 lb Bag (0.375 cu ft yield)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Ready-Mix $/yd³</label>
                    <input
                      type="number"
                      value={concPricePerYard}
                      onChange={e => setConcPricePerYard(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'roofing' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">roofing</span>
                    <span>Roofing Pitch &amp; Shingle Squares</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Converts flat footprint to true pitched surface area, 100 sq ft squares, and 3-bundle packs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Ground Footprint Area (sq ft)</label>
                    <input
                      type="number"
                      value={roofFootprintSqFt}
                      onChange={e => setRoofFootprintSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Roof Pitch (/12 slope)</label>
                    <select
                      value={roofPitch}
                      onChange={e => setRoofPitch(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={3}>3/12 Pitch (Low Slope - 1.031x)</option>
                      <option value={4}>4/12 Pitch (Standard - 1.054x)</option>
                      <option value={6}>6/12 Pitch (Medium - 1.118x)</option>
                      <option value={8}>8/12 Pitch (Steep - 1.202x)</option>
                      <option value={10}>10/12 Pitch (High Steep - 1.302x)</option>
                      <option value={12}>12/12 Pitch (45° Angle - 1.414x)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">Price Per Shingle Bundle ($)</label>
                  <input
                    type="number"
                    value={shinglePricePerBundle}
                    onChange={e => setShinglePricePerBundle(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            )}

            {activeCalc === 'flooring' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">grid_view</span>
                    <span>Flooring &amp; Tile Material Sizer</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate square footage, carton counts for LVP/tile/hardwood, and perimeter trim.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Room Length (ft)</label>
                    <input
                      type="number"
                      value={floorLength}
                      onChange={e => setFloorLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Room Width (ft)</label>
                    <input
                      type="number"
                      value={floorWidth}
                      onChange={e => setFloorWidth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Carton Coverage (sq ft/box)</label>
                    <input
                      type="number"
                      value={cartonCoverage}
                      onChange={e => setCartonCoverage(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Price Per Sq Ft ($)</label>
                    <input
                      type="number"
                      value={pricePerSqFt}
                      onChange={e => setPricePerSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'paint' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">format_paint</span>
                    <span>Interior Room Paint Gallons</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Deducts doors and windows to calculate net wall area, coats, and paint gallons.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Total Room Perimeter (ft)</label>
                    <input
                      type="number"
                      value={paintPerimeter}
                      onChange={e => setPaintPerimeter(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Wall Height (ft)</label>
                    <input
                      type="number"
                      value={paintWallHeight}
                      onChange={e => setPaintWallHeight(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Doors (-21 sq ft)</label>
                    <input
                      type="number"
                      value={paintDoors}
                      onChange={e => setPaintDoors(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Windows (-15 sq ft)</label>
                    <input
                      type="number"
                      value={paintWindows}
                      onChange={e => setPaintWindows(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Coats</label>
                    <input
                      type="number"
                      value={paintCoats}
                      onChange={e => setPaintCoats(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'drywall' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">dashboard_customize</span>
                    <span>Drywall Gypsum Panel Estimator</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate sheets, joint compound mud buckets, and fastener requirements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Room Perimeter (ft)</label>
                    <input
                      type="number"
                      value={drywallPerimeter}
                      onChange={e => setDrywallPerimeter(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Wall Height (ft)</label>
                    <input
                      type="number"
                      value={drywallHeight}
                      onChange={e => setDrywallHeight(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Sheet Dimensions</label>
                    <select
                      value={drywallSheetSize}
                      onChange={e => setDrywallSheetSize(e.target.value as '4x8' | '4x12')}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="4x8">4×8 Sheet (32 sq ft)</option>
                      <option value="4x12">4×12 Sheet (48 sq ft)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                      <input
                        type="checkbox"
                        checked={drywallIncludeCeiling}
                        onChange={e => setDrywallIncludeCeiling(e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                      />
                      <span>Include Ceiling Drywall</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'lumber' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">carpenter</span>
                    <span>Framing Studs &amp; Wall Lumber</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate studs, corner posts, and double top &amp; sole plates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Total Wall Length (ft)</label>
                    <input
                      type="number"
                      value={lumberWallLength}
                      onChange={e => setLumberWallLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Stud Spacing On-Center</label>
                    <select
                      value={lumberStudSpacing}
                      onChange={e => setLumberStudSpacing(Number(e.target.value) as 16 | 24)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={16}>16&quot; On-Center (Standard Load Bearing)</option>
                      <option value={24}>24&quot; On-Center (Non-Bearing / Advanced Framing)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'deck' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">deck</span>
                    <span>Deck Boards &amp; Framing Sizer</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Estimate 5/4×6 decking boards, joists, pier footings, and hardware.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Deck Length (ft)</label>
                    <input
                      type="number"
                      value={deckLength}
                      onChange={e => setDeckLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Deck Width / Projection (ft)</label>
                    <input
                      type="number"
                      value={deckWidth}
                      onChange={e => setDeckWidth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'fence' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">fence</span>
                    <span>Fence Posts, Rails &amp; Pickets</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate posts, horizontal rails, pickets, and post hole concrete bags.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Total Fence Run (ft)</label>
                    <input
                      type="number"
                      value={fenceLength}
                      onChange={e => setFenceLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Post Spacing (ft)</label>
                    <select
                      value={fencePostSpacing}
                      onChange={e => setFencePostSpacing(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={8}>8 ft Bay (Standard)</option>
                      <option value={6}>6 ft Bay (Heavy Wind Areas)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'gravel' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">layers</span>
                    <span>Crushed Stone &amp; Gravel Tonnage</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculates cubic yardage and delivery weight in tons (1.4 tons/yd³).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Length (ft)</label>
                    <input
                      type="number"
                      value={gravelLength}
                      onChange={e => setGravelLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Width (ft)</label>
                    <input
                      type="number"
                      value={gravelWidth}
                      onChange={e => setGravelWidth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Depth (in)</label>
                    <input
                      type="number"
                      value={gravelDepthInches}
                      onChange={e => setGravelDepthInches(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCalc === 'mulch' && (
              <div className="space-y-6">
                <div className="border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">yard</span>
                    <span>Mulch &amp; Garden Bed Topsoil</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate bulk cubic yards and 2 cu ft packaged bags for garden beds.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Bed Length (ft)</label>
                    <input
                      type="number"
                      value={mulchLength}
                      onChange={e => setMulchLength(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Bed Width (ft)</label>
                    <input
                      type="number"
                      value={mulchWidth}
                      onChange={e => setMulchWidth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Layer Depth (in)</label>
                    <input
                      type="number"
                      value={mulchDepthInches}
                      onChange={e => setMulchDepthInches(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OUTPUT & BILL OF MATERIALS (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Takeoff Results</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    +{wastePercent}% Buffer
                  </span>
                </div>

                {/* DYNAMIC OUTPUTS PER ACTIVE CALC */}
                {activeCalc === 'concrete' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Total Volume (Ready-Mix)</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {concreteCalc.cuYardsGross} <span className="text-base text-on-surface font-sans">cu yards</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        ≈ {concreteCalc.cuMetersGross} m³
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant block">If Using Bagged Concrete:</span>
                        <strong className="text-xl font-bold text-on-surface font-mono">{concreteCalc.bagsTotal} Bags</strong>
                      </div>
                      <span className="text-xs text-on-surface-variant font-mono">({concBagType} lb bags)</span>
                    </div>
                  </div>
                )}

                {activeCalc === 'roofing' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Total Roofing Squares (100 sq ft)</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {roofingCalc.squares} <span className="text-base text-on-surface font-sans">Squares</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Gross Area: {roofingCalc.grossSqFt} sq ft (Pitch Mult: {roofingCalc.pitchMultiplier})
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant block">Shingle Bundles Required:</span>
                        <strong className="text-xl font-bold text-on-surface font-mono">{roofingCalc.bundles} Bundles</strong>
                      </div>
                      <span className="text-xs text-on-surface-variant font-mono">(3 bundles / sq)</span>
                    </div>
                  </div>
                )}

                {activeCalc === 'flooring' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Gross Surface Area</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {flooringCalc.grossSqFt} <span className="text-base text-on-surface font-sans">sq ft</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Net Room Footprint: {flooringCalc.netSqFt} sq ft
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant block">Cartons to Order:</span>
                        <strong className="text-xl font-bold text-on-surface font-mono">{flooringCalc.cartons} Boxes</strong>
                      </div>
                      <span className="text-xs text-on-surface-variant font-mono">({cartonCoverage} sq ft/box)</span>
                    </div>
                  </div>
                )}

                {activeCalc === 'paint' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Total Paint Required</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {paintCalc.gallonsNeeded} <span className="text-base text-on-surface font-sans">Gallons</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Total Coverage: {paintCalc.totalSqFtToCover} sq ft ({paintCoats} coats)
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block">Net Wall Area (Deductions Applied):</span>
                      <strong className="text-base font-bold text-on-surface font-mono">{paintCalc.netWallArea} sq ft</strong>
                    </div>
                  </div>
                )}

                {activeCalc === 'drywall' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Gypsum Panels to Order</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {drywallCalc.sheets} <span className="text-base text-on-surface font-sans">Sheets</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Size: {drywallSheetSize} ({drywallSheetSize === '4x8' ? '32' : '48'} sq ft/sheet)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-on-surface-variant block">Joint Mud:</span>
                        <strong className="text-sm font-bold text-on-surface">{drywallCalc.mudBuckets} Buckets</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-on-surface-variant block">Screws:</span>
                        <strong className="text-sm font-bold text-on-surface">≈ {drywallCalc.screwsCount} pcs</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeCalc === 'lumber' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Wall Studs Needed</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {lumberCalc.totalStuds} <span className="text-base text-on-surface font-sans">Studs</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Includes corner posts &amp; {wastePercent}% cutoff scrap
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-on-surface-variant block">Plates Linear Run:</span>
                        <strong className="text-base font-bold text-on-surface font-mono">{lumberCalc.platesLinearFt} lin ft</strong>
                      </div>
                      <span className="text-xs text-on-surface-variant">(2 top, 1 sole)</span>
                    </div>
                  </div>
                )}

                {activeCalc === 'deck' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Decking Boards Linear Footage</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {deckCalc.linearFtBoards} <span className="text-base text-on-surface font-sans">lin ft</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Footprint: {deckCalc.sqFt} sq ft
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-on-surface-variant block">Joists (16&quot; OC):</span>
                        <strong className="text-sm font-bold text-on-surface">{deckCalc.joistsCount} joists</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-on-surface-variant block">Pier Footings:</span>
                        <strong className="text-sm font-bold text-on-surface">{deckCalc.pierCount} piers</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeCalc === 'fence' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Privacy Pickets Needed</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {fenceCalc.picketsCount} <span className="text-base text-on-surface font-sans">Pickets</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Based on {fencePicketWidth}&quot; pickets &amp; {fencePicketGap}&quot; spacing
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
                        <span className="text-on-surface-variant block text-[11px]">Posts</span>
                        <strong className="text-sm font-bold text-on-surface">{fenceCalc.postCount}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
                        <span className="text-on-surface-variant block text-[11px]">2×4 Rails</span>
                        <strong className="text-sm font-bold text-on-surface">{fenceCalc.railsCount}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
                        <span className="text-on-surface-variant block text-[11px]">Concrete Bags</span>
                        <strong className="text-sm font-bold text-on-surface">{fenceCalc.concreteBags}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeCalc === 'gravel' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Estimated Tonnage</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {gravelCalc.tons} <span className="text-base text-on-surface font-sans">Tons</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        Volume: {gravelCalc.cuYards} cu yards (1.4 tons/yd³ density)
                      </span>
                    </div>
                  </div>
                )}

                {activeCalc === 'mulch' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-xs text-on-surface-variant block mb-1">Bulk Volume Needed</span>
                      <div className="text-3xl font-extrabold text-primary font-mono">
                        {mulchCalc.cuYards} <span className="text-base text-on-surface font-sans">cu yards</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">
                        If buying bagged: ≈ {mulchCalc.bags2CuFt} bags (2 cu ft bags)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ESTIMATE FINANCIAL SUMMARY */}
              <div className="mt-6 pt-5 border-t border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                  <span>Materials Subtotal:</span>
                  <span className="font-mono text-on-surface font-semibold">
                    ${activeCalc === 'concrete' ? concreteCalc.materialCost :
                      activeCalc === 'roofing' ? roofingCalc.materialCost :
                      activeCalc === 'flooring' ? flooringCalc.materialCost :
                      activeCalc === 'paint' ? paintCalc.materialCost :
                      activeCalc === 'drywall' ? drywallCalc.materialCost :
                      activeCalc === 'lumber' ? lumberCalc.materialCost :
                      activeCalc === 'deck' ? deckCalc.materialCost :
                      activeCalc === 'fence' ? fenceCalc.materialCost :
                      activeCalc === 'gravel' ? gravelCalc.materialCost :
                      mulchCalc.materialCost}
                  </span>
                </div>
                {includeLabor && (
                  <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                    <span>Labor Allowance:</span>
                    <span className="font-mono text-on-surface font-semibold">
                      +${activeCalc === 'concrete' ? concreteCalc.laborCost :
                        activeCalc === 'roofing' ? roofingCalc.laborCost :
                        activeCalc === 'flooring' ? flooringCalc.laborCost :
                        activeCalc === 'paint' ? paintCalc.laborCost :
                        activeCalc === 'drywall' ? drywallCalc.laborCost :
                        activeCalc === 'lumber' ? lumberCalc.laborCost :
                        activeCalc === 'deck' ? deckCalc.laborCost :
                        activeCalc === 'fence' ? fenceCalc.laborCost :
                        activeCalc === 'gravel' ? gravelCalc.laborCost :
                        mulchCalc.laborCost}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/15">
                  <span>Total Project Estimate:</span>
                  <span className="font-mono text-primary text-lg">
                    ${activeCalc === 'concrete' ? concreteCalc.totalCost :
                      activeCalc === 'roofing' ? roofingCalc.totalCost :
                      activeCalc === 'flooring' ? flooringCalc.totalCost :
                      activeCalc === 'paint' ? paintCalc.totalCost :
                      activeCalc === 'drywall' ? drywallCalc.totalCost :
                      activeCalc === 'lumber' ? lumberCalc.totalCost :
                      activeCalc === 'deck' ? deckCalc.totalCost :
                      activeCalc === 'fence' ? fenceCalc.totalCost :
                      activeCalc === 'gravel' ? gravelCalc.totalCost :
                      mulchCalc.totalCost}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
