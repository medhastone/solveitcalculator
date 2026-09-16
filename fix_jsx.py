import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# Replace HTML comments
content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
