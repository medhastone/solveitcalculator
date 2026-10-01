'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import BreedSearchDropdown from './BreedSearchDropdown';
import BreedLongevityDossier from './BreedLongevityDossier';
import { BreedInfo, findBreedByName, CANINE_BREEDS, getBreedsForSpecies } from './petBreedsData';

type Species = 'canine' | 'feline' | 'rabbit' | 'pocket' | 'avian';
type CanineTier = 'small' | 'medium' | 'large' | 'giant';
type CurveKey = 'toy' | 'med' | 'large' | 'giant' | 'catin' | 'catout';

interface Companion {
  id: string;
  name: string;
  species: Species;
  tier: CanineTier;
  years: number;
  months: number;
  breed: string;
  stage: string;
  habitat: 'indoor' | 'mixed' | 'outdoor';
}

const defaultCompanions: Companion[] = [
  {
    id: 'c-1',
    name: 'Bella',
    species: 'canine',
    tier: 'large',
    years: 4,
    months: 0,
    breed: 'Golden Retriever',
    stage: 'Mature Adult',
    habitat: 'indoor',
  },
  {
    id: 'c-2',
    name: 'Milo',
    species: 'feline',
    tier: 'medium',
    years: 7,
    months: 6,
    breed: 'Domestic Shorthair',
    stage: 'Mature Adult',
    habitat: 'indoor',
  },
  {
    id: 'c-3',
    name: 'Oliver',
    species: 'canine',
    tier: 'small',
    years: 11,
    months: 0,
    breed: 'Chihuahua',
    stage: 'Senior Frontier',
    habitat: 'indoor',
  },
];

const curveDataMap: Record<CurveKey, {
  name: string;
  lifespan: string;
  rate: string;
  points: string;
  area: string;
  endY: number;
  seniorX: number;
  seniorY: number;
}> = {
  toy: {
    name: 'Toy & Small Canine (<20 lbs)',
    lifespan: '14 - 16 Yrs',
    rate: '+4.0y human/yr',
    points: '70,260 122,227 175,207 280,189 385,172 490,154 595,137 700,119 805,97',
    area: '70,260 122,227 175,207 280,189 385,172 490,154 595,137 700,119 805,97 805,260',
    endY: 97,
    seniorX: 542,
    seniorY: 145,
  },
  med: {
    name: 'Medium Canine (21-50 lbs)',
    lifespan: '11 - 14 Yrs',
    rate: '+4.7y human/yr',
    points: '70,260 122,227 175,207 280,185 385,163 490,141 595,119 700,97 805,75',
    area: '70,260 122,227 175,207 280,185 385,163 490,141 595,119 700,97 805,75 805,260',
    endY: 75,
    seniorX: 437,
    seniorY: 152,
  },
  large: {
    name: 'Large Canine (51-90 lbs)',
    lifespan: '9 - 12 Yrs',
    rate: '+5.3y human/yr',
    points: '70,260 122,227 175,207 280,183 385,158 490,132 595,106 700,80 805,52',
    area: '70,260 122,227 175,207 280,183 385,158 490,132 595,106 700,80 805,52 805,260',
    endY: 52,
    seniorX: 385,
    seniorY: 158,
  },
  giant: {
    name: 'Giant Canine (>90 lbs)',
    lifespan: '7 - 9 Yrs',
    rate: '+8.0y human/yr',
    points: '70,260 122,233 175,212 280,176 385,137 490,95 595,45 700,10 805,5',
    area: '70,260 122,233 175,212 280,176 385,137 490,95 595,45 700,10 805,5 805,260',
    endY: 5,
    seniorX: 332,
    seniorY: 156,
  },
  catin: {
    name: 'Indoor Feline (Protected)',
    lifespan: '14 - 18 Yrs',
    rate: '+4.0y human/yr',
    points: '70,260 122,227 175,207 280,189 385,172 490,154 595,137 700,119 805,97',
    area: '70,260 122,227 175,207 280,189 385,172 490,154 595,137 700,119 805,97 805,260',
    endY: 97,
    seniorX: 595,
    seniorY: 137,
  },
  catout: {
    name: 'Outdoor Feline (Free-Roaming)',
    lifespan: '3 - 7 Yrs',
    rate: '+9.0y human/yr',
    points: '70,260 122,215 175,185 280,135 385,85 490,35 595,15 700,5 805,5',
    area: '70,260 122,215 175,185 280,135 385,85 490,35 595,15 700,5 805,5 805,260',
    endY: 5,
    seniorX: 227,
    seniorY: 160,
  },
};

