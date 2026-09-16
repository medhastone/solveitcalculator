"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Header from "../components/Header";

import HomePageSeoSections from './HomePageSeoSections';

// --- Static Data ---
const categoriesData = [
  {
    title: "Finance",
    link: "/finance",
    icon: "payments",
    iconBg: "bg-primary-fixed text-primary",
    count: "420+",
    desc: "Mortgages, investments, and loan planning.",
    tags: ["SIP", "Mortgage", "401(k)", "CAGR", "FIRE"],
  },
  {
    title: "Health",
    link: "/health-fitness-calculators",
    icon: "vital_signs",
    iconBg: "bg-error-container text-error",
    count: "180+",
    desc: "BMR, heart rate, and body fat tracking.",
    tags: ["BMI", "TDEE", "Calorie Deficit"],
  },
  {
    title: "Math",
    link: "/math",
    icon: "square_foot",
    iconBg: "bg-secondary-fixed text-secondary",
    count: "100+",
    desc: "Algebra, fractions, and statistics.",
    tags: ["Percentage", "Fraction", "Standard Dev"],
  },
  {
    title: "Conversion",
    link: "/conversions",
    icon: "swap_horiz",
    iconBg: "bg-surface-container-highest text-on-surface",
    count: "260+",
    desc: "Metric, imperial, and scientific conversions.",
    tags: ["Length", "Mass", "Volume"],
  },
  {
    title: "Date & Time",
    link: "/time-date",
    icon: "schedule",
    iconBg: "bg-primary-fixed text-primary",
    count: "104+",
    desc: "Calculate age, time zones, and business days.",
    tags: ["Age Diff", "Working Days", "Time Zones"],
  },
  {
    title: "Home & Construction",
    link: "/home-construction",
    icon: "construction",
    iconBg: "bg-tertiary-fixed text-tertiary",
    count: "100+",
    desc: "Concrete, roof pitch, and material estimates.",
    tags: ["Concrete", "Square Feet", "Roof Pitch"],
  },
  {
    title: "Education",
    link: "/education",
    icon: "school",
    iconBg: "bg-secondary-fixed-dim text-on-secondary-fixed-variant",
    count: "100+",
    desc: "GPA models, final exam solvers, and attendance buffers.",
    tags: ["GPA", "Final Grade", "Percentile"],
  },
  {
    title: "Business",
    link: "/business",
    icon: "domain",
    iconBg: "bg-primary-fixed text-primary",
    count: "250+",
    desc: "Profit margins, runway, and markup calculators.",
    tags: ["Margin", "Burn Rate", "Break-Even"],
  },
  {
    title: "Electrical",
    link: "/electrical",
    icon: "electric_bolt",
    iconBg: "bg-primary-fixed text-primary",
    count: "300+",
    desc: "Wire sizing, voltage drop, and solar battery storage.",
    tags: ["Ohm's Law", "AWG Sizing", "kW to Amps"],
  },
  {
    title: "Automotive",
    link: "/automotive-calculators-estimators",
    icon: "directions_car",
    iconBg: "bg-surface-container-highest text-on-surface-variant",
    count: "90+",
    desc: "Fuel economy, auto loans, and EV efficiency.",
    tags: ["MPG / EV", "Lease vs Buy", "Tire Size"],
  },
  {
    title: "Science",
    link: "/science",
    icon: "science",
    iconBg: "bg-secondary-fixed text-secondary",
    count: "100+",
    desc: "Physics, chemistry, and biology problem solvers.",
    tags: ["Molarity", "Velocity", "Half-Life"],
  },
  {
    title: "Technology",
    link: "/technology",
    icon: "terminal",
    iconBg: "bg-primary-fixed text-primary",
    count: "100+",
    desc: "Subnet masks, bandwidth speeds, and aspect ratios.",
    tags: ["Subnet IPv4", "Bitrate", "Aspect Ratio"],
  },
];

