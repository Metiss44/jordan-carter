'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-brand-blue/95 backdrop-blur-md shadow-2xl' 
          : 'bg-brand-blue/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-6 py-3 md:py-5 flex justify-between items-center max-w-7xl">
        <a href="#hero" className="flex items-center group">
          <div className="relative h-[60px] md:h-[72px] w-auto min-w-[175px] md:min-w-[210px]">
            <Image 
              src="https://cdn.the-body-healer.com/logo-thebodyhealer.webp" 
              alt="The Body Healer Logo" 
              width={210}
              height={72}
              className="h-[60px] md:h-[72px] w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#about" className="text-brand-beige hover:text-brand-gold transition-colors duration-300 relative group">
            À propos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#services" className="text-brand-beige hover:text-brand-gold transition-colors duration-300 relative group">
            Mes soins
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#ebook" className="text-brand-beige hover:text-brand-gold transition-colors duration-300 relative group">
            L&apos;e-book offert
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#contact" className="text-brand-beige hover:text-brand-gold transition-colors duration-300 relative group">
            Me contacter
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>
        <a 
          href="#final-cta" 
          className="hidden md:inline-block relative bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-blue font-semibold py-2 px-5 rounded-full transition-all duration-300 overflow-hidden group"
        >
          <span className="relative z-10">Recevoir l&apos;e-book</span>
          <span className="absolute inset-0 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-brand-gold focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-blue/98 backdrop-blur-lg border-t border-brand-gold/20">
          <nav className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <a 
              href="#about" 
              onClick={closeMobileMenu}
              className="text-brand-beige hover:text-brand-gold transition-colors duration-300 py-2"
            >
              À propos
            </a>
            <a 
              href="#services" 
              onClick={closeMobileMenu}
              className="text-brand-beige hover:text-brand-gold transition-colors duration-300 py-2"
            >
              Mes soins
            </a>
            <a 
              href="#ebook" 
              onClick={closeMobileMenu}
              className="text-brand-beige hover:text-brand-gold transition-colors duration-300 py-2"
            >
              L&apos;e-book offert
            </a>
            <a 
              href="#contact" 
              onClick={closeMobileMenu}
              className="text-brand-beige hover:text-brand-gold transition-colors duration-300 py-2"
            >
              Me contacter
            </a>
            <a 
              href="#final-cta" 
              onClick={closeMobileMenu}
              className="bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-blue font-semibold py-3 px-5 rounded-full transition-all duration-300 text-center"
            >
              Recevoir l&apos;e-book
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
