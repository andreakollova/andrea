import React, { useEffect, useState } from 'react';
import { Keyboard } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  hasStarted: boolean;
  language: Language;
  isDark: boolean;
}

const Hero: React.FC<HeroProps> = ({ hasStarted, language, isDark }) => {
  const t = TRANSLATIONS[language];
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (hasStarted) { setShowHint(false); return; }
    const timer = setTimeout(() => setShowHint(true), 1000);
    return () => clearTimeout(timer);
  }, [hasStarted]);

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ease-in-out ${
        hasStarted ? 'opacity-10' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-4 px-4">
        <h1 className={`text-6xl md:text-8xl font-thin tracking-tight whitespace-nowrap ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
          {t.heroTitle}
        </h1>
        <p className={`text-xs sm:text-base md:text-2xl font-light tracking-[0.2em] uppercase ml-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          {t.heroSubtitle}
        </p>
      </div>

      {/* Hint — positioned below the snake start point (~75% from top) */}
      <div
        className={`absolute bottom-6 flex flex-col items-center gap-2 transition-opacity duration-700 ${showHint && !hasStarted ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Desktop hint */}
        <div className={`hidden md:flex items-center gap-2 animate-pulse ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          <Keyboard size={14} strokeWidth={1.5} />
          <p className="text-xs font-light tracking-widest uppercase">{t.heroDesktop}</p>
        </div>
        {/* Mobile hint — tap/touch ripple icon */}
        <div className={`flex md:hidden items-center gap-2 animate-pulse ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="9" cy="9" r="2.5" fill="currentColor" stroke="none"/>
            <circle cx="9" cy="9" r="5.5"/>
            <circle cx="9" cy="9" r="8" strokeOpacity="0.35"/>
          </svg>
          <p className="text-xs font-light tracking-widest uppercase">{t.heroMobile}</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
