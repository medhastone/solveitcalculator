import re

with open('app/time-date/world-clock-grid/WorldclockgridClient.tsx', 'r') as f:
    content = f.read()

# The placeholder section starts at:
#       {/* Advanced Structure Placeholder */}
# and ends right before:
#     </div>
#   );
# }

replacement = """
      {/* World Clock Grid Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex items-center justify-between mb-space-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Global Nodes</h2>
            <div className="flex gap-2">
              <button onClick={() => setFormat(f => f === '12h' ? '24h' : '12h')} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors">
                Toggle {format === '12h' ? '24h' : '12h'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
            {cities.map(loc => {
              const nowLocalHour = currentUtcHour + loc.utcOffset;
              const h = (nowLocalHour % 24 + 24) % 24;
              const m = utcTime ? String(utcTime.getUTCMinutes()).padStart(2,'0') : '00';
              const s = utcTime ? String(utcTime.getUTCSeconds()).padStart(2,'0') : '00';
              const isSleep = h < 8 || h >= 22; // simple heuristic
              const isCore = h >= 9 && h < 17;
              
              let displayH = h;
              let ampm = '';
              if (format === '12h') {
                ampm = h >= 12 ? ' PM' : ' AM';
                displayH = h % 12 || 12;
              }
              
              return (
                <div key={loc.id} className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-2xl">{loc.flag}</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface mt-1 leading-tight">{loc.name}</h3>
                        <span className="text-label-caps font-label-caps text-on-surface-variant">{loc.abbreviation} • UTC{loc.utcOffset > 0 ? `+${loc.utcOffset}` : loc.utcOffset}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-label-caps font-label-caps font-semibold ${isSleep ? 'bg-slate-100 text-slate-700' : isCore ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container text-secondary'}`}>
                        {isSleep ? 'Sleeping' : isCore ? 'In Office' : 'Flex'}
                      </span>
                    </div>
                    <div className="my-space-md">
                      <div className="font-data-mono text-numerical-display text-on-surface font-bold tracking-tight">
                        {String(displayH).padStart(2,'0')}:{m}<span className="text-headline-md text-on-surface-variant">:{s}{ampm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
"""

# We also need to add state for cities and time
state_setup = """
  const [utcTime, setUtcTime] = useState<Date | null>(null);
  const [format, setFormat] = useState<'12h'|'24h'>('12h');

  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { id: 'sf', name: 'San Francisco', abbreviation: 'PST', flag: '🇺🇸', utcOffset: -8 },
    { id: 'nyc', name: 'New York', abbreviation: 'EST', flag: '🇺🇸', utcOffset: -5 },
    { id: 'lon', name: 'London', abbreviation: 'GMT', flag: '🇬🇧', utcOffset: 0 },
    { id: 'ber', name: 'Berlin', abbreviation: 'CET', flag: '🇩🇪', utcOffset: 1 },
    { id: 'mum', name: 'Mumbai', abbreviation: 'IST', flag: '🇮🇳', utcOffset: 5.5 },
    { id: 'tok', name: 'Tokyo', abbreviation: 'JST', flag: '🇯🇵', utcOffset: 9 },
    { id: 'syd', name: 'Sydney', abbreviation: 'AEDT', flag: '🇦🇺', utcOffset: 11 },
    { id: 'dxb', name: 'Dubai', abbreviation: 'GST', flag: '🇦🇪', utcOffset: 4 },
    { id: 'sin', name: 'Singapore', abbreviation: 'SGT', flag: '🇸🇬', utcOffset: 8 },
  ];
  
  const currentUtcHour = utcTime ? utcTime.getUTCHours() : 0;
"""

# Insert state_setup after "const [mounted, setMounted] = useState(false);"
content = re.sub(r'const \[mounted, setMounted\] = useState\(false\);', r'const [mounted, setMounted] = useState(false);' + state_setup, content)

# Replace the placeholder
content = re.sub(r'\{/\* Advanced Structure Placeholder \*/\}.*', replacement + '\n    </div>\n  );\n}\n', content, flags=re.DOTALL)

with open('app/time-date/world-clock-grid/WorldclockgridClient.tsx', 'w') as f:
    f.write(content)
