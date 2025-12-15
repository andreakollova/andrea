
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  hasStarted: boolean;
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ hasStarted, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div 
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ease-in-out ${
        hasStarted ? 'opacity-10' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-4 px-4">
        <h1 className="text-6xl md:text-8xl font-thin tracking-tight text-stone-900 whitespace-nowrap">
          {t.heroTitle}
        </h1>
        <p className="text-xs sm:text-base md:text-2xl font-light tracking-[0.2em] text-stone-400 uppercase ml-1">
          {t.heroSubtitle}
        </p>
      </div>
      
      <div className={`absolute bottom-12 transition-opacity duration-700 ${hasStarted ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-sm font-light tracking-widest text-stone-400 animate-pulse hidden md:block">
          {t.heroDesktop}
        </p>
        <p className="text-sm font-light tracking-widest text-stone-400 animate-pulse block md:hidden">
          {t.heroMobile}
        </p>
      </div>
    </div>
  );
};

export default Hero;