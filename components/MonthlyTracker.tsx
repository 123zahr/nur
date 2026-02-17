
import React, { useMemo } from 'react';
import { DailyData, PrayerEntry } from '../types';
import { Sparkles } from './Decorations';

interface Props {
  data: Record<number, DailyData>;
  onSelectDay: (day: number) => void;
}

const MonthlyTracker: React.FC<Props> = ({ data, onSelectDay }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Detailed Weighted Scoring Logic
  const calculateDayStats = (day: number) => {
    const dayData = data[day];
    if (!dayData) return { percentage: 0, prayerScore: 0, deedScore: 0, healthScore: 0, quranScore: 0 };

    // 1. Prayers (Weight: 40%)
    let prayerDone = 0;
    let prayerTotal = 0;
    (Object.values(dayData.prayers) as PrayerEntry[]).forEach(p => {
      prayerTotal += 3;
      if (p.farz) prayerDone++;
      if (p.sunnat) prayerDone++;
      if (p.nafil) prayerDone++;
    });
    dayData.extraPrayers?.forEach(() => prayerTotal++);
    dayData.extraPrayers?.filter(p => p.completed).forEach(() => prayerDone++);
    const prayerScore = prayerTotal > 0 ? (prayerDone / prayerTotal) * 40 : 0;

    // 2. Good Deeds (Weight: 30%)
    let deedDone = 0;
    let deedTotal = 3; // zikr, names99, charity
    if (dayData.goodDeeds.zikr) deedDone++;
    if (dayData.goodDeeds.names99) deedDone++;
    if (dayData.goodDeeds.charity) deedDone++;
    dayData.goodDeeds.custom?.forEach(() => deedTotal++);
    dayData.goodDeeds.custom?.filter(d => d.completed).forEach(() => deedDone++);
    const deedScore = deedTotal > 0 ? (deedDone / deedTotal) * 30 : 0;

    // 3. Health (Weight: 15%)
    let healthDone = 0;
    let healthTotal = 11; // 8 water + exercise + 2 skincare
    healthDone += Math.min(dayData.health.water, 8);
    if (dayData.health.exercise) healthDone++;
    if (dayData.health.skincare.morning) healthDone++;
    if (dayData.health.skincare.night) healthDone++;
    const healthScore = (healthDone / healthTotal) * 15;

    // 4. Quran & Goals (Weight: 15%)
    let quranDone = 0;
    let quranTotal = 2; // recitation + memorization
    if (dayData.quran.recitation.status === 'Completed') quranDone++;
    else if (dayData.quran.recitation.status === 'In Process') quranDone += 0.5;
    if (dayData.quran.memorization.status === 'Completed') quranDone++;
    else if (dayData.quran.memorization.status === 'In Process') quranDone += 0.5;
    const quranScore = (quranDone / quranTotal) * 15;

    const percentage = Math.round(prayerScore + deedScore + healthScore + quranScore);
    return { percentage, prayerScore, deedScore, healthScore, quranScore };
  };

  const summary = useMemo(() => {
    let totalScore = 0;
    let activeDays = 0;
    let totalPrayers = 0;
    let totalDeeds = 0;
    let totalWater = 0;
    let streak = 0;
    let currentStreak = 0;

    for (let i = 1; i <= 30; i++) {
      const dayData = data[i];
      if (dayData) {
        const stats = calculateDayStats(i);
        totalScore += stats.percentage;
        activeDays++;
        
        // Stats tallies
        (Object.values(dayData.prayers) as PrayerEntry[]).forEach(p => {
          if (p.farz) totalPrayers++;
          if (p.sunnat) totalPrayers++;
          if (p.nafil) totalPrayers++;
        });
        dayData.extraPrayers?.forEach(p => { if (p.completed) totalPrayers++; });
        if (dayData.goodDeeds.zikr) totalDeeds++;
        if (dayData.goodDeeds.names99) totalDeeds++;
        if (dayData.goodDeeds.charity) totalDeeds++;
        dayData.goodDeeds.custom?.forEach(d => { if (d.completed) totalDeeds++; });
        totalWater += dayData.health.water;

        // Streak logic
        if (stats.percentage >= 50) {
          currentStreak++;
          streak = Math.max(streak, currentStreak);
        } else {
          currentStreak = 0;
        }
      } else {
        currentStreak = 0;
      }
    }

    const avgProgress = activeDays > 0 ? Math.round(totalScore / 30) : 0;
    
    return {
      avgProgress,
      activeDays,
      totalPrayers,
      totalDeeds,
      totalLitres: (totalWater * 0.25).toFixed(1),
      streak
    };
  }, [data]);

  const getDayColor = (percentage: number) => {
    if (percentage === 0) return 'text-gray-300';
    if (percentage < 30) return 'text-pink-300';
    if (percentage < 70) return 'text-amber-400';
    return 'text-emerald-500';
  };

  return (
    <div className="p-6 md:p-8 space-y-10 animate-fade-in relative pb-40">
      <Sparkles className="inset-0 opacity-20" />
      
      {/* Header Summary Section */}
      <section className="relative z-10 animate-fade-up">
        <div className="bg-white/80 glass p-8 md:p-12 rounded-[4rem] border border-white/60 shadow-2xl space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-6xl font-dancing text-gray-800">Spiritual Journey</h2>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Current Streak: {summary.streak} Days
                </span>
                <span className="px-4 py-1.5 bg-pink-100 text-pink-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {summary.activeDays}/30 Days Logged
                </span>
              </div>
            </div>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="transparent"
                  stroke="url(#divineGrad)"
                  strokeWidth="8"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * summary.avgProgress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="divineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#9d174d" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-gray-800 leading-none">{summary.avgProgress}%</span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-1">Divine Score</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Longest Streak', value: `${summary.streak}d`, icon: '🔥', color: 'bg-orange-50 text-orange-600' },
              { label: 'Prayers Offered', value: summary.totalPrayers, icon: '🕌', color: 'bg-pink-50 text-pink-600' },
              { label: 'Virtuous Acts', value: summary.totalDeeds, icon: '✨', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Hydration', value: `${summary.totalLitres}L`, icon: '💧', color: 'bg-sky-50 text-sky-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/40 p-6 rounded-[2.5rem] border border-white/40 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.03] hover:shadow-md group">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:rotate-12 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-800 leading-tight">{stat.value}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Grid Section */}
      <section className="relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-[0.2em]">Spiritual Calendar</h3>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visualizing your path to Eid</p>
          </div>
        </div>

        <div className="flex justify-center md:justify-end gap-6 text-[9px] font-black uppercase tracking-widest bg-white/50 px-6 py-3 rounded-full border border-white/40 shadow-sm mx-4">
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-pink-300"></div> Minimal</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div> Growth</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Luminous</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 px-2">
          {days.map(day => {
            const stats = calculateDayStats(day);
            const colorClass = getDayColor(stats.percentage);
            const hasData = !!data[day];

            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-[2.5rem] glass transition-all duration-500 transform hover:scale-[1.1] active:scale-95 shadow-sm hover:shadow-2xl border-2 ${
                  hasData ? 'bg-white/90 border-white/60' : 'bg-gray-50/20 border-dashed border-gray-200 opacity-50'
                }`}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90 p-2 opacity-30" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="289" strokeDashoffset={289 - (289 * stats.percentage) / 100} strokeLinecap="round" className={colorClass} />
                </svg>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">D{day}</span>
                  <span className={`text-3xl font-black transition-colors ${hasData ? 'text-gray-800' : 'text-gray-300'}`}>{day}</span>
                  {hasData && (
                    <div className="mt-1 flex flex-col items-center">
                      <span className={`text-[10px] font-black ${colorClass}`}>{stats.percentage}%</span>
                      {stats.percentage >= 90 && <div className="text-[10px] animate-pulse">✨</div>}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
          
          <button
            onClick={() => onSelectDay(31)}
            className="aspect-square flex flex-col items-center justify-center rounded-[3rem] bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#78350f] text-white shadow-2xl transform hover:scale-110 transition-all border-4 border-white ring-8 ring-amber-100/30 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-[10px] font-black tracking-widest uppercase mb-1">Grand</span>
            <span className="text-3xl font-black">EID</span>
            <span className="text-2xl mt-1 animate-bounce">🎊</span>
          </button>
        </div>
      </section>

      <style>{`
        .animate-fade-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MonthlyTracker;
