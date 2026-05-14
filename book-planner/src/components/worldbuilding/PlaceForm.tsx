import React, { useState } from 'react';
import type { Place } from '../../types';
import { useStore } from '../../store';
import { Button } from '../shared/Button';
import { TagInput } from '../shared/TagBadge';

interface PlaceFormProps {
  place?: Place;
  onClose: () => void;
}

export function PlaceForm({ place, onClose }: PlaceFormProps) {
  const characters = useStore(s => s.characters);
  const addPlace = useStore(s => s.addPlace);
  const updatePlace = useStore(s => s.updatePlace);

  const [form, setForm] = useState({
    name: place?.name ?? '',
    description: place?.description ?? '',
    type: place?.type ?? '',
    notes: place?.notes ?? '',
    characterIds: place?.characterIds ?? [] as string[],
    sceneIds: place?.sceneIds ?? [] as string[],
    tags: place?.tags ?? [] as string[],
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
    if (place) {
      updatePlace(place.id, form);
    } else {
      addPlace(form);
    }
    onClose();
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold';
  const labelClass = 'block text-sm font-medium text-ink-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Namn *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} className={fieldClass} placeholder="Platsens namn" />
        </div>
        <div>
          <label className={labelClass}>Typ</label>
          <input value={form.type} onChange={e => set('type', e.target.value)} className={fieldClass} placeholder="T.ex. Stad, Skog, Byggnad..." />
        </div>
      </div>
      <div>
        <label className={labelClass}>Beskrivning</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={`${fieldClass} resize-none`} placeholder="Beskriv platsen..." />
      </div>
      <div>
        <label className={labelClass}>Anteckningar</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className={`${fieldClass} resize-none`} placeholder="Anteckningar om platsen..." />
      </div>
      <div>
        <label className={labelClass}>Kopplade karaktärer</label>
        <div className="flex flex-wrap gap-2 p-3 border border-sand rounded-lg bg-paper">
          {characters.map(c => (
            <label key={c.id} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={form.characterIds.includes(c.id)} onChange={() => toggleChar(c.id)} className="w-3.5 h-3.5 accent-gold" />
              <span className="text-sm text-ink">{c.name}</span>
            </label>
          ))}
          {characters.length === 0 && <p className="text-sm text-ink-muted">Inga karaktärer</p>}
        </div>
      </div>
      <div>
        <label className={labelClass}>Taggar</label>
        <TagInput tags={form.tags} onChange={tags => set('tags', tags)} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit">{place ? 'Spara ändringar' : 'Skapa plats'}</Button>
        <Button type="button" variant="secondary" onClick={onClose}>Avbryt</Button>
      </div>
    </form>
  );
}
