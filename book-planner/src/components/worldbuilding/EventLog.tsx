import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { useStore } from '../../store';
import type { WorldEvent } from '../../types';
import { Button } from '../shared/Button';
import { TagBadge } from '../shared/TagBadge';
import { TagInput } from '../shared/TagBadge';
import { Modal } from '../shared/Modal';
import { motion } from 'framer-motion';

const eventTypeColors: Record<string, string> = {
  crisis: '#E07070',
  turning_point: '#B8975A',
  world_event: '#7B9BC8',
  backstory: '#8BAE9B',
};

const eventTypeLabels: Record<string, string> = {
  crisis: 'Kris',
  turning_point: 'Vändpunkt',
  world_event: 'Världshändelse',
  backstory: 'Bakgrundshistoria',
};

type EventType = WorldEvent['type'];

interface EventFormProps {
  event?: WorldEvent;
  onClose: () => void;
}

function EventForm({ event, onClose }: EventFormProps) {
  const characters = useStore(s => s.characters);
  const addWorldEvent = useStore(s => s.addWorldEvent);
  const updateWorldEvent = useStore(s => s.updateWorldEvent);

  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    date: event?.date ?? '',
    type: event?.type ?? 'backstory' as EventType,
    characterIds: event?.characterIds ?? [] as string[],
    tags: event?.tags ?? [] as string[],
  });

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleChar = (id: string) => {
    const ids = form.characterIds.includes(id)
      ? form.characterIds.filter(c => c !== id)
      : [...form.characterIds, id];
    set('characterIds', ids);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      updateWorldEvent(event.id, form);
    } else {
      addWorldEvent(form);
    }
    onClose();
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold';
  const labelClass = 'block text-sm font-medium text-ink-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Titel *</label>
        <input required value={form.title} onChange={e => set('title', e.target.value)} className={fieldClass} placeholder="Händelsens titel" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Typ</label>
          <select value={form.type} onChange={e => set('type', e.target.value)} className={fieldClass}>
            {(Object.entries(eventTypeLabels) as [EventType, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Datum</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={fieldClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Beskrivning</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={`${fieldClass} resize-none`} placeholder="Beskriv händelsen..." />
      </div>
      <div>
        <label className={labelClass}>Kopplade karaktärer</label>
        <div className="flex flex-wrap gap-2 p-3 border border-sand rounded-lg">
          {characters.map(c => (
            <label key={c.id} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={form.characterIds.includes(c.id)} onChange={() => toggleChar(c.id)} className="w-3.5 h-3.5 accent-gold" />
              <span className="text-sm text-ink">{c.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>Taggar</label>
        <TagInput tags={form.tags} onChange={tags => set('tags', tags)} />
      </div>
      <div className="flex gap-3">
        <Button type="submit">{event ? 'Spara' : 'Skapa händelse'}</Button>
        <Button type="button" variant="secondary" onClick={onClose}>Avbryt</Button>
      </div>
    </form>
  );
}

export function EventLog() {
  const worldEvents = useStore(s => s.worldEvents);
  const characters = useStore(s => s.characters);
  const deleteWorldEvent = useStore(s => s.deleteWorldEvent);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WorldEvent | null>(null);

  const sorted = [...worldEvents].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Ny händelse
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-heading text-lg">Inga händelser ännu</p>
          <p className="text-sm mt-1">Logga viktiga händelser i din världshistoria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((event, i) => {
            const eventChars = characters.filter(c => event.characterIds.includes(c.id));
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-4 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: eventTypeColors[event.type] }} />
                  <div className="w-0.5 bg-sand flex-1 mt-1" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="bg-paper border border-sand rounded-xl p-4 hover:border-gold transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium text-paper"
                            style={{ backgroundColor: eventTypeColors[event.type] }}
                          >
                            {eventTypeLabels[event.type]}
                          </span>
                          {event.date && (
                            <span className="text-xs text-ink-muted flex items-center gap-1">
                              <Calendar size={10} /> {event.date}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-lg text-ink">{event.title}</h3>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingEvent(event)} className="p-1 text-ink-muted hover:text-ink rounded"><Edit2 size={13} /></button>
                        <button onClick={() => deleteWorldEvent(event.id)} className="p-1 text-ink-muted hover:text-red-500 rounded"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    {event.description && <p className="text-sm text-ink-muted mb-3">{event.description}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {eventChars.map(c => <span key={c.id} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">{c.name}</span>)}
                      {event.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Ny händelse" size="lg">
        <EventForm onClose={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editingEvent} onClose={() => setEditingEvent(null)} title="Redigera händelse" size="lg">
        {editingEvent && <EventForm event={editingEvent} onClose={() => setEditingEvent(null)} />}
      </Modal>
    </div>
  );
}
