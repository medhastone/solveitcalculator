const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{activeModal && !\[.*?\]\.includes\(activeModal\) && \(/;
content = content.replace(
  regex,
  `{(activeModal && !['ibw', 'ffmi', 'whr', 'whtr', 'bsa', 'absi', 'deficit', 'protein-rda', 'carb-cycling', 'keto', 'velocity', 'lbm', 'lean-mass'].includes(activeModal)) && (`
);

// If it's still {activeModal && (
content = content.replace(
  /\{activeModal && \(\n\s*<div className="fixed inset-0/,
  `{(activeModal && !['ibw', 'ffmi', 'whr', 'whtr', 'bsa', 'absi', 'deficit', 'protein-rda', 'carb-cycling', 'keto', 'velocity', 'lbm', 'lean-mass'].includes(activeModal)) && (\n        <div className="fixed inset-0`
);

fs.writeFileSync(file, content);
console.log("Patched internal modal");
