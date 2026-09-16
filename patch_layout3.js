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
        </Script>
`;

// Remove the incorrect placement
content = content.replace(scriptBlock, "");

// Add it correctly into <head>
content = content.replace("<head>\n", "<head>\n" + scriptBlock);

fs.writeFileSync(file, content);
