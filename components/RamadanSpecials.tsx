
import React from 'react';
import { Sparkles } from './Decorations';

const ASHRAHS = [
  { 
    title: "1st Ashra: Mercy (Rahmah)", 
    period: "Days 1-10", 
    dua: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
    meaning: "My Lord, forgive and have mercy, for You are the best of those who show mercy.",
    color: "from-emerald-50 to-white border-emerald-100 text-emerald-700"
  },
  { 
    title: "2nd Ashra: Forgiveness (Maghfirah)", 
    period: "Days 11-20", 
    dua: "أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ",
    meaning: "I seek forgiveness from Allah, my Lord, for every sin I committed.",
    color: "from-amber-50 to-white border-amber-100 text-amber-700"
  },
  { 
    title: "3rd Ashra: Protection (Nijat)", 
    period: "Days 21-30", 
    dua: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    meaning: "O Allah, save me from the Fire.",
    color: "from-rose-50 to-white border-rose-100 text-rose-700"
  }
];

const SPECIAL_DUAS = [
  { title: "Niyyah (Intention for Fasting)", arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ", meaning: "I intend to keep the fast for tomorrow in the month of Ramadan." },
  { title: "Iftar (Breaking the Fast)", arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ", meaning: "O Allah, for You I fasted, and with Your provision I broke my fast." }
];

const RamadanSpecials: React.FC = () => {
  return (
    <div className="p-8 pt-20 space-y-16 animate-fade-in relative pb-40 min-h-screen">
      <Sparkles className="inset-0 opacity-20" />
      
      <div className="text-center space-y-4 relative z-10">
        <h2 className="text-7xl font-dancing text-amber-500 drop-shadow-sm">Ramadan Specials</h2>
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">The Three Ashrahs & Essential Rites</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Ashra Cards */}
        <div className="grid grid-cols-1 gap-6">
          {ASHRAHS.map((ashra, idx) => (
            <div key={idx} className={`p-10 rounded-[3rem] bg-gradient-to-br border shadow-sm space-y-6 group transition-all duration-500 hover:shadow-xl ${ashra.color}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black tracking-tight">{ashra.title}</h3>
                <span className="text-[10px] font-black uppercase bg-white/50 px-4 py-1.5 rounded-full border border-current opacity-60">{ashra.period}</span>
              </div>
              <p className="font-arabic text-4xl leading-loose text-right text-gray-800" dir="rtl">{ashra.dua}</p>
              <div className="h-px w-full bg-current opacity-10"></div>
              <p className="text-sm font-medium italic opacity-80">{ashra.meaning}</p>
            </div>
          ))}
        </div>

        {/* Daily Rites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {SPECIAL_DUAS.map((item, idx) => (
             <div key={idx} className="bg-white/90 backdrop-blur-md p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 hover:border-amber-200 transition-colors">
                <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-widest">{item.title}</h4>
                <p className="font-arabic text-3xl leading-relaxed text-right text-gray-800" dir="rtl">{item.arabic}</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.meaning}</p>
             </div>
           ))}
        </div>

        {/* Spiritual Insight */}
        <div className="p-12 bg-amber-50/30 rounded-[4rem] border border-amber-100/50 text-center space-y-6">
           <div className="w-16 h-16 bg-amber-500 text-white rounded-[2rem] flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-200">✨</div>
           <p className="text-xl font-playfair italic text-amber-900 leading-relaxed">
             "Ramadan is the month of the Quran, a month of charity, and a month of patience."
           </p>
           <p className="text-[10px] font-black text-amber-800/40 uppercase tracking-[0.5em]">The Blessed Sanctuary</p>
        </div>

      </div>
    </div>
  );
};

export default RamadanSpecials;
