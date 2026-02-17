
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Static data
const RINGTONES = [
  { id: 'spiritual-flute', name: 'Divine Flute', icon: '🎶' },
  { id: 'soft-morning', name: 'Dawn Mist', icon: '🌅' },
  { id: 'birds-chirping', name: 'Nature Song', icon: '🐦' },
  { id: 'zen-bell', name: 'Sacred Bell', icon: '🔔' },
];

const PERIODS = ['AM', 'PM'];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const PRAYER_PRESETS = [
  { name: 'Fajr', time: '05:15', icon: '🌅' },
  { name: 'Dhuhr', time: '12:30', icon: '☀️' },
  { name: 'Asr', time: '15:45', icon: '🌤️' },
  { name: 'Maghrib', time: '18:15', icon: '🌙' },
  { name: 'Isha', time: '19:45', icon: '🌌' },
];

const STORAGE_KEY = 'ramadan_prayer_alarms_v12';
const CUSTOM_RINGTONES_KEY = 'ramadan_custom_ringtones_v1';
const ITEM_HEIGHT = 72;

class RingtonePlayer {
  ctx: AudioContext | null = null;
  gain: GainNode | null = null;
  isPlaying = false;
  currentAudio: HTMLAudioElement | null = null;

  async init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      this.gain = this.ctx.createGain();
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.gain!.gain.value = 0.3;
  }

  async play(id: string, customData?: string) {
    this.stop();
    await this.init();
    this.isPlaying = true;

    if (customData) {
      this.currentAudio = new Audio(customData);
      this.currentAudio.loop = true;
      this.currentAudio.play().catch(e => console.error("Audio play failed", e));
      return;
    }

    const sequence = this.getSequence(id);
    let index = 0;

    const playNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gain) return;
      const { freq, duration } = sequence[index];
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = id === 'soft-morning' ? 'sine' : 'triangle';
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.2, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.connect(g);
      g.connect(this.gain);
      o.start(now);
      o.stop(now + duration);
      index = (index + 1) % sequence.length;
      if (this.isPlaying) {
        setTimeout(playNote, duration * 1000 * 0.8);
      }
    };
    playNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (this.gain && this.ctx) {
      this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  private getSequence(type: string) {
    const notes = { C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.00, A: 440.00, B: 493.88, C2: 523.25 };
    switch (type) {
      case 'spiritual-flute': return [{ freq: notes.E, duration: 0.6 }, { freq: notes.G, duration: 0.6 }, { freq: notes.A, duration: 0.6 }, { freq: notes.E, duration: 1.2 }];
      case 'soft-morning': return [{ freq: notes.C, duration: 0.8 }, { freq: notes.E, duration: 0.8 }, { freq: notes.G, duration: 0.8 }, { freq: notes.B, duration: 1.5 }];
      case 'zen-bell': return [{ freq: notes.G, duration: 2.0 }, { freq: notes.C2, duration: 3.0 }];
      default: return [{ freq: notes.C, duration: 0.4 }, { freq: notes.E, duration: 0.4 }, { freq: notes.G, duration: 0.4 }, { freq: notes.C2, duration: 0.8 }];
    }
  }
}

const ringtonePlayer = new RingtonePlayer();

interface CustomRingtone { id: string; name: string; data: string; }
interface Alarm { id: string; name: string; time: string; enabled: boolean; icon: string; ringtone: string; vibrate: boolean; deleteAfter?: boolean; repeatDaily?: boolean; }

