
import React from 'react';

export const Lantern: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <div className={`animate-sway-lantern ${className}`} style={style}>
      <svg width="100" height="200" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-gold overflow-visible">
        <style>{`
          @keyframes sway-lantern-new {
            0% { transform: rotate(-6deg) translateX(-4px) scale(1); }
            50% { transform: rotate(6deg) translateX(4px) translateY(2px) scale(1.02); }
            100% { transform: rotate(-6deg) translateX(-4px) scale(1); }
          }
          .animate-sway-lantern {
            animation: sway-lantern-new 6s ease-in-out infinite;
            transform-origin: top center;
          }
          @keyframes glow-pulse-new {
            0%, 100% { filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.4)); }
            50% { filter: drop-shadow(0 0 50px rgba(212, 175, 55, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)); }
          }
          .animate-glow-pulse {
            animation: glow-pulse-new 3s infinite ease-in-out;
          }
        `}</style>
        
        {/* Deep Bloom Aura */}
        <circle cx="50" cy="90" r="95" fill="url(#outerBloom)" opacity="0.4" className="animate-bloom" />
        <circle cx="50" cy="90" r="65" fill="url(#innerBloom)" opacity="0.7" className="animate-glow-pulse" />
        
        {/* Hanging Chain */}
        <path d="M50 0 V45" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6"/>
        <circle cx="50" cy="45" r="5" fill="#B8860B" stroke="#D4AF37" strokeWidth="1" />
        
        {/* Top Cap */}
        <path d="M28 45 L50 26 L72 45 H28Z" fill="#B8860B" stroke="#D4AF37" strokeWidth="1.5"/>
        <path d="M22 45 H78 L72 56 H28 L22 45Z" fill="#D4AF37" />
        
        {/* Main Body */}
        <rect x="20" y="56" width="60" height="75" rx="18" fill="url(#glassGrad)" stroke="#D4AF37" strokeWidth="3" className="animate-glow-pulse" />
        
        {/* Geometric Detail */}
        <g opacity="0.5" stroke="#D4AF37" strokeWidth="1.2">
           <path d="M50 65 L56 85 L78 92 L56 98 L50 118 L44 98 L22 92 L44 85 Z" className="animate-pattern-subtle" />
        </g>

        {/* Dynamic Flame */}
        <g className="animate-flicker">
          <ellipse cx="50" cy="92" rx="14" ry="22" fill="url(#flameGrad)" className="blur-[5px]" />
          <ellipse cx="50" cy="94" rx="8" ry="14" fill="white" className="blur-[2px]" />
        </g>
        
        {/* Bottom Details */}
        <path d="M22 131 H78 L72 142 H28 L22 131Z" fill="#B8860B" />
        <path d="M38 142 L50 155 L62 142 Z" fill="#D4AF37" />
        <path d="M50 155 V185" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 5" />
        <circle cx="50" cy="185" r="7" fill="#D4AF37" className="animate-glow-pulse shadow-2xl" />

        <defs>
          <radialGradient id="outerBloom" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 90) rotate(90) scale(100)">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="innerBloom" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 90) rotate(90) scale(65)">
            <stop stopColor="white" stopOpacity="0.9" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="glassGrad" x1="20" y1="56" x2="80" y2="131" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFBEB" stopOpacity="1"/>
            <stop offset="0.4" stopColor="#F59E0B" stopOpacity="0.4"/>
            <stop offset="1" stopColor="#78350F" stopOpacity="0.9"/>
          </linearGradient>
          <radialGradient id="flameGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 92) rotate(90) scale(28)">
            <stop stopColor="white" />
            <stop offset="0.3" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export const HangingMoon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <div className={`animate-sway-moon-new ${className}`} style={{ animationDelay: '1.2s', ...style }}>
      <svg width="100" height="150" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-gold overflow-visible">
        <style>{`
          @keyframes sway-moon-new {
            0% { transform: rotate(-5deg) scale(1); }
            50% { transform: rotate(5deg) scale(1.05); }
            100% { transform: rotate(-5deg) scale(1); }
          }
          .animate-sway-moon-new {
            animation: sway-moon-new 7s ease-in-out infinite alternate;
            transform-origin: top center;
          }
          @keyframes moon-glow-pulse {
            0%, 100% { filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.6)) blur(1px); }
            50% { filter: drop-shadow(0 0 60px rgba(251, 191, 36, 0.9)) blur(0px); }
          }
          .animate-moon-glow {
            animation: moon-glow-pulse 4s ease-in-out infinite;
          }
        `}</style>
        
        {/* Moon Aura/Glow */}
        <circle cx="45" cy="100" r="70" fill="url(#moonAura)" className="animate-bloom" />
        <path d="M50 0 V65" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 5" />
        
        <g className="animate-flicker animate-moon-glow">
          {/* Enhanced Moon Silhouette */}
          <path d="M75 105 C75 130 52 148 28 148 C16 148 8 144 3 140 C23 136 36 120 36 100 C36 80 23 64 3 60 C8 56 16 52 28 52 C52 52 75 70 75 105 Z" fill="url(#moonSurface)" stroke="#D97706" strokeWidth="0.8" />
          {/* Shiny Inner Star */}
          <path d="M48 88 L50 96 L58 96 L52 101 L54 110 L48 104 L42 110 L44 101 L38 96 L46 96 Z" fill="white" className="animate-twinkle" style={{ filter: 'drop-shadow(0 0 10px white)' }} />
        </g>
        
        <defs>
          <radialGradient id="moonAura" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(45 100) rotate(90) scale(75)">
            <stop stopColor="#FDE68A" stopOpacity="0.6"/>
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="moonSurface" x1="3" y1="52" x2="75" y2="148" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="0.3" stopColor="#FFFBEB" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const StarHanging: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <div className={`animate-sway ${className}`} style={{ animationDelay: '0.8s', ...style }}>
    <svg width="60" height="140" viewBox="0 0 60 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-star overflow-visible">
      <circle cx="30" cy="90" r="50" fill="url(#starHalo)" className="animate-bloom" />
      <path d="M30 0 V65" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="4 8"/>
      
      {/* Intense 8-Pointed Star */}
      <g className="animate-twinkle">
        <path d="M30 65 L39 84 L60 90 L39 96 L30 120 L21 96 L0 90 L21 84 Z" fill="white" fillOpacity="1" />
        <path d="M16 76 L44 76 L44 104 L16 104 Z" fill="white" transform="rotate(45 30 90)" />
        <circle cx="30" cy="90" r="10" fill="#FDE68A" className="animate-pulse" />
      </g>
      
      <defs>
        <radialGradient id="starHalo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 90) rotate(90) scale(60)">
          <stop stopColor="white" stopOpacity="0.6"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  </div>
);

export const Sparkles: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute pointer-events-none overflow-hidden ${className}`}>
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full animate-twinkle shadow-[0_0_18px_white]"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 5 + 3}s`,
          opacity: Math.random() * 0.8 + 0.4
        }}
      />
    ))}
  </div>
);

export const BackgroundStars: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(260)].map((_, i) => (
        <div 
          key={i} 
          className="absolute text-white animate-twinkle glow-star"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 18 + 5}px`,
            animationDelay: `${Math.random() * 15}s`,
            opacity: Math.random() * 0.6 + 0.2
          }}
        >
          {Math.random() > 0.9 ? '✦' : Math.random() > 0.6 ? '•' : '₊'}
        </div>
      ))}
    </div>
  );
};
