const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure we don't have multiple ?v=2
content = content.replace(/\?v=2\?v=2/g, "?v=2");
fs.writeFileSync(file, content);
