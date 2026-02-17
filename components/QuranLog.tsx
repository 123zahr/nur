
import React, { useState } from 'react';

const SURAHS = [
  "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

interface Props {
  recitation: Record<string, boolean>;
  memorization: Record<string, boolean>;
  onUpdateRecitation: (checklist: Record<string, boolean>) => void;
  onUpdateMemorization: (checklist: Record<string, boolean>) => void;
}

const QuranLog: React.FC<Props> = ({ recitation, memorization, onUpdateRecitation, onUpdateMemorization }) => {
  const [tab, setTab] = useState<'recitation' | 'memorization'>('recitation');

  const currentChecklist = tab === 'recitation' ? recitation : memorization;
  const currentUpdateFn = tab === 'recitation' ? onUpdateRecitation : onUpdateMemorization;

  const toggleSurah = (name: string) => {
    currentUpdateFn({ ...currentChecklist, [name]: !currentChecklist[name] });
  };

  const completedCount = Object.values(currentChecklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 114) * 100);

  return (
    <div className="p-8 space-y-12 animate-fade-in relative pb-20">
      {/* Enhanced Header Section with better visibility */}
      <div className="text-center space-y-6 bg-white/60 backdrop-blur-xl p-10 rounded-[4rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10">
        <p className="text-green-600 font-black uppercase tracking-[0.3em] text-[10px] opacity-60">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h2 className="text-6xl font-dancing text-green-900 drop-shadow-sm">Quran Tracker</h2>
        
        {/* Progress Display */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-between items-end px-2">
             <span className="text-[11px] font-black text-green-800 uppercase tracking-widest">{tab} Progress</span>
             <span className="text-sm font-black text-green-900">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-green-100/50 rounded-full overflow-hidden border border-green-200/30 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-center">
            <div className="px-6 py-2 bg-green-100/80 text-green-900 rounded-full text-[11px] font-black border border-green-200 shadow-sm uppercase tracking-[0.2em]">
              {completedCount} / 114 Surahs Completed
            </div>
          </div>
        </div>
      </div>

      {/* Tabs with improved contrast */}
      <div className="flex bg-white/80 backdrop-blur-md p-2 rounded-full border border-green-100/50 shadow-lg max-w-sm mx-auto relative z-10">
        {(['recitation', 'memorization'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
              tab === t 
                ? 'bg-green-600 text-white shadow-xl scale-[1.02] ring-2 ring-green-100' 
                : 'text-green-700/50 hover:text-green-800 hover:bg-green-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Surah Grid with better button styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
        {SURAHS.map((surah) => (
          <button
            key={surah}
            onClick={() => toggleSurah(surah)}
            className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-300 transform active:scale-[0.9] group ${
              currentChecklist[surah] 
                ? 'bg-gradient-to-br from-green-50 to-white border-green-200 text-green-900 shadow-md ring-1 ring-green-50' 
                : 'bg-white/90 border-gray-100 text-gray-500 hover:border-green-300 hover:bg-white shadow-sm'
            }`}
          >
            <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
              currentChecklist[surah] 
                ? 'bg-green-500 border-green-500 text-white shadow-[0_5px_15px_rgba(34,197,94,0.3)]' 
                : 'border-gray-100 group-hover:border-green-200 bg-gray-50'
            }`}>
              {currentChecklist[surah] && <span className="text-xs font-black">✓</span>}
            </div>
            <span className={`text-[12px] font-black truncate tracking-tighter transition-opacity ${currentChecklist[surah] ? 'opacity-100' : 'opacity-60'}`}>
              {surah}
            </span>
          </button>
        ))}
      </div>

      {/* Footer Quote */}
      <div className="mt-12 p-10 bg-white/60 backdrop-blur-md border border-green-100/30 rounded-[3rem] text-center space-y-4 shadow-xl">
          <p className="text-sm text-gray-600 leading-relaxed italic font-medium">
            "The best of you are those who learn the Quran and teach it."
          </p>
          <div className="h-px w-10 bg-green-200 mx-auto opacity-50"></div>
          <p className="text-[10px] text-green-800/40 uppercase font-black tracking-[0.3em]">Sahih al-Bukhari</p>
      </div>
    </div>
  );
};

export default QuranLog;
