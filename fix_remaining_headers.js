const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, callback);
        } else {
            callback(filepath);
        }
    });
}

walk('app', (filepath) => {
    if (filepath.endsWith('.tsx') || filepath.endsWith('.jsx')) {
        let content = fs.readFileSync(filepath, 'utf-8');
        let modified = false;

        // Remove <Header /> and <Header/> and <Header ></Header>
        if (content.includes('<Header')) {
            content = content.replace(/<Header[^>]*>[\s\S]*?<\/Header>/g, '');
            content = content.replace(/<Header\s*\/>/g, '');
            modified = true;
        }

        // Only save if modified
        if (modified) {
            fs.writeFileSync(filepath, content);
            console.log(`Fixed ${filepath}`);
        }
    }
});
