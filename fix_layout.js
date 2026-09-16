const fs = require('fs');

let content = fs.readFileSync('app/layout.tsx', 'utf-8');
content = content.replace(
  "import ScrollNavigation from '@/components/ScrollNavigation';",
  "import ScrollNavigation from '@/components/ScrollNavigation';\nimport Header from '@/components/Header';"
);
content = content.replace(
  "{children}",
  "<Header />\n        {children}"
);
fs.writeFileSync('app/layout.tsx', content);
