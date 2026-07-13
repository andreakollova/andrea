import AboutContent from './components/AboutContent';
import { SectionContent, Language } from './types';

export const GAME_CONFIG = {
  speed: 4, // Movement speed
  segmentSize: 12, // Visual thickness
  gridSize: 20, // Logical grid for turning
  colorSnake: '#959090', // stone-400
  colorFood:  '#6e6762', // stone-500
  colorBackground: '#fafaf9', // stone-50
};

export const TRANSLATIONS = {
  en: {
    heroTitle: "I'm Andrea",
    heroSubtitle: "Full-Stack Developer",
    heroDesktop: "MOVE THE SNAKE TO EXPLORE",
    heroMobile: "TAP TO EXPLORE",
    autoDesktop: "USE ARROW KEYS TO STEER",
    autoMobile: "TAP TO STEER",
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
    autoDesktop: "ŠÍPKAMI OVLÁDAJ HADÍKA",
    autoMobile: "ŤUKNI PRE OVLÁDANIE",
    menu: {
      about: "O mne",
      skills: "Zručnosti",
      work: "Vybrané práce",
      experience: "Skúsenosti",
      contact: "Kontakt"
    }
  }
};

export const getPortfolioSections = (lang: Language, isDark: boolean) => {
  const isEn = lang === 'en';

  return [
    {
      id: 'about',
      title: isEn ? 'About' : 'O mne',
      type: 'about',
      headerImage: '/andrea-kollova.jpg',
      content: (
        <AboutContent isEn={isEn} isDark={isDark} />
      ),
    },
    {
      id: 'skills',
      title: isEn ? 'Skills' : 'Zručnosti',
      type: 'skills',
      content: (() => {
        const iconClass = `w-5 h-5 flex-shrink-0 grayscale ${isDark ? 'invert opacity-70' : 'opacity-50'}`;
        const skillItems: [string, string][][] = [
          [
            ['HTML5 & CSS3',         'https://cdn.simpleicons.org/html5'],
            ['TypeScript / JavaScript', 'https://cdn.simpleicons.org/typescript'],
            ['React & Next.js',      'https://cdn.simpleicons.org/react'],
            ['Tailwind CSS',         'https://cdn.simpleicons.org/tailwindcss'],
          ],
          [
            ['Node.js & Express',    'https://cdn.simpleicons.org/nodedotjs'],
            ['Python & Flask',       'https://cdn.simpleicons.org/python'],
            ['PostgreSQL',           'https://cdn.simpleicons.org/postgresql'],
            ['DBeaver',              'https://cdn.simpleicons.org/dbeaver'],
          ],
        ];
        const headings = ['Frontend', isEn ? 'Backend & Tools' : 'Backend a nástroje'];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-light">
            {skillItems.map((group, gi) => (
              <div key={gi}>
                <h3 className={`uppercase tracking-widest text-sm mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {headings[gi]}
                </h3>
                <ul className={`space-y-3 text-lg ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
                  {group.map(([label, icon]) => (
                    <li key={label} className="flex items-center gap-3">
                      <img src={icon} alt={label} className={iconClass} />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })(),
    },
    {
      id: 'work',
      title: isEn ? 'Selected Work' : 'Vybrané práce',
      type: 'work',
      content: (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center grayscale ${isDark ? 'invert opacity-70' : 'opacity-80'}`}>
          <div className="p-4">
            <img
              src="https://www.antik.sk/cdn/shop/files/4324234_310x.png?v=1762264841"
              alt="Antik Telecom"
              className="h-16 object-contain hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="p-4">
            <img
              src="https://www.drixton.com/static/logo-keyboard.png"
              alt="Drixton Studio"
              className="h-12 object-contain hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="p-4">
            <img
              src="/woeva-logo.png"
              alt="Woeva"
              className={`h-20 object-contain hover:opacity-100 transition-opacity ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
            />
          </div>
          <div className="p-4">
            <img
              src={isDark ? '/logocoduy.png' : '/logocoduy-dark.png'}
              alt="Coduy"
              className={`h-16 object-contain hover:opacity-100 transition-opacity ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
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
        <div className={`space-y-10 border-l ${isDark ? 'border-[#2b2b2b]' : 'border-stone-200'} pl-6 md:pl-8 ml-2`}>
          <div className="relative">
            <span className={`absolute -left-[37px] md:-left-[41px] top-2 w-3 h-3 rounded-full ${isDark ? 'bg-[#3a3a3a]' : 'bg-stone-300'}`}></span>
            <span className={`block text-sm tracking-widest mb-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              2022 — {isEn ? "PRESENT" : "SÚČASNOSŤ"}
            </span>
            <h3 className={`text-xl font-medium ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>Full Stack Developer</h3>
            <p className={`mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>ANTIK Telecom</p>
          </div>
          <div className="relative">
            <span className={`absolute -left-[37px] md:-left-[41px] top-2 w-3 h-3 rounded-full ${isDark ? 'bg-[#2b2b2b]' : 'bg-stone-200'}`}></span>
            <span className={`block text-sm tracking-widest mb-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              2019 — {isEn ? "PRESENT" : "SÚČASNOSŤ"}
            </span>
            <h3 className={`text-xl font-medium ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>Full Stack Developer</h3>
            <p className={`mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>DRIXTON Studio (Co-founder)</p>
          </div>
          <div className="relative">
            <span className={`absolute -left-[37px] md:-left-[41px] top-2 w-3 h-3 rounded-full ${isDark ? 'bg-[#2b2b2b]' : 'bg-stone-200'}`}></span>
            <span className={`block text-sm tracking-widest mb-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>2017 — 2019</span>
            <h3 className={`text-xl font-medium ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>Junior Developer</h3>
            <p className={`mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Freelance</p>
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
          <p className={`text-2xl font-light ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
            {isEn ? "Let's work together." : "Poďme spolupracovať."}
          </p>
          <div className="flex flex-col space-y-6 items-start">
            <div className="flex items-center gap-4">
              <a href="mailto:kollova@drixton.com" target="_blank" rel="noopener noreferrer" className={`transition-opacity hover:opacity-100 ${isDark ? 'opacity-60' : 'opacity-50'}`} aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              <a href="https://www.drixton.com/" target="_blank" rel="noopener noreferrer" className={`transition-opacity hover:opacity-100 ${isDark ? 'opacity-60' : 'opacity-50'}`} aria-label="Web">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/andrea-kollov%C3%A1-318091289" target="_blank" rel="noopener noreferrer" className={`transition-opacity hover:opacity-100 ${isDark ? 'opacity-60' : 'opacity-50'}`} aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center gap-3">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
              <span className={`uppercase text-sm tracking-widest ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {isEn ? "Available for work" : "Dostupná pre spoluprácu"}
              </span>
            </div>
          </div>
        </div>
      ),
    }
  ];
};