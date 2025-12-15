import React, { useEffect, useState } from 'react';
import { SectionContent } from '../types';
import { X } from 'lucide-react';

interface ModalProps {
  section: SectionContent | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ section, onClose }) => {
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
        isVisible ? 'bg-stone-50/90 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`w-full max-w-2xl transform transition-all duration-700 delay-100 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex justify-between items-start mb-12 border-b border-stone-200 pb-4">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-800">
            {section.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-500 hover:text-stone-800 focus:outline-none"
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