with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# Make sure imports are present
if "import React, { useState, useEffect } from 'react';" not in content:
    content = "import React, { useState, useEffect } from 'react';\n" + content

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
