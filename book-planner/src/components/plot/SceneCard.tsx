import { useState } from 'react';
import type { Scene } from '../../types';
import { useStore } from '../../store';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { SceneForm } from './SceneForm';

interface SceneCardProps {
  scene: Scene;
  subplotColor: string;
  dragHandleProps?: Record<string, unknown>;
}

const toneColors: Record<string, string> = {
  tense: '#E07070',
  hopeful: '#B8975A',
  sad: '#7B9BC8',
  joyful: '#8BAE9B',
  mysterious: '#9B7BC8',
  neutral: '#8B7A65',
};

const statusLabels: Record<string, string> = {
  idea: 'Idé',
  planned: 'Planerat',
  written: 'Skrivet',
  revised: 'Reviderat',
};

export function SceneCard({ scene, subplotColor, dragHandleProps }: SceneCardProps) {
  const characters = useStore(s => s.characters);
  const places = useStore(s => s.places);
  const deleteScene = useStore(s => s.deleteScene);
  const [editing, setEditing] = useState(false);

  const pov = characters.find(c => c.id === scene.povCharacterId);
  const place = places.find(p => p.id === scene.placeId);

  return (
    <>
      <div
        className="bg-paper border border-sand rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group"
        style={{ borderLeft: `3px solid ${subplotColor}` }}
      >
        <div className="flex items-start gap-2">
          <div {...dragHandleProps} className="mt-0.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <GripVertical size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: toneColors[scene.emotionalTone] }} />
              <h4 className="font-medium text-sm text-ink truncate flex-1">{scene.title}</h4>
            </div>
            {scene.summary && (
              <p className="text-xs text-ink-muted line-clamp-2 mb-2">{scene.summary}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {pov && <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">{pov.name}</span>}
              {place && <span className="text-xs bg-sage/10 text-sage-dark px-2 py-0.5 rounded-full">{place.name}</span>}
              <span className="text-xs text-ink-muted">{statusLabels[scene.status]}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditing(true)} className="p-1 text-ink-muted hover:text-ink rounded">
              <Edit2 size={12} />
            </button>
            <button onClick={() => deleteScene(scene.id)} className="p-1 text-ink-muted hover:text-red-500 rounded">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Redigera scen" size="lg">
        <SceneForm scene={scene} onClose={() => setEditing(false)} />
      </Modal>
    </>
  );
}
