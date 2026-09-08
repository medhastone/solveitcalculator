import re

with open('app/time-date/dst-transition-tracker/DsttransitiontrackerClient.tsx', 'r') as f:
    content = f.read()

replacement = """
      {/* DST Tracker Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Upcoming Transitions (Next 6 Months)</h2>
              <div className="space-y-space-md">
                <div className="flex items-start gap-3 p-space-sm rounded-xl bg-surface-container-low border-l-4 border-primary">
                  <div className="bg-surface-container p-2 rounded-lg text-center min-w-[60px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Mar</div>
                    <div className="font-numerical-display text-[24px] font-bold text-primary">08</div>
                  </div>
                  <div>
                    <h3 className="font-body-md font-semibold text-on-surface">United States & Canada (Spring Forward)</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Clocks move forward 1 hour at 2:00 AM local time. Pacific becomes UTC-7, Eastern becomes UTC-4.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-space-sm rounded-xl bg-surface-container-low border-l-4 border-secondary">
                  <div className="bg-surface-container p-2 rounded-lg text-center min-w-[60px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Mar</div>
                    <div className="font-numerical-display text-[24px] font-bold text-secondary">29</div>
                  </div>
                  <div>
                    <h3 className="font-body-md font-semibold text-on-surface">European Union & UK (Spring Forward)</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Clocks move forward 1 hour. London becomes UTC+1 (BST), Berlin becomes UTC+2 (CEST).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-space-sm rounded-xl bg-surface-container-low border-l-4 border-tertiary">
                  <div className="bg-surface-container p-2 rounded-lg text-center min-w-[60px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Apr</div>
                    <div className="font-numerical-display text-[24px] font-bold text-tertiary">05</div>
                  </div>
                  <div>
                    <h3 className="font-body-md font-semibold text-on-surface">Australia & New Zealand (Fall Back)</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Clocks move backward 1 hour. Sydney shifts from UTC+11 to UTC+10.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Impact Zones</h2>
              <p className="font-body-sm text-on-surface-variant mb-space-md">Regions that do not observe Daylight Saving Time will experience an effective shift in overlap with observing regions.</p>
              
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇮🇳 India (IST)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇯🇵 Japan (JST)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇦🇪 UAE (GST)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇸🇬 Singapore (SGT)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
              </ul>
              
              <div className="mt-space-lg p-space-md bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-body-sm font-semibold text-amber-800 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">warning</span> Warning Period</h4>
                <p className="font-body-sm text-amber-700 mt-1">Between March 8 and March 29, the US-Europe overlap window changes temporarily because the US shifts 3 weeks before Europe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
"""

content = re.sub(r'\{/\* Advanced Structure Placeholder \*/\}.*', replacement + '\n    </div>\n  );\n}\n', content, flags=re.DOTALL)

with open('app/time-date/dst-transition-tracker/DsttransitiontrackerClient.tsx', 'w') as f:
    f.write(content)
