import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates static HTML redirect files in ./out for GitHub Pages hosting,
 * ensuring all legacy URLs and duplicate consolidations defined in next.config.ts
 * continue to redirect cleanly to their canonical URLs without a Node server.
 */
const OUT_DIR = path.resolve(process.cwd(), 'out');
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const STATIC_REDIRECTS = [
  ['/percentage-calculator', '/math/percentage-calculator'],
  ['/flooring-calculator', '/home-construction/flooring-calculator'],
  ['/all-calculators', '/calculators'],
  ['/unit-conversion', '/conversions'],
  ['/unit-converter', '/conversions/length'],
  ['/recipe-converters', '/recipe-converter'],
  ['/privacy-and-accessibility', '/privacy-policy'],
  ['/math-guides/percentages', '/guides/how-to-calculate-a-percentage'],
  ['/salary-tax-calculator', '/finance/take-home-pay-calculator'],
  ['/articles', '/guides'],
  ['/math/gcf-lcm-calculator', '/math/gcd-and-lcm-calculator'],
  ['/math/exponent-root-calculator', '/math/exponent-calculator'],
  ['/math/quadratic-equation-solver', '/math/quadratic-equation-calculator'],
  ['/finance/margin-and-markup-calculator', '/finance/margin-calculator'],
  ['/length-converter', '/conversions/length'],
  ['/weight-converter', '/conversions/weight'],
  ['/temperature-converter', '/conversions/temperature'],
  ['/volume-converter', '/conversions/volume'],
  ['/cooking-converter', '/conversions/cooking'],
  ['/area-converter', '/conversions/area'],
  ['/speed-converter', '/conversions/speed'],
  ['/conversions/weight-mass', '/conversions/weight'],
  ['/conversions/volume-capacity', '/conversions/volume'],
  ['/conversions/data', '/conversions/digital'],
  ['/cooking/ingredient-converter', '/recipe-converter'],
  ['/conversions/mass-volume/milk-weight-calculator', '/recipe-converter'],
  ['/conversions/area/linear-feet-to-square-feet', '/conversions/area'],
  ['/construction/concrete-calculator', '/construction-project-calculator'],
  ['/construction/flooring-calculator', '/home-construction/flooring-calculator'],
  ['/finance/mortgage-calculator', '/mortgage-calculator'],
  ['/finance/compound-interest', '/compound-interest-calculator'],
  ['/finance/sip-calculator', '/compound-interest-calculator'],
  ['/finance/roi-calculator', '/finance/investment-growth-calculator'],
  ['/finance/cagr-calculator', '/finance/investment-growth-calculator'],
  ['/finance/savings-goal-calculator', '/compound-interest-calculator'],
  ['/finance/inflation-calculator', '/finance/real-rate-of-return-calculator'],
  ['/freelance-hourly-rate-calculator', '/finance/salary-to-hourly-calculator'],
  ['/work-hours-payroll-calculator', '/time-duration-calculator'],
  ['/math/order-of-operations-calculator', '/math/scientific-calculator'],
  ['/math/percentage-difference-calculator', '/math/percentage-change-calculator'],
  ['/math/mean-median-mode-calculator', '/math/average-calculator'],
  ['/math/proportion-calculator', '/math/ratio-calculator'],
  ['/math/lcm-gcd-calculator', '/math/gcd-and-lcm-calculator'],
  ['/math/linear-equation-solver', '/math/equation-solver'],
  ['/math/rounding-calculator', '/math/average-calculator'],
  ['/math/decimal-to-fraction-calculator', '/math/fraction-to-decimal-calculator'],
  ['/time-date', '/date-time'],
  ['/time-date/age-calculator', '/age-calculator'],
  ['/time-date/pet-age-converter', '/age-calculator'],
  ['/time-date/date-difference', '/date-difference-calculator'],
  ['/time-date/days-between-dates', '/date-difference-calculator'],
  ['/time-date/days-from-today', '/days-from-today-calculator'],
  ['/time-date/add-subtract-days', '/days-from-today-calculator'],
  ['/time-date/business-days', '/business-days-calculator'],
  ['/time-date/business-days-calculator', '/business-days-calculator'],
  ['/time-date/leap-year-calculator', '/date-difference-calculator'],
  ['/time-date/julian-day-calculator', '/date-difference-calculator'],
  ['/time-date/countdown-timer', '/countdown-calculator'],
  ['/time-date/event-countdown', '/countdown-calculator'],
  ['/time-date/retirement-countdown', '/countdown-calculator'],
  ['/time-date/work-hours', '/work-hours-calculator'],
  ['/time-date/add-subtract-time', '/time-duration-calculator'],
  ['/time-date/add-subtract-time-calculator', '/time-duration-calculator'],
  ['/time-date/focus-and-break-timers', '/timer-stopwatch'],
  ['/time-date/timer', '/timer-stopwatch'],
  ['/time-date/stopwatch', '/timer-stopwatch'],
  ['/time-date/90-minute-ultradian-rhythm-planner', '/timer-stopwatch'],
  ['/time-date/running-pace-calculator', '/time-duration-calculator'],
  ['/time-date/military-time-converter', '/military-time-converter'],
  ['/time-date/time-converter', '/time-unit-converter'],
  ['/time-date/unix-timestamp-converter', '/date-time'],
  ['/time-date/time-zone-converter', '/date-time'],
  ['/time-date/world-clock-grid', '/date-time'],
  ['/health-fitness-calculators', '/health-fitness'],
  ['/health-fitness/bmi-calculator', '/bmi-calculator'],
  ['/health-fitness/tdee', '/tdee-calculator'],
  ['/health-fitness-calculators/tdee-calculator', '/tdee-calculator'],
  ['/health-fitness/bmr', '/bmr-calculator'],
  ['/health-fitness-calculators/bmr-calculator', '/bmr-calculator'],
  ['/health-fitness/body-fat', '/body-fat-calculator'],
  ['/health-fitness-calculators/body-fat-calculator', '/body-fat-calculator'],
  ['/health-fitness/ideal-body-weight', '/ideal-weight-calculator'],
  ['/health-fitness-calculators/ideal-weight-calculator', '/ideal-weight-calculator'],
  ['/health-fitness/target-heart-rate', '/tdee-calculator'],
  ['/conversions/mass', '/conversions/weight'],
  ['/conversions/fuel_economy', '/conversions/fuel-economy'],
  ['/conversions/data-storage', '/conversions/digital'],
  ['/conversions/grams-to-tablespoons', '/conversions/cooking'],
  ['/conversions/pressure', '/conversions'],
  ['/conversions/power', '/conversions/energy'],
  ['/about-us', '/about'],
  ['/privacy', '/privacy-policy'],
  ['/terms-of-use', '/terms-of-service'],
  ['/terms', '/terms-of-service'],
  ['/finance/hourly-to-salary-calculator', '/finance/salary-to-hourly-calculator'],
  ['/finance/overtime-calculator', '/finance/overtime-pay-calculator'],
  ['/finance/uk-salary-tax-calculator', '/finance/uk-paye-calculator'],
  ['/finance/canada-salary-tax-calculator', '/finance/canada-income-tax-calculator'],
  ['/finance/australia-salary-tax-calculator', '/salary-calculator'],
  ['/finance/salary-After-Tax-Comparison-Calculator', '/salary-calculator'],
  ['/finance/fire-calculator', '/fire-forecaster'],
  ['/finance/fire-forecaster', '/fire-forecaster'],
  ['/finance/npv-calculator', '/finance/investment-growth-calculator'],
  ['/finance/discount-calculator', '/math/discount-calculator'],
  ['/science/kinematics-calculator', '/science/force-calculator'],
];

