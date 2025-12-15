import { SectionContent, Language } from './types';

export const GAME_CONFIG = {
  speed: 4, // Movement speed
  segmentSize: 12, // Visual thickness
  gridSize: 20, // Logical grid for turning
  colorSnake: '#a8a29e', // stone-400
  colorFood: '#78716c', // stone-500
  colorBackground: '#fafaf9', // stone-50
};

export const TRANSLATIONS = {
  en: {
    heroTitle: "I’m Andrea",
    heroSubtitle: "Full-Stack Developer",
    heroDesktop: "MOVE THE SNAKE TO EXPLORE",
    heroMobile: "TAP TO EXPLORE",
    menu: {
      about: "About",
      skills: "Skills",
      work: "Selected Work",
      experience: "Experience",
      contact: "Contact"
    }
  },
  sk: {
    heroTitle: "Som Andrea",
    heroSubtitle: "Full-Stack Developer",
    heroDesktop: "POHYBOM HADÍKA PRESKÚMAJ WEB",
    heroMobile: "KLIKNI PRE PRIESKUM",
    menu: {
      about: "O mne",
      skills: "Zručnosti",
      work: "Vybrané práce",
      experience: "Skúsenosti",
      contact: "Kontakt"
    }
  }
};

export const getPortfolioSections = (lang: Language): SectionContent[] => {
  const isEn = lang === 'en';

  return [
    {
      id: 'about',
      title: isEn ? 'About' : 'O mne',
      type: 'about',
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-stone-600">
            {isEn 
              ? "I’m Andrea, a full-stack developer focused on building modern, clear, and scalable digital experiences."
              : "Som Andrea, full-stack developerka zameraná na vývoj moderných webových aplikácií."}
          </p>
          <p className="text-lg font-light leading-relaxed text-stone-500">
            {isEn
              ? "I believe that code should be as clean as the design it powers. My approach blends technical precision with a minimalist aesthetic, ensuring that every interaction feels intentional."
              : "Pracujem tak, aby bol kód čistý, architektúra zmysluplná a používateľský zážitok prirodzený. Verím, že dobré riešenia sú tie, ktoré sú jednoduché na používanie aj na údržbu."}
          </p>
        </div>
      ),
    },
    {
      id: 'skills',
      title: isEn ? 'Skills' : 'Zručnosti',
      type: 'skills',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-light">
          <div>
            <h3 className="text-stone-400 uppercase tracking-widest text-sm mb-4">Frontend</h3>
            <ul className="space-y-2 text-lg text-stone-700">
              <li>HTML5 & CSS3</li>
              <li>TypeScript / JavaScript</li>
              <li>React & Next.js</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="text-stone-400 uppercase tracking-widest text-sm mb-4">
              {isEn ? "Backend & Tools" : "Backend a nástroje"}
            </h3>
            <ul className="space-y-2 text-lg text-stone-700">
              <li>Node.js & Express</li>
              <li>Python & Flask</li>
              <li>PostgreSQL</li>
              <li>DBeaver</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'work',
      title: isEn ? 'Selected Work' : 'Vybrané práce',
      type: 'work',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center grayscale opacity-80">
          <div className="p-4">
            <img 
              src="https://antiksolar.sk/cdn/shop/files/4324234_310x.png?v=1762264841" 
              alt="Antik Solar" 
              className="h-16 object-contain hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="p-4">
            <img 
              src="https://cdn.shopify.com/s/files/1/0804/4226/1839/files/54325342.png?v=1764569599" 
              alt="Drixton Studio" 
              className="h-12 object-contain hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="p-4">
            <img 
              src="https://sportqo.com/assets/brand_logo-93a425fd.png" 
              alt="Sportqo" 
              className="h-10 object-contain hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'experience',
      title: isEn ? 'Experience' : 'Skúsenosti',
      type: 'experience',
      content: (
        <div className="space-y-10 border-l border-stone-200 pl-6 md:pl-8 ml-2">
          <div className="relative">
            <span className="absolute -left-[37px] md:-left-[41px] top-2 w-3 h-3 rounded-full bg-stone-300"></span>
            <span className="block text-sm text-stone-400 tracking-widest mb-1">
              2022 — {isEn ? "PRESENT" : "SÚČASNOSŤ"}
            </span>
            <h3 className="text-xl font-medium text-stone-800">Full Stack Developer</h3>
            <p className="text-stone-500 mt-1">ANTIK Telecom</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[37px] md:-left-[41px] top-2 w-3 h-3 rounded-full bg-stone-200"></span>
            <span className="block text-sm text-stone-400 tracking-widest mb-1">
              2019 — {isEn ? "PRESENT" : "SÚČASNOSŤ"}
            </span>
            <h3 className="text-xl font-medium text-stone-800">Full Stack Developer</h3>
            <p className="text-stone-500 mt-1">DRIXTON Studio</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[37px] md:-left-[41px] top-2 w-3 h-3 rounded-full bg-stone-200"></span>
            <span className="block text-sm text-stone-400 tracking-widest mb-1">2017 — 2019</span>
            <h3 className="text-xl font-medium text-stone-800">Junior Developer</h3>
            <p className="text-stone-500 mt-1">Freelance</p>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: isEn ? 'Contact' : 'Kontakt',
      type: 'contact',
      content: (
        <div className="space-y-8">
          <p className="text-2xl font-light text-stone-800">
            {isEn ? "Let’s work together." : "Poďme spolupracovať."}
          </p>
          <div className="flex flex-col space-y-4 items-start">
            <a href="mailto:ahoj@andreakollova.sk" className="text-lg text-stone-500 hover:text-stone-800 transition-colors border-b border-transparent hover:border-stone-800 pb-1">
              ahoj@andreakollova.sk
            </a>
            <div className="pt-4 flex items-center gap-3">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
              <span className="text-stone-400 uppercase text-sm tracking-widest">
                {isEn ? "Available for work" : "Dostupná pre spoluprácu"}
              </span>
            </div>
          </div>
        </div>
      ),
    }
  ];
};