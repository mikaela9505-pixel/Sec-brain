import { Home, Users, GitBranch, BookOpen, Globe, Settings, Feather } from 'lucide-react';
import { useStore } from '../../store';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Översikt', icon: Home },
  { id: 'characters', label: 'Karaktärer', icon: Users },
  { id: 'plot', label: 'Handling', icon: GitBranch },
  { id: 'chapters', label: 'Kapitel', icon: BookOpen },
  { id: 'world', label: 'Världen', icon: Globe },
];

export function Sidebar() {
  const activeView = useStore(s => s.activeView);
  const setActiveView = useStore(s => s.setActiveView);
  const projectTitle = useStore(s => s.project.title);

  return (
    <aside className="w-60 flex-shrink-0 h-screen sticky top-0 bg-paper border-r border-sand flex flex-col">
      <div className="px-5 py-6 border-b border-sand">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <Feather size={16} className="text-paper" />
          </div>
          <div>
            <h1 className="font-heading text-lg text-ink leading-tight">Manuskript</h1>
          </div>
        </div>
        <p className="text-xs text-ink-muted mt-2 pl-10 truncate">{projectTitle}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-cream border-l-2 border-gold rounded-lg"
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                />
              )}
              <Icon
                size={17}
                className={`relative z-10 transition-colors ${isActive ? 'text-gold' : 'text-ink-muted group-hover:text-ink'}`}
              />
              <span className={`relative z-10 text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sand">
        <button
          onClick={() => setActiveView('settings')}
          className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group`}
        >
          {activeView === 'settings' && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-cream border-l-2 border-gold rounded-lg"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />
          )}
          <Settings
            size={17}
            className={`relative z-10 transition-colors ${activeView === 'settings' ? 'text-gold' : 'text-ink-muted group-hover:text-ink'}`}
          />
          <span className={`relative z-10 text-sm font-medium transition-colors ${activeView === 'settings' ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
            Inställningar
          </span>
        </button>
      </div>
    </aside>
  );
}
