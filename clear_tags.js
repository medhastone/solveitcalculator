const fs = require('fs');

let content = fs.readFileSync('app/finance/FinanceHubClient.tsx', 'utf-8');

// Use a regex to find all `tags: [ ... ],` blocks and replace them with `tags: [],`
content = content.replace(/tags:\s*\[[\s\S]*?\],/g, 'tags: [],');

fs.writeFileSync('app/finance/FinanceHubClient.tsx', content);

console.log("Successfully cleared tags from all domains.");
