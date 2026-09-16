const fs = require('fs');

const files = [
  'app/health/HealthClient.tsx',
  'app/finance/FinanceHubClient.tsx',
  'app/daily-wage-calculator/DailyWageClient.tsx',
  'app/salary-and-payroll/SalaryAndPayrollClient.tsx',
  'app/about-us/AboutClient.tsx',
  'app/volume-converter/VolumeConverterClient.tsx',
  'app/article/how-to-calculate-bmi/page.tsx',
  'app/article/investment-planning-basics/page.tsx',
  'app/article/how-emi-works/page.tsx',
  'app/article/understanding-gst/page.tsx'
];

files.forEach(filepath => {
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Find <header ... </header>
    const headerStart = content.indexOf('<header');
    if (headerStart !== -1) {
      const headerEnd = content.indexOf('</header>', headerStart);
      if (headerEnd !== -1) {
        content = content.slice(0, headerStart) + content.slice(headerEnd + '</header>'.length);
        fs.writeFileSync(filepath, content);
        console.log(`Fixed ${filepath}`);
      }
    }
  }
});
