'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import AutomotiveSeoSection from './AutomotiveSeoSection';
import SaveButton from '../../components/SaveButton';

const popularTools = [
  { id: 'ev-charging-cost-range', category: 'ev', title: 'EV Charging Cost & Range', icon: 'ev_station', iconBg: 'bg-secondary-fixed text-secondary', badge: 'Trending', badgeBg: 'bg-secondary-container/20 text-on-secondary-container', desc: 'Compare Level 1/2 vs DC charge times, speeds, and costs.', version: 'Exact kWh', link: '/automotive-calculators-estimators#directory-section' },
  { id: 'auto-loan-lease-payoff', category: 'loans', title: 'Auto Loan & Lease Payoff', icon: 'credit_card', iconBg: 'bg-surface-container-high text-primary', badge: 'Most Used', badgeBg: 'bg-primary-fixed text-on-primary-fixed', desc: 'Calculate loan payments, sales tax, trade-in, and payoff schedules.', version: 'Payment Plan', link: '/loans-and-amortization' },
  { id: 'gas-mileage-fuel-efficiency', category: 'fuel', title: 'Gas Mileage & Fuel Efficiency', icon: 'speed', iconBg: 'bg-tertiary-fixed text-tertiary', badge: 'Popular', badgeBg: 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant', desc: 'Convert MPG and L/100km, city/highway splits, and trip costs.', version: 'Standard Rates', link: '/fuel-economy-converter' },
  { id: 'tire-size-speedo-calibrator', category: 'tires', title: 'Tire Size & Speedo Calibrator', icon: 'donut_large', iconBg: 'bg-surface-container-high text-on-surface', badge: '4.9 ★', badgeBg: 'bg-secondary-fixed text-on-secondary-fixed', desc: 'Compare tire diameter, revs per mile, and speedo calibration.', version: 'Metric & Imperial', link: '/speed-converter' },
  { id: 'horsepower-torque-quarter-mile', category: 'engine', title: 'Horsepower, Torque & 1/4 Mile', icon: 'electric_meter', iconBg: 'bg-primary-fixed text-primary', badge: 'Top Rated', badgeBg: 'bg-surface-container-high text-on-surface', desc: 'Calculate power-to-weight, trap speed, and quarter-mile ET.', version: 'Track Tested', link: '/torque-converter' },
  { id: 'depreciation-tco-calculator', category: 'finance', title: 'Depreciation & TCO Calculator', icon: 'trending_down', iconBg: 'bg-surface-container-high text-secondary', badge: 'Finance', badgeBg: 'bg-secondary-fixed-dim text-on-secondary-fixed-variant', desc: 'Estimate 5-year depreciation, upkeep, and monthly ownership cost.', version: '5-Year Estimate', link: '/finance' },
  { id: 'gear-ratio-speed-at-rpm', category: 'powertrain', title: 'Gear Ratio & Speed at RPM', icon: 'settings', iconBg: 'bg-surface-container text-on-surface', badge: 'Powertrain', badgeBg: 'bg-surface-container-highest text-on-surface', desc: 'Map gear ratios, tire size, and theoretical speed at RPM.', version: 'Speed Mapping', link: '/engine-rpm-calculator' },
  { id: 'maintenance-interval-forecaster', category: 'maintenance', title: 'Maintenance Interval Forecaster', icon: 'build_circle', iconBg: 'bg-tertiary-fixed text-tertiary', badge: 'Fleet', badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', desc: 'Track oil life, brake pad wear, and scheduled service intervals.', version: 'Service Schedule', link: '/automotive-calculators-estimators#directory-section' },
];

const subcategories = [
  { id: 1, title: 'Engine & Performance', icon: '🏎️', count: '9 Tools', countBg: 'bg-surface-container-high', desc: 'WHP, boost CFM, compression ratio, AFR.' },
  { id: 2, title: 'Fuel Economy & Trip', icon: '⛽', count: '8 Tools', countBg: 'bg-surface-container-high', desc: 'MPG conversions, trip costs, commute spend.' },
  { id: 3, title: 'Electric Vehicle (EV)', icon: '⚡', count: '7 Tools', countBg: 'bg-secondary-fixed text-on-secondary-fixed', desc: 'kWh/mi, charge speeds, cold weather range.' },
  { id: 4, title: 'Vehicle Loans & Leasing', icon: '💳', count: '6 Tools', countBg: 'bg-surface-container-high', desc: 'Loan payoff, lease vs buy, interest savings.' },
  { id: 5, title: 'Tires, Wheels & Offset', icon: '🔘', count: '5 Tools', countBg: 'bg-surface-container-high', desc: 'Wheel offset, rim widths, tire dimensions.' },
  { id: 6, title: 'Automotive Conversions', icon: '🔄', count: '6 Tools', countBg: 'bg-surface-container-high', desc: 'Pressure, horsepower, torque, displacement.' },
  { id: 7, title: 'Maintenance & Wear', icon: '🔧', count: '5 Tools', countBg: 'bg-surface-container-high', desc: 'Brake wear, fluid capacities, service schedules.' },
  { id: 8, title: 'Fleet & Logistics', icon: '🗺️', count: '6 Tools', countBg: 'bg-surface-container-high', desc: 'Cost per mile, cargo payload, IFTA fuel tax.' },
];

const directoryCards = [
  { id: 'ev-home-public-charging', category: 'ev', tag: 'EV Suite', tagBg: 'bg-secondary-fixed text-on-secondary-fixed', updated: 'Updated 2 days ago', title: 'EV Home vs Public Charging Cost', desc: 'Compare residential Level 2 rates with DC fast-charging station costs.', rating: '4.9', link: '/automotive-calculators-estimators#directory-section' },
  { id: 'lease-residual-buyout', category: 'loans', tag: 'Finance', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated this week', title: 'Lease Residual Value vs Buyout', desc: 'Compare lease residual contract value against secondary market value.', rating: '4.8', link: '/loans-and-amortization' },
  { id: 'wheel-offset-backspacing', category: 'tires', tag: 'Tires & Wheels', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 4 days ago', title: 'Wheel Offset & Backspacing Delta', desc: 'Check suspension strut clearance and outer fender poke for new rims.', rating: '4.9', link: '/automotive-calculators-estimators#directory-section' },
  { id: 'fuel-cost-per-mile', category: 'fuel', tag: 'Fuel & MPG', tagBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', updated: 'Updated yesterday', title: 'Fuel Cost Per Mile & Trip Budget', desc: 'Estimate total fuel budget and cost per mile for road trips.', rating: '5.0', link: '/fuel-economy-converter' },
  { id: 'displacement-bore-stroke', category: 'engine', tag: 'Engine', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 1 wk ago', title: 'Displacement, Bore & Stroke Solver', desc: 'Calculate cylinder sweep volume, total displacement (cc), and CID.', rating: '4.7', link: '/engine-rpm-calculator' },
  { id: 'brake-stopping-distance', category: 'maintenance', tag: 'Maintenance', tagBg: 'bg-surface-container-high text-tertiary', updated: 'Updated 3 days ago', title: 'Brake Stopping Distance & Energy', desc: 'Compute braking distances and reaction lag on dry, wet, or icy roads.', rating: '4.8', link: '/speed-velocity-converter' },
  { id: 'battery-degradation-lifecycle', category: 'ev', tag: 'EV Suite', tagBg: 'bg-secondary-fixed text-on-secondary-fixed', updated: 'Updated 5 days ago', title: 'Battery Degradation & Lifecycle', desc: 'Forecast long-term battery health and capacity loss over time.', rating: '4.9', link: '/automotive-calculators-estimators#directory-section' },
  { id: 'bi-weekly-loan-payoff', category: 'loans', tag: 'Finance', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated this week', title: 'Bi-Weekly Loan Payoff Accelerator', desc: 'See interest savings and faster payoff with bi-weekly auto payments.', rating: '4.8', link: '/loans-and-amortization' },
  { id: 'turbocharger-cfm-pressure', category: 'engine', tag: 'Engine', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 2 wks ago', title: 'Turbocharger CFM & Pressure Ratio', desc: 'Match target boost pressure and air flow to turbo compressor limits.', rating: '4.9', link: '/pressure-converter' },
  { id: 'coolant-mix-freeze', category: 'maintenance', tag: 'Maintenance', tagBg: 'bg-surface-container-high text-tertiary', updated: 'Updated 1 wk ago', title: 'Coolant Mix & Freeze Protection', desc: 'Calculate antifreeze water ratio for freeze and boil protection.', rating: '4.6', link: '/temperature-converter' },
  { id: 'e85-vs-premium-93', category: 'fuel', tag: 'Fuel & MPG', tagBg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', updated: 'Updated 6 days ago', title: 'E85 vs Premium 93 Cost Delta', desc: 'Compare true cost-per-mile between ethanol E85 and pump gas.', rating: '4.9', link: '/fuel-economy-converter' },
  { id: 'speed-rating-load-index', category: 'tires', tag: 'Tires', tagBg: 'bg-surface-container-high text-on-surface', updated: 'Updated 3 days ago', title: 'Speed Rating & Load Index Decoder', desc: 'Decode tire speed ratings and maximum axle load capacities.', rating: '4.8', link: '/speed-converter' },
];

const trendingCards = [
  { id: 1, title: 'EV Cold Weather Range Loss', growth: '+42%', runs: '48,120 uses', desc: 'Sub-zero winter heating impact on EV driving range.', tag: 'Winter Driving' },
  { id: 2, title: 'Used Car APR vs Dealer Financing', growth: '+28%', runs: '36,400 uses', desc: 'Compare cash discounts against dealer interest rates.', tag: 'Car Financing' },
  { id: 3, title: 'Plus-Sizing Tire Rim & Clearance', growth: '+19%', runs: '24,900 uses', desc: 'Check wheel and tire clearances when sizing up rims.', tag: 'Tires & Wheels' },
  { id: 4, title: 'Turbo Boost CFM to Horsepower', growth: '+15%', runs: '19,850 uses', desc: 'Estimate horsepower gains from turbo boost levels.', tag: 'Performance' },
];

const recentCards = [
  { id: 1, title: 'NACS vs CCS1 Port Speed Estimator', version: 'v2.4', date: 'Feb 2025', desc: 'Compare charging speeds and adapter limits.' },
  { id: 2, title: 'Hybrid Battery Replacement ROI', version: 'v2.4', date: 'Jan 2025', desc: 'Analyze battery replacement cost vs fuel savings.' },
  { id: 3, title: 'Cargo Payload & Axle Distribution', version: 'v2.3', date: 'Jan 2025', desc: 'Check payload balance and axle weight limits.' },
  { id: 4, title: 'E85 Octane Rating Blender', version: 'v2.2', date: 'Dec 2024', desc: 'Calculate E85 and gas blend ratios for target octane.' },
];

const guides = [
  { id: 1, title: 'How EV Charging Curves Really Work: Peak kW vs Sustained Taper', meta: '8 min read • Technical', desc: 'Why your EV only hits 250 kW for 4 minutes: battery cell internal resistance, C-rate caps, and thermal management models.' },
  { id: 2, title: 'The Math of Tire Diameter: Why a 3% Change Throws Off Transmission Shifts', meta: '6 min read • Powertrain', desc: 'How modifying tire outer diameter affects ABS wheel speed sensors, torque converter lockup thresholds, and odometer drift.' },
  { id: 3, title: 'Lease Residual Value vs Market Price: End-of-Term Buyout Strategy', meta: '10 min read • Finance', desc: 'Formulas to model money factor conversion (APR = MF × 2400), acquisition fee amortizations, and equity buyout arbitrage.' },
  { id: 4, title: 'EPA Testing Protocols: Why Real-World Highway MPG Rarely Matches Window Stickers', meta: '7 min read • Standards', desc: 'Dissecting the 5-cycle dynamometer test, aero drag exponentially scaling with velocity, and rolling resistance.' },
];

const relatedCats = [
  { id: 1, title: 'Finance & Banking', icon: 'account_balance', iconBg: 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-on-primary', desc: 'Mortgages, compound interest, rate buy-downs, and capital expenditure amortization.', tools: '420+', linkColor: 'text-primary' },
  { id: 2, title: 'Travel & Logistics', icon: 'flight', iconBg: 'bg-surface-container-high text-secondary group-hover:bg-secondary group-hover:text-on-secondary', desc: 'Flight durations, geodesic distances, road trip fuel stops, and nautical miles.', tools: '95+', linkColor: 'text-secondary' },
  { id: 3, title: 'Electrical Engineering', icon: 'electrical_services', iconBg: 'bg-surface-container-high text-primary-container group-hover:bg-primary-container group-hover:text-on-primary-container', desc: "Wire gauge ampacity, Ohm's law, 3-phase AC voltage drop, and capacitor discharge.", tools: '115+', linkColor: 'text-primary-container' },
  { id: 4, title: 'Physics & Mechanics', icon: 'science', iconBg: 'bg-surface-container-high text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary', desc: 'Kinetic energy, centrifugal acceleration, terminal velocity, and fluid friction.', tools: '175+', linkColor: 'text-tertiary' },
];

export default function AutomotiveClient() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('popular');
  const [showCopied, setShowCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; isSaved: boolean } | null>(null);

  const handleBookmarkToggle = (title: string, isSaved: boolean) => {
    setToast({
      message: isSaved ? `"${title}" saved to your bookmarks` : `"${title}" removed from bookmarks`,
      isSaved,
    });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const openSavedModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-saved-tools-modal'));
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2500);
  };

  const filteredCards = directoryCards.filter(card => {
    const matchesCat = currentFilter === 'all' || card.category === currentFilter;
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortOrder === 'az') return a.title.localeCompare(b.title);
    if (sortOrder === 'recent') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          {/* SECTION 1: CATEGORY HERO & SEARCH BENCH */}
          <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low/60 via-surface to-surface pb-space-2xl pt-space-lg">
            <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-primary-container/5 blur-3xl pointer-events-none"></div>
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline mb-space-md">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-medium">Automotive Calculators &amp; Estimators</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm w-fit">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
                    </span>
                    <span className="font-data-mono text-data-mono text-on-surface text-[12px]">🚗 Automotive Tools • 52 Free Calculators</span>
                  </div>
                  <h1 className="font-headline-lg lg:font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold">
                    Automotive Calculators &amp; Estimators
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                    Smart vehicle ownership requires balancing monthly purchase financing, recurring fuel or electric energy costs, maintenance schedules, and long-term depreciation. Calculate fuel costs, loan payments, EV charging time, tire sizes, and ownership costs with free automotive calculators and estimators.
                  </p>

                  <div className="mt-space-sm relative flex flex-col gap-space-sm">
                    <div className="relative flex items-center bg-surface-container-lowest shadow-md rounded-xl p-1.5 focus-within:shadow-xl transition-all">
                      <span className="material-symbols-outlined text-outline ml-3 text-[22px]">search</span>
                      <input 
                        className="w-full bg-transparent px-3 py-2.5 text-on-surface font-body-md text-body-md outline-none placeholder:text-outline/70" 
                        placeholder="Search automotive calculators, formulas..." 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="hidden sm:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg mr-1 text-outline font-data-mono text-[11px]">
                        <span>⌘</span><span>K</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                      {[
                        { label: 'EV Charging Time', query: 'EV' },
                        { label: 'Auto Loan Payoff', query: 'Loan' },
                        { label: 'Tire Diameter Delta', query: 'Tire' },
                        { label: 'Gas Mileage MPG', query: 'Fuel' },
                        { label: 'Depreciation 5-Year', query: 'Depreciation' },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setSearchQuery(item.query)}
                          className="px-3 py-1 rounded-full text-[12px] font-body-sm font-medium bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors whitespace-nowrap"
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Hero Live Metric Monitor */}
                <div className="lg:col-span-5 w-full">
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border-0 space-y-space-md">
                    <div className="flex items-center justify-between border-b border-surface-container pb-space-sm">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                        <span className="font-headline-sm font-semibold text-on-surface text-[15px]">Quick Metric Estimator</span>
                      </div>
                      <span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">Standard Spec</span>
                    </div>

                    {/* Stat Card 1: Live EV Highway Model */}
                    <div className="p-space-md rounded-xl bg-surface-container-low/70 border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                          <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-bold">EV Highway Trip Cost</span>
                        </div>
                        <span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Live Estimate</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <div>
                          <span className="font-headline-lg text-headline-lg font-bold text-on-surface">32.4</span>
                          <span className="font-data-mono text-[13px] text-outline ml-1">kWh / 100 mi</span>
                        </div>
                        <div className="text-right">
                          <span className="font-data-mono text-[15px] font-semibold text-secondary">$0.048 / mi</span>
                          <span className="block font-body-sm text-[11px] text-outline">@ $0.15/kWh Home AC</span>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] font-data-mono text-outline">
                        <span>75 kWh Pack • 231 mi Range</span>
                        <a href="#popular-tools-section" className="text-primary hover:underline font-semibold">Simulate →</a>
                      </div>
                    </div>

                    {/* Stat Card 2: Gas Commute Comparison */}
                    <div className="p-space-md rounded-xl bg-surface-container-low/70 border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-tertiary text-[20px]">local_gas_station</span>
                          <span className="font-label-caps text-label-caps uppercase tracking-wider text-tertiary font-bold">Average Fuel Commute</span>
                        </div>
                        <span className="font-data-mono text-[11px] text-outline">US Avg: $3.45/gal</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <div>
                          <span className="font-headline-lg text-headline-lg font-bold text-on-surface">28.5</span>
                          <span className="font-data-mono text-[13px] text-outline ml-1">MPG Avg</span>
                        </div>
                        <div className="text-right">
                          <span className="font-data-mono text-[15px] font-semibold text-tertiary">$0.121 / mi</span>
                          <span className="block font-body-sm text-[11px] text-outline">ICE Commute</span>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] font-data-mono text-outline">
                        <span>Annual Fuel (12k mi): $1,452</span>
                        <a href="#popular-tools-section" className="text-tertiary hover:underline font-semibold">Compare →</a>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <span className="font-body-sm text-[12px] text-outline flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                        Standard EPA Fuel Economy &amp; EIA Energy Datasets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: POPULAR AUTOMOTIVE TOOLS */}
          <section id="popular-tools-section" className="py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps mb-2 uppercase">
                    Featured Tools
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Popular Automotive Tools
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Most frequently used calculators for fuel budgeting, loan payments, tire calibration, and service intervals.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 font-data-mono text-data-mono text-outline text-[13px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  <span>Tested &amp; Verified Accurate</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {popularTools.map((tool) => (
                  <div 
                    key={tool.id}
                    className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 border-0 shadow-sm hover:shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tool.iconBg}`}>
                          <span className="material-symbols-outlined text-[22px]">{tool.icon}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-label-caps text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${tool.badgeBg}`}>
                            {tool.badge}
                          </span>
                          <SaveButton
                            tool={{
                              id: tool.id,
                              title: tool.title,
                              link: tool.link,
                              category: tool.category,
                              label: tool.badge,
                              desc: tool.desc,
                              badgeClass: tool.badgeBg,
                            }}
                            variant="icon"
                            className="!w-8 !h-8 !rounded-lg"
                            onToggle={(isSaved) => handleBookmarkToggle(tool.title, isSaved)}
                          />
                        </div>
                      </div>
                      <h3 className="font-headline-md text-[17px] font-semibold text-on-surface mt-space-sm group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t-0 bg-surface-container-low/50 -mx-space-md -mb-space-md p-space-md rounded-b-xl flex items-center justify-between">
                      <span className="font-data-mono text-[11px] text-outline">{tool.version}</span>
                      <Link href={tool.link} className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-all flex items-center gap-1">
                        Open <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: SUBCATEGORY TILES */}
          <section className="py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Browse by Category</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                  Explore by Category
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Find the right calculator organized by topic and vehicle needs.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {subcategories.map((sub) => (
                  <div 
                    key={sub.id} 
                    onClick={() => {
                      if (sub.id === 1) setCurrentFilter('engine');
                      else if (sub.id === 2) setCurrentFilter('fuel');
                      else if (sub.id === 3) setCurrentFilter('ev');
                      else if (sub.id === 4) setCurrentFilter('loans');
                      else if (sub.id === 5) setCurrentFilter('tires');
                      else if (sub.id === 7) setCurrentFilter('maintenance');
                      else setCurrentFilter('all');
                      const elem = document.getElementById('directory-section');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 border-0 shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[26px]">{sub.icon}</span>
                      <span className={`font-data-mono text-[11px] px-2 py-0.5 rounded font-semibold ${sub.countBg}`}>
                        {sub.count}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-[17px] font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {sub.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {sub.desc}
                    </p>
                    <div className="mt-3 text-primary text-[12px] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Calculators <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: DIRECTORY GRID WITH FILTERS */}
          <section id="directory-section" className="py-space-2xl bg-surface-container-low/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Automotive Calculators Directory
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                    Filter across 52 verified calculators by system discipline or use-case.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="font-body-sm text-body-sm text-outline">Sort:</span>
                  <select 
                    aria-label="Sort calculators"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-surface-container-lowest text-on-surface text-body-sm px-3 py-1.5 rounded-lg border-0 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="recent">Recently Added</option>
                    <option value="az">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-space-md no-scrollbar">
                {[
                  { key: 'all', label: 'All Disciplines' },
                  { key: 'ev', label: 'EV & High Voltage' },
                  { key: 'loans', label: 'Loans & Financing' },
                  { key: 'fuel', label: 'Fuel Economy & Trip' },
                  { key: 'tires', label: 'Tires & Wheels' },
                  { key: 'engine', label: 'Engine & Performance' },
                  { key: 'maintenance', label: 'Maintenance & Wear' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCurrentFilter(tab.key)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-lg text-body-sm font-medium transition-all whitespace-nowrap ${
                      currentFilter === tab.key 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {filteredCards.map((card) => (
                  <div 
                    key={card.id}
                    className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 border-0 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-label-caps text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${card.tagBg}`}>
                          {card.tag}
                        </span>
                        <span className="font-data-mono text-[11px] text-outline">{card.updated}</span>
                      </div>
                      <h3 className="font-headline-md text-[17px] font-semibold text-on-surface mt-1">
                        {card.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-snug">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t-0 bg-surface-container-low/40 -mx-space-md -mb-space-md p-space-md rounded-b-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-secondary">star</span>
                        <span className="font-data-mono text-[12px] font-semibold text-on-surface">{card.rating}</span>
                        <SaveButton
                          tool={{
                            id: card.id,
                            title: card.title,
                            link: card.link,
                            category: card.category,
                            label: card.tag,
                            desc: card.desc,
                            badgeClass: card.tagBg,
                          }}
                          variant="icon"
                          className="!w-7 !h-7 !rounded-lg ml-1"
                          onToggle={(isSaved) => handleBookmarkToggle(card.title, isSaved)}
                        />
                      </div>
                      <Link 
                        href={card.link}
                        className="px-3 py-1 rounded-lg bg-primary text-on-primary font-body-sm text-[13px] font-medium hover:bg-on-primary-fixed-variant transition-all"
                      >
                        Open ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCards.length === 0 && (
                <div className="p-space-2xl text-center bg-surface-container-lowest rounded-2xl shadow-sm">
                  <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mt-2">No matching calculators found</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Try refining your search keyword or clearing the discipline filter.</p>
                  <button 
                    onClick={() => { setCurrentFilter('all'); setSearchQuery(''); }}
                    className="mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5: TRENDING THIS WEEK */}
          <section className="py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center justify-between mb-space-lg">
                <div>
                  <span className="font-label-caps text-label-caps px-2.5 py-1 rounded bg-secondary-container/20 text-on-secondary-container font-semibold uppercase">
                    Most Popular
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                    Trending This Week
                  </h2>
                </div>
                <div className="font-data-mono text-[12px] text-outline hidden sm:block">
                  Live Usage Statistics
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {trendingCards.map((card) => (
                  <div key={card.id} className="p-space-md rounded-2xl bg-surface-container-lowest border-0 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-data-mono text-[12px] font-bold text-secondary bg-secondary-container/10 px-2 py-0.5 rounded">
                          {card.growth} this week
                        </span>
                        <span className="font-data-mono text-[11px] text-outline">{card.runs}</span>
                      </div>
                      <h3 className="font-headline-md text-[16px] font-semibold text-on-surface mt-2.5 leading-snug">
                        {card.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {card.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 flex items-center justify-between border-t-0 bg-surface-container-low p-2.5 rounded-lg">
                      <span className="font-label-caps text-[10px] text-outline uppercase font-semibold">{card.tag}</span>
                      <a className="text-primary font-medium text-body-sm hover:underline flex items-center text-[13px]" href="#">Calculate <span className="material-symbols-outlined text-[14px]">chevron_right</span></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 6: RECENTLY ADDED */}
          <section className="py-space-2xl bg-surface-container-low/50">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-lg">
                <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Engineering Updates</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                  Recently Added Calculators
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {recentCards.map((card) => (
                  <div key={card.id} className="p-space-md rounded-2xl bg-surface-container-lowest border-0 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">{card.version}</span>
                        <span className="font-data-mono text-[11px] text-outline">{card.date}</span>
                      </div>
                      <h3 className="font-headline-md text-[16px] font-semibold text-on-surface mt-2">
                        {card.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {card.desc}
                      </p>
                    </div>
                    <a className="inline-flex items-center gap-1 text-primary text-[13px] font-medium mt-3 hover:underline" href="#">
                      Try Calculator →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: EDITORIAL GUIDES */}
          <section className="py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">Helpful Resources</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold mt-1">
                  Helpful Guides &amp; Explanations
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Clear explanations and practical formulas behind everyday automotive calculations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {guides.map((guide) => (
                  <div key={guide.id} className="rounded-2xl bg-surface-container-lowest border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group">
                    <div className="p-space-md">
                      <span className="font-data-mono text-[11px] text-outline font-semibold uppercase">{guide.meta}</span>
                      <h3 className="font-headline-md text-[16px] font-semibold text-on-surface mt-2 group-hover:text-primary transition-colors leading-snug">
                        {guide.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        {guide.desc}
                      </p>
                    </div>
                    <div className="p-space-md pt-0 bg-surface-container-low/30">
                      <div className="pt-3 border-t-0 flex items-center justify-between text-[12px] font-body-sm text-outline">
                        <span className="font-medium text-on-surface">Guide</span>
                        <span className="text-primary font-semibold group-hover:underline">Read Guide →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 8: RELATED CATEGORIES */}
          <section className="py-space-2xl bg-surface-container-low/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Related Calculator Categories
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Explore other calculators that connect with your vehicle and travel planning.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {relatedCats.map((cat) => (
                  <a key={cat.id} href="#" className="p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all border-0 shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors mb-3 ${cat.iconBg}`}>
                        <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                      </div>
                      <h3 className="font-headline-md text-[17px] font-semibold text-on-surface">{cat.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                        {cat.desc}
                      </p>
                    </div>
                    <div className={`mt-4 pt-2 font-data-mono text-[12px] font-medium flex items-center gap-1 ${cat.linkColor}`}>
                      {cat.tools} Tools <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 9: COMPREHENSIVE SEO CONTENT, 15-QUESTION FAQ ACCORDION & SCHEMAS */}
          <AutomotiveSeoSection />

          {/* SECTION 10: BOTTOM CTA */}
          <section className="py-space-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop text-center relative z-10">
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">directions_car</span>
                </div>
                <h2 className="font-headline-lg lg:font-display-hero text-headline-lg lg:text-[42px] font-bold text-on-surface tracking-tight">
                  Accurate Automotive Calculations, Anytime
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm max-w-2xl">
                  Free, instant car and truck calculators with no sign-ups or ads required. Save results or use on the go on any device.
                </p>
                <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-sm">
                  <Link href="#directory-section" className="px-6 py-3 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-on-primary-fixed-variant transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <span>Explore All 52 Calculators</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </Link>
                  <button onClick={handleShare} className="px-6 py-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md font-medium hover:bg-surface-bright transition-all shadow-sm flex items-center gap-2" type="button">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Share Hub</span>
                  </button>
                </div>
                <div className="mt-space-2xl pt-space-md grid grid-cols-2 md:grid-cols-4 gap-space-md w-full border-t-0 bg-surface-container-lowest/60 backdrop-blur-md p-space-md rounded-xl shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">speed</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">Instant Results</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time instant calculation</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-secondary text-[24px]">lock</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">100% Private</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">No tracking or data collection</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary-container text-[24px]">devices</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">Mobile &amp; Desktop</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Instant access anywhere, anytime</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
                    <span className="font-headline-md text-[16px] font-bold text-on-surface mt-1">Standard Industry Specs</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Standard vehicle specs</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {showCopied && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-on-surface text-surface shadow-lg text-body-sm font-medium transition-all">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* Live Interactive Bookmark Toast */}
        {toast && (
          <aside
            aria-label="Bookmark notification"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-highest text-on-surface border border-outline-variant/60 shadow-xl backdrop-blur-md"
          >
            <span className={`material-symbols-outlined text-[20px] ${toast.isSaved ? 'text-primary' : 'text-outline'}`}>
              {toast.isSaved ? 'bookmark_added' : 'bookmark_remove'}
            </span>
            <span className="font-body-sm text-body-sm font-medium">
              {toast.message}
            </span>
            {toast.isSaved && (
              <button
                type="button"
                onClick={openSavedModal}
                className="ml-1 text-primary font-semibold text-body-sm hover:underline cursor-pointer"
              >
                View Saved
              </button>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg ml-1"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </aside>
        )}
      </main>
    </>
  );
}
