const fs = require('fs');
const file = 'app/finance/emi-calculator/EmiCalculatorClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inside component: Get SEO content based on activeCountry
content = content.replace('  const config = COUNTRY_CONFIGS[activeCountry];', 
`  const config = COUNTRY_CONFIGS[activeCountry];
  const seoData = localizedSeoContent[activeCountry.toLowerCase() as keyof typeof localizedSeoContent];`);

// Replace H1
content = content.replace(
  'Universal Home Loan EMI &amp; Mortgage Payoff Workbench',
  '{seoData?.meta?.h1 || "Universal Home Loan EMI & Mortgage Payoff Workbench"}'
);

// Replace subtitle description (optional, let's keep the existing one or replace it)
content = content.replace(
  'Compute amortization profiles, evaluate multi-scenario early payoff schedules, interest erosion, and regulatory quirks. Fully calibrated for India (RBI), USA (CFPB), Canada (FCAC semi-annual compounding), Australia (ASIC offset), and UK (FCA).',
  '{seoData?.meta?.metaDescription || "Compute amortization profiles, evaluate multi-scenario early payoff schedules, interest erosion, and regulatory quirks."}'
);

fs.writeFileSync(file, content);
console.log('Patched Hero');
