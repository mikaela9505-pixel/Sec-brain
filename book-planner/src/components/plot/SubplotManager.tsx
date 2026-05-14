import { useState } from 'react';
import { useStore } from '../../store';
import { Plus, X, Edit2, Check } from 'lucide-react';
import type { Subplot } from '../../types';

const COLORS = ['#B8975A', '#7B9BC8', '#8BAE9B', '#C8977B', '#E8A0B8', '#9B7BC8', '#E07070', '#D4B483'];

export function SubplotManager() {
  const subplots = useStore(s => s.subplots);
  const addSubplot = useStore(s => s.addSubplot);
  const updateSubplot = useStore(s => s.updateSubplot);
  const deleteSubplot = useStore(s => s.deleteSubplot);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', color: COLORS[0], description: '' });
  const [editForm, setEditForm] = useState<Partial<Subplot>>({});

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addSubplot({ title: form.title, color: form.color, description: form.description });
    setForm({ title: '', color: COLORS[0], description: '' });
    setAdding(false);
  };

  const handleEdit = (subplot: Subplot) => {
    setEditing(subplot.id);
    setEditForm({ title: subplot.title, color: subplot.color, description: subplot.description });
  };

  const handleSaveEdit = (id: string) => {
    updateSubplot(id, editForm);
    setEditing(null);
  };

  return (
    <div className="bg-paper border border-sand rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-base text-ink">Subplottar</h3>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 text-xs text-gold hover:text-gold-dark transition-colors"
        >
          <Plus size={13} /> Lägg till
        </button>
      </div>

      {adding && (
        <div className="mb-3 p-3 bg-cream rounded-lg space-y-2">
          <input
            autoFocus
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Subplottens titel..."
            className="w-full px-3 py-2 border border-sand rounded-lg text-sm bg-paper focus:outline-none focus:border-gold"
          />
          <input
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Beskrivning (valfritt)..."
            className="w-full px-3 py-2 border border-sand rounded-lg text-sm bg-paper focus:outline-none focus:border-gold"
          />
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setForm(p => ({ ...p, color: c }))}
                className="w-6 h-6 rounded-full border-2 transition-all"
                style={{ backgroundColor: c, borderColor: form.color === c ? '#2C2416' : 'transparent' }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="text-xs px-3 py-1.5 bg-gold text-paper rounded-lg">Spara</button>
            <button onClick={() => setAdding(false)} className="text-xs px-3 py-1.5 border border-sand rounded-lg text-ink-muted">Avbryt</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {subplots.map(subplot => (
          <div key={subplot.id} className="flex items-center gap-2 group">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: subplot.color }} />
            {editing === subplot.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  value={editForm.title ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  className="flex-1 px-2 py-1 border border-sand rounded text-sm focus:outline-none focus:border-gold"
                />
                <div className="flex gap-1">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setEditForm(p => ({ ...p, color: c }))}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: c, borderColor: editForm.color === c ? '#2C2416' : 'transparent' }}
                    />
                  ))}
                </div>
                <button onClick={() => handleSaveEdit(subplot.id)} className="text-sage"><Check size={14} /></button>
                <button onClick={() => setEditing(null)} className="text-ink-muted"><X size={14} /></button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm text-ink truncate">{subplot.title}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => handleEdit(subplot)} className="text-ink-muted hover:text-ink"><Edit2 size={12} /></button>
                  <button onClick={() => deleteSubplot(subplot.id)} className="text-ink-muted hover:text-red-500"><X size={12} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {subplots.length === 0 && <p className="text-xs text-ink-muted">Inga subplottar ännu.</p>}
      </div>
    </div>
  );
}
