import re

with open('app/time-date/global-meeting-matrix/GlobalmeetingmatrixClient.tsx', 'r') as f:
    content = f.read()

replacement = """
      {/* Matrix Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">table_chart</span>
                  Pairwise Time Delta Matrix
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Hour offset variance between distributed engineering squads.</p>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
                    <th className="py-3 px-3">Location</th>
                    {cities.map(loc => (
                      <th key={`th-${loc.id}`} className="py-3 px-3 text-center whitespace-nowrap">{loc.flag} {loc.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-data-mono text-[13px]">
                  {cities.map(rowLoc => (
                    <tr key={`tr-${rowLoc.id}`}>
                      <td className="py-2.5 px-3 font-sans font-semibold text-on-surface flex items-center gap-1.5 whitespace-nowrap">
                        <span>{rowLoc.flag}</span> {rowLoc.name}
                      </td>
                      {cities.map(colLoc => {
                        let diff = colLoc.utcOffset - rowLoc.utcOffset;
                        let colorClass = 'text-primary font-medium';
                        if (diff === 0) colorClass = 'text-outline-variant';
                        else if (Math.abs(diff) > 12) colorClass = 'text-tertiary font-bold';
                        else if (Math.abs(diff) > 8) colorClass = 'text-secondary font-medium';
                        else if (diff < 0) colorClass = 'text-on-surface-variant';
                        
                        const sign = diff > 0 ? '+' : '';
                        return (
                          <td key={`td-${rowLoc.id}-${colLoc.id}`} className={`py-2.5 px-3 text-center ${colorClass}`}>
                            {diff === 0 ? '0h' : `${sign}${diff}h`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
"""

state_setup = """
  const cities = [
    { id: 'sf', name: 'San Francisco', abbreviation: 'PST', flag: '🇺🇸', utcOffset: -8 },
    { id: 'nyc', name: 'New York', abbreviation: 'EST', flag: '🇺🇸', utcOffset: -5 },
    { id: 'lon', name: 'London', abbreviation: 'GMT', flag: '🇬🇧', utcOffset: 0 },
    { id: 'ber', name: 'Berlin', abbreviation: 'CET', flag: '🇩🇪', utcOffset: 1 },
    { id: 'mum', name: 'Mumbai', abbreviation: 'IST', flag: '🇮🇳', utcOffset: 5.5 },
    { id: 'tok', name: 'Tokyo', abbreviation: 'JST', flag: '🇯🇵', utcOffset: 9 },
    { id: 'syd', name: 'Sydney', abbreviation: 'AEDT', flag: '🇦🇺', utcOffset: 11 },
  ];
"""

content = re.sub(r'const \[mounted, setMounted\] = useState\(false\);', r'const [mounted, setMounted] = useState(false);' + state_setup, content)
content = re.sub(r'\{/\* Advanced Structure Placeholder \*/\}.*', replacement + '\n    </div>\n  );\n}\n', content, flags=re.DOTALL)

with open('app/time-date/global-meeting-matrix/GlobalmeetingmatrixClient.tsx', 'w') as f:
    f.write(content)
