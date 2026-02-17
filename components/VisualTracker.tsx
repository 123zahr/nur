
import React from 'react';
import { VisualTrackerDay } from '../types';

interface Props {
  data: Record<number, VisualTrackerDay>;
  onUpdateDay: (day: number, data: VisualTrackerDay) => void;
  onNavigateToDay: (day: number) => void;
}

const DEFAULT_DAY_DATA: VisualTrackerDay = {
  fasting: false,
  prayers: [false, false, false, false, false],
  tarawih: false,
  quran: false,
  zikr: false,
  sadaqah: false,
};

const VisualTracker: React.FC<Props> = ({ data, onUpdateDay, onNavigateToDay }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const toggleItem = (day: number, key: keyof VisualTrackerDay, index?: number) => {
    const current = data[day] || { ...DEFAULT_DAY_DATA, prayers: [...DEFAULT_DAY_DATA.prayers] };
    const newData = { ...current };

    if (key === 'prayers' && typeof index === 'number') {
      const newPrayers = [...current.prayers];
      newPrayers[index] = !newPrayers[index];
      newData.prayers = newPrayers;
    } else if (key !== 'prayers') {
      (newData as any)[key] = !(current as any)[key];
    }
    onUpdateDay(day, newData);
  };

  const totalMarks = (Object.values(data) as VisualTrackerDay[]).reduce((acc: number, day: VisualTrackerDay) => {
    let count = 0;
    if (day.fasting) count++;
    if (day.tarawih) count++;
    if (day.quran) count++;
    if (day.zikr) count++;
    if (day.sadaqah) count++;
    count += (day.prayers || []).filter(Boolean).length;
    return acc + count;
  }, 0);
  const maxMarks = 30 * 10;
  const progressPercentage = Math.round((totalMarks / maxMarks) * 100);

  // Column Colors
  const COLORS = {
    fasting: 'bg-amber-500 border-amber-600 shadow-amber-200',
    salat: 'bg-emerald-500 border-emerald-600 shadow-emerald-200',
    tarawih: 'bg-violet-500 border-violet-600 shadow-violet-200',
    quran: 'bg-rose-500 border-rose-600 shadow-rose-200',
    zikr: 'bg-sky-500 border-sky-600 shadow-sky-200',
    sadaqah: 'bg-orange-500 border-orange-600 shadow-orange-200',
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0] p-4 md:p-10 relative overflow-hidden font-inter pb-40">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

      {/* Floating Decorations */}
      <div className="absolute top-12 left-12 text-7xl opacity-25 select-none animate-sway pointer-events-none">🌸</div>
      <div className="absolute top-32 right-16 text-8xl opacity-15 select-none animate-float pointer-events-none">🏮</div>
      <div className="absolute bottom-40 left-10 text-9xl opacity-10 select-none rotate-12 pointer-events-none">🕌</div>

      <div className="max-w-5xl mx-auto bg-white rounded-[3.5rem] shadow-[0_50px_120px_rgba(139,92,52,0.1)] p-6 md:p-14 space-y-10 relative z-10 border-[14px] border-[#fdfaf6] ring-1 ring-[#e2d1b8]/40">
        
        {/* Progress Display */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-md border border-[#e2d1b8]/50 flex items-center gap-4">
           <div className="w-10 h-10 rounded-full border-[3px] border-[#d9bc82]/20 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e2b05f" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - progressPercentage} strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-black text-[#5a504a]">{progressPercentage}%</span>
           </div>
           <p className="text-[8px] font-black text-[#5a504a] uppercase tracking-[0.4em]">Spirit Progress</p>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 pt-6">
          <h1 className="text-4xl md:text-[5rem] font-black text-[#5a504a] uppercase tracking-tighter leading-none">
            Ramadan Tracker
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-16 bg-[#e2b05f]/30"></div>
             <p className="text-[10px] font-black text-[#8b7e74] uppercase tracking-[0.5em]">The Sacred Journal</p>
             <div className="h-px w-16 bg-[#e2b05f]/30"></div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_1.8fr_1fr_1fr_1fr_1fr] gap-2 md:gap-4 text-[7px] md:text-[9px] font-black text-[#b1a69d] uppercase tracking-[0.3em] px-2 md:px-4 pb-4 border-b border-[#f3e9dc]">
          <div className="text-left">Day</div>
          <div className="text-center">Fasting</div>
          <div className="text-center">Salat</div>
          <div className="text-center">Taraweeh</div>
          <div className="text-center">Quran</div>
          <div className="text-center">Zikr</div>
          <div className="text-center">Sadaqah</div>
        </div>

        {/* Days List */}
        <div className="space-y-3">
          {days.map(day => {
            const dayData = data[day] || DEFAULT_DAY_DATA;
            const prayerDots = dayData.prayers || [false, false, false, false, false];

            const renderPill = (field: keyof VisualTrackerDay, colorClass: string) => (
              <div className="flex justify-center">
                <button 
                  onClick={() => toggleItem(day, field)}
                  className={`w-full max-w-[65px] h-6 md:h-8 rounded-full border-2 transition-all duration-300 transform active:scale-90 ${
                    dayData[field] 
                      ? `${colorClass} shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] scale-105 animate-pop` 
                      : 'bg-transparent border-[#e2d1b8] hover:bg-gray-50'
                  }`}
                />
              </div>
            );

            return (
              <div
                key={day}
                className="w-full grid grid-cols-[80px_1fr_1.8fr_1fr_1fr_1fr_1fr] gap-2 md:gap-4 items-center px-2 md:px-4 py-1 group hover:bg-[#fdfaf6]/80 rounded-xl transition-all"
              >
                <button 
                  onClick={() => onNavigateToDay(day)}
                  className="text-left group/day"
                >
                  <span className="text-[10px] md:text-sm font-bold text-[#8b7e74] group-hover/day:text-[#e2b05f] transition-colors">D{day}</span>
                </button>

                {renderPill('fasting', COLORS.fasting)}

                {/* Salat Shapes: Diamond/Octagon variation for dots */}
                <div className="flex justify-center items-center gap-0.5 md:gap-1.5">
                  {prayerDots.map((done, i) => (
                    <button 
                      key={i} 
                      onClick={() => toggleItem(day, 'prayers', i)}
                      className={`w-2.5 h-2.5 md:w-5 md:h-5 transition-all duration-300 transform active:scale-75 ${
                        done 
                          ? `${COLORS.salat} border-2 rotate-45 scale-110 animate-pop` 
                          : 'bg-transparent border-2 border-[#e2d1b8] rotate-45'
                      }`}
                      style={{ borderRadius: '2px' }}
                    />
                  ))}
                </div>

                {renderPill('tarawih', COLORS.tarawih)}
                {renderPill('quran', COLORS.quran)}
                {renderPill('zikr', COLORS.zikr)}
                {renderPill('sadaqah', COLORS.sadaqah)}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-12 text-center">
           <div className="h-px w-24 bg-[#e2d1b8]/40 mx-auto mb-6"></div>
           <p className="text-[#5a504a] text-[10px] font-black uppercase tracking-[0.5em] opacity-40">
             Seek peace in every mark
           </p>
        </div>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.9) rotate(45deg); }
          50% { transform: scale(1.15) rotate(45deg); }
          100% { transform: scale(1.05) rotate(45deg); }
        }
        .animate-pop {
          animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes sway {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(3deg); }
        }
        .animate-sway {
          animation: sway 4s ease-in-out infinite alternate;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

export default VisualTracker;
