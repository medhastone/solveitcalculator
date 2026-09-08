import os
import re

# 1. Update page.tsx Metadata
seo_data = {
    "world-clock-grid": {
        "title": "Live World Clock Grid & Global Time Converter | SolveIt",
        "desc": "Track multiple global time zones in real-time. Use our interactive world clock grid to monitor business hours, UTC offsets, and prevent scheduling conflicts across international teams."
    },
    "global-meeting-matrix": {
        "title": "Global Meeting Matrix & Time Zone Delta Chart | SolveIt",
        "desc": "Calculate exact time differences between international teams with our pairwise time delta matrix. Optimize cross-border meeting schedules and async handoffs."
    },
    "dst-transition-tracker": {
        "title": "Daylight Saving Time (DST) Transition Tracker | SolveIt",
        "desc": "Anticipate DST clock changes globally. Avoid missed meetings during the desynchronized transition weeks between North America, Europe, and Australia."
    },
    "multi-city-corridor": {
        "title": "Follow The Sun Model & Multi-City Corridors | SolveIt",
        "desc": "Design 24-hour continuous development cycles. Visualize multi-city handoff corridors for global software engineering teams."
    },
    "async-team-handover": {
        "title": "Async Team Handover Protocol & Templates | SolveIt",
        "desc": "Standardize remote work communication. Generate async handover templates and rules of engagement for zero-latency cross-timezone collaboration."
    }
}

for tool_id, meta in seo_data.items():
    page_path = f"app/time-date/{tool_id}/page.tsx"
    if os.path.exists(page_path):
        with open(page_path, 'r') as f:
            content = f.read()
        
        content = re.sub(r"title:\s*'[^']+'", f"title: '{meta['title']}'", content)
        content = re.sub(r"description:\s*'[^']+'", f"description: '{meta['desc']}'", content)
        
        with open(page_path, 'w') as f:
            f.write(content)

# 2. Reusable Related Instruments Component
related_instruments = """
      {/* Section: Related Productivity & Computational Instruments */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto pt-space-xl border-t border-surface-container">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">apps</span>
            Explore Related Synchronization Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/time-zone-overlap">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Overlap Planner</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Algorithmically find synchronous meeting windows globally.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/global-meeting-matrix">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">grid_4x4</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Time Delta Matrix</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Chart the exact hour offsets between international team hubs.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/dst-transition-tracker">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">DST Transition Tracker</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Anticipate Daylight Saving Time shifts and timezone drifts.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/async-team-handover">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Async Team Handover</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Design zero-latency communication templates for remote work.</p>
            </Link>
          </div>
        </div>
      </section>
"""

