const fs = require('fs');
let content = fs.readFileSync('app/HomePageClient.tsx', 'utf8');

// Update dirCardsData entry
content = content.replace(
  'name: "SIP Return Calculator",',
  'name: "Investing & Growth (SIP & ROI)",'
);

content = content.replace(
  'title: "SIP Return Compounder",',
  'title: "Investing & Growth Compounder",'
);

fs.writeFileSync('app/HomePageClient.tsx', content);
console.log("Fix 2 complete.");
