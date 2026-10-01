'use client';

import React from 'react';
import { ProjectAction } from './types';

interface ProjectDiscoveryProps {
  onSelectProject: (projectId: string, defaultTool: string) => void;
  activeProjectId?: string;
}

export const PROJECT_ACTIONS: ProjectAction[] = [
  {
    id: 'build-house',
    title: 'Build a House',
    subtitle: 'Full Framing, Foundation & Shell',
    icon: 'home_work',
    desc: 'Footings, wall stud framing, roof rafters, subfloor sheathing, and drywall package estimates.',
    defaultTool: 'lumber',
    keyMaterials: ['Studs & Plates', 'Foundation Concrete', 'Roof Rafters', 'Drywall Panels'],
    typicalWaste: '10–15% Structural Waste',
  },
  {
    id: 'pour-concrete',
    title: 'Pour Concrete',
    subtitle: 'Slabs, Footings & Post Piers',
    icon: 'view_in_ar',
    desc: 'Calculate cubic yards, metric cubic meters, premix 80lb/60lb bags, rebar grid, and gravel base.',
    defaultTool: 'concrete',
    keyMaterials: ['Ready-Mix / Bags', '#4 Rebar', 'Crushed Stone Base', 'Formwork Lumber'],
    typicalWaste: '5–10% Volumetric Spillage',
  },
  {
    id: 'paint-room',
    title: 'Paint a Room',
    subtitle: 'Walls, Ceilings & Primers',
    icon: 'format_paint',
    desc: 'Determine net wall square footage after deducting doors and windows, plus coats and ceiling paint.',
    defaultTool: 'paint',
    keyMaterials: ['Interior Latex Paint', 'Porous Primer', 'Trim Enamel', 'Roller Covers'],
    typicalWaste: 'Single or Multi-Coat Coverage',
  },
  {
    id: 'build-deck',
    title: 'Build a Deck',
    subtitle: 'Decking, Joists & Railings',
    icon: 'deck',
    desc: '5/4×6 decking boards, ledger board, 12"/16" O.C. joist spans, stair stringers, and post footings.',
    defaultTool: 'deck',
    keyMaterials: ['Decking Boards', 'Pressure-Treated Joists', 'Deck Screws', 'Pier Concrete'],
    typicalWaste: '10% Cutoff Allowance',
  },
  {
    id: 'landscape-yard',
    title: 'Landscape a Yard',
    subtitle: 'Mulch, Topsoil, Gravel & Turf',
    icon: 'yard',
    desc: 'Bulk cubic yards and bagged mulch, lawn sod rolls, garden topsoil, and decorative gravel beds.',
    defaultTool: 'mulch',
    keyMaterials: ['Bark Mulch', 'Screened Topsoil', 'Pea Gravel / #57', 'Turf Sod Rolls'],
    typicalWaste: '10% Ground Settling & Edge Trim',
  },
  {
    id: 'build-wall',
    title: 'Build a Wall',
    subtitle: 'Stud Framing, CMU Blocks & Brick',
    icon: 'domain',
    desc: 'Stud counts at 16" or 24" O.C., modular brick with mortar joints, and CMU concrete block courses.',
    defaultTool: 'lumber',
    keyMaterials: ['2×4 / 2×6 Studs', '8×8×16 CMU Blocks', 'Type S Mortar', 'Top & Sole Plates'],
    typicalWaste: '10–12% Cut & Mortar Allowance',
  },
  {
    id: 'replace-roof',
    title: 'Replace a Roof',
    subtitle: 'Pitch Multipliers & Shingle Bundles',
    icon: 'roofing',
    desc: 'Converts slope pitch into true surface area, roofing squares, 3-bundle shingles, and underlayment.',
    defaultTool: 'roofing',
    keyMaterials: ['Architectural Shingles', 'Synthetic Underlayment', 'Drip Edge & Flashing', 'Ridge Cap'],
    typicalWaste: '10–15% Valley & Starter Waste',
  },
  {
    id: 'renovate-room',
    title: 'Renovate a Room',
    subtitle: 'Flooring, Drywall & Trim Molding',
    icon: 'handyman',
    desc: 'Luxury vinyl plank (LVP) cartons, tile grid with grout, baseboard linear runs, and paint finishing.',
    defaultTool: 'flooring',
    keyMaterials: ['Flooring Cartons', 'Underlayment Foam', 'Baseboard Molding', 'Patch Compound'],
    typicalWaste: '10% Stagger & Trim Buffer',
  },
];

export default function ProjectDiscovery({ onSelectProject, activeProjectId }: ProjectDiscoveryProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-low/50 border-y border-outline-variant/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">explore</span>
            <span>Project Discovery Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            What Are You Building or Renovating?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-on-surface-variant">
            Choose your project pathway to jump directly into tailored material takeoffs, recommended waste factors, and measurement tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PROJECT_ACTIONS.map(project => {
            const isActive = activeProjectId === project.id;
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id, project.defaultTool)}
                className={`group text-left p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between border relative overflow-hidden ${
                  isActive
                    ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/30 shadow-md'
                    : 'bg-surface-container-lowest hover:bg-surface border-outline-variant/30 hover:border-primary/50 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">{project.icon}</span>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono">
                      {project.typicalWaste}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mt-0.5">
                    {project.subtitle}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    {project.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-outline-variant/15 flex flex-wrap gap-1.5">
                    {project.keyMaterials.map((mat, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{isActive ? 'Active Workbench' : 'Configure Estimate'}</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
