const fs = require('fs');
let content = fs.readFileSync('app/finance/FinanceHubClient.tsx', 'utf-8');

// The beta section starts with 'Option B (Beta)'
const parts = content.split('{/* Option B (Beta) */}');
if(parts.length > 1) {
  let betaPart = parts[1];
  betaPart = betaPart.replace(/{currentBattle\.alpha\.annualLabel}/g, '{currentBattle.beta.annualLabel}');
  betaPart = betaPart.replace(/{currentBattle\.alpha\.costLabel}/g, '{currentBattle.beta.costLabel}');
  content = parts[0] + '{/* Option B (Beta) */}' + betaPart;
  fs.writeFileSync('app/finance/FinanceHubClient.tsx', content);
}
