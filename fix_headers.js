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

let numModified = 0;

walk('app', (filepath) => {
    if (filepath.endsWith('.tsx') || filepath.endsWith('.jsx')) {
        let content = fs.readFileSync(filepath, 'utf-8');
        let modified = false;

        // Remove <Header /> and <Header/>
        if (content.includes('<Header />') || content.includes('<Header/>')) {
            content = content.replace(/<Header\s*\/>/g, '');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filepath, content);
            numModified++;
        }
    }
});

console.log('Modified ' + numModified + ' files.');
