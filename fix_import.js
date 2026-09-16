const fs = require('fs');

let header = fs.readFileSync('components/Header.tsx', 'utf8');

header = header.replace(
  "import { getCurrentTheme, toggleTheme } from '../lib/theme';",
  "import { getCurrentTheme, toggleTheme } from '../lib/theme';\nimport SearchModal from './SearchModal';"
);

fs.writeFileSync('components/Header.tsx', header);
console.log("Fixed import.");
