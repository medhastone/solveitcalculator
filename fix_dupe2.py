import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'\s*\)\}\s*</div>\s*\}\)\}\s*\{faqData\.filter.*?No FAQs matching.*?</div>\s*\)\}\s*</div>\s*\)\}\s*</div>\s*\}\)\}\s*\{faqData\.filter.*?No FAQs matching.*?</div>\s*\)\}\s*</div>',
    r'\n        )}\n      </div>\n    ))}\n  {faqData.filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase())).length === 0 && (\n    <div className="col-span-1 md:col-span-2 text-center p-space-lg text-on-surface-variant italic">No FAQs matching "{faqSearch}".</div>\n  )}\n</div>',
    content,
    flags=re.DOTALL
)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
