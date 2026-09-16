import re
with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# The incorrect string is:
bad_str = """</div>
        )}
      </div>
    ))}
  {faqData.filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase())).length === 0 && (
    <div className="col-span-1 md:col-span-2 text-center p-space-lg text-on-surface-variant italic">No FAQs matching "{faqSearch}".</div>
  )}
</div>"""

content = content.replace(bad_str + bad_str, bad_str)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
