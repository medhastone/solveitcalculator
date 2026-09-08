import os
import re

tools = [
    {
        "id": "world-clock-grid",
        "title": "World Clock Grid",
        "icon": "public",
        "desc": "High-fidelity global timekeeping matrix with live UTC offsets and solar trajectory markers."
    },
    {
        "id": "global-meeting-matrix",
        "title": "Global Meeting Matrix",
        "icon": "grid_4x4",
        "desc": "Pairwise latency and availability grid for cross-border enterprise teams."
    },
    {
        "id": "dst-transition-tracker",
        "title": "DST Transition Tracker",
        "icon": "hourglass_top",
        "desc": "Anticipate daylight saving shifts across hemispheres to prevent schedule collisions."
    },
    {
        "id": "multi-city-corridor",
        "title": "Multi-City Corridor",
        "icon": "flight_takeoff",
        "desc": "Visualize travel and meeting corridors across multiple international hops."
    },
    {
        "id": "async-team-handover",
        "title": "Async Team Handover",
        "icon": "forum",
        "desc": "Protocol designer and schedule generator for zero-latency engineering baton passes."
    }
]

base_dir = "app/time-date"

def create_tool(tool):
    tool_dir = os.path.join(base_dir, tool["id"])
    os.makedirs(tool_dir, exist_ok=True)
    
    # page.tsx
    page_content = f'''import React from 'react';
import type {{ Metadata }} from 'next';
import {tool["id"].replace("-", "").title()}Client from './{tool["id"].replace("-", "").title()}Client';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {{
  title: '{tool["title"]} | SolveIt',
  description: '{tool["desc"]}',
}};

export default function {tool["id"].replace("-", "").title()}Page() {{
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-[98px] bg-background flex-grow">
        <{tool["id"].replace("-", "").title()}Client />
      </main>
      <Footer />
    </div>
  );
}}
'''
    with open(os.path.join(tool_dir, "page.tsx"), "w") as f:
        f.write(page_content)
        
    # Client.tsx
    client_content = f''''use client';

import React, {{ useState, useEffect }} from 'react';
import Link from 'next/link';

export default function {tool["id"].replace("-", "").title()}Client() {{
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {{
    setMounted(true);
  }}, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-380px)]">
      {{/* Telemetry Bar & Contextual Path */}}
      <section className="w-full bg-surface-container-low/60 backdrop-blur-md px-gutter-mobile md:px-gutter-desktop py-space-sm">
        <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-2xs text-body-sm font-body-sm text-on-surface-variant flex-wrap">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
            <span className="text-outline-variant">/</span>
            <Link className="hover:text-primary transition-colors" href="/time-date/time-zone-overlap">Time Zone Overlap Planner</Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">{tool["icon"]}</span>
              {tool["title"]}
            </span>
          </nav>
          {{/* Trust Telemetry Badges */}}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              IANA tzdata 2025a
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Zero Cloud Telemetry
            </span>
          </div>
        </div>
      </section>

      {{/* Interactive Suite Mode Switcher */}}
      <section className="w-full bg-surface-container-lowest shadow-sm px-gutter-mobile md:px-gutter-desktop py-2.5">
        <div className="max-w-max-width-canvas mx-auto flex items-center justify-between gap-space-md overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            <Link href="/time-date/time-zone-overlap" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              Overlap Planner
            </Link>
            <Link href="/time-date/world-clock-grid" className={{`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all ${{"{tool['id']}" === 'world-clock-grid' ? 'bg-primary text-on-primary font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}}`}}>
              <span className="material-symbols-outlined text-[16px]">public</span>
              World Clock Grid
            </Link>
            <Link href="/time-date/global-meeting-matrix" className={{`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all ${{"{tool['id']}" === 'global-meeting-matrix' ? 'bg-primary text-on-primary font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}}`}}>
              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
              Global Meeting Matrix
            </Link>
            <Link href="/time-date/dst-transition-tracker" className={{`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all ${{"{tool['id']}" === 'dst-transition-tracker' ? 'bg-primary text-on-primary font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}}`}}>
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              DST Transition Tracker
            </Link>
            <Link href="/time-date/multi-city-corridor" className={{`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all ${{"{tool['id']}" === 'multi-city-corridor' ? 'bg-primary text-on-primary font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}}`}}>
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              Multi-City Corridor
            </Link>
            <Link href="/time-date/async-team-handover" className={{`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all ${{"{tool['id']}" === 'async-team-handover' ? 'bg-primary text-on-primary font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}}`}}>
              <span className="material-symbols-outlined text-[16px]">forum</span>
              Async Team Handover
            </Link>
          </div>
        </div>
      </section>

      {{/* High-Density Workspace Header / Hero Brief */}}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl md:py-space-2xl border-b border-surface-container">
        <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase tracking-wider">Metrological Engine v4.2</span>
              <span className="text-on-surface-variant text-body-sm">•</span>
              <span className="text-on-surface-variant font-body-sm text-body-sm">Active Module</span>
            </div>
            <h1 className="font-headline-lg md:font-display-hero text-headline-lg md:text-display-hero text-on-surface tracking-tight leading-none mb-space-sm">
              {tool["title"]}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {tool["desc"]}
            </p>
          </div>
        </div>
      </section>

      {{/* Advanced Structure Placeholder */}}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm p-space-2xl text-center flex flex-col items-center justify-center min-h-[40vh]">
             <span className="material-symbols-outlined text-[48px] text-primary mb-4">{tool["icon"]}</span>
             <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Module Initialization</h2>
             <p className="font-body-md text-on-surface-variant max-w-lg mb-6">
               The advanced logic and computational architecture for the {tool["title"]} is currently being provisioned. 
             </p>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
               <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}}
'''
    with open(os.path.join(tool_dir, f"{tool['id'].replace('-', '').title()}Client.tsx"), "w") as f:
        f.write(client_content)


