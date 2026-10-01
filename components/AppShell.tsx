'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import GlobalQuickActionsBar from './GlobalQuickActionsBar';
import Footer from './Footer';
import SearchModal from './SearchModal';
import GlobalHistoryDrawer from './GlobalHistoryDrawer';
import SavedToolsModal from './SavedToolsModal';
import GlobalScrollButtons from './GlobalScrollButtons';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      <div className="w-full">
        {/* Sticky Pro Header */}
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenSaved={() => setSavedOpen(true)}
        />

        {/* Global Quick Actions Bar */}
        <GlobalQuickActionsBar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenSaved={() => setSavedOpen(true)}
        />

        {/* Main Routed Page Content */}
        <main className="w-full">{children}</main>
      </div>

      {/* Pro Multi-Column Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <GlobalHistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <SavedToolsModal
        isOpen={savedOpen}
        onClose={() => setSavedOpen(false)}
      />

      {/* Global Scroll Up & Down Controls */}
      <GlobalScrollButtons />
    </div>
  );
}
