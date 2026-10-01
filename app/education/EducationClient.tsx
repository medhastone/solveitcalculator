'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

export default function EducationClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Interactive Tool 1: Target GPA Calculator ---
  const [gpaScale, setGpaScale] = useState<'4.0' | '4.33' | '5.0' | '10.0'>('4.0');
  const [curGpa, setCurGpa] = useState<number>(3.45);
  const [compCredits, setCompCredits] = useState<number>(48);
  const [targetGpa, setTargetGpa] = useState<number>(3.70);
  const [futCredits, setFutCredits] = useState<number>(32);

  const maxScaleVal = useMemo(() => {
    switch (gpaScale) {
      case '4.33':
        return 4.33;
      case '5.0':
        return 5.0;
      case '10.0':
        return 10.0;
      default:
        return 4.0;
    }
  }, [gpaScale]);

  const gpaResult = useMemo(() => {
    const cur = Number(curGpa) || 0;
    const comp = Number(compCredits) || 0;
    const target = Number(targetGpa) || 0;
    const fut = Number(futCredits) || 0;

    if (fut <= 0 || comp < 0) {
      return { val: '—', status: 'invalid', message: 'Enter future credit hours' };
    }

    const totalCredits = comp + fut;
    const totalPointsNeeded = target * totalCredits;
    const pointsEarned = cur * comp;
    const futurePointsNeeded = totalPointsNeeded - pointsEarned;
    const requiredGpa = futurePointsNeeded / fut;

    if (requiredGpa > maxScaleVal) {
      return {
        val: requiredGpa.toFixed(2),
        status: 'exceeds',
        badge: `Exceeds ${maxScaleVal} Scale`,
        message: `Requires ${requiredGpa.toFixed(2)} average (above standard ${maxScaleVal} max). Consider taking more credit hours or honors/weighted options if available.`,
        color: 'bg-error-container text-on-error-container'
      };
    } else if (requiredGpa < 0) {
      return {
        val: '0.00',
        status: 'achieved',
        badge: 'Target Already Met',
        message: 'Your current accumulated points already surpass this target average.',
        color: 'bg-secondary-container text-on-secondary-container'
      };
    } else if (requiredGpa <= maxScaleVal * 0.85) {
      return {
        val: requiredGpa.toFixed(2),
        status: 'manageable',
        badge: 'Highly Manageable',
        message: `Maintain an estimated ${requiredGpa.toFixed(2)} average across your next ${fut} credits.`,
        color: 'bg-secondary-container text-on-secondary-container'
      };
    } else {
      return {
        val: requiredGpa.toFixed(2),
        status: 'demanding',
        badge: 'High Performance Required',
        message: `Requires a strong ${requiredGpa.toFixed(2)} average over your upcoming ${fut} credit hours.`,
        color: 'bg-primary-container text-on-primary-container'
      };
    }
  }, [curGpa, compCredits, targetGpa, futCredits, maxScaleVal]);

  // --- Interactive Tool 2: Final Grade Needed Calculator ---
  const [finalCurrent, setFinalCurrent] = useState<number>(84.5);
  const [finalWeight, setFinalWeight] = useState<number>(25);
  const [finalDesired, setFinalDesired] = useState<number>(90);

  const finalResult = useMemo(() => {
    const cur = Number(finalCurrent) || 0;
    const wPct = Number(finalWeight) || 0;
    const des = Number(finalDesired) || 0;

    if (wPct <= 0 || wPct > 100) {
      return { val: '—', status: 'invalid', message: 'Enter exam weight between 1% and 100%' };
    }

    const w = wPct / 100;
    const req = (des - cur * (1 - w)) / w;
    const reqFormatted = req.toFixed(1) + '%';

    const bTarget = des > 85 ? 85 : 80;
    const bReq = (bTarget - cur * (1 - w)) / w;

    if (req > 100) {
      return {
        val: reqFormatted,
        badge: 'Extra Credit Required',
        badgeClass: 'bg-error-container text-on-error-container',
        icon: 'warning',
        message: `Score exceeds 100%. Alternatively, a ${bReq.toFixed(1)}% on the final earns a ${bTarget}% overall grade.`
      };
    } else if (req <= 0) {
      return {
        val: '0.0%',
        badge: 'Grade Locked',
        badgeClass: 'bg-secondary-container text-on-secondary-container',
        icon: 'check_circle',
        message: `Your existing ${cur}% coursework already secures at least ${des}% overall.`
      };
    } else if (req <= 70) {
      return {
        val: reqFormatted,
        badge: 'Comfortable Target',
        badgeClass: 'bg-secondary-container text-on-secondary-container',
        icon: 'check_circle',
        message: `Score at least ${reqFormatted} on the final to secure your ${des}% target.`
      };
    } else {
      return {
        val: reqFormatted,
        badge: 'Dedicated Prep Required',
        badgeClass: 'bg-primary-container text-on-primary-container',
        icon: 'edit_note',
        message: `Aim for ${reqFormatted} on the final exam to reach your ${des}% goal.`
      };
    }
  }, [finalCurrent, finalWeight, finalDesired]);

  // --- Interactive Tool 3: Configurable Attendance Calculator ---
  const [attTotal, setAttTotal] = useState<number>(40);
  const [attAttended, setAttAttended] = useState<number>(34);
  const [attReq, setAttReq] = useState<number>(75);

  const attendanceResult = useMemo(() => {
    const tot = Number(attTotal) || 0;
    const att = Math.min(Number(attAttended) || 0, tot);
    const req = Number(attReq) || 75;

    if (tot <= 0) {
      return { pct: '0.0%', status: 'neutral', message: 'Enter valid class session counts' };
    }

    const currentPct = (att / tot) * 100;
    const reqDecimal = req / 100;

    if (currentPct < req) {
      // Classes to attend consecutively to reach threshold
      const classesNeeded = Math.ceil((reqDecimal * tot - att) / (1 - reqDecimal));
      return {
        pct: currentPct.toFixed(1) + '%',
        isAbove: false,
        badge: `Below ${req}% Threshold`,
        badgeClass: 'bg-error-container text-on-error-container',
        icon: 'error_outline',
        classesMissed: tot - att,
        message: `Must attend next ${classesNeeded > 0 ? classesNeeded : 1} consecutive sessions to reach ${req}%.`
      };
    } else {
      // Allowable absences before falling below threshold
      const allowableMisses = Math.floor((att - reqDecimal * tot) / reqDecimal);
      return {
        pct: currentPct.toFixed(1) + '%',
        isAbove: true,
        badge: `Meets ${req}% Requirement`,
        badgeClass: 'bg-secondary-container text-on-secondary-container',
        icon: 'check_circle',
        classesMissed: tot - att,
        message: `Estimated buffer: Up to ${Math.max(0, allowableMisses)} lecture(s) can be missed before falling below ${req}%.`
      };
    }
  }, [attTotal, attAttended, attReq]);

  // --- Interactive Tool 4: Study Time Calculator ---
  const [enrolledCredits, setEnrolledCredits] = useState<number>(15);
  const [studyRigor, setStudyRigor] = useState<number>(2.0); // 1.5, 2.0, 3.0 hrs per credit
  const [studyDays, setStudyDays] = useState<number>(5);

  const studyTimeResult = useMemo(() => {
    const credits = Number(enrolledCredits) || 0;
    const factor = Number(studyRigor) || 2.0;
    const days = Math.max(1, Math.min(7, Number(studyDays) || 5));

    const totalWeeklyStudy = credits * factor;
    const dailyStudy = totalWeeklyStudy / days;
    const pomodoroBlocks = Math.round((dailyStudy * 60) / 30); // 25m study + 5m break

    return {
      weeklyHours: totalWeeklyStudy.toFixed(1),
      dailyHours: dailyStudy.toFixed(1),
      pomodoroCount: pomodoroBlocks,
      ratioDesc: factor === 1.5 ? 'Foundational' : factor === 2.0 ? 'Standard Academic (2:1)' : 'Intensive / STEM (3:1)'
    };
  }, [enrolledCredits, studyRigor, studyDays]);

  // --- Interactive Tool 5: Degree / Credit Progress Calculator ---
  const [totalDegreeCredits, setTotalDegreeCredits] = useState<number>(120);
  const [completedCredits, setCompletedCredits] = useState<number>(68);
  const [inProgressCredits, setInProgressCredits] = useState<number>(15);

  const degreeProgressResult = useMemo(() => {
    const total = Math.max(1, Number(totalDegreeCredits) || 120);
    const comp = Math.max(0, Number(completedCredits) || 0);
    const inProg = Math.max(0, Number(inProgressCredits) || 0);

    const compPct = Math.min(100, (comp / total) * 100);
    const inProgPct = Math.min(100 - compPct, (inProg / total) * 100);
    const remaining = Math.max(0, total - comp - inProg);

    return {
      compPct: compPct.toFixed(1),
      inProgPct: inProgPct.toFixed(1),
      remainingCredits: remaining,
      totalEarnedPlusCurrent: comp + inProg
    };
  }, [totalDegreeCredits, completedCredits, inProgressCredits]);

  // --- Interactive Tool 6: Graduation Term Estimator ---
  const [creditsRemainingGrad, setCreditsRemainingGrad] = useState<number>(52);
  const [creditsPerTerm, setCreditsPerTerm] = useState<number>(15);
  const [termsPerYear, setTermsPerYear] = useState<number>(2);

  const graduationResult = useMemo(() => {
    const rem = Math.max(0, Number(creditsRemainingGrad) || 0);
    const perTerm = Math.max(1, Number(creditsPerTerm) || 15);
    const termsYear = Math.max(1, Number(termsPerYear) || 2);

    const termsNeeded = Math.ceil(rem / perTerm);
    const yearsNeeded = (termsNeeded / termsYear).toFixed(1);

    return {
      termsNeeded,
      yearsNeeded,
      desc: `${termsNeeded} academic term${termsNeeded === 1 ? '' : 's'} (~${yearsNeeded} academic year${Number(yearsNeeded) === 1 ? '' : 's'})`
    };
  }, [creditsRemainingGrad, creditsPerTerm, termsPerYear]);

  // --- Citation Quick-Formatter State ---
  const [citeFormat, setCiteFormat] = useState<'APA7' | 'MLA9' | 'CHI17'>('APA7');
  const [citeAuthor, setCiteAuthor] = useState('Kahneman, Daniel');
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

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // --- Categories & Tool Taxonomy ---
  const categories = [
    {
      id: 'grades-gpa',
      title: 'Grades & GPA',
      icon: 'school',
      desc: 'Calculate semester SGPA, cumulative CGPA, weighted honors/AP scales, and grade conversions.',
      tools: [
        { name: 'Target GPA Calculator', desc: 'Estimate required future semester grades for graduation targets', link: '#tool-gpa' },
        { name: 'Weighted vs Unweighted GPA', desc: 'Compare 4.0 standard scales with 5.0 AP/IB course weightings', link: '#guide-weighted-gpa' },
        { name: 'Grade Calculator', desc: 'Weighted assignment, exam, quiz, and homework grade calculations', link: '#tool-final' },
        { name: 'CGPA to Percentage Converter', desc: 'Standard 10.0 scale conversions using 9.5 and university multipliers', link: '#guide-cgpa-percentage' },
        { name: 'Semester SGPA Calculator', desc: 'Track term-by-term grade point performance across credit loads', link: '#tool-gpa' }
      ]
    },
    {
      id: 'exams-testing',
      title: 'Exams & Testing',
      icon: 'quiz',
      desc: 'Estimate exam scores, calculate test curves, and reference official test concordance mappings.',
      tools: [
        { name: 'Final Exam Grade Needed', desc: 'Calculate the minimum score required on your final exam', link: '#tool-final' },
        { name: 'SAT to ACT Concordance Tool', desc: 'Reference official College Board & ACT score concordance tables', link: '#guide-sat-act' },
        { name: 'Test Curve Calculator', desc: 'Estimate adjusted scores with flat addition or square root curves', link: '#guide-test-curves' },
        { name: 'Exam Pacing & Time per Question', desc: 'Calculate time allocation per question for timed tests', link: '#tool-study' }
      ]
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: 'event_available',
      desc: 'Track class attendance percentages, monitor threshold buffers, and calculate catch-up sessions.',
      tools: [
        { name: 'Attendance Percentage Calculator', desc: 'Calculate current attendance percentage across held classes', link: '#tool-attendance' },
        { name: 'Absence Buffer Estimator', desc: 'Calculate allowable absences before dropping below required thresholds', link: '#tool-attendance' },
        { name: 'Catch-up Class Calculator', desc: 'Estimate consecutive classes needed to restore attendance threshold', link: '#tool-attendance' },
        { name: 'Lab vs Theory Attendance Model', desc: 'Differentiate attendance across lecture and practical coursework', link: '#guide-attendance-calc' }
      ]
    },
    {
      id: 'study-planning',
      title: 'Study Planning',
      icon: 'schedule',
      desc: 'Plan weekly study hours, estimate reading workloads, and structure focused study sessions.',
      tools: [
        { name: 'Credit-Hour Study Time Calculator', desc: 'Calculate weekly study hours using standard 2:1 and 3:1 credit ratios', link: '#tool-study' },
        { name: 'Reading Time Estimator', desc: 'Estimate study reading time based on page counts and reading speed', link: '#tool-study' },
        { name: 'Pomodoro Study Session Allocator', desc: 'Structure study blocks into 25/5 and 50/10 focused intervals', link: '#tool-study' },
        { name: 'Spaced Repetition Review Planner', desc: 'Schedule progressive review intervals before midterm and final exams', link: '#guide-study-habits' }
      ]
    },
    {
      id: 'college-graduation',
      title: 'College & Graduation',
      icon: 'account_tree',
      desc: 'Track degree credit completion, estimate graduation terms, and evaluate transfer credits.',
      tools: [
        { name: 'Degree Credit Progress Calculator', desc: 'Track earned, in-progress, and remaining credits toward your degree', link: '#tool-degree' },
        { name: 'Graduation Date & Term Estimator', desc: 'Estimate academic terms and years remaining until graduation', link: '#tool-grad' },
        { name: 'College Admissions Profile & Planning', desc: 'Compare GPA, test scores, and course rigor against target profiles', link: '#guide-admissions-planning' },
        { name: 'Quarter to Semester Credit Converter', desc: 'Convert credits between quarter units (0.67) and semester hours', link: '#guide-credits-gpa' }
      ]
    },
    {
      id: 'tuition-aid',
      title: 'Tuition & Financial Aid',
      icon: 'payments',
      desc: 'Estimate college costs, net tuition expenses, scholarship offsets, and loan repayment schedules.',
      tools: [
        { name: 'College Net Price & Cost Estimator', desc: 'Calculate total cost of attendance minus grants and scholarships', link: '#directory' },
        { name: 'Scholarship Offset Calculator', desc: 'Evaluate renewable scholarship values against multi-year tuition', link: '#directory' },
        { name: 'Student Loan Repayment Estimator', desc: 'Calculate monthly loan payments and interest over standard 10-year plans', link: '/finance/compound-interest-calculator' },
        { name: 'Dorm vs Off-Campus Housing Budget', desc: 'Compare living expenses across campus housing and shared rentals', link: '#directory' }
      ]
    },
    {
      id: 'research-writing',
      title: 'Research & Writing',
      icon: 'format_quote',
      desc: 'Format citations, estimate essay page lengths, and check readability metrics for academic papers.',
      tools: [
        { name: 'APA 7th Reference Generator', desc: 'Format book, journal, and website references in standard APA 7 style', link: '#tool-citation' },
        { name: 'MLA 9th Works Cited Formatter', desc: 'Generate MLA container-based citations for literature and humanities papers', link: '#tool-citation' },
        { name: 'Chicago 17th Style Formatter', desc: 'Format notes and bibliography citations for history and arts research', link: '#tool-citation' },
        { name: 'Words to Pages Estimator', desc: 'Convert word count to estimated pages in single or double spacing', link: '#tool-citation' }
      ]
    },
    {
      id: 'deadlines-schedules',
      title: 'Deadlines & Schedules',
      icon: 'calendar_month',
      desc: 'Plan assignment timelines, balance weekly class schedules, and manage exam dates.',
      tools: [
        { name: 'Assignment Pacing Calculator', desc: 'Break large projects and essays into daily milestone targets', link: '#tool-study' },
        { name: 'Semester Week Countdown', desc: 'Track academic weeks completed and remaining in the current term', link: '/time-date/date-difference-calculator' },
        { name: 'Exam Schedule Gap Analyzer', desc: 'Plan study intervals between consecutive examination dates', link: '#tool-study' }
      ]
    },
    {
      id: 'teacher-grading',
      title: 'Teacher & Grading Tools',
      icon: 'co_present',
      desc: 'Quick grade scoring charts, bell curve normalizers, and weighted rubric calculators for educators.',
      tools: [
        { name: 'Quick Grade Chart (EZ Grader)', desc: 'Generate grade percentages and letter scores for total question counts', link: '#tool-final' },
        { name: 'Weighted Rubric Calculator', desc: 'Calculate composite grades from multiple criteria weights', link: '#tool-final' },
        { name: 'Class Score Normalizer', desc: 'Analyze test score distributions, mean, and standard deviation', link: '/math/standard-deviation-calculator' }
      ]
    }
  ];

  // Search filter
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories
      .map(cat => {
        const matchesCategory = cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q);
        const matchedTools = cat.tools.filter(
          t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
        );
        if (matchesCategory || matchedTools.length > 0) {
          return {
            ...cat,
            tools: matchesCategory ? cat.tools : matchedTools
          };
        }
        return null;
      })
      .filter(Boolean) as typeof categories;
  }, [searchQuery, categories]);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary pt-0">

      {/* DEDICATED VISIBLE BREADCRUMB BAR (ALWAYS VISIBLE BELOW FIXED HEADER) */}
      <section aria-label="Breadcrumb Navigation" className="w-full bg-surface-container-low border-b border-outline-variant/30 py-3 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant flex-wrap font-medium">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-on-surface hover:underline"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">home</span>
              <span>Home</span>
            </Link>
            <span className="text-outline-variant select-none">/</span>
            <span className="text-primary font-bold" aria-current="page">
              Education Calculators
            </span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>Academic Planning Hub</span>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 1: HERO SECTION */}
      <header className="w-full pt-8 pb-12 md:pt-12 md:pb-16 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-linear-to-b from-surface-container-low/60 to-surface">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Free Student &amp; Academic Calculators</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface max-w-4xl mx-auto leading-tight">
            Education Calculators for GPA, Grades, Exams &amp; Study Planning
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-primary mt-4">
            Calculate Your Grades. Plan Your Studies. Stay on Track.
          </p>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto mt-3 leading-relaxed">
            Free calculators for GPA, grades, final exams, attendance, study time, college costs, and academic planning.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="relative flex items-center bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined absolute left-4 text-primary text-[22px]">search</span>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-transparent text-on-surface text-base focus:outline-none placeholder:text-outline"
                id="edu-search-input"
                placeholder="What do you need to calculate?"
                type="text"
                aria-label="Search education calculators"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              ) : (
                <kbd className="hidden sm:inline-block absolute right-4 px-2 py-0.5 bg-surface-container font-mono text-[11px] text-on-surface-variant rounded border border-outline-variant/30">
                  /
                </kbd>
              )}
            </div>

            {/* Smart Search Examples */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-on-surface-variant font-medium mr-1">Try searching:</span>
              {[
                'Calculate my GPA',
                'What grade do I need on my final?',
                'How many classes can I miss?',
                'Convert CGPA to percentage',
                'How long should I study?'
              ].map(example => (
                <button
                  key={example}
                  onClick={() => setSearchQuery(example.replace(/[“”?]/g, ''))}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface font-medium transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: POPULAR CALCULATORS (NEAR TOP) */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">High Utility Tools</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Popular Education Calculators</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md">
              Quick access to our most widely used calculators for grades, GPA targets, attendance, and study planning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'GPA Calculator',
                desc: 'Calculate cumulative semester and graduation GPA on 4.0, 4.33, or 5.0 weighted scales.',
                icon: 'school',
                link: '#tool-gpa',
                badge: 'Configurable Scales'
              },
              {
                name: 'Grade Calculator',
                desc: 'Calculate composite course grades across weighted assignments, quizzes, and midterms.',
                icon: 'assignment_turned_in',
                link: '#tool-final',
                badge: 'Weighted %'
              },
              {
                name: 'Final Grade Calculator',
                desc: 'Find the exact score needed on your final exam or project to earn your target course grade.',
                icon: 'calculate',
                link: '#tool-final',
                badge: 'Target Estimator'
              },
              {
                name: 'CGPA Calculator',
                desc: 'Convert 10.0 scale CGPA to percentage or standard 4.0 GPA with institutional formulas.',
                icon: 'grade',
                link: '#guide-cgpa-percentage',
                badge: '10.0 & 4.0 Scales'
              },
              {
                name: 'Attendance Calculator',
                desc: 'Track attendance percentage and determine allowable absences or needed catch-up classes.',
                icon: 'event_available',
                link: '#tool-attendance',
                badge: 'Threshold Buffer'
              },
              {
                name: 'Study Time Calculator',
                desc: 'Plan weekly study hours based on credit hours load and course difficulty factors.',
                icon: 'timer',
                link: '#tool-study',
                badge: '2:1 & 3:1 Ratios'
              },
              {
                name: 'Exam Score Calculator',
                desc: 'Calculate curved test scores, normal distributions, and time per question metrics.',
                icon: 'quiz',
                link: '#guide-test-curves',
                badge: 'Score Analysis'
              },
              {
                name: 'Scholarship Calculator',
                desc: 'Estimate college net price, scholarship offsets, and annual out-of-pocket tuition costs.',
                link: '#directory',
                badge: 'Financial Aid'
              }
            ].map(item => (
              <a
                key={item.name}
                href={item.link}
                className="group p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Open Calculator</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: STUDENT GOAL-BASED DISCOVERY */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface-container-low/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Goal-Based Discovery</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">What Do You Need to Calculate?</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Select your specific academic objective to jump directly to the most relevant calculation tool.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Improve My GPA',
                desc: 'Calculate what GPA you need next term to reach your cumulative graduation goal.',
                icon: 'trending_up',
                link: '#tool-gpa',
                color: 'text-primary'
              },
              {
                title: 'Calculate My Final Grade',
                desc: 'Find the exact test score required on your final exam to secure an A, B, or passing grade.',
                icon: 'calculate',
                link: '#tool-final',
                color: 'text-secondary'
              },
              {
                title: 'Check My Attendance',
                desc: 'Calculate your attendance percentage and determine how many classes you can miss safely.',
                icon: 'how_to_reg',
                link: '#tool-attendance',
                color: 'text-primary'
              },
              {
                title: 'Prepare for Exams',
                desc: 'Calculate test score curves, time per question, and review SAT/ACT concordance tables.',
                icon: 'quiz',
                link: '#guide-sat-act',
                color: 'text-secondary'
              },
              {
                title: 'Plan My Study Time',
                desc: 'Calculate weekly study hours needed for your enrolled credits and course difficulty.',
                icon: 'timelapse',
                link: '#tool-study',
                color: 'text-primary'
              },
              {
                title: 'Track My Degree Progress',
                desc: 'Calculate completed credits, in-progress units, and remaining graduation requirements.',
                icon: 'analytics',
                link: '#tool-degree',
                color: 'text-secondary'
              },
              {
                title: 'Estimate College Costs',
                desc: 'Calculate net tuition, room and board, scholarships, and potential student loan payments.',
                link: '#directory',
                color: 'text-primary'
              },
              {
                title: 'Plan Graduation',
                desc: 'Estimate remaining academic terms and years needed based on planned course loads.',
                icon: 'workspace_premium',
                link: '#tool-grad',
                color: 'text-secondary'
              }
            ].map(goal => (
              <a
                key={goal.title}
                href={goal.link}
                className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors text-primary">
                    <span className="material-symbols-outlined text-[22px]">{goal.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{goal.desc}</p>
                </div>
                <div className="mt-4 pt-2 flex items-center text-xs font-semibold text-primary gap-1">
                  <span>Start Calculation</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED INTERACTIVE TOOLS (LIVE WORKBENCHES) */}
      <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Interactive Student Calculators</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Live Academic Calculators</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md">
              Fast, client-side tools to calculate GPA targets, final exam scores, attendance thresholds, and study schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TOOL 1: Target GPA Calculator */}
            <div
              id="tool-gpa"
              className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">school</span>
                    <h3 className="text-lg font-bold text-on-surface">Target GPA Calculator</h3>
                  </div>
                  {/* Scale selection */}
                  <div className="flex gap-1 bg-surface-container p-0.5 rounded-lg text-xs font-semibold">
                    {(['4.0', '4.33', '5.0', '10.0'] as const).map(scale => (
                      <button
                        key={scale}
                        onClick={() => {
                          setGpaScale(scale);
                          if (scale === '10.0' && curGpa <= 4.0) {
                            setCurGpa(8.2);
                            setTargetGpa(8.8);
                          } else if (scale !== '10.0' && curGpa > 5.0) {
                            setCurGpa(3.45);
                            setTargetGpa(3.70);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-md transition-colors ${
                          gpaScale === scale
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Calculate the average grade point average required over your remaining credits to reach your cumulative graduation goal.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Current Cumulative GPA
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      step="0.01"
                      min="0"
                      max={maxScaleVal}
                      value={curGpa}
                      onChange={e => setCurGpa(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Completed Credits
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="0"
                      max="250"
                      value={compCredits}
                      onChange={e => setCompCredits(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Target Cumulative GPA
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      step="0.01"
                      min="0"
                      max={maxScaleVal}
                      value={targetGpa}
                      onChange={e => setTargetGpa(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Future Credits Remaining
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="150"
                      value={futCredits}
                      onChange={e => setFutCredits(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Result Container */}
              <div className="mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Required Future Average
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary leading-none mt-1">
                    {gpaResult.val}
                  </div>
                </div>
                <div className="text-right max-w-[60%]">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${gpaResult.color}`}>
                    {gpaResult.badge}
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">{gpaResult.message}</p>
                </div>
              </div>
            </div>

            {/* TOOL 2: Final Grade Needed Calculator */}
            <div
              id="tool-final"
              className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">calculate</span>
                    <h3 className="text-lg font-bold text-on-surface">Final Grade Needed Calculator</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    Weighted %
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Discover the exact score needed on your final exam, project, or paper to achieve your desired overall class grade.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Current Grade %
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      step="0.5"
                      min="0"
                      max="150"
                      value={finalCurrent}
                      onChange={e => setFinalCurrent(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Exam Weight %
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="100"
                      value={finalWeight}
                      onChange={e => setFinalWeight(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Desired Grade %
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="40"
                      max="100"
                      value={finalDesired}
                      onChange={e => setFinalDesired(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Result Container */}
              <div className="mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Score Needed on Final
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary leading-none mt-1">
                    {finalResult.val}
                  </div>
                </div>
                <div className="text-right max-w-[60%]">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${finalResult.badgeClass}`}>
                    <span className="material-symbols-outlined text-[14px]">{finalResult.icon}</span>
                    <span>{finalResult.badge}</span>
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">{finalResult.message}</p>
                </div>
              </div>
            </div>

            {/* TOOL 3: Configurable Attendance Calculator */}
            <div
              id="tool-attendance"
              className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">event_available</span>
                    <h3 className="text-lg font-bold text-on-surface">Attendance Calculator</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    Configurable %
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Calculate your current attendance percentage and estimate allowable absences or catch-up classes against your institution&apos;s required threshold.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Classes Held
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="300"
                      value={attTotal}
                      onChange={e => setAttTotal(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Classes Attended
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="0"
                      max={attTotal}
                      value={attAttended}
                      onChange={e => setAttAttended(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Required %
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="50"
                      max="100"
                      value={attReq}
                      onChange={e => setAttReq(parseFloat(e.target.value) || 75)}
                    />
                  </div>
                </div>
              </div>

              {/* Result Container */}
              <div className="mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Current Attendance
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary leading-none mt-1">
                    {attendanceResult.pct}
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    {attAttended} of {attTotal} sessions ({attTotal - attAttended} missed)
                  </span>
                </div>
                <div className="text-right max-w-[60%]">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${attendanceResult.badgeClass}`}>
                    <span className="material-symbols-outlined text-[14px]">{attendanceResult.icon}</span>
                    <span>{attendanceResult.badge}</span>
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">{attendanceResult.message}</p>
                </div>
              </div>
            </div>

            {/* TOOL 4: Study Time Calculator */}
            <div
              id="tool-study"
              className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
                    <h3 className="text-lg font-bold text-on-surface">Study Time Calculator</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {studyTimeResult.ratioDesc}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Estimate total weekly study hours and daily revision blocks based on standard collegiate credit-to-study ratios.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Credit Hours
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="25"
                      value={enrolledCredits}
                      onChange={e => setEnrolledCredits(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Course Rigor
                    </label>
                    <select
                      className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      value={studyRigor}
                      onChange={e => setStudyRigor(parseFloat(e.target.value))}
                    >
                      <option value={1.5}>Foundational (1.5x)</option>
                      <option value={2.0}>Standard (2.0x)</option>
                      <option value={3.0}>STEM / Intensive (3.0x)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Study Days / Wk
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="7"
                      value={studyDays}
                      onChange={e => setStudyDays(parseInt(e.target.value) || 5)}
                    />
                  </div>
                </div>
              </div>

              {/* Result Container */}
              <div className="mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Recommended Study
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary leading-none mt-1">
                    {studyTimeResult.weeklyHours} hrs/wk
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    ~{studyTimeResult.dailyHours} hours across {studyDays} study days
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-container text-on-surface">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    <span>~{studyTimeResult.pomodoroCount} Pomodoro Blocks/Day</span>
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1">25m study + 5m recovery break</p>
                </div>
              </div>
            </div>

            {/* TOOL 5: Degree / Credit Progress Calculator */}
            <div
              id="tool-degree"
              className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">account_tree</span>
                    <h3 className="text-lg font-bold text-on-surface">Degree &amp; Credit Progress</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {degreeProgressResult.compPct}% Completed
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Track your accumulated credits against total degree requirements to visualize completion pacing.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Degree Total Credits
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="30"
                      max="200"
                      value={totalDegreeCredits}
                      onChange={e => setTotalDegreeCredits(parseInt(e.target.value) || 120)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Completed Credits
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="0"
                      max={totalDegreeCredits}
                      value={completedCredits}
                      onChange={e => setCompletedCredits(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      In-Progress Credits
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="0"
                      max={totalDegreeCredits}
                      value={inProgressCredits}
                      onChange={e => setInProgressCredits(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Result Container */}
              <div className="mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface">
                    {degreeProgressResult.totalEarnedPlusCurrent} of {totalDegreeCredits} credits completed/active
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {degreeProgressResult.remainingCredits} credits remaining
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${degreeProgressResult.compPct}%` }}
                    className="bg-primary h-full transition-all duration-300"
                    title={`Completed: ${degreeProgressResult.compPct}%`}
                  ></div>
                  <div
                    style={{ width: `${degreeProgressResult.inProgPct}%` }}
                    className="bg-secondary h-full transition-all duration-300"
                    title={`In-Progress: ${degreeProgressResult.inProgPct}%`}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    <span>Completed ({degreeProgressResult.compPct}%)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                    <span>In-Progress ({degreeProgressResult.inProgPct}%)</span>
                  </span>
                  <span>Remaining ({degreeProgressResult.remainingCredits} cr.)</span>
                </div>
              </div>
            </div>

            {/* TOOL 6: Graduation Term Estimator */}
            <div
              id="tool-grad"
              className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">workspace_premium</span>
                    <h3 className="text-lg font-bold text-on-surface">Graduation Term Estimator</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    Pacing Model
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Estimate the number of semesters or quarters required to complete your degree based on your anticipated credit load.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Credits Remaining
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="150"
                      value={creditsRemainingGrad}
                      onChange={e => setCreditsRemainingGrad(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Credits / Term
                    </label>
                    <input
                      className="w-full p-2.5 bg-surface-container-low rounded-xl font-mono text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      type="number"
                      min="1"
                      max="24"
                      value={creditsPerTerm}
                      onChange={e => setCreditsPerTerm(parseInt(e.target.value) || 15)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Terms / Year
                    </label>
                    <select
                      className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                      value={termsPerYear}
                      onChange={e => setTermsPerYear(parseInt(e.target.value) || 2)}
                    >
                      <option value={2}>2 Semesters (Fall/Spring)</option>
                      <option value={3}>3 Quarters / Trimesters</option>
                      <option value={4}>4 Terms (Inc. Summer)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Result Container */}
              <div className="mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Graduation Timeline
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary leading-none mt-1">
                    {graduationResult.termsNeeded} Terms
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    Estimated ~{graduationResult.yearsNeeded} academic years at {creditsPerTerm} cr/term
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span>On Pace</span>
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-1">Plan your course registration early</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: GPA & GRADING TRUST EXPLANATION */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Grading Systems &amp; Standards</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">
              Understanding Grading Scales &amp; Calculation Models
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Many institutions use a credit-weighted GPA model, but grading policies, quality point definitions, and honor roll thresholds vary by school, college, university, country, and academic program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-on-surface">4.0 Standard Scale</h3>
                <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-primary font-bold">Unweighted</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Commonly used across U.S. and Canadian undergraduate programs. Grades map directly: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0.
              </p>
              <div className="text-[11px] font-mono bg-surface-container-low p-2 rounded-lg text-on-surface border border-outline-variant/20">
                A: 4.0 | B: 3.0 | C: 2.0 | D: 1.0
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-on-surface">4.33 Scale</h3>
                <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">+/- Modifiers</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Incorporates plus and minus grades: A+ = 4.33, A = 4.0, A- = 3.67, B+ = 3.33, B = 3.0, B- = 2.67, C+ = 2.33.
              </p>
              <div className="text-[11px] font-mono bg-surface-container-low p-2 rounded-lg text-on-surface border border-outline-variant/20">
                A+: 4.33 | A: 4.0 | A-: 3.67 | B+: 3.33
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-on-surface">5.0 Weighted Scale</h3>
                <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-primary font-bold">AP / IB / Honors</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Adds quality point weighting for advanced secondary courses (e.g. AP, IB, or Dual Enrollment: A = 5.0, B = 4.0, C = 3.0).
              </p>
              <div className="text-[11px] font-mono bg-surface-container-low p-2 rounded-lg text-on-surface border border-outline-variant/20">
                AP/IB A: 5.0 | Honors A: 4.5
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-on-surface">10.0 CGPA Scale</h3>
                <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">India &amp; Global</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Standard 10-point semester grade point average (SGPA/CGPA). Often converted to percentage using board multipliers (e.g., 9.5).
              </p>
              <div className="text-[11px] font-mono bg-surface-container-low p-2 rounded-lg text-on-surface border border-outline-variant/20">
                % = CGPA × 9.5 (or University Formula)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CATEGORY STRUCTURE (SEO-FRIENDLY DIRECTORY) */}
      <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface" id="directory">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">All Academic Categories</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Explore Education Calculators by Topic</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md">
              Comprehensive calculators and estimators organized into clear academic disciplines with clean direct links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{cat.title}</h3>
                      <span className="text-[11px] text-on-surface-variant">{cat.tools.length} Tools Available</span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{cat.desc}</p>

                  <div className="space-y-1.5 text-xs">
                    {cat.tools.map((tool, idx) => (
                      <a
                        key={idx}
                        href={tool.link}
                        title={tool.desc}
                        className="group/tool px-3 py-2 rounded-xl bg-surface-container-low/60 hover:bg-primary/10 hover:border-primary/40 border border-outline-variant/20 text-xs text-on-surface transition-all flex items-center justify-between gap-2 cursor-pointer shadow-2xs hover:shadow-xs hover:translate-x-0.5"
                      >
                        <span className="font-semibold text-xs text-on-surface group-hover/tool:text-primary transition-colors flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/tool:bg-primary shrink-0 transition-colors" />
                          <span className="truncate">{tool.name}</span>
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-outline-variant group-hover/tool:text-primary group-hover/tool:translate-x-0.5 transition-transform shrink-0">
                          chevron_right
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: GLOBAL EDUCATION STRUCTURE (BY REGION) */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">International Frameworks</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Education Calculators by Region</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Academic metrics tailored to regional evaluation frameworks, university grading scales, and credit standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">public</span>
                  <h3 className="text-base font-bold text-on-surface">Global / General</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Universal grading tools including standard 4.0 GPA, percentage grading, study hour allocation, and attendance tracking.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-outline-variant/15 text-[11px] text-primary font-semibold">
                • 4.0 Scale &bull; Percentage Models
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">flag</span>
                  <h3 className="text-base font-bold text-on-surface">United States</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Weighted 5.0 AP/IB scale, College Board &amp; ACT score concordance, credit hour workloads, and college net price estimates.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-outline-variant/15 text-[11px] text-primary font-semibold">
                • AP/IB 5.0 &bull; SAT/ACT Concordance
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_city</span>
                  <h3 className="text-base font-bold text-on-surface">India</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  10.0 CGPA to percentage conversion (CBSE 9.5 standard and university formulas), SGPA transitions, and 75% attendance rules.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-outline-variant/15 text-[11px] text-primary font-semibold">
                • 10.0 CGPA &bull; 75% Attendance
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
                  <h3 className="text-base font-bold text-on-surface">United Kingdom</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  UK undergraduate honours classifications (First 70%+, 2:1 60-69%, 2:2 50-59%, Third 40-49%) and UCAS Tariff point estimates.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-outline-variant/15 text-[11px] text-primary font-semibold">
                • UK Honours &bull; UCAS Tariff
              </div>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">map</span>
                  <h3 className="text-base font-bold text-on-surface">Canada</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Provincial 4.0, 4.33, and 9.0 Canadian GPA scales, percentage conversions (OUAC/Alberta/BC), and credit hour equivalents.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-outline-variant/15 text-[11px] text-primary font-semibold">
                • 4.33 &amp; 9.0 Scales &bull; OUAC
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CITATION & WRITING FORMATTER */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface" id="tool-citation">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Style &amp; Version Guidelines</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/20">
                  Reviewed according to standard publication manuals
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Citation Quick-Formatter</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-md">
              Generate formatted reference list entries in APA 7th Edition, MLA 9th Edition, or Chicago 17th Edition Notes &amp; Bibliography format.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formatter Input Card */}
            <div className="lg:col-span-2 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Select Style Guide</span>
                <div className="flex gap-1">
                  {(['APA7', 'MLA9', 'CHI17'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setCiteFormat(fmt)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        citeFormat === fmt
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {fmt === 'APA7' ? 'APA 7th' : fmt === 'MLA9' ? 'MLA 9th' : 'Chicago 17th'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Author(s)</label>
                  <input
                    className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                    value={citeAuthor}
                    onChange={e => setCiteAuthor(e.target.value)}
                    placeholder="e.g. Kahneman, Daniel"
                    type="text"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Publication Year</label>
                  <input
                    className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                    value={citeYear}
                    onChange={e => setCiteYear(e.target.value)}
                    placeholder="e.g. 2011"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Title of Work</label>
                <input
                  className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                  value={citeTitle}
                  onChange={e => setCiteTitle(e.target.value)}
                  placeholder="e.g. Thinking, Fast and Slow"
                  type="text"
                />
              </div>

              <div className="space-y-1 mb-4">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Publisher / Journal Source</label>
                <input
                  className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:border-primary"
                  value={citeSource}
                  onChange={e => setCiteSource(e.target.value)}
                  placeholder="e.g. Farrar, Straus and Giroux"
                  type="text"
                />
              </div>

              {/* Formatted Output Box */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Formatted Reference ({citeFormat === 'APA7' ? 'APA 7th' : citeFormat === 'MLA9' ? 'MLA 9th' : 'Chicago 17th'})
                  </span>
                  <button
                    onClick={handleCopyCitation}
                    className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
                    <span>{copied ? 'Copied!' : 'Copy Reference'}</span>
                  </button>
                </div>
                <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/15 text-xs text-on-surface font-serif leading-relaxed select-all">
                  {citeFormat === 'APA7' && (
                    <span>
                      {citeAuthor || 'Author'} ({citeYear || 'Year'}). <em>{citeTitle || 'Title of work'}</em>. {citeSource || 'Publisher'}.
                    </span>
                  )}
                  {citeFormat === 'MLA9' && (
                    <span>
                      {citeAuthor || 'Author'}. <em>{citeTitle || 'Title of work'}</em>. {citeSource || 'Publisher'}, {citeYear || 'Year'}.
                    </span>
                  )}
                  {citeFormat === 'CHI17' && (
                    <span>
                      {citeAuthor || 'Author'}. {citeYear || 'Year'}. <em>{citeTitle || 'Title of work'}</em>. {citeSource || 'Publisher'}.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Style Reference Overview */}
            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface mb-3">Style Guide Reference</h3>
                <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <strong className="text-on-surface block font-semibold mb-1">APA 7th Edition (2020)</strong>
                    <span>Author-Date system used across social sciences, education, and psychology. Sentence case for titles.</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <strong className="text-on-surface block font-semibold mb-1">MLA 9th Edition (2021)</strong>
                    <span>Author-Page system used in humanities and literature. Container principle for sources.</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <strong className="text-on-surface block font-semibold mb-1">Chicago 17th Edition</strong>
                    <span>Notes and bibliography format used in history, arts, and humanities scholarship.</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
                Verify specific departmental requirements with your course syllabus or instructor.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: LEARNING GUIDES & METHODOLOGY */}
      <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface" id="guides">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Educational Knowledge Base</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Academic Calculation Guides</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Understand the mathematical formulas, weighting rules, and institutional methodologies behind academic metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guide 1: How to Calculate GPA */}
            <div id="guide-gpa-calc" className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[22px]">school</span>
                <h3 className="text-lg font-bold text-on-surface">How to Calculate GPA</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Grade Point Average (GPA) is the standard measurement of academic achievement. It weights each course&apos;s earned quality points by its credit hours:
              </p>
              <div className="p-3 bg-surface-container-low rounded-xl font-mono text-xs text-primary mb-3 border border-outline-variant/20">
                GPA = &Sigma;(Course Credits &times; Quality Points) / Total Attempted Credits
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                For example, a 4-credit course with an A (4.0) yields 16 quality points, while a 3-credit course with a B (3.0) yields 9 points. Total GPA = (16 + 9) / 7 = 3.57.
              </p>
              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                <a href="#tool-gpa" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Open Target GPA Calculator</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Guide 2: Weighted vs Unweighted GPA */}
            <div id="guide-weighted-gpa" className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">balance</span>
                <h3 className="text-lg font-bold text-on-surface">Weighted vs. Unweighted GPA</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Unweighted GPAs evaluate all courses on a standard 4.0 ceiling regardless of difficulty. Weighted GPAs add quality points for advanced rigor:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <strong className="block text-on-surface text-[11px]">Unweighted 4.0</strong>
                  <span className="text-on-surface-variant text-[11px]">A = 4.0 | B = 3.0</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <strong className="block text-primary text-[11px]">AP / IB Weighted 5.0</strong>
                  <span className="text-on-surface-variant text-[11px]">A = 5.0 (+1.0 point)</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Colleges frequently recalculate high school GPAs using their own institutional weighting formulas to ensure standard comparisons.
              </p>
              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                <a href="#tool-gpa" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Compare GPA Scales</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Guide 3: How to Calculate Your Final Grade */}
            <div id="guide-final-grade" className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[22px]">calculate</span>
                <h3 className="text-lg font-bold text-on-surface">How to Calculate the Grade Needed on a Final</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                To isolate the exam score required to achieve a desired overall course grade percentage:
              </p>
              <div className="p-3 bg-surface-container-low rounded-xl font-mono text-xs text-primary mb-3 border border-outline-variant/20">
                Required Score = [Target % - (Current % &times; (1 - Weight))] / Weight
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Example: With an 85% current grade and a final exam worth 25%, to achieve a 90% overall: [90 - (85 &times; 0.75)] / 0.25 = 105.0% (requiring extra credit).
              </p>
              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                <a href="#tool-final" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Calculate Final Exam Grade</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Guide 4: How Attendance Percentage Is Calculated */}
            <div id="guide-attendance-calc" className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">event_available</span>
                <h3 className="text-lg font-bold text-on-surface">How Attendance Percentage Is Calculated</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Attendance percentage evaluates verified present sessions against total held lectures:
              </p>
              <div className="p-3 bg-surface-container-low rounded-xl font-mono text-xs text-primary mb-3 border border-outline-variant/20">
                Attendance % = (Classes Attended / Total Classes Held) &times; 100
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                If your university requires 75% attendance across 40 lectures (30 classes attended), you are at 75.0%. Missing one more session drops attendance to 70.7% (29/41).
              </p>
              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                <a href="#tool-attendance" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Check Attendance Buffer</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Guide 5: CGPA to Percentage Conversion */}
            <div id="guide-cgpa-percentage" className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-[22px]">grade</span>
                <h3 className="text-lg font-bold text-on-surface">How to Convert CGPA to Percentage</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                On the standard 10.0 scale (prominent across CBSE, AICTE, and Indian universities), percentage is commonly estimated as:
              </p>
              <div className="p-3 bg-surface-container-low rounded-xl font-mono text-xs text-primary mb-3 border border-outline-variant/20">
                Percentage (%) = CGPA &times; 9.5
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                For example, an 8.4 CGPA converts to 8.4 &times; 9.5 = 79.8%. Note that specific engineering and autonomous universities may utilize custom formulas (e.g. (CGPA - 0.75) &times; 10).
              </p>
              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                <a href="#tool-gpa" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Use 10.0 Scale Tool</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>

            {/* Guide 6: SAT & ACT Concordance */}
            <div id="guide-sat-act" className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">compare_arrows</span>
                <h3 className="text-lg font-bold text-on-surface">How SAT and ACT Concordance Works</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                Based on official concordance research conducted jointly by the College Board and ACT, test metrics map across different scales:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <strong className="block text-on-surface text-[11px]">SAT (400–1600)</strong>
                  <span className="text-on-surface-variant text-[11px]">1540–1600 &bull; 1400–1430</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <strong className="block text-secondary text-[11px]">ACT Composite (1–36)</strong>
                  <span className="text-on-surface-variant text-[11px]">36 &bull; 31</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Concordance tables represent statistically comparable performance, not exact mathematical identity. Institutions review scores according to individual admissions guidelines.
              </p>
              <div className="mt-4 pt-3 border-t border-outline-variant/15">
                <a href="#tool-final" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Explore Test Score Tools</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: TRUST & METHODOLOGY */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Methodology &amp; Verification</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">How Our Education Calculators Work</h2>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              We design all tools with transparent mathematical formulas and clear, user-defined inputs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px]">input</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1">User-Provided Inputs</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All computations are performed directly on the numbers and weights you enter on your device.
              </p>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px]">policy</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1">Policy Variations</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Grading systems, repeat policies, and honors weights vary by school district, university, and country.
              </p>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px]">query_stats</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1">Estimates &amp; Planning</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Results serve as planning estimates to help you understand thresholds and organize your study schedule.
              </p>
            </div>

            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface mb-1">Institutional Verification</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Always confirm your official graduation requirements and academic policies with your registrar or advisor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FAQ SECTION */}
      <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Frequently Asked Academic Questions</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Clear answers to common questions about calculating GPA, final exam requirements, and attendance thresholds.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How is GPA calculated?',
                a: 'GPA (Grade Point Average) is calculated by multiplying each course\'s credit hours by the numeric quality points earned, summing those points across all courses, and dividing by the total attempted credit hours: GPA = Total Quality Points / Total Attempted Credits. Many institutions use this model, but specific point mappings and grading scales vary by school.'
              },
              {
                q: 'What is the difference between GPA and CGPA?',
                a: 'GPA typically represents your academic performance in a single term, trimester, or semester (often called SGPA or Semester Grade Point Average). CGPA (Cumulative Grade Point Average) is the overall weighted average across all completed semesters throughout your entire degree program.'
              },
              {
                q: 'How do I calculate my final grade?',
                a: 'To find the exam score required to achieve a target course grade: Required Score = [Target Grade % - (Current Grade % × (1 - Final Exam Weight %))] / Final Exam Weight %. For example, if you have an 85% and the final is worth 20% to reach a 90% overall, you need: [90 - (85 × 0.80)] / 0.20 = 110% (which would require extra credit).'
              },
              {
                q: 'How is attendance percentage calculated?',
                a: 'Attendance percentage is calculated as: (Classes Attended / Total Classes Held) × 100. To find how many classes you can miss while remaining above a required institutional threshold (such as 75%), evaluate how many absences still leave your attendance count at or above 75% of the total session count.'
              },
              {
                q: 'Can I customize my grading scale?',
                a: 'Yes. SolveItCalculator tools support multiple standard grading frameworks—including 4.0 standard scales, 4.33 scales with plus/minus modifiers, 5.0 AP/IB weighted scales, and 10.0 CGPA scales—so you can adjust calculations to match your specific school, college, or university rubric.'
              },
              {
                q: 'Are GPA calculations the same at every university?',
                a: 'No. While credit-weighted arithmetic is standard, grading policies, letter-to-point mappings (e.g. whether A+ is 4.0 or 4.33), plus/minus modifiers, course retake rules, and honors weightings vary across schools, districts, and international universities. Always check your official student handbook or registrar policies.'
              },
              {
                q: 'Can I use these calculators for different countries?',
                a: 'Yes. SolveItCalculator includes methodologies supporting education systems from the United States (4.0/5.0 GPA), India (10.0 CGPA & percentage conversions), the United Kingdom (UK Honours classifications and UCAS points), Canada (4.0/4.33/9.0 scales), and global percentage-based grading.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs"
              >
                <h3 className="text-base font-bold text-on-surface flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">help</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2.5 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: EXPLORE RELATED SISTER HUBS */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">SolveItCalculator Ecosystem</span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">Explore Related Calculation Hubs</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Percentage Calculator', icon: 'percent', link: '/percentage-calculator' },
              { name: 'Standard Deviation', icon: 'query_stats', link: '/math/standard-deviation-calculator' },
              { name: 'Time & Date Tools', icon: 'schedule', link: '/time-date/date-difference-calculator' },
              { name: 'Financial Planning', icon: 'account_balance', link: '/finance/compound-interest-calculator' },
              { name: 'Unit Conversions', icon: 'swap_horiz', link: '/conversion-center' },
              { name: 'Health & Fitness', icon: 'fitness_center', link: '/health-fitness-calculators' }
            ].map(item => (
              <Link
                key={item.name}
                href={item.link}
                className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/50 text-center flex flex-col items-center justify-center group transition-all"
              >
                <span className="material-symbols-outlined text-primary text-[22px] mb-1.5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-primary/10 via-surface-container-low to-secondary/10 p-8 sm:p-10 rounded-3xl border border-outline-variant/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Plan Your Academic Success with Confidence</h2>
          <p className="text-sm text-on-surface-variant max-w-xl mx-auto mt-2 leading-relaxed">
            Free, privacy-friendly calculators for grades, exams, study schedules, and academic milestones.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#tool-gpa"
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container shadow-xs transition-colors"
            >
              Calculate Target GPA
            </a>
            <a
              href="#directory"
              className="px-6 py-3 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
            >
              Browse All Calculators
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
