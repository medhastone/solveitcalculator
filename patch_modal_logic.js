const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the title conditions
content = content.replace(
  "{activeModal === 'macro-split' || activeModal === 'macros' && 'Macro Splitter'}",
  "{(activeModal === 'macro-split' || activeModal === 'macros') && 'Macro Splitter'}"
);
content = content.replace(
  "{activeModal === 'lbm' || activeModal === 'lean-mass' && 'Lean Body Mass'}",
  "{(activeModal === 'lbm' || activeModal === 'lean-mass') && 'Lean Body Mass'}"
);

// Fix the body conditions
content = content.replace(
  "{activeModal === 'macro-split' || activeModal === 'macros' && (",
  "{(activeModal === 'macro-split' || activeModal === 'macros') && ("
);
content = content.replace(
  "{activeModal === 'lbm' || activeModal === 'lean-mass' && (",
  "{(activeModal === 'lbm' || activeModal === 'lean-mass') && ("
);

// Wait, I also need to check if there are other issues with the slug for Calorie Deficit & Surplus Planner...
// Wait, Calorie Planner defaults to full-page mode?
// The ID in the tool list for "Calorie Deficit & Surplus Planner" is 'calorie-deficit'.
// Wait, let's grep for it.
