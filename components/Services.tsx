
import React from 'react';

interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  { title: "Soins énergétiques", description: "Je travaille avec les énergies de ton corps pour relâcher les blocages, libérer les mémoires émotionnelles et apaiser les tensions. Tu restes habillé(e), confortablement installé(e)." },
  { title: "Atelier bien-être & conscience corporelle", description: "Je te guide dans des explorations douces du mouvement, de la respiration et de la présence au corps pour que tu puisses sentir ce qui se vit en toi." },
  { title: "Respiration consciente (Breathwork)", description: "Nous utilisons la respiration comme une porte d’entrée pour apaiser ton mental, réguler ton système nerveux et libérer ce qui a besoin de sortir." },
  { title: "Randonnées pieds nus (Grounding / Earthing)", description: "Je t’emmène marcher pieds nus au contact de la terre pour te reconnecter à la nature, retrouver de l’ancrage et sentir ce soutien sous tes pas." },
  { title: "Retraites méditatives", description: "Je propose des temps de retraite pour t’offrir un vrai espace de pause, de silence, de recentrage, seul(e) ou en petit groupe." },
  { title: "Accompagnements individuels", description: "Je crée avec toi un accompagnement sur-mesure, à ton rythme, en combinant les pratiques qui te conviennent le mieux." },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-brand-blue">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Comment je t’accompagne concrètement</h2>
          <p className="max-w-3xl mx-auto text-lg text-brand-green-gray">
            Je combine différentes pratiques pour t’aider à retrouver une connexion profonde à ton corps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-white/5 p-8 rounded-lg border border-transparent hover:border-brand-gold/50 transition-colors duration-300">
              <h3 className="text-2xl font-serif text-brand-beige mb-4">{service.title}</h3>
              <p className="text-brand-green-gray">{service.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-sm text-brand-green-gray/80">
          Certains soins peuvent inclure des éléments de massage relaxant, toujours dans le respect de tes limites et de ton consentement.
        </p>
      </div>
    </section>
  );
};

export default Services;
