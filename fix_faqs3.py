import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# We need to find the entire FAQ section and replace it.
# The FAQ section starts with: <section className="w-full py-space-xl bg-surface-container-low">
# And ends before: {/*  EEAT & EDITORIAL TRANSPARENCY SECTION  */}
match = re.search(r'(<section className="w-full py-space-xl bg-surface-container-low">.*?</section>)\s*\{\/\*\s*EEAT & EDITORIAL TRANSPARENCY SECTION\s*\*\/\}', content, re.DOTALL)

if match:
    old_section = match.group(1)
    
    new_section = """<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
<div className="text-center max-w-3xl mx-auto mb-space-xl">
<span className="font-label-caps text-label-caps uppercase text-primary font-bold">Frequently Asked Questions</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface font-bold tracking-tight">
          Statutory &amp; Calculation Standards
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
          Comprehensive statutory, mathematical, and operational answers for HR managers, payroll specialists, contractors, and employees.
        </p>
</div>
{/*  FAQ Search / Filter Bar  */}
<div className="max-w-xl mx-auto mb-space-lg">
<div className="flex items-center px-space-sm py-space-xs rounded-xl bg-surface-container-lowest shadow-sm">
<span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
<input className="bg-transparent border-none outline-none font-body-sm text-body-sm w-full text-on-surface" id="faq-search-input" placeholder="Search across all 50 questions (e.g. overtime, 26 days, taxes)..." type="text" value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} />
</div>
</div>
{/*  50 FAQs Container (Accordion layout)  */}
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
</div>
</section>"""
    
    content = content.replace(old_section, new_section)
    
    with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
        f.write(content)
else:
    print("Could not find the section")
