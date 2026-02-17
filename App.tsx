
import React, { useState, useEffect } from 'react';
import { DailyData, AppView, CustomItem, VisualTrackerDay } from './types';
import LandingPage from './components/LandingPage';
import DailyPlanner from './components/DailyPlanner';
import MonthlyTracker from './components/MonthlyTracker';
import VisualTracker from './components/VisualTracker';
import CounterPage from './components/CounterPage';
import QuranLog from './components/QuranLog';
import Names99 from './components/Names99';
import SecretDuas from './components/SecretDuas';
import RecommendedDuas from './components/RecommendedDuas';
import RamadanSpecials from './components/RamadanSpecials';
import AlarmPage from './components/AlarmPage';
import ImageEditor from './components/ImageEditor';
import Navigation from './components/Navigation';
import IntroSplash from './components/IntroSplash';
import EidMubarak from './components/EidMubarak';
import { BackgroundStars, Lantern, HangingMoon, StarHanging } from './components/Decorations';

const STORAGE_KEY = 'ramadan_planner_data';
const VISUAL_TRACKER_KEY = 'ramadan_visual_tracker_data';
const TEMPLATE_KEY = 'ramadan_planner_templates';
const QURAN_RECITATION_KEY = 'ramadan_quran_recitation_checklist';
const QURAN_MEMORIZATION_KEY = 'ramadan_quran_memorization_checklist';
const NAMES_99_KEY = 'ramadan_names_99_checklist';
const THEME_KEY = 'ramadan_app_theme';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('intro');
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [allDaysData, setAllDaysData] = useState<Record<number, DailyData>>({});
  const [visualTrackerData, setVisualTrackerData] = useState<Record<number, VisualTrackerDay>>({});
  const [customPrayerTemplate, setCustomPrayerTemplate] = useState<string[]>([]);
  const [customDeedTemplate, setCustomDeedTemplate] = useState<string[]>([]);
  const [quranRecitation, setQuranRecitation] = useState<Record<string, boolean>>({});
  const [quranMemorization, setQuranMemorization] = useState<Record<string, boolean>>({});
  const [names99Checklist, setNames99Checklist] = useState<Record<number, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedVisual = localStorage.getItem(VISUAL_TRACKER_KEY);
    const savedTemplates = localStorage.getItem(TEMPLATE_KEY);
    const savedRecitation = localStorage.getItem(QURAN_RECITATION_KEY);
    const savedMemorization = localStorage.getItem(QURAN_MEMORIZATION_KEY);
    const savedNames = localStorage.getItem(NAMES_99_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (saved) setAllDaysData(JSON.parse(saved));
    if (savedVisual) setVisualTrackerData(JSON.parse(savedVisual));
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setCustomPrayerTemplate(parsed.prayers || []);
        setCustomDeedTemplate(parsed.deeds || []);
      } catch (e) {
        console.error("Template load failed", e);
      }
    }
    if (savedRecitation) setQuranRecitation(JSON.parse(savedRecitation));
    if (savedMemorization) setQuranMemorization(JSON.parse(savedMemorization));
    if (savedNames) setNames99Checklist(JSON.parse(savedNames));
    if (savedTheme !== null) setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem(THEME_KEY, newVal ? 'dark' : 'light');
  };

  const saveData = (day: number, data: DailyData) => {
    const newData = { ...allDaysData, [day]: data };
    setAllDaysData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const saveVisualTrackerData = (day: number, data: VisualTrackerDay) => {
    const newData = { ...visualTrackerData, [day]: data };
    setVisualTrackerData(newData);
    localStorage.setItem(VISUAL_TRACKER_KEY, JSON.stringify(newData));
  };

  const addGlobalCustomItem = (type: 'prayer' | 'deed', name: string) => {
    if (type === 'prayer') {
      if (customPrayerTemplate.includes(name)) return;
      const newList = [...customPrayerTemplate, name];
      setCustomPrayerTemplate(newList);
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify({ prayers: newList, deeds: customDeedTemplate }));
    } else {
      if (customDeedTemplate.includes(name)) return;
      const newList = [...customDeedTemplate, name];
      setCustomDeedTemplate(newList);
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify({ prayers: customPrayerTemplate, deeds: newList }));
    }
  };

  const removeGlobalCustomItem = (type: 'prayer' | 'deed', name: string) => {
    if (type === 'prayer') {
      const newList = customPrayerTemplate.filter(item => item !== name);
      setCustomPrayerTemplate(newList);
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify({ prayers: newList, deeds: customDeedTemplate }));
    } else {
      const newList = customDeedTemplate.filter(item => item !== name);
      setCustomDeedTemplate(newList);
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify({ prayers: customPrayerTemplate, deeds: newList }));
    }
  };

  const saveRecitation = (checklist: Record<string, boolean>) => {
    setQuranRecitation(checklist);
    localStorage.setItem(QURAN_RECITATION_KEY, JSON.stringify(checklist));
  };

  const saveMemorization = (checklist: Record<string, boolean>) => {
    setQuranMemorization(checklist);
    localStorage.setItem(QURAN_MEMORIZATION_KEY, JSON.stringify(checklist));
  };

  const saveNames99 = (checklist: Record<number, boolean>) => {
    setNames99Checklist(checklist);
    localStorage.setItem(NAMES_99_KEY, JSON.stringify(checklist));
  };

  const renderView = () => {
    switch (view) {
      case 'intro': return <IntroSplash onComplete={() => setView('landing')} />;
      case 'landing': return <LandingPage onStart={() => setView('planner')} />;
      case 'planner': return <DailyPlanner day={currentDay} data={allDaysData[currentDay]} customPrayerTemplate={customPrayerTemplate} customDeedTemplate={customDeedTemplate} onSave={(data) => saveData(currentDay, data)} onDayChange={(d) => setCurrentDay(d)} onNavigateHome={() => setView('tracker')} onNavigateEid={() => setView('eid')} onAddGlobalCustom={addGlobalCustomItem} onRemoveGlobalCustom={removeGlobalCustomItem} />;
      case 'tracker': return <MonthlyTracker data={allDaysData} onSelectDay={(d) => { if (d > 30) setView('eid'); else { setCurrentDay(d); setView('planner'); } }} />;
      case 'visual-tracker': return <VisualTracker data={visualTrackerData} onUpdateDay={saveVisualTrackerData} onNavigateToDay={(d) => { setCurrentDay(d); setView('planner'); }} />;
      case 'counter': return <CounterPage />;
      case 'quran-log': return <QuranLog recitation={quranRecitation} memorization={quranMemorization} onUpdateRecitation={saveRecitation} onUpdateMemorization={saveMemorization} />;
      case 'names-99': return <Names99 checklist={names99Checklist} onUpdate={saveNames99} />;
      case 'secret-duas': return <SecretDuas />;
      case 'recommended-duas': return <RecommendedDuas />;
      case 'ramadan-specials': return <RamadanSpecials />;
      case 'alarm': return <AlarmPage />;
      case 'memories': return <ImageEditor />;
      case 'eid': return <EidMubarak onBack={() => setView('tracker')} />;
      default: return <LandingPage onStart={() => setView('planner')} />;
    }
  };

  const isDarkBaseView = view === 'intro' || view === 'eid' || view === 'landing' || isDarkMode;

  return (
    <div className={`min-h-screen flex flex-col max-w-4xl mx-auto shadow-2xl relative overflow-hidden transition-all duration-1000 ${isDarkBaseView ? 'bg-[#0a0a0a]' : 'bg-[#fffcfc]'}`}>
      {view !== 'intro' && <BackgroundStars />}
      
      {(view !== 'intro' && view !== 'landing' && view !== 'eid') && (
        <div className="absolute top-0 left-0 right-0 h-40 flex justify-between px-1 pointer-events-none opacity-25 z-20 overflow-visible">
          <Lantern className="mt-[-105px] scale-[0.3] opacity-20" />
          <StarHanging className="mt-[-80px] scale-[0.5] opacity-15" />
          <HangingMoon className="mt-[-115px] scale-[0.4] opacity-20" />
          <StarHanging className="mt-[-75px] scale-[0.4] opacity-15" />
          <Lantern className="mt-[-95px] scale-[0.25] opacity-15" />
          <StarHanging className="mt-[-90px] scale-[0.5] opacity-15" />
          <HangingMoon className="mt-[-105px] scale-[0.4] opacity-20" />
          <Lantern className="mt-[-85px] scale-[0.3] opacity-20" />
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-32 relative">
        {renderView()}
      </main>

      {view !== 'landing' && view !== 'intro' && view !== 'eid' && (
        <Navigation currentView={view} onViewChange={setView} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      )}
    </div>
  );
};

export default App;
