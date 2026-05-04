import { useState } from 'react';

interface AboutContentProps {
  isEn: boolean;
  isDark: boolean;
}

const AboutContent = ({ isEn, isDark }: AboutContentProps) => {
  const [showFunFact, setShowFunFact] = useState(false);
  return (
    <div className="space-y-6">
      <p className="text-xl md:text-2xl font-light leading-relaxed">
        {isEn
          ? "I'm Andrea Kollová, a full-stack developer specializing in modern web application development (frontend, backend)."
          : "Som Andrea Kollová, full-stack developerka špecializovaná na vývoj moderných webových aplikácií (frontend, backend)."}
      </p>
      <p className={`text-base font-light leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
        {isEn
          ? "My approach to development is rooted in the belief that clean code is just as important as clean design. I strive to make every digital interaction feel intentional and seamless."
          : "Môj prístup k vývoju vychádza z presvedčenia, že čistý kód je rovnako dôležitý ako čistý dizajn. Snažím sa aby každá digitálna interakcia bola zámerná a plynulá."}
      </p>
      <button
        onClick={() => setShowFunFact(v => !v)}
        className={`flex items-center gap-3 text-xs tracking-widest uppercase border rounded-full px-4 py-2 transition-colors ${
          isDark
            ? 'text-stone-400 border-stone-600 hover:border-stone-400'
            : 'text-stone-500 border-stone-300 hover:border-stone-500'
        }`}
      >
        <span className="w-2 h-2 rounded-full inline-block bg-stone-400"></span>
        {isEn ? 'View a fun fact' : 'Zaujímavosť'}
      </button>
      {showFunFact && (
        <div className={`rounded-xl p-4 flex gap-4 items-center ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
          <img
            src="/andrea-kollova-hokej.jpg"
            alt="Andrea Kollová"
            className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <p className={`text-xs tracking-widest uppercase mb-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              {isEn ? 'Athlete Background' : 'Športová kariéra'}
            </p>
            <p className={`text-base font-light italic ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              {isEn
                ? "During my studies, I actively competed at the international level as part of the Slovak national hockey team."
                : "Počas štúdia som aktívne súťažila na medzinárodnej úrovni ako členka slovenského národného hokejového tímu."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutContent;
