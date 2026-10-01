'use client';

import React from 'react';
import { BreedInfo } from './petBreedsData';

interface BreedLongevityDossierProps {
  breed: BreedInfo;
  currentAgeYears: number;
  currentAgeMonths: number;
}

export default function BreedLongevityDossier({
  breed,
  currentAgeYears,
  currentAgeMonths,
}: BreedLongevityDossierProps) {
  const totalAge = currentAgeYears + currentAgeMonths / 12;
  const isSenior = totalAge >= breed.seniorAge;
  const yearsUntilSenior = Math.max(0, breed.seniorAge - totalAge);
  const remainingExpected = Math.max(0, breed.medianYears - totalAge);

  // Canine baseline is ~11.5 years
  const canineBaseline = 11.5;
  const diffFromBaseline = breed.medianYears - canineBaseline;

  return (
    <div
      id="breed-longevity-dossier"
      className="p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/20 flex flex-col gap-space-sm transition-all"
    >
      {/* Header with Breed Name, Category and Lifespan Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-xs border-b border-outline-variant/15">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">genetics</span>
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-headline-sm text-body-md font-bold text-on-surface">
                {breed.name} Longevity Profile
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-container text-on-surface-variant">
                {breed.sizeCategory}
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant font-body-sm">
              Typical adult weight: <span className="font-medium text-on-surface">{breed.weightRange}</span>
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[15px]">hourglass_top</span>
          <span className="text-[12px] font-data-mono font-bold text-primary">
            Lifespan: {breed.expectedLifespan}
          </span>
        </div>
      </div>

      {/* 3 Metric Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-1">
        {/* Median Lifespan */}
        <div className="p-space-xs rounded-lg bg-surface-container-lowest border border-outline-variant/10 flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-semibold">
            Median Lifespan
          </span>
          <span className="font-data-mono text-body-lg text-on-surface font-bold">
            ~{breed.medianYears.toFixed(1)} Yrs
          </span>
          <span className="text-[11px] text-on-surface-variant">
            {diffFromBaseline > 1 ? (
              <span className="text-emerald-600 font-medium">+{diffFromBaseline.toFixed(1)}y above average</span>
            ) : diffFromBaseline < -1 ? (
              <span className="text-amber-600 font-medium">{diffFromBaseline.toFixed(1)}y below average</span>
            ) : (
              <span>Near canine average</span>
            )}
          </span>
        </div>

        {/* Senior Life Stage Threshold */}
        <div className="p-space-xs rounded-lg bg-surface-container-lowest border border-outline-variant/10 flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-semibold">
            Senior Milestone
          </span>
          <span className="font-data-mono text-body-lg text-on-surface font-bold">
            Age {breed.seniorAge} Yrs
          </span>
          <span className="text-[11px] text-on-surface-variant">
            {isSenior ? (
              <span className="text-secondary font-medium">Currently in Senior Phase</span>
            ) : (
              <span>~{yearsUntilSenior.toFixed(1)} yrs to senior checkups</span>
            )}
          </span>
        </div>

        {/* Biological Aging Velocity */}
        <div className="p-space-xs rounded-lg bg-surface-container-lowest border border-outline-variant/10 flex flex-col gap-0.5">
          <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-semibold">
            Post-Adulthood Rate
          </span>
          <span className="font-data-mono text-body-lg text-primary font-bold">
            +{breed.agingRatePerYear.toFixed(1)}y / yr
          </span>
          <span className="text-[11px] text-on-surface-variant">
            Human equivalent pace after age 2
          </span>
        </div>
      </div>

      {/* Breed Longevity Context */}
      <div className="p-space-xs rounded-lg bg-surface-container-lowest/80 border border-outline-variant/10 text-[12px] flex flex-col gap-1">
        <p className="text-on-surface font-medium leading-snug">
          <span className="font-bold text-primary">Biological Context: </span>
          {breed.longevitySummary}
        </p>
        <p className="text-on-surface-variant leading-snug">
          <span className="font-semibold text-on-surface">Clinical Health Focus: </span>
          {breed.healthFocus}
        </p>
      </div>

      {/* Lifespan Comparison Bar */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex justify-between text-[11px] font-data-mono text-on-surface-variant">
          <span>Current Age: {totalAge.toFixed(1)}y</span>
          <span>Expected Horizon: ~{breed.medianYears.toFixed(1)}y</span>
          <span>Remaining: ~{remainingExpected.toFixed(1)}y</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden relative">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, (totalAge / breed.medianYears) * 100))}%` }}
          />
          {/* Senior milestone marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-secondary-container z-10"
            style={{ left: `${Math.min(95, (breed.seniorAge / breed.medianYears) * 100)}%` }}
            title={`Senior Milestone (Age ${breed.seniorAge})`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-on-surface-variant/70">
          <span>Puppy / Kitten (0-1y)</span>
          <span className="text-secondary font-medium">Senior Line ({breed.seniorAge}y)</span>
          <span>Golden Years ({breed.maxYears}y+)</span>
        </div>
      </div>
    </div>
  );
}
