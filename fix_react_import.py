import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# Remove the duplicate import
content = content.replace("import React, { useEffect, useState } from 'react';\n", "")

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
