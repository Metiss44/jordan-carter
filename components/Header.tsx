
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-brand-blue bg-opacity-90 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#hero" className="flex items-center">
          <img src="https://cdn.the-body-healer.com/logo-thebodyhealer.webp" alt="The Body Healer Logo" className="h-10 w-auto" />
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-brand-beige hover:text-white transition-colors duration-300">À propos</a>
          <a href="#services" className="text-brand-beige hover:text-white transition-colors duration-300">Mes soins</a>
          <a href="#ebook" className="text-brand-beige hover:text-white transition-colors duration-300">L'e-book offert</a>
          <a href="#contact" className="text-brand-beige hover:text-white transition-colors duration-300">Me contacter</a>
        </nav>
        <a href="#final-cta" className="hidden md:inline-block bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-blue font-semibold py-2 px-5 rounded-full transition-all duration-300">
          Recevoir l’e-book
        </a>
        {/* Mobile menu could be added here if needed */}
      </div>
    </header>
  );
};

export default Header;
