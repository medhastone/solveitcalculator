const fs = require('fs');
let content = fs.readFileSync('app/HomePageClient.tsx', 'utf8');

content = content.replace(
  'desc: "Mutual fund projections with historical benchmarks.",',
  'desc: "Mutual fund projections, investing returns, and growth benchmarks.",'
);

fs.writeFileSync('app/HomePageClient.tsx', content);
console.log("Fix 3 complete.");
