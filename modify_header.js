const fs = require('fs');

let header = fs.readFileSync('components/Header.tsx', 'utf8');

// 1. Add Import
header = header.replace(
  'import { getCurrentTheme, toggleTheme } from "../lib/theme";',
  'import { getCurrentTheme, toggleTheme } from "../lib/theme";\nimport SearchModal from "./SearchModal";'
);

// 2. Add State
header = header.replace(
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);',
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [isSearchOpen, setIsSearchOpen] = useState(false);'
);

// 3. Add Keydown effect for CMD+K and ESC
const effectInsert = `// Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);`;

header = header.replace(
  'useEffect(() => {',
  `${effectInsert}\n\n  useEffect(() => {`
);

// 4. Update the desktop link
const desktopSearchRegex = /<Link\s+href="\/conversions"\s+className="hidden md:flex items-center justify-between w-36 lg:w-44 xl:w-52 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant\/40 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all focus:outline-none"\s*>[\s\S]*?<\/Link>/;

const desktopButton = `<button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center justify-between w-36 lg:w-44 xl:w-52 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all focus:outline-none"
            >
              <span className="flex items-center gap-1.5 text-body-sm font-body-sm truncate">
                <span className="material-symbols-outlined text-[17px] text-primary">search</span>
                <span>Quick search...</span>
              </span>
              <kbd className="hidden lg:inline-block font-data-mono text-[10px] bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded border border-outline-variant/40 shadow-xs">
                ⌘K
              </kbd>
            </button>`;
header = header.replace(desktopSearchRegex, desktopButton);

// 5. Update mobile button
const mobileButtonRegex = /<button\s+type="button"\s+onClick=\{.*setMobileMenuOpen.*\}\s+aria-label="Search tools"\s+title="Search tools"\s+className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors border border-outline-variant\/30 bg-surface-container-low"\s*>\s*<span className="material-symbols-outlined text-\[20px\]">search<\/span>\s*<\/button>/;

const mobileButton = `<button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search tools"
              title="Search tools"
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors border border-outline-variant/30 bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>`;
header = header.replace(mobileButtonRegex, mobileButton);

// 6. Add Modal Component before final closing tag
header = header.replace(
  '</header>',
  '</header>\n      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />'
);

fs.writeFileSync('components/Header.tsx', header);
console.log("Updated Header.tsx");