const trendingData = [
  {
    id: 1,
    title: "BMI Calculator",
    desc: "Calculate body mass index for adults and children.",
    rating: "4.9",
    tagBg: "bg-primary/10 text-primary",
    link: "/health-fitness-calculators/bmi",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 2,
    title: "Age Calculator",
    desc: "Calculate exact age down to the second.",
    rating: "5.0",
    tagBg: "bg-primary/10 text-primary",
    link: "/time-date/age-calculator",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 3,
    title: "Investing & Growth",
    desc: "Calculate compound interest, investment returns, and SIP.",
    rating: "4.9",
    tagBg: "bg-surface-container text-on-surface-variant",
    link: "/investing-and-growth",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 4,
    title: "EMI Calculator",
    desc: "Calculate monthly loan installments and payoff schedules.",
    rating: "4.8",
    tagBg: "bg-surface-container text-on-surface-variant",
    link: "/finance/emi-calculator",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 5,
    title: "GST Calculator",
    desc: "Calculate inclusive and exclusive GST amounts.",
    rating: "4.8",
    tagBg: "bg-surface-container text-on-surface-variant",
    link: "/tax-calculator",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 6,
    title: "Percentage Calculator",
    desc: "Calculate percentage difference, increase, and decrease.",
    rating: "4.9",
    tagBg: "bg-surface-container text-on-surface-variant",
    link: "/percentage-calculator",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 7,
    title: "Standard Deviation Calculator",
    desc: "Calculate variance, mean, and standard deviation for population or sample datasets.",
    rating: "4.9",
    tagBg: "bg-surface-container text-on-surface-variant",
    link: "/math/standard-deviation-calculator",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
  {
    id: 8,
    title: "Mortgage Calculator",
    desc: "Estimate mortgage payments including taxes and insurance.",
    rating: "4.9",
    tagBg: "bg-surface-container text-on-surface-variant",
    link: "/finance/mortgage-calculator",
    linkText: "Open Calculator",
    linkIcon: "arrow_forward",
    linkBg: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  },
];

const purposeData = [
  {
    title: "Save Money",
    icon: "savings",
    iconBg: "bg-primary-fixed text-primary",
    desc: "Model compounding yields and savings goals.",
    links: ["Compound Interest Tool", "Emergency Fund Target"],
    categoryLink: "/finance#savings-section",
  },
  {
    title: "Lose Weight",
    icon: "monitor_weight",
    iconBg: "bg-error-container text-error",
    desc: "Calculate strict daily caloric deficits.",
    links: ["Caloric Deficit Planner", "Target Date Projector"],
    categoryLink: "/health-fitness-calculators",
  },
  {
    title: "Track Fitness",
    icon: "fitness_center",
    iconBg: "bg-secondary-fixed text-secondary",
    desc: "Balance macronutrients and fitness goals.",
    links: ["Macro Split Calculator", "One-Rep Max (1RM)"],
    categoryLink: "/health-fitness-calculators",
  },
  {
    title: "Buy A Home",
    icon: "real_estate_agent",
    iconBg: "bg-surface-container-highest text-on-surface",
    desc: "Estimate true mortgage affordability and closing costs.",
    links: ["Home Affordability Index", "Down Payment Timeline"],
    categoryLink: "/finance/mortgage-calculator",
  },
  {
    title: "Plan Retirement",
    icon: "beach_access",
    iconBg: "bg-primary-fixed-dim text-primary",
    desc: "Compute drawdown horizons and safe withdrawal limits.",
    links: ["FIRE Movement Calculator", "401(k) Match Optimizer"],
    categoryLink: "/retirement-and-super",
  },
  {
    title: "Calculate Taxes",
    icon: "receipt_long",
    iconBg: "bg-tertiary-fixed text-tertiary",
    desc: "Evaluate marginal brackets and standard deductions.",
    links: ["2025 Income Tax Bracket", "Capital Gains Tax Suite"],
    categoryLink: "/global-tax-calculator",
  },
  {
    title: "Study Better",
    icon: "auto_stories",
    iconBg: "bg-secondary-fixed text-secondary",
    desc: "Forecast final exam scores and track GPA.",
    links: ["Final Exam Score Needed", "Cumulative GPA Tool"],
    categoryLink: "/education",
  },
  {
    title: "Build A House",
    icon: "architecture",
    iconBg: "bg-surface-container-highest text-on-surface",
    desc: "Compute yardages for concrete, lumber, and drywall.",
    links: ["Concrete Yardage Tool", "Drywall & Stud Estimator"],
    categoryLink: "/home-construction",
  },
];

const collectionData: Record<
  string,
  Array<{
    title: string;
    badge: string;
    badgeBg: string;
    formula: string;
    desc: string;
    btnText: string;
    link?: string;
  }>
> = {
  finance: [
    {
      title: "EMI Suite",
      link: "/finance/emi-calculator",
      badge: "Formula Verified",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "P × r × (1 + r)ⁿ / ((1 + r)ⁿ - 1)",
      desc: "Calculate monthly loan repayment schedules.",
      btnText: "Launch EMI Suite",
    },
    {
      title: "SIP & Recurring",
      link: "/investing-and-growth",
      badge: "Formula Verified",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "M × {[(1 + i)ⁿ - 1] / i} × (1 + i)",
      desc: "Model dollar-cost averaging and mutual fund returns.",
      btnText: "Open SIP Tool",
    },
    {
      title: "CAGR & ROI",
      link: "/investing-and-growth",
      badge: "Formula Verified",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "(Ending / Beginning)^(1/n) - 1",
      desc: "Calculate annualized returns and ROI.",
      btnText: "Launch CAGR Tool",
    },
  ],
  health: [
    {
      title: "BMI WHO Metric",
      link: "/health-fitness-calculators/bmi",
      badge: "ISO Standard",
      badgeBg: "bg-surface-container-highest text-secondary",
      formula: "Weight (kg) / [Height (m)]²",
      desc: "Calculate body mass index for adults and children.",
      btnText: "Launch BMI Suite",
    },
    {
      title: "Mifflin-St Jeor BMR",
      link: "/health-fitness-calculators#bmr-card",
      badge: "Clinical Grade",
      badgeBg: "bg-surface-container-highest text-secondary",
      formula: "10W + 6.25H - 5A (+5 or -161)",
      desc: "Calculate basal metabolic rate based on Mifflin-St Jeor.",
      btnText: "Launch BMR Suite",
    },
    {
      title: "U.S. Navy Body Fat",
      link: "/health-fitness-calculators#navy-card",
      badge: "Anthropometric",
      badgeBg: "bg-surface-container-highest text-secondary",
      formula: "86.010×log10(abdomen-neck) - ...",
      desc: "Calculate body fat percentage based on US Navy formula.",
      btnText: "Launch Body Fat Tool",
    },
  ],
  math: [
    {
      title: "Percentage Delta",
      link: "/percentage-calculator",
      badge: "Exact",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "|(V2 - V1)| / ((V1 + V2) / 2) × 100",
      desc: "Calculate percentage difference, increase, and decrease.",
      btnText: "Launch Percentage Tool",
    },
    {
      title: "Fraction Simplifier",
      link: "/math#quick-solve",
      badge: "Euclidean",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "gcd(a, b) recursively computed",
      desc: "Simplify fractions and find decimal equivalents.",
      btnText: "Launch Fractions",
    },
    {
      title: "Matrix Determinant",
      link: "/math#directory",
      badge: "Linear Algebra",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "det(A) = ∏ diag(U)",
      desc: "Calculate matrix determinants, inverses, and eigenvalues.",
      btnText: "Launch Matrix Solver",
    },
  ],
  conversion: [
    {
      title: "Grams to Milliliters",
      link: "/conversion/grams-to-milliliters",
      badge: "NIST Standard",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "V = m ÷ ρ",
      desc: "Convert grams to milliliters using specific gravity.",
      btnText: "Launch Converter",
    },
    {
      title: "Universal Metric-Imperial",
      link: "/conversions",
      badge: "NIST Standard",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "1 in = 0.0254 m (exact)",
      desc: "Convert length and distance across all units.",
      btnText: "Launch Distance Tool",
    },
    {
      title: "Temperature Thermodynamic",
      link: "/temperature-converter",
      badge: "Kelvin / Rankine",
      badgeBg: "bg-surface-container-highest text-primary",
      formula: "K = °C + 273.15 • °F = 1.8(K - 273) + 32",
      desc: "Convert between Celsius, Fahrenheit, Kelvin, and Rankine.",
      btnText: "Launch Temperature",
    },
  ],
};

const leaderboardData = [
  {
    rank: 1,
    title: "Age & Chronological Duration",
    badge: "Trending #1",
    badgeBg: "bg-primary-fixed text-primary",
    desc: "Category: Date & Time",
    count: "482,920",
    link: "/time-date/age-calculator",
    numBg: "bg-primary text-on-primary",
  },
  {
    rank: 2,
    title: "Scientific Matrix & Function Calculator",
    badge: "Academic",
    badgeBg: "bg-secondary-fixed text-secondary",
    desc: "Category: Math",
    count: "391,140",
    link: "/math",
    numBg: "bg-surface-container-highest text-on-surface",
  },
  {
    rank: 3,
    title: "Mortgage Payment & Amortization Suite",
    badge: "Real Estate",
    badgeBg: "bg-surface-container-high text-on-surface",
    desc: "Category: Finance",
    count: "318,450",
    link: "/finance/mortgage-calculator",
    numBg: "bg-surface-container-highest text-on-surface",
  },
  {
    rank: 4,
    title: "Body Mass Index (BMI) & Ideal Body Weight",
    badge: "Health",
    badgeBg: "bg-surface-container-high text-on-surface",
    desc: "Category: Health",
    count: "284,010",
    link: "/health-fitness-calculators/bmi",
    numBg: "bg-surface-container-highest text-on-surface",
  },
  {
    rank: 5,
    title: "Goods & Services Tax (GST/VAT) Splitter",
    badge: "Taxation",
    badgeBg: "bg-surface-container-high text-on-surface",
    desc: "Category: Business",
    count: "249,700",
    link: "/tax-calculator",
    numBg: "bg-surface-container-highest text-on-surface",
  },
];

const trustData = [
  {
    title: "Accurate Formulas",
    icon: "verified",
    iconBg: "bg-primary-fixed text-primary",
    desc: "Cross-referenced with rigorous industry and mathematical standards.",
  },
  {
    title: "Expert Reviewed",
    icon: "psychology",
    iconBg: "bg-secondary-fixed text-secondary",
    desc: "Audited by certified professionals across all domains.",
  },
  {
    title: "Sub-0.02s Execution",
    icon: "speed",
    iconBg: "bg-surface-container-highest text-on-surface",
    desc: "Zero network lag with direct in-browser CPU computation.",
  },
  {
    title: "Mobile Ergonomics",
    icon: "devices",
    iconBg: "bg-surface-container-highest text-primary",
    desc: "Designed with touch-friendly keypads for one-handed use.",
  },
  {
    title: "Free Forever",
    icon: "all_inclusive",
    iconBg: "bg-primary-fixed-dim text-primary",
    desc: "No subscriptions, artificial gates, or registrations required.",
  },
  {
    title: "Absolute Privacy",
    icon: "shield_person",
    iconBg: "bg-error-container text-error",
    desc: "Your data never leaves your browser sandbox. Pure local processing.",
  },
];

const dirCardsData = [
  {
    id: 1,
    category: "finance",
    link: "/finance/mortgage-calculator",
    name: "Mortgage Payment Calculator",
    title: "Mortgage Payment",
    rating: "4.9",
    count: "14.2k",
    desc: "Calculate home loan amortization with escrow.",
    time: "1 MIN",
    badgeClass: "bg-primary-fixed text-primary",
    label: "Finance",
  },
  {
    id: 2,
    category: "health",
    link: "/health-fitness-calculators/bmi",
    name: "BMI & Body Composition",
    title: "BMI & Body Composition",
    rating: "4.9",
    count: "28.4k",
    desc: "Clinical BMI assessment with healthy weight targets.",
    time: "30 SEC",
    badgeClass: "bg-error-container text-error",
    label: "Health",
  },
  {
    id: 3,
    category: "math",
    link: "/percentage-calculator",
    name: "Percentage Change & Delta Calculator",
    title: "Percentage Calculator",
    rating: "4.9",
    count: "19.5k",
    desc: "Calculate percentage difference, margins, and taxes.",
    time: "10 SEC",
    badgeClass: "bg-secondary-fixed text-secondary",
    label: "Math",
  },
  {
    id: 4,
    category: "finance",
    link: "/investing-and-growth",
    name: "Investing & Growth (SIP & ROI)",
    title: "Investing & Growth Compounder",
    rating: "4.9",
    count: "18.1k",
    desc: "Mutual fund projections, investing returns, and growth benchmarks.",
    time: "1 MIN",
    badgeClass: "bg-primary-fixed text-primary",
    label: "Finance",
  },
  {
    id: 5,
    category: "construction",
    link: "/home-construction#concrete-calc",
    name: "Concrete Volume & Yardage",
    title: "Concrete Volume & Bags",
    rating: "4.7",
    count: "7.2k",
    desc: "Calculate cubic yards for slabs, footings, and holes.",
    time: "45 SEC",
    badgeClass: "bg-tertiary-fixed text-tertiary",
    label: "Construction",
  },
  {
    id: 6,
    category: "conversion",
    link: "/conversions",
    name: "Pressure & Force Units",
    title: "Pressure & Pascals",
    rating: "4.8",
    count: "5.9k",
    desc: "Convert pressure units including Psi, bar, and Pascals.",
    time: "20 SEC",
    badgeClass: "bg-surface-container-highest text-on-surface",
    label: "Conversion",
  },
];

const guidesData = [
  {
    category: "HEALTH",
    time: "6 MIN READ",
    title: "How To Calculate BMI: Formula, Categories & Limitations",
    desc: "Understand when the Quetelet index works and when it under-reports muscular density.",
    svgIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  {
    category: "FINANCE",
    time: "8 MIN READ",
    title: "How EMI Works: The Mathematical Breakdown of Amortization",
    desc: "Learn how the reducing balance method and bi-weekly payments can save you years on loans.",
    svgIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
      </svg>
    )
  },
  {
    category: "BUSINESS",
    time: "5 MIN READ",
    title: "Understanding GST: Step-by-Step Calculation for Buyers & Sellers",
    desc: "Learn how to extract inclusive base costs and input credit pass-throughs.",
    svgIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 17V7" />
      </svg>
    )
  },
  {
    category: "INVESTING",
    time: "7 MIN READ",
    title: "Investment Planning Basics: The Power of Compound Interest & SIP",
    desc: "Understand the exponential growth of reinvested dividends over long horizons.",
    svgIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
        <path d="M14 9h5v5" />
      </svg>
    )
  },
];

