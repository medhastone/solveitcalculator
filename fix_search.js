const fs = require('fs');
let content = fs.readFileSync('app/HomePageClient.tsx', 'utf8');

const oldSearchLogic = `const matchedTools = dirCardsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.desc.toLowerCase().includes(query) ||
      c.label.toLowerCase().includes(query)
    ).slice(0, 5);`;

const newSearchLogic = `// Gather all tools from multiple arrays and deduplicate by link
    const allUniqueTools = Array.from(new Map([
      ...dirCardsData.map(c => [c.link, { ...c, title: c.name || c.title }]),
      ...trendingData.map(c => [c.link, { ...c, name: c.title, label: "Trending" }]),
    ].values()));

    const matchedTools = allUniqueTools.filter(c =>
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.desc && c.desc.toLowerCase().includes(query)) ||
      (c.label && c.label.toLowerCase().includes(query)) ||
      (c.title && c.title.toLowerCase().includes(query))
    ).slice(0, 5);`;

content = content.replace(oldSearchLogic, newSearchLogic);

fs.writeFileSync('app/HomePageClient.tsx', content);
console.log("Fix complete.");
