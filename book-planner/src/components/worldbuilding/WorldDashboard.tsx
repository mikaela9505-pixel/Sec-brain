import { useState } from 'react';
import { PlaceList } from './PlaceList';
import { EventLog } from './EventLog';

export function WorldDashboard() {
  const [activeTab, setActiveTab] = useState<'places' | 'events'>('places');

  return (
    <div className="p-8">
      <div className="flex gap-1 mb-6 bg-cream rounded-xl p-1 w-fit">
        {[
          { id: 'places', label: 'Platser' },
          { id: 'events', label: 'Händelselogg' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'places' | 'events')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-paper shadow-sm text-ink border border-sand'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'places' && <PlaceList />}
      {activeTab === 'events' && <EventLog />}
    </div>
  );
}
