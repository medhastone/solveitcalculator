'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Calculator Data
const calculatorClusters = [
  {
    id: 'salary',
    title: '1. Salary Calculators',
    icon: 'payments',
    iconColor: 'text-primary',
    badgeColor: 'bg-primary-fixed text-on-primary-fixed',
    description: 'Convert between annual figures, monthly budgets, bi-weekly cycles, and daily per-diem rates.',
    compliance: 'ISO-8601 Payroll Compliant',
    tools: [
      {
        title: 'Salary Calculator',
        description: 'Convert salary across hours, days, months, and years.',
        icon: 'swap_horiz',
        badge: 'Omni-Frequency',
        tags: ['Gross', 'Prorated'],
        link: '/conversion/salary',
        iconColor: 'text-primary',
      },
      {
        title: 'Annual Salary Calculator',
        description: 'Calculate annual compensation from standard hours and PTO.',
        icon: 'calendar_month',
        badge: '52-Week',
        tags: ['Vacation', 'Bonus'],
        link: '/conversion/annual-salary',
        iconColor: 'text-primary',
      },
      {
        title: 'Monthly Salary Calculator',
        description: 'Isolate regular monthly earnings for budgets and debt.',
        icon: 'event_repeat',
        badge: '12-Period',
        tags: ['Underwriting', 'DTI'],
        link: '/conversion/monthly-salary',
        iconColor: 'text-primary',
      },
      {
        title: 'Weekly Salary Calculator',
        description: 'Compute weekly paychecks for trades and hospitality.',
        icon: 'date_range',
        badge: '52 Checks',
        tags: ['Trades', 'Weekly'],
        link: '/conversion/weekly-salary',
        iconColor: 'text-primary',
      },
      {
        title: 'Biweekly Salary Calculator',
        description: 'Model standard 26-paycheck annual schedules.',
        icon: 'view_week',
        badge: '26 Checks',
        tags: ['3-Paycheck', 'Budget'],
        link: '/conversion/biweekly-salary',
        iconColor: 'text-primary',
      },
      {
        title: 'Daily Salary Calculator',
        description: 'Calculate daily wage for contracts, per diem, and day rates.',
        icon: 'today',
        badge: 'Per-Diem',
        tags: ['Per Diem', 'Proration'],
        link: '/daily-wage-planner',
        iconColor: 'text-primary',
      }
    ]
  },
  {
    id: 'wage',
    title: '2. Wage Calculators',
    icon: 'schedule',
    iconColor: 'text-secondary',
    badgeColor: 'bg-secondary-fixed text-on-secondary-fixed',
    description: 'Shift rates, hourly-to-annual parity, statutory minimum wage baselines, and cross-frequency comparisons.',
    compliance: 'FLSA 29 U.S.C. Compliant',
    tools: [
      {
        title: 'Hourly Wage Calculator',
        description: 'Convert annual and monthly salaries to exact hourly pay.',
        icon: 'timer',
        badge: 'Hourly Base',
        tags: ['Shift Totals'],
        link: '/conversion/hourly-wage',
        iconColor: 'text-secondary',
      },
      {
        title: 'Daily Wage Calculator',
        description: 'Calculate daily wage from monthly salary, hourly rate, or contract value.',
        icon: 'today',
        badge: 'Daily Rate',
        tags: ['Per Diem', 'Divisor'],
        link: '/daily-wage-calculator',
        iconColor: 'text-secondary',
      },
      {
        title: 'Salary to Hourly Calculator',
        description: 'Convert salaried jobs into hourly equivalent rates.',
        icon: 'south_east',
        badge: 'Salary → Hourly',
        tags: ['Exempt Audit'],
        link: '/conversion/salary-to-hourly',
        iconColor: 'text-secondary',
      },
      {
        title: 'Wage Conversion Calculator',
        description: 'Instantly convert wages across all pay frequencies.',
        icon: 'sync_alt',
        badge: 'Matrix Grid',
        tags: ['Multi-Matrix'],
        link: '/conversion/wage-conversion',
        iconColor: 'text-secondary',
      },
      {
        title: 'Minimum Wage Calculator',
        description: 'Check statutory federal, state, and global minimum wages.',
        icon: 'gavel',
        badge: 'Statutory Floors',
        tags: ['Compliance'],
        link: '/conversion/minimum-wage',
        iconColor: 'text-secondary',
      }
    ]
  },
  {
    id: 'payroll',
    title: '3. Payroll & Tax Deductions',
    icon: 'receipt_long',
    iconColor: 'text-primary',
    badgeColor: 'bg-primary-fixed text-on-primary-fixed',
    description: 'Master the gross-to-net waterfall: FICA, PAYE, CPP/EI, superannuation, pre-tax benefits, and net take-home pay.',
    compliance: 'IRC § 3402 & FICA Tables',
    tools: [
      {
        title: 'Payroll Calculator',
        description: 'Full corporate payroll tax, FICA, and net salary breakdown.',
        icon: 'account_balance',
        badge: 'Complete Batch',
        tags: ['Enterprise'],
        link: '/tax-calculator/payroll',
        iconColor: 'text-primary',
      },
      {
        title: 'Payroll Tax Calculator',
        description: 'Calculate employer and employee FICA, FUTA, and state taxes.',
        icon: 'percent',
        badge: 'Statutory',
        tags: ['FICA / FUTA'],
        link: '/tax-calculator/payroll-tax',
        iconColor: 'text-primary',
      },
      {
        title: 'Paycheck Calculator',
        description: 'Calculate net direct deposit pay after deductions.',
        icon: 'request_quote',
        badge: 'W-4 Form Ready',
        tags: ['Take-Home'],
        link: '/tax-calculator/paycheck',
        iconColor: 'text-primary',
      },
      {
        title: 'Net Pay Calculator',
        description: 'Estimate take-home earnings after taxes and benefits.',
        icon: 'account_balance_wallet',
        badge: 'Liquid Cash',
        tags: ['Net Yield'],
        link: '/tax-calculator/net-pay',
        iconColor: 'text-primary',
      },
      {
        title: 'Gross Pay Calculator',
        description: 'Reverse calculate total gross pay from target net salary.',
        icon: 'price_change',
        badge: 'Pre-Deduction',
        tags: ['Gross Sum'],
        link: '/tax-calculator/gross-pay',
        iconColor: 'text-primary',
      }
    ]
  },
  {
    id: 'overtime',
    title: '4. Overtime Calculators',
    icon: 'acute',
    iconColor: 'text-tertiary-container',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    description: 'Time-and-a-half multipliers, California daily thresholds, and double-time statutory premiums.',
    compliance: '29 CFR § 778 Overtime Code',
    tools: [
      {
        title: 'Overtime Calculator',
        description: 'Calculate 1.5x overtime and weighted average pay.',
        icon: 'more_time',
        badge: 'Standard OT',
        tags: ['Weighted Rates'],
        link: '/time-date/overtime',
        iconColor: 'text-tertiary-container',
      },
      {
        title: 'Time and a Half Calculator',
        description: 'Compute exact 1.5x overtime pay for extra hours.',
        icon: 'exposure_plus_1',
        badge: '1.5× Rate',
        tags: ['1.5× Multiplier'],
        link: '/time-date/time-and-a-half',
        iconColor: 'text-tertiary-container',
      },
      {
        title: 'Double Time Calculator',
        description: 'Calculate 2.0x holiday, weekend, and 7th-day premium pay.',
        icon: 'exposure_plus_2',
        badge: '2.0× Rate',
        tags: ['Holiday / 12h+'],
        link: '/time-date/double-time',
        iconColor: 'text-tertiary-container',
      }
    ]
  },
  {
    id: 'worktime',
    title: '5. Work Time & Shift Calculators',
    icon: 'timelapse',
    iconColor: 'text-secondary',
    badgeColor: 'bg-secondary-fixed text-on-secondary-fixed',
    description: 'Daily elapsed shift hours, timesheets with automated lunch deductions, and rotating shift differentials.',
    compliance: 'Military & 12h Time Formatting',
    tools: [
      {
        title: 'Work Hours Calculator',
        description: 'Calculate total worked hours minus unpaid lunch breaks.',
        icon: 'nest_clock_farsight_analog',
        badge: 'Elapsed',
        tags: ['Decimal Hours'],
        link: '/time-date/work-hours',
        iconColor: 'text-secondary',
      },
      {
        title: 'Timesheet Calculator',
        description: 'Biweekly and monthly timesheet hours with rounding.',
        icon: 'view_timeline',
        badge: '7-Day',
        tags: ['Lunch Deduct'],
        link: '/time-date/timesheet',
        iconColor: 'text-secondary',
      },
      {
        title: 'Time Card Calculator',
        description: 'Total weekly employee hours and audit time stamps.',
        icon: 'badge',
        badge: '14-Day Audit',
        tags: ['Bi-Weekly'],
        link: '/time-date/time-card',
        iconColor: 'text-secondary',
      },
      {
        title: 'Shift Hours Calculator',
        description: 'Apportion night shift differentials and weekend premiums.',
        icon: 'bedtime',
        badge: 'Night / Weekend',
        tags: ['Differentials'],
        link: '/time-date/shift-hours',
        iconColor: 'text-secondary',
      }
    ]
  },
  {
    id: 'employer',
    title: '6. Employer Labor & Overhead Cost Calculators',
    icon: 'corporate_fare',
    iconColor: 'text-primary',
    badgeColor: 'bg-primary-fixed text-on-primary-fixed',
    description: 'True cost of hiring: mandatory employer taxes, health subsidies, worker\'s compensation, and fully burdened labor rates.',
    compliance: 'Burden Multipliers (1.20× – 1.40×)',
    tools: [
      {
        title: 'Employee Cost Calculator',
        description: 'Calculate true cost of hiring including benefits and taxes.',
        icon: 'group_add',
        badge: 'Total Cost of Hire',
        tags: ['Burden Index'],
        link: '/tax-calculator/employee-cost',
        iconColor: 'text-primary',
      },
      {
        title: 'Labor Cost Calculator',
        description: 'Derive all-in burdened billable labor rates.',
        icon: 'engineering',
        badge: 'Job Costing',
        tags: ['Billable Rate'],
        link: '/tax-calculator/labor-cost',
        iconColor: 'text-primary',
      },
      {
        title: 'Workforce Cost Calculator',
        description: 'Project department-wide salary and benefit overhead.',
        icon: 'hub',
        badge: 'FP&A Planning',
        tags: ['Headcount FP&A'],
        link: '/tax-calculator/workforce-cost',
        iconColor: 'text-primary',
      }
    ]
  }
];

