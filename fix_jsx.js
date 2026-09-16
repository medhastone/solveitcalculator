const fs = require('fs');
const file = 'app/health/HealthClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const newComponents = `
      <QuickModeIBW isOpen={activeModal === 'ibw'} onClose={() => setActiveModal(null)} />
      <QuickModeLeanMass isOpen={activeModal === 'lbm' || activeModal === 'lean-mass'} onClose={() => setActiveModal(null)} />
      <QuickModeCaloriePlanner isOpen={activeModal === 'deficit'} onClose={() => setActiveModal(null)} />
`;

content = content.replace(
  newComponents + "  );\n}",
  "  );\n}"
);

content = content.replace(
  "    </div>\n  );\n}",
  newComponents + "    </div>\n  );\n}"
);

fs.writeFileSync(file, content);
console.log('Fixed JSX syntax error.');
