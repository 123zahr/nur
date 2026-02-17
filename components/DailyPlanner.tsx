
import React, { useState, useEffect } from 'react';
import { DailyData, PrayerEntry, CustomItem } from '../types';
import { Sparkles } from './Decorations';

interface Props {
  day: number;
  data?: DailyData;
  customPrayerTemplate: string[];
  customDeedTemplate: string[];
  onSave: (data: DailyData) => void;
  onDayChange: (day: number) => void;
  onNavigateHome?: () => void;
  onNavigateEid?: () => void;
  onAddGlobalCustom: (type: 'prayer' | 'deed', name: string) => void;
  onRemoveGlobalCustom: (type: 'prayer' | 'deed', name: string) => void;
}

const SURAHS = [
  "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const PRAYER_SUGGESTIONS = ["Ishraq", "Duha", "Tahiyyatul Masjid", "Tahiyyatul Wudu", "Salatul Hajat", "Salatut Tawbah"];
const DEED_SUGGESTIONS = ["Help Parents", "Feed Needy", "Plant a Tree", "Read Hadith", "Smile at someone", "Forgive someone", "Visit Sick", "Dawah"];

const DEFAULT_DATA = (day: number): DailyData => ({
  date: new Date().toLocaleDateString(),
  fastingDay: day,
  fasting: true,
  quran: {
    recitation: { surah: '', status: '' },
    memorization: { surah: '', status: '' },
  },
  prayers: {
    fajr: { farz: false, sunnat: false, nafil: false },
    zohar: { farz: false, sunnat: false, nafil: false },
    asr: { farz: false, sunnat: false, nafil: false },
    magrib: { farz: false, sunnat: false, nafil: false },
    ishan: { farz: false, sunnat: false, nafil: false },
    tarawih: { farz: false, sunnat: false, nafil: false },
    witr: { farz: false, sunnat: false, nafil: false },
    tahajjud: { farz: false, sunnat: false, nafil: false },
  },
  extraPrayers: [],
  health: {
    water: 0,
    sleep: '',
    skincare: { morning: false, night: false },
    exercise: false,
    selfcare: false,
  },
  goodDeeds: {
    zikr: false,
    names99: false,
    charity: false,
    custom: [],
  },
  goals: Array(5).fill(null).map(() => ({ text: '', achieved: false })),
  gratefulFor: '',
  mood: null,
  notes: '',
});

const SectionCompleteBadge: React.FC<{ show: boolean; colorClass?: string }> = ({ show, colorClass = "bg-amber-400" }) => (
  <div className={`transition-all duration-700 transform flex items-center gap-1 ${show ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-50 pointer-events-none'}`}>
    <div className={`w-2.5 h-2.5 rounded-full ${colorClass} animate-ping shadow-lg ring-2 ring-white/50`}></div>
    <span className={`text-[10px] font-black uppercase tracking-widest ${colorClass.replace('bg-', 'text-')}`}>Complete ✨</span>
  </div>
);

const CompletionSparkleOverlay: React.FC<{ active: boolean }> = ({ active }) => (
  <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 z-50 overflow-hidden rounded-[inherit] ${active ? 'opacity-100' : 'opacity-0'}`}>
    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
    {[...Array(12)].map((_, i) => (
      <div key={i} className="absolute text-yellow-400 animate-sparkle-once" style={{ 
        left: `${Math.random() * 100}%`, 
        top: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 20 + 10}px`,
        animationDelay: `${Math.random() * 0.5}s`
      }}>✧</div>
    ))}
  </div>
);

