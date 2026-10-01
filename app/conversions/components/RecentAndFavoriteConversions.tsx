'use client';

import React from 'react';

export interface RecentItem {
  id: string;
  categoryId: string;
  categoryName: string;
  fromId: string;
  fromName: string;
  fromSymbol: string;
  toId: string;
  toName: string;
  toSymbol: string;
  inputValue: number;
  resultValue: string;
  timestamp?: number;
}

export interface FavoriteItem {
  categoryId: string;
  categoryName: string;
  fromId: string;
  toId: string;
  label: string;
}

interface RecentAndFavoriteConversionsProps {
  recentList: RecentItem[];
  favoritesList: FavoriteItem[];
  onSelectRecent: (item: RecentItem) => void;
  onSelectFavorite: (item: FavoriteItem) => void;
  onClearRecent: () => void;
  onClearFavorites: () => void;
  onRemoveFavorite: (fromId: string, toId: string) => void;
}

export default function RecentAndFavoriteConversions({
  recentList,
  favoritesList,
  onSelectRecent,
  onSelectFavorite,
  onClearRecent,
  onClearFavorites,
  onRemoveFavorite,
}: RecentAndFavoriteConversionsProps) {
  if (recentList.length === 0 && favoritesList.length === 0) {
    return null; // Do not display empty section
  }

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-outline-variant/15 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              Recently Used &amp; Favorite Conversions
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Saved in this browser for quick recall. No account or remote tracking required.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {recentList.length > 0 && (
              <button
                type="button"
                onClick={onClearRecent}
                className="px-2.5 py-1 text-xs text-on-surface-variant hover:text-red-500 rounded-lg hover:bg-surface-container transition-colors"
                title="Clear local conversion history"
              >
                Clear History
              </button>
            )}
            {favoritesList.length > 0 && (
              <button
                type="button"
                onClick={onClearFavorites}
                className="px-2.5 py-1 text-xs text-on-surface-variant hover:text-red-500 rounded-lg hover:bg-surface-container transition-colors"
                title="Clear saved favorites"
              >
                Clear Favorites
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAVORITES COLUMN */}
          {favoritesList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
                <span className="material-symbols-outlined text-base">star</span>
                <span>Favorite Pairs ({favoritesList.length})</span>
              </div>

              <div className="space-y-2">
                {favoritesList.map((fav, idx) => (
                  <div
                    key={`${fav.fromId}-${fav.toId}-${idx}`}
                    className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 flex items-center justify-between group transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectFavorite(fav)}
                      className="text-left flex-1"
                    >
                      <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                        {fav.label}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {fav.categoryName}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(fav.fromId, fav.toId)}
                      className="p-1 text-on-surface-variant hover:text-red-500 rounded"
                      title="Remove from favorites"
                      aria-label="Remove favorite"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT COLUMN */}
          {recentList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-base">history</span>
                <span>Recently Calculated ({recentList.length})</span>
              </div>

              <div className="space-y-2">
                {recentList.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 flex items-center justify-between group transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectRecent(item)}
                      className="text-left flex-1"
                    >
                      <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                        {item.inputValue} {item.fromSymbol} = {item.resultValue} {item.toSymbol}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {item.categoryName} • {item.fromName} to {item.toName}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectRecent(item)}
                      className="text-xs text-primary font-semibold px-2 py-1 rounded bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                    >
                      Recall
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