export default function HomePage() {
  const [collectionTab, setCollectionTab] = useState("finance");
  const [heroSearch, setHeroSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  // Interactive Age Calculator State
  const [calcDob, setCalcDob] = useState("1998-06-15");
  const [calcTarget, setCalcTarget] = useState("");
  const [ageRes, setAgeRes] = useState({
    years: 26,
    months: 8,
    days: 14,
    totalMonths: 320,
    totalWeeks: 1393,
    totalDays: 9754,
    totalHours: 234096,
    nextBday: "In 108 days (Monday)",
    zodiac: "Gemini (Air Element)",
  });

  // Directory Filter State
  const [dirSearch, setDirSearch] = useState("");
  const [dirCategory, setDirCategory] = useState("all");
  const [dirSort, setDirSort] = useState("popular");

  // Initialization
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const t = setTimeout(() => setCalcTarget(today), 0);
    return () => clearTimeout(t);
  }, []);

  // Search Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Age Calculation Logic
  useEffect(() => {
    if (!calcDob || !calcTarget) return;
    const birthDate = new Date(calcDob);
    const targetDate = new Date(calcTarget);
    if (
      isNaN(birthDate.getTime()) ||
      isNaN(targetDate.getTime()) ||
      birthDate > targetDate
    )
      return;

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        0,
      ).getDate();
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
    const totalMonths = years * 12 + months;

    const currentYear = targetDate.getFullYear();
    let nextBirthday = new Date(
      currentYear,
      birthDate.getMonth(),
      birthDate.getDate(),
    );
    if (nextBirthday < targetDate) {
      nextBirthday = new Date(
        currentYear + 1,
        birthDate.getMonth(),
        birthDate.getDate(),
      );
    }
    const bdayDiffDays = Math.ceil(
      (nextBirthday.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const nextDayName = dayNames[nextBirthday.getDay()];

    const m = birthDate.getMonth() + 1;
    const d = birthDate.getDate();
    let zodiac = "Gemini (Air Element)";
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19))
      zodiac = "Aries (Fire Element)";
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20))
      zodiac = "Taurus (Earth Element)";
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20))
      zodiac = "Gemini (Air Element)";
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22))
      zodiac = "Cancer (Water Element)";
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22))
      zodiac = "Leo (Fire Element)";
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22))
      zodiac = "Virgo (Earth Element)";
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22))
      zodiac = "Libra (Air Element)";
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21))
      zodiac = "Scorpio (Water Element)";
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21))
      zodiac = "Sagittarius (Fire Element)";
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19))
      zodiac = "Capricorn (Earth Element)";
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18))
      zodiac = "Aquarius (Air Element)";
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20))
      zodiac = "Pisces (Water Element)";

    const t = setTimeout(
      () =>
        setAgeRes({
          years,
          months,
          days,
          totalMonths,
          totalWeeks,
          totalDays,
          totalHours,
          nextBday: `In ${bdayDiffDays} days (${nextDayName})`,
          zodiac,
        }),
      0,
    );
    return () => clearTimeout(t);
  }, [calcDob, calcTarget]);

  const quickToolLinks: Record<string, string> = {
    BMI: "/health-fitness-calculators/bmi",
    Age: "/time-date/age-calculator",
    EMI: "/finance/emi-calculator",
    GST: "/tax-calculator",
    Percentage: "/percentage-calculator",
    SIP: "/investing-and-growth",
    Loan: "/finance/mortgage-calculator",
    Scientific: "/math#quick-solve",
  };

  const handleHeroSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = heroSearch.trim().toLowerCase();
    if (!query) return;
    if (query.includes("percent")) {
      window.location.href = "/percentage-calculator";
      return;
    }
    if (query.includes("mortgage")) {
      window.location.href = "/finance/mortgage-calculator";
      return;
    }
    if (query.includes("invest") || query.includes("growth")) {
      window.location.href = "/investing-and-growth";
      return;
    }
    if (query.includes("bmi")) {
      window.location.href = "/health-fitness-calculators/bmi";
      return;
    }
    if (query.includes("age")) {
      window.location.href = "/time-date/age-calculator";
      return;
    }
    if (query.includes("emi")) {
      window.location.href = "/finance/emi-calculator";
      return;
    }
    if (query.includes("tax") || query.includes("gst")) {
      window.location.href = "/tax-calculator";
      return;
    }
    setDirSearch(heroSearch);
    document
      .getElementById("search-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const applyQuickSearch = (term: string) => {
    if (quickToolLinks[term]) {
      window.location.href = quickToolLinks[term];
      return;
    }
    setHeroSearch(term);
    setDirSearch(term);
    document
      .getElementById("search-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredHeroResults = useMemo(() => {
    const query = heroSearch.trim().toLowerCase();
    if (!query) return { categories: [], tools: [] };
    
    const matchedCategories = categoriesData.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.tags.some(t => t.toLowerCase().includes(query)) ||
      c.desc.toLowerCase().includes(query)
    ).slice(0, 3);
    
    // Gather all tools from multiple arrays and deduplicate by link
    const allUniqueTools = Array.from(new Map([
      ...dirCardsData.map(c => [c.link, { ...c, title: c.name || c.title }]),
      ...trendingData.map(c => [c.link, { ...c, name: c.title, label: "Trending" }]),
    ].values()));

    const matchedTools = allUniqueTools.filter(c =>
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.desc && c.desc.toLowerCase().includes(query)) ||
      (c.label && c.label.toLowerCase().includes(query)) ||
      (c.title && c.title.toLowerCase().includes(query))
    ).slice(0, 5);
    
    return { categories: matchedCategories, tools: matchedTools };
  }, [heroSearch]);

  const filteredDirectory = useMemo(() => {
    return dirCardsData
      .filter((c) => {
        const matchCat = dirCategory === "all" || c.category === dirCategory;
        const matchSearch =
          dirSearch === "" ||
          c.name.toLowerCase().includes(dirSearch.toLowerCase());
        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        if (dirSort === "az") return a.name.localeCompare(b.name);
        if (dirSort === "rating")
          return parseFloat(b.rating) - parseFloat(a.rating);
        return 0;
      });
  }, [dirSearch, dirCategory, dirSort]);

  return (
    <>
      
      <main className="w-full pt-16 bg-background min-h-[calc(100vh-380px)]">
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
                    Find The Perfect <br className="hidden sm:inline" />
                    Calculator For{" "}
                    <span className="text-primary underline decoration-primary/30 decoration-wavy decoration-2">
                      Any Problem
                    </span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                    Explore thousands of free calculators for finance, health,
                    math, business, education, construction, science, and
                    everyday life. Zero paywalls. Zero latency.
                  </p>

                  {/* Large Intelligent Search Bar */}
                  <div className="w-full max-w-2xl mt-space-sm">
                    <form
                      ref={searchRef}
                      onSubmit={handleHeroSubmit}
                      className="relative flex items-center w-full rounded-2xl bg-surface-container-lowest shadow-xl p-2 transition-all duration-200 z-50"
                    >
                      <span className="material-symbols-outlined text-primary text-[24px] ml-3 mr-2">
                        search
                      </span>
                      <input
                        type="text"
                        aria-label="Search calculators"
                        value={heroSearch}
                        onChange={(e) => {
                          setHeroSearch(e.target.value);
                          setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        placeholder="Search calculators (e.g. percentage, mortgage, bmi)..."
                        className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none py-2"
                      />
                      <div className="relative hidden sm:block">
                        <select aria-label="Select tool category" className="appearance-none bg-surface-container-low text-on-surface font-label-caps text-label-caps uppercase px-3 py-2 pr-7 rounded-xl focus:outline-none cursor-pointer">
                          <option value="all">All Tools</option>
                          <option value="finance">Finance</option>
                          <option value="health">Health</option>
                        </select>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant pointer-events-none absolute right-2 top-2.5">
                          expand_more
                        </span>
                      </div>
                      <button
                        type="submit"
                        className="ml-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-headline-md text-body-sm transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                      >
                        <span>Explore</span>
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_forward
                        </span>
                      </button>

                    {/* Search Dropdown */}
                    {isSearchOpen && heroSearch.trim() !== "" && (filteredHeroResults.categories.length > 0 || filteredHeroResults.tools.length > 0) && (
                      <div className="absolute top-[110%] left-0 right-0 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 text-left">
                        <div className="max-h-[60vh] overflow-y-auto overscroll-contain flex flex-col">
                          
                          {filteredHeroResults.categories.length > 0 && (
                            <div className="p-2 pb-1">
                              <div className="px-3 py-2 text-xs font-label-caps tracking-wider uppercase text-on-surface-variant/70 font-semibold">
                                Categories
                              </div>
                              <div className="flex flex-col gap-1">
                                {filteredHeroResults.categories.map((cat, idx) => (
                                  <Link 
                                    key={`cat-${idx}`} 
                                    href={cat.link}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                                    onClick={() => setIsSearchOpen(false)}
                                  >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cat.iconBg}`}>
                                      <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-on-surface">{cat.title} Hub</span>
                                      <span className="text-xs text-on-surface-variant truncate">{cat.desc}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredHeroResults.categories.length > 0 && filteredHeroResults.tools.length > 0 && (
                            <div className="mx-4 mt-1 mb-1 border-t border-outline-variant/20"></div>
                          )}

                          {filteredHeroResults.tools.length > 0 && (
                            <div className="p-2 pt-1">
                              <div className="px-3 py-2 text-xs font-label-caps tracking-wider uppercase text-on-surface-variant/70 font-semibold">
                                Calculators & Tools
                              </div>
                              <div className="flex flex-col gap-1">
                                {filteredHeroResults.tools.map((tool, idx) => (
                                  <Link 
                                    key={`tool-${idx}`} 
                                    href={tool.link}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                                    onClick={() => setIsSearchOpen(false)}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <span className="text-sm font-semibold text-on-surface truncate">{tool.name}</span>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${tool.badgeClass}`}>
                                          {tool.label}
                                        </span>
                                        <span className="text-xs text-on-surface-variant truncate">{tool.desc}</span>
                                      </div>
                                    </div>
                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50">arrow_forward</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    )}
                    </form>

                    {/* Popular Quick Chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-space-sm pt-1">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mr-1">
                        Popular:
                      </span>
                      {[
                        "BMI",
                        "Age",
                        "EMI",
                        "GST",
                        "Percentage",
                        "SIP",
                        "Loan",
                        "Scientific",
                      ].map((term) => (
                        <Link
                          key={term}
                          href={
                            quickToolLinks[term] || "/percentage-calculator"
                          }
                          className="px-3 py-1 rounded-full bg-surface-container text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-all font-body-sm text-body-sm shadow-sm inline-block"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Trust Sub-metrics */}
                  <div className="flex items-center gap-6 pt-3 text-on-surface-variant font-body-sm text-body-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        verified
                      </span>
                      <span>100% Free Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        bolt
                      </span>
                      <span>Sub-20ms Speed</span>
                    </div>
                    <div className="flex items-center gap-1.5 hidden sm:flex">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        lock
                      </span>
                      <span>Local Computing</span>
                    </div>
                  </div>
                </div>

                {/* Right Hero Interactive Dynamic Glass Showcase */}
                <div className="lg:col-span-5 relative mt-space-lg lg:mt-0">
                  <div className="relative w-full max-w-md mx-auto space-y-space-md">
                    {/* Card 1: SIP Compound Growth preview */}
                    <Link
                      href="/investing-and-growth"
                      className="block relative p-5 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl transition-transform hover:-translate-y-1 duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">
                              trending_up
                            </span>
                          </div>
                          <div>
                            <h2 className="font-headline-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                              SIP Growth Visualizer
                            </h2>
                            <span className="font-label-caps text-label-caps text-on-surface-variant">
                              10 YRS • 14% EXPECTED CAGR
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-data-mono text-label-caps font-bold">
                          LIVE
                        </span>
                      </div>
                      {/* Mini SVG Bar & Area Chart */}
                      <div className="w-full h-24 my-2">
                        <svg
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none"
                          viewBox="0 0 320 90"
                        >
                          <defs>
                            <linearGradient
                              id="sipGrad"
                              x1="0"
                              x2="0"
                              y1="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#004ac6"
                                stopOpacity="0.35"
                              ></stop>
                              <stop
                                offset="100%"
                                stopColor="#004ac6"
                                stopOpacity="0.0"
                              ></stop>
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0 80 Q 80 75, 160 50 T 320 10 L 320 90 L 0 90 Z"
                            fill="url(#sipGrad)"
                          ></path>
                          <path
                            d="M 0 80 Q 80 75, 160 50 T 320 10"
                            fill="none"
                            stroke="#004ac6"
                            strokeLinecap="round"
                            strokeWidth="3"
                          ></path>
                          <circle
                            cx="320"
                            cy="10"
                            fill="#004ac6"
                            r="4"
                          ></circle>
                          <line
                            stroke="#c3c6d7"
                            strokeDasharray="3 3"
                            strokeWidth="0.5"
                            x1="0"
                            x2="320"
                            y1="30"
                            y2="30"
                          ></line>
                          <line
                            stroke="#c3c6d7"
                            strokeDasharray="3 3"
                            strokeWidth="0.5"
                            x1="0"
                            x2="320"
                            y1="60"
                            y2="60"
                          ></line>
                        </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 bg-surface-container-low p-2.5 rounded-xl">
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface-variant">
                            TOTAL INVESTED
                          </span>
                          <p className="font-data-mono text-body-md text-on-surface font-bold">
                            $60,000
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-label-caps text-label-caps text-on-surface-variant">
                            EST. MATURITY
                          </span>
                          <p className="font-data-mono text-body-md text-primary font-bold">
                            $131,065
                          </p>
                        </div>
                      </div>
                    </Link>
                    {/* Card 2 & 3 */}
                    <div className="grid grid-cols-2 gap-space-sm">
                      <Link
                        href="/health-fitness-calculators/bmi"
                        className="p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all cursor-pointer block group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">
                            BMI GAUGE
                          </span>
                          <span className="material-symbols-outlined text-secondary text-[16px]">
                            favorite
                          </span>
                        </div>
                        <p className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface leading-none mb-1">
                          21.8
                        </p>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 my-2 overflow-hidden">
                          <div className="bg-secondary-container h-full rounded-full w-3/5"></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-medium">
                          <span>Normal Weight</span>
                          <span className="text-secondary font-bold">
                            Optimal
                          </span>
                        </div>
                      </Link>
                      <Link
                        href="/finance/emi-calculator"
                        className="p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer block"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">
                              MORTGAGE EMI
                            </span>
                            <span className="material-symbols-outlined text-primary text-[16px]">
                              home
                            </span>
                          </div>
                          <p className="font-data-mono text-headline-md text-on-surface font-bold group-hover:text-primary transition-colors">
                            $2,149
                            <span className="text-xs text-on-surface-variant font-normal">
                              /mo
                            </span>
                          </p>
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
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-bold">
                    Systematic Taxonomy
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Featured Categories
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Over 5,000 modular tools categorized into 12 core
                    disciplines.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                {categoriesData.map((cat, idx) => (
                  <div
                    key={idx}
                    className="group relative p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    {cat.link && (
                      <Link href={cat.link} className="absolute inset-0 z-10">
                        <span className="sr-only">Go to {cat.title}</span>
                      </Link>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-space-sm relative z-20">
                        {cat.link ? (
                          <Link
                            href={cat.link}
                            className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <span className="material-symbols-outlined text-[22px]">
                              {cat.icon}
                            </span>
                          </Link>
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <span className="material-symbols-outlined text-[22px]">
                              {cat.icon}
                            </span>
                          </div>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps">
                          {cat.count} Tools
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-1 relative z-20">
                        {cat.link ? (
                          <Link
                            href={cat.link}
                            className="hover:text-primary transition-colors"
                          >
                            {cat.title}
                          </Link>
                        ) : (
                          cat.title
                        )}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                        {cat.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-space-md relative z-20">
                        {cat.tags.map((tag) => {
                          const tagHref =
                            tag === "Volume"
                              ? "/volume-converter"
                              : tag === "Length"
                                ? "/length-converter"
                                : tag === "Mass"
                                  ? "/weight-converter"
                                  : tag === "Age Diff"
                                    ? "/time-date/age-calculator"
                                    : tag === "BMI"
                                      ? "/health-fitness-calculators/bmi"
                                      : tag === "TDEE"
                                        ? "/health-fitness-calculators#tdee-card"
                                        : tag === "Calorie Deficit"
                                          ? "/health-fitness-calculators#tdee-card"
                                          : tag === "SIP"
                                            ? "/investing-and-growth"
                                            : tag === "Mortgage"
                                              ? "/finance/mortgage-calculator"
                                              : tag === "Percentage"
                                                ? "/percentage-calculator"
                                                : tag === "Fraction"
                                                  ? "/math#quick-solve"
                                                  : tag === "401(k)"
                                                    ? "/finance#retirement-section"
                                                    : tag === "CAGR"
                                                      ? "/investing-and-growth"
                                                      : tag === "FIRE"
                                                        ? "/fire-forecaster"
                                                        : tag === "Concrete"
                                                          ? "/home-construction#concrete-calc"
                                                          : tag ===
                                                              "Square Feet"
                                                            ? "/home-construction"
                                                            : tag ===
                                                                "Roof Pitch"
                                                              ? "/home-construction#roof-calc"
                                                              : tag === "GPA"
                                                                ? "/education#workbench-gpa"
                                                                : tag ===
                                                                    "Final Grade"
                                                                  ? "/education#workbench-final"
                                                                  : tag ===
                                                                      "Percentile"
                                                                    ? "/education#directory"
                                                                    : tag ===
                                                                        "Margin"
                                                                      ? "/business#wb1-cogs"
                                                                      : tag ===
                                                                          "Burn Rate"
                                                                        ? "/business#wb3-cash"
                                                                        : tag ===
                                                                            "Break-Even"
                                                                          ? "/business#category-profit"
                                                                          : tag ===
                                                                              "Ohm's Law"
                                                                            ? "/electrical#cat-1"
                                                                            : tag ===
                                                                                "AWG Sizing"
                                                                              ? "/electrical#workbench-cable"
                                                                              : tag ===
                                                                                  "kW to Amps"
                                                                                ? "/electrical#cat-2"
                                                                                : tag ===
                                                                                    "Molarity"
                                                                                  ? "/science#workbenches"
                                                                                  : tag ===
                                                                                      "Velocity"
                                                                                    ? "/science#workbenches"
                                                                                    : tag ===
                                                                                        "Half-Life"
                                                                                      ? "/science#cat-11"
                                                                                      : tag ===
                                                                                          "Subnet IPv4"
                                                                                        ? "/technology#workbench-subnet"
                                                                                        : tag ===
                                                                                            "Bitrate"
                                                                                          ? "/technology#workbench-speed"
                                                                                          : tag ===
                                                                                              "Aspect Ratio"
                                                                                            ? "/technology#frontend"
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
                            <span
                              key={tag}
                              className="text-[11px] bg-surface-container-lowest px-2 py-0.5 rounded text-on-surface"
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {cat.link ? (
                      <Link
                        href={cat.link}
                        className="inline-flex items-center text-body-sm font-semibold text-primary group-hover:gap-2 transition-all relative z-20"
                      >
                        <span>Explore Category</span>
                        <span className="material-symbols-outlined text-[16px] ml-1">
                          arrow_forward
                        </span>
                      </Link>
                    ) : (
                      <button
                        className="inline-flex items-center text-body-sm font-semibold text-primary group-hover:gap-2 transition-all relative z-20"
                        type="button"
                      >
                        <span>Explore Category</span>
                        <span className="material-symbols-outlined text-[16px] ml-1">
                          arrow_forward
                        </span>
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
                    <span className="material-symbols-outlined text-[16px]">
                      local_fire_department
                    </span>
                    <span>Real-Time Frequency</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Trending Calculators
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-on-surface-variant font-body-sm text-body-sm">
                    Updated continuous feed
                  </span>
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {trendingData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-data-mono text-label-caps font-bold ${item.tagBg}`}
                        >
                          #{item.id} TRENDING
                        </span>
                        <div className="flex items-center gap-1 text-tertiary">
                          <span className="material-symbols-outlined text-[14px]">
                            star
                          </span>
                          <span className="font-data-mono text-xs font-bold">
                            {item.rating}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">
                        {item.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-space-md pt-space-sm border-t border-outline-variant/20">
                      {item.link ? (
                        <Link
                          href={item.link}
                          className={`w-full py-2 rounded-xl text-body-sm font-semibold flex items-center justify-center gap-1 transition-colors ${item.linkBg}`}
                        >
                          <span>{item.linkText}</span>
                          <span className="material-symbols-outlined text-[16px]">
                            {item.linkIcon}
                          </span>
                        </Link>
                      ) : (
                        <button
                          className="w-full py-2 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-body-sm font-semibold flex items-center justify-center gap-1"
                          type="button"
                        >
                          <span>Run Calculator</span>
                          <span className="material-symbols-outlined text-[16px]">
                            launch
                          </span>
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
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                  Goal-Oriented Pathways
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                  Discover By Purpose
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Skip formulas. Start with your real-life aspiration and let
                  our curated toolkits assemble the numbers.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {purposeData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-space-md`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      {item.desc}
                    </p>
                    <div className="space-y-2 border-t border-outline-variant/20 pt-3">
                      {item.links.map((link) => {
                        const href =
                          (item as any).categoryLink ||
                          (link.includes("BMI")
                            ? "/health-fitness-calculators/bmi"
                            : link.includes("Caloric") || link.includes("Macro")
                              ? "/health-fitness-calculators#tdee-card"
                              : link.includes("One-Rep")
                                ? "/health-fitness-calculators#onerep-card"
                                : "#");
                        return (
                          <Link
                            key={link}
                            href={href}
                            className="flex items-center justify-between text-body-sm text-primary hover:underline font-medium"
                          >
                            <span>{link}</span>
                            <span className="material-symbols-outlined text-[16px]">
                              chevron_right
                            </span>
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
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                    Algorithmic Suites
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Calculator Collections
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Deep-dive into synchronized computation clusters built
                    around core formulas.
                  </p>
                </div>
                <div className="flex items-center p-1.5 rounded-2xl bg-surface-container-high overflow-x-auto max-w-full">
                  {["finance", "health", "math", "conversion"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCollectionTab(tab)}
                      className={`px-4 py-2 rounded-xl text-body-sm font-semibold transition-all ${collectionTab === tab ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                      type="button"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {collectionData[collectionTab].map((card, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-lowest transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-data-mono text-body-md font-bold text-on-surface">
                          {card.title}
                        </span>
                        <span
                          className={`font-label-caps text-label-caps px-2 py-0.5 rounded ${card.badgeBg}`}
                        >
                          {card.badge}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                        Formula:{" "}
                        <code className="font-data-mono text-xs text-primary">
                          {card.formula}
                        </code>
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                        {card.desc}
                      </p>
                    </div>
                    {card.link || collectionTab === "health" ? (
                      <Link
                        href={card.link || "/health-fitness-calculators"}
                        className="w-full py-2 rounded-xl bg-surface-container-lowest text-primary font-body-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1"
                      >
                        {card.btnText}{" "}
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_forward
                        </span>
                      </Link>
                    ) : (
                      <button
                        className="w-full py-2 rounded-xl bg-surface-container-lowest text-primary font-body-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1"
                        type="button"
                      >
                        {card.btnText}{" "}
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_forward
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 6: FEATURED INTERACTIVE AGE CALCULATOR ================= */}
          <section
            className="w-full py-space-3xl bg-surface-container-low scroll-mt-24"
            id="interactive-age-calc"
          >
            <div className="max-w-max-width-calculator mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="text-center mb-space-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps font-bold mb-2">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span>Featured Interactive Calculator</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Precision Age Calculator
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Compute chronological age down to the day, accounting for leap
                  years, calendar shifts, and milestone countdowns.
                </p>
              </div>
              <div className="rounded-3xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-lg">
                  <div>
                    <label htmlFor="calcDob" className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 font-semibold">
                      Date of Birth
                    </label>
                    <input
                      id="calcDob"
                      type="date"
                      value={calcDob}
                      onChange={(e) => setCalcDob(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="calcTarget" className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 font-semibold">
                      Calculate Age As Of
                    </label>
                    <input
                      id="calcTarget"
                      type="date"
                      value={calcTarget}
                      onChange={(e) => setCalcTarget(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-sm"
                    />
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-surface-container-low mb-space-md">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-1">
                    Your Exact Chronological Age
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numerical-display text-numerical-display text-primary font-bold">
                        {ageRes.years}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Years
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold">
                        {ageRes.months}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Months
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold">
                        {ageRes.days}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        Days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mb-space-lg">
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">
                      Total Months
                    </span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">
                      {ageRes.totalMonths.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">
                      Total Weeks
                    </span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">
                      {ageRes.totalWeeks.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">
                      Total Days
                    </span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">
                      {ageRes.totalDays.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">
                      Total Hours
                    </span>
                    <span className="font-data-mono text-headline-md font-bold text-on-surface">
                      {ageRes.totalHours.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-lg">
                  <div className="p-4 rounded-xl bg-primary-fixed/30 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      cake
                    </span>
                    <div>
                      <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
                        Next Birthday
                      </span>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        {ageRes.nextBday}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary-fixed/30 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[28px]">
                      stars
                    </span>
                    <div>
                      <span className="font-label-caps text-label-caps text-secondary uppercase font-bold">
                        Astrological Sign
                      </span>
                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        {ageRes.zodiac}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-space-sm border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        content_copy
                      </span>
                      <span>Copy Result</span>
                    </button>
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        share
                      </span>
                      <span>Share</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        bookmark_add
                      </span>
                      <span>Save Result</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        print
                      </span>
                      <span>Print</span>
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
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                    Algorithmic Velocity
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Most Used This Week
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Ranked calculation volume across 50K+ active global sessions.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-data-mono text-body-sm text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span>Week 10 • 2025 Audit</span>
                </div>
              </div>
              <div className="space-y-space-xs">
                {leaderboardData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-10 h-10 rounded-xl ${item.numBg} font-data-mono text-headline-md font-bold flex items-center justify-center flex-shrink-0`}
                      >
                        {item.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline-md text-headline-md text-on-surface">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full ${item.badgeBg} font-label-caps text-label-caps font-bold`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <span className="font-data-mono text-body-md font-bold text-on-surface">
                          {item.count}
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant block">
                          Calculations this week
                        </span>
                      </div>
                      <Link
                        href={item.link || "#"}
                        className="p-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary transition-colors text-primary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          arrow_forward
                        </span>
                      </Link>
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
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                  Uncompromising Architecture
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                  Why Trust SolveIt Calculator
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Mathematical integrity meets client-side engineering. Every
                  formula is transparent, vetted, and strictly isolated.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {trustData.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}
                    >
                      <span className="material-symbols-outlined text-[26px]">
                        {item.icon}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= SECTION 9: ADVANCED SEARCH & REAL-TIME FILTERING ================= */}
          <section
            className="w-full py-space-3xl bg-surface"
            id="search-section"
          >
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="text-center max-w-xl mx-auto mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                  Instant Filter Matrix
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                  Search All Calculators
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Instant indexed access across our complete computational
                  archive.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low mb-space-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
                  <div className="md:col-span-5 relative">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant absolute left-3 top-3">
                      search
                    </span>
                    <input
                      type="text"
                      aria-label="Filter directory"
                      value={dirSearch}
                      onChange={(e) => setDirSearch(e.target.value)}
                      placeholder="Filter by keyword (e.g. loan, bmi, matrix, watt)..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <select
                      aria-label="Filter directory by category"
                      value={dirCategory}
                      onChange={(e) => setDirCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="finance">Finance</option>
                      <option value="health">Health</option>
                      <option value="math">Math</option>
                      <option value="construction">Construction</option>
                      <option value="conversion">Conversion</option>
                    </select>
                  </div>
                  <div className="md:col-span-4 flex items-center gap-2">
                    <select
                      aria-label="Sort directory results"
                      value={dirSort}
                      onChange={(e) => setDirSort(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="popular">Sort: Most Popular</option>
                      <option value="newest">Sort: Newest Added</option>
                      <option value="rating">Sort: Highest Rated</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        setDirSearch("");
                        setDirCategory("all");
                        setDirSort("popular");
                      }}
                      className="px-3 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-caps text-label-caps transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        restart_alt
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {filteredDirectory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {filteredDirectory.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span
                            className={`px-2 py-0.5 rounded font-label-caps text-label-caps uppercase ${card.badgeClass}`}
                          >
                            {card.label}
                          </span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">
                          {card.title}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          {card.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">
                          EST. TIME: {card.time}
                        </span>
                        <Link
                          href={
                            (card as any).link ||
                            (card.category === "health" ? "/health-fitness-calculators" : "#")
                          }
                          className="text-primary font-body-sm font-semibold hover:underline flex items-center"
                        >
                          Open{" "}
                          <span className="material-symbols-outlined text-[16px]">
                            chevron_right
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-space-2xl">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant">
                    search_off
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-2">
                    No calculators matched your query
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Try searching for terms like &quot;BMI&quot;,
                    &quot;tax&quot;, &quot;loan&quot;, or
                    &quot;percentage&quot;.
                  </p>
                  <button
                    className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm font-semibold"
                    onClick={() => {
                      setDirSearch("");
                      setDirCategory("all");
                    }}
                    type="button"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ================= SECTION 10: BLOG & GUIDES (AUTHORITY CONTENT) ================= */}
          <section className="w-full py-space-3xl bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                    Educational Rigor
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                    Mathematical Guides & Deep Dives
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Detailed proofs, formula breakdowns, and practical guidance
                    from domain specialists.
                  </p>
                </div>
                <Link
                  href="/article"
                  className="font-headline-md text-body-sm text-primary hover:underline flex items-center gap-1"
                >
                  <span>Browse Knowledge Base</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {guidesData.map((guide, idx) => {
                  let href = "/article";
                  if (guide.title.includes("BMI")) href = "/article/how-to-calculate-bmi";
                  if (guide.title.includes("EMI")) href = "/article/how-emi-works";
                  if (guide.title.includes("GST")) href = "/article/understanding-gst";
                  if (guide.title.includes("Investment")) href = "/article/investment-planning-basics";

                  return (
                    <Link href={href} key={idx} className="block group">
                      <article
                        className="h-full p-5 rounded-2xl bg-surface-container-lowest shadow-sm group-hover:shadow-lg transition-all flex flex-col justify-between border border-outline-variant/20 group-hover:border-primary/30"
                      >
                        <div>
                          <div className="w-full h-36 rounded-xl mb-4 bg-surface-container-high flex items-center justify-center">
                            {guide.svgIcon}
                          </div>
                          <div className="flex items-center gap-2 mb-2 font-label-caps text-label-caps text-on-surface-variant flex-wrap">
                            <span>{guide.category}</span>
                            <span>•</span>
                            <span>{guide.time}</span>
                            {(guide.category === 'FINANCE' || guide.category === 'BUSINESS' || guide.category === 'INVESTING') && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-semibold">Updated Sep 15, 2026</span>
                              </>
                            )}
                          </div>
                          <h3 className="font-headline-md text-headline-md text-on-surface leading-snug group-hover:text-primary transition-colors">
                            {guide.title}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                            {guide.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-end">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">
                            arrow_forward
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ================= SECTION 11: STATISTICS ================= */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="p-8 md:p-12 rounded-3xl bg-surface-container-highest/60 backdrop-blur-md relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-10">
                  <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 1000 400"
                  >
                    <path
                      d="M0,100 C300,300 700,0 1000,200 L1000,400 L0,400 Z"
                      fill="#004ac6"
                    ></path>
                  </svg>
                </div>
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-space-lg text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-primary font-bold">
                      5,000+
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">
                      Calculators & Tools
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">
                      Continuously updated algorithm library
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-on-surface font-bold">
                      50+
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">
                      Specialized Categories
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">
                      From civil engineering to macrobiotics
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-primary font-bold">
                      50K+
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">
                      Monthly Computations
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">
                      Trusted by researchers and analysts
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-data-mono font-headline-lg md:font-numerical-display text-headline-lg md:text-numerical-display text-secondary font-bold">
                      100%
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">
                      Free & Open Access
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 hidden sm:block">
                      No credit card or login ever needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <HomePageSeoSections />
      </main>
    </>
  );
}
