import React from 'react';
import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  color?: string;
}

export function TagBadge({ tag, onRemove, color }: TagBadgeProps) {
  const style = color ? { backgroundColor: color + '22', color: color, borderColor: color + '44' } : {};
  const baseClass = color
    ? 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border'
    : 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand text-ink-muted border border-sand';

  return (
    <span className={baseClass} style={style}>
      {tag}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity ml-0.5"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Lägg till tagg...' }: TagInputProps) {
  const [input, setInput] = React.useState('');

  const addTag = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-sand rounded-lg bg-paper min-h-[40px] focus-within:border-gold transition-colors">
      {tags.map(tag => (
        <TagBadge key={tag} tag={tag} onRemove={() => onChange(tags.filter(t => t !== tag))} />
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-ink placeholder-ink-muted"
      />
    </div>
  );
}
