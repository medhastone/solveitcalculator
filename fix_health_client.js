const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Delete lines 2486 to 2750 (0-indexed: 2485 to 2749)
lines.splice(2485, 2750 - 2486 + 1);

let content = lines.join('\n');

const brokenIds = [
  'ibw', 'ffmi', 'whr', 'whtr', 'bsa', 'absi', 'deficit', 'protein-rda', 'carb-cycling', 'keto', 'velocity', 'lbm', 'lean-mass'
];

// Clean up the fallback arrays
for (const id of brokenIds) {
  content = content.replaceAll(`'${id}', `, "");
  content = content.replaceAll(`, '${id}'`, "");
}

fs.writeFileSync(file, content);
console.log('Fixed broken calculator stubs and arrays.');
