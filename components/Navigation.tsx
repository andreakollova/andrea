
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
}

const Navigation: React.FC<NavigationProps> = ({ onSelectSection, isOpen, onClose, language, setLanguage }) => {
  const sections = getPortfolioSections(language);

  const handleLinkClick = (id: string) => {
    onSelectSection(id);
  };

  return (
    <>
      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-stone-50/95 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-4 text-stone-500 hover:text-stone-800 transition-colors focus:outline-none z-[60] cursor-pointer"
          aria-label="Close menu"
        >
           <X size={32} strokeWidth={1.5} />
        </button>

        <nav className="flex flex-col space-y-8 text-center relative z-50">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleLinkClick(section.id)}
              className="text-3xl md:text-5xl font-light text-stone-800 hover:text-stone-500 transition-colors tracking-tight cursor-pointer"
            >
              {section.title}
            </button>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="absolute bottom-12 flex gap-8 z-50">
          <button 
            onClick={() => setLanguage('en')}
            className={`text-xl hover:scale-110 transition-transform duration-200 ${language === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            aria-label="Switch to English"
          >
            🇬🇧
          </button>
          <button 
            onClick={() => setLanguage('sk')}
            className={`text-xl hover:scale-110 transition-transform duration-200 ${language === 'sk' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            aria-label="Switch to Slovak"
          >
            🇸🇰
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;