for tool in tools:
    create_tool(tool)

# Update TimeZoneOverlapClient links
with open('app/time-date/time-zone-overlap/TimeZoneOverlapClient.tsx', 'r') as f:
    content = f.read()

# Replace the buttons in the mode switcher with links
target = r'''<button className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-sm transition-all" type="button">
              <span className="material-symbols-outlined text-\[16px\]">sync_alt</span>
              Overlap Planner \(Active\)
            </button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap" type="button">
              <span className="material-symbols-outlined text-\[16px\]">public</span>
              World Clock Grid
            </button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap" type="button">
              <span className="material-symbols-outlined text-\[16px\]">grid_4x4</span>
              Global Meeting Matrix
            </button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap" type="button">
              <span className="material-symbols-outlined text-\[16px\]">hourglass_top</span>
              DST Transition Tracker
            </button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap" type="button">
              <span className="material-symbols-outlined text-\[16px\]">flight_takeoff</span>
              Multi-City Corridor
            </button>
            <button className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap" type="button">
              <span className="material-symbols-outlined text-\[16px\]">forum</span>
              Async Team Handover
            </button>'''

replacement = r'''<Link href="/time-date/time-zone-overlap" className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-sm transition-all">
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              Overlap Planner (Active)
            </Link>
            <Link href="/time-date/world-clock-grid" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">public</span>
              World Clock Grid
            </Link>
            <Link href="/time-date/global-meeting-matrix" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
              Global Meeting Matrix
            </Link>
            <Link href="/time-date/dst-transition-tracker" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              DST Transition Tracker
            </Link>
            <Link href="/time-date/multi-city-corridor" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              Multi-City Corridor
            </Link>
            <Link href="/time-date/async-team-handover" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">forum</span>
              Async Team Handover
            </Link>'''

content = re.sub(target, replacement, content, flags=re.DOTALL)
with open('app/time-date/time-zone-overlap/TimeZoneOverlapClient.tsx', 'w') as f:
    f.write(content)

