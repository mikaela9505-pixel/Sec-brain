import { useState } from 'react';
import { Users, Film, BookOpen, Type, Plus, Trash2, Clock, Target } from 'lucide-react';
import { useStore } from '../../store';
import { motion } from 'framer-motion';
import { Button } from '../shared/Button';

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const statusColors: Record<string, string> = {
  idea: '#E8D5A0',
  planned: '#B0C9BC',
  draft: '#7B9BC8',
  revised: '#C8977B',
  done: '#8BAE9B',
};

const statusLabels: Record<string, string> = {
  idea: 'Idé',
  planned: 'Planerat',
  draft: 'Utkast',
  revised: 'Reviderat',
  done: 'Klart',
};

const noteColors = ['#FFF9C4', '#F8D7DA', '#D1F2EB', '#D6EAF8', '#F9EBEA', '#FDEBD0'];

export function Dashboard() {
  const project = useStore(s => s.project);
  const characters = useStore(s => s.characters);
  const scenes = useStore(s => s.scenes);
  const chapters = useStore(s => s.chapters);
  const stickyNotes = useStore(s => s.stickyNotes);
  const addStickyNote = useStore(s => s.addStickyNote);
  const updateStickyNote = useStore(s => s.updateStickyNote);
  const deleteStickyNote = useStore(s => s.deleteStickyNote);
  const setActiveView = useStore(s => s.setActiveView);

  const [editingNote, setEditingNote] = useState<string | null>(null);

  const totalWords = chapters.reduce((sum, c) => sum + countWords(c.content), 0);
  const wordGoal = project.wordCountGoal || 80000;
  const progress = Math.min((totalWords / wordGoal) * 100, 100);

  const chaptersByStatus = chapters.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentChapter = [...chapters].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const nextChapter = chapters.find(c => c.status === 'planned' || c.status === 'idea');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgon';
    if (hour < 17) return 'God eftermiddag';
    return 'God kväll';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-4xl text-ink mb-1">
          {getGreeting()}, <span className="text-gold italic">{project.title}</span>
        </h1>
        <p className="text-ink-muted">{project.description}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Karaktärer', value: characters.length, icon: Users, color: 'text-gold', bg: 'bg-gold/10', view: 'characters' },
          { label: 'Scener', value: scenes.length, icon: Film, color: 'text-sage', bg: 'bg-sage/10', view: 'plot' },
          { label: 'Kapitel', value: chapters.length, icon: BookOpen, color: 'text-ink-muted', bg: 'bg-sand', view: 'chapters' },
          { label: 'Antal ord', value: totalWords.toLocaleString('sv-SE'), icon: Type, color: 'text-ink', bg: 'bg-cream', view: 'chapters' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <motion.button
              key={stat.label}
              whileHover={{ y: -2 }}
              onClick={() => setActiveView(stat.view)}
              className="bg-paper border border-sand rounded-xl p-4 text-left hover:border-gold hover:shadow-md transition-all duration-200"
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-semibold text-ink">{stat.value}</p>
              <p className="text-sm text-ink-muted mt-0.5">{stat.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Word Count Progress */}
      <div className="bg-paper border border-sand rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-gold" />
            <h3 className="font-heading text-lg text-ink">Skrivmål</h3>
          </div>
          <span className="text-sm text-ink-muted">
            {totalWords.toLocaleString('sv-SE')} / {wordGoal.toLocaleString('sv-SE')} ord
          </span>
        </div>
        <div className="w-full h-3 bg-cream rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
          />
        </div>
        <p className="text-xs text-ink-muted mt-2">{progress.toFixed(1)}% av målet uppnått</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Chapter Status */}
        <div className="col-span-2 bg-paper border border-sand rounded-xl p-5">
          <h3 className="font-heading text-lg text-ink mb-4">Kapitelstatus</h3>
          <div className="space-y-2.5">
            {Object.entries(statusLabels).map(([key, label]) => {
              const count = chaptersByStatus[key] || 0;
              const pct = chapters.length ? (count / chapters.length) * 100 : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-ink-muted w-20">{label}</span>
                  <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: statusColors[key] }}
                    />
                  </div>
                  <span className="text-sm font-medium text-ink w-5 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-paper border border-sand rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-ink-muted" />
            <h3 className="font-heading text-lg text-ink">Snabblänkar</h3>
          </div>
          <div className="space-y-3">
            {recentChapter && (
              <button
                onClick={() => setActiveView('chapters')}
                className="w-full text-left p-3 rounded-lg bg-cream hover:bg-sand transition-colors"
              >
                <p className="text-xs text-ink-muted mb-1">Senast redigerat</p>
                <p className="text-sm font-medium text-ink truncate">{recentChapter.title}</p>
              </button>
            )}
            {nextChapter && (
              <button
                onClick={() => setActiveView('chapters')}
                className="w-full text-left p-3 rounded-lg bg-cream hover:bg-sand transition-colors"
              >
                <p className="text-xs text-ink-muted mb-1">Nästa att skriva</p>
                <p className="text-sm font-medium text-ink truncate">{nextChapter.title}</p>
              </button>
            )}
            <button
              onClick={() => setActiveView('characters')}
              className="w-full text-left p-3 rounded-lg bg-cream hover:bg-sand transition-colors"
            >
              <p className="text-xs text-ink-muted mb-1">Karaktärer</p>
              <p className="text-sm font-medium text-ink">{characters.length} skapade</p>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Notes */}
      <div className="bg-paper border border-sand rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-ink">Anteckningar</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => addStickyNote({ content: '', color: noteColors[Math.floor(Math.random() * noteColors.length)] })}
          >
            <Plus size={14} /> Ny anteckning
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stickyNotes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-xl p-4 min-h-[100px] shadow-sm"
              style={{ backgroundColor: note.color }}
            >
              <button
                onClick={() => deleteStickyNote(note.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10"
              >
                <Trash2 size={13} className="text-ink-muted" />
              </button>
              {editingNote === note.id ? (
                <textarea
                  autoFocus
                  value={note.content}
                  onChange={e => updateStickyNote(note.id, { content: e.target.value })}
                  onBlur={() => setEditingNote(null)}
                  className="w-full h-full min-h-[80px] bg-transparent outline-none text-sm text-ink resize-none"
                />
              ) : (
                <p
                  className="text-sm text-ink cursor-text whitespace-pre-wrap"
                  onClick={() => setEditingNote(note.id)}
                >
                  {note.content || <span className="text-ink-muted italic">Klicka för att redigera...</span>}
                </p>
              )}
            </motion.div>
          ))}
          {stickyNotes.length === 0 && (
            <p className="col-span-3 text-sm text-ink-muted text-center py-6">Inga anteckningar ännu. Lägg till en!</p>
          )}
        </div>
      </div>
    </div>
  );
}
