const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the script inject block with the new FontLoader
const targetRegex = /<script dangerouslySetInnerHTML={{ __html: `[\s\S]*?` }} \/>/g;

// Add import
if (!content.includes('import FontLoader')) {
  content = content.replace("import Footer from '@/components/Footer';", "import Footer from '@/components/Footer';\nimport FontLoader from '@/components/FontLoader';");
}

content = content.replace(targetRegex, "<FontLoader />");

fs.writeFileSync(file, content);
