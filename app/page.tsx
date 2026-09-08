'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Static Data ---
const categoriesData = [
  { title: 'Finance', link: '/finance', icon: 'payments', iconBg: 'bg-primary-fixed text-primary', count: '420+', desc: 'Mortgages, investment portfolios, tax brackets, compounding schedules, and loans.', tags: ['SIP', 'Mortgage', '401(k)', 'CAGR', 'FIRE'] },
  { title: 'Health', link: '/health', icon: 'vital_signs', iconBg: 'bg-error-container text-error', count: '180+', desc: 'BMR, macro split, target heart rate, body fat percentages, and hydration levels.', tags: ['BMI', 'TDEE', 'Calorie Deficit'] },
  { title: 'Math', link: '/math', icon: 'square_foot', iconBg: 'bg-secondary-fixed text-secondary', count: '500+', desc: 'Algebra, fractions, standard deviations, prime factors, and matrix manipulation.', tags: ['Percentage', 'Fraction', 'Standard Dev'] },
  { title: 'Conversion', link: '/conversions', icon: 'swap_horiz', iconBg: 'bg-surface-container-highest text-on-surface', count: '260+', desc: 'Seamless transformation between metric, imperial, nautical, pressure, and energy.', tags: ['Length', 'Mass', 'Volume'] },
  { title: 'Date & Time', link: '/time-date', icon: 'schedule', iconBg: 'bg-primary-fixed text-primary', count: '104+', desc: 'Chronological age, business day subtractors, time zone deltas, and calendar shifts.', tags: ['Age Diff', 'Working Days', 'Time Zones'] },
  { title: 'Home & Construction', link: '/home-construction', icon: 'construction', iconBg: 'bg-tertiary-fixed text-tertiary', count: '500+', desc: 'Deterministic concrete slab yardage, roof pitch, framing lumber, drywall, and renovations.', tags: ['Concrete', 'Square Feet', 'Roof Pitch'] },
  { title: 'Education', link: '/education', icon: 'school', iconBg: 'bg-secondary-fixed-dim text-on-secondary-fixed-variant', count: '500+', desc: 'Deterministic grade estimators, weighted GPA models, final exam solvers, attendance buffers, and citations.', tags: ['GPA', 'Final Grade', 'Percentile'] },
  { title: 'Business', link: '/business', icon: 'domain', iconBg: 'bg-primary-fixed text-primary', count: '350+', desc: 'Break-even volume, startup runway, SaaS Rule of 40, profit margins, markup, and ecommerce unit economics.', tags: ['Margin', 'Burn Rate', 'Break-Even'] },
  { title: 'Electrical', link: '/electrical', icon: 'electric_bolt', iconBg: 'bg-primary-fixed text-primary', count: '300+', desc: "Wire gauge sizing, voltage drop, 3-phase power, transformer FLA, motor inrush, and solar battery storage.", tags: ["Ohm's Law", 'AWG Sizing', 'kW to Amps'] },
  { title: 'Automotive', link: '/automotive', icon: 'directions_car', iconBg: 'bg-surface-container-highest text-on-surface-variant', count: '90+', desc: 'Fuel economy vs EV kWh efficiency, auto loan depreciation, and gear ratios.', tags: ['MPG / EV', 'Lease vs Buy', 'Tire Size'] },
  { title: 'Science', link: '/science', icon: 'science', iconBg: 'bg-secondary-fixed text-secondary', count: '500+', desc: 'Interactive physics, chemistry, biology, earth science, and laboratory problem solvers.', tags: ['Molarity', 'Velocity', 'Half-Life'] },
  { title: 'Technology', link: '/technology', icon: 'terminal', iconBg: 'bg-primary-fixed text-primary', count: '500+', desc: 'Subnet CIDR masks, bandwidth download speeds, aspect ratios, RAID arrays, and cryptographic entropy.', tags: ['Subnet IPv4', 'Bitrate', 'Aspect Ratio'] },
];