if (!fs.existsSync(OUT_DIR)) {
  console.log('[gh-pages] ./out directory not found; skipping redirect generation.');
  process.exit(0);
}

// Ensure .nojekyll exists in ./out
fs.writeFileSync(path.join(OUT_DIR, '.nojekyll'), '');

let createdCount = 0;
for (const [source, destination] of STATIC_REDIRECTS) {
  const targetUrl = `${BASE_PATH}${destination}`;
  const canonicalUrl = `https://solveitcalculator.com${destination}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Redirecting to ${destination} | SolveItCalculator</title>
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="noindex" />
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${destination}</a>...</p>
</body>
</html>
`;

  const cleanRel = source.replace(/^\//, '');
  const htmlFilePath = path.join(OUT_DIR, `${cleanRel}.html`);
  const indexFilePath = path.join(OUT_DIR, cleanRel, 'index.html');

  fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });
  if (!fs.existsSync(htmlFilePath)) {
    fs.writeFileSync(htmlFilePath, html, 'utf8');
  }

  fs.mkdirSync(path.dirname(indexFilePath), { recursive: true });
  if (!fs.existsSync(indexFilePath)) {
    fs.writeFileSync(indexFilePath, html, 'utf8');
  }
  createdCount++;
}

console.log(`[gh-pages] Generated ${createdCount} static redirect routes and .nojekyll in ./out`);
