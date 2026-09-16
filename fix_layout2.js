const fs = require('fs');
let content = fs.readFileSync('app/layout.tsx', 'utf-8');
content = content.replace("export default function RootLayout(<Header />\n        {children}: {children: React.ReactNode}) {", "export default function RootLayout({children}: {children: React.ReactNode}) {");
content = content.replace("{/* End Google Tag Manager (noscript) */}\n        {children}", "{/* End Google Tag Manager (noscript) */}\n        <Header />\n        {children}");
fs.writeFileSync('app/layout.tsx', content);
