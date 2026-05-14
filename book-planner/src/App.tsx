import React from 'react';
import { useStore } from './store';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { CharacterList } from './components/characters/CharacterList';
import { PlotTimeline } from './components/plot/PlotTimeline';
import { ChapterBoard } from './components/chapters/ChapterBoard';
import { WorldDashboard } from './components/worldbuilding/WorldDashboard';
import { Settings } from './components/settings/Settings';

function App() {
  const activeView = useStore(s => s.activeView);

  const views: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    characters: <CharacterList />,
    plot: <PlotTimeline />,
    chapters: <ChapterBoard />,
    world: <WorldDashboard />,
    settings: <Settings />,
  };

  return (
    <Layout>
      {views[activeView] ?? <Dashboard />}
    </Layout>
  );
}

export default App;
