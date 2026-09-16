import re
with open('app/globals.css', 'r') as f:
    content = f.read()

# Remove the redefined font variables from :root
content = re.sub(r'\s*--font-inter:.*?;', '', content)
content = re.sub(r'\s*--font-jetbrains:.*?;', '', content)

# Update the utilities to use the variables directly
content = re.sub(r'(@utility font-[a-zA-Z0-9-]+ \{ font-family: )var\(--font-inter\);( \})', r"\1var(--font-inter), 'Inter', sans-serif;\2", content)
content = re.sub(r'(@utility font-data-mono \{ font-family: )var\(--font-jetbrains\);( \})', r"\1var(--font-mono), 'JetBrains Mono', monospace;\2", content)

with open('app/globals.css', 'w') as f:
    f.write(content)
