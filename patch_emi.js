const fs = require('fs');
const file = 'app/finance/emi-calculator/EmiCalculatorClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add localizedSeoContent import
content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';\nimport { localizedSeoContent } from '@/lib/seoContent';");

// Modify default export to accept defaultCountrySlug
content = content.replace('export default function EmiCalculatorClient() {', 'export default function EmiCalculatorClient({ defaultCountrySlug = "in" }: { defaultCountrySlug?: string }) {\n  const router = useRouter();\n  const initialCountry = defaultCountrySlug.toUpperCase() as JurisdictionKey;');

// Use initialCountry for state
content = content.replace("useState<JurisdictionKey>('IN');", "useState<JurisdictionKey>(initialCountry);");

// Modify handleCountryChange to push route
content = content.replace(
  '  const handleCountryChange = (key: JurisdictionKey) => {\n    setActiveCountry(key);',
  '  const handleCountryChange = (key: JurisdictionKey) => {\n    router.push(`/finance/emi-calculator/${key.toLowerCase()}`);\n    setActiveCountry(key);'
);

fs.writeFileSync(file, content);
console.log('Patched');
