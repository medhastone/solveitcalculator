'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Layers,
  ChevronRight,
  Compass,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Sliders,
  DollarSign,
  Gauge,
  Disc,
  Fuel,
  Car,
  Activity,
  Zap,
  TrendingUp,
  Percent,
  Calculator,
  Wrench,
  Cpu
} from 'lucide-react';
import { CANONICAL_TOOLS } from '@/lib/registry';

type AutomotiveSubcategory = 'all' | 'engine-trans' | 'wheels-tires' | 'fuel-economy' | 'vehicle-finance' | 'performance-speed';

interface TabItem {
  id: AutomotiveSubcategory;
  label: string;
  icon: React.ElementType;
  count: number;
}

export default function AutomotiveCategoryHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AutomotiveSubcategory>('all');
  const [activeWorkbench, setActiveWorkbench] = useState<'tire' | 'engine' | 'hp' | 'fuel' | 'loan'>('tire');

  // ==========================================
  // WORKBENCH 1: TIRE SIZE & SPEEDOMETER ERROR
  // ==========================================
  const [stockWidth, setStockWidth] = useState<number>(225);
  const [stockAspect, setStockAspect] = useState<number>(65);
  const [stockRim, setStockRim] = useState<number>(17);

  const [newWidth, setNewWidth] = useState<number>(245);
  const [newAspect, setNewAspect] = useState<number>(70);
  const [newRim, setNewRim] = useState<number>(17);

  const [indicatedSpeed, setIndicatedSpeed] = useState<number>(65);

  const tireCalcResults = useMemo(() => {
    // Sidewall in inches = (Width * Aspect% / 100) / 25.4
    const stockSidewall = (stockWidth * (stockAspect / 100)) / 25.4;
    const stockDiameter = stockRim + 2 * stockSidewall;
    const stockCircumference = Math.PI * stockDiameter;
    const stockRevsPerMile = 63360 / stockCircumference;

    const newSidewall = (newWidth * (newAspect / 100)) / 25.4;
    const newDiameter = newRim + 2 * newSidewall;
    const newCircumference = Math.PI * newDiameter;
    const newRevsPerMile = 63360 / newCircumference;

    const diameterDiffInches = newDiameter - stockDiameter;
    const diameterDiffPercent = ((newDiameter - stockDiameter) / stockDiameter) * 100;
    const speedRatio = newDiameter / stockDiameter;
    const actualSpeed = indicatedSpeed * speedRatio;
    const speedDiff = actualSpeed - indicatedSpeed;

    return {
      stockSidewall: Number(stockSidewall.toFixed(2)),
      stockDiameter: Number(stockDiameter.toFixed(2)),
      stockCircumference: Number(stockCircumference.toFixed(1)),
      stockRevsPerMile: Number(stockRevsPerMile.toFixed(0)),

      newSidewall: Number(newSidewall.toFixed(2)),
      newDiameter: Number(newDiameter.toFixed(2)),
      newCircumference: Number(newCircumference.toFixed(1)),
      newRevsPerMile: Number(newRevsPerMile.toFixed(0)),

      diameterDiffInches: Number(diameterDiffInches.toFixed(2)),
      diameterDiffPercent: Number(diameterDiffPercent.toFixed(2)),
      actualSpeed: Number(actualSpeed.toFixed(1)),
      speedDiff: Number(speedDiff.toFixed(1)),
      isSignificant: Math.abs(diameterDiffPercent) > 3.0,
    };
  }, [stockWidth, stockAspect, stockRim, newWidth, newAspect, newRim, indicatedSpeed]);

  // ==========================================
  // WORKBENCH 2: ENGINE DISPLACEMENT & PISTON
  // ==========================================
  const [bore, setBore] = useState<number>(4.000);
  const [stroke, setStroke] = useState<number>(3.480);
  const [cylinders, setCylinders] = useState<number>(8);
  const [engineRpm, setEngineRpm] = useState<number>(6000);

  const engineCalcResults = useMemo(() => {
    // CID = PI * (Bore/2)^2 * Stroke * Cylinders
    const singleCylCid = Math.PI * Math.pow(bore / 2, 2) * stroke;
    const totalCid = singleCylCid * cylinders;
    const totalLiters = totalCid * 0.016387064;
    const totalCc = totalLiters * 1000;
    const singleCylCc = totalCc / cylinders;

    // Mean Piston Speed (ft/min) = 2 * (Stroke / 12) * RPM = (Stroke * RPM) / 6
    const pistonSpeedFtMin = (stroke * engineRpm) / 6;
    const pistonSpeedMS = pistonSpeedFtMin * 0.00508;

    // Carburetor CFM = (CID * RPM * 0.85) / 3456 (street standard)
    const streetCfm = (totalCid * engineRpm * 0.85) / 3456;
    const raceCfm = (totalCid * engineRpm * 1.05) / 3456;

    let pistonSafety = 'Safe Street Duty';
    let pistonSafetyClass = 'text-emerald-800 dark:text-emerald-300';
    if (pistonSpeedFtMin > 5000) {
      pistonSafety = 'Severe Racing Stress (Forged Internals Required)';
      pistonSafetyClass = 'text-red-700 dark:text-red-400';
    } else if (pistonSpeedFtMin > 4000) {
      pistonSafety = 'High Performance Stress';
      pistonSafetyClass = 'text-amber-950 dark:text-amber-300';
    }

    return {
      totalCid: Number(totalCid.toFixed(1)),
      totalLiters: Number(totalLiters.toFixed(2)),
      totalCc: Number(totalCc.toFixed(0)),
      singleCylCc: Number(singleCylCc.toFixed(1)),
      pistonSpeedFtMin: Number(pistonSpeedFtMin.toFixed(0)),
      pistonSpeedMS: Number(pistonSpeedMS.toFixed(1)),
      streetCfm: Number(streetCfm.toFixed(0)),
      raceCfm: Number(raceCfm.toFixed(0)),
      pistonSafety,
      pistonSafetyClass,
    };
  }, [bore, stroke, cylinders, engineRpm]);

  // ==========================================
  // WORKBENCH 3: HORSEPOWER & PERFORMANCE
  // ==========================================
  const [calcTorque, setCalcTorque] = useState<number>(400);
  const [calcHpRpm, setCalcHpRpm] = useState<number>(5500);
  const [vehicleWeight, setVehicleWeight] = useState<number>(3600);

  const performanceResults = useMemo(() => {
    // HP = (Torque * RPM) / 5252
    const calculatedHp = (calcTorque * calcHpRpm) / 5252;
    // Power-to-weight (lbs per HP)
    const lbsPerHp = calculatedHp > 0 ? vehicleWeight / calculatedHp : 0;

    // Quarter-mile ET = 5.825 * (Weight / HP)^(1/3)
    const quarterMileEt = calculatedHp > 0 ? 5.825 * Math.pow(vehicleWeight / calculatedHp, 1 / 3) : 0;
    // Quarter-mile Trap Speed = 234 * (HP / Weight)^(1/3)
    const trapSpeed = calculatedHp > 0 ? 234 * Math.pow(calculatedHp / vehicleWeight, 1 / 3) : 0;

    return {
      hp: Number(calculatedHp.toFixed(0)),
      lbsPerHp: Number(lbsPerHp.toFixed(1)),
      quarterMileEt: Number(quarterMileEt.toFixed(2)),
      trapSpeed: Number(trapSpeed.toFixed(1)),
    };
  }, [calcTorque, calcHpRpm, vehicleWeight]);

  // ==========================================
  // WORKBENCH 4: TRIP FUEL & MPG
  // ==========================================
  const [tripMiles, setTripMiles] = useState<number>(350);
  const [tripMpg, setTripMpg] = useState<number>(28);
  const [gasPricePerGal, setGasPricePerGal] = useState<number>(3.65);

  const fuelTripResults = useMemo(() => {
    const gallonsNeeded = tripMpg > 0 ? tripMiles / tripMpg : 0;
    const totalCost = gallonsNeeded * gasPricePerGal;
    const costPerMile = tripMiles > 0 ? totalCost / tripMiles : 0;

    // Conversions
    const lPer100km = tripMpg > 0 ? 235.215 / tripMpg : 0;
    const imperialMpg = tripMpg * 1.20095;

    // EV comparison: ~30 kWh per 100 miles @ $0.16/kWh = $4.80 per 100 miles
    const evKwhNeeded = (tripMiles / 100) * 30;
    const evCost = evKwhNeeded * 0.16;
    const gasSavingsWithEv = Math.max(0, totalCost - evCost);

    return {
      gallonsNeeded: Number(gallonsNeeded.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      costPerMile: Number(costPerMile.toFixed(3)),
      costPer100Miles: Number((costPerMile * 100).toFixed(2)),
      lPer100km: Number(lPer100km.toFixed(1)),
      imperialMpg: Number(imperialMpg.toFixed(1)),
      evCost: Number(evCost.toFixed(2)),
      gasSavingsWithEv: Number(gasSavingsWithEv.toFixed(2)),
    };
  }, [tripMiles, tripMpg, gasPricePerGal]);

  // ==========================================
  // WORKBENCH 5: AUTO LOAN & LEASE
  // ==========================================
  const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [tradeInValue, setTradeInValue] = useState<number>(2500);
  const [interestRate, setInterestRate] = useState<number>(5.9);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [salesTaxPct, setSalesTaxPct] = useState<number>(6.5);

  const autoLoanResults = useMemo(() => {
    const taxAmount = (vehiclePrice - tradeInValue) * (salesTaxPct / 100);
    const netFinanced = Math.max(0, vehiclePrice + taxAmount - downPayment - tradeInValue);

    const monthlyRate = interestRate / 100 / 12;
    let monthlyPayment = 0;
    if (monthlyRate > 0 && loanTermMonths > 0) {
      monthlyPayment =
        (netFinanced * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
        (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
    } else if (loanTermMonths > 0) {
      monthlyPayment = netFinanced / loanTermMonths;
    }

    const totalPayments = monthlyPayment * loanTermMonths;
    const totalInterest = Math.max(0, totalPayments - netFinanced);
    const totalVehicleOutlay = totalPayments + downPayment + tradeInValue;

    // Approximate 36-month lease estimate: 55% residual value, 0.0022 money factor
    const leaseResidual = vehiclePrice * 0.55;
    const monthlyDepreciation = (vehiclePrice - downPayment - leaseResidual) / 36;
    const monthlyFinanceFee = (vehiclePrice - downPayment + leaseResidual) * 0.0022;
    const estimatedLeasePayment = Math.max(0, monthlyDepreciation + monthlyFinanceFee);

    return {
      netFinanced: Number(netFinanced.toFixed(0)),
      taxAmount: Number(taxAmount.toFixed(0)),
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(0)),
      totalPayments: Number(totalPayments.toFixed(0)),
      totalVehicleOutlay: Number(totalVehicleOutlay.toFixed(0)),
      estimatedLeasePayment: Number(estimatedLeasePayment.toFixed(2)),
    };
  }, [vehiclePrice, downPayment, tradeInValue, interestRate, loanTermMonths, salesTaxPct]);

  // ==========================================
  // INCHCALCULATOR COMPETITOR TOOLS INVENTORY
  // ==========================================
  const automotiveTools = useMemo(() => {
    return [
      // 1. Engine & Transmission
      {
        slug: 'engine-displacement-calculator',
        name: 'Engine Displacement Calculator',
        category: 'engine-trans',
        badge: 'Cylinders',
        description: 'Calculate engine displacement in cubic inches (CID), cubic centimeters (cc), and liters from cylinder bore, stroke, and cylinder count.',
        href: '/automotive',
        formula: 'CID = π × (Bore ÷ 2)² × Stroke × Cylinders',
      },
      {
        slug: 'engine-compression-ratio-calculator',
        name: 'Engine Compression Ratio Calculator',
        category: 'engine-trans',
        badge: 'Compression',
        description: 'Calculate static cylinder compression ratio based on cylinder swept volume, combustion chamber cc, head gasket thickness, and piston dome/dish.',
        href: '/automotive',
        formula: 'CR = (Swept Volume + Clearance Volume) ÷ Clearance Volume',
      },
      {
        slug: 'carburetor-cfm-calculator',
        name: 'Carburetor CFM Calculator',
        category: 'engine-trans',
        badge: 'Airflow',
        description: 'Size the perfect carburetor CFM for street or racing engines using engine displacement, redline RPM, and volumetric efficiency.',
        href: '/automotive',
        formula: 'CFM = (Displacement in CID × Max RPM × VE) ÷ 3,456',
      },
      {
        slug: 'engine-horsepower-calculator',
        name: 'Engine Horsepower Calculator',
        category: 'engine-trans',
        badge: 'Dyno',
        description: 'Calculate engine horsepower using torque and RPM, or estimate flywheel output from quarter-mile vehicle trap speed and curb weight.',
        href: '/automotive',
        formula: 'HP = (Torque in lb-ft × RPM) ÷ 5,252',
      },
      {
        slug: 'engine-rpm-calculator',
        name: 'Engine RPM Calculator',
        category: 'engine-trans',
        badge: 'RPM & Speed',
        description: 'Calculate engine RPM at highway cruising speeds using tire rolling diameter, transmission gear ratio, and rear differential axle ratio.',
        href: '/engine-rpm-calculator',
        formula: 'RPM = (Speed in MPH × Gear Ratio × Axle Ratio × 336) ÷ Tire Diameter',
      },
      {
        slug: 'engine-torque-calculator',
        name: 'Engine Torque Calculator',
        category: 'engine-trans',
        badge: 'Torque',
        description: 'Convert horsepower to rotational torque in pound-feet (lb-ft) and Newton-meters (Nm) at any engine rotational speed.',
        href: '/automotive',
        formula: 'Torque (lb-ft) = (Horsepower × 5,252) ÷ RPM',
      },
      {
        slug: 'gear-ratio-calculator',
        name: 'Gear Ratio Calculator',
        category: 'engine-trans',
        badge: 'Transmission',
        description: 'Calculate individual transmission gear ratios, final drive reduction, transfer case low-range crawl ratios, and tire speed steps.',
        href: '/gear-ratio-calculator',
        formula: 'Ratio = Driven Teeth ÷ Drive Teeth',
      },
      {
        slug: 'piston-speed-calculator',
        name: 'Piston Speed Calculator',
        category: 'engine-trans',
        badge: 'Internal Dynamics',
        description: 'Calculate mean and maximum piston speed in feet per minute (ft/min) and meters per second (m/s) to verify connecting rod and valve safety.',
        href: '/automotive',
        formula: 'Piston Speed = (2 × Stroke in Feet × RPM)',
      },

      // 2. Wheels & Tires
      {
        slug: 'tire-size-comparison-calculator',
        name: 'Tire Size Comparison & Calculator',
        category: 'wheels-tires',
        badge: 'Dimensions',
        description: 'Compare two tire metric sizes side-by-side: overall diameter, sidewall height, tread width, circumference, and revolutions per mile.',
        href: '/automotive',
        formula: 'Diameter = Rim + 2 × (Width × Aspect% ÷ 25.4)',
      },
      {
        slug: 'speedometer-error-calculator',
        name: 'Speedometer Error Calculator',
        category: 'wheels-tires',
        badge: 'Calibration',
        description: 'Calculate exact speedometer error percentage and true road speed after changing to taller or smaller aftermarket wheels and tires.',
        href: '/automotive',
        formula: 'Speed Error % = ((New Dia - Stock Dia) ÷ Stock Dia) × 100',
      },
      {
        slug: 'wheel-offset-backspacing-calculator',
        name: 'Wheel Offset & Backspacing Calculator',
        category: 'wheels-tires',
        badge: 'Fitment',
        description: 'Convert wheel positive/negative offset in millimeters (ET) to wheel backspacing in inches, ensuring proper wheel well and brake caliper clearance.',
        href: '/automotive',
        formula: 'Backspacing = (Wheel Width + 1") ÷ 2 + (Offset ÷ 25.4)',
      },
      {
        slug: 'speedometer-gear-calculator',
        name: 'Speedometer Gear Calculator',
        category: 'wheels-tires',
        badge: 'Cables & Gears',
        description: 'Determine the correct number of driven speedometer teeth needed in your transmission tailhousing after changing tire size or rear axle gears.',
        href: '/automotive',
        formula: 'Driven Teeth = (Drive Teeth × Axle Ratio × Revs/Mile) ÷ 1,000',
      },
      {
        slug: 'tire-height-sidewall-calculator',
        name: 'Tire Height & Sidewall Calculator',
        category: 'wheels-tires',
        badge: 'Profile',
        description: 'Break down any metric tire size (e.g. 275/40R20) into exact inches and millimeters for overall diameter, section width, and sidewall cushion.',
        href: '/automotive',
        formula: 'Sidewall Height = Width × Aspect Ratio',
      },

      // 3. Fuel & Fuel Economy
      {
        slug: 'miles-per-gallon-calculator',
        name: 'Miles Per Gallon (MPG) Calculator',
        category: 'fuel-economy',
        badge: 'Efficiency',
        description: 'Calculate your vehicle’s exact fuel economy based on odometer trip miles driven and gallons filled at the gas pump.',
        href: '/conversions/fuel-economy',
        formula: 'MPG = Miles Traveled ÷ Gallons Consumed',
      },
      {
        slug: 'gas-mileage-trip-cost-calculator',
        name: 'Trip Fuel Cost & Mileage Calculator',
        category: 'fuel-economy',
        badge: 'Trip Planning',
        description: 'Estimate total fuel required, overall trip gas expenditure, and cost per mile for road trips based on current local gas prices.',
        href: '/automotive',
        formula: 'Trip Cost = (Miles ÷ MPG) × Fuel Price Per Gallon',
      },
      {
        slug: 'fuel-consumption-converter',
        name: 'Fuel Consumption Converter (MPG / L/100km)',
        category: 'fuel-economy',
        badge: 'Metric & Imperial',
        description: 'Convert seamlessly between US MPG, UK Imperial MPG, Liters per 100 Kilometers (L/100km), and Kilometers per Liter (km/L).',
        href: '/conversions/fuel-economy',
        formula: 'L/100km = 235.215 ÷ US MPG',
      },
      {
        slug: 'ev-range-charging-calculator',
        name: 'EV Range & Charging Speed Calculator',
        category: 'fuel-economy',
        badge: 'Electric Vehicles',
        description: 'Calculate electric vehicle charging duration and electricity cost per 100 miles across Level 1 (120V), Level 2 (240V), and DC fast chargers.',
        href: '/automotive',
        formula: 'Charging Hours = Battery Capacity (kWh) ÷ (kW × Efficiency)',
      },

      // 4. Vehicle Financing & Ownership
      {
        slug: 'auto-loan-calculator',
        name: 'Auto Loan Payment Calculator',
        category: 'vehicle-finance',
        badge: 'Auto Financing',
        description: 'Calculate monthly car loan payments, total interest paid, and full payoff amortization based on vehicle purchase price, down payment, and APR.',
        href: '/automotive',
        formula: 'Payment = [P × r × (1+r)^n] ÷ [(1+r)^n - 1]',
      },
      {
        slug: 'car-lease-payment-calculator',
        name: 'Car Lease Payment Calculator',
        category: 'vehicle-finance',
        badge: 'Leasing',
        description: 'Calculate monthly lease payments using capitalized cost, residual value, money factor, and lease acquisition fees.',
        href: '/automotive',
        formula: 'Lease Payment = Monthly Depreciation + Monthly Finance Fee',
      },
      {
        slug: 'vehicle-depreciation-calculator',
        name: 'Vehicle Depreciation & Cost to Own',
        category: 'vehicle-finance',
        badge: 'Resale Value',
        description: 'Estimate future vehicle resale value year-by-year and project true 5-year ownership costs including depreciation, insurance, and maintenance.',
        href: '/automotive',
        formula: 'Value(t) = Purchase Price × (1 - Depreciation Rate)^t',
      },
      {
        slug: 'rv-boat-motorcycle-loan-calculator',
        name: 'RV, Boat, Motorcycle & ATV Loan Calculator',
        category: 'vehicle-finance',
        badge: 'Powersports',
        description: 'Specialized financing calculator for recreational vehicles, marine boats, motorhomes, and motorcycles with extended loan terms up to 180 months.',
        href: '/automotive',
        formula: 'Monthly Payment with Extended Term Amortization',
      },

      // 5. Speed & Performance
      {
        slug: 'quarter-mile-calculator',
        name: 'Quarter Mile (1/4 Mile) ET & Trap Speed',
        category: 'performance-speed',
        badge: 'Drag Racing',
        description: 'Estimate drag strip elapsed time (ET) and finish trap speed based on vehicle flywheel horsepower and total curb weight.',
        href: '/automotive',
        formula: 'ET = 5.825 × (Weight ÷ HP)^(1/3)',
      },
      {
        slug: 'speedometer-calibration-calculator',
        name: 'Speedometer Calibration & True Speed',
        category: 'performance-speed',
        badge: 'Velocity',
        description: 'Determine true road velocity versus instrument gauge display, calibrating pulse counts per mile for electronic speed sensors (VSS).',
        href: '/automotive',
        formula: 'True Speed = Display Speed × (New Circumference ÷ OEM Circumference)',
      },
      {
        slug: 'boat-marine-speed-calculator',
        name: 'Boat / Marine Top Speed Calculator',
        category: 'performance-speed',
        badge: 'Marine',
        description: 'Estimate top water speed in knots and MPH for powerboats and bass boats using Crouch’s Marine Propulsion Formula.',
        href: '/automotive',
        formula: 'Speed = Constant × √(Shaft HP ÷ Displacement Weight)',
      },
    ];
  }, []);

  const tabs: TabItem[] = useMemo(() => {
    return [
      { id: 'all', label: 'All Automotive Tools', icon: Car, count: automotiveTools.length },
      { id: 'engine-trans', label: 'Engine & Transmission', icon: Wrench, count: automotiveTools.filter(t => t.category === 'engine-trans').length },
      { id: 'wheels-tires', label: 'Wheels & Tires', icon: Disc, count: automotiveTools.filter(t => t.category === 'wheels-tires').length },
      { id: 'fuel-economy', label: 'Fuel & Economy', icon: Fuel, count: automotiveTools.filter(t => t.category === 'fuel-economy').length },
      { id: 'vehicle-finance', label: 'Vehicle Financing', icon: DollarSign, count: automotiveTools.filter(t => t.category === 'vehicle-finance').length },
      { id: 'performance-speed', label: 'Speed & Performance', icon: Gauge, count: automotiveTools.filter(t => t.category === 'performance-speed').length },
    ];
  }, [automotiveTools]);

  const filteredTools = useMemo(() => {
    return automotiveTools.filter((tool) => {
      const matchesTab = activeTab === 'all' || tool.category === activeTab;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [automotiveTools, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* ========================================== */}
      {/* 1. HERO SECTION & BENCHMARK HEADER          */}
      {/* ========================================== */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-outline" />
            <span className="text-on-surface font-medium">Automotive Calculators</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-container-low border border-outline-variant/60 text-xs font-medium text-primary mb-3">
                <Car className="w-3.5 h-3.5 text-primary" />
                <span>SAE International & EPA Calibration Standards</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
                Automotive Calculators
              </h1>
              <p className="mt-3 text-base sm:text-lg text-on-surface-variant leading-relaxed">
                Free, precision mechanical calculators for tire size comparison, speedometer calibration error, engine displacement & compression ratios, horsepower, torque, fuel economy, and auto loan financing.
              </p>
            </div>

            {/* Quick Metrics Banner */}
            <div className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-xs shrink-0">
              <div className="px-4 py-2 border-r border-outline-variant/40">
                <div className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Calculators</div>
                <div className="text-2xl font-bold font-mono text-on-surface tabular-nums">25+</div>
              </div>
              <div className="px-4 py-2 border-r border-outline-variant/40">
                <div className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Workbenches</div>
                <div className="text-2xl font-bold font-mono text-primary tabular-nums">5 Live</div>
              </div>
              <div className="px-4 py-2">
                <div className="text-xs uppercase tracking-wider text-on-surface-variant font-medium">Standards</div>
                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">SAE / EPA</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search engine displacement, tire size, speedometer, MPG, loan..."
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. INTERACTIVE WORKBENCHES (5 LIVE SUITES) */}
      {/* ========================================== */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest/50 border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          {/* Workbench Selection Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Interactive Automotive Workbenches</h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Calculate tire differences, engine swept volume, drag performance, fuel trip expenses, and car payments in real-time.
              </p>
            </div>

            {/* Workbench Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveWorkbench('tire')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  activeWorkbench === 'tire'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Tire & Speedo</span>
              </button>

              <button
                onClick={() => setActiveWorkbench('engine')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  activeWorkbench === 'engine'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Displacement</span>
              </button>

              <button
                onClick={() => setActiveWorkbench('hp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  activeWorkbench === 'hp'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>HP & 1/4 Mile</span>
              </button>

              <button
                onClick={() => setActiveWorkbench('fuel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  activeWorkbench === 'fuel'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Fuel className="w-3.5 h-3.5" />
                <span>Trip Fuel & MPG</span>
              </button>

              <button
                onClick={() => setActiveWorkbench('loan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  activeWorkbench === 'loan'
                    ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Auto Loan</span>
              </button>
            </div>
          </div>

          {/* WORKBENCH CONTENT CONTAINER */}
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* ========================================================== */}
            {/* WORKBENCH 1: TIRE SIZE COMPARISON & SPEEDOMETER ERROR     */}
            {/* ========================================================== */}
            {activeWorkbench === 'tire' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Input Controls */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                        <Disc className="w-4 h-4 text-primary" />
                        <span>Tire Size Comparison & Calibration</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Compare stock OEM tires against aftermarket upgrades to evaluate diameter variance and speedometer error.
                      </p>
                    </div>

                    {/* Stock Tire */}
                    <div className="p-4 bg-surface-container-low/70 border border-outline-variant/60 rounded-xl space-y-3">
                      <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                        <span>Stock Tire Specification</span>
                        <span className="font-mono text-primary">{stockWidth}/{stockAspect}R{stockRim}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Width (mm)</label>
                          <input
                            type="number"
                            value={stockWidth}
                            onChange={(e) => setStockWidth(Math.max(125, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-mono text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Aspect (%)</label>
                          <input
                            type="number"
                            value={stockAspect}
                            onChange={(e) => setStockAspect(Math.max(25, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-mono text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Rim (in)</label>
                          <input
                            type="number"
                            value={stockRim}
                            onChange={(e) => setStockRim(Math.max(10, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-mono text-on-surface"
                          />
                        </div>
                      </div>
                    </div>

                    {/* New Tire */}
                    <div className="p-4 bg-surface-container-low/70 border border-outline-variant/60 rounded-xl space-y-3">
                      <div className="text-xs font-bold text-on-surface flex items-center justify-between">
                        <span>New Tire Specification</span>
                        <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold">{newWidth}/{newAspect}R{newRim}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Width (mm)</label>
                          <input
                            type="number"
                            value={newWidth}
                            onChange={(e) => setNewWidth(Math.max(125, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-mono text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Aspect (%)</label>
                          <input
                            type="number"
                            value={newAspect}
                            onChange={(e) => setNewAspect(Math.max(25, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-mono text-on-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Rim (in)</label>
                          <input
                            type="number"
                            value={newRim}
                            onChange={(e) => setNewRim(Math.max(10, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-mono text-on-surface"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Indicated Speed Slider */}
                    <div className="p-4 bg-surface-container-low/40 border border-outline-variant/40 rounded-xl">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-medium text-on-surface">Test Speedometer Speed:</span>
                        <span className="font-mono font-bold text-on-surface">{indicatedSpeed} MPH</span>
                      </div>
                      <input
                        type="range"
                        min="25"
                        max="90"
                        step="5"
                        value={indicatedSpeed}
                        onChange={(e) => setIndicatedSpeed(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-on-surface-variant font-mono mt-1">
                        <span>25 MPH</span>
                        <span>60 MPH</span>
                        <span>90 MPH</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: SVG Visualizer & Mathematical Telemetry */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Visual Tire Profile Canvas (SVG) */}
                    <div className="p-6 bg-surface-container-low/50 border border-outline-variant/60 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Tire Profile & Diameter Geometry
                        </div>
                        <div className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          tireCalcResults.isSignificant
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}>
                          {tireCalcResults.diameterDiffPercent > 0 ? '+' : ''}{tireCalcResults.diameterDiffPercent}% Diameter Delta
                        </div>
                      </div>

                      {/* SVG Canvas */}
                      <div className="flex items-center justify-center py-4">
                        <svg className="w-full max-w-md h-48" viewBox="0 0 400 180">
                          {/* Stock Tire Diagram */}
                          <g transform="translate(100, 90)">
                            {/* Outer Tire */}
                            <circle r="70" fill="none" stroke="currentColor" className="text-on-surface-variant/40" strokeWidth="14" />
                            {/* Rim */}
                            <circle r="44" fill="none" stroke="currentColor" className="text-outline" strokeWidth="2" strokeDasharray="3,3" />
                            <circle r="12" fill="currentColor" className="text-outline/40" />
                            <text y="95" textAnchor="middle" className="text-[11px] font-mono fill-current font-bold">
                              Stock: {tireCalcResults.stockDiameter}&quot;
                            </text>
                            <text y="110" textAnchor="middle" className="text-[10px] font-mono fill-current text-on-surface-variant">
                              {stockWidth}/{stockAspect}R{stockRim}
                            </text>
                          </g>

                          {/* Upgrade Comparison Arrow */}
                          <g transform="translate(200, 90)">
                            <path d="M -15 0 L 15 0 M 8 -6 L 15 0 L 8 6" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" />
                            <text y="-10" textAnchor="middle" className="text-[10px] font-mono fill-current font-bold text-primary">
                              {tireCalcResults.diameterDiffInches > 0 ? '+' : ''}{tireCalcResults.diameterDiffInches}&quot;
                            </text>
                          </g>

                          {/* New Tire Diagram */}
                          <g transform="translate(300, 90)">
                            {/* Outer Tire */}
                            <circle
                              r={70 * (tireCalcResults.newDiameter / tireCalcResults.stockDiameter)}
                              fill="none"
                              stroke="currentColor"
                              className="text-primary"
                              strokeWidth="15"
                            />
                            {/* Rim */}
                            <circle
                              r={44 * (newRim / stockRim)}
                              fill="none"
                              stroke="currentColor"
                              className="text-primary/60"
                              strokeWidth="2"
                              strokeDasharray="3,3"
                            />
                            <circle r="12" fill="currentColor" className="text-primary/40" />
                            <text y="95" textAnchor="middle" className="text-[11px] font-mono fill-current font-bold text-primary">
                              New: {tireCalcResults.newDiameter}&quot;
                            </text>
                            <text y="110" textAnchor="middle" className="text-[10px] font-mono fill-current text-on-surface-variant">
                              {newWidth}/{newAspect}R{newRim}
                            </text>
                          </g>
                        </svg>
                      </div>

                      {/* Calibrated Comparison Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-outline-variant/40">
                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Diameter</div>
                          <div className="text-xs font-mono font-bold text-on-surface mt-0.5">
                            {tireCalcResults.stockDiameter}&quot; → {tireCalcResults.newDiameter}&quot;
                          </div>
                        </div>

                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Sidewall</div>
                          <div className="text-xs font-mono font-bold text-on-surface mt-0.5">
                            {tireCalcResults.stockSidewall}&quot; → {tireCalcResults.newSidewall}&quot;
                          </div>
                        </div>

                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Circumference</div>
                          <div className="text-xs font-mono font-bold text-on-surface mt-0.5">
                            {tireCalcResults.stockCircumference}&quot; → {tireCalcResults.newCircumference}&quot;
                          </div>
                        </div>

                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Revs / Mile</div>
                          <div className="text-xs font-mono font-bold text-on-surface mt-0.5">
                            {tireCalcResults.stockRevsPerMile} → {tireCalcResults.newRevsPerMile}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Speedometer Calibration Output HUD */}
                    <div className="p-5 bg-surface-container-low border border-outline-variant/60 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                          Speedometer Calibration Result
                        </span>
                        <span className="text-xs font-mono text-on-surface-variant">
                          Error: {tireCalcResults.diameterDiffPercent > 0 ? '+' : ''}{tireCalcResults.diameterDiffPercent}%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Indicated Speed</div>
                          <div className="text-3xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            {indicatedSpeed} <span className="text-sm font-sans font-normal text-on-surface-variant">MPH</span>
                          </div>
                          <div className="text-[11px] text-on-surface-variant mt-1">Instrument dashboard reading</div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-primary/30 rounded-xl">
                          <div className="text-xs text-primary font-medium">Actual Road Speed</div>
                          <div className="text-3xl font-extrabold font-mono text-primary mt-1 tabular-nums">
                            {tireCalcResults.actualSpeed} <span className="text-sm font-sans font-normal text-on-surface-variant">MPH</span>
                          </div>
                          <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
                            {tireCalcResults.speedDiff > 0 ? `+${tireCalcResults.speedDiff} MPH faster than cluster` : `${tireCalcResults.speedDiff} MPH slower`}
                          </div>
                        </div>
                      </div>

                      {tireCalcResults.isSignificant && (
                        <div className="flex items-start gap-2 p-3 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 rounded-lg text-xs text-amber-950 dark:text-amber-200">
                          <Lightbulb className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">ECU Recalibration Advised:</span> Diameter variance exceeds 3.0%. Reprogram tire revolutions-per-mile in your vehicle ECU or transmission controller to maintain ABS and traction control accuracy.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* WORKBENCH 2: ENGINE DISPLACEMENT & PISTON GEOMETRY       */}
            {/* ========================================================== */}
            {activeWorkbench === 'engine' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Input Parameters */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span>Engine Displacement & Cylinder Geometry</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Compute total swept displacement, single cylinder volume, mean piston speed, and carburetor CFM airflow sizing.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <label className="font-medium text-on-surface">Cylinder Bore (inches):</label>
                          <span className="font-mono text-primary font-bold">{bore.toFixed(3)} in ({(bore * 25.4).toFixed(1)} mm)</span>
                        </div>
                        <input
                          type="number"
                          step="0.010"
                          value={bore}
                          onChange={(e) => setBore(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <label className="font-medium text-on-surface">Crankshaft Stroke (inches):</label>
                          <span className="font-mono text-primary font-bold">{stroke.toFixed(3)} in ({(stroke * 25.4).toFixed(1)} mm)</span>
                        </div>
                        <input
                          type="number"
                          step="0.010"
                          value={stroke}
                          onChange={(e) => setStroke(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1.5">Cylinder Count:</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[4, 6, 8, 10, 12].map((num) => (
                            <button
                              key={num}
                              onClick={() => setCylinders(num)}
                              className={`py-2 rounded-lg text-xs font-bold font-mono transition-colors ${
                                cylinders === num
                                  ? 'bg-primary text-on-primary'
                                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                              }`}
                            >
                              {num} Cyl
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <label className="font-medium text-on-surface">Maximum Operating RPM:</label>
                          <span className="font-mono text-on-surface font-bold">{engineRpm} RPM</span>
                        </div>
                        <input
                          type="range"
                          min="3000"
                          max="9000"
                          step="250"
                          value={engineRpm}
                          onChange={(e) => setEngineRpm(Number(e.target.value))}
                          className="w-full accent-primary cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: SVG Piston Diagram & Readout Stage */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* SVG Cylinder Cross Section */}
                    <div className="p-6 bg-surface-container-low/50 border border-outline-variant/60 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Swept Cylinder Cross-Section
                        </div>
                        <div className="text-xs font-mono font-bold text-primary">
                          {engineCalcResults.singleCylCc} cc / Cylinder
                        </div>
                      </div>

                      <div className="flex items-center justify-center py-2">
                        <svg className="w-full max-w-sm h-48" viewBox="0 0 300 200">
                          {/* Cylinder Sleeve */}
                          <rect x="75" y="20" width="150" height="150" fill="none" stroke="currentColor" className="text-outline" strokeWidth="4" />

                          {/* Piston Body (TDC/BDC swept zone) */}
                          <rect x="80" y="70" width="140" height="50" rx="3" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="2" />
                          <circle cx="150" cy="95" r="10" fill="currentColor" className="text-primary/60" />

                          {/* Connecting Rod */}
                          <line x1="150" y1="95" x2="150" y2="160" stroke="currentColor" className="text-on-surface" strokeWidth="8" strokeLinecap="round" />

                          {/* Bore Dimension Line */}
                          <line x1="75" y1="12" x2="225" y2="12" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
                          <text x="150" y="8" textAnchor="middle" className="text-[10px] font-mono fill-current font-bold text-primary">
                            Bore: {bore.toFixed(3)}&quot; ({(bore * 25.4).toFixed(1)} mm)
                          </text>

                          {/* Stroke Dimension Line */}
                          <line x1="60" y1="20" x2="60" y2="170" stroke="currentColor" className="text-emerald-800 dark:text-emerald-300" strokeWidth="1.5" />
                          <text x="45" y="95" textAnchor="middle" transform="rotate(-90 45 95)" className="text-[10px] font-mono fill-current font-bold">
                            Stroke: {stroke.toFixed(3)}&quot;
                          </text>
                        </svg>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-outline-variant/40 text-center">
                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Bore / Stroke Ratio</div>
                          <div className="text-xs font-mono font-bold text-on-surface mt-0.5">
                            {(bore / stroke).toFixed(2)} : 1 {bore > stroke ? '(Over-square)' : '(Under-square)'}
                          </div>
                        </div>

                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Carb CFM (Street)</div>
                          <div className="text-xs font-mono font-bold text-primary mt-0.5">
                            {engineCalcResults.streetCfm} CFM
                          </div>
                        </div>

                        <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/40">
                          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Carb CFM (Race)</div>
                          <div className="text-xs font-mono font-bold text-on-surface mt-0.5">
                            {engineCalcResults.raceCfm} CFM
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HUD Displacement & Piston Speed Results */}
                    <div className="p-5 bg-surface-container-low border border-outline-variant/60 rounded-xl space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-container-lowest border border-primary/30 rounded-xl">
                          <div className="text-xs text-primary font-medium">Total Displacement</div>
                          <div className="text-3xl font-extrabold font-mono text-primary mt-1 tabular-nums">
                            {engineCalcResults.totalLiters} <span className="text-base font-sans font-normal text-on-surface-variant">Liters</span>
                          </div>
                          <div className="text-xs font-mono font-semibold text-on-surface-variant mt-1">
                            {engineCalcResults.totalCid} CID ({engineCalcResults.totalCc} cc)
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Mean Piston Speed @ {engineRpm} RPM</div>
                          <div className="text-3xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            {engineCalcResults.pistonSpeedFtMin} <span className="text-sm font-sans font-normal text-on-surface-variant">ft/min</span>
                          </div>
                          <div className={`text-xs font-bold mt-1 ${engineCalcResults.pistonSafetyClass}`}>
                            {engineCalcResults.pistonSafety} ({engineCalcResults.pistonSpeedMS} m/s)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* WORKBENCH 3: HORSEPOWER & QUARTER-MILE PERFORMANCE        */}
            {/* ========================================================== */}
            {activeWorkbench === 'hp' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-primary" />
                        <span>Horsepower, Torque & Quarter-Mile ET</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Convert torque to horsepower and project drag strip elapsed time (ET) and trap speed based on vehicle curb weight.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <label className="font-medium text-on-surface">Engine Torque (lb-ft):</label>
                          <span className="font-mono text-primary font-bold">{calcTorque} lb-ft</span>
                        </div>
                        <input
                          type="number"
                          value={calcTorque}
                          onChange={(e) => setCalcTorque(Math.max(10, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <label className="font-medium text-on-surface">Engine RPM:</label>
                          <span className="font-mono text-primary font-bold">{calcHpRpm} RPM</span>
                        </div>
                        <input
                          type="number"
                          value={calcHpRpm}
                          onChange={(e) => setCalcHpRpm(Math.max(500, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <label className="font-medium text-on-surface">Vehicle Curb Weight (lbs with driver):</label>
                          <span className="font-mono text-on-surface font-bold">{vehicleWeight} lbs</span>
                        </div>
                        <input
                          type="number"
                          step="50"
                          value={vehicleWeight}
                          onChange={(e) => setVehicleWeight(Math.max(500, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-6 bg-surface-container-low border border-outline-variant/60 rounded-xl space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface">
                        Performance Telemetry Output
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-container-lowest border border-primary/30 rounded-xl">
                          <div className="text-xs text-primary font-medium">Calculated Horsepower</div>
                          <div className="text-4xl font-extrabold font-mono text-primary mt-1 tabular-nums">
                            {performanceResults.hp} <span className="text-base font-sans font-normal text-on-surface-variant">HP</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            At {calcHpRpm} RPM with {calcTorque} lb-ft
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Power-to-Weight Ratio</div>
                          <div className="text-4xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            {performanceResults.lbsPerHp} <span className="text-sm font-sans font-normal text-on-surface-variant">lbs / HP</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            {((performanceResults.hp / vehicleWeight) * 2000).toFixed(0)} HP per ton
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Quarter-Mile Elapsed Time (ET)</div>
                          <div className="text-4xl font-extrabold font-mono text-emerald-800 dark:text-emerald-300 mt-1 tabular-nums">
                            {performanceResults.quarterMileEt} <span className="text-sm font-sans font-normal text-on-surface-variant">sec</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">Hopkins Fox Drag Formula</div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Finish Trap Speed</div>
                          <div className="text-4xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            {performanceResults.trapSpeed} <span className="text-sm font-sans font-normal text-on-surface-variant">MPH</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">1/4 mile finish line velocity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* WORKBENCH 4: TRIP FUEL & MPG                             */}
            {/* ========================================================== */}
            {activeWorkbench === 'fuel' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-primary" />
                        <span>Trip Fuel Cost & Efficiency Converter</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Estimate road trip gas consumption, cost per mile, and compare against equivalent electric vehicle charging costs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1.5">One-Way / Total Trip Miles:</label>
                        <input
                          type="number"
                          value={tripMiles}
                          onChange={(e) => setTripMiles(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1.5">Vehicle Fuel Economy (US MPG):</label>
                        <input
                          type="number"
                          step="0.5"
                          value={tripMpg}
                          onChange={(e) => setTripMpg(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1.5">Gas Price ($ / Gallon):</label>
                        <input
                          type="number"
                          step="0.05"
                          value={gasPricePerGal}
                          onChange={(e) => setGasPricePerGal(Math.max(0.5, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono text-on-surface"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-6 bg-surface-container-low border border-outline-variant/60 rounded-xl space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface">
                        Trip Fuel Cost & Consumption Breakdown
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-container-lowest border border-primary/30 rounded-xl">
                          <div className="text-xs text-primary font-medium">Estimated Fuel Cost</div>
                          <div className="text-4xl font-extrabold font-mono text-primary mt-1 tabular-nums">
                            ${fuelTripResults.totalCost}
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            For {tripMiles} miles @ ${gasPricePerGal}/gal
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Fuel Required</div>
                          <div className="text-4xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            {fuelTripResults.gallonsNeeded} <span className="text-sm font-sans font-normal text-on-surface-variant">Gal</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            ${fuelTripResults.costPerMile} / mile (${fuelTripResults.costPer100Miles} / 100 mi)
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Metric Consumption</div>
                          <div className="text-3xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            {fuelTripResults.lPer100km} <span className="text-sm font-sans font-normal text-on-surface-variant">L/100km</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            Equivalent to {fuelTripResults.imperialMpg} UK MPG
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-emerald-300/60 dark:border-emerald-700/60 rounded-xl">
                          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">EV Comparison Cost</div>
                          <div className="text-3xl font-extrabold font-mono text-emerald-800 dark:text-emerald-300 mt-1 tabular-nums">
                            ${fuelTripResults.evCost}
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            Save ${fuelTripResults.gasSavingsWithEv} driving electric
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* WORKBENCH 5: AUTO LOAN & LEASE PAYMENT                    */}
            {/* ========================================================== */}
            {activeWorkbench === 'loan' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>Auto Loan & Lease Payment Calculator</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Calculate monthly payments, total interest outlay, and compare financing versus 36-month lease estimates.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1">Vehicle Price ($):</label>
                        <input
                          type="number"
                          step="500"
                          value={vehiclePrice}
                          onChange={(e) => setVehiclePrice(Math.max(1000, Number(e.target.value)))}
                          className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1">Down Payment ($):</label>
                        <input
                          type="number"
                          step="500"
                          value={downPayment}
                          onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1">Trade-in Value ($):</label>
                        <input
                          type="number"
                          step="500"
                          value={tradeInValue}
                          onChange={(e) => setTradeInValue(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-on-surface"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-on-surface mb-1">Interest Rate / APR (%):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                          className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-mono text-on-surface"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-on-surface mb-1">Loan Term:</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[36, 48, 60, 72, 84].map((term) => (
                          <button
                            key={term}
                            onClick={() => setLoanTermMonths(term)}
                            className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                              loanTermMonths === term
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                            }`}
                          >
                            {term} mo
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-6 bg-surface-container-low border border-outline-variant/60 rounded-xl space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface">
                        Financing Breakdown & Amortization
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-container-lowest border border-primary/30 rounded-xl">
                          <div className="text-xs text-primary font-medium">Monthly Auto Loan Payment</div>
                          <div className="text-4xl font-extrabold font-mono text-primary mt-1 tabular-nums">
                            ${autoLoanResults.monthlyPayment} <span className="text-xs font-sans font-normal text-on-surface-variant">/mo</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            {loanTermMonths} payments @ {interestRate}% APR
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Total Interest Paid</div>
                          <div className="text-4xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            ${autoLoanResults.totalInterest}
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            Financed principal: ${autoLoanResults.netFinanced}
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Total Vehicle Outlay</div>
                          <div className="text-3xl font-extrabold font-mono text-on-surface mt-1 tabular-nums">
                            ${autoLoanResults.totalVehicleOutlay}
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            Includes loan + down payment + trade-in
                          </div>
                        </div>

                        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl">
                          <div className="text-xs text-on-surface-variant font-medium">Estimated 36-Month Lease</div>
                          <div className="text-3xl font-extrabold font-mono text-emerald-800 dark:text-emerald-300 mt-1 tabular-nums">
                            ${autoLoanResults.estimatedLeasePayment} <span className="text-xs font-sans font-normal text-on-surface-variant">/mo</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            55% residual value projection
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. EXTRACTED TOOLS DIRECTORY (25+ TOOLS)    */}
      {/* ========================================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading & Category Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary font-bold">
                Categorized Tool Suite
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                Explore All Automotive Calculators
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                All 25+ calculators across engine geometry, tire dimensions, fuel economy, vehicle financing, and race track dynamics.
              </p>
            </div>

            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-surface-container-low border border-outline-variant/50 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/60 font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] text-on-surface-variant/70 font-mono">({tab.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <div
                key={tool.slug}
                className="group relative flex flex-col justify-between p-5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider font-mono">
                      {tool.badge}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">SAE Ready</span>
                  </div>

                  <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-on-surface-variant/80 truncate max-w-[200px]">
                    {tool.formula}
                  </span>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    <span>Calculate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12 bg-surface-container-low rounded-xl border border-outline-variant">
              <Search className="w-8 h-8 text-on-surface-variant mx-auto mb-2 opacity-50" />
              <div className="text-sm font-semibold text-on-surface">No calculators found</div>
              <p className="text-xs text-on-surface-variant mt-1">Try adjusting your search query or switching categories.</p>
              <button
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                className="mt-3 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. ENGINEERING GUIDES & FORMULAS          */}
      {/* ========================================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest/50 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold mb-3 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Step-by-Step Mechanical Formulas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Automotive Engineering Calculation Guides
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Authoritative mathematical breakdowns with real-world worked examples and critical tuning guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Guide 1 */}
            <div className="p-6 bg-surface-container-lowest border border-outline-variant/60 rounded-xl space-y-4">
              <div className="text-xs font-bold text-primary uppercase tracking-wider font-mono">01. Drivetrain Math</div>
              <h3 className="text-base font-bold text-on-surface">
                Speed, Gear Ratios & Engine RPM
              </h3>

              <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-on-surface-variant">Core Equation</div>
                <div className="text-xs font-mono font-bold text-amber-950 dark:text-amber-300 mt-1">
                  RPM = (Speed in MPH × Gear Ratio × Axle Ratio × 336) ÷ Tire Diameter
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                The constant 336 is derived from 63,360 inches per mile divided by 60 minutes per hour and divided by π. This allows instant conversion between vehicle road speed and engine crankshaft rotational velocity.
              </p>

              <div className="p-3 bg-surface-container-low/70 rounded-lg border-l-2 border-primary space-y-1">
                <div className="text-[11px] font-bold text-on-surface">Worked Example:</div>
                <div className="text-xs text-on-surface-variant">
                  70 MPH cruise in 0.82 overdrive gear with 3.73 rear differential and 28&quot; tires:
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  RPM = (70 × 0.82 × 3.73 × 336) ÷ 28 = 2,569 RPM
                </div>
              </div>
            </div>

            {/* Guide 2 */}
            <div className="p-6 bg-surface-container-lowest border border-outline-variant/60 rounded-xl space-y-4">
              <div className="text-xs font-bold text-primary uppercase tracking-wider font-mono">02. Wheel Fitment</div>
              <h3 className="text-base font-bold text-on-surface">
                Speedometer Error After Tire Changes
              </h3>

              <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-on-surface-variant">Core Equation</div>
                <div className="text-xs font-mono font-bold text-amber-950 dark:text-amber-300 mt-1">
                  Speed Error % = ((New Diameter - Stock Diameter) ÷ Stock Diameter) × 100%
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Because larger tires cover more distance with each wheel rotation, your vehicle moves faster than the speedometer indicates. Speedometer error is a percentage multiplier that increases at higher speeds.
              </p>

              <div className="p-3 bg-surface-container-low/70 rounded-lg border-l-2 border-primary space-y-1">
                <div className="text-[11px] font-bold text-on-surface">Worked Example:</div>
                <div className="text-xs text-on-surface-variant">
                  Upgrading from 28.0&quot; to 33.0&quot; tires with speedometer showing 65 MPH:
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  True Speed = 65 × (33 ÷ 28) = 76.6 MPH (+17.86% error)
                </div>
              </div>
            </div>

            {/* Guide 3 */}
            <div className="p-6 bg-surface-container-lowest border border-outline-variant/60 rounded-xl space-y-4">
              <div className="text-xs font-bold text-primary uppercase tracking-wider font-mono">03. Engine Rebuilding</div>
              <h3 className="text-base font-bold text-on-surface">
                Displacement from Bore & Stroke
              </h3>

              <div className="p-3 bg-surface-container-low border border-outline-variant/40 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-on-surface-variant">Core Equation</div>
                <div className="text-xs font-mono font-bold text-amber-950 dark:text-amber-300 mt-1">
                  Displacement (CID) = π × (Bore ÷ 2)² × Stroke × Cylinders
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Total displacement represents the swept volume of all pistons traveling from Bottom Dead Center (BDC) to Top Dead Center (TDC). Multiply CID by 0.016387 to convert to Liters.
              </p>

              <div className="p-3 bg-surface-container-low/70 rounded-lg border-l-2 border-primary space-y-1">
                <div className="text-[11px] font-bold text-on-surface">Worked Example:</div>
                <div className="text-xs text-on-surface-variant">
                  Small Block V8 with 4.000&quot; bore and 3.480&quot; stroke:
                </div>
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  Volume = π × 2.0² × 3.480 × 8 = 349.85 CID (5.73 Liters)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (FAQS)      */}
      {/* ========================================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-outline-variant/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold mb-3 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Automotive Engineering FAQs
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Common questions on tire sizing, engine rebuild math, and auto financing.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What automotive tools are included in this suite?',
                a: 'Our suite includes all 5 major competitor categories: Engine & Transmission (displacement, compression ratio, carburetor CFM, horsepower, torque, RPM, gear ratio, piston speed), Wheels & Tires (tire comparison, speedometer error, offset & backspacing), Fuel Economy (MPG, trip fuel cost, L/100km conversion, EV charging), Vehicle Financing (auto loans, lease payments, true cost of ownership), and Performance (quarter-mile ET and trap speed, marine speed).',
              },
              {
                q: 'How do I calculate speedometer error when changing tire sizes?',
                a: 'Calculate the ratio of the new tire diameter divided by the stock tire diameter: Speed Ratio = New Diameter ÷ Stock Diameter. Multiply your speedometer reading by this ratio. For instance, moving from 28-inch tires to 33-inch tires increases speed by 17.86%, meaning a speedometer reading of 65 mph is actually 76.6 mph on the road.',
              },
              {
                q: 'How do you calculate Carburetor CFM for an engine?',
                a: 'Carburetor CFM = (Engine Displacement in CID × Maximum Operating RPM × Volumetric Efficiency) ÷ 3,456. A street engine typically operates at 80% to 85% volumetric efficiency, while racing engines operate at 95% to 110% with forced induction.',
              },
              {
                q: 'What is the relationship between Horsepower and Torque?',
                a: 'Horsepower (HP) and Torque (lb-ft) are related by engine speed: Horsepower = (Torque × RPM) ÷ 5,252. Torque measures rotational force, while horsepower measures how rapidly that force does work over time. At exactly 5,252 RPM, horsepower and torque curves will always intersect and be numerically equal.',
              },
              {
                q: 'How is an auto loan monthly payment calculated?',
                a: 'Monthly Payment = [Loan Amount × r × (1 + r)^n] ÷ [(1 + r)^n - 1], where r is the monthly interest rate (annual APR ÷ 12) and n is the total number of monthly payments (years × 12). Subtracting your down payment and vehicle trade-in credit reduces the financed principal.',
              },
              {
                q: 'How does tire aspect ratio affect overall tire diameter?',
                a: 'In a metric tire size like 225/65R17, 225 is the section width in millimeters, 65 is the aspect ratio (sidewall height is 65% of 225 mm = 146.25 mm or 5.76 inches), and 17 is the wheel rim diameter in inches. Total diameter = Wheel Rim + (2 × Sidewall Height).',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-950 border border-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700">
                    Q
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">
                      {faq.q}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
