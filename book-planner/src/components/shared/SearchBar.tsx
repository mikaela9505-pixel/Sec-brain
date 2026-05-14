import React, { useState, useRef, useEffect } from 'react';
import { Search, X, User, Film, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';

interface SearchResult {
  type: 'character' | 'scene' | 'chapter';
  id: string;
  title: string;
  subtitle?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const characters = useStore(s => s.characters);
  const scenes = useStore(s => s.scenes);
  const chapters = useStore(s => s.chapters);
  const setActiveView = useStore(s => s.setActiveView);

  const results: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const charResults: SearchResult[] = characters
      .filter(c => c.name.toLowerCase().includes(q) || c.tags.some(t => t.includes(q)))
      .slice(0, 3)
      .map(c => ({ type: 'character', id: c.id, title: c.name, subtitle: c.role }));

    const sceneResults: SearchResult[] = scenes
      .filter(s => s.title.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q))
      .slice(0, 3)
      .map(s => ({ type: 'scene', id: s.id, title: s.title, subtitle: s.summary.slice(0, 60) + '...' }));

    const chapterResults: SearchResult[] = chapters
      .filter(c => c.title.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: 'chapter', id: c.id, title: c.title, subtitle: c.summary.slice(0, 60) + '...' }));

    return [...charResults, ...sceneResults, ...chapterResults];
  }, [query, characters, scenes, chapters]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'character') setActiveView('characters');
    if (result.type === 'scene') setActiveView('plot');
    if (result.type === 'chapter') setActiveView('chapters');
    setQuery('');
    setIsOpen(false);
  };

  const icons = {
    character: <User size={14} className="text-gold" />,
    scene: <Film size={14} className="text-sage" />,
    chapter: <BookOpen size={14} className="text-ink-muted" />,
  };

  const labels = {
    character: 'Karaktär',
    scene: 'Scen',
    chapter: 'Kapitel',
  };

  return (
    <div ref={containerRef} className="relative w-64">
      <div className="flex items-center gap-2 px-3 py-2 bg-cream border border-sand rounded-lg">
        <Search size={15} className="text-ink-muted flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Sök i projektet..."
          className="flex-1 text-sm bg-transparent outline-none text-ink placeholder-ink-muted"
        />
        {query && (
          <button onClick={() => { setQuery(''); setIsOpen(false); }} className="text-ink-muted hover:text-ink">
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 bg-paper border border-sand rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {results.map((result, i) => (
              <button
                key={i}
                onClick={() => handleSelect(result)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-cream text-left transition-colors border-b border-sand last:border-0"
              >
                <div className="mt-0.5">{icons[result.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-muted">{labels[result.type]}</span>
                  </div>
                  <p className="text-sm font-medium text-ink truncate">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-xs text-ink-muted truncate">{result.subtitle}</p>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {isOpen && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 left-0 right-0 bg-paper border border-sand rounded-xl shadow-xl z-50 p-4 text-center"
          >
            <p className="text-sm text-ink-muted">Inga resultat för "{query}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
