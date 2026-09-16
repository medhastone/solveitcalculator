const fs = require('fs');
let file = 'app/bmi-calculator/page.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'\.\.\/health\/bmi\/BmiClient'/, "'../health-fitness-calculators/bmi/BmiClient'");
  fs.writeFileSync(file, content);
}
file = 'app/health-fitness/page.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'\.\.\/health\/HealthClient'/, "'../health-fitness-calculators/HealthClient'");
  fs.writeFileSync(file, content);
}
