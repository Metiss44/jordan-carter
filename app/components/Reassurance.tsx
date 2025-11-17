'use client';

import React from 'react';
import { HeartIcon, ShieldCheckIcon, SunIcon, UserGroupIcon } from './Icons';

interface Pillar {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const pillars: Pillar[] = [
  { icon: <ShieldCheckIcon />, title: "Apaiser ton système nerveux", text: "en sortant du mode survie pour revenir dans une présence plus calme et stable." },
  { icon: <HeartIcon />, title: "Habiter ton corps à nouveau", text: "en apprenant à écouter ses signaux plutôt que les ignorer." },
  { icon: <UserGroupIcon />, title: "Honorer ce que tu traverses", text: "en déposant ce qui est là dans un espace sécurisant, sans jugement." },
  { icon: <SunIcon />, title: "Créer tes propres rituels", text: "pour continuer à prendre soin de toi entre les séances." },
];

const Reassurance: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#14232e] to-brand-blue relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white max-w-4xl mx-auto">
            Ce que tu peux commencer à transformer en cheminant avec moi
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.title} 
              className="text-center p-6 bg-white/5 rounded-lg border border-transparent hover:border-brand-gold/30 backdrop-blur-sm transition-all duration-300 group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto text-brand-gold mb-4 group-hover:scale-110 transition-transform">{pillar.icon}</div>
              <h3 className="text-xl font-serif text-brand-beige mb-2 group-hover:text-brand-gold transition-colors">{pillar.title}</h3>
              <p className="text-brand-green-gray leading-relaxed group-hover:text-brand-beige transition-colors">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reassurance;
