const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

const scriptBlock = `        <Script id="material-symbols-loader" strategy="beforeInteractive">
          {\`
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
            document.head.appendChild(l);
          \`}
        </Script>`;

// Remove the JS-based loader
content = content.replace(scriptBlock, "");

// Add a standard, render-blocking CSS link into head
const cssLink = `        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />`;

content = content.replace(
  '<link rel="preconnect" href="https://fonts.googleapis.com" />',
  '<link rel="preconnect" href="https://fonts.googleapis.com" />\n' + cssLink
);

fs.writeFileSync(file, content);
