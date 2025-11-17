'use client';

import React from 'react';
import OptInForm from './OptInForm';

const FinalCTA: React.FC = () => {
  return (
    <section id="final-cta" className="py-20 bg-gradient-to-b from-[#14232e] to-brand-blue relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-radial from-brand-gold/5 to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-6 text-center flex flex-col items-center relative z-10">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4">
            Tu sens que ton corps te parle déjà ?
          </h2>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-brand-green-gray leading-relaxed">
            Laisse-moi t&apos;accompagner pour écouter ce qu&apos;il a à te dire. Commence par recevoir l&apos;e-book gratuit.
          </p>
        </div>
        <div id="contact" className="w-full max-w-md bg-white/5 p-8 rounded-lg border border-brand-gold/20 backdrop-blur-sm animate-slide-up">
          <OptInForm />
          <p className="text-xs text-brand-green-gray/70 mt-3">
            Je respecte ton rythme et ta confidentialité. Tu peux te désinscrire en un clic à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
