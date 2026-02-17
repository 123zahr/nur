
import React, { useState } from 'react';
import { speakName } from '../services/ttsService';

const NAMES = [
  { id: 1, name: "Ar-Rahman", pronunciation: "Ar-Rah-maan", arabic: "ٱلرَّحْمَٰنُ", meaning: "The Most Gracious" },
  { id: 2, name: "Ar-Rahim", pronunciation: "Ar-Ra-heem", arabic: "ٱلرَّحِيمُ", meaning: "The Most Merciful" },
  { id: 3, name: "Al-Malik", pronunciation: "Al-Ma-lik", arabic: "ٱلْمَلِكُ", meaning: "The Sovereign Lord" },
  { id: 4, name: "Al-Quddus", pronunciation: "Al-Qud-doos", arabic: "ٱلْقُدُّوسُ", meaning: "The Holy" },
  { id: 5, name: "As-Salam", pronunciation: "As-Sa-laam", arabic: "ٱلسَّلَٰمُ", meaning: "The Source of Peace" },
  { id: 6, name: "Al-Mu'min", pronunciation: "Al-Mu'-min", arabic: "ٱلْمُؤْمِنُ", meaning: "The Guardian of Faith" },
  { id: 7, name: "Al-Muhaymin", pronunciation: "Al-Mu-hay-min", arabic: "ٱلْمُهَيْمِنُ", meaning: "The Protector" },
  { id: 8, name: "Al-Aziz", pronunciation: "Al-A-zeez", arabic: "ٱلْعَزِيزُ", meaning: "The Mighty" },
  { id: 9, name: "Al-Jabbar", pronunciation: "Al-Jab-baar", arabic: "ٱلْجَبَّارُ", meaning: "The Compeller" },
  { id: 10, name: "Al-Mutakabbir", pronunciation: "Al-Mu-ta-kab-bir", arabic: "ٱلْمُتَكَبِّرُ", meaning: "The Majestic" },
  { id: 11, name: "Al-Khaliq", pronunciation: "Al-Kha-liq", arabic: "ٱلْخَٰلِقُ", meaning: "The Creator" },
  { id: 12, name: "Al-Bari'", pronunciation: "Al-Ba-ri'", arabic: "ٱلْبَارِئُ", meaning: "The Evolver" },
  { id: 13, name: "Al-Musawwir", pronunciation: "Al-Mu-saw-wir", arabic: "ٱلْمُصَوِّرُ", meaning: "The Fashioner" },
  { id: 14, name: "Al-Ghaffar", pronunciation: "Al-Ghaf-faar", arabic: "ٱلْغَفَّٰرُ", meaning: "The Forgiver" },
  { id: 15, name: "Al-Qahhar", pronunciation: "Al-Qah-haar", arabic: "ٱلْقَهَّارُ", meaning: "The Subduer" },
  { id: 16, name: "Al-Wahhab", pronunciation: "Al-Wah-haab", arabic: "ٱلْوَهَّابُ", meaning: "The Bestower" },
  { id: 17, name: "Ar-Razzaq", pronunciation: "Ar-Raz-zaaq", arabic: "ٱلرَّزَّاقُ", meaning: "The Provider" },
  { id: 18, name: "Al-Fattah", pronunciation: "Al-Fat-taah", arabic: "ٱلْفَتَّاحُ", meaning: "The Opener" },
  { id: 19, name: "Al-Alim", pronunciation: "Al-A-leem", arabic: "ٱلْعَلِيمُ", meaning: "The All-Knowing" },
  { id: 20, name: "Al-Qabid", pronunciation: "Al-Qa-bid", arabic: "ٱلْقَابِضُ", meaning: "The Constrictor" },
  { id: 21, name: "Al-Basit", pronunciation: "Al-Ba-sit", arabic: "ٱلْبَاسِطُ", meaning: "The Expander" },
  { id: 22, name: "Al-Khafid", pronunciation: "Al-Kha-fid", arabic: "ٱلْخَافِضُ", meaning: "The Abaser" },
  { id: 24, name: "Al-Mu'izz", pronunciation: "Al-Mu'-izz", arabic: "ٱلْمُعِزُّ", meaning: "The Bestower of Honors" },
  { id: 25, name: "Al-Mudhill", pronunciation: "Al-Mu-dhill", arabic: "ٱلْمُذِلُّ", meaning: "The Humiliator" },
  { id: 26, name: "As-Sami", pronunciation: "As-Sa-mee'", arabic: "ٱلسَّمِيعُ", meaning: "The All-Hearing" },
  { id: 27, name: "Al-Basir", pronunciation: "Al-Ba-seer", arabic: "ٱلْبَصِيرُ", meaning: "The All-Seeing" },
  { id: 28, name: "Al-Hakam", pronunciation: "Al-Ha-kam", arabic: "ٱلْحَكَمُ", meaning: "The Judge" },
  { id: 29, name: "Al-Adl", pronunciation: "Al-'Adl", arabic: "ٱلْعَدْلُ", meaning: "The Just" },
  { id: 30, name: "Al-Latif", pronunciation: "Al-La-teef", arabic: "ٱللَّطِيفُ", meaning: "The Gentle" },
  { id: 31, name: "Al-Khabir", pronunciation: "Al-Kha-beer", arabic: "ٱلْخَبِيرُ", meaning: "The All-Aware" },
  { id: 32, name: "Al-Halim", pronunciation: "Al-Ha-leem", arabic: "ٱلْحَلِيمُ", meaning: "The Forbearing" },
  { id: 33, name: "Al-Azim", pronunciation: "Al-'A-zeem", arabic: "ٱلْعَظِيمُ", meaning: "The Magnificent" },
  { id: 34, name: "Al-Ghafur", pronunciation: "Al-Gha-foor", arabic: "ٱلْغَفُورُ", meaning: "The All-Forgiving" },
  { id: 35, name: "Ash-Shakur", pronunciation: "Ash-Sha-koor", arabic: "ٱلشَّكُورُ", meaning: "The Appreciative" },
  { id: 36, name: "Al-Ali", pronunciation: "Al-'A-lee", arabic: "ٱلْعَلِيُّ", meaning: "The Highest" },
  { id: 37, name: "Al-Kabir", pronunciation: "Al-Ka-beer", arabic: "ٱلْكَبِيرُ", meaning: "The Greatest" },
  { id: 38, name: "Al-Hafiz", pronunciation: "Al-Ha-feez", arabic: "ٱلْحَفِيظُ", meaning: "The Preserver" },
  { id: 39, name: "Al-Muqit", pronunciation: "Al-Mu-qeet", arabic: "ٱلْمُقِيتُ", meaning: "The Sustainer" },
  { id: 40, name: "Al-Hasib", pronunciation: "Al-Ha-seeb", arabic: "ٱلْحَسِيبُ", meaning: "The Reckoner" },
  { id: 41, name: "Al-Jalil", pronunciation: "Al-Ja-leel", arabic: "ٱلْجَلِيلُ", meaning: "The Majestic" },
  { id: 42, name: "Al-Karim", pronunciation: "Al-Ka-reem", arabic: "ٱلْكَرِيمُ", meaning: "The Generous" },
  { id: 43, name: "Ar-Raqib", pronunciation: "Ar-Ra-qeeb", arabic: "ٱلرَّقِيبُ", meaning: "The Watchful" },
  { id: 44, name: "Al-Mujib", pronunciation: "Al-Mu-jeeb", arabic: "ٱلْمُجِيبُ", meaning: "The Responsive" },
  { id: 45, name: "Al-Wasi", pronunciation: "Al-Wa-si'", arabic: "ٱلْوَاسِعُ", meaning: "The All-Embracing" },
  { id: 46, name: "Al-Hakim", pronunciation: "Al-Ha-keem", arabic: "ٱلْحَكِيمُ", meaning: "The Wise" },
  { id: 47, name: "Al-Wadud", pronunciation: "Al-Wa-dood", arabic: "ٱلوَدُودُ", meaning: "The Loving" },
  { id: 48, name: "Al-Majid", pronunciation: "Al-Ma-jeed", arabic: "ٱلْمَجِيدُ", meaning: "The Glorious" },
  { id: 49, name: "Al-Ba'ith", pronunciation: "Al-Ba-'ith", arabic: "ٱلْبَاعِثُ", meaning: "The Resurrector" },
  { id: 50, name: "Ash-Shahid", pronunciation: "Ash-Sha-heed", arabic: "ٱلشَّهِيدُ", meaning: "The Witness" },
  { id: 51, name: "Al-Haqq", pronunciation: "Al-Haqq", arabic: "ٱلْحَقُّ", meaning: "The Truth" },
  { id: 52, name: "Al-Wakil", pronunciation: "Al-Wa-keel", arabic: "ٱلْوَكِيلُ", meaning: "The Trustee" },
  { id: 53, name: "Al-Qawi", pronunciation: "Al-Qa-wee", arabic: "ٱلْقَوِيُّ", meaning: "The Strong" },
  { id: 54, name: "Al-Matin", pronunciation: "Al-Ma-teen", arabic: "ٱلْمَتِينُ", meaning: "The Firm" },
  { id: 55, name: "Al-Wali", pronunciation: "Al-Wa-lee", arabic: "ٱلْوَلِيُّ", meaning: "The Friend" },
  { id: 56, name: "Al-Hamid", pronunciation: "Al-Ha-meed", arabic: "ٱلْحَمِيدُ", meaning: "The Praiseworthy" },
  { id: 57, name: "Al-Muhsi", pronunciation: "Al-Muh-see", arabic: "ٱلْمُحْصِي", meaning: "The Accounter" },
  { id: 58, name: "Al-Mubdi", pronunciation: "Al-Mub-di'", arabic: "ٱلْمُبْدِئُ", meaning: "The Originator" },
  { id: 59, name: "Al-Mu'id", pronunciation: "Al-Mu-'eed", arabic: "ٱلْمُعِيدُ", meaning: "The Restorer" },
  { id: 60, name: "Al-Muhyi", pronunciation: "Al-Muh-yee", arabic: "ٱلْمُحْيِي", meaning: "The Giver of Life" },
  { id: 61, name: "Al-Mumit", pronunciation: "Al-Mu-meet", arabic: "ٱلْمُمِيتُ", meaning: "The Bringer of Death" },
  { id: 62, name: "Al-Hayy", pronunciation: "Al-Hayy", arabic: "ٱلْحَيُّ", meaning: "The Living" },
  { id: 63, name: "Al-Qayyum", pronunciation: "Al-Qay-yoom", arabic: "ٱلْقَيُّومُ", meaning: "The Self-Subsisting" },
  { id: 64, name: "Al-Wajid", pronunciation: "Al-Wa-jid", arabic: "ٱلْوَاجِدُ", meaning: "The Finder" },
  { id: 65, name: "Al-Majid", pronunciation: "Al-Ma-ajid", arabic: "ٱلْمَاجِدُ", meaning: "The Noble" },
  { id: 66, name: "Al-Wahid", pronunciation: "Al-Wa-hid", arabic: "ٱلْوَاحِدُ", meaning: "The Unique" },
  { id: 67, name: "Al-Ahad", pronunciation: "Al-A-had", arabic: "ٱلْأَحَدُ", meaning: "The One" },
  { id: 68, name: "As-Samad", pronunciation: "As-Sa-mad", arabic: "ٱلصَّمَدُ", meaning: "The Eternal" },
  { id: 70, name: "Al-Muqtadir", pronunciation: "Al-Muq-ta-dir", arabic: "ٱلْمُقْتَدِرُ", meaning: "The Powerful" },
  { id: 71, name: "Al-Muqaddim", pronunciation: "Al-Mu-qad-dim", arabic: "ٱلْمُقَدِّمُ", meaning: "The Expediter" },
  { id: 72, name: "Al-Mu'akhkhir", pronunciation: "Al-Mu-akh-khir", arabic: "ٱلْمُؤَخِّرُ", meaning: "The Delayer" },
  { id: 73, name: "Al-Awwal", pronunciation: "Al-Aw-wal", arabic: "ٱلْأَوَّلُ", meaning: "The First" },
  { id: 74, name: "Al-Akhir", pronunciation: "Al-Aa-khir", arabic: "ٱلآخِرُ", meaning: "The Last" },
  { id: 75, name: "Az-Zahir", pronunciation: "Az-Za-hir", arabic: "ٱلظَّاهِرُ", meaning: "The Manifest" },
  { id: 76, name: "Al-Batin", pronunciation: "Al-Ba-tin", arabic: "ٱلْبَاطِنُ", meaning: "The Hidden" },
  { id: 77, name: "Al-Wali", pronunciation: "Al-Wa-lee", arabic: "ٱلْوَالِي", meaning: "The Governor" },
  { id: 78, name: "Al-Muta'ali", pronunciation: "Al-Mu-ta-'aa-lee", arabic: "ٱلْمُتَعَالِي", meaning: "The Most Exalted" },
  { id: 79, name: "Al-Barr", pronunciation: "Al-Barr", arabic: "ٱلْبَرُّ", meaning: "The Source of Goodness" },
  { id: 80, name: "At-Tawwab", pronunciation: "At-Taw-waab", arabic: "ٱلتَّوَّابُ", meaning: "The Acceptor of Repentance" },
  { id: 81, name: "Al-Muntaqim", pronunciation: "Al-Mun-ta-qim", arabic: "ٱلْمُنْتَقِمُ", meaning: "The Avenger" },
  { id: 82, name: "Al-Afu", pronunciation: "Al-'A-fuww", arabic: "ٱلْعَفُوُّ", meaning: "The Pardoner" },
  { id: 83, name: "Ar-Ra'uf", pronunciation: "Ar-Ra-oof", arabic: "ٱلرَّؤُوفُ", meaning: "The Compassionate" },
  { id: 84, name: "Malik-ul-Mulk", pronunciation: "Ma-li-kul Mulk", arabic: "مَٰلِكُ ٱلْمُلْكِ", meaning: "The King of Sovereignty" },
  { id: 85, name: "Dhul-Jalali wal-Ikram", pronunciation: "Dhul-Ja-laa-li wal-Ik-raam", arabic: "ذُو ٱلْجَلَٰلِ وَٱلْإِكْرَامِ", meaning: "Lord of Majesty and Generosity" },
  { id: 86, name: "Al-Muqsit", pronunciation: "Al-Muq-sit", arabic: "ٱلْمُقْسِطُ", meaning: "The Equitable" },
  { id: 87, name: "Al-Jami", pronunciation: "Al-Ja-mi'", arabic: "ٱلْجَامِعُ", meaning: "The Gatherer" },
  { id: 88, name: "Al-Ghani", pronunciation: "Al-Gha-nee", arabic: "ٱلْغَنِيُّ", meaning: "The Rich" },
  { id: 89, name: "Al-Mughni", pronunciation: "Al-Mugh-nee", arabic: "ٱلْمُغْنِي", meaning: "The Enricher" },
  { id: 90, name: "Al-Mani", pronunciation: "Al-Ma-ni'", arabic: "ٱلْمَانِعُ", meaning: "The Preventer" },
  { id: 91, name: "Ad-Darr", pronunciation: "Ad-Daarr", arabic: "ٱلضَّارُّ", meaning: "The Distresser" },
  { id: 92, name: "An-Nafi", pronunciation: "An-Na-fi'", arabic: "ٱلنَّافِعُ", meaning: "The Propitious" },
  { id: 93, name: "An-Nur", pronunciation: "An-Noor", arabic: "ٱلنُّورُ", meaning: "The Light" },
  { id: 94, name: "Al-Hadi", pronunciation: "Al-Ha-dee", arabic: "ٱلْهَادِي", meaning: "The Guide" },
  { id: 95, name: "Al-Badi", pronunciation: "Al-Ba-dee'", arabic: "ٱلْبَدِيعُ", meaning: "The Incomparable" },
  { id: 96, name: "Al-Baqi", pronunciation: "Al-Ba-qee", arabic: "ٱلْبَاقِي", meaning: "The Everlasting" },
  { id: 97, name: "Al-Warith", pronunciation: "Al-Wa-rith", arabic: "ٱلْوَارِثُ", meaning: "The Heir" },
  { id: 98, name: "Ar-Rashid", pronunciation: "Ar-Ra-sheed", arabic: "ٱلرَّشِيدُ", meaning: "The Guide to the Right Path" },
  { id: 99, name: "As-Sabur", pronunciation: "As-Sa-boor", arabic: "ٱلصَّبُورُ", meaning: "The Patient" }
];

