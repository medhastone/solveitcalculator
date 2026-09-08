'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EducationClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Workbench 1: Target GPA Predictor State ---
  const [curGpa, setCurGpa] = useState<number>(3.42);
  const [compCredits, setCompCredits] = useState<number>(45);
  const [targetGpa, setTargetGpa] = useState<number>(3.65);
  const [futCredits, setFutCredits] = useState<number>(30);

  const gpaResult = useMemo(() => {
    const cur = Number(curGpa) || 0;
    const comp = Number(compCredits) || 0;
    const target = Number(targetGpa) || 0;
    const fut = Number(futCredits) || 0;

    if (fut <= 0) return { val: 'N/A', status: 'invalid', message: 'Enter future credits' };

    const totalCredits = comp + fut;
    const totalPointsNeeded = target * totalCredits;
    const pointsEarned = cur * comp;
    const futurePointsNeeded = totalPointsNeeded - pointsEarned;
    const requiredGpa = futurePointsNeeded / fut;

    if (requiredGpa > 4.0) {
      return {
        val: requiredGpa.toFixed(2),
        status: 'exceeds',
        badge: 'Exceeds 4.0 Max',
        message: 'Requires more future credits or honors weighting',
        color: 'bg-error-container text-on-error-container'
      };
    } else if (requiredGpa <= 3.5) {
      return {
        val: requiredGpa.toFixed(2),
        status: 'safe',
        badge: 'High Feasibility',
        message: `Easily attainable over next ${fut} cr.`,
        color: 'bg-secondary-fixed text-on-secondary-fixed'
      };
    } else {
      return {
        val: requiredGpa.toFixed(2),
        status: 'achievable',
        badge: 'Achievable Goal',
        message: `Demanding consistency over next ${fut} cr.`,
        color: 'bg-surface-container-highest text-primary'
      };
    }
  }, [curGpa, compCredits, targetGpa, futCredits]);

  // --- Workbench 2: Final Exam Grade Needed State ---
  const [finalCurrent, setFinalCurrent] = useState<number>(84.5);
  const [finalWeight, setFinalWeight] = useState<number>(25);
  const [finalDesired, setFinalDesired] = useState<number>(90);

  const finalResult = useMemo(() => {
    const cur = Number(finalCurrent) || 0;
    const wPct = Number(finalWeight) || 0;
    const des = Number(finalDesired) || 0;

    if (wPct <= 0) return { val: 'N/A', status: 'invalid', message: 'Enter exam weight' };

    const w = wPct / 100;
    const req = (des - (cur * (1 - w))) / w;
    const reqFormatted = req.toFixed(1) + '%';

    // Calculate alternative for 85% (B) or 80%
    const altTarget = des > 85 ? 85 : 80;
    const altReq = (altTarget - (cur * (1 - w))) / w;

    if (req > 100) {
      return {
        val: reqFormatted,
        badge: 'Extra Credit Required',
        badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
        icon: 'warning',
        alternative: `Or ${altReq.toFixed(1)}% for Grade B (${altTarget}%)`
      };
    } else if (req <= 70) {
      return {
        val: reqFormatted,
        badge: 'Safe Cushion',
        badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
        icon: 'check_circle',
        alternative: `Easily achievable score for ${des}% target`
      };
    } else {
      return {
        val: reqFormatted,
        badge: 'Moderate Target',
        badgeClass: 'bg-surface-container-highest text-primary',
        icon: 'task_alt',
        alternative: `Focused revision needed for ${des}% target`
      };
    }
  }, [finalCurrent, finalWeight, finalDesired]);

  // --- Workbench 3: Attendance Pacing State ---
  const [attTotal, setAttTotal] = useState<number>(42);
  const [attAttended, setAttAttended] = useState<number>(36);
  const [attReq, setAttReq] = useState<number>(75);

  const attendanceResult = useMemo(() => {
    const tot = Number(attTotal) || 0;
    const att = Number(attAttended) || 0;
    const req = Number(attReq) || 75;

    if (tot <= 0) return { pct: '0%', inGoodStanding: true, message: 'Enter class counts' };

    const currentPct = (att / tot) * 100;
    const reqDecimal = req / 100;
    const safeMiss = Math.floor((att - reqDecimal * tot) / reqDecimal);

    if (currentPct < req) {
      const classesNeeded = Math.ceil((reqDecimal * tot - att) / (1 - reqDecimal));
      return {
        pct: currentPct.toFixed(1) + '%',
        inGoodStanding: false,
        badge: 'Attendance Shortage',
        badgeClass: 'bg-error-container text-on-error-container',
        icon: 'warning',
        message: `Attend next ${classesNeeded > 0 ? classesNeeded : 1} classes non-stop`
      };
    } else {
      return {
        pct: currentPct.toFixed(1) + '%',
        inGoodStanding: true,
        badge: 'In Good Standing',
        badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
        icon: 'check_circle',
        message: `Safe Attendance: You can miss ${safeMiss >= 0 ? safeMiss : 0} more lectures`
      };
    }
  }, [attTotal, attAttended, attReq]);

  // --- Workbench 4: Citation Quick-Formatter State ---
  const [citeFormat, setCiteFormat] = useState<'APA7' | 'MLA9' | 'CHI'>('APA7');
  const [citeAuthor, setCiteAuthor] = useState('Kahneman, D.');
  const [citeYear, setCiteYear] = useState('2011');
  const [citeTitle, setCiteTitle] = useState('Thinking, Fast and Slow');
  const [citeSource, setCiteSource] = useState('Farrar, Straus and Giroux');
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    let text = '';
    if (citeFormat === 'APA7') {
      text = `${citeAuthor} (${citeYear}). ${citeTitle}. ${citeSource}.`;
    } else if (citeFormat === 'MLA9') {
      text = `${citeAuthor}. "${citeTitle}." ${citeSource}, ${citeYear}.`;
    } else {
      text = `${citeAuthor}. ${citeYear}. ${citeTitle}. ${citeSource}.`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- Recommender State ---
  const [recGoal, setRecGoal] = useState<'gpa' | 'finals' | 'study' | 'finance'>('gpa');

  const recommenderData = useMemo(() => {
    if (recGoal === 'gpa') {
      return {
        title: 'Target GPA & Honors Projection Engine',
        desc: 'Computes quality point differential between standard and AP/IB courses to plan semester grade requirements.',
        actionHref: '#workbench-gpa'
      };
    }
    if (recGoal === 'finals') {
      return {
        title: 'Final Exam Grade & Curve Determinant',
        desc: 'Computes minimum score required on final tests to maintain course letter boundaries.',
        actionHref: '#workbench-final'
      };
    }
    if (recGoal === 'study') {
      return {
        title: 'Spaced Repetition & Pomodoro Matrix',
        desc: 'Generates progressive review intervals preventing cognitive memory decay.',
        actionHref: '#directory'
      };
    }
    return {
      title: 'FAFSA SAI & Tuition Net Price Calculator',
      desc: 'Evaluates institutional cost of attendance against student aid index and scholarships.',
      actionHref: '#directory'
    };
  }, [recGoal]);

  // --- Directory Taxonomy Clusters ---
  const academicCategories = [
    {
      id: 'grades-gpa',
      title: '1. Grades & GPA',
      count: '18 Tools',
      icon: 'school',
      color: 'text-primary',
      desc: 'Calculate cumulative GPA, weighted honors/AP scales, and semester averages.',
      tools: [
        'Weighted GPA Calculator (Honors/AP/IB)',
        'Unweighted 4.0 Standard GPA Model',
        'CGPA to Percentage Converter (10.0 Scale)',
        'Semester SGPA to Cumulative Transition',
        'Letter Grade Standard Deviation Normalizer'
      ],
      extra: '13 More Grade Tools'
    },
    {
      id: 'exams-testing',
      title: '2. Exams & Testing',
      count: '14 Tools',
      icon: 'assignment',
      color: 'text-secondary',
      desc: 'Test score estimators, exam curves, and SAT/ACT score conversions.',
      tools: [
        'SAT to ACT Concordance Matrix (Official)',
        'Gaussian Normal Bell Curve Shifter',
        'GRE Quant & Verbal Scaler (130-170)',
        'GMAT Focus Edition Percentile Predictor',
        'IELTS 9-Band Composite Rounder'
      ],
      extra: '9 More Testing Tools'
    },
    {
      id: 'attendance-class',
      title: '3. Attendance & Class Time',
      count: '11 Tools',
      icon: 'how_to_reg',
      color: 'text-primary',
      desc: 'Calculate attendance percentages, safe absence limits, and missed classes.',
      tools: [
        'Mandatory 75% Rule Attendance Audit',
        'Medical Leave & Duty Leave Credit Offsets',
        'Catch-up Class Requirement Estimator',
        'Lab vs Theory Fractional Attendance Pacer',
        'Term End Attendance Forecast Model'
      ],
      extra: '6 More Attendance Tools'
    },
    {
      id: 'study-planning',
      title: '4. Study Planning & Timers',
      count: '16 Tools',
      icon: 'hourglass_top',
      color: 'text-secondary',
      desc: 'Pomodoro study timers, spaced review schedules, and reading speed estimators.',
      tools: [
        'Spaced Repetition Decay & Review Scheduler',
        'Pomodoro 25/5 & 50/10 Ratio Optimizer',
        'Credit-Hour 2:1 Study Budget Formula',
        'Reading WPM to Comprehension Hours',
        'Final Exam Sprint Burnout Risk Model'
      ],
      extra: '11 More Pacing Tools'
    },
    {
      id: 'admissions-degree',
      title: '5. College Admissions & Degree',
      count: '12 Tools',
      icon: 'account_tree',
      color: 'text-primary',
      desc: 'College acceptance chances, transfer credits, and graduation roadmaps.',
      tools: [
        'College Admissions Composite Index (AI)',
        'High School Rigor Ratio (AP/IB Count)',
        'Degree Progress & Remaining Elective Audit',
        'Quarter-to-Semester Credit Transfer Metric',
        'Anticipated Graduation Term Countdown'
      ],
      extra: '7 More Degree Tools'
    },
    {
      id: 'research-writing',
      title: '6. Research & Writing',
      count: '15 Tools',
      icon: 'menu_book',
      color: 'text-secondary',
      desc: 'Instant APA, MLA, and Chicago bibliography citations and essay word counts.',
      tools: [
        'APA 7th Edition Full Reference Generator',
        'MLA 9th Edition Works Cited Engine',
        'Chicago Notes & Bibliography Stylizer',
        'Words-to-Pages Estimator (Double vs Single)',
        'Flesch-Kincaid Grade Level Readability'
      ],
      extra: '10 More Writing Tools'
    },
    {
      id: 'tuition-aid',
      title: '7. Tuition & Financial Aid',
      count: '13 Tools',
      icon: 'account_balance_wallet',
      color: 'text-primary',
      desc: 'College net price, student loans, financial aid, and college savings plans.',
      tools: [
        'College Tuition Net Price Calculator',
        'FAFSA 2024–2025 SAI Index Estimator',
        'Student Loan Debt Amortization Pacer',
        'Major-Specific 10-Year Degree ROI Index',
        'Off-Campus Housing vs Dorm Budget Matrix'
      ],
      extra: '8 More Finance Tools'
    },
    {
      id: 'deadlines-schedules',
      title: '8. Deadlines & Schedules',
      count: '10 Tools',
      icon: 'calendar_month',
      color: 'text-secondary',
      desc: 'Assignment timelines, weekly schedule planners, and homework time management.',
      tools: [
        'Assignment Velocity & Daily Quota Pacer',
        'Weekly Time-Blocking Balance Allocator',
        'Lecture Backlog Catch-Up Matrix',
        'Academic Semester Week Counter',
        'Exam Clash Interval Gap Detector'
      ],
      extra: '5 More Schedule Tools'
    },
    {
      id: 'teacher-tools',
      title: '9. Teacher & Grading Tools',
      count: '14 Tools',
      icon: 'co_present',
      color: 'text-primary',
      desc: 'Quick grade charts, bell curve generators, and assignment rubric calculators.',
      tools: [
        'EZ Grader / Quick Scoring Chart Engine',
        'Classroom Bell Curve & Z-Score Scaler',
        'Rubric Matrix Weight Normalizer',
        'Test Item Difficulty (P-Value) & Discrimination',
        'Class Attendance Aggregator & Trendline'
      ],
      extra: '9 More Teacher Tools'
    }
  ];

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return academicCategories;
    const q = searchQuery.toLowerCase();
    return academicCategories.filter(
      cat =>
        cat.title.toLowerCase().includes(q) ||
        cat.desc.toLowerCase().includes(q) ||
        cat.tools.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery, academicCategories]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      <Header />

      <main className="w-full pt-20 bg-surface flex-1">
        {/* Section 1: Sub-navigation & Metrology Badges Strip */}
        <section className="w-full bg-surface-container-low py-space-xs shadow-sm border-b border-outline-variant/30">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-sm">
            {/* Sub-nav tabs */}
            <nav className="flex items-center gap-space-2xs overflow-x-auto w-full md:w-auto py-1 text-nowrap">
              {[
                { id: 'all', label: 'All Education Tools', icon: 'apps', href: '#directory' },
                { id: 'gpa', label: 'GPA & Grades', href: '#workbench-gpa' },
                { id: 'exams', label: 'Exam Prep & Curves', href: '#directory' },
                { id: 'attendance', label: 'Attendance & Pacing', href: '#workbench-attendance' },
                { id: 'study', label: 'Study Planner', href: '#directory' },
                { id: 'college', label: 'College & Aid', href: '#recommender' },
                { id: 'citations', label: 'Research & Citations', href: '#citations' },
                { id: 'teacher', label: 'Teacher Tools', href: '#directory' }
              ].map(tab => (
                <a
                  key={tab.id}
                  href={tab.href}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-space-xs py-1 rounded-md font-body-sm transition-colors flex items-center gap-1 ${
                    activeSubTab === tab.id
                      ? 'bg-primary text-on-primary shadow-sm font-medium'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {tab.icon && <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>}
                  {tab.label}
                </a>
              ))}
            </nav>
            {/* Metrology Trust Badges */}
            <div className="flex items-center gap-space-xs overflow-x-auto w-full md:w-auto text-nowrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-data-mono bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span> Student &amp; Educator Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-data-mono bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] text-secondary">bolt</span> Instant Client-Side Math
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-data-mono bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] text-primary">lock</span> 100% Air-Gapped Private
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Hero Header with Metric Strip & Quick Launch */}
        <section className="w-full relative overflow-hidden pt-space-xl pb-space-2xl bg-gradient-to-b from-surface via-surface-container-low to-surface">
          {/* Ambient backdrops */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-12 right-12 w-64 h-64 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10 flex flex-col items-center text-center">
            {/* Breadcrumb & Overline */}
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-caps uppercase tracking-wider mb-space-xs">
              <span className="text-primary font-bold">ACADEMIC SUCCESS &amp; LEARNING HUB</span>
            </div>
            {/* Main Headline */}
            <h1 className="font-headline-lg text-headline-lg md:font-display-hero md:text-display-hero text-on-surface tracking-tight font-bold max-w-4xl">
              Education Calculators &amp; Academic Planning Tools
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-sm leading-relaxed">
              Easy-to-use GPA calculators, final grade planners, study schedule helpers, citation makers, and exam score tools. Designed for students, parents, and teachers.
            </p>

            {/* Metric Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm w-full max-w-3xl mt-space-lg mb-space-lg">
              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-numerical-display-mobile text-primary font-bold">500+</span>
                <span className="font-label-caps text-on-surface-variant uppercase mt-1">Education Tools</span>
              </div>
              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-numerical-display-mobile text-secondary font-bold">50+</span>
                <span className="font-label-caps text-on-surface-variant uppercase mt-1">SUBJECTS &amp; GRADES</span>
              </div>
              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-numerical-display-mobile text-on-surface font-bold">8.2M+</span>
                <span className="font-label-caps text-on-surface-variant uppercase mt-1">PROBLEMS SOLVED</span>
              </div>
              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center">
                <span className="font-numerical-display-mobile text-primary font-bold leading-tight">INSTANT</span>
                <span className="font-label-caps text-on-surface-variant uppercase mt-1 text-center">RESULTS (No Waiting)</span>
              </div>
            </div>

            {/* Command Quick Search & Quick Pills */}
            <div className="w-full max-w-2xl">
              <div className="relative flex items-center shadow-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus-within:ring-2 focus-within:ring-primary/40">
                <span className="material-symbols-outlined absolute left-4 text-primary text-[22px]">search</span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-transparent text-on-surface font-body-md focus:outline-none placeholder:text-outline"
                  id="edu-search-input"
                  placeholder="Search weighted GPA, finals score, attendance rules, APA citations, SAT conversions..."
                  type="text"
                />
                <kbd className="absolute right-4 px-2 py-0.5 bg-surface-container font-data-mono text-[11px] text-on-surface-variant rounded shadow-sm">
                  /
                </kbd>
              </div>
              {/* Quick Trending Pills */}
              <div className="flex flex-wrap items-center justify-center gap-space-2xs mt-space-sm text-center">
                <span className="font-label-caps text-outline uppercase mr-1">Trending:</span>
                {[
                  'Weighted GPA',
                  'Final Grade Needed',
                  'Attendance 75% Rule',
                  'Pomodoro Pacer',
                  'APA 7th Generator',
                  'SAT/ACT Concordance'
                ].map(pill => (
                  <button
                    key={pill}
                    onClick={() => setSearchQuery(pill)}
                    className="px-space-xs py-1 rounded-full bg-surface-container text-on-surface font-body-sm hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Student Goal Finder ("I Want To...") */}
        <section className="w-full py-space-xl bg-surface border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
              <div>
                <span className="font-label-caps text-primary uppercase tracking-wider font-semibold">QUICK START GOALS</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                  What is your academic objective today?
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-2 md:mt-0">
                Choose what you want to achieve today to open the right calculator right away.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[
                {
                  title: 'Improve My GPA',
                  desc: 'Calculate future semester grades, test weighted vs. unweighted scores, and raise your overall GPA.',
                  icon: 'school',
                  link: '#workbench-gpa',
                  count: '14 Calculators',
                  color: 'primary'
                },
                {
                  title: 'Prepare For Exams',
                  desc: 'Score estimators, bell curves, SAT/ACT score conversions, and passing target thresholds.',
                  icon: 'quiz',
                  link: '#directory',
                  count: '12 Tools',
                  color: 'secondary'
                },
                {
                  title: 'Calculate Finals',
                  desc: 'Find the exact grade or score you need on your final exam or paper to keep your target grade.',
                  icon: 'calculate',
                  link: '#workbench-final',
                  count: '9 Calculators',
                  color: 'primary'
                },
                {
                  title: 'Plan Attendance & Time',
                  desc: 'Check attendance percentages, safe absence limits, and manage your study hours.',
                  icon: 'timer',
                  link: '#workbench-attendance',
                  count: '15 Tools',
                  color: 'secondary'
                },
                {
                  title: 'Admissions & Degree',
                  desc: 'Estimate college acceptance chances, transfer credits, and graduation timelines.',
                  icon: 'account_balance',
                  link: '#directory',
                  count: '11 Tools',
                  color: 'primary'
                },
                {
                  title: 'Format Citations',
                  desc: 'Instant citations in APA 7, MLA 9, Chicago, and Harvard with clean bibliographies.',
                  icon: 'format_quote',
                  link: '#workbench-citation',
                  count: '6 Generators',
                  color: 'secondary'
                },
                {
                  title: 'Tuition & Aid ROI',
                  desc: 'Calculate tuition costs, student loans, financial aid eligibility, and degree value.',
                  icon: 'payments',
                  link: '#directory',
                  count: '10 Tools',
                  color: 'primary'
                },
                {
                  title: 'Assignments & Pacing',
                  desc: 'Estimate reading time, words per hour, and plan assignment completion deadlines.',
                  icon: 'menu_book',
                  link: '#directory',
                  count: '8 Calculators',
                  color: 'secondary'
                }
              ].map(goal => (
                <a
                  key={goal.title}
                  href={goal.link}
                  className="group p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center transition-colors ${
                        goal.color === 'primary'
                          ? 'text-primary group-hover:bg-primary group-hover:text-on-primary'
                          : 'text-secondary group-hover:bg-secondary group-hover:text-on-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined">{goal.icon}</span>
                    </div>
                    <h3
                      className={`font-headline-md text-headline-md text-on-surface font-bold mt-space-sm transition-colors ${
                        goal.color === 'primary' ? 'group-hover:text-primary' : 'group-hover:text-secondary'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{goal.desc}</p>
                  </div>
                  <div
                    className={`mt-space-md pt-space-xs border-t border-outline-variant/15 flex items-center justify-between font-body-sm ${
                      goal.color === 'primary' ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    <span className="font-data-mono text-[12px] bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                      {goal.count}
                    </span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Academic Success Dashboard (Live Micro-Workbenches) */}
        <section className="w-full py-space-2xl bg-surface-container-low" id="workbenches">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <div className="inline-flex items-center gap-1 text-primary font-label-caps uppercase tracking-wider mb-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> POPULAR STUDENT TOOLS
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Interactive Academic Workbenches</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Try out our most popular interactive calculators for grades, finals, attendance, and citations.
              </p>
            </div>

            {/* Workbench Grid: 2x2 Clean layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* Micro-Workbench 1: Target GPA Predictor */}
              <div
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                id="workbench-gpa"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">analytics</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Target GPA Predictor</h3>
                    </div>
                    <span className="text-[11px] font-data-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      Scale 4.00
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Calculate the exact GPA you need next semester to achieve your cumulative graduation goal.
                  </p>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[11px]">Current Cumulative GPA</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                        id="gpa-current"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={curGpa}
                        onChange={e => setCurGpa(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[11px]">Completed Credits</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                        id="gpa-completed-credits"
                        type="number"
                        min="1"
                        max="200"
                        value={compCredits}
                        onChange={e => setCompCredits(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[11px]">Target Cumulative GPA</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                        id="gpa-target"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={targetGpa}
                        onChange={e => setTargetGpa(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[11px]">Future Credits Remaining</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                        id="gpa-future-credits"
                        type="number"
                        min="1"
                        max="150"
                        value={futCredits}
                        onChange={e => setFutCredits(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="mt-space-md p-space-sm bg-surface-container rounded-lg flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-on-surface-variant uppercase text-[11px]">Required Future GPA</span>
                    <div className="font-numerical-display text-primary font-bold leading-none mt-1" id="gpa-result-val">
                      {gpaResult.val}
                    </div>
                  </div>
                  <div className="text-right" id="gpa-badge">
                    <span
                      className={`inline-flex items-center gap-1 font-label-caps px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        gpaResult.color || 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">flag</span> {gpaResult.badge || 'Status'}
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">{gpaResult.message}</p>
                  </div>
                </div>
              </div>

              {/* Micro-Workbench 2: Final Exam Grade Needed */}
              <div
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                id="workbench-final"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">grade</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Final Exam Grade Needed</h3>
                    </div>
                    <span className="text-[11px] font-data-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      Weighted %
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Discover exactly what score is needed on your final exam or project to lock your desired letter grade.
                  </p>
                  <div className="grid grid-cols-3 gap-space-xs">
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">Current Grade %</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none border border-outline-variant/20"
                        id="final-current"
                        type="number"
                        step="0.5"
                        value={finalCurrent}
                        onChange={e => setFinalCurrent(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">Exam Weight %</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none border border-outline-variant/20"
                        id="final-weight"
                        type="number"
                        min="1"
                        max="100"
                        value={finalWeight}
                        onChange={e => setFinalWeight(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">Desired Grade %</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none border border-outline-variant/20"
                        id="final-desired"
                        type="number"
                        min="50"
                        max="100"
                        value={finalDesired}
                        onChange={e => setFinalDesired(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="mt-space-md p-space-sm bg-surface-container rounded-lg flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-on-surface-variant uppercase text-[11px]">Required Exam Score</span>
                    <div className="font-numerical-display text-secondary font-bold leading-none mt-1" id="final-result-val">
                      {finalResult.val}
                    </div>
                  </div>
                  <div className="text-right" id="final-badge">
                    <span
                      className={`inline-flex items-center gap-1 font-label-caps px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        finalResult.badgeClass || 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{finalResult.icon || 'warning'}</span>{' '}
                      {finalResult.badge}
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1" id="final-alternative">
                      {finalResult.alternative}
                    </p>
                  </div>
                </div>
              </div>

              {/* Micro-Workbench 3: Safe Attendance Deficit & Bunk Calculator */}
              <div
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                id="workbench-attendance"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">event_available</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                        Attendance &amp; Safe Absence Buffer
                      </h3>
                    </div>
                    <span className="text-[11px] font-data-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      75% / 85% Rules
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Check your attendance percentage and see how many classes you can safely miss while remaining in good standing.
                  </p>
                  <div className="grid grid-cols-3 gap-space-xs">
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">Total Held</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none border border-outline-variant/20"
                        id="att-total"
                        type="number"
                        value={attTotal}
                        onChange={e => setAttTotal(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">Attended</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none border border-outline-variant/20"
                        id="att-attended"
                        type="number"
                        value={attAttended}
                        onChange={e => setAttAttended(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-caps text-on-surface-variant uppercase text-[10px]">Required %</label>
                      <input
                        className="w-full p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface text-[15px] focus:outline-none border border-outline-variant/20"
                        id="att-req"
                        type="number"
                        value={attReq}
                        onChange={e => setAttReq(parseFloat(e.target.value) || 75)}
                      />
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="mt-space-md p-space-sm bg-surface-container rounded-lg flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <span className="font-label-caps text-on-surface-variant uppercase text-[11px]">Current Attendance</span>
                    <div className="font-numerical-display text-primary font-bold leading-none mt-1" id="att-current-pct">
                      {attendanceResult.pct}
                    </div>
                  </div>
                  <div className="text-right" id="att-status">
                    <span
                      className={`inline-flex items-center gap-1 font-label-caps px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        attendanceResult.badgeClass || 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {attendanceResult.icon || 'check_circle'}
                      </span>{' '}
                      {attendanceResult.badge || 'In Good Standing'}
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1" id="att-buffer-text">
                      {attendanceResult.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Micro-Workbench 4: Citation Quick-Formatter */}
              <div
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                id="workbench-citation"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">format_quote</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Citation Quick-Formatter</h3>
                    </div>
                    {/* Format pills */}
                    <div className="flex gap-1">
                      {(['APA7', 'MLA9', 'CHI'] as const).map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setCiteFormat(fmt)}
                          className={`px-2 py-0.5 rounded font-label-caps text-[10px] font-semibold transition-all ${
                            citeFormat === fmt
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {fmt === 'APA7' ? 'APA 7' : fmt === 'MLA9' ? 'MLA 9' : 'Chicago'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Create properly formatted citations for research papers according to the latest official style manuals.
                  </p>
                  <div className="grid grid-cols-2 gap-space-xs mb-2">
                    <input
                      className="p-2 bg-surface-container-low rounded-lg font-body-sm text-on-surface text-[13px] focus:outline-none border border-outline-variant/20"
                      id="cite-author"
                      value={citeAuthor}
                      onChange={e => setCiteAuthor(e.target.value)}
                      placeholder="Author (e.g. Kahneman, D.)"
                      type="text"
                    />
                    <input
                      className="p-2 bg-surface-container-low rounded-lg font-body-sm text-on-surface text-[13px] focus:outline-none border border-outline-variant/20"
                      id="cite-year"
                      value={citeYear}
                      onChange={e => setCiteYear(e.target.value)}
                      placeholder="Year (2011)"
                      type="text"
                    />
                  </div>
                  <input
                    className="w-full p-2 mb-2 bg-surface-container-low rounded-lg font-body-sm text-on-surface text-[13px] focus:outline-none border border-outline-variant/20"
                    id="cite-title"
                    value={citeTitle}
                    onChange={e => setCiteTitle(e.target.value)}
                    placeholder="Book / Article Title"
                    type="text"
                  />
                  <input
                    className="w-full p-2 bg-surface-container-low rounded-lg font-body-sm text-on-surface text-[13px] focus:outline-none border border-outline-variant/20"
                    id="cite-source"
                    value={citeSource}
                    onChange={e => setCiteSource(e.target.value)}
                    placeholder="Publisher / Journal"
                    type="text"
                  />
                </div>

                {/* Result Preview */}
                <div className="mt-space-md p-space-sm bg-surface-container rounded-lg border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-caps text-on-surface-variant uppercase text-[10px]">Formatted Reference Preview</span>
                    <button
                      className="text-[11px] font-label-caps text-primary flex items-center gap-1 hover:underline cursor-pointer"
                      id="cite-copy-btn"
                      onClick={handleCopyCitation}
                    >
                      <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>{' '}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div
                    className="font-body-sm text-[13px] text-on-surface bg-surface-container-lowest p-2 rounded border border-outline-variant/15 select-all leading-relaxed"
                    id="cite-output"
                  >
                    {citeFormat === 'APA7' && (
                      <>
                        {citeAuthor || 'Author'} ({citeYear || 'Year'}). <em>{citeTitle || 'Title'}</em>. {citeSource || 'Publisher'}.
                      </>
                    )}
                    {citeFormat === 'MLA9' && (
                      <>
                        {citeAuthor || 'Author'}. <em>{citeTitle || 'Title'}</em>. {citeSource || 'Publisher'}, {citeYear || 'Year'}.
                      </>
                    )}
                    {citeFormat === 'CHI' && (
                      <>
                        {citeAuthor || 'Author'}. {citeYear || 'Year'}. <em>{citeTitle || 'Title'}</em>. {citeSource || 'Publisher'}.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Comprehensive 10-Category Academic Directory (500+ Tools) */}
        <section className="w-full py-space-3xl bg-surface" id="directory">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <span className="font-label-caps text-primary uppercase tracking-wider font-semibold">CALCULATOR DIRECTORY</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">Explore All Academic Tools</h2>
              </div>
              <div className="flex items-center gap-2 mt-3 md:mt-0 font-data-mono text-on-surface-variant text-[12px]">
                <span>Categorical Coverage: 10 Disciplines</span>
                <span>•</span>
                <span className="text-primary font-bold">500+ Calculators &amp; Tools</span>
              </div>
            </div>

            {/* Directory Grid: 10 Comprehensive Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center ${cat.color}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{cat.title}</h3>
                      </div>
                      <span className={`text-[11px] font-data-mono bg-surface-container-high px-2 py-0.5 rounded font-semibold ${cat.color}`}>
                        {cat.count}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">{cat.desc}</p>
                    <ul className="space-y-1 font-body-sm text-body-sm text-on-surface">
                      {cat.tools.map((tool, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between py-1 border-b border-surface-container-low hover:text-primary cursor-pointer transition-colors"
                        >
                          <span>{tool}</span>
                          <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`mt-space-md pt-space-xs border-t border-surface-container flex items-center justify-between font-label-caps ${cat.color} font-semibold`}
                  >
                    <span>Explore {cat.extra}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Academic Journey Roadmap (Middle School to Professional) */}
        <section className="w-full py-space-2xl bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center max-w-3xl mx-auto mb-space-xl">
              <span className="font-label-caps text-primary uppercase tracking-wider font-semibold">Longitudinal Progression</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                Tools for Every Stage of Your Education
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                From middle school homework to graduate dissertations and professional licensing exams.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-space-sm relative">
              {[
                {
                  stage: 'STAGE 01',
                  name: 'Middle School',
                  desc: 'Foundational grade percentages, assignment checklist pacing, and healthy screen-time limits.',
                  keyTool: 'Basic Grade % & Reading Time'
                },
                {
                  stage: 'STAGE 02',
                  name: 'High School',
                  desc: 'AP/IB weighted GPA strategies, SAT/ACT score conversions, and college admissions odds.',
                  keyTool: 'Weighted 5.0 GPA + SAT Prep'
                },
                {
                  stage: 'STAGE 03',
                  name: 'Undergraduate',
                  desc: 'Credit hours balance, Major GPA, attendance threshold monitoring, and tuition net cost analysis.',
                  keyTool: 'Degree Audit + Final Exam Target'
                },
                {
                  stage: 'STAGE 04',
                  name: 'Graduate & PhD',
                  desc: 'Dissertation word counting, APA/MLA bibliographic integrity, and fellowship stipends.',
                  keyTool: 'Thesis Citations + Research Tools'
                },
                {
                  stage: 'STAGE 05',
                  name: 'Certifications',
                  desc: 'CPA, CFA, Bar, USMLE, and PMP structured spaced intervals and mock exam curves.',
                  keyTool: 'Study Schedules + Exam Curves'
                }
              ].map(item => (
                <div
                  key={item.stage}
                  className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/25 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-data-mono text-[11px] text-primary font-bold">{item.stage}</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mt-1 font-bold">{item.name}</h4>
                    <p className="font-body-sm text-[13px] text-on-surface-variant mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-space-md pt-2 border-t border-surface-container">
                    <span className="font-label-caps text-on-surface-variant text-[10px] block uppercase">Key Tools:</span>
                    <span className="font-body-sm text-[12px] text-primary font-medium">{item.keyTool}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Smart Academic Tool Recommender (Interactive 2-Step Decision Matrix) */}
        <section className="w-full py-space-2xl bg-surface" id="recommender">
          <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-md border border-outline-variant/30">
              <div className="text-center max-w-xl mx-auto mb-space-lg">
                <span className="font-label-caps text-primary uppercase tracking-wider font-semibold">Smart Tool Recommender</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                  Find the Exact Calculator for Your Goal
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Choose your goal to find the best calculator for your classes.
                </p>
              </div>

              {/* Step 1: Objective Selection */}
              <div className="space-y-space-sm mb-space-md">
                <label className="font-label-caps text-on-surface uppercase text-[11px] block font-bold">
                  Step 1: What is your primary focus right now?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'gpa', label: 'Grade & GPA' },
                    { id: 'finals', label: 'Finals & Exams' },
                    { id: 'study', label: 'Study Schedule' },
                    { id: 'finance', label: 'Tuition & Aid' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => setRecGoal(btn.id as typeof recGoal)}
                      className={`p-3 text-center rounded-lg font-body-sm transition-all font-medium border ${
                        recGoal === btn.id
                          ? 'bg-primary text-on-primary border-primary shadow-sm font-semibold'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/20'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Recommendation Result Container */}
              <div
                className="p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/20"
                id="recommender-result"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">recommend</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface font-bold" id="rec-title">
                      {recommenderData.title}
                    </h4>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed" id="rec-desc">
                    {recommenderData.desc}
                  </p>
                </div>
                <a
                  className="px-space-md py-2.5 bg-primary text-on-primary rounded-lg font-body-sm font-medium hover:bg-primary-container text-nowrap shadow-sm transition-all"
                  href={recommenderData.actionHref}
                  id="rec-action"
                >
                  Open Calculator
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Citation & Writing Hub (Side-by-Side Style Guidelines) */}
        <section className="w-full py-space-2xl bg-surface-container-low border-y border-outline-variant/20" id="citations">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
              <div>
                <span className="font-label-caps text-secondary uppercase tracking-wider font-semibold">Style Guide Metrology</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                  Academic Style Citation Protocols
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Certified rule matrices matching APA 7th Edition (2020), MLA 9th Edition (2021), and Chicago Manual of Style (17th/18th).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {/* APA 7th Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-data-mono text-[11px] bg-primary text-on-primary px-2 py-0.5 rounded font-semibold">
                      APA 7th Edition
                    </span>
                    <span className="font-label-caps text-on-surface-variant uppercase text-[10px]">Social Sciences</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-bold">Author-Date System</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-sm">
                    Emphasizes publication date to indicate temporal validity of findings.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded font-data-mono text-[12px] text-on-surface space-y-1 mb-space-sm border border-outline-variant/20">
                    <div className="text-on-surface-variant text-[10px] uppercase font-label-caps">In-Text Citation:</div>
                    <div>(Bandura, 1986, p. 45)</div>
                    <div className="text-on-surface-variant text-[10px] uppercase font-label-caps mt-2">Reference List Entry:</div>
                    <div className="italic">Author, A. A. (Year). Title of work: Subtitle. Publisher. DOI</div>
                  </div>
                </div>
                <div className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                  • Sentence-case titles for articles and books
                  <br />• DOIs formatted as live HTTPS links without &quot;doi:&quot; prefix
                </div>
              </div>

              {/* MLA 9th Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-data-mono text-[11px] bg-secondary text-on-secondary px-2 py-0.5 rounded font-semibold">
                      MLA 9th Edition
                    </span>
                    <span className="font-label-caps text-on-surface-variant uppercase text-[10px]">Humanities &amp; Lit</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-bold">Author-Page Standard</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-sm">
                    Streamlined container-based model focusing on authorship and specific page location.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded font-data-mono text-[12px] text-on-surface space-y-1 mb-space-sm border border-outline-variant/20">
                    <div className="text-on-surface-variant text-[10px] uppercase font-label-caps">In-Text Citation:</div>
                    <div>(Morrison 112)</div>
                    <div className="text-on-surface-variant text-[10px] uppercase font-label-caps mt-2">Works Cited Entry:</div>
                    <div className="italic">Author. &quot;Title of Source.&quot; Title of Container, Publisher, Year.</div>
                  </div>
                </div>
                <div className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                  • Title Case formatting for all published works
                  <br />• Container principle for multi-layered digital archives
                </div>
              </div>

              {/* Chicago Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-data-mono text-[11px] bg-inverse-surface text-inverse-on-surface px-2 py-0.5 rounded font-semibold">
                      Chicago 17th
                    </span>
                    <span className="font-label-caps text-on-surface-variant uppercase text-[10px]">History &amp; Arts</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-bold">Notes &amp; Bibliography</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-sm">
                    Granular footnote citations paired with comprehensive alphabetical end-matter.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded font-data-mono text-[12px] text-on-surface space-y-1 mb-space-sm border border-outline-variant/20">
                    <div className="text-on-surface-variant text-[10px] uppercase font-label-caps">Footnote (N):</div>
                    <div>
                      1. David McCullough, <em>John Adams</em> (New York: Simon, 2001), 74.
                    </div>
                    <div className="text-on-surface-variant text-[10px] uppercase font-label-caps mt-2">Bibliography (B):</div>
                    <div className="italic">
                      McCullough, David. <em>John Adams</em>. New York: Simon, 2001.
                    </div>
                  </div>
                </div>
                <div className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                  • Exact page specifications in superscript footnotes
                  <br />• Reverse author names in bibliography only
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Conceptual Academic Comparisons (Bento Style) */}
        <section className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="max-w-3xl mb-space-xl">
              <span className="font-label-caps text-primary uppercase tracking-wider font-semibold">LEARNING GUIDES</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                How Grades &amp; Scores Are Calculated
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Understanding the mathematical mechanics behind grading systems, test curves, and cognitive pacing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Comparison 1 */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">scale</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Weighted GPA vs. Unweighted GPA
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
                  Standard unweighted GPAs measure performance uniformly on a 4.0 ceiling (A = 4.0, B = 3.0, C = 2.0). Weighted GPAs
                  incorporate course rigor:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[12px] font-data-mono mb-space-sm">
                  <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/15">
                    <strong className="block text-on-surface font-medium">Standard 4.0</strong>
                    <span className="text-on-surface-variant">A = 4.0 pts</span>
                    <br />
                    <span className="text-on-surface-variant">B = 3.0 pts</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/15">
                    <strong className="block text-primary font-medium">AP / IB Honors 5.0</strong>
                    <span className="text-on-surface-variant">A = 5.0 (+1.0 point)</span>
                    <br />
                    <span className="text-on-surface-variant">B = 4.0 (+1.0 point)</span>
                  </div>
                </div>
                <p className="font-body-sm text-[13px] text-on-surface-variant">
                  <strong>Formula:</strong> GPA = Σ(Course Credits × Quality Points) / Σ Attempted Credits.
                </p>
              </div>

              {/* Comparison 2 */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary">compare_arrows</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">SAT vs. ACT Equivalence</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
                  Based on official College Board and ACT concordance data, test metrics map across different scales:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[12px] font-data-mono mb-space-sm">
                  <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/15">
                    <strong className="block text-on-surface font-medium">SAT (400–1600)</strong>
                    <span className="text-on-surface-variant">1540–1600 (Top 1%)</span>
                    <br />
                    <span className="text-on-surface-variant">1400–1430 (93rd %)</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/15">
                    <strong className="block text-secondary font-medium">ACT Composite (1–36)</strong>
                    <span className="text-on-surface-variant">36 (Top 1%)</span>
                    <br />
                    <span className="text-on-surface-variant">31 (93rd %)</span>
                  </div>
                </div>
                <p className="font-body-sm text-[13px] text-on-surface-variant">
                  ACT assesses science reasoning and trigonometry faster; SAT allows 33% more time per question.
                </p>
              </div>

              {/* Comparison 3 */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Why Spacing Out Study Sessions Beats Cramming
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
                  Studying in shorter, regular blocks helps your brain remember information far longer than pulling all-nighters before an exam:
                </p>
                <div className="bg-surface-container-lowest p-space-xs rounded-lg text-[13px] font-body-sm text-on-surface-variant mb-2 border border-outline-variant/15">
                  • <strong>All-Night Cramming:</strong> Quick short-term memory, but most information is forgotten within a few days.
                  <br />• <strong>Spaced Study Sessions (Reviewing over 1 to 2 weeks):</strong> Builds long-lasting memory and cuts test anxiety before finals.
                </div>
                <p className="font-body-sm text-[12px] text-outline">
                  Use our study planners and Pomodoro timers to build a healthy, stress-free routine.
                </p>
              </div>

              {/* Comparison 4 */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary">functions</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Final Exam Required Score Formula
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
                  To isolate the minimum score required on a terminal evaluation to achieve a course grade threshold:
                </p>
                <div className="bg-surface-container-lowest p-space-xs rounded-lg font-data-mono text-[13px] text-primary mb-2 border border-outline-variant/15">
                  Score = [Target - (Current × (1 - Weight))] / Weight
                </div>
                <p className="font-body-sm text-[13px] text-on-surface-variant">
                  Example: With 82% current grade, desired 90% (A), and a 30% final exam weight:
                  <span className="font-data-mono text-[12px] block mt-1">[90 - (82 × 0.70)] / 0.30 = 108.67% (impossible without bonus curve).</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Academic Integrity, Formula Reference & FAQs */}
        <section className="w-full py-space-3xl bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center max-w-2xl mx-auto mb-space-xl">
              <span className="font-label-caps text-primary uppercase tracking-wider font-semibold">HELP &amp; ANSWERS</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                Frequently Asked Academic Questions
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Clear, simple explanations for calculating grades, test scores, and study plans.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-space-sm">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                  Are these calculators private and free?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Yes, 100% free and completely private. All calculations happen right on your device or computer. We never collect or save your grades, courses, or personal data.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
                  What is the standard formula for high school and university GPA?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Grade Point Average is calculated as the sum product of each course&apos;s credit hours and earned quality points, divided by the aggregate number of credits attempted:
                  <br />
                  <span className="font-data-mono text-[13px] text-primary block mt-1 bg-surface-container-low p-2 rounded border border-outline-variant/15">
                    GPA = Σ(Credits_i × QualityPoints_i) / Σ Credits_i
                  </span>
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  How do test score curves work?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Teachers commonly adjust test scores using a few transparent methods: flat point additions (adding points so the highest score reaches 100%), grading on a standard bell curve relative to the class average, or applying a square root curve (New Score = 10 × √Raw Score) to give a fair boost to lower scores.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">format_list_bulleted</span>
                  Are citations updated for the latest 2024–2025 editorial guidelines?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Yes. All citation engines adhere to APA 7th Edition (updated guidelines for digital objects, multiple authors, and online media), MLA 9th Edition (expanded container logic and inclusive language specifications), and Chicago 17th/18th Edition standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 11: Call to Action Banner */}
        <section className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-primary text-on-primary rounded-2xl p-space-xl text-center relative overflow-hidden shadow-lg">
              <div className="max-w-2xl mx-auto relative z-10">
                <span className="font-label-caps uppercase tracking-widest text-primary-fixed-dim font-semibold">
                  READY TO REACH YOUR ACADEMIC GOALS?
                </span>
                <h2 className="font-headline-lg text-headline-lg md:font-display-hero md:text-headline-lg text-on-primary mt-2 font-bold">
                  Calculate Your Path to Academic Excellence
                </h2>
                <p className="font-body-md text-body-md text-on-primary/80 mt-space-xs max-w-xl mx-auto">
                  Start planning your GPA, study schedule, and exam preparation with free, easy-to-use tools.
                </p>
                <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-sm">
                  <a
                    className="px-space-lg py-3 rounded-lg bg-surface-container-lowest text-primary font-body-md font-semibold hover:bg-surface transition-colors shadow-sm"
                    href="#workbenches"
                  >
                    Launch Live Workbenches
                  </a>
                  <a
                    className="px-space-lg py-3 rounded-lg bg-primary-container text-on-primary font-body-md font-semibold hover:bg-opacity-80 transition-colors shadow-sm"
                    href="#directory"
                  >
                    Explore All Calculators
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
