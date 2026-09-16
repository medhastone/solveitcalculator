import re
with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

start_tag = '<div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm" id="faq-accordion-container">'
start_idx = content.find(start_tag)
if start_idx != -1:
    print(content[start_idx:start_idx+1500])
