import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../../store';
import type { Scene, Subplot } from '../../types';
import { SceneCard } from './SceneCard';
import { SceneForm } from './SceneForm';
import { SubplotManager } from './SubplotManager';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

function SortableSceneCard({ scene, subplotColor }: { scene: Scene; subplotColor: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: scene.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="w-56 flex-shrink-0">
      <SceneCard scene={scene} subplotColor={subplotColor} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

function SubplotRow({ subplot, scenes }: { subplot: Subplot; scenes: Scene[] }) {
  const updateScene = useStore(s => s.updateScene);
  const [addingScene, setAddingScene] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdx = scenes.findIndex(s => s.id === active.id);
    const overIdx = scenes.findIndex(s => s.id === over.id);
    if (activeIdx === -1 || overIdx === -1) return;

    const reordered = arrayMove(scenes, activeIdx, overIdx);
    reordered.forEach((scene, idx) => {
      if (scene.order !== idx + 1) {
        updateScene(scene.id, { order: idx + 1 });
      }
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subplot.color }} />
        <span className="text-sm font-medium text-ink">{subplot.title}</span>
        {subplot.description && <span className="text-xs text-ink-muted">{subplot.description}</span>}
        <button
          onClick={() => setAddingScene(true)}
          className="ml-auto flex items-center gap-1 text-xs text-ink-muted hover:text-gold transition-colors"
        >
          <Plus size={12} /> Ny scen
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={scenes.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {scenes.length === 0 && (
                <div
                  className="w-56 h-24 border-2 border-dashed border-sand rounded-xl flex items-center justify-center cursor-pointer hover:border-gold transition-colors"
                  style={{ borderColor: subplot.color + '44' }}
                  onClick={() => setAddingScene(true)}
                >
                  <span className="text-sm text-ink-muted">Lägg till scen</span>
                </div>
              )}
              {scenes.map(scene => (
                <SortableSceneCard key={scene.id} scene={scene} subplotColor={subplot.color} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <Modal isOpen={addingScene} onClose={() => setAddingScene(false)} title="Ny scen" size="lg">
        <SceneForm defaultSubplotId={subplot.id} onClose={() => setAddingScene(false)} />
      </Modal>
    </div>
  );
}

export function PlotTimeline() {
  const scenes = useStore(s => s.scenes);
  const subplots = useStore(s => s.subplots);
  const characters = useStore(s => s.characters);
  const [povFilter, setPovFilter] = useState('');
  const [showAddScene, setShowAddScene] = useState(false);

  const filteredScenes = povFilter
    ? scenes.filter(s => s.povCharacterId === povFilter)
    : scenes;

  const getSubplotScenes = (subplotId: string) =>
    filteredScenes
      .filter(s => s.subplotId === subplotId)
      .sort((a, b) => a.order - b.order);

  const unassignedScenes = filteredScenes
    .filter(s => !s.subplotId || !subplots.find(sub => sub.id === s.subplotId))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <select
          value={povFilter}
          onChange={e => setPovFilter(e.target.value)}
          className="px-3 py-2 border border-sand rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-gold"
        >
          <option value="">Alla POV</option>
          {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Button size="sm" onClick={() => setShowAddScene(true)}>
          <Plus size={14} /> Ny scen
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          {subplots.map(subplot => (
            <SubplotRow
              key={subplot.id}
              subplot={subplot}
              scenes={getSubplotScenes(subplot.id)}
            />
          ))}

          {unassignedScenes.length > 0 && (
            <SubplotRow
              subplot={{ id: 'unassigned', title: 'Ej tilldelade scener', color: '#8B7A65' }}
              scenes={unassignedScenes}
            />
          )}

          {subplots.length === 0 && (
            <div className="text-center py-12 text-ink-muted">
              <p className="font-heading text-xl mb-2">Inga subplottar</p>
              <p className="text-sm">Skapa subplottar i panelen till höger för att organisera dina scener.</p>
            </div>
          )}
        </div>

        <div>
          <SubplotManager />
        </div>
      </div>

      <Modal isOpen={showAddScene} onClose={() => setShowAddScene(false)} title="Ny scen" size="lg">
        <SceneForm onClose={() => setShowAddScene(false)} />
      </Modal>
    </div>
  );
}
