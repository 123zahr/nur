
import React, { useMemo } from 'react';
import { BackgroundStars, Lantern, HangingMoon, StarHanging, Sparkles } from './Decorations';

const CelestialAtmosphere: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Central radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] animate-pulse-slow"></div>
    
    {/* Sweeping divine rays */}
    {[...Array(5)].map((_, i) => (
      <div 
        key={i}
        className="absolute top-[-50%] left-1/2 origin-top h-[200vh] w-[30vw] bg-gradient-to-b from-amber-200/5 via-amber-100/2 to-transparent blur-[100px] opacity-20 animate-ray-rotate"
        style={{ 
          transform: `translateX(-50%) rotate(${i * 72}deg)`,
          animationDelay: `${i * 2}s`
        }}
      ></div>
    ))}

    {/* Floating dust particles */}
    {[...Array(15)].map((_, i) => (
      <div 
        key={i}
        className="absolute bg-amber-400/20 rounded-full blur-2xl animate-float-drift"
        style={{
          width: `${Math.random() * 200 + 50}px`,
          height: `${Math.random() * 200 + 50}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 15 + 15}s`,
          animationDelay: `${Math.random() * -15}s`
        }}
      ></div>
    ))}
  </div>
);

const LuminousText: React.FC<{ text: string; delay?: number; className?: string }> = ({ text, delay = 0, className = "" }) => (
  <div className={`relative ${className} overflow-hidden`}>
    <h2 
      className="text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-300 font-playfair font-bold animate-reveal-up"
      style={{ animationDelay: `${delay}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      {text}
    </h2>
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-once"
      style={{ animationDelay: `${delay + 0.8}s` }}
    ></div>
  </div>
);

const EidMubarak: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-[#030308] flex items-center justify-center p-6 md:p-12 overflow-hidden text-center">
      <BackgroundStars />
      <CelestialAtmosphere />
      <Sparkles className="inset-0 opacity-20 z-10" />
      
      {/* Elegant Border Frame */}
      <div className="absolute inset-4 md:inset-8 border border-amber-500/10 rounded-[2.5rem] md:rounded-[5rem] pointer-events-none z-20">
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-500/20 rounded-tl-[2.5rem] md:rounded-tl-[5rem]"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-500/20 rounded-tr-[2.5rem] md:rounded-tr-[5rem]"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-500/20 rounded-bl-[2.5rem] md:rounded-bl-[5rem]"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-500/20 rounded-br-[2.5rem] md:rounded-br-[5rem]"></div>
      </div>

      {/* Hanging Decorations - Symmetrically Aligned */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-10 md:px-32 opacity-60 z-20 pointer-events-none">
        <Lantern className="scale-[0.3] md:scale-[0.4] -mt-8 animate-sway-gentle" />
        <StarHanging className="scale-[0.5] md:scale-[0.7] -mt-4 animate-sway-gentle" style={{ animationDelay: '0.5s' }} />
        <HangingMoon className="scale-[0.4] md:scale-[0.5] -mt-10 animate-sway-gentle" style={{ animationDelay: '1.2s' }} />
        <StarHanging className="scale-[0.5] md:scale-[0.7] -mt-4 animate-sway-gentle" style={{ animationDelay: '0.8s' }} />
        <Lantern className="scale-[0.3] md:scale-[0.4] -mt-8 animate-sway-gentle" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main Content Content - Vertically and Horizontally Centered */}
      <div className="relative z-30 w-full max-w-5xl flex flex-col items-center justify-center space-y-8 md:space-y-12">
        
        {/* Divine Supplication Greeting */}
        <div className="space-y-2 md:space-y-4 px-4">
          <LuminousText 
            text="TAQABBALALLAHU" 
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter"
            delay={0.3} 
          />
          <LuminousText 
            text="WAMINNA WAMINKUM" 
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight opacity-90"
            delay={0.7} 
          />
          
          <div className="flex items-center gap-6 md:gap-10 w-full max-w-lg mx-auto pt-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
            <p className="text-[#d4af37] text-[10px] md:text-xs font-black tracking-[0.6em] uppercase whitespace-nowrap drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
              Blessed Completion
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/40 to-transparent"></div>
          </div>
        </div>

        {/* Hero "Eid Mubarak" with Warm Pulsating Golden Glow */}
        <div className="relative group py-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '2s' }}>
           <span className="text-5xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-playfair italic text-white leading-none relative z-10 block px-4 transition-all duration-1000 animate-eid-glow">
             Eid Mubarak
           </span>
           {/* Background ghost glow */}
           <span className="text-6xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-playfair italic text-amber-500/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[20px] pointer-events-none select-none tracking-tight whitespace-nowrap animate-pulse-warm">
             Eid Mubarak
           </span>
        </div>

        {/* Closing Inspirational Message */}
        <p className="max-w-2xl mx-auto text-white/60 font-playfair italic text-lg sm:text-2xl md:text-3xl leading-relaxed px-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
          "May this blessed day wrap your home with laughter, your heart with peace, and your life with the infinite light of faith."
        </p>

        {/* Elegant Back Button */}
        <div className="pt-4 md:pt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '3s' }}>
          <button 
            onClick={onBack}
            className="group relative bg-white/5 backdrop-blur-3xl px-12 md:px-20 py-4 md:py-6 rounded-full border border-white/20 text-white transition-all hover:border-amber-400 hover:shadow-[0_0_50px_rgba(212,175,55,0.2)] active:scale-95 uppercase tracking-[0.8em] text-[9px] md:text-[11px] font-black"
          >
            <span className="relative z-10 transition-colors group-hover:text-amber-100 flex items-center gap-4">
              <span className="text-amber-400 opacity-60">✧</span>
              Return Home
              <span className="text-amber-400 opacity-60">✧</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]"></div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-reveal-up { animation: reveal-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes shimmer-once {
          0% { transform: translateX(-150%) skewX(-30deg); }
          100% { transform: translateX(150%) skewX(-30deg); }
        }
        .animate-shimmer-once { animation: shimmer-once 2s ease-out forwards; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes ray-rotate {
          0% { transform: translateX(-50%) rotate(0deg) scale(1); }
          50% { transform: translateX(-50%) rotate(180deg) scale(1.1); }
          100% { transform: translateX(-50%) rotate(360deg) scale(1); }
        }
        .animate-ray-rotate { animation: ray-rotate 40s linear infinite; }

        @keyframes float-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
          50% { transform: translate(40px, -40px) scale(1.2); opacity: 0.15; }
        }
        .animate-float-drift { animation: float-drift linear infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }

        @keyframes pulse-warm {
          0%, 100% { opacity: 0.05; transform: translate(-50%, -50%) scale(1); filter: blur(20px); }
          50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.1); filter: blur(40px); }
        }
        .animate-pulse-warm { animation: pulse-warm 6s ease-in-out infinite; }

        @keyframes eid-glow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(255,255,255,0.1), 0 0 20px rgba(212,175,55,0); 
            transform: translateY(0);
          }
          50% { 
            text-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4); 
            transform: translateY(-8px);
          }
        }
        .animate-eid-glow { animation: eid-glow 5s ease-in-out infinite; }

        @keyframes sway-gentle {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(3deg); }
        }
        .animate-sway-gentle { 
          animation: sway-gentle 6s ease-in-out infinite alternate; 
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

export default EidMubarak;