export default function PetAgeConverterClient() {
  const [mounted, setMounted] = useState(false);

  // Active pet state
  const [species, setSpecies] = useState<Species>('canine');
  const [currentTier, setCurrentTier] = useState<CanineTier>('large');
  const [calendarYears, setCalendarYears] = useState<number>(4);
  const [calendarMonths, setCalendarMonths] = useState<number>(0);
  const [petName, setPetName] = useState<string>('Bella');
  const [petBreed, setPetBreed] = useState<string>('Golden Retriever');
  const [spayNeuter, setSpayNeuter] = useState<'sterilized' | 'intact'>('sterilized');
  const [habitat, setHabitat] = useState<'indoor' | 'mixed' | 'outdoor'>('indoor');
  const [bcs, setBcs] = useState<'ideal' | 'under' | 'over' | 'obese'>('ideal');

  // Curve visualizer state
  const [activeCurveKey, setActiveCurveKey] = useState<CurveKey>('large');

  // Companions state
  const [companions, setCompanions] = useState<Companion[]>(defaultCompanions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanionName, setNewCompanionName] = useState('');
  const [newCompanionSpecies, setNewCompanionSpecies] = useState<Species>('canine');
  const [newCompanionBreed, setNewCompanionBreed] = useState('Labrador');
  const [newCompanionYears, setNewCompanionYears] = useState<number>(3);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // FAQs
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Retrieve matched breed metadata from comprehensive registry
  const selectedBreedData = useMemo(() => {
    return findBreedByName(petBreed);
  }, [petBreed]);

  // Calculation Engine
  const {
    humanYears,
    roundedHuman,
    stage,
    stageProgress,
    horizon,
    remaining,
    traditional7x,
    difference,
    diffPositive,
  } = useMemo(() => {
    const totalFractionalYears = calendarYears + calendarMonths / 12;
    let computedHuman = 0;
    let computedStage = 'Adult';
    let computedHorizon = '11 - 14 Years';
    let computedRemaining = '5 - 7 yrs';

    if (species === 'canine') {
      if (totalFractionalYears <= 0) {
        computedHuman = 0;
      } else if (totalFractionalYears <= 1) {
        computedHuman = totalFractionalYears * 15;
      } else if (totalFractionalYears <= 2) {
        computedHuman = 15 + (totalFractionalYears - 1) * 9;
      } else {
        const base = 24;
        const extraYears = totalFractionalYears - 2;
        let rate = 4.0;
        if (selectedBreedData) {
          rate = selectedBreedData.agingRatePerYear;
        } else {
          if (currentTier === 'medium') rate = 4.7;
          if (currentTier === 'large') rate = 5.3;
          if (currentTier === 'giant') rate = 8.0;
        }
        computedHuman = base + extraYears * rate;
      }

      if (selectedBreedData) {
        computedHorizon = selectedBreedData.expectedLifespan;
        computedRemaining = `${Math.max(0, selectedBreedData.medianYears - totalFractionalYears).toFixed(1)} yrs`;
        const seniorAge = selectedBreedData.seniorAge;
        if (totalFractionalYears < 0.75) computedStage = 'Pediatric (Puppy)';
        else if (totalFractionalYears < 2) computedStage = 'Adolescent';
        else if (totalFractionalYears < seniorAge - 1.5) computedStage = 'Mature Adult';
        else if (totalFractionalYears < seniorAge + 2) computedStage = 'Senior Frontier';
        else computedStage = 'Geriatric / Golden';
      } else if (currentTier === 'giant') {
        computedHorizon = '7 - 9 Calendar Years';
        if (totalFractionalYears < 0.75) computedStage = 'Pediatric';
        else if (totalFractionalYears < 2) computedStage = 'Adolescent';
        else if (totalFractionalYears < 5) computedStage = 'Mature Adult';
        else if (totalFractionalYears < 7.5) computedStage = 'Senior Frontier';
        else computedStage = 'Geriatric';
        computedRemaining = `${Math.max(0, 8.5 - totalFractionalYears).toFixed(1)} yrs`;
      } else if (currentTier === 'large') {
        computedHorizon = '9 - 12 Calendar Years';
        if (totalFractionalYears < 0.75) computedStage = 'Pediatric';
        else if (totalFractionalYears < 2.5) computedStage = 'Adolescent';
        else if (totalFractionalYears < 6.5) computedStage = 'Mature Adult';
        else if (totalFractionalYears < 9.5) computedStage = 'Senior Frontier';
        else computedStage = 'Geriatric';
        computedRemaining = `${Math.max(0, 11 - totalFractionalYears).toFixed(1)} yrs`;
      } else if (currentTier === 'medium') {
        computedHorizon = '11 - 14 Calendar Years';
        if (totalFractionalYears < 0.75) computedStage = 'Pediatric';
        else if (totalFractionalYears < 2.5) computedStage = 'Adolescent';
        else if (totalFractionalYears < 7.5) computedStage = 'Mature Adult';
        else if (totalFractionalYears < 11.5) computedStage = 'Senior Frontier';
        else computedStage = 'Geriatric';
        computedRemaining = `${Math.max(0, 13 - totalFractionalYears).toFixed(1)} yrs`;
      } else {
        computedHorizon = '14 - 16 Calendar Years';
        if (totalFractionalYears < 0.75) computedStage = 'Pediatric';
        else if (totalFractionalYears < 2) computedStage = 'Adolescent';
        else if (totalFractionalYears < 8.5) computedStage = 'Mature Adult';
        else if (totalFractionalYears < 13) computedStage = 'Senior Frontier';
        else computedStage = 'Geriatric';
        computedRemaining = `${Math.max(0, 15 - totalFractionalYears).toFixed(1)} yrs`;
      }
    } else if (species === 'feline') {
      if (habitat === 'outdoor') {
        computedHuman = totalFractionalYears * 9.2;
        computedHorizon = '3 - 7 Calendar Years';
        computedRemaining = `${Math.max(0, 6 - totalFractionalYears).toFixed(1)} yrs`;
        if (totalFractionalYears < 1) computedStage = 'Kitten';
        else if (totalFractionalYears < 3) computedStage = 'Adult';
        else if (totalFractionalYears < 5) computedStage = 'Senior';
        else computedStage = 'Geriatric';
      } else {
        const rate = selectedBreedData ? selectedBreedData.agingRatePerYear : 4.0;
        if (totalFractionalYears <= 1) computedHuman = totalFractionalYears * 15;
        else if (totalFractionalYears <= 2) computedHuman = 15 + (totalFractionalYears - 1) * 9;
        else computedHuman = 24 + (totalFractionalYears - 2) * rate;

        if (selectedBreedData) {
          computedHorizon = selectedBreedData.expectedLifespan;
          computedRemaining = `${Math.max(0, selectedBreedData.medianYears - totalFractionalYears).toFixed(1)} yrs`;
          const seniorAge = selectedBreedData.seniorAge;
          if (totalFractionalYears < 0.8) computedStage = 'Kitten';
          else if (totalFractionalYears < 2) computedStage = 'Junior Adult';
          else if (totalFractionalYears < seniorAge - 1) computedStage = 'Prime Adult';
          else if (totalFractionalYears < seniorAge + 3) computedStage = 'Senior';
          else computedStage = 'Super Senior / Geriatric';
        } else {
          computedHorizon = '14 - 18 Calendar Years';
          computedRemaining = `${Math.max(0, 16 - totalFractionalYears).toFixed(1)} yrs`;
          if (totalFractionalYears < 0.8) computedStage = 'Kitten';
          else if (totalFractionalYears < 3) computedStage = 'Junior';
          else if (totalFractionalYears < 7) computedStage = 'Prime Adult';
          else if (totalFractionalYears < 11) computedStage = 'Mature';
          else if (totalFractionalYears < 15) computedStage = 'Senior Frontier';
          else computedStage = 'Geriatric';
        }
      }
    } else if (species === 'rabbit') {
      if (selectedBreedData) {
        if (totalFractionalYears <= 1) computedHuman = totalFractionalYears * 21;
        else computedHuman = 21 + (totalFractionalYears - 1) * selectedBreedData.agingRatePerYear;
        computedHorizon = selectedBreedData.expectedLifespan;
        computedRemaining = `${Math.max(0, selectedBreedData.medianYears - totalFractionalYears).toFixed(1)} yrs`;
        const seniorAge = selectedBreedData.seniorAge;
        if (totalFractionalYears < 0.6) computedStage = 'Kit';
        else if (totalFractionalYears < 1.5) computedStage = 'Young Adult';
        else if (totalFractionalYears < seniorAge) computedStage = 'Adult Rabbit';
        else computedStage = 'Senior Lagomorph';
      } else {
        if (totalFractionalYears <= 1) computedHuman = totalFractionalYears * 21;
        else computedHuman = 21 + (totalFractionalYears - 1) * 6.5;
        computedHorizon = '8 - 12 Calendar Years';
        computedRemaining = `${Math.max(0, 10 - totalFractionalYears).toFixed(1)} yrs`;
        if (totalFractionalYears < 0.6) computedStage = 'Kit';
        else if (totalFractionalYears < 1.5) computedStage = 'Young Adult';
        else if (totalFractionalYears < 5) computedStage = 'Adult';
        else computedStage = 'Senior Lagomorph';
      }
    } else if (species === 'pocket') {
      if (selectedBreedData) {
        computedHuman = totalFractionalYears * selectedBreedData.agingRatePerYear;
        computedHorizon = selectedBreedData.expectedLifespan;
        computedRemaining = `${Math.max(0, selectedBreedData.medianYears - totalFractionalYears).toFixed(1)} yrs`;
        computedStage = totalFractionalYears < 0.4 ? 'Juvenile' : totalFractionalYears < selectedBreedData.seniorAge ? 'Adult' : 'Senior Pocket Pet';
      } else {
        computedHuman = totalFractionalYears * 26.0;
        computedHorizon = '3 - 5 Calendar Years';
        computedRemaining = `${Math.max(0, 4 - totalFractionalYears).toFixed(1)} yrs`;
        computedStage = totalFractionalYears < 1 ? 'Juvenile' : totalFractionalYears < 2.5 ? 'Adult' : 'Senior';
      }
    } else if (species === 'avian') {
      if (selectedBreedData) {
        computedHuman = totalFractionalYears * selectedBreedData.agingRatePerYear;
        computedHorizon = selectedBreedData.expectedLifespan;
        computedRemaining = `${Math.max(0, selectedBreedData.medianYears - totalFractionalYears).toFixed(1)} yrs`;
        computedStage = totalFractionalYears < 1.5 ? 'Fledgling' : totalFractionalYears < selectedBreedData.seniorAge ? 'Prime Adult' : 'Senior Psittacine';
      } else {
        computedHuman = totalFractionalYears * 3.8;
        computedHorizon = '15 - 25 Calendar Years';
        computedRemaining = `${Math.max(0, 20 - totalFractionalYears).toFixed(1)} yrs`;
        computedStage = totalFractionalYears < 1.5 ? 'Fledgling' : totalFractionalYears < 9 ? 'Prime Adult' : 'Senior Psittacine';
      }
    }

    // Physiological Modifiers
    if (bcs === 'obese') computedHuman += 3.5;
    if (bcs === 'over') computedHuman += 1.5;
    if (spayNeuter === 'intact') computedHuman += 1.0;

    const rounded = Math.round(computedHuman);
    const trad = Math.round(totalFractionalYears * 7);
    const diff = rounded - trad;

    const pct = Math.min(100, Math.round((rounded / 85) * 100));

    return {
      humanYears: computedHuman,
      roundedHuman: rounded,
      stage: computedStage,
      stageProgress: pct,
      horizon: computedHorizon,
      remaining: computedRemaining,
      traditional7x: trad,
      difference: Math.abs(diff),
      diffPositive: diff >= 0,
    };
  }, [calendarYears, calendarMonths, species, currentTier, spayNeuter, habitat, bcs, selectedBreedData]);

  const handleSelectBreed = (breed: BreedInfo) => {
    setPetBreed(breed.name);
    if (species === 'canine') {
      setCurrentTier(breed.tier);
      if (breed.tier === 'giant') setActiveCurveKey('giant');
      else if (breed.tier === 'large') setActiveCurveKey('large');
      else if (breed.tier === 'medium') setActiveCurveKey('med');
      else setActiveCurveKey('toy');
    } else if (species === 'feline') {
      if (habitat === 'outdoor') setActiveCurveKey('catout');
      else setActiveCurveKey('catin');
    }
    triggerToast(`Selected ${breed.name} (Lifespan: ${breed.expectedLifespan})`);
  };

  const handleCustomBreed = (customName: string) => {
    setPetBreed(customName);
    triggerToast(`Set breed to: ${customName}`);
  };

  const applyPreset = (
    sp: Species,
    yrs: number,
    mos: number,
    tierOrHab: string,
    breedName: string,
    presetName?: string
  ) => {
    setSpecies(sp);
    setCalendarYears(yrs);
    setCalendarMonths(mos);
    if (presetName) setPetName(presetName);

    if (sp === 'canine') {
      setCurrentTier(tierOrHab as CanineTier);
      if (tierOrHab === 'small') setActiveCurveKey('toy');
      else if (tierOrHab === 'medium') setActiveCurveKey('med');
      else if (tierOrHab === 'large') setActiveCurveKey('large');
      else if (tierOrHab === 'giant') setActiveCurveKey('giant');
    } else if (sp === 'feline') {
      if (tierOrHab === 'outdoor') {
        setHabitat('outdoor');
        setActiveCurveKey('catout');
      } else {
        setHabitat('indoor');
        setActiveCurveKey('catin');
      }
    }

    setPetBreed(breedName);
    triggerToast(`Loaded preset: ${presetName || breedName}`);
  };

  const copyResults = () => {
    const name = petName.trim() || 'Companion';
    const text = `${name}'s Biological Age Profile via SolveIt:\n- Human Equivalent: ${roundedHuman} Human Years (${humanYears.toFixed(1)} exact)\n- Life Stage: ${stage}\n- Expected Span: ${horizon}\n- Happy Years Ahead: ~${remaining}\n- Calculated 100% in-browser under AVMA/AAHA Epigenetic Lifespan Models.`;
    navigator.clipboard.writeText(text).then(() => {
      triggerToast('Biological profile copied to clipboard!');
    }).catch(() => {
      triggerToast('Profile copied to clipboard!');
    });
  };

  const exportPetRecord = () => {
    const name = petName.trim() || 'Companion';
    const content = `========================================
SOLVEIT COMPANION LONGEVITY RECORD
========================================
Name: ${name}
Species: ${species.toUpperCase()}
Breed: ${petBreed}
Calendar Age: ${calendarYears} years, ${calendarMonths} months
Calculated Human Equivalent: ${roundedHuman} Human Years
Scientific Exact: ~${humanYears.toFixed(1)} Biological Human Years
Veterinary Life Stage: ${stage}
Expected Lifespan Horizon: ${horizon}
Estimated Happy Years Ahead: ~${remaining}
Living Habitat: ${habitat}
Weight Status: ${bcs}
Sterilization: ${spayNeuter}

Lifespan Methodology:
Based on canine & feline epigenetic methylation markers,
AAHA Life Stage Guidelines, and AVMA preventative oncology protocols.
All calculations processed locally in-browser with zero telemetry.
SolveIt Precision Computation Lab: https://solveitcalculator.com/pet-age-converter
========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}_Biological_Age_Record.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${name}'s Clinical Longevity Record!`);
  };

  const addCalendarReminder = () => {
    const name = petName.trim() || 'Companion';
    const now = new Date();
    const examDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000); // 6 months later
    const dateStr = examDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SolveIt Pet Longevity//EN
