import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates server/edge 301 redirect rules (_redirects) for Cloudflare Pages / Netlify
 * without creating any client-side "Redirecting to ..." HTML stub pages.
 */
const OUT_DIR = path.resolve(process.cwd(), 'out');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const nextConfigText = fs.readFileSync(path.resolve(process.cwd(), 'next.config.ts'), 'utf8');
const pairs = [
  ...nextConfigText.matchAll(/\['(\/[^']+)',\s*'(\/[^']+)'\]/g),
].map((m) => [m[1], m[2]]);

const lines = [
  '# Server-side 301 Redirects for SolveItCalculator.com (Zero Redirect Chains)',
  ...pairs.map(([source, destination]) => {
    const cfSource = source.replace(/\/:[a-zA-Z0-9_]+\*/g, '/*');
    return `${cfSource} ${destination} 301`;
  }),
  '',
].join('\n');

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), lines, 'utf8');

if (fs.existsSync(OUT_DIR)) {
  fs.writeFileSync(path.join(OUT_DIR, '.nojekyll'), '');
  fs.writeFileSync(path.join(OUT_DIR, '_redirects'), lines, 'utf8');
  console.log(`[edge-redirects] Wrote ${pairs.length} server-side 301 rules to out/_redirects`);
} else {
  console.log(`[edge-redirects] Wrote ${pairs.length} server-side 301 rules to public/_redirects`);
}
