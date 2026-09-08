import re

def update_file(filename, replacement):
    with open(filename, 'r') as f:
        content = f.read()
    content = re.sub(r'\{/\* Advanced Structure Placeholder \*/\}.*', replacement + '\n    </div>\n  );\n}\n', content, flags=re.DOTALL)
    with open(filename, 'w') as f:
        f.write(content)

corridor_rep = """
      {/* Multi-City Corridor Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl border border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-lg">Around The World Handoff Sequence</h2>
            <div className="relative">
              <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-surface-container-high rounded-full"></div>
              
              <div className="space-y-space-lg">
                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇺🇸</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">San Francisco (PST)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC-8 • End of Day</p>
                      </div>
                      <div className="font-data-mono font-bold text-primary bg-primary-fixed/30 px-2 py-1 rounded">17:00 PST</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Commits code and writes daily handover RFC. Ping Tokyo counterpart.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇯🇵</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">Tokyo (JST)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC+9 • Start of Day (Next Day)</p>
                      </div>
                      <div className="font-data-mono font-bold text-secondary bg-secondary-fixed/30 px-2 py-1 rounded">10:00 JST</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Reviews SF PRs. Begins Asia-Pacific development sprint.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-tertiary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇮🇳</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">Mumbai (IST)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC+5.5 • Mid Day</p>
                      </div>
                      <div className="font-data-mono font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-1 rounded">13:30 IST</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Syncs with Tokyo before their end of day. Prepares handover for London.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇬🇧</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">London (GMT)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC+0 • Morning</p>
                      </div>
                      <div className="font-data-mono font-bold text-primary bg-primary-fixed/30 px-2 py-1 rounded">08:00 GMT</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Reviews India PRs. Passes baton back to US East Coast (NYC at 09:00 EST / 14:00 GMT).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
"""
update_file('app/time-date/multi-city-corridor/MulticitycorridorClient.tsx', corridor_rep)

handover_rep = """
      {/* Async Team Handover Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            <div className="lg:col-span-1 space-y-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md font-semibold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">description</span> Default Handover Template</h3>
                <p className="font-body-sm text-on-surface-variant mt-2">Standardized format for passing context across time zones without synchronous meetings.</p>
                <div className="mt-4 space-y-2 font-data-mono text-[12px] text-on-surface bg-surface-container-low p-3 rounded-lg border border-surface-container-high">
                  <p><strong>[Status]</strong> Green / Yellow / Red</p>
                  <p><strong>[Completed]</strong> Bulleted list of PRs.</p>
                  <p><strong>[Blockers]</strong> What is stopping progress?</p>
                  <p><strong>[Next Shift Action]</strong> Explicit request for the incoming team.</p>
                </div>
                <button className="w-full mt-4 py-2 rounded bg-primary text-on-primary font-body-sm font-medium">Copy Template</button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 h-full">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Rules of Engagement</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px] text-emerald-600">forum</span>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">No Hello Messages</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">Send complete thoughts. "Hello, are you there?" forces the recipient to wait. Just ask the question immediately.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px] text-amber-600">schedule</span>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">24-Hour Review SLA</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">All PRs must receive at least one review or comment within 24 hours to prevent cross-timezone stalling.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px] text-indigo-600">videocam</span>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">Record Everything</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">If a decision is made in a synchronous meeting, it does not exist until it is recorded or summarized in writing for the other time zones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
"""
update_file('app/time-date/async-team-handover/AsyncteamhandoverClient.tsx', handover_rep)

