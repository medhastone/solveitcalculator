const fs = require('fs');
let content = fs.readFileSync('app/math/[slug]/data.ts', 'utf8');
content = content.replace(/Cramer's/g, 'Cramer\\\'s');
fs.writeFileSync('app/math/[slug]/data.ts', content);
