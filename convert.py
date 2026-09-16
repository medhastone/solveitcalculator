import re

with open('raw.html', 'r') as f:
    content = f.read()

# Extract main content
main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
if main_match:
    main_content = main_match.group(1)
else:
    main_content = ""

# Convert to JSX
jsx = main_content
jsx = jsx.replace('class=', 'className=')
jsx = jsx.replace('onclick=', 'onClick=')
jsx = jsx.replace('onkeyup=', 'onChange=') # Actually we'll manage this manually
jsx = jsx.replace('onchange=', 'onChange=')
jsx = jsx.replace('oninput=', 'onChange=')
jsx = jsx.replace('for=', 'htmlFor=')
jsx = jsx.replace('style="display: none;"', 'style={{ display: "none" }}')
jsx = jsx.replace('style="display: block;"', 'style={{ display: "block" }}')

# Fix self closing tags
jsx = re.sub(r'<input([^>]*?)>', r'<input\1 />', jsx)
jsx = re.sub(r'<img([^>]*?)>', r'<img\1 />', jsx)
jsx = re.sub(r'<br>', r'<br />', jsx)
jsx = re.sub(r'<hr([^>]*?)>', r'<hr\1 />', jsx)

# Remove script tags
jsx = re.sub(r'<script.*?>.*?</script>', '', jsx, flags=re.DOTALL)

with open('main_jsx.txt', 'w') as f:
    f.write(jsx)
