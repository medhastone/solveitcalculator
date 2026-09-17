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

// Remove from head
content = content.replace(scriptBlock, "");

// Add to body
content = content.replace("<body ", scriptBlock + "      <body ");

fs.writeFileSync(file, content);
