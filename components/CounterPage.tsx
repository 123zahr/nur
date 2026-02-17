
import React, { useState, useEffect } from 'react';

const TASBIH_STEPS = [
  { text: "SubhanAllah", meaning: "Glory be to Allah", color: "text-pink-600", glow: "bg-pink-400" },
  { text: "Alhamdulillah", meaning: "Praise be to Allah", color: "text-emerald-600", glow: "bg-emerald-400" },
  { text: "Allahu Akbar", meaning: "Allah is the Greatest", color: "text-amber-600", glow: "bg-amber-400" }
];

const STORAGE_KEY_COUNTER = 'ramadan_tasbih_counter';

const CounterPage: React.FC = () => {
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isAnimate, setIsAnimate] = useState(false);

  // Persistence: Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COUNTER);
    if (saved) {
      try {
        const { savedCount, savedSets } = JSON.parse(saved);
        setCount(savedCount || 0);
        setSets(savedSets || 0);
      } catch (e) {
        console.error("Failed to load counter", e);
      }
    }
  }, []);

  // Persistence: Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COUNTER, JSON.stringify({ savedCount: count, savedSets: sets }));
    
    // Auto-update phrase based on count for 100-set logic (33-33-34)
    if (count === 0) {
      setStepIndex(0);
    } else if (count <= 33) {
      setStepIndex(0);
    } else if (count <= 66) {
      setStepIndex(1);
    } else {
      setStepIndex(2);
    }
  }, [count, sets]);

  const increment = () => {
    if (count < 100) {
      setCount(prev => prev + 1);
    } else {
      handleSetComplete();
    }
  };

  const handleSetComplete = () => {
    setIsAnimate(true);
    
    setTimeout(() => {
      setCount(1);
      setSets(prev => prev + 1);
      setStepIndex(0);
      setIsAnimate(false);
    }, 300);
  };

  const handleReset = () => {
    setCount(0);
    setSets(0);
    setStepIndex(0);
  };

  const currentStep = TASBIH_STEPS[stepIndex];

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[85vh] animate-fade-in space-y-12">
      {/* Enhanced Header with better visibility background card */}
      <div className="text-center space-y-4 w-full max-w-sm p-10 bg-white/60 backdrop-blur-2xl rounded-[4rem] border border-white shadow-[0_25px_60px_rgba(0,0,0,0.08)] relative z-20">
        <h2 className="text-6xl font-dancing text-pink-600 drop-shadow-sm">Tasbih Counter</h2>
        
        <div className={`transition-all duration-500 transform ${isAnimate ? 'opacity-0 -translate-y-4 blur-sm' : 'opacity-100 translate-y-0'}`}>
          <div className="h-[2px] w-8 bg-pink-100 mx-auto mb-4 rounded-full opacity-50"></div>
          <p className={`text-3xl font-black tracking-tight transition-colors duration-500 drop-shadow-sm ${currentStep.color}`}>
            {currentStep.text}
          </p>
          <p className="text-gray-600 font-bold italic text-sm mt-2 opacity-80">
            "{currentStep.meaning}"
          </p>
        </div>
      </div>

      {/* Main Counter Hub with refined aesthetics */}
      <div className="relative group z-10">
        {/* Dynamic Glow Aura */}
        <div className={`absolute inset-0 blur-[80px] opacity-25 transition-all duration-1000 ${currentStep.glow} scale-125`}></div>
        
        <button 
          onClick={increment}
          className={`relative w-72 h-72 rounded-full bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[14px] flex flex-col items-center justify-center transform active:scale-[0.8] transition-all duration-300 hover:scale-[1.03] active:shadow-inner z-10 ${
            stepIndex === 0 ? 'border-pink-50' : stepIndex === 1 ? 'border-emerald-50' : 'border-amber-50'
          }`}
        >
          <span className="text-[9rem] font-black text-gray-900 leading-none tracking-tighter drop-shadow-sm">
            {count}
          </span>
          <div className="h-1 w-16 bg-gray-100 my-4 rounded-full opacity-50"></div>
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] opacity-60">
            {count === 100 ? 'Finish Set' : 'Tap to Count'}
          </span>

          {/* Precision Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-all duration-1000 ease-out ${currentStep.color} opacity-40`}
              strokeDasharray="295"
              strokeDashoffset={295 - (295 * count) / 100}
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Controls with higher tactile visibility */}
      <div className="flex gap-6 items-center pt-8 relative z-20">
        <button 
          onClick={handleReset}
          className="px-10 py-4 bg-white/80 backdrop-blur-md text-gray-500 font-black rounded-full shadow-lg hover:bg-white hover:text-gray-800 transition-all text-[11px] uppercase tracking-widest border border-white active:scale-90"
        >
          Reset
        </button>
        
        <div className="relative group/set">
           <div className={`absolute -inset-1 rounded-full blur-md opacity-20 transition duration-700 ${currentStep.glow}`}></div>
           <div className="relative px-10 py-4 bg-white/90 backdrop-blur-xl shadow-xl text-pink-700 font-black rounded-full text-[11px] flex items-center gap-4 border border-pink-100 uppercase tracking-widest">
            <span className="text-lg">📿</span>
            <span>Sets Complete: <span className="text-xl ml-2 text-pink-900">{sets}</span></span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.6em] mt-12 text-center leading-loose opacity-60 bg-white/30 backdrop-blur-sm px-8 py-4 rounded-full border border-white/20">
        Remembering Allah <br className="md:hidden" /> brings peace to the soul
      </div>
    </div>
  );
};

export default CounterPage;
