import re

with open('components/conversion/GramsHubClient.tsx', 'r') as f:
    code = f.read()

# Fix Planck's constant
code = code.replace("Planck's constant", "Planck&apos;s constant")
# Fix quotes in "Cup" Illusion etc.
code = code.replace('The Volumetric "Cup" Illusion', 'The Volumetric &quot;Cup&quot; Illusion')
code = code.replace('commercial shipping tariffs require distinct differentiation', 'commercial shipping tariffs require distinct differentiation')
# Any other stray ' or " in text outside of tags is hard to fix blindly with regex, let's fix known ones.
code = code.replace("doesn't", "doesn&apos;t")
code = code.replace("don't", "don&apos;t")
code = code.replace("it's", "it&apos;s")

with open('components/conversion/GramsHubClient.tsx', 'w') as f:
    f.write(code)

