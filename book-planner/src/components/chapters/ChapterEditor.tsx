import { useState, useEffect } from 'react';
import type { Chapter } from '../../types';
import { useStore } from '../../store';
import { WordCounter } from './WordCounter';
import { TagInput } from '../shared/TagBadge';
import { Button } from '../shared/Button';
import { Camera, Maximize2, Minimize2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChapterEditorProps {
  chapter: Chapter;
  onClose: () => void;
}

const statusOptions = [
  { value: 'idea', label: 'Idé' },
  { value: 'planned', label: 'Planerat' },
  { value: 'draft', label: 'Utkast' },
  { value: 'revised', label: 'Reviderat' },
  { value: 'done', label: 'Klart' },
];

export function ChapterEditor({ chapter, onClose }: ChapterEditorProps) {
  const updateChapter = useStore(s => s.updateChapter);
  const characters = useStore(s => s.characters);
  const snapshots = useStore(s => s.snapshots);
  const addSnapshot = useStore(s => s.addSnapshot);
  const deleteSnapshot = useStore(s => s.deleteSnapshot);

  const [content, setContent] = useState(chapter.content);
  const [notes, setNotes] = useState(chapter.notes);
  const [status, setStatus] = useState(chapter.status);
  const [tags, setTags] = useState(chapter.tags);
  const [title, setTitle] = useState(chapter.title);
  const [summary, setSummary] = useState(chapter.summary);
  const [focusMode, setFocusMode] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [showSnapshots, setShowSnapshots] = useState(false);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      updateChapter(chapter.id, { content, notes, status, tags, title, summary });
    }, 800);
    return () => clearTimeout(timer);
  }, [content, notes, status, tags, title, summary]);

  const chapterSnapshots = snapshots.filter(s => s.entityId === chapter.id && s.entityType === 'chapter');

  const handleSnapshot = () => {
    const label = snapshotLabel || `Snapshot ${new Date().toLocaleString('sv-SE')}`;
    addSnapshot({ entityId: chapter.id, entityType: 'chapter', data: JSON.stringify({ content, notes }), label });
    setSnapshotLabel('');
  };

  const handleRestore = (data: string) => {
    const parsed = JSON.parse(data);
    setContent(parsed.content ?? content);
    setNotes(parsed.notes ?? notes);
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1';

  if (focusMode) {
    return (
      <div className="fixed inset-0 bg-paper z-50 flex flex-col">
        <div className="flex items-center justify-between px-8 py-3 border-b border-sand">
          <h2 className="font-heading text-xl text-ink">{title}</h2>
          <div className="flex items-center gap-3">
            <WordCounter text={content} goal={chapter.wordCountGoal} />
            <button onClick={() => setFocusMode(false)} className="p-1.5 text-ink-muted hover:text-ink rounded">
              <Minimize2 size={16} />
            </button>
          </div>
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 p-12 text-base leading-8 text-ink resize-none outline-none font-body max-w-3xl mx-auto w-full"
          placeholder="Börja skriva..."
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0 p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="font-heading text-2xl text-ink bg-transparent outline-none border-b border-transparent focus:border-sand flex-1 mr-4"
          />
          <div className="flex items-center gap-2">
            <WordCounter text={content} goal={chapter.wordCountGoal} />
            <button onClick={() => setFocusMode(true)} className="p-1.5 text-ink-muted hover:text-ink rounded hover:bg-cream transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Kort sammanfattning av kapitlet..."
            rows={2}
            className="w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink-muted bg-paper focus:outline-none focus:border-gold resize-none"
          />
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Börja skriva kapitlets innehåll..."
          className="flex-1 px-4 py-3 border border-sand rounded-xl text-sm leading-7 text-ink bg-paper focus:outline-none focus:border-gold resize-none font-body"
        />
      </div>

      {/* Side Panel */}
      <div className="w-64 flex-shrink-0 border-l border-sand p-4 overflow-y-auto space-y-5">
        <div>
          <label className={labelClass}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as typeof status)} className={fieldClass}>
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Anteckningar</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={5}
            placeholder="Anteckningar om kapitlet..."
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Taggar</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <div>
          <label className={labelClass}>Karaktärer i kapitlet</label>
          <div className="space-y-1">
            {characters.slice(0, 5).map(c => (
              <div key={c.id} className="text-sm text-ink">{c.name}</div>
            ))}
          </div>
        </div>

        {/* Snapshots */}
        <div>
          <button
            onClick={() => setShowSnapshots(!showSnapshots)}
            className="flex items-center gap-1 text-xs font-medium text-ink-muted uppercase tracking-wide mb-2 hover:text-ink"
          >
            {showSnapshots ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Snapshots ({chapterSnapshots.length})
          </button>

          <div className="flex gap-1 mb-2">
            <input
              value={snapshotLabel}
              onChange={e => setSnapshotLabel(e.target.value)}
              placeholder="Snapshot-namn..."
              className="flex-1 px-2 py-1.5 border border-sand rounded text-xs focus:outline-none focus:border-gold"
            />
            <button onClick={handleSnapshot} className="p-1.5 bg-gold text-paper rounded text-xs">
              <Camera size={13} />
            </button>
          </div>

          <AnimatePresence>
            {showSnapshots && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5">
                  {chapterSnapshots.map(snap => (
                    <div key={snap.id} className="flex items-center gap-1 p-2 bg-cream rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{snap.label}</p>
                        <p className="text-xs text-ink-muted">{new Date(snap.createdAt).toLocaleString('sv-SE')}</p>
                      </div>
                      <button onClick={() => handleRestore(snap.data)} className="text-xs text-gold hover:underline">Återställ</button>
                      <button onClick={() => deleteSnapshot(snap.id)} className="text-xs text-red-500 hover:underline">✕</button>
                    </div>
                  ))}
                  {chapterSnapshots.length === 0 && (
                    <p className="text-xs text-ink-muted">Inga snapshots ännu</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-2 border-t border-sand">
          <Button size="sm" variant="ghost" onClick={onClose} className="w-full">Stäng redigeraren</Button>
        </div>
      </div>
    </div>
  );
}
