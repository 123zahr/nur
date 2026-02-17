
import React, { useEffect } from 'react';

const IntroSplash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[100] overflow-hidden">
      <div className="relative">
        <h1 className="text-7xl md:text-9xl font-playfair italic text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6d3b] animate-netflix tracking-tighter">
          NUR
        </h1>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 -translate-y-1/2 blur-xl animate-pulse"></div>
      </div>
      
      {/* Light sweep effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[sweep_2s_ease-in-out_infinite]"></div>
      
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
      `}</style>
    </div>
  );
};

export default IntroSplash;
