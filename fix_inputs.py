with open('components/conversion/GramsHubClient.tsx', 'r') as f:
    code = f.read()

# Replace the broken string
code = code.replace("onChange={(e) = /> setInputValue(e.target.value)} />", "onChange={(e) => setInputValue(e.target.value)} />")
code = code.replace("onChange={(e) = /> setSearchQuery(e.target.value)} value={searchQuery} placeholder=\"Filter matrix values...\" type=\"text\" />", "onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} placeholder=\"Filter matrix values...\" type=\"text\" />")
code = code.replace("onChange={(e) = /> setSearchQuery(e.target.value)}", "onChange={(e) => setSearchQuery(e.target.value)}")

with open('components/conversion/GramsHubClient.tsx', 'w') as f:
    f.write(code)

