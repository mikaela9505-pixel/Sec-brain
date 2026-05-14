import { useState } from 'react';
import { Plus, Network } from 'lucide-react';
import { useStore } from '../../store';
import type { Character, CharacterRole } from '../../types';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { TagBadge } from '../shared/TagBadge';
import { CharacterForm } from './CharacterForm';
import { CharacterDetail } from './CharacterDetail';
import { RelationMap } from './RelationMap';
import { motion } from 'framer-motion';

const roleColors: Record<CharacterRole, string> = {
  protagonist: '#B8975A',
  supporting: '#8BAE9B',
  antagonist: '#E07070',
  mentioned: '#8B7A65',
};

const roleLabels: Record<CharacterRole, string> = {
  protagonist: 'Protagonist',
  supporting: 'Bifigur',
  antagonist: 'Antagonist',
  mentioned: 'Nämnd',
};

const roleFilters: { value: CharacterRole | 'all'; label: string }[] = [
  { value: 'all', label: 'Alla' },
  { value: 'protagonist', label: 'Protagonister' },
  { value: 'supporting', label: 'Bifigurer' },
  { value: 'antagonist', label: 'Antagonister' },
  { value: 'mentioned', label: 'Nämnda' },
];

export function CharacterList() {
  const characters = useStore(s => s.characters);
  const [roleFilter, setRoleFilter] = useState<CharacterRole | 'all'>('all');
  const [tagFilter, setTagFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showRelations, setShowRelations] = useState(false);

  const allTags = [...new Set(characters.flatMap(c => c.tags))].sort();

  const filtered = characters.filter(c => {
    if (roleFilter !== 'all' && c.role !== roleFilter) return false;
    if (tagFilter && !c.tags.includes(tagFilter)) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5">
            {roleFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  roleFilter === f.value
                    ? 'bg-gold text-paper shadow-sm'
                    : 'bg-paper border border-sand text-ink-muted hover:border-gold'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {allTags.length > 0 && (
            <select
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs border border-sand bg-paper text-ink-muted focus:outline-none focus:border-gold"
            >
              <option value="">Alla taggar</option>
              {allTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowRelations(true)}>
            <Network size={14} /> Relationskarta
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={14} /> Ny karaktär
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink-muted text-lg font-heading">Inga karaktärer hittades</p>
          <p className="text-ink-muted text-sm mt-2">Prova att ändra filter eller skapa en ny karaktär</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((char, i) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(184,151,90,0.15)' }}
              onClick={() => setSelectedCharacter(char)}
              className="bg-paper border border-sand rounded-xl p-4 cursor-pointer hover:border-gold transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center mb-3">
                {char.imageBase64 ? (
                  <img
                    src={char.imageBase64}
                    alt={char.name}
                    className="w-16 h-16 rounded-full object-cover border-2 mb-3"
                    style={{ borderColor: roleColors[char.role] }}
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-heading text-paper mb-3"
                    style={{ backgroundColor: roleColors[char.role] }}
                  >
                    {char.name.charAt(0)}
                  </div>
                )}
                <h3 className="font-heading text-lg text-ink leading-tight">{char.name}</h3>
                <span
                  className="mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-paper"
                  style={{ backgroundColor: roleColors[char.role] }}
                >
                  {roleLabels[char.role]}
                </span>
                {char.age && <p className="text-xs text-ink-muted mt-1">{char.age} år</p>}
              </div>

              {char.personality && (
                <p className="text-xs text-ink-muted line-clamp-2 text-center mb-3">{char.personality}</p>
              )}

              {char.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {char.tags.slice(0, 3).map(tag => <TagBadge key={tag} tag={tag} />)}
                  {char.tags.length > 3 && <span className="text-xs text-ink-muted">+{char.tags.length - 3}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Ny karaktär" size="lg">
        <CharacterForm onClose={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!selectedCharacter} onClose={() => setSelectedCharacter(null)} title={selectedCharacter?.name ?? ''} size="lg">
        {selectedCharacter && (
          <CharacterDetail character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
        )}
      </Modal>

      <Modal isOpen={showRelations} onClose={() => setShowRelations(false)} title="Relationskarta" size="xl">
        <RelationMap />
      </Modal>
    </div>
  );
}
