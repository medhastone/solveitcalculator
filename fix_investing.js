const fs = require('fs');
let content = fs.readFileSync('app/HomePageClient.tsx', 'utf8');

// Update trendingData entry
content = content.replace(
  'title: "Investment Calculator",\n    desc: "Calculate compound interest and SIP returns.",',
  'title: "Investing & Growth",\n    desc: "Calculate compound interest, investment returns, and SIP.",'
);

// Update dirCardsData entry
content = content.replace(
  'name: "SIP Return Calculator",\n    title: "SIP Return Compounder",\n    rating: "4.9",\n    count: "30.5k",\n    desc: "Calculate SIP, lump sum, and compound interest returns.",',
  'name: "Investing & Growth (SIP & ROI)",\n    title: "Investing & Growth Compounder",\n    rating: "4.9",\n    count: "30.5k",\n    desc: "Calculate SIP, lump sum, investing returns, and compound growth.",'
);

// Update the exact route in handleHeroSubmit
const submitLogic = `if (query.includes("mortgage")) {
      window.location.href = "/finance/mortgage-calculator";
      return;
    }`;
const newSubmitLogic = `if (query.includes("mortgage")) {
      window.location.href = "/finance/mortgage-calculator";
      return;
    }
    if (query.includes("invest") || query.includes("growth")) {
      window.location.href = "/investing-and-growth";
      return;
    }`;
content = content.replace(submitLogic, newSubmitLogic);

fs.writeFileSync('app/HomePageClient.tsx', content);
console.log("Fix complete.");
