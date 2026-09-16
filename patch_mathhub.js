const fs = require('fs');

const file = 'app/math/MathHubClient.tsx';
let content = fs.readFileSync(file, 'utf8');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// We need to replace the strings in tools: [...] with objects { name: '...', slug: '...' }
// But wait, it's easier to just change the rendering loop!
// Currently it is:
// {cat.tools.map((tool, idx) => (
//   <li key={idx}>
//     <a
//       href="#quick-solve"
//       className="text-primary hover:underline flex items-center justify-between group-hover:text-primary transition-colors"
//     >
//       <span>{tool}</span>

// If we change it to use slugify(tool) in the href, we don't even need to modify the huge array!
const oldRender = `{cat.tools.map((tool, idx) => (
                      <li key={idx}>
                        <a
                          href="#quick-solve"
                          className="text-primary hover:underline flex items-center justify-between group-hover:text-primary transition-colors"
                        >
                          <span>{tool}</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                        </a>
                      </li>
                    ))}`;

const newRender = `{cat.tools.map((tool, idx) => {
                      const slug = tool.toString().toLowerCase().replace(/\\s+/g, '-').replace(/[^\\w\\-]+/g, '').replace(/\\-\\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
                      return (
                      <li key={idx}>
                        <Link
                          href={\`/math/\${slug}\`}
                          className="text-primary hover:underline flex items-center justify-between group-hover:text-primary transition-colors"
                        >
                          <span>{tool}</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                        </Link>
                      </li>
                    );})}`;

if (content.includes(oldRender)) {
    content = content.replace(oldRender, newRender);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully patched rendering loop.");
} else {
    console.log("Could not find the rendering loop. Let me try a regex.");
    const regex = /\{cat\.tools\.map\(\(tool,\s*idx\)\s*=>\s*\([\s\S]*?<\/li>\s*\)\)\}/;
    if (regex.test(content)) {
        content = content.replace(regex, newRender);
        fs.writeFileSync(file, content, 'utf8');
        console.log("Successfully patched rendering loop with regex.");
    } else {
        console.log("Regex also failed.");
    }
}
