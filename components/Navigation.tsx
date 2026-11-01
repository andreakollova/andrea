
import React from 'react';
import { X } from 'lucide-react';
import { getPortfolioSections } from '../constants';
import { Language } from '../types';

interface NavigationProps {
  onSelectSection: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDark: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onSelectSection, isOpen, onClose, language, setLanguage, isDark }) => {
  const sections = getPortfolioSections(language, isDark);

  const handleLinkClick = (id: string) => {
    onSelectSection(id);
  };

  return (
    <>
      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isDark ? 'bg-[#151414]/95' : 'bg-stone-50/95'} ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-4 transition-colors focus:outline-none z-[60] cursor-pointer ${isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-500 hover:text-stone-800'}`}
          aria-label="Close menu"
        >
           <X size={32} strokeWidth={1.5} />
        </button>

        <nav className="flex flex-col space-y-8 text-center relative z-50">
          <a
            href="https://www.drixton.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 mb-2 transition-opacity hover:opacity-70"
          >
            <img
              src={isDark ? "https://www.drixton.com/static/logo-keyboard-white.png" : "https://www.drixton.com/static/logo-keyboard.png"}
              alt="Drixton"
              className="h-5 w-auto"
            />
            <span className={`text-xs md:text-sm font-light tracking-widest uppercase ${isDark ? 'text-stone-300' : 'text-stone-500'}`}>
              {language === 'sk' ? 'Viac projektov na' : 'My work at'} drixton.com
            </span>
            <span className={`text-xs md:text-sm ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>→</span>
          </a>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleLinkClick(section.id)}
              className={`text-3xl md:text-5xl font-light transition-colors tracking-tight cursor-pointer ${isDark ? 'text-stone-100 hover:text-stone-400' : 'text-stone-800 hover:text-stone-500'}`}
            >
              {section.title}
            </button>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="absolute bottom-12 flex gap-8 z-50">
          <button
            onClick={() => setLanguage('en')}
            className={`hover:scale-110 transition-transform duration-200 ${language === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            aria-label="Switch to English"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="28" height="14" className="rounded-sm">
              <clipPath id="gb"><rect width="60" height="30"/></clipPath>
              <g clipPath="url(#gb)">
                <rect width="60" height="30" fill="#012169"/>
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb)"/>
                <path d="M30,0V30M0,15H60" stroke="#fff" strokeWidth="10"/>
                <path d="M30,0V30M0,15H60" stroke="#C8102E" strokeWidth="6"/>
              </g>
            </svg>
          </button>
          <button
            onClick={() => setLanguage('sk')}
            className={`hover:scale-110 transition-transform duration-200 ${language === 'sk' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            aria-label="Switch to Slovak"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="28" height="19" className="rounded-sm">
              <rect width="900" height="600" fill="#ee1c25"/>
              <rect width="900" height="400" fill="#0b4ea2"/>
              <rect width="900" height="200" fill="#fff"/>
              <path d="M233,128 v300 c0,80 80,140 150,170 70-30 150-90 150-170 v-300z" fill="#0b4ea2"/>
              <path d="M248,143 v285 c0,72 72,128 135,157 63-29 135-85 135-157 v-285z" fill="#fff"/>
              <path d="M310,360 c10-30 50-50 73-60 23,10 63,30 73,60 -20-5-50-10-73-10 -23,0-53,5-73,10z" fill="#ee1c25"/>
              <path d="M383,260 c-50,0-90,10-110,20 0,20 10,45 30,65 25-15 55-25 80-25 25,0 55,10 80,25 20-20 30-45 30-65 -20-10-60-20-110-20z" fill="#ee1c25"/>
              <path d="M383,193 c-10,0-18,20-18,45 -30,0-55,8-55,18 0,10 25,18 55,18 0,25 8,45 18,45 10,0 18-20 18-45 30,0 55-8 55-18 0-10-25-18-55-18 0-25-8-45-18-45z" fill="#fff"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;