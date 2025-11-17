
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
    <section className="py-20 bg-[#14232e]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-white">Ce que tu peux commencer à transformer en cheminant avec moi</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="text-center p-6">
              <div className="w-16 h-16 mx-auto text-brand-gold mb-4">{pillar.icon}</div>
              <h3 className="text-xl font-serif text-brand-beige mb-2">{pillar.title}</h3>
              <p className="text-brand-green-gray">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reassurance;
