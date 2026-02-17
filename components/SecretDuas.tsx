
import React, { useState, useEffect } from 'react';
import { Sparkles } from './Decorations';

const STORAGE_KEY = 'ramadan_secret_duas';

const SecretDuas: React.FC = () => {
  const [duas, setDuas] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setDuas(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, duas);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 pt-20 space-y-12 animate-fade-in relative pb-40 min-h-screen">
      <Sparkles className="inset-0 opacity-20" />
      
      <div className="text-center space-y-4 relative z-10">
        <h2 className="text-7xl font-dancing text-pink-500 drop-shadow-sm">Secret Duas</h2>
        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Your Private Conversations with the Divine</p>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[4rem] p-10 md:p-16 border border-white/60 shadow-[0_40px_100px_rgba(0,0,0,0.08)] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 text-9xl opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">🤲</div>
          
          <textarea
            value={duas}
            onChange={(e) => setDuas(e.target.value)}
            placeholder="Whisper your heart's desires here... This space is for your most private and sincere prayers."
            className="w-full h-[500px] bg-transparent border-none focus:ring-0 text-2xl md:text-3xl font-dancing leading-loose text-gray-800 placeholder-gray-200 resize-none scrollbar-hide"
          />

          <div className="absolute bottom-10 right-10 flex items-center gap-4">
            {isSaved && (
              <span className="text-pink-500 font-black uppercase tracking-widest text-[10px] animate-fade-in">Saved & Sealed ✨</span>
            )}
            <button
              onClick={handleSave}
              className={`relative px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] transition-all duration-500 transform active:scale-95 shadow-xl overflow-hidden group/btn ${
                isSaved ? 'bg-emerald-500 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              <div className="relative z-10 flex items-center gap-3">
                <span>{isSaved ? 'Sealed' : 'Seal Duas'}</span>
                <span className={`text-lg transition-transform duration-500 ${isSaved ? 'rotate-[360deg]' : 'group-hover/btn:rotate-12'}`}>
                  {isSaved ? '✨' : '💖'}
                </span>
              </div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
            </button>
          </div>
        </div>

        <div className="p-8 text-center bg-pink-50/30 rounded-[3rem] border border-pink-100/50">
          <p className="text-sm text-pink-900/40 italic font-medium leading-relaxed">
            "And when My servants ask you concerning Me, then surely I am very near; I answer the prayer of the suppliant when he calls on Me."
          </p>
          <div className="h-px w-8 bg-pink-200 mx-auto my-4 opacity-30"></div>
          <p className="text-[9px] text-pink-800/20 font-black uppercase tracking-widest">Surah Al-Baqarah 2:186</p>
        </div>
      </div>
    </div>
  );
};

export default SecretDuas;
