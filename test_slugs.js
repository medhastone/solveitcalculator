const tools = [
  'Quadratic Formula Solver with Steps',
  'Polynomial Factoring & Root Finder',
  'System of Linear Equations (2x2, 3x3)',
  'Logarithm & Natural Log (ln) Calculator',
  'Radical & Surd Simplifier'
];
tools.forEach(tool => {
  const slug = tool.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  console.log(slug);
});
