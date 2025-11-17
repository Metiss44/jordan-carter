'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import EbookBenefits from './components/EbookBenefits';
import ForWhom from './components/ForWhom';
import Services from './components/Services';
import Reassurance from './components/Reassurance';
import HowItWorks from './components/HowItWorks';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-brand-blue text-brand-beige min-h-screen">
      <Header />
      <main>
        <Hero />
        
        {/* Quote Section */}
        <div className="text-center py-16 px-6 bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-blue relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <svg className="w-12 h-12 text-brand-gold/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl italic text-brand-beige leading-relaxed">
              Et si ton corps te murmurait ce dont ton âme a besoin ?
            </p>
          </div>
        </div>

        <About />
        <EbookBenefits />
        <ForWhom />
        <Services />
        <Reassurance />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer onLegalClick={() => setIsModalOpen(true)} />
      <LegalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
