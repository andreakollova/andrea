import React, { useEffect, useState } from 'react';
import { SectionContent } from '../types';
import { X } from 'lucide-react';

interface ModalProps {
  section: SectionContent | null;
  onClose: () => void;
  isDark: boolean;
}

const Modal: React.FC<ModalProps> = ({ section, onClose, isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (section) {
      // Small delay to allow fade-in animation to work
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [section]);

  if (!section) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 transition-all duration-700 ease-out ${
        isVisible ? `${isDark ? 'bg-stone-900/90' : 'bg-stone-50/90'} backdrop-blur-sm opacity-100` : 'bg-transparent opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`w-full max-w-2xl transform transition-all duration-700 delay-100 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className={`flex justify-between items-start mb-12 border-b pb-4 ${isDark ? 'border-stone-700' : 'border-stone-200'}`}>
          <div className="flex items-center gap-4">
            {section.headerImage && (
              <img src={section.headerImage} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            )}
            <h2 className={`text-3xl md:text-4xl font-light tracking-tight ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
              {section.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors focus:outline-none ${isDark ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-700' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200'}`}
            aria-label="Close"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="prose prose-stone prose-lg max-w-none">
          {section.content}
        </div>
      </div>
    </div>
  );
};

export default Modal;