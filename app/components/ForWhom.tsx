'use client';

import React from 'react';
import { CheckCircleIcon } from './Icons';

const ForWhom: React.FC = () => {
  return (
    <section id="for-whom" className="py-20 bg-gradient-to-b from-[#14232e] to-brand-blue relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4">
            Est-ce que je suis la bonne personne pour t&apos;accompagner ?
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-brand-green-gray mb-12 leading-relaxed">
            Je ne propose pas des solutions miracles, je t&apos;ouvre un espace pour que tu puisses te rencontrer autrement. Mon accompagnement s&apos;adresse particulièrement à toi si…
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          <div className="bg-white/5 p-8 rounded-lg border border-brand-gold/20 backdrop-blur-sm hover:border-brand-gold/40 transition-all duration-300 animate-slide-up">
            <h3 className="text-2xl md:text-3xl font-serif text-brand-gold mb-6">Tu te reconnais peut-être si…</h3>
            <ul className="space-y-4">
              <ListItem text="tu te sens souvent épuisé(e), tendu(e) ou à fleur de peau," />
              <ListItem text="tu as l'impression d'être coupé(e) de ton corps, de vivre surtout dans ta tête," />
              <ListItem text="tu as du mal à te poser, à ralentir, à respirer consciemment," />
              <ListItem text="tu sens que quelque chose doit changer, mais tu ne sais pas par où commencer." />
            </ul>
          </div>
          <div className="bg-white/5 p-8 rounded-lg border border-brand-gold/20 backdrop-blur-sm hover:border-brand-gold/40 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl md:text-3xl font-serif text-brand-gold mb-6">Tu aimerais…</h3>
            <ul className="space-y-4">
              <ListItem text="retrouver plus de calme intérieur," />
              <ListItem text="mieux comprendre tes émotions et tes réactions corporelles," />
              <ListItem text="renouer avec ton intuition," />
              <ListItem text="t'offrir un espace rien qu'à toi, où tu peux déposer ce que tu traverses." />
            </ul>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-r from-brand-gold/10 to-transparent p-6 rounded-lg border-l-4 border-brand-gold">
          <p className="text-center text-md md:text-lg text-brand-beige italic leading-relaxed">
            Tu n&apos;as pas besoin d&apos;avoir déjà pratiqué la méditation, le yoga ou les soins énergétiques : je t&apos;accompagne étape par étape.
          </p>
        </div>
      </div>
    </section>
  );
};

const ListItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start group">
    <CheckCircleIcon className="h-5 w-5 text-brand-gold mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
    <span className="text-brand-green-gray group-hover:text-white transition-colors">{text}</span>
  </li>
);

export default ForWhom;
