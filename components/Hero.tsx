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
    const timer = setTimeout(() => setShowHint(true), 1800);
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
        <p className="text-xs sm:text-base md:text-2xl font-light tracking-[0.2em] text-stone-400 uppercase ml-1">
          {t.heroSubtitle}
        </p>
      </div>

      <div
        className={`absolute bottom-12 flex flex-col items-center gap-2 transition-opacity duration-700 ${showHint && !hasStarted ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Desktop hint */}
        <div className="hidden md:flex items-center gap-2 text-stone-400 animate-pulse">
          <Keyboard size={16} strokeWidth={1.5} />
          <p className="text-sm font-light tracking-widest uppercase">{t.heroDesktop}</p>
        </div>
        {/* Mobile hint */}
        <div className="flex md:hidden items-center gap-2 text-stone-400 animate-pulse">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 1C5.3 1 4 2.3 4 4v6c0 1.7 1.3 3 3 3s3-1.3 3-3V4c0-1.7-1.3-3-3-3z"/>
            <path d="M1 10c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
          </svg>
          <p className="text-sm font-light tracking-widest uppercase">{t.heroMobile}</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
