import os
with open('app/conversion/gram-to-cup/page.tsx', 'r') as f:
    content = f.read()
content = content.replace("Gram to Cups (and Cups to Grams) Converter", "Gram to Cups Converter (g to cups)")
with open('app/conversion/gram-to-cup/page.tsx', 'w') as f:
    f.write(content)
