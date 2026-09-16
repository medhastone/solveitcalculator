const fs = require('fs');
const file = 'app/math/MathHubClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `            {/* Telemetry Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-xl mt-space-xl border-t border-outline-variant/20 bg-surface-container-low/60 rounded-xl p-space-md">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-primary font-data-mono">500+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">MATH CALCULATORS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-mono">1,000+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">FORMULAS &amp; GUIDES</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-secondary font-data-mono">8.4M+</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">PROBLEMS SOLVED</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-mono">100%</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">FREE &amp; PRIVATE TO USE</span>
              </div>
            </div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully removed telemetry stats strip.');
} else {
    console.log('Target string not found.');
}
