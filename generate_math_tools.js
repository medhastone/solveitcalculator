const fs = require('fs');

const file = 'app/math/MathHubClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to find the categories array and extract tools.
// The categories array is something like `const categories = [...]`

const tools = [];

const lines = content.split('\n');
let inTools = false;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('tools: [')) {
        inTools = true;
        continue;
    }
    if (inTools) {
        if (line.includes(']')) {
            inTools = false;
            continue;
        }
        // Extract string
        const match = line.match(/'([^']+)'/);
        if (match) {
            tools.push(match[1]);
        } else {
            const match2 = line.match(/"([^"]+)"/);
            if (match2) tools.push(match2[1]);
        }
    }
}

console.log("Found " + tools.length + " tools.");

// Generate a slug from a tool name
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const toolObjects = tools.map(t => ({ name: t, slug: slugify(t) }));

fs.writeFileSync('math_tools_list.json', JSON.stringify(toolObjects, null, 2));
