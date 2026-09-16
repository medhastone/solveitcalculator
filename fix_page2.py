import re

with open('app/daily-wage-calculator/page.tsx', 'r') as f:
    content = f.read()

# Extract the script content
script_match = re.search(r'(<script type="application/ld\+json" dangerouslySetInnerHTML=\{\{__html: `.*?`\}\} />)', content, re.DOTALL)
if script_match:
    script_content = script_match.group(1)
else:
    script_content = ""

new_content = f"""import React from 'react';
import DailyWageClient from './DailyWageClient';

export const metadata = {{
  title: 'Daily Wage Calculator - SolveIt',
  description: 'Calculate daily wage from monthly salary, hourly rate, or contract value.',
}};

export default function DailyWagePage() {{
  return (
    <>
      {script_content}
      <DailyWageClient />
    </>
  );
}}
"""

with open('app/daily-wage-calculator/page.tsx', 'w') as f:
    f.write(new_content)
