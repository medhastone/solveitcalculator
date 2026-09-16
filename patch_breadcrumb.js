const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace HTML breadcrumbs
const oldHtml = `<Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Home
              </Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" href="/convert">
                Categories
              </Link>
              <span className="text-outline-variant">/</span>`;

const newHtml = `<Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Home
              </Link>
              <span className="text-outline-variant">/</span>`;

if (content.includes(oldHtml)) {
  content = content.replace(oldHtml, newHtml);
  console.log("HTML breadcrumb replaced.");
} else {
  console.log("Old HTML breadcrumb not found!");
}

// Replace JSON-LD breadcrumbs
const oldJson = `                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com/'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Categories',
                    item: 'https://solveitcalculator.com/convert'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Health & Fitness',
                    item: 'https://solveitcalculator.com/health'
                  }`;

const newJson = `                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com/'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Health & Fitness',
                    item: 'https://solveitcalculator.com/health'
                  }`;

if (content.includes(oldJson)) {
  content = content.replace(oldJson, newJson);
  console.log("JSON breadcrumb replaced.");
} else {
  console.log("Old JSON breadcrumb not found!");
}

fs.writeFileSync(file, content);
