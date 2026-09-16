const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import FontLoader')) {
  content = content.replace(
    "import Footer from '@/components/Footer';",
    "import Footer from '@/components/Footer';\nimport FontLoader from '@/components/FontLoader';"
  );
}

// Check what is currently there for the fonts
const scriptRegex = /<script dangerouslySetInnerHTML={{ __html: \`[\s\S]*?\` }} \/>/;
if (content.match(scriptRegex)) {
  content = content.replace(scriptRegex, '<FontLoader />');
} else {
  // Maybe it's missing entirely or has the original link
  // Let's just put it inside head
  const headEnd = "</head>";
  if (!content.includes('<FontLoader />')) {
      content = content.replace(headEnd, "  <FontLoader />\n      </head>");
  }
}

fs.writeFileSync(file, content);