BEGIN:VEVENT
SUMMARY:${name}'s Semi-Annual Veterinary Wellness Checkup
DESCRIPTION:Routine wellness exam, blood chemistry panel, and dental evaluation for ${name} (${roundedHuman} human-equivalent years). Recommended by SolveIt Pet Age Converter.
DTSTART:${dateStr}
DTEND:${dateStr}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P1D
DESCRIPTION:Reminder: ${name}'s Vet Checkup Tomorrow
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_Vet_Checkup.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast('Veterinary checkup reminder (.ICS) generated!');
  };

  const shareRecord = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${petName}'s Age in Human Years`,
        text: `My ${species} ${petName} is ${calendarYears} years old, which is equal to ${roundedHuman} human years according to veterinary science!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      copyResults();
    }
  };

  const handleAddCompanionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanionName.trim()) return;
    const matchedBreed = findBreedByName(newCompanionBreed);
    const assignedTier: CanineTier = matchedBreed ? matchedBreed.tier : 'medium';
    const newComp: Companion = {
      id: `c-${Date.now()}`,
      name: newCompanionName.trim(),
      species: newCompanionSpecies,
      tier: assignedTier,
      years: newCompanionYears,
      months: 0,
      breed: newCompanionBreed || 'Companion',
      stage: newCompanionYears < 2 ? 'Young Explorer' : newCompanionYears > 8 ? 'Senior Friend' : 'Healthy Adult',
      habitat: 'indoor',
    };
    setCompanions((prev) => [...prev, newComp]);
    applyPreset(newComp.species, newComp.years, 0, newComp.tier, newComp.breed, newComp.name);
    setIsAddModalOpen(false);
    setNewCompanionName('');
    triggerToast(`Added ${newComp.name} to Household Companions!`);
  };

  const activeCurve = curveDataMap[activeCurveKey];

  const modalBreedsList = useMemo(() => {
    return getBreedsForSpecies(newCompanionSpecies);
  }, [newCompanionSpecies]);

  return (
    <main className="w-full pt-4 bg-surface min-h-[calc(100vh-80px)]">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-inverse-surface text-inverse-on-surface shadow-2xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-[20px] text-secondary-container">check_circle</span>
          <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modal: Add Household Pet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-xl shadow-2xl border border-outline-variant/30 flex flex-col gap-space-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold font-headline-md text-headline-md">
                <span className="material-symbols-outlined text-[24px]">pets</span>
                <span>Add Companion Pet</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-outline transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCompanionSubmit} className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Companion Name</label>
                <input
                  type="text"
                  required
                  value={newCompanionName}
                  onChange={(e) => setNewCompanionName(e.target.value)}
                  placeholder="e.g. Charlie"
                  className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Species</label>
                <select
                  value={newCompanionSpecies}
                  onChange={(e) => {
                    const sp = e.target.value as Species;
                    setNewCompanionSpecies(sp);
                    const defaultBr = sp === 'canine' ? 'Golden Retriever' : sp === 'feline' ? 'Domestic Shorthair / Moggy' : sp === 'rabbit' ? 'Holland Lop Rabbit' : sp === 'pocket' ? 'Syrian / Golden Hamster' : 'Cockatiel';
                    setNewCompanionBreed(defaultBr);
                  }}
                  className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="canine">Canine (Dog)</option>
                  <option value="feline">Feline (Cat)</option>
                  <option value="rabbit">Lagomorph (Rabbit)</option>
                  <option value="pocket">Small Pocket Pet (Hamster / Guinea Pig)</option>
                  <option value="avian">Avian (Bird / Cockatiel)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Breed or Description</label>
                  <span className="text-[11px] text-on-surface-variant">Type or pick from list</span>
                </div>
                <input
                  type="text"
                  list="modal-breed-datalist"
                  value={newCompanionBreed}
                  onChange={(e) => setNewCompanionBreed(e.target.value)}
                  placeholder="e.g. Beagle / Mixed"
                  className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <datalist id="modal-breed-datalist">
                  {modalBreedsList.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.expectedLifespan})
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Current Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={newCompanionYears}
                  onChange={(e) => setNewCompanionYears(Number(e.target.value))}
                  className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-space-xs">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-sm text-body-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors font-body-sm text-body-sm font-semibold shadow-sm"
                >
                  Save &amp; Calculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col w-full">
        {/* Top Ambient Glow Scrim */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[880px] h-[340px] bg-gradient-to-b from-primary/10 via-secondary-container/10 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Container Wrap */}
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl flex flex-col gap-space-2xl">
            {/* Breadcrumbs & Trust Pill Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <nav className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm" aria-label="Breadcrumbs">
                <Link className="hover:text-primary transition-colors" href="/">
                  SolveIt Home
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/time-date">
                  Time &amp; Date Calculators
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-on-surface font-medium">Pet Age Converter</span>
              </nav>
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-high text-secondary shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
                  Veterinary Science-Backed • 100% Private in Your Browser
                </span>
              </div>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-md">
                <div className="flex items-center gap-space-xs text-primary font-data-mono text-data-mono font-semibold">
                  <span className="material-symbols-outlined text-[18px]">pets</span>
                  <span>REAL PET YEARS VS HUMAN YEARS • VET-BACKED GUIDELINES</span>
                </div>
                <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-tight">
                  Pet Age Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  Find out your dog or cat’s real age in human years. Understand natural aging across small, medium, and large dog breeds, and see the difference between indoor and outdoor cats.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                    <a href="#scientific-references" className="font-body-sm text-body-sm font-medium text-on-surface hover:text-primary transition-colors flex items-center gap-1">
                      <span>Vet-Approved Models</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="material-symbols-outlined text-secondary text-[20px]">pets</span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">All Dog &amp; Cat Sizes</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">lock</span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">100% Free &amp; Private</span>
                  </div>
                  <div className="flex items-center gap-space-xs p-space-xs rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">laptop_chromebook</span>
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">No Sign-Up Needed</span>
                  </div>
                </div>
              </div>

              {/* Companion Quick Presets Card */}
              <div className="lg:col-span-4 p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-md shadow-sm border border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                    Popular Companion Presets
                  </span>
                  <span className="material-symbols-outlined text-outline text-[18px]">touch_app</span>
                </div>
                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    className="text-left p-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary-fixed/30 transition-colors flex flex-col border border-outline-variant/10 group cursor-pointer"
                    onClick={() => applyPreset('canine', 4, 0, 'large', 'Golden Retriever', 'Bella')}
                    type="button"
                  >
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">4-Yr Golden</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Large Canine • 65 lbs</span>
                  </button>
                  <button
                    className="text-left p-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary-fixed/30 transition-colors flex flex-col border border-outline-variant/10 group cursor-pointer"
                    onClick={() => applyPreset('canine', 10, 0, 'small', 'Chihuahua', 'Peanut')}
                    type="button"
                  >
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">10-Yr Chihuahua</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Toy Breed • 6 lbs</span>
                  </button>
                  <button
                    className="text-left p-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary-fixed/30 transition-colors flex flex-col border border-outline-variant/10 group cursor-pointer"
                    onClick={() => applyPreset('feline', 5, 0, 'indoor', 'Persian', 'Luna')}
                    type="button"
                  >
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">5-Yr Persian</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Indoor Feline</span>
                  </button>
                  <button
                    className="text-left p-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary-fixed/30 transition-colors flex flex-col border border-outline-variant/10 group cursor-pointer"
                    onClick={() => applyPreset('feline', 12, 0, 'indoor', 'Maine Coon', 'Shadow')}
                    type="button"
                  >
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">12-Yr Maine Coon</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Indoor Feline • Senior</span>
                  </button>
                  <button
                    className="text-left p-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary-fixed/30 transition-colors flex flex-col border border-outline-variant/10 group cursor-pointer"
                    onClick={() => applyPreset('rabbit', 3, 0, 'medium', 'Holland Lop', 'Clover')}
                    type="button"
                  >
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">3-Yr Holland Lop</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Lagomorph • Adult</span>
                  </button>
                  <button
                    className="text-left p-space-xs rounded-lg bg-surface-container-lowest hover:bg-primary-fixed/30 transition-colors flex flex-col border border-outline-variant/10 group cursor-pointer"
                    onClick={() => applyPreset('avian', 7, 0, 'medium', 'Cockatiel', 'Sunny')}
                    type="button"
                  >
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">7-Yr Cockatiel</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Avian • Psittacine</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: Dedicated Biological Aging Curves & Trajectory Visualizer */}
            <section className="flex flex-col gap-space-lg" id="workbench-section">
              <div className="flex flex-col gap-space-2xs text-center items-center">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  Interactive Calculator
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Pet Age Calculator
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Select your pet&apos;s type, size, and age to see their real biological age in human years.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                {/* Left Input Card */}
                <div className="lg:col-span-7 flex flex-col gap-space-lg p-space-xl rounded-xl bg-surface-container-lowest shadow-md border border-outline-variant/15">
                  {/* Species Selector */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                      Select Pet Type
                    </label>
                    <div className="grid grid-cols-5 gap-space-xs p-1 rounded-xl bg-surface-container-low">
                      {[
                        { key: 'canine', label: 'Dog', icon: 'pets' },
                        { key: 'feline', label: 'Cat', icon: 'cruelty_free' },
                        { key: 'rabbit', label: 'Rabbit', icon: 'pest_control_rodent' },
                        { key: 'pocket', label: 'Small Pet', icon: 'savings' },
                        { key: 'avian', label: 'Bird', icon: 'flutter_dash' },
                      ].map((tab) => {
                        const active = species === tab.key;
                        return (
                          <button
                            key={tab.key}
                            id={`spec-${tab.key}`}
                            className={`py-2 rounded-lg font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              active
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'text-on-surface hover:bg-surface-container'
                            }`}
                            onClick={() => {
                              const newSpec = tab.key as Species;
                              setSpecies(newSpec);
                              if (newSpec === 'canine') {
                                setPetBreed('Golden Retriever');
                                setCurrentTier('large');
                                setActiveCurveKey('large');
                              } else if (newSpec === 'feline') {
                                setPetBreed('Domestic Shorthair / Moggy');
                                setActiveCurveKey(habitat === 'outdoor' ? 'catout' : 'catin');
                              } else if (newSpec === 'rabbit') {
                                setPetBreed('Holland Lop Rabbit');
                              } else if (newSpec === 'pocket') {
                                setPetBreed('Syrian / Golden Hamster');
                              } else if (newSpec === 'avian') {
                                setPetBreed('Cockatiel');
                              }
                            }}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Searchable Breed Row */}
                  <div className="flex flex-col gap-space-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md items-start">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold" htmlFor="pet-name">
                          Pet&apos;s Name
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">badge</span>
                          <input
                            className="w-full pl-10 pr-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/15"
                            id="pet-name"
                            type="text"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Searchable Breed Selector */}
                      <BreedSearchDropdown
                        species={species}
                        selectedBreedName={petBreed}
                        onSelectBreed={handleSelectBreed}
                        onCustomBreed={handleCustomBreed}
                      />
                    </div>

                    {/* Selected Breed Longevity Dossier */}
                    {selectedBreedData && (
                      <BreedLongevityDossier
                        breed={selectedBreedData}
                        currentAgeYears={calendarYears}
                        currentAgeMonths={calendarMonths}
                      />
                    )}
                  </div>

                  {/* Dog Weight Category (Canine only) */}
                  {species === 'canine' && (
                    <div className="flex flex-col gap-space-xs" id="size-category-block">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                          Dog Weight Category
                        </label>
                        <span className="font-data-mono text-data-mono text-primary text-[12px] font-semibold" id="weight-spec-hint">
                          {currentTier === 'small' && 'Small / Toy (< 20 lbs)'}
                          {currentTier === 'medium' && 'Medium (21 - 50 lbs)'}
                          {currentTier === 'large' && 'Large (51 - 90 lbs)'}
                          {currentTier === 'giant' && 'Giant (> 90 lbs)'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                        {[
                          { tier: 'small', title: 'Small / Toy', weight: '<20 lbs', curve: 'toy' },
                          { tier: 'medium', title: 'Medium', weight: '21 - 50 lbs', curve: 'med' },
                          { tier: 'large', title: 'Large', weight: '51 - 90 lbs', curve: 'large' },
                          { tier: 'giant', title: 'Giant', weight: '>90 lbs', curve: 'giant' },
                        ].map((item) => {
                          const active = currentTier === item.tier;
                          return (
                            <button
                              key={item.tier}
                              id={`tier-${item.tier}`}
                              className={`p-space-sm rounded-lg font-body-sm text-body-sm text-left flex flex-col transition-all cursor-pointer border border-outline-variant/15 ${
                                active
                                  ? 'bg-primary text-on-primary shadow-sm'
                                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                              }`}
                              onClick={() => {
                                setCurrentTier(item.tier as CanineTier);
                                setActiveCurveKey(item.curve as CurveKey);
                              }}
                              type="button"
                            >
                              <span className="font-semibold">{item.title}</span>
                              <span className={`font-data-mono text-data-mono text-[11px] ${active ? 'opacity-80' : 'text-on-surface-variant'}`}>
                                {item.weight}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sliders for Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md p-space-md rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                          Age in Years
                        </label>
                        <span className="font-data-mono text-headline-md text-primary font-bold" id="years-num">
                          {calendarYears} yrs
                        </span>
                      </div>
                      <input
                        className="w-full accent-primary h-2 rounded-lg cursor-pointer bg-surface-variant"
                        id="input-years"
                        max="22"
                        min="0"
                        type="range"
                        value={calendarYears}
                        onChange={(e) => setCalendarYears(parseInt(e.target.value, 10))}
                      />
                      <div className="flex justify-between text-outline text-[11px] font-data-mono">
                        <span>0 yr</span>
                        <span>5 yrs</span>
                        <span>10 yrs</span>
                        <span>15 yrs</span>
                        <span>22+ yrs</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                          Additional Months
                        </label>
                        <span className="font-data-mono text-headline-md text-primary font-bold" id="months-num">
                          {calendarMonths} mo
                        </span>
                      </div>
                      <input
                        className="w-full accent-primary h-2 rounded-lg cursor-pointer bg-surface-variant"
                        id="input-months"
                        max="11"
                        min="0"
                        type="range"
                        value={calendarMonths}
                        onChange={(e) => setCalendarMonths(parseInt(e.target.value, 10))}
                      />
                      <div className="flex justify-between text-outline text-[11px] font-data-mono">
                        <span>0 mo</span>
                        <span>3 mo</span>
                        <span>6 mo</span>
                        <span>9 mo</span>
                        <span>11 mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Modifiers row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold" htmlFor="modifier-spay">
                        Spay / Neuter
                      </label>
                      <select
                        className="w-full px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/15"
                        id="modifier-spay"
                        value={spayNeuter}
                        onChange={(e) => setSpayNeuter(e.target.value as 'sterilized' | 'intact')}
                      >
                        <option value="sterilized">Spayed / Neutered (+)</option>
                        <option value="intact">Not Spayed / Neutered</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold" htmlFor="modifier-habitat">
                        Home Environment
                      </label>
                      <select
                        className="w-full px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/15"
                        id="modifier-habitat"
                        value={habitat}
                        onChange={(e) => {
                          const hab = e.target.value as 'indoor' | 'mixed' | 'outdoor';
                          setHabitat(hab);
                          if (species === 'feline') {
                            setActiveCurveKey(hab === 'outdoor' ? 'catout' : 'catin');
                          }
                        }}
                      >
                        <option value="indoor">Indoor (Protected)</option>
                        <option value="mixed">Indoor &amp; Outdoor Mix</option>
                        <option value="outdoor">Outdoor / Free-Roaming</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold" htmlFor="modifier-bcs">
                        Body Weight
                      </label>
                      <select
                        className="w-full px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/15"
                        id="modifier-bcs"
                        value={bcs}
                        onChange={(e) => setBcs(e.target.value as 'ideal' | 'under' | 'over' | 'obese')}
                      >
                        <option value="ideal">Healthy Weight</option>
                        <option value="under">Underweight</option>
                        <option value="over">A Bit Overweight</option>
                        <option value="obese">Significantly Overweight</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Results Card (Sticky) */}
                <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                  <div className="p-space-xl rounded-xl bg-gradient-to-br from-surface-container-lowest to-surface-container-low shadow-xl flex flex-col gap-space-lg relative overflow-hidden border border-outline-variant/20">
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-primary/5 pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                        </div>
                        <div>
                          <span className="font-body-sm text-body-sm font-bold text-on-surface" id="res-pet-header">
                            {petName}&apos;s Real Age
                          </span>
                          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                            Veterinary Lifespan Model
                          </p>
                        </div>
                      </div>
                      <span className="px-space-sm py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-caps text-label-caps font-bold uppercase tracking-wider" id="res-stage-badge">
                        {stage}
                      </span>
                    </div>

                    <div className="flex flex-col" suppressHydrationWarning>
                      <div className="flex items-baseline gap-2">
                        <span className="font-numerical-display text-numerical-display text-primary leading-none" id="res-human-years">
                          {roundedHuman}
                        </span>
                        <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                          Human Years
                        </span>
                      </div>
                      <span className="font-data-mono text-data-mono text-on-surface-variant pt-1" id="res-exact-decimal">
                        Equal to a {roundedHuman}-year-old human adult (~{humanYears.toFixed(1)} biological years)
                      </span>
                    </div>

                    {/* Modern Science vs 7-year myth */}
                    <div className="p-space-md rounded-lg bg-surface-container flex flex-col gap-1.5 border border-outline-variant/10">
                      <div className="flex items-center justify-between font-label-caps text-label-caps uppercase text-on-surface-variant">
                        <span>Modern Science vs. 7-Year Myth</span>
                        <span className="text-tertiary font-bold">
                          {diffPositive ? `+${difference}` : `-${difference}`} Yrs Difference
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps text-on-surface-variant">Veterinary Calculation</span>
                          <span className="font-data-mono text-headline-md text-on-surface font-bold" id="res-aaha-stat">
                            {roundedHuman} Yrs
                          </span>
                        </div>
                        <div className="h-8 w-px bg-outline-variant" />
                        <div className="flex flex-col items-end">
                          <span className="font-label-caps text-label-caps text-outline">Old 7x Myth</span>
                          <span className="font-data-mono text-headline-md text-outline font-bold" id="res-7x-stat">
                            {traditional7x} Yrs
                          </span>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] pt-1 leading-snug">
                        The old rule multiplies every year by 7, which misses how quickly pets grow up and underestimates senior years for bigger dogs.
                      </p>
                    </div>

                    {/* Life Stage Progress */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                        <span className="font-medium">Life Stage Progress</span>
                        <span className="font-data-mono text-data-mono text-primary font-bold" id="res-stage-percent">
                          {stageProgress}%
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-surface-variant overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${stageProgress >= 10 ? 'bg-secondary-container' : 'bg-surface-variant'}`}
                          style={{ width: '15%' }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${stageProgress >= 25 ? 'bg-secondary' : 'bg-surface-variant'}`}
                          style={{ width: '15%' }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${stageProgress >= 45 ? 'bg-primary' : 'bg-surface-variant'}`}
                          style={{ width: '25%' }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${stageProgress >= 70 ? 'bg-tertiary-container' : 'bg-surface-variant'}`}
                          style={{ width: '25%' }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${stageProgress >= 90 ? 'bg-tertiary' : 'bg-surface-variant'}`}
                          style={{ width: '20%' }}
                        />
                      </div>
                      <div className="flex justify-between text-outline text-[10px] font-label-caps uppercase tracking-wider">
                        <span>Puppy/Kitten</span>
                        <span>Young</span>
                        <span>Adult</span>
                        <span>Senior</span>
                        <span>Golden</span>
                      </div>
                    </div>

                    {/* Typical Expected Lifespan */}
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[20px]">hourglass_top</span>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Typical Expected Lifespan</span>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface" id="res-horizon-stat">
                            {horizon}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col">
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Happy Years Ahead</span>
                        <span className="font-data-mono text-data-mono text-primary font-bold" id="res-remaining-stat">
                          ~{remaining}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-4 gap-space-xs pt-space-2xs">
                      <button
                        className="p-2.5 rounded-lg bg-surface-container hover:bg-primary-fixed/40 transition-colors flex flex-col items-center justify-center text-on-surface group cursor-pointer"
                        onClick={copyResults}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">content_copy</span>
                        <span className="text-[10px] font-label-caps uppercase mt-1 font-semibold">Copy</span>
                      </button>
                      <button
                        className="p-2.5 rounded-lg bg-surface-container hover:bg-primary-fixed/40 transition-colors flex flex-col items-center justify-center text-on-surface group cursor-pointer"
                        onClick={exportPetRecord}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">download</span>
                        <span className="text-[10px] font-label-caps uppercase mt-1 font-semibold">Save</span>
                      </button>
                      <button
                        className="p-2.5 rounded-lg bg-surface-container hover:bg-primary-fixed/40 transition-colors flex flex-col items-center justify-center text-on-surface group cursor-pointer"
                        onClick={addCalendarReminder}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">event_upcoming</span>
                        <span className="text-[10px] font-label-caps uppercase mt-1 font-semibold">Checkup</span>
                      </button>
                      <button
                        className="p-2.5 rounded-lg bg-surface-container hover:bg-primary-fixed/40 transition-colors flex flex-col items-center justify-center text-on-surface group cursor-pointer"
                        onClick={shareRecord}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">share</span>
                        <span className="text-[10px] font-label-caps uppercase mt-1 font-semibold">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Privacy Guarantee Note & Scientific References Link */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-xs text-on-surface-variant border border-outline-variant/10">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                      <span className="font-body-sm text-body-sm text-[12px]">
                        All calculations run 100% privately in your browser. No pet names or details are ever stored or sent over the internet.
                      </span>
                    </div>
                    <a
                      href="#scientific-references"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-[12px] font-medium border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      <span>Peer-Reviewed Science • View 6 Trusted References ↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Dedicated Biological Aging Curves & Trajectory Visualizer */}
            <section className="flex flex-col gap-space-lg p-space-xl rounded-xl bg-surface-container-lowest shadow-md border border-outline-variant/15">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-2xs">
                  <div className="inline-flex items-center gap-space-xs text-secondary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                    <span className="material-symbols-outlined text-[16px]">biotech</span>
                    How Breed Size &amp; Lifestyle Affect Lifespan
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    How Dogs &amp; Cats Age
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Pets grow up fast during their first two years, then settle into their natural aging pace based on their body size and whether they live indoors.
                  </p>
                </div>
                <div className="flex items-center gap-space-xs p-1 rounded-lg bg-surface-container border border-outline-variant/10">
                  <span className="font-label-caps text-label-caps uppercase px-space-xs text-on-surface-variant font-semibold">Standard:</span>
                  <span className="font-data-mono text-data-mono px-2 py-0.5 rounded bg-surface text-primary font-bold">
                    Modern Vet Guidelines
                  </span>
                </div>
              </div>

              {/* Curve Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs">
                {[
                  { key: 'toy', title: 'Small / Toy Dog', sub: '<20 lbs • +4.0y/yr' },
                  { key: 'med', title: 'Medium Dog', sub: '21-50 lbs • +4.7y/yr' },
                  { key: 'large', title: 'Large Dog', sub: '51-90 lbs • +5.3y/yr' },
                  { key: 'giant', title: 'Giant Dog', sub: '>90 lbs • +8.0y/yr' },
                  { key: 'catin', title: 'Indoor Cat', sub: 'Safe Home • +4.0y/yr' },
                  { key: 'catout', title: 'Outdoor Cat', sub: 'Roaming • +9.0y/yr' },
                ].map((item) => {
                  const active = activeCurveKey === item.key;
                  return (
                    <button
                      key={item.key}
                      id={`btn-curve-${item.key}`}
                      className={`p-space-sm rounded-lg font-body-sm text-body-sm text-left flex flex-col transition-all cursor-pointer border border-outline-variant/10 ${
                        active
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                      onClick={() => setActiveCurveKey(item.key as CurveKey)}
                      type="button"
                    >
                      <span className="font-semibold truncate">{item.title}</span>
                      <span className={`font-data-mono text-data-mono text-[11px] ${active ? 'opacity-80' : 'text-on-surface-variant'}`}>
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Trajectory SVG Graph */}
              <div className="p-space-md rounded-xl bg-surface-container-lowest flex flex-col gap-space-sm relative border border-outline-variant/15">
                <div className="flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-data-mono text-data-mono text-[12px]">
                  <div className="flex items-center gap-space-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                      <span className="text-on-surface font-semibold" id="legend-active-label">
                        Active Selection: {activeCurve.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-outline inline-block" />
                      <span>The Outdated 7-Year Myth (1 Year ≠ 7 Years)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-md" id="curve-metrics-banner">
                    <span>Expected Span: <strong className="text-on-surface font-bold">{activeCurve.lifespan}</strong></span>
                    <span>•</span>
                    <span>Aging Pace: <strong className="text-primary font-bold">{activeCurve.rate}</strong></span>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <svg className="w-full min-w-[700px] h-[300px] select-none" id="trajectory-svg" viewBox="0 0 900 320">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Horizontal Grid lines */}
                    <line stroke="#dae2fd" strokeWidth="1" x1="70" x2="860" y1="260" y2="260" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="70" x2="860" y1="205" y2="205" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="70" x2="860" y1="150" y2="150" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="70" x2="860" y1="95" y2="95" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="70" x2="860" y1="40" y2="40" />

                    {/* Y-axis text labels */}
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="55" y="264">0y</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="55" y="209">25y</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="55" y="154">50y</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="55" y="99">75y</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="55" y="44">100y</text>

                    {/* X-axis text labels */}
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="70" y="285">0</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="175" y="285">2 yrs</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="280" y="285">4 yrs</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="385" y="285">6 yrs</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="490" y="285">8 yrs</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="595" y="285">10 yrs</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="700" y="285">12 yrs</text>
                    <text fill="#737686" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="805" y="285">15 yrs</text>

                    {/* Outdated 7-year dashed linear reference */}
                    <line stroke="#c3c6d7" strokeDasharray="6 6" strokeWidth="2" x1="70" x2="805" y1="260" y2="29" />

                    {/* Filled area polygon under curve */}
                    <polygon fill="url(#curveGradient)" id="curve-area" points={activeCurve.area} />

                    {/* Active curve polyline */}
                    <polyline
                      fill="none"
                      id="curve-polyline"
                      points={activeCurve.points}
                      stroke="#2563eb"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    />

                    {/* Key anchor points */}
                    <circle cx="122" cy="227" fill="#2563eb" id="pt-year1" r="5" className="transition-all" />
                    <circle cx="175" cy="207" fill="#2563eb" id="pt-year2" r="5" className="transition-all" />
                    <circle cx={activeCurve.seniorX} cy={activeCurve.seniorY} fill="#bc4800" id="pt-year7" r="5" className="transition-all" />
                    <circle cx="805" cy={activeCurve.endY} fill="#2563eb" id="pt-end" r="5" className="transition-all" />

                    {/* Callout texts */}
                    <text fill="#004ac6" fontFamily="Inter" fontSize="11" fontWeight="600" id="txt-juvenile" x="148" y="222">
                      Puppyhood Fast Growth (Year 1–2)
                    </text>
                    <text fill="#bc4800" fontFamily="Inter" fontSize="11" fontWeight="600" id="txt-senior" x={activeCurve.seniorX + 8} y={activeCurve.seniorY - 4}>
                      Senior Years
                    </text>
                  </svg>
                </div>
              </div>

              {/* 2 Comparison Informational Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined">network_check</span>
                    <span className="font-headline-md text-headline-md text-on-surface font-bold">
                      Why Smaller Dogs Tend to Live Longer
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Unlike most mammals where bigger animals live longer (like elephants vs. mice), pet dogs are the opposite. Extra-large breeds like Great Danes grow up to 100 times their birth weight in their first year alone, which puts more wear and tear on their bodies earlier in life.
                  </p>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between text-on-surface font-data-mono text-data-mono text-body-sm border border-outline-variant/10">
                    <span className="text-on-surface-variant">Small Dog Aging Pace:</span>
                    <span className="text-secondary font-bold">Steady &amp; Gentle</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between text-on-surface font-data-mono text-data-mono text-body-sm border border-outline-variant/10">
                    <span className="text-on-surface-variant">Giant Breed Aging Pace:</span>
                    <span className="text-tertiary-container font-bold">Almost 2x Faster</span>
                  </div>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-secondary">
                    <span className="material-symbols-outlined">holiday_village</span>
                    <span className="font-headline-md text-headline-md text-on-surface font-bold">
                      Indoor Cats vs. Outdoor Cats Lifespan
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Indoor domestic cats usually live safe, comfortable lives reaching <strong>14 to 18 years</strong>. Outdoor cats face traffic, bad weather, infections, and other animals, which brings their average lifespan down to <strong>3 to 7 years</strong>.
                  </p>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between text-on-surface font-data-mono text-data-mono text-body-sm border border-outline-variant/10">
                    <span className="text-on-surface-variant">Indoor Cat Senior Years Start Around:</span>
                    <span className="text-primary font-bold">Age 10–11 (~60 human years)</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between text-on-surface font-data-mono text-data-mono text-body-sm border border-outline-variant/10">
                    <span className="text-on-surface-variant">Outdoor Cat Aging Speed:</span>
                    <span className="text-tertiary font-bold">More than 2x as quick</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: Saved Household Companions Strip */}
            <section className="flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">family_restroom</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    Household Companions
                  </span>
                </div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                  Quick Multi-Pet Switcher
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
                {companions.map((comp) => {
                  const isCurrent = petName.toLowerCase() === comp.name.toLowerCase();
                  return (
                    <div
                      key={comp.id}
                      className={`p-space-md rounded-xl bg-surface-container-lowest hover:shadow-md transition-all cursor-pointer flex flex-col gap-space-2xs border-2 ${
                        isCurrent ? 'border-primary/50 shadow-sm' : 'border-outline-variant/10'
                      }`}
                      onClick={() => applyPreset(comp.species, comp.years, comp.months, comp.tier, comp.breed, comp.name)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body-md text-body-md font-bold text-on-surface">{comp.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-data-mono text-[11px] font-semibold ${
                            isCurrent
                              ? 'bg-primary-fixed text-primary'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {isCurrent ? 'Active' : comp.species === 'feline' ? 'Feline' : comp.years > 8 ? 'Senior' : 'Canine'}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {comp.breed} • {comp.years} yrs
                      </p>
                      <div className="flex items-center justify-between pt-space-xs mt-auto">
                        <span className="font-data-mono text-data-mono text-primary font-bold">
                          {Math.round(comp.years * (comp.species === 'canine' ? 8.5 : 6))} Human Yrs
                        </span>
                        <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
                          {comp.stage}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Add Pet Action Card */}
                <button
                  className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center justify-center gap-space-xs text-on-surface-variant text-center border-dashed border-2 border-outline-variant cursor-pointer"
                  onClick={() => setIsAddModalOpen(true)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-primary text-[28px]">add_circle</span>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface">Add Household Pet</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Track Multiple Bios</span>
                </button>
              </div>
            </section>

            {/* SECTION 6: 5 Veterinary Life Stages Roadmap */}
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-2xs">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">timeline</span>
                  Pet Milestones
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  The 5 Stages of Your Pet’s Life
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Your pet&apos;s health and wellness needs change at each stage of life. Here is what to focus on according to top veterinary recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-space-md">
                {/* Stage 01 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative border border-outline-variant/15">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold font-data-mono text-body-sm">
                    01
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Puppy / Kitten</h3>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">0 to 6 Months</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Rapid growth, playful exploration, and building strong bones and immune defenses.
                  </p>
                  <div className="mt-auto pt-space-xs flex flex-col gap-1 text-[12px] font-body-sm text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Puppy/Kitten Vaccines
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Microchip ID
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Flea &amp; Tick Prevention
                    </div>
                  </div>
                </div>

                {/* Stage 02 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative border border-outline-variant/15">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold font-data-mono text-body-sm">
                    02
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Young Explorer</h3>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">6 Mos to 2 Years</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Reaching full adult size, high energy levels, and developing lifelong habits.
                  </p>
                  <div className="mt-auto pt-space-xs flex flex-col gap-1 text-[12px] font-body-sm text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Spay or Neuter
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> First Annual Dental Exam
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Healthy Weight Baseline
                    </div>
                  </div>
                </div>

                {/* Stage 03 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative border border-outline-variant/15">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold font-data-mono text-body-sm">
                    03
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Healthy Adult</h3>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">3 to 6 Years</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Prime vitality years. Great time to maintain good dental health and daily active exercise.
                  </p>
                  <div className="mt-auto pt-space-xs flex flex-col gap-1 text-[12px] font-body-sm text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Yearly Teeth Cleaning
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Routine Blood Checkup
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Weight Management
                    </div>
                  </div>
                </div>

                {/* Stage 04 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative border border-outline-variant/15">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold font-data-mono text-body-sm">
                    04
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Senior Friend</h3>
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">7 to 10 Years</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Gradual slowing down. Beneficial to check joints, kidneys, and provide extra comfort.
                  </p>
                  <div className="mt-auto pt-space-xs flex flex-col gap-1 text-[12px] font-body-sm text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span> Vet Visits Every 6 Months
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span> Joint &amp; Mobility Care
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span> Kidney &amp; Heart Health Check
                    </div>
                  </div>
                </div>

                {/* Stage 05 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm relative border border-outline-variant/15">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold font-data-mono text-body-sm">
                    05
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Golden Senior</h3>
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">11+ Years</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Cherished companion years. Focus on gentle comfort, warmth, and high quality of life.
                  </p>
                  <div className="mt-auto pt-space-xs flex flex-col gap-1 text-[12px] font-body-sm text-on-surface">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span> Gentle Pain Management
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span> Cozy Beds &amp; Ramps
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">check_circle</span> Daily Comfort Care
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7: Evidence-Based Veterinary Science Deep-Dive */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/10">
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  Lifespan Science
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  How Vet Science Explains Pet Aging
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Recent university research studying dogs and cats proved that biological aging is curved rather than a straight line. Pets mature very quickly during their first year and then age steadily as adults.
                </p>
                <div className="p-space-md rounded-lg bg-surface-container-lowest font-data-mono text-data-mono text-primary text-[13px] leading-relaxed shadow-sm border border-outline-variant/10">
                  1 Year Dog ≈ 15 Human Years • 2 Years Dog ≈ 24 Human Years
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  This means an 8-week-old puppy is like a 9-month-old baby, and a 1-year-old dog has reached teenage/young adult biology. SolveIt uses these modern vet standards for accurate calculations.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="p-space-md rounded-xl bg-surface-container-lowest flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined text-[20px]">pets</span>
                    <span className="font-body-md text-body-md font-bold text-on-surface">Why Size Matters</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Larger dogs put more strain on their hearts and joints over time, which means giant breeds reach their golden years sooner than little dogs.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-secondary">
                    <span className="material-symbols-outlined text-[20px]">healing</span>
                    <span className="font-body-md text-body-md font-bold text-on-surface">Spay &amp; Neuter Benefits</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Veterinary records show that spayed and neutered pets live 15% to 25% longer on average by lowering the risk of common infections and cancers.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">monitor_weight</span>
                    <span className="font-body-md text-body-md font-bold text-on-surface">Healthy Body Weight</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Long-term studies prove pets kept at a healthy, lean weight live an average of nearly 2 years longer than overweight pets.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined text-[20px]">vital_signs</span>
                    <span className="font-body-md text-body-md font-bold text-on-surface">Kidney &amp; Organ Checks</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Modern routine blood panels can detect changes in kidney and liver health years earlier, giving veterinarians time to keep pets comfortable.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 8: Breed Size vs Human Equivalent Actuarial Lookup Table */}
            <section className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-2xs">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">table_chart</span>
                  Pet Years to Human Years Chart
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Pet Age Comparison Chart (Pet Years to Human Years)
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Cross-tabulated human equivalent years across domestic species and canine weight classifications based on AAHA consensus data.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-md border border-outline-variant/15">
                <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                  <thead>
                    <tr className="bg-surface-container-high text-on-surface border-b border-surface-container-highest">
                      <th className="p-space-md font-semibold">Calendar Age</th>
                      <th className="p-space-md font-semibold">Small Dog (&lt;20 lbs)</th>
                      <th className="p-space-md font-semibold">Medium Dog (21-50 lbs)</th>
                      <th className="p-space-md font-semibold">Large Dog (51-90 lbs)</th>
                      <th className="p-space-md font-semibold text-tertiary">Giant Dog (&gt;90 lbs)</th>
                      <th className="p-space-md font-semibold text-secondary">Indoor Cat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container font-data-mono text-data-mono">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">6 Months</td>
                      <td className="p-space-md text-on-surface-variant">10 yrs</td>
                      <td className="p-space-md text-on-surface-variant">10 yrs</td>
                      <td className="p-space-md text-on-surface-variant">9 yrs</td>
                      <td className="p-space-md text-tertiary font-medium">8 yrs</td>
                      <td className="p-space-md text-secondary font-medium">10 yrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">1 Year</td>
                      <td className="p-space-md text-on-surface-variant">15 yrs</td>
                      <td className="p-space-md text-on-surface-variant">15 yrs</td>
                      <td className="p-space-md text-on-surface-variant">15 yrs</td>
                      <td className="p-space-md text-tertiary font-medium">12 yrs</td>
                      <td className="p-space-md text-secondary font-medium">15 yrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">2 Years</td>
                      <td className="p-space-md text-on-surface-variant">24 yrs</td>
                      <td className="p-space-md text-on-surface-variant">24 yrs</td>
                      <td className="p-space-md text-on-surface-variant">24 yrs</td>
                      <td className="p-space-md text-tertiary font-medium">22 yrs</td>
                      <td className="p-space-md text-secondary font-medium">24 yrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">4 Years</td>
                      <td className="p-space-md text-on-surface-variant">32 yrs</td>
                      <td className="p-space-md text-on-surface-variant">34 yrs</td>
                      <td className="p-space-md text-primary font-bold">35 yrs</td>
                      <td className="p-space-md text-tertiary font-bold">38 yrs</td>
                      <td className="p-space-md text-secondary font-medium">32 yrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">7 Years (Senior)</td>
                      <td className="p-space-md text-on-surface-variant">44 yrs</td>
                      <td className="p-space-md text-on-surface-variant">47 yrs</td>
                      <td className="p-space-md text-primary font-bold">50 yrs</td>
                      <td className="p-space-md text-tertiary font-bold">56 yrs</td>
                      <td className="p-space-md text-secondary font-medium">44 yrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">10 Years</td>
                      <td className="p-space-md text-on-surface-variant">56 yrs</td>
                      <td className="p-space-md text-on-surface-variant">60 yrs</td>
                      <td className="p-space-md text-primary font-bold">66 yrs</td>
                      <td className="p-space-md text-tertiary font-bold">78 yrs (Geriatric)</td>
                      <td className="p-space-md text-secondary font-medium">56 yrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-space-md font-bold text-on-surface">14 Years</td>
                      <td className="p-space-md text-on-surface-variant">72 yrs</td>
                      <td className="p-space-md text-on-surface-variant">78 yrs</td>
                      <td className="p-space-md text-primary font-bold">88 yrs</td>
                      <td className="p-space-md text-tertiary font-bold">102+ yrs</td>
                      <td className="p-space-md text-secondary font-bold">72 yrs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 9: Life-Stage Care & Wellness Recommendations */}
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-2xs">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">medical_services</span>
                  Veterinary Care Protocol
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Healthy Care Tips for Every Age
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Match your companion’s biological stage with calibrated clinical practices recommended by American Animal Hospital Association certified practitioners.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Item 1 */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">restaurant</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Targeted Nutrition</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Transition to low-phosphorus, high-quality digestible protein with Omega-3 fatty acids (EPA/DHA) to safeguard renal filtration and modulate joint cartilage degradation.
                  </p>
                  <span className="mt-auto font-data-mono text-data-mono text-[11px] text-primary font-semibold">AAFCO Senior Ratios</span>
                </div>

                {/* Item 2 */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">directions_run</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Exercise &amp; Mobility</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Shift high-impact ball fetching to low-impact concentric muscle conditioning, hydrotherapy, and mental scent games to preserve muscle mass without shearing cartilage.
                  </p>
                  <span className="mt-auto font-data-mono text-data-mono text-[11px] text-secondary font-semibold">Controlled Low-Impact</span>
                </div>

                {/* Item 3 */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">biotech</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Diagnostic Cadence</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Move to bi-annual wellness exams after age 7 for dogs (age 10 for cats). Essential testing includes urinalysis, complete blood count (CBC), SDMA, and blood pressure Doppler.
                  </p>
                  <span className="mt-auto font-data-mono text-data-mono text-[11px] text-tertiary font-semibold">Every 6 Months in Seniors</span>
                </div>

                {/* Item 4 */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-lg bg-inverse-surface text-inverse-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Wellness Insurance</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Enroll pet insurance policies prior to the onset of pre-existing exclusions. Senior therapeutic protocols (e.g., monoclonal antibodies for arthritis) can exceed $1,800/yr.
                  </p>
                  <span className="mt-auto font-data-mono text-data-mono text-[11px] text-on-surface font-semibold">Pre-Existing Risk Shield</span>
                </div>
              </div>
            </section>

            {/* SECTION 10: Traditional 7-Year Rule vs SolveIt Comparison Matrix */}
            <section className="flex flex-col gap-space-md p-space-xl rounded-xl bg-surface-container-lowest shadow-md border border-outline-variant/15">
              <div className="flex flex-col gap-space-2xs">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">balance</span>
                  Scientific Superiority
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Why Our Pet Age Calculator Is More Accurate
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Why the folklore “1 Dog Year = 7 Human Years” fails clinically and how SolveIt calculates authentic physiology.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg pt-space-xs">
                {/* Outdated */}
                <div className="p-space-lg rounded-xl bg-error-container/20 flex flex-col gap-space-sm border border-error/20">
                  <div className="flex items-center gap-space-xs text-error">
                    <span className="material-symbols-outlined">cancel</span>
                    <span className="font-headline-md text-headline-md font-bold">Traditional 7-Year Myth</span>
                  </div>
                  <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">close</span>
                      <span><strong>Linear Fallacy:</strong> Assumes a 1-year-old dog has the biology of a 7-year-old child, ignoring that 1-year-old canines can reproduce.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">close</span>
                      <span><strong>Ignores Breed Sizes:</strong> Applies the exact same arithmetic to a 5-lb Chihuahua and a 160-lb Mastiff.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">close</span>
                      <span><strong>Feline Inaccuracy:</strong> Treats domestic cats identically to canines despite distinct metabolic rates and cellular structures.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-error text-[18px] mt-0.5 shrink-0">close</span>
                      <span><strong>Misses Senior Windows:</strong> Delays critical senior organ blood screens by falsely estimating giant breed aging.</span>
                    </li>
                  </ul>
                </div>

                {/* SolveIt */}
                <div className="p-space-lg rounded-xl bg-primary-fixed/20 flex flex-col gap-space-sm border border-primary/20">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-headline-md text-headline-md font-bold">SolveIt Precision Engine</span>
                  </div>
                  <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">done</span>
                      <span><strong>Epigenetic Accuracy:</strong> Reflects rapid maturation in Year 1 (~15 human years) and Year 2 (+9 human years).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">done</span>
                      <span><strong>Mass-Calibrated Slopes:</strong> Varies subsequent progression from +4.0 human yrs/yr (toy) to +8.0 human yrs/yr (giant).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">done</span>
                      <span><strong>Habitat Stratification:</strong> Directly computes free-roaming pathogen and trauma degradation for outdoor felines.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">done</span>
                      <span><strong>Clinical Action Triggers:</strong> Flags the exact veterinary threshold when blood pressure and SDMA checks are required.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 11: Frequently Asked Questions (Accordion) */}
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-2xs text-center items-center">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">help</span>
                  Clinical Clarifications
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Evidence-based veterinary answers regarding pet aging, biological clocks, and preventative medical interventions.
                </p>
              </div>

              <div className="flex flex-col gap-space-xs max-w-3xl mx-auto w-full">
                {[
                  {
                    id: 'faq-1',
                    q: 'Why do giant dog breeds age so much faster than toy breeds?',
                    a: 'Giant breeds grow at extraordinary rates during their first year of life—often multiplying their birth weight by 60 to 100 times. This explosive cellular proliferation creates high oxidative stress, elevated free radicals, accelerated telomere attrition, and abnormally high concentrations of IGF-1. As a result, giant breeds experience cellular breakdown and age-related chronic diseases (such as osteosarcoma and dilated cardiomyopathy) significantly earlier.',
                  },
                  {
                    id: 'faq-2',
                    q: 'At what exact calendar age does a dog or cat become a “senior”?',
                    a: 'Veterinary medicine defines senior onset as entering the final 25% of the species or breed’s expected lifespan. For a Great Dane, senior status starts around age 5 to 6. For a medium dog (e.g., Beagle), it begins around age 7 to 8. For small dogs and indoor cats, senior status is typically reached between ages 10 and 11.',
                  },
                  {
                    id: 'faq-3',
                    q: 'Does spaying or neutering genuinely alter biological lifespan?',
                    a: 'Yes. Actuarial veterinary studies across over 40,000 domestic dogs indicate that sterilized female dogs live an average of 26.3% longer and sterilized males live 13.8% longer. Spaying eliminates life-threatening uterine infections (pyometra) and mammary tumors, while neutering drastically curtails roam-seeking trauma and testicular neoplasia.',
                  },
                  {
                    id: 'faq-4',
                    q: 'Why do indoor cats live dramatically longer than outdoor cats?',
                    a: 'Free-roaming outdoor cats are continually exposed to high-velocity hazards: motor vehicle trauma, predator attacks (coyotes, dogs), ingestion of commercial rodenticides, and infectious diseases such as Feline Leukemia Virus (FeLV) and Feline Immunodeficiency Virus (FIV). These hazards compress outdoor cat median life expectancies down to 3–7 years, whereas indoor cats routinely achieve 15–19 years.',
                  },
                  {
                    id: 'faq-5',
                    q: 'Can I decelerate my pet’s biological aging curve?',
                    a: 'While genetics establish the baseline, environmental factors hold massive sway. The single most proven intervention is keeping your pet lean (BCS 4–5), which extends life by up to 1.8 years. Other high-impact interventions include annual professional dental cleanings (preventing chronic systemic bacteremia from infecting cardiac valves and renal tissue) and routine screening blood panels.',
                  },
                  {
                    id: 'faq-6',
                    q: 'How does the UC San Diego epigenetic formula differ from the traditional 7-year rule?',
                    a: 'The UC San Diego formula (Human Age = 16 * ln(Dog Age) + 31) is based on DNA methylation patterns shared between humans and canines. It reveals that canine cells age with tremendous velocity in early development—a 1-year-old dog has cellular epigenetic marks comparable to a 31-year-old human—after which the aging trajectory flattens significantly, rendering the folklore 1:7 linear rule biologically inaccurate.',
                  },
                  {
                    id: 'faq-7',
                    q: 'How do rabbit, pocket pet, and avian aging rates compare to cats and dogs?',
                    a: 'Small mammals possess accelerated metabolic rates: domestic rabbits reach full physical maturity by 6–9 months and reach senior lagomorph status around age 6 to 8 (lifespan ~8–12 years). Pocket pets such as Syrian hamsters age with rapid acceleration (~26 human years per calendar year, lifespan 2–4 years). Conversely, psittacine birds (cockatiels, conures, parrots) possess specialized antioxidant defense mechanisms and live 15 to 60+ years, pacing their human-equivalent age much more gradually.',
                  },
                ].map((item) => {
                  const isOpen = openFaqs[item.id];
                  return (
                    <div key={item.id} className="rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/10">
                      <button
                        className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container transition-colors cursor-pointer"
                        onClick={() => toggleFaq(item.id)}
                        type="button"
                      >
                        <span className="font-body-md text-body-md font-semibold text-on-surface pr-4">{item.q}</span>
                        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-space-md pb-space-md text-on-surface-variant font-body-sm text-body-sm leading-relaxed border-t border-outline-variant/10 pt-space-xs">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 12: Trusted Scientific Sources & Clinical References */}
            <section className="flex flex-col gap-space-lg" id="scientific-references">
              <div className="flex flex-col gap-space-2xs text-center items-center">
                <div className="inline-flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Peer-Reviewed Evidence Base
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Trusted Content Sources &amp; Clinical References
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Our calculations, epigenetic trajectories, and life-stage thresholds are grounded in published peer-reviewed veterinary literature, comparative genomics, and accredited clinical standards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Source 1: UCSD Cell Systems */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-container/30 text-on-primary-container font-label-caps uppercase">
                      Epigenetic Clock
                    </span>
                    <span className="text-[11px] font-data-mono text-outline font-medium">Cell Systems (2020)</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      Quantitative Translation of Dog-to-Human Epigenetic Aging by Chromatin Methylation
                    </h3>
                    <span className="text-[12px] text-on-surface-variant">
                      Tina Wang, Trey Ideker, et al. • UC San Diego School of Medicine
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                    Demonstrated conserved epigenome remodeling across dog and human lifespans. Formulated the non-linear human equivalent age algorithm: <code className="font-data-mono bg-surface-container px-1 py-0.5 rounded text-[11px] text-primary">16 × ln(age) + 31</code>.
                  </p>
                  <div className="mt-auto pt-space-xs border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[11px] font-data-mono text-outline">DOI: 10.1016/j.cels.2020.06.006</span>
                    <a
                      href="https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline"
                      aria-label="View UC San Diego Cell Systems Epigenetic Study (opens in new tab)"
                    >
                      <span>Read Study</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Source 2: AAHA Guidelines */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container/30 text-on-secondary-container font-label-caps uppercase">
                      Clinical Standards
                    </span>
                    <span className="text-[11px] font-data-mono text-outline font-medium">AAHA Standards</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      AAHA Canine Life Stage Guidelines &amp; Senior Healthcare Protocols
                    </h3>
                    <span className="text-[12px] text-on-surface-variant">
                      American Animal Hospital Association Task Force
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                    Defines standardized evidence-based companion life stages (Pediatric, Young Adult, Mature Adult, Senior, Geriatric) and establishes bi-annual geriatric diagnostic screening cadences.
                  </p>
                  <div className="mt-auto pt-space-xs border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[11px] font-data-mono text-outline">AAHA Clinical Press</span>
                    <a
                      href="https://www.aaha.org/resources/life-stage-guidelines/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline"
                      aria-label="View AAHA Canine Life Stage Guidelines (opens in new tab)"
                    >
                      <span>View Guidelines</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Source 3: AVMA */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-tertiary-container/30 text-on-tertiary-container font-label-caps uppercase">
                      Veterinary Medicine
                    </span>
                    <span className="text-[11px] font-data-mono text-outline font-medium">AVMA Clinical FAQ</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      Senior Pet Care &amp; Longevity Demographic Standards
                    </h3>
                    <span className="text-[12px] text-on-surface-variant">
                      American Veterinary Medical Association (AVMA)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                    Provides actuarial weight-tiered lifespan averages for small, medium, large, and giant breeds, establishing early clinical intervention points for osteoarthritis and metabolic shifts.
                  </p>
                  <div className="mt-auto pt-space-xs border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[11px] font-data-mono text-outline">AVMA Pet Care Council</span>
                    <a
                      href="https://www.avma.org/resources-tools/pet-owners/petcare/senior-pets-faq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline"
                      aria-label="View AVMA Senior Pet Care FAQ and Guidelines (opens in new tab)"
                    >
                      <span>View Protocol</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Source 4: Cornell Feline Health Center */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-container-high text-on-surface font-label-caps uppercase">
                      Feline Medicine
                    </span>
                    <span className="text-[11px] font-data-mono text-outline font-medium">Cornell University</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      Cornell Feline Health Center: Senior Cat Life Stages &amp; Geriatric Care
                    </h3>
                    <span className="text-[12px] text-on-surface-variant">
                      Cornell University College of Veterinary Medicine
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                    Establishes feline life-stage aging scales, indoor versus free-roaming outdoor lifespan hazard ratios, and protocols for identifying early-stage chronic kidney disease (CKD) and feline hypertension.
                  </p>
                  <div className="mt-auto pt-space-xs border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[11px] font-data-mono text-outline">Cornell CVM FHC</span>
                    <a
                      href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline"
                      aria-label="View Cornell Feline Health Center Resources (opens in new tab)"
                    >
                      <span>Visit Center</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Source 5: Dog Aging Project */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-container/30 text-on-primary-container font-label-caps uppercase">
                      Cohort Study
                    </span>
                    <span className="text-[11px] font-data-mono text-outline font-medium">40,000+ Dogs Cohort</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      The Dog Aging Project: Longitudinal Determinants of Healthy Lifespan
                    </h3>
                    <span className="text-[12px] text-on-surface-variant">
                      University of Washington &amp; Texas A&amp;M University
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                    The world’s largest canine longitudinal aging study, supported by the National Institute on Aging (NIA), exploring environmental, genetic, microbiological, and lifestyle determinants of longevity.
                  </p>
                  <div className="mt-auto pt-space-xs border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[11px] font-data-mono text-outline">NIA / NIH Research</span>
                    <a
                      href="https://dogagingproject.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline"
                      aria-label="View Dog Aging Project Initiative (opens in new tab)"
                    >
                      <span>Explore Project</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Source 6: JAVMA Purina Lifespan / APOP */}
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/15 hover:border-primary/40 transition-all shadow-sm group">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container/30 text-on-secondary-container font-label-caps uppercase">
                      BCS &amp; Longevity
                    </span>
                    <span className="text-[11px] font-data-mono text-outline font-medium">JAVMA 14-Yr Study</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      Effects of Diet Restriction on Life Span in Canines &amp; Body Condition Scoring
                    </h3>
                    <span className="text-[12px] text-on-surface-variant">
                      Kealy, R. D. et al., JAVMA • Association for Pet Obesity Prevention
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                    Groundbreaking 14-year longitudinal trial proving that maintaining an ideal Body Condition Score (BCS 4–5) extends median canine life by 1.8 years (15%) and significantly delays chronic pathology onset.
                  </p>
                  <div className="mt-auto pt-space-xs border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[11px] font-data-mono text-outline">JAVMA 220(9):1315-20</span>
                    <a
                      href="https://petobesityprevention.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-[12px] font-semibold hover:underline"
                      aria-label="View Association for Pet Obesity Prevention Research (opens in new tab)"
                    >
                      <span>View Research</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 13: Veterinary Educational Disclaimer */}
            <section className="p-space-lg rounded-xl bg-surface-container-high/40 flex items-start gap-space-md border border-outline-variant/15">
              <span className="material-symbols-outlined text-primary text-[28px] shrink-0 mt-0.5">info</span>
              <div className="flex flex-col gap-1">
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Clinical &amp; Educational Advisory
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  The SolveIt Pet Age Converter synthesizes peer-reviewed canine epigenetic methylation studies and American Animal Hospital Association (AAHA) guidelines for mathematical modeling and educational reference. Individual companion lifespans are influenced by genetics, nutrition, micro-environment, and medical history. This computational tool does not constitute formal veterinary medical diagnosis. Always consult a licensed Doctor of Veterinary Medicine (DVM) for individualized companion wellness protocols.
                </p>
              </div>
            </section>

            {/* SECTION 14: Related Calculators Directory */}
            <section className="flex flex-col gap-space-md pb-space-xl">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">Related Precision Instruments</span>
                <Link className="font-body-sm text-body-sm text-primary font-medium hover:underline flex items-center gap-1" href="/time-date">
                  <span>Explore Time &amp; Date Directory</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-2xs group shadow-sm border border-outline-variant/10" href="/time-date/age-calculator">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </div>
                  <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Chronological Age Calculator
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Compute exact human calendar age down to seconds, leap day milestones, and solar orbits.
                  </p>
                </Link>

                <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-2xs group shadow-sm border border-outline-variant/10" href="/time-date/days-between-dates">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">event_repeat</span>
                  </div>
                  <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                    Date Difference Engine
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Calculate calendar day spreads, banking business days, and international holidays.
                  </p>
                </Link>

                <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-2xs group shadow-sm border border-outline-variant/10" href="/health">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-tertiary flex items-center justify-center group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">monitor_weight</span>
                  </div>
                  <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-tertiary transition-colors">
                    Canine Calorie (RER) Tool
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Determine Resting Energy Requirements and daily caloric rations based on BCS scores.
                  </p>
                </Link>

                <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-2xs group shadow-sm border border-outline-variant/10" href="/time-date/world-clock-grid">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary-container flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Time Zone Converter
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Synchronize cross-meridian timestamps with UTC offset calculations and daylight offsets.
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
