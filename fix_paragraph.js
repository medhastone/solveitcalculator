const fs = require('fs');
const file = 'app/health-fitness-calculators/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `<p className="font-body-lg text-body-lg text-on-surface-variant mb-space-sm leading-relaxed">
                Track your health goals with free calculators for BMI, calories, body fat, weight loss, nutrition, fitness, pregnancy, and overall wellness.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed max-w-4xl mx-auto">
                Explore free Health & Fitness Calculators designed to help you track wellness, nutrition, weight management, calorie intake, body composition, and fitness goals. Use accurate tools including BMI Calculator, Calorie Calculator, Body Fat Calculator, BMR Calculator, TDEE Calculator, Heart Rate Calculator, Pregnancy Calculator, and many more to make informed health decisions.
              </p>`;

const newStr = `<p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg leading-relaxed">
                Track your health goals with free calculators for BMI, calories, body fat, weight loss, nutrition, fitness, pregnancy, and overall wellness.
              </p>`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(file, content);
  console.log("Success");
} else {
  console.log("String not found");
}