const DailyPlanner: React.FC<Props> = ({ day, data, customPrayerTemplate, customDeedTemplate, onSave, onDayChange, onNavigateHome, onNavigateEid, onAddGlobalCustom, onRemoveGlobalCustom }) => {
  const [localData, setLocalData] = useState<DailyData>(data || DEFAULT_DATA(day));
  const [customPrayerInput, setCustomPrayerInput] = useState('');
  const [customDeedInput, setCustomDeedInput] = useState('');
  const [celebrated, setCelebrated] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let base = data || DEFAULT_DATA(day);
    
    const mergedExtraPrayers = customPrayerTemplate.map(name => {
      const existing = base.extraPrayers.find(p => p.name === name);
      return existing || { name, completed: false };
    });

    const mergedCustomDeeds = customDeedTemplate.map(name => {
      const existing = base.goodDeeds.custom.find(d => d.name === name);
      return existing || { name, completed: false };
    });

    setLocalData(prev => ({
      ...base,
      extraPrayers: mergedExtraPrayers,
      goodDeeds: {
        ...base.goodDeeds,
        custom: mergedCustomDeeds
      }
    }));
  }, [day, data, customPrayerTemplate, customDeedTemplate]);

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...localData };
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setLocalData(newData);
    onSave(newData);
  };

  const handlePrayerToggle = (prayer: keyof DailyData['prayers'], type: keyof PrayerEntry) => {
    const newVal = !localData.prayers[prayer][type];
    updateField(`prayers.${prayer}.${type}`, newVal);
  };

  const markAllPrayers = () => {
    const newPrayers = { ...localData.prayers };
    Object.keys(newPrayers).forEach(key => {
      newPrayers[key as keyof DailyData['prayers']] = { farz: true, sunnat: true, nafil: true };
    });
    const newExtras = localData.extraPrayers.map(p => ({ ...p, completed: true }));
    const result = { ...localData, prayers: newPrayers, extraPrayers: newExtras };
    setLocalData(result);
    onSave(result);
  };

  const markAllGoodDeeds = () => {
    const newDeeds = { 
      ...localData.goodDeeds, 
      zikr: true, 
      names99: true, 
      charity: true,
      custom: localData.goodDeeds.custom.map(d => ({ ...d, completed: true }))
    };
    const result = { ...localData, goodDeeds: newDeeds };
    setLocalData(result);
    onSave(result);
  };

  const handleAddCustom = (type: 'prayer' | 'deed', name: string) => {
    if (name.trim()) {
      onAddGlobalCustom(type, name.trim());
      if (type === 'prayer') setCustomPrayerInput('');
      else setCustomDeedInput('');
    }
  };

  const getMoodMessage = (mood: 'happy' | 'neutral' | 'sad' | null) => {
    switch (mood) {
      case 'happy': return "Alhamdulillah! Your soul shines bright today. May this joy persist.";
      case 'neutral': return "Peace is found in remembrance. Every step is progress.";
      case 'sad': return "Hardship is followed by ease. Allah is near to the patient heart.";
      default: return "";
    }
  };

  // Completion Check Helpers
  const isQuranComplete = localData.quran.recitation.status === 'Completed' && localData.quran.memorization.status === 'Completed';
  const isWellnessComplete = localData.health.water >= 8 && localData.health.exercise && localData.health.skincare.morning && localData.health.skincare.night;
  const isSalatComplete = (Object.values(localData.prayers) as PrayerEntry[]).every(p => p.farz && p.sunnat && p.nafil) && localData.extraPrayers.every(p => p.completed);
  const isDeedsComplete = localData.goodDeeds.zikr && localData.goodDeeds.names99 && localData.goodDeeds.charity && localData.goodDeeds.custom.every(d => d.completed);
  const isGoalsComplete = localData.goals.every(g => g.text.trim() === '' || g.achieved);

  // Trigger celebration effects
  useEffect(() => {
    if (isQuranComplete && !celebrated.quran) setCelebrated(p => ({ ...p, quran: true }));
    if (isWellnessComplete && !celebrated.wellness) setCelebrated(p => ({ ...p, wellness: true }));
    if (isSalatComplete && !celebrated.salat) setCelebrated(p => ({ ...p, salat: true }));
    if (isDeedsComplete && !celebrated.deeds) setCelebrated(p => ({ ...p, deeds: true }));
  }, [isQuranComplete, isWellnessComplete, isSalatComplete, isDeedsComplete]);

  return (
    <div className="relative p-4 md:p-8 space-y-16 animate-fade-in max-w-5xl mx-auto pb-40 overflow-hidden">
      <Sparkles className="inset-0 opacity-40" />
      
      {/* Header */}
      <header className="relative glass p-10 rounded-[4rem] border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-up z-10">
        <div className="absolute top-0 right-10 text-6xl opacity-10 font-arabic select-none pointer-events-none">رمضان</div>
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <h2 className="text-6xl font-dancing text-pink-600 drop-shadow-sm transition-transform hover:scale-105">Day {day}</h2>
            <button 
              onClick={() => updateField('fasting', !localData.fasting)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 ${localData.fasting ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-400 border border-gray-200 opacity-60'}`}
            >
              {localData.fasting ? '🌙 Fasting' : 'Break'}
            </button>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">A Journey of Faith & Mindfulness</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onDayChange(Math.max(1, day - 1))} className="w-14 h-14 flex items-center justify-center bg-white/80 rounded-3xl hover:bg-pink-50 transition-all border border-pink-100 text-pink-400 shadow-sm active:scale-90 transform-gpu">←</button>
          <button onClick={() => day >= 30 ? onNavigateEid?.() : onDayChange(day + 1)} className="w-14 h-14 flex items-center justify-center bg-pink-500 rounded-3xl hover:bg-pink-600 transition-all shadow-xl text-white active:scale-90 transform-gpu">→</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Quran Section */}
        <section className={`lg:col-span-6 bg-white/80 p-8 md:p-10 rounded-[3rem] shadow-xl border transition-all duration-1000 relative overflow-hidden ${isQuranComplete ? 'border-amber-200 ring-4 ring-amber-50 shadow-amber-100' : 'border-pink-50'} space-y-8 animate-fade-up delay-100`}>
          <CompletionSparkleOverlay active={isQuranComplete} />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-2xl text-2xl transition-transform hover:rotate-12">📖</div>
              <h3 className="font-black text-2xl text-gray-800 tracking-tight">Quran Focus</h3>
            </div>
            <SectionCompleteBadge show={isQuranComplete} colorClass="bg-pink-500" />
          </div>
          <div className="space-y-6 relative z-10">
            {['recitation', 'memorization'].map((type) => (
              <div key={type} className="space-y-3">
                <h4 className="text-[9px] font-black text-pink-300 uppercase tracking-widest flex items-center gap-2">
                  <div className="h-px flex-1 bg-pink-50"></div> {type} <div className="h-px flex-1 bg-pink-50"></div>
                </h4>
                <div className="flex flex-col gap-3">
                  <select 
                    className="w-full p-3.5 rounded-2xl bg-pink-50/50 border-none text-[11px] font-black text-pink-900 cursor-pointer shadow-inner focus:ring-2 focus:ring-pink-100 transition-all hover:bg-pink-100/50 appearance-none text-center uppercase tracking-widest" 
                    value={(localData.quran as any)[type].surah} 
                    onChange={(e) => updateField(`quran.${type}.surah`, e.target.value)}
                  >
                    <option value="">Select Surah</option>
                    {SURAHS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  
                  {/* TWO OPTIONS ONLY as requested in screenshot */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateField(`quran.${type}.status`, 'In Process')}
                      className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                        (localData.quran as any)[type].status === 'In Process' 
                        ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-md scale-105' 
                        : 'bg-white border-pink-50 text-pink-300 hover:border-pink-100'
                      }`}
                    >
                      In Process
                    </button>
                    <button
                      onClick={() => updateField(`quran.${type}.status`, 'Completed')}
                      className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                        (localData.quran as any)[type].status === 'Completed' 
                        ? 'bg-pink-500 border-pink-600 text-white shadow-lg scale-105' 
                        : 'bg-white border-pink-50 text-pink-300 hover:border-pink-100'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wellness Section */}
        <section className={`lg:col-span-6 bg-white/80 p-8 md:p-10 rounded-[3rem] shadow-xl border transition-all duration-1000 relative overflow-hidden ${isWellnessComplete ? 'border-emerald-200 ring-4 ring-emerald-50 shadow-emerald-100' : 'border-blue-50'} space-y-8 animate-fade-up delay-200`}>
          <CompletionSparkleOverlay active={isWellnessComplete} />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl text-2xl transition-transform hover:-rotate-12">🌿</div>
              <h3 className="font-black text-2xl text-gray-800 tracking-tight">Wellness</h3>
            </div>
            <SectionCompleteBadge show={isWellnessComplete} colorClass="bg-emerald-500" />
          </div>
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest pl-2">Hydration Progress</span>
              <div className="flex flex-wrap gap-2.5">
                {[...Array(8)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => updateField('health.water', i + 1)} 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-75 ${localData.health.water > i ? 'bg-blue-500 text-white shadow-md scale-105' : 'bg-white border border-blue-50 text-blue-100 hover:border-blue-200'}`}
                  >
                    {localData.health.water > i ? '💧' : '🥛'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="p-4 rounded-2xl bg-purple-50/50 border-none text-[10px] font-bold text-purple-900 shadow-inner h-[50px] focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-purple-200" placeholder="Sleep (Hours)" value={localData.health.sleep} onChange={(e) => updateField('health.sleep', e.target.value)} />
              
              <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all group h-[50px] active:scale-95 border ${localData.health.exercise ? 'bg-green-100/50 border-green-200 shadow-inner' : 'bg-green-50/30 border-transparent hover:bg-green-100/30'}`}>
                <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Exercise</span>
                <input type="checkbox" checked={localData.health.exercise} onChange={(e) => updateField('health.exercise', e.target.checked)} className="w-6 h-6 rounded-lg accent-green-600 transition-transform active:scale-50 shadow-sm" />
              </label>
              
              <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all group h-[50px] active:scale-95 border ${localData.health.skincare.morning ? 'bg-pink-100/50 border-pink-200 shadow-inner' : 'bg-pink-50/30 border-transparent hover:bg-pink-100/30'}`}>
                <span className="text-[9px] font-black text-pink-700 uppercase tracking-widest">Skincare AM</span>
                <input type="checkbox" checked={localData.health.skincare.morning} onChange={(e) => updateField('health.skincare.morning', e.target.checked)} className="w-6 h-6 rounded-lg accent-pink-600 transition-transform active:scale-50 shadow-sm" />
              </label>
              
              <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all group h-[50px] active:scale-95 border ${localData.health.skincare.night ? 'bg-pink-100/50 border-pink-200 shadow-inner' : 'bg-pink-50/30 border-transparent hover:bg-pink-100/30'}`}>
                <span className="text-[9px] font-black text-pink-700 uppercase tracking-widest">Skincare PM</span>
                <input type="checkbox" checked={localData.health.skincare.night} onChange={(e) => updateField('health.skincare.night', e.target.checked)} className="w-6 h-6 rounded-lg accent-pink-600 transition-transform active:scale-50 shadow-sm" />
              </label>
            </div>
          </div>
        </section>

        {/* Salat Journal - Full Width */}
        <section id="salat-journal" className={`lg:col-span-12 bg-white/95 p-10 rounded-[4rem] shadow-2xl border transition-all duration-1000 relative overflow-hidden ${isSalatComplete ? 'border-pink-200 ring-8 ring-pink-50 shadow-pink-100' : 'border-pink-50'} animate-fade-up delay-300`}>
          <CompletionSparkleOverlay active={isSalatComplete} />
          <div className="flex flex-col items-center mb-12 gap-5 text-center relative z-10">
            <div className="p-5 bg-pink-500 text-white rounded-[2rem] text-4xl shadow-xl shadow-pink-200 animate-pulse">🕌</div>
            <div>
              <div className="flex items-center justify-center gap-3">
                <h3 className="font-black text-3xl text-gray-800 tracking-tight">Salat Journal</h3>
                <SectionCompleteBadge show={isSalatComplete} colorClass="bg-pink-500" />
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Connecting Heart and Soul</p>
            </div>
            <button onClick={markAllPrayers} className="mt-2 text-[9px] font-black uppercase tracking-[0.4em] px-10 py-4 bg-gray-900 text-white rounded-full hover:bg-black shadow-lg transition-all active:scale-90 ring-4 ring-pink-50">
              Divine Completion Mode
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {(Object.keys(localData.prayers) as Array<keyof DailyData['prayers']>).map(p => (
              <div key={p} className={`p-8 rounded-[3rem] border transition-all duration-700 group hover:shadow-xl hover:-translate-y-1 ${Object.values(localData.prayers[p]).every(v => v) ? 'bg-gradient-to-br from-pink-50 to-white border-pink-200' : 'bg-white border-pink-50/20 shadow-sm'}`}>
                <h4 className="font-black text-gray-800 capitalize text-center text-xl tracking-tight mb-6">{p === 'ishan' ? 'Isha' : p}</h4>
                <div className="flex justify-around items-center">
                  {(['farz', 'sunnat', 'nafil'] as const).map(type => (
                    <button 
                      key={type} 
                      onClick={() => handlePrayerToggle(p, type)} 
                      className="flex flex-col items-center gap-3 active:scale-75 transition-transform"
                    >
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-500 ${localData.prayers[p][type] ? 'bg-pink-500 border-pink-500 text-white shadow-md rotate-6' : 'border-gray-100 bg-white shadow-inner group-hover:border-pink-100'}`}>
                        {localData.prayers[p][type] && <span className="text-lg">✓</span>}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${localData.prayers[p][type] ? 'text-pink-600' : 'text-gray-300 group-hover:text-pink-400'}`}>{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {localData.extraPrayers.map((extra, idx) => (
              <div key={`extra-${idx}`} className={`p-8 rounded-[3rem] border flex flex-col items-center gap-5 shadow-sm hover:shadow-xl transition-all duration-700 animate-fade-in relative group/extra hover:-translate-y-1 ${extra.completed ? 'bg-gradient-to-br from-amber-50 to-white border-amber-200' : 'bg-white border-pink-50/20'}`}>
                <button 
                  onClick={() => onRemoveGlobalCustom('prayer', extra.name)}
                  className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center bg-red-50 text-red-400 rounded-full opacity-0 group-hover/extra:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >×</button>
                <h4 className="font-black text-amber-900 capitalize text-center truncate w-full text-lg">{extra.name}</h4>
                <button 
                  onClick={() => {
                    const newList = [...localData.extraPrayers];
                    newList[idx].completed = !newList[idx].completed;
                    updateField('extraPrayers', newList);
                  }} 
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-500 active:scale-75 ${extra.completed ? 'bg-amber-500 border-amber-500 text-white shadow-md rotate-12 scale-105' : 'border-amber-100 bg-white shadow-inner'}`}
                >
                  {extra.completed && <span className="text-2xl">✓</span>}
                </button>
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em]">Special</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-[3rem] bg-gray-50/30 border-2 border-dashed border-gray-200/50 relative z-10">
             <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center md:text-left">Personalize your Sanctuary</p>
                   <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                      {PRAYER_SUGGESTIONS.map(s => (
                        <button 
                          key={s} 
                          onClick={() => handleAddCustom('prayer', s)}
                          className="px-4 py-2 bg-white rounded-xl text-[9px] font-black text-amber-600 border border-amber-100 shadow-sm hover:bg-amber-50 transition-all active:scale-90"
                        >+ {s}</button>
                      ))}
                   </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                   <input 
                     type="text" 
                     placeholder="Custom prayer..."
                     value={customPrayerInput}
                     onChange={(e) => setCustomPrayerInput(e.target.value)}
                     className="bg-white border-none rounded-2xl p-4 text-[11px] font-bold focus:ring-2 focus:ring-amber-100 shadow-inner flex-1 md:w-56 transition-all"
                   />
                   <button 
                     onClick={() => handleAddCustom('prayer', customPrayerInput)}
                     className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-lg hover:scale-105 active:scale-90 transition-all"
                   >+</button>
                </div>
             </div>
          </div>
        </section>

        {/* Good Deeds Section */}
        <section id="good-deeds" className={`lg:col-span-12 bg-white/95 p-10 rounded-[4rem] shadow-2xl border transition-all duration-1000 relative overflow-hidden ${isDeedsComplete ? 'border-emerald-200 ring-8 ring-emerald-50 shadow-emerald-100' : 'border-emerald-50'} animate-fade-up delay-400`}>
          <CompletionSparkleOverlay active={isDeedsComplete} />
          <div className="flex flex-col items-center mb-10 gap-4 text-center relative z-10">
            <div className="p-5 bg-emerald-500 text-white rounded-[2rem] text-4xl shadow-xl shadow-emerald-100 animate-bounce">✨</div>
            <div className="flex items-center justify-center gap-3">
              <h3 className="font-black text-3xl text-gray-800 tracking-tight">Virtuous Acts</h3>
              <SectionCompleteBadge show={isDeedsComplete} colorClass="bg-emerald-500" />
            </div>
            <button onClick={markAllGoodDeeds} className="mt-2 text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-10 py-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border border-emerald-100">Luminous Legacy Mode</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {['zikr', 'names99', 'charity'].map(key => (
              <label key={key} className={`flex items-center justify-between p-7 rounded-[2.5rem] border transition-all cursor-pointer shadow-sm group active:scale-[0.98] ${localData.goodDeeds[key as keyof typeof localData.goodDeeds] ? 'bg-emerald-100/50 border-emerald-200 text-emerald-900 shadow-inner' : 'bg-white border-gray-50 hover:border-emerald-200'}`}>
                <span className="capitalize font-black text-sm tracking-tight">{key === 'names99' ? '99 Names' : key}</span>
                <input type="checkbox" checked={!!(localData.goodDeeds as any)[key]} onChange={(e) => updateField(`goodDeeds.${key}`, e.target.checked)} className="w-7 h-7 rounded-xl accent-emerald-600 group-active:scale-50 transition-transform shadow-md" />
              </label>
            ))}
            
            {localData.goodDeeds.custom.map((deed, idx) => (
              <label key={`deed-${idx}`} className={`flex items-center justify-between p-7 rounded-[2.5rem] border transition-all cursor-pointer shadow-sm group animate-fade-in relative active:scale-[0.98] ${deed.completed ? 'bg-emerald-100/50 border-emerald-200 text-emerald-900 shadow-inner' : 'bg-white border-gray-50 hover:border-emerald-200'}`}>
                <button 
                   onClick={(e) => { e.preventDefault(); onRemoveGlobalCustom('deed', deed.name); }}
                   className="absolute -top-2 -right-2 w-8 h-8 bg-red-50 text-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-md"
                >×</button>
                <span className="font-black text-sm tracking-tight truncate max-w-[120px]">{deed.name}</span>
                <input type="checkbox" checked={deed.completed} onChange={(e) => {
                  const newList = [...localData.goodDeeds.custom];
                  newList[idx].completed = e.target.checked;
                  updateField('goodDeeds.custom', newList);
                }} className="w-7 h-7 rounded-xl accent-emerald-600 group-active:scale-50 transition-transform shadow-md" />
              </label>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-[3rem] bg-gray-50/30 border-2 border-dashed border-gray-200/50 relative z-10">
             <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center md:text-left">Elevate your Spiritual Portfolio</p>
                   <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                      {DEED_SUGGESTIONS.map(s => (
                        <button 
                          key={s} 
                          onClick={() => handleAddCustom('deed', s)}
                          className="px-4 py-2 bg-white rounded-xl text-[9px] font-black text-emerald-600 border border-amber-100 shadow-sm hover:bg-emerald-50 transition-all active:scale-90"
                        >+ {s}</button>
                      ))}
                   </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                   <input 
                     type="text" 
                     placeholder="New custom deed..."
                     value={customDeedInput}
                     onChange={(e) => setCustomDeedInput(e.target.value)}
                     className="bg-white border-none rounded-2xl p-4 text-[11px] font-bold focus:ring-2 focus:ring-emerald-100 shadow-inner flex-1 md:w-56 transition-all"
                   />
                   <button 
                     onClick={() => handleAddCustom('deed', customDeedInput)}
                     className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-lg hover:scale-105 active:scale-90 transition-all"
                   >+</button>
                </div>
             </div>
          </div>
        </section>

        {/* Daily Intentions (Goals) */}
        <section id="daily-goals" className={`lg:col-span-12 bg-white/95 p-10 rounded-[4rem] shadow-2xl border transition-all duration-1000 relative overflow-hidden ${isGoalsComplete ? 'border-indigo-200 ring-8 ring-indigo-50 shadow-indigo-100' : 'border-indigo-50'} animate-fade-up delay-500`}>
          <CompletionSparkleOverlay active={isGoalsComplete} />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-5 bg-indigo-500 text-white rounded-[1.8rem] text-3xl shadow-lg shadow-indigo-100">🎯</div>
              <div>
                <h3 className="font-black text-3xl text-gray-800 tracking-tight">Daily Intentions</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Precision & Focus</p>
              </div>
            </div>
            <SectionCompleteBadge show={isGoalsComplete} colorClass="bg-indigo-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {localData.goals.map((goal, idx) => (
              <div key={idx} className={`flex items-center gap-5 p-7 rounded-[2.5rem] border transition-all duration-500 relative group/goal ${goal.achieved ? 'bg-indigo-50/50 border-indigo-100 shadow-inner' : 'bg-white border-gray-50 hover:border-indigo-100 shadow-md'}`}>
                <div className="relative">
                  <button 
                    onClick={() => {
                      const newGoals = [...localData.goals];
                      newGoals[idx].achieved = !newGoals[idx].achieved;
                      updateField('goals', newGoals);
                    }}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-500 active:scale-50 relative z-10 ${goal.achieved ? 'bg-green-500 border-green-500 text-white shadow-md animate-goal-pop scale-105' : 'border-gray-50 bg-gray-50 shadow-inner'}`}
                  >✓</button>
                </div>
                <input 
                  type="text" 
                  value={goal.text} 
                  onChange={(e) => {
                    const newGoals = [...localData.goals];
                    newGoals[idx].text = e.target.value;
                    updateField('goals', newGoals);
                  }}
                  placeholder={`Write intention ${idx + 1}...`}
                  className={`bg-transparent border-none focus:ring-0 font-black flex-1 text-base transition-all ${goal.achieved ? 'text-green-800 line-through opacity-50' : 'text-gray-700 placeholder:text-gray-200'}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Gratitude & Emotional Reflection */}
        <section className="lg:col-span-12 space-y-12 animate-fade-up delay-600">
          <div className="bg-white/95 p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-amber-50 space-y-12 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 text-9xl opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">✨</div>
             <h3 className="text-4xl md:text-5xl font-dancing text-amber-900 italic tracking-wide text-center md:text-left">Alhamdulillah, I am grateful for...</h3>
             <textarea 
               className="w-full bg-amber-50/10 p-10 rounded-[3rem] md:rounded-[4rem] h-60 border-none focus:ring-4 focus:ring-amber-50 font-black text-amber-900 text-2xl leading-relaxed placeholder:text-amber-100 shadow-inner transition-all scrollbar-hide" 
               placeholder="Whisper your gratitude into these lines..." 
               value={localData.gratefulFor} 
               onChange={(e) => updateField('gratefulFor', e.target.value)} 
             />
             <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-4">
                <div className="flex flex-col items-center md:items-start gap-8 w-full md:w-auto">
                   <span className="text-[10px] font-black text-amber-800 uppercase tracking-[0.5em] text-center md:text-left">State of the Heart</span>
                   <div className="flex justify-center md:justify-start gap-8 md:gap-14 w-full">
                     {[
                       { id: 'happy', icon: '😊', label: 'Radiant' },
                       { id: 'neutral', icon: '😐', label: 'Steady' },
                       { id: 'sad', icon: '😔', label: 'Patient' }
                     ].map(m => (
                       <button 
                         key={m.id} 
                         onClick={() => updateField('mood', m.id)} 
                         className={`flex flex-col items-center gap-4 transition-all duration-700 group/mood active:scale-90 ${localData.mood === m.id ? 'scale-125 drop-shadow-xl' : 'opacity-20 grayscale hover:opacity-50 hover:grayscale-0'}`}
                       >
                         <span className="text-6xl md:text-8xl drop-shadow-sm group-hover/mood:scale-110 transition-transform">{m.icon}</span>
                         <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-500 text-center ${localData.mood === m.id ? 'opacity-100 text-amber-600' : 'opacity-0'}`}>{m.label}</span>
                       </button>
                     ))}
                   </div>
                </div>
                {localData.mood && (
                  <div className="p-10 md:p-14 bg-gradient-to-br from-amber-50/50 to-white rounded-[3.5rem] border-2 border-amber-100/50 text-amber-900 font-black italic text-xl shadow-xl max-w-lg text-center md:text-left animate-fade-in leading-relaxed">
                    "{getMoodMessage(localData.mood)}"
                  </div>
                )}
             </div>
          </div>
          
          <div className="bg-white/95 p-12 md:p-16 rounded-[4rem] md:rounded-[5rem] shadow-xl border border-gray-100 space-y-8 group/ref">
             <h3 className="font-black text-3xl text-gray-800 flex items-center justify-center md:justify-start gap-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover/ref:rotate-6 transition-transform">📝</div> 
                Final Reflections
             </h3>
             <textarea className="w-full p-10 rounded-[3rem] md:rounded-[4rem] h-72 border-none bg-gray-50/50 font-black text-gray-700 focus:ring-4 focus:ring-gray-100 shadow-inner text-xl leading-relaxed transition-all placeholder:text-gray-200 scrollbar-hide" placeholder="Pen down your thoughts for tomorrow's journey..." value={localData.notes} onChange={(e) => updateField('notes', e.target.value)} />
          </div>
        </section>
      </div>

      {/* Lock Button */}
      <div className="flex justify-center pt-20 animate-fade-up delay-700 relative z-10">
        <button onClick={() => onNavigateHome?.()} className="group relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-black py-8 px-24 md:px-40 rounded-full shadow-2xl hover:shadow-pink-300 transform hover:-translate-y-2 active:scale-95 transition-all duration-700 text-xl md:text-2xl tracking-[0.3em] uppercase border-b-[8px] border-pink-800 overflow-hidden ring-4 ring-white/20">
          <span className="relative z-10 flex items-center gap-6">
             Lock Day Journal <span className="text-3xl md:text-4xl animate-pulse">✨</span>
          </span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
        </button>
      </div>

      <style>{`
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        
        @keyframes goalPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.05); }
        }
        .animate-goal-pop {
          animation: goalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes sparkle-once {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .animate-sparkle-once {
          animation: sparkle-once 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default DailyPlanner;
