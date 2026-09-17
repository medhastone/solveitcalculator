const fs = require('fs');
const file = 'app/HomePageClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace static import with dynamic import
content = content.replace(
  "import HomePageSeoSections from './HomePageSeoSections';",
  "import dynamic from 'next/dynamic';\nconst HomePageSeoSections = dynamic(() => import('./HomePageSeoSections'), { ssr: false });"
);

fs.writeFileSync(file, content);
