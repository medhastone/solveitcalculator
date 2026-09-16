with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# Make sure 'use client' is exactly at the top.
# And remove any other 'use client' in the code.
content = content.replace("'use client';", "")
content = content.replace("import React, { useState, useEffect } from 'react';\n", "")

content = "'use client';\nimport React, { useState, useEffect } from 'react';\n" + content

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)
