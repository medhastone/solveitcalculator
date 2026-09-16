'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface AutomotiveFaq {
  id: number;
  q: string;
  a: string;
}

export const AUTOMOTIVE_FAQS: AutomotiveFaq[] = [
  {
    id: 1,
    q: 'What is an automotive calculator?',
    a: "An automotive calculator is a specialized digital computation tool designed to evaluate vehicle-related metrics across economics, performance, maintenance, and engineering. By applying standardized financial formulas and automotive physics (including EPA fuel cycles, SAE dynamometer formulas, and loan amortization algorithms), these tools determine auto loan payments, trip fuel costs, EV charging times, tire circumference differences, and total vehicle operating costs."
  },
  {
    id: 2,
    q: 'How do I calculate fuel costs for a specific trip?',
    a: "To calculate trip fuel costs, divide your total trip distance (in miles) by your vehicle’s average highway fuel economy (in miles per gallon), then multiply the result by the average price of fuel per gallon: Trip Cost = (Distance in Miles / Average MPG) × Fuel Price per Gallon. For example, a 600-mile trip in a car averaging 30 MPG with gas at $3.50 per gallon requires 20 gallons of fuel, totaling $70.00."
  },
  {
    id: 3,
    q: 'What is considered a good MPG for modern vehicles?',
    a: "According to the U.S. Environmental Protection Agency (EPA), the average new passenger vehicle achieves approximately 28 MPG combined (city/highway). Compact sedans and standard hybrids generally deliver 40 to 55 MPG, while full-size SUVs and light trucks average 18 to 24 MPG. For electric vehicles, equivalent efficiency is rated in MPGe, with leading EVs achieving 110 to 140 MPGe."
  },
  {
    id: 4,
    q: 'How do car loan interest and monthly payments work?',
    a: "Auto loans utilize amortized interest, meaning monthly payments are fixed, but the proportion applied to interest versus principal shifts over time. In the initial months, a higher portion of your payment covers the interest balance; as the principal declines, more of each payment pays down the loan balance. Monthly payment is calculated based on principal balance, monthly interest rate (APR / 12), and total loan duration in months."
  },
  {
    id: 5,
    q: 'How much does a vehicle depreciate over time?',
    a: "On average, a new car loses 10% of its value immediately upon leaving the dealership lot, and approximately 20% by the end of year one. Over years two through five, vehicles typically depreciate at an annual rate of 10% to 15%. By year five, the average vehicle retains roughly 40% to 50% of its original manufacturer's suggested retail price (MSRP)."
  },
  {
    id: 6,
    q: 'How much does it cost to charge an electric vehicle (EV)?',
    a: "The cost to charge an EV depends on battery capacity, charging efficiency, and the electricity rate per kilowatt-hour (kWh). Charging a standard 75 kWh battery pack from 10% to 80% (52.5 kWh added) at home with an average residential electricity rate of $0.16/kWh and 90% charging efficiency costs approximately $9.33, providing about 210 to 240 miles of range. In contrast, commercial DC fast charging at $0.45/kWh costs approximately $26.25 for the same charge."
  },
  {
    id: 7,
    q: "How do I calculate my vehicle's true cost per mile?",
    a: "True cost per mile is determined by dividing all vehicle expenses over a given period by the total miles driven during that timeframe: Cost Per Mile = [Fixed Costs (Loan Interest + Insurance + Registration + Depreciation) + Variable Costs (Fuel + Maintenance + Tires + Tolls)] / Total Miles Driven. According to AAA research, the average cost to own and operate a new passenger car is approximately $0.72 per mile based on driving 15,000 miles annually."
  },
  {
    id: 8,
    q: 'What car can I afford based on my salary (The 20/4/10 Rule)?',
    a: "Under the widely recommended 20/4/10 rule: (1) 20% Down: Provide a minimum 20% down payment (cash or trade-in equity) to avoid negative equity. (2) 4-Year Term: Finance the vehicle for no longer than 48 months. (3) 10% of Gross Income: Keep combined monthly transportation costs (loan payment, vehicle insurance, and fuel/charging) under 10% of your gross monthly income. For example, a driver earning $60,000 annually ($5,000/month) should cap total monthly vehicle expenses at $500."
  },
  {
    id: 9,
    q: 'Is leasing cheaper than buying a car?',
    a: "Leasing generally offers a lower monthly payment than financing a purchase because you only pay for the vehicle’s expected depreciation during the lease term (typically 36 months), rather than the total purchase price. However, leasing is generally more expensive in the long run because you never build equity, are subject to strict annual mileage limits (typically 10,000 to 12,000 miles), and face disposition and wear-and-tear fees. Purchasing is more cost-effective if you keep the vehicle for 5 to 10 years."
  },
  {
    id: 10,
    q: 'How does changing tire and wheel size impact the speedometer?',
    a: "Vehicle speedometers calculate speed by monitoring wheel and transmission shaft revolutions based on the factory tire diameter. If you install taller tires, the tire has a larger rolling circumference and travels further with each rotation, causing your speedometer to read lower than your actual road speed. Conversely, installing smaller diameter tires causes the speedometer to read faster than your true speed."
  },
  {
    id: 11,
    q: 'What is wheel offset and why does it matter?',
    a: "Wheel offset (indicated in millimeters by the letters 'ET') is the distance from the wheel’s mounting hub face to the centerline of the rim. A positive offset pushes the wheel inward toward the suspension strut; a negative offset pushes the wheel outward away from the vehicle body. Installing incorrect offset wheels can cause tires to scrub against suspension struts, rub on fender liners during turns, or cause premature wheel bearing wear."
  },
  {
    id: 12,
    q: 'How do you calculate horsepower from torque?',
    a: "Horsepower is directly proportional to rotational torque and engine speed (RPM). The formula is: Horsepower = [Torque (lb-ft) × RPM] / 5252. At exactly 5,252 RPM, an engine's horsepower and torque curves will always cross and equal each other."
  },
  {
    id: 13,
    q: 'How often should I budget for vehicle maintenance?',
    a: "A reliable benchmark is to budget $75 to $100 per month ($900 to $1,200 annually) for routine preventative maintenance (oil changes, tire rotations, cabin filters, wiper blades) and wear items (brake pads, rotors, tires, and 60,000-mile fluid flushes). Older vehicles over 100,000 miles should budget $125 to $150 per month to account for unscheduled suspension, cooling, or electrical repairs."
  },
  {
    id: 14,
    q: 'What is the difference between Wheel Horsepower (WHP) and Crank/Flywheel Horsepower (BHP)?',
    a: "Crank or Brake Horsepower (BHP) is the gross mechanical power generated directly at the engine crankshaft without drivetrain resistance. Wheel Horsepower (WHP) is the actual power delivered to the road surface as measured on a chassis dynamometer. Drivetrain losses through the transmission, driveshafts, differential, and wheel hubs typically reduce power by 12% to 15% on FWD/RWD vehicles and 18% to 22% on AWD platforms."
  },
  {
    id: 15,
    q: 'How does cold weather affect EV range and fuel efficiency?',
    a: "Extreme cold temperatures (20°F / -7°C or below) reduce driving range for all vehicle types. Gasoline vehicles experience a 15% to 20% drop in fuel economy due to longer engine warm-up times, denser aerodynamic air drag, and winter fuel blends. Electric vehicles experience a 25% to 40% reduction in driving range because cold temperatures slow lithium-ion chemical reactions and cabin heating draws power directly from the high-voltage traction battery rather than using waste engine heat."
  }
];

