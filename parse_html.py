import re

with open('/tmp/daily_wage.html', 'r') as f:
    html = f.read()

# find main tags
match = re.search(r'<main.*?>(.*?)</main>', html, re.DOTALL)
if match:
    main_content = match.group(1)
    print(f"Main content length: {len(main_content)}")
else:
    print("No main tag found")
