import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# 1. Move 'use client'; to the very top.
content = content.replace("'use client';\n", "")
# Remove faqData if it's there
faq_match = re.search(r'const faqData = \[.*?\];', content, re.DOTALL)
if faq_match:
    faq_str = faq_match.group(0)
    content = content.replace(faq_str, "")
else:
    faq_str = "const faqData = [];"

content = "'use client';\n" + faq_str + "\n" + content

# 2. Fix the FAQ rendering HTML
faq_container_replacement = """
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm" id="faq-accordion-container">
  {faqData
    .filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
    .map((item, idx) => (
      <div key={idx} className="faq-item bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
        <button 
          type="button" 
          className="faq-toggle w-full flex items-center justify-between text-left font-body-md text-body-md font-bold text-on-surface hover:text-primary transition-colors focus:outline-none"
          onClick={() => toggleFaq(idx)}
        >
          <span className="flex items-center gap-2">
            <span className="font-data-mono text-xs text-primary/70">#{idx + 1}</span>
            {item.q}
          </span>
          <span className={`material-symbols-outlined text-outline shrink-0 transition-transform duration-300 ${openFaqIndices.includes(idx) ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
        {openFaqIndices.includes(idx) && (
          <div className="faq-answer mt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-space-xs border-t border-surface-dim">
            {item.a}
          </div>
        )}
      </div>
    ))}
  {faqData.filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase())).length === 0 && (
    <div className="col-span-1 md:col-span-2 text-center p-space-lg text-on-surface-variant italic">No FAQs matching "{faqSearch}".</div>
  )}
</div>
"""

content = re.sub(
    r'<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm" id="faq-accordion-container">.*?</div>',
    faq_container_replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