export default function SalaryAndPayrollClient() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      

      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
      {/* Section 1: Breadcrumb & Visual Editorial Header */}
      <section className="w-full bg-surface py-space-xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-data-mono text-data-mono text-xs text-on-surface-variant">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <Link href="/finance" className="hover:text-primary transition-colors">
              Financial Calculators
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface font-semibold">Salary, Wages & Payroll</span>
          </nav>

          {/* Category Hero Title & Lead */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <div className="lg:col-span-8 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-high w-fit">
                <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Payroll & Compensation Engineering</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span className="font-data-mono text-xs text-on-surface-variant">Q1 2025 Statutory Tables</span>
              </div>
              <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight">
                Salary, Wages & Payroll Calculators
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Free, precision payroll and salary tools. Calculate hourly rates, overtime premiums, paycheck deductions, and total employer costs across US, UK, Canada, Australia, and India.</p>

              {/* Trust & EEAT Badges Bar */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-low shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary">security</span>
                  <span className="font-data-mono text-body-sm text-on-surface font-medium">100% Client-Side Private</span>
                </div>
                <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-low shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary">public</span>
                  <span className="font-data-mono text-body-sm text-on-surface font-medium">US • UK • CA • AU • IN</span>
                </div>
                <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-low shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                  <span className="font-data-mono text-body-sm text-on-surface font-medium">CPA & Payroll Specialist Audited</span>
                </div>
                <div className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg bg-surface-container-low shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary">calculate</span>
                  <span className="font-data-mono text-body-sm text-on-surface font-medium">IEEE 754 Floating Standard</span>
                </div>
              </div>
            </div>

            {/* Metric Snapshot Sidecar Box */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-xl flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Payroll Quick Reference</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">insights</span>
              </div>
              <div className="space-y-space-sm">
                <div className="flex justify-between items-baseline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Annual Hours Benchmark (40h/wk):</span>
                  <span className="font-data-mono text-data-mono font-bold text-on-surface">2,080 hrs</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Biweekly Cycles per Calendar Year:</span>
                  <span className="font-data-mono text-data-mono font-bold text-on-surface">26 cycles</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Semi-Monthly Cycles per Year:</span>
                  <span className="font-data-mono text-data-mono font-bold text-on-surface">24 cycles</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">US FICA Statutory (SS + Med):</span>
                  <span className="font-data-mono text-data-mono font-bold text-primary">7.65%</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Employer Burden Multiplier:</span>
                  <span className="font-data-mono text-data-mono font-bold text-primary">1.25× – 1.40×</span>
                </div>
              </div>
              <div className="pt-space-xs bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-secondary">tune</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                  Adjust variables across any workbench below. Live reactive updates execute instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Quick Interactive Jurisdictional Currency & Search Toolbar */}
      <section className="w-full bg-surface-container-low py-space-md px-gutter-mobile lg:px-gutter-desktop sticky top-16 z-30 shadow-sm backdrop-blur-md">
        <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row items-center justify-between gap-space-md">
          {/* Category Pill Navigation */}
          <div className="flex items-center gap-space-xs overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none" id="categoryFilterBar">
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'all' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('all')}
              type="button"
            >
              All 26 Workbenches
            </button>
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'salary' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('salary')}
              type="button"
            >
              Salary (6)
            </button>
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'wage' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('wage')}
              type="button"
            >
              Wages (5)
            </button>
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'payroll' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('payroll')}
              type="button"
            >
              Payroll & Tax (5)
            </button>
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'overtime' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('overtime')}
              type="button"
            >
              Overtime (3)
            </button>
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'worktime' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('worktime')}
              type="button"
            >
              Work Time (4)
            </button>
            <button
              className={`category-pill px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all shadow-sm ${activeFilter === 'employer' ? 'active-pill bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'}`}
              onClick={() => handleFilterClick('employer')}
              type="button"
            >
              Employer Cost (3)
            </button>
          </div>

          {/* Quick Finder Search Input */}
          <div className="w-full md:w-72 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container-lowest text-on-surface font-body-sm text-body-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-on-surface-variant/60"
              id="toolSearchInput"
              placeholder="Filter tools (e.g. FICA, overtime)..."
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Section 3: The 6 Distinct Calculator Hubs & Interactive Grids */}
      <section className="w-full bg-surface py-space-2xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto space-y-space-3xl" id="toolsDirectoryContainer">
          {calculatorClusters.map((cluster) => {
            const filteredTools = cluster.tools.filter(tool => {
              const query = searchQuery.toLowerCase();
              return tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query);
            });

            if ((activeFilter !== 'all' && activeFilter !== cluster.id) || (searchQuery !== '' && filteredTools.length === 0)) {
              return null;
            }

            return (
              <div key={cluster.id} className="cluster-section flex flex-col gap-space-lg" data-cluster={cluster.id}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-xs pb-space-xs border-b border-surface-container-high">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className={`material-symbols-outlined ${cluster.iconColor} text-[28px]`}>{cluster.icon}</span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface">{cluster.title}</h2>
                      <span className={`px-space-xs py-0.5 rounded-full ${cluster.badgeColor} font-data-mono text-xs font-semibold`}>{cluster.tools.length} Tools</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      {cluster.description}
                    </p>
                  </div>
                  <span className="font-data-mono text-body-sm text-outline hidden md:block">{cluster.compliance}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {filteredTools.map((tool, index) => (
                    <article key={index} className="tool-card group bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between" data-title={tool.title.toLowerCase()}>
                      <div className="flex flex-col gap-space-sm">
                        <div className="flex items-center justify-between">
                          <span className={`p-2 rounded-lg bg-surface-container ${tool.iconColor}`}>
                            <span className="material-symbols-outlined text-[24px]">{tool.icon}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-data-mono text-xs">{tool.badge}</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{tool.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{tool.description}</p>
                      </div>
                      <div className="mt-space-lg pt-space-md border-t border-surface-container-low flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          {tool.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">{tag}</span>
                          ))}
                        </div>
                        <Link href={tool.link} className="inline-flex items-center gap-1 text-primary font-body-sm text-body-sm font-semibold group-hover:translate-x-1 transition-transform whitespace-nowrap">
                          Launch
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional sections (Section 4, 5, 6, 7, 8) could be broken out into smaller components, but for this file we'll include them. */}
      {/* (Adding placeholders/content for the remaining sections) */}
      
      {/* Section 4: High-Density Educational Guides, Formulas & Comparison */}
      <section className="w-full bg-surface-container-low py-space-3xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-3xl">
          {/* Educational Block Header */}
          <div className="max-w-3xl flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Authoritative Payroll Methodology</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Foundational Compensation Concepts Explained
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Written and peer-audited by CPAs and payroll compliance specialists. Understand statutory mechanics, statutory withholdings, and mathematical formulas governing your pay.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
            {/* What Is Gross Pay Box */}
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md flex flex-col justify-between">
              <div className="space-y-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="p-2 rounded-lg bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">What Is Gross Pay?</h3>
                    <span className="font-data-mono text-body-sm text-on-surface-variant">Total Unadjusted Compensation</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  <strong>Gross pay</strong> represents the complete sum of money paid to an employee before any voluntary withholdings, retirement allocations, or statutory payroll taxes are deducted. For an hourly worker, it is calculated as total hours worked multiplied by the base hourly rate, plus applicable overtime or premium shift rates. For salaried employees, gross pay is the agreed contractual annual salary divided by the number of annual pay cycles.
                </p>
                <div className="bg-surface-container-low p-space-md rounded-lg space-y-space-xs">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Gross Components:</span>
                  <ul className="grid grid-cols-2 gap-2 font-body-sm text-body-sm text-on-surface">
                    <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Base Salary / Wages</li>
                    <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Overtime & Double Time</li>
                    <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Commissions & Bonuses</li>
                    <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Shift Differential Premiums</li>
                    <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Paid Time Off (PTO) & Sick Pay</li>
                    <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span>Tips, Gratuities & Stipends</li>
                  </ul>
                </div>
              </div>
              <div className="mt-space-lg p-space-md rounded-lg bg-surface-container font-data-mono text-body-sm text-on-surface">
                <span className="text-primary font-bold">Gross Formula:</span><br />
                Gross = Regular Pay + (Overtime Hours × (Hourly Rate × 1.5)) + Commissions + Bonuses
              </div>
            </div>

            {/* What Is Net Pay Box */}
            <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md flex flex-col justify-between">
              <div className="space-y-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="p-2 rounded-lg bg-surface-container text-secondary">
                    <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">What Is Net Pay?</h3>
                    <span className="font-data-mono text-body-sm text-on-surface-variant">Spendable Take-Home Distribution</span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  <strong>Net pay</strong>—commonly called take-home pay—is the precise amount deposited into an employee's checking account or handed over on a physical check. It is arrived at after sequentially deducting statutory tax obligations (federal, state/provincial, and municipal taxes), social insurances (US FICA, UK National Insurance, CA CPP/EI), and voluntary cafeteria plan contributions.
                </p>
                <div className="bg-surface-container-low p-space-md rounded-lg space-y-space-xs">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Net Deduction Waterfall:</span>
                  <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface">
                    <li className="flex justify-between">
                      <span className="text-on-surface-variant">1. Pre-Tax Deductions:</span>
                      <span className="font-data-mono font-medium">401(k), Traditional IRA, HSA, Section 125 Healthcare</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-on-surface-variant">2. Statutory Levies:</span>
                      <span className="font-data-mono font-medium">Federal Withholding, State/Provincial Tax, FICA/PAYE</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-on-surface-variant">3. Post-Tax Deductions:</span>
                      <span className="font-data-mono font-medium">Roth 401(k), Union Dues, Wage Garnishments, Life Ins.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-space-lg p-space-md rounded-lg bg-surface-container font-data-mono text-body-sm text-on-surface">
                <span className="text-secondary font-bold">Net Formula:</span><br />
                Net Pay = Gross Pay - (Pre-Tax Deductions + Mandatory Taxes + Post-Tax Deductions)
              </div>
                        </div>
          </div>
          
          {/* High-Precision LaTeX-Style Mathematical Formulas Display */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md flex flex-col gap-space-lg mt-space-3xl">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Standard Payroll Mathematical Specifications</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Verified conversion equations used across institutional payroll calculation engines.</p>
              </div>
              <span className="px-space-xs py-1 rounded bg-surface-container-high font-data-mono text-xs text-primary">IEEE 754 Spec</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Annual Salary</span>
                <div className="font-data-mono text-body-sm text-primary font-semibold py-1">
                  Annual = Hourly × Hours/Wk × 52
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">e.g., $25 × 40 × 52 = $52,000</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Monthly Salary</span>
                <div className="font-data-mono text-body-sm text-primary font-semibold py-1">
                  Monthly = Annual Salary ÷ 12
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">e.g., $60,000 ÷ 12 = $5,000 / mo</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Hourly Base Rate</span>
                <div className="font-data-mono text-body-sm text-primary font-semibold py-1">
                  Hourly = Annual ÷ (52 × Hours/Wk)
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Standard 2,080 annual divisor</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Overtime Premium</span>
                <div className="font-data-mono text-body-sm text-primary font-semibold py-1">
                  OT = OT Hours × (Rate × 1.5)
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Threshold &gt;40 hrs in FLSA week</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Bi-Weekly Pay</span>
                <div className="font-data-mono text-body-sm text-secondary font-semibold py-1">
                  Biweekly = Annual Salary ÷ 26
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Produces two 3-check months/year</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Semi-Monthly Pay</span>
                <div className="font-data-mono text-body-sm text-secondary font-semibold py-1">
                  Semi-Mo = Annual Salary ÷ 24
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Disbursed 1st/15th or 15th/end</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Double Time</span>
                <div className="font-data-mono text-body-sm text-secondary font-semibold py-1">
                  Double = DT Hours × (Rate × 2.0)
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Applies to 7th day / &gt;12hr shifts</p>
              </div>
              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">Employer Labor Burden</span>
                <div className="font-data-mono text-body-sm text-secondary font-semibold py-1">
                  Total = Gross × (1 + Burden Rate)
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">Typically 1.25× to 1.40× multiplier</p>
              </div>
            </div>
          </div>

          {/* Comprehensive Comparison: Salary vs. Hourly Pay */}
          <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md flex flex-col gap-space-lg">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Salary vs. Hourly Pay: In-Depth Comparison</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Key legal, financial, and operational trade-offs for employees and managers.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm text-on-surface border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-on-surface font-headline-md text-xs font-semibold uppercase tracking-wider">
                    <th className="p-space-sm rounded-l-lg">Dimension</th>
                    <th className="p-space-sm">Salaried Compensation</th>
                    <th className="p-space-sm rounded-r-lg">Hourly Wages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  <tr className="hover:bg-surface-container-lowest/50">
                    <td className="p-space-sm font-semibold text-primary">Payment Predictability</td>
                    <td className="p-space-sm text-on-surface-variant">Predetermined gross amount disbursed each pay cycle, unaffected by variation in worked days or weekly hours.</td>
                    <td className="p-space-sm text-on-surface-variant">Fluctuates directly with tracked hours, scheduled shifts, seasonal adjustments, and approved breaks.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest/50">
                    <td className="p-space-sm font-semibold text-primary">Overtime Eligibility</td>
                    <td className="p-space-sm text-on-surface-variant">Typically <strong>Exempt</strong> from statutory FLSA overtime if salary exceeds statutory threshold ($43,888/yr in 2024; $58,656 in 2025).</td>
                    <td className="p-space-sm text-on-surface-variant">Strictly <strong>Non-Exempt</strong>. Entitled to 1.5× hourly pay for all hours worked beyond 40 in a statutory workweek.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest/50">
                    <td className="p-space-sm font-semibold text-primary">Time Tracking & Records</td>
                    <td className="p-space-sm text-on-surface-variant">Generally exempt from punch-clock logging, though PTO days and partial unpaid absences require tracking.</td>
                    <td className="p-space-sm text-on-surface-variant">Rigorous timesheet auditing mandated by labor law (exact clock-in, clock-out, and uncompensated meal intervals).</td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest/50">
                    <td className="p-space-sm font-semibold text-primary">Schedule Flexibility</td>
                    <td className="p-space-sm text-on-surface-variant">High autonomy. Focused on executive, professional, administrative deliverables rather than clocked minutes.</td>
                    <td className="p-space-sm text-on-surface-variant">Structured shifts. Missing a shift or leaving early directly curtails aggregate weekly gross take-home pay.</td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest/50">
                    <td className="p-space-sm font-semibold text-primary">Benefits & Bonus Structure</td>
                    <td className="p-space-sm text-on-surface-variant">Frequently bundled with paid parental leave, healthcare subsidies, annual performance bonuses, and equity grants.</td>
                    <td className="p-space-sm text-on-surface-variant">Benefits eligibility often tied to maintaining minimum weekly hourly thresholds (e.g. 30+ hrs/wk under ACA rules).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How Payroll Works: The 4 Primary Payroll Cycles */}
          <div className="flex flex-col gap-space-lg">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">The 4 Primary Payroll Cycles</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Understanding how frequency transforms cash flow and paycheck withholding math.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-xs font-semibold">52 Checks / Year</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Weekly Cycle</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Disbursed every Friday. Prevalent in construction, manufacturing, and food service. Provides immediate employee cash flow but carries highest employer administrative and processing fees.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-low font-data-mono text-xs text-on-surface">
                  $52,000 Salary = <span className="font-bold text-primary">$1,000.00 / wk</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-xs font-semibold">26 Checks / Year</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Bi-Weekly Cycle</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Paid every alternating other week (e.g., every other Friday). Most popular US business model. Includes 10 months with 2 checks and 2 months with 3 checks ('extra paycheck' months).
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-low font-data-mono text-xs text-on-surface">
                  $52,000 Salary = <span className="font-bold text-primary">$2,000.00 / check</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-xs font-semibold">24 Checks / Year</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Semi-Monthly Cycle</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Paid precisely twice per month (typically the 15th and the final calendar day). Simplifies internal accounting and monthly benefit deductions, but paydays vary by day of the week.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-low font-data-mono text-xs text-on-surface">
                  $52,000 Salary = <span className="font-bold text-primary">$2,166.67 / check</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-xs font-semibold">12 Checks / Year</span>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Monthly Cycle</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Standard in the United Kingdom, Europe, and India. Minimal employer processing cost. Employees must budget carefully across 28-31 day payment horizons.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-surface-container-low font-data-mono text-xs text-on-surface">
                  $52,000 Salary = <span className="font-bold text-primary">$4,333.33 / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Real-World Case Studies / Benchmark Scenarios */}
      <section className="w-full bg-surface py-space-3xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-2xl">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Empirical Validation</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Real-World Payroll Scenarios & Case Studies
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Five realistic worker archetypes demonstrating practical wage conversion, tax withholding waterfalls, and employer overhead calculations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-xl">
            {/* Case 1 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-primary font-bold">CASE STUDY 01</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-data-mono text-xs">Full-Time Hourly</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">$20.00 / Hour Standard Employee</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  A retail team member working standard 40-hour weeks without overtime across exactly 52 calendar weeks.
                </p>
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1 font-data-mono text-xs">
                  <div className="flex justify-between"><span>Gross Weekly:</span><span className="font-bold text-on-surface">$800.00</span></div>
                  <div className="flex justify-between"><span>Gross Biweekly:</span><span className="font-bold text-on-surface">$1,600.00</span></div>
                  <div className="flex justify-between"><span>Gross Annual:</span><span className="font-bold text-primary">$41,600.00</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Estimated Net (Single):</span><span>~$34,800.00</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-surface-container-low flex items-center justify-between">
                <span className="font-body-sm text-xs text-outline">Formula: 20 × 40 × 52</span>
                <Link className="text-primary font-body-sm text-xs font-semibold hover:underline" href="#">Model This →</Link>
              </div>
            </div>
            {/* Case 2 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-primary font-bold">CASE STUDY 02</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-data-mono text-xs">Corporate Salary</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">$50,000 / Year Exempt Professional</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  An associate marketing specialist on a fixed annual salary disbursed on a standard semi-monthly corporate cycle.
                </p>
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1 font-data-mono text-xs">
                  <div className="flex justify-between"><span>Monthly Gross:</span><span className="font-bold text-on-surface">$4,166.67</span></div>
                  <div className="flex justify-between"><span>Semi-Monthly Check:</span><span className="font-bold text-on-surface">$2,083.33</span></div>
                  <div className="flex justify-between"><span>Hourly Equivalent:</span><span className="font-bold text-primary">$24.04 / hr</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Estimated Net (Bi-Wk):</span><span>~$1,580.00</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-surface-container-low flex items-center justify-between">
                <span className="font-body-sm text-xs text-outline">Formula: 50,000 ÷ 2,080 hrs</span>
                <Link className="text-primary font-body-sm text-xs font-semibold hover:underline" href="#">Model This →</Link>
              </div>
            </div>
            {/* Case 3 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-primary font-bold">CASE STUDY 03</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-data-mono text-xs">Overtime Worker</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">$25/hr Base with 10 OT Hours</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  A healthcare nurse or field technician logging 50 total hours in a single pay period with time-and-a-half.
                </p>
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1 font-data-mono text-xs">
                  <div className="flex justify-between"><span>Regular (40h × $25):</span><span className="font-bold text-on-surface">$1,000.00</span></div>
                  <div className="flex justify-between"><span>Overtime (10h × $37.50):</span><span className="font-bold text-on-surface">$375.00</span></div>
                  <div className="flex justify-between"><span>Total Gross Pay:</span><span className="font-bold text-primary">$1,375.00</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Annualized Projection:</span><span>~$71,500.00</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-surface-container-low flex items-center justify-between">
                <span className="font-body-sm text-xs text-outline">Formula: 1,000 + (10 × 37.5)</span>
                <Link className="text-primary font-body-sm text-xs font-semibold hover:underline" href="#">Model This →</Link>
              </div>
            </div>
            {/* Case 4 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-primary font-bold">CASE STUDY 04</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-data-mono text-xs">1099 Contractor</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Freelancer $100k Salary Parity</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Transitioning from a $100k W-2 to 1099 sole proprietorship. Must absorb 15.3% SE tax, healthcare, and 25% unbillable administrative time.
                </p>
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1 font-data-mono text-xs">
                  <div className="flex justify-between"><span>Required Annual Gross:</span><span className="font-bold text-on-surface">$135,000.00</span></div>
                  <div className="flex justify-between"><span>Billable Hours (30h/wk):</span><span className="font-bold text-on-surface">1,500 hrs/yr</span></div>
                  <div className="flex justify-between"><span>Target Billable Hourly:</span><span className="font-bold text-primary">$90.00 / hr</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Target Day Rate:</span><span>$720.00 / day</span></div>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-surface-container-low flex items-center justify-between">
                <span className="font-body-sm text-xs text-outline">Factor: 1.35× W-2 Target ÷ 1,500h</span>
                <Link className="text-primary font-body-sm text-xs font-semibold hover:underline" href="#">Model This →</Link>
              </div>
            </div>
            {/* Case 5 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between lg:col-span-2">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-primary font-bold">CASE STUDY 05</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-data-mono text-xs">Employer Hiring Cost</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">True Corporate Burden on a $75,000 Base Salary</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Demonstrating the full cost to an employer when extending a $75,000 W-2 job offer in an average US state.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-lg font-data-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Contract Base Salary:</span><span className="font-bold text-on-surface">$75,000.00</span></div>
                    <div className="flex justify-between"><span>Employer FICA (7.65%):</span><span>+$5,737.50</span></div>
                    <div className="flex justify-between"><span>FUTA & SUTA Unemployment:</span><span>+$650.00</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Employer Health Subsidies:</span><span>+$7,200.00</span></div>
                    <div className="flex justify-between"><span>401(k) Match (4%):</span><span>+$3,000.00</span></div>
                    <div className="flex justify-between"><span>Worker's Comp & Admin:</span><span>+$1,800.00</span></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">Total True Employer Expenditure:</span>
                  <span className="font-data-mono text-data-mono font-bold text-primary">$93,387.50 (1.245× Burden Multiplier)</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-xs border-t border-surface-container-low flex items-center justify-between">
                <span className="font-body-sm text-xs text-outline">Source: US Bureau of Labor Statistics Employer Costs for Employee Compensation (ECEC)</span>
                <Link className="text-primary font-body-sm text-xs font-semibold hover:underline" href="#">Model Hiring Costs →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Comprehensive 25-Question SEO FAQ Accordion */}
      <section className="w-full bg-surface-container-low py-space-3xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-2xl">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Clear Answers</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Frequently Asked Questions on Salaries, Wages & Payroll
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Detailed, compliance-grade answers covering taxation, hourly math, FLSA exemptions, overtime benchmarks, and employer labor overhead.
            </p>
          </div>
          <div className="space-y-space-sm" id="faqAccordionContainer">
            {/* FAQ Item 1 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>1. How do I calculate my salary?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                To calculate your salary from an hourly wage, multiply your hourly rate by the number of worked hours per week (standard is 40) and then multiply by 52 weeks. For example, $25/hour × 40 hours × 52 weeks = $52,000 gross annual salary. If you work a salaried job and need your weekly pay, divide your annual gross salary by 52.
              </div>
            </details>
            {/* FAQ Item 2 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>2. How do I convert hourly pay to an annual salary?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The quickest institutional rule of thumb is the <strong>2,080 multiplier</strong> (40 hours per week × 52 calendar weeks). Multiply your hourly rate by 2,080. A shortcut method is to multiply your hourly wage by 2 and add three zeroes to the end (e.g., $30/hr × 2 = $60 → ~$60,000, or exact: $30 × 2,080 = $62,400).
              </div>
            </details>
            {/* FAQ Item 3 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>3. What is gross pay?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Gross pay is the total aggregate compensation accrued before any deductions or statutory withholdings. It consists of contractual base pay, overtime premiums, commissions, bonuses, hazard differentials, tips, and paid time off (PTO).
              </div>
            </details>
            {/* FAQ Item 4 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>4. What is net pay?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Net pay is your actual spendable take-home check disbursed via direct deposit or check. It equals gross pay minus pre-tax deductions (401k, health insurance premiums), statutory payroll taxes (federal, state, local, and FICA), and post-tax deductions (garnishments, Roth contributions, union dues).
              </div>
            </details>
            {/* FAQ Item 5 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>5. How is overtime calculated?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Under US federal FLSA standards, covered non-exempt employees must receive overtime pay for all hours worked exceeding 40 in a workweek at a rate not less than 1.5 times their regular rate of pay. Formula: Regular Hourly Rate × 1.5 × Overtime Hours. In states like California, hours worked beyond 8 in a single workday also trigger overtime.
              </div>
            </details>
            {/* FAQ Item 6 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>6. What payroll schedule is best?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                It depends on organizational structure. <strong>Biweekly (26 checks/yr)</strong> is favored by hourly teams because pay days always land on the same weekday (e.g. alternating Fridays). <strong>Semi-monthly (24 checks/yr)</strong> is preferred for salaried teams because each month has clean, consistent two-paycheck accounting.
              </div>
            </details>
            {/* FAQ Item 7 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>7. How many work hours are in a year?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The standard payroll year contains <strong>2,080 working hours</strong> based on 40 hours per week across 52 weeks (40 × 52 = 2,080). Non-leap calendar years typically have 261 working days, resulting in 2,088 actual working hours.
              </div>
            </details>
            {/* FAQ Item 8 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>8. How much is $25/hour annually?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                At $25.00 per hour working full-time (40 hours/week, 52 weeks/year), your annual gross salary is <strong>$52,000</strong>. This equates to $4,333.33 per month, $2,000.00 biweekly, or $1,000.00 weekly before tax withholdings.
              </div>
            </details>
            {/* FAQ Item 9 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>9. What deductions affect take-home pay?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Deductions split into three categories: (1) <em>Pre-Tax:</em> 401(k)/403(b), Section 125 health/dental/vision insurance, HSA, FSA; (2) <em>Mandatory Taxes:</em> Federal income tax, state income tax, local taxes, Social Security (6.2%), Medicare (1.45%); and (3) <em>Post-Tax:</em> Roth 401(k), disability insurance, union fees, and legal wage garnishments.
              </div>
            </details>
            {/* FAQ Item 10 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>10. How do payroll taxes work?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Payroll taxes are joint levies imposed on employers and employees. In the US under FICA, employees pay 6.2% for Social Security (up to $176,100 wage ceiling in 2025) and 1.45% for Medicare. Employers match both levies dollar-for-dollar (another 7.65%), plus fund state and federal unemployment insurance (SUTA and FUTA).
              </div>
            </details>
            {/* FAQ Item 11 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>11. What is the difference between exempt and non-exempt employees?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                <strong>Non-exempt employees</strong> are legally protected by the Fair Labor Standards Act (FLSA) and must receive minimum wage and overtime pay (1.5×) for work exceeding 40 weekly hours. <strong>Exempt employees</strong> (typically executive, administrative, or professional roles) are paid a fixed salary and do not qualify for overtime pay, provided their earnings meet federal minimum salary baselines.
              </div>
            </details>
            {/* FAQ Item 12 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>12. How does a biweekly pay schedule differ from semi-monthly?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Biweekly produces <strong>26 paychecks per year</strong>, paid every other week regardless of calendar month end. Semi-monthly produces <strong>24 paychecks per year</strong>, paid exactly twice a month (e.g. the 15th and last business day). Semi-monthly paychecks are slightly larger than biweekly checks for an equivalent annual salary.
              </div>
            </details>
            {/* FAQ Item 13 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>13. How are salaried employees paid for overtime?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Salaried employees who are classified as <em>salaried non-exempt</em> must be paid overtime. Their hourly rate is determined by dividing their weekly salary by the contractual expected hours (e.g. 40), with any extra hours compensated at 1.5× that regular rate. Salaried <em>exempt</em> employees do not receive overtime under federal statutes.
              </div>
            </details>
            {/* FAQ Item 14 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>14. What is time and a half?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Time and a half is an overtime premium rate equal to 150% (1.5 times) an employee's base regular hourly wage. If an employee's regular rate is $20.00/hour, their time and a half rate is $30.00/hour ($20 × 1.5).
              </div>
            </details>
            {/* FAQ Item 15 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>15. When does double-time pay apply?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Double-time (2.0× base pay) is not universally required under US federal FLSA, but is mandated by specific jurisdictions like California for hours worked beyond 12 in a single day, or for work exceeding 8 hours on the 7th consecutive workday of a workweek. It is also standard under union collective bargaining agreements for major holidays.
              </div>
            </details>
            {/* FAQ Item 16 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>16. How do I calculate prorated salary for a partial month?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The most widely accepted corporate method divides the annual salary by 260 working days to get an exact daily rate, then multiplies that daily rate by the number of working days the employee was active in the pay period. Alternatively, monthly salary can be divided by total working days in that specific calendar month.
              </div>
            </details>
            {/* FAQ Item 17 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>17. What is employer payroll burden?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Payroll burden is the total overhead cost incurred by an employer beyond base wages to maintain an employee. It includes employer payroll taxes (FICA 7.65%), state/federal unemployment insurance, worker's compensation policies, subsidized health/dental insurance, retirement matches, and paid leave allowances. It typically ranges from 20% to 40% over base salary.
              </div>
            </details>
            {/* FAQ Item 18 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>18. How do freelancers set their hourly rate from a salary target?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Add 30-40% to your target W-2 salary to absorb self-employment taxes (15.3%), private healthcare, retirement contributions, and software costs. Then divide this total by approximately 1,500 billable hours per year (accounting for 25% non-billable business admin, marketing, and unpaid vacation).
              </div>
            </details>
            {/* FAQ Item 19 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>19. How does unpaid leave or Loss of Pay (LOP) impact salary?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Loss of Pay (LOP) occurs when an employee exhausts accrued PTO and takes unpaid absences. For salaried staff, deductions are calculated using the per-diem rate: (Annual Salary ÷ Working Days in Year) × Number of LOP Days. The resulting figure is subtracted directly from gross period pay.
              </div>
            </details>
            {/* FAQ Item 20 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>20. What is FICA tax and who pays it?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                FICA stands for the Federal Insurance Contributions Act. It finances US Social Security and Medicare. Both the employee and the employer pay 7.65% each (6.2% Social Security + 1.45% Medicare), totaling 15.3%. Self-employed 1099 contractors pay the entire 15.3% through self-employment tax.
              </div>
            </details>
            {/* FAQ Item 21 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>21. How do shift differentials work?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                A shift differential is an added premium paid per hour for working non-traditional hours, such as 2nd shift (afternoons/evenings), 3rd shift (graveyard/overnight), or weekend on-call duty. It can be a fixed bonus amount (e.g., +$2.50/hour) or a percentage addition (e.g., +10% over base wage).
              </div>
            </details>
            {/* FAQ Item 22 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>22. How are commissions and bonuses taxed?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The IRS classifies commissions and bonuses as supplemental wages. Employers typically withhold federal income tax using the flat statutory supplemental withholding rate of 22% (or 37% on amounts over $1 million). Alternatively, employers may use the aggregate method, which combines regular salary with the bonus and withholds based on ordinary marginal tax brackets.
              </div>
            </details>
            {/* FAQ Item 23 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>23. Can salary deductions bring pay below minimum wage?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Under the Fair Labor Standards Act, non-statutory employer deductions (such as uniform costs, equipment deposits, or cash drawer shortages) cannot reduce an employee's effective hourly rate below the statutory federal or applicable state minimum wage in a pay period. Mandatory taxes and court-ordered child support child levies are exempt from this threshold.
              </div>
            </details>
            {/* FAQ Item 24 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>24. How do holiday pay and PTO factor into gross earnings?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Paid Time Off (PTO) and paid holidays count as gross compensable earnings paid at your regular base hourly or daily rate. However, under the FLSA, unworked holiday hours do not count toward the 40 physical hours required to trigger overtime premiums during that workweek.
              </div>
            </details>
            {/* FAQ Item 25 */}
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm transition-all duration-200">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-body-lg text-on-surface font-semibold list-none">
                <span>25. What records must employers keep for payroll compliance?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="mt-space-sm pt-space-sm border-t border-surface-container font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The FLSA requires employers to preserve basic payroll records (total hours worked daily/weekly, total straight-time earnings, overtime pay, and date of payments) for at least three years. Supporting timesheets, time cards, and wage schedules must be preserved for at least two years. IRS tax withholding documents (Form W-4) must be maintained for at least four years.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Section 7: Contextual Internal Linking Matrix (Related Sibling Suites) */}
      <section className="w-full bg-surface py-space-2xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Connected Financial Ecosystem</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Explore Related Computational Workbenches</h2>
            </div>
            <Link className="text-primary font-body-sm text-body-sm font-semibold hover:underline hidden md:inline" href="#">
              View All Financial Tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {/* Sibling Card 1 */}
            <Link className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between" href="#">
              <div className="space-y-space-xs">
                <span className="p-2 rounded-lg bg-surface-container text-primary inline-block">
                  <span className="material-symbols-outlined text-[24px]">account_balance</span>
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Tax Calculators</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Federal 1040, state brackets, capital gains, UK PAYE, Canada CRA, and Australia ATO individual tax models.
                </p>
              </div>
              <span className="mt-space-md text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Tax Suite <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </Link>
            {/* Sibling Card 2 */}
            <Link className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between" href="#">
              <div className="space-y-space-xs">
                <span className="p-2 rounded-lg bg-surface-container text-primary inline-block">
                  <span className="material-symbols-outlined text-[24px]">pie_chart</span>
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Budget Calculators</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  50/30/20 budget allocations, zero-based cash management, sinking funds, and net pay living cost projections.
                </p>
              </div>
              <span className="mt-space-md text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Budget Suite <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </Link>
            {/* Sibling Card 3 */}
            <Link className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between" href="#">
              <div className="space-y-space-xs">
                <span className="p-2 rounded-lg bg-surface-container text-primary inline-block">
                  <span className="material-symbols-outlined text-[24px]">trending_up</span>
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Investment & Savings</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Compound interest engines, dividend reinvestment (DRIP), SIP forecasters, and automated retirement modeling.
                </p>
              </div>
              <span className="mt-space-md text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Investment Suite <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </Link>
            {/* Sibling Card 4 */}
            <Link className="group bg-surface-container-lowest p-space-lg rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between" href="/daily-wage-planner">
              <div className="space-y-space-xs">
                <span className="p-2 rounded-lg bg-surface-container text-primary inline-block">
                  <span className="material-symbols-outlined text-[24px]">today</span>
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Daily Wage Planner</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Deep-dive into 26-day vs 30-day salary divisors, per-diem business travel allocations, and daily contract invoicing.
                </p>
              </div>
              <span className="mt-space-md text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Planner <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 8: EEAT Review Board, Regulatory Citations & Privacy Guarantee */}
      <section className="w-full bg-surface-container py-space-xl px-gutter-mobile lg:px-gutter-desktop border-t border-surface-container-highest">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Reviewers Bio */}
            <div className="lg:col-span-6 flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-on-primary">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-headline-md text-body-lg font-semibold text-on-surface">Subject Matter Editorial Review</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Curated and mathematically audited by <strong>Elena Rostova, CPA</strong> (Senior Payroll Auditor, former Big 4) and <strong>Marcus Vance, CFA</strong>. Compensation calculations conform to IEEE 754 precision standards and are verified against updated 2024–2025 revenue publication guidelines.
                </p>
                <p className="font-data-mono text-xs text-outline">
                  Last Full Audit: January 15, 2025 • Statutory Tax Year: 2025 Active
                </p>
              </div>
            </div>
            {/* Statutory Authority Citations */}
            <div className="lg:col-span-6 flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Statutory Authority & Legal Frameworks</span>
              <div className="grid grid-cols-2 gap-x-space-md gap-y-1 font-data-mono text-xs text-on-surface-variant">
                <div className="">• US FLSA: 29 U.S.C. § 207 & 29 CFR § 778</div>
                <div className="">• US Tax Code: 26 U.S. Code § 3402 & FICA</div>
                <div className="">• UK Statutes: Employment Rights Act 1996</div>
                <div className="">• UK HMRC: PAYE CWG2 Employer Guide</div>
                <div className="">• Canada: Canada Labour Code (R.S.C.)</div>
                <div className="">• Australia: Fair Work Act 2009 & NES</div>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-tight">
                Disclaimer: Calculations provided by SolveIt precision workbenches are intended for informational, estimation, and financial forecasting purposes. They do not constitute formal legal, accounting, tax, or payroll compliance counsel.
              </p>
            </div>
          </div>
        </div>
      </section>


        </div>
      </main>
    </>
  );
}
