const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "export const metadata: Metadata = {",
  "export const metadata: Metadata = {\n  metadataBase: new URL('https://solveitcalculator.com'),"
);
fs.writeFileSync(file, content);
