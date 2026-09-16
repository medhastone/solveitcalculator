const fs = require('fs');
const file = 'app/health-fitness-calculators/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const jsonLdStart = /__html: JSON\.stringify\(\{/;
if (content.match(jsonLdStart)) {
  // It's easier to just replace the whole JSON.stringify block
  // Let's replace name and description in JSON-LD manually using replace
  
  content = content.replace(
    /name: 'Health & Fitness Calculators \| SolveIt Calculator',/,
    "name: 'Health & Fitness Calculators – BMI, Calories, Weight Loss & More | SolveItCalculator',"
  );
  content = content.replace(
    /description:\s*'Track body composition, metabolic expenditure, cardiovascular health, hydration, circadian recovery, and maternity milestones with clinical-grade peer-reviewed algorithms.',/,
    "description: 'Use free health and fitness calculators for BMI, calorie needs, body fat, weight loss, BMR, TDEE, heart rate, pregnancy, and nutrition planning. Fast and accurate.',"
  );
  fs.writeFileSync(file, content);
  console.log("Patched JSON-LD");
} else {
  console.log("JSON-LD not found");
}
