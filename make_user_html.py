import sys

# We will write the exact HTML sections from user's message
content = '''<!-- INVESTOR HEAD-TO-HEAD COMPARISON GUIDES -->
<section class="mb-space-3xl">
<div class="flex flex-col mb-space-lg">
<span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Analytical Decision Frameworks</span>
<h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">Investor Head-to-Head Comparisons</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Empirical trade-off analyses backed by historical market data and tax efficiencies.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">VEHICLE STRUCTURE</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">ETF vs Mutual Fund</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              ETFs provide superior tax efficiency through authorized participant "in-kind" creation/redemption mechanisms, eliminating internal capital gains distributions inherent to open-end mutual funds.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Winner: <strong>ETFs</strong> for taxable brokerage; mutual funds for automated fractional dollar buying in 401(k)s.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">STRATEGY PROFILE</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Dividend vs Growth</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Dividends generate predictable, tangible cash flow but trigger tax drag each taxable year. Growth stocks retain 100% of cash flows for capital compounding, deferring realization until liquidation.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Winner: <strong>Growth</strong> during accumulation; <strong>Dividends</strong> during post-retirement decumulation.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">CAPITAL ALLOCATION</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Lump Sum vs DCA</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Vanguard research demonstrates Lump Sum investing outperforms Dollar-Cost Averaging approximately 68% of the time across 10-year rolling windows, because equity markets trend upward historically.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Empirical Math: <strong>Lump Sum</strong> maximizes expected return; <strong>DCA</strong> reduces regret &amp; sequence anxiety.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">RETIREMENT HORIZON</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">FIRE vs Traditional</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Traditional models plan for age 65 retirement with 4% SWR across a 30-year horizon. FIRE models (ages 35-50) require conservative 3.25%-3.5% withdrawal rates to survive 50+ year market spans.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Core Metric: <strong>Savings Rate</strong>. Traditional targets 15%; FIRE requires 50%-70% net savings.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">ASSET CLASS</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Real Estate vs Index Stocks</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Physical real estate unlocks 4:1 mortgage leverage and depreciation write-offs, but incurs illiquidity and maintenance friction. S&amp;P 500 index funds offer zero effort, instantaneous liquidity, and 10% CAGR.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Factor: <strong>Leverage</strong> boosts property IRR; <strong>Index Stocks</strong> maximize passive time autonomy.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">MANAGEMENT STYLE</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Active vs Passive Index</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              SPIVA scorecard data indicates over 90% of actively managed large-cap mutual funds fail to beat their benchmark S&amp;P 500 index over a 15-year period after accounting for management fee friction.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Result: <strong>Passive Indexing</strong> wins mathematically across 9 out of 10 long-term portfolios.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">TAX ARBITRAGE</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Roth IRA vs Traditional</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Traditional contributions deduct today and tax upon distribution. Roth accounts fund with post-tax dollars, compounding 100% tax-free forever with zero mandatory minimum distributions (RMDs).
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Rule: <strong>Roth</strong> if current bracket is lower than retirement; <strong>Traditional</strong> if currently in top tax brackets.
          </div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div class="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span class="text-primary font-semibold">SECURITY SELECTION</span>
<span class="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Single Stocks vs ETFs</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Single equities possess idiosyncratic bankruptcy risk. Index ETFs diversify across 500+ enterprises, eradicating non-systematic individual corporate fraud while capturing macroscopic global GDP growth.
            </p>
</div>
<div class="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Verdict: Hold <strong>ETFs for core 80%-90%</strong>; allocate max 10% for high-conviction individual stock bets.
          </div>
</div>
</div>
</section>
<!-- CORE MATHEMATICAL FORMULAS REFERENCE -->
<section class="mb-space-3xl">
<div class="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-xl">
<div class="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-xs">
<div>
<span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Actuarial Transparency</span>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">Core Mathematical Foundations</h2>
</div>
<div class="inline-flex items-center gap-1 font-data-mono text-xs text-on-surface-variant bg-surface-container-low px-space-xs py-1 rounded">
<span class="material-symbols-outlined text-[16px] text-primary">functions</span>
<span class="">Deterministic Computational Models</span>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
<div class="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span class="font-label-caps text-label-caps uppercase text-primary block mb-1">Future Value (Annuity + Principal)</span>
<div class="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                FV = PV(1 + r/n)<sup>nt</sup> + PMT × [((1 + r/n)<sup>nt</sup> - 1) / (r/n)]
              </div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Standard formula modeling compounding growth of initial principal (PV) alongside recurring periodic deposits (PMT) at interest rate (r) across (t) years.
              </p>
</div>
<div class="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: Investment Calculator, Future Value
            </div>
</div>
<div class="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span class="font-label-caps text-label-caps uppercase text-secondary block mb-1">Compound Annual Growth (CAGR)</span>
<div class="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                CAGR = (EV / BV)<sup>(1/n)</sup> - 1
              </div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Measures smoothed geometric annual growth rate over multiple holding years, filtering out the distortion of year-to-year extreme market volatility.
              </p>
</div>
<div class="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: Stock CAGR, Performance Models
            </div>
</div>
<div class="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span class="font-label-caps text-label-caps uppercase text-primary-container block mb-1">Continuous Compounding</span>
<div class="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                A = P × e<sup>(rt)</sup>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Computes absolute mathematical ceiling of compounding where reinvestment frequency (n) approaches infinity via Euler's mathematical constant e ≈ 2.71828.
              </p>
</div>
<div class="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: Continuous Compound Calculator
            </div>
</div>
<div class="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span class="font-label-caps text-label-caps uppercase text-tertiary block mb-1">Safe Withdrawal &amp; Rule of 72</span>
<div class="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                FIRE # = Annual Expenses / SWR<br>
                Doubling Years ≈ 72 / Return Rate
              </div>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Trinity Study safe withdrawal equation determining portfolio perpetuity, paired with the Rule of 72 heuristic estimating asset doubling time.
              </p>
</div>
<div class="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: FIRE Models, Retirement Nest Egg
            </div>
</div>
</div>
</div>
</section>
<!-- PROGRAMMATIC DIRECTORY HUB (SEO Deep Links) -->
<section class="mb-space-3xl">
<div class="flex flex-col mb-space-md">
<span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Programmatic Computational Directory</span>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">Curated Matrix Hubs &amp; Direct Calculators</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<!-- Frequency Hub -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div class="flex items-center gap-2 mb-space-xs">
<span class="material-symbols-outlined text-primary text-[20px]">tune</span>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Compound Frequency Matrices</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Direct calculation endpoints calibrated by compounding recurrence intervals:</p>
<ul class="space-y-1.5 font-data-mono text-xs">
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/compound-interest/daily</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/compound-interest/monthly</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/compound-interest/quarterly</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/compound-interest/annual</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
</ul>
</div>
<!-- FIRE Milestones Hub -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div class="flex items-center gap-2 mb-space-xs">
<span class="material-symbols-outlined text-primary text-[20px]">local_fire_department</span>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">FIRE Milestone Pages</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Specialized early retirement architectures and withdrawal benchmarks:</p>
<ul class="space-y-1.5 font-data-mono text-xs">
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/fire-calculator/coast-fire</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/fire-calculator/barista-fire</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/fire-calculator/lean-fire</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/fire-calculator/fat-fire</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
</ul>
</div>
<!-- Capital Dollar Milestones -->
<div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div class="flex items-center gap-2 mb-space-xs">
<span class="material-symbols-outlined text-primary text-[20px]">pin_invoke</span>
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Capital Milestones</h3>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Pre-calculated wealth growth trajectories from baseline principal amounts:</p>
<ul class="space-y-1.5 font-data-mono text-xs">
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/investment-growth/10000-principal</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/investment-growth/50000-principal</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/investment-growth/100000-principal</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li class="">
<a class="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span class="">/investment-growth/1000000-milestone</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
</ul>
</div>
</div>
</section>
<!-- GOOGLE AI OVERVIEW & DIRECT ANSWERS BOX -->
<section class="mb-space-3xl">
<div class="bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-sm">
<div class="flex items-center gap-2 mb-space-md">
<span class="p-1 rounded bg-primary text-on-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">auto_awesome</span>
</span>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">Direct Answers &amp; High-Cognition Overview</h2>
</div>
<div class="space-y-space-md">
<div class="bg-surface-container-lowest p-space-md rounded-lg">
<h3 class="font-body-lg text-body-lg font-bold text-on-surface mb-1">
              How does compound interest accelerate long-term personal wealth?
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant">
              Compound interest generates "interest on interest." Unlike linear growth—where returns apply solely to original principal—compounding reinvests generated yields back into the asset base. Over a 20 to 30-year horizon at an 8% to 10% annual return, more than <strong>70% of terminal portfolio wealth</strong> originates from compound earnings rather than out-of-pocket deposits.
            </p>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-lg">
<h3 class="font-body-lg text-body-lg font-bold text-on-surface mb-1">
              What is the difference between nominal returns and real (inflation-adjusted) returns?
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant">
<strong>Nominal return</strong> is the unadjusted percentage gain reported on brokerage statements (e.g. 10% on the S&amp;P 500). <strong>Real return</strong> accounts for the erosive effect of inflation via the Fisher equation: <em>(1 + Nominal) = (1 + Real)(1 + Inflation)</em>. If inflation averages 2.5%, a 10% nominal return provides approximately 7.3% in real purchasing power expansion.
            </p>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-lg">
<h3 class="font-body-lg text-body-lg font-bold text-on-surface mb-1">
              How much money do you need to retire early under the FIRE movement?
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant">
              Under the classic FIRE movement framework based on the Trinity Study, you require <strong>25 to 30 times your annual expected expenditures</strong>. For example, sustaining $60,000 in annual post-tax expenses requires a portfolio target of $1,500,000 (at a 4% safe withdrawal rate) or $1,714,000 (at a conservative 3.5% early retirement withdrawal rate).
            </p>
</div>
</div>
</div>
</section>
<!-- 20+ DETAILED INVESTOR FAQ ACCORDIONS -->
<section class="mb-space-3xl">
<div class="flex flex-col mb-space-lg">
<span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Investor Knowledge Base</span>
<h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">Frequently Asked Questions</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Concise, authoritative answers addressing taxation, compound mechanics, asset allocation, and decumulation.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<!-- Column 1 -->
<div class="space-y-space-xs">
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is CAGR and why is it preferred over simple average return?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              CAGR (Compound Annual Growth Rate) represents the smoothed annual rate at which an investment would have grown if it grew at a steady constant rate. Simple averages inflate real returns because they ignore the asymmetry of losses: a -50% loss followed by a +50% gain yields a 0% simple average, but results in a -25% actual net portfolio loss.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is the 4% Safe Withdrawal Rule (SWR)?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Originating from William Bengen and updated by the Trinity Study, the rule asserts that a retiree withdrawing 4% of their balanced portfolio during Year 1, and adjusting that exact dollar amount for inflation each subsequent year, has a 95%+ probability of not exhausting capital over a 30-year span.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">How does dividend tax drag impact long-term compounding?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              In taxable accounts, qualified dividends incur 15% to 20% federal taxes plus NIIT (3.8%) in the exact tax year received, even if automatically reinvested via DRIP. Over 30 years, this yearly tax leakage can reduce total wealth accumulation by 15% to 25% compared to holding pure capital growth index ETFs.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is Coast FIRE vs Barista FIRE?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>Coast FIRE</strong> means having enough already invested at a young age that compound interest alone will fully fund traditional retirement at 65 without another cent deposited. <strong>Barista FIRE</strong> means having a partial portfolio that covers a portion of overhead, requiring low-stress part-time work to pay the remainder.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">How often should an investment portfolio be rebalanced?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Empirical institutional research recommends rebalancing either on a set annual schedule (e.g., every January) or via "tolerance bands" (whenever an asset class deviates by more than 5% absolute from its targeted weight). Rebalancing more frequently creates excessive transaction friction and taxable turnover.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is sequence of returns risk (SRR)?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              SRR is the danger that market crashes occur during the first 3 to 5 years immediately preceding or following retirement. Liquidating equities while values are depressed severely locks in losses and permanently cripples the longevity of the portfolio, even if average market returns recover later.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">Why do expense ratios matter so much in index ETFs?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              A 0.75% expense ratio compared to a 0.03% ETF fee on a $500,000 portfolio over 30 years forfeits over $185,000 in terminal wealth due to lost compounding. Expense ratios are deducted automatically every day regardless of whether market prices go up or down.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is the Rule of 72?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              The Rule of 72 is a rapid mental shortcut to estimate how many years it takes an asset to double at a fixed annual rate of return: <em>Years to double ≈ 72 / Interest Rate</em>. At 8% CAGR, an asset doubles in 9 years (72/8). At 10%, it doubles in approximately 7.2 years.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is Yield on Cost (YOC) vs Current Yield?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>Current yield</strong> is dividend payout divided by current stock price. <strong>Yield on cost</strong> is dividend payout divided by your original buy price. If you bought shares at $50 paying $2 (4% yield) and the dividend rises over 10 years to $5 while the stock hits $150, your Current Yield is 3.3%, but your Yield on Cost is 10.0%.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">How does asset allocation change as you age?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Modern financial planning generally recommends a glidepath shifting from equity-heavy (90/10 or 100/0) in your 20s and 30s toward a balanced configuration (60/40 or 70/30) approaching retirement to curtail drawdowns and sequence risk.
            </p>
</details>
</div>
<!-- Column 2 -->
<div class="space-y-space-xs">
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">Does daily compounding yield significantly more than monthly?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              No. Due to the properties of Euler's limit (e), the difference between monthly compounding and daily compounding on a $100,000 balance at 7% over 20 years is less than $450 in total. Compounding rate (CAGR) matters infinitely more than compounding frequency.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is dollar-cost averaging (DCA)?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              DCA is the practice of investing a fixed dollar amount at regular intervals (e.g. $500 every two weeks) regardless of market share price. By doing so, you automatically buy more shares when prices dip and fewer when prices surge, eliminating market-timing psychology.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is a good savings rate for someone targeting early retirement?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              A 50% savings rate enables financial independence in approximately 17 years starting from zero. A 65% savings rate achieves FIRE in about 10.5 years. At a typical 10% savings rate, it requires roughly 51 years to reach retirement solvency.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is the difference between APR and APY?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>APR (Annual Percentage Rate)</strong> reflects the simple stated interest rate without compounding effects. <strong>APY (Annual Percentage Yield)</strong> includes the compounding frequency. For example, a 5.00% APR compounded daily yields a true APY of 5.127%.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">How do capital gains taxes work when selling equities?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Assets held for 365 days or fewer are categorized as short-term capital gains, taxed at ordinary income tax brackets (up to 37%). Assets held for longer than one year qualify for preferential long-term capital gains tax brackets (0%, 15%, or 20% based on total taxable income).
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is the Sharpe Ratio in portfolio analysis?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              The Sharpe Ratio measures risk-adjusted return: <em>(Portfolio Return - Risk-Free Rate) / Standard Deviation</em>. It quantifies how much excess return is achieved per unit of portfolio volatility. A ratio above 1.0 is considered good; above 2.0 is considered institutional-grade.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">Why is inflation considered the biggest risk to wealth preservation?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Even moderate 3% sustained inflation cuts the purchasing power of cash by 50% in roughly 24 years. Leaving wealth in static bank deposits guarantees steady loss of real capital; equity investments act as the primary historical hedge by expanding corporate earnings alongside inflation.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">What is the difference between TWR and MWR (IRR)?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>Time-Weighted Return (TWR)</strong> measures fund manager capability by neutralizing the timing of user deposits and withdrawals. <strong>Money-Weighted Return (MWR)</strong> reflects actual personal investor performance by heavily weighting returns during periods when the portfolio balance was largest.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">How does DRIP (Dividend Reinvestment) prevent cash drag?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Cash sitting idle in a brokerage account yields zero return. DRIP automatically converts cash distributions immediately upon payout into fractional equity shares without manual orders or transaction fees, maintaining 100% portfolio market exposure.
            </p>
</details>
<details class="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary class="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span class="">Are SolveIt financial calculations private and secure?</span>
<span class="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Yes. 100% of computational arithmetic on SolveIt executes entirely within your local browser sandbox utilizing client-side JavaScript. Zero salary, portfolio balance, or personal financial data is ever transmitted, logged, or stored on remote web servers.
            </p>
</details>
</div>
</div>
</section>
<!-- EEAT EDITORIAL & OVERSIGHT BOARD (Institutional Credibility) -->
<section class="mb-space-3xl">
<div class="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-xl">
<div class="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-xs">
<div>
<span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Editorial Authority &amp; Methodology</span>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">CFA® &amp; CFP® Institutional Review Board</h2>
</div>
<span class="font-data-mono text-xs px-2.5 py-1 rounded bg-surface-container text-on-surface">
            Quarterly Model Audit: October 2025
          </span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-space-lg">
<!-- Auditor 1 -->
<div class="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low">
<div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl flex-shrink-0">
              AS
            </div>
<div>
<div class="flex items-center gap-2">
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Dr. Arthur Sterling, CFA, CFP®</h3>
<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
</div>
<span class="font-data-mono text-xs text-on-surface-variant block mt-0.5">
                CFA Charterholder #489201 • Senior Portfolio Strategist
              </span>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Former Director of Quantitative Research at Vanguard Group; 22+ years auditing institutional risk, Modern Portfolio Theory glidepaths, and geometric compounding models.
              </p>
</div>
</div>
<!-- Auditor 2 -->
<div class="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low">
<div class="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold text-xl flex-shrink-0">
              ER
            </div>
<div>
<div class="flex items-center gap-2">
<h3 class="font-body-lg text-body-lg font-bold text-on-surface">Elena Rostova, CPA, PFS</h3>
<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
</div>
<span class="font-data-mono text-xs text-on-surface-variant block mt-0.5">
                AICPA License #90214 • Personal Financial Specialist
              </span>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Specialist in high-net-worth tax drag mitigation, Section 1(h) capital gains structuring, and IRS statutory safe-withdrawal decumulation pathways.
              </p>
</div>
</div>
</div>
<!-- Statutory Disclosures Box -->
<div class="p-space-md rounded-lg bg-surface-container text-on-surface-variant font-body-sm text-body-sm space-y-2">
<div class="font-label-caps text-label-caps uppercase text-on-surface font-semibold flex items-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-tertiary">gavel</span>
            Statutory Citations &amp; Institutional Disclosures
          </div>
<p class="text-xs leading-relaxed">
            All calculators and computational models provided within SolveIt are engineered for illustrative, mathematical scenario modeling purposes only. Calculations conform to IEEE 754 floating-point arithmetic standards. Computational outputs do not constitute investment advice, legal counsel, or certified public tax preparation under SEC Rule 202(a)(11)-1 or FINRA Rule 2210.
          </p>
<p class="text-xs leading-relaxed">
            Past performance of financial benchmarks (including the S&amp;P 500 and US Aggregate Bond Index) does not guarantee or predict future capital yields. Equity investments carry market risk including the potential loss of principal. Tax assumptions reference IRC § 1(h), § 401(k), § 408A, and standard IRS inflation adjustments for the current tax calendar year.
          </p>
</div>
</div>
</section>
'''

with open('bottom_sections.html', 'w') as f:
    f.write(content)
print("Saved bottom_sections.html successfully!")
