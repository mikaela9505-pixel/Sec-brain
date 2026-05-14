import React, { useState, useCallback } from 'react';
import { useStore } from '../../store';
import type { Relation, RelationType } from '../../types';
import { Plus, X } from 'lucide-react';
import { Button } from '../shared/Button';

const relationColors: Record<RelationType, string> = {
  friend: '#8BAE9B',
  enemy: '#E07070',
  romantic: '#E8A0B8',
  family: '#B8975A',
  mentor: '#7B9BC8',
  rival: '#C8977B',
};

const relationLabels: Record<RelationType, string> = {
  friend: 'Vän',
  enemy: 'Fiende',
  romantic: 'Romantisk',
  family: 'Familj',
  mentor: 'Mentor',
  rival: 'Rival',
};

interface NodePos {
  x: number;
  y: number;
}

export function RelationMap() {
  const characters = useStore(s => s.characters);
  const relations = useStore(s => s.relations);
  const addRelation = useStore(s => s.addRelation);
  const updateRelation = useStore(s => s.updateRelation);
  const deleteRelation = useStore(s => s.deleteRelation);

  const CX = 380;
  const CY = 280;
  const RADIUS = 200;

  const defaultPositions = useCallback((): Record<string, NodePos> => {
    const pos: Record<string, NodePos> = {};
    characters.forEach((c, i) => {
      const angle = (i / Math.max(characters.length, 1)) * 2 * Math.PI - Math.PI / 2;
      pos[c.id] = {
        x: CX + RADIUS * Math.cos(angle),
        y: CY + RADIUS * Math.sin(angle),
      };
    });
    return pos;
  }, [characters]);

  const [positions, setPositions] = useState<Record<string, NodePos>>(defaultPositions);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedRelation, setSelectedRelation] = useState<Relation | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [newRel, setNewRel] = useState({ fromId: '', toId: '', type: 'friend' as RelationType, description: '' });

  const getPos = (id: string): NodePos => {
    if (positions[id]) return positions[id];
    const idx = characters.findIndex(c => c.id === id);
    const total = characters.length;
    const angle = (idx / Math.max(total, 1)) * 2 * Math.PI - Math.PI / 2;
    return { x: CX + RADIUS * Math.cos(angle), y: CY + RADIUS * Math.sin(angle) };
  };

  const handleMouseDown = (e: React.MouseEvent, charId: string) => {
    e.preventDefault();
    const pos = getPos(charId);
    setDragging(charId);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPositions(prev => ({
      ...prev,
      [dragging]: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y },
    }));
  };

  const handleMouseUp = () => setDragging(null);

  const handleEdgeClick = (e: React.MouseEvent, rel: Relation) => {
    e.stopPropagation();
    setSelectedRelation(rel);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleAddRelation = () => {
    if (!newRel.fromId || !newRel.toId || newRel.fromId === newRel.toId) return;
    addRelation({ fromId: newRel.fromId, toId: newRel.toId, type: newRel.type, description: newRel.description });
    setShowAddRelation(false);
    setNewRel({ fromId: '', toId: '', type: 'friend', description: '' });
  };

  const roleColors: Record<string, string> = {
    protagonist: '#B8975A',
    supporting: '#8BAE9B',
    antagonist: '#E07070',
    mentioned: '#8B7A65',
  };

  const selectClass = 'px-2 py-1.5 border border-sand rounded-lg text-sm bg-paper text-ink focus:outline-none focus:border-gold w-full';

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted text-sm">
        Inga karaktärer att visa. Skapa karaktärer först.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(relationLabels) as [RelationType, string][]).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: relationColors[type] }} />
              <span className="text-xs text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setShowAddRelation(!showAddRelation)}>
          <Plus size={14} /> Lägg till relation
        </Button>
      </div>

      {showAddRelation && (
        <div className="mb-3 p-4 bg-cream border border-sand rounded-xl">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-ink-muted mb-1 block">Från</label>
              <select value={newRel.fromId} onChange={e => setNewRel(p => ({ ...p, fromId: e.target.value }))} className={selectClass}>
                <option value="">Välj karaktär...</option>
                {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-muted mb-1 block">Till</label>
              <select value={newRel.toId} onChange={e => setNewRel(p => ({ ...p, toId: e.target.value }))} className={selectClass}>
                <option value="">Välj karaktär...</option>
                {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-muted mb-1 block">Typ</label>
              <select value={newRel.type} onChange={e => setNewRel(p => ({ ...p, type: e.target.value as RelationType }))} className={selectClass}>
                {(Object.entries(relationLabels) as [RelationType, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-muted mb-1 block">Beskrivning</label>
              <input
                value={newRel.description}
                onChange={e => setNewRel(p => ({ ...p, description: e.target.value }))}
                placeholder="Valfri beskrivning..."
                className={selectClass}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddRelation}>Spara</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowAddRelation(false)}>Avbryt</Button>
          </div>
        </div>
      )}

      <div
        className="border border-sand rounded-xl overflow-hidden bg-cream select-none"
        style={{ height: 560 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedRelation(null)}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', pointerEvents: 'none', left: 0, top: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#B8975A" />
            </marker>
          </defs>
        </svg>
        <svg
          width="100%"
          height="100%"
          style={{ cursor: dragging ? 'grabbing' : 'default' }}
        >
          {/* Edges */}
          {relations.map(rel => {
            const from = getPos(rel.fromId);
            const to = getPos(rel.toId);
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            const color = relationColors[rel.type] || '#aaa';
            return (
              <g key={rel.id}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={color}
                  strokeWidth={2.5}
                  strokeOpacity={0.7}
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                  onClick={(e) => handleEdgeClick(e as unknown as React.MouseEvent, rel)}
                />
                <circle cx={mx} cy={my} r={8} fill={color} fillOpacity={0.2}
                  style={{ cursor: 'pointer', pointerEvents: 'all' }}
                  onClick={(e) => handleEdgeClick(e as unknown as React.MouseEvent, rel)}
                />
                <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={color} pointerEvents="none">
                  {rel.type.slice(0, 2)}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {characters.map(char => {
            const pos = getPos(char.id);
            const color = roleColors[char.role] || '#B8975A';
            return (
              <g key={char.id} style={{ cursor: 'grab' }} onMouseDown={e => handleMouseDown(e, char.id)}>
                {char.imageBase64 ? (
                  <>
                    <defs>
                      <clipPath id={`clip-${char.id}`}>
                        <circle cx={pos.x} cy={pos.y} r={26} />
                      </clipPath>
                    </defs>
                    <circle cx={pos.x} cy={pos.y} r={28} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
                    <image
                      href={char.imageBase64}
                      x={pos.x - 26} y={pos.y - 26}
                      width={52} height={52}
                      clipPath={`url(#clip-${char.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </>
                ) : (
                  <>
                    <circle cx={pos.x} cy={pos.y} r={28} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={18} fill={color} fontFamily="Cormorant Garamond, serif">
                      {char.name.charAt(0)}
                    </text>
                  </>
                )}
                <text
                  x={pos.x} y={pos.y + 36}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={500}
                  fill="#2C2416"
                  fontFamily="DM Sans, sans-serif"
                >
                  {char.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Relation tooltip */}
        {selectedRelation && (() => {
          const rel = selectedRelation;
          const fromChar = characters.find(c => c.id === rel.fromId);
          const toChar = characters.find(c => c.id === rel.toId);
          return (
            <div
              className="absolute bg-paper border border-sand rounded-xl shadow-xl p-4 z-50 w-64"
              style={{ left: Math.min(tooltipPos.x - 100, window.innerWidth - 300), top: tooltipPos.y - 180 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-ink">{fromChar?.name} → {toChar?.name}</p>
                <button onClick={() => setSelectedRelation(null)} className="text-ink-muted hover:text-ink"><X size={14} /></button>
              </div>
              <select
                value={rel.type}
                onChange={e => updateRelation(rel.id, { type: e.target.value as RelationType })}
                className="w-full px-2 py-1.5 border border-sand rounded-lg text-sm bg-paper mb-2 focus:outline-none focus:border-gold"
              >
                {(Object.entries(relationLabels) as [RelationType, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <input
                value={rel.description ?? ''}
                onChange={e => updateRelation(rel.id, { description: e.target.value })}
                placeholder="Beskrivning..."
                className="w-full px-2 py-1.5 border border-sand rounded-lg text-sm bg-paper mb-3 focus:outline-none focus:border-gold"
              />
              <button
                onClick={() => { deleteRelation(rel.id); setSelectedRelation(null); }}
                className="text-xs text-red-500 hover:underline"
              >
                Ta bort relation
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
