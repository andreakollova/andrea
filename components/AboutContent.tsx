import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Lightbox from './Lightbox';

interface AboutContentProps {
  isEn: boolean;
  isDark: boolean;
}

const AboutContent = ({ isEn, isDark }: AboutContentProps) => {
  const [showFunFact, setShowFunFact] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <p className={`text-xl md:text-2xl font-light leading-relaxed ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
        {isEn
          ? "I’m Andrea Kollová, a full-stack developer specializing in modern web application development (frontend, backend)."
          : "Som Andrea Kollová, full-stack developerka špecializovaná na vývoj moderných webových aplikácií (frontend, backend)."}
      </p>
      <p className={`text-sm md:text-base font-light leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
        {isEn
          ? "I care about clean architecture, readable code, and thoughtful UI – because a solid backend with a confusing frontend (or the other way around) just doesn't cut it. I build systems that are reliable and scalable – where everything just works, without the user needing to think twice."
          : "Môj prístup k vývoju vychádza z presvedčenia, že čistý kód je rovnako dôležitý ako čistý dizajn. Snažím sa aby každá digitálna interakcia bola zámerná a plynulá."}
      </p>
      <button
        onClick={() => setShowFunFact(v => !v)}
        className={`flex items-center gap-3 text-xs tracking-widest uppercase border rounded-full px-4 py-2 transition-colors ${
          isDark
            ? 'text-stone-300 border-[#3a3a3a] hover:border-stone-400'
            : 'text-stone-500 border-stone-300 hover:border-stone-500'
        }`}
      >
        <span className={`flex items-center justify-center w-4 h-4 rounded-full border ${isDark ? 'border-stone-500' : 'border-stone-400'} transition-transform duration-300 ${showFunFact ? 'rotate-180' : ''}`}>
          <ChevronDown size={10} strokeWidth={2} />
        </span>
        {isEn ? 'View a fun fact' : 'Zaujímavosť'}
      </button>
      {showFunFact && (
        <div className={`fun-fact-enter rounded-xl p-4 flex gap-4 items-center ${isDark ? 'bg-[#212020]' : 'bg-stone-100'}`}>
          <img
            src="/andrea-kollova-hokej.jpg"
            alt="Andrea Kollová"
            className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <p className={`text-xs tracking-widest uppercase mb-2 ${isDark ? 'text-stone-400' : 'text-stone-400'}`}>
              {isEn ? 'Athlete Background' : 'Športová kariéra'}
            </p>
            <p className={`text-base font-light italic ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
              {isEn
                ? "During my studies, I actively competed at the international level as part of the Slovak national hockey team."
                : "Počas štúdia som aktívne súťažila na medzinárodnej úrovni ako členka slovenského národného hokejového tímu."}
            </p>
          </div>
        </div>
      )}
      {lightboxSrc && <Lightbox src={lightboxSrc} alt="Andrea Kollóvá" onClose={() => setLightboxSrc(null)} />}
    </div>
  );
};

export default AboutContent;