export default function AutomotiveSeoSection() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-surface-container-low border-t border-outline-variant/20 py-space-3xl">
      <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
        
        {/* Author / EEAT Reviewer Byline */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Engineering Authority &amp; Vehicle Standards
              </span>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                Calibrated to EPA Fuel Cycles, SAE J1349 / J1711 Standards &amp; AAA Cost Benchmarks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-body-sm text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>100% Client-Side Private Computation</span>
          </div>
        </div>

        {/* Featured Snippet Definition Callout */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-primary/20 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[22px]">directions_car</span>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-primary font-bold uppercase tracking-wider block mb-1">
                Featured Snippet • What Is an Automotive Calculator?
              </span>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                <strong>An automotive calculator is a specialized digital tool designed to compute vehicle-related financial, operational, and mechanical metrics—including auto loan amortization, fuel mileage (MPG), road trip fuel costs, electric vehicle (EV) charging expenses, tire size diameter changes, and vehicle depreciation.</strong>
              </p>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed mt-2.5">
                By incorporating verified financial interest formulas and standardized engineering equations (such as EPA fuel benchmarks and SAE performance metrics), automotive calculators enable vehicle owners, buyers, and fleet managers to budget ongoing transportation expenses accurately and make data-driven vehicle decisions.
              </p>
            </div>
          </div>
        </div>

        {/* H2: Essential Vehicle Finance & Ownership Calculators */}
        <article className="space-y-space-md text-left">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Essential Vehicle Finance &amp; Ownership Calculators
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Acquiring and operating a vehicle represents one of the largest financial commitments for households and commercial businesses alike. Evaluating affordability solely through a dealership&apos;s advertised monthly quote overlooks the compounding impact of interest rates, sales taxes, tire wear, routine fluid services, and five-year depreciation curves.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-space-xs">
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-primary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">payments</span>
                Auto Loan, Lease &amp; Payoff
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Compute monthly financing payments across standard loan terms (36, 48, 60, 72 months). Account for down payment, trade-in equity, dealer documentation fees, and state-specific sales tax laws.
              </p>
              <div className="pt-2">
                <a href="#popular-tools-section" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                  Loan Payoff Calculator →
                </a>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-secondary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">trending_down</span>
                Depreciation &amp; Total Cost of Ownership
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                A new vehicle loses roughly 20% of its market value in year one and 40% to 50% by year five. Model steep initial loss curves and identify the certified pre-owned depreciation sweet spot.
              </p>
              <div className="pt-2">
                <a href="#popular-tools-section" className="text-secondary text-xs font-semibold hover:underline flex items-center gap-1">
                  Depreciation Estimator →
                </a>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-tertiary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                Car Affordability &amp; 20/4/10 Rule
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Determine your target vehicle price based on your gross income. Apply the 20% down, 4-year loan term, and 10% maximum monthly transportation spend guideline.
              </p>
              <div className="pt-2">
                <a href="#directory-section" className="text-tertiary text-xs font-semibold hover:underline flex items-center gap-1">
                  Affordability Planner →
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* H2: Fuel Economy, EV Charging & Trip Expense Estimators */}
        <article className="space-y-space-md text-left">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Fuel Economy, EV Charging &amp; Trip Expense Estimators
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Fuel and electric energy represent the largest ongoing variable expense of vehicle operation. Our calculators provide transparent mathematical conversions between miles per gallon (MPG), liters per 100 kilometers (L/100km), kilowatt-hours per 100 miles (kWh/100mi), and real-world dollars per mile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">ev_station</span>
                EV Charging Cost, Range &amp; Savings
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Compare home Level 2 charging rates (~$0.16/kWh) against commercial DC fast charging ($0.35–$0.55/kWh). Factor in onboard AC-to-DC conversion efficiency losses (typically ~10–15%) and winter thermal preconditioning penalties.
              </p>
              <div className="pt-2">
                <a href="#popular-tools-section" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                  EV Charging Cost &amp; Range →
                </a>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">alt_route</span>
                Road Trip Gas Cost &amp; Fuel Economy
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Budget cross-country family driving routes with precision. Calculate required gallons, fuel stops, and toll costs based on distance, driving speed aerodynamics, and real-time fuel prices.
              </p>
              <div className="pt-2">
                <a href="#popular-tools-section" className="text-secondary text-xs font-semibold hover:underline flex items-center gap-1">
                  Trip Fuel Cost Sizer →
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* H2: Mechanical, Drivetrain & Performance Sizing */}
        <article className="space-y-space-md text-left">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Mechanical, Drivetrain &amp; Performance Sizing
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Modifying wheel dimensions, tire aspect ratios, or drivetrain gearings directly alters mechanical advantage, suspension clearances, and vehicle speed sensor feedback.
          </p>

          <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-space-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-sm">
              <div className="space-y-1">
                <span className="font-label-caps text-xs text-primary uppercase font-bold">Tire Geometry</span>
                <h4 className="font-headline-sm font-semibold text-on-surface text-[15px]">Tire Size &amp; Speedometer Delta</h4>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Compare diameter, section width, and revolutions per mile. Determine exact speedometer discrepancy when upgrading rims.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-label-caps text-xs text-secondary uppercase font-bold">Wheel Fitment</span>
                <h4 className="font-headline-sm font-semibold text-on-surface text-[15px]">Wheel Offset (ET) &amp; Backspacing</h4>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Verify suspension strut clearance and outer fender poke to eliminate rub issues on lowered or lifted vehicles.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-label-caps text-xs text-tertiary uppercase font-bold">Powertrain</span>
                <h4 className="font-headline-sm font-semibold text-on-surface text-[15px]">Horsepower, Torque &amp; 1/4 Mile</h4>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Derive horsepower at RPM via SAE J1349 standards, estimate quarter-mile elapsed times, and model drivetrain parasitic drag.
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap gap-4 text-xs font-semibold">
              <Link href="/engine-rpm-calculator" className="text-primary hover:underline flex items-center gap-1">
                Explore Engine RPM &amp; Gear Ratio Calculator →
              </Link>
              <Link href="/conversions" className="text-secondary hover:underline flex items-center gap-1">
                Torque &amp; Pressure Unit Conversions →
              </Link>
            </div>
          </div>
        </article>

        {/* H2: Commercial Fleet, Maintenance & Operational Cost Planning */}
        <article className="space-y-space-md text-left">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Commercial Fleet, Maintenance &amp; Operational Cost Planning
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            For rideshare operators, hotshot haulers, delivery fleets, and daily commuters, monitoring cost per mile is crucial for profitability and tax deduction accounting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
                True Cost Per Mile (CPM)
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Aggregate fixed costs (insurance, registration, financing interest, annual depreciation) with variable running expenses (fuel, tires, brake pads, routine maintenance). Know your exact breakeven rate before taking freight or rideshare trips.
              </p>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">build_circle</span>
                Maintenance Interval &amp; Wear Forecaster
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Project brake pad lifespan, synthetic oil breakdown cycles, and 60,000-mile transmission and cooling system flushes to build an accurate monthly repair sinking fund.
              </p>
            </div>
          </div>
        </article>

        {/* Step-by-Step Practical Calculation Guide */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-space-md text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">calculate</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                How to Estimate Total Cost of Vehicle Ownership
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Follow this simple step-by-step framework to determine your true monthly vehicle expense.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm pt-2">
            <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-caps text-xs text-primary font-bold">Step 1</span>
              <h4 className="font-headline-sm font-semibold text-on-surface text-[14px]">Financing / Lease</h4>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Calculate principal, amortized APR interest, and loan term duration.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-caps text-xs text-secondary font-bold">Step 2</span>
              <h4 className="font-headline-sm font-semibold text-on-surface text-[14px]">Fuel or Electricity</h4>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Multiply annual miles by local cost per gallon or kilowatt-hour efficiency.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-caps text-xs text-tertiary font-bold">Step 3</span>
              <h4 className="font-headline-sm font-semibold text-on-surface text-[14px]">Insurance &amp; Fees</h4>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Add monthly comprehensive insurance, state registration, and property tax.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-caps text-xs text-primary-container font-bold">Step 4</span>
              <h4 className="font-headline-sm font-semibold text-on-surface text-[14px]">Depreciation &amp; Repairs</h4>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Budget $75–$125/month for maintenance plus 12% average annual valuation loss.
              </p>
            </div>
          </div>

          <div className="p-space-sm rounded-xl bg-surface-container font-body-sm text-xs text-on-surface flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
            <span>
              <strong>Practical Example:</strong> A 600-mile highway road trip in a vehicle achieving 30 MPG with regular fuel at $3.50/gallon requires 20 gallons of gasoline (600 / 30 = 20), resulting in a direct fuel expense of $70.00 (20 × $3.50), or approximately $0.117 per mile in energy costs alone.
            </span>
          </div>
        </div>

        {/* FAQ Section (All 15 Questions and Answers) */}
        <section className="space-y-space-md text-left pt-space-md">
          <div className="text-center sm:text-left">
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
              Comprehensive Reference FAQ
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              In-depth explanations of automotive financing math, fuel economy benchmarks, EV charging physics, and tire sizing.
            </p>
          </div>

          <div className="space-y-3 pt-space-xs">
            {AUTOMOTIVE_FAQS.map(faq => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-space-md text-left flex items-center justify-between gap-4 font-headline-md text-[16px] font-semibold text-on-surface hover:text-primary transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className={`material-symbols-outlined text-outline transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-space-md pb-space-md pt-1 text-on-surface-variant font-body-sm text-body-sm leading-relaxed border-t border-outline-variant/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* External Authority Sources */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-space-sm text-left">
          <div className="flex items-center gap-2 text-primary font-bold font-label-caps text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Authoritative Sources &amp; Industry Standards</span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Our automotive formulas, dynamometer conversions, and fuel metrics adhere to peer-reviewed standards established by leading transportation and safety agencies:
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-outline">
            <a href="https://www.fueleconomy.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              EPA Fuel Economy Database ↗
            </a>
            <a href="https://www.sae.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              SAE International Standards (J1349/J1711) ↗
            </a>
            <a href="https://newsroom.aaa.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              AAA Your Driving Costs Study ↗
            </a>
            <a href="https://www.eia.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              U.S. Energy Information Administration (EIA) ↗
            </a>
            <a href="https://www.nhtsa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              NHTSA Tire Safety &amp; UTQG Standards ↗
            </a>
          </div>
        </div>

      </div>

      {/* Structured Data: JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://solveitcalculator.com/automotive-calculators-estimators#webpage',
                url: 'https://solveitcalculator.com/automotive-calculators-estimators',
                name: 'Automotive Calculators & Estimators | Free Vehicle Tools',
                description: 'Calculate fuel costs, mileage, car loans, vehicle expenses, depreciation, EV charging costs, and more with free automotive calculators and estimators.',
                isPartOf: {
                  '@type': 'WebSite',
                  '@id': 'https://solveitcalculator.com/#website',
                  name: 'SolveIt Calculator',
                  url: 'https://solveitcalculator.com/'
                },
                breadcrumb: {
                  '@id': 'https://solveitcalculator.com/automotive-calculators-estimators#breadcrumb'
                }
              },
              {
                '@type': 'BreadcrumbList',
                '@id': 'https://solveitcalculator.com/automotive-calculators-estimators#breadcrumb',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com/'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Automotive Calculators & Estimators',
                    item: 'https://solveitcalculator.com/automotive-calculators-estimators'
                  }
                ]
              },
              {
                '@type': 'ItemList',
                '@id': 'https://solveitcalculator.com/automotive-calculators-estimators#itemlist',
                name: 'Featured Automotive Calculators & Sizing Tools',
                description: 'Comprehensive suite of free automotive calculation tools for financing, fuel mileage, EV charging, and mechanical sizing.',
                numberOfItems: 10,
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Auto Loan & Lease Payoff Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Gas Mileage & Fuel Efficiency Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'EV Charging Cost & Range Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: 'Road Trip Fuel Cost Estimator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 5,
                    name: 'Tire Size & Speedometer Delta Calibrator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 6,
                    name: 'Vehicle Depreciation & TCO Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 7,
                    name: 'Car Affordability (20/4/10) Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#directory-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 8,
                    name: 'Cost Per Mile (CPM) Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#directory-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 9,
                    name: 'Horsepower, Torque & 1/4 Mile Calculator',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#popular-tools-section'
                  },
                  {
                    '@type': 'ListItem',
                    position: 10,
                    name: 'Wheel Offset & Backspacing Clearance Solver',
                    url: 'https://solveitcalculator.com/automotive-calculators-estimators#directory-section'
                  }
                ]
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveitcalculator.com/automotive-calculators-estimators#faq',
                mainEntity: AUTOMOTIVE_FAQS.map(faq => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a
                  }
                }))
              }
            ]
          })
        }}
      />
    </section>
  );
}
