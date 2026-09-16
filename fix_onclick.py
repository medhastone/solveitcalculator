import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# Replace onClick={() => {}} // "..."
content = re.sub(r'onClick=\{\(\) => \{\}\} // "[^"]*"', r'onClick={() => {}}', content)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
