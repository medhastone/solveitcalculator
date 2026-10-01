'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ConversionHero from './components/ConversionHero';
import UniversalConverter from './components/UniversalConverter';
import PopularConversions from './components/PopularConversions';
import CategorySelector from './components/CategorySelector';
import SpecializedConverters from './components/SpecializedConverters';
import RecentAndFavoriteConversions, {
  RecentItem,
  FavoriteItem,
} from './components/RecentAndFavoriteConversions';
import ConversionTablesSection from './components/ConversionTablesSection';
import ConversionMathPrinciples from './components/ConversionMathPrinciples';
import EverydayWorkCases from './components/EverydayWorkCases';
import KnowledgeCenterSection from './components/KnowledgeCenterSection';
import MethodologyAndDifferences from './components/MethodologyAndDifferences';
import ConversionsFaqSection from './components/ConversionsFaqSection';
import SpecificConversionDirectory from './components/SpecificConversionDirectory';

export default function ConversionsClient() {
  // State for controlling the hero universal converter
  const [activeCategoryId, setActiveCategoryId] = useState<string>('length');
  const [activeFromId, setActiveFromId] = useState<string>('cm');
  const [activeToId, setActiveToId] = useState<string>('in');
  const [activeValue, setActiveValue] = useState<number | string>(10);

  // Local storage recent conversions and favorites
  const [recentList, setRecentList] = useState<RecentItem[]>([]);
  const [favoritesList, setFavoritesList] = useState<FavoriteItem[]>([]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedRecents = localStorage.getItem('solveit_conversion_recents');
      if (storedRecents) {
        setRecentList(JSON.parse(storedRecents));
      }
      const storedFavs = localStorage.getItem('solveit_conversion_favorites');
      if (storedFavs) {
        setFavoritesList(JSON.parse(storedFavs));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save recents to localStorage
  const handleRecordRecent = useCallback((record: Omit<RecentItem, 'id' | 'timestamp'>) => {
    const newItem: RecentItem = {
      ...record,
      id: `${record.fromId}-${record.toId}-${Date.now()}`,
      timestamp: Date.now(),
    };

    setRecentList((prev) => {
      // Remove duplicate if same from/to
      const filtered = prev.filter(
        (r) => !(r.fromId === record.fromId && r.toId === record.toId)
      );
      const updated = [newItem, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('solveit_conversion_recents', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((pair: FavoriteItem) => {
    setFavoritesList((prev) => {
      const exists = prev.some(
        (f) => f.fromId === pair.fromId && f.toId === pair.toId
      );
      let updated: FavoriteItem[];
      if (exists) {
        updated = prev.filter(
          (f) => !(f.fromId === pair.fromId && f.toId === pair.toId)
        );
      } else {
        updated = [pair, ...prev].slice(0, 15);
      }
      try {
        localStorage.setItem('solveit_conversion_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Clear recents
  const handleClearRecent = () => {
    setRecentList([]);
    try {
      localStorage.removeItem('solveit_conversion_recents');
    } catch {}
  };

  // Clear favorites
  const handleClearFavorites = () => {
    setFavoritesList([]);
    try {
      localStorage.removeItem('solveit_conversion_favorites');
    } catch {}
  };

  // Remove single favorite
  const handleRemoveFavorite = (fromId: string, toId: string) => {
    setFavoritesList((prev) => {
      const updated = prev.filter(
        (f) => !(f.fromId === fromId && f.toId === toId)
      );
      try {
        localStorage.setItem('solveit_conversion_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Select pair handler (used by search suggestions and popular cards)
  const handleSelectPair = useCallback(
    (categoryId: string, fromId: string, toId: string, value?: number) => {
      setActiveCategoryId(categoryId);
      setActiveFromId(fromId);
      setActiveToId(toId);
      if (value !== undefined) {
        setActiveValue(value);
      }
    },
    []
  );

  const isCurrentFavorite = favoritesList.some(
    (f) => f.fromId === activeFromId && f.toId === activeToId
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* 1. HERO WITH NATURAL UNIT SEARCH */}
        <ConversionHero onSelectPair={handleSelectPair} />

        {/* 2. UNIVERSAL CONVERTER (ABOVE THE FOLD) */}
        <UniversalConverter
          initialCategoryId={activeCategoryId}
          initialFromId={activeFromId}
          initialToId={activeToId}
          initialValue={activeValue}
          onRecordRecent={handleRecordRecent}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isCurrentFavorite}
        />

        {/* 3. POPULAR UNIT CONVERSIONS */}
        <PopularConversions onSelectPair={handleSelectPair} />

        {/* 4. RECENT & FAVORITES (Conditional) */}
        <RecentAndFavoriteConversions
          recentList={recentList}
          favoritesList={favoritesList}
          onSelectRecent={(item) =>
            handleSelectPair(
              item.categoryId,
              item.fromId,
              item.toId,
              item.inputValue
            )
          }
          onSelectFavorite={(fav) =>
            handleSelectPair(fav.categoryId, fav.fromId, fav.toId)
          }
          onClearRecent={handleClearRecent}
          onClearFavorites={handleClearFavorites}
          onRemoveFavorite={handleRemoveFavorite}
        />

        {/* 5. BROWSE ALL 20 CATEGORIES BY TIER */}
        <CategorySelector />

        {/* 6. SPECIALIZED SOLVERS (COOKING DENSITY, DATA SI/IEC, FUEL ECONOMY) */}
        <SpecializedConverters />

        {/* 7. COMMON CONVERSION TABLES */}
        <ConversionTablesSection />

        {/* 8. MATHEMATICAL PRINCIPLES (EXACT VS ROUNDED, FORMULAS, DIMENSIONAL ANALYSIS) */}
        <ConversionMathPrinciples />

        {/* 9. REAL-WORLD WORK CASES */}
        <EverydayWorkCases />

        {/* 10. KNOWLEDGE CENTER (12 IN-DEPTH GUIDES) */}
        <KnowledgeCenterSection />

        {/* 11. METHODOLOGY & WHY RESULTS MAY DIFFER */}
        <MethodologyAndDifferences />

        {/* 12. FREQUENTLY ASKED QUESTIONS */}
        <ConversionsFaqSection />

        {/* 13. DIRECT PAIR & TOOL DIRECTORY */}
        <SpecificConversionDirectory />
      </main>
    </div>
  );
}
