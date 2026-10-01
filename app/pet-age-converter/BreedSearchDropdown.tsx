'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BreedInfo, getBreedsForSpecies } from './petBreedsData';

interface BreedSearchDropdownProps {
  species: 'canine' | 'feline' | 'rabbit' | 'pocket' | 'avian';
  selectedBreedName: string;
  onSelectBreed: (breed: BreedInfo) => void;
  onCustomBreed: (customName: string) => void;
}

export default function BreedSearchDropdown({
  species,
  selectedBreedName,
  onSelectBreed,
  onCustomBreed,
}: BreedSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large' | 'giant'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const breedsList = useMemo(() => {
    return getBreedsForSpecies(species);
  }, [species]);

  // Reset search and filter when species changes
  useEffect(() => {
    setSearchQuery('');
    setSizeFilter('all');
  }, [species]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter breeds based on search query and size filter
  const filteredBreeds = useMemo(() => {
    let list = breedsList;
    if (sizeFilter !== 'all' && species === 'canine') {
      list = list.filter((b) => b.tier === sizeFilter);
    }
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.sizeCategory.toLowerCase().includes(q) ||
        b.weightRange.toLowerCase().includes(q) ||
        b.healthFocus.toLowerCase().includes(q)
    );
  }, [breedsList, searchQuery, sizeFilter, species]);

  const handleSelect = (breed: BreedInfo) => {
    onSelectBreed(breed);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleCustomSubmit = () => {
    if (searchQuery.trim()) {
      onCustomBreed(searchQuery.trim());
      setIsOpen(false);
    }
  };

  const getLifespanBadgeColor = (minY: number, maxY: number) => {
    const avg = (minY + maxY) / 2;
    if (avg >= 14) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (avg >= 11) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (avg >= 9) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  };

  return (
    <div className="relative w-full" ref={dropdownRef} id="breed-search-container">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="pet-breed-input"
            className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold"
          >
            {species === 'canine'
              ? 'Dog Breed & Lifespan Expectancy'
              : species === 'feline'
              ? 'Cat Breed & Longevity'
              : 'Breed / Variety'}
          </label>
          <span className="font-data-mono text-[11px] text-primary font-medium">
            {breedsList.length} verified {species === 'canine' ? 'dog' : 'pet'} breeds
          </span>
        </div>

        {/* Search & Trigger Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
            search
          </span>
          <input
            id="pet-breed-input"
            ref={inputRef}
            type="text"
            className="w-full pl-10 pr-16 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/15 cursor-pointer placeholder:text-on-surface-variant/60"
            placeholder={
              species === 'canine'
                ? 'Search breeds (e.g. Golden, Chihuahua, Bulldog)...'
                : species === 'feline'
                ? 'Search cat breeds (e.g. Siamese, Maine Coon)...'
                : 'Search breeds or varieties...'
            }
            value={isOpen ? searchQuery : selectedBreedName}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(true);
              setSearchQuery('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredBreeds.length > 0) {
                  handleSelect(filteredBreeds[0]);
                } else if (searchQuery.trim()) {
                  handleCustomSubmit();
                }
              }
            }}
          />

          {/* Right Action Icons */}
          <div className="absolute right-2 flex items-center gap-1">
            {isOpen && searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors cursor-pointer"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-7 h-7 rounded-md hover:bg-surface-container flex items-center justify-center text-outline transition-colors cursor-pointer"
              title="Toggle breed list"
            >
              <span className={`material-symbols-outlined text-[18px] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/25 overflow-hidden flex flex-col max-h-[380px] animate-in fade-in-50 duration-100">
          {/* Header & Canine Size Filters */}
          <div className="p-space-xs bg-surface-container-low border-b border-outline-variant/15 flex flex-col gap-1.5">
            {species === 'canine' && (
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                {(
                  [
                    { id: 'all', label: 'All Sizes' },
                    { id: 'small', label: 'Small (<20 lbs)' },
                    { id: 'medium', label: 'Medium (21-50 lbs)' },
                    { id: 'large', label: 'Large (51-90 lbs)' },
                    { id: 'giant', label: 'Giant (>90 lbs)' },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setSizeFilter(pill.id)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      sizeFilter === pill.id
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between px-1 text-[11px] font-data-mono text-on-surface-variant">
              <span>
                {filteredBreeds.length} {filteredBreeds.length === 1 ? 'breed' : 'breeds'} found
              </span>
              <span className="opacity-70">Lifespan &amp; Senior Threshold</span>
            </div>
          </div>

          {/* Scrollable Breeds List */}
          <div className="overflow-y-auto divide-y divide-outline-variant/10 max-h-[300px]">
            {filteredBreeds.length > 0 ? (
              filteredBreeds.map((breed) => {
                const isSelected = breed.name.toLowerCase() === selectedBreedName.toLowerCase();
                const badgeColor = getLifespanBadgeColor(breed.minYears, breed.maxYears);
                return (
                  <button
                    key={breed.id}
                    type="button"
                    onClick={() => handleSelect(breed)}
                    className={`w-full text-left p-space-sm hover:bg-surface-container transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected ? 'bg-primary-fixed/30 text-primary font-semibold' : 'text-on-surface'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-body-sm text-body-sm font-semibold truncate text-on-surface">
                          {breed.name}
                        </span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                        <span>{breed.sizeCategory}</span>
                        <span>•</span>
                        <span>{breed.weightRange}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-data-mono font-semibold border ${badgeColor}`}>
                        {breed.expectedLifespan}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-data-mono">
                        Senior at {breed.seniorAge}y
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-space-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[32px]">pets</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No preset breed matching &ldquo;{searchQuery}&rdquo;
                </p>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleCustomSubmit}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-body-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Use &ldquo;{searchQuery.trim()}&rdquo; as Custom Breed
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Custom Option Footer */}
          <div className="p-space-xs bg-surface-container-low border-t border-outline-variant/15 flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant px-1">
              Need a mixed or unique breed?
            </span>
            <button
              type="button"
              onClick={() => {
                onCustomBreed('Mixed / Other Breed');
                setIsOpen(false);
              }}
              className="text-[11px] font-semibold text-primary hover:underline px-1 py-0.5 cursor-pointer"
            >
              Select Mixed Breed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
