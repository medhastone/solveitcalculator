const fs = require('fs');

const home = fs.readFileSync('./app/HomePageClient.tsx', 'utf8');

const categoriesMatch = home.match(/const categoriesData = (\[[\s\S]*?\]);/);
const trendingMatch = home.match(/const trendingData = (\[[\s\S]*?\]);/);
const dirCardsMatch = home.match(/const dirCardsData = (\[[\s\S]*?\]);/);

let out = `export const categoriesData = ${categoriesMatch[1]};\n\n`;
out += `export const trendingData = ${trendingMatch[1]};\n\n`;
out += `export const dirCardsData = ${dirCardsMatch[1]};\n\n`;

out += `export const allUniqueTools = Array.from(new Map([
  ...dirCardsData.map(c => [c.link, { ...c, title: c.name || c.title }]),
  ...trendingData.map(c => [c.link, { ...c, name: c.title, label: "Trending" }]),
].values()));
`;

fs.writeFileSync('./lib/searchData.ts', out);
console.log("Created searchData.ts");
