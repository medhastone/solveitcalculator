"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState('sec-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const [isSavingClick, setIsSavingClick] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({ functional: true, analytics: true, marketing: true });
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const tocLinks = [
    { id: 'sec-1', title: '1. Who We Are & Scope', badge: '01', badgeClass: 'text-outline' },
    { id: 'sec-2', title: '2. Local Calculator Execution', badge: 'CORE', badgeClass: 'text-primary font-bold' },
    { id: 'sec-3', title: '3. Information We Collect', badge: '03', badgeClass: 'text-outline' },
    { id: 'sec-4', title: '4. Legal Bases (GDPR Art. 6)', badge: '04', badgeClass: 'text-outline' },
    { id: 'sec-5', title: '5. Cookies & Storage Matrix', badge: '05', badgeClass: 'text-outline' },
    { id: 'sec-6', title: '6. Google AdSense Disclosures', badge: 'ADS', badgeClass: 'text-secondary font-bold' },
    { id: 'sec-7', title: '7. Google Analytics 4 & Consent v2', badge: '07', badgeClass: 'text-outline' },
    { id: 'sec-8', title: '8. Third-Party Web Services', badge: '08', badgeClass: 'text-outline' },
    { id: 'sec-9', title: '9. Financial & Affiliate Integrity', badge: '09', badgeClass: 'text-outline' },
    { id: 'sec-10', title: '10. Data Retention Schedules', badge: '10', badgeClass: 'text-outline' },
    { id: 'sec-11', title: '11. Encryption & SOC-2 Security', badge: '11', badgeClass: 'text-outline' },
    { id: 'sec-12', title: '12. Children\'s Privacy (COPPA)', badge: '12', badgeClass: 'text-outline' },
    { id: 'sec-13', title: '13. GDPR Rights (EU/EEA/UK)', badge: '13', badgeClass: 'text-outline' },
    { id: 'sec-14', title: '14. California Rights (CCPA/CPRA)', badge: '14', badgeClass: 'text-outline' },
    { id: 'sec-15', title: '15. International Transfers & SCCs', badge: '15', badgeClass: 'text-outline' },
    { id: 'sec-16', title: '16. Cookie Preference Center', badge: 'TOOL', badgeClass: 'text-primary font-bold' },
    { id: 'sec-17', title: '17. Policy Revision Cadence', badge: '17', badgeClass: 'text-outline' },
    { id: 'sec-18', title: '18. Data Protection Officer (DPO)', badge: '18', badgeClass: 'text-outline' }
  ];

  const faqs = [
    { q: "Do you store or log the numbers I enter into financial or tax calculators?", a: "<strong>No. Absolutely not.</strong> SolveIt Calculator executes mathematical computations in-browser utilizing client-side JavaScript. When you calculate loan amortizations, tax brackets, BMI, or compound interest, the input parameters never leave your local RAM memory and are never transmitted to our web servers." },
    { q: "How does Google AdSense use cookies on this site?", a: "Google AdSense utilizes advertising cookies to serve ads based on your visit history across the web. These cookies allow Google and its ad partners to serve relevant banners that financially support free tool access. In the EEA and UK, Google only serves personalized ads once you provide explicit opt-in consent via our TCF v2.2 banner." },
    { q: "How can I permanently opt out of personalized advertisements?", a: "You can toggle off the Marketing switch directly in our on-page <em>Cookie Preference Center</em> above. Furthermore, you can disable personalized advertising globally at <a class=\"text-primary underline\" href=\"https://adssettings.google.com\" target=\"_blank\" rel=\"noreferrer\">Google Ad Settings</a> and via the industry consumer portal at <a class=\"text-primary underline\" href=\"https://optout.aboutads.info\" target=\"_blank\" rel=\"noreferrer\">aboutads.info</a>." },
    { q: "Can I request the deletion of any data you have about me?", a: "Yes. While we hold no personal calculation histories, if you have ever contacted our support desk or opted into communications, you can email <a class=\"text-primary underline font-medium\" href=\"mailto:info@solveitcalculator.com\">info@solveitcalculator.com</a> with the subject line \"GDPR/CCPA Erasure Request.\" We fulfill all valid deletion requests within 30 days." },
    { q: "Is SolveItCalculator compliant with EU GDPR and California CCPA/CPRA?", a: "Yes. SolveItCalculator is engineered to meet or exceed the mandates of both the EU General Data Protection Regulation (Regulation (EU) 2016/679) and the California Consumer Privacy Act. We employ certified Consent Management Platforms, support the Global Privacy Control (GPC) signal, and retain zero personal calculator entries." }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocLinks.map(l => document.getElementById(l.id)).filter(Boolean);
      const scrollPos = window.scrollY + 140;
      let current = sections[0];
      sections.forEach(sec => {
        if (sec && sec.offsetTop <= scrollPos) {
          current = sec;
        }
      });
      if (current) {
        setActiveSection(current.id);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 800);
  };

  const handleSavePrefs = () => {
    setIsSavingClick(true);
    setTimeout(() => setIsSavingClick(false), 150);
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 4000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <main className="w-full pt-20 bg-background flex-1">
      <div className="flex flex-col w-full">
        {/* Subtle Gradient Ambient Backdrop Overlay */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-96 pointer-events-none opacity-40 bg-gradient-to-b from-primary/10 via-primary-fixed-dim/5 to-transparent blur-3xl -z-10"></div>
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl flex flex-col gap-space-xl">
            
            {/* Top Breadcrumb */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-xs">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span className="">Home</span>
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">Privacy Policy</span>
              </nav>
            </section>

            {/* Page Header & Action Bar */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
              <div className="max-w-3xl flex flex-col gap-space-xs">
                <div className="flex items-center gap-2">
                  <span className="px-space-sm py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">Institutional Transparency</span>
                  <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-widest">• Zero Server Telemetry</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Privacy Policy &amp; Computational Charter</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Clear, transparent, and plain-English disclosures detailing how SolveItCalculator handles your interaction data, guarantees 100% local calculation privacy, serves responsible advertisements via Google AdSense, and protects your rights under GDPR, CCPA/CPRA, and COPPA.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-space-xs shrink-0">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface transition-all active:scale-[0.98] shadow-sm font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span className="">Print Policy</span>
                </button>
                <a className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface transition-all active:scale-[0.98] shadow-sm font-body-sm text-body-sm" href="#sec-16">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="">Manage Cookies</span>
                </a>
                <button onClick={handlePrint} className={`flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary-container text-on-primary-container font-body-sm text-body-sm font-semibold hover:bg-primary transition-all active:scale-[0.98] shadow-sm ${isPrinting ? 'opacity-80' : ''}`}>
                  {isPrinting ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                      <span className="">Compiling PDF...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                      <span className="">Legal PDF (v3.4)</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Trust Badges Bar */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
              <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">memory</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Architecture</span>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">100% Client-Side Engine</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[22px]">ads_click</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Google Compliance</span>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">AdSense &amp; TCF v2.2</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[22px]">policy</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Jurisdiction</span>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">EU GDPR &amp; UK GDPR</span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-lowest rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed/50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[22px]">shield</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">California Code</span>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">CCPA / CPRA No-Sale</span>
                </div>
              </div>
            </section>

            {/* Executive Summary: Bento Grid */}
            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Executive Summary • 4 Core Commitments</h2>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">Scannable Overview</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
                <a href="#sec-2" className="flex flex-col justify-between p-space-lg bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex flex-col gap-space-sm relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Zero Data Retention</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Your loan balances, salaries, tax deductions, and health metrics are executed strictly in volatile web-browser memory. Nothing touches a cloud server or SQL ledger.
                    </p>
                  </div>
                  <div className="pt-space-md flex items-center gap-1.5 text-primary font-body-sm text-body-sm font-semibold">
                    <span className="">Ephemeral RAM Execution</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>
                
                <a href="#sec-14" className="flex flex-col justify-between p-space-lg bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex flex-col gap-space-sm relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">money_off</span>
                    </div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Zero Sale of Data</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      We never monetize your identity. SolveIt does not sell, rent, broker, or trade personal data, telemetry, or browsing history to data syndicators under CCPA or CPRA.
                    </p>
                  </div>
                  <div className="pt-space-md flex items-center gap-1.5 text-secondary font-body-sm text-body-sm font-semibold">
                    <span className="">Strict No-Broker Policy</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>

                <a href="#sec-6" className="flex flex-col justify-between p-space-lg bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex flex-col gap-space-sm relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">campaign</span>
                    </div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Ethical AdSense Model</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      We utilize Google AdSense with full Google Consent Mode v2 support, respecting European TCF 2.2 signals, Do-Not-Track headers, and granular opt-out choices.
                    </p>
                  </div>
                  <div className="pt-space-md flex items-center gap-1.5 text-primary font-body-sm text-body-sm font-semibold">
                    <span className="">Consent Mode v2 Enabled</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>

                <a href="#sec-13" className="flex flex-col justify-between p-space-lg bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex flex-col gap-space-sm relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">gavel</span>
                    </div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Complete Control &amp; Rights</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Exercise your statutory rights with one click: GDPR erasure, CCPA information requests, cookie revoking, or our direct DPO fast-track email service.
                    </p>
                  </div>
                  <div className="pt-space-md flex items-center gap-1.5 text-on-surface font-body-sm text-body-sm font-semibold">
                    <span className="">30-Day Response SLA</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>
              </div>
            </section>

            {/* Main Dual-Column Document Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start pt-space-md">
              
              {/* Left Column: Sticky Table of Contents */}
              <aside className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-space-md">
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md max-h-[calc(100vh-140px)] overflow-y-auto">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">format_list_bulleted</span>
                      <span className="font-body-md text-body-md font-semibold text-on-surface">Table of Contents</span>
                    </div>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded">18 Clauses</span>
                  </div>

                  <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
                    <input 
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm pl-8 pr-space-sm py-1.5 rounded-lg outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] transition-all" 
                      id="policy-search" 
                      placeholder="Search clause (e.g. AdSense, Cookies)..." 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <nav className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
                    {tocLinks.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase())).map(link => (
                      <a key={link.id} href={`#${link.id}`} className={`flex items-center justify-between px-space-sm py-1.5 rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all ${activeSection === link.id ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant'}`}>
                        <span className="truncate">{link.title}</span>
                        <span className={`font-data-mono text-[11px] ${link.badgeClass}`}>{link.badge}</span>
                      </a>
                    ))}
                  </nav>

                  <div className="pt-space-xs mt-space-xs p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Immediate Assistance</span>
                    <p className="font-body-sm text-body-sm text-on-surface">Questions regarding personal data?</p>
                    <a className="text-primary font-semibold font-body-sm text-body-sm hover:underline flex items-center gap-1 pt-1" href="mailto:info@solveitcalculator.com">
                      <span className="">info@solveitcalculator.com</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </aside>

              {/* Right Column: Clauses */}
              <div className="lg:col-span-8 flex flex-col gap-space-xl">
                {/* Section 1 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-1">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 01</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Entity Transparency</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">1. Introduction &amp; Who We Are</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      Welcome to <strong className="text-on-surface">SolveItCalculator</strong> (operating globally at <a className="text-primary hover:underline" href="https://solveitcalculator.com">solveitcalculator.com</a>, herein referred to as "SolveIt", "we", "our", or "us"). We design, develop, and operate high-precision, mathematically audited browser computational tools spanning finance, taxation, loans, health, and science.
                    </p>

                    <p className="">
                      We are staunch believers in <em className="text-on-surface font-medium">Privacy by Architecture</em>. This Privacy Policy sets out our contractual and statutory commitments regarding any information processed when you visit our website, run numerical calculations, interact with advertisements, or submit correspondence.
                    </p>
                  </div>
                </article>

                {/* Section 2 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24 border-l-4 border-l-primary relative overflow-hidden" id="sec-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary-container font-data-mono text-[12px] font-bold">Section 02</span>
                      <span className="px-space-sm py-0.5 rounded-full bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase font-bold tracking-wider">Fundamental Guarantee</span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">2. Calculator-Specific Privacy &amp; 100% Local Processing</h2>
                  <div className="p-space-md rounded-xl bg-surface-container flex flex-col sm:flex-row items-start gap-space-md">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[28px]">devices</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-body-lg text-body-lg font-bold text-on-surface">Zero Data Leaves Your Browser</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        When you use our compound interest, mortgage amortization, debt payoff, or income tax calculators, every single input figure (e.g., annual gross income, home purchase price, down payment, blood glucose, medical data) is computed <strong className="text-on-surface font-semibold">strictly via in-memory JavaScript in your browser’s V8 / JavaScriptCore engine</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">Specifically:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className=""><strong className="text-on-surface">No Server-Side Calculation Logging:</strong> We do not operate calculation endpoints that receive your numbers. Typing a loan amount of $750,000 does not send an HTTP payload to our servers.</li>
                      <li className=""><strong className="text-on-surface">No User Accounts Required:</strong> You are never mandated to register an account, authenticate via social logins, or enter an email address to unlock mathematical formulas or generate amortization tables.</li>
                      <li className=""><strong className="text-on-surface">Optional Local Storage Persistence:</strong> Some tools offer an optional "Save Calculation" button. If clicked, this data is saved solely in your browser's private <code className="font-data-mono text-[13px] bg-surface-container-high px-1 py-0.5 rounded">window.localStorage</code> partition. It is unreadable by any external domain and cleared anytime you flush browser cache.</li>
                      <li className=""><strong className="text-on-surface">Informational Disclaimer:</strong> All computation algorithms, amortizations, tax deductions, and scientific outputs are provided for educational and modeling purposes only. They do not constitute certified public accountant (CPA) advice, licensed legal guidance, or certified actuarial opinions.</li>
                    </ul>
                  </div>
                </article>

                {/* Section 3 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-3">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 03</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Data Categorization</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">3. Information We Collect (Automatic vs. Voluntary)</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      While calculations are private, web standard protocols require the processing of baseline digital packets to serve static files reliably across worldwide content delivery networks (CDNs).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary font-semibold font-body-sm text-body-sm">
                          <span className="material-symbols-outlined text-[18px]">dns</span>
                          <span className="">Automatically Collected Telemetry</span>
                        </div>
                        <ul className="text-body-sm font-body-sm space-y-1.5 text-on-surface-variant">
                          <li className="">• Truncated IP Address (IPv4 / IPv6 anonymization)</li>
                          <li className="">• Browser engine type &amp; version string (User Agent)</li>
                          <li className="">• Operating system &amp; device hardware category</li>
                          <li className="">• Screen viewport resolution (for responsive rendering)</li>
                          <li className="">• Referring URL &amp; navigation timestamp</li>
                          <li className="">• Content delivery edge cache hit/miss diagnostic codes</li>
                        </ul>
                      </div>
                      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-secondary font-semibold font-body-sm text-body-sm">
                          <span className="material-symbols-outlined text-[18px]">contact_mail</span>
                          <span className="">Voluntarily Provided Data</span>
                        </div>
                        <ul className="text-body-sm font-body-sm space-y-1.5 text-on-surface-variant">
                          <li className="">• Support correspondence sent to our help desks</li>
                          <li className="">• Email address (only when explicitly reporting an algorithmic bug)</li>
                          <li className="">• Custom formula parameters submitted for engineering review</li>
                          <li className="">• Explicit opt-in choices submitted via our Cookie Banner</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Section 4 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-4">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 04</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Legal Framework</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">4. How We Use Information &amp; Legal Bases (GDPR Art. 6)</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      Under European Data Protection Law (GDPR Article 6(1)) and equivalent global mandates, SolveIt processes information solely on established legal foundations:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-body-sm text-body-sm">
                        <thead>
                          <tr className="bg-surface-container text-on-surface font-semibold">
                            <th className="p-space-sm rounded-l-lg">Purpose of Processing</th>
                            <th className="p-space-sm">Data Type</th>
                            <th className="p-space-sm rounded-r-lg">Legal Basis (GDPR Art. 6)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high text-on-surface-variant">
                          <tr>
                            <td className="p-space-sm font-medium text-on-surface">Content Delivery &amp; Web Security (DDoS mitigation)</td>
                            <td className="p-space-sm">IP address, server headers</td>
                            <td className="p-space-sm"><span className="px-2 py-0.5 bg-surface-container-high rounded text-[11px] font-semibold">Legitimate Interest (Art. 6(1)(f))</span></td>
                          </tr>
                          <tr>
                            <td className="p-space-sm font-medium text-on-surface">Mathematical Accuracy Audits</td>
                            <td className="p-space-sm">Aggregated, non-PII query timing</td>
                            <td className="p-space-sm"><span className="px-2 py-0.5 bg-surface-container-high rounded text-[11px] font-semibold">Legitimate Interest (Art. 6(1)(f))</span></td>
                          </tr>
                          <tr>
                            <td className="p-space-sm font-medium text-on-surface">Personalized Advertising via Google AdSense</td>
                            <td className="p-space-sm">Cookie identifiers, device signals</td>
                            <td className="p-space-sm"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[11px] font-semibold">Explicit Consent (Art. 6(1)(a))</span></td>
                          </tr>
                          <tr>
                            <td className="p-space-sm font-medium text-on-surface">Anonymized Web Traffic Analytics</td>
                            <td className="p-space-sm">GA4 anonymized client IDs</td>
                            <td className="p-space-sm"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[11px] font-semibold">Consent (Art. 6(1)(a))</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>

                {/* Section 5 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-5">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 05</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Technical Tracking Matrix</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">5. Cookies &amp; Tracking Technologies</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      Cookies are small string tokens placed on your device to maintain UI state or measure performance. We categorize our cookie inventory into four transparent tiers:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-body-sm text-body-sm">
                        <thead>
                          <tr className="bg-surface-container text-on-surface font-semibold">
                            <th className="p-space-sm rounded-l-lg">Category</th>
                            <th className="p-space-sm">Sample Keys</th>
                            <th className="p-space-sm">Lifespan</th>
                            <th className="p-space-sm rounded-r-lg">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="text-on-surface-variant divide-y divide-surface-container-high">
                          <tr>
                            <td className="p-space-sm font-semibold text-on-surface">1. Essential / Strictly Necessary</td>
                            <td className="p-space-sm font-data-mono text-[12px]">solveit_consent, cf_clearance</td>
                            <td className="p-space-sm">6 - 12 Months</td>
                            <td className="p-space-sm">Stores your consent choices and protects against bot denial-of-service traffic. Cannot be turned off.</td>
                          </tr>
                          <tr>
                            <td className="p-space-sm font-semibold text-on-surface">2. Functional &amp; Preferences</td>
                            <td className="p-space-sm font-data-mono text-[12px]">calc_currency, theme_mode</td>
                            <td className="p-space-sm">30 Days</td>
                            <td className="p-space-sm">Remembers your chosen display currency (USD, EUR, GBP) and precision decimal preferences.</td>
                          </tr>
                          <tr>
                            <td className="p-space-sm font-semibold text-on-surface">3. Performance &amp; Analytics</td>
                            <td className="p-space-sm font-data-mono text-[12px]">_ga, _ga_CONTAINER</td>
                            <td className="p-space-sm">14 Months</td>
                            <td className="p-space-sm">Measures which calculator algorithms crash or require performance optimizations via Google Analytics 4.</td>
                          </tr>
                          <tr>
                            <td className="p-space-sm font-semibold text-on-surface">4. Marketing &amp; AdSense</td>
                            <td className="p-space-sm font-data-mono text-[12px]">__gads, IDE, DSID</td>
                            <td className="p-space-sm">90 Days - 1 Year</td>
                            <td className="p-space-sm">Used by Google AdSense to serve non-intrusive banner ads that fund free access to our mathematical software.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>

                {/* Section 6 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24 border-l-4 border-l-secondary" id="sec-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-space-sm py-0.5 rounded-full bg-secondary text-on-secondary font-data-mono text-[12px] font-bold">Section 06</span>
                      <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase font-bold tracking-wider">Mandatory Publisher Notice</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[24px]">ad_units</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">6. Google AdSense &amp; Third-Party Advertising Disclosures</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      SolveItCalculator partners with <strong className="text-on-surface">Google Inc. (Google AdSense)</strong> and its certified advertising network partners to serve programmatic display and native advertisements. In compliance with Google Publisher Policies, we explicitly disclose the following:
                    </p>
                    <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
                        <p className="font-body-sm text-body-sm text-on-surface">
                          <strong>Third-Party Vendor Cookies:</strong> Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to SolveItCalculator or other websites across the Internet.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
                        <p className="font-body-sm text-body-sm text-on-surface">
                          <strong>Advertising Cookies:</strong> Google's use of advertising cookies enables it and its certified demand partners to serve ads to users based on their visits to our sites and/or other sites on the Internet.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
                        <p className="font-body-sm text-body-sm text-on-surface">
                          <strong>Opt-Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a className="text-primary underline font-medium" href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings (adssettings.google.com)</a> or via the Digital Advertising Alliance consumer choice portal at <a className="text-primary underline font-medium" href="https://www.aboutads.info/choices" rel="noopener noreferrer" target="_blank">www.aboutads.info</a>.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">check_circle</span>
                        <p className="font-body-sm text-body-sm text-on-surface">
                          <strong>IAB TCF v2.2 Certified Consent Management:</strong> In the European Economic Area (EEA) and United Kingdom, we deploy a Google-certified CMP adhering strictly to the Transparency and Consent Framework (TCF v2.2). No personalized ad cookies are set prior to affirmative consent.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Section 7 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-7">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 07</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Analytics &amp; Measurement</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">7. Google Analytics 4 &amp; Consent Mode v2</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      SolveItCalculator utilizes Google Analytics 4 (GA4) with <strong>Google Consent Mode v2</strong> configured. This ensures:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className=""><strong>Dynamic Tag Firing:</strong> Analytics beacons are restricted until the user accepts the analytics storage parameter (<code className="font-data-mono text-[12px] bg-surface-container-high px-1 py-0.5 rounded">analytics_storage: 'granted'</code>).</li>
                      <li className=""><strong>Default IP Masking:</strong> IP addresses are automatically truncated and discarded by Google servers before storage occurs; raw IPs are never made accessible to SolveIt engineers.</li>
                      <li className=""><strong>Minimised Data Retention:</strong> User-level and event-level data retention in GA4 is hard-capped at <strong className="text-on-surface">14 months</strong>, after which metrics are permanently deleted.</li>
                    </ul>
                  </div>
                </article>

                {/* Section 8 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-8">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 08</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Ecosystem Interconnects</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">8. Third-Party Services &amp; External Hyperlinks</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      Our computational pages may reference statutory data or external institutional databases (such as IRS.gov, SEC EDGAR, Federal Reserve FRED, European Central Bank API). SolveIt does not control and is not liable for the privacy disclosures, TLS posture, or practices of third-party domains linked within footnotes or educational references.
                    </p>
                  </div>
                </article>

                {/* Section 9 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-9">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 09</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Commercial Disclosures</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">9. Affiliate &amp; Financial Independence Disclosures</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      In compliance with FTC guidelines (16 CFR § 255): Some informational articles or calculator results may feature contextual affiliate links (e.g. high-yield savings accounts or mortgage refinancing services). If you click through to a partner provider, we may receive compensation at zero extra expense to you. Affiliate relationships <strong>never</strong> bias formula mathematical precision, compound equations, or tax tables.
                    </p>
                  </div>
                </article>

                {/* Section 10 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-10">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 10</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Lifecycle Schedules</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">10. Data Retention &amp; Minimization</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      In concordance with the GDPR storage limitation principle (Art. 5(1)(e)), we adhere to explicit lifecycles:
                    </p>
                    <div className="p-space-md rounded-xl bg-surface-container space-y-2 font-body-sm text-body-sm">
                      <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                        <span className="font-semibold text-on-surface">Calculator Inputs &amp; Outputs:</span>
                        <span className="font-data-mono text-primary font-bold">0 Seconds (Ephemeral RAM only)</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                        <span className="font-semibold text-on-surface">Firewall Diagnostic CDN Edge Logs:</span>
                        <span className="font-data-mono text-on-surface-variant">30 Days (Rolling automated purge)</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                        <span className="font-semibold text-on-surface">Customer Support Email Logs:</span>
                        <span className="font-data-mono text-on-surface-variant">12 Months (for compliance record-keeping)</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="font-semibold text-on-surface">Aggregated Site Telemetry:</span>
                        <span className="font-data-mono text-on-surface-variant">14 Months (Google Analytics max)</span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Section 11 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-11">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 11</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Infrastructure Posture</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">11. Data Security &amp; Encryption Standards</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">We protect digital transit with modern cryptographic defense-in-depth:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li className=""><strong>Transport Layer Security (TLS 1.3):</strong> All network sessions enforce mandatory TLS 1.3 cryptographic tunnels with HSTS (HTTP Strict Transport Security) preloaded headers.</li>
                      <li className=""><strong>Content Security Policy (CSP Level 3):</strong> Strict restriction of unauthorized script execution, eliminating Cross-Site Scripting (XSS) vectors.</li>
                      <li className=""><strong>SOC-2 Aligned Edge CDN:</strong> Static assets are distributed globally via enterprise CDN tiers audited to SOC-2 Type II standards.</li>
                    </ul>
                  </div>
                </article>

                {/* Section 12 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-12">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 12</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Child Safety</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">12. Children's Online Privacy Protection (COPPA)</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      SolveItCalculator is not directed to individuals under the age of 13 (or under 16 within the EU). We do not knowingly collect, solicit, or store personally identifiable information from children. If a parent or guardian becomes aware that a child has submitted personal information, contact our privacy officer at <a className="text-primary underline" href="mailto:info@solveitcalculator.com">info@solveitcalculator.com</a> for immediate scrubbing.
                    </p>
                  </div>
                </article>

                {/* Section 13 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-13">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 13</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">European Union &amp; UK</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">13. Your Privacy Rights (GDPR &amp; UK GDPR)</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      If you are a resident of the European Economic Area (EEA) or the United Kingdom, Chapter III of the GDPR grants you comprehensive protections:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                      <div className="p-space-sm rounded-lg bg-surface-container-low">
                        <strong className="text-on-surface block mb-1">Right to Access (Art. 15)</strong>
                        <span className="text-body-sm text-on-surface-variant">Request a digital dossier of any personal telemetry tied to your IP.</span>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low">
                        <strong className="text-on-surface block mb-1">Right to Erasure (Art. 17)</strong>
                        <span className="text-body-sm text-on-surface-variant">Demand immediate deletion of support messages or preference logs.</span>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low">
                        <strong className="text-on-surface block mb-1">Right to Rectification (Art. 16)</strong>
                        <span className="text-body-sm text-on-surface-variant">Correct any inaccurate personal records maintained by our legal team.</span>
                      </div>
                      <div className="p-space-sm rounded-lg bg-surface-container-low">
                        <strong className="text-on-surface block mb-1">Right to Object &amp; Withdraw (Art. 21)</strong>
                        <span className="text-body-sm text-on-surface-variant">Revoke advertising consent instantaneously via our on-page cookie tool.</span>
                      </div>
                    </div>
                    <p className="pt-space-xs">
                      To invoke any right, email <a className="text-primary font-semibold underline" href="mailto:info@solveitcalculator.com">info@solveitcalculator.com</a>. We respond to verified requests within thirty (30) days at zero cost.
                    </p>
                  </div>
                </article>

                {/* Section 14 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-14">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 14</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">State Of California</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">14. California Privacy Rights (CCPA / CPRA Disclosures)</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      The California Consumer Privacy Act (as amended by CPRA, Cal. Civ. Code § 1798.100 et seq.) guarantees specific statutory disclosures:
                    </p>
                    <div className="p-space-md rounded-xl bg-primary/5 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined">do_not_disturb_on</span>
                        <span className="">Notice: Do Not Sell or Share My Personal Information</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface">
                        SolveItCalculator <strong className="underline">DOES NOT SELL</strong> personal information for monetary remuneration. Under California's expansive definition of "sharing" (relating to cross-context behavioral advertising), you may broadcast the Global Privacy Control (GPC) browser signal, which our systems automatically recognize and honor.
                      </p>
                    </div>
                    <div className="pt-space-xs">
                      <h4 className="font-body-md text-body-md font-semibold text-on-surface">Categories of PII Processed in Last 12 Months:</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-body-sm">
                        <li className=""><strong>Identifiers:</strong> Truncated IP address, browser cookie IDs. Sold: <em>No</em>. Shared for Behavioral Ads: <em>Only if opted-in to Google AdSense</em>.</li>
                        <li className=""><strong>Commercial / Computational:</strong> Numbers typed into calculators. Stored: <em>No</em>. Sold: <em>No</em>. Transmitted: <em>No</em>.</li>
                      </ul>
                    </div>
                  </div>
                </article>

                {/* Section 15 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-15">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 15</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Cross-Border Mechanisms</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">15. International Data Transfers &amp; SCCs</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      SolveItCalculator operates global infrastructure. When data is transferred outside the European Economic Area, we implement the European Commission's Standard Contractual Clauses (SCCs) alongside the EU-U.S. Data Privacy Framework adequacy provisions.
                    </p>
                  </div>
                </article>

                {/* Section 16 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-16">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-space-sm py-0.5 rounded-full bg-primary text-on-primary font-data-mono text-[12px] font-bold">Section 16</span>
                      <span className="px-space-sm py-0.5 rounded-full bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase font-bold tracking-wider">Interactive Tool</span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[24px]">cookie</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">16. Interactive Cookie Preference Center</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Adjust your permissions at any time. Changes take effect instantaneously across all 180+ SolveIt calculators.
                  </p>
                  
                  {/* Interactive Settings Form */}
                  <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-md">
                    {/* Preference 1: Essential */}
                    <div className="flex items-start justify-between gap-space-md pb-space-sm border-b border-outline-variant/30">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Essential Cookies &amp; DDoS Security</span>
                          <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase font-bold rounded">Always Active</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Required for core website functioning, cryptographic routing, and remembering your consent state.
                        </p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative flex items-center px-1 shrink-0 opacity-70 cursor-not-allowed">
                        <div className="w-4 h-4 rounded-full bg-surface-container-lowest shadow ml-auto"></div>
                      </div>
                    </div>
                    
                    {/* Preference 2: Functional */}
                    <div className="flex items-start justify-between gap-space-md pb-space-sm border-b border-outline-variant/30">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Calculator Functional Preferences</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary font-label-caps text-label-caps uppercase font-bold rounded">Personalized State</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Allows you to store local formula inputs, custom tax brackets, and preferred currency indicators in RAM/LocalStorage.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input checked={cookiePrefs.functional} onChange={e => setCookiePrefs(p => ({...p, functional: e.target.checked}))} className="sr-only peer" id="pref-functional" type="checkbox" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Preference 3: Analytics */}
                    <div className="flex items-start justify-between gap-space-md pb-space-sm border-b border-outline-variant/30">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Performance &amp; GA4 Telemetry</span>
                          <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase font-bold rounded">Anonymized</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Helps us diagnose broken equations and script execution bottlenecks via Google Analytics 4 Consent Mode v2.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input checked={cookiePrefs.analytics} onChange={e => setCookiePrefs(p => ({...p, analytics: e.target.checked}))} className="sr-only peer" id="pref-analytics" type="checkbox" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Preference 4: Advertising */}
                    <div className="flex items-start justify-between gap-space-md">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-body-md text-body-md font-semibold text-on-surface">Google AdSense Personalized Marketing</span>
                          <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase font-bold rounded">Ad Delivery</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Allows Google to display personalized advertisements based on non-identifiable interest vectors. If toggled off, only contextual non-personalized ads are shown.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input checked={cookiePrefs.marketing} onChange={e => setCookiePrefs(p => ({...p, marketing: e.target.checked}))} className="sr-only peer" id="pref-marketing" type="checkbox" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Save Bar */}
                    <div className="pt-space-sm flex items-center justify-between">
                      {saveState === 'saved' ? (
                        <span className="font-body-sm text-body-sm text-primary font-semibold flex items-center gap-1" id="pref-status">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span> Saved to browser localStorage!
                        </span>
                      ) : (
                        <span className="font-body-sm text-body-sm text-on-surface-variant" id="pref-status">
                          Preferences active for current session.
                        </span>
                      )}
                      <button onClick={handleSavePrefs} className={`px-space-md py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all shadow-sm flex items-center gap-1.5 ${isSavingClick ? 'scale-95' : 'active:scale-[0.98]'}`} id="save-preferences-btn">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        <span className="">Save Cookie Choices</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Section 17 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-17">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 17</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Versioning History</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">17. Changes To This Policy</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      We review this policy semi-annually. In the event of material modifications impacting how data is processed, we post a high-visibility badge on the SolveIt Calculator header for 30 consecutive calendar days.
                    </p>
                    <div className="p-space-sm rounded-lg bg-surface-container-low font-data-mono text-[12px] text-on-surface flex flex-col gap-1">
                      <span className="">• v3.4 (Current - March 2025): Added Google Consent Mode v2 &amp; CPRA Global Privacy Control disclosures.</span>
                      <span className="">• v3.0 (August 2024): Transitioned to full 100% client-side calculation architecture.</span>
                      <span className="">• v2.1 (January 2024): Updated AdSense TCF v2.2 publisher compliance clauses.</span>
                    </div>
                  </div>
                </article>

                {/* Section 18 */}
                <article className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-md scroll-mt-24" id="sec-18">
                  <div className="flex items-center justify-between">
                    <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[12px]">Section 18</span>
                    <span className="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">Direct Access</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">18. Contact Our Data Protection Officer (DPO)</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <p className="">
                      If you have inquiries, complaints, or wish to assert statutory rights regarding SolveItCalculator’s privacy commitments, our dedicated Data Protection Officer is ready to assist:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 md:col-span-2">
                        <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Electronic Legal Desk</span>
                        <a className="font-body-lg text-body-lg text-on-surface font-semibold hover:underline" href="mailto:info@solveitcalculator.com">info@solveitcalculator.com</a>
                        <span className="text-body-sm font-body-sm text-on-surface-variant">SLA: Response guaranteed within 48 business hours</span>
                      </div>
                    </div>
                  </div>
                </article>

              </div>
            </div>

            {/* Frequently Asked Privacy Questions (Accordion FAQ) */}
            <section className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-lg">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">help_center</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">User Clarity</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Frequently Asked Privacy Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Immediate answers to common mathematical privacy and ad-tracking concerns.</p>
              </div>
              <div className="flex flex-col divide-y divide-surface-container">
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-item py-space-md">
                    <button onClick={() => toggleFaq(i)} className="faq-toggle w-full flex items-center justify-between text-left group">
                      <span className="font-body-lg text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">{faq.q}</span>
                      <span className={`material-symbols-outlined text-on-surface-variant transform transition-transform duration-200 faq-icon ${openFaqs[i] ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <div className={`faq-content pt-space-sm font-body-md text-body-md text-on-surface-variant leading-relaxed ${openFaqs[i] ? 'block' : 'hidden'}`} dangerouslySetInnerHTML={{__html: faq.a}}></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
