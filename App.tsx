import { useState, useCallback } from 'react';
import SnakeCanvas from './components/SnakeCanvas';
import Modal from './components/Modal';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import { getPortfolioSections } from './constants';
import { SectionContent, Language } from './types';

function App() {
  const [hasInteractionStarted, setHasInteractionStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionContent | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [language, setLanguage] = useState<Language>('en');

  const handleInteractionStart = useCallback(() => {
    if (!hasInteractionStarted) {
      setHasInteractionStarted(true);
    }
  }, [hasInteractionStarted]);

  const handleEat = useCallback(() => {
    const sections = getPortfolioSections(language);
    const sectionToShow = sections[sectionIndex];
    setCurrentSection(sectionToShow);
    setSectionIndex((prev) => (prev + 1) % sections.length);
  }, [sectionIndex, language]);

  const handleMenuHit = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setCurrentSection(null);
  }, []);

  // When closing the menu explicitly via X, we reset the experience
  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
    setHasInteractionStarted(false); // Reset Hero Text
    setResetKey((prev) => prev + 1); // Reset Snake
  }, []);

  const handleSelectSection = useCallback((id: string) => {
    const sections = getPortfolioSections(language);
    const section = sections.find((s) => s.id === id);
    if (section) {
      setCurrentSection(section);
      setHasInteractionStarted(true);
      setIsMenuOpen(false); // Close menu when a section is selected
    }
  }, [language]);

  return (
    <div className="relative w-full h-screen bg-stone-50 overflow-hidden">
      {/* Background/Game Layer */}
      <SnakeCanvas 
        isPaused={!!currentSection || isMenuOpen} 
        onEat={handleEat}
        onInteractionStart={handleInteractionStart}
        onMenuHit={handleMenuHit}
        resetKey={resetKey}
      />
      
      {/* Hero Text Layer */}
      <Hero hasStarted={hasInteractionStarted} language={language} />
      
      {/* Navigation Layer */}
      <Navigation 
        isOpen={isMenuOpen} 
        onClose={handleCloseMenu} 
        onSelectSection={handleSelectSection} 
        language={language}
        setLanguage={setLanguage}
      />

      {/* Content Modal Layer */}
      <Modal 
        section={currentSection} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default App;