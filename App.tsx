
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

export default function App(): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-brand-blue text-brand-beige min-h-screen font-sans antialiased">
      <Header />
      <main>
        <Hero />
        
        <div className="text-center py-16 px-6 bg-brand-blue">
          <p className="font-serif text-2xl md:text-3xl italic text-brand-beige">
            « Et si ton corps te murmurait ce dont ton âme a besoin ? »
          </p>
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
