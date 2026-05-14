import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../../store';
import type { Chapter, ChapterStatus } from '../../types';
import { ChapterCard } from './ChapterCard';
import { ChapterEditor } from './ChapterEditor';
import { Button } from '../shared/Button';
import { motion, AnimatePresence } from 'framer-motion';

function SortableChapterCard({ chapter, onClick }: { chapter: Chapter; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chapter.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <ChapterCard chapter={chapter} onClick={onClick} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

function AddChapterForm({ onClose }: { onClose: () => void }) {
  const chapters = useStore(s => s.chapters);
  const addChapter = useStore(s => s.addChapter);
  const characters = useStore(s => s.characters);
  const [form, setForm] = useState({
    title: '',
    status: 'idea' as ChapterStatus,
    summary: '',
    notes: '',
    content: '',
    wordCountGoal: '' as string | number,
    povCharacterId: '',
    sceneIds: [] as string[],
    tags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) : 0;
    addChapter({
      ...form,
      order: maxOrder + 1,
      wordCountGoal: form.wordCountGoal === '' ? undefined : Number(form.wordCountGoal),
    });
    onClose();
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold';
  const labelClass = 'block text-xs text-ink-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className={labelClass}>Titel *</label>
        <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={fieldClass} placeholder="Kapitelrubrik" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ChapterStatus }))} className={fieldClass}>
            <option value="idea">Idé</option>
            <option value="planned">Planerat</option>
            <option value="draft">Utkast</option>
            <option value="revised">Reviderat</option>
            <option value="done">Klart</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Ordmål</label>
          <input type="number" value={form.wordCountGoal} onChange={e => setForm(p => ({ ...p, wordCountGoal: e.target.value }))} className={fieldClass} placeholder="T.ex. 5000" />
        </div>
      </div>
      <div>
        <label className={labelClass}>POV-karaktär</label>
        <select value={form.povCharacterId} onChange={e => setForm(p => ({ ...p, povCharacterId: e.target.value }))} className={fieldClass}>
          <option value="">Ingen specifik POV</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelClass}>Sammanfattning</label>
        <textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={2} className={`${fieldClass} resize-none`} placeholder="Kort sammanfattning..." />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Skapa kapitel</Button>
        <Button type="button" size="sm" variant="secondary" onClick={onClose}>Avbryt</Button>
      </div>
    </form>
  );
}

export function ChapterBoard() {
  const chapters = useStore(s => s.chapters);
  const reorderChapters = useStore(s => s.reorderChapters);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdx = sorted.findIndex(c => c.id === active.id);
    const overIdx = sorted.findIndex(c => c.id === over.id);
    if (activeIdx === -1 || overIdx === -1) return;

    const reordered = arrayMove(sorted, activeIdx, overIdx).map((c, i) => ({ ...c, order: i + 1 }));
    reorderChapters(reordered);
  };

  if (selectedChapter) {
    const current = chapters.find(c => c.id === selectedChapter.id) ?? selectedChapter;
    return (
      <div className="h-full">
        <ChapterEditor chapter={current} onClose={() => setSelectedChapter(null)} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-muted">{chapters.length} kapitel</p>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <><X size={14} /> Avbryt</> : <><Plus size={14} /> Nytt kapitel</>}
        </Button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-paper border border-sand rounded-xl p-5"
          >
            <h3 className="font-heading text-lg mb-4">Nytt kapitel</h3>
            <AddChapterForm onClose={() => setShowAddForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {chapters.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-heading text-2xl text-ink mb-2">Inga kapitel än</p>
          <p className="text-ink-muted text-sm">Skapa ditt första kapitel för att sätta igång!</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map(c => c.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sorted.map(chapter => (
                <SortableChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onClick={() => setSelectedChapter(chapter)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
