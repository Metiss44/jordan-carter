'use client';

import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-blue to-brand-blue-light relative overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-12 animate-fade-in">
          Ce qui se passe quand tu laisses ton e-mail
        </h2>
        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-brand-gold/10 via-brand-gold/30 to-brand-gold/10 -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm hover:border-brand-gold/30 transition-all duration-300 group animate-slide-up">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-gold-light text-brand-blue rounded-full font-bold text-2xl mb-4 z-10 shadow-lg group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-xl md:text-2xl font-serif text-brand-beige mb-3 group-hover:text-brand-gold transition-colors">Tu remplis le formulaire</h3>
              <p className="text-brand-green-gray leading-relaxed group-hover:text-brand-beige transition-colors">Tu m&apos;indiques ton prénom et ton adresse e-mail dans le formulaire.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm hover:border-brand-gold/30 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-gold-light text-brand-blue rounded-full font-bold text-2xl mb-4 z-10 shadow-lg group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-xl md:text-2xl font-serif text-brand-beige mb-3 group-hover:text-brand-gold transition-colors">Tu reçois l&apos;e-book</h3>
              <p className="text-brand-green-gray leading-relaxed group-hover:text-brand-beige transition-colors">Je t&apos;envoie l&apos;e-book directement dans ta boîte mail, avec un premier message pour t&apos;expliquer comment en tirer le meilleur.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm hover:border-brand-gold/30 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-brand-gold to-brand-gold-light text-brand-blue rounded-full font-bold text-2xl mb-4 z-10 shadow-lg group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-xl md:text-2xl font-serif text-brand-beige mb-3 group-hover:text-brand-gold transition-colors">Tu peux aller plus loin</h3>
              <p className="text-brand-green-gray leading-relaxed group-hover:text-brand-beige transition-colors">Je t&apos;enverrai quelques e-mails pour t&apos;aider, et si tu le souhaites, tu pourras réserver un accompagnement individuel.</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <a
            href="#final-cta"
            className="inline-block bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-blue font-bold py-4 px-8 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-brand-gold/50"
          >
            Recevoir l&apos;e-book maintenant
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
