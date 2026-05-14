import { useState } from 'react';
import type { Character } from '../../types';
import { useStore } from '../../store';
import { TagBadge } from '../shared/TagBadge';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { CharacterForm } from './CharacterForm';

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
}

const roleColors: Record<string, string> = {
  protagonist: '#B8975A',
  supporting: '#8BAE9B',
  antagonist: '#E07070',
  mentioned: '#8B7A65',
};

const roleLabels: Record<string, string> = {
  protagonist: 'Protagonist',
  supporting: 'Bifigur',
  antagonist: 'Antagonist',
  mentioned: 'Nämnd',
};

export function CharacterDetail({ character, onClose }: CharacterDetailProps) {
  const [editing, setEditing] = useState(false);
  const deleteCharacter = useStore(s => s.deleteCharacter);
  const relations = useStore(s => s.relations);
  const characters = useStore(s => s.characters);

  const charRelations = relations.filter(r => r.fromId === character.id || r.toId === character.id);

  const handleDelete = () => {
    deleteCharacter(character.id);
    onClose();
  };

  const Section = ({ title, content }: { title: string; content: string }) =>
    content ? (
      <div>
        <h4 className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">{title}</h4>
        <p className="text-sm text-ink leading-relaxed">{content}</p>
      </div>
    ) : null;

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          {character.imageBase64 ? (
            <img
              src={character.imageBase64}
              alt={character.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-sand flex-shrink-0"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-heading text-paper flex-shrink-0"
              style={{ backgroundColor: roleColors[character.role] }}
            >
              {character.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-heading text-2xl text-ink">{character.name}</h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium text-paper"
                style={{ backgroundColor: roleColors[character.role] }}
              >
                {roleLabels[character.role]}
              </span>
              {character.age && <span className="text-sm text-ink-muted">{character.age} år</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {character.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Section title="Utseende" content={character.appearance} />
          <Section title="Personlighet" content={character.personality} />
          <Section title="Bakgrundshistoria" content={character.backstory} />
          <Section title="Drivkrafter" content={character.motivations} />
          <Section title="Rädslor" content={character.fears} />
          <Section title="Talkstil" content={character.speechStyle} />
        </div>

        {charRelations.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">Relationer</h4>
            <div className="space-y-1.5">
              {charRelations.map(rel => {
                const otherId = rel.fromId === character.id ? rel.toId : rel.fromId;
                const other = characters.find(c => c.id === otherId);
                return (
                  <div key={rel.id} className="flex items-center gap-2 text-sm">
                    <span className="text-ink">{other?.name ?? '?'}</span>
                    <span className="text-ink-muted">–</span>
                    <span className="text-ink-muted">{rel.type}</span>
                    {rel.description && <span className="text-ink-muted text-xs truncate">{rel.description}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-sand">
          <Button size="sm" onClick={() => setEditing(true)}>
            <Edit2 size={14} /> Redigera
          </Button>
          <Button size="sm" variant="danger" onClick={handleDelete}>
            <Trash2 size={14} /> Ta bort
          </Button>
        </div>
      </div>

      <Modal isOpen={editing} onClose={() => setEditing(false)} title={`Redigera ${character.name}`} size="lg">
        <CharacterForm character={character} onClose={() => setEditing(false)} />
      </Modal>
    </>
  );
}
