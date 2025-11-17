
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-brand-blue">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">
          Ce qui se passe quand tu laisses ton e-mail
        </h2>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-gold/20 -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-gold text-brand-blue rounded-full font-bold text-xl mb-4 z-10">1</div>
              <h3 className="text-xl font-serif text-brand-beige mb-2">Tu remplis le formulaire</h3>
              <p className="text-brand-green-gray">Tu m’indiques ton prénom et ton adresse e-mail dans le formulaire.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-gold text-brand-blue rounded-full font-bold text-xl mb-4 z-10">2</div>
              <h3 className="text-xl font-serif text-brand-beige mb-2">Tu reçois l’e-book</h3>
              <p className="text-brand-green-gray">Je t’envoie l’e-book directement dans ta boîte mail, avec un premier message pour t’expliquer comment en tirer le meilleur.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-gold text-brand-blue rounded-full font-bold text-xl mb-4 z-10">3</div>
              <h3 className="text-xl font-serif text-brand-beige mb-2">Tu peux aller plus loin</h3>
              <p className="text-brand-green-gray">Je t’enverrai quelques e-mails pour t’aider, et si tu le souhaites, tu pourras réserver un accompagnement individuel.</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <a
            href="#final-cta"
            className="inline-block bg-brand-gold text-brand-blue font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Recevoir l’e-book maintenant
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
