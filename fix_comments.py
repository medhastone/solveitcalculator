import re

with open('app/investing-and-growth/InvestingAndGrowthClient.tsx', 'r') as f:
    content = f.read()

# Replace <!-- comment --> with {/* comment */}
content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)

with open('app/investing-and-growth/InvestingAndGrowthClient.tsx', 'w') as f:
    f.write(content)
