interface WordCounterProps {
  text: string;
  goal?: number;
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function WordCounter({ text, goal }: WordCounterProps) {
  const count = countWords(text);
  const pct = goal ? Math.min((count / goal) * 100, 100) : null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-ink-muted">
        {count.toLocaleString('sv-SE')} ord
        {goal && ` / ${goal.toLocaleString('sv-SE')}`}
      </span>
      {pct !== null && (
        <div className="w-24 h-1.5 bg-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
