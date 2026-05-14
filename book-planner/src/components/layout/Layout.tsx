import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { SearchBar } from '../shared/SearchBar';
import { useStore } from '../../store';

const viewTitles: Record<string, string> = {
  dashboard: 'Översikt',
  characters: 'Karaktärer',
  plot: 'Handling & Scener',
  chapters: 'Kapitel',
  world: 'Världen',
  settings: 'Inställningar',
};

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const activeView = useStore(s => s.activeView);
  const title = viewTitles[activeView] ?? 'Manuskript';

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-8 py-4 bg-paper border-b border-sand flex-shrink-0">
          <h2 className="font-heading text-2xl text-ink">{title}</h2>
          <SearchBar />
        </header>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
