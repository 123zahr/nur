
import React from 'react';
import { AppView } from '../types';

interface Props {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Navigation: React.FC<Props> = ({ currentView, onViewChange, isDarkMode, onToggleTheme }) => {
  const navItems: { id: AppView; icon: string; label: string }[] = [
    { id: 'planner', icon: '📝', label: 'Plan' },
    { id: 'visual-tracker', icon: '🗓️', label: 'Track' },
    { id: 'ramadan-specials', icon: '🌙', label: 'Ramadan' },
    { id: 'recommended-duas', icon: '📜', label: 'Library' },
    { id: 'secret-duas', icon: '🤲', label: 'Duas' },
    { id: 'quran-log', icon: '📖', label: 'Quran' },
    { id: 'alarm', icon: '⏰', label: 'Alarm' },
    { id: 'tracker', icon: '📊', label: 'Stats' },
    { id: 'memories', icon: '📸', label: 'Memory' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto z-50 px-3 md:px-6 pb-6 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] rounded-[2.5rem] flex items-center p-2 pointer-events-auto h-22 ring-1 ring-black/5 overflow-x-auto no-scrollbar">
        
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px] h-full rounded-[2rem] transition-all hover:bg-gray-100/50 group"
          title="Toggle Theme"
        >
          <span className="text-xl md:text-2xl transition-transform duration-500 group-hover:rotate-12">
            {isDarkMode ? '🌞' : '🌚'}
          </span>
          <span className="text-[8px] font-black uppercase text-gray-400 mt-0.5 leading-none">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200/50 mx-1 shrink-0"></div>

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 transition-all relative h-full rounded-[2rem] group min-w-[55px] md:min-w-[65px] px-1 ${
                isActive ? 'bg-pink-50/50 text-pink-600' : 'text-gray-400 grayscale hover:grayscale-0 hover:text-gray-600'
              }`}
            >
              <div className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                <span className={`text-xl md:text-3xl transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-sm' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </span>
                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter transition-all duration-300 leading-none ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>
                  {item.label}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
};

export default Navigation;
