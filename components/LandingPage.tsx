
import React from 'react';
import { Lantern, HangingMoon, StarHanging, Sparkles } from './Decorations';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <Sparkles className="inset-0 opacity-30" />
      
      {/* Properly hanging decorative elements for depth - SCALED DOWN as requested */}
      <div className="absolute top-0 left-0 right-0 h-96 flex justify-around pointer-events-none z-0">
        <Lantern className="mt-[-60px] scale-[0.25] opacity-90 drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]" />
        <div className="flex flex-col items-center">
            <HangingMoon className="mt-[-80px] scale-[0.35] opacity-100 drop-shadow-[0_0_70px_rgba(251,191,36,0.8)]" />
            <StarHanging className="mt-[-65px] scale-[0.25] opacity-80" />
        </div>
        <Lantern className="mt-[-50px] scale-[0.22] opacity-90 drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]" />
      </div>

      <div className="text-center z-10 space-y-12 animate-landing-reveal">
        <div className="relative inline-block py-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl animate-bounce-slow text-yellow-400 opacity-40 blur-[2px]">🌙</div>
            <h1 className="text-7xl md:text-[10rem] font-playfair italic text-white leading-[0.8] tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              Ramadan
            </h1>
            <div className="mt-[-0.5rem] md:mt-[-1.5rem]">
              <span className="text-5xl md:text-8xl text-[#d4af37] font-dancing lowercase tracking-normal drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]">planner</span>
            </div>
            
            {/* Ambient light ring around title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-radial-gradient from-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse"></div>
        </div>
        
        <div className="space-y-4 animate-fade-up delay-300">
          <div className="flex items-center justify-center gap-4 text-gray-500">
             <div className="h-px w-8 bg-gray-800"></div>
             <p className="font-light tracking-[0.6em] text-[10px] uppercase opacity-70">
               Cultivate Mindfulness • Track Progress
             </p>
             <div className="h-px w-8 bg-gray-800"></div>
          </div>
          <p className="font-light tracking-[0.4em] text-[9px] uppercase text-gray-600 opacity-60">
             Capture Every Blessed Moment
          </p>
        </div>

        <div className="pt-8 animate-fade-up delay-500">
            <button 
              onClick={onStart}
              className="group relative bg-[#d4af37] text-black font-black py-6 px-16 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:shadow-[0_0_70px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-2 active:scale-95 overflow-hidden border border-white/20"
            >
              <span className="relative z-10 tracking-[0.3em] text-xs">ENTER THE SANCTUARY</span>
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
            </button>
        </div>
      </div>

      {/* Atmospheric ground fog */}
      <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-amber-900/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-[0.8em] text-gray-700 opacity-30 uppercase">Nur Digital Companion</div>
      
      <style>{`
        @keyframes landingReveal {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-landing-reveal {
          animation: landingReveal 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -15px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 4s ease-in-out infinite;
        }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default LandingPage;
