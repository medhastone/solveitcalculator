const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Use regex to fix the modal conditions with missing parentheses
content = content.replace(
  /\{activeModal === 'macro-split' \|\| activeModal === 'macros' && 'Macro Splitter'\}/g,
  "{(activeModal === 'macro-split' || activeModal === 'macros') && 'Macro Splitter'}"
);
content = content.replace(
  /\{activeModal === 'lbm' \|\| activeModal === 'lean-mass' && 'Lean Body Mass'\}/g,
  "{(activeModal === 'lbm' || activeModal === 'lean-mass') && 'Lean Body Mass'}"
);
content = content.replace(
  /\{activeModal === 'macro-split' \|\| activeModal === 'macros' && \(/g,
  "{(activeModal === 'macro-split' || activeModal === 'macros') && ("
);
content = content.replace(
  /\{activeModal === 'lbm' \|\| activeModal === 'lean-mass' && \(/g,
  "{(activeModal === 'lbm' || activeModal === 'lean-mass') && ("
);

fs.writeFileSync(file, content);
console.log('Patched modal logic');
