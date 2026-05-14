import React, { useState } from 'react';
import type { Scene, EmotionalTone, SceneStatus } from '../../types';
import { useStore } from '../../store';
import { Button } from '../shared/Button';
import { TagInput } from '../shared/TagBadge';

interface SceneFormProps {
  scene?: Scene;
  defaultSubplotId?: string;
  onClose: () => void;
}

const tones: { value: EmotionalTone; label: string }[] = [
  { value: 'tense', label: 'Spänt' },
  { value: 'hopeful', label: 'Hoppfullt' },
  { value: 'sad', label: 'Sorgset' },
  { value: 'joyful', label: 'Glatt' },
  { value: 'mysterious', label: 'Mystiskt' },
  { value: 'neutral', label: 'Neutralt' },
];

const statuses: { value: SceneStatus; label: string }[] = [
  { value: 'idea', label: 'Idé' },
  { value: 'planned', label: 'Planerat' },
  { value: 'written', label: 'Skrivet' },
  { value: 'revised', label: 'Reviderat' },
];

export function SceneForm({ scene, defaultSubplotId, onClose }: SceneFormProps) {
  const characters = useStore(s => s.characters);
  const subplots = useStore(s => s.subplots);
  const places = useStore(s => s.places);
  const chapters = useStore(s => s.chapters);
  const scenes = useStore(s => s.scenes);
  const addScene = useStore(s => s.addScene);
  const updateScene = useStore(s => s.updateScene);

  const [form, setForm] = useState({
    title: scene?.title ?? '',
    summary: scene?.summary ?? '',
    povCharacterId: scene?.povCharacterId ?? '',
    subplotId: scene?.subplotId ?? defaultSubplotId ?? '',
    placeId: scene?.placeId ?? '',
    chapterId: scene?.chapterId ?? '',
    characterIds: scene?.characterIds ?? [] as string[],
    emotionalTone: scene?.emotionalTone ?? 'neutral' as EmotionalTone,
    status: scene?.status ?? 'idea' as SceneStatus,
    tags: scene?.tags ?? [] as string[],
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
    const maxOrder = scenes.length > 0 ? Math.max(...scenes.map(s => s.order)) : 0;
    if (scene) {
      updateScene(scene.id, form);
    } else {
      addScene({ ...form, order: maxOrder + 1 });
    }
    onClose();
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-sm font-medium text-ink-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Titel *</label>
        <input required value={form.title} onChange={e => set('title', e.target.value)} className={fieldClass} placeholder="Scenens titel" />
      </div>

      <div>
        <label className={labelClass}>Sammanfattning</label>
        <textarea
          value={form.summary}
          onChange={e => set('summary', e.target.value)}
          rows={3}
          className={`${fieldClass} resize-none`}
          placeholder="Vad händer i scenen?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>POV-karaktär</label>
          <select value={form.povCharacterId} onChange={e => set('povCharacterId', e.target.value)} className={fieldClass}>
            <option value="">Ingen specifik POV</option>
            {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Subplot</label>
          <select value={form.subplotId} onChange={e => set('subplotId', e.target.value)} className={fieldClass}>
            <option value="">Ingen subplot</option>
            {subplots.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Plats</label>
          <select value={form.placeId} onChange={e => set('placeId', e.target.value)} className={fieldClass}>
            <option value="">Ingen specifik plats</option>
            {places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Kapitel</label>
          <select value={form.chapterId} onChange={e => set('chapterId', e.target.value)} className={fieldClass}>
            <option value="">Inget kapitel</option>
            {chapters.sort((a, b) => a.order - b.order).map(c => <option key={c.id} value={c.id}>{c.order}. {c.title}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Emotionell ton</label>
          <select value={form.emotionalTone} onChange={e => set('emotionalTone', e.target.value)} className={fieldClass}>
            {tones.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className={fieldClass}>
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Karaktärer i scenen</label>
        <div className="flex flex-wrap gap-2 p-3 border border-sand rounded-lg bg-paper">
          {characters.map(c => (
            <label key={c.id} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.characterIds.includes(c.id)}
                onChange={() => toggleChar(c.id)}
                className="w-3.5 h-3.5 accent-gold"
              />
              <span className="text-sm text-ink">{c.name}</span>
            </label>
          ))}
          {characters.length === 0 && <p className="text-sm text-ink-muted">Inga karaktärer skapade ännu</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Taggar</label>
        <TagInput tags={form.tags} onChange={tags => set('tags', tags)} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit">{scene ? 'Spara ändringar' : 'Skapa scen'}</Button>
        <Button type="button" variant="secondary" onClick={onClose}>Avbryt</Button>
      </div>
    </form>
  );
}
