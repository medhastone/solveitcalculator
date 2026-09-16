import re

with open('app/salary-and-payroll/SalaryAndPayrollClient.tsx', 'r') as f:
    salary_code = f.read()

with open('main_jsx.txt', 'r') as f:
    main_jsx = f.read()

header_match = re.search(r'(<header.*?</header>)', salary_code, re.DOTALL)
footer_match = re.search(r'(<footer.*?</footer>)', salary_code, re.DOTALL)

header = header_match.group(1)
footer = footer_match.group(1)

# Modify header subtitle for this page
header = header.replace('Salary &amp; Payroll Intelligence', 'Investing &amp; Growth Models')

# Create the full component
component = """'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function InvestingAndGrowthClient() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick fix for the breadcrumb since it's hardcoded in the header
  const renderHeader = () => {
    return (
""" + "      " + header.replace('\n', '\n      ') + """
    );
  };

  const renderFooter = () => {
    return (
""" + "      " + footer.replace('\n', '\n      ') + """
    );
  };

  return (
    <>
      {renderHeader()}
      <main className="flex-1 w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
        <div className="mb-space-2xl">
          <nav className="flex mb-space-md font-body-sm text-body-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px] mr-1">home</span>
                  SolveIt
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] text-outline mx-1">chevron_right</span>
                  <Link href="/finance" className="text-on-surface-variant hover:text-primary transition-colors ml-1 md:ml-2">Finance Hub</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] text-outline mx-1">chevron_right</span>
                  <span className="text-on-surface font-semibold ml-1 md:ml-2">Investing &amp; Growth</span>
                </div>
              </li>
            </ol>
          </nav>
""" + "        " + main_jsx.replace('\n', '\n        ') + """
      </main>
      {renderFooter()}
    </>
  );
}
"""

with open('app/investing-and-growth/InvestingAndGrowthClient.tsx', 'w') as f:
    f.write(component)
