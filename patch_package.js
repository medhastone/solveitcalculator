const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.browserslist = [
  "defaults",
  "not IE 11",
  "not IE_Mob 11",
  "maintained node versions"
];
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
