import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { useStore } from '../../store';
import type { Place } from '../../types';
import { Button } from '../shared/Button';
import { TagBadge } from '../shared/TagBadge';
import { Modal } from '../shared/Modal';
import { PlaceForm } from './PlaceForm';
import { motion } from 'framer-motion';

export function PlaceList() {
  const places = useStore(s => s.places);
  const characters = useStore(s => s.characters);
  const deletePlace = useStore(s => s.deletePlace);
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Ny plats
        </Button>
      </div>

      {places.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          <MapPin size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-heading text-lg">Inga platser ännu</p>
          <p className="text-sm mt-1">Skapa platser för att bygga upp din värld</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {places.map((place, i) => {
            const placeChars = characters.filter(c => place.characterIds.includes(c.id));
            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-paper border border-sand rounded-xl p-4 group hover:border-gold hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-heading text-lg text-ink">{place.name}</h3>
                    {place.type && <span className="text-xs text-ink-muted">{place.type}</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingPlace(place)} className="p-1 text-ink-muted hover:text-ink rounded"><Edit2 size={13} /></button>
                    <button onClick={() => deletePlace(place.id)} className="p-1 text-ink-muted hover:text-red-500 rounded"><Trash2 size={13} /></button>
                  </div>
                </div>
                {place.description && <p className="text-sm text-ink-muted line-clamp-3 mb-3">{place.description}</p>}
                {placeChars.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {placeChars.map(c => <span key={c.id} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">{c.name}</span>)}
                  </div>
                )}
                {place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {place.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Ny plats" size="lg">
        <PlaceForm onClose={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={!!editingPlace} onClose={() => setEditingPlace(null)} title={`Redigera: ${editingPlace?.name}`} size="lg">
        {editingPlace && <PlaceForm place={editingPlace} onClose={() => setEditingPlace(null)} />}
      </Modal>
    </div>
  );
}
