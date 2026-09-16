const fs = require('fs');
let content = fs.readFileSync('app/HomePageClient.tsx', 'utf8');

// 1. Add useRef
content = content.replace(
  'import React, { useState, useEffect, useMemo } from "react";',
  'import React, { useState, useEffect, useMemo, useRef } from "react";'
);

// 2. Add state
content = content.replace(
  'const [heroSearch, setHeroSearch] = useState("");',
  'const [heroSearch, setHeroSearch] = useState("");\n  const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const searchRef = useRef<HTMLFormElement>(null);'
);

// 3. Add click outside
content = content.replace(
  '// Age Calculation Logic',
  `// Search Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Age Calculation Logic`
);

// 4. Add filteredHeroResults
content = content.replace(
  'const filteredDirectory = useMemo(() => {',
  `const filteredHeroResults = useMemo(() => {
    const query = heroSearch.trim().toLowerCase();
    if (!query) return { categories: [], tools: [] };
    
    const matchedCategories = categoriesData.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.tags.some(t => t.toLowerCase().includes(query)) ||
      c.desc.toLowerCase().includes(query)
    ).slice(0, 3);
    
    const matchedTools = dirCardsData.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.desc.toLowerCase().includes(query) ||
      c.label.toLowerCase().includes(query)
    ).slice(0, 5);
    
    return { categories: matchedCategories, tools: matchedTools };
  }, [heroSearch]);

  const filteredDirectory = useMemo(() => {`
);

// 5. Update form and add dropdown
const formStart = `<form
                      onSubmit={handleHeroSubmit}
                      className="relative flex items-center w-full rounded-2xl bg-surface-container-lowest shadow-xl p-2 transition-all duration-200"
                    >`;
const newFormStart = `<form
                      ref={searchRef}
                      onSubmit={handleHeroSubmit}
                      className="relative flex items-center w-full rounded-2xl bg-surface-container-lowest shadow-xl p-2 transition-all duration-200 z-50"
                    >`;
content = content.replace(formStart, newFormStart);

const inputToReplace = `<input
                        type="text"
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                        placeholder="Search calculators (e.g. percentage, mortgage, bmi)..."
                        className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none py-2"
                      />`;

const newInput = `<input
                        type="text"
                        value={heroSearch}
                        onChange={(e) => {
                          setHeroSearch(e.target.value);
                          setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        placeholder="Search calculators (e.g. percentage, mortgage, bmi)..."
                        className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none py-2"
                      />`;
content = content.replace(inputToReplace, newInput);

const formEnd = `</button>
                    </form>`;
const newFormEnd = `</button>

                    {/* Search Dropdown */}
                    {isSearchOpen && heroSearch.trim() !== "" && (filteredHeroResults.categories.length > 0 || filteredHeroResults.tools.length > 0) && (
                      <div className="absolute top-[110%] left-0 right-0 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 text-left">
                        <div className="max-h-[60vh] overflow-y-auto overscroll-contain flex flex-col">
                          
                          {filteredHeroResults.categories.length > 0 && (
                            <div className="p-2 pb-1">
                              <div className="px-3 py-2 text-xs font-label-caps tracking-wider uppercase text-on-surface-variant/70 font-semibold">
                                Categories
                              </div>
                              <div className="flex flex-col gap-1">
                                {filteredHeroResults.categories.map((cat, idx) => (
                                  <Link 
                                    key={\`cat-\${idx}\`} 
                                    href={cat.link}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                                    onClick={() => setIsSearchOpen(false)}
                                  >
                                    <div className={\`w-8 h-8 rounded-full flex items-center justify-center \${cat.iconBg}\`}>
                                      <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-semibold text-on-surface">{cat.title} Hub</span>
                                      <span className="text-xs text-on-surface-variant truncate">{cat.desc}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {filteredHeroResults.categories.length > 0 && filteredHeroResults.tools.length > 0 && (
                            <div className="mx-4 mt-1 mb-1 border-t border-outline-variant/20"></div>
                          )}

                          {filteredHeroResults.tools.length > 0 && (
                            <div className="p-2 pt-1">
                              <div className="px-3 py-2 text-xs font-label-caps tracking-wider uppercase text-on-surface-variant/70 font-semibold">
                                Calculators & Tools
                              </div>
                              <div className="flex flex-col gap-1">
                                {filteredHeroResults.tools.map((tool, idx) => (
                                  <Link 
                                    key={\`tool-\${idx}\`} 
                                    href={tool.link}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                                    onClick={() => setIsSearchOpen(false)}
                                  >
                                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <span className="text-sm font-semibold text-on-surface truncate">{tool.name}</span>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className={\`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded \${tool.badgeClass}\`}>
                                          {tool.label}
                                        </span>
                                        <span className="text-xs text-on-surface-variant truncate">{tool.desc}</span>
                                      </div>
                                    </div>
                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50">arrow_forward</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    )}
                    </form>`;
content = content.replace(formEnd, newFormEnd);

fs.writeFileSync('app/HomePageClient.tsx', content);
console.log("Modifications complete.");
