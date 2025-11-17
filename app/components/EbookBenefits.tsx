'use client';

import React from 'react';
import { BookOpenIcon, SparklesIcon, SunIcon, HeartIcon, HomeIcon } from './Icons';

const benefits = [
  { icon: <HeartIcon />, text: "Comment reconnaître les signaux que ton corps t'envoie quand quelque chose n'est plus aligné." },
  { icon: <SparklesIcon />, text: "Des exercices de respiration consciente (breathwork) pour calmer ton système nerveux." },
  { icon: <SunIcon />, text: "Un rituel de grounding / earthing pour t'ancrer grâce au contact avec la nature." },
  { icon: <BookOpenIcon />, text: "Des pratiques de présence au corps pour apaiser le mental et revenir à toi." },
  { icon: <HomeIcon />, text: "Des pistes pour créer ton propre espace sacré, même dans un quotidien chargé." },
];

const EbookBenefits: React.FC = () => {
  return (
    <section id="ebook" className="py-20 bg-brand-blue relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-light to-brand-blue opacity-50"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 animate-fade-in">
          Ce que tu trouveras dans l&apos;e-book que je t&apos;offre
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-brand-green-gray mb-12 leading-relaxed">
          J&apos;ai créé cet e-book comme une première porte d&apos;entrée vers mon univers. Tu vas y découvrir des clés simples pour commencer à te reconnecter à ton corps dès maintenant.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm transform hover:-translate-y-2 hover:border-brand-gold/50 transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-brand-gold w-10 h-10 mb-4 group-hover:scale-110 transition-transform">{benefit.icon}</div>
              <p className="text-brand-beige group-hover:text-white transition-colors">{benefit.text}</p>
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-1 flex items-center justify-center bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 p-6 rounded-lg border border-brand-gold/30 backdrop-blur-sm hover:border-brand-gold/60 transition-all duration-300 group">
            <a href="#contact" className="text-brand-gold text-lg text-center hover:text-brand-gold-light transition-colors flex flex-col items-center gap-2 group">
              <span className="group-hover:underline">Reçois ton e-book gratuitement en laissant ton e-mail.</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookBenefits;
