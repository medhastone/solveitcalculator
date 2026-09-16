const fs = require('fs');
let content = fs.readFileSync('app/math/[slug]/data.ts', 'utf8');
content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('app/math/[slug]/data.ts', content);