const ScrollPicker: React.FC<{ items: string[]; selected: string; onChange: (val: string) => void; width?: string; }> = ({ items, selected, onChange, width = "w-24" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const isInternalScroll = useRef(false);
  const debounceTimer = useRef<number | null>(null);

  // Sync scroll position when prop changes externally (e.g. initial load or reset)
  useEffect(() => {
    if (scrollRef.current && !isInternalScroll.current) {
      const index = items.indexOf(selected);
      if (index !== -1) {
        scrollRef.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'auto' });
        setScrollTop(index * ITEM_HEIGHT);
      }
    }
  }, [selected, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setScrollTop(top);
    
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      const index = Math.round(top / ITEM_HEIGHT);
      if (items[index] && items[index] !== selected) {
        isInternalScroll.current = true;
        onChange(items[index]);
        // Short timeout to release the lock after state has likely updated
        setTimeout(() => { isInternalScroll.current = false; }, 100);
      }
    }, 60);
  };

  return (
    <div className={`${width} h-[216px] overflow-y-auto no-scrollbar snap-y snap-mandatory relative transform-style-3d bg-transparent select-none`} ref={scrollRef} onScroll={handleScroll}>
      <div style={{ height: `${ITEM_HEIGHT}px` }} className="pointer-events-none" />
      {items.map((item, i) => {
        const itemCenter = i * ITEM_HEIGHT;
        const dist = Math.abs(itemCenter - scrollTop);
        const norm = Math.min(dist / (ITEM_HEIGHT * 2.5), 1);
        return (
          <div key={item} className="h-[72px] flex items-center justify-center snap-center transition-all duration-75 will-change-transform"
            style={{ 
              transform: `perspective(1000px) rotateX(${(itemCenter - scrollTop) / ITEM_HEIGHT * -45}deg) scale(${1.4 - norm * 0.55}) translateZ(${40 * (1 - norm)}px)`,
              opacity: 1 - norm * 0.85,
              color: selected === item ? '#fff' : 'rgba(255,255,255,0.2)',
              fontWeight: selected === item ? '900' : '400',
              textShadow: selected === item ? '0 0 30px rgba(255,255,255,0.4)' : 'none'
            }}>
            <span className="text-4xl md:text-5xl lg:text-6xl font-mono tracking-tighter">{item}</span>
          </div>
        );
      })}
      <div style={{ height: `${ITEM_HEIGHT}px` }} className="pointer-events-none" />
    </div>
  );
};