const trendingData = [
  { id: 1, title: 'BMI Calculator', desc: 'Adult & child metric/imperial body mass index with tailored WHO thresholds.', rating: '4.9', views: '1.4M VIEWS/MO', time: '2 DAYS AGO', tagBg: 'bg-primary/10 text-primary', link: '/health#bmi-card', linkText: 'Open Calculator', linkIcon: 'arrow_forward', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
  { id: 2, title: 'Age Calculator', desc: 'Exact chronometric duration down to seconds, zodiac signatures, and next milestone.', rating: '5.0', views: '2.1M VIEWS/MO', time: 'UPDATED TODAY', tagBg: 'bg-primary/10 text-primary', link: '#interactive-age-calc', linkText: 'Try Live Below', linkIcon: 'south', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
  { id: 3, title: 'SIP Calculator', desc: 'Systematic investment compounder with inflation adjustments and step-up options.', rating: '4.9', views: '980K VIEWS/MO', time: '3 DAYS AGO', tagBg: 'bg-surface-container text-on-surface-variant', link: '/finance#investment-section', linkText: 'Open Calculator', linkIcon: 'arrow_forward', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
  { id: 4, title: 'EMI Calculator', desc: 'Monthly loan installments with complete multi-year principal/interest payoff schedules.', rating: '4.8', views: '1.2M VIEWS/MO', time: '1 WEEK AGO', tagBg: 'bg-surface-container text-on-surface-variant', link: '/finance#loans-section', linkText: 'Open Calculator', linkIcon: 'arrow_forward', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
  { id: 5, title: 'GST Calculator', desc: 'Inclusive & exclusive Goods and Services Tax splits across standard corporate rates.', rating: '4.8', views: '850K VIEWS/MO', time: 'YESTERDAY', tagBg: 'bg-surface-container text-on-surface-variant' },
  { id: 6, title: 'Percentage Calculator', desc: '3-in-1 tool: percentage difference, relative increase/decrease, and partial shares.', rating: '4.9', views: '1.8M VIEWS/MO', time: '4 DAYS AGO', tagBg: 'bg-surface-container text-on-surface-variant', link: '/math#quick-solve', linkText: 'Open Calculator', linkIcon: 'arrow_forward', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
  { id: 7, title: 'Mortgage Calculator', desc: 'Property tax, PMI, HOA fees, and homeowner insurance integrated payment solver.', rating: '4.9', views: '1.1M VIEWS/MO', time: '5 DAYS AGO', tagBg: 'bg-surface-container text-on-surface-variant', link: '/finance#loans-section', linkText: 'Open Calculator', linkIcon: 'arrow_forward', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
  { id: 8, title: 'Scientific Suite', desc: 'Trigonometry, logarithms, factorials, parentheses stack parsing with LaTeX view.', rating: '5.0', views: '1.5M VIEWS/MO', time: 'JUST NOW', tagBg: 'bg-surface-container text-on-surface-variant', link: '/math#quick-solve', linkText: 'Open Calculator', linkIcon: 'arrow_forward', linkBg: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant' },
];

const purposeData = [
  { title: 'Save Money', icon: 'savings', iconBg: 'bg-primary-fixed text-primary', desc: 'Design emergency funds, model monthly compounding yields, and curb lifestyle creep.', links: ['Compound Interest Tool', 'Emergency Fund Target'], categoryLink: '/finance#savings-section' },
  { title: 'Lose Weight', icon: 'monitor_weight', iconBg: 'bg-error-container text-error', desc: 'Calculate strict daily caloric deficits without nutritional deficiency or fatigue.', links: ['Caloric Deficit Planner', 'Target Date Projector'], categoryLink: '/health' },
  { title: 'Track Fitness', icon: 'fitness_center', iconBg: 'bg-secondary-fixed text-secondary', desc: 'Balance macronutrient grams, aerobic VO2 max estimates, and one-rep strength maximums.', links: ['Macro Split Calculator', 'One-Rep Max (1RM)'], categoryLink: '/health' },
  { title: 'Buy A Home', icon: 'real_estate_agent', iconBg: 'bg-surface-container-highest text-on-surface', desc: 'Estimate true mortgage affordability with down payments, escrow, and closing costs.', links: ['Home Affordability Index', 'Down Payment Timeline'], categoryLink: '/finance#loans-section' },
  { title: 'Plan Retirement', icon: 'beach_access', iconBg: 'bg-primary-fixed-dim text-primary', desc: 'Compute nest-egg drawdown horizons, 4% safe withdrawal limits, and Roth IRA values.', links: ['FIRE Movement Calculator', '401(k) Match Optimizer'], categoryLink: '/fire-forecaster' },
  { title: 'Calculate Taxes', icon: 'receipt_long', iconBg: 'bg-tertiary-fixed text-tertiary', desc: 'Evaluate marginal brackets, 2025 standard deductions, and state tax deltas.', links: ['2025 Income Tax Bracket', 'Capital Gains Tax Suite'], categoryLink: '/finance#directory-clusters' },
  { title: 'Study Better', icon: 'auto_stories', iconBg: 'bg-secondary-fixed text-secondary', desc: 'Forecast needed final exam scores, convert semester credit hours, and track GPA.', links: ['Final Exam Score Needed', 'Cumulative GPA Tool'], categoryLink: '/education' },
  { title: 'Build A House', icon: 'architecture', iconBg: 'bg-surface-container-highest text-on-surface', desc: 'Compute yardages for concrete foundation pours, lumber needs, and drywall sheets.', links: ['Concrete Yardage Tool', 'Drywall & Stud Estimator'], categoryLink: '/home-construction' },
];

const collectionData: Record<string, Array<{title: string, badge: string, badgeBg: string, formula: string, desc: string, btnText: string, link?: string}>> = {
  finance: [
    { title: 'EMI Suite', link: '/finance#loans-section', badge: 'Formula Verified', badgeBg: 'bg-surface-container-highest text-primary', formula: 'P × r × (1 + r)ⁿ / ((1 + r)ⁿ - 1)', desc: 'Solves monthly repayment schedules across fixed and variable mortgage rates.', btnText: 'Launch EMI Suite' },
    { title: 'SIP & Recurring', link: '/finance#investment-section', badge: 'Formula Verified', badgeBg: 'bg-surface-container-highest text-primary', formula: 'M × {[(1 + i)ⁿ - 1] / i} × (1 + i)', desc: 'Models dollar-cost averaging mutual funds with annualized growth rate toggles.', btnText: 'Open SIP Tool' },
    { title: 'CAGR & ROI', link: '/finance#investment-section', badge: 'Formula Verified', badgeBg: 'bg-surface-container-highest text-primary', formula: '(Ending / Beginning)^(1/n) - 1', desc: 'Calculates smoothed geometric annual returns across irregular historical horizons.', btnText: 'Launch CAGR Tool' },
  ],
  health: [
    { title: 'BMI WHO Metric', link: '/health/bmi', badge: 'ISO Standard', badgeBg: 'bg-surface-container-highest text-secondary', formula: 'Weight (kg) / [Height (m)]²', desc: 'Computes anthropometric body mass with prime metric adjustment factors.', btnText: 'Launch BMI Suite' },
    { title: 'Mifflin-St Jeor BMR', link: '/health#bmr-card', badge: 'Clinical Grade', badgeBg: 'bg-surface-container-highest text-secondary', formula: '10W + 6.25H - 5A (+5 or -161)', desc: 'High precision basal metabolic rate accounting for biological sex differences.', btnText: 'Launch BMR Suite' },
    { title: 'U.S. Navy Body Fat', link: '/health#navy-card', badge: 'Anthropometric', badgeBg: 'bg-surface-container-highest text-secondary', formula: '86.010×log10(abdomen-neck) - ...', desc: 'Circumference-based body fat calculation without expensive DEXA scans.', btnText: 'Launch Body Fat Tool' },
  ],
  math: [
    { title: 'Percentage Delta', link: '/math#quick-solve', badge: 'Exact', badgeBg: 'bg-surface-container-highest text-primary', formula: '|(V2 - V1)| / ((V1 + V2) / 2) × 100', desc: 'Evaluates percentage of difference versus standard baseline percentage increases.', btnText: 'Launch Percentage Tool' },
    { title: 'Fraction Simplifier', link: '/math#quick-solve', badge: 'Euclidean', badgeBg: 'bg-surface-container-highest text-primary', formula: 'gcd(a, b) recursively computed', desc: 'Step-by-step reduction, mixed fractions, and improper decimal equivalents.', btnText: 'Launch Fractions' },
    { title: 'Matrix Determinant', link: '/math#directory', badge: 'Linear Algebra', badgeBg: 'bg-surface-container-highest text-primary', formula: 'det(A) = ∏ diag(U)', desc: 'Instant matrix inversion, determinants, and eigenvalues up to 8x8 order.', btnText: 'Launch Matrix Solver' },
  ],
  conversion: [
    { title: 'Universal Metric-Imperial', badge: 'NIST Standard', badgeBg: 'bg-surface-container-highest text-primary', formula: '1 in = 0.0254 m (exact)', desc: 'Precision transformation across micrometers, feet, meters, fathoms, and leagues.', btnText: 'Launch Distance Tool' },
    { title: 'Temperature Thermodynamic', badge: 'Kelvin / Rankine', badgeBg: 'bg-surface-container-highest text-primary', formula: 'K = °C + 273.15 • °F = 1.8(K - 273) + 32', desc: 'Seamless temperature scale transitions with absolute zero bounds.', btnText: 'Launch Temperature' },
    { title: 'Data & Bandwidth', badge: 'IEC / JEDEC', badgeBg: 'bg-surface-container-highest text-primary', formula: '1024 KiB vs 1000 KB splits', desc: 'Network throughput vs real hard drive storage capacity calculators.', btnText: 'Launch Data Converter' },
  ]
};

const leaderboardData = [
  { rank: 1, title: 'Age & Chronological Duration', badge: 'Trending #1', badgeBg: 'bg-primary-fixed text-primary', desc: 'Category: Date & Time • Precision Leap Year Solver', count: '482,920', link: '#interactive-age-calc', numBg: 'bg-primary text-on-primary' },
  { rank: 2, title: 'Scientific Matrix & Function Calculator', badge: 'Academic', badgeBg: 'bg-secondary-fixed text-secondary', desc: 'Category: Math • IEEE-754 Precision Float Execution', count: '391,140', numBg: 'bg-surface-container-highest text-on-surface' },
  { rank: 3, title: 'Mortgage Payment & Amortization Suite', badge: 'Real Estate', badgeBg: 'bg-surface-container-high text-on-surface', desc: 'Category: Finance • Escrow & Tax Integration', count: '318,450', numBg: 'bg-surface-container-highest text-on-surface' },
  { rank: 4, title: 'Body Mass Index (BMI) & Ideal Body Weight', badge: 'Health', badgeBg: 'bg-surface-container-high text-on-surface', desc: 'Category: Health • WHO Standardized Bounds', count: '284,010', link: '/health/bmi', numBg: 'bg-surface-container-highest text-on-surface' },
  { rank: 5, title: 'Goods & Services Tax (GST/VAT) Splitter', badge: 'Taxation', badgeBg: 'bg-surface-container-high text-on-surface', desc: 'Category: Business • Multi-Tiered Invoicing Solver', count: '249,700', numBg: 'bg-surface-container-highest text-on-surface' },
];

const trustData = [
  { title: 'Accurate Formulas', icon: 'verified', iconBg: 'bg-primary-fixed text-primary', desc: 'Cross-referenced with IEEE 754 floating-point arithmetic standards, NIST metrology constants, and national banking frameworks.' },
  { title: 'Expert Reviewed', icon: 'psychology', iconBg: 'bg-secondary-fixed text-secondary', desc: 'Every computational workflow is audited by certified public accountants, clinical dietitians, and structural engineers.' },
  { title: 'Sub-0.02s Execution', icon: 'speed', iconBg: 'bg-surface-container-highest text-on-surface', desc: 'Zero network lag. Calculations compile in memory natively on your CPU with zero round-trip server latency.' },
  { title: 'Mobile Ergonomics', icon: 'devices', iconBg: 'bg-surface-container-highest text-primary', desc: 'Bespoke keypads, tactile micro-feedback, and sticky result sidecars designed specifically for one-handed mobile use.' },
  { title: 'Free Forever', icon: 'all_inclusive', iconBg: 'bg-primary-fixed-dim text-primary', desc: 'No subscriptions, no artificial credit gates, no mandatory registrations. Public-utility computational software for all.' },
  { title: 'Absolute Privacy', icon: 'shield_person', iconBg: 'bg-error-container text-error', desc: 'Your personal net worth, body measurements, and loan values never leave your browser sandbox. Pure local processing.' },
];

const dirCardsData = [
  { id: 1, category: 'finance', link: '/finance#loans-section', name: 'Mortgage Payment Calculator', title: 'Mortgage Payment', rating: '4.9', count: '14.2k', desc: 'Calculates fixed rate and adjustable rate home loan amortization with escrow.', time: '1 MIN', badgeClass: 'bg-primary-fixed text-primary', label: 'Finance' },
  { id: 2, category: 'health', link: '/health/bmi', name: 'BMI & Body Composition', title: 'BMI & Body Composition', rating: '4.9', count: '28.4k', desc: 'Standardized clinical BMI assessment paired with healthy weight boundary targets.', time: '30 SEC', badgeClass: 'bg-error-container text-error', label: 'Health' },
  { id: 3, category: 'math', link: '#search-section', name: 'Percentage Change & Delta', title: 'Percentage Change', rating: '4.8', count: '9.1k', desc: 'Calculates positive and negative rate adjustments, absolute deltas, and markups.', time: '10 SEC', badgeClass: 'bg-secondary-fixed text-secondary', label: 'Math' },
  { id: 4, category: 'finance', link: '/finance#investment-section', name: 'SIP Return Calculator', title: 'SIP Return Compounder', rating: '4.9', count: '18.1k', desc: 'Multi-year systematic mutual fund projections with historical indexing benchmarks.', time: '1 MIN', badgeClass: 'bg-primary-fixed text-primary', label: 'Finance' },
  { id: 5, category: 'construction', link: '/home-construction#concrete-calc', name: 'Concrete Volume & Yardage', title: 'Concrete Volume & Bags', rating: '4.7', count: '7.2k', desc: 'Calculates cubic yards needed for slabs, footings, and cylindrical post holes.', time: '45 SEC', badgeClass: 'bg-tertiary-fixed text-tertiary', label: 'Construction' },
  { id: 6, category: 'conversion', link: '/conversions', name: 'Pressure & Force Units', title: 'Pressure & Pascals', rating: '4.8', count: '5.9k', desc: 'Psi, bar, atmospheres, torr, and Pascals across high-precision industrial ranges.', time: '20 SEC', badgeClass: 'bg-surface-container-highest text-on-surface', label: 'Conversion' }
];

const guidesData = [
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDllesVYk8yWvqOLZMwItT0hwUeSeuncdJfOFYVRxMb8hwLumcYA7PASgf31Q8iTQBHoNVGSfFDxbsSNK3xTtO0tQpLvL9JBx4i5Llv93kj17tYOq1DxxDWRw8_2RmTTLr3u3AynOyFE5hloje6v2Rq6Sj5JQKxn791hFimPv5J0f2_jpo7qJc3EWzj0P9-3mtex9SqKyaRO6R0y0ww9EaE4ylgFxVmsvYn2p4Z0bL2hiFcyr6Pxfpl', category: 'HEALTH', time: '6 MIN READ', title: 'How To Calculate BMI: Formula, Categories & Limitations', desc: 'Why Quetelet index works for large demographics but under-reports muscular density.', author: 'Dr. Elena Vance, MD' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCd1ZKPAUZ7iRTMLwfKpjxiQfoMiutFjq_B5cwIFYJHaX0jaMcVkqnjPhGnOxzcZ7K6JgqlbA4_LiLyFRwf6g4ZfAx5kVDYY7HSFWsNhM9HhJ_1ipEb4wanXcdOWA0E3F8GwQ786AVduAVGXo62ibt_AmEVEGAVnCSqz65WNJVFvxgyZ57oV0kIXVSIY9aNvxcSao9xowQ2Njph8OOYuWhW9UroXPF2niK2yT2i-NR1adMZ1ZHgSWg', category: 'FINANCE', time: '8 MIN READ', title: 'How EMI Works: The Mathematical Breakdown of Amortization', desc: 'Unpacking the reducing balance method and how bi-weekly payments shave 6+ years off loans.', author: 'Marcus Sterling, CFA' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6cYebK_zP7xlEmYArd8wkHbLIff_TxeqBhj2CONK21czpLC_AOGbNUpZdj-uz2H3U1i7BAmPBoWszgffhIE5ttXcBsj39apLpn0hBE74a1nhL2bxIMBLdCw7el3XvhIvS60OFY5KEymumQ65v2adjtRTaJKnmMEoaePbaLBDqrF0L9vkKaSrvFudC5mu-wkOTyAXL43VsscHKHWM791Gqm68AAD8b2vr-PJounsTv5hkk6mkTa8ID', category: 'BUSINESS', time: '5 MIN READ', title: 'Understanding GST: Step-by-Step Calculation for Buyers & Sellers', desc: 'Reverse tax math demystified: extracting inclusive base costs and input credit pass-throughs.', author: 'Priya Patel, CPA' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArLhDDxda_VQQYngRsiT2gQLF-uoZ5mzrbVfe3oWYbJkcjszs0pPGiKBPiENi6Ax7l233RjYJK9FJf1S538jCVhyc0igU-A2vsUC1VwqDyeQCnr3oBaQfFIMwCzapyaVK2_WKGnAzyoQQEA1z2UO76yQc2CQwqiX47hy7MJu7S3d0eBzVb9tlnuUIIeFvvw90Sp7pjOIOp8lx3s5CeZ-Mdv6dGrgjXgkCbJhOUEHEkW_03zEk0ZbBn', category: 'INVESTING', time: '7 MIN READ', title: 'Investment Planning Basics: The Power of Compound Interest & SIP', desc: 'The exponential arithmetic of reinvested dividends modeled over 10, 20, and 30-year horizons.', author: 'Arthur Pendelton, Quant' },
];

export default function HomePage() {
  const [collectionTab, setCollectionTab] = useState('finance');
  const [heroSearch, setHeroSearch] = useState('');
  
  // Interactive Age Calculator State
  const [calcDob, setCalcDob] = useState('1998-06-15');
  const [calcTarget, setCalcTarget] = useState('');
  const [ageRes, setAgeRes] = useState({
    years: 26, months: 8, days: 14,
    totalMonths: 320, totalWeeks: 1393, totalDays: 9754, totalHours: 234096,
    nextBday: 'In 108 days (Monday)', zodiac: 'Gemini (Air Element)'
  });

  // Directory Filter State
  const [dirSearch, setDirSearch] = useState('');
  const [dirCategory, setDirCategory] = useState('all');
  const [dirSort, setDirSort] = useState('popular');

  // Initialization
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const t = setTimeout(() => setCalcTarget(today), 0);
    return () => clearTimeout(t);
  }, []);

  // Age Calculation Logic
  useEffect(() => {
    if (!calcDob || !calcTarget) return;
    const birthDate = new Date(calcDob);
    const targetDate = new Date(calcTarget);
    if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime()) || birthDate > targetDate) return;

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = targetDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMonths = (years * 12) + months;

    const currentYear = targetDate.getFullYear();
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < targetDate) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    const bdayDiffDays = Math.ceil((nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const nextDayName = dayNames[nextBirthday.getDay()];

    const m = birthDate.getMonth() + 1;
    const d = birthDate.getDate();
    let zodiac = 'Gemini (Air Element)';
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) zodiac = 'Aries (Fire Element)';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) zodiac = 'Taurus (Earth Element)';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) zodiac = 'Gemini (Air Element)';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) zodiac = 'Cancer (Water Element)';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) zodiac = 'Leo (Fire Element)';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) zodiac = 'Virgo (Earth Element)';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) zodiac = 'Libra (Air Element)';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) zodiac = 'Scorpio (Water Element)';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) zodiac = 'Sagittarius (Fire Element)';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) zodiac = 'Capricorn (Earth Element)';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) zodiac = 'Aquarius (Air Element)';
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) zodiac = 'Pisces (Water Element)';

    const t = setTimeout(() => setAgeRes({
      years, months, days,
      totalMonths, totalWeeks, totalDays, totalHours,
      nextBday: `In ${bdayDiffDays} days (${nextDayName})`,
      zodiac
    }), 0);
    return () => clearTimeout(t);
  }, [calcDob, calcTarget]);

  const applyQuickSearch = (term: string) => {
    setHeroSearch(term);
    setDirSearch(term);
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredDirectory = useMemo(() => {
    return dirCardsData.filter(c => {
      const matchCat = dirCategory === 'all' || c.category === dirCategory;
      const matchSearch = dirSearch === '' || c.name.toLowerCase().includes(dirSearch.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (dirSort === 'az') return a.name.localeCompare(b.name);
      if (dirSort === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });
  }, [dirSearch, dirCategory, dirSort]);

  return (
    <>
      <Header />
      <main className="w-full pt-[98px] bg-background min-h-[calc(100vh-380px)]">
        <div className="flex flex-col w-full">
          
          {/* ================= SECTION 1: HERO ================= */}
          <section className="relative w-full overflow-hidden bg-surface py-space-2xl md:py-space-3xl">
            <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] transition-all duration-1000"></div>
            <div className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-secondary-container/20 blur-[130px]"></div>
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-[400px] w-[400px] rounded-full bg-primary-fixed/25 blur-[100px]"></div>
            
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Left Hero Content */}
                <div className="lg:col-span-7 flex flex-col items-start space-y-space-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span>Every Calculation. One Place.</span>
                  </div>
                  <h1 className="font-headline-lg md:font-display-hero text-headline-lg md:text-display-hero text-on-surface tracking-tight leading-[1.08]">
                    Find The Perfect <br className="hidden sm:inline"/>Calculator For <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">Any Problem</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                    Explore thousands of free calculators for finance, health, math, business, education, construction, science, and everyday life. Zero paywalls. Zero latency.
                  </p>
                  
                  {/* Large Intelligent Search Bar */}
                  <div className="w-full max-w-2xl mt-space-sm">
                    <div className="relative flex items-center w-full rounded-2xl bg-surface-container-lowest shadow-xl p-2 transition-all duration-200">
                      <span className="material-symbols-outlined text-primary text-[24px] ml-3 mr-2">search</span>
                      <input 
                        type="text" 
                        value={heroSearch}
                        onChange={e => setHeroSearch(e.target.value)}
                        placeholder="Search calculators, converters, formulas..." 
                        className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none py-2" 
                      />
                      <div className="relative hidden sm:block">
                        <select className="appearance-none bg-surface-container-low text-on-surface font-label-caps text-label-caps uppercase px-3 py-2 pr-7 rounded-xl focus:outline-none cursor-pointer">
                          <option value="all">All Tools</option>
                          <option value="finance">Finance</option>
                          <option value="health">Health</option>
                        </select>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant pointer-events-none absolute right-2 top-2.5">expand_more</span>
                      </div>
                      <button type="button" className="ml-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-headline-md text-body-sm transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                        <span>Explore</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                    
                    {/* Popular Quick Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-space-sm pt-1">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mr-1">Popular:</span>
                      {['BMI', 'Age', 'EMI', 'GST', 'Percentage', 'SIP', 'Loan', 'Scientific'].map(term => (
                        <button key={term} type="button" onClick={() => applyQuickSearch(term)} className="px-3 py-1 rounded-full bg-surface-container text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-all font-body-sm text-body-sm shadow-sm">
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trust Sub-metrics */}
                  <div className="flex items-center gap-6 pt-3 text-on-surface-variant font-body-sm text-body-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                      <span>100% Free Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                      <span>Sub-20ms Speed</span>
                    </div>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                      <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                      <span>Local Computing</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Hero Interactive Dynamic Glass Showcase */}
                <div className="lg:col-span-5 relative mt-space-lg lg:mt-0">
                  <div className="relative w-full max-w-md mx-auto space-y-space-md">
                    {/* Card 1: SIP Compound Growth preview */}
                    <Link href="/finance#investment-section" className="block relative p-5 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl transition-transform hover:-translate-y-1 duration-300 group cursor-pointer">
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                          </div>
                          <div>
                            <h2 className="font-headline-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">SIP Growth Visualizer</h2>
                            <span className="font-label-caps text-label-caps text-on-surface-variant">10 YRS • 14% EXPECTED CAGR</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-data-mono text-label-caps font-bold">LIVE</span>
                      </div>
                      {/* Mini SVG Bar & Area Chart */}
                      <div className="w-full h-24 my-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 90">
                          <defs>
                            <linearGradient id="sipGrad" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#004ac6" stopOpacity="0.35"></stop>
                              <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0"></stop>
                            </linearGradient>
                          </defs>
                          <path d="M 0 80 Q 80 75, 160 50 T 320 10 L 320 90 L 0 90 Z" fill="url(#sipGrad)"></path>
                          <path d="M 0 80 Q 80 75, 160 50 T 320 10" fill="none" stroke="#004ac6" strokeLinecap="round" strokeWidth="3"></path>
                          <circle cx="320" cy="10" fill="#004ac6" r="4"></circle>
                          <line stroke="#c3c6d7" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="320" y1="30" y2="30"></line>
                          <line stroke="#c3c6d7" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="320" y1="60" y2="60"></line>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 bg-surface-container-low p-2.5 rounded-xl">
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface-variant">TOTAL INVESTED</span>
                          <p className="font-data-mono text-body-md text-on-surface font-bold">$60,000</p>
                        </div>
                        <div className="text-right">
                          <span className="font-label-caps text-label-caps text-on-surface-variant">EST. MATURITY</span>
                          <p className="font-data-mono text-body-md text-primary font-bold">$131,065</p>
                        </div>
                      </div>
                    </Link>
                    {/* Card 2 & 3 */}
                    <div className="grid grid-cols-2 gap-space-sm">
                      <Link href="/health#bmi-card" className="p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all cursor-pointer block group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">BMI GAUGE</span>
                          <span className="material-symbols-outlined text-secondary text-[16px]">favorite</span>
                        </div>
                        <p className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface leading-none mb-1">21.8</p>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 my-2 overflow-hidden">
                          <div className="bg-secondary-container h-full rounded-full w-3/5"></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-medium">
                          <span>Normal Weight</span>
                          <span className="text-secondary font-bold">Optimal</span>
                        </div>
                      </Link>
                      <Link href="/finance#loans-section" className="p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer block">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">MORTGAGE EMI</span>
                            <span className="material-symbols-outlined text-primary text-[16px]">home</span>
                          </div>
                          <p className="font-data-mono text-headline-md text-on-surface font-bold group-hover:text-primary transition-colors">$2,149<span className="text-xs text-on-surface-variant font-normal">/mo</span></p>
                        </div>
                        <div className="mt-2 text-[11px] text-on-surface-variant flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                          <span>Principal: 72% • Int: 28%</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 2: FEATURED CATEGORIES ================= */}
          <section className="w-full py-space-3xl bg-surface-container-lowest">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-4">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-bold">Systematic Taxonomy</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Featured Categories</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Over 5,000 modular tools categorized into 12 core disciplines.</p>
                </div>
                <button type="button" className="inline-flex items-center gap-1.5 font-headline-md text-body-sm text-primary hover:text-on-primary-fixed-variant transition-colors">
                  <span>View All 50+ Specialized Sectors</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                {categoriesData.map((cat, idx) => (
                  <div key={idx} className="group p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-space-sm">
                        {cat.link ? (
                          <Link href={cat.link} className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                          </Link>
                        ) : (
                          <div className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                          </div>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps">{cat.count} Tools</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
                        {cat.link ? (
                          <Link href={cat.link} className="hover:text-primary transition-colors">
                            {cat.title}
                          </Link>
                        ) : (
                          cat.title
                        )}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">{cat.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-space-md">
                        {cat.tags.map(tag => {
                          const tagHref = tag === 'Volume'
                            ? '/volume-converter'
                            : tag === 'Length'
                            ? '/length-converter'
                            : tag === 'Mass'
                            ? '/weight-converter'
                            : tag === 'BMI'
                            ? '/health#bmi-card'
                            : tag === 'TDEE'
                            ? '/health#tdee-card'
                            : tag === 'Calorie Deficit'
                            ? '/health#tdee-card'
                            : tag === 'SIP'
                            ? '/finance#investment-section'
                            : tag === 'Mortgage'
                            ? '/finance#loans-section'
                            : tag === '401(k)'
                            ? '/finance#retirement-section'
                            : tag === 'CAGR'
                            ? '/finance#investment-section'
                            : tag === 'FIRE'
                            ? '/fire-forecaster'
                            : tag === 'Concrete'
                            ? '/home-construction#concrete-calc'
                            : tag === 'Square Feet'
                            ? '/home-construction'
                            : tag === 'Roof Pitch'
                            ? '/home-construction#roof-calc'
                            : tag === 'GPA'
                            ? '/education#workbench-gpa'
                            : tag === 'Final Grade'
                            ? '/education#workbench-final'
                            : tag === 'Percentile'
                            ? '/education#directory'
                            : tag === 'Margin'
                            ? '/business#wb1-cogs'
                            : tag === 'Burn Rate'
                            ? '/business#wb3-cash'
                            : tag === 'Break-Even'
                            ? '/business#category-profit'
                            : tag === "Ohm's Law"
                            ? '/electrical#cat-1'
                            : tag === 'AWG Sizing'
                            ? '/electrical#workbench-cable'
                            : tag === 'kW to Amps'
                            ? '/electrical#cat-2'
                            : tag === 'Molarity'
                            ? '/science#workbenches'
                            : tag === 'Velocity'
                            ? '/science#workbenches'
                            : tag === 'Half-Life'
                            ? '/science#cat-11'
                            : tag === 'Subnet IPv4'
                            ? '/technology#workbench-subnet'
                            : tag === 'Bitrate'
                            ? '/technology#workbench-speed'
                            : tag === 'Aspect Ratio'
                            ? '/technology#frontend'
                            : null;

                          if (tagHref) {
                            return (
                              <Link
                                key={tag}
                                href={tagHref}
                                className="text-[11px] bg-surface-container-lowest hover:bg-primary hover:text-on-primary px-2 py-0.5 rounded text-on-surface transition-colors cursor-pointer"
                              >
                                {tag}
                              </Link>
                            );
                          }

                          return (
                            <span key={tag} className="text-[11px] bg-surface-container-lowest px-2 py-0.5 rounded text-on-surface">
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {cat.link ? (
                      <Link href={cat.link} className="inline-flex items-center text-body-sm font-semibold text-primary group-hover:gap-2 transition-all">
                        <span>Explore Category</span>
                        <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                      </Link>
                    ) : (
                      <button className="inline-flex items-center text-body-sm font-semibold text-primary group-hover:gap-2 transition-all" type="button">
                        <span>Explore Category</span>
                        <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 3: TRENDING CALCULATORS ================= */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex items-center justify-between mb-space-xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-primary font-label-caps text-label-caps uppercase">
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                    <span>Real-Time Frequency</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Trending Calculators</h2>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-on-surface-variant font-body-sm text-body-sm">Updated continuous feed</span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {trendingData.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-md font-data-mono text-label-caps font-bold ${item.tagBg}`}>#{item.id} TRENDING</span>
                        <div className="flex items-center gap-1 text-tertiary">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span className="font-data-mono text-xs font-bold">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">{item.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.desc}</p>
                    </div>
                    <div className="mt-space-md pt-space-sm border-t border-outline-variant/20">
                      <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-3">
                        <span>{item.views}</span>
                        <span>{item.time}</span>
                      </div>
                      {item.link ? (
                        <a href={item.link} className={`w-full py-2 rounded-xl text-body-sm font-semibold flex items-center justify-center gap-1 transition-colors ${item.linkBg}`}>
                          <span>{item.linkText}</span>
                          <span className="material-symbols-outlined text-[16px]">{item.linkIcon}</span>
                        </a>
                      ) : (
                        <button className="w-full py-2 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-body-sm font-semibold flex items-center justify-center gap-1" type="button">
                          <span>Run Calculator</span>
                          <span className="material-symbols-outlined text-[16px]">launch</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 4: DISCOVER BY PURPOSE ================= */}
          <section className="w-full py-space-3xl bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="text-center max-w-2xl mx-auto mb-space-2xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Goal-Oriented Pathways</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Discover By Purpose</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Skip formulas. Start with your real-life aspiration and let our curated toolkits assemble the numbers.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {purposeData.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all duration-200">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-space-md`}>
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{item.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">{item.desc}</p>
                    <div className="space-y-2 border-t border-outline-variant/20 pt-3">
                      {item.links.map(link => {
                        const href = (item as any).categoryLink || (link.includes('BMI') ? '/health#bmi-card' : link.includes('Caloric') || link.includes('Macro') ? '/health#tdee-card' : link.includes('One-Rep') ? '/health#onerep-card' : '#');
                        return (
                          <Link key={link} href={href} className="flex items-center justify-between text-body-sm text-primary hover:underline font-medium">
                            <span>{link}</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 5: CALCULATOR COLLECTIONS ================= */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Algorithmic Suites</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Calculator Collections</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Deep-dive into synchronized computation clusters built around core formulas.</p>
                </div>
                <div className="flex items-center p-1.5 rounded-2xl bg-surface-container-high overflow-x-auto max-w-full">
                  {['finance', 'health', 'math', 'conversion'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setCollectionTab(tab)}
                      className={`px-4 py-2 rounded-xl text-body-sm font-semibold transition-all ${collectionTab === tab ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                      type="button"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {collectionData[collectionTab].map((card, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{card.title}</span>
                        <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded ${card.badgeBg}`}>{card.badge}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Formula: <code className="font-data-mono text-xs text-primary">{card.formula}</code></p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{card.desc}</p>
                    </div>
                    {card.link || collectionTab === 'health' ? (
                      <Link href={card.link || '/health'} className="w-full py-2 rounded-xl bg-surface-container-lowest text-primary font-body-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1">
                        {card.btnText} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    ) : (
                      <button className="w-full py-2 rounded-xl bg-surface-container-lowest text-primary font-body-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1" type="button">
                        {card.btnText} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 6: FEATURED INTERACTIVE AGE CALCULATOR ================= */}
          <section className="w-full py-space-3xl bg-surface-container-low scroll-mt-24" id="interactive-age-calc">
            <div className="max-w-max-width-calculator mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="text-center mb-space-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps font-bold mb-2">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Featured Interactive Calculator</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Precision Age Calculator</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Compute chronological age down to the day, accounting for leap years, calendar shifts, and milestone countdowns.</p>
              </div>
              <div className="rounded-3xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 font-semibold">Date of Birth</label>
                    <input type="date" value={calcDob} onChange={e => setCalcDob(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-sm"/>
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 font-semibold">Calculate Age As Of</label>
                    <input type="date" value={calcTarget} onChange={e => setCalcTarget(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-sm"/>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-surface-container-low mb-space-md">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-1">Your Exact Chronological Age</span>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numerical-display text-numerical-display text-primary font-bold">{ageRes.years}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">Years</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold">{ageRes.months}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">Months</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold">{ageRes.days}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">Days</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mb-space-lg">
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Total Months</span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">{ageRes.totalMonths.toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Total Weeks</span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">{ageRes.totalWeeks.toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Total Days</span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">{ageRes.totalDays.toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Total Hours</span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">{ageRes.totalHours.toLocaleString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-lg">
                  <div className="p-4 rounded-xl bg-primary-fixed/30 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px]">cake</span>
                    <div>
                      <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Next Birthday</span>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">{ageRes.nextBday}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary-fixed/30 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[28px]">stars</span>
                    <div>
                      <span className="font-label-caps text-label-caps text-secondary uppercase font-bold">Astrological Sign</span>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">{ageRes.zodiac}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-space-sm border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <button type="button" className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95">
                      <span className="material-symbols-outlined text-[16px]">content_copy</span><span>Copy Result</span>
                    </button>
                    <button type="button" className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95">
                      <span className="material-symbols-outlined text-[16px]">share</span><span>Share</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95">
                      <span className="material-symbols-outlined text-[16px]">bookmark_add</span><span>Save Result</span>
                    </button>
                    <button type="button" onClick={() => window.print()} className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95">
                      <span className="material-symbols-outlined text-[16px]">print</span><span>Print</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SECTION 7: MOST USED THIS WEEK (LEADERBOARD) ================= */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-3">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Algorithmic Velocity</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Most Used This Week</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Ranked calculation volume across 1M+ active global sessions.</p>
                </div>
                <div className="flex items-center gap-2 font-data-mono text-body-sm text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span>Week 10 • 2025 Audit</span>
                </div>
              </div>
              <div className="space-y-space-xs">
                {leaderboardData.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-xl ${item.numBg} font-data-mono text-headline-md font-bold flex items-center justify-center flex-shrink-0`}>{item.rank}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-md text-headline-md text-on-surface">{item.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full ${item.badgeBg} font-label-caps text-label-caps font-bold`}>{item.badge}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{item.count}</span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant block">Calculations this week</span>
                      </div>
                      <a href={item.link || '#'} className="p-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 8: WHY TRUST SOLVE IT CALCULATOR ================= */}
          <section className="w-full py-space-3xl bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="text-center max-w-2xl mx-auto mb-space-2xl">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Uncompromising Architecture</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Why Trust SolveIt Calculator</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Mathematical integrity meets client-side engineering. Every formula is transparent, vetted, and strictly isolated.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {trustData.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                      <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{item.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 9: ADVANCED SEARCH & REAL-TIME FILTERING ================= */}
          <section className="w-full py-space-3xl bg-surface" id="search-section">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="text-center max-w-xl mx-auto mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Instant Filter Matrix</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Search All Calculators</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Instant indexed access across our complete computational archive.</p>
              </div>
              
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low mb-space-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
                  <div className="md:col-span-5 relative">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-3">search</span>
                    <input 
                      type="text" 
                      value={dirSearch}
                      onChange={e => setDirSearch(e.target.value)}
                      placeholder="Filter by keyword (e.g. loan, bmi, matrix, watt)..." 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <select value={dirCategory} onChange={e => setDirCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer shadow-sm">
                      <option value="all">All Categories</option>
                      <option value="finance">Finance</option>
                      <option value="health">Health</option>
                      <option value="math">Math</option>
                      <option value="construction">Construction</option>
                      <option value="conversion">Conversion</option>
                    </select>
                  </div>
                  <div className="md:col-span-4 flex items-center gap-2">
                    <select value={dirSort} onChange={e => setDirSort(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer shadow-sm">
                      <option value="popular">Sort: Most Popular</option>
                      <option value="newest">Sort: Newest Added</option>
                      <option value="rating">Sort: Highest Rated</option>
                    </select>
                    <button type="button" onClick={() => { setDirSearch(''); setDirCategory('all'); setDirSort('popular'); }} className="px-3 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-caps text-label-caps transition-colors">
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {filteredDirectory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {filteredDirectory.map((card, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-2 py-0.5 rounded font-label-caps text-label-caps uppercase ${card.badgeClass}`}>{card.label}</span>
                          <span className="font-data-mono text-xs text-on-surface-variant">★ {card.rating} ({card.count})</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">{card.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{card.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">EST. TIME: {card.time}</span>
                        <Link href={(card as any).link || (card.category === 'health' ? '/health' : '#')} className="text-primary font-body-sm font-semibold hover:underline flex items-center">
                          Open <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-space-2xl">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-2">No calculators matched your query</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Try searching for terms like &quot;BMI&quot;, &quot;tax&quot;, &quot;loan&quot;, or &quot;percentage&quot;.</p>
                  <button className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm font-semibold" onClick={() => { setDirSearch(''); setDirCategory('all'); }} type="button">Clear Filters</button>
                </div>
              )}
            </div>
          </section>

          {/* ================= SECTION 10: BLOG & GUIDES (AUTHORITY CONTENT) ================= */}
          <section className="w-full py-space-3xl bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Educational Rigor</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Mathematical Guides & Deep Dives</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Detailed proofs, formula breakdowns, and practical guidance from domain specialists.</p>
                </div>
                <a href="#" className="font-headline-md text-body-sm text-primary hover:underline flex items-center gap-1">
                  <span>Browse Knowledge Base</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {guidesData.map((guide, idx) => (
                  <article key={idx} className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-full h-36 rounded-xl mb-4 bg-cover bg-center" style={{ backgroundImage: `url('${guide.img}')` }}></div>
                      <div className="flex items-center gap-2 mb-2 font-label-caps text-label-caps text-on-surface-variant">
                        <span>{guide.category}</span><span>•</span><span>{guide.time}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface leading-snug">{guide.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">{guide.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                      <span className="text-xs font-medium text-on-surface">{guide.author}</span>
                      <span className="material-symbols-outlined text-[18px] text-primary">arrow_forward</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 11: STATISTICS ================= */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="p-8 md:p-12 rounded-3xl bg-surface-container-highest/60 backdrop-blur-md relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-10">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                    <path d="M0,100 C300,300 700,0 1000,200 L1000,400 L0,400 Z" fill="#004ac6"></path>
                  </svg>
                </div>
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-space-lg text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-primary font-bold">5,000+</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Calculators & Tools</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">Continuously updated algorithm library</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-on-surface font-bold">50+</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Specialized Categories</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">From civil engineering to macrobiotics</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-primary font-bold">1M+</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Monthly Computations</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">Trusted by researchers and analysts</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-secondary font-bold">100%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Free & Open Access</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">No credit card or login ever needed</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
