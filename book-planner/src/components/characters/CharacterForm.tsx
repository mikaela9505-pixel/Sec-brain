import React, { useState } from 'react';
import type { Character, CharacterRole } from '../../types';
import { useStore } from '../../store';
import { Button } from '../shared/Button';
import { TagInput } from '../shared/TagBadge';
import { Upload } from 'lucide-react';

interface CharacterFormProps {
  character?: Character;
  onClose: () => void;
}

const roles: { value: CharacterRole; label: string }[] = [
  { value: 'protagonist', label: 'Protagonist' },
  { value: 'supporting', label: 'Bifigur' },
  { value: 'antagonist', label: 'Antagonist' },
  { value: 'mentioned', label: 'Nämnd' },
];

const emptyForm = {
  name: '',
  role: 'supporting' as CharacterRole,
  age: '' as string | number,
  appearance: '',
  personality: '',
  backstory: '',
  motivations: '',
  fears: '',
  speechStyle: '',
  imageBase64: undefined as string | undefined,
  tags: [] as string[],
};

export function CharacterForm({ character, onClose }: CharacterFormProps) {
  const addCharacter = useStore(s => s.addCharacter);
  const updateCharacter = useStore(s => s.updateCharacter);

  const [form, setForm] = useState({
    name: character?.name ?? emptyForm.name,
    role: character?.role ?? emptyForm.role,
    age: character?.age ?? emptyForm.age,
    appearance: character?.appearance ?? emptyForm.appearance,
    personality: character?.personality ?? emptyForm.personality,
    backstory: character?.backstory ?? emptyForm.backstory,
    motivations: character?.motivations ?? emptyForm.motivations,
    fears: character?.fears ?? emptyForm.fears,
    speechStyle: character?.speechStyle ?? emptyForm.speechStyle,
    imageBase64: character?.imageBase64,
    tags: character?.tags ?? [],
  });

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('imageBase64', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      age: form.age === '' ? undefined : Number(form.age),
    };
    if (character) {
      updateCharacter(character.id, data);
    } else {
      addCharacter(data);
    }
    onClose();
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-sm font-medium text-ink-muted mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Namn *</label>
          <input
            required
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className={fieldClass}
            placeholder="Karaktärens namn"
          />
        </div>
        <div>
          <label className={labelClass}>Roll</label>
          <select value={form.role} onChange={e => set('role', e.target.value)} className={fieldClass}>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ålder</label>
          <input
            type="number"
            value={form.age}
            onChange={e => set('age', e.target.value)}
            className={fieldClass}
            placeholder="Ålder"
            min={0}
          />
        </div>
        <div>
          <label className={labelClass}>Bild</label>
          <label className="flex items-center gap-2 px-3 py-2 border border-sand rounded-lg cursor-pointer hover:border-gold transition-colors bg-paper">
            <Upload size={14} className="text-ink-muted" />
            <span className="text-sm text-ink-muted">
              {form.imageBase64 ? 'Byt bild...' : 'Ladda upp bild...'}
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {form.imageBase64 && (
        <div className="flex items-center gap-3">
          <img src={form.imageBase64} alt="Förhandsgranskning" className="w-16 h-16 rounded-full object-cover border-2 border-sand" />
          <button type="button" onClick={() => set('imageBase64', undefined)} className="text-sm text-red-500 hover:underline">
            Ta bort bild
          </button>
        </div>
      )}

      {[
        { field: 'appearance', label: 'Utseende' },
        { field: 'personality', label: 'Personlighet' },
        { field: 'backstory', label: 'Bakgrundshistoria' },
        { field: 'motivations', label: 'Drivkrafter' },
        { field: 'fears', label: 'Rädslor' },
        { field: 'speechStyle', label: 'Talkstil' },
      ].map(({ field, label }) => (
        <div key={field}>
          <label className={labelClass}>{label}</label>
          <textarea
            value={form[field as keyof typeof form] as string}
            onChange={e => set(field, e.target.value)}
            rows={3}
            className={`${fieldClass} resize-none`}
            placeholder={`${label}...`}
          />
        </div>
      ))}

      <div>
        <label className={labelClass}>Taggar</label>
        <TagInput tags={form.tags} onChange={tags => set('tags', tags)} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary">
          {character ? 'Spara ändringar' : 'Skapa karaktär'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>Avbryt</Button>
      </div>
    </form>
  );
}