interface Props {
  checklist: Record<number, boolean>;
  onUpdate: (checklist: Record<number, boolean>) => void;
}

const Names99: React.FC<Props> = ({ checklist, onUpdate }) => {
  const [loadingAudioId, setLoadingAudioId] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<number, boolean> | null>(null);

  const handleSpeak = async (e: React.MouseEvent, item: typeof NAMES[0]) => {
    e.stopPropagation();
    setLoadingAudioId(item.id);
    await speakName(item.arabic, item.name);
    setLoadingAudioId(null);
  };

  const toggleName = (id: number) => {
    setHistory(null);
    onUpdate({ ...checklist, [id]: !checklist[id] });
  };

  const handleMarkAll = () => {
    setHistory({ ...checklist });
    const newChecklist: Record<number, boolean> = {};
    NAMES.forEach(n => {
      newChecklist[n.id] = true;
    });
    onUpdate(newChecklist);
  };

  const handleUnmarkAll = () => {
    setHistory({ ...checklist });
    onUpdate({});
  };

  const learnedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((learnedCount / 99) * 100);

  return (
    <div className="p-8 pt-20 space-y-12 animate-fade-in relative pb-40">
      {/* Refined Header - Higher clearance for hanging decorations */}
      <div className="text-center space-y-6 relative z-30">
        <p className="text-pink-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 opacity-60">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h2 className="text-7xl md:text-8xl font-dancing bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 drop-shadow-[0_10px_10px_rgba(236,72,153,0.3)] py-2">
          99 Names of Allah
        </h2>
        
        <div className="max-w-md mx-auto space-y-6 pt-4">
          <div className="space-y-3">
             <div className="w-full h-2.5 bg-pink-100/50 rounded-full overflow-hidden border border-pink-200 shadow-inner">
               <div 
                 className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                 style={{ width: `${progressPercent}%` }}
               ></div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
               {learnedCount} / 99 Names Learned
             </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleMarkAll}
              className="px-8 py-3.5 bg-pink-100/80 text-pink-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-200 shadow-sm hover:shadow-md hover:bg-pink-100 transition-all active:scale-95"
            >
              Mark All
            </button>
            <button 
              onClick={handleUnmarkAll}
              className="px-8 py-3.5 bg-gray-50/80 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:bg-gray-100 transition-all active:scale-95"
            >
              Unmark All
            </button>
          </div>
        </div>
      </div>

      {/* List Items - Refined layout to match screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-4xl mx-auto relative z-30">
        {NAMES.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleName(item.id)}
            className={`flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all duration-500 transform active:scale-[0.97] group relative overflow-hidden ${
              checklist[item.id] 
                ? 'bg-gradient-to-br from-pink-50 to-white border-pink-200 shadow-lg ring-1 ring-pink-100' 
                : 'bg-white/90 border-gray-100 hover:border-pink-300 hover:bg-white shadow-sm'
            }`}
          >
            {/* Circular ID circle */}
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
              checklist[item.id] 
                ? 'bg-pink-500 border-pink-500 text-white shadow-xl rotate-[360deg]' 
                : 'border-gray-50 bg-gray-50/50 text-gray-300'
            }`}>
               <span className={`text-[11px] font-black ${checklist[item.id] ? 'opacity-100 scale-125' : 'opacity-100'}`}>
                 {checklist[item.id] ? '✓' : item.id}
               </span>
            </div>

            <div className="text-left flex-1 space-y-1">
              <div className="flex flex-col">
                <span className={`text-xl font-black tracking-tight transition-colors duration-500 ${checklist[item.id] ? 'text-gray-900' : 'text-gray-700'}`}>
                  {item.name}
                </span>
                <span className="text-[10px] text-pink-500 font-black uppercase tracking-widest flex items-center gap-2">
                  {item.pronunciation}
                  <button 
                    onClick={(e) => handleSpeak(e, item)}
                    className={`p-1.5 rounded-full hover:bg-pink-100 transition-colors ${loadingAudioId === item.id ? 'animate-pulse text-pink-600' : 'text-pink-300'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold italic tracking-wide">
                {item.meaning}
              </p>
            </div>

            <div className="text-right">
              <span className={`font-arabic text-5xl leading-none transition-all duration-700 ${checklist[item.id] ? 'text-pink-600 scale-105' : 'text-pink-900/20'}`} dir="rtl">
                {item.arabic}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-20 p-12 bg-white/60 backdrop-blur-md border border-pink-100/50 rounded-[4rem] text-center space-y-4 shadow-xl">
          <p className="text-sm text-gray-500 leading-relaxed italic font-medium">
            "To Allah belong the most beautiful names, so call on Him by them."
          </p>
          <div className="h-px w-10 bg-pink-200 mx-auto opacity-40"></div>
          <p className="text-[10px] text-pink-800/40 uppercase font-black tracking-[0.4em]">Surah Al-A'raf 7:180</p>
      </div>
    </div>
  );
};

export default Names99;
