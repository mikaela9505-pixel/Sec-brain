import type { Chapter } from '../../types';
import { useStore } from '../../store';
import { GripVertical, Trash2 } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
  dragHandleProps?: Record<string, unknown>;
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

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function ChapterCard({ chapter, onClick, dragHandleProps }: ChapterCardProps) {
  const characters = useStore(s => s.characters);
  const deleteChapter = useStore(s => s.deleteChapter);

  const pov = characters.find(c => c.id === chapter.povCharacterId);
  const wordCount = countWords(chapter.content);
  const goal = chapter.wordCountGoal;
  const pct = goal ? Math.min((wordCount / goal) * 100, 100) : null;

  return (
    <div
      onClick={onClick}
      className="bg-paper border border-sand rounded-xl p-4 cursor-pointer hover:border-gold hover:shadow-md transition-all duration-200 group relative"
      style={{ borderTop: `3px solid ${statusColors[chapter.status]}` }}
    >
      <div className="flex items-start gap-2 mb-3">
        <div
          {...dragHandleProps}
          className="mt-0.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-ink-muted">Kapitel {chapter.order}</span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium text-paper"
              style={{ backgroundColor: statusColors[chapter.status] }}
            >
              {statusLabels[chapter.status]}
            </span>
          </div>
          <h3 className="font-heading text-base text-ink leading-tight">{chapter.title}</h3>
        </div>
      </div>

      {chapter.summary && (
        <p className="text-xs text-ink-muted line-clamp-3 mb-3">{chapter.summary}</p>
      )}

      <div className="space-y-1.5">
        {pov && <p className="text-xs text-ink-muted">POV: {pov.name}</p>}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">{wordCount.toLocaleString('sv-SE')} ord</span>
          {goal && <span className="text-xs text-ink-muted">/ {goal.toLocaleString('sv-SE')}</span>}
        </div>
        {pct !== null && (
          <div className="w-full h-1 bg-cream rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      <button
        onClick={e => { e.stopPropagation(); deleteChapter(chapter.id); }}
        className="absolute top-3 right-3 p-1 text-ink-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
