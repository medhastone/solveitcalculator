const fs = require('fs');
const file = 'app/health-fitness-calculators/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const h1Old = /<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">\s*Health &amp; Fitness Calculators\s*<\/h1>/;
const h1New = `<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Health &amp; Fitness Calculators
                </h1>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2">
                Health & Fitness Calculators for Better Wellness Decisions
              </h2>`;
              
const descOld = /<p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg leading-relaxed">\s*Track body composition, athletic performance, metabolic expenditure, cardiovascular health, hydration, circadian recovery, and maternity milestones with peer-reviewed clinical algorithms.\s*<\/p>/;
const descNew = `<p className="font-body-lg text-body-lg text-on-surface-variant mb-space-sm leading-relaxed">
                Track your health goals with free calculators for BMI, calories, body fat, weight loss, nutrition, fitness, pregnancy, and overall wellness.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed max-w-4xl mx-auto">
                Explore free Health & Fitness Calculators designed to help you track wellness, nutrition, weight management, calorie intake, body composition, and fitness goals. Use accurate tools including BMI Calculator, Calorie Calculator, Body Fat Calculator, BMR Calculator, TDEE Calculator, Heart Rate Calculator, Pregnancy Calculator, and many more to make informed health decisions.
              </p>`;

content = content.replace(h1Old, h1New);
content = content.replace(descOld, descNew);

fs.writeFileSync(file, content);
console.log("Patched hero section");
