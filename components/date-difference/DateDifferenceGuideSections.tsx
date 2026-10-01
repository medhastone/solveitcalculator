'use client';

import React from 'react';
import Link from 'next/link';

export default function DateDifferenceGuideSections() {
  return (
    <>
      {/* Step-by-Step Guide: How It Works */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
          <div className="max-w-3xl">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">SIMPLE GUIDE</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
              How to Count Days Between Two Dates
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Counting the number of days between two dates is easy. Follow these four simple steps:
            </p>
          </div>
          {/* 4 Simple Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-body-md">1</span>
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Pick Your Dates</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Choose your start and end dates using the calendar pickers or quick shortcuts.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-body-md">2</span>
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Choose What to Count</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Select whether you need all calendar days, working business days, or work hours.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-body-md">3</span>
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Set Any Exclusions</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Skip weekends or public holidays if needed, and choose whether to include the last day.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-body-md">4</span>
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Get Your Results</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Instantly view your exact days, weeks, months, and hours, then copy or export them.
              </p>
            </div>
          </div>
          {/* Helpful Formulas Box */}
          <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 flex flex-col gap-space-md">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Helpful Formulas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md text-body-sm">
              <div className="p-space-sm bg-surface rounded-lg border border-outline-variant/20">
                <span className="text-on-surface-variant block text-[12px] font-medium">Total Days</span>
                <span className="text-primary font-bold text-[15px] mt-1 block">End Date − Start Date</span>
                <span className="text-[12px] text-on-surface-variant mt-0.5 block">Standard calendar span</span>
              </div>
              <div className="p-space-sm bg-surface rounded-lg border border-outline-variant/20">
                <span className="text-on-surface-variant block text-[12px] font-medium">Inclusive Days</span>
                <span className="text-primary font-bold text-[15px] mt-1 block">Total Days + 1 Day</span>
                <span className="text-[12px] text-on-surface-variant mt-0.5 block">Counts start &amp; end dates</span>
              </div>
              <div className="p-space-sm bg-surface rounded-lg border border-outline-variant/20">
                <span className="text-on-surface-variant block text-[12px] font-medium">Business Days</span>
                <span className="text-primary font-bold text-[15px] mt-1 block">Total Days − Weekends − Holidays</span>
                <span className="text-[12px] text-on-surface-variant mt-0.5 block">Working days only</span>
              </div>
              <div className="p-space-sm bg-surface rounded-lg border border-outline-variant/20">
                <span className="text-on-surface-variant block text-[12px] font-medium">Working Hours</span>
                <span className="text-primary font-bold text-[15px] mt-1 block">Business Days × Hours/Day</span>
                <span className="text-[12px] text-on-surface-variant mt-0.5 block">Default 8 hours per day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Everyday Use Cases */}
      <section className="w-full py-space-2xl bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-2xs">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">EVERYDAY USE CASES</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Common Reasons to Calculate Days</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Helpful timelines for work, personal milestones, and everyday tasks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">01. Work &amp; Planning</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Project Deadlines</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Count exactly how many working days you have to complete a deliverable before the launch date.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Working Days: 54d</span>
                <span className="text-primary font-bold">432 Work Hrs</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">02. Career &amp; HR</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Work Anniversaries &amp; Notice</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Track probation periods, 2-week resignation notice dates, or upcoming work milestones.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Milestone: 365 Days</span>
                <span className="text-primary font-bold">1 Full Year</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">03. Money &amp; Banking</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Loan &amp; Interest Periods</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Find the exact number of calendar days between payments to calculate daily loan interest.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Billing Cycle: 30d</span>
                <span className="text-primary font-bold">Daily Interest</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">04. Housing &amp; Rent</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Apartment Lease Notices</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Count backward 30 or 60 days from your lease end date so you give notice on time.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Notice: 60 Days</span>
                <span className="text-primary font-bold">On-Time Move</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">05. Education</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">School &amp; Semester Dates</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Calculate total school days or countdown until spring break, summer vacation, and finals week.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Semester: 15 Weeks</span>
                <span className="text-primary font-bold">105 Total Days</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">06. Family &amp; Health</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Pregnancy &amp; Due Dates</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Track gestational weeks and days countdown (standard 280 days or 40 weeks).
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Gestation: 40 Wks</span>
                <span className="text-primary font-bold">280 Days</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">07. Celebrations</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Event &amp; Wedding Planning</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Set countdowns for RSVPs, vendor deposits, invitations, and the big wedding day.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Runway: 248 Days</span>
                <span className="text-primary font-bold">RSVP: 30 Days</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">08. Travel</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Travel &amp; Visa Days</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Track maximum stay limits like 90 days abroad or count down days until a flight departure.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Stay Limit: 90 Days</span>
                <span className="text-primary font-bold">Visa Safe</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-primary font-semibold">09. Shopping</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Return &amp; Warranty Windows</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Make sure you return an item before the 14-day or 30-day store return policy expires.
                </p>
              </div>
              <div className="mt-space-sm pt-space-xs flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
                <span>Window: 30 Days</span>
                <span className="text-primary font-bold">Active Return</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">BETTER WAY TO COUNT</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">How SolveIt Compares</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm border-collapse rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-surface-container-low text-on-surface border-b border-outline-variant/30">
                  <th className="py-3.5 px-4 font-semibold">Feature</th>
                  <th className="py-3.5 px-4 font-semibold text-primary">SolveIt Days Calculator</th>
                  <th className="py-3.5 px-4 font-semibold text-on-surface-variant">Spreadsheets (Excel / Sheets)</th>
                  <th className="py-3.5 px-4 font-semibold text-on-surface-variant">Counting on a Calendar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr className="bg-surface-container-lowest">
                  <td className="py-3.5 px-4 font-medium text-on-surface">Instant Results</td>
                  <td className="py-3.5 px-4 text-primary font-semibold">Instant (no setup)</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Requires typing formulas</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Slow and manual</td>
                </tr>
                <tr className="bg-surface">
                  <td className="py-3.5 px-4 font-medium text-on-surface">Automatic Public Holidays</td>
                  <td className="py-3.5 px-4 text-primary font-semibold">Included for 6 countries</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Must manually enter holiday dates</td>
                  <td className="py-3.5 px-4 text-error font-medium">Easy to overlook</td>
                </tr>
                <tr className="bg-surface-container-lowest">
                  <td className="py-3.5 px-4 font-medium text-on-surface">Leap Year Support</td>
                  <td className="py-3.5 px-4 text-primary font-semibold">Automatic</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Automatic</td>
                  <td className="py-3.5 px-4 text-error font-medium">Frequent errors on Feb 29</td>
                </tr>
                <tr className="bg-surface">
                  <td className="py-3.5 px-4 font-medium text-on-surface">Include End Date Option</td>
                  <td className="py-3.5 px-4 text-primary font-semibold">1-Click switch</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Need to remember to add +1</td>
                  <td className="py-3.5 px-4 text-error font-medium">Often counted wrong</td>
                </tr>
                <tr className="bg-surface-container-lowest">
                  <td className="py-3.5 px-4 font-medium text-on-surface">Privacy &amp; Security</td>
                  <td className="py-3.5 px-4 text-primary font-semibold">100% Private in your browser</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">Stored on cloud servers</td>
                  <td className="py-3.5 px-4 text-on-surface font-semibold">Private</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Common Date Pitfalls & Tips */}
      <section className="w-full py-space-2xl bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">HELPFUL TIPS</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">5 Common Mistakes When Counting Days</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Forgetting the End Date</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                If you start on Monday and end on Wednesday, is that 2 days or 3 days? If both days count, remember to check &quot;Include end date&quot; to add that extra day.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Daylight Saving Time Changes</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                When clocks &quot;spring forward&quot; or &quot;fall back&quot;, days are 23 or 25 hours long. Our calculator counts whole calendar days so time changes never skew your total.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Leap Year Days</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Leap years add February 29 every 4 years. If you count manually on paper, it&apos;s easy to miss that 366th day in years like 2024 or 2028.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Holidays That Change Dates</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Some holidays like Thanksgiving or Memorial Day land on different dates every year, or move to Monday if they fall on a weekend. Our tool handles this automatically.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">Months with Different Days</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Months have 28, 29, 30, or 31 days. Simply assuming every month has 30 days can make a deadline estimation off by several days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
          <div className="max-w-3xl">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Frequently Asked Questions</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Simple answers to common questions about counting days, work days, and dates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md" id="faqAccordionContainer">
            <details className="p-space-md bg-surface-container-low rounded-xl group transition-all border border-outline-variant/20">
              <summary className="font-headline-md text-headline-md text-on-surface cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>Does this count leap years?</span>
                <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-dim/40">
                Yes. The calculator automatically checks if your selected date span crosses February 29 during a leap year and includes the extra day.
              </p>
            </details>
            <details className="p-space-md bg-surface-container-low rounded-xl group transition-all border border-outline-variant/20">
              <summary className="font-headline-md text-headline-md text-on-surface cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>What are business days?</span>
                <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-dim/40">
                Business days are standard working days (Monday through Friday). They leave out weekend days (Saturday and Sunday) as well as any public holidays you choose to skip.
              </p>
            </details>
            <details className="p-space-md bg-surface-container-low rounded-xl group transition-all border border-outline-variant/20">
              <summary className="font-headline-md text-headline-md text-on-surface cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>What does &quot;Include End Date&quot; mean?</span>
                <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-dim/40">
                By default, counting days calculates the difference between dates (like subtracting 1 from 5 to get 4). Checking &quot;Include end date&quot; treats both your first day and last day as full days (+1 day total).
              </p>
            </details>
            <details className="p-space-md bg-surface-container-low rounded-xl group transition-all border border-outline-variant/20">
              <summary className="font-headline-md text-headline-md text-on-surface cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>How do I count days in Excel?</span>
                <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-dim/40">
                In Microsoft Excel or Google Sheets, you can type <code>=DAYS(end_date, start_date)</code> for all days, or <code>=NETWORKDAYS(start_date, end_date)</code> for business days.
              </p>
            </details>
            <details className="p-space-md bg-surface-container-low rounded-xl group transition-all border border-outline-variant/20">
              <summary className="font-headline-md text-headline-md text-on-surface cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>Is my data private?</span>
                <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-dim/40">
                Yes, 100%. All calculations happen entirely on your computer or phone inside your browser. No dates or numbers are ever sent to or saved on a server.
              </p>
            </details>
            <details className="p-space-md bg-surface-container-low rounded-xl group transition-all border border-outline-variant/20">
              <summary className="font-headline-md text-headline-md text-on-surface cursor-pointer list-none flex items-center justify-between font-semibold">
                <span>What public holidays are supported?</span>
                <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-dim/40">
                SolveIt supports major national holidays for the United States, United Kingdom, Canada, Australia, India, and Germany, including observed days when holidays land on a weekend.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Related Time & Date Calculators */}
      <section className="w-full py-space-2xl bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-md">
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Related Time &amp; Date Calculators</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-space-sm font-body-sm text-body-sm">
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/days-calculator"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_add_on</span> Business Days Calculator
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/add-subtract-time"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">more_time</span> Add/Subtract Time
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/time-calculator"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">hourglass_top</span> Time Duration Calculator
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/age-calculator"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">cake</span> Age &amp; Birthday Calculator
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/event-countdown"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">timer</span> Event Countdown Calculator
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/world-clock-grid"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">public</span> World Time Converter
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date/work-hours"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">badge</span> Work Hours &amp; Timesheet
            </Link>
            <Link
              className="p-space-sm bg-surface-container-lowest rounded-lg hover:text-primary transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              href="/time-date"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">calculate</span> All Calculators
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Popular Searches</span>
          <div className="flex flex-wrap items-center gap-2 font-body-sm text-body-sm">
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/days-between-dates">
              Days Between Two Dates
            </Link>
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/days-calculator">
              Business Days Between Dates
            </Link>
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/days-between-dates">
              Weeks Between Dates
            </Link>
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/work-hours">
              Working Days Calculator
            </Link>
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/countdown-timer">
              Days Until Christmas 2025
            </Link>
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/countdown-timer">
              Days Until New Year 2026
            </Link>
            <Link className="px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors border border-outline-variant/20" href="/time-date/days-between-dates">
              90 Days From Today
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
