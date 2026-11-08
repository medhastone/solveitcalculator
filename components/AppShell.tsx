'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageProvider } from '@/lib/i18n';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#152238]">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
