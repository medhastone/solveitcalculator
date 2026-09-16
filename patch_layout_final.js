const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove import FontLoader
content = content.replace("import FontLoader from '@/components/FontLoader';\n", "");
content = content.replace("import FontLoader from '@/components/FontLoader';", "");

// Replace <FontLoader /> with nothing
content = content.replace("        <FontLoader />\n", "");

// Add the Script after <body ...>
const scriptText = `
        <Script id="material-symbols-loader" strategy="beforeInteractive">
          {\`
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
            document.head.appendChild(l);
          \`}
        </Script>
`;
content = content.replace(
  'suppressHydrationWarning>\n',
  'suppressHydrationWarning>\n' + scriptText
);

fs.writeFileSync(file, content);
