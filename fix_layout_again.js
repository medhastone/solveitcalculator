const fs = require('fs');
let content = fs.readFileSync('app/layout.tsx', 'utf-8');
if (!content.includes('<Header />')) {
  content = content.replace('{children}', '<Header />\n        {children}');
  fs.writeFileSync('app/layout.tsx', content);
}
