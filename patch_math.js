const fs = require('fs');
const file = 'app/math/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('generateStaticParams')) {
  // We need to import mathToolsData to generate params
  if (!content.includes('mathToolsData')) {
    content = content.replace('getToolData } from \'./data\'', 'getToolData, mathToolsData } from \'./data\'');
  }
  
  const insertIndex = content.indexOf('export async function generateMetadata');
  const code = `
export function generateStaticParams() {
  return Object.keys(mathToolsData).map((slug) => ({
    slug,
  }));
}
`;
  content = content.slice(0, insertIndex) + code + content.slice(insertIndex);
  fs.writeFileSync(file, content);
}
