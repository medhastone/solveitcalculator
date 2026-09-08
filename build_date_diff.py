import re

with open('app/time-date/date-difference/page.tsx', 'r') as f:
    page_content = f.read()
page_content = re.sub(
    r"title:\s*'[^']+'",
    r"title: 'Date Difference Calculator | SolveIt'",
    page_content
)
with open('app/time-date/date-difference/page.tsx', 'w') as f:
    f.write(page_content)