# 3. Specific FAQ and SEO text for each tool
faqs = {
    "world-clock-grid": """
      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Why Use a Global World Clock Grid?</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">Managing a distributed remote team requires more than just knowing what time it is in one other city. A comprehensive world clock grid provides instantaneous situational awareness across multiple continents. By mapping local times against UTC and highlighting core office hours, program managers can prevent accidental pings during deep sleep cycles and identify the optimal windows for synchronized collaboration.</p>
            <p className="font-body-md text-on-surface-variant">Unlike standard list-based clocks, our grid format allows for rapid visual scanning of daylight states, enabling instant mental calculations for cross-border logistics.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              World Clock FAQ
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-1">Common questions about global timekeeping and coordination.</p>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What is the difference between GMT and UTC?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                While often used interchangeably in casual conversation, GMT (Greenwich Mean Time) is a legal time zone used by some European and African countries, whereas UTC (Coordinated Universal Time) is a time standard used globally to keep clocks perfectly synchronized. UTC itself does not observe Daylight Saving Time.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How are fractional time zones calculated?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Most global time zones are offset in precise 1-hour increments from UTC. However, several countries use fractional offsets. For example, India Standard Time (IST) is UTC+5:30, and Nepal is UTC+5:45. Our clock engine natively calculates and formats these fractional minutes into standard display strings seamlessly.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Why do some nodes show 'Flex' instead of 'In Office'?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                In modern remote work environments, core working hours are typically defined as 09:00 to 17:00 (In Office). "Flex" hours refer to the shoulder periods (e.g., 07:00-09:00 and 17:00-22:00) where team members may be available for asynchronous communication, but should not be expected to join mandatory synchronous meetings.
              </div>
            </details>
          </div>
        </div>
      </section>
""",
    "global-meeting-matrix": """
      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Understanding the Pairwise Time Delta Matrix</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">The Global Meeting Matrix is a computational tool designed to reveal the exact chronological distance between any two geographical nodes in your organization. By mapping locations on both the X and Y axes, program managers can instantly visualize latency gaps.</p>
            <p className="font-body-md text-on-surface-variant">A delta of 0-3 hours indicates highly synchronous potential, whereas a delta of 9-12 hours signifies severe latency that requires strictly asynchronous (Follow-The-Sun) handover protocols.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Matrix & Alignment FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How do I interpret the color coding?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Light neutral text indicates low friction (under 4 hours difference). Bold primary blue signifies moderate latency (4-8 hours). Secondary and tertiary warning colors (orange/red) trigger when the time gap exceeds 8 to 12 hours, alerting you that synchronous meetings will likely intrude on someone's sleep cycle.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Can I export this matrix for my team's wiki?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                While direct image export is currently in development, the matrix is designed to be highly responsive. You can safely take a screenshot of the grid to embed in Confluence, Notion, or internal documentation handbooks to align expectations.
              </div>
            </details>
          </div>
        </div>
      </section>
""",
    "dst-transition-tracker": """
      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Why Track DST Transitions?</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">Daylight Saving Time (DST) is not globally synchronized. The United States and Canada typically shift their clocks in early March and early November, whereas the European Union shifts in late March and late October. Furthermore, the Southern Hemisphere (Australia, New Zealand) operates on an inverted calendar.</p>
            <p className="font-body-md text-on-surface-variant">This creates "Danger Zones"—multi-week periods where the standard time gap between your international offices shrinks or expands unexpectedly, often causing scheduled recurring calendar invites to break or overlap with sleep cycles.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              DST Impact FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What happens during the US-Europe "Danger Zone" in March?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                In early March, the US "springs forward," but Europe does not shift until late March. During this 2-3 week window, the time difference between New York and London shrinks from 5 hours to just 4 hours. A recurring meeting scheduled at 9:00 AM EST will suddenly ring at 1:00 PM GMT instead of 2:00 PM GMT, potentially causing scheduling conflicts for European participants.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Do Asian countries observe Daylight Saving Time?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                The vast majority of countries in Asia (including India, China, Japan, and Singapore) do not observe DST. This means their UTC offset remains static year-round. However, their effective time difference with the US and Europe will still shift twice a year when Western countries change their clocks.
              </div>
            </details>
          </div>
        </div>
      </section>
""",
    "multi-city-corridor": """
      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">The Follow-The-Sun Development Model</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">The Multi-City Corridor visualizes the gold standard of global software engineering: the Follow-The-Sun model. By strategically positioning team hubs across the Americas, Asia-Pacific, and Europe, an enterprise can achieve a continuous 24-hour development and support cycle.</p>
            <p className="font-body-md text-on-surface-variant">As one team finishes their day, they pass the baton (via automated CI/CD pipelines and written handover protocols) to the next team just coming online, ensuring zero downtime in product velocity or incident resolution.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Corridor Optimization FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How many regional hubs are required for a true 24-hour cycle?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                While it is possible to achieve continuous coverage with 2 locations spaced exactly 12 hours apart, this forces brutal 12-hour shifts. The optimal enterprise setup requires 3 primary hubs spaced roughly 8 hours apart (e.g., San Francisco, Tokyo/Singapore, and London/Berlin) to allow for comfortable 8-hour shifts with 1-2 hours of natural overlap for handovers.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What is the biggest risk in a Follow-The-Sun model?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Information silos and poorly executed handovers. If the Asia-Pacific team is blocked by missing documentation from the US team, they cannot proceed and must wait 12 hours for the US team to wake up. This turns a 24-hour velocity advantage into a 24-hour delay penalty.
              </div>
            </details>
          </div>
        </div>
      </section>
""",
    "async-team-handover": """
      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Mastering Asynchronous Remote Work</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">When time zone overlap is less than 3 hours, relying on synchronous video meetings becomes a bottleneck. The Async Team Handover protocol shifts the organizational culture from "meeting-first" to "documentation-first".</p>
            <p className="font-body-md text-on-surface-variant">By utilizing standardized written templates, Loom video recordings, and strict SLAs (Service Level Agreements) for code reviews, distributed engineering squads can execute complex architectures without ever being in the same virtual room at the same time.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Async Protocol FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Why is the "No Hello" rule so critical?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Sending a standalone "Hi" or "Are you there?" over Slack creates a synchronous dependency. If the recipient is asleep, they will reply 8 hours later with "Yes, I'm here." You have just wasted a full business day exchanging greetings. The "No Hello" rule mandates that you send your complete question, context, and requested action in the very first message.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How do we handle urgent incidents in an async setup?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Async protocols are for standard operational development. Urgent incidents (Sev 1 outages) bypass these rules and trigger dedicated paging systems (like PagerDuty) that immediately wake on-call engineers. However, the post-mortem incident report must still be written asynchronously for global review.
              </div>
            </details>
          </div>
        </div>
      </section>
"""
}

# Update Client files
for tool_id, faq_content in faqs.items():
    client_name = tool_id.replace('-', '').capitalize() + "Client"
    client_path = f"app/time-date/{tool_id}/{client_name}.tsx"
    
    if os.path.exists(client_path):
        with open(client_path, 'r') as f:
            content = f.read()
            
        # Add faq_content and related_instruments right before the last closing tags
        # The target string is exactly:
        #     </div>
        #   );
        # }
        
        target = r'    </div>\n  \);\n}'
        
        injection = faq_content + related_instruments + "\n    </div>\n  );\n}"
        
        new_content = re.sub(target, injection, content, count=1)
        
        with open(client_path, 'w') as f:
            f.write(new_content)

