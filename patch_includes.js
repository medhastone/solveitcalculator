const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldArray = "['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm', 'macros', 'lean-mass', 'mets', 'running-pace', 'ftp', 'rucking', 'thr', 'map', 'hrr', 'pulse-pressure', 'max-hr', 'sleep-debt', 'ess', 'ovulation', 'hcg']";
const newArray = "['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm', 'macros', 'macro-split', 'lean-mass', 'lbm', 'mets', 'running-pace', 'ftp', 'rucking', 'thr', 'map', 'hrr', 'pulse-pressure', 'max-hr', 'sleep-debt', 'ess', 'ovulation', 'hcg', 'ibw', 'ffmi', 'whr', 'whtr', 'bsa', 'absi', 'deficit', 'protein-rda', 'carb-cycling', 'keto', 'velocity']";

content = content.replace(oldArray, newArray);
content = content.replace(oldArray, newArray);

fs.writeFileSync(file, content);
console.log('Patched includes');