const AlarmPage: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [customRingtones, setCustomRingtones] = useState<CustomRingtone[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selHour, setSelHour] = useState('05');
  const [selMin, setSelMin] = useState('30');
  const [selPeriod, setSelPeriod] = useState<'AM' | 'PM'>('AM');
  const [newName, setNewName] = useState('');
  const [vibrate, setVibrate] = useState(true);
  const [deleteAfter, setDeleteAfter] = useState(false);
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [selRingtone, setSelRingtone] = useState('spiritual-flute');
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence and Default Alarms Initialization
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedCustom = localStorage.getItem(CUSTOM_RINGTONES_KEY);
    
    if (saved) {
      setAlarms(JSON.parse(saved));
    } else {
      // First-time load: Automatically add the 5 daily prayer alarms
      const initialAlarms = PRAYER_PRESETS.map((p, i) => ({
        id: `init-preset-${p.name.toLowerCase()}-${Date.now() + i}`,
        name: p.name,
        time: p.time,
        enabled: true,
        icon: p.icon,
        ringtone: 'spiritual-flute',
        vibrate: true,
        repeatDaily: true
      }));
      setAlarms(initialAlarms);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAlarms));
    }
    
    if (savedCustom) setCustomRingtones(JSON.parse(savedCustom));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      if (!activeAlarm && now.getSeconds() === 0) {
        const triggered = alarms.find(a => a.enabled && a.time === timeStr);
        if (triggered) {
          setActiveAlarm(triggered);
          const custom = customRingtones.find(r => r.id === triggered.ringtone);
          ringtonePlayer.play(triggered.ringtone, custom?.data);
          
          if (triggered.vibrate && navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 500]);
          }

          if (triggered.deleteAfter) {
             const updated = alarms.filter(a => a.id !== triggered.id);
             setAlarms(updated);
             localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } else if (!triggered.repeatDaily) {
             const updated = alarms.map(a => a.id === triggered.id ? { ...a, enabled: false } : a);
             setAlarms(updated);
             localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms, activeAlarm, customRingtones]);

  const saveAlarms = (updated: Alarm[]) => {
    setAlarms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
    saveAlarms(updated);
  };

  const addAllPrayerPresets = () => {
    const existingNames = new Set(alarms.map(a => a.name));
    const newAlarms = PRAYER_PRESETS
      .filter(p => !existingNames.has(p.name))
      .map((p, i) => ({
        id: `preset-${p.name.toLowerCase()}-${Date.now() + i}`,
        name: p.name,
        time: p.time,
        enabled: true,
        icon: p.icon,
        vibrate: true,
        ringtone: 'spiritual-flute',
        repeatDaily: true
      }));
    if (newAlarms.length > 0) {
      saveAlarms([...alarms, ...newAlarms]);
    }
  };

  const handleSave = () => {
    let h24 = parseInt(selHour);
    if (selPeriod === 'PM' && h24 !== 12) h24 += 12;
    if (selPeriod === 'AM' && h24 === 12) h24 = 0;
    const timeStr = `${String(h24).padStart(2, '0')}:${selMin}`;

    const ringtoneIcon = RINGTONES.find(r => r.id === selRingtone)?.icon || '🔊';

    if (editingId) {
      const updated = alarms.map(a => a.id === editingId ? { 
        ...a, 
        time: timeStr, 
        name: newName, 
        ringtone: selRingtone, 
        vibrate,
        deleteAfter,
        repeatDaily,
        icon: ringtoneIcon
      } : a);
      saveAlarms(updated);
    } else {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        name: newName || 'Reminder',
        time: timeStr,
        enabled: true,
        icon: ringtoneIcon,
        ringtone: selRingtone,
        vibrate,
        deleteAfter,
        repeatDaily
      };
      saveAlarms([...alarms, newAlarm]);
    }
    setIsAdding(false);
    setEditingId(null);
    ringtonePlayer.stop();
  };

  const openEdit = (alarm: Alarm) => {
    const [h24, m] = alarm.time.split(':');
    const hNum = parseInt(h24);
    const period = hNum >= 12 ? 'PM' : 'AM';
    const h12 = hNum % 12 || 12;
    
    setEditingId(alarm.id);
    setSelHour(String(h12).padStart(2, '0'));
    setSelMin(m);
    setSelPeriod(period);
    setNewName(alarm.name);
    setVibrate(alarm.vibrate ?? true);
    setDeleteAfter(alarm.deleteAfter ?? false);
    setRepeatDaily(alarm.repeatDaily ?? true);
    setSelRingtone(alarm.ringtone);
    setIsAdding(true);
    ringtonePlayer.init();
  };

  const timeUntilText = useMemo(() => {
    let h24 = parseInt(selHour);
    if (selPeriod === 'PM' && h24 !== 12) h24 += 12;
    if (selPeriod === 'AM' && h24 === 12) h24 = 0;
    
    const now = new Date();
    const target = new Date();
    target.setHours(h24, parseInt(selMin), 0, 0);
    
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const diffMs = target.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `Alarm in ${diffHrs}h ${diffMins}m`;
  }, [selHour, selMin, selPeriod, currentTime]);

  return (
    <div className="flex flex-col items-center min-h-screen w-full mx-auto bg-[#fffcfc] overflow-x-hidden">
      
      {/* Ringing Modal */}
      {activeAlarm && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="w-full max-w-sm bg-white rounded-[4rem] p-10 md:p-12 text-center shadow-2xl border border-white/50 space-y-8 relative overflow-hidden flex flex-col items-center">
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-pink-500 animate-pulse"></div>
             <div className="text-8xl md:text-9xl drop-shadow-2xl animate-bounce mb-2">{activeAlarm.icon}</div>
             <div className="space-y-2">
                <h3 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight font-playfair">{activeAlarm.name}</h3>
                <p className="text-pink-500 font-bold uppercase tracking-[0.2em] text-[10px] opacity-70">Divine Wakeup • {activeAlarm.time}</p>
             </div>
             <button 
                onClick={() => { setActiveAlarm(null); ringtonePlayer.stop(); }}
                className="w-full py-5 bg-pink-500 text-white font-black uppercase tracking-[0.2em] rounded-full shadow-lg active:scale-95 transition-all text-xs"
              >
                Dismiss with Gratitude
              </button>
           </div>
        </div>
      )}

      {/* Main Sanctuary Area */}
      <div className="w-full max-w-5xl px-4 md:px-8 lg:px-12 pt-24 pb-48 space-y-12 flex flex-col items-center">
        
        {/* Page Header */}
        <div className="w-full flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[10px] md:text-[13px] font-black text-gray-400 uppercase tracking-[0.5em]">Divine Timing</h2>
            <p className="text-[9px] md:text-[11px] text-pink-400 font-bold tracking-widest font-dancing">Mindful Alarms</p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-lg border border-gray-100 text-pink-300 transform rotate-12">
            <span className="text-xl md:text-2xl">🌙</span>
          </div>
        </div>

        {/* Global Clock Card */}
        <div className="text-center space-y-6 bg-white/70 backdrop-blur-3xl p-10 md:p-16 lg:p-20 rounded-[3rem] md:rounded-[6rem] border border-white shadow-xl relative z-10 w-full max-w-3xl flex flex-col items-center group overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] px-8 md:px-12 py-2 md:py-3 rounded-b-[2rem] shadow-xl z-20">Present Moment</div>
          <h2 className="font-black text-gray-800 tracking-tighter drop-shadow-sm font-mono leading-none"
              style={{ fontSize: 'clamp(3rem, 15vw, 10rem)' }}>
            {currentTime}
          </h2>
          <div className="h-1 w-24 md:w-32 bg-pink-100/50 mx-auto rounded-full group-hover:w-48 transition-all duration-1000"></div>
        </div>

        {/* Configurations List */}
        <div className="w-full space-y-10 relative z-10">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <h3 className="text-[11px] md:text-[14px] font-black text-gray-500 uppercase tracking-[0.4em]">Configs</h3>
                <p className="text-[9px] text-gray-400 font-bold tracking-widest">Peace in Discipline</p>
             </div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={addAllPrayerPresets}
                 className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white text-pink-600 rounded-2xl font-black uppercase tracking-widest text-[9px] border border-pink-100 shadow-sm hover:bg-pink-50 active:scale-95 transition-all"
               >
                 <span>Add Prayers</span>
                 <span className="text-sm">🕌</span>
               </button>
               <button 
                 onClick={() => { setIsAdding(true); setEditingId(null); setNewName(''); setSelRingtone('spiritual-flute'); setVibrate(true); setDeleteAfter(false); setRepeatDaily(true); ringtonePlayer.init(); }}
                 className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] bg-pink-500 text-white flex items-center justify-center text-3xl md:text-4xl shadow-xl hover:scale-105 active:scale-95 transition-all ring-4 md:ring-8 ring-pink-50"
               >+</button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10">
            {alarms.map((alarm) => (
              <div 
                key={alarm.id} 
                onClick={() => openEdit(alarm)}
                className={`p-8 md:p-10 lg:p-12 rounded-[2.5rem] md:rounded-[5rem] border transition-all duration-500 group relative shadow-lg cursor-pointer flex flex-col overflow-hidden ${
                  alarm.enabled 
                    ? 'bg-white border-pink-100/50 ring-2 ring-pink-50/20 shadow-pink-50' 
                    : 'bg-gray-50 border-transparent grayscale opacity-50'
                }`}
              >
                <div className="relative z-10 flex flex-col flex-1 space-y-8">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`w-14 h-14 md:w-18 md:h-18 bg-white rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-5xl shadow-md border border-gray-50 group-hover:rotate-6 transition-transform ${!alarm.enabled && 'opacity-40'}`}>
                      {alarm.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-black text-xl md:text-2xl lg:text-3xl tracking-tight font-playfair transition-colors truncate ${alarm.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                          {alarm.name}
                      </h3>
                    </div>
                  </div>

                  <div className={`flex flex-col items-center justify-center py-6 md:py-12 lg:py-16 rounded-3xl md:rounded-[4.5rem] relative overflow-hidden transition-all border shadow-inner ${
                    alarm.enabled ? 'bg-white border-pink-50/50' : 'bg-gray-100 border-gray-100/30'
                  }`}>
                    <span className={`font-black drop-shadow-sm font-mono leading-none tracking-tighter transition-all ${
                      alarm.enabled ? 'text-pink-600' : 'text-gray-300'
                    }`} style={{ fontSize: 'clamp(4rem, 10vw, 8.5rem)' }}>
                      {alarm.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleAlarm(alarm.id); }}
                      className={`w-14 h-7 md:w-16 md:h-10 rounded-full relative transition-all p-1 ${
                        alarm.enabled ? 'bg-pink-500 shadow-lg shadow-pink-100' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 md:w-8 md:h-8 bg-white rounded-full transition-transform transform shadow-md ${
                        alarm.enabled ? 'translate-x-7 md:translate-x-7' : 'translate-x-0'
                      }`}></div>
                    </button>
                    <div className={`flex items-center gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-3 rounded-full border shadow-sm transition-all ${
                      alarm.enabled ? 'bg-white border-pink-100 text-pink-500 font-black' : 'bg-white/30 border-gray-100 text-gray-300'
                    }`}>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-80 truncate max-w-[100px]">
                          {RINGTONES.find(r => r.id === alarm.ringtone)?.name || 'Divine'}
                      </span>
                      <span className="text-lg md:text-xl">🔊</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.5em] text-center max-w-lg leading-loose opacity-50 bg-white/10 backdrop-blur-md px-10 md:px-16 py-8 md:py-12 rounded-[3rem] md:rounded-[5rem] border border-white/20 shadow-sm relative z-10 mx-4">
          "Verily, in the remembrance of Allah do hearts find rest." <br/>
          <span className="text-pink-400 mt-4 block font-dancing text-2xl md:text-3xl italic lowercase tracking-normal opacity-80">Divine Rest</span>
        </div>
      </div>

      {/* Edit Alarm Modal - Rebuilt for scaling */}
      {isAdding && (
        <div className="fixed inset-0 z-[5000] bg-black animate-in fade-in duration-300 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] bg-black md:rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-black sticky top-0 z-50">
              <button 
                onClick={() => { setIsAdding(false); ringtonePlayer.stop(); }} 
                className="text-white text-3xl p-2 hover:opacity-60 transition-opacity"
              >✕</button>
              <div className="text-center flex-1">
                 <h2 className="text-white text-xl font-medium tracking-tight">Edit alarm</h2>
                 <p className="text-white/40 text-[12px] font-medium tracking-wide">{timeUntilText}</p>
              </div>
              <button 
                onClick={handleSave} 
                className="text-white text-3xl p-2 hover:opacity-60 transition-opacity"
              >✓</button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
              <div className="flex flex-col items-center justify-center relative py-12 px-6">
                <div className="absolute inset-x-0 h-[72px] top-1/2 -translate-y-1/2 bg-white/5 pointer-events-none z-10" />
                <div className="flex items-center justify-center gap-4 relative z-20 w-full overflow-hidden">
                   <ScrollPicker items={PERIODS} selected={selPeriod} onChange={(v) => setSelPeriod(v as any)} width="w-20 md:w-28" />
                   <ScrollPicker items={HOURS} selected={selHour} onChange={setSelHour} width="w-20 md:w-28" />
                   <ScrollPicker items={MINUTES} selected={selMin} onChange={setSelMin} width="w-20 md:w-28" />
                </div>
                {/* Visual fading masks for picker */}
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-30" />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
              </div>

              {/* Settings Group */}
              <div className="w-full px-6 md:px-10 space-y-4">
                   <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between px-2">
                         <span className="text-white text-lg font-normal">Ringtone</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pb-6 border-b border-white/10">
                        {RINGTONES.concat(customRingtones as any).map((rt: any) => (
                          <button
                            key={rt.id}
                            onClick={() => {
                              setSelRingtone(rt.id);
                              ringtonePlayer.play(rt.id, rt.data);
                            }}
                            className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all ${
                              selRingtone === rt.id 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-xl' 
                                : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-2xl">{rt.icon || '🔊'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest truncate w-full text-center">{rt.name}</span>
                          </button>
                        ))}
                      </div>
                   </div>

                   <div 
                    className="flex items-center justify-between py-5 border-b border-white/10 px-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setRepeatDaily(!repeatDaily)}
                   >
                      <span className="text-white text-lg font-normal">Repeat</span>
                      <div className="flex items-center gap-2 text-white/40">
                         <span className="text-lg font-medium">{repeatDaily ? 'Daily' : 'Once'}</span>
                         <span className="text-2xl font-light">›</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-between py-5 border-b border-white/10 px-2">
                      <span className="text-white text-lg font-normal">Vibrate</span>
                      <button 
                        onClick={() => setVibrate(!vibrate)}
                        className={`w-[56px] h-[34px] rounded-full transition-all duration-200 relative ${vibrate ? 'bg-blue-600' : 'bg-[#333]'}`}
                      >
                        <div className={`absolute top-[3px] left-[3px] w-[28px] h-[28px] bg-white rounded-full transition-transform ${vibrate ? 'translate-x-[22px]' : 'translate-x-0'}`} />
                      </button>
                   </div>

                   <div className="flex items-center justify-between py-6 px-6 bg-white/5 rounded-3xl mt-4 border border-white/5">
                      <span className="text-white text-lg font-normal">Label</span>
                      <input 
                         type="text" 
                         value={newName}
                         onChange={(e) => setNewName(e.target.value)}
                         placeholder="Enter label"
                         className="bg-transparent border-none text-right text-lg font-medium text-white/60 focus:ring-0 placeholder-white/10 flex-1 ml-4"
                      />
                   </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes pop {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default AlarmPage;
