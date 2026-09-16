import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# Extract the faqData
faq_match = re.search(r'const faqData = \[.*?\];', content, re.DOTALL)
if faq_match:
    faq_data_str = faq_match.group(0)
else:
    print("Could not find faqData")
    exit(1)

# Remove faqData and functions from useEffect
# We'll just remove renderFAQs and initFAQFilter
content = re.sub(r'function renderFAQs.*?\}\n\n    function initFAQFilter\(\) \{.*?\}\n', '', content, flags=re.DOTALL)
content = re.sub(r'renderFAQs\(\);\n    initFAQFilter\(\);\n', '', content)
content = content.replace(faq_data_str, '')

# We need to add state for the FAQ search filter and open items
# Find the start of the component
comp_match = re.search(r'export default function DailyWageClient\(\) \{', content)
if not comp_match:
    print("Could not find component start")
    exit(1)

state_vars = """
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    if (openFaqIndices.includes(index)) {
      setOpenFaqIndices(openFaqIndices.filter(i => i !== index));
    } else {
      setOpenFaqIndices([...openFaqIndices, index]);
    }
  };
"""

# Let's put faqData outside the component
content = faq_data_str + '\n' + content

# Add the state variables
content = content.replace(
    'export default function DailyWageClient() {',
    'export default function DailyWageClient() {' + state_vars
)

# Now find the FAQ search input and container
search_input_replacement = """
<input className="bg-transparent border-none outline-none font-body-sm text-body-sm w-full text-on-surface" id="faq-search-input" placeholder="Search across all 50 questions (e.g. overtime, 26 days, taxes)..." type="text" value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} />
"""
content = re.sub(
    r'<input className="bg-transparent border-none outline-none font-body-sm text-body-sm w-full text-on-surface" id="faq-search-input" placeholder="Search across all 50 questions \(e.g. overtime, 26 days, taxes\)..." type="text"/>',
    search_input_replacement.strip(),
    content
)

faq_container_replacement = """
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm" id="faq-accordion-container">
  {faqData
    .filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
    .map((item, idx) => (
      <div key={idx} className="faq-item bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all">
        <button 
          className="faq-toggle w-full flex items-start justify-between text-left gap-space-sm focus:outline-none" 
          onClick={() => toggleFaq(idx)}
          type="button"
        >
          <span className="font-headline-md text-body-md font-semibold text-on-surface leading-snug pr-space-md">{item.q}</span>
          <span className={`material-symbols-outlined text-outline shrink-0 transition-transform duration-300 ${openFaqIndices.includes(idx) ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
        {openFaqIndices.includes(idx) && (
          <div className="faq-answer mt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed pt-space-xs border-0">
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
