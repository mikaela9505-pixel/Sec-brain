import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { Button } from '../shared/Button';
import { Download, Upload, AlertTriangle, Save } from 'lucide-react';
import type { AppState } from '../../types';

export function Settings() {
  const project = useStore(s => s.project);
  const updateProject = useStore(s => s.updateProject);
  const importData = useStore(s => s.importData);
  const resetData = useStore(s => s.resetData);

  const [form, setForm] = useState({ ...project });
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject({ ...form, wordCountGoal: Number(form.wordCountGoal) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const state = useStore.getState();
    const { activeView, ...rest } = state;
    const blob = new Blob([JSON.stringify(rest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manuskript-${project.title.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Omit<AppState, 'activeView'>;
        importData(data);
        alert('Data importerades framgångsrikt!');
      } catch {
        alert('Fel: Kunde inte läsa filen. Kontrollera att det är en giltig JSON-fil.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetData();
    setShowReset(false);
    setForm({ ...useStore.getState().project });
  };

  const fieldClass = 'w-full px-3 py-2 border border-sand rounded-lg text-sm text-ink bg-paper focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-sm font-medium text-ink mb-1';

  return (
    <div className="p-8 max-w-2xl">
      {/* Project Settings */}
      <form onSubmit={handleSave} className="bg-paper border border-sand rounded-xl p-6 mb-6">
        <h3 className="font-heading text-xl text-ink mb-5">Projektinställningar</h3>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Projekttitel</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className={fieldClass} placeholder="Ditt projekts titel" />
          </div>

          <div>
            <label className={labelClass}>Beskrivning</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={`${fieldClass} resize-none`} placeholder="Kort beskrivning av projektet..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Genre</label>
              <input value={form.genre} onChange={e => set('genre', e.target.value)} className={fieldClass} placeholder="T.ex. Fantasy, Thriller..." />
            </div>
            <div>
              <label className={labelClass}>Målgrupp</label>
              <input value={form.targetAudience} onChange={e => set('targetAudience', e.target.value)} className={fieldClass} placeholder="T.ex. Vuxna, Unga vuxna..." />
            </div>
          </div>

          <div>
            <label className={labelClass}>Ordmål (totalt)</label>
            <input
              type="number"
              value={form.wordCountGoal}
              onChange={e => set('wordCountGoal', e.target.value)}
              className={fieldClass}
              placeholder="T.ex. 80000"
              min={0}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button type="submit">
            <Save size={14} />
            {saved ? 'Sparat!' : 'Spara inställningar'}
          </Button>
          {saved && <span className="text-sm text-sage">Ändringar sparade</span>}
        </div>
      </form>

      {/* Export / Import */}
      <div className="bg-paper border border-sand rounded-xl p-6 mb-6">
        <h3 className="font-heading text-xl text-ink mb-5">Export & Import</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-muted mb-3">
              Exportera hela projektet som en JSON-fil. Du kan sedan importera den igen eller använda den som backup.
            </p>
            <Button onClick={handleExport} variant="secondary">
              <Download size={14} /> Exportera till JSON
            </Button>
          </div>

          <div className="border-t border-sand pt-4">
            <p className="text-sm text-ink-muted mb-3">
              Importera ett befintligt projekt från en JSON-fil. OBS: Detta ersätter all nuvarande data.
            </p>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
              <Upload size={14} /> Importera från JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-paper border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="font-heading text-xl text-red-600">Farlig zon</h3>
        </div>
        <p className="text-sm text-ink-muted mb-4">
          Återställ all data till fabriksinställningarna. Denna åtgärd kan inte ångras och all din data kommer att gå förlorad.
        </p>

        {!showReset ? (
          <Button variant="danger" onClick={() => setShowReset(true)}>
            Återställ all data
          </Button>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 flex-1">Är du säker? All data kommer att raderas permanent.</p>
            <Button variant="danger" size="sm" onClick={handleReset}>Ja, återställ</Button>
            <Button variant="secondary" size="sm" onClick={() => setShowReset(false)}>Avbryt</Button>
          </div>
        )}
      </div>
    </div>
  );
}
