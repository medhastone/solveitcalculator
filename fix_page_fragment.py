import re
with open('app/daily-wage-calculator/page.tsx', 'r') as f:
    content = f.read()

# I will wrap the return statement with <> and </> properly.
content = re.sub(
    r'(return\s*\(\s*)<script',
    r'\1<>\n      <script',
    content
)

with open('app/daily-wage-calculator/page.tsx', 'w') as f:
    f.write(content)
