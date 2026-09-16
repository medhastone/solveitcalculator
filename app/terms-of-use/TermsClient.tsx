"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState("section-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const tocLinks = [
    { id: "section-1", title: "1. Acceptance of Terms" },
    { id: "section-2", title: "2. Eligibility to Use the Website" },
    { id: "section-3", title: "3. Permitted Use" },
    { id: "section-4", title: "4. Prohibited Activities" },
    { id: "section-5", title: "5. Calculator Results Disclaimer", className: "font-semibold text-primary" },
    { id: "section-6", title: "6. Educational & Informational Purpose" },
    { id: "section-7", title: "7. No Professional Advice", className: "font-semibold text-primary" },
    { id: "section-8", title: "8. Financial, Tax & Investment Disclaimer" },
    { id: "section-9", title: "9. Accuracy of Information" },
    { id: "section-10", title: "10. User Responsibilities" },
    { id: "section-11", title: "11. Intellectual Property Rights" },
    { id: "section-12", title: "12. Third-Party Links & Services" },
    { id: "section-13", title: "13. Advertising & Sponsored Content" },
    { id: "section-14", title: "14. Google AdSense & Advertising", className: "font-semibold text-primary" },
    { id: "section-15", title: "15. Feedback & Suggestions" },
    { id: "section-16", title: "16. Limitation of Liability", className: "font-semibold text-primary" },
    { id: "section-17", title: "17. No Warranty (\"As-Is\" Basis)" },
    { id: "section-18", title: "18. Indemnification" },
    { id: "section-19", title: "19. Privacy Policy Reference" },
    { id: "section-20", title: "20. International Users" },
    { id: "section-21", title: "21. Service Availability" },
    { id: "section-22", title: "22. Website Changes & Updates" },
    { id: "section-23", title: "23. Suspension or Termination of Access" },
    { id: "section-24", title: "24. Governing Principles & Disputes" },
    { id: "section-25", title: "25. Contact Information" },
    { id: "section-26", title: "26. Changes to These Terms" },
    { id: "section-27", title: "27. Effective & Last Updated Date" },
  ];

  const faqs = [
    { q: "Are the calculator results guaranteed to be 100% accurate?", a: "No. Calculator outputs are intended strictly as mathematical simulations and theoretical estimates. While we build upon rigorous standard mathematical principles, real-world financial contracts, mortgage rates, tax assessments, and loan underwriting reflect variables, underwriting adjustments, and local tax schedules that our general-purpose client-side calculators cannot simulate. Always verify outputs with certified professionals or lending institutions." },
    { q: "Does using SolveItCalculator create a financial advisor or attorney relationship?", a: "No. Using SolveItCalculator.com does not establish an attorney-client, CPA-client, investment advisor, broker, or fiduciary relationship of any nature. The site operates solely as a self-service interactive computational directory." },
    { q: "Why does the website display advertisements?", a: "SolveItCalculator.com is committed to keeping all 180+ interactive calculators accessible to everyone without recurring software fees, subscriptions, or paywalls. Third-party advertising partners, notably Google AdSense, provide the operational revenue required for server infrastructure, ongoing formula validation, and continuous user experience development." },
    { q: "Can I use calculator results in commercial reports or presentations?", a: "Yes, you may cite computational figures or summary charts generated during your sessions within personal, academic, or internal commercial reports, provided you do not misrepresent the outputs as certified financial audits or legally binding commercial quotes. You may not scrape, frame, or republish our software engines or underlying code into external platforms." },
    { q: "How can I contact the website administration regarding these Terms?", a: "For any questions, legal clarifications, or algorithmic notices regarding our terms and policies, you can reach out directly to our administration team at <a class=\"text-primary font-semibold hover:underline\" href=\"mailto:info@solveitcalculator.com\">info@solveitcalculator.com</a>." }
  ];

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocLinks.map((l) => document.getElementById(l.id)).filter(Boolean);
      const scrollPos = window.scrollY + 140;
      let current = sections[0];
      sections.forEach((sec) => {
        if (sec && sec.offsetTop <= scrollPos) {
          current = sec;
        }
      });
      if (current) {
        setActiveSection(current.id);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 800);
  };

  const handleDownloadSummary = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.print(); // Using native print as PDF generator
      setIsDownloading(false);
    }, 800);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredLinks = tocLinks.filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full pt-16 bg-surface flex-1">
      <div className="flex flex-col w-full">
        {/* Subtle Ambient Glow Overlay */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-80 -left-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Main Canvas Wrapper */}
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl lg:py-space-2xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant mb-space-lg">
              <Link className="font-body-sm text-body-sm hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline/40">/</span>
              <span className="font-body-sm text-body-sm text-primary font-semibold">Terms of Use</span>
            </nav>

            {/* Document Header & Meta Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg lg:p-space-xl mb-space-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-space-lg">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-wider mb-space-md">
                    <span className="material-symbols-outlined text-[14px]">gavel</span>
                    <span>Legal Agreement &amp; User Guidelines · Global Compliance</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-space-sm">
                    Terms of Use
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-lg">
                    Clear, transparent, and fair guidelines governing your access to SolveItCalculator.com. Learn about our client-side calculations, educational disclaimers, advertising disclosures, and permitted use.
                  </p>

                  {/* Metadata Strip */}
                  <div className="flex flex-wrap items-center gap-y-space-xs gap-x-space-md pt-space-xs text-on-surface-variant font-data-mono text-body-sm">
                    <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-space-xs py-1 rounded">
                      <span className="material-symbols-outlined text-[15px] text-primary">update</span>
                      <span>Last Updated: September 14, 2026</span>
                    </span>
                  </div>
                </div>

                {/* Document Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-space-xs shrink-0 self-start">
                  <button onClick={handlePrint} className={`inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs bg-primary text-on-primary font-body-sm text-body-sm font-semibold rounded-lg shadow-sm hover:opacity-95 active:scale-[0.98] transition-all ${isPrinting ? 'opacity-80' : ''}`}>
                    {isPrinting ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                        <span>Preparing...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">print</span>
                        <span>Print Terms</span>
                      </>
                    )}
                  </button>
                  <button onClick={handleDownloadSummary} className={`inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs bg-surface-container-low text-on-surface font-body-sm text-body-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors ${isDownloading ? 'opacity-80' : ''}`}>
                    {isDownloading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px] text-secondary">picture_as_pdf</span>
                        <span>Download Summary</span>
                      </>
                    )}
                  </button>
                  <Link className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest text-primary font-body-sm text-body-sm font-medium rounded-lg hover:bg-surface-container-low transition-colors" href="/privacy">
                    <span className="material-symbols-outlined text-[18px]">privacy_tip</span>
                    <span>Privacy Policy</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Trust Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-2xl">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">lock_open</span>
                </div>
                <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">100% Free &amp; Open</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No mandatory registration, gated calculation tiers, paywalls, or hidden recurring software licensing charges.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">Informational Estimates</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  All algorithms are strictly engineered for illustration, academic evaluation, and preliminary model testing.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">memory</span>
                </div>
                <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">Client-Side Compute</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Zero server logging of personal financial inputs, amortizations, or user-supplied numerical figures.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[22px]">ad_units</span>
                </div>
                <h2 className="font-headline-md text-body-lg font-semibold text-on-surface">Transparent Ad Model</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Funded respectfully via compliant third-party Google AdSense banners to sustain platform maintenance freely.
                </p>
              </div>
            </div>

            {/* 2-Column Main Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Sidebar: Sticky Filterable Table of Contents */}
              <aside className="lg:col-span-4 sticky top-20 flex flex-col gap-space-md">
                <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col max-h-[calc(100vh-6rem)]">
                  <div className="flex items-center justify-between pb-space-xs mb-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">list_alt</span>
                      <span>Document Outline</span>
                    </span>
                    <span className="font-data-mono text-body-sm text-outline">
                      {filteredLinks.length} Clauses
                    </span>
                  </div>

                  {/* TOC Search / Filter */}
                  <div className="relative mb-space-xs">
                    <span className="material-symbols-outlined absolute left-space-xs top-2 text-outline text-[18px]">search</span>
                    <input
                      className="w-full pl-8 pr-space-xs py-1.5 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg outline-none focus:bg-surface-container-high transition-colors placeholder:text-outline/70"
                      placeholder="Filter terms sections..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Scrollable Navigation Items */}
                  <nav className="overflow-y-auto space-y-0.5 pr-1 text-on-surface-variant font-body-sm text-body-sm">
                    {filteredLinks.map((link) => (
                      <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`block px-space-xs py-1.5 rounded transition-colors truncate ${
                          activeSection === link.id
                            ? "bg-surface-container-low text-primary"
                            : "hover:bg-surface-container-low hover:text-primary"
                        } ${link.className || ""}`}
                      >
                        {link.title}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Quick Assistance Card */}
                <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[20px]">help</span>
                    <span className="font-headline-md text-body-md font-semibold">Inquiries &amp; Support</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Have a legal interpretation query, academic verification inquiry, or copyright concern?
                  </p>
                  <a className="inline-flex items-center gap-1.5 font-data-mono text-body-sm text-primary font-semibold hover:underline mt-space-2xs" href="mailto:info@solveitcalculator.com">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>info@solveitcalculator.com</span>
                  </a>
                </div>
              </aside>

              {/* Right Column: Full Legal Clauses */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                
                {/* Section 1 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-1">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 01</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Binding Agreement</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">1. Acceptance of Terms</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      By visiting, accessing, browsing, interacting with, or utilizing any numerical calculation engine, formula module, data sheet, or interactive visual model offered on <strong>SolveItCalculator.com</strong> (referred to herein as the “Website”, “Platform”, “we”, “us”, or “our”), you (“User”, “you”, or “your”) unconditionally acknowledge, agree to, and are legally bound by these Terms of Use.
                    </p>
                    <p>
                      If you do not agree with any provision, statement, disclaimer, or limitation set forth in these Terms of Use, you must immediately cease all use of SolveItCalculator.com. Continued interaction with any tool signifies full and irrevocable acceptance.
                    </p>
                  </div>
                </article>

                {/* Section 2 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-2">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 02</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">User Qualifications</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">2. Eligibility to Use the Website</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      SolveItCalculator.com is intended exclusively for individuals who have reached the age of majority in their respective legal jurisdiction, or who access the site under the active guidance and consent of a parent or legal guardian.
                    </p>
                    <p>
                      By accessing this platform, you affirm that you hold full legal competence and authority to enter into the agreements, representations, obligations, and acknowledgments documented herein.
                    </p>
                  </div>
                </article>

                {/* Section 3 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-3">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 03</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Scope of Rights</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">3. Permitted Use</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      You are granted a revocable, non-exclusive, non-transferable, and royalty-free limited license to utilize SolveItCalculator.com solely for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Personal, non-commercial educational calculation and mathematical exploration.</li>
                      <li>Preliminary financial planning, personal loan estimation, and budgetary modeling.</li>
                      <li>Classroom or academic demonstration, scientific reference, and conceptual analysis.</li>
                      <li>Exporting mathematical summaries generated purely through client-side sessions for your private records.</li>
                    </ul>
                  </div>
                </article>

                {/* Section 4 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-4">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 04</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Enforcement</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">4. Prohibited Activities</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>When utilizing SolveItCalculator.com, you expressly covenant not to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-2xs">
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-xs">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">block</span>
                        <span className="font-body-sm text-body-sm">Scrape, harvest, mirror, or systematically clone calculator logic, client-side formulas, or UI assets via automated bots, crawlers, or headless scripts.</span>
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-xs">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">block</span>
                        <span className="font-body-sm text-body-sm">Circumvent, inject malicious payloads, probe, or tamper with script bundles, advertising delivery slots, or security headers.</span>
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-xs">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">block</span>
                        <span className="font-body-sm text-body-sm">Frame, replicate, or white-label any portion of the platform within external commercial applications without prior explicit written agreement.</span>
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-xs">
                        <span className="material-symbols-outlined text-error text-[20px] shrink-0">block</span>
                        <span className="font-body-sm text-body-sm">Misrepresent outputs as legally certified tax returns, binding institutional lending agreements, or accredited engineering declarations.</span>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Section 5: High-Impact Callout Box */}
                <article className="bg-surface-container-low p-space-lg rounded-xl shadow-md scroll-mt-24" id="section-5">
                  <div className="flex items-center gap-space-xs text-primary mb-space-xs">
                    <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">Important Calculator Disclosure</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">5. Calculator Results Disclaimer</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
                      <p className="font-body-md text-body-md text-on-surface font-semibold mb-1">
                        Theoretical Estimates Only — Not Commercial Offers:
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        All mathematical calculators, amortization schedules, compound interest simulations, tax estimations, and unit converters published on <strong>SolveItCalculator.com</strong> are algorithmic simulations. They reflect theoretical mathematical formulas under generalized assumptions and idealized conditions. Real-world financial institutions, government taxing authorities, mortgage underwriters, and commercial loan originators apply proprietary underwriting, regional tax brackets, escrow variables, insurance indexes, closing costs, and daily interest compounding adjustments that will diverge from these estimates.
                      </p>
                    </div>
                    <p>
                      SolveItCalculator.com provides these computation modules strictly for baseline planning. We disclaim all responsibility for variations between our mathematical estimations and actual contractual statements issued by certified banking, loan, or fiscal authorities.
                    </p>
                  </div>
                </article>

                {/* Section 6 & 7 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-6">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 06 &amp; 07</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Professional Boundaries</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">6. Educational &amp; Informational Purpose · 7. No Professional Advice</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-md leading-relaxed" id="section-7">
                    <p>
                      All calculators, instructional explainers, methodology tables, and accompanying guides on SolveItCalculator.com are assembled strictly for educational, informational, and reference purposes.
                    </p>
                    {/* Callout: No Professional-Client Relationship */}
                    <div className="bg-primary/5 p-space-md rounded-xl">
                      <div className="flex items-center gap-space-xs text-primary mb-1">
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                        <span className="font-label-caps text-label-caps uppercase font-bold tracking-wide">No Professional-Client Relationship Formed</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                        Using, consulting, or relying upon SolveItCalculator.com does <strong>not</strong> establish a certified public accountant (CPA)-client, attorney-client, chartered financial analyst (CFA)-client, broker, or fiduciary relationship of any kind. You must consult a licensed attorney, tax specialist, certified financial planner, or accredited professional before executing real estate transactions, tax filings, refinancing, or portfolio allocations.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Section 8 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-8">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 08</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Fiscal Disclaimer</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">8. Financial, Tax &amp; Investment Disclaimer</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      Past historical investment returns, standard compound annual growth rates (CAGR), and fixed inflation projections configured in our modules do not predict or guarantee future performance. Tax laws, standard deductions, bonus tax withholdings, and capital gains thresholds are subject to frequent legislative amendments across national, state, and municipal entities. SolveItCalculator does not warrant that fiscal parameters reflect current tax codes in your municipal district.
                    </p>
                  </div>
                </article>

                {/* Section 9 & 10 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-9">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 09 &amp; 10</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Accuracy &amp; Conduct</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">9. Accuracy of Information · 10. User Responsibilities</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed" id="section-10">
                    <p>
                      While we continuously test, audit, and benchmark algorithmic models against standard IEEE and standard actuarial formulas, unintentional typographic, mathematical, or programmatic discrepancies may arise.
                    </p>
                    <p>
                      <strong>User Responsibilities:</strong> You assume total responsibility for verifying the accuracy of figures, checking formula assumptions, inputting valid numerical parameters, and confirming computational outputs with primary official sources prior to signing binding legal or commercial agreements.
                    </p>
                  </div>
                </article>

                {/* Section 11 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-11">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 11</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Ownership</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">11. Intellectual Property Rights</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      All proprietary design systems, interface component layouts, brand marks, logos, vector icons, custom JavaScript formula libraries, stylesheet configurations, and editorial explanatory write-ups on SolveItCalculator.com are the exclusive intellectual property of SolveItCalculator and are protected by international copyright, trademark, and trade secret laws.
                    </p>
                    <p>
                      Unpermitted republication, commercial redistribution, or extraction of code routines without prior express written authorization is strictly prohibited.
                    </p>
                  </div>
                </article>

                {/* Section 12 & 13 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-12">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 12 &amp; 13</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Third Parties</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">12. Third-Party Links · 13. Advertising &amp; Sponsored Content</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed" id="section-13">
                    <p>
                      SolveItCalculator.com may display outbound hyperlinks directing users to external websites, government tax documentation portals, academic resources, or third-party web services. We do not inspect, endorse, administer, or guarantee the content, reliability, security policies, or practices of third-party domains.
                    </p>
                    <p>
                      Navigating to external resources occurs entirely at your own volition and discretion, subject to the external website's respective legal conditions.
                    </p>
                  </div>
                </article>

                {/* Section 14: High Impact Callout: Google AdSense */}
                <article className="bg-surface-container-low p-space-lg rounded-xl shadow-md scroll-mt-24" id="section-14">
                  <div className="flex items-center gap-space-xs text-secondary mb-space-xs">
                    <span className="material-symbols-outlined text-[24px]">verified_user</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">Mandatory Ad Disclosure</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">14. Google AdSense &amp; Third-Party Advertising</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed">
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-space-xs">
                      <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                        SolveItCalculator.com collaborates with <strong>Google AdSense</strong> and authorized programmatic advertising networks to serve dynamic advertisements across select pages. These partner platforms use digital identifiers and HTTP cookies to display contextual or interest-based ads aligned with browsing behavior across the web.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xs pt-space-xs">
                        <div className="bg-surface-container-low p-space-xs rounded font-body-sm text-body-sm">
                          <strong className="text-on-surface block mb-0.5">Zero Endorsement</strong>
                          Ad banners reflect third-party advertisers. SolveItCalculator does not evaluate, certify, or endorse products displayed.
                        </div>
                        <div className="bg-surface-container-low p-space-xs rounded font-body-sm text-body-sm">
                          <strong className="text-on-surface block mb-0.5">User Discretion</strong>
                          Engaging with an advertisement creates a relationship solely between you and that commercial merchant.
                        </div>
                        <div className="bg-surface-container-low p-space-xs rounded font-body-sm text-body-sm">
                          <strong className="text-on-surface block mb-0.5">Cookie Controls</strong>
                          Manage ad preferences anytime via <a className="text-primary hover:underline font-semibold" href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">Google Ads Settings</a>.
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Section 15 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-15">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 15</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Community Inputs</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">15. User-Generated Feedback &amp; Suggestions</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      If you elect to transmit voluntary suggestions, algorithmic enhancement proposals, correction notifications, or bug reports via our published communication channels, you grant SolveItCalculator a perpetual, worldwide, irrevocable, royalty-free license to utilize, adopt, and integrate such feedback without obligation of attribution or financial compensation.
                    </p>
                  </div>
                </article>

                {/* Section 16 & 17 */}
                <article className="bg-surface-container-low p-space-lg rounded-xl shadow-md scroll-mt-24" id="section-16">
                  <div className="flex items-center gap-space-xs text-error mb-space-xs">
                    <span className="material-symbols-outlined text-[24px]">gavel</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">Legal Shield &amp; Risk Allocation</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">16. Limitation of Liability · 17. No Warranty ("As-Is" Basis)</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-sm leading-relaxed" id="section-17">
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm space-y-space-xs">
                      <p className="font-label-caps text-label-caps uppercase text-error font-bold tracking-wider">
                        Important Universal Exclusion
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface uppercase font-medium tracking-tight">
                        TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, SOLVEITCALCULATOR.COM AND ITS OPERATORS PROVIDE ALL SERVICES, CALCULATORS, METRICS, AND CONTENT STRICTLY ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Under no circumstances shall SolveItCalculator, its developers, or contributors be held liable for any direct, indirect, incidental, consequential, special, punitive, or exemplary damages—including, but not limited to, loss of profits, investment losses, computational rounding variances, data corruption, commercial downtime, or reliance damages—arising out of or related to your use, inability to use, or reliance on mathematical calculations provided through this platform.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Section 18 & 19 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-18">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 18 &amp; 19</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Protection &amp; Privacy</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">18. Indemnification · 19. Privacy Policy Reference</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed" id="section-19">
                    <p>
                      You agree to defend, indemnify, and hold harmless SolveItCalculator and its operators from and against any claims, liabilities, losses, judgments, demands, or costs (including standard legal fees) resulting from your violation of these Terms of Use, misuse of calculation engines, or infringement of any third-party right.
                    </p>
                    <p>
                      <strong>Privacy Protocol:</strong> Our practices concerning user privacy, local storage caching, client-side data isolation, and Google analytics are detailed in full within our standalone <Link href="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
                    </p>
                  </div>
                </article>

                {/* Section 20 & 21 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-20">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 20 &amp; 21</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Operation Scope</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">20. International Users · 21. Service Availability</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed" id="section-21">
                    <p>
                      SolveItCalculator.com is administered globally. Users who access this platform from jurisdictions with differing legal standards, currency regimes, or data privacy statutes do so voluntarily and remain solely responsible for adherence to local statutory mandates.
                    </p>
                    <p>
                      We strive for continuous, high-speed platform availability, but make no guarantees of uninterrupted, defect-free, or zero-latency service. We reserve the right to temporarily suspend operations for maintenance, server patching, or infrastructure enhancements without advance notification.
                    </p>
                  </div>
                </article>

                {/* Section 22 & 23 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-22">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 22 &amp; 23</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Evolution &amp; Access</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">22. Website Changes · 23. Suspension of Access</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed" id="section-23">
                    <p>
                      We reserve the discretionary prerogative to expand, modify, update, replace, deprecate, or withdraw any calculator algorithm, tool interface, or dataset at any juncture without incurring liability to any user.
                    </p>
                    <p>
                      We also preserve the right to restrict or terminate access to SolveItCalculator.com for any user who engages in automated harvesting, denial-of-service abuse, or breaches these established Terms.
                    </p>
                  </div>
                </article>

                {/* Section 24 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-24">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 24</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Resolution</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">24. Governing Principles &amp; Dispute Resolution</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed">
                    <p>
                      These Terms of Use shall be interpreted under standard principles of contractual equity and fair electronic commerce. In the event of any question, misunderstanding, or disagreement arising from the use of SolveItCalculator.com, you agree to first pursue amicable, informal communication by contacting platform administration directly at info@solveitcalculator.com before initiating adversarial formal legal procedures.
                    </p>
                  </div>
                </article>

                {/* Section 25, 26, 27 */}
                <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm scroll-mt-24" id="section-25">
                  <div className="flex items-center gap-space-2xs mb-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps uppercase">Section 25 – 27</span>
                    <span className="text-outline/40">•</span>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Contact &amp; Amendments</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-xs">25. Contact · 26. Changes to Terms · 27. Effective Date</h3>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-space-xs leading-relaxed" id="section-26">
                    <p id="section-27">
                      We hold the right to amend, revise, or replace these Terms of Use at our sole discretion. Any revisions take effect immediately upon their publication on this page, indicated by the refreshed “Last Updated” timestamp.
                    </p>
                    <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm mt-space-xs">
                      <div>
                        <span className="font-label-caps text-label-caps uppercase text-outline block">Administrative Official Channel</span>
                        <a className="font-data-mono text-body-md font-semibold text-primary hover:underline" href="mailto:info@solveitcalculator.com">info@solveitcalculator.com</a>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="font-label-caps text-label-caps uppercase text-outline block">Last Updated</span>
                        <span className="font-data-mono text-body-sm text-on-surface">September 14, 2026</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* FAQ Section */}
            <section className="mt-space-2xl bg-surface-container-lowest rounded-xl shadow-sm p-space-lg lg:p-space-xl">
              <div className="max-w-3xl mb-space-lg">
                <div className="inline-flex items-center gap-space-2xs px-space-xs py-1 rounded-full bg-surface-container-low text-primary font-label-caps text-label-caps uppercase mb-space-xs">
                  <span className="material-symbols-outlined text-[14px]">quiz</span>
                  <span>Clarifications</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Frequently Asked Questions About Our Terms
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Concise answers to common queries regarding calculations, commercial utilization, and legal boundaries.
                </p>
              </div>
              <div className="space-y-space-xs">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-surface-container-low rounded-lg overflow-hidden">
                    <button onClick={() => toggleFaq(i)} className="faq-toggle w-full p-space-md text-left flex items-center justify-between gap-space-md font-body-lg text-body-lg font-semibold text-on-surface hover:bg-surface-container transition-colors group">
                      <span>{faq.q}</span>
                      <span className={`material-symbols-outlined text-outline transition-transform duration-200 shrink-0 ${openFaqs[i] ? "rotate-180" : ""}`}>expand_more</span>
                    </button>
                    <div className={`faq-content px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant leading-relaxed ${openFaqs[i] ? "block" : "hidden"}`} dangerouslySetInnerHTML={{ __html: faq.a }}></div>
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
