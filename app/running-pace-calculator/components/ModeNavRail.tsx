import React from 'react';
import { CalculationMode } from '../types';

interface ModeNavRailProps {
  activeMode: CalculationMode;
  onSelectMode: (mode: CalculationMode) => void;
}

const MODES: { id: CalculationMode; label: string; icon: string }[] = [
  { id: 'pace', label: 'Pace Calculator', icon: 'speed' },
  { id: 'time', label: 'Finish Time', icon: 'timer' },
  { id: 'distance', label: 'Distance Calc', icon: 'straighten' },
  { id: '5k', label: '5K Target', icon: 'flag' },
  { id: '10k', label: '10K Target', icon: 'sports_score' },
  { id: 'half', label: 'Half Marathon', icon: 'directions_run' },
  { id: 'marathon', label: 'Full Marathon', icon: 'military_tech' },
  { id: 'splits', label: 'Split Matrix', icon: 'view_timeline' },
  { id: 'zones', label: 'Training Zones', icon: 'vital_signs' },
];

export default function ModeNavRail({ activeMode, onSelectMode }: ModeNavRailProps) {
  return (
    <section className="w-full bg-surface border-b border-surface-container overflow-x-auto no-scrollbar">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex items-center gap-space-xs whitespace-nowrap">
        {MODES.map((item) => {
          const isActive = activeMode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`mode-tab-${item.id}`}
              onClick={() => onSelectMode(item.id)}
              className={`px-3 py-1.5 rounded-full text-label-md font-label-md font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
