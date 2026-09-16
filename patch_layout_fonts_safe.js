const fs = require('fs');
const file = 'app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Try to find the buggy onLoad version
const buggyPattern = /<link\s+rel="preload"\s+as="style"\s+href="https:\/\/fonts\.googleapis\.com[^>]+>\s*<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com[^>]+media="print"[\s\S]*?<\/noscript>/g;

// Also try to find the standard version
const standardPattern = /<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined:opsz,wght,FILL,GRAD@20\.\.48,100\.\.700,0\.\.1,-50\.\.200&display=swap"\s+\/>/g;

const replacement = `<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: \`
          var l = document.createElement('link');
          l.rel = 'stylesheet';
          l.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
          document.head.appendChild(l);
        \` }} />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        </noscript>`;

if (content.match(buggyPattern)) {
    content = content.replace(buggyPattern, replacement);
} else if (content.match(standardPattern)) {
    content = content.replace(standardPattern, replacement);
}

fs.writeFileSync(file, content);
